---
title: How publishing works
nav_title: How publishing works
description: How finished Rankbox articles reach your website, the push and pull models, what each destination receives, and how slugs, edits and deletions behave.
order: 1
updated: 2026-10-02
---

Rankbox writes articles inside your account, then hands every finished one to your website. This page explains which articles leave Rankbox, the two ways they travel (Rankbox pushing them, or your site pulling them), exactly what arrives, and how each destination handles slugs, edits and deletions. Read it before you pick a destination.

## What finished means

Only finished articles ever leave Rankbox. In the database an article's status is `finished`; in the dashboard the same article shows the **Published** pill under **Dashboard → Articles**. Ideas, scheduled articles and articles being written stay inside Rankbox and are never sent to any site.

An article becomes finished in one of three ways:

| How | What happens |
| --- | --- |
| Autopilot writes it | On its run, autopilot writes the next scheduled article and marks it finished. See [Autopilot and the publishing schedule](/docs/content/autopilot). |
| You click **Write now** | Rankbox writes the article immediately and marks it finished in the same step. |
| You click **Publish** in the editor | For an article whose body you wrote or pasted yourself, **Publish** saves it and marks it finished. |

After an article is finished you can keep editing it. Edits to a published article stay in the editor until you click **Publish changes**; that save is what destinations see. See [Editing articles](/docs/content/editor).

> [!NOTE]
> Rankbox does not have a separate "approve" or "send" step. Finished means ready to publish. If you want a human to review articles before readers see them, choose a destination setting that holds them back: drafts in Webflow, hidden posts in Shopify, or a draft status in your own code.

## Where articles can go

Every Rankbox site can publish to one or more of these destinations. The Webflow, Shopify, Framer and WordPress pages each start with that integration's current availability; the REST API works for every site today.

- **[Webflow](/docs/publishing/webflow)**: a Rankbox app connected with Webflow sign-in. Rankbox writes each article into the CMS collection you choose, live or as a draft.
- **[Shopify](/docs/publishing/shopify)**: a Rankbox app inside your Shopify admin. Rankbox adds each article to the blog you choose, visible or hidden.
- **[Framer](/docs/publishing/framer)**: a Rankbox plugin you run in your Framer project. It syncs articles into a CMS collection; they go live when you publish the site.
- **[WordPress](/docs/publishing/wordpress)**: a short piece of your own code that pulls articles from the REST API and creates WordPress posts.
- **[Any website](/docs/publishing/custom-sites)**: Next.js, Astro, Hugo, Rails, a headless CMS or anything else that can make an HTTPS request, through the REST API.

### Square Online

{{availability:square}}

Rankbox has no code that writes to Square Online. The **Square** tile under **Dashboard → Integrations** offers the REST API instead, through **Connect with the API**.

## Push and pull

Rankbox moves articles in two different ways. Which one a destination uses decides who starts each delivery and where problems show up.

### Push: Webflow and Shopify

For Webflow and Shopify, Rankbox holds a connection to your platform and writes articles into it from Rankbox's servers. Nothing on your site has to run. Rankbox pushes an article at these moments:

1. Autopilot finishes writing it.
2. You click **Write now**, **Publish** or **Publish changes** in the dashboard.
3. You ask for a catch-up: **Sync now** (or **Publish N articles now**) in the Webflow setup, or **Publish missing articles now** in the Shopify app. A catch-up sends every finished article that isn't on the platform yet and every article changed since its last push.

A push that fails never undoes the article in Rankbox. The error is recorded on the connection and shown in **Dashboard → Integrations** (and in the Shopify app), and the next push or catch-up tries again.

### Pull: plugins and your own code

For Framer, WordPress and any other site, your side asks Rankbox for articles. A plugin or your own code calls the REST API with an API key, gets every finished article changed since its last request, writes them into your site, and can report each article's live address back with `PATCH /api/public/v1/articles/{id}`.

Rankbox never calls your site in the pull model. Nothing is delivered until your code or plugin asks, so the schedule you run it on (hourly, daily, at build time) is how fast new articles appear. The dashboard marks a pulling site **Live** when one of its keys was used in the last 48 hours and **Idle** after that.

## Compare destinations

| | Webflow app | Shopify app | Framer plugin | WordPress | Any website |
| --- | --- | --- | --- | --- | --- |
| Model | Push | Push | Pull, when you run the plugin | Pull, your code | Pull, your code |
| How it authenticates | Webflow sign-in (OAuth); no Rankbox key | A Rankbox API key pasted once to link the store | A Rankbox API key, stored in your browser | A Rankbox API key in your code | A Rankbox API key in your code |
| What arrives | Title, slug, body, and the description, tags and date fields you map | Title, handle, body, excerpt, search listing description, tags, author | Title, slug, body, description, tags, SEO score, date, live URL | What your code writes | What your code writes |
| Draft or live | Your choice: live items or drafts | Your choice: visible or hidden | Live when you publish the Framer site | Your code decides | Your code decides |
| Edits made in Rankbox | Updated, unless the item was changed in Webflow | Updated, unless the post was changed in Shopify | Updated on the next sync | Your code decides | Your code decides |
| Deleted in Rankbox | The item stays in Webflow | The post stays in Shopify | Removed from the collection on the next full sync | Your code decides | Your code decides; the API has no deletion signal |
| Live URL reported back | Automatically, for live items on your domain | Automatically, for visible posts on your domain | Automatically, once the site is published on your domain | With `PATCH` | With `PATCH` |

Live URLs matter mainly for the backlink exchange, which verifies links on the real page. See [Live URLs and verification](/docs/publishing/live-urls).

## What the published article contains

Every destination receives the same finished article, cleaned of the notes Rankbox's editor uses while writing.

| Part of the article | What leaves Rankbox |
| --- | --- |
| Title | The article title |
| Body | The article as Markdown and as HTML. Image concepts the writer leaves (`[Image: …]` notes) are removed, and internal-link suggestions (`[anchor](#internal: …)`) become plain anchor text. |
| Meta description | The article's meta description |
| Tags | The article's topic tags, as a list |
| SEO score | The article's 0–100 score (API and Framer only) |
| Images | Not sent. Add your own images in your CMS. |
| Structured data | Not sent with the article. The Framer plugin can add its own site-wide JSON-LD block. |

Each destination then adjusts the body for its own format:

- **The opening heading.** Article bodies usually start with an H1 that repeats the title. Webflow and Shopify remove it, because their templates already show the title. The REST API keeps it, so your code decides.
- **Video embeds.** Some articles carry a YouTube `<iframe>` followed by a plain link to the same video. Webflow drops the iframe (its rich text field can't take one through the API) and keeps the link. Shopify and the REST API keep both.
- **Code blocks.** Webflow turns code blocks into inline code, line by line, because its API empties code blocks. Everywhere else they stay as they are.

The full field reference for the API is in [Articles endpoints](/docs/api/articles).

## Slugs

A slug is the last part of an article's URL. Rankbox and the destinations treat slugs carefully, because a slug that changes after an article is live breaks its URL and any link already verified on it.

| Where | How the slug is made | When it changes |
| --- | --- | --- |
| REST API `slug` field | The title in lowercase, every run of other characters turned into a hyphen, cut to 60 characters, then a hyphen and the first 8 characters of the article id. Example: `how-to-price-a-saas-product-a1b2c3d4`. | Whenever the title changes, because it is computed from the current title |
| Webflow item slug | The title in lowercase letters, digits and hyphens, up to 100 characters, with no id suffix. If another item already has it, `-2`, `-3` and so on are added. | Never. The item keeps the slug it was created with. |
| Shopify handle | The same rule as Webflow | Never. The post keeps the handle it was created with. |
| Framer item slug | The API slug at the first sync | Never, unless you turn on **Follow slug changes from Rankbox** in the plugin |

If you build your own integration, store the slug the first time you publish an article and keep it. The [custom sites guide](/docs/publishing/custom-sites#keep-slugs-stable) shows how.

## Edits, deletions and your own changes

Each destination has a rule for what happens after the first publish:

- **Webflow and Shopify treat the platform as the source of truth once something is there.** Rankbox updates an item or post only while it is unchanged on the platform. If you edit it in Webflow or Shopify, Rankbox leaves it exactly as you edited it from then on. If you delete it there, Rankbox never creates it again.
- **Deleting an article in Rankbox doesn't delete it from Webflow or Shopify.** Remove the item or post on the platform yourself.
- **The Framer plugin mirrors Rankbox.** Each sync updates changed articles and removes items for articles that no longer exist in Rankbox, but only items the plugin created itself.
- **With the REST API, your code decides.** The API returns finished articles only; an article deleted in Rankbox simply stops appearing. To remove deleted articles, compare a full list with what you have stored.

## Plans and publishing

Publishing is part of the plan, and works during the free trial too.

- Creating an API key, connecting Webflow and syncing all need an active trial or plan on the site. Without one, the dashboard offers **Start free trial** instead.
- If the plan lapses, every API request for the site returns `402` with the code `subscription_required`, pushes to Webflow and Shopify stop, and **Dashboard → Integrations** says **Syncing is paused**. Nothing already on your site is removed.
- Every Rankbox site publishes on its own. With [Studio](/docs/account/studio), each site has its own API keys, its own Webflow connection and its own Shopify store. An API key only ever sees the articles of the site it was created for.

## Choose a destination

- You run Webflow or Shopify and want no code: use the app for your platform.
- You build in Framer: use the Framer plugin, and run it whenever you want new articles in the CMS.
- You run WordPress: use the [WordPress guide](/docs/publishing/wordpress), which gives you a complete plugin file or script to copy.
- You have a custom or headless site: use the [REST API recipes](/docs/publishing/custom-sites).
- Your platform isn't listed: any platform that can run a scheduled job or a build step can use the REST API.

## Related

- [Live URLs and verification](/docs/publishing/live-urls): why reporting where an article went live matters, and how it is checked.
- [Publish to any website with the REST API](/docs/publishing/custom-sites): working code for Next.js, Astro, static generators and scheduled syncs.
- [Authentication and API keys](/docs/api/authentication): create, replace and revoke the key a pulling site uses.
- [Syncing articles reliably](/docs/api/syncing): the `since` cursor, paging and idempotent writes.
- [Autopilot and the publishing schedule](/docs/content/autopilot): when articles become finished in the first place.
