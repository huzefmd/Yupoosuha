import { CircleDot } from "lucide-react";

import { formatDateTimeIST } from "@/lib/market/format";
import type { MarketStatus } from "@/lib/market/types";

export function MarketStatusBadge({
  status,
  className,
}: {
  status: MarketStatus | undefined;
  className?: string;
}) {
  const isOpen = status?.isOpen ?? false;
  return (
    <span
      className={
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium" +
        (isOpen
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          : "border-muted bg-muted/50 text-muted-foreground") +
        (className ? ` ${className}` : "")
      }
    >
      <CircleDot
        className={"h-3.5 w-3.5 " + (isOpen ? "text-emerald-600" : "text-muted-foreground")}
        aria-hidden="true"
      />
      <span>{isOpen ? "Market Open" : "Market Closed"}</span>
    </span>
  );
}

export function MarketStatusFooter({
  status,
  className,
}: {
  status: MarketStatus | undefined;
  className?: string;
}) {
  const updated = status?.timestamp;
  return (
    <p className={"text-xs text-muted-foreground" + (className ? ` ${className}` : "")}>
      {status?.message ? `${status.message}.` : "Market status unavailable."}{" "}
      {updated && <>Last updated: {formatDateTimeIST(updated)}.</>}
    </p>
  );
}
