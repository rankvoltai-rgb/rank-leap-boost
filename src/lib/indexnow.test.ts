import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { INDEXNOW_KEY, parseSitemap, pickChanged, type SitemapUrl } from "./indexnow.server";

const u = (path: string, lastmod: string | null = null): SitemapUrl => ({
  url: `https://rankbox.xyz${path}`,
  lastmod,
});

describe("parseSitemap", () => {
  it("reads loc and lastmod, and null when a page has no lastmod", () => {
    const xml = [
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
      `  <url>`,
      `    <loc>https://rankbox.xyz/</loc>`,
      `    <changefreq>weekly</changefreq>`,
      `  </url>`,
      `  <url>`,
      `    <loc>https://rankbox.xyz/blog/a</loc>`,
      `    <lastmod>2026-09-20</lastmod>`,
      `  </url>`,
      `</urlset>`,
    ].join("\n");
    expect(parseSitemap(xml)).toEqual([u("/"), u("/blog/a", "2026-09-20")]);
  });
});

describe("pickChanged", () => {
  it("submits everything on the first run", () => {
    const current = [u("/"), u("/blog/a", "2026-09-20")];
    expect(pickChanged(current, new Map())).toEqual(current);
  });

  it("submits new URLs and moved lastmods, and nothing already sent", () => {
    const sent = new Map<string, string | null>([
      [u("/").url, null],
      [u("/blog/a").url, "2026-09-20"],
      [u("/blog/b").url, "2026-09-20"],
    ]);
    const current = [u("/"), u("/blog/a", "2026-09-20"), u("/blog/b", "2026-09-27"), u("/blog/c")];
    expect(pickChanged(current, sent)).toEqual([u("/blog/b", "2026-09-27"), u("/blog/c")]);
  });

  it("doesn't resubmit a page whose lastmod disappeared", () => {
    const sent = new Map<string, string | null>([[u("/about").url, "2026-09-23"]]);
    expect(pickChanged([u("/about")], sent)).toEqual([]);
  });

  it("drops other hosts and repeats, which IndexNow or the upsert would reject", () => {
    const current = [
      u("/blog/a"),
      u("/blog/a"),
      { url: "https://rankvolt.top/blog/a", lastmod: null },
      { url: "https://rankbox.xyz.evil.com/", lastmod: null },
    ];
    expect(pickChanged(current, new Map())).toEqual([u("/blog/a")]);
  });
});

describe("key file", () => {
  it("is served from public/ with the key as its only content", () => {
    expect(INDEXNOW_KEY).toMatch(/^[a-zA-Z0-9-]{8,128}$/);
    expect(readFileSync(`public/${INDEXNOW_KEY}.txt`, "utf8")).toBe(INDEXNOW_KEY);
  });
});
