import TurndownService from "turndown";

let turndown: TurndownService | null = null;

/**
 * Convert the editor's HTML back into markdown for storage.
 *
 * `turndown` is a CommonJS dependency (it pulls in `require` at module load),
 * which crashes in the production Cloudflare Worker runtime. Keep it in this
 * client-only module so it never gets bundled into server functions.
 */
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
