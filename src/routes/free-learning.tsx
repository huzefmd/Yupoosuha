import { createFileRoute } from "@tanstack/react-router";
import { PlayCircle } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { useContent, youtubeEmbed, type Video } from "@/lib/content";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/free-learning")({
  head: () => ({
    meta: [
      { title: "Free Stock Market & Money Lessons | Yupoosuha" },
      {
        name: "description",
        content:
          "Watch free Yupoosuha videos on stock market basics, investing, and building better money habits — no cost, no jargon.",
      },
      { property: "og:title", content: "Free Stock Market & Money Lessons | Yupoosuha" },
      {
        property: "og:description",
        content: "Free videos on stock market basics, investing and money habits.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FreeLearning,
});

function FreeLearning() {
  const { data, isLoading } = useContent<Video>("free_learning_videos");

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Free Learning"
        title="Lessons on the market, in plain language"
        subtitle="Short videos covering stock market pitching, investing fundamentals and everyday money decisions."
      />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-72 rounded-2xl" />
            ))}
          </div>
        ) : !data?.length ? (
          <p className="text-muted-foreground">No videos published yet. Check back soon.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((v) => {
              const embed = youtubeEmbed(v.video_url);
              return (
                <article
                  key={v.id}
                  className="overflow-hidden rounded-2xl border border-border bg-card shadow-card"
                >
                  <div className="aspect-video bg-secondary">
                    {embed ? (
                      <iframe
                        src={embed}
                        title={v.title}
                        loading="lazy"
                        allowFullScreen
                        className="h-full w-full"
                      />
                    ) : v.thumbnail_url ? (
                      <img
                        src={v.thumbnail_url}
                        alt={v.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <PlayCircle className="h-10 w-10" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h2 className="font-semibold">{v.title}</h2>
                    <p className="mt-1.5 text-sm text-muted-foreground">{v.description}</p>
                    {!embed && (
                      <a
                        href={v.video_url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
                      >
                        Watch video
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
