import { existsSync, readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { markdownToBlocks } from "@/lib/markdown-blocks";
import { BLOG_VIDEOS, isoDuration } from "./blog-videos";

const BLOG_DIR = "src/content/blog";
const PLACED = /!\[([^\]]*)\]\(youtube:([^\s)]+)/g;

describe("blog videos", () => {
  for (const [id, video] of Object.entries(BLOG_VIDEOS)) {
    describe(id, () => {
      const file = `${BLOG_DIR}/${video.post}.md`;

      it("is a well-formed YouTube id with its watch-page details", () => {
        expect(id).toMatch(/^[A-Za-z0-9_-]{11}$/);
        expect(video.uploadDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
        expect(video.seconds).toBeGreaterThan(0);
        expect(video.channel).not.toBe("");
        expect(video.summary.length).toBeGreaterThan(20);
      });

      it("is placed exactly once by its post, under its YouTube title", () => {
        expect(existsSync(file), file).toBe(true);
        const placed = [...readFileSync(file, "utf8").matchAll(PLACED)].filter((m) => m[2] === id);
        expect(placed.length).toBe(1);
        expect(placed[0][1]).toBe(video.title);
      });
    });
  }

  it("only places videos that are in the registry", () => {
    for (const f of readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"))) {
      for (const m of readFileSync(`${BLOG_DIR}/${f}`, "utf8").matchAll(PLACED)) {
        expect(BLOG_VIDEOS[m[2]], `${f} places youtube:${m[2]}`).toBeDefined();
        expect(BLOG_VIDEOS[m[2]].post).toBe(f.replace(/\.md$/, ""));
      }
    }
  });

  it("parses into a YouTube video block", () => {
    const [block] = markdownToBlocks('![A title](youtube:dQw4w9WgXcQ "A caption")');
    expect(block).toMatchObject({
      type: "video",
      embedKind: "youtube",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      alt: "A title",
      caption: [{ text: "A caption" }],
    });
  });

  it("writes schema.org durations", () => {
    expect(isoDuration(754)).toBe("PT12M34S");
    expect(isoDuration(3600)).toBe("PT1H");
    expect(isoDuration(3725)).toBe("PT1H2M5S");
    expect(isoDuration(45)).toBe("PT45S");
  });
});
