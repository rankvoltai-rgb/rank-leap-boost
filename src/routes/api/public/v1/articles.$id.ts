import { createFileRoute } from "@tanstack/react-router";
import {
  API_CORS_HEADERS,
  ARTICLE_COLUMNS,
  badRequest,
  corsPreflight,
  jsonResponse,
  serializeArticle,
  subscriptionRequired,
  unauthorized,
} from "@/lib/public-api.server";

// GET returns a single finished article of the key's site. PATCH lets the
// plugin report where it published that article, which is how the backlink
// exchange learns the page to verify hosted links on.
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
          const auth = await resolveApiKeyUser(request);
          if (!auth.ok) return auth.reason === "no-plan" ? subscriptionRequired() : unauthorized();
          const { userId, siteId } = auth;

          const userBlock = await rateLimitByUser(userId);
          if (userBlock) return userBlock;

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data, error } = await supabaseAdmin
            .from("blogs")
            .select(ARTICLE_COLUMNS)
            .eq("site_id", siteId)
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
      PATCH: async ({ request, params }) => {
        try {
          const { rateLimitByIp, rateLimitByUser } = await import("@/lib/rate-limit.server");
          const ipBlock = await rateLimitByIp(request);
          if (ipBlock) return ipBlock;

          const { resolveApiKeyUser } = await import("@/lib/api-keys.server");
          const auth = await resolveApiKeyUser(request);
          if (!auth.ok) return auth.reason === "no-plan" ? subscriptionRequired() : unauthorized();
          const { userId, siteId } = auth;

          const userBlock = await rateLimitByUser(userId);
          if (userBlock) return userBlock;

          const payload = (await request.json().catch(() => null)) as {
            published_url?: unknown;
          } | null;
          const publishedUrl =
            typeof payload?.published_url === "string" ? payload.published_url.trim() : "";
          if (!publishedUrl) return badRequest("Send { published_url } — the article's live URL.");

          const { assertSafeUrl, UnsafeUrlError } = await import("@/lib/safe-fetch.server");
          try {
            assertSafeUrl(publishedUrl);
          } catch (err) {
            if (err instanceof UnsafeUrlError)
              return badRequest("published_url is not a public http(s) URL.");
            throw err;
          }

          // The URL must be on the key's own site: a leaked key must not be
          // able to point an article — and the links verified on it — at
          // somebody else's page, nor at another site on the same account.
          // Either the site's exchange domain, once its ownership is proven
          // (a suspended site proved it too, and needs its pages verified to
          // heal), or the website the site itself is set up with.
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { isOnDomain, normalizeDomain } = await import("@/lib/exchange/domain");
          const [{ data: site }, { data: profile }] = await Promise.all([
            supabaseAdmin
              .from("exchange_sites")
              .select("domain")
              .eq("id", siteId)
              .eq("user_id", userId)
              .in("status", ["verified", "suspended"])
              .maybeSingle(),
            supabaseAdmin
              .from("profiles")
              .select("website_url")
              .eq("id", siteId)
              .eq("user_id", userId)
              .maybeSingle(),
          ]);
          const domains = [site?.domain ?? "", normalizeDomain(profile?.website_url ?? "")].filter(
            Boolean,
          );
          if (!domains.some((d) => isOnDomain(publishedUrl, d))) {
            return badRequest(
              `published_url must be on your own site (${domains.join(" or ") || "set your website in Settings"}).`,
            );
          }

          const { data, error } = await supabaseAdmin
            .from("blogs")
            .update({
              published_url: publishedUrl,
              published_url_source: "plugin",
              published_at: new Date().toISOString(),
            })
            .eq("site_id", siteId)
            .eq("user_id", userId)
            .eq("status", "finished")
            .eq("id", params.id)
            .select(ARTICLE_COLUMNS)
            .maybeSingle();

          if (error) throw new Error(error.message);
          if (!data) return jsonResponse({ error: "Article not found" }, 404);
          return jsonResponse({ article: serializeArticle(data as never) });
        } catch (err) {
          console.error("v1/articles/:id PATCH failed", err);
          return new Response(JSON.stringify({ error: "Internal error" }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...API_CORS_HEADERS },
          });
        }
      },
    },
  },
});
