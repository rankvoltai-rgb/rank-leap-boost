import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface ApiKeyRow {
  id: string;
  name: string;
  key_prefix: string;
  last_used_at: string | null;
  revoked_at: string | null;
  created_at: string;
}

/** List the caller's API keys (metadata only — never the raw secret). */
export const listApiKeys = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ApiKeyRow[]> => {
    const { data, error } = await context.supabase
      .from("api_keys")
      .select("id, name, key_prefix, last_used_at, revoked_at, created_at")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as ApiKeyRow[];
  });

/**
 * Create a new API key. Returns the full raw secret a single time; afterwards
 * only the prefix is retrievable. Stores just the SHA-256 hash.
 */
export const createApiKey = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { name?: string }) =>
    z.object({ name: z.string().trim().max(60).optional() }).parse(data),
  )
  .handler(async ({ data, context }): Promise<{ id: string; raw: string; prefix: string }> => {
    const { generateApiKey } = await import("@/lib/api-keys.server");
    const key = generateApiKey();
    const name = data.name?.trim() || "API key";

    const { data: inserted, error } = await context.supabase
      .from("api_keys")
      .insert({
        user_id: context.userId,
        name,
        key_prefix: key.prefix,
        key_hash: key.hash,
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    return { id: inserted.id as string, raw: key.raw, prefix: key.prefix };
  });

/** Revoke (permanently disable) one of the caller's API keys. */
export const revokeApiKey = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) =>
    z.object({ id: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { error } = await context.supabase
      .from("api_keys")
      .update({ revoked_at: new Date().toISOString() })
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });