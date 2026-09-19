/**
 * The shape of a blog article, read from its blocks: heading anchors, the
 * table of contents, the answer-first sections the article writer produces
 * (Key Takeaways, FAQ, References), and reading time.
 *
 * Pure and source-agnostic, so the page, its JSON-LD and the server loader all
 * agree on it whether the post came from Notion or the repo.
 */
import type { NotionBlock, RichTextSpan } from "@/lib/notion.server";

const HEADINGS = ["heading_1", "heading_2", "heading_3"] as const;

/** Reading speed shared with the editor's SEO panel (src/lib/seo-analysis.ts). */
const WORDS_PER_MINUTE = 220;

export function plainText(spans?: RichTextSpan[]): string {
  return (spans ?? []).map((s) => s.text).join("");
}

function blockText(block: NotionBlock): string {
  const own = plainText(block.richText);
  const cells = (block.rows ?? []).flat().map(plainText).join(" ");
  const children = (block.children ?? []).map(blockText).join(" ");
  return [own, cells, children].filter(Boolean).join(" ");
}

export function countWords(blocks: NotionBlock[]): number {
  return blocks.map(blockText).join(" ").split(/\s+/).filter(Boolean).length;
}

export function readingMinutes(words: number): number {
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function isHeading(block: NotionBlock): boolean {
  return (HEADINGS as readonly string[]).includes(block.type);
}

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 64) || "section"
  );
}

/** A stable, readable id for every heading, de-duplicated: block id -> anchor. */
export function headingAnchors(blocks: NotionBlock[]): Map<string, string> {
  const anchors = new Map<string, string>();
  const used = new Map<string, number>();
  for (const block of blocks) {
    if (!isHeading(block)) continue;
    const base = slugify(plainText(block.richText));
    const n = used.get(base) ?? 0;
    used.set(base, n + 1);
    anchors.set(block.id, n ? `${base}-${n + 1}` : base);
  }
  return anchors;
}

export type SectionKind = "body" | "takeaways" | "faq" | "references";

export interface ArticleSection {
  heading: NotionBlock | null;
  kind: SectionKind;
  blocks: NotionBlock[];
}

export interface ArticleOutline {
  /** The heading type sections split on: the highest level the post uses. */
  topLevel: string | null;
  /** Everything before the first section heading. */
  intro: NotionBlock[];
  sections: ArticleSection[];
  anchors: Map<string, string>;
  /** Written to the blueprint: an answer up top, with takeaways or an FAQ. */
  answerFirst: boolean;
}

function kindOf(heading: NotionBlock): SectionKind {
  const text = plainText(heading.richText).trim().toLowerCase();
  if (/^(key|quick) takeaways?$|^tl;?dr$|^takeaways?$/.test(text)) return "takeaways";
  if (/^(frequently asked questions|faqs?)\b/.test(text)) return "faq";
  if (/^(references|sources|further reading)$/.test(text)) return "references";
  return "body";
}

export function outlineArticle(blocks: NotionBlock[]): ArticleOutline {
  const topLevel = HEADINGS.find((h) => blocks.some((b) => b.type === h)) ?? null;
  const intro: NotionBlock[] = [];
  const sections: ArticleSection[] = [];
  for (const block of blocks) {
    if (block.type === topLevel) {
      sections.push({ heading: block, kind: kindOf(block), blocks: [] });
    } else if (sections.length) {
      sections[sections.length - 1].blocks.push(block);
    } else {
      intro.push(block);
    }
  }
  return {
    topLevel,
    intro,
    sections,
    anchors: headingAnchors(blocks),
    answerFirst: sections.some((s) => s.kind === "takeaways" || s.kind === "faq"),
  };
}

export interface TocEntry {
  id: string;
  text: string;
}

/** One entry per section, in reading order. References are left out. */
export function tableOfContents(outline: ArticleOutline): TocEntry[] {
  return outline.sections
    .filter((s) => s.heading && s.kind !== "references")
    .map((s) => ({
      id: outline.anchors.get(s.heading!.id) ?? "",
      text: plainText(s.heading!.richText),
    }));
}

export interface FaqEntry {
  question: NotionBlock;
  answer: NotionBlock[];
}

/**
 * An FAQ section split into its parts: any lead-in before the first question,
 * each question heading with the blocks that answer it, and a closing line.
 * The article blueprint ends the FAQ with a one-line reader question ("…which
 * step are you starting with?"); that line belongs to the article, not to the
 * last answer, so a trailing question-paragraph or anything after a divider
 * becomes the outro.
 */
export function faqEntries(section: ArticleSection): {
  lead: NotionBlock[];
  entries: FaqEntry[];
  outro: NotionBlock[];
} {
  const lead: NotionBlock[] = [];
  const entries: FaqEntry[] = [];
  const outro: NotionBlock[] = [];
  let closed = false;
  for (const block of section.blocks) {
    if (closed) outro.push(block);
    else if (block.type === "divider" && entries.length) closed = true;
    else if (isHeading(block)) entries.push({ question: block, answer: [] });
    else if (entries.length) entries[entries.length - 1].answer.push(block);
    else lead.push(block);
  }
  const last = entries[entries.length - 1];
  const tail = last?.answer[last.answer.length - 1];
  if (
    !closed &&
    last &&
    last.answer.length > 1 &&
    tail?.type === "paragraph" &&
    plainText(tail.richText).trim().endsWith("?")
  ) {
    outro.push(last.answer.pop()!);
  }
  return { lead, entries, outro };
}

/** Question/answer text for FAQPage structured data. */
export function faqForSchema(blocks: NotionBlock[]): { q: string; a: string }[] {
  const faq = outlineArticle(blocks).sections.find((s) => s.kind === "faq");
  if (!faq) return [];
  return faqEntries(faq)
    .entries.map(({ question, answer }) => ({
      q: plainText(question.richText).trim(),
      a: answer.map(blockText).join(" ").trim(),
    }))
    .filter((e) => e.q && e.a);
}
