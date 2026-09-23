/**
 * The connector library on Dashboard → Integrations: every place Rankbox
 * plugs into, each with its own setup overlay.
 *
 * Three kinds:
 * - `site`: a publishing platform. Its overlay runs the key setup that
 *   delivers articles, so its steps live in the page, not here.
 * - `api`: the REST API, for any site.
 * - `mcp`: an AI tool that adds the Rankbox MCP server by URL.
 *
 * Rules (enforced by connectors.test.ts):
 * - An `mcp` connector is listed only if its maker documents adding an
 *   arbitrary remote MCP server by URL with no sign-in. Tools that can't are
 *   in NOT_SUPPORTED, so a search for one explains itself instead of coming
 *   up empty.
 * - Steps use the menu names in the maker's own docs, checked on
 *   CONNECTORS_CHECKED. Menus move: re-verify quarterly, starting with the
 *   `popular` ones.
 * - Every `mcp` connector has a step that carries the server URL, either on
 *   its own or inside a command or config.
 */
import type { PlatformId } from "@/data/platforms";
import type { SimpleMarkId } from "@/components/dashboard/connector-marks";

export const MCP_URL = "https://rankbox.xyz/mcp";
export const CONNECTORS_CHECKED = "2026-09-22";

export type ConnectorCategory =
  | "website"
  | "assistant"
  | "builder"
  | "coding"
  | "automation"
  | "developer";

export const CATEGORIES: { id: ConnectorCategory; label: string; blurb: string }[] = [
  { id: "website", label: "Your website", blurb: "Publish every article automatically" },
  { id: "builder", label: "AI app builders", blurb: "Research while you build" },
  { id: "assistant", label: "AI assistants", blurb: "Plan content from the chat" },
  { id: "coding", label: "Coding agents", blurb: "Briefs and metadata in your editor" },
  { id: "automation", label: "Automation", blurb: "Run Rankbox inside workflows" },
  { id: "developer", label: "Developer", blurb: "API and any MCP client" },
];

export type ConnectorMark =
  | { simple: SimpleMarkId }
  | { landing: "chatgpt" | "copilot" }
  | { platform: PlatformId }
  | { rankbox: "api" | "mcp" }
  | { mono: string; color: string };

export interface Snippet {
  kind: "url" | "command" | "config";
  value: string;
  /** Where a config snippet goes. */
  file?: string;
}

export interface Step {
  text: string;
  snippet?: Snippet;
}

export interface Connector {
  id: string;
  name: string;
  maker: string;
  category: ConnectorCategory;
  kind: "site" | "api" | "mcp";
  /** One line on the tile: what connecting gets you there. */
  tagline: string;
  mark: ConnectorMark;
  /** Other names people search for it by. */
  aliases?: string[];
  /** Plan or version it needs, when the maker says. */
  plan?: string;
  steps: Step[];
  /** Another way to set it up, e.g. a config file instead of the command. */
  alternative?: Step;
  /** A caveat worth reading before setup. */
  note?: string;
  docsUrl: string;
  /** Shown first, before anyone searches. */
  popular?: boolean;
  platformId?: PlatformId;
}

/* ── Snippet helpers ───────────────────────────────────────────── */

const json = (value: unknown) => JSON.stringify(value, null, 2);
const url = (text: string): Step => ({ text, snippet: { kind: "url", value: MCP_URL } });
const command = (text: string, value: string): Step => ({
  text,
  snippet: { kind: "command", value },
});
const config = (text: string, file: string | undefined, value: string): Step => ({
  text,
  snippet: { kind: "config", value, file },
});
/** The common `{ mcpServers: { rankbox: … } }` shape. */
const servers = (entry: Record<string, unknown>) => json({ mcpServers: { rankbox: entry } });

/* ── Websites ──────────────────────────────────────────────────── */

const site = (
  platformId: PlatformId,
  name: string,
  aliases: string[],
  docsUrl: string,
  popular = false,
): Connector => ({
  id: platformId,
  name,
  maker: name,
  category: "website",
  kind: "site",
  tagline: `Every article autopilot writes, published to your ${name} site.`,
  mark: { platform: platformId },
  aliases,
  steps: [],
  docsUrl,
  popular,
  platformId,
});

const WEBSITES: Connector[] = [
  site("wordpress", "WordPress", ["wp", "blog", "woocommerce"], "https://wordpress.org", true),
  site("shopify", "Shopify", ["store", "ecommerce", "blog"], "https://www.shopify.com", true),
  site("webflow", "Webflow", ["cms"], "https://webflow.com"),
  site("framer", "Framer", ["cms"], "https://www.framer.com"),
  site("square", "Square", ["square online", "weebly"], "https://squareup.com"),
];

/* ── AI assistants ─────────────────────────────────────────────── */

const ASSISTANTS: Connector[] = [
  {
    id: "claude",
    name: "Claude",
    maker: "Anthropic",
    category: "assistant",
    kind: "mcp",
    tagline: "Ask Claude for briefs, AI questions, and meta descriptions.",
    mark: { simple: "claude" },
    aliases: ["anthropic", "claude.ai", "claude desktop"],
    plan: "All plans. Free includes one custom connector; on Team and Enterprise an owner adds it first.",
    steps: [
      { text: "Open Customize → Connectors." },
      { text: "Click +, then Add custom connector." },
      url("Name it Rankbox and paste the server URL. Leave Advanced settings empty."),
      { text: "Click Add." },
    ],
    docsUrl:
      "https://support.claude.com/en/articles/11175166-getting-started-with-custom-connectors-using-remote-mcp",
    popular: true,
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    maker: "OpenAI",
    category: "assistant",
    kind: "mcp",
    tagline: "Plan content in ChatGPT with Rankbox's research tools.",
    mark: { landing: "chatgpt" },
    aliases: ["openai", "gpt", "chat gpt", "plugins", "developer mode"],
    plan: "Plus, Pro, Business, Enterprise, or Edu, on the web. Needs Developer mode.",
    steps: [
      { text: "Open Settings → Security and login and turn on Developer mode." },
      { text: "Open ChatGPT Plugins and click +." },
      url("Name it Rankbox, choose Public endpoint, and paste the server URL."),
      { text: "Set authentication to No Authentication, then click Create." },
      { text: "In a chat, pick Rankbox from the Developer mode tools in the composer." },
    ],
    docsUrl: "https://developers.openai.com/api/docs/guides/developer-mode",
    popular: true,
  },
  {
    id: "perplexity",
    name: "Perplexity",
    maker: "Perplexity",
    category: "assistant",
    kind: "mcp",
    tagline: "Pair Perplexity's search with Rankbox's content planning.",
    mark: { simple: "perplexity" },
    aliases: ["comet"],
    plan: "Pro, Max, or Enterprise.",
    steps: [
      { text: "Open Settings → Connectors → Add Custom Connector." },
      url("Paste the server URL."),
      { text: "Set Auth to None and Transport to Streamable HTTP, then save." },
      { text: "Turn Rankbox on in a thread." },
    ],
    docsUrl:
      "https://www.perplexity.ai/help-center/en/articles/13915507-adding-custom-remote-connectors",
    popular: true,
  },
  {
    id: "le-chat",
    name: "Le Chat",
    maker: "Mistral AI",
    category: "assistant",
    kind: "mcp",
    tagline: "Bring Rankbox into Mistral's assistant.",
    mark: { simple: "mistralai" },
    aliases: ["mistral", "lechat"],
    plan: "All plans, including Free. In an organization, an admin adds it.",
    steps: [
      { text: "Open Intelligence → Connectors and click + Add Connector." },
      { text: "Open the Custom MCP Connector tab." },
      url("Name it rankbox and paste the server URL."),
      { text: "Click Connect." },
    ],
    docsUrl: "https://docs.mistral.ai/le-chat/knowledge-integrations/connectors/mcp-connectors",
  },
  {
    id: "gemini-enterprise",
    name: "Gemini Enterprise",
    maker: "Google",
    category: "assistant",
    kind: "mcp",
    tagline: "Give your team's Gemini Rankbox's research tools.",
    mark: { simple: "googlegemini" },
    aliases: ["google", "gemini", "google cloud", "agentspace"],
    plan: "Gemini Enterprise Standard, Plus, Frontline, or pay-as-you-go.",
    steps: [
      {
        text: "In the Google Cloud console, open Gemini Enterprise → Data stores → Create data store.",
      },
      { text: "Choose Custom MCP Server → Add MCP server." },
      url("Paste the server URL and choose No authentication."),
      { text: "Create it, then enable its actions." },
    ],
    docsUrl:
      "https://docs.cloud.google.com/gemini/enterprise/docs/connectors/custom-mcp-server/set-up-custom-mcp-server",
  },
  {
    id: "raycast",
    name: "Raycast",
    maker: "Raycast",
    category: "assistant",
    kind: "mcp",
    tagline: "Research a topic from anywhere on your Mac.",
    mark: { simple: "raycast" },
    aliases: ["raycast ai", "mac"],
    plan: "Raycast Pro.",
    steps: [
      { text: "Run the Install MCP Server command." },
      url("Name it rankbox, set Transport to HTTP, and paste the server URL."),
      { text: "Leave Headers and OAuth empty, then press ⌘↵ to install." },
    ],
    docsUrl: "https://manual.raycast.com/ai/model-context-protocol",
  },
  {
    id: "lm-studio",
    name: "LM Studio",
    maker: "LM Studio",
    category: "assistant",
    kind: "mcp",
    tagline: "Use Rankbox with the models you run locally.",
    mark: { simple: "lmstudio" },
    aliases: ["local", "lmstudio"],
    plan: "Free. Version 0.3.17 or later.",
    steps: [
      { text: "Open the Program tab in the right sidebar → Install → Edit mcp.json." },
      config("Add Rankbox and save.", "mcp.json", servers({ url: MCP_URL })),
    ],
    docsUrl: "https://lmstudio.ai/docs/app/mcp",
  },
  {
    id: "open-webui",
    name: "Open WebUI",
    maker: "Open WebUI",
    category: "assistant",
    kind: "mcp",
    tagline: "Add Rankbox to your self-hosted chat.",
    mark: { mono: "OW", color: "#111827" },
    aliases: ["openwebui", "ollama", "self-hosted"],
    plan: "Version 0.6.31 or later. Admins only.",
    steps: [
      { text: "Open Settings → Admin → Integrations → External Tool Servers → + Add Connection." },
      url("Set Type to MCP (Streamable HTTP) and paste the server URL."),
      { text: "Set Auth to None and save." },
    ],
    docsUrl: "https://docs.openwebui.com/features/extensibility/mcp/",
  },
  {
    id: "librechat",
    name: "LibreChat",
    maker: "LibreChat",
    category: "assistant",
    kind: "mcp",
    tagline: "Add Rankbox to your team's self-hosted chat.",
    mark: { mono: "LC", color: "#0F766E" },
    aliases: ["self-hosted"],
    plan: "Self-hosted. Your admin decides whether members can add servers.",
    steps: [
      { text: "Open the right sidebar → MCP Settings and click +." },
      url("Name it rankbox, paste the server URL, and choose Streamable HTTP with no auth."),
      { text: "Click Create." },
    ],
    alternative: config(
      "Or add it for everyone in librechat.yaml:",
      "librechat.yaml",
      `mcpServers:\n  rankbox:\n    type: streamable-http\n    url: ${MCP_URL}`,
    ),
    docsUrl: "https://www.librechat.ai/docs/features/mcp",
  },
  {
    id: "msty",
    name: "Msty Studio",
    maker: "Msty",
    category: "assistant",
    kind: "mcp",
    tagline: "Use Rankbox alongside local and cloud models.",
    mark: { mono: "M", color: "#7C3AED" },
    aliases: ["msty"],
    steps: [
      { text: "Open Toolbox → Add New Tool." },
      url("Name it rankbox, choose HTTP, and paste the server URL."),
      { text: "Leave Authentication empty and click Add." },
    ],
    docsUrl: "https://docs.msty.ai/studio/toolbox/tools",
  },
];

/* ── AI app builders ───────────────────────────────────────────── */

const BUILDERS: Connector[] = [
  {
    id: "lovable",
    name: "Lovable",
    maker: "Lovable",
    category: "builder",
    kind: "mcp",
    tagline: "Research keywords and write metadata while Lovable builds.",
    mark: { mono: "L", color: "#FF4F7B" },
    aliases: ["lovable.dev", "vibe coding", "no-code"],
    plan: "All plans. It works in the Lovable chat, not inside your published app.",
    steps: [
      { text: "Open Connectors from your dashboard or a project, click +, then MCP server." },
      url("Name it Rankbox, keep Direct connection, and paste the server URL."),
      { text: "Set Authentication to No authentication, then click Add server." },
    ],
    note: "In a shared workspace, an admin may need to allow members to add their own MCP servers first.",
    docsUrl: "https://docs.lovable.dev/integrations/custom-mcp",
    popular: true,
  },
  {
    id: "bolt",
    name: "Bolt",
    maker: "StackBlitz",
    category: "builder",
    kind: "mcp",
    tagline: "Plan pages and SEO copy right in Bolt's chat.",
    mark: { mono: "b", color: "#1269D3" },
    aliases: ["bolt.new", "stackblitz", "vibe coding", "no-code"],
    steps: [
      { text: "Open Connectors and choose Custom MCP server." },
      url("Name it Rankbox, paste the server URL, and set Transport to HTTP."),
      { text: "Set Authentication to None, then click Connect." },
      { text: "Turn it on in a project, or set it to turn on automatically." },
    ],
    docsUrl: "https://support.bolt.new/building/using-bolt/connect-mcp",
    popular: true,
  },
  {
    id: "v0",
    name: "v0",
    maker: "Vercel",
    category: "builder",
    kind: "mcp",
    tagline: "Give v0 real search questions to build pages around.",
    mark: { simple: "v0" },
    aliases: ["vercel", "v0.dev", "v0.app", "no-code"],
    steps: [
      { text: "In the prompt box, open the + menu → MCPs." },
      { text: "Choose to add a custom MCP server." },
      url("Paste the server URL, select No Auth, and save."),
    ],
    docsUrl: "https://v0.app/docs/MCP",
    popular: true,
  },
  {
    id: "replit",
    name: "Replit",
    maker: "Replit",
    category: "builder",
    kind: "mcp",
    tagline: "Rankbox research in every Replit Agent project.",
    mark: { simple: "replit" },
    aliases: ["replit agent", "no-code"],
    steps: [
      { text: "Open Integrations → MCP Servers → + Add MCP server." },
      url("Name it Rankbox and paste the server URL. Skip Advanced settings."),
      { text: "Click Test & save. It works in all your projects." },
    ],
    docsUrl: "https://docs.replit.com/build/connect-via-mcp",
    popular: true,
  },
  {
    id: "base44",
    name: "Base44",
    maker: "Wix",
    category: "builder",
    kind: "mcp",
    tagline: "Plan content while Base44 builds your app.",
    mark: { mono: "B", color: "#F97316" },
    aliases: ["wix", "no-code"],
    plan: "Builder plan or higher. It works in the builder's chat, not in your published app.",
    steps: [
      { text: "Click your workspace name (bottom left) → Settings." },
      { text: "Open Account → MCP connections → Add custom MCP." },
      url("Name it Rankbox, paste the server URL, and set Authentication to Not required."),
      { text: "Click Test, then Test & add." },
    ],
    docsUrl: "https://docs.base44.com/documentation/account-and-billing/setting-up-a-custom-mcp",
  },
  {
    id: "figma-make",
    name: "Figma Make",
    maker: "Figma",
    category: "builder",
    kind: "mcp",
    tagline: "Design pages around the questions people actually ask.",
    mark: { simple: "figma" },
    aliases: ["figma", "figma agent", "no-code"],
    plan: "Paid plans with a Full seat.",
    steps: [
      { text: "In the chat box, open Add context → Connectors → Manage." },
      { text: "On the Created by you tab, click Create." },
      url("Name it Rankbox, paste the server URL, and choose No authentication."),
      { text: "Click Create, then Connect and turn on its tools." },
    ],
    docsUrl:
      "https://help.figma.com/hc/en-us/articles/38147204302743-Create-and-use-custom-MCP-connectors-in-the-Figma-agent-and-Figma-Make",
  },
  {
    id: "macaly",
    name: "Macaly",
    maker: "Macaly",
    category: "builder",
    kind: "mcp",
    tagline: "Research and SEO copy for the sites Macaly builds.",
    mark: { mono: "M", color: "#2563EB" },
    aliases: ["no-code"],
    plan: "All plans.",
    steps: [
      { text: "Open Settings → MCP Servers → Add server, then choose Advanced." },
      url("Name it Rankbox and paste the server URL."),
      { text: "Set Transport to Streamable HTTP and leave API headers empty." },
      { text: "Click Test connection, save, then turn the tools on." },
    ],
    docsUrl: "https://www.macaly.com/docs/en/integrations/other-tools",
  },
  {
    id: "dyad",
    name: "Dyad",
    maker: "Dyad",
    category: "builder",
    kind: "mcp",
    tagline: "Rankbox tools in the local, open-source app builder.",
    mark: { mono: "D", color: "#0EA5E9" },
    aliases: ["local", "open source", "no-code"],
    plan: "Free. Version 0.22 or later.",
    steps: [
      { text: "Open Settings → MCP." },
      url("Add a server with HTTP transport and paste the server URL."),
      { text: "In chat, switch from Build to Agent mode and approve Rankbox's tools." },
    ],
    docsUrl: "https://www.dyad.sh/blog/extend-dyad-with-mcp-servers",
  },
  {
    id: "dify",
    name: "Dify",
    maker: "Dify",
    category: "builder",
    kind: "mcp",
    tagline: "Give your Dify agents and workflows Rankbox's research.",
    mark: { simple: "dify" },
    aliases: ["langgenius", "agent builder"],
    plan: "Version 1.6.0 or later.",
    steps: [
      { text: "Open Integrations → Tools → MCP." },
      { text: "Click Add MCP Server (HTTP)." },
      url("Paste the server URL, name it Rankbox, and set the identifier to rankbox."),
      { text: "Use it in an Agent app or a workflow's Agent node." },
    ],
    docsUrl: "https://docs.dify.ai/en/cloud/use-dify/build/mcp",
  },
  {
    id: "langflow",
    name: "Langflow",
    maker: "DataStax",
    category: "builder",
    kind: "mcp",
    tagline: "Drop Rankbox's tools into a Langflow agent.",
    mark: { simple: "langflow" },
    aliases: ["agent builder", "open source"],
    steps: [
      { text: "Open your profile → Settings → MCP Servers → Add MCP Server." },
      url("Choose HTTP/SSE, name it rankbox, paste the server URL, and save."),
      {
        text: "Add the MCP Tools component with Tool Mode on, and connect it to your Agent's Tools.",
      },
    ],
    docsUrl: "https://docs.langflow.org/mcp-client",
  },
  {
    id: "flowise",
    name: "Flowise",
    maker: "Flowise",
    category: "builder",
    kind: "mcp",
    tagline: "Give a Flowise agent Rankbox's content tools.",
    mark: { mono: "F", color: "#4F46E5" },
    aliases: ["agentflow", "agent builder", "open source"],
    steps: [
      { text: "In an Agentflow, add an Agent node." },
      { text: "Add a Custom MCP tool." },
      config("Paste this as its configuration.", undefined, json({ url: MCP_URL })),
      { text: "Refresh Available Actions and select Rankbox's tools." },
    ],
    docsUrl: "https://docs.flowiseai.com/tutorials/tools-and-mcp",
  },
  {
    id: "relevance-ai",
    name: "Relevance AI",
    maker: "Relevance AI",
    category: "builder",
    kind: "mcp",
    tagline: "Give your AI workforce Rankbox's research tools.",
    mark: { mono: "R", color: "#6D28D9" },
    aliases: ["relevance", "agent builder"],
    steps: [
      { text: "Open your agent and go to Tools → Add MCP." },
      { text: "Choose Connect my own." },
      url("Paste the server URL, add a label, and skip authentication."),
    ],
    docsUrl: "https://relevanceai.com/docs/integrations/mcp/mcp-client",
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs Agents",
    maker: "ElevenLabs",
    category: "builder",
    kind: "mcp",
    tagline: "Voice agents that answer with real content research.",
    mark: { simple: "elevenlabs" },
    aliases: ["elevenlabs", "voice", "conversational ai"],
    plan: "Any plan, except Zero Retention and HIPAA workspaces.",
    steps: [
      { text: "Open the MCP server integrations dashboard → Add Custom MCP Server." },
      url("Name it Rankbox, paste the server URL, and leave Secret Token blank."),
      { text: "Choose the HTTP streamable transport, then Add Integration." },
      { text: "Attach it to your agent." },
    ],
    docsUrl: "https://elevenlabs.io/docs/agents-platform/customization/tools/mcp",
  },
  {
    id: "vapi",
    name: "Vapi",
    maker: "Vapi",
    category: "builder",
    kind: "mcp",
    tagline: "Give your voice assistant Rankbox's tools.",
    mark: { mono: "V", color: "#10B981" },
    aliases: ["voice"],
    steps: [
      { text: "Open Tools → Create Tool → MCP." },
      url("Name it Rankbox and paste the server URL."),
      { text: "In your assistant's Tools, select it, then publish." },
    ],
    docsUrl: "https://docs.vapi.ai/tools/mcp",
  },
];

/* ── Coding agents ─────────────────────────────────────────────── */

const CODING: Connector[] = [
  {
    id: "claude-code",
    name: "Claude Code",
    maker: "Anthropic",
    category: "coding",
    kind: "mcp",
    tagline: "Write meta descriptions and briefs from your terminal.",
    mark: { simple: "claudecode" },
    aliases: ["anthropic", "cli", "terminal"],
    plan: "Any Claude Code plan.",
    steps: [
      command("Run this in your terminal.", `claude mcp add --transport http rankbox ${MCP_URL}`),
      { text: "Add --scope user to use it in every project." },
    ],
    alternative: config(
      "Or share it with your team in the project's .mcp.json:",
      ".mcp.json",
      servers({ type: "http", url: MCP_URL }),
    ),
    docsUrl: "https://code.claude.com/docs/en/mcp",
    popular: true,
  },
  {
    id: "codex",
    name: "Codex",
    maker: "OpenAI",
    category: "coding",
    kind: "mcp",
    tagline: "Rankbox's tools in the Codex CLI, IDE extension, and desktop app.",
    mark: { landing: "chatgpt" },
    aliases: ["openai", "openai codex", "cli", "terminal"],
    plan: "Any ChatGPT plan that includes Codex, or an API key.",
    steps: [
      command("Run this in your terminal.", `codex mcp add rankbox --url ${MCP_URL}`),
      { text: "The CLI, IDE extension, and ChatGPT desktop app share this setting." },
    ],
    alternative: config(
      "Or add it to your config file:",
      "~/.codex/config.toml",
      `[mcp_servers.rankbox]\nurl = "${MCP_URL}"`,
    ),
    note: "Codex cloud tasks can't use MCP servers yet.",
    docsUrl: "https://learn.chatgpt.com/docs/extend/mcp?surface=cli",
    popular: true,
  },
  {
    id: "cursor",
    name: "Cursor",
    maker: "Anysphere",
    category: "coding",
    kind: "mcp",
    tagline: "Pull briefs and metadata into the pages you're coding.",
    mark: { simple: "cursor" },
    aliases: ["ide", "editor"],
    plan: "All plans. Team admins can restrict MCP servers.",
    steps: [
      config(
        "Add Rankbox to your global MCP config.",
        "~/.cursor/mcp.json",
        servers({ url: MCP_URL }),
      ),
      { text: "Or put it in .cursor/mcp.json to share it with a project." },
      { text: "Open Cursor Settings → Tools & MCP and make sure Rankbox is on." },
    ],
    docsUrl: "https://cursor.com/docs/context/mcp",
    popular: true,
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    maker: "GitHub",
    category: "coding",
    kind: "mcp",
    tagline: "Rankbox's tools in Copilot Chat in VS Code.",
    mark: { simple: "githubcopilot" },
    aliases: ["vs code", "vscode", "visual studio code", "copilot", "microsoft"],
    plan: "Free, Pro, Pro+, and Max. On Business and Enterprise, an admin turns on the MCP servers policy first.",
    steps: [
      { text: "Open the Command Palette and run MCP: Add Server." },
      url("Choose HTTP, paste the server URL, and name it rankbox."),
      { text: "Start the server and trust it when VS Code asks." },
    ],
    alternative: config(
      "Or share it with your workspace:",
      ".vscode/mcp.json",
      json({ servers: { rankbox: { type: "http", url: MCP_URL } } }),
    ),
    docsUrl: "https://code.visualstudio.com/docs/copilot/customization/mcp-servers",
  },
  {
    id: "devin-desktop",
    name: "Devin Desktop",
    maker: "Cognition",
    category: "coding",
    kind: "mcp",
    tagline: "Formerly Windsurf. Rankbox's tools in the agent panel.",
    mark: { mono: "D", color: "#0B100F" },
    aliases: ["windsurf", "cascade", "codeium", "devin", "cognition"],
    plan: "All plans. Team allowlists and Enterprise settings can block new servers.",
    steps: [
      { text: "In the agent panel, open … → Open MCP config file." },
      config(
        "Add Rankbox. The key is serverUrl, not url.",
        "~/.config/devin/mcp_config.json",
        servers({ serverUrl: MCP_URL }),
      ),
      { text: "Save, then refresh MCPs." },
    ],
    note: "Windsurf became Devin Desktop in June 2026. On Windows, the file is %APPDATA%\\devin\\mcp_config.json.",
    docsUrl: "https://docs.devin.ai/desktop/cascade/mcp",
  },
  {
    id: "gemini-cli",
    name: "Gemini CLI",
    maker: "Google",
    category: "coding",
    kind: "mcp",
    tagline: "Rankbox's research from Google's terminal agent.",
    mark: { simple: "googlegemini" },
    aliases: ["google", "gemini", "cli", "terminal"],
    plan: "Free with a Google account.",
    steps: [
      command(
        "Run this in your terminal.",
        `gemini mcp add --transport http -s user rankbox ${MCP_URL}`,
      ),
    ],
    alternative: config(
      "Or add it to your settings. The key is httpUrl; url means the older SSE transport.",
      "~/.gemini/settings.json",
      servers({ httpUrl: MCP_URL }),
    ),
    docsUrl: "https://geminicli.com/docs/tools/mcp-server/",
  },
  {
    id: "zed",
    name: "Zed",
    maker: "Zed Industries",
    category: "coding",
    kind: "mcp",
    tagline: "Rankbox's tools in Zed's agent panel.",
    mark: { simple: "zedindustries" },
    aliases: ["editor", "ide"],
    plan: "Free.",
    steps: [
      { text: "Open Settings → AI → MCP Servers." },
      { text: "Click Add Server → Add Remote Server." },
      url("Name it rankbox and paste the server URL."),
    ],
    alternative: config(
      "Or add it to settings.json:",
      "settings.json",
      json({ context_servers: { rankbox: { url: MCP_URL } } }),
    ),
    docsUrl: "https://zed.dev/docs/ai/mcp",
  },
  {
    id: "jetbrains",
    name: "JetBrains AI",
    maker: "JetBrains",
    category: "coding",
    kind: "mcp",
    tagline: "Rankbox in AI Assistant across IntelliJ, WebStorm, and more.",
    mark: { simple: "jetbrains" },
    aliases: ["ai assistant", "intellij", "webstorm", "pycharm", "phpstorm", "ide"],
    plan: "AI Assistant 2026.2 or later with a JetBrains AI subscription.",
    steps: [
      { text: "Open Settings → Tools → AI Assistant → Model Context Protocol (MCP)." },
      { text: "Click Add and choose Streamable HTTP." },
      config(
        "Paste this, then pick global or project level.",
        undefined,
        servers({ url: MCP_URL }),
      ),
      { text: "Click OK, then Apply." },
    ],
    docsUrl: "https://www.jetbrains.com/help/ai-assistant/mcp.html",
  },
  {
    id: "cline",
    name: "Cline",
    maker: "Cline",
    category: "coding",
    kind: "mcp",
    tagline: "Rankbox's tools in the open-source coding agent.",
    mark: { simple: "cline" },
    aliases: ["vs code", "open source"],
    plan: "Free.",
    steps: [
      { text: "Click the MCP Servers icon and open Remote Servers." },
      url("Name it rankbox and paste the server URL."),
      { text: "Choose Streamable HTTP, then click Add Server." },
    ],
    docsUrl: "https://docs.cline.bot/mcp/connecting-to-a-remote-server",
  },
  {
    id: "roo-code",
    name: "Roo Code",
    maker: "Roo Code",
    category: "coding",
    kind: "mcp",
    tagline: "Give Roo's agents Rankbox's content tools.",
    mark: { mono: "R", color: "#7C3AED" },
    aliases: ["roo", "vs code", "open source"],
    plan: "Free.",
    steps: [
      { text: "Open Settings → MCP, then Edit Global MCP (or Edit Project MCP)." },
      config(
        "Add Rankbox and save.",
        "mcp_settings.json",
        servers({ type: "streamable-http", url: MCP_URL }),
      ),
    ],
    docsUrl: "https://roocodeinc.github.io/Roo-Code/features/mcp/using-mcp-in-roo",
  },
  {
    id: "continue",
    name: "Continue",
    maker: "Continue",
    category: "coding",
    kind: "mcp",
    tagline: "Rankbox's tools in Continue's Agent mode.",
    mark: { mono: "C", color: "#111827" },
    aliases: ["continue.dev", "vs code", "jetbrains", "open source"],
    plan: "Free. MCP works in Agent mode.",
    steps: [
      config(
        "Create this file in your project.",
        ".continue/mcpServers/rankbox.yaml",
        `mcpServers:\n  - name: rankbox\n    type: streamable-http\n    url: ${MCP_URL}`,
      ),
      { text: "Switch to Agent mode to use it." },
    ],
    docsUrl: "https://docs.continue.dev/customize/deep-dives/mcp",
  },
  {
    id: "kiro",
    name: "Kiro",
    maker: "AWS",
    category: "coding",
    kind: "mcp",
    tagline: "Rankbox's tools in Amazon's spec-driven IDE.",
    mark: { mono: "K", color: "#7B3FE4" },
    aliases: ["aws", "amazon", "ide"],
    steps: [
      { text: "Open the Command Palette and run Kiro: Open user MCP config (JSON)." },
      config("Add Rankbox and save.", "~/.kiro/settings/mcp.json", servers({ url: MCP_URL })),
    ],
    docsUrl: "https://kiro.dev/docs/mcp/configuration/",
  },
  {
    id: "trae",
    name: "Trae",
    maker: "ByteDance",
    category: "coding",
    kind: "mcp",
    tagline: "Rankbox's tools in the Trae IDE.",
    mark: { simple: "trae" },
    aliases: ["bytedance", "ide"],
    steps: [
      { text: "Open Settings (top right) → MCP, then Add → Add Manually." },
      config("Paste this.", undefined, servers({ url: MCP_URL })),
      { text: "Click Confirm." },
    ],
    docsUrl: "https://docs.trae.ai/ide/add-mcp-servers",
  },
  {
    id: "warp",
    name: "Warp",
    maker: "Warp",
    category: "coding",
    kind: "mcp",
    tagline: "Rankbox's tools in Warp's terminal agent.",
    mark: { simple: "warp" },
    aliases: ["terminal"],
    steps: [
      { text: "Open Settings → Agents → MCP servers and click + Add." },
      config("Paste this and save.", undefined, json({ rankbox: { url: MCP_URL } })),
    ],
    docsUrl: "https://docs.warp.dev/knowledge-and-collaboration/mcp",
  },
  {
    id: "goose",
    name: "Goose",
    maker: "Block",
    category: "coding",
    kind: "mcp",
    tagline: "Give the open-source Goose agent Rankbox's tools.",
    mark: { mono: "G", color: "#111827" },
    aliases: ["block", "open source", "cli"],
    plan: "Free.",
    steps: [
      { text: "Open Extensions → Add custom extension." },
      url("Choose Streamable HTTP and paste the server URL."),
      {
        text: "Click Add. In the CLI, run goose configure → Add Extension → Remote Extension instead.",
      },
    ],
    docsUrl: "https://goose-docs.ai/docs/getting-started/using-extensions/",
  },
  {
    id: "amp",
    name: "Amp",
    maker: "Amp",
    category: "coding",
    kind: "mcp",
    tagline: "Rankbox's tools in the Amp coding agent.",
    mark: { mono: "A", color: "#F34E3F" },
    aliases: ["ampcode", "sourcegraph", "cli"],
    steps: [command("Run this in your terminal.", `amp mcp add rankbox ${MCP_URL}`)],
    docsUrl: "https://ampcode.com/docs/customize/mcp",
  },
  {
    id: "factory",
    name: "Factory Droid",
    maker: "Factory",
    category: "coding",
    kind: "mcp",
    tagline: "Give Factory's Droids Rankbox's research tools.",
    mark: { mono: "F", color: "#111827" },
    aliases: ["droid", "factory.ai", "cli"],
    steps: [
      command(
        "Run this in your terminal.",
        `droid mcp add rankbox ${MCP_URL} --type http --no-oauth`,
      ),
    ],
    docsUrl: "https://docs.factory.ai/cli/configuration/mcp",
  },
  {
    id: "opencode",
    name: "OpenCode",
    maker: "OpenCode",
    category: "coding",
    kind: "mcp",
    tagline: "Rankbox's tools in the open-source terminal agent.",
    mark: { simple: "opencode" },
    aliases: ["sst", "open source", "cli", "terminal"],
    plan: "Free.",
    steps: [
      config(
        "Add Rankbox to your config.",
        "opencode.json",
        json({ mcp: { rankbox: { type: "remote", url: MCP_URL, enabled: true } } }),
      ),
      command("Check it's connected.", "opencode mcp list"),
    ],
    docsUrl: "https://opencode.ai/docs/mcp-servers/",
  },
  {
    id: "augment",
    name: "Augment Code",
    maker: "Augment",
    category: "coding",
    kind: "mcp",
    tagline: "Rankbox's tools in Augment's coding agent.",
    mark: { mono: "A", color: "#16A34A" },
    aliases: ["augment", "vs code"],
    steps: [
      { text: "Open Settings (gear) → MCP." },
      { text: "Click + Add remote MCP and choose HTTP." },
      url("Name it rankbox, paste the server URL, and save."),
    ],
    docsUrl: "https://docs.augmentcode.com/setup-augment/mcp",
  },
];

/* ── Automation ────────────────────────────────────────────────── */

const AUTOMATION: Connector[] = [
  {
    id: "n8n",
    name: "n8n",
    maker: "n8n",
    category: "automation",
    kind: "mcp",
    tagline: "Generate briefs and metadata inside n8n workflows.",
    mark: { simple: "n8n" },
    aliases: ["workflow", "automation"],
    plan: "Version 1.104.0 or later, cloud or self-hosted.",
    steps: [
      { text: "Add an AI Agent node." },
      { text: "On its Tool connector, add the MCP Client Tool node." },
      url("Set Server Transport to HTTP Streamable and paste the server URL."),
      { text: "Set Authentication to None and Tools to Include to All." },
    ],
    docsUrl:
      "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolmcp/",
  },
  {
    id: "zapier",
    name: "Zapier",
    maker: "Zapier",
    category: "automation",
    kind: "mcp",
    tagline: "Run Rankbox's tools as a step in any Zap.",
    mark: { simple: "zapier" },
    aliases: ["zap", "workflow", "automation"],
    plan: "Professional, Team, or Enterprise. MCP Client is in beta.",
    steps: [
      { text: "Open Apps → + Add connection and choose MCP Client." },
      url("Paste the server URL and set Transport to Streamable HTTP."),
      { text: "Leave OAuth and Bearer Token empty, then save." },
      { text: "In a Zap, use MCP Client's Run Tool action." },
    ],
    docsUrl:
      "https://help.zapier.com/hc/en-us/articles/38777069364109-Connect-remote-MCP-servers-to-Zapier-using-MCP-Client",
  },
  {
    id: "make",
    name: "Make",
    maker: "Make",
    category: "automation",
    kind: "mcp",
    tagline: "Call Rankbox's tools from a Make scenario.",
    mark: { simple: "make" },
    aliases: ["make.com", "integromat", "workflow", "automation"],
    plan: "MCP Client is in open beta.",
    steps: [
      { text: "Add the MCP Client module (Call a tool) to a scenario." },
      { text: "Click Create a connection, then + New MCP Server." },
      url("Paste the server URL, leave the API key empty, and save."),
    ],
    docsUrl: "https://apps.make.com/mcp-client",
  },
  {
    id: "gumloop",
    name: "Gumloop",
    maker: "Gumloop",
    category: "automation",
    kind: "mcp",
    tagline: "Give Gumloop agents and flows Rankbox's research.",
    mark: { mono: "G", color: "#EC4899" },
    aliases: ["workflow", "automation"],
    steps: [
      { text: "Open Settings → Connectors → the arrow by Add Connector → Add MCP Connector." },
      url("Paste the server URL and click Connect."),
      { text: "In your agent, open Connectors → Add Connector and pick Rankbox." },
    ],
    docsUrl: "https://docs.gumloop.com/nodes/mcp/custom_mcp_servers",
  },
  {
    id: "sim",
    name: "Sim",
    maker: "Sim",
    category: "automation",
    kind: "mcp",
    tagline: "Add Rankbox to Sim's agent workflows.",
    mark: { mono: "S", color: "#701FFC" },
    aliases: ["sim studio", "workflow", "automation"],
    steps: [
      { text: "Open Settings → MCP Tools → Add." },
      url("Name it rankbox, paste the server URL, and set Transport to streamable-http."),
      { text: "Click Test Connection and save, then add it to an Agent block under MCP Servers." },
    ],
    docsUrl: "https://docs.sim.ai/agents/mcp",
  },
  {
    id: "copilot-studio",
    name: "Copilot Studio",
    maker: "Microsoft",
    category: "automation",
    kind: "mcp",
    tagline: "Give your Microsoft Copilot agents Rankbox's tools.",
    mark: { landing: "copilot" },
    aliases: ["microsoft", "copilot", "power platform", "teams"],
    plan: "A Copilot Studio license. Your data policies govern the connector.",
    steps: [
      { text: "Open your agent → Tools → Add a tool → New tool → Model Context Protocol." },
      url("Fill in a name and description, and paste the server URL."),
      { text: "Set Authentication to None, then click Create." },
      { text: "Choose Create a new connection → Add to agent." },
    ],
    docsUrl:
      "https://learn.microsoft.com/en-us/microsoft-copilot-studio/mcp-add-existing-server-to-agent",
  },
];

/* ── Developer ─────────────────────────────────────────────────── */

const DEVELOPER: Connector[] = [
  {
    id: "api",
    name: "REST API",
    maker: "Rankbox",
    category: "developer",
    kind: "api",
    tagline: "Pull published articles into any site or build step.",
    mark: { rankbox: "api" },
    aliases: ["api", "custom", "any site", "headless", "next.js", "developer", "rest"],
    steps: [],
    docsUrl: "https://rankbox.xyz/integrations/api",
  },
  {
    id: "any-mcp",
    name: "Any MCP client",
    maker: "Rankbox",
    category: "developer",
    kind: "mcp",
    tagline: "Anything that adds a remote MCP server by URL works.",
    mark: { rankbox: "mcp" },
    aliases: ["mcp", "custom", "other", "model context protocol", "streamable http"],
    steps: [
      url("Add a remote MCP server with this URL."),
      { text: "Choose Streamable HTTP (sometimes just called HTTP) as the transport." },
      { text: "Leave authentication off. Rankbox doesn't need a key here." },
    ],
    docsUrl: "https://modelcontextprotocol.io/docs/getting-started/intro",
  },
];

export const CONNECTORS: Connector[] = [
  ...WEBSITES,
  ...ASSISTANTS,
  ...BUILDERS,
  ...CODING,
  ...AUTOMATION,
  ...DEVELOPER,
];

export function getConnector(id: string | undefined): Connector | undefined {
  return id ? CONNECTORS.find((c) => c.id === id) : undefined;
}

/**
 * Tools people ask for that can't add a remote MCP server by URL yet, and
 * why. A search that hits one says so, rather than showing nothing.
 */
export const NOT_SUPPORTED: { name: string; aliases?: string[]; reason: string }[] = [
  {
    name: "Rocket",
    aliases: ["rocket.new"],
    reason:
      "Rocket's connectors are a fixed list of built-in services, with no way to add your own MCP server yet.",
  },
  {
    name: "Bubble",
    reason:
      "Bubble can't call MCP servers. Its MCP support is for outside agents working on your Bubble app.",
  },
  {
    name: "Glide",
    reason: "Glide's agent can't call outside tools yet.",
  },
  {
    name: "Webflow AI",
    aliases: ["webflow ai"],
    reason:
      "Webflow's AI can't call outside MCP servers. To publish to Webflow, use the Webflow connector instead.",
  },
  {
    name: "Framer AI",
    aliases: ["framer ai"],
    reason:
      "Framer's AI can't call outside MCP servers. To publish to Framer, use the Framer connector instead.",
  },
  {
    name: "Anything",
    aliases: ["create.xyz", "create"],
    reason:
      "Anything (formerly Create) connects to outside services through APIs, not MCP servers.",
  },
  { name: "Mocha", reason: "Mocha doesn't support MCP servers yet." },
  {
    name: "Same",
    aliases: ["same.new"],
    reason: "Same's integrations are a fixed list, with no custom MCP servers yet.",
  },
  {
    name: "Tempo",
    aliases: ["tempo labs"],
    reason: "Tempo can't call outside MCP servers yet.",
  },
  { name: "Poe", reason: "Poe doesn't support custom MCP servers yet." },
  {
    name: "Emergent",
    reason: "Emergent only documents local MCP servers, not remote ones added by URL.",
  },
];

/* ── Search ────────────────────────────────────────────────────── */

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/**
 * Score a connector against a query: 0 means no match. Name matches beat
 * alias matches, which beat maker, category, and tagline matches, so
 * "copilot" puts GitHub Copilot and Copilot Studio above anything that
 * merely mentions it.
 */
export function matchScore(c: Connector, query: string): number {
  const q = norm(query);
  if (!q) return 1;
  const name = norm(c.name);
  if (name === q) return 100;
  if (name.startsWith(q)) return 80;
  if (name.includes(q)) return 60;
  const aliases = (c.aliases ?? []).map(norm);
  if (aliases.some((a) => a === q || a.startsWith(q))) return 50;
  if (aliases.some((a) => a.includes(q))) return 40;
  if (norm(c.maker).includes(q)) return 30;
  const label = CATEGORIES.find((cat) => cat.id === c.category)?.label ?? "";
  if (norm(label).includes(q)) return 20;
  // Every word of a multi-word query somewhere in the tagline.
  const tagline = norm(c.tagline);
  if (q.split(" ").every((w) => tagline.includes(w))) return 10;
  return 0;
}

export function searchConnectors(query: string, list: Connector[] = CONNECTORS): Connector[] {
  return list
    .map((c, i) => ({ c, i, s: matchScore(c, query) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .map((r) => r.c);
}

/** A not-supported tool the query names, if any. */
export function unsupportedMatch(query: string) {
  const q = norm(query);
  if (q.length < 3) return undefined;
  // "webflow" means the Webflow connector, not Webflow AI.
  if (CONNECTORS.some((c) => norm(c.name).startsWith(q))) return undefined;
  return NOT_SUPPORTED.find((t) =>
    [t.name, ...(t.aliases ?? [])].map(norm).some((n) => n === q || n.startsWith(q)),
  );
}
