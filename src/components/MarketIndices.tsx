import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw, Clock3 } from "lucide-react";
import {
    getMarketIndices,
    type IndexQuote,
} from "@/lib/indices.functions";

function fmt(n: number) {
    return n.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

/* =========================================================
   DEMO CHART DATA
   Replace with historical API data when available.
========================================================= */

const chartPoints = [
    24420, 24465, 24510, 24490, 24535, 24500, 24470,
    24495, 24540, 24515, 24570, 24610, 24650, 24720,
    24700, 24780, 24840, 24920, 25010, 25100, 25070,
    25150, 25210, 25280, 25310, 25250, 25170, 25090,
    24980, 24870, 24830, 24860, 24790, 24810, 24860,
    24820, 24760, 24690, 24640, 24580, 24520, 24470,
    24510, 24570, 24620, 24590, 24640, 24580, 24510,
    24560, 24490, 24450, 24420, 24480, 24440,
];

/* =========================================================
   MINI MARKET CHART
========================================================= */

function MiniChart({ quote }: { quote: IndexQuote }) {
    const width = 620;
    const height = 150;
    const paddingX = 5;
    const paddingY = 10;

    const min = Math.min(...chartPoints);
    const max = Math.max(...chartPoints);

    const points = chartPoints
        .map((value, index) => {
            const x =
                paddingX +
                (index / (chartPoints.length - 1)) *
                (width - paddingX * 2);

            const y =
                height -
                paddingY -
                ((value - min) / (max - min)) *
                (height - paddingY * 2);

            return `${x},${y}`;
        })
        .join(" ");

    const areaPoints = `
    ${paddingX},${height}
    ${points}
    ${width - paddingX},${height}
  `;

    const positive = quote.change >= 0;

    return (
        <div className="relative h-[180px] w-full">
            {/* Grid */}
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between py-2">
                {[0, 1, 2, 3, 4].map((line) => (
                    <div
                        key={line}
                        className="border-t border-dashed border-slate-200"
                    />
                ))}
            </div>

            <svg
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="none"
                className="relative h-full w-full overflow-visible"
            >
                <defs>
                    <linearGradient
                        id="marketChartGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop
                            offset="0%"
                            stopColor={positive ? "#ef4444" : "#ef4444"}
                            stopOpacity="0.12"
                        />

                        <stop
                            offset="100%"
                            stopColor={positive ? "#ef4444" : "#ef4444"}
                            stopOpacity="0"
                        />
                    </linearGradient>
                </defs>

                {/* Chart area */}
                <polygon
                    points={areaPoints}
                    fill="url(#marketChartGradient)"
                />

                {/* Chart line */}
                <polyline
                    points={points}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2.2"
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            {/* Y-axis */}
            <div className="pointer-events-none absolute right-full top-0 mr-2 hidden h-full flex-col justify-between py-1 text-[9px] text-slate-400 sm:flex">
                <span>{fmt(max)}</span>

                <span>
                    {fmt(max - (max - min) * 0.25)}
                </span>

                <span>
                    {fmt(max - (max - min) * 0.5)}
                </span>

                <span>
                    {fmt(max - (max - min) * 0.75)}
                </span>

                <span>{fmt(min)}</span>
            </div>

            {/* X-axis */}
            <div className="absolute left-0 right-0 top-full flex justify-between pt-2 text-[9px] text-slate-400">
                <span>09:07 am</span>
                <span>12:00 pm</span>
                <span>04:04 pm</span>
                <span>07:00 pm</span>
                <span>11:01 pm</span>
                <span>09:02 am</span>
            </div>
        </div>
    );
}

/* =========================================================
   FII / DII DATA
========================================================= */

const flowData = [
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

/* =========================================================
   FII / DII BAR CHART
========================================================= */

function FlowBars() {
    const max = Math.max(
        ...flowData.map((item) => Math.abs(item.value))
    );

    return (
        <div className="mt-5 flex h-[120px] items-end justify-between gap-3">
            {flowData.map((item) => {
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

                        <span className="mt-2 text-[10px] text-slate-500">
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
                    ? "text-slate-900"
                    : "text-slate-500 hover:text-slate-800"
                }`}
        >
            {label}

            {active && (
                <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] rounded-full bg-slate-900" />
            )}
        </button>
    );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export function MarketIndices() {
    const [activeIndex, setActiveIndex] = useState(0);

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

    /* -------------------------------------------------------
       Find NIFTY
    ------------------------------------------------------- */

    const nifty =
        quotes.find((q) => {
            const name = q.name.toLowerCase();

            return (
                name.includes("nifty") &&
                !name.includes("bank")
            );
        }) ?? quotes[0];

    /* -------------------------------------------------------
       Find SENSEX
    ------------------------------------------------------- */

    const sensex =
        quotes.find((q) =>
            q.name
                .toLowerCase()
                .includes("sensex")
        ) ?? quotes[1];

    /* -------------------------------------------------------
       Find BANK NIFTY
    ------------------------------------------------------- */

    const bankNifty =
        quotes.find((q) => {
            const name = q.name.toLowerCase();

            return (
                name.includes("bank nifty") ||
                name.includes("banknifty")
            );
        }) ?? quotes[2];

    /* -------------------------------------------------------
       Selected quote
    ------------------------------------------------------- */

    const selectedQuote =
        activeIndex === 0
            ? nifty
            : activeIndex === 1
                ? sensex
                : bankNifty;

    /* -------------------------------------------------------
       Market status
  
       Replace this with your real market status API
       when available.
    ------------------------------------------------------- */

    const marketClosed = true;

    return (
        <section className="mx-auto max-w-7xl px-4 pt-10 pb-10 sm:px-6">
            {/* ===================================================
          HEADER
      =================================================== */}

            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Indices
                </h2>

                <button
                    type="button"
                    className="text-sm font-medium text-red-500 transition hover:text-red-600"
                >
                    View All
                </button>
            </div>

            {/* ===================================================
          MAIN CARD
      =================================================== */}

            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
                {/* =================================================
            INDEX TABS
        ================================================= */}

                <div className="px-6 pt-5 sm:px-7">
                    <div className="flex gap-7 border-b border-slate-200">
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
                        <div className="flex items-center gap-2 text-sm text-slate-500">
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
                                    <span className="text-[34px] font-medium tracking-tight text-slate-900 sm:text-[38px]">
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

                                <div className="mt-4 space-y-1 text-[11px] text-slate-500">
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
                                <MiniChart
                                    quote={selectedQuote}
                                />

                                {/* Time range buttons */}

                                <div className="mt-8 flex justify-end">
                                    <div className="flex items-center rounded-full border border-slate-200 bg-white p-0.5 shadow-sm">
                                        {[
                                            "1D",
                                            "1W",
                                            "1M",
                                            "3M",
                                            "1Y",
                                        ].map((range, index) => (
                                            <button
                                                key={range}
                                                type="button"
                                                className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition ${index === 0
                                                        ? "border border-slate-200 bg-white text-slate-900 shadow-sm"
                                                        : "text-slate-500 hover:text-slate-900"
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

                        <div className="mx-6 border-t border-dashed border-slate-200 sm:mx-7" />

                        {/* =================================================
                MARKET STATUS
            ================================================= */}

                        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5 sm:px-7">
                            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-[11px] text-slate-500">
                                <Clock3 className="h-3.5 w-3.5" />

                                <span>
                                    {marketClosed
                                        ? "Market Closed"
                                        : "Market Open"}
                                </span>
                            </div>

                            <div className="text-right text-[10px] text-slate-500">
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

                            <div className="flex gap-7 border-b border-slate-200">
                                <button
                                    type="button"
                                    className="relative pb-3 text-xs font-semibold text-slate-900"
                                >
                                    FII Cash

                                    <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-slate-900" />
                                </button>

                                <button
                                    type="button"
                                    className="pb-3 text-xs font-medium text-slate-500 transition hover:text-slate-900"
                                >
                                    DII Cash
                                </button>
                            </div>

                            {/* FII value */}

                            <div className="mt-4">
                                <div className="text-[21px] font-medium text-red-500">
                                    -341.25 Cr.
                                </div>

                                <div className="mt-1 text-[11px] text-slate-500">
                                    05 Sept 2026
                                </div>

                                <FlowBars />
                            </div>
                        </div>
                    </>
                ) : (
                    /* =================================================
                       NO DATA
                    ================================================= */

                    <div className="px-6 py-12 text-center text-sm text-slate-500">
                        Live prices are unavailable right now.
                        Please try again shortly.
                    </div>
                )}

                {/* =================================================
            REFRESH
        ================================================= */}

                <div className="border-t border-slate-100 px-6 py-3 text-right sm:px-7">
                    <button
                        type="button"
                        onClick={() => void refetch()}
                        disabled={isFetching}
                        className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition hover:text-slate-900 disabled:opacity-50"
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