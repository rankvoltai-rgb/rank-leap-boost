/**
 * Stand-ins for every AI call in mock mode (VITE_MOCK_DATA=1): the editor's
 * section rewrite and the free marketing tools.
 *
 * Output is templated from the input, so it is deterministic, instant to
 * reason about, and costs nothing. The shapes match the server functions in
 * src/lib/tools.functions.ts and src/lib/ai.functions.ts exactly.
 */
import type { ContentBrief, PersonalAiPlan, QuestionGroup } from "@/lib/tools.functions";

function delay<T>(value: T, ms: number): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function titleCase(value: string): string {
  return value.replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ------------------------------------------------------------------ */
/* Editor                                                              */
/* ------------------------------------------------------------------ */

function tidy(text: string): string {
  return text
    .replace(/\bin order to\b/gi, "to")
    .replace(/\b(very|really|basically)\s+/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function sentences(text: string): string[] {
  return text.match(/[^.!?]+[.!?]*/g)?.map((s) => s.trim()).filter(Boolean) ?? [text];
}

export async function editBlogSection(input: {
  selection: string;
  action: string;
}): Promise<{ result: string }> {
  const text = input.selection.trim();
  let result: string;
  switch (input.action) {
    case "shorten": {
      const parts = sentences(text);
      result =
        parts.length > 1
          ? parts.slice(0, Math.ceil(parts.length / 2)).join(" ")
          : `${text.split(/\s+/).slice(0, Math.max(6, Math.ceil(text.split(/\s+/).length * 0.6))).join(" ")}…`;
      break;
    }
    case "expand":
      result = `${text} In practice, this is where most teams see the biggest difference, so it's worth getting right early — start small, measure what changes, and build from there.`;
      break;
    case "improve_seo":
      result = `${tidy(text)} Here's how to apply it, step by step.`;
      break;
    default: {
      const tidied = tidy(text);
      result = tidied === text ? `Put simply: ${text.charAt(0).toLowerCase()}${text.slice(1)}` : tidied;
    }
  }
  return delay({ result }, 1100);
}

/* ------------------------------------------------------------------ */
/* Free tools                                                          */
/* ------------------------------------------------------------------ */

export async function generateAiQuestions(input: { topic: string }): Promise<QuestionGroup[]> {
  const t = input.topic.trim();
  return delay(
    [
      {
        intent: "Informational",
        questions: [
          `What is ${t}?`,
          `How does ${t} work?`,
          `Is ${t} worth it for a small business?`,
          `What are the main benefits of ${t}?`,
        ],
      },
      {
        intent: "Commercial",
        questions: [
          `What is the best ${t} in 2026?`,
          `Which ${t} do experts recommend?`,
          `What should I look for when choosing ${t}?`,
          `Are there free options for ${t}?`,
        ],
      },
      {
        intent: "Comparison",
        questions: [
          `What are the top alternatives for ${t}?`,
          `How do the leading ${t} options compare on price?`,
          `Which ${t} is easiest to set up?`,
          `What's the difference between cheap and premium ${t}?`,
        ],
      },
      {
        intent: "Transactional",
        questions: [
          `Where can I buy ${t}?`,
          `How much does ${t} cost per month?`,
          `Is there a free trial for ${t}?`,
          `How do I get started with ${t} today?`,
        ],
      },
    ],
    1200,
  );
}

export async function generateContentBrief(input: { keyword: string }): Promise<ContentBrief> {
  const k = input.keyword.trim();
  return delay(
    {
      title: `${titleCase(k)}: The Complete Guide`.slice(0, 60),
      outline: [
        {
          heading: `What ${k} means`,
          points: ["A one-paragraph definition AI engines can quote", "Who it's for"],
        },
        {
          heading: `Why ${k} matters in 2026`,
          points: ["The change that made it urgent", "What it costs to ignore it"],
        },
        {
          heading: `How to get started with ${k}`,
          points: ["The first three steps", "Common setup mistakes", "What good looks like"],
        },
        {
          heading: `Tools and options for ${k}`,
          points: ["Free vs paid options", "How to choose by team size"],
        },
        {
          heading: "Real examples",
          points: ["A before-and-after example", "What the results looked like"],
        },
        {
          heading: "Frequently asked questions",
          points: ["Answer each question in two to three sentences"],
        },
      ],
      questions: [
        `What is ${k}?`,
        `How long does ${k} take to show results?`,
        `How much does ${k} cost?`,
        `Can I do ${k} myself?`,
        `What are the risks of ${k}?`,
        `What's the best tool for ${k}?`,
      ],
      entities: [
        "Google AI Overviews",
        "ChatGPT",
        "Perplexity",
        "structured data",
        "E-E-A-T",
        "search intent",
        "topical authority",
        "internal linking",
      ],
    },
    1500,
  );
}

export async function writeMetaDescriptions(input: { topic: string }): Promise<string[]> {
  const t = input.topic.trim().replace(/[.\s]+$/, "");
  const short = t.length > 70 ? `${t.slice(0, 67).trimEnd()}…` : t;
  const fit = (s: string) => (s.length > 160 ? `${s.slice(0, 157).trimEnd()}…` : s);
  return delay(
    [
      fit(`Discover ${short}. Get clear, practical answers and start seeing results today — no jargon, no fluff, just what works.`),
      fit(`Everything you need to know about ${short}, in one place. Compare options, avoid common mistakes, and choose with confidence.`),
      fit(`Looking for ${short}? See how it works, what it costs, and how to get started in minutes. Try it free today.`),
    ],
    1000,
  );
}

export async function generatePersonalAiPlan(input: {
  name: string;
  role: string;
  current?: string;
}): Promise<PersonalAiPlan> {
  const first = input.name.trim().split(/\s+/)[0] || input.name;
  const role = input.role.trim();
  return delay(
    {
      headlines: [
        `${titleCase(role)} | Helping teams get measurable results`,
        `${titleCase(role)} · Writing about what actually works`,
        `${first} — ${role}, speaker and practitioner`,
      ].map((h) => h.slice(0, 120)),
      aboutMe: `I'm ${input.name.trim()}, and I work as ${role}. Over the past few years I've helped teams turn vague goals into clear, measurable plans — and then actually ship them. My focus is on practical work: finding the few changes that matter most, testing them quickly, and sharing what I learn along the way. People usually come to me when something important is stuck and they need a clear next step. Outside of client work, I write about the lessons behind the results, so others can skip the mistakes I've already made. If you're working on something similar, I'm always happy to compare notes.`,
      checklist: [
        {
          section: "LinkedIn for SEO",
          items: [
            { task: `Put "${role}" in your headline word for word`, why: "AI engines match people to the exact phrases others search for." },
            { task: "Post one practical tip each week", why: "Regular, specific posts give AI engines something to quote." },
            { task: "Add three skills that match your role", why: "Skills help engines understand what you're an authority on." },
          ],
        },
        {
          section: "Optimize your profile",
          items: [
            { task: "Use a clear, recent headshot", why: "Consistent profile images help engines link your accounts." },
            { task: "List two concrete results in your experience", why: "Specific outcomes are more quotable than job duties." },
            { task: "Use the same name everywhere", why: "A consistent name helps engines connect your profiles." },
          ],
        },
        {
          section: "Create an About-Me page",
          items: [
            { task: "Publish the About-Me draft on your own site", why: "A page you own is a stable source AI engines can cite." },
            { task: "Link your LinkedIn and other profiles from it", why: "Links confirm the profiles all belong to you." },
            { task: "Add Person structured data", why: "Structured data states your role in a format engines read directly." },
          ],
        },
        {
          section: "Title & important notes",
          items: [
            { task: `Title the page "${first} — ${role}"`, why: "The page title is the strongest single signal of what it's about." },
            { task: "Refresh the page every quarter", why: "Recent updates signal the information is still accurate." },
            { task: "Ask two colleagues to mention you by name", why: "Mentions from others make engines more confident about you." },
          ],
        },
      ],
    },
    1600,
  );
}

export async function captureToolLead(_input: {
  email: string;
  name?: string;
  role?: string;
  tool?: string;
}): Promise<{ ok: true }> {
  return delay({ ok: true } as const, 500);
}
