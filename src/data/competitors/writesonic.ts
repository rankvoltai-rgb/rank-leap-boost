/**
 * Writesonic — once an AI writer, now an AI search visibility platform: it
 * tracks how AI engines answer about your brand, then helps a team fix it with
 * content, citations, and technical work. Well ahead of Rankbox on analytics,
 * which this page concedes. Checked against writesonic.com, its help center,
 * and its API docs on 2026-09-21.
 */
import { Search, PenLine, Send, Link2, MessageSquare, Gauge, LineChart } from "lucide-react";
import { PLAN, formatUsd } from "../pricing";
import {
  RANKBOX_CELLS,
  RANKBOX_COST,
  RANKBOX_PUBLISHING,
  SHIPPED,
  notFocus,
  type Competitor,
} from "./shared";

export const writesonic: Competitor = {
  slug: "writesonic",
  name: "Writesonic",
  domain: "writesonic.com",
  monogram: "W",
  accent: "#ff6719",
  kind: "visibility",
  category: "AI search visibility platform",
  oneLiner: "Tracks how AI engines answer about your brand, then helps your team fix it.",

  eyebrow: "Writesonic alternative",
  headline: { lead: "The Writesonic alternative", accent: "for content on autopilot" },
  subhead: `Writesonic has become an AI visibility platform: it tracks how ChatGPT, Gemini, and Google AI answer about you, then gives your team the work to fix it. Rankbox does the content side on its own: 30 researched articles a month, backlink credits, and Reddit drafts for ${formatUsd(PLAN.monthly)}.`,
  metaTitle: "Writesonic Alternative: Rankbox vs Writesonic (2026 Comparison)",
  metaDescription:
    "Rankbox vs Writesonic, checked against Writesonic's own pricing and docs: AI visibility tracking versus content on autopilot, cost per article, publishing, and when Writesonic is the better buy.",

  shortAnswer: `Writesonic is an AI search visibility platform. It tracks how AI engines answer prompts about your brand, analyses which sources they cite, audits your site, and gives your team content, citation, and technical fixes to act on; its Starter plan is $99 a month for 50 tracked prompts in ChatGPT, Gemini, and Google AI Overviews, plus 15 AI articles. Rankbox is a content autopilot: it plans the questions your buyers ask, writes 30 articles a month on your cadence, and includes backlink credits and Reddit reply drafts for ${formatUsd(PLAN.monthly)}. Writesonic's own docs say it publishes nothing automatically. Choose Writesonic to measure and manage AI visibility. Choose Rankbox to produce the content that earns it, without a team running the process.`,
  verdict: {
    rankbox: `The content engine: 30 articles a month on autopilot for ${formatUsd(PLAN.monthly)}.`,
    them: "The analytics: how AI answers about you, and what to fix.",
  },

  snapshot: {
    bestFor: "Teams measuring and managing AI visibility",
    publishing: { state: "partial", short: "Push to CMS; nothing automatic" },
    backlinks: { state: "no", short: "No link network" },
    aiVisibility: { state: "yes", short: "3 engines self-serve, 10 Enterprise" },
    keywordData: { state: "yes", short: "Volume, difficulty, and intent" },
  },
  specs: [
    {
      value: "30",
      label: `articles a month for ${formatUsd(PLAN.monthly)}; Writesonic's $99 Starter includes 15`,
    },
    {
      value: formatUsd(RANKBOX_COST.perArticle),
      label: "per article, against Writesonic's $6.60 on Starter",
    },
    { value: "Autopilot", label: "writes on your cadence without anyone starting it" },
    {
      value: `${PLAN.backlinkCreditsPerMonth}/mo`,
      label: "backlink credits through the member exchange",
    },
  ],

  positioning: {
    title: "Writesonic measures AI visibility. Rankbox produces the content.",
    body: "Both are aimed at AI search, from opposite ends. Writesonic starts from the answers and works back to fixes a team carries out. Rankbox starts from the questions and ships the articles itself.",
    rankboxTitle: "Where Rankbox differs",
    rankboxTag: "A content engine, not a dashboard",
    rankbox: [
      `${PLAN.articlesPerMonth} articles a month for ${formatUsd(PLAN.monthly)}, about ${formatUsd(RANKBOX_COST.perArticle)} each`,
      "Writes on your weekly cadence without anyone starting it",
      `${PLAN.backlinkCreditsPerMonth} backlink credits a month through the member exchange`,
      "Reddit threads found and reply drafts written for you to post",
      "Every draft re-run against its failing SEO checks until it passes",
    ],
    themTitle: "Where Writesonic differs",
    them: [
      "Daily prompt tracking in ChatGPT, Gemini, and Google AI Overviews",
      "Ten engines on Enterprise, with sentiment and share of voice",
      "Citation analysis: which sources AI engines cite, and where you're missing",
      "Site audits with fixes, and server-side AI crawler analytics",
      "Agency plans with pitch projects and white-label reporting",
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
            note: "Content strategy from Keyword Planner, SERPs, and Reddit, plus prompt data",
          },
        },
        {
          label: "Keyword volume & difficulty",
          detail: "Knowing a topic is winnable before an article is spent on it.",
          rankbox: RANKBOX_CELLS.keywordData,
          them: { state: "yes", note: "Volume, difficulty, and intent for each keyword" },
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
            note: "Its article writer claims 3,000–8,000 words from live SERP research",
          },
        },
        {
          label: "Articles included",
          detail: "How much content the plan actually produces.",
          rankbox: {
            state: "yes",
            note: `${PLAN.articlesPerMonth} a month on the one plan`,
          },
          them: { state: "partial", note: "15 a month on Starter, 25 on Basic, 50 on Growth" },
        },
        {
          label: "Brand voice",
          detail: "Sounding like you without an editing pass.",
          rankbox: RANKBOX_CELLS.voice,
          them: {
            state: "yes",
            note: "Writing styles by plan, with a voice check against your style guide",
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
            state: "partial",
            note: "Pushes to WordPress, Webflow, Ghost, Sanity, or Contentful when you choose",
          },
        },
        {
          label: "Runs on a schedule",
          detail: "Consistency is the whole game in search.",
          rankbox: RANKBOX_CELLS.autopilot,
          them: notFocus("its docs say nothing is published automatically"),
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
            note: "Finds sites citing competitors and drafts outreach, from the Growth plan",
          },
        },
        {
          label: "Reddit presence",
          detail: "AI engines lean heavily on forum discussion.",
          rankbox: RANKBOX_CELLS.reddit,
          them: {
            state: "partial",
            note: "Surfaces community threads to join, from the Growth plan's action center",
          },
        },
      ],
    },
    {
      group: "Measuring AI visibility",
      icon: LineChart,
      rows: [
        {
          label: "AI citation tracking",
          detail: "Knowing whether AI answers name you when it matters.",
          rankbox: RANKBOX_CELLS.tracking,
          them: {
            state: "yes",
            note: "Daily, in ChatGPT, Gemini, and Google AI Overviews; ten engines on Enterprise",
          },
        },
        {
          label: "Share of voice and sentiment",
          detail: "How often you appear versus competitors, and how you're described.",
          rankbox: RANKBOX_CELLS.shareOfAnswer,
          them: {
            state: "yes",
            note: "Share of voice on every plan; sentiment from the Growth plan",
          },
        },
        {
          label: "Citation source analysis",
          detail: "Which pages AI engines trust, so you know where to be.",
          rankbox: notFocus("Rankbox writes the pages to be cited"),
          them: {
            state: "yes",
            note: "Top cited pages, competitor citations, and source-type breakdowns",
          },
        },
      ],
    },
    {
      group: "Plan & team",
      icon: Gauge,
      rows: [
        {
          label: "Entry price",
          detail: "What the first plan costs, billed monthly.",
          rankbox: RANKBOX_CELLS.pricingModel,
          them: { state: "yes", note: "Starter: $99 a month, or $79 billed annually" },
        },
        {
          label: "Team members",
          detail: "Whether a teammate can log in with you.",
          rankbox: RANKBOX_CELLS.seats,
          them: {
            state: "yes",
            note: "1 user on Starter, 2 on Basic, 3 on Growth, more at $50 each",
          },
        },
      ],
    },
  ],

  pricing: {
    plan: "Starter",
    monthly: 99,
    articles: 15,
    covers: "15 AI articles, 50 prompts tracked daily in 3 AI engines, site audits",
    caveat:
      "Closest in price and scope. The plan's value is mostly its AI visibility tracking and audits, which Rankbox doesn't offer, so cost per article understates what it buys. Annual billing is $79 a month.",
    checkedOn: "2026-09-21",
    plans: [
      { name: "Starter", monthly: 99, articles: 15, note: "50 prompts · 3 engines · 1 user" },
      { name: "Basic", monthly: 249, articles: 25, note: "100 prompts · 2 users" },
      { name: "Growth", monthly: 499, articles: 50, note: "200 prompts · sentiment · 3 users" },
      { name: "Enterprise", monthly: null, articles: null, note: "All 10 engines · custom" },
    ],
  },

  battlegroundsTitle: "Where the two actually differ",
  battlegroundsIntro:
    "Writesonic is the deeper analytics platform. These are the three places Rankbox does the work itself.",
  battlegrounds: [
    {
      featureSlug: "citation-ready-writer",
      icon: PenLine,
      title: "Twice the articles for half the price",
      body: `Writesonic's $99 Starter plan includes 15 AI articles, and its value is mostly the tracking around them. Rankbox is ${formatUsd(PLAN.monthly)} for 30, each about 2,750 words, researched from the pages ranking now and written in the shape answer engines quote.`,
      points: [
        `${PLAN.articlesPerMonth} articles a month on the one plan`,
        "Direct answer, key takeaways, cited sources, and FAQ in each",
        "Sources cited inline and listed in a References section",
      ],
    },
    {
      featureSlug: "answer-space-research",
      icon: Search,
      title: "The work gets done, not just listed",
      body: "Writesonic's docs say that nothing is published automatically; its action center gives a team the fixes to carry out. Rankbox plans the questions your buyers ask, then writes the next article on your cadence without anyone starting it.",
      points: [
        "A plan of buyer questions built from your own site",
        "The next article written on your weekly cadence, up to daily",
        "Approve the plan once, not each piece of work",
      ],
    },
    {
      featureSlug: "authority-backlinks",
      icon: Link2,
      title: "Backlinks and Reddit on the one plan",
      body: `Writesonic's outreach and community suggestions start on its $499 Growth plan, and it doesn't place links. Rankbox includes ${PLAN.backlinkCreditsPerMonth} backlink credits a month in a member exchange, and drafts Reddit replies for the threads your buyers read.`,
      points: [
        `${PLAN.backlinkCreditsPerMonth} credits a month, spent on links placed in relevant articles`,
        "Reddit threads found and replies drafted for you to post",
        `Both on the ${formatUsd(PLAN.monthly)} plan`,
      ],
    },
  ],

  betterWhen: [
    {
      title: "You need to measure AI visibility",
      body: SHIPPED.citationTracking
        ? "Writesonic tracks prompts daily with share of voice, sentiment, and citation analysis, and covers ten engines on Enterprise. Its analytics go deeper than Rankbox's."
        : "Writesonic tracks prompts daily in ChatGPT, Gemini, and Google AI Overviews, with share of voice and citation analysis, and covers ten engines on Enterprise. Rankbox doesn't monitor citations yet.",
    },
    {
      title: "You have a team to act on the findings",
      body: "Writesonic's action center, site audits, and AI crawler analytics are built for a team that turns findings into fixes. If you have people ready to do that work, Writesonic tells them exactly where to start.",
    },
    {
      title: "You're an agency selling AI visibility",
      body: `Writesonic's agency plans include pitch projects for prospects, client workspaces, and white-label reporting. It also pushes content to WordPress, Webflow, Ghost, Sanity, and Contentful. ${RANKBOX_PUBLISHING.sentence}.`,
    },
  ],

  migration: {
    title: "Running Rankbox alongside Writesonic",
    body: "These two meet in the middle rather than overlap: Writesonic measures how AI answers about you, and Rankbox produces the articles that change it. Plenty of teams could run both.",
    steps: [
      {
        title: "Point us at your site",
        body: "Paste your URL. Rankbox reads what is already published and learns your voice from it.",
      },
      {
        title: "Approve the plan",
        body: "You get a ranked list of buyer questions. Add any gaps Writesonic surfaced, then set a cadence.",
      },
      {
        title: "Watch the answers move",
        body: "Rankbox writes on schedule through its publishing API. Keep tracking in Writesonic to see which prompts start citing you.",
      },
    ],
  },

  faqs: [
    {
      q: "Is Rankbox a Writesonic alternative?",
      a: "For producing content, yes. Writesonic is now mainly an AI visibility platform: it tracks and analyses how AI engines answer about your brand, and helps a team fix it. Rankbox is a content autopilot that writes and ships the articles, with backlink credits and Reddit drafts included. Many teams would use one for each job.",
    },
    {
      q: "Which is cheaper, Rankbox or Writesonic?",
      a: `Rankbox, at ${formatUsd(PLAN.monthly)} a month for 30 articles. Writesonic's Starter plan is $99 a month, or $79 billed annually, and includes 15 AI articles alongside prompt tracking and site audits. Writesonic's price mostly buys analytics Rankbox doesn't offer, so compare what you would use. Prices were checked on Writesonic's pricing page on 21 September 2026.`,
    },
    {
      q: "Does Writesonic publish automatically?",
      a: "No. Its Agents documentation says nothing is published automatically; content is pushed to WordPress, Webflow, Ghost, Sanity, or Contentful when you choose. Rankbox writes on your cadence without anyone starting it.",
    },
    {
      q: "Which AI engines does Writesonic track?",
      a: "On its self-serve plans, ChatGPT, Gemini, and Google AI Overviews. Perplexity, Claude, Copilot, Grok, DeepSeek, Meta AI, and Google AI Mode are on Enterprise, per its pricing FAQ.",
    },
    {
      q: "Does Rankbox track AI citations?",
      a: SHIPPED.citationTracking
        ? "Yes, across ChatGPT, Perplexity, Gemini, and Google AI Overviews."
        : "Not yet. Rankbox grades every article for how ready it is to be quoted by an answer engine, but live citation monitoring is not available yet. If measurement is the main job, Writesonic does it today.",
    },
    {
      q: "Can I use Rankbox and Writesonic together?",
      a: "Yes, and they fit together well: Writesonic shows which prompts you're missing, Rankbox writes the articles that answer them. Add the gaps Writesonic finds to your Rankbox plan and track the result in Writesonic.",
    },
  ],

  sources: [
    { label: "Writesonic pricing", url: "https://writesonic.com/pricing" },
    { label: "Writesonic homepage", url: "https://writesonic.com/" },
    { label: "AI Visibility Tracker", url: "https://writesonic.com/ai-visibility-tracker" },
    { label: "Action Center", url: "https://writesonic.com/ai-visibility-action-center" },
    { label: "AI Article Writer", url: "https://writesonic.com/ai-article-writer" },
    {
      label: "Agents docs: publishing",
      url: "https://apidocs.writesonic.com/agents/publishing.md",
    },
    { label: "Integrations", url: "https://writesonic.com/integrations" },
  ],
  ctaTitle: "Produce the content that moves the answers",
  ctaBody:
    "Paste your URL. Rankbox builds your content plan free, then writes your first articles on a 7-day trial.",
};
