/**
 * /use-cases/losing-traffic-to-ai-overviews: the page's words and data.
 *
 * A situation page, not a seat: the reader runs a SaaS blog, a store's
 * guides or a publisher, and their search clicks fell after Google started
 * answering above their results. The page's argument is the brief's: the
 * work moves from ranking to being the source an overview quotes, which is
 * what the GEO score is for. Its honest limit is the one that matters most
 * here: Rankbox can't show whether an overview cites you, so the page says
 * where to read that instead (Search Console's generative AI report, GA4).
 *
 * `persona` is what the route's head, JSON-LD and personas.test.ts read.
 * `page` holds the rest of the visitor-facing words the layout needs: the
 * sample results page in the hero, the three studies, the measurement
 * pointers, the price block and further reading.
 *
 * Studies were read at their sources on 2026-11-10:
 * - Pew Research Center, Jul 22, 2025 (8% vs 15% of visits clicked a result).
 * - Ahrefs, Feb 4, 2026 update (58% lower position-1 CTR, Dec 2025 data;
 *   34.5% in the Apr 17, 2025 original, Mar 2025 data).
 * - Seer Interactive, Nov 4, 2025 (35% higher organic CTR when cited, Q3 2025).
 * - Google Search Central, Jun 3, 2026 (Search Console generative AI
 *   performance reports; impressions only; all sites from Aug 31, 2026).
 * Re-check them quarterly, as the AI SEO guides are.
 */
import { TrendingDown } from "lucide-react";
import type { Persona } from "@/data/personas";
import { PUBLISH_PLATFORMS } from "@/data/platforms";
import { RANKBOX_PUBLISHING } from "@/data/competitors/shared";
import { PLAN, STUDIO, TRIAL_ARTICLE_CREDITS, TRIAL_NOTE, formatUsd } from "@/data/pricing";

/* How articles reach a site, from the add-on flags. While no add-on has
   shipped, the shared sentence still says "one-click", which this site no
   longer promises, so the page says it plainly instead. */
const PUBLISHING = PUBLISH_PLATFORMS.some((p) => p.addonLive)
  ? `${RANKBOX_PUBLISHING.sentence}.`
  : "Today articles reach your site through the Rankbox publishing API, which a developer sets up once. The Shopify and Webflow apps are built and waiting for store approval.";

const PRICE = formatUsd(PLAN.monthly);
const EXTRA_SITE = formatUsd(STUDIO.monthlyPerSite);

export const persona: Persona = {
  slug: "losing-traffic-to-ai-overviews",
  name: "Sites losing traffic to AI Overviews",
  nameLower: "sites losing traffic to AI Overviews",
  shortName: "Click loss",
  role: "site owner",
  group: "situation",
  icon: TrendingDown,
  tagline: "Still ranking, fewer clicks. Write to be the source the overview quotes.",

  eyebrow: "Losing traffic to Google AI Overviews",
  headline: { lead: "The answer moved", accent: "above your link" },
  subhead:
    "Google now answers many questions at the top of the page, and the blue link underneath gets fewer clicks even when it still holds position 1. Rankbox writes for what's left to win: source-backed articles shaped to be quoted, scored for AI answers before they ship, in your own voice.",
  metaTitle: "Losing Traffic to AI Overviews? Write to Be Quoted | Rankbox",
  metaDescription:
    "AI Overviews answer above your link, so it gets fewer clicks even at position 1. Rankbox writes sourced articles shaped to be quoted and scores each for GEO first.",

  shortAnswer:
    "Rankbox is an AI search content engine for sites whose search clicks fell once Google began showing AI Overviews above their results. It finds the questions buyers ask Google AI Overviews, ChatGPT, Perplexity and Gemini about your topic, writes long, source-backed articles in your brand voice with a clear answer near the top, and gives each one an SEO score and a GEO score, a grade for how ready it is to be quoted, before it ships. It can't tell you whether an overview cites you: Search Console's generative AI report and GA4 are where you read that.",

  specs: [
    { value: "GEO score", label: "on every draft, for how quotable it is, before it ships" },
    {
      value: `${PLAN.articlesPerMonth}/mo`,
      label: "source-backed articles per site, on your schedule",
    },
    { value: "2,000–3,500", label: "words an article, with its sources cited" },
    { value: "4 engines", label: "researched: AI Overviews, ChatGPT, Perplexity, Gemini" },
  ],

  handoff: {
    runsTitle: "Rankbox runs this",
    runs: [
      {
        label: "Question research",
        detail: "What buyers ask AI Overviews, ChatGPT, Perplexity and Gemini about your topic.",
      },
      {
        label: "Quotable drafts",
        detail: "Long, sourced articles with a clear answer an AI summary can lift.",
      },
      {
        label: "A GEO score first",
        detail: "Every draft graded for search and for being quoted, before it ships.",
      },
      {
        label: "Shipping to your site",
        detail: `Up to ${PLAN.articlesPerMonth} articles a month, sent through the publishing API or held as drafts.`,
      },
    ],
    keepsTitle: "You keep this",
    keeps: [
      {
        label: "Measuring it",
        detail: "Search Console and GA4. Rankbox doesn't track citations or rankings.",
      },
      {
        label: "Which pages to defend",
        detail: "You know which queries paid the bills before the clicks fell.",
      },
      {
        label: "First-hand detail",
        detail: "Your own data, cases and opinions: what a summary can't borrow from elsewhere.",
      },
      {
        label: "Your existing pages",
        detail: "Refreshes, crawling, speed and markup. Rankbox doesn't audit or edit them.",
      },
    ],
  },

  painsTitle: "What the drop looks like from inside",
  painsIntro:
    "Rankings hold. Impressions hold. The clicks fall anyway, and nothing in the report looks broken, which is what makes it so hard to explain.",
  pains: [
    {
      pain: "The page still holds position 1, and its clicks fell anyway.",
      fix: "The work moves from holding a position to writing the passage an overview lifts: a clear answer, with its sources underneath.",
    },
    {
      pain: "Google answers the easy version of the question on the results page.",
      fix: "The topic map lays out what buyers ask AI engines about your topic, so you can pick the comparisons and trade-offs a two-line summary can't settle.",
    },
    {
      pain: "Your old posts were written to rank, not to be quoted.",
      fix: "Every new article is scored for GEO before it ships: structure, headings, sourced claims, and whether a passage can stand on its own.",
    },
    {
      pain: "The content budget is being questioned because the traffic chart fell.",
      fix: `One plan, ${PRICE} a month per site, covers the research, writing, scoring and publishing. No contract, and you can cancel any time.`,
    },
  ],

  workflowTitle: "Your first month after the drop",
  workflowIntro:
    "Start where the clicks fell. You bring the Search Console list, and Rankbox brings the questions and the drafts.",
  steps: [
    {
      when: "Day 1",
      title: "Find the queries that fell",
      body: "In Search Console, compare clicks and impressions before and after. Pages that kept their impressions but lost clicks are the likeliest place an overview now answers first.",
    },
    {
      when: "Day 1",
      title: "Paste your site",
      body: "Rankbox reads it, learns your voice, and maps the questions buyers ask AI engines about your topic. Approve the ones that sit next to the queries that fell.",
    },
    {
      when: "Week 1",
      title: "Drafts arrive scored",
      body: "Each article comes with an SEO score and a GEO score. Edit it in the editor, hold it as a draft, or send it to your site.",
    },
    {
      when: "Month 1",
      title: "Read your own reports",
      body: "Search Console's generative AI report shows when your pages appear in AI Overviews and AI Mode. GA4 shows what those visitors do. Those reports are the record, not Rankbox.",
    },
  ],

  stackTitle: "What it takes off the recovery plan",
  stackIntro:
    "After a traffic drop, the usual answer is a content push staffed from several places at once.",
  stack: [
    {
      label: "Freelance writers",
      detail: "Per-article rates for the new pieces the plan calls for",
    },
    {
      label: "Question research seats",
      detail: "A tool to find what people ask AI engines about your topic",
    },
    {
      label: "An AI-answer checklist",
      detail: "Someone checking each draft for a clear answer and sources",
    },
    {
      label: "Copy-paste publishing",
      detail: "Moving drafts from a doc into the CMS, fixing formatting as you go",
    },
  ],
  stackNote: `It doesn't replace a rank tracker, an AI visibility tracker or a technical audit, because Rankbox has none of those. One plan covers ${PLAN.sites} site: ${PLAN.articlesPerMonth} articles a month, research, scoring and publishing.`,

  picksTitle: "The parts aimed at the overview",
  picksIntro:
    "The engine runs the same for every site. These four matter most when the answer sits above your link.",
  picks: [
    {
      featureSlug: "answer-space-research",
      why: "Maps what buyers ask AI Overviews, ChatGPT, Perplexity and Gemini about your topic, so you write toward questions people still need answered in full.",
    },
    {
      featureSlug: "citation-ready-writer",
      why: "Definitions, lists and sourced claims, cited inline, in the shape an AI answer can lift as a passage.",
    },
    {
      featureSlug: "seo-geo-score",
      why: "A GEO score on every draft, next to the SEO score you already know, with a fix beside every flag.",
    },
    {
      featureSlug: "brand-voice",
      why: "A summary can paraphrase anyone. The reader who still clicks wants someone specific, so the voice is set per site.",
    },
  ],

  proof: [],
  proofTitle: "Sites rebuilding after AI Overviews",

  faqs: [
    {
      q: "Can Rankbox get my site into Google's AI Overviews?",
      a: "No tool can promise that, because Google chooses the sources. Rankbox writes articles shaped to be quoted, with a clear answer and cited sources, and scores each one for that before it ships. Whether an overview uses it is Google's call.",
    },
    {
      q: "Will Rankbox show me whether AI Overviews cite me?",
      a: "No. Rankbox doesn't track citations, rankings or AI mentions. Search Console's generative AI report shows how often your pages appear in AI Overviews and AI Mode (impressions, not clicks), and GA4 shows what search visitors do on your site, plus referral visits from assistants like ChatGPT and Perplexity.",
    },
    {
      q: "Should I rewrite my old posts instead?",
      a: "For the pages that lost the most, often yes, and that stays your team's job: Rankbox writes new articles and doesn't edit pages already on your site. A sensible plan does both, refreshing the pages that paid the bills and adding articles for questions the site never answered.",
    },
    {
      q: "What does the GEO score check?",
      a: "How ready an article is to be quoted by AI answers: its structure and headings, internal links, readability, and citation-readiness, meaning a clear answer and claims backed by sources. It sits next to the SEO score, and every flag comes with a fix.",
    },
    {
      q: "How do articles reach my site?",
      a: `${PUBLISHING} You can also hold any article as a draft and publish it yourself.`,
    },
    {
      q: "Is this for SaaS, ecommerce or content sites?",
      a: `Any site whose search clicks came from questions: how-tos, comparisons and explainers on a SaaS blog, a store's buying guides, or a publisher's archive. The plan is the same for each: ${PLAN.articlesPerMonth} articles a month per site, and each extra site is ${EXTRA_SITE} a month with ${STUDIO.name}.`,
    },
  ],
  ctaTitle: "Write for the answer above your link",
  ctaBody:
    "Paste your site and see the questions buyers ask AI about your topic, before you write the next article.",

  hideFromNav: true,
};

/* ------------------------------------------------------------------ */
/* The rest of the page's words                                        */
/* ------------------------------------------------------------------ */

export interface SerpResult {
  domain: string;
  path: string;
  title: string;
  snippet: string;
  /** The reader's own page, the blue link the overview sits above. */
  yours?: boolean;
}

export interface Study {
  figure: string;
  claim: string;
  source: string;
  /** Publication date, as the source prints it. */
  date: string;
  sample: string;
  caveat?: string;
  url: string;
}

export const page = {
  /** The hero's sample results page. Every domain is a reserved .example one. */
  serp: {
    label: "Sample results page",
    query: "how do you calculate churn rate",
    overviewTitle: "AI Overview",
    /* The overview, in three parts: the passage it quotes sits in the middle. */
    overview: {
      before: "Churn rate is the share of customers who leave during a period. ",
      quoted:
        "Divide the customers you lost in the period by the customers you started it with, then multiply by 100.",
      after: " Losing 25 of 500 customers in a month is a 5% monthly churn rate.",
      bullets: [
        "Count only the customers who leave, not new sign-ups.",
        "Use the same period for both numbers.",
        "A 5% monthly rate compounds to about 46% a year.",
      ],
      more: "Show more",
    },
    quotedTag: "Quoted",
    ariaLabel:
      "Sample results page for “how do you calculate churn rate”. An AI Overview opens above your page, which still holds position 1 but now sits below the first screen, and the overview quotes a passage from one of its three sources.",
    notesTitle: "What changed on the page",
    sources: [
      { domain: "metricsbook.example", title: "Churn rate, defined" },
      { domain: "retentionlab.example", title: "The churn formula, worked" },
      { domain: "ledgerly.example", title: "Monthly vs annual churn" },
    ],
    results: [
      {
        domain: "yoursite.example",
        path: "blog › churn-rate",
        title: "How to calculate churn rate, with examples",
        snippet: "The churn formula, a worked example, and the mistakes that skew it.",
        yours: true,
      },
      {
        domain: "saasnotes.example",
        path: "guides",
        title: "Churn rate: formula and benchmarks",
        snippet: "What churn rate measures, and how teams usually report it.",
      },
      {
        domain: "growthwiki.example",
        path: "metrics › churn",
        title: "Customer churn, explained",
        snippet: "Gross churn, net churn, and when each one matters.",
      },
      {
        domain: "financedesk.example",
        path: "kpis",
        title: "The SaaS metrics every founder should track",
        snippet: "Churn, retention, expansion and payback, with formulas.",
      },
    ] satisfies SerpResult[],
    yoursTag: "Your page · position 1",
    foldLabel: "End of the first screen",
    /* What each beat of the scene shows, in order. */
    notes: [
      {
        title: "Your page holds position 1",
        body: "Before the overview, position 1 sat at the top of the first screen.",
      },
      {
        title: "The answer moves above it",
        body: "The overview answers in place. Your link still holds position 1, now below the first screen.",
      },
      {
        title: "It quotes a few sources",
        body: "One passage carries the answer. Being the source of that passage is the job now.",
      },
      {
        title: "Rankbox writes for that passage",
        body: "A new article with a clear answer, its sources cited, and a GEO score before it ships.",
      },
    ],
    draft: {
      label: "Draft",
      title: "Monthly vs annual churn: how to convert one to the other",
      lines: ["Clear answer in the opening", "6 sources cited inline", "Question headings"],
      seo: 90,
      geo: 93,
    },
  },

  evidence: {
    eyebrow: "What the studies say",
    title: "Position one, fewer clicks",
    accentWords: 2,
    intro:
      "Three independent studies, each read at its source on November 10, 2026. They describe averages across many sites. Your own Search Console describes yours.",
    studies: [
      {
        figure: "8%",
        claim:
          "of visits with an AI summary ended in a click on a regular result, against 15% of visits without one. A link inside the summary was clicked in 1% of visits that had one.",
        source: "Pew Research Center",
        date: "Jul 22, 2025",
        sample: "Browsing data from 900 U.S. adults, March 2025",
        url: "https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/",
      },
      {
        figure: "58%",
        claim:
          "lower click-through rate for the page in position 1 on keywords that show an AI Overview. Its first run, on March 2025 data, found 34.5%.",
        source: "Ahrefs",
        date: "Feb 4, 2026",
        sample: "300,000 keywords, Search Console data, December 2025 vs December 2023",
        caveat: "Reported as a correlation with an AI Overview being present.",
        url: "https://ahrefs.com/blog/ai-overviews-reduce-clicks-update/",
      },
      {
        figure: "35%",
        claim:
          "higher organic click-through rate for brands cited inside the AI Overview than for brands that weren't cited.",
        source: "Seer Interactive",
        date: "Nov 4, 2025",
        sample: "3,119 informational queries across 42 organizations, Q3 2025",
        caveat: "Seer calls it a correlation: stronger brands may simply be cited more often.",
        url: "https://www.seerinteractive.com/insights/aio-impact-on-google-ctr-september-2025-update",
      },
    ] satisfies Study[],
    note: "None of this is a forecast for your site, and Rankbox doesn't measure any of it for you.",
  },

  /* Section pills and the one title that isn't a persona field. */
  heads: {
    pains: "Inside the drop",
    picks: "Written to be quoted",
    workflow: "The first month",
    handoff: {
      eyebrow: "Who does what",
      title: "Rankbox runs the writing.",
      accent: "You keep the record.",
      intro:
        "Rankbox researches, writes, scores and ships. Whether it worked is measured by you, in the tools built to measure it.",
    },
    stack: "The recovery plan",
  },

  /* Under "You keep this": where the result is actually read. */
  measure: {
    title: "Where you read the result",
    items: [
      {
        label: "Search Console: generative AI report",
        detail:
          "Impressions for your pages in AI Overviews and AI Mode, by page, country and date. Open to all sites since Aug 31, 2026.",
        href: "https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports",
      },
      {
        label: "Google Analytics 4",
        detail:
          "What search visitors do once they land, plus referral visits from ChatGPT and Perplexity.",
      },
      {
        label: "Our guide to measuring GEO",
        detail:
          "Crawled, cited, clicked, converted, and a control test that separates your work from the noise.",
        href: "/blog/how-to-measure-geo",
      },
    ],
  },

  /* Beside the stack: what Rankbox is not, written down. */
  limits: {
    title: "What it doesn't replace",
    items: [
      "A rank tracker or an AI citation tracker",
      "A technical SEO audit, or fixes to how your site renders",
      "Refreshing the pages already on your site",
      "Outreach link building",
    ],
    /* For the pages already on the site, which Rankbox doesn't touch. */
    tool: {
      href: "/tools/ai-citation-readiness-checker",
      label: "Free: AI Citation Readiness Checker",
      detail:
        "Paste a page you already have and see how quotable it is, with a fix beside each check. It runs in your browser.",
    },
  },

  /* Who does each step of the first month, in the steps' order. */
  stepOwners: ["You", "Rankbox", "Rankbox", "You"] as const,

  price: {
    eyebrow: "Pricing",
    title: "One plan, priced per site",
    amount: PRICE,
    per: "a month per site",
    includes: [
      `${PLAN.articlesPerMonth} source-backed articles a month`,
      "Question research for AI Overviews, ChatGPT, Perplexity and Gemini",
      "An SEO score and a GEO score on every draft",
      "Publishing through the API, or drafts you publish yourself",
    ],
    rollingOut: `Rolling out on paid plans: an allowance of ${PLAN.backlinkCreditsPerMonth} backlink-exchange credits and ${PLAN.redditRepliesPerMonth} Reddit reply drafts a month, which you post yourself.`,
    trial: `The trial covers 1 site and up to ${TRIAL_ARTICLE_CREDITS} articles.`,
    studio: `Running several sites? Each extra site is ${EXTRA_SITE} a month with ${STUDIO.name}, on the same invoice, with the full plan of its own.`,
    note: TRIAL_NOTE,
  },

  faqTitle: "Questions after a traffic drop",
  reading: {
    title: "Read next",
    items: [
      {
        href: "/ai-seo/google-ai-overviews",
        label: "How Google AI Overviews and AI Mode pick the pages they cite",
      },
      {
        href: "/blog/how-to-show-up-in-google-ai-overviews",
        label: "How to show up in Google AI Overviews: the 2026 playbook",
      },
      {
        href: "/blog/zero-click-searches",
        label: "Zero-click searches: what the data shows",
      },
      {
        href: "/blog/how-to-measure-roi-from-zero-click-searches",
        label: "How to measure ROI when searches end without a click",
      },
      { href: "/glossary/ai-overviews", label: "Glossary: AI Overviews" },
    ],
  },
} as const;
