import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createAiProvider, activeModelId } from "./ai-gateway.server";
import { safeFetchText, UnsafeUrlError } from "./safe-fetch.server";
import { assertAiRateLimit } from "./rate-limit.server";
import { requireGenerationEntitlement } from "./entitlement.server";

type Gateway = ReturnType<typeof createAiProvider>;
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
  return gateway(activeModelId()) as unknown as Parameters<typeof generateText>[0]["model"];
}

const AnalyzeInput = z.object({
  business_name: z.string().trim().min(1),
  website_url: z.string().trim().min(1),
  full_name: z.string().optional(),
});

const SiteId = z.string().uuid();

const BlogInput = z.object({
  /** The site the article is for: its brand brief, its credits, its exchange row. */
  siteId: SiteId,
  title: z.string().trim().min(1),
  keyword: z.string().optional(),
  description: z.string().optional(),
  wordCount: z.number().int().min(800).max(6000).optional(),
  /** The blog row being written. Lets the backlink exchange place a link in it. */
  blogId: z.string().uuid().optional(),
});

/**
 * One site's brand brief. Read through the caller's own RLS client, so a site
 * id that isn't theirs reads nothing and writes an unbranded brief rather
 * than someone else's.
 */
async function loadStyleContext(supabase: unknown, siteId: string) {
  const client = supabase as SupabaseClientLike;
  const [{ data: settings }, { data: profile }] = await Promise.all([
    client.from("content_settings").select("*").eq("site_id", siteId).maybeSingle(),
    client.from("profiles").select("*").eq("id", siteId).maybeSingle(),
  ]);
  const { composeStyleBrief } = await import("./style-brief");
  const text = (v: unknown) => (typeof v === "string" ? v : null);
  return composeStyleBrief({
    brand: text(profile?.brand_name),
    product: text(profile?.product_description),
    tone: text(settings?.tone),
    style: text(settings?.writing_style),
    audience: text(settings?.audience),
    voice: text(settings?.brand_voice),
  });
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

/**
 * Fetches a site and returns tag-stripped text for the model.
 *
 * Also returns the raw HTML so callers that need metadata (title, og:image,
 * icons) can read it before it is flattened — the previous version discarded
 * the markup, which is why no logo could ever be extracted.
 */
async function fetchWebsiteRaw(
  rawUrl: string,
): Promise<{ html: string; text: string; finalUrl: string } | { error: string }> {
  try {
    const res = await safeFetchText(rawUrl, {
      timeoutMs: 8000,
      accept: "text/html,text/plain;q=0.9,*/*;q=0.5",
    });
    if (res.status < 200 || res.status >= 300) {
      return {
        error: `Website returned HTTP ${res.status}. Use the domain and business name for inference.`,
      };
    }
    if (!/text\/html|text\/plain|application\/xhtml\+xml/i.test(res.contentType)) {
      return {
        error: `Website content type was ${res.contentType || "unknown"}. Use the domain and business name for inference.`,
      };
    }
    const text = res.body
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 12000);
    return { html: res.body, text, finalUrl: res.url };
  } catch (err) {
    if (err instanceof UnsafeUrlError) return { error: err.message };
    return {
      error: `Website fetch timed out or was blocked. Infer from business name and domain: ${domainFromUrl(rawUrl)}.`,
    };
  }
}

async function fetchWebsiteBrief(rawUrl: string): Promise<string> {
  const res = await fetchWebsiteRaw(rawUrl);
  return "error" in res ? res.error : res.text;
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

export const generateBlogContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => BlogInput.parse(d))
  .handler(async ({ data, context }) => {
    const scope = { userId: context.userId, siteId: data.siteId };
    // Server-side trial gate, per site. This function is a plain POST
    // endpoint, so a UI check alone is bypassable, and credits are granted
    // during onboarding before any payment — a credits check does not stand
    // in for this.
    await requireGenerationEntitlement(context.supabase, scope);
    await assertAiRateLimit(context.userId);

    // The article must be this site's: its credit, its brand brief and any
    // exchange link placed in it all belong to the site named here.
    if (data.blogId) {
      const { data: blog } = await (
        context.supabase as unknown as {
          from: (t: string) => {
            select: (c: string) => {
              eq: (
                c: string,
                v: string,
              ) => { maybeSingle: () => PromiseLike<{ data: { site_id: string } | null }> };
            };
          };
        }
      )
        .from("blogs")
        .select("site_id")
        .eq("id", data.blogId)
        .maybeSingle();
      if (!blog || blog.site_id !== data.siteId) {
        throw new Error("That article isn't on this site.");
      }
    }

    // The article's credit is spent here, before writing, and given back if
    // the writing fails — the same order autopilot uses. The site's balance
    // is the only one it can touch: the gate above proved the site is theirs.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: reservedCredit, error: creditError } = await supabaseAdmin.rpc(
      "consume_article_credit",
      { _site_id: data.siteId },
    );
    if (creditError) throw new Error(creditError.message);
    if (!reservedCredit) {
      throw new Error("This site has used all its articles for this billing period.");
    }

    const style = await loadStyleContext(context.supabase, data.siteId);
    const { writeArticle } = await import("./article.server");

    // The backlink exchange: one link for another member, if the network has
    // a page that belongs in this article. Escrowed before writing, confirmed
    // after, released on failure — and never allowed to fail the article.
    const { reserveForArticle, settleReservations, releaseReservations } =
      await import("./exchange/engine.server");
    const reserved = data.blogId
      ? await reserveForArticle(scope, {
          id: data.blogId,
          title: data.title,
          keyword: data.keyword ?? null,
          tags: [],
        })
      : [];
    try {
      const article = await writeArticle(data, style, {
        outboundLinks: reserved.map((r) => r.link),
      });
      await settleReservations(reserved, article.outboundLinks, data.blogId ?? null);
      return article;
    } catch (err) {
      await releaseReservations(reserved, "generation failed");
      await supabaseAdmin.rpc("refund_article_credit", { _site_id: data.siteId });
      throw err;
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
  .inputValidator((d: unknown) =>
    z.object({ siteId: SiteId, selection: z.string(), action: z.string() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAiRateLimit(context.userId);
    const gateway = createAiProvider();
    const style = await loadStyleContext(context.supabase, data.siteId);
    const instruction = ACTIONS[data.action] ?? ACTIONS.ai_suggest;
    const { text } = await generateText({
      model: model(gateway),
      prompt: `${style}\n\n${instruction}\nReturn ONLY the revised text with no preamble or quotes.\n\nPassage:\n"""${data.selection}"""`,
    });
    return { result: text.trim() };
  });

export const discoverKeywords = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ siteId: SiteId, seed: z.string().optional() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAiRateLimit(context.userId);
    const gateway = createAiProvider();
    const style = await loadStyleContext(context.supabase, data.siteId);
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
  .handler(async ({ data, context }) => {
    await assertAiRateLimit(context.userId);
    const gateway = createAiProvider();
    const websiteBrief = await fetchWebsiteBrief(data.website_url);
    const prompt = `You are Rankbox, an AI SEO intelligence engine. Analyze the business and website text below.\n\nBusiness name: ${data.business_name}\nWebsite: ${data.website_url}\nDomain: ${domainFromUrl(data.website_url)}\nWebsite text excerpt:\n"""${websiteBrief}"""\n\nReturn this exact JSON shape, with no missing keys:\n{"niche":"business niche","services":["service"],"audience":"target audience","geo":"geographic target","brand_tone":"brand tone","competitors":["competitor"],"existing_content":"one sentence","internal_linking":"one sentence","missing_opportunities":["opportunity"],"semantic_clusters":["cluster"],"ai_visibility":["AI citation opportunity"],"keywords":[{"name":"keyword","search_volume":1200,"intent":"Transactional","trend":"High"}],"opportunities":[{"title":"Specific blog title","description":"article angle","keyword":"primary keyword","traffic_estimate":1000,"competition":"Low","ai_signal":88}]}\n\nProduce 6-10 concrete blog opportunities tailored to this exact business.`;
    const json = await generateJson(gateway, prompt).catch(() => ({}));
    return normalizeAnalysis(json, data, websiteBrief);
  });

export const generateBlogStrategy = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ siteId: SiteId, existingTitles: z.array(z.string()).optional() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAiRateLimit(context.userId);
    const gateway = createAiProvider();
    const style = await loadStyleContext(context.supabase, data.siteId);
    const avoid = data.existingTitles?.length
      ? `\n\nDo NOT repeat any of these existing titles:\n${data.existingTitles.join("\n")}`
      : "";
    const json = await generateJson(
      gateway,
      `${style}\n\nBuild a strategic content plan of 30 distinct, high-impact blog article opportunities for this brand. Return JSON: {"opportunities":[{"title":"Specific blog title","description":"article angle","keyword":"primary keyword","traffic_estimate":1000,"competition":"Low","ai_signal":88}]}. Cover high-intent, informational, comparison, and AI-citation-friendly topics.${avoid}`,
    ).catch(() => ({ opportunities: [] }));
    const fallback = fallbackOpportunities("SEO growth", "Rankbox", 30);
    const opportunities = asArray(asRecord(json).opportunities)
      .slice(0, 30)
      .map((item, index) => normalizeOpportunity(item, fallback[index % fallback.length], index));
    while (opportunities.length < 30) {
      const index = opportunities.length;
      opportunities.push(fallback[index % fallback.length]);
    }
    return opportunities;
  });
