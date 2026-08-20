import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { SiteLayout } from "@/components/SiteLayout";
import { IndicesSection } from "@/components/market/IndicesSection";

export const Route = createFileRoute("/indices")({
  head: () => ({
    meta: [
      { title: "Indices — Yupoosuha" },
      {
        name: "description",
        content:
          "Live NIFTY 50 and BSE SENSEX quotes, intraday chart, and FII/DII cash flows — sourced from the configured market data provider.",
      },
      { property: "og:title", content: "Indices — Yupoosuha" },
      {
        property: "og:description",
        content: "Real-time Indian market indices dashboard.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: IndicesPage,
});

function IndicesPage() {
  return (
    <SiteLayout>
      <section className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Market Indices</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Live NIFTY 50 and BSE SENSEX — value, change, intraday chart, and the latest FII/DII
            cash flows.
          </p>
        </div>
      </section>
      <IndicesSection variant="detailed" />
    </SiteLayout>
  );
}
