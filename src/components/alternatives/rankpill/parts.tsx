/**
 * The state mark used in every table on /alternatives/rankpill: the shared
 * matrix kit's three states and screen-reader labels, drawn in the landing's
 * blue and ink rather than green and amber.
 */
import { Check, Minus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CellState } from "@/data/alternatives";
import { STATE_LABEL } from "./lib";

export function StateMark({
  state,
  rankbox = false,
  className,
}: {
  state: CellState;
  /** Rankbox's column: a solid blue tick instead of the neutral one. */
  rankbox?: boolean;
  className?: string;
}) {
  const Icon = state === "yes" ? Check : state === "partial" ? Minus : X;
  return (
    <span
      title={STATE_LABEL[state]}
      className={cn(
        "mt-px flex h-[1.125rem] w-[1.125rem] shrink-0 items-center justify-center rounded-full",
        state === "yes" && (rankbox ? "bg-cta text-white" : "bg-ink/[0.08] text-ink/75"),
        state === "partial" && "border border-dashed border-ink/30 bg-white text-ink/70",
        state === "no" && "bg-ink/[0.04] text-muted-foreground/70",
        className,
      )}
    >
      <Icon className="h-2.5 w-2.5" strokeWidth={3} aria-hidden />
      <span className="sr-only">{STATE_LABEL[state]}</span>
    </span>
  );
}
