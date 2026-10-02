---
title: Substack SEO: Settings, Custom Domains and Posts That Get Found
description: A Substack SEO walkthrough of every setting that matters, verified in Substack's help center: URLs, custom domains, tags, sitemaps and the AI crawler switch.
keyword: Substack SEO
date: 2026-10-30
updated: 2026-10-30
written: 2026-09-30
author: Rankbox Team
tags: SEO, Content Strategy
---

Substack SEO comes down to about a dozen settings you set once, plus a few you check on every post. Set your subdomain or custom domain, publication name, one-line description and About page. Then give each post a short URL, a clear SEO title and description, a social image, tags and alt text. Substack handles canonical tags and article markup on its own, and adds sitemaps and Search Console verification as a publication grows.

Every Substack SEO setting below was checked in Substack's help center on 30 September 2026, with the menu path to find it. Where the help center is silent, we say so and point to what a live Substack page shows instead.

If you haven't decided whether Substack should host your writing at all, start with [is Substack good for SEO](/blog/is-substack-good-for-seo). For why newsletters matter to AI search engines, and where the rules draw the line, read our guide to [the Substack arbitrage](/blog/substack-arbitrage-llm-knowledge).

## Key Takeaways

- Substack SEO starts with the address. Use your name as the subdomain, or pay the one-time $50 for a custom domain on a subdomain like `www` or `newsletter`.
- Each post has an SEO Options panel. The help center documents the post URL there, 2 to 48 characters, and Substack's own SEO guide adds an SEO title and description.
- Edit a post's URL only before publishing. Changing it later breaks the links people already shared.
- Tags create pages at `/t/tagname` and sections at `/s/name`. Add the important ones to your navigation bar so crawlers and readers find them.
- Sitemaps and Search Console verification "become available as your publication grows," per Substack. Check your robots.txt for `Sitemap:` lines.
- The AI-training switch blocks training bots such as GPTBot and Google-Extended but leaves search bots alone. Substack warns it may reduce visibility in AI tools.

## Substack SEO Settings to Get Right Once

These Substack SEO basics live in your publication's Settings page. Do them before you publish much, because some are hard to change later.

1. **Subdomain.** Settings, then Danger Zone, then "Change subdomain." Substack [recommends your name](https://support.substack.com/hc/en-us/articles/4407702258836-How-can-I-optimize-my-Substack-publication-for-SEO), since people search for "your name Substack" more than a publication title. Subdomains need [4 to 32 letters and numbers](https://support.substack.com/hc/en-us/articles/360037460112-How-do-I-change-my-subdomain). A normal change breaks links. "Change subdomain without breaking links" redirects them, but you can use it only once.
2. **Custom domain.** Settings, then Domain, then "Add custom domain." It costs a [one-time $50](https://support.substack.com/hc/en-us/articles/360051222571-How-do-I-set-up-my-custom-domain-on-Substack). You add a CNAME record at your registrar, and setup can take up to 36 hours. Substack needs a subdomain such as `www`, with an optional root-domain redirect. On Cloudflare, set the record to "DNS only."
3. **Publication name.** Settings, then Basics, then "Publication name." If you don't see the field, switch your publication theme from "Profile" to "Custom," as the [name-change guide](https://support.substack.com/hc/en-us/articles/14879687588500-How-do-I-change-my-Substack-publication-name) explains.
4. **One-line description.** Settings, then Basics. It appears at the top of your [Welcome page](https://support.substack.com/hc/en-us/articles/7999279240212-What-is-a-Welcome-page-on-Substack), so write what you cover and for whom in plain words.
5. **About page.** Settings, then Website, then "Edit" next to About page. Substack suggests a [short bio](https://support.substack.com/hc/en-us/articles/25006088243348-How-do-I-edit-my-About-page-for-my-Substack-publication): "who you are and why you're qualified." That's also the kind of experience signal [E-E-A-T](/glossary/e-e-a-t) describes.
6. **Bylines.** In the Website editor, under Posts, turn on "Show bylines" and "Show byline photos." A named author is more credible than a faceless publication.
7. **Navigation bar.** Settings, then Website, then Navigation bar. Add your main tag pages and any custom pages so they're linked from every page.

### Which address to choose

If the newsletter is personal, `yourname.substack.com` is fine and free. If it's part of a company's marketing, put it on a company subdomain such as `newsletter.yourcompany.com`, so links build up on your domain. After a switch, old Substack links kept working in a spot check on 30 September 2026: `noahpinion.substack.com/p/some-post-slug-test` returned a 301 to the same path on the publication's custom domain.

## Post-Level Substack SEO: What Shapes Each Search Result

Open a draft and click Settings at the bottom. The fields below decide how the post appears in Google.

### The post URL

Under "SEO Options," the ["Post Url" field](https://support.substack.com/hc/en-us/articles/360051140332-How-do-I-edit-my-post-s-URL) sets the slug. It takes lowercase letters, numbers and dashes, from 2 to 48 characters. Substack builds it from your title by default. Cut filler words and keep the phrase people would search, such as `/p/agency-late-payment-fees` instead of `/p/why-we-finally-stopped-chasing-clients-for-money`.

Set it before you publish. Substack's own [SEO guide](https://on.substack.com/p/substack-seo-guide) warns that editing a published post's URL breaks existing links.

### SEO title and SEO description

The current help center doesn't describe these two fields. Substack's February 2023 [SEO guide](https://on.substack.com/p/substack-seo-guide) on its official blog does: the SEO Options panel holds an "SEO title (title tag)" and an "SEO description (meta description)," and they don't change how the post looks in email, the app or on your site. The title defaults to your post title and the description to your subtitle.

A live post checked on 30 September 2026 showed the fields in use: its meta description differed from its subtitle. Confirm the fields in your own dashboard, then follow two rules:

- **SEO title:** under 60 characters, the plain phrase a searcher would type, with your name or brand at the end if people know it.
- **SEO description:** one or two sentences that add something the title doesn't. Google builds snippets mostly from page content but [may use the meta description](https://developers.google.com/search/docs/appearance/snippet) when it describes the page better.

### Social preview

The same Settings panel shows a [social preview](https://support.substack.com/hc/en-us/articles/360039016992-How-do-I-edit-what-my-post-looks-like-on-social-media) with editable text and an image. Use an image at least 1200 × 630 pixels. Substack's 2023 guide says posts with social preview images get "an average of twice as many signups and 40% more clicks."

### Tags and sections

[Tags](https://support.substack.com/hc/en-us/articles/15325400348948-How-do-I-add-tags-to-Substack-posts) are added in the draft's "Add tags" box or under Settings, then Website, then Custom Tags. Each tag gets a page at `/t/tagname`, which you can add to the navigation bar. Keep tags few and topical, so each page collects a real group of posts.

[Sections](https://support.substack.com/hc/en-us/articles/360060687771-How-can-I-create-multiple-newsletters-or-podcasts-under-one-publication) are separate newsletters inside one publication, at `/s/section-name`. Use them for different audiences, not just to file posts.

### Alt text, dates and recipes

- **Alt text:** click the three dots on an image and choose ["Edit alt text"](https://support.substack.com/hc/en-us/articles/48404618511508-How-do-I-add-alt-text-to-an-image-on-a-Substack-post). Describe the image in a short sentence.
- **Displayed publication date:** in post Settings you can set any past date, which helps when you import old posts.
- **Recipes:** the recipe card's metadata ["can help with SEO"](https://support.substack.com/hc/en-us/articles/46107942987284-How-can-I-add-recipes-to-a-post-on-Substack), and only the first category you pick is used for it.

### A catch with email title tests

Publications with at least 200 subscribers can [test email titles](https://support.substack.com/hc/en-us/articles/36026518014100-How-do-I-test-different-titles-for-email-newsletters-on-Substack). When the test ends, "your post's title (and subtitle, if part of the test) will update to reflect the winning version." A catchy email title can then become your page title, so set the SEO title yourself if the post matters for search.

## Sitemaps, Search Console and Analytics

Substack's [SEO help article](https://support.substack.com/hc/en-us/articles/4407702258836-How-can-I-optimize-my-Substack-publication-for-SEO) says sitemaps and Google Search Console verification "become available as your publication grows," helped by regular publishing, a growing list and paid subscriptions.

Sitemaps are the one Substack SEO feature you can't switch on yourself. To see where you stand, open `yourpublication.substack.com/robots.txt`. Established publications list a `sitemap.xml` and a `news_sitemap.xml` at the bottom. Several small subdomains checked on 30 September 2026 listed none. Once a sitemap appears and verification is offered, add the site to [Google Search Console](/glossary/google-search-console) and submit the [XML sitemap](/glossary/xml-sitemap).

For traffic, Settings, then Analytics, takes a [Google Analytics 4 Measurement ID](https://support.substack.com/hc/en-us/articles/52667879688980-How-do-I-use-the-Analytics-section-on-Substack), a Google Tag Manager ID and ad pixels. Substack loads the tag on your pages, and you read reports in the tool itself. Substack's own [metrics](https://support.substack.com/hc/en-us/articles/5320347155860-A-guide-to-Substack-metrics) also break out traffic sources, Google included.

If you write for readers in several languages, turn on ["Additional post languages"](https://support.substack.com/hc/en-us/articles/50830893420564-How-do-I-publish-a-Substack-post-in-a-different-language) under Settings, then Basics. You can add custom translations in 18 languages, and readers see the version that matches their device.

## The AI Crawler Setting

Under Settings, then Privacy, a toggle reads ["Tell AI tools not to train their models on your content."](https://support.substack.com/hc/en-us/articles/20382615953556-How-can-I-block-AI-from-using-my-Substack-publication-to-train-their-models) Most publications checked on 30 September 2026 had it off.

Turning it on edits your robots.txt. Compared on 30 September 2026 with a publication that has it on, the file adds `Disallow: /` rules for 14 training and data crawlers and a content-signal line saying search and AI input are fine but training isn't.

| Blocked when the toggle is on                                                               | Still allowed                           |
| ------------------------------------------------------------------------------------------- | --------------------------------------- |
| GPTBot (OpenAI training)                                                                    | Googlebot (Google Search, AI Overviews) |
| ClaudeBot (Anthropic training)                                                              | OAI-SearchBot (ChatGPT search)          |
| Google-Extended (Gemini training and Gemini app grounding)                                  | PerplexityBot (Perplexity search)       |
| CCBot (Common Crawl)                                                                        | Claude-SearchBot (Claude search)        |
| Applebot-Extended, Amazonbot, Bytespider, plus Meta, Cohere, Ai2 and older Anthropic agents | Bingbot                                 |

Two points decide it. Google says `Google-Extended` also covers [grounding in Gemini apps](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers), so the toggle can keep your posts out of Gemini app answers. And Substack itself warns that blocking training "may limit your publication's discoverability in tools and search engines that return AI-generated results."

This switch matters more for AI visibility than for classic Substack SEO. If you want AI assistants to know your work, leave it off. If you'd rather not feed model training, turn it on and accept the trade. Either way, Google Search is unaffected. Our [AI crawler directory](/blog/ai-crawler-directory) explains each bot.

## Imports, Cross-Posts and Duplicate Content

### Importing an archive

Settings, then Import/Export, then "Import posts" pulls from [Medium, Ghost, WordPress, Mailchimp, Beehiiv, Seeking Alpha, Tumblr and Blogspot](https://support.substack.com/hc/en-us/articles/360037830351-How-do-I-import-my-posts-from-another-platform-such-as-Mailchimp-WordPress-Medium-or-Ghost), or any RSS feed. Imported posts land on your site without being emailed unless you choose to send them.

Each imported post is a new page that points its canonical at itself. If the old copies stay live, you have duplicates, the most common Substack SEO mistake after a move. Redirect the old URLs to the new Substack posts, or remove them, so only one version competes. The [canonical tag](/glossary/canonical-tag) glossary explains why duplicates split signals.

### Substack's cross-post button

Substack's [cross-post feature](https://support.substack.com/hc/en-us/articles/10522003894932-How-can-I-share-another-publication-s-post-with-my-subscribers) sends another writer's free post, in full, to your subscribers with your note on top. It appears on your site only if you tick "Publish cross-post to web." If you don't want others to repost your work, turn off "Allow cross-posting" under Settings, then Privacy.

### Guest posts

The [guest author tool](https://support.substack.com/hc/en-us/articles/4406178016148-How-can-I-add-a-guest-author-to-a-post) adds another writer to a post's byline. Substack's SEO article counts guest spots and shares as inbound links, and links are what it calls the best way to rank. Keep guest pieces original to the host, with honest anchor text.

## The 12-Point Substack SEO Audit

Run this once when you set up, then every quarter. Each check takes a minute or two.

| #   | Check                     | Where                           | Pass when                                 |
| --- | ------------------------- | ------------------------------- | ----------------------------------------- |
| 1   | Address                   | Settings, Danger Zone or Domain | Your name, or your own domain             |
| 2   | Publication name          | Settings, Basics                | Says what you cover                       |
| 3   | One-line description      | Settings, Basics                | Topic and audience in one sentence        |
| 4   | About page                | Settings, Website               | Bio with credentials and schedule         |
| 5   | Bylines                   | Website editor, Posts           | Names and photos on                       |
| 6   | Navigation                | Settings, Website               | Top tag pages linked                      |
| 7   | Post URLs                 | Draft Settings, SEO Options     | Short, keyword-led, set before publishing |
| 8   | SEO title and description | Draft Settings, SEO Options     | Written for search on key posts           |
| 9   | Social preview            | Draft Settings                  | Image at least 1200 × 630                 |
| 10  | Alt text                  | Image menu                      | Every meaningful image                    |
| 11  | Sitemap                   | `/robots.txt`                   | `Sitemap:` lines present, then submitted  |
| 12  | AI setting                | Settings, Privacy               | Matches your goal                         |

### Worked example: a founder's first Substack SEO audit

Tallyfold is a fictional invoicing app for agencies. Its founder audits her new Substack after two months. She passes 8 of 12 checks. Her four misses: the publication name is a pun that says nothing about agencies (2), there's no About page bio (4), no tags are in the navigation (6), and her robots.txt has no sitemap yet (11).

She fixes three in 25 minutes: a name that says "agency cash flow," a four-sentence bio, and two tag pages in the menu. That makes 11 of 12. The sitemap is the one she can't force. It waits until the publication grows, so she keeps publishing twice a month and asks two agency newsletters to link her best post.

## Where Rankbox Fits

Rankbox doesn't publish to Substack, run a newsletter or change your settings, so your Substack SEO stays in your hands. It helps with the pages that belong on your own website. [Answer-Space Research](/features/answer-space-research) finds the questions buyers ask AI engines about your category, and the [Citation-Ready Writer](/features/citation-ready-writer) turns them into 2,000 to 3,500-word source-backed articles that reach your site through Rankbox's API. The Business plan is $49.50 a month with a 7-day trial. [See pricing](/pricing).

## Frequently Asked Questions

### How do I improve Substack SEO?

Substack SEO starts with the address: use your name or a custom domain. Fill in the publication name, one-line description and About page, and turn on bylines. On each post, set a short URL before publishing, write the SEO title and description, add a social image, tags and alt text. Then earn links from other sites, which Substack calls the best way to rank.

### Does Substack have a sitemap?

Yes, once your publication qualifies. Substack says sitemaps and Search Console verification become available as a publication grows. Check `/robots.txt` on your publication: if it lists `sitemap.xml`, submit that URL in Google Search Console.

### Can I change a Substack post URL after publishing?

You can, but you shouldn't. The post URL is under SEO Options in the post's settings, and Substack warns that changing it after publishing breaks existing links. Set it before you hit publish.

### How do I add a meta description on Substack?

Open the post's Settings and look under SEO Options for the SEO description, which Substack's own SEO guide documents. If you leave it blank, Substack uses your subtitle. Write one or two plain sentences that add to the title.

### Does a custom domain help Substack SEO?

It helps you keep what you earn. Links point at your domain instead of a substack.com address, so they stay yours if you move platforms. It costs a one-time $50 and needs a subdomain such as www or newsletter.

### Should I block AI training on my Substack?

Only if keeping your work out of model training matters more to you than AI visibility. The toggle blocks training bots and Google-Extended, which also covers Gemini app grounding. Search bots for Google, ChatGPT and Perplexity stay allowed either way.

## References

1. [How can I optimize my Substack publication for SEO?, Substack Help Center](https://support.substack.com/hc/en-us/articles/4407702258836-How-can-I-optimize-my-Substack-publication-for-SEO)
2. [How do I edit my post's URL?, Substack Help Center](https://support.substack.com/hc/en-us/articles/360051140332-How-do-I-edit-my-post-s-URL)
3. [How do I set up my custom domain on Substack?, Substack Help Center](https://support.substack.com/hc/en-us/articles/360051222571-How-do-I-set-up-my-custom-domain-on-Substack)
4. [How do I change my subdomain?, Substack Help Center](https://support.substack.com/hc/en-us/articles/360037460112-How-do-I-change-my-subdomain)
5. [How do I add tags to Substack posts?, Substack Help Center](https://support.substack.com/hc/en-us/articles/15325400348948-How-do-I-add-tags-to-Substack-posts)
6. [How can I block AI from using my Substack publication to train their models?, Substack Help Center](https://support.substack.com/hc/en-us/articles/20382615953556-How-can-I-block-AI-from-using-my-Substack-publication-to-train-their-models)
7. [How do I import my posts from another platform?, Substack Help Center](https://support.substack.com/hc/en-us/articles/360037830351-How-do-I-import-my-posts-from-another-platform-such-as-Mailchimp-WordPress-Medium-or-Ghost)
8. [How can I share another publication's post with my subscribers?, Substack Help Center](https://support.substack.com/hc/en-us/articles/10522003894932-How-can-I-share-another-publication-s-post-with-my-subscribers)
9. [How do I use the Analytics section on Substack?, Substack Help Center](https://support.substack.com/hc/en-us/articles/52667879688980-How-do-I-use-the-Analytics-section-on-Substack)
10. [How do I test different titles for email newsletters on Substack?, Substack Help Center](https://support.substack.com/hc/en-us/articles/36026518014100-How-do-I-test-different-titles-for-email-newsletters-on-Substack)
11. [A guide to SEO on Substack, On Substack, February 2023](https://on.substack.com/p/substack-seo-guide)
12. [Google's common crawlers, Google](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers)
