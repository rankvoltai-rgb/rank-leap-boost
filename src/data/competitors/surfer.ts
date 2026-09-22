/**
 * Surfer SEO — the content editor that scores a draft against the ranking
 * pages, now with an AI Search score, an AI article writer, and an AI Tracker.
 * Re-checked against surferseo.com and docs.surferseo.com on 2026-09-21,
 * which retired this page's first version: the Essential plan is gone (plans
 * were rebuilt in 2026), and Surfer now scores for AI search and tracks AI
 * citations. Plan allowances are stated per year on its pricing page.
 */
import { Search, PenLine, Send, Link2, Gauge, LineChart } from "lucide-react";
import { PLAN, formatUsd } from "../pricing";
import {
  RANKBOX_CELLS,
  RANKBOX_COST,
  RANKBOX_PUBLISHING,
  SHIPPED,
  notFocus,
  type Competitor,
} from "./shared";

export const surfer: Competitor = {
  slug: "surfer-seo",
  name: "Surfer SEO",
  domain: "surferseo.com",
  monogram: "S",
  accent: "#18b3a8",
  kind: "optimizer",
  category: "Content optimization platform",
  oneLiner: "A content editor that scores drafts for Google and AI search, plus an AI Tracker.",

  eyebrow: "Surfer SEO alternative",
  headline: { lead: "The Surfer SEO alternative", accent: "that writes and ships on its own" },
  subhead: `Surfer gives a writer the sharpest editor in the business: a live score for Google and AI search, and an AI Tracker on higher plans. Rankbox takes the writer out of the loop: it plans, writes, checks, and delivers 30 articles a month on your cadence, with backlinks and Reddit drafts, for ${formatUsd(PLAN.monthly)}.`,
  metaTitle: "Surfer SEO Alternative: Rankbox vs Surfer (2026 Comparison)",
  metaDescription:
    "Rankbox vs Surfer SEO, checked against Surfer's 2026 plans and docs: a scoring editor versus a content autopilot, cost per article, AI tracking, and when Surfer still wins.",

  shortAnswer: `Surfer SEO is a content optimization platform: writers draft in its editor against a live Content Score that combines on-page SEO with an AI Search score, Surfer AI can write full drafts, and higher plans add an AI Tracker for ChatGPT, Perplexity, Gemini, and Google's AI answers. Its Standard plan is $119 a month for 360 documents a year, about 30 a month. Rankbox is a content autopilot: it plans the questions your buyers ask, writes and checks 30 articles a month, delivers them on your cadence, and adds backlink credits and Reddit reply drafts for ${formatUsd(PLAN.monthly)} a month. Choose Surfer if people on your team write and want to tune every term. Choose Rankbox if nobody should have to open an editor.`,
  verdict: {
    rankbox: "Produces and delivers the article, then builds links around it.",
    them: "Scores the article a person writes, for Google and for AI search.",
  },

  snapshot: {
    bestFor: "Writers and SEOs tuning every draft",
    publishing: { state: "partial", short: "WordPress drafts; no scheduling" },
    backlinks: { state: "no", short: "Not offered" },
    aiVisibility: { state: "yes", short: "AI Tracker, 5 engines on Pro" },
    keywordData: { state: "yes", short: "Keyword research and clusters" },
  },
  specs: [
    { value: "SEO + GEO", label: "every draft checked for search and answer structure" },
    { value: `${PLAN.articlesPerMonth}/mo`, label: "articles written, checked, and delivered" },
    {
      value: formatUsd(RANKBOX_COST.perArticle),
      label: "per article, against Surfer's $3.97 on Standard",
    },
    {
      value: `${PLAN.backlinkCreditsPerMonth}/mo`,
      label: "backlink credits through the member exchange",
    },
  ],

  positioning: {
    title: "Surfer sharpens the page. Rankbox runs the programme.",
    body: "Surfer is a very good instrument for someone writing. The question is whether you want an instrument, or the finished pages it would help you make.",
    rankboxTitle: "What Rankbox owns",
    rankbox: [
      "Decides what to write, from the questions your buyers ask",
      "Writes it, from live research, with sources cited inline",
      "Checks it against SEO rules and rewrites what fails",
      "Delivers it on your cadence, up to one a day",
      "Trades backlinks and drafts Reddit replies around it",
    ],
    themTitle: "What Surfer owns",
    them: [
      "A live Content Score for SEO and AI search, term by term",
      "Surfer AI drafts, in 18 languages, inside the editor",
      "AI Tracker across ChatGPT, Perplexity, Gemini, and Google's AI answers",
      "Content audits from Search Console, and auto internal links on Pro",
      "Seats for a team, and share links for freelancers",
    ],
  },

  matrix: [
    {
      group: "Finding what to write",
      icon: Search,
      rows: [
        {
          label: "Topic research",
          detail: "Whether topics come to you, or you go and find them.",
          rankbox: RANKBOX_CELLS.research,
          them: {
            state: "yes",
            note: "Keyword research with clusters from Standard; a topical map from Search Console on Pro",
          },
        },
        {
          label: "Keyword volume & difficulty",
          detail: "Knowing a topic is winnable before an article is spent on it.",
          rankbox: RANKBOX_CELLS.keywordData,
          them: { state: "yes", note: "Keyword data in its research and clustering tools" },
        },
      ],
    },
    {
      group: "Writing the article",
      icon: PenLine,
      rows: [
        {
          label: "Writes the full article",
          detail: "Whether a finished draft exists without you typing it.",
          rankbox: RANKBOX_CELLS.writer,
          them: {
            state: "yes",
            note: "Surfer AI writes full drafts in the editor, each counted as a document",
          },
        },
        {
          label: "Inline source citations",
          detail: "Grounded claims, cited, which is what answer engines look for.",
          rankbox: RANKBOX_CELLS.citations,
          them: {
            state: "partial",
            note: "Surfer AI adds external links automatically since June 2026",
          },
        },
        {
          label: "Brand voice",
          detail: "Sounding like you, not like the average of page one.",
          rankbox: RANKBOX_CELLS.voice,
          them: { state: "yes", note: "Custom voice and templates for Surfer AI drafts" },
        },
      ],
    },
    {
      group: "Scoring quality",
      icon: Gauge,
      rows: [
        {
          label: "On-page SEO score",
          detail: "Terms, headings, length, and structure against the live SERP.",
          rankbox: {
            state: "yes",
            note: "Structure, headings, links, readability, and keyword use",
          },
          them: {
            state: "yes",
            note: "Content Score with per-term usage ranges against the ranking pages",
          },
        },
        {
          label: "AI search score",
          detail: "Whether the page is shaped to be quoted, not just ranked.",
          rankbox: RANKBOX_CELLS.answerStructure,
          them: {
            state: "yes",
            note: "An AI Search score for fact coverage and a direct-answer intro, inside Content Score",
          },
        },
        {
          label: "Acts on the score",
          detail: "A gate, not a dashboard.",
          rankbox: RANKBOX_CELLS.score,
          them: { state: "partial", note: "Guides the writer; auto-optimize suggests fixes" },
        },
      ],
    },
    {
      group: "Shipping it",
      icon: Send,
      rows: [
        {
          label: "Publishes to your CMS",
          detail: "Content leaving the tool without a copy-paste.",
          rankbox: RANKBOX_CELLS.publish,
          them: {
            state: "partial",
            note: "Sends WordPress drafts; Contentful on Pro, Zapier and API on Peace of Mind",
          },
        },
        {
          label: "Runs on a schedule",
          detail: "Daily output without anyone remembering to do it.",
          rankbox: RANKBOX_CELLS.autopilot,
          them: notFocus("a person opens the editor each time"),
        },
      ],
    },
    {
      group: "Growing authority",
      icon: Link2,
      rows: [
        {
          label: "Backlink building",
          detail: "Off-page authority, not just on-page structure.",
          rankbox: RANKBOX_CELLS.backlinks,
          them: notFocus("an on-page tool by design"),
        },
        {
          label: "Reddit presence",
          detail: "Where answer engines go looking for opinion.",
          rankbox: RANKBOX_CELLS.reddit,
          them: notFocus(),
        },
      ],
    },
    {
      group: "Measuring AI visibility",
      icon: LineChart,
      rows: [
        {
          label: "AI citation tracking",
          detail: "Whether the answer engine names you at all.",
          rankbox: RANKBOX_CELLS.tracking,
          them: {
            state: "yes",
            note: "AI Tracker: ChatGPT weekly on Standard; five engines daily on Pro",
          },
        },
        {
          label: "Share of voice and sentiment",
          detail: "Your visibility against competitors, per prompt.",
          rankbox: RANKBOX_CELLS.shareOfAnswer,
          them: {
            state: "yes",
            note: "Mentions, cited sources, sentiment, and gaps against competitors",
          },
        },
      ],
    },
  ],

  pricing: {
    plan: "Standard",
    monthly: 119,
    articles: 30,
    covers: "360 documents a year, 3 seats, 1 site, 25 prompts tracked in ChatGPT",
    caveat:
      "Surfer sells documents by the year: 360 on Standard, which averages 30 a month, and an AI-written article counts as one. Billed annually it's $99 a month. The price buys an editor and tracking; delivering and publishing each article is still a person's job.",
    checkedOn: "2026-09-21",
    plans: [
      { name: "Discovery", monthly: 59, articles: 10, note: "120 documents a year · 1 seat" },
      {
        name: "Standard",
        monthly: 119,
        articles: 30,
        note: "360 a year · 3 seats · ChatGPT tracked",
      },
      { name: "Pro", monthly: 219, articles: 30, note: "360 a year · 5 seats · 5 engines tracked" },
      {
        name: "Peace of Mind",
        monthly: 359,
        articles: null,
        note: "Unlimited under fair use · 10 seats",
      },
    ],
    ladderNote:
      "Surfer states document allowances per year; articles a month here are that figure divided by 12.",
  },

  battlegrounds: [
    {
      featureSlug: "citation-ready-writer",
      icon: PenLine,
      title: "There's nothing to open",
      body: "Surfer's editor, and Surfer AI inside it, are built for a person steering each draft. Rankbox starts with a finished, researched article and has already checked it. The work Surfer helps someone do is work nobody on your side has to do.",
      points: [
        "About 2,750 words, written from live web research",
        "Sources cited inline and listed in a References section",
        "Written in your brand voice from the first draft",
      ],
    },
    {
      featureSlug: "seo-geo-score",
      icon: Gauge,
      title: "A score that acts, not advises",
      body: "Surfer's Content Score tells a writer what to change. Rankbox's checks do the changing: a draft that fails is rewritten against the checks it failed, up to three times, before it's marked ready. Every article carries the structure answer engines quote.",
      points: [
        "SEO: structure, headings, internal links, readability, keyword use",
        "Answer structure: direct answer, key takeaways, cited sources, FAQ",
        "Failing checks fixed by rewriting, not left for you",
      ],
    },
    {
      featureSlug: "authority-backlinks",
      icon: Link2,
      title: "Off-page work, in the same plan",
      body: `Surfer is an on-page tool by design. Rankbox also works off the page: ${PLAN.backlinkCreditsPerMonth} backlink credits a month through a member exchange, and Reddit reply drafts for the threads your buyers read.`,
      points: [
        `${PLAN.backlinkCreditsPerMonth} credits a month, spent on links placed in relevant articles`,
        "Reddit threads found and replies drafted for you to post",
        `Both on the ${formatUsd(PLAN.monthly)} plan`,
      ],
    },
  ],

  betterWhen: [
    {
      title: "You are an SEO who wants the controls",
      body: "Surfer's per-term guidance against the live SERP is genuinely excellent, and Rankbox deliberately hides that layer. If tuning a draft is the job you enjoy and are good at, Surfer is the better instrument.",
    },
    {
      title: "You need AI tracking and a team editor",
      body: SHIPPED.citationTracking
        ? "Surfer's Pro plan tracks five AI engines daily alongside a multi-seat editor, content audits, and auto internal links. Compare the engines and prompts you need."
        : "Surfer's Pro plan tracks ChatGPT, Perplexity, Gemini, and Google's AI answers daily, alongside a five-seat editor, content audits, and auto internal links. Rankbox doesn't monitor citations yet.",
    },
    {
      title: "You run content for clients",
      body: `Agencies need an auditable deliverable: a score to show, a document to hand over, a client who owns the CMS. Surfer fits that shape, with seats and freelancer share links. ${RANKBOX_PUBLISHING.sentence}.`,
    },
  ],

  migration: {
    title: "Running Rankbox alongside Surfer",
    body: "These two don't really collide, so there's no migration. Many people simply stop needing the editor once nothing is arriving that needs optimizing by hand.",
    steps: [
      {
        title: "Point us at your site",
        body: "Rankbox reads what you've already published, including everything you optimized in Surfer, and learns your voice from it.",
      },
      {
        title: "Compare the first article",
        body: "Open the first Rankbox article in Surfer's editor and see where its Content Score lands before you touch it.",
      },
      {
        title: "Connect publishing",
        body: "A developer points your site at the Rankbox publishing API once. Keep Surfer for the pages you still hand-write.",
      },
    ],
  },

  faqs: [
    {
      q: "Is Rankbox a replacement for Surfer SEO?",
      a: "For teams that want finished articles rather than a better editor, yes. Surfer helps a person write and optimize a draft, and tracks AI answers on its higher plans. Rankbox plans, writes, checks, and delivers the article itself, and adds backlink credits and Reddit drafts. If nobody on your team wants to optimize by hand, the editor stops being the thing you need.",
    },
    {
      q: "Does Rankbox score content the way Surfer does?",
      a: "It checks the same on-page fundamentals, structure, headings, internal links, readability, and keyword use, and builds in the structure answer engines quote. Surfer goes deeper on term-by-term guidance against the live SERP, and scores AI-search readiness too. The difference is that Rankbox rewrites a draft that fails its checks, while Surfer guides the writer.",
    },
    {
      q: "Does Surfer SEO track ChatGPT and Perplexity now?",
      a: "Yes. Surfer's AI Tracker covers ChatGPT on the Standard plan, weekly, and ChatGPT, Perplexity, Gemini, Google AI Mode, and AI Overviews daily on Pro. It shows mentions, cited sources, sentiment, and gaps against competitors.",
    },
    {
      q: "Which costs less per article?",
      a: `Rankbox is ${formatUsd(PLAN.monthly)} a month for ${PLAN.articlesPerMonth} researched, checked, and delivered articles, about ${formatUsd(RANKBOX_COST.perArticle)} each. Surfer's Standard plan is $119 a month, or $99 billed annually, for 360 documents a year, about $3.97 each on monthly billing, and a person still publishes them. Prices were checked on Surfer's pricing page on 21 September 2026.`,
    },
    {
      q: "Can I use Rankbox and Surfer together?",
      a: "Yes, and it's a reasonable way to evaluate. Open a Rankbox article in Surfer's editor and see what Content Score it lands at before you edit a word.",
    },
    {
      q: "Do I need any SEO knowledge to use Rankbox?",
      a: "No. That's largely the point. Surfer assumes someone who knows what to do with a term-usage range. Rankbox makes the decisions, enforces its own checks, and delivers the article.",
    },
  ],

  sources: [
    { label: "Surfer pricing", url: "https://surferseo.com/pricing/" },
    {
      label: "Subscription migration FAQ",
      url: "https://docs.surferseo.com/en/articles/12944180-subscription-migration-faq",
    },
    {
      label: "Content Score explained",
      url: "https://docs.surferseo.com/en/articles/5700365-content-score-in-the-editor-explained",
    },
    { label: "AI Tracker", url: "https://surferseo.com/ai-tracker/" },
    {
      label: "Exporting to WordPress",
      url: "https://docs.surferseo.com/en/articles/9071075-how-to-export-content-between-surfer-and-wordpress",
    },
    {
      label: "Fair usage policy",
      url: "https://docs.surferseo.com/en/articles/12944161-fair-usage-policy",
    },
  ],
  ctaTitle: "Stop optimizing drafts that don't exist yet",
  ctaBody:
    "Paste your URL. Rankbox maps your buyer questions, writes the first article with sources, checks it, and shows you the result.",
};
