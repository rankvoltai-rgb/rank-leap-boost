import { PLAN, formatUsd } from "@/data/pricing";
import type { MatchupEntry } from "../types";

/* Researched 2026-09-21. Koala restructured its plans on 2026-08-28 — the
   widely quoted $9 "Essentials" plan is legacy and no longer sold. Byword's
   own "Byword vs Koala Writer" page is AI-generated and stale on Koala's
   pricing and trial, so nothing is taken from it except Byword's statement
   about its own affiliate features. Byword's site gives four different
   language counts; none is repeated here as fact. */
export const entry: MatchupEntry = {
  slug: "koala-ai-vs-byword",
  metaTitle: "Koala AI vs Byword (2026): Which AI SEO Writer Should You Pick?",
  metaDescription:
    "Koala AI vs Byword in 7 rounds: research, programmatic SEO, publishing, affiliate content, AI search and teams — with September 2026 prices and a fit quiz.",
  keywords: [
    "koala ai vs byword",
    "byword vs koala",
    "koalawriter vs byword",
    "koala writer vs byword ai",
    "koala ai or byword",
    "byword alternative",
    "koala ai alternative",
  ],
  subhead:
    "Two AI article writers that look alike from the outside. The split is in how they scale: Koala meters words and leans into affiliate content, Byword sells articles and builds them from templates.",
  shortAnswer:
    "**Koala AI** and **Byword** both turn a keyword into a researched, cited, SEO-scored article and publish it to WordPress, Shopify, Webflow or Ghost. The difference is how they scale. Koala meters words, starts at $25 a month, and is strongest for single articles and Amazon affiliate content. Byword charges one credit per article, starts at $99, and is built for volume: programmatic templates fed by spreadsheet data, team seats, and credits that never expire. Choose Koala for a lean site or affiliate publishing; choose Byword for programmatic SEO with a team.",
  picks: {
    a: [
      "You publish affiliate content and want live Amazon product data built in",
      "You're one person running one site and want the lowest price to start",
      "You'd like an agent that plans a content calendar and publishes it on schedule",
    ],
    b: [
      "You're building hundreds of pages from a spreadsheet or Airtable base",
      "Writers, editors or clients need their own seats and roles",
      "You want a fixed cost per article, with credits that never expire",
    ],
  },
  tape: [
    { label: "What it is", a: "AI SEO platform", b: "AI article writer for SEO at scale" },
    { label: "Founded", a: "Launched 2023 · Florida, US", b: "2022 · London" },
    { label: "Starts at", a: "$20/mo yearly · $25 monthly", b: "$83/mo yearly · $99 monthly" },
    { label: "Billed by", a: "Words; premium models count 2–3x", b: "Articles; one credit each" },
    { label: "Unused credits", a: "Expire monthly; annual last a year", b: "Never expire" },
    { label: "Free to try", a: "5,000 words, no card", b: "5 articles, no card" },
    { label: "Team seats", a: "None; one shared login", b: "3–25 seats, with roles" },
    { label: "Amazon affiliate data", a: "22 marketplaces, tag added", b: "Not built in" },
  ],
  rounds: [
    {
      id: "writing",
      title: "Writing & research",
      winner: "draw",
      verdict:
        "Draw — both research live sources, cite them, follow a trained brand voice and score against the SERP, and no independent benchmark separates their drafts.",
      a: "Koala lets you choose research sources — the web, Google Scholar, Google News or custom search operators — and strips links to pages competing for your keyword. **Brand DNA** grounds drafts in your own site or Google Maps listing.",
      b: "Byword offers Basic, Standard or Deep research with source-type and recency filters, and four citation styles, from inline links to a reference list. Voice training works from uploaded samples, backed by a knowledge base.",
    },
    {
      id: "programmatic",
      title: "Programmatic scale",
      winner: "b",
      verdict:
        "Byword — its templates take variables and conditionals and fill them from CSV, Google Sheets or Airtable, where Koala writes each article as a standalone piece.",
      a: "Koala's Bulk Writer takes a keyword list with shared settings on every paid plan, and runs one to three articles at a time depending on the plan. Each is written from scratch rather than from a template.",
      b: "Byword's **programmatic templates** use `{{variables}}` fed by datasets, and campaigns generate batches with shared settings. Programmatic SEO is included on every plan, including Free.",
    },
    {
      id: "publishing",
      title: "Publishing & automation",
      winner: "b",
      verdict:
        "Byword, narrowly — seven publishing targets and four exports beat Koala's four CMSs, though Koala's Content Calendar Autopilot is the more hands-off option.",
      a: "Koala publishes to WordPress, Shopify, Webflow and Ghost, with signed webhooks for Zapier, Make and n8n. From the Boost plan, **Content Calendar Autopilot** schedules articles and publishes them on set dates.",
      b: "Byword publishes to WordPress (with Yoast, RankMath and AIOSEO fields), Webflow, Shopify, Ghost, HubSpot, GoHighLevel and Medium, and exports to Notion, Google Docs, Sheets and Airtable. Integrations need a paid plan.",
    },
    {
      id: "affiliate",
      title: "Affiliate content",
      winner: "a",
      verdict:
        "Koala, clearly — it builds roundups and reviews from live Amazon data across 22 marketplaces and inserts your tracking ID for you.",
      a: "KoalaWriter's Amazon modes produce roundups of up to 48 products and single-product reviews from live Amazon data, with your Associates tag added automatically.",
      b: "Byword has a Listicle Builder and a Comparison Builder, plus affiliate-disclosure presets, but no Amazon product-data integration — its own comparison page lists its affiliate features as none.",
    },
    {
      id: "ai-search",
      title: "AI search features",
      winner: "a",
      verdict:
        "Koala, narrowly — its plans include on-demand Google AI Overview citation checks, while Byword's AI search features need a separate Trakkr subscription.",
      a: "Koala's Growth Agent and MCP tools check whether your domain is cited in live Google AI Overviews and audit pages for citation readiness. Ongoing tracking of ChatGPT or Perplexity isn't documented.",
      b: "Byword's **AI Search** is powered by Trakkr, a separate AI-visibility product founded by Byword's founder. It covers ChatGPT, Claude and Perplexity, at its own price, with 20% off for Byword users.",
    },
    {
      id: "price",
      title: "Price to start",
      winner: "a",
      verdict:
        "Koala — it starts at $25 a month, or $20 billed yearly, with the API on every paid plan; Byword's paid plans start at $99 and its API at $299.",
      a: "Koala's Starter includes 45,000 words a month, about $0.56 per thousand words on its base model and double that on the recommended Claude Sonnet 5. Monthly credits expire after a month.",
      b: "Byword's subscription articles work out at $3.33 to $3.96 each, whatever their length, and unused credits never expire — which makes its bill easier to predict at volume.",
    },
    {
      id: "teams",
      title: "Teams",
      winner: "b",
      verdict:
        "Byword — it has seats with Owner, Editor and Viewer roles from its Standard plan, while Koala runs on a single login.",
      a: "Koala has no seats or roles. Its pricing FAQ says an account may be shared within your organisation, and its help centre suggests sharing the login.",
      b: "Byword's Standard plan includes three seats (up to five), and Scale includes ten (up to 25), with per-domain access and free guest access to another account's domain.",
    },
  ],
  matrix: [
    {
      group: "Writing",
      rows: [
        {
          label: "Article from a keyword",
          a: { state: "yes", note: "One click; blog, listicle, service page, rewrite" },
          b: { state: "yes", note: "Keyword or title mode, with outline editing" },
        },
        {
          label: "Live research & citations",
          a: { state: "yes", note: "Web, Google Scholar, News or custom search sources" },
          b: { state: "yes", note: "Basic to Deep research; four citation styles" },
        },
        {
          label: "Brand voice",
          a: { state: "yes", note: "Tones, Brand DNA knowledge base, banned words" },
          b: { state: "yes", note: "Trained from samples; knowledge-base grounding" },
        },
        {
          label: "SEO scoring against the SERP",
          a: { state: "yes", note: "Entity extraction; editor score from Professional" },
          b: { state: "yes", note: "Real-time SEO score and SERP-based outlines" },
        },
        {
          label: "AI images",
          a: { state: "yes", note: "GPT Image 2.5, Nano Banana 2, Ideogram and more" },
          b: { state: "yes", note: "17 styles; 2–3 images an article, with alt text" },
        },
      ],
    },
    {
      group: "Scale & publishing",
      rows: [
        {
          label: "Bulk generation",
          a: { state: "partial", note: "Keyword-list Bulk Writer, 1–3 articles at a time" },
          b: { state: "yes", note: "Campaigns with shared settings" },
        },
        {
          label: "Programmatic templates",
          a: { state: "no", note: "Not its focus — each article is written standalone" },
          b: { state: "yes", note: "Variables fed by CSV, Google Sheets or Airtable" },
        },
        {
          label: "CMS publishing",
          a: { state: "yes", note: "WordPress, Shopify, Webflow, Ghost, webhooks" },
          b: { state: "yes", note: "Those four plus HubSpot, GoHighLevel, Medium" },
        },
        {
          label: "Scheduling",
          a: { state: "yes", note: "Content Calendar Autopilot, from Boost" },
          b: { state: "yes", note: "Spread posts over time, skip weekends" },
        },
        {
          label: "Internal linking",
          a: { state: "yes", note: "Sitemap-indexed, refreshed every 24 hours" },
          b: { state: "yes", note: "Sitemap-indexed, refreshable every 14 days" },
        },
      ],
    },
    {
      group: "SEO & AI search",
      rows: [
        {
          label: "Keyword research",
          a: { state: "yes", note: "Growth Agent with keyword, backlink and SERP data" },
          b: { state: "yes", note: "Keyword Explorer from Starter; topical maps" },
        },
        {
          label: "AI search visibility",
          a: { state: "partial", note: "On-demand Google AI Overview citation checks" },
          b: { state: "partial", note: "Through Trakkr, a separate paid product" },
        },
        {
          label: "Amazon affiliate content",
          a: { state: "yes", note: "Live data, 22 marketplaces, tracking ID added" },
          b: { state: "partial", note: "Listicle and comparison builders; no Amazon data" },
        },
      ],
    },
    {
      group: "Account",
      rows: [
        {
          label: "Team seats & roles",
          a: { state: "no", note: "No seats; the account can be shared in-house" },
          b: { state: "yes", note: "Owner, Editor, Viewer; 3–25 seats by plan" },
        },
        {
          label: "API & MCP",
          a: { state: "yes", note: "API on all paid plans; MCP from Professional" },
          b: { state: "partial", note: "API from Standard ($299); MCP server" },
        },
        {
          label: "Credit rollover",
          a: { state: "partial", note: "Monthly credits expire; annual last 12 months" },
          b: { state: "yes", note: "Credits never expire" },
        },
      ],
    },
  ],
  pricing: {
    a: {
      model: "Metered in words; premium models count 2–3x",
      trial: "5,000 free words, no card",
      url: "https://koala.sh/pricing",
      plans: [
        {
          name: "Starter",
          monthly: 25,
          annual: 20,
          includes: "45,000 words, 500 credits, 1 brand",
        },
        {
          name: "Professional",
          monthly: 49,
          annual: 39,
          includes: "100,000 words, 1,000 credits, editor scoring, MCP",
        },
        {
          name: "Boost",
          monthly: 99,
          annual: 79,
          includes: "250,000 words, Content Calendar Autopilot",
        },
        { name: "Growth", monthly: 179, annual: 143, includes: "500,000 words, 3 brands" },
        { name: "Elite", monthly: 350, annual: 280, includes: "1,000,000 words, 7 brands" },
      ],
    },
    b: {
      model: "One credit per article; credits never expire",
      trial: "5 free articles, no card",
      url: "https://byword.ai/pricing",
      plans: [
        { name: "Free", monthly: 0, includes: "5 articles once; extra articles at $5 each" },
        { name: "Starter", monthly: 99, annual: 83, includes: "25 articles, 1 seat, 5 domains" },
        { name: "Standard", monthly: 299, annual: 249, includes: "80 articles, 3 seats, API" },
        {
          name: "Scale",
          monthly: 999,
          annual: 833,
          includes: "300 articles, 10 seats, priority support",
        },
        {
          name: "Unlimited",
          monthly: 1999,
          includes: "Bring your own Claude and Gemini keys, about $0.10 an article",
        },
      ],
    },
    checkedOn: "2026-09-21",
    note: "Koala's word allowances assume its 1x model; Claude Sonnet 5, the recommended writer, counts double and Opus 5 triple, and four more tiers run from $500 to $2,000 a month. Byword's yearly prices are the annual bill divided by twelve. Its $999 Scale plan is 300 articles, not the 1,000 some comparison pages quote, and Koala's $9 Essentials plan is no longer sold.",
  },
  finder: [
    {
      id: "publishing",
      question: "What are you publishing?",
      options: [
        {
          label: "Amazon roundups and reviews",
          points: { a: 2 },
          because: "Koala pulls live Amazon data across 22 marketplaces and adds your tracking ID.",
        },
        {
          label: "Hundreds of pages from a spreadsheet",
          points: { b: 2 },
          because: "Byword's templates turn CSV, Sheets or Airtable rows into articles.",
        },
        {
          label: "A steady blog for one site",
          points: { a: 1 },
          because: "Koala's lower entry price suits a single site's cadence.",
        },
      ],
    },
    {
      id: "access",
      question: "How many people need access?",
      options: [
        {
          label: "Just me",
          points: { a: 1 },
          because: "Koala is built around a single login.",
        },
        {
          label: "A team, or clients",
          points: { b: 2 },
          because: "Byword has seats with Owner, Editor and Viewer roles.",
        },
      ],
    },
    {
      id: "bill",
      question: "What matters most on the bill?",
      options: [
        {
          label: "The lowest price to start",
          points: { a: 1 },
          because: "Koala starts at $25 a month, or $20 billed yearly.",
        },
        {
          label: "Knowing what each article costs",
          points: { b: 1 },
          because: "Byword charges one credit an article, and credits never expire.",
        },
        {
          label: "A flat price for a month of articles",
          points: { rankbox: 3 },
          because: `You want a set number of finished articles, not capacity to spend — Rankbox is ${formatUsd(PLAN.monthly)} for ${PLAN.articlesPerMonth}.`,
        },
      ],
    },
  ],
  thirdOption: {
    title: "If you'd rather buy a month of articles than a meter",
    body: `Koala and Byword both sell capacity — words or credits — and leave you to decide what to spend it on. Rankbox is a fixed plan: ${formatUsd(PLAN.monthly)} a month for ${PLAN.articlesPerMonth} articles, each chosen from the questions your buyers ask, written from live research with the sources cited, and scored for SEO and AI-answer readiness before it's delivered to your site on a schedule. It doesn't build Amazon roundups or spreadsheet-driven programmatic pages; if either is the job, pick from the two above.`,
  },
  faqs: [
    {
      q: "Which is cheaper, Koala AI or Byword?",
      a: "Koala is cheaper to start: $25 a month, or $20 billed yearly, for 45,000 words, against Byword's $99, or $83 billed yearly, for 25 articles. At volume it depends on article length and model — Koala's recommended Claude Sonnet 5 counts words at double — while Byword charges one credit per article whatever its length.",
    },
    {
      q: "Do Koala AI and Byword have free trials?",
      a: "Yes, both, with no card: Koala gives new accounts 5,000 words and 25 credits, and Byword gives 5 free articles. Both are one-time allowances, and Byword's Free plan can also buy extra articles at $5 each.",
    },
    {
      q: "Which is better for Amazon affiliate content?",
      a: "Koala. It builds roundups and single-product reviews from live Amazon data across 22 marketplaces and inserts your Associates tracking ID. Byword has listicle and comparison builders, but no Amazon data integration.",
    },
    {
      q: "Which is better for programmatic SEO?",
      a: "Byword. Its templates use variables and conditionals fed by CSV, Google Sheets or Airtable datasets. Koala's Bulk Writer takes a keyword list and writes each article as a standalone piece, one to three at a time depending on the plan.",
    },
    {
      q: "Do unused credits roll over?",
      a: "On Byword, yes — credits never expire. On Koala, monthly-plan credits expire after a month; annual plans get the year's credits up front, valid for 12 months.",
    },
    {
      q: "Can Koala AI and Byword publish straight to WordPress?",
      a: "Both can. Koala publishes to WordPress, Shopify, Webflow and Ghost, with signed webhooks for everything else. Byword adds HubSpot, GoHighLevel and Medium to the same four, on its paid plans.",
    },
    {
      q: "Does either track visibility in ChatGPT?",
      a: "Not natively. Koala runs on-demand checks of whether you're cited in Google AI Overviews. Byword's AI Search feature runs through Trakkr, a separate paid product founded by Byword's founder, which covers ChatGPT, Claude and Perplexity.",
    },
    {
      q: "Can a team share one account?",
      a: "Byword has seats and roles — Owner, Editor and Viewer — from its Standard plan. Koala has no seats; its pricing FAQ says an account can be shared within your organisation.",
    },
  ],
  sources: [
    {
      title: "AI SEO Platform for Google and AI Search",
      publisher: "Koala AI",
      href: "https://koala.sh/",
    },
    { title: "Pricing", publisher: "Koala AI", href: "https://koala.sh/pricing" },
    { title: "Changelog", publisher: "Koala AI", href: "https://koala.sh/changelog" },
    {
      title: "Bulk content creation",
      publisher: "Koala AI",
      href: "https://koala.sh/features/bulk-content-creation",
    },
    {
      title: "AI search optimization with the Growth Agent",
      publisher: "Koala AI",
      href: "https://koala.sh/features/growth-agent-ai-search-optimization",
    },
    {
      title: "Brand DNA plans explained",
      publisher: "Koala AI",
      href: "https://koala.sh/blog/brand-dna-plans",
    },
    {
      title: "How to create Amazon product roundups with KoalaWriter",
      publisher: "Koala Help Center",
      href: "https://support.koala.sh/en/article/how-to-create-amazon-product-roundups-with-koalawriter-effa6c/",
    },
    {
      title: "Do unused word credits carry over to the next month?",
      publisher: "Koala Help Center",
      href: "https://support.koala.sh/en/article/do-unused-word-credits-or-chat-credits-carry-over-to-the-next-month-xko6pv/",
    },
    {
      title: "How do I add a team member to my account?",
      publisher: "Koala Help Center",
      href: "https://support.koala.sh/en/article/how-do-i-add-a-team-member-or-user-to-my-account-1yi5v3s/",
    },
    {
      title: "AI article writer for SEO at scale",
      publisher: "Byword",
      href: "https://byword.ai/",
    },
    { title: "Pricing", publisher: "Byword", href: "https://byword.ai/pricing" },
    {
      title: "Billing & plans",
      publisher: "Byword Docs",
      href: "https://byword.ai/learn/docs/account/billing",
    },
    {
      title: "Team management",
      publisher: "Byword Docs",
      href: "https://byword.ai/learn/docs/account/team",
    },
    {
      title: "Programmatic",
      publisher: "Byword Docs",
      href: "https://byword.ai/learn/docs/content/programmatic",
    },
    {
      title: "Integrations overview",
      publisher: "Byword Docs",
      href: "https://byword.ai/learn/docs/integrations/overview",
    },
    {
      title: "Byword vs Koala Writer",
      publisher: "Byword",
      href: "https://byword.ai/compare/byword-vs/koala-writer",
    },
    { title: "About", publisher: "Byword", href: "https://byword.ai/about" },
  ],
};
