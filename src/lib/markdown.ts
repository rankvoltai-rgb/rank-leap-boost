import { marked } from "marked";
import TurndownService from "turndown";

/** Convert stored markdown into HTML for the rich-text editor. */
export function markdownToHtml(md: string): string {
  if (!md?.trim()) return "";
  return marked.parse(md, { async: false, breaks: true, gfm: true }) as string;
}

let turndown: TurndownService | null = null;

/** Convert the editor's HTML back into markdown for storage. */
export function htmlToMarkdown(html: string): string {
  if (!html?.trim()) return "";
  if (!turndown) {
    turndown = new TurndownService({
      headingStyle: "atx",
      codeBlockStyle: "fenced",
      bulletListMarker: "-",
      emDelimiter: "*",
    });
  }
  return turndown.turndown(html).trim();
}