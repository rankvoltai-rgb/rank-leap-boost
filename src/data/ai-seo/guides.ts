/**
 * The long-form engine guides. Only the /ai-seo routes import this — shared
 * chrome (navbar, footer, hero, sitemap) uses the light ./engines list — and
 * even here the text is loaded on demand, one guide per chunk.
 */
import { countWords } from "@/lib/inline-md";
import { ENGINES, type EngineSlug } from "./engines";
import type { EngineGuide, GuideBlock } from "./types";

/* Each guide is its own chunk, loaded by the route that shows it — the text
   never rides along in the shared bundle, and one guide never pulls in the
   other four. */
const LOADERS: Record<EngineSlug, () => Promise<EngineGuide>> = {
  chatgpt: () => import("./content/chatgpt").then((m) => m.chatgpt),
  "google-ai-overviews": () =>
    import("./content/google-ai-overviews").then((m) => m.googleAiOverviews),
  gemini: () => import("./content/gemini").then((m) => m.gemini),
  claude: () => import("./content/claude").then((m) => m.claude),
  perplexity: () => import("./content/perplexity").then((m) => m.perplexity),
};

export function loadGuide(slug: EngineSlug): Promise<EngineGuide> {
  return LOADERS[slug]();
}

/** Every guide, in ENGINES order. */
export function loadGuides(): Promise<EngineGuide[]> {
  return Promise.all(ENGINES.map((e) => LOADERS[e.slug]()));
}

/** A block's readable text, for word counts. Shared with the glossary. */
export function guideBlockText(b: GuideBlock): string[] {
  switch (b.kind) {
    case "p":
    case "h3":
      return [b.text];
    case "list":
      return b.items;
    case "code":
      return [];
    case "table":
      return b.rows.flat();
    case "callout":
      return [b.title, b.text];
    case "pipeline":
      return b.steps.flatMap((s) => [s.title, s.body, s.lever ?? ""]);
    case "crawlers":
      return b.bots.map((c) => c.purpose);
    case "requirements":
      return b.items.flatMap((r) => [r.label, r.note]);
    case "stats":
      return b.items.map((s) => s.label);
    case "myths":
      return b.items.flatMap((m) => [m.myth, m.reality]);
    case "signals":
      return b.items.flatMap((s) => [s.title, s.body]);
  }
}

export function guideWordCount(g: EngineGuide): number {
  return countWords([
    g.shortAnswer,
    ...g.takeaways,
    ...g.sections.flatMap((s) => [s.title, ...s.blocks.flatMap(guideBlockText)]),
    ...g.checklist.flatMap((c) => [c.title, c.detail]),
    ...g.faqs.flatMap((f) => [f.q, f.a]),
  ]);
}

export function guideReadingMinutes(g: EngineGuide): number {
  return Math.max(1, Math.round(guideWordCount(g) / 230));
}
