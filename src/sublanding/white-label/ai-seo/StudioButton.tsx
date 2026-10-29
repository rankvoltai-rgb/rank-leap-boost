import { useEffect, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { STUDIO_SIGNUP_HREF, startStudioSignup } from "@/sublanding/_shared/facts";
import { cn } from "@/lib/utils";

/**
 * The page's one action: an agency sign-up that lands on Studio once
 * onboarding and the card step are done. A real link to /auth?intent=studio,
 * so it works before JavaScript loads; with JavaScript it also stores the
 * intent, which survives the OAuth round trip the query string doesn't.
 */
export function StudioButton({
  label,
  pending: pendingLabel,
  className,
}: {
  label: string;
  pending: string;
  className?: string;
}) {
  const [pending, setPending] = useState(false);

  // Back-button restores from the page cache keep the spinner; reset it.
  useEffect(() => {
    const reset = (e: PageTransitionEvent) => e.persisted && setPending(false);
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  return (
    <a
      href={STUDIO_SIGNUP_HREF}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        if (pending) return;
        setPending(true);
        startStudioSignup();
      }}
      aria-busy={pending}
      className={cn(
        "group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-cta px-5 text-[0.95rem] font-semibold text-white shadow-sm transition-colors hover:bg-cta-hover",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        pending && "cursor-progress",
        className,
      )}
    >
      {pending ? (
        <>
          <Loader2 aria-hidden className="h-4 w-4 animate-spin motion-reduce:animate-none" />
          {pendingLabel}
        </>
      ) : (
        <>
          {label}
          <ArrowRight
            aria-hidden
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </>
      )}
    </a>
  );
}
