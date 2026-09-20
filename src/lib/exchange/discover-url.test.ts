import { describe, expect, it } from "vitest";
import { matchArticleUrl, parseSitemap } from "./discover-url.server";

const ID = "a1b2c3d4-0000-4000-8000-000000000000";
const TITLE = "How to Run Sprint Planning for Remote Teams";

describe("parseSitemap", () => {
  it("reads a urlset, with CDATA and entities", () => {
    const xml = `<?xml version="1.0"?><urlset>
      <url><loc>https://ex.com/a</loc><lastmod>2026-01-01</lastmod></url>
      <url><loc><![CDATA[https://ex.com/b?x=1&y=2]]></loc></url>
      <url><loc> https://ex.com/c?x=1&amp;y=2 </loc></url></urlset>`;
    expect(parseSitemap(xml)).toEqual({
      urls: ["https://ex.com/a", "https://ex.com/b?x=1&y=2", "https://ex.com/c?x=1&y=2"],
      sitemaps: [],
    });
  });
  it("reads a sitemap index", () => {
    const xml = `<sitemapindex><sitemap><loc>https://ex.com/post-sitemap.xml</loc></sitemap><sitemap><loc>https://ex.com/page-sitemap.xml</loc></sitemap></sitemapindex>`;
    expect(parseSitemap(xml).sitemaps).toEqual([
      "https://ex.com/post-sitemap.xml",
      "https://ex.com/page-sitemap.xml",
    ]);
  });
});

describe("matchArticleUrl", () => {
  const others = [
    "https://ex.com/",
    "https://ex.com/blog",
    "https://ex.com/blog/kanban-basics",
    "https://ex.com/pricing",
  ];
  it("matches the plugin's exact slug", () => {
    const url = "https://ex.com/blog/how-to-run-sprint-planning-for-remote-teams-a1b2c3d4/";
    expect(matchArticleUrl([...others, url], TITLE, ID)).toBe(url);
  });
  it("matches by id suffix when the CMS rewrote the slug", () => {
    const url = "https://ex.com/posts/sprint-planning-a1b2c3d4";
    expect(matchArticleUrl([...others, url], TITLE, ID)).toBe(url);
  });
  it("matches the bare title slug", () => {
    const url = "https://ex.com/blog/how-to-run-sprint-planning-for-remote-teams.html";
    expect(matchArticleUrl([...others, url], TITLE, ID)).toBe(url);
  });
  it("matches a close title", () => {
    const url = "https://ex.com/blog/run-sprint-planning-remote-teams";
    expect(matchArticleUrl([...others, url], TITLE, ID)).toBe(url);
  });
  it("refuses to guess between two equally good pages", () => {
    const a = "https://ex.com/blog/run-sprint-planning-remote-teams";
    const b = "https://ex.com/archive/run-sprint-planning-remote-teams";
    expect(matchArticleUrl([...others, a, b], TITLE, ID)).toBeNull();
  });
  it("returns null when nothing fits", () => {
    expect(matchArticleUrl(others, TITLE, ID)).toBeNull();
    expect(matchArticleUrl([], TITLE, ID)).toBeNull();
  });
});
