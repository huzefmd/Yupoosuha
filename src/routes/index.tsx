import { createFileRoute, Link } from "@tanstack/react-router";
import {
  GraduationCap,
  ShoppingBag,
  ShieldCheck,
  LineChart,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero.jpg";
import { learnTopics } from "@/lib/learn-topics";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Yupoosuha — Learn Money, Markets & Smart Shopping" },
      {
        name: "description",
        content:
          "Yupoosuha teaches the stock market, insurance, personal finance and smart shopping in plain language, with free videos and curated links.",
      },
      { property: "og:title", content: "Yupoosuha — Learn Money, Markets & Smart Shopping" },
      {
        property: "og:description",
        content:
          "Free learning videos, insurance guidance, demat account help and curated shopping deals — all in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const features = [
  {
    icon: GraduationCap,
    title: "Free Learning",
    text: "Short, practical videos on the stock market, investing basics and money habits.",
    to: "/free-learning",
  },
  {
    icon: ShoppingBag,
    title: "Shopping Deals",
    text: "Hand-picked offers so your everyday spending stretches further.",
    to: "/shopping",
  },
  {
    icon: ShieldCheck,
    title: "Insurance Guidance",
    text: "Term, life, health and general cover explained without the jargon.",
    to: "/insurance",
  },
  {
    icon: LineChart,
    title: "Finance & Demat",
    text: "Open a free demat account, compare home loans and get account help.",
    to: "/finance",
  },
  {
    icon: Briefcase,
    title: "Jobs (coming soon)",
    text: "Freelance and job opportunities are on the way — watch this space.",
    to: "/jobs",
  },
] as const;

function Home() {
  return (
    <SiteLayout>
      <section style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center rounded-full bg-brand-yellow/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent-foreground">
              Financial literacy, made simple
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Learn money the way it should have been taught.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Yupoosuha is a free learning platform for the stock market, insurance, personal
              finance and smart shopping — with freelance and job opportunities coming soon.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/free-learning">
                  Start learning <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/auth">Sign in with email</Link>
              </Button>
            </div>
          </div>
          <img
            src={hero}
            alt="Illustration of charts, a shield and a shopping bag representing finance learning"
            className="w-full rounded-2xl"
            loading="eager"
            width={1280}
            height={960}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Start learning</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Pick a topic, read the short lesson, then take the next step — buy cover, open an account
          or watch more free videos.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {learnTopics.map((t) => (
            <Link
              key={t.slug}
              to="/learn/$topic"
              params={{ topic: t.slug }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-shadow hover:shadow-lift"
            >
              <div className="aspect-[4/3] overflow-hidden bg-secondary">
                <img
                  src={t.image}
                  alt={`${t.name} lesson`}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-semibold">{t.name}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{t.tagline}</p>
                <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                  Learn now
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Key features</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Everything you need to build confidence with money, in one clean place.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link
              key={f.title}
              to={f.to}
              className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-shadow hover:shadow-lift"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.text}</p>
              <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                Explore <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">

        <div className="rounded-3xl bg-ink px-8 py-14 text-center text-ink-foreground">
          <h2 className="text-2xl font-bold sm:text-3xl">Ready to get started?</h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-foreground/70">
            Sign in with just your email — no password needed — and explore every free resource on
            Yupoosuha.
          </p>
          <Button asChild size="lg" className="mt-7">
            <Link to="/auth">Sign in / Explore</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
