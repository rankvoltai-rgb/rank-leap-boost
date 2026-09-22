/**
 * Frase — rebuilt in February 2026 as "the content operating system for AI
 * search": research, an SEO/GEO/EEAT editor, an agent that writes and
 * publishes, and daily AI-citation tracking. Much closer to Rankbox than the
 * old optimization editor was, and ahead of it on tracking, which this page
 * says plainly. Checked against frase.io and docs.frase.io on 2026-09-21.
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

export const frase: Competitor = {
  slug: "frase",
  name: "Frase",
  domain: "frase.io",
  monogram: "F",
  accent: "#28a05f",
  kind: "optimizer",
  category: "SEO & GEO content platform",
  oneLiner: "Research, an SEO and GEO editor, an AI agent, and AI citation tracking.",

  eyebrow: "Frase alternative",
  headline: { lead: "The Frase alternative", accent: "with backlinks and Reddit built in" },
  subhead: `Frase is now an all-in-one for AI search: research, an SEO and GEO editor, an agent that writes and publishes, and daily citation tracking. Rankbox does less, costs less per article, and adds the off-page work: backlink credits and Reddit reply drafts, for ${formatUsd(PLAN.monthly)} a month.`,
  metaTitle: "Frase Alternative: Rankbox vs Frase (2026 Comparison)",
  metaDescription:
    "Rankbox vs the new Frase, checked against Frase's own pricing and docs: cost per article, SEO and GEO scoring, AI citation tracking, backlinks, and when Frase is the better buy.",

  shortAnswer: `Frase is an SEO and GEO content platform: it researches topics and questions, scores drafts for SEO, GEO, and EEAT in its editor, writes and publishes through an AI agent, and tracks how often AI engines cite you. Its Starter plan is $49 a month for 10 articles and tracking in ChatGPT and Google AI; Professional is $129 for 40 articles and adds Perplexity. Rankbox is ${formatUsd(PLAN.monthly)} a month for 30 articles on autopilot, about ${formatUsd(RANKBOX_COST.perArticle)} each, and adds a backlink exchange and Reddit reply drafts that Frase doesn't offer. Choose Frase if you edit your own content or need AI citation tracking today. Choose Rankbox for more finished articles per dollar, plus off-page authority.`,
  verdict: {
    rankbox: `30 articles on autopilot, backlinks, and Reddit, for ${formatUsd(PLAN.monthly)}.`,
    them: "Research, editor, agent, and citation tracking, for teams who edit.",
  },

  snapshot: {
    bestFor: "Teams who edit, and want tracking",
    publishing: { state: "yes", short: "WordPress, Webflow, Sanity, Wix" },
    backlinks: { state: "partial", short: "Research and outreach drafts only" },
    aiVisibility: { state: "yes", short: "Daily, 2–5 engines by plan" },
    keywordData: { state: "yes", short: "Volume, difficulty, and intent" },
  },
  specs: [
    {
      value: "30",
      label: `articles for ${formatUsd(PLAN.monthly)}; Frase's $49 Starter covers 10`,
    },
    {
      value: formatUsd(RANKBOX_COST.perArticle),
      label: "per article, against Frase's $3.23 on Professional",
    },
    {
      value: `${PLAN.backlinkCreditsPerMonth}/mo`,
      label: "backlink credits placed through the member exchange",
    },
    { value: "Reddit", label: "reply drafts for the threads your buyers read" },
  ],

  positioning: {
    title: "Frase closes the on-page loop. Rankbox adds the off-page one.",
    body: "The new Frase covers research, writing, scoring, publishing, and tracking, with a person approving along the way. Rankbox covers fewer of those, runs them for you, and adds the links and forum presence that decide who gets trusted.",
    rankboxTitle: "Where Rankbox differs",
    rankbox: [
      `${PLAN.articlesPerMonth} articles a month for ${formatUsd(PLAN.monthly)}, about ${formatUsd(RANKBOX_COST.perArticle)} each`,
      `${PLAN.backlinkCreditsPerMonth} backlink credits a month through the member exchange`,
      "Reddit threads found and reply drafts written for you to post",
      "Autopilot on the one plan, writing on your cadence",
      "Every draft re-run against its failing SEO checks until it passes",
    ],
    themTitle: "Where Frase differs",
    them: [
      "Daily AI citation tracking, from ChatGPT and Google AI up to five engines",
      "An editor that scores SEO, GEO, and EEAT from 0 to 100",
      "Question research from People Also Ask, Reddit, Quora, and AI answers",
      "Content Guard: finds ranking decay and drafts the fix",
      "Several sites and seats per plan, 70+ languages, API, MCP, and CLI",
    ],
  },

  matrix: [
    {
      group: "Finding what to write",
      icon: Search,
      rows: [
        {
          label: "Topic and question research",
          detail: "Does the tool decide what to write about, or do you?",
          rankbox: RANKBOX_CELLS.research,
          them: {
            state: "yes",
            note: "SERP briefs plus questions from People Also Ask, Reddit, Quora, and answer engines",
          },
        },
        {
          label: "Keyword volume & difficulty",
          detail: "Knowing a topic is winnable before an article is spent on it.",
          rankbox: RANKBOX_CELLS.keywordData,
          them: {
            state: "yes",
            note: "Volume, difficulty, coverage, and intent in its research flow",
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
            note: "Writes from its research brief; length guidance adapts to the content type",
          },
        },
        {
          label: "Inline source citations",
          detail: "AI engines cite pages that themselves cite sources.",
          rankbox: RANKBOX_CELLS.citations,
          them: {
            state: "yes",
            note: "Cites research sources inline, filters by authority, never links competitors",
          },
        },
        {
          label: "Brand voice",
          detail: "Sounding like you without an editing pass.",
          rankbox: RANKBOX_CELLS.voice,
          them: { state: "yes", note: "Brand Hub voice profiles, generated from your site" },
        },
        {
          label: "SEO and GEO scoring",
          detail: "Whether a page is shaped to rank and to be quoted.",
          rankbox: RANKBOX_CELLS.score,
          them: {
            state: "yes",
            note: "SEO, GEO, and EEAT scores from 0 to 100, against the ranking pages",
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
            note: "WordPress, Webflow, Sanity, and Wix, or hosted on FraseCMS",
          },
        },
        {
          label: "Runs on a schedule",
          detail: "Consistency is the whole game in search.",
          rankbox: RANKBOX_CELLS.autopilot,
          them: {
            state: "partial",
            note: "Content calendar from Professional; publishing without review is switched on per content type",
          },
        },
        {
          label: "Refreshes old articles",
          detail: "Pages that slip get fixed before they fall away.",
          rankbox: notFocus("Rankbox writes new articles"),
          them: {
            state: "yes",
            note: "Content Guard spots ranking decay and drafts the fix for approval",
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
            note: "Gap scans, prospect scoring, and drafted outreach; Frase says it doesn't build or buy links",
          },
        },
        {
          label: "Reddit presence",
          detail: "AI engines lean heavily on forum discussion.",
          rankbox: RANKBOX_CELLS.reddit,
          them: {
            state: "partial",
            note: "Reddit questions feed its research; it doesn't draft replies",
          },
        },
      ],
    },
    {
      group: "Measuring AI visibility",
      icon: MessageSquare,
      rows: [
        {
          label: "AI citation tracking",
          detail: "Knowing whether AI answers name you when it matters.",
          rankbox: RANKBOX_CELLS.tracking,
          them: {
            state: "yes",
            note: "Daily tracking: ChatGPT and Google AI on Starter, Perplexity on Professional, Claude and Gemini on Scale",
          },
        },
        {
          label: "Share-of-answer reporting",
          detail: "How often you appear versus your competitors.",
          rankbox: RANKBOX_CELLS.shareOfAnswer,
          them: {
            state: "yes",
            note: "Cited URLs and positions per prompt, benchmarked against an industry median",
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
            note: "Starter covers 10; 30 a month means Professional at $129 for 40",
          },
        },
        {
          label: "Sites and seats",
          detail: "Room to grow past one site and one person.",
          rankbox: RANKBOX_CELLS.seats,
          them: {
            state: "yes",
            note: "Professional: 5 sites and 3 seats; Scale: 10 sites and 5 seats",
          },
        },
      ],
    },
  ],

  pricing: {
    plan: "Professional",
    monthly: 129,
    articles: 40,
    covers: "40 articles, 5 sites, 3 seats, tracking in 3 AI engines",
    caveat:
      "Starter at $49 covers 10 articles and one site, so 30 a month means Professional. Yearly billing brings it to $103 a month. The plan includes AI citation tracking, which Rankbox's doesn't yet.",
    checkedOn: "2026-09-21",
    plans: [
      {
        name: "Starter",
        monthly: 49,
        articles: 10,
        note: "1 site · ChatGPT and Google AI tracked",
      },
      {
        name: "Professional",
        monthly: 129,
        articles: 40,
        note: "5 sites · 3 seats · adds Perplexity",
      },
      {
        name: "Scale",
        monthly: 299,
        articles: 100,
        note: "10 sites · 5 seats · adds Claude, Gemini",
      },
      { name: "Enterprise", monthly: null, articles: null, note: "Custom" },
    ],
  },

  battlegroundsTitle: "Where the two actually differ",
  battlegroundsIntro:
    "Frase is ahead on tracking and editing. These are the three places Rankbox gives you something Frase's plans don't.",
  battlegrounds: [
    {
      featureSlug: "authority-backlinks",
      icon: Link2,
      title: "Links placed, not just prospected",
      body: `Frase's backlink tools scan your gaps, score prospects, and draft outreach, and it says plainly that it doesn't build or buy links. Rankbox runs a member exchange: ${PLAN.backlinkCreditsPerMonth} credits a month on the paid plan, spent on links placed inside other members' relevant articles.`,
      points: [
        `${PLAN.backlinkCreditsPerMonth} credits granted monthly on the paid plan`,
        "A link costs 1–3 credits, set by the host site's tier",
        "Credits held in escrow until the link is published and verified",
      ],
    },
    {
      featureSlug: "reddit-presence",
      icon: MessageSquare,
      title: "Reddit replies, not just Reddit research",
      body: "Frase reads Reddit to find the questions people ask. Rankbox goes one step further: it finds the threads where your buyers are asking now, and drafts a reply in your voice for you to post under your own name.",
      points: [
        "Threads found from the searches your buyers run",
        "A reply drafted for each, written to help first",
        "You post it yourself; nothing goes out automatically",
      ],
    },
    {
      featureSlug: "citation-ready-writer",
      icon: PenLine,
      title: "Three times the articles for the Starter price",
      body: `Frase's $49 Starter plan covers 10 articles on one site. Rankbox is ${formatUsd(PLAN.monthly)} for 30, each about 2,750 words, researched from the pages ranking now, and written to be quoted: a direct answer, key takeaways, cited sources, and an FAQ.`,
      points: [
        `${PLAN.articlesPerMonth} articles a month on the one plan`,
        "About 2,750 words by default, from live research",
        "Sources cited inline and listed in a References section",
      ],
    },
  ],

  betterWhen: [
    {
      title: "You need AI citation tracking now",
      body: SHIPPED.citationTracking
        ? "Frase tracks prompts daily across up to five engines, with cited URLs, positions, and an industry benchmark. Rankbox tracks four; compare the engines and prompt counts you need."
        : "Frase tracks your prompts daily in ChatGPT and Google AI from its Starter plan, and in up to five engines on Scale, with cited URLs and positions. Rankbox doesn't monitor citations yet.",
    },
    {
      title: "Your team writes and edits",
      body: "Frase's editor scores SEO, GEO, and EEAT live, lets writers approve facts and sources in the brief, and splits drafting between a person and the agent. If people on your team write, Frase supports them better.",
    },
    {
      title: "You're protecting a large existing library",
      body: `Frase audits up to 1,000 pages a month, spots ranking decay, and drafts the fix, across several sites and seats. It publishes to WordPress, Webflow, Sanity, and Wix. ${RANKBOX_PUBLISHING.sentence}.`,
    },
  ],

  migration: {
    title: "Running Rankbox alongside Frase",
    body: "Plenty of teams could run both: Frase for editing and tracking, Rankbox for the daily articles and the off-page work. Nothing you published with Frase needs to move.",
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
        title: "Compare in Frase",
        body: "Open a Rankbox article in Frase's editor and see how it scores. Keep whichever setup earns its price.",
      },
    ],
  },

  faqs: [
    {
      q: "Is Rankbox a Frase alternative?",
      a: "Partly. Both research, write, score, and publish articles. Frase also tracks AI citations and gives editors a live SEO, GEO, and EEAT score. Rankbox writes more articles for the money on autopilot, and adds a backlink exchange and Reddit reply drafts that Frase doesn't offer.",
    },
    {
      q: "Which is cheaper, Rankbox or Frase?",
      a: `Per article, Rankbox: ${formatUsd(PLAN.monthly)} for 30, about ${formatUsd(RANKBOX_COST.perArticle)} each. Frase's Starter plan is $49 for 10 articles, about $4.90 each, and Professional is $129 for 40, about $3.23 each. Frase's plans include AI citation tracking, so compare what you would use. Prices were checked on Frase's pricing page on 21 September 2026.`,
    },
    {
      q: "Does Frase track AI citations?",
      a: "Yes. Frase tracks your prompts daily in ChatGPT and Google AI on Starter, adds Perplexity on Professional, and adds Claude and Gemini on Scale, showing which URLs are cited and where.",
    },
    {
      q: "Does Rankbox track AI citations?",
      a: SHIPPED.citationTracking
        ? "Yes, across ChatGPT, Perplexity, Gemini, and Google AI Overviews."
        : "Not yet. Rankbox grades every article for how ready it is to be quoted by an answer engine, but live citation monitoring is not available yet. If tracking is what you need today, Frase has it.",
    },
    {
      q: "Does Rankbox publish to WordPress and Webflow like Frase?",
      a: `${RANKBOX_PUBLISHING.sentence}. Frase publishes directly to WordPress, Webflow, Sanity, and Wix, or hosts pages on FraseCMS.`,
    },
    {
      q: "Can I use Rankbox and Frase together?",
      a: "Yes. A reasonable split is Rankbox for the daily articles, backlinks, and Reddit, and Frase for editing and citation tracking. Try opening a Rankbox article in Frase's editor to see how it scores.",
    },
  ],

  sources: [
    { label: "Frase pricing", url: "https://www.frase.io/pricing" },
    { label: "Frase homepage", url: "https://www.frase.io/" },
    { label: "AI visibility", url: "https://www.frase.io/features/ai-visibility" },
    { label: "Integrations", url: "https://www.frase.io/integrations" },
    { label: "Backlinks", url: "https://www.frase.io/features/backlinks" },
    {
      label: "Content scores explained",
      url: "https://docs.frase.io/feature-reference/content-scores-explained",
    },
    { label: "What's new (changelog)", url: "https://docs.frase.io/whats-new" },
  ],
  ctaTitle: "Thirty articles, plus the off-page work",
  ctaBody:
    "Paste your URL. Rankbox builds your content plan free, then writes your first articles on a 7-day trial.",
};
