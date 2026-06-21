import { marked } from "marked";

/** Convert stored markdown into HTML for the rich-text editor. */
export function markdownToHtml(md: string): string {
  if (!md?.trim()) return "";
  return marked.parse(md, { async: false, breaks: true, gfm: true }) as string;
}