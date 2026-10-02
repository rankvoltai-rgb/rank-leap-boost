---
title: Is Substack Good for SEO? What Google Indexes and What You Give Up
description: Is Substack good for SEO? What Google can crawl on a Substack, how custom domains and cross-posts affect rankings, and what you give up in control.
keyword: Substack good for SEO
date: 2026-10-22
updated: 2026-10-22
written: 2026-09-30
author: Rankbox Team
tags: SEO, Content Strategy
---

Yes, for getting your own writing indexed and found under your name. Less so if you want it to grow search traffic for a company website. Is Substack good for SEO in practice? Its post pages are plain, crawlable HTML that Google can read by default, each with its own canonical tag and article markup. What you give up is control: over templates, structured data, site structure and, unless you pay for a custom domain, the domain itself.

That's why "is Substack good for SEO" has two answers. A writer building a personal audience gets clean, fast pages with no plugins to manage. A company with a blog it wants to rank gets a second site that competes with the first if the same posts appear on both.

This answer covers what Google can see on a Substack, whose domain earns the links, how to cross-post without splitting rankings, what you give up, and a fit check for your situation. The AI search angle, including whether a newsletter can help AI engines learn about your brand, is in our guide to [the Substack arbitrage for AI search](/blog/substack-arbitrage-llm-knowledge).

## Key Takeaways

- Is Substack good for SEO? For posts under a writer's name, yes: pages are crawlable by default and ship a self-referencing canonical plus `NewsArticle` markup.
- Substack says sitemaps and Search Console verification "become available as your publication grows," so a brand-new publication starts with less.
- A custom domain costs a one-time $50 and puts the links on your domain. Old Substack URLs were seen redirecting to the custom domain with a 301.
- Don't run the same full post on your site and on Substack. Google advises blocking indexing of syndicated copies, and Substack posts point their canonical at themselves.
- You give up custom HTML and CSS, your own structured data and most control over site structure. You keep your posts and your list, which Substack lets you export.

## What Google Can Index on a Substack Publication

Start with what a crawler actually meets when it visits a Substack.

### The crawl rules

Every Substack publication serves the same basic robots.txt rules. On 30 September 2026, [substack.com/robots.txt](https://substack.com/robots.txt) blocked one backlink crawler, BLEXBot, and kept all bots out of utility paths such as `/subscribe`, `/sign-in`, `/embed` and individual comment pages (`/p/*/comment/*`). Posts, the archive, tag pages and the About page stay open. You can check your own with our [robots.txt tester](/tools/robots-txt-tester).

One setting changes the file. "Tell AI tools not to train their models on your content," under Settings, then Privacy, adds blocks for AI training bots. It leaves Googlebot alone, so it doesn't affect Google Search.

### What each post page tells Google

Three post pages checked on 30 September 2026, two on substack.com subdomains and one on a custom domain, all had the same basics:

1. A `<title>` taken from the post title.
2. A [canonical tag](/glossary/canonical-tag) pointing at the post's own URL.
3. A meta description, which on two posts matched the subtitle and on the third was custom text.
4. `NewsArticle` and `BreadcrumbList` [structured data](/glossary/schema-markup) with the headline, author, and published and modified dates.

That's a solid default, and it's most of what makes Substack good for SEO. Many company blogs ship less.

### Sitemaps and Search Console come later

Substack's [SEO help article](https://support.substack.com/hc/en-us/articles/4407702258836-How-can-I-optimize-my-Substack-publication-for-SEO), updated 24 September 2026, says: "Some SEO features, such as sitemaps and Google Search Console verification, become available as your publication grows; publishing regularly, growing your subscriber list, and enabling paid subscriptions all help unlock them."

The robots.txt files reflect that. Established publications list a `sitemap.xml` and a `news_sitemap.xml`. Several small, unknown subdomains checked the same day listed none. Without an [XML sitemap](/glossary/xml-sitemap), Google still finds posts through links and the archive page, just with fewer hints.

### Private publications

If you make a publication private, Substack says its [Welcome page may still appear in search](https://support.substack.com/hc/en-us/articles/360044389731-Can-I-make-a-private-Substack-publication), but posts won't be indexed.

## Whose Domain Earns the Links: Subdomain or Custom Domain

Substack's help center tells writers the [best way to improve rankings](https://support.substack.com/hc/en-us/articles/4407702258836-How-can-I-optimize-my-Substack-publication-for-SEO) is "to get more inbound links." Where those links point decides who keeps their value.

| Question              | yourname.substack.com                                | Custom domain                                                                                                                                                  |
| --------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cost                  | Free                                                 | One-time $50 ([Substack pricing](https://support.substack.com/hc/en-us/articles/360037607131-How-much-does-Substack-cost))                                     |
| Where links accrue    | Your subdomain of substack.com                       | Your own domain                                                                                                                                                |
| Format                | Any available subdomain, 4 to 32 letters and numbers | Must use a subdomain such as `www` or `newsletter`; a root-domain redirect is available                                                                        |
| If you leave Substack | Links keep pointing at the substack.com address      | You point the domain at your next platform                                                                                                                     |
| Email sender          | `@substack.com`                                      | Still `@substack.com`, per the [custom domain guide](https://support.substack.com/hc/en-us/articles/360051222571-How-do-I-set-up-my-custom-domain-on-Substack) |

The switch looks safe for existing links. On 30 September 2026, requests to `noahpinion.substack.com/p/some-post-slug-test` returned a 301 redirect to the same path on `www.noahpinion.blog`, and the old subdomains of three other publications redirected to their custom domains. The custom domain articles in Substack's help center don't describe this redirect, so test your own after switching.

If the newsletter is part of a company's marketing, a custom subdomain such as `newsletter.yourcompany.com` keeps the links on the company's domain. That's the durable choice.

## Cross-Posting Without Splitting Your Rankings

Cross-posting is where a Substack good for SEO on its own can hurt your main site. Publishing a post on your blog and again on Substack creates two pages with the same text. Google then chooses one to show, and it may not choose the one you want.

### What Google advises

Google's canonical documentation says that when you [don't state a preferred URL](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), "Google will identify which version of the URL is objectively the best version to show to users in Search." For copies on other sites, its [troubleshooting guide](https://developers.google.com/search/docs/crawling-indexing/canonicalization-troubleshooting) recommends that the copy be blocked from indexing, not pointed back with a canonical tag.

Substack's help center documents no field for a canonical to another site or a `noindex` on one post, and the pages checked all pointed at themselves. So the fix is editorial, not technical.

### Pick one home for each piece

| Your situation                       | Put the full text on                                                                                                                                                                | Put this on the other home                |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| You already have a company blog      | The blog                                                                                                                                                                            | A shorter issue with your take and a link |
| You're a writer with no other site   | Substack                                                                                                                                                                            | Nothing, or a link from your profiles     |
| You're moving an archive to Substack | Substack, after [importing](https://support.substack.com/hc/en-us/articles/360037830351-How-do-I-import-my-posts-from-another-platform-such-as-Mailchimp-WordPress-Medium-or-Ghost) | Redirect or remove the old copies         |
| Another site wants to republish you  | Your home                                                                                                                                                                           | Ask them to add `noindex` to their copy   |

## What You Give Up by Publishing on Substack

What makes Substack good for SEO for a writer also limits a company. Here is the cost side, in Substack's own words where it has them.

### Templates and code

Substack says: ["We do not currently support custom CSS or HTML in the post editor,"](https://support.substack.com/hc/en-us/articles/360037463152-Can-I-edit-the-CSS-or-HTML-on-Substack) including raw iframe embeds. The [theme editor](https://support.substack.com/hc/en-us/articles/360055169471-How-do-I-set-a-custom-theme-for-my-Substack) covers colors, fonts, logos and header layout. Without custom code, landing pages, pricing tables and comparison layouts are limited to what the editor offers.

### Structured data

You get `NewsArticle` markup automatically. Substack's help center documents no way to add your own types, such as `Organization`, `Product` or `SoftwareApplication`. The recipe card is the one exception it documents: its [metadata "can help with SEO."](https://support.substack.com/hc/en-us/articles/46107942987284-How-can-I-add-recipes-to-a-post-on-Substack)

### Site structure and internal links

You can organize posts with [tags](https://support.substack.com/hc/en-us/articles/15325400348948-How-do-I-add-tags-to-Substack-posts), which get pages at `/t/tagname`, and with sections at `/s/section-name`. Beyond that, [internal linking](/glossary/internal-linking) happens inside post text. Tag and section pages list posts, but they aren't the editable topic hubs a company site uses to rank for a cluster of related searches.

### The domain, but not your list

On a substack.com subdomain, the address isn't yours. Your content and subscribers are, though. Substack's [export tool](https://support.substack.com/hc/en-us/articles/360037466012-How-do-I-export-my-posts) gives you posts, the subscriber list and stats in one zip file.

### A content rule

Substack's [content guidelines](https://substack.com/content), updated 29 September 2026, don't allow publications whose primary purpose is to "enhance search engine optimization" or to drive traffic to outside sites. A newsletter has to earn its readers. Using it as a link farm for your company breaks the rules.

## When Is Substack Good for SEO? The Substack Fit Check

The fit check turns "is Substack good for SEO" into six questions about you. Answer each row. Three or more "good fit" answers mean Substack is a sound home for the writing. Three or more "poor fit" answers mean it belongs on your own site, with Substack as a companion at most.

| Situation                                              | Good fit                     | Poor fit                      |
| ------------------------------------------------------ | ---------------------------- | ----------------------------- |
| Whose name should people search for?                   | Yours, as a writer           | The company's product         |
| Do you need landing, pricing or product pages to rank? | No                           | Yes                           |
| Do you already have a blog that ranks?                 | No                           | Yes                           |
| Can you publish on a steady schedule?                  | Yes, at least twice a month  | Rarely                        |
| Is the list itself the goal?                           | Yes, subscribers matter most | No, you need visits to a site |
| Will you pay $50 for a custom domain?                  | Yes, or the name is personal | No, and the brand matters     |

### Worked example: Tallyfold's founder

Tallyfold is a fictional invoicing app for agencies. Its founder wants to write about agency cash flow and wants the company blog to rank for product searches.

Her answers: the name to search is hers (good fit), product pages must rank (poor fit), the company blog already ranks (poor fit), she can publish twice a month (good fit), the list matters (good fit), and she'll pay for `newsletter.tallyfold.example` (good fit). That's four good and two poor.

The verdict splits the work. Product and comparison pages stay on the company site. Her essays go on Substack, on the company subdomain, with no post copied between the two. For her, the answer to "is Substack good for SEO" is yes for essays and no for product pages. Our [Substack SEO settings guide](/blog/substack-seo) walks through the setup.

## Where Rankbox Fits

Rankbox doesn't publish to Substack and doesn't run a newsletter. It's built for the other half of the split: the pages that should live on your own site. The [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes 2,000 to 3,500-word source-backed articles, and [Answer-Space Research](/features/answer-space-research) finds the questions your buyers ask. Articles reach your site through Rankbox's API. The Business plan is $49.50 a month with a 7-day trial. [See pricing](/pricing).

## Frequently Asked Questions

### Is Substack good for SEO compared with WordPress?

Substack is simpler and WordPress gives more control. Substack ships crawlable pages, a self-referencing canonical and article markup with no plugins. WordPress lets you add any structured data, templates and landing pages. For a writer, Substack's defaults are enough. For a business that needs product pages to rank, a site you control is the better base.

### Do Substack posts show up on Google?

Yes. Substack's robots.txt lets Googlebot crawl posts, and each post page has a title, description, canonical tag and article markup. New publications may not get a sitemap or Search Console verification until they grow, so early posts are found mainly through links.

### Is Substack good for SEO if I use a custom domain?

Yes, and it's the better option for a brand. A custom domain costs $50 once and puts inbound links on your own domain, so you keep them if you ever move platforms. Substack requires a subdomain such as www or newsletter, and offers a redirect for the root domain.

### Should I cross-post my blog articles to Substack?

Not in full. Two copies of the same post make Google choose between them, and Substack posts point their canonical tag at themselves. Keep the full article in one place and send a shorter issue with a link to it.

### Is Substack good for SEO for a brand-new newsletter?

Partly. Posts are crawlable from day one, but Substack says sitemaps and Search Console verification unlock as a publication grows. Early on, Google finds posts mainly through links, so share each post and get other sites to link to it. Domain authority scores from SEO tools won't rank a new post by themselves.

### Can I noindex a single Substack post?

Substack's help center doesn't document a per-post noindex setting. The documented privacy option is making the whole publication private, which keeps posts out of search while the Welcome page may still appear.

## References

1. [How can I optimize my Substack publication for SEO?, Substack Help Center](https://support.substack.com/hc/en-us/articles/4407702258836-How-can-I-optimize-my-Substack-publication-for-SEO)
2. [How do I set up my custom domain on Substack?, Substack Help Center](https://support.substack.com/hc/en-us/articles/360051222571-How-do-I-set-up-my-custom-domain-on-Substack)
3. [How much does Substack cost?, Substack Help Center](https://support.substack.com/hc/en-us/articles/360037607131-How-much-does-Substack-cost)
4. [Can I edit the CSS or HTML on Substack?, Substack Help Center](https://support.substack.com/hc/en-us/articles/360037463152-Can-I-edit-the-CSS-or-HTML-on-Substack)
5. [Can I make a private Substack publication?, Substack Help Center](https://support.substack.com/hc/en-us/articles/360044389731-Can-I-make-a-private-Substack-publication)
6. [How do I export my posts?, Substack Help Center](https://support.substack.com/hc/en-us/articles/360037466012-How-do-I-export-my-posts)
7. [How do I add tags to Substack posts?, Substack Help Center](https://support.substack.com/hc/en-us/articles/15325400348948-How-do-I-add-tags-to-Substack-posts)
8. [Content Guidelines, Substack](https://substack.com/content)
9. [Substack robots.txt, checked 30 September 2026](https://substack.com/robots.txt)
10. [How to specify a canonical URL, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
11. [Canonicalization troubleshooting, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/canonicalization-troubleshooting)
