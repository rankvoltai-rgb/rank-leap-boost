/**
 * Jasper — an AI marketing agents platform: brand voice, a workspace, and a
 * hundred-odd agents across every channel. Re-checked against jasper.ai and
 * its help center on 2026-09-21, which retired several claims the first
 * version of this page made: the Creator plan is gone (Pro is $69), the Surfer
 * integration has ended (Semrush replaced it), credits apply only to Business,
 * and Business now includes GEO Hub citation tracking.
 */
import { Search, PenLine, Send, Link2, Quote, Gauge } from "lucide-react";
import { PLAN, formatUsd } from "../pricing";
import {
  RANKBOX_CELLS,
  RANKBOX_COST,
  RANKBOX_PUBLISHING,
  SHIPPED,
  notFocus,
  type Competitor,
} from "./shared";

export const jasper: Competitor = {
  slug: "jasper",
  name: "Jasper",
  domain: "jasper.ai",
  monogram: "J",
  accent: "#8b5cf6",
  kind: "writer",
  category: "AI marketing agents platform",
  oneLiner: "Brand voice, a shared workspace, and marketing agents for every channel.",

  eyebrow: "Jasper alternative",
  headline: { lead: "The Jasper alternative", accent: "that publishes" },
  subhead:
    "Jasper helps your marketing team write faster across every channel. Rankbox runs the whole article loop: it finds the questions your buyers ask AI, writes the answers with sources, checks them, and delivers them to your site on a schedule, without anyone opening an editor.",
  metaTitle: "Jasper Alternative: Rankbox vs Jasper (2026 Comparison)",
  metaDescription:
    "An honest Rankbox vs Jasper comparison, checked against Jasper's own pages: what each is built for, a full feature matrix, real cost per article, and when Jasper is the better buy.",

  shortAnswer: `Jasper is an AI marketing agents platform: your team works in its Canvas workspace with brand voices and agents to produce copy across ads, email, social, and articles. Its Pro plan is $69 a month for one seat, and its Business plan, priced by sales, adds agent building, bulk content, and GEO Hub tracking of how AI engines mention your brand. Rankbox is an AI search growth engine: it researches the questions buyers ask ChatGPT, Perplexity, and Google, writes source-backed articles in your brand voice, checks them for SEO, and delivers them to your site on a schedule for ${formatUsd(PLAN.monthly)} a month. Choose Jasper if you have a marketing team producing copy in many formats. Choose Rankbox if you have no writers and want articles appearing without anyone running the process.`,
  verdict: {
    rankbox: "An engine that ships articles. You approve a plan; they arrive on schedule.",
    them: "A platform that assists. People prompt its agents and edit the output.",
  },

  snapshot: {
    bestFor: "Marketing teams writing across channels",
    publishing: { state: "partial", short: "Exports; Webflow app" },
    backlinks: { state: "no", short: "Not offered" },
    aiVisibility: { state: "partial", short: "GEO Hub, on Business only" },
    keywordData: { state: "partial", short: "Via Semrush, bought separately" },
  },
  specs: [
    { value: "0", label: "editors to open; articles arrive on your cadence" },
    { value: `${PLAN.articlesPerMonth}/mo`, label: "finished, source-backed articles" },
    { value: formatUsd(RANKBOX_COST.perArticle), label: "per article, on one flat plan" },
    {
      value: `${PLAN.backlinkCreditsPerMonth}/mo`,
      label: "backlink credits through the member exchange",
    },
  ],

  positioning: {
    title: "Jasper speeds up writers. Rankbox replaces the process.",
    body: "Both write with AI. The difference is everything either side of the writing, and whether anything reaches your site without a person driving it.",
    rankboxTitle: "What Rankbox owns",
    rankbox: [
      "Finds the questions, so nobody has to pick topics",
      "Researches the live web and cites real sources in the draft",
      "Checks every article against SEO rules and rewrites what fails",
      "Writes on your cadence, up to one article a day",
      "Trades backlinks and drafts Reddit replies for you",
    ],
    themTitle: "What Jasper owns",
    them: [
      "Ads, email, product copy, social: every marketing format",
      "A Canvas workspace and 100+ agents your team prompts",
      "Brand voices, knowledge, and audiences across a marketing org",
      "Grid and Studio for bulk content and custom agents, on Business",
      "GEO Hub tracking of AI answers, on Business",
    ],
  },

  matrix: [
    {
      group: "Finding what to write",
      icon: Search,
      rows: [
        {
          label: "Buyer-question research",
          detail: "Does the tool decide what to write about, or do you?",
          rankbox: RANKBOX_CELLS.research,
          them: {
            state: "partial",
            note: "Query and topic suggestions from its agents; deeper research on Business",
          },
        },
        {
          label: "Keyword volume & difficulty",
          detail: "Knowing a topic is winnable before you spend an article on it.",
          rankbox: RANKBOX_CELLS.keywordData,
          them: {
            state: "partial",
            note: "Through its Semrush integration, which needs a Semrush plan",
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
          detail: "Whether the draft is grounded in current sources or model memory.",
          rankbox: RANKBOX_CELLS.writer,
          them: {
            state: "partial",
            note: "Long-form in Canvas; research agents on Business",
          },
        },
        {
          label: "Inline source citations",
          detail: "AI engines cite pages that themselves cite sources.",
          rankbox: RANKBOX_CELLS.citations,
          them: notFocus("sources are added by the writer"),
        },
        {
          label: "Brand voice",
          detail: "Sounding like you without an editing pass.",
          rankbox: RANKBOX_CELLS.voice,
          them: {
            state: "yes",
            note: "Its core strength: 2 voices on Pro, unlimited on Business",
          },
        },
        {
          label: "Marketing copy formats",
          detail: "Ads, emails, landing pages, social posts.",
          rankbox: notFocus("Rankbox writes articles only"),
          them: { state: "yes", note: "Agents and templates for every channel" },
        },
      ],
    },
    {
      group: "Shipping it",
      icon: Send,
      rows: [
        {
          label: "Quality gate",
          detail: "Something that stops a weak draft reaching your site.",
          rankbox: RANKBOX_CELLS.score,
          them: {
            state: "partial",
            note: "An optimization agent on Business; editing is done by your team",
          },
        },
        {
          label: "Publishes to your CMS",
          detail: "Whether content leaves the tool on its own.",
          rankbox: RANKBOX_CELLS.publish,
          them: {
            state: "partial",
            note: "Exports and a Webflow app; WordPress through Zapier or Make",
          },
        },
        {
          label: "Runs on a schedule",
          detail: "Consistency is the whole game in search.",
          rankbox: RANKBOX_CELLS.autopilot,
          them: notFocus("someone opens it each time"),
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
          them: notFocus("a content platform, not an off-page one"),
        },
        {
          label: "Reddit & community presence",
          detail: "AI engines lean heavily on forum discussion.",
          rankbox: RANKBOX_CELLS.reddit,
          them: notFocus(),
        },
      ],
    },
    {
      group: "Measuring AI visibility",
      icon: Quote,
      rows: [
        {
          label: "AI citation tracking",
          detail: "Knowing whether ChatGPT names you when it matters.",
          rankbox: RANKBOX_CELLS.tracking,
          them: {
            state: "partial",
            note: "GEO Hub tracks ChatGPT, Gemini, Claude, and Perplexity, on Business, in credits",
          },
        },
        {
          label: "Share-of-answer reporting",
          detail: "How often you appear versus your competitors.",
          rankbox: RANKBOX_CELLS.shareOfAnswer,
          them: {
            state: "partial",
            note: "Share of voice and sentiment in GEO Hub, on Business",
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
          detail: "Whether the price maps to finished work.",
          rankbox: RANKBOX_CELLS.pricingModel,
          them: {
            state: "partial",
            note: "Pro is one seat under fair use; Business adds seats, a platform fee, and credits",
          },
        },
        {
          label: "Team members",
          detail: "Whether growing the team grows the bill.",
          rankbox: RANKBOX_CELLS.seats,
          them: { state: "partial", note: "Pro is one seat; Business is priced per seat" },
        },
      ],
    },
  ],

  pricing: {
    plan: "Pro",
    monthly: 69,
    articles: null,
    covers: "1 seat, 2 brand voices, Canvas and core agents",
    caveat:
      "Sold per seat, not per finished article, so the true cost of a published piece depends on how long your team spends on it. Annual billing is $59 a month. Business is priced by sales and adds credits for advanced agents and GEO Hub.",
    checkedOn: "2026-09-21",
    plans: [
      { name: "Pro", monthly: 69, articles: null, note: "1 seat · billed monthly" },
      { name: "Pro, annual", monthly: 59, articles: null, note: "1 seat · 12-month commitment" },
      { name: "Business", monthly: null, articles: null, note: "Seats, platform fee, and credits" },
    ],
  },

  battlegrounds: [
    {
      featureSlug: "answer-space-research",
      icon: Search,
      title: "You never have to pick a topic again",
      body: "Jasper waits for a prompt. Rankbox arrives with the list: the questions your buyers put to ChatGPT, Perplexity, and Google, built from your own site and ranked by estimated demand.",
      points: [
        "A plan of buyer questions mapped from your URL in the first pass",
        "Each topic shown with its estimated demand and intent",
        "Approved questions flow straight to the writer, with no briefs or handoff",
      ],
    },
    {
      featureSlug: "citation-ready-writer",
      icon: PenLine,
      title: "Articles written to be quoted",
      body: "Jasper is built for a person shaping copy across formats. Rankbox writes one thing, and writes it for answer engines: long articles from live research, with a direct answer up top, key takeaways, cited sources, and an FAQ.",
      points: [
        "About 2,750 words by default, drafted from the pages ranking now",
        "Sources cited inline and listed in a References section",
        "Every draft re-run against its failing SEO checks until it passes",
      ],
    },
    {
      featureSlug: "authority-backlinks",
      icon: Link2,
      title: "Authority is part of the plan",
      body: `Writing is half the job. Rankbox also works off the page: ${PLAN.backlinkCreditsPerMonth} backlink credits a month in a member exchange, and Reddit reply drafts for the threads your buyers read.`,
      points: [
        `${PLAN.backlinkCreditsPerMonth} credits a month, spent on links placed in relevant articles`,
        "Reddit threads found and replies drafted for you to post",
        `Both on the ${formatUsd(PLAN.monthly)} plan`,
      ],
    },
  ],

  betterWhen: [
    {
      title: "You have writers and want them faster",
      body: "Jasper is built around people doing the work. If your marketing team produces copy every day, a strong assistant inside their workflow beats an engine that replaces a workflow they like.",
    },
    {
      title: "You need copy far beyond articles",
      body: "Ad variants, lifecycle email, product descriptions, social calendars, translation. Rankbox writes articles and nothing else, on purpose. Jasper covers the whole channel mix.",
    },
    {
      title: "You're an enterprise team with brand controls",
      body: `Jasper's Business plan adds unlimited brand voices, custom agents, bulk content, GEO Hub tracking, and enterprise security and admin controls. ${RANKBOX_PUBLISHING.sentence}.`,
    },
  ],

  migration: {
    title: "Switching from Jasper takes an afternoon",
    body: "There is nothing to export and no content to migrate. Anything you published with Jasper stays where it is, and Rankbox starts filling the gaps around it.",
    steps: [
      {
        title: "Point us at your site",
        body: "Paste your URL. Rankbox reads what you have already published, learns your voice from it, and maps your buyer questions.",
      },
      {
        title: "Approve the plan",
        body: "You get a ranked list of buyer questions. Approve the ones you want, add any of your own, and set a cadence.",
      },
      {
        title: "Connect publishing",
        body: "A developer points your site at the Rankbox publishing API once. Then articles arrive on the cadence you set.",
      },
    ],
  },

  faqs: [
    {
      q: "Is Rankbox a direct Jasper alternative?",
      a: "Only for one part of what Jasper does. If you use Jasper to produce SEO articles and blog content, Rankbox replaces that and takes over the research, checking, and delivery around it. If you use Jasper for ads, email, and social copy, Rankbox doesn't cover those, and plenty of teams could run both.",
    },
    {
      q: "Which is cheaper, Rankbox or Jasper?",
      a: `They're sold differently. Jasper Pro is $69 a month for one seat, or $59 billed annually, and Business is priced by sales. Neither is sold by the article, so the cost of a finished piece depends on your team's time. Rankbox is ${PLAN.articlesPerMonth} finished articles a month for ${formatUsd(PLAN.monthly)}, about ${formatUsd(RANKBOX_COST.perArticle)} each. Prices were checked on Jasper's pricing page on 21 September 2026.`,
    },
    {
      q: "Does Jasper publish to WordPress automatically?",
      a: `Publishing isn't what Jasper is built for. Content leaves it by export, through its Webflow app, or to WordPress through Zapier or Make. ${RANKBOX_PUBLISHING.sentence}, on the cadence you set.`,
    },
    {
      q: "Can Rankbox match Jasper's brand voice?",
      a: "Rankbox reads your tone, audience, and voice from your site at setup, lets you edit them, and applies them to every article. Jasper's brand voices are more flexible across formats. For long-form articles the output is comparable; across ads and social, Jasper has the wider range.",
    },
    {
      q: "Does either tool tell me if ChatGPT recommends my brand?",
      a: SHIPPED.citationTracking
        ? "Both can. Jasper's GEO Hub tracks ChatGPT, Gemini, Claude, and Perplexity on its Business plan. Rankbox tracks ChatGPT, Perplexity, Gemini, and AI Overviews on its one plan."
        : "Jasper can, on its Business plan: GEO Hub tracks brand presence, citation rate, share of voice, and sentiment across ChatGPT, Gemini, Claude, and Perplexity, paid for in credits. Rankbox grades every article for how ready it is to be quoted, but live citation monitoring is not available yet.",
    },
    {
      q: "Do I need to cancel Jasper to try Rankbox?",
      a: "No. Building your Rankbox content plan is free, and the trial runs for 7 days. There is nothing to migrate, so you can run both for a couple of weeks and compare what actually reached your site.",
    },
  ],

  sources: [
    { label: "Jasper pricing", url: "https://www.jasper.ai/pricing" },
    { label: "Credits rate card", url: "https://www.jasper.ai/credits-rate-card" },
    {
      label: "GEO Hub (help center)",
      url: "https://help.jasper.ai/hc/en-us/articles/51579082265883-GEO-Hub",
    },
    { label: "Integrations", url: "https://www.jasper.ai/integrations" },
    {
      label: "Semrush integration (help center)",
      url: "https://help.jasper.ai/hc/en-us/articles/53731968390555-Integrations-Semrush",
    },
    {
      label: "Brand Voice (help center)",
      url: "https://help.jasper.ai/hc/en-us/articles/18618693085339-Brand-Voice",
    },
  ],
  ctaTitle: "See what a week of autopilot looks like",
  ctaBody:
    "Paste your URL and watch Rankbox map your buyer questions and write your first article, before you decide anything.",
};
