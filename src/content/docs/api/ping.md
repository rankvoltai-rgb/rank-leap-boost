---
title: Ping endpoint
nav_title: Ping
description: GET /ping checks a Rankbox API key and returns the brand, website and logo of the site it belongs to. Call it when someone connects your integration.
order: 4
updated: 2026-10-02
---

`GET /ping` is the lightest call in the Rankbox API. It confirms that a key works and tells you which site the key belongs to, so your integration can show the person "Connected to Example Co" before it syncs anything.

## When to call ping

Call `GET /ping` at these moments:

- **When someone pastes a key into your integration.** A `200` proves the key is valid and its site is active. Show the returned `brand_name` so the person can confirm it's the right site: a key belongs to one site, and an account with several sites has one key per site.
- **When your integration starts up with a saved key**, to confirm it still works before you show a "connected" state.
- **Before reporting live URLs**, to read the site's `website_url` and catch a domain mismatch before `PATCH /articles/{id}` rejects it.

You don't need to ping before every sync. `GET /articles` authenticates the same way and returns the same `401` or `402` if the key stops working, so a scheduled job can go straight to the articles call.

## Request

`GET https://rankbox.xyz/api/public/v1/ping`

The endpoint takes no parameters and no body. Send the key in the `Authorization` header.

```bash title="cURL"
curl https://rankbox.xyz/api/public/v1/ping \
  -H "Authorization: Bearer $RANKBOX_API_KEY"
```

```js title="JavaScript"
const res = await fetch("https://rankbox.xyz/api/public/v1/ping", {
  headers: { Authorization: `Bearer ${apiKey}` },
});
const body = await res.json();

if (res.status === 401) showError("That key isn't valid. Create a new one in Rankbox → Integrations.");
else if (res.status === 402) showError(body.error); // the site isn't active on a plan
else if (res.ok) showConnected(body.brand_name ?? "your Rankbox site");
```

```python title="Python"
import os
import requests

res = requests.get(
    "https://rankbox.xyz/api/public/v1/ping",
    headers={"Authorization": f"Bearer {os.environ['RANKBOX_API_KEY']}"},
    timeout=20,
)
if res.status_code == 200:
    site = res.json()
    print("Connected to", site["brand_name"] or "your Rankbox site")
else:
    print(res.status_code, res.json().get("error"))
```

## Response

A working key returns `200` with this object:

```json
{
  "ok": true,
  "service": "Rankbox",
  "brand_name": "Example Co",
  "website_url": "https://www.example.com",
  "logo_url": "https://www.example.com/logo.png"
}
```

| Field | Type | Description |
| --- | --- | --- |
| `ok` | boolean | Always `true` in a `200` response |
| `service` | string | Always `"Rankbox"` |
| `brand_name` | string or null | The site's **Brand name** from **Dashboard → Settings → Your brand**. `null` or `""` when none is set |
| `website_url` | string or null | The site's **Website** from the same section, as saved, for example `https://www.example.com`. `null` or `""` when none is set |
| `logo_url` | string or null | The logo Rankbox picked up for the site when it was set up. `null` when there is none |

All five fields are always present. `website_url` and `logo_url` were added in September 2026; a client written before then can ignore them.

The response contains no site id and nothing about the account, plan or other sites. A key reveals only its own site.

## What the dashboard shows after the first request

Every request that Rankbox accepts with a key, ping included, records the time as that key's last use. The **Integrations** page reads it:

- In the setup steps, step 4, **See it connect**, shows "Listening for your site's first request…" while the key waits, then "Connected — your site called in just now." The page checks every 5 seconds until the first request lands.
- At the top of the page, the status moves from "Waiting for your site's first sync" to "Your site is connected", with **Last sync**, **Delivered** and **On the way** figures beneath it.
- In **Your connections**, the key's status changes from **Waiting** to **Live**, and its row shows "Synced just now".

A request rejected with `401` or `402` doesn't count, so none of these change for a key that doesn't work.

> [!NOTE]
> **Delivered** and **On the way** are estimates from timestamps: Rankbox counts finished articles changed before and after the last request. A ping alone makes every existing article count as delivered, even if your integration hasn't fetched them yet. If you ping during setup, run the first sync straight after.

## Check the site before you sync

The ping response gives you two checks worth running when someone connects:

**Is this the site you expect?** If your integration stores articles in one place per site, such as a CMS collection, remember which site it was set up with, and check again when someone pastes a different key. A key for another site would otherwise mix two sites' articles into one collection. The ping response has no site id, so compare `website_url` and `brand_name`, and ask the person to confirm when they differ. Don't compare key prefixes: replacing a key gives the same site a new prefix.

**Will live URL reports be accepted?** `PATCH /articles/{id}` only accepts URLs on the site's own domain. Compare the host your site publishes on with the host of `website_url`, ignoring a leading `www.` and allowing subdomains. A mismatch, such as a site still on a platform's staging address, means every report will fail with `400`. Tell the person to publish on their own domain, or to update **Website** in **Dashboard → Settings → Your brand**.

```ts title="TypeScript"
function sameSite(a: string, b: string): boolean {
  const host = (value: string) => {
    try {
      const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
      return url.hostname.replace(/^www\./i, "").toLowerCase();
    } catch {
      return "";
    }
  };
  const left = host(a);
  const right = host(b);
  if (!left || !right) return false;
  return left === right || left.endsWith(`.${right}`) || right.endsWith(`.${left}`);
}

// sameSite("https://blog.example.com", "https://www.example.com") === true
```

This check is a convenience. Rankbox also accepts URLs on the domain the site verified in the backlink exchange, which ping doesn't return, so treat a mismatch as a warning and let the `PATCH` response decide.

## Errors

`GET /ping` returns the same authentication and rate-limit errors as every endpoint. It never returns `400` or `404`.

| Status | Body | What to do |
| --- | --- | --- |
| `401` | `{ "error": "Invalid or missing API key. Pass it as 'Authorization: Bearer <key>'." }` | Ask for a new key from **Dashboard → Integrations** |
| `402` | `{ "error": "This site isn't active on a Rankbox plan, so it can't sync articles. …", "code": "subscription_required" }` | Show the message and link to **Dashboard → Plan & Billing**. Keep the key |
| `429` | `{ "error": "Rate limit exceeded. Slow down and retry shortly." }` | Wait for the next minute, then retry |
| `500` | `{ "error": "Internal error" }` | Retry with backoff |

The full `402` message and handling advice are in [Errors](/docs/api/errors#402-subscription-required).

## Related

- [Authentication and API keys](/docs/api/authentication): key format, rotation and storage.
- [Articles endpoints](/docs/api/articles): what to call once the key checks out.
- [Build a CMS integration](/docs/api/build-an-integration): where ping fits in a connect flow.
- [Live URLs and verification](/docs/publishing/live-urls): why the domain check matters.
- [Account and site settings](/docs/account/settings): where the brand name and website are set.
