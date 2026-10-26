/**
 * The ChatGPT guide's opening: the engine rail first (the way between
 * guides), then the title, the quotable short answer and the meta line on the
 * left, and on the right — on the grey panel tone, inside the rails — the
 * citation journey, the page's one focal visual.
 */
import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Zap } from "lucide-react";
import { Accent, LINE, PANEL } from "@/components/landing/frame";
import { EngineRail } from "@/components/ai-seo/engine-rail";
import { Md } from "@/components/ai-seo/kit";
import type { Engine } from "@/data/ai-seo/engines";
import type { EngineGuide } from "@/data/ai-seo/types";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { CitationJourney } from "./citation-journey";

const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

export function GuideHero({
  engine,
  guide,
  fanOut,
  readingMinutes,
}: {
  engine: Engine;
  guide: EngineGuide;
  fanOut: string[];
  readingMinutes: number;
}) {
  return (
    <section id="top" aria-labelledby="guide-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        {/* The rail, on a strip of its own across the top of the frame. */}
        <div
          className={cn(
            "flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-12",
            LINE,
          )}
        >
          <EngineRail active={guide.slug} />
          <nav aria-label="Breadcrumb" className="shrink-0">
            <ol className="flex items-center gap-1.5 text-[0.8rem] text-muted-foreground">
              <li>
                <Link to="/" className="py-2 transition-colors hover:text-ink">
                  Home
                </Link>
              </li>
              <ChevronRight aria-hidden className="h-3.5 w-3.5 text-ink/25" />
              <li>
                <Link to="/ai-seo" className="py-2 transition-colors hover:text-ink">
                  AI SEO guides
                </Link>
              </li>
              <ChevronRight aria-hidden className="h-3.5 w-3.5 text-ink/25" />
              <li aria-current="page" className="font-medium text-cta">
                {engine.shortName}
              </li>
            </ol>
          </nav>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
          <div className="flex flex-col justify-center px-5 pb-10 pt-9 sm:px-10 lg:py-14 lg:pl-12 lg:pr-10">
            <h1
              id="guide-title"
              className="text-balance font-display text-[2.15rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.4rem] sm:text-[3rem] lg:text-[3.15rem]"
              style={rise(0.04)}
            >
              {guide.headline.lead} <Accent>{guide.headline.accent}</Accent>
            </h1>
            <p
              className="mt-5 max-w-xl text-[1.02rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.08rem]"
              style={rise(0.12)}
            >
              {guide.subhead}
            </p>

            <p
              className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.8rem] text-muted-foreground motion-safe:animate-hero-rise"
              style={rise(0.18)}
            >
              <span>
                Updated{" "}
                <time dateTime={engine.updated} className="font-medium text-ink">
                  {formatDate(engine.updated)}
                </time>
              </span>
              <span aria-hidden className="text-ink/25">
                ·
              </span>
              <span>{readingMinutes} min read</span>
              <span aria-hidden className="text-ink/25">
                ·
              </span>
              <a
                href="#sources"
                className="font-medium text-cta underline-offset-4 hover:underline"
              >
                {guide.sources.length} cited sources
              </a>
            </p>

            {/* The quotable answer, set where a skimmer and a crawler both
                meet it first. */}
            <div
              className={cn(
                "mt-8 rounded-xl border bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] motion-safe:animate-hero-rise sm:p-6",
                LINE,
              )}
              style={rise(0.24)}
            >
              <p className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-cta">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-cta-soft">
                  <Zap aria-hidden className="h-3 w-3 fill-current" />
                </span>
                The short answer
              </p>
              <p className="mt-3 text-[1rem] leading-[1.7] text-ink/90 sm:text-[1.04rem]">
                <Md text={guide.shortAnswer} />
              </p>
            </div>
          </div>

          <div
            className={cn(
              "relative border-t px-4 py-8 sm:px-10 lg:border-l lg:border-t-0 lg:px-9 lg:py-12",
              LINE,
              PANEL,
            )}
          >
            {/* A faint dot grid, so the panel reads as a canvas the diagram
                is drawn on. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(color-mix(in_oklab,var(--ink)_9%,transparent)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:linear-gradient(to_bottom,#000,transparent_92%)]"
            />
            <CitationJourney
              preview={guide.preview}
              fanOut={fanOut}
              className="relative mx-auto max-w-[31rem]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
