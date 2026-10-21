/**
 * The /use-cases/saas page's shared values: the stage tints, the sample
 * site, the card and button classes, and the slug helper. Kept apart
 * from the components in parts.tsx so fast refresh stays component-only.
 */
import type { CSSProperties } from "react";

/* Staggers the CSS entrance (see animate-hero-rise in styles.css). */
export const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

/**
 * One tint per stage of the buyer's path, in the map's order (buying,
 * comparing, how-to, fixing). The landing's feature-row tints, with the ink
 * deepened so a 10px chip label still clears AA on its own tint.
 */
export const STAGE_TINTS = [
  { panel: "#eaf2fe", ink: "#1563d6", dot: "#1877f2" },
  { panel: "#f1eefd", ink: "#6d28d9", dot: "#7c3aed" },
  { panel: "#e9f6ee", ink: "#15803d", dot: "#16a34a" },
  { panel: "#fdf4e4", ink: "#b45309", dot: "#d97706" },
] as const;

export function stageTint(i: number) {
  return STAGE_TINTS[((i % STAGE_TINTS.length) + STAGE_TINTS.length) % STAGE_TINTS.length];
}

/** The generic site every screen here runs on. Never a real brand. */
export const SAMPLE_DOMAIN = "yoursite.com";

/** The page's solid call to action. Always blue, never ink. */
export const SOLID_BUTTON =
  "group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-cta px-5 text-[0.95rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-[background-color,transform] duration-150 hover:bg-cta-hover active:scale-[0.985] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25";

/** A white product card's border and shadow, as on the landing. */
export const SCREEN =
  "rounded-xl border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-24px_rgba(16,24,40,0.25)]";

/** URL-safe slug from a title, as the API returns it. */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
