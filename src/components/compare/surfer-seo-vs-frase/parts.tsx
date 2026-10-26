/**
 * Small pieces the Surfer SEO vs Frase page shares between its own sections:
 * the inline-markup renderer for the data's `Md` fields, the coverage glyph
 * (included / partly / not its focus), and a few constants.
 *
 * Nothing here favours a side: both products get the same mark, the same
 * glyph and the same surface. Emphasis is earned per round or per plan.
 */
import { Fragment, type ReactNode } from "react";
import { Equal } from "lucide-react";
import { ProductMark } from "@/components/compare/kit";
import type { Product } from "@/data/compare/products";
import type { CellState, Side, Winner } from "@/data/compare/types";
import { STATE_LABEL } from "./util";
import { parseInline } from "@/lib/inline-md";
import { cn } from "@/lib/utils";

/** The data's inline markup (**bold**, `code`, [text](href)) as React nodes. */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((s, i) => {
        let node: ReactNode = s.text;
        if (s.code) {
          node = (
            <code className="rounded bg-ink/[0.05] px-1 py-0.5 font-mono text-[0.9em]">{node}</code>
          );
        }
        if (s.bold) node = <strong className="font-semibold text-ink">{node}</strong>;
        if (s.href) {
          const external = /^https?:/.test(s.href);
          node = (
            <a
              href={s.href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-cta"
            >
              {node}
            </a>
          );
        }
        return <Fragment key={i}>{node}</Fragment>;
      })}
    </>
  );
}

/* ---------- coverage glyph ---------- */

/**
 * A full, half or empty disc. `lit` is the blue reading; unlit keeps the
 * same shape in grey, so the state reads even before the pipeline runs.
 */
export function StateGlyph({
  state,
  lit = true,
  className,
}: {
  state: CellState;
  lit?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex h-3.5 w-3.5 shrink-0 overflow-hidden rounded-full border-[1.5px] bg-white transition-colors duration-500",
        lit ? "border-cta" : "border-ink/25",
        state === "no" && "border-dashed",
        className,
      )}
    >
      {state !== "no" && (
        <span
          className={cn(
            "absolute inset-y-0 left-0 transition-colors duration-500",
            state === "yes" ? "right-0" : "right-1/2",
            lit ? "bg-cta" : "bg-ink/25",
          )}
        />
      )}
      <span className="sr-only">{STATE_LABEL[state]}</span>
    </span>
  );
}

/* ---------- winner ---------- */

/** A round's call as a small tag: the winner's mark and name, or "Draw". */
export function CallTag({
  winner,
  sides,
  className,
}: {
  winner: Winner;
  sides: Record<Side, Product>;
  className?: string;
}) {
  if (winner === "draw") {
    return (
      <span
        className={cn(
          "inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md border border-ink/[0.1] bg-white px-2 text-[0.75rem] font-medium text-muted-foreground",
          className,
        )}
      >
        <Equal className="h-3.5 w-3.5" aria-hidden />
        Draw
      </span>
    );
  }
  const p = sides[winner];
  return (
    <span
      className={cn(
        "inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md bg-cta-soft pl-1 pr-2 text-[0.75rem] font-semibold text-cta",
        className,
      )}
    >
      <ProductMark product={p} className="h-5 w-5 text-[0.5rem]" />
      {p.name} wins
    </span>
  );
}
