import { createFileRoute } from "@tanstack/react-router";

/**
 * The Shopify app's App URL: https://rankbox.xyz/shopify. Shopify loads it in
 * an iframe inside the store's admin, with ?shop=…&host=…&embedded=1.
 *
 * Framing is allowed for that store's admin only (the CSP Shopify requires of
 * embedded apps). Opened outside the admin with a store named, it bounces into
 * that store's admin; with no store, it explains where to open it.
 */
export const Route = createFileRoute("/shopify")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { normalizeShop } = await import("@/lib/shopify/verify");
        const { embeddedAppHtml, outsideAdminHtml } = await import("@/lib/shopify/page");
        const params = new URL(request.url).searchParams;
        const shop = normalizeShop(params.get("shop"));
        const apiKey = process.env.SHOPIFY_API_KEY?.trim();

        const headers = (frameAncestors: string) => ({
          "Content-Type": "text/html; charset=utf-8",
          "Content-Security-Policy": `frame-ancestors ${frameAncestors};`,
          "Cache-Control": "no-store",
          "X-Robots-Tag": "noindex",
        });

        if (!apiKey) {
          return new Response(outsideAdminHtml("The Shopify app isn't switched on yet."), {
            status: 503,
            headers: headers("'none'"),
          });
        }
        if (!shop) {
          return new Response(
            outsideAdminHtml(
              "Open Rankbox from your Shopify admin: Apps, then Rankbox. This page only works inside Shopify.",
            ),
            { status: 200, headers: headers("'none'") },
          );
        }
        if (params.get("embedded") !== "1") {
          // Straight into the app inside that store's admin.
          return new Response(null, {
            status: 302,
            headers: {
              Location: `https://${shop}/admin/apps/${apiKey}`,
              "Cache-Control": "no-store",
            },
          });
        }
        return new Response(embeddedAppHtml(apiKey), {
          status: 200,
          headers: headers(`https://${shop} https://admin.shopify.com`),
        });
      },
    },
  },
});
