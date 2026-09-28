/**
 * Shopify: the token endpoint and the few GraphQL Admin API calls the
 * publisher needs. Server only: every call carries a store's access token, and
 * the token never leaves this process.
 */

/** Pinned, and the same version the app's webhooks are set to. */
export const SHOPIFY_API_VERSION = "2026-07";

/**
 * The one scope the app asks for. It covers blogs and articles, and a write
 * scope includes read. Nothing about products, orders, or customers, which
 * is what /integrations/shopify promises.
 */
export const SHOPIFY_SCOPES = ["write_content"] as const;

export interface ShopifyConfig {
  /** The app's client ID. Also the `aud` of every ID token. */
  apiKey: string;
  /** The client secret: signs ID tokens and webhooks, and is sent to the token endpoint. */
  apiSecret: string;
  /** Master secret for token encryption (webflow/crypto.ts, shopify purpose). */
  encryptionKey: string;
}

/** Read inside handlers only: env is bound at request time. */
export function shopifyConfig(): ShopifyConfig {
  const apiKey = process.env.SHOPIFY_API_KEY?.trim();
  const apiSecret = process.env.SHOPIFY_API_SECRET?.trim();
  const encryptionKey = process.env.INTEGRATIONS_ENCRYPTION_KEY?.trim();
  if (!apiKey || !apiSecret || !encryptionKey) throw new ShopifyNotConfiguredError();
  return { apiKey, apiSecret, encryptionKey };
}

export class ShopifyNotConfiguredError extends Error {
  constructor() {
    super("Shopify publishing isn't configured on this server yet.");
    this.name = "ShopifyNotConfiguredError";
  }
}

export class ShopifyApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
    /** For userErrors: the input path, e.g. ["article", "handle"]. */
    public field?: string[],
  ) {
    super(message);
    this.name = "ShopifyApiError";
  }

  /** The token is no good: expired, retired, or the app was uninstalled. */
  get unauthorized(): boolean {
    return this.status === 401;
  }
}

/** Said the way a merchant can act on, wherever a token is missing or refused. */
export const REOPEN_APP =
  "Shopify needs you to open Rankbox in your Shopify admin once to keep publishing.";

const TIMEOUT_MS = 20_000;
const MAX_RETRIES = 3;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ----------------------------------------------------------------- tokens --

export interface TokenSet {
  accessToken: string;
  accessExpiresAt: string | null;
  refreshToken: string | null;
  refreshExpiresAt: string | null;
  scope: string | null;
}

function expiry(seconds: unknown, now: number): string | null {
  return typeof seconds === "number" && seconds > 0
    ? new Date(now + seconds * 1000).toISOString()
    : null;
}

/**
 * One call to the token endpoint. Network errors and 5xx are retried with the
 * same body: Shopify documents that repeating a refresh returns the same
 * rotated credentials, so a retry can't burn the store's refresh token.
 */
async function tokenRequest(shop: string, body: Record<string, string>): Promise<TokenSet> {
  for (let attempt = 0; ; attempt++) {
    const started = Date.now();
    let res: Response;
    try {
      res = await fetch(`https://${shop}/admin/oauth/access_token`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (err) {
      if (attempt >= MAX_RETRIES)
        throw new ShopifyApiError(0, `Couldn't reach Shopify: ${String(err)}`);
      await sleep(500 * 2 ** attempt);
      continue;
    }
    if (res.status >= 500 && attempt < MAX_RETRIES) {
      await sleep(1000 * 2 ** attempt);
      continue;
    }
    const json = (await res.json().catch(() => null)) as Record<string, unknown> | null;
    if (!res.ok || typeof json?.access_token !== "string") {
      const reason = String(
        json?.error_description ?? json?.error ?? `Shopify returned ${res.status}`,
      );
      // A refused grant (bad ID token, spent or expired refresh token) reads as
      // unauthorized: the caller drops the tokens and waits for the app to open.
      throw new ShopifyApiError(
        res.status === 400 ? 401 : res.status,
        reason,
        String(json?.error ?? ""),
      );
    }
    return {
      accessToken: json.access_token,
      accessExpiresAt: expiry(json.expires_in, started),
      refreshToken: typeof json.refresh_token === "string" ? json.refresh_token : null,
      refreshExpiresAt: expiry(json.refresh_token_expires_in, started),
      scope: typeof json.scope === "string" ? json.scope : null,
    };
  }
}

/**
 * Token exchange: an ID token from the embedded app for an expiring offline
 * token and its refresh token. Retires every other token for the store, so it
 * only runs when there is no usable refresh token (see tokens.server.ts).
 */
export function exchangeIdToken(
  config: ShopifyConfig,
  shop: string,
  idToken: string,
): Promise<TokenSet> {
  return tokenRequest(shop, {
    client_id: config.apiKey,
    client_secret: config.apiSecret,
    grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
    subject_token: idToken,
    subject_token_type: "urn:ietf:params:oauth:token-type:id_token",
    requested_token_type: "urn:shopify:params:oauth:token-type:offline-access-token",
    expiring: "1",
  });
}

/** A new access token and a new refresh token, from the stored refresh token. */
export function refreshAccessToken(
  config: ShopifyConfig,
  shop: string,
  refreshToken: string,
): Promise<TokenSet> {
  return tokenRequest(shop, {
    client_id: config.apiKey,
    client_secret: config.apiSecret,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
}

// ---------------------------------------------------------------- GraphQL --

interface GraphqlError {
  message?: string;
  extensions?: { code?: string };
}

interface UserError {
  field?: string[] | null;
  message?: string;
  code?: string | null;
}

/**
 * One GraphQL request, with backoff on throttling and transient failures.
 *
 * `once` is for creates. A timeout or 5xx doesn't say whether Shopify made
 * the article, and retrying blind could put a second copy on the store. So a
 * create is retried only when Shopify says it didn't run it (429, THROTTLED).
 * Anything else surfaces, and the caller looks the article up first.
 */
export async function graphql<T>(
  shop: string,
  token: string,
  query: string,
  variables: Record<string, unknown> = {},
  opts: { once?: boolean } = {},
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    let res: Response;
    try {
      res = await fetch(`https://${shop}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`, {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": token,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ query, variables }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (err) {
      if (opts.once || attempt >= MAX_RETRIES)
        throw new ShopifyApiError(0, `Couldn't reach Shopify: ${String(err)}`);
      await sleep(500 * 2 ** attempt);
      continue;
    }

    if (!res.ok) {
      const retryable = res.status === 429 || (!opts.once && res.status >= 500);
      if (retryable && attempt < MAX_RETRIES) {
        const retryAfter = Number(res.headers.get("Retry-After"));
        await sleep(
          Math.min(
            Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 1000 * 2 ** attempt,
            15_000,
          ),
        );
        continue;
      }
      throw new ShopifyApiError(res.status, httpMessage(res.status));
    }

    const body = (await res.json()) as { data?: T; errors?: GraphqlError[] | string };
    const errors = Array.isArray(body.errors)
      ? body.errors
      : body.errors
        ? [{ message: body.errors }]
        : [];
    if (errors.length) {
      const code = errors[0].extensions?.code;
      if (code === "THROTTLED" && attempt < MAX_RETRIES) {
        await sleep(1000 * 2 ** attempt);
        continue;
      }
      const status = code === "ACCESS_DENIED" ? 403 : 400;
      throw new ShopifyApiError(status, errors.map((e) => e.message).join("; "), code);
    }
    return body.data as T;
  }
}

function httpMessage(status: number): string {
  switch (status) {
    case 401:
      return "Shopify no longer accepts Rankbox's access for this store.";
    case 402:
      return "This Shopify store is frozen or unpaid, so Shopify isn't accepting changes.";
    case 403:
      return "Rankbox doesn't have permission for this in Shopify.";
    case 404:
      return "Shopify couldn't find this store.";
    case 423:
      return "This Shopify store is locked.";
    default:
      return `Shopify returned ${status}.`;
  }
}

function throwUserErrors(errors: UserError[] | null | undefined): void {
  if (!errors?.length) return;
  const first = errors[0];
  throw new ShopifyApiError(
    422,
    errors.map((e) => e.message ?? "Invalid input").join("; "),
    first.code ?? undefined,
    first.field ?? undefined,
  );
}

// ------------------------------------------------------------ store info --

export interface ShopInfo {
  name: string;
  /** Where the storefront is served, e.g. fernwoodcoffee.com. */
  primaryHost: string | null;
}

export async function getShopInfo(shop: string, token: string): Promise<ShopInfo> {
  const data = await graphql<{ shop: { name: string; primaryDomain?: { host?: string } | null } }>(
    shop,
    token,
    `
      {
        shop {
          name
          primaryDomain {
            host
          }
        }
      }
    `,
  );
  return { name: data.shop.name, primaryHost: data.shop.primaryDomain?.host ?? null };
}

// ------------------------------------------------------------------ blogs --

export interface ShopifyBlog {
  id: string;
  title: string;
  handle: string;
}

export async function listBlogs(shop: string, token: string): Promise<ShopifyBlog[]> {
  const data = await graphql<{ blogs: { nodes: ShopifyBlog[] } }>(
    shop,
    token,
    `
      {
        blogs(first: 100) {
          nodes {
            id
            title
            handle
          }
        }
      }
    `,
  );
  return data.blogs.nodes;
}

export async function getBlog(
  shop: string,
  token: string,
  id: string,
): Promise<ShopifyBlog | null> {
  const data = await graphql<{ blog: ShopifyBlog | null }>(
    shop,
    token,
    `
      query Blog($id: ID!) {
        blog(id: $id) {
          id
          title
          handle
        }
      }
    `,
    { id },
  );
  return data.blog;
}

// --------------------------------------------------------------- articles --

export interface ShopifyArticle {
  id: string;
  title?: string;
  handle: string;
  createdAt?: string;
  updatedAt: string | null;
  isPublished: boolean;
  blog?: { id: string };
}

const ARTICLE_FIELDS = "id title handle createdAt updatedAt isPublished blog { id }";

/** null when the article no longer exists. */
export async function getArticle(
  shop: string,
  token: string,
  id: string,
): Promise<ShopifyArticle | null> {
  const data = await graphql<{ article: ShopifyArticle | null }>(
    shop,
    token,
    `query Article($id: ID!) { article(id: $id) { ${ARTICLE_FIELDS} } }`,
    { id },
  );
  return data.article;
}

/** The numeric part of a GID, which the search syntax filters on. */
export function numericId(gid: string): string {
  return gid.split("/").pop() ?? gid;
}

/** The article in this blog with exactly this handle, or null. */
export async function findArticleByHandle(
  shop: string,
  token: string,
  blogId: string,
  handle: string,
): Promise<ShopifyArticle | null> {
  const data = await graphql<{ articles: { nodes: ShopifyArticle[] } }>(
    shop,
    token,
    `query Find($q: String!) { articles(first: 5, query: $q) { nodes { ${ARTICLE_FIELDS} } } }`,
    { q: `blog_id:${numericId(blogId)} AND handle:${handle}` },
  );
  return data.articles.nodes.find((a) => a.handle === handle && a.blog?.id === blogId) ?? null;
}

export async function createArticle(
  shop: string,
  token: string,
  article: Record<string, unknown>,
): Promise<ShopifyArticle> {
  const data = await graphql<{
    articleCreate: { article: ShopifyArticle | null; userErrors: UserError[] };
  }>(
    shop,
    token,
    `mutation Create($article: ArticleCreateInput!) {
      articleCreate(article: $article) {
        article { ${ARTICLE_FIELDS} }
        userErrors { field message code }
      }
    }`,
    { article },
    { once: true },
  );
  throwUserErrors(data.articleCreate.userErrors);
  if (!data.articleCreate.article)
    throw new ShopifyApiError(502, "Shopify didn't return the article.");
  return data.articleCreate.article;
}

export async function updateArticle(
  shop: string,
  token: string,
  id: string,
  article: Record<string, unknown>,
): Promise<ShopifyArticle> {
  const data = await graphql<{
    articleUpdate: { article: ShopifyArticle | null; userErrors: UserError[] };
  }>(
    shop,
    token,
    `mutation Update($id: ID!, $article: ArticleUpdateInput!) {
      articleUpdate(id: $id, article: $article) {
        article { ${ARTICLE_FIELDS} }
        userErrors { field message code }
      }
    }`,
    { id, article },
  );
  throwUserErrors(data.articleUpdate.userErrors);
  if (!data.articleUpdate.article)
    throw new ShopifyApiError(502, "Shopify didn't return the article.");
  return data.articleUpdate.article;
}

/** Whether a failed create may still have made the article: timeouts and 5xx. */
export function mayHaveLanded(err: unknown): boolean {
  return err instanceof ShopifyApiError && (err.status === 0 || err.status >= 500);
}

/** A handle another article in the blog already has. */
export function isHandleTaken(err: unknown): boolean {
  return (
    err instanceof ShopifyApiError &&
    err.status === 422 &&
    (err.code === "TAKEN" || /taken|already/i.test(err.message)) &&
    (err.field?.includes("handle") || /handle/i.test(err.message))
  );
}
