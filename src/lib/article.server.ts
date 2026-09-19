/**
 * The article writer — one pipeline behind every way an article gets written:
 * the dashboard's "write now", the autopilot cron, and mock mode's local runs.
 *
 * Stages:
 *   1. Research   the live top-ranking pages for the keyword (Firecrawl), so
 *                 the outline answers what actually ranks and finds its gaps.
 *   2. Draft      one model call against the blueprint below.
 *   3. Optimize   up to three passes against the deterministic SEO checks,
 *                 fixing only what failed, until the article scores 100.
 *   4. Video      a relevant YouTube video, embedded under the opening answer.
 *                 Done last: an optimize pass rewrites the body and would
 *                 otherwise drop the embed.
 *
 * The structure the blueprint asks for is what answer engines quote: a direct
 * 2-3 sentence answer up top, key takeaways, real citations, and an FAQ of the
 * questions people actually ask.
 */
import { generateText } from "ai";
import { createAiProvider, activeModelId } from "./ai-gateway.server";
import { gatherResearch, scoreArticle, type ResearchBrief } from "./research.server";
import { findArticleVideo, insertVideo, type ArticleVideo } from "./youtube.server";

/** What the caller knows about the article before it exists. */
export interface ArticleBrief {
  title: string;
  keyword?: string;
  description?: string;
  wordCount?: number;
}

interface DraftContent {
  title: string;
  body: string;
  description: string;
  seo_score: number;
  traffic_estimate: number;
  tags: string[];
}

export interface ArticleContent extends DraftContent {
  /** The embedded video, or null when none was found. */
  video: ArticleVideo | null;
}

const DEFAULT_WORD_COUNT = 2750;

/**
 * How many times a draft may be re-run against its failing SEO checks. Each
 * pass rewrites the whole article, so this is the single biggest lever on how
 * long an article takes — lower it when the provider is slow (the local Claude
 * CLI writes in minutes, a hosted model in seconds).
 */
function optimizePasses(): number {
  const value = Number.parseInt(process.env.ARTICLE_OPTIMIZE_PASSES ?? "", 10);
  return Number.isFinite(value) && value >= 0 ? value : 3;
}

/** The gateway and the `ai` package can resolve to different provider spec
 *  versions during build; normalize the model type at one boundary. */
function model() {
  return createAiProvider()(activeModelId()) as unknown as Parameters<
    typeof generateText
  >[0]["model"];
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function cleanString(value: unknown, fallback: string): string {
  const text = typeof value === "string" ? value.trim() : "";
  return text || fallback;
}

function toNumber(
  value: unknown,
  fallback: number,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
): number {
  const parsed = typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));
  const n = Number.isFinite(parsed) ? parsed : fallback;
  return Math.round(Math.min(max, Math.max(min, n)));
}

function stringArray(value: unknown, fallback: string[], limit = 10): string[] {
  const list = (Array.isArray(value) ? value : [])
    .map((item) => (typeof item === "string" ? item.trim() : cleanString(asRecord(item).name, "")))
    .filter(Boolean)
    .slice(0, limit);
  return list.length ? list : fallback;
}

/** Parses the first JSON object in a model reply, tolerating fences and preamble. */
function extractJson(text: string): unknown {
  const trimmed = text
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // Fall through to balanced-object extraction.
  }
  const start = trimmed.indexOf("{");
  if (start < 0) throw new Error("AI response did not include JSON.");
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < trimmed.length; i += 1) {
    const char = trimmed[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (char === '"') inString = !inString;
    if (inString) continue;
    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;
    if (depth === 0) return JSON.parse(trimmed.slice(start, i + 1));
  }
  throw new Error("AI response JSON was incomplete.");
}

function normalizeBlogContent(value: unknown, input: ArticleBrief, rawText = ""): DraftContent {
  const record = asRecord(value);
  const title = cleanString(record.title, input.title).slice(0, 70);
  const body = cleanString(
    record.body,
    rawText.trim() ||
      `## ${title}\n\n${input.description ?? "This article covers the core search intent behind the topic."}\n\n## Key Takeaways\n\n- Explain the problem clearly.\n- Answer the buyer's next question.\n- Link readers to the most relevant service or product page.`,
  );
  return {
    title,
    body,
    description: cleanString(
      record.description,
      input.description ?? `${title} — a practical SEO guide for qualified buyers.`,
    ).slice(0, 160),
    seo_score: toNumber(record.seo_score, 86, 0, 100),
    traffic_estimate: toNumber(record.traffic_estimate, 900, 0, 1000000),
    tags: stringArray(record.tags, ["SEO", "Strategy"], 4),
  };
}

function buildResearchBlock(keyword: string, research: ResearchBrief): string {
  if (!research.ok) {
    return `LIVE WEB RESEARCH: unavailable for this run. Infer the competitive landscape from expertise, and cite 3–5 reputable, real, well-known authoritative sources using accurate URLs you are confident exist (official docs, major publications, research bodies).`;
  }
  const top = research.topResults.map((r, i) => `${i + 1}. ${r.title} — ${r.url}`).join("\n");
  const headings = research.competitorHeadings.map((h) => `- ${h}`).join("\n");
  const sources = research.sources.map((s) => `- ${s.title}: ${s.url}`).join("\n");
  return `LIVE WEB RESEARCH — the top ranking pages for "${keyword}":
Top 10 results:
${top}

Headings/subtopics competitors cover (cover these comprehensively and find the GAPS they miss):
${headings || "- (no headings extracted)"}

Use ONLY these REAL sources for in-text citations and the "## References" section (cite with [text](url)):
${sources}

Key points distilled from the results:
${research.notes}`;
}

function buildBlueprint(opts: {
  title: string;
  keyword: string;
  description: string;
  wordCount: number;
}): string {
  const { title, keyword, description, wordCount } = opts;
  return `You are a world-class SEO content strategist and writer. Produce a flagship, in-depth article engineered to RANK #1 on Google AND be cited by AI answer engines (ChatGPT, Gemini, Claude, Perplexity, Google AI Overviews).

TOPIC: ${title}
PRIMARY KEYWORD: ${keyword}
BRIEF: ${description || "(none)"}
TARGET WORD COUNT: ${wordCount} (meet or exceed it with genuinely useful, specific content — no fluff)

Follow this exact blueprint:
1. Analyze the top-ranking competitor pages above: their structure, headings, and key points. Beat them on depth and clarity.
2. Build a comprehensive structure with AT LEAST 15 headings/subheadings (a single H1, then ## H2, ### H3, and #### H4 where useful) with a logical flow that fully satisfies user intent.
3. Naturally weave in 10–15 related long-tail keywords and LSI/semantic terms throughout.
4. H1 title: SEO-optimized, UNDER 60 characters, includes the PRIMARY KEYWORD, appeals to the target audience.
5. Introduction: 150–200 words that hook the reader, introduce the topic, and naturally include the primary keyword. Lead with a direct, quotable 2–3 sentence answer (answer-engine friendly).
6. Each ## H2 section: 300–500 words of in-depth content, with concrete examples/data/mini case studies, 1–2 long-tail/LSI terms, a conversational tone speaking directly to the audience, and at least one unique insight competitors miss.
7. Add a "## Key Takeaways" (or "Quick Takeaways") section with 5–7 concise bullet points.
8. Describe 2–3 image/infographic concepts inline using this exact format: **[Image: <description>] (alt: "<keyword-optimized alt text>")**.
9. Include at least two bulleted or numbered lists and, where relevant, a comparison or step-by-step section.
10. Conclusion: 200–250 words that summarize key points, reinforce the message, and end with a clear call-to-action for the audience.
11. "## Frequently Asked Questions": exactly 5 Q&A pairs. Each question is a ### heading ending in "?", followed by a concise 2–4 sentence answer that includes a long-tail keyword.
12. Add one short reader-engagement line inviting feedback and social shares, ending with a question.
13. In-text citations to the real sources, plus a final "## References" section listing them as markdown links [title](url).
14. Keyword density for the primary keyword: aim for 1–2% (no stuffing). Keep paragraphs short (2–4 sentences) and scannable; vary sentence length for natural rhythm.
15. Where an internal link would help, add suggestions inline using: [anchor text](#internal: descriptive target page).
16. Format everything in clean Markdown: bold key phrases, italics for emphasis.`;
}

const BLOG_JSON_SHAPE = `Return ONLY this exact JSON shape (escape all newlines inside "body"):
{"title":"SEO H1 under 60 chars including the keyword","body":"Full markdown article","description":"Compelling meta description, 120–160 characters, includes the keyword","seo_score":92,"traffic_estimate":1200,"tags":["Tag","Tag"]}`;

async function optimizeToHundred(
  style: string,
  content: DraftContent,
  primaryKeyword: string,
  brief: ArticleBrief,
): Promise<DraftContent> {
  let current = content;
  let best = -1;
  for (let pass = 0; pass < optimizePasses(); pass += 1) {
    const analysis = scoreArticle({
      title: current.title,
      keyword: primaryKeyword,
      metaDescription: current.description,
      body: current.body,
    });
    if (analysis.score >= 100) {
      return { ...current, seo_score: 100 };
    }
    const gaps = analysis.checks
      .filter((c) => c.status !== "pass")
      .map((c) => `- ${c.label}: ${c.detail}`)
      .join("\n");
    if (!gaps) return { ...current, seo_score: analysis.score };
    // A pass that didn't move the score won't be fixed by running it again;
    // stop rather than spend another full rewrite.
    if (analysis.score <= best) return { ...current, seo_score: analysis.score };
    best = analysis.score;

    const fixPrompt = `${style}

You are optimizing an existing SEO article to a PERFECT 100/100 score. Keep everything that already works; fix ONLY the issues below while preserving the article's depth, structure, citations, and meaning.

PRIMARY KEYWORD: ${primaryKeyword}
ISSUES TO FIX (current score ${analysis.score}/100):
${gaps}

How to fix common issues:
- Keyword in title: include the exact primary keyword in the H1 (keep it under 60 characters).
- Keyword in introduction: mention the primary keyword in the first 100 words.
- Keyword density: adjust usage to land between 1% and 2% (no stuffing).
- Content length: expand thin sections with specific, useful detail.
- Section structure: ensure at least 3 ## H2 sections and helpful ### H3s.
- Scannable lists: add bulleted/numbered lists.
- FAQ: include a "## Frequently Asked Questions" section with 5 ### question headings ending in "?".
- Meta description: rewrite to 120–160 characters including the keyword.
- Links: include at least 2 markdown links [text](url) (citations / internal-link suggestions).
- Readability: shorten long sentences, use simpler words and shorter paragraphs to raise readability.

Current title: ${current.title}
Current meta description: ${current.description}
Current article (markdown):
"""
${current.body}
"""

Return ONLY this exact JSON shape (escape all newlines inside "body"):
{"title":"optimized H1","body":"full improved markdown article","description":"120–160 char meta with keyword"}`;

    const { text } = await generateText({
      model: model(),
      maxOutputTokens: 24000,
      prompt: fixPrompt,
    });
    try {
      const record = asRecord(extractJson(text));
      const next = normalizeBlogContent(record, { ...brief, title: current.title }, current.body);
      current = {
        ...current,
        title: next.title,
        body: next.body,
        description: next.description,
      };
    } catch {
      // Keep the best version we have if a pass fails to parse.
      break;
    }
  }
  const finalScore = scoreArticle({
    title: current.title,
    keyword: primaryKeyword,
    metaDescription: current.description,
    body: current.body,
  }).score;
  return { ...current, seo_score: finalScore };
}

/**
 * Writes a finished article for `brief`.
 *
 * `style` is the brand context (voice, audience, product) the caller has
 * already loaded — this module never touches the database.
 */
export async function writeArticle(brief: ArticleBrief, style: string): Promise<ArticleContent> {
  const primaryKeyword = brief.keyword?.trim() || brief.title;
  const wordCount = brief.wordCount ?? DEFAULT_WORD_COUNT;
  const research = await gatherResearch(primaryKeyword);

  const prompt = `${style}

${buildBlueprint({ title: brief.title, keyword: primaryKeyword, description: brief.description ?? "", wordCount })}

${buildResearchBlock(primaryKeyword, research)}

${BLOG_JSON_SHAPE}`;

  // The video lookup is independent of the writing, so it runs alongside it
  // instead of adding its own wait at the end.
  const videoSearch = findArticleVideo(primaryKeyword).catch((err) => {
    console.error("[article] video lookup failed:", err);
    return null;
  });

  const { text } = await generateText({ model: model(), maxOutputTokens: 24000, prompt });

  let draft: DraftContent;
  try {
    draft = normalizeBlogContent(extractJson(text), brief);
  } catch {
    // The model answered in prose: keep it as the body rather than losing it.
    draft = normalizeBlogContent({}, brief, text);
  }

  const optimized = await optimizeToHundred(style, draft, primaryKeyword, brief);
  const video = await videoSearch;
  const body = video ? insertVideo(optimized.body, video) : optimized.body;

  return {
    ...optimized,
    body,
    video,
    // Re-scored after the embed so the stored score matches the stored body.
    seo_score: scoreArticle({
      title: optimized.title,
      keyword: primaryKeyword,
      metaDescription: optimized.description,
      body,
    }).score,
  };
}
