---
title: Agent access
nav_title: Overview
description: How AI agents create Rankbox accounts or connect to existing ones, then run research, writing, publishing and billing through the API or MCP.
order: 1
updated: 2026-10-02
---

Agent access lets an AI agent use Rankbox the way a person uses the dashboard. An agent can create a Rankbox account for the person or business it works for, or connect to an account that already exists, and then run the whole content engine through the agent API or the MCP server: research, the content plan, writing, scoring, publishing, autopilot, backlinks, Reddit drafts and billing.

## What agent access is

Agent access is a second way in to the same Rankbox account a person signs in to. There is no separate "agent edition" of the product, no reduced feature set and no separate pricing. An agent works on the account's real sites, spends the account's real credits and follows the same plan rules as the account owner.

Every agent has a name. The name appears in the owner's emails and in the activity log at **Dashboard → Settings → Agent access**, next to everything the agent does.

An agent authenticates in one of two ways:

| Method | Looks like | Best for |
| --- | --- | --- |
| Agent key | `rv_agent_` followed by 48 hex characters, sent as `Authorization: Bearer rv_agent_…` | Server-side agents, scripts, coding agents, autonomous loops |
| OAuth 2.1 connection | A short-lived access token from Rankbox's authorization server, approved by the owner at `/oauth/consent` | Agents that run inside an AI app (Claude, ChatGPT, Cursor) and connect to an account a person already has |

Both give the same access. See [Agent authentication](/docs/agents/authentication).

## Who agent access is for

- **Coding agents building a project.** An agent that builds a website (Claude Code, Cursor, Codex, a custom agent) creates the Rankbox account while it builds, wires the blog to the REST API, and hands the owner one link to start the trial. See [Agent playbooks](/docs/agents/playbooks#a-coding-agent-adds-rankbox-to-a-nextjs-site).
- **Autonomous growth agents.** An agent that runs marketing for a business plans topics, writes and publishes articles, keeps autopilot fed and reports what happened, week after week.
- **Agencies' agents.** An agent that manages many clients runs each client as a site on one account with [Studio](/docs/account/studio), or connects to each client's own account.
- **Personal assistants.** An assistant in Claude or ChatGPT connects to an account its user already has and answers questions like "what did we publish this week?" or "write the next article in the plan".

## What an agent can do

An agent key or OAuth connection has full access to the whole account and every site on it. There are no scopes and no per-feature permissions: if the owner can do it in the dashboard, the agent can do it through the API.

| Area | What the agent can do |
| --- | --- |
| Account | Create an account, read it, resend the claim email, list and revoke agent keys and connections, read the activity log |
| Sites | List sites, read and change brand and writing settings, add and remove Studio sites, re-run the site scan |
| Research and plan | Run research, track keywords, add ideas, schedule and reorder the queue |
| Articles | Generate, read, edit, rewrite a passage, score, finish, publish, delete |
| Autopilot | Turn it on or off and set the weekly pace |
| Publishing | Create site API keys, connect Webflow or Shopify (the owner approves on the platform), sync, record live URLs |
| Growth | Read Rank, run the backlink exchange (domain, targets, placements), find Reddit threads and draft replies |
| Billing | Read plan status and credits, create a checkout link for the owner, open the billing portal link, end the trial early, see Studio prices |
| Events | Read the event stream, register signed webhooks |

The complete list is in the [Agent API reference](/docs/agents/api-reference). The same actions are available as [MCP tools](/docs/agents/mcp).

## The few things a person does

Full access still leaves a handful of moments that a person has to handle. They aren't permissions you can grant; they exist because of who is allowed to do them:

| Moment | Why it needs a person | What the agent gets |
| --- | --- | --- |
| Entering payment details | Card details go to Stripe and only the cardholder can enter them or pass a 3-D Secure check | A `checkout_url` to hand to the owner |
| Approving a third-party platform | Webflow and Shopify show their own approval screens to their own account holders | An `authorize_url` or `install_url` to hand to the owner |
| Posting on Reddit | Rankbox never posts to Reddit and never holds a Reddit login. A person posts from their own account | A draft to hand over, then the permalink to record |
| Deleting the account | It can't be undone, so only the signed-in owner can do it | A `human_required` error with the dashboard link |

Everything else works without anyone in the loop. See [Permissions and guardrails](/docs/agents/permissions) for the reasons and for what the owner can see and revoke.

## How it works in four steps

1. **Get access.** Create a new account with `POST /api/agent/v1/accounts`, which returns an agent key at once, or connect to an existing account through OAuth or a key the owner creates. See [Create an account as an agent](/docs/agents/create-account).
2. **Set up the site.** Rankbox scans the website automatically, builds a brand profile, finds keywords and plans up to 30 articles. The agent reviews the plan, adds topics and sets the writing voice.
3. **Start the engine.** The owner starts the 7-day trial by opening the checkout link and adding a card. The agent then generates articles, checks their score and publishes them, or lets autopilot write on a schedule.
4. **Run it.** The agent subscribes to events or polls `GET /events`, keeps the queue full, watches credits and reports to the owner.

The [Quickstart for AI agents](/docs/agents/quickstart) walks through all four with real requests.

## Entry points

| What | URL |
| --- | --- |
| Docs index for agents (Markdown) | `https://rankbox.xyz/docs/llms.txt` |
| All docs in one file | `https://rankbox.xyz/docs/llms-full.txt` |
| Agent quickstart (Markdown) | `https://rankbox.xyz/docs/agents/quickstart.md` |
| Any docs page as Markdown | Add `.md` to its path, for example `https://rankbox.xyz/docs/agents/api-reference.md` |
| Agent API base URL | `https://rankbox.xyz/api/agent/v1` |
| Create an account (no auth) | `POST https://rankbox.xyz/api/agent/v1/accounts` |
| MCP server (Streamable HTTP) | `https://rankbox.xyz/mcp` |
| OAuth protected resource metadata | `https://rankbox.xyz/.well-known/oauth-protected-resource` |
| OAuth consent page (owner) | `https://rankbox.xyz/oauth/consent` |
| Public articles API (site keys) | `https://rankbox.xyz/api/public/v1` |

> [!TIP]
> An agent that has never seen Rankbox should fetch `https://rankbox.xyz/docs/agents/quickstart.md` first. It is written to be executed top to bottom.

## Agent API and public API

Rankbox has two REST APIs. They don't overlap:

| | Agent API | Public articles API |
| --- | --- | --- |
| Base URL | `https://rankbox.xyz/api/agent/v1` | `https://rankbox.xyz/api/public/v1` |
| Key | `rv_agent_…` or an OAuth token | `rv_live_…` site key |
| Reach | The whole account, every site | One site |
| Can do | Everything in the dashboard | Read finished articles, report live URLs |
| Typical caller | The agent | The website, a CMS plugin, a build script |

An agent uses the agent API to run Rankbox and creates a site key for the website itself. Deploy the site key on the website, never the agent key. See [Authentication and API keys](/docs/api/authentication) for site keys.

## Plans and credits for agents

Agents use the account's plan and credits. Account creation, the site scan, research and planning are free and need no card. Generating articles needs the trial or the Business plan ($49.50 a month, 30 articles, 30 backlink credits and 30 Reddit reply drafts per site). The trial lasts 7 days, includes 7 article credits and starts only when the owner adds a card. The backlink exchange, Reddit Presence and Studio open with the first paid invoice. See [Billing, credits and limits](/docs/agents/billing-and-limits).

## What Rankbox doesn't do for agents

- It doesn't post to Reddit or any social network.
- It doesn't track whether AI engines cite an article. The Rank page measures how much of the site's keyword market has a published answer, with estimated traffic.
- It doesn't promise rankings, traffic or citations, to agents or anyone else.
- It doesn't let an agent see card numbers or other accounts' data.

## Related

- [Quickstart for AI agents](/docs/agents/quickstart): the whole flow with real requests.
- [Create an account as an agent](/docs/agents/create-account): fields, the claim email and limits.
- [Agent authentication](/docs/agents/authentication): agent keys and OAuth.
- [Agent API reference](/docs/agents/api-reference): every endpoint.
- [Agent MCP tools](/docs/agents/mcp): the same actions as MCP tools.
- [Core concepts](/docs/get-started/core-concepts): accounts, sites, articles and credits.
