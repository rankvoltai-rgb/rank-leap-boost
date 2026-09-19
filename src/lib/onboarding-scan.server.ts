/**
 * The onboarding scan: turns a scraped website into everything onboarding
 * prefills.
 *
 *   readBrand      Part 1 — brand name, "what you do", logo. One short AI call.
 *   analyzeBrand   Part 2 — keywords plus niche, audience, market, voice,
 *                  competitors, topic clusters, AI visibility and gaps.
 *   planContent    Part 3 — one content-gap article per keyword, in
 *                  publishing order, which onboarding pushes to the dashboard
 *                  and the autopilot queue.
 *
 * All three work from the same scrape (site-meta.server.ts caches it), so the
 * later steps do not re-fetch the site.
 *
 * Unlike analyzeWebsite in ai.functions.ts, nothing here is padded with
 * made-up fallbacks: a field the AI could not ground in the site comes back
 * blank, and an analysis with no keywords is an error the UI already handles.
 */
import { generateText } from "ai";
import { createAiProvider, activeModelId } from "./ai-gateway.server";
import { scrapeSite } from "./site-meta.server";
import {
  modeledTraffic,
  type ContentPlanInput,
  type PlannedArticle,
  type SiteAnalysis,
  type SiteMeta,
} from "./site-meta";

const INTENTS = ["Commercial", "Informational", "Transactional", "Navigational"] as const;
const TRENDS = ["Rising", "Steady", "Declining"] as const;
const COMPETITION = ["Low", "Medium", "High"] as const;

/** Enough for a month of daily publishing without padding the plan. */
const MAX_ARTICLES = 30;

async function generate(prompt: string, maxOutputTokens: number): Promise<string> {
  const gateway = createAiProvider();
  const { text } = await generateText({
    model: gateway(activeModelId()) as unknown as Parameters<typeof generateText>[0]["model"],
    maxOutputTokens,
    prompt: `${prompt}\n\nReturn ONLY valid JSON. No markdown, no preamble. Use double-quoted property names and strings.`,
  });
  return text;
}

/** Parses the first JSON object in a model reply, tolerating fences and preamble. */
function extractJson(text: string): Record<string, unknown> {
  const trimmed = text
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
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
    if (depth === 0) {
      const parsed: unknown = JSON.parse(trimmed.slice(start, i + 1));
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
      break;
    }
  }
  throw new Error("AI response JSON was incomplete.");
}

/** Whitespace-collapsed string, capped at a word boundary rather than mid-word. */
function str(value: unknown, max = 600): string {
  if (typeof value !== "string") return "";
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:–—-]+$/, "")}…`;
}

function strList(value: unknown, limit: number): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of value) {
    const text = str(item, 240);
    const key = text.toLowerCase();
    if (!text || seen.has(key)) continue;
    seen.add(key);
    out.push(text);
    if (out.length >= limit) break;
  }
  return out;
}

/** Snaps a free-text label onto one of the options the UI's select offers. */
function pick<T extends string>(value: unknown, options: readonly T[], fallback: T): T {
  const text = str(value).toLowerCase();
  return options.find((o) => text.includes(o.toLowerCase())) ?? fallback;
}

function pageBlock(content: string): string {
  return content
    ? `Homepage content:\n"""\n${content}\n"""`
    : "Homepage content: (the site could not be read — work only from the details above)";
}

/**
 * Part 1: brand metadata, with the name and description read by the AI from
 * the page rather than lifted from meta tags, which are often SEO copy or
 * missing entirely.
 *
 * Degrades to the plain meta tags when the page has no readable text or the AI
 * call fails, so the form still prefills.
 */
export async function readBrand(rawUrl: string): Promise<SiteMeta> {
  const { meta, content } = await scrapeSite(rawUrl);
  if (!content) return meta;

  try {
    const json = extractJson(
      await generate(
        `You are reading a company's website to prefill its onboarding profile.

Website: ${meta.url}
Page title: ${meta.title || "(none)"}
Meta description: ${meta.description || "(none)"}
${pageBlock(content)}

Return this JSON: {"brand_name":"","what_you_do":""}

- brand_name: the company or product name as the site writes it. Not a tagline, not the domain.
- what_you_do: one or two plain sentences a stranger would understand — what they offer and who it is for. Third person, starting with the brand name. No superlatives or marketing claims.
- If the page does not make a field clear, return "" for it rather than guessing.`,
        1500,
      ),
    );
    return {
      ...meta,
      brandName: str(json.brand_name, 80) || meta.brandName,
      description: str(json.what_you_do, 400) || meta.description,
    };
  } catch (err) {
    console.error("[onboarding] brand read failed, using meta tags:", err);
    return meta;
  }
}

/** Part 2: the keyword set and the context that briefs every article. */
export async function analyzeBrand(input: {
  url: string;
  brandName: string;
  description: string;
}): Promise<SiteAnalysis> {
  const { meta, content } = await scrapeSite(input.url);

  const json = extractJson(
    await generate(
      `You are Rankbox's site analyst. A business is onboarding. From its website, work out who it serves and which searches its articles should target to win Google traffic and citations in AI answers.

Brand: ${input.brandName || meta.brandName}
What they do: ${input.description || meta.description || "(not provided)"}
Website: ${meta.url}
${pageBlock(content)}

Return JSON in exactly this shape:
{"niche":"","services":[""],"audience":"","geo":"","brand_tone":"","competitors":[""],"existing_content":"","internal_linking":"","missing_opportunities":[""],"semantic_clusters":[""],"ai_visibility":[""],"keywords":[{"name":"","search_volume":0,"intent":"Commercial","trend":"Rising"}]}

Rules:
- Everything must be specific to this business. Nothing that would fit any company.
- niche: one short phrase.
- services: 3-8 things they actually offer, named the way the site names them.
- audience: who buys, specifically (role, company type or situation).
- geo: the markets they serve, as a short phrase. "Global" if nothing on the site points to a region.
- brand_tone: 3-5 words describing how the site writes.
- competitors: up to 6 real companies buyers compare them with. Only names you are confident exist — fewer beats invented.
- semantic_clusters: 4-6 topic clusters their articles should own, a few words each.
- missing_opportunities: 3-5 content gaps, each specific to what this site lacks. One sentence each, under 20 words.
- ai_visibility: 2-4 observations on how likely ChatGPT, Perplexity and Google AI Overviews are to cite this site today, judged from its content. One sentence each, under 20 words. No numbers or tracking claims — nothing has been measured.
- existing_content, internal_linking: one sentence each, from what the page shows.
- keywords: 20 searches real buyers type, lowercase. Mix high-intent commercial queries, comparisons and alternatives, and informational questions. Exclude queries for this brand's own name. search_volume is your best estimate of monthly US searches as an integer. intent is exactly one of Commercial, Informational, Transactional, Navigational. trend is exactly one of Rising, Steady, Declining.`,
      8000,
    ),
  );

  const seen = new Set<string>();
  const keywords: SiteAnalysis["keywords"] = [];
  for (const item of Array.isArray(json.keywords) ? json.keywords : []) {
    const record = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const name = str(record.name, 120).toLowerCase();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    const volume = Number(record.search_volume);
    keywords.push({
      id: `kw-${keywords.length + 1}`,
      name,
      search_volume: Number.isFinite(volume)
        ? Math.min(10_000_000, Math.max(0, Math.round(volume)))
        : 0,
      intent: pick(record.intent, INTENTS, "Commercial"),
      trend: pick(record.trend, TRENDS, "Steady"),
    });
    if (keywords.length >= 25) break;
  }
  if (!keywords.length) throw new Error("The analysis came back without keywords.");

  return {
    niche: str(json.niche, 120),
    services: strList(json.services, 8),
    audience: str(json.audience, 300),
    geo: str(json.geo, 120),
    brand_tone: str(json.brand_tone, 120),
    competitors: strList(json.competitors, 6),
    existing_content: str(json.existing_content, 300),
    internal_linking: str(json.internal_linking, 300),
    missing_opportunities: strList(json.missing_opportunities, 5),
    semantic_clusters: strList(json.semantic_clusters, 6),
    ai_visibility: strList(json.ai_visibility, 4),
    keywords,
  };
}

function list(items: string[]): string {
  return items.length ? items.map((i) => `- ${i}`).join("\n") : "- (none identified)";
}

/**
 * Part 3: turns the confirmed keyword set into content-gap articles.
 *
 * Each article targets exactly one of the user's keywords and covers a topic
 * the site doesn't already answer. The AI orders them quick wins first and
 * judges competition and AI citability; traffic is computed here from keyword
 * volume, never taken from the model.
 */
export async function planContent(input: ContentPlanInput): Promise<PlannedArticle[]> {
  // Highest-volume keywords first, so a set longer than the plan keeps the
  // ones worth the most.
  const keywords = [...input.keywords]
    .filter((k) => k.name.trim())
    .sort((a, b) => b.search_volume - a.search_volume)
    .slice(0, MAX_ARTICLES);
  if (!keywords.length) throw new Error("Add at least one keyword to plan articles.");

  // The homepage shows what the site already covers. Usually a cache hit from
  // Parts 1-2; a failed re-scrape only costs the plan that context.
  let content = "";
  try {
    content = (await scrapeSite(input.url)).content;
  } catch {
    // Plan from the brief alone.
  }

  const reply = await generate(
    `You are Rankbox's content strategist. Plan the articles that fill this business's content gaps — topics its buyers search for that its site does not answer yet.

Brand: ${input.brandName}
What they do: ${input.description || "(not provided)"}
Website: ${input.url}
Niche: ${input.niche || "(not provided)"}
Audience: ${input.audience || "(not provided)"}
Market: ${input.geo || "(not provided)"}
Competitors buyers compare them with:
${list(input.competitors)}
Topic clusters to own:
${list(input.semanticClusters)}
Content gaps found on the site:
${list(input.missingOpportunities)}
${pageBlock(content)}

SEO keywords, numbered (monthly searches, intent):
${keywords.map((k, i) => `${i + 1}. ${k.name} (${k.search_volume}, ${k.intent})`).join("\n")}

Return JSON: {"articles":[{"keyword_number":1,"title":"","description":"","competition":"Low","ai_signal":0}]}

Rules:
- Exactly one article per keyword above, and every keyword used once. keyword_number is that keyword's number in the list.
- Each article fills a gap: a question or comparison buyers have that the site doesn't cover. Never a rewrite of what the homepage already says.
- title: specific and useful, under 70 characters, containing the keyword naturally. No clickbait. No year unless the keyword has one.
- description: one or two sentences giving the angle and the gap it fills. A writer will work from this brief alone.
- Comparison and alternatives articles must be fair to competitors and must not invent facts about them.
- competition: exactly one of Low, Medium, High — how hard a new article from this site would find ranking.
- ai_signal: 1-100, how likely ChatGPT, Perplexity or Google AI Overviews are to cite a strong article on this.
- Order articles by publishing priority: quick wins first (low competition, buying intent), bigger bets after.`,
    8000,
  );
  const json = extractJson(reply);

  // Keywords are matched by number: models copy an integer reliably, but
  // paraphrase keyword text ("alternatives" for "alternative"). The text is a
  // fallback, compared loosely.
  const loose = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  const byName = new Map(keywords.map((k) => [loose(k.name), k]));
  const used = new Set<string>();
  const articles: PlannedArticle[] = [];
  for (const item of Array.isArray(json.articles) ? json.articles : []) {
    const record = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const number = Number(record.keyword_number);
    const keyword =
      (Number.isInteger(number) ? keywords[number - 1] : undefined) ??
      byName.get(loose(str(record.keyword, 200)));
    const title = str(record.title, 120);
    // Drops articles for a keyword the user doesn't have, or a second one for a
    // keyword already planned — that would count its traffic twice.
    if (!keyword || !title || used.has(keyword.name)) continue;
    used.add(keyword.name);

    const index = articles.length;
    const signal = Number(record.ai_signal);
    articles.push({
      id: `article-${index + 1}`,
      title,
      description: str(record.description, 400),
      keyword: keyword.name,
      traffic_estimate: modeledTraffic(keyword.search_volume, index),
      competition: pick(record.competition, COMPETITION, "Medium"),
      ai_signal: Number.isFinite(signal) ? Math.min(100, Math.max(1, Math.round(signal))) : 50,
    });
  }
  if (!articles.length) {
    console.error("[onboarding] content plan had no usable articles. Reply:", reply.slice(0, 1500));
    throw new Error("The content plan came back empty.");
  }
  return articles;
}
