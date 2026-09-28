---
title: Entity Authority in the AI Era
description: What entity authority is, why AI answers lean on it next to backlinks, and how to look your company up in Wikidata, Crunchbase and Common Crawl.
keyword: entity authority
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, SEO
---

Entity authority is how clearly the web identifies your company as one distinct thing, with facts that independent sources repeat and IDs that machines can match. Backlinks tell a search engine which pages other sites vouch for. Entity authority tells a language model, and the search systems that feed it, who you are and what you belong with. In the AI era you need both, because they do different jobs.

For more than 25 years, links were the currency of SEO. The idea goes back to a [1998 paper](http://infolab.stanford.edu/~backrub/google.html) by Sergey Brin and Lawrence Page, which treated each link as a citation and ranked pages by where a "random surfer" clicking links would end up. Google still says PageRank ["continues to be part of our core ranking systems."](https://developers.google.com/search/docs/appearance/ranking-systems-guide)

A chatbot answer works differently. A model can't count links while it writes. It knows your company through text: how often your name shows up next to the words for your category, and whether those texts agree. In Ahrefs' study of 75,000 brands, [branded web mentions correlated 0.664](https://ahrefs.com/blog/ai-overview-brand-correlation/) with visibility in Google's AI Overviews, against 0.218 for backlink counts. You'll often hear that knowledge graphs now matter "as much as" backlinks. No published study shows that. The evidence supports a narrower claim: entity signals now sit next to links, and for AI answers they track visibility more closely than raw link counts do.

This guide covers the shift from PageRank to vector distance, real lookups you can run today in Wikidata, Crunchbase and Common Crawl, a scored audit, and five ways to build entity authority without buying links. For the short definition, read [what entity authority in SEO means](/blog/what-is-entity-authority-in-seo). For a week-by-week version, see the [30-day entity authority SEO plan](/blog/entity-authority-seo). The markup side, JSON-LD with `@id` and `sameAs`, lives in our guide to [building a knowledge graph for AI](/blog/knowledge-graph-for-ai).

## Key Takeaways

- Entity authority rests on three things: consistent facts, corroboration by independent sources, and identifiers that link your records together across databases.
- Links haven't stopped mattering. Google says its AI features are "rooted in" its core ranking systems, and PageRank is one of them. Links also shape which pages Common Crawl collects.
- Inside a model, what counts is co-occurrence. A 2023 ICML paper found BLOOM-176B's accuracy rose from 25% to above 55% as the documents pairing a question's entities grew from 10 to 10,000.
- In Ahrefs' 75,000-brand studies, branded web mentions (0.66 to 0.71) correlated far more with AI visibility than backlink counts (0.218 for AI Overviews). Those are correlations, not proof of cause.
- You can check your entity footprint in public records: the Wikidata API, Crunchbase's URL pattern and API (which needs a key), and Common Crawl's CDX index and web graph all answered live requests on 28 September 2026.
- The Entity Footprint Audit scores six checks from 0 to 2. In the fictional Tallyfold example, fixes the company controls take it from 3 to 6 out of 12.
- Build entity authority without buying links: one canonical fact set, matching profiles, earned mentions next to your category, definition-led pages, and Wikidata only when notability rules allow.

## From PageRank to Entity Authority: How Machines Judge Trust

Search engines and language models both have to decide which names deserve trust. Link authority and entity authority are the two units they use.

### 1998: every link was a citation

Brin and Page described PageRank in ["The Anatomy of a Large-Scale Hypertextual Web Search Engine"](https://doi.org/10.1016/S0169-7552(98)00110-X), published in April 1998. The paper calls the pages that link to a page its "citations." It then models a reader: "We assume there is a 'random surfer' who is given a web page at random and keeps clicking on links." The chance that this surfer lands on a page is its PageRank. A damping factor, which they "usually set" to 0.85, covers the moment the surfer gets bored and jumps somewhere random.

The unit was the page, and the evidence was the link graph. Their prototype held at least 24 million pages and maps of up to 518 million links. Much of what SEO later built on links, from outreach to Domain Authority, grew from that model. Moz is clear that its own score is a proxy: ["Domain Authority is not a Google ranking factor and has no effect on the SERPs."](https://moz.com/learn/seo/domain-authority)

### 2026: a model knows you through co-occurrence

A large language model has no link graph inside it. It learns from text, and what it "knows" about a company is shaped by how often that company appears alongside the facts that describe it.

The clearest evidence comes from [Kandpal and colleagues](https://arxiv.org/abs/2211.08411) (ICML 2023). They tagged the entities in huge training sets and counted the documents where a question's key entity and its answer appear together. Accuracy tracked that count. For BLOOM-176B on trivia questions, accuracy jumped from 25% to above 55% as the pairing documents rose from 10 to 10,000. When they retrained a model with those documents removed, accuracy on the matching questions fell, which points to cause, not just correlation.

[Mallen and colleagues](https://arxiv.org/abs/2212.10511) (ACL 2023) reached the same place from another side. They built 14,000 questions from Wikidata facts and measured each entity's popularity by Wikipedia page views. Models "struggle with less popular factual knowledge," they found, while retrieval helped most on those rare entities. A small B2B company is a rare entity. Most of what an AI says about it will come from pages it retrieves, not from memory. So for a small brand, entity authority is mostly about the pages and profiles a system can find.

### Vector distance: how "similar" gets measured

Retrieval systems turn text into embeddings, lists of numbers where texts with similar meanings sit close together. The distance between a question's vector and a passage's vector helps decide which passages get read. Strong entity authority shows up here as a clear, repeated description that sits near the questions about its category. A brand with scattered descriptions ends up nowhere in particular.

Wording moves that distance. In Rankbox's [similarity experiment](/blog/vector-distance-vs-keyword-density), a definition sentence moved cosine similarity 3.2 times as much as a keyword mention, per percentage point of density (median of 8 open embedding models). The second mention of a name gave the big lift, and later repeats were flat or slightly lower. That study measured open models, not any product's ranking, but it points the same way: define the entity, don't repeat it.

### Links moved upstream

Links still shape AI answers. They just act earlier in the pipeline.

1. **Retrieval ranks with links.** Google's [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) says its generative features "are rooted in our core Search ranking and quality systems," and that retrieval relies on those systems to fetch pages. PageRank is one of them.
2. **Crawl priority follows links.** Common Crawl says its crawler has been [using harmonic centrality and PageRank](https://commoncrawl.org/blog/how-seos-are-using-common-crawls-web-graph-data-for-ai-ranking-signals) "to guide its crawling choices." Mozilla's [2024 report](https://www.mozillafoundation.org/en/research/library/generative-ai-training-data/common-crawl/) found at least 64% of 47 language models used a filtered version of Common Crawl.
3. **Some training sets were built from links.** OpenAI built GPT-2's WebText by scraping ["all outbound links from Reddit"](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf) that received at least 3 karma, about 45 million links.

So links decide which text gets collected and ranked. Entity authority decides what that text teaches a model about you. The table puts the two side by side.

| | Link authority | Entity authority |
| --- | --- | --- |
| Unit | A page or a domain | A company, person or product |
| Evidence | Links and anchor text | Consistent facts, independent mentions, shared identifiers |
| Where you can see it | Search Console's Links report, Common Crawl's web graph, SEO tools | Wikidata, Crunchbase, Google's Knowledge Graph, AI answers |
| What it decides | What gets crawled, indexed and ranked | Whether an answer names you, and gets your facts right |
| Rule-breaking version | Buying links, which Google's [spam policies](https://developers.google.com/search/docs/essentials/spam-policies) ban | Paying for fake mentions, which Google says "isn't as helpful as it might seem" |

## How Much Entity Authority Matters Next to Backlinks

The honest answer is "more than it used to, by an amount nobody has measured directly." The best public evidence is two correlation studies from Ahrefs, each covering 75,000 brands.

| Factor | AI Overviews, May 2025 | Across ChatGPT, AI Mode and AI Overviews, Dec 2025 |
| --- | --- | --- |
| Branded web mentions | 0.664 | 0.66 to 0.71 |
| YouTube mentions | Not measured | About 0.737 |
| Branded anchors | 0.527 | 0.511 to 0.628 |
| Domain Rating | 0.326 | 0.266 in ChatGPT |
| Number of backlinks | 0.218 | "Very weak" on all three |

The first study is on [AI Overviews](https://ahrefs.com/blog/ai-overview-brand-correlation/); the second adds [ChatGPT and AI Mode](https://ahrefs.com/blog/ai-brand-visibility-correlations/). In both, being talked about tracked AI visibility more closely than being linked to.

Read that with three caveats. These are Spearman correlations, so big brands may simply win on every measure at once. The data comes from Ahrefs' own crawler and its Brand Radar tool. And mentions aren't the same as knowledge graph entries. So the fair summary is this: entity signals now sit alongside backlinks, and for AI answers they appear to matter more than link counts. That's a softer claim than "as much as," and it's the one the data supports.

## The Entity Footprint Audit: Check Your Entity Authority in Public Records

You can check whether the web treats your company as an entity in about 20 minutes, using public sources that are mostly free. Every request below was run on 28 September 2026. We use Stripe, a well-known payments company, as the lookup example because its records are public and factual. Everything else in this guide uses Tallyfold, a made-up invoicing and payments app for agencies.

### 1. Wikidata: search by name, then by website

Wikidata is Wikipedia's sister database of structured facts, and researchers use it too: the PopQA questions above were built from it. Start with its search API, which searches "labels and aliases":

```bash
curl -s -A "AcmeEntityCheck/1.0 (you@example.com)" \
  "https://www.wikidata.org/w/api.php?action=wbsearchentities&search=Stripe&language=en&type=item&limit=5&format=json"
```

The response, trimmed to three results and three fields:

```json
{
  "search": [
    { "id": "Q7624104", "label": "Stripe",
      "description": "Irish-American payment technology company" },
    { "id": "Q3421342", "label": "stripe",
      "description": "long, narrow band of color, often in alternating sets" },
    { "id": "Q127900502", "label": "Stripe",
      "description": "fictional character in the Gremlins franchise" }
  ]
}
```

That's disambiguation in action. The company, a band of color and a Gremlins character share one name. The one-line description is what tells them apart, so check yours reads the way you describe yourself.

Name search misses items with odd labels, so search by your website too. Type this into [Wikidata's search box](https://www.wikidata.org/w/index.php?search=haswbstatement%3AP856%3Dhttps%3A%2F%2Fstripe.com%2F&title=Special%3ASearch&ns0=1):

```text
haswbstatement:P856=https://stripe.com/
```

P856 is the "official website" property. The [haswbstatement keyword](https://www.mediawiki.org/wiki/Help:Extension:WikibaseCirrusSearch) returns items holding that exact value. On 28 September 2026 it returned Q7624104. The same search without the trailing slash returned nothing, so try both forms, plus `www` and `http`, before you conclude you're missing.

For several facts in one go, use the [query service](https://query.wikidata.org/). This query finds the item by website and pulls its Crunchbase and Freebase IDs:

```sparql
SELECT ?item ?itemLabel ?crunchbase ?freebase WHERE {
  VALUES ?site { <https://stripe.com/> <https://stripe.com> }
  ?item wdt:P856 ?site .
  OPTIONAL { ?item wdt:P2088 ?crunchbase }
  OPTIONAL { ?item wdt:P646 ?freebase }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
```

It returned Q7624104 with Crunchbase ID `stripe` and Freebase ID `/m/0h3qnb8`. That item holds 56 properties, among them founders, inception year and GitHub and LinkedIn IDs, plus 29 sitelinks, 28 of them to Wikipedia editions. Those shared IDs are what let one system match its record to another's.

Our fictional brand returns what a company with no item sees: `{"searchinfo":{"search":"Tallyfold"},"search":[],"success":1}`. An empty list isn't a failure. Wikidata accepts items that can be described with ["serious and publicly available references"](https://www.wikidata.org/wiki/Wikidata:Notability), and its [self-promotion essay](https://www.wikidata.org/wiki/Wikidata:Self-promotion) says an item you create about your own company "is likely to be deleted." Two practical notes: Wikimedia asks scripts to send a [descriptive User-Agent](https://foundation.wikimedia.org/wiki/Policy:User-Agent_policy) with contact details, and our [semantic drift guide](/blog/semantic-drift-ai-memory-reset) covers the rules for editing an item that already exists.

### 2. Crunchbase: the permalink pattern

Every Crunchbase organization lives at one URL pattern, which Crunchbase's [API docs](https://data.crunchbase.com/docs/using-entity-lookup-apis) spell out:

```text
https://www.crunchbase.com/organization/{permalink}
```

Wikidata stores the same pattern as the formatter for its Crunchbase property, P2088, which is why Stripe's item can hold just `stripe`. Look for your permalink in your own Wikidata item if one exists, or search Crunchbase by name in a browser.

Don't script the public page. On 28 September 2026, both `/organization/stripe` and a made-up `/organization/tallyfold` returned HTTP 403 and a "Just a moment..." challenge to curl and to automated Chrome sessions, so the status code can't tell a real profile from a missing one. For scripts, use the API. [Crunchbase Basic](https://data.crunchbase.com/docs/crunchbase-basic-using-api) includes entity lookup, autocomplete and organization search:

```bash
curl -s "https://api.crunchbase.com/v4/data/entities/organizations/stripe?field_ids=short_description,website_url" \
  -H "X-cb-user-key: YOUR_CRUNCHBASE_KEY"
```

Without a valid key, the endpoint answered `401` with `"Unauthorized user_key"`, which confirms the route is live. If you don't know your permalink, the [autocomplete endpoint](https://data.crunchbase.com/docs/using-autocomplete-api) finds it from a name.

If you have no profile, Crunchbase says ["any registered and socially authenticated user can add a profile page."](https://support.crunchbase.com/hc/en-us/articles/115011823988-How-do-I-create-a-Crunchbase-profile) Fill in the founding date, website, description, founders and three to five industries, and use the same wording as your About page.

### 3. Common Crawl: are your pages in the open corpus?

Common Crawl publishes a free index of every URL in each of its crawls. First, list the crawls:

```bash
curl -s "https://index.commoncrawl.org/collinfo.json"
```

On 28 September 2026 it listed 128 crawls. The newest, `CC-MAIN-2026-39`, covered 4 to 17 September 2026. Query its index for your homepage:

```bash
curl -s -A "AcmeEntityCheck/1.0 (you@example.com)" \
  "https://index.commoncrawl.org/CC-MAIN-2026-39-index?url=stripe.com&output=json&limit=3"
```

Each line of the answer is one capture. The first, trimmed:

```json
{"urlkey": "com,stripe)/", "timestamp": "20260906061406", "url": "https://stripe.com/", "mime": "text/html", "status": "200", "languages": "eng"}
```

Add `&matchType=domain&showNumPages=true` to size the whole domain. For stripe.com it returned `{"pages": 8, "pageSize": 5, "blocks": 39}`. Pulling all eight pages gave 113,411 captures across 29 hostnames, 110,065 of them with status 200. The fictional domain gave the answer a site with no captures gets: HTTP 404 and `{"message": "No Captures found for: tallyfold.example"}`.

Three cautions. The server is busy: the first request returned a 504 time-out and a retry worked, and Common Crawl's [FAQ](https://commoncrawl.org/faq) asks you to sleep between calls and slow down on 503 errors. This index lists URLs, not text, so it shows whether your pages were collected, not who mentions you. And appearing here is a choice as well as a signal: Common Crawl's [CCBot page](https://commoncrawl.org/ccbot) tells you to block it with `User-agent: CCBot` and `Disallow: /` in robots.txt. Our [AI crawler directory](/blog/ai-crawler-directory) covers the other training bots.

### 4. Common Crawl's web graph: PageRank you can still look up

Common Crawl also publishes [domain-level link graphs](https://commoncrawl.org/web-graphs) with a ranks file listing harmonic centrality and PageRank for every domain. The July to September 2026 release covers [133.2 million domains and 2.1 billion links](https://data.commoncrawl.org/projects/hyperlinkgraph/cc-main-2026-jul-aug-sep/index.html). The file is 2.3 GiB, but you can stream it and stop at your domain, written in reverse order:

```bash
curl -s https://data.commoncrawl.org/projects/hyperlinkgraph/cc-main-2026-jul-aug-sep/domain/cc-main-2026-jul-aug-sep-domain-ranks.txt.gz \
  | gunzip | awk -F'\t' '$5=="com.stripe" {print; exit}'
```

It printed `64  1.9564838E7  66  4.642755981245159E-4  com.stripe  95`: harmonic centrality rank 64 and PageRank rank 66 among 133.2 million domains. Well-linked domains return in under a second. A small domain sits far down the file, so expect to stream most of it. This is the link side of your footprint, and it's the same kind of signal that guides what Common Crawl fetches next.

### 5. Google's Knowledge Graph

The fifth record is Google's own. Its free lookup API returns an entity ID, types and a description for a name, and our [Knowledge Graph Search API guide](/blog/knowledge-graph-search-api) has working requests and a script. Google also documents that [Organization markup](https://developers.google.com/search/docs/appearance/structured-data/organization) helps it "disambiguate your organization," and that identifiers such as `iso6523Code` (for an LEI or DUNS number) are "used behind the scenes" for that job.

### Scoring the audit

The Entity Footprint Audit turns those lookups into one number. Score each check 0, 1 or 2.

| Check | 0 points | 1 point | 2 points |
| --- | --- | --- | --- |
| Wikidata item | None, or the wrong entity | Exists, missing your website or IDs | Exists with your official website and matching IDs |
| Crunchbase profile | None | Exists, facts differ from your site | Facts match, website linked, 3 to 5 industries |
| Pages in Common Crawl | No captures | Homepage only | Homepage, About and pricing captured with status 200 |
| Google Knowledge Graph | No entity | Entity, but wrong type or no website | Correct entity with your domain |
| Independent corroboration | No independent source | 1 to 4 sources describe you in category words | 5 or more do |
| AI recognition (9 answers) | Fewer than 3 correct | 3 to 6 correct | 7 to 9 correct |

For the last check, ask "What is [brand]?" three times in each of three AI engines and mark each answer right or wrong against your About page. Read the total as a band: 0 to 4 means machines barely know you, 5 to 8 means they know you but thinly, and 9 to 12 means your entity authority is established.

## Worked Example: Tallyfold's Entity Footprint

Tallyfold is fictional, and so are its rivals Brindlework and Kestrelyn. The scores below are illustrative, not measured, to show how the arithmetic works. Tallyfold sells invoicing and payments software to agencies.

| Check | Tallyfold | Brindlework | Kestrelyn |
| --- | --- | --- | --- |
| Wikidata item | 0 | 2 | 1 |
| Crunchbase profile | 1 | 2 | 2 |
| Pages in Common Crawl | 1 | 2 | 2 |
| Google Knowledge Graph | 0 | 1 | 0 |
| Independent corroboration | 1 | 2 | 1 |
| AI recognition (9 answers) | 0 | 2 | 1 |
| **Total (out of 12)** | **3** | **11** | **7** |

Here's what sits behind Tallyfold's 3. Wikidata has no item, which is right for a company without independent coverage. The Crunchbase profile still calls it "payments for freelancers," its old positioning. Common Crawl captured the homepage but not the About or pricing pages. Three independent sources mention it: a partner directory, a podcast page and one review listing. Of 9 AI answers, 2 described it correctly; the rest said they had no information or mixed it up with a namesake.

Now the fix order, and what each can add:

1. **Crunchbase:** rewrite the description and industries to match the site. From 1 to 2, so +1, within a day.
2. **Common Crawl:** make sure About and pricing are linked from the homepage and not blocked. From 1 to 2 after a later crawl captures them, so +1.
3. **Independent corroboration:** earn two more sources that describe Tallyfold as invoicing software for agencies. From 1 to 2, so +1.

That's 3 + 3 = 6 out of 12 from work Tallyfold controls. Wikidata and the Knowledge Graph can't be forced, and AI recognition tends to follow the other checks. Brindlework's 11 shows what strong entity authority looks like: every source agrees on what it is.

## Five Ways to Build Entity Authority Without Buying Links

None of these moves to build entity authority involves paying for a link or a placement. Google's spam policies ban paid links, and its AI guide warns that inauthentic mentions don't help much either.

### 1. Publish one canonical fact set

Write the facts once: legal name, brand name, one-line category description, founding date, founders, headquarters, product names and prices. Put them on your About page in plain sentences, then mark them up. The JSON-LD patterns, `@id` for your own entities and `sameAs` for your profiles, are in our [SEO knowledge graph guide](/blog/seo-knowledge-graph). Add an LEI or DUNS number through `iso6523Code` if you have one.

*Done when:* every fact on the About page matches the markup, word for word.

### 2. Make every profile say the same thing

Update each profile you control with the exact name and one-liner: Crunchbase, LinkedIn, GitHub, app marketplaces, review sites and industry directories. Link each one back to your site. The [entity SEO](/glossary/entity-seo) glossary entry has a quick consistency score for this step.

*Done when:* a stranger reading any three profiles would describe your company the same way.

### 3. Earn co-occurrence with your category

Kandpal's result applies directly: a model's recall of a fact tracked the number of documents where its entities appear together. You want independent pages that say "Tallyfold" and "invoicing software for agencies" in the same paragraph. Good sources are trade press quotes, podcast episodes, conference talks, partner directories for integrations you really have, and YouTube, which had the highest correlation in Ahrefs' December study. Google's [rater guidelines](https://guidelines.raterhub.com/searchqualityevaluatorguidelines.pdf) tell raters that when a company and independent sources disagree, "trust the independent sources." Rater scores don't move individual pages, but the principle shows what Google values. See [brand mentions](/glossary/brand-mentions) and [digital PR](/glossary/digital-pr) for tactics.

*Done when:* five or more independent pages describe you in your category's words.

### 4. Define, don't repeat

On your own pages, open with a definition sentence that ties the name to the category: "Tallyfold is invoicing and payments software for agencies." Name the entity twice in a passage, then use natural language. Put your name next to your rivals' names in neutral comparison pages too, since shared context is also co-occurrence. This is where the 3.2 times result from Rankbox's experiment applies.

*Done when:* your homepage, About page and top three articles each open with the same definition.

### 5. Join the shared databases by their rules

List yourself where anyone may: Crunchbase, Google Business Profile if you serve customers locally and meet its guidelines, and the directories in your industry. Treat Wikidata as a result, not a tactic. Once serious, independent references exist, an item may follow, created by someone who isn't you. If one already exists, keep it accurate with sourced statements. Decide on purpose whether to allow `CCBot` and other training crawlers, since that choice controls whether your own pages join the open corpus.

*Done when:* your records share identifiers, so each one points at the others.

## How to Know Entity Authority Is Growing

Re-run the audit each month and record the six scores with a date. The lookups above take minutes once saved as a script. For the AI recognition check, use a fixed prompt set and several runs per engine, because answers vary run to run. Our [measurement guide](/blog/how-to-measure-geo) covers panel sizes, and the [GEO metrics framework](/blog/geo-metrics-framework) defines Accuracy Rate, the share of answers that get your facts right.

Expect the retrieval side to move first. Search-grounded answers can pick up a corrected page within days to weeks. What a model says from memory changes only when its maker retrains it. If AI answers get your facts wrong today, our guide to [fixing incorrect brand facts in AI answers](/blog/fix-incorrect-brand-facts-in-ai-answers) has the full recovery plan.

## What Rankbox Does and Doesn't Do for Entity Authority

Rankbox handles the writing part of this work. Its [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes 2,000 to 3,500-word source-backed articles. [Brand Voice](/features/brand-voice) applies the tone, audience, style rules and product details you give it, so every article uses your canonical name and one-liner, and mentions your product where it fits. Articles reach your site through Rankbox's [API](/integrations/api).

Rankbox doesn't create profiles, edit Wikidata, earn press mentions for you or track citations. Those steps stay with you. The Business plan is $49.50 a month with a 7-day trial. [See pricing](/pricing).

## Frequently Asked Questions

### What is entity authority?

Entity authority is how clearly and consistently the web identifies your company as one distinct thing. It rests on consistent facts, corroboration by independent sources, and shared identifiers in databases such as Wikidata and Crunchbase. Search engines and AI systems use those signals to tell you apart from namesakes and describe you correctly.

### Is entity authority more important than backlinks?

Not in general, and no study shows they're equal. Links still drive crawling and ranking, and Google's AI features are rooted in its core ranking systems. For AI answers, though, Ahrefs found branded mentions correlated 0.664 with AI Overview visibility, against 0.218 for backlink counts. Build both.

### Do I need a Wikidata item for entity authority?

No. Many companies with strong entity authority have none. Wikidata accepts company items mainly when serious, publicly available references describe them, and it strongly discourages creating an item about your own company. Earn independent coverage first. If an item appears or already exists, keep its facts accurate with sources.

### How do I check if my website is in Common Crawl?

Query Common Crawl's index server with your domain. Get the newest crawl ID from index.commoncrawl.org/collinfo.json, then request `CC-MAIN-<id>-index?url=yourdomain.com&output=json`. Each line returned is a captured page. A 404 with "No Captures found" means that crawl didn't collect it.

### How do I find my company's Crunchbase URL?

Crunchbase profiles follow the pattern crunchbase.com/organization/ plus a permalink. Find the permalink by searching Crunchbase in a browser, through its autocomplete API with a key, or in your Wikidata item's Crunchbase ID (P2088) if you have one. Scripted page requests may hit a bot challenge.

### How long does it take to build entity authority?

Fixes you control, like profiles and your About page, take days. Getting pages into the next crawl takes weeks. Independent coverage often takes months. AI answers that search the web reflect changes soonest, while a model's built-in knowledge updates only when it's retrained.

## References

1. [The Anatomy of a Large-Scale Hypertextual Web Search Engine (Brin and Page, 1998), Stanford InfoLab](http://infolab.stanford.edu/~backrub/google.html)
2. [A guide to Google Search ranking systems, Google Search Central](https://developers.google.com/search/docs/appearance/ranking-systems-guide)
3. [Optimizing your website for generative AI features on Google Search, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
4. [Spam policies for Google web search, Google Search Central](https://developers.google.com/search/docs/essentials/spam-policies)
5. [Organization structured data, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/organization)
6. [Large Language Models Struggle to Learn Long-Tail Knowledge (Kandpal et al., 2023), arXiv](https://arxiv.org/abs/2211.08411)
7. [When Not to Trust Language Models (Mallen et al., 2023), arXiv](https://arxiv.org/abs/2212.10511)
8. [Language Models are Unsupervised Multitask Learners (Radford et al., 2019), OpenAI](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)
9. [Brand web mentions and AI Overview visibility, Ahrefs](https://ahrefs.com/blog/ai-overview-brand-correlation/)
10. [AI brand visibility correlations across 75,000 brands, Ahrefs](https://ahrefs.com/blog/ai-brand-visibility-correlations/)
11. [Training Data for the Price of a Sandwich, Mozilla Foundation](https://www.mozillafoundation.org/en/research/library/generative-ai-training-data/common-crawl/)
12. [How SEOs Are Using Common Crawl's Web Graph Data for AI Ranking Signals, Common Crawl](https://commoncrawl.org/blog/how-seos-are-using-common-crawls-web-graph-data-for-ai-ranking-signals)
13. [Web Graph release cc-main-2026-jul-aug-sep, Common Crawl](https://data.commoncrawl.org/projects/hyperlinkgraph/cc-main-2026-jul-aug-sep/index.html)
14. [Common Crawl Index Server, Common Crawl](https://index.commoncrawl.org/)
15. [FAQ, Common Crawl](https://commoncrawl.org/faq)
16. [Help: Extension:WikibaseCirrusSearch, MediaWiki](https://www.mediawiki.org/wiki/Help:Extension:WikibaseCirrusSearch)
17. [Wikidata: Notability, Wikidata](https://www.wikidata.org/wiki/Wikidata:Notability)
18. [Wikidata: Self-promotion, Wikidata](https://www.wikidata.org/wiki/Wikidata:Self-promotion)
19. [Using Entity Lookup API, Crunchbase Data](https://data.crunchbase.com/docs/using-entity-lookup-apis)
20. [How do I create a Crunchbase profile?, Crunchbase Knowledge Center](https://support.crunchbase.com/hc/en-us/articles/115011823988-How-do-I-create-a-Crunchbase-profile)
