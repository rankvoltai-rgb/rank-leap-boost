import { createFileRoute } from "@tanstack/react-router";

/**
 * Shopify webhooks: https://rankbox.xyz/api/public/shopify/webhooks, declared
 * in packages/plugins/shopify/shopify.app.toml.
 *
 * - app/uninstalled: delete the store's tokens at once. The row and its ledger
 *   stay, so a reinstall picks up where it left off without duplicating posts.
 * - app/scopes_update: record what the store granted.
 * - customers/data_request, customers/redact: Rankbox stores no customer data
 *   from Shopify (the app only writes blog posts), so there's nothing to
 *   return or erase. Acknowledged.
 * - shop/redact (48 hours after uninstall): delete everything about the store.
 *
 * Every request must carry a valid HMAC of the raw body, or it gets a 401:
 * the App Store's automated review checks for exactly that.
 */
export const Route = createFileRoute("/api/public/shopify/webhooks")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { shopifyConfig } = await import("@/lib/shopify/api.server");
        const { verifyWebhook, normalizeShop } = await import("@/lib/shopify/verify");

        let secret: string;
        try {
          secret = shopifyConfig().apiSecret;
        } catch {
          return new Response("Not configured", { status: 503 });
        }
        const raw = await request.arrayBuffer();
        if (!(await verifyWebhook(raw, request.headers.get("x-shopify-hmac-sha256"), secret))) {
          return new Response("Unauthorized", { status: 401 });
        }

        const topic = (request.headers.get("x-shopify-topic") ?? "").toLowerCase();
        const shop = normalizeShop(request.headers.get("x-shopify-shop-domain"));
        if (!shop) return new Response("OK", { status: 200 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        try {
          if (topic === "app/uninstalled") {
            await supabaseAdmin
              .from("shopify_connections")
              .update({
                access_token_enc: null,
                access_expires_at: null,
                refresh_token_enc: null,
                refresh_expires_at: null,
                status: "uninstalled",
                uninstalled_at: new Date().toISOString(),
                last_error: null,
              })
              .eq("shop", shop);
          } else if (topic === "app/scopes_update") {
            const body = JSON.parse(new TextDecoder().decode(raw)) as { current?: unknown };
            if (Array.isArray(body.current)) {
              await supabaseAdmin
                .from("shopify_connections")
                .update({ scope: body.current.map(String).join(",") })
                .eq("shop", shop);
            }
          } else if (topic === "shop/redact") {
            // The ledger goes with it (ON DELETE CASCADE).
            await supabaseAdmin.from("shopify_connections").delete().eq("shop", shop);
          }
          // customers/data_request and customers/redact: nothing stored, nothing to do.
        } catch (err) {
          console.error("shopify webhook failed", { topic, message: String(err) });
          // A 5xx makes Shopify retry, which is what we want for a failed write.
          return new Response("Error", { status: 500 });
        }
        return new Response("OK", { status: 200 });
      },
    },
  },
});
