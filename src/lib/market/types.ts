/**
 * Provider-agnostic market data types.
 *
 * The frontend never talks to the upstream market API directly. It only
 * consumes these normalised shapes via the `MarketDataService`, which in
 * turn delegates to a pluggable `MarketDataProvider` running on the server.
 */

export type IndexSymbol = "NIFTY" | "SENSEX";

export type IndexQuote = {
  symbol: IndexSymbol;
  name: string;
  value: number;
  previousClose: number;
  change: number;
  changePercent: number;
  /** ISO-8601 timestamp in IST from the provider, if available. */
  timestamp: string;
};

export type Candle = {
  /** ISO-8601 timestamp. */
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};

export type HistoricalRange = "1D" | "1W" | "1M" | "3M" | "1Y";

export type CandleInterval = "1m" | "5m" | "15m" | "1h" | "1d" | "1wk" | "1mo";

export type InstitutionalFlow = {
  /** ISO-8601 date (yyyy-mm-dd). */
  date: string;
  /** Net value in crores (positive = inflow, negative = outflow). */
  value: number;
};

export type MarketStatus = {
  /** Whether the market is currently open for trading. */
  isOpen: boolean;
  /** Short human-readable reason, e.g. "Trading session in progress" or "Market closed for the day". */
  message?: string;
  /** ISO-8601 timestamp the status was last updated. */
  timestamp: string;
};

export type IndexBundle = {
  quote: IndexQuote;
  candles: Candle[];
  range: HistoricalRange;
  /**
   * Set to true by the noop provider when no upstream data source is
   * configured. The UI uses this flag to render a clear "configure your
   * provider" message instead of an empty/silent dashboard.
   */
  notConfigured?: boolean;
};

export type FiiDiiBundle = {
  fii: InstitutionalFlow[];
  dii: InstitutionalFlow[];
  /** Latest FII net value in crores (0 if no data). */
  fiiLatest: number;
  /** Latest DII net value in crores (0 if no data). */
  diiLatest: number;
  /** Latest available date across both series. */
  latestDate?: string;
  /** Mirrors `IndexBundle.notConfigured` for the FII/DII series. */
  notConfigured?: boolean;
};

/** Lightweight metadata about the configured provider — used by the UI
 *  to label mock data and surface provider identity. */
export type ProviderMeta = {
  id: string;
  displayName: string;
  /** True for the synthetic mock provider. UI must render a visible
   *  "(mock data)" banner when this is set. */
  isMock: boolean;
};
