/**
 * The answer engines Rankbox has an SEO guide for, in two tiers. The frontier
 * five are the logos in the landing hero's "Cited across" badge, in the same
 * order, so a click on any of them lands on its guide. The rest are guides
 * only: they never join the hero, which stays at five by design.
 *
 * Deliberately light: the navbar, footer and hero import this on every page.
 * The guides themselves (long-form content) live in ./guides and are only
 * pulled in by the /ai-seo routes.
 */

export type EngineSlug =
  | "chatgpt"
  | "google-ai-overviews"
  | "gemini"
  | "claude"
  | "perplexity"
  | "copilot"
  | "grok"
  | "meta-ai"
  | "deepseek"
  | "mistral"
  | "manus";

/** Names in ENGINE_MARKS (src/components/landing/ai-logos.tsx). */
export type EngineMarkName =
  | "ChatGPT"
  | "Google"
  | "Gemini"
  | "Claude"
  | "Perplexity"
  | "Copilot"
  | "Grok"
  | "Meta AI"
  | "DeepSeek"
  | "Mistral"
  | "Manus";

/** Frontier: the hero's five. More: every other engine or agent with a guide. */
export type EngineTier = "frontier" | "more";

export const TIERS: Record<EngineTier, { label: string; short: string }> = {
  frontier: { label: "The frontier five", short: "Frontier" },
  more: { label: "More engines & agents", short: "More engines" },
};

export interface Engine {
  slug: EngineSlug;
  /** Full product name, as a searcher types it. */
  name: string;
  /** For tight spaces: tabs, tooltips, menu rows. */
  shortName: string;
  vendor: string;
  mark: EngineMarkName;
  tier: EngineTier;
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
    tier: "frontier",
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
    tier: "frontier",
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
    tier: "frontier",
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
    tier: "frontier",
    accent: "#d97757",
    tagline: "Get found when Claude searches the web",
    published: "2026-09-21",
    updated: "2026-09-22",
  },
  {
    slug: "perplexity",
    name: "Perplexity",
    shortName: "Perplexity",
    vendor: "Perplexity AI",
    mark: "Perplexity",
    tier: "frontier",
    accent: "#20808d",
    tagline: "Earn a numbered source in Perplexity",
    published: "2026-09-21",
    updated: "2026-09-22",
  },
  {
    slug: "copilot",
    name: "Microsoft Copilot",
    shortName: "Copilot",
    vendor: "Microsoft",
    mark: "Copilot",
    tier: "more",
    accent: "#2870ea",
    tagline: "Get cited in Copilot's Bing-grounded answers",
    published: "2026-09-22",
    updated: "2026-09-22",
  },
  {
    slug: "grok",
    name: "Grok",
    shortName: "Grok",
    vendor: "SpaceXAI",
    mark: "Grok",
    tier: "more",
    accent: "#111111",
    tagline: "Get cited when Grok searches the web and X",
    published: "2026-09-22",
    updated: "2026-09-22",
  },
  {
    slug: "meta-ai",
    name: "Meta AI",
    shortName: "Meta AI",
    vendor: "Meta",
    mark: "Meta AI",
    tier: "more",
    accent: "#0668e1",
    tagline: "Show up in Meta AI across WhatsApp, Instagram and Facebook",
    published: "2026-09-22",
    updated: "2026-09-22",
  },
  {
    slug: "deepseek",
    name: "DeepSeek",
    shortName: "DeepSeek",
    vendor: "DeepSeek",
    mark: "DeepSeek",
    tier: "more",
    accent: "#4d6bfe",
    tagline: "Get found and cited by DeepSeek's Smart Search",
    published: "2026-09-22",
    updated: "2026-09-22",
  },
  {
    slug: "mistral",
    name: "Mistral Le Chat",
    shortName: "Le Chat",
    vendor: "Mistral AI",
    mark: "Mistral",
    tier: "more",
    accent: "#fa520f",
    tagline: "Earn a citation in Le Chat, now Mistral Vibe",
    published: "2026-09-22",
    updated: "2026-09-22",
  },
  {
    slug: "manus",
    name: "Manus",
    shortName: "Manus",
    vendor: "Manus",
    mark: "Manus",
    tier: "more",
    accent: "#34322d",
    tagline: "Be the source an AI agent reads, uses and cites",
    published: "2026-09-22",
    updated: "2026-09-22",
  },
];

export const ENGINE_SLUGS = ENGINES.map((e) => e.slug);

/** One tier's engines, in ENGINES order. */
export function enginesInTier(tier: EngineTier): Engine[] {
  return ENGINES.filter((e) => e.tier === tier);
}

export function getEngine(slug: string): Engine | undefined {
  return ENGINES.find((e) => e.slug === slug);
}

/** The guide a hero logo leads to. */
export function engineForMark(mark: string): Engine | undefined {
  return ENGINES.find((e) => e.mark === mark);
}
