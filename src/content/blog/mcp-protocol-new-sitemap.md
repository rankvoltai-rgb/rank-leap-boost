---
title: The MCP Protocol as the New Sitemap: Why AI Models Prefer APIs Over Web Crawling
description: What MCP is, why AI agents do better with APIs than scraping, and how to turn your product into a safe, listed MCP server without losing crawl reach.
keyword: MCP
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Technical SEO
---

An MCP server does for AI assistants what an XML sitemap does for search crawlers: it tells a machine what your site offers. The difference is in what comes back. A sitemap points to pages that a crawler must fetch and parse. An MCP (Model Context Protocol) server lists tools that an assistant can call to get a live, typed answer straight from your systems. When a good API exists, agents tend to do better with it than with scraping, but only for the people who connect your server. Everyone else still finds you through crawled pages.

That split is the whole story of this post. Anthropic [launched MCP](https://www.anthropic.com/news/model-context-protocol) in November 2024 as "an open standard" for two-way links between data sources and AI tools. It now sits under the Linux Foundation. When it moved there in December 2025, the project counted [10,000 active servers](https://blog.modelcontextprotocol.io/posts/2025-12-09-mcp-joins-agentic-ai-foundation/) and client support in ChatGPT, Claude, Cursor, Gemini, Microsoft Copilot and VS Code.

This guide covers what MCP is, the evidence that agents work better through APIs, where crawling still wins, what to expose, how to keep it safe, a minimal server you can run, and how to get listed. If you want to try an MCP server first, Rankbox's own [research server](/integrations/mcp) takes one URL to add.

## Key Takeaways

- MCP is an open protocol that lets AI apps call tools on your server. Your code runs each call, so no assistant ever touches your database.
- In a WebArena study, an API-only agent scored 29.2% against 14.8% for a browsing agent, and a hybrid that used both scored 38.9%.
- An MCP server reaches only the people who connect it. ChatGPT search and Google's AI features still need crawlable, indexed pages.
- Treat MCP as a second layer on top of your sitemap. Pages win reach and citations; tools win accuracy for live facts like prices, docs and availability.
- Start with read-only tools and mark them `readOnlyHint: true`. ChatGPT's developer mode treats any tool without that hint as a write action.
- The current TypeScript SDK is v2 (`@modelcontextprotocol/server`). Tutorials that call `server.tool()` are written for v1.
- To get found, publish to the official MCP Registry (still in preview) and submit to Claude's Connectors Directory and ChatGPT's plugin directory.

## What Is MCP? The Protocol in Plain Terms

MCP is a shared language between AI apps and the services they use. Before it, every assistant needed its own custom connector for every data source. Anthropic's launch post put the problem simply: "Every new data source requires its own custom implementation." MCP swaps that mess for one standard, so a server you build once works in many clients.

![Why we built—and donated—the Model Context Protocol (MCP)](youtube:PLyCki2K0Lg "MCP co-creator David Soria Parra on why Anthropic built the protocol and gave it to the Linux Foundation (Anthropic, December 2025).")

### Hosts, clients and servers

The [MCP specification](https://modelcontextprotocol.io/specification/latest) names three roles. A **host** is the AI app a person uses, such as Claude or ChatGPT. A **client** is the connector inside that host. A **server** is the service that offers data and actions: yours. They talk in JSON-RPC 2.0 messages, a plain JSON request and response format.

### Tools, resources and prompts

A server can offer three kinds of things:

- **Tools:** functions the model can call, such as `get_pricing` or `search_docs`.
- **Resources:** data or content the app can read.
- **Prompts:** reusable templates a user can pick.

Most public servers are built around tools. Each tool has a name, a description, and a JSON Schema for its inputs and, optionally, its outputs. The model reads those fields to decide when to call it and what to send.

### How an assistant queries your product data

An MCP endpoint lets Claude Desktop, ChatGPT and other clients query your product data without scraping a single page. The path looks like this:

1. A user or admin adds your server's URL to their assistant.
2. The assistant reads your tool list: names, descriptions and input schemas.
3. The user asks a question, and the model picks a tool and fills in the arguments.
4. Your server checks the input, runs your own query against your own database, and returns the result.
5. The assistant writes its answer from that result.

Note step 4. The assistant never touches your database. It can only call the tools you wrote, with the inputs you allow. A remote server talks over Streamable HTTP, where each message is a POST to one URL. A local server runs on the user's machine over stdio instead, which suits developer tools more than products.

### What changed in the 2026-07-28 spec

The latest revision, dated 28 July 2026, made MCP stateless. The [changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog) removes the opening handshake and protocol sessions, so each request carries its own version and capabilities. It adds a `server/discover` call, and it requires caching hints (`ttlMs` and `cacheScope`) on tool and resource lists. In practice, a remote MCP endpoint now behaves much like any other web API: each call stands alone, and lists can be cached. That's part of why the sitemap comparison fits so well.

## Why AI Models Prefer APIs Over Web Crawling

Models don't have tastes. But agents built on them succeed more often when they can call a clean interface instead of reading pages built for human eyes. Three kinds of evidence point the same way.

### Agents finish more tasks through APIs

The clearest test is [Beyond Browsing](https://arxiv.org/abs/2410.16464), a paper from Carnegie Mellon researchers. They gave agents the same WebArena tasks, which are realistic jobs on sites like a store, a map and a code host. The results:

| Agent type | How it works | Average success on WebArena |
| --- | --- | --- |
| Browsing agent | Reads and clicks pages through the accessibility tree | 14.8% |
| API-based agent | Calls documented APIs and writes code | 29.2% |
| Hybrid agent | Picks API calls or browsing step by step | 38.9% |

The API agent almost doubled the browsing agent's score. The hybrid did best of all, more than 24 points above browsing alone. The authors add two caveats that matter for site owners. First, "API quality does significantly impact the performance of agents." Second, not every site has a good API, and on the store's admin panel the browsing agent beat the API-only one (22.0% to 20.3%). The study dates from 2024, with a revision in June 2025, so treat the exact numbers as a snapshot. The gap between the approaches is the point.

### Vendors are building structured doors

The companies behind AI assistants keep adding ways to hand them data directly:

- **Apps and plugins built on MCP.** OpenAI's [plugin docs](https://developers.openai.com/plugins/concepts/plugins) describe packages people install in ChatGPT and Codex, which can include an MCP server, and ChatGPT and Codex "share one universal plugin directory."
- **Product feeds.** For shopping, OpenAI asks merchants for a [structured product feed](https://developers.openai.com/commerce/guides/get-started) through its Agentic Commerce Protocol. It says feeds give ChatGPT "the catalog data it needs to index your products." It suggests a full feed once a day, plus API updates through the day.
- **Websites as MCP endpoints.** Microsoft's [NLWeb](https://news.microsoft.com/source/features/company-news/introducing-nlweb-bringing-conversational-interfaces-directly-to-the-web/) turns a site's Schema.org data and RSS feeds into a question-answering endpoint. Microsoft says "every NLWeb instance is also a Model Context Protocol (MCP) server."
- **Tools inside the browser.** Chrome's [WebMCP preview](https://developer.chrome.com/blog/webmcp-epp) lets a page declare tools for browser agents. Google pitches it as a way for agents to act "with increased speed, reliability, and precision" compared with poking at the raw page. It's a browser API, now in an [origin trial](https://developer.chrome.com/blog/ai-webmcp-origin-trial) in Chrome 149.

### Where OpenAPI fits

OpenAPI is the common format for describing a REST API: its endpoints, inputs and outputs. It's one way assistants already reach live systems. ChatGPT's [GPT Actions](https://developers.openai.com/api/docs/actions/introduction), which live inside Custom GPTs, still require an OpenAPI schema for each API they call. In the Beyond Browsing study, the store's API docs reached the agent as OpenAPI specs.

MCP builds on the same idea but works across many clients, not one product. If you already publish an OpenAPI spec, it's the best place to start choosing tools. Just don't turn every endpoint into a tool. Pick the few jobs people actually ask an assistant to do.

### Metadata decides when your tool runs

With crawling, you hope the engine parses your page the right way. With MCP, you write the words the model reads. OpenAI's [metadata guide](https://developers.openai.com/plugins/guides/optimize-metadata) states it plainly: "ChatGPT and Codex decide when to call your tool based on the metadata you provide." Anthropic's [tool-writing guide](https://www.anthropic.com/engineering/writing-tools-for-agents) says "even small refinements to tool descriptions can yield dramatic improvements." That's the closest thing MCP has to on-page SEO, and it's covered below.

## Sitemap vs MCP Server: What Each One Does

A sitemap and an MCP server both exist so machines can find your stuff. They serve different readers and reach different people.

| | XML sitemap | MCP server |
| --- | --- | --- |
| What it lists | Page URLs, with optional last-modified dates | Tools, resources and prompts, each with a schema |
| Who reads it | Search crawlers | AI apps that a user or admin has connected |
| What comes back | HTML the engine must fetch and parse | Text plus typed data, checked against your schema |
| How fresh | As fresh as the last crawl | Live at the moment of the call |
| Who benefits | Anyone who searches | Only people who added your server |
| Can it act? | No | Yes, if you allow write tools |
| Access control | robots.txt, which bots follow by choice | Auth, scopes and user approval in the client |
| How it's found | robots.txt line, Search Console, Bing Webmaster Tools | MCP Registry, client directories, a pasted URL |
| Cost to run | A static file | A live service to secure and monitor |

The first rows explain the thesis. The row "Who benefits" explains its limit.

### Where crawling still wins

- **Reach.** ChatGPT's search features surface sites through `OAI-SearchBot`, and OpenAI's [crawler docs](https://developers.openai.com/api/docs/bots) say sites opted out of it "will not be shown in ChatGPT search answers." Google's AI Overviews and AI Mode only show supporting links to pages that are [indexed and eligible for a snippet](https://developers.google.com/search/docs/appearance/ai-features). No MCP server gets you into either one. See our [OAI-SearchBot glossary entry](/glossary/oai-searchbot) for the crawler itself.
- **Citations.** An AI search answer links to pages. A tool result helps the one person in that chat and nobody else.
- **Prose.** Guides, comparisons and opinion pieces are pages by nature. Wrapping a blog in a tool adds cost and little value.
- **Thin APIs.** In the Beyond Browsing study, a weak API lost to plain browsing. A tool that returns half the facts on your page is worse than the page.

So keep your [XML sitemap](/glossary/xml-sitemap) and your crawl access in good shape. Our guide on [serving both ChatGPT and Perplexity](/blog/optimize-website-for-chatgpt-and-perplexity) covers the crawl side in depth.

### NLWeb: a sitemap that answers back

NLWeb is the closest thing to "MCP as the new sitemap" in a literal sense. It reads the structured data you already publish and answers questions about it over MCP. When Cloudflare packaged NLWeb with its AutoRAG service, the setup [followed the site's sitemap.xml and robots.txt](https://blog.cloudflare.com/conversational-search-with-nlweb-and-autorag/) to find pages, then exposed an `/mcp` endpoint "that trusted AI agents can connect to for structured access." The sitemap didn't go away. It became the input.

### What about llms.txt?

People often ask whether an llms.txt file can get a site indexed by LLMs. [llms.txt](/glossary/llms-txt) is a proposal for a Markdown file that helps agents use a site at inference time. It isn't an index submission. Google says you [don't need "AI text files"](https://developers.google.com/search/docs/appearance/ai-features) to appear in its AI features. The file can still help tools that read it. The MCP docs and OpenAI's developer docs both publish one, and the MCP site points agents to it as the index of its pages. Our [complete llms.txt guide](/blog/how-to-get-indexed-by-llms-with-llms-txt) covers the spec, serving and log checks, and you can draft the file with our free [llms.txt generator](/tools/llms-txt-generator).

## The Sitemap-to-Server Map

If you already run good technical SEO, you know most of what an MCP server needs. Each sitemap habit has a direct MCP counterpart. We call this the **Sitemap-to-Server Map**:

| Sitemap habit | What it does for crawlers | MCP counterpart | What it does for agents |
| --- | --- | --- | --- |
| `<loc>` entries | Lists every URL worth crawling | `tools/list` | Lists every action worth calling |
| `<lastmod>` | Freshness hint, used [if accurate](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) | `ttlMs` and `cacheScope` | Tells clients how long a list stays fresh, and who may cache it |
| `<priority>`, `<changefreq>` | Google ignores both | Tool `title` and `description` | The words the model reads to pick a tool |
| Schema.org markup | Describes what a page holds | `inputSchema`, `outputSchema` | Defines exactly what goes in and comes out |
| robots.txt rules | Says which bots may fetch what | Auth, scopes, `readOnlyHint` | Says who may call what, and what needs approval |
| `Sitemap:` line, Search Console | Tells engines where the file lives | Registry `server.json`, directory listings | Tells clients where the server lives |
| DNS or HTML-file verification | Proves you own the site | Registry DNS or HTTP check, OpenAI domain token | Proves you own the server's name |
| Crawl stats and logs | Shows who fetched which pages | Tool-call logs | Shows which prompts triggered which tools |

Two rows deserve a note. The `<priority>` row is the big shift. Google ignores your sitemap's opinion of what matters, but an assistant acts on your tool description almost word for word. And the robots.txt row changes from a polite request to real enforcement: a tool can refuse any call without a valid token.

## What to Expose in Your MCP Server

The best first tools answer questions your pages answer badly: facts that change often, facts buried across many pages, and searches over a large set of docs.

### Start with four read-only tools

1. **Product catalog.** What you sell, with names and short descriptions an agent can compare.
2. **Pricing.** Current plans and prices, straight from billing, not from a page someone forgot to update.
3. **Docs search.** A search tool over your help center. Anthropic's guide favors search-style tools over "list everything" tools, because they save the agent's context.
4. **Availability.** Stock, delivery dates, service status or which plan includes a feature.

Leave out anything that changes data until you've added auth and approval steps. A read-only server with four sharp tools beats a sprawling one. Anthropic warns against tools that "merely wrap existing software functionality or API endpoints."

### Worked example: 214 URLs become four tools

Plannora is a made-up project management app we use for examples. Its sitemap has 214 URLs. Here's how they split, as an illustration:

| Sitemap section | URLs | MCP tool | Source of truth |
| --- | --- | --- | --- |
| Pricing page and 3 plan pages | 4 | `get_pricing` | Billing system |
| Help-center articles | 62 | `search_docs` | Help-center search index |
| Integration pages | 18 | `list_integrations` | Integrations catalog |
| Status page | 1 | `get_status` | Status monitor |
| Blog posts | 120 | None: stays a page | |
| About, legal, careers | 9 | None: stays a page | |
| **Total** | **214** | **4 tools** | |

Four tools cover 85 URLs, about 40% of the sitemap (85 ÷ 214). The other 129 URLs, 60%, stay as crawlable pages, and the blog alone is 56% of the site. The tools carry the facts that go stale; the pages carry the reach. Nothing here removes a single URL from the sitemap.

### Write tool metadata like search copy

This is what "MCP server SEO" means for your own server: getting the model to pick your tool for the right prompts and skip it for the wrong ones. OpenAI's metadata guide gives a clear pattern:

- **Name** the tool with a domain and an action, like `calendar.create_event`.
- **Start the description with "Use this when…"** and name the cases it shouldn't handle.
- **Describe every argument,** with examples and allowed values.
- **Test with a prompt set:** direct prompts that name you, indirect ones that don't, and negative ones where another tool should win.

Then watch your tool-call logs weekly, the way you'd watch crawl stats. OpenAI suggests reviewing tool-call analytics every week, since spikes in wrong-tool calls point to metadata drift.

## Auth and Safety for a Public MCP Server

A sitemap is a static list of pages that are already public. An MCP server runs your code on request, so it needs the care you'd give any public API.

### Public data first, OAuth for user data

The spec makes [authorization optional](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization). For public, read-only facts like prices and docs, no auth is a valid choice, and Claude's directory [accepts no-auth servers](https://claude.com/docs/connectors/building/submission) for public data. Once a tool touches a user's account, use the spec's OAuth 2.1 flow. Your server must then publish Protected Resource Metadata, a small file that tells clients where to sign in. It must also check that each token was issued for your server and no other.

### The rules that matter most

The spec's tools section says servers must "validate all tool inputs," enforce access controls, "rate limit tool invocations" and "sanitize tool outputs." The [security best practices](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices) add more:

- **No token passthrough.** "MCP servers MUST NOT accept any tokens that were not explicitly issued for the MCP server." Never forward a user's token to another API.
- **Small scopes first.** Start with a minimal read scope and ask for more only when a tool needs it. Skip wildcard scopes like `*` or `all`.
- **Random, owned handles.** If a tool returns an ID for later calls, such as a cart, make it random and bind it to the signed-in user. Holding a handle must never count as proof of identity.
- **Annotate every tool.** ChatGPT's [developer mode](https://developers.openai.com/api/docs/guides/developer-mode) treats tools without `readOnlyHint` as write actions, which require user approval by default.
- **Check the Host header.** The TypeScript SDK's handler doesn't validate `Host` or `Origin` for you. Put a check in front of it, as the example below does.

### Treat everything you return as untrusted text

Anthropic's help center warns that "malicious MCP servers may include hidden instructions" meant to steer the assistant. Your server can carry the same risk by accident. If a tool returns user reviews, forum posts or support tickets, someone can plant instructions in them. Strip markup, cap lengths and return fields, not raw pages. Keep results short, too: Claude Code caps tool responses at 25,000 tokens by default.

## A Minimal MCP Server in TypeScript

This is Plannora's `get_pricing` tool as a complete remote server. It uses v2 of the official TypeScript SDK, which [shipped with the 2026-07-28 spec](https://github.com/modelcontextprotocol/typescript-sdk). Install it with `npm install @modelcontextprotocol/server zod`. The code type-checks and runs against version 2.1.0 of the SDK, released on 23 September 2026. The prices are made up.

```typescript
import { createMcpHandler, hostHeaderValidationResponse, McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';

// Made-up data for a fictional brand. Read from your real pricing source.
const PLANS = [
  { name: 'Starter', usdPerSeat: 8, maxSeats: 10 },
  { name: 'Team', usdPerSeat: 12, maxSeats: 100 },
];

const Plan = z.object({ name: z.string(), usdPerSeat: z.number(), maxSeats: z.number() });

const handler = createMcpHandler(() => {
  const server = new McpServer({ name: 'plannora', version: '1.0.0' });

  server.registerTool(
    'get_pricing',
    {
      title: 'Get Plannora pricing',
      description:
        'Use this when someone asks what Plannora costs or which plan fits a team. Returns current public plans.',
      inputSchema: z.object({
        seats: z.number().int().min(1).optional().describe('Team size, to keep only plans that fit'),
      }),
      outputSchema: z.object({ plans: z.array(Plan) }),
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ seats }) => {
      const plans = PLANS.filter((p) => seats === undefined || p.maxSeats >= seats);
      return { content: [{ type: 'text', text: JSON.stringify({ plans }) }], structuredContent: { plans } };
    },
  );

  return server;
});

// Reject requests for any host but yours, then hand the rest to MCP.
export default {
  fetch: (request: Request) =>
    hostHeaderValidationResponse(request, ['mcp.plannora.io']) ?? handler.fetch(request),
};
```

A few notes for a careful reader:

- **Runtime.** The default export is the `{ fetch }` shape that Cloudflare Workers, Deno and Bun serve as is. On Node, mount the handler with `toNodeHandler` from `@modelcontextprotocol/node`, or use `createMcpExpressApp` from `@modelcontextprotocol/express`, which can check allowed hosts for you.
- **Validation for free.** The SDK checks arguments against the schema before your code runs. A call with `seats: 0` comes back as an error result the model can read and fix.
- **Two outputs.** `content` is text for the model. `structuredContent` is typed data, checked against `outputSchema` before it leaves the server.
- **Old tutorials.** Code that imports `@modelcontextprotocol/sdk` or calls `server.tool()` or `StreamableHTTPServerTransport` is v1. The v2 docs say `registerTool` replaces `tool()`, and `createMcpHandler` replaces the old transport wiring.

To test it, send a plain JSON-RPC request. The reply comes back as a single server-sent event that carries the tool list:

```bash
curl -s -X POST https://mcp.plannora.io/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

Then add the URL as a custom connector in Claude, or in ChatGPT's developer mode, and run your prompt set against it.

## How to Get Your MCP Server Listed

A sitemap gets found through robots.txt and webmaster tools. An MCP server gets found through registries and client directories. As of September 2026, these are the routes that matter.

### 1. The official MCP Registry

The [MCP Registry](https://modelcontextprotocol.io/registry/about) is the official list of public servers. It's still in preview, and its docs warn that "breaking changes or data resets may occur." You publish a `server.json` file with a `remotes` entry that points to your Streamable HTTP URL. Names use reverse-DNS form, such as `io.plannora/mcp`, and you prove the domain with a DNS TXT record or a file at `/.well-known/mcp-registry-auth`. The official `mcp-publisher` CLI handles the domain check and the upload.

Don't expect people to browse it. The registry says it's built for "downstream aggregators," such as marketplaces, which pull its data on a schedule. Think of it as a feed that other directories copy.

### 2. Claude's Connectors Directory

Anyone on a paid Claude plan can submit through Anthropic's developer portal at `claude.ai/directory/manage`. The server must be remote over HTTPS, and every tool needs a `title` plus a `readOnlyHint` or `destructiveHint`. You'll also need a privacy policy URL, docs and a test account for reviewers. Anthropic scans each submission and, by default, lists it as a Community connector. Some also get a human review.

Before that, any Claude user can add your server by URL. [Custom connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) work on Free, Pro, Max, Team and Enterprise plans, with Free users limited to one. Claude connects from Anthropic's cloud, so your server must be reachable from the public internet.

### 3. ChatGPT's plugin directory

OpenAI now packages Apps SDK work as plugins, and its old `/apps-sdk` docs URL redirects to the plugins docs. To [submit](https://developers.openai.com/plugins/deploy/submission), you need a verified developer or business identity, a stable public HTTPS endpoint, and a domain token at `/.well-known/openai-apps-challenge`. OpenAI reviews it, you choose when to publish, and the listing appears in the directory ChatGPT and Codex share. For testing, developer mode lets Plus, Pro, Business, Enterprise and Education users on the web add any remote server.

### 4. Your own site

Make the server easy to find where people already look: a docs page with the URL, the tool list and setup steps for each client. A proposal called [Server Cards](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127) would add a static discovery file for each server, a true "sitemap for MCP," though it would describe the server rather than list its tools. As of 28 September 2026 it's still under review and not part of the spec, so don't build around it yet.

## How Rankbox Runs Its Own MCP Server

Rankbox runs a remote server at `https://rankbox.xyz/mcp`, and it follows the same rules this post describes. It offers three research tools: one finds the questions people ask AI about a topic, one builds a content brief for a keyword, and one drafts meta descriptions. All three are marked `readOnlyHint: true`. The server doesn't publish to your site and doesn't track AI citations. It's a research desk inside Claude, ChatGPT, Cursor and any other client that takes a remote server by URL. Setup steps are on the [MCP integration page](/integrations/mcp).

That also shows the other meaning of "MCP server SEO": SEO tools you can call from your assistant. Rankbox's main product works on the crawl side of this post. [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask, and the [Citation-Ready Writer](/features/citation-ready-writer) turns them into source-backed pages that a developer wires into your site through the API. Rankbox doesn't build or host MCP servers for customers. See [plans and pricing](/pricing).

## Frequently Asked Questions

### What is MCP in simple terms?

MCP, the Model Context Protocol, is an open standard that lets AI apps like Claude and ChatGPT call tools on outside servers. You describe each tool's name, purpose and inputs. The assistant decides when to call it, your server runs the code, and the result goes back into the chat. Anthropic launched it in November 2024, and it's now governed under the Linux Foundation.

### Does an MCP server help SEO or AI search visibility?

An MCP server doesn't raise your rankings or put you in AI search answers for people who haven't connected it. ChatGPT search and Google's AI features still rely on crawled, indexed pages. What an MCP server does is make your facts accurate and actionable for users who add it, and a directory listing can bring new users to it.

### Will an MCP server replace my XML sitemap?

No, an MCP server works alongside your sitemap, not instead of it. The sitemap helps crawlers find pages that anyone can reach through search. The MCP server gives connected assistants live answers and actions. Even NLWeb, which turns a site into an MCP endpoint, uses the sitemap to find pages. Keep both.

### What is OAI-SearchBot, and do I still need it if I run an MCP server?

OAI-SearchBot is the crawler OpenAI uses to surface websites in ChatGPT's search features, and yes, you still need to allow it. OpenAI says sites opted out of it won't be shown in ChatGPT search answers. Your MCP server only serves people who connect it, so blocking the crawler would cut you off from everyone else.

### Can an llms.txt file get my site indexed by LLMs?

No major AI search engine has said it indexes sites from llms.txt. The file is a proposal to help agents use a site at inference time, and Google says you don't need AI text files to appear in its AI features. Indexing still comes from crawler access, sitemaps and server-rendered pages. llms.txt can help coding assistants and doc tools that choose to read it.

### Is it safe to run a public MCP server?

Yes, if you treat it like any public API. Start with read-only tools on public data, validate every input, rate limit calls and clean what you return. Add OAuth 2.1 before any tool touches user data, and never forward a user's token to another service. Mark each tool read-only or destructive, so clients know when to ask for approval.

## References

1. [Specification (2026-07-28), Model Context Protocol](https://modelcontextprotocol.io/specification/latest)
2. [Key changes in 2026-07-28, Model Context Protocol](https://modelcontextprotocol.io/specification/2026-07-28/changelog)
3. [Authorization, Model Context Protocol](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)
4. [Security best practices, Model Context Protocol](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices)
5. [The MCP Registry, Model Context Protocol](https://modelcontextprotocol.io/registry/about)
6. [MCP TypeScript SDK, GitHub](https://github.com/modelcontextprotocol/typescript-sdk)
7. [Introducing the Model Context Protocol, Anthropic](https://www.anthropic.com/news/model-context-protocol)
8. [MCP joins the Agentic AI Foundation, MCP Blog](https://blog.modelcontextprotocol.io/posts/2025-12-09-mcp-joins-agentic-ai-foundation/)
9. [Beyond Browsing: API-Based Web Agents (Song et al., arXiv)](https://arxiv.org/abs/2410.16464)
10. [Writing effective tools for agents, Anthropic](https://www.anthropic.com/engineering/writing-tools-for-agents)
11. [Get started with custom connectors using remote MCP, Claude Help Center](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)
12. [Submit a connector to the directory, Claude Docs](https://claude.com/docs/connectors/building/submission)
13. [Plugin architecture, OpenAI Developers](https://developers.openai.com/plugins/concepts/plugins)
14. [Optimize metadata, OpenAI Developers](https://developers.openai.com/plugins/guides/optimize-metadata)
15. [Submit plugins, OpenAI Developers](https://developers.openai.com/plugins/deploy/submission)
16. [ChatGPT developer mode, OpenAI Developers](https://developers.openai.com/api/docs/guides/developer-mode)
17. [Overview of OpenAI crawlers, OpenAI Developers](https://developers.openai.com/api/docs/bots)
18. [Introducing NLWeb, Microsoft](https://news.microsoft.com/source/features/company-news/introducing-nlweb-bringing-conversational-interfaces-directly-to-the-web/)
19. [Make your website conversational with NLWeb and AutoRAG, Cloudflare](https://blog.cloudflare.com/conversational-search-with-nlweb-and-autorag/)
20. [AI features and your website, Google Search Central](https://developers.google.com/search/docs/appearance/ai-features)
