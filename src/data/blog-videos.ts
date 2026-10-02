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

export const VIDEOS_CHECKED = "2026-10-01";

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
    title:
      "Bing Webmaster Tools Releases AI Search Performance Data - Krishna Madhavan  - Inside SEO Week",
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
  "T-D1OfcDW1M": {
    post: "how-does-rag-reduce-hallucinations",
    title: "What is Retrieval-Augmented Generation (RAG)?",
    channel: "IBM Technology",
    uploadDate: "2023-08-23T04:00:32-07:00",
    seconds: 395,
    summary:
      "IBM Senior Research Scientist Marina Danilevsky explains the LLM/RAG framework and how it gives a model up-to-date, trustworthy facts and a source it can point to.",
  },
  "mmQl6VGvX-c": {
    post: "knowledge-graph-for-ai",
    title: "Introducing the Knowledge Graph",
    channel: "Google",
    uploadDate: "2012-05-16T10:03:40-07:00",
    seconds: 164,
    summary:
      "Google introduces the Knowledge Graph, a huge collection of the people, places and things in the world and how they're connected to one another.",
  },
  ml7cQHkUc2Q: {
    post: "semantic-drift-ai-memory-reset",
    title: "How long to keep 301 redirects?",
    channel: "Google Search Central",
    uploadDate: "2021-12-02T06:00:20-08:00",
    seconds: 99,
    summary:
      "In an AskGooglebot episode, John Mueller covers what type of redirect to use and how long a site should keep a redirect after a site move.",
  },
  uhWFLmr7xao: {
    post: "synthetic-content-saturation-model-collapse",
    title: "What Is AI Model Collapse? Why AI Could Forget Reality",
    channel: "IBM Technology",
    uploadDate: "2026-08-06T04:00:37-07:00",
    seconds: 790,
    summary:
      "Meenakshi Kodati explains model collapse, why synthetic data can distort future AI systems, and how data quality, RAG and human-generated content keep AI grounded.",
  },
  _jjSS0qGFbI: {
    post: "claude-for-seo-audits",
    title: "Getting started with connectors in Claude.ai",
    channel: "Anthropic",
    uploadDate: "2025-12-11T09:07:09-08:00",
    seconds: 223,
    summary:
      "Anthropic shows how to set up connectors that give Claude access to your files, apps and workflows.",
  },
  "3QlY8ba0jYI": {
    post: "do-author-bios-help-seo",
    title: 'Will Google be evaluating the use of rel="author" moving forward?',
    channel: "Google Search Central",
    uploadDate: "2013-06-05T09:58:33-07:00",
    seconds: 121,
    summary:
      'A Webmaster Help answer on whether Google will evaluate rel="author" on pages that aren\'t articles, such as a home page or an about page.',
  },
  "DFkl-wmYvA8": {
    post: "shadow-training-data-audit",
    title: "An Inside Look at Common Crawl",
    channel: "TWiT Tech Podcast Network",
    uploadDate: "2025-08-28T10:00:30-07:00",
    seconds: 2568,
    summary:
      "On Intelligent Machines, Leo, Paris and Jeff talk to Rich Skrenta, the Executive Director of Common Crawl.",
  },
  _R04ySodhGE: {
    post: "google-ai-mode-vs-traditional-search",
    title: "How AI Is Changing Google Search and SEO",
    channel: "Google Search Central",
    uploadDate: "2026-05-01T02:40:10-07:00",
    seconds: 1991,
    summary:
      "On Search Off the Record, Martin speaks with Nikola Todorovic, director of Software Engineering at Google Search, about the evolution from traditional search to AI Overviews and AI Mode, and why queries are becoming more conversational.",
  },
  o4hH4ZQ_19k: {
    post: "content-freshness-seo",
    title: "Is freshness an important signal for all sites?",
    channel: "Google Search Central",
    uploadDate: "2012-10-01T11:55:54-07:00",
    seconds: 211,
    summary:
      "A Webmaster Help answer on how important freshness is as a signal, given that frequently updated pages can get a boost for queries that deserve freshness.",
  },
  "2PW5y3zAvPE": {
    post: "apple-intelligence-siri-chatgpt",
    title: "Apple’s next big step for Siri and iPhone",
    channel: "Apple",
    uploadDate: "2026-06-08T11:27:15-07:00",
    seconds: 96,
    summary:
      "Apple shows a more conversational Siri AI with natural language abilities that can edit and write emails, texts and documents, alongside new Image Playground features.",
  },
  "5ZA1lTxTH3c": {
    post: "indirect-prompt-injection-black-hat-geo",
    title: "Securing AI Agents: How to Prevent Hidden Prompt Injection Attacks",
    channel: "IBM Technology",
    uploadDate: "2026-01-10T04:00:11-08:00",
    seconds: 607,
    summary:
      "Jeff Crume and Martin Keen break down prompt injection attacks on AI agents, starting from an agent that bought the wrong book, and how to defend against them.",
  },
  WdbeqSQjZI8: {
    post: "what-is-multimodal-search",
    title: "Introducing a new way to search | Circle to Search",
    channel: "Google",
    uploadDate: "2024-01-17T10:12:57-08:00",
    seconds: 61,
    summary:
      "Circle to Search lets you search anything on an Android phone without switching apps, by circling, highlighting, scribbling or tapping what you're curious about.",
  },
  kQQbTYPt7VE: {
    post: "death-of-10-blue-links",
    title: "Search + Shopping | I/O 2026 Keynote",
    channel: "Google",
    uploadDate: "2026-05-22T11:59:28-07:00",
    seconds: 1388,
    summary:
      "The Google Search segment of the I/O 2026 keynote, introducing the era of Search agents that people can create, customize and manage for their tasks, right in Search.",
  },
  uXspbC2srEQ: {
    post: "agentic-seo-autonomous-ai-buyers",
    title: "Introducing dots, always-on agents built to handle everything.",
    channel: "OpenAI",
    uploadDate: "2026-09-29T11:04:41-07:00",
    seconds: 148,
    summary:
      "OpenAI's dots are always-on agents powered by GPT-6 Astra, with their own cloud computer, that connect to over 4,000 apps through plugins and work toward your goals around the clock.",
  },
  CrzUP6MmBW4: {
    post: "dynamic-rendering-seo",
    title: "Dynamic Rendering for JavaScript web apps - JavaScript SEO",
    channel: "Google Search Central",
    uploadDate: "2019-04-17T09:37:43-07:00",
    seconds: 200,
    summary:
      "In the JavaScript SEO series, Martin Splitt shows how to implement dynamic rendering, switching between client-side rendered and pre-rendered content.",
  },
  WDhruDqb5nM: {
    post: "edge-seo-for-ai-cloudflare-workers",
    title: "Cloudflare Workers Explained",
    channel: "Cloudflare Developers",
    uploadDate: "2026-06-23T07:15:35-07:00",
    seconds: 322,
    summary:
      "How Cloudflare Workers work and why they change backend architecture, compared with traditional Node.js and Express servers.",
  },
};

/** ISO 8601 duration for schema.org, e.g. 754 -> "PT12M34S". */
export function isoDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s || (!h && !m) ? `${s}S` : ""}`;
}
