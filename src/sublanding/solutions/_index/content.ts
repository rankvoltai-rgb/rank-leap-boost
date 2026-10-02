/**
 * Every word on the /solutions hub. The list of pages itself is not here: it
 * comes from SOLUTIONS in src/data/solutions, so a page appears on the hub
 * the day it is wired into the registry.
 */
import {
  PLAN,
  PRICE,
  PRICE_MONTHLY,
  PUBLISHING_TODAY,
  TRIAL,
  TRIAL_ARTICLE_CREDITS,
  TRIAL_TERMS,
} from "@/sublanding/_shared/facts";
import type { HubGroup } from "./model";

export const META = {
  query: "solutions",
  title: "Rankbox Solutions: Find the Page for Your Problem",
  description:
    "Every live Rankbox solutions page in one index. Find the problem closest to yours, see how Rankbox handles it, or start from a feature, a role or a free tool.",
  h1: "Rankbox solutions, one page per problem",
  keywords: [
    "solutions",
    "Rankbox solutions",
    "AI search solutions",
    "AI SEO solutions",
    "GEO solutions",
  ],
};

export const OUTLINE = [
  { id: "index", h2: "Every solutions page, in one list" },
  { id: "other-ways", h2: "Other ways into Rankbox" },
  { id: "plan", h2: "One product and one plan behind every page" },
  { id: "faq", h2: "Questions about the solutions pages" },
] as const;

type SectionId = (typeof OUTLINE)[number]["id"];

/** The H2 for a section, exactly as OUTLINE lists it. */
export function h2(id: SectionId): string {
  return OUTLINE.find((s) => s.id === id)!.h2;
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export const HERO = {
  crumbHome: "Home",
  crumbHere: "Solutions",
  lede: "Each solutions page starts from a problem people search for and shows what Rankbox does about it. They all describe the same product on the same plan, so pick the problem that sounds most like yours.",
};

/* ------------------------------------------------------------------ */
/* The switchboard                                                     */
/* ------------------------------------------------------------------ */

export const GROUPS: Record<
  HubGroup,
  { label: string; chip: string; line: string; searchWords: string }
> = {
  job: {
    label: "By job",
    chip: "Job",
    line: "Start from the work you want done.",
    searchWords: "job task goal",
  },
  platform: {
    label: "By platform",
    chip: "Platform",
    line: "Start from where your site is built, or the engine you want to reach.",
    searchWords: "platform cms engine",
  },
  industry: {
    label: "By industry",
    chip: "Industry",
    line: "Start from the business you run and the rules it works under.",
    searchWords: "industry business sector",
  },
  alternative: {
    label: "Against another option",
    chip: "Comparison",
    line: "Start from the tool or agency you're weighing Rankbox against.",
    searchWords: "alternative comparison versus",
  },
  tracker: {
    label: "Measuring AI answers",
    chip: "Measuring",
    line: "Start from finding out where AI answers name your brand.",
    searchWords: "tracker measure",
  },
};

export const BOARD = {
  checked: "Last checked",
  allChip: "All",
  filterLabel: "Show one group",
  searchLabel: "Search the solutions pages",
  searchPlaceholder: "Search solutions",
  searchKey: "/",
  clear: "Clear search",
  showing: (shown: number, total: number) => `Showing ${shown} of ${total}`,
  emptyTitle: (q: string) => (q ? `Nothing matches "${q}"` : "Nothing in this group yet"),
  emptyBody: "Try a shorter word, or start from one of the other ways in below.",
  emptyReset: "Show every page",
  noneLive: "No solutions pages are live yet.",
  footer: "Not on the list?",
  footerLink: "See the other ways in",
};

/* ------------------------------------------------------------------ */
/* Other ways in                                                       */
/* ------------------------------------------------------------------ */

export const OTHER_WAYS = {
  intro:
    "The solutions pages start from a problem. These sections start from somewhere else, so if you think in features, roles or tools, one of them will fit better.",
  fromHead: "If you're starting from",
  toHead: "Go to",
  routes: [
    {
      to: "/features",
      label: "Features",
      from: "A part of the product",
      line: "Research, writing, scoring and publishing, each on its own page.",
    },
    {
      to: "/use-cases",
      label: "Use cases",
      from: "Your role or your kind of business",
      line: "The whole product explained for the seat you sit in.",
    },
    {
      to: "/tools",
      label: "Free tools",
      from: "A quick check you can run right now",
      line: "Generators and checkers for Google and AI search, with no signup.",
    },
    {
      to: "/alternatives",
      label: "Alternatives",
      from: "A tool you already use or are weighing up",
      line: "Rankbox side by side with the tools it gets compared to, sourced and dated.",
    },
    {
      to: "/integrations",
      label: "Integrations",
      from: "The platform your site runs on",
      line: "Where Rankbox fits with your site builder and the AI tools you work in.",
    },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* One plan                                                            */
/* ------------------------------------------------------------------ */

export const PLAN_BAND = {
  body: `Whichever page brought you here, you get the same Rankbox. It finds the questions your buyers ask AI, writes cited answer articles for them, scores each one for SEO and GEO, and hands them to your site.`,
  allowances: [
    { value: String(PLAN.articlesPerMonth), unit: "articles a month" },
    { value: String(PLAN.backlinkCreditsPerMonth), unit: "backlink credits a month" },
    { value: String(PLAN.redditRepliesPerMonth), unit: "Reddit reply drafts a month" },
  ],
  allowancesLabel: "Included each month",
  trialNote: `The trial includes ${TRIAL_ARTICLE_CREDITS} articles. Backlink credits and Reddit drafts start with the first paid month.`,
  publishing: `${PUBLISHING_TODAY}.`,
  price: PRICE,
  per: "a month, for one site",
  cta: `Start the ${TRIAL}`,
  terms: TRIAL_TERMS,
  pricingLink: "See what the plan includes",
};

/* ------------------------------------------------------------------ */
/* Questions                                                           */
/* ------------------------------------------------------------------ */

export interface HubFaq {
  q: string;
  a: string;
  /** An onward link shown under the visible answer (not in JSON-LD). */
  link?: { to: string; label: string };
}

export const FAQS: HubFaq[] = [
  {
    q: "What is a Rankbox solutions page?",
    a: "A page that starts from one problem people search for by name, such as getting a brand named in AI answers, and explains how Rankbox handles it and what it costs. This index lists every one that is live.",
  },
  {
    q: "How are solutions different from features and use cases?",
    a: "A feature page explains one part of the product, like research or scoring. A use-case page explains the whole product for one role or kind of business. A solutions page starts from the problem you searched for and shows which parts of Rankbox deal with it.",
    link: { to: "/features", label: "Browse the features" },
  },
  {
    q: "Do different solutions come with different plans?",
    a: `No. Every page describes the same Rankbox on one plan, ${PRICE_MONTHLY} for one site, with a ${TRIAL}. Signing up and building your content plan cost nothing; the card comes in when the trial starts.`,
    link: { to: "/pricing", label: "See pricing" },
  },
  {
    q: "Why isn't my platform or industry listed here?",
    a: "This index only shows pages that are live, and a page goes live once its facts have been researched and checked. Until there is one for you, the integrations pages cover site platforms and AI tools, and the use-case pages cover the main kinds of business.",
    link: { to: "/use-cases", label: "See the use cases" },
  },
  {
    q: "Can Rankbox tell me whether ChatGPT or Perplexity cites my site?",
    a: "Not today. Rankbox doesn't track citations, rankings or mentions in AI engines, so none of these pages offers that. What it does is build the answer pages engines quote. To check the basics yourself, the free AI Search Readiness Check tests whether AI crawlers can reach and read a page.",
    link: { to: "/tools/ai-search-readiness-check", label: "Run the readiness check" },
  },
  {
    q: "How does a new solutions page get onto this list?",
    a: "The hub reads the same list the sitemap and footer read, so a page shows up here the day it is published, in the group it belongs to. The date on the panel is when the facts on these pages were last checked.",
  },
];

/* ------------------------------------------------------------------ */
/* Structured data                                                     */
/* ------------------------------------------------------------------ */

/** What Rankbox does, for SoftwareApplication.featureList. Shipped only. */
export const FEATURE_LIST = [
  "Research into the questions buyers ask AI engines and search",
  `${PLAN.articlesPerMonth} cited answer articles a month`,
  "SEO and GEO scoring for every article",
  "Articles written in your brand voice",
  "Delivery through the Rankbox publishing API",
  "Backlink exchange credits on paid plans",
  "Reddit reply drafts on paid plans",
  "Free SEO and AI search tools",
];

export const LIST_NAME = "Rankbox solutions pages";
