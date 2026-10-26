/**
 * Plain helpers for the Profound vs Peec AI page: price wording, the hero's
 * staggered rise, in-page jumps and the shared button classes.
 */
import type { CSSProperties, MouseEvent } from "react";
import { formatUsd } from "@/data/pricing";
import type { Plan, Side } from "@/data/compare/types";

export const SIDES: Side[] = ["a", "b"];

/* Staggers the CSS entrance (see animate-hero-rise in styles.css). */
export const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** "Free", "Custom" or "$95/mo", as the vendor's plan reads. */
export function planPrice(pl: Plan): string {
  if (pl.monthly === null) return "Custom";
  if (pl.monthly === 0) return "Free";
  return `${formatUsd(pl.monthly)}/mo`;
}

/** "$80/mo yearly" when billing yearly is cheaper, else null. */
export function planYearly(pl: Plan): string | null {
  return pl.annual !== undefined && pl.monthly !== null && pl.annual < pl.monthly
    ? `${formatUsd(pl.annual)}/mo yearly`
    : null;
}

/* The landing's solid blue button. */
export const SOLID_BUTTON =
  "group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-cta px-5 text-[0.95rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-[background-color,transform] duration-150 hover:bg-cta-hover active:scale-[0.985] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25";

/* A white card's soft lift, as the landing's product screens have. */
export const CARD_SHADOW =
  "shadow-[0_1px_2px_rgba(16,24,40,0.04),0_14px_36px_-20px_rgba(16,24,40,0.22)]";

/** Smooth in-page jump that keeps the hash and lands below the navbar. */
export function jump(e: MouseEvent<HTMLAnchorElement>, id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - 72,
    behavior: reduce ? "auto" : "smooth",
  });
  history.replaceState(null, "", `#${id}`);
}
