import { queryOptions } from "@tanstack/react-query";
import { getDocPage, getDocsNav, getDocsSearchIndex } from "./docs.functions";

/* Docs change only with a deploy, so nothing here goes stale in a session. */

export const docsNavQuery = queryOptions({
  queryKey: ["docs", "nav"],
  queryFn: () => getDocsNav(),
  staleTime: Infinity,
});

export const docPageQuery = (section: string, page: string) =>
  queryOptions({
    queryKey: ["docs", "page", section, page],
    queryFn: () => getDocPage({ data: { section, page } }),
    staleTime: Infinity,
  });

export const docsSearchQuery = queryOptions({
  queryKey: ["docs", "search"],
  queryFn: () => getDocsSearchIndex(),
  staleTime: Infinity,
});
