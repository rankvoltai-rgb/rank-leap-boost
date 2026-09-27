import { describe, expect, it } from "vitest";
import { bodyHtmlForWebflow, cleanMarkdownForWebflow } from "./body";

describe("cleanMarkdownForWebflow", () => {
  it("drops the writer's image concepts", () => {
    const md = 'Intro.\n\n**[Image: a funnel chart] (alt: "design system funnel")**\n\nNext.';
    expect(cleanMarkdownForWebflow(md)).toBe("Intro.\n\nNext.");
  });

  it("unwraps internal-link suggestions into plain text", () => {
    const md = "See [our pricing guide](#internal: pricing page) for more.";
    expect(cleanMarkdownForWebflow(md)).toBe("See our pricing guide for more.");
  });

  it("keeps real links", () => {
    const md = "Per [MDN](https://developer.mozilla.org) docs.";
    expect(cleanMarkdownForWebflow(md)).toBe(md);
  });

  it("removes the iframe but keeps the video link beneath it", () => {
    const md = [
      "## Watch: Intro",
      "",
      '<iframe width="560" src="https://www.youtube.com/embed/abc" allowfullscreen></iframe>',
      "",
      "[Intro](https://www.youtube.com/watch?v=abc) — Channel",
    ].join("\n");
    expect(cleanMarkdownForWebflow(md)).toBe(
      "## Watch: Intro\n\n[Intro](https://www.youtube.com/watch?v=abc) — Channel",
    );
  });

  it("drops only the opening H1", () => {
    expect(cleanMarkdownForWebflow("# Title\n\nBody.\n\n# Later")).toBe("Body.\n\n# Later");
  });

  it("handles empty input", () => {
    expect(cleanMarkdownForWebflow("")).toBe("");
  });
});

describe("bodyHtmlForWebflow", () => {
  it("renders cleaned markdown to HTML", () => {
    const html = bodyHtmlForWebflow("# Title\n\n## Section\n\nText with **bold**.");
    expect(html).toContain("<h2>Section</h2>");
    expect(html).toContain("<strong>bold</strong>");
    expect(html).not.toContain("<h1>");
  });

  it("turns code blocks, which Webflow's API empties, into inline code", () => {
    const html = bodyHtmlForWebflow("Run:\n\n```bash\nnpm install\nnpm run dev\n```");
    expect(html).not.toContain("<pre>");
    expect(html).toContain("<p><code>npm install</code><br><code>npm run dev</code></p>");
  });
});
