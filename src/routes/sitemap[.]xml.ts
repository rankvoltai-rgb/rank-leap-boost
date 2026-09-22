import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { FEATURE_SLUGS } from "@/data/features";
import { TOOL_SLUGS } from "@/data/tools";
import { COMPETITOR_SLUGS } from "@/data/alternatives";
import { PERSONA_SLUGS } from "@/data/personas";
import { ENGINES } from "@/data/ai-seo/engines";
import { GLOSSARY_UPDATED, TERMS } from "@/data/glossary/terms";

const BASE_URL = "https://rankbox.xyz";

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
        // Repo articles (src/content/blog) first: they win a slug clash with Notion.
        const { listHousePosts } = await import("@/lib/house-posts.server");
        const blogPosts: { path: string; lastmod?: string }[] = listHousePosts().map((p) => ({
          path: `/blog/${p.slug}`,
          lastmod: p.updated ?? p.date ?? undefined,
        }));
        try {
          const { listPublishedPosts } = await import("@/lib/notion.server");
          const seen = new Set(blogPosts.map((p) => p.path));
          for (const p of await listPublishedPosts()) {
            const path = `/blog/${p.slug}`;
            if (!seen.has(path)) blogPosts.push({ path, lastmod: p.date ?? undefined });
          }
        } catch {
          // Notion unavailable: the sitemap still lists the repo articles.
        }

        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/pricing", changefreq: "monthly", priority: "0.9" },
          { path: "/features", changefreq: "weekly", priority: "0.8" },
          ...FEATURE_SLUGS.map((slug) => ({
            path: `/features/${slug}`,
            changefreq: "monthly" as const,
            priority: "0.7",
          })),
          { path: "/use-cases", changefreq: "monthly", priority: "0.8" },
          ...PERSONA_SLUGS.map((slug) => ({
            path: `/use-cases/${slug}`,
            changefreq: "monthly" as const,
            priority: "0.8",
          })),
          { path: "/alternatives", changefreq: "monthly", priority: "0.8" },
          ...COMPETITOR_SLUGS.map((slug) => ({
            path: `/alternatives/${slug}`,
            changefreq: "monthly" as const,
            priority: "0.7",
          })),
          {
            path: "/ai-seo",
            lastmod: ENGINES.map((e) => e.updated)
              .sort()
              .at(-1),
            changefreq: "monthly",
            priority: "0.8",
          },
          ...ENGINES.map((e) => ({
            path: `/ai-seo/${e.slug}`,
            lastmod: e.updated,
            changefreq: "monthly" as const,
            priority: "0.8",
          })),
          { path: "/glossary", lastmod: GLOSSARY_UPDATED, changefreq: "weekly", priority: "0.8" },
          ...TERMS.map((t) => ({
            path: `/glossary/${t.slug}`,
            lastmod: t.updated,
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
