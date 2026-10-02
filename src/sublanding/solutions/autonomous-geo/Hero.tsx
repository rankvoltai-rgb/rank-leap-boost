import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { HERO, META, NAME } from "./content";
import { MonthSwitch } from "./MonthSwitch";
import { StartForm } from "./StartForm";

/**
 * A light, centred hero under the blue navbar: the H1, one sentence of what
 * Rankbox does, one action, and then the month itself. Nothing here waits on
 * an entrance animation, so the H1 and the month paint at once.
 */
export function Hero() {
  // Two deliberate lines on wide screens: the category, then what it does.
  const cut = META.h1.indexOf(HERO.h1Break);
  const lead = META.h1.slice(0, cut);
  const rest = META.h1.slice(cut + 1);
  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] bg-gradient-to-b from-surface to-background"
      />
      <div className="relative mx-auto max-w-5xl px-5 pt-10 text-center sm:pt-16">
        <nav aria-label="Breadcrumb" className="flex justify-center">
          <ol className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <li>
              <Link to="/" className="transition-colors hover:text-ink">
                {HERO.crumbs.home}
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-3 w-3" />
            </li>
            <li>
              <Link to="/solutions" className="transition-colors hover:text-ink">
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

        <h1
          id="hero-title"
          className="mt-10 text-balance font-display text-[2.45rem] font-semibold leading-[1.04] tracking-[-0.035em] text-ink sm:mt-12 sm:text-[3.4rem] lg:text-[3.85rem]"
        >
          <span className="lg:block">{lead}</span> <span className="lg:block">{rest}</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-balance text-[1.05rem] leading-relaxed text-muted-foreground sm:text-lg">
          {HERO.sub}
        </p>

        <StartForm className="mx-auto mt-9" />
        <p className="mt-3 text-xs text-muted-foreground">{HERO.note}</p>
      </div>

      {/* Not wrapped in an entrance animation: it's the hero's visual and has to
          be there on first paint, with or without JavaScript. */}
      <div className="relative mx-auto mt-14 max-w-5xl px-4 pb-20 sm:mt-16 sm:px-5 sm:pb-24">
        <MonthSwitch />
      </div>
    </section>
  );
}
