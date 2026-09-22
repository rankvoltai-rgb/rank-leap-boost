import { createFileRoute } from "@tanstack/react-router";
import {
  API_CORS_HEADERS,
  corsPreflight,
  jsonResponse,
  subscriptionRequired,
  unauthorized,
} from "@/lib/public-api.server";

// Lightweight key-validation endpoint. Plugins call this on setup to confirm
// the pasted Rankbox API key works and to show the brand name of the site it
// connects — a key belongs to one site, not to the whole account.
export const Route = createFileRoute("/api/public/v1/ping")({
  server: {
    handlers: {
      OPTIONS: async () => corsPreflight(),
      GET: async ({ request }) => {
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
          const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("brand_name")
            .eq("id", siteId)
            .eq("user_id", userId)
            .maybeSingle();

          return jsonResponse({
            ok: true,
            service: "Rankbox",
            brand_name: (profile?.brand_name as string) ?? null,
          });
        } catch (err) {
          console.error("v1/ping failed", err);
          return new Response(JSON.stringify({ error: "Internal error" }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...API_CORS_HEADERS },
          });
        }
      },
    },
  },
});
