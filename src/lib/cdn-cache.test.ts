import { readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { BLOG_SCHEDULE } from "@/data/blog-schedule";
import { cdnCacheControl, isCacheablePath, withCdnCache } from "@/lib/cdn-cache";

const NOW = new Date("2026-10-21T18:00:00Z");

/** Top-level routes that depend on who's asking, so the CDN must never keep them. */
const PRIVATE_SECTIONS = ["auth", "mcp", "oauth", "onboarding", "shopify"];

describe("isCacheablePath", () => {
  it("caches public pages, their markdown and the crawler files", () => {
    for (const path of [
      "/",
      "/pricing",
      "/glossary/answer-engine",
      "/docs.md",
      "/docs/getting-started/quickstart.md",
      "/docs/llms.txt",
      "/sitemap.xml",
      "/llms.txt",
      "/changelog/rss.xml",
    ]) {
      expect(isCacheablePath(path, NOW), path).toBe(true);
    }
  });

  it("never caches signed-in pages, the API, server functions or the lab", () => {
    for (const path of [
      "/dashboard",
      "/dashboard/settings",
      "/api/public/v1/articles",
      "/_serverFn/abc",
      "/auth",
      "/onboarding",
      "/oauth/consent",
      "/shopify",
      "/mcp",
      "/lab/render/a",
      "/.well-known/oauth-protected-resource",
    ]) {
      expect(isCacheablePath(path, NOW), path).toBe(false);
    }
  });

  it("leaves blog posts uncached for their first 28 days, for lab experiment B6", () => {
    const [slug, live] = Object.entries(BLOG_SCHEDULE)[0];
    const day = (offset: number) => new Date(Date.parse(live) + offset * 86_400_000);
    expect(isCacheablePath(`/blog/${slug}`, day(0))).toBe(false);
    expect(isCacheablePath(`/blog/${slug}`, day(27))).toBe(false);
    expect(isCacheablePath(`/blog/${slug}`, day(28))).toBe(true);
    expect(isCacheablePath("/blog/a-post-from-before-the-scheduler", NOW)).toBe(true);
  });

  it("has a decision for every top-level route", () => {
    const routes = readdirSync("src/routes").filter(
      (name) =>
        !name.startsWith("_") && !name.startsWith("[") && !name.endsWith(".md") && name !== "api",
    );
    for (const name of routes) {
      const section = /^[a-z0-9-]+(?:\[\.\][a-z]+)?/.exec(name)![0].replace("[.]", ".");
      const path = section === "index" ? "/" : `/${section}`;
      const decided = isCacheablePath(path, NOW) || PRIVATE_SECTIONS.includes(section);
      expect(
        decided,
        `${name}: add it to PUBLIC_SECTIONS in cdn-cache.ts or PRIVATE_SECTIONS here`,
      ).toBe(true);
    }
  });
});

describe("cdnCacheControl", () => {
  it("stays fresh until the next 00:00 UTC, when scheduled posts go live", () => {
    expect(cdnCacheControl(NOW)).toBe("max-age=21600, stale-while-revalidate=86400");
  });

  it("never asks for less than a minute", () => {
    expect(cdnCacheControl(new Date("2026-10-21T23:59:59.500Z"))).toMatch(/^max-age=60,/);
  });
});

describe("withCdnCache", () => {
  const page = (init?: ResponseInit) =>
    new Response("<html></html>", {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
      ...init,
    });
  const cdn = (response: Response) => response.headers.get("vercel-cdn-cache-control");

  it("marks a public page for the CDN and keeps the rest of the response", async () => {
    const response = withCdnCache(new Request("https://rankbox.xyz/pricing"), page(), NOW);
    expect(cdn(response)).toBe(cdnCacheControl(NOW));
    expect(response.headers.get("content-type")).toBe("text/html; charset=utf-8");
    expect(await response.text()).toBe("<html></html>");
  });

  it("leaves anything else alone", () => {
    const url = "https://rankbox.xyz/pricing";
    expect(cdn(withCdnCache(new Request(url, { method: "POST" }), page(), NOW))).toBeNull();
    expect(cdn(withCdnCache(new Request(url), page({ status: 500 }), NOW))).toBeNull();
    expect(
      cdn(withCdnCache(new Request(url), page({ headers: { "set-cookie": "a=1" } }), NOW)),
    ).toBeNull();
    expect(
      cdn(withCdnCache(new Request(url), page({ headers: { "cache-control": "no-store" } }), NOW)),
    ).toBeNull();
    expect(cdn(withCdnCache(new Request("https://rankbox.xyz/dashboard"), page(), NOW))).toBeNull();
  });
});
