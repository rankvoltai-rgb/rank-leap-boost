/**
 * Public pages for the AI tools in the connector library: /integrations/lovable,
 * /integrations/cursor, one per MCP connector.
 *
 * Built from src/data/connectors.ts, the same verified data the dashboard's
 * setup overlays use, so a page's setup steps, plan requirements and caveats
 * can never drift from what a signed-in user is told. What a page adds is the
 * framing: what the three Rankbox tools are for in that kind of tool, example
 * prompts, and an FAQ built from the connector's own facts.
 *
 * Rules (enforced by ai-integrations.test.ts, alongside integrations.test.ts):
 *  - Facts, not outcomes: no install counts, ratings, reviews or traffic
 *    promises, and no claim about a tool beyond what its connector records.
 *  - A slug never collides with a hand-written integration page.
 *  - The hero lockup holds: each headline part stays within 22 characters.
 */
import {
  CATEGORIES,
  CONNECTORS,
  MCP_URL,
  type Connector,
  type ConnectorCategory,
} from "@/data/connectors";
import type { IntegrationFAQ, IntegrationPoint, IntegrationSpec } from "@/data/integrations";

type AiCategory = Exclude<ConnectorCategory, "website" | "developer">;

export function aiCategoryOf(c: Connector): AiCategory {
  return c.category as AiCategory;
}

/** Every named AI tool with a page. "Any MCP client" is the /integrations/mcp page. */
export const AI_TOOLS: Connector[] = CONNECTORS.filter(
  (c) => c.kind === "mcp" && c.id !== "any-mcp",
);

export const AI_TOOL_SLUGS = AI_TOOLS.map((c) => c.id);

export function getAiTool(slug: string): Connector | undefined {
  return AI_TOOLS.find((c) => c.id === slug);
}

/**
 * The /integrations/$slug a connector's public page lives at: its own, or for
 * "Any MCP client" the hand-written MCP page. Websites and the API share their
 * connector ids with the hand-written pages.
 */
export function publicSlug(c: Connector): string {
  return c.id === "any-mcp" ? "mcp" : c.id;
}

/** "Using another ___?" on a tool's page, by kind. */
export const ANOTHER: Record<AiCategory, string> = {
  assistant: "AI assistant",
  builder: "AI app builder",
  coding: "coding agent",
  automation: "automation tool",
};

export function anotherLabel(c: Connector): string {
  return ANOTHER[c.category as AiCategory] ?? "tool";
}

/** "an AI assistant", "a coding agent": the kind of tool, ready for a sentence. */
export function kindWithArticle(c: Connector): string {
  const kind = anotherLabel(c);
  return `${/^[aeiou]/i.test(kind) ? "an" : "a"} ${kind}`;
}

/* ── Framing by kind of tool ───────────────────────────────────── */

interface CategoryCopy {
  /** "AI app builder", for the eyebrow. */
  singular: string;
  /** What a user's work in that tool is called, for the privacy answer. */
  work: string;
  uses: (name: string) => IntegrationPoint[];
  prompts: string[];
}

const COPY: Record<AiCategory, CategoryCopy> = {
  assistant: {
    singular: "AI assistant",
    work: "chats, files, or other connectors",
    uses: (name) => [
      {
        title: "Find what people ask AI",
        body: `Ask ${name} for the questions people type into ChatGPT, Perplexity, and Gemini about your topic, grouped by intent.`,
      },
      {
        title: "Brief an article in one message",
        body: "Get a working title, an H2 outline, the questions to answer, and the entities to mention for any keyword, then keep refining it in the chat.",
      },
      {
        title: "Write meta descriptions",
        body: "Three options for any page, each 120 to 160 characters, ready to paste into your CMS.",
      },
    ],
    prompts: [
      "What questions do people ask AI about home solar batteries?",
      "Use Rankbox to build a content brief for “best CRM for startups”.",
      "Write three meta descriptions for our pricing page.",
    ],
  },
  builder: {
    singular: "AI app builder",
    work: "projects or code",
    uses: (name) => [
      {
        title: "Plan pages around real questions",
        body: `Before ${name} builds a page, pull the questions people ask AI engines about it, so the copy answers them.`,
      },
      {
        title: "Brief the content, then build it",
        body: `Turn a keyword into an outline ${name} can build from: headings, the questions the page must answer, and the entities to cover.`,
      },
      {
        title: "Ship with the metadata done",
        body: `Have ${name} write a meta description for each page as it creates them.`,
      },
    ],
    prompts: [
      "Before you build the landing page, use Rankbox to find what people ask AI about meal-prep delivery.",
      "Get a Rankbox brief for “kanban vs scrum” and build the blog post from it.",
      "Use Rankbox to write meta descriptions for every page on the site.",
    ],
  },
  coding: {
    singular: "Coding agent",
    work: "code or repositories",
    uses: (name) => [
      {
        title: "Research without leaving the editor",
        body: `Ask ${name} for the AI search questions behind the page you're working on.`,
      },
      {
        title: "Briefs as structured data",
        body: `Content briefs come back as structured data as well as text, so ${name} can scaffold a page straight from the outline.`,
      },
      {
        title: "Meta descriptions in your code",
        body: `Have ${name} write meta descriptions and put them in your page metadata for you.`,
      },
    ],
    prompts: [
      "Use Rankbox to write meta descriptions for the pricing page, then add them to its metadata.",
      "Get a Rankbox content brief for “kanban vs scrum” and scaffold the article page from its outline.",
      "What do people ask AI about project management software? Use Rankbox.",
    ],
  },
  automation: {
    singular: "Automation",
    work: "workflows or connected apps",
    uses: () => [
      {
        title: "A brief for every new keyword",
        body: "Run the content brief tool as a step whenever a keyword lands in your sheet, CRM, or queue.",
      },
      {
        title: "Questions on a schedule",
        body: "Pull the AI search questions for your core topics on a schedule and send them where your team plans content.",
      },
      {
        title: "Meta descriptions in bulk",
        body: "Generate meta descriptions for a whole list of pages in one run.",
      },
    ],
    prompts: [
      "When a keyword is added to the sheet, create a Rankbox content brief and post it to the team.",
      "Every Monday, fetch the AI search questions for our five core topics.",
      "For each URL in the list, write a meta description with Rankbox.",
    ],
  },
};

const categoryOf = (c: Connector) => c.category as AiCategory;

/* ── Page copy ─────────────────────────────────────────────────── */

export interface AiToolPage {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  headline: { lead: string; accent: string };
  subhead: string;
  specs: IntegrationSpec[];
  uses: IntegrationPoint[];
  prompts: string[];
  faqs: IntegrationFAQ[];
}

/** Where the tool uses Rankbox, for the facts band. */
export function surfaceOf(c: Connector): { value: string; label: string } {
  const hasCommand = c.steps.some((s) => s.snippet?.kind === "command");
  switch (c.category) {
    case "builder":
      return { value: "In the builder", label: "while it builds your app" };
    case "coding":
      return hasCommand
        ? { value: "Terminal", label: "from the agent in your terminal" }
        : { value: "Editor", label: "from the agent in your editor" };
    case "automation":
      return { value: "Workflows", label: "as a step in any workflow" };
    default:
      return { value: "In chat", label: "right inside the conversation" };
  }
}

/** How setup is done, in the fewest words: "1 command", "3 steps". */
export function setupValue(c: Connector): string {
  if (c.steps.length === 1 && c.steps[0].snippet?.kind === "command") return "1 command";
  return `${c.steps.length} ${c.steps.length === 1 ? "step" : "steps"}`;
}

/** A step list read as one answer: "Open Connectors… Then paste…". */
function stepsAsSentence(c: Connector): string {
  const steps = c.steps.map((s) => s.text.replace(/[.:]$/, ""));
  const text = steps.join(". ");
  return `${text}. The server URL is ${MCP_URL}.`;
}

export function aiToolPage(c: Connector): AiToolPage {
  const copy = COPY[categoryOf(c)];
  const surface = surfaceOf(c);
  const n = c.steps.length;
  const faqs: IntegrationFAQ[] = [
    { q: `How do I connect Rankbox to ${c.name}?`, a: stepsAsSentence(c) },
    ...(c.plan ? [{ q: `Which ${c.name} plans can use Rankbox?`, a: c.plan }] : []),
    {
      q: `What can ${c.name} do with Rankbox?`,
      a: `Three things: find the questions people ask AI engines about a topic, build an SEO content brief for a keyword, and write meta descriptions for a page. ${c.name} calls them when you ask.`,
    },
    {
      q: `Can Rankbox see my ${c.name} ${copy.work}?`,
      a: `No. Rankbox's tools only receive the topic, keyword, or page summary ${c.name} sends when it calls them, and they send back research. They can't read your ${copy.work}.`,
    },
    {
      q: `Does Rankbox cost extra in ${c.name}?`,
      a: "No. The Rankbox MCP server comes with your Rankbox plan, including the free trial.",
    },
    {
      q: "Does it publish to my website?",
      a: "No. The MCP connection is for research and planning. To publish articles to your site automatically, connect it with one of Rankbox's website integrations or the REST API.",
    },
  ];

  return {
    metaTitle: `Rankbox for ${c.name}: MCP Setup & SEO Tools`,
    metaDescription: `Connect Rankbox to ${c.name} in ${n} ${n === 1 ? "step" : "steps"}. Get AI search questions, SEO content briefs, and meta descriptions right inside ${c.name}.`,
    eyebrow: `${copy.singular} · MCP connector`,
    headline: { lead: "Rankbox for", accent: c.name },
    subhead: `${c.tagline} Add Rankbox's MCP server once and ${c.name} can research topics, brief articles, and write meta descriptions for you.`,
    specs: [
      { value: setupValue(c), label: "to connect" },
      { value: surface.value, label: surface.label },
      { value: "3", label: "research tools it can call" },
      { value: "Included", label: "with every Rankbox plan" },
    ],
    uses: copy.uses(c.name),
    prompts: copy.prompts,
    faqs,
  };
}

/**
 * Other tools of the same kind: two popular ones, then the tools that follow
 * this one in the directory, wrapping round. Filling every slot with the
 * popular ones first left most of a large category linked from nowhere but
 * the hub; walking on from the page's own position means every tool is
 * suggested by the few before it.
 */
export function relatedAiTools(c: Connector, count = 6): Connector[] {
  const category = AI_TOOLS.filter((t) => t.category === c.category);
  const at = category.findIndex((t) => t.id === c.id);
  const after = [...category.slice(at + 1), ...category.slice(0, at)];
  const popular = after.filter((t) => t.popular).slice(0, 2);
  const rest = after.filter((t) => !popular.includes(t));
  return [...popular, ...rest].slice(0, count);
}

export function categoryLabel(c: Connector): string {
  return CATEGORIES.find((cat) => cat.id === c.category)?.label ?? "";
}
