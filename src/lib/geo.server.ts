// Server-only GEO/AI-SEO generation helpers.
// Shared by MCP tools so model calls, prompts, and the API key stay on the server.
// Reads env only inside functions (never at module scope) so this stays import-safe.
import { generateText } from "ai";
import { createLovableAiGatewayProvider, requireLovableApiKey } from "./ai-gateway.server";

const MODEL = "google/gemini-3-flash-preview";

function extractJson(text: string): unknown {
  const trimmed = text
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // fall through to balanced extraction
  }
  const candidates = [trimmed.indexOf("{"), trimmed.indexOf("[")].filter((i) => i >= 0);
  if (!candidates.length) throw new Error("AI response did not include JSON.");
  const start = Math.min(...candidates);
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

async function generateJson(prompt: string): Promise<unknown> {
  const gateway = createLovableAiGatewayProvider(requireLovableApiKey());
  const model = gateway(MODEL) as unknown as Parameters<typeof generateText>[0]["model"];
  const { text } = await generateText({
    model,
    maxOutputTokens: 4000,
    prompt: `${prompt}\n\nReturn ONLY valid JSON. No markdown, no preamble. Use double-quoted property names and strings.`,
  });
  return extractJson(text);
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function strList(value: unknown, limit = 12): string[] {
  return asArray(value)
    .map((v) => str(v))
    .filter(Boolean)
    .slice(0, limit);
}

export interface QuestionGroup {
  intent: string;
  questions: string[];
}

export async function generateAiQuestions(topic: string): Promise<QuestionGroup[]> {
  const json = await generateJson(
    `You are an expert in generative engine optimization. For the topic "${topic}", list the real questions people ask AI assistants (ChatGPT, Perplexity, Gemini, Google AI Overviews). Group them by intent: "Informational", "Commercial", "Comparison", and "Transactional". Provide 4-6 specific, natural questions per group. Return JSON: {"groups":[{"intent":"Informational","questions":["question?"]}]}`,
  ).catch(() => ({ groups: [] }));
  const groups = asArray((json as { groups?: unknown }).groups)
    .map((g): QuestionGroup => {
      const rec = (g ?? {}) as { intent?: unknown; questions?: unknown };
      return { intent: str(rec.intent) || "Questions", questions: strList(rec.questions, 8) };
    })
    .filter((g) => g.questions.length > 0)
    .slice(0, 6);
  if (!groups.length) throw new Error("Couldn't generate questions. Try a different topic.");
  return groups;
}

export interface BriefSection {
  heading: string;
  points: string[];
}

export interface ContentBrief {
  title: string;
  outline: BriefSection[];
  questions: string[];
  entities: string[];
}

export async function generateContentBrief(keyword: string): Promise<ContentBrief> {
  const json = await generateJson(
    `You are a senior SEO content strategist. Build a content brief for the target keyword "${keyword}" that can rank on Google and get cited by AI engines. Return JSON: {"title":"working H1 under 60 chars","outline":[{"heading":"H2 heading","points":["point to cover"]}],"questions":["question the article must answer"],"entities":["entity or term to mention"]}. Provide 6-9 outline sections (2-4 points each), 6-8 questions, and 8-12 entities.`,
  ).catch(() => null);
  const rec = (json ?? {}) as {
    title?: unknown;
    outline?: unknown;
    questions?: unknown;
    entities?: unknown;
  };
  const outline = asArray(rec.outline)
    .map((s): BriefSection => {
      const sec = (s ?? {}) as { heading?: unknown; points?: unknown };
      return { heading: str(sec.heading), points: strList(sec.points, 6) };
    })
    .filter((s) => s.heading)
    .slice(0, 10);
  const brief: ContentBrief = {
    title: str(rec.title) || keyword,
    outline,
    questions: strList(rec.questions, 10),
    entities: strList(rec.entities, 16),
  };
  if (!brief.outline.length) throw new Error("Couldn't generate a brief. Try a different keyword.");
  return brief;
}

export async function writeMetaDescriptions(topic: string): Promise<string[]> {
  const json = await generateJson(
    `Write 3 compelling, click-worthy meta descriptions for a web page about: "${topic}". Each must be 120-160 characters, written in active voice, and include a clear value or call to action. Return JSON: {"options":["meta description"]}`,
  ).catch(() => ({ options: [] }));
  const options = strList((json as { options?: unknown }).options, 3).filter((o) => o.length >= 40);
  if (!options.length) throw new Error("Couldn't generate descriptions. Please try again.");
  return options;
}
