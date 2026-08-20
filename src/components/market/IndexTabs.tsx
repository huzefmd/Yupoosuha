import type { IndexSymbol } from "@/lib/market/types";

const TABS: { value: IndexSymbol; label: string }[] = [
  { value: "NIFTY", label: "NIFTY" },
  { value: "SENSEX", label: "SENSEX" },
];

export function IndexTabs({
  active,
  onChange,
  className,
}: {
  active: IndexSymbol;
  onChange: (value: IndexSymbol) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label="Market index"
      className={"flex gap-8 border-b border-border" + (className ? ` ${className}` : "")}
    >
      {TABS.map((t) => {
        const selected = t.value === active;
        return (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`index-panel-${t.value}`}
            id={`index-tab-${t.value}`}
            onClick={() => onChange(t.value)}
            className={
              "relative pb-3 text-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm " +
              (selected ? "text-foreground" : "text-muted-foreground hover:text-foreground")
            }
          >
            {t.label}
            {selected && (
              <span className="absolute bottom-[-1px] left-0 h-[3px] w-full rounded-full bg-foreground" />
            )}
          </button>
        );
      })}
    </div>
  );
}
