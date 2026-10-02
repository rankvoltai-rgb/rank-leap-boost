---
title: The Substack Arbitrage: Using High-Domain-Authority Newsletters to Seed LLM Knowledge
description: The Substack arbitrage, graded: what Google's site reputation policy allows, how AI engines read newsletters, and a founder plan that stays in bounds.
keyword: Substack arbitrage
date: 2026-10-15
updated: 2026-10-15
written: 2026-09-30
author: Rankbox Team
tags: AI Search, Content Strategy
---

The Substack arbitrage is the bet that a founder can publish on Substack, a platform with years of links behind it, and get the brand's story into Google, AI answers and even model training faster than a young company site could. Part of the bet holds up. Substack pages are open to search and AI crawlers by default, load as plain HTML and carry article markup. The "parasite authority" part doesn't hold up. Nobody can confirm what enters a model's training data, and both Google and Substack have rules against content placed on a host mainly to borrow its rankings.

The rules moved this year. On 28 August 2026, Google [updated its site reputation policy](https://developers.google.com/search/blog/2026/08/update-site-reputation-policy), the rule most people call "parasite SEO." Substack's [content guidelines](https://substack.com/content), updated 29 September 2026, don't permit publications whose primary purpose is to "enhance search engine optimization." Your own newsletter isn't the problem in the Substack arbitrage. Renting other people's reputation is.

The numbers also cut against the hype. In [Britopian's study of 1.7 million unbranded prompts](https://www.britopian.com/geo/substack-generative-engines/), published in January 2026, Substack earned 1,140 AI citations, about 0.07% of the total. Medium earned 0.36%.

This guide grades each claim behind the Substack arbitrage, states Google's rules precisely, shows how AI crawlers treat a Substack page, and ends with a worked plan for a fictional founder. For the training-data side in depth, read our [shadow training data audit](/blog/shadow-training-data-audit).

## Key Takeaways

- The Substack arbitrage works for access, not authority. Substack's default robots.txt names no AI crawlers, so search bots from OpenAI, Perplexity, Anthropic and Google can fetch posts.
- The "DR 92+" behind the Substack arbitrage is Ahrefs' backlink score, not a Google signal. Google says no third-party tool has access to its ranking systems.
- Google's site reputation policy targets third-party content placed on a host "mainly because of that host's already-established ranking signals." A founder writing their own newsletter on a publishing platform is a different case.
- Substack's own rules ban publications whose main purpose is advertising, driving traffic or SEO. The newsletter has to be worth reading on its own.
- Don't publish the same full essay in two places. Google advises against canonicals for syndication, and Substack posts point their canonical at themselves.
- No vendor confirms which pages enter training data, and labs remove duplicates. Treat training as a long, unverifiable bet and retrieval as the near-term goal.
- Independent corroboration comes from other people's newsletters, not your own. In the fictional Tallyfold version of the Substack arbitrage, 6 of 42 pieces do that job.

## What the Substack Arbitrage Claims, Graded

The Substack arbitrage rests on five strong claims. Here is what kind of evidence backs each one, checked on 30 September 2026.

| Claim                                 | What the evidence shows                                                                                                                    | Evidence type                | Verdict                                            |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------- | -------------------------------------------------- |
| "Substack has a domain rating of 92+" | Domain Rating is Ahrefs' 0–100 score of backlinks. Ahrefs' public checker showed a human-verification step, so the figure couldn't be read | Vendor metric                | Unverified number, and not a Google signal         |
| "Zero crawl restrictions"             | Default robots.txt blocks one backlink crawler and some account paths, and names no AI bots                                                | Observed in robots.txt files | Mostly true, until the writer flips the AI setting |
| "Indexed almost instantaneously"      | No published study of Substack indexing speed. Google says crawling can take "a few days to a few weeks"                                   | Vendor docs; no study        | Unverified                                         |
| "Seeds LLM training sets"             | Training crawlers may collect the pages. No lab lists what it trained on                                                                   | Inference                    | Unknowable for any one page                        |
| "Perplexity citations"                | PerplexityBot is allowed by default, but Substack was 0.07% of citations in Britopian's 1.7-million-prompt study                           | Independent study            | Possible, not typical                              |

### Where "domain authority" numbers come from

Ahrefs says [Domain Rating "looks at the quantity and quality of external backlinks to a website"](https://ahrefs.com/website-authority-checker) and ignores link spam, traffic and domain age. Moz says its own score ["is not a Google ranking factor."](https://moz.com/learn/seo/domain-authority) Google's [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) adds: "No third-party tool has access to our internal ranking or AI systems." A high [domain authority](/glossary/domain-authority) score tells you Substack has many links. It doesn't tell you a new post will rank.

### What "indexed fast" can and can't mean

OpenAI says robots.txt changes reach its search systems in about 24 hours, and Perplexity says up to 24 hours. That's how fast an opt-out applies, not how fast a page gets indexed or cited. Google's [recrawl guidance](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl) says "crawling can take anywhere from a few days to a few weeks." No one has published a controlled speed test for Substack.

## Is the Substack Arbitrage Parasite SEO? Where Google Draws the Line

"Parasite SEO" is the SEO community's name for publishing on a strong site to borrow its rankings. Google's policy is narrower than the nickname, and most of the Substack arbitrage falls outside it.

### The policy, word for word

Google's [spam policies](https://developers.google.com/search/docs/essentials/spam-policies#site-reputation), last updated 28 August 2026, now call it the site reputation policy. It "applies where third-party content is published on a host site mainly because of that host's already-established ranking signals, which it has earned primarily from its first-party content. The goal of this tactic is for the content to rank better than it could otherwise on its own."

Third-party content means content from "an entity that's separate from the established host site," such as users, freelancers and white-label services. Google adds a sentence many summaries skip: "Having third-party content alone isn't inconsistent with the site reputation policy."

Google lists what it doesn't treat as a violation. The list includes "sites designed to allow user-generated content, such as a forum website or comment sections" and "columns, opinion pieces, articles, and other work of an editorial nature."

### How Google reviews a suspect section

When Google's reviewers look at a section, they weigh four things:

1. Whether the design, formatting and UX match the host site.
2. Whether the quality drops below the host's usual standard.
3. Whether authorship and responsibility are stated.
4. Whether the same or near-identical content appears on other sites.

Google says none of these is "either necessary or sufficient" on its own.

### What changed in August 2026

From 30 August 2026, a manual action under this policy [no longer applies to searchers in the European Economic Area](https://developers.google.com/search/blog/2026/08/update-site-reputation-policy). Google made the change "following discussion with the European Commission." Inside the EEA, an offending section may instead be separated from the main site so it ranks on its own merits. Everywhere else, the manual action still hits the affected pages.

### Why your own newsletter is a different case

A founder who writes a Substack is the publisher of that publication. The essays are first-party to it. Substack is a platform where users publish their own work, which is closest to the user-generated content sites Google lists as consistent with the policy. Google doesn't name Substack either way, and nothing in the policy stops a person from publishing on a hosted platform.

The risk sits in two other places. The first is Substack's rules. Its [content guidelines](https://substack.com/content), updated 29 September 2026, say Substack "is intended for high quality editorial content, not conventional email marketing," and ban publications whose primary purpose is to "advertise external products or services, drive traffic to third party sites" or "enhance search engine optimization." Brands may face extra verification. A founder newsletter that is really a product brochure breaks those rules.

The second is other people's publications. If you pay a large newsletter to host an article so it ranks on their name, you're in the territory the policy describes. That's the real parasite pattern, and it can also trip Google's link spam rules.

### The Borrowed-Reputation Line Test

Run any Substack arbitrage placement, yours or a guest spot, through six questions. One red answer is worth fixing. Several red answers describe the pattern Google and Substack both target.

| Question                                  | In bounds                                                   | Out of bounds                    | The rule behind it                                                                                                                     |
| ----------------------------------------- | ----------------------------------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Whose publication is it?                  | Yours, or an editor who chose your piece                    | A host you paid to publish it    | Google site reputation policy                                                                                                          |
| Would it exist without search engines?    | Yes, readers subscribe for it                               | No, it exists to rank            | Substack Marketing and Promotion rule                                                                                                  |
| Is the author named and responsible?      | Named byline, real bio                                      | No byline, or a ghost brand      | Google's authorship factor                                                                                                             |
| Does the same text appear elsewhere?      | No, or only as a short excerpt                              | The same article on many sites   | Google's near-identical content factor; [scraping](https://developers.google.com/search/docs/essentials/spam-policies#scraped-content) |
| Does it fit the host's topic and quality? | Same beat and standard as the host                          | Off-topic, lower quality         | Google's presentation and quality factors                                                                                              |
| Are commercial links qualified?           | Paid or sponsored links use `rel="sponsored"` or `nofollow` | Keyword anchors that pass credit | Google [link spam](https://developers.google.com/search/docs/essentials/spam-policies#link-spam) policy                                |

Scale is the last warning sign. Publishing dozens of thin issues to cover keywords is [scaled content abuse](/glossary/scaled-content-abuse), whether a person or a model writes them.

## The Substack Arbitrage and Syndication: One Essay, Two Homes

The syndication step of the Substack arbitrage, "syndicating cornerstone brand narratives," points at a real risk: the same essay on your site and on Substack.

### What Google recommends

Google's [canonicalization troubleshooting page](https://developers.google.com/search/docs/crawling-indexing/canonicalization-troubleshooting) says the canonical link element "is not recommended for those who want to avoid duplication by syndication partners, because the pages are often very different." The fix it recommends is for partners to block indexing. Google News gives the same advice in its [guide to avoiding duplication](https://support.google.com/news/publisher-center/answer/9606800?hl=en): partners add a `noindex` robots meta tag, while a [canonical tag](/glossary/canonical-tag) is for duplicates within your own site.

Substack gives you little to work with here. Three Substack posts checked on 30 September 2026 each carried a canonical tag pointing at itself. The help center documents no setting to point it elsewhere or to noindex one post. So if the full essay lives in both places, Google picks the version it thinks is best, and it may not pick yours.

### Why AI engines make duplication worse

Copies confuse AI search too. In a March 2025 test by Columbia's Tow Center, [Perplexity Pro cited syndicated versions](https://www.cjr.org/tow_center/we-compared-eight-ai-search-engines-theyre-all-bad-at-citing-news.php) of Texas Tribune articles for three of ten queries, even though the two had a formal partnership. ChatGPT cited a Yahoo News copy of a USA Today article, although USA Today blocks ChatGPT's crawler.

Training pipelines don't reward copies either. OpenAI's [GPT-3 paper](https://arxiv.org/abs/2005.14165) describes "fuzzy deduplication at the document level, within and across datasets." A second copy of your essay is likely to be thrown out, not counted twice. Newer labs don't document their pipelines in that detail, so that part is inference.

### Three patterns that avoid duplication

| Pattern          | Where the full text lives | What goes on the other home                                 | Best for                                 |
| ---------------- | ------------------------- | ----------------------------------------------------------- | ---------------------------------------- |
| Site first       | Your company domain       | A 400–600-word companion issue with one new idea and a link | Brands whose site already gets crawled   |
| Newsletter first | Your Substack             | A short summary with a link, or nothing                     | Founders whose personal name is the draw |
| Two pieces       | Both, on different angles | Nothing copied                                              | Anyone with enough to say twice          |

The companion issue is the useful habit. It gives subscribers a reason to open the email and gives crawlers a second page that points to the original instead of competing with it. Our answer to [whether Substack is good for SEO](/blog/is-substack-good-for-seo) covers cross-posting choices for each kind of site.

## How AI Engines Read a Substack Page

The Substack arbitrage depends on crawlers reaching your posts. By default, they can. Our [Substack SEO settings guide](/blog/substack-seo) shows where each switch lives.

### Which bots get in

Substack serves the same crawl rules on every publication, with one switch. By default it names no AI crawlers. When a writer turns on "Tell AI tools not to train their models on your content" under Settings, then Privacy, Substack adds blocks for 14 user agents and a `Content-Signal: search=yes, ai-input=yes, ai-train=no` line. Here is what that means for each engine, based on the robots.txt of publications with the setting on and off, compared on 30 September 2026.

| Bot               | Owner and purpose                        | Default Substack | AI-training setting on |
| ----------------- | ---------------------------------------- | ---------------- | ---------------------- |
| Googlebot         | Google Search, AI Overviews, AI Mode     | Allowed          | Allowed                |
| Google-Extended   | Gemini training and Gemini app grounding | Allowed          | Blocked                |
| OAI-SearchBot     | ChatGPT search results                   | Allowed          | Allowed                |
| GPTBot            | OpenAI model training                    | Allowed          | Blocked                |
| PerplexityBot     | Perplexity search results                | Allowed          | Allowed                |
| Claude-SearchBot  | Claude search quality                    | Allowed          | Allowed                |
| ClaudeBot         | Anthropic model training                 | Allowed          | Blocked                |
| CCBot             | Common Crawl, a common training source   | Allowed          | Blocked                |
| Applebot-Extended | Apple model training                     | Allowed          | Blocked                |

Two details matter. First, the setting blocks `Google-Extended`, which Google says covers [grounding in Gemini apps as well as training](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers), though not Google Search. Substack warns that the setting "may limit your publication's discoverability" in AI tools. Second, [Cloudflare's content signals](https://blog.cloudflare.com/content-signals-policy/) "express preferences; they are not technical countermeasures." Our [AI crawler directory](/blog/ai-crawler-directory) lists every bot and what it does.

### What engines say about quality

Only Google documents how it separates editorial work from spam. Its AI guide says its AI features show "what's being said about products and services across the web," but that "seeking inauthentic 'mentions' across the web isn't as helpful as it might seem," because its generative AI features depend on both its ranking systems and its spam systems.

OpenAI's [publisher FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq) says only that "any public website can appear in ChatGPT search." Perplexity's [crawler page](https://docs.perplexity.ai/guides/bots) covers access, not quality. Anything beyond that about how these engines judge a newsletter is inference.

One agency study offers a clue. [Everything-PR's Substack Citation Index](https://everything-pr.com/the-substack-citation-index-2026), published in July 2026, logged 4,847 citations from 60 prompts across five engines. The most-cited newsletters had named frameworks, dated primary sources and a consistent beat. It's a small prompt set scored with the agency's own formula, so read it as a pattern, not proof.

### The page itself helps

Three Substack post pages checked on 30 September 2026 all shipped server-rendered HTML with `NewsArticle` structured data: headline, description, author, and published and modified dates. That's more than many company blogs provide. Named authorship matters for [E-E-A-T](/glossary/e-e-a-t), so keep bylines on.

## Can the Substack Arbitrage Put Your Brand Into Training Data?

It can make your writing available. It can't confirm inclusion. OpenAI says [GPTBot collects content that "may be used"](https://developers.openai.com/api/docs/bots) in training, and Anthropic uses similar wording for [ClaudeBot](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler). Perplexity says [PerplexityBot "is not used to crawl content for AI foundation models."](https://docs.perplexity.ai/guides/bots) None of them publishes a list of pages they trained on.

Three facts keep the "almost instantaneous" claim out of reach:

1. **Cutoffs lag.** A model's knowledge stops at its [knowledge cutoff](/glossary/knowledge-cutoff), usually months before release. A post published today can't be in a model that's already trained.
2. **Filters come first.** GPT-3's team filtered Common Crawl "based on similarity to a range of high-quality reference corpora." Being crawled isn't being kept.
3. **Duplicates collapse.** Deduplication means ten copies of one essay count about as much as one.

The [shadow training data audit](/blog/shadow-training-data-audit) shows how to check whether Common Crawl captured your pages, which is the one part you can verify. For what [LLM training data](/glossary/llm-training-data) is, see the glossary.

So split the Substack arbitrage in two. Retrieval is where a newsletter can matter within weeks, because ChatGPT, Perplexity, Claude and Google fetch live pages. Training is a slow, unconfirmable bonus.

## Using Other People's Newsletters to Validate Your Entity

The third idea in the Substack arbitrage is the strongest one: use external newsletters to confirm what your brand claims about itself.

### Why your own Substack isn't corroboration

Your Substack is still you. An AI engine that reads your founder's essay reads your claims about your company, just on another domain. Corroboration means a separate source saying the same thing. That's why [brand mentions](/glossary/brand-mentions) in independent publications carry weight in [entity authority](/blog/entity-authority-in-the-ai-era), and why Google warns against manufacturing them.

### How to earn a place in someone else's newsletter

- **Pitch a finding, not your product.** Editors want a number or story their readers haven't seen.
- **Use the host's guest tools.** Substack's [guest author feature](https://support.substack.com/hc/en-us/articles/4406178016148-How-can-I-add-a-guest-author-to-a-post) puts your name in the byline. The host keeps editorial control.
- **Keep links honest.** Google's link spam policy names "links with optimized anchor text in articles, guest posts, or press releases distributed on other sites." Link once, with your brand or the page title as anchor.
- **Never pay for an unmarked placement.** Paid placement is advertising. Mark it and qualify the link.
- **Write it once.** A guest issue should be original to that newsletter. The same piece in five newsletters fails the near-identical content test.

Our guide to [co-citation and link building](/blog/link-building-ai-visibility-co-citation) covers the wider mention strategy, and [digital PR](/glossary/digital-pr) explains pitching. For models of editorial newsletters done well, study the [SEO newsletters](/blog/seo-newsletters) on our reading list.

## Worked Example: Tallyfold's Substack Arbitrage, Done by the Rules

Tallyfold is a fictional invoicing and payments app for agencies, used here as an example. Its founder wants AI answers to name Tallyfold when agency owners ask about late payments and retainer billing. She has 12 months and about 15 hours a month.

Her version of the Substack arbitrage splits the work into three homes, which we call the Own-Echo-Earn model. Own is the company site, where every cornerstone essay lives in full. Echo is the founder's Substack, which carries companion pieces and newsletter-only notes, never full copies. Earn is other people's newsletters, the only home that counts as independent.

| Home                                   | What gets published                   | Count per year | Hours each | Hours per year |
| -------------------------------------- | ------------------------------------- | -------------- | ---------- | -------------- |
| Own: tallyfold.example                 | Cornerstone essays with original data | 12             | 8          | 96             |
| Echo: founder's Substack               | 12 companion issues + 12 field notes  | 24             | 2          | 48             |
| Earn: 4 independent agency newsletters | Original guest issues                 | 6              | 5          | 30             |
| **Total**                              |                                       | **42**         |            | **174**        |

That's 174 hours a year, or 14.5 hours a month. The newsletter sits on the founder's name subdomain, which Substack's own [SEO help article](https://support.substack.com/hc/en-us/articles/4407702258836-How-can-I-optimize-my-Substack-publication-for-SEO) recommends, and writes about agency finance, not Tallyfold features. Her bio links Tallyfold, and Tallyfold's About page links the newsletter.

Run the six line-test questions and all 42 pieces pass. None is a full copy. The guest issues carry her byline and a single branded link each. Only the 6 guest issues are third-party corroboration, which is why each gets more than twice the time of a newsletter issue.

### Measuring it

To see whether the Substack arbitrage is working, Tallyfold tracks 30 buyer prompts on ChatGPT, Perplexity and Google AI Mode, run twice a month: 180 answers. The results below are illustrative.

| Measure                  | Month 0          | Month 6           |
| ------------------------ | ---------------- | ----------------- |
| Answers naming Tallyfold | 14 of 180 (7.8%) | 38 of 180 (21.1%) |
| Change                   |                  | +13.3 points      |

At 180 answers, a change needs to clear about 9 points to be trusted, per the sample-size table in [how to measure GEO](/blog/how-to-measure-geo). A 13.3-point rise clears it.

In this illustration, each of the 38 month-six answers that named Tallyfold also linked a source about it. The first such link pointed to its own essays 17 times, a guest issue 9 times, the Substack 6 times and other sites 6 times. That adds to 38. In this illustration the Substack is the least-cited of the three homes. It earns its keep by growing the list and feeding the guest pitches, not by ranking.

## How Rankbox Fits Into a Substack Arbitrage Plan

Rankbox doesn't run a newsletter, post to Substack or pitch other publications, and it doesn't track AI citations today. It helps with the Own home. [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask AI engines about your category, which makes a good list of cornerstone topics. The [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and drafts 2,000 to 3,500-word source-backed articles, and [Brand Voice](/features/brand-voice) keeps them in your tone with your product details.

Articles reach your site through Rankbox's [API](/integrations/api). The newsletter voice, the guest pitches and the original data still come from you. The Business plan is $49.50 a month with a 7-day trial. [See pricing](/pricing).

## Frequently Asked Questions

### What is the Substack arbitrage?

The Substack arbitrage is the idea of publishing on Substack to borrow its search reputation and crawler access so your brand's story reaches Google and AI engines faster. The access part is real: posts are crawlable by default. The reputation part is limited by Google's site reputation policy, Substack's own rules and the lack of any way to confirm training-data inclusion.

### Is the Substack arbitrage parasite SEO?

No, not when you publish your own newsletter. Google's site reputation policy targets third-party content placed on a host mainly for the host's ranking signals, and it lists user-generated and editorial content as consistent with the policy. It becomes a problem when you pay other publications to host SEO articles, or when a Substack exists mainly for SEO, which Substack's rules ban.

### Does Substack block AI crawlers?

Not by default. Substack's default robots.txt names no AI crawlers. If you turn on "Tell AI tools not to train their models on your content," Substack blocks training bots such as GPTBot, ClaudeBot, CCBot and Google-Extended. Search bots like OAI-SearchBot and PerplexityBot stay allowed.

### Should I publish the same article on my blog and on Substack?

No. Keep the full text in one place and publish a shorter companion piece with a link in the other. Google advises against canonical tags for syndicated copies, Substack posts carry a canonical that points at themselves, and AI search tools have been caught citing copies over originals.

### Can the Substack arbitrage get my brand into ChatGPT's training data?

Nobody can promise that. GPTBot may collect Substack pages for training, but OpenAI doesn't publish what it trained on, filters for quality and removes duplicates. A newsletter can help your brand show up in live AI search much sooner, because ChatGPT search fetches current pages.

### Does Substack's domain authority help a new newsletter rank?

Not directly. Domain Rating is Ahrefs' backlink score, not something Google uses, and Google says no third-party tool sees its ranking systems. What helps a new newsletter is a clear beat, a named author and links from other sites, which Substack's own help center calls the best way to improve rankings.

## References

1. [Update to the Site Reputation Policy, Google Search Central Blog, 28 August 2026](https://developers.google.com/search/blog/2026/08/update-site-reputation-policy)
2. [Spam policies for Google web search, Google Search Central](https://developers.google.com/search/docs/essentials/spam-policies)
3. [Canonicalization troubleshooting, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/canonicalization-troubleshooting)
4. [Avoid article duplication in Google News, Publisher Center Help](https://support.google.com/news/publisher-center/answer/9606800?hl=en)
5. [Optimizing for generative AI search, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
6. [Ask Google to recrawl your URLs, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)
7. [Google's common crawlers (Google-Extended), Google](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers)
8. [Content Guidelines, Substack](https://substack.com/content)
9. [How can I block AI from using my Substack publication to train their models?, Substack Help Center](https://support.substack.com/hc/en-us/articles/20382615953556-How-can-I-block-AI-from-using-my-Substack-publication-to-train-their-models)
10. [How can I optimize my Substack publication for SEO?, Substack Help Center](https://support.substack.com/hc/en-us/articles/4407702258836-How-can-I-optimize-my-Substack-publication-for-SEO)
11. [How can I add a guest author to a post?, Substack Help Center](https://support.substack.com/hc/en-us/articles/4406178016148-How-can-I-add-a-guest-author-to-a-post)
12. [Overview of OpenAI crawlers, OpenAI](https://developers.openai.com/api/docs/bots)
13. [Publishers and Developers FAQ, OpenAI Help Center](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq)
14. [Perplexity crawlers, Perplexity](https://docs.perplexity.ai/guides/bots)
15. [Does Anthropic crawl data from the web?, Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
16. [Giving users choice with Cloudflare's new Content Signals Policy, Cloudflare](https://blog.cloudflare.com/content-signals-policy/)
17. [Language Models are Few-Shot Learners (Brown et al., 2020)](https://arxiv.org/abs/2005.14165)
18. [AI search has a citation problem, Tow Center for Digital Journalism, March 2025](https://www.cjr.org/tow_center/we-compared-eight-ai-search-engines-theyre-all-bad-at-citing-news.php)
19. [How influential is Substack in the generative engines?, Britopian, January 2026](https://www.britopian.com/geo/substack-generative-engines/)
20. [The Substack Citation Index 2026, Everything-PR](https://everything-pr.com/the-substack-citation-index-2026)
