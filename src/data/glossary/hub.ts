/**
 * Copy for the /glossary hub. The FAQ answers the questions people ask about
 * the vocabulary itself — the SEO/GEO/AEO confusion above all — and links
 * down into the entries that settle each one.
 */
import type { Faq } from "@/data/ai-seo/types";
import { TERMS } from "./terms";

export const HUB = {
  metaTitle: "AI Search Glossary: SEO, GEO & LLM Terms Defined (2026) | Rankbox",
  metaDescription: `The AI search glossary: ${TERMS.length} SEO, GEO, AEO and LLM terms, each defined in one sentence and explained with sources, examples and original frameworks.`,
  keywords: [
    "SEO glossary",
    "GEO glossary",
    "AI search glossary",
    "LLM SEO terms",
    "generative engine optimization terms",
    "AEO glossary",
  ],
  faqs: [
    {
      q: "What's the difference between SEO, GEO and AEO?",
      a: "[SEO](/glossary/search-engine-optimization) earns rankings in search results, [AEO](/glossary/answer-engine-optimization) formats content so it can be used as a direct answer, and [GEO](/glossary/generative-engine-optimization) earns citations inside AI-generated answers. All three rest on the same foundation — crawlable, indexed, genuinely useful pages — so they're layers of one job, not three competing strategies.",
    },
    {
      q: "What does LLM SEO mean?",
      a: "[LLM SEO](/glossary/llm-seo) is making a brand visible in what large language models say — both from their training data and from the pages they cite when they search the web. It's the model-centric name for the same work GEO describes.",
    },
    {
      q: "Which AI crawlers should I allow?",
      a: "Allow each engine's search and user-triggered bots — `OAI-SearchBot` and `ChatGPT-User`, `Claude-SearchBot` and `Claude-User`, `PerplexityBot` and `Perplexity-User` — and decide on training crawlers such as [GPTBot](/glossary/gptbot), [ClaudeBot](/glossary/claudebot) and [Google-Extended](/glossary/google-extended) separately. Blocking a training crawler doesn't remove you from that engine's search.",
    },
    {
      q: "How is this glossary kept accurate?",
      a: "Every entry is dated and cites its sources, and the original frameworks are labelled as ours. Entries on fast-moving topics — crawlers, engine behavior, analytics — are re-checked every quarter, and an entry's updated date changes only when its facts are re-verified.",
    },
  ] satisfies Faq[],
};
