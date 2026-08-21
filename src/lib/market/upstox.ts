import "@tanstack/react-start/server-only";
// (TanStack Start bundles `createServerFn` as the only thing the client sees;
// this module is only reached on the server via the RPC bridge.)

import { getServerEnv, getServerEnvAny } from "./env";
import type {
  Candle,
  FiiDiiBundle,
  HistoricalRange,
  InstitutionalFlow,
  MarketStatus,
} from "./types";
import type { IndexBundle, IndexQuote, IndexSymbol } from "./types";
import { MarketConfigError, pickLatestFlow, type MarketDataProvider } from "./provider";

/**
 * Upstox v2 market data provider.
 *
 * Auth: uses a bearer access token supplied via the
 * `MARKET_ACCESS_TOKEN` (or `UPSTOX_ACCESS_TOKEN`) environment variable.
 * This module is server-only — the token never reaches the browser.
 *
 * Notes:
 *   • Upstox does NOT expose a public FII/DII endpoint. That data has to be
 *     served via `MARKET_FII_DII_URL` (a JSON URL the operator hosts) or, in
 *     its absence, returns an empty bundle so the UI degrades gracefully.
 *   • Upstox also does not publish a market-status endpoint, so the status
 *     is computed from the NSE calendar (Mon–Fri, 09:15–15:30 IST) when
 *     the provider cannot fetch one.
 */

const UPSTOX_BASE = "https://api.upstox.com/v2";

const SYMBOL_INSTRUMENT: Record<IndexSymbol, { key: string; name: string }> = {
  NIFTY: { key: "NSE_INDEX|Nifty 50", name: "NIFTY 50" },
  SENSEX: { key: "BSE_INDEX|SENSEX", name: "BSE SENSEX" },
};

type UpstoxQuoteResponse = {
  data: Record<
    string,
    {
      ohlc?: { close?: number };
      depth?: { ohlc?: { close?: number } };
      last_price?: number;
      timestamp?: string;
    }
  >;
};

type UpstoxCandleResponse = {
  data: {
    candles: [string, number, number, number, number, number][];
  };
};

type UpstoxStatus = "OPEN" | "CLOSED" | "PRE_OPEN" | string;

type UpstoxMarketStatusResponse = {
  data: {
    marketStatus: { segment: string; status: UpstoxStatus }[];
  };
};

type UpstoxRange = {
  /** Upstox unit. */
  unit: "minutes" | "hours" | "days" | "weeks" | "months";
  /** Number of units to look back. */
  count: number;
  /** Granularity. */
  interval: string;
};

function rangeFor(range: HistoricalRange): UpstoxRange {
  switch (range) {
    case "1D":
      return { unit: "minutes", count: 1, interval: "5" };
    case "1W":
      return { unit: "days", count: 7, interval: "60" };
    case "1M":
      return { unit: "days", count: 31, interval: "1" };
    case "3M":
      return { unit: "days", count: 95, interval: "1" };
    case "1Y":
      return { unit: "weeks", count: 53, interval: "1" };
  }
}

function getAccessToken(): string | undefined {
  const token = getServerEnvAny("MARKET_ACCESS_TOKEN", "UPSTOX_ACCESS_TOKEN");
  return token && token.length > 0 ? token : undefined;
}

async function upstoxFetch<T>(
  path: string,
  params: Record<string, string | number>,
): Promise<T | null> {
  const token = getAccessToken();
  if (!token) {
    return null;
  }

  const url = new URL(`${UPSTOX_BASE}${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    // Cache per request — TanStack Start + Nitro reuse it.
    // The server route itself wraps the call with a short stale time.
  });

  if (!response.ok) {
    // Don't throw — we want callers to be able to fall back gracefully.
    return null;
  }

  return (await response.json()) as T;
}

export class UpstoxMarketDataProvider implements MarketDataProvider {
  readonly id = "upstox";
  readonly displayName = "Upstox";

  isConfigured(): boolean {
    return Boolean(getAccessToken());
  }

  async getIndexQuote(symbol: IndexSymbol): Promise<IndexQuote> {
    const { key, name } = SYMBOL_INSTRUMENT[symbol];
    const data = await upstoxFetch<UpstoxQuoteResponse>("/market-quote/ltp", {
      instrument_key: key,
    });

    if (!data) {
      throw new MarketConfigError("Upstox access token missing or quote request failed");
    }

    const entry = data.data[key];
    if (!entry) {
      throw new MarketConfigError(`Upstox returned no quote for ${symbol}`);
    }

    const last = entry.last_price;
    const previousClose = entry.ohlc?.close ?? entry.depth?.ohlc?.close;
    if (typeof last !== "number" || typeof previousClose !== "number") {
      throw new MarketConfigError(`Upstox returned incomplete data for ${symbol}`);
    }

    const change = last - previousClose;
    const changePercent = previousClose === 0 ? 0 : (change / previousClose) * 100;

    return {
      symbol,
      name,
      value: last,
      previousClose,
      change,
      changePercent,
      timestamp: entry.timestamp ?? new Date().toISOString(),
    };
  }

  async getHistoricalCandles(symbol: IndexSymbol, range: HistoricalRange): Promise<Candle[]> {
    const { key } = SYMBOL_INSTRUMENT[symbol];
    const { unit, count, interval } = rangeFor(range);

    const data = await upstoxFetch<UpstoxCandleResponse>(
      "/historical-candle/" + encodeURIComponent(key),
      { unit, interval, to_date: nowIstDate(), count },
    );

    if (!data) {
      throw new MarketConfigError(
        "Upstox access token missing or historical-candle request failed",
      );
    }

    return (data.data.candles ?? []).map((row) => {
      const [ts, open, high, low, close, volume] = row;
      return {
        timestamp: ts,
        open,
        high,
        low,
        close,
        ...(typeof volume === "number" ? { volume } : {}),
      };
    });
  }

  async getIndexBundle(symbol: IndexSymbol, range: HistoricalRange): Promise<IndexBundle> {
    const [quote, candles] = await Promise.all([
      this.getIndexQuote(symbol),
      this.getHistoricalCandles(symbol, range),
    ]);
    return { quote, candles, range };
  }

  async getFiiDii(): Promise<FiiDiiBundle> {
    const url = getServerEnv("MARKET_FII_DII_URL");
    if (!url) {
      return { fii: [], dii: [], fiiLatest: 0, diiLatest: 0 };
    }

    try {
      const response = await fetch(url, { headers: { Accept: "application/json" } });
      if (!response.ok) {
        return { fii: [], dii: [], fiiLatest: 0, diiLatest: 0 };
      }
      const payload = (await response.json()) as {
        fii?: InstitutionalFlow[];
        dii?: InstitutionalFlow[];
      };
      const fii = Array.isArray(payload.fii) ? payload.fii : [];
      const dii = Array.isArray(payload.dii) ? payload.dii : [];
      const latest = pickLatestFlow(fii)?.date ?? pickLatestFlow(dii)?.date;
      const base: FiiDiiBundle = {
        fii,
        dii,
        fiiLatest: pickLatestFlow(fii)?.value ?? 0,
        diiLatest: pickLatestFlow(dii)?.value ?? 0,
      };
      return latest ? { ...base, latestDate: latest } : base;
    } catch {
      return { fii: [], dii: [], fiiLatest: 0, diiLatest: 0 };
    }
  }

  async getMarketStatus(): Promise<MarketStatus> {
    const data = await upstoxFetch<UpstoxMarketStatusResponse>("/market-status/NSE", {});
    if (data) {
      const nse = data.data.marketStatus.find((s) => s.segment === "NSE_EQ");
      const isOpen = nse?.status === "OPEN";
      return {
        isOpen,
        message: isOpen ? "Trading session in progress" : "Market closed",
        timestamp: new Date().toISOString(),
      };
    }

    // Fallback: derive from the wall clock in IST.
    const now = new Date();
    const ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const day = ist.getDay(); // 0=Sun, 6=Sat
    const minutes = ist.getHours() * 60 + ist.getMinutes();
    const weekday = day >= 1 && day <= 5;
    const inSession = minutes >= 9 * 60 + 15 && minutes < 15 * 60 + 30;
    const isOpen = weekday && inSession;
    return {
      isOpen,
      message: isOpen ? "Trading session in progress" : "Market closed",
      timestamp: now.toISOString(),
    };
  }
}

/** YYYY-MM-DD in IST for `to_date` filters. */
function nowIstDate(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function createUpstoxProvider(): UpstoxMarketDataProvider {
  return new UpstoxMarketDataProvider();
}
