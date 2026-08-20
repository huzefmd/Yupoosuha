import { useState } from "react";

import { formatCrores, formatDateIST, formatDay } from "@/lib/market/format";
import type { FiiDiiBundle, InstitutionalFlow } from "@/lib/market/types";

type Side = "FII" | "DII";

const TABS: { value: Side; label: string }[] = [
  { value: "FII", label: "FII Cash" },
  { value: "DII", label: "DII Cash" },
];

export function InstitutionalFlow({
  bundle,
  className,
}: {
  bundle: FiiDiiBundle | undefined;
  className?: string;
}) {
  const [active, setActive] = useState<Side>("FII");
  const series: InstitutionalFlow[] = active === "FII" ? (bundle?.fii ?? []) : (bundle?.dii ?? []);
  const latest = series[series.length - 1];

  return (
    <div className={className}>
      {/* Side Tabs */}
      <div role="tablist" aria-label="Institutional flow" className="flex gap-6">
        {TABS.map((t) => {
          const selected = t.value === active;
          return (
            <button
              key={t.value}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(t.value)}
              className={
                "relative pb-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm " +
                (selected ? "text-foreground" : "text-muted-foreground hover:text-foreground")
              }
            >
              {t.label}
              {selected && (
                <span className="absolute bottom-[-1px] left-0 h-[2px] w-full rounded-full bg-foreground" />
              )}
            </button>
          );
        })}
      </div>

      {/* Headline */}
      <div className="mt-3">
        <p
          className={
            "text-2xl font-semibold tabular-nums " +
            (latest
              ? latest.value >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-destructive"
              : "text-muted-foreground")
          }
        >
          {latest ? formatCrores(latest.value) : "—"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {latest ? formatDateIST(latest.date) : "No data"}
        </p>
      </div>

      {/* Bars */}
      <div className="mt-4">
        {series.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            FII/DII data is not currently available. Set <code>MARKET_FII_DII_URL</code> in the
            server environment to provide a JSON feed.
          </p>
        ) : (
          <FlowBars series={series} />
        )}
      </div>
    </div>
  );
}

function FlowBars({ series }: { series: InstitutionalFlow[] }) {
  // Use the last 10 entries and normalise against the largest absolute value.
  const tail = series.slice(-10);
  const max = Math.max(1, ...tail.map((f) => Math.abs(f.value)));

  return (
    <div className="flex h-24 items-end gap-2 sm:gap-3" aria-label="Institutional flow history">
      {tail.map((flow) => {
        const positive = flow.value >= 0;
        const ratio = Math.max(0.04, Math.min(1, Math.abs(flow.value) / max));
        return (
          <div
            key={flow.date}
            className="flex h-full flex-1 flex-col items-center justify-end"
            title={`${formatDateIST(flow.date)}: ${formatCrores(flow.value)}`}
          >
            <div className="flex h-20 w-full items-end justify-center">
              <div
                className={
                  "w-full max-w-7 " +
                  (positive
                    ? "rounded-t-sm bg-emerald-600 dark:bg-emerald-500"
                    : "rounded-b-sm bg-destructive")
                }
                style={{ height: `${Math.round(ratio * 80) + 4}px` }}
              />
            </div>
            <span className="mt-1 text-[10px] text-muted-foreground">{formatDay(flow.date)}</span>
          </div>
        );
      })}
    </div>
  );
}
