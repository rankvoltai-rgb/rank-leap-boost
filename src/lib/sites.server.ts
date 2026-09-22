/**
 * Which site a server call acts on, and proof the caller owns it.
 *
 * Every per-site server function takes a `siteId` from the dashboard and
 * resolves it here before touching anything. The id is never trusted on its
 * own: it only chooses between sites the signed-in owner already has, and a
 * site that isn't theirs is answered exactly like one that doesn't exist.
 *
 * Reads accept any site the owner has; anything that writes, spends or runs
 * a job requires the site to be live (not pending, archived, or past a
 * scheduled removal) — see siteIsLive in src/lib/studio.ts.
 */
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Tables } from "@/integrations/supabase/types";
import { SiteUnavailableError, type SiteScope } from "@/lib/entitlement.server";
import { siteIsLive } from "@/lib/studio";

export type SiteRow = Tables<"profiles">;
export type { SiteScope };

/** The one input every per-site server function adds to its own. */
export const SiteIdInput = z.object({ siteId: z.string().uuid() });

/** The site, if this owner owns it. Throws the same error either way it isn't. */
export async function loadOwnedSite(userId: string, siteId: string): Promise<SiteRow> {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", siteId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new SiteUnavailableError("That site isn't on your account.");
  return data;
}

/** For reads: the scope of any site the owner has. */
export async function requireSiteScope(userId: string, siteId: string): Promise<SiteScope> {
  await loadOwnedSite(userId, siteId);
  return { userId, siteId };
}

/** For writes, spends and jobs: the site must be live right now. */
export async function requireLiveSite(userId: string, siteId: string): Promise<SiteRow> {
  const site = await loadOwnedSite(userId, siteId);
  if (!siteIsLive(site)) throw new SiteUnavailableError();
  return site;
}

/** Every site an owner has, in creation order. */
export async function listOwnedSites(userId: string): Promise<SiteRow[]> {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}
