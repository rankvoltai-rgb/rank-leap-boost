// Shared helpers for the Rankbox public publishing API (/api/public/v1/*).
// These endpoints are key-authenticated; they are consumed by CMS plugins
// (Framer, Shopify, WordPress) that pull a user's finished articles, and that
// may report back where each one was published (PATCH /articles/:id).
import { markdownToHtml } from "@/lib/markdown";
import { articleSlug } from "@/lib/api-keys.server";

export const API_CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Api-Key",
  "Access-Control-Max-Age": "86400",
} as const;

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...API_CORS_HEADERS },
  });
}

export function corsPreflight(): Response {
  return new Response(null, { status: 204, headers: API_CORS_HEADERS });
}

export function badRequest(message: string): Response {
  return jsonResponse({ error: message }, 400);
}

export function unauthorized(): Response {
  return jsonResponse(
    { error: "Invalid or missing API key. Pass it as 'Authorization: Bearer <key>'." },
    401,
  );
}

/** The key is real, but its Rankbox account has no trial or plan. */
export function subscriptionRequired(): Response {
  return jsonResponse(
    {
      error:
        "This Rankbox account has no active plan, so it can't sync articles. Start or renew it at https://rankbox.xyz/dashboard/billing.",
      code: "subscription_required",
    },
    402,
  );
}

export interface PublishedArticle {
  id: string;
  slug: string;
  title: string;
  description: string;
  body_markdown: string;
  body_html: string;
  tags: string[];
  seo_score: number;
  /** Where the plugin published it, once reported — see PATCH /articles/:id. */
  published_url: string | null;
  published_at: string;
  updated_at: string;
}

/** The columns every article endpoint selects. */
export const ARTICLE_COLUMNS =
  "id, title, description, body, tags, seo_score, published_url, created_at, updated_at";

interface BlogRow {
  id: string;
  title: string;
  description: string | null;
  body: string | null;
  tags: string[] | null;
  seo_score: number | null;
  published_url?: string | null;
  created_at: string;
  updated_at: string;
}

/** Map a stored blog row into the public, plugin-facing article shape. */
export function serializeArticle(row: BlogRow): PublishedArticle {
  const body = row.body ?? "";
  return {
    id: row.id,
    slug: articleSlug(row.title, row.id),
    title: row.title,
    description: row.description ?? "",
    body_markdown: body,
    body_html: markdownToHtml(body),
    tags: row.tags ?? [],
    seo_score: row.seo_score ?? 0,
    published_url: row.published_url ?? null,
    published_at: row.updated_at,
    updated_at: row.updated_at,
  };
}
