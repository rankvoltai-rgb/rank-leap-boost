/**
 * Server function behind mock mode's article generation.
 *
 * Mock mode keeps its blogs in the browser, so it has no server row to write
 * and no Supabase session to send — but the article itself should be the real
 * thing. This runs the same writer the live paths use and hands the content
 * back for the local store to save.
 *
 * Deliberately limited to the local dev server. In any build, article
 * generation has to go through generateBlogContent in ai.functions.ts, which
 * checks the trial and spends a credit; this endpoint does neither, so it must
 * never be reachable in production.
 */
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { IS_MOCK } from "@/lib/mock/mode";
import { assertAiRateLimit } from "@/lib/rate-limit.server";
import type { ArticleContent } from "@/lib/article.server";

/** True only under `npm run dev` with VITE_MOCK_DATA=1; false in every build. */
const LOCAL_MOCK = import.meta.env.DEV && IS_MOCK;

const localMockUser = createMiddleware({ type: "function" }).server(({ next }) =>
  next({ context: { userId: "local-mock-user" } }),
);

const requireUser = LOCAL_MOCK ? localMockUser : requireSupabaseAuth;

export const writeArticleDraft = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .inputValidator((d: unknown) =>
    z
      .object({
        title: z.string().trim().min(1).max(200),
        keyword: z.string().trim().max(200).default(""),
        description: z.string().trim().max(2000).default(""),
        wordCount: z.number().int().min(800).max(6000).optional(),
        /** Brand voice and product context, which mock mode holds client-side. */
        style: z.string().trim().max(4000).default(""),
      })
      .parse(d),
  )
  .handler(async ({ data, context }): Promise<ArticleContent> => {
    if (!LOCAL_MOCK) {
      throw new Error("Article generation goes through generateBlogContent outside mock mode.");
    }
    await assertAiRateLimit(context.userId);
    const { writeArticle } = await import("@/lib/article.server");
    return writeArticle(
      {
        title: data.title,
        keyword: data.keyword || undefined,
        description: data.description || undefined,
        wordCount: data.wordCount,
      },
      data.style,
    );
  });
