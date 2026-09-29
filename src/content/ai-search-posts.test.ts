/**
 * The rules for the AI-search playbooks and tool guides written from the
 * September 2026 keyword research (the ChatGPT, Perplexity and "AI search
 * optimization tools" clusters).
 *
 * They sit next to pages that already rank for close terms (the /ai-seo engine
 * guides, the "cited by ChatGPT" playbook), and three of them name real
 * products, so they're held to the comparison pages' standard: no testing we
 * didn't do, no Rankbox feature before it ships, no product described as
 * unable to do something, and every price dated. They must also read as eight
 * articles, not one template, against each other and every other post.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseFrontmatter } from "@/lib/markdown-blocks";
import { analyzeArticle } from "@/lib/seo-analysis";
import { HAS_LIVE_PLUGIN, SHIPPED } from "@/data/alternatives";
import { cardFor, sectionOf } from "@/data/link-graph";

const BLOG_DIR = "src/content/blog";

/**
 * One-query standalone posts, each with the category ("hub") post it links up
 * to. They're shorter than the hubs, and each hub links back down to them.
 */
const STANDALONES: Record<string, string> = {
  "author-bio-seo": "do-author-bios-help-ai-search-visibility",
  "do-author-bios-help-seo": "do-author-bios-help-ai-search-visibility",
  "ai-seo-checklist": "ai-seo-checklist-pre-publish-audit",
  "evaluate-geo-tool-before-purchasing": "aeo-audit",
  "geo-tools-list": "aeo-audit",
  "claude-seo-tool": "claude-for-seo-audits",
  "how-to-use-claude-for-seo-audits": "claude-for-seo-audits",
  "entity-authority-seo": "entity-authority-in-the-ai-era",
  "what-is-entity-authority-in-seo": "entity-authority-in-the-ai-era",
  "how-to-compare-generative-engine-optimization-software": "comparison-page-formula",
  "are-automated-blog-posts-effective-for-seo": "synthetic-content-saturation-model-collapse",
  "how-to-write-blog-posts-for-ai-citation": "reverse-prompt-playbook",
  "how-to-optimize-content-for-llms": "optimize-content-for-llms-writing-for-machines",
  "seo-knowledge-graph": "knowledge-graph-for-ai",
  "knowledge-graph-search-api": "knowledge-graph-for-ai",
  "what-is-a-knowledge-graph-in-seo": "knowledge-graph-for-ai",
  "how-ai-models-rank-brands-in-search-results": "semantic-drift-ai-memory-reset",
  "how-does-rag-reduce-hallucinations": "hallucination-by-omission-pricing-page",
  "how-to-monitor-brand-mentions-in-ai-generated-responses": "defensive-geo",
  "how-to-fix-incorrect-brand-facts-in-llm-citations": "fix-incorrect-brand-facts-in-ai-answers",
  "how-to-track-competitor-rankings-in-ai-search":
    "how-to-benchmark-ai-citations-against-competitors",
  "is-it-possible-to-track-brand-mentions-in-ai-search":
    "is-it-possible-to-track-brand-mentions-in-ai-answers",
  "see-if-ai-mentions-your-brand-places-to-look": "how-to-see-if-ai-mentions-your-brand",
  "track-brand-mentions-in-ai-search-free-and-paid": "how-to-track-brand-mentions-in-ai-search",
  "how-to-benchmark-website-performance-in-ai-search": "geo-metrics-framework",
  "what-is-generative-engine-optimization": "geo-metrics-framework",
  "perplexitybot-user-agent": "ai-crawler-directory",
  "how-to-track-gptbot-and-claudebot": "ai-crawler-directory",
  "what-is-oai-searchbot": "ai-crawler-directory",
  "why-is-cloudflare-blocking-chatgpt": "cloudflare-challenge-trap",
  "cloudflare-blocking-chatgpt": "cloudflare-challenge-trap",
  "how-to-use-bing-webmaster-tools-for-seo": "bing-webmaster-tools-ai-indexing-guide",
  "does-bing-webmaster-tools-help-google-indexing": "bing-webmaster-tools-ai-indexing-guide",
  "will-llms-txt-help-your-seo": "how-to-get-indexed-by-llms-with-llms-txt",
  "how-to-get-indexed-by-llm-through-llms-txt": "how-to-get-indexed-by-llms-with-llms-txt",
  "what-is-an-llms-txt-file": "state-of-llms-txt-adoption",
  "llms-txt-standard": "state-of-llms-txt-adoption",
  "how-to-track-ai-referral-traffic-in-ga4": "how-to-measure-ai-referral-traffic-in-ga4",
  "chatgpt-traffic-analysis": "how-to-measure-ai-referral-traffic-in-ga4",
  "how-to-benchmark-ai-search-performance": "ai-bot-crawler-census",
  "how-does-ai-search-interpret-user-intent": "vector-distance-vs-keyword-density",
  "how-ai-search-uses-user-intent-and-context": "vector-distance-vs-keyword-density",
};

/** The posts these rules cover. Tool guides name real products. */
const SLUGS = [
  "how-to-rank-on-chatgpt",
  "chatgpt-rank-tracker",
  "optimize-website-for-chatgpt-and-perplexity",
  "perplexity-seo-tools",
  "brand-presence-in-perplexity",
  "ai-search-optimization-tools",
  "optimize-business-for-ai-search",
  "optimize-content-for-ai-search",
  // Phase 1 of docs/content-roadmap.md: titles verbatim from the Semrush content plan.
  "ai-crawler-directory",
  "cloudflare-challenge-trap",
  "bing-webmaster-tools-ai-indexing-guide",
  "how-to-get-indexed-by-llms-with-llms-txt",
  "mcp-protocol-new-sitemap",
  // Phase 2
  "how-to-measure-ai-referral-traffic-in-ga4",
  // Phase 3: Rankbox's own data studies
  "vector-distance-vs-keyword-density",
  "state-of-llms-txt-adoption",
  "ai-bot-crawler-census",
  "geo-metrics-framework",
  "how-to-track-brand-mentions-in-ai-search",
  "how-to-see-if-ai-mentions-your-brand",
  "is-it-possible-to-track-brand-mentions-in-ai-answers",
  "how-to-benchmark-ai-citations-against-competitors",
  "fix-incorrect-brand-facts-in-ai-answers",
  "defensive-geo",
  "hallucination-by-omission-pricing-page",
  "semantic-drift-ai-memory-reset",
  "knowledge-graph-for-ai",
  "optimize-content-for-llms-writing-for-machines",
  "reverse-prompt-playbook",
  "synthetic-content-saturation-model-collapse",
  "comparison-page-formula",
  "entity-authority-in-the-ai-era",
  "claude-for-seo-audits",
  "aeo-audit",
  "ai-seo-checklist-pre-publish-audit",
  "do-author-bios-help-ai-search-visibility",
  "shadow-training-data-audit",
  ...Object.keys(STANDALONES),
];
const TOOL_GUIDES = new Set([
  "chatgpt-rank-tracker",
  "perplexity-seo-tools",
  "ai-search-optimization-tools",
  "claude-seo-tool",
  "geo-tools-list",
]);

function read(slug: string) {
  const { data, body } = parseFrontmatter(readFileSync(`${BLOG_DIR}/${slug}.md`, "utf8"));
  return { slug, data, body };
}

const POSTS = SLUGS.map(read);
const EVERY_POST = readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith(".md"))
  .map((f) => read(f.replace(/\.md$/, "")));

/** The markdown under one "## Heading", up to the next "## ". */
function section(body: string, heading: RegExp): string {
  const lines = body.split("\n");
  const start = lines.findIndex((l) => l.startsWith("## ") && heading.test(l));
  if (start < 0) return "";
  const end = lines.findIndex((l, i) => i > start && l.startsWith("## "));
  return lines.slice(start + 1, end < 0 ? undefined : end).join("\n");
}

/** Body text without link targets, code, or the References list (titles quote vendors). */
function prose(body: string): string {
  return body
    .replace(/\n## References[\s\S]*$/, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\]\([^)]*\)/g, "]")
    .replace(/`[^`]*`/g, "");
}

/* Rankbox has no proprietary dataset, customers to quote, or test lab. */
const FIRST_PARTY = [
  /\bwe tested\b/i,
  /\bwe tried\b/i,
  /\bin our (own )?test(s|ing)?\b/i,
  /\bour (own )?(data|benchmark|study|research)\b/i,
  /\bhands-on\b/i,
  /\bwe found\b/i,
  /\bour customers\b/i,
];

/* Said about a named product, these are claims we can't source. */
const INABILITY = [/\bcan(?:'|’)t\b/i, /\bcannot\b/i, /\black(s|ing)?\b/i, /\bis missing\b/i];

const RANKBOX_OVERCLAIMS = [
  ...(SHIPPED.citationTracking
    ? []
    : [/Rankbox (also )?(tracks|monitors)/i, /\/features\/citation-tracking/]),
  ...(HAS_LIVE_PLUGIN ? [] : [/Rankbox publishes (directly|natively)/i, /one-click publishing/i]),
  ...(SHIPPED.teamInvites ? [] : [/unlimited (seats|team members|users)/i]),
];

describe.each(POSTS.map((p) => [p.slug, p] as const))("%s", (slug, { data, body }) => {
  const keyword = data.keyword ?? "";

  it("targets its keyword in the title and meta description", () => {
    // No length cap: posts from the Semrush content plan keep the plan's exact titles.
    expect(keyword).not.toBe("");
    expect(data.title.toLowerCase()).toContain(keyword.toLowerCase());
    expect(data.description.length).toBeGreaterThanOrEqual(120);
    expect(data.description.length).toBeLessThanOrEqual(160);
    expect(data.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("scores 100 on the article writer's SEO checks", () => {
    const analysis = analyzeArticle({
      title: data.title,
      keyword,
      description: data.description,
      body,
    });
    const failing = analysis.checks.filter((c) => c.status !== "pass").map((c) => c.detail);
    expect(failing).toEqual([]);
    const [min, max] = STANDALONES[slug] ? [1500, 2800] : [2500, 5200];
    expect(analysis.metrics.words).toBeGreaterThanOrEqual(min);
    expect(analysis.metrics.words).toBeLessThanOrEqual(max);
  });

  it("claims no testing or data we don't have", () => {
    const text = prose(body);
    for (const pattern of FIRST_PARTY) expect(text, String(pattern)).not.toMatch(pattern);
    if (TOOL_GUIDES.has(slug)) {
      for (const pattern of INABILITY) expect(text, String(pattern)).not.toMatch(pattern);
    }
  });

  it("describes Rankbox as it ships today", () => {
    const naming = prose(body)
      .split(/(?<=[.!?])\s+|\n+/)
      .filter((s) => /\bRankbox\b/.test(s))
      .join("\n");
    for (const pattern of RANKBOX_OVERCLAIMS) expect(naming, String(pattern)).not.toMatch(pattern);
    if (!SHIPPED.citationTracking) expect(body).not.toMatch(/\/features\/citation-tracking/);
  });

  if (STANDALONES[slug]) {
    it("links up to its category post, which links back down", () => {
      const hub = STANDALONES[slug];
      expect(body, `link to /blog/${hub}`).toContain(`](/blog/${hub})`);
      expect(read(hub).body, `${hub} links to /blog/${slug}`).toContain(`](/blog/${slug})`);
    });
  }

  it("links only to pages that exist", () => {
    const internal = [...body.matchAll(/\]\((\/[^)\s]*)\)/g)].map((m) => m[1].split("#")[0]);
    expect(internal.length).toBeGreaterThanOrEqual(5);
    for (const href of internal) {
      const hub = /^\/[a-z-]+$/.test(href) && sectionOf(href) !== undefined;
      const file = href.startsWith("/downloads/") && existsSync(`public${href}`);
      expect(hub || file || cardFor(href) !== undefined, href).toBe(true);
    }
  });

  it("answers 5–6 questions and lists its references", () => {
    const faq = section(body, /^## Frequently Asked Questions$/);
    const questions = [...faq.matchAll(/^### .+\?$/gm)].length;
    expect(questions).toBeGreaterThanOrEqual(5);
    expect(questions).toBeLessThanOrEqual(6);
    const refs = section(body, /^## References$/);
    expect(
      [...refs.matchAll(/^\d+\. \[[^\]]+\]\((https:\/\/[^)]+)\)/gm)].length,
    ).toBeGreaterThanOrEqual(STANDALONES[slug] ? 6 : 8);
  });

  if (TOOL_GUIDES.has(slug)) {
    it("dates the prices it quotes", () => {
      const text = prose(body);
      if (/\$\d/.test(text.replace(/\$49\.50/g, ""))) {
        expect(text).toMatch(/(September|Sept?\.?) 2026|2026-09-\d\d/);
      }
    });
  }
});

/* ------------------------------------------------------------------ */
/* Across posts: eight articles, not one template                      */
/* ------------------------------------------------------------------ */

function shingles(body: string): Set<string> {
  const text = prose(body)
    .split("\n")
    .filter((l) => !/^(#|\||!\[)/.test(l.trim()))
    .join(" ");
  const words = text.toLowerCase().match(/[a-z0-9$.,'%-]+/g) ?? [];
  const out = new Set<string>();
  for (let i = 0; i + 8 <= words.length; i++) out.add(words.slice(i, i + 8).join(" "));
  return out;
}

function sectionHeadings(body: string): Set<string> {
  return new Set(
    [...body.matchAll(/^## (.+)$/gm)]
      .map((m) => m[1].replace(/\d+/g, "N").toLowerCase().trim())
      .filter((h) => !/^(key takeaways|frequently asked questions|references)$/.test(h)),
  );
}

describe("AI search posts, compared with every other post", () => {
  const pairs = POSTS.flatMap((a) =>
    EVERY_POST.filter(
      (b) =>
        b.slug !== a.slug &&
        !(SLUGS.includes(b.slug) && SLUGS.indexOf(b.slug) < SLUGS.indexOf(a.slug)),
    ).map((b) => [a, b] as const),
  );

  it("share no more than 8% of their wording with any other post", () => {
    const cache = new Map<string, Set<string>>();
    const sh = (p: { slug: string; body: string }) => {
      if (!cache.has(p.slug)) cache.set(p.slug, shingles(p.body));
      return cache.get(p.slug)!;
    };
    const over = pairs
      .map(([a, b]) => {
        const x = sh(a);
        const y = sh(b);
        let shared = 0;
        for (const s of x) if (y.has(s)) shared++;
        return {
          pair: `${a.slug} / ${b.slug}`,
          pct: Math.round((shared / Math.min(x.size, y.size)) * 1000) / 10,
        };
      })
      .filter((r) => r.pct > 8);
    expect(over).toEqual([]);
  });

  it("each have their own structure", () => {
    const same = pairs
      .map(([a, b]) => {
        const theirs = sectionHeadings(b.body);
        return {
          pair: `${a.slug} / ${b.slug}`,
          shared: [...sectionHeadings(a.body)].filter((h) => theirs.has(h)),
        };
      })
      .filter((r) => r.shared.length > 2);
    expect(same).toEqual([]);
  });
});
