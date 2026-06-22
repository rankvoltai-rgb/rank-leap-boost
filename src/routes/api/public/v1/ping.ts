import { createFileRoute } from "@tanstack/react-router";
import {
  API_CORS_HEADERS,
  corsPreflight,
  jsonResponse,
  unauthorized,
} from "@/lib/public-api.server";

// Lightweight key-validation endpoint. Plugins call this on setup to confirm
// the pasted Rankvolt API key works and to show the connected brand name.
export const Route = createFileRoute("/api/public/v1/ping")({
  server: {
    handlers: {
      OPTIONS: async () => corsPreflight(),
      GET: async ({ request }) => {
        try {
          const { resolveApiKeyUser } = await import("@/lib/api-keys.server");
          const userId = await resolveApiKeyUser(request);
          if (!userId) return unauthorized();

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("brand_name")
            .eq("user_id", userId)
            .maybeSingle();

          return jsonResponse({
            ok: true,
            service: "Rankvolt",
            brand_name: (profile?.brand_name as string) ?? null,
          });
        } catch (err) {
          console.error("v1/ping failed", err);
          return new Response(
            JSON.stringify({ error: "Internal error" }),
            { status: 500, headers: { "Content-Type": "application/json", ...API_CORS_HEADERS } },
          );
        }
      },
    },
  },
});