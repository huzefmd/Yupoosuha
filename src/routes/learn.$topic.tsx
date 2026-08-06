import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check, ExternalLink } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useContent } from "@/lib/content";
import { getLearnTopic, type LearnTopic } from "@/lib/learn-topics";

type LearnLink = { id: string; topic: string; label: string; description: string; url: string };


export const Route = createFileRoute("/learn/$topic")({
  loader: ({ params }) => {
    const topic = getLearnTopic(params.topic);
    if (!topic) throw notFound();
    return { topic };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Lesson unavailable | Yupoosuha" }, { name: "robots", content: "noindex" }],
      };
    }
    const { topic } = loaderData;
    const title = `${topic.name} Explained — Free Lesson | Yupoosuha`;
    return {
      meta: [
        { title },
        { name: "description", content: topic.tagline },
        { property: "og:title", content: title },
        { property: "og:description", content: topic.tagline },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: TopicNotFound,
  component: LearnTopicPage,
});

function TopicNotFound() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Learn"
        title="Lesson not found"
        subtitle="That topic doesn't exist yet. Browse our free learning videos instead."
      />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <Button asChild>
          <Link to="/free-learning">Go to Free Learning</Link>
        </Button>
      </div>
    </SiteLayout>
  );
}

function LearnTopicPage() {
  const { topic } = Route.useLoaderData() as { topic: LearnTopic };
  const { data: links } = useContent<LearnLink>("learn_links");
  const topicLinks = (links ?? []).filter((l) => l.topic === topic.slug);


  return (
    <SiteLayout>
      <PageHeader eyebrow="Learn" title={topic.name} subtitle={topic.tagline} />

      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <img
          src={topic.image}
          alt={`${topic.name} illustration`}
          loading="lazy"
          width={1024}
          height={768}
          className="w-full rounded-2xl border border-border bg-card"
        />
        <p className="mt-8 text-lg text-muted-foreground">{topic.intro}</p>

        {topic.sections.map((s) => (
          <section key={s.heading} className="mt-10">
            <h2 className="text-xl font-bold tracking-tight">{s.heading}</h2>
            <p className="mt-2 text-muted-foreground">{s.body}</p>
            {s.points && (
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {s.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </article>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="rounded-3xl border border-border bg-secondary/40 p-8 sm:p-10">
          <h2 className="text-2xl font-bold tracking-tight">You've finished the lesson</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Here's what you can do next — put it into practice, or keep learning.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {topic.nextSteps.map((step) => (
              <Link
                key={step.to}
                to={step.to}
                className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-lift"
              >
                <h3 className="font-semibold">{step.label}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{step.description}</p>
                <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                  Continue
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>

          {topicLinks.length > 0 && (
            <div className="mt-10">
              <h3 className="text-lg font-bold tracking-tight">Recommended links</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {topicLinks.map((l) => (
                  <a
                    key={l.id}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-lift"
                  >
                    <span className="font-semibold">{l.label}</span>
                    {l.description && (
                      <span className="mt-1.5 text-sm text-muted-foreground">{l.description}</span>
                    )}
                    <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                      Open link
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

    </SiteLayout>
  );
}
