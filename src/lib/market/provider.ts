import "@tanstack/react-start/server-only";

import type {
  Candle,
  FiiDiiBundle,
  HistoricalRange,
  IndexBundle,
  IndexQuote,
  IndexSymbol,
  InstitutionalFlow,
  MarketStatus,
} from "./types";

/**
 * Abstraction over a market data provider.
 *
 * Concrete providers (Upstox, Yahoo, NSE public, mock for dev) implement this
 * interface. The server-only `service.ts` chooses which provider to use based
 * on environment configuration.
 */
export interface MarketDataProvider {
  /** Stable identifier — useful for logging and debugging. */
  readonly id: string;

  /** Human-readable label, surfaced in error UI when misconfigured. */
  readonly displayName: string;

  /** Live quote for a single index. */
  getIndexQuote(symbol: IndexSymbol): Promise<IndexQuote>;

  /** Historical candles for a single index across a range. */
  getHistoricalCandles(symbol: IndexSymbol, range: HistoricalRange): Promise<Candle[]>;

  /** Bundle of live quote + matching candles for a single index. */
  getIndexBundle(symbol: IndexSymbol, range: HistoricalRange): Promise<IndexBundle>;

  /** FII and DII cash daily net flows. */
  getFiiDii(): Promise<FiiDiiBundle>;

  /** Current market open/closed status. */
  getMarketStatus(): Promise<MarketStatus>;
}

/** Helper for the FII/DII "latest" computation shared across providers. */
export function pickLatestFlow(flows: InstitutionalFlow[]): InstitutionalFlow | undefined {
  if (flows.length === 0) return undefined;
  // Series are expected to be sorted ascending by date, but defend anyway.
  return flows.reduce((latest, current) => (current.date > latest.date ? current : latest));
}

/**
 * Thrown by providers when they're unreachable, return errors from the
 * upstream API, or return payloads that are missing required fields.
 * `server.ts` catches this class to surface a clear "configure your
 * provider" message instead of leaking the underlying error.
 */
export class MarketConfigError extends Error {
  readonly kind = "config" as const;
  constructor(message: string) {
    super(message);
    this.name = "MarketConfigError";
  }
}
