import "@tanstack/react-start/server-only";

import { createUpstoxProvider } from "./upstox";
import { createFinnhubProvider } from "./finnhub";
import { NoopMarketDataProvider } from "./no-op";
import { createMockProvider } from "./mock";
import type { MarketDataProvider } from "./provider";
import type {
  Candle,
  FiiDiiBundle,
  HistoricalRange,
  IndexBundle,
  IndexQuote,
  IndexSymbol,
  MarketStatus,
} from "./types";

/**
 * Server-side market data service. Picks a provider based on environment
 * variables and caches the instance across calls.
 *
 * Pick order:
 *   1. `MARKET_PROVIDER=mock`    → MockMarketDataProvider (dev only, synthetic data)
 *   2. `MARKET_PROVIDER=finnhub` + `FINNHUB_API_KEY` set → Finnhub provider
 *   3. `MARKET_PROVIDER=upstox` (default) + `MARKET_ACCESS_TOKEN` set → Upstox provider
 *   4. Otherwise                  → Noop provider (returns sentinel bundles)
 */

let cached: MarketDataProvider | undefined;

function resolveProvider(): MarketDataProvider {
  if (cached) return cached;

  const desired = (process.env["MARKET_PROVIDER"] ?? "upstox").toLowerCase();

  if (desired === "mock") {
    cached = createMockProvider();
    return cached;
  }

  if (desired === "finnhub") {
    const provider = createFinnhubProvider();
    if (provider.isConfigured()) {
      cached = provider;
      return provider;
    }
  }

  if (desired === "upstox") {
    const provider = createUpstoxProvider();
    if (provider.isConfigured()) {
      cached = provider;
      return provider;
    }
  }

  cached = new NoopMarketDataProvider();
  return cached;
}

export class MarketDataService {
  private readonly provider: MarketDataProvider;

  constructor(provider?: MarketDataProvider) {
    this.provider = provider ?? resolveProvider();
  }

  get providerId(): string {
    return this.provider.id;
  }

  get providerName(): string {
    return this.provider.displayName;
  }

  getIndexQuote(symbol: IndexSymbol): Promise<IndexQuote> {
    return this.provider.getIndexQuote(symbol);
  }

  getHistoricalCandles(symbol: IndexSymbol, range: HistoricalRange): Promise<Candle[]> {
    return this.provider.getHistoricalCandles(symbol, range);
  }

  getIndexBundle(symbol: IndexSymbol, range: HistoricalRange): Promise<IndexBundle> {
    return this.provider.getIndexBundle(symbol, range);
  }

  getFiiDii(): Promise<FiiDiiBundle> {
    return this.provider.getFiiDii();
  }

  getMarketStatus(): Promise<MarketStatus> {
    return this.provider.getMarketStatus();
  }
}

/** Test/seed hook — lets tests inject a fake provider. */
export function __setMarketProvider(provider: MarketDataProvider | undefined): void {
  cached = provider;
}
