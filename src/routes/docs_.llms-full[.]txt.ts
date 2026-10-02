import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

/** /docs/llms-full.txt: every docs page as markdown, in one file. */
export const Route = createFileRoute("/docs_/llms-full.txt")({
  server: {
    handlers: {
      GET: async () => {
        const { docsLlmsFullTxt } = await import("@/lib/docs/content.server");
        return new Response(docsLlmsFullTxt(), {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
