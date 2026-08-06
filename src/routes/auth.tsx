import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogIn } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
// import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In with Google | Yupoosuha" },
      {
        name: "description",
        content:
          "Sign in to Yupoosuha with your Google account to access lessons, insurance guidance and curated finance picks.",
      },
      { property: "og:title", content: "Sign In with Google | Yupoosuha" },
      { property: "og:description", content: "One-click Google sign-in for Yupoosuha." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [busy, setBusy] = useState(false);
  const { user } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate({ to: "/" });
  }, [user, navigate]);

  // 
  const signInWithGoogle = async () => {
    setBusy(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      setBusy(false);
      toast.error(error.message || "Could not sign in with Google");
      return;
    }
  };

  return (
    <SiteLayout>
      <div className="mx-auto flex max-w-md flex-col px-4 py-20 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LogIn className="h-5 w-5" />
          </span>
          <h1 className="mt-5 text-2xl font-bold tracking-tight">Sign in to Yupoosuha</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Continue with your Google account — nothing to remember, no password needed.
          </p>
          <Button onClick={signInWithGoogle} className="mt-6 w-full" disabled={busy}>
            {busy ? "Opening Google…" : "Continue with Google"}
          </Button>
        </div>
      </div>
    </SiteLayout>
  );
}
