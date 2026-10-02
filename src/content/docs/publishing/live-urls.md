---
title: Live URLs and verification
nav_title: Live URLs
description: How Rankbox learns where each article went live, the rules a live URL must follow, and how the backlink exchange verifies links on that page.
order: 7
updated: 2026-10-02
---

An article's live URL is the address where it is published on your website. Rankbox records it for each finished article, and the backlink exchange uses it to check that links placed in your articles are really live. This page explains every way a live URL gets recorded, the rules it must follow, what "verified" means, and how to fix pages that can't be verified.

## Why the live URL matters

Rankbox writes articles, but your website publishes them, so Rankbox can't know an article's address unless something tells it. The live URL is used in two places:

- **The backlink exchange.** When the exchange places another member's link in one of your articles, credits move only after that link is verified on your real page. The live URL is the page the exchange checks. Without it, the link can't be verified, and after 30 days it expires and the credits go back. See [Backlink exchange](/docs/growth/backlink-exchange).
- **The REST API and plugins.** Every article returned by the API carries its `published_url` (or `null`), and `GET /articles?published=false` lists the finished articles still waiting for one. The Framer plugin also shows it in the collection's **Live URL** field.

The backlink exchange is part of the paid plan. If you don't use it, reporting live URLs is still harmless and keeps your article records complete.

## How a live URL gets recorded

| Source | How it works | Replaces a URL already recorded? |
| --- | --- | --- |
| Webflow app | Records the item's address when it creates a live item on your domain | No, only fills an empty one |
| Shopify app | Records the post's address when it creates a visible post on your domain | No, only fills an empty one |
| Framer plugin | Reports each article's address after a sync, once the site is published | Yes |
| Your own code | `PATCH /api/public/v1/articles/{id}` with `published_url` | Yes |
| Sitemap discovery | The exchange finds the page in your sitemap | No, only fills an empty one |
| Paste in the dashboard | **Paste live URL** on a link in **Dashboard → Backlinks → Give links** | Yes |

### From the Webflow and Shopify apps

The apps work out the address when they create an item or post: `https://{domain}/{collection slug}/{item slug}` for Webflow, `https://{primary domain}/blogs/{blog handle}/{post handle}` for Shopify. They record it only when the item was created live (Webflow) or visible (Shopify), the address is on your own domain (a `webflow.io` or `myshopify.com` address isn't), and the article has no live URL yet. Items created as drafts or hidden posts get no URL from the app; once you publish them, sitemap discovery or a paste can supply it. See [Webflow](/docs/publishing/webflow#live-urls-from-webflow) and [Shopify](/docs/publishing/shopify#live-urls-from-shopify).

### From the Framer plugin

The plugin builds each address from your published site's domain, the **Collection page path** setting and the item's slug, and reports it with the API. It reports only after the Framer site has been published, and checks your domain first so a mismatch costs one request, not hundreds. See [Framer](/docs/publishing/framer#live-urls).

### From your own code

Send the address once the page is live:

```bash title="cURL"
curl -X PATCH "https://rankbox.xyz/api/public/v1/articles/$ARTICLE_ID" \
  -H "Authorization: Bearer $RANKBOX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"published_url":"https://example.com/blog/how-to-price-a-saas-product-a1b2c3d4"}'
```

The response is `{ "article": { … } }` with `published_url` set. Reporting also updates the article's `updated_at`, so the article comes back on your next `since` sync; make sure your sync writes it idempotently. Recipes: [Publish to any website with the REST API](/docs/publishing/custom-sites#report-the-live-url).

### From your sitemap

The exchange can find the page itself. On its scheduled runs, for each article that carries a placed exchange link and has no live URL on your verified exchange domain, it reads your site's sitemap and looks for the article:

- **Where it looks.** The `Sitemap:` lines in your `robots.txt` that point to your own domain. Without any, it tries `/sitemap.xml`, `/sitemap_index.xml`, `/wp-sitemap.xml` and `/sitemap-index.xml`. It follows sitemap indexes up to 3 levels deep, reads up to 20 sitemap files and 5,000 page addresses, skips gzipped (`.gz`) sitemaps, and reuses what it read for 6 hours.
- **How it matches.** It compares the last part of each page's path (ignoring `.html`, `.htm` or `.php`) with the article. A page matches if that segment equals the article's API slug, ends with the first 8 characters of the article id, equals the title part of the slug, or shares at least 85% of its words with a title of three or more words. If two pages match equally well, it doesn't guess and records nothing.
- **Which domain.** Only your domain verified for the backlink exchange is crawled.

Sitemap discovery covers only articles that host an exchange link. For everything else, report the URL from your integration.

### Paste it in the dashboard

1. Open **Dashboard → Backlinks** and the **Give links** tab.
2. Find the link with the **Placed** status ("The link is in the article. Waiting to see it live.").
3. Click **Paste live URL**. The dialog asks "Where did "…" go live?"
4. Paste the page's full address on your domain, starting with `https://`, and click **Save URL**.

You see "Got it. We'll check the page within the day and settle the credits." **Paste live URL** appears only on links that are placed, whose article still exists, while your plan is active.

## Rules a live URL must follow

Every source applies the same checks before a URL is recorded:

- **A public web address.** It must be `http` or `https`, and its host can't be `localhost`, a private or reserved IP address, or an internal hostname. Send the full address, including `https://`.
- **On your own domain.** It must be on the domain you verified for the backlink exchange, or on the domain of the **Website** in **Dashboard → Settings**. Subdomains of that domain count (`blog.example.com` is on `example.com`), and a leading `www.` is ignored. A parent domain doesn't count: if your website is `blog.example.com`, an address on `example.com` is refused.
- **A finished article of the same site.** An API key can only set the URL of a finished article of its own site; anything else returns `404`.

When a URL is on the wrong domain, the API answers `400` with "published_url must be on your own site (…)", naming the domains it accepts, and the dashboard says "The published URL must be on …". If neither domain is set, the message asks you to set your website in Settings.

The exchange then checks only pages on your **verified exchange domain**. A URL accepted because it is on your Settings website, but not on your verified exchange domain, is recorded on the article and ignored by the exchange.

## What verified means

To verify a link, the exchange fetches your page as `RankboxBot/1.0 (+https://rankbox.xyz)`, follows up to 3 redirects, waits up to 12 seconds, and reads up to 2 MB of HTML. It then looks for the link in the article body: the page with its `<head>`, scripts, styles, `noscript`, `template`, `svg`, `nav`, `header`, `footer` and `aside` elements removed.

Each check ends in one outcome:

| Outcome | What it means | Counts against you |
| --- | --- | --- |
| Live | The link is in the article body, followed, on an indexable page | No. This is "verified": the link turns **Live** and the credits settle. |
| Missing | The page loaded and the link isn't in the body, or is only in navigation, header or footer, or the page returned `404` or `410` | Yes |
| Nofollow | The link is there but carries `rel="nofollow"`, `"sponsored"` or `"ugc"` | Yes |
| Noindex | The link is there but the page has a robots `noindex` (or `none`) meta tag, or its canonical URL points to a different host name | Yes |
| Unreachable | Timeout, network error, a `5xx`, an unexpected status, or too many redirects | No, checked again later |
| Blocked | The site answered `403`, `429` or `503` to the checker | No, checked again later |
| Truncated | The page was larger than 2 MB, or renders its content with JavaScript | No, checked again later |

## When checks run

The exchange works on a schedule. The intervals are:

| Situation | What happens |
| --- | --- |
| A placed link gets a live URL | It is checked on the next run. If it isn't live, it is checked again about every 20 hours. |
| A placed link is never verified | 30 days after the link was placed, it expires and the credits return to the other member. |
| A live link | Re-checked every 7 days. |
| A live link fails a check | Re-checked about every 20 hours. The dashboard shows **Can't see the link · N/3**. |
| Three failing checks spanning at least 72 hours | The link is marked **Lost**: the credits go back to the other member and your reputation drops. |

Only Missing, Nofollow and Noindex count as failing checks. Unreachable, Blocked and Truncated checks neither start nor extend a failing streak, and a Live check ends one.

## Pages that can't be verified

Some pages can never be read by the checker, so their links can't settle:

- **JavaScript-rendered pages.** If the article body, after the elements above are removed, has fewer than 600 characters of text or no links at all, the checker treats the page as a shell filled in by JavaScript. The result is Truncated: "the page renders its content with JavaScript, so it can't be read". Single-page apps that render articles only in the browser fall here.
- **Very large pages.** HTML beyond 2 MB is cut off. If the link wasn't found in the part that was read, the result is Truncated.
- **Bot walls.** A firewall or bot protection that answers `403`, `429` or `503` gives Blocked.

These outcomes never count against you, but a placed link that is never readable still expires after 30 days, with its credits returned.

## Make your pages verifiable

- Serve article pages as server-rendered or static HTML, so the article text and links are in the page source.
- Render the article body inside your main content, not inside `nav`, `header`, `footer` or `aside` elements.
- Keep links in the article body followed: don't add `rel="nofollow"`, `"sponsored"` or `"ugc"`.
- Don't mark article pages `noindex`, and keep their canonical URL on the same host as the page.
- Let `RankboxBot/1.0 (+https://rankbox.xyz)` through your firewall or bot protection.
- Keep article pages under 2 MB of HTML and reachable in 3 redirects or fewer, returning `200`.
- Keep URLs stable after publishing. All of Rankbox's own integrations keep an article's first slug; do the same in your code (see [Keep slugs stable](/docs/publishing/custom-sites#keep-slugs-stable)).

## Fix a wrong or missing live URL

| Problem | Fix |
| --- | --- |
| No live URL, and links stay **Placed** | Report it from your integration, paste it with **Paste live URL**, or make sure your sitemap lists the page on your verified exchange domain. |
| "published_url must be on your own site (…)" | The page isn't on your Settings website or verified exchange domain. Update **Website** in **Dashboard → Settings**, verify the right domain on **Dashboard → Backlinks**, or publish on that domain. |
| A Webflow or Shopify item has no URL | It was created as a draft or hidden post, or on a `webflow.io` or `myshopify.com` address. Publish it on your own domain, then paste the URL or let sitemap discovery find it. |
| The recorded URL is wrong | Send the right one with `PATCH` or **Paste live URL**; both replace it. The apps and sitemap discovery never replace an existing URL. |
| The link is checked on an old URL | A placed link takes the article's live URL the first time it is found, and keeps checking that page. If that page was wrong, contact [support](/docs/help/support). |
| Checks end in Truncated | Render the article on the server or at build time. |
| Checks end in Blocked | Allow the `RankboxBot` user agent in your firewall or bot protection. |
| A live link shows **Can't see the link** | Open the page and confirm the link is still in the article body and followed. Restore it before the third failing check. |

## Related

- [Backlink exchange](/docs/growth/backlink-exchange): how links are placed, credited and charged back.
- [Publish to any website with the REST API](/docs/publishing/custom-sites): reporting live URLs from your own code, with working recipes.
- [How publishing works](/docs/publishing/overview): which destinations report live URLs automatically.
- [Articles endpoints](/docs/api/articles): the `published_url` field and `PATCH /articles/{id}`.
- [Account and site settings](/docs/account/settings): where your site's website is set.
