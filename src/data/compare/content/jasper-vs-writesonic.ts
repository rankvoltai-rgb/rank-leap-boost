import type { MatchupEntry } from "../types";

/* Researched 2026-09-21 from both vendors' pricing pages, product pages and
   docs. Third-party "Jasper vs Writesonic" pages that rank today mostly quote
   retired plans (Writesonic at $16 with a free tier, Jasper Creator at $39) —
   none of those numbers are used here. */
export const entry: MatchupEntry = {
  slug: "jasper-vs-writesonic",
  metaTitle: "Jasper vs Writesonic (2026): Which AI Platform Fits You?",
  metaDescription:
    "Jasper vs Writesonic in 7 rounds: SEO articles, brand voice, AI search tracking, publishing and team features — with September 2026 prices and a fit quiz.",
  keywords: [
    "jasper vs writesonic",
    "writesonic vs jasper",
    "jasper ai vs writesonic",
    "jasper or writesonic",
    "jasper vs writesonic pricing",
    "writesonic alternative",
    "jasper alternative",
  ],
  subhead:
    "Both began as AI writers. Jasper grew into an enterprise marketing-agents platform; Writesonic into an AI search visibility tool with an article writer built in.",
  shortAnswer:
    "**Jasper** is a marketing agents platform: a brand-governed workspace where a team produces copy across ads, email, social and web, with AI search tracking added on its custom-priced Business plan. **Writesonic** is an AI search visibility platform with an SEO article writer built in: it tracks how ChatGPT, Gemini and Google AI Overviews mention you, drafts cited articles, and publishes them to WordPress. Choose Jasper if your problem is on-brand content in every channel. Choose Writesonic if your problem is showing up in AI search and ranking blog posts, on a self-serve budget.",
  picks: {
    a: [
      "Your team writes ads, email, social and web copy, not just blog posts",
      "Brand governance matters: one voice, style guide and audience set, enforced everywhere",
      "You're an enterprise that needs SSO, SCIM and a single annual contract",
    ],
    b: [
      "SEO articles are the job, and you want them published straight to WordPress",
      "You want AI search tracking in the same tool, from $79 a month",
      "You're a team of two to five buying self-serve, without a sales call",
    ],
  },
  tape: [
    { label: "What it is", a: "Marketing agents platform", b: "AI search visibility platform" },
    { label: "Founded", a: "2021 · Austin, Texas", b: "2021 · Y Combinator S21" },
    { label: "Starts at", a: "$59/mo yearly · $69 monthly", b: "$79/mo yearly · $99 monthly" },
    { label: "Free trial", a: "7 days, on Pro", b: "7 days, no card needed" },
    { label: "AI search tracking", a: "Business plan only", b: "Every plan · 3 engines" },
    { label: "SEO articles", a: "No published monthly cap", b: "15, 25 or 50 a month" },
    { label: "WordPress publishing", a: "No native connector", b: "Plugin on every plan" },
    { label: "Seats", a: "Pro: 1 · Business: unlimited", b: "1–3 included, up to 5" },
  ],
  rounds: [
    {
      id: "seo-articles",
      title: "SEO articles",
      winner: "b",
      verdict:
        "Writesonic, because blog posts are what its article pipeline is built for: SERP and Ahrefs research, citations, internal links and schema in every draft.",
      a: "Jasper writes long-form through its **Pillar Article** agent in Canvas, with no published article quota on Pro. SEO depth comes from its Optimization agent, which gives directional results unless you connect your own Semrush account.",
      b: "Writesonic's AI Article Writer runs a ten-phase pipeline for 3,000–8,000-word drafts, pulling live SERP, Ahrefs and Keyword Planner data. The trade-off is a cap: **15, 25 or 50 articles a month**, depending on the plan.",
    },
    {
      id: "research",
      title: "Research & citations",
      winner: "b",
      verdict:
        "Writesonic, narrowly — verified citations come with every self-serve article, while Jasper's fully cited Research agent is part of its Business plan's deep research.",
      a: "Jasper's agents pull context from your knowledge base, the web or specific URLs. Its Research agent returns reports with clickable source links, billed at 40 credits a run on the Business plan.",
      b: "Writesonic's deep web research mode draws on the open web, Ahrefs and Keyword Planner, and each draft is checked against a **Verified Citation Bank** before it can be published.",
    },
    {
      id: "brand-voice",
      title: "Brand voice",
      winner: "a",
      verdict:
        "Jasper — brand governance is the centre of the product, and every agent inherits the voice, style guide and audiences you set.",
      a: "**Jasper IQ** holds brand voices, audiences and a multi-modal knowledge base, with a Style Guide and Visual Guidelines on Business. Pro includes two voices and five knowledge assets.",
      b: "Writesonic trains **Writing Styles** from your own documents — one, five or ten by plan — and adds brand kits, author profiles and banned phrases. It covers articles well; it isn't built as a governance layer for a whole marketing org.",
    },
    {
      id: "copy-breadth",
      title: "Copy beyond articles",
      winner: "a",
      verdict:
        "Jasper, clearly: 100+ purpose-built agents cover ads, email, social, web and PR, with a full image suite and 30+ languages on the entry plan.",
      a: "Jasper's agents span advertising, email, social, website copy, press releases and product descriptions. Its image suite, built partly on the 2024 Clipdrop acquisition, handles generation, editing, background removal and upscaling.",
      b: "Writesonic's single Content Agent writes LinkedIn posts, sales emails, ad copy, newsletters and product pages on request. It does the job, but the product's weight now sits in AI visibility and articles.",
    },
    {
      id: "ai-search",
      title: "AI search tracking",
      winner: "b",
      verdict:
        "Writesonic — AI visibility is its core product and comes with every self-serve plan, where Jasper's GEO Hub launched in June 2026 on Business only.",
      a: "Jasper's **GEO Hub** and GEO Agent score brand presence, citation rate, sentiment and share of voice, and name ChatGPT, Gemini and Claude. They run on the Business plan at 10 credits a query or page run.",
      b: "Writesonic tracks ChatGPT, Gemini and Google AI Overviews from Starter, with AI bot analytics, sentiment from Growth, and an Action Center that turns gaps into fixes. Perplexity, Claude and five more engines are Enterprise-only.",
    },
    {
      id: "publishing",
      title: "Publishing to your site",
      winner: "b",
      verdict:
        "Writesonic — it publishes straight to WordPress, Sanity, Contentful, Webflow and Ghost on every plan, where Jasper hands content off through exports and automations.",
      a: "Jasper has a Webflow app and exports to Google Drive, SharePoint, Box, Asana and Monday. There's no native WordPress connector, and its Zapier and Make integrations sit on the Business plan.",
      b: "Writesonic's WordPress plugin connects up to ten sites and comes with every plan. Its integrations also write updated entries, schema and metadata back to the site when you approve a fix.",
    },
    {
      id: "teams",
      title: "Teams & governance",
      winner: "a",
      verdict:
        "Jasper, for organisations: unlimited users, SSO, SCIM, role-based permissions and Grid for bulk production, all on its Business contract.",
      a: "Jasper Business adds SAML SSO, SCIM provisioning, role-based permissions, document collaboration and **Grid**, a spreadsheet for producing content at volume. It starts with a 12-month commitment at a custom price.",
      b: "Writesonic suits small teams better: one to three users included, and up to five in total at $50 per extra user a month, all self-serve. SSO and user access control are reserved for Enterprise.",
    },
  ],
  matrix: [
    {
      group: "Writing",
      rows: [
        {
          label: "Long-form SEO articles",
          a: { state: "yes", note: "Pillar Article agent in Canvas; no published cap" },
          b: { state: "yes", note: "3,000–8,000-word pipeline; 15–50 a month by plan" },
        },
        {
          label: "Web research & citations",
          a: { state: "partial", note: "Cited Research agent is part of Business deep research" },
          b: { state: "yes", note: "Verified citations checked before every article publishes" },
        },
        {
          label: "Brand voice",
          a: { state: "yes", note: "Jasper IQ; 2 voices on Pro, Style Guide on Business" },
          b: { state: "yes", note: "Writing Styles: 1, 5 or 10 by plan" },
        },
        {
          label: "Ads, email & social copy",
          a: { state: "yes", note: "100+ purpose-built marketing agents" },
          b: { state: "yes", note: "One Content Agent covers posts, emails, ads and pages" },
        },
        {
          label: "AI images",
          a: { state: "yes", note: "Full suite: generate, edit, remove backgrounds, upscale" },
          b: { state: "partial", note: "Hero and section images inside articles" },
        },
      ],
    },
    {
      group: "SEO & AI search",
      rows: [
        {
          label: "Keyword & SERP data",
          a: { state: "partial", note: "Optimization agent; deeper data via your own Semrush" },
          b: { state: "yes", note: "Ahrefs, Keyword Planner and live SERPs built in" },
        },
        {
          label: "Site audits",
          a: { state: "partial", note: "AI Readiness Score agent grades individual pages" },
          b: { state: "yes", note: "10, 20 or 50 audits a month by plan" },
        },
        {
          label: "AI search visibility tracking",
          a: { state: "partial", note: "GEO Hub on Business; names ChatGPT, Gemini, Claude" },
          b: { state: "yes", note: "Every plan; ChatGPT, Gemini, AI Overviews self-serve" },
        },
        {
          label: "Sentiment & share of voice",
          a: { state: "partial", note: "Scored inside GEO Hub, on Business" },
          b: { state: "partial", note: "Sentiment from Growth; full Action Center on Enterprise" },
        },
      ],
    },
    {
      group: "Publishing & scale",
      rows: [
        {
          label: "Publishes to your CMS",
          a: { state: "partial", note: "Webflow app, exports; Zapier and Make on Business" },
          b: { state: "yes", note: "WordPress, Sanity, Contentful, Webflow, Ghost" },
        },
        {
          label: "Internal linking",
          a: { state: "partial", note: "Entity Mapper suggests link targets from your site" },
          b: { state: "yes", note: "Reads your sitemap to link relevant pages" },
        },
        {
          label: "Bulk generation",
          a: { state: "partial", note: "Jasper Grid, on Business at 10 credits a row" },
          b: { state: "partial", note: "Monthly caps; +20 articles for $100 on Growth" },
        },
        {
          label: "API",
          a: { state: "partial", note: "Business plan only" },
          b: { state: "partial", note: "Public API documented; not listed per plan" },
        },
      ],
    },
    {
      group: "Team & plan",
      rows: [
        {
          label: "Seats",
          a: { state: "partial", note: "Pro is one seat; more users means Business" },
          b: { state: "partial", note: "1–3 included; up to 5 at $50 a user" },
        },
        {
          label: "SSO & admin controls",
          a: { state: "yes", note: "SAML SSO, SCIM and role-based access on Business" },
          b: { state: "partial", note: "SSO and user access control on Enterprise" },
        },
        {
          label: "Free trial",
          a: { state: "yes", note: "7-day trial of Pro" },
          b: { state: "yes", note: "7 days, no card, plus a 7-day refund window" },
        },
      ],
    },
  ],
  pricing: {
    a: {
      model: "Per seat; usage credits on Business",
      trial: "7-day free trial of Pro",
      url: "https://www.jasper.ai/pricing",
      plans: [
        {
          name: "Pro",
          monthly: 69,
          annual: 59,
          includes: "1 seat, 2 brand voices, 100+ agents, image suite, 30+ languages",
        },
        {
          name: "Business",
          monthly: null,
          includes: "Unlimited users, GEO Hub, Grid, API, SSO; 12-month minimum",
        },
      ],
    },
    b: {
      model: "Tiered by prompts tracked and articles",
      trial: "7-day free trial, no card",
      url: "https://writesonic.com/pricing",
      plans: [
        {
          name: "Starter",
          monthly: 99,
          annual: 79,
          includes: "1 user, 50 prompts, 3 AI engines, 15 articles a month",
        },
        {
          name: "Basic",
          monthly: 249,
          annual: 199,
          includes: "2 users, 100 prompts, 25 articles, 5 writing styles",
        },
        {
          name: "Growth",
          monthly: 499,
          annual: 399,
          includes: "3 users, 200 prompts, sentiment, 50 articles",
        },
        {
          name: "Enterprise",
          monthly: null,
          includes: "All 10 AI platforms, full Action Center, SSO",
        },
      ],
    },
    checkedOn: "2026-09-21",
    note: "Jasper's Business plan is quote-only, starts with a 12-month commitment, and meters GEO Hub, Grid and heavier agents in credits whose dollar price isn't published. Writesonic's self-serve plans track three engines; the other seven are Enterprise-only. Pages quoting Writesonic at $16 or Jasper Creator at $39 describe plans neither pricing page lists today.",
  },
  finder: [
    {
      id: "writing",
      question: "What do you mostly need written?",
      options: [
        {
          label: "Blog posts that rank and get cited",
          points: { b: 2 },
          because: "You want SEO articles, and Writesonic builds its pipeline around them.",
        },
        {
          label: "Ads, email, social and web copy",
          points: { a: 2 },
          because: "You need breadth across channels, which Jasper's 100+ agents cover.",
        },
        {
          label: "Everything, under strict brand rules",
          points: { a: 1 },
          because: "Jasper IQ keeps voice, style guide and audiences consistent across formats.",
        },
      ],
    },
    {
      id: "tracking",
      question: "Do you need to see whether AI search mentions you?",
      options: [
        {
          label: "Yes, in the same tool",
          points: { b: 2 },
          because: "Writesonic includes AI visibility tracking on every plan.",
        },
        {
          label: "Yes, on an enterprise contract",
          points: { a: 1, b: 1 },
          because:
            "Both track AI search on their enterprise tiers: Jasper's GEO Hub, Writesonic's 10-engine plan.",
        },
        {
          label: "Not yet",
          points: { a: 1 },
          because: "Without tracking, Jasper Pro is the cheaper way in.",
        },
      ],
    },
    {
      id: "who",
      question: "Who will run it day to day?",
      options: [
        {
          label: "Just me",
          points: { a: 1 },
          because: "Jasper Pro is built for one seat, from $59 a month billed yearly.",
        },
        {
          label: "A team of two to five",
          points: { b: 1 },
          because: "Writesonic sells up to five users self-serve; Jasper needs Business.",
        },
        {
          label: "Nobody — we want articles to just appear",
          points: { rankbox: 3 },
          because: "Both tools assume someone runs them; you want finished articles delivered.",
        },
      ],
    },
  ],
  thirdOption: {
    title: "If the goal is articles on your site, not another workspace",
    body: "Jasper is where a marketing team works; Writesonic is where you watch AI search and draft against it. Both assume someone opens the tool, prompts it and approves what comes out. Rankbox is built for the founder who wants neither job: it decides what to write from the questions buyers ask, writes each article from live research with sources cited, checks it for SEO and AI-answer readiness, and delivers it to your site on a schedule. It doesn't write ads and it isn't a visibility dashboard — if you need those, one of the two above is still the better buy.",
  },
  faqs: [
    {
      q: "Which is cheaper, Jasper or Writesonic?",
      a: "Jasper is cheaper to start: Pro is $59 a month billed yearly, or $69 monthly, against Writesonic Starter at $79 or $99. The comparison flips if you need AI search tracking — Writesonic includes it from Starter, while Jasper's GEO Hub is on the custom-priced Business plan. Both pricing pages were checked on 21 September 2026.",
    },
    {
      q: "Does Jasper or Writesonic have a free plan?",
      a: "Neither lists a free plan on its current pricing page. Both offer a 7-day free trial, and Writesonic says its trial needs no credit card. Pages still advertising a free Writesonic plan, or Jasper's old Creator plan, are out of date.",
    },
    {
      q: "Is Writesonic still an AI writer?",
      a: 'Partly. Writesonic now sells itself as an AI search visibility platform — its homepage calls it "The AI Search Growth Engine" — with an SEO article writer bundled into every plan, capped at 15, 25 or 50 articles a month.',
    },
    {
      q: "Which is better for SEO blog posts?",
      a: "Writesonic, because it's built around them: its article pipeline pulls SERP, Ahrefs and Keyword Planner data, adds verified citations, internal links and schema, and publishes to WordPress. Jasper writes long-form through its Pillar Article agent and leans on an optional Semrush connection for SEO data.",
    },
    {
      q: "Can Jasper publish to WordPress?",
      a: "Not natively. Jasper's integrations page lists a Webflow app, exports to tools like Google Drive and SharePoint, and Zapier or Make on the Business plan. Writesonic publishes directly to WordPress on every plan, plus Sanity, Contentful, Webflow and Ghost.",
    },
    {
      q: "Does Jasper still integrate with Surfer SEO?",
      a: "No. Surfer's own integration page now says \"Jasper integration is no longer available.\" Jasper's SEO data connection today is Semrush, which its Optimization agent uses when you connect an account.",
    },
    {
      q: "Which tracks more AI search engines?",
      a: "Writesonic, on its Enterprise plan, which covers ten engines including Perplexity, Claude and Google AI Mode. Its self-serve plans track three: ChatGPT, Gemini and Google AI Overviews. Jasper's GEO Hub, on the Business plan, names ChatGPT, Gemini and Claude.",
    },
    {
      q: "Can a team share one account?",
      a: "On Writesonic, yes: plans include one to three users, and Basic or Growth can go up to five at $50 per extra user a month. Jasper Pro is a single seat, so more users means moving to the Business plan.",
    },
  ],
  sources: [
    { title: "Plans & Pricing", publisher: "Jasper", href: "https://www.jasper.ai/pricing" },
    {
      title: "Put AI agents to work for marketing",
      publisher: "Jasper",
      href: "https://www.jasper.ai/",
    },
    {
      title: "Our mission, vision, leadership & values",
      publisher: "Jasper",
      href: "https://www.jasper.ai/about",
    },
    {
      title: "Credits rate card",
      publisher: "Jasper",
      href: "https://www.jasper.ai/credits-rate-card",
    },
    {
      title: "Introducing Jasper GEO Agent and GEO Hub",
      publisher: "Jasper",
      href: "https://www.jasper.ai/blog/geo-agent-and-geo-hub",
    },
    {
      title: "The Optimization AI agent",
      publisher: "Jasper",
      href: "https://www.jasper.ai/agents/optimization",
    },
    { title: "Jasper Grid", publisher: "Jasper", href: "https://www.jasper.ai/grid" },
    {
      title: "Jasper integrations",
      publisher: "Jasper",
      href: "https://www.jasper.ai/integrations",
    },
    {
      title: "Jasper integration (no longer available)",
      publisher: "Surfer",
      href: "https://surferseo.com/integrations/jasper/",
    },
    {
      title: "Pricing — AI Search Visibility Platform",
      publisher: "Writesonic",
      href: "https://writesonic.com/pricing",
    },
    {
      title: "The AI Search Growth Engine",
      publisher: "Writesonic",
      href: "https://writesonic.com/",
    },
    {
      title: "AI Article Writer",
      publisher: "Writesonic",
      href: "https://writesonic.com/ai-article-writer",
    },
    {
      title: "AI Visibility Tracker",
      publisher: "Writesonic",
      href: "https://writesonic.com/ai-visibility-tracker",
    },
    { title: "Integrations", publisher: "Writesonic", href: "https://writesonic.com/integrations" },
    {
      title: "Publish to WordPress.org",
      publisher: "Writesonic Help Center",
      href: "https://docs.writesonic.com/docs/publish-to-wordpressorg",
    },
    {
      title: "Writesonic company profile",
      publisher: "Y Combinator",
      href: "https://www.ycombinator.com/companies/writesonic",
    },
  ],
};
