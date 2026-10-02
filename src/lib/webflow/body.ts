/**
 * The article body, cleaned for a Webflow rich text field.
 *
 * Stored bodies are Markdown written for Rankbox's own editor and carry a few
 * things that would show up as junk on a live Webflow page:
 * - the writer's image concepts, `**[Image: …] (alt: "…")**`: notes, not images
 * - internal-link suggestions, `[anchor](#internal: target)`: not real links
 * - a YouTube `<iframe>`, which a rich text field can't take through the API
 *   (the plain link written beneath it stays, so the video isn't lost)
 * - a leading `# H1`, which would repeat the title the template already shows
 * - code blocks, which Webflow's API turns into an empty string; they become
 *   inline code, line by line, so the content survives
 */
import { markdownToHtml } from "@/lib/markdown";
import { stripWriterNotes } from "@/lib/publish-body";

const IFRAME = /<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi;

export function cleanMarkdownForWebflow(markdown: string): string {
  let md = stripWriterNotes(markdown);
  md = md.replace(IFRAME, "");
  // Only the opening H1: the title is the page's H1 in the collection template.
  md = md.replace(/^\s*#\s+[^\n]*\n?/, "");
  // Removing lines leaves runs of blank lines behind.
  return md.replace(/\n{3,}/g, "\n\n").trim();
}

const CODE_BLOCK = /<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/g;

export function bodyHtmlForWebflow(markdown: string): string {
  return markdownToHtml(cleanMarkdownForWebflow(markdown))
    .replace(CODE_BLOCK, (_, code: string) => {
      const lines = code.replace(/\n$/, "").split("\n");
      return `<p>${lines.map((l) => `<code>${l}</code>`).join("<br>")}</p>`;
    })
    .trim();
}
