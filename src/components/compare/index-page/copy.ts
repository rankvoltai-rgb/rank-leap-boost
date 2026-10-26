/**
 * The hub's own copy, moved verbatim from the old /compare route body. The
 * matchups themselves come from data/compare/matchups.ts; only what the hub
 * says about its method lives here.
 */
import type { CSSProperties } from "react";

/** How every page is judged — said once here, not repeated on every card. */
export const METHOD = [
  {
    title: "A call in every round",
    body: "Each comparison is split into the five to seven things the choice actually turns on, and every round names a winner or, when the gap doesn't matter, a draw.",
  },
  {
    title: "Their sources, not our claims",
    body: "Every fact comes from the vendors' own pricing pages, docs and changelogs, or dated third-party reporting — and every page lists what it read, and when.",
  },
  {
    title: "Rankbox stays out of the scoring",
    body: "We make a product in this space. It appears once per page, at the end, labelled as ours, and never as a contender in the rounds.",
  },
] as const;

/** "1 draw", "2 draws". */
export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** "Teams that…" → "teams that…", leaving names like "SEOs" alone. */
export const lowerFirst = (s: string) =>
  /^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s;

/* Staggers the CSS entrance (see animate-hero-rise in styles.css). */
export const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;
