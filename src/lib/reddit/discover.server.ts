/**
 * The sweep: turning a site's tracked keywords into ranked Reddit threads.
 *
 * Two channels, unioned on Reddit's own post id:
 *   A  Google's results for each keyword, keeping the Reddit threads. These
 *      carry a MEASURED position. Cheap — a fraction of a cent a keyword.
 *   B  Reddit's own search over the top few keywords: threads with life in
 *      them that may not rank yet. The expensive channel, so capped apart.
 *
 * Then: hydrate what we haven't loaded, read the rules of subreddits we
 * haven't seen, optionally ask the AI engines, score with the pure scorer, and
 * upsert one opportunity per thread, per site. The thread cache is shared by
 * every site; the opportunities, the sweep log and its interval are the site's.
 *
 * Like the exchange's engine, this never throws. Every stage is its own
 * try/catch and spends against one running budget; a stage that fails or runs
 * dry leaves the sweep `partial`, which is a normal day, not an incident.
 * What is never done is guess: a thread we couldn't afford to load is stored
 * as found-but-unloaded and says so on screen.
 */
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { SiteScope } from "@/lib/entitlement.server";
import {
  apifyConfigured,
  askAiEngines,
  enabledAiEngines,
  fetchRedditPosts,
  fetchSubreddit,
  redditActor,
  searchGoogle,
  searchReddit,
  SERP_COUNTRY,
  SERP_DEVICE,
  SweepBudget,
} from "./apify.server";
import {
  absolutePosition,
  aiResultsOf,
  answerSnippet,
  bestKeywordFor,
  groupScrape,
  redditIdsCitedIn,
  redditResultsOf,
  serpQueryOf,
  toSubredditInfo,
  type NormalizedPost,
} from "./normalize";
import {
  loadBrandContext,
  loadSettingsRow,
  scoreContextOf,
  type SettingsRow,
  type SubredditRow,
  type ThreadRow,
} from "./reddit.server";
import { readRules } from "./rules";
import { blockedReasonFor, scoreOpportunity, type ScoreContext, type ScoreInput } from "./scoring";
import type { RedditSweep, RedditSweepResult } from "./types";

type Rpc = {
  rpc: (
    fn: string,
    args: Record<string, unknown>,
  ) => PromiseLike<{ data: unknown; error: { message: string } | null }>;
};
const rpc = supabaseAdmin as unknown as Rpc;

const CHANNEL_B_KEYWORDS = 8;
const CHANNEL_B_PER_KEYWORD = 15;
const HYDRATE_CAP = 25;
const HYDRATE_STALE_MS = 72 * 60 * 60 * 1000;
const SUBREDDIT_CAP = 6;
const SUBREDDIT_STALE_MS = 30 * 24 * 60 * 60 * 1000;
const AI_KEYWORDS = 3;
const COMMENTS_PER_POST = 5;

const MANUAL_INTERVAL = "10 minutes";
const CRON_INTERVAL = "6 days";

function serpPages(): number {
  const n = Number(process.env.APIFY_SERP_PAGES);
  return Number.isFinite(n) && n >= 1 && n <= 5 ? Math.trunc(n) : 2;
}

interface Found {
  redditId: string;
  subreddit: string;
  permalink: string;
  title: string;
  keyword: string;
  channel: "serp" | "search" | "both";
  position: number | null;
  post: NormalizedPost | null;
}

export interface SweepReport {
  sweepId: string;
  status: "ok" | "partial" | "failed";
  threadsSeen: number;
  created: number;
  costUsd: number;
  errors: string[];
}

/* ── Scoring against stored rows ────────────────────────────────── */

function rulesOf(sub: SubredditRow | undefined): string[] {
  return Array.isArray(sub?.rules)
    ? sub.rules.filter((r): r is string => typeof r === "string")
    : [];
}

function scoreInputOf(
  thread: ThreadRow,
  sub: SubredditRow | undefined,
  position: number | null,
  ai: { checked: boolean; cited: boolean },
): ScoreInput {
  return {
    redditId: thread.reddit_id,
    subreddit: thread.subreddit,
    title: thread.title,
    body: thread.body,
    upVotes: thread.up_votes,
    numComments: thread.num_comments,
    postedAt: thread.posted_at,
    isLocked: thread.is_locked,
    isArchived: thread.is_archived,
    isRemoved: thread.is_removed,
    partialData: thread.hydrated_at === null,
    googlePosition: position,
    aiChecked: ai.checked,
    aiCited: ai.cited,
    subredditTitle: sub?.title ?? "",
    subredditDescription: sub?.public_description ?? "",
    subredditTags: sub?.topic_tags ?? [],
    subredditRules: rulesOf(sub),
    rulesKnown: Boolean(sub) && sub?.rules_source !== "unavailable",
    promoBanned: sub?.promo_banned ?? false,
  };
}

/**
 * Scores a site's threads from what is stored and upserts the opportunities.
 * Free: it reads our own tables and runs the pure scorer. Used by the sweep,
 * by a settings change (a new deny list re-ranks everything), and by the cron.
 */
export async function scoreThreads(
  scope: SiteScope,
  ctx: ScoreContext,
  threadIds: string[],
  meta: Map<string, { keyword: string; channel: string }>,
  sweepId: string | null,
): Promise<{ created: number; scored: number }> {
  if (threadIds.length === 0) return { created: 0, scored: 0 };

  const [threads, serps, ais] = await Promise.all([
    supabaseAdmin.from("reddit_threads").select("*").in("id", threadIds),
    supabaseAdmin
      .from("reddit_thread_serp")
      .select("thread_id, position, checked_at")
      .in("thread_id", threadIds)
      .order("checked_at", { ascending: false }),
    supabaseAdmin
      .from("reddit_thread_ai_citations")
      .select("thread_id, cited")
      .in("thread_id", threadIds),
  ]);
  const rows = threads.data ?? [];
  const subNames = [...new Set(rows.map((t) => t.subreddit))];
  const subs = subNames.length
    ? await supabaseAdmin.from("reddit_subreddits").select("*").in("name", subNames)
    : { data: [] as SubredditRow[] };
  const subByName = new Map((subs.data ?? []).map((s) => [s.name, s]));

  const latestPosition = new Map<string, number>();
  for (const s of serps.data ?? [])
    if (!latestPosition.has(s.thread_id)) latestPosition.set(s.thread_id, s.position);
  const ai = new Map<string, { checked: boolean; cited: boolean }>();
  for (const a of ais.data ?? []) {
    const prev = ai.get(a.thread_id) ?? { checked: true, cited: false };
    ai.set(a.thread_id, { checked: true, cited: prev.cited || a.cited });
  }

  let created = 0;
  let scored = 0;
  for (const thread of rows) {
    const input = scoreInputOf(
      thread,
      subByName.get(thread.subreddit),
      latestPosition.get(thread.id) ?? null,
      ai.get(thread.id) ?? { checked: false, cited: false },
    );
    const { score, ...breakdown } = scoreOpportunity(input, ctx);
    const m = meta.get(thread.id);
    const { data, error } = await rpc.rpc("reddit_upsert_opportunity", {
      _site_id: scope.siteId,
      _thread_id: thread.id,
      _sweep_id: sweepId,
      _keyword: m?.keyword ?? "",
      _channel: m?.channel ?? "search",
      _score: Math.round(score * 1000) / 1000,
      _breakdown: breakdown,
      _blocked_reason: blockedReasonFor(input, ctx),
    });
    if (error) continue;
    scored += 1;
    if ((data as { created?: boolean } | null)?.created) created += 1;
  }
  return { created, scored };
}

/** Re-rank everything a site already has. Free — nothing is fetched. */
export async function rescoreOpportunities(scope: SiteScope): Promise<number> {
  const [settings, brand] = await Promise.all([loadSettingsRow(scope), loadBrandContext(scope)]);
  const { data } = await supabaseAdmin
    .from("reddit_opportunities")
    .select("thread_id, matched_keyword, channel")
    .eq("site_id", scope.siteId)
    .in("status", ["new", "saved", "drafted", "dead"])
    .limit(1000);
  const rows = data ?? [];
  const meta = new Map(
    rows.map((r) => [r.thread_id, { keyword: r.matched_keyword, channel: r.channel }]),
  );
  const { scored } = await scoreThreads(
    scope,
    scoreContextOf(settings, brand),
    rows.map((r) => r.thread_id),
    meta,
    null,
  );
  return scored;
}

/* ── The sweep ──────────────────────────────────────────────────── */

export async function runSweep(
  scope: SiteScope,
  trigger: "cron" | "manual",
): Promise<{ result: RedditSweepResult; report: SweepReport | null }> {
  const refuse = (reason: Extract<RedditSweepResult, { started: false }>["reason"]) => ({
    result: { started: false as const, reason },
    report: null,
  });

  // Checked before the database is touched, so an unconfigured workspace
  // doesn't burn a site's sweep interval on a run that could find nothing.
  if (!apifyConfigured()) return refuse("unconfigured");

  const settings = await loadSettingsRow(scope);
  if (!settings?.enabled) return refuse("not_enabled");

  const brand = await loadBrandContext(scope, 60);
  const keywords = brand.keywords.slice(0, settings.keywords_per_sweep);
  if (keywords.length === 0) return refuse("no_keywords");

  // The authority on whether money may be spent. It re-checks the paid flag
  // under a lock; everything above this line is courtesy.
  const started = await rpc.rpc("reddit_start_sweep", {
    _site_id: scope.siteId,
    _keywords: keywords,
    _trigger: trigger,
    _min_interval: trigger === "manual" ? MANUAL_INTERVAL : CRON_INTERVAL,
  });
  const verdict = (started.data ?? {}) as { sweep_id?: string; reason?: string };
  if (started.error || !verdict.sweep_id) {
    const reason = verdict.reason;
    if (
      reason === "not_paid" ||
      reason === "already_running" ||
      reason === "too_soon" ||
      reason === "not_enabled"
    )
      return refuse(reason);
    return refuse("unconfigured");
  }

  const report = await sweep(
    scope,
    verdict.sweep_id,
    settings,
    keywords,
    scoreContextOf(settings, brand),
  );
  const { data: row } = await supabaseAdmin
    .from("reddit_sweeps")
    .select("*")
    .eq("id", verdict.sweep_id)
    .maybeSingle();
  const view: RedditSweep = {
    id: verdict.sweep_id,
    status: report.status,
    trigger,
    keywordsUsed: keywords,
    threadsSeen: report.threadsSeen,
    opportunitiesCreated: report.created,
    error: report.errors[0] ?? "",
    startedAt: row?.started_at ?? new Date().toISOString(),
    finishedAt: row?.finished_at ?? new Date().toISOString(),
  };
  return { result: { started: true, sweep: view }, report };
}

async function sweep(
  scope: SiteScope,
  sweepId: string,
  settings: SettingsRow,
  keywords: string[],
  ctx: ScoreContext,
): Promise<SweepReport> {
  const budget = new SweepBudget();
  const errors: string[] = [];
  const found = new Map<string, Found>();
  const guard = async (stage: string, fn: () => Promise<void>) => {
    try {
      await fn();
    } catch (e) {
      errors.push(`${stage}: ${e instanceof Error ? e.message : "failed"}`.slice(0, 200));
    }
  };
  let created = 0;
  const checkedAt = new Date().toISOString();

  /* A. Google: the threads that already rank. */
  await guard("serp", async () => {
    const res = await searchGoogle(keywords, {
      pages: serpPages(),
      maxChargeUsd: budget.allowance(),
    });
    budget.record(res);
    budget.counts.serpQueries = res.ok ? keywords.length : 0;
    if (!res.ok && res.reason !== "budget") errors.push(`serp: ${res.reason}`);
    for (const item of res.items) {
      const { term, page } = serpQueryOf(item);
      const organic = (item as { organicResults?: unknown }).organicResults;
      for (const hit of redditResultsOf(organic)) {
        const position = absolutePosition(hit.position, page);
        const prev = found.get(hit.redditId);
        if (prev && prev.position !== null && prev.position <= position) continue;
        found.set(hit.redditId, {
          ...hit,
          keyword: term || bestKeywordFor(hit.title, keywords),
          channel: "serp",
          position,
          post: null,
        });
      }
    }
  });

  /* B. Reddit's own search: threads with life in them. */
  await guard("search", async () => {
    const top = keywords.slice(0, CHANNEL_B_KEYWORDS);
    const res = await searchReddit(top, {
      perQuery: CHANNEL_B_PER_KEYWORD,
      maxChargeUsd: budget.allowance(),
    });
    budget.record(res);
    budget.counts.redditQueries = res.ok ? top.length : 0;
    if (!res.ok && res.reason !== "budget") errors.push(`search: ${res.reason}`);
    for (const post of groupScrape(res.items)) {
      const prev = found.get(post.redditId);
      if (prev) found.set(post.redditId, { ...prev, channel: "both", post });
      else
        found.set(post.redditId, {
          redditId: post.redditId,
          subreddit: post.subreddit,
          permalink: post.permalink,
          title: post.title,
          keyword: bestKeywordFor(post.title, top),
          channel: "search",
          position: null,
          post,
        });
    }
  });

  /* Hydrate what ranks but was never loaded — best-ranked first, to a cap. */
  await guard("hydrate", async () => {
    const ids = [...found.keys()];
    if (ids.length === 0) return;
    const { data: known } = await supabaseAdmin
      .from("reddit_threads")
      .select("reddit_id, hydrated_at")
      .in("reddit_id", ids);
    const fresh = new Set(
      (known ?? [])
        .filter((k) => k.hydrated_at && Date.now() - Date.parse(k.hydrated_at) < HYDRATE_STALE_MS)
        .map((k) => k.reddit_id),
    );
    const need = [...found.values()]
      .filter((f) => !f.post && !fresh.has(f.redditId))
      .sort((a, b) => (a.position ?? 999) - (b.position ?? 999))
      .slice(0, HYDRATE_CAP);
    if (need.length === 0) return;
    const res = await fetchRedditPosts(
      need.map((f) => f.permalink),
      { commentsPerPost: COMMENTS_PER_POST, maxChargeUsd: budget.allowance() },
    );
    budget.record(res);
    for (const post of groupScrape(res.items)) {
      const f = found.get(post.redditId);
      if (f) f.post = post;
    }
  });

  /* Store the threads and this sweep's measured positions. */
  const threadIdByReddit = new Map<string, string>();
  await guard("store", async () => {
    for (const f of found.values()) {
      const payload: Record<string, unknown> = {
        reddit_id: f.redditId,
        subreddit: f.subreddit,
        permalink: f.permalink,
        title: f.title,
      };
      if (f.post) {
        Object.assign(payload, {
          title: f.post.title || f.title,
          body: f.post.body,
          author: f.post.author,
          up_votes: f.post.upVotes,
          num_comments: f.post.numComments,
          is_locked: f.post.isLocked,
          is_removed: f.post.isRemoved,
          hydrated_at: checkedAt,
          hydration_source: `apify:${redditActor()}`,
        });
        if (f.post.postedAt) payload.posted_at = f.post.postedAt;
        // Only when the actor actually said. Absent stays unknown.
        if (f.post.isArchived !== null) payload.is_archived = f.post.isArchived;
        if (f.post.topComments.length > 0) payload.top_comments = f.post.topComments;
      }
      const { data, error } = await rpc.rpc("reddit_upsert_thread", { _payload: payload });
      if (error || typeof data !== "string") continue;
      threadIdByReddit.set(f.redditId, data);
    }
    const serpRows = [...found.values()]
      .filter((f) => f.position !== null && threadIdByReddit.has(f.redditId))
      .map((f) => ({
        thread_id: threadIdByReddit.get(f.redditId) as string,
        query: f.keyword,
        position: Math.min(100, f.position as number),
        country: SERP_COUNTRY,
        device: SERP_DEVICE,
        checked_at: checkedAt,
      }));
    if (serpRows.length > 0) await supabaseAdmin.from("reddit_thread_serp").insert(serpRows);
  });

  /* Read the rules of subreddits we haven't seen, or haven't seen lately. */
  await guard("subreddits", async () => {
    const names = [...new Set([...found.values()].map((f) => f.subreddit))];
    if (names.length === 0) return;
    const { data: known } = await supabaseAdmin
      .from("reddit_subreddits")
      .select("name, rules_checked_at")
      .in("name", names);
    const recent = new Set(
      (known ?? [])
        .filter(
          (k) =>
            k.rules_checked_at && Date.now() - Date.parse(k.rules_checked_at) < SUBREDDIT_STALE_MS,
        )
        .map((k) => k.name),
    );
    for (const name of names.filter((n) => !recent.has(n)).slice(0, SUBREDDIT_CAP)) {
      const res = await fetchSubreddit(name, { maxChargeUsd: budget.allowance() });
      budget.record(res);
      const info = res.ok ? toSubredditInfo(res.items, name) : null;
      const reading = readRules(info?.rules ?? []);
      // A failed or rule-less scrape is recorded as UNAVAILABLE — never as "no
      // rules". `allows_self_promo` stays NULL: we do not know.
      const found = Boolean(info?.rulesFound);
      await supabaseAdmin.from("reddit_subreddits").upsert(
        {
          name,
          title: info?.title ?? "",
          public_description: info?.publicDescription ?? "",
          subscribers: info?.subscribers ?? null,
          over_18: info?.over18 ?? false,
          rules: info?.rules ?? [],
          rules_source: found ? "scrape" : "unavailable",
          rules_checked_at: checkedAt,
          allows_self_promo: found ? !reading.promoBanned : null,
          promo_banned: found ? reading.promoBanned : false,
        },
        { onConflict: "name" },
      );
    }
  });

  /* Ask the AI engines — only if an operator switched any on. */
  await guard("ai", async () => {
    const engines = enabledAiEngines();
    if (engines.length === 0) return;
    const asked = keywords.slice(0, AI_KEYWORDS);
    const res = await askAiEngines(asked, engines, { maxChargeUsd: budget.allowance() });
    budget.record(res);
    if (!res.ok) return;
    const rows: Array<Record<string, unknown>> = [];
    for (const item of res.items) {
      const { term } = serpQueryOf(item);
      // The threads this answer COULD have cited: the ones ranking for the query.
      const candidates = [...found.values()].filter(
        (f) => f.keyword === term && threadIdByReddit.has(f.redditId),
      );
      for (const { engine, payload } of aiResultsOf(item)) {
        const cited = redditIdsCitedIn(payload);
        const snippet = answerSnippet(payload);
        const seen = new Set<string>();
        for (const f of candidates) {
          seen.add(f.redditId);
          // cited = false is written on purpose. It is the record that we
          // asked, and it is what separates "not cited" from "not checked".
          rows.push({
            thread_id: threadIdByReddit.get(f.redditId),
            query: term,
            engine,
            cited: cited.has(f.redditId),
            snippet: cited.has(f.redditId) ? snippet : "",
            checked_at: checkedAt,
          });
        }
        for (const id of cited)
          if (!seen.has(id) && threadIdByReddit.has(id))
            rows.push({
              thread_id: threadIdByReddit.get(id),
              query: term,
              engine,
              cited: true,
              snippet,
              checked_at: checkedAt,
            });
        budget.counts.aiChecks += 1;
      }
    }
    if (rows.length > 0)
      await supabaseAdmin.from("reddit_thread_ai_citations").insert(rows as never);
  });

  /* Score, with the pure scorer, and surface. */
  await guard("score", async () => {
    const meta = new Map<string, { keyword: string; channel: string }>();
    for (const f of found.values()) {
      const id = threadIdByReddit.get(f.redditId);
      if (id) meta.set(id, { keyword: f.keyword, channel: f.channel });
    }
    const out = await scoreThreads(scope, ctx, [...meta.keys()], meta, sweepId);
    created = out.created;
  });

  const nothing = found.size === 0 && errors.length > 0;
  const status: SweepReport["status"] = nothing
    ? "failed"
    : errors.length > 0 || budget.exhausted
      ? "partial"
      : "ok";
  await supabaseAdmin
    .from("reddit_sweeps")
    .update({
      status,
      serp_queries: budget.counts.serpQueries,
      reddit_queries: budget.counts.redditQueries,
      ai_checks: budget.counts.aiChecks,
      threads_seen: found.size,
      opportunities_created: created,
      cost_usd: budget.spent,
      error: errors.join(" | ").slice(0, 1000),
      finished_at: new Date().toISOString(),
    })
    .eq("id", sweepId);

  void settings;
  return { sweepId, status, threadsSeen: found.size, created, costUsd: budget.spent, errors };
}
