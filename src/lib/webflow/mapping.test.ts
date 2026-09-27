import { describe, expect, it } from "vitest";
import { composeLiveUrl, pickDomain, sameSite } from "./live-url";
import { contentHash, formatTags, toFieldData, webflowSlug, withSuffix } from "./mapping";

const ARTICLE = {
  id: "0f3c2a9e-1111-2222-3333-444455556666",
  title: "What Is a Design System, Really?",
  slug: "what-is-a-design-system-really-0f3c2a9e",
  description: "A plain answer, with <examples>.",
  body_html: "<h2>Start here</h2><p>Body.</p>",
  tags: [" design ", "systems", ""],
  published_at: "2026-09-27T10:00:00.000Z",
};

const MAP = { body: "post-body", summary: "post-summary", tags: "tags", publishedAt: null };

describe("toFieldData", () => {
  it("fills name, slug and only the mapped fields", () => {
    expect(toFieldData(ARTICLE, MAP, "my-slug")).toEqual({
      name: "What Is a Design System, Really?",
      slug: "my-slug",
      "post-body": "<h2>Start here</h2><p>Body.</p>",
      "post-summary": "A plain answer, with <examples>.",
      tags: "design, systems",
    });
  });

  it("wraps and escapes the summary for a rich text field", () => {
    const data = toFieldData(ARTICLE, MAP, "s", true);
    expect(data["post-summary"]).toBe("<p>A plain answer, with &lt;examples&gt;.</p>");
  });

  it("writes the date when a date field is mapped", () => {
    const data = toFieldData(ARTICLE, { ...MAP, publishedAt: "date" }, "s");
    expect(data.date).toBe("2026-09-27T10:00:00.000Z");
  });

  it("never sends an empty name, which Webflow rejects", () => {
    expect(toFieldData({ ...ARTICLE, title: "  " }, MAP, "s").name).toBe("Untitled");
  });
});

describe("contentHash", () => {
  it("ignores key order", () => {
    expect(contentHash({ a: 1, b: "x" })).toBe(contentHash({ b: "x", a: 1 }));
  });

  it("changes when written content changes", () => {
    const a = toFieldData(ARTICLE, MAP, "s");
    const b = toFieldData({ ...ARTICLE, body_html: "<p>Edited.</p>" }, MAP, "s");
    expect(contentHash(a)).not.toBe(contentHash(b));
  });

  it("does not change for fields that aren't written", () => {
    const a = toFieldData(ARTICLE, MAP, "s");
    const b = toFieldData({ ...ARTICLE, published_at: "2030-01-01T00:00:00.000Z" }, MAP, "s");
    expect(contentHash(a)).toBe(contentHash(b));
  });
});

describe("slugs", () => {
  it("makes Webflow-safe slugs", () => {
    expect(webflowSlug("Café Ünïcode — Guide!")).toBe("cafe-unicode-guide");
    expect(webflowSlug("   ", "ABCDEF123")).toBe("article-abcdef12");
  });

  it("caps length without a trailing hyphen", () => {
    const slug = webflowSlug(`${"a".repeat(99)} b`);
    expect(slug.length).toBeLessThanOrEqual(100);
    expect(slug.endsWith("-")).toBe(false);
  });

  it("suffixes within the length cap", () => {
    expect(withSuffix("post", 2)).toBe("post-2");
    expect(withSuffix("a".repeat(100), 3)).toHaveLength(100);
  });

  it("formats tags", () => {
    expect(formatTags(null)).toBe("");
    expect(formatTags(["a", " b "])).toBe("a, b");
  });
});

describe("live URLs", () => {
  const site = {
    shortName: "loomwise",
    customDomains: [{ url: "loomwise.io" }, { url: "www.loomwise.io" }],
  };

  it("prefers the custom domain the Rankbox site uses", () => {
    expect(pickDomain(site, "https://www.loomwise.io")).toBe("www.loomwise.io");
    expect(pickDomain(site, "https://loomwise.io/")).toBe("loomwise.io");
  });

  it("falls back to the first custom domain, then webflow.io", () => {
    expect(pickDomain(site, "https://elsewhere.com")).toBe("loomwise.io");
    expect(pickDomain({ shortName: "Loomwise", customDomains: [] }, null)).toBe(
      "loomwise.webflow.io",
    );
    expect(pickDomain({}, null)).toBeNull();
  });

  it("composes collection/item paths", () => {
    expect(composeLiveUrl("loomwise.io", "/blog/", "my-post")).toBe(
      "https://loomwise.io/blog/my-post",
    );
    expect(composeLiveUrl(null, "blog", "x")).toBeNull();
  });

  it("compares sites like the public API", () => {
    expect(sameSite("www.loomwise.io", "https://loomwise.io")).toBe(true);
    expect(sameSite("blog.loomwise.io", "loomwise.io")).toBe(true);
    expect(sameSite("loomwise.webflow.io", "loomwise.io")).toBe(false);
  });
});
