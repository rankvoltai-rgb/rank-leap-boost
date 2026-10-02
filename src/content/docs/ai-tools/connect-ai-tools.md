---
title: Connect your AI tools
nav_title: Connect AI tools
description: Add the Rankbox MCP server to Claude, ChatGPT, Cursor, VS Code, Lovable and 44 more AI tools, check that it works, and fix common setup problems.
order: 2
updated: 2026-10-02
---

Connecting an AI tool to Rankbox means adding one remote MCP server, `https://rankbox.xyz/mcp`, to that tool. Once it's added, the tool can call Rankbox's three research tools when you ask for AI search questions, a content brief or meta descriptions.

The same setup steps are in the product at **Dashboard → Integrations**, where you can search for your tool, open its setup panel and copy the URL, command or config with one click. Every tool also has a public setup page at `/integrations/<tool>`, linked in the table below.

## What you need to connect

- **The server URL:** `https://rankbox.xyz/mcp`. It's the same for everyone.
- **A client that can add a remote MCP server by URL**, using the Streamable HTTP transport. Some tools call it just HTTP.
- **No key and no sign-in.** The server needs no API key, token or OAuth. Choose the "no authentication" option your tool offers.

The connection is for research and planning. It doesn't publish to your site and can't see your Rankbox account. To publish automatically, use a [website integration](/docs/publishing/overview) or the [REST API](/docs/api/overview).

## General steps for any MCP client

1. Open the place your tool adds MCP servers or connectors. It is often called **Connectors**, **MCP Servers**, **Tools** or **Integrations**.
2. Add a new custom or remote server and name it `rankbox` or `Rankbox`.
3. Paste `https://rankbox.xyz/mcp` as the server URL.
4. Choose **Streamable HTTP** (or **HTTP**) as the transport if the tool asks.
5. Set authentication to none, and leave headers, tokens and OAuth fields empty.
6. Save, then turn the server or its tools on if the tool asks you to.

Then ask for something, for example: "Use Rankbox to build a content brief for “best running shoes for flat feet”."

## Claude

Works on all Claude plans. The Free plan includes one custom connector; on Team and Enterprise, an owner adds it first. These steps cover Claude on the web and the Claude desktop app.

1. Open **Customize → Connectors**.
2. Click **+**, then **Add custom connector**.
3. Name it `Rankbox` and paste `https://rankbox.xyz/mcp`. Leave **Advanced settings** empty.
4. Click **Add**.

Setup page: [/integrations/claude](/integrations/claude).

## Claude Code

Works on any Claude Code plan. Run this in your terminal:

```bash title="Terminal"
claude mcp add --transport http rankbox https://rankbox.xyz/mcp
```

Add `--scope user` to use it in every project. To share it with your team, put it in the project's `.mcp.json` instead:

```json title=".mcp.json"
{
  "mcpServers": {
    "rankbox": {
      "type": "http",
      "url": "https://rankbox.xyz/mcp"
    }
  }
}
```

Setup page: [/integrations/claude-code](/integrations/claude-code).

## ChatGPT

Needs ChatGPT Plus, Pro, Business, Enterprise or Edu, on the web, with Developer mode.

1. Open **Settings → Security and login** and turn on **Developer mode**.
2. Open **ChatGPT Plugins** and click **+**.
3. Name it `Rankbox`, choose **Public endpoint**, and paste `https://rankbox.xyz/mcp`.
4. Set authentication to **No Authentication**, then click **Create**.
5. In a chat, pick Rankbox from the Developer mode tools in the composer.

Setup page: [/integrations/chatgpt](/integrations/chatgpt).

## Cursor

Works on all Cursor plans. Team admins can restrict MCP servers.

1. Add Rankbox to your global MCP config at `~/.cursor/mcp.json`, or to `.cursor/mcp.json` in a project to share it:

   ```json title="~/.cursor/mcp.json"
   {
     "mcpServers": {
       "rankbox": {
         "url": "https://rankbox.xyz/mcp"
       }
     }
   }
   ```

2. Open **Cursor Settings → Tools & MCP** and make sure Rankbox is on.

Setup page: [/integrations/cursor](/integrations/cursor).

## VS Code with GitHub Copilot

Works on Copilot Free, Pro, Pro+ and Max. On Business and Enterprise, an admin turns on the MCP servers policy first.

1. Open the Command Palette and run **MCP: Add Server**.
2. Choose **HTTP**, paste `https://rankbox.xyz/mcp`, and name it `rankbox`.
3. Start the server and trust it when VS Code asks.

To share it with your workspace, add it to `.vscode/mcp.json` instead:

```json title=".vscode/mcp.json"
{
  "servers": {
    "rankbox": {
      "type": "http",
      "url": "https://rankbox.xyz/mcp"
    }
  }
}
```

Setup page: [/integrations/github-copilot](/integrations/github-copilot).

## Devin Desktop (formerly Windsurf)

Windsurf became Devin Desktop in June 2026. Works on all plans; team allowlists and Enterprise settings can block new servers.

1. In the agent panel, open **…** → **Open MCP config file**.
2. Add Rankbox. The key is `serverUrl`, not `url`.

   ```json title="~/.config/devin/mcp_config.json"
   {
     "mcpServers": {
       "rankbox": {
         "serverUrl": "https://rankbox.xyz/mcp"
       }
     }
   }
   ```

3. Save, then refresh MCPs.

On Windows, the file is `%APPDATA%\devin\mcp_config.json`. Setup page: [/integrations/devin-desktop](/integrations/devin-desktop).

## Lovable

Works on all Lovable plans. Rankbox works in the Lovable chat while Lovable builds, not inside your published app.

1. Open **Connectors** from your dashboard or a project, click **+**, then **MCP server**.
2. Name it `Rankbox`, keep **Direct connection**, and paste `https://rankbox.xyz/mcp`.
3. Set **Authentication** to **No authentication**, then click **Add server**.

In a shared workspace, an admin may need to allow members to add their own MCP servers first. Setup page: [/integrations/lovable](/integrations/lovable).

## Codex and Gemini CLI

Both terminal agents add Rankbox with one command.

```bash title="Codex"
codex mcp add rankbox --url https://rankbox.xyz/mcp
```

```bash title="Gemini CLI"
gemini mcp add --transport http -s user rankbox https://rankbox.xyz/mcp
```

For Codex, the CLI, IDE extension and ChatGPT desktop app share this setting; it needs a ChatGPT plan that includes Codex, or an API key. Codex cloud tasks can't use MCP servers. To use a config file instead, add `[mcp_servers.rankbox]` with `url = "https://rankbox.xyz/mcp"` to `~/.codex/config.toml`.

For Gemini CLI, which is free with a Google account, the config-file key is `httpUrl` in `~/.gemini/settings.json`; `url` means the older SSE transport.

Setup pages: [/integrations/codex](/integrations/codex) and [/integrations/gemini-cli](/integrations/gemini-cli).

## All supported AI tools

Every tool below can add a remote MCP server by URL with no sign-in, and has its exact steps on its setup page and in **Dashboard → Integrations**. Menu names were checked against each maker's own docs on 22 September 2026; makers move menus, so if a step doesn't match, follow the maker's docs linked from the setup page.

### AI assistants

| Tool | Maker | Plan or version | Setup page |
| --- | --- | --- | --- |
| Claude | Anthropic | All plans; Free includes one custom connector | [/integrations/claude](/integrations/claude) |
| ChatGPT | OpenAI | Plus, Pro, Business, Enterprise or Edu, on the web, with Developer mode | [/integrations/chatgpt](/integrations/chatgpt) |
| Perplexity | Perplexity | Pro, Max or Enterprise | [/integrations/perplexity](/integrations/perplexity) |
| Le Chat | Mistral AI | All plans, including Free; in an organization, an admin adds it | [/integrations/le-chat](/integrations/le-chat) |
| Gemini Enterprise | Google | Standard, Plus, Frontline or pay-as-you-go | [/integrations/gemini-enterprise](/integrations/gemini-enterprise) |
| Raycast | Raycast | Raycast Pro | [/integrations/raycast](/integrations/raycast) |
| LM Studio | LM Studio | Free; version 0.3.17 or later | [/integrations/lm-studio](/integrations/lm-studio) |
| Open WebUI | Open WebUI | Version 0.6.31 or later; admins only | [/integrations/open-webui](/integrations/open-webui) |
| LibreChat | LibreChat | Self-hosted; your admin decides whether members can add servers | [/integrations/librechat](/integrations/librechat) |
| Msty Studio | Msty | No requirement noted | [/integrations/msty](/integrations/msty) |

### AI app builders

| Tool | Maker | Plan or version | Setup page |
| --- | --- | --- | --- |
| Lovable | Lovable | All plans; works in the Lovable chat | [/integrations/lovable](/integrations/lovable) |
| Bolt | StackBlitz | No requirement noted | [/integrations/bolt](/integrations/bolt) |
| v0 | Vercel | No requirement noted | [/integrations/v0](/integrations/v0) |
| Replit | Replit | No requirement noted | [/integrations/replit](/integrations/replit) |
| Base44 | Wix | Builder plan or higher; works in the builder's chat | [/integrations/base44](/integrations/base44) |
| Figma Make | Figma | Paid plans with a Full seat | [/integrations/figma-make](/integrations/figma-make) |
| Macaly | Macaly | All plans | [/integrations/macaly](/integrations/macaly) |
| Dyad | Dyad | Free; version 0.22 or later | [/integrations/dyad](/integrations/dyad) |
| Dify | Dify | Version 1.6.0 or later | [/integrations/dify](/integrations/dify) |
| Langflow | DataStax | No requirement noted | [/integrations/langflow](/integrations/langflow) |
| Flowise | Flowise | No requirement noted | [/integrations/flowise](/integrations/flowise) |
| Relevance AI | Relevance AI | No requirement noted | [/integrations/relevance-ai](/integrations/relevance-ai) |
| ElevenLabs Agents | ElevenLabs | Any plan except Zero Retention and HIPAA workspaces | [/integrations/elevenlabs](/integrations/elevenlabs) |
| Vapi | Vapi | No requirement noted | [/integrations/vapi](/integrations/vapi) |

### Coding agents

| Tool | Maker | Plan or version | Setup page |
| --- | --- | --- | --- |
| Claude Code | Anthropic | Any Claude Code plan | [/integrations/claude-code](/integrations/claude-code) |
| Codex | OpenAI | A ChatGPT plan that includes Codex, or an API key | [/integrations/codex](/integrations/codex) |
| Cursor | Anysphere | All plans; team admins can restrict MCP servers | [/integrations/cursor](/integrations/cursor) |
| GitHub Copilot | GitHub | Free, Pro, Pro+ and Max; Business and Enterprise need the MCP servers policy | [/integrations/github-copilot](/integrations/github-copilot) |
| Devin Desktop | Cognition | All plans; allowlists can block new servers | [/integrations/devin-desktop](/integrations/devin-desktop) |
| Gemini CLI | Google | Free with a Google account | [/integrations/gemini-cli](/integrations/gemini-cli) |
| Zed | Zed Industries | Free | [/integrations/zed](/integrations/zed) |
| JetBrains AI | JetBrains | AI Assistant 2026.2 or later with a JetBrains AI subscription | [/integrations/jetbrains](/integrations/jetbrains) |
| Cline | Cline | Free | [/integrations/cline](/integrations/cline) |
| Roo Code | Roo Code | Free | [/integrations/roo-code](/integrations/roo-code) |
| Continue | Continue | Free; MCP works in Agent mode | [/integrations/continue](/integrations/continue) |
| Kiro | AWS | No requirement noted | [/integrations/kiro](/integrations/kiro) |
| Trae | ByteDance | No requirement noted | [/integrations/trae](/integrations/trae) |
| Warp | Warp | No requirement noted | [/integrations/warp](/integrations/warp) |
| Goose | Block | Free | [/integrations/goose](/integrations/goose) |
| Amp | Amp | No requirement noted | [/integrations/amp](/integrations/amp) |
| Factory Droid | Factory | No requirement noted | [/integrations/factory](/integrations/factory) |
| OpenCode | OpenCode | Free | [/integrations/opencode](/integrations/opencode) |
| Augment Code | Augment | No requirement noted | [/integrations/augment](/integrations/augment) |

### Automation

| Tool | Maker | Plan or version | Setup page |
| --- | --- | --- | --- |
| n8n | n8n | Version 1.104.0 or later, cloud or self-hosted | [/integrations/n8n](/integrations/n8n) |
| Zapier | Zapier | Professional, Team or Enterprise, with Zapier's MCP Client app | [/integrations/zapier](/integrations/zapier) |
| Make | Make | Make's MCP Client module | [/integrations/make](/integrations/make) |
| Gumloop | Gumloop | No requirement noted | [/integrations/gumloop](/integrations/gumloop) |
| Sim | Sim | No requirement noted | [/integrations/sim](/integrations/sim) |
| Copilot Studio | Microsoft | A Copilot Studio license; your data policies govern the connector | [/integrations/copilot-studio](/integrations/copilot-studio) |

### Any other MCP client

Anything that adds a remote MCP server by URL works, even if it isn't listed: add `https://rankbox.xyz/mcp`, choose Streamable HTTP, and leave authentication off. See [/integrations/mcp](/integrations/mcp).

**Dashboard → Integrations** also lists the website connectors (WordPress, Shopify, Webflow, Framer, Square) and the REST API. Those publish articles rather than add research tools; see [How publishing works](/docs/publishing/overview).

## Tools that can't connect

These tools can't add an outside MCP server by URL, so they can't use Rankbox. Searching for one in **Dashboard → Integrations** shows "can't connect yet" with the reason.

| Tool | Why it can't connect |
| --- | --- |
| Rocket | Its connectors are a fixed list of built-in services, with no way to add your own MCP server |
| Bubble | It can't call MCP servers; its MCP support is for outside agents working on your Bubble app |
| Glide | Its agent can't call outside tools |
| Webflow AI | It can't call outside MCP servers. To publish to Webflow, use the Webflow connector |
| Framer AI | It can't call outside MCP servers. To publish to Framer, use the Framer connector |
| Anything (formerly Create) | It connects to outside services through APIs, not MCP servers |
| Mocha | It doesn't support MCP servers |
| Same | Its integrations are a fixed list, with no custom MCP servers |
| Tempo | It can't call outside MCP servers |
| Poe | It doesn't support custom MCP servers |
| Emergent | It only documents local MCP servers, not remote ones added by URL |

## Check that the connection works

1. Look for Rankbox's tools in your client's tool list. You should see three: `generate_ai_questions`, `generate_content_brief` and `write_meta_descriptions`.
2. Ask for something one of them does, for example: "What questions do people ask AI about home solar batteries? Use Rankbox."
3. Approve the tool call if your client asks.
4. Wait for the result. A brief can take 20 seconds or more, because each call is a live AI model call.

To rule out your client, test the server directly with MCP Inspector or curl, as shown in [The Rankbox MCP server](/docs/ai-tools/mcp-server#test-the-rankbox-mcp-server-with-curl).

## Troubleshooting

### The client asks me to sign in or authorize

Rankbox doesn't use OAuth. Choose your client's no-authentication option (**No Authentication**, **No auth**, **None** or **Not required**) and leave tokens and headers empty. Rankbox's OAuth discovery address returns 404 on purpose. A client that only accepts servers with OAuth can't connect.

### The client only runs local servers

Some desktop clients only launch local (stdio) servers from a config file and can't add a remote URL. For those, a local bridge such as the open-source `mcp-remote` package can relay to Rankbox. It needs Node.js and isn't maintained by Rankbox.

```json title="Client config"
{
  "mcpServers": {
    "rankbox": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://rankbox.xyz/mcp"]
    }
  }
}
```

Hosted tools listed in [Tools that can't connect](#tools-that-cant-connect) can't use a bridge either.

### The server is added but no tools appear

- Check that the URL is exactly `https://rankbox.xyz/mcp`, with no trailing path.
- Check the transport is Streamable HTTP or HTTP, not SSE. In Gemini CLI, use `httpUrl`; in Devin Desktop, use `serverUrl`.
- Turn the server or its tools on. Cursor, Bolt, Figma Make, Macaly and others add servers switched off or need them enabled per project.
- In a team or enterprise workspace, ask your admin whether custom MCP servers are allowed.

### A tool call fails

A result that says `tool execution failed` means the AI model didn't return usable output. Try again, or rephrase the topic or keyword. Input errors such as a topic shorter than two characters come back as `Input validation error`. See [Errors](/docs/ai-tools/tools-reference#errors-from-the-rankbox-mcp-tools).

### The tool times out

Content briefs can take 20 seconds or more. Raise your client's tool timeout to at least 60 seconds if it allows.

## Related

- [The Rankbox MCP server](/docs/ai-tools/mcp-server) — transport, access, testing and privacy
- [MCP tool reference](/docs/ai-tools/tools-reference) — inputs, outputs and example prompts
- [How publishing works](/docs/publishing/overview) — connecting your website instead
- [API overview](/docs/api/overview) — working with your articles from code
