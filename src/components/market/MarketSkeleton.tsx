import { Skeleton } from "@/components/ui/skeleton";

export function MarketSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={
        "rounded-3xl border border-border bg-card p-5 shadow-card sm:p-7" +
        (className ? ` ${className}` : "")
      }
    >
      <div className="flex gap-8 border-b border-border pb-3">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
      </div>
      <div className="grid gap-8 pt-6 lg:grid-cols-2">
        <div>
          <Skeleton className="h-9 w-40" />
          <Skeleton className="mt-3 h-5 w-28" />
          <Skeleton className="mt-2 h-4 w-32" />
        </div>
        <Skeleton className="h-32 w-full" />
      </div>
      <div className="my-6 border-t border-dashed border-border" />
      <div className="grid gap-7 lg:grid-cols-2 lg:items-center">
        <div>
          <Skeleton className="h-5 w-24" />
          <Skeleton className="mt-2 h-7 w-32" />
          <Skeleton className="mt-2 h-4 w-24" />
        </div>
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}
