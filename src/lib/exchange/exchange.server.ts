/**
 * Server-side data access for the backlink exchange.
 *
 * Everything here runs with the service role. RLS gives members SELECT on
 * their own config and nothing at all on placements — a placement names both
 * parties — so every read that joins the two sides of a trade, and every
 * write, comes through this module and projects only what the caller may see.
 *
 * The exchange is per SITE: an exchange site's id is the Rankbox site id, and
 * each site verifies its own domain, earns in its own articles and spends on
 * its own pages. Functions here take the site id and trust it — the server
 * functions prove the caller owns that site before they get here.
 *
 * HOST = the site whose article carries the link (earns).
 * REQUESTER = the site whose URL is linked to (spends).
 */
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Tables } from "@/integrations/supabase/types";
import {
  hasExchangeEntitlement,
  requireExchangeEntitlement,
  type SiteScope,
} from "@/lib/entitlement.server";
import { getServerStripeEnv } from "@/lib/stripe.server";
import { tokens } from "./scoring";
import type {
  ExchangeAccess,
  ExchangeBalance,
  ExchangeOverview,
  ExchangeSite,
  ExchangeTarget,
  HostedPlacement,
  InboundPlacement,
  LedgerEntry,
  LedgerKind,
  NetworkPulse,
  PlacementStatus,
} from "./types";

export type SiteRow = Tables<"exchange_sites">;
export type TargetRow = Tables<"exchange_targets">;
export type PlacementRow = Tables<"exchange_placements">;
type AccountRow = Tables<"exchange_credit_accounts">;
type LedgerRow = Tables<"exchange_ledger">;

/* ── Row mappers ────────────────────────────────────────────────── */

export function siteFromRow(r: SiteRow): ExchangeSite {
  return {
    id: r.id,
    domain: r.domain,
    status: r.status,
    verifyMethod: r.verify_method,
    verifyToken: r.verify_token,
    verifiedAt: r.verified_at,
    optedIn: r.opted_in,
    paidActive: r.paid_active,
    authorityScore: r.authority_score,
    tier: r.tier,
    reputation: r.reputation,
    niche: r.niche,
    topicTags: r.topic_tags ?? [],
    blockedCategories: r.blocked_categories ?? [],
    maxLinksPerArticle: r.max_links_per_article,
    liveHostedCount: r.live_hosted_count,
    lostHostedCount: r.lost_hosted_count,
    createdAt: r.created_at,
  };
}

export function targetFromRow(r: TargetRow): ExchangeTarget {
  return {
    id: r.id,
    url: r.url,
    anchors: r.anchors ?? [],
    topicTags: r.topic_tags ?? [],
    priority: r.priority,
    active: r.active,
    maxNewLinksPerMonth: r.max_new_links_per_month,
    liveCount: r.live_count,
    queuedSince: r.queued_since,
    createdAt: r.created_at,
  };
}

export function balanceFromRow(r: AccountRow | null | undefined): ExchangeBalance {
  return {
    balance: r?.balance ?? 0,
    escrowed: r?.escrowed ?? 0,
    lifetimeEarned: r?.lifetime_earned ?? 0,
    lifetimeSpent: r?.lifetime_spent ?? 0,
    periodEnd: r?.period_end ?? null,
  };
}

export function ledgerFromRow(r: LedgerRow): LedgerEntry {
  return {
    id: r.id,
    kind: r.kind as LedgerKind,
    credits: r.credits,
    balanceAfter: r.balance_after,
    note: r.note,
    createdAt: r.created_at,
  };
}

/* ── Loads ──────────────────────────────────────────────────────── */

/** The site's exchange row — null until it has claimed a domain. */
export async function loadSite(siteId: string): Promise<SiteRow | null> {
  const { data, error } = await supabaseAdmin
    .from("exchange_sites")
    .select("*")
    .eq("id", siteId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

/** The site, only if it is verified — what every trade-side write requires. */
export async function requireVerifiedSite(siteId: string): Promise<SiteRow> {
  const site = await loadSite(siteId);
  if (!site || site.status !== "verified") {
    throw new Error("Verify your domain first.");
  }
  return site;
}

/**
 * Throws unless the site is live on a paid plan; the exchange is not part of
 * the trial, and a Studio site that has left the plan leaves the exchange.
 */
export async function requirePaid(scope: SiteScope): Promise<void> {
  await requireExchangeEntitlement(supabaseAdmin, scope);
}

/**
 * Where this site stands with the exchange. `paid` is the server's own
 * verdict, never the denormalised flag, so a member whose webhook is late
 * still sees the right gate. The trial is the owner's, not the site's.
 */
export async function loadAccess(scope: SiteScope, site: SiteRow | null): Promise<ExchangeAccess> {
  if (await hasExchangeEntitlement(supabaseAdmin, scope)) return "paid";
  const { data } = await supabaseAdmin
    .from("subscriptions")
    .select("status")
    .eq("user_id", scope.userId)
    .eq("environment", getServerStripeEnv())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (data?.status === "trialing") return "trial";
  return site ? "lapsed" : "none";
}

/**
 * The network as it actually is. Counts ELIGIBLE sites — verified, opted in
 * and paying — not registered ones, because that is what a member can trade
 * with, and overstating it to the people paying for it is the one thing this
 * panel must never do.
 */
export async function networkPulse(
  niche: string | null,
  topicTags: string[],
): Promise<NetworkPulse> {
  const [verified, live, eligibleRows, targetRows, firstLinks] = await Promise.all([
    supabaseAdmin
      .from("exchange_sites")
      .select("id", { count: "exact", head: true })
      .eq("status", "verified"),
    supabaseAdmin
      .from("exchange_placements")
      .select("id", { count: "exact", head: true })
      .eq("status", "live"),
    supabaseAdmin
      .from("exchange_sites")
      .select("id, niche, topic_tags")
      .eq("status", "verified")
      .eq("opted_in", true)
      .eq("paid_active", true)
      .limit(5000),
    supabaseAdmin
      .from("exchange_targets")
      .select("id, exchange_sites!inner(status, opted_in, paid_active)")
      .eq("active", true)
      .eq("exchange_sites.status", "verified")
      .eq("exchange_sites.opted_in", true)
      .eq("exchange_sites.paid_active", true)
      .limit(5000),
    supabaseAdmin
      .from("exchange_placements")
      .select("target_id, live_at, exchange_targets!inner(created_at)")
      .eq("status", "live")
      .not("live_at", "is", null)
      .limit(5000),
  ]);
  if (verified.error) throw new Error(verified.error.message);
  if (live.error) throw new Error(live.error.message);
  if (eligibleRows.error) throw new Error(eligibleRows.error.message);
  if (targetRows.error) throw new Error(targetRows.error.message);
  if (firstLinks.error) throw new Error(firstLinks.error.message);

  const eligible = eligibleRows.data ?? [];
  const mine = new Set(tokens([niche ?? "", ...topicTags].join(" ")));
  const sitesInYourNiche =
    mine.size === 0
      ? 0
      : eligible.filter((s) => {
          const theirs = tokens([s.niche ?? "", ...(s.topic_tags ?? [])].join(" "));
          return theirs.some((t) => mine.has(t));
        }).length;

  // Days from a target's creation to its first live link, median across the network.
  const firstByTarget = new Map<string, number>();
  for (const row of firstLinks.data ?? []) {
    const created = Date.parse((row.exchange_targets as { created_at: string }).created_at);
    const live = Date.parse(row.live_at as string);
    if (!Number.isFinite(created) || !Number.isFinite(live)) continue;
    const days = Math.max(0, (live - created) / 86_400_000);
    const prev = firstByTarget.get(row.target_id);
    if (prev === undefined || days < prev) firstByTarget.set(row.target_id, days);
  }
  const durations = [...firstByTarget.values()].sort((a, b) => a - b);
  const medianDaysToFirstLink = durations.length
    ? Math.round(durations[Math.floor(durations.length / 2)] * 10) / 10
    : null;

  return {
    verifiedSites: verified.count ?? 0,
    eligibleSites: eligible.length,
    sitesInYourNiche,
    openTargets: (targetRows.data ?? []).length,
    liveLinks: live.count ?? 0,
    medianDaysToFirstLink,
  };
}

export async function loadOverview(scope: SiteScope): Promise<ExchangeOverview> {
  const { siteId } = scope;
  const site = await loadSite(siteId);
  const [access, account, pulse, inbound, hosted, targets] = await Promise.all([
    loadAccess(scope, site),
    supabaseAdmin.from("exchange_credit_accounts").select("*").eq("site_id", siteId).maybeSingle(),
    networkPulse(site?.niche ?? null, site?.topic_tags ?? []),
    supabaseAdmin.from("exchange_placements").select("status").eq("requester_site_id", siteId),
    supabaseAdmin.from("exchange_placements").select("status").eq("host_site_id", siteId),
    supabaseAdmin.from("exchange_targets").select("id").eq("site_id", siteId).eq("active", true),
  ]);
  const pending = (rows: Array<{ status: PlacementStatus }>) =>
    rows.filter((r) => r.status === "reserved" || r.status === "placed").length;
  const live = (rows: Array<{ status: PlacementStatus }>) =>
    rows.filter((r) => r.status === "live").length;

  return {
    access,
    site: site ? siteFromRow(site) : null,
    balance: balanceFromRow(account.data),
    pulse,
    counts: {
      inboundLive: live(inbound.data ?? []),
      inboundPending: pending(inbound.data ?? []),
      hostedLive: live(hosted.data ?? []),
      hostedPending: pending(hosted.data ?? []),
      activeTargets: (targets.data ?? []).length,
    },
  };
}

/** Backlinks the site is receiving. The host is named by domain and tier only. */
export async function listInbound(siteId: string): Promise<InboundPlacement[]> {
  const { data, error } = await supabaseAdmin
    .from("exchange_placements")
    .select(
      "id, target_id, target_url, anchor_used, status, escrow_credits, host_url, reserved_at, placed_at, live_at, end_reason, host:exchange_sites!exchange_placements_host_site_id_fkey(domain, tier)",
    )
    .eq("requester_site_id", siteId)
    .order("reserved_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => {
    const host = r.host as unknown as { domain: string; tier: number } | null;
    return {
      id: r.id,
      targetId: r.target_id,
      targetUrl: r.target_url,
      anchor: r.anchor_used,
      hostDomain: host?.domain ?? "",
      hostTier: host?.tier ?? 1,
      status: r.status,
      credits: r.escrow_credits,
      hostUrl: r.host_url,
      reservedAt: r.reserved_at,
      placedAt: r.placed_at,
      liveAt: r.live_at,
      endReason: r.end_reason,
    };
  });
}

/** Links the site is hosting in its own articles. */
export async function listHosted(siteId: string): Promise<HostedPlacement[]> {
  const { data, error } = await supabaseAdmin
    .from("exchange_placements")
    .select(
      "id, host_blog_id, target_url, anchor_used, status, escrow_credits, host_url, reserved_at, placed_at, live_at, last_checked_at, consecutive_failures, end_reason, requester:exchange_sites!exchange_placements_requester_site_id_fkey(domain), blog:blogs(title)",
    )
    .eq("host_site_id", siteId)
    .order("reserved_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => {
    const requester = r.requester as unknown as { domain: string } | null;
    const blog = r.blog as unknown as { title: string } | null;
    return {
      id: r.id,
      blogId: r.host_blog_id,
      blogTitle: blog?.title ?? null,
      anchor: r.anchor_used,
      targetDomain: requester?.domain ?? "",
      targetUrl: r.target_url,
      status: r.status,
      credits: r.escrow_credits,
      hostUrl: r.host_url,
      reservedAt: r.reserved_at,
      placedAt: r.placed_at,
      liveAt: r.live_at,
      lastCheckedAt: r.last_checked_at,
      consecutiveFailures: r.consecutive_failures,
      endReason: r.end_reason,
    };
  });
}

export async function listLedger(siteId: string, limit = 50): Promise<LedgerEntry[]> {
  const { data, error } = await supabaseAdmin
    .from("exchange_ledger")
    .select("*")
    .eq("site_id", siteId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []).map(ledgerFromRow);
}

export async function listTargets(siteId: string): Promise<ExchangeTarget[]> {
  const { data, error } = await supabaseAdmin
    .from("exchange_targets")
    .select("*")
    .eq("site_id", siteId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map(targetFromRow);
}

/* ── Placement transitions (thin wrappers over the RPCs) ─────────── */

type Rpc = {
  rpc: (
    fn: string,
    args: Record<string, unknown>,
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

/** Refund and close a reserved or placed placement. */
export async function refundPlacement(
  placementId: string,
  status: "expired" | "cancelled",
  reason: string,
): Promise<boolean> {
  const { data, error } = await (supabaseAdmin as unknown as Rpc).rpc("exchange_refund_placement", {
    _placement_id: placementId,
    _status: status,
    _reason: reason,
  });
  if (error) throw new Error(error.message);
  return Boolean(data);
}

/** Charge back a live placement whose link is gone. */
export async function clawbackPlacement(placementId: string, reason: string): Promise<boolean> {
  const { data, error } = await (supabaseAdmin as unknown as Rpc).rpc(
    "exchange_clawback_placement",
    {
      _placement_id: placementId,
      _reason: reason,
    },
  );
  if (error) throw new Error(error.message);
  return Boolean(data);
}

/**
 * Re-sync the site's denormalised paid flag from the owner's subscription and
 * the site's own billing state — an archived Studio site drops out of the
 * pool while the owner's other sites keep trading.
 */
export async function syncPaidFlag(scope: SiteScope): Promise<boolean> {
  const paid = await hasExchangeEntitlement(supabaseAdmin, scope);
  const { error } = await (supabaseAdmin as unknown as Rpc).rpc("exchange_set_paid", {
    _site_id: scope.siteId,
    _paid: paid,
  });
  if (error) throw new Error(error.message);
  return paid;
}
