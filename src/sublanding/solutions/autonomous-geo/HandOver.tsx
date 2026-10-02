import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Appear } from "./Appear";
import { HAND_OVER, MONTH_ROWS, h2 } from "./content";
import { StartForm } from "./StartForm";

/**
 * The close. The day strip from the hero comes back once more, every day
 * filled, as the only ornament; then the price, the trial terms and the same
 * single action as the top of the page.
 */
export function HandOver() {
  return (
    <section
      id="hand-over"
      aria-labelledby="hand-over-title"
      className="border-t border-border bg-gradient-to-b from-surface to-background py-24 sm:py-32"
    >
      <Appear className="mx-auto flex max-w-2xl flex-col items-center px-5 text-center">
        <div aria-hidden className="flex h-6 w-full max-w-xs gap-[3px]">
          {MONTH_ROWS.map((r) => (
            <span key={r.day} className="flex-1 rounded-[2px] bg-cta" />
          ))}
        </div>

        <h2
          id="hand-over-title"
          className="mt-10 text-balance font-display text-[2.2rem] font-semibold leading-[1.06] tracking-[-0.03em] text-ink sm:text-[3rem]"
        >
          {h2("hand-over")}
        </h2>
        <p className="mt-5 max-w-xl text-pretty text-[1.05rem] leading-relaxed text-muted-foreground">
          {HAND_OVER.body}
        </p>

        <StartForm className="mt-9" />
        <p className="mt-3 max-w-md text-pretty text-xs leading-relaxed text-muted-foreground">
          {HAND_OVER.terms}
        </p>

        <Link
          to="/pricing"
          className="group mt-6 inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-ink transition-colors hover:text-cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2"
        >
          {HAND_OVER.pricing}
          <ArrowRight
            aria-hidden
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </Link>
      </Appear>
    </section>
  );
}
