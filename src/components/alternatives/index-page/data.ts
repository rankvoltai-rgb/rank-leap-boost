/**
 * Everything the /alternatives hub shows, derived from the comparison data so
 * the hub can never disagree with the pages it lists. The copy here is the
 * hub's own, carried over word for word from the page it replaces.
 */
import {
  COMPETITORS,
  KIND_LABEL,
  RANKBOX_COST,
  RANKBOX_SNAPSHOT,
  SHIPPED,
  costPerArticle,
  type Competitor,
  type CompetitorKind,
  type Fact,
} from "@/data/alternatives";
import { PLAN, formatUsd } from "@/data/pricing";

/** The claim the index makes, once, rather than on every card. */
export const PILLARS = [
  {
    title: "Every row, not the flattering ones",
    body: "Each comparison asks the same questions of both products, including the rows Rankbox loses and the features it hasn't shipped yet.",
  },
  {
    title: "Checked, dated, and sourced",
    body: "Every competitor fact comes from their own pricing page or docs, carries the date we read it, and links to where it came from.",
  },
  {
    title: "When to pick them instead",
    body: "Every page says where the other tool is genuinely the better buy. We'd rather you picked right than churned in a month.",
  },
];

/** Kinds in the order the hub lists them: closest to Rankbox first. */
export const KIND_ORDER: CompetitorKind[] = ["autopilot", "writer", "optimizer", "visibility"];

export const KIND_GROUPS = KIND_ORDER.map((kind) => ({
  kind,
  label: KIND_LABEL[kind],
  items: COMPETITORS.filter((c) => c.kind === kind),
})).filter((g) => g.items.length > 0);

/* ---------- the field, one row per tool ---------- */

export interface FieldRow {
  key: string;
  name: string;
  /** Null for Rankbox, which has no comparison page of its own. */
  competitor: Competitor | null;
  kind: CompetitorKind;
  bestFor: string;
  monthly: number;
  price: string;
  plan: string;
  /** Null where the plan is not sold by the article. */
  each: number | null;
  perArticle: string;
  publishing: Fact;
  backlinks: Fact;
  aiVisibility: Fact;
  us?: boolean;
}

export const NOT_PER_ARTICLE = "Not per article";

const RANKBOX_ROW: FieldRow = {
  key: "rankbox",
  name: "Rankbox",
  competitor: null,
  kind: "autopilot",
  bestFor: RANKBOX_SNAPSHOT.bestFor,
  monthly: PLAN.monthly,
  price: `${formatUsd(PLAN.monthly)}/mo`,
  plan: `${PLAN.name} · ${PLAN.articlesPerMonth} articles`,
  each: RANKBOX_COST.perArticle,
  perArticle: formatUsd(RANKBOX_COST.perArticle),
  publishing: RANKBOX_SNAPSHOT.publishing,
  backlinks: RANKBOX_SNAPSHOT.backlinks,
  aiVisibility: RANKBOX_SNAPSHOT.aiVisibility,
  us: true,
};

export const FIELD_ROWS: FieldRow[] = [
  RANKBOX_ROW,
  ...COMPETITORS.map((c): FieldRow => {
    const each = costPerArticle(c);
    return {
      key: c.slug,
      name: c.name,
      competitor: c,
      kind: c.kind,
      bestFor: c.snapshot.bestFor,
      monthly: c.pricing.monthly,
      price: `${formatUsd(c.pricing.monthly)}/mo`,
      plan: c.pricing.articles
        ? `${c.pricing.plan} · ${c.pricing.articles} articles`
        : c.pricing.plan,
      each,
      perArticle: each !== null ? formatUsd(each) : NOT_PER_ARTICLE,
      publishing: c.snapshot.publishing,
      backlinks: c.snapshot.backlinks,
      aiVisibility: c.snapshot.aiVisibility,
    };
  }),
];

/* ---------- which one fits ---------- */

export interface Fit {
  need: string;
  picks: string[];
  /** Rankbox belongs in the answer. */
  rankbox?: boolean;
}

/* The honest routing table, and the thing most "best tools" roundups won't
   print: which of the others to buy for each job. Rankbox appears only where
   it is actually the answer, and joins the tracking row when tracking ships. */
export const FITS: Fit[] = [
  { need: "30 articles a month on one site, at the lowest cost", picks: [], rankbox: true },
  {
    need: "Native publishing to Shopify, Wix, or Webflow today",
    picks: ["outrank", "rankpill", "seobot"],
  },
  {
    need: "Tracking whether AI engines cite you",
    picks: ["frase", "writesonic"],
    rankbox: SHIPPED.citationTracking,
  },
  { need: "Hundreds of articles, or programmatic pages", picks: ["byword", "seobot"] },
  { need: "SEO data, affiliate roundups, or many languages", picks: ["koala-ai", "outrank"] },
  { need: "Writers who hand-edit drafts against the SERP", picks: ["surfer-seo", "frase"] },
  { need: "Copy for ads, email, and social, not just articles", picks: ["jasper"] },
];

/* ---------- comparison cards ---------- */

/** The rows where the two genuinely differ, drawn from the competitor's own matrix. */
export function differences(c: Competitor, limit = 3) {
  return c.matrix
    .flatMap((g) => g.rows)
    .filter((r) => r.rankbox.state !== r.them.state)
    .slice(0, limit);
}
