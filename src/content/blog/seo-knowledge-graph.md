---
title: SEO Knowledge Graph: How to Build One for Your Site With Schema
description: How to build an SEO knowledge graph for your site: list your entities, give each a stable @id, connect them in JSON-LD across pages, and validate it.
keyword: SEO knowledge graph
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: SEO, Technical SEO
---

An SEO knowledge graph is the connected set of entities your website describes (your company, product, people and articles), written as schema.org JSON-LD, with one stable `@id` per entity that every page points to. To build one, list your entities, give each an ID, publish a connected `@graph` on every page type, make your internal links follow the same relationships, and validate the result.

Most sites already have some markup. The trouble is that it's usually a pile of islands: an Article block here, an Organization block there, each describing the company a little differently. Google says it uses structured data not only to read a page but ["to gather information about the web and the world in general,"](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) including the people and companies in the markup. Islands make that harder. A graph joins them up.

This is the site-level how-to, built around a made-up invoicing tool called Ledgerloom. For the AI side, including how retrieval systems use entities and a full brand graph with founders, code and pricing, read our guide to [building a knowledge graph for AI](/blog/knowledge-graph-for-ai).

## Key Takeaways

- An SEO knowledge graph is your own site's markup, not Google's Knowledge Graph. You control every node in it.
- Give each entity one `@id`, built from its canonical URL plus a fragment such as `#organization`, and never change it.
- Describe each entity in full on the page where its facts appear. Everywhere else, include a short node with the same `@id`, type and name, so each page makes sense on its own.
- Internal links should follow the same relationships as the markup: a byline links to the author's page, a product mention links to the product page.
- Validate every template, not one page, and audit the site for any `@id` that carries two different names.

## Step 1: Take an Entity Inventory

Every SEO knowledge graph starts with a list, not code. An entity is anything people might search for by name, anything with facts that could be stated wrongly, or anything several pages refer to. For most sites that's the company, the website, the product, the people who write, and the content itself.

Here is the inventory for Ledgerloom. We call it the Entity Inventory Sheet: one row per entity, with the page that owns its facts and the ID every other page will use.

| Entity | schema.org type | Page that owns its facts | `@id` | Referenced from |
| --- | --- | --- | --- | --- |
| The company | `Organization` | Home or About page | `https://ledgerloom.io/#organization` | Every page, as publisher |
| The website | `WebSite` | Home page | `https://ledgerloom.io/#website` | Every page, via `isPartOf` |
| The app | `WebApplication` | Home or product page | `https://ledgerloom.io/#app` | Feature pages, blog posts that mention it |
| An author | `Person` | Author page `/team/ana-ruiz` | `https://ledgerloom.io/team/ana-ruiz#person` | Every post she writes |
| A blog post | `BlogPosting` | The post itself | `https://ledgerloom.io/blog/late-fees#article` | Related posts, if you link them |
| A pricing plan | `Offer` | Pricing page | `https://ledgerloom.io/pricing#pro` | The app node |

Keep the sheet in a shared doc. When a developer builds a new template, the sheet tells them which nodes it needs and which IDs to use.

### What not to list

Skip things you can't show on the page. Google's guidelines say not to add structured data "about information that is not visible to the user, even if the information is accurate." If you don't publish your team, don't mark up a team. Skip other companies' entities too. You can mention a partner by name, but its `@id` belongs to its own site; point at it with `sameAs` or a plain `url` instead.

## Step 2: Give Every Entity One Stable @id

IDs are what turn scattered markup into an SEO knowledge graph. In JSON-LD, [`@id`](https://www.w3.org/TR/json-ld11/) is used "to uniquely identify node objects." It's a name tag, not a link that has to load. A node that contains only an `@id` is a reference, which "may represent a reference to a node object found elsewhere in the document." That's how one node points at another.

Five rules keep the IDs useful:

1. **Build them from canonical URLs.** Take the URL of the page that owns the entity and add a fragment: `https://ledgerloom.io/#organization`, `https://ledgerloom.io/team/ana-ruiz#person`.
2. **One entity, one ID, sitewide.** The company is `#organization` on the home page, the blog, the docs and the careers page.
3. **Never change them.** A redesign or CMS move shouldn't touch them. Write them into your templates as constants.
4. **Keep `@id` and `url` separate.** `url` is the page a person visits. `@id` names the thing. Ana's author page is her `url`; `…/team/ana-ruiz#person` is Ana.
5. **Use `sameAs` for outside identities.** Her LinkedIn profile goes in `sameAs`, never in `@id`. Schema.org defines [`sameAs`](https://schema.org/sameAs) as a page "that unambiguously indicates the item's identity."

Yoast's [schema documentation](https://developer.yoast.com/features/schema/technology-approach/) uses a different pattern, `{{website}}/#/schema/{{type}}/{{ID}}`. Either works. What matters is choosing one and sticking to it. Which outside profiles belong in `sameAs`, and the rules Wikidata and Crunchbase set for editing, are covered in our guide to [building a knowledge graph for AI](/blog/knowledge-graph-for-ai).

## Step 3: Publish a Connected @graph on Each Page Type

On a single page, your SEO knowledge graph lives in a top-level `@graph`, which holds several nodes that share one context. The JSON-LD spec calls this useful "when a number of nodes exist at the document's top level that share the same context." Each node then points at the others by `@id`.

### The home page

The home page carries the company, the website and the product. Google asks for `WebSite` markup [on the home page](https://developers.google.com/search/docs/appearance/site-names) if you want to state your site name, and recommends Organization markup on the home page or an About page.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://ledgerloom.io/#organization",
      "name": "Ledgerloom",
      "url": "https://ledgerloom.io/",
      "logo": "https://ledgerloom.io/assets/ledgerloom-512.png",
      "sameAs": [
        "https://www.linkedin.com/company/ledgerloom-hq",
        "https://github.com/ledgerloom-hq"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://ledgerloom.io/#website",
      "url": "https://ledgerloom.io/",
      "name": "Ledgerloom",
      "publisher": { "@id": "https://ledgerloom.io/#organization" }
    },
    {
      "@type": "WebApplication",
      "@id": "https://ledgerloom.io/#app",
      "name": "Ledgerloom",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "publisher": { "@id": "https://ledgerloom.io/#organization" }
    }
  ]
}
```

Ledgerloom is made up, and so are its URLs and profiles. `FinanceApplication` is one of the app categories Google [lists as supported](https://developers.google.com/search/docs/appearance/structured-data/software-app).

### A blog post, with short reference nodes

A post describes itself in full and refers to everything else. The catch: Google doesn't document whether it joins an `@id` on one page to the full node on another. Yoast's docs say cross-page support "is limited" and Google's documentation "is vague," so its plugin makes "every page output all of the relevant pieces." Follow the same rule with short nodes: `@id`, type and name, nothing more.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BlogPosting",
      "@id": "https://ledgerloom.io/blog/late-fees#article",
      "headline": "How to Add a Late Fee to a Freelance Invoice",
      "datePublished": "2026-08-14",
      "dateModified": "2026-09-02",
      "mainEntityOfPage": "https://ledgerloom.io/blog/late-fees",
      "isPartOf": { "@id": "https://ledgerloom.io/#website" },
      "author": { "@id": "https://ledgerloom.io/team/ana-ruiz#person" },
      "publisher": { "@id": "https://ledgerloom.io/#organization" },
      "mentions": { "@id": "https://ledgerloom.io/#app" }
    },
    {
      "@type": "Person",
      "@id": "https://ledgerloom.io/team/ana-ruiz#person",
      "name": "Ana Ruiz",
      "url": "https://ledgerloom.io/team/ana-ruiz",
      "worksFor": { "@id": "https://ledgerloom.io/#organization" }
    },
    {
      "@type": "Organization",
      "@id": "https://ledgerloom.io/#organization",
      "name": "Ledgerloom",
      "url": "https://ledgerloom.io/"
    },
    {
      "@type": "WebSite",
      "@id": "https://ledgerloom.io/#website",
      "url": "https://ledgerloom.io/"
    },
    {
      "@type": "WebApplication",
      "@id": "https://ledgerloom.io/#app",
      "name": "Ledgerloom"
    }
  ]
}
```

The author node carries a `url` on purpose. Google's [Article guide](https://developers.google.com/search/docs/appearance/structured-data/article) recommends an author `url` that "uniquely identifies the author," and says it "can understand both sameAs and url when disambiguating authors."

### The author page

Ana's page is where her facts live, so her full node goes here, inside a `ProfilePage`. Google's Article guide recommends profile page markup when an author's `url` is an internal profile page, and its [ProfilePage docs](https://developers.google.com/search/docs/appearance/structured-data/profile-page) say other markup, such as an article's author, can link to such pages.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": "https://ledgerloom.io/team/ana-ruiz",
      "mainEntity": { "@id": "https://ledgerloom.io/team/ana-ruiz#person" }
    },
    {
      "@type": "Person",
      "@id": "https://ledgerloom.io/team/ana-ruiz#person",
      "name": "Ana Ruiz",
      "jobTitle": "Head of Content",
      "worksFor": { "@id": "https://ledgerloom.io/#organization" },
      "knowsAbout": ["Freelance invoicing", "Late payment fees"],
      "sameAs": ["https://www.linkedin.com/in/example-ana-ruiz"]
    },
    {
      "@type": "Organization",
      "@id": "https://ledgerloom.io/#organization",
      "name": "Ledgerloom",
      "url": "https://ledgerloom.io/"
    }
  ]
}
```

Build these as templates, not by hand. Google [can read JSON-LD](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) that's injected by JavaScript or by a CMS widget, so a component that prints the right nodes for each page type is enough.

## Step 4: Make Internal Links Mirror the Graph

Markup says how things relate. Links say it again, in a form every crawler and reader follows. Google's [link guide](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) says it uses links "as a signal when determining the relevancy of pages," and that "every page you care about should have a link from at least one other page on your site."

So for every edge in your SEO knowledge graph, add a matching link on the page:

| Edge in the markup | Link on the page | Example anchor text |
| --- | --- | --- |
| `author` → Person | The byline links to the author page | "Ana Ruiz" |
| `mentions` → the app | The first product mention links to the product page | "Ledgerloom's late-fee reminders" |
| `publisher` → Organization | The footer or byline links to the About page | "About Ledgerloom" |
| `worksFor` → Organization | The author page links to the About page | "Head of Content at Ledgerloom" |
| `offers` → Offer | The product page links to pricing | "Ledgerloom pricing" |
| `sameAs` → profiles | The About page links out to the same profiles | "Ledgerloom on LinkedIn" |

Use real `<a href>` links; Google says it can generally only crawl links written that way. When a markup edge and a visible link agree, the relationship shows up twice. When the markup claims a relationship the page never shows in text or links, it breaks Google's rule about visible content.

## Step 5: Validate the Whole Graph, Not One Page

Checking one page proves little. A broken template can spread one error across your whole SEO knowledge graph, so test each page type and then the site as a whole.

1. **Run each template through the Schema Markup Validator.** Google describes it as the tool to test "all types of schema.org markup, without Google-specific validation." The three Ledgerloom blocks above returned 0 errors and 0 warnings on 28 September 2026, and the blog post showed as one connected object: the post, with its site, author, company and app hanging off it.
2. **Run the Rich Results Test.** Google's [testing page](https://developers.google.com/search/docs/appearance/structured-data) says it shows which rich results the page can earn. It won't list every node, only those tied to Google features.
3. **Inspect live URLs.** After you deploy, use URL Inspection in Search Console to confirm Google fetched the page and sees the markup.
4. **Audit IDs across the site.** The script below reads the JSON-LD on a list of pages and flags any `@id` that appears with two different types or names, an easy way for a graph to come apart without anyone noticing.

```python
import json
import re
import urllib.request
from collections import defaultdict

PAGES = [
    "https://ledgerloom.io/",
    "https://ledgerloom.io/blog/late-fees",
    "https://ledgerloom.io/team/ana-ruiz",
]
BLOCK = re.compile(r'<script[^>]*application/ld\+json[^>]*>(.*?)</script>', re.S | re.I)
seen = defaultdict(set)  # @id -> {(type, name)}

def walk(node):
    if isinstance(node, list):
        for item in node:
            walk(item)
    elif isinstance(node, dict):
        if "@id" in node and "@type" in node:
            seen[node["@id"]].add((str(node["@type"]), node.get("name", "")))
        for value in node.values():
            walk(value)

for page in PAGES:
    html = urllib.request.urlopen(page, timeout=20).read().decode("utf-8", "replace")
    for block in BLOCK.findall(html):
        walk(json.loads(block))

for node_id, variants in sorted(seen.items()):
    types = {t for t, _ in variants}
    names = {n for _, n in variants if n}
    flag = "CHECK" if len(types) > 1 or len(names) > 1 else "ok"
    print(flag, node_id, sorted(types), sorted(names))
```

Swap in your own URLs, or feed it the list from your sitemap. A `CHECK` line such as `#organization` named both "Ledgerloom" and "Ledgerloom Inc" means two templates disagree. Fix the template, not the page.

Rerun all of this after every template change. For a free check of other AI-readiness signals on a page, try the [AI search readiness check](/tools/ai-search-readiness-check). To see whether Google has your company in its own graph, query the [Knowledge Graph Search API](/blog/knowledge-graph-search-api), and for the background on panels and entities, read [what a knowledge graph in SEO is](/blog/what-is-a-knowledge-graph-in-seo).

A graph is only as good as the pages behind it. Rankbox's [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask AI engines, and its [Citation-Ready Writer](/features/citation-ready-writer) writes source-backed articles that reach your site through Rankbox's API, where your templates add the markup. Rankbox doesn't generate your site's graph or track AI citations. The free [schema generator](/tools/schema-generator) builds single JSON-LD blocks for 10 types to start from. The Business plan is $49.50 a month with a 7-day trial ([pricing](/pricing)).

## Frequently Asked Questions

### What is an SEO knowledge graph?

An SEO knowledge graph is the structured description of your site's entities (company, product, people, content) and how they relate, written as schema.org JSON-LD. Each entity has one stable `@id`, and pages point at those IDs, so search engines see one consistent set of things instead of scattered, conflicting blocks.

### Is an SEO knowledge graph the same as Google's Knowledge Graph?

No. Google's Knowledge Graph is Google's own database of billions of entities, which you can't edit. An SEO knowledge graph is the markup on your own site. It's one of the sources Google and other systems can read when they work out what your company is.

### Should every page repeat the Organization markup?

Put the full Organization node on your home page or About page, as Google recommends. On other pages, include a short node with the same `@id`, type and name wherever that page refers to the company, such as the publisher of a post. Google doesn't document joining IDs across pages.

### What should I use as an @id?

Use the canonical URL of the page that owns the entity, plus a fragment: `https://example.com/#organization` or `https://example.com/team/jane#person`. Keep one ID per entity across the whole site, and never change it. Put outside profiles in `sameAs`, not in `@id`.

### Do I need a plugin to build an SEO knowledge graph?

Not necessarily. Some SEO plugins, such as Yoast, already output a connected graph with IDs. On a custom site, add the nodes in your page templates. Either way, check the result with the Schema Markup Validator and audit the IDs across pages.

### How do I know if my SEO knowledge graph is working?

Check the markup first: zero validator errors, one connected object per page, and no `@id` with two names. Then check the effect: URL Inspection shows Google sees the markup, and the Knowledge Graph Search API may start returning your company as an entity. The effect can take months and isn't guaranteed.

## References

1. [JSON-LD 1.1, W3C Recommendation](https://www.w3.org/TR/json-ld11/)
2. [Schema technology and approach, Yoast developer portal](https://developer.yoast.com/features/schema/technology-approach/)
3. [Introduction to structured data markup in Google Search, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
4. [Organization structured data, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/organization)
5. [Site names in Google Search, Google Search Central](https://developers.google.com/search/docs/appearance/site-names)
6. [Article structured data, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/article)
7. [Profile page structured data, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
8. [Software app structured data, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/software-app)
9. [Test your structured data, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data)
10. [Link best practices for Google, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
11. [sameAs, Schema.org](https://schema.org/sameAs)
12. [Schema Markup Validator, Schema.org](https://validator.schema.org/)
