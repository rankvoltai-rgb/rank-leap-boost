import { createServerFn } from "@tanstack/react-start";
import {
  listPublishedPosts,
  getPostBySlug,
  type PostMeta,
  type PostFull,
} from "./notion.server";

/** Public list of published blog posts (metadata only). */
export const listPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ posts: PostMeta[]; error: boolean }> => {
    try {
      const posts = await listPublishedPosts();
      return { posts, error: false };
    } catch (err) {
      console.error("listPosts failed", err);
      return { posts: [], error: true };
    }
  },
);

/** A single published post by slug, with its rendered block tree. */
export const getPost = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<{ post: PostFull | null; error: boolean }> => {
    try {
      const post = await getPostBySlug(data.slug);
      return { post, error: false };
    } catch (err) {
      console.error("getPost failed", err);
      return { post: null, error: true };
    }
  });
