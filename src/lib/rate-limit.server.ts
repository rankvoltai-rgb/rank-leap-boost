// Rate limiting for the public API (/api/public/v1/*) — server-only.
//
// The public API is key-authenticated and internet-facing but had no rate
// limiting, so a single caller (or a flood of invalid keys) could hammer it and
// the AI/DB behind it. This adds a fixed-window limiter keyed per-IP (bounds
// invalid-key/source floods) and per-user (bounds any one account across all
// its keys). Backed by the `rate_limit_hits` table + `hit_rate_limit` function.
//
// GRACEFUL: if that table/function isn't present yet (migration not applied),
// every check fails OPEN, so this code is safe to ship before the migration.
import { jsonResponse } from "@/lib/public-api.server";

const WINDOW_MS = 60_000;

function limitFromEnv(name: string, fallback: number): number {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}
const ipLimit = () => limitFromEnv("PUBLIC_API_IP_RATE_LIMIT", 300);
const userLimit = () => limitFromEnv("PUBLIC_API_USER_RATE_LIMIT", 120);

/** Best-effort client IP (Cloudflare sets CF-Connecting-IP). */
export function clientIp(request: Request): string | null {
  const cf = request.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || null;
  return null;
}

export function tooManyRequests(): Response {
  return jsonResponse({ error: "Rate limit exceeded. Slow down and retry shortly." }, 429);
}

/** Count a hit for `bucket` in the current window; null if the store is unavailable. */
async function hit(bucket: string): Promise<number | null> {
  const windowStart = new Date(Math.floor(Date.now() / WINDOW_MS) * WINDOW_MS).toISOString();
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.rpc("hit_rate_limit", {
      p_bucket: bucket,
      p_window_start: windowStart,
    });
    if (error || typeof data !== "number") return null; // fail open until migrated
    return data;
  } catch {
    return null;
  }
}

/** Per-IP guard for token-bearing requests. Returns a 429 Response, or null if OK. */
export async function rateLimitByIp(request: Request): Promise<Response | null> {
  const ip = clientIp(request);
  if (!ip) return null;
  const count = await hit(`ip:${ip}`);
  if (count === null) return null;
  return count > ipLimit() ? tooManyRequests() : null;
}

/** Per-user guard (caps one account across all its keys). 429 Response, or null. */
export async function rateLimitByUser(userId: string): Promise<Response | null> {
  const count = await hit(`user:${userId}`);
  if (count === null) return null;
  return count > userLimit() ? tooManyRequests() : null;
}
