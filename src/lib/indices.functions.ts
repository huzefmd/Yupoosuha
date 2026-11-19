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

export type SeriesPoint = { t: number; v: number };

const YAHOO: Record<string, string> = {
  "NIFTY 50": "^NSEI",
  SENSEX: "^BSESN",
  "BANK NIFTY": "^NSEBANK",
  "RELIANCE": "RELIANCE.NS",
  "TCS": "TCS.NS",
  "HDFC BANK": "HDFCBANK.NS",
  "INFOSYS": "INFY.NS",
  "ICICI BANK": "ICICIBANK.NS",
  "HINDUSTAN UNILEVER": "HINDUNILVR.NS",
  "SBI": "SBIN.NS",
  "BHARTI AIRTEL": "BHARTIARTL.NS",
  "ITC": "ITC.NS",
  "L&T": "LT.NS",
  "KOTAK BANK": "KOTAKBANK.NS",
  "AXIS BANK": "AXISBANK.NS",
};

// Extra tabs (kept separate so the stock search list is not affected)
const EXTRA_YAHOO: Record<string, string> = {
  CRUDEOIL: "CL=F", // WTI crude, USD per barrel (use "BZ=F" for Brent)
  US10Y: "^TNX", // US 10Y yield in %
  GOLD: "GC=F", // COMEX gold, USD per troy ounce (converted to INR below)
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

export const getAvailableSymbols = createServerFn({ method: "GET" }).handler(async () => {
  return Object.keys(YAHOO);
});

export const getMarketIndices = createServerFn({ method: "GET" }).handler(async () => {
  const names = ["NIFTY 50", "SENSEX", "BANK NIFTY"];
  const nse = await fromNse();
  const quotes = await Promise.all(names.map(async (n) => nse[n] ?? (await fromYahoo(n))));
  return {
    quotes: quotes.filter((q): q is IndexQuote => q !== null),
    fetchedAt: new Date().toISOString(),
  };
});

export type FlowPoint = {
  date: string;
  day: string;
  value: number;
};

export type FlowData = {
  fii: FlowPoint[];
  dii: FlowPoint[];
};

function parseFlowValue(value: unknown): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, "").trim());
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function normalizeFlowDate(value: unknown): string {
  if (typeof value !== "string") return "";

  const raw = value.trim();

  // Handle YYYY-MM-DD or YYYY/MM/DD
  const match = raw.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (match) {
    const [, year, month, day] = match;
    return `${year}-${month!.padStart(2, "0")}-${day!.padStart(2, "0")}`;
  }

  // Handle DD-MM-YYYY or DD/MM/YYYY
  const alternate = raw.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (alternate) {
    const [, day, month, year] = alternate;
    return `${year}-${month!.padStart(2, "0")}-${day!.padStart(2, "0")}`;
  }

  // Handle DD-MMM-YYYY (e.g., 05-Oct-2023)
  const alphaMatch = raw.match(/^(\d{1,2})[-/]([a-zA-Z]{3})[-/](\d{4})$/);
  if (alphaMatch) {
    const [, day, monthStr, year] = alphaMatch;
    const months: Record<string, string> = {
      Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
      Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
    };
    const key = monthStr!.charAt(0).toUpperCase() + monthStr!.slice(1).toLowerCase();
    const month = months[key] || "01";
    return `${year}-${month}-${day!.padStart(2, "0")}`;
  }

  return "";
}

export const getFlowData = createServerFn({
  method: "GET",
}).handler(async (): Promise<FlowData> => {
  try {
    // Using Mr. Chartist API as it is highly reliable for Indian FII/DII data
    const res = await fetch("https://fii-diidata.mrchartist.com/api/history-full", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://fii-diidata.mrchartist.com/",
        "Origin": "https://fii-diidata.mrchartist.com",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
      },
    });

    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }

    const data = await res.json();

    // The API returns an array of daily records
    // Actual format from API: { d: "DD-MMM-YYYY", fn: value, dn: value, ... }
    // fn = FII Net, dn = DII Net
    const rows = Array.isArray(data) ? data : [];

    // The API data is already sorted by date descending.
    // Take the most recent 5 days.
    const recentData = rows.slice(0, 5).reverse(); // Convert to chronological order

    return {
      fii: recentData.map((row: any) => ({
        date: normalizeFlowDate(row.d),
        day: row.d ? row.d.slice(0, 2) : "01",
        value: parseFlowValue(row.fn),
      })),
      dii: recentData.map((row: any) => ({
        date: normalizeFlowDate(row.d),
        day: row.d ? row.d.slice(0, 2) : "01",
        value: parseFlowValue(row.dn),
      })),
    };
  } catch (error) {
    console.error("Failed to fetch FII/DII data from Mr. Chartist:", error);
    return {
      fii: [],
      dii: [],
    };
  }
});

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

// Live USD -> INR rate (used to show gold in rupees)
async function getUsdInr(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://query1.finance.yahoo.com/v8/finance/chart/USDINR%3DX?range=1d&interval=5m",
      { headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" } },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as {
      chart?: { result?: Array<{ meta?: Record<string, unknown> }> };
    };
    const price = json.chart?.result?.[0]?.meta?.["regularMarketPrice"];
    return typeof price === "number" ? price : null;
  } catch {
    return null;
  }
}

export const getIndexSeries = createServerFn({ method: "GET" })
  .validator((data: { name: string; range: string }) => data)
  .handler(async ({ data }): Promise<IndexSeries | null> => {
    const symbol = YAHOO[data.name] ?? EXTRA_YAHOO[data.name];
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
        (typeof meta["chartPreviousClose"] === "number"
          ? (meta["chartPreviousClose"] as number)
          : undefined) ??
        (typeof meta["previousClose"] === "number"
          ? (meta["previousClose"] as number)
          : undefined) ??
        points[0]?.v ??
        last;

      const result: IndexSeries = {
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

      // Friendly names for the extra tabs
      if (data.name === "CRUDEOIL") result.name = "Crude Oil WTI (USD/barrel)";
      if (data.name === "US10Y") result.name = "US 10Y Treasury Yield";

      // Convert gold from USD per ounce to INR per 10 grams
      if (data.name === "GOLD") {
        const fx = await getUsdInr();
        if (!fx) return null; // better to show "unavailable" than a wrong price
        const k = (fx / 31.1035) * 10;
        result.name = "Gold (INR per 10 g)";
        result.last *= k;
        result.change *= k;
        result.previousClose *= k;
        result.points = result.points.map((p) => ({ t: p.t, v: p.v * k }));
        result.source = "Yahoo Finance (COMEX gold x USD/INR)";
      }

      return result;
    } catch {
      return null;
    }
  });