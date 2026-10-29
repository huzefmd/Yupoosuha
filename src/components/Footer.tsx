import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

const exploreLinks = [
  { label: "Free Learning", to: "/free-learning" },
  { label: "Smart Shopping", to: "/shopping" },
  { label: "Insurance", to: "/insurance" },
  { label: "Personal Finance", to: "/finance" },
];

const companyLinks = [
  { label: "Careers", to: "/jobs" },
  { label: "Contact Us", to: "/contact" },
  { label: "Sign In", to: "/auth" },
];

const legalLinks = [
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Disclaimer", to: "/disclaimer" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8 lg:py-16">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Logo />

            <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
              Making money and markets easier to understand. Learn about
              investing, insurance, personal finance, and smarter shopping
              — all in one place.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Learn better. Decide smarter.
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-foreground">
              Explore
            </h3>

            <ul className="mt-4 space-y-3">
              {exploreLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-foreground">
              Company
            </h3>

            <ul className="mt-4 space-y-3">
              {companyLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-foreground">
              Legal
            </h3>

            <ul className="mt-4 space-y-3">
              {legalLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-border py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-muted-foreground">
            © {currentYear} Yupoosuha. All rights reserved.
          </p>

          <p className="max-w-2xl text-xs leading-5 text-muted-foreground sm:text-right">
            For educational purposes only. Content is not financial,
            investment, tax, or legal advice. Always do your own research
            before making financial decisions.
          </p>
        </div>
      </div>
    </footer>
  );
}