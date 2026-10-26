/**
 * The cell-state mark the /alternatives/seobot sections share.
 */
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CellState } from "@/data/alternatives";
import { STATE_LABEL } from "./tokens";

/**
 * A cell's state as a mark the size of a line of text. Rankbox's column is
 * keyed in the brand blue, SEObot's in ink, so the eye can follow a column
 * without the colour reading as a verdict on the other one.
 */
export function StateMark({
  state,
  brand = false,
  className,
}: {
  state: CellState;
  brand?: boolean;
  className?: string;
}) {
  return (
    <span
      title={STATE_LABEL[state]}
      className={cn(
        "mt-px flex h-[1.1rem] w-[1.1rem] shrink-0 items-center justify-center rounded-full",
        state === "yes" && (brand ? "bg-cta text-white" : "bg-ink/[0.08] text-ink"),
        state === "partial" &&
          (brand
            ? "border border-cta/45 bg-cta-soft text-cta"
            : "border border-ink/[0.16] bg-white text-ink/70"),
        state === "no" && "text-muted-foreground/70",
        className,
      )}
    >
      {state === "yes" && <Check aria-hidden className="h-2.5 w-2.5" strokeWidth={3.2} />}
      {state === "partial" && (
        <svg aria-hidden viewBox="0 0 10 10" className="h-2 w-2">
          <path d="M5 0a5 5 0 0 0 0 10Z" fill="currentColor" />
        </svg>
      )}
      {state === "no" && <Minus aria-hidden className="h-3.5 w-3.5" strokeWidth={2.2} />}
      <span className="sr-only">{STATE_LABEL[state]}</span>
    </span>
  );
}
