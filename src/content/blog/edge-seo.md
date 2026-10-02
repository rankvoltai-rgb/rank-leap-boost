---
title: Edge SEO: A Practical Guide to SEO Changes at the CDN
description: Edge SEO in practice: what you can change at the CDN, which platforms run it and what they cost in October 2026, plus governance, rollback and when to skip it.
keyword: edge SEO
date: 2026-11-05
updated: 2026-11-05
written: 2026-10-01
author: Rankbox Team
tags: Technical SEO, SEO
---

Edge SEO is making SEO changes at your CDN instead of in your CMS or codebase. A rule or a small program on the CDN rewrites requests and responses on their way through, so you can ship redirects, headers, canonical fixes, hreflang and markup changes in hours rather than waiting for a release.

That speed is the whole appeal, and also the risk. A change that lives at the edge is invisible to anyone reading the CMS, so edge SEO needs the same ownership, testing and rollback as any production code. This guide covers what you can change, which platforms run it and what they cost as of 1 October 2026, how to govern edge changes, and when not to use them.

If your goal is AI crawlers and agents, read our companion guide to [edge SEO for AI with Cloudflare Workers](/blog/edge-seo-for-ai-cloudflare-workers), which covers Markdown for agents and header injection in depth. For the short definition, see [what edge SEO is](/blog/what-is-edge-seo).

## Key Takeaways

- Edge SEO works best for redirect maps, robots and canonical headers, hreflang, small HTML fixes and SEO split tests.
- Start with no-code rules. Cloudflare's Bulk Redirects hold 10,000 URL redirects on its Free plan, and Transform Rules set headers on every plan.
- Code platforms are cheap at most traffic levels. Three million edge requests a month cost $5.00 in platform fees on Cloudflare Workers Paid and $0.10 on CloudFront Functions, at list prices on 1 October 2026.
- Google's rules still apply at the edge: permanent redirects for moves, 302s for tests, the same content for crawlers and people.
- Every edge change needs an owner, a ticket, a rollback step and an end date. Without them, the edge turns into a second CMS nobody can see.
- Skip the edge when your CMS can make the change in a normal release, or when the change is a permanent part of the site.

## What You Can Change With Edge SEO

Six jobs cover nearly every edge SEO project. Each has a rule from Google that applies whether the change happens at the CDN or the origin.

| Job                      | Edge method                                        | Google's rule to follow                                                                                                                                            |
| ------------------------ | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Redirect maps            | Answer old URLs with 301 or 308 before the origin  | Use ["a permanent server-side redirect whenever possible"](https://developers.google.com/search/docs/crawling-indexing/301-redirects) for moved pages              |
| Hreflang                 | `Link` response headers or `<link>` tags           | HTML, HTTP headers and sitemaps are ["equivalent from Google's perspective"](https://developers.google.com/search/docs/specialty/international/localized-versions) |
| Canonical and meta fixes | Rewrite the tag, or send a canonical `Link` header | Use absolute URLs in the [canonical header](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)                                |
| Robots headers           | `X-Robots-Tag` on PDFs, staging or filtered pages  | Any robots meta rule works [as a header](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)                                              |
| Split tests              | Serve variants on a share of URLs                  | 302s and canonicals, no cloaking, end the test on time                                                                                                             |
| Structured data          | Inject JSON-LD into the HTML                       | The same structured data rules as hand-written markup                                                                                                              |

### Redirect maps after a migration

Redirects are the most common edge SEO job, because migrations break more URLs than any CMS release can fix in time. Keep each old URL one hop from its new home, send 301 or 308 for permanent moves, and keep the map in version control. Our free [redirect generator](/tools/redirect-generator) turns a list of old and new URLs into rules for Cloudflare, Vercel, Netlify, Nginx and others.

### Canonical and hreflang fixes in code

When a CMS prints the wrong canonical or has no way to express hreflang, a few lines at the edge can patch it. This Cloudflare Worker moves canonicals onto the live host and drops their query strings, and adds hreflang `Link` headers to one page. It's for a fictional site, `tallyfold.example`.

```js
// Edge SEO fixes for HTML pages: a canonical repair and hreflang headers.
const SITE = "tallyfold.example";
const HREFLANG = {
  "/pricing": [
    ["en", "/pricing"],
    ["de", "/de/preise"],
    ["x-default", "/pricing"],
  ],
};

export default {
  async fetch(request) {
    const res = await fetch(request);
    if (!(res.headers.get("Content-Type") || "").includes("text/html")) return res;
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, "") || "/";
    const rewritten = new HTMLRewriter()
      .on('link[rel="canonical"]', {
        element(el) {
          const href = new URL(el.getAttribute("href") || path, url);
          href.host = SITE; // the CMS prints its staging host here
          href.protocol = "https:";
          href.search = ""; // and leaks tracking parameters
          el.setAttribute("href", href.href);
        },
      })
      .transform(res);
    const out = new Response(rewritten.body, rewritten);
    for (const [lang, target] of HREFLANG[path] || []) {
      out.headers.append("Link", `<https://${SITE}${target}>; rel="alternate"; hreflang="${lang}"`);
    }
    return out;
  },
};
```

It ran in `wrangler dev --local` (wrangler 4.146.0) in front of a test page. A canonical of `http://staging.tallyfold.example/pricing?utm_source=nav` came back as `https://tallyfold.example/pricing`. The `/pricing` response carried one combined `Link` header with the `en`, `de` and `x-default` alternates, in the format Google documents. A text file passed through unchanged. For bigger hreflang sets, our [hreflang generator](/tools/hreflang-generator) builds the full reciprocal list.

### Split tests at the edge

SEO split tests change a template on half of a group of similar pages and compare their search traffic with the other half. The edge suits them because it can swap a title or a block of copy without a release. Google's [testing guidance](https://developers.google.com/search/docs/crawling-indexing/website-testing) sets four rules: don't show Googlebot different URLs from people ("This is called cloaking"), use `rel="canonical"` on variant URLs, use 302 rather than 301 redirects for tests, and "run the experiment only as long as necessary." Vendors build on this. SearchPilot says it applies tests to your HTML through a proxy, an API or the edge, "so there are no source code changes," with Core pricing listed [from $37,500 a year](https://www.searchpilot.com/pricing) on 1 October 2026.

### Structured data injection

An edge rewrite can append a JSON-LD block to the `<head>`, which helps when a CMS template has no field for it. Because the markup arrives in the server's HTML, crawlers that don't run JavaScript still see it. Generate it with our [schema generator](/tools/schema-generator), keep it true to what the page shows, and test it in Google's Rich Results Test like any other [schema markup](/glossary/schema-markup).

## Edge SEO Platforms and What They Cost

All seven options below run code at the edge. Prices below are list prices from each vendor's site on 1 October 2026, and they change often.

| Platform                  | How code runs                                    | Free allowance                            | Paid entry point                                                                                                              |
| ------------------------- | ------------------------------------------------ | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Cloudflare Workers        | JavaScript on Cloudflare's network               | 100,000 requests a day, 10 ms CPU each    | $5 a month with 10M requests, then $0.30 per million ([pricing](https://developers.cloudflare.com/workers/platform/pricing/)) |
| AWS CloudFront Functions  | Lightweight JavaScript on viewer events          | 2M invocations a month                    | $0.10 per million ([pricing](https://aws.amazon.com/cloudfront/pricing/pay-as-you-go/))                                       |
| AWS Lambda@Edge           | Node.js or Python in regional edge caches        | None listed                               | $0.60 per million requests plus $0.00005001 per GB-second                                                                     |
| Fastly Compute            | Rust, JavaScript or Go starter kits              | 10M requests and 100M vCPU ms a month     | $0.50 per million requests, $0.05 per million vCPU ms ([pricing](https://www.fastly.com/pricing))                             |
| Akamai EdgeWorkers        | JavaScript in three resource tiers               | Free trial                                | Not listed on Akamai's pricing page; quoted by Akamai's sales team                                                            |
| Vercel Routing Middleware | Node.js before Vercel's cache                    | Hobby: 1M invocations, 4 hours Active CPU | Pro $20 a month per seat; from $0.60 per million invocations ([pricing](https://vercel.com/pricing))                          |
| Netlify Edge Functions    | TypeScript or JavaScript on a Deno-based runtime | Free plan: 300 credits a month            | Personal $9, Pro $20 a month; counted as web requests at 2 credits per 10,000 ([pricing](https://www.netlify.com/pricing/))   |

A few notes from each vendor's own docs:

- **Cloudflare** also sells the plan underneath: Pro is $20 a month billed annually or $25 monthly, Business $200 or $250, per its [plans page](https://www.cloudflare.com/plans/).
- **AWS** says CloudFront Functions suit "header manipulation" and "URL redirects or rewrites," and [points to Lambda@Edge](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/edge-functions-choosing.html) for work that needs network access, more memory or the request body. CloudFront's flat-rate plans ($0, $15, $200 and $1,000 a month per distribution) include serverless edge compute.
- **Akamai** caps CPU per event handler at 10, 20 or 70 ms across its Basic, Dynamic and Enterprise Compute [tiers](https://techdocs.akamai.com/edgeworkers/docs/resource-tier-limitations), and needs a delivery product such as Ion underneath.
- **Vercel** says its [Routing Middleware](https://vercel.com/docs/routing-middleware) "runs globally before the cache," and recommends static `vercel.json` rules for plain redirects and headers.
- **Netlify** says edge functions ["don't contribute to the compute usage metric"](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/); they're counted as web requests.

### What 3 million edge requests a month cost

To compare like with like, here is one workload at list prices: 3 million HTML requests a month, each running a 5 ms function. Delivery and bandwidth are billed separately everywhere and left out.

| Platform                | Arithmetic                                                  | Monthly cost                                                          |
| ----------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------- |
| Cloudflare Workers Paid | 3M is inside the 10M included                               | $5.00 (the Free plan's 100,000 a day caps out at exactly this volume) |
| CloudFront Functions    | (3M − 2M free) × $0.10 per million                          | $0.10                                                                 |
| Lambda@Edge, 128 MB     | 3 × $0.60, plus 15,000 seconds × $0.00000625125             | About $1.89                                                           |
| Fastly Compute          | 3M requests and 15M vCPU ms, both inside the free allowance | $0.00                                                                 |
| Vercel Pro              | 3 × $0.60 in invocations, before CPU time                   | About $1.80, against Pro's $20 monthly credit                         |

The cheapest line isn't the right choice on its own. Pick the platform your site already runs on, because moving a CDN to save a few dollars costs far more in risk.

## Rules Before Code: No-Code Edge SEO

Most edge SEO doesn't need a program. Rules are faster to review, harder to break and easier for a non-developer to read. On Cloudflare, as of 1 October 2026:

- **Single Redirects** allow 10 rules on Free, 25 on Pro, 50 on Business and 300 on Enterprise, with regex from Business up ([docs](https://developers.cloudflare.com/rules/url-forwarding/)).
- **Bulk Redirects** hold 10,000 URL redirects on Free, 25,000 on Pro and 50,000 on Business.
- **Transform Rules** add or change headers, with the same 10, 25, 50 and 300 rule limits ([docs](https://developers.cloudflare.com/rules/transform/)).

Vercel's `vercel.json` rules do similar jobs. Reach for code only when the logic needs it, such as rewriting HTML or choosing a response by request header.

## Governance: Who Owns Edge SEO Changes

Edge changes fail quietly. A developer reading the CMS won't see them, and a redesign can collide with them. Dan Taylor, who [is credited with coining the term](https://searchengineland.com/edge-seo-447510), warns that skipping the codebase "doesn't mean that it should bypass the development/engineering team."

### The Edge Change Ticket

Open one ticket per change, with nine fields, before anything ships:

1. **What changes:** the exact rule or code, linked to version control.
2. **Why:** the SEO problem, with a sample URL.
3. **Owner:** one named person who answers for it.
4. **Scope:** the routes or URL patterns it runs on, and nothing wider.
5. **Google rule cited:** the doc that says this change is allowed.
6. **Test:** the `curl` command or tool that proves it works, run before and after.
7. **Rollback:** the exact step, such as `wrangler rollback` or disabling a rule.
8. **Logging:** where you'll see errors and hits.
9. **End date:** when the fix moves into the CMS or code, or gets reviewed again.

The end date matters most. Edge fixes are meant as a bridge. Each one left in place for years becomes logic your developers don't know exists.

### Logging and rollback

Keep edge code in the same repository as the site, deploy it through the same review, and make sure you can see its logs. On Cloudflare, `wrangler rollback` restores one of the last 100 Worker versions at once, per its [rollback docs](https://developers.cloudflare.com/workers/configuration/versions-and-deployments/rollbacks/). Test rule changes on a staging host first, and add a response header such as `X-Edge-Rule` so anyone can see which rule touched a page.

Watch firewall and bot rules too. They run at the same layer, and a careless one can block the crawlers your SEO work is for; our [Cloudflare challenge trap guide](/blog/cloudflare-challenge-trap) covers that failure.

## When Not to Use Edge SEO

| Situation                                          | Use the edge?         | Why                                            |
| -------------------------------------------------- | --------------------- | ---------------------------------------------- |
| A migration is live and old URLs 404 today         | Yes                   | Fixes ship in minutes                          |
| Your CMS offers no way to set hreflang or a header | Yes, with an end date | Bridge until the CMS can                       |
| A one-off canonical bug the next release fixes     | Maybe                 | Only if the release is weeks away              |
| Rewriting page copy or prices                      | No                    | Writers never see or edit it, and drift starts |
| Showing crawlers content people don't see          | Never                 | Google calls it cloaking                       |
| A permanent site structure, such as URL patterns   | No                    | Build it into the code                         |
| Nobody can read the edge logs                      | No                    | You won't see it break                         |

Edge SEO is a tool for speed, not a place to keep your site. If a change will outlive the next redesign, put it in the code.

## Where Rankbox Fits

Rankbox doesn't run a CDN or edge rules, and it doesn't change redirects, headers or robots.txt for you. It works on the content those fixes point at: its [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes source-backed articles that a developer wires into your site through the Rankbox API. The Business plan is $49.50 a month; see [pricing](/pricing). The redirect, hreflang and schema tools linked above are free.

## Frequently Asked Questions

### What is edge SEO used for?

Edge SEO is used to ship SEO fixes at the CDN when the CMS or release cycle is too slow. Common jobs are redirect maps after a migration, hreflang and canonical headers, `X-Robots-Tag` rules, small HTML fixes, structured data injection and SEO split tests.

### Is edge SEO safe for Google rankings?

Yes, if you follow the same rules as any server change. Use permanent redirects for moves, 302s for tests, absolute canonical URLs, and show Googlebot the same content people see. Google's testing guidance says cloaking breaks its spam policies "whether you're running a test or not."

### Which CDN is best for edge SEO?

The one your site already uses. Cloudflare, Fastly, Akamai, AWS CloudFront, Vercel and Netlify all run code before the response reaches the visitor. Moving CDNs for an SEO fix adds more risk than any price gap saves.

### Does edge SEO slow a site down?

Usually by very little. Dan Taylor reported an average of about 10 ms added in his tests, rising to 50 ms in rare cases. Heavy HTML rewriting costs more than adding a header, so measure time to first byte before and after.

### Do I need a developer for edge SEO?

For rules, often not: redirects and headers can be set in a dashboard. For code such as Workers, yes. Either way, involve your developers, since edge changes affect the live site and should go through the same review as other code.

### How much does edge SEO cost?

Often little or nothing in platform fees. As of 1 October 2026, Cloudflare Workers has a free tier of 100,000 requests a day and a $5 Paid plan, and CloudFront Functions costs $0.10 per million invocations after 2 million free. The bigger cost is engineering time.

## References

1. [Redirects and Google Search, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/301-redirects)
2. [Tell Google about localized versions of your page, Google Search Central](https://developers.google.com/search/docs/specialty/international/localized-versions)
3. [How to specify a canonical URL, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
4. [Robots meta tag and X-Robots-Tag, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
5. [Minimize A/B testing impact in Google Search, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/website-testing)
6. [Workers pricing, Cloudflare Docs](https://developers.cloudflare.com/workers/platform/pricing/)
7. [URL forwarding availability, Cloudflare Rules Docs](https://developers.cloudflare.com/rules/url-forwarding/)
8. [Amazon CloudFront pay-as-you-go pricing, AWS](https://aws.amazon.com/cloudfront/pricing/pay-as-you-go/)
9. [Differences between CloudFront Functions and Lambda@Edge, AWS Docs](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/edge-functions-choosing.html)
10. [Fastly pricing, Fastly](https://www.fastly.com/pricing)
11. [EdgeWorkers resource tier limitations, Akamai TechDocs](https://techdocs.akamai.com/edgeworkers/docs/resource-tier-limitations)
12. [Routing Middleware, Vercel Docs](https://vercel.com/docs/routing-middleware)
13. [How credits work, Netlify Docs](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/)
14. [What is edge SEO?, Search Engine Land](https://searchengineland.com/edge-seo-447510)
15. [SearchPilot pricing, SearchPilot](https://www.searchpilot.com/pricing)
