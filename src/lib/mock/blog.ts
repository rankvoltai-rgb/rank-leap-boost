/**
 * Blog posts for mock mode (VITE_MOCK_DATA=1), in place of the Notion database.
 *
 * Shapes match src/lib/notion.server.ts, and the blocks use only types
 * NotionBlocks renders, so /blog and /blog/$slug look as they will with real
 * content.
 */
import type { NotionBlock, PostFull, PostMeta } from "@/lib/notion.server";
import { countWords, readingMinutes } from "@/lib/article-outline";

let seq = 0;

function block(type: string, text: string, extra: Partial<NotionBlock> = {}): NotionBlock {
  seq += 1;
  return { id: `mock-block-${seq}`, type, richText: [{ text }], ...extra };
}

const p = (text: string) => block("paragraph", text);
const h2 = (text: string) => block("heading_2", text);
const li = (text: string) => block("bulleted_list_item", text);

const POSTS: PostFull[] = [
  {
    id: "mock-post-1",
    slug: "what-answer-engines-look-for",
    title: "What Answer Engines Look for in a Source",
    excerpt:
      "How answer engines choose the pages they quote — and the structure, clarity, and authority signals you can build this month.",
    date: "2026-09-02",
    cover: null,
    tags: ["AI Search"],
    author: "Rankbox Team",
    blocks: [
      p(
        "Answer engines don't rank pages the way classic search does. They pull short, quotable passages from sources they trust, then stitch those into an answer.",
      ),
      h2("What gets a page cited"),
      li("A direct, two-to-three sentence answer near the top of the page"),
      li("Clear headings that match the questions people actually ask"),
      li("Specific numbers, dates, and named sources"),
      block("callout", "Mock post — Notion content replaces this when mock mode is off.", {
        icon: "💡",
      }),
      h2("Where to start"),
      p(
        "Pick the five buying questions your customers ask most, and publish one focused page for each. Then keep them updated.",
      ),
    ],
  },
  {
    id: "mock-post-2",
    slug: "geo-vs-seo",
    title: "GEO vs SEO: What Actually Changes",
    excerpt:
      "Generative engine optimization builds on SEO rather than replacing it. Here's what carries over and what's new.",
    date: "2026-08-21",
    cover: null,
    tags: ["Strategy"],
    author: "Rankbox Team",
    blocks: [
      p("Most of what makes a page rank still matters. What changes is how the page gets used."),
      h2("What carries over"),
      li("Crawlable, fast pages"),
      li("Topical depth across a cluster of related articles"),
      li("Links from sites your audience already trusts"),
      block("quote", "Search sends a click. An answer engine sends a recommendation."),
      h2("What's new"),
      p(
        "Passages need to stand on their own. If a sentence only makes sense after reading the three before it, it's unlikely to be quoted.",
      ),
      block("divider", ""),
      p("Next: how to audit your existing pages for quotable passages."),
    ],
  },
  {
    id: "mock-post-3",
    slug: "publishing-cadence-for-small-teams",
    title: "The Publishing Cadence That Works for Small Teams",
    excerpt:
      "Daily sounds ambitious. For a team of three it's realistic — if the research and drafting are automated.",
    date: "2026-08-08",
    cover: null,
    tags: ["Playbooks"],
    author: "Rankbox Team",
    blocks: [
      p("Consistency beats volume. A steady cadence builds topical authority faster than bursts."),
      h2("A simple weekly rhythm"),
      block("numbered_list_item", "Monday: review which articles earned citations last week"),
      block("numbered_list_item", "Tuesday to Friday: publish one article a day from the queue"),
      block("numbered_list_item", "Friday: refresh one older article with new data"),
    ],
  },
];

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function listPosts(): Promise<{ posts: PostMeta[]; error: boolean }> {
  const posts = POSTS.map(({ blocks, ...meta }) => ({
    ...meta,
    readingMinutes: readingMinutes(countWords(blocks)),
  }));
  return delay({ posts, error: false });
}

export async function getPost(slug: string): Promise<{ post: PostFull | null; error: boolean }> {
  return delay({ post: POSTS.find((post) => post.slug === slug) ?? null, error: false });
}
