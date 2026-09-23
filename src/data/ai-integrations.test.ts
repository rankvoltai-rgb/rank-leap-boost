/**
 * The AI tool pages' rules, enforced. They're generated, so one bad template
 * line would ship on 49 pages at once; this is where it fails instead.
 */
import { describe, expect, it } from "vitest";
import { CONNECTORS } from "./connectors";
import { INTEGRATION_SLUGS } from "./integrations";
import {
  AI_TOOLS,
  AI_TOOL_SLUGS,
  aiToolPage,
  getAiTool,
  publicSlug,
  relatedAiTools,
} from "./ai-integrations";

const pages = AI_TOOLS.map((t) => ({ tool: t, page: aiToolPage(t) }));

/** Every string a visitor reads on a tool's page. */
function copyOf({ tool, page }: (typeof pages)[number]): string[] {
  return [
    page.metaTitle,
    page.metaDescription,
    page.eyebrow,
    page.headline.lead,
    page.headline.accent,
    page.subhead,
    ...page.specs.flatMap((s) => [s.value, s.label]),
    ...page.uses.flatMap((u) => [u.title, u.body]),
    ...page.prompts,
    ...page.faqs.flatMap((f) => [f.q, f.a]),
    tool.tagline,
  ];
}

describe("AI tool pages", () => {
  it("gives every named AI tool a page, and nothing else", () => {
    const mcp = CONNECTORS.filter((c) => c.kind === "mcp" && c.id !== "any-mcp");
    expect(AI_TOOL_SLUGS.sort()).toEqual(mcp.map((c) => c.id).sort());
  });

  it("never takes a hand-written integration page's URL", () => {
    for (const slug of AI_TOOL_SLUGS) expect(INTEGRATION_SLUGS, slug).not.toContain(slug);
  });

  it("links every connector to a page that exists", () => {
    for (const c of CONNECTORS) {
      const slug = publicSlug(c);
      expect(INTEGRATION_SLUGS.includes(slug) || !!getAiTool(slug), `${c.id} → ${slug}`).toBe(true);
    }
  });

  it("keeps each headline part short enough for the hero lockup", () => {
    for (const { tool, page } of pages) {
      expect(page.headline.lead.length, tool.id).toBeLessThanOrEqual(22);
      expect(page.headline.accent.length, tool.id).toBeLessThanOrEqual(22);
    }
  });

  it("has search metadata within length", () => {
    for (const { tool, page } of pages) {
      expect(page.metaTitle.length, tool.id).toBeLessThanOrEqual(60);
      expect(page.metaDescription.length, tool.id).toBeLessThanOrEqual(160);
    }
  });

  it("claims no proof we don't have", () => {
    const banned =
      /\b\d[\d,.]*\s*[kKmM]?\+?\s*(installs?|downloads?|users|customers|reviews|stars|sites)\b|\brat(ed|ing)\b|\b\d+(\.\d+)?\s*\/\s*5\b|\b(guarantee[sd]?|10x|skyrocket)\b/i;
    for (const p of pages)
      for (const text of copyOf(p)) expect(text, p.tool.id).not.toMatch(banned);
  });

  it("answers the setup question with the connector's own steps", () => {
    for (const { tool, page } of pages) {
      const answer = page.faqs[0].a;
      for (const s of tool.steps) expect(answer, tool.id).toContain(s.text.replace(/[.:]$/, ""));
    }
  });

  it("never asks the same question twice on a page", () => {
    for (const { tool, page } of pages) {
      const qs = page.faqs.map((f) => f.q);
      expect(new Set(qs).size, tool.id).toBe(qs.length);
    }
  });

  it("suggests related tools of the same kind, never the page itself", () => {
    for (const { tool } of pages) {
      for (const r of relatedAiTools(tool)) {
        expect(r.id).not.toBe(tool.id);
        expect(r.category).toBe(tool.category);
      }
    }
  });
});
