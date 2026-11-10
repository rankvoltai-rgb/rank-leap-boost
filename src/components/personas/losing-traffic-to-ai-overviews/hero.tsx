/**
 * The hero, stacked rather than split: the headline and the way in share one
 * row, and the sample results page runs the full width of the column under
 * them, the way a results page fills a screen. The product facts close the
 * hero, and the quotable short answer follows straight after, so it sits
 * near the top in the server HTML as well as on screen.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AlignLeft, ChevronRight } from "lucide-react";
import { UrlForm } from "@/components/landing/Hero";
import { Band, LINE, LINE_FILL, Pill } from "@/components/landing/frame";
import type { Persona } from "@/data/personas";
import { TRIAL_NOTE } from "@/data/pricing";
import { cn } from "@/lib/utils";
import { OverviewScene } from "./overview-scene";
import { rise } from "./tokens";

export function LosingTrafficHero({ persona }: { persona: Persona }) {
  const [url, setUrl] = useState("");
  const Icon = persona.icon;

  return (
    <section id="top" aria-labelledby="lt-title" className="bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        <nav
          aria-label="Breadcrumb"
          className="px-5 pt-7 motion-safe:animate-hero-rise sm:px-10 lg:px-12"
          style={rise(0)}
        >
          <ol className="flex flex-wrap items-center gap-1.5 text-[0.78rem] text-muted-foreground">
            <li>
              <Link to="/" className="py-2 transition-colors hover:text-ink">
                Home
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-3 w-3" />
            </li>
            <li>
              <Link to="/use-cases" className="py-2 transition-colors hover:text-ink">
                Use cases
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-3 w-3" />
            </li>
            <li aria-current="page" className="font-medium text-ink">
              {persona.name}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-[minmax(0,1fr)] gap-7 px-5 pb-10 pt-9 sm:px-10 sm:pb-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end lg:gap-14 lg:px-12 lg:pb-11 lg:pt-9">
          <div>
            <div className="motion-safe:animate-hero-rise" style={rise(0.05)}>
              <Pill icon={Icon}>{persona.eyebrow}</Pill>
            </div>
            <h1
              id="lt-title"
              className="mt-6 font-display text-[2.3rem] font-medium leading-[1.07] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.45rem] sm:text-[3.3rem] lg:text-[3.35rem] xl:text-[3.7rem]"
              style={rise(0.12)}
            >
              <span className="block">{persona.headline.lead}</span>{" "}
              <span className="mt-[0.04em] inline-flex items-center gap-[0.2em] whitespace-nowrap">
                <span
                  aria-hidden
                  className="inline-flex h-[0.84em] w-[0.84em] shrink-0 items-center justify-center rounded-[0.2em] border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06)]"
                >
                  <Icon className="h-[48%] w-[48%] text-brand-blue" strokeWidth={2.4} />
                </span>
                <span className="font-bold text-brand-blue">{persona.headline.accent}</span>
              </span>
            </h1>
          </div>

          <div className="motion-safe:animate-hero-rise lg:pb-1.5" style={rise(0.22)}>
            <p className="max-w-[34rem] text-[1.02rem] leading-relaxed text-muted-foreground sm:text-[1.06rem]">
              {persona.subhead}
            </p>
            <div className="mt-7 w-full max-w-[34rem]">
              <UrlForm url={url} onChange={setUrl} variant="split" />
              <p className="mt-3.5 text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
            </div>
          </div>
        </div>
      </div>

      {/* The sample results page, on a soft blue panel ruled like a list of
          results, inset from the rails by a hairline of white. */}
      <div className={cn("border-t", LINE)}>
        <div className={cn("relative mx-auto max-w-6xl border-x p-2.5 sm:p-3", LINE)}>
          <div className="relative overflow-hidden rounded-[2px] bg-[#edf3fd] px-3 py-6 sm:px-8 sm:py-10 lg:px-10 lg:py-11">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(180deg,transparent_0,transparent_31px,rgba(22,111,229,0.085)_31px,rgba(22,111,229,0.085)_32px)] [mask-image:radial-gradient(ellipse_80%_75%_at_50%_45%,#000_25%,transparent_100%)]"
            />
            <div className="relative motion-safe:animate-hero-rise" style={rise(0.36)}>
              <OverviewScene />
            </div>
          </div>
        </div>
      </div>

      {/* The product facts. Top hairline only: the band below draws the next. */}
      <div className={cn("border-t", LINE)}>
        <dl
          aria-label={`Rankbox for ${persona.nameLower} at a glance`}
          className={cn(
            "mx-auto grid max-w-6xl grid-cols-2 gap-px border-x lg:grid-cols-4",
            LINE,
            LINE_FILL,
          )}
        >
          {persona.specs.map((s, i) => (
            <div key={s.label} className="flex flex-col bg-white px-5 py-5 sm:px-8 sm:py-7">
              <span
                aria-hidden
                className="font-mono text-[0.66rem] font-medium tabular-nums text-cta/70"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <dt className="order-2 mt-1.5 text-[0.8rem] leading-snug text-muted-foreground">
                {s.label}
              </dt>
              <dd className="order-1 mt-2 font-display text-[1.25rem] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[1.5rem]">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* The paragraph answer engines lift, under a heading that names the reader. */
export function LosingTrafficShortAnswer({ persona }: { persona: Persona }) {
  return (
    <section aria-labelledby="lt-short-answer">
      <Band inner="px-5 py-12 sm:px-10 sm:py-16 lg:px-12">
        <div className="mx-auto max-w-[50rem]">
          <Pill icon={AlignLeft}>The short answer</Pill>
          <h2
            id="lt-short-answer"
            className="mt-5 text-balance font-display text-[1.45rem] font-medium leading-snug tracking-[-0.02em] text-ink sm:text-[1.7rem]"
          >
            What Rankbox does for {persona.nameLower}
          </h2>
          <p className="mt-5 border-l-2 border-cta pl-5 text-[1.02rem] leading-[1.75] text-ink/80 sm:pl-7 sm:text-[1.12rem]">
            {persona.shortAnswer}
          </p>
        </div>
      </Band>
    </section>
  );
}
