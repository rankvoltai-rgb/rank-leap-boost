import type { ArticlesPage, PublishedArticle } from "@rankbox/api-client";

/** The API clamps `limit` to 100, so this is the largest useful page. */
export const PAGE_SIZE = 100;

/** 50 pages x 100 = 5,000 articles before we refuse to keep walking. */
export const MAX_PAGES = 50;

export interface WalkResult {
  articles: PublishedArticle[];
  /** True when the walk reached the end of the list. Deletes need this. */
  complete: boolean;
  /** Set when `complete` is false. */
  reason?: "no-progress" | "max-pages";
  /** The cursor to resume from, i.e. the last page's `next_since`. */
  cursor: string | null;
}

export interface ArticleFetcher {
  listArticles(
    options: { since?: string | null; limit?: number },
    signal?: AbortSignal,
  ): Promise<ArticlesPage>;
}

/**
 * Walk the article list from `since` to the end.
 *
 * The server orders by `updated_at` ascending and filters with `gt(since)`, so
 * `next_since` (the last item's `updated_at`) is a valid cursor. There is one
 * real edge: if more than a full page of articles share an identical
 * `updated_at`, the cursor can't advance past them and the rest of that
 * timestamp would be skipped. Rather than silently lose articles we detect the
 * stall and report it — fixing it properly needs an `after_id` tiebreaker on
 * the API side.
 */
export async function walkArticles(
  client: ArticleFetcher,
  since: string | null,
  options: { signal?: AbortSignal; onPage?: (total: number) => void } = {},
): Promise<WalkResult> {
  const articles: PublishedArticle[] = [];
  let cursor = since;

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const result = await client.listArticles({ since: cursor, limit: PAGE_SIZE }, options.signal);
    articles.push(...result.articles);
    options.onPage?.(articles.length);

    // A short page means we reached the end of the list.
    if (result.count < PAGE_SIZE) return { articles, complete: true, cursor: result.next_since };

    const next = result.next_since ?? null;
    if (!next || next === cursor) {
      return { articles, complete: false, reason: "no-progress", cursor };
    }
    cursor = next;
  }

  return { articles, complete: false, reason: "max-pages", cursor };
}
