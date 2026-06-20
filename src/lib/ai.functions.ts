import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createLovableAiGatewayProvider, requireLovableApiKey } from "./ai-gateway.server";
import { gatherResearch, scoreArticle, type ResearchBrief } from "./research.server";

const MODEL = "google/gemini-3-flash-preview";

type Gateway = ReturnType<typeof createLovableAiGatewayProvider>;
type JsonRecord = Record<string, unknown>;

type Opportunity = {
  title: string;
  description: string;
  keyword: string;
  traffic_estimate: number;
  competition: string;
  ai_signal: number;
};

type WebsiteAnalysis = {
  niche: string;
  services: string[];
  audience: string;
  geo: string;
  brand_tone: string;
  competitors: string[];
  existing_content: string;
  internal_linking: string;
  missing_opportunities: string[];
  semantic_clusters: string[];
  ai_visibility: string[];
  keywords: Array<{ name: string; search_volume: number; intent: string; trend: string }>;
  opportunities: Opportunity[];
};

type BlogContent = {
  title: string;
  body: string;
  description: string;
  seo_score: number;
  traffic_estimate: number;
  tags: string[];
};

type KeywordOutput = {
  name: string;
  tag: string;
  search_volume: number;
  traffic_estimate: number;
  intent: string;
  trend: string;
};

type SupabaseClientLike = {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (
        column: string,
        value: string,
      ) => {
        maybeSingle: () => PromiseLike<{ data: JsonRecord | null }>;
      };
    };
  };
};

// The gateway provider and the `ai` package can resolve to different provider
// spec versions during build; normalize the model type at one boundary.
function model(gateway: Gateway) {
  return gateway(MODEL) as unknown as Parameters<typeof generateText>[0]["model"];
}

const AnalyzeInput = z.object({
  business_name: z.string().trim().min(1),
  website_url: z.string().trim().min(1),
  full_name: z.string().optional(),
});

const BlogInput = z.object({
  title: z.string().trim().min(1),
  keyword: z.string().optional(),
  description: z.string().optional(),
  wordCount: z.number().int().min(800).max(6000).optional(),
});

async function loadStyleContext(supabase: unknown, userId: string) {
  const client = supabase as SupabaseClientLike;
  const [{ data: settings }, { data: profile }] = await Promise.all([
    client.from("content_settings").select("*").eq("user_id", userId).maybeSingle(),
    client.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
  ]);
  const tone = settings?.tone ?? "Professional";
  const style = settings?.writing_style ?? "Balanced";
  const audience = settings?.audience ?? "Founders / Entrepreneurs";
  const voice = settings?.brand_voice ?? "";
  const brand = profile?.brand_name ?? "the brand";
  const product = profile?.product_description ?? "";
  return `Brand: ${brand}\nProduct context: ${product}\nTone: ${tone}\nWriting style: ${style}\nTarget audience: ${audience}\nBrand voice instructions: ${voice}\nAlways apply Rankvolt core rules: keyword optimization, clear heading structure, internal linking logic, and high readability.`;
}

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as JsonRecord) : {};
}

function cleanString(value: unknown, fallback: string): string {
  const text = typeof value === "string" ? value.trim() : "";
  return text || fallback;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function stringArray(value: unknown, fallback: string[], limit = 10): string[] {
  const list = asArray(value)
    .map((item) => (typeof item === "string" ? item.trim() : cleanString(asRecord(item).name, "")))
    .filter(Boolean)
    .slice(0, limit);
  return list.length ? list : fallback;
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

function normalizeCompetition(value: unknown, index = 0): string {
  const text = cleanString(value, ["Low", "Medium", "High"][index % 3]).toLowerCase();
  if (text.includes("low")) return "Low";
  if (text.includes("high")) return "High";
  return "Medium";
}

function normalizeTrend(value: unknown, index = 0): string {
  const text = cleanString(value, ["High", "Medium", "Low"][index % 3]).toLowerCase();
  if (text.includes("low")) return "Low";
  if (text.includes("high")) return "High";
  return "Medium";
}

function domainFromUrl(rawUrl: string): string {
  try {
    const withProtocol = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
    return new URL(withProtocol).hostname.replace(/^www\./, "");
  } catch {
    return (
      rawUrl
        .replace(/^https?:\/\//i, "")
        .replace(/^www\./, "")
        .split("/")[0] || "website"
    );
  }
}

function humanize(input: string): string {
  return input
    .replace(/\.[a-z]{2,}$/i, "")
    .replace(/[-_.]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function inferNiche(businessName: string, websiteUrl: string): string {
  const source = `${businessName} ${domainFromUrl(websiteUrl)}`.toLowerCase();
  if (/roof|plumb|hvac|landscap|contract|remodel|construction/.test(source)) {
    return "Local home services";
  }
  if (/law|legal|attorney|solicitor/.test(source)) return "Legal services";
  if (/clinic|dental|med|health|therapy|wellness/.test(source)) return "Healthcare and wellness";
  if (/realty|real estate|property|realtor/.test(source)) return "Real estate services";
  if (/saas|software|app|tech|cloud|ai/.test(source)) return "B2B software";
  if (/shop|store|commerce|boutique|brand/.test(source)) return "Ecommerce";
  return `${humanize(businessName || domainFromUrl(websiteUrl))} services`;
}

function fallbackKeywords(niche: string): WebsiteAnalysis["keywords"] {
  const base = niche.toLowerCase();
  return [
    { name: `${base} services`, search_volume: 2400, intent: "Transactional", trend: "High" },
    { name: `best ${base} company`, search_volume: 1700, intent: "Commercial", trend: "High" },
    { name: `${base} pricing`, search_volume: 1300, intent: "High Intent", trend: "Medium" },
    { name: `${base} near me`, search_volume: 3100, intent: "Local", trend: "High" },
    { name: `${base} guide`, search_volume: 900, intent: "Informational", trend: "Medium" },
    { name: `${base} comparison`, search_volume: 700, intent: "Commercial", trend: "Medium" },
  ];
}

function fallbackOpportunities(niche: string, businessName: string, count = 8): Opportunity[] {
  const brand = businessName || "Your Business";
  const topic = niche.toLowerCase();
  const titles = [
    `How to Choose the Right ${humanize(topic)} Provider`,
    `${brand} Guide: What to Know Before You Buy`,
    `${humanize(topic)} Pricing: What Impacts the Cost?`,
    `The Complete ${humanize(topic)} Checklist for Customers`,
    `${humanize(topic)} Mistakes That Cost Customers Money`,
    `Best Questions to Ask a ${humanize(topic)} Expert`,
    `When Is the Right Time to Hire a ${humanize(topic)} Company?`,
    `${humanize(topic)} Trends Customers Should Watch`,
    `Local ${humanize(topic)} SEO: How Buyers Compare Options`,
    `${brand} vs Alternatives: How to Evaluate Your Options`,
  ];
  return titles.slice(0, count).map((title, index) => ({
    title,
    description: `A high-intent article designed to educate buyers and capture ${topic} search demand.`,
    keyword: title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .split(" ")
      .slice(0, 5)
      .join(" "),
    traffic_estimate: 650 + index * 185,
    competition: normalizeCompetition(undefined, index),
    ai_signal: 76 + (index % 18),
  }));
}

function normalizeOpportunity(value: unknown, fallback: Opportunity, index = 0): Opportunity {
  const record = asRecord(value);
  const title = cleanString(record.title, fallback.title);
  const keyword = cleanString(record.keyword, fallback.keyword || title.toLowerCase());
  return {
    title,
    description: cleanString(record.description, fallback.description),
    keyword,
    traffic_estimate: toNumber(record.traffic_estimate, fallback.traffic_estimate, 50, 20000),
    competition: normalizeCompetition(record.competition, index),
    ai_signal: toNumber(record.ai_signal, fallback.ai_signal, 1, 100),
  };
}

function extractJson(text: string): unknown {
  const trimmed = text
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // Continue to balanced-object extraction below.
  }

  const start = Math.min(
    ...[trimmed.indexOf("{"), trimmed.indexOf("[")].filter((index) => index >= 0),
  );
  if (start < 0) throw new Error("AI response did not include JSON.");
  const opener = trimmed[start];
  const closer = opener === "{" ? "}" : "]";
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
    if (char === opener) depth += 1;
    if (char === closer) depth -= 1;
    if (depth === 0) return JSON.parse(trimmed.slice(start, i + 1));
  }
  throw new Error("AI response JSON was incomplete.");
}

async function generateJson(gateway: Gateway, prompt: string): Promise<unknown> {
  const { text } = await generateText({
    model: model(gateway),
    prompt: `${prompt}\n\nReturn ONLY valid JSON. Do not wrap it in markdown. Use double-quoted property names and strings.`,
  });
  return extractJson(text);
}

async function fetchWebsiteBrief(rawUrl: string): Promise<string> {
  const url = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "RankvoltBot/1.0 (+https://rankvolt.app)",
        Accept: "text/html,text/plain;q=0.9,*/*;q=0.5",
      },
    });
    if (!response.ok) {
      return `Website returned HTTP ${response.status}. Use the domain and business name for inference.`;
    }
    const contentType = response.headers.get("content-type") ?? "";
    if (!/text\/html|text\/plain|application\/xhtml\+xml/i.test(contentType)) {
      return `Website content type was ${contentType || "unknown"}. Use the domain and business name for inference.`;
    }
    const html = await response.text();
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 12000);
  } catch {
    return `Website fetch timed out or was blocked. Infer from business name and domain: ${domainFromUrl(rawUrl)}.`;
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeAnalysis(
  value: unknown,
  input: z.infer<typeof AnalyzeInput>,
  websiteBrief: string,
): WebsiteAnalysis {
  const record = asRecord(value);
  const niche = cleanString(record.niche, inferNiche(input.business_name, input.website_url));
  const serviceFallback = [niche, `${niche} consulting`, `${niche} support`];
  const services = stringArray(record.services, serviceFallback, 8);
  const competitors = stringArray(
    record.competitors,
    [`Top ${niche} providers`, `${niche} marketplaces`, "Established local competitors"],
    6,
  );
  const missing = stringArray(
    record.missing_opportunities,
    ["Comparison content", "Pricing content", "FAQ content", "Buying guides"],
    8,
  );
  const clusters = stringArray(
    record.semantic_clusters,
    ["Commercial intent", "Educational guides", "Local discovery", "Comparison pages"],
    8,
  );
  const visibility = stringArray(
    record.ai_visibility,
    ["Answer-engine citations", "Expert FAQ snippets", "Comparison mentions"],
    6,
  );
  const fallbackKws = fallbackKeywords(niche);
  const keywords = (asArray(record.keywords).length ? asArray(record.keywords) : fallbackKws)
    .slice(0, 16)
    .map((item, index) => {
      const keyword = asRecord(item);
      const fb = fallbackKws[index % fallbackKws.length];
      return {
        name: cleanString(keyword.name, fb.name),
        search_volume: toNumber(keyword.search_volume, fb.search_volume, 0, 1000000),
        intent: cleanString(keyword.intent, fb.intent),
        trend: normalizeTrend(keyword.trend, index),
      };
    });
  const fallbackOpps = fallbackOpportunities(niche, input.business_name, 10);
  const opportunities = (
    asArray(record.opportunities).length ? asArray(record.opportunities) : fallbackOpps
  )
    .slice(0, 10)
    .map((item, index) =>
      normalizeOpportunity(item, fallbackOpps[index % fallbackOpps.length], index),
    );

  while (opportunities.length < 6) {
    const index = opportunities.length;
    opportunities.push(fallbackOpps[index]);
  }

  return {
    niche,
    services,
    audience: cleanString(record.audience, `Buyers looking for ${niche.toLowerCase()} solutions`),
    geo: cleanString(record.geo, "Target markets served by the website"),
    brand_tone: cleanString(record.brand_tone, "Professional, helpful, and authoritative"),
    competitors,
    existing_content: cleanString(
      record.existing_content,
      websiteBrief
        ? "Website content was scanned and mapped into SEO opportunities."
        : "Website content was inferred from available business signals.",
    ),
    internal_linking: cleanString(
      record.internal_linking,
      "Create hub pages and link each blog opportunity back to relevant service pages.",
    ),
    missing_opportunities: missing,
    semantic_clusters: clusters,
    ai_visibility: visibility,
    keywords,
    opportunities,
  };
}

function normalizeBlogContent(
  value: unknown,
  input: z.infer<typeof BlogInput>,
  rawText = "",
): BlogContent {
  const record = asRecord(value);
  const title = input.title;
  const body = cleanString(
    record.body,
    rawText.trim() ||
      `## ${title}\n\n${input.description ?? "This article covers the core search intent behind the topic."}\n\n## Key Takeaways\n\n- Explain the problem clearly.\n- Answer the buyer's next question.\n- Link readers to the most relevant service or product page.`,
  );
  return {
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

export const generateBlogContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => BlogInput.parse(d))
  .handler(async ({ data, context }) => {
    const gateway = createLovableAiGatewayProvider(requireLovableApiKey());
    const style = await loadStyleContext(context.supabase, context.userId);
    const primaryKeyword = data.keyword ?? data.title;
    const prompt = `${style}

You are an expert SEO writer producing a flagship, in-depth article engineered to RANK on Google AND be cited by AI answer engines (ChatGPT, Gemini, Claude, Perplexity, Google AI Overviews).

Title: ${data.title}
Primary keyword: ${primaryKeyword}
Brief: ${data.description ?? ""}

Write the full article in markdown following ALL of these rules:
- Length: 2,500–3,500+ words of genuinely useful, specific content. Do not pad with fluff.
- Open with a direct, quotable 2–3 sentence answer to the core question (answer-engine friendly), naturally including the primary keyword.
- Immediately after the intro, add a "## Key Takeaways" section with 4–6 concise bullet points.
- Use a clear hierarchy: 6–10 "##" H2 sections, with "###" H3 sub-sections where helpful.
- Include at least two bulleted or numbered lists and, where relevant, a comparison or step-by-step section.
- Use the primary keyword and closely related entities/synonyms naturally throughout (no keyword stuffing). Cover the topic semantically and comprehensively.
- Keep paragraphs short (2–4 sentences) and scannable.
- Where a link would help, add internal-link suggestions inline using this exact format: [anchor text](#internal: descriptive target page).
- End with a "## Frequently Asked Questions" section containing 4–6 real Q&A pairs. Format each question as a "###" heading ending in "?", followed by a 2–4 sentence answer.
- Close with a short, action-oriented conclusion.

Return ONLY this exact JSON shape (escape all newlines inside "body"):
{"body":"Full markdown article","description":"Compelling meta description, 120–160 characters, includes the keyword","seo_score":88,"traffic_estimate":1200,"tags":["Tag","Tag"]}`;
    const { text } = await generateText({
      model: model(gateway),
      maxOutputTokens: 16000,
      prompt,
    });
    try {
      return normalizeBlogContent(extractJson(text), data);
    } catch {
      return normalizeBlogContent({}, data, text);
    }
  });

const ACTIONS: Record<string, string> = {
  rewrite:
    "Rewrite the following passage to be clearer and more engaging while keeping the meaning.",
  expand: "Expand the following passage with more detail, examples, and depth.",
  shorten: "Shorten the following passage, keeping only the most important points.",
  improve_seo:
    "Rewrite the following passage to improve SEO: add relevant keywords naturally and improve scannability.",
  change_tone: "Rewrite the following passage applying the configured brand tone and voice.",
  ai_suggest: "Improve the following passage in any way that makes it stronger writing.",
};

export const editBlogSection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { selection: string; action: string }) => d)
  .handler(async ({ data, context }) => {
    const gateway = createLovableAiGatewayProvider(requireLovableApiKey());
    const style = await loadStyleContext(context.supabase, context.userId);
    const instruction = ACTIONS[data.action] ?? ACTIONS.ai_suggest;
    const { text } = await generateText({
      model: model(gateway),
      prompt: `${style}\n\n${instruction}\nReturn ONLY the revised text with no preamble or quotes.\n\nPassage:\n"""${data.selection}"""`,
    });
    return { result: text.trim() };
  });

export const discoverKeywords = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { seed?: string }) => d)
  .handler(async ({ data, context }) => {
    const gateway = createLovableAiGatewayProvider(requireLovableApiKey());
    const style = await loadStyleContext(context.supabase, context.userId);
    const json = await generateJson(
      gateway,
      `${style}\n\nGenerate SEO keyword opportunities${data.seed ? ` around "${data.seed}"` : " based on the brand and product context"}. Return JSON: {"keywords":[{"name":"keyword","tag":"High Intent","search_volume":1200,"traffic_estimate":300,"intent":"Transactional","trend":"High"}]}`,
    ).catch(() => ({ keywords: [] }));
    const keywords = asArray(asRecord(json).keywords)
      .slice(0, 24)
      .map((item, index): KeywordOutput => {
        const record = asRecord(item);
        const name = cleanString(
          record.name,
          data.seed ? `${data.seed} keyword ${index + 1}` : `seo keyword ${index + 1}`,
        );
        return {
          name,
          tag: cleanString(record.tag, cleanString(record.intent, "Discovered")),
          search_volume: toNumber(record.search_volume, 500 + index * 120, 0, 1000000),
          traffic_estimate: toNumber(record.traffic_estimate, 120 + index * 40, 0, 1000000),
          intent: cleanString(record.intent, "Informational"),
          trend: normalizeTrend(record.trend, index),
        };
      });
    return keywords.length
      ? keywords
      : fallbackKeywords(data.seed ?? "SEO").map((k) => ({
          ...k,
          tag: k.intent,
          traffic_estimate: Math.round(k.search_volume * 0.18),
        }));
  });

/* -------------------- Website intelligence scan -------------------- */

export const analyzeWebsite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => AnalyzeInput.parse(d))
  .handler(async ({ data }) => {
    const gateway = createLovableAiGatewayProvider(requireLovableApiKey());
    const websiteBrief = await fetchWebsiteBrief(data.website_url);
    const prompt = `You are Rankvolt, an AI SEO intelligence engine. Analyze the business and website text below.\n\nBusiness name: ${data.business_name}\nWebsite: ${data.website_url}\nDomain: ${domainFromUrl(data.website_url)}\nWebsite text excerpt:\n"""${websiteBrief}"""\n\nReturn this exact JSON shape, with no missing keys:\n{"niche":"business niche","services":["service"],"audience":"target audience","geo":"geographic target","brand_tone":"brand tone","competitors":["competitor"],"existing_content":"one sentence","internal_linking":"one sentence","missing_opportunities":["opportunity"],"semantic_clusters":["cluster"],"ai_visibility":["AI citation opportunity"],"keywords":[{"name":"keyword","search_volume":1200,"intent":"Transactional","trend":"High"}],"opportunities":[{"title":"Specific blog title","description":"article angle","keyword":"primary keyword","traffic_estimate":1000,"competition":"Low","ai_signal":88}]}\n\nProduce 6-10 concrete blog opportunities tailored to this exact business.`;
    const json = await generateJson(gateway, prompt).catch(() => ({}));
    return normalizeAnalysis(json, data, websiteBrief);
  });

export const generateBlogStrategy = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { existingTitles?: string[] }) => d)
  .handler(async ({ data, context }) => {
    const gateway = createLovableAiGatewayProvider(requireLovableApiKey());
    const style = await loadStyleContext(context.supabase, context.userId);
    const avoid = data.existingTitles?.length
      ? `\n\nDo NOT repeat any of these existing titles:\n${data.existingTitles.join("\n")}`
      : "";
    const json = await generateJson(
      gateway,
      `${style}\n\nBuild a strategic content plan of 30 distinct, high-impact blog article opportunities for this brand. Return JSON: {"opportunities":[{"title":"Specific blog title","description":"article angle","keyword":"primary keyword","traffic_estimate":1000,"competition":"Low","ai_signal":88}]}. Cover high-intent, informational, comparison, and AI-citation-friendly topics.${avoid}`,
    ).catch(() => ({ opportunities: [] }));
    const fallback = fallbackOpportunities("SEO growth", "Rankvolt", 30);
    const opportunities = asArray(asRecord(json).opportunities)
      .slice(0, 30)
      .map((item, index) => normalizeOpportunity(item, fallback[index % fallback.length], index));
    while (opportunities.length < 30) {
      const index = opportunities.length;
      opportunities.push(fallback[index % fallback.length]);
    }
    return opportunities;
  });
