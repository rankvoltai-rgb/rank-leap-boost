/**
 * The article body, cleaned for a Shopify blog post.
 *
 * Stored bodies are Markdown written for Rankbox's own editor and carry a few
 * things that would show up as junk on a live store:
 * - the writer's image concepts, `**[Image: …] (alt: "…")**`: notes, not images
 * - internal-link suggestions, `[anchor](#internal: target)`: not real links
 * - a leading `# H1`, which would repeat the title the theme already shows
 *
 * Unlike Webflow's rich text field, a Shopify post takes any HTML, so the
 * YouTube embed and code blocks stay as they are.
 */
import { markdownToHtml } from "@/lib/markdown";
import { stripWriterNotes } from "@/lib/publish-body";

export function cleanMarkdownForShopify(markdown: string): string {
  let md = stripWriterNotes(markdown);
  // Only the opening H1: the theme's article template shows the title.
  md = md.replace(/^\s*#\s+[^\n]*\n?/, "");
  return md.replace(/\n{3,}/g, "\n\n").trim();
}

export function bodyHtmlForShopify(markdown: string): string {
  return markdownToHtml(cleanMarkdownForShopify(markdown)).trim();
}
