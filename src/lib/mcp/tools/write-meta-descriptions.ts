import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "write_meta_descriptions",
  title: "Write meta descriptions",
  description:
    "Generate 3 compelling, click-worthy SEO meta descriptions (120-160 characters each) for a web page, given a topic or short page summary.",
  inputSchema: {
    topic: z
      .string()
      .trim()
      .min(2)
      .max(600)
      .describe("The page topic or a short summary of its content."),
  },
  annotations: { readOnlyHint: true, idempotentHint: false, openWorldHint: true },
  handler: async ({ topic }) => {
    const { writeMetaDescriptions } = await import("@/lib/geo.server");
    const options = await writeMetaDescriptions(topic);
    const text = options.map((o, i) => `${i + 1}. ${o}`).join("\n");
    return { content: [{ type: "text", text }], structuredContent: { options } };
  },
});
