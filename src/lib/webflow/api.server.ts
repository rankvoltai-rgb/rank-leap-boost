/**
 * Webflow Data API v2, the few calls the publisher needs. Server only: every
 * call carries a user's OAuth token, and the token never leaves this process.
 */
import type { WebflowField } from "./fields";

const API = "https://api.webflow.com/v2";

/** Every scope is exercised: sites for the picker and domains, CMS both ways. */
export const WEBFLOW_SCOPES = ["sites:read", "cms:read", "cms:write"] as const;

export interface WebflowConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  /** Master secret for token encryption and state signing (crypto.ts). */
  encryptionKey: string;
}

/** Read inside handlers only: env is bound at request time. */
export function webflowConfig(): WebflowConfig {
  const clientId = process.env.WEBFLOW_CLIENT_ID?.trim();
  const clientSecret = process.env.WEBFLOW_CLIENT_SECRET?.trim();
  const encryptionKey = process.env.INTEGRATIONS_ENCRYPTION_KEY?.trim();
  if (!clientId || !clientSecret || !encryptionKey) {
    throw new WebflowNotConfiguredError();
  }
  const redirectUri =
    process.env.WEBFLOW_REDIRECT_URI?.trim() || "https://rankbox.xyz/api/public/webflow/callback";
  return { clientId, clientSecret, redirectUri, encryptionKey };
}

export class WebflowNotConfiguredError extends Error {
  constructor() {
    super("Webflow publishing isn't configured on this server yet.");
    this.name = "WebflowNotConfiguredError";
  }
}

export class WebflowApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = "WebflowApiError";
  }

  /** The token was revoked or the app uninstalled: stop and delete it. */
  get revoked(): boolean {
    return this.status === 401;
  }
}

export function authorizeUrl(config: WebflowConfig, state: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: WEBFLOW_SCOPES.join(" "),
    state,
  });
  return `https://webflow.com/oauth/authorize?${params.toString()}`;
}

const TIMEOUT_MS = 20_000;
const MAX_RETRIES = 3;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Webflow refuses live items on a site that has never been published, with a
 * bare "Conflict with server data". Said in terms of what to do about it.
 */
export const SITE_NOT_PUBLISHED =
  "Your Webflow site hasn't been published yet, so Webflow won't take live articles. Publish it once in Webflow (the webflow.io address is enough), or switch Rankbox to drafts.";

async function readError(res: Response): Promise<WebflowApiError> {
  const body = (await res.json().catch(() => null)) as {
    message?: string;
    msg?: string;
    code?: string;
    details?: unknown[];
  } | null;
  const detail =
    Array.isArray(body?.details) && body.details.length
      ? ` (${body.details.map((d) => (typeof d === "string" ? d : JSON.stringify(d))).join("; ")})`
      : "";
  const message = `${body?.message ?? body?.msg ?? `Webflow returned ${res.status}`}${detail}`;
  if (res.status === 409 && /site is not published/i.test(message)) {
    return new WebflowApiError(409, SITE_NOT_PUBLISHED, "site_not_published");
  }
  return new WebflowApiError(res.status, message, body?.code);
}

/**
 * One request, with exponential backoff (Webflow's guidelines require backoff
 * with a retry cap). Other errors throw immediately.
 *
 * `once` is for creates. A timeout or 5xx doesn't say whether Webflow made
 * the item, and retrying blind could put a second copy on the live site. So
 * a create is retried only on 429, which Webflow didn't act on. Anything
 * else surfaces, and the caller looks the item up before trying again.
 */
async function request<T>(
  token: string,
  path: string,
  init: { method?: string; body?: unknown; once?: boolean } = {},
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    let res: Response;
    try {
      res = await fetch(`${API}${path}`, {
        method: init.method ?? "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          ...(init.body !== undefined ? { "Content-Type": "application/json" } : {}),
        },
        body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timer);
      if (init.once || attempt >= MAX_RETRIES)
        throw new WebflowApiError(0, `Couldn't reach Webflow: ${String(err)}`);
      await sleep(500 * 2 ** attempt);
      continue;
    }
    clearTimeout(timer);

    if (res.ok) return (res.status === 204 ? undefined : await res.json()) as T;

    const retryable = res.status === 429 || (!init.once && res.status >= 500);
    if (!retryable || attempt >= MAX_RETRIES) throw await readError(res);
    const retryAfter = Number(res.headers.get("Retry-After"));
    const wait =
      Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 1000 * 2 ** attempt;
    await sleep(Math.min(wait, 15_000));
  }
}

// ------------------------------------------------------------------ OAuth --

/** Codes are single-use and live 15 minutes: exchange once, never log them. */
export async function exchangeCode(
  config: WebflowConfig,
  code: string,
): Promise<{ token: string; scope: string | null }> {
  const res = await fetch("https://api.webflow.com/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: config.redirectUri,
    }),
  });
  if (!res.ok) throw await readError(res);
  const body = (await res.json()) as { access_token?: string; scope?: string };
  if (!body.access_token) throw new WebflowApiError(502, "Webflow didn't return an access token.");
  return { token: body.access_token, scope: body.scope ?? null };
}

/** Best effort: the caller deletes the stored token whatever this returns. */
export async function revokeToken(config: WebflowConfig, token: string): Promise<boolean> {
  try {
    const res = await fetch("https://webflow.com/oauth/revoke_authorization", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        access_token: token,
      }),
    });
    const body = (await res.json().catch(() => null)) as { did_revoke?: boolean } | null;
    return res.ok && body?.did_revoke === true;
  } catch {
    return false;
  }
}

// ------------------------------------------------------------------ sites --

export interface WebflowSite {
  id: string;
  displayName: string;
  shortName: string;
  customDomains: { id?: string; url: string }[];
  lastPublished?: string | null;
}

export async function listSites(token: string): Promise<WebflowSite[]> {
  const body = await request<{ sites?: WebflowSite[] }>(token, "/sites");
  return body.sites ?? [];
}

export function getSite(token: string, siteId: string): Promise<WebflowSite> {
  return request<WebflowSite>(token, `/sites/${encodeURIComponent(siteId)}`);
}

// ------------------------------------------------------------ collections --

export interface WebflowCollectionSummary {
  id: string;
  displayName: string;
  singularName?: string;
  slug: string;
}

export interface WebflowCollection extends WebflowCollectionSummary {
  fields: WebflowField[];
}

export async function listCollections(
  token: string,
  siteId: string,
): Promise<WebflowCollectionSummary[]> {
  const body = await request<{ collections?: WebflowCollectionSummary[] }>(
    token,
    `/sites/${encodeURIComponent(siteId)}/collections`,
  );
  return body.collections ?? [];
}

export function getCollection(token: string, collectionId: string): Promise<WebflowCollection> {
  return request<WebflowCollection>(token, `/collections/${encodeURIComponent(collectionId)}`);
}

// ------------------------------------------------------------------ items --

export interface WebflowItem {
  id: string;
  createdOn?: string;
  isDraft?: boolean;
  isArchived?: boolean;
  lastUpdated?: string;
  lastPublished?: string | null;
  fieldData?: Record<string, unknown>;
}

/**
 * Create an item. `live` publishes it to the live site at once (no site
 * publish needed); otherwise it is saved as a draft for review in Webflow.
 */
export function createItem(
  token: string,
  collectionId: string,
  fieldData: Record<string, unknown>,
  live: boolean,
): Promise<WebflowItem> {
  const base = `/collections/${encodeURIComponent(collectionId)}/items`;
  return request<WebflowItem>(token, live ? `${base}/live` : base, {
    method: "POST",
    body: { isArchived: false, isDraft: !live, fieldData },
    once: true,
  });
}

/** The item with exactly this slug, drafts included, or null. */
export async function findItemBySlug(
  token: string,
  collectionId: string,
  slug: string,
): Promise<WebflowItem | null> {
  const body = await request<{ items?: WebflowItem[] }>(
    token,
    `/collections/${encodeURIComponent(collectionId)}/items?slug=${encodeURIComponent(slug)}&limit=1`,
  );
  return body.items?.[0] ?? null;
}

/** Whether a failed create may still have made the item: timeouts and 5xx. */
export function mayHaveLanded(err: unknown): boolean {
  return err instanceof WebflowApiError && (err.status === 0 || err.status >= 500);
}

export function updateItem(
  token: string,
  collectionId: string,
  itemId: string,
  fieldData: Record<string, unknown>,
  live: boolean,
): Promise<WebflowItem> {
  const base = `/collections/${encodeURIComponent(collectionId)}/items/${encodeURIComponent(itemId)}`;
  return request<WebflowItem>(token, live ? `${base}/live` : base, {
    method: "PATCH",
    body: { fieldData },
  });
}

/** The staged item, which carries the latest lastUpdated whatever its state. */
export function getItem(token: string, collectionId: string, itemId: string): Promise<WebflowItem> {
  return request<WebflowItem>(
    token,
    `/collections/${encodeURIComponent(collectionId)}/items/${encodeURIComponent(itemId)}`,
  );
}

/** Webflow reports a taken slug as a validation error naming the slug field. */
export function isSlugConflict(err: unknown): boolean {
  return (
    err instanceof WebflowApiError &&
    (err.status === 400 || err.status === 409) &&
    /slug/i.test(err.message) &&
    /(unique|already|exist|taken|duplicate|in use)/i.test(err.message)
  );
}
