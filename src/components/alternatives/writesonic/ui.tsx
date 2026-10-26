/**
 * Small pieces the /alternatives/writesonic page shares between its own
 * sections: the three cell states drawn as marks, the legend that explains
 * them, and a small caption.
 */
import type { ReactNode } from "react";
import { STATE_LABEL, THEM_SOLID, type Side } from "./lib";
import { cn } from "@/lib/utils";
import type { CellState } from "@/data/alternatives";

/**
 * One state as a 20px mark: a tick for included, a half-filled disc for
 * partly, a dashed ring for not its focus. Shape carries the meaning, so it
 * reads without colour; colour only says whose cell it is.
 */
export function StateMark({
  state,
  side,
  className,
  label = true,
}: {
  state: CellState;
  side: Side;
  className?: string;
  /** Screen-reader text. Off where a visible label already says it. */
  label?: boolean;
}) {
  const solid = side === "rankbox" ? "bg-cta" : THEM_SOLID;
  const ink = side === "rankbox" ? "text-cta" : "text-[color-mix(in_oklab,var(--ink)_62%,white)]";
  return (
    <span
      title={STATE_LABEL[state]}
      className={cn("relative inline-flex h-5 w-5 shrink-0 items-center justify-center", className)}
    >
      {state === "yes" && (
        <span
          aria-hidden
          className={cn("flex h-5 w-5 items-center justify-center rounded-full text-white", solid)}
        >
          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
            <path
              d="M2.5 6.3 5 8.6l4.5-5"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
      {state === "partial" && (
        <svg aria-hidden viewBox="0 0 20 20" className={cn("h-5 w-5", ink)}>
          <circle cx="10" cy="10" r="8.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M10 1.4a8.6 8.6 0 0 0 0 17.2Z" fill="currentColor" />
        </svg>
      )}
      {state === "no" && (
        <svg aria-hidden viewBox="0 0 20 20" className="h-5 w-5 text-ink/30">
          <circle
            cx="10"
            cy="10"
            r="8.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="2.6 2.4"
          />
        </svg>
      )}
      {label && <span className="sr-only">{STATE_LABEL[state]}</span>}
    </span>
  );
}

/** The key to the three marks, drawn in Rankbox's colour. */
export function StateLegend({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.8rem] text-muted-foreground",
        className,
      )}
    >
      {(["yes", "partial", "no"] as const).map((s) => (
        <li key={s} className="flex items-center gap-2">
          <StateMark state={s} side="rankbox" label={false} />
          {STATE_LABEL[s]}
        </li>
      ))}
    </ul>
  );
}

/** A small uppercase caption, for table heads and card labels. */
export function Caption({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}
