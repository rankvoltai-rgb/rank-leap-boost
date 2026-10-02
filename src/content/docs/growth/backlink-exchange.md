---
title: The backlink exchange
nav_title: Backlink exchange
description: How the Rankbox backlink exchange works for paid members, from credits and matching to verification, placement statuses, clawbacks and Studio rules.
order: 1
updated: 2026-10-02
---

The backlink exchange is a credit network between paying Rankbox members. Your site earns credits by carrying one relevant link to another member's page inside an article Rankbox writes for you, and spends credits to have its own pages linked from other members' articles. Credits move only when a link is verified live on the host's real page.

You find it at **Dashboard → Backlinks**. Everything in the exchange belongs to one site: each site verifies its own domain, hosts links in its own articles, and has its own credit balance, targets and block list.

## Who can use the exchange

The backlink exchange is part of the paid plan only. It is not part of the free trial, and it opens with your first paid invoice.

The trial is excluded on purpose: a throwaway seven-day account must not be able to mint links out of the network. Every site that hosts or receives a link has a verified domain and a paying owner, which is what keeps the network free of disposable sites.

What you see on **Dashboard → Backlinks** depends on where your site stands:

| Access | When it applies | What the page shows |
| --- | --- | --- |
| Paid | The plan is active, or cancelled or past due after at least one paid period, and the site is live on the plan | The full exchange, once the domain is verified |
| Trial | Your subscription is still in its free trial | **Part of the paid plan**, with the date the exchange opens and a **See your plan** link |
| Lapsed | The site took part before and the plan is no longer paid | The exchange read-only, with a **Your plan has lapsed.** banner |
| None | No plan has been started | **Backlinks come with the plan**, with a **Start 7-day free trial** button |

A cancelled plan stays "paid" until the end of the period you already paid for. A failed payment keeps access for a 48-hour grace window, and only for a subscription that was paid at least once. See [Plans and credits](/docs/account/plans-and-credits) for the plan itself.

## How exchange credits work

Exchange credits are a currency, not a swap. A site that hosts a link earns exactly the credits the receiving site paid for it, so credits are conserved across the network.

- **Monthly grant.** Each paid site receives 30 backlink credits per billing period on the Business plan. The grant tops up your balance rather than resetting it, so earned credits carry over.
- **Grant ceiling.** A grant never lifts your balance above three months' worth (90 credits on the Business plan). Credits you earn by hosting are never reduced by this ceiling.
- **Earning.** Your site earns credits when a link it hosts is verified live on your page.
- **Spending.** Your site spends credits when a link to one of your pages is verified live on another member's page.
- **Holding.** When a link to your page is reserved, its price is held from your balance until the link goes live or the reservation ends. The **Credits to spend** card shows your available balance and how many credits are held.
- **No trial grant.** A trialing account gets no exchange credits at all, not a smaller number.

A Studio site's first billing period is prorated from the day the site was added, so its first grant can be smaller than 30. See [Studio](/docs/account/studio).

### Tiers and the price of a link

The price of a link is set by the host site's tier. Rankbox computes an authority score from 0 to 100 for every verified site, using only what it can observe inside Rankbox: how many finished articles the site has, their average SEO score, how long the domain has been verified, and its record of keeping hosted links live. No third-party metric is involved, so the score ranks sites within the network and says nothing about the wider web.

| Tier | Authority score | Credits per link | What the host earns |
| --- | --- | --- | --- |
| T1 | 0 to 34 | 1 | 1 credit |
| T2 | 35 to 59 | 1 | 1 credit |
| T3 | 60 to 79 | 2 | 2 credits |
| T4 | 80 to 100 | 3 | 3 credits |

Your own tier is on the **Your tier** card in the **Overview** tab, with what hosting on your site earns per link and your reputation. Tiers are recalculated each time the exchange's background job runs.

## Why links never go straight back

The exchange never makes a direct swap between two sites. If site B currently carries a link to site A (reserved, placed or live), site A is never matched to host a link back to site B. Links travel one way through the network.

Because of that rule, a trade needs at least three sites. When fewer than three sites are trading, the **The network right now** panel explains that two sites alone can't exchange, and that verifying and opting in now puts you first in the queue.

## Set up the backlink exchange

You need a paid plan and a live site before you start.

1. Open **Dashboard → Backlinks**.
2. Enter the domain you publish to, for example `example.com`, and click **Continue**. Rankbox suggests the domain from your site's website address.
3. Publish the verification token with one of the three methods below, then click **Check now**.
4. Open the **Settings** tab and turn on **Host links in my articles**.
5. In **Settings**, fill in **Niche** and **Topics** under **Your site**, then click **Save**.
6. Open the **Get links** tab, click **Add a target**, fill in the form and click **Add target**.

### Verify your domain

Every site in the exchange proves it controls its domain. Any one of three methods passes, and **Check now** tries all three at once.

| Method | What to publish |
| --- | --- |
| DNS record | A TXT record at `_rankbox.example.com` with the value `rankbox-site-verification=` followed by your token |
| Meta tag | `<meta name="rankbox-site-verification" content="YOUR_TOKEN">` in the head of your home page |
| File | A file at `https://example.com/.well-known/rankbox-verification` containing your token |

The dashboard shows your exact host name, value, tag and file path with copy buttons. DNS changes can take a few minutes to propagate. When a check fails, the message says exactly what Rankbox saw for each method, so you can fix it.

Domains are stored lowercase, without `https://`, `www.` or a path. A domain can be verified by only one Rankbox site across all accounts. If another of your own sites already verified it, the message says so; if another account did, it says the domain is already verified by another Rankbox account.

> [!NOTE]
> **Check now** shares the per-person limit on AI and fetch requests (12 a minute by default), and a site can attempt verification at most 200 times before it needs support.

### Turn on hosting

**Host links in my articles** is off until you switch it on. While it's off, nothing is written into your articles, and your own targets are not matched either: hosting is the price of receiving links.

**Links per article** sets how many exchange links one of your articles may carry: **None**, **One** (the default) or **Up to two**. Separately, a host site carries at most 30 exchange links in any rolling 30 days.

### Describe your site

**Niche** is one short phrase (up to 120 characters), and **Topics** is a list of up to 15 subjects your articles cover. The matcher compares these with every target to decide which pages belong in your articles, and which articles your pages belong in.

### Add targets

A target is a page on your verified domain that you want links pointed at. Each site can have up to 25 targets.

| Field | Rules |
| --- | --- |
| **Page URL** | Must be on your verified domain or one of its subdomains |
| **Anchor texts** | Three to five different phrases, 2 to 80 characters each |
| **Topics** | Up to 10 tags, 2 to 40 characters each, describing what the page is about |
| **Priority** | 1 (lowest) to 10 (highest), default 5. Higher gets matched first among your own targets |
| **New links per month** | A cap of 1 to 10 new links in any rolling 30 days, default 4 |

Each target card shows its status: **Waiting for a relevant host** with the number of days it has waited, the number of links in progress, live links, or **Paused**.

## How a link is matched to an article

Matching happens when Rankbox writes a new article for a host site, either when you write one from the dashboard or when autopilot writes one. Existing articles are never edited to add exchange links. Matching is skipped, and the article is written normally, unless the host site is verified, opted in and on a paid plan.

A target is considered for an article only if all of these hold:

- The receiving site is verified, opted in, on a paid plan, and has a reputation of 50 or more.
- The receiving site has enough credits for the host's tier price.
- The two sites belong to different owners, and neither has blocked the other's domain.
- The receiving site's niche and topics don't fall in a category the host has blocked.
- The receiving site doesn't currently carry a link to the host site.
- The host hasn't linked to the receiving site in the last 180 days.
- The target hasn't reached its **New links per month** cap, and the host hasn't reached its per-article or 30-day limit.

The remaining candidates are scored, and anything below the topical floor is dropped. The floor is a topical-fit score of 0.15: below it, the link is not relevant enough to exist, and no amount of waiting or priority buys it a slot. No match means no link, and no credit moves.

| Factor | Weight | What it rewards |
| --- | --- | --- |
| Topical fit | 0.40 | Overlap between the article's keyword and title and the target's topics, anchors, niche and the receiving site's tracked keywords, plus the overlap between the two sites' niches and topics |
| Waiting time | 0.20 | Targets that have waited longer, up to 30 days, so nobody starves behind better-matched neighbours |
| Tier fit | 0.15 | Sites of similar tiers |
| Novelty | 0.10 | Sites the host has never linked to |
| Priority | 0.10 | The target's **Priority** setting |
| Reputation | 0.05 | Receiving sites with a clean record |
| Recent link | minus 0.30 | Applied to a target that just received a link, fading over about a week |

Rankbox reserves the best candidates up to the host's **Links per article** setting. One article never links to two sites of the same owner.

## Anchor text rules

The anchor text of every exchange link comes from the target's own list of three to five anchors.

- **Rotation.** Each new link uses the anchor that has been used least across the target's active links. Ties go to the earliest anchor in your list.
- **One link, written as a normal citation.** The writer is asked for exactly one link to the target with that anchor, inside a body paragraph where a reader would want the reference. It is never described as a partner, sponsored or exchange link.
- **Where it never goes.** Not in the opening answer, Key Takeaways, the FAQ, the references, a heading or a list item.
- **Repair.** If an editing pass drops the link, Rankbox puts it back: it wraps the anchor phrase where the article already says it, or adds one sentence to the most relevant body paragraph of at least 20 words. If no paragraph qualifies, it gives up rather than forcing the link, and the reservation is cancelled with the credits returned.

## How a placement goes live

A placement is one exchange link from a host article to a target. It moves through these steps:

1. **Reserved.** Before the article is written, Rankbox reserves the match and holds the receiving site's credits.
2. **Placed.** After writing, Rankbox confirms the link is in the article body. If it isn't, or writing fails, the placement is cancelled and the credits are returned. The host now has 30 days to publish the article and have the link verified.
3. **Live URL found.** Rankbox needs the address where the article went live. It comes from your publishing integration reporting it, from a crawl of the host domain's sitemap, or from you clicking **Paste live URL** on the **Give links** tab. The URL must be on the host's verified domain. See [Live URLs and verification](/docs/publishing/live-urls).
4. **Verified.** Rankbox fetches the page and looks for the link. Placed links are re-checked periodically, no more than once every 20 hours, until one check finds the link live or the 30-day window ends.
5. **Settled.** On a live verdict, the held credits become the receiving site's spend and the host site earns the same amount. The placement becomes **Live**.

### What counts as live

The checker fetches the page as `RankboxBot/1.0`, with a 12-second timeout and a 2 MB size limit, and reads the article body: the page with its head, scripts, styles, navigation, header, footer and asides removed.

| Outcome | What Rankbox saw | Counts against the host |
| --- | --- | --- |
| live | The link is in the article body, followed, on an indexable page | No. This is the only verdict that moves credits |
| missing | The page loaded and the link isn't in the body, the link is only in navigation, header or footer, or the page returned 404 or 410 | Yes |
| nofollow | The link carries `rel="nofollow"`, `sponsored` or `ugc` | Yes |
| noindex | The page is marked noindex, or its canonical URL points at another domain | Yes |
| unreachable | Timeout, network error, a 5xx status or another unexpected status | No, Rankbox tries again later |
| blocked | The site answered 403, 429 or 503 | No, Rankbox tries again later |
| truncated | The page was over the size limit, or renders its content with JavaScript so the article couldn't be read | No, Rankbox tries again later |

> [!IMPORTANT]
> A page that only renders with JavaScript, or a bot wall that blocks `RankboxBot`, never produces a live verdict. The placement then expires after 30 days and the receiving site gets its credits back, but you earn nothing. Serve article HTML from the server and let `RankboxBot` through.

## Placement statuses

Every exchange link has one of six statuses. The **Get links** tab shows the links you receive and the **Give links** tab shows the links you host, each with the same labels.

| Status | Dashboard label | What it means | Credits |
| --- | --- | --- | --- |
| reserved | **Reserved** | The match is made and the host article is being written | Held from the receiving site |
| placed | **Placed** | The link is in the article; Rankbox is waiting to see it live | Still held |
| live | **Live** | Verified on the host's page | Spent by the receiving site, earned by the host |
| lost | **Lost** | A live link disappeared and stayed gone, or the host removed it | Taken back from the host, returned to the receiving site |
| expired | **Expired** | Not published and verified within 30 days | Returned to the receiving site |
| cancelled | **Cancelled** | The link couldn't be written, the article failed, was deleted or lost the link before going live, the target was removed, or the host removed the link | Returned to the receiving site |

A reservation that is still open two hours after it was made is cancelled with the reason "the article was never finished". Ended placements show their reason in place of the date.

## When a link disappears

Live links are re-checked periodically: a healthy link no more often than every seven days, and a failing one no more often than every 20 hours. A live link is charged back only on a sustained failure: three failing checks in an unbroken run that spans at least 72 hours. Inconclusive checks (unreachable, blocked, truncated) neither add to nor break a run, and one live verdict clears it.

While a live link is failing, the **Give links** tab shows **Can't see the link** with the count out of 3.

When a link is charged back:

- The placement becomes **Lost**.
- The host site gives back the credits it earned for that link. If it has already spent them, its balance goes to zero; it never goes negative.
- The receiving site gets its credits back.
- The host site's reputation drops by 10 points. Below 40, the site is suspended from the exchange.

Reputation recovers by one point each time the background job runs while the site has lost no hosted link in the last 30 days. A suspended site whose reputation recovers to 60 returns to the pool on its own. Receiving sites need a reputation of 50 or more to be matched.

## Remove a hosted link or a target

**Remove a link you host.** On the **Give links** tab, click **Remove** on the link, then **Remove link**. A reserved or placed link is cancelled and the other member's credits are returned. A live link is a promise already paid for: removing it returns the credits you earned and lowers your reputation by 10, exactly as if the link had vanished. Rankbox also unlinks the anchor in your article and keeps the words.

**Remove a target.** On the **Get links** tab, click **Remove**, then **Remove target**. Links in progress are cancelled and their credits returned. Links already live in other members' articles stay; they can't be taken back. A target with live links is paused instead of deleted, so its history stays.

**Pause a target.** Click **Pause** to stop new matches for a target, and **Resume** to start again.

## Block domains and categories

Blocks are per site and apply in both directions.

- **Categories.** Under **What you won't link to** in **Settings**, tick the categories you never want a link to from your articles: Gambling & betting, Adult content, Crypto & NFTs, Cannabis & CBD, Payday loans & lending, Pharmaceuticals & supplements, Weapons, Tobacco & vaping, Politics, Dating. A category applies to any member whose niche or topics contain its terms.
- **Domains.** Type a domain under **Domains** and click **Block**. A blocked domain is never matched with your site, in either direction. You can also click **Block domain** next to any link on the **Give links** tab.

## Lapsed plans and frozen balances

When a site's plan is no longer paid, the site leaves the matching pool, both as a host and as a receiver.

- Live links stay live, and the site's credits are held, not lost.
- No monthly grant is added while the plan is unpaid.
- The tabs become read-only and **Settings** is hidden.
- Links already in progress continue through verification.
- Live links you host are still re-checked, so removing one still charges it back.

Everything resumes when the plan is paid again.

## Run several sites with Studio

With [Studio](/docs/account/studio), each site has its own domain verification, balance, targets, blocks and settings. Two rules are about you, the owner, rather than a site:

- The exchange never trades between two sites of one owner. That would be a private link network.
- One article never links to two sites of the same owner.

A domain trades from one site only. A Studio site that is removed or archived leaves the pool while your other sites keep trading.

## The Backlinks dashboard at a glance

**Dashboard → Backlinks** has four tabs: **Overview**, **Get links**, **Give links** and **Settings**.

The **Overview** tab shows four cards: **Credits to spend**, **Links pointing at you**, **Links you host** and **Your tier**. Under them, **The network right now** counts only sites you can actually trade with today:

| Stat | Meaning |
| --- | --- |
| **Sites trading** | Verified, opted in and paying |
| **In your niche** | Trading sites that share a term with your niche or topics |
| **Open targets** | Pages waiting for links |
| **Links live** | Exchange links verified on real pages |
| **Verified sites** | Including sites not yet opted in |
| **First link takes** | Median days from a target's creation to its first live link |

When fewer than 30 sites are trading, the panel shows **Early days — matches take longer**.

**Recent activity** lists your last ten credit movements: **Monthly grant**, **Held for a link**, **Link went live**, **Hosted link went live**, **Returned**, **Charged back**, **Bonus** and **Adjustment**.

## Backlink exchange FAQ

### Do I need to do anything to host a link?

No. Once hosting is on, the next article Rankbox writes for your site may carry one link, if the network has a page that genuinely belongs in it. Publish the article as usual and make sure Rankbox learns its live URL.

### Why hasn't my target received a link?

A link needs a host article on a close enough topic, written after your target was added, by a site that passes every rule above. In a small network that can take time. The target card shows how many days it has waited, and waiting time raises its score.

### Can I choose which site links to me?

No. You choose the page, the anchors, the topics and the pace. The matcher chooses the host, and you can block domains and categories you never want.

### Does the exchange guarantee rankings?

No. The exchange places relevant, verified, followed links. What any link does for rankings or AI answers is up to search engines and AI engines.

### What if my CMS adds nofollow to outbound links?

The link fails verification as nofollow. Before it settles, the placement expires after 30 days with no penalty. After it settles, a lasting nofollow is charged back. Make sure links in article bodies stay followed.

### Can I edit an article that carries an exchange link?

Yes. If you delete the link before it goes live, the placement is cancelled and the other member is refunded. If you remove a live link from your page, it is charged back after the failing checks described above.

## Related

- [Live URLs and verification](/docs/publishing/live-urls) — how Rankbox learns where an article went live
- [Plans and credits](/docs/account/plans-and-credits) — the monthly allowances on the paid plan
- [The free trial](/docs/account/free-trial) — what the trial includes and what it doesn't
- [Studio: run several sites](/docs/account/studio) — per-site balances and billing
- [Autopilot and the publishing schedule](/docs/content/autopilot) — the articles that host exchange links
- [Reddit Presence](/docs/growth/reddit-presence) — the other paid-only growth feature
