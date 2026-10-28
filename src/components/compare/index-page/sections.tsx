/**
 * The /compare hub's sections, in the landing page's frame: hairline rails,
 * a hairline over every band, blank bands between sections, white
 * throughout. Every word a visitor reads is the old hub's copy or the
 * matchup data, unchanged; these only decide how it's set.
 */
import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  ChevronRight,
  Globe,
  LayoutGrid,
  Link2,
  Scale,
  Swords,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { setPendingSiteUrl } from "@/lib/pending-site";
import { formatDate } from "@/lib/format-date";
import { Reveal } from "@/components/landing/shared";
import { MarkDither } from "@/components/landing/hero-dither";
import {
  Accent,
  Band,
  CELL,
  CellGrid,
  LINE,
  PANEL,
  Pill,
  SectionHead,
  Spacer,
} from "@/components/landing/frame";
import { Mark } from "@/components/brand/Mark";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { TRIAL_CTA } from "@/data/pricing";
import { ProductMark, RankboxTile } from "@/components/compare/kit";
import {
  CATEGORIES,
  COMPARE_UPDATED,
  MATCHUPS,
  getCategory,
  matchupTitle,
  sidesOf,
  type CategoryId,
  type Matchup,
} from "@/data/compare/matchups";
import type { Side } from "@/data/compare/types";
import { METHOD, lowerFirst, rise } from "./copy";
import { Pair, RoundStrip, Tally } from "./parts";

const SIDES: Side[] = ["a", "b"];

const SOLID_BUTTON =
  "group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-cta px-5 text-[0.95rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-[background-color,transform] duration-150 hover:bg-cta-hover active:scale-[0.985] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25";

const OUTLINE_BUTTON =
  "group inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-ink/[0.1] bg-white px-5 text-[0.95rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-[border-color,background-color] hover:border-ink/[0.18] hover:bg-ink/[0.02] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/20";

const H2 =
  "font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]";

/* ---------- hero ---------- */

export function HubHero() {
  const productCount = new Set(MATCHUPS.flatMap((m) => [m.a, m.b])).size;

  return (
    <section id="top" aria-labelledby="compare-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        <div className="flex flex-col items-center px-5 pb-14 pt-6 text-center sm:px-8 sm:pb-16 sm:pt-8 lg:pb-20">
          <nav
            aria-label="Breadcrumb"
            className="self-start motion-safe:animate-hero-rise"
            style={rise(0)}
          >
            <ol className="flex items-center gap-1.5 text-[0.78rem] text-muted-foreground">
              <li>
                <Link to="/" className="py-2 transition-colors hover:text-ink">
                  Home
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="h-3 w-3" />
              </li>
              <li aria-current="page" className="font-medium text-ink">
                Compare
              </li>
            </ol>
          </nav>

          <div className="mt-10 motion-safe:animate-hero-rise sm:mt-12" style={rise(0.05)}>
            {/* Each half keeps to one line, so a phone breaks the pill
                between them rather than inside the date. */}
            <Pill icon={Swords} className="flex-wrap justify-center gap-y-0 text-center">
              <span className="whitespace-nowrap">
                {MATCHUPS.length} head-to-heads · {productCount} tools ·
              </span>{" "}
              <span className="whitespace-nowrap">updated {formatDate(COMPARE_UPDATED)}</span>
            </Pill>
          </div>

          <h1
            id="compare-title"
            className="mt-6 max-w-4xl font-display text-[2.3rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.55rem] sm:text-[3.4rem] lg:text-[4rem]"
            style={rise(0.12)}
          >
            <span className="block text-balance">The tools on your shortlist,</span>{" "}
            <Accent>head to head</Accent>
          </h1>

          <p
            className="mt-6 max-w-[40rem] text-balance text-[1.05rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.12rem]"
            style={rise(0.22)}
          >
            SEO and AI search tools, two at a time. Each page runs the same rounds, calls a winner
            in every one, dates every price, and ends with a picker that tells you which one fits
            your situation.
          </p>

          <div
            className="mt-9 flex w-full flex-col gap-2.5 motion-safe:animate-hero-rise sm:w-auto sm:flex-row"
            style={rise(0.32)}
          >
            <a href="#library" className={SOLID_BUTTON}>
              Every head-to-head
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </a>
            <a href="#method" className={OUTLINE_BUTTON}>
              How we judge
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- how we judge ---------- */

/* One small picture per principle, drawn rather than iconned: a strip of
   called rounds, a list of dated sources, and two contenders above a rule
   with Rankbox set apart below it. Decorative only. */
function RoundsGlyph() {
  const slots = ["won", "won", "draw", "won", "won"] as const;
  return (
    <span className="flex items-center gap-1.5">
      {slots.map((s, i) => (
        <span
          key={i}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-[6px]",
            s === "won"
              ? "bg-brand-blue shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
              : "border border-ink/[0.1] bg-[#eef1f5] text-[0.8rem] font-bold leading-none text-ink/45",
          )}
        >
          {s === "draw" && "="}
        </span>
      ))}
    </span>
  );
}

function SourcesGlyph() {
  return (
    <span className="flex w-44 flex-col gap-1.5 rounded-lg border border-ink/[0.08] bg-white p-2.5 shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
      {[0.78, 0.62, 0.7].map((w, i) => (
        <span key={i} className="flex items-center gap-2">
          <Link2 className="h-3 w-3 shrink-0 text-brand-blue" />
          <span className="h-1.5 rounded-full bg-ink/[0.12]" style={{ width: `${w * 100}%` }} />
          <span className="ml-auto h-3 w-7 shrink-0 rounded-[4px] bg-cta-soft" />
        </span>
      ))}
    </span>
  );
}

function OursGlyph() {
  return (
    <span className="flex flex-col items-center gap-2">
      <span className="flex items-center gap-1.5">
        <span className="h-7 w-7 rounded-[26%] border border-ink/[0.1] bg-white" />
        <span className="text-[0.55rem] font-bold tracking-[0.08em] text-muted-foreground">VS</span>
        <span className="h-7 w-7 rounded-[26%] border border-ink/[0.1] bg-white" />
      </span>
      <span className="h-px w-28 border-t border-dashed border-ink/[0.2]" />
      <span className="flex items-center gap-1.5 rounded-md border border-ink/[0.08] bg-white py-1 pl-1 pr-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-[5px] bg-cta-soft text-brand-blue">
          <Mark className="h-3 w-3" />
        </span>
        <span className="h-1.5 w-8 rounded-full bg-ink/[0.12]" />
      </span>
    </span>
  );
}

const GLYPHS = [RoundsGlyph, SourcesGlyph, OursGlyph];

export function MethodSection() {
  return (
    <section aria-labelledby="method-title" id="method" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={Scale}
        eyebrow="How we judge"
        title={
          <span id="method-title">
            A verdict <Accent>you can check</Accent>
          </span>
        }
      />
      <Band>
        <CellGrid className="md:grid-cols-3">
          {METHOD.map((p, i) => {
            const Glyph = GLYPHS[i];
            return (
              <li key={p.title} className={CELL}>
                <Reveal delay={i * 0.06} className="flex h-full flex-col p-6 sm:p-8">
                  <div
                    aria-hidden
                    className={cn(
                      "flex h-32 items-center justify-center rounded-xl border",
                      LINE,
                      PANEL,
                    )}
                  >
                    {Glyph && <Glyph />}
                  </div>
                  <span className="mt-6 text-[0.75rem] font-semibold tabular-nums text-brand-blue">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-1.5 text-[1.08rem] font-semibold tracking-tight text-ink">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[0.9rem] leading-relaxed text-muted-foreground">
                    {p.body}
                  </p>
                </Reveal>
              </li>
            );
          })}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- the library ---------- */

function MatchCard({ matchup }: { matchup: Matchup }) {
  const sides = sidesOf(matchup);
  return (
    <Link
      to="/compare/$slug"
      params={{ slug: matchup.slug }}
      className="group flex h-full flex-col p-6 transition-colors duration-200 hover:bg-cta-soft/40 focus-visible:bg-cta-soft/40 focus-visible:outline-none sm:p-7"
    >
      <div className="flex items-center justify-between gap-3">
        <Pair a={sides.a} b={sides.b} />
        <span className="text-right text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-brand-blue">
          {getCategory(matchup.category).name}
        </span>
      </div>
      <h3 className="mt-5 font-display text-[1.2rem] font-medium tracking-[-0.02em] text-ink">
        {matchupTitle(matchup)}
      </h3>
      <ul className={cn("mt-4 flex-1 space-y-3 border-t pt-4", LINE)}>
        {SIDES.map((side) => (
          <li key={side} className="flex gap-2.5 text-[0.85rem] leading-snug">
            <ProductMark product={sides[side]} className="mt-px h-5 w-5 text-[0.5rem]" />
            <span className="text-muted-foreground">
              <span className="font-semibold text-ink">{sides[side].name}</span> for{" "}
              {lowerFirst(matchup.bestFor[side])}
            </span>
          </li>
        ))}
      </ul>
      <div
        className={cn(
          "mt-6 flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5",
          LINE,
          PANEL,
        )}
      >
        <RoundStrip
          matchup={matchup}
          className="gap-1.5 [--gap:3px] [--slot:12px] md:gap-1.5 md:[--slot:12px]"
        />
        <Tally matchup={matchup} className="text-[0.78rem]" />
      </div>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-cta">
        Read the verdict
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

/* One grid, filtered by what the buyer is shopping for. Every card renders in
   the server HTML (the filter starts on "All"), so crawlers see the whole
   library; the chips only narrow it for people. */
export function LibrarySection() {
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const list = category === "all" ? MATCHUPS : MATCHUPS.filter((m) => m.category === category);
  const chips = [
    { id: "all" as const, name: "All", count: MATCHUPS.length },
    ...CATEGORIES.map((c) => ({
      id: c.id,
      name: c.name,
      count: MATCHUPS.filter((m) => m.category === c.id).length,
    })).filter((c) => c.count > 0),
  ];

  return (
    <section aria-labelledby="library-title" id="library" className="scroll-mt-16">
      <Spacer />
      <Band inner="px-5 py-12 sm:px-8 sm:py-14 lg:px-12">
        <Reveal className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Pill icon={LayoutGrid}>Library</Pill>
            <h2 id="library-title" className={cn("mt-5", H2)}>
              Every <Accent>head-to-head</Accent>
            </h2>
            <p
              aria-live="polite"
              className="mt-3 max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground sm:text-[1.05rem]"
            >
              {category === "all"
                ? "Pick the pair you're deciding between."
                : getCategory(category).blurb}
            </p>
          </div>
          <div
            role="group"
            aria-label="Filter by category"
            className="flex flex-wrap gap-2 lg:max-w-[30rem] lg:justify-end"
          >
            {chips.map((c) => {
              const on = category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    "inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-[0.85rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/20",
                    on
                      ? "border-cta/30 bg-cta-soft text-cta"
                      : "border-ink/[0.1] bg-white text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:border-ink/[0.18]",
                  )}
                >
                  {c.name}
                  <span
                    className={cn(
                      "flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-[0.72rem] tabular-nums",
                      on ? "bg-white text-cta" : "bg-ink/[0.05] text-muted-foreground",
                    )}
                  >
                    {c.count}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>
      </Band>
      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-3">
          {list.map((m) => (
            <li key={m.slug} className={CELL}>
              <MatchCard matchup={m} />
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- Rankbox's own comparisons ---------- */

export function OursBand() {
  return (
    <section aria-labelledby="ours-title">
      <Spacer />
      <Band inner="px-5 py-10 sm:px-8 sm:py-12 lg:px-12">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
          <RankboxTile className="h-14 w-14 shadow-[0_1px_2px_rgba(16,24,40,0.05)]" />
          <div className="flex-1">
            <h2
              id="ours-title"
              className="text-balance font-display text-[1.5rem] font-medium leading-[1.15] tracking-[-0.025em] text-ink sm:text-[1.85rem]"
            >
              Weighing Rankbox against <Accent>one of these?</Accent>
            </h2>
            <p className="mt-2.5 max-w-xl text-balance text-[0.95rem] leading-relaxed text-muted-foreground">
              Those comparisons are ours to make, so they live on their own pages — including the
              cases where the other tool is the better buy.
            </p>
          </div>
          <Link to="/alternatives" className={cn(OUTLINE_BUTTON, "w-fit shrink-0")}>
            Rankbox vs the alternatives
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </Band>
    </section>
  );
}

/* ---------- closing ---------- */

/* The URL field on blue: a clear field and a white button, since a blue
   button would vanish into the band. Same hand-off as the landing's form. */
function ClosingForm() {
  const [url, setUrl] = useState("");
  const go = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    // Persist before navigating: this is a full page load, and OAuth adds a
    // third-party round trip, so the query string alone will not survive.
    if (trimmed) setPendingSiteUrl(trimmed);
    const q = trimmed ? `?url=${encodeURIComponent(trimmed)}` : "";
    window.location.href = `/auth${q}`;
  };

  return (
    <form
      onSubmit={go}
      className="group mx-auto flex w-full max-w-[34rem] flex-col gap-2.5 sm:flex-row"
    >
      <label className="flex h-12 min-w-0 flex-1 cursor-text items-center gap-2.5 rounded-lg border border-white/35 bg-white/10 px-3.5 transition-[border-color,background-color] focus-within:border-white focus-within:bg-white/15">
        <Globe aria-hidden className="h-4 w-4 shrink-0 text-white/80" />
        <input
          type="text"
          inputMode="url"
          autoComplete="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Your website URL"
          aria-label="Your website URL"
          className="w-full text-ellipsis bg-transparent text-[0.95rem] text-white outline-none placeholder:text-white/80"
        />
      </label>
      <button
        type="submit"
        className="inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-white px-5 text-[0.95rem] font-semibold text-cta shadow-[0_1px_2px_rgba(4,24,72,0.2),0_8px_24px_-12px_rgba(4,24,72,0.5)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-white/95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
      >
        {TRIAL_CTA}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </form>
  );
}

export function ClosingBand() {
  return (
    <section aria-labelledby="compare-cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.14] [mask-image:radial-gradient(ellipse_70%_85%_at_50%_50%,#000_35%,transparent_100%)]"
        >
          <MarkDither className="text-white" />
        </div>
        <Reveal className="relative px-5 py-16 text-center sm:px-8 sm:py-20">
          <h2
            id="compare-cta-title"
            className="mx-auto max-w-2xl text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.75rem]"
          >
            Rather have the articles than another tool?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
            Paste your URL. Rankbox reads your site and shows the content gaps, the competitors
            you&rsquo;re up against, and the topics it would write first.
          </p>
          <div className="mt-8">
            <ClosingForm />
            <p className="mt-3.5 text-[0.82rem] text-white">{TRIAL_NOTE}</p>
          </div>
        </Reveal>
      </Band>
      <Spacer closing />
    </section>
  );
}
