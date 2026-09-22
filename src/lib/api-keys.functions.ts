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

/**
 * List one site's API keys (metadata only — never the raw secret). A key
 * belongs to exactly one site: it is what that site's CMS plugin syncs with.
 */
export const listApiKeys = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { siteId: string }) => z.object({ siteId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }): Promise<ApiKeyRow[]> => {
    // Any site the owner has, archived included: its keys stay visible so
    // they can still be revoked.
    const { requireSiteScope } = await import("@/lib/sites.server");
    await requireSiteScope(context.userId, data.siteId);

    const { data: rows, error } = await context.supabase
      .from("api_keys")
      .select("id, name, key_prefix, last_used_at, revoked_at, created_at")
      .eq("site_id", data.siteId)
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (rows ?? []) as ApiKeyRow[];
  });

/**
 * Create a new API key for one site. Returns the full raw secret a single
 * time; afterwards only the prefix is retrievable. Stores just the SHA-256
 * hash.
 */
export const createApiKey = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { siteId: string; name?: string }) =>
    z
      .object({
        siteId: z.string().uuid(),
        name: z.string().trim().max(60).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }): Promise<{ id: string; raw: string; prefix: string }> => {
    const { requireLiveSite } = await import("@/lib/sites.server");
    await requireLiveSite(context.userId, data.siteId);

    // Connecting a site is part of the plan. The page gates this too, but only
    // this check can't be skipped.
    const { hasGenerationEntitlement } = await import("@/lib/entitlement.server");
    const scope = { userId: context.userId, siteId: data.siteId };
    if (!(await hasGenerationEntitlement(context.supabase, scope))) {
      throw new Error("Start your free trial to connect your site.");
    }

    const { generateApiKey } = await import("@/lib/api-keys.server");
    const key = generateApiKey();
    const name = data.name?.trim() || "API key";

    const { data: inserted, error } = await context.supabase
      .from("api_keys")
      .insert({
        user_id: context.userId,
        site_id: data.siteId,
        name,
        key_prefix: key.prefix,
        key_hash: key.hash,
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    return { id: inserted.id as string, raw: key.raw, prefix: key.prefix };
  });

/** Revoke (permanently disable) one of the caller's API keys, whichever site it is on. */
export const revokeApiKey = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { error } = await context.supabase
      .from("api_keys")
      .update({ revoked_at: new Date().toISOString() })
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
