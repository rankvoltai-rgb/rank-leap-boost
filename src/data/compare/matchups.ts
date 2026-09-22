/**
 * The head-to-head index — the light half of /compare.
 *
 * The hub, the navbar, the footer and the sitemap read only this file. Each
 * page's body (rounds, matrix, pricing, FAQ) is its own chunk in ./content,
 * loaded by the route, so a visitor on one comparison never downloads the
 * others. Anything duplicated here — the per-card tally — is checked against
 * the body by compare.test.ts, so the card can't drift from the page.
 */
import { PLAN, formatUsd } from "@/data/pricing";
import { PRODUCTS, type Product, type ProductSlug } from "./products";
import type { Side } from "./types";

export type CategoryId = "content-optimization" | "ai-writers" | "ai-visibility" | "seo-suites";

export interface Category {
  id: CategoryId;
  name: string;
  /** What the buyer is shopping for, in one line. */
  blurb: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "ai-writers",
    name: "AI writers",
    blurb: "Tools that draft the article for you — and differ on how much of the rest they do.",
  },
  {
    id: "content-optimization",
    name: "Content optimization",
    blurb: "Editors that grade a draft against what already ranks, so a writer knows what to fix.",
  },
  {
    id: "ai-visibility",
    name: "AI visibility tracking",
    blurb: "Dashboards that show whether ChatGPT, Perplexity and Google's AI name your brand.",
  },
  {
    id: "seo-suites",
    name: "SEO suites",
    blurb: "The all-in-one research platforms: keywords, backlinks, audits and rank tracking.",
  },
];

export interface Matchup {
  /** Always `${a}-vs-${b}`. The reverse order redirects here. */
  slug: string;
  a: ProductSlug;
  b: ProductSlug;
  category: CategoryId;
  /** Who each one is for, in a line — the card's whole argument. */
  bestFor: Record<Side, string>;
  /** Rounds won, as on the page. Tested against the body. */
  tally: { a: number; b: number; draw: number };
  published: string;
  /** Bump only when the facts are re-checked, not for copy edits. */
  updated: string;
}

export const MATCHUPS: Matchup[] = [
  {
    slug: "surfer-seo-vs-clearscope",
    a: "surfer-seo",
    b: "clearscope",
    category: "content-optimization",
    bestFor: {
      a: "Teams that want research, writing and AI search tracking in one editor",
      b: "Teams that want unlimited writer seats and one simple content grade",
    },
    tally: { a: 4, b: 1, draw: 2 },
    published: "2026-09-21",
    updated: "2026-09-21",
  },
  {
    slug: "surfer-seo-vs-frase",
    a: "surfer-seo",
    b: "frase",
    category: "content-optimization",
    bestFor: {
      a: "Teams that want keyword research and a deep editor, and will pay for Pro",
      b: "Small teams that want drafting, publishing and AI tracking for less",
    },
    tally: { a: 1, b: 3, draw: 3 },
    published: "2026-09-21",
    updated: "2026-09-21",
  },
  {
    slug: "jasper-vs-writesonic",
    a: "jasper",
    b: "writesonic",
    category: "ai-writers",
    bestFor: {
      a: "Marketing teams producing governed, on-brand copy in every channel",
      b: "Teams that want SEO articles and AI search tracking in one tool",
    },
    tally: { a: 3, b: 4, draw: 0 },
    published: "2026-09-21",
    updated: "2026-09-21",
  },
  {
    slug: "koala-ai-vs-byword",
    a: "koala-ai",
    b: "byword",
    category: "ai-writers",
    bestFor: {
      a: "Affiliate and niche publishers who want strong drafts for less",
      b: "Teams building programmatic pages from spreadsheets, at volume",
    },
    tally: { a: 3, b: 3, draw: 1 },
    published: "2026-09-21",
    updated: "2026-09-21",
  },
  {
    slug: "profound-vs-peec-ai",
    a: "profound",
    b: "peec-ai",
    category: "ai-visibility",
    bestFor: {
      a: "Enterprise brands that want panel demand data, content agents and SOC 2",
      b: "Startups and agencies that want self-serve tracking at a published price",
    },
    tally: { a: 3, b: 3, draw: 1 },
    published: "2026-09-21",
    updated: "2026-09-21",
  },
  {
    slug: "semrush-vs-ahrefs",
    a: "semrush",
    b: "ahrefs",
    category: "seo-suites",
    bestFor: {
      a: "Teams that want daily rank and AI tracking plus local, ads and social",
      b: "SEOs who live in backlink data and want API access from $129",
    },
    tally: { a: 3, b: 2, draw: 2 },
    published: "2026-09-21",
    updated: "2026-09-21",
  },
];

export const MATCHUP_SLUGS = MATCHUPS.map((m) => m.slug);

/** The newest `updated` across every matchup — the hub's own lastmod. */
export const COMPARE_UPDATED = MATCHUPS.map((m) => m.updated)
  .sort()
  .at(-1)!;

export function getMatchup(slug: string): Matchup | undefined {
  return MATCHUPS.find((m) => m.slug === slug);
}

/**
 * "clearscope-vs-surfer-seo" is the same page as "surfer-seo-vs-clearscope".
 * Returns the canonical slug for a reversed one, so the route can redirect
 * instead of 404ing a query people type in either order.
 */
export function canonicalSlug(slug: string): string | undefined {
  const [left, right, ...rest] = slug.split("-vs-");
  if (!left || !right || rest.length) return undefined;
  return getMatchup(`${right}-vs-${left}`)?.slug;
}

export function sidesOf(m: Matchup): Record<Side, Product> {
  return { a: PRODUCTS[m.a], b: PRODUCTS[m.b] };
}

/** "Surfer SEO vs Clearscope" — the H1, the card title, the breadcrumb. */
export function matchupTitle(m: Matchup): string {
  return `${PRODUCTS[m.a].name} vs ${PRODUCTS[m.b].name}`;
}

export function getCategory(id: CategoryId): Category {
  return CATEGORIES.find((c) => c.id === id)!;
}

/**
 * The next comparisons to read: the same shortlist first (same category),
 * then anything sharing a contender, then the rest — people weighing two
 * tools are usually weighing three.
 */
export function relatedMatchups(m: Matchup, limit = 3): Matchup[] {
  const shares = (o: Matchup) => [o.a, o.b].some((p) => p === m.a || p === m.b);
  const rank = (o: Matchup) => (o.category === m.category ? 0 : shares(o) ? 1 : 2);
  return MATCHUPS.filter((o) => o.slug !== m.slug)
    .sort((x, y) => rank(x) - rank(y))
    .slice(0, limit);
}

/** Every matchup a product appears in. */
export function matchupsFor(product: ProductSlug): Matchup[] {
  return MATCHUPS.filter((m) => m.a === product || m.b === product);
}

/**
 * What Rankbox does today — the only claims the third-option panel may make.
 * Deliberately short: no citation tracking, no one-click CMS plugins, no team
 * seats, no keyword database. Add a line here only once it ships.
 */
export const RANKBOX_SHIPS = [
  "Maps the questions your buyers ask, starting from your site and category",
  "Writes long-form articles from live web research, with the sources cited",
  "Scores every draft for SEO and AI-answer readiness before it goes out",
  "Delivers finished articles on a schedule through its publishing API",
] as const;

export const RANKBOX_PRICE_LINE = `${formatUsd(PLAN.monthly)}/month for ${PLAN.articlesPerMonth} articles`;
