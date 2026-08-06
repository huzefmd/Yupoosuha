import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Learn the stock market, insurance and personal finance in plain language — and shop
            smarter while you do it.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Explore</p>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li><Link to="/free-learning" className="hover:text-foreground">Free Learning</Link></li>
            <li><Link to="/shopping" className="hover:text-foreground">Shopping</Link></li>
            <li><Link to="/insurance" className="hover:text-foreground">Insurance</Link></li>
            <li><Link to="/finance" className="hover:text-foreground">Finance</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Company</p>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li><Link to="/jobs" className="hover:text-foreground">Jobs</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link to="/auth" className="hover:text-foreground">Sign in</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Yupoosuha. Educational content only — not investment advice.
      </div>
    </footer>
  );
}
