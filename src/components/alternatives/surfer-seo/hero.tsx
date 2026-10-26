/**
 * The top of /alternatives/surfer-seo: a centred hero with the two marks
 * squared up above the H1, then the at-a-glance band (each product's job in
 * a sentence, and the four facts that decide most shortlists, row for row),
 * and the spec strip closing the hero like the landing's proof band.
 */
import { useId, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowLeftRight, ChevronRight } from "lucide-react";
import { UrlForm } from "@/components/landing/Hero";
import { Band, LINE, Pill } from "@/components/landing/frame";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import { COMPANY } from "@/data/company";
import { cn } from "@/lib/utils";
import {
  RANKBOX_SNAPSHOT,
  formatCheckedOn,
  type Competitor,
  type Fact,
  type Snapshot,
} from "@/data/alternatives";
import { Kicker, StateMark } from "./ui";
import { rise } from "./text";

/* A faint field of small squares down both sides of the copy: the month of
   tiles the page is built around, before it is drawn. Fixed geometry, so the
   server and client renders agree. */
function TileField() {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full text-brand-blue opacity-[0.11] [mask-image:linear-gradient(to_right,#000,transparent_26%,transparent_74%,#000)]"
    >
      <defs>
        <pattern id={`tiles-${id}`} width="24" height="24" patternUnits="userSpaceOnUse">
          <rect x="8" y="8" width="8" height="8" rx="1.5" fill="currentColor" />
        </pattern>
        <linearGradient id={`fade-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="white" stopOpacity="0" />
          <stop offset="0.35" stopColor="white" stopOpacity="1" />
          <stop offset="1" stopColor="white" stopOpacity="0.2" />
        </linearGradient>
        <mask id={`mask-${id}`}>
          <rect width="100%" height="100%" fill={`url(#fade-${id})`} />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill={`url(#tiles-${id})`} mask={`url(#mask-${id})`} />
    </svg>
  );
}

/* The two marks squared up, joined by a hairline. */
function Faceoff({ competitor }: { competitor: Competitor }) {
  return (
    <div aria-hidden className="flex items-center gap-3">
      <RankboxMark className="h-12 w-12 shadow-[0_1px_2px_rgba(16,24,40,0.06)]" />
      <span className="h-px w-8 bg-ink/[0.12] sm:w-12" />
      <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        vs
      </span>
      <span className="h-px w-8 bg-ink/[0.12] sm:w-12" />
      <CompetitorMark
        competitor={competitor}
        className="h-12 w-12 shadow-[0_1px_2px_rgba(16,24,40,0.06)]"
      />
    </div>
  );
}

const FACT_ROWS: { key: keyof Omit<Snapshot, "bestFor">; label: string }[] = [
  { key: "publishing", label: "Publishing" },
  { key: "backlinks", label: "Backlinks" },
  { key: "aiVisibility", label: "AI visibility" },
  { key: "keywordData", label: "Keyword data" },
];

function FactLine({ label, fact, keyed }: { label: string; fact: Fact; keyed?: boolean }) {
  return (
    <div className={cn("grid grid-cols-[7.5rem_1fr] items-start gap-3 border-t py-3", LINE)}>
      <dt className="text-[0.8rem] text-muted-foreground">{label}</dt>
      <dd className="flex items-start gap-2 text-[0.85rem] leading-snug text-ink">
        <StateMark state={fact.state} keyed={keyed} className="-mt-px" />
        {fact.short}
      </dd>
    </div>
  );
}

/* One product's half of the glance band. */
function Side({
  mark,
  name,
  category,
  job,
  bestFor,
  snapshot,
  keyed = false,
}: {
  mark: ReactNode;
  name: string;
  category: string;
  job: string;
  bestFor: string;
  snapshot: Snapshot;
  keyed?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-col px-5 py-8 sm:px-10 sm:py-10 lg:px-12",
        keyed && "bg-[color-mix(in_oklab,var(--cta)_4%,white)]",
      )}
    >
      <div className="flex items-center gap-3">
        {mark}
        <div className="min-w-0">
          <p className="text-[0.95rem] font-semibold text-ink">{name}</p>
          <p className="text-[0.78rem] text-muted-foreground">{category}</p>
        </div>
      </div>
      <p className="mt-6 text-balance font-display text-[1.35rem] font-medium leading-[1.25] tracking-[-0.02em] text-ink sm:text-[1.55rem]">
        {job}
      </p>
      <dl className="mt-7">
        <div className={cn("grid grid-cols-[7.5rem_1fr] items-start gap-3 border-t py-3", LINE)}>
          <dt className="text-[0.8rem] text-muted-foreground">Best for</dt>
          <dd className="text-[0.85rem] font-medium leading-snug text-ink">{bestFor}</dd>
        </div>
        {FACT_ROWS.map((r) => (
          <FactLine key={r.key} label={r.label} fact={snapshot[r.key]} keyed={keyed} />
        ))}
      </dl>
    </div>
  );
}

export function SurferHero({ competitor }: { competitor: Competitor }) {
  const [url, setUrl] = useState("");
  const c = competitor;

  return (
    <section id="top" aria-labelledby="alt-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl overflow-hidden border-x", LINE)}>
        <TileField />

        <div className="relative px-5 pb-14 pt-7 sm:px-10 sm:pb-16 sm:pt-9 lg:pb-20">
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
                {c.name}
              </li>
            </ol>
          </nav>

          <div className="mx-auto mt-10 flex max-w-4xl flex-col items-center text-center sm:mt-12">
            <div className="motion-safe:animate-hero-rise" style={rise(0.04)}>
              <Faceoff competitor={c} />
            </div>

            <div className="mt-7 motion-safe:animate-hero-rise" style={rise(0.09)}>
              <Pill icon={ArrowLeftRight}>{c.eyebrow}</Pill>
            </div>

            <h1
              id="alt-title"
              className="mt-6 text-balance font-display text-[2.2rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.45rem] sm:text-[3.2rem] lg:text-[3.7rem]"
              style={rise(0.14)}
            >
              <span className="block">{c.headline.lead}</span>{" "}
              <span className="font-bold text-brand-blue">{c.headline.accent}</span>
            </h1>

            <p
              className="mt-6 max-w-[42rem] text-balance text-[1.02rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.1rem]"
              style={rise(0.22)}
            >
              {c.subhead}
            </p>

            <div
              className="mt-9 w-full max-w-[37rem] motion-safe:animate-hero-rise"
              style={rise(0.32)}
            >
              <UrlForm url={url} onChange={setUrl} variant="split" />
              <p className="mt-3.5 text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
            </div>
          </div>
        </div>
      </div>

      {/* At a glance: one job sentence each, then the same four rows on both
          sides so the eye can run straight across. */}
      <Band inner="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 py-3.5 sm:px-10 lg:px-12">
        <Kicker>At a glance</Kicker>
        <a
          href="#sources"
          className="group inline-flex items-center gap-1.5 text-[0.8rem] text-muted-foreground transition-colors hover:text-ink"
        >
          Checked {formatCheckedOn(c.pricing.checkedOn)} against {c.name}&rsquo;s own pages
          <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
        </a>
      </Band>
      <Band>
        <div className="grid lg:grid-cols-2">
          <Side
            keyed
            mark={<RankboxMark className="h-10 w-10" />}
            name="Rankbox"
            category={COMPANY.category}
            job={c.verdict.rankbox}
            bestFor={RANKBOX_SNAPSHOT.bestFor}
            snapshot={RANKBOX_SNAPSHOT}
          />
          <div className={cn("border-t lg:border-l lg:border-t-0", LINE)}>
            <Side
              mark={<CompetitorMark competitor={c} className="h-10 w-10" />}
              name={c.name}
              category={c.category}
              job={c.verdict.them}
              bestFor={c.snapshot.bestFor}
              snapshot={c.snapshot}
            />
          </div>
        </div>
      </Band>

      {/* The spec strip: Rankbox's four facts, as the landing's proof band. */}
      <Band>
        <div className="overflow-hidden">
          <dl className="-mb-px -mr-px grid grid-cols-2 lg:grid-cols-4">
            {c.specs.map((s) => (
              <div
                key={s.label}
                className={cn("flex flex-col-reverse border-b border-r px-5 py-6 sm:px-8", LINE)}
              >
                <dt className="mt-1 text-balance text-[0.8rem] leading-snug text-muted-foreground">
                  {s.label}
                </dt>
                <dd className="font-display text-[1.5rem] font-medium tracking-[-0.02em] text-ink sm:text-[1.75rem]">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Band>
    </section>
  );
}
