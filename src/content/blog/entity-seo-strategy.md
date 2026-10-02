---
title: Entity SEO Strategy: Choosing the Entities Your Site Should Own
description: An entity SEO strategy picks the brands, products, people, problems and categories your site should own, maps each to a page and schema, and tracks recognition.
keyword: entity SEO strategy
date: 2026-11-11
updated: 2026-11-11
written: 2026-10-01
author: Rankbox Team
tags: SEO, AI Search
---

An entity SEO strategy decides which entities your site should be the main source on: your brand, your products, your people, the problems you solve and the category you sell in. It sorts them into the ones you can own on your own pages, the ones you share with other sites, and the ones only third parties can give you. Then it maps each owned entity to one page and one schema type, and measures whether machines recognize it.

Entities are the things a search system knows about, as opposed to the words you type. Google made that shift public in May 2012, when it launched its Knowledge Graph with [more than 500 million objects and 3.5 billion facts](https://blog.google/products/search/introducing-knowledge-graph-things-not/) about them, under the line "things, not strings." AI answers raise the stakes for small brands. In tests of 10 models, [Mallen and colleagues](https://arxiv.org/abs/2212.10511) found language models "struggle with less popular factual knowledge," while models that retrieve pages did far better on those rare facts. For a small company, that suggests most of what an AI says will come from pages it can find, so each entity you care about needs a page that is clearly about it.

This guide is the strategy layer: what to own, where it lives and how to tell it's working. The tasks come next. Our [30-day entity authority SEO plan](/blog/entity-authority-seo) turns the decisions into weekly work, and the [entity SEO](/glossary/entity-seo) glossary entry has the short definition. For the half that other sites control, being named next to your category's leaders, see our [co-citation SEO playbook](/blog/co-citation-seo).

## Key Takeaways

- An entity SEO strategy chooses entities in five types: organization, products, people, problems and categories. Each type has a different natural authority.
- You can own the facts about your company, products and people. Problems are shared. Category membership is mostly earned from third parties.
- The Entity Ownership Matrix scores each candidate on four questions, from 0 to 2: are you the source of truth, do buyers ask, is there room to lead, and what proof do you hold.
- Give each owned entity one home page and one schema type. Google says structured data "isn't required for generative AI search," so the page's words do the main work.
- Measure recognition four ways: Google's Knowledge Graph, entity analysis of your own pages, AI answers to "what is" prompts, and branded search demand.

## The Five Entity Types in an Entity SEO Strategy

Not every entity is yours to claim. The question for each type is who the web treats as the natural authority. The example throughout is Tallyfold, a fictional invoicing and payments app for agencies, with fictional rivals Brindlework and Kestrelyn.

| Entity type  | Tallyfold example                                 | Natural authority  | What owning it means                                                  |
| ------------ | ------------------------------------------------- | ------------------ | --------------------------------------------------------------------- |
| Organization | Tallyfold                                         | You                | Your About page is the most complete, current record of the company   |
| Products     | Tallyfold Retainers, its retainer billing product | You                | Each product has one page with current, dated facts                   |
| People       | Tallyfold's founders and article authors          | You and the person | Each person has a profile page that matches their other profiles      |
| Problems     | Late client payments at agencies                  | Shared             | You publish the clearest explanation, with evidence others don't have |
| Categories   | Agency invoicing software                         | Third parties      | You can define the category, but others decide who belongs in it      |

### Organization, products and people: the facts you control

These three are yours by right, because you are the primary source for their facts. Google says Organization markup on your home page can help it "better understand your organization's administrative details and [disambiguate your organization](https://developers.google.com/search/docs/appearance/structured-data/organization) in search results." For people, Google's Article documentation says an author's URL should be "a web page that uniquely identifies the author," and it recommends [profile page markup](https://developers.google.com/search/docs/appearance/structured-data/article) when that page is on your own site.

### Problems and categories: the ground you share

Problems belong to everyone who writes about them, so you lead on one only by explaining it best, ideally with data no rival can copy. Categories are harder. You can write the best definition of "agency invoicing software," but whether you're one of its leaders is decided by roundups, reviewers and analysts. That's where your entity SEO strategy meets co-citation.

## The Entity Ownership Matrix

The Entity Ownership Matrix is Rankbox's scoring method for the first decision in any entity SEO strategy: which entities your site should own. Score each candidate from 0 to 2 on four questions:

1. **Source of truth.** Are you the primary source for its facts? 2 means only you, 1 means shared, 0 means others.
2. **Buyer demand.** Do buyers ask search engines or AI about it? 2 means often, 1 means sometimes, 0 means rarely.
3. **Room to lead.** How crowded is it? 2 means no clear owner, 1 means contested, 0 means a giant or reference site owns it.
4. **Proof you hold.** Do you have data, documentation or experts to show? 2 means original data or deep docs, 1 means some, 0 means none.

Then apply four rules:

- **Own:** source of truth is 2 and the total is 5 or more. Build a dedicated page and mark it up.
- **Share:** total of 5 or more, but you aren't the only source of truth. Publish the definitive explanation and earn third-party mentions alongside it.
- **Earn:** total of 3 or 4. Don't claim it on your own pages. Work on getting others to name you with it.
- **Skip:** total of 2 or less. Mention it where it helps a reader, but don't build around it.

One edge case: if you're the source of truth but the total is under 5, keep its facts on an existing page, such as your About page, instead of building a new one.

### Worked example: Tallyfold's candidates

These scores are illustrative, chosen to show how the rules sort entities. Buyer demand can come from Search Console, a prompt panel or Rankbox's [Answer-Space Research](/features/answer-space-research), which gives model estimates of volume and intent.

| Candidate                          | Type          | Source of truth | Buyer demand | Room to lead | Proof | Total | Decision |
| ---------------------------------- | ------------- | --------------- | ------------ | ------------ | ----- | ----- | -------- |
| Tallyfold                          | Organization  | 2               | 2            | 2            | 2     | 8     | Own      |
| Tallyfold Retainers                | Product       | 2               | 1            | 2            | 2     | 7     | Own      |
| Tallyfold's CEO                    | Person        | 2               | 0            | 2            | 1     | 5     | Own      |
| Retainer invoicing                 | Problem       | 1               | 2            | 1            | 2     | 6     | Share    |
| Days to payment on agency invoices | Problem       | 1               | 1            | 2            | 2     | 6     | Share    |
| Agency invoicing software          | Category      | 0               | 2            | 1            | 1     | 4     | Earn     |
| Accounts receivable                | Broad concept | 0               | 2            | 0            | 0     | 2     | Skip     |
| Brindlework                        | Rival         | 0               | 1            | 0            | 0     | 1     | Skip     |

Two rows need a note. The CEO scores low on demand but still lands in Own, because nobody else can be the source of truth about them, and Google's Article guidance asks for an author URL that points to a page identifying the person. "Days to payment" scores 6 because Tallyfold holds anonymized invoice data that no rival can copy. That's the kind of entity a small company can lead on. The rival, Brindlework, scores 1: you'll name it on fair comparison pages, but your site is never its home.

## Map Each Owned Entity to One Page and One Schema Type

An entity SEO strategy works only if each entity has one clear home. Two pages that both claim to define the same thing split the signal, the problem our glossary calls [keyword cannibalization](/glossary/keyword-cannibalization). Use this map for the Own and Share rows.

| Entity type  | Its home page                 | Schema type                                     | Notes                                                                                                                                           |
| ------------ | ----------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Organization | About page or home page       | `Organization` with a stable `@id` and `sameAs` | Google uses some properties "behind the scenes" to tell organizations apart                                                                     |
| Product      | One page per product          | `SoftwareApplication` or `Product`              | Google lists "Software app" among its [supported features](https://developers.google.com/search/docs/appearance/structured-data/search-gallery) |
| Person       | A profile page on your site   | `ProfilePage` with a `Person`                   | Google says it "can understand both sameAs and url when disambiguating authors"                                                                 |
| Problem      | A guide or explainer          | `Article` with `about`                          | schema.org defines `about` as "The subject matter of an object"                                                                                 |
| Category     | A glossary or definition page | `DefinedTerm`, optional                         | schema.org defines it, but Google's Search Gallery doesn't list it as a feature                                                                 |

Three rules keep the map honest. First, mark up only what the page shows: Google's [structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) say "Don't mark up content that is not visible to readers of the page." Second, write the facts in plain sentences, because Google's [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) says structured data "isn't required for generative AI search, and there's no special schema.org markup you need to add." Third, link pages the way the entities relate, such as articles to their authors. Our [SEO knowledge graph guide](/blog/seo-knowledge-graph) shows the `@id` pattern, and the free [schema markup generator](/tools/schema-generator) writes the JSON-LD.

## Claim or Earn: What You Can Say About Yourself

The last choice in an entity SEO strategy is which statements belong on your own pages and which must come from someone else. Google's quality rater guidelines (September 2025) set the tone. Raters are told to ask, ["What do outside, independent sources say about them?"](https://guidelines.raterhub.com/searchqualityevaluatorguidelines.pdf) and, when a site and reputable independent sources disagree, to "trust the independent sources."

| Claim it on your own pages                                  | Earn it from third parties                      |
| ----------------------------------------------------------- | ----------------------------------------------- |
| Legal and brand name, founding date, founders, headquarters | "One of the leading agency invoicing tools"     |
| Product features, plans and dated prices                    | "Best for small agencies" and other rankings    |
| Integrations that exist today                               | Reviews and star ratings                        |
| Your own data, with its method                              | Awards and analyst placements                   |
| Fair comparisons that name rivals accurately                | A Wikidata item, created under Wikidata's rules |

The right column has legal edges too. The FTC's [reviews rule](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-D/part-465) bars a business from presenting a site it controls as one that "provides independent reviews or opinions" about a category that includes its own products. And Wikidata's [notability policy](https://www.wikidata.org/wiki/Wikidata:Notability) accepts an item for an entity "that can be described using serious and publicly available references," which means coverage by others comes first. Our [Wikidata SEO guide](/blog/wikidata-seo) explains who qualifies, and our guide to [entity authority in the AI era](/blog/entity-authority-in-the-ai-era) shows how to look your company up today.

For the Earn rows, the method is co-citation: roundups, review sites, podcasts and forums that name you next to the category's leaders. The [co-citation SEO playbook](/blog/co-citation-seo) covers it source by source, and our [definition of co-citation in SEO](/blog/what-is-co-citation-in-seo) explains how it differs from co-occurrence.

## How to Measure Entity Recognition

An entity SEO strategy needs a scoreboard, even a rough one. Check these signals each quarter for every Own and Share entity, and add branded impressions from Search Console as a fourth: rising demand with no campaign behind it suggests people are meeting the name elsewhere.

### Does Google's Knowledge Graph know it?

Google's [Knowledge Graph Search API](https://developers.google.com/knowledge-graph) "lets you find entities in the Google Knowledge Graph" and returns schema.org types. Query your brand and product names and check that the right entity comes back with your website. Google calls the API "not suitable for use as a production-critical service," so treat it as a spot check. Our [Knowledge Graph Search API guide](/blog/knowledge-graph-search-api) has working requests.

### Do your own pages read as being about it?

Google Cloud's Natural Language API can run entity analysis on any text. In its v1 version, each entity comes with a [salience score](https://cloud.google.com/natural-language/docs/reference/rest/v1/Entity) from 0 to 1 for its "importance or centrality" to the text, plus a Wikipedia URL and Knowledge Graph ID "if they are available." The v2 reference doesn't list salience, so pick v1 for this check. Run the home page for an entity through it, and that entity should come out on top.

### Do AI answers describe it correctly?

Ask three AI engines "What is Tallyfold?", "Who makes Tallyfold Retainers?" and "What is retainer invoicing?", three times each, and mark each answer right or wrong. The share of correct answers is the Accuracy Rate from our [GEO metrics framework](/blog/geo-metrics-framework). Our free [AI Visibility Prompt Kit](/tools/ai-visibility-prompt-generator) drafts the category prompts.

### The Entity Recognition Scorecard

| Entity              | Knowledge Graph            | Top salience on its page  | AI answers correct (of 9) | Branded impressions, month |
| ------------------- | -------------------------- | ------------------------- | ------------------------- | -------------------------- |
| Tallyfold           | Found, right website       | Yes                       | 5                         | 2,400                      |
| Tallyfold Retainers | Not found                  | Yes                       | 2                         | 310                        |
| Retainer invoicing  | Found as a general concept | No, Tallyfold ranks first | 7                         | Not branded                |

These Tallyfold numbers are illustrative. The company is known, its product isn't yet, and its explainer on retainer invoicing reads as a page about Tallyfold, not the problem. That last row is a quick fix: let the problem lead the opening and the product follow.

## Where Rankbox Fits

Rankbox handles the writing side of an entity SEO strategy. Answer-Space Research maps the questions buyers ask ChatGPT, Perplexity and Google, with volume, difficulty and intent as model estimates, which fills in the buyer demand column. The [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes 2,000 to 3,500-word source-backed articles for the Own and Share rows, and [Brand Voice](/features/brand-voice) keeps your names and product details consistent in every draft. Rankbox doesn't edit Wikidata, earn third-party mentions for you or track AI citations. The Business plan is $49.50 a month with a 7-day trial ([pricing](/pricing)).

## Frequently Asked Questions

### What is an entity SEO strategy?

An entity SEO strategy is a plan for which entities your site should be the main source on, such as your company, products, people, problems and category. It decides which to own, share or earn, gives each owned entity one page and schema type, and measures whether search engines and AI recognize them.

### How is entity SEO different from keyword SEO?

Keyword SEO targets the words people type. Entity SEO targets the things those words refer to, so search engines and AI can tell which company, product or concept you mean. Keywords still matter for wording, but entities decide whether you're recognized as one distinct thing with the right facts.

### Which entities should a small company's entity SEO strategy start with?

Start with the ones only you can be the source of truth for: the company, its main product and its founders. Then pick one problem where you hold original data or deep expertise. Leave broad category terms for third parties to connect you with.

### Do I need schema markup for an entity SEO strategy?

It helps, but it isn't required. Google says structured data isn't required for its generative AI search and that no special markup is needed. Organization markup still helps Google tell your company apart from others. Write the facts in plain text first, then mark up only what the page shows.

### How do I know if Google recognizes my brand as an entity?

Query your brand in Google's Knowledge Graph Search API and check that the right entity comes back with your website. A knowledge panel in search results is another sign. If neither appears, keep your facts consistent and earn independent coverage, since Google's systems weigh what outside sources say.

### How long does an entity SEO strategy take to show results?

Your own pages can be crawled within days, and AI answers that search the web can reflect them within weeks. Knowledge Graph entries and what models know without searching move more slowly, often over months, because they depend on independent sources and retraining.

## References

1. [Introducing the Knowledge Graph: things, not strings, Google (2012)](https://blog.google/products/search/introducing-knowledge-graph-things-not/)
2. [When Not to Trust Language Models (Mallen et al., 2023), arXiv](https://arxiv.org/abs/2212.10511)
3. [Organization structured data, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/organization)
4. [Article structured data, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/article)
5. [Profile page structured data, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
6. [Structured data markup that Google Search supports, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/search-gallery)
7. [General structured data guidelines, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
8. [Optimizing for generative AI features on Google Search, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
9. [about, schema.org](https://schema.org/about)
10. [DefinedTerm, schema.org](https://schema.org/DefinedTerm)
11. [Search Quality Rater Guidelines (September 2025), Google](https://guidelines.raterhub.com/searchqualityevaluatorguidelines.pdf)
12. [Rule on the Use of Consumer Reviews and Testimonials, 16 CFR Part 465, eCFR](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-D/part-465)
13. [Wikidata: Notability, Wikidata](https://www.wikidata.org/wiki/Wikidata:Notability)
14. [Google Knowledge Graph Search API, Google for Developers](https://developers.google.com/knowledge-graph)
15. [Entity (v1 reference), Cloud Natural Language API, Google Cloud](https://cloud.google.com/natural-language/docs/reference/rest/v1/Entity)
16. [Entity (v2 reference), Cloud Natural Language API, Google Cloud](https://cloud.google.com/natural-language/docs/reference/rest/v2/Entity)
