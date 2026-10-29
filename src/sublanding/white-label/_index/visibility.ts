import type { Visibility } from "./content";

/** How many touchpoints show the Rankbox name, out of how many. */
export function rankboxVisible(steps: readonly { visibility: Visibility }[]) {
  return {
    visible: steps.filter((s) => s.visibility !== "hidden").length,
    total: steps.length,
  };
}
