import type { PublishedArticle } from "@rankbox/api-client";

/** Test-only article factory. Kept beside the tests that use it. */
export function article(overrides: Partial<PublishedArticle> = {}): PublishedArticle {
  return {
    id: "a1",
    slug: "how-to-price-a-saas-product-a1b2c3d4",
    title: "How to Price a SaaS Product",
    description: "A pricing primer.",
    body_markdown: "# Pricing\n\nStart with value.",
    body_html: "<h1>Pricing</h1><p>Start with value.</p>",
    tags: ["pricing", "saas"],
    seo_score: 82,
    published_url: null,
    published_at: "2026-09-01T10:00:00.000Z",
    updated_at: "2026-09-01T10:00:00.000Z",
    ...overrides,
  };
}
