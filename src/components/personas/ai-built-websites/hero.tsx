/**
 * The /use-cases/ai-built-websites hero. Not the split hero the other use
 * cases run: the H1 and its promise sit on the left, a "start here" column on
 * the right holds the URL form with the product facts listed under it, and
 * the focal visual takes the full width below, the builder's window beside
 * what a crawler gets for the same page.
 *
 * The quotable short answer follows as a chat exchange, since that is how
 * this reader asks things now.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { UrlForm } from "@/components/landing/Hero";
import { Band, LINE, PANEL, Pill } from "@/components/landing/frame";
import { Mark } from "@/components/brand/Mark";
import type { Persona } from "@/data/personas";
import { TRIAL_NOTE } from "@/data/pricing";
import { cn } from "@/lib/utils";
import { rise } from "./tokens";
import { TwoViews } from "./two-views";

export function AiBuiltHero({ persona }: { persona: Persona }) {
  const [url, setUrl] = useState("");
  const Icon = persona.icon;

  return (
    <section id="top" aria-labelledby="ai-built-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        <div className="grid lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
          {/* The promise */}
          <div className="px-5 pb-10 pt-7 sm:px-10 sm:pb-12 lg:pb-11 lg:pt-9 lg:pl-12 lg:pr-10 xl:pl-14">
            <nav aria-label="Breadcrumb" className="motion-safe:animate-hero-rise" style={rise(0)}>
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

            <div className="mt-8 motion-safe:animate-hero-rise lg:mt-9" style={rise(0.05)}>
              <Pill icon={Icon}>{persona.eyebrow}</Pill>
            </div>

            <h1
              id="ai-built-title"
              className="mt-6 font-display text-[2.3rem] font-medium leading-[1.07] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.45rem] sm:text-[3.3rem] lg:text-[3.15rem] xl:text-[3.5rem]"
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

            <p
              className="mt-6 max-w-[36rem] text-[1.02rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.08rem]"
              style={rise(0.22)}
            >
              {persona.subhead}
            </p>
          </div>

          {/* Start here: the form, then what the plan is, in facts. */}
          <div
            className={cn(
              "flex flex-col justify-center border-t px-5 py-8 sm:px-10 lg:border-l lg:border-t-0 lg:px-10 lg:py-10",
              LINE,
              PANEL,
            )}
          >
            <div className="motion-safe:animate-hero-rise" style={rise(0.3)}>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Start with your URL
              </p>
              <div className="mt-3">
                <UrlForm url={url} onChange={setUrl} variant="split" />
              </div>
              <p className="mt-3 text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
            </div>

            <dl
              aria-label={`Rankbox for ${persona.nameLower} at a glance`}
              className={cn("mt-7 divide-y border-y motion-safe:animate-hero-rise", LINE)}
              style={rise(0.38)}
            >
              {persona.specs.map((s) => (
                <div
                  key={s.label}
                  className={cn(
                    "grid grid-cols-[6.5rem_minmax(0,1fr)] items-baseline gap-4 py-3",
                    LINE,
                  )}
                >
                  <dt className="order-2 text-[0.84rem] leading-snug text-muted-foreground">
                    {s.label}
                  </dt>
                  <dd className="order-1 font-display text-[1.15rem] font-medium leading-none tracking-[-0.02em] text-ink">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* The focal visual, full width on its own panel. */}
      <Band inner="overflow-hidden">
        <div className="relative px-3 py-10 sm:px-8 sm:py-12 lg:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[#eef4fd] [background-image:linear-gradient(rgba(22,111,229,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(22,111,229,0.07)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_80%_75%_at_50%_45%,#000_35%,transparent_100%)]"
          />
          <div className="relative motion-safe:animate-hero-rise" style={rise(0.45)}>
            <TwoViews />
          </div>
        </div>
      </Band>
    </section>
  );
}

/* The paragraph answer engines lift, set as the question asked in a chat and
   Rankbox's reply. */
export function AiBuiltShortAnswer({ persona }: { persona: Persona }) {
  return (
    <section aria-labelledby="short-answer-title">
      <Band inner="px-5 py-12 sm:px-10 sm:py-16 lg:px-12">
        <div className="mx-auto flex max-w-3xl flex-col gap-5">
          <div className="flex justify-end">
            <h2
              id="short-answer-title"
              className="max-w-[30rem] rounded-2xl rounded-br-md bg-cta-soft px-4 py-3 font-display text-[1.15rem] font-medium leading-snug tracking-[-0.015em] text-ink sm:text-[1.3rem]"
            >
              What is Rankbox for {persona.nameLower}?
            </h2>
          </div>
          <div className="flex gap-3 sm:gap-4">
            <span
              aria-hidden
              className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-brand-blue shadow-[0_1px_2px_rgba(16,24,40,0.05)]"
            >
              <Mark className="h-4 w-4" />
            </span>
            <p className="text-[1rem] leading-[1.75] text-ink/80 sm:text-[1.08rem]">
              {persona.shortAnswer}
            </p>
          </div>
        </div>
      </Band>
    </section>
  );
}
