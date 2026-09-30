/**
 * The blog schedule: scripts/blog-schedule.ts gives each new post a go-live
 * date, and src/lib/blog-release.ts keeps it off the site until then.
 *
 * Every post that wasn't already live when the scheduler started has to carry
 * a scheduled date that keeps to src/data/blog-cadence.ts. If this fails
 * after writing posts, run `npm run blog:schedule`.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { parseFrontmatter } from "@/lib/markdown-blocks";
import { BLOG_SCHEDULE } from "@/data/blog-schedule";
import { CLUSTER_GAP_DAYS, MAX_PER_DAY, MAX_PER_WEEK, SCHEDULE_START } from "@/data/blog-cadence";
import { STANDALONES } from "@/content/standalones";
import { blogSlugOf, isBlogPathLive, isLive, todayUTC, unlinkPosts } from "@/lib/blog-release";
import { getHousePost, listHousePosts } from "@/lib/house-posts.server";
import { liveLlmsTxt } from "@/lib/llms-txt";
import { TOPICS, crossLinks } from "@/data/link-graph";
import LLMS_TXT from "@/content/llms.txt?raw";

const BLOG_DIR = "src/content/blog";
const RUN = "Run `npm run blog:schedule` to give it a date.";

/** The posts that were live before the scheduler started, on 2026-09-30. They keep their dates. */
const LIVE_BEFORE_SCHEDULE = new Set([
  "aeo-audit",
  "ai-bot-crawler-census",
  "ai-crawler-directory",
  "ai-search-content-refresh-calendar",
  "ai-search-intent-conversational-buyer-stages",
  "ai-search-optimization-tools",
  "ai-seo-checklist",
  "ai-seo-checklist-pre-publish-audit",
  "are-automated-blog-posts-effective-for-seo",
  "author-bio-seo",
  "bing-webmaster-tools-ai-indexing-guide",
  "brand-presence-in-perplexity",
  "byword-alternatives",
  "chatgpt-rank-tracker",
  "chatgpt-traffic-analysis",
  "cheap-seo",
  "claude-for-seo-audits",
  "claude-seo-tool",
  "cloudflare-blocking-chatgpt",
  "cloudflare-challenge-trap",
  "comparison-page-formula",
  "content-freshness-seo",
  "defensive-geo",
  "do-author-bios-help-ai-search-visibility",
  "do-author-bios-help-seo",
  "does-bing-webmaster-tools-help-google-indexing",
  "entity-authority-in-the-ai-era",
  "entity-authority-seo",
  "evaluate-geo-tool-before-purchasing",
  "fix-incorrect-brand-facts-in-ai-answers",
  "frase-alternatives",
  "freshness-factor-ai-search",
  "geo-metrics-framework",
  "geo-tools-list",
  "google-ai-mode-vs-traditional-search",
  "hallucination-by-omission-pricing-page",
  "how-ai-models-rank-brands-in-search-results",
  "how-ai-search-uses-user-intent-and-context",
  "how-does-ai-search-interpret-user-intent",
  "how-does-rag-reduce-hallucinations",
  "how-often-to-update-content-for-ai-seo",
  "how-search-intent-is-evolving-with-conversational-ai",
  "how-to-benchmark-ai-citations-against-competitors",
  "how-to-benchmark-ai-search-performance",
  "how-to-benchmark-website-performance-in-ai-search",
  "how-to-compare-generative-engine-optimization-software",
  "how-to-fix-incorrect-brand-facts-in-llm-citations",
  "how-to-get-cited-by-chatgpt",
  "how-to-get-indexed-by-llm-through-llms-txt",
  "how-to-get-indexed-by-llms-with-llms-txt",
  "how-to-measure-ai-referral-traffic-in-ga4",
  "how-to-measure-geo",
  "how-to-monitor-brand-mentions-in-ai-generated-responses",
  "how-to-optimize-content-for-llms",
  "how-to-rank-on-chatgpt",
  "how-to-see-if-ai-mentions-your-brand",
  "how-to-show-up-in-google-ai-overviews",
  "how-to-track-ai-referral-traffic-in-ga4",
  "how-to-track-brand-mentions-in-ai-search",
  "how-to-track-competitor-rankings-in-ai-search",
  "how-to-track-gptbot-and-claudebot",
  "how-to-use-bing-webmaster-tools-for-seo",
  "how-to-use-claude-for-seo-audits",
  "how-to-write-blog-posts-for-ai-citation",
  "is-it-possible-to-track-brand-mentions-in-ai-answers",
  "is-it-possible-to-track-brand-mentions-in-ai-search",
  "jasper-alternatives",
  "knowledge-graph-for-ai",
  "knowledge-graph-search-api",
  "koala-ai-alternatives",
  "llms-txt-standard",
  "mcp-protocol-new-sitemap",
  "optimize-business-for-ai-search",
  "optimize-content-for-ai-search",
  "optimize-content-for-llms-writing-for-machines",
  "optimize-website-for-chatgpt-and-perplexity",
  "outrank-alternatives",
  "perplexity-seo-tools",
  "perplexitybot-user-agent",
  "rankpill-alternatives",
  "reverse-prompt-playbook",
  "see-if-ai-mentions-your-brand-places-to-look",
  "semantic-drift-ai-memory-reset",
  "seo-knowledge-graph",
  "seobot-alternatives",
  "shadow-training-data-audit",
  "state-of-llms-txt-adoption",
  "surfer-seo-alternatives",
  "synthetic-content-saturation-model-collapse",
  "track-brand-mentions-in-ai-search-free-and-paid",
  "vector-distance-vs-keyword-density",
  "voice-search-ai-powered",
  "voice-search-optimization-2026",
  "what-is-a-knowledge-graph-in-seo",
  "what-is-ai-mode-in-google",
  "what-is-an-llms-txt-file",
  "what-is-entity-authority-in-seo",
  "what-is-generative-engine-optimization",
  "what-is-google-ai-mode",
  "what-is-oai-searchbot",
  "why-is-cloudflare-blocking-chatgpt",
  "will-llms-txt-help-your-seo",
  "writesonic-alternatives",
]);

const POSTS = readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith(".md"))
  .map((f) => ({
    slug: f.replace(/\.md$/, ""),
    data: parseFrontmatter(readFileSync(`${BLOG_DIR}/${f}`, "utf8")).data,
  }))
  .filter((p) => p.data.draft !== "true");
const DATE = new Map(POSTS.map((p) => [p.slug, p.data.date]));
const SCHEDULED = Object.entries(BLOG_SCHEDULE);

const days = (from: string, to: string) =>
  Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000);
const clusterOf = (slug: string) =>
  STANDALONES[slug] && DATE.has(STANDALONES[slug]) ? STANDALONES[slug] : slug;

describe("the blog schedule", () => {
  it("dates every post that wasn't live before it started", () => {
    const unscheduled = POSTS.filter(
      (p) => !LIVE_BEFORE_SCHEDULE.has(p.slug) && BLOG_SCHEDULE[p.slug] !== p.data.date,
    ).map((p) => `${p.slug} (dated ${p.data.date})`);
    expect(unscheduled, RUN).toEqual([]);
  });

  it("lists only posts that exist, with the date in their frontmatter", () => {
    for (const [slug, date] of SCHEDULED) {
      expect(DATE.get(slug), `${slug}: ${RUN}`).toBe(date);
      expect(date >= SCHEDULE_START, slug).toBe(true);
    }
  });

  it("keeps the day each scheduled post was written, on or before it goes live", () => {
    for (const { slug, data } of POSTS.filter((p) => BLOG_SCHEDULE[p.slug])) {
      expect(data.written, slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(data.written <= data.date, slug).toBe(true);
    }
  });

  it(`publishes at most ${MAX_PER_DAY} posts a day and ${MAX_PER_WEEK} in any seven days`, () => {
    const perDay = new Map<string, number>();
    for (const [, date] of SCHEDULED) perDay.set(date, (perDay.get(date) ?? 0) + 1);
    for (const [date, n] of perDay) expect(n, date).toBeLessThanOrEqual(MAX_PER_DAY);
    // The busiest seven days always start on a publishing day.
    for (const from of perDay.keys()) {
      const week = [...perDay]
        .filter(([date]) => days(from, date) >= 0 && days(from, date) < 7)
        .reduce((sum, [, n]) => sum + n, 0);
      expect(week, `the seven days from ${from}`).toBeLessThanOrEqual(MAX_PER_WEEK);
    }
  });

  it("puts each hub live before any of its standalones", () => {
    for (const [slug, date] of SCHEDULED) {
      const hub = STANDALONES[slug];
      const hubDate = hub ? DATE.get(hub) : undefined;
      if (hubDate)
        expect(hubDate < date, `${slug} (${date}) is due before ${hub} (${hubDate})`).toBe(true);
    }
  });

  it(`spaces posts from one cluster at least ${CLUSTER_GAP_DAYS} days apart`, () => {
    for (const [a, x] of SCHEDULED) {
      for (const [b, y] of SCHEDULED) {
        if (a < b && clusterOf(a) === clusterOf(b)) {
          expect(Math.abs(days(x, y)), `${a} (${x}) and ${b} (${y})`).toBeGreaterThanOrEqual(
            CLUSTER_GAP_DAYS,
          );
        }
      }
    }
  });
});

describe("links to scheduled posts", () => {
  it("never come from pages outside the blog before the post is live", () => {
    // The link graph filters at runtime; everything else is written by hand.
    const skip = /(\.test\.ts|link-graph\.ts|blog-schedule\.ts|blog-release\.ts)$/;
    const files = ["src/data", "src/components", "src/routes", "src/lib"].flatMap((dir) =>
      readdirSync(dir, { recursive: true, encoding: "utf8" })
        .filter((f) => /\.tsx?$/.test(f))
        .map((f) => `${dir}/${f}`),
    );
    const early: string[] = [];
    for (const file of files.filter((f) => !skip.test(f))) {
      const text = readFileSync(file, "utf8");
      for (const m of text.matchAll(/(?:["'`(]|https:\/\/rankbox\.xyz)\/blog\/([a-z0-9-]+)/g)) {
        const date = DATE.get(m[1]);
        if (!isLive(date, todayUTC(), false)) early.push(`${file} → ${m[1]} (live ${date})`);
      }
    }
    expect(early).toEqual([]);
  });

  it("stay out of the link graph's suggestions until the post is live", () => {
    const suggested = () =>
      new Set(
        TOPICS.flatMap((t) => t.pages).flatMap(
          (page) => crossLinks(page)?.cards.map((c) => c.href) ?? [],
        ),
      );
    const early = (hrefs: Set<string>) =>
      [...hrefs].filter((h) => !isLive(DATE.get(blogSlugOf(h) ?? ""), todayUTC(), false));
    // Under vite dev every post is suggested, including the scheduled ones...
    const all = suggested();
    vi.stubEnv("DEV", false);
    // ...and in production none that aren't live yet.
    expect(early(suggested())).toEqual([]);
    vi.unstubAllEnvs();
    if (SCHEDULED.some(([, d]) => d > todayUTC())) expect(early(all).length).toBeGreaterThan(0);
  });

  it("keeps llms.txt out of public/, where it would bypass the schedule", () => {
    expect(existsSync("public/llms.txt"), "llms.txt lives in src/content/").toBe(false);
  });
});

describe("releasing a post", () => {
  afterEach(() => vi.unstubAllEnvs());
  const [soon, soonDate] = SCHEDULED.at(-1) ?? ["", ""];
  const dayBefore =
    soonDate && new Date(Date.parse(soonDate) - 86_400_000).toISOString().slice(0, 10);

  it("goes live at 00:00 UTC on its date, or at once under vite dev", () => {
    expect(isLive("2026-10-11", "2026-10-10", false)).toBe(false);
    expect(isLive("2026-10-10", "2026-10-10", false)).toBe(true);
    expect(isLive(null, "2026-10-10", false)).toBe(true);
    expect(isLive("2026-10-11", "2026-10-10", true)).toBe(true);
    expect(todayUTC(new Date("2026-10-10T23:59:59-05:00"))).toBe("2026-10-11");
  });

  it("reads blog links, relative or absolute, and nothing else", () => {
    expect(blogSlugOf("/blog/zero-click-searches")).toBe("zero-click-searches");
    expect(blogSlugOf("https://rankbox.xyz/blog/podcast-seo#faq")).toBe("podcast-seo");
    expect(blogSlugOf("/blog")).toBeNull();
    expect(blogSlugOf("/blog/a/b")).toBeNull();
    expect(blogSlugOf("https://example.com/blog/podcast-seo")).toBeNull();
    expect(isBlogPathLive("/glossary/serp", "2000-01-01", false)).toBe(true);
  });

  it("turns links to scheduled posts into plain text, and leaves the rest", () => {
    const blocks = [
      {
        type: "paragraph",
        richText: [
          { text: "a", href: "/blog/later" },
          { text: "b", href: "/blog/now" },
          { text: "c", href: "https://example.com/blog/later" },
        ],
      },
    ];
    const out = unlinkPosts(blocks, new Set(["later"]));
    expect(out[0].richText.map((s) => s.href)).toEqual([
      null,
      "/blog/now",
      "https://example.com/blog/later",
    ]);
    expect(blocks[0].richText[0].href).toBe("/blog/later");
  });

  it.runIf(soon)("keeps a scheduled post off the blog until its day", () => {
    vi.stubEnv("DEV", false);
    expect(listHousePosts(dayBefore).map((p) => p.slug)).not.toContain(soon);
    expect(getHousePost(soon, dayBefore)).toBeNull();
    expect(listHousePosts(soonDate).map((p) => p.slug)).toContain(soon);
    expect(getHousePost(soon, soonDate)?.slug).toBe(soon);
  });

  it.runIf(soon)("unlinks a scheduled post inside the posts that are live", () => {
    vi.stubEnv("DEV", false);
    const hrefs = (value: unknown): string[] =>
      JSON.stringify(value).match(/"href":"[^"]*"/g) ?? [];
    const waiting = new Set(SCHEDULED.filter(([, d]) => d > SCHEDULE_START).map(([s]) => s));
    for (const { slug } of listHousePosts(SCHEDULE_START)) {
      for (const href of hrefs(getHousePost(slug, SCHEDULE_START)?.blocks)) {
        const target = blogSlugOf(href.slice(8, -1));
        expect(target && waiting.has(target), `${slug} links to ${target}`).toBeFalsy();
      }
    }
  });

  it("leaves scheduled posts out of llms.txt until their day", () => {
    const text = liveLlmsTxt(LLMS_TXT, "2026-09-30", false);
    for (const [slug] of SCHEDULED) expect(text).not.toContain(`/blog/${slug})`);
    expect(liveLlmsTxt(LLMS_TXT, "2999-01-01", false)).toBe(LLMS_TXT);
  });
});
