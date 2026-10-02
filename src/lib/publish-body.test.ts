/**
 * The writer's notes must never reach a live page. Before this cleaner was
 * shared, the public API sent bodies raw, so a site rendering `body_html`
 * showed "[Image: …]" notes and links pointing at "#internal: …".
 */
import { describe, expect, it } from "vitest";
import { stripWriterNotes } from "./publish-body";
import { serializeArticle } from "./public-api.server";
import { cleanMarkdownForShopify } from "./shopify/body";
import { cleanMarkdownForWebflow } from "./webflow/body";

const BODY = [
  "# How to Run a Sprint",
  "",
  "Plan the sprint around one goal.",
  "",
  '**[Image: a sprint board with three columns] (alt: "Sprint board")**',
  "",
  "",
  "",
  "Read our [sprint planning guide](#internal: sprint-planning) first, or the [Scrum Guide](https://scrumguides.org).",
  "",
  '<iframe src="https://www.youtube.com/embed/abc123"></iframe>',
].join("\r\n");

describe("stripWriterNotes", () => {
  const out = stripWriterNotes(BODY);

  it("drops image concepts", () => {
    expect(out).not.toMatch(/\[Image:/);
    expect(out).not.toMatch(/alt:/);
  });

  it("keeps an internal-link suggestion's anchor text, not the fake link", () => {
    expect(out).toContain("Read our sprint planning guide first");
    expect(out).not.toContain("#internal");
  });

  it("leaves real links, the video embed, and the H1 alone", () => {
    expect(out).toContain("[Scrum Guide](https://scrumguides.org)");
    expect(out).toContain("<iframe");
    expect(out.startsWith("# How to Run a Sprint")).toBe(true);
  });

  it("normalizes line endings and collapses the gaps removal leaves", () => {
    expect(out).not.toContain("\r");
    expect(out).not.toMatch(/\n{3,}/);
  });

  it("is safe on an empty body", () => {
    expect(stripWriterNotes("")).toBe("");
  });
});

describe("every publishing path uses it", () => {
  it("the public API sends clean Markdown and HTML", () => {
    const article = serializeArticle({
      id: "8f3c2a91-0000-4000-8000-000000000000",
      title: "How to Run a Sprint",
      description: "Plan a sprint.",
      body: BODY,
      tags: ["sprints"],
      seo_score: 100,
      published_url: null,
      created_at: "2026-09-15T00:00:00Z",
      updated_at: "2026-09-16T00:00:00Z",
    });
    for (const text of [article.body_markdown, article.body_html]) {
      expect(text).not.toMatch(/\[Image:/);
      expect(text).not.toContain("#internal");
    }
    expect(article.body_html).toContain('href="https://scrumguides.org"');
  });

  it("the Webflow and Shopify connectors still strip notes and the H1", () => {
    for (const out of [cleanMarkdownForWebflow(BODY), cleanMarkdownForShopify(BODY)]) {
      expect(out).not.toMatch(/\[Image:/);
      expect(out).not.toContain("#internal");
      expect(out).not.toMatch(/^# /);
    }
  });
});
