/**
 * Blog articles kept in the repo, in src/content/blog/<slug>.md.
 *
 * Each file is markdown with a frontmatter block:
 *
 *   ---
 *   title: How to Get Cited by ChatGPT: The 2026 Playbook
 *   description: Meta description and the article's dek, 120–160 characters.
 *   keyword: cited by ChatGPT
 *   date: 2026-09-18
 *   updated: 2026-09-18        (optional)
 *   author: Rankbox Team      (optional)
 *   tags: AI Search, Playbooks
 *   cover: https://…           (optional; a generated cover is drawn otherwise)
 *   featured: true             (optional; pins it as the blog's lead story)
 *   draft: true                (optional; keeps it off the site)
 *   ---
 *
 * The file name is the slug. These sit alongside the Notion posts and win on a
 * slug clash. Server-only so article bodies never ship in the client bundle.
 */
import type { PostFull, PostMeta } from "@/lib/notion.server";
import { markdownToBlocks, parseFrontmatter } from "@/lib/markdown-blocks";
import { countWords, readingMinutes } from "@/lib/article-outline";

const FILES = import.meta.glob<string>("/src/content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

function parse(path: string, raw: string): PostFull | null {
  const slug = path.split("/").pop()!.replace(/\.md$/, "");
  const { data, body } = parseFrontmatter(raw);
  if (data.draft === "true" || !data.title) return null;
  const blocks = markdownToBlocks(body, slug);
  return {
    id: `house-${slug}`,
    slug,
    title: data.title,
    excerpt: data.description ?? "",
    date: data.date || null,
    updated: data.updated && data.updated !== data.date ? data.updated : null,
    cover: data.cover || null,
    tags: (data.tags ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    author: data.author || "Rankbox Team",
    featured: data.featured === "true",
    readingMinutes: readingMinutes(countWords(blocks)),
    blocks,
  };
}

let cache: PostFull[] | null = null;

function housePosts(): PostFull[] {
  cache ??= Object.entries(FILES)
    .map(([path, raw]) => parse(path, raw))
    .filter((p): p is PostFull => p !== null)
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  return cache;
}

export function listHousePosts(): PostMeta[] {
  return housePosts().map(({ blocks: _blocks, ...meta }) => meta);
}

export function getHousePost(slug: string): PostFull | null {
  return housePosts().find((p) => p.slug === slug) ?? null;
}
