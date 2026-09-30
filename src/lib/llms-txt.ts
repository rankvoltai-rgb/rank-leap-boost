import { blogSlugOf, isBlogPathLive } from "@/lib/blog-release";

/**
 * llms.txt without the lines for blog posts that are still scheduled, so a
 * post's line appears on the day it goes live (see blog-release.ts).
 */
export function liveLlmsTxt(text: string, today?: string, preview?: boolean): string {
  return text
    .split("\n")
    .filter((line) => {
      const url = /\]\((https:\/\/rankbox\.xyz\/blog\/[^)\s]+)\)/.exec(line)?.[1];
      return !url || !blogSlugOf(url) || isBlogPathLive(url, today, preview);
    })
    .join("\n");
}
