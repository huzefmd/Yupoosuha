import { createFileRoute } from "@tanstack/react-router";
import { Check, LineChart } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { useContent, type FinanceOffer } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/finance")({
  head: () => ({
    meta: [
      { title: "Demat Accounts, Loans & Finance Help | Yupoosuha" },
      {
        name: "description",
        content:
          "Open a free demat account, compare home loan options and get straightforward help with financial accounts.",
      },
      { property: "og:title", content: "Demat Accounts, Loans & Finance Help | Yupoosuha" },
      {
        property: "og:description",
        content: "Free demat account help, home loan guidance and financial account information.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Finance,
});

function Finance() {
  const { data, isLoading } = useContent<FinanceOffer>("finance_offers");

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Finance"
        title="Get set up with the right accounts"
        subtitle="Demat accounts, home loans and other financial services — with the key details up front."
      />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        ) : !data?.length ? (
          <p className="text-muted-foreground">No finance offerings published yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {data.map((f) => (
              <article
                key={f.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card"
              >
                <div className="aspect-[16/9] bg-secondary">
                  {f.image_url ? (
                    <img
                      src={f.image_url}
                      alt={f.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <LineChart className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="font-semibold">{f.title}</h2>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {f.highlights?.map((h) => (
                      <li key={h} className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                  {f.link && (
                    <Button asChild className="mt-6" size="sm">
                      <a href={f.link} target="_blank" rel="noreferrer noopener">
                        Get started
                      </a>
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
