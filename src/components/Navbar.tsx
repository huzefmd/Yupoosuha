import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, LogOut, ShieldCheck, Languages, Sun, Moon } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsAdmin } from "@/lib/session";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/lib/language-context";
import { useTheme } from "@/lib/theme-provider";

const links = [
  { to: "/", label: "nav.home" },
  { to: "/free-learning", label: "nav.free_learning" },
  { to: "/shopping", label: "nav.shopping" },
  { to: "/insurance", label: "nav.insurance" },
  { to: "/finance", label: "nav.finance" },
  { to: "/jobs", label: "nav.jobs" },
  { to: "/contact", label: "nav.contact" },
] as const;

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "mr", label: "मराठी" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "te", label: "తెలుగు" },
  { code: "ml", label: "മലയാളം" },
  { code: "ta", label: "தமிழ்" },
  { code: "ur", label: "اردو" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, isAdmin } = useIsAdmin();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  const navLink = (to: string, labelKey: string) => (
    <Link
      key={to}
      to={to}
      onClick={() => setOpen(false)}
      className="rounded-full px-5 py-2 text-sm  font-medium  text-foreground transition-all duration-300 hover:bg-accent hover:text-primary hover:shadow-sm "
    >
      {t(labelKey)}
    </Link>
  );

  return (
    <header className="sticky top-4 z-50 px-4">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl border border-border/70 bg-card/90 px-6 shadow-lg backdrop-blur-xl">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 shrink-0"
        >
          <Logo />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center rounded-full  bg-card gap-2">
          {links.map((l) => navLink(l.to, l.label))}
        </div>

        {/* Right Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full px-3 hover:bg-accent"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Moon className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
          <div className="flex items-center gap-2 px-2">
            <Languages className="h-4 w-4 text-muted-foreground" />
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="h-8 w-[110px] rounded-full border-none bg-transparent px-2 text-xs font-medium focus:ring-0 shadow-none">
                <SelectValue placeholder="Lang" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isAdmin && (
            <Button
              asChild
              size="sm"
              className="rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-5 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-red-700 hover:to-orange-600"
            >
              <Link to="/admin">
                <ShieldCheck className="mr-2 h-4 w-4" />
                {t("nav.admin")}
              </Link>
            </Button>
          )}

          {user ? (
            <Button
              size="sm"
              variant="outline"
              onClick={signOut}
              className="rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-5 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-red-700 hover:to-orange-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t("nav.signout")}
            </Button>
          ) : (
            <Button
              asChild
              size="sm"
            >
              <Link to="/auth">
                {t("nav.signin")}
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="rounded-full p-2 text-foreground transition hover:bg-accent lg:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="mx-auto mt-3 max-w-7xl rounded-3xl border border-border bg-card p-5 shadow-2xl lg:hidden">
          <div className="flex flex-col gap-2">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: l.to === "/" }}
                className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-primary/10 hover:text-primary" activeProps={{
                  className:
                    "rounded-xl bg-primary text-primary-foreground font-semibold px-4 py-3 shadow",
                }}
              >
                {t(l.label)}
              </Link>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3">
            <Button
              variant="outline"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-full rounded-xl border-border bg-card text-foreground hover:bg-accent flex items-center justify-center gap-2"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-4 w-4" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" />
                  <span>Dark Mode</span>
                </>
              )}
            </Button>
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-muted border border-border">
              <Languages className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Language</span>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="h-8 flex-1 rounded-lg border-none bg-card text-xs focus:ring-0 shadow-none">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isAdmin && (
              <Button
                asChild
                className="w-full rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md"
              >
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  {t("nav.admin")}
                </Link>
              </Button>
            )}

            {user ? (
              <Button
                variant="outline"
                onClick={signOut}
                className="w-full rounded-xl border-border bg-card text-foreground hover:bg-accent"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t("nav.signout")}
              </Button>
            ) : (
              <Button
                asChild
                className="w-full rounded-xl bg-red-600 text-white hover:bg-red-700"
              >
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                >
                  {t("nav.signin")}
                </Link>
              </Button>
            )}

          </div>
        </div>
      )}
    </header>
  );
}