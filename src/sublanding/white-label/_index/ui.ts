/**
 * Class names this page reuses, so its sections share one rhythm. Every
 * colour is a token from styles.css; shadows mix --ink instead of a hex.
 */
import type { ClientTone } from "./content";

export const WRAP = "mx-auto w-full max-w-6xl px-5 sm:px-8";

export const SECTION = "scroll-mt-20 py-20 sm:py-24 lg:py-28";

export const H2 =
  "text-balance font-display text-[1.85rem] font-semibold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[2.35rem]";

export const INTRO = "mt-4 max-w-2xl text-[1.02rem] leading-relaxed text-muted-foreground";

export const CARD = "rounded-2xl border border-border bg-card";

/** A lifted card: a hairline shadow plus a long, soft one. */
export const LIFT =
  "shadow-[0_1px_2px_color-mix(in_oklab,var(--ink)_6%,transparent),0_22px_44px_-28px_color-mix(in_oklab,var(--ink)_34%,transparent)]";

export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export const TEXT_LINK =
  "font-medium text-cta underline-offset-[3px] transition-colors hover:text-cta-hover hover:underline " +
  FOCUS;

/** Each sample client's own brand colour, as a token. */
export const TONE_BG: Record<ClientTone | "blue", string> = {
  teal: "bg-chart-2",
  amber: "bg-chart-1",
  slate: "bg-chart-3",
  blue: "bg-brand-blue",
};

export const TONE_TEXT: Record<ClientTone | "blue", string> = {
  teal: "text-chart-2",
  amber: "text-chart-1",
  slate: "text-chart-3",
  blue: "text-brand-blue",
};
