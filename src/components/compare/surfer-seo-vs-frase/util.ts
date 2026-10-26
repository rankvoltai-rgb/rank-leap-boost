/**
 * Plain helpers and constants for the Surfer SEO vs Frase page's sections.
 * Kept out of the component files so fast refresh stays whole.
 */
import type { MouseEvent } from "react";
import type { CellState, Side } from "@/data/compare/types";

export const SIDES: Side[] = ["a", "b"];

/* Clears the sticky navbar plus a little air. */
const OFFSET = 88;

/** Smooth in-page jump that lands below the sticky navbar and keeps the hash. */
export function jump(e: MouseEvent<HTMLAnchorElement>, id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - OFFSET,
    behavior: reduce ? "auto" : "smooth",
  });
  history.replaceState(null, "", `#${id}`);
}

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

export const STATE_LABEL: Record<CellState, string> = {
  yes: "Included",
  partial: "Partly, or as an add-on",
  no: "Not what it's built for",
};

/** The soft blue tint on a winner's cell. */
export const WIN_TINT = "bg-[color-mix(in_oklab,var(--cta)_5%,white)]";
