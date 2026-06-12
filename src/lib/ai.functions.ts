import { createServerFn } from "@tanstack/react-start";
import { generateObject, generateText } from "ai";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  createLovableAiGatewayProvider,
  requireLovableApiKey,
} from "./ai-gateway.server";

const MODEL = "google/gemini-3-flash-preview";

// The gateway provider and the `ai` package can resolve to different provider
// spec versions during build; normalize the model type at one boundary.
function model(gateway: ReturnType<typeof createLovableAiGatewayProvider>) {
  return gateway(MODEL) as unknown as Parameters<typeof generateText>[0]["model"];
}

async function loadStyleContext(supabase: any, userId: string) {
  const [{ data: settings }, { data: profile }] = await Promise.all([
    supabase.from("content_settings").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
  ]);
  const tone = settings?.tone ?? "Professional";
  const style = settings?.writing_style ?? "Balanced";
  const audience = settings?.audience ?? "Founders / Entrepreneurs";
  const voice = settings?.brand_voice ?? "";
  const brand = profile?.brand_name ?? "the brand";
  const product = profile?.product_description ?? "";
  return `Brand: ${brand}\nProduct context: ${product}\nTone: ${tone}\nWriting style: ${style}\nTarget audience: ${audience}\nBrand voice instructions: ${voice}\nAlways apply OmniRank core rules: keyword optimization, clear heading structure, internal linking logic, and high readability.`;
}

const blogSchema = z.object({
  body: z.string().describe("Full blog article in markdown with ## headings, paragraphs, and lists."),
  description: z.string().describe("A one-sentence meta description under 160 chars."),
  seo_score: z.number().min(0).max(100),
  traffic_estimate: z.number().min(0),
  tags: z.array(z.string()).max(4),
});

export const generateBlogContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { title: string; keyword?: string; description?: string }) => d)
  .handler(async ({ data, context }) => {
    const gateway = createLovableAiGatewayProvider(requireLovableApiKey());
    const style = await loadStyleContext(context.supabase, context.userId);
    const { object } = await generateObject({
      model: model(gateway),
      schema: blogSchema,
      prompt: `${style}\n\nWrite a complete, SEO-optimized blog post.\nTitle: ${data.title}\nPrimary keyword: ${data.keyword ?? data.title}\nBrief: ${data.description ?? ""}\n\nReturn a polished article (700-1100 words) in markdown, a meta description, an SEO score (realistic 70-95), a monthly organic traffic estimate (200-5000), and up to 4 short tags.`,
    });
    return object;
  });

const ACTIONS: Record<string, string> = {
  rewrite: "Rewrite the following passage to be clearer and more engaging while keeping the meaning.",
  expand: "Expand the following passage with more detail, examples, and depth.",
  shorten: "Shorten the following passage, keeping only the most important points.",
  improve_seo: "Rewrite the following passage to improve SEO: add relevant keywords naturally and improve scannability.",
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

const keywordsSchema = z.object({
  keywords: z
    .array(
      z.object({
        name: z.string(),
        tag: z.string().describe("e.g. High Competition, Low Competition, High Intent"),
        search_volume: z.number().min(0),
        traffic_estimate: z.number().min(0),
        intent: z.string().describe("e.g. High Intent, Informational, Transactional"),
        trend: z.enum(["High", "Medium", "Low"]),
      }),
    )
    .min(8)
    .max(24),
});

export const discoverKeywords = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { seed?: string }) => d)
  .handler(async ({ data, context }) => {
    const gateway = createLovableAiGatewayProvider(requireLovableApiKey());
    const style = await loadStyleContext(context.supabase, context.userId);
    const { object } = await generateObject({
      model: model(gateway),
      schema: keywordsSchema,
      prompt: `${style}\n\nGenerate a cluster of related SEO keyword opportunities${data.seed ? ` around "${data.seed}"` : " based on the brand and product context"}. Provide realistic monthly search volumes and traffic estimates.`,
    });
    return object.keywords;
  });

/* -------------------- Website intelligence scan -------------------- */

const opportunitySchema = z.object({
  title: z.string().describe("A compelling, specific blog title"),
  description: z.string().describe("One sentence on the angle of the article"),
  keyword: z.string().describe("Primary target keyword"),
  traffic_estimate: z.number().min(100).max(8000).describe("Realistic monthly organic traffic"),
  competition: z.enum(["Low", "Medium", "High"]),
  ai_signal: z.number().min(60).max(99).describe("AI visibility / citation potential score"),
});

const analysisSchema = z.object({
  niche: z.string().describe("The business niche / industry in a few words"),
  services: z.array(z.string()).min(2).max(8).describe("Core products or services offered"),
  audience: z.string().describe("Primary target audience"),
  geo: z.string().describe("Geographic targeting, e.g. 'United States' or 'Global'"),
  brand_tone: z.string().describe("Inferred brand tone, e.g. 'Professional & authoritative'"),
  competitors: z.array(z.string()).min(2).max(6).describe("Likely competitor brands or sites"),
  existing_content: z.string().describe("One sentence assessment of existing content"),
  internal_linking: z.string().describe("One sentence on internal linking structure"),
  missing_opportunities: z.array(z.string()).min(3).max(8).describe("Missing content opportunities"),
  semantic_clusters: z.array(z.string()).min(3).max(8).describe("Semantic keyword cluster names"),
  ai_visibility: z.array(z.string()).min(2).max(6).describe("AI visibility opportunities (ChatGPT, Perplexity, etc.)"),
  keywords: z
    .array(
      z.object({
        name: z.string(),
        search_volume: z.number().min(0),
        intent: z.string(),
        trend: z.enum(["High", "Medium", "Low"]),
      }),
    )
    .min(6)
    .max(16),
  opportunities: z.array(opportunitySchema).min(6).max(10),
});

export const analyzeWebsite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { business_name: string; website_url: string; full_name?: string }) => d)
  .handler(async ({ data }) => {
    const gateway = createLovableAiGatewayProvider(requireLovableApiKey());
    const { object } = await generateObject({
      model: model(gateway),
      schema: analysisSchema,
      prompt: `You are Rankvolt, an AI SEO intelligence engine. Analyze the business below and infer everything automatically from its name and website.\n\nBusiness name: ${data.business_name}\nWebsite: ${data.website_url}\n\nInfer the niche, services, target audience, geographic targeting, brand tone, likely competitors, an assessment of existing content and internal linking, missing content opportunities, semantic keyword clusters, and AI visibility opportunities (getting cited by ChatGPT, Perplexity, Gemini).\n\nThen produce a list of high-impact SEO keyword opportunities with realistic monthly search volumes, and 6-10 specific, compelling blog article opportunities tailored to this exact business — each with a primary keyword, realistic monthly traffic estimate, competition level, and an AI visibility signal score. Make titles concrete and specific to the niche (e.g. mention the industry or location), not generic.`,
    });
    return object;
  });

const strategySchema = z.object({
  opportunities: z.array(opportunitySchema).min(20).max(30),
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
    const { object } = await generateObject({
      model: model(gateway),
      schema: strategySchema,
      prompt: `${style}\n\nBuild a strategic content plan of 30 distinct, high-impact blog article opportunities for this brand. Each must be specific to the niche with a primary keyword, realistic monthly traffic estimate, competition level, and AI visibility signal score. Cover a mix of high-intent, informational, comparison, and AI-citation-friendly topics.${avoid}`,
    });
    return object.opportunities;
  });