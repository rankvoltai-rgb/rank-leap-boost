/**
 * The backlink exchange's server functions — the only way the dashboard reads
 * or changes anything about it.
 *
 * Every function authenticates the caller and then acts with the service
 * role: members have SELECT-only RLS on their own config and none on
 * placements, so nothing here can be bypassed by calling the Data API. Every
 * write also re-checks the paid gate on the server; the page's gate is a
 * courtesy, this is the rule.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
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
  .handler(async ({ context }): Promise<ExchangeOverview> => {
    const { loadOverview } = await import("@/lib/exchange/exchange.server");
    return loadOverview(context.userId);
  });

export const listTargets = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ExchangeTarget[]> => {
    const { listTargets: load } = await import("@/lib/exchange/exchange.server");
    return load(context.userId);
  });

export const listInboundPlacements = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<InboundPlacement[]> => {
    const { listInbound } = await import("@/lib/exchange/exchange.server");
    return listInbound(context.userId);
  });

export const listHostedPlacements = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<HostedPlacement[]> => {
    const { listHosted } = await import("@/lib/exchange/exchange.server");
    return listHosted(context.userId);
  });

export const listExchangeLedger = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<LedgerEntry[]> => {
    const { listLedger } = await import("@/lib/exchange/exchange.server");
    return listLedger(context.userId);
  });

export const listExchangeBlocks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ExchangeBlock[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("exchange_blocks")
      .select("id, domain, reason, created_at")
      .eq("user_id", context.userId)
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
  .inputValidator((d: unknown) => z.object({ domain: Domain }).parse(d))
  .handler(async ({ data, context }): Promise<ExchangeSite> => {
    const { requirePaid } = await import("@/lib/exchange/exchange.server");
    await requirePaid(context.userId);
    const { startVerification } = await import("@/lib/exchange/verify-site.server");
    return startVerification(context.userId, data.domain);
  });

export const checkDomainVerification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<VerificationResult> => {
    const { requirePaid } = await import("@/lib/exchange/exchange.server");
    await requirePaid(context.userId);
    const { assertAiRateLimit } = await import("@/lib/rate-limit.server");
    // Each check is three outbound fetches; the AI bucket's limit is the right size.
    await assertAiRateLimit(context.userId);
    const { checkVerification } = await import("@/lib/exchange/verify-site.server");
    return checkVerification(context.userId);
  });

/* ── Settings ──────────────────────────────────────────────────── */

export const updateExchangeSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SettingsPatch.parse(d))
  .handler(async ({ data, context }): Promise<ExchangeSite> => {
    const { requirePaid, loadSite, siteFromRow } = await import("@/lib/exchange/exchange.server");
    await requirePaid(context.userId);
    const site = await loadSite(context.userId);
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
  .inputValidator((d: unknown) => TargetInput.parse(d))
  .handler(async ({ data, context }): Promise<ExchangeTarget> => {
    const { requirePaid, requireVerifiedSite, targetFromRow } =
      await import("@/lib/exchange/exchange.server");
    await requirePaid(context.userId);
    const site = await requireVerifiedSite(context.userId);
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
      .eq("user_id", context.userId);
    if ((count ?? 0) >= 25) throw new Error("You can have up to 25 targets. Remove one first.");

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
    z.object({ id: z.string().uuid(), patch: TargetInput.partial() }).parse(d),
  )
  .handler(async ({ data, context }): Promise<ExchangeTarget> => {
    const { requirePaid, requireVerifiedSite, targetFromRow } =
      await import("@/lib/exchange/exchange.server");
    await requirePaid(context.userId);
    const site = await requireVerifiedSite(context.userId);
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
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }): Promise<{ deleted: boolean }> => {
    const { refundPlacement } = await import("@/lib/exchange/exchange.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: target } = await supabaseAdmin
      .from("exchange_targets")
      .select("id")
      .eq("id", data.id)
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
    z.object({ domain: Domain, reason: z.string().trim().max(200).default("") }).parse(d),
  )
  .handler(async ({ data, context }): Promise<ExchangeBlock> => {
    const { normalizeDomain } = await import("@/lib/exchange/domain");
    const domain = normalizeDomain(data.domain);
    if (!domain) throw new Error("Enter a domain like example.com.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("exchange_blocks")
      .upsert(
        { user_id: context.userId, domain, reason: data.reason },
        { onConflict: "user_id,domain" },
      )
      .select("id, domain, reason, created_at")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id, domain: row.domain, reason: row.reason, createdAt: row.created_at };
  });

export const unblockDomain = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ domain: Domain }).parse(d))
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { normalizeDomain } = await import("@/lib/exchange/domain");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("exchange_blocks")
      .delete()
      .eq("user_id", context.userId)
      .eq("domain", normalizeDomain(data.domain));
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ── Hosted placements ─────────────────────────────────────────── */

/**
 * Takes a link out of one of the member's own articles.
 *
 * A reserved or placed link is simply cancelled and the requester refunded. A
 * LIVE link is a promise already paid for: removing it returns the credits
 * the host earned and costs reputation, exactly as if the link had vanished
 * on its own — the dashboard says so before it lets them.
 */
export const removeHostedPlacement = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { refundPlacement, clawbackPlacement } = await import("@/lib/exchange/exchange.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: p } = await supabaseAdmin
      .from("exchange_placements")
      .select("id, status, host_blog_id, target_url, anchor_used")
      .eq("id", data.id)
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
        .eq("user_id", context.userId)
        .maybeSingle();
      if (blog?.body) {
        const { sameLink } = await import("@/lib/exchange/domain");
        const body = blog.body.replace(
          /\[([^\]\n]*)\]\(\s*<?([^\s)>]+)>?(?:\s+"[^"]*")?\s*\)/g,
          (whole: string, text: string, href: string) =>
            sameLink(href, p.target_url) ? text : whole,
        );
        if (body !== blog.body) {
          await supabaseAdmin.from("blogs").update({ body }).eq("id", p.host_blog_id);
        }
      }
    }
    return { ok: true };
  });

/* ── Published URL (manual) ────────────────────────────────────── */

/** The member pastes where an article went live; the cron verifies from there. */
export const setPublishedUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ blogId: z.string().uuid(), url: Url }).parse(d))
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { assertSafeUrl, UnsafeUrlError } = await import("@/lib/safe-fetch.server");
    try {
      assertSafeUrl(data.url);
    } catch (err) {
      if (err instanceof UnsafeUrlError) throw new Error("That URL can't be checked.");
      throw err;
    }
    const { loadSite } = await import("@/lib/exchange/exchange.server");
    const { isOnDomain } = await import("@/lib/exchange/domain");
    const site = await loadSite(context.userId);
    if (!site || !isOnDomain(data.url, site.domain)) {
      throw new Error(`The published URL must be on ${site?.domain ?? "your verified domain"}.`);
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("blogs")
      .update({
        published_url: data.url,
        published_url_source: "manual",
        published_at: new Date().toISOString(),
      })
      .eq("id", data.blogId)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
