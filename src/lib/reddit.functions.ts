/**
 * Reddit presence's server functions — the only way the dashboard reads or
 * changes anything about it.
 *
 * Every function authenticates the caller and then acts with the service
 * role: members have SELECT-only RLS on their own rows and no access at all to
 * the shared thread cache, so nothing here can be bypassed by calling the Data
 * API. Everything is per SITE: each call names one with `siteId`, which only
 * ever chooses between sites the caller owns. Every write re-checks the PAID
 * gate for that site on the server — Reddit presence is not part of the trial.
 * The page's gate is a courtesy; this is the rule; and for the one thing that
 * spends real money, `reddit_start_sweep` is the rule behind the rule.
 *
 * The guard chain, always in this order:
 *   auth → site (owned; live, for anything that writes or spends)
 *        → paid plan (the site's) → rate limit (anything that costs money,
 *          per person) → the work
 *
 * Nothing here posts to Reddit, and nothing here could: Rankbox holds no
 * Reddit credential. `markRedditReplyPosted` records what the MEMBER did.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type {
  RedditDraft,
  RedditLedgerEntry,
  RedditMention,
  RedditOpportunity,
  RedditOpportunityDetail,
  RedditOverview,
  RedditReply,
  RedditSettings,
  RedditSweepResult,
} from "@/lib/reddit/types";

const Uuid = z.string().uuid();
const SiteInput = z.object({ siteId: Uuid });
const Subreddit = z
  .string()
  .trim()
  .transform((s) =>
    s
      .replace(/^\/?r\//i, "")
      .replace(/\/+$/, "")
      .toLowerCase(),
  )
  .pipe(z.string().regex(/^[a-z0-9_]{2,21}$/, "That doesn't look like a subreddit name."));
const Tag = z.string().trim().min(2).max(40);

const SettingsPatch = SiteInput.extend({
  sweepEnabled: z.boolean().optional(),
  niche: z.string().trim().max(160).optional(),
  topicTags: z.array(Tag).max(12).optional(),
  // Shape only. That it names the brand and states the tie is checked against
  // the site's actual brand name in the handler — it can't be known here.
  disclosureLine: z.string().trim().min(10).max(200).optional(),
  tone: z.string().trim().max(80).optional(),
  maxLinksPerReply: z.number().int().min(0).max(1).optional(),
  allowSubreddits: z.array(Subreddit).max(50).optional(),
  denySubreddits: z.array(Subreddit).max(50).optional(),
  keywordsPerSweep: z.number().int().min(1).max(30).optional(),
});

function dedupe(list: string[]): string[] {
  return [...new Set(list.map((s) => s.trim()).filter(Boolean))];
}

const DISCLOSURE_PROBLEM =
  "Your disclosure line has to name your brand and say, in the first person, that you work on it.";

/* ── Reads ──────────────────────────────────────────────────────── */

// Reads accept any site the caller owns, live or not: a removed or archived
// site keeps its history, read-only, exactly like a lapsed plan.

export const getRedditOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SiteInput.parse(d))
  .handler(async ({ data, context }): Promise<RedditOverview> => {
    const { requireSiteScope } = await import("@/lib/sites.server");
    const scope = await requireSiteScope(context.userId, data.siteId);
    const { loadOverview } = await import("@/lib/reddit/reddit.server");
    return loadOverview(scope);
  });

export const listRedditOpportunities = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SiteInput.parse(d))
  .handler(async ({ data, context }): Promise<RedditOpportunity[]> => {
    const { requireSiteScope } = await import("@/lib/sites.server");
    const scope = await requireSiteScope(context.userId, data.siteId);
    const { listOpportunities } = await import("@/lib/reddit/reddit.server");
    return listOpportunities(scope);
  });

export const getRedditOpportunity = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SiteInput.extend({ id: Uuid }).parse(d))
  .handler(async ({ data, context }): Promise<RedditOpportunityDetail | null> => {
    const { requireSiteScope } = await import("@/lib/sites.server");
    const scope = await requireSiteScope(context.userId, data.siteId);
    const { getOpportunity } = await import("@/lib/reddit/reddit.server");
    return getOpportunity(scope, data.id);
  });

export const listRedditMentions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SiteInput.parse(d))
  .handler(async ({ data, context }): Promise<RedditMention[]> => {
    const { requireSiteScope } = await import("@/lib/sites.server");
    const scope = await requireSiteScope(context.userId, data.siteId);
    const { listMentions } = await import("@/lib/reddit/reddit.server");
    return listMentions(scope);
  });

export const listRedditLedger = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SiteInput.parse(d))
  .handler(async ({ data, context }): Promise<RedditLedgerEntry[]> => {
    const { requireSiteScope } = await import("@/lib/sites.server");
    const scope = await requireSiteScope(context.userId, data.siteId);
    const { listLedger } = await import("@/lib/reddit/reddit.server");
    return listLedger(scope);
  });

/* ── Settings ───────────────────────────────────────────────────── */

export const enableReddit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SettingsPatch.parse(d))
  .handler(async ({ data, context }): Promise<RedditSettings> => {
    const { requirePaidSite, loadBrandContext, settingsFromRow } =
      await import("@/lib/reddit/reddit.server");
    const scope = await requirePaidSite(context.userId, data.siteId);
    const { isValidDisclosureLine } = await import("@/lib/reddit/compliance");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const brand = await loadBrandContext(scope, 1);
    if (!brand.brandName)
      throw new Error(
        "Add this site's brand name in Settings first — every reply has to say who you are.",
      );
    const line = data.disclosureLine ?? "Full disclosure: I work on {brand}.";
    if (!isValidDisclosureLine(line, brand.brandName)) throw new Error(DISCLOSURE_PROBLEM);

    // paid_active is NOT written here. Only the webhook and the cron's re-sync
    // set it, from the subscription itself — never from a member's request.
    const { data: row, error } = await supabaseAdmin
      .from("reddit_settings")
      .upsert(
        {
          site_id: scope.siteId,
          user_id: scope.userId,
          enabled: true,
          disclosure_line: line,
          niche: data.niche || null,
          topic_tags: dedupe(data.topicTags ?? []),
          tone: data.tone || "plain",
          max_links_per_reply: data.maxLinksPerReply ?? 1,
        },
        { onConflict: "site_id" },
      )
      .select("*")
      .single();
    if (error || !row) throw new Error(error?.message ?? "Couldn't switch Reddit presence on.");

    // The webhook may not have created this site's row before now, so the
    // flag would still be false. Bring it up to date from the subscription.
    const { hasRedditEntitlement } = await import("@/lib/entitlement.server");
    const paid = await hasRedditEntitlement(supabaseAdmin, scope);
    await (
      supabaseAdmin as unknown as { rpc: (f: string, a: unknown) => PromiseLike<unknown> }
    ).rpc("reddit_set_paid", { _site_id: scope.siteId, _paid: paid });
    return settingsFromRow(row);
  });

export const updateRedditSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SettingsPatch.parse(d))
  .handler(async ({ data, context }): Promise<RedditSettings> => {
    const { requirePaidSite, loadBrandContext, settingsFromRow } =
      await import("@/lib/reddit/reddit.server");
    const scope = await requirePaidSite(context.userId, data.siteId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    if (data.disclosureLine !== undefined) {
      const { isValidDisclosureLine } = await import("@/lib/reddit/compliance");
      const brand = await loadBrandContext(scope, 1);
      if (!isValidDisclosureLine(data.disclosureLine, brand.brandName))
        throw new Error(DISCLOSURE_PROBLEM);
    }

    const patch: Record<string, unknown> = {};
    if (data.sweepEnabled !== undefined) patch.sweep_enabled = data.sweepEnabled;
    if (data.niche !== undefined) patch.niche = data.niche || null;
    if (data.topicTags !== undefined) patch.topic_tags = dedupe(data.topicTags);
    if (data.disclosureLine !== undefined) patch.disclosure_line = data.disclosureLine;
    if (data.tone !== undefined) patch.tone = data.tone || "plain";
    if (data.maxLinksPerReply !== undefined) patch.max_links_per_reply = data.maxLinksPerReply;
    if (data.allowSubreddits !== undefined) patch.allow_subreddits = dedupe(data.allowSubreddits);
    if (data.denySubreddits !== undefined) patch.deny_subreddits = dedupe(data.denySubreddits);
    if (data.keywordsPerSweep !== undefined) patch.keywords_per_sweep = data.keywordsPerSweep;

    const { data: row, error } = await supabaseAdmin
      .from("reddit_settings")
      .update(patch as never)
      .eq("site_id", scope.siteId)
      .eq("user_id", scope.userId)
      .select("*")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Set up Reddit presence first.");

    // Settings decide what counts as an opportunity, so everything is
    // re-ranked. Free: it reads our own tables and runs the pure scorer.
    const { rescoreOpportunities } = await import("@/lib/reddit/discover.server");
    await rescoreOpportunities(scope).catch(() => 0);
    return settingsFromRow(row);
  });

/* ── Sweep ──────────────────────────────────────────────────────── */

export const runRedditSweep = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SiteInput.parse(d))
  .handler(async ({ data, context }): Promise<RedditSweepResult> => {
    const { requireLiveSite } = await import("@/lib/sites.server");
    await requireLiveSite(context.userId, data.siteId);
    const scope = { userId: context.userId, siteId: data.siteId };
    const { hasRedditEntitlement } = await import("@/lib/entitlement.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // A refusal here is a normal outcome, so it is returned, not thrown.
    if (!(await hasRedditEntitlement(supabaseAdmin, scope)))
      return { started: false, reason: "not_paid" };
    const { assertAiRateLimit } = await import("@/lib/rate-limit.server");
    await assertAiRateLimit(context.userId);
    const { runSweep } = await import("@/lib/reddit/discover.server");
    const { result } = await runSweep(scope, "manual");
    return result;
  });

/* ── Drafts ─────────────────────────────────────────────────────── */

export const generateRedditDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    SiteInput.extend({
      opportunityId: Uuid,
      instructions: z.string().trim().max(500).optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }): Promise<RedditDraft> => {
    const { requirePaidSite } = await import("@/lib/reddit/reddit.server");
    const scope = await requirePaidSite(context.userId, data.siteId);
    const { assertAiRateLimit } = await import("@/lib/rate-limit.server");
    await assertAiRateLimit(context.userId);
    const { writeDraft } = await import("@/lib/reddit/draft.server");
    return writeDraft(scope, data.opportunityId, data.instructions ?? "");
  });

export const regenerateRedditDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    SiteInput.extend({
      draftId: Uuid,
      instructions: z.string().trim().max(500).default(""),
    }).parse(d),
  )
  .handler(async ({ data, context }): Promise<RedditDraft> => {
    const { requirePaidSite } = await import("@/lib/reddit/reddit.server");
    const scope = await requirePaidSite(context.userId, data.siteId);
    const { assertAiRateLimit } = await import("@/lib/rate-limit.server");
    await assertAiRateLimit(context.userId);
    const { rewriteDraft } = await import("@/lib/reddit/draft.server");
    return rewriteDraft(scope, data.draftId, data.instructions);
  });

export const updateRedditDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    SiteInput.extend({ draftId: Uuid, body: z.string().trim().min(1).max(4000) }).parse(d),
  )
  .handler(async ({ data, context }): Promise<RedditDraft> => {
    const { requirePaidSite } = await import("@/lib/reddit/reddit.server");
    const scope = await requirePaidSite(context.userId, data.siteId);
    const { saveDraftEdit } = await import("@/lib/reddit/draft.server");
    return saveDraftEdit(scope, data.draftId, data.body);
  });

/* ── The hand-off ───────────────────────────────────────────────── */

export const markRedditReplyPosted = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    SiteInput.extend({
      opportunityId: Uuid,
      permalink: z.string().trim().max(500).optional(),
      draftId: Uuid.optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }): Promise<RedditReply> => {
    const { requirePaidSite, getOpportunity } = await import("@/lib/reddit/reddit.server");
    const scope = await requirePaidSite(context.userId, data.siteId);
    const detail = await getOpportunity(scope, data.opportunityId);
    if (!detail) throw new Error("That thread isn't in your list any more.");

    // This is user input claiming an outcome, so it is treated as hostile: the
    // host must really be Reddit, and the post id must be THIS thread's.
    const { parsePermalink, permalinkProblem } = await import("@/lib/reddit/permalink");
    const link = data.permalink?.trim() || "";
    if (link) {
      const problem = permalinkProblem(link, detail.opportunity.thread.redditId);
      if (problem) throw new Error(problem);
    }
    const parsed = link ? parsePermalink(link) : null;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: replyId, error } = await (
      supabaseAdmin as unknown as {
        rpc: (
          f: string,
          a: unknown,
        ) => PromiseLike<{ data: string | null; error: { message: string } | null }>;
      }
    ).rpc("reddit_record_reply", {
      _site_id: scope.siteId,
      _opportunity_id: data.opportunityId,
      _draft_id: data.draftId ?? null,
      _permalink: parsed?.canonical ?? null,
      _comment_id: parsed?.commentId ?? null,
    });
    if (error) throw new Error(error.message);
    // The rule is per person, not per site: a reply standing in this thread
    // from any of the owner's sites refuses a second one.
    if (!replyId)
      throw new Error(
        "You've already recorded a reply in this thread, from this site or another of yours. One reply per thread.",
      );

    const after = await getOpportunity(scope, data.opportunityId);
    if (!after?.reply) throw new Error("Recorded, but couldn't be read back. Refresh the page.");
    return after.reply;
  });

export const verifyRedditReply = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SiteInput.extend({ replyId: Uuid }).parse(d))
  .handler(async ({ data, context }): Promise<{ outcome: string }> => {
    const { requirePaidSite } = await import("@/lib/reddit/reddit.server");
    const scope = await requirePaidSite(context.userId, data.siteId);
    const { assertAiRateLimit } = await import("@/lib/rate-limit.server");
    await assertAiRateLimit(context.userId);
    const { verifyReply } = await import("@/lib/reddit/verify.server");
    const { outcome } = await verifyReply(data.replyId, scope);
    return { outcome };
  });

/* ── Triage ─────────────────────────────────────────────────────── */

export const dismissRedditOpportunity = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    SiteInput.extend({ id: Uuid, reason: z.string().trim().max(200).default("") }).parse(d),
  )
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { requirePaidSite } = await import("@/lib/reddit/reddit.server");
    const scope = await requirePaidSite(context.userId, data.siteId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Never a thread they replied in: that record is theirs to keep.
    const { error } = await supabaseAdmin
      .from("reddit_opportunities")
      .update({ status: "dismissed", dismiss_reason: data.reason })
      .eq("id", data.id)
      .eq("site_id", scope.siteId)
      .eq("user_id", scope.userId)
      .neq("status", "posted");
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const restoreRedditOpportunity = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SiteInput.extend({ id: Uuid }).parse(d))
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { requirePaidSite } = await import("@/lib/reddit/reddit.server");
    const scope = await requirePaidSite(context.userId, data.siteId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: drafts } = await supabaseAdmin
      .from("reddit_drafts")
      .select("id")
      .eq("opportunity_id", data.id)
      .eq("site_id", scope.siteId)
      .limit(1);
    const { error } = await supabaseAdmin
      .from("reddit_opportunities")
      .update({ status: (drafts ?? []).length > 0 ? "drafted" : "new", dismiss_reason: "" })
      .eq("id", data.id)
      .eq("site_id", scope.siteId)
      .eq("user_id", scope.userId)
      .eq("status", "dismissed");
    if (error) throw new Error(error.message);
    // The thread may have closed while it sat dismissed; let the scorer say.
    const { rescoreOpportunities } = await import("@/lib/reddit/discover.server");
    await rescoreOpportunities(scope).catch(() => 0);
    return { ok: true };
  });
