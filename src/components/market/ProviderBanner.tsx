import { AlertTriangle, FlaskConical } from "lucide-react";

import type { ProviderMeta } from "@/lib/market/types";

/**
 * Banner that tells the user which market-data provider is active and
 * whether the data is real. Visible whenever the active provider is
 * anything other than a fully-configured real source.
 */
export function ProviderBanner({ meta }: { meta: ProviderMeta | undefined }) {
  if (!meta) return null;

  if (meta.isMock) {
    return (
      <div
        role="status"
        className="mb-3 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-300"
      >
        <FlaskConical className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          Showing synthetic mock data ({meta.displayName}). Set{" "}
          <code className="rounded bg-amber-500/20 px-1 py-0.5">MARKET_PROVIDER=upstox</code> and
          provide <code className="rounded bg-amber-500/20 px-1 py-0.5">MARKET_ACCESS_TOKEN</code>{" "}
          to display live market data.
        </span>
      </div>
    );
  }

  if (meta.id === "noop") {
    return (
      <div
        role="status"
        className="mb-3 flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-xs font-medium text-blue-700 dark:text-blue-300"
      >
        <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          No market-data provider is configured. To populate this dashboard with sample data, run{" "}
          <code className="rounded bg-blue-500/20 px-1 py-0.5">
            MARKET_PROVIDER=mock npm run dev
          </code>
          . For live data, set{" "}
          <code className="rounded bg-blue-500/20 px-1 py-0.5">MARKET_PROVIDER=upstox</code> and{" "}
          <code className="rounded bg-blue-500/20 px-1 py-0.5">MARKET_ACCESS_TOKEN</code> in your
          environment.
        </span>
      </div>
    );
  }

  return null;
}
