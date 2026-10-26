/**
 * The hub's opening: the promise on the left, and on the right a switchboard
 * of every tool we compare against, so a visitor who arrived looking for one
 * comparison is a click from it. Both sit between the landing's rails.
 */
import { useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Scale } from "lucide-react";
import { CompetitorMark } from "@/components/alternatives/kit";
import { UrlForm } from "@/components/landing/Hero";
import { Accent, LINE, LINE_FILL, PANEL, Pill } from "@/components/landing/frame";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { ALTERNATIVES_UPDATED, COMPETITORS, formatCheckedOn } from "@/data/alternatives";
import { cn } from "@/lib/utils";
import { UsMark } from "./marks";

/* Staggers the CSS entrance (see animate-hero-rise in styles.css). */
const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

function Switchboard() {
  return (
    <div
      className="w-full max-w-[30rem] overflow-hidden rounded-xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_24px_48px_-28px_rgba(16,24,40,0.28)] motion-safe:animate-hero-rise"
      style={rise(0.3)}
    >
      <div className={cn("flex items-center justify-between gap-3 border-b px-4 py-3", LINE)}>
        <span className="flex items-center gap-2 text-[0.8rem] font-medium text-ink">
          <UsMark className="h-6 w-6 text-brand-blue" />
          Rankbox vs
        </span>
        <span className="text-[0.72rem] tabular-nums text-muted-foreground">
          {COMPETITORS.length} comparisons
        </span>
      </div>
      <ul className={cn("grid grid-cols-3 gap-px", LINE_FILL)}>
        {COMPETITORS.map((c, i) => (
          <li
            key={c.slug}
            className="bg-white motion-safe:animate-hero-rise"
            style={rise(0.36 + i * 0.035)}
          >
            <Link
              to="/alternatives/$slug"
              params={{ slug: c.slug }}
              aria-label={`Rankbox vs ${c.name}`}
              className="group relative flex h-full flex-col items-center gap-2 px-2 py-4 text-center transition-colors hover:bg-[color-mix(in_oklab,var(--cta)_5%,white)] focus-visible:bg-[color-mix(in_oklab,var(--cta)_6%,white)] focus-visible:outline-none sm:items-start sm:px-4 sm:text-left"
            >
              <CompetitorMark competitor={c} className="h-8 w-8" />
              <span className="min-w-0">
                <span className="block text-[0.8rem] font-semibold leading-tight text-ink sm:text-sm">
                  {c.name}
                </span>
                <span className="mt-0.5 hidden text-[0.7rem] leading-snug text-muted-foreground sm:block">
                  {c.category}
                </span>
              </span>
              <ArrowUpRight
                aria-hidden
                className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground/0 transition-colors group-hover:text-cta"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HubHero() {
  const [url, setUrl] = useState("");
  return (
    <section id="top" aria-labelledby="alternatives-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        <div className="grid lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
          <div className="flex flex-col justify-center px-5 pb-12 pt-14 sm:px-8 sm:pb-16 sm:pt-16 lg:py-20 lg:pr-12">
            <div className="motion-safe:animate-hero-rise" style={rise(0)}>
              <Pill icon={Scale}>
                {COMPETITORS.length} comparisons · checked {formatCheckedOn(ALTERNATIVES_UPDATED)}
              </Pill>
            </div>
            <h1
              id="alternatives-title"
              className="mt-6 text-balance font-display text-[2.3rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise sm:text-[3.1rem] lg:text-[3.35rem]"
              style={rise(0.08)}
            >
              How Rankbox compares, <Accent>including where it loses</Accent>
            </h1>
            <p
              className="mt-5 max-w-xl text-[1.02rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.08rem]"
              style={rise(0.16)}
            >
              Most tools on this list are good at what they were built for. These pages say what
              that is, check every fact against the tool&rsquo;s own pages, show the cost per
              article, and name the cases where you should pick them over us.
            </p>
            <div
              className="mt-8 w-full max-w-[34rem] motion-safe:animate-hero-rise"
              style={rise(0.24)}
            >
              <UrlForm url={url} onChange={setUrl} variant="split" />
              <p className="mt-3.5 text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
            </div>
          </div>

          <div
            className={cn(
              "flex items-center justify-center border-t px-4 py-10 sm:px-8 sm:py-12 lg:border-l lg:border-t-0",
              LINE,
              PANEL,
            )}
          >
            <Switchboard />
          </div>
        </div>
      </div>
    </section>
  );
}
