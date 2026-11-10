/**
 * The /use-cases/professional-services page's shared values: the button and
 * card classes, the paper tone its documents sit on, the stagger helper and
 * the icon for each of the four signals. Kept apart from the components so
 * fast refresh stays component-only.
 */
import type { ComponentType, CSSProperties } from "react";
import { Building2, CalendarClock, FileCheck2, MapPin } from "lucide-react";
import type { SignalId } from "@/data/persona-pages/professional-services";

/* Staggers the CSS entrance (see animate-hero-rise in styles.css). */
export const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

/** The page's solid call to action. Always blue, never ink. */
export const SOLID_BUTTON =
  "group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-cta px-5 text-[0.95rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-[background-color,transform] duration-150 hover:bg-cta-hover active:scale-[0.985] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25";

/** A white product card, as on the landing. */
export const SCREEN =
  "rounded-xl border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-24px_rgba(16,24,40,0.25)]";

/**
 * A sheet of paper: the memo, the engagement scope, the sign-off sheet and
 * the fee schedule are all documents a firm already reads, so they sit on
 * white with a hairline and a low shadow, never a product chrome.
 */
export const SHEET =
  "rounded-lg border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_40px_-28px_rgba(16,24,40,0.3)]";

/** The small uppercase label a document uses for its field names. */
export const FIELD =
  "text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground";

/** A soft blue panel with the landing's dot grid, for the scene. */
export const DOTS =
  "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(22,111,229,0.16)_1px,transparent_0)] bg-[length:18px_18px]";

export const SIGNAL_ICONS: Record<SignalId, ComponentType<{ className?: string }>> = {
  industry: Building2,
  service: FileCheck2,
  region: MapPin,
  updated: CalendarClock,
};

export const EASE = [0.16, 1, 0.3, 1] as const;

/** Splits a title so its last `words` words carry the accent. */
export function splitTitle(text: string, words: number): { lead: string; accent: string } {
  const parts = text.split(" ");
  if (parts.length <= words) return { lead: "", accent: text };
  return { lead: parts.slice(0, -words).join(" "), accent: parts.slice(-words).join(" ") };
}
