/**
 * The backlink exchange's server functions — the only way the dashboard reads
 * or changes anything about it.
 *
 * Every function authenticates the caller and then acts with the service
 * role: members have SELECT-only RLS on their own config and none on
 * placements, so nothing here can be bypassed by calling the Data API. Every
 * write also re-checks the paid gate on the server; the page's gate is a
 * courtesy, this is the rule.
 *
 * Everything is per site. Each function takes the `siteId` the dashboard is
 * showing and proves the caller owns it before anything else: reads accept
 * any of the owner's sites, writes need the site to be live, and trade-side
 * writes need it paid as well.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { SiteScope } from "@/lib/entitlement.server";
import { EXCHANGE_CATEGORIES } from "@/lib/exchange/types";
import type {
  ExchangeBlock,
  ExchangeOverview,
  ExchangeSite,
  ExchangeTarget,
  HostedPlacement,
  InboundPlacement,
  LedgerEntry,
  VerificationResult,
} from "@/lib/exchange/types";

const SiteId = z.string().uuid();
const Domain = z.string().trim().min(3).max(253);
const Url = z.string().trim().url().max(2048);
const Anchor = z.string().trim().min(2).max(80);
const Tag = z.string().trim().min(2).max(40);
const CategoryId = z.enum(EXCHANGE_CATEGORIES.map((c) => c.id) as [string, ...string[]]);

const TargetInput = z.object({
  url: Url,
  anchors: z.array(Anchor).min(3).max(5),
  topicTags: z.array(Tag).max(10).default([]),
  priority: z.number().int().min(1).max(10).default(5),
  maxNewLinksPerMonth: z.number().int().min(1).max(10).default(4),
  active: z.boolean().default(true),
});

const SettingsPatch = z.object({
  optedIn: z.boolean().optional(),
  maxLinksPerArticle: z.number().int().min(0).max(2).optional(),
  niche: z.string().trim().max(120).optional(),
  topicTags: z.array(Tag).max(15).optional(),
  blockedCategories: z.array(CategoryId).max(EXCHANGE_CATEGORIES.length).optional(),
});

const SiteOnly = z.object({ siteId: SiteId });

/** Reads: any site the caller owns. */
async function readScope(userId: string, siteId: string): Promise<SiteScope> {
  const { requireSiteScope } = await import("@/lib/sites.server");
  return requireSiteScope(userId, siteId);
}

/** Writes: a live site the caller owns. */
async function liveScope(userId: string, siteId: string): Promise<SiteScope> {
  const { requireLiveSite } = await import("@/lib/sites.server");
  await requireLiveSite(userId, siteId);
  return { userId, siteId };
}

/** Trade-side writes: a live site the caller owns, on a paid plan. */
async function paidScope(userId: string, siteId: string): Promise<SiteScope> {
  const scope = await liveScope(userId, siteId);
  const { requirePaid } = await import("@/lib/exchange/exchange.server");
  await requirePaid(scope);
  return scope;
}

/** Distinct, trimmed, case-insensitive; keeps the first spelling of each. */
function dedupe(list: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of list) {
    const key = item.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item.trim());
  }
  return out;
}

/* ── Reads ──────────────────────────────────────────────────────── */

export const getExchangeOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SiteOnly.parse(d))
  .handler(async ({ data, context }): Promise<ExchangeOverview> => {
    const scope = await readScope(context.userId, data.siteId);
    const { loadOverview } = await import("@/lib/exchange/exchange.server");
    return loadOverview(scope);
  });

export const listTargets = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SiteOnly.parse(d))
  .handler(async ({ data, context }): Promise<ExchangeTarget[]> => {
    const { siteId } = await readScope(context.userId, data.siteId);
    const { listTargets: load } = await import("@/lib/exchange/exchange.server");
    return load(siteId);
  });

export const listInboundPlacements = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SiteOnly.parse(d))
  .handler(async ({ data, context }): Promise<InboundPlacement[]> => {
    const { siteId } = await readScope(context.userId, data.siteId);
    const { listInbound } = await import("@/lib/exchange/exchange.server");
    return listInbound(siteId);
  });

export const listHostedPlacements = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SiteOnly.parse(d))
  .handler(async ({ data, context }): Promise<HostedPlacement[]> => {
    const { siteId } = await readScope(context.userId, data.siteId);
    const { listHosted } = await import("@/lib/exchange/exchange.server");
    return listHosted(siteId);
  });

export const listExchangeLedger = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SiteOnly.parse(d))
  .handler(async ({ data, context }): Promise<LedgerEntry[]> => {
    const { siteId } = await readScope(context.userId, data.siteId);
    const { listLedger } = await import("@/lib/exchange/exchange.server");
    return listLedger(siteId);
  });

export const listExchangeBlocks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SiteOnly.parse(d))
  .handler(async ({ data: input, context }): Promise<ExchangeBlock[]> => {
    const { siteId } = await readScope(context.userId, input.siteId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("exchange_blocks")
      .select("id, domain, reason, created_at")
      .eq("site_id", siteId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => ({
      id: r.id,
      domain: r.domain,
      reason: r.reason,
      createdAt: r.created_at,
    }));
  });

/* ── Domain verification ───────────────────────────────────────── */

export const startDomainVerification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ siteId: SiteId, domain: Domain }).parse(d))
  .handler(async ({ data, context }): Promise<ExchangeSite> => {
    const scope = await paidScope(context.userId, data.siteId);
    const { startVerification } = await import("@/lib/exchange/verify-site.server");
    return startVerification(scope, data.domain);
  });

export const checkDomainVerification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SiteOnly.parse(d))
  .handler(async ({ data, context }): Promise<VerificationResult> => {
    const { siteId } = await paidScope(context.userId, data.siteId);
    const { assertAiRateLimit } = await import("@/lib/rate-limit.server");
    // Each check is three outbound fetches; the AI bucket's limit is the right
    // size, and it is the owner's, however many sites they verify.
    await assertAiRateLimit(context.userId);
    const { checkVerification } = await import("@/lib/exchange/verify-site.server");
    return checkVerification(siteId);
  });

/* ── Settings ──────────────────────────────────────────────────── */

export const updateExchangeSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SettingsPatch.extend({ siteId: SiteId }).parse(d))
  .handler(async ({ data, context }): Promise<ExchangeSite> => {
    const { siteId } = await paidScope(context.userId, data.siteId);
    const { loadSite, siteFromRow } = await import("@/lib/exchange/exchange.server");
    const site = await loadSite(siteId);
    if (!site) throw new Error("Add the domain you publish to first.");
    if (data.optedIn && site.status !== "verified") {
      throw new Error("Verify your domain before opting in.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("exchange_sites")
      .update({
        ...(data.optedIn !== undefined ? { opted_in: data.optedIn } : {}),
        ...(data.maxLinksPerArticle !== undefined
          ? { max_links_per_article: data.maxLinksPerArticle }
          : {}),
        ...(data.niche !== undefined ? { niche: data.niche || null } : {}),
        ...(data.topicTags !== undefined ? { topic_tags: dedupe(data.topicTags) } : {}),
        ...(data.blockedCategories !== undefined
          ? { blocked_categories: dedupe(data.blockedCategories) }
          : {}),
      })
      .eq("id", site.id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return siteFromRow(row);
  });

/* ── Targets ───────────────────────────────────────────────────── */

export const createTarget = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => TargetInput.extend({ siteId: SiteId }).parse(d))
  .handler(async ({ data, context }): Promise<ExchangeTarget> => {
    const { siteId } = await paidScope(context.userId, data.siteId);
    const { requireVerifiedSite, targetFromRow } = await import("@/lib/exchange/exchange.server");
    const site = await requireVerifiedSite(siteId);
    const { isOnDomain } = await import("@/lib/exchange/domain");
    if (!isOnDomain(data.url, site.domain)) {
      throw new Error(`Targets must be pages on ${site.domain}.`);
    }
    const anchors = dedupe(data.anchors);
    if (anchors.length < 3) throw new Error("Give at least three different anchor texts.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin
      .from("exchange_targets")
      .select("id", { count: "exact", head: true })
      .eq("site_id", site.id);
    if ((count ?? 0) >= 25) {
      throw new Error("A site can have up to 25 targets. Remove one first.");
    }

    const { data: row, error } = await supabaseAdmin
      .from("exchange_targets")
      .insert({
        user_id: context.userId,
        site_id: site.id,
        url: data.url,
        anchors,
        topic_tags: dedupe(data.topicTags),
        priority: data.priority,
        max_new_links_per_month: data.maxNewLinksPerMonth,
        active: data.active,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return targetFromRow(row);
  });

export const updateTarget = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ siteId: SiteId, id: z.string().uuid(), patch: TargetInput.partial() }).parse(d),
  )
  .handler(async ({ data, context }): Promise<ExchangeTarget> => {
    const { siteId } = await paidScope(context.userId, data.siteId);
    const { requireVerifiedSite, targetFromRow } = await import("@/lib/exchange/exchange.server");
    const site = await requireVerifiedSite(siteId);
    const p = data.patch;
    if (p.url !== undefined) {
      const { isOnDomain } = await import("@/lib/exchange/domain");
      if (!isOnDomain(p.url, site.domain))
        throw new Error(`Targets must be pages on ${site.domain}.`);
    }
    const anchors = p.anchors !== undefined ? dedupe(p.anchors) : undefined;
    if (anchors && anchors.length < 3)
      throw new Error("Give at least three different anchor texts.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("exchange_targets")
      .update({
        ...(p.url !== undefined ? { url: p.url } : {}),
        ...(anchors !== undefined ? { anchors } : {}),
        ...(p.topicTags !== undefined ? { topic_tags: dedupe(p.topicTags) } : {}),
        ...(p.priority !== undefined ? { priority: p.priority } : {}),
        ...(p.maxNewLinksPerMonth !== undefined
          ? { max_new_links_per_month: p.maxNewLinksPerMonth }
          : {}),
        ...(p.active !== undefined ? { active: p.active } : {}),
      })
      .eq("id", data.id)
      .eq("site_id", site.id)
      .eq("user_id", context.userId)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return targetFromRow(row);
  });

/**
 * Removes a target. Open reservations are refunded first. Links already live
 * in other members' articles cannot be taken back, so a target with live
 * placements is deactivated and kept for its history rather than deleted.
 */
export const deleteTarget = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ siteId: SiteId, id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }): Promise<{ deleted: boolean }> => {
    const { siteId } = await liveScope(context.userId, data.siteId);
    const { refundPlacement } = await import("@/lib/exchange/exchange.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: target } = await supabaseAdmin
      .from("exchange_targets")
      .select("id")
      .eq("id", data.id)
      .eq("site_id", siteId)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (!target) throw new Error("Target not found.");

    const { data: open } = await supabaseAdmin
      .from("exchange_placements")
      .select("id, status")
      .eq("target_id", data.id)
      .in("status", ["reserved", "placed", "live"]);
    for (const p of open ?? []) {
      if (p.status !== "live")
        await refundPlacement(p.id, "cancelled", "target removed by its owner");
    }
    if ((open ?? []).some((p) => p.status === "live")) {
      const { error } = await supabaseAdmin
        .from("exchange_targets")
        .update({ active: false })
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      return { deleted: false };
    }
    const { error } = await supabaseAdmin.from("exchange_targets").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { deleted: true };
  });

/* ── Blocks ────────────────────────────────────────────────────── */

export const blockDomain = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({ siteId: SiteId, domain: Domain, reason: z.string().trim().max(200).default("") })
      .parse(d),
  )
  .handler(async ({ data, context }): Promise<ExchangeBlock> => {
    const { siteId } = await liveScope(context.userId, data.siteId);
    const { normalizeDomain } = await import("@/lib/exchange/domain");
    const domain = normalizeDomain(data.domain);
    if (!domain) throw new Error("Enter a domain like example.com.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("exchange_blocks")
      .upsert(
        { user_id: context.userId, site_id: siteId, domain, reason: data.reason },
        { onConflict: "site_id,domain" },
      )
      .select("id, domain, reason, created_at")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id, domain: row.domain, reason: row.reason, createdAt: row.created_at };
  });

export const unblockDomain = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ siteId: SiteId, domain: Domain }).parse(d))
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { siteId } = await liveScope(context.userId, data.siteId);
    const { normalizeDomain } = await import("@/lib/exchange/domain");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("exchange_blocks")
      .delete()
      .eq("site_id", siteId)
      .eq("domain", normalizeDomain(data.domain));
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ── Hosted placements ─────────────────────────────────────────── */

/**
 * Takes a link out of one of the site's own articles.
 *
 * A reserved or placed link is simply cancelled and the requester refunded. A
 * LIVE link is a promise already paid for: removing it returns the credits
 * the host earned and costs reputation, exactly as if the link had vanished
 * on its own — the dashboard says so before it lets them.
 */
export const removeHostedPlacement = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ siteId: SiteId, id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { siteId } = await liveScope(context.userId, data.siteId);
    const { refundPlacement, clawbackPlacement } = await import("@/lib/exchange/exchange.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: p } = await supabaseAdmin
      .from("exchange_placements")
      .select("id, status, host_blog_id, target_url, anchor_used")
      .eq("id", data.id)
      .eq("host_site_id", siteId)
      .eq("host_user_id", context.userId)
      .maybeSingle();
    if (!p) throw new Error("Placement not found.");

    if (p.status === "live") await clawbackPlacement(p.id, "removed by the host");
    else if (p.status === "reserved" || p.status === "placed") {
      await refundPlacement(p.id, "cancelled", "removed by the host");
    }

    // Unlink the anchor in the article body, keeping the words.
    if (p.host_blog_id) {
      const { data: blog } = await supabaseAdmin
        .from("blogs")
        .select("body")
        .eq("id", p.host_blog_id)
        .eq("site_id", siteId)
        .maybeSingle();
      if (blog?.body) {
        const { sameLink } = await import("@/lib/exchange/domain");
        const body = blog.body.replace(
          /\[([^\]\n]*)\]\(\s*<?([^\s)>]+)>?(?:\s+"[^"]*")?\s*\)/g,
          (whole: string, text: string, href: string) =>
            sameLink(href, p.target_url) ? text : whole,
        );
        if (body !== blog.body) {
          await supabaseAdmin
            .from("blogs")
            .update({ body })
            .eq("id", p.host_blog_id)
            .eq("site_id", siteId);
        }
      }
    }
    return { ok: true };
  });

/* ── Published URL (manual) ────────────────────────────────────── */

/**
 * The member pastes where an article went live; the cron verifies from there.
 * The page must be on this site's verified exchange domain or on the site's
 * own website — the cron only ever settles a link seen on the verified one.
 */
export const setPublishedUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ siteId: SiteId, blogId: z.string().uuid(), url: Url }).parse(d),
  )
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { requireLiveSite } = await import("@/lib/sites.server");
    const profile = await requireLiveSite(context.userId, data.siteId);
    const siteId = profile.id;
    const { assertSafeUrl, UnsafeUrlError } = await import("@/lib/safe-fetch.server");
    try {
      assertSafeUrl(data.url);
    } catch (err) {
      if (err instanceof UnsafeUrlError) throw new Error("That URL can't be checked.");
      throw err;
    }
    const { loadSite } = await import("@/lib/exchange/exchange.server");
    const { isOnDomain, normalizeDomain } = await import("@/lib/exchange/domain");
    const site = await loadSite(siteId);
    const domains = [
      ...new Set([site?.domain ?? "", normalizeDomain(profile.website_url ?? "")]),
    ].filter(Boolean);
    if (!domains.some((d) => isOnDomain(data.url, d))) {
      throw new Error(
        `The published URL must be on ${domains.join(" or ") || "your site's domain"}.`,
      );
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: updated, error } = await supabaseAdmin
      .from("blogs")
      .update({
        published_url: data.url,
        published_url_source: "manual",
        published_at: new Date().toISOString(),
      })
      .eq("id", data.blogId)
      .eq("site_id", siteId)
      .select("id");
    if (error) throw new Error(error.message);
    if (!updated?.length) throw new Error("Article not found.");
    return { ok: true };
  });
