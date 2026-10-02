import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { HERO, META } from "./content";

/**
 * A quiet, light opening: where you are, what this is, and the one sentence
 * that matters (every page is the same product). The panel below is the
 * focal point, so nothing here competes with it.
 */
export function Hero() {
  return (
    <section aria-labelledby="hub-title" className="relative isolate overflow-hidden">
      {/* A faint grid that fades out under the H1: the board's backplate. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gridlines [mask-image:radial-gradient(ellipse_70%_90%_at_15%_0%,black,transparent_75%)]"
      />
      <div className="mx-auto max-w-5xl px-4 pb-10 pt-12 sm:px-5 sm:pb-12 sm:pt-20">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <Link
                to="/"
                className="rounded-sm transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta"
              >
                {HERO.crumbHome}
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-3.5" />
            </li>
            <li aria-current="page" className="font-medium text-ink">
              {HERO.crumbHere}
            </li>
          </ol>
        </nav>

        <h1
          id="hub-title"
          className="mt-6 max-w-3xl text-balance font-display text-[2.15rem] font-bold leading-[1.06] tracking-tight text-ink sm:text-[3rem] lg:text-[3.35rem]"
        >
          {META.h1}
        </h1>
        <p className="mt-5 max-w-2xl text-pretty text-[1.05rem] leading-relaxed text-muted-foreground sm:text-lg">
          {HERO.lede}
        </p>
      </div>
    </section>
  );
}
