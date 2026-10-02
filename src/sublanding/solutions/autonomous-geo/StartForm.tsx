import { useEffect, useId, useState } from "react";
import { ArrowRight, Globe, Loader2 } from "lucide-react";
import { startSignup } from "@/sublanding/_shared/facts";
import { cn } from "@/lib/utils";
import { START } from "./content";

/**
 * The page's one action: carry the visitor's site into signup, where
 * onboarding plans their first month. An empty field is fine (onboarding
 * asks again), so there's no error state to show; the pending state covers
 * the full-page navigation to /auth.
 */
export function StartForm({ className }: { className?: string }) {
  const id = useId();
  const [url, setUrl] = useState("");
  const [pending, setPending] = useState(false);

  // Coming back with the browser's back button restores this page from the
  // cache with the spinner still on; reset it so the form works again.
  useEffect(() => {
    const reset = (e: PageTransitionEvent) => e.persisted && setPending(false);
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (pending) return;
        setPending(true);
        startSignup(url);
      }}
      className={cn(
        "flex w-full max-w-md items-center gap-1.5 rounded-xl border border-border bg-card p-1.5 shadow-2 transition-shadow",
        "focus-within:border-cta/50 focus-within:shadow-3",
        className,
      )}
    >
      <label htmlFor={id} className="sr-only">
        {START.label}
      </label>
      <Globe aria-hidden className="ml-2.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <input
        id={id}
        type="text"
        inputMode="url"
        autoComplete="url"
        spellCheck={false}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder={START.placeholder}
        className="min-w-0 flex-1 bg-transparent py-2.5 pr-1 text-sm text-ink outline-none placeholder:text-muted-foreground"
      />
      <button
        type="submit"
        aria-busy={pending}
        className={cn(
          "inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-cta px-3.5 text-sm font-semibold text-white transition-colors hover:bg-cta-hover sm:px-4",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 focus-visible:ring-offset-card",
          pending && "cursor-progress",
        )}
      >
        {pending ? (
          <>
            <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
            {START.pending}
          </>
        ) : (
          <>
            <span className="max-[400px]:hidden">{START.cta}</span>
            <span className="hidden max-[400px]:inline">{START.ctaShort}</span>
            <ArrowRight aria-hidden className="h-4 w-4 max-[400px]:hidden" />
          </>
        )}
      </button>
    </form>
  );
}
