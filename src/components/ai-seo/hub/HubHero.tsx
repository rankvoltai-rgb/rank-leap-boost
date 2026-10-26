/**
 * The hub's hero: the row of engine marks first, because picking an engine is
 * what most visitors came to do, then the page's one h1, the two ways into
 * the page, and the short answer on a band of its own.
 *
 * The backdrop is a faint field of index dots rather than the landing's
 * dithered mark: the hub is a directory, and it should look like one.
 */
import { ArrowDown, Zap } from "lucide-react";
import { EngineRail } from "@/components/ai-seo/engine-rail";
import { Md } from "@/components/ai-seo/kit";
import { Accent, Band, GHOST_BUTTON, LINE } from "@/components/landing/frame";
import { ENGINES } from "@/data/ai-seo/engines";
import { OVERVIEW } from "@/data/ai-seo/overview";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";

export function HubHero({ updated }: { updated: string }) {
  return (
    <section id="top" aria-labelledby="hub-title" className="relative scroll-mt-16 bg-white">
      <div className={cn("relative mx-auto max-w-6xl overflow-hidden border-x", LINE)}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background-image:radial-gradient(color-mix(in_oklab,var(--brand-blue)_28%,transparent)_1px,transparent_1.2px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_60%_70%_at_50%_42%,#000_10%,transparent_75%)] opacity-60"
        />

        <div className="relative flex flex-col items-center px-5 pb-14 pt-10 text-center sm:px-8 sm:pb-16 sm:pt-14 lg:pb-20 lg:pt-16">
          <p className="mb-3 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Pick an engine
          </p>
          <EngineRail className="motion-safe:animate-hero-rise" />

          <p className="mt-9 text-[0.82rem] text-muted-foreground">
            {ENGINES.length} engine guides
            <span aria-hidden className="mx-2 text-ink/20">
              /
            </span>
            Updated <time dateTime={updated}>{formatDate(updated)}</time>
          </p>
          <h1
            id="hub-title"
            className="mt-4 max-w-4xl text-balance font-display text-[2.3rem] font-medium leading-[1.06] tracking-[-0.035em] text-ink min-[400px]:text-[2.6rem] sm:text-[3.4rem] lg:text-[4rem]"
          >
            {OVERVIEW.headline.lead} <Accent>{OVERVIEW.headline.accent}</Accent>
          </h1>
          <p className="mt-6 max-w-[44rem] text-balance text-[1.02rem] leading-relaxed text-muted-foreground sm:text-[1.12rem]">
            {OVERVIEW.subhead}
          </p>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <a
              href="#compare"
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-cta px-5 text-[0.95rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-colors hover:bg-cta-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25"
            >
              Compare all eleven
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5 motion-reduce:transition-none" />
            </a>
            <a href="#start" className={cn(GHOST_BUTTON, "h-11 px-5 text-[0.95rem]")}>
              Where to start
            </a>
          </div>
        </div>
      </div>

      <Band inner="grid gap-3 px-6 py-8 sm:px-10 lg:grid-cols-[12rem_1fr] lg:gap-10 lg:px-12 lg:py-10">
        <p className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-cta lg:items-start lg:pt-1.5">
          <Zap aria-hidden className="h-3.5 w-3.5" />
          The short answer
        </p>
        <p className="max-w-[52rem] text-[1.06rem] leading-[1.7] text-ink sm:text-[1.14rem]">
          <Md text={OVERVIEW.shortAnswer} />
        </p>
      </Band>
    </section>
  );
}
