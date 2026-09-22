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

/**
 * The Stripe price the trial and the plan are both sold on, by lookup key —
 * never a `price_…` id, so sandbox and live can share this one name. The
 * server re-checks it against ALLOWED_PRICES; passing it from the client only
 * says *which* of the prices we sell is wanted, never what it costs.
 */
export const PLAN_PRICE_LOOKUP_KEY = "business_monthly";

/**
 * Articles a trialing subscriber may generate before their first payment.
 * Deliberately far below the monthly allowance: a trial that hands over all
 * 30 articles up front is worth stealing with a card that will decline.
 */
export const TRIAL_ARTICLE_CREDITS = 7;

export const PLAN = {
  name: "Business",
  sites: 1,
  articlesPerMonth: 30,
  backlinkCreditsPerMonth: 30,
  /**
   * Reddit reply drafts a month. Paid plans only, like backlink credits, and
   * there is deliberately no trial allowance beside TRIAL_ARTICLE_CREDITS: a
   * sweep spends real money before anyone has paid, and a reply goes out under
   * a real person's name in a thread that outlives any trial.
   */
  redditRepliesPerMonth: 30,
  /** List price, billed monthly. Must match the `business_monthly` price in Stripe. */
  monthly: 49.5,
} as const;

/**
 * Studio: more than one site under one account, for agencies and founders
 * running several brands. Every extra site is one more unit of a second line
 * on the same subscription — billed at the plan's own price, with the plan's
 * full allowance of its own. It is bought from inside the dashboard, once the
 * plan is paid; onboarding never offers it.
 */
export const STUDIO_PRICE_LOOKUP_KEY = "studio_site_monthly";

export const STUDIO = {
  name: "Studio",
  /** Per additional site, billed monthly. Must match the `studio_site_monthly` price in Stripe. */
  monthlyPerSite: 49.5,
  /**
   * Whether the public site says so. The dashboard's Studio works as soon as
   * the Stripe price exists; the marketing pages (pricing FAQ, agency page,
   * comparisons) keep describing one site per plan until this is flipped, so
   * nothing public claims a feature before it can actually be bought.
   */
  live: true,
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
    q: "Is everything included in the free trial?",
    a: `Everything except the backlink exchange and Reddit presence, which both open with your first paid invoice. Research, writing, publishing, and citation tracking all work during the trial, with up to ${TRIAL_ARTICLE_CREDITS} articles. Backlinks wait for a paid plan so that throwaway accounts can't join the network; Reddit presence waits because replies go out under your own name, in threads that outlive a trial.`,
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
    a: STUDIO.live
      ? `Add them from your dashboard with ${STUDIO.name}, once your plan is paid. Each extra site is ${formatUsd(STUDIO.monthlyPerSite)} a month on the same invoice, with the full plan of its own: ${PLAN.articlesPerMonth} articles, ${PLAN.backlinkCreditsPerMonth} backlink credits, and ${PLAN.redditRepliesPerMonth} Reddit replies a month, and its own research, content plan, and publishing schedule. Remove a site any time; it runs to the end of the period you've paid for.`
      : `Each plan covers ${PLAN.sites} website, with its own research, content plan, and publishing schedule. Running several sites? Email us and we'll work out the right setup with you.`,
  },
  {
    q: "How do I pay?",
    a: "All major cards, processed securely by Stripe. We never see or store your card details. Invoices are available anytime from your billing portal.",
  },
];
