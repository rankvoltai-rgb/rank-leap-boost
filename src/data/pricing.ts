/**
 * Rankbox pricing — the one place plan numbers live. The /pricing page, the
 * landing pricing section, and the pricing FAQ all read from here, so a price
 * change is a one-line edit instead of a hunt across components.
 *
 * These are display values. What a customer is actually charged is set in
 * Stripe (lookup key `business_monthly`, trial length in ALLOWED_PRICES in
 * src/lib/payments.functions.ts). Change them together.
 */

/** Free-trial length. Must match `trialDays` in ALLOWED_PRICES. */
export const TRIAL_DAYS = 7;

export const PLAN = {
  name: "Business",
  sites: 1,
  articlesPerMonth: 30,
  backlinkCreditsPerMonth: 30,
  /** List price, billed monthly. Must match the `business_monthly` price in Stripe. */
  monthly: 49.5,
} as const;

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
  /** The monthly rate, the headline number. */
  perMonth: number;
  /** What one invoice is for. */
  billed: number;
  perArticle: number;
}

export function priceFor(): CyclePrice {
  return {
    perMonth: PLAN.monthly,
    billed: PLAN.monthly,
    perArticle: Math.round((PLAN.monthly / PLAN.articlesPerMonth) * 100) / 100,
  };
}

/** What happens at the end of the trial, in one sentence. */
export function afterTrialCopy(): string {
  return `${formatUsd(PLAN.monthly)}/month`;
}

export const PRICING_FAQS: { q: string; a: string }[] = [
  {
    q: "Do I need a credit card to get started?",
    a: `No. Signing up and building your content plan is free, with no card. You add a card only when you start your ${TRIAL_DAYS}-day free trial, and you aren't charged until the trial ends.`,
  },
  {
    q: "What happens when my free trial ends?",
    a: `Your plan continues automatically at ${afterTrialCopy()}. Cancel any time before day ${TRIAL_DAYS} and you won't be charged at all.`,
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
