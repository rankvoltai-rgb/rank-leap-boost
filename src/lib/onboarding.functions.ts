/**
 * Server functions behind onboarding's website scan.
 *
 * Authenticated and rate-limited: each call triggers an outbound scrape (with
 * Firecrawl configured, a metered one) and an AI call, so neither may be an open
 * endpoint.
 *
 * Mock mode is the exception, and only under the local dev server: it has no
 * Supabase session to send (start.ts attaches no token), yet the scan should
 * still read the real site. `import.meta.env.DEV` is false in every build —
 * including `vite build --mode development` — so a deployed bundle always
 * requires a real session, whatever VITE_MOCK_DATA says.
 */
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { IS_MOCK } from "@/lib/mock/mode";
import { assertAiRateLimit } from "@/lib/rate-limit.server";
import type { PlannedArticle, SiteAnalysis, SiteMeta } from "@/lib/site-meta";

const localMockUser = createMiddleware({ type: "function" }).server(({ next }) =>
  next({ context: { userId: "local-mock-user" } }),
);

const requireUser = import.meta.env.DEV && IS_MOCK ? localMockUser : requireSupabaseAuth;

const Url = z.string().trim().min(3).max(2048);

/** Part 1 prefill: brand name, what they do, logo. */
export const scanBrand = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .inputValidator((d: unknown) => z.object({ url: Url }).parse(d))
  .handler(async ({ data, context }): Promise<SiteMeta> => {
    await assertAiRateLimit(context.userId);
    const { readBrand } = await import("@/lib/onboarding-scan.server");
    return readBrand(data.url);
  });

/** Part 2: keywords and the brand context around them. */
export const analyzeSite = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .inputValidator((d: unknown) =>
    z
      .object({
        url: Url,
        brandName: z.string().trim().max(200).default(""),
        description: z.string().trim().max(2000).default(""),
      })
      .parse(d),
  )
  .handler(async ({ data, context }): Promise<SiteAnalysis> => {
    await assertAiRateLimit(context.userId);
    const { analyzeBrand } = await import("@/lib/onboarding-scan.server");
    return analyzeBrand(data);
  });

const Text = (max: number) => z.string().trim().max(max).default("");
const TextList = z.array(z.string().trim().max(300)).max(20).default([]);

/** Part 3: content-gap articles from the confirmed keywords. */
export const planArticles = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .inputValidator((d: unknown) =>
    z
      .object({
        url: Url,
        brandName: Text(200),
        description: Text(2000),
        niche: Text(300),
        audience: Text(600),
        geo: Text(300),
        competitors: TextList,
        semanticClusters: TextList,
        missingOpportunities: TextList,
        keywords: z
          .array(
            z.object({
              name: z.string().trim().min(1).max(200),
              search_volume: z.number().int().min(0).max(100_000_000),
              intent: Text(40),
            }),
          )
          .min(1)
          .max(100),
      })
      .parse(d),
  )
  .handler(async ({ data, context }): Promise<PlannedArticle[]> => {
    await assertAiRateLimit(context.userId);
    const { planContent } = await import("@/lib/onboarding-scan.server");
    return planContent(data);
  });
