import { createFileRoute } from "@tanstack/react-router";

/**
 * POST: link this store to the Rankbox site a pasted API key belongs to.
 * DELETE: unlink it. Authenticated by the App Bridge ID token; the key only
 * says which Rankbox site, never which store.
 */
export const Route = createFileRoute("/api/public/shopify/link")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { authenticate, errorResponse, fail, json, linkSite } =
          await import("@/lib/shopify/app.server");
        const session = await authenticate(request);
        if (session instanceof Response) return session;
        // Keys are 24 random bytes, but pasting is still the one guessable door.
        const { rateLimitByIp } = await import("@/lib/rate-limit.server");
        const blocked = await rateLimitByIp(request);
        if (blocked) return blocked;
        const body = (await request.json().catch(() => null)) as { apiKey?: unknown } | null;
        if (typeof body?.apiKey !== "string" || !body.apiKey.trim()) {
          return fail("Paste your Rankbox API key.");
        }
        try {
          const result = await linkSite(session, body.apiKey.slice(0, 200));
          return result.ok ? json(result.state) : fail(result.error, result.status);
        } catch (err) {
          return errorResponse(err, "link");
        }
      },
      DELETE: async ({ request }) => {
        const { authenticate, errorResponse, json, unlinkSite } =
          await import("@/lib/shopify/app.server");
        const session = await authenticate(request);
        if (session instanceof Response) return session;
        try {
          return json(await unlinkSite(session));
        } catch (err) {
          return errorResponse(err, "unlink");
        }
      },
    },
  },
});
