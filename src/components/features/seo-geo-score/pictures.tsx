/**
 * The smaller pictures on /features/seo-geo-score: the hero's fact glyphs,
 * the half-checked search box, the two lenses, the content panel, the score
 * bands, and the articles list that rises from the closing band.
 *
 * Check names, verdicts and bands are the Rankbox editor's own. The article
 * is the focal picture's sample, finished: 96, 6 of 6 signals, the meta
 * description still a warning. Everything sits on "yoursite.com".
 */
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, CircleDashed, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatGPTMark, GeminiMark, GoogleMark, PerplexityMark } from "@/components/landing/ai-logos";
import { EASE, useStory } from "./clock";
import { ScoreRing, StatusIcon, type Status } from "./parts";
import { scoreTone, verdict } from "./bands";

const CARD =
  "rounded-xl border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_20px_40px_-24px_rgba(16,24,40,0.24)]";

function EngineStack({ className }: { className?: string }) {
  return (
    <span className={cn("flex -space-x-1", className)}>
      {[ChatGPTMark, PerplexityMark, GeminiMark].map((M, i) => (
        <span
          key={i}
          className="flex h-5 w-5 items-center justify-center rounded-md border border-ink/[0.08] bg-white"
        >
          <M className="h-3 w-3" />
        </span>
      ))}
    </span>
  );
}

function GoogleTile() {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-md border border-ink/[0.08] bg-white">
      <GoogleMark className="h-3 w-3" />
    </span>
  );
}

/* ---------- Hero fact glyphs ---------- */

/** Two scores: a ring for Google, a segmented bar for AI answers. */
function TwoScores() {
  return (
    <span className="flex items-center gap-2">
      <svg viewBox="0 0 24 24" className="h-7 w-7 -rotate-90" aria-hidden>
        <circle cx="12" cy="12" r="9" fill="none" stroke="var(--border)" strokeWidth="3" />
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="var(--success)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 9 * 0.96} ${2 * Math.PI * 9}`}
        />
      </svg>
      <span className="grid w-[4.5rem] grid-cols-6 gap-[3px]">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} className="h-1.5 rounded-full bg-cta" />
        ))}
      </span>
    </span>
  );
}

/** Six-plus checks: a column of ticks. */
function Ticks() {
  return (
    <span className="grid grid-cols-3 gap-1">
      {Array.from({ length: 6 }, (_, i) => (
        <CheckCircle2 key={i} className="h-3.5 w-3.5 text-success" />
      ))}
    </span>
  );
}

/** Pre-publish: the score sits before the line marked live. */
function BeforeLive() {
  return (
    <span className="flex items-center gap-1.5 text-[0.62rem] font-semibold text-muted-foreground">
      <span className="rounded-md border border-ink/[0.08] bg-white px-1.5 py-0.5">Draft</span>
      <span className="h-px w-3 bg-ink/15" />
      <span className="rounded-md bg-cta px-1.5 py-0.5 text-white">Score</span>
      <span className="h-px w-3 bg-ink/15" />
      <span className="rounded-md border border-ink/[0.08] bg-white px-1.5 py-0.5">Live</span>
    </span>
  );
}

/** Clear fixes: a flag turns into a tick. */
function FlagToFix() {
  return (
    <span className="flex items-center gap-1.5">
      <StatusIcon status="warn" animate={false} />
      <ArrowRight className="h-3 w-3 text-muted-foreground/70" />
      <StatusIcon status="pass" animate={false} />
    </span>
  );
}

const SPEC_GLYPHS = [TwoScores, Ticks, BeforeLive, FlagToFix];

/** The glyph for the hero's `i`th fact. */
export function SpecGlyph({ i }: { i: number }) {
  const Glyph = SPEC_GLYPHS[i];
  return Glyph ? <Glyph /> : null;
}

/* ---------- The half-checked search box ---------- */

/* Google only, then AI only, then both: what a score for one side misses. */
const HALVES = [2600, 2600, 3800] as const;

function Half({
  on,
  title,
  mark,
  items,
}: {
  on: boolean;
  title: string;
  mark: ReactNode;
  items: string[];
}) {
  return (
    <div className="relative p-3.5 sm:p-5">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        {mark}
        <p className="text-[0.8rem] font-semibold text-ink">{title}</p>
        <span
          className={cn(
            "rounded-md px-1.5 py-0.5 text-[0.62rem] font-semibold transition-colors duration-500 motion-reduce:transition-none sm:ml-auto",
            on ? "bg-success/12 text-success" : "border border-ink/[0.08] text-muted-foreground",
          )}
        >
          {on ? "Checked" : "Not checked"}
        </span>
      </div>
      <ul className="mt-3.5 space-y-2">
        {items.map((item, i) => (
          <li
            key={item}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-2.5 py-2 text-[0.74rem] transition-[border-color,background-color,color] duration-500 motion-reduce:transition-none",
              on
                ? "border-ink/[0.07] bg-white text-ink"
                : "border-dashed border-ink/[0.12] bg-transparent text-muted-foreground",
            )}
            style={{ transitionDelay: on ? `${i * 90}ms` : "0ms" }}
          >
            {on ? (
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
            ) : (
              <CircleDashed className="h-3.5 w-3.5 shrink-0 text-ink/25" />
            )}
            <span className="truncate">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SplitSearch() {
  const { ref, phase } = useStory<HTMLDivElement>(HALVES);
  const google = phase !== 1;
  const ai = phase !== 0;
  const caption = ["Checked for Google only", "Checked for AI answers only", "Checked for both"][
    phase
  ];
  return (
    <div
      ref={ref}
      role="img"
      aria-label="A search for kanban vs scrum, split into Google results and AI answers. A draft checked for only one side leaves the other unchecked; checked for both, every line passes."
      className="mx-auto mt-10 max-w-[40rem] text-left"
    >
      <div className="flex h-12 items-center gap-3 rounded-xl border border-ink/[0.1] bg-white px-4 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_28px_-18px_rgba(16,24,40,0.2)]">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="truncate text-[0.92rem] text-ink">kanban vs scrum</span>
        <span className="ml-auto flex shrink-0 items-center gap-1.5">
          <GoogleTile />
          <EngineStack />
        </span>
      </div>
      <div className="mt-2.5 grid grid-cols-2 divide-x divide-ink/[0.07] overflow-hidden rounded-xl border border-ink/[0.08] bg-[color-mix(in_oklab,var(--surface)_55%,white)]">
        <Half
          on={google}
          title="Google results"
          mark={<GoogleTile />}
          items={["Keyword in title", "Meta description", "Sub-headings"]}
        />
        <Half
          on={ai}
          title="AI answers"
          mark={<EngineStack />}
          items={["Answers up front", "FAQ section", "Cites sources"]}
        />
      </div>
      <div className="mt-3 flex items-center justify-center gap-2 text-[0.75rem] font-medium text-muted-foreground">
        <span className="flex gap-1">
          {HALVES.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1 rounded-full transition-[width,background-color] duration-500",
                i === phase ? "w-4 bg-cta" : "w-1 bg-ink/15",
              )}
            />
          ))}
        </span>
        {caption}
      </div>
    </div>
  );
}

/* ---------- Benefits ---------- */

function Lens({
  head,
  title,
  sub,
  readout,
  items,
}: {
  head: ReactNode;
  title: string;
  sub: string;
  readout: ReactNode;
  items: [string, Status][];
}) {
  return (
    <div className={cn(CARD, "p-4")}>
      <div className="flex items-center gap-2.5">
        {head}
        <div className="min-w-0">
          <p className="text-[0.82rem] font-semibold text-ink">{title}</p>
          <p className="text-[0.68rem] text-muted-foreground">{sub}</p>
        </div>
        <div className="ml-auto">{readout}</div>
      </div>
      <ul className="mt-3.5 space-y-1.5 border-t border-ink/[0.07] pt-3">
        {items.map(([item, status]) => (
          <li key={item} className="flex items-center gap-2 text-[0.75rem] text-ink">
            <StatusIcon status={status} animate={false} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Dual optimization: the same checklist read as two lenses. */
export function DualLens() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Lens
        head={<GoogleTile />}
        title="SEO"
        sub="For Google"
        readout={<ScoreRing score={96} size={40} />}
        items={[
          ["Keyword in title", "pass"],
          ["Keyword density", "pass"],
          ["Sub-headings", "pass"],
          ["Scannable lists", "pass"],
          ["Meta description", "warn"],
        ]}
      />
      <Lens
        head={<EngineStack />}
        title="GEO"
        sub="For AI answers"
        readout={
          <span className="text-[1.05rem] font-semibold tabular-nums text-ink">
            6<span className="text-[0.72rem] font-medium text-muted-foreground"> / 6</span>
          </span>
        }
        items={[
          ["Answers up front", "pass"],
          ["FAQ section", "pass"],
          ["Clear sections", "pass"],
          ["Cites sources", "pass"],
          ["Depth", "pass"],
          ["Easy to read", "pass"],
        ]}
      />
    </div>
  );
}

/** Actionable checks: the editor's Content panel for the finished sample. */
export function ContentPanel() {
  const metrics = [
    ["Words", "1,986"],
    ["Read time", "9 min"],
    ["Keyword density", "1.1%"],
    ["Headings", "4 H2 · 2 H3"],
    ["Links", "3"],
    ["Readability", "Fairly easy"],
  ];
  return (
    <div className={cn(CARD, "p-4")}>
      <div className="flex items-center justify-between">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Content
        </p>
        <span className="text-[0.66rem] text-muted-foreground">kanban vs scrum</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {metrics.map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg border border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_55%,white)] px-3 py-2.5"
          >
            <p className="text-[0.66rem] text-muted-foreground">{label}</p>
            <p className="mt-0.5 text-[0.88rem] font-semibold tracking-tight text-ink tabular-nums">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* The editor's three bands, as shares of the 0 to 100 scale. */
const BANDS = [
  { from: 0, to: 54, fill: "bg-destructive/25", dot: "var(--destructive)" },
  { from: 55, to: 79, fill: "bg-warning/40", dot: "var(--warning)" },
  { from: 80, to: 100, fill: "bg-success/30", dot: "var(--success)" },
];
const SCALE_STORY = [1700, 3800] as const;

/** Quality you can trust: the bands, with the draft's needle crossing into green. */
export function ScoreBands() {
  const { ref, phase, still } = useStory<HTMLDivElement>(SCALE_STORY, 0.5);
  const score = phase === 0 ? 76 : 96;
  return (
    <div ref={ref} className={cn(CARD, "p-4")}>
      <div className="flex items-center justify-between">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Score bands
        </p>
        <span className="text-[0.66rem] tabular-nums text-muted-foreground">0–100</span>
      </div>

      <div className="relative mt-9">
        <motion.div
          className="absolute -top-7 flex -translate-x-1/2 flex-col items-center"
          initial={false}
          animate={{ left: `${score}%` }}
          transition={still ? { duration: 0 } : { duration: 0.9, ease: EASE }}
        >
          <span
            className={cn(
              "rounded-md px-1.5 py-0.5 text-[0.66rem] font-semibold tabular-nums text-white transition-colors duration-500",
              score >= 80 ? "bg-success" : "bg-[oklch(0.6_0.14_68)]",
            )}
          >
            {score}
          </span>
          <span className="mt-0.5 h-3 w-px bg-ink/40" />
        </motion.div>
        <div className="flex h-2.5 gap-[3px] overflow-hidden rounded-full">
          {BANDS.map((b) => (
            <span key={b.from} className={b.fill} style={{ flex: `${b.to - b.from + 1} 1 0` }} />
          ))}
        </div>
        <div className="relative mt-1.5 h-3 text-[0.6rem] tabular-nums text-muted-foreground">
          {[0, 55, 80, 100].map((t) => (
            <span
              key={t}
              className={cn(
                "absolute top-0",
                t === 0 ? "left-0" : t === 100 ? "right-0" : "-translate-x-1/2",
              )}
              style={t > 0 && t < 100 ? { left: `${t}%` } : undefined}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <ul className="mt-4 space-y-1">
        {[...BANDS].reverse().map((b) => {
          const here = score >= b.from && score <= b.to;
          return (
            <li
              key={b.from}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[0.74rem] transition-colors duration-500",
                here ? "bg-ink/[0.04] font-medium text-ink" : "text-muted-foreground",
              )}
            >
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: b.dot }} />
              <span className="w-12 shrink-0 tabular-nums">
                {b.from}–{b.to}
              </span>
              <span className="truncate">{verdict(b.from)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------- The closing band's articles list ---------- */

const ARTICLES: { title: string; stage: "Published" | "Scheduled" | "Writing"; score?: number }[] =
  [
    { title: "Kanban vs Scrum: Which Should a Small Team Use?", stage: "Published", score: 96 },
    { title: "How to Run Async Standups", stage: "Published", score: 92 },
    { title: "Sprint Planning for Small Teams", stage: "Scheduled", score: 88 },
    { title: "What Goes in a Product Roadmap?", stage: "Writing" },
  ];

export function ArticlesPeek() {
  return (
    <div
      aria-hidden
      className="rounded-t-xl border border-b-0 border-white/40 bg-white text-left shadow-[0_-12px_48px_-16px_rgba(4,24,72,0.55)]"
    >
      <div className="flex items-center gap-2 px-4 py-3 sm:px-5">
        <p className="text-[0.82rem] font-semibold text-ink">Articles</p>
        <span className="rounded-md bg-ink/[0.05] px-1.5 py-0.5 text-[0.65rem] font-medium text-muted-foreground">
          yoursite.com
        </span>
        <span className="ml-auto rounded-md border border-ink/[0.08] px-1.5 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          Sample
        </span>
      </div>
      <div className="grid grid-cols-[1fr_auto_3.5rem] gap-x-4 border-y border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_55%,white)] px-4 py-2 text-[0.66rem] font-medium text-muted-foreground sm:px-5">
        <span>Article</span>
        <span>Status</span>
        <span className="text-right">SEO</span>
      </div>
      <ul className="divide-y divide-ink/[0.06]">
        {ARTICLES.map((a) => (
          <li
            key={a.title}
            className="grid grid-cols-[1fr_auto_3.5rem] items-center gap-x-4 px-4 py-2.5 sm:px-5"
          >
            <span className="truncate text-[0.78rem] font-medium text-ink">{a.title}</span>
            <span
              className={cn(
                "rounded-md px-1.5 py-0.5 text-[0.62rem] font-semibold",
                a.stage === "Published" && "bg-success/12 text-success",
                a.stage === "Scheduled" && "border border-ink/[0.08] text-muted-foreground",
                a.stage === "Writing" && "bg-cta-soft text-cta",
              )}
            >
              {a.stage}
            </span>
            <span className="flex items-center justify-end gap-1.5 text-[0.76rem] font-semibold tabular-nums text-ink">
              {a.score ? (
                <>
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: scoreTone(a.score) }}
                  />
                  {a.score}
                </>
              ) : (
                <span className="font-normal text-muted-foreground">—</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
