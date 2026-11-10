/**
 * /use-cases/web-design-studios: every word the page shows. The persona
 * object feeds the route's head and JSON-LD; `studiosPage` holds the rest of
 * the page's copy (the roster sample, the survey figure, the price block and
 * the white-label links), so no visitor-facing sentence lives in a component.
 *
 * Written to a studio that builds client sites on Webflow, Framer, WordPress
 * or Shopify and wants a recurring line after launch. Facts checked
 * 2026-11-10:
 * - Studio, its price and its rules: src/data/pricing.ts and
 *   src/content/docs/account/studio.md (trial covers one site, Studio opens
 *   with the first paid invoice, removal runs to period end, archived sites
 *   keep everything, the exchange never links two sites of one owner).
 * - Publishing: src/data/platforms.ts (every addonLive false) and
 *   src/data/docs.ts availability notes (Webflow and Shopify apps in store
 *   review, no Framer listing or WordPress plugin yet, REST API for every site).
 * - No author or credit field on an article: docs/api/articles.md.
 * - No review step inside Rankbox, so review is held at the destination:
 *   docs/publishing/overview.md.
 * - Not built: SHIPPED in src/data/competitors/shared.ts (no citation
 *   tracking, no team invites); no client logins or branded reports.
 *
 * Outside sources:
 * - The Admin Bar, "State of the WordPress Agency 2026" (fielded March 2026,
 *   2025 data, 622 WordPress agency owners and freelancers):
 *   https://theadminbar.com/2026-survey/, read 2026-11-10.
 * - Google Search Central, "Google Search's guidance on using generative AI
 *   content on your website":
 *   https://developers.google.com/search/docs/fundamentals/using-gen-ai-content,
 *   read 2026-11-10.
 */
import { PenTool } from "lucide-react";
import type { Persona } from "@/data/personas";
import { PLAN, STUDIO, TRIAL_DAYS, TRIAL_NOTE, formatUsd } from "@/data/pricing";
import { PUBLISH_PLATFORMS, type PlatformId } from "@/data/platforms";
import { SHIPPED, listNames } from "@/data/competitors/shared";

const N = PLAN.articlesPerMonth;
const PLAN_PRICE = formatUsd(PLAN.monthly);
const SITE_PRICE = formatUsd(STUDIO.monthlyPerSite);

const addonLive = (id: PlatformId) => PUBLISH_PLATFORMS.some((p) => p.id === id && p.addonLive);

/** Add-ons that have shipped. Empty today. */
const LIVE_ADDONS = PUBLISH_PLATFORMS.filter((p) => p.addonLive).map((p) => p.name);

/** The two CMS apps that are built and waiting on store approval, while they wait. */
const APPS_IN_REVIEW = PUBLISH_PLATFORMS.filter(
  (p) => (p.id === "webflow" || p.id === "shopify") && !p.addonLive,
).map((p) => p.name);

/* How articles reach a client's site today, read from the platform flags.
   Written here rather than borrowed from RANKBOX_PUBLISHING.sentence, which
   says "one-click" and lists every platform. */
const PUBLISHING_TODAY =
  LIVE_ADDONS.length === 0
    ? `Today articles reach every site through the Rankbox REST API, set up once per site with that site's own key${
        APPS_IN_REVIEW.length
          ? `. The ${listNames(APPS_IN_REVIEW)} apps are built and waiting on store approval`
          : ""
      }.`
    : `Articles publish through the ${listNames(LIVE_ADDONS)} ${
        LIVE_ADDONS.length === 1 ? "add-on" : "add-ons"
      }, and to any other site through the Rankbox REST API.`;

export const persona: Persona = {
  slug: "web-design-studios",
  name: "Web design studios",
  nameLower: "web design studios",
  shortName: "Studios",
  role: "web design studio",
  group: "business",
  icon: PenTool,
  tagline: "Turn the sites you launch into monthly content retainers.",

  eyebrow: "Content retainers for web design studios",
  headline: { lead: "Turn launches", accent: "into retainers" },
  subhead: `Most studio work is paid once, at launch, and most client blogs stop there too. With Rankbox ${STUDIO.name}, each client site gets its own research, its own brand voice and up to ${N} scored, source-backed articles a month, delivered to the CMS you built under the client's name.`,
  metaTitle: "Content Retainers for Web Design Studios | Rankbox",
  metaDescription: `Sell a monthly content retainer on the Webflow, Framer, WordPress and Shopify sites you build. One ${STUDIO.name} account, a site per client, ${SITE_PRICE} a site.`,

  shortAnswer: `Rankbox is an AI search content engine that web design studios run as the monthly content retainer on sites they have built. One ${STUDIO.name} account holds a site per client, each with its own research into the questions buyers ask ChatGPT, Perplexity, Gemini and Google AI Overviews, its own brand voice, and up to ${N} scored, source-backed articles a month, delivered to the client's CMS under the client's name for ${SITE_PRICE} a site a month. It has no client logins, branded reports or citation tracking, so the client relationship, the review and the monthly report stay with the studio.`,

  specs: [
    { value: SITE_PRICE, label: "per client site a month, all on one invoice" },
    { value: `${N}/mo`, label: "articles per client site, each with its own plan" },
    { value: "Unbranded", label: "articles carry the client's name, never ours" },
    { value: "REST API", label: "into the CMS collection you designed" },
  ],

  handoff: {
    runsTitle: "Rankbox runs this",
    runs: [
      {
        label: "Research per client",
        detail:
          "The questions each client's buyers ask AI engines and search, found from that client's own site.",
      },
      {
        label: "Drafts in each client's voice",
        detail:
          "Long, source-backed articles written to the tone, audience and product details set for that site.",
      },
      {
        label: "A score before it ships",
        detail: "Every article is scored for search and for being quoted in AI answers.",
      },
      {
        label: "Delivery to the CMS",
        detail:
          "Finished articles handed to each site on the schedule you set, through that site's API key.",
      },
    ],
    keepsTitle: "Your studio keeps this",
    keeps: [
      {
        label: "The client",
        detail:
          "The proposal, the retainer price, every call and every invoice. Rankbox never contacts them.",
      },
      {
        label: "The review",
        detail:
          "Reading and editing before anything goes live under the client's name, with a qualified reviewer for legal, medical or financial topics.",
      },
      {
        label: "The monthly report",
        detail:
          "Built your way. Rankbox lists each site's articles and live links, with no branded reports or client logins.",
      },
      {
        label: "The build",
        detail: "Templates, speed, technical SEO and listings. Rankbox doesn't audit or fix sites.",
      },
    ],
  },

  painsTitle: "Why the work stops at launch",
  painsIntro:
    "A studio is paid to build. Once the site ships, the invoices stop, and the blog you designed usually stops with them.",
  pains: [
    {
      pain: "Revenue resets every time a project ships.",
      fix: `A content retainer bills every month on sites you have already built. ${STUDIO.name} adds each one at ${SITE_PRICE} a month, on one invoice you pay and one price you set.`,
    },
    {
      pain: "The blog template launches with three placeholder posts and never gets a fourth.",
      fix: "Articles arrive as items in the collection you designed, with title, slug, description, tags and body filled in, laid out by your template.",
    },
    {
      pain: "Clients ask whether they'll show up in ChatGPT, and you build sites, not SEO programs.",
      fix: "Rankbox researches the questions buyers ask AI engines and scores each article for being quoted. It doesn't report whether a client is cited, so the pitch can say so up front.",
    },
    {
      pain: "Hiring a writer who can sound like five different clients doesn't add up.",
      fix: "Each client site keeps its own brand voice, set once from that site: tone, audience and product details, applied to every draft.",
    },
  ],

  workflowTitle: "Where it fits in a project",
  workflowIntro:
    "Four moments in work you already run, from the proposal to every month after launch.",
  steps: [
    {
      when: "Proposal",
      title: "Scope the retainer",
      body: "Add a monthly content line to the proposal at a price you set. Rankbox never sees or bills the client.",
    },
    {
      when: "Build",
      title: "Design the collection",
      body: "Build the blog collection and its template with the fields Rankbox fills: title, slug, description, tags and body.",
    },
    {
      when: "Launch week",
      title: "Add the site to Studio",
      body: "Enter the site's address, check the brand Rankbox reads from it, pick the searches to win and review the first month of articles. Then connect the site with its own API key.",
    },
    {
      when: "Every month",
      title: "Review, publish, report",
      body: "Articles arrive on the pace you set, held as drafts if you want a read first. You edit, publish and send the client your own report with the live links.",
    },
  ],

  stackTitle: "What a content retainer would otherwise take",
  stackIntro:
    "The usual way a studio staffs content for its clients, line by line. No prices beside them: they vary too much to quote fairly.",
  stack: [
    {
      label: "A freelance writer per client",
      detail: "Briefed on each client's trade and voice, one at a time",
    },
    {
      label: "Question and keyword research",
      detail: "A separate tool, or an afternoon in one, for every client",
    },
    {
      label: "An editorial calendar",
      detail: "A spreadsheet per client that drifts a month after launch",
    },
    {
      label: "Pasting posts into the CMS",
      detail: "Copying drafts into collection fields by hand",
    },
    {
      label: "A pre-publish checklist",
      detail: "Headings, metadata and sources, checked by eye before each post",
    },
  ],
  stackNote:
    "Rankbox covers the content side only. Technical SEO, site speed, local listings, outreach link building and the client report stay with your studio or the tools you already use.",

  picksTitle: "The four features a retainer runs on",
  picksIntro:
    "Rankbox does more than these. These are the four a studio leans on when the work goes out under a client's name.",
  picks: [
    {
      featureSlug: "brand-voice",
      why: "Set per site, so the furniture maker and the physio clinic never sound like each other, or like you.",
    },
    {
      featureSlug: "answer-space-research",
      why: "Gives every client a plan built from the questions their own buyers ask, not a list of generic topics.",
    },
    {
      featureSlug: "seo-geo-score",
      why: "A check on every draft before it reaches a client's site with your studio's reputation behind it.",
    },
    {
      featureSlug: "auto-publishing",
      why: "Finished articles reach the collection you built on each site's own pace, as drafts or live.",
    },
  ],

  topics: {
    title: "A client's blog, mapped before launch",
    intro:
      "Rankbox reads the client's site and finds the questions their buyers ask. Each one becomes a page in the collection you designed.",
    brand: "Brindlework",
    domain: "brindlework.example",
    clusters: [
      {
        stage: "Before they commission",
        intent: "Buying",
        questions: [
          "How long does a custom dining table take to make?",
          "What should you ask a furniture maker before commissioning?",
          "How do you measure a room for built-in shelving?",
        ],
      },
      {
        stage: "Weighing options",
        intent: "Comparing",
        questions: [
          "Solid oak or walnut: which wears better at home?",
          "Made to order or off the shelf: what actually changes?",
          "Oil or lacquer: which finish suits a family table?",
        ],
      },
      {
        stage: "Living with it",
        intent: "How-to",
        questions: [
          "How do you care for an oiled oak table?",
          "How do you lift a water ring out of wood?",
          "Can solid wood furniture sit near a radiator?",
        ],
      },
      {
        stage: "Curious buyers",
        intent: "Explaining",
        questions: [
          "Why does solid wood move with the seasons?",
          "What does FSC-certified timber mean?",
          "What makes a dovetail joint so strong?",
        ],
      },
    ],
    note: "A sample map for Brindlework, a fictional furniture workshop a studio might have built on Webflow. Each client's map is built from their own site, and nothing is written until you have reviewed the plan.",
    platformsTitle: "Into the CMS you built",
    platforms: [
      {
        slug: "webflow",
        why: addonLive("webflow")
          ? "Items in the blog collection you designed, live or as drafts, through the Rankbox app."
          : "Items in the blog collection you designed. Through the REST API today; the Webflow app is built and in Marketplace review.",
      },
      {
        slug: "framer",
        why: addonLive("framer")
          ? "Synced into a CMS collection by the Rankbox plugin, live when you publish the site."
          : "A CMS collection your page layout reads. Through the REST API today, until the Framer plugin is listed.",
      },
      {
        slug: "wordpress",
        why: addonLive("wordpress")
          ? "Native posts in the client's theme, through the Rankbox plugin."
          : "Native posts in the client's theme, created by a short piece of your own code on the REST API.",
      },
    ],
  },

  proof: [],
  proofTitle: "Studios running content retainers",

  faqs: [
    {
      q: "Will my clients see Rankbox anywhere?",
      a: `Not in the work. Articles carry no Rankbox badge, link or credit, in the text or in the structured data, and Rankbox never emails, calls or bills your clients. The name shows up in one place: the API key and the rankbox.xyz address in the site's code or integration settings${
        APPS_IN_REVIEW.length
          ? `, or an app named Rankbox once the ${listNames(APPS_IN_REVIEW)} apps are approved`
          : ""
      }.`,
    },
    {
      q: "Can clients log in to see their articles or a report?",
      a: `No. There are no client logins and no branded reports${
        SHIPPED.teamInvites ? "" : ", and an account has one login, with no team seats yet"
      }. You send the report. Rankbox lists every article for each site, with its live address once the site reports it, so building your own monthly summary takes the links straight from there.`,
    },
    {
      q: "Does it show whether a client appears in ChatGPT or Google's AI answers?",
      a: SHIPPED.citationTracking
        ? "Yes. Rankbox tracks where AI answers quote each client site, and you can bring those results into your own report."
        : "No. Rankbox doesn't track citations, rankings or AI mentions. It researches the questions buyers ask and scores every article for being quoted. To report on results, use the client's Google Search Console and GA4, plus a fixed set of prompts you check by hand each month.",
    },
    {
      q: "How do articles get into a Webflow, Framer, WordPress or Shopify site?",
      a: `${PUBLISHING_TODAY} Since your studio built the site, you're usually the developer that setup asks for: map the fields to the collection once, and finished articles keep arriving on that site's schedule.`,
    },
    {
      q: "Can I read articles before they go live on a client's site?",
      a: "Yes. Rankbox has no separate approve step, because a finished article is ready to publish, so hold them at the destination instead: drafts in Webflow, hidden posts in Shopify, or a draft status in your own code. Edit anything in the editor first. Google's guidance on AI-assisted content asks publishers to fact-check and review it before it goes out, and a legal, medical or financial client needs a qualified person to sign off.",
    },
    {
      q: "What does it cost the studio, and what do I charge?",
      a: `Your plan is ${PLAN_PRICE} a month and covers one site. Each client site in ${STUDIO.name} is ${SITE_PRICE} a month on the same invoice, with its own ${N} articles a month. What you charge the client is your decision; Rankbox never bills them. The ${TRIAL_DAYS}-day trial covers one site, and ${STUDIO.name} opens with your first paid invoice.`,
    },
    {
      q: "What happens when a client ends the retainer?",
      a: `Remove their site from ${STUDIO.name}. It keeps running to the end of the period you've paid for, then it's archived with its articles, keywords and settings kept, and you stop paying for it from the next invoice. The current period isn't refunded. Everything already published stays on the client's site.`,
    },
    {
      q: "Can my client sites link to each other?",
      a: "Not through Rankbox. Each site's plan includes a backlink exchange allowance, still rolling out, and the exchange never trades links between sites one owner runs, because links between them would form a private link network. Link between client sites only where it helps a reader.",
    },
    {
      q: "Does it handle technical SEO, speed or local listings?",
      a: "No. Rankbox doesn't audit sites, fix rendering or speed, manage Google Business Profiles or reviews, or do outreach link building. That's build and care-plan work your studio already does, or keeps the tools for.",
    },
  ],
  ctaTitle: "Put the next launch on retainer",
  ctaBody: `Start with your studio's own site, then add your first client in ${STUDIO.name} once the plan is paid.`,

  hideFromNav: true,
};

/* ------------------------------------------------------------------ */
/* The rest of the page's copy                                         */
/* ------------------------------------------------------------------ */

/** A client on the hero's sample roster. Weeks run 0–23 across six months. */
export interface RosterClient {
  name: string;
  niche: string;
  domain: string;
  platform: PlatformId;
  /** The build, in weeks, when it falls inside the window. */
  build?: { from: number; to: number };
  /** The week the retainer starts. Absent: not on retainer in the window. */
  retainerFrom?: number;
  /** Launched before the window and left without content until `retainerFrom`. */
  quietFrom?: number;
  /** The event shown when the retainer starts inside the window. */
  event?: string;
}

const ROSTER_CLIENTS: RosterClient[] = [
  {
    name: "Driftmoor Coffee",
    niche: "Coffee roaster",
    domain: "driftmoorcoffee.example",
    platform: "shopify",
    retainerFrom: 0,
  },
  {
    name: "Brindlework",
    niche: "Furniture workshop",
    domain: "brindlework.example",
    platform: "webflow",
    build: { from: 0, to: 6 },
    retainerFrom: 7,
    event: `Brindlework launched · added to ${STUDIO.name}`,
  },
  {
    name: "Kestrelyn",
    niche: "Physio clinic",
    domain: "kestrelyn.example",
    platform: "framer",
    build: { from: 5, to: 13 },
    retainerFrom: 14,
    event: `Kestrelyn launched · added to ${STUDIO.name}`,
  },
  {
    name: "Plotbright",
    niche: "Garden designer",
    domain: "plotbright.example",
    platform: "webflow",
    quietFrom: 0,
    retainerFrom: 18,
    event: `Plotbright signed a retainer · added to ${STUDIO.name}`,
  },
  {
    name: "Tallowpine",
    niche: "Cabin rentals",
    domain: "tallowpine.example",
    platform: "wordpress",
    build: { from: 12, to: 23 },
  },
];

export const studiosPage = {
  cta: {
    primary: "Start your Studio",
    secondary: "How white-label works",
    trialExtra: `The trial covers one site. Client sites open in ${STUDIO.name} with the first paid invoice.`,
    trialNote: TRIAL_NOTE,
  },

  roster: {
    title: "Client roster",
    sample: "Sample",
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    legend: { build: "Build", quiet: "No content", retainer: "Articles" },
    segments: {
      build: "Build",
      quiet: "Blog quiet since launch",
      retainer: `Retainer · ${STUDIO.name}`,
    },
    status: { retainer: "On retainer", build: "In build", quiet: "Handed off" },
    launch: "Launch",
    totalLabel: `${STUDIO.name} line`,
    /** "{n} client sites × $49.50" is built in the component from STUDIO. */
    sites: "client sites",
    site: "client site",
    perMonth: "a month",
    planNote: "plus your own plan",
    caption:
      "Illustration. Client names are fictional; articles per site stay within the plan's monthly allowance.",
    clients: ROSTER_CLIENTS,
  },

  inShort: {
    label: "In short",
    limitsTitle: "What it doesn't do",
    limits: [
      "Client logins or branded reports",
      SHIPPED.teamInvites ? "Separate client workspaces" : "Team seats: one login per account",
      ...(SHIPPED.citationTracking ? [] : ["Citation, ranking or AI-mention tracking"]),
      "Technical audits, speed or rendering fixes",
      "Local listings, reviews or outreach link building",
    ],
    limitsNote:
      "Keep the tools and partners you use for these. Rankbox covers research, articles and delivery.",
  },

  survey: {
    kicker: "Why retainers matter to a studio",
    value: "58.3%",
    claim:
      "of WordPress agencies with no recurring revenue said they were rarely or never profitable in 2025.",
    contrast:
      "Among those whose recurring revenue reached a quarter of the total, that share stayed under 10%.",
    caveat:
      "The survey itself notes the link may run both ways: stronger agencies tend to move to retainers. Recurring revenue there means care plans, hosting and retainers, not content alone.",
    source: "The Admin Bar, State of the WordPress Agency 2026",
    sourceDetail: "622 agency owners and freelancers, surveyed March 2026",
    href: "https://theadminbar.com/2026-survey/",
  },

  sitemap: {
    title: "Sitemap",
    root: "Home",
    collection: "/journal",
    collectionLabel: "CMS collection you designed",
    builtOn: "Built on",
    pages: "pages",
  },

  scope: {
    kicker: "Who does what",
    heading: "One retainer, split down",
    accent: "the middle",
    intro:
      "Write it into the proposal like any other scope. One column runs inside Rankbox; the other never leaves your studio.",
    link: "What clients see, and what they don't",
    linkHref: "/white-label",
    docTitle: "Content retainer",
    docKicker: "Scope of work",
    docLabel: "Sample scope, one client site",
  },

  sections: {
    pains: "The launch problem",
    topics: "Sample topic map",
    platforms: "Publishing",
    workflow: "In the project",
    picks: "Features",
    stack: "The cost side",
    faq: "Before you pitch it",
  },

  price: {
    kicker: "Pricing",
    title: "What a client site costs you",
    intro: "One price per site, on one invoice. What you charge the client is yours to set.",
    planLabel: "Your plan",
    planDetail: "Covers your first site: your studio's own, or a client's.",
    siteLabel: `Each site in ${STUDIO.name}`,
    siteDetail: `Its own research, voice, plan and ${N} articles a month.`,
    stepperLabel: "Client sites",
    fewer: "One fewer client site",
    more: "One more client site",
    totalLabel: "Your monthly total",
    clientLabel: "What you bill each client",
    clientValue: "Your price",
    notes: [
      `The ${TRIAL_DAYS}-day trial covers one site. ${STUDIO.name} opens once you start the paid plan.`,
      "A site added mid-cycle is charged its share of the period, then renews with the plan.",
      "Remove a client site any time. It runs to the end of the paid period, without a refund.",
    ],
    marginLink: "Work out your margin",
    marginHref: "/white-label/pricing",
    perMonth: "/mo",
  },

  whiteLabel: {
    kicker: "White-label",
    title: "Go deeper before the first client",
    intro: "Four pages on running client work through Rankbox under your studio's name.",
    links: [
      {
        href: "/white-label",
        title: "How white-label works",
        body: "What your clients see, what they never see, and the one place the Rankbox name can appear.",
      },
      {
        href: "/white-label/content-writing",
        title: "White-label content writing",
        body: "The production line for each client, from research and drafts to your review and delivery.",
      },
      {
        href: "/white-label/ai-seo",
        title: "AI search as a service line",
        body: "Selling AI search work to clients who ask about ChatGPT, and reporting on it without a tracker.",
      },
      {
        href: "/white-label/pricing",
        title: "Pricing a content retainer",
        body: "Your cost per client site, how to package it, and a margin calculator on your own numbers.",
      },
    ],
  },

  faqTitle: "Questions studios ask",
  faqAccent: "before the first retainer",
  faqLink: "Read the Studio docs",
  faqHref: "/docs/account/studio",
} as const;
