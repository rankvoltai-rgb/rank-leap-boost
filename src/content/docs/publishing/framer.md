---
title: Sync articles to Framer
nav_title: Framer
description: Use the Rankbox plugin to sync finished articles into a Framer CMS collection, report live URLs back, and add site-wide article structured data.
order: 4
updated: 2026-10-02
---

The Rankbox plugin for Framer keeps a CMS collection in your Framer project in step with your finished Rankbox articles. You design the collection page; Rankbox supplies the words. Articles go live when you publish the site, never before.

{{availability:framer}}

## How the Framer plugin works

The Framer plugin is a pull integration that runs inside the Framer editor. Each time it syncs, it:

1. Fetches every finished article of your Rankbox site from the REST API.
2. Writes new and changed articles into a Rankbox-managed CMS collection, and removes items for articles that no longer exist in Rankbox.
3. Reports each article's live URL back to Rankbox, once your site is published on your own domain.
4. Writes a structured data block into your site's head, if that setting is on.

The plugin only runs while it is open or while Framer runs a collection sync. There is no background process: new articles reach Framer the next time you sync, and reach your live site the next time you publish.

The plugin talks to one address only, `rankbox.xyz`. It sends your API key to authenticate and, when it reports live URLs, the public URL of each article page. It sends nothing else: not your project contents, not your other CMS collections, and no analytics.

## Before you start

You need:

- An active Rankbox trial or plan on the site.
- A Rankbox API key for that site. Create one under **Dashboard → Integrations**: open the **Framer** tile, or the **REST API** tile under Developer, and click **Create key**. Copy it; it is shown once. See [Authentication and API keys](/docs/api/authentication).
- Edit access to the Framer project. A collaborator with view access can open the plugin but can't sync, because syncing changes the CMS.

## Connect the plugin

1. Open your project in Framer and run the Rankbox plugin from Framer's plugins menu.
2. Paste your key into **Rankbox API key** and click **Connect**. Keys start with `rv_live_`; anything else is rejected before it is sent.
3. The plugin checks the key with Rankbox and shows your brand name in its header, so you know you connected the right site.
4. Click **Sync articles**. The plugin creates a collection called **Articles** (or adopts one it created before) and fills it with every finished article.
5. Bind the collection to a collection page in Framer and design it.
6. Publish your site. Articles appear on your live site from this publish on.

If you open the plugin from a collection's settings in Framer's CMS, it works on that collection instead of creating **Articles**. If your project already has a collection named **Articles** that the plugin didn't make, the plugin creates one called **Rankbox Articles** instead.

## Where your API key is stored

The plugin stores your key in your browser's local storage, for this plugin only. It never writes the key into the Framer project.

Plugin data in Framer travels with the project and every collaborator can read it, which is the wrong place for a credential: a Rankbox key can read every article's full body and set the live URL Rankbox verifies backlinks against. Storing it per browser keeps it off the project.

The trade-off: each teammate who runs the plugin pastes a key in their own browser. When a teammate opens a collection that is already set up, the connect screen says which brand the collection syncs and the key prefix it was set up with (for example `rv_live_a1b2c3…`), so they know which key to ask for. If the browser blocks plugin storage, the plugin keeps the key in memory and asks for it again next session.

A key from a different Rankbox site can't take over a collection. The plugin refuses with "That key is for a different site" rather than mix two sites' articles; disconnect and start a new collection instead.

## The Articles collection

The plugin manages these fields:

| Field in Framer | Type | Value from Rankbox |
| --- | --- | --- |
| Item slug | Slug | The article's API slug at its first sync (see [Slugs and redirects](#slugs-and-redirects)) |
| **Title** | Plain text | The article title |
| **Description** | Plain text | The meta description |
| **Content** | Formatted text | The article body, given to Framer as Markdown so it keeps headings, lists and links. It usually opens with an H1 that repeats the title. |
| **Tags** | Plain text | The tags joined with commas (Framer has no list field) |
| **SEO Score** | Number | Rankbox's 0–100 score |
| **Published** | Date | The article's `published_at` from the API, which is the time of its last change in Rankbox |
| **Live URL** | Link | The article's address on your published site, or the live URL Rankbox already has |

Item ids are the Rankbox article ids, so syncing again never creates duplicates.

You can rename any of these fields; the plugin keeps your label. Fields you add to the collection yourself are left alone. If you change the type of one of Rankbox's fields, the plugin doesn't overwrite it: it shows **A field was changed in the CMS** with a **Reset fields** button, which restores Rankbox's fields so the next sync can fill them again.

## How a sync works

Click **Sync articles** at the bottom of the plugin, or **Sync now** in the plugin's header menu. The plugin shows each phase as it goes: fetching articles, checking collection fields, writing to the CMS, removing deleted articles. You can click **Cancel** while it runs.

What a sync does:

- **It walks the full list.** The plugin fetches every finished article, 100 per request, up to 5,000 articles. A complete list is what lets it tell a deleted article from an unchanged one.
- **It writes only what changed.** The plugin keeps a fingerprint of what it last wrote for each article. An article whose title, description, body, tags, score and date are unchanged since the last sync isn't rewritten.
- **It removes deleted articles, carefully.** An item is removed only when the walk reached the end of the list, the article is no longer in it, and the item was created by the plugin. CMS items you added by hand are never removed. The first sync into an existing collection removes nothing; removal starts from the second sync.
- **It writes in batches of 100**, so progress stays accurate on large libraries.

When it finishes, the plugin shows "Up to date · N articles" with counts written, removed and unchanged. If the site has no finished articles yet, it says "No finished articles yet".

**Resync everything** in the header menu rewrites every article regardless of fingerprints. Use it when the collection has drifted, for example after you reset fields. Collections that hold more than 1,000 Rankbox articles switch to fetching only what changed since the last sync; **Resync everything** always forces a full walk.

When Framer itself runs a sync of the collection, the plugin works without opening its window and Framer shows a short message such as "Rankbox: 3 articles synced, 1 removed." or "Rankbox: already up to date." If the browser has no key stored, it says "Rankbox isn't connected in this browser. Open the Rankbox plugin and paste your key."

## Slugs and redirects

By default, an item keeps the slug it was first synced with, even if you retitle the article in Rankbox. Rankbox's API slug is built from the current title, so following it would change a published page's URL and invalidate the live URL already reported to Rankbox.

To make slugs follow Rankbox's titles instead, turn on **Follow slug changes from Rankbox**. When a slug then changes, the plugin adds a redirect from the old path to the new one so old links keep working. Adding redirects needs permission to change site settings and a Framer plan that includes redirects; if either is missing, the sync still succeeds without the redirect.

Slugs are made safe for Framer (lowercase letters, digits and hyphens, up to 100 characters), and if two articles in one sync would share a slug, the second gets `-2`.

## Live URLs

The plugin can tell Rankbox where each article went live. This is what the backlink exchange verifies hosted links against (see [Live URLs and verification](/docs/publishing/live-urls)).

The plugin builds each address from your site's production URL in Framer, the **Collection page path** setting, and the item's slug: `{production URL}{path}/{slug}`. The path defaults to `/blog`. You can type `/blog/:slug`, a full URL, or a path with a trailing slash, and the plugin reduces it to the path. The setting shows a preview of a real article's address.

Reporting needs a published site. Until the project has been published, the plugin shows "Publish this project in Framer and Rankbox can record where each article lives." With **Report live URLs to Rankbox** on (the default), reporting runs after every sync. You can also run it with **Report live URLs** in the **Live URLs** card, which shows how many articles aren't reported yet, or "All reported to Rankbox."

Rankbox only accepts a live URL on your site's own domain: the **Website** in **Dashboard → Settings**, or the domain you verified for the backlink exchange (subdomains count, and `www.` is ignored). A project published only to its Framer subdomain won't match. The plugin checks this before sending anything and says "Rankbox expects your articles on {your domain}, but this project publishes to {Framer domain}." It also sends the first report on its own as a probe: if Rankbox rejects the domain, it stops there instead of sending a request per article.

The plugin paces reports (four at a time, so a large library stays under the API's per-minute limit) and skips articles deleted in Rankbox since the sync.

## Structured data in the site head

With **Add article structured data** on (the default), the plugin writes one JSON-LD block into your site's custom code, at the end of the `<head>`, describing:

- Your organization: your Rankbox brand name (or your domain) and your Rankbox site's logo, if it has one.
- Your website and your blog.
- Each synced article as a `BlogPosting`, up to the 50 most recent, with its headline, its own URL, its description, its tags as keywords, and its dates. Both dates come from the API's `published_at` and `updated_at`, which are the time of the article's last change in Rankbox.

The trade-off: Framer allows one custom-code block per location for the whole site, and can't inject different code into individual CMS pages. So this is one graph, the same on every page, that lists every article with its own URL, rather than an `Article` block scoped to each article page. The alternative, writing per-page markup with JavaScript in the browser, would be invisible to most AI crawlers, which don't run JavaScript. A static block in the page source is readable by all of them.

The block needs a published site, because article URLs are built from its address. If your site's head custom code already holds something that isn't Rankbox's block, the plugin leaves it alone and says "Your site's head already has custom code, so Rankbox left it alone." Turning the setting off, or logging out, removes Rankbox's block and only Rankbox's block. Publish the site to put any change to the block live.

## Plugin settings

| Setting | Default | What it does |
| --- | --- | --- |
| **Collection page path** | `/blog` | The path of your collection page, used to build live URLs and structured data |
| **Report live URLs to Rankbox** | On | Reports each article's address after every sync, once the site is published |
| **Add article structured data** | On | Writes the JSON-LD block described above into the site head |
| **Follow slug changes from Rankbox** | Off | Lets slugs follow Rankbox titles, with redirects for old paths |

Settings are saved with the collection, so they are the same for every teammate. The API key is the only thing stored per browser.

The header menu has **Sync now**, **Resync everything**, **Open Rankbox**, **Help & troubleshooting** and, once connected, **Log Out**.

## Log out

**Log Out** in the plugin's header menu removes the key from this browser and removes Rankbox's structured data block from the site head. Your CMS items stay exactly as they are; you see "Disconnected. Your CMS items are untouched."

To stop the plugin working everywhere, revoke the key in **Dashboard → Integrations**. Every browser that stored it then gets "That key isn't valid any more" on its next sync.

## Troubleshooting

| What you see | Cause | Fix |
| --- | --- | --- |
| "That key isn't valid any more" | The key was revoked or replaced. | Create a new key in **Dashboard → Integrations** and paste it in. |
| "This site isn't on an active plan" | The site's trial or plan lapsed, or the site was removed from Studio. | Check **Dashboard → Plan & Billing**. |
| "Your Framer domain doesn't match Rankbox" | The project publishes to a domain that isn't your Rankbox site's domain. | Publish to your custom domain, or update **Website** in **Dashboard → Settings**. |
| "Rankbox is rate-limiting this key" | Too many requests in the last minute. | Wait a minute, then sync again. |
| "A field was changed in the CMS" | One of Rankbox's fields had its type changed. | Click **Reset fields**, then sync. |
| "That key is for a different site" | The key belongs to another Rankbox site than the one this collection syncs. | Use that site's key, or start a new collection. |
| "You don't have permission to change this project's CMS." | You have view access to the project. | Ask for edit access. |
| A teammate sees the connect screen | Keys are stored per browser, not per project. | The teammate pastes their own key. |
| Nothing appears on the page | The collection has the articles, but the page's fields aren't bound. | Bind the collection's fields on your collection page in Framer. |
| Redirects weren't added | No site settings permission, or the Framer plan has no redirects. | Syncing still works. Add redirects by hand or keep **Follow slug changes from Rankbox** off. |
| "Some articles share a timestamp" | More than 100 articles share one update time, so paging can't move past them. | Contact [support](/docs/help/support). |

## Related

- [How publishing works](/docs/publishing/overview): the pull model and how Framer compares with other destinations.
- [Live URLs and verification](/docs/publishing/live-urls): what Rankbox does with the addresses the plugin reports.
- [Authentication and API keys](/docs/api/authentication): creating, replacing and revoking the plugin's key.
- [Rate limits](/docs/api/rate-limits): the per-minute limits the plugin paces itself under.
- [Publish to any website with the REST API](/docs/publishing/custom-sites): the same API, for code you write yourself.
