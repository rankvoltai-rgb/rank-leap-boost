/**
 * The page's opening: a split hero in the landing frame (the promise and the
 * URL field on the left, the at-a-glance facts on a grey panel on the right),
 * then the quotable short answer in a band of its own.
 *
 * The facts card reads the same snapshot the /alternatives hub table reads,
 * so the two can never disagree.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeftRight, ChevronRight, Quote } from "lucide-react";
import { Accent, Band, LINE, PANEL, Pill } from "@/components/landing/frame";
import { UrlForm } from "@/components/landing/Hero";
import { MarkDither } from "@/components/landing/hero-dither";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { CompetitorMark, RankboxMark, VsLockup } from "@/components/alternatives/kit";
import { PLAN, formatUsd } from "@/data/pricing";
import {
  RANKBOX_SNAPSHOT,
  formatCheckedOn,
  formatCheckedOnShort,
  type Competitor,
  type Fact,
} from "@/data/alternatives";
import { cn } from "@/lib/utils";
import { rise } from "./lib";
import { StateMark } from "./ui";

/* ---------- Breadcrumb ---------- */

function Breadcrumb({ name }: { name: string }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-[0.8rem] text-muted-foreground">
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
        <li aria-current="page" className="font-medium text-ink">
          {name}
        </li>
      </ol>
    </nav>
  );
}

/* ---------- At a glance ---------- */

type GlanceValue = string | Fact;

/** The hero card's rows, from the same snapshot the hub table reads. */
function glanceRows(c: Competitor): { label: string; rankbox: GlanceValue; them: GlanceValue }[] {
  return [
    { label: "Best for", rankbox: RANKBOX_SNAPSHOT.bestFor, them: c.snapshot.bestFor },
    {
      label: "Price",
      rankbox: `${formatUsd(PLAN.monthly)}/mo`,
      them: `${formatUsd(c.pricing.monthly)}/mo · ${c.pricing.plan}`,
    },
    {
      label: "Articles included",
      rankbox: `${PLAN.articlesPerMonth} a month`,
      them: c.pricing.articles ? `${c.pricing.articles} a month` : "Not sold per article",
    },
    { label: "Publishing", rankbox: RANKBOX_SNAPSHOT.publishing, them: c.snapshot.publishing },
    { label: "Backlinks", rankbox: RANKBOX_SNAPSHOT.backlinks, them: c.snapshot.backlinks },
    {
      label: "AI visibility",
      rankbox: RANKBOX_SNAPSHOT.aiVisibility,
      them: c.snapshot.aiVisibility,
    },
    {
      label: "Keyword data",
      rankbox: RANKBOX_SNAPSHOT.keywordData,
      them: c.snapshot.keywordData,
    },
  ];
}

function Value({
  value,
  side,
  who,
}: {
  value: GlanceValue;
  side: "rankbox" | "them";
  who: string;
}) {
  const strong = side === "rankbox";
  if (typeof value === "string") {
    return (
      <span className={cn("min-w-0", strong ? "font-medium text-ink" : "text-ink/75")}>
        <span className="sr-only">{who}: </span>
        {value}
      </span>
    );
  }
  return (
    <span className="flex min-w-0 items-start gap-2">
      <StateMark state={value.state} side={side} className="mt-px h-4 w-4 scale-90" />
      <span className={cn("min-w-0", strong ? "font-medium text-ink" : "text-ink/75")}>
        <span className="sr-only">{who}: </span>
        {value.short}
      </span>
    </span>
  );
}

function GlanceCard({ competitor: c }: { competitor: Competitor }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-ink/[0.08] bg-white text-left shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-28px_rgba(16,24,40,0.3)]">
      <div className={cn("flex items-center justify-between gap-3 border-b px-5 py-3.5", LINE)}>
        <p className="text-[0.92rem] font-medium text-ink">At a glance</p>
        <span className="rounded-md bg-cta-soft px-2 py-0.5 text-[0.7rem] font-medium text-cta">
          Checked {formatCheckedOnShort(c.pricing.checkedOn)}
        </span>
      </div>

      {/* Column heads. Each value also carries its product's name for screen
          readers, so these are decoration. */}
      <div aria-hidden className={cn("grid grid-cols-2 border-b", LINE)}>
        <div className="flex items-center gap-2 bg-[color-mix(in_oklab,var(--cta)_5%,white)] px-5 py-2.5">
          <RankboxMark className="h-6 w-6" />
          <span className="text-[0.8rem] font-semibold text-cta">Rankbox</span>
        </div>
        <div className={cn("flex min-w-0 items-center gap-2 border-l px-5 py-2.5", LINE)}>
          <CompetitorMark competitor={c} className="h-6 w-6 text-[0.6rem]" />
          <span className="truncate text-[0.8rem] font-semibold text-ink">{c.name}</span>
        </div>
      </div>

      <dl>
        {glanceRows(c).map((r) => (
          <div key={r.label} className={cn("border-b last:border-b-0", LINE)}>
            <dt className="px-5 pt-3 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {r.label}
            </dt>
            <dd className="grid grid-cols-2 text-[0.82rem] leading-snug">
              <span className="block bg-[color-mix(in_oklab,var(--cta)_5%,white)] px-5 pb-3 pt-1.5">
                <Value value={r.rankbox} side="rankbox" who="Rankbox" />
              </span>
              <span className={cn("block border-l px-5 pb-3 pt-1.5", LINE)}>
                <Value value={r.them} side="them" who={c.name} />
              </span>
            </dd>
          </div>
        ))}
      </dl>

      <p
        className={cn(
          "border-t px-5 py-3.5 text-[0.75rem] leading-relaxed text-muted-foreground",
          LINE,
        )}
      >
        {c.name} facts from their own pages; Rankbox facts are what ships today.{" "}
        <a href="#compare" className="font-medium text-ink underline underline-offset-2">
          Every row
        </a>{" "}
        and{" "}
        <a href="#sources" className="font-medium text-ink underline underline-offset-2">
          the sources
        </a>{" "}
        are below.
      </p>
    </div>
  );
}

/* ---------- Hero ---------- */

export function WritesonicHero({ competitor: c }: { competitor: Competitor }) {
  const [url, setUrl] = useState("");
  return (
    <section id="top" aria-labelledby="ws-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        <div className="grid lg:grid-cols-[1.06fr_0.94fr]">
          <div className="flex flex-col justify-center px-5 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-12 lg:px-12 lg:pb-20 lg:pt-14">
            <div className="motion-safe:animate-hero-rise" style={rise(0)}>
              <Breadcrumb name={c.name} />
            </div>

            <div
              className="mt-8 flex flex-wrap items-center gap-3 motion-safe:animate-hero-rise"
              style={rise(0.06)}
            >
              <VsLockup competitor={c} size="sm" />
              <Pill icon={ArrowLeftRight}>{c.eyebrow}</Pill>
            </div>

            <h1
              id="ws-title"
              className="mt-6 text-balance font-display text-[2.25rem] font-medium leading-[1.07] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.5rem] sm:text-[3.1rem] lg:text-[3.3rem]"
              style={rise(0.12)}
            >
              <span className="block">{c.headline.lead}</span> <Accent>{c.headline.accent}</Accent>
            </h1>

            <p
              className="mt-6 max-w-[36rem] text-[1.02rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.08rem]"
              style={rise(0.2)}
            >
              {c.subhead}
            </p>

            <div className="mt-8 max-w-[35rem] motion-safe:animate-hero-rise" style={rise(0.28)}>
              <UrlForm url={url} onChange={setUrl} variant="split" />
              <p className="mt-3 text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
            </div>
          </div>

          <div
            className={cn(
              "relative overflow-hidden border-t lg:border-l lg:border-t-0",
              LINE,
              PANEL,
            )}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.22] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_30%,transparent_100%)]"
            >
              <MarkDither />
            </div>
            <div
              className="relative flex h-full items-center px-4 py-10 motion-safe:animate-hero-rise sm:px-8 lg:px-10 lg:py-14"
              style={rise(0.34)}
            >
              <GlanceCard competitor={c} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- The short answer ---------- */

/**
 * Written to be lifted whole by an answer engine: it names both products,
 * draws the line between them, and says who each is for. Set large, in a
 * band of its own, straight under the hero.
 */
export function WritesonicShortAnswer({ competitor: c }: { competitor: Competitor }) {
  return (
    <section aria-labelledby="short-answer-title">
      <Band>
        <div className="grid lg:grid-cols-[17rem_1fr]">
          <div
            className={cn(
              "flex flex-col gap-4 border-b px-5 py-8 sm:px-8 lg:border-b-0 lg:border-r lg:px-10 lg:py-12",
              LINE,
            )}
          >
            <h2 id="short-answer-title" className="w-fit">
              <Pill icon={Quote}>The short answer</Pill>
            </h2>
            <p className="text-[0.82rem] leading-relaxed text-muted-foreground">
              Checked against {c.name}&rsquo;s own pages on {formatCheckedOn(c.pricing.checkedOn)}.
            </p>
          </div>
          <div className="px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
            <p className="max-w-[46rem] text-pretty text-[1.05rem] leading-[1.7] text-ink sm:text-[1.18rem]">
              {c.shortAnswer}
            </p>
          </div>
        </div>
      </Band>
    </section>
  );
}
