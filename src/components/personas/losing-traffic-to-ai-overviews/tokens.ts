/**
 * Shared values for /use-cases/losing-traffic-to-ai-overviews: the entrance
 * stagger, the card and button classes, and the hairline-ruled tints. Kept
 * apart from the components so fast refresh stays component-only.
 */
import type { CSSProperties } from "react";

/* Staggers the CSS entrance (animate-hero-rise in styles.css). */
export const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

/** The page's solid call to action. Always blue, never ink. */
export const SOLID_BUTTON =
  "group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-cta px-5 text-[0.95rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-[background-color,transform] duration-150 hover:bg-cta-hover active:scale-[0.985] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25";

/** A white product card: hairline border and the landing's long soft shadow. */
export const SCREEN =
  "rounded-xl border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-24px_rgba(16,24,40,0.25)]";

/** Rankbox's side of a split, tinted the faintest blue. */
export const RUNS_TINT = "bg-[color-mix(in_oklab,var(--cta)_4%,white)]";

/** A link on the sample results page: search-result blue, not the CTA blue. */
export const RESULT_BLUE = "text-[#1a4fc4]";

/** The tint behind the AI Overview card, a cool blue-violet wash. */
export const OVERVIEW_TINT = "bg-[linear-gradient(135deg,#f3f6ff_0%,#f6f3ff_55%,#f9fbff_100%)]";
