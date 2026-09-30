import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import LLMS_TXT from "@/content/llms.txt?raw";
import { liveLlmsTxt } from "@/lib/llms-txt";

/**
 * /llms.txt, from src/content/llms.txt. It's served from here rather than
 * public/ so each blog post's line appears the day the post goes live.
 */
export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () =>
        new Response(liveLlmsTxt(LLMS_TXT), {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        }),
    },
  },
});
