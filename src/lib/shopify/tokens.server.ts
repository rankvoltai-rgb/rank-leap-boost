/**
 * A store's access token, kept usable without the merchant.
 *
 * Shopify gives public apps expiring offline tokens: the access token lasts an
 * hour and comes with a refresh token (90 days) that rotates on every use.
 * Autopilot publishes with nobody in the Shopify admin, so the publisher
 * refreshes on its own. Token exchange, which needs a live ID token from the
 * embedded app, only runs when there's nothing left to refresh with, because
 * an exchange retires every other token for the store, including one a
 * background refresh may be holding at that moment.
 *
 * Both tokens are stored encrypted (AES-256-GCM, key in the environment).
 */
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Tables, TablesUpdate } from "@/integrations/supabase/types";
import { decryptToken, encryptToken } from "@/lib/webflow/crypto";
import {
  REOPEN_APP,
  ShopifyApiError,
  exchangeIdToken,
  getShopInfo,
  refreshAccessToken,
  type ShopifyConfig,
  type TokenSet,
} from "./api.server";

export type ShopifyConnection = Tables<"shopify_connections">;

const PURPOSE = "rankbox/shopify/token/v1";

/** Refresh this long before expiry, so a publish never starts on a token about to die. */
const REFRESH_MARGIN_MS = 5 * 60 * 1000;

function isFuture(iso: string | null, marginMs = 0): boolean {
  return !iso || Date.parse(iso) - Date.now() > marginMs;
}

/** A refresh token we can still use (a missing expiry means Shopify gave none). */
export function hasUsableRefresh(conn: ShopifyConnection): boolean {
  return !!conn.refresh_token_enc && isFuture(conn.refresh_expires_at, 60_000);
}

async function sealed(set: TokenSet, key: string): Promise<TablesUpdate<"shopify_connections">> {
  return {
    access_token_enc: await encryptToken(set.accessToken, key, PURPOSE),
    access_expires_at: set.accessExpiresAt,
    refresh_token_enc: set.refreshToken ? await encryptToken(set.refreshToken, key, PURPOSE) : null,
    refresh_expires_at: set.refreshExpiresAt,
    ...(set.scope ? { scope: set.scope } : {}),
  };
}

export async function loadByShop(shop: string): Promise<ShopifyConnection | null> {
  const { data, error } = await supabaseAdmin
    .from("shopify_connections")
    .select("*")
    .eq("shop", shop)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

async function reload(conn: ShopifyConnection): Promise<ShopifyConnection> {
  const { data, error } = await supabaseAdmin
    .from("shopify_connections")
    .select("*")
    .eq("id", conn.id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

/**
 * Drop tokens Shopify refused. Only if they're still the ones we read: a
 * concurrent run may have stored fresh ones meanwhile, and those must survive.
 */
async function forgetTokens(conn: ShopifyConnection): Promise<void> {
  let query = supabaseAdmin
    .from("shopify_connections")
    .update({
      access_token_enc: null,
      access_expires_at: null,
      refresh_token_enc: null,
      refresh_expires_at: null,
      status: conn.status === "uninstalled" ? "uninstalled" : "error",
      last_error: conn.status === "uninstalled" ? conn.last_error : REOPEN_APP,
    })
    .eq("id", conn.id);
  query = conn.refresh_token_enc
    ? query.eq("refresh_token_enc", conn.refresh_token_enc)
    : query.is("refresh_token_enc", null);
  await query;
}

/**
 * A usable access token: the stored one while it has a few minutes left, else
 * a refreshed one. `force` refreshes regardless (after Shopify said 401).
 * Throws ShopifyApiError(401, REOPEN_APP) when neither is possible.
 */
export async function accessTokenFor(
  conn: ShopifyConnection,
  config: ShopifyConfig,
  opts: { force?: boolean } = {},
): Promise<string> {
  const key = config.encryptionKey;
  if (!opts.force && conn.access_token_enc && isFuture(conn.access_expires_at, REFRESH_MARGIN_MS)) {
    return decryptToken(conn.access_token_enc, key, PURPOSE);
  }
  if (!hasUsableRefresh(conn)) {
    // Nothing to refresh with. A token with a little life left still beats none.
    if (!opts.force && conn.access_token_enc && isFuture(conn.access_expires_at)) {
      return decryptToken(conn.access_token_enc, key, PURPOSE);
    }
    await forgetTokens(conn);
    throw new ShopifyApiError(401, REOPEN_APP);
  }

  const refreshToken = await decryptToken(conn.refresh_token_enc!, key, PURPOSE);
  let set: TokenSet;
  try {
    set = await refreshAccessToken(config, conn.shop, refreshToken);
  } catch (err) {
    if (!(err instanceof ShopifyApiError && err.unauthorized)) throw err;
    // Refused. If another run rotated the token while we were reading it,
    // use what that run stored; otherwise the chain is broken for good.
    const now = await reload(conn);
    if (now.refresh_token_enc !== conn.refresh_token_enc && now.access_token_enc) {
      return decryptToken(now.access_token_enc, key, PURPOSE);
    }
    await forgetTokens(now);
    throw new ShopifyApiError(401, REOPEN_APP);
  }

  const { error } = await supabaseAdmin
    .from("shopify_connections")
    .update(await sealed(set, key))
    .eq("id", conn.id);
  if (error) throw new Error(error.message);
  return set.accessToken;
}

/**
 * Run `fn` with a token. A 401 means the token was retired (another refresh or
 * an exchange won), so refresh once and run again. Shopify doesn't act on a
 * 401 request, so running `fn` twice can't create anything twice.
 */
export async function withAccessToken<T>(
  conn: ShopifyConnection,
  config: ShopifyConfig,
  fn: (token: string) => Promise<T>,
): Promise<T> {
  const token = await accessTokenFor(conn, config);
  try {
    return await fn(token);
  } catch (err) {
    if (!(err instanceof ShopifyApiError && err.unauthorized)) throw err;
    return fn(await accessTokenFor(await reload(conn), config, { force: true }));
  }
}

/**
 * The embedded app just loaded with a verified ID token. Make sure the store
 * has a row and tokens: a first open, a reinstall, or tokens dropped after
 * Shopify refused them all end in a token exchange. A store that still has a
 * working refresh token is left alone.
 */
export async function installFromIdToken(
  config: ShopifyConfig,
  shop: string,
  idToken: string,
): Promise<ShopifyConnection> {
  const existing = await loadByShop(shop);
  if (
    existing &&
    existing.status !== "uninstalled" &&
    existing.access_token_enc &&
    hasUsableRefresh(existing)
  ) {
    return existing;
  }

  const set = await exchangeIdToken(config, shop, idToken);
  const info = await getShopInfo(shop, set.accessToken).catch(() => null);
  const tokens = await sealed(set, config.encryptionKey);
  const details = info ? { shop_name: info.name, shop_domain: info.primaryHost } : {};

  if (!existing) {
    const { data, error } = await supabaseAdmin
      .from("shopify_connections")
      .insert({ shop, status: "setup", ...tokens, ...details })
      .select("*")
      .single();
    if (!error) return data;
    // Two first loads raced. Ours is the later exchange, so its tokens are
    // the ones Shopify still honours: store them over the other's.
    if (error.code !== "23505") throw new Error(error.message);
  }

  const current = existing ?? (await loadByShop(shop));
  if (!current) throw new Error("Couldn't record the Shopify install.");
  const ready = !!current.site_id && !!current.shopify_blog_id;
  const reinstalled = current.status === "uninstalled";
  const { data, error } = await supabaseAdmin
    .from("shopify_connections")
    .update({
      ...tokens,
      ...details,
      ...(reinstalled ? { installed_at: new Date().toISOString(), uninstalled_at: null } : {}),
      // Back from uninstalled, or from the "open the app" error: ready to go again.
      ...(reinstalled || current.last_error === REOPEN_APP
        ? { status: ready ? "active" : "setup", last_error: null }
        : {}),
    })
    .eq("id", current.id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}
