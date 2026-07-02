import { framer } from "framer-plugin";
import type { PublishedArticle } from "@rankvolt/api-client";

// Sync articles into a Framer CMS collection using the managed-collection API.
// The plugin must run in "collection" mode (open it from a CMS collection) for
// `getActiveManagedCollection` to be available. Field-data follows the
// framer-plugin v3 shape; callers guard this so a version/API mismatch surfaces
// a clear message rather than crashing the plugin.
export async function syncArticlesToCollection(articles: PublishedArticle[]): Promise<number> {
  const collection = await framer.getActiveManagedCollection();

  await collection.setFields([
    { id: "title", name: "Title", type: "string" },
    { id: "description", name: "Description", type: "string" },
    { id: "body", name: "Body", type: "formattedText" },
    { id: "seoScore", name: "SEO Score", type: "number" },
    { id: "publishedAt", name: "Published", type: "date" },
  ]);

  // Item id === article id makes re-syncs idempotent (updates instead of dupes).
  await collection.addItems(
    articles.map((article) => ({
      id: article.id,
      slug: article.slug,
      fieldData: {
        title: { type: "string", value: article.title },
        description: { type: "string", value: article.description },
        body: { type: "formattedText", value: article.body_html },
        seoScore: { type: "number", value: article.seo_score },
        publishedAt: { type: "date", value: article.published_at },
      },
    })),
  );

  return articles.length;
}
