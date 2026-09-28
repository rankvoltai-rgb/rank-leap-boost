import type { Plan, ProductPricing } from "./types";

/**
 * The "Starts at" price for a brand: the cheapest paid plan that isn't sold to
 * agencies. A free tier isn't a starting price (the trial line says so), and
 * null means every brand plan is quote-only. The head-to-heads and the
 * /solutions pages both read this, so they can't quote a product differently.
 */
export function entryPrice(p: ProductPricing): { monthly: number; annual?: number } | null {
  const priced = p.plans.filter(
    (pl): pl is Plan & { monthly: number } =>
      pl.monthly !== null && pl.monthly > 0 && !pl.forAgencies,
  );
  if (priced.length === 0) return null;
  const cheapest = priced.reduce((x, y) => (y.monthly < x.monthly ? y : x));
  return { monthly: cheapest.monthly, annual: cheapest.annual };
}
