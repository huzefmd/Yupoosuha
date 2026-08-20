import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export function MarketError({
  message,
  onRetry,
  className,
}: {
  message: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={
        "flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border bg-card/60 p-8 text-center" +
        (className ? ` ${className}` : "")
      }
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="h-5 w-5" />
      </span>
      <p className="text-sm font-medium text-foreground">Unable to load market data.</p>
      <p className="max-w-md text-xs text-muted-foreground">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-1"
          aria-label="Retry loading market data"
        >
          <RefreshCw className="mr-1.5 h-4 w-4" />
          Retry
        </Button>
      )}
    </div>
  );
}
