import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatIndexValue, formatTimeIST, formatDateIST } from "@/lib/market/format";
import type { Candle, HistoricalRange } from "@/lib/market/types";

type ChartPoint = {
  t: number;
  close: number;
  ts: string;
};

export function MarketChart({
  candles,
  range,
  height = 280,
  positive,
  className,
}: {
  candles: Candle[];
  range: HistoricalRange;
  /** Whether the overall move during this range was positive. */
  positive: boolean;
  height?: number;
  className?: string;
}) {
  const data = useMemo<ChartPoint[]>(
    () =>
      candles
        .map((c) => ({ t: new Date(c.timestamp).getTime(), close: c.close, ts: c.timestamp }))
        .filter((p) => Number.isFinite(p.t))
        .sort((a, b) => a.t - b.t),
    [candles],
  );

  const stroke = positive ? "#10b981" : "#ef4444";
  const gradientId = useMemo(() => `mc-grad-${Math.random().toString(36).slice(2, 9)}`, []);

  if (data.length === 0) {
    return (
      <div
        className={
          "flex h-32 w-full items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-xs text-muted-foreground" +
          (className ? ` ${className}` : "")
        }
        style={{ height }}
        role="img"
        aria-label="No chart data"
      >
        No chart data
      </div>
    );
  }

  return (
    <div
      className={"w-full " + (className ?? "")}
      style={{ height }}
      role="img"
      aria-label={`Index chart, ${range} view, ${data.length} data points`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.25} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="t"
            type="number"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(value) =>
              range === "1D"
                ? formatTimeIST(new Date(value).toISOString())
                : formatDateIST(new Date(value).toISOString())
            }
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            minTickGap={24}
          />
          <YAxis
            domain={["auto", "auto"]}
            tickFormatter={(value: number) => formatIndexValue(value)}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            width={56}
          />
          <Tooltip
            cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "3 3" }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const point = payload[0]?.payload as ChartPoint | undefined;
              if (!point) return null;
              return (
                <div className="rounded-lg border border-border/50 bg-background px-3 py-1.5 text-xs shadow-xl">
                  <div className="font-medium text-foreground">{formatIndexValue(point.close)}</div>
                  <div className="text-muted-foreground">
                    {range === "1D" ? formatTimeIST(point.ts) : formatDateIST(point.ts)}
                  </div>
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="close"
            stroke={stroke}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
