import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * The editor now opens as a slide-over on Articles. This path stays so old
 * links and bookmarks land on the same article there.
 */
export const Route = createFileRoute("/_authenticated/dashboard/editor/$blogId")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/dashboard/blog-engine",
      search: { article: params.blogId },
      replace: true,
    });
  },
});
