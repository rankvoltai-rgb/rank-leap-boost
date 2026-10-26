/**
 * Helpers the /alternatives/outrank sections share: the title accent, the
 * price arithmetic, and a few lookups into the competitor entry. Nothing
 * here holds copy of its own; it only sets what the data says.
 */
import type { CSSProperties, ReactNode } from "react";
import { Accent } from "@/components/landing/frame";
import type { CellState, Competitor, MatrixRow } from "@/data/alternatives";

/* Staggers the CSS entrance (see animate-hero-rise in styles.css). */
export const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

/**
 * A data title with its closing phrase in the blue accent: the last sentence
 * if there are two, else the last clause after a comma, else the last two
 * words. The words stay exactly as written.
 */
export function accentTail(text: string): ReactNode {
  const cut = (at: number, skip: number) => (
    <>
      {text.slice(0, at)} <Accent>{text.slice(at + skip)}</Accent>
    </>
  );
  const sentence = text.lastIndexOf(". ");
  if (sentence > 0) return cut(sentence + 1, 1);
  const clause = text.lastIndexOf(", ");
  if (clause > 0) return cut(clause + 1, 1);
  const words = text.split(" ");
  if (words.length < 3) return <Accent>{text}</Accent>;
  return (
    <>
      {words.slice(0, -2).join(" ")} <Accent>{words.slice(-2).join(" ")}</Accent>
    </>
  );
}

/**
 * Price per article in cents-exact arithmetic, so $83.25 over 30 rounds to
 * $2.78 the way the FAQ states it, not to a float's $2.77.
 */
export function perArticle(monthly: number | null, articles: number | null): number | null {
  if (monthly === null || !articles) return null;
  return Math.round((monthly * 100) / articles) / 100;
}

/** "$3.30", always two decimals, for per-article figures. */
export function cents(n: number): string {
  return `$${n.toFixed(2)}`;
}

/** A matrix row by its label, for the pictures that quote one cell. */
export function findRow(c: Competitor, label: string): MatrixRow | undefined {
  for (const g of c.matrix) {
    const row = g.rows.find((r) => r.label === label);
    if (row) return row;
  }
  return undefined;
}

/** Every number written in a note, "1,200–1,700 words" → [1200, 1700]. */
export function numbersIn(text: string): number[] {
  return (text.match(/\d[\d,]*/g) ?? []).map((n) => Number(n.replace(/,/g, "")));
}

/** "https://www.outrank.so/pricing" → "outrank.so/pricing". */
export function displayUrl(url: string): string {
  try {
    const u = new URL(url);
    const path = u.pathname === "/" ? "" : u.pathname.replace(/\/$/, "");
    return `${u.hostname.replace(/^www\./, "")}${path}`;
  } catch {
    return url;
  }
}

export const STATE_LABEL: Record<CellState, string> = {
  yes: "Included",
  partial: "Partly, or via an add-on",
  no: "Not what it is for",
};

/** The soft blue key that marks Rankbox's column in every table here. */
export const OURS_TINT = "bg-[color-mix(in_oklab,var(--cta)_5%,white)]";
