/**
 * Blog articles kept in the repo, in src/content/blog/<slug>.md.
 *
 * Each file is markdown with a frontmatter block:
 *
 *   ---
 *   title: How to Get Cited by ChatGPT: The 2026 Playbook
 *   description: Meta description and the article's dek, 120–160 characters.
 *   keyword: cited by ChatGPT
 *   date: 2026-09-18           (the day it goes live; see blog-release.ts)
 *   updated: 2026-09-18        (optional)
 *   written: 2026-09-18        (optional; set by the scheduler)
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
import { isLive, todayUTC, unlinkPosts } from "@/lib/blog-release";

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

/** Live posts only: a post dated after today is scheduled (see blog-release.ts). */
export function listHousePosts(today = todayUTC()): PostMeta[] {
  return housePosts()
    .filter((p) => isLive(p.date, today))
    .map(({ blocks: _blocks, ...meta }) => meta);
}

/** A live post, with its links to posts that are still scheduled made plain text. */
export function getHousePost(slug: string, today = todayUTC()): PostFull | null {
  const post = housePosts().find((p) => p.slug === slug);
  if (!post || !isLive(post.date, today)) return null;
  const scheduled = new Set(
    housePosts()
      .filter((p) => !isLive(p.date, today))
      .map((p) => p.slug),
  );
  return scheduled.size ? { ...post, blocks: unlinkPosts(post.blocks, scheduled) } : post;
}
