---
title: Syncing articles reliably
nav_title: Syncing
description: Patterns for keeping a site in step with Rankbox: cursor paging with next_since, catch-up, full walks for deletions, content hashes, stable slugs and retries.
order: 5
updated: 2026-10-02
---

A sync keeps your site's copy of each article in step with Rankbox: new articles arrive, edited ones update, deleted ones go, and nothing is written twice. This page explains how the `since` cursor really behaves, the patterns that make a sync correct, and ends with a complete, tested sync loop in TypeScript.

Read [Articles endpoints](/docs/api/articles) first if you haven't: it defines every field and parameter used here.

## How the cursor works

`GET /articles` returns finished articles ordered by `updated_at`, oldest first. The cursor rules:

| Rule | Detail |
| --- | --- |
| Filter | `since` returns articles whose `updated_at` is later than the time you send |
| Cursor | `next_since` is the `updated_at` of the last article in the page |
| Empty page | `next_since` echoes the `since` you sent, or is `null` if you sent none |
| Precision | `updated_at` has microseconds; `since` is read to the millisecond and the extra digits are dropped |
| End of list | A page with fewer articles than `limit` is the last one |

The precision rule has a visible effect. Say a page ends with an article updated at `14:03:11.204518`. You send that value back as `since`, Rankbox reads it as `14:03:11.204`, and the article itself is later than that, so it comes back as the first article of the next page. The cursor overlaps by the articles in that final millisecond. Nothing is skipped, but something is repeated.

Three rules follow:

1. **Upsert by `id`.** Writing the same article twice must be harmless. Key every CMS item by the article's `id`.
2. **Stop on a short page, not an empty one.** A steady-state poll usually returns the boundary article again with `count: 1`. Loop until `count < limit`. A loop that waits for `count === 0` may never end.
3. **Pass `next_since` back exactly as received**, URL-encoded. Don't reformat it, round it or replace it with your own clock.

All of this assumes you send `limit=100`. Without `limit`, a page holds one article, and that one article is usually the repeated boundary article, so the cursor never moves forward.

### Your clock never enters into it

Every timestamp in a sync comes from Rankbox. Never compute `since` from your own clock, such as "now minus one hour": a clock that runs ahead, or a slow run, skips articles. Store the `next_since` from your last successful page and send it next time. If you lose it, send no `since` at all and do a full walk.

Save the cursor only after you have written that page's articles to your CMS. If a run fails halfway, the next run repeats from the last saved cursor, and the upserts make the repeat harmless.

### What moves updated_at

An article's `updated_at` moves when Rankbox writes to it: when someone clicks **Publish changes** on it in the editor, when a live URL is reported with `PATCH /articles/{id}`, and when Rankbox records a live URL some other way. So an article reappears in your incremental sync after each of those, even when its content didn't change. [Detect changes with a content hash](#detect-changes-with-a-content-hash) handles that.

### Ties and stalls

The cursor can't separate articles that share one millisecond. If more than `limit` articles have `updated_at` values within the same millisecond, every page starting there returns the same articles, and `next_since` stops moving. In practice that needs over 100 articles changed at once.

Detect it: a full page whose `next_since` equals the `since` you sent means the cursor is stuck. Stop the walk, mark it incomplete, skip deletions for that run, and contact [support](/docs/help/support). Don't retry in a loop. The reference loop below does exactly this.

## Incremental sync

An incremental sync fetches only what changed since the last run.

1. Load your saved cursor.
2. Call `GET /articles?limit=100&since=<cursor>`. On the first run, leave `since` out.
3. Upsert each article whose content changed into your CMS.
4. If the page held 100 articles, call again with `since` set to the page's `next_since`.
5. When a page holds fewer than 100 articles, save that page's `next_since` as your cursor and stop.

How often to run it is up to you. Each run that finds nothing new costs one request. Rankbox marks a key **Idle** after 48 hours without a request, so run at least daily if you want the dashboard to keep showing the site as connected. For a build-time integration, run it in each build.

A typical site needs one request per run. A first sync of 1,000 articles takes 11 requests, because each page after the first repeats one boundary article.

## Catch up on unreported articles

`published=false` limits the list to finished articles with no live URL on file. Use it to find articles you have published but not yet reported, for example because the page wasn't live at sync time, or a report failed.

```bash title="cURL"
curl -G https://rankbox.xyz/api/public/v1/articles \
  -H "Authorization: Bearer $RANKBOX_API_KEY" \
  --data-urlencode "published=false" \
  --data-urlencode "limit=100"
```

Walk it with the same paging rules, then report the URL of each article that is live on your site. An article leaves this list as soon as a URL is reported for it, so the list shrinks as you work through it. Run the catch-up after every sync, or on its own schedule.

An incremental sync alone misses these articles: once your sync has written an article, it doesn't see it again until it changes in Rankbox, even if the page only went live later.

## Full walk to detect deletions

A cursor can't see deletions. When an article is deleted in Rankbox, it simply stops appearing. No tombstone or "deleted" event exists, and the list never says "this id is gone". The only way to find deleted articles is to walk the whole list and compare.

A full walk is the incremental algorithm with no starting `since`. When it completes, any id your integration wrote that isn't in the result was deleted in Rankbox.

Rules for deleting safely:

- **Only after a complete walk.** If the walk stopped early, from an error, a stall or a page cap, you can't tell "deleted" from "not fetched yet". Skip deletions for that run.
- **Only items your integration created.** Keep a ledger of the ids you wrote and only ever remove those. Items people added to the CMS by hand must never be touched.
- **Never after an error response.** A `401` or `402` doesn't mean the site has no articles. Stop the run on any error instead of treating the result as an empty list.
- **Consider unpublishing instead.** If a deleted article had a live page with inbound links, unpublishing it or redirecting the URL may serve your site better than deleting the item.

The cost is one request per 100 articles. The Rankbox plugin for Framer does a full walk on every sync while a collection holds 1,000 articles or fewer, and switches to the cursor above that. A daily full walk plus frequent incremental runs is a good balance for larger sites.

## Detect changes with a content hash

Don't use `updated_at` to decide whether to rewrite a CMS item. Reporting a live URL moves `updated_at`, and `published_at` mirrors it, so after a `PATCH` both look like an edit even though nothing you publish changed. Rewriting on every timestamp change also overwrites edits people made in the CMS for no reason.

Instead, hash the fields you publish and store the hash per article:

1. Compute a hash of the fields you write: typically `title`, `description`, the body you use (`body_html` or `body_markdown`), `tags`, and `seo_score` if you display it.
2. Leave out `updated_at`, `published_at` and `published_url`.
3. Compare it with the hash stored in your ledger for that `id`. If they match, skip the article.
4. After a successful write, store the new hash.

This gives two guarantees. A live-URL report causes no CMS writes. And an edit someone makes in the CMS stays until Rankbox's own copy of the article changes, because unchanged content is never written again. If you want edits in the CMS to win even then, also hash what you wrote and compare it with the CMS item before overwriting: if they differ, someone edited the item, and you can skip it or ask.

## Keep slugs stable

The `slug` field is derived from the current title plus the first 8 characters of the `id`. Retitle an article in Rankbox and its slug changes. If your site uses the slug in the URL, a changed slug breaks the live page and the live URL already reported to Rankbox.

- **Store the slug at first publish** and keep using it, as the reference loop does. Key everything else by `id`.
- **If you choose to follow slug changes**, add a redirect from the old path to the new one and report the new URL with `PATCH /articles/{id}`.

The Rankbox plugin for Framer keeps the first slug by default and offers a setting to follow Rankbox's slug changes, adding redirects when it does.

## Retries and backoff

Decide by status whether a failed request is worth repeating.

| Response | Retry? | How |
| --- | --- | --- |
| Network error or timeout | Yes | Short exponential backoff, for example 0.5 s, 1 s, 2 s |
| `500` | Yes | Same short backoff. A `500` from `GET /articles/{id}` can also mean the id isn't a UUID; don't retry that forever |
| `429` | Yes | Wait for the next clock minute. The response has no `Retry-After` header, and the window is 60 seconds, so a retry after a second or two fails again |
| `400` | No | Fix the request. On `PATCH`, the URL isn't acceptable |
| `401` | No | The key is invalid or revoked. Stop and ask for a new key |
| `402` | No | The site isn't on an active plan. Stop and show the message |
| `404` | No | The article is gone or isn't finished. Skip it |

All requests are safe to repeat: `GET` changes nothing, and repeating a `PATCH` with the same URL leaves the same result. Details on the limits are in [Rate limits](/docs/api/rate-limits).

## A reference sync loop in TypeScript

This loop implements every pattern on this page: cursor paging with overlap handling, stall detection, content hashes, stable slugs, daily full walks with safe deletions, live-URL catch-up, and retries. It runs on Node 18 or later, or any runtime with `fetch`. Replace the `Cms` implementation with calls to your CMS.

```ts title="rankbox-sync.ts"
// A reference sync loop for the Rankbox REST API.
import { createHash } from "node:crypto";

const API = "https://rankbox.xyz/api/public/v1";
const PAGE_SIZE = 100;
const MAX_PAGES = 500; // a guard against runaway loops, not a limit you should reach
const FULL_WALK_EVERY_MS = 24 * 60 * 60 * 1000; // re-check deletions daily
const REPORT_SPACING_MS = 600; // about 100 reports a minute, under the 120 limit

export interface Article {
  id: string;
  slug: string;
  title: string;
  description: string;
  body_markdown: string;
  body_html: string;
  tags: string[];
  seo_score: number;
  published_url: string | null;
  published_at: string;
  updated_at: string;
}

interface Page {
  articles: Article[];
  count: number;
  next_since: string | null;
}

/** What this integration has written. Saved between runs. */
export interface Ledger {
  cursor: string | null;
  lastFullAt: string | null;
  items: Record<string, { hash: string; slug: string }>;
}

export const emptyLedger = (): Ledger => ({ cursor: null, lastFullAt: null, items: {} });

/** Your CMS. Every method must be safe to repeat. */
export interface Cms {
  upsert(id: string, slug: string, article: Article): Promise<void>;
  remove(id: string): Promise<void>;
  /** The public URL of a published item, or null while it isn't live. */
  liveUrl(slug: string): string | null;
}

export class RankboxError extends Error {
  status: number;
  code?: string;
  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Rate-limit windows reset at the start of each clock minute. */
const untilNextMinute = () => 60_000 - (Date.now() % 60_000) + 1_000;

async function call<T>(
  apiKey: string,
  path: string,
  init: { method?: "GET" | "PATCH"; body?: unknown } = {},
): Promise<T> {
  for (let attempt = 0; ; attempt += 1) {
    let res: Response;
    try {
      res = await fetch(`${API}${path}`, {
        method: init.method ?? "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          ...(init.body === undefined ? {} : { "Content-Type": "application/json" }),
        },
        body: init.body === undefined ? undefined : JSON.stringify(init.body),
        signal: AbortSignal.timeout(20_000),
      });
    } catch (err) {
      // Network error or timeout: retry quickly, three times.
      if (attempt < 3) {
        await sleep(500 * 2 ** attempt);
        continue;
      }
      throw err;
    }

    if (res.status === 429 && attempt < 3) {
      await sleep(untilNextMinute()); // no Retry-After header: wait for the next window
      continue;
    }
    if (res.status >= 500 && attempt < 3) {
      await sleep(500 * 2 ** attempt);
      continue;
    }

    const body = await res.json().catch(() => null);
    if (!res.ok) {
      throw new RankboxError(res.status, body?.error ?? `HTTP ${res.status}`, body?.code);
    }
    return body as T;
  }
}

/** Page through GET /articles from `since` to the end of the list. */
async function walk(apiKey: string, since: string | null, filters: Record<string, string> = {}) {
  const byId = new Map<string, Article>();
  let cursor = since;

  for (let n = 0; n < MAX_PAGES; n += 1) {
    const params = new URLSearchParams({ ...filters, limit: String(PAGE_SIZE) });
    if (cursor) params.set("since", cursor);
    const page = await call<Page>(apiKey, `/articles?${params}`);

    // The article at the cursor usually comes back again: keep the latest copy.
    for (const article of page.articles) byId.set(article.id, article);

    if (page.count < PAGE_SIZE) {
      return { articles: [...byId.values()], complete: true, cursor: page.next_since ?? cursor };
    }
    if (!page.next_since || page.next_since === cursor) {
      // A full page that didn't move the cursor: more than 100 articles share
      // one millisecond. Stop rather than loop.
      return { articles: [...byId.values()], complete: false, cursor };
    }
    cursor = page.next_since;
  }
  return { articles: [...byId.values()], complete: false, cursor };
}

/** A fingerprint of what you publish: never updated_at, published_at or published_url. */
function contentHash(a: Article): string {
  return createHash("sha256")
    .update(JSON.stringify([a.title, a.description, a.body_html, a.tags, a.seo_score]))
    .digest("hex");
}

/** One sync run. Returns the ledger to save once the run has succeeded. */
export async function sync(apiKey: string, cms: Cms, ledger: Ledger): Promise<Ledger> {
  const full =
    !ledger.cursor ||
    !ledger.lastFullAt ||
    Date.now() - Date.parse(ledger.lastFullAt) > FULL_WALK_EVERY_MS;

  const result = await walk(apiKey, full ? null : ledger.cursor);
  const items = { ...ledger.items };

  // 1. Write what changed in Rankbox. Unchanged content is never rewritten,
  //    so an edit made in the CMS stays until Rankbox's own copy changes.
  for (const article of result.articles) {
    const hash = contentHash(article);
    const known = items[article.id];
    if (known?.hash === hash) continue;
    const slug = known?.slug ?? article.slug; // keep the slug the page went live under
    await cms.upsert(article.id, slug, article);
    items[article.id] = { hash, slug };
  }

  // 2. Remove what was deleted in Rankbox: only after a complete full walk,
  //    and only items this integration created.
  if (full && result.complete) {
    const present = new Set(result.articles.map((a) => a.id));
    for (const id of Object.keys(items)) {
      if (present.has(id)) continue;
      await cms.remove(id);
      delete items[id];
    }
  }

  return {
    items,
    cursor: result.cursor ?? ledger.cursor,
    lastFullAt: full && result.complete ? new Date().toISOString() : ledger.lastFullAt,
  };
}

/** Report the live URL of every synced article Rankbox has no URL for yet. */
export async function reportLiveUrls(apiKey: string, cms: Cms, ledger: Ledger): Promise<number> {
  const { articles } = await walk(apiKey, null, { published: "false" });
  let reported = 0;

  for (const article of articles) {
    const entry = ledger.items[article.id];
    const url = entry ? cms.liveUrl(entry.slug) : null;
    if (!url) continue; // not synced by us, or not live yet

    try {
      await call(apiKey, `/articles/${encodeURIComponent(article.id)}`, {
        method: "PATCH",
        body: { published_url: url },
      });
      reported += 1;
    } catch (err) {
      if (err instanceof RankboxError && err.status === 404) continue; // deleted since the walk
      throw err; // a 400 means the URL isn't on the site's domain: the rest would fail too
    }
    await sleep(REPORT_SPACING_MS);
  }
  return reported;
}
```

Run it from a scheduler, saving the ledger only after the sync succeeds:

```ts title="run.ts"
import { emptyLedger, reportLiveUrls, sync, type Cms, type Ledger } from "./rankbox-sync";

declare const cms: Cms; // your CMS adapter
declare function loadLedger(): Promise<Ledger | null>; // e.g. a JSON file or a database row
declare function saveLedger(ledger: Ledger): Promise<void>;

const apiKey = process.env.RANKBOX_API_KEY;
if (!apiKey) throw new Error("Set RANKBOX_API_KEY");

const ledger = await sync(apiKey, cms, (await loadLedger()) ?? emptyLedger());
await saveLedger(ledger);
await reportLiveUrls(apiKey, cms, ledger);
```

Notes on the design:

- **The ledger is the source of truth for ownership.** Deletions only ever touch ids in it, so items created by hand in the CMS are safe. Store it next to the content it describes, so everyone who runs the sync shares it. The Rankbox plugin for Framer keeps its ledger in the collection's own plugin data for that reason.
- **The live-URL report runs after the sync.** Each report moves the article's `updated_at`, so the next incremental run fetches it again. The hash matches, so it writes nothing.
- **A `400` on a report stops the run.** A domain mismatch affects every article, so the loop fails on the first one instead of sending hundreds of doomed requests.

## Related

- [Articles endpoints](/docs/api/articles): every field and parameter used on this page.
- [Build a CMS integration](/docs/api/build-an-integration): the full integration guide around this loop.
- [Rate limits](/docs/api/rate-limits): request budgets and the 429 response.
- [Errors](/docs/api/errors): what each status means and how to handle it.
- [TypeScript client and plugin starter](/docs/api/client-library): the client Rankbox's own plugin uses.
