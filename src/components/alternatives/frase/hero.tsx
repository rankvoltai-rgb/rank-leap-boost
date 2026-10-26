/**
 * The /alternatives/frase hero: the headline and the form on the left, and
 * on the right the two products' one-line verdicts stacked on one plate with
 * "vs" on the seam, dated against Frase's own pages. The entry's four spec
 * numbers close the hero as a hairline strip, the way the landing's proof
 * band closes its hero.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarCheck, ChevronRight, Infinity as InfinityIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Band, CELL, CellGrid, LINE, Pill } from "@/components/landing/frame";
import { UrlForm } from "@/components/landing/Hero";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { formatCheckedOn, type Competitor } from "@/data/alternatives";
import { PLAN, formatUsd } from "@/data/pricing";
import { CompetitorMark, RankboxMark } from "../kit";
import { OFF_PATH, ON_PATH, VIEW } from "./model";
import { CARD, rise } from "./helpers";

function Breadcrumb({ name }: { name: string }) {
  return (
    <nav aria-label="Breadcrumb" className="motion-safe:animate-hero-rise" style={rise(0)}>
      <ol className="flex items-center gap-1.5 text-[0.78rem] text-muted-foreground">
        <li>
          <Link to="/" className="py-2 transition-colors hover:text-ink">
            Home
          </Link>
        </li>
        <li aria-hidden>
          <ChevronRight className="h-3 w-3" />
        </li>
        <li>
          <Link to="/alternatives" className="py-2 transition-colors hover:text-ink">
            Alternatives
          </Link>
        </li>
        <li aria-hidden>
          <ChevronRight className="h-3 w-3" />
        </li>
        <li aria-current="page" className="font-medium text-ink">
          {name}
        </li>
      </ol>
    </nav>
  );
}

/* The two verdicts on one plate, Rankbox's half in the soft blue key. */
function VerdictPlate({ competitor }: { competitor: Competitor }) {
  return (
    <div className={cn(CARD, "overflow-hidden")}>
      <div className="bg-[color-mix(in_oklab,var(--cta)_5%,white)] p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <RankboxMark className="h-10 w-10" />
          <div className="min-w-0">
            <p className="text-[0.95rem] font-semibold text-ink">Rankbox</p>
            <p className="text-xs text-muted-foreground">
              {PLAN.name} plan · {formatUsd(PLAN.monthly)}/mo
            </p>
          </div>
        </div>
        <p className="mt-4 text-[1rem] leading-relaxed text-ink">{competitor.verdict.rankbox}</p>
      </div>
      <div className={cn("relative border-t", LINE)}>
        <span className="absolute left-6 top-0 -translate-y-1/2 rounded-md border border-ink/[0.08] bg-white px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted-foreground shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
          vs
        </span>
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <CompetitorMark competitor={competitor} className="h-10 w-10" />
          <div className="min-w-0">
            <p className="text-[0.95rem] font-semibold text-ink">{competitor.name}</p>
            <p className="text-xs text-muted-foreground">{competitor.category}</p>
          </div>
        </div>
        <p className="mt-4 text-[1rem] leading-relaxed text-ink/80">{competitor.verdict.them}</p>
      </div>
    </div>
  );
}

export function FraseHero({ competitor }: { competitor: Competitor }) {
  const [url, setUrl] = useState("");
  const c = competitor;

  return (
    <section id="top" aria-labelledby="alt-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        <div className="grid lg:grid-cols-[1.42fr_1fr]">
          <div className="relative px-5 pb-12 pt-7 sm:px-10 sm:pb-14 sm:pt-9 lg:pb-16 lg:pl-14 lg:pr-12">
            <Breadcrumb name={c.name} />

            <div className="mt-10 motion-safe:animate-hero-rise sm:mt-14" style={rise(0.05)}>
              <Pill icon={InfinityIcon}>{c.eyebrow}</Pill>
            </div>

            <h1
              id="alt-title"
              className="mt-6 text-balance font-display text-[2.25rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.5rem] sm:text-[3.1rem] lg:text-[3.15rem] xl:text-[3.5rem]"
              style={rise(0.12)}
            >
              <span className="block">{c.headline.lead}</span>{" "}
              <span className="font-bold text-brand-blue">{c.headline.accent}</span>
            </h1>

            <p
              className="mt-6 max-w-[38rem] text-[1.02rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.08rem]"
              style={rise(0.22)}
            >
              {c.subhead}
            </p>

            <div
              className="mt-9 w-full max-w-[36rem] motion-safe:animate-hero-rise"
              style={rise(0.32)}
            >
              <UrlForm url={url} onChange={setUrl} variant="split" />
              <p className="mt-3.5 text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
            </div>
          </div>

          <div
            className={cn(
              "relative flex flex-col justify-center overflow-hidden border-t px-5 py-10 sm:px-10 lg:border-l lg:border-t-0 lg:px-10",
              LINE,
            )}
          >
            {/* The focal figure's outline, faint, behind the plate. */}
            <svg
              aria-hidden
              viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
              fill="none"
              className="pointer-events-none absolute left-1/2 top-1/2 w-[170%] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.5]"
            >
              <path d={ON_PATH} className="stroke-cta/15" strokeWidth={1.2} />
              <path
                d={OFF_PATH}
                className="stroke-cta/15"
                strokeWidth={1.2}
                strokeDasharray="4 6"
              />
            </svg>

            <div className="relative motion-safe:animate-hero-rise" style={rise(0.3)}>
              <VerdictPlate competitor={c} />
              <p className="mt-4 flex items-start gap-2 text-[0.78rem] leading-relaxed text-muted-foreground">
                <CalendarCheck
                  aria-hidden
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-blue"
                />
                <span>
                  {c.name} facts checked against {c.domain} on{" "}
                  {formatCheckedOn(c.pricing.checkedOn)}.{" "}
                  <a
                    href="#sources"
                    className="font-medium text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
                  >
                    Sources
                  </a>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* The entry's four numbers, as the hero's closing strip. */}
      <div className="motion-safe:animate-hero-rise" style={rise(0.42)}>
        <Band>
          <CellGrid className="grid-cols-2 lg:grid-cols-4">
            {c.specs.map((s) => (
              <li key={s.label} className={cn(CELL, "px-5 py-6 sm:px-8 sm:py-7")}>
                <p className="font-display text-[1.7rem] font-medium leading-none tracking-[-0.03em] text-ink sm:text-[2rem]">
                  {s.value}
                </p>
                <p className="mt-2.5 text-balance text-[0.82rem] leading-snug text-muted-foreground">
                  {s.label}
                </p>
              </li>
            ))}
          </CellGrid>
        </Band>
      </div>
    </section>
  );
}
