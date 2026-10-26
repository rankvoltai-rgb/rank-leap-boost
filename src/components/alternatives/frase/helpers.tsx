/**
 * Plain helpers and class strings the /alternatives/frase sections share.
 * Kept apart from ui.tsx so that file exports components only.
 */
import type { CSSProperties, ReactNode } from "react";
import { Accent } from "@/components/landing/frame";
import type { CellState } from "@/data/alternatives";

/* Staggers the CSS entrance (see animate-hero-rise in styles.css). */
export const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

/** A white product card with a hairline edge and a soft drop, as on the landing. */
export const CARD =
  "rounded-xl border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_40px_-28px_rgba(16,24,40,0.28)]";

export const STATE_LABEL: Record<CellState, string> = {
  yes: "Included",
  partial: "Partly",
  no: "Not its focus",
};

/**
 * Text with each hyphenated word held on one line, so "on-page" never
 * breaks after its hyphen in a large title. The words are unchanged.
 */
export function keepHyphens(text: string): ReactNode {
  const words = text.split(" ");
  return words.map((w, i) => (
    <span key={i}>
      {w.includes("-") ? <span className="whitespace-nowrap">{w}</span> : w}
      {i < words.length - 1 ? " " : ""}
    </span>
  ));
}

/** A title with its closing `words` words in the blue accent. */
export function withAccent(text: string, words: number): ReactNode {
  const parts = text.trim().split(/\s+/);
  if (parts.length <= words) return <Accent>{keepHyphens(text)}</Accent>;
  return (
    <>
      {keepHyphens(parts.slice(0, -words).join(" "))}{" "}
      <Accent>{keepHyphens(parts.slice(-words).join(" "))}</Accent>
    </>
  );
}

/** "A. B." → ["A.", "B."], so a two-sentence title can carry its accent on the second. */
export function sentences(text: string): string[] {
  return text.split(/(?<=\.)\s+/).filter(Boolean);
}

/** "https://www.frase.io/pricing" → "frase.io/pricing". */
export function displayUrl(url: string): string {
  try {
    const u = new URL(url);
    const path = u.pathname === "/" ? "" : u.pathname.replace(/\/$/, "");
    return `${u.hostname.replace(/^www\./, "")}${path}`;
  } catch {
    return url;
  }
}
