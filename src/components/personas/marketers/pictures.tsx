/**
 * Small, still pictures for the four steps of "How it lands in your week",
 * one per step, each showing only what that step's copy says happens. White
 * cards with hairline borders on the grey panel, soft blue for what's kept.
 *
 * Samples throughout: "yoursite.com", generic topics, no outcomes. The weekly
 * report shows published volume and scores only; it carries no rankings or
 * citation counts, because a sample can't honestly show one.
 */
import type { ComponentType } from "react";
import { Check, FileText, Globe, Mic, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const CARD = "rounded-lg border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]";

/* Day 1: Rankbox reads the site. */
function ScanPicture() {
  const rows: [ComponentType<{ className?: string }>, string][] = [
    [FileText, "Pages read"],
    [Mic, "Voice learned"],
    [Search, "Answer space mapped"],
  ];
  return (
    <div className="space-y-2">
      <div className={cn(CARD, "flex items-center gap-2 px-2.5 py-2")}>
        <Globe className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-[0.72rem] text-ink">yoursite.com</span>
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cta" />
      </div>
      {rows.map(([Icon, label]) => (
        <div key={label} className="flex items-center gap-2 px-1">
          <Icon className="h-3.5 w-3.5 text-brand-blue" />
          <span className="text-[0.72rem] text-ink/80">{label}</span>
          <span className="ml-auto flex h-4 w-4 items-center justify-center rounded-full bg-success/10 text-success">
            <Check className="h-2.5 w-2.5" strokeWidth={3} />
          </span>
        </div>
      ))}
    </div>
  );
}

/* Day 1: the reader cuts what's off-strategy; the rest becomes the queue. */
function PlanPicture() {
  const topics: [string, boolean][] = [
    ["Payroll for a remote team", true],
    ["Company news roundup", false],
    ["Contractor or employee?", true],
    ["A new-hire onboarding checklist", true],
  ];
  return (
    <div className="space-y-1.5">
      {topics.map(([t, keep]) => (
        <div
          key={t}
          className={cn(
            "flex items-center gap-2 rounded-lg border px-2.5 py-1.5",
            keep
              ? "border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
              : "border-dashed border-ink/[0.1] bg-transparent",
          )}
        >
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-[0.7rem]",
              keep ? "font-medium text-ink" : "text-muted-foreground line-through",
            )}
          >
            {t}
          </span>
          {keep ? (
            <span className="flex shrink-0 items-center gap-1 rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.6rem] font-semibold text-cta">
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
              Keep
            </span>
          ) : (
            <span className="flex shrink-0 items-center gap-1 rounded-md border border-ink/[0.08] px-1.5 py-0.5 text-[0.6rem] font-medium text-muted-foreground">
              <X className="h-2.5 w-2.5" />
              Cut
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/* Every day: a sourced, scored draft waiting for the edit. */
function DraftPicture() {
  return (
    <div className={cn(CARD, "p-3")}>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[0.75rem] font-semibold leading-snug text-ink">
            PTO accrual, explained simply
          </p>
          <div className="mt-2 space-y-1">
            <span className="block h-1.5 w-full rounded-full bg-ink/[0.07]" />
            <span className="block h-1.5 w-[86%] rounded-full bg-ink/[0.07]" />
            <span className="block h-1.5 w-[64%] rounded-full bg-ink/[0.07]" />
          </div>
        </div>
        <span className="flex shrink-0 flex-col items-center rounded-md border border-success/25 bg-success/[0.06] px-2 py-1">
          <span className="text-[0.85rem] font-semibold leading-none tabular-nums text-success">
            95
          </span>
          <span className="mt-0.5 text-[0.5rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            SEO+GEO
          </span>
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {["Sourced", "Your voice"].map((c) => (
          <span
            key={c}
            className="rounded-md border border-ink/[0.08] px-1.5 py-0.5 text-[0.6rem] font-medium text-ink/70"
          >
            {c}
          </span>
        ))}
        <span className="rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.6rem] font-semibold text-cta">
          Waiting for your edit
        </span>
      </div>
    </div>
  );
}

/* Every week: what went out, and the score each piece cleared. */
function ReportPicture() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const scores = [94, 91, 96, 92, 95, 90, 93];
  return (
    <div className={cn(CARD, "p-3")}>
      <div className="flex items-center justify-between">
        <p className="text-[0.72rem] font-semibold text-ink">This week</p>
        <span className="rounded-md border border-ink/[0.08] px-1.5 py-px text-[0.55rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Sample
        </span>
      </div>
      <p className="mt-2 text-[0.62rem] font-medium text-muted-foreground">Published</p>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((d, i) => (
          <span key={i} className="flex flex-col items-center gap-1">
            <span className="h-5 w-full rounded-[4px] bg-cta" />
            <span className="text-[0.55rem] text-muted-foreground">{d}</span>
          </span>
        ))}
      </div>
      <p className="mt-2 text-[0.62rem] font-medium text-muted-foreground">Score per piece</p>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {scores.map((s, i) => (
          <span
            key={i}
            className="rounded-[4px] bg-success/10 py-0.5 text-center text-[0.58rem] font-semibold tabular-nums text-success"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

const PICTURES: ComponentType[] = [ScanPicture, PlanPicture, DraftPicture, ReportPicture];

/** The picture for workflow step `index`, in the steps' order. */
export function StepPicture({ index }: { index: number }) {
  const Picture = PICTURES[index];
  return Picture ? <Picture /> : null;
}
