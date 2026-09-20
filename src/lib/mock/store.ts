/**
 * In-memory mock data layer for VITE_MOCK_DATA=1.
 *
 * Implements the slice of the src/lib/api.ts surface the redesigned onboarding
 * and dashboard use, plus the capabilities phase 2 will make real
 * (site-metadata scrape, trial entitlement). State persists to localStorage so
 * a refresh keeps onboarding progress and the trial flag.
 *
 * State is kept per local account (see ./auth.ts): a new sign-up starts empty
 * and walks onboarding, while the demo account is seeded with a full dashboard.
 *
 * Nothing here touches Supabase. Real mode is unaffected.
 */
import { TrialRequiredError } from "@/lib/errors";
import { composeStyleBrief } from "@/lib/style-brief";
import { DASHBOARD_IDEAS, TRACKED_KEYWORDS } from "@/lib/site-meta";
import { getSessionUser } from "./auth";
import type {
  Blog,
  BlogStatus,
  ContentSettings,
  CreditAccount,
  Keyword,
  Profile,
  Subscription,
} from "@/lib/api";
import {
  MOCK_ANALYSIS,
  MOCK_BLOGS,
  MOCK_CREDITS,
  MOCK_DRAFT_KEYWORDS,
  MOCK_DRAFT_TITLES,
  MOCK_KEYWORDS,
  MOCK_PROFILE,
  MOCK_SETTINGS,
  MOCK_SITE_META,
  type DraftKeyword,
  type DraftTitle,
  type SiteMeta,
} from "./fixtures";

const STORAGE_PREFIX = "rankvolt.mock.v1";

/** The signed-in local account, or "guest" before sign-in. */
function currentUserId(): string {
  return getSessionUser()?.id ?? "guest";
}

function storageKey(): string {
  return `${STORAGE_PREFIX}:${currentUserId()}`;
}

export type OnboardingStep = 1 | 2 | 3 | "done";

export interface OnboardingDraft {
  step: OnboardingStep;
  url: string;
  brandName: string;
  description: string;
  logoUrl: string | null;
  /** From the name given at sign-up (firstNameOf); onboarding doesn't ask again. */
  firstName: string;
  niche: string;
  audience: string;
  brandTone: string;
  geo: string;
  services: string[];
  competitors: string[];
  semanticClusters: string[];
  aiVisibility: string[];
  missingOpportunities: string[];
  keywords: DraftKeyword[];
  /** The site `keywords` were analyzed for; a different URL re-runs Part 2. */
  analyzedUrl: string;
  titles: DraftTitle[];
  /** Set once Part 3 is confirmed. */
  confirmedAt: string | null;
}

export interface Entitlement {
  /** Mock stand-in for a `trialing`/`active` subscription row. */
  trialStartedAt: string | null;
  trialEndsAt: string | null;
}

/** Mirrors ApiKeyRow in src/lib/api-keys.functions.ts. */
export interface MockApiKey {
  id: string;
  name: string;
  key_prefix: string;
  last_used_at: string | null;
  revoked_at: string | null;
  created_at: string;
}

interface MockState {
  profile: Profile | null;
  settings: ContentSettings | null;
  credits: CreditAccount;
  subscription: Subscription | null;
  blogs: Blog[];
  keywords: Keyword[];
  onboarding: OnboardingDraft | null;
  entitlement: Entitlement;
  apiKeys: MockApiKey[];
}

function emptyState(): MockState {
  return {
    // Null until onboarding writes them — so a fresh account is genuinely empty.
    profile: null,
    settings: null,
    credits: { ...MOCK_CREDITS, user_id: currentUserId() },
    subscription: null,
    blogs: [],
    keywords: [],
    onboarding: null,
    entitlement: { trialStartedAt: null, trialEndsAt: null },
    apiKeys: [],
  };
}

/** Cached state for one account; a different signed-in account reloads. */
let cache: { key: string; state: MockState } | null = null;

function load(): MockState {
  const key = storageKey();
  if (cache?.key === key) return cache.state;
  let state = emptyState();
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) state = JSON.parse(raw) as MockState;
    } catch {
      /* unreadable — start empty */
    }
  }
  cache = { key, state };
  return state;
}

function replace(state: MockState) {
  cache = { key: storageKey(), state };
  save();
}

function save() {
  if (typeof window === "undefined" || !cache) return;
  try {
    window.localStorage.setItem(cache.key, JSON.stringify(cache.state));
  } catch {
    /* quota or private mode — mock still works in memory */
  }
}

/** Whether the signed-in account has any saved mock data yet. */
export function hasSavedState(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(storageKey()) !== null;
  } catch {
    return false;
  }
}

function mutate(fn: (s: MockState) => void) {
  const s = load();
  fn(s);
  save();
}

/** Simulated network latency so loading and skeleton states are exercisable. */
function delay<T>(value: T, ms = 260): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

/* ------------------------------------------------------------------ */
/* Reset                                                               */
/* ------------------------------------------------------------------ */

export function resetMock() {
  replace(emptyState());
}

/** Load the fully-populated demo account without walking onboarding. */
export function seedMockAccount() {
  const user_id = currentUserId();
  replace({
    profile: { ...MOCK_PROFILE, user_id },
    settings: { ...MOCK_SETTINGS, user_id },
    credits: { ...MOCK_CREDITS, user_id },
    subscription: null,
    blogs: MOCK_BLOGS.map((b) => ({ ...b, user_id })),
    keywords: MOCK_KEYWORDS.map((k) => ({ ...k, user_id })),
    onboarding: null,
    entitlement: { trialStartedAt: null, trialEndsAt: null },
    apiKeys: [],
  });
}

/* ------------------------------------------------------------------ */
/* Site metadata — phase 2 replaces this with a server-side scrape      */
/* ------------------------------------------------------------------ */

function normalizeUrl(raw: string): { url: string; domain: string } {
  const trimmed = raw.trim();
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const u = new URL(withScheme);
    return { url: u.origin, domain: u.hostname.replace(/^www\./, "") };
  } catch {
    return { url: withScheme, domain: trimmed.replace(/^www\./, "") };
  }
}

/** Title-cases the first label of the domain, the way the scraper's fallback will. */
function brandFromDomain(domain: string): string {
  const label = domain.split(".")[0] || domain;
  return label
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Deterministic monogram stand-in for a scraped logo. */
function monogramLogo(brand: string): string {
  const initial = (brand.trim()[0] || "R").toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="28" fill="#1877f2"/><text x="64" y="64" font-family="Sora, Poppins, sans-serif" font-size="62" font-weight="700" fill="#ffffff" text-anchor="middle" dominant-baseline="central">${initial}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export async function fetchSiteMeta(rawUrl: string): Promise<SiteMeta> {
  const { url, domain } = normalizeUrl(rawUrl);
  // The canned fixture stands in for the one domain the demo copy describes.
  if (domain === MOCK_SITE_META.domain) {
    return delay({ ...MOCK_SITE_META, logoUrl: monogramLogo(MOCK_SITE_META.brandName) }, 900);
  }
  const brandName = brandFromDomain(domain);
  return delay(
    {
      url,
      domain,
      brandName,
      title: `${brandName} — ${MOCK_SITE_META.title.split("—")[1]?.trim() ?? "Official site"}`,
      description: `${brandName} helps teams get more done. (Mock metadata — phase 2 reads this from the live page.)`,
      logoUrl: monogramLogo(brandName),
      faviconUrl: null,
      themeColor: "#1877f2",
      logoSource: "og:image",
      via: "mock",
    },
    900,
  );
}

/* ------------------------------------------------------------------ */
/* Analysis + forecast                                                 */
/* ------------------------------------------------------------------ */

export interface MockAnalysis {
  niche: string;
  services: string[];
  audience: string;
  geo: string;
  brand_tone: string;
  competitors: string[];
  existing_content: string;
  internal_linking: string;
  missing_opportunities: string[];
  semantic_clusters: string[];
  ai_visibility: string[];
  keywords: DraftKeyword[];
}

export async function analyzeSite(_url: string): Promise<MockAnalysis> {
  return delay(
    {
      ...MOCK_ANALYSIS,
      keywords: MOCK_DRAFT_KEYWORDS.map((k) => ({ ...k })),
    },
    2200,
  );
}

/**
 * Proposes titles for the confirmed keyword set.
 *
 * Estimates are derived from each keyword's volume rather than invented, so the
 * number shown has a stated basis: volume x an assumed capture rate that decays
 * down the queue. Phase 2 swaps the capture curve for measured data.
 */
export async function estimateTraffic(keywords: DraftKeyword[]): Promise<DraftTitle[]> {
  const byName = new Map(keywords.map((k) => [k.name, k]));
  const titles = MOCK_DRAFT_TITLES.map((t, i) => {
    const kw = byName.get(t.keyword);
    if (!kw) return { ...t };
    const captureRate = 0.3 * Math.pow(0.965, i);
    return {
      ...t,
      traffic_estimate: Math.max(40, Math.round(kw.search_volume * captureRate)),
    };
  });
  // Only propose titles whose keyword survived the user's edits in Part 2.
  const kept = titles.filter((t) => byName.has(t.keyword));
  return delay(kept.length >= 8 ? kept : titles, 1800);
}

/* ------------------------------------------------------------------ */
/* Onboarding draft                                                    */
/* ------------------------------------------------------------------ */

export function getOnboardingDraft(): OnboardingDraft | null {
  return load().onboarding;
}

export function saveOnboardingDraft(patch: Partial<OnboardingDraft>) {
  mutate((s) => {
    const base: OnboardingDraft = s.onboarding ?? {
      step: 1,
      url: "",
      brandName: "",
      description: "",
      logoUrl: null,
      firstName: "",
      niche: "",
      audience: "",
      brandTone: "",
      geo: "",
      services: [],
      competitors: [],
      semanticClusters: [],
      aiVisibility: [],
      missingOpportunities: [],
      keywords: [],
      analyzedUrl: "",
      titles: [],
      confirmedAt: null,
    };
    s.onboarding = { ...base, ...patch };
  });
}

/** Part 3 confirm: writes the account the dashboard then reads. */
export async function commitOnboarding(): Promise<void> {
  mutate((s) => {
    const d = s.onboarding;
    if (!d) return;
    s.profile = {
      id: "mock-profile-1",
      user_id: currentUserId(),
      brand_name: d.brandName,
      website_url: d.url,
      product_description: d.description,
      avatar_url: d.logoUrl,
    };
    s.settings = {
      ...MOCK_SETTINGS,
      tone: d.brandTone || MOCK_SETTINGS.tone,
      audience: d.audience || MOCK_SETTINGS.audience,
      brand_voice: `Niche: ${d.niche}. Geo: ${d.geo}.`,
      // Stays off until the trial starts — mirrors the phase-2 default flip.
      autopilot_enabled: false,
    };
    s.keywords = d.keywords.map((k, i) => ({
      id: k.id,
      user_id: currentUserId(),
      name: k.name,
      tag: k.intent,
      search_volume: k.search_volume,
      traffic_estimate: Math.round(k.search_volume * 0.14),
      intent: k.intent,
      trend: k.trend,
      source: i < TRACKED_KEYWORDS ? "library" : "discovered",
      created_at: nowIso(),
    }));
    s.blogs = d.titles.map((t, i) => ({
      id: t.id,
      user_id: currentUserId(),
      title: t.title,
      description: t.description,
      body: "",
      status: (i < DASHBOARD_IDEAS ? "opportunity" : "scheduled") as BlogStatus,
      tags: [],
      keyword: t.keyword,
      seo_score: 0,
      traffic_estimate: t.traffic_estimate,
      competition: t.competition,
      ai_signal: t.ai_signal,
      scheduled_date:
        i < DASHBOARD_IDEAS
          ? null
          : new Date(Date.now() + (i - DASHBOARD_IDEAS + 1) * 86_400_000)
              .toISOString()
              .slice(0, 10),
      queue_position: i < DASHBOARD_IDEAS ? null : i - DASHBOARD_IDEAS + 1,
      notes: "",
      created_at: nowIso(),
      updated_at: nowIso(),
    }));
    s.onboarding = { ...d, step: "done", confirmedAt: nowIso() };
  });
  return delay(undefined, 500);
}

/* ------------------------------------------------------------------ */
/* Entitlement (mock trial)                                            */
/* ------------------------------------------------------------------ */

export const TRIAL_DAYS = 7;

export function getEntitlement(): Entitlement {
  return load().entitlement;
}

export function hasActiveTrial(): boolean {
  const e = load().entitlement;
  if (!e.trialEndsAt) return false;
  return new Date(e.trialEndsAt).getTime() > Date.now();
}

export async function startTrial(): Promise<Entitlement> {
  mutate((s) => {
    const started = new Date();
    const ends = new Date(started.getTime() + TRIAL_DAYS * 86_400_000);
    s.entitlement = {
      trialStartedAt: started.toISOString(),
      trialEndsAt: ends.toISOString(),
    };
    s.subscription = {
      id: "mock-sub-1",
      user_id: currentUserId(),
      status: "trialing",
      price_id: "business_monthly",
      product_id: "prod_mock",
      current_period_end: ends.toISOString(),
      cancel_at_period_end: false,
      environment: "sandbox",
      created_at: started.toISOString(),
    };
    if (s.settings) s.settings.autopilot_enabled = true;
  });
  return delay(load().entitlement, 700);
}

/* ------------------------------------------------------------------ */
/* api.ts surface                                                      */
/* ------------------------------------------------------------------ */

export async function getProfile(): Promise<Profile | null> {
  return delay(load().profile);
}

export async function getSettings(): Promise<ContentSettings | null> {
  return delay(load().settings);
}

export async function getCredits(): Promise<CreditAccount | null> {
  return delay(load().credits);
}

export async function getSubscription(): Promise<Subscription | null> {
  return delay(load().subscription);
}

export async function listBlogs(status?: BlogStatus): Promise<Blog[]> {
  const all = load().blogs;
  // A fresh array every read: the store mutates its own in place, and handing
  // that out would let React Query see "nothing changed" after a write.
  return delay(status ? all.filter((b) => b.status === status) : [...all]);
}

export async function getBlog(id: string): Promise<Blog | null> {
  return delay(load().blogs.find((b) => b.id === id) ?? null);
}

export async function listKeywords(source?: "library" | "discovered"): Promise<Keyword[]> {
  const all = load().keywords;
  return delay(source ? all.filter((k) => k.source === source) : [...all]);
}

export async function updateBlog(id: string, patch: Partial<Blog>): Promise<void> {
  mutate((s) => {
    const i = s.blogs.findIndex((b) => b.id === id);
    if (i >= 0) s.blogs[i] = { ...s.blogs[i], ...patch, updated_at: nowIso() };
  });
  return delay(undefined, 180);
}

export async function deleteBlog(id: string): Promise<void> {
  mutate((s) => {
    s.blogs = s.blogs.filter((b) => b.id !== id);
  });
  return delay(undefined, 180);
}

export async function createBlog(blog: Partial<Blog>): Promise<Blog> {
  const row: Blog = {
    id: uid("blog"),
    user_id: currentUserId(),
    title: blog.title ?? "Untitled",
    description: blog.description ?? "",
    body: blog.body ?? "",
    status: blog.status ?? "scheduled",
    tags: blog.tags ?? [],
    keyword: blog.keyword ?? null,
    seo_score: blog.seo_score ?? 0,
    traffic_estimate: blog.traffic_estimate ?? 0,
    competition: blog.competition ?? null,
    ai_signal: blog.ai_signal ?? 0,
    scheduled_date: blog.scheduled_date ?? null,
    queue_position: blog.queue_position ?? null,
    notes: blog.notes ?? "",
    created_at: nowIso(),
    updated_at: nowIso(),
  };
  mutate((s) => {
    s.blogs.unshift(row);
  });
  return delay(row, 200);
}

export async function prioritizeBlog(id: string): Promise<void> {
  mutate((s) => {
    const i = s.blogs.findIndex((b) => b.id === id);
    if (i >= 0) s.blogs[i] = { ...s.blogs[i], queue_position: 1, updated_at: nowIso() };
  });
  return delay(undefined, 180);
}

export async function addOpportunityToQueue(opp: Blog): Promise<number> {
  await updateBlog(opp.id, {
    status: "scheduled",
    scheduled_date: new Date(Date.now() + 86_400_000).toISOString().slice(0, 10),
    queue_position: 1,
  });
  return opp.traffic_estimate;
}

export async function addKeyword(
  name: string,
  source: "library" | "discovered" = "library",
  extra: Partial<Keyword> = {},
): Promise<Keyword> {
  const row: Keyword = {
    id: uid("kw"),
    user_id: currentUserId(),
    name,
    tag: extra.intent ?? null,
    search_volume: extra.search_volume ?? 0,
    traffic_estimate: extra.traffic_estimate ?? 0,
    intent: extra.intent ?? null,
    trend: extra.trend ?? "Medium",
    source,
    created_at: nowIso(),
  };
  mutate((s) => {
    s.keywords.push(row);
  });
  return delay(row, 180);
}

export async function deleteKeyword(id: string): Promise<void> {
  mutate((s) => {
    s.keywords = s.keywords.filter((k) => k.id !== id);
  });
  return delay(undefined, 180);
}

export async function updateSettings(patch: Partial<ContentSettings>): Promise<void> {
  mutate((s) => {
    if (s.settings) s.settings = { ...s.settings, ...patch };
  });
  return delay(undefined, 200);
}

export async function updateProfile(patch: Partial<Profile>): Promise<void> {
  mutate((s) => {
    if (s.profile) s.profile = { ...s.profile, ...patch };
  });
  return delay(undefined, 200);
}

export async function updateAutopilot(patch: {
  autopilot_enabled?: boolean;
  weekly_cadence?: number;
}): Promise<void> {
  return updateSettings(patch);
}

/**
 * Simulates a generation run.
 *
 * The trial check comes first and is the whole point of the gate: nothing is
 * written, and no credit is spent, until an entitlement exists. Phase 2 moves
 * this check server-side into generateBlogContent, because a client-side gate
 * is bypassable.
 */
/** Brand context for the writer, mirroring loadStyleContext in ai.functions.ts. */
function styleContext(state: MockState): string {
  return composeStyleBrief({
    brand: state.profile?.brand_name,
    product: state.profile?.product_description,
    tone: state.settings?.tone,
    style: state.settings?.writing_style,
    audience: state.settings?.audience,
    voice: state.settings?.brand_voice,
  });
}

export async function generateBlogArticle(blog: Blog): Promise<Blog> {
  if (!hasActiveTrial()) throw new TrialRequiredError();

  const s = load();
  if (s.credits.credits_used >= s.credits.credits_total) {
    throw new Error("You're out of article credits for this cycle.");
  }

  await updateBlog(blog.id, { status: "generating" });

  // The article is written for real, by the same server-side writer the live
  // paths use; only the row it lands in is local. The brand context travels
  // with the request because it lives in this store, not in a database.
  const { writeArticleDraft } = await import("@/lib/article.functions");
  let article;
  try {
    article = await writeArticleDraft({
      data: {
        title: blog.title,
        keyword: blog.keyword ?? "",
        description: blog.description ?? "",
        style: styleContext(s),
      },
    });
  } catch (err) {
    // Put the row back so the queue isn't left with a stuck "generating".
    await updateBlog(blog.id, { status: blog.status });
    throw err;
  }

  // Hosting is opt-in: when this member takes part in the exchange, the best
  // network target for this article gets its link, as the server would do.
  const { hostLinkForArticle } = await import("./exchange");
  const body = hostLinkForArticle({
    id: blog.id,
    title: article.title || blog.title,
    keyword: blog.keyword,
    tags: article.tags,
    body: article.body,
  });

  mutate((st) => {
    const i = st.blogs.findIndex((b) => b.id === blog.id);
    if (i >= 0) {
      st.blogs[i] = {
        ...st.blogs[i],
        status: "finished",
        title: article.title || st.blogs[i].title,
        body,
        description: article.description || st.blogs[i].description,
        tags: article.tags.length ? article.tags : st.blogs[i].tags,
        seo_score: article.seo_score,
        traffic_estimate: article.traffic_estimate || st.blogs[i].traffic_estimate,
        updated_at: nowIso(),
      };
    }
    st.credits = { ...st.credits, credits_used: st.credits.credits_used + 1 };
  });

  return (await getBlog(blog.id)) as Blog;
}

export async function purchaseCredits(
  _pkg: string,
  credits: number,
  _amountCents: number,
): Promise<void> {
  mutate((s) => {
    s.credits = { ...s.credits, credits_total: s.credits.credits_total + credits };
  });
  return delay(undefined, 300);
}

/* ---------- publishing integration ---------- */

export async function listApiKeys(): Promise<MockApiKey[]> {
  return delay(load().apiKeys ?? []);
}

export async function createApiKey(
  data: { name?: string } = {},
): Promise<{ id: string; raw: string; prefix: string }> {
  if (!hasActiveTrial())
    throw new TrialRequiredError("Start your free trial to connect your site.");
  const row = await connectIntegration(data.name?.trim() || "API key");
  return { id: row.id, raw: `${row.key_prefix}_mock_secret_shown_once`, prefix: row.key_prefix };
}

export async function revokeApiKey(data: { id: string }): Promise<void> {
  mutate((s) => {
    s.apiKeys = (s.apiKeys ?? []).map((k) =>
      k.id === data.id ? { ...k, revoked_at: nowIso() } : k,
    );
  });
  return delay(undefined, 300);
}

/** Stands in for creating a publishing key on the integrations screen. */
export async function connectIntegration(name = "My site"): Promise<MockApiKey> {
  const row: MockApiKey = {
    id: uid("key"),
    name,
    key_prefix: "rv_live_" + Math.random().toString(36).slice(2, 8),
    last_used_at: null,
    revoked_at: null,
    created_at: nowIso(),
  };
  mutate((s) => {
    s.apiKeys = [row, ...(s.apiKeys ?? [])];
  });
  return delay(row, 600);
}
