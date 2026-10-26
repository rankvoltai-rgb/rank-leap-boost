/**
 * The seat ladder's arithmetic, kept apart from the picture.
 *
 * Everything is read from the matchup's pricing data: a plan's seats come
 * from its own `includes` line ("3 seats, …" or "Unlimited users, …"), its
 * price from `monthly` / `annual`. For a team of n people the ladder picks
 * the lowest-priced editor plan with at least n seats; when no published plan
 * seats that many, it falls to the quote-only plan. Plans that leave out the
 * content editor (Surfer's tracking-only plan) are kept off the ladder and
 * named under it, with their own `includes` line.
 */
import type { Plan, ProductPricing, Side } from "@/data/compare/types";

export type Billing = "monthly" | "yearly";

const SEATS = /(\d+)\s+seats?\b/i;
const UNLIMITED = /\bunlimited users\b/i;
const NO_EDITOR = /\bno content editor\b/i;

/** Seats a plan includes: a number, Infinity for "Unlimited users", null if it doesn't say. */
export function seatsOf(plan: Plan): number | null {
  if (UNLIMITED.test(plan.includes)) return Infinity;
  const m = SEATS.exec(plan.includes);
  return m ? Number(m[1]) : null;
}

export interface Ladder {
  /** Priced editor plans that name their seats, cheapest first. */
  rungs: { plan: Plan & { monthly: number }; seats: number }[];
  /** The quote-only plan, where a team outgrows every published one. */
  quote?: Plan;
  /** Priced plans without the content editor, left off the chart. */
  leftOut: Plan[];
}

export function ladderOf(pricing: ProductPricing): Ladder {
  const rungs: Ladder["rungs"] = [];
  const leftOut: Plan[] = [];
  for (const plan of pricing.plans) {
    if (plan.monthly === null || plan.forAgencies) continue;
    if (NO_EDITOR.test(plan.includes)) {
      leftOut.push(plan);
      continue;
    }
    const seats = seatsOf(plan);
    if (seats !== null) rungs.push({ plan: plan as Plan & { monthly: number }, seats });
  }
  rungs.sort((x, y) => x.plan.monthly - y.plan.monthly);
  return { rungs, quote: pricing.plans.find((p) => p.monthly === null), leftOut };
}

/** A plan's price on the chosen billing; annual falls back to monthly where none is published. */
export function priceOf(plan: Plan, billing: Billing): number | null {
  if (plan.monthly === null) return null;
  return billing === "yearly" ? (plan.annual ?? plan.monthly) : plan.monthly;
}

export interface Fit {
  plan: Plan;
  /** null when the fit is the quote-only plan. */
  price: number | null;
  /** True when "yearly" was asked for but this plan publishes no annual price. */
  monthlyOnly: boolean;
}

/** The lowest-priced plan that seats `n` people, or the quote-only plan. */
export function fitFor(ladder: Ladder, n: number, billing: Billing): Fit | null {
  let best: Fit | null = null;
  for (const { plan, seats } of ladder.rungs) {
    if (seats < n) continue;
    const price = priceOf(plan, billing)!;
    if (!best || best.price === null || price < best.price) {
      best = { plan, price, monthlyOnly: billing === "yearly" && plan.annual === undefined };
    }
  }
  if (best) return best;
  return ladder.quote ? { plan: ladder.quote, price: null, monthlyOnly: false } : null;
}

/** Which side has the lower published price at this size: "draw" on a tie, null if neither is priced. */
export function lowerOf(a: Fit | null, b: Fit | null): Side | "draw" | null {
  const pa = a?.price ?? null;
  const pb = b?.price ?? null;
  if (pa === null && pb === null) return null;
  if (pa === null) return "b";
  if (pb === null) return "a";
  return pa < pb ? "a" : pb < pa ? "b" : "draw";
}

/** The largest team any published plan seats, plus two, so the quote-only stretch shows. */
export function teamSizesFor(ladders: Ladder[]): number {
  const finite = ladders.flatMap((l) => l.rungs.map((r) => r.seats)).filter(Number.isFinite);
  return Math.max(4, ...finite) + 2;
}

/** The first team size where the lower price changes hands, if it ever does. */
export function crossoverOf(
  a: Ladder,
  b: Ladder,
  sizes: number,
  billing: Billing,
): number | undefined {
  const first = lowerOf(fitFor(a, 1, billing), fitFor(b, 1, billing));
  for (let n = 2; n <= sizes; n++) {
    const now = lowerOf(fitFor(a, n, billing), fitFor(b, n, billing));
    if (now !== first && now !== "draw") return n;
  }
  return undefined;
}

/** The top of the price axis: the dearest fitted price on either billing, up to the next 100. */
export function axisTopFor(a: Ladder, b: Ladder, sizes: number): number {
  let max = 0;
  for (const billing of ["monthly", "yearly"] as const) {
    for (let n = 1; n <= sizes; n++) {
      for (const l of [a, b]) max = Math.max(max, fitFor(l, n, billing)?.price ?? 0);
    }
  }
  return Math.max(100, Math.ceil(max / 100) * 100);
}
