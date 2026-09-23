/**
 * How each AI tool's page opens: the hero scene on the right of
 * /integrations/{tool}, where Rankbox is shown at work inside that tool.
 *
 * A scene is staged in the kind of screen the tool actually is (a chat, an app
 * builder with its preview, an editor's agent panel, a terminal agent, a
 * workflow canvas, a voice agent's test call), in the tool's own palette, and
 * runs one of Rankbox's three MCP tools on the page's sample topic. The
 * screens are evocative, not copies of anyone's interface: the tool's own
 * icon and accent make it recognisable, the layout makes it familiar.
 *
 * Rules (enforced by tool-heroes.test.ts):
 *  - Every AI tool page has a row here, and every row has a page.
 *  - Neighbours on the same stage run different tasks, so no two pages in a
 *    row open on the same scene.
 */
import type { Connector } from "@/data/connectors";
import type { RankboxTool } from "@/data/ai-integration-samples";

export type HeroStage = "chat" | "builder" | "editor" | "terminal" | "canvas" | "voice";

/**
 * The tool's surface. `warm` is a cream paper; `ember` its dark twin; `navy`
 * a blue-black. Sample sites and code inside a scene keep their own colors.
 */
export type HeroTheme = "light" | "warm" | "dark" | "navy" | "ember";

export interface ToolHero {
  stage: HeroStage;
  theme: HeroTheme;
  /** The tool's accent: its send button, selection, and the glow behind it. */
  accent: string;
  /** Which Rankbox tool the scene runs. */
  task: RankboxTool;
  /** editor: the agent panel sits left, where a sidebar extension lives. */
  sidebar?: "left" | "right";
  /** canvas: steps read top to bottom instead of left to right. */
  flow?: "row" | "column";
  /** canvas: steps are round modules rather than cards. */
  round?: boolean;
  /** canvas: Rankbox is attached to an agent step as its tool. */
  agent?: boolean;
  /** terminal: what the window title calls the agent. */
  cli?: string;
}

const hero = (
  stage: HeroStage,
  theme: HeroTheme,
  accent: string,
  task: RankboxTool,
  extra: Partial<ToolHero> = {},
): ToolHero => ({ stage, theme, accent, task, ...extra });

export const TOOL_HEROES: Record<string, ToolHero> = {
  /* AI assistants: the conversation, with Rankbox on in the composer. */
  claude: hero("chat", "warm", "#D97757", "brief"),
  chatgpt: hero("chat", "light", "#0D0D0D", "questions"),
  perplexity: hero("chat", "light", "#20808D", "meta"),
  "le-chat": hero("chat", "light", "#FA520F", "brief"),
  "gemini-enterprise": hero("chat", "light", "#1A73E8", "questions"),
  raycast: hero("chat", "dark", "#FF6363", "meta"),
  "lm-studio": hero("chat", "dark", "#8B6CF6", "brief"),
  "open-webui": hero("chat", "dark", "#E4E4E7", "questions"),
  librechat: hero("chat", "light", "#0F766E", "meta"),
  msty: hero("chat", "light", "#7C3AED", "brief"),

  /* AI app builders: chat on the left, the site taking shape on the right. */
  lovable: hero("builder", "warm", "#FF4F7B", "questions"),
  bolt: hero("builder", "dark", "#3B8CF0", "brief"),
  v0: hero("builder", "light", "#0A0A0A", "meta"),
  replit: hero("builder", "navy", "#F26207", "questions"),
  base44: hero("builder", "light", "#F97316", "brief"),
  "figma-make": hero("builder", "light", "#0D99FF", "questions"),
  macaly: hero("builder", "light", "#2563EB", "meta"),
  dyad: hero("builder", "dark", "#0EA5E9", "brief"),

  /* Agent builders: a canvas, Rankbox wired in as a step or an agent's tool. */
  dify: hero("canvas", "light", "#155EEF", "brief"),
  langflow: hero("canvas", "dark", "#C084FC", "questions", { agent: true }),
  flowise: hero("canvas", "light", "#4F46E5", "meta", { agent: true }),
  "relevance-ai": hero("canvas", "warm", "#6D28D9", "questions", { agent: true }),

  /* Voice agents: a test call. */
  elevenlabs: hero("voice", "dark", "#F4F4F5", "questions"),
  vapi: hero("voice", "navy", "#34D399", "brief"),

  /* Coding agents in the terminal. */
  "claude-code": hero("terminal", "ember", "#D97757", "meta", { cli: "claude" }),
  codex: hero("terminal", "dark", "#E4E4E7", "brief", { cli: "codex" }),
  "gemini-cli": hero("terminal", "navy", "#8AB4F8", "questions", { cli: "gemini" }),
  warp: hero("terminal", "dark", "#01A4FF", "meta", { cli: "warp" }),
  goose: hero("terminal", "light", "#0A0A0A", "brief", { cli: "goose" }),
  amp: hero("terminal", "dark", "#F34E3F", "questions", { cli: "amp" }),
  factory: hero("terminal", "ember", "#EE6018", "meta", { cli: "droid" }),
  opencode: hero("terminal", "navy", "#E6EDF7", "brief", { cli: "opencode" }),

  /* Coding agents in an editor: the file, and the agent that edits it. */
  cursor: hero("editor", "dark", "#E4E4E7", "brief"),
  "github-copilot": hero("editor", "light", "#8250DF", "meta"),
  "devin-desktop": hero("editor", "dark", "#34E8BB", "questions"),
  zed: hero("editor", "light", "#084CCF", "brief"),
  jetbrains: hero("editor", "dark", "#FF318C", "meta"),
  cline: hero("editor", "dark", "#E4E4E7", "questions", { sidebar: "left" }),
  "roo-code": hero("editor", "navy", "#A78BFA", "brief", { sidebar: "left" }),
  continue: hero("editor", "light", "#0A0A0A", "meta", { sidebar: "left" }),
  kiro: hero("editor", "dark", "#9046FF", "questions"),
  trae: hero("editor", "dark", "#32F08C", "brief"),
  augment: hero("editor", "light", "#16A34A", "meta", { sidebar: "left" }),

  /* Automation: the workflow runs. */
  n8n: hero("canvas", "light", "#EA4B71", "brief", { agent: true }),
  zapier: hero("canvas", "warm", "#FF4F00", "questions", { flow: "column" }),
  make: hero("canvas", "light", "#6D00CC", "meta", { round: true }),
  gumloop: hero("canvas", "light", "#EC4899", "brief", { agent: true }),
  sim: hero("canvas", "dark", "#8B5CF6", "questions", { agent: true }),
  "copilot-studio": hero("canvas", "light", "#0F6CBD", "meta", { flow: "column" }),
};

const FALLBACK: Record<string, HeroStage> = {
  assistant: "chat",
  builder: "builder",
  coding: "editor",
  automation: "canvas",
};

/** The tool's scene. A tool without a row still gets a sensible one. */
export function toolHero(c: Connector): ToolHero {
  return TOOL_HEROES[c.id] ?? hero(FALLBACK[c.category] ?? "chat", "light", "#1877F2", "questions");
}
