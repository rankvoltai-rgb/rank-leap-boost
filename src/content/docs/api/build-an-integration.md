---
title: Build a CMS integration
nav_title: Build an integration
description: A step-by-step guide to a production Rankbox integration for any CMS: connect with ping, sync, map fields, protect CMS edits, report live URLs, handle deletes.
order: 9
updated: 2026-10-02
---

This guide walks through building an integration that keeps a CMS in step with Rankbox, the way Rankbox's own plugin for Framer works: connect with a key, sync every finished article, map its fields, never trample edits made in the CMS, report each live URL, and clean up deleted articles. Each step names the API behavior it relies on and links to the reference.

## Before you start

You need:

- A Rankbox account with an active trial or plan, and an API key for the site you're integrating. See [Create a key](/docs/api/authentication#create-a-key).
- The site's **Website** set in **Dashboard → Settings → Your brand** to the domain where articles will go live. Live URL reports on any other domain are rejected.
- A CMS API that can create, update and delete items, and either store an external id on each item or let you keep a mapping from Rankbox ids to CMS ids.
- A place to keep a little state between runs: the API key (secret) and a sync ledger (not secret).

The code on this page uses the [TypeScript client](/docs/api/client-library) for brevity. Every call maps one-to-one to a plain HTTP request, so the same design works in any language.

## How an integration fits together

An integration is a small loop with five parts:

| Part | Job | API calls |
| --- | --- | --- |
| Connection | Accept a key, check it, show which site it belongs to | `GET /ping` |
| Sync | Fetch new and changed articles, and every so often all of them | `GET /articles` |
| Mapping | Turn an article into a CMS item | None |
| Ledger | Remember what you wrote: each article's id, content hash and slug | None |
| Reporting | Tell Rankbox where each article went live | `GET /articles?published=false`, `PATCH /articles/{id}` |

Rankbox never pushes to your integration. Your code decides when to run: on a schedule, when someone clicks a sync button, or in each site build.

## Step 1: Connect with a key

When someone sets up your integration, take their key, check it, and show them which Rankbox site it belongs to before you sync anything.

1. Trim the pasted value and check that it starts with `rv_live_`. A full key is 56 characters. This catches pasting the wrong thing without a request.
2. Call `GET /ping`. A `200` means the key is valid and the site is active.
3. Show the returned `brand_name`, and the key's first 14 characters followed by "…", so the person can confirm the site and later tell keys apart.
4. Store the key as a secret. Store the non-secret details (`brand_name`, `website_url`, key prefix) with the integration's settings.

```ts title="TypeScript"
import { RankboxApiError, RankboxClient } from "./rankbox-client";

export async function connect(pasted: string) {
  const apiKey = pasted.trim();
  if (!apiKey.startsWith("rv_live_")) {
    return { ok: false as const, message: "That isn't a Rankbox API key. Keys start with rv_live_." };
  }

  try {
    const site = await new RankboxClient({ apiKey }).ping();
    return {
      ok: true as const,
      secret: apiKey, // keep server-side, never in shared settings
      settings: {
        brandName: site.brand_name,
        websiteUrl: site.website_url ?? null,
        keyPrefix: `${apiKey.slice(0, 14)}…`,
      },
    };
  } catch (err) {
    if (err instanceof RankboxApiError && err.status === 401) {
      return { ok: false as const, message: "That key isn't valid. Create a new one in Rankbox → Integrations." };
    }
    if (err instanceof RankboxApiError && err.status === 402) {
      return { ok: false as const, message: err.message }; // the site isn't active on a plan
    }
    throw err;
  }
}
```

If the destination already holds articles from a Rankbox site, check that a newly pasted key belongs to the same site before syncing into it. Otherwise two sites' articles end up mixed in one place. Ping returns no site id, so compare `website_url` and `brand_name` with the stored values and ask the person to confirm when they differ. Don't compare key prefixes: [replacing a key](/docs/api/authentication#replace-a-key) gives the same site a new prefix.

## Step 2: Map fields to your CMS

Decide once where each article field goes. A typical mapping:

| Article field | CMS field | Notes |
| --- | --- | --- |
| `id` | External id, or the item id if your CMS lets you set it | The permanent key. Every write is an upsert by this id |
| `slug` | Slug or URL handle | Store the slug from the first sync and keep it. See [Step 6](#step-6-handle-deletions-and-slug-changes) |
| `title` | Title | Your template usually renders this as the page's `<h1>` |
| `description` | Meta description or SEO description | `""` when there is none |
| `body_html` or `body_markdown` | Body or rich text | Pick the format your CMS ingests best. Remove the leading level-1 heading if your template shows the title |
| `tags` | Tags or categories | An array. If your CMS has only a text field, join with `", "` |
| `seo_score` | Optional number field | Useful for editors; not usually shown to readers |
| `published_url` | Optional "Live URL" field | Read-only from your side; Rankbox sets it |

Fields to handle with care:

- **Don't use `published_at` as a publication date.** It currently mirrors `updated_at`, and both move whenever a live URL is reported. Record the date your CMS first published the item yourself.
- **There are no images.** The body has no images and the API has no featured image. If your template needs one, have editors add it in the CMS, and keep that field out of your writes so a sync never clears it.
- **Sanitize `body_html`.** It isn't sanitized and can contain raw HTML from the Markdown, such as a YouTube `<iframe>` in a `## Watch:` section. Apply your CMS's allow-list.
- **Keep links as they are.** Don't add `rel="nofollow"`, `"sponsored"` or `"ugc"` to body links. Some articles carry a link placed through the [backlink exchange](/docs/growth/backlink-exchange), which is checked on your live page.
- **Leave fields you don't own alone.** If editors add fields to the same CMS type, never write to them, and if they rename one of yours, keep their label.

Removing the title heading:

```ts title="TypeScript"
/** Drop the first <h1> when the page template already shows the title. */
export const stripLeadingH1Html = (html: string) =>
  html.replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/i, "");

/** The same for Markdown: drop a leading "# Title" line. */
export const stripLeadingH1Markdown = (md: string) => md.replace(/^\s*#\s+[^\n]*\n?/, "");
```

The Rankbox plugin for Framer, for reference, writes the Markdown body into Framer's formatted-text field and lets Framer convert it, so Framer only produces elements its rich text supports. It joins tags into one text field, because Framer has no list field for them.

## Step 3: Run the first full sync

The first sync fetches every finished article and writes each one.

1. Page through `GET /articles?limit=100` with no `since`, passing each page's `next_since` as the next `since`, until a page holds fewer than 100 articles.
2. Deduplicate by `id`: the article at each page boundary usually appears twice.
3. Upsert each article into your CMS, keyed by `id`.
4. For each article written, record a ledger entry: its content hash and the slug you used.
5. Save the last page's `next_since` as your cursor, and the ledger, once all writes have succeeded.

The paging rules and a tested implementation are in [Syncing articles reliably](/docs/api/syncing). The function `sync()` in its [reference sync loop](/docs/api/syncing#a-reference-sync-loop-in-typescript) does all five steps.

If the destination already has content, the first run only adds and updates. It deletes nothing, because the ledger starts empty and deletions only ever touch ids in the ledger. Write in chunks and show progress if your CMS is slow: the Framer plugin writes 100 items per call.

## Step 4: Keep it in sync

After the first run, each sync fetches only what changed.

- **Incremental runs** start from the saved cursor and cost one request when nothing changed.
- **Full walks** start from no cursor and are the only way to see deletions. For a site with up to about 1,000 articles, a full walk on every run costs 10 or 11 requests and keeps things simple; that is the Framer plugin's rule. For larger sites, run incremental syncs often and a full walk about once a day.
- **One run at a time.** Two overlapping runs race on the cursor and double your requests. Use a lock or a single scheduled job per site.
- **How often.** Every few minutes to once a day suits most sites. Rankbox shows a key as **Idle** after 48 hours without a request, so run at least daily if you want the dashboard to show the site as connected.

For a static site, run the sync in each build and commit the ledger, or keep it in your build cache or a database, so the next build starts from it.

## Step 5: Protect edits made in the CMS

Editors fix typos, add images and rewrite intros in the CMS. Your integration must not overwrite that work every time it runs. The tool for this is a ledger with a content hash.

1. For each article, hash exactly the fields you write: title, description, the body, tags, and the SEO score if you store it. Leave out `updated_at`, `published_at` and `published_url`.
2. Before writing, compare the hash with the ledger entry for that `id`.
3. If the hashes match, Rankbox's copy hasn't changed since you last wrote it: skip the item, whatever its timestamps say.
4. If they differ, Rankbox's content changed: write it and store the new hash.

This means an edit made in the CMS survives every sync until someone changes the same article in Rankbox. Reporting a live URL moves `updated_at` but leaves the hash alone, so it never causes a rewrite.

To protect CMS edits even when Rankbox's copy changes, store a second hash of what you wrote into the CMS. Before overwriting, hash the item's current CMS content: if it differs from what you wrote, an editor changed it. Skip the item, flag it for review, or ask, as suits your users.

Keep the ledger with the content it describes, not on one person's machine. The Framer plugin stores its ledger in the collection's own plugin data, so a teammate's first sync doesn't mistake every item for an unknown one. The ledger holds no secrets: only ids, hashes, slugs and the cursor. Give people a way to force a full rewrite, such as a **Resync everything** button, for when the destination has drifted.

## Step 6: Handle deletions and slug changes

**Deletions.** An article deleted in Rankbox stops appearing in the API, with no deletion event. Find deletions with a full walk:

1. Run a full walk and make sure it completed: no error, no stall, every page fetched.
2. Collect the ids in the ledger that aren't in the walk's results.
3. Remove those CMS items, or unpublish them if your site would rather keep the URL alive, and delete them from the ledger.

Never delete after an incomplete walk, never delete anything that isn't in your ledger, and never treat a `401` or `402` as an empty site. [Full walk to detect deletions](/docs/api/syncing#full-walk-to-detect-deletions) has the details.

**Slug changes.** The `slug` field follows the article's current title, so retitling an article in Rankbox changes it. Changing the URL of a live page breaks it and the live URL Rankbox has on file. By default, keep the slug an item was first published under; the ledger stores it. If you offer an option to follow Rankbox's slugs, add a redirect from the old path to the new one when a slug moves, and report the new URL. The Framer plugin does exactly this behind its **Follow slug changes from Rankbox** setting.

## Step 7: Report live URLs

Once an article's page is publicly live, tell Rankbox its URL with `PATCH /articles/{id}`. That URL is where the backlink exchange looks for links hosted in the article.

1. **Wait until the page is live.** Report after your site has published the page, not when you create a draft.
2. **Compose the URL** from your site's public origin, the path where articles live and the slug you stored, for example `https://www.example.com/blog/how-to-price-a-saas-product-8f14e45f`.
3. **Check the domain first.** Compare the URL's host with the `website_url` from `GET /ping`, ignoring a leading `www.` and allowing subdomains. If they don't match, tell the person before sending anything: a site still on a platform's staging address can't be reported.
4. **Skip what's already reported.** Only send a `PATCH` when the URL differs from the article's `published_url`. Each `PATCH` moves the article's `updated_at`.
5. **Send one, then the rest, paced.** If the first report returns `400`, stop: the same problem affects every article. Otherwise continue at about one report every 600 milliseconds, which stays under the API's limit of 120 requests a minute per account.
6. **Skip a `404`.** The article was deleted after your sync. Carry on with the others.
7. **Catch up regularly.** Walk `GET /articles?published=false&limit=100` after each sync to find articles that went live later or whose report failed.

```ts title="TypeScript"
import { RankboxApiError, type RankboxClient } from "./rankbox-client";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Report live URLs one at a time. A 400 on the first stops the run. */
export async function reportLiveUrls(
  client: RankboxClient,
  pending: Array<{ id: string; url: string }>,
): Promise<number> {
  let reported = 0;
  for (const [i, item] of pending.entries()) {
    if (i > 0) await sleep(600);
    try {
      await client.reportPublished(item.id, item.url);
      reported += 1;
    } catch (err) {
      if (err instanceof RankboxApiError && err.status === 404) continue; // deleted since the sync
      throw err; // 400: the URL isn't on the site's domain, so the rest would fail too
    }
  }
  return reported;
}
```

For a hosted link to verify, the exchange reads your live page as a crawler would. Render the article body in the page's HTML rather than only with client-side JavaScript, keep it in the main content rather than a header, footer, navigation or sidebar, and don't mark the page `noindex` or point its canonical URL at another domain. [Live URLs and verification](/docs/publishing/live-urls) explains what Rankbox does with the URL.

## Step 8: Store the key and handle errors

**Store the key as a secret.** On a server, use an environment variable or a secrets manager. If your integration runs inside a browser-based editor with no server, as the Framer plugin does, keep the key in that person's own browser storage. Never put it in project data shared with collaborators, and never in pages your site serves. See [Store keys safely](/docs/api/authentication#store-keys-safely).

**Offer a disconnect.** Disconnecting should delete the stored key and leave the CMS content in place. The Framer plugin's **Log Out** removes the key and the structured data it added, and leaves every CMS item untouched.

**Turn every status into a clear message.** Show people what to do, not a raw error. These are the messages the Framer plugin uses:

| Status | Message to show | Action |
| --- | --- | --- |
| Network error | "Couldn't reach Rankbox" | Offer **Try again** |
| `401` | "That key isn't valid any more" | Link to **Dashboard → Integrations** for a new key |
| `402` | "This site isn't on an active plan", with the API's `error` text | Link to **Dashboard → Plan & Billing**. Keep the key |
| `429` | "Rankbox is rate-limiting this key" | Wait a minute, then sync again |
| `400` on a live URL report | A domain mismatch, naming the domains from the `error` text | Link to **Dashboard → Settings** to correct **Website**, or publish on the right domain |
| `5xx` | "Rankbox had a problem" | Retry with backoff, then offer **Try again** |

Branch on the status and the `code` field, never on the wording of `error`. Every status is described in [Errors](/docs/api/errors).

## Launch checklist

Run through this list before you ship:

- Every `GET /articles` call sends `limit=100`.
- Query strings are URL-encoded, so a `next_since` containing `+00:00` survives the trip.
- Paging stops on a page with fewer than `limit` articles, not on an empty page, and detects a cursor that stops moving.
- Writes are upserts keyed by article `id`, so a repeated article is harmless.
- The cursor and ledger are saved only after a run's writes succeed.
- Changes are detected by a content hash that excludes `updated_at`, `published_at` and `published_url`.
- Items edited in the CMS aren't overwritten unless Rankbox's own copy changed.
- Deletions happen only after a complete full walk, and only for ids in the ledger.
- No run deletes anything after a `401`, `402` or any other error.
- Slugs are stored at first publish, and slug changes come with redirects.
- The leading title heading is removed if the template shows the title, and `body_html` is sanitized.
- Body links are published without `nofollow`, `sponsored` or `ugc`.
- Live URLs are reported only once the page is public, only when they change, one probe first, at about one every 600 milliseconds.
- The domain where articles go live matches **Website** in **Dashboard → Settings → Your brand**.
- `429` waits for the next minute; `5xx` and network errors retry with backoff; `400`, `401`, `402` and `404` don't retry.
- The key is stored as a secret and never shipped to visitors' browsers.
- Disconnecting removes the key and keeps the content.
- Only one sync runs at a time per site, at least once a day.

## Related

- [Syncing articles reliably](/docs/api/syncing): cursor paging, deletions and the reference sync loop.
- [Articles endpoints](/docs/api/articles): every field, parameter and validation rule.
- [TypeScript client and plugin starter](/docs/api/client-library): the client used on this page.
- [Ping endpoint](/docs/api/ping): the connect check and the domain pre-check.
- [Framer](/docs/publishing/framer): the Rankbox plugin this guide is modelled on.
- [Any website, with the REST API](/docs/publishing/custom-sites): a lighter setup for a single site.
