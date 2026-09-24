
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import {
  Menu,
  X,
  LogOut,
  ShieldCheck,
  Languages,
  Sun,
  Moon,
} from "lucide-react";

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
  const [mounted, setMounted] = useState(false);

  const { language, setLanguage, t } = useLanguage();
  const { user, isAdmin } = useIsAdmin();
  const { theme, setTheme } = useTheme();

  const navigate = useNavigate();

  // Prevent server/client theme icon mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out failed:", error.message);
      return;
    }

    setOpen(false);
    navigate({ to: "/" });
  };

  const navLink = (to: string, labelKey: string) => (
    <Link
      key={to}
      to={to}
      onClick={() => setOpen(false)}
      className="rounded-full px-5 py-2 text-sm font-medium text-foreground transition-all duration-300 hover:bg-accent hover:text-primary hover:shadow-sm"
    >
      {t(labelKey)}
    </Link>
  );

  return (
    <header className="sticky top-4 z-50 px-4">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl border border-border/70 bg-card/90 px-6 shadow-lg backdrop-blur-xl">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <Logo />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-2 rounded-full bg-card lg:flex">
          {links.map((link) => navLink(link.to, link.label))}
        </div>

        {/* Desktop Right Buttons */}
        <div className="hidden items-center gap-4 lg:flex">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="rounded-full px-3 hover:bg-accent"
            aria-label="Toggle theme"
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Moon className="h-4 w-4 text-muted-foreground" />
              )
            ) : (
              <span className="h-4 w-4" />
            )}
          </Button>

          {/* Language Selector */}
          <div className="flex items-center gap-2 px-2">
            <Languages className="h-4 w-4 text-muted-foreground" />

            <Select
              value={language}
              onValueChange={setLanguage}
            >
              <SelectTrigger className="h-8 w-[110px] rounded-full border-none bg-transparent px-2 text-xs font-medium shadow-none focus:ring-0">
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

          {/* Admin Button */}
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

          {/* Sign In / Sign Out */}
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
            <Button asChild size="sm">
              <Link to="/auth">{t("nav.signin")}</Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="rounded-full p-2 text-foreground transition hover:bg-accent lg:hidden"
          onClick={() => setOpen((previous) => !previous)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
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
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: link.to === "/" }}
                className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-primary/10 hover:text-primary"
                activeProps={{
                  className:
                    "rounded-xl bg-primary text-primary-foreground font-semibold px-4 py-3 shadow",
                }}
              >
                {t(link.label)}
              </Link>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3">
            {/* Mobile Theme Toggle */}
            <Button
              variant="outline"
              onClick={toggleTheme}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-border bg-card text-foreground hover:bg-accent"
            >
              {mounted ? (
                theme === "dark" ? (
                  <>
                    <Sun className="h-4 w-4" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4" />
                    <span>Dark Mode</span>
                  </>
                )
              ) : (
                <span className="h-4 w-4" />
              )}
            </Button>

            {/* Mobile Language Selector */}
            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted px-2 py-2">
              <Languages className="h-4 w-4 text-muted-foreground" />

              <span className="text-xs font-medium text-muted-foreground">
                Language
              </span>

              <Select
                value={language}
                onValueChange={setLanguage}
              >
                <SelectTrigger className="h-8 flex-1 rounded-lg border-none bg-card text-xs shadow-none focus:ring-0">
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

            {/* Mobile Admin Button */}
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

            {/* Mobile Sign In / Sign Out */}
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