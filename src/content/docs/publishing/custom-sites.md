---
title: Publish to any website with the REST API
nav_title: Any website (REST API)
description: Working recipes for pulling finished Rankbox articles into Next.js, Astro, static site generators or your own database, and reporting live URLs back.
order: 6
updated: 2026-10-02
---

Any website that can make an HTTPS request can publish Rankbox articles. Your code asks the Rankbox REST API for finished articles, stores or renders them, and tells Rankbox where each one went live. This page gives complete, working code for the common setups, plus the rules that keep a sync correct: the cursor, slugs, safe rendering, SEO metadata, caching and errors.

## How pulling articles works

The REST API is read-mostly and key-authenticated. It has four requests, all under `https://rankbox.xyz/api/public/v1`:

| Request | What it does |
| --- | --- |
| `GET /ping` | Checks a key and returns the site's brand name, website and logo |
| `GET /articles` | Lists finished articles, oldest change first, 1 to 100 per request, optionally only those changed after `since` |
| `GET /articles/{id}` | Returns one finished article |
| `PATCH /articles/{id}` | Records the article's live URL with `{ "published_url": "…" }` |

Rankbox never calls your site. Your code decides when to ask: at build time, on a schedule, or when a cached page expires. A typical integration runs every 15 to 60 minutes and only fetches what changed since its last run.

Full parameter and field reference: [Articles endpoints](/docs/api/articles).

## Before you start

1. In Rankbox, open **Dashboard → Integrations** and click the **REST API** tile (under **Developer**).
2. Name the key after your site, or keep "My website", and click **Create key**.
3. Click **Copy key**. It starts with `rv_live_` and is shown only once. Store it as an environment variable, for example `RANKBOX_API_KEY`, wherever your site keeps secrets.
4. Make your first request. The setup's **See it connect** step turns green when Rankbox sees it.

A key belongs to one Rankbox site and only returns that site's finished articles. It needs an active trial or plan on the site; otherwise every request returns `402`. See [Authentication and API keys](/docs/api/authentication).

## Keep the key on your server

The API allows requests from any origin, but a key in browser code is readable by anyone who opens your page. Call the API only from server code, build scripts or scheduled jobs, and keep the key in environment variables. If a key may have leaked, use **Replace key** in **Dashboard → Integrations**, deploy the new key, then revoke the old one.

## The requests in practice

List articles changed since your last sync. Always send `limit`, and always URL-encode `since`:

```bash title="cURL"
curl --get "https://rankbox.xyz/api/public/v1/articles" \
  -H "Authorization: Bearer $RANKBOX_API_KEY" \
  --data-urlencode "limit=100" \
  --data-urlencode "since=2026-10-01T09:30:00.123456+00:00"
```

```js title="JavaScript"
const query = new URLSearchParams({ limit: "100" });
if (lastSince) query.set("since", lastSince); // URLSearchParams encodes the "+"
const res = await fetch(`https://rankbox.xyz/api/public/v1/articles?${query}`, {
  headers: { Authorization: `Bearer ${process.env.RANKBOX_API_KEY}` },
});
if (!res.ok) throw new Error(`Rankbox ${res.status}`);
const { articles, count, next_since } = await res.json();
```

```python title="Python"
import os
import requests

params = {"limit": 100}
if last_since:
    params["since"] = last_since  # requests encodes the "+"
res = requests.get(
    "https://rankbox.xyz/api/public/v1/articles",
    headers={"Authorization": f"Bearer {os.environ['RANKBOX_API_KEY']}"},
    params=params,
    timeout=20,
)
res.raise_for_status()
data = res.json()
```

A response looks like this:

```json title="200 OK"
{
  "articles": [
    {
      "id": "a1b2c3d4-5e6f-4a1b-9c8d-7e6f5a4b3c2d",
      "slug": "how-to-price-a-saas-product-a1b2c3d4",
      "title": "How to Price a SaaS Product",
      "description": "A practical guide to choosing a SaaS pricing model, setting tiers, and testing prices without losing the customers you already have.",
      "body_markdown": "# How to Price a SaaS Product\n\nMost SaaS teams…",
      "body_html": "<h1>How to Price a SaaS Product</h1>\n<p>Most SaaS teams…</p>",
      "tags": ["pricing", "saas"],
      "seo_score": 88,
      "published_url": null,
      "published_at": "2026-10-01T09:30:00.123456+00:00",
      "updated_at": "2026-10-01T09:30:00.123456+00:00"
    }
  ],
  "count": 1,
  "next_since": "2026-10-01T09:30:00.123456+00:00"
}
```

`published_at` currently carries the same value as `updated_at`: the time of the article's last change in Rankbox. If you need a stable "first published" date, record your own the first time you store an article.

## Next.js App Router

This recipe renders articles straight from the API with Incremental Static Regeneration: pages are built from Rankbox data and re-checked at most once an hour. It targets Next.js 15 or later and uses `sanitize-html` (`npm install sanitize-html`).

```ts title="lib/rankbox.ts"
import "server-only";

const API = "https://rankbox.xyz/api/public/v1";
const PAGE = 100;

export interface RankboxArticle {
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

interface ArticlesPage {
  articles: RankboxArticle[];
  count: number;
  next_since: string | null;
}

async function rankbox<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${process.env.RANKBOX_API_KEY}`);
  const res = await fetch(`${API}${path}`, { ...init, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(`Rankbox ${res.status}: ${body.error ?? res.statusText}`);
  }
  return res.json() as Promise<T>;
}

/** Every finished article. Next.js caches each page of results for an hour. */
export async function getAllArticles(): Promise<RankboxArticle[]> {
  const byId = new Map<string, RankboxArticle>();
  let since: string | null = null;
  for (let page = 0; page < 50; page++) {
    const query = new URLSearchParams({ limit: String(PAGE) });
    if (since) query.set("since", since);
    const data: ArticlesPage = await rankbox<ArticlesPage>(`/articles?${query}`, {
      next: { revalidate: 3600, tags: ["rankbox"] },
    });
    // The article at the cursor can come back at the top of the next page.
    for (const article of data.articles) byId.set(article.id, article);
    const more = data.count === PAGE && !!data.next_since && data.next_since !== since;
    since = data.next_since;
    if (!more) break;
  }
  return [...byId.values()];
}

/**
 * Find an article by slug. Slugs end with the first 8 characters of the
 * article id, so an article that was retitled (and got a new slug) can still
 * be found from its old URL and redirected.
 */
export async function findArticle(slug: string) {
  const articles = await getAllArticles();
  const exact = articles.find((a) => a.slug === slug);
  if (exact) return { article: exact, moved: false };
  const suffix = slug.slice(slug.lastIndexOf("-") + 1);
  const moved = /^[0-9a-f]{8}$/.test(suffix)
    ? articles.find((a) => a.id.startsWith(suffix))
    : undefined;
  return moved ? { article: moved, moved: true } : null;
}

/** Report the live URL of up to 100 articles Rankbox has no URL for yet. */
export async function reportLiveUrls(blogBase: string) {
  const { articles } = await rankbox<ArticlesPage>(`/articles?published=false&limit=${PAGE}`, {
    cache: "no-store",
  });
  let reported = 0;
  for (const article of articles) {
    try {
      await rankbox(`/articles/${encodeURIComponent(article.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published_url: `${blogBase}/${article.slug}` }),
        cache: "no-store",
      });
      reported++;
    } catch (err) {
      // A 400 means the URL isn't on your Rankbox site's domain; every article would fail alike.
      return { reported, error: String(err) };
    }
  }
  return { reported };
}
```

```ts title="lib/rankbox-html.ts"
import sanitizeHtml from "sanitize-html";

/** Article HTML, minus the opening <h1> your template already shows, sanitized. */
export function renderArticleHtml(html: string): string {
  const body = html.replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/i, "");
  return sanitizeHtml(body, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "iframe"],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      iframe: ["src", "width", "height", "title", "allow", "allowfullscreen", "frameborder", "referrerpolicy"],
    },
    allowedIframeHostnames: ["www.youtube.com"],
  });
}
```

```ts title="app/blog/[slug]/page.tsx"
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { findArticle, getAllArticles } from "@/lib/rankbox";
import { renderArticleHtml } from "@/lib/rankbox-html";

export const revalidate = 3600; // re-check Rankbox at most once an hour

const SITE_URL = process.env.SITE_URL ?? "https://example.com";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await findArticle((await params).slug);
  if (!found) return {};
  const { article } = found;
  const url = `${SITE_URL}/blog/${article.slug}`;
  return {
    title: article.title,
    description: article.description,
    keywords: article.tags,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: article.title,
      description: article.description,
      modifiedTime: article.updated_at,
      tags: article.tags,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const found = await findArticle((await params).slug);
  if (!found) notFound();
  if (found.moved) permanentRedirect(`/blog/${found.article.slug}`);
  const { article } = found;
  return (
    <article>
      <h1>{article.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: renderArticleHtml(article.body_html) }} />
    </article>
  );
}
```

```ts title="app/api/rankbox/report/route.ts"
import { reportLiveUrls } from "@/lib/rankbox";

// Call this from a scheduler (for example hourly) with: Authorization: Bearer $CRON_SECRET
export async function GET(request: Request) {
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  const base = `${process.env.SITE_URL ?? "https://example.com"}/blog`;
  return Response.json(await reportLiveUrls(base));
}
```

How it behaves:

- New articles appear within an hour: the list is re-fetched when its cache expires, and a slug not built yet renders on its first request.
- Edits appear within an hour, on the next regeneration of the page.
- A deleted article disappears from the list and its page returns 404 after the next regeneration.
- A retitled article gets a new API slug; the old URL redirects to the new one with a 308. If you'd rather keep URLs fixed forever, use the [database recipe](#scheduled-sync-into-your-database), which stores the first slug.
- Each regeneration of the list costs one request per 100 articles, well inside the [rate limits](/docs/api/rate-limits).

## Astro

A static Astro site reads Rankbox at build time. Set `site` in `astro.config.mjs` (it is used for canonical URLs) and `RANKBOX_API_KEY` in your build environment.

```ts title="src/lib/rankbox.ts"
const API = "https://rankbox.xyz/api/public/v1";
const PAGE = 100;

export interface RankboxArticle {
  id: string;
  slug: string;
  title: string;
  description: string;
  body_html: string;
  body_markdown: string;
  tags: string[];
  seo_score: number;
  published_url: string | null;
  published_at: string;
  updated_at: string;
}

export async function getAllArticles(): Promise<RankboxArticle[]> {
  const byId = new Map<string, RankboxArticle>();
  let since: string | null = null;
  for (let page = 0; page < 50; page++) {
    const query = new URLSearchParams({ limit: String(PAGE) });
    if (since) query.set("since", since);
    const res = await fetch(`${API}/articles?${query}`, {
      headers: { Authorization: `Bearer ${import.meta.env.RANKBOX_API_KEY}` },
    });
    if (!res.ok) throw new Error(`Rankbox ${res.status}`); // fail the build rather than publish a partial list
    const data: { articles: RankboxArticle[]; count: number; next_since: string | null } =
      await res.json();
    for (const article of data.articles) byId.set(article.id, article);
    const more = data.count === PAGE && !!data.next_since && data.next_since !== since;
    since = data.next_since;
    if (!more) break;
  }
  return [...byId.values()];
}
```

```html title="src/pages/blog/[slug].astro"
---
import { getAllArticles } from "../../lib/rankbox";
import { renderArticleHtml } from "../../lib/rankbox-html"; // the same helper as the Next.js recipe

export async function getStaticPaths() {
  const articles = await getAllArticles();
  return articles.map((article) => ({ params: { slug: article.slug }, props: { article } }));
}

const { article } = Astro.props;
const html = renderArticleHtml(article.body_html);
const canonical = new URL(`/blog/${article.slug}`, Astro.site);
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>{article.title}</title>
    <meta name="description" content={article.description} />
    <link rel="canonical" href={canonical} />
    <meta property="og:type" content="article" />
    <meta property="og:title" content={article.title} />
    <meta property="og:description" content={article.description} />
    <meta property="article:modified_time" content={article.updated_at} />
  </head>
  <body>
    <main>
      <article>
        <h1>{article.title}</h1>
        <Fragment set:html={html} />
      </article>
    </main>
  </body>
</html>
```

A static build only sees articles that were finished when it ran. Rebuild on a schedule with your host's build hook, then report live URLs (see [Report the live URL](#report-the-live-url)):

```bash title="crontab: rebuild every 6 hours"
0 */6 * * * curl -fsS -X POST "$BUILD_HOOK_URL"
```

## Static site generators

For Hugo, Eleventy, Jekyll or any generator that reads Markdown files, run a script before the build that writes one file per article. This script keeps each article's first slug and first-seen date in a manifest, and removes files for articles deleted in Rankbox. Run it with Node.js 18 or later.

```js title="scripts/pull-rankbox.mjs"
// Writes content/blog/rankbox/<slug>.md for every finished Rankbox article.
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const API = "https://rankbox.xyz/api/public/v1";
const PAGE = 100;
const OUT = process.env.RANKBOX_OUT ?? "content/blog/rankbox";
const MANIFEST = path.join(OUT, ".rankbox-manifest.json"); // commit this file

async function getAllArticles() {
  const byId = new Map();
  let since = null;
  for (let page = 0; page < 50; page++) {
    const query = new URLSearchParams({ limit: String(PAGE) });
    if (since) query.set("since", since);
    const res = await fetch(`${API}/articles?${query}`, {
      headers: { Authorization: `Bearer ${process.env.RANKBOX_API_KEY}` },
    });
    if (!res.ok) throw new Error(`Rankbox ${res.status}: ${(await res.json()).error}`);
    const data = await res.json();
    for (const article of data.articles) byId.set(article.id, article);
    const more = data.count === PAGE && data.next_since && data.next_since !== since;
    since = data.next_since;
    if (!more) break;
  }
  return [...byId.values()];
}

const articles = await getAllArticles(); // a full walk, so deletions are seen
await mkdir(OUT, { recursive: true });
let manifest = {};
try {
  manifest = JSON.parse(await readFile(MANIFEST, "utf8"));
} catch (err) {
  if (err.code !== "ENOENT") throw err;
}

const q = (value) => JSON.stringify(value); // a JSON string or array is valid YAML
const next = {};
for (const a of articles) {
  const kept = manifest[a.id] ?? { slug: a.slug, date: a.updated_at }; // first slug and date win
  next[a.id] = kept;
  const body = a.body_markdown.replace(/^\s*#\s+[^\n]*\n?/, ""); // the template shows the title
  const file = [
    "---",
    `title: ${q(a.title)}`,
    `description: ${q(a.description)}`,
    `slug: ${q(kept.slug)}`,
    `date: ${q(kept.date)}`,
    `lastmod: ${q(a.updated_at)}`,
    `tags: ${q(a.tags)}`,
    `rankbox_id: ${q(a.id)}`,
    "---",
    "",
    body,
    "",
  ].join("\n");
  await writeFile(path.join(OUT, `${kept.slug}.md`), file);
}

// Remove files for articles that no longer exist in Rankbox.
const wanted = new Set(Object.values(next).map((k) => `${k.slug}.md`));
for (const name of await readdir(OUT)) {
  if (name.endsWith(".md") && !wanted.has(name)) await rm(path.join(OUT, name));
}
await writeFile(MANIFEST, JSON.stringify(next, null, 2));
console.log(`Rankbox: wrote ${articles.length} articles to ${OUT}`);
```

```bash title="Build"
RANKBOX_API_KEY=rv_live_xxxxxxxxxxxx node scripts/pull-rankbox.mjs && hugo
```

Notes for each generator:

- The script writes into a folder of its own and deletes only `.md` files there, so keep hand-written posts elsewhere.
- Commit `.rankbox-manifest.json`, or keep it between builds. Without it, slugs follow Rankbox's current titles.
- Hugo reads `slug`, `date` and `lastmod` from front matter. Eleventy and Jekyll build URLs from `permalink` or the file name, so map `slug` there.
- The Markdown can contain one raw `<iframe>` line for a YouTube video, followed by a plain link to it. Hugo omits raw HTML unless you enable it (`markup.goldmark.renderer.unsafe`); either way the plain link stays.

## Scheduled sync into your database

When your site renders from its own database or CMS, run a sync job every 15 to 60 minutes: a cron job, a scheduled serverless function, or a queue worker. This recipe uses Postgres with the `pg` package, keeps the first slug forever, stores the cursor in the same database, and reports live URLs as it goes.

```ts title="sync-rankbox.ts"
import pg from "pg";

/*
create table rankbox_articles (
  id            text primary key,
  slug          text not null unique,      -- set on first insert, never changed
  title         text not null,
  description   text not null,
  body_html     text not null,
  body_markdown text not null,
  tags          text[] not null,
  seo_score     integer not null,
  first_seen_at timestamptz not null default now(),
  updated_at    timestamptz not null,
  reported_url  text
);
create table rankbox_sync (id integer primary key, next_since text);
*/

const API = "https://rankbox.xyz/api/public/v1";
const PAGE = 100;
const BLOG_BASE = `${process.env.SITE_URL}/blog`; // e.g. https://example.com/blog
const db = new pg.Pool({ connectionString: process.env.DATABASE_URL });

class RankboxError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function rankbox(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${process.env.RANKBOX_API_KEY}`);
  const res = await fetch(`${API}${path}`, { ...init, headers });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new RankboxError(res.status, body.error ?? res.statusText);
  return body;
}

export async function syncRankbox() {
  const { rows } = await db.query("select next_since from rankbox_sync where id = 1");
  let since: string | null = rows[0]?.next_since ?? null;
  let canReport = true;

  for (let page = 0; page < 50; page++) {
    const query = new URLSearchParams({ limit: String(PAGE) });
    if (since) query.set("since", since);
    const data = await rankbox(`/articles?${query}`);

    for (const a of data.articles) {
      // Upsert by id. On conflict the slug is left alone, so URLs never change.
      const { rows: [saved] } = await db.query(
        `insert into rankbox_articles
           (id, slug, title, description, body_html, body_markdown, tags, seo_score, updated_at)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         on conflict (id) do update set
           title = excluded.title, description = excluded.description,
           body_html = excluded.body_html, body_markdown = excluded.body_markdown,
           tags = excluded.tags, seo_score = excluded.seo_score, updated_at = excluded.updated_at
         returning slug, reported_url`,
        [a.id, a.slug, a.title, a.description, a.body_html, a.body_markdown, a.tags, a.seo_score, a.updated_at],
      );

      const url = `${BLOG_BASE}/${saved.slug}`;
      if (canReport && saved.reported_url !== url && a.published_url !== url) {
        try {
          await rankbox(`/articles/${encodeURIComponent(a.id)}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ published_url: url }),
          });
          await db.query("update rankbox_articles set reported_url = $2 where id = $1", [a.id, url]);
        } catch (err) {
          // 400: the URL isn't on your Rankbox site's domain, so stop reporting this run.
          if (err instanceof RankboxError && err.status === 400) canReport = false;
          else if (!(err instanceof RankboxError && err.status === 404)) throw err;
        }
      }
    }

    // Save the cursor only after every article on the page is stored.
    const more = data.count === PAGE && !!data.next_since && data.next_since !== since;
    if (data.next_since) {
      since = data.next_since;
      await db.query(
        `insert into rankbox_sync (id, next_since) values (1, $1)
         on conflict (id) do update set next_since = excluded.next_since`,
        [since],
      );
    }
    if (!more) break;
  }
}

/** Run daily: delete rows for articles deleted in Rankbox. Needs a full walk. */
export async function pruneDeleted() {
  const ids = new Set<string>();
  let since: string | null = null;
  for (let page = 0; page < 50; page++) {
    const query = new URLSearchParams({ limit: String(PAGE) });
    if (since) query.set("since", since);
    const data = await rankbox(`/articles?${query}`);
    for (const a of data.articles) ids.add(a.id);
    const more = data.count === PAGE && !!data.next_since && data.next_since !== since;
    since = data.next_since;
    if (!more) {
      await db.query("delete from rankbox_articles where not (id = any($1::text[]))", [[...ids]]);
      return;
    }
  }
  // The walk didn't reach the end of the list: delete nothing.
}
```

Call `syncRankbox()` from your scheduler, and `pruneDeleted()` once a day. Reporting a live URL updates the article in Rankbox, so it comes back on the next run; the upsert rewrites the same content and `reported_url` stops it being reported twice.

## Store the sync cursor correctly

`GET /articles` sorts by `updated_at`, oldest first, and `since` returns only articles changed after that moment. `next_since` is the `updated_at` of the last article on the page; pass it back as `since` next time. These rules keep a sync from losing or repeating work:

- **Always send `limit`, and use `100`.** Values are clamped to 1–100. Without `limit`, a page holds one article and the cursor can get stuck on it.
- **URL-encode `since`.** Timestamps contain a `+` (for example `+00:00`). Sent raw, the `+` becomes a space, the timestamp can't be read, and the API ignores `since` and starts from the beginning of the list.
- **Save the cursor after you store the page, not before.** If your job fails mid-page, the next run fetches that page again.
- **Upsert by `id`.** The article at the cursor can come back as the first item of the next page, and an article returns whenever it changes in Rankbox, including when its live URL is recorded. Writing the same article twice must be harmless.
- **Stop when `count` is below `limit`.** If a full page comes back and `next_since` equals the `since` you sent, more than 100 articles share one timestamp and the cursor can't move; contact [support](/docs/help/support).
- **An empty page keeps your cursor.** `next_since` echoes the `since` you sent, or is `null` if you sent none.
- **Deletions don't show up in a `since` sync.** An article deleted in Rankbox simply stops being returned. To remove it, walk the full list (no `since`) and delete what's missing, as `pruneDeleted()` does.

More on cursors and idempotency: [Syncing articles reliably](/docs/api/syncing).

## Keep slugs stable

The API's `slug` is built from the article's current title: the title in lowercase, other characters turned into hyphens, cut to 60 characters, then a hyphen and the first 8 characters of the article id, for example `how-to-price-a-saas-product-a1b2c3d4`. Retitle the article in Rankbox and the `slug` field changes.

A URL that changes after it is live breaks inbound links and the live URL Rankbox verifies backlinks on. Choose one of these:

- **Store the first slug** and never update it, as the database and static generator recipes do. This is what Rankbox's own Webflow, Shopify and Framer integrations do.
- **Resolve old slugs by their id suffix** and redirect, as the Next.js recipe does. The last 8 characters of every slug are the start of the article id, which never changes.

## Render the body safely

Every article comes in two forms:

| Field | What it is | Use it when |
| --- | --- | --- |
| `body_html` | HTML made from the Markdown with GitHub-flavored Markdown and single line breaks kept as `<br>` | Your template takes HTML: React, Astro, server templates, most CMSs |
| `body_markdown` | The same article as Markdown | Your stack has its own Markdown pipeline, or you store Markdown |

Both have Rankbox's writer notes removed: image concepts (`[Image: …]`) are gone and internal-link suggestions are plain text. Beyond that, plan for these:

- **Sanitize the HTML.** Raw HTML in the Markdown passes through to `body_html` unchanged. Run it through a sanitizer such as `sanitize-html` or DOMPurify before you insert it, as the recipes do.
- **The opening `<h1>`.** The body usually starts with an H1 (`# Title` in Markdown) that repeats the title. If your template prints the title as the page's H1, remove the first one, as the recipes do.
- **Video embeds.** Some articles contain a YouTube `<iframe>` from `www.youtube.com/embed/…`, followed by a plain link to the same video. Allow that iframe host in your sanitizer to keep the player, or strip it; the link stays either way.
- **No images.** Rankbox doesn't send images. Add your own in your CMS or template.
- **Keep links followed.** If your site hosts backlink exchange links, they are ordinary links in the body. Don't add `rel="nofollow"`, `"sponsored"` or `"ugc"` to body links, and render the body inside your main content rather than inside `nav`, `header`, `footer` or `aside` elements. See [Live URLs and verification](/docs/publishing/live-urls#make-your-pages-verifiable).

## Map SEO metadata

| Rankbox field | Where it goes on your page |
| --- | --- |
| `title` | `<title>`, the page's `<h1>`, `og:title`, `headline` in Article structured data |
| `description` | `<meta name="description">`, `og:description`, `description` in structured data |
| `tags` | Your tag or category pages, `article:tag`, `keywords` in structured data |
| `slug` (first one you stored) | The URL path, and the canonical URL |
| `updated_at` | `article:modified_time`, `dateModified` |
| Your own first-seen date | `article:published_time`, `datePublished` |
| `seo_score` | Not for the page. Use it internally, for example to sort or filter. |

Set the canonical URL to the page itself, on your own domain. A canonical that points to a different host name makes the backlink exchange treat the page as not indexable.

## Report the live URL

Once an article's page is live, tell Rankbox its address. The backlink exchange checks hosted links on exactly that page, and the address comes back in the article's `published_url` field.

```bash title="cURL"
curl -X PATCH "https://rankbox.xyz/api/public/v1/articles/$ARTICLE_ID" \
  -H "Authorization: Bearer $RANKBOX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"published_url":"https://example.com/blog/how-to-price-a-saas-product-a1b2c3d4"}'
```

```js title="JavaScript"
const res = await fetch(`https://rankbox.xyz/api/public/v1/articles/${encodeURIComponent(id)}`, {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${process.env.RANKBOX_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ published_url: `https://example.com/blog/${slug}` }),
});
if (!res.ok) throw new Error(`Rankbox ${res.status}: ${(await res.json()).error}`);
const { article } = await res.json(); // article.published_url is now set
```

```python title="Python"
import os
import requests

res = requests.patch(
    f"https://rankbox.xyz/api/public/v1/articles/{article_id}",
    headers={"Authorization": f"Bearer {os.environ['RANKBOX_API_KEY']}"},
    json={"published_url": f"https://example.com/blog/{slug}"},
    timeout=20,
)
res.raise_for_status()
```

Rules for `PATCH /articles/{id}`:

- The body is `{ "published_url": "…" }`. Send a full `https://` address.
- The URL must be a public `http` or `https` address on your own site: the **Website** in **Dashboard → Settings**, or the domain you verified for the backlink exchange. Subdomains count and `www.` is ignored. Anything else returns `400` with "published_url must be on your own site (…)", naming the allowed domains.
- Only finished articles of the key's site can be updated; others return `404`.
- Each `PATCH` replaces the URL recorded before, and updates the article's `updated_at`, so the article comes back on your next `since` sync.
- `GET /articles?published=false` returns only articles with no live URL yet. Use it to catch up on reports, 100 at a time.

If every report fails with `400`, fix the domain once rather than retrying per article. Full detail: [Live URLs and verification](/docs/publishing/live-urls).

## Caching and freshness

- **Rankbox never notifies your site.** Freshness is your polling interval: hourly is plenty for most sites; autopilot writes at most one article a day per site.
- **Cache the list, not just the pages.** A full walk costs one request per 100 articles. Cache the result (as the Next.js recipe does with `revalidate`) instead of calling the API on every page view.
- **Build-time sites need a rebuild.** Static output only changes when you rebuild, so schedule rebuilds, or switch to incremental regeneration.
- **The dashboard shows your sync.** **Dashboard → Integrations** shows when the site last synced and how many published articles have reached it. A site whose key hasn't been used for 48 hours is shown as idle.
- **Don't block Rankbox's checker.** If you report live URLs, your pages are fetched by `RankboxBot/1.0 (+https://rankbox.xyz)` to verify hosted links. A firewall that answers it with `403`, `429` or `503` stops verification.

## Errors and rate limits

Every error is JSON with an `error` message. Branch on the status code, and on `code` where present, not on the message text.

| Status | When | What to do |
| --- | --- | --- |
| `400` | `PATCH` without `published_url`, a non-public URL, or a URL off your domain | Fix the request. Don't retry it as is. |
| `401` | The key is missing, malformed, unknown or revoked | Create or replace the key. |
| `402` with `"code": "subscription_required"` | The site has no active trial or plan, or it was removed from Studio | Stop and keep your cursor; resume when the plan is active. |
| `404` | The article isn't finished, was deleted, or belongs to another site | Skip it. |
| `429` | More than 120 requests a minute for your account, across all its keys, or more than 300 a minute from one IP address | Wait for the next minute; the limit is a fixed 60-second window. |
| `500` | A server error | Retry with backoff. |

Details: [Errors](/docs/api/errors) and [Rate limits](/docs/api/rate-limits). If you'd rather not write the HTTP layer yourself, see the [TypeScript client and plugin starter](/docs/api/client-library).

## Related

- [Articles endpoints](/docs/api/articles): every parameter and field of the four requests.
- [Syncing articles reliably](/docs/api/syncing): cursors, idempotent writes and full walks in depth.
- [Build a CMS integration](/docs/api/build-an-integration): turning these recipes into a reusable plugin.
- [Live URLs and verification](/docs/publishing/live-urls): what happens after you report a page.
- [Publish to WordPress](/docs/publishing/wordpress): a complete WordPress plugin file and REST API script.
