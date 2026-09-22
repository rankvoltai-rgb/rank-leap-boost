/**
 * The answer engines Rankbox has an SEO guide for — the same five whose logos
 * sit in the landing hero's "Cited across" badge, in the same order, so a
 * click on any of them lands on its guide.
 *
 * Deliberately light: the navbar, footer and hero import this on every page.
 * The guides themselves (long-form content) live in ./guides and are only
 * pulled in by the /ai-seo routes.
 */

export type EngineSlug = "chatgpt" | "google-ai-overviews" | "gemini" | "claude" | "perplexity";

/** Names in AI_MARKS (src/components/landing/ai-logos.tsx). */
export type EngineMarkName = "ChatGPT" | "Google" | "Gemini" | "Claude" | "Perplexity";

export interface Engine {
  slug: EngineSlug;
  /** Full product name, as a searcher types it. */
  name: string;
  /** For tight spaces: tabs, tooltips, menu rows. */
  shortName: string;
  vendor: string;
  mark: EngineMarkName;
  /** Brand colour, used sparingly as an identity marker — never as the UI accent. */
  accent: string;
  /** One line for menus and cards. */
  tagline: string;
  /** ISO dates for the guide — here, not in the guide, so the sitemap and the
      hub can read them without loading any guide text. */
  published: string;
  updated: string;
}

export const ENGINES: Engine[] = [
  {
    slug: "chatgpt",
    name: "ChatGPT",
    shortName: "ChatGPT",
    vendor: "OpenAI",
    mark: "ChatGPT",
    accent: "#10a37f",
    tagline: "Get cited in ChatGPT search answers",
    published: "2026-09-21",
    updated: "2026-09-21",
  },
  {
    slug: "google-ai-overviews",
    name: "Google AI Overviews & AI Mode",
    shortName: "Google AI",
    vendor: "Google",
    mark: "Google",
    accent: "#4285f4",
    tagline: "Win the links inside Google's AI answers",
    published: "2026-09-21",
    updated: "2026-09-21",
  },
  {
    slug: "gemini",
    name: "Gemini",
    shortName: "Gemini",
    vendor: "Google",
    mark: "Gemini",
    accent: "#5b6ef5",
    tagline: "Get grounded into Gemini's answers",
    published: "2026-09-21",
    updated: "2026-09-21",
  },
  {
    slug: "claude",
    name: "Claude",
    shortName: "Claude",
    vendor: "Anthropic",
    mark: "Claude",
    accent: "#d97757",
    tagline: "Get found when Claude searches the web",
    published: "2026-09-21",
    updated: "2026-09-21",
  },
  {
    slug: "perplexity",
    name: "Perplexity",
    shortName: "Perplexity",
    vendor: "Perplexity AI",
    mark: "Perplexity",
    accent: "#20808d",
    tagline: "Earn a numbered source in Perplexity",
    published: "2026-09-21",
    updated: "2026-09-21",
  },
];

export const ENGINE_SLUGS = ENGINES.map((e) => e.slug);

export function getEngine(slug: string): Engine | undefined {
  return ENGINES.find((e) => e.slug === slug);
}

/** The guide a hero logo leads to. */
export function engineForMark(mark: string): Engine | undefined {
  return ENGINES.find((e) => e.mark === mark);
}
