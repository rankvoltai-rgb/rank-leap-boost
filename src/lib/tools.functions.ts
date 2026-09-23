import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createAiProvider, activeModelId } from "./ai-gateway.server";

type Gateway = ReturnType<typeof createAiProvider>;

function model(gateway: Gateway) {
  return gateway(activeModelId()) as unknown as Parameters<typeof generateText>[0]["model"];
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

/** Thrown by the rate limit, so the handlers' fallbacks don't swallow it. */
class FreeAiRateLimited extends Error {}

/** A handler's fallback for a failed model call, except when it was the rate limit. */
function unlessLimited<T>(fallback: T) {
  return (err: unknown): T => {
    if (err instanceof FreeAiRateLimited) throw err;
    return fallback;
  };
}

async function generateJson(prompt: string): Promise<unknown> {
  // Every free tool's model call comes through here, so one guard covers them.
  const { getRequest } = await import("@tanstack/react-start/server");
  const { assertFreeAiRateLimit } = await import("./rate-limit.server");
  try {
    await assertFreeAiRateLimit(getRequest());
  } catch (err) {
    throw new FreeAiRateLimited(err instanceof Error ? err.message : "Too many requests.");
  }
  const gateway = createAiProvider();
  const { text } = await generateText({
    model: model(gateway),
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

/* -------------------- AI Question Generator -------------------- */

const TopicInput = z.object({ topic: z.string().trim().min(2).max(200) });

export interface QuestionGroup {
  intent: string;
  questions: string[];
}

export const generateAiQuestions = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => TopicInput.parse(d))
  .handler(async ({ data }): Promise<QuestionGroup[]> => {
    const json = await generateJson(
      `You are an expert in generative engine optimization. For the topic "${data.topic}", list the real questions people ask AI assistants (ChatGPT, Perplexity, Gemini, Google AI Overviews). Group them by intent: "Informational", "Commercial", "Comparison", and "Transactional". Provide 4-6 specific, natural questions per group. Return JSON with exactly four group objects, one per intent: {"groups":[{"intent":"Informational","questions":["question?"]},{"intent":"Commercial","questions":["question?"]},{"intent":"Comparison","questions":["question?"]},{"intent":"Transactional","questions":["question?"]}]}`,
    ).catch(unlessLimited({ groups: [] as unknown[] }));
    const groups = asArray((json as { groups?: unknown }).groups)
      .map((g): QuestionGroup => {
        const rec = (g ?? {}) as { intent?: unknown; questions?: unknown };
        return { intent: str(rec.intent) || "Questions", questions: strList(rec.questions, 8) };
      })
      .filter((g) => g.questions.length > 0)
      .slice(0, 6);
    if (!groups.length) {
      throw new Error("Couldn't generate questions. Please try a different topic.");
    }
    return groups;
  });

/* -------------------- Content Brief Generator -------------------- */

const KeywordInput = z.object({ keyword: z.string().trim().min(2).max(200) });

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

export const generateContentBrief = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => KeywordInput.parse(d))
  .handler(async ({ data }): Promise<ContentBrief> => {
    const json = await generateJson(
      `You are a senior SEO content strategist. Build a content brief for the target keyword "${data.keyword}" that can rank on Google and get cited by AI engines. The current year is ${new Date().getFullYear()}; never reference an earlier year as current. Return JSON: {"title":"working H1 under 60 chars","outline":[{"heading":"H2 heading","points":["point to cover"]}],"questions":["question the article must answer"],"entities":["entity or term to mention"]}. Provide 6-9 outline sections (2-4 points each), 6-8 questions, and 8-12 entities.`,
    ).catch(unlessLimited(null));
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
      title: str(rec.title) || data.keyword,
      outline,
      questions: strList(rec.questions, 10),
      entities: strList(rec.entities, 16),
    };
    if (!brief.outline.length) {
      throw new Error("Couldn't generate a brief. Please try a different keyword.");
    }
    return brief;
  });

/* -------------------- Meta Description Writer -------------------- */

const MetaInput = z.object({ topic: z.string().trim().min(2).max(600) });

export const writeMetaDescriptions = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => MetaInput.parse(d))
  .handler(async ({ data }): Promise<string[]> => {
    const json = await generateJson(
      `Write 3 compelling, click-worthy meta descriptions for a web page about: "${data.topic}". Each must be 120-160 characters, written in active voice, and include a clear value or call to action. Return JSON: {"options":["meta description"]}`,
    ).catch(unlessLimited({ options: [] as unknown[] }));
    const options = strList((json as { options?: unknown }).options, 3).filter(
      (o) => o.length >= 40,
    );
    if (!options.length) {
      throw new Error("Couldn't generate descriptions. Please try again.");
    }
    return options;
  });

/* -------------------- AI FAQ Generator -------------------- */

const FaqInput = z.object({ topic: z.string().trim().min(2).max(800) });

export interface FaqPair {
  q: string;
  a: string;
}

export const generateFaq = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => FaqInput.parse(d))
  .handler(async ({ data }): Promise<FaqPair[]> => {
    const json = await generateJson(
      `You write FAQ sections that AI engines quote. For this page or topic: "${data.topic}", write 7 questions real buyers ask, each with a concise answer of 2-4 sentences: the direct answer first, then one supporting detail. No marketing fluff, no "great question". Return JSON: {"faqs":[{"q":"question?","a":"answer"}]}`,
    ).catch(unlessLimited({ faqs: [] as unknown[] }));
    const faqs = asArray((json as { faqs?: unknown }).faqs)
      .map((f): FaqPair => {
        const rec = (f ?? {}) as { q?: unknown; a?: unknown };
        return { q: str(rec.q), a: str(rec.a) };
      })
      .filter((f) => f.q && f.a)
      .slice(0, 8);
    if (!faqs.length)
      throw new Error("Couldn't generate an FAQ. Please try a more specific topic.");
    return faqs;
  });

/* -------------------- Blog Title Generator -------------------- */

const TitleInput = z.object({
  topic: z.string().trim().min(2).max(300),
  keyword: z.string().trim().max(100).optional(),
  tone: z.enum(["plain", "bold", "expert"]).default("plain"),
});

export interface TitleIdea {
  title: string;
  angle: string;
}

export const generateTitles = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => TitleInput.parse(d))
  .handler(async ({ data }): Promise<TitleIdea[]> => {
    const toneNote = {
      plain: "Plain and clear, no hype.",
      bold: "Bold and punchy; strong verbs, a little attitude, never clickbait.",
      expert: "Authoritative and specific, as a senior practitioner would write.",
    }[data.tone];
    const json = await generateJson(
      `Write 10 blog post titles about "${data.topic}"${data.keyword ? ` that include the phrase "${data.keyword}" naturally, ideally near the start` : ""}. Tone: ${toneNote} Cover these angles, two each: "How-to", "List", "Question", "Contrarian", "Data-led". Keep every title under 60 characters. Return JSON: {"titles":[{"title":"...","angle":"How-to"}]}`,
    ).catch(unlessLimited({ titles: [] as unknown[] }));
    const titles = asArray((json as { titles?: unknown }).titles)
      .map((t): TitleIdea => {
        const rec = (t ?? {}) as { title?: unknown; angle?: unknown };
        return { title: str(rec.title), angle: str(rec.angle) || "Idea" };
      })
      .filter((t) => t.title)
      .slice(0, 12);
    if (!titles.length) throw new Error("Couldn't generate titles. Please try again.");
    return titles;
  });

/* -------------------- AI Search Readiness Check -------------------- */

const UrlInput = z.object({ url: z.string().trim().min(3).max(500) });

export type ReadinessStatus = "pass" | "warn" | "fail" | "info";

export interface ReadinessCheck {
  id: string;
  status: ReadinessStatus;
  label: string;
  detail?: string;
  fix?: string;
}

export interface ReadinessReport {
  url: string;
  finalUrl: string;
  score: number;
  passed: number;
  checks: ReadinessCheck[];
  snapshot: {
    title: string;
    description: string;
    h1s: string[];
    canonical: string;
    schemaTypes: string[];
    wordCount: number;
    llmsTxt: boolean;
    robotsFound: boolean;
    bots: { token: string; allowed: boolean }[];
  };
}

export const checkAiReadiness = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => UrlInput.parse(d))
  .handler(async ({ data }): Promise<ReadinessReport> => {
    const [
      { safeFetchText, assertSafeUrl, UnsafeUrlError },
      { parseRobots, checkRobots, AI_BOTS, SEARCH_BOTS },
      { readHtmlSignals },
    ] = await Promise.all([
      import("./safe-fetch.server"),
      import("./robots"),
      import("./html-signals"),
    ]);

    // Per-IP throttle: three fetches per run against arbitrary hosts.
    try {
      const { getRequest } = await import("@tanstack/react-start/server");
      const { rateLimitByIp } = await import("./rate-limit.server");
      const req = getRequest();
      if (req && (await rateLimitByIp(req))) {
        throw new Error("Too many checks from your network right now. Please wait a minute.");
      }
    } catch (e) {
      if (e instanceof Error && /Too many/.test(e.message)) throw e;
    }

    let target: URL;
    try {
      target = assertSafeUrl(data.url);
    } catch (e) {
      throw new Error(
        e instanceof UnsafeUrlError ? e.message : "That doesn't look like a valid URL.",
      );
    }

    const ua =
      "Mozilla/5.0 (compatible; RankboxReadiness/1.0; +https://rankbox.xyz/tools/ai-search-readiness-check)";
    const get = (url: string, maxBytes: number) =>
      safeFetchText(url, {
        maxBytes,
        timeoutMs: 10_000,
        userAgent: ua,
        accept: "text/html,text/plain,*/*",
      }).catch(() => null);

    const [page, robots, llms] = await Promise.all([
      get(target.toString(), 700 * 1024),
      get(`${target.origin}/robots.txt`, 64 * 1024),
      get(`${target.origin}/llms.txt`, 16 * 1024),
    ]);

    if (!page)
      throw new Error("Couldn't reach that URL. Check it loads in a browser and try again.");

    const html = page.body;
    const isHtml = /html/i.test(page.contentType) || /<html/i.test(html.slice(0, 2000));
    const s = readHtmlSignals(html);
    const robotsFound =
      !!robots && robots.status === 200 && !/<html/i.test(robots.body.slice(0, 500));
    const robotsFile = parseRobots(robotsFound ? robots.body : "");
    const llmsTxt =
      !!llms &&
      llms.status === 200 &&
      !/<html/i.test(llms.body.slice(0, 500)) &&
      llms.body.trim().length > 0;

    const searchBots = [
      ...SEARCH_BOTS.filter((b) => b.token === "Googlebot"),
      ...AI_BOTS.filter((b) => b.role === "search" || b.role === "user"),
    ];
    const bots = searchBots.map((b) => ({
      token: b.token,
      allowed: checkRobots(robotsFile, b.token, "/").allowed,
    }));
    const blockedSearch = bots.filter((b) => !b.allowed).map((b) => b.token);
    const training = AI_BOTS.filter((b) => b.role === "training").map((b) => ({
      token: b.token,
      allowed: checkRobots(robotsFile, b.token, "/").allowed,
    }));

    const noindex = /noindex/i.test(s.robotsMeta);
    const checks: (ReadinessCheck & { weight: number })[] = [];

    checks.push({
      id: "response",
      weight: 12,
      status:
        page.status >= 400 || !isHtml
          ? "fail"
          : noindex
            ? "fail"
            : page.status === 200
              ? "pass"
              : "warn",
      label: noindex
        ? "Page is marked noindex"
        : `Page responded ${page.status}${isHtml ? "" : ", not HTML"}`,
      detail: noindex
        ? `robots meta: ${s.robotsMeta}`
        : `Content-Type: ${page.contentType || "unknown"}`,
      fix: noindex
        ? "Remove noindex from the robots meta tag or engines will never list or cite the page."
        : "The page must return 200 with an HTML body.",
    });
    checks.push({
      id: "content",
      weight: 10,
      status: s.wordCount >= 150 ? "pass" : s.wordCount >= 50 ? "warn" : "fail",
      label: `${s.wordCount.toLocaleString()} words visible without JavaScript`,
      detail: "AI crawlers don't run JS; this is what they read.",
      fix: "Render content on the server (SSR or prerender). A client-only app looks empty to every AI crawler.",
    });
    checks.push({
      id: "bots",
      weight: 15,
      status: !robotsFound ? "pass" : blockedSearch.length ? "fail" : "pass",
      label: !robotsFound
        ? "No robots.txt — all crawlers allowed by default"
        : blockedSearch.length
          ? `robots.txt blocks ${blockedSearch.join(", ")}`
          : "All AI search and live-fetch bots allowed",
      detail: robotsFound
        ? `${bots.filter((b) => b.allowed).length} of ${bots.length} search/live-fetch bots may read /`
        : undefined,
      fix: "Allow OAI-SearchBot, Claude-SearchBot, PerplexityBot and Googlebot. Blocking a search bot removes you from that engine's answers.",
    });
    checks.push({
      id: "training",
      weight: 0,
      status: "info",
      label: `${training.filter((t) => t.allowed).length} of ${training.length} training bots allowed`,
      detail:
        "Your call. Blocking GPTBot, ClaudeBot and Google-Extended keeps content out of future models without affecting search answers (except Gemini grounding).",
    });
    checks.push({
      id: "llms",
      weight: 6,
      status: llmsTxt ? "pass" : "warn",
      label: llmsTxt ? "llms.txt found" : "No llms.txt",
      fix: "Publish an llms.txt at the domain root so assistants get a curated map of your best pages. Our generator writes it.",
    });
    checks.push({
      id: "title",
      weight: 10,
      status: !s.title ? "fail" : s.title.length < 15 || s.title.length > 70 ? "warn" : "pass",
      label: s.title ? `Title tag, ${s.title.length} characters` : "No title tag",
      detail: s.title || undefined,
      fix: "Write a 50–60 character title that states what the page is; distinctive words first.",
    });
    checks.push({
      id: "description",
      weight: 8,
      status: !s.description
        ? "fail"
        : s.description.length < 50 || s.description.length > 170
          ? "warn"
          : "pass",
      label: s.description
        ? `Meta description, ${s.description.length} characters`
        : "No meta description",
      fix: "Add a 120–160 character description. It's the summary most AI tools show for your page.",
    });
    checks.push({
      id: "h1",
      weight: 8,
      status: s.h1Count === 1 ? "pass" : s.h1Count === 0 ? "fail" : "warn",
      label:
        s.h1Count === 1 ? "Exactly one H1" : s.h1Count === 0 ? "No H1" : `${s.h1Count} H1 tags`,
      detail:
        s.headings
          .filter((h) => h.level === 1)
          .map((h) => h.text)
          .join(" · ") || undefined,
      fix: "One H1 that states the page's subject. Extractors use it as the title of any passage they cite.",
    });
    checks.push({
      id: "schema",
      weight: 10,
      status: s.jsonLdBlocks && !s.jsonLdErrors ? "pass" : s.jsonLdBlocks ? "warn" : "fail",
      label: s.jsonLdBlocks
        ? `${s.jsonLdBlocks} JSON-LD block${s.jsonLdBlocks === 1 ? "" : "s"}${s.jsonLdErrors ? `, ${s.jsonLdErrors} invalid` : ""}`
        : "No structured data",
      detail: s.schemaTypes.length ? s.schemaTypes.join(", ") : undefined,
      fix: "Add Organization (homepage) or Article (posts) JSON-LD. Our schema generator writes it.",
    });
    checks.push({
      id: "canonical",
      weight: 7,
      status: s.canonical ? "pass" : "warn",
      label: s.canonical ? "Canonical tag present" : "No canonical tag",
      detail: s.canonical || undefined,
      fix: 'Add <link rel="canonical"> so tracked and duplicate URLs consolidate to one.',
    });
    checks.push({
      id: "og",
      weight: 8,
      status: s.og.title && s.og.image ? "pass" : s.og.title || s.og.image ? "warn" : "fail",
      label:
        s.og.title && s.og.image ? "Open Graph title and image set" : "Open Graph tags incomplete",
      detail:
        [
          s.og.title ? "og:title" : null,
          s.og.image ? "og:image" : null,
          s.og.description ? "og:description" : null,
        ]
          .filter(Boolean)
          .join(", ") || "none found",
      fix: "Add og:title, og:description and a 1200×630 og:image. Chat apps and AI assistants use them for link cards.",
    });
    checks.push({
      id: "langviewport",
      weight: 6,
      status: s.lang && s.viewport ? "pass" : s.lang || s.viewport ? "warn" : "fail",
      label:
        s.lang && s.viewport
          ? `Language (${s.lang}) and viewport declared`
          : !s.lang
            ? "No lang attribute on <html>"
            : "No viewport meta tag",
      fix: 'Set <html lang="en"> and a viewport meta tag — both are basic signals of a well-formed page.',
    });

    const total = checks.reduce((n, c) => n + c.weight, 0);
    const earned = checks.reduce(
      (n, c) => n + (c.status === "pass" ? c.weight : c.status === "warn" ? c.weight / 2 : 0),
      0,
    );

    return {
      url: data.url,
      finalUrl: page.url,
      score: Math.round((earned / total) * 100),
      passed: checks.filter((c) => c.status === "pass").length,
      checks: checks.map(({ weight: _w, ...c }) => c),
      snapshot: {
        title: s.title,
        description: s.description,
        h1s: s.headings.filter((h) => h.level === 1).map((h) => h.text),
        canonical: s.canonical,
        schemaTypes: s.schemaTypes,
        wordCount: s.wordCount,
        llmsTxt,
        robotsFound,
        bots,
      },
    };
  });

/* -------------------- Personal AI Visibility Plan -------------------- */

const PersonalPlanInput = z.object({
  name: z.string().trim().min(1).max(120),
  role: z.string().trim().min(2).max(300),
  current: z.string().trim().max(600).optional(),
});

export interface ChecklistItem {
  task: string;
  why: string;
}

export interface ChecklistSection {
  section: string;
  items: ChecklistItem[];
}

export interface PersonalAiPlan {
  headlines: string[];
  aboutMe: string;
  checklist: ChecklistSection[];
}

export const generatePersonalAiPlan = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => PersonalPlanInput.parse(d))
  .handler(async ({ data }): Promise<PersonalAiPlan> => {
    const context = data.current
      ? `Their current LinkedIn headline or profile info: "${data.current}".`
      : "They have not shared a current headline.";
    const json = await generateJson(
      `You are a personal-branding and generative engine optimization (GEO) expert. A professional named "${data.name}" describes what they do as: "${data.role}". ${context}

Create a personalized plan to help this specific person become discoverable and recommended by AI engines (ChatGPT, Perplexity, Gemini, Google AI Overviews) when people ask about their field.

Return JSON with this exact shape:
{
  "headlines": ["3 keyword-rich but human LinkedIn headline options tailored to them, each under 120 chars"],
  "aboutMe": "A first-person About-Me draft (120-180 words) they can paste into their LinkedIn About section or a personal site. Make it specific to their role, natural, and easy for AI to quote. Reference concrete outcomes/skills implied by their role.",
  "checklist": [
    {"section": "LinkedIn for SEO", "items": [{"task": "concrete action", "why": "one short sentence on why it matters for AI visibility"}]},
    {"section": "Optimize your profile", "items": [{"task": "...", "why": "..."}]},
    {"section": "Create an About-Me page", "items": [{"task": "...", "why": "..."}]},
    {"section": "Title & important notes", "items": [{"task": "...", "why": "..."}]}
  ]
}

Rules: 3 headlines. 4 checklist sections using exactly those section names. 3-4 specific, actionable items per section, each personalized to "${data.name}" and "${data.role}" where natural. Keep every "task" and "why" concise and jargon-light.`,
    ).catch(unlessLimited(null));

    const rec = (json ?? {}) as {
      headlines?: unknown;
      aboutMe?: unknown;
      checklist?: unknown;
    };

    const headlines = strList(rec.headlines, 3);
    const aboutMe = str(rec.aboutMe);
    const checklist = asArray(rec.checklist)
      .map((s): ChecklistSection => {
        const sec = (s ?? {}) as { section?: unknown; items?: unknown };
        const items = asArray(sec.items)
          .map((it): ChecklistItem => {
            const item = (it ?? {}) as { task?: unknown; why?: unknown };
            return { task: str(item.task), why: str(item.why) };
          })
          .filter((it) => it.task)
          .slice(0, 6);
        return { section: str(sec.section), items };
      })
      .filter((s) => s.section && s.items.length > 0)
      .slice(0, 6);

    if (!headlines.length || !aboutMe || !checklist.length) {
      throw new Error("Couldn't generate your plan. Please try again with a bit more detail.");
    }

    return { headlines, aboutMe, checklist };
  });
