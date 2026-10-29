/**
 * The arithmetic behind /white-label/pricing: an agency's month across its
 * clients, and a new client's first charge part-way through a period.
 *
 * Nothing here invents a price. Rankbox's side comes from facts.ts and the
 * same Studio functions billing runs on (monthlyTotal, periodRemaining,
 * allowanceFor); everything else is the visitor's own input.
 */
import { PLAN, STUDIO } from "@/sublanding/_shared/facts";
import { allowanceFor, monthlyTotal, periodRemaining, type Allowance } from "@/lib/studio";

/** Who the plan's own site (the one onboarding creates) is used for. */
export type PlanSite = "agency" | "client";

export const LIMITS = {
  clients: { min: 1, max: 200 },
  money: 1_000_000,
  hours: 500,
  rate: 5_000,
} as const;

const cents = (n: number) => Math.round(n * 100) / 100;

/**
 * Studio sites needed for this many clients. With the agency on the plan's
 * site, every client is a Studio site; with a client there, one fewer is.
 */
export function studioSitesFor(clients: number, planSite: PlanSite): number {
  const n = Math.max(0, Math.floor(clients));
  return planSite === "agency" ? n : Math.max(0, n - 1);
}

/** Rankbox's own cost of one client site, per article, when every credit is used. */
export function perArticleCost(): number {
  return cents(STUDIO.monthlyPerSite / PLAN.articlesPerMonth);
}

export interface MarginInput {
  clients: number;
  planSite: PlanSite;
  /** What the agency charges each client a month. Null until the visitor types it. */
  retainer: number | null;
  hoursPerClient: number;
  hourlyCost: number;
  setupFee: number;
  setupHours: number;
}

export interface MarginResult {
  studioSites: number;
  /** The whole Rankbox invoice: the plan plus every Studio site. */
  rankboxBill: number;
  rankboxPerClient: number;
  teamTime: number;
  totalCost: number;
  /** The retainer per client that covers the bill and the team's time. */
  breakEven: number;
  revenue: number | null;
  margin: number | null;
  /** Margin as a share of revenue, in percent to one decimal. Null without revenue. */
  marginPct: number | null;
  setupTimeCost: number;
  /** Setup fee minus the setup time it costs, per new client. */
  setupNet: number;
}

export function computeMargin(input: MarginInput): MarginResult {
  const clients = Math.max(1, Math.floor(input.clients));
  const studioSites = studioSitesFor(clients, input.planSite);
  const rankboxBill = monthlyTotal(studioSites);
  const teamTime = cents(clients * input.hoursPerClient * input.hourlyCost);
  const totalCost = cents(rankboxBill + teamTime);
  const revenue = input.retainer === null ? null : cents(clients * input.retainer);
  const margin = revenue === null ? null : cents(revenue - totalCost);
  const marginPct =
    revenue === null || margin === null || revenue <= 0
      ? null
      : Math.round((margin / revenue) * 1000) / 10;
  const setupTimeCost = cents(input.setupHours * input.hourlyCost);
  return {
    studioSites,
    rankboxBill,
    rankboxPerClient: cents(rankboxBill / clients),
    teamTime,
    totalCost,
    // Rounded up to the cent, so charging it never leaves a fraction short.
    breakEven: Math.ceil((totalCost / clients) * 100 - 1e-9) / 100,
    revenue,
    margin,
    marginPct,
    setupTimeCost,
    setupNet: cents(input.setupFee - setupTimeCost),
  };
}

/* ------------------------------------------------------------------ */
/* Reading what the visitor typed                                      */
/* ------------------------------------------------------------------ */

export type FieldError = "nan" | "negative" | "tooBig";

export type Parsed = { value: number | null; error: null } | { value: null; error: FieldError };

/**
 * A typed amount: "$1,200", "1200" and " 1200.50 " all read as numbers, a
 * blank field is null (not zero), and anything else names what's wrong.
 */
export function parseAmount(raw: string, max: number): Parsed {
  const text = raw.replace(/[$,\s]/g, "");
  if (text === "") return { value: null, error: null };
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(text)) return { value: null, error: "nan" };
  const n = Number(text);
  if (!Number.isFinite(n)) return { value: null, error: "nan" };
  if (n < 0) return { value: null, error: "negative" };
  if (n > max) return { value: null, error: "tooBig" };
  return { value: n, error: null };
}

/* ------------------------------------------------------------------ */
/* A new client's first charge                                         */
/* ------------------------------------------------------------------ */

/** The example billing period the slider walks through. Real periods run 28 to 31 days. */
export const EXAMPLE_PERIOD_DAYS = 30;

const DAY_MS = 24 * 60 * 60 * 1000;

export interface FirstCharge {
  /** Share of the period still to run, 0 to 1. */
  share: number;
  /** About what's charged on the day the site is added. Stripe's preview has the exact amount. */
  dueToday: number;
  /** The site's first, prorated allowance. */
  allowance: Allowance;
}

/**
 * Adding a client site at the start of `day` (1 = the renewal day itself).
 * Uses the same share-of-period rule as Studio's billing and allowances.
 */
export function firstChargeOnDay(day: number, periodDays = EXAMPLE_PERIOD_DAYS): FirstCharge {
  const d = Math.min(Math.max(1, Math.floor(day)), periodDays);
  const start = Date.UTC(2026, 0, 1);
  const end = start + periodDays * DAY_MS;
  const share = periodRemaining(
    new Date(start).toISOString(),
    new Date(end).toISOString(),
    start + (d - 1) * DAY_MS,
  );
  return {
    share,
    dueToday: cents(STUDIO.monthlyPerSite * share),
    allowance: allowanceFor(share),
  };
}

/* ------------------------------------------------------------------ */
/* The calculator's state, from what's in its fields                   */
/* ------------------------------------------------------------------ */

export type CalcField = "retainer" | "setupFee" | "hours" | "rate" | "setupHours";

export const FIELD_MAX: Record<CalcField, number> = {
  retainer: LIMITS.money,
  setupFee: LIMITS.money,
  hours: LIMITS.hours,
  rate: LIMITS.rate,
  setupHours: LIMITS.hours,
};

/**
 * error   a field can't be read, so no numbers are shown
 * empty   no retainer yet: the bill and the break-even, no margin
 * priced  a margin of zero or more
 * loss    the retainer doesn't cover the bill and the team's time
 */
export type CalcStatus = "error" | "empty" | "priced" | "loss";

export interface CalcState {
  status: CalcStatus;
  clients: number | null;
  clientsError: boolean;
  errors: Partial<Record<CalcField, FieldError>>;
  values: Record<CalcField, number | null>;
  result: MarginResult | null;
}

export function parseClients(raw: string): number | null {
  const text = raw.trim();
  if (!/^\d+$/.test(text)) return null;
  const n = Number(text);
  return n >= LIMITS.clients.min && n <= LIMITS.clients.max ? n : null;
}

export function readCalculator(
  clientsRaw: string,
  planSite: PlanSite,
  raw: Record<CalcField, string>,
): CalcState {
  const clients = parseClients(clientsRaw);
  const errors: Partial<Record<CalcField, FieldError>> = {};
  const values = {} as Record<CalcField, number | null>;
  for (const f of Object.keys(FIELD_MAX) as CalcField[]) {
    const p = parseAmount(raw[f] ?? "", FIELD_MAX[f]);
    values[f] = p.value;
    if (p.error) errors[f] = p.error;
  }
  const clientsError = clients === null;
  if (clientsError || Object.keys(errors).length > 0) {
    return { status: "error", clients, clientsError, errors, values, result: null };
  }
  const result = computeMargin({
    clients: clients as number,
    planSite,
    retainer: values.retainer,
    hoursPerClient: values.hours ?? 0,
    hourlyCost: values.rate ?? 0,
    setupFee: values.setupFee ?? 0,
    setupHours: values.setupHours ?? 0,
  });
  const status: CalcStatus =
    result.margin === null ? "empty" : result.margin < 0 ? "loss" : "priced";
  return { status, clients, clientsError, errors, values, result };
}
