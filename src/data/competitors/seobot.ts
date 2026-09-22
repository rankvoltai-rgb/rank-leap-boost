/**
 * SEObot — an autonomous SEO agent sold by article credits, from 9 a month at
 * $49 up to 300. It has no public pricing page (seobotai.com/pricing is a 404),
 * so plans come from its help-center pricing doc, which matches its checkout.
 * Checked against seobotai.com and docs.seobotai.com on 2026-09-21.
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

export const seobot: Competitor = {
  slug: "seobot",
  name: "SEObot",
  domain: "seobotai.com",
  monogram: "SB",
  accent: "#26e411",
  kind: "autopilot",
  category: "Autonomous SEO agent",
  oneLiner: "An SEO agent sold by article credits, from 9 articles a month to 300.",

  eyebrow: "SEObot alternative",
  headline: {
    lead: "The SEObot alternative",
    accent: `with 30 articles for ${formatUsd(PLAN.monthly)}`,
  },
  subhead: `SEObot's $49 plan covers 9 articles a month, and 30 means its $199 plan. Rankbox is ${formatUsd(PLAN.monthly)} for 30, with backlink credits, Reddit reply drafts, and an SEO check on every draft in the same plan.`,
  metaTitle: "SEObot Alternative: Rankbox vs SEObot (2026 Comparison)",
  metaDescription:
    "Rankbox vs SEObot, checked against SEObot's own docs: articles per dollar, backlinks, citations, publishing, and when SEObot's volume plans are the better buy.",

  shortAnswer: `SEObot and Rankbox are both SEO autopilots that plan topics, write long articles, and publish on a schedule. SEObot sells article credits: $49 a month for 9 articles, $99 for 20, and $199 for 50, with larger plans up to 300. Rankbox is ${formatUsd(PLAN.monthly)} a month for 30 articles, about ${formatUsd(RANKBOX_COST.perArticle)} each, and includes backlink credits, Reddit reply drafts, and an SEO check on every draft. SEObot publishes natively to nine platforms including WordPress, Shopify, Webflow, Wix, and Framer, lets credits roll over and split across sites, and adds programmatic SEO. Choose SEObot for high volume or many sites. Choose Rankbox for 30 articles a month on one site at the lowest cost per article.`,
  verdict: {
    rankbox: `30 articles a month, with backlinks and Reddit, for ${formatUsd(PLAN.monthly)}.`,
    them: "An agent that scales to 300 articles, with credits that roll over.",
  },

  snapshot: {
    bestFor: "High volume across several sites",
    publishing: { state: "yes", short: "9 platforms, incl. Shopify, Wix" },
    backlinks: { state: "partial", short: "1 credit per article, not guaranteed" },
    aiVisibility: { state: "no", short: "Not offered" },
    keywordData: { state: "partial", short: "Keyword research; volumes not shown" },
  },
  specs: [
    { value: "30", label: `articles for ${formatUsd(PLAN.monthly)}; SEObot's $49 plan covers 9` },
    {
      value: formatUsd(RANKBOX_COST.perArticle),
      label: "per article, against SEObot's $3.98 at 50 a month",
    },
    {
      value: `${PLAN.backlinkCreditsPerMonth}/mo`,
      label: "backlink credits granted, whatever you publish",
    },
    { value: "Every draft", label: "checked for SEO and rewritten until it passes" },
  ],

  positioning: {
    title: "Same autopilot idea. Very different arithmetic.",
    body: "Both research, write, and publish on a schedule. SEObot is priced for volume and many sites. Rankbox is priced for one site that wants an article most days.",
    rankboxTitle: "Where Rankbox differs",
    rankboxTag: "More articles per dollar at 30 a month",
    rankbox: [
      `${PLAN.articlesPerMonth} articles for ${formatUsd(PLAN.monthly)}, about ${formatUsd(RANKBOX_COST.perArticle)} each`,
      `${PLAN.backlinkCreditsPerMonth} backlink credits granted every month on the paid plan`,
      "Sources cited inline in every article, not behind a setting",
      "Every draft re-run against its failing SEO checks until it passes",
      "Reddit threads found and reply drafts written for you to post",
    ],
    themTitle: "Where SEObot differs",
    them: [
      "Plans from 9 to 300 articles a month",
      "Credits never expire and can be split across several sites",
      "Native publishing to nine platforms, plus Next.js and a REST API",
      "Programmatic SEO, news articles, YouTube-to-article, and mini-tools",
      "50+ languages and unlimited teammates",
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
            note: "Researches your site, audience, and keywords into clustered headlines you approve",
          },
        },
        {
          label: "Keyword volume & difficulty",
          detail: "Knowing a topic is winnable before an article is spent on it.",
          rankbox: RANKBOX_CELLS.keywordData,
          them: {
            state: "partial",
            note: "Keyword research runs inside the agent; its docs don't describe volume figures in the app",
          },
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
          them: {
            state: "yes",
            note: "Averages 3,000 words, up to 4,000; its docs say length can't be set directly",
          },
        },
        {
          label: "Inline source citations",
          detail: "AI engines cite pages that themselves cite sources.",
          rankbox: RANKBOX_CELLS.citations,
          them: { state: "partial", note: "Numbered citations are a setting you switch on" },
        },
        {
          label: "Brand voice",
          detail: "Sounding like you without an editing pass.",
          rankbox: RANKBOX_CELLS.voice,
          them: {
            state: "partial",
            note: "Pick from about 30 tones, plus audience notes and custom context",
          },
        },
        {
          label: "Quality gate",
          detail: "Something that checks a draft before it goes live.",
          rankbox: RANKBOX_CELLS.score,
          them: notFocus("headlines are approved; no article score is described"),
        },
        {
          label: "Editing after it's written",
          detail: "Changing a draft that isn't quite right.",
          rankbox: RANKBOX_CELLS.rewrites,
          them: {
            state: "partial",
            note: "In-app editor; its docs say articles can't be regenerated or deleted",
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
            note: "WordPress, Shopify, Webflow, Wix, Framer, Ghost, HubSpot, Notion, Unicorn Platform, plus Next.js, API, and webhooks",
          },
        },
        {
          label: "Runs on a schedule",
          detail: "Consistency is the whole game in search.",
          rankbox: RANKBOX_CELLS.autopilot,
          them: { state: "yes", note: "A set number of articles per day or week, spread evenly" },
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
            state: "partial",
            note: "Opt-in pool: 1 credit per new article; its docs say credits may go unused",
          },
        },
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
          them: notFocus("not described on its site or docs"),
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
          them: { state: "partial", note: "$199 a month buys 50; the $99 plan covers 20" },
        },
        {
          label: "Volume and sites",
          detail: "Room to grow past one site.",
          rankbox: RANKBOX_CELLS.sites,
          them: {
            state: "yes",
            note: "Up to 300 articles a month; credits roll over and split across sites",
          },
        },
        {
          label: "Team members",
          detail: "Whether a teammate can log in with you.",
          rankbox: RANKBOX_CELLS.seats,
          them: { state: "yes", note: "Invite teammates; everyone has equal permissions" },
        },
      ],
    },
  ],

  pricing: {
    plan: "ULTIMATE",
    monthly: 199,
    articles: 50,
    covers: "50 articles a month; the cheapest plan that covers 30",
    caveat:
      "SEObot's $99 PRO plan covers 20 articles, so 30 a month means ULTIMATE. Credits never expire and can be split across sites. It has no public pricing page; these plans come from its help-center pricing doc.",
    checkedOn: "2026-09-21",
    plans: [
      { name: "BEGINNER", monthly: 49, articles: 9 },
      { name: "PRO", monthly: 99, articles: 20 },
      { name: "ULTIMATE", monthly: 199, articles: 50 },
      { name: "ENTERPRISE", monthly: 499, articles: 100, note: "Adds 20 directory listings" },
      { name: "EXTRA", monthly: 570, articles: 150 },
      { name: "MEGA", monthly: 1050, articles: 300 },
    ],
  },

  battlegroundsTitle: "Where the two actually differ",
  battlegroundsIntro:
    "Both are autopilots. These are the places where the choice changes what you pay and what lands on your site.",
  battlegrounds: [
    {
      featureSlug: "authority-backlinks",
      icon: Link2,
      title: "Backlink credits that don't depend on volume",
      body: `SEObot earns you one backlink credit per new article, placed from a pool of other customers' articles, and its docs say some credits may go unused. Rankbox grants ${PLAN.backlinkCreditsPerMonth} credits every month on the paid plan, and a placed link costs 1 to 3 credits by the host site's tier.`,
      points: [
        `${PLAN.backlinkCreditsPerMonth} credits a month, however many articles you publish`,
        "Links placed inside relevant articles, one member per article",
        "Credits held in escrow until the link is published and verified",
      ],
    },
    {
      featureSlug: "seo-geo-score",
      icon: Gauge,
      title: "Every draft is checked before it's ready",
      body: "SEObot has you approve headlines, then publishes what it writes. Rankbox checks every finished draft against its SEO rules and rewrites what fails, up to three times, before marking it ready. Sources are cited inline by default.",
      points: [
        "Failing checks fixed by rewriting, not left for you",
        "Sources cited inline and listed in a References section",
        "Direct answer, key takeaways, and FAQ in every article",
      ],
    },
    {
      featureSlug: "reddit-presence",
      icon: MessageSquare,
      title: "Reddit is part of the plan",
      body: "AI engines quote Reddit threads constantly. SEObot's site and docs don't cover Reddit. Rankbox finds the threads where your buyers are already asking, and drafts a reply for you to post under your own name.",
      points: [
        "Threads found from the searches your buyers run",
        "A reply drafted for each, written to help first",
        "You post it yourself; nothing goes out automatically",
      ],
    },
  ],

  betterWhen: [
    {
      title: "You need more than 30 articles a month",
      body: "SEObot sells up to 300 articles a month, and its credits never expire. If you are filling a large site quickly, Rankbox's one 30-article plan will be the bottleneck.",
    },
    {
      title: "You run several sites from one account",
      body: "SEObot lets you split one pool of credits across several websites, with teammates invited at equal permissions. Rankbox covers one site per plan.",
    },
    {
      title: "You publish somewhere unusual, or want programmatic pages",
      body: `SEObot publishes natively to nine platforms including Wix, Ghost, HubSpot, and Notion, and adds programmatic SEO, news articles, and YouTube-to-article. ${RANKBOX_PUBLISHING.sentence}.`,
    },
  ],

  migration: {
    title: "Switching from SEObot",
    body: "SEObot's docs say articles stay yours after you cancel, so nothing already published has to move. You can run both while you compare.",
    steps: [
      {
        title: "Point us at your site",
        body: "Paste your URL. Rankbox reads what is already published, including SEObot's articles, and learns your voice from it.",
      },
      {
        title: "Approve the plan",
        body: "You get a ranked list of buyer questions built around what the site already covers. Approve the ones you want and set a cadence.",
      },
      {
        title: "Connect publishing",
        body: "A developer points your site at the Rankbox publishing API once. Pause SEObot when the first Rankbox articles are live.",
      },
    ],
  },

  faqs: [
    {
      q: "Is Rankbox a real SEObot alternative?",
      a: "Yes. Both are SEO autopilots that plan topics, write long articles, and publish them on a schedule. SEObot is built to scale across volume and sites. Rankbox is built for one site that wants about an article a day at a low cost per article.",
    },
    {
      q: "Which is cheaper, Rankbox or SEObot?",
      a: `At 30 articles a month, Rankbox: ${formatUsd(PLAN.monthly)}, about ${formatUsd(RANKBOX_COST.perArticle)} an article. SEObot's plans are $49 for 9 articles, $99 for 20, and $199 for 50, so 30 a month means the $199 plan, about $3.98 an article. Plans were checked against SEObot's help-center pricing doc on 21 September 2026.`,
    },
    {
      q: "Are SEObot articles longer than Rankbox's?",
      a: "They can be. SEObot says its articles average 3,000 words and reach 4,000, though its docs say length can't be set directly. Rankbox writes about 2,750 words by default.",
    },
    {
      q: "Does Rankbox publish to WordPress and Wix like SEObot?",
      a: `${RANKBOX_PUBLISHING.sentence}. SEObot publishes natively to WordPress, Shopify, Webflow, Wix, Framer, Ghost, HubSpot, Notion, and Unicorn Platform, and supports Next.js, a REST API, and webhooks.`,
    },
    {
      q: "How do the backlink programmes compare?",
      a: `SEObot gives one backlink credit per new article, placed from a pool of other customers' articles, and says some credits may go unused. Rankbox grants ${PLAN.backlinkCreditsPerMonth} credits a month on the paid plan, charges 1 to 3 credits per placed link, and holds credits in escrow until the link is verified.`,
    },
    {
      q: "Does either track whether ChatGPT cites my brand?",
      a: SHIPPED.citationTracking
        ? "Rankbox does, across ChatGPT, Perplexity, Gemini, and Google AI Overviews. SEObot's site and docs don't describe AI citation tracking."
        : "Not yet. SEObot's site and docs don't describe AI citation tracking. Rankbox grades every article for how ready it is to be quoted by an answer engine, but live citation monitoring is not available yet either.",
    },
  ],

  sources: [
    {
      label: "SEObot pricing (help center)",
      url: "https://docs.seobotai.com/en/articles/10644453-what-s-seobot-pricing",
    },
    { label: "SEObot homepage", url: "https://seobotai.com/" },
    {
      label: "CMS integrations",
      url: "https://docs.seobotai.com/en/articles/10644432-what-cms-integrations-does-seobot-support",
    },
    {
      label: "Backlinks building",
      url: "https://docs.seobotai.com/en/articles/11831542-backlinks-building",
    },
    {
      label: "Credits across multiple websites",
      url: "https://docs.seobotai.com/en/articles/10692197-using-article-credits-across-multiple-websites",
    },
    {
      label: "Changing article length",
      url: "https://docs.seobotai.com/en/articles/10642249-how-to-change-the-length-of-articles-in-seobot",
    },
    {
      label: "Showing source citations",
      url: "https://docs.seobotai.com/en/articles/10696865-how-to-display-reference-numbers",
    },
  ],
  ctaTitle: "30 articles a month, for less than SEObot's 20",
  ctaBody:
    "Paste your URL. Rankbox builds your content plan free, then writes your first articles on a 7-day trial.",
};
