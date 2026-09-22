/**
 * Server-side data access for Reddit presence.
 *
 * Everything here runs with the service role. Members have SELECT-only RLS on
 * their own rows and NO access at all to the shared tables — reddit_threads,
 * reddit_subreddits and the three measurement logs are a cache of public data
 * that every site's sweeps feed and draw on. So every read that touches
 * them comes through this module, and every exported reader takes a `scope`
 * as its FIRST argument and starts from that site's own reddit_opportunities.
 *
 * That shape is the tenant boundary, and the tenant is a site: two sites of one
 * owner never see each other's opportunities, drafts or credits. RLS cannot
 * leak the shared tables, because members have no grant on them; a join
 * written carelessly here could. Keep the rule: nothing is read from a shared
 * table except by ids that came from a row already filtered to `scope.siteId`.
 * A scope is never built from what a caller sends: the server functions
 * resolve it against the caller's own sites (src/lib/sites.server.ts), and the
 * cron reads it from reddit_settings.
 */
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Tables } from "@/integrations/supabase/types";
import {
  hasRedditEntitlement,
  loadRedditAccess,
  PaidPlanRequiredError,
  type SiteScope,
} from "@/lib/entitlement.server";
import { requireLiveSite } from "@/lib/sites.server";
import { readRules } from "./rules";
import type { ScoreContext } from "./scoring";
import {
  isOpenOpportunity,
  STANDING_REPLY_STATUSES,
  type AiCitationMeasurement,
  type ComplianceReport,
  type RedditBalance,
  type RedditBlockedReason,
  type RedditDraft,
  type RedditLedgerEntry,
  type RedditMention,
  type RedditOpportunity,
  type RedditOpportunityDetail,
  type RedditOverview,
  type RedditReply,
  type RedditReplyCheck,
  type RedditSettings,
  type RedditSubredditView,
  type RedditSweep,
  type RedditThreadView,
  type RedditTopComment,
  type SerpMeasurement,
} from "./types";

export type SettingsRow = Tables<"reddit_settings">;
export type ThreadRow = Tables<"reddit_threads">;
export type SubredditRow = Tables<"reddit_subreddits">;
export type OpportunityRow = Tables<"reddit_opportunities">;
export type DraftRow = Tables<"reddit_drafts">;
export type ReplyRow = Tables<"reddit_replies">;
type SerpRow = Tables<"reddit_thread_serp">;
type AiRow = Tables<"reddit_thread_ai_citations">;
type CheckRow = Tables<"reddit_reply_checks">;
type SweepRow = Tables<"reddit_sweeps">;
type AccountRow = Tables<"reddit_credit_accounts">;
type LedgerRow = Tables<"reddit_ledger">;

const EMPTY_BALANCE: RedditBalance = { balance: 0, lifetimeSpent: 0, periodEnd: null };
const EMPTY_COUNTS = { open: 0, drafted: 0, posted: 0, liveMentions: 0, blocked: 0 };

/* ── Row mappers ────────────────────────────────────────────────── */

export function settingsFromRow(r: SettingsRow): RedditSettings {
  return {
    enabled: r.enabled,
    sweepEnabled: r.sweep_enabled,
    niche: r.niche,
    topicTags: r.topic_tags,
    disclosureLine: r.disclosure_line,
    tone: r.tone,
    maxLinksPerReply: r.max_links_per_reply,
    allowSubreddits: r.allow_subreddits,
    denySubreddits: r.deny_subreddits,
    keywordsPerSweep: r.keywords_per_sweep,
    lastSweepAt: r.last_sweep_at,
    sweepCount: r.sweep_count,
  };
}

function stringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

function topComments(value: unknown): RedditTopComment[] {
  if (!Array.isArray(value)) return [];
  const out: RedditTopComment[] = [];
  for (const v of value) {
    if (!v || typeof v !== "object") continue;
    const c = v as Record<string, unknown>;
    if (typeof c.body !== "string" || !c.body) continue;
    out.push({
      author: typeof c.author === "string" ? c.author : "",
      body: c.body,
      score: typeof c.score === "number" ? c.score : 0,
    });
  }
  return out;
}

export function subredditFromRow(r: SubredditRow): RedditSubredditView {
  const source =
    r.rules_source === "api" || r.rules_source === "scrape" ? r.rules_source : "unavailable";
  return {
    name: r.name,
    title: r.title,
    publicDescription: r.public_description,
    subscribers: r.subscribers,
    allowsSelfPromo: r.allows_self_promo,
    promoBanned: r.promo_banned,
    rules: stringList(r.rules),
    rulesSource: source,
    rulesCheckedAt: r.rules_checked_at,
  };
}

function serpFromRow(r: SerpRow): SerpMeasurement {
  return {
    query: r.query,
    position: r.position,
    country: r.country,
    device: r.device,
    checkedAt: r.checked_at,
  };
}

function aiFromRow(r: AiRow): AiCitationMeasurement {
  return {
    engine: r.engine,
    query: r.query,
    cited: r.cited,
    snippet: r.snippet,
    checkedAt: r.checked_at,
  };
}

/**
 * `aiChecked` is true only when there is at least one row — cited or not. No
 * rows means nobody asked, and the UI is told exactly that.
 */
function threadView(r: ThreadRow, serp: SerpRow | undefined, ai: AiRow[]): RedditThreadView {
  return {
    id: r.id,
    redditId: r.reddit_id,
    subreddit: r.subreddit,
    permalink: r.permalink,
    title: r.title,
    body: r.body,
    author: r.author,
    upVotes: r.up_votes,
    numComments: r.num_comments,
    postedAt: r.posted_at,
    isLocked: r.is_locked,
    isArchived: r.is_archived,
    isRemoved: r.is_removed,
    topComments: topComments(r.top_comments),
    googlePosition: serp ? serpFromRow(serp) : null,
    aiCitations: ai.map(aiFromRow),
    aiChecked: ai.length > 0,
    partialData: r.hydrated_at === null,
    hydratedAt: r.hydrated_at,
  };
}

function numberMap(value: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  if (value && typeof value === "object" && !Array.isArray(value))
    for (const [k, v] of Object.entries(value as Record<string, unknown>))
      if (typeof v === "number") out[k] = v;
  return out;
}

function complianceFromJson(value: unknown): ComplianceReport {
  const v = (value ?? {}) as Partial<ComplianceReport>;
  const checks = Array.isArray(v.checks) ? v.checks : [];
  const failures = checks.filter((c) => c.state === "fail").length;
  const unknowns = checks.filter((c) => c.state === "unknown").length;
  // Recomputed rather than trusted: `pass` must always agree with the checks.
  return { checks, failures, unknowns, pass: checks.length > 0 && failures === 0 };
}

export function draftFromRow(r: DraftRow): RedditDraft {
  return {
    id: r.id,
    opportunityId: r.opportunity_id,
    body: r.body,
    editedBody: r.edited_body,
    model: r.model,
    compliance: complianceFromJson(r.compliance),
    creditsSpent: r.credits_spent,
    regenCount: r.regen_count,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

const CHECK_OUTCOMES = new Set(["found", "missing", "removed", "unreachable", "blocked"]);

function replyFromRow(r: ReplyRow, checks: CheckRow[]): RedditReply {
  return {
    id: r.id,
    opportunityId: r.opportunity_id,
    threadId: r.thread_id,
    draftId: r.draft_id,
    permalink: r.permalink,
    redditCommentId: r.reddit_comment_id,
    status: r.status,
    score: r.score,
    postedAt: r.posted_at,
    confirmedAt: r.confirmed_at,
    removedAt: r.removed_at,
    lastCheckedAt: r.last_checked_at,
    consecutiveFailures: r.consecutive_failures,
    checks: checks
      .filter((c) => CHECK_OUTCOMES.has(c.outcome))
      .map(
        (c): RedditReplyCheck => ({
          checkedAt: c.checked_at,
          outcome: c.outcome as RedditReplyCheck["outcome"],
          score: c.score,
          detail: c.detail,
        }),
      ),
  };
}

/** No `cost_usd`. What a sweep cost us is not the member's business or burden. */
function sweepFromRow(r: SweepRow): RedditSweep {
  return {
    id: r.id,
    status: r.status,
    trigger: r.trigger === "manual" ? "manual" : "cron",
    keywordsUsed: r.keywords_used,
    threadsSeen: r.threads_seen,
    opportunitiesCreated: r.opportunities_created,
    error: r.error,
    startedAt: r.started_at,
    finishedAt: r.finished_at,
  };
}

function balanceFromRow(r: AccountRow | null | undefined): RedditBalance {
  if (!r) return EMPTY_BALANCE;
  return { balance: r.balance, lifetimeSpent: r.lifetime_spent, periodEnd: r.period_end };
}

function ledgerFromRow(r: LedgerRow): RedditLedgerEntry {
  return {
    id: r.id,
    kind: r.kind,
    credits: r.credits,
    balanceAfter: r.balance_after,
    note: r.note,
    createdAt: r.created_at,
  };
}

function fail(error: { message: string } | null): void {
  if (error) throw new Error(error.message);
}

/* ── Gate ───────────────────────────────────────────────────────── */

/** Throws unless the site is live on a paid plan. Reddit presence is not part of the trial. */
export async function requirePaid(scope: SiteScope): Promise<void> {
  if (!(await hasRedditEntitlement(supabaseAdmin, scope)))
    throw new PaidPlanRequiredError(
      "Reddit presence is part of the paid plan. It opens with your first paid invoice.",
    );
}

/**
 * The guard for anything that writes or spends: the caller owns the site, the
 * site is live, and it is on a paid plan — in that order. Returns the scope
 * to act in.
 */
export async function requirePaidSite(userId: string, siteId: string): Promise<SiteScope> {
  await requireLiveSite(userId, siteId);
  const scope = { userId, siteId };
  await requirePaid(scope);
  return scope;
}

/**
 * Whether a discovery provider is configured. Read inside the function, never
 * at module scope: on Workers, env binds at request time.
 */
export function providerConfigured(): boolean {
  return Boolean(process.env.APIFY_TOKEN);
}

/* ── Loads ──────────────────────────────────────────────────────── */

export async function loadSettingsRow(scope: SiteScope): Promise<SettingsRow | null> {
  const { data, error } = await supabaseAdmin
    .from("reddit_settings")
    .select("*")
    .eq("site_id", scope.siteId)
    .maybeSingle();
  fail(error);
  return data;
}

/** Who is replying — what the scorer and the checker need to know about the site's brand. */
export interface BrandContext {
  brandName: string;
  productDescription: string;
  audience: string;
  tone: string;
  brandVoice: string;
  keywords: string[];
}

export async function loadBrandContext(scope: SiteScope, keywordLimit = 60): Promise<BrandContext> {
  const [profile, content, keywords] = await Promise.all([
    supabaseAdmin
      .from("profiles")
      .select("brand_name, product_description")
      .eq("id", scope.siteId)
      .maybeSingle(),
    supabaseAdmin
      .from("content_settings")
      .select("tone, audience, brand_voice")
      .eq("site_id", scope.siteId)
      .maybeSingle(),
    supabaseAdmin
      .from("keywords")
      .select("name, search_volume")
      .eq("site_id", scope.siteId)
      .order("search_volume", { ascending: false })
      .limit(keywordLimit),
  ]);
  return {
    brandName: profile.data?.brand_name?.trim() || "",
    productDescription: profile.data?.product_description ?? "",
    audience: content.data?.audience ?? "",
    tone: content.data?.tone ?? "",
    brandVoice: content.data?.brand_voice ?? "",
    keywords: (keywords.data ?? []).map((k) => k.name).filter(Boolean),
  };
}

export function scoreContextOf(settings: SettingsRow | null, brand: BrandContext): ScoreContext {
  return {
    niche: settings?.niche ?? null,
    topicTags: settings?.topic_tags ?? [],
    keywords: brand.keywords,
    productDescription: brand.productDescription,
    allowSubreddits: settings?.allow_subreddits ?? [],
    denySubreddits: settings?.deny_subreddits ?? [],
  };
}

/**
 * Turns a site's opportunity rows into views. The ONLY place the shared
 * tables are read for display: every id queried below came from `rows`, which
 * the caller has already filtered to one site.
 */
async function hydrateOpportunities(rows: OpportunityRow[]): Promise<RedditOpportunity[]> {
  if (rows.length === 0) return [];
  const threadIds = [...new Set(rows.map((r) => r.thread_id))];

  const [threads, serps, ais] = await Promise.all([
    supabaseAdmin.from("reddit_threads").select("*").in("id", threadIds),
    supabaseAdmin
      .from("reddit_thread_serp")
      .select("*")
      .in("thread_id", threadIds)
      .order("checked_at", { ascending: false }),
    supabaseAdmin
      .from("reddit_thread_ai_citations")
      .select("*")
      .in("thread_id", threadIds)
      .order("checked_at", { ascending: false }),
  ]);
  fail(threads.error);
  fail(serps.error);
  fail(ais.error);

  const threadById = new Map((threads.data ?? []).map((t) => [t.id, t]));
  const subNames = [...new Set((threads.data ?? []).map((t) => t.subreddit))];
  const subs = subNames.length
    ? await supabaseAdmin.from("reddit_subreddits").select("*").in("name", subNames)
    : { data: [] as SubredditRow[], error: null };
  fail(subs.error);
  const subByName = new Map((subs.data ?? []).map((s) => [s.name, s]));

  // Newest first, so the first row seen per thread is the latest position…
  const latestSerp = new Map<string, SerpRow>();
  for (const s of serps.data ?? [])
    if (!latestSerp.has(s.thread_id)) latestSerp.set(s.thread_id, s);
  // …and the first per (thread, engine) is that engine's latest answer.
  const latestAi = new Map<string, AiRow[]>();
  const seenEngine = new Set<string>();
  for (const a of ais.data ?? []) {
    const key = `${a.thread_id}:${a.engine}`;
    if (seenEngine.has(key)) continue;
    seenEngine.add(key);
    latestAi.set(a.thread_id, [...(latestAi.get(a.thread_id) ?? []), a]);
  }

  const out: RedditOpportunity[] = [];
  for (const r of rows) {
    const thread = threadById.get(r.thread_id);
    if (!thread) continue;
    const sub = subByName.get(thread.subreddit);
    out.push({
      id: r.id,
      threadId: r.thread_id,
      thread: threadView(thread, latestSerp.get(thread.id), latestAi.get(thread.id) ?? []),
      subredditInfo: sub ? subredditFromRow(sub) : null,
      matchedKeyword: r.matched_keyword,
      channel: r.channel === "serp" || r.channel === "both" ? r.channel : "search",
      status: r.status,
      score: Number(r.score),
      breakdown: numberMap(r.breakdown),
      blockedReason: (r.blocked_reason as RedditBlockedReason | null) ?? null,
      dismissReason: r.dismiss_reason,
      firstSeenAt: r.first_seen_at,
      lastScoredAt: r.last_scored_at,
    });
  }
  return out;
}

export async function loadOverview(scope: SiteScope): Promise<RedditOverview> {
  const settings = await loadSettingsRow(scope);
  const access = await loadRedditAccess(supabaseAdmin, scope, Boolean(settings?.enabled));

  // An unpaid site gets the shape of the feature and none of its contents,
  // and costs us nothing to tell so.
  if (access === "trial" || access === "none")
    return {
      access,
      providerConfigured: providerConfigured(),
      settings: null,
      balance: EMPTY_BALANCE,
      counts: EMPTY_COUNTS,
      lastSweep: null,
    };

  const [account, opps, replies, sweep] = await Promise.all([
    supabaseAdmin
      .from("reddit_credit_accounts")
      .select("*")
      .eq("site_id", scope.siteId)
      .maybeSingle(),
    supabaseAdmin
      .from("reddit_opportunities")
      .select("status, blocked_reason")
      .eq("site_id", scope.siteId),
    supabaseAdmin.from("reddit_replies").select("status").eq("site_id", scope.siteId),
    supabaseAdmin
      .from("reddit_sweeps")
      .select("*")
      .eq("site_id", scope.siteId)
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);
  fail(account.error);
  fail(opps.error);
  fail(replies.error);
  fail(sweep.error);

  const rows = (opps.data ?? []).map((o) => ({
    status: o.status,
    blockedReason: o.blocked_reason,
  }));
  return {
    access,
    providerConfigured: providerConfigured(),
    settings: settings ? settingsFromRow(settings) : null,
    balance: balanceFromRow(account.data),
    counts: {
      open: rows.filter(isOpenOpportunity).length,
      drafted: rows.filter((o) => isOpenOpportunity(o) && o.status === "drafted").length,
      posted: (replies.data ?? []).length,
      // Confirmed only. A bare claim is the member's word and is never counted
      // in a total we present as something we saw.
      liveMentions: (replies.data ?? []).filter((r) => r.status === "confirmed").length,
      blocked: rows.filter(
        (o) => o.blockedReason && o.status !== "posted" && o.status !== "dismissed",
      ).length,
    },
    lastSweep: sweep.data ? sweepFromRow(sweep.data) : null,
  };
}

/**
 * True for paid and lapsed: a lapsed site — the plan ended, or the site was
 * removed or archived — keeps its history, read-only.
 */
export async function canRead(scope: SiteScope): Promise<boolean> {
  const settings = await loadSettingsRow(scope);
  const access = await loadRedditAccess(supabaseAdmin, scope, Boolean(settings?.enabled));
  return access === "paid" || access === "lapsed";
}

export async function listOpportunities(
  scope: SiteScope,
  limit = 200,
): Promise<RedditOpportunity[]> {
  if (!(await canRead(scope))) return [];
  const { data, error } = await supabaseAdmin
    .from("reddit_opportunities")
    .select("*")
    .eq("site_id", scope.siteId)
    .order("score", { ascending: false })
    .limit(limit);
  fail(error);
  return hydrateOpportunities(data ?? []);
}

export async function loadOpportunityRow(
  scope: SiteScope,
  id: string,
): Promise<OpportunityRow | null> {
  const { data, error } = await supabaseAdmin
    .from("reddit_opportunities")
    .select("*")
    .eq("id", id)
    .eq("site_id", scope.siteId)
    .maybeSingle();
  fail(error);
  return data;
}

async function repliesWithChecks(rows: ReplyRow[]): Promise<RedditReply[]> {
  if (rows.length === 0) return [];
  const { data, error } = await supabaseAdmin
    .from("reddit_reply_checks")
    .select("*")
    .in(
      "reply_id",
      rows.map((r) => r.id),
    )
    .order("checked_at", { ascending: false })
    .limit(500);
  fail(error);
  const byReply = new Map<string, CheckRow[]>();
  for (const c of data ?? []) {
    const list = byReply.get(c.reply_id) ?? [];
    if (list.length < 10) list.push(c);
    byReply.set(c.reply_id, list);
  }
  return rows.map((r) => replyFromRow(r, byReply.get(r.id) ?? []));
}

export async function getOpportunity(
  scope: SiteScope,
  id: string,
): Promise<RedditOpportunityDetail | null> {
  if (!(await canRead(scope))) return null;
  const row = await loadOpportunityRow(scope, id);
  if (!row) return null;

  const [views, drafts, replies] = await Promise.all([
    hydrateOpportunities([row]),
    supabaseAdmin
      .from("reddit_drafts")
      .select("*")
      .eq("opportunity_id", id)
      .eq("site_id", scope.siteId)
      .order("created_at", { ascending: false })
      .limit(5),
    supabaseAdmin
      .from("reddit_replies")
      .select("*")
      .eq("opportunity_id", id)
      .eq("site_id", scope.siteId)
      .order("posted_at", { ascending: false }),
  ]);
  fail(drafts.error);
  fail(replies.error);
  const opportunity = views[0];
  if (!opportunity) return null;

  const all = await repliesWithChecks(replies.data ?? []);
  return {
    opportunity,
    drafts: (drafts.data ?? []).map(draftFromRow),
    // The standing reply if there is one; otherwise the most recent, so a
    // removed comment still shows what happened to it.
    reply: all.find((r) => STANDING_REPLY_STATUSES.includes(r.status)) ?? all[0] ?? null,
  };
}

export async function listMentions(scope: SiteScope): Promise<RedditMention[]> {
  if (!(await canRead(scope))) return [];
  const { data: replyRows, error } = await supabaseAdmin
    .from("reddit_replies")
    .select("*")
    .eq("site_id", scope.siteId)
    .order("posted_at", { ascending: false })
    .limit(100);
  fail(error);
  if (!replyRows?.length) return [];

  const oppIds = [...new Set(replyRows.map((r) => r.opportunity_id))];
  const threadIds = [...new Set(replyRows.map((r) => r.thread_id))];
  const [opps, serps, stats, replies] = await Promise.all([
    supabaseAdmin
      .from("reddit_opportunities")
      .select("*")
      .in("id", oppIds)
      .eq("site_id", scope.siteId),
    supabaseAdmin
      .from("reddit_thread_serp")
      .select("*")
      .in("thread_id", threadIds)
      .order("checked_at", { ascending: true })
      .limit(2000),
    supabaseAdmin
      .from("reddit_thread_stats")
      .select("*")
      .in("thread_id", threadIds)
      .order("checked_at", { ascending: true })
      .limit(2000),
    repliesWithChecks(replyRows),
  ]);
  fail(opps.error);
  fail(serps.error);
  fail(stats.error);

  const views = await hydrateOpportunities(opps.data ?? []);
  const viewById = new Map(views.map((v) => [v.id, v]));

  const out: RedditMention[] = [];
  for (const reply of replies) {
    const view = viewById.get(reply.opportunityId);
    if (!view) continue;
    // A thread's history only means anything from the day the member joined it.
    const since = Date.parse(reply.postedAt) - 86_400_000;
    out.push({
      reply,
      thread: view.thread,
      subreddit: view.thread.subreddit,
      serpHistory: (serps.data ?? [])
        .filter((s) => s.thread_id === reply.threadId && Date.parse(s.checked_at) >= since)
        .map(serpFromRow),
      activity: (stats.data ?? [])
        .filter((s) => s.thread_id === reply.threadId && Date.parse(s.checked_at) >= since)
        .map((s) => ({
          checkedAt: s.checked_at,
          numComments: s.num_comments,
          upVotes: s.up_votes,
        })),
    });
  }
  return out;
}

export async function listLedger(scope: SiteScope, limit = 50): Promise<RedditLedgerEntry[]> {
  if (!(await canRead(scope))) return [];
  const { data, error } = await supabaseAdmin
    .from("reddit_ledger")
    .select("*")
    .eq("site_id", scope.siteId)
    .order("created_at", { ascending: false })
    .limit(limit);
  fail(error);
  return (data ?? []).map(ledgerFromRow);
}

/** What a draft must be checked against, for one opportunity. */
export async function loadComplianceInputs(scope: SiteScope, opportunity: RedditOpportunity) {
  const [settings, brand] = await Promise.all([loadSettingsRow(scope), loadBrandContext(scope, 1)]);
  const sub = opportunity.subredditInfo;
  return {
    settings,
    brand,
    context: {
      brandName: brand.brandName,
      disclosureLine: settings?.disclosure_line ?? "Full disclosure: I work on {brand}.",
      maxLinksPerReply: settings?.max_links_per_reply ?? 1,
      subreddit: opportunity.thread.subreddit,
      rules: sub?.rules ?? [],
      rulesKnown: sub ? sub.rulesSource !== "unavailable" : false,
      // Competitors aren't stored anywhere server-side yet; the check says so
      // in its own words rather than passing silently.
      competitors: [] as string[],
    },
  };
}

/** Whether the subreddit's rules, as we last read them, ban self-promotion. */
export function subredditBansPromo(sub: RedditSubredditView | null): boolean {
  if (!sub) return false;
  return sub.promoBanned || readRules(sub.rules).promoBanned;
}

export { EMPTY_BALANCE };
