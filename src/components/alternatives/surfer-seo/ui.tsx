/**
 * Small components the /alternatives/surfer-seo sections share: the
 * row-state marks and their legend, and the uppercase kicker. The plain
 * helpers live in text.tsx.
 */
import type { ReactNode } from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CellState } from "@/data/alternatives";
import { STATE_LABEL } from "./text";

/**
 * One row's state, at the size of a line of text. `keyed` sets the Rankbox
 * column's solid blue; the competitor's column keeps the same shapes in a
 * neutral tone, so the legend reads the same for both.
 */
export function StateMark({
  state,
  keyed = false,
  className,
}: {
  state: CellState;
  keyed?: boolean;
  className?: string;
}) {
  return (
    <span
      title={STATE_LABEL[state]}
      className={cn("flex h-5 w-5 shrink-0 items-center justify-center", className)}
    >
      {state === "yes" && (
        <span
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-full",
            keyed ? "bg-cta text-white" : "bg-ink/[0.07] text-ink",
          )}
        >
          <Check aria-hidden className="h-3 w-3" strokeWidth={3} />
        </span>
      )}
      {state === "partial" && (
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          className={cn("h-[1.15rem] w-[1.15rem]", keyed ? "text-cta" : "text-ink/60")}
        >
          <circle cx="10" cy="10" r="8.25" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M10 1.75a8.25 8.25 0 0 1 0 16.5z" fill="currentColor" />
        </svg>
      )}
      {state === "no" && <Minus aria-hidden className="h-4 w-4 text-muted-foreground/60" />}
      <span className="sr-only">{STATE_LABEL[state]}</span>
    </span>
  );
}

/** The legend for StateMark, one line. */
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
          <span aria-hidden>
            <StateMark state={s} keyed />
          </span>
          {STATE_LABEL[s]}
        </li>
      ))}
    </ul>
  );
}

/** A small uppercase label above a value. */
export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
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
