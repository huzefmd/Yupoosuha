import { useState } from "react";
import { Link } from "@tanstack/react-router";

import { IndexTabs } from "./IndexTabs";
import { IndexQuoteCard } from "./IndexQuote";
import { MarketChart } from "./MarketChart";
import { TimeRangeSelector } from "./TimeRangeSelector";
import { InstitutionalFlow } from "./InstitutionalFlow";
import { MarketError } from "./MarketError";
import { MarketSkeleton } from "./MarketSkeleton";
import { MarketStatusBadge, MarketStatusFooter } from "./MarketStatus";
import { ProviderBanner } from "./ProviderBanner";
import { useFiiDii, useIndexBundle, useMarketStatus, useProviderMeta } from "@/lib/market/hooks";
import type { HistoricalRange, IndexSymbol } from "@/lib/market/types";

/**
 * Reusable market dashboard. The home page uses the compact view; the
 * `/indices` page passes `variant="detailed"` to show the full chart and
 * time-range controls.
 */
export function IndicesSection({ variant = "compact" }: { variant?: "compact" | "detailed" }) {
  const [active, setActive] = useState<IndexSymbol>("NIFTY");
  const [range, setRange] = useState<HistoricalRange>("1D");

  const bundle = useIndexBundle(active, range);
  const status = useMarketStatus();
  const flows = useFiiDii();
  const providerMeta = useProviderMeta();

  const loading = bundle.isLoading || status.isLoading;
  const error = bundle.error || status.error;
  const notConfigured = bundle.data?.notConfigured === true;

  return (
    <section
      aria-labelledby="indices-heading"
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 id="indices-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">
          Indices
        </h2>
        <Link to="/indices" className="text-base font-medium text-primary hover:underline">
          View All
        </Link>
      </div>

      <ProviderBanner meta={providerMeta.data} />

      <div className="rounded-3xl border border-border bg-card shadow-card">
        <div className="p-5 sm:p-7">
          {error ? (
            <MarketError
              message={error instanceof Error ? error.message : "Please try again in a moment."}
              onRetry={() => {
                bundle.refetch();
                status.refetch();
                flows.refetch();
              }}
            />
          ) : loading && !bundle.data ? (
            <MarketSkeleton />
          ) : notConfigured ? (
            <MarketError
              message="Market data is currently unavailable. This app shows synthetic mock data only — please refresh to retry."
              onRetry={() => {
                bundle.refetch();
                status.refetch();
                flows.refetch();
              }}
            />
          ) : (
            <div
              role="tabpanel"
              id={`index-panel-${active}`}
              aria-labelledby={`index-tab-${active}`}
            >
              <IndexTabs active={active} onChange={setActive} />

              <div className="grid gap-6 pt-6 lg:grid-cols-2 lg:items-center">
                <IndexQuoteCard quote={bundle.data?.quote} />
                <div className="flex flex-col gap-3">
                  {variant === "detailed" && (
                    <div className="flex justify-end">
                      <TimeRangeSelector value={range} onChange={setRange} />
                    </div>
                  )}
                  <MarketChart
                    candles={bundle.data?.candles ?? []}
                    range={range}
                    positive={
                      (bundle.data?.candles?.[0]?.close ?? 0) <=
                      (bundle.data?.candles?.[bundle.data.candles.length - 1]?.close ?? 0)
                    }
                    height={variant === "detailed" ? 320 : 160}
                  />
                  {variant === "compact" && (
                    <div className="flex justify-end">
                      <TimeRangeSelector value={range} onChange={setRange} />
                    </div>
                  )}
                </div>
              </div>

              <div className="my-6 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-border pt-5">
                <MarketStatusBadge status={status.data} />
                <MarketStatusFooter status={status.data} />
              </div>

              <InstitutionalFlow bundle={flows.data} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
