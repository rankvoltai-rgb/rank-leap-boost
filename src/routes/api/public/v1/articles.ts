import { createFileRoute } from "@tanstack/react-router";
import {
  API_CORS_HEADERS,
  corsPreflight,
  jsonResponse,
  serializeArticle,
  unauthorized,
} from "@/lib/public-api.server";

// Lists the authenticated user's finished (publishable) articles. Plugins poll
// this with ?since=<iso> to fetch only what changed since their last sync.
export const Route = createFileRoute("/api/public/v1/articles")({
  server: {
    handlers: {
      OPTIONS: async () => corsPreflight(),
      GET: async ({ request }) => {
        try {
          const { rateLimitByIp, rateLimitByUser } = await import("@/lib/rate-limit.server");
          const ipBlock = await rateLimitByIp(request);
          if (ipBlock) return ipBlock;

          const { resolveApiKeyUser } = await import("@/lib/api-keys.server");
          const userId = await resolveApiKeyUser(request);
          if (!userId) return unauthorized();

          const userBlock = await rateLimitByUser(userId);
          if (userBlock) return userBlock;

          const url = new URL(request.url);
          const since = url.searchParams.get("since");
          const limitRaw = Number(url.searchParams.get("limit"));
          const limit = Number.isFinite(limitRaw)
            ? Math.min(Math.max(Math.trunc(limitRaw), 1), 100)
            : 50;

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          let query = supabaseAdmin
            .from("blogs")
            .select("id, title, description, body, tags, seo_score, created_at, updated_at")
            .eq("user_id", userId)
            .eq("status", "finished")
            .order("updated_at", { ascending: true })
            .limit(limit);

          if (since) {
            const ts = new Date(since);
            if (!Number.isNaN(ts.getTime())) {
              query = query.gt("updated_at", ts.toISOString());
            }
          }

          const { data, error } = await query;
          if (error) throw new Error(error.message);

          const rows = data ?? [];
          const articles = rows.map((r) => serializeArticle(r as never));
          return jsonResponse({
            articles,
            count: articles.length,
            // Cursor to pass back as ?since= on the next poll.
            next_since: articles.length
              ? articles[articles.length - 1].updated_at
              : (since ?? null),
          });
        } catch (err) {
          console.error("v1/articles failed", err);
          return new Response(JSON.stringify({ error: "Internal error" }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...API_CORS_HEADERS },
          });
        }
      },
    },
  },
});
