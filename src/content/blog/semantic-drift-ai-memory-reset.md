---
title: Semantic Drift: How to Force an AI "Memory Reset" When Your Product Pivots
description: Semantic drift keeps AI pitching your old product after a pivot. Fix what retrieval reads in weeks, and what the next model learns, with a deprecation campaign.
keyword: semantic drift
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Technical SEO
---

You can't force an AI model to forget your old product. Semantic drift, the gap between what your company is now and what AI answers still say it is, lives in two layers. The first is retrieval: the pages ChatGPT search, Perplexity, Copilot and Google's AI features fetch while they answer. You can change that layer within days to weeks. The second is the model's trained weights, which change only when a vendor trains and ships a new model. The "memory reset" you control is a deprecation campaign that updates everything retrieval reads now and everything the next model will train on.

That split matters because old models stay in service long after a pivot. As of September 2026, Anthropic's [models overview](https://platform.claude.com/docs/en/about-claude/models/overview) lists Claude Haiku 4.5 with a reliable knowledge cutoff of February 2025, and says it won't retire before 15 October 2026. OpenAI's [current API models](https://developers.openai.com/api/docs/models/compare) list cutoffs of April and May 2026. A pivot announced in June 2026 is missing from all of those weights, and even Anthropic's newest models, with June 2026 cutoffs, saw at most a few weeks of coverage.

Retraining doesn't clean the slate either. Researchers behind [Dated Data](https://arxiv.org/abs/2403.12958) found that "effective cutoffs often differ from reported cutoffs," partly because new web crawls contain "non-trivial amounts of old data." If your old pages stay live, the next model can learn the old story again.

This guide covers how semantic drift works, a test that tells you which layer holds the old story, and the full deprecation campaign: redirects, sunset pages, Wikidata, Crunchbase, review sites and re-indexing. If one fact is wrong rather than your whole positioning, use our quicker guide to [fixing incorrect brand facts in LLM citations](/blog/how-to-fix-incorrect-brand-facts-in-llm-citations). For how engines choose and order brands in the first place, see [how AI models rank brands in search results](/blog/how-ai-models-rank-brands-in-search-results).

## Key Takeaways

- Semantic drift has two layers. Retrieval can reflect a pivot within days to weeks of recrawling. Trained weights change only when a vendor ships a new model.
- No submission, feedback button or IndexNow ping edits a model's weights. IndexNow tells participating search engines a URL changed. That's all it does.
- Old facts can win even when an engine searches. In an ICLR 2024 study, models followed whichever side had more evidence, and clung hardest to facts about popular entities.
- Measure semantic drift with the Two-Layer Drift Test: the same prompts with search on and search off. The gap tells you whether to fix pages or wait for a new model.
- Redirect pages that moved, but keep a dated sunset page for a product that ended. Buyers still ask about it, and a redirect answers nothing.
- On Wikidata, keep the old industry with an end date instead of deleting it, and mark the new one preferred. Wikidata requires paid editors to disclose who pays them.
- Plan for retrieval answers to shift within about six weeks, our estimate from Google's crawl guidance. Memory answers shift only with a model whose cutoff falls after your pivot.

## What Semantic Drift Means After a Pivot

In language research, drift describes meaning that moves away from where it started. A 2024 paper, [Know When To Stop](https://arxiv.org/abs/2404.05411), uses "semantic drift" for models that state correct facts first and then "drift away" into wrong ones. In this guide we use the term for brands: semantic drift is the distance between your current positioning and the positioning AI systems still attach to your name.

A pivot creates semantic drift overnight, and a rebrand or a retired product does the same on a smaller scale. Say a company sold a social media scheduler for five years and now sells AI marketing automation. Five years of reviews, directory listings, comparison posts and forum threads describe the scheduler. The new site describes automation. An AI answer is built from some mix of those two stories, and the old one has more pages behind it.

### Where semantic drift hides

| Where it lives | What it holds | Who can change it | How fast it changes |
| --- | --- | --- | --- |
| Your own site | Old product pages, docs, pricing, blog posts | You | As fast as you ship and get recrawled |
| Third-party records | Wikidata, Crunchbase, G2, directories, app stores | You, within each site's rules | Days to weeks, some need review |
| Earned coverage | Reviews, press, roundups, Reddit threads | Their authors | Slowly, and often never |
| Search indexes | Stored copies of all the above | The engines, after recrawling | Days to weeks |
| Model weights | Patterns learned at training time | Only the vendor | At the next trained model |

The first four rows feed retrieval. The last row is the model's memory. Semantic drift fades only when both catch up.

## The Two Layers of Semantic Drift

Every AI answer about your brand comes from one or both layers. Knowing which one produced a sentence tells you whether a fix is weeks away or a model release away.

### The retrieval layer

When an engine searches, it pulls fresh pages and writes from them. Google says its AI features use [retrieval-augmented generation](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), "relying on our core Search ranking systems to retrieve relevant, up-to-date web pages from our Search index." OpenAI says ChatGPT search "typically rewrites your query into one or more targeted queries" and sends them to [its search providers](https://help.openai.com/en/articles/9237897-chatgpt-search), with Microsoft among those it links. Bing's guidelines say [Copilot relies on](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a) "the same core crawling, indexing, and ranking foundation as traditional search."

Perplexity runs its own index. It says the index [tracks over 200 billion URLs](https://www.perplexity.ai/hub/blog/architecting-and-evaluating-an-ai-first-search-api) and that a model decides which pages to refresh and when, because "refresh operations for existing pages must compete with indexing operations for new unvisited pages." So your updated page reaches each engine only after that engine recrawls it.

This is the closest real thing to what some guides call "overwriting outdated entity embeddings." Engines that retrieve by meaning score the copy of your page they have stored. Recrawling replaces that copy. But nothing you send from outside edits a model, and no engine documents an "entity embedding" you can overwrite.

### The weights layer

A model's weights hold what it learned from its training data, frozen at its [knowledge cutoff](/glossary/knowledge-cutoff). When an engine answers without searching, or when a user asks a model with no search tool, the answer comes from here. Changing weights takes a new training run, or model editing, which [researchers describe](https://arxiv.org/abs/2305.13172) as a way to alter behavior "within a specific domain." Both need access to the model. That means only the vendor can do it.

So the honest version of a memory reset has two parts. You change what retrieval reads now. And you change what the web says, so the next training crawl learns the new story. Our glossary entry on [LLM training data](/glossary/llm-training-data) covers where that data comes from.

### Why semantic drift survives a web search

Retrieval doesn't guarantee the new story wins. Three findings explain why.

- **Models follow the majority.** In [Xie et al.](https://arxiv.org/abs/2305.13300) (ICLR 2024), "LLMs generally provide answers backed by the majority of evidence." If a search returns four old reviews and one new homepage, the old story has the numbers.
- **Popular facts resist change.** The same paper found stronger confirmation bias for popular entities. Shown evidence for both its memorized answer and a rival one, GPT-4 kept the memorized answer 80% of the time on the most popular questions. The better known your old product was, the harder it is to displace.
- **Confident models ignore surprising evidence.** In [ClashEval](https://arxiv.org/abs/2404.10198), models were less likely to adopt retrieved content that looked "more deviated from truth," and more likely to adopt it when unsure. A big pivot can look like an error to a model that is sure of the old version.

Microsoft's Bing team names the risk directly. When two sources contradict each other, "an AI system that silently arbitrates between contradictory sources is one that may confidently assert the wrong thing," it wrote in [May 2026](https://blogs.bing.com/search/May-2026/Evolving-role-of-the-index-From-ranking-pages-to-supporting-answers). It adds that abstention is valid "when support is missing, stale, or conflicting." Mixed signals can get you a wrong answer or no answer. The campaign below exists to remove the mix.

## The Two-Layer Drift Test

Before you change anything, measure where the semantic drift lives, because each layer needs a different fix. The Two-Layer Drift Test runs the same prompts twice: once with web search on, and once with it off. The search-on run shows what retrieval says. The search-off run shows what the weights remember.

### How to run it

1. **Write 10 to 15 prompts.** Mix branded questions ("What does Plannora do?", "Plannora pricing", "Is Plannora a social media scheduler?") with category questions for your old and new category.
2. **Run each prompt five times per mode.** For search on, use each app in a clean session, and in ChatGPT pick [Search from the tools menu](https://help.openai.com/en/articles/9237897-chatgpt-search) so every run searches. OpenAI's temporary chat has an [Unpersonalized option](https://help.openai.com/en/articles/8590148-memory-faq) that "does not use memory, custom instructions, or plugins."
3. **Run the search-off mode through each vendor's API** with no search tool attached. In OpenAI's Responses API, [web search is a tool](https://developers.openai.com/api/docs/guides/tools-web-search) you add to the request, and Gemini's [Grounding with Google Search](https://ai.google.dev/gemini-api/docs/google-search) works the same way. Leave it out, and the model answers from memory.
4. **Label every answer that describes you:** Current, Legacy or Mixed. Mixed means it pitches both products.
5. **Work out the Drift Rate for each mode:** (Legacy + Mixed answers) ÷ all answers that describe you.

Drift Rate is the mirror image of the Accuracy Rate in our [GEO metrics framework](/blog/geo-metrics-framework), narrowed to one kind of error: describing a product you retired. Record which URLs each search-on answer cites. Those URLs are your fix list.

### How to read the result

| Search on | Search off | Where the semantic drift lives | What to do |
| --- | --- | --- | --- |
| High | High | Both layers | Run the full campaign, starting with retrieval |
| Low | High | Weights only | Keep pages stable and recheck after each new model |
| High | Low | Retrieval only | Old pages still win the search. Fix the cited URLs |
| Low | Low | Neither | Recheck quarterly |

Treat under 10% as low. Anything above 25% means buyers regularly hear about a product you no longer sell.

### Worked example: Plannora's pivot

Plannora is a made-up company. It sold "Plannora Social," a scheduler for freelancers, and on 3 March 2026 it relaunched as AI project planning for agencies. It runs 12 prompts, five times per mode, so 60 answers per mode. The numbers are illustrative.

| Reading | Mode | Answers describing Plannora | Current | Mixed | Legacy | Drift Rate |
| --- | --- | --- | --- | --- | --- | --- |
| Week 0 | Search on | 56 | 14 | 18 | 24 | 42 ÷ 56 = 75% |
| Week 0 | Search off | 52 | 3 | 7 | 42 | 49 ÷ 52 = 94% |
| Day 45 | Search on | 58 | 44 | 9 | 5 | 14 ÷ 58 = 24% |
| Day 45 | Search off | 52 | 3 | 8 | 41 | 49 ÷ 52 = 94% |

Plannora's search-on semantic drift fell 51 points. With about 60 answers per reading, each rate carries a margin of error of about ±11 points, so the drop is real. Search-off drift didn't move, and it shouldn't have. The models Plannora tested were trained before the pivot, or just after it with little coverage. Plannora's retrieval work is paying off. Its memory problem waits for a model whose cutoff lands well after March 2026.

## Retire the Old Story on Your Own Site

Your own site is the part of the campaign you fully control. Most semantic drift starts here, so fix it first.

### Map every legacy URL

List every URL that describes the old product: product pages, feature pages, pricing, docs, help articles, integrations, changelog entries, landing pages and blog posts. Search your site for the old category words ("scheduler," "Instagram posts," "content calendar"). Add the URLs cited in your search-on test answers. Then give each URL one of three fates.

| Fate | When to use it | What the URL returns |
| --- | --- | --- |
| Redirect | The content moved or has a close new equivalent | 301 to that equivalent |
| Sunset page | The product ended, and buyers still ask about it | 200, with a dated retirement notice |
| Remove | Nothing on the site meets the same need | 404 or 410 |

### Redirect what moved

Use permanent, server-side redirects. Google says a permanent redirect is [a signal that the target should be canonical](https://developers.google.com/search/docs/crawling-indexing/301-redirects), and recommends a server-side redirect "whenever possible." Bing's guidelines say to [use 301 redirects](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a) for permanent changes, keep 302s for changes shorter than two days, and use redirects instead of canonical tags.

Map old to closest new, one by one. Google's site move guide warns against sending [many old URLs to one irrelevant page](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes) such as the home page, and says to keep redirects for "generally at least 1 year." Our free [redirect generator](/tools/redirect-generator) turns an old-to-new list into Apache, Nginx, Vercel, Netlify or Next.js rules.

If the pivot came with a new domain, add Search Console's [Change of Address tool](https://support.google.com/webmasters/answer/9370220). It needs a 301 from the old home page first, and Google applies its special handling for 180 days.

![How long to keep 301 redirects?](youtube:ml7cQHkUc2Q "Google's John Mueller on which redirect to use and how long to keep it after a site move.")

### Keep a sunset page for what ended

A redirect answers nothing. When a buyer asks "Does Plannora still do social scheduling?", the best source is a page that says so plainly. Keep one short page per retired product:

- A title that states the change: "Plannora Social was retired on 3 March 2026."
- One paragraph on what replaced it, and one on what it means for old customers.
- Dates for the announcement, the end of sales and the end of support.
- Links to the new product and to two or three alternatives, if you're comfortable naming them.

You can mark the old offer as ended in structured data. Schema.org's [Discontinued](https://schema.org/Discontinued) value "indicates that the item has been discontinued":

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Plannora Social",
  "applicationCategory": "Social media scheduling",
  "description": "Retired on 3 March 2026 and replaced by Plannora, AI project planning for agencies.",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/Discontinued",
    "url": "https://plannora.io/social-retired"
  }
}
```

Google says structured data [isn't required](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) for its AI features, so treat this as clarity, not a ranking lever. The visible text does the real work. Our free [schema generator](/tools/schema-generator) builds the markup.

### Rewrite the pages that define you

Update your home page, about page, pricing page and main docs in the same release, so no crawl catches half the site in the old state. State the new category in the first sentence of each: "Plannora is AI project planning software for agencies." Bing's guidelines ask for [clear, consistent entity names](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a) and say to "remove or revise outdated information to prevent incorrect information from surfacing."

If you renamed anything, keep the old name once, in a sentence such as "formerly Plannora Social." That lets retrieval connect the two names without treating the old one as current. For a dated facts page with matching JSON-LD, follow our blueprint for [fixing incorrect brand facts in AI answers](/blog/fix-incorrect-brand-facts-in-ai-answers).

## Update the Entity Records Other Systems Copy

Knowledge bases and directories get copied into knowledge graphs, search results and training data, so stale records there keep semantic drift alive long after your site changes. Update them within their own rules. Breaking those rules gets edits reverted and accounts blocked.

### Wikidata

Wikidata has no standalone conflict-of-interest policy. As of 28 September 2026, its [Conflict of interest page](https://www.wikidata.org/wiki/Wikidata:Conflict_of_interest) is a list of links. Two of them matter:

- **Paid editing must be disclosed.** Wikidata's [policy](https://www.wikidata.org/wiki/Wikidata:Disclosure_of_paid_editing) says a user "has to disclose the name of every organization ... and individual that pays the user money for contributing to Wikidata," on their user page. If editing is part of your job, that includes you.
- **Self-promotion is discouraged.** An [essay](https://www.wikidata.org/wiki/Wikidata:Self-promotion), not a policy, says creating an item about "your organisation, or your work is a form of self-promotion and is strongly discouraged." If an item already exists, it says you "may correct clear factual errors, but avoid promotional editing, and don't remove sourced claims," and suggests requesting other changes on the item's talk page with the Edit request template.

Whether you edit directly or request the edit, the shape of the change matters. Wikidata's [ranking help](https://www.wikidata.org/wiki/Help:Ranking) says historical facts that were true keep normal rank with start and end time qualifiers. Deprecated rank is for known errors. So for a pivot:

1. On **industry** (P452), keep the old value, add an **end time** (P582), and add the new value with a **start time** (P580) and preferred rank.
2. On **product or material produced** (P1056), do the same for the old and new products.
3. If the old product has its own item, add a **discontinuation date** (P2669).
4. Cite a public source for each change, such as your announcement or press coverage.

Deleting the old industry would erase a true, sourced fact. Marking it with an end date tells every system that copies Wikidata exactly when it stopped being true. Once the records are right, point to them from your own site with `sameAs` links, as our guide to [building a knowledge graph for AI](/blog/knowledge-graph-for-ai) shows.

### Crunchbase

Crunchbase's help center publishes no conflict-of-interest rule. It says [any registered, socially authenticated user](https://support.crunchbase.com/hc/en-us/articles/115010477107-Edit-a-Profile-on-Crunchbase) can edit a profile. Once you [verify your employment](https://support.crunchbase.com/hc/en-us/articles/360022296433-How-do-I-verify-my-account) with a company email, you and other verified staff get "the exclusive ability to edit the Overview section."

Update the description and the industries. Crunchbase says [industries were once called categories](https://support.crunchbase.com/hc/en-us/articles/360043671353-How-are-industries-organized) and recommends three to five per company. Swap the old category for the new ones. You [can't remove](https://support.crunchbase.com/hc/en-us/articles/360008319833-What-information-can-I-remove-from-a-profile) funding rounds, founders or acquisitions, which Crunchbase keeps as history.

### Review sites, directories and Wikipedia

- **G2.** In my.G2, you can edit your description and choose a main category from those already linked to your product. New categories go through [G2's market research team](https://research.g2.com/categorization-methodology), which checks the product against the category's requirements and accepts evidence such as demos.
- **Directories and marketplaces.** Update the listing text, category and screenshots on every directory, app store and integration marketplace you control.
- **Wikipedia.** The [conflict-of-interest guideline](https://en.wikipedia.org/wiki/Wikipedia:Conflict_of_interest) says editors with a conflict "are strongly discouraged from editing affected articles directly, and can propose changes on article talk pages instead." Paid editing must be disclosed.

Old reviews stay. You can't rewrite a customer's review of a product you retired, and you shouldn't try. Your sunset page gives engines the dated context those reviews lack.

## Push the Change Into Every Index

Recrawling is what turns fixed pages into changed answers, and less semantic drift. Each engine gets there by its own route.

### Google

For a few key URLs, use URL Inspection in Search Console. Google says [there's a quota](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl) and that asking twice won't speed things up. For the rest, resubmit your sitemap. Google uses `<lastmod>` only when it's [consistently and verifiably accurate](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), so set it to the real date of the rewrite. Google says crawling "can take anywhere from a few days to a few weeks."

### Bing, Copilot and IndexNow

Bing asks you to [use IndexNow](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a) when URLs are added, updated or removed, and says timely notices "reduce outdated or incorrect URL references in Copilot responses and grounding results."

Here is what an IndexNow ping does, precisely. It tells participating search engines that a URL changed, and the [documentation](https://www.indexnow.org/documentation) says submissions are shared with all of them. As of September 2026, the [participant list](https://www.indexnow.org/searchengines.json) includes Bing, Yandex, Seznam, Naver, Yep, Amazon and the Internet Archive. Google isn't on it. A 200 response "only indicates that the search engine has received your URL."

Two details matter for a pivot. The [IndexNow FAQ](https://www.indexnow.org/faq) says you should submit redirected URLs and pages that return 404 or 410, not only new ones. And after "a migration or redesign," it says submitting every URL is acceptable. So after a pivot, submit the whole legacy list along with the new pages. Our [Bing Webmaster Tools guide](/blog/bing-webmaster-tools-ai-indexing-guide) covers setup, and the glossary explains [IndexNow](/glossary/indexnow) in brief.

### ChatGPT, Perplexity and Claude

These engines recrawl on their own schedules. Your job is to make sure their search crawlers can reach the new pages. OpenAI says to [allow OAI-SearchBot](https://help.openai.com/en/articles/9237897-chatgpt-search) for a site to be eligible for ChatGPT search. Check your robots.txt, CDN and firewall rules for each search crawler; our [AI crawler directory](/blog/ai-crawler-directory) lists the user agents and IP checks.

### What reaches the next model

Training crawlers are a separate choice. OpenAI's [GPTBot](https://developers.openai.com/api/docs/bots) crawls content "that may be used in training our generative AI foundation models." Google's [Google-Extended token](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers) controls use for future Gemini training and some grounding. Common Crawl's [CCBot](https://commoncrawl.org/ccbot) feeds many open datasets.

If you block them, your new positioning won't reach those vendors' training data from your own site. Third-party pages about you will still get there. That's a business decision, not a technical one. Just know which way each choice cuts. And remember the Dated Data finding: old pages that stay live get crawled again, so retiring them matters for the next model too.

## A 90-Day Timeline to Reduce Semantic Drift

| When | What to do | What should move |
| --- | --- | --- |
| Before launch | Run the Two-Layer Drift Test, map legacy URLs, draft sunset pages | Nothing yet. This is your baseline |
| Launch day | Ship redirects, sunset pages and rewritten core pages in one release | Your own site |
| Days 1–3 | Resubmit sitemaps, inspect key URLs, send IndexNow for new and legacy URLs | Crawl activity in logs |
| Week 1 | Update Wikidata, Crunchbase, G2 and directories | Third-party records |
| Weeks 2–6 | Rerun the search-on test every two weeks and fix any cited legacy URL | Search-on Drift Rate |
| Day 90 | Rerun both modes and compare with your baseline | Search-on should be low |
| Each new model | Check its knowledge cutoff, then rerun search off | Search-off Drift Rate |

Two clocks run through this table. Our rule of thumb is that retrieval follows within about six weeks, as recrawls land. Memory follows only when a vendor ships a model trained on a web that has already absorbed your change. Watch vendors' model pages for cutoff dates after your pivot, and test each new model as it ships.

Keep the redirects and sunset pages up for at least a year. Bing's 2020 migration advice says redirects should stay live for [one to two years, preferably longer](https://blogs.bing.com/webmaster/december-2020/Website-Migration-with-Bing).

## Where Rankbox Fits When You Fix Semantic Drift

Rankbox doesn't track AI citations, mentions or answers today, and it doesn't monitor what AI says about you. You'll run the Two-Layer Drift Test yourself, by hand or with a script, and our free [AI Visibility Prompt Kit](/tools/ai-visibility-prompt-generator) can draft the category prompts.

Where it helps is the content. [Answer-Space Research](/features/answer-space-research) maps the questions buyers now ask AI about your new category, so you know which pages the pivot needs. The [Citation-Ready Writer](/features/citation-ready-writer) writes source-backed articles, such as a clear "what we do now" explainer or a use-case page for the new audience. They reach your site through [Rankbox's API](/integrations/api), which a developer wires in. The Business plan costs $49.50 a month with a 7-day trial. See [pricing](/pricing).

## Frequently Asked Questions

### What is semantic drift in AI search?

Semantic drift is the gap between what your brand is now and what AI answers still say it is. It usually follows a pivot, a rebrand or a retired product. It lives in two places: the pages engines retrieve while answering, which you can update, and the model's trained weights, which only change when the vendor trains a new model.

### Can you make ChatGPT forget your old product?

No. Nobody outside OpenAI can edit a model's weights. What you can change is what ChatGPT search finds: redirect or retire old pages, publish a dated sunset page and update third-party records. Answers that use search can reflect that within weeks. Answers from memory change only with a new model.

### How long does semantic drift take to fade after a pivot?

Semantic drift in search-based answers usually fades within a few weeks of the engines recrawling your pages. Google says crawling can take a few days to a few weeks. Answers from model memory change only when a vendor ships a model whose knowledge cutoff falls well after your pivot, which can take many months.

### Does IndexNow update ChatGPT's answers?

Not directly. IndexNow tells participating search engines, including Bing, that a URL changed. OpenAI links Microsoft as one of ChatGPT's search providers, so a faster Bing recrawl can help ChatGPT search find your new pages. IndexNow never changes a model's weights, and Google doesn't take part in it.

### Should you delete old pages after a pivot?

Not all of them. Redirect pages whose content moved to a close new equivalent. Keep a short, dated sunset page for any product that ended but that buyers still ask about. Return a 404 or 410 only when nothing on your site meets the same need. Don't redirect everything to your home page.

### Can I edit my own company's Wikidata item?

Carefully, and within limits. Wikidata requires anyone paid for their edits to disclose who pays them. A community essay says you may correct clear factual errors on an existing item but shouldn't remove sourced claims, and should request other changes on the item's talk page. Keep old facts with an end date, and cite a source for every change.

## References

1. [Models overview, Claude Developer Platform](https://platform.claude.com/docs/en/about-claude/models/overview)
2. [Dated Data: Tracing Knowledge Cutoffs in Large Language Models (Cheng et al., 2024)](https://arxiv.org/abs/2403.12958)
3. [Adaptive Chameleon or Stubborn Sloth: Revealing the Behavior of Large Language Models in Knowledge Conflicts (Xie et al., ICLR 2024)](https://arxiv.org/abs/2305.13300)
4. [ClashEval: Quantifying the tug-of-war between an LLM's internal prior and external evidence (Wu, Wu and Zou, 2024)](https://arxiv.org/abs/2404.10198)
5. [Evolving role of the index: From ranking pages to supporting answers, Microsoft Bing](https://blogs.bing.com/search/May-2026/Evolving-role-of-the-index-From-ranking-pages-to-supporting-answers)
6. [Bing Webmaster Guidelines, Microsoft Bing](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a)
7. [AI optimization guide, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
8. [Searching the web with ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/9237897-chatgpt-search)
9. [Architecting and evaluating an AI-first Search API, Perplexity](https://www.perplexity.ai/hub/blog/architecting-and-evaluating-an-ai-first-search-api)
10. [Redirects and Google Search, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/301-redirects)
11. [Site moves with URL changes, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)
12. [Ask Google to recrawl your URLs, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)
13. [IndexNow FAQ, IndexNow.org](https://www.indexnow.org/faq)
14. [IndexNow documentation, IndexNow.org](https://www.indexnow.org/documentation)
15. [Disclosure of paid editing, Wikidata](https://www.wikidata.org/wiki/Wikidata:Disclosure_of_paid_editing)
16. [Help: Ranking, Wikidata](https://www.wikidata.org/wiki/Help:Ranking)
17. [Wikipedia: Conflict of interest, Wikipedia](https://en.wikipedia.org/wiki/Wikipedia:Conflict_of_interest)
18. [How do I verify my account?, Crunchbase Knowledge Center](https://support.crunchbase.com/hc/en-us/articles/360022296433-How-do-I-verify-my-account)
19. [G2 Research categorization methodology, G2](https://research.g2.com/categorization-methodology)
20. [Overview of OpenAI crawlers, OpenAI](https://developers.openai.com/api/docs/bots)
