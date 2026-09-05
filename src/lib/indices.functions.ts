import { createServerFn } from "@tanstack/react-start";

export type IndexQuote = {
  name: string;
  last: number;
  change: number;
  percentChange: number;
  previousClose: number;
  source: string;
  updatedAt: string;
};

const YAHOO: Record<string, string> = {
  "NIFTY 50": "^NSEI",
  SENSEX: "^BSESN",
  "BANK NIFTY": "^NSEBANK",
};

async function fromYahoo(name: string): Promise<IndexQuote | null> {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(YAHOO[name]!)}?range=1d&interval=5m`,
      { headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" } },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as {
      chart?: { result?: Array<{ meta?: Record<string, number> }> };
    };
    const meta = json.chart?.result?.[0]?.meta;
    if (!meta || typeof meta["regularMarketPrice"] !== "number") return null;
    const last = meta["regularMarketPrice"];
    const prev = meta["chartPreviousClose"] ?? meta["previousClose"] ?? last;
    return {
      name,
      last,
      change: last - prev,
      percentChange: prev ? ((last - prev) / prev) * 100 : 0,
      previousClose: prev,
      source: "Yahoo Finance",
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

async function fromNse(): Promise<Record<string, IndexQuote>> {
  const out: Record<string, IndexQuote> = {};
  try {
    const res = await fetch("https://www.nseindia.com/api/allIndices", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.nseindia.com/",
      },
    });
    if (!res.ok) return out;
    const json = (await res.json()) as {
      data?: Array<{
        index: string;
        last: number;
        variation: number;
        percentChange: number;
        previousClose: number;
      }>;
    };
    const map: Record<string, string> = { "NIFTY 50": "NIFTY 50", "NIFTY BANK": "BANK NIFTY" };
    for (const row of json.data ?? []) {
      const name = map[row.index];
      if (!name) continue;
      out[name] = {
        name,
        last: row.last,
        change: row.variation,
        percentChange: row.percentChange,
        previousClose: row.previousClose,
        source: "NSE India",
        updatedAt: new Date().toISOString(),
      };
    }
  } catch {
    /* fall back to Yahoo */
  }
  return out;
}

export const getMarketIndices = createServerFn({ method: "GET" }).handler(async () => {
  const names = ["NIFTY 50", "SENSEX", "BANK NIFTY"];
  const nse = await fromNse();
  const quotes = await Promise.all(
    names.map(async (n) => nse[n] ?? (await fromYahoo(n))),
  );
  return {
    quotes: quotes.filter((q): q is IndexQuote => q !== null),
    fetchedAt: new Date().toISOString(),
  };
});

export type SeriesPoint = { t: number; v: number };

export type IndexSeries = {
  name: string;
  range: string;
  points: SeriesPoint[];
  last: number;
  change: number;
  percentChange: number;
  previousClose: number;
  marketOpen: boolean;
  updatedAt: string;
  source: string;
};

const RANGES: Record<string, { range: string; interval: string }> = {
  "1D": { range: "1d", interval: "5m" },
  "1W": { range: "5d", interval: "15m" },
  "1M": { range: "1mo", interval: "1d" },
  "3M": { range: "3mo", interval: "1d" },
  "1Y": { range: "1y", interval: "1d" },
};

export const getIndexSeries = createServerFn({ method: "GET" })
  .inputValidator((data: { name: string; range: string }) => data)
  .handler(async ({ data }): Promise<IndexSeries | null> => {
    const symbol = YAHOO[data.name];
    const cfg = RANGES[data.range] ?? RANGES["1D"]!;
    if (!symbol) return null;
    try {
      const res = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${cfg.range}&interval=${cfg.interval}`,
        { headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" } },
      );
      if (!res.ok) return null;
      const json = (await res.json()) as {
        chart?: {
          result?: Array<{
            meta?: Record<string, unknown>;
            timestamp?: number[];
            indicators?: { quote?: Array<{ close?: Array<number | null> }> };
          }>;
        };
      };
      const r = json.chart?.result?.[0];
      const meta = r?.meta ?? {};
      const closes = r?.indicators?.quote?.[0]?.close ?? [];
      const stamps = r?.timestamp ?? [];
      const points: SeriesPoint[] = [];
      for (let i = 0; i < stamps.length; i++) {
        const v = closes[i];
        if (typeof v === "number" && Number.isFinite(v)) points.push({ t: stamps[i]! * 1000, v });
      }
      const last =
        typeof meta["regularMarketPrice"] === "number"
          ? (meta["regularMarketPrice"] as number)
          : (points[points.length - 1]?.v ?? 0);
      const prev =
        (typeof meta["chartPreviousClose"] === "number" ? (meta["chartPreviousClose"] as number) : undefined) ??
        (typeof meta["previousClose"] === "number" ? (meta["previousClose"] as number) : undefined) ??
        (points[0]?.v ?? last);
      return {
        name: data.name,
        range: data.range,
        points,
        last,
        change: last - prev,
        percentChange: prev ? ((last - prev) / prev) * 100 : 0,
        previousClose: prev,
        marketOpen: meta["marketState"] === "REGULAR",
        updatedAt: new Date().toISOString(),
        source: "Yahoo Finance",
      };
    } catch {
      return null;
    }
  });
