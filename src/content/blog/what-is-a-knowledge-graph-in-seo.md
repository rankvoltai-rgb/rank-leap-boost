---
title: What Is a Knowledge Graph in SEO?
description: A knowledge graph in SEO is a database of entities and the facts linking them. How Google's works, how panels and schema fit in, and why AI cares.
keyword: knowledge graph in SEO
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: SEO, Technical SEO
---

A knowledge graph in SEO is a database of entities (people, companies, products, places and ideas) and the facts that connect them, which a search engine uses to understand what a search is about instead of just matching words. When SEOs say "the Knowledge Graph," they usually mean Google's, launched on 16 May 2012. It's the source of the knowledge panel that can appear beside a search for your brand.

Google summed up the change in its launch post as ["things, not strings."](https://blog.google/products/search/introducing-knowledge-graph-things-not/) Before it, the words [taj mahal] were just two words to a search engine. With it, Google could tell the monument from the Grammy-winning musician and the Atlantic City casino, and show facts about the one you meant.

This post is the plain definition of a knowledge graph in SEO: where the graph came from, how entities differ from keywords, what knowledge panels are, and how structured data and AI answers fit in. To build a connected set of entities for your own brand, read our guide to [building a knowledge graph for AI](/blog/knowledge-graph-for-ai).

## Key Takeaways

- A knowledge graph in SEO usually means Google's Knowledge Graph. It launched in May 2012 with over 500 million objects and, by 2020, held over 500 billion facts about five billion entities.
- The unit is the entity, not the keyword. An entity has an identity, a type, attributes and relationships, so a search engine can tell namesakes apart.
- Knowledge panels are the visible part of the graph. Google generates them automatically. You can claim one that exists, but there's no form to request one.
- Structured data and `sameAs` links help Google identify your organization and tell it apart from others. Google doesn't promise that markup alone gets you in.
- Google says AI Mode can draw on the Knowledge Graph. Other assistants use their own search providers, so consistent facts across the web matter everywhere.

## Where Google's Knowledge Graph Came From

Google announced the Knowledge Graph on 16 May 2012. At launch it held "more than 500 million objects, as well as more than 3.5 billion facts about and relationships between these different objects." It drew on public sources such as Freebase, Wikipedia and the CIA World Factbook, and rolled out first to US English users.

Freebase was an open, shared database of facts. It [ran from 2007 to 2015](https://developers.google.com/freebase), and Wikidata notes that its old `/m/` IDs are [still used by Google's Knowledge Graph](https://www.wikidata.org/wiki/Property:P646).

By May 2020 the graph was far bigger. Google's [reintroduction post](https://blog.google/products/search/about-knowledge-graph-and-knowledge-panels/) put it at "over 500 billion facts about five billion entities," drawn from "hundreds of sources from across the web, including licensing data." Wikipedia is "a commonly-cited source, but it's not the only one." Google also said it draws "from special coding that content owners can use, such as to indicate upcoming events," which describes structured data such as event markup.

That's the core of what a knowledge graph in SEO is: a huge, automatically built store of who and what exists, and how those things relate.

## Entities vs Keywords: The Strings-to-Things Map

Entities are the building blocks of any knowledge graph in SEO. A keyword is a string of letters; an entity is a thing with an identity. It has a type (company, person, product), attributes (founded in 2021, costs $10 per user a month) and relationships (founded by, made by, sold by). Two entities can share a name and still be told apart by those facts.

The map below shows the difference for Plannora, a made-up project management tool, and its made-up rival Taskwell. Read each row left to right: what someone types, what a pure word-matcher sees, what an entity-aware engine sees, and what your site should state so the entity view comes out right.

| Someone searches | A string matcher sees | An entity-aware engine sees | What your site should state |
| --- | --- | --- | --- |
| plannora | Eight letters, on any page that contains them | A company of type Organization, if it can tell which one | Name plus category ("Plannora, project management software") in titles, bios and profiles |
| who founded plannora | Pages with "founded" and "plannora" | A founder relationship from the company to two people | Founders' full names on the About page, marked up as Person |
| plannora pricing | Pages with the word "pricing" | Offers attached to the product, with prices | Prices with currency and unit, dated, on the pricing page |
| plannora vs taskwell | Pages with both names | Two entities of the same type to compare | A comparison page that names both and their categories |
| plannora api | Pages with "api" | A software product with docs and a code repository | A developer page that links the official repository |

We call this the Strings-to-Things Map. The last column is the useful part. Every row is a fact you can state once, clearly, on the page where it belongs.

## Knowledge Panels: The Part of the Graph You Can See

Google's [knowledge panel help](https://support.google.com/knowledgepanel/answer/9163198) describes panels as "information boxes that appear on Google when you search for entities (people, places, organizations, things) that are in the Knowledge Graph." The 2020 post lists what they usually hold: a title and summary, a longer description, pictures, key facts, and "links to social profiles and official websites."

For most brands, the panel is the only visible sign of the knowledge graph in SEO. Three facts about panels matter:

1. **They're automatic.** Google says panels are "automatically generated" and "updated automatically as information changes on the web."
2. **You can claim one, not request one.** If you're the subject or its official representative, you can [get verified](https://support.google.com/knowledgepanel/answer/7534902) and suggest changes. Google adds that "not all knowledge panels are claimable as of now." Anyone else can use the Feedback link.
3. **Local businesses are different.** A shop or clinic that serves customers in person manages its profile through Google Business Profile, a separate system.

### Knowledge Graph vs knowledge panel

The Knowledge Graph is the database. A knowledge panel is one view of one entity in it, and it only appears for some searches, so a missing panel doesn't prove you're missing from the graph. To see whether you're there, query Google's [Knowledge Graph Search API](/blog/knowledge-graph-search-api), which returns matching entities with their IDs and descriptions.

## How Structured Data and sameAs Feed the Knowledge Graph in SEO

Structured data is code on your pages that labels facts for machines. Google's [introduction to structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) says it uses this markup "to understand the content of the page, as well as to gather information about the web and the world in general, such as information about the people, books, or companies that are included in the markup."

For a company, the main type is Organization. Google's [Organization guide](https://developers.google.com/search/docs/appearance/structured-data/organization) says the markup can help it "disambiguate your organization in search results," and that some properties can influence "which logo is shown in Search results and your knowledge panel."

### What sameAs does

The `sameAs` property lists pages elsewhere that describe the same entity. Schema.org defines it as the URL of a page "that unambiguously indicates the item's identity," such as a Wikipedia page, a Wikidata entry or an official website. A minimal block looks like this (the profile URLs are placeholders for the made-up brand):

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Plannora",
  "url": "https://plannora.io/",
  "sameAs": [
    "https://www.linkedin.com/company/plannora-hq",
    "https://www.crunchbase.com/organization/plannora-hq"
  ]
}
```

Each `sameAs` link is a claim that your site and that profile describe one entity. When the profiles use the same name and description and link back to your site, the claim is easy to check. For how to connect several entities with IDs across a whole site, see our guide to building an [SEO knowledge graph](/blog/seo-knowledge-graph).

### What markup can't do

Markup describes; it doesn't decide. Google names no form, fee or markup that guarantees a place in its graph, and it doesn't publish how much weight structured data carries against other sources. The markup must also match what people can see: Google's guidelines say not to mark up information that isn't visible on the page. If the facts in your code disagree with your LinkedIn page, you've added doubt, not clarity.

## How the Knowledge Graph Relates to AI Answers

For Google's own AI, the link is documented. In March 2025 Google said AI Mode can ["tap into fresh, real-time sources like the Knowledge Graph."](https://blog.google/products/search/ai-mode-search/) At the same time, its [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) says structured data "isn't required for generative AI search, and there's no special schema.org markup you need to add." Both can be true: the graph is one of many inputs, and markup is one of many ways facts reach it.

Other assistants don't document using Google's graph. OpenAI [says](https://help.openai.com/en/articles/9237897-chatgpt-search) ChatGPT search "sometimes partners with other search providers," and its help page names Microsoft and Shopify. What these systems share is the raw material: pages and profiles across the web. So the practical point of a knowledge graph in SEO today is consistency. When your site, your profiles and independent sources state the same facts, any system, graph-based or not, has an easier time getting you right.

One more distinction. Search-grounded answers can pick up a corrected page once it's re-crawled. What a model learned in training changes only when its maker trains a new version. Our [knowledge graph for AI](/blog/knowledge-graph-for-ai) guide covers both paths and the full markup for a brand.

For the entity side of this work, the [entity SEO](/glossary/entity-seo) glossary entry is a good next read, and our [business guide to AI search](/blog/optimize-business-for-ai-search) covers keeping facts identical across listings.

If you want pages that state your facts clearly, Rankbox can help with the writing. Its [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask AI engines, and its Citation-Ready Writer writes source-backed articles that reach your site through Rankbox's API. It doesn't track how AI engines describe you. The Business plan is $49.50 a month with a 7-day trial ([pricing](/pricing)). The free [schema generator](/tools/schema-generator) builds Organization markup like the block above.

## Frequently Asked Questions

### What is a knowledge graph in SEO?

A knowledge graph in SEO is a database of entities and the facts linking them, which search engines use to understand queries as things rather than words. Most SEOs mean Google's Knowledge Graph, launched in 2012, which powers knowledge panels and helps Google tell namesakes apart.

### What is the difference between the Knowledge Graph and a knowledge panel?

The Knowledge Graph is Google's database of entities and facts. A knowledge panel is the information box Google shows for some searches about one entity in that database. A missing panel doesn't prove the entity is missing from the graph.

### How do I get my business into Google's Knowledge Graph?

There's no application. Google builds the graph automatically from hundreds of sources. State your facts clearly on your own site with Organization markup, keep your profiles identical, and earn coverage from independent sources. Local businesses should also complete a Google Business Profile.

### Does schema markup get you a knowledge panel?

Not on its own. Google says Organization markup can help it disambiguate your company and choose the logo in your panel, but panels are generated automatically from sources across the web. Markup is one input among many, and it must match what's visible on the page.

### How do I check if my brand is in the Knowledge Graph?

Search your brand on Google and look for a knowledge panel, then query the Knowledge Graph Search API with your brand name. If the API returns an entity with your name, type and website, Google has you in its graph, even without a panel.

### Does the knowledge graph in SEO affect AI search?

Partly. Google says AI Mode can draw on the Knowledge Graph, but also that no special markup is needed for its AI features. Other assistants use their own search providers, so the lasting benefit is consistent, well-sourced facts that every system can read.

## References

1. [Introducing the Knowledge Graph: things, not strings, Google](https://blog.google/products/search/introducing-knowledge-graph-things-not/)
2. [A reintroduction to our Knowledge Graph and knowledge panels, Google](https://blog.google/products/search/about-knowledge-graph-and-knowledge-panels/)
3. [About knowledge panels, Knowledge Panel Help](https://support.google.com/knowledgepanel/answer/9163198)
4. [Get verified on Google, Knowledge Panel Help](https://support.google.com/knowledgepanel/answer/7534902)
5. [Introduction to structured data markup in Google Search, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
6. [Organization structured data, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/organization)
7. [sameAs, Schema.org](https://schema.org/sameAs)
8. [Expanding AI Overviews and introducing AI Mode, Google](https://blog.google/products/search/ai-mode-search/)
9. [Optimizing your website for generative AI features on Google Search, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
10. [Searching the web with ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/9237897-chatgpt-search)
11. [Freebase API (Deprecated): Data Dumps, Google for Developers](https://developers.google.com/freebase)
12. [Google Knowledge Graph Search API, Google for Developers](https://developers.google.com/knowledge-graph)
13. [Freebase ID (P646), Wikidata](https://www.wikidata.org/wiki/Property:P646)
