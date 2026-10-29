import { Link } from "@tanstack/react-router";
import { ArrowDown, ChevronRight } from "lucide-react";
import { HERO, META, NAME, SHORT_ANSWER } from "./content";
import { ArticleTicket } from "./ArticleTicket";
import { StartButton } from "./StartButton";

/**
 * Left-aligned hero: breadcrumb, H1, one paragraph, one action. The ticket
 * sits beside it on wide screens and under it on narrow ones. Under both, the
 * plain-text answer to "what is white label content writing", in the page's
 * index layout so it reads as the first line of the spec.
 */
export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-gradient-to-b from-surface to-background"
      />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-center lg:gap-16 lg:px-8 lg:pb-24 lg:pt-20">
        <div>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <li>
                <Link
                  to="/"
                  className="rounded transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
                >
                  {HERO.crumbs.home}
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="h-3 w-3" />
              </li>
              <li>
                <Link
                  to="/white-label"
                  className="rounded transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
                >
                  {HERO.crumbs.section}
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="h-3 w-3" />
              </li>
              <li aria-current="page" className="text-ink">
                {NAME}
              </li>
            </ol>
          </nav>

          <p className="mt-10 text-[0.82rem] font-medium text-brand-blue sm:mt-12">
            {HERO.eyebrow}
          </p>
          <h1
            id="hero-title"
            className="mt-3 max-w-[16ch] text-balance font-display text-[2.4rem] font-semibold leading-[1.04] tracking-[-0.035em] text-ink sm:text-[3.1rem] lg:text-[3.45rem]"
          >
            {META.h1}
          </h1>
          <p className="mt-6 max-w-xl text-[1.04rem] leading-relaxed text-muted-foreground sm:text-[1.1rem]">
            {HERO.sub}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <StartButton label={HERO.cta} />
            <a
              href="#stations"
              className="group inline-flex items-center gap-1.5 rounded text-[0.92rem] font-medium text-ink/80 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
            >
              {HERO.secondary}
              <ArrowDown
                aria-hidden
                className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:translate-y-0.5 motion-reduce:transition-none"
              />
            </a>
          </div>
          <p className="mt-4 max-w-md text-[0.78rem] leading-relaxed text-muted-foreground">
            {HERO.note}
          </p>
        </div>

        <div className="pt-3 lg:pt-0">
          <ArticleTicket />
        </div>
      </div>

      {/* The answer, in plain text, near the top. */}
      <div className="relative border-t border-ink/[0.07]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:grid lg:grid-cols-[10rem_minmax(0,1fr)] lg:gap-12 lg:px-8">
          <p className="mb-4 text-[0.78rem] font-medium text-muted-foreground lg:mb-0 lg:pt-1">
            {SHORT_ANSWER.label}
          </p>
          <div className="max-w-3xl">
            <p className="text-[1.05rem] font-semibold tracking-tight text-ink">{SHORT_ANSWER.q}</p>
            <p className="mt-3 text-[1rem] leading-[1.75] text-ink/75 sm:text-[1.05rem]">
              {SHORT_ANSWER.a}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
