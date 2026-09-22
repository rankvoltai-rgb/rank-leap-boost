/**
 * RankPill — the closest product to Rankbox on the market: one plan, 30
 * articles a month for one site, 30 backlink credits, Reddit reply drafts.
 * The honest comparison is price, link economics, and plumbing, so that is
 * what this page argues. Checked against rankpill.com on 2026-09-21.
 */
import { Search, PenLine, Send, Link2, Quote, Gauge } from "lucide-react";
import { PLAN, formatUsd } from "../pricing";
import {
  RANKBOX_CELLS,
  RANKBOX_COST,
  RANKBOX_PUBLISHING,
  SHIPPED,
  type Competitor,
} from "./shared";

export const rankpill: Competitor = {
  slug: "rankpill",
  name: "RankPill",
  domain: "rankpill.com",
  monogram: "RP",
  accent: "#171717",
  kind: "autopilot",
  category: "AI SEO autopilot",
  oneLiner: "One plan: 30 articles a month for one site, backlinks, and Reddit drafts.",

  eyebrow: "RankPill alternative",
  headline: { lead: "The RankPill alternative", accent: "at half the monthly price" },
  subhead: `RankPill and Rankbox are built to do the same job: research your topics, write 30 long-form articles a month, trade backlinks through a member exchange, and draft your Reddit replies. RankPill's one plan is $99 a month. Rankbox is ${formatUsd(PLAN.monthly)}.`,
  metaTitle: "RankPill Alternative: Rankbox vs RankPill (2026 Comparison)",
  metaDescription:
    "Rankbox vs RankPill, checked against RankPill's own pages: the same 30-article autopilot at half the monthly price, how backlink credits differ, and when RankPill is the better buy.",

  shortAnswer: `RankPill and Rankbox are the same kind of product. Both research topics for your site, write about 30 long-form articles a month for one website, include 30 backlink credits through a member exchange, and draft Reddit replies for you to post. The differences are price, link economics, and plumbing. Rankbox costs ${formatUsd(PLAN.monthly)} a month; RankPill's single Business plan is $99 a month, or $82.50 a month billed annually. RankPill publishes natively to WordPress, Shopify, Wix, Webflow, and Framer and shows keyword volume and difficulty from DataForSEO. Choose RankPill for native CMS connectors, measured keyword data, or many languages. Choose Rankbox for the same monthly output at half the monthly price.`,
  verdict: {
    rankbox: `The same 30-article autopilot, at ${formatUsd(PLAN.monthly)} a month.`,
    them: "A mature autopilot with native CMS connectors, at $99 a month.",
  },

  snapshot: {
    bestFor: "Sites that need native CMS connectors",
    publishing: { state: "yes", short: "WordPress, Shopify, Wix, Webflow, Framer" },
    backlinks: { state: "yes", short: "30 credits; links priced by DR" },
    aiVisibility: { state: "no", short: "Listed as coming soon" },
    keywordData: { state: "yes", short: "DataForSEO volume and difficulty" },
  },
  specs: [
    { value: formatUsd(PLAN.monthly), label: "a month for 30 articles, against RankPill's $99" },
    { value: formatUsd(RANKBOX_COST.perArticle), label: "per article, against RankPill's $3.30" },
    { value: "1–3", label: "credits per exchange link, set by the host site's tier" },
    { value: "~2,750", label: "words per article by default, from live research" },
  ],

  positioning: {
    title: "Same job. Half the monthly price. Different plumbing.",
    body: "Rankbox and RankPill set out to do the same thing, and most rows below match. The real differences are what a month costs, how a backlink is priced, and how an article reaches your site.",
    rankboxTitle: "Where Rankbox differs",
    rankboxTag: "The same autopilot, priced lower",
    rankbox: [
      `${formatUsd(PLAN.monthly)} a month for ${PLAN.articlesPerMonth} articles on one site`,
      "Exchange links cost 1–3 credits each, by the host site's tier",
      "About 2,750 words per article, drafted from the pages ranking now",
      "Every draft re-run against its failing SEO checks until it passes",
      "Reddit reply drafts and backlink credits in the same plan",
    ],
    themTitle: "Where RankPill differs",
    them: [
      "Native connectors for WordPress, Shopify, Wix, Webflow, and Framer",
      "Keyword volume and difficulty from DataForSEO, per country and language",
      "Articles in more than 100 languages, by its own count",
      "Backlink add-ons of up to 1,500 credits a month",
      "Multi-site discounts of 10–20%, and unlimited team members",
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
            note: "Keyword research with competitor-gap crawling and topic clusters",
          },
        },
        {
          label: "Keyword volume & difficulty",
          detail: "Knowing a topic is winnable before an article is spent on it.",
          rankbox: RANKBOX_CELLS.keywordData,
          them: {
            state: "yes",
            note: "Volume and difficulty from DataForSEO, for your country and language",
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
            note: "Pulls the live top 10 per keyword; its FAQ puts informational articles at 1,800–2,400 words",
          },
        },
        {
          label: "Inline source citations",
          detail: "AI engines cite pages that themselves cite sources.",
          rankbox: RANKBOX_CELLS.citations,
          them: {
            state: "yes",
            note: "Facts, stats, and quotes cited inline, per its writer page",
          },
        },
        {
          label: "Brand voice",
          detail: "Sounding like you without an editing pass.",
          rankbox: RANKBOX_CELLS.voice,
          them: { state: "yes", note: "Tone of voice, image style, and custom instructions" },
        },
        {
          label: "Quality gate",
          detail: "Something that checks a draft before it goes live.",
          rankbox: RANKBOX_CELLS.score,
          them: { state: "yes", note: "An article score out of 100 for SEO and GEO factors" },
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
            note: "WordPress plugin, Shopify, Wix, and Webflow connectors, a Framer plugin, and webhooks",
          },
        },
        {
          label: "Runs on a schedule",
          detail: "Consistency is the whole game in search.",
          rankbox: RANKBOX_CELLS.autopilot,
          them: { state: "yes", note: "Up to one article a day on autopilot" },
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
            note: "30 credits a month; each link costs credits equal to the host site's Domain Rating",
          },
        },
        {
          label: "Reddit presence",
          detail: "AI engines lean heavily on forum discussion.",
          rankbox: RANKBOX_CELLS.reddit,
          them: {
            state: "yes",
            note: "Finds Reddit threads that rank on Google and drafts a comment you post",
          },
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
          them: { state: "no", note: "Listed on its homepage as coming soon" },
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
          them: { state: "yes", note: "$99 a month, or $82.50 a month billed annually" },
        },
        {
          label: "More than one site",
          detail: "Whether a second site means a second plan.",
          rankbox: RANKBOX_CELLS.sites,
          them: { state: "yes", note: "Each site is its own plan, 10–20% off in volume" },
        },
        {
          label: "Team members",
          detail: "Whether a teammate can log in with you.",
          rankbox: RANKBOX_CELLS.seats,
          them: { state: "yes", note: "Unlimited team members" },
        },
      ],
    },
  ],

  pricing: {
    plan: "Business",
    monthly: 99,
    articles: 30,
    covers: "30 articles a month, 1 website, 30 backlink credits",
    caveat:
      "The same shape of plan as Rankbox at twice the monthly price. Annual billing brings it to $82.50 a month. Its exchange page says each backlink costs credits equal to the host site's Domain Rating.",
    checkedOn: "2026-09-21",
    plans: [
      { name: "Business", monthly: 99, articles: 30, note: "Billed monthly" },
      {
        name: "Business, quarterly",
        monthly: 89,
        articles: 30,
        note: "Billed $267 every 3 months",
      },
      { name: "Business, annual", monthly: 82.5, articles: 30, note: "Billed $990 a year" },
    ],
  },

  battlegroundsTitle: "Where the two actually differ",
  battlegroundsIntro:
    "Most of the matrix matches. These are the three places where choosing one over the other changes what you get.",
  battlegrounds: [
    {
      featureSlug: "authority-backlinks",
      icon: Link2,
      title: "The same 30 credits buy more links",
      body: "Both products run a member exchange and include 30 credits a month. RankPill's exchange page says each link costs credits equal to the referring site's Domain Rating. On Rankbox a placed link costs 1 to 3 credits, set by the host site's tier, so the monthly allowance goes further.",
      points: [
        "1 credit for most host sites, up to 3 for the strongest tier",
        "Each link placed inside a relevant article, one member per article",
        "Credits held in escrow until the link is published and verified",
      ],
    },
    {
      featureSlug: "answer-space-research",
      icon: Search,
      title: "Planned around questions, not keyword lists",
      body: "RankPill's research starts from keywords and measured search volume. Rankbox reads your site and plans around the questions your buyers ask, phrased the way people put them to an answer engine. RankPill's numbers are measured; Rankbox's demand figures are AI estimates. Pick the trade-off that suits how you plan.",
      points: [
        "A plan of buyer questions built from your own site",
        "Question-shaped topics, the way people ask AI engines",
        "Demand and intent shown as estimates, not database figures",
      ],
    },
    {
      featureSlug: "seo-geo-score",
      icon: Gauge,
      title: "A draft that fails its checks gets rewritten",
      body: "Both products score articles. Rankbox also acts on the score: every draft is re-run against the SEO checks it failed, up to three times, before it is marked ready. The structure answer engines quote, a direct answer up top, key takeaways, sources, and an FAQ, is built into every article.",
      points: [
        "Failing checks fixed by rewriting, not flagged for you to fix",
        "Direct answer, key takeaways, and FAQ in every article",
        "Sources from the research cited inline and in a References list",
      ],
    },
  ],

  betterWhen: [
    {
      title: "Your site runs on Shopify, Wix, Webflow, or Framer",
      body: `RankPill documents native connectors for WordPress, Shopify, Wix, and Webflow, a Framer plugin, and webhooks for anything else. ${RANKBOX_PUBLISHING.sentence}. If nobody on your team can connect an API, RankPill is simpler today.`,
    },
    {
      title: "You want to see the keyword numbers",
      body: "RankPill shows search volume and keyword difficulty from DataForSEO for your target country and language, and crawls competitor URLs for gaps. Rankbox estimates demand with AI instead. If you plan by measured volume, RankPill gives you the figures.",
    },
    {
      title: "You publish in many languages, or run many sites",
      body: "RankPill says it writes in more than 100 languages, discounts multi-site plans by up to 20%, sells backlink add-ons of up to 1,500 credits a month, and includes unlimited team members. Rankbox covers one site per plan.",
    },
  ],

  migration: {
    title: "Switching from RankPill",
    body: "Everything RankPill already published stays on your site. The only real work is deciding how new articles arrive, and you can run both for a few weeks while you compare.",
    steps: [
      {
        title: "Point us at your site",
        body: "Paste your URL. Rankbox reads what is already published, including RankPill's articles, and learns your voice from it.",
      },
      {
        title: "Approve the plan",
        body: "You get a ranked list of buyer questions built around what the site already covers. Approve the ones you want and set a cadence.",
      },
      {
        title: "Connect publishing",
        body: "A developer points your site at the Rankbox publishing API once. Keep RankPill running until the first Rankbox articles are live.",
      },
    ],
  },

  faqs: [
    {
      q: "Is Rankbox a real RankPill alternative?",
      a: "Yes. They are the same kind of product: both research topics for one website, write about 30 long-form articles a month on a schedule, include 30 backlink credits through a member exchange, and draft Reddit replies you post yourself. The differences are price, how backlink credits are spent, and how articles reach your site.",
    },
    {
      q: "Which is cheaper, Rankbox or RankPill?",
      a: `Rankbox. It is ${formatUsd(PLAN.monthly)} a month for ${PLAN.articlesPerMonth} articles, about ${formatUsd(RANKBOX_COST.perArticle)} each. RankPill's Business plan is $99 a month, about $3.30 an article, or $82.50 a month on annual billing, about $2.75 an article. Prices were checked on RankPill's pricing page on 21 September 2026.`,
    },
    {
      q: "Does Rankbox publish to WordPress and Shopify like RankPill?",
      a: `${RANKBOX_PUBLISHING.sentence}. RankPill documents native connectors for WordPress, Shopify, Wix, and Webflow, plus a Framer plugin and webhooks.`,
    },
    {
      q: "How do the backlink credits compare?",
      a: "Both plans include 30 backlink credits a month through a member exchange. RankPill's exchange page says each link costs credits equal to the referring site's Domain Rating. On Rankbox a placed link costs 1 to 3 credits depending on the host site's tier, and credits stay in escrow until the link is published and verified.",
    },
    {
      q: "Does either track whether ChatGPT cites my brand?",
      a: SHIPPED.citationTracking
        ? "Rankbox does, across ChatGPT, Perplexity, Gemini, and Google AI Overviews. RankPill lists AI visibility tracking as coming soon."
        : "Not yet, on either. RankPill lists AI visibility tracking as coming soon. Rankbox grades every article for how ready it is to be quoted by an answer engine, but live citation monitoring is not available yet either.",
    },
    {
      q: "Can I run Rankbox and RankPill at the same time?",
      a: "Yes, and it is a fair way to compare. Rankbox reads what is already on your site when it builds its plan, so the two are less likely to write the same article twice. Compare what each publishes over a few weeks, then keep the one that earns its price.",
    },
  ],

  sources: [
    { label: "RankPill pricing", url: "https://rankpill.com/pricing" },
    { label: "RankPill homepage", url: "https://rankpill.com/" },
    { label: "Backlink exchange", url: "https://rankpill.com/backlink-exchange" },
    { label: "SEO content writer", url: "https://rankpill.com/seo-content-writer" },
    { label: "Keyword research tool", url: "https://rankpill.com/keyword-research-tool" },
    { label: "Reddit marketing", url: "https://rankpill.com/reddit-marketing" },
    { label: "Help center: integrations", url: "https://rankpill.com/help" },
  ],
  ctaTitle: "The same autopilot, at half the monthly bill",
  ctaBody:
    "Paste your URL. Rankbox builds your content plan free, then writes your first articles on a 7-day trial.",
};
