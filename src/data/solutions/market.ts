/**
 * Competitor starting prices for the /solutions pages, read from the
 * head-to-head bodies rather than typed again. Each body is its own chunk, so
 * the route loader pulls only the matchups it names.
 */
import { loadEntry } from "@/data/compare/entries";
import { PRODUCTS, type ProductSlug } from "@/data/compare/products";
import { entryPrice } from "@/data/compare/starting-price";
import { PRICING_SOURCE } from "./aeo-tools";

export interface PricedProduct {
  slug: ProductSlug;
  name: string;
  domain: string;
  kind: string;
  /** Cheapest brand plan; null when every brand plan is quote-only. */
  from: { monthly: number; annual?: number } | null;
  trial: string;
  /** Their pricing page. */
  url: string;
  /** ISO date their pricing page was last read. */
  checkedOn: string;
  /** The head-to-head the facts come from. */
  matchup: string;
}

export async function loadPricing(
  slugs: readonly ProductSlug[],
): Promise<Record<string, PricedProduct>> {
  const matchups = [...new Set(slugs.map((s) => PRICING_SOURCE[s].matchup))];
  const entries = new Map(
    await Promise.all(matchups.map(async (m) => [m, await loadEntry(m)] as const)),
  );
  const out: Record<string, PricedProduct> = {};
  for (const slug of slugs) {
    const { matchup, side } = PRICING_SOURCE[slug];
    const entry = entries.get(matchup)!;
    const pricing = entry.pricing[side];
    const p = PRODUCTS[slug];
    out[slug] = {
      slug,
      name: p.name,
      domain: p.domain,
      kind: p.kind,
      from: entryPrice(pricing),
      trial: pricing.trial,
      url: pricing.url,
      checkedOn: entry.pricing.checkedOn,
      matchup,
    };
  }
  return out;
}

/** The lowest starting price among the loaded products, for the cost FAQ. */
export function cheapestOf(
  priced: Record<string, PricedProduct>,
): { price: number; name: string } | null {
  let best: { price: number; name: string } | null = null;
  for (const p of Object.values(priced)) {
    if (p.from && (!best || p.from.monthly < best.price)) {
      best = { price: p.from.monthly, name: p.name };
    }
  }
  return best;
}
