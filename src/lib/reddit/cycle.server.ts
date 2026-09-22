/**
 * The Reddit presence cron. Run it daily; the sweep stage paces itself weekly.
 *
 * Stages, each capped and each wrapped so one bad site can't stop the rest:
 *
 *   1. paid      re-sync each site's paid flag. The webhook is the fast path;
 *                this is the backstop that stops a lapsed plan — or a Studio
 *                site that was removed — being swept if a webhook was missed.
 *   2. budget    add up what the last 30 days cost. Over the ceiling, every
 *                stage that SPENDS is skipped — a kill switch, not a throttle.
 *   3. sweeps    paid, enabled, and not swept in six days. Oldest first.
 *   4. verify    replies with a link: is the comment still there?
 *   5. threads   re-measure threads that have a live reply in them.
 *   6. age out   found a month ago and never acted on → stale.
 *
 * Verifying and ageing out keep running for a lapsed site. They keep an
 * existing mention's history honest and they stop nothing; only stages 3–5
 * spend at Apify, and only stage 3 is gated on the paid flag — a member who
 * leaves still deserves to know if their comment was removed.
 */
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { hasRedditEntitlement } from "@/lib/entitlement.server";
import { apifyConfigured } from "./apify.server";
import { runSweep } from "./discover.server";
import { remeasureThreads, verifyReply } from "./verify.server";

type Rpc = {
  rpc: (
    fn: string,
    args: Record<string, unknown>,
  ) => PromiseLike<{ data: unknown; error: { message: string } | null }>;
};
const rpc = supabaseAdmin as unknown as Rpc;

const PAID_SYNC_CAP = 500;
const SWEEP_CAP = 50;
const VERIFY_CAP = 200;
const REMEASURE_CAP = 100;
const REMEASURE_BUDGET_USD = 1;

const DAY = 24 * 60 * 60 * 1000;
const SWEEP_EVERY = 6 * DAY;
const VERIFY_EVERY = 7 * DAY;
const VERIFY_EVERY_WHEN_FAILING = DAY;
const STALE_AFTER = 30 * DAY;

export interface RedditCycleReport {
  paidSynced: number;
  spentLast30dUsd: number;
  budgetStopped: boolean;
  sweepsRun: number;
  sweepsRefused: number;
  verified: number;
  remeasured: number;
  staled: number;
  errors: number;
}

function monthlyBudgetUsd(): number | null {
  const v = Number(process.env.APIFY_MONTHLY_BUDGET_USD);
  return Number.isFinite(v) && v > 0 ? v : null;
}

const ago = (ms: number) => new Date(Date.now() - ms).toISOString();

export async function runRedditCycle(): Promise<RedditCycleReport> {
  const report: RedditCycleReport = {
    paidSynced: 0,
    spentLast30dUsd: 0,
    budgetStopped: false,
    sweepsRun: 0,
    sweepsRefused: 0,
    verified: 0,
    remeasured: 0,
    staled: 0,
    errors: 0,
  };
  const guard = async (fn: () => Promise<void>) => {
    try {
      await fn();
    } catch (err) {
      report.errors += 1;
      console.error("[reddit] cycle step failed:", err);
    }
  };

  /* 1 ── paid flag: the webhook is the fast path, this is the backstop ──── */
  const { data: sites } = await supabaseAdmin
    .from("reddit_settings")
    .select("site_id, user_id")
    .order("paid_checked_at", { ascending: true, nullsFirst: true })
    .limit(PAID_SYNC_CAP);
  for (const site of sites ?? [])
    await guard(async () => {
      const paid = await hasRedditEntitlement(supabaseAdmin, {
        userId: site.user_id,
        siteId: site.site_id,
      });
      await rpc.rpc("reddit_set_paid", { _site_id: site.site_id, _paid: paid });
      report.paidSynced += 1;
    });

  /* 2 ── the kill switch ─────────────────────────────────────────────────── */
  await guard(async () => {
    const { data } = await supabaseAdmin
      .from("reddit_sweeps")
      .select("cost_usd")
      .gte("started_at", ago(30 * DAY))
      .limit(10_000);
    report.spentLast30dUsd =
      Math.round((data ?? []).reduce((sum, r) => sum + Number(r.cost_usd), 0) * 100) / 100;
    const ceiling = monthlyBudgetUsd();
    report.budgetStopped = ceiling !== null && report.spentLast30dUsd >= ceiling;
  });
  const maySpend = apifyConfigured() && !report.budgetStopped;

  /* 3 ── sweeps: paid, switched on, and due ─────────────────────────────── */
  if (maySpend) {
    const { data: due } = await supabaseAdmin
      .from("reddit_settings")
      .select("site_id, user_id")
      .eq("paid_active", true)
      .eq("enabled", true)
      .eq("sweep_enabled", true)
      .or(`last_sweep_at.is.null,last_sweep_at.lt.${ago(SWEEP_EVERY)}`)
      .order("last_sweep_at", { ascending: true, nullsFirst: true })
      .limit(SWEEP_CAP);
    for (const d of due ?? [])
      await guard(async () => {
        // reddit_start_sweep re-checks the paid flag under a lock, so a row
        // that went stale between the select and here is still refused.
        const { result } = await runSweep({ userId: d.user_id, siteId: d.site_id }, "cron");
        if (result.started) report.sweepsRun += 1;
        else report.sweepsRefused += 1;
      });
  }

  /* 4 ── verify: is the comment still there? ─────────────────────────────── */
  if (maySpend) {
    const { data: replies } = await supabaseAdmin
      .from("reddit_replies")
      .select("id, last_checked_at, consecutive_failures")
      .in("status", ["posted", "confirmed"])
      .order("last_checked_at", { ascending: true, nullsFirst: true })
      .limit(VERIFY_CAP * 2);
    const now = Date.now();
    const dueReplies = (replies ?? [])
      .filter((r) => {
        if (!r.last_checked_at) return true;
        const every = r.consecutive_failures > 0 ? VERIFY_EVERY_WHEN_FAILING : VERIFY_EVERY;
        return now - Date.parse(r.last_checked_at) >= every;
      })
      .slice(0, VERIFY_CAP);
    for (const r of dueReplies)
      await guard(async () => {
        await verifyReply(r.id, null);
        report.verified += 1;
      });
  }

  /* 5 ── re-measure the threads our members are actually in ─────────────── */
  if (maySpend)
    await guard(async () => {
      const { data: live } = await supabaseAdmin
        .from("reddit_replies")
        .select("thread_id")
        .eq("status", "confirmed")
        .limit(2000);
      const threadIds = [...new Set((live ?? []).map((r) => r.thread_id))];
      if (threadIds.length === 0) return;
      const { data: recent } = await supabaseAdmin
        .from("reddit_thread_stats")
        .select("thread_id")
        .in("thread_id", threadIds)
        .gte("checked_at", ago(VERIFY_EVERY));
      const fresh = new Set((recent ?? []).map((r) => r.thread_id));
      const due = threadIds.filter((id) => !fresh.has(id)).slice(0, REMEASURE_CAP);
      report.remeasured = await remeasureThreads(due, REMEASURE_BUDGET_USD);
    });

  /* 6 ── age out: found a month ago and never acted on ───────────────────── */
  await guard(async () => {
    const { data } = await supabaseAdmin
      .from("reddit_opportunities")
      .update({ status: "stale" })
      .eq("status", "new")
      .lt("first_seen_at", ago(STALE_AFTER))
      .select("id");
    report.staled = (data ?? []).length;
  });

  return report;
}
