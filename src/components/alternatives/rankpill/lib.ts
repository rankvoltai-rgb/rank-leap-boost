/**
 * Helpers the /alternatives/rankpill sections share: the entrance stagger,
 * surface classes, hooks that play a picture only while it is on screen, and
 * a few pure functions over the data. The one shared component, StateMark,
 * is in parts.tsx.
 *
 * Nothing here holds copy about either product. Every fact the page shows is
 * read from src/data/competitors/rankpill.ts, shared.ts, or pricing.ts.
 */
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useInView, useReducedMotion } from "motion/react";
import type { CellState, Competitor, MatrixRow } from "@/data/alternatives";

/* Staggers the CSS entrance (see animate-hero-rise in styles.css). */
export const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

/** A white card on the frame, the landing's product-screen surface. */
export const CARD =
  "rounded-xl border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-18px_rgba(16,24,40,0.18)]";

/** The soft blue key Rankbox's column carries in every table on the page. */
export const RANKBOX_TINT = "bg-[color-mix(in_oklab,var(--cta)_5%,white)]";

/* Same three states and screen-reader labels as the shared matrix kit. */
export const STATE_LABEL: Record<CellState, string> = {
  yes: "Included",
  partial: "Partly, or via an add-on",
  no: "Not what it is for",
};

export const STATE_LEGEND = (["yes", "partial", "no"] as const).map((state) => ({
  state,
  label: STATE_LABEL[state],
}));

/**
 * A step counter for a picture that plays once while at least half of it is
 * on screen, holds its last frame, and rewinds when it leaves so it plays
 * again on the way back. With reduced motion it sits on the last frame, which
 * is the complete picture.
 */
export function useSteps(last: number, { stepMs = 520, startMs = 450 } = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) return;
    if (!inView) {
      setStep(0);
      return;
    }
    const timers: number[] = [];
    for (let s = 1; s <= last; s++) {
      timers.push(window.setTimeout(() => setStep(s), startMs + (s - 1) * stepMs));
    }
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [inView, reduce, last, stepMs, startMs]);

  return { ref, step: reduce ? last : step, reduce: Boolean(reduce) };
}

/** True while at least half of the element is on screen (and motion is on). */
export function useOnScreen(amount = 0.5) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount });
  const reduce = useReducedMotion();
  return { ref, on: Boolean(reduce) || inView, reduce: Boolean(reduce) };
}

/** "https://www.rankpill.com/pricing/" → "rankpill.com/pricing". */
export function displayUrl(url: string): string {
  try {
    const u = new URL(url);
    const path = u.pathname === "/" ? "" : u.pathname.replace(/\/$/, "");
    return `${u.hostname.replace(/^www\./, "")}${path}`;
  } catch {
    return url;
  }
}

/** Whether a matrix row reads the same for both products. */
export function rowMatches(row: MatrixRow): boolean {
  return row.rankbox.state === "yes" && row.them.state === "yes";
}

export function allRows(c: Competitor): MatrixRow[] {
  return c.matrix.flatMap((g) => g.rows);
}

/** Rounds to cents, the way the data's per-article figures are rounded. */
export const cents = (n: number) => Math.round(n * 100) / 100;

/**
 * Splits a title so its closing words can carry the blue accent, without
 * changing a character of it. Titles of three words or fewer stay whole.
 */
export function splitTail(title: string, words = 2): [string, string] {
  const parts = title.split(" ");
  if (parts.length <= words + 1) return ["", title];
  return [`${parts.slice(0, -words).join(" ")} `, parts.slice(-words).join(" ")];
}

/** The source link whose URL path ends in the given segment, if any. */
export function sourceFor(c: Competitor, segment: string) {
  return c.sources.find((s) => {
    try {
      return new URL(s.url).pathname.replace(/\/$/, "").endsWith(segment);
    } catch {
      return false;
    }
  });
}

/** The credit allowance named in their plan summary, e.g. "30 backlink credits". */
export function theirCredits(c: Competitor): number | null {
  const m = c.pricing.covers.match(/(\d+)\s+backlink credits/i);
  return m ? Number(m[1]) : null;
}
