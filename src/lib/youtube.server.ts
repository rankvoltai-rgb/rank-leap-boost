/**
 * Finds a YouTube video to embed in a generated article.
 *
 * Two paths, in order:
 *
 *   1. The YouTube Data API, when YOUTUBE_API_KEY is set. Filtered to videos
 *      that are actually embeddable, so the article never ships a dead frame.
 *   2. A plain search-results scrape. YouTube ships its results as a JSON blob
 *      (`ytInitialData`) inside the page, so no key is needed — quality is the
 *      same first result, it is simply more fragile.
 *
 * Returns null rather than throwing: an article without a video is fine, a
 * failed article is not.
 */
import { safeFetchText } from "./safe-fetch.server";

export interface ArticleVideo {
  /** The 11-character YouTube id. */
  id: string;
  title: string;
  channel: string;
  url: string;
}

/** A browser UA: YouTube serves a cut-down page to unknown bots. */
const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36";

const ID_PATTERN = /^[\w-]{11}$/;

/**
 * Titles that read as an ad rather than an explanation.
 *
 * A generated article is a customer's own page, so a deal-of-the-week video —
 * usually for a rival product — is the wrong thing to embed in it. Rejecting
 * the obvious cases costs nothing; the search simply moves to the next result.
 */
const PROMOTIONAL =
  /\b(lifetime deal|appsumo|coupon|promo code|discount code|giveaway|black friday|sponsored|affiliate|my link|link in (?:the )?(?:bio|description))\b/i;

function isUsable(title: string): boolean {
  return !PROMOTIONAL.test(title);
}

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

function toVideo(id: string, title: string, channel: string): ArticleVideo | null {
  if (!ID_PATTERN.test(id)) return null;
  return {
    id,
    title: title || "Related video",
    channel,
    url: `https://www.youtube.com/watch?v=${id}`,
  };
}

async function viaApi(query: string, apiKey: string): Promise<ArticleVideo | null> {
  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.search = new URLSearchParams({
    key: apiKey,
    part: "snippet",
    q: query,
    type: "video",
    videoEmbeddable: "true",
    safeSearch: "strict",
    maxResults: "3",
    order: "relevance",
  }).toString();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      items?: Array<{
        id?: { videoId?: string };
        snippet?: { title?: string; channelTitle?: string };
      }>;
    };
    for (const item of json.items ?? []) {
      const title = clean(item.snippet?.title, 140);
      if (!isUsable(title)) continue;
      const video = toVideo(
        clean(item.id?.videoId, 20),
        title,
        clean(item.snippet?.channelTitle, 80),
      );
      if (video) return video;
    }
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** The first plain video in YouTube's own results JSON — ads and shelves skipped. */
function firstVideoRenderer(html: string): ArticleVideo | null {
  const start = html.indexOf("ytInitialData");
  const scope = start >= 0 ? html.slice(start) : html;
  // Each result is a videoRenderer object; take them in page order.
  for (const match of scope.matchAll(/"videoRenderer":\{(.{0,4000}?)"trackingParams"/gs)) {
    const block = match[1];
    const id = block.match(/"videoId":"([\w-]{11})"/)?.[1] ?? "";
    const title =
      block.match(/"title":\{"runs":\[\{"text":"((?:[^"\\]|\\.)*)"/)?.[1] ??
      block.match(/"title":\{"simpleText":"((?:[^"\\]|\\.)*)"/)?.[1] ??
      "";
    const channel = block.match(/"ownerText":\{"runs":\[\{"text":"((?:[^"\\]|\\.)*)"/)?.[1] ?? "";
    // Shorts are a poor fit inside a long-form article.
    if (/"navigationEndpoint".{0,200}\/shorts\//s.test(block)) continue;
    const decode = (raw: string) => {
      try {
        return JSON.parse(`"${raw}"`) as string;
      } catch {
        return raw;
      }
    };
    const cleanTitle = clean(decode(title), 140);
    if (!isUsable(cleanTitle)) continue;
    const video = toVideo(id, cleanTitle, clean(decode(channel), 80));
    if (video) return video;
  }
  return null;
}

async function viaScrape(query: string): Promise<ArticleVideo | null> {
  try {
    const res = await safeFetchText(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=EgIQAQ%253D%253D`,
      {
        timeoutMs: 12_000,
        // The results JSON sits well into the document.
        maxBytes: 3_000_000,
        userAgent: BROWSER_UA,
        accept: "text/html",
      },
    );
    if (res.status < 200 || res.status >= 300) return null;
    return firstVideoRenderer(res.body);
  } catch {
    return null;
  }
}

/**
 * A video for `topic`, or null when nothing usable was found.
 *
 * `sp=EgIQAQ%3D%3D` restricts the scrape to videos, matching the API's
 * `type=video`, so playlists and channels never come back.
 */
export async function findArticleVideo(topic: string): Promise<ArticleVideo | null> {
  const query = topic.trim();
  if (!query) return null;
  const apiKey = process.env.YOUTUBE_API_KEY?.trim();
  if (apiKey) {
    const fromApi = await viaApi(query, apiKey);
    if (fromApi) return fromApi;
  }
  return viaScrape(query);
}

/**
 * The embed block, as markdown with an inline iframe.
 *
 * The iframe is what renders on a site that allows HTML (most CMSs, and the
 * editor via its YouTube extension); the link beneath it is what survives a
 * renderer that strips HTML, so the reference is never lost either way.
 */
export function videoEmbedMarkdown(video: ArticleVideo): string {
  const title = video.title.replace(/"/g, "'");
  return [
    `## Watch: ${video.title}`,
    "",
    `<iframe width="560" height="315" src="https://www.youtube.com/embed/${video.id}" title="${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`,
    "",
    `[${video.title}](${video.url})${video.channel ? ` — ${video.channel}` : ""}`,
  ].join("\n");
}

/**
 * Places the embed after the article's opening section.
 *
 * The lead answers the query — the part AI engines quote — so the video goes
 * below it, before the second heading, rather than pushing the answer down.
 */
export function insertVideo(body: string, video: ArticleVideo): string {
  const block = videoEmbedMarkdown(video);
  if (body.includes(`youtube.com/embed/${video.id}`)) return body;

  const headings = [...body.matchAll(/^##\s+.+$/gm)];
  // Second H2 when the article has one; otherwise append.
  const anchor = headings[1]?.index;
  if (anchor === undefined) return `${body.trimEnd()}\n\n${block}\n`;
  return `${body.slice(0, anchor).trimEnd()}\n\n${block}\n\n${body.slice(anchor)}`;
}
