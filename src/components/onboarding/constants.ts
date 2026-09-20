/** Shared, non-component values for the onboarding parts. */

export const PARTS = [
  { n: 1, title: "Brand" },
  { n: 2, title: "Keywords" },
  { n: 3, title: "Plan" },
] as const;

export function reducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
