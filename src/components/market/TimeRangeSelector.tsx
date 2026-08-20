import type { HistoricalRange } from "@/lib/market/types";

const RANGES: { value: HistoricalRange; label: string }[] = [
  { value: "1D", label: "1D" },
  { value: "1W", label: "1W" },
  { value: "1M", label: "1M" },
  { value: "3M", label: "3M" },
  { value: "1Y", label: "1Y" },
];

export function TimeRangeSelector({
  value,
  onChange,
  className,
  ariaLabel = "Select chart time range",
}: {
  value: HistoricalRange;
  onChange: (range: HistoricalRange) => void;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={
        "inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 p-1" +
        (className ? ` ${className}` : "")
      }
    >
      {RANGES.map((r) => {
        const selected = r.value === value;
        return (
          <button
            key={r.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(r.value)}
            className={
              "min-w-9 rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 " +
              (selected
                ? "bg-background text-foreground shadow"
                : "text-muted-foreground hover:text-foreground")
            }
          >
            {r.label}
          </button>
        );
      })}
    </div>
  );
}
