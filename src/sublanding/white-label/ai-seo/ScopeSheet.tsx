import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DOER_ORDER,
  SCOPE,
  SCOPE_LINES,
  countByDoer,
  scopeSummary,
  type Cadence,
  type Doer,
  type ScopeLine,
  type View,
} from "./content";
import { PageLink } from "./PageLink";

const VIEWS: View[] = ["client", "who"];
const CADENCES: Cadence[] = ["once", "monthly"];

/** One fill per doer. Brand blue is spent on Rankbox's lines only. */
const FILL: Record<Doer, string> = {
  rankbox: "bg-cta",
  team: "bg-muted-foreground/45",
  developer: "bg-muted-foreground/15",
};

const CHIP: Record<Doer, string> = {
  rankbox: "border-cta/25 bg-cta-soft text-cta",
  team: "border-border bg-surface text-ink",
  developer: "border-dashed border-border bg-card text-muted-foreground",
};

/**
 * The page's focal visual: one sample scope, two readings. "Your client's
 * copy" is what the client receives: the agency's name on every line. "Who
 * does each line" turns each one over to show who actually runs it and how.
 *
 * Both readings are in the server HTML (the inactive one is `hidden`), so the
 * substance is there without JavaScript and for crawlers.
 */
export function ScopeSheet({ view }: { view: View }) {
  const counts = countByDoer(SCOPE_LINES);
  const once = SCOPE_LINES.filter((l) => l.cadence === "once").length;
  const numbered = new Map(SCOPE_LINES.map((l, i) => [l.id, String(i + 1).padStart(2, "0")]));

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg shadow-ink/[0.035]">
      {/* Letterhead */}
      <div className="flex flex-col gap-4 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-surface font-display text-base font-semibold text-ink"
          >
            {SCOPE.sheet.agencyInitial}
          </span>
          <div>
            <p className="font-semibold leading-tight text-ink">{SCOPE.sheet.agency}</p>
            <p className="text-sm text-muted-foreground">{SCOPE.sheet.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:text-right">
          <div>
            <p className="text-sm font-medium text-ink">{SCOPE.sheet.preparedFor}</p>
            <p className="font-mono text-xs text-muted-foreground">{SCOPE.sheet.domain}</p>
          </div>
          <span className="rounded-full border border-border px-2 py-0.5 text-[0.68rem] font-medium uppercase tracking-wide text-muted-foreground">
            {SCOPE.sheet.sample}
          </span>
        </div>
      </div>

      {/* Summary: a plain count for the client, who-runs-what behind it. */}
      <div className="border-b border-border bg-surface/50 px-5 py-4 sm:px-8">
        <p hidden={view !== "client"} className="text-sm text-muted-foreground">
          {SCOPE.count(once, SCOPE_LINES.length - once)}
        </p>
        <div hidden={view !== "who"}>
          <div className="flex gap-1" role="img" aria-label={SCOPE.legendLabel}>
            {SCOPE_LINES.map((l) => (
              <span key={l.id} className={cn("h-1.5 flex-1 rounded-full", FILL[l.doer])} />
            ))}
          </div>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-ink">
            {scopeSummary(SCOPE_LINES)}
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5" aria-label={SCOPE.legendLabel}>
            {DOER_ORDER.map((d) => (
              <li key={d} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span aria-hidden className={cn("h-2 w-2 rounded-full", FILL[d])} />
                {SCOPE.doers[d]} · {counts[d]}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {CADENCES.map((cadence) => (
        <div key={cadence}>
          <div className="flex items-end justify-between px-5 pb-2 pt-6 sm:px-8">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {SCOPE.cadence[cadence]}
            </p>
            <p
              aria-hidden
              className="hidden text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground sm:block"
            >
              {SCOPE.columns.owner}
            </p>
          </div>
          <ol>
            {SCOPE_LINES.filter((l) => l.cadence === cadence).map((line) => (
              <Row key={line.id} line={line} n={numbered.get(line.id)!} view={view} />
            ))}
          </ol>
        </div>
      ))}

      <div className="mt-2 border-t border-border px-5 py-4 sm:px-8">
        <p className="text-xs leading-relaxed text-muted-foreground">{SCOPE.footer[view]}</p>
      </div>
    </div>
  );
}

function Row({ line, n, view }: { line: ScopeLine; n: string; view: View }) {
  const owner =
    view === "client"
      ? line.doer === "developer"
        ? SCOPE.clientOwner.developer
        : SCOPE.clientOwner.agency
      : line.withTool
        ? SCOPE.withTool
        : SCOPE.doers[line.doer];
  return (
    <li className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-3 border-t border-border/70 px-5 py-5 sm:grid-cols-[2rem_minmax(0,1fr)_11rem] sm:gap-x-5 sm:px-8">
      <span aria-hidden className="pt-0.5 font-mono text-xs text-muted-foreground">
        {n}
      </span>
      <div className="min-w-0">
        <h3 className="text-[0.98rem] font-semibold leading-snug text-ink">{line.title}</h3>
        <p
          hidden={view !== "client"}
          className="mt-1.5 text-pretty text-[0.92rem] leading-relaxed text-muted-foreground"
        >
          {line.client}
        </p>
        <div hidden={view !== "who"}>
          <p className="mt-1.5 text-pretty text-[0.92rem] leading-relaxed text-muted-foreground">
            {line.how}
          </p>
          {line.link && (
            <PageLink
              target={line.link.target}
              className="mt-2 inline-flex items-center gap-1 rounded-sm text-[0.85rem] font-medium text-cta hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta"
            >
              {line.link.label}
              <ArrowRight aria-hidden className="h-3.5 w-3.5" />
            </PageLink>
          )}
        </div>
      </div>
      <div className="col-start-2 mt-3 sm:col-start-3 sm:mt-0 sm:flex sm:justify-end">
        <span
          key={`${view}-${line.id}`}
          className={cn(
            "inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-medium",
            "animate-in fade-in-0 slide-in-from-bottom-1 duration-300 motion-reduce:animate-none",
            view === "client" ? "border-border bg-card text-ink" : CHIP[line.doer],
          )}
        >
          <span className="sr-only">{SCOPE.columns.owner}: </span>
          {owner}
        </span>
      </div>
    </li>
  );
}

/**
 * The two-way switch above the sheet. A radio group: arrow keys move between
 * the readings, and the chosen one is blue.
 */
export function ViewSwitch({ view, onChange }: { view: View; onChange: (v: View) => void }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
    e.preventDefault();
    const next = VIEWS[(VIEWS.indexOf(view) + 1) % VIEWS.length];
    onChange(next);
    refs.current[VIEWS.indexOf(next)]?.focus();
  };
  return (
    <div
      role="radiogroup"
      aria-label={SCOPE.switchLabel}
      onKeyDown={onKey}
      className="inline-flex w-full rounded-xl border border-border bg-surface p-1 sm:w-auto"
    >
      {VIEWS.map((v, i) => {
        const on = v === view;
        return (
          <button
            key={v}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(v)}
            className={cn(
              "flex-1 whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition-colors sm:flex-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
              on ? "bg-cta text-white shadow-sm" : "text-muted-foreground hover:text-ink",
            )}
          >
            {SCOPE.views[v]}
          </button>
        );
      })}
    </div>
  );
}

/** Holds the view so the switch and the sheet agree. */
export function useScopeView() {
  return useState<View>("client");
}
