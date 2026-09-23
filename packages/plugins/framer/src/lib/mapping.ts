import type { PublishedArticle } from "@rankbox/api-client";
import { fnv1a } from "./hash";
import { BODY_SOURCE, FIELD_IDS } from "./fields";
import type { CollectionItemLike, ContentType, FieldDataEntry } from "./types";

/** Framer has no string-array field, so tags land as a readable joined string. */
export function formatTags(tags: string[] | null | undefined): string {
  if (!tags || tags.length === 0) return "";
  return tags
    .map((t) => t.trim())
    .filter(Boolean)
    .join(", ");
}

function body(article: PublishedArticle): { value: string; contentType: ContentType } {
  return BODY_SOURCE === "markdown"
    ? { value: article.body_markdown ?? "", contentType: "markdown" }
    : { value: article.body_html ?? "", contentType: "html" };
}

/**
 * A fingerprint of exactly what we write into the CMS.
 *
 * Deliberately excludes `updated_at` and `published_url`. A BEFORE UPDATE
 * trigger on `blogs` bumps `updated_at` on every write, so reporting a live URL
 * back to Rankbox makes an otherwise untouched article look changed. Hashing
 * only the written content means a write-back causes zero redundant CMS writes
 * on the next sync.
 */
export function contentHash(article: PublishedArticle): string {
  const { value } = body(article);
  return fnv1a(
    [
      article.title ?? "",
      article.description ?? "",
      value,
      formatTags(article.tags),
      String(article.seo_score ?? 0),
      article.published_at ?? "",
    ].join("\u0000"),
  );
}

/** Map an article onto a Framer CMS item. `slug` is resolved by the caller. */
export function toCollectionItem(
  article: PublishedArticle,
  slug: string,
  liveUrl: string | null,
): CollectionItemLike {
  const content = body(article);
  const fieldData: Record<string, FieldDataEntry> = {
    [FIELD_IDS.title]: { type: "string", value: article.title ?? "" },
    [FIELD_IDS.description]: { type: "string", value: article.description ?? "" },
    [FIELD_IDS.content]: {
      type: "formattedText",
      value: content.value,
      contentType: content.contentType,
    },
    [FIELD_IDS.tags]: { type: "string", value: formatTags(article.tags) },
    [FIELD_IDS.seoScore]: { type: "number", value: article.seo_score ?? 0 },
    [FIELD_IDS.publishedAt]: { type: "date", value: article.published_at ?? "" },
    [FIELD_IDS.liveUrl]: { type: "link", value: liveUrl ?? article.published_url ?? "" },
  };
  return { id: article.id, slug, fieldData };
}
