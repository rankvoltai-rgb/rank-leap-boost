/**
 * Byword — an AI article writer built for bulk and programmatic SEO: queue
 * tens to thousands of articles from keywords or a spreadsheet, then publish
 * or schedule them. Checked against byword.ai on 2026-09-21. Its own pages
 * disagree on some figures (languages, Shopify), so this page only uses the
 * ones its pricing page and docs state directly.
 */
import { Search, PenLine, Send, Link2, MessageSquare, Gauge } from "lucide-react";
import { PLAN, formatUsd } from "../pricing";
import {
  RANKBOX_CELLS,
  RANKBOX_COST,
  RANKBOX_PUBLISHING,
  SHIPPED,
  notFocus,
  type Competitor,
} from "./shared";

export const byword: Competitor = {
  slug: "byword",
  name: "Byword",
  domain: "byword.ai",
  monogram: "B",
  accent: "#0369a1",
  kind: "writer",
  category: "Bulk & programmatic AI writer",
  oneLiner: "An AI article writer for bulk campaigns and programmatic pages at scale.",

  eyebrow: "Byword alternative",
  headline: { lead: "The Byword alternative", accent: "built for one site, every day" },
  subhead: `Byword is built to generate articles in bulk: campaigns of hundreds, or thousands of programmatic pages from a spreadsheet. Rankbox is built for one site that wants a researched article most days, with backlink credits and Reddit drafts, for ${formatUsd(PLAN.monthly)} a month.`,
  metaTitle: "Byword Alternative: Rankbox vs Byword (2026 Comparison)",
  metaDescription:
    "Rankbox vs Byword, checked against Byword's own pricing and docs: bulk generation versus a daily autopilot, cost per article, backlinks, and when Byword is the better buy.",

  shortAnswer: `Byword is an AI article writer built for SEO at scale: you queue campaigns of articles from keywords, titles, or a spreadsheet, generate programmatic pages from templates, then publish or schedule them to WordPress, Webflow, Ghost, HubSpot, or Medium. Its Starter plan is $99 a month for 25 articles, and plans run to 300 a month. Rankbox is a daily autopilot for one site: it plans the questions your buyers ask, writes about 30 articles a month, and includes backlink credits and Reddit reply drafts for ${formatUsd(PLAN.monthly)} a month. Choose Byword for bulk campaigns, programmatic SEO, or many client sites. Choose Rankbox for a steady article a day on one site at a lower cost per article.`,
  verdict: {
    rankbox: `A steady article a day for one site, at ${formatUsd(PLAN.monthly)} a month.`,
    them: "Bulk and programmatic generation, from 25 to 300 articles a month.",
  },

  snapshot: {
    bestFor: "Bulk campaigns and programmatic SEO",
    publishing: { state: "yes", short: "WordPress, Webflow, Ghost, HubSpot, Medium" },
    backlinks: { state: "no", short: "Not offered" },
    aiVisibility: { state: "partial", short: "Via Trakkr, a separate product" },
    keywordData: { state: "yes", short: "Volume, difficulty, CPC, trends" },
  },
  specs: [
    {
      value: formatUsd(PLAN.monthly),
      label: "a month for 30 articles; Byword's Starter is $99 for 25",
    },
    {
      value: formatUsd(RANKBOX_COST.perArticle),
      label: "per article, against Byword's $3.96 on Starter",
    },
    {
      value: `${PLAN.backlinkCreditsPerMonth}/mo`,
      label: "backlink credits through the member exchange",
    },
    { value: "Reddit", label: "reply drafts for the threads your buyers read" },
  ],

  positioning: {
    title: "A bulk engine, or a daily one",
    body: "Byword is at its best when you have a thousand pages to make. Rankbox is at its best when you have one site that should get a little better every day, and nobody to run it.",
    rankboxTitle: "Where Rankbox differs",
    rankbox: [
      `${PLAN.articlesPerMonth} articles a month for ${formatUsd(PLAN.monthly)}, about ${formatUsd(RANKBOX_COST.perArticle)} each`,
      "Plans the questions your buyers ask, then writes on your cadence",
      `${PLAN.backlinkCreditsPerMonth} backlink credits a month through the member exchange`,
      "Reddit threads found and reply drafts written for you to post",
      "Sources cited inline in every article, by default",
    ],
    themTitle: "Where Byword differs",
    them: [
      "Campaigns of 5 to 100+ articles from keywords, titles, or outlines",
      "Programmatic templates fed from CSV, Google Sheets, or Airtable",
      "Keyword explorer, competitor gaps, and Search Console opportunities",
      "Publishing to WordPress, Webflow, Ghost, HubSpot, and Medium",
      "Up to 300 articles a month, unlimited domains, and team roles",
    ],
  },

  matrix: [
    {
      group: "Finding what to write",
      icon: Search,
      rows: [
        {
          label: "Topic research",
          detail: "Does the tool decide what to write about, or do you?",
          rankbox: RANKBOX_CELLS.research,
          them: {
            state: "yes",
            note: "Campaign ideas from your domain, competitor gaps, and striking-distance queries",
          },
        },
        {
          label: "Keyword volume & difficulty",
          detail: "Knowing a topic is winnable before an article is spent on it.",
          rankbox: RANKBOX_CELLS.keywordData,
          them: { state: "yes", note: "Volume, 0–100 difficulty, CPC, and trends on paid plans" },
        },
      ],
    },
    {
      group: "Writing the article",
      icon: PenLine,
      rows: [
        {
          label: "Long-form with live research",
          detail: "Whether the draft is grounded in current pages or model memory.",
          rankbox: RANKBOX_CELLS.writer,
          them: {
            state: "yes",
            note: "1,000–3,000+ words; SERP research by default, live web research as a toggle",
          },
        },
        {
          label: "Inline source citations",
          detail: "AI engines cite pages that themselves cite sources.",
          rankbox: RANKBOX_CELLS.citations,
          them: {
            state: "yes",
            note: "Citation style is a setting: inline links, footnotes, references, or none",
          },
        },
        {
          label: "Brand voice",
          detail: "Sounding like you without an editing pass.",
          rankbox: RANKBOX_CELLS.voice,
          them: {
            state: "yes",
            note: "Voice trained from your documents or URLs, with banned and preferred terms",
          },
        },
        {
          label: "SEO score",
          detail: "A score to work against before publishing.",
          rankbox: RANKBOX_CELLS.score,
          them: { state: "yes", note: "A live score across 147 factors, graded A to F" },
        },
      ],
    },
    {
      group: "Shipping it",
      icon: Send,
      rows: [
        {
          label: "Publishes to your CMS",
          detail: "Whether content leaves the tool without a copy-paste.",
          rankbox: RANKBOX_CELLS.publish,
          them: {
            state: "yes",
            note: "WordPress, Webflow, Ghost, HubSpot, and Medium on paid plans, plus Zapier, Make, and webhooks",
          },
        },
        {
          label: "Runs on a schedule",
          detail: "Consistency is the whole game in search.",
          rankbox: RANKBOX_CELLS.autopilot,
          them: {
            state: "partial",
            note: "Spreads a batch of written articles across days; you start each campaign",
          },
        },
        {
          label: "Bulk and programmatic pages",
          detail: "Hundreds of pages from one template and a dataset.",
          rankbox: notFocus("Rankbox writes one researched article at a time"),
          them: {
            state: "yes",
            note: "Templates with variables, fed from CSV, Sheets, or Airtable, at 100–10,000+ pages",
          },
        },
      ],
    },
    {
      group: "Growing authority",
      icon: Link2,
      rows: [
        {
          label: "Backlink building",
          detail: "Links are still how search decides who to trust.",
          rankbox: RANKBOX_CELLS.backlinks,
          them: notFocus("not on its site, docs, or pricing"),
        },
        {
          label: "Reddit presence",
          detail: "AI engines lean heavily on forum discussion.",
          rankbox: RANKBOX_CELLS.reddit,
          them: notFocus(),
        },
      ],
    },
    {
      group: "Measuring AI visibility",
      icon: MessageSquare,
      rows: [
        {
          label: "AI citation tracking",
          detail: "Knowing whether ChatGPT names you when it matters.",
          rankbox: RANKBOX_CELLS.tracking,
          them: {
            state: "partial",
            note: "Through Trakkr, a separate paid product from Byword's founder; Byword users get 20% off",
          },
        },
      ],
    },
    {
      group: "Plan & team",
      icon: Gauge,
      rows: [
        {
          label: "Price for 30 articles",
          detail: "The same output, priced side by side.",
          rankbox: RANKBOX_CELLS.pricingModel,
          them: {
            state: "partial",
            note: "Starter is $99 for 25; five more at $3.50 each make about $116.50",
          },
        },
        {
          label: "Volume and sites",
          detail: "Room to grow past one site.",
          rankbox: RANKBOX_CELLS.sites,
          them: {
            state: "yes",
            note: "Up to 300 a month; 5 domains on Starter, unlimited above it",
          },
        },
        {
          label: "Team members",
          detail: "Whether a teammate can log in with you.",
          rankbox: RANKBOX_CELLS.seats,
          them: {
            state: "partial",
            note: "Starter is solo; Standard includes 3 seats with roles",
          },
        },
      ],
    },
  ],

  pricing: {
    plan: "Starter",
    monthly: 99,
    articles: 25,
    covers: "25 articles a month, solo, 5 domains, all integrations",
    caveat:
      "The nearest plan to 30 a month. Extra articles on Starter are $3.50 each, so 30 comes to about $116.50. Annual billing is $990 a year. Credits roll over and don't expire.",
    checkedOn: "2026-09-21",
    plans: [
      { name: "Starter", monthly: 99, articles: 25, note: "Solo · 5 domains" },
      { name: "Standard", monthly: 299, articles: 80, note: "3 seats · API" },
      { name: "Scale", monthly: 999, articles: 300, note: "10 seats" },
      { name: "Unlimited", monthly: 1999, articles: null, note: "Plus your own AI API costs" },
    ],
  },

  battlegroundsTitle: "Where the two actually differ",
  battlegroundsIntro:
    "Byword is the better bulk engine. These are the three places Rankbox gives you something Byword's plans don't.",
  battlegrounds: [
    {
      featureSlug: "answer-space-research",
      icon: Search,
      title: "A plan that keeps itself going",
      body: "Byword is driven by campaigns: you choose keywords or a dataset, queue a batch, and schedule it. Rankbox builds a plan of the questions your buyers ask from your own site, then writes the next one on the cadence you set, so the site keeps growing without anyone starting the next batch.",
      points: [
        "A plan of buyer questions built from your own site",
        "The next article written on your weekly cadence, up to daily",
        "Approve the plan once, not a batch at a time",
      ],
    },
    {
      featureSlug: "authority-backlinks",
      icon: Link2,
      title: "Backlinks come with the plan",
      body: `Byword's plans are about writing and publishing; link building isn't on its site. Rankbox includes ${PLAN.backlinkCreditsPerMonth} credits a month in a member exchange that places links to you inside other members' relevant articles.`,
      points: [
        `${PLAN.backlinkCreditsPerMonth} credits granted monthly on the paid plan`,
        "A link costs 1–3 credits, set by the host site's tier",
        "Credits held in escrow until the link is published and verified",
      ],
    },
    {
      featureSlug: "reddit-presence",
      icon: MessageSquare,
      title: "Reddit is part of the plan",
      body: "AI engines quote Reddit threads constantly. Byword doesn't cover Reddit. Rankbox finds the threads where your buyers are already asking, and drafts a reply for you to post under your own name.",
      points: [
        "Threads found from the searches your buyers run",
        "A reply drafted for each, written to help first",
        "You post it yourself; nothing goes out automatically",
      ],
    },
  ],

  betterWhen: [
    {
      title: "You're building hundreds or thousands of pages",
      body: "Byword's programmatic templates turn a spreadsheet into city-by-service pages, comparison grids, or glossaries at 100 to 10,000+ pages. Rankbox writes one researched article at a time and isn't built for that.",
    },
    {
      title: "You run many client sites",
      body: "Byword's Standard and Scale plans include unlimited domains, per-domain voice and publishing settings, team seats, and a Viewer role for clients. Rankbox covers one site per plan.",
    },
    {
      title: "You publish to HubSpot, Ghost, or Medium",
      body: `Byword publishes to WordPress, Webflow, Ghost, HubSpot, and Medium, exports to Notion, Google Docs, Sheets, and Airtable, and has a REST API from its Standard plan. ${RANKBOX_PUBLISHING.sentence}.`,
    },
  ],

  migration: {
    title: "Switching from Byword",
    body: "Everything you published with Byword stays on your site, and Byword's credits don't expire, so you can keep them for a bulk project while Rankbox handles the daily work.",
    steps: [
      {
        title: "Point us at your site",
        body: "Paste your URL. Rankbox reads what is already published and learns your voice from it.",
      },
      {
        title: "Approve the plan",
        body: "You get a ranked list of buyer questions built around what the site already covers. Approve the ones you want and set a cadence.",
      },
      {
        title: "Connect publishing",
        body: "A developer points your site at the Rankbox publishing API once. Then Rankbox writes on the cadence you set.",
      },
    ],
  },

  faqs: [
    {
      q: "Is Rankbox a Byword alternative?",
      a: "For a steady flow of articles on one site, yes. Byword is built for bulk: campaigns of many articles and programmatic pages from a dataset. Rankbox is built to plan and write about an article a day for one site, with backlink credits and Reddit reply drafts included.",
    },
    {
      q: "Which is cheaper, Rankbox or Byword?",
      a: `At about 30 articles a month, Rankbox: ${formatUsd(PLAN.monthly)}, about ${formatUsd(RANKBOX_COST.perArticle)} an article. Byword's Starter plan is $99 for 25 articles, with extras at $3.50, so 30 comes to about $116.50. At high volume Byword's per-article price falls, to about $3.33 on its $999 Scale plan. Prices were checked on Byword's pricing page on 21 September 2026.`,
    },
    {
      q: "Can Byword publish on a schedule?",
      a: "Yes, for batches you have already generated: it can spread a campaign's articles across days at set times. You still choose what each campaign writes. Rankbox picks the next article from your approved plan and writes it on your cadence.",
    },
    {
      q: "Does Rankbox publish to WordPress and Webflow like Byword?",
      a: `${RANKBOX_PUBLISHING.sentence}. Byword publishes to WordPress, Webflow, Ghost, HubSpot, and Medium on paid plans.`,
    },
    {
      q: "Does Byword build backlinks?",
      a: `Link building isn't part of Byword's plans. Rankbox includes ${PLAN.backlinkCreditsPerMonth} credits a month in a member exchange that places links to your site inside other members' relevant articles.`,
    },
    {
      q: "Does either track whether ChatGPT cites my brand?",
      a: SHIPPED.citationTracking
        ? "Rankbox does, across ChatGPT, Perplexity, Gemini, and Google AI Overviews. Byword connects to Trakkr, a separate paid AI visibility product."
        : "Byword connects to Trakkr, a separate paid AI visibility product from Byword's founder. Rankbox grades every article for how ready it is to be quoted by an answer engine, but live citation monitoring is not available yet.",
    },
  ],

  sources: [
    { label: "Byword pricing", url: "https://byword.ai/pricing/" },
    { label: "Byword homepage", url: "https://byword.ai/" },
    { label: "Integrations docs", url: "https://byword.ai/learn/docs/integrations/overview/" },
    { label: "Campaigns docs", url: "https://byword.ai/learn/docs/content/campaigns/" },
    { label: "Programmatic docs", url: "https://byword.ai/learn/docs/content/programmatic/" },
    { label: "Billing and credits docs", url: "https://byword.ai/learn/docs/account/billing/" },
    { label: "Team docs", url: "https://byword.ai/learn/docs/account/team/" },
  ],
  ctaTitle: "An article a day, without starting the next batch",
  ctaBody:
    "Paste your URL. Rankbox builds your content plan free, then writes your first articles on a 7-day trial.",
};
