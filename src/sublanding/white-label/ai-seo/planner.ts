/**
 * The prompt-check planner's arithmetic, on the visitor's own numbers only.
 * No prices here: the money maths belongs to /white-label/pricing.
 */

export interface PlanInput {
  /** Client sites the agency checks each month. */
  sites: number;
  /** Buyer questions in each client's panel. */
  prompts: number;
  /** Engines each question is asked in. */
  engines: number;
  /** How many times each question is asked in each engine. */
  runs: number;
  /** The visitor's estimate of minutes to read and log one answer. */
  minutes: number;
}

export interface Plan {
  /** Answers to read for one client in a month. */
  perClient: number;
  /** Answers across every client. */
  total: number;
  /** Hours of checking a month, at the visitor's estimate, to one decimal place. */
  hours: number;
}

/** A field's raw text as a whole number inside [min, max], or null if it isn't one. */
export function readWhole(raw: string, min: number, max: number): number | null {
  const t = raw.trim();
  if (!/^\d+$/.test(t)) return null;
  const n = Number(t);
  return n >= min && n <= max ? n : null;
}

export function planPromptCheck(input: PlanInput): Plan {
  const perClient = input.prompts * input.engines * input.runs;
  const total = perClient * input.sites;
  const hours = Math.round(((total * input.minutes) / 60) * 10) / 10;
  return { perClient, total, hours };
}

/** 1234 → "1,234"; 2.5 → "2.5"; 3 → "3". */
export function formatCount(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 1 });
}
