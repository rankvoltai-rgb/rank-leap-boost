/**
 * "Start from the job": a routing board. Each job on the left runs a rule
 * across to the tools that do it best on the right, Rankbox included only
 * where it is actually the answer. Rows where Rankbox is the answer carry
 * the page's soft blue key.
 */
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CompetitorMark } from "@/components/alternatives/kit";
import { Reveal } from "@/components/landing/shared";
import { LINE } from "@/components/landing/frame";
import { getCompetitor, type Competitor } from "@/data/alternatives";
import { cn } from "@/lib/utils";
import { UsMark } from "./marks";
import { FITS } from "./data";

const CHIP =
  "inline-flex items-center gap-2 rounded-lg border py-1 pl-1 pr-2.5 text-[0.8rem] font-medium shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25";

export function FitsBoard() {
  return (
    <dl>
      {FITS.map((f, i) => {
        const picks = f.picks
          .map((slug) => getCompetitor(slug))
          .filter((c): c is Competitor => Boolean(c));
        return (
          <Reveal
            key={f.need}
            delay={Math.min(i, 4) * 0.04}
            y={10}
            className={cn(
              "grid gap-3 border-t px-5 py-5 sm:px-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] md:items-center md:gap-6",
              LINE,
              i === 0 && "border-t-0",
              f.rankbox && "bg-[color-mix(in_oklab,var(--cta)_5%,white)]",
            )}
          >
            <dt className="flex items-baseline gap-4 text-[0.95rem] font-medium leading-snug text-ink">
              <span
                aria-hidden
                className={cn(
                  "hidden w-5 shrink-0 text-[0.75rem] font-semibold tabular-nums md:block",
                  f.rankbox ? "text-cta" : "text-muted-foreground/70",
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              {f.need}
            </dt>
            <dd className="flex items-center gap-4">
              {/* The rule from the job to its answer. */}
              <span aria-hidden className="hidden w-16 shrink-0 items-center md:flex">
                <span className={cn("h-px flex-1", f.rankbox ? "bg-cta/40" : "bg-ink/[0.14]")} />
                <ArrowRight
                  className={cn(
                    "-ml-1 h-3.5 w-3.5",
                    f.rankbox ? "text-cta" : "text-muted-foreground/60",
                  )}
                />
              </span>
              <span className="flex flex-wrap gap-2">
                {f.rankbox && (
                  <Link
                    to="/pricing"
                    className={cn(CHIP, "border-cta/30 bg-cta-soft text-cta hover:border-cta/50")}
                  >
                    <UsMark className="h-6 w-6 text-brand-blue" />
                    Rankbox
                  </Link>
                )}
                {picks.map((c) => (
                  <Link
                    key={c.slug}
                    to="/alternatives/$slug"
                    params={{ slug: c.slug }}
                    className={cn(
                      CHIP,
                      "border-ink/[0.08] bg-white text-ink hover:border-ink/[0.18]",
                    )}
                  >
                    <CompetitorMark competitor={c} className="h-6 w-6 text-[0.55rem]" />
                    {c.name}
                  </Link>
                ))}
              </span>
            </dd>
          </Reveal>
        );
      })}
    </dl>
  );
}
