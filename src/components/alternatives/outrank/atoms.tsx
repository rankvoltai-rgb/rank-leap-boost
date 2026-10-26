/**
 * The one small component the /alternatives/outrank tables share.
 */
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CellState } from "@/data/alternatives";
import { STATE_LABEL } from "./lib";

/**
 * A matrix cell's state, in the landing's language: a solid blue tick on
 * Rankbox's column, a quiet grey one on theirs, a half ring for "partly",
 * and a dash for "not its focus". The visible note always carries the
 * detail; this only lets the eye run down a column.
 */
export function StateMark({
  state,
  ours = false,
  className,
}: {
  state: CellState;
  ours?: boolean;
  className?: string;
}) {
  return (
    <span
      title={STATE_LABEL[state]}
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
        state === "yes" && (ours ? "bg-cta text-white" : "bg-ink/[0.07] text-ink/75"),
        state === "partial" &&
          "border border-dashed border-ink/30 bg-white text-ink/60 [border-width:1.5px]",
        state === "no" && "text-muted-foreground/60",
        className,
      )}
    >
      {state === "yes" && <Check aria-hidden className="h-3 w-3" strokeWidth={3} />}
      {state === "partial" && <Minus aria-hidden className="h-3 w-3" strokeWidth={3} />}
      {state === "no" && <Minus aria-hidden className="h-4 w-4" strokeWidth={2} />}
      <span className="sr-only">{STATE_LABEL[state]}</span>
    </span>
  );
}
