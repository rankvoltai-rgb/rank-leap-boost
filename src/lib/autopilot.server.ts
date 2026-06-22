// Server-only autopilot engine. Generates the next due article for each user
// who has autopilot enabled, paced by their weekly cadence. Runs from the
// public cron route with the service-role client (RLS bypassed).
import { generateText } from "ai";
import { createLovableAiGatewayProvider, requireLovableApiKey } from "./ai-gateway.server";
import { gatherResearch, scoreArticle } from "./research.server";

const MODEL = "google/gemini-3-flash-preview";

type AnyClient = {
  from: (t: string) => any;
  rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: any; error: any }>;
};

function extractJson(text: string): Record<string, unknown> {
  const trimmed = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  try {
    return JSON.parse(trimmed) as Record<string, unknown>;
  } catch {
    const start = trimmed.indexOf("{");
    if (start < 0) return {};
    let depth = 0;
    let inString = false;
    let escaped = false;
    for (let i = start; i < trimmed.length; i += 1) {
      const c = trimmed[i];
      if (escaped) { escaped = false; continue; }
      if (c === "\\") { escaped = true; continue; }
      if (c === '"') inString = !inString;
      if (inString) continue;
      if (c === "{") depth += 1;
      if (c === "}") depth -= 1;
      if (depth === 0) {
        try { return JSON.parse(trimmed.slice(start, i + 1)) as Record<string, unknown>; }
        catch { return {}; }
      }
    }
    return {};
  }
}

function str(v: unknown, fallback: string): string {
  const t = typeof v === "string" ? v.trim() : "";
  return t || fallback;
}

async function loadStyle(supabase: AnyClient, userId: string): Promise<string> {
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
  return `Brand: ${brand}\nProduct context: ${product}\nTone: ${tone}\nWriting style: ${style}\nTarget audience: ${audience}\nBrand voice: ${voice}`;
}

/** Generate a full, source-backed article for one queued blog row. */
async function generateArticle(
  supabase: AnyClient,
  userId: string,
  blog: { title: string; keyword: string | null; description: string | null },
) {
  const gateway = createLovableAiGatewayProvider(requireLovableApiKey());
  const style = await loadStyle(supabase, userId);
  const keyword = blog.keyword ?? blog.title;
  const research = await gatherResearch(keyword);
  const sources = research.ok
    ? `Use ONLY these real sources for citations and a "## References" section:\n${research.sources
        .map((s) => `- ${s.title}: ${s.url}`)
        .join("\n")}`
    : `Cite 3-5 reputable, real, well-known authoritative sources with accurate URLs.`;

  const prompt = `${style}

You are a world-class SEO content strategist. Write a flagship, in-depth article engineered to rank #1 on Google AND be cited by AI answer engines (ChatGPT, Gemini, Claude, Perplexity).

TOPIC: ${blog.title}
PRIMARY KEYWORD: ${keyword}
BRIEF: ${blog.description ?? "(none)"}
TARGET WORD COUNT: 2500+ (genuinely useful, specific content — no fluff)

Requirements: a single H1 under 60 chars including the keyword; a 2-3 sentence quotable answer up top; at least 12 headings (## and ###); a "## Key Takeaways" bullet list; a "## Frequently Asked Questions" section with 5 ### questions ending in "?"; in-text markdown links; a "## References" section. Format in clean Markdown.

${sources}

Return ONLY this exact JSON shape (escape all newlines inside "body"):
{"title":"SEO H1 under 60 chars","body":"full markdown article","description":"meta description 120-160 chars with keyword","seo_score":92,"traffic_estimate":1200,"tags":["Tag","Tag"]}`;

  const { text } = await generateText({
    model: gateway(MODEL) as unknown as Parameters<typeof generateText>[0]["model"],
    maxOutputTokens: 24000,
    prompt,
  });
  const json = extractJson(text);
  const title = str(json.title, blog.title).slice(0, 70);
  const body = str(json.body, text);
  const description = str(json.description, blog.description ?? `${title} — a practical SEO guide.`).slice(0, 160);
  const tags = Array.isArray(json.tags)
    ? (json.tags as unknown[]).map((t) => String(t)).filter(Boolean).slice(0, 4)
    : ["SEO", "Strategy"];
  const score = scoreArticle({ title, keyword, metaDescription: description, body }).score;
  const traffic = typeof json.traffic_estimate === "number" ? Math.round(json.traffic_estimate) : 0;
  return { title, body, description, tags, seo_score: score, traffic_estimate: traffic };
}

interface SettingsRow {
  user_id: string;
  weekly_cadence: number;
  last_autopilot_run: string | null;
}

/** Returns true if this user is due for a new autopilot article right now. */
function isDue(row: SettingsRow): boolean {
  const cadence = Math.max(1, Math.min(7, row.weekly_cadence ?? 7));
  const intervalMs = (7 / cadence) * 24 * 60 * 60 * 1000;
  if (!row.last_autopilot_run) return true;
  const last = new Date(row.last_autopilot_run).getTime();
  // 1h tolerance so a daily cron reliably fires.
  return Date.now() - last >= intervalMs - 60 * 60 * 1000;
}

export async function runAutopilot(): Promise<{ processed: number; skipped: number }> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const client = supabaseAdmin as unknown as AnyClient;

  const { data: rows } = await client
    .from("content_settings")
    .select("user_id, weekly_cadence, last_autopilot_run, autopilot_enabled")
    .eq("autopilot_enabled", true);

  const settings = (rows ?? []) as Array<SettingsRow & { autopilot_enabled: boolean }>;
  let processed = 0;
  let skipped = 0;

  for (const row of settings) {
    if (!isDue(row)) { skipped += 1; continue; }

    // Reserve one credit atomically. Skips the user if their monthly cap is hit.
    const { data: reserved } = await client.rpc("consume_article_credit", { _user_id: row.user_id });
    if (!reserved) { skipped += 1; continue; }

    // Next due article: scheduled, lowest queue position then soonest date.
    const { data: nextRows } = await client
      .from("blogs")
      .select("*")
      .eq("user_id", row.user_id)
      .eq("status", "scheduled")
      .order("queue_position", { ascending: true, nullsFirst: false })
      .order("scheduled_date", { ascending: true })
      .limit(1);
    const blog = (nextRows ?? [])[0];
    if (!blog) {
      // Nothing to write — give the reserved credit back.
      await client.rpc("refund_article_credit", { _user_id: row.user_id });
      skipped += 1;
      continue;
    }

    try {
      await client.from("blogs").update({ status: "generating" }).eq("id", blog.id);
      const content = await generateArticle(client, row.user_id, blog);
      await client
        .from("blogs")
        .update({
          ...content,
          traffic_estimate: content.traffic_estimate || blog.traffic_estimate,
          status: "finished",
        })
        .eq("id", blog.id);
      await client
        .from("content_settings")
        .update({ last_autopilot_run: new Date().toISOString() })
        .eq("user_id", row.user_id);
      processed += 1;
    } catch {
      // Roll the article back to scheduled and refund the reserved credit.
      await client.from("blogs").update({ status: "scheduled" }).eq("id", blog.id);
      await client.rpc("refund_article_credit", { _user_id: row.user_id });
      skipped += 1;
    }
  }

  return { processed, skipped };
}