/**
 * The writer's working notes, removed from an article body before it leaves
 * Rankbox. Stored bodies are Markdown written for Rankbox's own editor and
 * carry two things that would show up as junk on a live page:
 * - image concepts, `**[Image: …] (alt: "…")**`: notes, not images
 * - internal-link suggestions, `[anchor](#internal: target)`: not real links,
 *   so only the anchor text is kept
 *
 * Every way an article reaches a site runs through this: the public API, the
 * Webflow connector, and the Shopify connector. Each destination then makes
 * its own further changes (Webflow drops iframes, both connectors drop the
 * opening H1 their templates already show).
 */
const IMAGE_CONCEPT = /\*{0,2}\[Image:[^\]]*\]\s*\(alt:\s*"[^"]*"\)\*{0,2}/g;
const INTERNAL_LINK = /\[([^\]]+)\]\(#internal:[^)]*\)/g;

export function stripWriterNotes(markdown: string): string {
  return (markdown ?? "")
    .replace(/\r\n/g, "\n")
    .replace(IMAGE_CONCEPT, "")
    .replace(INTERNAL_LINK, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
