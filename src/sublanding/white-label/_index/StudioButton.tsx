import type { MouseEvent } from "react";
import { ArrowRight } from "lucide-react";
import { STUDIO_SIGNUP_HREF, startStudioSignup } from "@/sublanding/_shared/facts";
import { cn } from "@/lib/utils";
import { CTA } from "./content";

/**
 * The page's one call to action: sign up and land on Studio. A real link to
 * /auth?intent=studio, so it works before hydration and in a new tab; with
 * JavaScript it goes through startStudioSignup, which also remembers the
 * intent across the OAuth round trip.
 */
export function StudioButton({ className }: { className?: string }) {
  const go = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    e.preventDefault();
    startStudioSignup();
  };
  return (
    <a
      href={STUDIO_SIGNUP_HREF}
      onClick={go}
      className={cn(
        "group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-cta px-5 text-[0.95rem] font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-cta-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25 active:scale-[0.985] motion-reduce:transition-none",
        className,
      )}
    >
      {CTA.label}
      <ArrowRight
        aria-hidden
        className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none"
      />
    </a>
  );
}
