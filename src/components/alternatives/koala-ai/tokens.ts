/**
 * Class strings and pure helpers the /alternatives/koala-ai sections share.
 * Components live in parts.tsx; this file holds no JSX so fast refresh keeps
 * working on both.
 */
import type { CSSProperties } from "react";
import type { CellState } from "@/data/alternatives";

/* Staggers the CSS entrance (see animate-hero-rise in styles.css). */
export const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

/** Soft panel shadow for product cards on the white page. */
export const CARD =
  "rounded-xl border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-18px_rgba(16,24,40,0.18)]";

/** The Rankbox column's soft blue key, used in every table on the page. */
export const RANKBOX_TINT = "bg-[color-mix(in_oklab,var(--cta)_5%,white)]";

/** "https://www.koala.sh/pricing?x=1" → "koala.sh/pricing". */
export function displayUrl(url: string): string {
  try {
    const u = new URL(url);
    return `${u.hostname.replace(/^www\./, "")}${u.pathname === "/" ? "" : u.pathname.replace(/\/$/, "")}`;
  } catch {
    return url;
  }
}

export const STATE_LABEL: Record<CellState, string> = {
  yes: "Included",
  partial: "Partly, or via an add-on",
  no: "Not what it's built for",
};
