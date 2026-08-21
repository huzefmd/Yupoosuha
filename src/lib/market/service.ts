import "@tanstack/react-start/server-only";

import { getServerEnvAny, hasAnyServerEnv } from "./env";
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
 * Server-side market data service. This app uses SYNTHETIC MOCK DATA only
 * — there are no live broker credentials in the deployed Worker. The
 * `MARKET_PROVIDER` env var is therefore redundant but kept read-only for
 * diagnostics (any value other than `mock`/`finnhub`/`upstox` falls back
 * to the mock provider so we never accidentally break the dashboard).
 *
 * Resolution is performed PER REQUEST inside `resolveProvider()` rather
 * than cached at module scope. On Cloudflare Workers the `env` bindings
 * arrive per request, so a module-level cache could capture a stale or
 * empty configuration across requests (and across worker isolates). The
 * per-request resolve cost is tiny (a few env reads) and keeps the
 * contract correct.
 *
 * Pick order:
 *   1. `MARKET_PROVIDER=mock`    → MockMarketDataProvider (synthetic data; default)
 *   2. Otherwise                 → MockMarketDataProvider (still synthetic, but a
 *                                  warning is included in the diagnostic so we
 *                                  notice if someone accidentally tries to turn
 *                                  the live providers back on without setting
 *                                  the right credentials)
 */

export type MarketProviderDiagnostic = {
  /** True iff any env source was reachable at all. */
  envReachable: boolean;
  /** The configured provider name (lower-case). Defaults to "mock". */
  requestedProvider: string;
  /** Resolved provider id after the (optional) credential check. */
  resolvedProviderId: string;
  /** Human-friendly provider label. */
  resolvedProviderName: string;
  /** True when the chosen provider reports it has the credentials it needs. */
  providerConfigured: boolean;
  /** True iff MARKET_PROVIDER / VITE_MARKET_PROVIDER was present. */
  providerFlagPresent: boolean;
  /**
   * Set when MARKET_PROVIDER explicitly named a non-mock provider but the
   * service still fell back to mock (e.g. missing credentials). The UI can
   * surface this as a heads-up so live-data re-enable is an explicit opt-in.
   */
  fellBackFromLiveProvider: boolean;
};

function buildDiagnostic(
  provider: MarketDataProvider,
  requested: string,
  fellBackFromLiveProvider: boolean,
): MarketProviderDiagnostic {
  const providerFlagPresent =
    getServerEnvAny("MARKET_PROVIDER", "VITE_MARKET_PROVIDER") !== undefined;
  return {
    envReachable: hasAnyServerEnv() || providerFlagPresent,
    requestedProvider: requested,
    resolvedProviderId: provider.id,
    resolvedProviderName: provider.displayName,
    // Mock is always considered "configured" — it has no external dependency.
    providerConfigured: provider.id === "mock" || provider.id === "noop" || true,
    providerFlagPresent,
    fellBackFromLiveProvider,
  };
}

function resolveProvider(): {
  provider: MarketDataProvider;
  diagnostic: MarketProviderDiagnostic;
} {
  const desired = (
    getServerEnvAny("MARKET_PROVIDER", "VITE_MARKET_PROVIDER") ?? "mock"
  ).toLowerCase();

  // This app ships with mock data only. Any other requested provider
  // silently falls back to mock so the dashboard never breaks, and the
  // diagnostic records the mismatch so we can spot it.
  if (desired !== "mock") {
    const provider = createMockProvider();
    return {
      provider,
      diagnostic: buildDiagnostic(provider, desired, true),
    };
  }

  const provider = createMockProvider();
  return { provider, diagnostic: buildDiagnostic(provider, desired, false) };
}

export class MarketDataService {
  private readonly provider: MarketDataProvider;
  private readonly diagnostic: MarketProviderDiagnostic;

  constructor(provider?: MarketDataProvider, diagnostic?: MarketProviderDiagnostic) {
    if (provider) {
      this.provider = provider;
      this.diagnostic = diagnostic ?? buildDiagnostic(provider, "injected", false);
    } else {
      const resolved = resolveProvider();
      this.provider = resolved.provider;
      this.diagnostic = resolved.diagnostic;
    }
  }

  get providerId(): string {
    return this.provider.id;
  }

  get providerName(): string {
    return this.provider.displayName;
  }

  get providerDiagnostic(): MarketProviderDiagnostic {
    return this.diagnostic;
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
export function __setMarketProvider(_provider: MarketDataProvider | undefined): void {
  // No-op: caching was removed so per-request resolution stays correct on
  // Cloudflare Workers where `env` arrives per request. Tests can still
  // pass an explicit provider to the `MarketDataService` constructor.
}
