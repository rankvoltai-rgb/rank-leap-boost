import { describe, expect, it } from "vitest";
import { composeLiveUrl, normalizeBlogPath, sameSite } from "./live-url";

describe("normalizeBlogPath", () => {
  it("accepts the /blog/:slug form shown in the product's own mockup", () => {
    expect(normalizeBlogPath("/blog/:slug")).toBe("/blog");
  });

  it("adds a leading slash and strips a trailing one", () => {
    expect(normalizeBlogPath("blog")).toBe("/blog");
    expect(normalizeBlogPath("/blog/")).toBe("/blog");
  });

  it("defaults when empty", () => {
    expect(normalizeBlogPath("")).toBe("/blog");
    expect(normalizeBlogPath(null)).toBe("/blog");
    expect(normalizeBlogPath("   ")).toBe("/blog");
  });

  it("keeps a nested path", () => {
    expect(normalizeBlogPath("/resources/articles/")).toBe("/resources/articles");
  });

  it("takes just the path when given a full URL", () => {
    expect(normalizeBlogPath("https://brightloop.app/blog/")).toBe("/blog");
  });
});

describe("composeLiveUrl", () => {
  it("joins origin, path and slug", () => {
    expect(composeLiveUrl("https://brightloop.app", "/blog", "pricing")).toBe(
      "https://brightloop.app/blog/pricing",
    );
  });

  it("tolerates trailing and leading slashes", () => {
    expect(composeLiveUrl("https://brightloop.app/", "/blog/", "/pricing")).toBe(
      "https://brightloop.app/blog/pricing",
    );
  });

  it("preserves a base path already in the production URL", () => {
    expect(composeLiveUrl("https://example.com/site", "/blog", "pricing")).toBe(
      "https://example.com/site/blog/pricing",
    );
  });

  it("returns null without a usable origin or slug", () => {
    expect(composeLiveUrl("", "/blog", "pricing")).toBeNull();
    expect(composeLiveUrl("not a url", "/blog", "pricing")).toBeNull();
    expect(composeLiveUrl("https://brightloop.app", "/blog", "")).toBeNull();
  });
});

describe("sameSite", () => {
  it("ignores www and scheme, like the API's own check", () => {
    expect(sameSite("https://www.brightloop.app", "brightloop.app")).toBe(true);
  });

  it("accepts subdomains", () => {
    expect(sameSite("https://blog.brightloop.app/x", "brightloop.app")).toBe(true);
  });

  // The most likely support ticket: a project still on its Framer domain.
  it("rejects a Framer staging host against a real domain", () => {
    expect(sameSite("https://brightloop.framer.website", "brightloop.app")).toBe(false);
  });

  it("is false when either side is missing", () => {
    expect(sameSite(null, "brightloop.app")).toBe(false);
    expect(sameSite("https://brightloop.app", "")).toBe(false);
  });
});
