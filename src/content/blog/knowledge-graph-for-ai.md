---
title: Building a Knowledge Graph for AI: How to Connect Entities for LLMs
description: How to build a knowledge graph for AI: connect founders, products, code and pricing with JSON-LD @id and sameAs links that machines can follow.
keyword: knowledge graph
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Technical SEO
---

Building a knowledge graph for AI means describing your company as connected entities instead of loose pages. You name each thing (the organization, its founders, its product, its code, its prices), give each one a stable ID, link them to each other in schema.org JSON-LD, and point `sameAs` at the same entities on Wikidata, Crunchbase and your official profiles. Search engines and language models can then tell your brand from its namesakes and join up its facts.

Google has run the best-known knowledge graph since [May 2012](https://blog.google/products/search/introducing-knowledge-graph-things-not/), when it launched with more than 500 million objects and 3.5 billion facts. By [2020](https://blog.google/products/search/about-knowledge-graph-and-knowledge-panels/) it held over 500 billion facts about five billion entities. In March 2025 Google said its AI Mode can ["tap into fresh, real-time sources like the Knowledge Graph."](https://blog.google/products/search/ai-mode-search/)

Be clear about what markup does, though. Google's own [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) says structured data "isn't required for generative AI search, and there's no special schema.org markup you need to add." So a brand graph isn't a ranking switch. It removes guesswork: it states who founded you, what you sell and what it costs, in a form any parser can read, and it ties your site to the profiles that confirm it.

This guide covers where vector embeddings and graphs meet inside generative AI, a complete JSON-LD graph for a fictional company, how the pieces connect, a checklist and how to validate it. If you're new to the term, start with [what a knowledge graph in SEO is](/blog/what-is-a-knowledge-graph-in-seo).

## Key Takeaways

- A brand knowledge graph is a set of entities with stable IDs and typed links. Organization, Person, SoftwareApplication, Product, Offer and SoftwareSourceCode cover most software companies.
- `@id` connects entities inside your own site. `sameAs` connects each one to the same entity elsewhere, such as Wikidata, Crunchbase, GitHub or LinkedIn.
- Google says AI Mode draws on its Knowledge Graph, and also that structured data isn't required for its generative AI features. Treat markup as disambiguation, not a ranking lever.
- Most retrieval systems search by vector similarity. Graph-based retrieval, such as Microsoft's GraphRAG, extracts entities and relationships from text, which rewards pages that state those relationships plainly.
- In Microsoft's GraphRAG paper, graph-based answers beat plain vector retrieval on comprehensiveness in 72–79% of head-to-head comparisons. Plain vector retrieval still gave the most direct answers.
- Publishing and re-indexing change what search-grounded answers can find within days to weeks. They don't change a model's trained weights; only the vendor's next training run does that.
- Validate twice, with the Schema Markup Validator for schema.org and the Rich Results Test for Google's features. Then check what AI answers say about your facts with an Accuracy Rate.

## Three Meanings of "Knowledge Graph" (and the One You Build)

People use the same phrase for three different things. Mixing them up is why so much advice on this topic promises more than markup can deliver.

| Meaning | Who builds it | What you control | Read next |
| --- | --- | --- | --- |
| Google's Knowledge Graph | Google, from hundreds of sources | Nothing directly; you influence the sources | [Knowledge Graph Search API guide](/blog/knowledge-graph-search-api) |
| Your site's SEO knowledge graph | You, in JSON-LD | Everything on your own pages | [How to build an SEO knowledge graph](/blog/seo-knowledge-graph) |
| A graph inside an AI system | The AI vendor or app, often extracted from text | Only the text and markup it reads | This guide |

Three quick answers, since each has its own guide:

- **What is a knowledge graph in SEO?** It's a database of entities (people, companies, products, places) and the facts that link them, which search engines use to understand what a query is about. Google's is the best known. Our [glossary entry](/glossary/knowledge-graph) covers panels and how to check yours.
- **What is the Knowledge Graph Search API?** A free, read-only Google API that returns matching entities with an ID, types and a description. It finds entities; it can't add or edit them.
- **What is an SEO knowledge graph?** The connected schema.org markup across your own site, where every page points at the same entity IDs.

This guide is about the third meaning and how your brand graph feeds it. The markup is the same whichever system reads it.

![Introducing the Knowledge Graph](youtube:mmQl6VGvX-c "Google introduced its Knowledge Graph in May 2012: people, places and things, and how they connect.")

## How Vector Embeddings and Knowledge Graphs Meet in Generative AI

Most articles on this topic are either academic papers or knowledge panel tutorials. The part that matters for a brand sits between them: how systems that search by meaning use graphs of explicit facts.

### Two ways to store what a machine knows, plus a third

A **graph** stores facts as triples: subject, relationship, object. "Plannora, founder, Maya Okafor" is one triple. Graphs are exact and easy to audit, but somebody has to build them.

A **vector** store turns text into embeddings, long lists of numbers where texts with similar meanings sit close together. It can be built from any pile of documents and it matches meaning well. It's weaker at exact facts and at chains like "who founded the company that makes this app?"

The third store is the model's **weights**, the knowledge it absorbed in training. The original [RAG paper](https://arxiv.org/abs/2005.11401) (Lewis et al., 2020) calls this "parametric" memory and pairs it with "non-parametric memory": a "dense vector index of Wikipedia, accessed with a pre-trained neural retriever."

| Store | What it holds | Strong at | Weak at | How you influence it | How fast it changes |
| --- | --- | --- | --- | --- | --- |
| Vector index | Chunks of text as embeddings | Matching meaning and paraphrase | Exact facts, multi-step links | Clear pages that define things | As fast as pages are re-crawled |
| Knowledge graph | Entities and typed relationships | Exact facts, disambiguation, chains | Anything nobody extracted | Markup and plainly stated relationships | As fast as the graph is rebuilt |
| Model weights | Patterns learned in training | Fluent recall without search | Recent or niche facts | Being described widely before a training cut-off | Only when the vendor retrains |

### Retrieval-augmented generation starts with vectors

Retrieval-augmented generation (RAG) fetches relevant text at question time and hands it to the model. Our explainer on [how RAG reduces hallucinations](/blog/how-does-rag-reduce-hallucinations) covers what that fixes and what it doesn't. Microsoft's [GraphRAG documentation](https://microsoft.github.io/graphrag/) notes that "the majority of RAG approaches use vector similarity as the search technique," which it calls baseline RAG. It also names the weakness: baseline RAG "struggles to connect the dots" when an answer needs facts spread across documents.

Rankbox's own [similarity experiment](/blog/vector-distance-vs-keyword-density) shows what vector matching rewards at the passage level: per percentage point of density, a definition sentence moved cosine similarity 3.2 times as much as a keyword mention (median of 8 open embedding models). Clear statements of what a thing is carry more weight than repeated names.

### GraphRAG: text in, graph out, answers on top

In ["From Local to Global"](https://arxiv.org/abs/2404.16130) (Edge et al., Microsoft Research, April 2024, revised February 2025), a language model reads a document collection and builds the graph itself. It works in two stages: first "derive an entity knowledge graph from the source documents," then write summaries for clusters of closely related entities. The [indexing steps](https://microsoft.github.io/graphrag/) are to extract "all entities, relationships, and key claims" from chunks of text, cluster the graph, and summarize each cluster.

At question time the two stores meet. GraphRAG's [local search](https://microsoft.github.io/graphrag/query/local_search/) embeds the question, finds entities "semantically-related to the user input," and uses them as "access points into the knowledge graph." It then pulls connected entities, relationships and the source text chunks tied to them. Vectors find the door; the graph shows the rooms behind it.

The results are specific to the test. The paper used two collections of about a million tokens each, podcast transcripts and news articles, with a language model judging pairs of answers. In its head-to-head chart, GraphRAG's answers beat plain vector RAG on comprehensiveness 72–79% of the time on both collections, and on diversity 75–81% (podcasts) and 62–71% (news). Plain vector RAG still gave the most direct answers. At the top level of the graph, GraphRAG needed over 97% fewer tokens than summarizing the source text.

### Hybrid retrieval: no single winner

Combining both stores doesn't win everywhere either. In [HybridRAG](https://arxiv.org/abs/2408.04948) (BlackRock and NVIDIA, August 2024), tested on earnings call transcripts, the hybrid scored highest for answer relevancy (0.96, against 0.91 for vector and 0.89 for graph). The graph alone had the best context precision (0.96 against 0.84 for vector). A [survey of graph RAG methods](https://arxiv.org/abs/2408.08921) splits the whole family into three stages: graph-based indexing, graph-guided retrieval and graph-enhanced generation.

Databases have moved the same way. Neo4j's [vector indexes](https://neo4j.com/docs/cypher-manual/current/indexes/semantic-indexes/vector-indexes/) store embeddings as properties of graph nodes, so one query can match by meaning and then follow relationships. A [2024 roadmap paper](https://arxiv.org/abs/2306.08302) on unifying language models and knowledge graphs describes the pairing: models "often fall short of capturing and accessing factual knowledge," while graphs "explicitly store rich factual knowledge."

### What the engines actually document

Here is the honest limit. Google documents that AI Mode can use its Knowledge Graph, and that its AI features rest on RAG over its core Search ranking systems. OpenAI [says](https://help.openai.com/en/articles/9237897-chatgpt-search) ChatGPT search "sometimes partners with other search providers" and rewrites your question into targeted queries; its help page names Microsoft and Shopify. As of September 2026, no AI search engine's public documentation describes running GraphRAG over a site's schema.org markup.

So don't build for an imagined pipeline. Build a graph that's unambiguous on every path: explicit in markup for systems that parse it, and plain in text for systems that extract entities from prose.

### Retrieval changes fast; weights don't

When you publish a page or fix a fact, search-grounded answers in ChatGPT, Perplexity, Google's AI Overviews and Copilot can pick it up once the page is re-crawled and re-indexed, usually within days to weeks. A model's trained weights don't change. What it "remembers" without searching updates only when the vendor trains a new version on newer data. Clear pages and a clean graph help the first path and, over time, add consistent facts to the text future training runs may see. Neither can overwrite the second. If your product has changed direction, our guide to [semantic drift](/blog/semantic-drift-ai-memory-reset) covers the full cleanup.

## The Seven-Node Brand Graph

This is Rankbox's model for a software company's minimum graph. Seven nodes cover the four things buyers and machines ask about most: who runs the company, what it makes, where its code lives, and what it costs. Each node has a job, a home page on your site, and edges to the others.

| # | Node | schema.org type | Key edges (property → target) | Where the fact must be visible | Why a machine cares |
| --- | --- | --- | --- | --- | --- |
| 1 | The company | `Organization` | `founder` → nodes 2 and 3; `sameAs` → Wikidata, Crunchbase, LinkedIn, GitHub, X | About page | Anchors every other node and separates you from namesakes |
| 2 | Founder one | `Person` | `worksFor` → node 1; `sameAs` → personal profiles | About or team page | Answers "who founded X?" with a checkable person |
| 3 | Founder two | `Person` | Same as node 2 | About or team page | Same |
| 4 | The product | `SoftwareApplication` + `Product` | `publisher` and `brand` → node 1; `offers` → nodes 5 and 6 | Home or product page | Ties the product name to the company and its prices |
| 5 | Free plan | `Offer` | `itemOffered` → node 4; `offeredBy` → node 1 | Pricing page | States the entry price as a number, not a guess |
| 6 | Paid plan | `Offer` + `UnitPriceSpecification` | Same as node 5, plus price per user per month | Pricing page | Makes the unit of the price explicit |
| 7 | The code | `SoftwareSourceCode` | `codeRepository` → GitHub; `targetProduct` → node 4; `maintainer` → node 1 | Developer docs page | Links the repo to the product and the company |

Two rules make the model work. Every edge has to be true and visible on your site, because Google's [structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) say not to mark up information that isn't visible to users. And every node needs a stable `@id`, so each page can point at the same thing.

## The Complete JSON-LD Graph for Plannora

Plannora is a made-up project management tool. Every URL, handle and ID below is a placeholder. In particular, `Q000000000` is not a real Wikidata item, and the `plannora-hq` and `example-` profiles are invented. Swap in your own, and delete any line you can't back up.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://plannora.io/#org",
      "name": "Plannora",
      "legalName": "Plannora Labs, Inc.",
      "url": "https://plannora.io/",
      "logo": "https://plannora.io/brand/plannora-logo.png",
      "description": "Project management software for creative agencies.",
      "foundingDate": "2021-04-12",
      "founder": [
        { "@id": "https://plannora.io/about#maya-okafor" },
        { "@id": "https://plannora.io/about#tom-lindqvist" }
      ],
      "sameAs": [
        "https://www.wikidata.org/wiki/Q000000000",
        "https://www.crunchbase.com/organization/plannora-hq",
        "https://www.linkedin.com/company/plannora-hq",
        "https://github.com/plannora-hq",
        "https://x.com/plannora_hq"
      ]
    },
    {
      "@type": "Person",
      "@id": "https://plannora.io/about#maya-okafor",
      "name": "Maya Okafor",
      "jobTitle": "Co-founder and CEO",
      "worksFor": { "@id": "https://plannora.io/#org" },
      "sameAs": [
        "https://www.linkedin.com/in/example-maya-okafor",
        "https://x.com/example_mokafor"
      ]
    },
    {
      "@type": "Person",
      "@id": "https://plannora.io/about#tom-lindqvist",
      "name": "Tom Lindqvist",
      "jobTitle": "Co-founder and CTO",
      "worksFor": { "@id": "https://plannora.io/#org" },
      "sameAs": [
        "https://github.com/example-tlindqvist",
        "https://www.linkedin.com/in/example-tom-lindqvist"
      ]
    },
    {
      "@type": ["SoftwareApplication", "Product"],
      "@id": "https://plannora.io/#app",
      "name": "Plannora",
      "url": "https://plannora.io/",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web, iOS, Android",
      "brand": { "@id": "https://plannora.io/#org" },
      "publisher": { "@id": "https://plannora.io/#org" },
      "offers": [
        { "@id": "https://plannora.io/pricing#free" },
        { "@id": "https://plannora.io/pricing#team" }
      ]
    },
    {
      "@type": "Offer",
      "@id": "https://plannora.io/pricing#free",
      "name": "Free plan",
      "price": 0,
      "priceCurrency": "USD",
      "url": "https://plannora.io/pricing",
      "itemOffered": { "@id": "https://plannora.io/#app" },
      "offeredBy": { "@id": "https://plannora.io/#org" }
    },
    {
      "@type": "Offer",
      "@id": "https://plannora.io/pricing#team",
      "name": "Team plan",
      "price": 10,
      "priceCurrency": "USD",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": 10,
        "priceCurrency": "USD",
        "referenceQuantity": {
          "@type": "QuantitativeValue",
          "value": 1,
          "unitText": "user"
        },
        "billingDuration": "P1M"
      },
      "url": "https://plannora.io/pricing",
      "itemOffered": { "@id": "https://plannora.io/#app" },
      "offeredBy": { "@id": "https://plannora.io/#org" }
    },
    {
      "@type": "SoftwareSourceCode",
      "@id": "https://plannora.io/#sdk",
      "name": "plannora-js",
      "description": "Official JavaScript SDK for the Plannora API.",
      "codeRepository": "https://github.com/plannora-hq/plannora-js",
      "programmingLanguage": "TypeScript",
      "license": "https://opensource.org/licenses/MIT",
      "targetProduct": { "@id": "https://plannora.io/#app" },
      "maintainer": { "@id": "https://plannora.io/#org" }
    }
  ]
}
```

On 28 September 2026 this block passed the [Schema Markup Validator](https://validator.schema.org/) with 0 errors and 0 warnings, and every type and property checked out against the current schema.org vocabulary. The validator also stitched the seven nodes into one connected object, which is the point: no node floats alone.

### Five choices in the example, explained

1. **The app has two types.** `SoftwareApplication` says what it is. Adding `Product` allows the `brand` property, which schema.org defines for products, not software. Multiple types on one node are valid JSON-LD.
2. **No ratings.** Google's [software app rich result](https://developers.google.com/search/docs/appearance/structured-data/software-app) requires `aggregateRating` or `review`. Add them only if the page shows real reviews. Without them, the Rich Results Test will say the app isn't eligible for that result, which is fine: the goal here is a clear entity, not a star rating.
3. **The paid price has a unit.** A bare "10" invites a guess. `UnitPriceSpecification` says it's $10 per one user (`referenceQuantity`) per month (`billingDuration` of `P1M`, the ISO 8601 code for one month). Why a clear, published price matters so much to AI answers is the subject of our [pricing page guide](/blog/hallucination-by-omission-pricing-page).
4. **IDs are URLs with fragments.** `https://plannora.io/about#maya-okafor` points at the page where Maya's facts appear. JSON-LD's [`@id`](https://www.w3.org/TR/json-ld11/) exists "to uniquely identify node objects," and a reference that holds only an `@id` can point at a node defined elsewhere.
5. **Only real profiles go in `sameAs`.** List pages about this exact entity that you control or that describe you: your LinkedIn page, your GitHub organization, a Wikidata item if one legitimately exists.

## How the Pieces Connect

### `@id` links inside, `sameAs` links out

The two properties do different jobs. `@id` is your own name tag for a node, so the `founder` of node 1 and the person in node 2 are provably the same thing. `sameAs` says "this node is the same entity as that page elsewhere." Schema.org defines it as the URL of a page "that unambiguously indicates the item's identity," such as a Wikipedia page, a Wikidata entry or an official website.

Put simply, `@id` builds the graph and `sameAs` docks it to everyone else's. Google's [Organization documentation](https://developers.google.com/search/docs/appearance/structured-data/organization) says this markup helps it "disambiguate your organization in search results," and that you can list several `sameAs` URLs.

### State every edge in plain text too

Markup helps systems that parse it. Many retrieval systems read prose instead, and graph builders like GraphRAG extract "entities, relationships, and key claims" from text. So write the relationships as sentences on the page: "Plannora was founded in 2021 by Maya Okafor and Tom Lindqvist." "The Team plan costs $10 per user per month." "The official JavaScript SDK lives at github.com/plannora-hq/plannora-js."

Use one name per entity everywhere. If the About page says "Plannora Labs," the pricing page "Plannora" and LinkedIn "Plannora HQ," an extractor may create three entities where you meant one. The [entity SEO](/glossary/entity-seo) glossary entry covers consistent naming in more depth.

### Split the graph across the pages that show each fact

You don't have to put all seven nodes on one page. Google recommends Organization markup on the [home page or an About page](https://developers.google.com/search/docs/appearance/structured-data/organization), and says you "don't need to include it on every page."

| Page | Full nodes | Short references (`@id`, type, name) |
| --- | --- | --- |
| About | Organization, both founders | None needed |
| Home or product page | The app | Organization |
| Pricing | Both offers | The app, Organization |
| Developer docs | The SDK | The app, Organization |

Google doesn't document whether it joins `@id` references across pages. Popular tools play safe: Yoast's [schema approach](https://developer.yoast.com/features/schema/technology-approach/) has every page output all the pieces it references. Our [SEO knowledge graph guide](/blog/seo-knowledge-graph) walks through that per-page pattern.

## Connecting `sameAs` to Wikidata, Crunchbase and Official Profiles

The plan most guides sell is "create a Wikidata item, add sameAs, done." The sources' own rules are stricter than that.

### Wikidata: only if you're notable

Wikidata's [notability policy](https://www.wikidata.org/wiki/Wikidata:Notability) accepts an item if it has a Wikimedia sitelink, or if it describes "a clearly identifiable conceptual or material entity that can be described using serious and publicly available references," or if it fills a structural need. Its [self-promotion essay](https://www.wikidata.org/wiki/Wikidata:Self-promotion) goes further: "Creating an item about yourself, your organisation, or your work is a form of self-promotion and is strongly discouraged," and such items are "likely to be deleted." Paid editors must disclose who pays them, under Wikidata's [paid editing policy](https://www.wikidata.org/wiki/Wikidata:Disclosure_of_paid_editing).

If an item about your company already exists, you may help keep it accurate. Wikidata's [autobiography page](https://www.wikidata.org/wiki/Wikidata:Autobiography) says editing the item about yourself is generally allowed, as long as statements are sourced, and your own website can only source facts about yourself. These properties mirror the seven-node graph:

| Fact | Wikidata property | Matches in your JSON-LD |
| --- | --- | --- |
| Founder | P112 | `founder` |
| Founding date | P571 (inception) | `foundingDate` |
| Official website | P856 | `url` |
| GitHub account | P2037 | `sameAs` GitHub URL |
| LinkedIn company ID | P4264 | `sameAs` LinkedIn URL |
| Crunchbase organization ID | P2088 | `sameAs` Crunchbase URL |
| Google Knowledge Graph ID | P2671 | Found with the [Knowledge Graph Search API](/blog/knowledge-graph-search-api) |

### Crunchbase: verified employees edit locked fields

Crunchbase lets registered users [edit profiles](https://support.crunchbase.com/hc/en-us/articles/115010477107-Edit-a-Profile-on-Crunchbase). When a company profile has locked fields, only verified employees can change them. Crunchbase [verifies you](https://support.crunchbase.com/hc/en-us/articles/360022296433-How-do-I-verify-my-account) through an account whose email domain matches your company's, and verified employees get "the exclusive ability to edit the Overview section." Some edits to historical data need Crunchbase staff.

### Official profiles: make the links two-way

For LinkedIn, GitHub, X and YouTube, use the exact name and one-line description from your About page, and link each profile back to your homepage. A `sameAs` link from your site plus a website link from the profile gives any system two matching claims instead of one. Once a knowledge panel appears for your brand, [claim it](https://support.google.com/knowledgepanel/answer/7534902) so you can suggest corrections; Google notes that not every panel is claimable yet.

## How to Validate Your Knowledge Graph

Validation has two halves: is the markup correct, and do machines now describe you correctly? Run them in this order.

1. **Check the JSON.** One missing comma breaks the whole block. Paste it into any JSON linter or straight into the validator below.
2. **Run the Schema Markup Validator.** Google [describes it](https://developers.google.com/search/docs/appearance/structured-data) as the tool to "test all types of schema.org markup, without Google-specific validation." Aim for zero errors, and check that it shows one connected object rather than seven loose ones.
3. **Run the Rich Results Test.** Google's [Rich Results Test](https://search.google.com/test/rich-results) shows "which Google rich results can be generated" from the page. It only reports types tied to Google features, so some nodes won't appear. If it says the app lacks a rating or review, that's the software app result's requirement, not a fault in your graph.
4. **Inspect the live URL.** After you deploy, use URL Inspection in Search Console to confirm Google can fetch the page and sees the markup, then request indexing.
5. **Look yourself up in Google's graph.** Query your brand in the [Knowledge Graph Search API](/blog/knowledge-graph-search-api). No result is common for young companies and isn't an error in your markup.
6. **Ask the AI engines your facts.** Run questions like "Who founded Plannora?" and "How much is Plannora's Team plan?" several times in each engine, and score the answers against your fact sheet. The share of answers that get your facts right is the Accuracy Rate in our [GEO metrics framework](/blog/geo-metrics-framework). Recheck two to four weeks after re-indexing, and remember that answers written from training data won't move until a model is retrained.

## The Brand Graph Checklist

Use this before you ship, and again each quarter.

**Entities**

- Every node in the seven-node model that applies to you exists, and none you can't back up.
- Each entity uses one name, spelled the same on every page and profile.
- The product node carries the most specific type that fits (`SoftwareApplication`, `WebApplication`, `Product`).

**IDs and edges**

- Every node has an `@id` built from a canonical URL plus a fragment, and it never changes.
- `founder`, `worksFor`, `publisher`, `offers`, `itemOffered` and `targetProduct` all point at `@id`s that exist.
- Prices carry a currency and a unit (per user, per month).

**Links out**

- `sameAs` lists only profiles about this exact entity.
- Each profile links back to your site and uses the same name and description.
- A Wikidata link appears only if an item legitimately exists under Wikidata's rules.

**Visibility**

- Every marked-up fact is visible on the page that carries it.
- The About page states the key relationships as plain sentences.

**Validation**

- Schema Markup Validator: zero errors, one connected object.
- Rich Results Test and URL Inspection: page fetchable, markup detected.
- Accuracy Rate recorded for your fact questions, with a date.

## Where Rankbox Fits

A graph only works if the pages behind it state the facts clearly. That's where Rankbox helps. [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask ChatGPT, Perplexity and Google in your category and scores them for volume, difficulty and intent. The Citation-Ready Writer then writes source-backed articles, such as a facts page or a comparison, that reach your site through Rankbox's API.

Rankbox doesn't build your JSON-LD graph, and it doesn't track citations or monitor what AI engines say about you. For single blocks of markup, the free [schema generator](/tools/schema-generator) covers Organization, Person, Product and SoftwareApplication; you add the `@id` links by hand. The Business plan is $49.50 a month with a 7-day trial. [See pricing](/pricing).

## Frequently Asked Questions

### What is a knowledge graph for AI?

A knowledge graph for AI is a set of entities, such as a company, its founders and its products, linked by typed relationships that machines can read. For a brand, it's usually schema.org JSON-LD on your site, with stable IDs linking the entities and `sameAs` links to the same entities on Wikidata, Crunchbase and official profiles.

### Do LLMs read schema markup?

No major AI vendor documents exactly how its models use JSON-LD. Google says it uses structured data to understand pages and "gather information about the web and the world," but also that no special markup is needed for its AI features. Search-grounded answers read your page text, so state every fact in prose as well as markup.

### What should sameAs link to?

`sameAs` should link to pages that clearly identify the same entity: your LinkedIn company page, GitHub organization, Crunchbase profile, X account, and a Wikipedia or Wikidata page if one legitimately exists. Don't link to pages that merely mention you, or to profiles of a different company with the same name.

### Should I create a Wikidata item for my company?

Only if your company meets Wikidata's notability policy, meaning serious, publicly available references describe it. Wikidata's self-promotion essay strongly discourages creating an item about your own organization, and such items are likely to be deleted. If an item already exists, you can help keep it accurate with sourced statements.

### What's the difference between GraphRAG and RAG?

Standard RAG retrieves text chunks by vector similarity and hands them to the model. GraphRAG first uses a model to extract entities and relationships from the documents into a graph, then retrieves through that graph. In Microsoft's paper, it gave more comprehensive answers to broad questions, while standard RAG gave more direct ones.

### How long does it take for AI answers to reflect my knowledge graph?

Search-grounded answers can change within days to weeks, once engines re-crawl and re-index the pages carrying your markup and text. Answers a model gives from memory change only after the vendor retrains it on newer data, which you can't schedule. Measure the change with repeated runs, not one check.

## References

1. [Introducing the Knowledge Graph: things, not strings, Google](https://blog.google/products/search/introducing-knowledge-graph-things-not/)
2. [A reintroduction to our Knowledge Graph and knowledge panels, Google](https://blog.google/products/search/about-knowledge-graph-and-knowledge-panels/)
3. [Expanding AI Overviews and introducing AI Mode, Google](https://blog.google/products/search/ai-mode-search/)
4. [Optimizing your website for generative AI features on Google Search, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
5. [Introduction to structured data markup in Google Search, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
6. [Organization structured data, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/organization)
7. [Software app structured data, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/software-app)
8. [Test your structured data, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data)
9. [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (Lewis et al., 2020), arXiv](https://arxiv.org/abs/2005.11401)
10. [From Local to Global: A Graph RAG Approach to Query-Focused Summarization (Edge et al., 2024), arXiv](https://arxiv.org/abs/2404.16130)
11. [GraphRAG documentation, Microsoft](https://microsoft.github.io/graphrag/)
12. [HybridRAG: Integrating Knowledge Graphs and Vector Retrieval Augmented Generation (Sarmah et al., 2024), arXiv](https://arxiv.org/abs/2408.04948)
13. [Graph Retrieval-Augmented Generation: A Survey (Peng et al., 2024), arXiv](https://arxiv.org/abs/2408.08921)
14. [Unifying Large Language Models and Knowledge Graphs: A Roadmap (Pan et al.), arXiv](https://arxiv.org/abs/2306.08302)
15. [Vector indexes, Neo4j Cypher Manual](https://neo4j.com/docs/cypher-manual/current/indexes/semantic-indexes/vector-indexes/)
16. [JSON-LD 1.1, W3C Recommendation](https://www.w3.org/TR/json-ld11/)
17. [sameAs, Schema.org](https://schema.org/sameAs)
18. [Wikidata: Notability](https://www.wikidata.org/wiki/Wikidata:Notability)
19. [Wikidata: Self-promotion](https://www.wikidata.org/wiki/Wikidata:Self-promotion)
20. [Searching the web with ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/9237897-chatgpt-search)
