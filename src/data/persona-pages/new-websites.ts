/**
 * /use-cases/new-websites: the page's words and data. The layout in
 * src/components/personas/new-websites/ sets them; the route's head and
 * JSON-LD read `persona` directly.
 *
 * Written to someone whose site is brand new or not public yet: a handful of
 * pages, no links, no history to plan from. The page's honest line is the
 * clock. Rankbox can research and write before launch, but it can't make
 * Google crawl, index or rank a new domain any sooner, and it doesn't report
 * rankings or AI citations, so the page says where those numbers live.
 *
 * Facts checked 2026-11-10. Every third-party number on the page is in
 * NEW_SITES.sources with its date; nothing else is quoted.
 */
import { Sprout } from "lucide-react";
import type { Persona } from "@/data/personas";
import { RANKBOX_PUBLISHING } from "@/data/competitors/shared";
import { PLAN, STUDIO, TRIAL_ARTICLE_CREDITS, TRIAL_TERMS, formatUsd } from "@/data/pricing";

/* How articles reach a site today, derived from which add-ons have shipped.
   The shared sentence calls the coming add-ons "one-click"; this page never
   does, so the word is dropped here (and is a no-op once plugins are live). */
const PUBLISHING = RANKBOX_PUBLISHING.sentence.replace("one-click ", "");

export const persona: Persona = {
  slug: "new-websites",
  name: "New websites",
  nameLower: "new websites",
  shortName: "New sites",
  role: "new site owner",
  group: "situation",
  icon: Sprout,
  tagline: "Launch with answers already written, not an empty blog.",

  eyebrow: "SEO and AI search for new websites",
  headline: { lead: "A new website,", accent: "not an empty one" },
  subhead:
    "A new domain starts with a few pages, no links and no history to plan from. Rankbox finds the questions buyers ask AI engines about your topic and writes sourced answers in the voice you set, before launch day. When Google indexes them is still up to Google.",
  metaTitle: "SEO for New Websites: Launch With Answers Ready | Rankbox",
  metaDescription:
    "A new website has no traffic, links or history. Rankbox researches what buyers ask AI, writes sourced answers in your voice before launch, and is plain about indexing time.",

  shortAnswer: `Rankbox for new websites is an AI content engine for sites with no traffic, no links and no publishing history yet. Before launch, it researches the questions buyers ask ChatGPT, Perplexity, Gemini and Google AI Overviews about your topic, writes source-backed articles in a brand voice you set, scores each one for SEO and GEO, and queues up to ${PLAN.articlesPerMonth} a month on your schedule. It can't make Google crawl or index a new site any faster, and it doesn't report rankings or AI citations; Google Search Console shows indexing and search performance.`,

  specs: [
    { value: `${PLAN.articlesPerMonth}/mo`, label: "articles on one site, from the first month" },
    { value: "2,000–3,500", label: "words in each article, with its sources cited" },
    { value: "SEO + GEO", label: "scores on every draft before it can ship" },
    { value: "Pre-launch", label: "set up a site that isn't public yet, by hand" },
  ],

  handoff: {
    runsTitle: "Rankbox runs from day one",
    runs: [
      {
        label: "Answer-space research",
        detail:
          "The questions buyers put to ChatGPT, Perplexity, Gemini and AI Overviews about your topic, found before you have search data of your own.",
      },
      {
        label: "Sourced drafts in your voice",
        detail:
          "Long-form articles of about 2,000 to 3,500 words, written to the tone, audience and product details you set, citing their sources.",
      },
      {
        label: "SEO and GEO scores",
        detail:
          "Each draft graded for search and for how ready it is to be quoted in an AI answer, before it can go out.",
      },
      {
        label: "A queue on your dates",
        detail: `Up to ${PLAN.articlesPerMonth} articles a month, written ahead and scheduled, ready for your site to pull through the API once it's live.`,
      },
    ],
    keepsTitle: "Stays yours",
    keeps: [
      {
        label: "The voice and the facts",
        detail:
          "There's no back catalogue to learn from, so you set the voice, and you check every claim about your own product.",
      },
      {
        label: "Launch-day setup",
        detail:
          "A developer connects the publishing API once. You verify the site in Search Console and submit the sitemap.",
      },
      {
        label: "Every publish",
        detail: "You review drafts in the editor and decide what goes live, and when.",
      },
      {
        label: "Measuring",
        detail:
          "Search Console and your analytics show indexing, clicks and AI referrals. Rankbox doesn't report rankings or citations.",
      },
    ],
  },

  painsTitle: "What a brand-new site starts with",
  painsIntro:
    "Not a strategy problem. A starting-from-zero one: no data to plan from, few pages to find, and nobody pointing at you yet.",
  pains: [
    {
      pain: "No search history to tell you what to write.",
      fix: "Research starts from your topic, not your analytics: the questions buyers already ask AI engines, grouped by what they're trying to do.",
    },
    {
      pain: "Launch day ships four pages and an empty blog.",
      fix: "The first articles are written, scored and edited before launch, so the site can open with answers on it.",
    },
    {
      pain: "No back catalogue to copy a voice from.",
      fix: "You set the voice per site, tone, audience and product details, and every draft is written to it from the first one.",
    },
    {
      pain: "Nobody links to, or talks about, a site nobody has seen.",
      fix: "Paid plans add a backlink-exchange allowance and Reddit reply drafts you post yourself. Both are rolling out, and neither promises a link or a mention.",
    },
  ],

  workflowTitle: "From the domain to month two",
  workflowIntro:
    "Google says crawling can take from a few days to a few weeks, and a recrawl request is no promise of inclusion. So the plan front-loads the part you control.",
  steps: [
    {
      when: "Setup",
      title: "Describe the site, set the voice",
      body: "Add the domain. If Rankbox can't read it yet, type the brand and what it does yourself, then set tone, audience and product details.",
    },
    {
      when: "Before launch",
      title: "Write the first answers",
      body: "Approve the research. Drafts arrive scored for SEO and GEO, and wait in the editor for your edit.",
    },
    {
      when: "Launch day",
      title: "Connect, publish, submit",
      body: "A developer connects the publishing API once, the first articles go live, and you submit the sitemap to Search Console and Bing.",
    },
    {
      when: "Weeks 1 to 4",
      title: "Keep the queue, watch Search Console",
      body: "New articles keep arriving on your dates while Google crawls. Search Console's page indexing report shows what's in.",
    },
  ],

  stackTitle: "What you don't have to hire before launch",
  stackIntro:
    "A new site's content plan is usually a strategist, a few freelancers and a tool for each step, paid for before the site earns anything.",
  stack: [
    { label: "Content strategist", detail: "Deciding what the first articles should answer" },
    { label: "Question research tool", detail: "Topic discovery for a market you're new to" },
    { label: "Freelance writers", detail: "Briefs, drafts and revisions for a launch backlog" },
    { label: "Brand voice guide", detail: "Written once so every article sounds like one company" },
    { label: "On-page SEO checker", detail: "Grading each draft before it goes live" },
  ],
  stackNote: `One plan is ${formatUsd(PLAN.monthly)} a month for one site and ${PLAN.articlesPerMonth} articles, with research, voice, scoring and the publishing API included. It doesn't replace the developer who connects the site, your analytics, or a technical audit.`,

  picksTitle: "The four parts a new site leans on",
  picksIntro: "The whole product runs either way. These matter most when the site has no history.",
  picks: [
    {
      featureSlug: "answer-space-research",
      why: "Turns a topic into a list of the questions buyers ask AI engines, when there's no search data of your own to plan from.",
    },
    {
      featureSlug: "brand-voice",
      why: "Set before the first draft, so article one and article thirty sound like the same company.",
    },
    {
      featureSlug: "seo-geo-score",
      why: "A bar every draft clears before it ships, aimed at being the page an AI answer can quote.",
    },
    {
      featureSlug: "authority-backlinks",
      why: "The exchange allowance on paid plans, still rolling out: links between member sites on related topics, and none without a topical match.",
    },
  ],

  proof: [],
  proofTitle: "New sites running Rankbox",

  faqs: [
    {
      q: "Can Rankbox get a new website indexed faster?",
      a: "No. Rankbox researches, writes and schedules articles; it can't make Google crawl or index a site any sooner. Google's own documentation says crawling can take anywhere from a few days to a few weeks, and that requesting a recrawl is no promise a page will be included at all. Submit a sitemap, check the page indexing report in Search Console, and give it time.",
    },
    {
      q: "Can I set it up before the site is live?",
      a: "Yes. Add the domain in onboarding. If Rankbox can't read the site yet, you type the brand name and what it does yourself, and add keywords by hand if the analysis comes back empty. Finished articles wait in Rankbox until your site is live and pulling them.",
    },
    {
      q: "How do articles reach a brand-new site?",
      a: `${PUBLISHING}. Once it's connected, your site pulls finished articles with their titles, slugs and meta when it builds or on a schedule, so articles written before launch can go out on launch day.`,
    },
    {
      q: "Will Rankbox tell me when I start ranking or getting cited?",
      a: "No. Rankbox doesn't track rankings, AI citations or AI mentions. Google counts clicks and impressions from AI Overviews and AI Mode in Search Console's Performance report, under the Web search type, and your analytics can show visits referred by AI assistants.",
    },
    {
      q: "How many articles should a new site launch with?",
      a: `There's no proven number, and we won't invent one. A sensible start is one article for each of the main questions in your topic, then a steady schedule after launch. The plan allows up to ${PLAN.articlesPerMonth} a month; the trial covers ${TRIAL_ARTICLE_CREDITS}.`,
    },
    {
      q: "Do the backlink and Reddit allowances work from day one?",
      a: `They open with your first paid invoice, not during the trial, and both are still rolling out. The exchange gives ${PLAN.backlinkCreditsPerMonth} credits a month and places a link only where a member site's article is on a related topic. Reddit gives ${PLAN.redditRepliesPerMonth} reply drafts a month, each saying who you are; you post them yourself, and Rankbox never posts.`,
    },
    {
      q: "What does it cost?",
      a: `${formatUsd(PLAN.monthly)} a month for one site, with ${PLAN.articlesPerMonth} articles, research, brand voice, scoring and publishing included. ${TRIAL_TERMS}`,
    },
    {
      q: "What won't Rankbox do for a new site?",
      a: "It doesn't build or host the site, run technical audits, fix how pages render, submit sitemaps, track rankings or citations, manage listings or reviews, or build links through outreach. Some launch-day checks are covered by free Rankbox tools that need no account: a sitemap generator, a robots.txt tester and an AI search readiness check.",
    },
  ],
  ctaTitle: "Open the site with answers on it",
  ctaBody:
    "Add the domain, live or not yet, and see the questions your first articles would answer.",

  hideFromNav: true,
};

/* ------------------------------------------------------------------ */
/* The rest of the page's words, beyond what the Persona type holds.   */
/* ------------------------------------------------------------------ */

export interface LaunchAnswer {
  title: string;
  /** The guide's URL path under /guides/. */
  slug: string;
  /** Written before launch, or scheduled for after it. */
  phase: "pre" | "post";
  /** Its date on the launch runway: days from launch day, negative before. */
  day: number;
  intent: string;
  seo: number;
  geo: number;
}

const ANSWERS: LaunchAnswer[] = [
  {
    title: "What herbs grow indoors without a sunny window?",
    slug: "herbs-without-a-sunny-window",
    phase: "pre",
    day: -9,
    intent: "How-to",
    seo: 94,
    geo: 91,
  },
  {
    title: "Do LED grow lights add much to the power bill?",
    slug: "led-grow-light-running-cost",
    phase: "pre",
    day: -7,
    intent: "Buying",
    seo: 92,
    geo: 93,
  },
  {
    title: "Countertop herb garden or pots on a sill?",
    slug: "countertop-garden-or-pots",
    phase: "pre",
    day: -5,
    intent: "Comparing",
    seo: 95,
    geo: 90,
  },
  {
    title: "Why is my indoor basil turning yellow?",
    slug: "indoor-basil-turning-yellow",
    phase: "pre",
    day: -2,
    intent: "Fixing",
    seo: 93,
    geo: 94,
  },
  {
    title: "Which herbs can share one planter?",
    slug: "herbs-that-share-a-planter",
    phase: "post",
    day: 4,
    intent: "How-to",
    seo: 91,
    geo: 92,
  },
  {
    title: "Can you regrow herbs from supermarket cuttings?",
    slug: "regrow-supermarket-herbs",
    phase: "post",
    day: 9,
    intent: "How-to",
    seo: 94,
    geo: 92,
  },
  {
    title: "Are smart garden pods worth it for a small kitchen?",
    slug: "smart-garden-pods-worth-it",
    phase: "post",
    day: 16,
    intent: "Buying",
    seo: 92,
    geo: 95,
  },
];

export const NEW_SITES = {
  /**
   * The hero's sample: a fictional indoor herb-garden kit brand on a
   * reserved .example domain (web-checked 2026-11-10, no company by that
   * name). Scores are sample numbers in a window labelled Sample.
   */
  sample: {
    brand: "Sprigwell",
    domain: "sprigwell.example",
    pages: [
      { path: "/", label: "Home" },
      { path: "/shop", label: "Shop" },
      { path: "/about", label: "About" },
      { path: "/contact", label: "Contact" },
    ],
    answers: ANSWERS,
  },

  /** The short-answer band's question. */
  shortAnswerTitle: "What is Rankbox for new websites?",

  /** Section titles the Persona type has no field for. */
  painsEyebrow: "Day zero",
  handoffEyebrow: "Who does what",
  handoffTitle: "What runs from day one, and what stays yours",
  handoffIntro:
    "Rankbox takes the research and the writing. The launch, the final word and the measuring stay with you, and some things run on nobody's schedule but the engines'.",
  picksEyebrow: "Features",
  stackEyebrow: "Launch budget",
  faqTitle: "Questions new site owners ask first",

  /** The two clocks under the workflow: yours and Google's. */
  clocks: {
    eyebrow: "Launch runway",
    ours: "Your clock",
    oursNote: "What you and Rankbox control",
    google: "Google's clock",
    googleBefore: "Nothing public to crawl yet",
    googleAfter: "Crawling can take anywhere from a few days to a few weeks.",
    googleSource: "Google Search Central, page updated 10 Dec 2025",
  },

  /** The third column of the handoff: what nobody can hurry. */
  limits: {
    title: "Nobody can rush",
    intro: "Not us, not an agency. These run on the engines' schedules, and the page says so.",
    items: [
      "Crawling and indexing a new domain",
      "Rankings, and when they move",
      "Whether an AI answer cites you",
    ],
    wontTitle: "And Rankbox doesn't",
    wont: [
      "Report rankings or AI citations",
      "Audit or fix the site's technical setup",
      "Build links through outreach",
      "Promise a result",
    ],
  },

  /** The two allowances that start a footprint off your own domain. */
  offsite: {
    eyebrow: "Off your own domain",
    title: "A footprint from a standing start",
    intro:
      "A new domain has no one pointing at it. Paid plans include two allowances for that. Both are still rolling out, and both are allowances, not results.",
    status: "Rolling out · paid plans",
    exchange: {
      name: "Backlink exchange",
      allowance: `${PLAN.backlinkCreditsPerMonth} credits a month`,
      body: "Member sites carry relevant links to one another's pages inside the articles Rankbox writes for them. Credits move only when a link is verified live, no link is ever returned directly, and with no topical match no link is placed.",
      sampleTarget: "/guides/herbs-without-a-sunny-window",
      sampleState: "Waiting for a member site on a related topic",
      href: "/docs/growth/backlink-exchange",
      cta: "How the exchange works",
    },
    reddit: {
      name: "Reddit reply drafts",
      allowance: `${PLAN.redditRepliesPerMonth} drafts a month`,
      body: "Rankbox finds threads on your topic and drafts a helpful reply that says who you are. You post it from your own account; Rankbox never posts and holds no Reddit login.",
      sampleThread: "Best herbs for a kitchen that gets no direct sun?",
      sampleReply:
        "Mint, parsley and chives cope with bright indirect light far better than basil or rosemary. Keep them within a metre or so of the window and turn the pots every few days.",
      sampleDisclosure: "Disclosure: I work on Sprigwell, an indoor herb kit.",
      href: "/features/reddit-presence",
      cta: "About Reddit presence",
    },
    evidence:
      "Why Reddit: Profound, an AI search analytics company, reported that Reddit was the most-cited domain across the answer engines it tracks from August 2024 to late October 2025, from over 4 billion citations. It's vendor data, published with Reddit.",
    evidenceSource: "Profound, 10 Nov 2025",
  },

  /** Free tools for the launch-day checks Rankbox itself doesn't run. */
  kit: {
    eyebrow: "Free launch-day checks",
    title: "Rankbox doesn't audit sites. These free tools help",
    intro:
      "The basics a new site needs before engines can read it, as free tools with no account and no sign-up. Run them once on launch day, and again after big changes.",
    tools: [
      { slug: "sitemap-generator", why: "Build the sitemap you submit on launch day." },
      { slug: "robots-txt-tester", why: "Check a staging rule isn't still blocking crawlers." },
      { slug: "ai-robots-txt-generator", why: "Decide which AI bots may read the site." },
      { slug: "llms-txt-generator", why: "Hand AI assistants a short map of the site." },
      { slug: "schema-generator", why: "Add structured data to the pages you launch with." },
      { slug: "ai-search-readiness-check", why: "Scan the live site for what AI engines need." },
    ],
    cta: "All free tools",
  },

  /** The price block beside the stack. */
  price: {
    eyebrow: "Price",
    title: "One site, one plan",
    amount: formatUsd(PLAN.monthly),
    per: "a month per site",
    includes: [
      `${PLAN.articlesPerMonth} articles a month, on your schedule`,
      "Answer-space research and a brand voice per site",
      "SEO and GEO scores on every draft",
      "The publishing API, for any site a developer can connect",
      `${PLAN.backlinkCreditsPerMonth} exchange credits and ${PLAN.redditRepliesPerMonth} Reddit drafts a month, rolling out, paid plans only`,
    ],
    trial: `The trial covers one site and ${TRIAL_ARTICLE_CREDITS} articles.`,
    studio: `Launching more than one site? Once the plan is paid, Studio adds each extra site for ${formatUsd(STUDIO.monthlyPerSite)} a month on the same invoice, with a full plan of its own.`,
    pricingCta: "See pricing",
  },

  /** The band linking the other pages in this group. */
  others: {
    eyebrow: "Other situations",
    title: "Not starting from zero?",
    cta: "All use cases",
  },

  /** Every third-party fact on the page, with its date. Checked 2026-11-10. */
  sourcesTitle: "Sources, checked 10 Nov 2026",
  sources: [
    {
      publisher: "Google Search Central",
      title: "Ask Google to recrawl your website",
      date: "updated 10 Dec 2025",
      url: "https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl",
    },
    {
      publisher: "Google Search Central",
      title: "AI features and your website",
      date: "updated 10 Dec 2025",
      url: "https://developers.google.com/search/docs/appearance/ai-features",
    },
    {
      publisher: "Profound",
      title: "The data on Reddit and AI search",
      date: "10 Nov 2025",
      url: "https://tryprofound.com/blog/the-data-on-reddit-and-ai-search",
    },
  ],

  /** Further reading on the site, all live posts. */
  reading: [
    {
      href: "/blog/bing-webmaster-tools-ai-indexing-guide",
      label: "Bing Webmaster Tools and AI indexing",
    },
    { href: "/blog/how-to-measure-geo", label: "How to measure GEO" },
    { href: "/blog/how-to-use-reddit-for-seo", label: "Using Reddit for SEO, by the rules" },
  ],
};
