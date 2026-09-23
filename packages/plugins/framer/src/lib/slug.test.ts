import { describe, expect, it } from "vitest";
import { dedupeSlugs, resolveSlug, sanitizeSlug } from "./slug";

describe("sanitizeSlug", () => {
  it("lowercases and hyphenates", () => {
    expect(sanitizeSlug("How to Price a SaaS Product")).toBe("how-to-price-a-saas-product");
  });

  it("folds accents rather than dropping the letters", () => {
    expect(sanitizeSlug("Café Culture")).toBe("cafe-culture");
  });

  it("collapses runs and trims edge hyphens", () => {
    expect(sanitizeSlug("  --Hello___World!!  ")).toBe("hello-world");
  });

  it("caps length without leaving a trailing hyphen", () => {
    const slug = sanitizeSlug("a".repeat(120));
    expect(slug.length).toBeLessThanOrEqual(100);
    expect(slug.endsWith("-")).toBe(false);
  });

  it("falls back to the article id when nothing survives", () => {
    expect(sanitizeSlug("!!!", "abcdef1234")).toBe("article-abcdef12");
    expect(sanitizeSlug("", "")).toBe("article");
  });
});

describe("resolveSlug", () => {
  // Rankbox derives slugs from the title, so retitling changes the slug.
  // Rewriting a live page's URL would break it and invalidate the
  // published_url already reported to the backlink exchange.
  it("keeps the slug an item was created with by default", () => {
    expect(resolveSlug("new-title-a1b2", "old-title-a1b2", false, "a1")).toBe("old-title-a1b2");
  });

  it("follows the rename when the user opts in", () => {
    expect(resolveSlug("new-title-a1b2", "old-title-a1b2", true, "a1")).toBe("new-title-a1b2");
  });

  it("sanitizes a first-time slug", () => {
    expect(resolveSlug("New Title", undefined, false, "a1")).toBe("new-title");
  });
});

describe("dedupeSlugs", () => {
  it("leaves unique slugs alone", () => {
    expect(dedupeSlugs(["a", "b"])).toEqual(["a", "b"]);
  });

  it("suffixes duplicates so one clash can't reject the whole batch", () => {
    expect(dedupeSlugs(["post", "post", "post"])).toEqual(["post", "post-2", "post-3"]);
  });

  it("keeps a deduped slug within the length cap", () => {
    const long = "x".repeat(100);
    const [, second] = dedupeSlugs([long, long]);
    expect(second.length).toBeLessThanOrEqual(100);
    expect(second.endsWith("-2")).toBe(true);
  });
});
