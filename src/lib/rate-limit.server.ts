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
    // `hit_rate_limit` is an optional RPC that may not exist yet (fail-open).
    // It is not in the generated types, so call it via a loosely-typed handle.
    // Keep it a method call: `rpc` pulled off on its own loses its client and
    // throws, which the catch below turns into a silent fail-open every time.
    const client = supabaseAdmin as unknown as {
      rpc: (
        fn: string,
        args: Record<string, unknown>,
      ) => Promise<{ data: unknown; error: unknown }>;
    };
    const { data, error } = await client.rpc("hit_rate_limit", {
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

/**
 * Per-user guard for authenticated AI server functions.
 *
 * Throws rather than returning a Response, because createServerFn handlers
 * surface errors, not HTTP objects. These endpoints were completely
 * unthrottled: a signed-in account could loop analyzeWebsite or
 * generateBlogContent, each of which is a multi-call LLM + Firecrawl
 * operation, all before any payment method exists.
 */
export async function assertAiRateLimit(userId: string): Promise<void> {
  const count = await hit(`ai:${userId}`);
  if (count === null) return; // store unavailable — fail open, as above
  if (count > limitFromEnv("AI_USER_RATE_LIMIT", 12)) {
    throw new Error("You're making AI requests too quickly. Wait a minute and try again.");
  }
}

/**
 * Per-IP guard for the free, sign-up-free AI tools (/tools and the live demos
 * on the integration pages). Each call is a paid model call, and these are the
 * only AI endpoints anyone can reach without an account, so they get their own
 * small bucket rather than the public API's generous one.
 */
export async function assertFreeAiRateLimit(request: Request | null | undefined): Promise<void> {
  const ip = request ? clientIp(request) : null;
  if (!ip) return;
  const count = await hit(`free-ai:${ip}`);
  if (count === null) return; // store unavailable — fail open, as above
  if (count > limitFromEnv("FREE_AI_IP_RATE_LIMIT", 6)) {
    throw new Error("You've run a lot of these in the last minute. Wait a moment and try again.");
  }
}

/** Per-user guard (caps one account across all its keys). 429 Response, or null. */
export async function rateLimitByUser(userId: string): Promise<Response | null> {
  const count = await hit(`user:${userId}`);
  if (count === null) return null;
  return count > userLimit() ? tooManyRequests() : null;
}
