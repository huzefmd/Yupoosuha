import { createServerFn } from "@tanstack/react-start";

import { MarketDataService, type MarketProviderDiagnostic } from "./service";
import { MarketConfigError } from "./provider";
import type {
  FiiDiiBundle,
  HistoricalRange,
  IndexBundle,
  IndexSymbol,
  MarketStatus,
  ProviderMeta,
} from "./types";

/**
 * Server functions the frontend calls. They never expose the underlying
 * provider — only the normalised shapes. Credentials live in env vars
 * that are NOT exposed to the browser (no `VITE_` prefix).
 */

const QUOTE_STALE_MS = 15_000; // refresh quote every 15s
const HISTORICAL_STALE_MS = 5 * 60_000; // history is cacheable for 5 min
const FII_DII_STALE_MS = 60 * 60_000; // daily FII/DII rolls once a day
const STATUS_STALE_MS = 30_000;

const quoteCache = new Map<IndexSymbol, { value: IndexBundle; ts: number }>();
let statusCacheEntry: { value: MarketStatus; ts: number } | undefined;
let fiiDiiCache: { value: FiiDiiBundle; ts: number } | undefined;

function handleError(error: unknown): never {
  if (error instanceof MarketConfigError) {
    throw new Error("Market data provider is not configured. " + error.message);
  }
  if (error instanceof Error) {
    // Strip any token-like substrings defensively before re-throwing.
    throw new Error(scrubTokens(error.message));
  }
  throw new Error("Unknown market data error");
}

function scrubTokens(input: string): string {
  return input.replace(/[A-Za-z0-9_-]{24,}/g, "[redacted]");
}

export const getIndexBundle = createServerFn({ method: "GET" })
  .validator((data: { symbol: IndexSymbol; range: HistoricalRange }) => data)
  .handler(async ({ data }): Promise<IndexBundle> => {
    try {
      const key = data.symbol;
      const now = Date.now();
      const cached = quoteCache.get(key);
      if (cached && cached.value.range === data.range && now - cached.ts < HISTORICAL_STALE_MS) {
        return cached.value;
      }
      const service = new MarketDataService();
      const bundle = await service.getIndexBundle(data.symbol, data.range);
      quoteCache.set(key, { value: bundle, ts: now });
      return bundle;
    } catch (error) {
      handleError(error);
    }
  });

export const getMarketStatus = createServerFn({ method: "GET" }).handler(
  async (): Promise<MarketStatus> => {
    try {
      const now = Date.now();
      if (statusCacheEntry && now - statusCacheEntry.ts < STATUS_STALE_MS) {
        return statusCacheEntry.value;
      }
      const service = new MarketDataService();
      const status = await service.getMarketStatus();
      statusCacheEntry = { value: status, ts: now };
      return status;
    } catch (error) {
      handleError(error);
    }
  },
);

export const getFiiDii = createServerFn({ method: "GET" }).handler(
  async (): Promise<FiiDiiBundle> => {
    try {
      const now = Date.now();
      if (fiiDiiCache && now - fiiDiiCache.ts < FII_DII_STALE_MS) {
        return fiiDiiCache.value;
      }
      const service = new MarketDataService();
      const bundle = await service.getFiiDii();
      fiiDiiCache = { value: bundle, ts: now };
      return bundle;
    } catch (error) {
      handleError(error);
    }
  },
);

export const getProviderMeta = createServerFn({ method: "GET" }).handler(
  async (): Promise<ProviderMeta> => {
    const service = new MarketDataService();
    return {
      id: service.providerId,
      displayName: service.providerName,
      isMock: service.providerId === "mock",
    };
  },
);

/**
 * Server-only diagnostic snapshot — used to confirm at runtime that the
 * deployed Worker can see the configured provider, without ever revealing
 * the access token itself. Safe to expose to authenticated operators; do
 * NOT surface this verbatim to anonymous users in a future UI change.
 */
export const getProviderDiagnostic = createServerFn({ method: "GET" }).handler(
  async (): Promise<MarketProviderDiagnostic> => {
    const service = new MarketDataService();
    return service.providerDiagnostic;
  },
);

export { QUOTE_STALE_MS };
