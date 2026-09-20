/**
 * The exchange's side of writing an article.
 *
 * Both article callers — the dashboard's server function and the autopilot
 * cron — go through these three calls around writeArticle:
 *
 *   reserveForArticle   before writing: pick and escrow the best target(s)
 *   settleReservations  after writing: confirm the links that made it, release the rest
 *   releaseReservations if writing failed: give every escrow back
 *
 * None of it may ever fail an article. An empty or broken exchange is a
 * normal day, so every path here catches and returns rather than throws.
 */
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { hasExchangeEntitlement } from "@/lib/entitlement.server";
import { loadSite, refundPlacement } from "./exchange.server";
import type { OutboundLink } from "./link-insert";
import { findCandidates, type ArticleForMatching } from "./matcher.server";
import { sameLink } from "./domain";

export interface Reservation {
  placementId: string;
  link: OutboundLink;
  requesterDomain: string;
  credits: number;
}

type Rpc = {
  rpc: (
    fn: string,
    args: Record<string, unknown>,
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};
const rpc = () => supabaseAdmin as unknown as Rpc;

/**
 * Picks and escrows up to the host's per-article allowance of links, each
 * from a different member. Empty when the host isn't taking part, isn't
 * paying, or nothing in the network belongs in this article.
 */
export async function reserveForArticle(
  hostUserId: string,
  article: ArticleForMatching,
): Promise<Reservation[]> {
  try {
    if (!article.id) return [];
    const site = await loadSite(hostUserId);
    if (!site || site.status !== "verified" || !site.opted_in || !site.paid_active) return [];
    // The flag is the fast path; the subscription is the truth.
    if (!(await hasExchangeEntitlement(supabaseAdmin, hostUserId))) return [];

    const wanted = Math.max(0, Math.min(2, site.max_links_per_article));
    if (wanted === 0) return [];

    const ranked = await findCandidates(site, article);
    const reservations: Reservation[] = [];
    const takenSites = new Set<string>();

    for (const r of ranked) {
      if (reservations.length >= wanted) break;
      if (takenSites.has(r.candidate.requesterSiteId)) continue;
      const { data, error } = await rpc().rpc("exchange_reserve_placement", {
        _target_id: r.candidate.targetId,
        _host_user_id: hostUserId,
        _host_site_id: site.id,
        _host_blog_id: article.id,
        _anchor: r.anchor,
        _credits: r.credits,
        _match_score: Math.round(r.breakdown.score * 1000) / 1000,
      });
      if (error) {
        console.error("[exchange] reserve failed:", error.message);
        continue;
      }
      // NULL is the function saying "no" — a lost race or a re-checked rule.
      if (typeof data !== "string" || !data) continue;
      takenSites.add(r.candidate.requesterSiteId);
      reservations.push({
        placementId: data,
        link: {
          url: r.candidate.url,
          anchor: r.anchor,
          topic: [r.candidate.niche ?? "", ...r.candidate.topicTags].filter(Boolean).join(", "),
        },
        requesterDomain: r.candidate.requesterDomain,
        credits: r.credits,
      });
    }
    return reservations;
  } catch (err) {
    console.error("[exchange] reserveForArticle failed:", err);
    return [];
  }
}

/** The link is in the body: reserved → placed. */
export async function confirmPlacement(placementId: string, blogId: string | null): Promise<void> {
  const { error } = await rpc().rpc("exchange_mark_placed", {
    _placement_id: placementId,
    _host_blog_id: blogId,
  });
  if (error) throw new Error(error.message);
}

/** The link never made it: reserved/placed → cancelled, escrow returned. */
export async function cancelPlacement(placementId: string, reason: string): Promise<void> {
  await refundPlacement(placementId, "cancelled", reason);
}

/**
 * After a successful write: confirm each reservation whose link the article
 * actually carries, cancel the rest. Never throws.
 */
export async function settleReservations(
  reservations: Reservation[],
  placed: Array<{ url: string; ok: boolean }>,
  blogId: string | null,
): Promise<void> {
  for (const r of reservations) {
    try {
      const hit = placed.find((p) => sameLink(p.url, r.link.url));
      if (hit?.ok) await confirmPlacement(r.placementId, blogId);
      else await cancelPlacement(r.placementId, "the link could not be written into the article");
    } catch (err) {
      console.error("[exchange] settle failed:", err);
    }
  }
}

/** Writing failed: every escrow goes back. Never throws. */
export async function releaseReservations(
  reservations: Reservation[],
  reason: string,
): Promise<void> {
  for (const r of reservations) {
    try {
      await cancelPlacement(r.placementId, reason);
    } catch (err) {
      console.error("[exchange] release failed:", err);
    }
  }
}
