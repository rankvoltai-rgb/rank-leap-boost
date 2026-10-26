/**
 * Constants the /alternatives/seobot sections share, kept out of the
 * component files so fast refresh keeps working.
 */
import type { CSSProperties } from "react";
import type { CellState } from "@/data/alternatives";

/* Staggers the CSS entrance (see animate-hero-rise in styles.css). */
export const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

/** The soft shadow every sample screen on this page sits on. */
export const CARD_SHADOW =
  "shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_40px_-24px_rgba(16,24,40,0.22)]";

/** The soft blue that keys Rankbox's column wherever two columns sit side by side. */
export const RANKBOX_TINT = "bg-[color-mix(in_oklab,var(--cta)_5%,white)]";

export const STATE_LABEL: Record<CellState, string> = {
  yes: "Included",
  partial: "Partly, or via an add-on",
  no: "Not what it is for",
};
