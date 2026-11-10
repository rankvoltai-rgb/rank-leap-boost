/**
 * /use-cases/ai-built-websites: the values its components share. Kept apart
 * from the components so fast refresh stays component-only.
 */
import type { CSSProperties } from "react";

/* Staggers the CSS entrance (animate-hero-rise in styles.css), which runs on
   the server-rendered markup and is skipped under reduced motion. */
export const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

/** The page's solid call to action. Always blue, never ink. */
export const SOLID_BUTTON =
  "group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-cta px-5 text-[0.95rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-[background-color,transform] duration-150 hover:bg-cta-hover active:scale-[0.985] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25";

/** A white product window's border and shadow, as on the landing. */
export const WINDOW =
  "rounded-xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-26px_rgba(16,24,40,0.28)]";

/** The section titles' size, one step under the landing's SectionHead. */
export const TITLE =
  "font-display text-[1.85rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.3rem]";

/** Mono tints for the raw HTML the crawler window prints. */
export const CODE = {
  tag: "text-[#1563d6]",
  attr: "text-[#6d28d9]",
  text: "text-ink/75",
  dim: "text-ink/35",
} as const;
