/**
 * /white-label/pricing: every word on the page.
 *
 * Rankbox's prices, allowances and trial come from facts.ts, so a price change
 * updates the page with no edit here. Market figures are quoted from the
 * published source named next to each one, with its date and the date it was
 * opened; nothing on the page suggests what an agency should charge.
 */
import {
  LIVE_ADDONS,
  PLAN,
  PRICE,
  STUDIO,
  TRIAL,
  TRIAL_TERMS,
  formatUsd,
} from "@/sublanding/_shared/facts";
import { getFeature } from "@/data/features";
import type { Allowance } from "@/lib/studio";
import { EXAMPLE_PERIOD_DAYS, perArticleCost, type PlanSite } from "./calc";

export const PATH = "/white-label/pricing";

/** The breadcrumb's last crumb and the registry name. */
export const NAME = "White-label pricing";

/** When the facts and sources below were last checked. */
export const CHECKED_ON = "2026-10-29";
const CHECKED = "29 October 2026";

/** One client site in Studio, a month, formatted ("$" and cents). */
export const SITE_PRICE = formatUsd(STUDIO.monthlyPerSite);

/** Rankbox's cost per article on one site, when every credit is used. */
export const PER_ARTICLE = formatUsd(perArticleCost());

/** The shortest article the writer produces, from the Citation-Ready Writer's stats. */
export const ARTICLE_WORDS_MIN = (() => {
  const stat = getFeature("citation-ready-writer")?.specs.find((s) => /words/i.test(s.label));
  const n = Number(stat?.value.split(/[–-]/)[0]?.replace(/,/g, ""));
  return Number.isFinite(n) && n > 0 ? n : 2000;
})();

/* ------------------------------------------------------------------ */
/* Contract: META, FAQS, OUTLINE                                       */
/* ------------------------------------------------------------------ */

export const META = {
  query: "white label seo pricing",
  title: "White Label SEO Pricing: Your Cost per Client Site | Rankbox",
  description: `Every client site is ${SITE_PRICE} a month in Rankbox Studio, with no tiers. Work out your margin, package the retainer and see how billing moves as clients change.`,
  h1: "White label SEO pricing that starts with a fixed cost per client",
  keywords: [
    "white label seo pricing",
    "how to price white label seo",
    "white label content pricing",
    "white label seo cost per client",
    "agency seo retainer pricing",
  ],
};

export const OUTLINE = [
  { id: "margin", h2: "Work out your margin on each client" },
  { id: "packaging", h2: "Three ways to package the retainer" },
  { id: "market-rates", h2: "What agencies report charging, with dates" },
  { id: "billing", h2: "How the Studio invoice changes as clients come and go" },
  { id: "faq", h2: "Pricing questions agencies ask before adding clients" },
  { id: "start", h2: "Price your first client, then add the site" },
] as const;

export type SectionId = (typeof OUTLINE)[number]["id"];

/** The H2 for a section, as OUTLINE names it. */
export function h2(id: SectionId): string {
  return OUTLINE.find((s) => s.id === id)?.h2 ?? "";
}

export const FAQS = [
  {
    q: "Do client sites get cheaper as I add more?",
    a: `No. Every Studio site is ${SITE_PRICE} a month, whether it's your second site or your fiftieth. There are no tiers, partner prices or volume discounts, and no minimum number of sites.`,
  },
  {
    q: "What does a new client cost me in its first month?",
    a: `The site's share of your current billing period, charged when you add it. Stripe works the share out to the second, and Studio shows the exact amount before you confirm. The first allowance is prorated the same way and rounded up. From your next renewal the site is ${SITE_PRICE} a month with the full ${PLAN.articlesPerMonth} articles.`,
  },
  {
    q: "Can two small clients share one site's articles?",
    a: "No. Each site has its own brand voice, content plan and credit balances, and credits never move between sites. A client who buys only a few articles a month still takes a whole site, so price the site rather than the article.",
  },
  {
    q: "Can I give a client a free trial month?",
    a: `Only at your own cost. The ${TRIAL} covers one site, once per account, and Studio sites are paid from the day you add them. If you let a client try the service free, you pay for their site while they do.`,
  },
  {
    q: "If a client leaves mid-month, do I get money back?",
    a: "No. Removing a site keeps it running to the end of the period you've paid for, and that period isn't refunded. After that it stops billing and is archived with its articles and settings. A client notice period that ends on your renewal date covers the gap.",
  },
  {
    q: "Can Rankbox invoice my clients for me?",
    a: "No. Rankbox bills only you: one subscription, one invoice and one card for your plan and every client site. What you charge your clients, and how you invoice them, stays between you and them.",
  },
  {
    q: "Should my own agency site take the plan's site?",
    a: `That's your call, and the calculator shows both. The plan's own site is covered by the ${PRICE} plan and can't be removed on its own, so it suits a site you'll keep, such as your agency's. Putting a client there saves one Studio site's fee, but that slot can't be archived if the client leaves.`,
  },
  {
    q: "What happens to every client if my card is declined?",
    a: "Writing stops on every site at once, with no grace period, and you can't add or restore sites. Articles and settings are kept. Update the card from the banner in the dashboard, Rankbox retries the invoice, and writing resumes once it's paid.",
  },
  {
    q: "Does the per-site price cover a full SEO retainer?",
    a: "It covers the content side: research into the questions buyers ask, articles scored for SEO and GEO, delivery through the publishing API, and allowances for the backlink exchange and Reddit reply drafts. Technical audits, local listings, outreach link building and rank or citation reports aren't included, so price those separately if you sell them.",
  },
];

/** SoftwareApplication.featureList: shipped features only. */
export const FEATURE_LIST = [
  "Research into the questions buyers ask AI, per client site",
  "Long-form, cited answer articles in each site's brand voice",
  "An SEO and a GEO score on every article",
  "Publishing API with its own keys for every site",
  "Studio: many client sites on one account and one invoice",
];

/** The per-site Offer in the page's JSON-LD. */
export const OFFER = {
  name: `Rankbox ${STUDIO.name} client site`,
  unitText: "site per month",
};

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export const HERO = {
  crumbs: { home: "Home", hub: "White-label", here: "Pricing" },
  sub: `Each client site you add in Rankbox Studio is ${SITE_PRICE} a month on your own invoice, and that price doesn't move with volume. Start from it, add your team's time, and set the retainer you sell.`,
  answerLabel: "Short answer",
  answer: `With Rankbox, each client site costs a fixed ${SITE_PRICE} a month, billed on the same invoice as your plan, which covers your first site. Every site gets its own ${PLAN.articlesPerMonth} articles a month, and the price is the same at any number of sites. What you charge clients is your decision: in SE Ranking's December 2024 survey, 64% of agencies offered SEO retainers under $1,000 a month.`,
  scope:
    "The price covers the content and AI search side of SEO. Technical audits, local listings and outreach link building sit outside it.",
  cta: "Start your agency account",
  secondary: "Run your numbers",
  note: `${TRIAL_TERMS} The trial covers one site; you add client sites in Studio once the plan is paid.`,
};

export const SHEET = {
  title: "Cost sheet",
  caption: "One client site, per month",
  siteLine: `Client site in ${STUDIO.name}`,
  siteUnit: "/mo",
  includedLabel: "Included in that price",
  included: [
    `${PLAN.articlesPerMonth} cited answer articles, each with an SEO and a GEO score`,
    `${PLAN.backlinkCreditsPerMonth} backlink exchange credits`,
    `${PLAN.redditRepliesPerMonth} Reddit reply drafts`,
    "Its own research, brand voice, content plan and API keys",
  ],
  perArticleLabel: "Per article, every credit used",
  nones: [
    { label: "Setup fee", value: "None" },
    { label: "Minimum sites", value: "None" },
    { label: "Contract", value: "None" },
    { label: "Volume discount", value: "None" },
  ],
  foot: `Your ${PRICE} plan covers your first site. Prices checked ${CHECKED}.`,
  alt: "An itemised cost sheet for one client site in Rankbox Studio.",
};

/* ------------------------------------------------------------------ */
/* Margin calculator                                                   */
/* ------------------------------------------------------------------ */

const publishingSetup =
  LIVE_ADDONS.length === 0
    ? "Connecting the publishing API, which a developer does once per site, plus brand voice and keywords"
    : "Connecting publishing, setting the brand voice and picking keywords";

export const MARGIN = {
  intro:
    "A client costs you three things: the Rankbox site, the setup, and your team's hours each month. Type your own numbers. The calculator suggests no price, and nothing you enter leaves this page.",
  clients: {
    legend: "Your clients",
    label: "Client sites",
    less: "One fewer client",
    more: "One more client",
  },
  planSite: {
    label: "Your plan's own site runs",
    options: [
      { value: "agency" as PlanSite, label: "Your agency's site" },
      { value: "client" as PlanSite, label: "One of these clients" },
    ],
    hints: {
      agency: "Every client is a Studio site, and your agency's site gets articles too.",
      client:
        "One client sits on the plan's site, so you pay for one fewer Studio site. That slot can't be removed on its own if the client leaves.",
    } satisfies Record<PlanSite, string>,
  },
  price: {
    legend: "What you charge",
    retainer: "Monthly retainer per client",
    retainerHint: "Not sure where to start?",
    retainerLink: "See what agencies report charging",
    setupFee: "One-time setup fee per client",
    optional: "Optional",
  },
  time: {
    legend: "Your team's time",
    hours: "Hours per client a month",
    hoursHint: "Reviewing articles, client calls, reporting",
    rate: "Cost of one team hour",
    rateHint: "What an hour costs you, not what you bill",
    setupHours: "Setup hours per new client",
    setupHoursHint: publishingSetup,
  },
  errors: {
    nan: "Enter a number.",
    negative: "Use zero or more.",
    tooBig: (max: number) => `Use ${max.toLocaleString("en-US")} or less.`,
    clients: (min: number, max: number) => `Use ${min} to ${max} sites.`,
  },
  results: {
    title: "Your month",
    bill: "Rankbox bill",
    billDetail: (planSite: PlanSite, studioSites: number) =>
      planSite === "agency"
        ? `Plan ${PRICE} + ${studioSites} client ${studioSites === 1 ? "site" : "sites"} × ${SITE_PRICE}`
        : `Plan ${PRICE} holding one client + ${studioSites} × ${SITE_PRICE}`,
    billNoteAgency: "Includes your plan, which also runs your agency's own site.",
    perClient: "Rankbox cost per client",
    time: "Team time",
    timeDetail: (clients: number, hours: number, rate: string) =>
      `${clients} × ${hours} h × ${rate}`,
    totalCost: "Total cost",
    revenue: "Retainers billed",
    margin: "Gross margin",
    marginPct: (pct: number) => `${pct}% of revenue`,
    breakEven: "Break-even retainer",
    breakEvenDetail: "per client, covering the bill and your time",
    perMonth: "/mo",
    empty: "Add your monthly retainer per client to see the margin.",
    emptyBreakEven: (be: string) =>
      `To cover costs, each client needs to pay at least ${be} a month.`,
    loss: (amount: string, be: string) =>
      `At this price you'd lose ${amount} a month. Charge at least ${be} per client to break even.`,
    zeroTime:
      "Team time is at zero, so this margin leaves out the hours you'll spend on each client.",
    error: "Fix the highlighted field to see your numbers.",
    setupTitle: "Each new client, once",
    setupFee: "Setup fee",
    setupCost: "Your setup time",
    setupNet: "Left from setup",
    firstMonth: "A client added part-way through a period also costs its prorated first charge.",
    firstMonthLink: "How that's worked out",
  },
};

/* ------------------------------------------------------------------ */
/* Packaging                                                           */
/* ------------------------------------------------------------------ */

export const PACKAGING = {
  intro:
    "Each shape runs on one Rankbox site per client, so your cost stays the same. What changes is where the margin leaks.",
  columns: { how: "How it's sold", cost: "Your Rankbox cost", watch: "Watch for" },
  cost: `${SITE_PRICE} a month per client`,
  packages: [
    {
      name: "Inside the SEO retainer you already sell",
      how: "The articles become part of a monthly fee that also covers your other SEO work. The client sees one line on your invoice.",
      watch: `The site costs ${SITE_PRICE} whatever the retainer, so on a small retainer it takes a bigger share. Run the calculator at your smallest client's price.`,
    },
    {
      name: "A content retainer on its own",
      how: `A set number of articles a month, up to the site's ${PLAN.articlesPerMonth}, published to the client's site under the client's name.`,
      watch:
        "Credits never move between sites. A client who buys eight articles still takes a whole site, so price the site rather than the article.",
    },
    {
      name: "A setup fee, then a monthly line",
      how: "You charge once for onboarding: reading the site, setting the brand voice, choosing keywords and connecting publishing. The monthly line starts after.",
      watch:
        LIVE_ADDONS.length === 0
          ? "Until the CMS apps and plugins are live, a developer connects each client site to the publishing API once. That time belongs in the fee."
          : "Sites outside the live CMS apps still need a developer to connect the publishing API once. That time belongs in the fee.",
    },
  ],
  notCovered: {
    title: "Not in the per-site price",
    intro: "Price these separately if you sell them, or keep them out of the retainer.",
    items: [
      "Technical SEO audits and site fixes",
      "Local listings and Google Business Profile work",
      "Outreach link building (the backlink exchange is a monthly credit allowance between Rankbox members)",
      "Rank, citation or mention reports, which Rankbox doesn't produce yet",
      "Client logins, branded reports or a dashboard on your domain",
    ],
  },
  guarantee: {
    text: "Leave guaranteed rankings and citations out of the contract. Rankbox's Terms don't promise ranking, traffic or citation results, so a retainer that does would be promising something neither of you controls.",
    link: { href: "/legal/terms", label: "Terms, section 5" },
  },
  across: {
    lead: "The work behind the price has its own pages:",
    links: [
      { href: "/white-label/content-writing", label: "How client articles are produced" },
      { href: "/white-label/ai-seo", label: "Selling AI search as a service line" },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Market rates                                                        */
/* ------------------------------------------------------------------ */

export interface Band {
  band: string;
  /** Percent of agencies. */
  share: number;
  /** False when the figure is worked out from two stated ones. */
  stated: boolean;
}

const SE_RANKING = {
  name: "SE Ranking agency pricing survey",
  url: "https://seranking.com/blog/seo-pricing/",
  published: "13 December 2024",
};

const EFA_LOW = 0.25;
const EFA_HIGH = 0.45;

export const MARKET = {
  intro:
    "Your price is yours to set. These published surveys show where SEO retainers cluster. They cover SEO work as a whole, not content alone, and none of them is our recommendation.",
  chart: {
    title: "Monthly SEO retainers, share of agencies",
    bands: [
      { band: "Under $500", share: 30, stated: true },
      { band: "$500 to $1,000", share: 34, stated: false },
      { band: "$1,000 to $2,000", share: 20, stated: true },
      { band: "$2,000 to $5,000", share: 13, stated: true },
      { band: "Over $5,000", share: 2, stated: true },
    ] satisfies Band[],
    statedLabel: "Stated in the survey",
    derivedLabel: "Worked out: 64% under $1,000, minus 30% under $500",
    sample:
      "260 responses, mostly agencies serving small and local businesses. SE Ranking notes the sample may be too small for statistical significance. Shares add to 99% because of rounding.",
    source: SE_RANKING,
    tableCaption:
      "Monthly SEO retainers by price band, share of agencies, SE Ranking, December 2024",
    columns: { band: "Retainer a month", share: "Share of agencies" },
  },
  notes: [
    {
      figure: "78.2%",
      text: "of 439 SEO providers polled by Ahrefs charge a monthly retainer. The most common band was $501 to $1,000 a month, chosen by 20.4% of them.",
      source: {
        name: "Ahrefs, SEO pricing study",
        url: "https://ahrefs.com/blog/seo-pricing/",
        published: "updated 15 August 2024",
      },
    },
    {
      figure: "$937",
      text: "a month is the average that agencies with a set price charge, or plan to charge, for AI Overview optimization. SE Ranking doesn't say how many agencies that covers.",
      source: { ...SE_RANKING, name: "SE Ranking, same survey" },
    },
    {
      figure: `${EFA_LOW * 100}¢ to ${EFA_HIGH * 100}¢`,
      text: `a word is the range EFA members reported for blog posts written as work for hire in 2025. At those rates, one ${ARTICLE_WORDS_MIN.toLocaleString("en-US")}-word post costs ${formatUsd(EFA_LOW * ARTICLE_WORDS_MIN)} to ${formatUsd(EFA_HIGH * ARTICLE_WORDS_MIN)}.`,
      source: {
        name: "Editorial Freelancers Association, 2026 rate chart",
        url: "https://www.the-efa.org/rates/",
        published: "member survey, November 2025 to January 2026",
      },
    },
  ],
  opened: `Every source opened ${CHECKED}.`,
  sourceLabel: "Source",
};

/* ------------------------------------------------------------------ */
/* Billing                                                             */
/* ------------------------------------------------------------------ */

export const BILLING = {
  intro:
    "One subscription carries your plan and every client site, on one card and one renewal date. Here is what each change does to it.",
  slider: {
    title: "A client signs mid-period",
    label: "Day of the billing period you add the site",
    valueText: (day: number) => `Day ${day} of ${EXAMPLE_PERIOD_DAYS}`,
    start: "Period starts",
    end: "Renewal",
    used: "Already used",
    paid: "Share you pay for",
    due: "Charged today, about",
    shareLeft: "Share of the period left",
    allowance: "First allowance",
    allowanceText: (a: Allowance) =>
      `${a.articles} ${a.articles === 1 ? "article" : "articles"}, ${a.backlinkCredits} backlink ${a.backlinkCredits === 1 ? "credit" : "credits"}, ${a.redditReplies} Reddit ${a.redditReplies === 1 ? "reply" : "replies"}`,
    then: "From your next renewal",
    thenText: `${SITE_PRICE} a month and the full ${PLAN.articlesPerMonth} articles`,
    caveat: `An example ${EXAMPLE_PERIOD_DAYS}-day period. Stripe prorates to the second, and Studio shows the exact amount before you confirm.`,
  },
  eventsTitle: "Every billing event, in order",
  events: [
    {
      when: "During the trial",
      what: `The ${TRIAL} covers one site. To add clients before it ends, click Start paid plan now in Studio: the trial ends, your card is charged ${PRICE} for the first month, and Studio opens. If the charge fails, nothing changes.`,
    },
    {
      when: "Adding a client",
      what: "Charged at once for the share of the period that's left, with the amount shown before you confirm. The first allowance is prorated the same way, rounded up, and never below one article.",
    },
    {
      when: "Each renewal",
      what: "The plan and every client site renew together, on one invoice, one card and one date. Plan & Billing shows the total as your next invoice.",
    },
    {
      when: "Removing a client",
      what: "The site keeps running to the end of the period you've paid for, and the rest of that period isn't refunded. Then it's archived with every article and setting kept, and published articles stay on the client's site.",
    },
    {
      when: "Changing your mind",
      what: "Click Keep this site before the removal date. Nothing is charged until your next normal invoice, because the period is already paid.",
    },
    {
      when: "Restoring a client",
      what: "An archived site comes back with its articles and settings, charged like a new site: its share of the current period today, then the monthly price.",
    },
    {
      when: "A declined card",
      what: "There's no grace period. Writing stops on every client site at once, and you can't add or restore sites until the invoice is paid. Articles and settings are kept.",
    },
  ],
  adviceTitle: "Line your client terms up with this",
  advice: [
    "Invoice clients ahead of your renewal date, so their payment lands before yours goes out.",
    "End a client's notice period on your renewal date, since a removal runs to the end of the paid period anyway.",
    "Pay with a card that has room for the whole invoice, because one decline pauses every client.",
  ],
  docs: [
    { href: "/docs/account/studio", label: "Studio docs" },
    { href: "/docs/account/billing", label: "Billing docs" },
    { href: "/legal/refunds", label: "Refund policy" },
  ],
};

/* ------------------------------------------------------------------ */
/* FAQ and closing                                                     */
/* ------------------------------------------------------------------ */

export const QUESTIONS = {
  intro: "Short answers on the money side. The program itself is on the white-label overview.",
  hubLink: { href: "/white-label", label: "White-label overview" },
};

export const CLOSING = {
  body: "Set up your agency's own site first, the way every account starts. Start the plan when you're ready for clients, then add each one from Studio with its price shown before you confirm.",
  cta: "Start your agency account",
  note: TRIAL_TERMS,
  relatedTitle: "The rest of the white-label program",
  related: [
    {
      href: "/white-label",
      label: "Program overview",
      blurb: "What you sell, what Rankbox does, and onboarding a client.",
    },
    {
      href: "/white-label/content-writing",
      label: "Content writing",
      blurb: "How each client's articles are researched, written and reviewed.",
    },
    {
      href: "/white-label/ai-seo",
      label: "AI SEO",
      blurb: "AI search visibility as its own service line.",
    },
  ],
  single: {
    lead: "Running one site?",
    label: "See the plan on the pricing page",
    href: "/pricing",
  },
};

/** Every internal link the page's copy renders, for the page test and ExploreMore. */
export const LINKED: string[] = [
  "/white-label",
  "/pricing",
  ...PACKAGING.across.links.map((l) => l.href),
  PACKAGING.guarantee.link.href,
  ...BILLING.docs.map((d) => d.href),
  ...CLOSING.related.map((r) => r.href),
].filter((v, i, all) => all.indexOf(v) === i);
