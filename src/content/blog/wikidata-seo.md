---
title: Wikidata SEO: Building Machine-Readable Authority for LLM Knowledge Bases
description: Wikidata SEO explained: what Google and AI systems document about Wikidata, who qualifies for an item, and how to source and connect a company record.
keyword: Wikidata SEO
date: 2026-11-10
updated: 2026-11-10
written: 2026-10-01
author: Rankbox Team
tags: AI Search, Technical SEO
---

Wikidata SEO is the work of making sure Wikidata, the free knowledge base behind Wikipedia, holds a true, referenced record of your company, and that your own site points to that record. It only works for companies Wikidata already counts as notable. For everyone else, the job is to earn the independent coverage its rules ask for, and to publish the same facts on your own site while you wait.

The appeal is easy to see. Wikidata holds more than [120 million items](https://www.wikidata.org/wiki/Wikidata:Requests_for_comment/Notability_policy_reform). All of its data is released under a [public domain dedication](https://www.wikidata.org/wiki/Wikidata:Licensing), so any search engine, model builder or app can copy it. In January 2026 the Wikimedia Foundation [named Amazon, Meta, Microsoft, Mistral AI and Perplexity](https://enterprise.wikimedia.com/blog/wikipedia-25-enterprise-partners/) as partners of its paid data service, next to Google.

The catch is just as plain. No AI assistant says it looks up Wikidata when it answers. And Wikidata's volunteers are debating stricter rules, partly because of items made for marketing. Their reform page puts it bluntly: "People not acting in the best interest of the project create Items to promote themselves, their business, etc, causing more clean-up work for admins."

This guide covers what's documented about Wikidata in AI systems and search, who qualifies, the properties a company item needs, how the item connects to `sameAs` in your markup, upkeep, and what to do if you don't qualify yet. For the creation steps, read our guide to [creating a Wikidata item for your company without getting it deleted](/blog/create-wikidata-item-for-company). To check your current records, use the live lookups in our [entity authority guide](/blog/entity-authority-in-the-ai-era).

## Key Takeaways

- Wikidata SEO only applies to companies Wikidata already counts as notable: ones with a Wikipedia sitelink, serious public references, or a structural need.
- Wikipedia is a documented training source and one of the most-cited sites in AI answers. Wikidata's documented role is narrower: IDs, cross-references and research data.
- Google's Knowledge Panel help names "public sources" and licensed data, not Wikidata. Wikidata's own essay says knowledge panels are "not a valid reason to create an item."
- The profile IDs most SEO checklists add, such as Crunchbase, LinkedIn, X and GitHub, are classed on Wikidata as IDs that don't imply notability.
- In Wikidata SEO, every statement needs a reference a stranger can check. Your own site can back plain facts about you, never your notability.
- Link the record both ways. Wikidata's official website property points to you, and your markup's `sameAs` points to the item. Match an LEI through Google's `iso6523Code`.
- If you don't qualify, don't create the item. A 2026 proposal would ban creating an item about your own business outright.

![What is Wikidata? | Wikimedia UK](youtube:qMCEUspq5xQ "A short explainer on Wikidata from Wikimedia UK (May 2019).")

## What Wikidata SEO Can Rely On: The Documented Record

A lot of Wikidata SEO advice says Wikidata "feeds" Google and ChatGPT. Part of that is on the record. Part of it is a guess repeated until it sounds like a fact. Here is what each system has published, as of October 2026.

| System                   | What's documented                                                                                                                                                                                                                                                              | What isn't                                      |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| Google's Knowledge Graph | In 2020, Google called Wikipedia "a commonly-cited source." In 2014, it offered Freebase's data to Wikidata. Its Cloud graph API returns a Wikidata ID per entity.                                                                                                             | How Google uses Wikidata statements.            |
| Model training           | Wikipedia was 4% of PaLM's 780 billion tokens (2022). Google's KELM turned all of English Wikidata into sentences.                                                                                                                                                             | Source shares for 2026 models.                  |
| Knowledge tests          | A 2019 paper tested models on 41 Wikidata relations. [PopQA](https://arxiv.org/abs/2212.10511) (2023) built 14,000 questions from Wikidata.                                                                                                                                    | Any link to how engines rank brands.            |
| Retrieval tools          | The 2020 [RAG paper](https://arxiv.org/abs/2005.11401) searched an index of Wikipedia. Wikimedia Deutschland runs a Wikidata vector database and an MCP server.                                                                                                                | Any consumer assistant using them by default.   |
| Data deals               | Wikimedia Enterprise lists Amazon, Meta, Microsoft, Mistral AI, Perplexity and Google as partners.                                                                                                                                                                             | Who uses which data, and how.                   |
| AI citations             | Wikipedia was ChatGPT's top cited source, at 7.8% of citations ([Profound](https://www.tryprofound.com/blog/ai-platform-citation-patterns), 2024 to 2025). It ranked third in Perplexity in September 2026 ([Ahrefs](https://ahrefs.com/blog/most-cited-domains-perplexity/)). | Wikidata. It isn't in either study's top lists. |

### The Google record

Google's tie to Wikidata is real but old. When Google closed Freebase, its own open database, its researchers wrote in a [2016 paper](https://research.google/pubs/from-freebase-to-wikidata-the-great-migration/) that "Google decided in 2014 to offer the content of Freebase to the Wikidata community."

Today's help pages are vaguer. Google's [Knowledge Panel help](https://support.google.com/knowledgepanel/answer/9787176) says graph facts "come from a variety of sources that compile factual information," plus licensed data and facts from content owners. It doesn't name Wikidata. The clearest present-day link is technical. Google Cloud's [Enterprise Knowledge Graph Search API](https://cloud.google.com/enterprise-knowledge-graph/docs/search-api), a pre-release product, returns a `wikidataQID` next to Google's own ID. So Google maps its entities to Wikidata IDs. How it weighs Wikidata facts isn't public. Our [Knowledge Graph Search API guide](/blog/knowledge-graph-search-api) shows how to look your company up.

### The training and research record

The phrase "language models as knowledge bases" comes from a [2019 paper](https://arxiv.org/abs/1909.01066) that tested models with facts from 41 Wikidata relations. Google's [KELM project](https://arxiv.org/abs/2010.12688) went further. It turned "the entire English Wikidata KG" into sentences and added them to a retrieval model's library. Training mixes that name sources list Wikipedia: [PaLM](https://arxiv.org/abs/2204.02311) gave it 4% of its tokens. Older figures for GPT-3 and LLaMA are in our [shadow training data audit](/blog/shadow-training-data-audit). Newer model cards don't give shares at all.

On the retrieval side, Wikimedia Deutschland launched the [Wikidata Embedding Project](https://www.wikimedia.de/presse/the-wikidata-embedding-project/) on 1 October 2025. It's a free vector database built with Jina AI and DataStax. Wikidata also runs an [MCP server](https://www.wikidata.org/wiki/Wikidata:MCP) that lets an AI agent search items and read their facts. Both are opt-in tools for builders. Neither shows that ChatGPT, Gemini or Perplexity checks Wikidata when you ask about a brand.

### Two paths, not one

Wikipedia travels on the **text path**. Models learn from its prose, and answer engines cite its pages. Wikidata travels on the **ID path**. Its IDs tie records together, and researchers use its facts to test models. You'll often read that both are "core grounding datasets" for AI. That's fair for research systems, and for Wikipedia's role in training and citations. For Wikidata inside commercial AI answers, it's a guess.

The text path is also why Wikipedia is worried. In October 2025 the Wikimedia Foundation said human pageviews were [down about 8%](https://diff.wikimedia.org/2025/10/17/new-user-trends-on-wikipedia/) on the year, with search engines giving answers "often based on Wikipedia content." The facts travel even when the visits don't. That's the honest case for Wikidata SEO: a public record many systems can copy, not a ranking switch.

## Wikidata SEO Starts With Notability

Wikidata's [notability policy](https://www.wikidata.org/wiki/Wikidata:Notability) says an item is acceptable "if and only if" it meets one of three tests:

1. It has "at least one valid sitelink" to a page on Wikipedia or another Wikimedia project.
2. It "refers to an instance of a clearly identifiable conceptual or material entity that can be described using serious and publicly available references."
3. It "fulfills a structural need," such as making facts in other items more useful.

The policy admits its rules "are intentionally left a bit vague." The final call is "always up to the community." If you're unsure, it sends you to [Requests for new items](https://www.wikidata.org/wiki/Wikidata:Requests_for_new_items), where other editors judge whether an item should exist.

### What the self-promotion essay adds

Wikidata's [self-promotion essay](https://www.wikidata.org/wiki/Wikidata:Self-promotion) is an essay, not a policy. Reviewers still cite it all the time. It says creating an item about "your organisation, or your work is a form of self-promotion and is strongly discouraged." It also answers the SEO motive head-on: "Wikidata does not control Google's Knowledge Panels, and they are not a valid reason to create an item."

Its rule of thumb is "at least three independent, reputable sources that provide substantial coverage of you, not by you, not quoting you, and not merely mentioning you in passing." A business registry entry "does not by itself make a company notable." One nuance: self-promotion "is not in itself a reason to delete an item," but it can draw "additional scrutiny."

### The ID trap

Wikidata tags its ID properties by whether a value hints at notability. On 1 October 2026, the profile IDs that most Wikidata SEO checklists push were all tagged as a "Wikidata property for an identifier that does not imply notability."

| ID                            | Wikidata property | Implies notability?                                  |
| ----------------------------- | ----------------- | ---------------------------------------------------- |
| Crunchbase                    | P2088             | No                                                   |
| LinkedIn company page         | P4264             | No                                                   |
| X username                    | P2002             | No                                                   |
| GitHub account                | P2037             | No                                                   |
| YouTube channel               | P2397             | No                                                   |
| OpenCorporates                | P1320             | No                                                   |
| Google Knowledge Graph ID     | P2671             | No                                                   |
| Legal Entity Identifier (LEI) | P1278             | Not tagged. Registry entries don't make you notable. |

These IDs help once an item exists, because they let systems match records. They can't carry an item that has nothing else.

### A stricter policy is on the table

Wikidata's community has been rewriting the policy since late 2025. The [third-round draft](https://www.wikidata.org/wiki/Wikidata:Requests_for_comment/Notability_policy_reform), posted on 9 June 2026, says social profiles "are not sufficient on their own." New items would need the facts that prove they qualify within 24 hours. And "creating an Item about yourself, your close relatives or your business is not permitted." As of 1 October 2026 the vote is still open, so today's policy applies. Plan as if the stricter one will pass.

### Wikipedia is a higher bar

A Wikipedia article is the clearest route to notability, but Wikipedia's rules are stricter. Its [company guideline](<https://en.wikipedia.org/wiki/Wikipedia:Notability_(organizations_and_companies)>) wants "significant coverage in multiple reliable secondary sources that are independent of the subject," and adds: "Only unpaid sources count." Its [conflict-of-interest guideline](https://en.wikipedia.org/wiki/Wikipedia:Conflict_of_interest) says "COI editing is strongly discouraged." Don't write a Wikipedia article about your own company.

### The Evidence Ladder

To make these rules usable for Wikidata SEO, we sorted the evidence a company usually holds into seven rungs, each tied to the rule behind it. Only the top three rungs help an item exist. The rest can only support facts on an item that already qualifies.

| Rung | Evidence                                                                               | Helps notability? | Rule behind it                             |
| ---- | -------------------------------------------------------------------------------------- | ----------------- | ------------------------------------------ |
| 1    | A Wikipedia article that meets that Wikipedia's rules                                  | Yes               | Notability policy, test 1                  |
| 2    | In-depth coverage of you in independent, edited outlets                                | Yes               | The essay's three-source rule              |
| 3    | A record from an independent authority with its own review, such as a national library | Often             | ID tags that suggest notability            |
| 4    | Registry entries, an LEI or a DUNS number                                              | No, not alone     | Self-promotion essay                       |
| 5    | Crunchbase, LinkedIn, X, GitHub, YouTube                                               | No                | Wikidata's own ID tags                     |
| 6    | Interviews, podcasts, quotes, directory listings                                       | No                | Reform draft: routine listings don't count |
| 7    | Your site, press releases, sponsored posts                                             | No                | Self-promotion essay                       |

Reviewers use the same logic. Of 28 requests archived on [Requests for new items](https://www.wikidata.org/wiki/Wikidata:Requests_for_new_items/Archive/2026/08) for August 2026, nine were marked not done. Typical notes: "Sources are not independent. No valid identifiers." and "No independent coverage."

## Sourcing a Company Item for Wikidata SEO

Wikidata's [WikiProject Companies](https://www.wikidata.org/wiki/Wikidata:WikiProject_Companies/Properties) keeps the community's list of company properties. These matter most for identity.

| Property         | ID                         | What goes in it                           | Best reference          |
| ---------------- | -------------------------- | ----------------------------------------- | ----------------------- |
| Instance of      | P31                        | "business" (Q4830453) or a narrower class | Usually none needed     |
| Official name    | P1448                      | Your registered legal name                | Business registry       |
| Official website | P856                       | Your homepage                             | The site itself         |
| Inception        | P571                       | Founding date                             | Registry or press       |
| Founded by       | P112                       | A founder who already has an item         | Independent coverage    |
| Headquarters     | P159                       | The city's item                           | Registry                |
| Country          | P17                        | Country of incorporation                  | Registry                |
| Industry         | P452                       | A neutral industry item                   | Independent coverage    |
| Legal form       | P1454                      | Your country's legal form                 | Registry                |
| LEI              | P1278                      | The 20-character code                     | The ID is its own proof |
| Profile IDs      | P2088, P4264, P2002, P2037 | The ID part only, not the full URL        | The ID is its own proof |

Three rules make the table work. First, Wikidata's [sources guideline](https://www.wikidata.org/wiki/Help:Sources) says ID facts that link to an outside database need no extra reference. Second, a web reference should carry the page URL (P854), its title (P1476), and a publication date (P577) or the date you read it (P813). Third, don't cite Wikipedia. The guideline says references to community-edited sites "should be removed if other sources are already present."

Leave out what you can't source. An unsourced staff count or revenue figure is the kind of claim that pulls a reviewer to the whole item.

### Labels and descriptions

The label is the name most people use. The description tells the item apart from namesakes. Wikidata's [description guideline](https://www.wikidata.org/wiki/Help:Description) asks for "between two and twelve words," lowercase, no full stop, and no "opinionated, biased or promotional wording." For our fictional company Tallyfold, "invoicing and payments software company" passes. "The leading invoicing platform for agencies" fails twice.

## Wikidata SEO and sameAs: Linking Your Schema to the Item

A Wikidata item and your Organization markup should point at each other. The item's official website names your homepage. Your JSON-LD names the item in `sameAs`. Schema.org defines [`sameAs`](https://schema.org/sameAs) as a page "that unambiguously indicates the item's identity," and gives "Wikidata entry" as one example. The full graph pattern is in our [knowledge graph guide](/blog/knowledge-graph-for-ai).

Two facts keep this in proportion. Google's [Organization docs](https://developers.google.com/search/docs/appearance/structured-data/organization) describe `sameAs` with social and review profiles as examples, and don't mention Wikidata. And Wikidata's own request page says that for `sameAs`, "you can use any applicable URL; Wikidata is not a requirement."

### The ID crosswalk

Where an item exists, match its facts to your markup field by field. The useful finding: Google's markup and Wikidata share two global business IDs.

| Fact                 | Wikidata property      | Organization markup           |
| -------------------- | ---------------------- | ----------------------------- |
| Website              | P856                   | `url`                         |
| Legal name           | P1448                  | `legalName`                   |
| Founding date        | P571                   | `foundingDate`                |
| Founder              | P112                   | `founder`                     |
| LEI                  | P1278                  | `iso6523Code`, prefix `0199:` |
| DUNS number          | P2771                  | `iso6523Code`, prefix `0060:` |
| Crunchbase, LinkedIn | P2088, P4264 (ID only) | `sameAs`, full profile URL    |
| The item             | Its Q-number           | `sameAs`, the item's page URL |

Google says some fields, including `iso6523Code`, are "used behind the scenes to disambiguate your organization." It also encourages `iso6523Code` with the `0199:` prefix instead of `leiCode`. An LEI on both records gives two systems the same hard ID. Our free [schema generator](/tools/schema-generator) builds the Organization block with `sameAs`; add the ISO code by hand.

Only link a Wikidata item that is about your company, not a namesake. Item IDs are [persistent](https://www.wikidata.org/wiki/Help:Merge). If two items about you are merged, the old ID redirects and your link still works.

## Wikidata SEO Upkeep: Keeping the Item Accurate

An item isn't a profile you own. Anyone can edit it, and Wikidata's rules on what you may change apply for as long as it exists.

- **Watch it.** Add the item to your watchlist so you see every edit.
- **Disclose paid work.** Wikimedia's [Terms of Use](https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use) say "You must disclose each and any employer, client, intended beneficiary and affiliation" for any paid contribution. If editing is part of your job, that's you.
- **Use one account.** Wikidata's [account policy](https://www.wikidata.org/wiki/Wikidata:Alternate_accounts) bans using a second account "to appear as a neutral third-party."
- **Correct, don't promote.** The essay lets you "correct clear factual errors," but says "don't remove sourced claims." Ask for other changes on the item's talk page.
- **Keep history.** When a fact changes, add the new value with a source and keep the old one with an end date. Our [semantic drift guide](/blog/semantic-drift-ai-memory-reset) shows how. Don't delete an old website either. The property's own note says: "do not remove it."

A simple rhythm covers most companies.

| When                                | On Wikidata                                             | On your site                                                                                |
| ----------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Monthly                             | Read the item's history.                                | Check your About page matches.                                                              |
| After a move, raise or rebrand      | Add the new fact with a source. Keep the old one dated. | Update facts and markup the same day.                                                       |
| Quarterly                           | Add new independent sources.                            | Validate your markup.                                                                       |
| When an AI answer gets a fact wrong | See if the item holds the error.                        | Use our guide to [fixing wrong brand facts](/blog/fix-incorrect-brand-facts-in-ai-answers). |

## Wikidata SEO When You Don't Qualify Yet

Most young companies don't qualify for Wikidata SEO yet, and that's normal. The self-promotion essay says what to do instead: keep true facts on your website, use schema.org Organization markup "so search engines can identify you," and build "independent coverage in reliable publications." That's the whole plan.

1. **Publish one fact set.** State your name, legal name, founding date, founders, base and category on your About page. Mark it up the same way.
2. **Point `sameAs` at real profiles.** Crunchbase, LinkedIn and GitHub need no notability test.
3. **Add hard IDs you already hold.** If a bank asked you for an LEI, publish it with `iso6523Code`. Don't buy one for SEO. It won't make you notable.
4. **Earn coverage about you.** Trade press features and independent reviews are rung-2 evidence. Our [co-citation playbook](/blog/co-citation-seo) covers where that coverage comes from, and our [entity SEO](/glossary/entity-seo) entry covers consistent naming.
5. **Ask, don't create.** Once you have the coverage, request the item from an independent editor and say how you're connected. Our [step-by-step guide](/blog/create-wikidata-item-for-company) covers the request.

### Worked example: Tallyfold's evidence count

Tallyfold is a fictional invoicing and payments app for agencies. Its rivals, Brindlework and Kestrelyn, are fictional too. Here is Tallyfold's evidence, sorted on the ladder.

| Evidence                                 | Count | Rung | Counts toward notability |
| ---------------------------------------- | ----- | ---- | ------------------------ |
| About and pricing pages                  | 1     | 7    | 0                        |
| Press releases, one on a newswire        | 2     | 7    | 0                        |
| Crunchbase and LinkedIn profiles         | 2     | 5    | 0                        |
| An LEI its payments partner required     | 1     | 4    | 0                        |
| A podcast interview with the founder     | 1     | 6    | 0                        |
| An agency-tools directory listing        | 1     | 6    | 0                        |
| A trade magazine feature about Tallyfold | 1     | 2    | 1                        |
| **Total**                                | **9** |      | **1**                    |

Nine pieces of evidence, and one counts. Against the essay's rule of three, Tallyfold is two short, so it creates nothing. It publishes its fact set, adds `sameAs` links to Crunchbase and LinkedIn, puts `0199:` plus its LEI in its markup, and pitches two data stories to trade press.

Say a year later two more independent features have run. Tallyfold now meets the rule of thumb. It still doesn't create the item. It files a request with all three sources, states its conflict of interest, and lets an independent editor decide. If the item is made, Tallyfold adds the Q-number to `sameAs` and starts the monthly check.

## Where Rankbox Fits in Wikidata SEO

Rankbox doesn't create or edit Wikidata items, request them for you or earn press coverage. It doesn't track citations or watch what AI engines say about you either. It handles the writing that the ID path depends on.

The [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes 2,000 to 3,500-word source-backed articles, such as a facts page or a comparison, that reach your site through Rankbox's API. [Brand Voice](/features/brand-voice) applies the product details and style rules you give it, so every article uses the same name and category line as your markup. The Business plan is $49.50 a month, with a 7-day trial when you add a card. [See pricing](/pricing).

## Frequently Asked Questions

### What is Wikidata SEO?

Wikidata SEO is keeping a true, referenced Wikidata record of your company, if it meets Wikidata's notability policy, and linking it to your site with `sameAs` markup. It helps machines tell you apart from namesakes. It isn't a ranking trick, and creating an item about your own company is strongly discouraged.

### Does Wikidata SEO help my brand show up in ChatGPT?

No AI vendor says it uses Wikidata when it answers. Wikipedia is a documented training source and ChatGPT's most-cited site in Profound's study. Wikidata is used to test models and match IDs. A correct item may help by keeping public facts consistent, but no study shows it lifts AI mentions.

### Can I create a Wikidata item for my own company?

It isn't banned today, but Wikidata's self-promotion essay strongly discourages it and says such items are likely to be deleted. A 2026 draft policy would forbid it. The safer route is to request the item on Wikidata's Requests for new items page and state your connection.

### Does Wikidata feed Google's Knowledge Panel?

Google doesn't say so. Its help page says graph facts come from public sources, licensed data and content owners. Google offered Freebase's data to Wikidata in 2014, and its Cloud API maps entities to Wikidata IDs. How Google uses Wikidata facts isn't published.

### Do I need a Wikidata item for sameAs markup?

No. Schema.org lists a Wikidata entry as one example, and Wikidata's own request page says "Wikidata is not a requirement" for `sameAs`. Link your LinkedIn, Crunchbase, GitHub and other official profiles. Add a Wikidata link only once a real item about your company exists.

### Is Wikidata SEO worth it for a small company?

Usually not yet. Most small companies don't meet the notability bar, and items made too early tend to be deleted. Put the effort into a clear facts page, matching profiles and independent coverage. Those help on every path, and they're the evidence an item would need later.

## References

1. [Wikidata: Notability, Wikidata](https://www.wikidata.org/wiki/Wikidata:Notability)
2. [Wikidata: Self-promotion, Wikidata](https://www.wikidata.org/wiki/Wikidata:Self-promotion)
3. [Notability policy reform, Wikidata](https://www.wikidata.org/wiki/Wikidata:Requests_for_comment/Notability_policy_reform)
4. [Requests for new items, Wikidata](https://www.wikidata.org/wiki/Wikidata:Requests_for_new_items)
5. [Terms of Use, Wikimedia Foundation](https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use)
6. [WikiProject Companies: Properties, Wikidata](https://www.wikidata.org/wiki/Wikidata:WikiProject_Companies/Properties)
7. [Help: Sources, Wikidata](https://www.wikidata.org/wiki/Help:Sources)
8. [Notability of companies, Wikipedia](<https://en.wikipedia.org/wiki/Wikipedia:Notability_(organizations_and_companies)>)
9. [How Google's Knowledge Graph works, Google](https://support.google.com/knowledgepanel/answer/9787176)
10. [From Freebase to Wikidata, Google Research](https://research.google/pubs/from-freebase-to-wikidata-the-great-migration/)
11. [Enterprise Knowledge Graph Search API, Google Cloud](https://cloud.google.com/enterprise-knowledge-graph/docs/search-api)
12. [Organization structured data, Google](https://developers.google.com/search/docs/appearance/structured-data/organization)
13. [Language Models as Knowledge Bases? (2019), arXiv](https://arxiv.org/abs/1909.01066)
14. [The Wikidata Embedding Project, Wikimedia Deutschland](https://www.wikimedia.de/presse/the-wikidata-embedding-project/)
15. [Wikipedia's 25th Birthday partners, Wikimedia Enterprise](https://enterprise.wikimedia.com/blog/wikipedia-25-enterprise-partners/)
16. [AI Platform Citation Patterns, Profound](https://www.tryprofound.com/blog/ai-platform-citation-patterns)
