import { createFileRoute } from "@tanstack/react-router";
import {
  API_CORS_HEADERS,
  corsPreflight,
  jsonResponse,
  serializeArticle,
  unauthorized,
} from "@/lib/public-api.server";

// Returns a single finished article owned by the authenticated key holder.
export const Route = createFileRoute("/api/public/v1/articles/$id")({
  server: {
    handlers: {
      OPTIONS: async () => corsPreflight(),
      GET: async ({ request, params }) => {
        try {
          const { rateLimitByIp, rateLimitByUser } = await import("@/lib/rate-limit.server");
          const ipBlock = await rateLimitByIp(request);
          if (ipBlock) return ipBlock;

          const { resolveApiKeyUser } = await import("@/lib/api-keys.server");
          const userId = await resolveApiKeyUser(request);
          if (!userId) return unauthorized();

          const userBlock = await rateLimitByUser(userId);
          if (userBlock) return userBlock;

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data, error } = await supabaseAdmin
            .from("blogs")
            .select("id, title, description, body, tags, seo_score, created_at, updated_at")
            .eq("user_id", userId)
            .eq("status", "finished")
            .eq("id", params.id)
            .maybeSingle();

          if (error) throw new Error(error.message);
          if (!data) return jsonResponse({ error: "Article not found" }, 404);

          return jsonResponse({ article: serializeArticle(data as never) });
        } catch (err) {
          console.error("v1/articles/:id failed", err);
          return new Response(JSON.stringify({ error: "Internal error" }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...API_CORS_HEADERS },
          });
        }
      },
    },
  },
});
