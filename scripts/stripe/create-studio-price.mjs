#!/usr/bin/env node
/**
 * Creates the Stripe price Studio sells extra sites on: a monthly recurring
 * price with the lookup key `studio_site_monthly`, on its own product so the
 * invoice line reads "Rankbox Studio — additional site × 2" rather than a
 * second copy of the plan.
 *
 * Safe to run twice: an existing active price with the lookup key is left
 * alone. Run it once per Stripe environment, with that environment's key:
 *
 *   STRIPE_KEY=sk_test_… node scripts/stripe/create-studio-price.mjs
 *   STRIPE_KEY=sk_live_… node scripts/stripe/create-studio-price.mjs
 *
 * The amount must match STUDIO.monthlyPerSite in src/data/pricing.ts.
 */
import Stripe from "stripe";

const LOOKUP_KEY = "studio_site_monthly";
const UNIT_AMOUNT_CENTS = 4950;
const PRODUCT_NAME = "Rankbox Studio — additional site";

const key = process.env.STRIPE_KEY;
if (!key || !/^sk_(test|live)_/.test(key)) {
  console.error("Set STRIPE_KEY to a secret key (sk_test_… or sk_live_…).");
  process.exit(1);
}
const mode = key.startsWith("sk_live_") ? "LIVE" : "test";
const stripe = new Stripe(key, { apiVersion: "2026-03-25.dahlia" });

const existing = await stripe.prices.list({ lookup_keys: [LOOKUP_KEY], active: true, limit: 1 });
if (existing.data.length) {
  const p = existing.data[0];
  console.log(
    `[${mode}] ${LOOKUP_KEY} already exists: ${p.id} (${(p.unit_amount ?? 0) / 100} ${p.currency}/${p.recurring?.interval}).`,
  );
  if (p.unit_amount !== UNIT_AMOUNT_CENTS) {
    console.warn(
      `  It charges ${p.unit_amount} cents, not ${UNIT_AMOUNT_CENTS}. Update STUDIO.monthlyPerSite, or replace the price.`,
    );
  }
  process.exit(0);
}

const product = await stripe.products.create({
  name: PRODUCT_NAME,
  description: "One more site on your Rankbox account, with the full plan of its own.",
});
const price = await stripe.prices.create({
  product: product.id,
  currency: "usd",
  unit_amount: UNIT_AMOUNT_CENTS,
  recurring: { interval: "month" },
  lookup_key: LOOKUP_KEY,
  nickname: "Studio site, monthly",
});
console.log(`[${mode}] Created ${PRODUCT_NAME}: product ${product.id}, price ${price.id}.`);
console.log(
  "  Next: in the Customer Portal settings, keep quantity changes OFF, so sites are only added and removed from Studio.",
);
