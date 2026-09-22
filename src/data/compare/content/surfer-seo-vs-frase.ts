import { PLAN, formatUsd } from "@/data/pricing";
import type { MatchupEntry } from "../types";

/* Researched 2026-09-21 from both vendors' pricing pages (Surfer's monthly
   prices read from the page's own plan data), help centres, changelogs and
   feature pages. Surfer moved to new plans in 2026 after Positive bought it;
   Frase was rebuilt from scratch in February 2026, so most published Frase
   reviews describe a product that no longer exists. Frase's own vs-Surfer page
   gets Surfer's MCP and AI Tracker wrong; the facts here come from Surfer. */
export const entry: MatchupEntry = {
  slug: "surfer-seo-vs-frase",
  metaTitle: "Surfer SEO vs Frase (2026): Which Content Tool Fits You?",
  metaDescription:
    "Surfer SEO vs Frase in 7 rounds: content scores, AI writing, keyword research, refreshes, AI search tracking and price, with September 2026 plans and a quiz.",
  keywords: [
    "surfer seo vs frase",
    "frase vs surfer seo",
    "surfer vs frase",
    "frase vs surfer",
    "surfer seo or frase",
    "surfer seo vs frase pricing",
    "frase alternative",
    "surfer seo alternative",
  ],
  subhead:
    "Both grade a draft against what ranks and add an AI-search score. Surfer goes deeper on keyword and topic research; the rebuilt Frase goes further into drafting, publishing, refreshing and AI tracking on a small budget.",
  shortAnswer:
    "**Surfer SEO** is built around its Content Editor: it grades drafts against the live SERP, researches keywords and topics, audits published pages, and tracks five AI engines from its Pro plan. **Frase**, rebuilt from scratch in February 2026, runs through to publishing: its agent drafts articles, publishes them to your CMS and republishes fixes, with AI search tracking on every plan. Choose Surfer SEO if keyword research and a deep editor matter most and you'll pay for Pro. Choose Frase if you're a small team that wants drafting, publishing and AI tracking for less.",
  picks: {
    a: [
      "Keyword research with volume and difficulty is how you plan content",
      "A team of three to ten works each draft by hand in one editor",
      "You want Google AI Mode and AI Overviews tracked daily, and will pay for Pro",
    ],
    b: [
      "You want drafts published straight to WordPress, Webflow, Sanity or Wix",
      "You're one to three people and want AI tracking and an API from $39 a month",
      "You'd like to try it for a week without entering a card",
    ],
  },
  tape: [
    {
      label: "What it is",
      a: "Content editor and AI visibility platform",
      b: "Content operating system for AI search",
    },
    {
      label: "Owned by",
      a: "Positive (France), since October 2025",
      b: "Copysmith AI, since October 2022",
    },
    { label: "Starts at", a: "$49/mo yearly · $59 monthly", b: "$39/mo yearly · $49 monthly" },
    { label: "Free trial", a: "7 days of Pro, card required", b: "7 days, no card needed" },
    {
      label: "AI search tracking",
      a: "From Standard · 5 engines daily on Pro",
      b: "Every plan · 5 engines on Scale",
    },
    {
      label: "AI articles a month",
      a: "30 documents on Standard and Pro",
      b: "10, 40 or 100 by plan",
    },
    {
      label: "Keyword research",
      a: "Volume, difficulty, clusters from Standard",
      b: "Topic clusters and SERP research",
    },
    { label: "API", a: "Peace of Mind and Enterprise", b: "Every plan, with MCP and a CLI" },
  ],
  rounds: [
    {
      id: "content-scoring",
      title: "Content scoring",
      winner: "draw",
      verdict:
        "Draw: both grade drafts live against the ranking pages, with an AI-search score beside the SEO one. Ahrefs' 2025 study found only weak links between content-tool scores and rankings, so treat either as a checklist.",
      a: "Surfer's **Content Score** is split into an SEO Score and an AI Search Score, whose Intent Alignment check reads the intro and facts. Its guidelines list entities with recommended placement and frequency, and you can edit the competitor list it scores against.",
      b: "Frase gives a live SEO score against the pages ranking for the query, with a ranked list of what to add, and a separate **GEO score** with named fixes: a direct answer up top, the entities the topic expects, a citable fact. Its guidance works in topics and entities rather than term counts.",
    },
    {
      id: "briefs",
      title: "Briefs & research",
      winner: "draw",
      verdict:
        "Draw: Frase's research ends in a structured brief, while Surfer builds the outline inside its editor and adds a Topical Map on Pro.",
      a: "Surfer's **Outline Builder** sits inside the Content Editor, which analyzes the top-ranking competitors for the query. From Standard up, a shareable link lets writers without a Surfer seat edit the draft against live guidelines.",
      b: "Frase reads the ranking pages for structure and word count, surfaces the gaps, and ends in a **brief** listing the headings, sections, keywords and sources to cover. Its free SERP analyzer runs the same kind of read without an account.",
    },
    {
      id: "ai-writing",
      title: "AI writing & publishing",
      winner: "b",
      verdict:
        "Frase, on volume and reach: 40 articles a month on Professional against 30 Surfer documents on Standard or Pro, published straight to your CMS.",
      a: "**Surfer AI** writes a full article of 2,000 words or more in about 20 minutes, in 18 languages, and has added internal and external links since June 2026. Each one uses a Document, the same limit as a manual editor, and it reaches your site through the WordPress plugin, Contentful or Google Docs, from Standard up.",
      b: "Frase's agent drafts full articles with images in your brand voice, 10, 40 or 100 a month by plan, in 70+ languages. It publishes to WordPress (filling Yoast and Rank Math fields), Webflow, Sanity, Wix or its hosted **FraseCMS**, and publishes on its own only if you switch that on.",
    },
    {
      id: "keyword-research",
      title: "Keyword & topic research",
      winner: "a",
      verdict:
        "Surfer, clearly: keyword research with volume, difficulty and clusters from Standard, a Topical Map from Pro, and the free Keyword Surfer extension.",
      a: "Surfer's Keyword Research shows volume, difficulty and clusters from the Standard plan. Its **Topical Map** finds competitive gaps and semantic clusters from Pro, and the free Keyword Surfer Chrome extension covers 70 countries.",
      b: "Frase's **Topic Clusters** map pillar and supporting pages, detect gaps and suggest new clusters, alongside SERP and question research. Its current feature pages don't show search volume or difficulty, so plan to bring demand data from another tool.",
    },
    {
      id: "refresh",
      title: "Refreshing existing content",
      winner: "b",
      verdict:
        "Frase, narrowly: Content Guard reads Search Console, drafts the fix and republishes it on your approval, and a site audit comes with every plan.",
      a: "Surfer's **Content Audit** reads Search Console for 10 to 500 tracked pages by plan and sends weekly opportunity emails, with rank-drop alerts from Standard. Auto-Optimize reworks a page in the editor; the site Audit and cannibalization report start at Pro, and republishing is yours to do.",
      b: "**Content Guard** reads Search Console, drafts a fix and republishes on approval, or automatically if you opt in, on 10, 75 or 300 pages by plan. Site Audit checks technical, content and AI-readiness issues, cannibalization included, metered at 50 to 1,000 pages a month.",
    },
    {
      id: "ai-search",
      title: "AI search tracking",
      winner: "draw",
      verdict:
        "Draw: Frase tracks more prompts per dollar and on every plan, while Surfer covers all five of its engines, Google AI Mode included, from Pro.",
      a: "Surfer's **AI Tracker** comes with every plan from Standard, which tracks 25 prompts on ChatGPT weekly. Pro tracks 50 prompts daily across ChatGPT, Perplexity, Gemini, Google AI Mode and AI Overviews, with mention gap, sentiment, exact answers and fan-out queries.",
      b: "Frase's **AI Visibility** tracks daily on every plan: 50 prompts on ChatGPT and Google AI on Starter, 200 adding Perplexity on Professional, 500 adding Claude and Gemini on Scale. It reports cited URLs and their positions, sentiment, 40+ countries and competitor benchmarks; fixes are a separate step.",
    },
    {
      id: "pricing",
      title: "Pricing & value for a small team",
      winner: "b",
      verdict:
        "Frase, for a small team: it starts lower, includes AI tracking, site audits and the API on every plan, and its trial needs no card.",
      a: "Surfer's Discovery plan is $49 a month billed yearly and doesn't include AI tracking, keyword research or integrations, so Standard, at $99 with three seats, is the realistic entry. Its 7-day Pro trial takes a card and converts to a paid plan unless you cancel.",
      b: "Frase Starter is $39 a month billed yearly with one seat, AI tracking and 5,000 API requests; Professional is $103 with three seats, close to Surfer Standard. Its 7-day trial needs no card, and overage stays off unless you turn it on.",
    },
  ],
  matrix: [
    {
      group: "Optimize & write",
      rows: [
        {
          label: "Live content score",
          a: { state: "yes", note: "SEO Score and AI Search Score against the SERP" },
          b: { state: "yes", note: "SEO score plus a separate GEO score" },
        },
        {
          label: "Term & entity guidance",
          a: { state: "yes", note: "Entities with placement and frequency targets" },
          b: { state: "partial", note: "Topics, questions and expected entities; no term counts" },
        },
        {
          label: "Briefs & outlines",
          a: { state: "yes", note: "Outline Builder; shareable editor links from Standard" },
          b: { state: "yes", note: "Research ends in a structured brief" },
        },
        {
          label: "AI article drafting",
          a: { state: "yes", note: "Surfer AI in 18 languages; shares the Documents limit" },
          b: { state: "yes", note: "Agent drafts with images; 10, 40 or 100 a month" },
        },
        {
          label: "Languages",
          a: { state: "yes", note: "Editor: all languages · AI writing: 18" },
          b: { state: "yes", note: "70+ languages, per Frase" },
        },
      ],
    },
    {
      group: "Research & refresh",
      rows: [
        {
          label: "Keyword research",
          a: { state: "yes", note: "Volume, difficulty and clusters from Standard" },
          b: { state: "partial", note: "SERP and question research; volume not documented" },
        },
        {
          label: "Topic mapping",
          a: { state: "partial", note: "Topical Map, from Pro" },
          b: { state: "yes", note: "Topic Clusters: pillars, gaps, suggestions" },
        },
        {
          label: "Content audit & decay",
          a: { state: "yes", note: "Search Console audit of 10–500 pages; rank-drop alerts" },
          b: { state: "yes", note: "Site Audit on every plan, metered by pages" },
        },
        {
          label: "Refresh & republish",
          a: { state: "partial", note: "Auto-Optimize in the editor; you republish" },
          b: { state: "yes", note: "Content Guard drafts fixes, republishes on approval" },
        },
        {
          label: "Internal linking",
          a: { state: "partial", note: "Inserts up to 10 links in one click, from Pro" },
          b: { state: "partial", note: "Suggestions from Professional" },
        },
      ],
    },
    {
      group: "AI search",
      rows: [
        {
          label: "AI visibility tracking",
          a: { state: "yes", note: "From Standard; daily on 5 engines from Pro" },
          b: { state: "yes", note: "Every plan; engines added by tier" },
        },
        {
          label: "Engines covered",
          a: { state: "yes", note: "ChatGPT, Perplexity, Gemini, AI Mode, AI Overviews" },
          b: { state: "yes", note: "ChatGPT, Google AI, Perplexity; Claude, Gemini on Scale" },
        },
        {
          label: "Sentiment & competitor gaps",
          a: { state: "yes", note: "Mention gap and sentiment" },
          b: { state: "yes", note: "Sentiment and competitor benchmarks" },
        },
      ],
    },
    {
      group: "Publishing & plan",
      rows: [
        {
          label: "Publishes to your CMS",
          a: { state: "partial", note: "WordPress plugin, Contentful, Zapier from Standard" },
          b: { state: "yes", note: "WordPress, Webflow, Sanity, Wix, FraseCMS" },
        },
        {
          label: "Auto-publishing",
          a: { state: "no", note: "Not its focus: optimize, export, monitor" },
          b: { state: "yes", note: "Agent publishes on its own if you switch it on" },
        },
        {
          label: "API & MCP",
          a: { state: "partial", note: "API from Peace of Mind; MCP in beta from Pro" },
          b: { state: "yes", note: "REST API, MCP server and CLI on every plan" },
        },
        {
          label: "Seats",
          a: { state: "yes", note: "1, 3, 5 or 10 by plan" },
          b: { state: "partial", note: "1, 3 or 5; extra seats $29 a month" },
        },
        {
          label: "Free trial",
          a: { state: "partial", note: "7 days of Pro; card required, auto-converts" },
          b: { state: "yes", note: "7 days, no card; Professional features, capped" },
        },
      ],
    },
  ],
  pricing: {
    a: {
      model: "Tiered by seats, metered in Documents",
      trial: "7-day Pro trial; card required, auto-converts",
      url: "https://surferseo.com/pricing/",
      plans: [
        {
          name: "Discovery",
          monthly: 59,
          annual: 49,
          includes: "1 seat, 120 documents a year, 10 tracked pages; no AI tracking",
        },
        {
          name: "Standard",
          monthly: 119,
          annual: 99,
          includes: "3 seats, 30 documents a month, 25 ChatGPT prompts weekly, keyword research",
        },
        {
          name: "Pro",
          monthly: 219,
          annual: 182,
          includes: "5 seats, 30 documents, 50 prompts daily on 5 engines, Topical Map, Audit",
        },
        {
          name: "Peace of Mind",
          monthly: 359,
          annual: 299,
          includes: "10 seats, unlimited* documents (fair use), 100 prompts, API",
        },
        {
          name: "AI Search Analytics",
          monthly: 95,
          annual: 82,
          includes: "Tracking only: 50 prompts on 5 engines, 5 seats; no Content Editor",
        },
        {
          name: "Enterprise",
          monthly: null,
          includes: "Tailored packages: SSO, white-label, custom limits",
        },
      ],
    },
    b: {
      model: "Tiered by articles, audit pages and prompts",
      trial: "7-day free trial, no card",
      url: "https://www.frase.io/pricing",
      plans: [
        {
          name: "Starter",
          monthly: 49,
          annual: 39,
          includes: "1 seat, 10 articles, 50 audit pages, 50 prompts on 2 engines",
        },
        {
          name: "Professional",
          monthly: 129,
          annual: 103,
          includes: "3 seats, 40 articles, 250 audit pages, 200 prompts on 3 engines",
        },
        {
          name: "Scale",
          monthly: 299,
          annual: 239,
          includes: "5 seats, 100 articles, 1,000 audit pages, 500 prompts on 5 engines",
        },
        {
          name: "Enterprise",
          monthly: null,
          includes: "White-label, client portal, SSO/SAML, SLA, custom limits",
        },
      ],
    },
    checkedOn: "2026-09-21",
    note: "Surfer's trial needs a card and converts to a paid plan unless you cancel; yearly plans are charged upfront, and unused limits don't roll over. Extra prompts and tracked pages cost more (Pro from 50 to 100 prompts shows +$51), Rank Tracker is still a separate add-on, and AI Search Analytics is tracking only, with no Content Editor. Frase's Starter stops at its limits; on Professional and Scale, overage is off by default and costs $5 an article on Professional if you turn it on. Extra Frase seats are $29 a month, and FraseCMS hosting is free with a badge or $19 to $99 a month. Prices quoted for either tool before 2026 describe retired plans.",
  },
  finder: [
    {
      id: "priority",
      question: "What should the tool do best?",
      options: [
        {
          label: "Keyword and topic research with volume data",
          points: { a: 2 },
          because:
            "Surfer documents volume, difficulty and a Topical Map; Frase's current pages don't show volume.",
        },
        {
          label: "Draft articles and publish them to my site",
          points: { b: 2 },
          because: "Frase's agent drafts, publishes to your CMS and can republish fixes.",
        },
        {
          label: "Give writers a score to hit",
          points: { a: 1, b: 1 },
          because:
            "Both grade drafts live against the ranking pages, with an AI-search score beside it.",
        },
      ],
    },
    {
      id: "team",
      question: "How many people will use it?",
      options: [
        {
          label: "Just me, on under $50 a month",
          points: { b: 2 },
          because:
            "Frase Starter is $39 a month billed yearly and includes AI tracking and the API.",
        },
        {
          label: "Two or three people",
          points: { a: 1, b: 1 },
          because:
            "Surfer Standard ($99) and Frase Professional ($103) both include three seats, billed yearly.",
        },
        {
          label: "Six to ten people",
          points: { a: 2 },
          because:
            "Surfer's Peace of Mind includes ten seats; Frase Scale includes five, then $29 a seat.",
        },
      ],
    },
    {
      id: "operator",
      question: "Who will run it day to day?",
      options: [
        {
          label: "A writer or SEO, working each draft",
          points: { a: 1 },
          because:
            "Surfer's editor, guidelines and audit reward someone working each page by hand.",
        },
        {
          label: "An AI agent or our own scripts",
          points: { b: 1 },
          because:
            "Frase includes its API, MCP server and CLI on every plan; Surfer's API starts at Peace of Mind.",
        },
        {
          label: "Nobody — we want finished articles each month",
          points: { rankbox: 3 },
          because:
            "Both are platforms someone operates; you want a set number of cited articles, picked from buyer questions and delivered.",
        },
      ],
    },
  ],
  thirdOption: {
    title: "If you want articles delivered, not a platform to operate",
    body: `Surfer and Frase both assume someone at the controls: Surfer's editor grades the drafts writers work on, and Frase's agent drafts and publishes inside a workspace you configure. Rankbox, which publishes this comparison, is for teams that want a fixed set of finished articles. It maps the questions your buyers ask, writes long-form articles from live web research with the sources cited, scores every draft for SEO and AI-answer readiness, and delivers them on a schedule through its publishing API, at ${formatUsd(PLAN.monthly)} a month for ${PLAN.articlesPerMonth} articles. For research depth your writers use, Surfer is still the better buy; for an agent and site audits you steer, Frase is.`,
  },
  faqs: [
    {
      q: "Is Frase cheaper than Surfer SEO?",
      a: "Yes, at the entry level. Frase Starter is $39 a month billed yearly or $49 monthly and includes AI tracking and the API; Surfer Discovery is $49 or $59 and includes neither. With three seats they're close: Surfer Standard is $99 or $119, Frase Professional $103 or $129. Both pricing pages were checked on 21 September 2026.",
    },
    {
      q: "Is Frase still worth it after the 2026 rebuild?",
      a: 'It\'s worth judging as a new product, because it is one. "The New Frase", announced on 2 February 2026, was a ground-up rebuild that added an agent that can auto-publish, hosted FraseCMS, Content Guard, AI Visibility, an MCP server and a CLI. Most public reviews describe the old app, so independent evidence on the current one is thin; its 7-day trial needs no card, which makes it cheap to check.',
    },
    {
      q: "Does Surfer SEO include AI search tracking?",
      a: "Yes, on every plan from Standard up; since 18 May 2026 its AI Tracker is part of the plans, not an add-on. Standard tracks 25 prompts on ChatGPT weekly, and Pro tracks 50 prompts daily across ChatGPT, Perplexity, Gemini, Google AI Mode and AI Overviews. Discovery has no AI tracking, and the separate AI Search Analytics plan sells tracking alone from $82 a month billed yearly.",
    },
    {
      q: "Do Surfer SEO and Frase have an API or MCP server?",
      a: "Both do, on different plans. Frase includes its REST API, MCP server and CLI on every plan, with 5,000 to 50,000 API requests a month by tier. Surfer's API is on Peace of Mind and Enterprise, and Surfer MCP, in beta since 11 August 2026, is rolling out to Pro, Peace of Mind and Enterprise.",
    },
    {
      q: "Which has a free trial without a credit card?",
      a: "Frase. Its 7-day trial needs no card and gives Professional's features, capped at 5 articles, 50 audit pages and 25 AI prompts. Surfer's 7-day trial gives Pro access but asks for card details at checkout and converts to a paid plan unless you cancel. Neither offers a free plan.",
    },
    {
      q: "Which is better for keyword research?",
      a: "Surfer. From Standard up it includes keyword research with search volume, difficulty and clusters, adds a Topical Map on Pro, and offers the free Keyword Surfer Chrome extension. Frase's current pages document topic clusters and SERP and question research, without search-volume or difficulty figures.",
    },
    {
      q: "Which supports more languages?",
      a: "Frase claims more: 70+ languages, written natively rather than translated. Surfer's Content Editor works with any language, and Surfer AI writes full articles in 18.",
    },
    {
      q: "Who owns Surfer and Frase?",
      a: "Neither is independent. Positive, a French group, acquired Surfer in October 2025, and the product is now branded Positive Surfer. Frase is operated by Copysmith AI, Inc., which announced its acquisition of Frase in October 2022.",
    },
  ],
  sources: [
    {
      title: "Positive Surfer – Pricing",
      publisher: "Surfer",
      href: "https://surferseo.com/pricing/",
    },
    {
      title: "How does the Surfer trial work?",
      publisher: "Surfer Help Center",
      href: "https://docs.surferseo.com/en/articles/12944181-how-does-the-surfer-trial-work",
    },
    {
      title: "Subscription Migration FAQ",
      publisher: "Surfer Help Center",
      href: "https://docs.surferseo.com/en/articles/12944180-subscription-migration-faq",
    },
    {
      title: "Content Editor Overview",
      publisher: "Surfer Help Center",
      href: "https://docs.surferseo.com/en/articles/5700347-content-editor-overview",
    },
    {
      title: "Surfer AI",
      publisher: "Surfer Help Center",
      href: "https://docs.surferseo.com/en/articles/7869670-surfer-ai",
    },
    { title: "Content Editor", publisher: "Surfer", href: "https://surferseo.com/content-editor/" },
    { title: "AI Tracker", publisher: "Surfer", href: "https://surferseo.com/ai-tracker/" },
    { title: "Content Audit", publisher: "Surfer", href: "https://surferseo.com/content-audit/" },
    { title: "Topical Map", publisher: "Surfer", href: "https://surferseo.com/topical-map/" },
    { title: "Integrations", publisher: "Surfer", href: "https://surferseo.com/integrations/" },
    {
      title: "Keyword Surfer Chrome Extension",
      publisher: "Surfer",
      href: "https://surferseo.com/keyword-surfer-extension/",
    },
    {
      title: "Optimize any page for AI answers and Google with Content Editor",
      publisher: "Surfer",
      href: "https://surferseo.com/updates/optimize-for-ai-answers-and-google-august2026/",
    },
    {
      title: "Surfer MCP (Beta): Connect Surfer to Your AI Agent",
      publisher: "Surfer",
      href: "https://surferseo.com/updates/surfer-mcp-august2026/",
    },
    { title: "Frase Pricing", publisher: "Frase", href: "https://www.frase.io/pricing" },
    {
      title: "The New Frase: Built for Content Teams in the AI Search Era",
      publisher: "Frase",
      href: "https://www.frase.io/blog/introducing-the-new-frase-content-intelligence-platform",
    },
    {
      title: "SEO Content Optimization",
      publisher: "Frase",
      href: "https://www.frase.io/features/seo-content-optimization",
    },
    {
      title: "GEO Content Optimization",
      publisher: "Frase",
      href: "https://www.frase.io/features/geo-content-optimization",
    },
    {
      title: "SEO Research",
      publisher: "Frase",
      href: "https://www.frase.io/features/seo-research",
    },
    { title: "Topic Clusters", publisher: "Frase", href: "https://www.frase.io/features/clusters" },
    {
      title: "Content Guard",
      publisher: "Frase",
      href: "https://www.frase.io/features/content-guard",
    },
    {
      title: "Website SEO Audit & Site Checker",
      publisher: "Frase",
      href: "https://www.frase.io/features/auditor",
    },
    {
      title: "AI Visibility",
      publisher: "Frase",
      href: "https://www.frase.io/features/ai-visibility",
    },
    { title: "Integrations", publisher: "Frase", href: "https://www.frase.io/integrations" },
    {
      title: "API & Integrations",
      publisher: "Frase",
      href: "https://www.frase.io/features/api-integrations",
    },
    { title: "MCP", publisher: "Frase", href: "https://www.frase.io/features/mcp" },
    {
      title: "Multilingual",
      publisher: "Frase",
      href: "https://www.frase.io/features/multilingual",
    },
    { title: "Privacy Policy", publisher: "Frase", href: "https://www.frase.io/company/privacy" },
    {
      title: "Positive acquires Surfer",
      publisher: "Positive",
      href: "https://positivegroup.com/news/positive-acquires-surfer",
    },
    {
      title: "Copysmith Announces Acquisition of Frase & Rytr, Launches Copyrytr",
      publisher: "PR Newswire",
      href: "https://www.prnewswire.com/news-releases/copysmith-announces-acquisition-of-frase--rytr-launches-copyrytr-301640694.html",
    },
    {
      title: "Do Higher Content Scores Mean Higher Google Rankings?",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/seo-content-score-study/",
    },
  ],
};
