
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, CreditCard, ExternalLink } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";

import axisFlipkartLogo from "@/assets/AXIS FLIPART.jpeg";
import axisPrivilegeCardsLogo from "@/assets/AXIS PREVELAGE CARDS.jpeg";
import axisMyZoneLogo from "@/assets/AXISMYZONE.jpeg";
import hdfcRupayLogo from "@/assets/HDFC RUPAY.jpeg";
import hdfcPixelLogo from "@/assets/HDFX PIXEL.jpeg";
import hsbcPlatinumLogo from "@/assets/HSBS PLATINUM CARD.jpeg";
import idfcFirstCreditCardLogo from "@/assets/IDFC FIRST CREDIT CARD.jpeg";
import kotakLeagueLogo from "@/assets/KOTAK LEAGUE.jpeg";
import sbiCardLogo from "@/assets/SBICARD.jpeg";
import sbmNovoLogo from "@/assets/SBM NOVIO.jpeg";
import sbmZetLogo from "@/assets/SBM ZET.jpeg";
import scapiaLogo from "@/assets/SCAPIA.jpeg";

export const Route = createFileRoute("/credit-cards")({
  component: CreditCardsPage,
});

const creditCards = [
  {
    id: 1,
    name: "HSBC Platinum Credit Card",
    category: "Rewards",
    bank: "HSBC",
    image: hsbcPlatinumLogo,
    href: "https://www.accountopening.hsbc.bank.in/credit-cards-application/journey/contact-details/VPC",
  },
  {
    id: 2,
    name: "SBI SimplyCLICK Card",
    category: "Shopping",
    bank: "SBI",
    image: sbiCardLogo,
    href: "https://www.sbicard.com/sprint/simplyClick?CS=org",
  },
  {
    id: 3,
    name: "Axis Flipkart Card",
    category: "Shopping",
    bank: "Axis Bank",
    image: axisFlipkartLogo,
    href: "https://web.axis.bank.in/DigitalChannel/WebForm/?index9&axisreferralcode=AXCp1Lfkwi",
  },
  {
    id: 4,
    name: "Axis Privilege Card",
    category: "Rewards",
    bank: "Axis Bank",
    image: axisPrivilegeCardsLogo,
    href: "https://axis.bankkaro.com/listing",
  },
  {
    id: 5,
    name: "Axis MyZone Card",
    category: "Lifestyle",
    bank: "Axis Bank",
    image: axisMyZoneLogo,
    href: "https://web.axis.bank.in/DigitalChannel/WebForm/?index9&axisreferralcode=AXOhAlOqvC",
  },
  {
    id: 6,
    name: "HDFC RuPay Card",
    category: "Shopping",
    bank: "HDFC Bank",
    image: hdfcRupayLogo,
    href: "https://applyonline.hdfc.bank.in/cards/credit-cards?CHANNELSOURCE=RUPY&DSACode=XPPI&LGcode=DGPI&LCcode=XPPI&LC2=RUEGN92o5k&SMcode=K10443#nbb",
  },
  {
    id: 7,
    name: "HDFC Pixel Card",
    category: "Lifestyle",
    bank: "HDFC Bank",
    image: hdfcPixelLogo,
    href: "https://pixel.hdfc.bank.in/omnisource/?sourcing.assist.channelCode=DSA&sourcing.assist.lgCode=XPPI&sourcing.assist.lc1Code=XPPI&sourcing.assist.lc2Code=PXhTE7av&sourcing.assist.smCode=K10443&sourcing.assist.dsaCode=XPPI",
  },
  {
    id: 8,
    name: "IDFC FIRST Credit Card",
    category: "Rewards",
    bank: "IDFC FIRST Bank",
    image: idfcFirstCreditCardLogo,
    href: "https://my.idfcfirst.bank.in/apply/cc",
  },
  {
    id: 9,
    name: "Kotak League Card",
    category: "Rewards",
    bank: "Kotak Mahindra Bank",
    image: kotakLeagueLogo,
    href: "https://onboarding.kotak.bank.in/cc/card-details?channelCode=96&feeCode=111&productLogo=785",
  },
  {
    id: 10,
    name: "SBM Novo Card",
    category: "Lifestyle",
    bank: "SBM Bank",
    image: sbmNovoLogo,
    href: "https://linkredirect.in/visitproduct/3151/PPS276-Sbm-novio-catcard-100?id=4701713&shareid=wRUl5XU",
  },
  {
    id: 11,
    name: "SBM Zet Card",
    category: "Lifestyle",
    bank: "SBM Bank",
    image: sbmZetLogo,
    href: "https://linkredirect.in/visitproduct/3151/PPS276-Sbm-novio-catcard-100?id=4701713&shareid=wRUl5XU",
  },
  {
    id: 12,
    name: "Scapia Card",
    category: "Travel",
    bank: "Federal Bank",
    image: scapiaLogo,
    href: "https://linkredirect.in/visitproduct/2588/PPS325-Federal-catcard-100?id=4701713&shareid=3vMzgNu",
  },
];

function CreditCardsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Shopping",
    "Rewards",
    "Lifestyle",
    "Travel",
  ];

  const filteredCards = creditCards.filter((card) => {
    const matchesSearch =
      card.name.toLowerCase().includes(search.toLowerCase()) ||
      card.bank.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      card.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <SiteLayout>
      <main className="mx-auto min-h-screen max-w-7xl px-4 py-12 sm:px-6">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Explore Credit Cards
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Discover credit cards from leading banks. Explore rewards,
            cashback, shopping benefits, and travel privileges.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-7 max-w-lg">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search credit cards or banks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-background py-3 pl-12 pr-4 outline-none transition focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Categories */}
        <div className="mb-9 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${selectedCategory === category
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:bg-accent"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Results Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            All Credit Cards
          </h2>
          <span className="text-sm text-muted-foreground">
            {filteredCards.length} cards found
          </span>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCards.map((card) => (
            <article
              key={card.id}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Card Image */}
              <div className="flex h-64 items-center justify-center overflow-hidden bg-muted/20 p-5">
                <img
                  src={card.image}
                  alt={card.name}
                  loading="lazy"
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Card Information */}
              <div className="border-t border-border p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {card.category}
                  </span>
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </div>

                <h3 className="text-lg font-semibold">
                  {card.name}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {card.bank}
                </p>

                <a
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                  Explore Card
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filteredCards.length === 0 && (
          <div className="py-20 text-center">
            <CreditCard className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-semibold">
              No credit cards found
            </h3>
            <p className="mt-2 text-muted-foreground">
              Try another search or category.
            </p>
          </div>
        )}

      </main>
    </SiteLayout>
  );
}
