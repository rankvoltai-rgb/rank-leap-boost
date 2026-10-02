import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

/**
 * /docs/llms.txt: every docs page with a one-line description, linking to its
 * markdown copy. Agents start here; see src/lib/docs/content.server.ts.
 */
export const Route = createFileRoute("/docs_/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        const { docsLlmsTxt } = await import("@/lib/docs/content.server");
        return new Response(docsLlmsTxt(), {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
