/**
 * Data access for the redesigned onboarding and dashboard.
 *
 * Delegates to the in-memory mock (VITE_MOCK_DATA=1) or to the real Supabase
 * layer in src/lib/api.ts. Screens that have not been redesigned keep importing
 * `@/lib/api` directly and are unaffected by this module.
 *
 * Capabilities that do not exist server-side yet — draft persistence and trial
 * entitlement — are mock-only. In real mode they throw or no-op, which is the
 * seam phase 2 fills in. Onboarding's scan, content plan and commit are real in
 * both modes (mock mode commits to its local store).
 */
import * as real from "@/lib/api";
import * as mock from "@/lib/mock/store";
import * as mockAi from "@/lib/mock/ai";
import { IS_MOCK } from "@/lib/mock/mode";
import { getSessionUser } from "@/lib/auth";
import type {
  Blog,
  ContentSettings,
  CreditAccount,
  Keyword,
  Profile,
  Subscription,
} from "@/lib/api";
import type { DraftKeyword, DraftTitle } from "@/lib/mock/fixtures";
import type { ContentPlanInput, PlannedArticle, SiteAnalysis, SiteMeta } from "@/lib/site-meta";
import type { Entitlement, OnboardingDraft } from "@/lib/mock/store";

export { IS_MOCK };

export type { Blog, ContentSettings, CreditAccount, Keyword, Profile, Subscription };
export type {
  ContentPlanInput,
  DraftKeyword,
  DraftTitle,
  Entitlement,
  OnboardingDraft,
  PlannedArticle,
  SiteAnalysis,
  SiteMeta,
};
export type { BlogStatus } from "@/lib/api";

function phaseTwo(name: string): never {
  throw new Error(
    `${name}() is mock-only for now. Set VITE_MOCK_DATA=1, or wire the server function in phase 2.`,
  );
}

/* ---------- reads ---------- */

export const getProfile = IS_MOCK ? mock.getProfile : real.getProfile;
export const getSettings = IS_MOCK ? mock.getSettings : real.getSettings;
export const getCredits = IS_MOCK ? mock.getCredits : real.getCredits;
export const getSubscription = IS_MOCK ? mock.getSubscription : real.getSubscription;
export const listBlogs = IS_MOCK ? mock.listBlogs : real.listBlogs;
export const getBlog = IS_MOCK ? mock.getBlog : real.getBlog;
export const listKeywords = IS_MOCK ? mock.listKeywords : real.listKeywords;

/* ---------- writes ---------- */

export const updateBlog = IS_MOCK ? mock.updateBlog : real.updateBlog;
export const deleteBlog = IS_MOCK ? mock.deleteBlog : real.deleteBlog;
export const createBlog = IS_MOCK ? mock.createBlog : real.createBlog;
export const prioritizeBlog = IS_MOCK ? mock.prioritizeBlog : real.prioritizeBlog;
export const addOpportunityToQueue = IS_MOCK
  ? mock.addOpportunityToQueue
  : real.addOpportunityToQueue;
export const addKeyword = IS_MOCK ? mock.addKeyword : real.addKeyword;
export const deleteKeyword = IS_MOCK ? mock.deleteKeyword : real.deleteKeyword;
export const updateSettings = IS_MOCK ? mock.updateSettings : real.updateSettings;
export const updateProfile = IS_MOCK ? mock.updateProfile : real.updateProfile;
export const updateAutopilot = IS_MOCK ? mock.updateAutopilot : real.updateAutopilot;

/* ---------- gated generation ---------- */

/**
 * Re-exported so callers catch the same class the mock throws.
 *
 * Real mode has no server-side gate yet (phase 2), so it never raises this and
 * falls through to the existing credits-only behaviour.
 */
export { TrialRequiredError } from "@/lib/errors";

export const generateBlogArticle = IS_MOCK ? mock.generateBlogArticle : real.generateBlogArticle;

export const purchaseCredits = IS_MOCK ? mock.purchaseCredits : real.purchaseCredits;

/** The editor's AI actions (rewrite, expand, shorten, improve SEO) on a selection. */
export async function editBlogSection(data: {
  selection: string;
  action: string;
}): Promise<{ result: string }> {
  if (IS_MOCK) return mockAi.editBlogSection(data);
  const { editBlogSection: fn } = await import("@/lib/ai.functions");
  return fn({ data });
}

/** Stripe's customer-portal URL. Null in mock mode, which has no portal to open. */
export async function openBillingPortal(returnUrl: string): Promise<string | null> {
  if (IS_MOCK) return null;
  const { createPortalSession } = await import("@/lib/payments.functions");
  const result = await createPortalSession({ data: { returnUrl } });
  if ("error" in result) throw new Error(result.error);
  return result.url;
}

/* ---------- credits helpers (pure, no backend) ---------- */

export const creditsRemaining = real.creditsRemaining;
export const hasCreditsRemaining = real.hasCreditsRemaining;
export const CreditsExhaustedError = real.CreditsExhaustedError;

/* ---------- current user ---------- */

export async function getCurrentUser(): Promise<{
  id: string;
  email: string;
  fullName: string;
}> {
  return (await getSessionUser()) ?? { id: "", email: "", fullName: "" };
}

/* ---------- onboarding (mock-only until phase 2) ---------- */

/**
 * Reads the live site in both modes — scraped through Firecrawl (falling back to
 * a guarded direct fetch), with the brand name and "what you do" written by the
 * AI from the page. Mock mode used to synthesise these from the domain, which
 * made every site look the same.
 */
export async function fetchSiteMeta(url: string): Promise<SiteMeta> {
  const { scanBrand } = await import("@/lib/onboarding.functions");
  return scanBrand({ data: { url } });
}

/** Part 2's keyword set and brand context, from the same scrape as Part 1. */
export async function analyzeSite(input: {
  url: string;
  brandName: string;
  description: string;
}): Promise<SiteAnalysis> {
  const { analyzeSite: fn } = await import("@/lib/onboarding.functions");
  return fn({ data: input });
}

/**
 * Part 3's content-gap articles, one per keyword, in publishing order. The AI
 * writes them in both modes; traffic is modeled from keyword volume.
 */
export async function planArticles(input: ContentPlanInput): Promise<PlannedArticle[]> {
  const { planArticles: fn } = await import("@/lib/onboarding.functions");
  return fn({ data: input });
}

export const getOnboardingDraft: () => OnboardingDraft | null = IS_MOCK
  ? mock.getOnboardingDraft
  : () => null;

export const saveOnboardingDraft: (patch: Partial<OnboardingDraft>) => void = IS_MOCK
  ? mock.saveOnboardingDraft
  : () => undefined;

/**
 * Pushes a confirmed onboarding to the dashboard and the autopilot queue. Mock
 * mode reads the same draft from its store, where every change was saved.
 */
export const commitOnboarding: (draft: OnboardingDraft) => Promise<void> = IS_MOCK
  ? () => mock.commitOnboarding()
  : real.commitOnboardingDraft;

/* ---------- trial entitlement ---------- */

export { TRIAL_DAYS } from "@/data/pricing";

/**
 * Whether generation is unlocked.
 *
 * Mock reads the local entitlement. Real mode derives it from the subscription
 * row — phase 2 moves this server-side, inside generateBlogContent, because a
 * client-side check is bypassable.
 */
export async function hasGenerationEntitlement(): Promise<boolean> {
  if (IS_MOCK) return mock.hasActiveTrial();
  const sub = await real.getSubscription();
  return !!sub && ["trialing", "active", "past_due"].includes(sub.status);
}

export const getEntitlement: () => Entitlement = IS_MOCK
  ? mock.getEntitlement
  : () => ({ trialStartedAt: null, trialEndsAt: null });

export const startTrial: () => Promise<Entitlement> = IS_MOCK
  ? mock.startTrial
  : () => phaseTwo("startTrial");

/* ---------- publishing integration ---------- */

/**
 * A publishing key. Whether a site is actually connected is read from
 * last_used_at — see src/components/dashboard/connection-model.ts.
 */
export interface IntegrationKey {
  id: string;
  name: string;
  /** Non-secret start of the key, e.g. "rv_live_a1b2c3…". */
  key_prefix: string;
  /** Last time any request authenticated with this key — i.e. the site's last sync. */
  last_used_at: string | null;
  revoked_at: string | null;
  created_at: string;
}

export async function listIntegrationKeys(): Promise<IntegrationKey[]> {
  if (IS_MOCK) return mock.listApiKeys();
  const { listApiKeys } = await import("@/lib/api-keys.functions");
  return listApiKeys();
}

export async function createApiKey(data: { name?: string } = {}) {
  if (IS_MOCK) return mock.createApiKey(data);
  const { createApiKey: fn } = await import("@/lib/api-keys.functions");
  return fn({ data });
}

export async function revokeApiKey(data: { id: string }) {
  if (IS_MOCK) return mock.revokeApiKey(data);
  const { revokeApiKey: fn } = await import("@/lib/api-keys.functions");
  return fn({ data });
}

export const connectIntegration: (name?: string) => Promise<unknown> = IS_MOCK
  ? mock.connectIntegration
  : () => phaseTwo("connectIntegration");

/* ---------- mock-only utilities ---------- */

export const resetMock = IS_MOCK ? mock.resetMock : () => undefined;
export const seedMockAccount = IS_MOCK ? mock.seedMockAccount : () => undefined;
