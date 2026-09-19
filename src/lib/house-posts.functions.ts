import { createServerFn } from "@tanstack/react-start";
import { getHousePost, listHousePosts } from "./house-posts.server";
import type { PostFull, PostMeta } from "./notion.server";

/** Repo-authored blog posts (metadata only). */
export const listRepoPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<PostMeta[]> => listHousePosts(),
);

/** One repo-authored post with its blocks, or null when no file has the slug. */
export const getRepoPost = createServerFn({ method: "GET" })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<PostFull | null> => getHousePost(data.slug));
