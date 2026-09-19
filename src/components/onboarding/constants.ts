/** Shared, non-component values for the onboarding parts. */

export const PARTS = [
  { n: 1, title: "Your brand", desc: "Your website, read for you" },
  { n: 2, title: "Keywords", desc: "The searches we'll target" },
  { n: 3, title: "Content plan", desc: "Articles that fill your content gaps" },
] as const;

export function reducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
