import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, LogOut, ShieldCheck } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useIsAdmin } from "@/lib/session";
import { supabase } from "@/integrations/supabase/client";

const links = [
  { to: "/", label: "Home" },
  { to: "/free-learning", label: "Free Learning" },
  { to: "/shopping", label: "Shopping" },
  { to: "/insurance", label: "Insurance" },
  { to: "/finance", label: "Finance" },
  { to: "/jobs", label: "Jobs" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin } = useIsAdmin();
  const navigate = useNavigate();

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  const navLink = (to: string, label: string) => (
    <Link
      key={to}
      to={to}
      onClick={() => setOpen(false)}
      className="rounded-full px-5 py-2 text-sm  font-medium  text-gray-900 transition-all duration-300 hover:bg-white hover:text-red-600 hover:shadow-sm "
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-4 z-50 px-4">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl border border-gray-200/70 bg-white/90 px-6 shadow-lg backdrop-blur-xl">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 shrink-0"
        >
          <Logo />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center rounded-full  bg-white gap-2">
          {links.map((l) => navLink(l.to, l.label))}
        </div>

        {/* Right Buttons */}
        <div className="hidden lg:flex items-center gap-4">

          {isAdmin && (
            <Button
              asChild
              size="sm"
              className="rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-5 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-red-700 hover:to-orange-600"
            >
              <Link to="/admin">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Admin
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
              Sign out
            </Button>
          ) : (
            <Button
              asChild
              size="sm"
            >
              <Link to="/auth">
                Sign In
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="rounded-full p-2 text-gray-700 transition hover:bg-gray-100 lg:hidden"
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
        <div className="mx-auto mt-3 max-w-7xl rounded-3xl border border-gray-200 bg-white p-5 shadow-2xl lg:hidden">
          <div className="flex flex-col gap-2">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: l.to === "/" }}
                className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-red-50 hover:text-red-600" activeProps={{
                  className:
                    "rounded-xl bg-red-600 text-white font-semibold px-4 py-3 shadow",
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3">

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
                  Admin
                </Link>
              </Button>
            )}

            {user ? (
              <Button
                variant="outline"
                onClick={signOut}
                className="w-full rounded-xl border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
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
                  Sign In
                </Link>
              </Button>
            )}

          </div>
        </div>
      )}
    </header>
  );
}