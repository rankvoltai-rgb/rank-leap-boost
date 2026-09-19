/**
 * Traffic tiers relative to the account, not to the internet.
 *
 * A site whose best article projects 80 visits a month and one whose best
 * projects 8,000 both deserve to see which of *their* articles are the big
 * ones. So the cut-offs are the account's own terciles: the top third of its
 * projected traffic is "high", the bottom third "low".
 */
export type TrafficTier = "high" | "medium" | "low";

export interface TrafficScale {
  /** At or above this is "medium". */
  lowCut: number;
  /** At or above this is "high". */
  highCut: number;
}

function quantile(sorted: number[], q: number): number {
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  const next = sorted[base + 1] ?? sorted[base];
  return sorted[base] + rest * (next - sorted[base]);
}

/** Null when there's too little spread to rank against — everything reads "medium". */
export function trafficScale(values: number[]): TrafficScale | null {
  const sorted = values.filter((v) => v > 0).sort((a, b) => a - b);
  if (sorted.length < 3 || sorted[0] === sorted[sorted.length - 1]) return null;
  return { lowCut: quantile(sorted, 1 / 3), highCut: quantile(sorted, 2 / 3) };
}

export function trafficTier(value: number, scale: TrafficScale | null): TrafficTier {
  if (!scale) return "medium";
  if (value >= scale.highCut) return "high";
  if (value >= scale.lowCut) return "medium";
  return "low";
}
