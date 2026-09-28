/**
 * Turning a finished article into a Shopify blog post, the fields the
 * /integrations/shopify page lists: title, URL handle, content, excerpt and
 * search listing description, tags.
 */
import { contentHash, webflowSlug, withSuffix } from "@/lib/webflow/mapping";

export { contentHash, withSuffix };

export interface ArticleForShopify {
  id: string;
  title: string;
  description: string;
  body_html: string;
  tags: string[] | null;
}

/** Shopify handles follow the same rule as Webflow slugs: lowercase letters, digits, hyphens. */
export function shopifyHandle(title: string, fallbackId = ""): string {
  return webflowSlug(title, fallbackId);
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Shopify rejects tags over 255 characters. */
const MAX_TAG = 255;

function cleanTags(tags: string[] | null | undefined): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of tags ?? []) {
    const tag = raw.trim().slice(0, MAX_TAG);
    const key = tag.toLowerCase();
    if (tag && !seen.has(key)) {
      seen.add(key);
      out.push(tag);
    }
  }
  return out;
}

/**
 * What an update writes, and so what the content hash covers. The handle,
 * author, and visibility are set once, on create: the handle because changing
 * it breaks the live URL, and the other two because they're the merchant's to
 * change in Shopify afterwards.
 */
export function toUpdateInput(article: ArticleForShopify): Record<string, unknown> {
  const description = (article.description ?? "").trim();
  const input: Record<string, unknown> = {
    title: article.title.trim() || "Untitled",
    body: article.body_html ?? "",
    summary: description ? `<p>${escapeHtml(description)}</p>` : "",
    tags: cleanTags(article.tags),
  };
  if (description) {
    // The search listing description, which Shopify keeps as this metafield.
    input.metafields = [
      {
        namespace: "global",
        key: "description_tag",
        type: "single_line_text_field",
        value: description,
      },
    ];
  }
  return input;
}

export function toCreateInput(
  article: ArticleForShopify,
  opts: { blogId: string; handle: string; author: string; visible: boolean },
): Record<string, unknown> {
  return {
    ...toUpdateInput(article),
    blogId: opts.blogId,
    handle: opts.handle,
    author: { name: opts.author.trim() || "Rankbox" },
    isPublished: opts.visible,
  };
}

export function hashArticle(article: ArticleForShopify): string {
  return contentHash(toUpdateInput(article));
}

/** Shopify serves every blog post at /blogs/{blog handle}/{article handle}. */
export function composeLiveUrl(
  host: string | null | undefined,
  blogHandle: string | null | undefined,
  articleHandle: string,
): string | null {
  if (!host || !blogHandle || !articleHandle) return null;
  return `https://${host.replace(/\/+$/, "")}/blogs/${blogHandle}/${articleHandle}`;
}
