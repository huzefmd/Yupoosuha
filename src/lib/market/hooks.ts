import { useQuery } from "@tanstack/react-query";

import {
  getFiiDii,
  getIndexBundle,
  getMarketStatus,
  getProviderMeta,
  QUOTE_STALE_MS,
} from "./server";
import type {
  FiiDiiBundle,
  HistoricalRange,
  IndexBundle,
  IndexSymbol,
  MarketStatus,
  ProviderMeta,
} from "./types";

/**
 * Hooks exposed to UI components.
 *
 * Each hook maps to a single server function and uses React Query to
 * deduplicate, cache and (for live quotes) poll on a sensible cadence.
 *
 * Historical data is cached for several minutes; live quotes refresh
 * every QUOTE_STALE_MS (15s) when the tab is visible.
 */

export function useIndexBundle(symbol: IndexSymbol, range: HistoricalRange) {
  return useQuery<IndexBundle>({
    queryKey: ["market", "index-bundle", symbol, range],
    queryFn: () => getIndexBundle({ data: { symbol, range } }),
    staleTime: QUOTE_STALE_MS,
    refetchInterval: QUOTE_STALE_MS,
    refetchOnWindowFocus: true,
  });
}

export function useMarketStatus() {
  return useQuery<MarketStatus>({
    queryKey: ["market", "status"],
    queryFn: () => getMarketStatus(),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

export function useFiiDii() {
  return useQuery<FiiDiiBundle>({
    queryKey: ["market", "fii-dii"],
    queryFn: () => getFiiDii(),
    staleTime: 60 * 60_000,
    refetchInterval: 60 * 60_000,
  });
}

export function useProviderMeta() {
  return useQuery<ProviderMeta>({
    queryKey: ["market", "provider-meta"],
    queryFn: () => getProviderMeta(),
    staleTime: 5 * 60_000,
  });
}
