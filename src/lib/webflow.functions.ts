/**
 * Dashboard server functions for the Webflow app: connect, choose a site and
 * collection, map fields, sync, disconnect.
 *
 * Every function authenticates with the caller's Supabase bearer token (a
 * cross-origin page can neither obtain nor ambiently send it), resolves the
 * Rankbox site through requireSiteScope/requireLiveSite, and re-checks any
 * Webflow site or collection id against what the stored token can actually
 * see. Client-supplied ids are never trusted on their own. The token itself
 * never leaves the server.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { FieldMap, WebflowField } from "@/lib/webflow/fields";
import type { SyncResult, PublishOutcome } from "@/lib/webflow/publish.server";

export type { FieldMap, WebflowField, SyncResult, PublishOutcome };

export type WebflowConnectionStatus = "setup" | "active" | "error" | "disconnected";

export interface WebflowStatus {
  /** False until the server has its Webflow app credentials. */
  configured: boolean;
  connection: {
    connected: boolean;
    status: WebflowConnectionStatus;
    webflowSiteId: string | null;
    webflowSiteName: string | null;
    webflowDomain: string | null;
    collectionId: string | null;
    collectionName: string | null;
    collectionSlug: string | null;
    fieldMap: FieldMap;
    publishMode: "live" | "draft";
    lastError: string | null;
    lastPublishedAt: string | null;
  } | null;
  counts: { inWebflow: number; notYet: number; editedInWebflow: number };
}

export interface WebflowSiteOption {
  id: string;
  displayName: string;
  domain: string | null;
  /** Webflow only takes live items on a site that has been published once. */
  published: boolean;
}

export interface WebflowCollectionOption {
  id: string;
  displayName: string;
  slug: string;
}

export interface WebflowFieldsResult {
  collection: WebflowCollectionOption;
  fields: WebflowField[];
  suggested: FieldMap;
  /** When this schema was read from Webflow, so the UI can offer a refresh. */
  fetchedAt: string;
}

const SiteInput = z.object({ siteId: z.string().uuid() });
const WebflowId = z
  .string()
  .trim()
  .min(1)
  .max(64)
  .regex(/^[A-Za-z0-9_-]+$/);
const FieldSlug = z.string().trim().min(1).max(100).nullable();

const OAUTH_COOKIE = "rb_wf_oauth";

/** Run `fn` with the site's decrypted token; a revoked token is deleted on the spot. */
async function withToken<T>(
  scope: { userId: string; siteId: string },
  fn: (token: string) => Promise<T>,
): Promise<T> {
  const { loadConnection, tokenFor, forgetToken } = await import("@/lib/webflow/publish.server");
  const { WebflowApiError } = await import("@/lib/webflow/api.server");
  const conn = await loadConnection(scope);
  if (!conn?.access_token_enc) throw new Error("Connect Webflow first.");
  try {
    return await fn(await tokenFor(conn));
  } catch (err) {
    if (err instanceof WebflowApiError && err.revoked) {
      await forgetToken(conn, "Webflow access was removed. Reconnect Webflow to keep publishing.");
      throw new Error("Webflow access was removed. Reconnect Webflow to continue.");
    }
    throw err;
  }
}

async function requireEntitled(context: { supabase: unknown; userId: string }, siteId: string) {
  const { hasGenerationEntitlement } = await import("@/lib/entitlement.server");
  if (!(await hasGenerationEntitlement(context.supabase, { userId: context.userId, siteId }))) {
    throw new Error("Start your free trial to connect your site.");
  }
}

export const getWebflowStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { siteId: string }) => SiteInput.parse(data))
  .handler(async ({ data, context }): Promise<WebflowStatus> => {
    const { requireSiteScope } = await import("@/lib/sites.server");
    const scope = await requireSiteScope(context.userId, data.siteId);
    const { loadConnection } = await import("@/lib/webflow/publish.server");
    const { parseFieldMap } = await import("@/lib/webflow/fields");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let configured = true;
    try {
      const { webflowConfig } = await import("@/lib/webflow/api.server");
      webflowConfig();
    } catch {
      configured = false;
    }

    const conn = await loadConnection(scope);
    const counts = { inWebflow: 0, notYet: 0, editedInWebflow: 0 };
    if (conn?.collection_id) {
      const { fetchAll } = await import("@/lib/webflow/publish.server");
      const collectionId = conn.collection_id;
      const [items, { count: finished }] = await Promise.all([
        fetchAll((from, to) =>
          supabaseAdmin
            .from("webflow_items")
            .select("state")
            .eq("connection_id", conn.id)
            .eq("collection_id", collectionId)
            .order("id", { ascending: true })
            .range(from, to),
        ),
        supabaseAdmin
          .from("blogs")
          .select("id", { count: "exact", head: true })
          .eq("site_id", scope.siteId)
          .eq("user_id", scope.userId)
          .eq("status", "finished"),
      ]);
      for (const item of items) {
        if (["published", "draft", "updating"].includes(item.state)) counts.inWebflow++;
        if (item.state === "edited_in_webflow") counts.editedInWebflow++;
      }
      counts.notYet = Math.max(0, (finished ?? 0) - items.length);
    }

    return {
      configured,
      counts,
      connection: conn && {
        connected: !!conn.access_token_enc,
        status: conn.status as WebflowConnectionStatus,
        webflowSiteId: conn.webflow_site_id,
        webflowSiteName: conn.webflow_site_name,
        webflowDomain: conn.webflow_domain,
        collectionId: conn.collection_id,
        collectionName: conn.collection_name,
        collectionSlug: conn.collection_slug,
        fieldMap: parseFieldMap(conn.field_map),
        publishMode: conn.publish_mode === "draft" ? "draft" : "live",
        lastError: conn.last_error,
        lastPublishedAt: conn.last_published_at,
      },
    };
  });

/**
 * Begin Webflow OAuth. The state names the user and site and is signed; its
 * nonce also goes in an HttpOnly cookie, so the callback only completes in
 * the browser that started it (a link someone sends you can't attach your
 * Webflow to their account).
 */
export const startWebflowConnect = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { siteId: string }) => SiteInput.parse(data))
  .handler(async ({ data, context }): Promise<{ url: string }> => {
    const { requireLiveSite } = await import("@/lib/sites.server");
    await requireLiveSite(context.userId, data.siteId);
    await requireEntitled(context, data.siteId);

    const { webflowConfig, authorizeUrl } = await import("@/lib/webflow/api.server");
    const { newNonce, signState, STATE_TTL_MS } = await import("@/lib/webflow/crypto");
    const { setCookie } = await import("@tanstack/react-start/server");
    const config = webflowConfig();
    const nonce = newNonce();
    const state = await signState(
      { userId: context.userId, siteId: data.siteId, nonce, expiresAt: Date.now() + STATE_TTL_MS },
      config.encryptionKey,
    );
    // The callback runs on the redirect URI's host. Started from www (served
    // alongside the bare domain), a host-only cookie would never reach it, so
    // scope it to the redirect host, which a subdomain is allowed to set.
    const { getRequestHost } = await import("@tanstack/react-start/server");
    const redirectHost = new URL(config.redirectUri).hostname;
    const here = getRequestHost({ xForwardedHost: true }).split(":")[0];
    if (here !== redirectHost && !here.endsWith(`.${redirectHost}`)) {
      throw new Error(`Connect Webflow from ${new URL(config.redirectUri).origin}.`);
    }
    setCookie(OAUTH_COOKIE, nonce, {
      httpOnly: true,
      secure: true,
      // Lax is sent on the top-level GET back from webflow.com.
      sameSite: "lax",
      path: "/api/public/webflow",
      ...(here !== redirectHost ? { domain: redirectHost } : {}),
      maxAge: STATE_TTL_MS / 1000,
    });
    return { url: authorizeUrl(config, state) };
  });

export const listWebflowSites = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { siteId: string }) => SiteInput.parse(data))
  .handler(
    async ({ data, context }): Promise<{ sites: WebflowSiteOption[]; fetchedAt: string }> => {
      const { loadOwnedSite } = await import("@/lib/sites.server");
      const site = await loadOwnedSite(context.userId, data.siteId);
      const scope = { userId: context.userId, siteId: data.siteId };
      const { listSites } = await import("@/lib/webflow/api.server");
      const { pickDomain } = await import("@/lib/webflow/live-url");
      const sites = await withToken(scope, (token) => listSites(token));
      return {
        fetchedAt: new Date().toISOString(),
        sites: sites.map((s) => ({
          id: s.id,
          displayName: s.displayName,
          domain: pickDomain(s, site.website_url),
          published: !!s.lastPublished,
        })),
      };
    },
  );

/** Throws unless the token can see this Webflow site. */
async function assertSiteAuthorized(token: string, webflowSiteId: string) {
  const { listSites } = await import("@/lib/webflow/api.server");
  const sites = await listSites(token);
  const site = sites.find((s) => s.id === webflowSiteId);
  if (!site)
    throw new Error("That Webflow site isn't authorized for Rankbox. Reconnect and include it.");
  return site;
}

export const listWebflowCollections = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { siteId: string; webflowSiteId: string }) =>
    z.object({ siteId: z.string().uuid(), webflowSiteId: WebflowId }).parse(data),
  )
  .handler(
    async ({
      data,
      context,
    }): Promise<{ collections: WebflowCollectionOption[]; fetchedAt: string }> => {
      const { requireSiteScope } = await import("@/lib/sites.server");
      const scope = await requireSiteScope(context.userId, data.siteId);
      const { listCollections } = await import("@/lib/webflow/api.server");
      const collections = await withToken(scope, async (token) => {
        await assertSiteAuthorized(token, data.webflowSiteId);
        return listCollections(token, data.webflowSiteId);
      });
      return {
        fetchedAt: new Date().toISOString(),
        collections: collections.map((c) => ({
          id: c.id,
          displayName: c.displayName,
          slug: c.slug,
        })),
      };
    },
  );

export const getWebflowFields = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { siteId: string; webflowSiteId: string; collectionId: string }) =>
    z
      .object({ siteId: z.string().uuid(), webflowSiteId: WebflowId, collectionId: WebflowId })
      .parse(data),
  )
  .handler(async ({ data, context }): Promise<WebflowFieldsResult> => {
    const { requireSiteScope } = await import("@/lib/sites.server");
    const scope = await requireSiteScope(context.userId, data.siteId);
    const { listCollections, getCollection } = await import("@/lib/webflow/api.server");
    const { suggestFieldMap, parseFieldMap, checkFieldMap } = await import("@/lib/webflow/fields");
    const { loadConnection } = await import("@/lib/webflow/publish.server");

    const collection = await withToken(scope, async (token) => {
      await assertSiteAuthorized(token, data.webflowSiteId);
      const collections = await listCollections(token, data.webflowSiteId);
      if (!collections.some((c) => c.id === data.collectionId)) {
        throw new Error("That collection isn't on this Webflow site.");
      }
      return getCollection(token, data.collectionId);
    });

    // Keep the saved mapping when it still fits this collection.
    const conn = await loadConnection(scope);
    const saved = conn?.collection_id === data.collectionId ? parseFieldMap(conn.field_map) : null;
    const fields = collection.fields ?? [];
    const suggested = saved && checkFieldMap(fields, saved).ok ? saved : suggestFieldMap(fields);

    return {
      collection: { id: collection.id, displayName: collection.displayName, slug: collection.slug },
      fields: fields.map((f) => ({
        id: f.id,
        slug: f.slug,
        displayName: f.displayName,
        type: f.type,
        isRequired: !!f.isRequired,
        isEditable: f.isEditable !== false,
      })),
      suggested,
      fetchedAt: new Date().toISOString(),
    };
  });

export const saveWebflowSetup = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (data: {
      siteId: string;
      webflowSiteId: string;
      collectionId: string;
      fieldMap: FieldMap;
      publishMode: "live" | "draft";
    }) =>
      z
        .object({
          siteId: z.string().uuid(),
          webflowSiteId: WebflowId,
          collectionId: WebflowId,
          fieldMap: z.object({
            body: FieldSlug,
            summary: FieldSlug,
            tags: FieldSlug,
            publishedAt: FieldSlug,
          }),
          publishMode: z.enum(["live", "draft"]),
        })
        .parse(data),
  )
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { requireLiveSite } = await import("@/lib/sites.server");
    const site = await requireLiveSite(context.userId, data.siteId);
    const scope = { userId: context.userId, siteId: data.siteId };
    const { listCollections, getCollection } = await import("@/lib/webflow/api.server");
    const { checkFieldMap } = await import("@/lib/webflow/fields");
    const { pickDomain } = await import("@/lib/webflow/live-url");
    const { loadConnection } = await import("@/lib/webflow/publish.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { webflowSite, collection } = await withToken(scope, async (token) => {
      const webflowSite = await assertSiteAuthorized(token, data.webflowSiteId);
      const collections = await listCollections(token, data.webflowSiteId);
      if (!collections.some((c) => c.id === data.collectionId)) {
        throw new Error("That collection isn't on this Webflow site.");
      }
      return { webflowSite, collection: await getCollection(token, data.collectionId) };
    });

    // Checked against the live schema, not the one the page loaded earlier.
    const fields = collection.fields ?? [];
    const check = checkFieldMap(fields, data.fieldMap);
    if (!check.ok) throw new Error(check.problems.join(" "));
    const summaryField = fields.find((f) => f.slug === data.fieldMap.summary);
    if (data.publishMode === "live" && !webflowSite.lastPublished) {
      const { SITE_NOT_PUBLISHED } = await import("@/lib/webflow/api.server");
      throw new Error(SITE_NOT_PUBLISHED);
    }

    const conn = await loadConnection(scope);
    if (!conn) throw new Error("Connect Webflow first.");
    const { error } = await supabaseAdmin
      .from("webflow_connections")
      .update({
        webflow_site_id: webflowSite.id,
        webflow_site_name: webflowSite.displayName,
        webflow_domain: pickDomain(webflowSite, site.website_url),
        collection_id: collection.id,
        collection_name: collection.displayName,
        collection_slug: collection.slug,
        field_map: data.fieldMap,
        summary_is_rich: summaryField?.type === "RichText",
        publish_mode: data.publishMode,
        status: "active",
        last_error: null,
      })
      .eq("id", conn.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Publish what isn't in Webflow yet. Runs for up to ~45s; call again while `remaining` > 0. */
export const syncWebflowNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { siteId: string }) => SiteInput.parse(data))
  .handler(async ({ data, context }): Promise<SyncResult> => {
    const { requireLiveSite } = await import("@/lib/sites.server");
    await requireLiveSite(context.userId, data.siteId);
    await requireEntitled(context, data.siteId);
    const { syncSite } = await import("@/lib/webflow/publish.server");
    return syncSite({ userId: context.userId, siteId: data.siteId });
  });

/**
 * Called by the dashboard right after an article is marked finished (write
 * now, editor publish). A no-op for sites without Webflow.
 */
export const publishFinishedArticle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { siteId: string; blogId: string }) =>
    z.object({ siteId: z.string().uuid(), blogId: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }): Promise<PublishOutcome> => {
    const { requireLiveSite } = await import("@/lib/sites.server");
    await requireLiveSite(context.userId, data.siteId);
    // Publishing is part of the plan, as it is for keys and sync.
    await requireEntitled(context, data.siteId);
    const { publishArticle } = await import("@/lib/webflow/publish.server");
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
 * Revoke at Webflow and delete the token. The connection row and its ledger
 * stay, so reconnecting later updates the same items instead of duplicating.
 */
export const disconnectWebflow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { siteId: string }) => SiteInput.parse(data))
  .handler(async ({ data, context }): Promise<{ ok: true; revokedAtWebflow: boolean }> => {
    const { requireSiteScope } = await import("@/lib/sites.server");
    const scope = await requireSiteScope(context.userId, data.siteId);
    const { loadConnection, tokenFor } = await import("@/lib/webflow/publish.server");
    const { webflowConfig, revokeToken } = await import("@/lib/webflow/api.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const conn = await loadConnection(scope);
    if (!conn) return { ok: true, revokedAtWebflow: false };
    let revokedAtWebflow = false;
    if (conn.access_token_enc) {
      try {
        revokedAtWebflow = await revokeToken(webflowConfig(), await tokenFor(conn));
      } catch {
        // Undecryptable or unconfigured: deleting it below is what matters.
      }
    }
    const { error } = await supabaseAdmin
      .from("webflow_connections")
      .update({ access_token_enc: null, status: "disconnected", last_error: null })
      .eq("id", conn.id);
    if (error) throw new Error(error.message);
    return { ok: true, revokedAtWebflow };
  });
