/**
 * The arithmetic behind the meter on /compare/koala-ai-vs-byword.
 *
 * Koala sells words a month and Byword sells articles a month, so the same
 * publishing plan is counted in two different units. Given a monthly volume,
 * an article length and Koala's model multiplier, this finds the cheapest
 * published plan on each side whose allowance covers it.
 *
 * Every allowance is read out of the plan's own `includes` line in the data
 * ("45,000 words, …", "25 articles, …"), never typed in here, so a price
 * change in the data moves the meter with it. A plan with no allowance in its
 * line (Byword's Unlimited) has no cap to run out of; a plan whose allowance
 * is a one-time grant ("5 articles once") is a trial, never a monthly fit.
 */
import type { Plan, ProductPricing } from "@/data/compare/types";

export type Unit = "words" | "articles";
export type Billing = "monthly" | "yearly";

/** Monthly volumes the slider steps through. Finer at the low end, where most sites are. */
export const VOLUMES = [5, 10, 15, 20, 25, 30, 40, 50, 60, 80, 100, 125, 150, 200, 250, 300];
export const DEFAULT_VOLUME = 25;

export const LENGTHS = [1000, 1500, 2000, 3000];
export const DEFAULT_LENGTH = 2000;

/**
 * Koala's word multipliers, as its pricing note states them: allowances assume
 * the 1x model; Claude Sonnet 5, the recommended writer, counts double and
 * Opus 5 triple.
 */
export const MODELS = [
  { id: "base", label: "1x model", short: "1x", multiplier: 1 },
  { id: "sonnet", label: "Claude Sonnet 5", short: "2x", multiplier: 2 },
  { id: "opus", label: "Opus 5", short: "3x", multiplier: 3 },
] as const;
export type ModelId = (typeof MODELS)[number]["id"];
export const DEFAULT_MODEL: ModelId = "sonnet";

/** The sweep the meter plays once when it comes into view, then settles on the default. */
export const SWEEP = [5, 10, 25, 50, 80, 150, 300, DEFAULT_VOLUME];

export type RungState = "short" | "fit" | "room" | "trial";

export interface Rung {
  plan: Plan;
  /** Allowance a month in the ladder's unit; null when the plan lists none. */
  cap: number | null;
  /** How much of `cap` the volume uses, 0–1 (1 when it overflows). */
  fill: number;
  state: RungState;
  /** The month's price under the chosen billing, or null for quote-only. */
  price: number | null;
  /** Yearly billing was asked for but the plan only lists a monthly price. */
  monthlyOnly: boolean;
}

export interface Ladder {
  rungs: Rung[];
  /** The cheapest rung that covers the volume; null when none listed does. */
  fit: Rung | null;
  /** The volume in the ladder's unit. */
  need: number;
}

const UNIT_RE: Record<Unit, RegExp> = {
  words: /([\d,]+)\s+words\b/,
  articles: /([\d,]+)\s+articles\b/,
};

export function allowance(plan: Plan, unit: Unit): number | null {
  const m = plan.includes.match(UNIT_RE[unit]);
  return m ? Number(m[1].replace(/,/g, "")) : null;
}

function isTrial(plan: Plan): boolean {
  return plan.monthly === 0 || /\bonce\b/i.test(plan.includes);
}

export function priceOf(plan: Plan, billing: Billing): number | null {
  if (plan.monthly === null) return null;
  return billing === "yearly" && plan.annual !== undefined ? plan.annual : plan.monthly;
}

export function ladderFor(
  pricing: ProductPricing,
  unit: Unit,
  need: number,
  billing: Billing,
): Ladder {
  const plans = [...pricing.plans]
    .filter((p) => !p.forAgencies)
    .sort((x, y) => (x.monthly ?? Infinity) - (y.monthly ?? Infinity));

  const fitIndex = plans.findIndex((p) => {
    if (isTrial(p)) return false;
    const cap = allowance(p, unit);
    return cap === null || cap >= need;
  });

  const rungs = plans.map((plan, i): Rung => {
    const cap = allowance(plan, unit);
    const trial = isTrial(plan);
    const state: RungState = trial
      ? "trial"
      : fitIndex === -1 || i < fitIndex
        ? "short"
        : i === fitIndex
          ? "fit"
          : "room";
    return {
      plan,
      cap,
      fill: cap === null || cap === 0 ? 0 : Math.min(1, need / cap),
      state,
      price: priceOf(plan, billing),
      monthlyOnly: billing === "yearly" && plan.annual === undefined && !trial,
    };
  });

  return { rungs, fit: fitIndex === -1 ? null : rungs[fitIndex], need };
}

/** Koala's meter reads in words: articles × length × the model's multiplier. */
export function wordsNeeded(articles: number, length: number, model: ModelId): number {
  const m = MODELS.find((x) => x.id === model) ?? MODELS[0];
  return articles * length * m.multiplier;
}

export const fmt = (n: number) => n.toLocaleString("en-US");

/** Price divided by articles, to the cent. */
export function perArticle(price: number, articles: number): number {
  return Math.round((price / articles) * 100) / 100;
}
