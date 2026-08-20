import { createFileRoute, Link } from "@tanstack/react-router";

import {
  GraduationCap,
  ShoppingBag,
  ShieldCheck,
  LineChart,
  Briefcase,
  ArrowRight,
  PlayCircle,
  Wallet,
  MessageCircle,
} from "lucide-react";

import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";

import hero from "@/assets/hero.jpg";

import { learnTopics } from "@/lib/learn-topics";
import { IndicesSection } from "@/components/market/IndicesSection";

import angelOneLogo from "@/assets/angel-one.png";
import jmFinancialLogo from "@/assets/jm-financial.jpg";
import hjWealthLogo from "@/assets/hj-wealth.png";
import zFundLogo from "@/assets/z-fund.png";
import creditCardLogo from "@/assets/credit-card.png";
import insuranceLogo from "@/assets/insurance.jpg";

import { useContent, type Deal, type Video, type Insurance } from "@/lib/content";
import { youtubeEmbed } from "@/lib/content";
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
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=70",
    /** Gradient applied as a tinted overlay on top of the image for cohesion. */
    overlay: "from-indigo-900/70 via-violet-900/40 to-transparent",
    accent: "text-indigo-600 dark:text-indigo-400",
  },
  {
    icon: ShoppingBag,
    title: "Shopping Deals",
    text: "Hand-picked offers so your everyday spending stretches further.",
    to: "/shopping",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=70",
    overlay: "from-rose-900/70 via-pink-900/40 to-transparent",
    accent: "text-rose-600 dark:text-rose-400",
  },
  {
    icon: ShieldCheck,
    title: "Insurance Guidance",
    text: "Term, life, health and general cover explained without the jargon.",
    to: "/insurance",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=70",
    overlay: "from-sky-900/70 via-cyan-900/40 to-transparent",
    accent: "text-sky-600 dark:text-sky-400",
  },
  {
    icon: LineChart,
    title: "Finance & Demat",
    text: "Open a free demat account, compare home loans and get account help.",
    to: "/finance",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=70",
    overlay: "from-emerald-900/70 via-teal-900/40 to-transparent",
    accent: "text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: Briefcase,
    title: "Jobs (coming soon)",
    text: "Freelance and job opportunities are on the way — watch this space.",
    to: "/jobs",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=70",
    overlay: "from-amber-900/70 via-orange-900/40 to-transparent",
    accent: "text-amber-600 dark:text-amber-400",
  },
] as const;


const financialServices = [
  {
    name: "Angel One",
    category: "Demat & Trading",
    logo: angelOneLogo,
    href: "https://www.angelone.in/",
  },
  {
    name: "JM Financial",
    category: "Investments & Finance",
    logo: jmFinancialLogo,
    href: "https://www.jmfinancialservices.in/",
  },
  {
    name: "HJ Wealth",
    category: "Wealth Management",
    logo: hjWealthLogo,
    href: "#",
  },
  {
    name: "Z Fund",
    category: "Mutual Funds",
    logo: zFundLogo,
    href: "#",
  },
  {
    name: "Credit Cards",
    category: "Cards & Offers",
    logo: creditCardLogo,
    href: "/finance",
  },
  {
    name: "Insurance",
    category: "Insurance Plans",
    logo: insuranceLogo,
    href: "/insurance",
  },
];

const shoppingPlatforms = [
  {
    name: "Flipkart",
    category: "Online Shopping",
    image: "https://img.logo.dev/brand/flipkart.com/YZbOI1N57Jf810M5gWB6mExEnufspV9T7UMutIJjpPI-y3m7ctcgkENiD0-KEFq4ymCbtAHUdqjgNuf3_LftQJYGj8qYqmDG8v73DK6zOpChhbpH6I8SmxfwcNqJUibRwryIozxTkowt4GhaCfWjJna_el-gLd8V9anLLJqBxrx_rscO2KuUTyf8NWcYm2Aa2wH-ND1WCISXm1FCPYz7MgXDKWIQoMNShYJN?token=live_6a1a28fd-6420-4492-aeb0-b297461d9de2&size=256&retina=true&format=png&theme=dark",
    href: "https://www.flipkart.com/",
  },
  {
    name: "Amazon",
    category: "Everything You Need",
    image: "data:image/png;base64,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",
    href: "https://www.amazon.in/",
  },
  {
    name: "Myntra",
    category: "Fashion & Lifestyle",
    image: "data:image/png;base64,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  ",
    href: "https://www.myntra.com/",
  },
  {
    name: "Meesho",
    category: "Affordable Shopping",
    image: "data:image/png;base64,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",
    href: "https://www.meesho.com/",
  },
  {
    name: "AJIO",
    category: "Fashion & Lifestyle",
    image: "data:image/png;base64,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",
    href: "https://www.ajio.com/",
  },
  {
    name: "Nykaa",
    category: "Beauty & Fashion",
    image: "data:image/png;base64,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",
    href: "https://www.nykaa.com/",
  },
];

const eBankingApps = [
  {
    name: "Google Pay",
    category: "UPI Payments",
    href: "https://pay.google.com/",
    image:
      "https://img.logo.dev/google.com?token=live_6a1a28fd-6420-4492-aeb0-b297461d9de2&size=256&retina=true&format=png&theme=dark",
  },
  {
    name: "PhonePe",
    category: "UPI Payments",
    href: "https://www.phonepe.com/",
    image:
      "https://img.logo.dev/phonepe.com?token=live_6a1a28fd-6420-4492-aeb0-b297461d9de2&size=256&retina=true&format=png&theme=dark",
  },
  {
    name: "Paytm",
    category: "UPI & Wallet",
    href: "https://paytm.com/",
    image:
      "https://img.logo.dev/paytm.com?token=live_6a1a28fd-6420-4492-aeb0-b297461d9de2&size=256&retina=true&format=png&theme=dark",
  },
  {
    name: "BHIM UPI",
    category: "Official UPI App",
    href: "https://www.bhimupi.org.in/",
    image:
      "https://img.logo.dev/bhimupi.org.in?token=live_6a1a28fd-6420-4492-aeb0-b297461d9de2&size=256&retina=true&format=png&theme=dark",
  },
  {
    name: "Amazon Pay",
    category: "UPI & Wallet",
    href: "https://www.amazon.in/amazonpay",
    image:
      "https://img.logo.dev/amazon.in?token=live_6a1a28fd-6420-4492-aeb0-b297461d9de2&size=256&retina=true&format=png&theme=dark",
  },
  {
    name: "Mobikwik",
    category: "UPI & Wallet",
    href: "https://www.mobikwik.com/",
    image:
      "https://img.logo.dev/mobikwik.com?token=live_6a1a28fd-6420-4492-aeb0-b297461d9de2&size=256&retina=true&format=png&theme=dark",
  },
  {
    name: "SBI",
    category: "Net Banking & App",
    href: "https://www.onlinesbi.sbi/",
    image:
      "https://img.logo.dev/sbi.co.in?token=live_6a1a28fd-6420-4492-aeb0-b297461d9de2&size=256&retina=true&format=png&theme=dark",
  },
  {
    name: "HDFC Bank",
    category: "Net Banking & App",
    href: "https://www.hdfcbank.com/",
    image:
      "https://img.logo.dev/hdfcbank.com?token=live_6a1a28fd-6420-4492-aeb0-b297461d9de2&size=256&retina=true&format=png&theme=dark",
  },
  {
    name: "ICICI Bank",
    category: "Net Banking & App",
    href: "https://www.icicibank.com/",
    image:
      "https://img.logo.dev/icicibank.com?token=live_6a1a28fd-6420-4492-aeb0-b297461d9de2&size=256&retina=true&format=png&theme=dark",
  },
  {
    name: "Axis Bank",
    category: "Net Banking & App",
    href: "https://www.axisbank.in/",
    image:
      "https://img.logo.dev/axisbank.com?token=live_6a1a28fd-6420-4492-aeb0-b297461d9de2&size=256&retina=true&format=png&theme=dark",
  },
];

function Home() {

  const { data: shoppingDeals, isLoading: shoppingDealsLoading } =
    useContent<Deal>("shopping_deals");
  const { data: learningVideos, isLoading: learningVideosLoading } =
    useContent<Video>("free_learning_videos");
  const { data: insuranceItems, isLoading: insuranceLoading } =
    useContent<Insurance>("insurance_types");
  return (
    <SiteLayout>
      <IndicesSection />
      <section style={{ background: "var(--gradient-hero)" }} className="py-0">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-0 sm:px-6">
          {/* <div>
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
          </div> */}
          {/* <img
            src={hero}
            alt="Illustration of charts, a shield and a shopping bag representing finance learning"
            className="w-full rounded-2xl"
            loading="eager"
            width={1280}
            height={960}
          /> */}
        </div>
      </section>

      {/* <section className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
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
      </section> */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">

        {/* Section Header */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Start Learning
            </h2>

            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Learn about money, investing and finance.
            </p>
          </div>

          <Link
            to="/free-learning"
            className="shrink-0 text-sm font-medium text-primary hover:underline"
          >
            View All
          </Link>
        </div>

        {/* Learning Cards */}
        <div className="space-y-5">

          {/* ================= FIRST ROW - 3 CARDS ================= */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

            {learnTopics.slice(0, 3).map((t) => (
              <Link
                key={t.slug}
                to="/learn/$topic"
                params={{ topic: t.slug }}
                className="
            group
            relative
            flex
            h-[210px]
            w-full
            flex-col
            overflow-hidden
            rounded-2xl
            border
            border-border
            bg-card
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-lg
          "
              >

                {/* Image */}
                <div className="relative h-[150px] w-full overflow-hidden bg-white">

                  <img
                    src={t.image}
                    alt={`${t.name} lesson`}
                    loading="lazy"
                    width={300}
                    height={200}
                    className="
                h-full
                w-full
                object-contain
                transition-transform
                duration-300
                group-hover:scale-105
              "
                  />

                  {/* Overlay */}
                  <div
                    className="
                absolute
                inset-0
                bg-black/5
                transition-colors
                group-hover:bg-black/0
              "
                  />

                </div>

                {/* Title */}
                <div className="flex flex-1 items-center px-5 py-3">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-tight sm:text-base">
                    {t.name}
                  </h3>
                </div>

              </Link>
            ))}

          </div>


          {/* ================= SECOND ROW - 4 CARDS ================= */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

            {learnTopics.slice(3, 7).map((t) => (
              <Link
                key={t.slug}
                to="/learn/$topic"
                params={{ topic: t.slug }}
                className="
            group
            relative
            flex
            h-[200px]
            w-full
            flex-col
            overflow-hidden
            rounded-2xl
            border
            border-border
            bg-card
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-lg
          "
              >

                {/* Image */}
                <div className="relative h-[140px] w-full overflow-hidden bg-white">

                  <img
                    src={t.image}
                    alt={`${t.name} lesson`}
                    loading="lazy"
                    width={300}
                    height={200}
                    className="
                h-full
                w-full
                object-contain
                transition-transform
                duration-300
                group-hover:scale-105
              "
                  />

                  {/* Overlay */}
                  <div
                    className="
                absolute
                inset-0
                bg-black/5
                transition-colors
                group-hover:bg-black/0
              "
                  />

                </div>

                {/* Title */}
                <div className="flex flex-1 items-center px-4 py-2">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-tight">
                    {t.name}
                  </h3>
                </div>

              </Link>
            ))}

          </div>

        </div>

      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-12">
        {/* Section Header */}
        <div className="mb-7 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Financial Services
            </h2>

            <p className="mt-2 text-base text-muted-foreground sm:text-lg">
              Explore trusted financial products and services.
            </p>
          </div>

          <Link
            to="/finance"
            className="shrink-0 text-sm font-semibold text-primary hover:underline sm:text-base"
          >
            View All
          </Link>
        </div>

        {/* Services */}
        <div className="flex gap-5 overflow-x-auto pb-5 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">          {financialServices.map((service) => {
            const external = service.href.startsWith("http");

            const cardContent = (
              <>
                {/* Original Logo */}
                <div className="flex h-[120px] w-full items-center justify-center bg-white p-6">
                  <img
                    src={service.logo}
                    alt={`${service.name} logo`}
                    loading="lazy"
                    width={160}
                    height={80}
                    className="max-h-[65px] max-w-[130px] object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Name + Category */}
                <div className="flex flex-1 flex-col justify-center px-4 py-3">
                  <h3 className="text-base font-semibold leading-tight">
                    {service.name}
                  </h3>

                  <p className="mt-1.5 line-clamp-1 text-xs text-muted-foreground">
                    {service.category}
                  </p>
                </div>
              </>
            );

            if (external) {
              return (
                <a
                  key={service.name}
                  href={service.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-[190px] w-[190px] min-w-[190px] snap-start flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {cardContent}
                </a>
              );
            }

            return (
              <Link
                key={service.name}
                to={service.href as any}
                className="group flex h-[190px] w-[190px] min-w-[190px] snap-start flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {cardContent}
              </Link>
            );
          })}
        </div>
      </section>





      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="mb-7 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Shopping Platforms
            </h2>

            <p className="mt-2 text-base text-muted-foreground">
              Explore popular online shopping platforms.
            </p>
          </div>

          <Link
            to="/shopping"
            className="text-sm font-medium text-primary hover:underline"
          >
            View All
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative w-full overflow-hidden">
          {/* Left fade */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-background to-transparent" />

          {/* Right fade */}
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-background to-transparent" />

          <div className="shopping-track flex w-max gap-5">
            {/* First set */}
            {shoppingPlatforms.map((platform) => (
              <a
                key={`first-${platform.name}`}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                className="
            group
            flex
            h-[210px]
            w-[245px]
            min-w-[245px]
            flex-col
            overflow-hidden
            rounded-2xl
            border
            border-border
            bg-card
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-xl
          "
              >
                {/* Image */}
                <div className="flex h-[140px] items-center justify-center overflow-hidden bg-white p-7">
                  <img
                    src={platform.image}
                    alt={`${platform.name} logo`}
                    loading="lazy"
                    className="
                max-h-[85px]
                max-w-[160px]
                object-contain
                transition-transform
                duration-300
                group-hover:scale-110
              "
                  />
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-center border-t border-border px-5">
                  <h3 className="text-base font-semibold">
                    {platform.name}
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {platform.category}
                  </p>
                </div>
              </a>
            ))}

            {/* Duplicate set */}
            {shoppingPlatforms.map((platform) => (
              <a
                key={`second-${platform.name}`}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                className="
            group
            flex
            h-[210px]
            w-[245px]
            min-w-[245px]
            flex-col
            overflow-hidden
            rounded-2xl
            border
            border-border
            bg-card
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-xl
          "
              >
                <div className="flex h-[140px] items-center justify-center overflow-hidden bg-white p-7">
                  <img
                    src={platform.image}
                    alt={`${platform.name} logo`}
                    loading="lazy"
                    className="
                max-h-[85px]
                max-w-[160px]
                object-contain
                transition-transform
                duration-300
                group-hover:scale-110
              "
                  />
                </div>

                <div className="flex flex-1 flex-col justify-center border-t border-border px-5">
                  <h3 className="text-base font-semibold">
                    {platform.name}
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {platform.category}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-12">
        {/* Header */}
        <div className="mb-7 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Shopping Products
            </h2>

            <p className="mt-2 text-base text-muted-foreground">
              Discover products and deals worth checking out.
            </p>
          </div>

          <Link
            to="/shopping"
            className="shrink-0 text-sm font-semibold text-primary hover:underline sm:text-base"
          >
            View All
          </Link>
        </div>

        {/* Loading */}
        {shoppingDealsLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[300px] animate-pulse rounded-2xl bg-muted"
              />
            ))}
          </div>
        ) : !shoppingDeals?.length ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <ShoppingBag className="mx-auto h-8 w-8 text-muted-foreground" />

            <p className="mt-3 text-sm text-muted-foreground">
              No shopping products available right now.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {shoppingDeals.slice(0, 10).map((d) => (
              <article
                key={d.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Product Image */}
                <div className="aspect-square overflow-hidden bg-secondary">
                  {d.image_url ? (
                    <img
                      src={d.image_url}
                      alt={d.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <ShoppingBag className="h-8 w-8" />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-tight">
                    {d.title}
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {d.price && (
                      <span className="text-base font-bold">
                        {d.price}
                      </span>
                    )}

                    {d.discount && (
                      <span className="rounded-full bg-brand-yellow/40 px-2 py-0.5 text-[11px] font-semibold text-accent-foreground">
                        {d.discount}
                      </span>
                    )}
                  </div>

                  <Button
                    asChild
                    size="sm"
                    className="mt-4 w-full"
                  >
                    <a
                      href={d.link || "#"}
                      target="_blank"
                      rel="noreferrer noopener sponsored"
                    >
                      Shop Now
                    </a>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>


      

      


      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-12">
        {/* Header */}
        <div className="mb-7 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Free Learning
            </h2>

            <p className="mt-2 text-base text-muted-foreground">
              Watch our free videos on money, investing and smart shopping.
            </p>
          </div>

          <Link
            to="/free-learning"
            className="shrink-0 text-sm font-semibold text-primary hover:underline sm:text-base"
          >
            View All
          </Link>
        </div>

        {/* Loading */}
        {learningVideosLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-72 animate-pulse rounded-2xl bg-muted"
              />
            ))}
          </div>
        ) : !learningVideos?.length ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <PlayCircle className="mx-auto h-8 w-8 text-muted-foreground" />

            <p className="mt-3 text-sm text-muted-foreground">
              No free learning videos published yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {learningVideos.slice(0, 6).map((v) => {
              const embed = youtubeEmbed(v.video_url);
              return (
                <article
                  key={v.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Video thumbnail / embed */}
                  <div className="aspect-video overflow-hidden bg-secondary">
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
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <PlayCircle className="h-10 w-10" />
                      </div>
                    )}
                  </div>

                  {/* Video details */}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="line-clamp-2 text-base font-semibold leading-tight">
                      {v.title}
                    </h3>

                    {v.description && (
                      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                        {v.description}
                      </p>
                    )}

                    {!embed && (
                      <a
                        href={v.video_url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        <PlayCircle className="h-4 w-4" />
                        Watch video
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-12">
        {/* Header */}
        <div className="mb-7 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Insurance
            </h2>

            <p className="mt-2 text-base text-muted-foreground">
              Pick the right cover without the jargon — term, life, health and more.
            </p>
          </div>

          <Link
            to="/insurance"
            className="shrink-0 text-sm font-semibold text-primary hover:underline sm:text-base"
          >
            View All
          </Link>
        </div>

        {/* Loading */}
        {insuranceLoading ? (
          <div className="flex gap-6 overflow-hidden">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[340px] w-[360px] min-w-[360px] animate-pulse rounded-3xl bg-muted"
              />
            ))}
          </div>
        ) : !insuranceItems?.length ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <ShieldCheck className="mx-auto h-8 w-8 text-muted-foreground" />

            <p className="mt-3 text-sm text-muted-foreground">
              No insurance guides published yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="relative w-full overflow-hidden">
            {/* Left fade */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-background to-transparent" />

            {/* Right fade */}
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-background to-transparent" />

            <div className="shopping-track flex w-max gap-6">
              {/* First set */}
              {insuranceItems.map((item) => {
                const cardContent = (
                  <>
                    {/* Image or icon */}
                    <div className="flex h-[200px] w-full items-center justify-center overflow-hidden bg-secondary">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <ShieldCheck className="h-10 w-10" />
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col gap-2 border-t border-border px-6 py-5">
                      <h3 className="line-clamp-2 text-lg font-semibold leading-tight">
                        {item.title}
                      </h3>

                      <p className="line-clamp-3 text-sm text-muted-foreground">
                        {item.description}
                      </p>

                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                          Learn more
                          <ArrowRight className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </>
                );

                return (
                  <article
                    key={`first-${item.id}`}
                    className="group flex h-[340px] w-[360px] min-w-[360px] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    {cardContent}
                  </article>
                );
              })}

              {/* Duplicate set for seamless loop */}
              {insuranceItems.map((item) => {
                const cardContent = (
                  <>
                    <div className="flex h-[200px] w-full items-center justify-center overflow-hidden bg-secondary">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <ShieldCheck className="h-10 w-10" />
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col gap-2 border-t border-border px-6 py-5">
                      <h3 className="line-clamp-2 text-lg font-semibold leading-tight">
                        {item.title}
                      </h3>

                      <p className="line-clamp-3 text-sm text-muted-foreground">
                        {item.description}
                      </p>

                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                          Learn more
                          <ArrowRight className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </>
                );

                return (
                  <article
                    key={`second-${item.id}`}
                    className="group flex h-[340px] w-[360px] min-w-[360px] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    {cardContent}
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-12">
        {/* Header */}
        <div className="mb-7 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              E-Banking Apps
            </h2>

            <p className="mt-2 text-base text-muted-foreground">
              Quick access to the UPI apps and net banking portals you use most.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {eBankingApps.map((app) => (
            <a
              key={app.name}
              href={app.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-[180px] w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Logo */}
              <div className="flex h-[110px] w-full items-center justify-center overflow-hidden bg-white p-5">
                <img
                  src={app.image}
                  alt={`${app.name} logo`}
                  loading="lazy"
                  className="max-h-[70px] max-w-[140px] object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Details */}
              <div className="flex flex-1 flex-col justify-center border-t border-border px-4 py-3 text-center">
                <h3 className="text-sm font-semibold leading-tight">
                  {app.name}
                </h3>

                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                  {app.category}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Key features
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Everything you need to build confidence with money, in one clean place.
            </p>
          </div>
        </div>
        <div className="mt-2 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link
              key={f.title}
              to={f.to}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Image header with tinted overlay */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-secondary">
                <img
                  src={f.image}
                  alt={f.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Tinted gradient overlay (top-left bias so the icon stays legible) */}
                <div
                  className={
                    "absolute inset-0 bg-gradient-to-br " + f.overlay
                  }
                />

                {/* Floating icon badge (glassmorphic, themed to the feature) */}
                <span className="absolute bottom-3 left-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 shadow-md backdrop-blur transition-transform duration-500 group-hover:scale-110">
                  <f.icon className={"h-5 w-5 " + f.accent} />
                </span>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.text}</p>
                <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                  Explore
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <div className="grid items-center gap-8 rounded-3xl border border-border bg-card p-6 shadow-card sm:p-10 lg:grid-cols-[1fr_auto]">
          {/* Copy + link */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp Channel
            </span>

            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Join our WhatsApp channel
            </h2>

            <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
              Get free stock-market tips, learning videos and curated deals
              straight on WhatsApp. Scan the QR with your phone, or tap the
              button below.
            </p>

            <a
              href="https://www.whatsapp.com/channel/0029VaTSXv865yDLKWr6f80L"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              <MessageCircle className="h-4 w-4" />
              Open WhatsApp channel
            </a>

            <p className="mt-3 text-[11px] text-muted-foreground">
              External link — opens the channel in WhatsApp.
            </p>
          </div>

          {/* QR card — clicking the image opens the same link */}
          <a
            href="https://www.whatsapp.com/channel/0029VaTSXv865yDLKWr6f80L"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Scan or click to open our WhatsApp channel"
            className="group mx-auto flex w-full max-w-xs flex-col items-center gap-3 rounded-2xl border border-border bg-background p-5 transition-shadow hover:shadow-lg sm:mx-0"
          >
            <img
              src={
                "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" +
                encodeURIComponent(
                  "https://www.whatsapp.com/channel/0029VaTSXv865yDLKWr6f80L",
                ) +
                "&color=22c55e"
              }
              alt="WhatsApp channel QR code"
              width={200}
              height={200}
              loading="lazy"
              className="h-48 w-48 rounded-xl border border-border bg-white p-2 transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-xs font-medium text-muted-foreground">
              Scan with your phone camera
            </span>
          </a>
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
