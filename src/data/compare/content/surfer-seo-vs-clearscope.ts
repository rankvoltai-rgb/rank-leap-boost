import { PLAN, formatUsd } from "@/data/pricing";
import type { MatchupEntry } from "../types";

/* Researched 2026-09-21 from both vendors' pricing pages, help centers and
   changelogs. Surfer was bought by Positive in October 2025 and replaced its
   plans in 2026 (Essential, Scale and Scale AI are gone), so pre-2026 Surfer
   prices aren't used. Clearscope publishes no annual price and no public API;
   neither is stated here. Its tracked AI engines disagree between its pricing
   page (ChatGPT, Gemini) and its launch post (adds Claude), and the page says
   so rather than picking one. */
export const entry: MatchupEntry = {
  slug: "surfer-seo-vs-clearscope",
  metaTitle: "Surfer SEO vs Clearscope (2026): Which Content Editor Fits You?",
  metaDescription:
    "Surfer SEO vs Clearscope in 7 rounds: content scoring, AI drafts, keyword research, AI search tracking and seats, with September 2026 prices and a fit quiz.",
  keywords: [
    "surfer seo vs clearscope",
    "clearscope vs surfer seo",
    "surfer vs clearscope",
    "clearscope vs surfer",
    "surfer seo or clearscope",
    "surfer seo vs clearscope pricing",
    "clearscope alternative",
    "surfer seo alternative",
  ],
  subhead:
    "Both grade a draft against what ranks on Google today. Surfer has grown into a research and AI-tracking suite under its new owner, Positive; Clearscope stays independent, with a simpler editor and unlimited users.",
  shortAnswer:
    "**Surfer SEO** and **Clearscope** both score a draft against the live Google results; the difference is how much else each plan includes, and how it's priced. Surfer adds keyword research, a topical map, content audits and AI search tracking on up to five engines, including Google AI Overviews and AI Mode, and sells 1, 3, 5 or 10 seats by plan. Clearscope keeps a simpler editor, tracks ChatGPT and Gemini, and includes unlimited users on every plan from $129 a month. Choose Surfer if a small team does research, writing and tracking in one tool. Choose Clearscope if many writers need one clear grade.",
  picks: {
    a: [
      "You want Google's AI Overviews and AI Mode tracked beside ChatGPT and Perplexity",
      "Keyword research, topic maps and content audits belong in the same tool as the editor",
      "You publish in languages beyond English, French, German, Italian and Spanish",
    ],
    b: [
      "Your writing team is large, and paying by the seat would add up",
      "Writers need one clear grade and a simple editor, not a research suite",
      "You want decay alerts and internal-link suggestions on the entry plan",
    ],
  },
  tape: [
    {
      label: "What it is",
      a: "AI visibility platform with a content editor",
      b: "Discoverability platform for Google and AI",
    },
    {
      label: "Company",
      a: "Poland, 2017 · owned by Positive since 2025",
      b: "Austin, Texas · independent, bootstrapped",
    },
    {
      label: "Starts at",
      a: "$49/mo yearly · $59 monthly",
      b: "$129/mo · annual price unpublished",
    },
    {
      label: "Free trial",
      a: "7 days of Pro, card required",
      b: "14 days · signup form asks no card",
    },
    { label: "Seats", a: "1, 3, 5 or 10 by plan", b: "Unlimited users on every plan" },
    {
      label: "AI search tracking",
      a: "From Standard · 5 engines daily from Pro",
      b: "Every plan · ChatGPT, Gemini; Claude per blog",
    },
    {
      label: "AI drafts",
      a: "30 Documents/mo on Standard and Pro",
      b: "20 Drafts/mo on both plans",
    },
    {
      label: "Languages",
      a: "All in the editor · 18 for AI drafts",
      b: "5: English, French, German, Italian, Spanish",
    },
  ],
  rounds: [
    {
      id: "content-scoring",
      title: "Content scoring",
      winner: "a",
      verdict:
        "Surfer, narrowly — its score splits into an SEO Score and an AI Search Score, and its guidelines give each entity a recommended placement as well as a frequency.",
      a: "Surfer's **AI SEO Content Score** (shipped May 4, 2026) updates in real time against the top-ranking pages, and you can edit which competitors count. Guidelines list entities with recommended placement and frequency, plus facts to include. It's on every content plan, from Discovery up.",
      b: "Clearscope's **Content Grade** updates as you write, measured against the top 30 desktop and mobile Google results. Suggested terms carry an importance score from 1 to 10 with typical-use ranges, and **Boost Content Grade** inserts unused terms in one click.",
    },
    {
      id: "ai-drafts",
      title: "AI drafts",
      winner: "a",
      verdict:
        "Surfer — more documented writing controls, 18 languages for AI drafts against Clearscope's five, and 30 documents a month at mid-tier against 20 Drafts.",
      a: "**Surfer AI** writes a full article in about 20 minutes — at least around 2,000 words, up to 30 headings — with templates, Brand Knowledge, custom instructions and, on Pro, custom voices. Since June 1, 2026 it inserts internal and external links. Each article uses one of the plan's Documents: 30 a month on Standard and Pro.",
      b: "**Draft with AI**, launched September 2, 2025, asks for intent, content type, tone (from sample text or an existing page), title and outline, then writes the full draft. Both self-serve plans include 20 Drafts a month; 10 more cost $50 on Essentials or $20 on Business.",
    },
    {
      id: "keyword-research",
      title: "Keyword & topic research",
      winner: "a",
      verdict:
        "Surfer, for depth — Keyword Research with volume, difficulty and clusters from Standard, a Topical Map from Pro, and the free Keyword Surfer extension.",
      a: "Surfer's Keyword Research shows volume, difficulty and clusters from the Standard plan. **Topical Map**, which finds competitive gaps and semantic clusters, starts at Pro, and the free Keyword Surfer Chrome extension covers 70 countries. Discovery doesn't include keyword research.",
      b: "Clearscope's **Topic Explorations** show search volume, CPC, share of voice, position, impressions and SERP features, including AI Overviews, with intent groupings and a Topics tab for subtopics. They're capped at 20 a month on Essentials and 50 on Business.",
    },
    {
      id: "refresh",
      title: "Refreshing existing content",
      winner: "draw",
      verdict:
        "Draw — Clearscope puts decay views and internal-link suggestions on every plan, while Surfer adds Auto-Optimize and rank-drop alerts but saves internal linking and its site Audit for Pro.",
      a: "Surfer's **Content Audit** reads Google Search Console for 10, 50, 200 or 500 tracked pages by plan, sends weekly opportunity emails, adds rank-drop alerts from Standard, and reworks pages with Auto-Optimize or Import from URL. One-click internal linking (up to 10 links) and the site Audit start at Pro.",
      b: "Clearscope's **Content Inventory** connects to Search Console, re-grades pages monthly and sends a weekly Monday Alert, with Content Decay and Striking Distance views and technical issues such as 404s. Its Internal Linking view suggests source pages and anchors, and any published page opens into a Draft.",
    },
    {
      id: "ai-search",
      title: "AI search tracking & GEO",
      winner: "a",
      verdict:
        "Surfer — it tracks five AI engines daily from Pro, including Google AI Overviews and AI Mode, and scores drafts for AI search inside the editor.",
      a: "Surfer's **AI Tracker** covers ChatGPT, Perplexity, Gemini, Google AI Overviews and AI Mode, with mention gap, sentiment, exact AI answers and fan-out queries. Standard tracks 25 prompts on ChatGPT only, weekly; Pro tracks 50 daily on all five. In the editor, an AI Search score checks the intro and facts.",
      b: "Clearscope's **Prompt Tracking**, launched July 14, 2026, is on both self-serve plans: 50 or 300 tracked queries, up to five competitor domains, verbatim answers and a 90-day trend. Its pricing page lists ChatGPT and Gemini; its launch post adds Claude. Neither lists Perplexity or Google's AI surfaces.",
    },
    {
      id: "pricing",
      title: "Pricing & value",
      winner: "draw",
      verdict:
        "Draw — Surfer costs less for up to three users and per document; past three, Clearscope's $129 plan with unlimited users costs less than the Surfer plan with enough seats.",
      a: "Surfer's Discovery plan is $49 a month billed yearly ($59 monthly) for one seat and 10 documents a month; Standard is $99 ($119) for three seats and 30. Pro, at $182 ($219), is where five seats, Topical Map, Audit and five-engine tracking unlock, and Peace of Mind ($299) adds 10 seats and the API.",
      b: "Clearscope's Essentials plan is $129 a month and Business $399, both with unlimited users and projects; neither annual price is published. At 20 Drafts a month, Essentials costs more per draft than Surfer Standard's 30 documents, but no headcount ever forces an upgrade.",
    },
    {
      id: "teams",
      title: "Ease of use & team rollout",
      winner: "b",
      verdict:
        "Clearscope, narrowly — reviewers single out its simple editor and fast support, and unlimited users on every plan mean no writer waits for a seat.",
      a: "Surfer rates 4.8 for ease of use on Capterra across 422 reviews, and live collaboration, comments, version history and an activity log come from Standard. Its external editor links let writers without a login work against live guidelines. Seats are capped at 1, 3, 5 or 10 by plan.",
      b: "Clearscope rates 4.9 for both ease of use and customer service on Capterra, from 60 reviews, many written between 2018 and 2022. Every plan includes unlimited users with Member, Manager and Admin roles, and writers can work from a shared Draft link, Google Docs or WordPress.",
    },
  ],
  matrix: [
    {
      group: "Writing & optimization",
      rows: [
        {
          label: "Real-time content score",
          a: { state: "yes", note: "SEO Score plus AI Search Score, updated live" },
          b: { state: "yes", note: "Content Grade against the top 30 Google results" },
        },
        {
          label: "Term & entity guidance",
          a: { state: "yes", note: "Entities with placement and frequency, plus facts" },
          b: { state: "yes", note: "Terms scored 1–10 with typical-use ranges" },
        },
        {
          label: "Briefs & outlines",
          a: { state: "yes", note: "Outline Builder; shareable editor links from Standard" },
          b: { state: "yes", note: "AI Outline Builder; shareable Draft links" },
        },
        {
          label: "AI article drafts",
          a: { state: "yes", note: "Surfer AI; shares the plan's Documents limit" },
          b: { state: "yes", note: "Draft with AI; 20 Drafts a month on both plans" },
        },
        {
          label: "Languages",
          a: { state: "yes", note: "All languages in the editor; 18 for AI drafts" },
          b: { state: "partial", note: "English, French, German, Italian, Spanish" },
        },
      ],
    },
    {
      group: "Research & refresh",
      rows: [
        {
          label: "Keyword research",
          a: { state: "yes", note: "Volume, difficulty and clusters from Standard" },
          b: { state: "yes", note: "Topic Explorations: 20 or 50 a month" },
        },
        {
          label: "Topic mapping",
          a: { state: "yes", note: "Topical Map with gap analysis, from Pro" },
          b: { state: "partial", note: "Topics tab groups subtopics" },
        },
        {
          label: "Content audit & decay",
          a: { state: "yes", note: "GSC Content Audit; 10–500 tracked pages by plan" },
          b: { state: "yes", note: "Content Inventory with decay and striking-distance views" },
        },
        {
          label: "Internal linking",
          a: { state: "partial", note: "Up to 10 links in one click; Pro and up" },
          b: { state: "yes", note: "Source pages and anchors, on every plan" },
        },
      ],
    },
    {
      group: "AI search",
      rows: [
        {
          label: "AI visibility tracking",
          a: { state: "yes", note: "From Standard; 5 engines daily from Pro" },
          b: { state: "yes", note: "Prompt Tracking on both self-serve plans" },
        },
        {
          label: "Google AI Overviews & AI Mode",
          a: { state: "yes", note: "Tracked as separate surfaces from Pro" },
          b: { state: "no", note: "Not among the engines Clearscope lists" },
        },
        {
          label: "AI guidance in the editor",
          a: { state: "yes", note: "AI Search score, guidelines and AI Readability" },
          b: { state: "partial", note: "AI Term Presence for GPT and Gemini answers" },
        },
      ],
    },
    {
      group: "Team & plan",
      rows: [
        {
          label: "Seats",
          a: { state: "partial", note: "1, 3, 5 or 10 by plan; custom on Enterprise" },
          b: { state: "yes", note: "Unlimited users; Member, Manager, Admin roles" },
        },
        {
          label: "Integrations",
          a: { state: "yes", note: "Google Docs, WordPress, Contentful, Zapier; Standard+" },
          b: { state: "yes", note: "Google Docs, WordPress, Word, Search Console, Analytics" },
        },
        {
          label: "API & MCP",
          a: { state: "partial", note: "API from Peace of Mind; MCP in beta" },
          b: { state: "no", note: "No public API documented" },
        },
        {
          label: "Free trial",
          a: { state: "yes", note: "7 days of Pro; card required, auto-converts" },
          b: { state: "yes", note: "14 days; signup form asks for no card" },
        },
      ],
    },
  ],
  pricing: {
    a: {
      model: "Tiered by seats, Documents and AI prompts",
      trial: "7 days of Pro; card required, converts to paid",
      url: "https://surferseo.com/pricing/",
      plans: [
        {
          name: "Discovery",
          monthly: 59,
          annual: 49,
          includes: "1 seat, 10 documents a month; no AI tracking or keyword research",
        },
        {
          name: "Standard",
          monthly: 119,
          annual: 99,
          includes: "3 seats, 30 documents, 25 prompts on ChatGPT weekly, keyword research",
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
          includes: "10 seats, unlimited documents (fair use), 100 prompts, API",
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
      model: "Flat tiers with unlimited users; metered credits",
      trial: "14-day free trial",
      url: "https://www.clearscope.io/pricing",
      plans: [
        {
          name: "Essentials",
          monthly: 129,
          includes: "Unlimited users, 50 tracked queries, 20 Topic Explorations, 20 Drafts",
        },
        {
          name: "Business",
          monthly: 399,
          includes: "Unlimited users, 300 tracked queries, 50 Topic Explorations, account manager",
        },
        {
          name: "Enterprise",
          monthly: null,
          includes: "Custom credits and agreements, crawler whitelisting, SSO",
        },
      ],
    },
    checkedOn: "2026-09-21",
    note: "Surfer charges annual plans upfront, and unused limits don't roll over; AI articles and manual editors draw on the same Documents count. Extra prompts and tracked pages are priced in its calculator (Pro from 50 to 100 prompts shows +$51), Rank Tracker is a separate add-on, and the trial needs a card and converts unless cancelled. Surfer's own FAQ says some prices rose when legacy plans migrated on May 18, 2026. Clearscope publishes monthly prices only; annual billing is arranged through support. It bills add-ons automatically when you exceed a plan — 100 more pages are $25 a month on Essentials, 10 more Drafts $50 — and its own add-on help article still lists Essentials at $189.",
  },
  finder: [
    {
      id: "team",
      question: "How many people need a login?",
      options: [
        {
          label: "One to three",
          points: { a: 2 },
          because:
            "Surfer Standard covers three seats for $99 a month billed yearly, under Clearscope's $129.",
        },
        {
          label: "Four to ten",
          points: { b: 1 },
          because:
            "Clearscope's $129 Essentials plan covers them all; Surfer needs Pro or Peace of Mind.",
        },
        {
          label: "More than ten",
          points: { b: 2 },
          because:
            "Clearscope includes unlimited users on every plan; Surfer's self-serve plans stop at 10 seats.",
        },
      ],
    },
    {
      id: "ai-search",
      question: "Which AI answers do you need to watch?",
      options: [
        {
          label: "Google's AI Overviews and AI Mode, plus ChatGPT and Perplexity",
          points: { a: 2 },
          because: "Surfer tracks all five engines daily from Pro, Google's AI surfaces included.",
        },
        {
          label: "ChatGPT and Gemini are enough",
          points: { b: 1 },
          because:
            "Clearscope's Prompt Tracking covers ChatGPT and Gemini on both self-serve plans.",
        },
        {
          label: "None yet",
          points: { a: 1 },
          because:
            "Surfer Discovery is the lower-priced way into an editor, at $49 a month billed yearly.",
        },
      ],
    },
    {
      id: "drafts",
      question: "Who writes the drafts the tool will grade?",
      options: [
        {
          label: "Our writers, and they want one clear target",
          points: { b: 2 },
          because:
            "Clearscope gives writers one Content Grade, and reviewers rate its ease of use 4.9 of 5.",
        },
        {
          label: "Writers plus AI drafts, in several languages",
          points: { a: 2 },
          because:
            "Surfer AI drafts in 18 languages and allows 30 documents a month from Standard.",
        },
        {
          label: "Nobody on the team writes them",
          points: { rankbox: 3 },
          because:
            "Both tools grade a draft someone revises; you need the articles written and delivered.",
        },
      ],
    },
  ],
  thirdOption: {
    title: "If nobody on the team will write the drafts",
    body: `Surfer and Clearscope are graders. Both can start a draft with AI, but each is built around an editor where someone on your team revises the page until the score is right. Rankbox is built for teams with no one to do that. It maps the questions your buyers ask, writes each long-form article from live web research with the sources cited, scores the draft for SEO and AI-answer readiness, and delivers it on a schedule through its publishing API: ${PLAN.articlesPerMonth} articles a month for ${formatUsd(PLAN.monthly)}. If you have writers and want their work graded, one of the two above is still the better buy.`,
  },
  faqs: [
    {
      q: "Which is cheaper, Surfer SEO or Clearscope?",
      a: "Surfer is cheaper to start: Discovery is $49 a month billed yearly, or $59 monthly, against Clearscope Essentials at $129 a month. Discovery doesn't include AI tracking, keyword research or integrations, so the closer match is Surfer Standard at $99 yearly or $119 monthly, with three seats. Clearscope doesn't publish an annual price. Both pricing pages were checked on 21 September 2026.",
    },
    {
      q: "Which is better for a large writing team?",
      a: "Clearscope, because every plan includes unlimited users, with Member, Manager and Admin roles. Surfer's plans include 1, 3, 5 or 10 seats — Discovery, Standard, Pro and Peace of Mind — and larger teams move to its custom-priced Enterprise plan.",
    },
    {
      q: "Do Surfer SEO and Clearscope have free trials?",
      a: "Yes, on different terms. Surfer gives new accounts 7 days of Pro, asks for card details at checkout and charges when the trial ends unless you cancel. Clearscope offers a 14-day free trial, and its signup form asks only for a name, email and password. Neither has a free plan.",
    },
    {
      q: "Can Surfer and Clearscope write full articles with AI?",
      a: "Yes, both can. Surfer AI writes full articles in 18 languages, each counting against the plan's Documents: 30 a month on Standard and Pro, and unlimited under a fair-use policy on Peace of Mind. Clearscope's Draft with AI, launched in September 2025, writes a full draft from your chosen intent, tone and outline, with 20 Drafts a month on both self-serve plans.",
    },
    {
      q: "Do they track ChatGPT and Google AI Overviews?",
      a: "Both track ChatGPT; only Surfer lists Google AI Overviews. Surfer's AI Tracker covers ChatGPT, Perplexity, Gemini, Google AI Overviews and AI Mode — all five daily from Pro, ChatGPT only and weekly on Standard. Clearscope's pricing page lists ChatGPT and Gemini, and its Prompt Tracking launch post adds Claude.",
    },
    {
      q: "Do higher content scores mean higher rankings?",
      a: 'Not reliably. An Ahrefs study published in May 2025, covering 20 keywords, reported weak correlations between content scores and rankings across the tools it measured, with Surfer and Clearscope both in its "very weak" group. Treat either score as a checklist for topic coverage, not a ranking guarantee.',
    },
    {
      q: "Which supports more languages?",
      a: "Surfer. Its FAQ says the editor works with all languages, and Surfer AI writes in 18. Clearscope supports five — English, French, German, Italian and Spanish — with local targeting by city, state or region.",
    },
    {
      q: "Was Surfer acquired, and is Clearscope independent?",
      a: 'Yes to both. Positive, a French group formerly called Sarbacane, acquired Surfer in October 2025, and the site now brands the product "Positive Surfer"; its plans were overhauled in 2026. Clearscope calls itself "proudly independent and bootstrapped".',
    },
  ],
  sources: [
    { title: "Pricing", publisher: "Surfer", href: "https://surferseo.com/pricing/" },
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
    { title: "AI Tracker", publisher: "Surfer", href: "https://surferseo.com/ai-tracker/" },
    { title: "Content Audit", publisher: "Surfer", href: "https://surferseo.com/content-audit/" },
    { title: "Topical Map", publisher: "Surfer", href: "https://surferseo.com/topical-map/" },
    { title: "Integrations", publisher: "Surfer", href: "https://surferseo.com/integrations/" },
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
    {
      title: "Positive acquires Surfer",
      publisher: "Positive",
      href: "https://positivegroup.com/news/positive-acquires-surfer",
    },
    {
      title: "Plans & Pricing",
      publisher: "Clearscope",
      href: "https://www.clearscope.io/pricing",
    },
    {
      title: "Introducing Prompt Tracking",
      publisher: "Clearscope",
      href: "https://www.clearscope.io/blog/clearscope-prompt-tracking-feature",
    },
    {
      title: "Introducing: Clearscope's Draft with AI Feature",
      publisher: "Clearscope",
      href: "https://www.clearscope.io/blog/clearscope-ai-blog-writing-tool",
    },
    {
      title: "How does Clearscope grade your content?",
      publisher: "Clearscope Support",
      href: "https://www.clearscope.io/support/how-does-clearscope-grade-your-content",
    },
    {
      title: "Monitoring Your Published Content",
      publisher: "Clearscope Support",
      href: "https://www.clearscope.io/support/getting-started-content-inventory",
    },
    {
      title: "Internal Linking Content View",
      publisher: "Clearscope Support",
      href: "https://www.clearscope.io/support/internal-linking-view",
    },
    {
      title: "What languages does Clearscope support?",
      publisher: "Clearscope Support",
      href: "https://www.clearscope.io/support/what-languages-does-clearscope-support",
    },
    {
      title: "How do plan addons work?",
      publisher: "Clearscope Support",
      href: "https://www.clearscope.io/support/how-do-plan-addons-work",
    },
    {
      title: "The News Is Out: Surfer Has Been Acquired by Positive Group",
      publisher: "Clearscope",
      href: "https://www.clearscope.io/blog/surfer-acquired-by-positive-group",
    },
    {
      title: "Do Higher Content Scores Mean Higher Google Rankings?",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/seo-content-score-study/",
    },
    {
      title: "Surfer Reviews",
      publisher: "Capterra",
      href: "https://www.capterra.com/p/218703/Surfer/reviews/",
    },
    {
      title: "Clearscope Reviews",
      publisher: "Capterra",
      href: "https://www.capterra.com/p/161003/Clearscope/reviews/",
    },
  ],
};
