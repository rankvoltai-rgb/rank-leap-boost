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
 * Within an account it is kept per SITE, like the real schema: the primary
 * site from onboarding, plus any Studio sites, each with its own settings,
 * credits, articles, keywords and keys. The subscription is the account's.
 *
 * Nothing here touches Supabase. Real mode is unaffected.
 */
import { TrialRequiredError } from "@/lib/errors";
import { composeStyleBrief } from "@/lib/style-brief";
import { DASHBOARD_IDEAS, TRACKED_KEYWORDS } from "@/lib/site-meta";
import { STUDIO } from "@/data/pricing";
import {
  allowanceFor,
  allowanceShare,
  monthlyTotal,
  periodRemaining,
  STUDIO_BLOCK_COPY,
  studioBlockFor,
} from "@/lib/studio";
import type { StudioQuote } from "@/lib/studio.server";
import { normalizeDomain } from "@/lib/exchange/domain";
import { getSessionUser } from "./auth";
import type {
  Blog,
  BlogStatus,
  ContentSettings,
  CreditAccount,
  Keyword,
  Site,
  SiteDetails,
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

/** Everything one site owns. */
interface MockSite {
  site: Site;
  settings: ContentSettings | null;
  credits: CreditAccount;
  blogs: Blog[];
  keywords: Keyword[];
  apiKeys: MockApiKey[];
}

interface MockState {
  sites: MockSite[];
  subscription: Subscription | null;
  onboarding: OnboardingDraft | null;
  entitlement: Entitlement;
}

/** The single-site shape saved before Studio. Read once and converted. */
interface LegacyState {
  profile: Omit<Site, "kind" | "status" | "billed_from" | "removes_at" | "archived_at"> | null;
  settings: ContentSettings | null;
  credits: CreditAccount;
  subscription: Subscription | null;
  blogs: Blog[];
  keywords: Keyword[];
  onboarding: OnboardingDraft | null;
  entitlement: Entitlement;
  apiKeys?: MockApiKey[];
}

function emptyState(): MockState {
  return {
    // Empty until onboarding writes the first site — so a fresh account is genuinely empty.
    sites: [],
    subscription: null,
    onboarding: null,
    entitlement: { trialStartedAt: null, trialEndsAt: null },
  };
}

function fromLegacy(old: LegacyState): MockState {
  const sites: MockSite[] = [];
  if (old.profile) {
    const siteId = old.profile.id;
    sites.push({
      site: {
        ...old.profile,
        kind: "primary",
        status: "active",
        billed_from: null,
        removes_at: null,
        archived_at: null,
        created_at: (old.profile as Partial<Site>).created_at ?? nowIso(),
      },
      settings: old.settings ? { ...old.settings, site_id: siteId } : null,
      credits: { ...old.credits, site_id: siteId },
      blogs: (old.blogs ?? []).map((b) => ({ ...b, site_id: siteId })),
      keywords: (old.keywords ?? []).map((k) => ({ ...k, site_id: siteId })),
      apiKeys: old.apiKeys ?? [],
    });
  }
  return {
    sites,
    subscription: old.subscription ? { ...old.subscription, studio_sites: 0 } : null,
    onboarding: old.onboarding,
    entitlement: old.entitlement,
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
      if (raw) {
        const parsed = JSON.parse(raw) as MockState | LegacyState;
        state = "sites" in parsed ? parsed : fromLegacy(parsed);
      }
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

/** One site's slice, or undefined when the id isn't one of this account's. */
function slice(state: MockState, siteId: string): MockSite | undefined {
  return state.sites.find((s) => s.site.id === siteId);
}

function primary(state: MockState): MockSite | undefined {
  return state.sites.find((s) => s.site.kind === "primary");
}

/** The slice holding a row with this id, whichever site it's on. */
function sliceWithBlog(state: MockState, id: string): MockSite | undefined {
  return state.sites.find((s) => s.blogs.some((b) => b.id === id));
}

function freshCredits(siteId: string, total: number): CreditAccount {
  return {
    id: uid("credits"),
    user_id: currentUserId(),
    site_id: siteId,
    credits_used: 0,
    credits_total: total,
  };
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
    sites: [
      {
        site: { ...MOCK_PROFILE, user_id },
        settings: { ...MOCK_SETTINGS, user_id },
        credits: { ...MOCK_CREDITS, user_id },
        blogs: MOCK_BLOGS.map((b) => ({ ...b, user_id })),
        keywords: MOCK_KEYWORDS.map((k) => ({ ...k, user_id })),
        apiKeys: [],
      },
    ],
    subscription: null,
    onboarding: null,
    entitlement: { trialStartedAt: null, trialEndsAt: null },
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

/**
 * Part 3 confirm: writes the site the dashboard then reads. Onboarding passes
 * no site and gets the primary; Studio passes the site it has just added.
 * Onboarding's own draft is read from the store, where every change was
 * saved; Studio hands its draft in.
 */
export async function commitOnboarding(draft?: OnboardingDraft, siteId?: string): Promise<string> {
  let committed = "";
  mutate((s) => {
    const d = siteId ? draft : (s.onboarding ?? draft);
    if (!d) return;
    const user_id = currentUserId();
    let target = siteId ? slice(s, siteId) : primary(s);
    if (!target) {
      const id = uid("site");
      target = {
        site: {
          id,
          user_id,
          kind: "primary",
          status: "active",
          billed_from: null,
          removes_at: null,
          archived_at: null,
          created_at: nowIso(),
          brand_name: null,
          website_url: null,
          product_description: null,
          avatar_url: null,
        },
        settings: null,
        credits: freshCredits(id, MOCK_CREDITS.credits_total),
        blogs: [],
        keywords: [],
        apiKeys: [],
      };
      s.sites.push(target);
    }
    const site_id = target.site.id;
    target.site = {
      ...target.site,
      brand_name: d.brandName,
      website_url: d.url,
      product_description: d.description,
      avatar_url: d.logoUrl,
    };
    target.settings = {
      ...MOCK_SETTINGS,
      id: target.settings?.id ?? uid("settings"),
      user_id,
      site_id,
      tone: d.brandTone || MOCK_SETTINGS.tone,
      audience: d.audience || MOCK_SETTINGS.audience,
      brand_voice: `Niche: ${d.niche}. Geo: ${d.geo}.`,
      // Stays off until the trial starts — mirrors the phase-2 default flip.
      autopilot_enabled: target.settings?.autopilot_enabled ?? false,
    };
    target.keywords = d.keywords.map((k, i) => ({
      id: `${k.id}-${site_id}`,
      user_id,
      site_id,
      name: k.name,
      tag: k.intent,
      search_volume: k.search_volume,
      traffic_estimate: Math.round(k.search_volume * 0.14),
      intent: k.intent,
      trend: k.trend,
      source: i < TRACKED_KEYWORDS ? "library" : "discovered",
      created_at: nowIso(),
    }));
    target.blogs = d.titles.map((t, i) => ({
      id: `${t.id}-${site_id}`,
      user_id,
      site_id,
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
    if (!siteId && s.onboarding)
      s.onboarding = { ...s.onboarding, step: "done", confirmedAt: nowIso() };
    committed = site_id;
  });
  return delay(committed, 500);
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
      current_period_start: started.toISOString(),
      current_period_end: ends.toISOString(),
      cancel_at_period_end: false,
      studio_sites: 0,
      environment: "sandbox",
      created_at: started.toISOString(),
    };
    const first = primary(s);
    if (first?.settings) first.settings.autopilot_enabled = true;
  });
  return delay(load().entitlement, 700);
}

/* ------------------------------------------------------------------ */
/* Sites                                                               */
/* ------------------------------------------------------------------ */

export async function listSites(): Promise<Site[]> {
  return delay(load().sites.map((s) => ({ ...s.site })));
}

export async function getSite(siteId: string): Promise<Site | null> {
  const found = slice(load(), siteId);
  return delay(found ? { ...found.site } : null);
}

export async function updateSite(siteId: string, patch: Partial<SiteDetails>): Promise<void> {
  mutate((s) => {
    const found = slice(s, siteId);
    if (found) found.site = { ...found.site, ...patch };
  });
  return delay(undefined, 200);
}

export async function listCreditAccounts(): Promise<CreditAccount[]> {
  return delay(load().sites.map((s) => ({ ...s.credits })));
}

export async function listBlogStatuses(): Promise<
  Array<Pick<Blog, "site_id" | "status" | "updated_at">>
> {
  return delay(
    load().sites.flatMap((s) =>
      s.blogs.map((b) => ({ site_id: b.site_id, status: b.status, updated_at: b.updated_at })),
    ),
  );
}

export async function listAllSettings(): Promise<ContentSettings[]> {
  return delay(load().sites.flatMap((s) => (s.settings ? [{ ...s.settings }] : [])));
}

/** The primary site's brand, for mock features that keep one state per account. */
export async function getPrimarySite(): Promise<Site | null> {
  const first = primary(load());
  return delay(first ? { ...first.site } : null);
}

export async function getPrimarySettings(): Promise<ContentSettings | null> {
  return delay(primary(load())?.settings ?? null);
}

export async function listPrimaryKeywords(source?: "library" | "discovered"): Promise<Keyword[]> {
  const all = primary(load())?.keywords ?? [];
  return delay(source ? all.filter((k) => k.source === source) : [...all]);
}

/* ------------------------------------------------------------------ */
/* api.ts surface                                                      */
/* ------------------------------------------------------------------ */

export async function getSettings(siteId: string): Promise<ContentSettings | null> {
  return delay(slice(load(), siteId)?.settings ?? null);
}

export async function getCredits(siteId: string): Promise<CreditAccount | null> {
  return delay(slice(load(), siteId)?.credits ?? null);
}

export async function getSubscription(): Promise<Subscription | null> {
  return delay(load().subscription);
}

export async function listBlogs(siteId: string, status?: BlogStatus): Promise<Blog[]> {
  const all = slice(load(), siteId)?.blogs ?? [];
  // A fresh array every read: the store mutates its own in place, and handing
  // that out would let React Query see "nothing changed" after a write.
  return delay(status ? all.filter((b) => b.status === status) : [...all]);
}

export async function getBlog(id: string): Promise<Blog | null> {
  const s = load();
  return delay(sliceWithBlog(s, id)?.blogs.find((b) => b.id === id) ?? null);
}

export async function listKeywords(
  siteId: string,
  source?: "library" | "discovered",
): Promise<Keyword[]> {
  const all = slice(load(), siteId)?.keywords ?? [];
  return delay(source ? all.filter((k) => k.source === source) : [...all]);
}

export async function updateBlog(id: string, patch: Partial<Blog>): Promise<void> {
  mutate((s) => {
    const site = sliceWithBlog(s, id);
    if (!site) return;
    const i = site.blogs.findIndex((b) => b.id === id);
    site.blogs[i] = { ...site.blogs[i], ...patch, updated_at: nowIso() };
  });
  return delay(undefined, 180);
}

export async function deleteBlog(id: string): Promise<void> {
  mutate((s) => {
    const site = sliceWithBlog(s, id);
    if (site) site.blogs = site.blogs.filter((b) => b.id !== id);
  });
  return delay(undefined, 180);
}

export async function createBlog(siteId: string, blog: Partial<Blog>): Promise<Blog> {
  const row: Blog = {
    id: uid("blog"),
    user_id: currentUserId(),
    site_id: siteId,
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
    slice(s, siteId)?.blogs.unshift(row);
  });
  return delay(row, 200);
}

export async function prioritizeBlog(_siteId: string, id: string): Promise<void> {
  return updateBlog(id, { queue_position: 1 });
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
  siteId: string,
  name: string,
  source: "library" | "discovered" = "library",
  extra: Partial<Keyword> = {},
): Promise<Keyword> {
  const row: Keyword = {
    id: uid("kw"),
    user_id: currentUserId(),
    site_id: siteId,
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
    slice(s, siteId)?.keywords.push(row);
  });
  return delay(row, 180);
}

export async function deleteKeyword(id: string): Promise<void> {
  mutate((s) => {
    for (const site of s.sites) site.keywords = site.keywords.filter((k) => k.id !== id);
  });
  return delay(undefined, 180);
}

export async function updateSettings(
  siteId: string,
  patch: Partial<ContentSettings>,
): Promise<void> {
  mutate((s) => {
    const found = slice(s, siteId);
    if (found?.settings) found.settings = { ...found.settings, ...patch };
  });
  return delay(undefined, 200);
}

export async function updateAutopilot(
  siteId: string,
  patch: {
    autopilot_enabled?: boolean;
    weekly_cadence?: number;
  },
): Promise<void> {
  return updateSettings(siteId, patch);
}

/** Brand context for the writer, mirroring loadStyleContext in ai.functions.ts. */
function styleContext(site: MockSite): string {
  return composeStyleBrief({
    brand: site.site.brand_name,
    product: site.site.product_description,
    tone: site.settings?.tone,
    style: site.settings?.writing_style,
    audience: site.settings?.audience,
    voice: site.settings?.brand_voice,
  });
}

/**
 * Simulates a generation run.
 *
 * The trial check comes first and is the whole point of the gate: nothing is
 * written, and no credit is spent, until an entitlement exists. Phase 2 moves
 * this check server-side into generateBlogContent, because a client-side gate
 * is bypassable.
 */
export async function generateBlogArticle(siteId: string, blog: Blog): Promise<Blog> {
  if (!hasActiveTrial()) throw new TrialRequiredError();

  const site = slice(load(), siteId);
  if (!site) throw new Error("That site isn't on your account.");
  if (site.credits.credits_used >= site.credits.credits_total) {
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
        style: styleContext(site),
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
    const target = slice(st, siteId);
    if (!target) return;
    const i = target.blogs.findIndex((b) => b.id === blog.id);
    if (i >= 0) {
      target.blogs[i] = {
        ...target.blogs[i],
        status: "finished",
        title: article.title || target.blogs[i].title,
        body,
        description: article.description || target.blogs[i].description,
        tags: article.tags.length ? article.tags : target.blogs[i].tags,
        seo_score: article.seo_score,
        traffic_estimate: article.traffic_estimate || target.blogs[i].traffic_estimate,
        updated_at: nowIso(),
      };
    }
    target.credits = { ...target.credits, credits_used: target.credits.credits_used + 1 };
  });

  return (await getBlog(blog.id)) as Blog;
}

/* ---------- Studio (mock billing) ---------- */

/**
 * Mock Studio follows the real rules — a paid plan, a prorated first period,
 * removals that run to the period's end — without Stripe: the "charge" always
 * succeeds and the numbers are computed locally from the plan's prices.
 */
function mockPeriod(sub: Subscription): { start: string; end: string } {
  const end = sub.current_period_end ?? new Date(Date.now() + 30 * 86_400_000).toISOString();
  const start =
    sub.current_period_start ?? new Date(Date.parse(end) - 30 * 86_400_000).toISOString();
  return { start, end };
}

function billedStudioSites(s: MockState): number {
  return s.sites.filter(
    (x) => x.site.kind === "studio" && x.site.status === "active" && !x.site.removes_at,
  ).length;
}

export async function getStudioQuote(): Promise<StudioQuote> {
  const s = load();
  const sub = s.subscription;
  const studioSites = billedStudioSites(s);
  const block = studioBlockFor(sub);
  const base: StudioQuote = {
    block,
    message: block ? STUDIO_BLOCK_COPY[block] : null,
    pricePerSite: STUDIO.monthlyPerSite,
    dueToday: null,
    prorationDate: null,
    renewsAt: null,
    allowance: allowanceFor(1),
    studioSites,
    monthlyAfter: monthlyTotal(studioSites + 1),
    card: { brand: "visa", last4: "4242" },
  };
  if (block || !sub) return delay(base, 400);
  const { start, end } = mockPeriod(sub);
  const share = periodRemaining(start, end);
  return delay(
    {
      ...base,
      dueToday: Math.round(STUDIO.monthlyPerSite * share * 100) / 100,
      prorationDate: Math.floor(Date.now() / 1000),
      renewsAt: end,
      allowance: allowanceFor(share),
    },
    400,
  );
}

function requireMockStudio(s: MockState): Subscription {
  const block = studioBlockFor(s.subscription);
  if (block) throw new Error(STUDIO_BLOCK_COPY[block]);
  return s.subscription as Subscription;
}

function grantStudioAllowance(target: MockSite, sub: Subscription) {
  const { start, end } = mockPeriod(sub);
  const share = allowanceShare(target.site, start, end);
  target.credits = freshCredits(target.site.id, allowanceFor(share).articles);
}

export async function addStudioSite(data: {
  url: string;
  brandName: string;
  description: string;
  logoUrl: string | null;
}): Promise<{ siteId: string }> {
  const s = load();
  const sub = requireMockStudio(s);
  const domain = normalizeDomain(data.url);
  if (!domain) throw new Error("Enter the site's address, like example.com.");
  const clash = s.sites.find(
    (x) => x.site.website_url && normalizeDomain(x.site.website_url) === domain,
  );
  if (clash) {
    throw new Error(
      clash.site.status === "archived"
        ? `${domain} is in your archived sites. Restore it from Studio to keep its articles.`
        : `${domain} is already one of your sites.`,
    );
  }
  const id = uid("site");
  mutate((st) => {
    const target: MockSite = {
      site: {
        id,
        user_id: currentUserId(),
        kind: "studio",
        status: "active",
        billed_from: nowIso(),
        removes_at: null,
        archived_at: null,
        created_at: nowIso(),
        brand_name: data.brandName,
        website_url: data.url,
        product_description: data.description,
        avatar_url: data.logoUrl,
      },
      settings: null,
      credits: freshCredits(id, 0),
      blogs: [],
      keywords: [],
      apiKeys: [],
    };
    grantStudioAllowance(target, sub);
    st.sites.push(target);
    if (st.subscription) st.subscription.studio_sites = billedStudioSites(st);
  });
  return delay({ siteId: id }, 1200);
}

export async function restoreStudioSite(data: { siteId: string }): Promise<{ siteId: string }> {
  const s = load();
  const sub = requireMockStudio(s);
  mutate((st) => {
    const target = slice(st, data.siteId);
    if (!target || target.site.kind !== "studio" || target.site.status !== "archived") {
      throw new Error("Only an archived Studio site can be restored.");
    }
    target.site = {
      ...target.site,
      status: "active",
      billed_from: nowIso(),
      removes_at: null,
      archived_at: null,
    };
    grantStudioAllowance(target, sub);
    if (st.subscription) st.subscription.studio_sites = billedStudioSites(st);
  });
  return delay({ siteId: data.siteId }, 1200);
}

export async function removeStudioSite(data: { siteId: string }): Promise<{ removesAt: string }> {
  const s = load();
  const end = s.subscription
    ? mockPeriod(s.subscription).end
    : new Date(Date.now() + 86_400_000).toISOString();
  mutate((st) => {
    const target = slice(st, data.siteId);
    if (!target || target.site.kind !== "studio") {
      throw new Error("This site is your plan itself. To stop it, cancel your plan in billing.");
    }
    target.site = { ...target.site, removes_at: end };
    if (st.subscription) st.subscription.studio_sites = billedStudioSites(st);
  });
  return delay({ removesAt: end }, 700);
}

export async function keepStudioSite(data: { siteId: string }): Promise<{ ok: true }> {
  mutate((st) => {
    const target = slice(st, data.siteId);
    if (target) target.site = { ...target.site, removes_at: null };
    if (st.subscription) st.subscription.studio_sites = billedStudioSites(st);
  });
  return delay({ ok: true as const }, 700);
}

/** Converts the mock trial to a paid plan on the spot, as ending a real trial would. */
export async function activatePlanNow(): Promise<{ status: string }> {
  mutate((st) => {
    if (!st.subscription || st.subscription.status !== "trialing") return;
    const start = new Date();
    const end = new Date(start.getTime() + 30 * 86_400_000);
    st.subscription = {
      ...st.subscription,
      status: "active",
      current_period_start: start.toISOString(),
      current_period_end: end.toISOString(),
    };
    st.entitlement = {
      trialStartedAt: st.entitlement.trialStartedAt,
      trialEndsAt: end.toISOString(),
    };
    const first = primary(st);
    if (first) first.credits = freshCredits(first.site.id, 30);
  });
  return delay({ status: load().subscription?.status ?? "active" }, 900);
}

/* ---------- publishing integration ---------- */

export async function listApiKeys(siteId: string): Promise<MockApiKey[]> {
  return delay(slice(load(), siteId)?.apiKeys ?? []);
}

export async function createApiKey(
  siteId: string,
  data: { name?: string } = {},
): Promise<{ id: string; raw: string; prefix: string }> {
  if (!hasActiveTrial())
    throw new TrialRequiredError("Start your free trial to connect your site.");
  const row = await connectIntegration(siteId, data.name?.trim() || "API key");
  return { id: row.id, raw: `${row.key_prefix}_mock_secret_shown_once`, prefix: row.key_prefix };
}

export async function revokeApiKey(data: { id: string }): Promise<void> {
  mutate((s) => {
    for (const site of s.sites) {
      site.apiKeys = site.apiKeys.map((k) =>
        k.id === data.id ? { ...k, revoked_at: nowIso() } : k,
      );
    }
  });
  return delay(undefined, 300);
}

/** Stands in for creating a publishing key on the integrations screen. */
export async function connectIntegration(siteId: string, name = "My site"): Promise<MockApiKey> {
  const row: MockApiKey = {
    id: uid("key"),
    name,
    key_prefix: "rv_live_" + Math.random().toString(36).slice(2, 8),
    last_used_at: null,
    revoked_at: null,
    created_at: nowIso(),
  };
  mutate((s) => {
    const found = slice(s, siteId);
    if (found) found.apiKeys = [row, ...found.apiKeys];
  });
  return delay(row, 600);
}
