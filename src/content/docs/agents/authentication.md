---
title: Agent authentication
nav_title: Authentication
description: How agents authenticate with Rankbox: rv_agent_ keys, OAuth 2.1 with PKCE and dynamic client registration, dashboard keys, rotation, revocation and site keys.
order: 4
updated: 2026-10-02
---

Every request to the agent API and every authenticated MCP call carries one credential: an agent key or an OAuth access token. Both give full access to the account and every site on it. This page explains how to get each one, how to send it, how long it lasts, and how to rotate and revoke it.

## Two ways to authenticate

| | Agent key | OAuth 2.1 connection |
| --- | --- | --- |
| Looks like | `rv_agent_` and 48 hex characters | A JWT access token plus a refresh token |
| You get it from | `POST /accounts`, the owner's dashboard, or `POST /agent-keys` | The owner approving your app at `https://rankbox.xyz/oauth/consent` |
| Lifetime | Until revoked | Access token: 1 hour. Refresh token: until used or revoked |
| Best for | Server-side agents, scripts, coding agents, autonomous loops | Agents inside an AI app that connect to an account a person already has |
| Works on | `https://rankbox.xyz/api/agent/v1` and `https://rankbox.xyz/mcp` | The same two |
| Access | Full | Full |

Neither credential has scopes. There is no read-only agent key and no per-site agent key; if you need narrower access for a website, use a [site key](#agent-keys-and-site-keys) instead.

## Agent keys

| Property | Detail |
| --- | --- |
| Format | `rv_agent_` followed by 48 lowercase hexadecimal characters, 57 characters in all |
| Shown | Once, when it is created. Rankbox can't show it again |
| Stored | Only a SHA-256 hash. A copy of Rankbox's database contains no usable key |
| Displayed later | The first 15 characters and an ellipsis, for example `rv_agent_a1b2c3…` |
| Name | The agent's name, shown in the activity log and the owner's emails |
| Expiry | None. A key works until it is revoked or the account is deleted |
| Plan needed | No. A key works on an account with no trial or plan; some actions need one |
| Limit | 25 active agent keys and OAuth connections per account |

In examples, the key is `rv_agent_xxxxxxxxxxxx` and lives in the environment variable `RANKBOX_AGENT_KEY`.

## Send the credential

Put the key or access token in the `Authorization` header with the `Bearer` scheme. The agent API doesn't accept keys in query strings or in an `X-Api-Key` header.

```bash title="cURL"
curl https://rankbox.xyz/api/agent/v1/account \
  -H "Authorization: Bearer $RANKBOX_AGENT_KEY"
```

```ts title="TypeScript"
const res = await fetch("https://rankbox.xyz/api/agent/v1/account", {
  headers: { Authorization: `Bearer ${process.env.RANKBOX_AGENT_KEY}` },
});
if (!res.ok) throw new Error(`${res.status} ${(await res.json()).code}`);
const { account } = await res.json();
```

```python title="Python"
import os, requests

res = requests.get(
    "https://rankbox.xyz/api/agent/v1/account",
    headers={"Authorization": f"Bearer {os.environ['RANKBOX_AGENT_KEY']}"},
    timeout=30,
)
res.raise_for_status()
account = res.json()["account"]
```

## Get an agent key

There are three ways, depending on who acts first:

| Situation | How |
| --- | --- |
| You create the account | `POST /api/agent/v1/accounts` returns `agent_key.key`. See [Create an account as an agent](/docs/agents/create-account) |
| The owner already has an account | The owner creates a key in the dashboard and gives it to you |
| You already have a key and need another | `POST /api/agent/v1/agent-keys`, for example to rotate or to give a second agent its own key |

### Create a key in the dashboard

These are the owner's steps. Send them to the owner if they want to give you a key:

1. Sign in at `https://rankbox.xyz` and open **Dashboard → Settings → Agent access**.
2. Click **Create agent key**.
3. Enter the agent's name, as it should appear in the activity log.
4. Click **Create key**.
5. Click **Copy** and pass the key to the agent through a secret store or a private channel. The key isn't shown again after the dialog closes.

### Create a key through the API

```bash title="cURL"
curl -X POST https://rankbox.xyz/api/agent/v1/agent-keys \
  -H "Authorization: Bearer $RANKBOX_AGENT_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "name": "Atlas (rotated 2026-10)", "operator": "Northwind Analytics" }'
```

```json
{
  "agent_key": {
    "id": "e1c3a5b7-9d2f-4e6a-8c0b-1d3f5a7c9e24",
    "type": "key",
    "name": "Atlas (rotated 2026-10)",
    "key": "rv_agent_xxxxxxxxxxxx",
    "prefix": "rv_agent_9f8e7d…",
    "client_id": null,
    "operator": "Northwind Analytics",
    "contact_url": null,
    "created_at": "2026-10-02T16:40:00Z",
    "last_used_at": null
  }
}
```

The owner gets an email whenever a new agent key or OAuth connection is added to the account.

## Connect to an existing account

When the owner already has a Rankbox account, `POST /accounts` answers `409 account_exists`. Connect in one of two ways:

1. **OAuth.** Your app sends the owner to Rankbox's consent page, they click **Connect**, and you receive tokens. Nothing secret is copied by hand. Use this when you are an app that many people connect to, or when the owner is at a browser now.
2. **A dashboard key.** The owner follows [Create a key in the dashboard](#create-a-key-in-the-dashboard) and pastes the key into your configuration. Use this for a single agent on a server.

Both end with the same full access.

## OAuth 2.1 walkthrough

Rankbox runs a standard OAuth 2.1 authorization server with the authorization code grant, PKCE (`S256`) and dynamic client registration (RFC 7591). MCP clients that implement the MCP authorization spec do all of this automatically when they connect to `https://rankbox.xyz/mcp`. The steps below are for agents that implement it themselves.

### Step 1: Discover the authorization server

A request without a valid token returns `401` with a pointer to the metadata:

```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer resource_metadata="https://rankbox.xyz/.well-known/oauth-protected-resource"
Content-Type: application/json

{ "error": "Invalid or missing credentials. Send 'Authorization: Bearer <agent key or access token>'.", "code": "unauthorized" }
```

Fetch the protected resource metadata (RFC 9728):

```bash title="cURL"
curl https://rankbox.xyz/.well-known/oauth-protected-resource
```

```json
{
  "resource": "https://rankbox.xyz/mcp",
  "authorization_servers": ["<issuer URL>"],
  "bearer_methods_supported": ["header"]
}
```

Read the issuer URL from `authorization_servers[0]`; don't hard-code it. Then fetch the authorization server's metadata (RFC 8414) from the issuer's well-known path. It gives you the four endpoints you need: `registration_endpoint`, `authorization_endpoint`, `token_endpoint` and `revocation_endpoint`, and confirms `code_challenge_methods_supported` includes `S256`. One token works on both the MCP server and the agent API.

### Step 2: Register your client

Register once per installation of your app, then store the `client_id`:

```bash title="cURL"
curl -X POST "$REGISTRATION_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{
    "client_name": "Atlas",
    "redirect_uris": ["https://agent.northwind.example/oauth/callback"],
    "grant_types": ["authorization_code", "refresh_token"],
    "response_types": ["code"],
    "token_endpoint_auth_method": "none"
  }'
```

The response includes `client_id`. `client_name` is the name the owner sees on the consent screen and in the activity log, so use the name they know. Native and CLI agents can register a loopback redirect such as `http://127.0.0.1:53682/callback`; the consent screen then tells the owner they go back to "an app on this computer".

### Step 3: Send the owner to authorize

Generate a PKCE verifier and challenge, and a random `state`:

```ts title="TypeScript"
import { createHash, randomBytes } from "node:crypto";

const verifier = randomBytes(32).toString("base64url");
const challenge = createHash("sha256").update(verifier).digest("base64url");
const state = randomBytes(16).toString("base64url");

const url = new URL(AUTHORIZATION_ENDPOINT);
url.search = new URLSearchParams({
  response_type: "code",
  client_id: CLIENT_ID,
  redirect_uri: "https://agent.northwind.example/oauth/callback",
  code_challenge: challenge,
  code_challenge_method: "S256",
  state,
  scope: "openid email",
  resource: "https://rankbox.xyz/mcp",
}).toString();
// Open url in the owner's browser, or send it to them.
```

```python title="Python"
import base64, hashlib, secrets
from urllib.parse import urlencode

verifier = secrets.token_urlsafe(32)
challenge = base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).rstrip(b"=").decode()
state = secrets.token_urlsafe(16)

url = AUTHORIZATION_ENDPOINT + "?" + urlencode({
    "response_type": "code",
    "client_id": CLIENT_ID,
    "redirect_uri": "https://agent.northwind.example/oauth/callback",
    "code_challenge": challenge,
    "code_challenge_method": "S256",
    "state": state,
    "scope": "openid email",
    "resource": "https://rankbox.xyz/mcp",
})
```

Scopes don't narrow access: every token has full access. `scope` only controls which identity claims the token carries.

### Step 4: The owner approves

The authorization endpoint sends the owner to `https://rankbox.xyz/oauth/consent`:

1. If they aren't signed in, they see **Sign in to connect an app** and sign in to Rankbox.
2. The page says "{client_name} wants to use your Rankbox account" and shows which email they are signed in as, with **Not you?** to switch accounts.
3. A box lists what the app can do once connected: manage everything in the Rankbox account, including sites, articles, publishing, settings and billing.
4. A warning says that apps name themselves and Rankbox doesn't check the name, and shows where the browser goes next.
5. The owner clicks **Connect**, or **Cancel**.

On **Connect**, the browser goes to your `redirect_uri` with `code` and `state`. On **Cancel**, it goes there with `error=access_denied`. Check that `state` matches the value you sent before using the code.

### Step 5: Exchange the code for tokens

```bash title="cURL"
curl -X POST "$TOKEN_ENDPOINT" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d grant_type=authorization_code \
  -d code="$CODE" \
  -d redirect_uri=https://agent.northwind.example/oauth/callback \
  -d client_id="$CLIENT_ID" \
  -d code_verifier="$VERIFIER"
```

```json
{
  "access_token": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9…",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "v1.rt_xxxxxxxxxxxx",
  "scope": "openid email"
}
```

An authorization code works once and expires after 10 minutes. Store the refresh token in your secret store.

### Step 6: Call the API

Send the access token exactly like an agent key:

```bash title="cURL"
curl https://rankbox.xyz/api/agent/v1/account \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

### Step 7: Refresh the access token

Refresh shortly before `expires_in` runs out, or when a call returns `401`:

```bash title="cURL"
curl -X POST "$TOKEN_ENDPOINT" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d grant_type=refresh_token \
  -d refresh_token="$REFRESH_TOKEN" \
  -d client_id="$CLIENT_ID"
```

The response has the same shape as step 5. Refresh tokens rotate: each refresh returns a new one and the old one stops working, so always store the newest. If two processes share one connection, let only one of them refresh.

### Token lifetimes

| Token | Lifetime | Ends early when |
| --- | --- | --- |
| Authorization code | 10 minutes, single use | Used once |
| Access token | 1 hour (`expires_in: 3600`) | The owner disconnects the app; Rankbox checks the connection on every request, so this takes effect at once |
| Refresh token | No fixed expiry, single use | Used once (a new one replaces it), or the owner disconnects the app |

If a refresh fails with `invalid_grant`, the connection is gone. Start again from step 3.

## Rotate an agent key

Rotate a key on a schedule (every 90 days is a reasonable default), when someone with access to it leaves, and whenever you suspect it leaked.

1. Create a new key with `POST /agent-keys`, or ask the owner to create one in the dashboard.
2. Save the new key to your secret store and deploy it everywhere the old one was used.
3. Call `GET /account` with the new key to confirm it works.
4. If the old key registered webhook endpoints, create them again with the new key. Endpoints belong to the key that created them.
5. Revoke the old key with `DELETE /agent-keys/{key_id}`.

Both keys work in parallel between step 1 and step 5, so nothing breaks while you deploy.

## Revoke a key or connection

Revocation is immediate and permanent. The next request with that key or token returns `401 unauthorized`.

| Who | How |
| --- | --- |
| The owner | **Dashboard → Settings → Agent access**, then **Revoke** next to the key or **Disconnect** next to the app |
| An agent | `DELETE /api/agent/v1/agent-keys/{id}`, with the `id` of a key or OAuth connection from `GET /agent-keys`. An agent can revoke its own key |
| Rankbox | A key published in a public place, such as a public repository, may be revoked by Rankbox, and the owner is emailed |

Revoking a key or connection also disables the webhook endpoints it registered. Work it already started, such as a generation job, finishes normally.

## Agent keys and site keys

Rankbox has two kinds of key. Use each for its own job:

| | Agent key | Site key |
| --- | --- | --- |
| Prefix | `rv_agent_` | `rv_live_` |
| Reaches | The whole account, every site | One site |
| API | Agent API and MCP | Public articles API (`/api/public/v1`) |
| Can | Everything the owner can do in the dashboard | Read the site's finished articles and record their live URLs |
| Created by | `POST /accounts`, **Dashboard → Settings → Agent access**, `POST /agent-keys` | **Dashboard → Integrations**, or `POST /sites/{site_id}/keys` |
| Needs a trial or plan | No | Yes, to create one and to use it |
| Belongs on | The agent's server-side secret store | The website's server, a CMS plugin, a build pipeline |

A website only needs to read articles, so it should hold a site key. Never deploy an agent key to a website, a browser bundle, a mobile app or a CMS plugin. See [Authentication and API keys](/docs/api/authentication) for site keys.

## Authentication errors

| Status and code | When | Fix |
| --- | --- | --- |
| `401 unauthorized` | No `Authorization` header, a malformed or unknown key, a revoked key, an expired access token, a disconnected app, or a deleted account | Check the header. Refresh the access token. If the key was revoked, get a new one |
| `401 unauthorized` with a `rv_live_` key | A site key sent to the agent API | Use an agent key. Site keys work only on `/api/public/v1` |
| `403 human_required` | The action can only be done by the signed-in owner, such as deleting the account | Send the owner `action_url` from the error |

Rankbox doesn't tell you which of the `401` causes applies, so that a probe learns nothing about other accounts.

## Troubleshooting

- **The key works in cURL but not in my code.** Check for a trailing newline or space in the environment variable, and that your HTTP client doesn't drop the `Authorization` header on redirects. Call `https://rankbox.xyz`, not `www.rankbox.xyz`.
- **The consent page says "Start from the app you're connecting".** The page was opened without an `authorization_id`. Start again from your authorization URL, not from a bookmarked consent link.
- **The consent page says "This request is no longer valid".** The request expired or was already answered. Start again from step 3.
- **Refresh returns `invalid_grant` right after a deploy.** Two instances refreshed with the same refresh token and one of them received a token that the other then invalidated. Keep refresh in one place.
- **The owner approved, but calls return 401.** You may be sending the refresh token instead of the access token, or an access token from a different authorization server.

## Related

- [Create an account as an agent](/docs/agents/create-account): get a key by creating the account.
- [Permissions and guardrails](/docs/agents/permissions): the full-access model and the activity log.
- [Agent MCP tools](/docs/agents/mcp): using the same credentials with the MCP server.
- [Agent API reference](/docs/agents/api-reference#agent-keys): the agent key endpoints.
- [Authentication and API keys](/docs/api/authentication): site keys for websites and plugins.
