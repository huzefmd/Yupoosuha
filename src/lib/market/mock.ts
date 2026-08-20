import "@tanstack/react-start/server-only";

import type {
  Candle,
  FiiDiiBundle,
  HistoricalRange,
  InstitutionalFlow,
  MarketStatus,
} from "./types";
import type { IndexBundle, IndexQuote, IndexSymbol } from "./types";
import { pickLatestFlow, type MarketDataProvider } from "./provider";
import { hashSeed, seededRandom } from "@/lib/mock/deterministic";

/**
 * Mock market data provider.
 *
 * - Enabled ONLY when `MARKET_PROVIDER=mock` is set in the server env.
 * - All values are clearly synthetic and labelled "(mock)" in the UI
 *   (see `IndexQuoteCard` / `IndicesSection`) so they can never be
 *   mistaken for real market data.
 * - Sequences are deterministic (seeded by symbol + day) so the dashboard
 *   does not flicker between SSR and client hydration.
 *
 * DO NOT enable this in production. It exists so the UI can be reviewed
 * end-to-end without a real broker API.
 */

const SYMBOL_BASE: Record<IndexSymbol, { name: string; base: number; volatility: number }> = {
  NIFTY: { name: "NIFTY 50", base: 24_350, volatility: 0.0035 },
  SENSEX: { name: "BSE SENSEX", base: 79_400, volatility: 0.003 },
};

const RANGE_DAYS: Record<HistoricalRange, number> = {
  "1D": 1,
  "1W": 7,
  "1M": 31,
  "3M": 95,
  "1Y": 365,
};

const RANGE_INTERVAL_MIN: Record<HistoricalRange, number> = {
  "1D": 5,
  "1W": 60,
  "1M": 24 * 60,
  "3M": 24 * 60,
  "1Y": 24 * 60 * 7,
};

function dayKeyIST(d: Date): string {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = fmt.formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function startOfDayIST(d: Date): Date {
  const [y, m, day] = dayKeyIST(d).split("-").map(Number);
  // 00:00 IST = 18:30 UTC the previous day (DST-free zone).
  const utc = new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, day ?? 1, -5, -30));
  return utc;
}

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}

function generateCandles(
  symbol: IndexSymbol,
  range: HistoricalRange,
): {
  candles: Candle[];
  lastClose: number;
  previousClose: number;
} {
  const { base, volatility } = SYMBOL_BASE[symbol];
  const now = new Date();
  const intervalMin = RANGE_INTERVAL_MIN[range];
  const totalMinutes = RANGE_DAYS[range] * 24 * 60;
  const count = Math.max(20, Math.min(500, Math.floor(totalMinutes / intervalMin)));

  const seed = hashSeed(`${symbol}:${dayKeyIST(now)}:${range}`);
  const rand = seededRandom(seed);

  // Walk forward from a slightly different starting price each run-day.
  let price = base * (0.99 + rand() * 0.02);

  const candles: Candle[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const ts = new Date(now.getTime() - i * intervalMin * 60_000);
    const drift = (rand() - 0.5) * volatility * 2;
    const open = price;
    const close = Math.max(1, price * (1 + drift));
    const high = Math.max(open, close) * (1 + rand() * volatility * 0.5);
    const low = Math.min(open, close) * (1 - rand() * volatility * 0.5);
    candles.push({
      timestamp: ts.toISOString(),
      open: roundTo(open, symbol === "NIFTY" ? 0.05 : 0.1),
      high: roundTo(high, symbol === "NIFTY" ? 0.05 : 0.1),
      low: roundTo(low, symbol === "NIFTY" ? 0.05 : 0.1),
      close: roundTo(close, symbol === "NIFTY" ? 0.05 : 0.1),
      ...(range === "1D" ? { volume: Math.floor(50_000 + rand() * 200_000) } : {}),
    });
    price = close;
  }

  const lastClose = candles[candles.length - 1]?.close ?? base;
  // Use the close of the candle before the last full session as "previous close".
  const previousClose =
    candles.length >= 2 ? (candles[candles.length - 2]?.close ?? lastClose) : lastClose;

  return { candles, lastClose, previousClose };
}

function generateFiiDii(): FiiDiiBundle {
  const now = new Date();
  const rand = seededRandom(hashSeed(`fii-dii:${dayKeyIST(now)}`));
  const fii: InstitutionalFlow[] = [];
  const dii: InstitutionalFlow[] = [];

  for (let i = 14; i >= 0; i--) {
    const d = new Date(startOfDayIST(now).getTime() - i * 24 * 60 * 60_000);
    const key = dayKeyIST(d);
    const fiiValue = roundTo((rand() - 0.45) * 2000, 0.01);
    const diiValue = roundTo((rand() - 0.5) * 2500, 0.01);
    fii.push({ date: key, value: fiiValue });
    dii.push({ date: key, value: diiValue });
  }

  return {
    fii,
    dii,
    fiiLatest: pickLatestFlow(fii)?.value ?? 0,
    diiLatest: pickLatestFlow(dii)?.value ?? 0,
  };
}

function marketStatusIST(): MarketStatus {
  const ist = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const day = ist.getDay();
  const minutes = ist.getHours() * 60 + ist.getMinutes();
  const weekday = day >= 1 && day <= 5;
  const inSession = minutes >= 9 * 60 + 15 && minutes < 15 * 60 + 30;
  const isOpen = weekday && inSession;
  return {
    isOpen,
    message: isOpen ? "Trading session in progress (mock)" : "Market closed (mock)",
    timestamp: new Date().toISOString(),
  };
}

export class MockMarketDataProvider implements MarketDataProvider {
  readonly id = "mock";
  readonly displayName = "Mock data (development only)";

  isMock(): true {
    return true;
  }

  async getIndexQuote(symbol: IndexSymbol): Promise<IndexQuote> {
    const { name } = SYMBOL_BASE[symbol];
    const { lastClose, previousClose } = generateCandles(symbol, "1D");
    const change = lastClose - previousClose;
    const changePercent = previousClose === 0 ? 0 : (change / previousClose) * 100;
    return {
      symbol,
      name: `${name} (mock)`,
      value: lastClose,
      previousClose,
      change,
      changePercent,
      timestamp: new Date().toISOString(),
    };
  }

  async getHistoricalCandles(symbol: IndexSymbol, range: HistoricalRange): Promise<Candle[]> {
    return generateCandles(symbol, range).candles;
  }

  async getIndexBundle(symbol: IndexSymbol, range: HistoricalRange): Promise<IndexBundle> {
    const [quote, candles] = await Promise.all([
      this.getIndexQuote(symbol),
      this.getHistoricalCandles(symbol, range),
    ]);
    return { quote, candles, range };
  }

  async getFiiDii(): Promise<FiiDiiBundle> {
    return generateFiiDii();
  }

  async getMarketStatus(): Promise<MarketStatus> {
    return marketStatusIST();
  }
}

export function createMockProvider(): MockMarketDataProvider {
  return new MockMarketDataProvider();
}
