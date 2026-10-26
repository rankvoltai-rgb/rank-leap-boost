/**
 * Small components the /alternatives/frase sections share: the state marks
 * used in the loops, the table and the glance card (one visual language for
 * "included / partly / not its focus" across the page), and the grey text
 * bar for sample screens. Plain helpers live in helpers.tsx.
 */
import type { ReactNode } from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CellState } from "@/data/alternatives";
import { STATE_LABEL } from "./helpers";

/**
 * The cell state at the size of an icon. The same three marks for both
 * products: the Rankbox column is told apart by its tint, not by a brighter
 * tick, so a "yes" reads the same whoever earned it.
 */
export function StateMark({ state, className }: { state: CellState; className?: string }) {
  return (
    <span
      className={cn(
        "relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
        state === "yes" && "bg-cta text-white",
        state === "partial" && "border border-cta/45 bg-white",
        state === "no" && "border border-dashed border-ink/25 bg-white text-muted-foreground",
        className,
      )}
    >
      {state === "yes" && <Check aria-hidden className="h-3 w-3" strokeWidth={3} />}
      {state === "partial" && (
        <span
          aria-hidden
          className="absolute inset-[3px] rounded-full bg-[linear-gradient(90deg,var(--cta)_50%,transparent_50%)]"
        />
      )}
      {state === "no" && <Minus aria-hidden className="h-3 w-3" />}
      <span className="sr-only">{STATE_LABEL[state]}</span>
    </span>
  );
}

/** One dot per matrix row, for the loop stations. Decorative; the table says it in words. */
export function Pip({ state, tone }: { state: CellState; tone: "rankbox" | "them" }) {
  const solid = tone === "rankbox" ? "var(--cta)" : "color-mix(in oklab, var(--ink) 58%, white)";
  return (
    <span
      aria-hidden
      className="h-2.5 w-2.5 shrink-0 rounded-full border"
      style={{
        borderColor: state === "no" ? "color-mix(in oklab, var(--ink) 22%, white)" : solid,
        background:
          state === "yes"
            ? solid
            : state === "partial"
              ? `linear-gradient(90deg, ${solid} 50%, transparent 50%)`
              : "white",
      }}
    />
  );
}

/** The legend for StateMark, in a row. */
export function StateLegend({ className, note }: { className?: string; note?: ReactNode }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.78rem] text-muted-foreground",
        className,
      )}
    >
      {(["yes", "partial", "no"] as const).map((s) => (
        <span key={s} className="flex items-center gap-2">
          <span aria-hidden>
            <StateMark state={s} className="h-4 w-4 [&_svg]:h-2.5 [&_svg]:w-2.5" />
          </span>
          {STATE_LABEL[s]}
        </span>
      ))}
      {note}
    </div>
  );
}

/** A grey text line, for sample screens that must not invent copy. */
export function TextBar({ w, className }: { w: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("block h-1.5 rounded-full bg-ink/[0.08]", className)}
      style={{ width: w }}
    />
  );
}
