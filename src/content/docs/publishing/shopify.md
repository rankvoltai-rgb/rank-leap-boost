---
title: Publish to Shopify
nav_title: Shopify
description: Install the Rankbox app in Shopify, link it to a Rankbox site with an API key, pick a blog, and let every finished article arrive as a native blog post.
order: 3
updated: 2026-10-02
---

The Rankbox app for Shopify adds each finished article to a blog in your Shopify store as an ordinary blog post, with its URL handle, excerpt, search listing description and tags filled in. You set it up inside your Shopify admin; after that, Rankbox publishes from its own servers with nobody signed in.

{{availability:shopify}}

## How the Shopify app works

The Shopify app is a push integration with two parts:

- **The app inside your Shopify admin**, under **Apps → Rankbox**, on a page called **Blog publishing**. This is where you link the store to a Rankbox site and choose the blog, the visibility of new posts, and the author name.
- **The publisher on Rankbox's servers.** When an article is finished, Rankbox writes it into your blog through Shopify's Admin API, using an access token Shopify issued to the app.

A Rankbox API key is used once, to tell the app which Rankbox site the store publishes for. After that the key is not involved in publishing at all.

Each Rankbox site publishes to at most one store, and each store publishes for one Rankbox site. With [Studio](/docs/account/studio), link each store with the key of the site it belongs to.

## Before you start

You need:

- An active Rankbox trial or plan on the site.
- A Shopify store with at least one blog. Most stores already have one, often called "News". If yours has none, add one in **Online Store → Blog posts**.
- Permission to install apps on the store.

## Install the app and link your site

1. Install the Rankbox app on your store. Shopify lists it under **Apps** in your admin.
2. Open **Apps → Rankbox**. The app installs itself on first open and shows **Connect your Rankbox site**.
3. Click **Get a key in Rankbox**. This opens **Dashboard → Integrations** in Rankbox with the key setup for Shopify.
4. In Rankbox, click **Create key**, then **Copy key**. The key starts with `rv_live_` and is shown only once.
5. Back in Shopify, paste the key into **Rankbox API key** and click **Connect**. You see "Connected to Rankbox."
6. Choose your publishing settings (next section) and click **Start publishing**.

While you create the key, the Rankbox dashboard watches for the store to link and moves on by itself once it does.

Make the key from the Rankbox site you want this store to publish for. With Studio, switch to that site in the dashboard before creating the key.

## Choose a blog, visibility and author

The **Publishing** section of the app has three settings:

| Setting | Options | What it does |
| --- | --- | --- |
| **Blog** | Every blog in your store (up to 100) | The blog new articles go to. "Changing it later sends new articles to the new blog. Posts already published stay where they are." |
| **New articles** | **Visible: published right away** or **Hidden: added unpublished, for you to review** | Whether each new post goes live on your storefront when Rankbox creates it |
| **Author** | Any name, up to 100 characters | "Shown as the author on each post." Defaults to your Rankbox brand name, then your store name. |

Click **Start publishing** the first time and **Save** after that. Rankbox checks the blog against your store before saving. From then on every newly finished article goes to that blog. Articles finished before you linked the store are sent when you use [Publish missing articles](#publish-missing-articles).

Rankbox tracks posts per blog. If you switch to another blog, an article you republish afterwards, or one that **Publish missing articles now** picks up, is created in the new blog, and the post in the old blog stays where it is.

## What Rankbox can access

The app requests a single Shopify access scope, `write_content`, which covers your online store's content such as blogs and blog posts. It does not request access to products, orders or customers, and it never reads them.

Rankbox only creates and updates the blog posts it writes. Other posts in your blogs are never touched.

## When articles are sent to Shopify

Rankbox pushes a single article to your blog when:

1. Autopilot finishes writing it.
2. You click **Write now**, **Publish** or **Publish changes** for it in the Rankbox dashboard.

It pushes many at once when you click **Publish missing articles now** in the app. Each push is safe to repeat: an article whose content hasn't changed since its last push is skipped.

A failed push never undoes the article in Rankbox. The error is saved on the connection and shown in two places: a **Publishing needs attention** banner in the app, and **Needs attention** on the **Shopify** tile in **Dashboard → Integrations**.

## What each post contains

| Shopify field | Value from Rankbox | Set when |
| --- | --- | --- |
| Title | The article title ("Untitled" if empty) | Create and every update |
| Content | The article as HTML, with Rankbox's writer notes removed and the opening H1 removed (your theme shows the title). YouTube embeds and code blocks are kept. | Create and every update |
| Excerpt | The meta description, as one paragraph | Create and every update |
| Search listing description | The meta description, saved in Shopify's `global.description_tag` metafield, which is what the search engine listing preview shows | Create and every update, when the article has a description |
| Tags | The article's tags, with duplicates removed (case-insensitive) and each tag cut to 255 characters | Create and every update |
| URL handle | Made from the title: lowercase letters, digits and hyphens, up to 100 characters. If another post has it, `-2`, `-3` and so on are added, up to five attempts. | Create only |
| Author | The **Author** setting ("Rankbox" if it is blank) | Create only |
| Visibility | The **New articles** setting | Create only |

The handle, author and visibility are set once and then belong to you: change them in Shopify whenever you like (but see the next section). Rankbox doesn't send images; add a featured image in Shopify if your theme uses one.

## Updates and edits made in Shopify

Rankbox keeps a ledger of every post it created: which article it came from, its handle, a fingerprint of what was written, and the post's last-updated time in Shopify. The ledger enforces these rules:

- **One post per article per blog.** If two pushes race, only one creates the post.
- **The first handle is kept.** Updates never change a post's handle, even if you retitle the article in Rankbox.
- **Unchanged articles aren't rewritten.**
- **Posts edited in Shopify are never overwritten.** Before every update, Rankbox reads the post. If its last-updated time no longer matches the one Rankbox recorded, Rankbox marks it as edited in Shopify and stops updating it, permanently. Shopify decides what moves that time, so treat any change you make to the post in Shopify, including making a hidden post visible, as that point.
- **Posts deleted in Shopify are never re-created.** If the post is gone but the blog still exists, Rankbox marks it deleted and leaves it deleted. If the whole blog is gone, publishing stops with "The Shopify blog Rankbox publishes to no longer exists. Pick another blog in the Rankbox app in Shopify."
- **Lost answers aren't duplicated.** If Shopify times out during a create, Rankbox looks for a post with the same handle and title made in the last 30 minutes, and adopts it instead of creating a second copy.

If you want to review posts and still receive Rankbox edits, make your edits in Rankbox and click **Publish changes** before you change the post in Shopify.

Deleting an article in Rankbox does not delete its Shopify post. Delete the post in Shopify yourself.

## Publish missing articles

After setup, the app's **Articles** section shows one line such as "12 articles in this blog · 3 finished in Rankbox but not here yet · 1 post edited here, which Rankbox leaves as you changed them." and when the last article was published.

Click **Publish missing articles now** to send every finished article that isn't in this blog yet, and update every article that changed since its last push, except posts edited or deleted in Shopify. Each request works for up to about 40 seconds and the app repeats it, up to 10 rounds, until nothing remains. You then see "Published N new, updated N." or "Everything is already here."

If the store or setup makes every article fail the same way (a frozen or unpaid store, missing permission, a deleted blog, or the same validation error three times in a row), the run stops early and shows the first error.

## Live URLs from Shopify

Shopify serves every blog post at `/blogs/{blog handle}/{post handle}`. When Rankbox creates a visible post, it builds the address on your store's primary domain and records it as the article's live URL, but only when:

- The post was created visible, not hidden.
- The address is on your own domain, meaning the **Website** in **Dashboard → Settings** or the domain you verified for the backlink exchange. A `myshopify.com` address doesn't qualify unless that is your website.
- The article has no live URL recorded yet. A URL you pasted or one found in your sitemap wins.

Hidden posts don't get a live URL from the app. After you make them visible, the URL can be found through your sitemap or pasted by hand. See [Live URLs and verification](/docs/publishing/live-urls).

If you change your store's primary domain, open the app and click **Save** so Rankbox picks up the new one.

## API keys and the store link

The API key you paste only identifies the Rankbox site. Rankbox checks it once, links the store to that site, and does not store the key with the store.

> [!IMPORTANT]
> Revoking the API key in **Dashboard → Integrations** does not unlink the store or stop publishing. To stop publishing to a store, use **Disconnect** in the app or **Disconnect store** in Rankbox, or uninstall the app.

A pasted key is refused when:

- It isn't a working Rankbox key: "That key isn't a working Rankbox API key. Copy it again from Rankbox → Integrations."
- Its site has no active plan or trial: "That key's Rankbox site doesn't have an active plan or trial. Start one in Rankbox, then paste the key again."
- Its site already publishes to another installed store: "That Rankbox site already publishes to {store}. Disconnect it in the Rankbox app on that store first, or use the key of another site."

## Access tokens and stores left idle

Shopify gives the app an offline access token that expires after one hour, plus a refresh token that lasts 90 days and is replaced every time it is used. Rankbox refreshes the access token on its own before each publish, so publishing keeps working with nobody signed in to Shopify. Both tokens are encrypted at rest with AES-256-GCM and never leave Rankbox's servers.

If Rankbox can't refresh, for example because the store went 90 days or more without a single publish and the refresh token expired, publishing stops with "Shopify needs you to open Rankbox in your Shopify admin once to keep publishing." Open **Apps → Rankbox** once. The app gets fresh tokens from Shopify and publishing resumes on its own; then click **Publish missing articles now** to catch up.

## Disconnect, uninstall and data deletion

| Action | Where | What happens |
| --- | --- | --- |
| **Disconnect** | The app's **Rankbox site** section (click twice to confirm) | The store is unlinked from the Rankbox site and stops receiving articles. Posts already published stay in your blog. The app stays installed. |
| **Disconnect store** | **Dashboard → Integrations → Shopify** in Rankbox, for when you can't open the store's admin | The same as **Disconnect**. To connect again, paste a key in the app. |
| Uninstall the app | Your Shopify admin | Shopify notifies Rankbox, which deletes the store's tokens at once. Posts stay in your blog. The dashboard shows "The Rankbox app was removed from this store." |
| Shopify's shop data deletion request | Sent by Shopify 48 hours after an uninstall | Rankbox deletes everything it stored about the store, including its post ledger. |

Unlinking keeps the ledger, so linking the store again later updates existing posts instead of duplicating them. The same is true if you reinstall within 48 hours of uninstalling. After Shopify's deletion request, Rankbox no longer knows which posts it made, so **Publish missing articles now** would add your articles again as new posts.

Rankbox stores no customer data from Shopify, so Shopify's customer data requests have nothing to return or erase.

## Status in the Rankbox dashboard

Once a store is linked, the **Shopify** tile in **Dashboard → Integrations** shows its state, and opening it shows where articles go and an **Open Rankbox in Shopify** button:

| Tile label | Meaning |
| --- | --- |
| **Connected** | Publishing to the chosen blog |
| **Finish setup** | Linked, but no blog chosen yet. Open the app and click **Start publishing**. |
| **Needs attention** | The last publish failed. The message says why. |
| **App removed** | The app was uninstalled from the store |

The blog, visibility and author are only changed in the app inside Shopify.

## Troubleshooting

| What you see | Cause | Fix |
| --- | --- | --- |
| "Open Rankbox from your Shopify admin: Apps, then Rankbox. This page only works inside Shopify." | You opened the app's address outside Shopify. | Open it from **Apps → Rankbox** in your admin. |
| "Your Shopify session expired. Reload the page." | The admin session timed out. | Reload the page. |
| "This store has no blog yet" | The store has no blog. | Add one in **Online Store → Blog posts**, then reload the app. |
| **No active Rankbox plan** banner | The linked site has no trial or plan, so nothing new is published. | Start the trial or renew under **Dashboard → Plan & Billing**. |
| "Shopify needs you to open Rankbox in your Shopify admin once to keep publishing." | The tokens expired or were refused. | Open **Apps → Rankbox** once, then **Publish missing articles now**. |
| "This Shopify store is frozen or unpaid, so Shopify isn't accepting changes." | Shopify blocked changes to the store. | Resolve it with Shopify, then **Publish missing articles now**. |
| An edit made in Rankbox doesn't reach the post | The post was changed in Shopify, so Rankbox leaves it alone. | Make the change in Shopify. |
| Posts appear with the store name as author | **Author** was empty when the link was made and no brand name was set. | Change **Author** in the app and click **Save**. Existing posts keep their author. |
| Publishing continues after you revoked the key | Revoking a key doesn't unlink a store. | Click **Disconnect** in the app or **Disconnect store** in Rankbox. |

## Related

- [How publishing works](/docs/publishing/overview): the push and pull models and how every destination compares.
- [Live URLs and verification](/docs/publishing/live-urls): what happens with the address Rankbox records for each post.
- [Authentication and API keys](/docs/api/authentication): creating the key you paste into the app.
- [Editing articles](/docs/content/editor): **Publish changes** and how edits reach your store.
- [Studio: run several sites](/docs/account/studio): one store per Rankbox site.
