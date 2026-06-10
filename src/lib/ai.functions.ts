import { createServerFn } from "@tanstack/react-start";
import { generateObject, generateText } from "ai";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  createLovableAiGatewayProvider,
  requireLovableApiKey,
} from "./ai-gateway.server";

const MODEL = "google/gemini-3-flash-preview";

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
      model: gateway(MODEL),
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
      model: gateway(MODEL),
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
      model: gateway(MODEL),
      schema: keywordsSchema,
      prompt: `${style}\n\nGenerate a cluster of related SEO keyword opportunities${data.seed ? ` around "${data.seed}"` : " based on the brand and product context"}. Provide realistic monthly search volumes and traffic estimates.`,
    });
    return object.keywords;
  });