import { createFileRoute } from "@tanstack/react-router";

/**
 * The embedded app's first call: installs the store if this is its first open
 * (or a reinstall), then returns everything the page shows. Authenticated by
 * the App Bridge ID token alone; see src/lib/shopify/app.server.ts.
 */
export const Route = createFileRoute("/api/public/shopify/app")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { authenticate, errorResponse, json, loadApp } =
          await import("@/lib/shopify/app.server");
        const session = await authenticate(request);
        if (session instanceof Response) return session;
        try {
          return json(await loadApp(session));
        } catch (err) {
          return errorResponse(err, "load");
        }
      },
    },
  },
});
