import "@tanstack/react-start/server-only";

import { getServerEnv } from "./env";
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
 * Finnhub market data provider.
 *
 * Auth: bearer-style API key supplied via `FINNHUB_API_KEY` env var.
 * This module is server-only — the key never reaches the browser bundle.
 *
 * Endpoint: https://finnhub.io/api/v1
 *
 * Notes:
 *   • Coverage: Finnhub's free tier lists a handful of Indian indices
 *     (`NSE:NIFTY`, `BSE:SENSEX`) but support depends on the account
 *     plan. If your plan doesn't cover them, calls return 403/404 and
 *     we surface that as a `MarketConfigError`.
 *   • Rate limit: ~60 req/min on the free tier. We add a minimal
 *     in-process token-bucket throttle so a multi-symbol dashboard
 *     doesn't blow past it.
 *   • Historical candles use Finnhub's `resolution`/`from`/`to` query
 *     params. We translate `HistoricalRange` into the corresponding
 *     look-back window and pick a sensible resolution per range.
 *   • Finnhub does NOT publish FII/DII cash flows, so we fall back to
 *     the same `MARKET_FII_DII_URL` JSON source the Upstox provider
 *     uses. If unset, the FII/DII panel renders empty (not an error).
 */

const FINNHUB_BASE = "https://finnhub.io/api/v1";

const SYMBOL_CONFIG: Record<IndexSymbol, { ticker: string; name: string }> = {
  NIFTY: { ticker: "NSE:NIFTY", name: "NIFTY 50" },
  SENSEX: { ticker: "BSE:SENSEX", name: "BSE SENSEX" },
};

type FinnhubQuote = {
  c: number; // current price
  d?: number; // change
  dp?: number; // change percent
  h?: number; // high price of the day
  l?: number; // low price of the day
  o?: number; // open price of the day
  pc?: number; // previous close
  t?: number; // unix timestamp (seconds)
};

type FinnhubCandles = {
  c?: number[];
  h?: number[];
  l?: number[];
  o?: number[];
  v?: number[];
  t?: number[];
  s: "ok" | "no_data";
};

type FinnhubResolution = "1" | "5" | "15" | "30" | "60" | "D" | "W" | "M";

/** Look-back window + resolution per `HistoricalRange`. */
function rangeFor(range: HistoricalRange): {
  resolution: FinnhubResolution;
  /** Seconds to look back from now. */
  lookbackSeconds: number;
} {
  const day = 24 * 60 * 60;
  switch (range) {
    case "1D":
      return { resolution: "5", lookbackSeconds: day };
    case "1W":
      return { resolution: "60", lookbackSeconds: 7 * day };
    case "1M":
      return { resolution: "D", lookbackSeconds: 31 * day };
    case "3M":
      return { resolution: "D", lookbackSeconds: 95 * day };
    case "1Y":
      return { resolution: "W", lookbackSeconds: 370 * day };
  }
}

function getApiKey(): string | undefined {
  const key = getServerEnv("FINNHUB_API_KEY");
  return key && key.length > 0 ? key : undefined;
}

function getErrorMessage(status: number, body: string): string {
  // Finnhub error bodies are usually plain text. Trim and scrub tokens
  // defensively so a leaked API key in the response can't slip into
  // server error messages.
  const trimmed = body.trim().slice(0, 200);
  return `Finnhub responded ${status}: ${scrubTokens(trimmed)}`;
}

function scrubTokens(input: string): string {
  return input.replace(/[A-Za-z0-9_-]{20,}/g, "[redacted]");
}

/**
 * Minimal token-bucket throttle: ≤1 request / 1100ms across all
 * callers in this process. Finnhub free tier is 60 req/min, so this
 * keeps us comfortably under it even with multiple symbols polling.
 */
let lastRequestAt = 0;
const MIN_INTERVAL_MS = 1100;
async function throttle(): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastRequestAt;
  if (elapsed < MIN_INTERVAL_MS) {
    await new Promise((resolve) => setTimeout(resolve, MIN_INTERVAL_MS - elapsed));
  }
  lastRequestAt = Date.now();
}

async function finnhubFetch<T>(path: string, params: Record<string, string | number>): Promise<T> {
  const key = getApiKey();
  if (!key) {
    throw new MarketConfigError("FINNHUB_API_KEY is not set");
  }

  await throttle();

  const url = new URL(`${FINNHUB_BASE}${path}`);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v));
  }
  url.searchParams.set("token", key);

  // 10s hard cap so a hung Finnhub connection can't pin the request forever.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  let response: Response;
  try {
    response = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === "AbortError") {
      throw new MarketConfigError("Finnhub request timed out after 10s");
    }
    throw err;
  }
  clearTimeout(timeout);

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new MarketConfigError(getErrorMessage(response.status, body));
  }

  return (await response.json()) as T;
}

export class FinnhubMarketDataProvider implements MarketDataProvider {
  readonly id = "finnhub";
  readonly displayName = "Finnhub";

  isConfigured(): boolean {
    return Boolean(getApiKey());
  }

  async getIndexQuote(symbol: IndexSymbol): Promise<IndexQuote> {
    const { ticker, name } = SYMBOL_CONFIG[symbol];
    const data = await finnhubFetch<FinnhubQuote>("/quote", {
      symbol: ticker,
    });

    const last = data.c;
    const previousClose = data.pc;
    if (typeof last !== "number" || typeof previousClose !== "number") {
      throw new MarketConfigError(
        `Finnhub returned no quote for ${symbol} (coverage may not be on your plan)`,
      );
    }

    const change = last - previousClose;
    const changePercent = previousClose === 0 ? 0 : (change / previousClose) * 100;
    const ts = typeof data.t === "number" ? data.t * 1000 : Date.now();

    return {
      symbol,
      name,
      value: last,
      previousClose,
      change,
      changePercent,
      timestamp: new Date(ts).toISOString(),
    };
  }

  async getHistoricalCandles(symbol: IndexSymbol, range: HistoricalRange): Promise<Candle[]> {
    const { ticker } = SYMBOL_CONFIG[symbol];
    const { resolution, lookbackSeconds } = rangeFor(range);

    const to = Math.floor(Date.now() / 1000);
    const from = to - lookbackSeconds;

    const data = await finnhubFetch<FinnhubCandles>("/stock/candle", {
      symbol: ticker,
      resolution,
      from,
      to,
    });

    if (data.s !== "ok" || !Array.isArray(data.t)) {
      throw new MarketConfigError(
        `Finnhub returned no candles for ${symbol} at resolution ${resolution}`,
      );
    }

    const candles: Candle[] = [];
    for (let i = 0; i < data.t.length; i++) {
      const ts = data.t[i] ?? 0;
      candles.push({
        timestamp: new Date(ts * 1000).toISOString(),
        open: data.o?.[i] ?? 0,
        high: data.h?.[i] ?? 0,
        low: data.l?.[i] ?? 0,
        close: data.c?.[i] ?? 0,
        ...(typeof data.v?.[i] === "number" ? { volume: data.v[i] } : {}),
      });
    }
    return candles;
  }

  async getIndexBundle(symbol: IndexSymbol, range: HistoricalRange): Promise<IndexBundle> {
    const [quote, candles] = await Promise.all([
      this.getIndexQuote(symbol),
      this.getHistoricalCandles(symbol, range),
    ]);
    return { quote, candles, range };
  }

  async getFiiDii(): Promise<FiiDiiBundle> {
    // Finnhub doesn't expose FII/DII. Reuse the JSON URL the Upstox
    // provider uses so a single source can serve both providers.
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
    // Finnhub has no market-status endpoint for Indian indices. Use the
    // NSE calendar (Mon–Fri, 09:15–15:30 IST) — same fallback as
    // Upstox — so the UI's open/closed indicator stays meaningful.
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

export function createFinnhubProvider(): FinnhubMarketDataProvider {
  return new FinnhubMarketDataProvider();
}
