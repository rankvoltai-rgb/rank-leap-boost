/**
 * Dashboard server functions for the Shopify app. Setup itself happens inside
 * the Shopify admin (the embedded app at /shopify); the dashboard only needs
 * to know whether a site publishes to a store, and to push an article the
 * moment it's finished.
 *
 * Every function authenticates with the caller's Supabase bearer token and
 * resolves the site through requireSiteScope/requireLiveSite. No token ever
 * leaves the server.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { PublishOutcome } from "@/lib/shopify/publish.server";

export type { PublishOutcome as ShopifyPublishOutcome };

export interface ShopifyStatus {
  connection: {
    /** Holding tokens, so it can publish (or will once a blog is picked). */
    connected: boolean;
    status: "setup" | "active" | "error" | "disconnected";
    shop: string;
    shopName: string | null;
    blogTitle: string | null;
    lastError: string | null;
    lastPublishedAt: string | null;
    /** Opens the Rankbox app inside this store's admin, where its settings live. */
    adminUrl: string;
  } | null;
}

const SiteInput = z.object({ siteId: z.string().uuid() });

export const getShopifyStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { siteId: string }) => SiteInput.parse(data))
  .handler(async ({ data, context }): Promise<ShopifyStatus> => {
    const { requireSiteScope } = await import("@/lib/sites.server");
    const scope = await requireSiteScope(context.userId, data.siteId);
    const { loadConnectionForSite } = await import("@/lib/shopify/publish.server");
    const conn = await loadConnectionForSite(scope);
    if (!conn) return { connection: null };
    const connected =
      conn.status !== "uninstalled" && (!!conn.access_token_enc || !!conn.refresh_token_enc);
    return {
      connection: {
        connected,
        // Uninstalled reads as disconnected, the same word the Webflow status uses.
        status:
          conn.status === "uninstalled"
            ? "disconnected"
            : (conn.status as "setup" | "active" | "error"),
        shop: conn.shop,
        shopName: conn.shop_name,
        blogTitle: conn.shopify_blog_title,
        lastError: conn.last_error,
        lastPublishedAt: conn.last_published_at,
        adminUrl: process.env.SHOPIFY_API_KEY
          ? `https://${conn.shop}/admin/apps/${process.env.SHOPIFY_API_KEY.trim()}`
          : `https://${conn.shop}/admin/apps`,
      },
    };
  });

/**
 * Called by the dashboard right after an article is marked finished (write
 * now, editor publish). A no-op for sites without a store.
 */
export const publishFinishedArticleToShopify = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { siteId: string; blogId: string }) =>
    z.object({ siteId: z.string().uuid(), blogId: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }): Promise<PublishOutcome> => {
    const { requireLiveSite } = await import("@/lib/sites.server");
    await requireLiveSite(context.userId, data.siteId);
    const { hasGenerationEntitlement } = await import("@/lib/entitlement.server");
    if (
      !(await hasGenerationEntitlement(context.supabase, {
        userId: context.userId,
        siteId: data.siteId,
      }))
    ) {
      throw new Error("Start your free trial to connect your site.");
    }
    const { publishArticle } = await import("@/lib/shopify/publish.server");
    const scope = { userId: context.userId, siteId: data.siteId };
    // Two quick saves overlap: the second finds the first still writing. Wait
    // it out briefly so the later content still lands.
    let outcome = await publishArticle(scope, data.blogId);
    for (
      let i = 0;
      i < 3 && outcome.result === "skipped" && outcome.reason === "in_progress";
      i++
    ) {
      await new Promise((r) => setTimeout(r, 2500));
      outcome = await publishArticle(scope, data.blogId);
    }
    return outcome;
  });

/**
 * Stop publishing to the store from the Rankbox side, for someone who can't
 * open the store's admin anymore. Unlinks the site; the app stays installed
 * (only the merchant can remove it) and its ledger stays, so linking again
 * later never duplicates posts.
 */
export const disconnectShopify = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { siteId: string }) => SiteInput.parse(data))
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { requireSiteScope } = await import("@/lib/sites.server");
    const scope = await requireSiteScope(context.userId, data.siteId);
    const { loadConnectionForSite } = await import("@/lib/shopify/publish.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const conn = await loadConnectionForSite(scope);
    if (!conn) return { ok: true };
    const { error } = await supabaseAdmin
      .from("shopify_connections")
      .update({
        site_id: null,
        user_id: null,
        status: conn.status === "uninstalled" ? "uninstalled" : "setup",
        last_error: null,
      })
      .eq("id", conn.id)
      .eq("site_id", scope.siteId)
      .eq("user_id", scope.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
