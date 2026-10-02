---
title: The Rankbox MCP server
nav_title: MCP server
description: The Rankbox MCP server at rankbox.xyz/mcp, covering transport, its three tools, access and limits, and how to test it with MCP Inspector or curl.
order: 1
updated: 2026-10-02
---

The Rankbox MCP server gives any AI tool that speaks the Model Context Protocol (MCP) three research tools: the questions people ask AI about a topic, an SEO content brief for a keyword, and meta descriptions for a page. You add one URL, `https://rankbox.xyz/mcp`, to Claude, ChatGPT, Cursor, Lovable or another MCP client, and the assistant calls the tools when you ask for that kind of work.

Use this page to understand how the server behaves and to test it by hand. For step-by-step setup in each client, see [Connect your AI tools](/docs/ai-tools/connect-ai-tools); for every tool's inputs and outputs, see the [MCP tool reference](/docs/ai-tools/tools-reference).

## Rankbox MCP server at a glance

| Property | Value |
| --- | --- |
| Server URL | `https://rankbox.xyz/mcp` |
| Transport | Streamable HTTP. Send JSON-RPC 2.0 messages with `POST` |
| Server name | `rankbox-mcp`, title "Rankbox MCP", version `0.1.0` |
| Authentication | None. No sign-in, API key or OAuth |
| Sessions | Stateless. The server issues no `Mcp-Session-Id`; every request stands alone |
| Response format | Server-sent events: each response is one `event: message` with a JSON-RPC body |
| Protocol versions | `2025-11-25`, `2025-06-18`, `2025-03-26`, `2024-11-05`, `2024-10-07` |
| Capabilities | Tools only. No resources and no prompts |
| Tools | `generate_ai_questions`, `generate_content_brief`, `write_meta_descriptions` |
| CORS | Open to any origin, so browser-based clients can connect |

When a client asks for a protocol version the server doesn't support during `initialize`, the server answers with `2025-11-25`. On later requests, an unsupported `MCP-Protocol-Version` header is rejected with HTTP 400.

## What the Rankbox MCP server exposes

The server exposes three tools and a short instruction text that tells the assistant when to use each one.

| Tool | Title | Input | What it returns |
| --- | --- | --- | --- |
| `generate_ai_questions` | Generate AI search questions | `topic`, 2 to 200 characters | Questions people ask AI assistants about the topic, grouped by intent |
| `generate_content_brief` | Generate SEO content brief | `keyword`, 2 to 200 characters | A working title, an H2 outline with talking points, questions to answer and entities to mention |
| `write_meta_descriptions` | Write meta descriptions | `topic`, 2 to 600 characters | Up to three meta descriptions for the page |

All three are marked read-only (`readOnlyHint: true`): they change nothing anywhere. They are not idempotent (`idempotentHint: false`) because each call asks an AI model for fresh output, so the same input gives different results. They are marked open-world (`openWorldHint: true`) because they reach an outside AI model.

Every result comes back twice: as Markdown text in `content`, for the assistant to read and show you, and as JSON in `structuredContent`, for clients and agents that want fields. The [MCP tool reference](/docs/ai-tools/tools-reference) documents both.

`resources/list` and `prompts/list` return JSON-RPC error `-32601` "Method not found", because the server offers neither.

## Authentication and access

The Rankbox MCP server doesn't require a sign-in, an API key, OAuth or a Rankbox account. Any MCP client that can reach `https://rankbox.xyz/mcp` gets all three tools, whether or not the person using it has a Rankbox plan.

That also means the server doesn't know who is calling. Its tools don't read or change anything in a Rankbox account: they can't see your keywords, articles, credits or sites, and they can't publish. To work with your account's articles from code, use the [REST API](/docs/api/overview).

When you add the server to a client, choose the option for no authentication. Clients name it differently: **No Authentication**, **No auth**, **None**, **Not required**. Leave headers, bearer tokens and OAuth fields empty.

> [!NOTE]
> The MCP server is included with every Rankbox plan, including the free trial. It doesn't check for a plan, so it works the same for someone without one.

## Rate limits and response times

Rankbox applies no per-client quota or rate limit to the MCP server. This differs from the [free tools](/docs/growth/free-tools) on the website, whose AI tools are limited to 6 runs a minute per IP address.

Each tool call is a live AI model call, so it takes seconds rather than milliseconds. Times from single test calls on 2 October 2026, as a guide:

| Tool | Time on a test call |
| --- | --- |
| `write_meta_descriptions` | About 4 seconds |
| `generate_ai_questions` | About 11 seconds |
| `generate_content_brief` | About 18 seconds |

Set a client timeout of at least 60 seconds. When you run tools in a batch, for example from an automation tool, run calls one after another rather than in a tight parallel loop.

## Protected resource metadata endpoint

MCP clients that support OAuth look for protected resource metadata at `https://rankbox.xyz/.well-known/oauth-protected-resource` (RFC 9728) to learn how to authorize. Because the Rankbox MCP server has no authorization, that endpoint returns HTTP 404 with the body `{"error":"not found"}`.

A 404 there is the expected answer, and well-behaved clients continue without authorization. A client that requires OAuth for every remote server can't connect; see [Troubleshooting](/docs/ai-tools/connect-ai-tools#troubleshooting).

## Test the Rankbox MCP server with MCP Inspector

MCP Inspector is the official open-source tool for testing MCP servers. It runs locally with Node.js.

1. Run `npx @modelcontextprotocol/inspector` in a terminal. It opens the Inspector in your browser.
2. Set **Transport Type** to **Streamable HTTP**.
3. Enter `https://rankbox.xyz/mcp` as the **URL**.
4. Leave every authentication field empty and click **Connect**.
5. Open the **Tools** tab and click **List Tools**. You should see the three Rankbox tools.
6. Select `write_meta_descriptions`, enter a `topic`, and click **Run Tool**.

The result panel shows the `content` text and the `structuredContent` JSON.

## Test the Rankbox MCP server with curl

You can call the server with any HTTP client. Every request is a `POST` with two required headers:

- `Content-Type: application/json`
- `Accept: application/json, text/event-stream`. Without both types, the server answers HTTP 406.

Because the server is stateless, you can send `tools/list` or `tools/call` without calling `initialize` first. Real clients still start with `initialize`.

### Initialize

```bash title="Request"
curl -sS https://rankbox.xyz/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"curl","version":"1.0"}}}'
```

```text title="Response"
event: message
data: {"result":{"protocolVersion":"2025-06-18","capabilities":{"tools":{"listChanged":true}},"serverInfo":{"name":"rankbox-mcp","version":"0.1.0","title":"Rankbox MCP"},"instructions":"Rankbox's GEO (generative engine optimization) toolkit. Use `generate_ai_questions` to find the questions people ask AI about a topic, `generate_content_brief` to plan an article for a keyword, and `write_meta_descriptions` to draft SEO meta descriptions. These help content rank on Google and get recommended by AI engines like ChatGPT and Perplexity."},"jsonrpc":"2.0","id":1}
```

### List the tools

```bash title="Request"
curl -sS https://rankbox.xyz/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "MCP-Protocol-Version: 2025-06-18" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list"}'
```

The response lists the three tools with their JSON Schemas. One entry, formatted for reading:

```json title="One entry in result.tools"
{
  "name": "write_meta_descriptions",
  "title": "Write meta descriptions",
  "description": "Generate 3 compelling, click-worthy SEO meta descriptions (120-160 characters each) for a web page, given a topic or short page summary.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "topic": {
        "type": "string",
        "minLength": 2,
        "maxLength": 600,
        "description": "The page topic or a short summary of its content."
      }
    },
    "required": ["topic"],
    "additionalProperties": false,
    "$schema": "http://json-schema.org/draft-07/schema#"
  },
  "annotations": { "readOnlyHint": true, "idempotentHint": false, "openWorldHint": true },
  "execution": { "taskSupport": "forbidden" }
}
```

### Call a tool

```bash title="Request"
curl -sS https://rankbox.xyz/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "MCP-Protocol-Version: 2025-06-18" \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"write_meta_descriptions","arguments":{"topic":"A guide to choosing project management software for a 10-person agency"}}}'
```

```json title="The data line, formatted"
{
  "result": {
    "content": [
      {
        "type": "text",
        "text": "1. Cut through the noise: Discover the 5 must-have features for project management software that scales perfectly for your 10-person agency—start evaluating today.\n2. Stop wasting time on clunky tools. Get our free checklist to compare top PM software side-by-side—and pick the one that boosts your agency’s productivity in <1 hour.\n3. Find the right project management software for your 10-person agency in under 30 minutes. We break down pricing, integrations, and ease-of-use—so you choose with confidence."
      }
    ],
    "structuredContent": {
      "options": [
        "Cut through the noise: Discover the 5 must-have features for project management software that scales perfectly for your 10-person agency—start evaluating today.",
        "Stop wasting time on clunky tools. Get our free checklist to compare top PM software side-by-side—and pick the one that boosts your agency’s productivity in <1 hour.",
        "Find the right project management software for your 10-person agency in under 30 minutes. We break down pricing, integrations, and ease-of-use—so you choose with confidence."
      ]
    }
  },
  "jsonrpc": "2.0",
  "id": 3
}
```

This is a real response. Two of the three options run past 160 characters, and the second promises a "free checklist" the page may not have. Model output is a draft: check length and claims before you use it.

## Errors from the Rankbox MCP server

Transport errors come back as an HTTP error status with a JSON-RPC error body. Tool errors come back as HTTP 200 with a normal result whose `isError` is `true`.

| What you see | HTTP | Cause | Fix |
| --- | --- | --- | --- |
| `Not Acceptable: Client must accept both application/json and text/event-stream` | 406 | The `Accept` header is missing a type | Send `Accept: application/json, text/event-stream` |
| `Parse error: Invalid JSON` (`-32700`) | 400 | The body isn't JSON | Send a JSON-RPC 2.0 object |
| `Bad Request: Unsupported protocol version` | 400 | The `MCP-Protocol-Version` header names a version the server doesn't support | Use a supported version, or omit the header |
| `Method not found` (`-32601`) | 200 | A method the server doesn't offer, such as `resources/list` | Use `tools/list` and `tools/call` |
| `MCP error -32602: Input validation error` | 200, `isError: true` | An argument is missing, too short or too long | Check the limits in the tool reference |
| `MCP error -32602: Tool <name> not found` | 200, `isError: true` | The tool name is wrong | Use one of the three tool names |
| `tool execution failed` | 200, `isError: true` | The AI model returned nothing usable | Retry, or rephrase the topic or keyword |
| `internal error` (`-32603`) | 500 | A server fault | Retry after a short wait |

The server doesn't pass the underlying reason for `tool execution failed` to the client. A retry usually succeeds.

## What the Rankbox MCP server receives

When your assistant calls a Rankbox tool, the server receives only that call's arguments: the `topic` or `keyword` string your assistant chose to send. It doesn't receive your conversation, your files, your code or your other connectors, and it can't read them.

- **Where the input goes.** Rankbox puts the argument into a prompt for its AI model provider and returns the model's answer. Don't send anything you wouldn't put in a web search.
- **What Rankbox keeps.** The tool code doesn't save your input or the results. Hosting infrastructure may record request metadata, and the server may record per-call usage data (which tool ran, whether it succeeded, how long it took), never the arguments or results.
- **No identity.** No account, key or token is sent, so calls aren't tied to a Rankbox account.

Your AI client decides what to send and shows you the call. Most clients let you approve each tool call before it runs. See [Security and privacy](/docs/account/security) for how Rankbox handles data generally.

## Related

- [Connect your AI tools](/docs/ai-tools/connect-ai-tools) — setup steps for Claude, ChatGPT, Cursor and 46 more
- [MCP tool reference](/docs/ai-tools/tools-reference) — every input, output and error for the three tools
- [Free SEO and AI search tools](/docs/growth/free-tools) — the same kinds of research on the website
- [API overview](/docs/api/overview) — work with your account's articles from code
- [Security and privacy](/docs/account/security) — how Rankbox handles your data
