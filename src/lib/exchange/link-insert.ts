/**
 * Getting an exchange link into an article, and making sure it stayed there.
 *
 * The writer is asked for the link up front (`outboundLinkDirective`), and the
 * model usually weaves it in well. But `optimizeToHundred` rewrites the whole
 * body up to three times, so after the last pass `ensureOutboundLink` checks
 * the link survived and repairs it deterministically if not — the same
 * post-generation stage, and the same reason, as the video embed.
 *
 * The repair is conservative on purpose. It prefers wrapping the anchor phrase
 * where the article already says it; it will append one sentence to the most
 * relevant body paragraph; and it will give up rather than put a link in a
 * heading, a list, the opening answer, the FAQ or the references — those are
 * exactly the placements that read as manufactured.
 */
import { sameLink } from "./domain";
import { termSet, tokens } from "./scoring";

export interface OutboundLink {
  url: string;
  anchor: string;
  /** What the linked page is about, to pick the paragraph it belongs in. */
  topic?: string;
}

export type InsertMethod = "model" | "anchor-wrap" | "sentence-append" | "failed";

export interface InsertResult {
  body: string;
  method: InsertMethod;
  ok: boolean;
}

const MD_LINK = /\[([^\]\n]*)\]\(\s*<?([^\s)>]+)>?(?:\s+"[^"]*")?\s*\)/g;
const HTML_HREF = /<a\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/gi;
const INLINE_CODE = /`[^`\n]*`/g;
const HTML_TAG = /<[^>\n]+>/g;

/** Sections a manufactured-looking link must never land in. */
const EXCLUDED_SECTION =
  /\b(references?|sources?|further reading|frequently asked|faqs?|key takeaways?|tl;?dr|summary|conclusion|watch:|related (posts|articles))\b/i;

/** A first line that makes a block something other than prose. */
const NON_PROSE = /^\s*(?:[-*+]\s|\d+[.)]\s|>|\||<|!\[|-{3,}\s*$|\*{3,}\s*$|_{3,}\s*$)/;

const MIN_WORDS = 20;

const FRAMES: Array<(link: string) => string> = [
  (l) => `For a deeper breakdown, see ${l}.`,
  (l) => `A practical reference on this is ${l}.`,
  (l) => `If you want to go further, ${l} is worth a read.`,
  (l) => `See ${l} for a closer look at how this plays out.`,
  (l) => `For more on this, read ${l}.`,
  (l) => `${l} covers this in more depth.`,
];

/** The instruction the writer gets, in the main prompt and every optimize pass. */
export function outboundLinkDirective(link: OutboundLink): string {
  const about = link.topic ? ` (it covers: ${link.topic})` : "";
  return `REQUIRED OUTBOUND LINK
Include exactly one link to ${link.url} using the anchor text "${link.anchor}", written as the markdown link [${link.anchor}](${link.url}).
Place it inside a body paragraph where a reader would genuinely want that reference${about}. Never put it in the opening answer, Key Takeaways, the FAQ, or the References section, and never inside a heading or a list item.
Link this URL once only. Do not describe it as a partner, sponsored or exchange link — it is an ordinary citation, and it must be kept through every revision.`;
}

/** Every URL the body links to, markdown and HTML alike. */
export function linkedUrls(body: string): string[] {
  const out: string[] = [];
  for (const m of body.matchAll(MD_LINK)) out.push(m[2]);
  for (const m of body.matchAll(HTML_HREF)) out.push(m[1]);
  return out;
}

export function findOutboundLink(body: string, url: string): boolean {
  return linkedUrls(body).some((found) => sameLink(found, url));
}

interface Block {
  start: number;
  end: number;
  text: string;
  eligible: boolean;
  lead: boolean;
  hasLink: boolean;
  words: number;
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function parseBlocks(lines: string[]): Block[] {
  const blocks: Block[] = [];
  let inFence = false;
  let excludedLevel: number | null = null;
  let sawProse = false;
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      i += 1;
      continue;
    }
    if (inFence || line.trim() === "") {
      i += 1;
      continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      if (excludedLevel !== null && level <= excludedLevel) excludedLevel = null;
      if (EXCLUDED_SECTION.test(heading[2])) excludedLevel = level;
      i += 1;
      continue;
    }
    const start = i;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^\s*(```|~~~)/.test(lines[i]) &&
      !/^#{1,6}\s/.test(lines[i])
    ) {
      i += 1;
    }
    const text = lines.slice(start, i).join("\n");
    const prose =
      !NON_PROSE.test(lines[start]) &&
      !/<(iframe|video|img|table|figure)\b/i.test(text) &&
      !/^\s*\*\*\[?image/i.test(lines[start]);
    const words = countWords(text);
    blocks.push({
      start,
      end: i,
      text,
      eligible: prose && excludedLevel === null && words >= MIN_WORDS,
      lead: prose && !sawProse,
      hasLink: /\]\(|<a\b/i.test(text),
      words,
    });
    if (prose) sawProse = true;
  }
  return blocks;
}

/** Character spans of a block a link must not be written into. */
function protectedSpans(text: string): Array<[number, number]> {
  const spans: Array<[number, number]> = [];
  for (const re of [MD_LINK, HTML_HREF, INLINE_CODE, HTML_TAG]) {
    for (const m of text.matchAll(re)) spans.push([m.index ?? 0, (m.index ?? 0) + m[0].length]);
  }
  return spans;
}

function overlaps(spans: Array<[number, number]>, from: number, to: number): boolean {
  return spans.some(([s, e]) => from < e && to > s);
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Where the anchor phrase appears as plain prose, or -1. */
function anchorPosition(text: string, anchor: string): { index: number; length: number } | null {
  const words = anchor.trim().split(/\s+/).map(escapeRegExp);
  if (words.length === 0 || !words[0]) return null;
  const re = new RegExp(`(?<![A-Za-z0-9])${words.join("\\s+")}(?![A-Za-z0-9])`, "gi");
  const spans = protectedSpans(text);
  for (const m of text.matchAll(re)) {
    const index = m.index ?? 0;
    if (!overlaps(spans, index, index + m[0].length)) return { index, length: m[0].length };
  }
  return null;
}

function relevance(block: Block, targetTerms: Set<string>): number {
  if (targetTerms.size === 0) return 0;
  const words = new Set(tokens(block.text));
  let shared = 0;
  for (const t of targetTerms) if (words.has(t)) shared += 1;
  let score = shared / targetTerms.size + Math.min(block.words, 150) / 3000;
  // The lead answers the query and is what answer engines quote; keep it clean
  // unless nothing else fits. A paragraph already carrying a link is less ideal.
  if (block.lead) score *= 0.5;
  if (block.hasLink) score *= 0.7;
  return score;
}

function hash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i += 1) h = (h * 33) ^ s.charCodeAt(i);
  return Math.abs(h);
}

function splice(lines: string[], block: Block, text: string): string {
  return [...lines.slice(0, block.start), ...text.split("\n"), ...lines.slice(block.end)].join(
    "\n",
  );
}

/**
 * Makes sure `body` links to `link.url` exactly once with the given anchor.
 * Returns the (possibly unchanged) body and how the link got there.
 */
export function ensureOutboundLink(body: string, link: OutboundLink): InsertResult {
  const url = link.url.trim();
  const anchor = link.anchor.trim();
  if (!url || !anchor) return { body, method: "failed", ok: false };

  if (findOutboundLink(body, url)) return { body, method: "model", ok: true };

  const lines = body.split("\n");
  const blocks = parseBlocks(lines);
  const targetTerms = termSet(anchor, link.topic);
  const eligible = blocks
    .filter((b) => b.eligible)
    .map((b) => ({ block: b, score: relevance(b, targetTerms) }))
    .sort((a, b) => b.score - a.score);

  if (eligible.length === 0) return { body, method: "failed", ok: false };

  // Best case: the article already says the anchor phrase somewhere sensible.
  for (const { block } of eligible) {
    const hit = anchorPosition(block.text, anchor);
    if (!hit) continue;
    const found = block.text.slice(hit.index, hit.index + hit.length);
    const text = `${block.text.slice(0, hit.index)}[${found}](${url})${block.text.slice(hit.index + hit.length)}`;
    return { body: splice(lines, block, text), method: "anchor-wrap", ok: true };
  }

  // Otherwise one sentence at the end of the most relevant paragraph.
  const { block } = eligible[0];
  const frame = FRAMES[hash(url) % FRAMES.length];
  const sentence = frame(`[${anchor}](${url})`);
  const text = `${block.text.trimEnd()} ${sentence.charAt(0).toUpperCase()}${sentence.slice(1)}`;
  return { body: splice(lines, block, text), method: "sentence-append", ok: true };
}
