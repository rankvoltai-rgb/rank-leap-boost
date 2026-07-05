import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "generate_content_brief",
  title: "Generate SEO content brief",
  description:
    "Build a content brief for a target keyword: a working title, an H2 outline with talking points, questions the article must answer, and key entities to mention. Optimized to rank on Google and get cited by AI engines.",
  inputSchema: {
    keyword: z.string().trim().min(2).max(200).describe("The target keyword or phrase."),
  },
  annotations: { readOnlyHint: true, idempotentHint: false, openWorldHint: true },
  handler: async ({ keyword }) => {
    const { generateContentBrief } = await import("@/lib/geo.server");
    const brief = await generateContentBrief(keyword);
    const outline = brief.outline
      .map((s) => `### ${s.heading}\n${s.points.map((p) => `- ${p}`).join("\n")}`)
      .join("\n\n");
    const text = [
      `# ${brief.title}`,
      `## Outline\n${outline}`,
      `## Questions to answer\n${brief.questions.map((q) => `- ${q}`).join("\n")}`,
      `## Entities to mention\n${brief.entities.map((e) => `- ${e}`).join("\n")}`,
    ].join("\n\n");
    return { content: [{ type: "text", text }], structuredContent: { brief } };
  },
});
