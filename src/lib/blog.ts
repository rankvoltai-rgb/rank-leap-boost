/**
 * Blog posts for /blog and /blog/$slug.
 *
 * Two sources, merged newest first:
 *   - articles in the repo (src/content/blog), in every mode;
 *   - Notion through the server functions, or in mock mode
 *     (VITE_MOCK_DATA=1) the fixtures in src/lib/mock/blog.ts.
 * A repo article wins when both have the same slug.
 */
import { queryOptions } from "@tanstack/react-query";
import { IS_MOCK } from "@/lib/mock/mode";
import * as mock from "@/lib/mock/blog";
import * as real from "@/lib/notion.functions";
import { getRepoPost, listRepoPosts } from "@/lib/house-posts.functions";
import type { PostFull, PostMeta } from "@/lib/notion.server";

export async function listPosts(): Promise<{ posts: PostMeta[]; error: boolean }> {
  const [external, repo] = await Promise.all([
    IS_MOCK ? mock.listPosts() : real.listPosts(),
    listRepoPosts().catch((err) => {
      console.error("listRepoPosts failed", err);
      return [] as PostMeta[];
    }),
  ]);
  const repoSlugs = new Set(repo.map((p) => p.slug));
  const posts = [...repo, ...external.posts.filter((p) => !repoSlugs.has(p.slug))].sort((a, b) =>
    (b.date ?? "").localeCompare(a.date ?? ""),
  );
  // One source failing isn't an error while the other still has posts to show.
  return { posts, error: external.error && posts.length === 0 };
}

export async function getPost(slug: string): Promise<{ post: PostFull | null; error: boolean }> {
  const repo = await getRepoPost({ data: { slug } }).catch(() => null);
  if (repo) return { post: repo, error: false };
  return IS_MOCK ? mock.getPost(slug) : real.getPost({ data: { slug } });
}

/** Every post's metadata, shared by the index and the article page's "Keep reading". */
export const postsQuery = queryOptions({
  queryKey: ["blog", "posts"],
  queryFn: () => listPosts(),
});

/** Up to `limit` other posts, those sharing the most topics first, then newest. */
export function relatedPosts(post: PostMeta, posts: PostMeta[], limit = 3): PostMeta[] {
  const topics = new Set(post.tags);
  return posts
    .filter((p) => p.slug !== post.slug)
    .map((p, i) => ({ p, i, shared: p.tags.filter((t) => topics.has(t)).length }))
    .sort((a, b) => b.shared - a.shared || a.i - b.i)
    .slice(0, limit)
    .map(({ p }) => p);
}
