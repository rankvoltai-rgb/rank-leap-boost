/**
 * The two small components the sections share: the renderer for the data's
 * inline markup, and the state mark the spec sheet uses.
 */
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Minus } from "lucide-react";
import { parseInline } from "@/lib/inline-md";
import { cn } from "@/lib/utils";
import type { CellState } from "@/data/compare/types";
import { STATE_LABEL } from "./lib";

/**
 * The data's inline markup — **bold**, `code` and [text](href) — as React.
 * Internal links stay in the router; outside ones open in a new tab.
 */
export function Md({ text, strong }: { text: string; strong?: string }) {
  return (
    <>
      {parseInline(text).map((s, i) => {
        let node: ReactNode = s.text;
        if (s.code) {
          node = (
            <code className="rounded bg-ink/[0.05] px-1 py-0.5 font-mono text-[0.9em]">{node}</code>
          );
        }
        if (s.bold) {
          node = <strong className={cn("font-semibold text-ink", strong)}>{node}</strong>;
        }
        if (s.href) {
          node = s.href.startsWith("/") ? (
            <Link
              to={s.href}
              className="font-medium text-cta underline decoration-cta/30 underline-offset-4 hover:decoration-cta"
            >
              {node}
            </Link>
          ) : (
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-cta underline decoration-cta/30 underline-offset-4 hover:decoration-cta"
            >
              {node}
            </a>
          );
        }
        return <span key={i}>{node}</span>;
      })}
    </>
  );
}

/** Included: a solid blue tick. Partly: a half-filled ring. Not its focus: a grey dash. */
export function StateMark({ state, className }: { state: CellState; className?: string }) {
  return (
    <span
      title={STATE_LABEL[state]}
      className={cn(
        "relative flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full",
        state === "yes" && "bg-cta text-white",
        state === "partial" && "border-[1.5px] border-cta bg-white text-cta",
        state === "no" && "bg-ink/[0.06] text-muted-foreground",
        className,
      )}
    >
      {state === "yes" && <Check aria-hidden className="h-3 w-3" strokeWidth={3} />}
      {state === "partial" && (
        <span aria-hidden className="absolute inset-y-0 left-0 w-1/2 bg-cta" />
      )}
      {state === "no" && <Minus aria-hidden className="h-3 w-3" strokeWidth={3} />}
      <span className="sr-only">{STATE_LABEL[state]}</span>
    </span>
  );
}
