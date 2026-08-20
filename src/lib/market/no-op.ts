import "@tanstack/react-start/server-only";

import type {
  Candle,
  FiiDiiBundle,
  HistoricalRange,
  IndexBundle,
  IndexQuote,
  IndexSymbol,
  MarketStatus,
} from "./types";
import type { MarketDataProvider } from "./provider";

/**
 * Provider used when no real market data source is configured.
 *
 * IMPORTANT: This provider does NOT throw. It returns sentinel
 * "not configured" bundles so the dashboard can render its chrome and
 * show a clear "set MARKET_PROVIDER" banner instead of a silent empty
 * state. Throwing made the client fall through to a `loading=false,
 * data=undefined, error=undefined` render path, which produced a
 * half-rendered card with no explanation.
 */

const UNCONFIGURED_QUOTE: IndexQuote = {
  symbol: "NIFTY",
  name: "Not configured",
  value: Number.NaN,
  previousClose: Number.NaN,
  change: Number.NaN,
  changePercent: Number.NaN,
  timestamp: new Date(0).toISOString(),
};

const EMPTY_FII_DII: FiiDiiBundle = {
  fii: [],
  dii: [],
  fiiLatest: 0,
  diiLatest: 0,
  notConfigured: true,
};

export class NoopMarketDataProvider implements MarketDataProvider {
  readonly id = "noop";
  readonly displayName = "Not configured";

  async getIndexQuote(symbol: IndexSymbol): Promise<IndexQuote> {
    return { ...UNCONFIGURED_QUOTE, symbol };
  }

  async getHistoricalCandles(_symbol: IndexSymbol, _range: HistoricalRange): Promise<Candle[]> {
    return [];
  }

  async getIndexBundle(symbol: IndexSymbol, range: HistoricalRange): Promise<IndexBundle> {
    return {
      quote: await this.getIndexQuote(symbol),
      candles: [],
      range,
      notConfigured: true,
    };
  }

  async getFiiDii(): Promise<FiiDiiBundle> {
    return EMPTY_FII_DII;
  }

  async getMarketStatus(): Promise<MarketStatus> {
    return {
      isOpen: false,
      message: "Market data provider not configured",
      timestamp: new Date().toISOString(),
    };
  }
}
