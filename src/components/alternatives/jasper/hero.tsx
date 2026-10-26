/**
 * The opening of /alternatives/jasper: the copy on the left, the relay board
 * on the right (an article's trip from question to site, with both products'
 * lanes beside each step), and a strip of Rankbox's plan numbers closing the
 * frame underneath, the way the landing's proof band closes its hero.
 */
import { useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Accent, Band, CELL, LINE } from "@/components/landing/frame";
import { UrlForm } from "@/components/landing/Hero";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import type { Competitor } from "@/data/alternatives";
import { RelayBoard } from "./relay";

/* Staggers the CSS entrance (animate-hero-rise in styles.css). */
const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

/* Faint graph paper behind the board: a planning surface, not a painting. */
const GRAPH =
  "bg-[linear-gradient(to_right,rgba(16,24,40,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,24,40,0.045)_1px,transparent_1px)] bg-[size:28px_28px]";

export function JasperHero({ competitor }: { competitor: Competitor }) {
  const [url, setUrl] = useState("");
  return (
    <section id="top" aria-labelledby="jasper-title" className="relative scroll-mt-16 bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        <div className="grid lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
          <div className="px-5 pb-12 pt-9 sm:px-10 sm:pb-16 sm:pt-11 lg:px-12 lg:pb-20 lg:pt-12 xl:px-14">
            <nav
              aria-label="Breadcrumb"
              className="motion-safe:animate-hero-rise"
              style={rise(0.02)}
            >
              <ol className="flex flex-wrap items-center gap-1.5 text-[0.82rem] text-muted-foreground">
                <li>
                  <Link to="/" className="transition-colors hover:text-ink">
                    Home
                  </Link>
                </li>
                <li aria-hidden>
                  <ChevronRight className="h-3 w-3" />
                </li>
                <li>
                  <Link to="/alternatives" className="transition-colors hover:text-ink">
                    Alternatives
                  </Link>
                </li>
                <li aria-hidden>
                  <ChevronRight className="h-3 w-3" />
                </li>
                <li aria-current="page" className="text-ink">
                  {competitor.name}
                </li>
              </ol>
            </nav>

            {/* The eyebrow as a pill that carries both marks. */}
            <p
              className="mt-8 inline-flex items-center gap-2 rounded-lg border border-ink/[0.08] bg-white py-1 pl-1 pr-2.5 text-[0.8rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] motion-safe:animate-hero-rise"
              style={rise(0.06)}
            >
              <span className="flex items-center gap-1">
                <RankboxMark className="h-5 w-5" />
                <span
                  aria-hidden
                  className="text-[0.55rem] font-bold uppercase tracking-[0.14em] text-muted-foreground"
                >
                  vs
                </span>
                <CompetitorMark competitor={competitor} className="h-5 w-5 text-[0.5rem]" />
              </span>
              {competitor.eyebrow}
            </p>

            <h1
              id="jasper-title"
              className="mt-6 text-balance font-display text-[2.3rem] font-medium leading-[1.06] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.55rem] sm:text-[3.25rem] lg:text-[3.2rem] xl:text-[3.55rem]"
              style={rise(0.12)}
            >
              <span className="block">{competitor.headline.lead}</span>{" "}
              <Accent>{competitor.headline.accent}</Accent>
            </h1>

            <p
              className="mt-6 max-w-[36rem] text-[1.02rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.08rem]"
              style={rise(0.2)}
            >
              {competitor.subhead}
            </p>

            <div
              className="mt-8 w-full max-w-[34rem] motion-safe:animate-hero-rise"
              style={rise(0.3)}
            >
              <UrlForm url={url} onChange={setUrl} variant="split" />
              <p className="mt-3.5 text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
            </div>
          </div>

          <div
            className={cn(
              "relative flex items-center justify-center border-t px-4 py-10 sm:px-10 sm:py-12 lg:border-l lg:border-t-0 lg:px-8 lg:py-12 xl:px-12",
              LINE,
              GRAPH,
            )}
          >
            <div className="w-full max-w-[29rem] motion-safe:animate-hero-rise" style={rise(0.38)}>
              <RelayBoard competitor={competitor} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Rankbox's plan in four numbers, closing the hero's frame. */
export function SpecStrip({ competitor }: { competitor: Competitor }) {
  return (
    <section aria-labelledby="specs-title">
      <Band>
        <div className="overflow-hidden">
          <div className="-mb-px -mr-px grid grid-cols-2 md:grid-cols-4 lg:grid-cols-[12rem_repeat(4,minmax(0,1fr))]">
            <div
              className={cn(
                CELL,
                "col-span-2 flex items-center gap-3 px-5 py-4 sm:px-8 md:col-span-4 lg:col-span-1 lg:flex-col lg:items-start lg:justify-center lg:gap-2.5 lg:py-6",
              )}
            >
              <RankboxMark className="h-8 w-8" />
              <h2 id="specs-title" className="text-[0.92rem] font-medium leading-snug text-ink">
                Rankbox at a glance
              </h2>
            </div>
            <dl className="contents">
              {competitor.specs.map((s) => (
                <div
                  key={s.label}
                  className={cn(
                    CELL,
                    "flex flex-col-reverse justify-end px-5 py-6 sm:px-8 sm:py-7",
                  )}
                >
                  <dt className="mt-1.5 text-[0.82rem] leading-snug text-muted-foreground">
                    {s.label}
                  </dt>
                  <dd className="font-display text-[1.75rem] font-medium leading-none tracking-[-0.03em] text-ink sm:text-[2rem]">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Band>
    </section>
  );
}
