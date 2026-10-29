import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { HERO, META } from "./content";
import { CostSheet } from "./CostSheet";
import { CONTAINER, FOCUS, StudioCta } from "./parts";

/**
 * The price first. Left: the H1, what the number means, one action. Right: the
 * cost sheet. Under the copy on wide screens (after the sheet on phones): the
 * short answer in plain text, for readers and answer engines alike.
 */
export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[30rem] bg-gradient-to-b from-surface to-background"
      />
      <div
        className={cn(
          CONTAINER,
          "relative grid gap-x-16 gap-y-10 pb-20 pt-10 sm:pt-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:grid-rows-[auto_1fr] lg:pb-24",
        )}
      >
        <div>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <li>
                <Link to="/" className={cn("rounded-sm transition-colors hover:text-ink", FOCUS)}>
                  {HERO.crumbs.home}
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="h-3 w-3" />
              </li>
              <li>
                <Link
                  to="/white-label"
                  className={cn("rounded-sm transition-colors hover:text-ink", FOCUS)}
                >
                  {HERO.crumbs.hub}
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="h-3 w-3" />
              </li>
              <li aria-current="page" className="text-ink">
                {HERO.crumbs.here}
              </li>
            </ol>
          </nav>

          <h1
            id="hero-title"
            className="mt-8 text-balance font-display text-[2.35rem] font-semibold leading-[1.05] tracking-[-0.035em] text-ink sm:mt-10 sm:text-[3.1rem] lg:text-[3.45rem]"
          >
            {META.h1}
          </h1>

          <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-muted-foreground sm:text-lg">
            {HERO.sub}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <StudioCta label={HERO.cta} />
            <a
              href="#margin"
              className={cn(
                "inline-flex h-11 items-center rounded-lg text-[0.95rem] font-medium text-cta transition-colors hover:text-cta-hover",
                FOCUS,
              )}
            >
              {HERO.secondary}
            </a>
          </div>
          <p className="mt-4 max-w-xl text-xs leading-relaxed text-muted-foreground">{HERO.note}</p>
        </div>

        <CostSheet className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-10 lg:self-start" />

        <div className="max-w-xl border-l-2 border-cta pl-5 lg:col-start-1 lg:row-start-2">
          <p className="text-xs font-semibold text-ink">{HERO.answerLabel}</p>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/80">{HERO.answer}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{HERO.scope}</p>
        </div>
      </div>
    </section>
  );
}
