/**
 * Shared ground for the generated blog covers: the canvas, the scene contract
 * and the seeded randomness that keeps every cover stable per post.
 *
 * Every scene draws on one 1600×1000 canvas that CoverScene scales to cover
 * its box. The 16:11 article hero crops ~75 units off each side, so anything
 * that has to be read stays inside x 110–1490.
 */
import type { AI_MARKS } from "@/components/landing/ai-logos";

export const W = 1600;
export const H = 1000;

/* The pale brand-blue field used by the light tones. */
export const PAPER = "fill-[color-mix(in_oklab,var(--brand-blue)_7%,white)]";

export type Engine = (typeof AI_MARKS)[number];
export type Rand = () => number;

export type SceneName =
  | "lockup"
  | "answer"
  | "analytics"
  | "leaderboard"
  | "traffic"
  | "feed"
  | "crawl"
  | "bots"
  | "file"
  | "compare"
  | "write"
  | "graph";

export interface SceneProps {
  /** Seeds the scene's own random stream. A number, not a shared generator:
   *  React may render a scene twice, and each pass must draw the same cover. */
  seed: number;
  /** The engine the title names, if any. */
  engine: Engine | null;
  title: string;
  /** Prefix for gradient and filter ids, unique per cover on the page. */
  uid: string;
  /** The cover sits on the brand-blue article header. */
  onBlue?: boolean;
}

export function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/* Small seeded PRNG (mulberry32): the same seed always draws the same cover. */
export function random(seed: number): Rand {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const pick = <T>(rand: Rand, items: readonly T[]): T =>
  items[Math.floor(rand() * items.length)];

/* A scene's colour tone. On the blue article header a blue field would melt
   into the band, so it swaps for `instead`. The draw happens either way, so
   the rest of the scene comes out the same. */
export function toneFor<T extends string>(
  rand: Rand,
  options: readonly T[],
  onBlue: boolean | undefined,
  instead: T,
): T {
  const tone = pick(rand, options);
  return onBlue && tone === "blue" ? instead : tone;
}

export const jitter = (rand: Rand, n: number) => (rand() - 0.5) * 2 * n;

export function shuffle<T>(rand: Rand, items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
