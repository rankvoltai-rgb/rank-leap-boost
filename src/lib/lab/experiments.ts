/**
 * Rankbox lab: the live experiments behind the Backlink Fuel studies in
 * docs/content-roadmap.md. Pure data and helpers only, so tests and both the
 * server entry and the /lab routes can import it without pulling in Supabase.
 *
 * - C1 (/lab/ref/<surface>): which AI apps pass a Referer header or a UTM tag
 *   when a person taps a link, and how GA4 files the visit.
 * - B3 (/lab/render/<variant>): which crawlers and fetchers run JavaScript,
 *   read shadow DOM, JSON-LD or <noscript>, or ask for Markdown. Every variant
 *   carries its own canary phrase, so an AI answer that repeats a phrase shows
 *   which delivery method reached the model.
 * - B5 (/lab/facts/<n>): 100 fictional product pages, odd ones with JSON-LD and
 *   even ones HTML only, to compare how accurately AI answers extract facts.
 * - B6: first crawl of new blog posts announced through IndexNow against posts
 *   left to the sitemap (see planIndexNow in indexnow.server.ts).
 *
 * Every lab page is noindex and labeled as a test. B5 products are fictional.
 */

export type Experiment = "c1" | "b3" | "b5" | "b6";

/** Which experiment a request path belongs to, or null for non-lab pages. */
export function experimentForPath(path: string): Experiment | null {
  if (path.startsWith("/lab/ref/")) return "c1";
  if (path === "/lab/render" || path.startsWith("/lab/render/")) return "b3";
  if (path === "/lab/facts" || path.startsWith("/lab/facts/")) return "b5";
  if (path.startsWith("/blog/")) return "b6";
  return null;
}

/* ------------------------------------------------------------------ */
/* Bots                                                                */
/* ------------------------------------------------------------------ */

/**
 * User-agent tokens logged on blog pages, taken from the vendor docs listed in
 * /blog/ai-crawler-directory. Order matters: the first match names the bot, so
 * the more specific tokens come before the general ones they contain.
 */
export const BOT_TOKENS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "OAI-AdsBot",
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  "Perplexity-User",
  "PerplexityBot",
  "Google-CloudVertexBot",
  "Google-Agent",
  "Google-GeminiNotebook",
  "GoogleOther",
  "Googlebot",
  "Applebot",
  "bingbot",
  "DuckAssistBot",
  "DuckDuckBot",
  "meta-externalagent",
  "meta-externalfetcher",
  "meta-webindexer",
  "Amzn-SearchBot",
  "Amzn-User",
  "Amazonbot",
  "MistralAI-User",
  "MistralAI-Index",
  "MistralAI-Training",
  "YouBot",
  "CCBot",
  "Bytespider",
  "YandexBot",
] as const;

const BOT_PATTERN = new RegExp(
  BOT_TOKENS.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"),
  "i",
);

/** The documented bot a user agent claims to be, or null. A claim, not proof. */
export function botFromUserAgent(ua: string | null | undefined): string | null {
  if (!ua) return null;
  const hit = ua.match(BOT_PATTERN);
  if (!hit) return null;
  return BOT_TOKENS.find((t) => t.toLowerCase() === hit[0].toLowerCase()) ?? hit[0];
}

/* ------------------------------------------------------------------ */
/* C1: referrer test surfaces                                          */
/* ------------------------------------------------------------------ */

/** The app surfaces to test, one link each. Any lowercase token is accepted. */
export const C1_SURFACES = [
  "chatgpt-web",
  "chatgpt-mac",
  "chatgpt-windows",
  "chatgpt-ios",
  "chatgpt-android",
  "perplexity-web",
  "perplexity-ios",
  "perplexity-android",
  "gemini-web",
  "gemini-ios",
  "gemini-android",
  "claude-web",
  "claude-desktop",
  "claude-ios",
  "copilot-web",
  "copilot-ios",
  "google-ai-mode",
] as const;

export const SURFACE_TOKEN = /^[a-z0-9-]{1,40}$/;

/* ------------------------------------------------------------------ */
/* B3: render variants                                                 */
/* ------------------------------------------------------------------ */

export interface RenderVariant {
  slug: string;
  label: string;
  /** How the canary phrase reaches the page. */
  how: string;
  /** The phrase only this delivery method carries. */
  phrase: string;
}

export const RENDER_VARIANTS: RenderVariant[] = [
  {
    slug: "ssr",
    label: "Server-rendered HTML",
    how: "In the HTML the server sends.",
    phrase: "amber-heron-4127",
  },
  {
    slug: "csr",
    label: "Client-side JavaScript",
    how: "Added by a script when the page loads.",
    phrase: "cobalt-lynx-8052",
  },
  {
    slug: "csr-delayed",
    label: "Delayed JavaScript",
    how: "Added by a script three seconds after load.",
    phrase: "saffron-marten-3391",
  },
  {
    slug: "fetch",
    label: "JavaScript fetch",
    how: "Fetched as JSON by a script, then added.",
    phrase: "juniper-ibis-6704",
  },
  {
    slug: "shadow-dom",
    label: "Shadow DOM from JavaScript",
    how: "Inside a shadow root a script attaches.",
    phrase: "garnet-tapir-2268",
  },
  {
    slug: "declarative-shadow",
    label: "Declarative shadow DOM",
    how: "Inside a <template shadowrootmode> in the HTML.",
    phrase: "indigo-plover-5913",
  },
  {
    slug: "noscript",
    label: "noscript fallback",
    how: "Inside a <noscript> element.",
    phrase: "russet-okapi-7485",
  },
  {
    slug: "hidden",
    label: "Hidden text",
    how: "In the HTML, styled display:none.",
    phrase: "pewter-gecko-1836",
  },
  {
    slug: "json-ld",
    label: "JSON-LD only",
    how: "Only in the page's JSON-LD, never visible.",
    phrase: "coral-bison-9540",
  },
  {
    slug: "markdown",
    label: "Markdown by content negotiation",
    how: "Served only to clients that send Accept: text/markdown.",
    phrase: "sage-wombat-4079",
  },
];

/** On the markdown variant, the phrase a plain HTML request sees instead. */
export const MARKDOWN_HTML_PHRASE = "slate-curlew-6621";

export function renderVariant(slug: string): RenderVariant | undefined {
  return RENDER_VARIANTS.find((v) => v.slug === slug);
}

/* ------------------------------------------------------------------ */
/* B5: fictional products                                              */
/* ------------------------------------------------------------------ */

export const FACT_PAGES = 100;

export interface LabProduct {
  id: number;
  /** Odd ids carry JSON-LD as well as HTML; even ids are HTML only. */
  arm: "jsonld" | "html";
  name: string;
  model: string;
  category: string;
  color: string;
  priceUsd: number;
  weightGrams: number;
  releaseDate: string;
  /** Stated only in JSON-LD, and only on the jsonld arm. */
  warrantyMonths: number;
}

const CATEGORIES = [
  "kettle",
  "desk lamp",
  "backpack",
  "headphones",
  "office chair",
  "blender",
  "tent",
  "monitor stand",
  "coffee grinder",
  "rain jacket",
];
const COLORS = [
  "teal",
  "ochre",
  "charcoal",
  "sand",
  "crimson",
  "olive",
  "slate blue",
  "ivory",
  "plum",
  "rust",
];
const WARRANTIES = [6, 12, 18, 24, 36];

/** Small seeded PRNG, so every product is the same on every request. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function labProduct(id: number): LabProduct | undefined {
  if (!Number.isInteger(id) || id < 1 || id > FACT_PAGES) return undefined;
  const rand = mulberry32(id * 7919);
  const pick = <T>(list: readonly T[]) => list[Math.floor(rand() * list.length)];
  const category = pick(CATEGORIES);
  const color = pick(COLORS);
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const code = Array.from({ length: 3 }, () => letters[Math.floor(rand() * letters.length)]).join(
    "",
  );
  const month = 1 + Math.floor(rand() * 20); // Jan 2025 to Aug 2026
  const day = 1 + Math.floor(rand() * 28);
  const year = month > 12 ? 2026 : 2025;
  const mm = String(month > 12 ? month - 12 : month).padStart(2, "0");
  const n = String(id).padStart(3, "0");
  return {
    id,
    arm: id % 2 === 1 ? "jsonld" : "html",
    name: `Lab Item ${n} ${category.replace(/\b\w/g, (c) => c.toUpperCase())}`,
    model: `RBX-${n}-${code}`,
    category,
    color,
    priceUsd: Math.round((19 + rand() * 480) * 100) / 100,
    weightGrams: 120 + Math.floor(rand() * 4680),
    releaseDate: `${year}-${mm}-${String(day).padStart(2, "0")}`,
    warrantyMonths: pick(WARRANTIES),
  };
}

/* ------------------------------------------------------------------ */
/* B6: IndexNow trial arms                                             */
/* ------------------------------------------------------------------ */

export type TrialArm = "indexnow" | "sitemap";

/** Days a sitemap-arm post is held back from IndexNow before it's sent anyway. */
export const TRIAL_HOLD_DAYS = 28;

/** Stable 50/50 split by URL (FNV-1a), so a post never changes arm. */
export function trialArm(url: string): TrialArm {
  let h = 0x811c9dc5;
  for (let i = 0; i < url.length; i++) {
    h ^= url.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h % 2 === 0 ? "indexnow" : "sitemap";
}

/** Only new blog posts join the trial; other pages are announced as usual. */
export function isTrialUrl(url: string): boolean {
  try {
    const path = new URL(url).pathname;
    return /^\/blog\/[a-z0-9-]+$/.test(path);
  } catch {
    return false;
  }
}
