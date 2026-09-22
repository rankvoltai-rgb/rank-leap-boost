/**
 * Koala AI — an AI SEO platform (KoalaWriter, an SEO agent, chat, images,
 * internal links) sold by words and credits rather than articles. Its default
 * writing model counts words at 2x, which is the caveat that matters most for
 * a per-article comparison. Checked against koala.sh on 2026-09-21.
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

export const koala: Competitor = {
  slug: "koala-ai",
  name: "Koala AI",
  domain: "koala.sh",
  monogram: "K",
  accent: "#3b82f6",
  kind: "writer",
  category: "AI SEO writing platform",
  oneLiner: "KoalaWriter plus an SEO agent, chat, images, and internal links, sold by the word.",

  eyebrow: "Koala AI alternative",
  headline: { lead: "The Koala AI alternative", accent: "priced by the article, not the word" },
  subhead: `Koala sells words and credits, and its default writing model counts words twice. Autopilot publishing starts on its $99 Boost plan. Rankbox is ${formatUsd(PLAN.monthly)} for 30 articles on autopilot, with backlink credits and Reddit reply drafts included.`,
  metaTitle: "Koala AI Alternative: Rankbox vs Koala AI (2026 Comparison)",
  metaDescription:
    "Rankbox vs Koala AI and KoalaWriter, checked against Koala's own pricing: words versus articles, model multipliers, autopilot, backlinks, and when Koala is the better buy.",

  shortAnswer: `Koala AI is an AI SEO platform: KoalaWriter drafts articles, an SEO agent plans from your Search Console data, and chat, images, and internal-linking tools share one subscription. It is sold by words, not articles; its $49 Professional plan includes 100,000 words and its $99 Boost plan 250,000, and the default Claude Sonnet 5 model counts words at 2x, so a 2,500-word article uses about 5,000. Scheduled autopilot publishing starts at Boost. Rankbox is ${formatUsd(PLAN.monthly)} a month for 30 articles on autopilot, and includes backlink credits and Reddit reply drafts. Choose Koala for SEO data, many languages, Amazon affiliate content, or high volume. Choose Rankbox for a fixed 30 articles a month at a fixed price.`,
  verdict: {
    rankbox: `30 articles on autopilot for ${formatUsd(PLAN.monthly)}, with nothing to meter.`,
    them: "A deep SEO toolkit and writer, metered by words and credits.",
  },

  snapshot: {
    bestFor: "SEO operators, affiliates, multilingual sites",
    publishing: { state: "yes", short: "WordPress, Shopify, Webflow, Ghost" },
    backlinks: { state: "partial", short: "Backlink analysis; no exchange" },
    aiVisibility: { state: "partial", short: "Google AI Overviews checks" },
    keywordData: { state: "yes", short: "Volume, difficulty, and Search Console" },
  },
  specs: [
    { value: "30", label: `articles for ${formatUsd(PLAN.monthly)}, whatever model writes them` },
    { value: "Autopilot", label: "on the one plan; Koala's starts at $99 Boost" },
    {
      value: `${PLAN.backlinkCreditsPerMonth}/mo`,
      label: "backlink credits through the member exchange",
    },
    { value: formatUsd(RANKBOX_COST.perArticle), label: "per article, fixed, with no word meter" },
  ],

  positioning: {
    title: "A fixed number of articles, or a toolkit metered by the word",
    body: "Koala gives an SEO operator a lot of controls and data, and meters them. Rankbox gives a founder a fixed number of finished articles a month and makes the decisions.",
    rankboxTitle: "Where Rankbox differs",
    rankbox: [
      `${PLAN.articlesPerMonth} articles a month for ${formatUsd(PLAN.monthly)}, not a word allowance`,
      "Autopilot on the one plan, writing on the cadence you set",
      `${PLAN.backlinkCreditsPerMonth} backlink credits a month through the member exchange`,
      "Reddit threads found and reply drafts written for you to post",
      "Every draft re-run against its failing SEO checks until it passes",
    ],
    themTitle: "Where Koala differs",
    them: [
      "An SEO agent that plans from your Search Console and Analytics data",
      "Keyword volume, difficulty, backlink, and SERP data built in",
      "Articles in 100+ languages, and Amazon affiliate roundups",
      "KoalaLinks: internal links and schema for pages you already have",
      "Model choice, bulk writing, and plans up to 10 million words",
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
            note: "An SEO agent finds striking-distance keywords and competitor gaps from Search Console",
          },
        },
        {
          label: "Keyword volume & difficulty",
          detail: "Knowing a topic is winnable before an article is spent on it.",
          rankbox: RANKBOX_CELLS.keywordData,
          them: {
            state: "yes",
            note: "Volumes, difficulty, SERPs, and backlinks included; lookups spend credits",
          },
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
            note: "Real-time web, news, and Scholar research; length set by number of sections",
          },
        },
        {
          label: "Inline source citations",
          detail: "AI engines cite pages that themselves cite sources.",
          rankbox: RANKBOX_CELLS.citations,
          them: { state: "yes", note: "Sources linked inline where they are used" },
        },
        {
          label: "Brand voice",
          detail: "Sounding like you without an editing pass.",
          rankbox: RANKBOX_CELLS.voice,
          them: {
            state: "yes",
            note: "Brand DNA imports your services, voice, and reviews from your site",
          },
        },
        {
          label: "SEO score in the editor",
          detail: "A score to work against before publishing.",
          rankbox: RANKBOX_CELLS.score,
          them: {
            state: "yes",
            note: "Scored against the ranking pages, from the $49 Professional plan",
          },
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
            note: "WordPress, Shopify, Webflow, and Ghost, plus signed webhooks and an API",
          },
        },
        {
          label: "Runs on a schedule",
          detail: "Consistency is the whole game in search.",
          rankbox: RANKBOX_CELLS.autopilot,
          them: {
            state: "partial",
            note: "Content Calendar Autopilot publishes approved articles on schedule, from the $99 Boost plan",
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
          them: {
            state: "partial",
            note: "Backlink audits, link gaps, and outreach targets; no exchange or placement",
          },
        },
        {
          label: "Internal linking",
          detail: "Connecting new articles to the pages you already have.",
          rankbox: {
            state: "partial",
            note: "Internal-link suggestions are part of each draft's SEO checks",
          },
          them: {
            state: "yes",
            note: "Links placed in every article, and KoalaLinks adds them to existing pages",
          },
        },
      ],
    },
    {
      group: "Community & AI visibility",
      icon: MessageSquare,
      rows: [
        {
          label: "Reddit presence",
          detail: "AI engines lean heavily on forum discussion.",
          rankbox: RANKBOX_CELLS.reddit,
          them: notFocus(),
        },
        {
          label: "AI citation tracking",
          detail: "Knowing whether AI answers name you.",
          rankbox: RANKBOX_CELLS.tracking,
          them: {
            state: "partial",
            note: "Checks whether Google AI Overviews cite your site, through the agent and MCP",
          },
        },
      ],
    },
    {
      group: "Plan & team",
      icon: Gauge,
      rows: [
        {
          label: "What you're buying",
          detail: "Whether the price maps to finished articles.",
          rankbox: RANKBOX_CELLS.pricingModel,
          them: {
            state: "partial",
            note: "Words and credits; the default model counts words at 2x, premium models at 3x",
          },
        },
        {
          label: "Volume and brands",
          detail: "Room to grow past one site.",
          rankbox: RANKBOX_CELLS.sites,
          them: { state: "yes", note: "Up to 10 million words and 75 brands on the largest plans" },
        },
        {
          label: "Team members",
          detail: "Whether a teammate can log in with you.",
          rankbox: RANKBOX_CELLS.seats,
          them: {
            state: "partial",
            note: "No separate user seats; its help center says to share the login",
          },
        },
      ],
    },
  ],

  pricing: {
    plan: "Boost",
    monthly: 99,
    articles: null,
    covers: "250,000 words and 2,500 credits a month, with Content Calendar Autopilot",
    caveat:
      "Boost is the first plan with autopilot publishing. It is sold by words: on the default Claude Sonnet 5 model words count double, so 250,000 words is about 50 articles of 2,500 words. The $49 Professional plan is about 20 on that model, without the autopilot calendar.",
    checkedOn: "2026-09-21",
    plans: [
      { name: "Starter", monthly: 25, articles: null, note: "45,000 words · about 9 articles*" },
      {
        name: "Professional",
        monthly: 49,
        articles: null,
        note: "100,000 words · about 20 articles*",
      },
      { name: "Boost", monthly: 99, articles: null, note: "250,000 words · autopilot · about 50*" },
      { name: "Growth", monthly: 179, articles: null, note: "500,000 words · 3 brands" },
      { name: "Elite", monthly: 350, articles: null, note: "1,000,000 words · 7 brands" },
      { name: "Advanced", monthly: 500, articles: null, note: "1,500,000 words · 12 brands" },
    ],
    ladderNote:
      "* Our arithmetic, not Koala's: articles of 2,500 words on the default Claude Sonnet 5 model, which counts words at 2x. Koala sells words, not articles, and larger Scale plans run to 10 million words.",
  },

  battlegroundsTitle: "Where the two actually differ",
  battlegroundsIntro:
    "Koala is the deeper toolkit. These are the three places Rankbox gives you something Koala's plans don't.",
  battlegrounds: [
    {
      featureSlug: "answer-space-research",
      icon: Search,
      title: "A number of articles, not a word budget",
      body: "Koala's plans are word allowances, and the model you write with changes how fast they go: the default counts double, the premium models triple. Rankbox is 30 articles a month for one price, written at about 2,750 words each, so the bill never depends on which model ran.",
      points: [
        `${PLAN.articlesPerMonth} articles a month for ${formatUsd(PLAN.monthly)}`,
        "No word meter and no model multiplier",
        "Autopilot included, not a higher tier",
      ],
    },
    {
      featureSlug: "authority-backlinks",
      icon: Link2,
      title: "Backlinks placed, not just found",
      body: `Koala's backlink tools audit your links and find targets for outreach you then do yourself. Rankbox runs a member exchange: ${PLAN.backlinkCreditsPerMonth} credits a month on the paid plan, spent on links placed inside other members' relevant articles.`,
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
      body: "AI engines quote Reddit threads constantly. Koala's pages don't cover Reddit. Rankbox finds the threads where your buyers are already asking, and drafts a reply for you to post under your own name.",
      points: [
        "Threads found from the searches your buyers run",
        "A reply drafted for each, written to help first",
        "You post it yourself; nothing goes out automatically",
      ],
    },
  ],

  betterWhen: [
    {
      title: "You want the SEO data and the controls",
      body: "Koala's agent plans from your Search Console and Analytics, with keyword, backlink, and SERP data built in, a choice of models, and an MCP server with dozens of SEO tools. If you like making the calls yourself, Koala gives you more to work with.",
    },
    {
      title: "You run affiliate or multilingual sites",
      body: "Koala writes Amazon product roundups from live product data, and writes in more than 100 languages with country targeting. Rankbox has no affiliate article type.",
    },
    {
      title: "You need volume, or links on pages you already have",
      body: `Koala's plans scale to millions of words and dozens of brands, and KoalaLinks adds internal links and schema to your existing pages on any CMS. ${RANKBOX_PUBLISHING.sentence}.`,
    },
  ],

  migration: {
    title: "Switching from Koala AI",
    body: "Everything you published with Koala stays on your site, and Koala says KoalaLinks' links keep working after you cancel. You can run both while you compare.",
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
      q: "Is Rankbox a Koala AI alternative?",
      a: "For writing and publishing SEO articles, yes. Koala is a broader toolkit: an SEO agent, keyword and backlink data, chat, images, and internal linking, metered by words and credits. Rankbox is a fixed number of finished articles a month on autopilot, with backlink credits and Reddit reply drafts.",
    },
    {
      q: "Which is cheaper, Rankbox or Koala AI?",
      a: `It depends on the model. Koala's $49 Professional plan includes 100,000 words; on its default Claude Sonnet 5 model, which counts words at 2x, that is about 20 articles of 2,500 words, without autopilot. Its $99 Boost plan adds autopilot and about 50 such articles. Rankbox is ${formatUsd(PLAN.monthly)} for 30 articles, about ${formatUsd(RANKBOX_COST.perArticle)} each. Prices were checked on Koala's pricing page on 21 September 2026.`,
    },
    {
      q: "Does Koala AI publish on autopilot?",
      a: "From the Boost plan up. Koala's Content Calendar Autopilot writes and publishes the articles you approve on their scheduled dates. On lower plans, bulk-written articles upload as drafts. Rankbox writes on your cadence on its one plan.",
    },
    {
      q: "Does Rankbox publish to WordPress and Shopify like Koala?",
      a: `${RANKBOX_PUBLISHING.sentence}. Koala publishes natively to WordPress, Shopify, Webflow, and Ghost, and supports signed webhooks and an API.`,
    },
    {
      q: "Does Koala build backlinks?",
      a: `Koala analyses backlinks: audits, gaps against competitors, broken-link reclamation, and outreach targets. It does not place links. Rankbox includes ${PLAN.backlinkCreditsPerMonth} credits a month in a member exchange that places links inside other members' relevant articles.`,
    },
    {
      q: "Does either track whether AI engines cite my brand?",
      a: SHIPPED.citationTracking
        ? "Rankbox tracks ChatGPT, Perplexity, Gemini, and Google AI Overviews. Koala checks whether Google AI Overviews cite your site."
        : "Partly, on both. Koala can check whether Google AI Overviews cite your site. Rankbox grades every article for how ready it is to be quoted by an answer engine, but live citation monitoring is not available yet.",
    },
  ],

  sources: [
    { label: "Koala AI pricing", url: "https://koala.sh/pricing" },
    { label: "Koala AI homepage", url: "https://koala.sh/" },
    { label: "SEO agent", url: "https://koala.sh/seo-agent" },
    { label: "Plans and Brand DNA (Koala blog)", url: "https://koala.sh/blog/brand-dna-plans" },
    { label: "Built-in integrations", url: "https://koala.sh/features/built-in-integrations" },
    { label: "MCP server", url: "https://koala.sh/mcp" },
    { label: "Changelog", url: "https://koala.sh/changelog" },
  ],
  ctaTitle: "30 articles a month, with nothing to meter",
  ctaBody:
    "Paste your URL. Rankbox builds your content plan free, then writes your first articles on a 7-day trial.",
};
