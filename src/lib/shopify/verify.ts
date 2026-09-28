/**
 * The two things Shopify signs with the app's client secret:
 *
 * 1. The ID token (session token) App Bridge attaches to every request the
 *    embedded app makes. It is what proves a request comes from a logged-in
 *    user of a given store, since the app page carries no Rankbox session.
 * 2. Webhooks, signed over the raw body.
 *
 * Pure WebCrypto: runs in Node and in tests, reads no environment itself.
 */

const enc = new TextEncoder();
const dec = new TextDecoder();

function fromB64(text: string): Uint8Array<ArrayBuffer> {
  const b64 = text.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

const SHOP_DOMAIN = /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/;

/** A store's permanent domain, lowercased, or null when it isn't one. */
export function normalizeShop(value: string | null | undefined): string | null {
  const shop = (value ?? "").trim().toLowerCase();
  return SHOP_DOMAIN.test(shop) ? shop : null;
}

function hostOf(url: unknown): string | null {
  if (typeof url !== "string") return null;
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

export interface IdToken {
  /** The store, e.g. fernwood.myshopify.com. */
  shop: string;
  /** The Shopify user the token was issued to. */
  userId: string | null;
}

/** Clock skew allowed on exp/nbf. Shopify's own libraries allow a few seconds. */
const LEEWAY_S = 10;

/**
 * The token's store and user, or null when it is forged, expired, for another
 * app, or malformed. Never throws.
 */
export async function verifyIdToken(
  token: string | null | undefined,
  app: { apiKey: string; apiSecret: string },
  now = Date.now(),
): Promise<IdToken | null> {
  if (!token) return null;
  const [header, payload, signature] = token.split(".");
  if (!header || !payload || !signature) return null;
  try {
    const head = JSON.parse(dec.decode(fromB64(header))) as { alg?: string };
    if (head.alg !== "HS256") return null;
    // crypto.subtle.verify compares in constant time.
    const valid = await crypto.subtle.verify(
      "HMAC",
      await hmacKey(app.apiSecret),
      fromB64(signature),
      enc.encode(`${header}.${payload}`),
    );
    if (!valid) return null;

    const claims = JSON.parse(dec.decode(fromB64(payload))) as Record<string, unknown>;
    const seconds = now / 1000;
    if (!(typeof claims.exp === "number" && claims.exp > seconds - LEEWAY_S)) return null;
    if (!(typeof claims.nbf === "number" && claims.nbf <= seconds + LEEWAY_S)) return null;
    const aud = claims.aud;
    if (!(aud === app.apiKey || (Array.isArray(aud) && aud.includes(app.apiKey)))) return null;

    const shop = normalizeShop(hostOf(claims.dest));
    if (!shop || hostOf(claims.iss) !== shop) return null;
    return { shop, userId: typeof claims.sub === "string" ? claims.sub : null };
  } catch {
    return null;
  }
}

/** The bearer token on a request from the embedded app. */
export function bearerToken(request: Request): string | null {
  const match = (request.headers.get("authorization") ?? "").match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

/**
 * Whether `X-Shopify-Hmac-Sha256` is the base64 HMAC of exactly these bytes.
 * The body must be the raw bytes as received: re-serialised JSON won't match.
 */
export async function verifyWebhook(
  rawBody: ArrayBuffer | Uint8Array<ArrayBuffer>,
  hmacHeader: string | null | undefined,
  apiSecret: string,
): Promise<boolean> {
  if (!hmacHeader) return false;
  try {
    return await crypto.subtle.verify(
      "HMAC",
      await hmacKey(apiSecret),
      fromB64(hmacHeader.trim()),
      rawBody,
    );
  } catch {
    return false;
  }
}
