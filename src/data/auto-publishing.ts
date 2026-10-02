/**
 * /features/auto-publishing — every claim on the page that depends on what has
 * shipped, derived from the flags that say so.
 *
 * Publishing today: any site can pull finished articles through the public API
 * (/api/public/v1). The Webflow and Shopify connectors push articles server
 * side and the Framer plugin syncs them, but all three wait on their
 * marketplace's approval, so `addonLive` is false for each in platforms.ts.
 * The day a flag flips, that destination moves to "Available" here and every
 * sentence below (subhead, answer, FAQ) names it — nothing to rewrite by hand.
 *
 * Rules enforced by auto-publishing.test.ts: no destination reads as available
 * unless its flag says so, Wix is never named (the product doesn't publish to
 * it), and nothing promises a time of day, an approval queue, images, or
 * structured data, none of which the publishers send.
 */
import { PUBLISH_PLATFORMS, type PlatformId } from "@/data/platforms";
import { PLAN, TRIAL_ARTICLE_CREDITS, TRIAL_DAYS } from "@/data/pricing";

/* ---------- Pace ---------- */

/**
 * The paces the dashboard offers (Settings → Autopilot → Pace), in articles a
 * week. Mirrors PACES in dashboard.settings.tsx; the test reads that file so
 * the two can't drift.
 */
export const PACE_OPTIONS = [7, 5, 3, 2, 1] as const;

/** "Every day", "5 a week" — the dashboard's own button labels. */
export function paceOptionLabel(perWeek: number): string {
  return perWeek === 7 ? "Every day" : `${perWeek} a week`;
}

/* ---------- Destinations ---------- */

export type DestinationStage = "available" | "awaiting-approval" | "planned";

export interface Destination {
  id: PlatformId | "api";
  name: string;
  stage: DestinationStage;
  /** One line under the name: where it stands. */
  status: string;
  /** What it does once it's available, in plain words. */
  body: string;
}

/** Where each add-on stands while its `addonLive` flag is still false. */
const PRELAUNCH: Record<PlatformId, { stage: "awaiting-approval" | "planned"; store?: string }> = {
  webflow: { stage: "awaiting-approval", store: "Webflow Marketplace" },
  shopify: { stage: "awaiting-approval", store: "Shopify App Store" },
  framer: { stage: "awaiting-approval", store: "Framer Marketplace" },
  wordpress: { stage: "planned" },
  square: { stage: "planned" },
};

/** What each connector does, checked against src/lib/{webflow,shopify}/ and
 *  packages/plugins/framer. Planned ones say only that they're planned. */
const DOES: Record<PlatformId, string> = {
  webflow:
    "Pushes each article into the CMS collection you choose, live or as a draft, and records the live URL.",
  shopify:
    "Adds each article to your Shopify blog with its SEO description, excerpt, and tags, visible or hidden for review.",
  framer:
    "A plugin that syncs articles into a Framer CMS collection each time you run it. They go live when you publish the site.",
  wordpress:
    "A WordPress plugin is planned. Until it ships, a developer can connect a WordPress site through the API.",
  square: "A Square Online app is planned.",
};

export const API_DESTINATION: Destination = {
  id: "api",
  name: "Rankbox publishing API",
  stage: "available",
  status: "Available on every plan",
  body: "Your site pulls new and changed articles, gets each one as HTML and Markdown, and reports its live URL back. A developer connects it once with an API key.",
};

function stageOf(id: PlatformId, addonLive: boolean): DestinationStage {
  return addonLive ? "available" : PRELAUNCH[id].stage;
}

function statusOf(id: PlatformId, stage: DestinationStage): string {
  if (stage === "available") return "Available";
  if (stage === "planned") return "Planned";
  return `Awaiting ${PRELAUNCH[id].store} approval`;
}

const STAGE_ORDER: DestinationStage[] = ["available", "awaiting-approval", "planned"];

/** The API first, then the connectors: available, awaiting approval, planned. */
export const DESTINATIONS: Destination[] = [
  API_DESTINATION,
  ...PUBLISH_PLATFORMS.map((p): Destination => {
    const stage = stageOf(p.id, p.addonLive);
    return { id: p.id, name: p.name, stage, status: statusOf(p.id, stage), body: DOES[p.id] };
  }).sort((a, b) => STAGE_ORDER.indexOf(a.stage) - STAGE_ORDER.indexOf(b.stage)),
];

export function destinationsIn(stage: DestinationStage): Destination[] {
  return DESTINATIONS.filter((d) => d.stage === stage);
}

/** Connectors (not the API) a customer can install today. */
const LIVE_CONNECTORS = DESTINATIONS.filter((d) => d.id !== "api" && d.stage === "available");
const AWAITING = destinationsIn("awaiting-approval");
const PLANNED = destinationsIn("planned");

/** "A", "A and B", "A, B, and C". */
export function listNames(names: string[]): string {
  if (names.length <= 1) return names.join("");
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names.at(-1)}`;
}

const names = (ds: Destination[]) => listNames(ds.map((d) => d.name));

/* ---------- Sentences the page reuses ---------- */

/** How an article reaches a site, finishing "Rankbox writes each one, checks
 *  it, and …". */
export const DELIVERY_CLAUSE =
  LIVE_CONNECTORS.length === 0
    ? "delivers it through a publishing API that any stack can pull from"
    : `pushes it straight to ${names(LIVE_CONNECTORS)}, or to any other stack through the publishing API`;

/** Where the connectors stand, as one sentence. Empty once nothing waits. */
export const CONNECTOR_STATUS_SENTENCE =
  AWAITING.length === 0
    ? ""
    : `Native ${names(AWAITING)} ${AWAITING.length === 1 ? "connector is" : "connectors are"} built and awaiting marketplace approval.`;

export const ANSWER = {
  question: "What is Rankbox Auto-Publishing?",
  answer: [
    "Rankbox Auto-Publishing is the step that moves finished articles from Rankbox onto your website on a schedule.",
    `You choose a pace, from one article a week to one a day, up to ${PLAN.articlesPerMonth} a month on the ${PLAN.name} plan.`,
    `Each article is written, checked against Rankbox's SEO rules and revised where it fails, then ${
      LIVE_CONNECTORS.length === 0
        ? "made available to your site through the Rankbox publishing API, which any stack can pull from"
        : `pushed to ${names(LIVE_CONNECTORS)}, or made available to any other site through the Rankbox publishing API`
    }.`,
    CONNECTOR_STATUS_SENTENCE,
  ]
    .filter(Boolean)
    .join(" "),
};

/* ---------- What arrives ---------- */

export interface PayloadCell {
  sent: boolean;
  note: string;
}

export interface PayloadRow {
  field: string;
  api: PayloadCell;
  webflow: PayloadCell;
  shopify: PayloadCell;
}

const yes = (note: string): PayloadCell => ({ sent: true, note });
const no: PayloadCell = { sent: false, note: "Not sent" };

/** Checked against serializeArticle (public-api.server.ts) and the Webflow
 *  and Shopify mappers (src/lib/{webflow,shopify}/mapping.ts). */
export const PAYLOAD: PayloadRow[] = [
  { field: "Title", api: yes("title"), webflow: yes("Name field"), shopify: yes("Title") },
  {
    field: "URL slug",
    api: yes("slug, from the title"),
    webflow: yes("Kept once created"),
    shopify: yes("Handle"),
  },
  {
    field: "Article body",
    api: yes("HTML and Markdown"),
    webflow: yes("Rich text"),
    shopify: yes("HTML, video kept"),
  },
  {
    field: "Meta description",
    api: yes("description"),
    webflow: yes("Field you map"),
    shopify: yes("SEO description"),
  },
  { field: "Tags", api: yes("tags"), webflow: yes("Field you map"), shopify: yes("Tags") },
  {
    field: "Live or draft",
    api: yes("Your code decides"),
    webflow: yes("Live or draft"),
    shopify: yes("Visible or hidden"),
  },
  { field: "Images", api: no, webflow: no, shopify: no },
  { field: "Structured data", api: no, webflow: no, shopify: no },
];

export const PAYLOAD_NOTE =
  "Images and structured data aren't sent yet. The writer marks where an image belongs in the Rankbox editor, but those notes don't leave Rankbox, so add your own images in your CMS.";

/* ---------- API ---------- */

export const API_BASE = "/api/public/v1";

export const API_ENDPOINTS: { method: "GET" | "PATCH"; path: string; does: string }[] = [
  { method: "GET", path: "/ping", does: "Check the key and see which brand it belongs to" },
  {
    method: "GET",
    path: "/articles?since=",
    does: "Finished articles changed since your last sync, up to 100 per page, with a cursor for the next",
  },
  { method: "GET", path: "/articles/:id", does: "One article, in full" },
  { method: "PATCH", path: "/articles/:id", does: "Report the URL where the article went live" },
];

/* ---------- FAQ ---------- */

export const FAQS: { q: string; a: string }[] = [
  {
    q: "Which platforms can Rankbox publish to today?",
    a: [
      LIVE_CONNECTORS.length === 0
        ? "Today any site can receive articles through the Rankbox publishing API, which a developer connects once with an API key."
        : `Today Rankbox publishes to ${names(LIVE_CONNECTORS)}, and any other site can receive articles through the Rankbox publishing API.`,
      CONNECTOR_STATUS_SENTENCE,
      PLANNED.length > 0 ? `${names(PLANNED)} ${PLANNED.length === 1 ? "is" : "are"} planned.` : "",
    ]
      .filter(Boolean)
      .join(" "),
  },
  {
    q: "Can Rankbox auto-publish to WordPress?",
    a:
      DESTINATIONS.find((d) => d.id === "wordpress")?.stage === "available"
        ? "Yes. Install the Rankbox WordPress plugin, paste your API key, and finished articles arrive as posts."
        : "Not directly yet. A WordPress plugin is planned. Until it ships, a developer can connect any WordPress site to the Rankbox publishing API, which returns each article as HTML and Markdown with its title, slug, meta description, and tags.",
  },
  {
    q: "How often does Rankbox publish?",
    a: `As often as you set: every day, or 5, 3, 2, or 1 article a week. The ${PLAN.name} plan covers ${PLAN.articlesPerMonth} articles a month, which is about one a day, and autopilot stops when the month's articles are used. There's no time-of-day setting.`,
  },
  {
    q: "Can I review articles before they go live?",
    a: "Rankbox doesn't have an approval queue of its own yet. Every article sits in your Rankbox dashboard, where you can read and edit it. Through the API, nothing goes live until your site's code publishes it. The Webflow connector can send articles to drafts and the Shopify connector can add them hidden, so you can review them in your CMS first.",
  },
  {
    q: "What happens if I edit a published article in my CMS?",
    a: "Your edit stays. The Webflow and Shopify connectors keep a record of each post they create. If you edit or delete that post in your CMS, Rankbox leaves it alone from then on and never re-creates a post you deleted. A post's URL slug is also kept once it's created, so links to it don't break.",
  },
  {
    q: "Does Rankbox add images to published articles?",
    a: "No, not yet. Rankbox doesn't send images or a featured image. The writer marks where images belong in the Rankbox editor, but those notes don't leave Rankbox, so you can add your own images in your CMS.",
  },
  {
    q: "What does the Rankbox publishing API return?",
    a: `Each article comes back with an id, title, slug, meta description, body as both HTML and Markdown, tags, SEO score, the live URL once you report it, and timestamps. List articles with GET ${API_BASE}/articles?since= to fetch only what changed, and report where an article went live with PATCH ${API_BASE}/articles/:id. Requests use a per-site API key in the Authorization header.`,
  },
  {
    q: "Can I try auto-publishing before I pay?",
    a: `Yes. The ${TRIAL_DAYS}-day trial includes ${TRIAL_ARTICLE_CREDITS} articles and the publishing API. Checkout asks for a card, and you're charged when the trial ends unless you cancel.`,
  },
];
