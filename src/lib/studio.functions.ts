/**
 * Studio's server functions — the only way the dashboard adds, removes or
 * restores a site. Every one authenticates the caller and acts on their own
 * account; the site ids they take are only ever checked against sites that
 * account already owns. Billing rules live in src/lib/studio.server.ts.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { StudioQuote } from "@/lib/studio.server";

const SiteId = z.string().uuid();
const ProrationDate = z.number().int().positive().optional();

export const getStudioQuote = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<StudioQuote> => {
    const { getStudioQuote: quote } = await import("@/lib/studio.server");
    return quote(context.userId);
  });

export const addStudioSite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        url: z.string().trim().min(3).max(2048),
        brandName: z.string().trim().min(1).max(120),
        description: z.string().trim().max(2000).default(""),
        logoUrl: z.string().max(200_000).nullable().default(null),
        prorationDate: ProrationDate,
      })
      .parse(d),
  )
  .handler(async ({ data, context }): Promise<{ siteId: string }> => {
    const { addStudioSite: add } = await import("@/lib/studio.server");
    return add(context.userId, data);
  });

export const restoreStudioSite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ siteId: SiteId, prorationDate: ProrationDate }).parse(d),
  )
  .handler(async ({ data, context }): Promise<{ siteId: string }> => {
    const { restoreStudioSite: restore } = await import("@/lib/studio.server");
    return restore(context.userId, data.siteId, data.prorationDate);
  });

export const removeStudioSite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ siteId: SiteId }).parse(d))
  .handler(async ({ data, context }): Promise<{ removesAt: string }> => {
    const { removeStudioSite: remove } = await import("@/lib/studio.server");
    return remove(context.userId, data.siteId);
  });

export const keepStudioSite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ siteId: SiteId }).parse(d))
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { keepStudioSite: keep } = await import("@/lib/studio.server");
    return keep(context.userId, data.siteId);
  });

export const activatePlanNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ status: string }> => {
    const { activatePlanNow: activate } = await import("@/lib/studio.server");
    return activate(context.userId);
  });
