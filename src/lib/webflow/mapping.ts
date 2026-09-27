/**
 * Turning a finished article into a Webflow CMS item.
 */
import { ROLE_KEYS, type FieldMap } from "./fields";

/** The subset of a serialized article (see public-api.server.ts) that lands in Webflow. */
export interface ArticleForWebflow {
  id: string;
  title: string;
  slug: string;
  description: string;
  body_html: string;
  tags: string[];
  published_at: string;
}

const MAX_SLUG_LENGTH = 100;

/** Webflow slugs: lowercase letters, digits and hyphens. */
export function webflowSlug(raw: string, fallbackId = ""): string {
  const cleaned = raw
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/-+$/, "");
  if (cleaned) return cleaned;
  return fallbackId ? `article-${fallbackId.slice(0, 8).toLowerCase()}` : "article";
}

/** Append `-2`, `-3`… for a slug that is already taken in the collection. */
export function withSuffix(slug: string, n: number): string {
  const suffix = `-${n}`;
  return `${slug.slice(0, MAX_SLUG_LENGTH - suffix.length).replace(/-+$/, "")}${suffix}`;
}

export function formatTags(tags: string[] | null | undefined): string {
  return (tags ?? [])
    .map((t) => t.trim())
    .filter(Boolean)
    .join(", ");
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * The `fieldData` for one item. `slug` is resolved by the caller: an item keeps
 * the slug it was created with, because renaming it would break its live URL.
 */
export function toFieldData(
  article: ArticleForWebflow,
  map: FieldMap,
  slug: string,
  richTextSummary = false,
): Record<string, unknown> {
  const data: Record<string, unknown> = { name: article.title.trim() || "Untitled", slug };
  const values: Record<(typeof ROLE_KEYS)[number], unknown> = {
    body: article.body_html ?? "",
    summary: richTextSummary
      ? article.description
        ? `<p>${escapeHtml(article.description)}</p>`
        : ""
      : (article.description ?? ""),
    tags: formatTags(article.tags),
    publishedAt: article.published_at || null,
  };
  for (const role of ROLE_KEYS) {
    const field = map[role];
    if (field) data[field] = values[role];
  }
  return data;
}

/** FNV-1a over exactly what is written, so unrelated row updates never trigger a rewrite. */
export function contentHash(fieldData: Record<string, unknown>): string {
  const text = Object.keys(fieldData)
    .sort()
    .map((k) => `${k}\u0001${JSON.stringify(fieldData[k] ?? null)}`)
    .join("\u0000");
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}
