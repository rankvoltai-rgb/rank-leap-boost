/**
 * Outrank — the best-known SEO autopilot: $99 a month for 30 articles on one
 * site, a built-in backlink network, and the widest set of CMS integrations
 * in the category. Checked against outrank.so on 2026-09-21.
 */
import { Search, PenLine, Send, Link2, Quote, Gauge, MessageSquare } from "lucide-react";
import { PLAN, formatUsd } from "../pricing";
import {
  RANKBOX_CELLS,
  RANKBOX_COST,
  RANKBOX_PUBLISHING,
  SHIPPED,
  notFocus,
  type Competitor,
} from "./shared";

export const outrank: Competitor = {
  slug: "outrank",
  name: "Outrank",
  domain: "outrank.so",
  monogram: "O",
  accent: "#8629ff",
  kind: "autopilot",
  category: "AI SEO autopilot",
  oneLiner: "30 auto-published articles a month, a backlink network, and ten CMS integrations.",

  eyebrow: "Outrank alternative",
  headline: { lead: "The Outrank alternative", accent: "at half the price, Reddit included" },
  subhead: `Outrank and Rankbox both research keywords, write an article a day, and trade backlinks with other members. Outrank's plan is $99 a month. Rankbox is ${formatUsd(PLAN.monthly)}, and adds Reddit reply drafts for the threads your buyers read.`,
  metaTitle: "Outrank Alternative: Rankbox vs Outrank (2026 Comparison)",
  metaDescription:
    "Rankbox vs Outrank, checked against Outrank's own pages: price per article, article length, how backlinks work, Reddit, CMS integrations, and when Outrank is the better buy.",

  shortAnswer: `Outrank and Rankbox are both SEO autopilots: they plan topics, write an article a day for one website, and include a member backlink exchange. Outrank's All-in-One plan is $99 a month, or $999 a year, for 30 articles its site describes as 1,200–1,700 words; Rankbox is ${formatUsd(PLAN.monthly)} a month for 30 articles of about 2,750 words by default, and adds Reddit reply drafts. Outrank has the broader platform: native publishing to ten destinations including WordPress, Shopify, Webflow, Wix, and Framer, measured keyword data, 150+ languages, and plans for 60 or 90 articles a month. Choose Outrank for native integrations, volume, or agencies. Choose Rankbox for the same daily cadence at half the monthly price.`,
  verdict: {
    rankbox: `An article a day, backlinks and Reddit drafts, for ${formatUsd(PLAN.monthly)}.`,
    them: "An article a day with the widest integrations, for $99.",
  },

  snapshot: {
    bestFor: "Stores, agencies, and multi-site teams",
    publishing: { state: "yes", short: "10 destinations, incl. Shopify, Wix" },
    backlinks: { state: "yes", short: "Earned by hosting; no fixed count" },
    aiVisibility: { state: "no", short: "Not offered, by its own account" },
    keywordData: { state: "yes", short: "Live volume and difficulty" },
  },
  specs: [
    { value: formatUsd(PLAN.monthly), label: "a month for 30 articles, against Outrank's $99" },
    { value: "~2,750", label: "words per article by default; Outrank cites 1,200–1,700" },
    {
      value: `${PLAN.backlinkCreditsPerMonth}/mo`,
      label: "backlink credits granted, not only earned",
    },
    { value: "Reddit", label: "reply drafts for the threads your buyers read" },
  ],

  positioning: {
    title: "Same daily cadence. Different price, length, and reach.",
    body: "Both are autopilots that plan, write, and ship an article a day. Outrank has spent longer building the platform around that loop. Rankbox charges half as much for the loop itself and adds Reddit.",
    rankboxTitle: "Where Rankbox differs",
    rankboxTag: "The same loop, priced lower",
    rankbox: [
      `${formatUsd(PLAN.monthly)} a month for ${PLAN.articlesPerMonth} articles on one site`,
      "About 2,750 words per article by default, from live research",
      `${PLAN.backlinkCreditsPerMonth} backlink credits granted every month, plus what you earn`,
      "Reddit threads found and reply drafts written for you to post",
      "Every draft re-run against its failing SEO checks until it passes",
    ],
    themTitle: "Where Outrank differs",
    them: [
      "Native publishing to ten destinations, including Shopify, Wix, and Ghost",
      "Shopify catalog sync, with articles that link your products",
      "Plans for 60 or 90 articles a month, and 150+ languages",
      "Article refreshes driven by your Search Console data",
      "Unlimited users, a REST API and CLI, and multi-site discounts",
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
            note: "Researches your niche and competitors into a content plan, one keyword a day",
          },
        },
        {
          label: "Keyword volume & difficulty",
          detail: "Knowing a topic is winnable before an article is spent on it.",
          rankbox: RANKBOX_CELLS.keywordData,
          them: { state: "yes", note: "Live search volume, difficulty, and CPC data" },
        },
      ],
    },
    {
      group: "Writing the article",
      icon: PenLine,
      rows: [
        {
          label: "Article length",
          detail: "Depth is one of the things answer engines reward.",
          rankbox: RANKBOX_CELLS.writer,
          them: { state: "yes", note: "Its site cites a minimum of 1,200–1,700 words" },
        },
        {
          label: "Inline source citations",
          detail: "AI engines cite pages that themselves cite sources.",
          rankbox: RANKBOX_CELLS.citations,
          them: {
            state: "yes",
            note: "Its llms.txt describes research-backed articles with inline citations",
          },
        },
        {
          label: "Brand voice",
          detail: "Sounding like you without an editing pass.",
          rankbox: RANKBOX_CELLS.voice,
          them: { state: "yes", note: "Matches the voice of articles you share with it" },
        },
        {
          label: "Images and video",
          detail: "Pages with media hold readers longer.",
          rankbox: {
            state: "partial",
            note: "A relevant YouTube video embedded in each article",
          },
          them: {
            state: "yes",
            note: "AI cover and in-article images, plus YouTube embeds",
          },
        },
        {
          label: "Quality gate",
          detail: "Something that checks a draft before it goes live.",
          rankbox: RANKBOX_CELLS.score,
          them: {
            state: "partial",
            note: "Draft mode and a 7-day preview for review; no article score advertised",
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
            note: "WordPress, WordPress.com, Webflow, Shopify, Framer, Wix, Notion, Ghost, Next.js, and webhooks",
          },
        },
        {
          label: "Runs on a schedule",
          detail: "Consistency is the whole game in search.",
          rankbox: RANKBOX_CELLS.autopilot,
          them: { state: "yes", note: "One article a day, on the days you choose" },
        },
        {
          label: "Refreshes old articles",
          detail: "Pages that slip get rewritten before they fall away.",
          rankbox: notFocus("Rankbox writes new articles"),
          them: {
            state: "yes",
            note: "Rewrites slipping articles from Search Console data, up to 2 a week",
          },
        },
      ],
    },
    {
      group: "Growing authority",
      icon: Link2,
      rows: [
        {
          label: "Backlink exchange",
          detail: "Links are still how search decides who to trust.",
          rankbox: RANKBOX_CELLS.backlinks,
          them: {
            state: "yes",
            note: "Credits earned by hosting other members' links, weighted by Domain Rating; no fixed monthly count",
          },
        },
        {
          label: "Paid link placements",
          detail: "Buying more links on top of the exchange.",
          rankbox: notFocus("links come only from the member exchange"),
          them: { state: "yes", note: "Backlink plans from $199 to $1,899 a month" },
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
          detail: "Knowing whether ChatGPT names you when it matters.",
          rankbox: RANKBOX_CELLS.tracking,
          them: {
            state: "no",
            note: "Not offered; its own alternatives page says so. A free one-page AI inspector exists",
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
          them: { state: "yes", note: "$99 a month, or $999 a year" },
        },
        {
          label: "More than 30 a month",
          detail: "Room to grow on one site.",
          rankbox: {
            state: "no",
            note: `${PLAN.articlesPerMonth} articles a month is the one plan`,
          },
          them: { state: "yes", note: "60 articles for $184, or 90 for $259 a month" },
        },
        {
          label: "Team members",
          detail: "Whether a teammate can log in with you.",
          rankbox: RANKBOX_CELLS.seats,
          them: { state: "yes", note: "Unlimited users in your organization" },
        },
      ],
    },
  ],

  pricing: {
    plan: "All-in-One",
    monthly: 99,
    articles: 30,
    covers: "30 articles a month, 1 website, unlimited users, backlink exchange",
    caveat:
      "Close in scope to Rankbox's plan at twice the monthly price. Backlinks in the base plan are earned by hosting other members' links, with no fixed monthly count; more links are sold as separate plans.",
    checkedOn: "2026-09-21",
    plans: [
      { name: "All-in-One", monthly: 99, articles: 30, note: "Billed monthly" },
      { name: "All-in-One, annual", monthly: 83.25, articles: 30, note: "Billed $999 a year" },
      { name: "All-in-One + 60 articles", monthly: 184, articles: 60, note: "Two articles a day" },
      {
        name: "All-in-One + 90 articles",
        monthly: 259,
        articles: 90,
        note: "Three articles a day",
      },
    ],
  },

  battlegroundsTitle: "Where the two actually differ",
  battlegroundsIntro:
    "Both write and ship an article a day. These are the three places where the choice changes what lands on your site.",
  battlegrounds: [
    {
      featureSlug: "reddit-presence",
      icon: MessageSquare,
      title: "Reddit is part of the plan",
      body: "AI engines quote forum threads constantly, and Reddit is the one they quote most. Outrank's pages don't mention Reddit. Rankbox finds the threads where your buyers are already asking, and drafts a reply in your voice for you to post under your own name.",
      points: [
        "Threads found from the searches your buyers run",
        "A reply drafted for each, written to help first",
        "You post it yourself; nothing goes out automatically",
      ],
    },
    {
      featureSlug: "authority-backlinks",
      icon: Link2,
      title: "Backlink credits arrive every month",
      body: `Outrank's included exchange pays you credits for hosting other members' links, weighted by your Domain Rating, with no fixed number a month. Rankbox grants ${PLAN.backlinkCreditsPerMonth} credits every month on the paid plan, on top of what hosting earns, and a placed link costs 1 to 3 credits by the host site's tier.`,
      points: [
        `${PLAN.backlinkCreditsPerMonth} credits granted monthly, not only earned`,
        "A link costs 1–3 credits, set by the host site's tier",
        "Credits held in escrow until the link is published and verified",
      ],
    },
    {
      featureSlug: "citation-ready-writer",
      icon: PenLine,
      title: "Longer articles by default",
      body: "Outrank describes its articles as a minimum of 1,200–1,700 words. Rankbox's default is about 2,750, drafted from live research of the pages ranking now, with the structure answer engines quote: a direct answer, key takeaways, cited sources, and an FAQ.",
      points: [
        "About 2,750 words unless you set otherwise",
        "Researched from the pages ranking for the keyword today",
        "Sources cited inline and listed in a References section",
      ],
    },
  ],

  betterWhen: [
    {
      title: "You sell on Shopify, or publish somewhere unusual",
      body: `Outrank syncs your Shopify catalog, writes articles around your products, and links them. It also publishes natively to WordPress, Webflow, Wix, Framer, Notion, Ghost, and a Next.js starter. ${RANKBOX_PUBLISHING.sentence}.`,
    },
    {
      title: "You run many sites or clients",
      body: "Outrank offers unlimited users, one dashboard for many client sites, multi-site discounts of up to 20%, and a REST API and CLI for automating it all. Rankbox covers one site per plan.",
    },
    {
      title: "You need more volume, languages, or editors",
      body: "Outrank sells 60 or 90 articles a month on one site, writes in 150+ languages, refreshes slipping articles from Search Console data, and offers human editing as an add-on. If you need any of those, Outrank is the better fit.",
    },
  ],

  migration: {
    title: "Switching from Outrank",
    body: "Everything Outrank already published stays on your site, and so do the backlinks it earned. You can run both while you compare what each one ships.",
    steps: [
      {
        title: "Point us at your site",
        body: "Paste your URL. Rankbox reads what is already published, including Outrank's articles, and learns your voice from it.",
      },
      {
        title: "Approve the plan",
        body: "You get a ranked list of buyer questions built around what the site already covers. Approve the ones you want and set a cadence.",
      },
      {
        title: "Connect publishing",
        body: "A developer points your site at the Rankbox publishing API once. Pause Outrank when the first Rankbox articles are live.",
      },
    ],
  },

  faqs: [
    {
      q: "Is Rankbox a real Outrank alternative?",
      a: "Yes. Both are SEO autopilots: they plan topics for one website, write and ship an article a day, and include a member backlink exchange. Outrank has more integrations and more ways to scale. Rankbox costs half as much for the core loop and includes Reddit reply drafts.",
    },
    {
      q: "Which is cheaper, Rankbox or Outrank?",
      a: `Rankbox. It is ${formatUsd(PLAN.monthly)} a month for ${PLAN.articlesPerMonth} articles, about ${formatUsd(RANKBOX_COST.perArticle)} each. Outrank's All-in-One plan is $99 a month, about $3.30 an article, or $999 a year, about $2.78 an article. Prices were checked on Outrank's pricing page on 21 September 2026.`,
    },
    {
      q: "Are Rankbox articles longer than Outrank's?",
      a: "By default, yes. Outrank's site describes its articles as a minimum of 1,200–1,700 words. Rankbox writes about 2,750 words by default, drafted from live research of the pages ranking for the keyword.",
    },
    {
      q: "Does Rankbox publish to Shopify and WordPress like Outrank?",
      a: `${RANKBOX_PUBLISHING.sentence}. Outrank publishes natively to WordPress, WordPress.com, Webflow, Shopify, Framer, Wix, Notion, Ghost, and a Next.js starter, and supports webhooks.`,
    },
    {
      q: "How do the backlink programmes compare?",
      a: `Both run a member exchange where your articles host other members' links. Outrank pays credits for hosting, weighted by Domain Rating, with no fixed monthly number, and sells more links as separate plans from $199 a month. Rankbox grants ${PLAN.backlinkCreditsPerMonth} credits a month on the paid plan, adds whatever hosting earns, and charges 1 to 3 credits per placed link.`,
    },
    {
      q: "Does either track whether ChatGPT cites my brand?",
      a: SHIPPED.citationTracking
        ? "Rankbox does, across ChatGPT, Perplexity, Gemini, and Google AI Overviews. Outrank's own alternatives page says AI visibility tracking is not something it sells."
        : "Not yet. Outrank's own alternatives page says AI visibility tracking is not something it sells. Rankbox grades every article for how ready it is to be quoted by an answer engine, but live citation monitoring is not available yet either.",
    },
  ],

  sources: [
    { label: "Outrank pricing", url: "https://www.outrank.so/pricing" },
    { label: "Outrank homepage", url: "https://www.outrank.so/" },
    { label: "Integrations", url: "https://www.outrank.so/integrations" },
    { label: "Backlink building", url: "https://www.outrank.so/backlink-building" },
    { label: "Outrank alternatives (their page)", url: "https://www.outrank.so/alternatives" },
    { label: "Article Improvements docs", url: "https://www.outrank.so/docs/improvements" },
    { label: "Shopify", url: "https://www.outrank.so/shopify" },
  ],
  ctaTitle: "An article a day, at half the monthly price",
  ctaBody:
    "Paste your URL. Rankbox builds your content plan free, then writes your first articles on a 7-day trial.",
};
