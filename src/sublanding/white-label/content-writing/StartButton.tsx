import { ArrowRight } from "lucide-react";
import { STUDIO_SIGNUP_HREF, startStudioSignup } from "@/sublanding/_shared/facts";
import { cn } from "@/lib/utils";

/**
 * The page's one primary action: the agency sign-up that lands on Studio.
 * A real link, so it works before hydration; with JavaScript it goes through
 * startStudioSignup(), which records the Studio intent for after auth.
 */
export function StartButton({ label, className }: { label: string; className?: string }) {
  return (
    <a
      href={STUDIO_SIGNUP_HREF}
      onClick={(e) => {
        e.preventDefault();
        startStudioSignup();
      }}
      className={cn(
        "group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-cta px-5 text-[0.95rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-colors hover:bg-cta-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 focus-visible:ring-offset-2",
        className,
      )}
    >
      {label}
      <ArrowRight
        aria-hidden
        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
      />
    </a>
  );
}
