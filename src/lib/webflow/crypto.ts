/**
 * The two secrets the Webflow connection handles.
 *
 * 1. The OAuth access token, encrypted at rest (AES-256-GCM). Webflow's
 *    Marketplace review requires a written attestation that it is, and the key
 *    lives in the environment, never in the database beside the ciphertext.
 * 2. The OAuth `state`, signed (HMAC-SHA256) so the callback can trust which
 *    Rankbox user and site started the flow. The callback is a plain browser
 *    navigation from webflow.com and carries no Rankbox session of its own.
 *
 * Both keys derive from one environment secret, so there is one thing to set.
 * Pure WebCrypto: runs in Node and in tests, reads no environment itself.
 */

const enc = new TextEncoder();
const dec = new TextDecoder();

function toB64url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(text: string): Uint8Array<ArrayBuffer> {
  const b64 = text.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/** The master secret: 32 random bytes, base64 (`openssl rand -base64 32`). */
function masterBytes(secret: string): Uint8Array<ArrayBuffer> {
  let bytes: Uint8Array<ArrayBuffer>;
  try {
    bytes = fromB64url(secret.trim());
  } catch {
    throw new Error("The integrations key must be base64.");
  }
  if (bytes.length < 32) throw new Error("The integrations key must be at least 32 bytes.");
  return bytes;
}

async function deriveBytes(secret: string, purpose: string): Promise<Uint8Array<ArrayBuffer>> {
  const master = await crypto.subtle.importKey(
    "raw",
    masterBytes(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", master, enc.encode(purpose)));
}

async function aesKey(secret: string): Promise<CryptoKey> {
  const raw = await deriveBytes(secret, "rankbox/webflow/token/v1");
  return crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  const raw = await deriveBytes(secret, "rankbox/webflow/oauth-state/v1");
  return crypto.subtle.importKey("raw", raw, { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

// ------------------------------------------------------------------ token --

const TOKEN_VERSION = "v1";

export async function encryptToken(plain: string, secret: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const sealed = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    await aesKey(secret),
    enc.encode(plain),
  );
  return `${TOKEN_VERSION}.${toB64url(iv)}.${toB64url(new Uint8Array(sealed))}`;
}

/** Throws when the blob was tampered with or sealed under another key. */
export async function decryptToken(blob: string, secret: string): Promise<string> {
  const [version, iv, sealed] = blob.split(".");
  if (version !== TOKEN_VERSION || !iv || !sealed) throw new Error("Unrecognised token format.");
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromB64url(iv) },
    await aesKey(secret),
    fromB64url(sealed),
  );
  return dec.decode(plain);
}

// ------------------------------------------------------------------ state --

export interface OAuthState {
  /** Rankbox user id. */
  userId: string;
  /** Rankbox site the connection is for. */
  siteId: string;
  /** Also set in an HttpOnly cookie; the callback requires both to match. */
  nonce: string;
  /** Epoch ms. */
  expiresAt: number;
}

/** Long enough to pick sites on Webflow's consent screen, short enough to be useless if leaked. */
export const STATE_TTL_MS = 15 * 60 * 1000;

export function newNonce(): string {
  return toB64url(crypto.getRandomValues(new Uint8Array(18)));
}

export async function signState(state: OAuthState, secret: string): Promise<string> {
  const body = toB64url(
    enc.encode(
      JSON.stringify({ u: state.userId, s: state.siteId, n: state.nonce, e: state.expiresAt }),
    ),
  );
  const mac = await crypto.subtle.sign("HMAC", await hmacKey(secret), enc.encode(body));
  return `${body}.${toB64url(new Uint8Array(mac))}`;
}

/**
 * The state's contents, or null when it is forged, expired, malformed, or was
 * not started in this browser (`cookieNonce` mismatch). Never throws.
 */
export async function verifyState(
  raw: string | null | undefined,
  cookieNonce: string | null | undefined,
  secret: string,
  now = Date.now(),
): Promise<OAuthState | null> {
  if (!raw || !cookieNonce) return null;
  const [body, mac] = raw.split(".");
  if (!body || !mac) return null;
  try {
    // crypto.subtle.verify compares in constant time.
    const valid = await crypto.subtle.verify(
      "HMAC",
      await hmacKey(secret),
      fromB64url(mac),
      enc.encode(body),
    );
    if (!valid) return null;
    const parsed = JSON.parse(dec.decode(fromB64url(body))) as Record<string, unknown>;
    const state: OAuthState = {
      userId: String(parsed.u ?? ""),
      siteId: String(parsed.s ?? ""),
      nonce: String(parsed.n ?? ""),
      expiresAt: Number(parsed.e ?? 0),
    };
    if (!state.userId || !state.siteId || !state.nonce) return null;
    if (!(state.expiresAt > now)) return null;
    if (state.nonce !== cookieNonce) return null;
    return state;
  } catch {
    return null;
  }
}
