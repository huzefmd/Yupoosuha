import {
  formatChange,
  formatChangePercent,
  formatIndexValue,
  formatTimeIST,
} from "@/lib/market/format";
import type { IndexQuote } from "@/lib/market/types";

export function IndexQuoteCard({ quote }: { quote: IndexQuote | undefined }) {
  if (!quote) {
    return null;
  }
  const negative = quote.change < 0;
  const changeColor = negative
    ? "text-destructive"
    : quote.change > 0
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-muted-foreground";

  return (
    <div>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
          {formatIndexValue(quote.value)}
        </span>
        <span className={"text-lg font-medium tabular-nums " + changeColor}>
          ({formatChange(quote.change)})
        </span>
      </div>
      <p className="mt-2 text-sm font-medium text-muted-foreground sm:text-base">
        {formatChangePercent(quote.changePercent)}
      </p>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground sm:grid-cols-3">
        <div>
          <dt className="inline">Prev close: </dt>
          <dd className="inline tabular-nums">{formatIndexValue(quote.previousClose)}</dd>
        </div>
        <div>
          <dt className="inline">Last: </dt>
          <dd className="inline tabular-nums">{formatTimeIST(quote.timestamp)}</dd>
        </div>
        <div>
          <dt className="inline">Index: </dt>
          <dd className="inline">{quote.name}</dd>
        </div>
      </dl>
    </div>
  );
}
