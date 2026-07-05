import { defineMcp } from "@lovable.dev/mcp-js";
import generateAiQuestions from "./tools/generate-ai-questions";
import generateContentBrief from "./tools/generate-content-brief";
import writeMetaDescriptions from "./tools/write-meta-descriptions";

export default defineMcp({
  name: "rankvolt-mcp",
  title: "Rankvolt MCP",
  version: "0.1.0",
  instructions:
    "Rankvolt's GEO (generative engine optimization) toolkit. Use `generate_ai_questions` to find the questions people ask AI about a topic, `generate_content_brief` to plan an article for a keyword, and `write_meta_descriptions` to draft SEO meta descriptions. These help content rank on Google and get recommended by AI engines like ChatGPT and Perplexity.",
  tools: [generateAiQuestions, generateContentBrief, writeMetaDescriptions],
});
