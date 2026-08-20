import { createFileRoute } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { useContent, type Deal } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";


export const Route = createFileRoute("/shopping")({
  head: () => ({
    meta: [
      { title: "Curated Shopping Deals & Discounts | Yupoosuha" },
      {
        name: "description",
        content:
          "Hand-picked shopping deals and discounts from Yupoosuha so your everyday spending goes further.",
      },
      { property: "og:title", content: "Curated Shopping Deals & Discounts | Yupoosuha" },
      {
        property: "og:description",
        content: "Hand-picked deals and discounts to help you spend smarter.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shopping,
});

function Shopping() {
  const { data, isLoading } = useContent<Deal>("shopping_deals");

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Shopping"
        title="Deals worth your money"
        subtitle="A small, curated list of offers — we'd rather show you a few good ones than hundreds of noisy links."
      />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-72 rounded-2xl" />
            ))}
          </div>
        ) : !data?.length ? (
          <p className="text-muted-foreground">No deals published yet. Check back soon.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.map((d) => (
              <article
                key={d.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card"
              >
                <div className="aspect-square bg-secondary">
                  {d.image_url ? (
                    <img
                      src={d.image_url}
                      alt={d.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <ShoppingBag className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="font-semibold">{d.title}</h2>
                  <div className="mt-2 flex items-center gap-2">
                    {d.price && <span className="text-lg font-bold">{d.price}</span>}
                    {d.discount && (
                      <span className="rounded-full bg-brand-yellow/40 px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                        {d.discount}
                      </span>
                    )}
                  </div>
                  <Button asChild className="mt-auto pt-0" size="sm">
                    <a href={d.link || "#"} target="_blank" rel="noreferrer noopener sponsored">
                      Shop Now
                    </a>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
