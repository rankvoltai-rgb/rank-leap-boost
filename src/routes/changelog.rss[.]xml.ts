import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { buildChangelogFeed } from "@/lib/changelog-feed";

export const Route = createFileRoute("/changelog/rss.xml")({
  server: {
    handlers: {
      GET: async () =>
        new Response(buildChangelogFeed(), {
          headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        }),
    },
  },
});
