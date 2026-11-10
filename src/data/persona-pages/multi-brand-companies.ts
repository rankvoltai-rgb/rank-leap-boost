/**
 * /use-cases/multi-brand-companies: the page's words and data.
 *
 * Written to the operator of a portfolio (a micro-SaaS portfolio, a consumer
 * brand group, a franchisor) who runs several brands, each on its own site.
 * The argument is reasoning from the product, not survey data: every brand
 * needs research and a voice of its own, an agency per brand doesn't scale,
 * and Studio's flat price per site fits a portfolio. No statistic appears on
 * the page because none was needed to make it.
 *
 * Product facts are from docs/account/studio.md and the pricing module
 * (checked 2026-11-10): one login and one invoice per account, a site's
 * allowance can't move to another site, the exchange never links two sites of
 * one owner, one standing Reddit reply per thread per owner, one API key per
 * site, removal runs to the period's end and archives the site. Gaps said
 * plainly: no seats for brand managers, no rank or citation tracking.
 *
 * Wrenmarch Group and its four brands (Duskmoth Candles, Ledgerkite, Barkloaf,
 * Slotfern) are invented, web-checked on 2026-11-10 with no business found by
 * those names, and shown only on .example domains.
 */
import { Shapes } from "lucide-react";
import type { Persona } from "@/data/personas";
import { PUBLISH_PLATFORMS } from "@/data/platforms";
import { PLAN, STUDIO, TRIAL_ARTICLE_CREDITS, TRIAL_DAYS, formatUsd } from "@/data/pricing";

const PER_SITE = formatUsd(STUDIO.monthlyPerSite);
const PLAN_PRICE = formatUsd(PLAN.monthly);

/* How a brand's articles reach its site, in the state publishing is actually
   in. Every platform add-on is still unlaunched, so today that is the REST
   API; the sentence widens the day an addonLive flag flips. */
const LIVE_APPS = PUBLISH_PLATFORMS.filter((p) => p.addonLive).map((p) => p.name);
const PUBLISHING =
  LIVE_APPS.length === 0
    ? "Through the Rankbox REST API today. Each brand site has its own key, which a developer wires into that site once. The Shopify and Webflow apps are built and waiting on store approval."
    : `Through the ${LIVE_APPS.join(" and ")} ${LIVE_APPS.length === 1 ? "app" : "apps"}, or through the Rankbox REST API, with a key of its own for each brand site.`;

export const persona: Persona = {
  slug: "multi-brand-companies",
  name: "Multi-brand companies",
  nameLower: "multi-brand companies",
  shortName: "Portfolios",
  role: "multi-brand company",
  group: "business",
  icon: Shapes,
  tagline: "Every brand its own research and voice, on one invoice.",

  eyebrow: "AI search content for multi-brand companies",
  headline: { lead: "A voice per brand", accent: "on one account" },
  subhead: `A house of brands can't run on one writer switching hats, or on an agency per brand. In Rankbox Studio, each brand site gets its own research, voice, content plan and publishing key, and the whole portfolio shares one login and one invoice at ${PER_SITE} a site a month.`,
  metaTitle: "Rankbox for Multi-Brand Companies: Every Brand, One Account",
  metaDescription: `Research, write and score AI search content for every brand you own from one Rankbox account: a voice and plan per site, one invoice, ${PER_SITE} a site a month.`,

  shortAnswer: `Rankbox is an AI search content engine that multi-brand companies (micro-SaaS portfolios, consumer brand groups, franchisors) run from one Studio account. Each brand site gets its own research into what its buyers ask ChatGPT, Perplexity, Gemini and Google AI Overviews, its own brand voice, up to ${PLAN.articlesPerMonth} source-backed articles a month with an SEO and a GEO score, and its own publishing key, at ${PER_SITE} a site a month on one invoice. It has no separate logins for brand managers and doesn't track rankings or AI citations; positioning and sign-off stay with the group.`,

  specs: [
    { value: PER_SITE, label: "a month for each brand you add, on the same invoice" },
    {
      value: `${PLAN.articlesPerMonth}/mo`,
      label: "articles per brand site, never pooled across brands",
    },
    { value: "Per site", label: "research, brand voice, content plan and API key" },
    { value: "No cap", label: "on how many brand sites one account can run" },
  ],

  handoff: {
    runsTitle: "Rankbox runs this, brand by brand",
    runs: [
      {
        label: "Research per brand",
        detail:
          "The questions each brand's buyers put to ChatGPT, Perplexity, Gemini and AI Overviews.",
      },
      {
        label: "Writing in that brand's voice",
        detail:
          "Source-backed articles of about 2,000 to 3,500 words, set by that site's audience, tone and house rules.",
      },
      {
        label: "One bar before anything ships",
        detail:
          "Every article gets an SEO score and a GEO score, the same standard for every brand.",
      },
      {
        label: "Each brand's own schedule",
        detail: `Up to ${PLAN.articlesPerMonth} articles a month per site, on the pace you set, through that site's own key.`,
      },
    ],
    keepsTitle: "The group keeps this",
    keeps: [
      {
        label: "Brand strategy",
        detail: "Positioning, and which brand owns which category, claim or customer.",
      },
      {
        label: "Sign-off",
        detail:
          "An account has one login today, so whoever holds it reviews and edits for every brand.",
      },
      {
        label: "Product truth",
        detail: "Prices, ingredients, specs and anything else a brand has to stand behind.",
      },
      {
        label: "Measurement",
        detail:
          "Rankings, AI citations and revenue live in Search Console and your analytics. Rankbox doesn't track them.",
      },
    ],
  },

  painsTitle: "Where a portfolio's content breaks",
  painsIntro:
    "Content works brand by brand, but most portfolios staff it as one job. The gaps show up in the smallest brands first.",
  pains: [
    {
      pain: "The flagship gets the content. The other brands get what's left.",
      fix: `Each brand site has its own plan and its own ${PLAN.articlesPerMonth} articles a month, so the smallest brand's schedule never waits on the biggest.`,
    },
    {
      pain: "One writer across four categories makes four brands sound like one.",
      fix: "Voice is set per site, from its audience, tone and house rules, so the candle brand never borrows the invoicing app's sentences.",
    },
    {
      pain: "An agency per brand means four briefs, four retainers and four invoices.",
      fix: `One login and one invoice, at ${PER_SITE} a month for each brand you add, with every brand's articles in one dashboard.`,
    },
    {
      pain: "A newly acquired brand starts its content from zero.",
      fix: "Add it as a site in Studio. Rankbox reads the site, proposes the searches to target and a first month of articles, and you approve them before it's added.",
    },
  ],

  workflowTitle: "From the first brand to the whole portfolio",
  workflowIntro:
    "The trial covers one site. Start with one brand, get its voice right, and add the others once the plan is paid.",
  steps: [
    {
      when: "Trial, day 1",
      title: "Set up your first brand",
      body: "Paste one brand's site. Rankbox reads it, finds the searches worth targeting and drafts a first month of articles for you to approve.",
    },
    {
      when: "Trial week",
      title: "Tune its voice",
      body: `Set its audience, tone and house rules, then edit drafts until they sound like that brand. The trial includes up to ${TRIAL_ARTICLE_CREDITS} articles.`,
    },
    {
      when: "First paid month",
      title: "Add the next brands in Studio",
      body: `Each one runs the same setup and costs ${PER_SITE} a month: its share of the current period when you add it, then on the same invoice.`,
    },
    {
      when: "Every month",
      title: "Each brand on its own schedule",
      body: "Switch brands from the sidebar. The address bar keeps the brand you're on, so two tabs can hold two brands side by side.",
    },
  ],

  stackTitle: "What a portfolio stops buying once per brand",
  stackIntro:
    "Content costs multiply with the number of brands. These are the lines that usually get bought again for every one.",
  stack: [
    {
      label: "An agency retainer per brand",
      detail: "Briefs, drafts and a monthly call, repeated for each brand",
    },
    {
      label: "Freelance writers per category",
      detail: "A different specialist for candles, invoicing and dog treats",
    },
    {
      label: "AI writing workspaces per brand",
      detail: "Kept apart so one brand's prompts and details never leak into another's",
    },
    {
      label: "Question research per brand",
      detail: "Topic discovery and AI-answer research, redone for each site",
    },
    {
      label: "A pre-publish checker",
      detail: "Grading each brand's drafts by hand against a checklist",
    },
  ],
  stackNote: `Rankbox is one Business plan at ${PLAN_PRICE} a month for your first brand, plus ${PER_SITE} a month for each brand you add in Studio. Which lines you cut is your call. Rank tracking, analytics and anything that needs a login per brand manager stay where they are.`,

  picksTitle: "The parts a portfolio leans on",
  picksIntro:
    "The whole engine runs for every site. These four keep the brands apart and the standard the same.",
  picks: [
    {
      featureSlug: "brand-voice",
      why: "Set per site, so four brands get four voices and none of them drifts toward the others.",
    },
    {
      featureSlug: "answer-space-research",
      why: "Run per brand, because a candle buyer and an invoicing buyer don't ask AI engines the same things.",
    },
    {
      featureSlug: "seo-geo-score",
      why: "One scoring bar across the portfolio, so the smallest brand ships to the flagship's standard.",
    },
    {
      featureSlug: "citation-ready-writer",
      why: "Source-backed long-form for categories where claims get checked: ingredients, fees, safety, how-tos.",
    },
  ],

  topics: {
    title: "Four brands, four sets of questions",
    intro:
      "A portfolio doesn't share an answer space. Each brand's buyers ask about different things, so each site gets research of its own.",
    brand: "Wrenmarch Group",
    domain: "wrenmarch.example",
    clusters: [
      {
        stage: "Duskmoth Candles",
        intent: "Home fragrance",
        questions: [
          "How long should you burn a candle the first time?",
          "Soy vs beeswax candles: which burns cleaner?",
          "Why does a candle tunnel, and can you fix it?",
        ],
      },
      {
        stage: "Ledgerkite",
        intent: "Invoicing app",
        questions: [
          "How do you invoice a client in another currency?",
          "What should a freelance invoice include?",
          "Net 30 or due on receipt: which should a freelancer use?",
        ],
      },
      {
        stage: "Barkloaf",
        intent: "Dog treats",
        questions: [
          "How many treats a day is too many for a dog?",
          "Are grain-free treats better for dogs?",
          "Which treats are safe for a puppy?",
        ],
      },
      {
        stage: "Slotfern",
        intent: "Salon booking app",
        questions: [
          "How do salons cut down on no-shows?",
          "Should a salon take deposits for bookings?",
          "How should a salon handle last-minute cancellations?",
        ],
      },
    ],
    note: "A sample map for Wrenmarch Group, a fictional company, and its four fictional brands; the .example domains aren't real sites. Yours is built from each brand's own site, and you approve each plan before anything is written.",
    platformsTitle: "Each brand publishes where its site lives",
    platforms: [
      {
        slug: "api",
        why: "Works today. Each brand site has its own revocable key, so one site never pulls another brand's articles.",
      },
      {
        slug: "shopify",
        why: "For the store brands. The app is built and waiting on store approval; until then, the API.",
      },
      {
        slug: "webflow",
        why: "For the marketing sites. The app is built and waiting on Marketplace approval; until then, the API.",
      },
    ],
  },

  proof: [],
  proofTitle: "Multi-brand companies running every brand from one account",

  faqs: [
    {
      q: "Does each brand get its own voice and research?",
      a: "Yes. Each site in Studio has its own brand details, audience, tone, house rules, research and content plan. Brands share the login and the invoice, nothing else.",
    },
    {
      q: "Can each brand manager have their own login?",
      a: "Not yet. An account has one login today and no team seats, so whoever holds it reviews and edits for every brand. If each brand manager needs a sign-in of their own, weigh that gap before you move a portfolio over.",
    },
    {
      q: "How is a portfolio billed?",
      a: `Your first brand is the Business plan at ${PLAN_PRICE} a month. Each brand you add in Studio is ${PER_SITE} a month with the full plan of its own, including ${PLAN.articlesPerMonth} articles a month that can't be moved to another site. Every site is on the same invoice and renews on the same date, and adding one charges its share of the current period straight away.`,
    },
    {
      q: "Can we try it on every brand first?",
      a: `The ${TRIAL_DAYS}-day free trial covers one site with up to ${TRIAL_ARTICLE_CREDITS} articles, and a card is required. Studio opens with your first paid invoice. To add brands sooner, start the paid plan early from the Studio page.`,
    },
    {
      q: "Will Rankbox link our brands to each other?",
      a: "No. The backlink exchange, a plan allowance that's still rolling out, never trades links between sites you own and never puts links to two of your sites in one article, because links among your own brands would look like a private link network. Reddit reply drafts work the same way: one standing reply per thread across all your brands, and you post it yourself.",
    },
    {
      q: "How do articles reach each brand's site?",
      a: PUBLISHING,
    },
    {
      q: "What happens when we sell or close a brand?",
      a: "Remove its site from Studio. It runs to the end of the period you've paid for, then it's archived with its articles, keywords and settings kept, and everything already published stays on its website. The current period isn't refunded, and restoring the site later is charged like adding a new one.",
    },
    {
      q: "Does it report rankings or AI citations per brand?",
      a: "No. Rankbox researches, writes, scores and publishes. It doesn't track rankings, AI citations or mentions, run technical audits, or manage listings and reviews. Each brand's results stay in Search Console and your analytics.",
    },
  ],
  ctaTitle: "Start with one brand. Add the rest when it sounds right.",
  ctaBody:
    "Set up your first brand on the trial, then bring the rest of the portfolio into Studio once the plan is paid.",

  hideFromNav: true,
};

/**
 * The rest of the page's words: the hero's call to action, the sample
 * account in the hero window, the rules that keep brands apart, what isn't
 * in the box, and the price block's labels. Kept here with the persona so
 * every visitor-facing line lives in one file. The same no-outcomes and
 * our-price-only rules apply, though personas.test.ts reads only `persona`.
 */
export const multiBrand = {
  cta: {
    label: "Start with your first brand",
    field: "Your first brand's website",
    trialLine: "The trial covers one site. Studio opens with your first paid invoice.",
    secondary: "Price a portfolio",
  },

  /** The hero window: one account, four brand sites. A sample, labelled so. */
  account: {
    name: "Wrenmarch Group",
    caption:
      "Sample: one Rankbox account switching between four fictional brand sites, each with its own audience, tone, house rules and articles this cycle.",
    brands: [
      {
        name: "Duskmoth Candles",
        domain: "duskmoth.example",
        category: "Home fragrance",
        audience: "Gift buyers and candle regulars",
        tone: "Warm, sensory",
        style: "Short how-tos, one ritual at a time",
        rule: "Say “burn time”, never “lifespan”.",
        line: "Give the first burn three hours. The wax remembers it for the rest of the candle's life.",
        published: 14,
        articles: [
          "How long should you burn a candle the first time?",
          "Soy vs beeswax candles: which burns cleaner?",
          "Why does a candle tunnel, and can you fix it?",
        ],
      },
      {
        name: "Ledgerkite",
        domain: "ledgerkite.example",
        category: "Invoicing app",
        audience: "Freelancers who bill abroad",
        tone: "Precise, plain",
        style: "Step by step, with a worked example",
        rule: "Name the fee before the feature.",
        line: "Invoice in the client's currency and state the exchange date. It settles most disputes before they start.",
        published: 21,
        articles: [
          "How do you invoice a client in another currency?",
          "What should a freelance invoice include?",
          "Net 30 or due on receipt: which should a freelancer use?",
        ],
      },
      {
        name: "Barkloaf",
        domain: "barkloaf.example",
        category: "Dog treats",
        audience: "First-time dog owners",
        tone: "Playful, careful",
        style: "Plain Q&A, the answer up top",
        rule: "Health claims point to a vet source.",
        line: "Treats are a tenth of the day's food, tops. The rest of the bowl is doing the real work.",
        published: 9,
        articles: [
          "How many treats a day is too many for a dog?",
          "Which treats are safe for a puppy?",
          "Are grain-free treats better for dogs?",
        ],
      },
      {
        name: "Slotfern",
        domain: "slotfern.example",
        category: "Salon booking app",
        audience: "Salon owners with a small team",
        tone: "Friendly, practical",
        style: "Checklists an owner can use today",
        rule: "Write for the owner, not the client.",
        line: "A small deposit at booking changes who turns up. Set it once and stop chasing empty chairs.",
        published: 17,
        articles: [
          "How do salons cut down on no-shows?",
          "Should a salon take deposits for bookings?",
          "How should a salon handle last-minute cancellations?",
        ],
      },
    ],
  },

  guardrails: {
    eyebrow: "Kept apart on purpose",
    title: "Rules that keep brands apart",
    intro:
      "Running brands from one account is convenient. A few rules stop that convenience from blurring them together, or from looking like one owner gaming the web.",
    rules: [
      {
        title: "Allowances stay with their site",
        body: `Each brand site's ${PLAN.articlesPerMonth} articles a month are its own. A quiet brand's unused articles never top up a busy one.`,
      },
      {
        title: "No links between your own brands",
        body: "The backlink exchange, rolling out as a plan allowance, never trades links between sites you own, so the portfolio never reads as a private link network.",
      },
      {
        title: "One Reddit reply per thread",
        body: "Reply drafts, also rolling out, allow one standing reply per thread across all your brands, and you post it yourself.",
      },
      {
        title: "One key per site",
        body: "Each brand's REST API key fetches only that site's finished articles. Revoke one and the other brands keep publishing.",
      },
    ],
  },

  limits: {
    title: "Not in the box",
    items: [
      "Separate logins for brand managers",
      "Rank, citation or AI-mention tracking",
      "Technical audits, listings or reviews",
      "Branded reports per brand",
      "Promised results of any kind",
    ],
    elsewhere: "Running brands for clients instead?",
    links: [
      { label: "SEO agencies", href: "/use-cases/seo-agencies" },
      { label: "Web design studios", href: "/use-cases/web-design-studios" },
    ],
  },

  price: {
    eyebrow: "The portfolio, priced",
    title: "One price per brand site",
    intro:
      "No tiers to outgrow and no seats to count: the first brand is the plan, and every brand after it is the same price again.",
    counter: "Brands in the portfolio",
    first: "Business plan, your first brand",
    extra: "Studio sites",
    total: "Monthly total, one invoice",
    allowance: "Articles a month across the portfolio",
    note: "Extra brands are added on the paid plan. Each one's first charge is its share of the current period.",
    links: [
      { label: "See pricing", href: "/pricing" },
      { label: "How Studio works", href: "/docs/account/studio" },
    ],
  },

  inShortTitle: "What is Rankbox for multi-brand companies?",
  handoffTitle: "Rankbox runs each brand's content. The group runs the brands.",
  faqTitle: "Before the portfolio moves over",
  faqLead: "What portfolio operators ask before putting their brands on one account.",
} as const;
