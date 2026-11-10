/**
 * /use-cases/new-websites's shared values: the entrance stagger, the motion
 * curve, the button and card classes, and the runway's scale. Kept apart
 * from the components so fast refresh stays component-only.
 */
import type { CSSProperties } from "react";

/* Staggers the CSS entrance (see animate-hero-rise in styles.css). */
export const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

export const EASE = [0.16, 1, 0.3, 1] as const;

/** The page's solid call to action. Always blue, never ink. */
export const SOLID_BUTTON =
  "group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-cta px-5 text-[0.95rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-[background-color,transform] duration-150 hover:bg-cta-hover active:scale-[0.985] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25";

/** A white product window's border and shadow, as on the landing. */
export const SCREEN =
  "rounded-xl border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-24px_rgba(16,24,40,0.25)]";

/** The section title size every band on this page shares. */
export const TITLE =
  "font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]";

/**
 * The diagonal hatch that stands for time nobody controls: Google's crawl,
 * on the runway and in the handoff's last column.
 */
export const HATCH =
  "bg-[repeating-linear-gradient(135deg,rgba(16,24,40,0.07)_0_1px,transparent_1px_7px)]";

/* The launch runway's span, in days from launch day. */
export const RUNWAY_FROM = -10;
export const RUNWAY_TO = 20;

/** Where a day sits on the runway, as a percentage of its width. */
export function runwayX(day: number): number {
  const t = (day - RUNWAY_FROM) / (RUNWAY_TO - RUNWAY_FROM);
  return Math.min(100, Math.max(0, t * 100));
}
