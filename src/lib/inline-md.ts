/**
 * The inline markup the /ai-seo guides are written in: **bold**, `code` and
 * [text](href) — nothing else. Parsed into the blog's rich-text spans so guide
 * prose renders with the article typography and link handling.
 */
import type { RichTextSpan } from "@/lib/notion.server";

/**
 * Straight quotes -> typographic ones, outside `code` spans (where a straight
 * quote is literal). A quote opens at the start of the text or after
 * whitespace, an opening bracket or a dash; otherwise it closes — which also
 * turns every apostrophe into ’. Idempotent, so nested parses are safe.
 */
function smartQuotes(md: string): string {
  return md
    .split(/(`[^`]+`)/)
    .map((part) =>
      part.startsWith("`")
        ? part
        : part
            .replace(/(^|[\s([{—–-])"/g, "$1\u201c")
            .replace(/"/g, "\u201d")
            .replace(/(^|[\s([{—–])'/g, "$1\u2018")
            .replace(/'/g, "\u2019"),
    )
    .join("");
}

export function parseInline(md: string): RichTextSpan[] {
  md = smartQuotes(md);
  const out: RichTextSpan[] = [];
  const re = /\*\*(.+?)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(md))) {
    if (m.index > last) out.push({ text: md.slice(last, m.index) });
    if (m[1] !== undefined) out.push(...parseInline(m[1]).map((s) => ({ ...s, bold: true })));
    else if (m[2] !== undefined) out.push({ text: m[2], code: true });
    else {
      const href = m[4];
      out.push(...parseInline(m[3]).map((s) => ({ ...s, href })));
    }
    last = re.lastIndex;
  }
  if (last < md.length) out.push({ text: md.slice(last) });
  return out;
}

/** The same text with the markup stripped — for meta tags and schema. */
export function plainText(md: string): string {
  return parseInline(md)
    .map((s) => s.text)
    .join("");
}

export function countWords(texts: string[]): number {
  return texts.reduce((n, t) => n + (plainText(t).match(/\S+/g)?.length ?? 0), 0);
}
