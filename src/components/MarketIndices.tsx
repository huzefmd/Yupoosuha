import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw, Clock3 } from "lucide-react";
import {
    getMarketIndices,
    type IndexQuote,
} from "@/lib/indices.functions";
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

function fmt(n: number) {
    return n.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

/* =========================================================
   MOCK SERIES DATA
========================================================= */

const generateMockPoints = (base: number, variance: number, count: number) => {
    const points = [];
    let currentVal = base;

    // Create a slight trend for the pattern
    const trend = (Math.random() - 0.4) * (variance * 0.1);

    for (let i = 0; i < count; i++) {
        currentVal += trend + (Math.random() - 0.5) * variance;
        points.push({
            t: Date.now() - (count - i) * 3600000,
            v: currentVal,
        });
    }
    return points;
};

const MOCK_SERIES_DATA: Record<string, Record<string, any>> = {
    "NIFTY": {
        "1D": { points: generateMockPoints(24500, 100, 50) },
        "1W": { points: generateMockPoints(24300, 500, 40) },
        "1M": { points: generateMockPoints(24000, 1000, 30) },
        "3M": { points: generateMockPoints(23500, 2000, 60) },
        "1Y": { points: generateMockPoints(22000, 5000, 100) },
    },
    "SENSEX": {
        "1D": { points: generateMockPoints(74000, 200, 50) },
        "1W": { points: generateMockPoints(73500, 800, 40) },
        "1M": { points: generateMockPoints(72000, 1500, 30) },
        "3M": { points: generateMockPoints(71000, 3000, 60) },
        "1Y": { points: generateMockPoints(65000, 8000, 100) },
    },
    "BANK NIFTY": {
        "1D": { points: generateMockPoints(52000, 300, 50) },
        "1W": { points: generateMockPoints(51500, 1000, 40) },
        "1M": { points: generateMockPoints(50000, 2000, 30) },
        "3M": { points: generateMockPoints(48000, 4000, 60) },
        "1Y": { points: generateMockPoints(44000, 8000, 100) },
    },
};

/* =========================================================
   INTERACTIVE MARKET CHART
========================================================= */

function InteractiveChart({
    quote,
    timeRange,
    seriesData
}: {
    quote: IndexQuote;
    timeRange: string;
    seriesData: any
}) {
    const chartConfig = {
        value: {
            label: "Index Value",
            color: quote.change >= 0 ? "#10b981" : "#ef4444",
        },
    };

    // Format data for Recharts
    const data = seriesData?.points?.map((p: any) => ({
        time: new Date(p.t).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        }),
        value: p.v,
    })) ?? [];

    if (!data.length) {
        return (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
                Loading chart data...
            </div>
        );
    }

    return (
        <div className="relative h-[180px] w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop
                                offset="0%"
                                stopColor={chartConfig.value.color}
                                stopOpacity={0.2}
                            />
                            <stop
                                offset="100%"
                                stopColor={chartConfig.value.color}
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="time"
                        hide
                    />
                    <YAxis
                        domain={["auto", "auto"]}
                        tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                        axisLine={false}
                        tickLine={false}
                        width={40}
                    />
                    <Tooltip
                        content={<ChartTooltipContent />}
                    />
                    <Area
                        type="linear"
                        dataKey="value"
                        stroke={chartConfig.value.color}
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
   FII / DII DATA
========================================================= */

const fiiFlowData = [
    { day: "27", value: -820 },
    { day: "28", value: 1120 },
    { day: "29", value: 640 },
    { day: "30", value: 1240 },
    { day: "31", value: 180 },
    { day: "01", value: 300 },
    { day: "02", value: 420 },
    { day: "03", value: -180 },
    { day: "04", value: -120 },
    { day: "05", value: -540 },
];

const diiFlowData = [
    { day: "27", value: 640 },
    { day: "28", value: 380 },
    { day: "29", value: -260 },
    { day: "30", value: 910 },
    { day: "31", value: 1050 },
    { day: "01", value: 720 },
    { day: "02", value: -140 },
    { day: "03", value: 860 },
    { day: "04", value: 990 },
    { day: "05", value: 512 },
];

const FLOW_META = {
    FII: {
        label: "FII Cash",
        latestValue: fiiFlowData[fiiFlowData.length - 1].value,
        date: "05 Sept 2026",
        data: fiiFlowData,
    },
    DII: {
        label: "DII Cash",
        latestValue: diiFlowData[diiFlowData.length - 1].value,
        date: "05 Sept 2026",
        data: diiFlowData,
    },
} as const;

type FlowKind = keyof typeof FLOW_META;

/* =========================================================
   FII / DII BAR CHART
========================================================= */

function FlowBars({ data }: { data: { day: string; value: number }[] }) {
    const max = Math.max(
        ...data.map((item) => Math.abs(item.value))
    );

    return (
        <div className="mt-5 flex h-[120px] items-end justify-between gap-3">
            {data.map((item) => {
                const positive = item.value >= 0;

                const height = Math.max(
                    8,
                    (Math.abs(item.value) / max) * 80
                );

                return (
                    <div
                        key={item.day}
                        className="flex h-full flex-1 flex-col items-center justify-end"
                    >
                        <div
                            className={`w-full max-w-[27px] rounded-t-md ${positive
                                ? "bg-emerald-500"
                                : "bg-red-500"
                                }`}
                            style={{
                                height: `${height}px`,
                            }}
                        />

                        <span className="mt-2 text-[10px] text-muted-foreground">
                            {item.day}
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
            className={`relative pb-3 text-base font-medium transition ${active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
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
    const [activeIndex, setActiveIndex] = useState(0);
    const [timeRange, setTimeRange] = useState("1D");
    const [flowTab, setFlowTab] = useState<FlowKind>("FII");

    const {
        data,
        isLoading,
        isFetching,
        dataUpdatedAt,
        refetch,
    } = useQuery({
        queryKey: ["market-indices"],
        queryFn: () => getMarketIndices(),
        refetchInterval: 30_000,
        refetchOnWindowFocus: true,
        staleTime: 0,
    });

    const quotes = data?.quotes ?? [];

    const nifty =
        quotes.find((q) => {
            const name = q.name.toLowerCase();
            return (
                name.includes("nifty") &&
                !name.includes("bank")
            );
        }) ?? quotes[0];

    const sensex =
        quotes.find((q) =>
            q.name
                .toLowerCase()
                .includes("sensex")
        ) ?? quotes[1];

    const bankNifty =
        quotes.find((q) => {
            const name = q.name.toLowerCase();
            return (
                name.includes("bank nifty") ||
                name.includes("banknifty")
            );
        }) ?? quotes[2];

    const selectedQuote =
        activeIndex === 0
            ? nifty
            : activeIndex === 1
                ? sensex
                : bankNifty;

    const currentLabel = activeIndex === 0 ? "NIFTY" : activeIndex === 1 ? "SENSEX" : "BANK NIFTY";

    const seriesData = MOCK_SERIES_DATA[currentLabel]?.[timeRange];

    const marketClosed = true;

    const activeFlow = FLOW_META[flowTab];

    return (
        <section className="mx-auto max-w-7xl px-4 pt-10 pb-10 sm:px-6">
            {/* ===================================================
              HEADER
          =================================================== */}

            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Indices
                </h2>


            </div>

            {/* ===================================================
              MAIN CARD
          =================================================== */}

            <div className="overflow-hidden rounded-[24px] border border-border bg-card shadow-card">
                {/* =================================================
                    INDEX TABS
                ================================================= */}

                <div className="px-6 pt-5 sm:px-7">
                    <div className="flex gap-7 border-b border-border">
                        <IndexTab
                            label="NIFTY"
                            active={activeIndex === 0}
                            onClick={() => setActiveIndex(0)}
                        />

                        <IndexTab
                            label="SENSEX"
                            active={activeIndex === 1}
                            onClick={() => setActiveIndex(1)}
                        />

                        <IndexTab
                            label="BANK NIFTY"
                            active={activeIndex === 2}
                            onClick={() => setActiveIndex(2)}
                        />
                    </div>
                </div>

                {/* =================================================
                    LOADING
                ================================================= */}

                {isLoading ? (
                    <div className="grid min-h-[450px] place-items-center">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Loading market data...
                        </div>
                    </div>
                ) : selectedQuote ? (
                    <>
                        {/* =============================================
                            QUOTE + CHART
                        ============================================= */}

                        <div className="grid gap-8 px-6 py-7 lg:grid-cols-[0.9fr_1.6fr] lg:px-7">
                            {/* ===========================================
                                  LEFT QUOTE
                            =========================================== */}

                            <div className="flex flex-col justify-center">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-[34px] font-medium tracking-tight text-foreground sm:text-[38px]">
                                        {fmt(selectedQuote.last)}
                                    </span>

                                    <span
                                        className={`text-sm font-medium ${selectedQuote.change >= 0
                                            ? "text-emerald-600"
                                            : "text-red-500"
                                            }`}
                                    >
                                        {selectedQuote.change >= 0
                                            ? "+"
                                            : ""}
                                        {fmt(selectedQuote.change)}
                                    </span>
                                </div>

                                <div
                                    className={`mt-1 text-sm font-medium ${selectedQuote.percentChange >=
                                        0
                                        ? "text-emerald-600"
                                        : "text-red-500"
                                        }`}
                                >
                                    {selectedQuote.percentChange >= 0
                                        ? "+"
                                        : ""}
                                    {selectedQuote.percentChange.toFixed(
                                        2
                                    )}
                                    %
                                </div>

                                <div className="mt-4 space-y-1 text-[11px] text-muted-foreground">
                                    <p>
                                        Prev close:{" "}
                                        {fmt(
                                            selectedQuote.previousClose
                                        )}
                                    </p>

                                    <div className="flex flex-wrap gap-x-10 gap-y-1">
                                        <span>
                                            Last:{" "}
                                            {dataUpdatedAt
                                                ? new Date(
                                                    dataUpdatedAt
                                                ).toLocaleTimeString(
                                                    "en-IN",
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    }
                                                )
                                                : "--"}
                                        </span>

                                        <span>
                                            Index:{" "}
                                            {selectedQuote.name}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* ===========================================
                                  CHART
                            =========================================== */}

                            <div className="relative pt-1 pl-7 sm:pl-10">
                                <InteractiveChart
                                    quote={selectedQuote}
                                    timeRange={timeRange}
                                    seriesData={seriesData}
                                />

                                {/* Time range buttons */}

                                <div className="mt-8 flex justify-end">
                                    <div className="flex items-center rounded-full border border-border bg-card p-0.5 shadow-sm">
                                        {["1D", "1W", "1M", "3M", "1Y"].map((range) => (
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

                        {/* =================================================
                            DIVIDER
                        ================================================= */}

                        <div className="mx-6 border-t border-dashed border-border sm:mx-7" />

                        {/* =================================================
                            MARKET STATUS
                        ================================================= */}

                        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5 sm:px-7">
                            <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-[11px] text-muted-foreground">
                                <Clock3 className="h-3.5 w-3.5" />

                                <span>
                                    {marketClosed
                                        ? "Market Closed"
                                        : "Market Open"}
                                </span>
                            </div>

                            <div className="text-right text-[10px] text-muted-foreground">
                                {marketClosed
                                    ? `Market closed. Last updated: ${dataUpdatedAt
                                        ? new Date(
                                            dataUpdatedAt
                                        ).toLocaleString(
                                            "en-IN",
                                            {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }
                                        )
                                        : "--"
                                    }.`
                                    : "Market is currently open."}
                            </div>
                        </div>

                        {/* =================================================
                            FII / DII
                        ================================================= */}

                        <div className="px-6 pb-7 sm:px-7">
                            {/* FII / DII tabs */}

                            <div className="flex gap-7 border-b border-border">
                                <button
                                    type="button"
                                    onClick={() => setFlowTab("FII")}
                                    className={`relative pb-3 text-xs font-semibold transition ${flowTab === "FII"
                                        ? "text-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    FII Cash

                                    {flowTab === "FII" && (
                                        <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-foreground" />
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFlowTab("DII")}
                                    className={`relative pb-3 text-xs font-semibold transition ${flowTab === "DII"
                                        ? "text-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    DII Cash

                                    {flowTab === "DII" && (
                                        <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-foreground" />
                                    )}
                                </button>
                            </div>

                            {/* FII / DII value */}

                            <div className="mt-4">
                                <div
                                    className={`text-[21px] font-medium ${activeFlow.latestValue >= 0
                                        ? "text-emerald-600"
                                        : "text-red-500"
                                        }`}
                                >
                                    {activeFlow.latestValue >= 0 ? "+" : ""}
                                    {activeFlow.latestValue.toFixed(2)} Cr.
                                </div>

                                <div className="mt-1 text-[11px] text-muted-foreground">
                                    {activeFlow.date}
                                </div>

                                <FlowBars data={activeFlow.data} />
                            </div>
                        </div>
                    </>
                ) : (
                    /* =================================================
                       NO DATA
                    ================================================= */

                    <div className="px-6 py-12 text-center text-sm text-muted-foreground">
                        Live prices are unavailable right now.
                        Please try again shortly.
                    </div>
                )}

                {/* =================================================
                    REFRESH
                ================================================= */}

                <div className="border-t border-border px-6 py-3 text-right sm:px-7">
                    <button
                        type="button"
                        onClick={() => void refetch()}
                        disabled={isFetching}
                        className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition hover:text-foreground disabled:opacity-50"
                    >
                        <RefreshCw
                            className={`h-3.5 w-3.5 ${isFetching
                                ? "animate-spin"
                                : ""
                                }`}
                        />

                        Refresh
                    </button>
                </div>
            </div>
        </section>
    );
}
