/**
 * Rankbox pricing — the one place plan numbers live. The /pricing page, the
 * landing pricing section, and the pricing FAQ all read from here, so a price
 * change is a one-line edit instead of a hunt across components.
 *
 * These are display values. What a customer is actually charged is set in
 * Stripe (lookup key `business_monthly`, trial length in ALLOWED_PRICES in
 * src/lib/payments.functions.ts). Change them together.
 */

export type BillingCycle = "monthly" | "yearly";

/** Free-trial length. Must match `trialDays` in ALLOWED_PRICES. */
export const TRIAL_DAYS = 7;

export const PLAN = {
  name: "Business",
  sites: 1,
  articlesPerMonth: 30,
  backlinkCreditsPerMonth: 30,
  /** List price, billed monthly. */
  monthly: 99,
  /** Billed once a year: two months free against monthly. */
  yearly: 990,
} as const;

/** First-month discount on monthly billing. Set to null to retire the offer. */
export const INTRO_OFFER: { percentOff: number } | null = { percentOff: 50 };

/** $99 → "$99", 49.5 → "$49.50", 4500 → "$4,500". */
export function formatUsd(n: number): string {
  const whole = Number.isInteger(n);
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  });
}

export interface CyclePrice {
  /** The effective monthly rate, the headline number. */
  perMonth: number;
  /** What one invoice is for. */
  billed: number;
  perArticle: number;
  /** Saving against paying monthly for a year. Zero on monthly. */
  yearlySaving: number;
}

export function priceFor(cycle: BillingCycle): CyclePrice {
  const perMonth = cycle === "monthly" ? PLAN.monthly : PLAN.yearly / 12;
  return {
    perMonth,
    billed: cycle === "monthly" ? PLAN.monthly : PLAN.yearly,
    perArticle: Math.round((perMonth / PLAN.articlesPerMonth) * 100) / 100,
    yearlySaving: cycle === "yearly" ? PLAN.monthly * 12 - PLAN.yearly : 0,
  };
}

/** First month's price on monthly billing, when the intro offer runs. */
export function introPrice(): number | null {
  if (!INTRO_OFFER) return null;
  return Math.round(PLAN.monthly * (100 - INTRO_OFFER.percentOff)) / 100;
}

/** What happens at the end of the trial, in one sentence, for either cycle. */
export function afterTrialCopy(cycle: BillingCycle): string {
  if (cycle === "yearly") return `${formatUsd(PLAN.yearly)} a year — two months free`;
  const intro = introPrice();
  return intro !== null
    ? `${formatUsd(intro)} for your first month, then ${formatUsd(PLAN.monthly)}/month`
    : `${formatUsd(PLAN.monthly)}/month`;
}

export const PRICING_FAQS: { q: string; a: string }[] = [
  {
    q: "Do I need a credit card to get started?",
    a: `No. Signing up and building your content plan is free, with no card. You add a card only when you start your ${TRIAL_DAYS}-day free trial, and you aren't charged until the trial ends.`,
  },
  {
    q: "What happens when my free trial ends?",
    a: `Your plan continues automatically: ${afterTrialCopy("monthly")} on monthly billing. Cancel any time before day ${TRIAL_DAYS} and you won't be charged at all.`,
  },
  {
    q: "How does yearly billing work?",
    a: `You pay ${formatUsd(PLAN.yearly)} once a year instead of ${formatUsd(PLAN.monthly)} a month — ${formatUsd(PLAN.monthly * 12 - PLAN.yearly)} saved, or two months free. Everything else about the plan is identical.`,
  },
  {
    q: "Are there any add-ons, setup fees, or contracts?",
    a: "None. Every feature is in the one plan: research, writing, auto-publishing, backlinks, citation tracking, unlimited rewrites, and unlimited team members. No setup fees, no long-term contract.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, in one click from your billing portal. Your plan won't renew, and you keep full access until the end of the period you've already paid for. Everything already published stays on your site.",
  },
  {
    q: "Do you offer refunds?",
    a: "Subscriptions are non-refundable, which is exactly why the free trial exists: you see the engine working on your own site before you pay anything. If you were billed in error, we'll correct it — see our refund policy for details.",
  },
  {
    q: "What if I run more than one website?",
    a: `Each plan covers ${PLAN.sites} website, with its own research, content plan, and publishing schedule. Running several sites? Email us and we'll work out the right setup with you.`,
  },
  {
    q: "How do I pay?",
    a: "All major cards, processed securely by Stripe. We never see or store your card details. Invoices are available anytime from your billing portal.",
  },
];
