import type { ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { signInWithProvider } from "@/lib/auth";
import { listSites } from "@/lib/data";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden fill="currentColor">
      <path d="M12 1.5a10.5 10.5 0 0 0-3.32 20.47c.53.1.72-.23.72-.5v-1.8c-2.92.64-3.54-1.25-3.54-1.25-.48-1.22-1.17-1.54-1.17-1.54-.96-.66.07-.64.07-.64 1.06.07 1.61 1.09 1.61 1.09.94 1.6 2.47 1.14 3.07.87.1-.68.37-1.14.67-1.4-2.33-.27-4.78-1.17-4.78-5.2 0-1.15.41-2.09 1.08-2.83-.11-.27-.47-1.34.1-2.8 0 0 .88-.28 2.88 1.08a9.9 9.9 0 0 1 5.24 0c2-1.36 2.88-1.08 2.88-1.08.57 1.46.21 2.53.1 2.8.67.74 1.08 1.68 1.08 2.83 0 4.04-2.46 4.93-4.8 5.19.38.33.72.97.72 1.96v2.9c0 .28.19.61.73.5A10.5 10.5 0 0 0 12 1.5Z" />
    </svg>
  );
}

function SocialButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-ink/[0.1] bg-white px-4 text-[0.9rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-[border-color,background-color,box-shadow] duration-200 hover:border-ink/[0.18] hover:bg-ink/[0.02] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/20"
    >
      {children}
    </button>
  );
}

/** A provider we mean to support, shown so people know it is coming. */
function ComingSoonButton({ children, label }: { children: ReactNode; label: string }) {
  return (
    <button
      type="button"
      disabled
      aria-label={`${label} sign-in — coming soon`}
      title="Coming soon"
      className="group relative inline-flex h-11 w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-lg border border-dashed border-ink/[0.14] bg-white px-4 text-[0.9rem] font-medium text-muted-foreground"
    >
      {children}
      <span className="absolute -top-2 right-2 rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-cta ring-1 ring-cta/20">
        Soon
      </span>
    </button>
  );
}

/**
 * Google is the only provider that works. GitHub sits beside it as a disabled
 * "soon" tile: it is off in Supabase, so a live button would only ever error.
 * Apple was removed outright — it needs a paid developer account.
 */
export function SocialButtons({ returnPath }: { returnPath?: string }) {
  const navigate = useNavigate();

  async function signInWithGoogle() {
    try {
      const outcome = await signInWithProvider(
        "google",
        window.location.origin + (returnPath ?? "/onboarding"),
      );
      if (outcome === "redirected") return;
      if (returnPath) {
        window.location.assign(returnPath);
        return;
      }
      const sites = await listSites();
      navigate({ to: sites.length > 0 ? "/dashboard" : "/onboarding" });
    } catch {
      toast.error("Could not sign in with Google. Please try again.");
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <SocialButton onClick={signInWithGoogle}>
        <GoogleIcon /> Google
      </SocialButton>
      <ComingSoonButton label="GitHub">
        <GitHubIcon /> GitHub
      </ComingSoonButton>
    </div>
  );
}
