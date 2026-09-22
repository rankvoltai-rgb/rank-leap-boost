/**
 * Data access for the redesigned onboarding and dashboard.
 *
 * Delegates to the in-memory mock (VITE_MOCK_DATA=1) or to the real Supabase
 * layer in src/lib/api.ts.
 *
 * Almost everything belongs to one SITE of the account (Studio lets an
 * account run several), so almost every function here takes the site's id
 * first — the dashboard's active site, from useSiteId(). The exceptions are
 * account-wide: the site list, the subscription, the signed-in user, and
 * Studio's own billing calls.
 *
 * Capabilities that do not exist server-side yet are mock-only: in real mode
 * they throw or no-op. Onboarding's scan, content plan and commit are real in
 * both modes (mock mode commits to its local store). The trial is real in
 * both: mock flips a local entitlement, real mode runs a Stripe checkout and
 * reads the subscription row back.
 */
import * as real from "@/lib/api";
import * as mock from "@/lib/mock/store";
import * as mockAi from "@/lib/mock/ai";
import * as mockExchange from "@/lib/mock/exchange";
import * as mockReddit from "@/lib/mock/reddit";
import { IS_MOCK } from "@/lib/mock/mode";
import { getSessionUser } from "@/lib/auth";
import type {
  Blog,
  ContentSettings,
  CreditAccount,
  Keyword,
  Profile,
  Site,
  SiteDetails,
  Subscription,
} from "@/lib/api";
import * as localDraft from "@/lib/onboarding-draft";
import type { DraftKeyword, DraftTitle } from "@/lib/mock/fixtures";
import type { ContentPlanInput, PlannedArticle, SiteAnalysis, SiteMeta } from "@/lib/site-meta";
import type { Entitlement, OnboardingDraft } from "@/lib/mock/store";
import type { StudioQuote } from "@/lib/studio.server";
import type {
  ExchangeSettingsPatch as ExchangeSettingsPatchInput,
  TargetInput as TargetInputData,
} from "@/lib/exchange/types";
import type {
  RedditAccess as RedditAccessValue,
  RedditSettingsPatch as RedditSettingsPatchInput,
} from "@/lib/reddit/types";

export { IS_MOCK };

export type {
  Blog,
  ContentSettings,
  CreditAccount,
  Keyword,
  Profile,
  Site,
  SiteDetails,
  Subscription,
  StudioQuote,
};
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

/* ---------- sites (account-wide) ---------- */

export const listSites = IS_MOCK ? mock.listSites : real.listSites;
export const getSite = IS_MOCK ? mock.getSite : real.getSite;
export const updateSite = IS_MOCK ? mock.updateSite : real.updateSite;
export const listCreditAccounts = IS_MOCK ? mock.listCreditAccounts : real.listCreditAccounts;
export const listBlogStatuses = IS_MOCK ? mock.listBlogStatuses : real.listBlogStatuses;
export const listAllSettings = IS_MOCK ? mock.listAllSettings : real.listSettings;

/* ---------- reads (per site) ---------- */

export const getSettings = IS_MOCK ? mock.getSettings : real.getSettings;
export const getCredits = IS_MOCK ? mock.getCredits : real.getCredits;
export const getSubscription = IS_MOCK ? mock.getSubscription : real.getSubscription;
export const listBlogs = IS_MOCK ? mock.listBlogs : real.listBlogs;
export const getBlog = IS_MOCK ? mock.getBlog : real.getBlog;
export const listKeywords = IS_MOCK ? mock.listKeywords : real.listKeywords;

/* ---------- writes (per site) ---------- */

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
export const updateAutopilot = IS_MOCK ? mock.updateAutopilot : real.updateAutopilot;

/* ---------- gated generation ---------- */

/**
 * Re-exported so callers catch the same class the mock throws.
 *
 * Real mode's gate is server-side (requireGenerationEntitlement), whose errors
 * arrive as plain messages; the mock throws this class directly.
 */
export { TrialRequiredError } from "@/lib/errors";

export const generateBlogArticle = IS_MOCK ? mock.generateBlogArticle : real.generateBlogArticle;

/** The editor's AI actions (rewrite, expand, shorten, improve SEO) on a selection. */
export async function editBlogSection(
  siteId: string,
  data: {
    selection: string;
    action: string;
  },
): Promise<{ result: string }> {
  if (IS_MOCK) return mockAi.editBlogSection(data);
  const { editBlogSection: fn } = await import("@/lib/ai.functions");
  return fn({ data: { siteId, ...data } });
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

/* ---------- onboarding ---------- */

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
  : localDraft.loadLocalDraft;

export const saveOnboardingDraft: (patch: Partial<OnboardingDraft>) => void = IS_MOCK
  ? mock.saveOnboardingDraft
  : localDraft.saveLocalDraft;

/**
 * Whether the saved draft may be resumed by this account. Mock drafts are
 * already stored per account; the real-mode draft is shared by the browser, so
 * one left by a different account is dropped.
 */
export const claimOnboardingDraft: (userId: string) => boolean = IS_MOCK
  ? () => true
  : localDraft.claimLocalDraft;

/** Called once setup is committed; mock marks its draft done instead. */
export const clearOnboardingDraft: () => void = IS_MOCK
  ? () => undefined
  : localDraft.clearLocalDraft;

/**
 * Pushes a confirmed plan to the dashboard and the autopilot queue. Without a
 * site it sets up the account's primary site (onboarding); with one it fills
 * in a site Studio has just added. Returns the site it wrote to.
 */
export const commitOnboarding: (draft: OnboardingDraft, siteId?: string) => Promise<string> =
  IS_MOCK ? (draft, siteId) => mock.commitOnboarding(draft, siteId) : real.commitOnboardingDraft;

/* ---------- trial entitlement ---------- */

export { TRIAL_DAYS } from "@/data/pricing";

/**
 * Whether generation is unlocked.
 *
 * Mock reads the local entitlement. Real mode derives it from the subscription
 * row. This is only what the UI shows — the check that actually withholds
 * generation is `requireGenerationEntitlement`, inside the server function,
 * because anything decided here is bypassable.
 */
export async function hasGenerationEntitlement(): Promise<boolean> {
  if (IS_MOCK) return mock.hasActiveTrial();
  const sub = await real.getSubscription();
  return !!sub && ["trialing", "active", "past_due"].includes(sub.status);
}

export const getEntitlement: () => Entitlement = IS_MOCK
  ? mock.getEntitlement
  : () => ({ trialStartedAt: null, trialEndsAt: null });

/**
 * Mock-only, and deliberately so: there is no "start a trial" button to press
 * server-side. In real mode the trial begins with a Stripe checkout carrying a
 * trial period (see StartTrialDialog), and the entitlement follows from the
 * subscription row rather than from a call like this one.
 */
export const startTrial: () => Promise<Entitlement> = IS_MOCK
  ? mock.startTrial
  : () => {
      throw new Error("Real mode starts the trial through Stripe checkout, not startTrial().");
    };

/**
 * Settle a just-completed checkout so the trial is live by the time the dialog
 * closes, instead of whenever Stripe's webhook lands. Idempotent — the webhook
 * writes the same row.
 */
export async function confirmTrialCheckout(sessionId: string): Promise<void> {
  if (IS_MOCK) return;
  const { confirmCheckout } = await import("@/lib/payments.functions");
  const result = await confirmCheckout({ data: { sessionId } });
  if ("error" in result) throw new Error(result.error);
}

/* ---------- Studio (account-wide billing) ---------- */

/** What adding one site costs today and monthly, or why it can't be added. */
export async function getStudioQuote(): Promise<StudioQuote> {
  if (IS_MOCK) return mock.getStudioQuote();
  const { getStudioQuote: fn } = await import("@/lib/studio.functions");
  return fn();
}

/** Charges for a new site and creates it. The plan is committed onto it afterwards. */
export async function addStudioSite(data: {
  url: string;
  brandName: string;
  description: string;
  logoUrl: string | null;
  prorationDate?: number;
}): Promise<{ siteId: string }> {
  if (IS_MOCK) return mock.addStudioSite(data);
  const { addStudioSite: fn } = await import("@/lib/studio.functions");
  return fn({ data });
}

export async function restoreStudioSite(data: {
  siteId: string;
  prorationDate?: number;
}): Promise<{ siteId: string }> {
  if (IS_MOCK) return mock.restoreStudioSite(data);
  const { restoreStudioSite: fn } = await import("@/lib/studio.functions");
  return fn({ data });
}

export async function removeStudioSite(data: { siteId: string }): Promise<{ removesAt: string }> {
  if (IS_MOCK) return mock.removeStudioSite(data);
  const { removeStudioSite: fn } = await import("@/lib/studio.functions");
  return fn({ data });
}

export async function keepStudioSite(data: { siteId: string }): Promise<{ ok: true }> {
  if (IS_MOCK) return mock.keepStudioSite(data);
  const { keepStudioSite: fn } = await import("@/lib/studio.functions");
  return fn({ data });
}

/** Ends the trial now and takes the first payment, which opens Studio. */
export async function activatePlanNow(): Promise<{ status: string }> {
  if (IS_MOCK) return mock.activatePlanNow();
  const { activatePlanNow: fn } = await import("@/lib/studio.functions");
  return fn();
}

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

export async function listIntegrationKeys(siteId: string): Promise<IntegrationKey[]> {
  if (IS_MOCK) return mock.listApiKeys(siteId);
  const { listApiKeys } = await import("@/lib/api-keys.functions");
  return listApiKeys({ data: { siteId } });
}

export async function createApiKey(siteId: string, data: { name?: string } = {}) {
  if (IS_MOCK) return mock.createApiKey(siteId, data);
  const { createApiKey: fn } = await import("@/lib/api-keys.functions");
  return fn({ data: { siteId, ...data } });
}

export async function revokeApiKey(data: { id: string }) {
  if (IS_MOCK) return mock.revokeApiKey(data);
  const { revokeApiKey: fn } = await import("@/lib/api-keys.functions");
  return fn({ data });
}

export const connectIntegration: (siteId: string, name?: string) => Promise<unknown> = IS_MOCK
  ? mock.connectIntegration
  : () => phaseTwo("connectIntegration");

/* ---------- backlink exchange ---------- */

export type {
  ExchangeAccess,
  ExchangeBalance,
  ExchangeBlock,
  ExchangeOverview,
  ExchangeSettingsPatch,
  ExchangeSite,
  ExchangeTarget,
  HostedPlacement,
  InboundPlacement,
  LedgerEntry,
  NetworkPulse,
  PlacementStatus,
  TargetInput,
  VerificationResult,
} from "@/lib/exchange/types";
export { EXCHANGE_CATEGORIES, tierCost } from "@/lib/exchange/types";

/**
 * Paid members only, per site. Every read and write is a server function
 * acting with the service role — placements name both parties, so members
 * have no direct table access. Mock mode runs the same scoring against a
 * synthetic network (one per account, whichever site is open).
 */
export async function getExchangeOverview(siteId: string) {
  if (IS_MOCK) return mockExchange.getExchangeOverview();
  const { getExchangeOverview: fn } = await import("@/lib/exchange.functions");
  return fn({ data: { siteId } });
}

export async function listExchangeTargets(siteId: string) {
  if (IS_MOCK) return mockExchange.listTargets();
  const { listTargets: fn } = await import("@/lib/exchange.functions");
  return fn({ data: { siteId } });
}

export async function listInboundPlacements(siteId: string) {
  if (IS_MOCK) return mockExchange.listInboundPlacements();
  const { listInboundPlacements: fn } = await import("@/lib/exchange.functions");
  return fn({ data: { siteId } });
}

export async function listHostedPlacements(siteId: string) {
  if (IS_MOCK) return mockExchange.listHostedPlacements();
  const { listHostedPlacements: fn } = await import("@/lib/exchange.functions");
  return fn({ data: { siteId } });
}

export async function listExchangeLedger(siteId: string) {
  if (IS_MOCK) return mockExchange.listExchangeLedger();
  const { listExchangeLedger: fn } = await import("@/lib/exchange.functions");
  return fn({ data: { siteId } });
}

export async function listExchangeBlocks(siteId: string) {
  if (IS_MOCK) return mockExchange.listExchangeBlocks();
  const { listExchangeBlocks: fn } = await import("@/lib/exchange.functions");
  return fn({ data: { siteId } });
}

export async function startDomainVerification(siteId: string, data: { domain: string }) {
  if (IS_MOCK) return mockExchange.startDomainVerification(data);
  const { startDomainVerification: fn } = await import("@/lib/exchange.functions");
  return fn({ data: { siteId, ...data } });
}

export async function checkDomainVerification(siteId: string) {
  if (IS_MOCK) return mockExchange.checkDomainVerification();
  const { checkDomainVerification: fn } = await import("@/lib/exchange.functions");
  return fn({ data: { siteId } });
}

export async function updateExchangeSettings(siteId: string, data: ExchangeSettingsPatchInput) {
  if (IS_MOCK) return mockExchange.updateExchangeSettings(data);
  const { updateExchangeSettings: fn } = await import("@/lib/exchange.functions");
  return fn({ data: { siteId, ...data } });
}

export async function createExchangeTarget(siteId: string, data: TargetInputData) {
  if (IS_MOCK) return mockExchange.createTarget(data);
  const { createTarget: fn } = await import("@/lib/exchange.functions");
  return fn({ data: { siteId, ...data } });
}

export async function updateExchangeTarget(
  siteId: string,
  data: { id: string; patch: Partial<TargetInputData> },
) {
  if (IS_MOCK) return mockExchange.updateTarget(data);
  const { updateTarget: fn } = await import("@/lib/exchange.functions");
  return fn({ data: { siteId, ...data } });
}

export async function deleteExchangeTarget(siteId: string, data: { id: string }) {
  if (IS_MOCK) return mockExchange.deleteTarget(data);
  const { deleteTarget: fn } = await import("@/lib/exchange.functions");
  return fn({ data: { siteId, ...data } });
}

export async function blockExchangeDomain(
  siteId: string,
  data: { domain: string; reason?: string },
) {
  if (IS_MOCK) return mockExchange.blockDomain(data);
  const { blockDomain: fn } = await import("@/lib/exchange.functions");
  return fn({ data: { siteId, ...data } });
}

export async function unblockExchangeDomain(siteId: string, data: { domain: string }) {
  if (IS_MOCK) return mockExchange.unblockDomain(data);
  const { unblockDomain: fn } = await import("@/lib/exchange.functions");
  return fn({ data: { siteId, ...data } });
}

export async function removeHostedPlacement(siteId: string, data: { id: string }) {
  if (IS_MOCK) return mockExchange.removeHostedPlacement(data);
  const { removeHostedPlacement: fn } = await import("@/lib/exchange.functions");
  return fn({ data: { siteId, ...data } });
}

export async function setPublishedUrl(siteId: string, data: { blogId: string; url: string }) {
  if (IS_MOCK) return mockExchange.setPublishedUrl(data);
  const { setPublishedUrl: fn } = await import("@/lib/exchange.functions");
  return fn({ data: { siteId, ...data } });
}

/** Mock-only: stands in for the first paid invoice. A no-op in real mode. */
export const simulatePaidPlan: () => Promise<void> = IS_MOCK
  ? mockExchange.simulatePaidPlan
  : async () => undefined;

/* ---------- reddit presence ---------- */

export type {
  AiCitationMeasurement,
  ComplianceCheck,
  ComplianceReport,
  ComplianceState,
  RedditAccess,
  RedditBalance,
  RedditBlockedReason,
  RedditDraft,
  RedditLedgerEntry,
  RedditMention,
  RedditOpportunity,
  RedditOpportunityDetail,
  RedditOverview,
  RedditReply,
  RedditReplyStatus,
  RedditSettings,
  RedditSettingsPatch,
  RedditSubredditView,
  RedditSweep,
  RedditSweepResult,
  RedditThreadView,
  SerpMeasurement,
} from "@/lib/reddit/types";
export {
  draftText,
  isMeasuredReply,
  MAX_DRAFT_CHARS,
  MAX_DRAFT_REGENS,
  REDDIT_AI_ENGINE_LABELS,
  REDDIT_BLOCKED_COPY,
  REDDIT_DRAFT_COST,
} from "@/lib/reddit/types";

/**
 * Paid members only, per site, like the exchange. Rankbox never authenticates
 * to Reddit and never posts: these calls find threads, draft a reply and check
 * it, and record what the MEMBER then did under their own account.
 *
 * Every read and write is a server function acting with the service role —
 * the thread cache is shared across members, so nobody has direct table
 * access to it. Mock mode runs the same scorer and the same compliance checker
 * over a synthetic set of threads (one per account, whichever site is open).
 */
export async function getRedditOverview(siteId: string) {
  if (IS_MOCK) return mockReddit.getRedditOverview();
  const { getRedditOverview: fn } = await import("@/lib/reddit.functions");
  return fn({ data: { siteId } });
}

export async function listRedditOpportunities(siteId: string) {
  if (IS_MOCK) return mockReddit.listRedditOpportunities();
  const { listRedditOpportunities: fn } = await import("@/lib/reddit.functions");
  return fn({ data: { siteId } });
}

export async function getRedditOpportunity(siteId: string, data: { id: string }) {
  if (IS_MOCK) return mockReddit.getRedditOpportunity(data);
  const { getRedditOpportunity: fn } = await import("@/lib/reddit.functions");
  return fn({ data: { siteId, ...data } });
}

export async function listRedditMentions(siteId: string) {
  if (IS_MOCK) return mockReddit.listRedditMentions();
  const { listRedditMentions: fn } = await import("@/lib/reddit.functions");
  return fn({ data: { siteId } });
}

export async function listRedditLedger(siteId: string) {
  if (IS_MOCK) return mockReddit.listRedditLedger();
  const { listRedditLedger: fn } = await import("@/lib/reddit.functions");
  return fn({ data: { siteId } });
}

export async function enableReddit(siteId: string, data: RedditSettingsPatchInput) {
  if (IS_MOCK) return mockReddit.enableReddit(data);
  const { enableReddit: fn } = await import("@/lib/reddit.functions");
  return fn({ data: { siteId, ...data } });
}

export async function runRedditSweep(siteId: string) {
  if (IS_MOCK) return mockReddit.runRedditSweep();
  const { runRedditSweep: fn } = await import("@/lib/reddit.functions");
  return fn({ data: { siteId } });
}

export async function generateRedditDraft(
  siteId: string,
  data: { opportunityId: string; instructions?: string },
) {
  if (IS_MOCK) return mockReddit.generateRedditDraft(data);
  const { generateRedditDraft: fn } = await import("@/lib/reddit.functions");
  return fn({ data: { siteId, ...data } });
}

export async function regenerateRedditDraft(
  siteId: string,
  data: { draftId: string; instructions: string },
) {
  if (IS_MOCK) return mockReddit.regenerateRedditDraft(data);
  const { regenerateRedditDraft: fn } = await import("@/lib/reddit.functions");
  return fn({ data: { siteId, ...data } });
}

export async function updateRedditDraft(siteId: string, data: { draftId: string; body: string }) {
  if (IS_MOCK) return mockReddit.updateRedditDraft(data);
  const { updateRedditDraft: fn } = await import("@/lib/reddit.functions");
  return fn({ data: { siteId, ...data } });
}

export async function markRedditReplyPosted(
  siteId: string,
  data: {
    opportunityId: string;
    permalink?: string;
    draftId?: string;
  },
) {
  if (IS_MOCK) return mockReddit.markRedditReplyPosted(data);
  const { markRedditReplyPosted: fn } = await import("@/lib/reddit.functions");
  return fn({ data: { siteId, ...data } });
}

export async function verifyRedditReply(siteId: string, data: { replyId: string }) {
  if (IS_MOCK) return mockReddit.verifyRedditReply(data);
  const { verifyRedditReply: fn } = await import("@/lib/reddit.functions");
  return fn({ data: { siteId, ...data } });
}

export async function dismissRedditOpportunity(
  siteId: string,
  data: { id: string; reason?: string },
) {
  if (IS_MOCK) return mockReddit.dismissRedditOpportunity(data);
  const { dismissRedditOpportunity: fn } = await import("@/lib/reddit.functions");
  return fn({ data: { siteId, ...data } });
}

export async function restoreRedditOpportunity(siteId: string, data: { id: string }) {
  if (IS_MOCK) return mockReddit.restoreRedditOpportunity(data);
  const { restoreRedditOpportunity: fn } = await import("@/lib/reddit.functions");
  return fn({ data: { siteId, ...data } });
}

export async function updateRedditSettings(siteId: string, data: RedditSettingsPatchInput) {
  if (IS_MOCK) return mockReddit.updateRedditSettings(data);
  const { updateRedditSettings: fn } = await import("@/lib/reddit.functions");
  return fn({ data: { siteId, ...data } });
}

/** Mock-only review switches: view the page as another kind of account. No-ops in real mode. */
export const setMockRedditAccess: (value: RedditAccessValue | null) => Promise<void> = IS_MOCK
  ? mockReddit.setMockRedditAccess
  : async () => undefined;
export const setMockRedditProvider: (configured: boolean) => Promise<void> = IS_MOCK
  ? mockReddit.setMockRedditProvider
  : async () => undefined;
export const getMockRedditSwitches = IS_MOCK
  ? mockReddit.getMockRedditSwitches
  : () => ({ access: null, provider: true });

/* ---------- mock-only utilities ---------- */

export const resetMock = IS_MOCK ? mock.resetMock : () => undefined;
export const seedMockAccount = IS_MOCK ? mock.seedMockAccount : () => undefined;
