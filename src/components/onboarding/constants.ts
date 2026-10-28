/** Shared, non-component values for the onboarding parts. */

export const PARTS = [
  { n: 1, title: "Brand" },
  { n: 2, title: "Keywords" },
  { n: 3, title: "Plan" },
  // The paywall. Not skippable: the dashboard sends anyone without a
  // subscription back here.
  { n: 4, title: "Trial" },
] as const;

export function reducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
