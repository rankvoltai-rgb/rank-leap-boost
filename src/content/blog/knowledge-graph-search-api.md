---
title: Google Knowledge Graph Search API: What It Returns and How to Use It for SEO
description: What Google's Knowledge Graph Search API returns, its status and quota as of September 2026, and how to use it to check your brand's entity.
keyword: Knowledge Graph Search API
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: SEO, Technical SEO
---

The Google Knowledge Graph Search API is a free, read-only lookup that returns entities from Google's Knowledge Graph for a name or an ID. Each result carries a machine ID, a name, its schema.org types, a short description and a match score. For SEO, it answers one question well: does Google treat your brand as an entity, and which one? It can't add, edit or remove anything.

As of 28 September 2026 the original endpoint still works, with a free quota of [100,000 read calls per day per project](https://developers.google.com/knowledge-graph/reference/rest/v1/usage-limits). But the [overview page](https://developers.google.com/knowledge-graph) now warns that Google is moving the Knowledge Graph Search API to Cloud Enterprise Knowledge Graph, and tells new users to start there. It also says the API "is not suitable for use as a production-critical service."

This guide covers the status of both versions, a first request, what each field in the response means, and the SEO checks worth running. It's the practical companion to our guide on [building a knowledge graph for AI](/blog/knowledge-graph-for-ai), which covers the markup side: connecting founders, products and profiles so machines can link them.

## Key Takeaways

- The Knowledge Graph Search API only reads. To correct a fact, you claim the knowledge panel or fix the sources Google reads, not the API.
- The original endpoint (`kgsearch.googleapis.com`) needs an API key and gives 100,000 free calls a day per project, as of September 2026.
- Google's successor lives in Cloud Enterprise Knowledge Graph. It's in Preview, uses Google Cloud credentials and drops `resultScore`.
- The `@id` field is the entity's machine ID. IDs that start `/m/` date from Freebase; IDs that start `/g/` are Google's own.
- `resultScore` only orders results inside one request. Google publishes no scale for it, so don't compare scores across queries.

## Status in September 2026: The Original API and Its Cloud Successor

Two products now do the same lookup. As documented on 28 September 2026:

| | Original API | Cloud, Basic edition | Cloud, Advanced edition |
| --- | --- | --- | --- |
| Endpoint | `kgsearch.googleapis.com/v1/entities:search` | `…/publicKnowledgeGraphEntities:Search` | `…/cloudKnowledgeGraphEntities:Search` |
| How you sign in | API key in the URL | Cloud credentials (access token) | Cloud credentials (access token) |
| Default quota | 100,000 calls a day per project, free | 60 requests a minute per project | 60 a minute, can be raised |
| Main ID returned | `/m/…` or `/g/…` | Cloud ID (`c-…`), Google ID kept in `identifier` | Same as Basic |
| `resultScore` | Yes | Removed | Removed |
| Stage | Live, with a migration warning | Preview | Preview |

The Cloud details come from Google's [editions page](https://cloud.google.com/enterprise-knowledge-graph/docs/editions), its [quotas page](https://cloud.google.com/enterprise-knowledge-graph/docs/quotas) and its [migration guide](https://cloud.google.com/enterprise-knowledge-graph/docs/migrate), which says plainly: "The resultScore field has been removed from the response." Google calls Basic "a good fit for community applications that aren't for production and high-traffic use cases" and Advanced the edition for production. No pricing page for Enterprise Knowledge Graph was live on 28 September 2026; the pricing URL returned a 404.

### Which one should an SEO use?

For spot checks on a handful of names, the original API is simpler: one key, one call, and it still reports `resultScore`. The Cloud editions need a Google Cloud project, the Enterprise Knowledge Graph API switched on and a service account or `gcloud` login, per the [setup guide](https://cloud.google.com/enterprise-knowledge-graph/docs/setup). Choose Cloud if you're building a tool that has to keep working, since that's where Google says new features go.

### Is the endpoint live right now?

Yes. A call without a key on 28 September 2026 returned HTTP 403: "Method doesn't allow unregistered callers." A made-up key returned HTTP 400, "API key not valid." Both are answers from a working service that wants a real key, so you can't use it anonymously.

## How to Make Your First Request

You need three things: a Google account, a Google Cloud project, and an API key. Google's [prerequisites page](https://developers.google.com/knowledge-graph/prereqs) walks through them.

1. Create or pick a project in the Google API Console.
2. Enable the Knowledge Graph Search API for that project.
3. Under Credentials, choose Create credentials, then API key.
4. Restrict the key to this one API, as Google's [authorization guide](https://developers.google.com/knowledge-graph/how-tos/authorizing) suggests, so a leaked key can't be used for anything else.
5. Send a GET request with the key as the `key` parameter.

Here is a search for a brand name, limited to organizations. Replace `YOUR_API_KEY` with your key.

```bash
curl -G "https://kgsearch.googleapis.com/v1/entities:search" \
  --data-urlencode "query=Plannora" \
  --data-urlencode "types=Organization" \
  --data-urlencode "languages=en" \
  --data-urlencode "limit=5" \
  --data-urlencode "key=YOUR_API_KEY"
```

Plannora is our made-up example brand; swap in your own name. To look up an entity you already know, pass its ID instead of a query:

```bash
curl -G "https://kgsearch.googleapis.com/v1/entities:search" \
  --data-urlencode "ids=/m/0dl567" \
  --data-urlencode "key=YOUR_API_KEY"
```

The [method reference](https://developers.google.com/knowledge-graph/reference/rest/v1) lists every parameter. These are the ones that matter for SEO work:

| Parameter | What it does | Tip |
| --- | --- | --- |
| `query` | Searches names and aliases for a literal string | Try your brand name, then "name + category" |
| `ids` | Looks up one or more IDs; repeat it for several | Use it to recheck an entity you've found before |
| `types` | Keeps only entities of a schema.org type, such as `Organization` or `Person` | Cuts out namesakes of the wrong kind |
| `languages` | Runs the query in ISO 639 language codes | Check each market you sell in |
| `prefix` | Matches the start of names ("Jung" finds "Jungle") | Handy for autocomplete, noisy for audits |
| `limit` | Caps results. Default 20, maximum 500 | High limits time out more often, Google warns |

## What the Response Fields Mean

The response is JSON-LD: a list of matches, each wrapped in an `EntitySearchResult`. This is Google's documented sample, shortened (the image and licence fields are cut):

```json
{
  "@type": "EntitySearchResult",
  "result": {
    "@id": "kg:/m/0dl567",
    "name": "Taylor Swift",
    "@type": ["Thing", "Person"],
    "description": "Singer-songwriter",
    "detailedDescription": {
      "articleBody": "Taylor Alison Swift is an American singer-songwriter and actress...",
      "url": "http://en.wikipedia.org/wiki/Taylor_Swift"
    },
    "url": "http://taylorswift.com/"
  },
  "resultScore": 4850
}
```

Google's definitions, and what each field means for an audit:

| Field | Google's definition | How to read it for SEO |
| --- | --- | --- |
| `@id` | "The canonical URI for the entity" | The machine ID. Strip `kg:` to get the ID you can reuse |
| `name` | The entity's name | The label Google settled on. Spelling differences are worth noting |
| `@type` | Schema.org types that match the entity | Should include `Organization` (or a subtype) for a company |
| `description` | A short description | Google's one-line label, like "Singer-songwriter" in the sample |
| `detailedDescription` | A longer description | Text plus its source URL and licence. In Google's sample, from Wikipedia |
| `image` | An image to help identify the entity | For confirming the match only; the licence is your problem |
| `url` | "The official website URL of the entity, if available" | Should be your domain. A missing or wrong URL is a finding |
| `resultScore` | How well the entity matched the request | Relative rank within this response only |

### The ID: `/m/` versus `/g/`

The `kg:` prefix is shorthand. The response's own context maps it to `http://g.co/kg`, so `kg:/m/0dl567` expands to `http://g.co/kg/m/0dl567`. On 28 September 2026 that link redirected to a Google search for the entity.

The part after the prefix comes in two styles. Wikidata's property for the [Google Knowledge Graph ID](https://www.wikidata.org/wiki/Property:P2671) covers IDs that start with `/g/`, and says IDs starting with `/m/` belong under its [Freebase ID](https://www.wikidata.org/wiki/Property:P646) property. Freebase was a shared database that [ran from 2007 to 2015](https://developers.google.com/freebase). Wikidata notes that new Freebase IDs are no longer issued, but the old `/m/` IDs "remain in use, including by Google Knowledge Graph." Both kinds work in a lookup.

### `resultScore` has no scale

Google defines `resultScore` only as "an indicator of how well the entity matched the request constraints." It publishes no range; the sample above just happens to show 4850. Use it to see which result Google ranks first for your query, and nothing more. A score of 12 for your brand today and 30 next month doesn't tell you Google trusts you more.

## SEO Uses for the Knowledge Graph Search API

### 1. Check whether your brand is an entity

This short script asks the API for your brand as an organization and flags any result whose official URL is your domain. It runs on Python 3.9 or later, reads the key from an environment variable, and prints one line per match.

```python
import json
import os
import urllib.parse
import urllib.request

API_KEY = os.environ["KG_API_KEY"]  # keep the key out of your code
BRAND = "Plannora"
DOMAIN = "plannora.io"

params = urllib.parse.urlencode({
    "query": BRAND,
    "types": "Organization",
    "languages": "en",
    "limit": 5,
    "key": API_KEY,
})
url = "https://kgsearch.googleapis.com/v1/entities:search?" + params

with urllib.request.urlopen(url, timeout=20) as resp:
    data = json.load(resp)

rows = data.get("itemListElement", [])
if not rows:
    print("No entity found. Google has not matched this name to an Organization.")

for row in rows:
    entity = row["result"]
    mid = entity.get("@id", "").removeprefix("kg:")
    site = entity.get("url", "")
    verdict = "YOUR SITE" if DOMAIN in site else (site or "no official url")
    print(mid, "|", entity.get("name"), "|", entity.get("description", "-"),
          "| score", row.get("resultScore"), "|", verdict)
```

Run it once without `types` too, so you also see namesakes of other kinds: places, people, products.

### 2. Find your ID and the pages behind it

When your entity shows up, save its ID in your brand fact sheet, so you can recheck it later with `ids=` instead of a name search. The `detailedDescription.url` tells you which reference page Google leans on for the long description, often a Wikipedia article.

Those reference pages are what belong in your markup. Schema.org describes [`sameAs`](https://schema.org/sameAs) as the URL of a page "that unambiguously indicates the item's identity," such as a Wikipedia page, a Wikidata entry or an official website. Google's docs don't say it reads a Knowledge Graph ID from your markup, so don't rely on that. If your company has a Wikidata item that meets Wikidata's rules, the ID can be recorded there instead, under the properties above. Our guide to [building a knowledge graph for AI](/blog/knowledge-graph-for-ai) shows where each of these links sits in a complete brand graph.

### 3. Check disambiguation against namesakes

Search your bare brand name without `types`. If a town, a band or another company comes back first, a search engine has to work harder to know which one a question means. That's your cue to pair the name with your category everywhere you describe yourself, the core idea behind [entity SEO](/glossary/entity-seo).

### 4. Map the entities in your topic

Query your category terms and competitors' names. The types and descriptions show how Google labels the players in your space. Remember that the API returns entities, not rankings.

## The Entity Check Decision Table

Run the script, find your result in the left column, and take the action on the right. We call it the Entity Check: it turns one API response into a to-do list.

| What the API returns | What it probably means | What to do next |
| --- | --- | --- |
| Nothing for your exact name, with or without `types` | Google hasn't reconciled your brand into an entity yet | Publish a clear About page with Organization markup and earn independent coverage. Recheck quarterly |
| Only namesakes: a place, a band, another firm | Your name is ambiguous and a stronger entity owns it | Use "name + category" in titles, bios and profiles. Keep `sameAs` complete |
| Your entity, but `url` is missing | Google knows you but hasn't tied you to a site | Put your homepage URL in markup and on every official profile |
| Your entity, with the wrong `url` or an old description | A stale source is feeding the graph | Fix the source pages. If a knowledge panel shows, claim it and suggest edits |
| Your entity with a Wikipedia `detailedDescription` | Google uses that article for your long description | Keep that page accurate through its own rules; don't edit it about yourself |
| Your entity typed only as `Thing` | Google has the name but not the kind of thing | State your category plainly on your site and in Organization markup |

The fixes in the right column are the site-level work. When a wrong fact has spread beyond Google, our quick guide to [fixing incorrect brand facts in LLM citations](/blog/how-to-fix-incorrect-brand-facts-in-llm-citations) covers reporting and rechecking it. Our guide to the [SEO knowledge graph](/blog/seo-knowledge-graph) shows how to mark up your own pages so they describe one consistent set of entities, and the [definition of a knowledge graph in SEO](/blog/what-is-a-knowledge-graph-in-seo) explains where panels come from.

## Limits Worth Knowing Before You Rely on It

- **It can't edit anything.** The API "is a read-only API." To change what Google shows, use the knowledge panel's Feedback link, or [get verified](https://support.google.com/knowledgepanel/answer/7534902) and suggest changes. Google notes that "not all knowledge panels are claimable."
- **It returns no relationships.** Google says the API gives "individual matching entities, rather than graphs of interconnected entities," and recommends Wikidata's data dumps if you need the graph.
- **It isn't a panel predictor.** An entity in the API doesn't guarantee a knowledge panel. Panels are ["automatically generated"](https://support.google.com/knowledgepanel/answer/9163198) from sources across the web.
- **It isn't a monitoring service.** Google warns against a "critical dependence" on it. A monthly spot check is fine; a production pipeline belongs on the Cloud editions.
- **It says nothing about AI answers.** Google's AI features draw on its wider systems, and other assistants use their own search providers. Check what AI engines say about you separately, as covered in [our brand presence guide for Perplexity](/blog/brand-presence-in-perplexity).

Rankbox doesn't query the Knowledge Graph or track how engines describe you. Its part is the work behind the right-hand column of the Entity Check. [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask ChatGPT, Perplexity and Google about your category, and the Citation-Ready Writer turns them into source-backed articles, such as a facts page, that reach your site through Rankbox's API. The Business plan costs $49.50 a month with a 7-day trial; see [pricing](/pricing). For the markup itself, the free [schema generator](/tools/schema-generator) builds Organization, Person and other JSON-LD blocks you can paste in.

## Frequently Asked Questions

### Is the Google Knowledge Graph Search API free?

Yes. The original API allows up to 100,000 read calls per day per project at no charge, according to Google's usage limits page, and you can ask for more in the API Console. The Cloud editions list a default quota of 60 requests a minute; no Cloud price page was live on 28 September 2026.

### Is the Knowledge Graph Search API deprecated?

Not formally. As of September 2026 the endpoint still answers requests, and Google hasn't announced a shutdown date. But its overview page says Google is migrating the API to Cloud Enterprise Knowledge Graph and tells new users to start there.

### Can I add my company to Google's Knowledge Graph with the API?

No. The Knowledge Graph Search API is read-only. Google adds entities automatically from sources across the web. You influence that by stating facts clearly on your site, keeping profiles consistent and earning coverage, and you correct panels through feedback or verification.

### What does resultScore mean in the Knowledge Graph Search API?

It's Google's indicator of how well an entity matched your request. Google publishes no scale for it, so it's only useful for ordering results within one response. The Cloud editions have removed it.

### What is a kg:/m/ ID?

It's an entity's machine ID in Google's Knowledge Graph. IDs starting `/m/` come from Freebase, a shared database that ran until 2015, and are still in use. Newer IDs start `/g/`. Strip the `kg:` prefix to reuse the ID in a lookup.

### Does the API show knowledge panel data?

Partly. It returns the entity's name, types, short and long descriptions, an image and its official URL, which overlap with what panels show. It doesn't return the full panel, the relationships between entities, or whether a panel appears at all.

## References

1. [Google Knowledge Graph Search API, Google for Developers](https://developers.google.com/knowledge-graph)
2. [Method entities.search, Knowledge Graph Search API reference](https://developers.google.com/knowledge-graph/reference/rest/v1)
3. [Usage Limits, Knowledge Graph Search API](https://developers.google.com/knowledge-graph/reference/rest/v1/usage-limits)
4. [Authorize Requests, Knowledge Graph Search API](https://developers.google.com/knowledge-graph/how-tos/authorizing)
5. [Prerequisites, Knowledge Graph Search API](https://developers.google.com/knowledge-graph/prereqs)
6. [Compare Basic and Advanced editions, Google Cloud Enterprise Knowledge Graph](https://cloud.google.com/enterprise-knowledge-graph/docs/editions)
7. [Migrate from legacy Google Knowledge Graph Search API, Google Cloud](https://cloud.google.com/enterprise-knowledge-graph/docs/migrate)
8. [Quotas and limits, Google Cloud Enterprise Knowledge Graph](https://cloud.google.com/enterprise-knowledge-graph/docs/quotas)
9. [Set up Enterprise Knowledge Graph API, Google Cloud](https://cloud.google.com/enterprise-knowledge-graph/docs/setup)
10. [Google Knowledge Graph ID (P2671), Wikidata](https://www.wikidata.org/wiki/Property:P2671)
11. [Freebase ID (P646), Wikidata](https://www.wikidata.org/wiki/Property:P646)
12. [Freebase API (Deprecated): Data Dumps, Google for Developers](https://developers.google.com/freebase)
13. [sameAs, Schema.org](https://schema.org/sameAs)
14. [Get verified on Google, Knowledge Panel Help](https://support.google.com/knowledgepanel/answer/7534902)
15. [About knowledge panels, Knowledge Panel Help](https://support.google.com/knowledgepanel/answer/9163198)
