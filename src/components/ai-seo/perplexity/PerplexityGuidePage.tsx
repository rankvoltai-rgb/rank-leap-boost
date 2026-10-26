/**
 * /ai-seo/perplexity's own layout, built around Perplexity's citation
 * mechanic. The route renders this from its LAYOUTS map; the page itself
 * lives in ./PerplexityLayout.
 */
import type { EngineGuide } from "@/data/ai-seo/types";
import { PerplexityLayout } from "./PerplexityLayout";

export function PerplexityGuidePage({ guide }: { guide: EngineGuide }) {
  return <PerplexityLayout guide={guide} />;
}
