import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import {
    getMarketIndices,
    getIndexSeries,
    getFlowData,
    type IndexQuote,
} from "@/lib/indices.functions";
import { Area, AreaChart, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

/* =========================================================
   HELPERS
========================================================= */

function fmt(n: number | undefined | null) {
    if (n === undefined || n === null || Number.isNaN(n)) return "--";
    return n.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function formatFlowDate(date: string) {
    if (!date) return "--";
    const [year, month, day] = date.split("-").map(Number);
    if (!year || !month || !day) return "--";
    return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    });
}

/* =========================================================
   TABS CONFIG
========================================================= */

// Symbols must match the keys in EXTRA_YAHOO in indices.functions.ts
const EXTRA_TABS = [
    { label: "CRUDE OIL", symbol: "CRUDEOIL", prefix: "$", suffix: "" },
    { label: "10Y US BOND", symbol: "US10Y", prefix: "", suffix: "%" },
    { label: "GOLD", symbol: "GOLD", prefix: "₹", suffix: "" },
];

const INDEX_SERIES_NAMES = ["NIFTY 50", "SENSEX", "BANK NIFTY"];

const RANGES = ["1D", "1W", "1M", "3M", "1Y"];

/* =========================================================
   SAMPLE CHART DATA
   Only used for NIFTY / SENSEX / BANK NIFTY if the live
   chart request fails.
========================================================= */

const generateMockPoints = (base: number, variance: number, count: number) => {
    const points: { t: number; v: number }[] = [];
    let currentVal = base;
    const trend = (Math.random() - 0.4) * (variance * 0.1);

    for (let i = 0; i < count; i++) {
        currentVal += trend + (Math.random() - 0.5) * variance;
        points.push({ t: Date.now() - (count - i) * 3600000, v: currentVal });
    }
    return points;
};

const MOCK_SERIES_DATA: Record<string, Record<string, { points: { t: number; v: number }[] }>> = {
    NIFTY: Object.fromEntries(
        RANGES.map((r, i) => [r, { points: generateMockPoints(25000, [10, 50, 100, 200, 500][i]!, 50) }])
    ),
    SENSEX: Object.fromEntries(
        RANGES.map((r, i) => [r, { points: generateMockPoints(80000, [30, 150, 300, 600, 1500][i]!, 50) }])
    ),
    "BANK NIFTY": Object.fromEntries(
        RANGES.map((r, i) => [r, { points: generateMockPoints(52000, [20, 100, 200, 400, 1000][i]!, 50) }])
    ),
};

/* =========================================================
   CHART
========================================================= */

function InteractiveChart({
    quote,
    timeRange,
    points,
}: {
    quote: Pick<IndexQuote, "change">;
    timeRange: string;
    points?: { t: number; v: number }[];
}) {
    const color = quote.change >= 0 ? "#10b981" : "#ef4444";
    const chartConfig = { value: { label: "Value", color } };

    const data =
        points?.map((p) => ({
            time:
                timeRange === "1D"
                    ? new Date(p.t).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })
                    : new Date(p.t).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                    }),
            value: p.v,
        })) ?? [];

    if (!data.length) {
        return (
            <div className="flex h-[180px] items-center justify-center text-sm text-muted-foreground">
                No chart data available for this selection.
            </div>
        );
    }

    return (
        <div className="relative h-[180px] w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                            <stop offset="100%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="time" hide />
                    <YAxis
                        domain={["auto", "auto"]}
                        tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                        tickFormatter={(v: number) =>
                            v.toLocaleString("en-IN", { maximumFractionDigits: 2 })
                        }
                        axisLine={false}
                        tickLine={false}
                        width={56}
                    />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Area
                        type="linear"
                        dataKey="value"
                        stroke={color}
                        fill="url(#chartGradient)"
                        strokeWidth={1.5}
                        dot={false}
                        activeDot={{ r: 3, strokeWidth: 0 }}
                    />
                </AreaChart>
            </ChartContainer>
        </div>
    );
}

/* =========================================================
   FII / DII BARS
========================================================= */

function FlowBars({
    data,
}: {
    data: { date: string; day: string; value: number }[];
}) {
    if (!data || data.length === 0) {
        return (
            <div className="mt-5 flex h-[120px] items-center justify-center text-sm text-muted-foreground">
                No flow data available.
            </div>
        );
    }

    const max = Math.max(...data.map((item) => Math.abs(item.value)), 1);

    return (
        <div className="mt-5 flex h-[140px] items-end justify-between gap-3 pb-4">
            {data.map((item) => {
                const positive = item.value >= 0;
                const height = Math.max(8, (Math.abs(item.value) / max) * 80);

                return (
                    <div
                        key={item.date}
                        className="relative flex h-full flex-1 flex-col items-center justify-end"
                    >
                        <div
                            className={`absolute bottom-6 w-full max-w-[27px] rounded-t-md ${positive ? "bg-emerald-500" : "bg-red-500"
                                }`}
                            style={{ height: `${height}px` }}
                        />
                        <div
                            className={`absolute bottom-full mb-1 whitespace-nowrap text-[9px] font-bold ${positive ? "text-emerald-500" : "text-red-500"
                                }`}
                        >
                            {positive ? "+" : ""}
                            {item.value.toFixed(0)}
                        </div>
                        <span className="absolute bottom-0 text-[10px] font-black text-foreground">
                            {item.date ? item.date.split("-")[2] : "--"}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

/* =========================================================
   INDEX TAB
========================================================= */

function IndexTab({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`relative whitespace-nowrap pb-3 text-base font-medium transition ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
        >
            {label}
            {active && (
                <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] rounded-full bg-foreground" />
            )}
        </button>
    );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export function MarketIndices() {
    const [activeIndex, setActiveIndex] = useState(0); // 0-2 Indian indices, 3-5 extra tabs
    const [timeRange, setTimeRange] = useState("1D");
    const [flowTab, setFlowTab] = useState<"FII" | "DII">("FII");
    const [selectedStockName, setSelectedStockName] = useState<string | null>(null);

    const extra = activeIndex >= 3 ? EXTRA_TABS[activeIndex - 3] : null;

    // Extra tabs and searched stocks take their price AND chart from the series query.
    const useSeriesQuote = !!selectedStockName || !!extra;

    const seriesName =
        selectedStockName || extra?.symbol || INDEX_SERIES_NAMES[activeIndex] || "NIFTY 50";

    /* ---------- queries ---------- */

    const { data, isLoading, isFetching, dataUpdatedAt, refetch } = useQuery({
        queryKey: ["market-indices"],
        queryFn: () => getMarketIndices(),
        refetchInterval: 30_000,
        refetchOnWindowFocus: true,
        staleTime: 0,
    });

    const { data: flowData, isLoading: isFlowLoading } = useQuery({
        queryKey: ["market-flow"],
        queryFn: () => getFlowData(),
        refetchInterval: 60_000,
    });

    const {
        data: seriesData,
        isLoading: isSeriesLoading,
        isFetching: isSeriesFetching,
        dataUpdatedAt: seriesUpdatedAt,
        refetch: refetchSeries,
        error: seriesError,
    } = useQuery({
        queryKey: ["index-series", seriesName, timeRange],
        // TanStack Start server functions take their input inside a `data` key
        queryFn: () => getIndexSeries({ data: { name: seriesName, range: timeRange } }),
        refetchInterval: 30_000,
        staleTime: 0,
        retry: 1,
    });

    /* ---------- pick the quote to display ---------- */

    const quotes = data?.quotes ?? [];

    const nifty =
        quotes.find((q) => {
            const name = q.name.toLowerCase();
            return name.includes("nifty") && !name.includes("bank");
        }) ?? quotes[0];

    const sensex =
        quotes.find((q) => q.name.toLowerCase().includes("sensex")) ?? quotes[1];

    const bankNifty =
        quotes.find((q) => {
            const name = q.name.toLowerCase();
            return name.includes("bank nifty") || name.includes("banknifty");
        }) ?? quotes[2];

    const indexQuote = activeIndex === 0 ? nifty : activeIndex === 1 ? sensex : bankNifty;
    const currentLabel = activeIndex === 0 ? "NIFTY" : activeIndex === 1 ? "SENSEX" : "BANK NIFTY";

    // No fake quotes: if the API returns nothing we show "unavailable".
    const seriesQuote = (seriesData as any)?.last != null ? (seriesData as any) : null;
    const displayQuote: any = useSeriesQuote ? seriesQuote : indexQuote;

    const livePoints: { t: number; v: number }[] | undefined = (seriesData as any)?.points;

    const chartPoints: { t: number; v: number }[] | undefined = useSeriesQuote
        ? livePoints
        : livePoints?.length
            ? livePoints
            : typeof window === "undefined"
                ? []
                : MOCK_SERIES_DATA[currentLabel]?.[timeRange]?.points;

    const prefix = !selectedStockName && extra ? extra.prefix : "";
    const suffix = !selectedStockName && extra ? extra.suffix : "";

    const loading = useSeriesQuote ? isSeriesLoading : isLoading;
    const lastUpdated = useSeriesQuote ? seriesUpdatedAt : dataUpdatedAt;
    const refreshing = isFetching || (useSeriesQuote && isSeriesFetching);

    /* ---------- FII / DII ---------- */

    const activeFlowData = flowTab === "FII" ? flowData?.fii : flowData?.dii;
    const latestFlow = activeFlowData?.[activeFlowData.length - 1];
    const latestFlowValue = latestFlow?.value;
    const flowDate = latestFlow ? formatFlowDate(latestFlow.date) : "--";

    const selectTab = (index: number) => {
        setActiveIndex(index);
        setSelectedStockName(null);
    };

    return (
        <section className="mx-auto max-w-7xl px-4 pt-10 pb-10 sm:px-6">
            {/* HEADER */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Indices</h2>
            </div>

            {/* MAIN CARD */}
            <div className="overflow-hidden rounded-[24px] border border-border bg-card shadow-card">
                {/* TABS */}
                <div className="px-6 pt-5 sm:px-7">
                    <div className="flex gap-7 overflow-x-auto border-b border-border">
                        <IndexTab
                            label="NIFTY"
                            active={activeIndex === 0 && !selectedStockName}
                            onClick={() => selectTab(0)}
                        />
                        <IndexTab
                            label="SENSEX"
                            active={activeIndex === 1 && !selectedStockName}
                            onClick={() => selectTab(1)}
                        />
                        <IndexTab
                            label="BANK NIFTY"
                            active={activeIndex === 2 && !selectedStockName}
                            onClick={() => selectTab(2)}
                        />
                        {EXTRA_TABS.map((tab, i) => (
                            <IndexTab
                                key={tab.symbol}
                                label={tab.label}
                                active={activeIndex === i + 3 && !selectedStockName}
                                onClick={() => selectTab(i + 3)}
                            />
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="grid min-h-[450px] place-items-center">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Loading market data...
                        </div>
                    </div>
                ) : displayQuote ? (
                    <>
                        {/* QUOTE + CHART */}
                        <div className="grid gap-8 px-6 py-7 lg:grid-cols-[0.9fr_1.6fr] lg:px-7">
                            {/* LEFT QUOTE */}
                            <div className="flex flex-col justify-center">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-[34px] font-medium tracking-tight text-foreground sm:text-[38px]">
                                        {prefix}
                                        {fmt(displayQuote.last)}
                                        {suffix}
                                    </span>

                                    <span
                                        className={`text-sm font-medium ${displayQuote.change >= 0
                                                ? "text-emerald-600"
                                                : "text-red-500"
                                            }`}
                                    >
                                        {displayQuote.change >= 0 ? "+" : ""}
                                        {fmt(displayQuote.change)}
                                    </span>
                                </div>

                                <div
                                    className={`mt-1 text-sm font-medium ${displayQuote.percentChange >= 0
                                            ? "text-emerald-600"
                                            : "text-red-500"
                                        }`}
                                >
                                    {displayQuote.percentChange >= 0 ? "+" : ""}
                                    {displayQuote.percentChange.toFixed(2)}%
                                </div>

                                <div className="mt-4 space-y-1 text-[11px] text-muted-foreground">
                                    <p>
                                        Prev close: {prefix}
                                        {fmt(displayQuote.previousClose)}
                                        {suffix}
                                    </p>

                                    <div className="flex flex-wrap gap-x-10 gap-y-1">
                                        <span>
                                            Last:{" "}
                                            {lastUpdated
                                                ? new Date(lastUpdated).toLocaleTimeString("en-IN", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })
                                                : "--"}
                                        </span>
                                        <span>
                                            {useSeriesQuote ? "Symbol" : "Index"}: {displayQuote.name}
                                        </span>
                                        {displayQuote.source && <span>Source: {displayQuote.source}</span>}
                                    </div>
                                </div>
                            </div>

                            {/* CHART */}
                            <div className="relative pt-1 pl-7 sm:pl-10">
                                <InteractiveChart
                                    quote={displayQuote}
                                    timeRange={timeRange}
                                    points={chartPoints}
                                />

                                <div className="mt-8 flex justify-end">
                                    <div className="flex items-center rounded-full border border-border bg-card p-0.5 shadow-sm">
                                        {RANGES.map((range) => (
                                            <button
                                                key={range}
                                                type="button"
                                                onClick={() => setTimeRange(range)}
                                                className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition ${timeRange === range
                                                        ? "border border-border bg-card text-foreground shadow-sm"
                                                        : "text-muted-foreground hover:text-foreground"
                                                    }`}
                                            >
                                                {range}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FII / DII */}
                        <div className="px-6 pb-7 sm:px-7">
                            <div className="flex gap-7 border-b border-border">
                                {(["FII", "DII"] as const).map((kind) => (
                                    <button
                                        key={kind}
                                        type="button"
                                        onClick={() => setFlowTab(kind)}
                                        className={`relative pb-3 text-xs font-semibold transition ${flowTab === kind
                                                ? "text-foreground"
                                                : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        {kind} Cash
                                        {flowTab === kind && (
                                            <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-foreground" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-4">
                                <div
                                    className={`text-[21px] font-medium ${latestFlowValue === undefined
                                            ? "text-muted-foreground"
                                            : latestFlowValue >= 0
                                                ? "text-emerald-600"
                                                : "text-red-500"
                                        }`}
                                >
                                    {latestFlowValue === undefined
                                        ? "--"
                                        : `${latestFlowValue >= 0 ? "+" : ""}${latestFlowValue.toFixed(2)} Cr.`}
                                </div>

                                <div className="mt-1 text-[11px] text-muted-foreground">
                                    {isFlowLoading ? "Loading report date..." : flowDate}
                                </div>

                                <FlowBars data={activeFlowData ?? []} />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="px-6 py-12 text-center text-sm text-muted-foreground">
                        Live prices are unavailable right now. Please try again shortly.
                        {useSeriesQuote && seriesError && (
                            <div className="mt-2 text-xs text-red-500">{String(seriesError)}</div>
                        )}
                    </div>
                )}

                {/* REFRESH */}
                <div className="border-t border-border px-6 py-3 text-right sm:px-7">
                    <button
                        type="button"
                        onClick={() => {
                            void refetch();
                            void refetchSeries();
                        }}
                        disabled={refreshing}
                        className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition hover:text-foreground disabled:opacity-50"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                </div>
            </div>
        </section>
    );
}