/**
 * The /use-cases/new-websites hero, set as an editorial header rather than a
 * split: the breadcrumb, the pill and the H1 on the left, the subhead and the
 * URL form answering it from the right, both on one baseline. The launch
 * board then runs the full width of the rails underneath, on a grey panel
 * ruled like a site plan, because the picture is the point: a site that
 * opens with answers on it.
 *
 * The short answer follows straight after, beside the product facts, so the
 * paragraph an answer engine lifts sits right under the fold.
 */
import { useState, type ComponentType } from "react";
import { Link } from "@tanstack/react-router";
import { AlignLeft, CalendarClock, ChevronRight, FileText, Gauge, Rocket } from "lucide-react";
import { UrlForm } from "@/components/landing/Hero";
import { Band, LINE, LINE_FILL, PANEL, Pill } from "@/components/landing/frame";
import { TRIAL_NOTE } from "@/data/pricing";
import type { Persona } from "@/data/personas";
import { NEW_SITES } from "@/data/persona-pages/new-websites";
import { cn } from "@/lib/utils";
import { LaunchBoard } from "./launch-board";
import { rise } from "./tokens";

type Icon = ComponentType<{ className?: string }>;

/* One icon per product fact, in the order the facts are listed. */
const SPEC_ICONS: Icon[] = [CalendarClock, FileText, Gauge, Rocket];

export function NewSitesHero({ persona }: { persona: Persona }) {
  const [url, setUrl] = useState("");
  const Icon = persona.icon;

  return (
    <section id="top" aria-labelledby="nw-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        <div className="px-5 pb-10 pt-7 sm:px-10 sm:pb-12 lg:px-12 lg:pb-12 lg:pt-9 xl:px-14">
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

          <div className="mt-9 grid gap-x-12 gap-y-7 lg:mt-11 lg:grid-cols-[1.12fr_1fr] lg:items-end">
            <div>
              <div className="motion-safe:animate-hero-rise" style={rise(0.05)}>
                <Pill icon={Icon}>{persona.eyebrow}</Pill>
              </div>
              <h1
                id="nw-title"
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
            </div>

            <div className="motion-safe:animate-hero-rise lg:pb-1.5" style={rise(0.22)}>
              <p className="max-w-[34rem] text-[1.02rem] leading-relaxed text-muted-foreground sm:text-[1.08rem]">
                {persona.subhead}
              </p>
              <div className="mt-7 w-full max-w-[34rem]">
                <UrlForm url={url} onChange={setUrl} variant="split" />
                <p className="mt-3.5 text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
              </div>
            </div>
          </div>
        </div>

        {/* The launch board, on a grey panel ruled like a site plan. */}
        <div className="px-3 pb-3">
          <div
            className={cn("relative overflow-hidden px-2 py-8 sm:px-10 sm:py-12 lg:px-16", PANEL)}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(16,24,40,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,24,40,0.05)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_75%_at_50%_50%,#000_35%,transparent_100%)]"
            />
            <div
              className="relative mx-auto max-w-[60rem] motion-safe:animate-hero-rise"
              style={rise(0.36)}
            >
              <LaunchBoard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* The paragraph answer engines lift, beside the product facts. */
export function NewSitesShortAnswer({ persona }: { persona: Persona }) {
  return (
    <section aria-labelledby="short-answer-title">
      <Band>
        <div className="grid lg:grid-cols-[1.6fr_1fr]">
          <div
            className={cn(
              "border-b px-6 py-9 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-12",
              LINE,
            )}
          >
            <Pill icon={AlignLeft}>In short</Pill>
            <h2
              id="short-answer-title"
              className="mt-4 text-balance font-display text-[1.35rem] font-medium leading-snug tracking-[-0.02em] text-ink sm:text-[1.55rem]"
            >
              {NEW_SITES.shortAnswerTitle}
            </h2>
            <p className="mt-4 max-w-[44rem] text-[1.02rem] leading-[1.75] text-ink/80 sm:text-[1.08rem]">
              {persona.shortAnswer}
            </p>
          </div>

          <dl
            aria-label={`Rankbox for ${persona.nameLower} at a glance`}
            className={cn("grid grid-cols-2 gap-px self-stretch", LINE_FILL)}
          >
            {persona.specs.map((s, i) => {
              const SpecIcon = SPEC_ICONS[i % SPEC_ICONS.length];
              return (
                <div
                  key={s.label}
                  className="flex flex-col gap-4 bg-white px-5 py-6 sm:px-7 sm:py-7 lg:justify-center"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cta-soft text-brand-blue">
                    <SpecIcon className="h-4 w-4" />
                  </span>
                  <div className="flex flex-col">
                    <dt className="order-2 mt-1.5 text-[0.8rem] leading-snug text-muted-foreground">
                      {s.label}
                    </dt>
                    <dd className="order-1 font-display text-[1.3rem] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[1.45rem]">
                      {s.value}
                    </dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </div>
      </Band>
    </section>
  );
}
