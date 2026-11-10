/**
 * The /use-cases/professional-services hero, set like the front page of a
 * report: the title on the left and the standfirst, form and trial terms on
 * the right, both above a full-width exhibit, the shortlist scene, on the
 * soft blue panel inside the rails. The product facts follow as a numbered
 * strip, then the short answer as a memo, since a memo is how a firm hands a
 * partner the one paragraph that matters.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { UrlForm } from "@/components/landing/Hero";
import { Band, LINE, Pill } from "@/components/landing/frame";
import { WRITTEN_FOR } from "@/data/persona-pages/professional-services";
import type { Persona } from "@/data/personas";
import { TRIAL_NOTE } from "@/data/pricing";
import { cn } from "@/lib/utils";
import { ShortlistScene } from "./shortlist-scene";
import { DOTS, FIELD, SHEET, rise } from "./tokens";

export function ProHero({ persona }: { persona: Persona }) {
  const [url, setUrl] = useState("");
  const Icon = persona.icon;

  return (
    <section id="top" aria-labelledby="ps-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        <div className="px-5 pt-7 sm:px-10 lg:px-12 xl:px-14">
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

          <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-7 lg:mt-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end lg:gap-14">
            <div>
              <div className="motion-safe:animate-hero-rise" style={rise(0.05)}>
                <Pill icon={Icon}>{persona.eyebrow}</Pill>
              </div>
              <h1
                id="ps-title"
                className="mt-6 font-display text-[2.3rem] font-medium leading-[1.07] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.5rem] sm:text-[3.4rem] lg:text-[3.35rem] xl:text-[3.7rem]"
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
              <div
                className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 motion-safe:animate-hero-rise"
                style={rise(0.18)}
              >
                <span className={FIELD}>{WRITTEN_FOR.label}</span>
                <ul className="flex flex-wrap gap-1.5">
                  {WRITTEN_FOR.firms.map((f) => (
                    <li
                      key={f}
                      className="rounded-md border border-ink/[0.08] bg-white px-2 py-1 text-[0.76rem] font-medium text-ink/75"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
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

        {/* The exhibit: the shortlist scene across the column. */}
        <div className="mt-10 px-3 pb-3 sm:mt-14">
          <div className="relative overflow-hidden bg-[#eaf2fe] px-3 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
            <div
              aria-hidden
              className={cn(
                DOTS,
                "[mask-image:radial-gradient(ellipse_80%_75%_at_50%_45%,#000_30%,transparent_100%)]",
              )}
            />
            <div className="relative motion-safe:animate-hero-rise" style={rise(0.36)}>
              <ShortlistScene />
            </div>
          </div>
        </div>
      </div>

      {/* The product facts, numbered like the terms of a document. */}
      <div className={cn("border-t motion-safe:animate-hero-rise", LINE)} style={rise(0.46)}>
        <div className={cn("mx-auto max-w-6xl overflow-hidden border-x", LINE)}>
          <dl
            aria-label={`Rankbox for ${persona.nameLower} at a glance`}
            className="-mb-px -mr-px grid grid-cols-2 lg:grid-cols-4"
          >
            {persona.specs.map((s, i) => (
              <div
                key={s.label}
                className={cn("flex flex-col border-b border-r px-5 py-5 sm:px-8 sm:py-6", LINE)}
              >
                <span className="font-mono text-[0.66rem] font-medium text-brand-blue">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="mt-2 flex min-w-0 flex-col">
                  <dt className="order-2 mt-1.5 text-[0.8rem] leading-snug text-muted-foreground">
                    {s.label}
                  </dt>
                  <dd className="order-1 font-display text-[1.25rem] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[1.45rem]">
                    {s.value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* The paragraph answer engines lift, set as a memo to the partners. */
export function ProShortAnswer({ persona }: { persona: Persona }) {
  return (
    <section aria-labelledby="short-answer-title">
      <Band inner="px-4 py-10 sm:px-10 sm:py-14 lg:px-16">
        <article className={cn(SHEET, "mx-auto max-w-4xl overflow-hidden")}>
          <header className="border-b border-ink/[0.07] px-5 py-4 sm:px-8 sm:py-5">
            <div className="flex items-center justify-between gap-4">
              <p className="font-display text-[0.95rem] font-bold tracking-[0.2em] text-ink">
                MEMO
              </p>
              <p className={FIELD}>In short</p>
            </div>
            <dl className="mt-4 grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-3 gap-y-2 text-[0.86rem]">
              <dt className={cn(FIELD, "pt-[0.2rem]")}>To</dt>
              <dd className="text-ink/80">Partners and practice leads</dd>
              <dt className={cn(FIELD, "pt-[0.45rem]")}>Re</dt>
              <dd>
                <h2
                  id="short-answer-title"
                  className="text-balance font-display text-[1.2rem] font-medium leading-snug tracking-[-0.02em] text-ink sm:text-[1.4rem]"
                >
                  What is Rankbox for {persona.nameLower}?
                </h2>
              </dd>
            </dl>
          </header>
          <p className="px-5 py-6 text-[1rem] leading-[1.75] text-ink/80 sm:px-8 sm:py-8 sm:text-[1.1rem]">
            {persona.shortAnswer}
          </p>
        </article>
      </Band>
    </section>
  );
}
