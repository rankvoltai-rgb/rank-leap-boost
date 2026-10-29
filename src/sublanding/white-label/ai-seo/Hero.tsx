import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { HERO, META } from "./content";
import { ClientEmail } from "./ClientEmail";
import { StudioButton } from "./StudioButton";

/**
 * Left-aligned: the breadcrumb up to the white label hub, the H1, the plain
 * answer to "what is white label AI SEO", and the one action. On the right,
 * the client's question that the rest of the page answers.
 */
export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[40rem] bg-gradient-to-b from-surface to-background"
      />
      <div className="relative mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-14 px-4 pb-20 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:items-center lg:gap-16 lg:pb-28 lg:pt-16">
        <div>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <li>
                <Link
                  to="/"
                  className="rounded-sm transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta"
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
                  className="rounded-sm transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta"
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

          <p className="mt-10 text-[0.8rem] font-medium text-brand-blue sm:mt-12">{HERO.kicker}</p>
          <h1
            id="hero-title"
            className="mt-3 text-balance font-display text-[2.4rem] font-semibold leading-[1.04] tracking-[-0.035em] text-ink sm:text-[3.2rem] lg:text-[3.55rem]"
          >
            {META.h1}
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-[1.04rem] leading-relaxed text-muted-foreground sm:text-[1.1rem]">
            {HERO.answer}
          </p>

          <div className="mt-9 flex flex-col items-start gap-3">
            <StudioButton label={HERO.cta} pending={HERO.pending} />
            <p className="text-xs leading-relaxed text-muted-foreground">{HERO.note}</p>
          </div>
        </div>

        <ClientEmail />
      </div>
    </section>
  );
}
