import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { useContent, type Insurance } from "@/lib/content";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/insurance")({
  head: () => ({
    meta: [
      { title: "Insurance Explained: Term, Life, Health | Yupoosuha" },
      {
        name: "description",
        content:
          "Understand term, life, health and general insurance in plain language, so you can pick cover that actually fits your life.",
      },
      { property: "og:title", content: "Insurance Explained: Term, Life, Health | Yupoosuha" },
      {
        property: "og:description",
        content: "Term, life, health and general insurance explained without the jargon.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InsurancePage,
});

function InsurancePage() {
  const { data, isLoading } = useContent<Insurance>("insurance_types");

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Insurance"
        title="Cover that actually fits your life"
        subtitle="What each type of insurance really does, who it's for, and what to check before you buy."
      />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        ) : !data?.length ? (
          <p className="text-muted-foreground">No insurance guides published yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {data.map((i) => (
              <article
                key={i.id}
                className="flex gap-5 rounded-2xl border border-border bg-card p-6 shadow-card"
              >
                {i.image_url ? (
                  <img
                    src={i.image_url}
                    alt={i.title}
                    loading="lazy"
                    className="h-20 w-20 shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ShieldCheck className="h-6 w-6" />
                  </span>
                )}
                <div>
                  <h2 className="font-semibold">{i.title}</h2>
                  <p className="mt-1.5 text-sm text-muted-foreground">{i.description}</p>
                  {i.link && (
                    <a
                      href={i.link}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
                    >
                      Learn more
                    </a>
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
