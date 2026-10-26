/**
 * Constants and tiny helpers shared by the sections of
 * /compare/koala-ai-vs-byword. Kept apart from the components so fast
 * refresh stays happy.
 */
import type { CSSProperties } from "react";
import type { Side } from "@/data/compare/types";

export const SIDES: Side[] = ["a", "b"];

/* Staggers the CSS entrance (see animate-hero-rise in styles.css). */
export const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

export const SOLID_BUTTON =
  "group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-cta px-5 text-[0.95rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-[background-color,transform] duration-150 hover:bg-cta-hover active:scale-[0.985] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25";

/** The soft blue a winning cell sits on. */
export const WIN_TINT = "bg-[color-mix(in_oklab,var(--cta)_5%,white)]";

/** A white card with a hairline edge and a soft shadow, the landing's product-screen look. */
export const CARD =
  "rounded-xl border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-18px_rgba(16,24,40,0.18)]";

/** Small uppercase label. */
export const KICKER =
  "text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground";

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

const WORDS = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
];
/** 7 → "Seven", for titles; digits past ten. */
export const spelled = (n: number) => WORDS[n] ?? String(n);
