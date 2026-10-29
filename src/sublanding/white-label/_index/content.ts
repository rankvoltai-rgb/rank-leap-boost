/**
 * Every word on /white-label, the white-label program hub. Prices, the trial
 * and what ships come from _shared/facts and src/data, so a change there
 * updates this page; nothing here types a price or a trial length.
 *
 * "White-label" promises only what ships: the work carries the client's
 * brand, Rankbox never deals with the agency's clients, and the clients never
 * get access to Rankbox. The agency sells its own service and the content.
 * Client logins, branded reports, a custom dashboard domain and citation
 * tracking don't exist, and the page says so (SHIPPED, addonLive).
 */
import {
  PLAN,
  PRICE,
  PRICE_MONTHLY,
  SHIPPED,
  STUDIO,
  TRIAL,
  TRIAL_TERMS,
  formatUsd,
} from "@/sublanding/_shared/facts";
import { PUBLISH_PLATFORMS } from "@/data/platforms";
import { listNames } from "@/data/competitors/shared";

export const PATH = "/white-label";
export const NAME = "White-label";
export const CHECKED_ON = "2026-10-29";

/** The per-site price, formatted from STUDIO, never typed. */
export const SITE_PRICE = formatUsd(STUDIO.monthlyPerSite);

const N = PLAN.articlesPerMonth;

/** The two CMS apps that are built and waiting on store approval, while they wait. */
export const APPS_AWAITING = PUBLISH_PLATFORMS.filter(
  (p) => (p.id === "shopify" || p.id === "webflow") && !p.addonLive,
).map((p) => p.name);

/* ------------------------------------------------------------------ */
/* Meta and outline                                                    */
/* ------------------------------------------------------------------ */

export const META = {
  query: "white label seo platform",
  title: "White-Label SEO Platform for Agencies | Rankbox Studio",
  description: `Run every client's SEO content from one account: research, articles and publishing under the client's name, never ours. Each client site is ${SITE_PRICE} a month.`,
  h1: "The white-label SEO platform for agencies that sell content",
  keywords: [
    "white label seo platform",
    "white label seo software",
    "white label content platform",
    "white label seo for agencies",
    "agency seo content platform",
  ],
};

/** Each section's H2 as rendered, and its short name in the "on this page" list. */
export const OUTLINE = [
  { id: "fit", h2: "Who this white-label setup is built for", nav: "Who it's for" },
  { id: "split", h2: "What you sell, and what Rankbox does behind it", nav: "Who does what" },
  {
    id: "journey",
    h2: "Your client's side of the work, start to finish",
    nav: "Your client's side",
  },
  { id: "studio", h2: "One account, one site per client", nav: "Running many clients" },
  { id: "onboarding", h2: "Adding a new client, step by step", nav: "Adding a client" },
  { id: "control", h2: "The controls you keep on every client site", nav: "Quality and control" },
  { id: "gaps", h2: "What isn't white-label yet", nav: "Not included yet" },
  { id: "billing", h2: "Billing for client sites, in brief", nav: "Billing" },
  { id: "deep-dives", h2: "Three deep dives for agencies", nav: "Deep dives" },
  { id: "faq", h2: "Questions agencies ask before the first client", nav: "Questions" },
  { id: "start", h2: "Start with your own site, then add a client", nav: "Get started" },
] as const;

export type SectionId = (typeof OUTLINE)[number]["id"];

export function h2(id: SectionId): string {
  return OUTLINE.find((s) => s.id === id)!.h2;
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

export const CTA = {
  label: "Start your Studio",
  /** Under a call to action. The trial is named from facts.ts. */
  note: `${TRIAL}, card required. It covers your own site; client sites open in Studio once the plan is paid.`,
};

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export const HERO = {
  crumbs: { home: "Home", here: NAME },
  eyebrow: "White-label program",
  sub: "Rankbox researches, writes and delivers the articles for every client from one account. They go out on the client's own site under the client's name, you send the invoice, and Rankbox never deals with your clients.",
  gapsLink: "Read what isn't white-label yet",
};

/** The plain-text answer under the hero, written to be quoted whole. */
export const ANSWER = {
  label: "In short",
  body: `Rankbox is a white-label SEO platform for the content side of client work. An agency runs one account with a separate site for each client, and each site gets its own research, brand voice, content plan and ${N} articles a month. Articles publish to the client's own site under the client's name, with no Rankbox badge, link or credit, and Rankbox never contacts your clients. Your plan, ${PRICE_MONTHLY}, covers your first site; every client site after it is ${SITE_PRICE} a month on the same invoice.`,
  scope:
    "It doesn't do technical audits, local listings, outreach link building, client logins or branded reports.",
  tocLabel: "On this page",
};

/** The hero's picture: your Studio behind, the client's live post in front. */
export const BYLINE = {
  studio: "Studio",
  yourSide: "What you see",
  theirSide: "What their readers see",
  live: "Live",
  listLabel: "Client sites in Studio",
  byPrefix: "By the",
  bySuffix: "team",
  readTime: "6 min read",
  checks: { byline: "Byline", livesOn: "Lives on", mentions: "Rankbox mentions", none: "0" },
  caption: "Illustration. Client names are examples.",
  clients: [
    {
      name: "Sablewood Dental",
      domain: "sablewooddental.example",
      initial: "S",
      tone: "teal",
      section: "Patient guides",
      post: "Is teeth whitening safe if your teeth are sensitive?",
    },
    {
      name: "Driftmoor Coffee",
      domain: "driftmoorcoffee.example",
      initial: "D",
      tone: "amber",
      section: "Brew notes",
      post: "How long do whole coffee beans stay fresh after roasting?",
    },
    {
      name: "Mossbark BBQ",
      domain: "mossbarkbbq.example",
      initial: "M",
      tone: "slate",
      section: "Catering",
      post: "How much barbecue to order for 50 guests",
    },
  ],
} as const;

export type ClientTone = (typeof BYLINE.clients)[number]["tone"];

/* ------------------------------------------------------------------ */
/* Who it's for                                                        */
/* ------------------------------------------------------------------ */

export const FIT = {
  kicker: "Who it's for",
  intro:
    "Anyone who delivers content to more than one site and wants each one to read as its owner's own. The setup is the same in every case: one Rankbox account, one site per client, one invoice.",
  sellsLabel: "What you sell",
  fitsLabel: "Where Rankbox sits",
  teams: [
    {
      who: "SEO agencies",
      sells: "Content as a line in each SEO retainer.",
      fits: "The research and articles for every client, so the content line no longer depends on a writer pool.",
    },
    {
      who: "Web design studios",
      sells: "Monthly care plans for the sites you built.",
      fits: "A steady stream of articles on those sites. You usually hold the CMS access already, so connecting publishing is in your hands.",
    },
    {
      who: "Freelance marketers",
      sells: "Your time, across a handful of clients.",
      fits: "The same setup for each client, one login and one bill, so adding a client doesn't add a new tool.",
    },
    {
      who: "In-house teams with several brands",
      sells: "Content for each brand or regional site you run.",
      fits: "A separate voice, plan and publishing key per brand, paid for together.",
    },
  ],
  notFit: {
    title: "Not the right tool if you need",
    items: [
      "Technical audits or site fixes",
      "Local listings and Google Business Profile work",
      "Outreach link building",
      "A client login or a dashboard with your logo",
      "Reports on AI citations or rankings",
    ],
    note: "Keep the tools or partners you already use for these. Rankbox covers research, articles and delivery.",
  },
};

/* ------------------------------------------------------------------ */
/* What you sell vs what Rankbox does                                  */
/* ------------------------------------------------------------------ */

export const SPLIT = {
  kicker: "The split",
  intro:
    "Your client buys a service from your agency. Rankbox is how part of that service gets made. Here is who does what at each stage.",
  yoursLabel: "Your agency, in front of the client",
  oursLabel: "Rankbox, out of sight",
  seam: "Your client deals only with the left column.",
  rows: [
    {
      stage: "Relationship",
      yours: "The pitch, the scope, the contract and every call.",
      ours: "Never emails, calls or bills your clients.",
    },
    {
      stage: "Strategy",
      yours: "What each client is trying to win, and which searches to go after.",
      ours: "Reads the client's site, finds the searches worth winning and plans the first month.",
    },
    {
      stage: "Writing",
      yours: "The voice and house rules for each client.",
      ours: "Researches each topic and drafts a long, cited article in that client's voice.",
    },
    {
      stage: "Quality",
      yours: "Reads, edits and decides what goes out.",
      ours: "Scores every draft on 11 checks and revises it before it's finished.",
    },
    {
      stage: "Delivery",
      yours: "Connects the client's site once, or has their developer do it.",
      ours: "Hands each finished article to that site through the publishing API.",
    },
    {
      stage: "Reporting",
      yours: "The report, in your format, with the live links.",
      ours: "Lists every article for each site, with its live address once the site reports it. No client report.",
    },
    {
      stage: "Billing",
      yours: "Invoices the client at a price you set.",
      ours: "Bills you alone: one subscription, one invoice and one card for every site.",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* The client's journey                                                */
/* ------------------------------------------------------------------ */

export type Visibility = "hidden" | "settings";

export const JOURNEY = {
  kicker: "Their side",
  intro:
    "Six moments where your client, their developer or their readers touch the work. At each one, here is what they see and whether the Rankbox name is anywhere in view.",
  whoLabel: "Who",
  seesLabel: "What they see",
  badge: { hidden: "Rankbox not visible", settings: "Visible in their settings" },
  /** "{visible} of {total}" is filled in from the steps below. */
  countLead: "Where the Rankbox name can show up:",
  countOf: "of",
  countTail: "touchpoints, and only to whoever opens the site's integration settings.",
  steps: [
    {
      title: "Kickoff",
      who: "You and the client",
      sees: "Your proposal, your agency's name and your price.",
      visibility: "hidden",
    },
    {
      title: "Publishing setup, once",
      who: "Their developer, or you",
      sees: `An API key and the rankbox.xyz address in the site's code or settings, or a CMS app named Rankbox once the ${listNames(APPS_AWAITING) || "CMS"} apps are approved.`,
      visibility: "settings",
    },
    {
      title: "New articles arrive",
      who: "The client",
      sees: "Posts on their own blog, in their templates, at their URLs. Held as drafts if you agreed a sign-off step.",
      visibility: "hidden",
    },
    {
      title: "A reader opens one",
      who: "Their customers",
      sees: "The client's name and design. No badge, link or credit in the article or in its structured data.",
      visibility: "hidden",
    },
    {
      title: "Month end",
      who: "You and the client",
      sees: "Your report, built your way, with the live link to every article.",
      visibility: "hidden",
    },
    {
      title: "If they leave",
      who: "You",
      sees: "Every article already published stays on their site. You remove the site from Studio.",
      visibility: "hidden",
    },
  ] satisfies { title: string; who: string; sees: string; visibility: Visibility }[],
};

/* ------------------------------------------------------------------ */
/* One account, one site per client                                    */
/* ------------------------------------------------------------------ */

export interface SampleSite {
  id: string;
  name: string;
  domain: string;
  initial: string;
  tone: ClientTone | "blue";
  /** The `?site=` value in the address bar; null for the plan's own site. */
  param: string | null;
  role: string;
  voice: { tone: string; audience: string; rule: string };
  autopilot: string;
  published: number;
  queued: number;
  backlinksLeft: number;
  redditLeft: number;
  keyEnding: string;
}

export const MODEL = {
  kicker: "The operating model",
  intro:
    "Studio is the same Rankbox account with more sites in it. The site switcher at the foot of the sidebar moves you between clients, and the rest of the dashboard shows one site at a time.",
  frameLabel: "Illustration of the Rankbox dashboard with four sites",
  host: "rankbox.xyz",
  path: "/dashboard/settings",
  switcherLabel: "Your sites",
  addSite: "Add a site",
  perMonth: "/mo",
  panelLabel: "This site's own",
  fields: {
    voice: "Voice",
    autopilot: "Autopilot",
    cycle: "This cycle",
    published: "published",
    queued: "queued",
    credits: "Credits left",
    articles: "articles",
    backlinks: "backlinks",
    reddit: "Reddit replies",
    publishing: "Publishing",
    key: "REST API key ending",
  },
  accountLabel: "Account-wide",
  account: ["One login", "Studio", "Plan & Billing", "Account settings"],
  hint: "Pick a site to see what changes and what stays.",
  sites: [
    {
      id: "brindlework",
      name: "Brindlework",
      domain: "brindlework.example",
      initial: "B",
      tone: "blue",
      param: null,
      role: "Your agency · covered by the plan",
      voice: {
        tone: "Confident",
        audience: "Small business owners",
        rule: "Call them clients, never customers.",
      },
      autopilot: "On · 2 a week",
      published: 6,
      queued: 3,
      backlinksLeft: 24,
      redditLeft: 30,
      keyEnding: "4c1e",
    },
    {
      id: "sablewood",
      name: "Sablewood Dental",
      domain: "sablewooddental.example",
      initial: "S",
      tone: "teal",
      param: "3f9a2c71",
      role: "Studio site",
      voice: {
        tone: "Friendly",
        audience: "Adults choosing a dentist",
        rule: "Never offer a diagnosis.",
      },
      autopilot: "On · 3 a week",
      published: 11,
      queued: 2,
      backlinksLeft: 19,
      redditLeft: 27,
      keyEnding: "a07d",
    },
    {
      id: "driftmoor",
      name: "Driftmoor Coffee",
      domain: "driftmoorcoffee.example",
      initial: "D",
      tone: "amber",
      param: "b82e5d10",
      role: "Studio site",
      voice: { tone: "Conversational", audience: "Home brewers", rule: "Use UK spelling." },
      autopilot: "On · 5 a week",
      published: 17,
      queued: 4,
      backlinksLeft: 30,
      redditLeft: 22,
      keyEnding: "e91b",
    },
    {
      id: "mossbark",
      name: "Mossbark BBQ",
      domain: "mossbarkbbq.example",
      initial: "M",
      tone: "slate",
      param: "60c4f3e8",
      role: "Studio site",
      voice: {
        tone: "Playful",
        audience: "Event planners",
        rule: "Quote prices only from the catering menu.",
      },
      autopilot: "Paused",
      published: 4,
      queued: 0,
      backlinksLeft: 30,
      redditLeft: 30,
      keyEnding: "5f27",
    },
  ] satisfies SampleSite[],
  caption: "Illustration. Site names, ids and numbers are examples.",
  perSiteTitle: "Each site has its own",
  perSite: [
    "Brand, writing settings and content plan",
    "Autopilot pace, on or paused",
    `Credits: ${N} articles, ${PLAN.backlinkCreditsPerMonth} backlink credits and ${PLAN.redditRepliesPerMonth} Reddit reply credits a month`,
    "Publishing connections and REST API keys",
  ],
  sharedTitle: "Shared across the account",
  shared: ["One login and one subscription", "Studio, Plan & Billing and the Account settings"],
  rulesTitle: "Rules that follow you, not the site",
  rules: [
    "Credits never move between sites, so a quiet client's unused articles can't be spent on a busy one.",
    "Your sites never trade backlinks with each other in the exchange, so your book of clients can't turn into a private link network.",
    "One standing Reddit reply per thread across all your sites, so one account never answers the same thread for two brands.",
  ],
  addressNote:
    "The site you're on is carried in the address bar, so two browser tabs can hold two clients and a bookmark always opens the right one.",
};

/* ------------------------------------------------------------------ */
/* Onboarding runbook                                                  */
/* ------------------------------------------------------------------ */

export type Owner = "you" | "rankbox" | "developer" | "client";

export interface RunStep {
  title: string;
  body: string;
  owners: Owner[];
  /** The button or page name as the dashboard shows it. */
  ui?: string;
}

export const RUNBOOK = {
  kicker: "Runbook",
  intro:
    "The same steps for every client, with the button names as the dashboard shows them and who does each one. Copy it into the project tool you already use.",
  owners: { you: "You", rankbox: "Rankbox", developer: "Their developer", client: "The client" },
  once: {
    title: "Once, for your agency",
    steps: [
      {
        title: "Set up your own site and start the trial",
        body: `Sign up and go through the four onboarding steps with your agency's own site: brand, keywords, content plan, then a card to start the ${TRIAL}. This first site is the one your plan covers.`,
        owners: ["you"],
      },
      {
        title: "Start the paid plan to open Studio",
        body: `The trial covers one site. In Studio, start the paid plan: the trial ends, ${PRICE} is charged for your first month, and Studio opens. If the charge doesn't go through, nothing changes.`,
        owners: ["you"],
        ui: "Start paid plan now",
      },
    ] satisfies RunStep[],
  },
  each: {
    title: "For each new client",
    steps: [
      {
        title: "Add the site",
        body: "Open Studio, or the site switcher, and add a site. Enter the client's address. Rankbox reads the site and fills in the brand name, description and logo; correct anything that's off.",
        owners: ["you", "rankbox"],
        ui: "Add a site",
      },
      {
        title: "Pick the searches to win",
        body: "Review the keywords Rankbox found for the client and keep the ones that match the strategy you sold them.",
        owners: ["you"],
        ui: "Pick the searches to win",
      },
      {
        title: "Check the first month of content",
        body: "Read through the planned articles and change any that miss, then move on to the price.",
        owners: ["you"],
        ui: "Review & add site",
      },
      {
        title: "Confirm the price",
        body: `The dialog shows what's due today (the site's share of your current billing period), then ${SITE_PRICE} a month, and your new monthly total. Nothing is created unless the charge goes through.`,
        owners: ["you"],
        ui: "Add site",
      },
      {
        title: "Set the client's voice",
        body: "Switch to the new site and open its settings: audience, tone, writing style and house rules. The preview shows exactly what the writer will read.",
        owners: ["you"],
        ui: "Settings",
      },
      {
        title: "Connect their publishing",
        body: "With the client's site open, create its API key. Their developer wires the REST API into the site once, or you do, if you built it.",
        owners: ["you", "developer"],
        ui: "Create key",
      },
      {
        title: "Agree the sign-off rule and the pace",
        body: `Decide with the client whether new articles go live straight away or wait as drafts at their end, then set the site's autopilot schedule, up to ${N} articles a month.`,
        owners: ["you", "client"],
        ui: "Write automatically",
      },
    ] satisfies RunStep[],
  },
  copy: {
    idle: "Copy as a checklist",
    done: "Copied",
    failed: "Couldn't copy. Select the steps and copy them instead.",
    heading: "White-label client onboarding (Rankbox Studio)",
    uiPrefix: "Button:",
  },
  guide: "Every screen and charge is in the Studio guide",
};

/* ------------------------------------------------------------------ */
/* Quality and control                                                 */
/* ------------------------------------------------------------------ */

export const CONTROL = {
  kicker: "Control",
  intro:
    "Rankbox does the production. These are the levers that stay in your hands for every client, set one site at a time.",
  levers: [
    {
      title: "Voice, per client",
      body: "Audience, tone, writing style and house rules live on each site. The writer reads them before every article.",
    },
    {
      title: "What gets written",
      body: "You choose the searches to target and can change the content plan whenever the client's priorities move.",
    },
    {
      title: "The editor",
      body: "Open any article to edit the text, rewrite a passage, or change the title and meta description, before or after it's finished.",
    },
    {
      title: "A score on every article",
      body: "Eleven checks on keyword use, length, structure, FAQ, meta description, links and readability. New drafts are revised against them.",
    },
    {
      title: "Sign-off at the client's end",
      body: "There's no approve step inside Rankbox: finished means ready to publish. To hold articles for a client's sign-off, keep them as drafts at the destination.",
    },
    {
      title: "Pace and pause",
      body: `Each site runs on its own schedule, up to ${N} articles a month, and autopilot can be paused whenever a client needs a break.`,
    },
  ],
  duty: {
    title: "Review stays with you",
    body: "Rankbox's Terms make the account holder responsible for reviewing and fact-checking content before it's published, and say plainly that no ranking, traffic or citation result is guaranteed. Google's guidance on generative AI content asks the same of every publisher:",
    quote: "manually factcheck and review all AI-generated content",
    source: "Google Search Central, page updated 2026-10-01",
    terms: "Read the Terms",
  },
  deeper: "The full production line, article by article, is in the content writing deep dive",
};

/* ------------------------------------------------------------------ */
/* What isn't white-label yet                                          */
/* ------------------------------------------------------------------ */

export interface Gap {
  missing: string;
  instead: string;
  link?: { href: string; label: string };
}

const gaps: (Gap | false)[] = [
  !SHIPPED.teamInvites && {
    missing: "Client logins and teammate seats",
    instead:
      "An account has one login. Send clients the live links instead: each site's Articles page lists every published article.",
  },
  {
    missing: "Branded reports or a dashboard on your domain",
    instead:
      "Report in the tool you already use. The publishing API returns each article's score and, once the site reports it, its live address, ready for your own report.",
  },
  !SHIPPED.citationTracking && {
    missing: "AI citation, ranking or mention tracking",
    instead:
      "Rankbox doesn't track these yet. Run manual prompt checks and report what you find; the AI SEO deep dive covers how to report it honestly.",
    link: { href: "/white-label/ai-seo", label: "White-label AI SEO" },
  },
  {
    missing: "A publishing connection without our name",
    instead:
      "The API key, the rankbox.xyz address and the CMS apps carry the Rankbox name. Readers never see them; whoever manages the site's integrations will.",
  },
  APPS_AWAITING.length > 0 && {
    missing: "Installable CMS apps",
    instead: `Today, articles reach each site through the REST API, which a developer wires once per site. The ${listNames(APPS_AWAITING)} ${APPS_AWAITING.length === 1 ? "app is" : "apps are"} built and waiting on store approval.`,
    link: { href: "/integrations/api", label: "The publishing API" },
  },
  {
    missing: "Full-service SEO",
    instead:
      "Technical audits, local listings and outreach link building aren't part of Rankbox. Keep the partners or tools you use for them.",
  },
];

export const GAPS = {
  kicker: "Said plainly",
  intro:
    "White-label here means the work carries your client's brand and Rankbox stays out of the relationship. It doesn't yet cover the pieces below, so here is what agencies do instead.",
  missingLabel: "Not yet",
  insteadLabel: "What to do instead",
  rows: gaps.filter((g): g is Gap => Boolean(g)),
};

/* ------------------------------------------------------------------ */
/* Billing in brief                                                    */
/* ------------------------------------------------------------------ */

export const BILLING = {
  kicker: "Billing",
  figure: SITE_PRICE,
  figureLabel: "per client site, per month, on your one invoice",
  rules: [
    `Your plan, ${PRICE_MONTHLY}, covers your first site. Each client site after it is ${SITE_PRICE} a month, with the full plan of its own.`,
    "Adding a site charges its share of the current billing period, shown before you confirm.",
    "Removing a site keeps it running to the end of the period you've paid for, with no refund. It's then archived with every article and setting kept.",
    "No minimum, no cap on sites, no contract, and the same price for the second site as the fortieth.",
    "Studio adds sites to a paid, current plan. The free trial covers one site.",
  ],
  pricingLink: "Work out a retainer on these numbers",
  planLink: "See the plan",
  guideLink: "Studio billing rules",
};

/* ------------------------------------------------------------------ */
/* Deep dives                                                          */
/* ------------------------------------------------------------------ */

export const DEEP = {
  kicker: "Go deeper",
  intro: "This page covers the program. Each of these takes one job further.",
  open: "Open",
  pages: [
    {
      href: "/white-label/content-writing",
      label: "Content writing",
      title: "The article line for client sites",
      body: "How a client's article gets made, from research to the editor, and how sign-off with clients works.",
      asks: [
        "What does one article contain?",
        "How do clients approve work?",
        "How much can each site take?",
      ],
    },
    {
      href: "/white-label/ai-seo",
      label: "AI SEO",
      title: "AI search as a service you sell",
      body: "The deliverables behind an AI search retainer, how to explain it to clients, and what you can and can't report.",
      asks: [
        "What do I deliver each month?",
        "How do I report without tracking?",
        "What differs by engine?",
      ],
    },
    {
      href: "/white-label/pricing",
      label: "Pricing",
      title: "The maths behind a retainer",
      body: "Cost per client site, ways to package it, and a margin calculator that runs on your own numbers.",
      asks: [
        "What does each client cost me?",
        "How should I package it?",
        "What happens on the invoice?",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

export const FAQ_SECTION = {
  kicker: "Questions",
  intro: "What agencies ask about clients, branding, billing and the rules.",
};

export const FAQS: { q: string; a: string }[] = [
  {
    q: "Is Rankbox software I run, or a team that does the work?",
    a: "Software you run. Nobody at Rankbox works on your clients' accounts or talks to them. Rankbox researches, writes and delivers the articles; you run the account, review the work and own the client relationship.",
  },
  {
    q: "Could a client ever find out the articles come from Rankbox?",
    a: "Not from anything their readers see: there's no badge, link or credit in the articles or their structured data. The one place the name appears is the publishing connection. The site connects with a Rankbox API key to a rankbox.xyz address, and Rankbox's CMS apps and plugins carry the Rankbox name in the site's admin, so someone who opens the site's integrations would see it.",
  },
  {
    q: "Can I give a client a login to watch their articles?",
    a: "Not yet. An account has one login, and inviting teammates or clients isn't available. Send clients the live links instead: each site's Articles page lists its published articles, and the publishing API returns each one's live address once the site has reported it.",
  },
  {
    q: "How much is each extra client site?",
    a: `${SITE_PRICE} a month, on the same invoice as your plan. The plan, ${PRICE_MONTHLY}, covers your first site. There's no setup fee, no minimum and no volume discount: every site costs the same.`,
  },
  {
    q: "Can I start adding clients during the free trial?",
    a: `The ${TRIAL} covers one site. To add clients before it ends, start the paid plan from Studio: the trial ends, ${PRICE} is charged for your first month, and you can add sites straight away. If the charge fails, nothing changes and you stay on the trial.`,
  },
  {
    q: "What happens to a client's articles when they stop working with me?",
    a: "Everything already published stays on their site. Remove the site from Studio and it keeps running until the end of the period you've paid for, then it's archived with its articles and settings kept. Nothing is refunded, and restoring it later is charged like adding a new site.",
  },
  {
    q: "Who owns the articles written for a client?",
    a: "Under Rankbox's Terms, you own the content you create and publish through the service. What passes from you to your client is set by your own contract with them.",
  },
  {
    q: "Should my client tell readers the articles were made with AI?",
    a: "That's the client's decision, and Rankbox adds no credit either way. Google's guidance on generative AI content says that sharing how a piece was made can give readers useful context, and it asks publishers to review AI content for accuracy before it goes live.",
  },
  {
    q: "Do client sites share credits or settings?",
    a: `No. Each site has its own ${N} articles, ${PLAN.backlinkCreditsPerMonth} backlink credits and ${PLAN.redditRepliesPerMonth} Reddit reply credits a month, its own voice, content plan, autopilot pace and API keys, and credits never move between sites. Only Studio, Plan & Billing and the Account settings are shared.`,
  },
  {
    q: "Do I need a developer for every client?",
    a: `For now, yes, once per site. Articles reach sites through the REST API, which someone wires into the site one time. If you built the client's site, that someone is you. The ${listNames(APPS_AWAITING) || "CMS"} apps are built and waiting on store approval.`,
  },
];

/* ------------------------------------------------------------------ */
/* Closing                                                             */
/* ------------------------------------------------------------------ */

export const CLOSING = {
  kicker: "Get started",
  body: `Set up your agency's own site, start the plan in Studio, and add your first client from there. Every client site is ${SITE_PRICE} a month on one invoice.`,
  terms: TRIAL_TERMS,
};

/* ------------------------------------------------------------------ */
/* Plumbing: JSON-LD and sources                                       */
/* ------------------------------------------------------------------ */

/** SoftwareApplication.featureList: shipped features only. */
export const FEATURE_LIST = [
  "One account with a separate site for each client (Studio)",
  "Brand voice and writing settings per site",
  "Question research and a content plan per site",
  "Long-form, cited articles scored on SEO and GEO checks",
  "An editor to review articles before or after they're finished",
  "Publishing through the REST API, with keys scoped to one site",
];

export const STUDIO_OFFER_NAME = "Rankbox Studio: one more client site";

/** Outside facts on the page, each with where and when it was checked. */
export const SOURCES = [
  {
    label: "Google Search's guidance on generative AI content",
    url: "https://developers.google.com/search/docs/fundamentals/using-gen-ai-content",
    checked: CHECKED_ON,
  },
];
