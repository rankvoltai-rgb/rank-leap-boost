import type { PublishedArticle } from "@rankbox/api-client";
import { composeLiveUrl } from "./live-url";
import type { Ledger } from "./ledger";

/**
 * Structured data for the published Framer site.
 *
 * Framer serves server-rendered HTML, so anything written into `headEnd` is in
 * the raw source and readable by crawlers that never execute JavaScript —
 * which is most AI crawlers. But Framer allows one custom-code block per
 * location, site-wide, and cannot inject unique code into CMS collection
 * pages. A per-page Article block would therefore have to be written by
 * JavaScript at runtime, putting it out of reach of exactly the crawlers this
 * is for.
 *
 * So: one static site-wide @graph carrying a node per article, each with its
 * own `url` and `mainEntityOfPage`. Valid, in the source, and it gives Framer
 * blogs article-level structured data they otherwise can't have. It is not
 * per-page-scoped markup, and the README says so.
 */

/** Keeps the injected block to a sensible size on large sites. */
export const DEFAULT_ARTICLE_LIMIT = 50;

export const CUSTOM_CODE_LOCATION = "headEnd" as const;

const START_MARKER = "<!-- Rankbox structured data -->";
const END_MARKER = "<!-- /Rankbox structured data -->";

export interface SeoGraphOptions {
  productionUrl: string;
  blogPath: string;
  brandName: string | null;
  logoUrl?: string | null;
  articles: PublishedArticle[];
  ledger: Ledger;
  limit?: number;
}

type JsonLdNode = Record<string, unknown>;

/**
 * Escape a JSON-LD payload for safe embedding in an HTML <script> block.
 * `</script>` inside a string would otherwise close the tag early, and HTML
 * comment openers can terminate the script in legacy parsing.
 */
export function escapeJsonLd(json: string): string {
  return json
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function buildSeoGraph(options: SeoGraphOptions): JsonLdNode | null {
  const { productionUrl, blogPath, brandName, logoUrl, articles, ledger } = options;
  const limit = options.limit ?? DEFAULT_ARTICLE_LIMIT;

  let origin: string;
  try {
    origin = new URL(productionUrl).origin;
  } catch {
    return null;
  }

  const orgId = `${origin}/#organization`;
  const siteId = `${origin}/#website`;
  const blogUrl = composeLiveUrl(origin, blogPath, "") ?? `${origin}${blogPath}`;
  const blogId = `${blogUrl.replace(/\/+$/, "")}#blog`;
  const name = brandName?.trim() || new URL(origin).hostname;

  const organization: JsonLdNode = {
    "@type": "Organization",
    "@id": orgId,
    name,
    url: origin,
  };
  if (logoUrl) organization.logo = { "@type": "ImageObject", url: logoUrl };

  // Newest first, so a capped graph keeps the most relevant articles.
  const ordered = [...articles].sort((a, b) =>
    (b.published_at ?? "").localeCompare(a.published_at ?? ""),
  );

  const posts: JsonLdNode[] = [];
  for (const article of ordered.slice(0, limit)) {
    const slug = ledger.items[article.id]?.slug ?? article.slug;
    const url = composeLiveUrl(origin, blogPath, slug);
    if (!url) continue;
    const node: JsonLdNode = {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: article.title,
      url,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      datePublished: article.published_at,
      dateModified: article.updated_at,
      author: { "@id": orgId },
      publisher: { "@id": orgId },
      isPartOf: { "@id": blogId },
    };
    if (article.description) node.description = article.description;
    if (article.tags?.length) node.keywords = article.tags.join(", ");
    posts.push(node);
  }

  const blog: JsonLdNode = {
    "@type": "Blog",
    "@id": blogId,
    url: blogUrl,
    name: `${name} blog`,
    publisher: { "@id": orgId },
  };
  if (posts.length) blog.blogPost = posts.map((p) => ({ "@id": p["@id"] }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      { "@type": "WebSite", "@id": siteId, url: origin, name, publisher: { "@id": orgId } },
      blog,
      ...posts,
    ],
  };
}

/** The exact HTML written to the site's head, or null when there's nothing to say. */
export function buildCustomCode(options: SeoGraphOptions): string | null {
  const graph = buildSeoGraph(options);
  if (!graph) return null;
  const json = escapeJsonLd(JSON.stringify(graph));
  return `${START_MARKER}\n<script type="application/ld+json">${json}</script>\n${END_MARKER}`;
}

/** True when a custom-code block at this location is one of ours. */
export function isRankboxCustomCode(html: string | null | undefined): boolean {
  return typeof html === "string" && html.includes(START_MARKER);
}
