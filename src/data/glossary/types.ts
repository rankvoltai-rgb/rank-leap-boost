/**
 * The shape of a glossary entry.
 *
 * Every entry is written for two readers at once: the person who searched the
 * term, and the answer engine that will lift one passage of it. Answer engines
 * extract chunks, not pages, so every part has to stand on its own:
 *
 * 1. The definition (in ./terms, shared with the hub) is one sentence: the
 *    term, the category it belongs to, and what sets it apart. No preamble.
 * 2. "Why it matters" is tied to the reader's situation — a founder or small
 *    marketing team that owns a growth number without a content department.
 * 3. Three to five real questions, each answered in its first sentence.
 * 4. One original element — a named framework, a worked example or a
 *    benchmark — so there's something to cite beyond the consensus.
 * 5. Related terms and the product page that solves the problem.
 *
 * Prose fields typed `Md` take the /ai-seo guides' inline markup — **bold**,
 * `code` and [text](href) — and expansion blocks reuse the guides' renderers.
 */
import type { ENGINE_ORDER } from "@/data/features";
import type { GuideBlock, Md, Source } from "@/data/ai-seo/types";

export type { GuideBlock, Md, Source };

/** Every feature page slug. */
export type FeatureSlug = (typeof ENGINE_ORDER)[number];

export interface GlossaryQuestion {
  /** Anchor id, also the table-of-contents target. */
  id: string;
  /**
   * A question people actually ask, phrased the way they ask it: "How do you
   * measure X?", "X vs Y: what's the difference?", "Common mistakes with X".
   */
  question: string;
  /**
   * The direct answer in one or two sentences, set first and large so the
   * section still answers the question if it's lifted on its own.
   */
  answer: Md;
  /** The expansion: evidence, examples, steps. */
  blocks: GuideBlock[];
}

export interface OriginalItem {
  label: string;
  body: Md;
  /** Worked example: the figure at this step. Benchmark: the threshold. */
  value?: string;
}

/**
 * The part of the entry nobody else has. Never invented data: until Rankbox
 * publishes its own measurements, this is a named framework, a worked example
 * with its inputs shown, or a benchmark sourced from published research.
 */
export interface Original {
  kind: "framework" | "worked-example" | "benchmark";
  /** A name worth citing: "The Fan-Out Coverage Map". */
  name: string;
  /** What it is and when to use it, in one or two sentences. */
  summary: Md;
  items: OriginalItem[];
  /** Framework: how to apply it. Worked example: the result. Benchmark: how to read it. */
  outcome?: Md;
}

export interface GlossaryEntry {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  /** The head term plus close variants and question forms. */
  keywords: string[];
  /** Two or three sentences for founders and small marketing teams. */
  whyItMatters: Md;
  /** Three to five. */
  questions: GlossaryQuestion[];
  original: Original;
  /** Other glossary slugs, most closely related first. */
  related: string[];
  /** The feature page that solves the problem this term describes. */
  product: { feature: FeatureSlug; pitch: Md };
  /** A free tool that helps, where one does. */
  tool?: string;
  /** Deeper reading elsewhere on the site: engine guides, blog playbooks. */
  further?: { title: string; href: string; description: string }[];
  sources: Source[];
}
