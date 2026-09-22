import { PLAN, formatUsd } from "@/data/pricing";
import type { MatchupEntry } from "../types";

/* Researched 2026-09-21 from both vendors' pricing pages, product pages, help
   centres and docs. Profound removed its self-serve brand plans ($99 Starter,
   $399 Growth) from its pricing page in September 2026; most roundups and
   parts of Profound's own help centre still describe them, so neither price
   is used here as current. Both vendors' comparison pages are out of date
   (Peec's quotes Enterprise from $499; Profound's says Peec has no fan-outs
   or GA4), and nothing is taken from them except Peec's own statements about
   its trial and SOC 2. Left out as unverified or conflicting: Profound's
   Enterprise price estimates, the size of its prompt panel, Peec's bot-visit
   caps, Peec's agency API gating, and G2 ratings. */
export const entry: MatchupEntry = {
  slug: "profound-vs-peec-ai",
  metaTitle: "Profound vs Peec AI (2026): Which AI Visibility Tracker Fits?",
  metaDescription:
    "Profound vs Peec AI in 7 rounds: engines, prompt volumes, content agents, self-serve pricing, agencies and security — with September 2026 prices and a fit quiz.",
  keywords: [
    "profound vs peec ai",
    "peec ai vs profound",
    "profound vs peec",
    "profound or peec ai",
    "profound pricing",
    "peec ai pricing",
    "profound alternative",
    "peec ai alternative",
  ],
  subhead:
    "Two AI search trackers that report the same core metrics. The real split is access: Peec AI publishes self-serve prices from $95, while Profound now sells brands a 7-day trial and then a custom contract.",
  shortAnswer:
    "**Profound** and **Peec AI** both run your prompts daily through ChatGPT, Google's AI answers and other engines, and report visibility, share of voice, sentiment and citations. They differ in how you buy them and how far they go past the numbers. Profound gives brands a free 7-day trial, then a custom Enterprise contract, and adds panel-based prompt volumes, content agents and SOC 2 Type II. Peec AI is self-serve from $95 a month with unlimited users, and ends at ranked recommendations. Choose Profound if you're an enterprise that wants demand data and execution in one contract. Choose Peec AI to start tracking this week on a published price.",
  picks: {
    a: [
      "You're an enterprise brand and procurement needs SOC 2 Type II, SSO and SCIM",
      "You want real prompt volumes, with intent and demographics, before choosing what to track",
      "You'd like the same platform to draft briefs and articles and publish them to your CMS",
    ],
    b: [
      "You want to start tracking this week on a published price, without a demo",
      "You're a small team or agency and want unlimited users on every plan",
      "You already have writers and need tracking plus a ranked list of what to fix",
    ],
  },
  tape: [
    {
      label: "What it is",
      a: "AI search visibility and marketing platform",
      b: "AI search analytics for marketing teams",
    },
    {
      label: "Founded",
      a: "August 2024 · New York City",
      b: "2025 · Berlin · launched February 2025",
    },
    {
      label: "Latest funding",
      a: "$180M Series D, 15 Sep 2026 · $1.8B valuation",
      b: "$21M Series A, Nov 2025 · about $29M total",
    },
    {
      label: "Brand pricing",
      a: "7-day free Trial, then custom Enterprise",
      b: "$80/mo yearly · $95 monthly",
    },
    {
      label: "Agency pricing",
      a: "$99/mo + $399/mo per client workspace",
      b: "$245, $495 or $795/mo; custom above",
    },
    {
      label: "Most engines listed",
      a: "Up to 9, on Enterprise",
      b: "Up to 13 on Enterprise; 7 via API",
    },
    {
      label: "Prompt demand data",
      a: "Panel-based volumes, intent, demographics",
      b: "Relative 1–5 score from search trends",
    },
    {
      label: "Writes content",
      a: "Yes: credit-billed Agents draft and publish",
      b: "No: ranked Actions with briefs, by design",
    },
  ],
  rounds: [
    {
      id: "engines",
      title: "Engine coverage",
      winner: "draw",
      verdict:
        "Draw — Peec AI lists more models, 13 to Profound's 9, and lets self-serve plans pick 3 of 6, but seven of its 13 run through an API, and most of both lists sit on Enterprise.",
      a: "Profound's Enterprise plan tracks up to nine engines: ChatGPT, Perplexity, Google AI Mode, Gemini, Microsoft Copilot, DeepSeek, Claude, Google AI Overviews and Exa Search, which Profound says it captures from the browser rather than an API. The brand Trial covers ChatGPT, Gemini and AI Overviews; Agency Growth workspaces cover ChatGPT, Perplexity and AI Overviews.",
      b: "Peec's Starter, Pro and Advanced plans track three models you choose from ChatGPT, AI Mode, AI Overviews, Microsoft Copilot, Naver AI and Gemini, with more at **$35 to $165 a month** per extra model. Enterprise adds Claude, Grok, DeepSeek, Mistral, Qwen, GPT 5 Search and Meta Spark via API. Perplexity is listed as an add-on and on Enterprise, though another Peec page says every plan includes it — confirm with the vendor.",
    },
    {
      id: "demand-data",
      title: "Prompt and volume data",
      winner: "a",
      verdict:
        "Profound — its Prompt Volumes are absolute counts from a consumer panel, with intent and demographics, where Peec AI scores each prompt's demand from 1 to 5 using web search trends.",
      a: "**Prompt Volumes** draw on a licensed, double opt-in consumer panel covering ChatGPT, Gemini, Claude and Perplexity, updated weekly, with breakdowns by intent, region, age and income. Coverage is strongest in the US, UK and parts of Europe. The Trial includes five searches; Enterprise sets a custom allowance.",
      b: "Peec's **Prompt Volume** is a relative 1–5 demand score built from web search trends rather than AI-conversation data. To build the prompt list, Peec offers prompt, topic and competitor suggestions, prompts generated from your keywords, and personas.",
    },
    {
      id: "action",
      title: "Turning data into action",
      winner: "a",
      verdict:
        "Profound — its Agents draft briefs and articles and publish through CMS integrations, while Peec AI hands your team ranked recommendations with a brief attached and, by design, leaves the writing to you.",
      a: "Profound's no-code **Agents** chain steps such as Generate Article, Create Content Brief and AEO Content Scorecard, and its integrations publish to WordPress, Webflow, Contentful, Sanity and other CMSs. **AI Marketer** surfaces opportunities and drafts work for approval. All of it runs on credits, with overage billed or usage paused as the account team sets it.",
      b: "Peec's **Actions** rank what to do next across owned, earned and site-audit work, each with its evidence, a content outline and a relative-impact rating. They refresh weekly, and an Impact view follows results. Peec says it doesn't write or publish content itself, so drafting happens in your own workflow.",
    },
    {
      id: "setup",
      title: "Setup and self-serve access",
      winner: "b",
      verdict:
        "Peec AI — you can check out, write your own prompts, pick your models and add competitors without a sales call, where a brand on Profound gets a 7-day trial on a set prompt list, then a demo.",
      a: "Profound's brand Trial is instant and self-serve: 50 prompts run daily for 7 days on ChatGPT, Gemini and AI Overviews, drawn from a recommended set for your industry rather than prompts you write, with no history, exports or API. After that, brands move to Enterprise through a demo, and Profound's team configures the primary competitor set during onboarding.",
      b: "Peec sells Starter, Pro and Advanced through self-serve checkout with self-serve onboarding. You write the prompts, choose the three models and add unlimited competitors yourself, with automatic suggestions to start from. Only Enterprise is sales-led, with custom setup and dedicated support.",
    },
    {
      id: "price",
      title: "Price for a small team",
      winner: "b",
      verdict:
        "Peec AI — it's the only one of the two with a paid self-serve plan for brands, from $95 a month, or $80 billed yearly, with unlimited users on every plan.",
      a: "Profound's brand pricing is now a free 7-day Trial or a custom-priced Enterprise contract. The **$99 Starter and $399 Growth** plans quoted in most roundups no longer appear on its pricing page. Its only paid self-serve plan is Agency Growth, at $99 a month plus $399 a month per client workspace.",
      b: "Peec's Starter is $95 a month for 50 prompts on three models in one country, Pro is $245 for 150 prompts, and Advanced is $495 for 350, each about 15% less billed yearly. Most analytics features come on every tier, so the plans scale mainly by volume.",
    },
    {
      id: "agencies",
      title: "Agency and multi-brand workflow",
      winner: "b",
      verdict:
        "Peec AI, for small and mid-size agencies — its published tiers pool credits across clients and include unlimited team and client logins, where Profound adds $399 a month per client workspace. At network scale, both sell custom agency contracts.",
      a: "Profound's **Agency Growth** is $99 a month for 10 pitch workspaces a month, agency mode and consolidated billing, plus $399 a month for each client workspace: 100 daily prompts on ChatGPT, Perplexity and AI Overviews, with CSV exports. It includes five agency seats and no API access. Agency Enterprise adds a dedicated partner and premium Slack support.",
      b: "Peec's agency plans are $245, $495 and $795 a month for 3, 10 and 25 client projects, with custom Comprehensive above. Credits are pooled across clients, where one prompt on one model for one day is one credit. Every tier includes unlimited team and client-view users and 3 to 10 active pitch projects.",
    },
    {
      id: "enterprise",
      title: "Enterprise readiness",
      winner: "a",
      verdict:
        "Profound — it states SOC 2 Type II, offers SSO with SCIM and role-based access, and backs Enterprise with a dedicated specialist on a 24-hour SLA.",
      a: "Profound Enterprise adds SSO over SAML or OIDC, SCIM directory sync, all-time history, CSV and JSON exports, a REST API with Python and JS SDKs, and dedicated Slack support. Profound says its customers include a third of the Fortune 100.",
      b: "Peec Enterprise adds SAML single sign-on, set up by Peec, plus the API, unlimited projects and countries, and dedicated support, billed annually. In January 2026 Peec described itself as pursuing SOC 2 and not yet certified; confirm the current status with the vendor if procurement requires it.",
    },
  ],
  matrix: [
    {
      group: "Engines",
      rows: [
        {
          label: "ChatGPT and AI Overviews",
          a: { state: "yes", note: "On every tier, Trial included" },
          b: { state: "yes", note: "Both in the choose-3 list on every plan" },
        },
        {
          label: "Gemini",
          a: { state: "partial", note: "Trial and Enterprise; not agency workspaces" },
          b: { state: "yes", note: "In the self-serve choose-3 list" },
        },
        {
          label: "Perplexity",
          a: { state: "partial", note: "Agency Growth and Enterprise" },
          b: { state: "partial", note: "Add-on or Enterprise; confirm with Peec" },
        },
        {
          label: "Google AI Mode and Copilot",
          a: { state: "partial", note: "Enterprise only" },
          b: { state: "yes", note: "Both in the self-serve choose-3 list" },
        },
        {
          label: "Claude and DeepSeek",
          a: { state: "partial", note: "Enterprise, captured from the browser" },
          b: { state: "partial", note: "Enterprise or agency Scale and up, via API" },
        },
      ],
    },
    {
      group: "Analytics",
      rows: [
        {
          label: "Visibility, share of voice, position",
          a: { state: "yes", note: "Visibility score, share of voice, average position" },
          b: { state: "yes", note: "Visibility, share of voice; position vs all brands" },
        },
        {
          label: "Citations and sources",
          a: { state: "yes", note: "By domain and subpath; custom categories" },
          b: { state: "yes", note: "Retrievals vs citations, source types, fan-outs" },
        },
        {
          label: "Sentiment",
          a: { state: "yes", note: "Score, themes and attributes on tagged prompts" },
          b: { state: "yes", note: "0–100 score per chat, plus Brand Perception" },
        },
        {
          label: "Fact-checking answers",
          a: { state: "yes", note: "FactCheck against your source of truth" },
          b: { state: "yes", note: "5, 10 or 25 prompts on self-serve plans" },
        },
        {
          label: "Prompt demand data",
          a: { state: "yes", note: "Consumer-panel volumes, intent, demographics" },
          b: { state: "partial", note: "Relative 1–5 score from web search trends" },
        },
        {
          label: "AI crawler analytics",
          a: { state: "yes", note: "CDN and server logs, no tag; unlimited domains" },
          b: { state: "yes", note: "Server logs; monthly bot-visit caps by plan" },
        },
        {
          label: "ChatGPT Shopping",
          a: { state: "partial", note: "Enterprise only; SKU-level analysis" },
          b: { state: "yes", note: "Every plan; SKU-level, since June 2026" },
        },
      ],
    },
    {
      group: "Action",
      rows: [
        {
          label: "Ranked recommendations",
          a: { state: "yes", note: "Opportunities and AI Marketer (Aim)" },
          b: { state: "yes", note: "Actions, refreshed weekly, with an Impact view" },
        },
        {
          label: "Content drafting",
          a: { state: "yes", note: "Agents draft briefs and articles, on credits" },
          b: { state: "no", note: "Not its focus; each Action includes a brief" },
        },
        {
          label: "CMS publishing",
          a: { state: "yes", note: "WordPress, Webflow, Contentful, Sanity and more" },
          b: { state: "no", note: "Not its focus; publishing stays with your team" },
        },
      ],
    },
    {
      group: "Access & account",
      rows: [
        {
          label: "Paid self-serve brand plan",
          a: { state: "no", note: "7-day Trial, then custom Enterprise" },
          b: { state: "yes", note: "Starter, Pro and Advanced at checkout" },
        },
        {
          label: "Seats",
          a: { state: "yes", note: "Unlimited; 5 agency seats on Agency Growth" },
          b: { state: "yes", note: "Unlimited on every plan, with roles" },
        },
        {
          label: "Data export",
          a: { state: "partial", note: "CSV and JSON on Enterprise and client workspaces" },
          b: { state: "yes", note: "Custom CSV exports on every plan" },
        },
        {
          label: "API and MCP",
          a: { state: "partial", note: "API on Enterprise; MCP server" },
          b: { state: "partial", note: "MCP on every plan; API on brand Enterprise" },
        },
        {
          label: "SSO and SOC 2",
          a: { state: "yes", note: "SSO, SCIM and SOC 2 Type II on Enterprise" },
          b: { state: "partial", note: "SAML SSO on Enterprise; confirm SOC 2" },
        },
      ],
    },
  ],
  pricing: {
    a: {
      model: "Brands: free trial, then custom; agencies: per client",
      trial: "7-day free Trial: 50 set prompts, 3 engines",
      url: "https://www.tryprofound.com/pricing",
      plans: [
        {
          name: "Trial",
          monthly: 0,
          includes: "7 days, 50 recommended prompts, ChatGPT, Gemini, AI Overviews; no exports",
        },
        {
          name: "Enterprise",
          monthly: null,
          includes: "Up to 9 engines, custom prompts, Prompt Volumes, API, SSO, 24-hour SLA",
        },
        {
          name: "Agency Growth",
          monthly: 99,
          forAgencies: true,
          includes: "Plus $399/mo per client workspace; 10 pitch workspaces, 5 seats",
        },
        {
          name: "Agency Enterprise",
          monthly: null,
          forAgencies: true,
          includes: "Tailored terms, dedicated agency partner, Slack support",
        },
      ],
    },
    b: {
      model: "Tiered by prompts, models and countries",
      trial: "Free trial; Peec says no card is needed",
      url: "https://peec.ai/pricing",
      plans: [
        {
          name: "Starter",
          monthly: 95,
          annual: 80,
          includes: "50 prompts, 3 models, 1 country, 1 project, unlimited users",
        },
        {
          name: "Pro",
          monthly: 245,
          annual: 205,
          includes: "150 prompts, 3 models, 3 countries, 2 projects",
        },
        {
          name: "Advanced",
          monthly: 495,
          annual: 420,
          includes: "350 prompts, 3 models, 5 projects, Looker Studio connector",
        },
        {
          name: "Enterprise",
          monthly: null,
          includes: "Up to 13 models, API, SSO, unlimited projects; billed annually",
        },
        {
          name: "Essential",
          monthly: 245,
          annual: 205,
          forAgencies: true,
          includes: "3 client projects, 10,000 pooled credits, unlimited client logins",
        },
        {
          name: "Growth",
          monthly: 495,
          annual: 420,
          forAgencies: true,
          includes: "10 client projects, 25,000 pooled credits",
        },
        {
          name: "Scale",
          monthly: 795,
          annual: 675,
          forAgencies: true,
          includes: "25 client projects, 65,000 pooled credits, weekly tracking",
        },
      ],
    },
    checkedOn: "2026-09-21",
    note: "Profound's $99 Starter and $399 Growth brand plans, still quoted by most roundups and parts of its own help centre, are no longer on its pricing page; its Agents and AI Marketer run on credits, with overage set by the account team, and five more agency trial workspaces cost $199 a month. Peec charges $35, $85 or $165 a month per extra model, by plan, and shows euros in some locales: Starter is €85, or €70 billed yearly. Its Enterprise is custom, not the $499 its January 2026 comparison page quotes.",
  },
  finder: [
    {
      id: "buying",
      question: "How do you want to buy it?",
      options: [
        {
          label: "Self-serve, on a published price",
          points: { b: 2 },
          because:
            "Peec AI sells three brand plans at checkout, from $95 a month with unlimited users.",
        },
        {
          label: "An enterprise contract that clears security review",
          points: { a: 2 },
          because:
            "Profound Enterprise includes SOC 2 Type II, SSO, SCIM and a specialist on a 24-hour SLA.",
        },
        {
          label: "An agency plan, billed across clients",
          points: { b: 1 },
          because:
            "Peec AI's agency tiers pool credits across clients; Profound adds $399 a month per client workspace.",
        },
      ],
    },
    {
      id: "prompts",
      question: "How will you choose which prompts to track?",
      options: [
        {
          label: "From real prompt volumes, by audience",
          points: { a: 2 },
          because:
            "Profound's Prompt Volumes come from a consumer panel, with intent and demographic breakdowns.",
        },
        {
          label: "From what we already know buyers ask",
          points: { b: 1 },
          because:
            "Peec AI tracks the prompts you write, with suggestions and a 1–5 demand score to check them.",
        },
      ],
    },
    {
      id: "next",
      question: "What happens once you see where you stand?",
      options: [
        {
          label: "Our team works from a ranked list of fixes",
          points: { b: 1 },
          because: "Peec AI's Actions rank what to do next, each with a brief, refreshed weekly.",
        },
        {
          label: "The platform should draft and publish too",
          points: { a: 1 },
          because:
            "Profound's Agents draft briefs and articles and publish through CMS integrations.",
        },
        {
          label: "I know we're not showing up — I need the content that would change that",
          points: { rankbox: 3 },
          because:
            "Both tools show where you stand in AI answers; what you need is the articles meant to move it.",
        },
      ],
    },
  ],
  thirdOption: {
    title: "If you already know you're not showing up",
    body: `Profound and Peec AI show where you stand in AI answers and which sources get cited. Peec leaves the writing to your team; Profound's content agents run on credits, which for brands means a custom contract. Rankbox, which publishes this comparison, writes the pages meant to move it. It maps the questions your buyers ask, writes long-form articles from live web research with the sources cited, scores every draft for SEO and AI-answer readiness, and delivers them on a schedule through its publishing API, at ${formatUsd(PLAN.monthly)} a month for ${PLAN.articlesPerMonth} articles. It isn't a tracker: if you need the measurement, one of the two above is still the better buy.`,
  },
  faqs: [
    {
      q: "How much do Profound and Peec AI cost?",
      a: "Peec AI starts at $95 a month, and Profound publishes no brand price: brands get a free 7-day Trial, then a custom Enterprise contract. Peec's Starter, Pro and Advanced plans are $95, $245 and $495 a month, about 15% less billed yearly, and its Enterprise is custom. Profound's agency plan is $99 a month plus $399 per client workspace. Both pricing pages were checked on 21 September 2026.",
    },
    {
      q: "Does Profound still have a $99 Starter plan?",
      a: "No. As of 21 September 2026, Profound's pricing page no longer lists the $99 Starter or $399 Growth brand plans, though most roundups and some of Profound's own help pages still describe them. The $99 price on the page today is Agency Growth, an agency plan that adds $399 a month for each client workspace.",
    },
    {
      q: "Which tracks more AI engines, Profound or Peec AI?",
      a: "Peec AI lists more — up to 13 models on Enterprise against Profound's 9 — but seven of Peec's run through an API rather than the consumer app. Profound's Enterprise list is ChatGPT, Perplexity, Google AI Mode, Gemini, Copilot, DeepSeek, Claude, AI Overviews and Exa Search. Below Enterprise, Peec plans track three models chosen from six, and Profound's Trial tracks ChatGPT, Gemini and AI Overviews.",
    },
    {
      q: "Do Profound and Peec AI have free trials?",
      a: "Yes, both. Profound's Trial is free for 7 days: 50 recommended prompts run daily on ChatGPT, Gemini and Google AI Overviews, with no exports or API. Peec AI offers a free trial and has said it needs no credit card; its own pages don't state the length, and third-party reviews say 7 days, so confirm with the vendor.",
    },
    {
      q: "Which is better for agencies?",
      a: "Peec AI, for most small and mid-size agencies. Its agency tiers are $245, $495 and $795 a month for 3, 10 and 25 client projects, with pooled credits and unlimited team and client logins. Profound's Agency Growth is $99 a month plus $399 per client workspace, with five agency seats and no API access. At network scale, both sell custom agency contracts.",
    },
    {
      q: "Can Profound or Peec AI write content?",
      a: "Profound can; Peec AI doesn't, by design. Profound's Agents generate briefs and articles and can publish through CMS integrations such as WordPress and Webflow, billed in credits. Peec's Actions rank what to fix and attach a content brief, and Peec says it doesn't write or publish content itself.",
    },
    {
      q: "Do they show what real users see, or API output?",
      a: "Both capture the consumer apps for their core engines. Profound says it captures answers directly from the browser, and Peec AI documents browser automation of each engine's web interface as a logged-out user. The extra models on Peec's Enterprise and agency Scale-and-up plans, including Claude, Grok, DeepSeek and Mistral, are queried through an API.",
    },
    {
      q: "Is Peec AI SOC 2 certified?",
      a: "Not as of Peec AI's last public statement: in January 2026 it described itself as pursuing SOC 2, not yet certified. Confirm the current status with the vendor. Peec offers SAML single sign-on on Enterprise, while Profound states SOC 2 Type II, with SSO and SCIM on Enterprise.",
    },
  ],
  sources: [
    { title: "Pricing", publisher: "Profound", href: "https://www.tryprofound.com/pricing" },
    {
      title: "The AI Platform to Power Your Marketing",
      publisher: "Profound",
      href: "https://www.tryprofound.com/",
    },
    {
      title: "Official information about Profound",
      publisher: "Profound",
      href: "https://www.tryprofound.com/ai-instructions",
    },
    {
      title: "Profound raises $180M Series D at $1.8B valuation",
      publisher: "Profound",
      href: "https://www.tryprofound.com/newsroom/profound-raises-usd180m-series-d-at-usd1-8b-valuation-to-build-the-ai-platform-for-marketing-teams",
    },
    {
      title: "Answer Engine Insights",
      publisher: "Profound",
      href: "https://www.tryprofound.com/features/answer-engine-insights",
    },
    {
      title: "Prompt Volumes",
      publisher: "Profound",
      href: "https://www.tryprofound.com/features/prompt-volumes",
    },
    {
      title: "Agent Analytics",
      publisher: "Profound",
      href: "https://www.tryprofound.com/features/agent-analytics",
    },
    {
      title: "Integrations",
      publisher: "Profound",
      href: "https://www.tryprofound.com/integrations",
    },
    {
      title: "About Prompt Volumes",
      publisher: "Profound Help Center",
      href: "https://help.tryprofound.com/articles/4288109168-prompt-volumes",
    },
    {
      title: "Answer Engine Insights settings",
      publisher: "Profound Help Center",
      href: "https://help.tryprofound.com/articles/4933646787-answer-engine-insights-settings",
    },
    {
      title: "About Sentiment",
      publisher: "Profound Help Center",
      href: "https://help.tryprofound.com/articles/3189907319-about-sentiment",
    },
    {
      title: "Developer docs index",
      publisher: "Profound",
      href: "https://docs.tryprofound.com/llms.txt",
    },
    { title: "Pricing for Brands", publisher: "Peec AI", href: "https://peec.ai/pricing" },
    {
      title: "Pricing for Agencies",
      publisher: "Peec AI",
      href: "https://peec.ai/pricing-agencies",
    },
    {
      title: "AI search analytics for marketing teams",
      publisher: "Peec AI",
      href: "https://peec.ai/",
    },
    { title: "AI Instructions", publisher: "Peec AI", href: "https://peec.ai/ai-instructions" },
    { title: "Changelog", publisher: "Peec AI", href: "https://peec.ai/changelog" },
    {
      title: "Peec AI vs Profound (January 2026)",
      publisher: "Peec AI",
      href: "https://peec.ai/comparison/peec-vs-profound",
    },
    {
      title: "Welcome to Peec AI",
      publisher: "Peec AI Docs",
      href: "https://docs.peec.ai/intro-to-peec-ai",
    },
    { title: "Actions", publisher: "Peec AI Docs", href: "https://docs.peec.ai/actions" },
    {
      title: "Setting up your prompts",
      publisher: "Peec AI Docs",
      href: "https://docs.peec.ai/setting-up-your-prompts",
    },
    {
      title: "Understanding credits",
      publisher: "Peec AI Docs",
      href: "https://docs.peec.ai/agencies/understanding_credits",
    },
    { title: "Single sign-on (SSO)", publisher: "Peec AI Docs", href: "https://docs.peec.ai/sso" },
    {
      title: "AEO startup Profound hits unicorn valuation, raises $180M Series D",
      publisher: "TechCrunch",
      href: "https://techcrunch.com/2026/09/15/aeo-startup-profound-hits-unicorn-valuation-raises-180m-series-d-7-months-after-last-round/",
    },
    {
      title: "Peec AI raises $21m Series A backed by Singular and Antler",
      publisher: "Sifted",
      href: "https://sifted.eu/articles/peec-ai-raises-21m-series-a",
    },
  ],
};
