import TurndownService from "turndown";
import { IFRAME_ALLOW, isYoutubeEmbedSrc } from "./editor-youtube";

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
    // turndown drops tags it has no rule for, which would delete a generated
    // article's video on the first save. Write the embed back out as-is.
    turndown.addRule("youtubeEmbed", {
      filter: (node) => node.nodeName === "IFRAME" && isYoutubeEmbedSrc(node.getAttribute("src")),
      replacement: (_content, node) => {
        const el = node as HTMLElement;
        const src = el.getAttribute("src") ?? "";
        const title = (el.getAttribute("title") ?? "").replace(/"/g, "'");
        return `\n\n<iframe width="560" height="315" src="${src}" title="${title}" frameborder="0" allow="${IFRAME_ALLOW}" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>\n\n`;
      },
    });
  }
  return turndown.turndown(html).trim();
}
