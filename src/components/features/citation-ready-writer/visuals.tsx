/**
 * The smaller pictures on /features/citation-ready-writer: the ruled-paper
 * ground the hero and closing band are drawn on, one screen per benefit, one
 * picture per step, and the published draft that rises out of the closing
 * band. All of them show the same sample article (sample.ts), on the
 * landing's terms: white screens, hairline borders, soft blue for whatever is
 * selected, real engine marks only as engines.
 */
import type { ReactNode } from "react";
import {
  ArrowDown,
  ArrowRight,
  Bold,
  Check,
  Globe,
  Heading2,
  Italic,
  Link2,
  Plus,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/brand/Mark";
import { PerplexityMark } from "@/components/landing/ai-logos";
import { ANSWER, MORE_TOPICS, QUERIES, SITE, SOURCES, TITLE, TOPIC, WORDS, plain } from "./sample";

/* ---------- Ruled paper ---------- */

/**
 * Faint ruled lines and a margin rule, the page's own ground: the hero is
 * written on it and the closing band returns to it. Decorative only.
 */
export function RuledPaper({
  tone = "ink",
  className,
}: {
  tone?: "ink" | "white";
  className?: string;
}) {
  const line = tone === "ink" ? "rgba(16,24,40,0.042)" : "rgba(255,255,255,0.12)";
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent calc(2.5rem - 1px), ${line} calc(2.5rem - 1px), ${line} 2.5rem)`,
        }}
      />
      <div
        className={cn(
          "absolute inset-y-0 left-8 hidden w-px sm:block lg:left-9",
          tone === "ink" ? "bg-brand-blue/25" : "bg-white/30",
        )}
      />
    </div>
  );
}

/* ---------- Benefit screens ---------- */

/* The white card inside a benefit's tinted panel. It runs past the panel's
   foot and is cropped there, the way the landing shows its screens. */
function ScreenCard({
  title,
  meta,
  children,
  className,
}: {
  title: string;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-ink/[0.07] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-24px_rgba(16,24,40,0.25)] sm:p-5",
        className,
      )}
    >
      <div className="mb-3.5 flex items-center justify-between gap-3">
        <p className="text-[0.8rem] font-semibold text-ink">{title}</p>
        {meta}
      </div>
      {children}
    </div>
  );
}

const PLACED =
  "absolute inset-x-5 top-7 mx-auto max-w-[25rem] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 sm:inset-x-8 sm:top-8";

const ROW =
  "flex items-center justify-between gap-3 rounded-lg border border-ink/[0.07] bg-white px-3 py-2";

export function ResearchScreen() {
  const kept = SOURCES.filter((s) => s.n).length;
  return (
    <ScreenCard
      className={PLACED}
      title="Live research"
      meta={
        <span className="flex items-center gap-1.5 text-[0.68rem] font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          Today
        </span>
      }
    >
      <div className="space-y-2">
        {QUERIES.map((q) => (
          <div key={q} className={ROW}>
            <span className="flex min-w-0 items-center gap-2">
              <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate text-xs font-medium text-ink">{q}</span>
            </span>
            <Check className="h-3.5 w-3.5 shrink-0 text-success" strokeWidth={3} />
          </div>
        ))}
        <div className="flex items-center gap-2 rounded-lg border border-cta/25 bg-cta-soft px-3 py-2 text-xs font-medium text-ink">
          <Globe className="h-3.5 w-3.5 shrink-0 text-cta" />
          {kept} primary sources kept, 1 thin page skipped
        </div>
      </div>
    </ScreenCard>
  );
}

export function VoiceScreen() {
  return (
    <ScreenCard
      className={PLACED}
      title="Brand voice"
      meta={<span className="text-[0.68rem] text-muted-foreground">Set once</span>}
    >
      <div className="flex flex-wrap gap-1.5">
        {["Plain-spoken", "Practical", "No hype"].map((t, i) => (
          <span
            key={t}
            className={cn(
              "rounded-md px-2 py-1 text-[0.7rem] font-medium",
              i === 0 ? "bg-cta text-white" : "border border-ink/[0.08] bg-white text-ink",
            )}
          >
            {t}
          </span>
        ))}
      </div>
      <div className="mt-3 space-y-2">
        <div className="rounded-lg border border-ink/[0.07] bg-ink/[0.02] px-3 py-2">
          <p className="text-[0.62rem] font-semibold text-muted-foreground">Generic AI</p>
          <p className="mt-1 text-[0.74rem] leading-snug text-muted-foreground line-through decoration-[#e11d48]/50">
            In today&rsquo;s digital landscape, accessibility has never been more important.
          </p>
        </div>
        <div className="rounded-lg border border-cta/25 bg-cta-soft px-3 py-2">
          <p className="text-[0.62rem] font-semibold text-cta">Your voice</p>
          <p className="mt-1 text-[0.74rem] leading-snug text-ink">
            Most sites fail on the same few things. Fix focus, contrast and tap targets first.
          </p>
        </div>
      </div>
    </ScreenCard>
  );
}

/* The answer block on the page, and the same lines lifted into an answer.
   Two cards side by side, with the hand-over between them. */
export function QuotableScreen() {
  const lifted = plain(ANSWER).split(". ")[0] + ".";
  return (
    <div className="absolute inset-x-4 top-6 mx-auto flex max-w-[44rem] flex-col items-center gap-2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 sm:inset-x-8 sm:top-8 sm:flex-row sm:items-stretch sm:gap-0">
      <ScreenCard
        className="w-full sm:flex-1"
        title="Your article"
        meta={<span className="text-[0.68rem] text-muted-foreground">{SITE}</span>}
      >
        {/* Phones keep only the block itself, so both cards fit the panel. */}
        <p className="hidden text-[0.78rem] font-semibold leading-snug text-ink sm:block">
          {TITLE}
        </p>
        <div className="rounded-r-lg sm:mt-2.5 border-l-2 border-cta bg-[color-mix(in_oklab,var(--cta)_5%,white)] py-2 pl-3 pr-2 outline-dashed outline-1 outline-offset-4 outline-cta/40">
          <p className="text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-cta">
            Answer block
          </p>
          <p className="mt-1 text-[0.72rem] leading-snug text-ink">
            {lifted}
            <span className="relative -top-[0.35em] ml-0.5 inline-flex h-3.5 min-w-3.5 items-center justify-center rounded bg-cta px-0.5 text-[0.55rem] font-semibold text-white">
              1
            </span>
          </p>
        </div>
        <div className="mt-3.5 hidden space-y-1.5 sm:block">
          <span className="block h-2 w-full rounded-full bg-ink/[0.06]" />
          <span className="block h-2 w-4/5 rounded-full bg-ink/[0.06]" />
        </div>
      </ScreenCard>

      <span className="z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ink/[0.08] bg-white text-muted-foreground shadow-[0_1px_2px_rgba(16,24,40,0.06)] sm:mx-[-0.6rem] sm:mt-16 sm:self-start">
        <ArrowRight className="hidden h-3.5 w-3.5 sm:block" />
        <ArrowDown className="h-3.5 w-3.5 sm:hidden" />
      </span>

      <ScreenCard
        className="w-full sm:flex-1"
        title="In an AI answer"
        meta={
          <span className="flex items-center gap-1.5 text-[0.68rem] font-medium text-ink">
            <PerplexityMark className="h-3.5 w-3.5" />
            Perplexity
          </span>
        }
      >
        <p className="ml-auto w-fit max-w-[90%] rounded-lg border border-ink/[0.07] bg-white px-2.5 py-1.5 text-[0.72rem] text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          What changed in WCAG 2.2?
        </p>
        <p className="mt-2.5 text-[0.72rem] leading-snug text-muted-foreground">
          <span className="text-ink">{lifted}</span>{" "}
          <span className="inline-flex translate-y-[-1px] items-center gap-1 rounded-md border border-ink/[0.08] bg-white px-1.5 py-px align-middle text-[0.6rem] font-semibold text-ink">
            <span className="flex h-3 w-3 items-center justify-center rounded-sm bg-cta text-[0.45rem] font-bold uppercase text-white">
              y
            </span>
            {SITE}
          </span>
        </p>
        <div className="mt-3 flex items-center gap-1.5 border-t border-ink/[0.06] pt-2.5">
          <span className="text-[0.62rem] font-medium text-muted-foreground">Sources</span>
          {[SITE, SOURCES[0].domain].map((d) => (
            <span
              key={d}
              className="rounded-md border border-ink/[0.07] bg-white px-1.5 py-0.5 text-[0.6rem] font-medium text-ink/70"
            >
              {d}
            </span>
          ))}
        </div>
      </ScreenCard>
    </div>
  );
}

/* ---------- Step pictures ---------- */

export function PickTopic() {
  return (
    <div className="space-y-1.5">
      <p className="px-1 text-[0.65rem] font-medium text-muted-foreground">Answer-space map</p>
      <div className="flex items-center justify-between gap-3 rounded-lg border border-cta/25 bg-cta-soft px-3 py-2">
        <span className="truncate text-xs font-medium text-ink">{TOPIC}</span>
        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cta text-white">
          <Check className="h-2.5 w-2.5" strokeWidth={3} />
        </span>
      </div>
      {MORE_TOPICS.map((q) => (
        <div key={q} className={ROW}>
          <span className="truncate text-xs font-medium text-ink/70">{q}</span>
          <span className="h-4 w-4 shrink-0 rounded-full border border-ink/15" />
        </div>
      ))}
      <div className="flex items-center gap-2 rounded-lg border border-dashed border-ink/15 px-3 py-2 text-xs text-muted-foreground">
        <Plus className="h-3.5 w-3.5" />
        Add your own target query
      </div>
    </div>
  );
}

export function ResearchAndDraft() {
  const cited = SOURCES.filter((s) => s.n).length;
  const rows: [string, string, boolean][] = [
    ["Searching the web", "24 sources", true],
    ["Pulling sources", `${cited} cited`, true],
    ["Writing the draft", `${WORDS.toLocaleString("en-US")} words`, false],
  ];
  return (
    <div className="space-y-1.5">
      {rows.map(([label, value, done]) => (
        <div key={label} className={ROW}>
          <span className="flex items-center gap-2 text-xs font-medium text-ink">
            {done ? (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success/15 text-success">
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
            ) : (
              <span className="relative flex h-4 w-4 items-center justify-center">
                <span className="absolute h-2 w-2 rounded-full bg-cta/50 motion-safe:animate-ping" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-cta" />
              </span>
            )}
            {label}
          </span>
          <span className="text-[0.68rem] tabular-nums text-muted-foreground">{value}</span>
        </div>
      ))}
    </div>
  );
}

export function ReviewAndPublish() {
  return (
    <div className="space-y-1.5">
      <div className="rounded-lg border border-ink/[0.07] bg-white">
        <div className="flex items-center gap-0.5 border-b border-ink/[0.06] px-1.5 py-1">
          {[Heading2, Bold, Italic, Link2].map((Icon, i) => (
            <span key={i} className="flex h-6 w-6 items-center justify-center rounded text-ink/55">
              <Icon className="h-3 w-3" />
            </span>
          ))}
        </div>
        <div className="space-y-1.5 px-3 py-2.5">
          <span className="block h-2 w-full rounded-full bg-ink/[0.06]" />
          <span className="block h-2 w-3/4 rounded-full bg-ink/[0.06]" />
        </div>
      </div>
      <div className={ROW}>
        <span className="text-xs font-medium text-ink">Auto-publish</span>
        <span className="flex h-4 w-7 items-center rounded-full bg-cta p-0.5">
          <span className="ml-auto h-3 w-3 rounded-full bg-white shadow-sm" />
        </span>
      </div>
      <div className="flex gap-1.5">
        <span className="flex h-8 flex-1 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-xs font-medium text-ink">
          Edit
        </span>
        <span className="flex h-8 flex-1 items-center justify-center rounded-lg bg-cta text-xs font-semibold text-white">
          Publish
        </span>
      </div>
    </div>
  );
}

/* ---------- The closing band's card ---------- */

/** The finished draft, published, rising out of the closing band. */
export function PublishedCard({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "min-h-[18rem] rounded-t-xl border border-b-0 border-white/20 bg-white p-4 text-left shadow-[0_-12px_48px_-16px_rgba(4,24,72,0.55)] sm:p-5",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-2 text-[0.75rem] font-medium text-muted-foreground">
          <Mark className="h-4 w-4 shrink-0 text-brand-blue" />
          <span className="truncate">{SITE}/blog</span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-success/12 px-1.5 py-0.5 text-[0.65rem] font-semibold text-success">
          <Check className="h-3 w-3" strokeWidth={3} />
          Published
        </span>
      </div>
      <p className="mt-3 text-[0.98rem] font-semibold leading-snug tracking-tight text-ink">
        {TITLE}
      </p>
      <div className="mt-3 rounded-r-lg border-l-2 border-cta bg-[color-mix(in_oklab,var(--cta)_5%,white)] py-2 pl-3 pr-2">
        <p className="text-[0.74rem] leading-snug text-ink">
          {plain(ANSWER).split(". ")[0]}.
          <span className="relative -top-[0.35em] ml-0.5 inline-flex h-3.5 min-w-3.5 items-center justify-center rounded bg-cta px-0.5 text-[0.55rem] font-semibold text-white">
            1
          </span>
        </p>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {SOURCES.filter((s) => s.n).map((s) => (
          <span
            key={s.domain}
            className="inline-flex items-center gap-1 rounded-md border border-ink/[0.07] bg-white px-1.5 py-0.5 text-[0.62rem] font-medium text-muted-foreground"
          >
            <span className="font-semibold tabular-nums text-cta">[{s.n}]</span>
            {s.domain}
          </span>
        ))}
      </div>
      <div className="mt-4 space-y-1.5">
        <span className="block h-2 w-full rounded-full bg-ink/[0.06]" />
        <span className="block h-2 w-5/6 rounded-full bg-ink/[0.06]" />
      </div>
    </div>
  );
}

/** A small "x" mark for the before column, kept here with the other marks. */
export function Struck({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#fdedf1] text-[#e11d48]",
        className,
      )}
    >
      <X className="h-2.5 w-2.5" strokeWidth={3} />
    </span>
  );
}
