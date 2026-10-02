---
title: Agent MCP tools
nav_title: MCP tools
description: Connect an agent to the Rankbox MCP server with an agent key or OAuth and use the full tool set: inputs, outputs, example calls and anonymous access.
order: 6
updated: 2026-10-02
---

The Rankbox MCP server at `https://rankbox.xyz/mcp` exposes the agent API as Model Context Protocol tools. An agent that speaks MCP can create an account, plan, write, publish and check billing without writing HTTP code. Each tool takes the same fields and returns the same JSON as the matching [agent API](/docs/agents/api-reference) endpoint.

## Anonymous and authenticated access

The server answers both anonymous and authenticated clients, with different tools:

| | Anonymous | Authenticated |
| --- | --- | --- |
| Credential | None | `Authorization: Bearer rv_agent_…`, or an OAuth access token |
| Tools | `generate_ai_questions`, `generate_content_brief`, `write_meta_descriptions`, `create_account` | Those four plus the full tool set below |
| Acts on | No account | The whole account and every site on it |
| Credits | None | The account's own, exactly as through the API |

The three public tools are the free research tools anyone can use. `create_account` lets an agent with no account create one; it then reconnects with the agent key it gets back. An authenticated client sees every tool in `tools/list`, including the four anonymous ones.

## Server details

| Property | Value |
| --- | --- |
| URL | `https://rankbox.xyz/mcp` |
| Transport | Streamable HTTP |
| Server name | `rankbox-mcp` |
| Authentication | Bearer header, or OAuth 2.1 per the MCP authorization spec |
| Protected resource metadata | `https://rankbox.xyz/.well-known/oauth-protected-resource` |

## Connect with an agent key

Pass the key as a header. Keep it in an environment variable rather than in a config file you might commit.

```bash title="Claude Code"
claude mcp add --transport http rankbox https://rankbox.xyz/mcp \
  --header "Authorization: Bearer $RANKBOX_AGENT_KEY"
```

```json title="Cursor"
{
  "mcpServers": {
    "rankbox": {
      "url": "https://rankbox.xyz/mcp",
      "headers": { "Authorization": "Bearer ${env:RANKBOX_AGENT_KEY}" }
    }
  }
}
```

```ts title="TypeScript SDK"
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const transport = new StreamableHTTPClientTransport(new URL("https://rankbox.xyz/mcp"), {
  requestInit: { headers: { Authorization: `Bearer ${process.env.RANKBOX_AGENT_KEY}` } },
});
const client = new Client({ name: "atlas", version: "1.0.0" });
await client.connect(transport);

const { structuredContent } = await client.callTool({ name: "get_account", arguments: {} });
```

```python title="Python SDK"
import os
from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client

headers = {"Authorization": f"Bearer {os.environ['RANKBOX_AGENT_KEY']}"}

async with streamablehttp_client("https://rankbox.xyz/mcp", headers=headers) as (read, write, _):
    async with ClientSession(read, write) as session:
        await session.initialize()
        result = await session.call_tool("get_account", {})
        account = result.structuredContent["account"]
```

The Cursor example goes in `.cursor/mcp.json` or `~/.cursor/mcp.json`. For other clients, see [Connect your AI tools](/docs/ai-tools/connect-ai-tools) and add the same header.

## Connect with OAuth

MCP clients that implement the MCP authorization spec (Claude, ChatGPT and others) need only the URL. On the first call without a token, the server answers `401` with a `WWW-Authenticate` header that points to the protected resource metadata. The client registers itself, opens Rankbox's consent page in a browser and stores the tokens.

1. Add `https://rankbox.xyz/mcp` as a custom connector or remote MCP server in the app.
2. The app opens `https://rankbox.xyz/oauth/consent`. The owner signs in if needed.
3. The page says "{app} wants to use your Rankbox account" and lists what it can do: everything in the account.
4. The owner clicks **Connect**. The app receives an access token and a refresh token and lists the full tool set.

The connection appears under **Dashboard → Settings → Agent access** with the app's name, and the owner can disconnect it there. The details of the flow are in the [OAuth 2.1 walkthrough](/docs/agents/authentication#oauth-21-walkthrough).

## Create an account from MCP

An agent with no account connects anonymously and calls `create_account`:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "create_account",
    "arguments": {
      "email": "maya@northwind.example",
      "site_url": "https://northwind.example",
      "site_name": "Northwind Analytics",
      "agent": { "name": "Atlas", "operator": "Northwind Analytics" },
      "idempotency_key": "0f7c1d52-create-northwind"
    }
  }
}
```

The result's `structuredContent` is the `POST /accounts` response: `account`, `site`, `scan_job_id`, `agent_key` (with the secret `key`) and `claim_url`. Store `agent_key.key`, then reconnect with the `Authorization` header to get the full tool set. The same limits and duplicate-email rules apply as in [Create an account as an agent](/docs/agents/create-account).

## How the tools behave

- **Same data as the API.** Each tool's `structuredContent` is the JSON body the matching endpoint returns, for example `{ "article": { … } }`. The `content` text block is a short readable summary for the model.
- **Snake_case inputs.** Inputs use the API's field names. Path parameters become inputs: `site_id`, `article_id`, `job_id`, `thread_id`.
- **Errors.** A failed call returns a result with `isError: true` and `structuredContent` set to the API error envelope, for example `{ "error": "…", "code": "insufficient_credits" }`. The codes are the same as in [Errors](/docs/agents/api-reference#errors).
- **Long work.** Tools that start a job (`run_scan`, `run_research`, `generate_article`, `sync_integration`, `run_reddit_sweep`) return the job at once. Call `get_job` with `wait: 30` until it ends. No tool blocks for minutes.
- **Retries.** Tools that spend credits or money take an optional `idempotency_key`, which works like the `Idempotency-Key` header.
- **Annotations.** Read tools carry `readOnlyHint: true`. `delete_article`, `remove_site` and `revoke_agent_key` carry `destructiveHint: true`. Clients that confirm destructive tools ask before running these.

## Tool reference

Optional inputs are marked with `?`. Every site tool needs `site_id`; it is listed once per table.

### Public tools

| Tool | Inputs | Output |
| --- | --- | --- |
| `generate_ai_questions` | `topic` (2 to 200 characters) | `groups`: `[{ intent, questions[] }]`, intents Informational, Commercial, Comparison, Transactional |
| `generate_content_brief` | `keyword` (2 to 200 characters) | `brief`: `title`, `outline[{ heading, points[] }]`, `questions[]`, `entities[]` |
| `write_meta_descriptions` | `topic` (2 to 600 characters) | `options`: three meta descriptions of 120 to 160 characters |
| `create_account` | `email`, `site_url`, `site_name?`, `site_description?`, `agent { name, operator?, contact_url? }`, `idempotency_key?` | `account`, `site`, `scan_job_id`, `agent_key`, `claim_url` |

These three public tools spend no credits and don't touch an account, even when called by an authenticated client. See [MCP tool reference](/docs/ai-tools/tools-reference) for their full behavior.

### Account tools

| Tool | Inputs | Output | API |
| --- | --- | --- | --- |
| `get_account` | none | `account` | `GET /account` |
| `resend_claim_email` | none | `sent`, `claim_url` | `POST /account/resend-claim` |
| `list_agent_keys` | none | `agent_keys[]` | `GET /agent-keys` |
| `create_agent_key` | `name`, `operator?`, `contact_url?` | `agent_key` with `key` | `POST /agent-keys` |
| `revoke_agent_key` | `id` | `revoked`, `id` | `DELETE /agent-keys/{id}` |
| `list_activity` | `actor_id?`, `site_id?`, `since?`, `limit?`, `cursor?` | `activity[]`, `next_cursor` | `GET /activity` |

### Site tools

| Tool | Inputs | Output | API |
| --- | --- | --- | --- |
| `list_sites` | none | `sites[]` | `GET /sites` |
| `get_site` | `site_id` | `site` | `GET /sites/{site_id}` |
| `create_site` | `site_url`, `site_name`, `site_description?`, `logo_url?`, `proration_date?`, `idempotency_key?` | `site`, `scan_job_id`, `charged` | `POST /sites` |
| `update_site` | `brand_name?`, `website_url?`, `product_description?`, `avatar_url?`, `writing? { tone, writing_style, audience, brand_voice }` | `site` | `PATCH /sites/{site_id}` |
| `remove_site` | `site_id` | `site` with `removes_at` | `DELETE /sites/{site_id}` |
| `restore_site` | `proration_date?`, `idempotency_key?` | `site`, `charged` | `POST /sites/{site_id}/restore` |
| `get_scan` | `site_id` | `scan` | `GET /sites/{site_id}/scan` |
| `run_scan` | `site_id` | `job` | `POST /sites/{site_id}/scan` |

`create_site` and `restore_site` charge the card on file. Ask the owner first unless they told you to go ahead.

### Research and plan tools

| Tool | Inputs | Output | API |
| --- | --- | --- | --- |
| `run_research` | `seed?`, `ideas?` (0 to 30), `save?` | `job` (result: `keywords`, `ideas`, `saved`) | `POST /sites/{site_id}/research` |
| `list_keywords` | `source?` (`library` or `discovered`) | `keywords[]` | `GET /sites/{site_id}/keywords` |
| `add_keyword` | `name`, `intent?`, `search_volume?`, `tag?`, `trend?` | `keyword` | `POST /sites/{site_id}/keywords` |
| `delete_keyword` | `keyword_id` | `deleted`, `id` | `DELETE /sites/{site_id}/keywords/{keyword_id}` |

### Article tools

| Tool | Inputs | Output | API |
| --- | --- | --- | --- |
| `list_articles` | `status?`, `updated_since?`, `include_body?`, `limit?`, `cursor?` | `articles[]`, `next_cursor` | `GET /sites/{site_id}/articles` |
| `create_article` | `title`, `keyword?`, `description?`, `status?`, `scheduled_date?`, `queue_position?`, `body?`, `tags?`, `notes?` | `article` | `POST /sites/{site_id}/articles` |
| `get_article` | `article_id` | `article` with all bodies | `GET …/articles/{article_id}` |
| `update_article` | `article_id`, then any of `title`, `keyword`, `description`, `body`, `tags`, `notes`, `status`, `scheduled_date`, `queue_position` | `article` | `PATCH …/articles/{article_id}` |
| `delete_article` | `article_id` | `deleted`, `id` | `DELETE …/articles/{article_id}` |
| `generate_article` | `article_id`, `word_count?` (800 to 6,000), `idempotency_key?` | `job` | `POST …/generate` |
| `get_job` | `job_id`, `wait?` (0 to 30 seconds) | `job` | `GET /jobs/{job_id}` |
| `list_jobs` | `status?`, `type?`, `site_id?` | `jobs[]` | `GET /jobs` |
| `rewrite_section` | `article_id`, `selection`, `action`, `apply?` | `rewrite`, `article` | `POST …/rewrite-section` |
| `score_article` | `article_id` | `analysis` | `GET …/score` |
| `finish_article` | `article_id` | `article`, `deliveries` | `POST …/finish` |
| `publish_article` | `article_id`, `published_url?` | `article`, `deliveries` | `POST …/publish` |

`generate_article` spends 1 article credit. `get_job` is an account tool and takes no `site_id`.

### Autopilot and publishing tools

| Tool | Inputs | Output | API |
| --- | --- | --- | --- |
| `get_autopilot` | `site_id` | `autopilot` | `GET /sites/{site_id}/autopilot` |
| `set_autopilot` | `enabled?`, `weekly_cadence?` (1 to 7) | `autopilot` | `PATCH /sites/{site_id}/autopilot` |
| `list_integrations` | `site_id` | `integrations[]` | `GET /sites/{site_id}/integrations` |
| `get_integration` | `integration_id`, `webflow_site_id?`, `collection_id?` | `integration`, `options` | `GET …/integrations/{integration_id}` |
| `connect_integration` | `integration_id` | `connection` (`authorize_url`, `install_url` or `site_key`) | `POST …/connect` |
| `configure_integration` | `integration_id`, then the platform's fields | `integration` | `PATCH …/integrations/{integration_id}` |
| `sync_integration` | `integration_id` | `job` | `POST …/sync` |
| `disconnect_integration` | `integration_id` | `integration` | `DELETE …/integrations/{integration_id}` |
| `list_site_api_keys` | `site_id` | `site_keys[]` | `GET /sites/{site_id}/keys` |
| `create_site_api_key` | `name?` | `site_key` with `key` | `POST /sites/{site_id}/keys` |
| `revoke_site_api_key` | `key_id` | `site_key` | `DELETE /sites/{site_id}/keys/{key_id}` |

### Credits, Rank and growth tools

| Tool | Inputs | Output | API |
| --- | --- | --- | --- |
| `get_credits` | `site_id` | `credits` | `GET /sites/{site_id}/credits` |
| `get_rank` | `site_id` | `rank` | `GET /sites/{site_id}/rank` |
| `get_backlinks` | `site_id` | `backlinks` | `GET /sites/{site_id}/backlinks` |
| `update_backlink_settings` | `opted_in?`, `max_links_per_article?`, `niche?`, `topic_tags?`, `blocked_categories?` | `backlinks` | `PATCH /sites/{site_id}/backlinks` |
| `set_backlink_domain` | `domain` | `verification` | `POST …/backlinks/domain` |
| `verify_backlink_domain` | `site_id` | `verification` | `POST …/backlinks/domain/verify` |
| `list_backlink_targets` | `site_id` | `targets[]` | `GET …/backlinks/targets` |
| `add_backlink_target` | `url`, `anchors` (3 to 5), `topic_tags?`, `priority?`, `max_new_links_per_month?` | `target` | `POST …/backlinks/targets` |
| `list_backlinks` | `direction?` (`inbound` or `hosted`), `status?` | `placements[]` | `GET …/backlinks/placements` |
| `get_reddit` | `site_id` | `reddit` | `GET /sites/{site_id}/reddit` |
| `update_reddit_settings` | any field of `PATCH /sites/{site_id}/reddit` | `reddit` | `PATCH /sites/{site_id}/reddit` |
| `run_reddit_sweep` | `site_id` | `job` | `POST …/reddit/sweeps` |
| `list_reddit_threads` | `status?` | `threads[]` | `GET …/reddit/threads` |
| `draft_reddit_reply` | `thread_id`, `instructions?`, `idempotency_key?` | `draft` | `POST …/reddit/threads/{thread_id}/drafts` |
| `submit_reddit_permalink` | `thread_id`, `draft_id?`, `permalink?` | `reply` | `POST …/reddit/replies` |

`draft_reddit_reply` spends 1 Reddit reply credit. There is no tool that posts to Reddit. A person posts the draft from their own account, then you call `submit_reddit_permalink`.

### Billing and event tools

| Tool | Inputs | Output | API |
| --- | --- | --- | --- |
| `get_billing` | none | `billing` | `GET /billing` |
| `create_checkout_link` | none | `checkout` with `checkout_url` | `POST /billing/checkout` |
| `create_portal_link` | none | `portal` with `portal_url` | `POST /billing/portal` |
| `activate_plan` | `idempotency_key?` | `billing`, `charged` | `POST /billing/activate` |
| `get_studio_quote` | none | `studio_quote` | `GET /billing/studio-quote` |
| `list_events` | `since?`, `cursor?`, `types?`, `site_id?`, `limit?` | `events[]`, `next_cursor`, `has_more` | `GET /events` |

Webhooks need an HTTPS endpoint, so they are managed through the [API](/docs/agents/api-reference#events-and-webhooks) only. An MCP agent follows events with `list_events`.

## Example: plan and write one article

A typical session with an authenticated client, as tool calls:

1. `list_sites` → take `sites[0].id` as `site_id`.
2. `list_articles` with `{ "site_id": "6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64", "status": "opportunity" }` → pick an idea.
3. `generate_article` with the idea's `article_id` → returns a job.
4. `get_job` with `{ "job_id": "9a7e5c3b-1d2f-4e6a-8b9c-0d1e2f3a4b5c", "wait": 30 }`, repeated until `status` is `completed`.
5. `score_article` → read `analysis.checks` and fix anything marked `fail` with `rewrite_section`.

The `generate_article` call and its result:

```json
{
  "jsonrpc": "2.0",
  "id": 7,
  "method": "tools/call",
  "params": {
    "name": "generate_article",
    "arguments": {
      "site_id": "6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64",
      "article_id": "f2b8c1d4-7e3a-4b9c-a6d5-3e8f1a2b4c76",
      "word_count": 2000,
      "idempotency_key": "gen-f2b8c1d4"
    }
  }
}
```

```json
{
  "jsonrpc": "2.0",
  "id": 7,
  "result": {
    "content": [
      { "type": "text", "text": "Started writing “How to choose a product analytics tool for B2B SaaS” (1 article credit). Job 9a7e5c3b-1d2f-4e6a-8b9c-0d1e2f3a4b5c is queued; call get_job with wait 30." }
    ],
    "structuredContent": {
      "job": {
        "id": "9a7e5c3b-1d2f-4e6a-8b9c-0d1e2f3a4b5c",
        "type": "article.generate",
        "status": "queued",
        "site_id": "6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64",
        "resource": { "type": "article", "id": "f2b8c1d4-7e3a-4b9c-a6d5-3e8f1a2b4c76" },
        "result": null,
        "error": null,
        "created_at": "2026-10-02T15:22:05Z",
        "started_at": null,
        "finished_at": null
      }
    }
  }
}
```

The same call on an account without a trial:

```json
{
  "jsonrpc": "2.0",
  "id": 7,
  "result": {
    "isError": true,
    "content": [
      { "type": "text", "text": "Start the free trial to generate articles. Create a checkout link with create_checkout_link and send it to the account owner." }
    ],
    "structuredContent": {
      "error": "Start the free trial to generate articles. Create a checkout link with create_checkout_link and send it to the account owner.",
      "code": "subscription_required"
    }
  }
}
```

## Limits for MCP calls

Authenticated tool calls count against the account's API limits, exactly like REST requests: one tool call is one request, and tools that call an AI model also count toward the AI limit. `get_job` with `wait` counts once however long it waits. `create_account` follows the account creation limits. All numbers are in [Billing, credits and limits](/docs/agents/billing-and-limits#rate-limits).

## Troubleshooting

- **Only four tools are listed.** The client is connected anonymously. Check that the `Authorization` header reaches the server; some clients only send headers configured for remote servers, and some need a restart after a config change.
- **The tools disappeared after an hour.** An OAuth access token expired and the client didn't refresh it. Reconnect the server in the client, which runs the OAuth flow again.
- **`401` after the owner disconnected the app.** Expected: disconnecting revokes the tokens at once. Ask the owner to connect again if they want you back.
- **A tool call times out.** Use `get_job` with `wait` of 30 or less; a higher value can outlast the client's own timeout.
- **`create_site` failed with `human_required`.** The bank asked the cardholder to approve the charge. Send the owner `action_url` from the error.

## Related

- [The Rankbox MCP server](/docs/ai-tools/mcp-server): the server for people, with the public tools.
- [Agent authentication](/docs/agents/authentication): agent keys and OAuth in depth.
- [Agent API reference](/docs/agents/api-reference): the endpoint behind each tool.
- [Events and webhooks](/docs/agents/events): what `list_events` returns.
- [Agent playbooks](/docs/agents/playbooks): end-to-end recipes.
