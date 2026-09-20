/**
 * The exchange's housekeeping, run by the cron route.
 *
 * Each stage is capped so one run can't blow the request budget, and each
 * item is its own try/catch so one bad site can't stall the rest:
 *
 *   1. paid       re-sync every site's paid flag from its subscription
 *   2. discover   find the live URL of articles carrying placed links
 *   3. settle     verify placed links; a "live" verdict moves the credits
 *   4. recheck    re-verify live links; three failures over 72h charge back
 *   5. expire     refund links that never went live in their window
 *   6. orphans    refund links whose article is gone, or no longer has them
 *   7. standing   recompute authority, tier and reputation
 */
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { discoverPublishedUrl } from "./discover-url.server";
import { isOnDomain } from "./domain";
import { clawbackPlacement, refundPlacement, syncPaidFlag } from "./exchange.server";
import { findOutboundLink } from "./link-insert";
import { FAILING_OUTCOMES, verifyLink, type LinkCheck } from "./verify-link.server";

export interface ExchangeCycleReport {
  paidSynced: number;
  discovered: number;
  settled: number;
  rechecked: number;
  lost: number;
  expired: number;
  orphaned: number;
  standing: number;
  errors: number;
}

const STRIKES = 3;
const STRIKE_SPAN_MS = 72 * 60 * 60 * 1000;
const RECHECK_LIVE_MS = 7 * 24 * 60 * 60 * 1000;
const RECHECK_FAILING_MS = 20 * 60 * 60 * 1000;
const STUCK_RESERVED_MS = 2 * 60 * 60 * 1000;

type Rpc = {
  rpc: (
    fn: string,
    args: Record<string, unknown>,
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

const iso = (msAgo: number) => new Date(Date.now() - msAgo).toISOString();

async function recordCheck(placementId: string, url: string, check: LinkCheck) {
  await supabaseAdmin.from("exchange_link_checks").insert({
    placement_id: placementId,
    url,
    http_status: check.httpStatus ?? null,
    outcome: check.outcome,
    rel_value: check.rel ?? null,
    detail: check.detail.slice(0, 300),
  });
}

/** When the current unbroken run of failing checks began, or null if the last check passed. */
async function failingSince(placementId: string): Promise<{ count: number; since: number } | null> {
  const { data } = await supabaseAdmin
    .from("exchange_link_checks")
    .select("outcome, checked_at")
    .eq("placement_id", placementId)
    .order("checked_at", { ascending: false })
    .limit(20);
  let count = 0;
  let since = 0;
  for (const c of data ?? []) {
    if (c.outcome === "live") break;
    // Inconclusive checks neither extend nor break a streak.
    if (!FAILING_OUTCOMES.has(c.outcome as LinkCheck["outcome"])) continue;
    count += 1;
    since = Date.parse(c.checked_at);
  }
  return count > 0 ? { count, since } : null;
}

export async function runExchangeCycle(): Promise<ExchangeCycleReport> {
  const report: ExchangeCycleReport = {
    paidSynced: 0,
    discovered: 0,
    settled: 0,
    rechecked: 0,
    lost: 0,
    expired: 0,
    orphaned: 0,
    standing: 0,
    errors: 0,
  };
  const guard = async (fn: () => Promise<void>) => {
    try {
      await fn();
    } catch (err) {
      report.errors += 1;
      console.error("[exchange] cycle step failed:", err);
    }
  };

  /* 1 ── paid flag: the webhook is the fast path, this is the backstop ──── */
  const { data: sites } = await supabaseAdmin
    .from("exchange_sites")
    .select("user_id")
    .order("paid_checked_at", { ascending: true, nullsFirst: true })
    .limit(500);
  for (const s of sites ?? []) {
    await guard(async () => {
      await syncPaidFlag(s.user_id);
      report.paidSynced += 1;
    });
  }

  /* 2 ── discover where placed links' articles went live ───────────────── */
  const { data: needUrl } = await supabaseAdmin
    .from("exchange_placements")
    .select(
      "id, host_blog_id, host:exchange_sites!exchange_placements_host_site_id_fkey(domain), blog:blogs(id, title, published_url)",
    )
    .eq("status", "placed")
    .is("host_url", null)
    .not("host_blog_id", "is", null)
    .order("placed_at", { ascending: true })
    .limit(150);
  const crawled = new Set<string>();
  for (const p of needUrl ?? []) {
    await guard(async () => {
      const domain = (p.host as unknown as { domain: string } | null)?.domain;
      const blog = p.blog as unknown as {
        id: string;
        title: string;
        published_url: string | null;
      } | null;
      if (!domain || !blog) return;
      let url =
        blog.published_url && isOnDomain(blog.published_url, domain) ? blog.published_url : null;
      let source = "plugin";
      if (!url) {
        if (!crawled.has(domain) && crawled.size >= 50) return; // per-run crawl budget
        crawled.add(domain);
        url = await discoverPublishedUrl(blog, domain);
        source = "sitemap";
        if (url) {
          await supabaseAdmin
            .from("blogs")
            .update({
              published_url: url,
              published_url_source: "sitemap",
              published_at: new Date().toISOString(),
            })
            .eq("id", blog.id)
            .is("published_url", null);
        }
      }
      if (!url) return;
      await supabaseAdmin
        .from("exchange_placements")
        .update({ host_url: url, host_url_source: source })
        .eq("id", p.id)
        .eq("status", "placed");
      report.discovered += 1;
    });
  }

  /* 3 ── settle: a placed link seen live moves the credits ─────────────── */
  const { data: toSettle } = await supabaseAdmin
    .from("exchange_placements")
    .select(
      "id, host_url, target_url, host:exchange_sites!exchange_placements_host_site_id_fkey(domain)",
    )
    .eq("status", "placed")
    .not("host_url", "is", null)
    .or(`last_checked_at.is.null,last_checked_at.lt.${iso(RECHECK_FAILING_MS)}`)
    .order("last_checked_at", { ascending: true, nullsFirst: true })
    .limit(150);
  for (const p of toSettle ?? []) {
    await guard(async () => {
      const domain = (p.host as unknown as { domain: string } | null)?.domain;
      const url = p.host_url as string;
      // The page must be on the host's own verified domain, whoever supplied it.
      if (!domain || !isOnDomain(url, domain)) {
        await supabaseAdmin.from("exchange_placements").update({ host_url: null }).eq("id", p.id);
        return;
      }
      const check = await verifyLink(url, p.target_url);
      await recordCheck(p.id, url, check);
      if (check.outcome === "live") {
        const { data, error } = await (supabaseAdmin as unknown as Rpc).rpc(
          "exchange_settle_placement",
          {
            _placement_id: p.id,
            _host_url: url,
          },
        );
        if (error) throw new Error(error.message);
        if (data) report.settled += 1;
      } else {
        await supabaseAdmin
          .from("exchange_placements")
          .update({ last_checked_at: new Date().toISOString() })
          .eq("id", p.id);
      }
    });
  }

  /* 4 ── recheck live links; charge back only on a sustained failure ───── */
  const { data: toRecheck } = await supabaseAdmin
    .from("exchange_placements")
    .select("id, host_url, target_url, consecutive_failures")
    .eq("status", "live")
    .not("host_url", "is", null)
    .or(
      `last_checked_at.lt.${iso(RECHECK_LIVE_MS)},and(consecutive_failures.gt.0,last_checked_at.lt.${iso(RECHECK_FAILING_MS)})`,
    )
    .order("last_checked_at", { ascending: true })
    .limit(200);
  for (const p of toRecheck ?? []) {
    await guard(async () => {
      const url = p.host_url as string;
      const check = await verifyLink(url, p.target_url);
      await recordCheck(p.id, url, check);
      report.rechecked += 1;
      const now = new Date().toISOString();

      if (check.outcome === "live") {
        await supabaseAdmin
          .from("exchange_placements")
          .update({ last_checked_at: now, consecutive_failures: 0 })
          .eq("id", p.id);
        return;
      }
      if (!FAILING_OUTCOMES.has(check.outcome)) {
        // Couldn't tell. Look again tomorrow; nothing is held against the host.
        await supabaseAdmin
          .from("exchange_placements")
          .update({ last_checked_at: now })
          .eq("id", p.id);
        return;
      }
      const streak = await failingSince(p.id);
      const failures = streak?.count ?? 1;
      if (streak && failures >= STRIKES && Date.now() - streak.since >= STRIKE_SPAN_MS) {
        if (await clawbackPlacement(p.id, `link no longer live: ${check.detail}`)) report.lost += 1;
        return;
      }
      await supabaseAdmin
        .from("exchange_placements")
        .update({ last_checked_at: now, consecutive_failures: Math.min(failures, 32000) })
        .eq("id", p.id);
    });
  }

  /* 5 ── expire what never went live in its window ─────────────────────── */
  const { data: expired } = await supabaseAdmin
    .from("exchange_placements")
    .select("id")
    .in("status", ["reserved", "placed"])
    .lt("expires_at", new Date().toISOString())
    .limit(500);
  for (const p of expired ?? []) {
    await guard(async () => {
      if (await refundPlacement(p.id, "expired", "not published and verified within 30 days")) {
        report.expired += 1;
      }
    });
  }

  /* 6 ── orphans: the article is gone, stuck, or no longer has the link ── */
  const { data: open } = await supabaseAdmin
    .from("exchange_placements")
    .select("id, status, reserved_at, host_blog_id, target_url, blog:blogs(status, body)")
    .in("status", ["reserved", "placed"])
    .limit(1000);
  for (const p of open ?? []) {
    await guard(async () => {
      const blog = p.blog as unknown as { status: string; body: string } | null;
      let reason: string | null = null;
      if (p.status === "reserved") {
        // A reservation only lives for the minutes an article takes to write.
        if (p.reserved_at < iso(STUCK_RESERVED_MS)) reason = "the article was never finished";
      } else if (!p.host_blog_id || !blog) reason = "the host article was deleted";
      else if (blog.status === "finished" && !findOutboundLink(blog.body ?? "", p.target_url)) {
        reason = "the link was removed from the article";
      }
      if (reason && (await refundPlacement(p.id, "cancelled", reason))) report.orphaned += 1;
    });
  }

  /* 7 ── standing: authority, tier, and reputation recovery ────────────── */
  await guard(async () => {
    report.standing = await recomputeStanding();
  });

  return report;
}

/**
 * Authority from what Rankbox can actually observe about a site — how much it
 * publishes, how well those articles score, how long it has been verified, and
 * its record of keeping hosted links live. No third-party metric is involved,
 * so the number is a ranking within the network, not a claim about the web.
 * Tier prices a host's links: T1–T2 cost one credit, T3 two, T4 three.
 */
export function authorityFrom(input: {
  finishedArticles: number;
  avgSeoScore: number;
  verifiedDays: number;
  liveHosted: number;
  lostHosted: number;
}): { score: number; tier: number } {
  const volume = Math.min(30, 9 * Math.log2(1 + input.finishedArticles)); // 30 ≈ 9+ articles... caps ~100 articles
  const quality = Math.min(25, Math.max(0, input.avgSeoScore - 60) * 0.625); // 60→0, 100→25
  const tenure = Math.min(15, input.verifiedDays / 12); // six months to max
  const record = Math.min(30, 3 * input.liveHosted) - Math.min(30, 10 * input.lostHosted);
  const score = Math.round(Math.max(0, Math.min(100, volume + quality + tenure + record)));
  const tier = score >= 80 ? 4 : score >= 60 ? 3 : score >= 35 ? 2 : 1;
  return { score, tier };
}

async function recomputeStanding(): Promise<number> {
  const { data: sites } = await supabaseAdmin
    .from("exchange_sites")
    .select(
      "id, user_id, status, verified_at, reputation, live_hosted_count, lost_hosted_count, authority_score, tier",
    )
    .in("status", ["verified", "suspended"])
    .limit(2000);
  let changed = 0;
  for (const s of sites ?? []) {
    const { data: blogs } = await supabaseAdmin
      .from("blogs")
      .select("seo_score")
      .eq("user_id", s.user_id)
      .eq("status", "finished")
      .limit(1000);
    const finished = blogs ?? [];
    const avg = finished.length
      ? finished.reduce((n, b) => n + (b.seo_score ?? 0), 0) / finished.length
      : 0;
    const verifiedDays = s.verified_at ? (Date.now() - Date.parse(s.verified_at)) / 86_400_000 : 0;
    const { score, tier } = authorityFrom({
      finishedArticles: finished.length,
      avgSeoScore: avg,
      verifiedDays,
      liveHosted: s.live_hosted_count,
      lostHosted: s.lost_hosted_count,
    });

    // Reputation heals a point a day while nothing new is lost, and a
    // suspended site that has healed past 60 is let back into the pool.
    const { count: recentLost } = await supabaseAdmin
      .from("exchange_placements")
      .select("id", { count: "exact", head: true })
      .eq("host_site_id", s.id)
      .eq("status", "lost")
      .gt("ended_at", iso(30 * 86_400_000));
    const reputation = (recentLost ?? 0) === 0 ? Math.min(100, s.reputation + 1) : s.reputation;
    const status = s.status === "suspended" && reputation >= 60 ? "verified" : s.status;

    if (
      score !== s.authority_score ||
      tier !== s.tier ||
      reputation !== s.reputation ||
      status !== s.status
    ) {
      await supabaseAdmin
        .from("exchange_sites")
        .update({ authority_score: score, tier, reputation, status })
        .eq("id", s.id);
      changed += 1;
    }
  }
  return changed;
}
