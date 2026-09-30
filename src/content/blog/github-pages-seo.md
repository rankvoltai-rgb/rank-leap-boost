---
title: GitHub Pages SEO: A Setup Guide for Project Sites and Docs
description: GitHub Pages SEO setup: custom domain and HTTPS, sitemaps and canonical tags, robots.txt for project sites, Search Console, 404 pages and usage limits.
keyword: GitHub Pages SEO
date: 2026-10-29
updated: 2026-10-29
written: 2026-09-30
author: Rankbox Team
tags: Technical SEO, Developer Marketing
---

GitHub Pages SEO works like SEO for any static site, with four catches specific to GitHub. Put the site on a custom domain you've verified, generate a sitemap and canonical tags at build time, remember that a project site's robots.txt has to live in your `<owner>.github.io` repo, and stay inside GitHub's usage rules. Get those right and Google can crawl, index and rank a Pages site like any other.

Most GitHub Pages SEO guides stop at "add jekyll-seo-tag." That plugin helps, but it won't fix a robots.txt in the wrong folder or a docs site that Google sees on two hostnames. This guide walks through each setting in the order you'd set it, using GitHub's own docs as of September 2026.

It's the hosting half of a bigger topic. For why a docs site and a well-written repo help developer tools show up in AI answers, read our guide to [GitHub READMEs as AI SEO fuel](/blog/github-readme-ai-seo). For the repo itself, see [GitHub SEO for repositories](/blog/github-seo).

## Key Takeaways

- GitHub Pages SEO starts with the host. A project site lives at `<owner>.github.io/<repo>`, and Google only reads robots.txt at the root of a host. So its robots.txt must come from the `<owner>.github.io` repo or a custom domain.
- GitHub's Jekyll build supports jekyll-sitemap 1.4.0 and jekyll-seo-tag 2.8.0 (github-pages gem 232), but only when they're listed under `plugins` in `_config.yml`.
- GitHub now recommends GitHub Actions for deploying Pages, and custom workflows skip the 10-builds-per-hour soft limit.
- Pages has no server-side redirects you can configure. jekyll-redirect-from writes instant meta refresh pages, which Google treats as permanent redirects.
- A Search Console Domain property needs DNS access, so a plain `github.io` site uses a URL-prefix property instead.
- GitHub bars Pages from running an online business, e-commerce or commercial SaaS. Docs, project and personal sites fit.

## Pick the Site Type and Domain First

Every later GitHub Pages SEO setting depends on two choices: which kind of Pages site you run, and whether it has its own domain. GitHub's [overview](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages) describes two kinds of site.

| Question                   | User or org site          | Project site                        | Project site on a custom domain |
| -------------------------- | ------------------------- | ----------------------------------- | ------------------------------- |
| Source repo                | Named `<owner>.github.io` | Any repo                            | Any repo                        |
| Default address            | `<owner>.github.io`       | `<owner>.github.io/<repo>`          | `docs.example.com`              |
| Where robots.txt must live | That site's root          | The `<owner>.github.io` repo        | The project site's build root   |
| Search Console property    | URL prefix                | URL prefix with the `/<repo>/` path | Domain or URL prefix            |
| Best for                   | A personal or company hub | Quick demos                         | Docs you want to rank           |

The last column is where most docs sites should end up. On a custom domain the site is a host of its own, so its robots.txt, sitemap and Search Console data all belong to it.

### Set up a custom domain the safe way

GitHub [recommends](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages) verifying a custom domain before adding it to a repo, to prevent takeovers. Verification uses a DNS TXT record and covers the domain's immediate subdomains. GitHub also warns against wildcard DNS records like `*.example.com`, which leave you open to takeovers even after you verify.

Then point DNS at GitHub. For an apex domain, GitHub's [DNS docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) list four A records, `185.199.108.153` through `185.199.111.153`, and matching AAAA records. For a subdomain like `docs.example.com`, use a CNAME record to `<owner>.github.io`.

Two details help SEO directly:

- **One hostname wins.** If you set up DNS for both the apex and `www`, GitHub redirects one to the other automatically. GitHub recommends using a `www` subdomain even if you also use the apex.
- **The old address redirects.** In live checks on 30 September 2026, `github.github.io/choosealicense.com/` returned a 301 to `choosealicense.com`. Your `github.io` URL hands its signals to the custom domain instead of competing with it.

### Turn on HTTPS

GitHub says every Pages site supports HTTPS, and `github.io` sites created after 15 June 2016 get it automatically. For a custom domain, GitHub requests a Let's Encrypt certificate after its DNS check passes. Then tick **Enforce HTTPS** under Settings, Pages, per the [HTTPS docs](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https). Fix any `http://` asset links, or browsers will flag mixed content.

## Set Up the Build: Jekyll or GitHub Actions

Your build route decides how much GitHub Pages SEO you get without extra work. GitHub Pages builds with Jekyll by default, but GitHub's [Jekyll docs](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll) now say "GitHub Actions is now the recommended approach for deploying and automating GitHub Pages sites." You have two routes.

1. **Deploy from a branch.** Push to a branch, and GitHub builds the root or `/docs` folder with Jekyll. It's the least setup, and it's limited to the plugins GitHub supports.
2. **Deploy with a custom workflow.** A GitHub Actions workflow builds with any static site generator you like and uploads the result. GitHub offers workflow templates for common setups, and custom workflows aren't bound by the 10-builds-per-hour soft limit.

### Jekyll plugins that handle GitHub Pages SEO

GitHub's [dependency versions page](https://pages.github.com/versions/) listed these on 30 September 2026: Jekyll 3.10.0, the github-pages gem 232, jekyll-sitemap 1.4.0, jekyll-seo-tag 2.8.0 and jekyll-redirect-from 0.16.0. A minimal `_config.yml` for GitHub Pages SEO looks like this:

```yaml
url: "https://docs.example.com"
title: "invoice-sdk docs"
description: "Guides and API reference for the invoice-sdk Node.js library."
plugins:
  - jekyll-sitemap
  - jekyll-seo-tag
  - jekyll-redirect-from
social:
  links:
    - https://github.com/your-org/invoice-sdk
webmaster_verifications:
  google: your-search-console-token
```

List plugins under `plugins`. The jekyll-sitemap README warns that the GitHub Pages gem "ignores all plugins included in the Gemfile," so a plugin listed only there does nothing. Add `{% seo %}` to your layout's `<head>`.

Per its [docs](https://github.com/jekyll/jekyll-seo-tag/tree/master/docs), jekyll-seo-tag then writes the page title, meta description, canonical URL, Open Graph and Twitter tags, and JSON-LD. The `social.links` list names your official profiles, such as the repo, and `webmaster_verifications` adds verification meta tags for Google and Bing.

## GitHub Pages SEO Basics: Sitemaps, Canonicals and robots.txt

This is where most GitHub Pages SEO problems start, because the rules depend on the site type from the table above.

### Sitemaps

jekyll-sitemap writes a `sitemap.xml` for every build. It sets `<lastmod>` from a `last_modified_at` date in front matter, or from the post date. The plugin that reads file modification dates "is not compatible with GitHub Pages auto building," so add `last_modified_at` by hand when you update a guide. Leave a page out with `sitemap: false`.

Google's [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) says a sitemap affects only URLs under its own folder unless you submit it through Search Console. A project site's `/<repo>/sitemap.xml` covers `/<repo>/` pages, which is what you want. Submit it in Search Console anyway.

### robots.txt

Google is clear that robots.txt "must be located at the root of the site host to which it applies" and "cannot be placed in a subdirectory," per its [robots.txt guide](https://developers.google.com/search/docs/crawling-indexing/robots/create-robots-txt). For a project site at `<owner>.github.io/<repo>`, the host root is `<owner>.github.io`. A robots.txt inside the project repo is served at `/<repo>/robots.txt`, and crawlers ignore it.

- **On a custom domain,** put robots.txt in the project's build output. If you don't add one, jekyll-sitemap's source shows it creates a robots.txt with a single `Sitemap:` line.
- **On a `github.io` project site,** edit the robots.txt in your `<owner>.github.io` repo, or skip robots.txt and use meta robots tags on the pages you want kept out.

In checks on 30 September 2026, `microsoft.github.io/robots.txt` and `octocat.github.io/robots.txt` both returned 404, which crawlers read as "no rules." To decide which AI bots to allow, see our [AI crawler directory](/blog/ai-crawler-directory) and the [robots.txt tester](/tools/robots-txt-tester).

### Canonicals

jekyll-seo-tag builds the [canonical tag](/glossary/canonical-tag) from your `url` setting, and a page can override it with `canonical_url` in its front matter. Set `url` to your final custom domain with `https://`. Otherwise canonicals may point at an address that now redirects.

### Redirects

Redirects are the weakest part of GitHub Pages SEO. GitHub's Pages docs don't describe custom server redirects or response headers. For moved pages, jekyll-redirect-from writes small HTML pages with a meta refresh. Google [says](https://developers.google.com/search/docs/crawling-indexing/301-redirects) it "interprets instant meta refresh redirects as permanent redirects," so a zero-second refresh works as a 301 for Google. For the same reason, use meta robots tags rather than an `X-Robots-Tag` header.

## Verify the Site in Search Console

Search Console is where you find out whether your GitHub Pages SEO setup works. Google's [property guide](https://support.google.com/webmasters/answer/34592) says a Domain property needs DNS verification. That works only with a custom domain, since you don't control DNS for `github.io`.

1. **Custom domain:** add a Domain property and verify with a DNS TXT record. It covers every subdomain and protocol.
2. **`github.io` project site:** add a URL-prefix property for `https://<owner>.github.io/<repo>/`. Verify with the HTML tag (jekyll-seo-tag's `webmaster_verifications` adds it) or by uploading Google's HTML file to the site.
3. **Submit the sitemap** under Sitemaps, then use URL Inspection on your home page and one guide to confirm Google can fetch them.

Google's [verification help](https://support.google.com/webmasters/answer/9008080) notes the HTML file must be reachable without a login, and removing it loses verification. Keep it in the repo. Our guide to [Bing Webmaster Tools for SEO](/blog/how-to-use-bing-webmaster-tools-for-seo) covers adding the site to Bing as well.

## 404 Pages, Limits and Rules

### Custom 404 pages

Add a `404.html` or a `404.md` with `permalink: /404.html` front matter, per GitHub's [404 docs](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site). In checks on 30 September 2026, jekyllrb.com, which GitHub Pages serves, returned its custom 404 page with an HTTP 404 status. Search engines won't mistake the page for real content. Link your docs home and search from it.

### Usage limits and what Pages is for

These limits rarely touch GitHub Pages SEO for a docs site, but know them. GitHub's [limits page](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits), as of September 2026:

- Published sites may be no larger than 1 GB, and source repos have a recommended limit of 1 GB.
- Deployments time out after 10 minutes.
- Sites have a soft bandwidth limit of 100 GB a month and a soft limit of 10 builds an hour, except with custom Actions workflows.
- Heavy traffic may get HTTP 429 responses.

GitHub also says Pages isn't for running "your online business, e-commerce site," or "commercial software as a service (SaaS)." A docs site for an SDK, an open-source project site or a personal portfolio fits. Your product's marketing site and app belong on other hosting.

GitHub warns that Pages sites are public even when the repo is private, so strip anything sensitive before you publish. Live responses showed `cache-control: max-age=600`, so visitors may see updates up to 10 minutes late.

### Stay clear of spam policies

Google's spam policies list "spammy accounts on hosting services that anyone can register for" as user-generated spam, and [scaled content abuse](/glossary/scaled-content-abuse) covers many thin pages made to rank. Dozens of near-empty `github.io` sites built to catch keywords fit both. One real docs site doesn't.

## Worked Example: Tallyfold's SDK Docs Site

Tallyfold is a made-up invoicing app for agencies with an open-source `invoice-sdk`. Its docs started as a project site at `tallyfold.github.io/invoice-sdk` with a robots.txt in the project repo, no sitemap and no Search Console property. Here is its GitHub Pages SEO launch checklist, with the check for each step.

| Step | Setting                                                           | How Tallyfold checked it                                         | Result |
| ---- | ----------------------------------------------------------------- | ---------------------------------------------------------------- | ------ |
| 1    | Verify `docs.tallyfold.example` for the org, then add it in Pages | Green check beside the domain                                    | Done   |
| 2    | CNAME `docs` to `tallyfold.github.io`                             | `dig docs.tallyfold.example`                                     | Done   |
| 3    | Enforce HTTPS                                                     | `curl -I http://...` returns 301 to https                        | Done   |
| 4    | `url`, plugins and `{% seo %}` in `_config.yml` and layout        | View source: canonical and JSON-LD present                       | Done   |
| 5    | robots.txt moved into the build output, sitemap line included     | `/robots.txt` returns 200 on the new host                        | Done   |
| 6    | `last_modified_at` on the 12 guides                               | Sitemap shows 12 `<lastmod>` dates                               | Done   |
| 7    | Custom 404 page                                                   | A made-up URL returns 404 with the custom page                   | Done   |
| 8    | Domain property verified, sitemap submitted                       | Search Console shows the sitemap as read                         | Done   |
| 9    | Old project URL redirects                                         | `tallyfold.github.io/invoice-sdk/` returns 301 to the new domain | Done   |

The domain change fixed the robots.txt problem as a side effect: the old file in `/invoice-sdk/robots.txt` was never read, and on its own host the new one is. The site stayed well inside the limits, with 60 pages and about 4 MB of output against a 1 GB cap.

Step 9 needs no work. GitHub handles the redirect once the custom domain is set, as the live checks above showed.

Rankbox doesn't host sites or change GitHub settings. It helps fill a docs site with guides people search for: its [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes source-backed articles, which reach your site through Rankbox's API. On a static Pages site, that means a small build step you'd wire in yourself. The Business plan is $49.50 a month with a 7-day trial on the [pricing page](/pricing). For free, self-hosted tools to crawl and audit your Pages site, see our list of [open source SEO tools](/blog/open-source-seo-tools).

## Frequently Asked Questions

### Is GitHub Pages good for SEO?

Yes, for docs, project and personal sites. It serves static HTML over HTTPS, which crawlers read easily, and it supports sitemaps and canonical tags through Jekyll plugins. GitHub Pages SEO needs a custom domain for full control of robots.txt and Search Console.

### Does GitHub Pages support sitemaps?

Yes. GitHub's supported plugins include jekyll-sitemap, which writes `sitemap.xml` on every build once it's listed under `plugins` in `_config.yml`. With a custom Actions workflow, your static site generator's own sitemap feature works too.

### Can I add robots.txt to a GitHub Pages project site?

Only at the host root. For `<owner>.github.io/<repo>`, that means the robots.txt in your `<owner>.github.io` repository. A file inside the project repo lands in a subfolder, where Google ignores it. A custom domain gives the project its own root.

### How do I verify a GitHub Pages site in Google Search Console?

With a custom domain, add a Domain property and verify through a DNS TXT record. On `github.io`, add a URL-prefix property and verify with the HTML tag, which jekyll-seo-tag can add, or by uploading Google's HTML file. Then submit your sitemap.

### Can GitHub Pages do 301 redirects?

Not ones you configure. GitHub redirects between apex and `www`, and from the `github.io` URL to your custom domain. For moved pages, jekyll-redirect-from writes instant meta refresh pages, which Google treats as permanent redirects.

### Can I use GitHub Pages for a business website?

For docs and project pages, yes. GitHub's limits page says Pages isn't allowed as free hosting for an online business, an e-commerce site or commercial SaaS. Host the product's marketing site elsewhere and keep Pages for documentation.

## References

1. [What is GitHub Pages?, GitHub Docs](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)
2. [GitHub Pages limits, GitHub Docs](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
3. [About custom domains and GitHub Pages, GitHub Docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)
4. [Managing a custom domain for your GitHub Pages site, GitHub Docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
5. [Verifying your custom domain for GitHub Pages, GitHub Docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
6. [Securing your GitHub Pages site with HTTPS, GitHub Docs](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
7. [About GitHub Pages and Jekyll, GitHub Docs](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll)
8. [Creating a custom 404 page, GitHub Docs](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site)
9. [Dependency versions, GitHub Pages](https://pages.github.com/versions/)
10. [jekyll-sitemap, GitHub](https://github.com/jekyll/jekyll-sitemap)
11. [jekyll-seo-tag documentation, GitHub](https://github.com/jekyll/jekyll-seo-tag/tree/master/docs)
12. [Create and submit a robots.txt file, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/robots/create-robots-txt)
13. [Redirects and Google Search, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/301-redirects)
14. [Build and submit a sitemap, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
15. [Add a website property to Search Console, Search Console Help](https://support.google.com/webmasters/answer/34592)
16. [Verify your site ownership, Search Console Help](https://support.google.com/webmasters/answer/9008080)
