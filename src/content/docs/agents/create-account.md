---
title: Create an account as an agent
nav_title: Create an account
description: Create a Rankbox account for a person or business with one API call: fields, the agent key, the claim email, duplicate emails, validation and abuse limits.
order: 3
updated: 2026-10-02
---

An agent creates a Rankbox account with one unauthenticated request to `POST https://rankbox.xyz/api/agent/v1/accounts`. The account works for the agent at once, Rankbox emails the owner so they can claim it, and the website scan starts on its own. Use this page when the person or business you work for doesn't have a Rankbox account yet.

## Create or connect

| Situation | What to do |
| --- | --- |
| The owner has no Rankbox account | Create one with `POST /accounts` (this page) |
| The owner has an account | Don't create a second one. Connect through OAuth, or ask the owner for an agent key. See [Agent authentication](/docs/agents/authentication#connect-to-an-existing-account) |
| You don't know | Try `POST /accounts`. A `409 account_exists` answer tells you to connect instead |
| The owner runs several brands | Create one account, then add the other brands as Studio sites with `POST /sites` once the plan is paid. See [Studio](/docs/account/studio) |

One account belongs to one owner email. An account can run many sites, so don't create an account per website for the same owner.

## The request

```http
POST /api/agent/v1/accounts HTTP/1.1
Host: rankbox.xyz
Content-Type: application/json
Idempotency-Key: 0f7c1d52-create-northwind
```

No `Authorization` header is needed or read. The `Idempotency-Key` header is optional but strongly recommended: see [Retries and idempotency](#retries-and-idempotency).

### Request body

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `email` | string | Yes | The owner's email address, at most 254 characters. Must be able to receive mail. Addresses at disposable-email services are refused |
| `site_url` | string | Yes | The website to grow. A public `http` or `https` URL, at most 2,048 characters. Localhost, private network addresses and IP literals are refused |
| `site_name` | string | No | The brand name, 1 to 120 characters. When left out, the scan reads it from the website |
| `site_description` | string | No | What the business sells, at most 2,000 characters. When left out, the scan writes it from the website |
| `agent` | object | Yes | Who is creating the account. See [Agent identity](#agent-identity) |
| `agent.name` | string | Yes | The agent's name, 2 to 60 characters, for example `Atlas` |
| `agent.operator` | string | No | The company or person running the agent, at most 100 characters |
| `agent.contact_url` | string | No | An `https` URL where the owner can learn about or contact the agent's operator |

```json
{
  "email": "maya@northwind.example",
  "site_url": "https://northwind.example",
  "site_name": "Northwind Analytics",
  "agent": {
    "name": "Atlas",
    "operator": "Northwind Analytics",
    "contact_url": "https://northwind.example/atlas"
  }
}
```

## The response

A successful call returns `201 Created`:

| Field | Type | What it is |
| --- | --- | --- |
| `account` | object | The new account: `id`, `email`, `claimed` (`false`), `claimed_at` (`null`), `created_at`, `created_by_agent`, `primary_site_id`, `billing_status` (`none`) |
| `site` | object | The account's primary site, with `scan_status: "running"`. Same shape as `GET /sites/{site_id}` |
| `scan_job_id` | string | The job that scans the website. Poll `GET /jobs/{job_id}` or `GET /sites/{site_id}/scan` |
| `agent_key` | object | Your key: `id`, `type` (`key`), `name`, `key` (the secret, shown only here), `prefix`, `client_id` (`null`), `operator`, `contact_url`, `created_at`, `last_used_at` |
| `claim_url` | string | The owner's claim link, the same one Rankbox emails. Valid for 7 days |

```json
{
  "account": {
    "id": "8b0d3c4e-2f6a-4f1b-9d3e-5a7c1e2b9f40",
    "email": "maya@northwind.example",
    "claimed": false,
    "claimed_at": null,
    "created_at": "2026-10-02T14:03:11Z",
    "created_by_agent": {
      "name": "Atlas",
      "operator": "Northwind Analytics",
      "contact_url": "https://northwind.example/atlas"
    },
    "primary_site_id": "6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64",
    "billing_status": "none"
  },
  "site": {
    "id": "6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64",
    "kind": "primary",
    "status": "active",
    "brand_name": "Northwind Analytics",
    "website_url": "https://northwind.example",
    "product_description": "",
    "avatar_url": null,
    "writing": {
      "tone": "Professional",
      "writing_style": "Balanced",
      "audience": "Founders / Entrepreneurs",
      "brand_voice": ""
    },
    "scan_status": "running",
    "billed_from": null,
    "removes_at": null,
    "archived_at": null,
    "dashboard_url": "https://rankbox.xyz/dashboard?site=6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64",
    "created_at": "2026-10-02T14:03:11Z"
  },
  "scan_job_id": "3c5e7a9b-1d3f-4b5c-8e7a-9c1b3d5f7a92",
  "agent_key": {
    "id": "2d4f6a8c-1e3b-4c5d-8f7a-9b0c1d2e3f45",
    "type": "key",
    "name": "Atlas",
    "key": "rv_agent_xxxxxxxxxxxx",
    "prefix": "rv_agent_a1b2c3…",
    "client_id": null,
    "operator": "Northwind Analytics",
    "contact_url": "https://northwind.example/atlas",
    "created_at": "2026-10-02T14:03:11Z",
    "last_used_at": null
  },
  "claim_url": "https://rankbox.xyz/claim/ct_xxxxxxxxxxxx"
}
```

> [!IMPORTANT]
> `agent_key.key` appears in this response and nowhere else. Store it in a secret store before you do anything else. Rankbox keeps only a SHA-256 hash of it.

## What happens when the account is created

All of this happens inside the one request, or starts during it:

1. Rankbox creates the account under the owner's email and creates its primary site from `site_url`.
2. The site's writing settings start at their defaults: tone `Professional`, writing style `Balanced`, audience `Founders / Entrepreneurs`, no house rules. Autopilot is on at 7 articles a week, but writes nothing until a trial starts.
3. The site scan starts. It reads the brand (name, description, logo), analyzes the business (niche, audience, market, competitors), finds about 20 keywords and plans one article per keyword, up to 30. The first 4 become ideas and the rest are scheduled one a day from the next day. It usually finishes in 1 to 3 minutes and fires `site.scan_completed`.
4. Rankbox issues the agent key, named after `agent.name`.
5. Rankbox emails the owner.

The account is fully usable by the agent from the moment the response arrives. It doesn't wait for the owner to claim it.

## The owner's email

The owner receives one email from Rankbox, with the subject "{agent name} created a Rankbox account for you". It says:

- which agent created the account, with `agent.operator` and `agent.contact_url` when you sent them;
- which website the account is for;
- that the agent has full access to the account, and what that includes;
- that nothing is charged unless the owner adds a card and starts the trial;
- two buttons: **Claim your account** and **This wasn't me**.

Because the owner reads this email cold, tell them about it yourself first, in the channel you already share with them. An expected email gets claimed; an unexpected one gets reported.

## The claim flow

Claiming turns the account into one the owner can sign in to. It doesn't change anything the agent can do.

1. The owner opens **Claim your account** in the email, or the `claim_url` you gave them.
2. The claim page shows the email, the website and the agent's name.
3. The owner clicks **Continue with Google** with the same email address, or sets a password.
4. Rankbox signs them in and opens the dashboard on the site's Overview.

After the claim, `account.claimed` becomes `true`, `claimed_at` is set and the `account.claimed` event fires. The owner sees everything the agent did under **Dashboard → Settings → Agent access**, with the agent key listed by name.

A claim link works for 7 days. After that, the owner can still get in by signing in at `https://rankbox.xyz/auth` with Google using the same email, or by resetting the password for that email. You can also send a fresh claim email:

```bash title="cURL"
curl -X POST https://rankbox.xyz/api/agent/v1/account/resend-claim \
  -H "Authorization: Bearer $RANKBOX_AGENT_KEY"
```

The response is `{ "sent": true, "claim_url": "https://rankbox.xyz/claim/ct_xxxxxxxxxxxx" }`. Rankbox sends at most 3 claim emails per account per day. On a claimed account the call returns `409 conflict`.

## If the owner clicks This wasn't me

**This wasn't me** is for an email address that someone used without permission. When the owner confirms it:

- Rankbox deletes the account, its sites, its articles and its settings.
- Every agent key and connection on it stops working. Your next request returns `401 unauthorized`.
- If a trial had started, it is cancelled before any charge.
- The email address is free to sign up again normally.

If this happens to an account you created in good faith, check that you had the right email and that the owner expected it.

## Unclaimed accounts

An unclaimed account works like any other account. The agent can scan, research, plan, and, once the owner has started the trial through the checkout link, generate and publish. Paying through the checkout link doesn't require the owner to claim the account first.

An account that is still unclaimed 30 days after it was created, and has never had a trial or plan, is deleted with its data. Its agent keys stop working. An account with a trial or plan is never deleted for being unclaimed.

## Duplicate emails

Each email address can own one Rankbox account. If the email in your request already has one, the call returns `409`:

```json
{
  "error": "This email already has a Rankbox account. Ask the owner to connect you: OAuth at https://rankbox.xyz/.well-known/oauth-protected-resource, or an agent key from Dashboard → Settings → Agent access.",
  "code": "account_exists",
  "docs_url": "https://rankbox.xyz/docs/agents/authentication#connect-to-an-existing-account"
}
```

The response doesn't reveal anything else about the existing account, and Rankbox doesn't email its owner about your attempt. Don't retry with a variant of the same address (an alias or a different capitalization). Connect instead.

## Validation errors

A request with a missing or invalid field returns `422`, with one entry per problem in `details`:

```json
{
  "error": "Some fields are invalid.",
  "code": "validation_failed",
  "details": [
    { "field": "site_url", "problem": "Use a public http or https address. Localhost and private networks can't be scanned." },
    { "field": "agent.name", "problem": "Give the agent a name of 2 to 60 characters." }
  ]
}
```

A body that isn't valid JSON returns `400` with `"code": "bad_request"`.

## Retries and idempotency

Account creation is the one call where a lost response hurts, because the response holds the only copy of the agent key. Send an `Idempotency-Key` header with a value unique to this account, such as a UUID you generate and store before the call.

| Retry | Result |
| --- | --- |
| Same `Idempotency-Key`, same body, within 24 hours | The original `201` response, including the same agent key |
| Same `Idempotency-Key`, different body | `409` with `"code": "conflict"` |
| No `Idempotency-Key`, and the first call succeeded | `409` with `"code": "account_exists"` |
| After 24 hours | The key is forgotten and the call behaves like a new one |

If you lost the response and have no idempotency key, the account exists but you have no key. Ask the owner to claim the account from the email and create a key at **Dashboard → Settings → Agent access → Create agent key**.

## Abuse limits

Account creation is open without authentication, so it has its own limits:

| Limit | Value | Response when exceeded |
| --- | --- | --- |
| Accounts created per IP address | 5 an hour and 20 a day | `429 rate_limited` with `Retry-After` |
| Accounts per email address | 1 | `409 account_exists` |
| Disposable-email domains | Refused | `422 validation_failed` on `email` |
| Claim emails per account | 3 a day | `429 rate_limited` |
| Research runs on an account with no trial or plan | 10 a day | `429 rate_limited` |
| Site scans on an account with no trial or plan | 3 a day, including the first | `429 rate_limited` |

An agent that creates accounts for many owners, such as an agency's agent, should spread creation over time and run from a stable address. If a legitimate use needs more, contact [support](/docs/help/support).

## Agent identity

The `agent` object is how the owner recognizes you, in the email, on the claim page and in the activity log. Rankbox can't verify it, so make it honest and recognizable:

- **`name`**: the name the owner knows you by. If the owner talks to "Atlas", use `Atlas`, not a model name or an internal id.
- **`operator`**: whoever is responsible for the agent. For an agency, the agency's name; for an owner's own agent, the owner's company.
- **`contact_url`**: a page that explains the agent or lets the owner reach its operator.

Impersonating another company, product or person in these fields breaks the [Acceptable Use Policy](/legal/acceptable-use) and gets the account suspended. The same fields are stored on the agent key, and you can't change them later; create a new key with the right values instead.

## Checklist after creating an account

1. Store `agent_key.key` in your secret store.
2. Call `GET /account` with the key to confirm it works.
3. Tell the owner the account exists, that Rankbox has emailed them, and share `claim_url`.
4. Wait for the scan: poll `GET /sites/{site_id}/scan` or listen for `site.scan_completed`.
5. Create a checkout link with `POST /billing/checkout` and send it to the owner, so they can start the trial.
6. Register a webhook or start polling `GET /events`.
7. Continue with the [Quickstart for AI agents](/docs/agents/quickstart#step-5-add-topics-and-run-research).

## Related

- [Quickstart for AI agents](/docs/agents/quickstart): what to do after the account exists.
- [Agent authentication](/docs/agents/authentication): connecting to an account that already exists.
- [Permissions and guardrails](/docs/agents/permissions): what the owner can see and revoke.
- [Billing, credits and limits](/docs/agents/billing-and-limits): the trial, the card and what is free.
- [The free trial](/docs/account/free-trial): the trial from the owner's side.
