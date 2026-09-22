import { PLAN, formatUsd } from "@/data/pricing";
import type { MatchupEntry } from "../types";

/* Researched 2026-09-21 from both vendors' pricing pages (including the plan
   data embedded in each page's source), knowledge bases, product pages and
   Adobe's and the SEC's filings. Semrush's Pro / Guru / Business plans are no
   longer on its pricing page, which now redirects to the SEO + AI Search
   plans; roundups still quoting Guru at $249.95 or Business at $499.95 are not
   used here. Backlink index sizes are contested — both vendors' own figures
   are quoted, with the disagreement stated, and no count is picked. */
export const entry: MatchupEntry = {
  slug: "semrush-vs-ahrefs",
  metaTitle: "Semrush vs Ahrefs (2026): Which SEO Suite Fits You?",
  metaDescription:
    "Semrush vs Ahrefs in 7 rounds: keywords, backlinks, rank tracking, AI search visibility and price — with September 2026 list prices and a fit quiz.",
  keywords: [
    "semrush vs ahrefs",
    "ahrefs vs semrush",
    "semrush or ahrefs",
    "is semrush better than ahrefs",
    "semrush vs ahrefs pricing",
    "semrush vs ahrefs backlinks",
    "semrush alternative",
    "ahrefs alternative",
  ],
  subhead:
    "Both are all-in-one SEO research suites with keyword databases of almost the same size. Semrush, now owned by Adobe, sells more marketing toolkits around its SEO plans; Ahrefs, independent and bootstrapped, stays closer to SEO data.",
  shortAnswer:
    "**Semrush** is a visibility platform: SEO plans with daily rank tracking, AI prompt tracking bundled from its $199 Starter plan, and separate toolkits for local, ads, social, PR and traffic data under one login. **Ahrefs** is an SEO data platform built around its backlink and keyword indexes, with a permanent free plan, plus API access and 5–20 daily AI prompts from its $129 Lite plan. Choose Semrush if you want daily rankings, AI prompt tracking and marketing beyond SEO from one vendor. Choose Ahrefs if link research is the job, you want API access below the top tier, or you're starting free.",
  picks: {
    a: [
      "You want rankings updated daily without paying for an add-on",
      "You want to track 50 or more AI search prompts a day on one plan",
      "Local, ads, social or PR work belongs in the same account as your SEO",
    ],
    b: [
      "Backlink research and link building are most of the job",
      "You want API access on a $129 plan, not only at the top tier",
      "You'd rather start on a free plan for your own verified sites",
    ],
  },
  tape: [
    {
      label: "What it is",
      a: "SEO, AI search and marketing toolkits",
      b: "SEO data platform with AI visibility tools",
    },
    {
      label: "Founded",
      a: "2008 · Boston · owned by Adobe since 2026",
      b: "2010–11 · Singapore · bootstrapped",
    },
    {
      label: "Starts at",
      a: "$117.33/mo yearly · $139.95 monthly",
      b: "$29 Starter · Lite $129 ($107.50 yearly)",
    },
    {
      label: "Free access",
      a: "Free plan + 7-day trial (card needed)",
      b: "Ahrefs Free for verified sites · no trial",
    },
    { label: "Rank tracking", a: "Daily on every paid plan", b: "Weekly; daily is a paid add-on" },
    {
      label: "AI prompt tracking",
      a: "50–200 a day, from $199 Starter",
      b: "5–20 a day, from $129 Lite",
    },
    {
      label: "API",
      a: "Advanced ($549) only; units sold on top",
      b: "Lite, Standard and Advanced, from $129",
    },
    {
      label: "Users",
      a: "1 per plan; extra $45–$100 each",
      b: "1 per plan; extra $40–$80 each, capped",
    },
  ],
  rounds: [
    {
      id: "keyword-research",
      title: "Keyword research",
      winner: "draw",
      verdict:
        "Draw — the two keyword databases are almost the same size, so the tie-breaker is whether you need more locations or more reports per dollar.",
      a: "Semrush's knowledge base lists **28.8 billion keywords** across 142 geographic databases as of 2026. Its $139.95 SEO plan allows 3,000 reports a day at 10,000 rows each, so heavy research fits on the entry plan.",
      b: "Ahrefs states **28.7 billion** keywords, filtered from 110 billion it has seen, across 217 locations. Lite meters research at 1,000 credits a month with 2,500 rows per report; Standard and above have unlimited credits under fair use.",
    },
    {
      id: "backlinks",
      title: "Backlink data",
      winner: "b",
      verdict:
        "Ahrefs, narrowly: link data is the product it was built on, and it cites Cloudflare Radar ranking its crawler first among SEO bots. Semrush states a larger index and one 2026 third-party test favoured it, so treat this as contested.",
      a: "Semrush states **43 trillion backlinks**, crawls around 10 billion links a day and says new links appear in about 40 minutes on average. Its tool shows links seen in the last six months; Ahrefs describes the 43 trillion as live and dead links combined.",
      b: "Ahrefs' data page lists **35 trillion** records of external backlink history, while its About page says 3 trillion external backlinks. It says the index takes fresh data every 15–30 minutes, and cites Cloudflare Radar, as of July 2026, ranking AhrefsBot the top SEO crawler.",
    },
    {
      id: "audits-rank-tracking",
      title: "Site audits & rank tracking",
      winner: "a",
      verdict:
        "Semrush, on rank tracking: positions update daily on every paid plan, where Ahrefs updates weekly unless you buy its daily add-on. Site audits are close to even.",
      a: "Semrush's Position Tracking checks 500 to 5,000 keywords daily by plan, AI Overviews included, with multi-location and device tracking from Pro+. Site Audit covers 100,000 to 1 million pages a month, with AI-crawler checks from Starter and JavaScript rendering from Pro+.",
      b: "Ahrefs' Rank Tracker covers 190+ locations down to ZIP code and 19 SERP features, updated weekly by default. Its Site Audit runs 170+ checks, can run always-on, and is free for your own verified sites through **Ahrefs Free**.",
    },
    {
      id: "ai-search",
      title: "AI search visibility",
      winner: "a",
      verdict:
        "Semrush, narrowly and on value: Starter tracks 50 prompts a day for $199, against 5 on Ahrefs Lite. Ahrefs covers more engines and states a larger prompt index, at extra cost.",
      a: "Semrush bundles AI tracking into Starter, Pro+ and Advanced (sold as **Semrush One**): 50, 100 or 200 tracked prompts a day, with AI data covering ChatGPT, AI Overviews, AI Mode, Gemini and Perplexity from a stated 317-million-prompt database. It doesn't document how a prompt counts across engines, and the $139.95 SEO plan includes no prompt tracking.",
      b: "Ahrefs' **Brand Radar** includes 5, 10 or 20 custom prompts a day on Lite, Standard and Advanced, each checked on every platform you select, Claude included. Its AI Visibility Index — a stated 454M+ prompts across six engines, Copilot among them — costs $199 a month per platform or $699 for all.",
    },
    {
      id: "api-free",
      title: "API & free access",
      winner: "b",
      verdict:
        "Ahrefs — its API comes with every plan from the $129 Lite, where Semrush's needs the $549 Advanced plan plus units, and Ahrefs Free gives real data on your own sites with no card and no expiry.",
      a: "Semrush's API is part of the $549 Advanced plan, with API units sold in packages at prices it doesn't publish; its MCP server comes with every plan. The free plan gives one demo project and 10 reports a day, and the 7-day trial needs a card.",
      b: "Ahrefs includes API and MCP access on Lite, Standard and Advanced, with row caps per request by plan. **Ahrefs Free** — formerly Webmaster Tools — covers site audits, backlinks and keywords for unlimited verified sites, with no card and no expiry.",
    },
    {
      id: "price",
      title: "Price for a solo founder or small team",
      winner: "draw",
      verdict:
        "Draw — Ahrefs costs less for light use, with a free plan and a $29 Starter; Semrush gives more for daily use with AI tracking, at 50 prompts and 3,000 reports a day for $199.",
      a: "Semrush's cheapest paid plan is SEO at $139.95 a month, or $117.33 billed yearly, with no AI prompt tracking; Starter adds 50 daily prompts at $199. Each plan includes one user, extra seats cost $45 to $100 a month, and the 7-day trial needs a card.",
      b: "Ahrefs starts at $0 with **Ahrefs Free**, then Starter at $29 a month (monthly only, one project, 200 credits) and Lite at $129. There's no trial, refunds are generally not issued, and Lite takes up to two extra users at $40 each.",
    },
    {
      id: "breadth",
      title: "Breadth beyond SEO",
      winner: "a",
      verdict:
        "Semrush, clearly: separate toolkits for local listings, advertising, social, AI PR and all-channel traffic sit under one login, where Ahrefs' local and social tools are still in beta.",
      a: "Semrush sells **Local** ($30–$60 per location, with listing management across 70+ directories on Pro), **Advertising** ($99–$220), **Social** ($20–$250), **AI PR** ($149–$499) and **Traffic & Market** ($289, all-channel traffic from a panel of over 200 million users), each on top of the SEO plan.",
      b: "Ahrefs covers paid keywords and ad history inside its SEO reports, plus GBP Monitor and a Social Media Manager, both in beta, and Web Analytics for your own site. It isn't built for ad launches, listing distribution or competitors' all-channel traffic.",
    },
  ],
  matrix: [
    {
      group: "Research data",
      rows: [
        {
          label: "Keyword database",
          a: { state: "yes", note: "28.8B keywords, 142 databases (2026)" },
          b: { state: "yes", note: "28.7B filtered keywords, 217 locations" },
        },
        {
          label: "Backlink index",
          a: { state: "yes", note: "43T backlinks stated; shows the last 6 months" },
          b: { state: "yes", note: "35T link-history records; About page says 3T" },
        },
        {
          label: "Competitor traffic estimates",
          a: { state: "yes", note: "Organic and paid; all-channel via $289 toolkit" },
          b: { state: "partial", note: "Organic and paid search estimates" },
        },
        {
          label: "Usage limits at entry",
          a: { state: "yes", note: "3,000 reports a day, 10,000 rows each" },
          b: { state: "partial", note: "Lite: 1,000 credits a month, 2,500 rows" },
        },
        {
          label: "Historical data",
          a: { state: "partial", note: "Pro+ and Advanced only" },
          b: { state: "yes", note: "6 months on Lite, 2 years Standard, 5 Advanced" },
        },
      ],
    },
    {
      group: "Audits, tracking & content",
      rows: [
        {
          label: "Site audit",
          a: { state: "yes", note: "100k–1M pages a month; JS rendering from Pro+" },
          b: { state: "yes", note: "170+ checks, always-on; free for verified sites" },
        },
        {
          label: "Rank tracking",
          a: { state: "yes", note: "Daily on every paid plan, 500–5,000 keywords" },
          b: { state: "partial", note: "Weekly by default; daily is a paid add-on" },
        },
        {
          label: "Local SEO",
          a: { state: "yes", note: "Local toolkit, $30–$60 per location" },
          b: { state: "partial", note: "GBP Monitor, in beta on paid plans" },
        },
        {
          label: "Content writing tools",
          a: { state: "yes", note: "Content Toolkit $60/mo; optimization on Pro+" },
          b: { state: "partial", note: "Content Kit add-on, from $99/mo" },
        },
      ],
    },
    {
      group: "AI search",
      rows: [
        {
          label: "AI prompt tracking",
          a: { state: "yes", note: "50–200 a day from Starter; none on SEO plan" },
          b: { state: "yes", note: "5–20 a day on Lite and up, per platform" },
        },
        {
          label: "AI engines covered",
          a: { state: "yes", note: "ChatGPT, AI Overviews, AI Mode, Gemini, Perplexity" },
          b: { state: "yes", note: "Those five plus Copilot; Claude in custom prompts" },
        },
        {
          label: "AI reports for any domain",
          a: { state: "yes", note: "300 a day from Starter" },
          b: { state: "partial", note: "AI Visibility Index add-on, from $199/mo" },
        },
      ],
    },
    {
      group: "Plans & access",
      rows: [
        {
          label: "Free plan",
          a: { state: "partial", note: "1 demo project, 10 reports a day" },
          b: { state: "yes", note: "Ahrefs Free: unlimited verified sites" },
        },
        {
          label: "Free trial",
          a: { state: "yes", note: "7 days, card required, exports off" },
          b: { state: "no", note: "No trial; refunds generally not issued" },
        },
        {
          label: "API",
          a: { state: "partial", note: "Advanced only; units sold in packages" },
          b: { state: "yes", note: "Lite and up; rows per request capped by plan" },
        },
        {
          label: "MCP access",
          a: { state: "yes", note: "All four plans" },
          b: { state: "yes", note: "Lite and up, alongside the API" },
        },
        {
          label: "Extra users",
          a: { state: "yes", note: "$45, $80 or $100 a month by plan" },
          b: { state: "partial", note: "$40–$80 each, capped at 2–10 extra" },
        },
      ],
    },
  ],
  pricing: {
    a: {
      model: "Per plan, one user each; toolkits sold separately",
      trial:
        "7-day free trial on SEO, Starter and Pro+ (card required, exports off); free plan with 10 reports a day",
      url: "https://www.semrush.com/pricing/seo-ai-search/",
      plans: [
        {
          name: "SEO",
          monthly: 139.95,
          annual: 117.33,
          includes: "5 websites, 500 tracked keywords, 3,000 reports a day; no AI prompts",
        },
        {
          name: "Starter",
          monthly: 199,
          annual: 165.17,
          includes: "SEO limits plus 50 AI prompts a day, 1 brand-performance domain",
        },
        {
          name: "Pro+",
          monthly: 299,
          annual: 248.17,
          includes: "15 websites, 1,500 keywords, 100 prompts, historical data",
        },
        {
          name: "Advanced",
          monthly: 549,
          annual: 455.67,
          includes: "40 websites, 5,000 keywords, 200 prompts, Share of Voice, API",
        },
        {
          name: "Enterprise",
          monthly: null,
          includes: "Unlimited websites; custom limits",
        },
      ],
    },
    b: {
      model: "Per plan, one user each; credits on Starter and Lite",
      trial: "No free trial; Ahrefs Free plan for your own verified sites",
      url: "https://ahrefs.com/pricing",
      plans: [
        {
          name: "Ahrefs Free",
          monthly: 0,
          includes: "Unlimited verified sites; site audit, 1K backlinks and keywords visible",
        },
        {
          name: "Starter",
          monthly: 29,
          includes: "Monthly only; 1 project, 50 tracked keywords, 200 credits",
        },
        {
          name: "Lite",
          monthly: 129,
          annual: 107.5,
          includes: "5 projects, 750 keywords, 1,000 credits, 5 AI prompts, API",
        },
        {
          name: "Standard",
          monthly: 249,
          annual: 207.5,
          includes: "20 projects, 2,000 keywords, unlimited credits, 10 prompts",
        },
        {
          name: "Advanced",
          monthly: 449,
          annual: 374.17,
          includes: "50 projects, 5,000 keywords, 20 prompts, 5 years of history",
        },
        {
          name: "Enterprise",
          monthly: 1499,
          includes: "Annual commitment; 3+ users, 100 projects, 10,000+ keywords",
        },
      ],
    },
    checkedOn: "2026-09-21",
    note: 'Semrush\'s page shows the SEO plan as "$139", but its plan data and knowledge base say $139.95. Semrush sells Local, Content, Advertising, Social, AI PR and Traffic & Market as separate toolkits, the standalone AI Visibility Toolkit at $99 a month per domain, and API units in packages on top of Advanced. Ahrefs adds $40–$80 a month per extra user on self-serve plans, $50 per 500 extra credits on Lite, $199 a month per AI Visibility Index platform or $699 for all, Content Kit from $99, and a paid add-on for daily rank updates. Roundups quoting Semrush Guru at $249.95 or Business at $499.95 describe plans its pricing page no longer lists.',
  },
  finder: [
    {
      id: "job",
      question: "What takes up most of your SEO time?",
      options: [
        {
          label: "Backlinks and link building",
          points: { b: 2 },
          because: "Link data is the product Ahrefs was built on.",
        },
        {
          label: "Tracking rankings and AI search answers",
          points: { a: 2 },
          because: "Semrush updates rankings daily and bundles 50+ daily AI prompts from Starter.",
        },
        {
          label: "Getting articles researched, written and published",
          points: { rankbox: 3 },
          because: "Both suites tell you what to write; you want the articles themselves.",
        },
      ],
    },
    {
      id: "scope",
      question: "What else should the tool cover?",
      options: [
        {
          label: "Local, ads, social or PR",
          points: { a: 2 },
          because: "Semrush sells a toolkit for each, under the same login.",
        },
        {
          label: "API access for my own scripts or dashboards",
          points: { b: 2 },
          because: "Ahrefs includes API access from its $129 Lite plan; Semrush's is on Advanced.",
        },
        {
          label: "Just SEO",
          points: { b: 1 },
          because: "Ahrefs stays close to SEO data, with fewer add-on toolkits to price.",
        },
      ],
    },
    {
      id: "budget",
      question: "How will you use it, and pay for it?",
      options: [
        {
          label: "Free or close to it, checking in now and then",
          points: { b: 2 },
          because: "Ahrefs Free and the $29 Starter plan suit occasional use.",
        },
        {
          label: "Around $200 a month, used daily",
          points: { a: 2 },
          because:
            "Semrush Starter, at $199, includes 50 daily AI prompts and 3,000 reports a day.",
        },
        {
          label: "I want to try it before I pay",
          points: { a: 1 },
          because: "Semrush offers a 7-day free trial; Ahrefs offers a free plan instead.",
        },
      ],
    },
  ],
  thirdOption: {
    title: "If what you need is the articles, not the research",
    body: `Semrush and Ahrefs are research platforms: they show what to target, who ranks and what to fix, and then someone still has to write the articles. Rankbox, which publishes this comparison, does the writing. It maps the questions your buyers ask, writes long-form articles from live web research with the sources cited, scores every draft for SEO and AI-answer readiness, and delivers finished articles to your site on a schedule through its publishing API, at ${formatUsd(PLAN.monthly)} a month for ${PLAN.articlesPerMonth} articles. It isn't a research suite — if you need rankings, competitor data or site audits every day, one of the two above is still the better buy.`,
  },
  faqs: [
    {
      q: "Is Semrush or Ahrefs better?",
      a: "Semrush fits daily rank tracking, bundled AI prompt tracking and marketing beyond SEO; Ahrefs fits backlink research, API access from $129 and free use on your own sites. Their keyword databases are close to the same size, at about 28.7–28.8 billion keywords each, so the choice usually comes down to scope rather than data.",
    },
    {
      q: "Which is cheaper, Semrush or Ahrefs?",
      a: "Ahrefs is cheaper to start: Ahrefs Free costs nothing, Starter is $29 a month and Lite is $129, against Semrush's $139.95 SEO plan. With AI prompt tracking included, Ahrefs Lite is $129 for 5 daily prompts and Semrush Starter is $199 for 50. Semrush's entry plan allows 3,000 reports a day, while Lite meters use at 1,000 credits a month. Both pricing pages were checked on 21 September 2026.",
    },
    {
      q: "Is there a free trial for Semrush or Ahrefs?",
      a: "Semrush has one and Ahrefs doesn't. Semrush offers a 7-day free trial on its SEO, Starter and Pro+ plans; it needs a card and turns off exports. Ahrefs offers no trial and generally no refunds, but its permanent **Ahrefs Free** plan, formerly Ahrefs Webmaster Tools, covers site audits, backlinks and keywords for your own verified sites. Semrush also has a free plan, limited to one demo project and 10 reports a day.",
    },
    {
      q: "Which has the bigger backlink database?",
      a: "It's contested, and the vendors' own figures don't settle it. Semrush states 43 trillion backlinks, which Ahrefs describes as live and dead links combined. Ahrefs lists 35 trillion records of backlink history on its data page but 3 trillion external backlinks on its About page. A Style Factory comparison updated 2 September 2026 saw Semrush show more referring domains in 9 of 10 tests; other third-party reviews favour Ahrefs.",
    },
    {
      q: "Is Semrush owned by Adobe now?",
      a: "Yes. Adobe completed its acquisition of Semrush on 28 April 2026, at $12.00 a share in cash, about $1.9 billion in equity value; Semrush is now a wholly owned Adobe subsidiary and no longer listed on the NYSE. Semrush told customers there were no immediate changes to services, billing or existing contracts. In June 2026 Adobe launched Adobe Brand Visibility, an enterprise product that uses Semrush's AI visibility data.",
    },
    {
      q: "Can Semrush and Ahrefs track ChatGPT and Google AI Overviews?",
      a: "Yes, both do. Semrush's AI data covers ChatGPT, AI Overviews, AI Mode, Gemini and Perplexity, with prompt tracking on its Starter, Pro+ and Advanced plans or through its $99 AI Visibility Toolkit; the $139.95 SEO plan includes no prompt tracking. Ahrefs' Brand Radar includes 5–20 daily custom prompts on Lite and up, Claude among the options, and sells an AI Visibility Index covering six engines, Copilot included, from $199 a month per platform.",
    },
    {
      q: "Which is better for a beginner or a small business?",
      a: "Ahrefs is the cheaper place to start, and Semrush gives more room once you use it every day. Ahrefs Free covers site audits, backlinks and keywords for your own verified sites at no cost, and Starter is $29 a month. Semrush's SEO plan, at $139.95, allows 3,000 reports a day and updates rankings daily, and its 7-day trial lets you try it before paying.",
    },
    {
      q: "Does Ahrefs include API access on cheaper plans than Semrush?",
      a: "Yes. Ahrefs includes API and MCP access on Lite ($129), Standard and Advanced, with a cap on rows per request that rises by plan. Semrush's pricing page lists API access on Advanced ($549) only, with API units sold separately in packages; its MCP access comes with all four plans, including the $139.95 SEO plan.",
    },
  ],
  sources: [
    {
      title: "Plans & Pricing (SEO + AI Search)",
      publisher: "Semrush",
      href: "https://www.semrush.com/pricing/seo-ai-search/",
    },
    {
      title: "Subscription plans & Toolkits",
      publisher: "Semrush Knowledge Base",
      href: "https://www.semrush.com/kb/1011-subscriptions",
    },
    {
      title: "AI Visibility Toolkit",
      publisher: "Semrush Knowledge Base",
      href: "https://www.semrush.com/kb/1493-ai-visibility-toolkit",
    },
    {
      title: "Where does the data in Semrush's AI Visibility Toolkit come from?",
      publisher: "Semrush Knowledge Base",
      href: "https://www.semrush.com/kb/1607-semrush-ai-visibility-data",
    },
    {
      title: "What is Semrush One?",
      publisher: "Semrush Knowledge Base",
      href: "https://www.semrush.com/kb/1608-semrush-one",
    },
    {
      title: "Where does Semrush data come from?",
      publisher: "Semrush Knowledge Base",
      href: "https://www.semrush.com/kb/998-where-does-semrush-data-come-from",
    },
    {
      title: "How are Backlinks on Semrush updated?",
      publisher: "Semrush Knowledge Base",
      href: "https://www.semrush.com/kb/77-how-are-backlinks-updated",
    },
    {
      title: "AI Visibility Toolkit pricing",
      publisher: "Semrush",
      href: "https://www.semrush.com/pricing/ai/",
    },
    {
      title: "Local toolkit pricing",
      publisher: "Semrush",
      href: "https://www.semrush.com/pricing/local/",
    },
    {
      title: "Content toolkit pricing",
      publisher: "Semrush",
      href: "https://www.semrush.com/pricing/content/",
    },
    {
      title: "FAQ for Customers: Adobe Acquires Semrush",
      publisher: "Semrush",
      href: "https://www.semrush.com/news/455963-faq-for-customers-adobe-acquires-semrush/",
    },
    {
      title: "Introducing Adobe Brand Visibility",
      publisher: "Semrush",
      href: "https://www.semrush.com/news/462048-introducing-adobe-brand-visibility-a-unified-solution-for-the-ai-search-era/",
    },
    { title: "Plans & pricing", publisher: "Ahrefs", href: "https://ahrefs.com/pricing" },
    { title: "Brand Radar", publisher: "Ahrefs", href: "https://ahrefs.com/brand-radar" },
    {
      title: "We're powered by seriously big data",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/big-data",
    },
    { title: "About Ahrefs", publisher: "Ahrefs", href: "https://ahrefs.com/about" },
    { title: "Ahrefs vs Semrush", publisher: "Ahrefs", href: "https://ahrefs.com/vs/semrush" },
    { title: "Ahrefs Free", publisher: "Ahrefs", href: "https://ahrefs.com/free" },
    { title: "Rank Tracker", publisher: "Ahrefs", href: "https://ahrefs.com/rank-tracker" },
    { title: "GBP Monitor", publisher: "Ahrefs", href: "https://ahrefs.com/gbp-monitor" },
    {
      title: "About Ahrefs Starter plan",
      publisher: "Ahrefs Help Center",
      href: "https://help.ahrefs.com/en/articles/9419051-about-ahrefs-starter-plan",
    },
    {
      title: "What's the difference between all Ahrefs subscription plans?",
      publisher: "Ahrefs Help Center",
      href: "https://help.ahrefs.com/en/articles/6117209-what-s-the-difference-between-all-ahrefs-subscription-plans",
    },
    {
      title: "Ahrefs usage-based pricing for credit-based plans",
      publisher: "Ahrefs Help Center",
      href: "https://help.ahrefs.com/en/articles/6061657-ahrefs-usage-based-pricing-for-credit-based-plans",
    },
    {
      title: "Do you offer any discounts or free trials?",
      publisher: "Ahrefs Help Center",
      href: "https://help.ahrefs.com/en/articles/1406260-do-you-offer-any-discounts-or-free-trials",
    },
    {
      title: "New features, May 2026",
      publisher: "Ahrefs Blog",
      href: "https://ahrefs.com/blog/new-features-may-2026/",
    },
    {
      title: "Adobe to Acquire Semrush",
      publisher: "Adobe",
      href: "https://news.adobe.com/news/2025/11/adobe-to-acquire-semrush",
    },
    {
      title: "Adobe Completes Semrush Acquisition",
      publisher: "Adobe",
      href: "https://news.adobe.com/news/2026/04/adobe-completes-semrush-acquisition",
    },
    {
      title: "Semrush Holdings Form 8-K: completion of merger",
      publisher: "SEC EDGAR",
      href: "https://www.sec.gov/Archives/edgar/data/1831840/000114036126017299/ef20071354_8k.htm",
    },
    {
      title: "Ahrefs vs Semrush (updated 2 September 2026)",
      publisher: "Style Factory",
      href: "https://www.stylefactoryproductions.com/blog/ahrefs-vs-semrush",
    },
  ],
};
