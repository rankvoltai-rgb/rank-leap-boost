---
title: Authentication and API keys
nav_title: Authentication
description: How Rankbox API keys work: the rv_live_ format, one key per site, creating, replacing and revoking keys, the Authorization header, and storing keys safely.
order: 2
updated: 2026-10-02
---

Every request to the Rankbox REST API carries an API key. A key belongs to one site in your account: it can read that site's finished articles and record their live URLs, and nothing else. This page covers how keys work, how to create, replace and revoke them, and how to keep them safe.

## How API keys work

| Property | Detail |
| --- | --- |
| Format | `rv_live_` followed by 48 lowercase hexadecimal characters, 56 characters in all |
| Shown | Once, right after you create it. Rankbox can't show it again |
| Stored | Only a SHA-256 hash of the key. A copy of Rankbox's database would not contain a usable key |
| Displayed later | The first 14 characters and an ellipsis, for example `rv_live_3f9a1c…`, so you can tell keys apart |
| Scope | One site. Never another site on the same account |
| Permissions | Every key has the same access: read the site's finished articles and record their live URLs |
| Name | Up to 60 characters, for your own reference |
| Expiry | None. A key works until you revoke it |
| Plan requirement | A key authenticates only while its site is active on a trial or plan |

The `rv_` prefix dates from the product's earlier name, Rankvolt, and is kept so existing keys and integrations keep working. The rest of the key is random.

## One key, one site

A key is created for the site you have open in the dashboard, and every request made with it is scoped to that site. It never returns another site's articles, even on the same account, and it can't record a live URL for another site's article.

If your account runs several sites with [Studio](/docs/account/studio), switch to the right site first with the site switcher at the foot of the sidebar, then create the key. The **Integrations** page lists only the keys of the site you have open.

A site can have more than one active key, for example one for production and one for a staging build. The **Your connections** list suggests one key per site; if more than one integration syncs the same site, give each its own key so you can revoke one without breaking the others.

## Create a key

You need an active trial or plan, and the site must be active on your account.

1. Pick the site in the site switcher at the foot of the sidebar.
2. Open **Dashboard → Integrations**.
3. In the connector library, choose **REST API** under **Developer**. You can also open it directly at `https://rankbox.xyz/dashboard/integrations?connector=api`.
4. In step 1, **Create a key for this site**, keep the suggested name (**My website**) or type your own.
5. Click **Create key**.
6. In step 2, **Copy your key**, click **Copy key**.
7. Store the key where your site keeps its secrets. The dashboard won't show it again.

The website connectors under **Your website** can lead to the same setup. When a platform's card offers **Connect with the API**, that button opens these steps, and the key it creates is named after the platform (for example **WordPress site**), so the connection shows that platform's logo later.

Without an active trial or plan, step 1 says "Connecting a site comes with your plan. Start your 7-day free trial to create a key." with a **Start free trial** button. The server enforces the same rule: a key request without a plan fails with "Start your free trial to connect your site." See [The free trial](/docs/account/free-trial).

## Send the key with each request

Send the key in the `Authorization` header with the `Bearer` scheme:

```bash title="cURL"
curl https://rankbox.xyz/api/public/v1/ping \
  -H "Authorization: Bearer $RANKBOX_API_KEY"
```

```js title="JavaScript"
const res = await fetch("https://rankbox.xyz/api/public/v1/ping", {
  headers: { Authorization: `Bearer ${process.env.RANKBOX_API_KEY}` },
});
console.log(res.status, await res.json());
```

```python title="Python"
import os
import requests

res = requests.get(
    "https://rankbox.xyz/api/public/v1/ping",
    headers={"Authorization": f"Bearer {os.environ['RANKBOX_API_KEY']}"},
    timeout=20,
)
print(res.status_code, res.json())
```

How the API reads the header:

- The scheme is case-insensitive: `Bearer`, `bearer` and `BEARER` all work.
- Spaces around the key are trimmed.
- If `Authorization` isn't a `Bearer` header, the API reads an `X-Api-Key` header instead. `X-Api-Key: rv_live_xxxxxxxxxxxx` is accepted on every endpoint.
- If both are present, a `Bearer` header wins, even when the `X-Api-Key` value is the valid one.
- Keys in the query string or the request body are not read.

`Authorization: Bearer` is the form the dashboard shows and the error message asks for. Use it unless your platform can't set an `Authorization` header.

## What a key can and cannot do

| A key can | A key cannot |
| --- | --- |
| Confirm it works and read its site's brand name, website and logo (`GET /ping`) | Read ideas, scheduled articles or articles still being written |
| List and read every finished article of its site, full body included | Read anything from another site, even on the same account |
| Set the live URL of its site's finished articles, on the site's own domain | Create, edit, publish or delete articles |
| | Clear a live URL, or set one on another domain |
| | Change settings, autopilot, billing or credits |
| | Create, list or revoke keys |

## 401 and 402 responses

A rejected key gets one of two statuses. They mean different things and call for different fixes.

| Status | Meaning | Typical causes | What to do |
| --- | --- | --- | --- |
| `401` | Rankbox doesn't accept this key | No key sent, a value that doesn't start with `rv_live_`, a mistyped or truncated key, a revoked key | Ask the user for a new key from **Dashboard → Integrations** |
| `402` | The key is real, but its site can't sync right now | No trial or plan on the account, a trial whose card check failed, a payment that failed more than 48 hours ago, a cancelled plan past its paid period, a Studio site that was removed or archived | Send the user to **Dashboard → Plan & Billing**. Keep the key: it works again as soon as the site is active |

The `402` body carries `"code": "subscription_required"`. Branch on the status and the code, never on the message text. Exact bodies are in [Errors](/docs/api/errors).

Never treat a `401` or `402` as "the site has no articles". If your integration deletes CMS items that disappeared from the API, stop the run on any error instead.

## Last used and connection status

Each time Rankbox accepts a key, it records the time as the key's last use. Every endpoint counts: `GET /ping`, `GET /articles`, `GET /articles/{id}` and `PATCH /articles/{id}`. A request rejected with `401` or `402` records nothing, so the dashboard never shows a lapsed site as syncing.

The **Integrations** page turns that timestamp into a status for each key in **Your connections**:

| Status | Meaning |
| --- | --- |
| **Waiting** | Created, never used. The page checks every 5 seconds for the first request |
| **Live** | Used within the last 48 hours |
| **Idle** | Last used more than 48 hours ago |
| **Revoked** | Revoked. Hidden until you click the "Show … revoked keys" link under the list |

Each row also shows the key's name, its prefix, the creation date, "Synced" with how long ago (or "No requests yet"), and either "Up to date" or how many articles are on the way. "On the way" counts finished articles changed after the key's last request. It is an estimate from timestamps: Rankbox can't see what your integration did with the response.

## Replace a key

Replace a key when it may have leaked, when someone who had it leaves, or on a regular rotation schedule. Replacing creates a new key first, so your site keeps syncing while you swap it in.

1. Open **Dashboard → Integrations** and find the key in **Your connections**.
2. Click **Replace key**.
3. Copy the new key from the dialog, "Your new key for “name”". It is shown once.
4. Put the new key in your site's secrets in place of the old one, and deploy.
5. Confirm the site uses it: make a request, or wait for the next scheduled sync, and check that the new key's row shows a recent "Synced" time.
6. Click **Revoke old key** in the dialog, or **Revoke** on the old key's row if you already closed it.

The new key gets the old key's name, so tell the two rows apart by their prefixes and creation dates. Nothing else changes: your sync cursor, ledger and live URLs stay valid, because a key identifies a site, not a sync session.

## Revoke a key

1. Open **Dashboard → Integrations** and find the key in **Your connections**.
2. Click **Revoke**.
3. Click **Revoke key** in the "Revoke “name”?" dialog.

Revoking takes effect immediately and can't be undone. Every later request with the key gets a `401`. If the key had been used, the dialog says when its site last synced, as a reminder that the site stops receiving articles. Revoked keys stay on record behind the "Show … revoked keys" link under the list.

## Store keys safely

Treat a key like a password. With it, anyone can read the full text of every finished article on the site, and overwrite their live URLs with other pages on your domain, which changes where the backlink exchange looks for hosted links.

- **Keep the key on a server.** Use an environment variable or your host's secrets manager, and call the API from server code, a scheduled job or a build step.
- **Keep it out of browser bundles.** Static-site and front-end frameworks copy some variables into the code they ship. In Next.js, a `NEXT_PUBLIC_` prefix does that; in Vite, a `VITE_` prefix does. Give the Rankbox key a name without those prefixes and read it only at build time or on the server.
- **Keep it out of source control.** Don't commit it, paste it into tickets, or store it in a CMS field that editors can read.
- **One key per integration.** Separate keys let you revoke one without breaking the others.
- **Replace on suspicion.** If a key may have leaked, [replace it](#replace-a-key) and revoke the old one.

The API allows requests from any browser origin, so a key placed in a public web page works for anyone who views the page source.

### The Framer plugin exception

The Rankbox plugin for Framer has no server of its own: it runs inside the Framer editor, in your browser, and calls the API from there. So it keeps the key in that browser's local storage, scoped to the plugin. It deliberately does not save the key into the Framer project, because plugin data travels with a project and every collaborator can read it. The trade-off is that each teammate pastes their own key in their own browser. The plugin runs only in the editor, never on your published site, so visitors never receive the key. See [Framer](/docs/publishing/framer).

Follow the same rule if you build a browser-based tool: keep the key in the person's own browser storage, never in shared project data, and never in the pages your site serves.

## Troubleshooting

| Symptom | Cause and fix |
| --- | --- |
| `401` with a key you just copied | The key was cut short or wrapped across lines. Copy it again with **Copy key**, or replace the key if the full value is lost |
| `401` from code that worked before | The key was revoked, or replaced and then revoked. Create or replace a key and deploy it |
| `401` while also sending `X-Api-Key` | A `Bearer` header with a wrong value takes precedence over `X-Api-Key`. Send one header, not both |
| `402` on every request | The site has no active trial or plan, or it was removed from Studio. Check **Dashboard → Plan & Billing**. The hero on **Integrations** reads "Syncing is paused" |
| Key stays **Waiting** | No request with that key has been accepted. Check that the deployed code uses the new key and actually ran |
| A Studio site's key gets `402` while the main site works | The Studio site was removed or archived, or the account isn't on a paid plan: extra Studio sites need one, while a trial covers only the plan's own site. See [Studio](/docs/account/studio) |

## Related

- [API overview](/docs/api/overview): base URL, conventions and the endpoint list.
- [Errors](/docs/api/errors): the exact `401` and `402` bodies and how to handle them.
- [Ping endpoint](/docs/api/ping): check a key when someone connects your integration.
- [Security and privacy](/docs/account/security): how Rankbox protects your account.
- [Build a CMS integration](/docs/api/build-an-integration): where key storage fits in a full integration.
