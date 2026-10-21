/**
 * The quieter pictures on /use-cases: each seat card's handoff preview, the
 * three small diagrams under "How we write these", and the window that rises
 * from the closing band. All of them are still; the hub in the hero is the
 * page's one moving scene.
 */
import { Check, UserRound, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/brand/Mark";
import { PERSONAS, type Persona } from "@/data/personas";
import { PLAN, formatUsd } from "@/data/pricing";
import { midSentence, tintFor } from "./seats";

const CARD =
  "rounded-lg border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_10px_24px_-18px_rgba(16,24,40,0.2)]";

/* ---------- A seat card's preview ---------- */

/* The page behind the card, in miniature: the persona's own handoff lines,
   so the card can never drift from what it links to. */
export function HandoffPreview({ persona, className }: { persona: Persona; className?: string }) {
  const tint = tintFor(persona);
  return (
    <div className={cn("rounded-xl p-2.5 sm:p-3", className)} style={{ background: tint.panel }}>
      <div className={cn(CARD, "p-3.5")}>
        <p className="text-[0.64rem] font-semibold uppercase tracking-[0.13em] text-muted-foreground">
          {persona.handoff.runsTitle}
        </p>
        <ul className="mt-2.5 space-y-1.5">
          {persona.handoff.runs.slice(0, 3).map((r) => (
            <li key={r.label} className="flex items-center gap-2 text-[0.8rem] text-ink">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cta-soft text-cta">
                <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden />
              </span>
              <span className="min-w-0 flex-1 truncate">{r.label}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 flex items-start gap-2 border-t border-ink/[0.07] pt-3 text-[0.78rem] leading-snug text-muted-foreground">
          <UserRound
            className="mt-px h-3.5 w-3.5 shrink-0"
            style={{ color: tint.ink }}
            aria-hidden
          />
          <span>
            <span className="font-semibold text-ink">Still yours: </span>
            {persona.handoff.keeps.map((k) => midSentence(k.label)).join(", ")}.
          </span>
        </p>
      </div>
    </div>
  );
}

/* ---------- How we write these ---------- */

/* 01: six seats, one engine, one plan. The lines meet at the mark. */
export function OneEngineDiagram() {
  return (
    <div aria-hidden className="flex flex-col items-center">
      <div className="grid w-full grid-cols-6 gap-1.5">
        {PERSONAS.map((p) => {
          const Icon = p.icon;
          const tint = tintFor(p);
          return (
            <span
              key={p.slug}
              className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
              style={{ color: tint.ink }}
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
          );
        })}
      </div>
      <svg viewBox="0 0 120 28" preserveAspectRatio="none" className="h-7 w-full">
        {PERSONAS.map((p, i) => (
          <line
            key={p.slug}
            x1={(i + 0.5) * 20}
            y1={0}
            x2={60}
            y2={28}
            stroke="rgba(16,24,40,0.16)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <span className="flex items-center gap-2 rounded-lg border border-cta/25 bg-cta-soft py-1.5 pl-1.5 pr-3 shadow-[0_0_0_4px_color-mix(in_oklab,var(--cta)_6%,transparent)]">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white">
          <Mark className="h-3.5 w-3.5 text-brand-blue" />
        </span>
        <span className="text-[0.78rem] font-semibold text-cta">
          {PLAN.name} · {formatUsd(PLAN.monthly)}/mo
        </span>
      </span>
    </div>
  );
}

/* 02: the line between what runs itself and what stays yours. Words from the
   pillar itself; the left column is what every plan does. */
export function SplitDiagram() {
  const rows = [
    ["Research", "Strategy"],
    ["Drafts", "Approvals"],
    ["Publishing", "The final edit"],
  ];
  return (
    <div aria-hidden className={cn(CARD, "grid grid-cols-2 overflow-hidden")}>
      <p className="border-b border-r border-ink/[0.07] bg-cta-soft px-3 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-cta">
        Rankbox
      </p>
      <p className="border-b border-ink/[0.07] px-3 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-ink">
        You
      </p>
      {rows.map(([ours, yours], i) => (
        <div key={ours} className="contents">
          <span
            className={cn(
              "flex items-center gap-2 border-r border-ink/[0.07] px-3 py-2 text-[0.78rem] text-ink",
              i < rows.length - 1 && "border-b",
            )}
          >
            <Check className="h-3 w-3 shrink-0 text-cta" strokeWidth={3} />
            {ours}
          </span>
          <span
            className={cn(
              "flex items-center gap-2 border-ink/[0.07] px-3 py-2 text-[0.78rem] text-ink",
              i < rows.length - 1 && "border-b",
            )}
          >
            <UserRound className="h-3 w-3 shrink-0 text-muted-foreground" />
            {yours}
          </span>
        </div>
      ))}
    </div>
  );
}

/* 03: what the pages quote, and the one thing they never do. */
export function QuoteDiagram() {
  return (
    <ul aria-hidden className="space-y-1.5">
      {["Articles published", "Platforms supported"].map((label) => (
        <li key={label} className={cn(CARD, "flex items-center justify-between px-3 py-2")}>
          <span className="text-[0.78rem] font-medium text-ink">{label}</span>
          <span className="inline-flex items-center gap-1 rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.66rem] font-semibold text-cta">
            <Check className="h-2.5 w-2.5" strokeWidth={3} />
            Quoted
          </span>
        </li>
      ))}
      <li className="flex items-center justify-between rounded-lg border border-dashed border-ink/[0.14] px-3 py-2">
        <span className="text-[0.78rem] text-muted-foreground line-through decoration-ink/30">
          Traffic we can&rsquo;t guarantee
        </span>
        <span className="inline-flex items-center gap-1 rounded-md border border-ink/[0.08] bg-white px-1.5 py-0.5 text-[0.66rem] font-semibold text-muted-foreground">
          <X className="h-2.5 w-2.5" strokeWidth={3} />
          Never
        </span>
      </li>
    </ul>
  );
}

/* ---------- Closing ---------- */

/* The seat picker in a window, rising from the blue band's foot and cut off
   by it: the page closes where it opened. */
export function SeatsPeek() {
  return (
    <div
      aria-hidden
      className="rounded-t-xl border border-b-0 border-white/40 bg-white p-4 text-left shadow-[0_-12px_48px_-16px_rgba(4,24,72,0.55)] sm:p-5"
    >
      <div className="flex items-center gap-2.5">
        <Mark className="h-5 w-5 text-brand-blue" />
        <span className="text-[0.85rem] font-semibold text-ink">Rankbox</span>
        <span className="rounded-md border border-ink/[0.08] px-2 py-0.5 text-[0.7rem] text-muted-foreground">
          yoursite.com
        </span>
        <span className="ml-auto flex items-center gap-1.5 text-[0.7rem] font-medium text-cta">
          <span className="h-1.5 w-1.5 rounded-full bg-cta" />
          Same engine
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {PERSONAS.map((p, i) => {
          const Icon = p.icon;
          return (
            <span
              key={p.slug}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-2 py-2 text-[0.78rem] font-medium",
                i === 0
                  ? "border-cta/30 bg-cta-soft text-cta"
                  : "border-ink/[0.07] bg-white text-ink",
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
                  i === 0 ? "bg-cta text-white" : "bg-cta-soft text-brand-blue",
                )}
              >
                <Icon className="h-3 w-3" />
              </span>
              <span className="truncate">{p.shortName}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
