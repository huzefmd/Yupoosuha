import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, ExternalLink, MapPin } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useContent } from "@/lib/content";

type Job = {
  id: string;
  title: string;
  company: string | null;
  location: string | null;
  job_type: string | null;
  description: string | null;
  image_url: string | null;
  link: string | null;
};

export const Route = createFileRoute("/jobs")({
  head: () => ({
    meta: [
      { title: "Jobs & Freelance Work | Yupoosuha" },
      {
        name: "description",
        content:
          "Browse freelance gigs and job openings curated by Yupoosuha for people building real money and work skills.",
      },
      { property: "og:title", content: "Jobs & Freelance Work | Yupoosuha" },
      {
        property: "og:description",
        content: "Freelance and job opportunities curated by Yupoosuha.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Jobs,
});

function Jobs() {
  const { data, isLoading } = useContent<Job>("jobs");

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Jobs"
        title="Freelance gigs & job openings"
        subtitle="Opportunities curated for people building their skills with Yupoosuha."
      />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : !data?.length ? (
          <div className="flex flex-col items-center py-16 text-center">
            <span className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-yellow/40 text-accent-foreground">
              <Briefcase className="h-9 w-9" />
            </span>
            <h2 className="mt-8 text-2xl font-bold tracking-tight">No openings right now</h2>
            <p className="mt-3 text-muted-foreground">
              We're putting together freelance gigs and job openings. Check back shortly.
            </p>
            <Button asChild className="mt-8">
              <Link to="/contact">Tell us what you're looking for</Link>
            </Button>
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2">
            {data.map((job) => (
              <li
                key={job.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card"
              >
                {job.image_url && (
                  <img
                    src={job.image_url}
                    alt={job.title}
                    loading="lazy"
                    className="h-40 w-full object-cover"
                  />
                )}
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-lg font-semibold">{job.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {[job.company, job.job_type].filter(Boolean).join(" · ")}
                  </p>
                  {job.location && (
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" /> {job.location}
                    </p>
                  )}
                  {job.description && (
                    <p className="mt-3 text-sm text-muted-foreground">{job.description}</p>
                  )}
                  {job.link && (
                    <Button asChild className="mt-4 self-start" size="sm">
                      <a href={job.link} target="_blank" rel="noopener noreferrer">
                        Apply now <ExternalLink className="ml-1.5 h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SiteLayout>
  );
}
