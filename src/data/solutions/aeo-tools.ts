/**
 * /solutions/aeo-tools — Rankbox's answer to "AEO tools": the free tools,
 * sorted by the job each one does (see ./gates), and the plan that runs the
 * jobs on autopilot. It stays commercial on purpose. The informational "what
 * are AI search optimization tools / how to compare them" angle belongs to the
 * blog, so the two don't compete for the same query.
 *
 * Competitor prices are never typed here: the route loads them from the
 * head-to-head bodies in src/data/compare, which carry the date they were
 * checked. solutions.test.ts holds the rules.
 */
import { PLAN, TRIAL_DAYS, formatUsd } from "@/data/pricing";
import { SHIPPED } from "@/data/competitors/shared";
import type { Faq } from "@/data/ai-seo/types";
import type { CategoryId } from "@/data/compare/matchups";
import type { ProductSlug } from "@/data/compare/products";
import { JOBS } from "./gates";

const price = formatUsd(PLAN.monthly);

/** Every tool the page lists, once, in job order. */
export const AEO_TOOL_SLUGS = JOBS.flatMap((j) => j.tools);
export const AEO_TOOL_COUNT = AEO_TOOL_SLUGS.length;

export const AEO = {
  slug: "aeo-tools",
  metaTitle: `AEO Tools: ${AEO_TOOL_COUNT} Free Answer Engine Optimization Tools | Rankbox`,
  metaDescription: `${AEO_TOOL_COUNT} free AEO tools, sorted by job: open your site to AI crawlers, find the questions, make answers quotable, earn mentions, and measure. Plus an autopilot.`,
  keywords: [
    "aeo tools",
    "aeo tool",
    "answer engine optimization tools",
    "aeo software",
    "free aeo tools",
  ],
  eyebrow: "Answer engine optimization tools",
  h1: { lead: "Every AEO tool", accent: "you need, in one box" },
  subhead:
    "Answer engine optimization is four jobs and a scoreboard. Here's a free tool for each, and one plan that runs the jobs every day so you don't have to.",

  toolkitTitle: "The AEO toolbox, sorted by job",
  toolkitIntro:
    "Do the jobs in this order. Each one is a gate an answer engine checks before it names you, and a later job can't make up for an earlier one.",

  landscapeTitle: "Where Rankbox sits among AEO tools",
  landscapeIntro:
    "Most AEO software does one job well. Here's what each kind covers and what it costs to start, from each vendor's own pricing page.",

  autopilotTitle: "Or let Rankbox run the box",
  autopilotIntro: `The free tools do each job once. For ${price} a month, Rankbox does the three that never finish, every day, for one site.`,

  ctaTitle: "Put your AEO on autopilot",
  ctaBody: `Connect your site and Rankbox starts answering your buyers' questions today. ${TRIAL_DAYS}-day free trial.`,
};

/**
 * The market strip: one row per kind of tool, in the order a buyer tends to
 * meet them. Categories and products come from the head-to-heads, so every
 * name here has a dated, sourced page behind it.
 */
export const LANDSCAPE: {
  category: CategoryId;
  /** What this kind of tool does for AEO, in the reader's terms. */
  job: string;
  /** The jobs from ./gates it mainly covers. */
  covers: string[];
  products: ProductSlug[];
}[] = [
  {
    category: "ai-visibility",
    job: "Run your buyer prompts through the engines and report who gets named.",
    covers: ["measured"],
    products: ["peec-ai", "profound"],
  },
  {
    category: "content-optimization",
    job: "Grade a draft against the pages that already rank, so a writer knows what to add.",
    covers: ["liftable"],
    products: ["surfer-seo", "clearscope", "frase"],
  },
  {
    category: "ai-writers",
    job: "Draft the articles; they differ on research depth and how much runs on autopilot.",
    covers: ["answered"],
    products: ["koala-ai", "byword", "writesonic", "jasper"],
  },
  {
    category: "seo-suites",
    job: "Keyword, backlink and audit data, with AI visibility tracking as an add-on or a separate toolkit.",
    covers: ["readable", "measured"],
    products: ["semrush", "ahrefs"],
  },
];

/** Which head-to-head carries each product's pricing, and on which side. */
export const PRICING_SOURCE: Record<ProductSlug, { matchup: string; side: "a" | "b" }> = {
  "surfer-seo": { matchup: "surfer-seo-vs-clearscope", side: "a" },
  clearscope: { matchup: "surfer-seo-vs-clearscope", side: "b" },
  frase: { matchup: "surfer-seo-vs-frase", side: "b" },
  jasper: { matchup: "jasper-vs-writesonic", side: "a" },
  writesonic: { matchup: "jasper-vs-writesonic", side: "b" },
  "koala-ai": { matchup: "koala-ai-vs-byword", side: "a" },
  byword: { matchup: "koala-ai-vs-byword", side: "b" },
  profound: { matchup: "profound-vs-peec-ai", side: "a" },
  "peec-ai": { matchup: "profound-vs-peec-ai", side: "b" },
  semrush: { matchup: "semrush-vs-ahrefs", side: "a" },
  ahrefs: { matchup: "semrush-vs-ahrefs", side: "b" },
};

/**
 * `cheapest` is the lowest starting price in the landscape, from the loaded
 * pricing, so the cost answer can't drift from the table above it.
 */
export function aeoFaqs(cheapest: { price: number; name: string } | null): Faq[] {
  return [
    {
      q: "What are AEO tools?",
      a: "AEO tools are software for answer engine optimization: getting your pages used as the answer by ChatGPT, Perplexity, Google AI Overviews and other AI engines. They fall into five jobs: letting AI crawlers read your site, finding the questions buyers ask, making answers easy to quote, earning mentions on other sites, and measuring whether engines name you.",
    },
    {
      q: "What are the best free AEO tools?",
      a: `Start with an AI search readiness check and a robots.txt generator to make sure AI crawlers can read you, an AI question generator to find what buyers ask, and a citation readiness checker to score drafts. Then test the answers with a prompt kit. All ${AEO_TOOL_COUNT} on this page are free.`,
    },
    {
      q: "Is Rankbox an AEO tool?",
      a: SHIPPED.citationTracking
        ? `Yes. Rankbox researches your buyers' questions, writes and scores an answer for each, earns backlinks and Reddit mentions, and tracks where AI engines cite you, for ${price} a month.`
        : `Yes. Rankbox researches your buyers' questions, writes and scores an answer for each, and earns backlinks and Reddit mentions, for ${price} a month. It doesn't track AI citations yet, so pair it with the free prompt kit or a tracker.`,
    },
    {
      q: "What's the difference between AEO tools and SEO tools?",
      a: "SEO tools measure and improve where a page ranks in a list of links. AEO tools work on whether an engine lifts your answer into its reply. The two share foundations, since most AI engines search an index before they answer, but AEO adds passage structure, crawler access for AI bots, and third-party mentions.",
    },
    {
      q: "Do I need an AEO tracker?",
      a: "Not to start. A tracker tells you how often engines name you across a prompt panel, which matters once you're doing the work and want to prove it. Before that, the free prompt kit and your analytics' AI referrals answer the first question: are you in the answers at all?",
    },
    {
      q: "How much do AEO tools cost?",
      a: `The tools on this page are free. Paid AEO software ${cheapest ? `starts around ${formatUsd(cheapest.price)} a month (${cheapest.name}) and runs` : "runs"} up to custom enterprise contracts for trackers; each vendor's starting price is listed above with the date it was checked. Rankbox is ${price} a month for one site.`,
    },
  ];
}
