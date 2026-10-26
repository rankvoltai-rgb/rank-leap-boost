/**
 * /ai-seo/deepseek's own layout, drawn in the landing page's frame. The page
 * itself lives in ./DeepseekLayout; this export is what the route's LAYOUTS
 * map imports.
 */
import type { EngineGuide } from "@/data/ai-seo/types";
import { DeepseekLayout } from "./DeepseekLayout";

export function DeepseekGuidePage({ guide }: { guide: EngineGuide }) {
  return <DeepseekLayout guide={guide} />;
}
