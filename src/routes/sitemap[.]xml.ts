import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { FEATURE_SLUGS } from "@/data/features";
import { TOOL_SLUGS } from "@/data/tools";

const BASE_URL = "https://rankvolt.top";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        let blogPosts: { path: string; lastmod?: string }[] = [];
        try {
          const posts = await listPublishedPosts();
          blogPosts = posts.map((p) => ({
            path: `/blog/${p.slug}`,
            lastmod: p.date ?? undefined,
          }));
        } catch {
          blogPosts = [];
        }

        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/features", changefreq: "weekly", priority: "0.8" },
          ...FEATURE_SLUGS.map((slug) => ({
            path: `/features/${slug}`,
            changefreq: "monthly" as const,
            priority: "0.7",
          })),
          { path: "/tools", changefreq: "weekly", priority: "0.8" },
          ...TOOL_SLUGS.map((slug) => ({
            path: `/tools/${slug}`,
            changefreq: "monthly" as const,
            priority: "0.7",
          })),
          { path: "/blog", changefreq: "weekly", priority: "0.8" },
          ...blogPosts.map((p) => ({
            path: p.path,
            lastmod: p.lastmod,
            changefreq: "monthly" as const,
            priority: "0.7",
          })),
          ...[
            "/legal/privacy",
            "/legal/terms",
            "/legal/refunds",
            "/legal/cookies",
            "/legal/acceptable-use",
            "/legal/dpa",
            "/trust",
          ].map((path) => ({
            path,
            changefreq: "yearly" as const,
            priority: "0.3",
          })),
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});