/**
 * The YouTube videos embedded in blog posts, placed with
 * `![title](youtube:<video id> "caption")`.
 *
 * Every entry was looked up on YouTube on `VIDEOS_CHECKED`: the id resolves
 * through YouTube's oEmbed endpoint (so it exists and allows embedding), and
 * the title, channel, upload date and length are copied from the watch page,
 * never typed from memory. The post's own `![title]` must match `title`.
 * blog-videos.test.ts checks each video is placed exactly once, by its post.
 *
 * The same fields feed the VideoObject markup on the post's page.
 * Re-check quarterly: videos get deleted, made private or lose embedding.
 */

export interface BlogVideo {
  /** Slug of the one post that embeds it. */
  post: string;
  /** Exact title on YouTube. */
  title: string;
  /** Channel name on YouTube. */
  channel: string;
  /** ISO 8601 with offset, as the watch page gives it. */
  uploadDate: string;
  /** Length in seconds, from the watch page. */
  seconds: number;
  /** One sentence on what it covers, taken from the video's own description. */
  summary: string;
}

export const VIDEOS_CHECKED = "2026-09-28";

export const BLOG_VIDEOS: Record<string, BlogVideo> = {
  sq55KB5icQ4: {
    post: "how-to-show-up-in-google-ai-overviews",
    title: "Google Search Gen AI Reports, Search Profiles & more  (Q2 ‘26)",
    channel: "Google Search Central",
    uploadDate: "2026-06-18T07:00:40-07:00",
    seconds: 388,
    summary:
      "John Mueller covers the launch of generative AI performance reporting in Search Console and a new control over how a site's content grounds AI Overviews and AI Mode.",
  },
  "26znNsMTUiw": {
    post: "how-to-measure-ai-referral-traffic-in-ga4",
    title: "How to Report on AI Traffic in GA4 (Including ChatGPT, Gemini & Copilot)",
    channel: "Loves Data",
    uploadDate: "2025-08-19T04:01:53-07:00",
    seconds: 509,
    summary:
      "A step-by-step GA4 tutorial: filter AI traffic by session source in explorations and standard reports, then configure a custom AI Chatbots channel group.",
  },
  Gs7_8euEIh8: {
    post: "bing-webmaster-tools-ai-indexing-guide",
    title: "Bing Webmaster Tools Releases AI Search Performance Data - Krishna Madhavan  - Inside SEO Week",
    channel: "iPullRank",
    uploadDate: "2026-02-13T02:00:33-08:00",
    seconds: 1113,
    summary:
      "Garrett Sussman talks with Krishna Madhavan, Principal Product Manager at Microsoft, about Bing Webmaster Tools' new AI performance reports, grounded queries and crawl efficiency.",
  },
  PLyCki2K0Lg: {
    post: "mcp-protocol-new-sitemap",
    title: "Why we built—and donated—the Model Context Protocol (MCP)",
    channel: "Anthropic",
    uploadDate: "2025-12-11T12:14:58-08:00",
    seconds: 2132,
    summary:
      "Anthropic's Stuart Ritchie talks with MCP co-creator David Soria Parra about building the Model Context Protocol and donating it to the Linux Foundation.",
  },
  wjZofJX0v4M: {
    post: "vector-distance-vs-keyword-density",
    title: "Transformers, the tech behind LLMs | Deep Learning Chapter 5",
    channel: "3Blue1Brown",
    uploadDate: "2024-04-01T12:13:57-07:00",
    seconds: 1634,
    summary:
      "A visual breakdown of how large language models work, including word embeddings, where directions in the vector space carry meaning.",
  },
};

/** ISO 8601 duration for schema.org, e.g. 754 -> "PT12M34S". */
export function isoDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s || (!h && !m) ? `${s}S` : ""}`;
}
