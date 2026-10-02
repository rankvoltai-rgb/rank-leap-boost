import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { OTHER_WAYS, h2 } from "./content";

/**
 * The trunk lines: where to go when the problem isn't a solutions page. A
 * two-column routing table ("starting from" → "go to"), not cards, so it reads
 * as directions rather than more things to browse.
 */
export function OtherWays() {
  return (
    <section
      id="other-ways"
      aria-labelledby="other-ways-title"
      className="scroll-mt-20 border-t border-border bg-surface/60 py-20 sm:py-24"
    >
      <div className="mx-auto grid max-w-5xl gap-10 px-4 sm:px-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-14">
        <div>
          <h2
            id="other-ways-title"
            className="text-balance font-display text-[1.75rem] font-semibold leading-tight tracking-tight text-ink sm:text-[2rem]"
          >
            {h2("other-ways")}
          </h2>
          <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
            {OTHER_WAYS.intro}
          </p>
        </div>

        <div>
          <div
            aria-hidden
            className="hidden grid-cols-[14rem_1fr] gap-6 pb-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:grid"
          >
            <span>{OTHER_WAYS.fromHead}</span>
            <span>{OTHER_WAYS.toHead}</span>
          </div>
          <ul className="divide-y divide-border border-y border-border">
            {OTHER_WAYS.routes.map((r) => (
              <li key={r.to}>
                <Link
                  to={r.to}
                  className="group grid gap-x-6 gap-y-1 rounded-sm py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-4 focus-visible:ring-offset-surface sm:grid-cols-[14rem_1fr_auto] sm:items-baseline"
                >
                  <span className="text-sm text-muted-foreground">{r.from}</span>
                  <span className="min-w-0">
                    <span className="block font-semibold tracking-tight text-ink transition-colors group-hover:text-cta motion-reduce:transition-none">
                      {r.label}
                      <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
                        {r.to}
                      </span>
                    </span>
                    <span className="mt-1 block text-[0.92rem] leading-relaxed text-muted-foreground">
                      {r.line}
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="hidden size-4 self-center text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cta motion-reduce:transition-none sm:block"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
