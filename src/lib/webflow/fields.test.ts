import { describe, expect, it } from "vitest";
import { checkFieldMap, parseFieldMap, suggestFieldMap, type WebflowField } from "./fields";

const f = (slug: string, type: string, extra: Partial<WebflowField> = {}): WebflowField => ({
  id: `id-${slug}`,
  slug,
  displayName: slug.replace(/-/g, " "),
  type,
  ...extra,
});

// Webflow's own "Blog Posts" starter collection.
const BLOG_TEMPLATE = [
  f("name", "PlainText", { isRequired: true }),
  f("slug", "PlainText", { isRequired: true }),
  f("post-body", "RichText"),
  f("post-summary", "PlainText"),
  f("main-image", "Image"),
  f("thumbnail-image", "Image"),
  f("featured", "Switch"),
];

describe("suggestFieldMap", () => {
  it("maps Webflow's blog template without help", () => {
    expect(suggestFieldMap(BLOG_TEMPLATE)).toEqual({
      body: "post-body",
      summary: "post-summary",
      tags: null,
      publishedAt: null,
    });
  });

  it("gives a lone rich text field to the body, even with an odd name", () => {
    const map = suggestFieldMap([
      f("name", "PlainText"),
      f("slug", "PlainText"),
      f("words", "RichText"),
    ]);
    expect(map.body).toBe("words");
  });

  it("never uses one field for two roles", () => {
    const map = suggestFieldMap([f("description", "RichText")]);
    expect(map.body).toBe("description");
    expect(map.summary).toBeNull();
  });

  it("does not guess optional roles from unrelated fields", () => {
    const map = suggestFieldMap([f("content", "RichText"), f("author-bio", "PlainText")]);
    expect(map.summary).toBeNull();
    expect(map.tags).toBeNull();
  });

  it("never offers the built-in name or slug", () => {
    const map = suggestFieldMap([
      f("name", "PlainText"),
      f("slug", "PlainText"),
      f("body", "RichText"),
    ]);
    expect(Object.values(map)).not.toContain("name");
    expect(Object.values(map)).not.toContain("slug");
  });

  it("picks a date field for the published date", () => {
    const map = suggestFieldMap([f("body", "RichText"), f("published-date", "DateTime")]);
    expect(map.publishedAt).toBe("published-date");
  });
});

describe("checkFieldMap", () => {
  it("accepts the suggested map for the blog template", () => {
    expect(checkFieldMap(BLOG_TEMPLATE, suggestFieldMap(BLOG_TEMPLATE))).toEqual({
      ok: true,
      problems: [],
    });
  });

  it("requires a body", () => {
    const check = checkFieldMap(BLOG_TEMPLATE, { body: null });
    expect(check.ok).toBe(false);
    expect(check.problems[0]).toMatch(/article body/);
  });

  it("rejects a field of the wrong type", () => {
    const check = checkFieldMap(BLOG_TEMPLATE, { body: "post-summary" });
    expect(check.ok).toBe(false);
  });

  it("rejects a field that has since been deleted", () => {
    const check = checkFieldMap(BLOG_TEMPLATE, { body: "gone" });
    expect(check.problems[0]).toMatch(/no longer in this collection/);
  });

  it("rejects one field chosen twice", () => {
    const fields = [f("body", "RichText"), f("summary", "RichText")];
    const check = checkFieldMap(fields, { body: "body", summary: "body" });
    expect(check.ok).toBe(false);
    expect(check.problems[0]).toMatch(/both/);
  });

  it("flags a required field Rankbox can't fill, since every publish would fail", () => {
    const fields = [
      ...BLOG_TEMPLATE,
      f("author", "Reference", { isRequired: true, displayName: "Author" }),
    ];
    const check = checkFieldMap(fields, suggestFieldMap(fields));
    expect(check.ok).toBe(false);
    expect(check.problems.join(" ")).toMatch(/requires "Author"/);
  });
});

describe("parseFieldMap", () => {
  it("drops unknown keys and blank values", () => {
    expect(parseFieldMap({ body: "post-body", summary: "  ", nope: "x" })).toEqual({
      body: "post-body",
      summary: null,
      tags: null,
      publishedAt: null,
    });
  });

  it("survives garbage", () => {
    expect(parseFieldMap(null).body).toBeNull();
    expect(parseFieldMap("x").body).toBeNull();
  });
});
