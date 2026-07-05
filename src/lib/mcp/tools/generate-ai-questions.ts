import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "generate_ai_questions",
  title: "Generate AI search questions",
  description:
    "Given a topic, list the real questions people ask AI assistants (ChatGPT, Perplexity, Gemini, Google AI Overviews), grouped by intent (Informational, Commercial, Comparison, Transactional). Use it to plan content that gets cited by AI engines.",
  inputSchema: {
    topic: z.string().trim().min(2).max(200).describe("The topic, product, or niche to research."),
  },
  annotations: { readOnlyHint: true, idempotentHint: false, openWorldHint: true },
  handler: async ({ topic }) => {
    const { generateAiQuestions } = await import("@/lib/geo.server");
    const groups = await generateAiQuestions(topic);
    const text = groups
      .map((g) => `## ${g.intent}\n${g.questions.map((q) => `- ${q}`).join("\n")}`)
      .join("\n\n");
    return { content: [{ type: "text", text }], structuredContent: { groups } };
  },
});
