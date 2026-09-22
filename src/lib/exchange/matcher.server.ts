/**
 * Finding the right link for an article.
 *
 * Hard filters run in SQL (the pool: verified, opted-in, paying sites with
 * active targets); everything relational — reciprocity, cooldowns, blocks,
 * caps, balances — is resolved here in one pass over the placements that
 * involve the host; and the ranking is the pure scorer the mock uses too.
 *
 * Balances, keywords and blocks all belong to a site. The one rule that is
 * about a person rather than a site stays on the owner: no site ever links to
 * another site of its own owner.
 *
 * This module PROPOSES. It never reserves: exchange_reserve_placement is the
 * authority, and re-checks every rule under a row lock.
 */
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { rankCandidates, type Candidate, type MatchContext, type RankedCandidate } from "./scoring";
import { tierCost } from "./types";
import type { SiteRow } from "./exchange.server";

export interface ArticleForMatching {
  /** The blog row the link would live in. Required — without it nothing can be verified later. */
  id: string;
  title: string;
  keyword: string | null;
  tags: string[];
}

const ACTIVE = ["reserved", "placed", "live"] as const;
const COOLDOWN_DAYS = 180;
const VELOCITY_WINDOW_DAYS = 30;

interface PoolRow {
  id: string;
  url: string;
  anchors: string[];
  topic_tags: string[];
  priority: number;
  queued_since: string;
  last_placed_at: string | null;
  live_count: number;
  max_new_links_per_month: number;
  user_id: string;
  site_id: string;
  site: {
    id: string;
    user_id: string;
    domain: string;
    niche: string | null;
    topic_tags: string[];
    tier: number;
    reputation: number;
  } | null;
}

/**
 * Ranked candidate targets for one article on the host's site, best first.
 * Empty is a normal answer: no target belongs in this article today.
 */
export async function findCandidates(
  host: SiteRow,
  article: ArticleForMatching,
  limit = 25,
): Promise<RankedCandidate[]> {
  if (host.status !== "verified" || !host.opted_in || !host.paid_active) return [];
  if (host.max_links_per_article <= 0) return [];
  const cost = tierCost(host.tier);
  const now = Date.now();
  const since = (days: number) => new Date(now - days * 86_400_000).toISOString();

  const { data: pool, error } = await supabaseAdmin
    .from("exchange_targets")
    .select(
      "id, url, anchors, topic_tags, priority, queued_since, last_placed_at, live_count, max_new_links_per_month, user_id, site_id, site:exchange_sites!inner(id, user_id, domain, niche, topic_tags, tier, reputation, status, opted_in, paid_active)",
    )
    .eq("active", true)
    .neq("site_id", host.id)
    // Never another site of the host's own owner — that is a private link network.
    .neq("user_id", host.user_id)
    .eq("site.status", "verified")
    .eq("site.opted_in", true)
    .eq("site.paid_active", true)
    .gte("site.reputation", 50)
    .order("queued_since", { ascending: true })
    .limit(400);
  if (error) throw new Error(error.message);
  const rows = (pool ?? []) as unknown as PoolRow[];
  if (rows.length === 0) return [];

  const targetIds = rows.map((r) => r.id);
  const requesterSites = [...new Set(rows.map((r) => r.site_id))];

  const [
    hostPlacements,
    targetPlacements,
    accounts,
    keywords,
    hostBlocks,
    theirBlocks,
    articlePlacements,
  ] = await Promise.all([
    // Everything the host site has ever been party to: reciprocity, cooldown, novelty, house rule.
    supabaseAdmin
      .from("exchange_placements")
      .select("requester_site_id, host_site_id, status, reserved_at")
      .or(`host_site_id.eq.${host.id},requester_site_id.eq.${host.id}`)
      .limit(5000),
    // Recent activity on the candidate targets: velocity caps and anchor rotation.
    supabaseAdmin
      .from("exchange_placements")
      .select("target_id, anchor_used, status, reserved_at")
      .in("target_id", targetIds)
      .in("status", [...ACTIVE])
      .limit(5000),
    supabaseAdmin
      .from("exchange_credit_accounts")
      .select("site_id, balance")
      .in("site_id", requesterSites),
    supabaseAdmin
      .from("keywords")
      .select("site_id, name")
      .in("site_id", requesterSites)
      .limit(3000),
    // Domains the host site refuses to link to.
    supabaseAdmin.from("exchange_blocks").select("domain").eq("site_id", host.id),
    // Requester sites that refuse a link from the host's domain.
    supabaseAdmin
      .from("exchange_blocks")
      .select("site_id")
      .in("site_id", requesterSites)
      .eq("domain", host.domain),
    supabaseAdmin
      .from("exchange_placements")
      .select("id")
      .eq("host_blog_id", article.id)
      .in("status", [...ACTIVE]),
  ]);

  // This article already carries its allowance.
  if ((articlePlacements.data ?? []).length >= host.max_links_per_article) return [];

  // The host's own monthly allowance.
  const hostRecent = (hostPlacements.data ?? []).filter(
    (p) =>
      p.host_site_id === host.id &&
      ACTIVE.includes(p.status as (typeof ACTIVE)[number]) &&
      p.reserved_at > since(VELOCITY_WINDOW_DAYS),
  ).length;
  if (hostRecent >= host.max_links_per_period) return [];

  const linkedFromHost = new Set<string>(); // requester sites the host has ever linked to
  const linkedToHost = new Set<string>(); // sites that host a link TO the host site (live-ish)
  const cooledDown = new Set<string>(); // requester sites the host linked to within the cooldown
  for (const p of hostPlacements.data ?? []) {
    const active = ACTIVE.includes(p.status as (typeof ACTIVE)[number]);
    if (p.host_site_id === host.id) {
      if (p.status !== "cancelled") linkedFromHost.add(p.requester_site_id);
      if (p.status !== "cancelled" && p.reserved_at > since(COOLDOWN_DAYS))
        cooledDown.add(p.requester_site_id);
    }
    if (p.requester_site_id === host.id && active) linkedToHost.add(p.host_site_id);
  }

  const velocity = new Map<string, number>();
  const usedAnchors = new Map<string, string[]>();
  for (const p of targetPlacements.data ?? []) {
    if (p.reserved_at > since(VELOCITY_WINDOW_DAYS))
      velocity.set(p.target_id, (velocity.get(p.target_id) ?? 0) + 1);
    usedAnchors.set(p.target_id, [...(usedAnchors.get(p.target_id) ?? []), p.anchor_used]);
  }

  const balance = new Map((accounts.data ?? []).map((a) => [a.site_id, a.balance]));
  const keywordsBySite = new Map<string, string[]>();
  for (const k of keywords.data ?? []) {
    keywordsBySite.set(k.site_id, [...(keywordsBySite.get(k.site_id) ?? []), k.name]);
  }
  const blockedDomains = new Set((hostBlocks.data ?? []).map((b) => b.domain));
  const blockingSites = new Set((theirBlocks.data ?? []).map((b) => b.site_id));

  const candidates: Candidate[] = [];
  for (const r of rows) {
    const site = r.site;
    if (!site) continue;
    if (blockedDomains.has(site.domain) || blockingSites.has(r.site_id)) continue;
    if (site.domain === host.domain) continue;
    // No direct reciprocity: their site links to ours, so ours may not link to theirs.
    if (linkedToHost.has(site.id)) continue;
    if (cooledDown.has(site.id)) continue;
    if (host.is_house && linkedFromHost.has(site.id)) continue;
    if ((balance.get(r.site_id) ?? 0) < cost) continue;
    if ((velocity.get(r.id) ?? 0) >= r.max_new_links_per_month) continue;

    candidates.push({
      targetId: r.id,
      requesterSiteId: site.id,
      requesterOwnerId: r.user_id,
      requesterDomain: site.domain,
      url: r.url,
      anchors: r.anchors ?? [],
      topicTags: r.topic_tags ?? [],
      niche: site.niche,
      priority: r.priority,
      tier: site.tier,
      reputation: site.reputation,
      queuedSince: r.queued_since,
      lastPlacedAt: r.last_placed_at,
      liveCount: r.live_count,
      everLinkedFromHost: linkedFromHost.has(site.id),
      requesterKeywords: (keywordsBySite.get(r.site_id) ?? []).slice(0, 40),
      usedAnchors: usedAnchors.get(r.id) ?? [],
    });
  }

  const ctx: MatchContext = {
    hostSiteId: host.id,
    hostTier: host.tier,
    hostNiche: host.niche,
    hostTopicTags: host.topic_tags ?? [],
    blockedCategories: host.blocked_categories ?? [],
    articleTitle: article.title,
    articleKeyword: article.keyword ?? article.title,
    articleTags: article.tags,
  };
  return rankCandidates(candidates, ctx, now).slice(0, limit);
}
