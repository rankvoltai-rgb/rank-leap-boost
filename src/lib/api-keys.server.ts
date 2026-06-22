// Server-only helpers for Rankvolt publishing API keys.
// The raw key is shown to the user exactly once at creation; we only ever
// store its SHA-256 hash, so a database leak never exposes usable keys.
import { createHash, randomBytes } from "crypto";

const KEY_PREFIX = "rv_live_";

export interface GeneratedKey {
  /** Full secret, shown to the user once. */
  raw: string;
  /** Short, non-secret fragment stored for display in the dashboard. */
  prefix: string;
  /** SHA-256 hex digest stored in the database. */
  hash: string;
}

export function hashApiKey(raw: string): string {
  return createHash("sha256").update(raw.trim()).digest("hex");
}

export function generateApiKey(): GeneratedKey {
  const raw = `${KEY_PREFIX}${randomBytes(24).toString("hex")}`;
  // e.g. "rv_live_a1b2c3d4…" — enough to recognise, never enough to use.
  const prefix = `${raw.slice(0, KEY_PREFIX.length + 6)}…`;
  return { raw, prefix, hash: hashApiKey(raw) };
}

/** Extract the bearer/x-api-key token from an incoming request, if present. */
export function extractApiKey(request: Request): string | null {
  const auth = request.headers.get("authorization");
  if (auth) {
    const match = auth.match(/^Bearer\s+(.+)$/i);
    if (match) return match[1].trim();
  }
  const headerKey = request.headers.get("x-api-key");
  return headerKey ? headerKey.trim() : null;
}

/**
 * Resolve the owner of an incoming API key. Returns the user id for a valid,
 * non-revoked key, otherwise null. Bumps last_used_at as a side effect.
 * Uses the service-role client because the request is unauthenticated HTTP.
 */
export async function resolveApiKeyUser(request: Request): Promise<string | null> {
  const raw = extractApiKey(request);
  if (!raw || !raw.startsWith(KEY_PREFIX)) return null;

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const hash = hashApiKey(raw);

  const { data, error } = await supabaseAdmin
    .from("api_keys")
    .select("id, user_id, revoked_at")
    .eq("key_hash", hash)
    .maybeSingle();

  if (error || !data || data.revoked_at) return null;

  // Best-effort usage timestamp; never block the response on it.
  void supabaseAdmin
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", data.id);

  return data.user_id as string;
}

/** Stable, human-friendly slug derived from a title plus a short id suffix. */
export function articleSlug(title: string, id: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${base || "article"}-${id.slice(0, 8)}`;
}