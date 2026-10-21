/**
 * Small pieces the Reddit Presence pictures share: the subreddit line, the
 * evidence chips, the fit ring, the numbered markers. The evidence chips keep
 * the dashboard's three honest states apart: a measured fact, "checked, not
 * cited", and "not checked", which is dashed so it never reads as a result.
 */
import type { ComponentType, ReactNode } from "react";
import { motion } from "motion/react";
import {
  ChatGPTMark,
  GeminiMark,
  GoogleMark,
  PerplexityMark,
  RedditMark,
} from "@/components/landing/ai-logos";
import { cn } from "@/lib/utils";
import type { AiEvidence, SampleThread } from "./sample";

export const EASE = [0.16, 1, 0.3, 1] as const;

const ENGINE: Record<string, ComponentType<{ className?: string }>> = {
  Perplexity: PerplexityMark,
  ChatGPT: ChatGPTMark,
  Gemini: GeminiMark,
};

/** "r/freelance · 4 months old", led by Reddit's mark. */
export function SubLine({
  sub,
  meta,
  className,
}: {
  sub: string;
  meta?: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex min-w-0 items-center gap-1.5 text-[0.68rem] text-muted-foreground",
        className,
      )}
    >
      <RedditMark className="h-3.5 w-3.5 shrink-0" />
      <span className="shrink-0 font-semibold text-ink">r/{sub}</span>
      {meta && <span className="truncate">· {meta}</span>}
    </p>
  );
}

const CHIP =
  "inline-flex items-center gap-1 whitespace-nowrap rounded-md bg-white px-1.5 py-0.5 text-[0.66rem] font-medium text-ink ring-1 ring-ink/[0.09]";
const QUIET =
  "inline-flex items-center whitespace-nowrap rounded-md px-1.5 py-0.5 text-[0.66rem] font-medium text-muted-foreground ring-1 ring-ink/[0.07]";
const UNASKED =
  "inline-flex items-center whitespace-nowrap rounded-md border border-dashed border-ink/[0.16] px-1.5 py-0.5 text-[0.66rem] font-medium text-muted-foreground";

export function GoogleChip({ google }: { google: SampleThread["google"] }) {
  return google ? (
    <span className={CHIP}>
      <GoogleMark className="h-3 w-3" />#{google.pos}
    </span>
  ) : (
    <span className={QUIET}>No Google position measured</span>
  );
}

export function AiChip({ ai }: { ai: AiEvidence }) {
  if (ai.state === "cited") {
    const M = ENGINE[ai.engine];
    return (
      <span className={CHIP}>
        <M className="h-3 w-3" />
        Cited by {ai.engine}
      </span>
    );
  }
  if (ai.state === "checked") return <span className={QUIET}>AI checked — not cited</span>;
  return <span className={UNASKED}>AI not checked</span>;
}

/** The fit, as the dashboard draws it: a ring, and the number inside. */
export function FitRing({
  value,
  grow = true,
  size = 34,
  className,
}: {
  value: number;
  grow?: boolean;
  size?: number;
  className?: string;
}) {
  const r = 14;
  return (
    <span
      className={cn("relative inline-flex shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 34 34" className="h-full w-full -rotate-90">
        <circle cx="17" cy="17" r={r} fill="none" strokeWidth="3.5" className="stroke-ink/[0.07]" />
        <motion.circle
          cx="17"
          cy="17"
          r={r}
          fill="none"
          strokeWidth="3.5"
          strokeLinecap="round"
          className="stroke-cta"
          initial={grow ? { pathLength: 0 } : false}
          animate={{ pathLength: value / 100 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[0.6rem] font-semibold tabular-nums text-ink">
        {value}
      </span>
    </span>
  );
}

/**
 * A numbered marker on the product screen, matching a fact in the legend
 * under it. Waiting, it's a dashed outline; reached, it fills blue.
 */
export function Marker({
  n,
  on,
  pulse = false,
  className,
}: {
  n: number;
  on: boolean;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-flex h-[1.15rem] w-[1.15rem] shrink-0", className)}>
      {pulse && (
        <span className="absolute inset-0 rounded-full bg-cta/40 motion-safe:animate-ping" />
      )}
      <span
        className={cn(
          "relative flex h-full w-full items-center justify-center rounded-full text-[0.6rem] font-semibold tabular-nums transition-[background-color,color,border-color] duration-300",
          on
            ? "bg-cta text-white"
            : "border border-dashed border-ink/[0.2] bg-white text-muted-foreground",
        )}
      >
        {n}
      </span>
    </span>
  );
}

export function SampleTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "rounded-md border border-ink/[0.08] bg-white px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground",
        className,
      )}
    >
      Sample
    </span>
  );
}

/** A grey bar standing in for text that hasn't arrived yet. */
export function Skeleton({ className }: { className?: string }) {
  return <span className={cn("block h-2 rounded-full bg-ink/[0.06]", className)} />;
}

/** A white product card, the way the landing draws its screens. */
export const CARD =
  "rounded-xl border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-18px_rgba(16,24,40,0.2)]";
