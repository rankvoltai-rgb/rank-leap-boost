/**
 * The server side of the embedded app (the page at /shopify that Shopify shows
 * inside the admin). Every request carries an ID token from App Bridge; that
 * token, checked against the client secret, is the only thing that says which
 * store is asking. Nothing a request body says about the store is trusted.
 */
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  ShopifyApiError,
  ShopifyNotConfiguredError,
  getBlog,
  getShopInfo,
  listBlogs,
  shopifyConfig,
  type ShopifyBlog,
  type ShopifyConfig,
} from "./api.server";
import {
  installFromIdToken,
  loadByShop,
  withAccessToken,
  type ShopifyConnection,
} from "./tokens.server";
import { bearerToken, verifyIdToken } from "./verify";

export interface AppSession {
  config: ShopifyConfig;
  shop: string;
  idToken: string;
}

export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers },
  });
}

export function fail(message: string, status = 400): Response {
  return json({ error: message }, status);
}

/** The verified store behind a request, or the response to send instead. */
export async function authenticate(request: Request): Promise<AppSession | Response> {
  let config: ShopifyConfig;
  try {
    config = shopifyConfig();
  } catch (err) {
    if (err instanceof ShopifyNotConfiguredError) return fail(err.message, 503);
    throw err;
  }
  const idToken = bearerToken(request);
  const claims = await verifyIdToken(idToken, config);
  if (!claims || !idToken) {
    // App Bridge retries once with a fresh ID token when it sees this header.
    return json({ error: "Your Shopify session expired. Reload the page." }, 401, {
      "X-Shopify-Retry-Invalid-Session-Request": "1",
    });
  }
  return { config, shop: claims.shop, idToken };
}

/** Turn anything thrown into a response the page can show. */
export function errorResponse(err: unknown, where: string): Response {
  if (err instanceof ShopifyApiError) {
    // Our own refusals (409, 422…) keep their status; Shopify outages read as 502.
    const status = err.status >= 400 && err.status < 500 ? err.status : 502;
    return fail(err.message, status);
  }
  console.error(`shopify app: ${where} failed`, err instanceof Error ? err.message : err);
  return fail("Something went wrong on Rankbox's side. Try again in a minute.", 500);
}

// ------------------------------------------------------------------ state --

export interface AppState {
  shop: string;
  shopName: string | null;
  status: "setup" | "active" | "error" | "uninstalled";
  lastError: string | null;
  lastPublishedAt: string | null;
  /** The Rankbox site this store publishes for, once a key is pasted. */
  site: { brandName: string | null; websiteUrl: string | null; entitled: boolean } | null;
  blogs: ShopifyBlog[];
  settings: { blogId: string | null; visible: boolean; author: string };
  counts: { inShopify: number; notYet: number; editedInShopify: number };
}

async function siteSummary(conn: ShopifyConnection): Promise<AppState["site"]> {
  if (!conn.site_id || !conn.user_id) return null;
  const scope = { userId: conn.user_id, siteId: conn.site_id };
  const [{ data: profile }, { hasGenerationEntitlement }] = await Promise.all([
    supabaseAdmin
      .from("profiles")
      .select("brand_name, website_url")
      .eq("id", scope.siteId)
      .eq("user_id", scope.userId)
      .maybeSingle(),
    import("@/lib/entitlement.server"),
  ]);
  return {
    brandName: profile?.brand_name ?? null,
    websiteUrl: profile?.website_url ?? null,
    entitled: await hasGenerationEntitlement(supabaseAdmin, scope),
  };
}

async function counts(conn: ShopifyConnection): Promise<AppState["counts"]> {
  const result = { inShopify: 0, notYet: 0, editedInShopify: 0 };
  if (!conn.site_id || !conn.user_id || !conn.shopify_blog_id) return result;
  const { fetchAll } = await import("@/lib/webflow/publish.server");
  const blogId = conn.shopify_blog_id;
  const [rows, { count: finished }] = await Promise.all([
    fetchAll((from, to) =>
      supabaseAdmin
        .from("shopify_articles")
        .select("state")
        .eq("connection_id", conn.id)
        .eq("shopify_blog_id", blogId)
        .order("id", { ascending: true })
        .range(from, to),
    ),
    supabaseAdmin
      .from("blogs")
      .select("id", { count: "exact", head: true })
      .eq("site_id", conn.site_id)
      .eq("user_id", conn.user_id)
      .eq("status", "finished"),
  ]);
  for (const row of rows) {
    if (["published", "hidden", "updating"].includes(row.state)) result.inShopify++;
    if (row.state === "edited_in_shopify") result.editedInShopify++;
  }
  result.notYet = Math.max(0, (finished ?? 0) - rows.length);
  return result;
}

export async function stateFor(session: AppSession, conn: ShopifyConnection): Promise<AppState> {
  const [site, blogs, tally] = await Promise.all([
    siteSummary(conn),
    withAccessToken(conn, session.config, (token) => listBlogs(conn.shop, token)),
    counts(conn),
  ]);
  return {
    shop: conn.shop,
    shopName: conn.shop_name,
    status: conn.status as AppState["status"],
    lastError: conn.last_error,
    lastPublishedAt: conn.last_published_at,
    site,
    blogs,
    settings: {
      blogId: conn.shopify_blog_id,
      visible: conn.publish_visible,
      author: conn.author ?? site?.brandName ?? conn.shop_name ?? "",
    },
    counts: tally,
  };
}

/** GET: install if needed (first open, reinstall), then describe the store. */
export async function loadApp(session: AppSession): Promise<AppState> {
  const conn = await installFromIdToken(session.config, session.shop, session.idToken);
  return stateFor(session, conn);
}

async function requireConnection(session: AppSession): Promise<ShopifyConnection> {
  const conn = await loadByShop(session.shop);
  if (!conn) throw new ShopifyApiError(409, "Reload the page to finish installing Rankbox.");
  return conn;
}

// ------------------------------------------------------------------- link --

export type LinkResult =
  | { ok: true; state: AppState }
  | { ok: false; status: number; error: string };

/** Link the store to the Rankbox site the pasted key belongs to. */
export async function linkSite(session: AppSession, apiKey: string): Promise<LinkResult> {
  const { resolveApiKey } = await import("@/lib/api-keys.server");
  const auth = await resolveApiKey(apiKey);
  if (!auth.ok) {
    return auth.reason === "no-plan"
      ? {
          ok: false,
          status: 402,
          error:
            "That key's Rankbox site doesn't have an active plan or trial. Start one in Rankbox, then paste the key again.",
        }
      : {
          ok: false,
          status: 400,
          error:
            "That key isn't a working Rankbox API key. Copy it again from Rankbox → Integrations.",
        };
  }

  const conn = await requireConnection(session);
  const { data: other } = await supabaseAdmin
    .from("shopify_connections")
    .select("id, shop, status, access_token_enc, refresh_token_enc")
    .eq("site_id", auth.siteId)
    .neq("id", conn.id)
    .maybeSingle();
  if (other) {
    const stillInstalled =
      other.status !== "uninstalled" && (!!other.access_token_enc || !!other.refresh_token_enc);
    if (stillInstalled) {
      return {
        ok: false,
        status: 409,
        error: `That Rankbox site already publishes to ${other.shop}. Disconnect it in the Rankbox app on that store first, or use the key of another site.`,
      };
    }
    // An uninstalled store keeps its link until Shopify's redact; free the site.
    await supabaseAdmin
      .from("shopify_connections")
      .update({
        site_id: null,
        user_id: null,
        status: other.status === "uninstalled" ? "uninstalled" : "setup",
      })
      .eq("id", other.id);
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("brand_name")
    .eq("id", auth.siteId)
    .eq("user_id", auth.userId)
    .maybeSingle();

  const { data: linked, error } = await supabaseAdmin
    .from("shopify_connections")
    .update({
      site_id: auth.siteId,
      user_id: auth.userId,
      author: conn.author ?? profile?.brand_name ?? conn.shop_name ?? null,
      // Publishing starts once a blog is confirmed in the settings.
      status: conn.shopify_blog_id ? "active" : "setup",
      last_error: null,
    })
    .eq("id", conn.id)
    .select("*")
    .single();
  if (error) {
    if (error.code === "23505") {
      return {
        ok: false,
        status: 409,
        error: "That Rankbox site was just connected to another store.",
      };
    }
    throw new Error(error.message);
  }
  return { ok: true, state: await stateFor(session, linked) };
}

/** Stop publishing for this store. The ledger stays, so relinking never duplicates posts. */
export async function unlinkSite(session: AppSession): Promise<AppState> {
  const conn = await requireConnection(session);
  const { data, error } = await supabaseAdmin
    .from("shopify_connections")
    .update({ site_id: null, user_id: null, status: "setup", last_error: null })
    .eq("id", conn.id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return stateFor(session, data);
}

// --------------------------------------------------------------- settings --

export interface SettingsInput {
  blogId: string;
  visible: boolean;
  author: string;
}

export async function saveSettings(session: AppSession, input: SettingsInput): Promise<AppState> {
  const conn = await requireConnection(session);
  if (!conn.site_id) throw new ShopifyApiError(409, "Paste your Rankbox API key first.");

  // Checked against the store, never taken from the request on trust.
  const { blog, info } = await withAccessToken(conn, session.config, async (token) => ({
    blog: await getBlog(conn.shop, token, input.blogId),
    info: await getShopInfo(conn.shop, token),
  }));
  if (!blog)
    throw new ShopifyApiError(
      422,
      "That blog isn't in this store anymore. Reload and pick another.",
    );

  const { data, error } = await supabaseAdmin
    .from("shopify_connections")
    .update({
      shopify_blog_id: blog.id,
      shopify_blog_title: blog.title,
      shopify_blog_handle: blog.handle,
      publish_visible: input.visible,
      author: input.author.trim().slice(0, 100) || null,
      shop_name: info.name,
      shop_domain: info.primaryHost,
      status: "active",
      last_error: null,
    })
    .eq("id", conn.id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return stateFor(session, data);
}

// ------------------------------------------------------------------- sync --

export async function syncNow(session: AppSession) {
  const conn = await requireConnection(session);
  if (!conn.site_id || !conn.user_id)
    throw new ShopifyApiError(409, "Paste your Rankbox API key first.");
  const scope = { userId: conn.user_id, siteId: conn.site_id };
  const { hasGenerationEntitlement } = await import("@/lib/entitlement.server");
  if (!(await hasGenerationEntitlement(supabaseAdmin, scope))) {
    throw new ShopifyApiError(
      402,
      "This Rankbox site doesn't have an active plan or trial, so nothing is published.",
    );
  }
  const { syncSite } = await import("./publish.server");
  return syncSite(scope);
}
