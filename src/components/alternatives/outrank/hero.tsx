/**
 * /alternatives/outrank's hero: the promise and the URL form on the left,
 * and on the right, on the grey panel ruled like squared paper, the month
 * card (month.tsx), because "same loop, half the price" is the whole
 * argument and it reads fastest as one month side by side. Under it, the
 * entry's four specs as a ruled strip, the way the landing closes its hero
 * with a proof band.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { UrlForm } from "@/components/landing/Hero";
import { Band, CELL, CellGrid, LINE, PANEL } from "@/components/landing/frame";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { formatCheckedOn, type Competitor } from "@/data/alternatives";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import { MonthCard } from "./month";
import { rise } from "./lib";

export function OutrankHero({ competitor }: { competitor: Competitor }) {
  const [url, setUrl] = useState("");

  return (
    <section id="top" aria-labelledby="outrank-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        <div className="grid lg:grid-cols-[1.08fr_1fr]">
          {/* The promise */}
          <div className="relative min-w-0 px-5 pb-14 pt-7 sm:px-10 sm:pb-16 sm:pt-9 lg:pb-20 lg:pl-14 lg:pr-12">
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
                  {competitor.name}
                </li>
              </ol>
            </nav>

            {/* The landing's pill, carrying both marks instead of an icon. */}
            <div className="mt-10 motion-safe:animate-hero-rise sm:mt-14" style={rise(0.05)}>
              <span className="inline-flex items-center gap-2 rounded-lg border border-ink/[0.08] bg-white py-1 pl-1 pr-2.5 text-[0.8rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                <span className="flex items-center gap-1">
                  <RankboxMark className="h-5 w-5" />
                  <span
                    aria-hidden
                    className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
                  >
                    vs
                  </span>
                  <CompetitorMark competitor={competitor} className="h-5 w-5 text-[0.55rem]" />
                </span>
                {competitor.eyebrow}
              </span>
            </div>

            <h1
              id="outrank-title"
              className="mt-6 text-balance font-display text-[2.3rem] font-medium leading-[1.07] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.5rem] sm:text-[3.2rem] lg:text-[3.3rem] xl:text-[3.55rem]"
              style={rise(0.12)}
            >
              <span className="block">{competitor.headline.lead}</span>{" "}
              <span className="font-bold text-brand-blue">{competitor.headline.accent}</span>
            </h1>

            <p
              className="mt-6 max-w-[36rem] text-[1.05rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.1rem]"
              style={rise(0.22)}
            >
              {competitor.subhead}
            </p>

            <div
              className="mt-9 w-full max-w-[35rem] motion-safe:animate-hero-rise"
              style={rise(0.32)}
            >
              <UrlForm url={url} onChange={setUrl} variant="split" />
              <p className="mt-3.5 text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
            </div>

            <p
              className="mt-8 text-[0.78rem] text-muted-foreground motion-safe:animate-hero-rise"
              style={rise(0.4)}
            >
              Checked against {competitor.domain} on {formatCheckedOn(competitor.pricing.checkedOn)}{" "}
              ·{" "}
              <a
                href="#sources"
                className="font-medium text-ink underline decoration-ink/20 underline-offset-4 transition-colors hover:decoration-ink"
              >
                Sources
              </a>
            </p>
          </div>

          {/* The month */}
          <div
            className={cn(
              "relative flex items-center overflow-hidden border-t px-4 py-10 sm:px-10 sm:py-14 lg:border-l lg:border-t-0 lg:px-9",
              LINE,
              PANEL,
            )}
          >
            {/* Squared paper, faded toward the edges: a calendar's ground. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(16,24,40,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,24,40,0.045)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_80%_75%_at_50%_50%,#000_30%,transparent_100%)]"
            />
            <div
              className="relative mx-auto w-full max-w-[30rem] motion-safe:animate-hero-rise"
              style={rise(0.3)}
            >
              <MonthCard competitor={competitor} />
            </div>
          </div>
        </div>
      </div>

      {/* The specs, ruled off like the landing's proof band. */}
      <Band>
        <CellGrid className="grid-cols-2 md:grid-cols-4">
          {competitor.specs.map((s, i) => (
            <li
              key={s.label}
              className={cn(
                "flex flex-col px-5 py-6 motion-safe:animate-hero-rise sm:px-7 sm:py-7",
                CELL,
              )}
              style={rise(0.45 + i * 0.05)}
            >
              <span className="font-display text-[1.55rem] font-medium leading-none tracking-[-0.03em] text-ink sm:text-[1.8rem]">
                {s.value}
              </span>
              <span className="mt-2 text-[0.8rem] leading-snug text-muted-foreground">
                {s.label}
              </span>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}
