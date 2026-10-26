/**
 * Plain values the Surfer SEO vs Clearscope page shares between its bands.
 */
import type { CSSProperties } from "react";
import type { Side } from "@/data/compare/types";

export const SIDES: Side[] = ["a", "b"];

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** Staggers the CSS entrance (see animate-hero-rise in styles.css). */
export const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

/** A soft blue wash for the cell that won its row; neither product owns a colour. */
export const WON_TINT = "bg-[color-mix(in_oklab,var(--cta)_5%,white)]";

/** "surferseo.com" from a URL. */
export function hostOf(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}
