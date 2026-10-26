/**
 * Constants and string helpers for the /alternatives/writesonic page, kept
 * apart from its components so fast refresh stays happy.
 */
import type { CSSProperties } from "react";
import type { CellState } from "@/data/alternatives";

/* Staggers the CSS entrance (see animate-hero-rise in styles.css). */
export const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

/** What each state means, in the words the old matrix used. */
export const STATE_LABEL: Record<CellState, string> = {
  yes: "Included",
  partial: "Partly, or via an add-on",
  no: "Not what it's built for",
};

/** The same, short enough to sit at the end of a bar. */
export const STATE_SHORT: Record<CellState, string> = {
  yes: "Included",
  partial: "Partly",
  no: "Not its focus",
};

/** Which product a mark belongs to: Rankbox in blue, the competitor in slate. */
export type Side = "rankbox" | "them";

/* A soft slate for the competitor's side, so its column reads as its own
   without borrowing a CTA colour or going black. */
export const THEM_SOLID = "bg-[color-mix(in_oklab,var(--ink)_62%,white)]";
export const THEM_SOFT = "bg-[color-mix(in_oklab,var(--ink)_26%,white)]";

/**
 * Splits a title from the data into a plain lead and the phrase set in bold
 * blue: the last sentence when there are two, otherwise the last `words`
 * words. Deterministic, so the server and client agree.
 */
export function splitAccent(text: string, words = 2): { lead: string; accent: string } {
  const stop = text.lastIndexOf(". ");
  if (stop > 0) return { lead: text.slice(0, stop + 1), accent: text.slice(stop + 2) };
  const parts = text.split(" ");
  if (parts.length <= words) return { lead: "", accent: text };
  return {
    lead: parts.slice(0, -words).join(" "),
    accent: parts.slice(-words).join(" "),
  };
}

/** "https://www.writesonic.com/pricing" → "writesonic.com/pricing". */
export function displayUrl(url: string): string {
  try {
    const u = new URL(url);
    const path = u.pathname === "/" ? "" : u.pathname.replace(/\/$/, "");
    return `${u.hostname.replace(/^www\./, "")}${path}`;
  } catch {
    return url;
  }
}
