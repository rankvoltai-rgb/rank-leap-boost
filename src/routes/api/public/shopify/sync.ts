import { createFileRoute } from "@tanstack/react-router";

/**
 * Publish what isn't in the blog yet. Runs for up to ~40s; the page calls
 * again while `remaining` > 0.
 */
export const Route = createFileRoute("/api/public/shopify/sync")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { authenticate, errorResponse, json, syncNow } =
          await import("@/lib/shopify/app.server");
        const session = await authenticate(request);
        if (session instanceof Response) return session;
        try {
          return json(await syncNow(session));
        } catch (err) {
          return errorResponse(err, "sync");
        }
      },
    },
  },
});
