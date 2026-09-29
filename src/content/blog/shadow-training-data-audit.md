---
title: The "Shadow Training Data" Audit: How Common Crawl Decided Your Brand's Fate in 2024
description: A shadow training data audit maps AI model cutoffs to Common Crawl's 2024 crawls, checks what they held about your brand, and fixes the gaps.
keyword: training data
date: 2026-09-29
updated: 2026-09-29
author: Rankbox Team
tags: AI Search, Technical SEO
---

A shadow training data audit checks what the open web said about your brand in the crawls that closed before each AI model's knowledge cutoff. Most AI labs no longer name their datasets, so Common Crawl, the free public web archive, is the closest record of that web you can still inspect. For a large group of models, the newest web they learned from dates from 2024. If your brand was thin or missing in those crawls, the model has little to remember, and only a live web search can introduce you.

The link between Common Crawl and training data used to be written down. OpenAI's [GPT-3 paper](https://arxiv.org/abs/2005.14165) gave a filtered Common Crawl 60% of its training mix, taken from 41 shards of monthly crawls covering 2016 to 2019. Meta's [first LLaMA paper](https://arxiv.org/abs/2302.13971) gave English Common Crawl 67%. Newer model cards talk about "publicly available" web data and name no crawl at all.

Memory still decides a lot of answers, because assistants often skip the search. In Profound's [July 2026 test](https://www.joshblyskal.com/research/state-of-aeo-2026) of about 400 prompts with web search switched on, Claude searched 36.6% of the time. Every other answer came from its training data.

This guide covers vendor disclosures, which crawls fall inside which model's window, how to query past crawls for your domain and for pages that named you, how to score the result, and what to do if you were invisible. For live lookups in today's crawl, Wikidata and Crunchbase, see our guide to [entity authority in the AI era](/blog/entity-authority-in-the-ai-era).

## Key Takeaways

- The clearest numbers on Common Crawl come from two papers: GPT-3 (60% of the training mix) and Meta's first LLaMA (67%, plus 15% from C4, a dataset also built from Common Crawl).
- OpenAI, Anthropic, Google and Meta now describe their training data as some mix of public web, partner or licensed, user and synthetic data. Common Crawl is a public stand-in for the web their crawlers saw, not proof of what they used.
- Models with knowledge cutoffs between April 2024 and January 2025 learned a web whose newest pages date from 2024 or early January 2025. That group includes GPT-5 (30 September 2024), Claude 3.7 Sonnet (October 2024) and Gemini 3 Pro (January 2025).
- Common Crawl is a sample. Mistral AI's domain had 157 successful captures in the December 2024 crawl, and its Wikipedia article appeared in none of the eight crawls checked.
- Pages that mention you can drop out of later crawls when their publisher blocks CCBot. Common Crawl's own copies show TechCrunch adding that block on 21 May 2024. Its 2023 story on Mistral's seed round appears in no later crawl checked, through September 2026.
- The Shadow Audit Score rates each model window on presence, repetition, corroboration and fidelity, 0 to 2 each. The fictional Tallyfold scores 2, 5 and 6 out of 8 across three windows.
- You can't edit training data after a model ships. Win the live search now, seed consistent entity facts, and make sure the next crawls capture your current story.

## What AI Vendors Actually Disclose About Training Data

One claim you'll hear in AI SEO is that GPT-4o, Claude 3.5 and Gemini formed their view of your brand from years-old scrapes of Common Crawl, Wikipedia and Reddit. Part of that is documented and part of it is guesswork. Here is what each vendor has published about its training data, in its own papers and model cards.

| Vendor    | Most detailed disclosure                                                                                                            | What recent model cards say                                                                                                                                                             | Names Common Crawl?              |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| OpenAI    | GPT-3 (2020): filtered Common Crawl, 410 billion tokens, 60% of the mix. WebText2 22%, two book sets 16%, Wikipedia 3%              | GPT-4o: "industry-standard machine learning datasets and web crawls," data up to October 2023. GPT-5: public internet data, partner data, and data from users, trainers and researchers | GPT-3 only                       |
| Anthropic | Claude 3 (2024): "publicly available information on the Internet as of August 2023," plus third-party, contractor and internal data | Claude Fable 5.1: public online information, public and private datasets, user data and synthetic data                                                                                  | No. It describes its own crawler |
| Google    | Gemini 3 Pro: "publicly-available web-documents," downloadable public datasets, "data obtained by crawlers," licensed and user data | Processing includes "honoring robots.txt" and quality filtering                                                                                                                         | No                               |
| Meta      | LLaMA (2023): English Common Crawl 67% from five crawls, 2017 to 2020. C4 15%, Wikipedia 4.5%                                       | Llama 4: public, licensed and Meta product data, including public Instagram and Facebook posts. Muse Glimmer (August 2026): public, third-party and Meta product data                   | LLaMA 1 only                     |

Sources: [GPT-3](https://arxiv.org/abs/2005.14165), the [GPT-4o system card](https://arxiv.org/abs/2410.21276), the [GPT-5 system card](https://cdn.openai.com/gpt-5-system-card.pdf), the [Claude 3 model card](https://assets.anthropic.com/m/61e7d27f8c8f5919/original/Claude-3-Model-Card.pdf), Anthropic's [Transparency Hub](https://www.anthropic.com/transparency), the [Gemini 3 Pro model card](https://storage.googleapis.com/deepmind-media/Model-Cards/Gemini-3-Pro-Model-Card.pdf), [LLaMA](https://arxiv.org/abs/2302.13971), the [Llama 4 model card](https://github.com/meta-llama/llama-models/blob/main/models/llama4/MODEL_CARD.md) and the [Muse Glimmer model card](https://huggingface.co/meta-models/Muse-Glimmer-30B).

### What the Common Crawl story gets right

Web crawl was the largest slice in both disclosures that give numbers. Wikipedia sat in both mixes as its own source. Reddit shows up too: GPT-3's WebText2 is an expanded version of WebText, which OpenAI's [GPT-2 paper](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf) built from "all outbound links from Reddit" that earned at least 3 karma.

Common Crawl also feeds open datasets that anyone can train on. Hugging Face's [FineWeb](https://huggingface.co/datasets/HuggingFaceFW/fineweb) holds more than 18.5 trillion tokens of English web text drawn from every Common Crawl dump since 2013. In January 2025 it added eight snapshots covering May to December 2024.

![An Inside Look at Common Crawl](youtube:DFkl-wmYvA8 "Common Crawl's Executive Director, Rich Skrenta, on TWiT's Intelligent Machines (August 2025).")

### What it gets wrong

Current model cards don't name Common Crawl. Anthropic's model cards describe its own crawler, which follows robots.txt and "does not access password-protected or sign-in pages." Google lists "data obtained by crawlers" and licensed data. Meta's newest cards add data from its own apps. So the crawls you'll query below show what the public web looked like at a given moment. They don't show the training data any one lab collected.

"Years ago" is also out of date. As of September 2026, OpenAI lists a knowledge cutoff of 30 April 2026 for [GPT-6 Astra](https://developers.openai.com/api/docs/models/compare), and Anthropic lists June 2026 for Claude Opus 5.5 on its [models overview](https://platform.claude.com/docs/en/about-claude/models/overview). The next section explains why 2024 still matters.

### Captured is not the same as learned

Labs throw away much of what a crawl collects before it becomes training data. GPT-3's team trained a classifier with WebText, Wikipedia and books as examples of good text, then kept the Common Crawl documents that scored well. LLaMA's team trained a model to tell pages used as Wikipedia references from random pages, and "discarded pages not classified as references." Both also removed near-duplicates.

So a capture is the minimum, not the finish line. A thin homepage with 40 words of copy can sit in the crawl and still fall out of the training data.

## Which Crawls Fell Inside Each Model's Training Window

A [knowledge cutoff](/glossary/knowledge-cutoff) is the date a model's training data ends. Vendors publish it on model pages and model cards. Anthropic gives two dates: a training data cutoff and an earlier "reliable knowledge cutoff," the point up to which knowledge is "most extensive and reliable." Claude Haiku 4.5, for example, lists February 2025 and July 2025.

Treat any published date as approximate. The [Dated Data](https://arxiv.org/abs/2403.12958) study found that "effective cutoffs often differ from reported cutoffs," partly because new Common Crawl dumps contain "non-trivial amounts of old data." The last months before a cutoff are thin in the training data, likely because the web hasn't finished writing about them yet.

With that caveat, you can line each model up against Common Crawl's calendar. We call the result the Crawl-Window Map. Crawl dates come from Common Crawl's [index list](https://index.commoncrawl.org/collinfo.json), and cutoffs from each vendor's own page.

| Model                            | Vendor-stated cutoff | Last crawl that ended before it        | 2024 crawls inside the window |
| -------------------------------- | -------------------- | -------------------------------------- | ----------------------------- |
| GPT-4o                           | 1 October 2023       | CC-MAIN-2023-23 (2023-40 straddles it) | 0                             |
| Claude 3.5 Sonnet                | April 2024           | CC-MAIN-2024-18                        | 2                             |
| GPT-5 mini                       | 31 May 2024          | CC-MAIN-2024-22                        | 3                             |
| GPT-4.1 and o3                   | 1 June 2024          | CC-MAIN-2024-22                        | 3                             |
| Claude 3.5 Haiku                 | July 2024            | CC-MAIN-2024-30                        | 5                             |
| Gemini 2.0 Flash and Llama 4     | August 2024          | CC-MAIN-2024-33                        | 6                             |
| GPT-5 and GPT-5.1                | 30 September 2024    | CC-MAIN-2024-38                        | 7                             |
| Claude 3.7 Sonnet                | October 2024         | CC-MAIN-2024-42                        | 8                             |
| Gemini 2.5 Pro and Gemini 3 Pro  | January 2025         | CC-MAIN-2025-05                        | 10                            |
| Newest flagships, September 2026 | January to June 2026 | A late 2025 or 2026 crawl              | 10, plus later crawls         |

The cutoffs come from OpenAI's model pages (for example [GPT-5](https://developers.openai.com/api/docs/models/gpt-5)), Anthropic's [Claude 3.5 addendum](https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf) and Transparency Hub, Google's model pages for [Gemini 2.0 Flash](https://ai.google.dev/gemini-api/docs/models/gemini-2.0-flash) and [Gemini 2.5 Pro](https://ai.google.dev/gemini-api/docs/models/gemini-2.5-pro), and Meta's model cards.

### Why the title says 2024

Common Crawl ran ten crawls in 2024, from CC-MAIN-2024-10 (20 February to 5 March) to CC-MAIN-2024-51 (1 to 15 December). Every model from Claude 3.5 Sonnet down to Gemini 3 Pro learned from a web that stopped between April 2024 and January 2025. Some of that memory is still in service, and some of it lives on inside newer models:

- OpenAI still lists GPT-5 as a "previous model" in its API, with its 30 September 2024 cutoff.
- Google's model cards for Gemini 3.7 Flash and [Gemini 3.8 Flash](https://deepmind.google/models/model-cards/gemini-3-8-flash/) give a March 2026 cutoff, then warn that in some domains "the model's knowledge is limited to January 2025 (in line with the Gemini 3 Model Family)."
- Anthropic's current lineup includes Claude Haiku 4.5, with a reliable knowledge cutoff of February 2025.

So for many models people used through 2025, and part of what they use now, the newest web in their training data is from 2024. A brand that launched, pivoted or got its first press in 2024 was either caught by those crawls or missed.

## How to Query Historical Common Crawl Indexes for Your Domain

Common Crawl keeps a separate URL index for every crawl at `index.commoncrawl.org`. Queries are free and need no key, and they show which pages could have become training data in each period. The examples use Mistral AI, a real company whose records are public, because its timing makes a clean case: Mistral says on its [About page](https://mistral.ai/about/) that it was born in April 2023, hired its first employee on 5 June and closed its seed round on 13 June. Everything else in this guide uses Tallyfold, a made-up company.

Every request below was run on 29 September 2026.

### Step 1: List the crawls and their dates

```bash
curl -s "https://index.commoncrawl.org/collinfo.json"
```

On 29 September 2026 the list held 128 crawls, newest first. Each entry, trimmed here, gives an ID, a query endpoint and the dates the crawl ran:

```json
{
  "id": "CC-MAIN-2024-10",
  "name": "February/March 2024 Index",
  "cdx-api": "https://index.commoncrawl.org/CC-MAIN-2024-10-index",
  "from": "2024-02-20T21:10:55",
  "to": "2024-03-05T15:40:45"
}
```

The ID reads as year and week. Match the `to` date against each model's cutoff to build your own window list.

### Step 2: Ask the crawls in each window for your domain

Start with the crawl just before your launch and move forward. Send a descriptive user agent with a contact address:

```bash
curl -s -A "AcmeShadowAudit/1.0 (you@example.com)" \
  "https://index.commoncrawl.org/CC-MAIN-2023-23-index?url=mistral.ai&matchType=domain&output=json"
```

The May/June 2023 crawl, which ended on 11 June 2023, answered with HTTP 404 and `{"message": "No Captures found for: mistral.ai"}`. The next crawl, CC-MAIN-2023-40, ran from 21 September to 5 October 2023. It returned five captures. The one that matters, trimmed:

```json
{
  "urlkey": "ai,mistral)/",
  "timestamp": "20231001221357",
  "url": "https://mistral.ai/",
  "status": "200",
  "length": "5240",
  "offset": "420680499",
  "filename": "crawl-data/CC-MAIN-2023-40/segments/1695233510941.58/warc/CC-MAIN-20231001205332-20231001235332-00601.warc.gz"
}
```

The `urlkey` is your domain written backwards, `timestamp` is when CCBot fetched the page, and `status` 200 means it got the page itself. The last three fields locate the stored copy. That capture landed on 1 October 2023, four days after Mistral released its first model and on GPT-4o's cutoff date.

### Step 3: Count captures crawl by crawl

One number per crawl tells you whether your share of the open training data pool was growing. This loop counts successful captures across 2024 and pauses between calls:

```bash
for c in CC-MAIN-2024-10 CC-MAIN-2024-18 CC-MAIN-2024-22 CC-MAIN-2024-26 \
         CC-MAIN-2024-30 CC-MAIN-2024-33 CC-MAIN-2024-38 CC-MAIN-2024-42 \
         CC-MAIN-2024-46 CC-MAIN-2024-51; do
  n=$(curl -s -A "AcmeShadowAudit/1.0 (you@example.com)" \
    "https://index.commoncrawl.org/$c-index?url=yourdomain.com&matchType=domain&output=json&fl=url,status" \
    | grep -c '"status": "200"')
  echo "$c $n"
  sleep 5
done
```

For a large site, add `&showNumPages=true` first and fetch each page with `&page=N`. Here is Mistral AI's domain, subdomains included:

| Crawl           | Dates              | Captures | Status 200 | Hostnames |
| --------------- | ------------------ | -------- | ---------- | --------- |
| CC-MAIN-2023-23 | 27 May–11 Jun 2023 | 0        | 0          | 0         |
| CC-MAIN-2023-40 | 21 Sep–5 Oct 2023  | 5        | 2          | 1         |
| CC-MAIN-2023-50 | 28 Nov–12 Dec 2023 | 43       | 29         | 3         |
| CC-MAIN-2024-10 | 20 Feb–5 Mar 2024  | 79       | 48         | 4         |
| CC-MAIN-2024-18 | 12–25 Apr 2024     | 112      | 54         | 5         |
| CC-MAIN-2024-22 | 17–31 May 2024     | 125      | 50         | 9         |
| CC-MAIN-2024-26 | 12–25 Jun 2024     | 93       | 39         | 6         |
| CC-MAIN-2024-30 | 12–25 Jul 2024     | 179      | 86         | 8         |
| CC-MAIN-2024-33 | 2–16 Aug 2024      | 187      | 96         | 8         |
| CC-MAIN-2024-38 | 7–21 Sep 2024      | 181      | 86         | 9         |
| CC-MAIN-2024-42 | 3–16 Oct 2024      | 248      | 127        | 10        |
| CC-MAIN-2024-46 | 1–15 Nov 2024      | 251      | 163        | 8         |
| CC-MAIN-2024-51 | 1–15 Dec 2024      | 261      | 157        | 10        |

Three things stand out. First, the numbers are small for a company whose seed round made news around the world. Common Crawl's [FAQ](https://commoncrawl.org/faq) says its dataset "is a sample of the web, and we do not generally archive any entire website but a randomly selected subset of it."

Second, timing is luck. Mistral announced Mistral Large on 26 February 2024. CC-MAIN-2024-10 fetched the homepage the next day but missed the announcement, which first appears on 24 April 2024 in CC-MAIN-2024-18. Third, even a homepage can go missing: CC-MAIN-2024-42 holds 127 good captures from the domain, and none is the homepage.

### Step 4: Read the copy the crawl stored

The index points at a byte range inside a large WARC file, the archive format Common Crawl stores pages in. Ask for just that range, using `offset` as the start and `offset + length - 1` as the end:

```bash
curl -s -r 420680499-420685738 \
  "https://data.commoncrawl.org/crawl-data/CC-MAIN-2023-40/segments/1695233510941.58/warc/CC-MAIN-20231001205332-20231001235332-00601.warc.gz" \
  | gunzip | grep -o "<title>[^<]*</title>"
```

It prints `<title>Mistral AI | Open source models</title>`. Remove the `grep` to see the whole page. The copy, as stored on 1 October 2023, says "Our teaser model is out! The best 7B, Apache 2.0." and "Mistral 7B is better than Llama 2 13B on all benchmarks." The meta description reads "Frontier AI in your hands."

That page is Mistral's shadow training data. Any system that learned from that crawl met a small open-model lab with one 7B model. Its later models, funding rounds and customers were not on the page yet. It's the easiest step to skip, and the one that tells you what a model could have learned, not just whether you existed.

### Be polite to the index server

Common Crawl's FAQ says the index API is "heavily rate limited," asks you to sleep between calls, and warns that a blocked IP should wait 24 hours. For bulk work, it points to its URL Index in Amazon Athena or Apache Spark. On 29 September 2026 the server stopped answering partway through this audit, so the crawl-by-crawl counts above and the TechCrunch lookups below were read from the same index files, which Common Crawl also publishes on `data.commoncrawl.org`.

## How to Find the Pages That Mentioned You

Your own site is half of your shadow training data. The other half is what others wrote about you. Common Crawl's index lists URLs, not words, so you can't search it for your brand name. There are three routes, in order of effort.

1. **Check the URLs you already know.** List your press coverage, review profiles, directory listings and partner pages, then query each exact URL in each crawl in the window.
2. **Scan a URL prefix and filter it.** News sites put the story's name in the URL. Ask for a month of a publisher's URLs and filter for your brand.
3. **Read the text.** For each candidate URL, fetch the stored copy as in Step 4 and check how it describes you.

Here's route 2 for the TechCrunch story on Mistral's seed round, which ran on 13 June 2023:

```bash
curl -s -A "AcmeShadowAudit/1.0 (you@example.com)" \
  "https://index.commoncrawl.org/CC-MAIN-2024-10-index?url=techcrunch.com/2023/06/&matchType=prefix&output=json&fl=timestamp,url,status" \
  | grep -i mistral
```

It returns one line: the article, fetched on 22 February 2024 with status 200. Repeat the check across crawls to trace the story's path. It first shows up in CC-MAIN-2023-40, carrying newsletter tracking parameters. CC-MAIN-2023-50 holds it too, alongside a second TechCrunch piece on Mistral from 16 June. CC-MAIN-2024-18 missed it, and CC-MAIN-2024-22 caught it three more times, on 18 and 21 May 2024. Then it's gone.

### Why mentions vanish from later crawls

The reason sits in TechCrunch's robots.txt, which Common Crawl also stores. The May 2024 crawl fetched that file 100 times. The copies up to 15:33 UTC on 21 May have no rule for CCBot. From 21:19 UTC that day, every copy contains `User-agent: CCBot` and `Disallow: /`, next to the same rule for GPTBot. None of the later crawls checked, from June 2024 to September 2026, holds a single TechCrunch URL from June 2023.

TechCrunch isn't unusual. The [Consent in Crisis](https://arxiv.org/abs/2407.14933) audit of 14,000 web domains found that in one year, 2023 to 2024, new restrictions left 5% or more of all tokens in C4, and 28% or more of its most actively maintained critical sources, "fully restricted from use." So your press footprint in open training data can shrink even while every article stays online. Publishers choose whom to allow, and the choice differs by crawler. Our [AI crawler directory](/blog/ai-crawler-directory) lists the tokens they use.

### Why Wikipedia looks missing

A Wikipedia page missing from Common Crawl isn't missing from the training data. The December 2024 crawl held 61,328 captures from `en.wikipedia.org`, against more than 7.2 million English articles today, and Mistral AI's article appeared in none of the eight 2023 and 2024 crawls checked. Labs add Wikipedia separately: 3% of GPT-3's mix, and 4.5% of LLaMA's from Wikipedia dumps. Check Wikipedia and Wikidata directly, as the [entity authority guide](/blog/entity-authority-in-the-ai-era) shows.

## The Shadow Audit Score: Reading Your Results

Raw counts don't say much on their own. The Shadow Audit Score turns them into a verdict on your shadow training data for each model window you care about. Pick three models your buyers actually use, look up their cutoffs on the vendors' pages, and score each window on four checks.

| Check         | 0 points                                                       | 1 point                                         | 2 points                                                       |
| ------------- | -------------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------- |
| Presence      | No status 200 capture of your homepage in the window           | Homepage only                                   | Homepage plus at least two of About, product and pricing pages |
| Repetition    | No crawl in the window captured you                            | 1 or 2 crawls did                               | 3 or more crawls did                                           |
| Corroboration | No third-party URL naming you in window crawls                 | 1 to 4 distinct URLs                            | 5 or more distinct URLs                                        |
| Fidelity      | No captured homepage copy matches today's one-line description | Fewer than half of the captured homepages match | Half or more match                                             |

Add the four scores for a total out of 8, then read it as a band:

- **0 to 2, Invisible.** The model's training data held almost nothing about you. Expect "I don't have information about that company," a guess, or a namesake. Call it entity invisibility. It's normal for a brand born after the cutoff.
- **3 to 5, Faint.** The model may know your name but not much else, or know an old version of you.
- **6 to 8, Present.** The web in that window described you clearly and more than once. Check fidelity before you relax.

Fidelity carries extra weight because repetition shapes memory. [Kandpal and colleagues](https://arxiv.org/abs/2211.08411) showed that a model's ability to answer a factual question tracks how many training documents about it the model saw. If most stored copies describe your old product, the old product is the likelier answer. Presence, repetition and corroboration explain whether a model could know you. Fidelity explains what it would say.

## Worked Example: Tallyfold's Shadow Audit

Tallyfold is a made-up company, and so is every number in this section. It sells invoicing and payments software to agencies, at the reserved domain `tallyfold.example`. The story is invented for illustration. Tallyfold launched its site in mid-March 2024 as "payments for freelancers," then repositioned as "invoicing and payments software for agencies" in October 2024.

Here is what its shadow training data audit might return:

| Crawl           | Status 200 captures | Homepage captured?             | Homepage copy    | Third-party URLs naming Tallyfold |
| --------------- | ------------------- | ------------------------------ | ---------------- | --------------------------------- |
| CC-MAIN-2024-10 | 0                   | No                             | Site not live    | 0                                 |
| CC-MAIN-2024-18 | 1                   | Yes                            | Old: freelancers | 0                                 |
| CC-MAIN-2024-22 | 0                   | No                             | None             | 0                                 |
| CC-MAIN-2024-26 | 3                   | Yes, plus pricing and features | Old              | 0                                 |
| CC-MAIN-2024-30 | 2                   | Yes                            | Old              | 0                                 |
| CC-MAIN-2024-33 | 4                   | Yes                            | Old              | 1 partner directory page          |
| CC-MAIN-2024-38 | 5                   | Yes                            | Old              | 0                                 |
| CC-MAIN-2024-42 | 0                   | No                             | None             | 0                                 |
| CC-MAIN-2024-46 | 6                   | Yes                            | New: agencies    | 1 podcast episode page            |
| CC-MAIN-2024-51 | 7                   | Yes                            | New              | 0                                 |
| CC-MAIN-2025-05 | 8                   | Yes                            | New              | 1 review listing                  |

Now score three windows, using cutoffs from the Crawl-Window Map:

| Check                | Claude 3.5 Sonnet (April 2024) | GPT-5 (30 September 2024)             | Gemini 3 Pro (January 2025) |
| -------------------- | ------------------------------ | ------------------------------------- | --------------------------- |
| Crawls in the window | 2024-10, 2024-18               | 2024-10 to 2024-38                    | 2024-10 to 2025-05          |
| Presence             | 1 (homepage only)              | 2 (pricing and features from 2024-26) | 2                           |
| Repetition           | 1 (1 crawl)                    | 2 (5 crawls)                          | 2 (8 crawls)                |
| Corroboration        | 0                              | 1 (1 URL)                             | 1 (3 URLs)                  |
| Fidelity             | 0 (0 of 1 homepages)           | 0 (0 of 5)                            | 1 (3 of 8)                  |
| **Total out of 8**   | **2, Invisible**               | **5, Faint**                          | **6, Present**              |

Check the arithmetic. The GPT-5 window holds seven crawls, and five of them captured something: 2024-18, -26, -30, -33 and -38. That's 1 + 3 + 2 + 4 + 5 = 15 captures. The Gemini 3 Pro window adds four more crawls, three with captures: 15 + 0 + 6 + 7 + 8 = 36 captures from 8 crawls. Three of those eight homepages carry the new copy, which is 37.5%, under half, so fidelity scores 1.

Here's what each result means for Tallyfold's buyers.

- **Claude 3.5 Sonnet window: invisible.** From memory, such a model knows little beyond a name. A useful answer needs a search.
- **GPT-5 window: faint, and wrong.** Everything it could have seen says "freelancers." A confident old answer is harder to fix than no answer.
- **Gemini 3 Pro window: present but mixed.** The new story is there, outnumbered five crawls to three, so answers may blend both.

Tallyfold can't change the training data behind any of these windows. What it can change is the next one, and what search-grounded answers read today. For the retrieval side of a pivot like this, see our guide to [semantic drift after a product pivot](/blog/semantic-drift-ai-memory-reset).

## What to Do If You Were Invisible in 2024

No page you publish reaches into a trained model. Only the vendor can change its weights, by training a new model on new training data. That leaves three tracks, and each runs on its own clock.

### Track 1: Win the live search (weeks)

A search is where an assistant can meet you for the first time. Anthropic's [web search docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool) say Claude searches for information "beyond its knowledge cutoff," including "information about specific organizations, people, or products that might have changed." [Profound](https://www.joshblyskal.com/research/state-of-aeo-2026) saw words like "best," "near me" and the current year pull Claude into a search, while basic "what is" prompts were more likely to stay inside the model.

1. Make sure search crawlers can reach you. Allow OAI-SearchBot, Claude-SearchBot, PerplexityBot and the Google and Bing crawlers. Test your file with the free [robots.txt tester](/tools/robots-txt-tester).
2. Publish a page that answers "What is [brand]?" in its first sentence, with your category, audience, founding date and pricing.
3. Target the prompts that trigger search: comparisons, "best X for Y," current pricing and alternatives. Our breakdown of [how AI models rank brands in search results](/blog/how-ai-models-rank-brands-in-search-results) covers what happens after the search step.

### Track 2: Seed structured entity facts (weeks to months)

Structured entity seeding means stating the same facts, the same way, everywhere machines look. It helps retrieval now and gives the next crawl one story to capture.

1. Write one canonical definition sentence and use it on your homepage, About page and every profile you control.
2. Add Organization markup with a stable `@id` and `sameAs` links to your profiles. The free [schema generator](/tools/schema-generator) gives you a starting block, and our guide to [building a knowledge graph for AI](/blog/knowledge-graph-for-ai) covers the patterns.
3. Earn independent pages that name you next to your category. Check each publisher's robots.txt: a site that blocks CCBot stays out of Common Crawl and the open datasets built on it, though its pages still help live search.
4. Treat Wikidata as a result of coverage, not a tactic. [What entity authority in SEO means](/blog/what-is-entity-authority-in-seo) explains why independent sources matter more than self-made records.

### Track 3: Get captured by the next crawls (months)

The training data for the next models is being crawled now. If you want to be learned, make it easy.

1. Decide on purpose whether to allow training crawlers such as CCBot, GPTBot and ClaudeBot, and the Google-Extended token. Blocking them keeps your own pages out of those crawls and the [LLM training data](/glossary/llm-training-data) built from them. Third-party pages about you can still get in. The [AI robots.txt generator](/tools/ai-robots-txt-generator) writes either choice.
2. Announce your sitemap in robots.txt. Common Crawl's FAQ says its crawler uses "any Sitemap announced in the robots.txt file."
3. Link your About, product and pricing pages from the homepage, and keep their URLs stable across redesigns.
4. Retire old positioning everywhere you control, so the next crawl stores one story, not two.
5. Re-run the audit when a new crawl appears in `collinfo.json`, and score each new model's window once its cutoff is published.

| Your band              | This month                                                   | For the next model                                |
| ---------------------- | ------------------------------------------------------------ | ------------------------------------------------- |
| Invisible (0–2)        | Track 1 first: answer "What is [brand]?" on a crawlable page | Tracks 2 and 3 in full                            |
| Faint (3–5)            | Track 1, plus fix the facts retrieval finds                  | Raise repetition and corroboration                |
| Present, low fidelity  | Retire the old story on your site and profiles               | Make the new copy the majority in the next crawls |
| Present, high fidelity | Keep facts consistent                                        | Keep crawlers allowed and re-audit twice a year   |

If AI answers already state wrong facts about you, our guide to [fixing incorrect brand facts in AI answers](/blog/fix-incorrect-brand-facts-in-ai-answers) has the full recovery plan.

## Where Rankbox Fits in a Shadow Training Data Audit

Rankbox doesn't query Common Crawl, audit past crawls or put anything into a model's training data. Nobody can do that last part. It also doesn't track AI citations today. What it does is the writing half of Tracks 1 and 2. The [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes 2,000 to 3,500-word source-backed articles. [Brand Voice](/features/brand-voice) applies the tone, audience, style rules and product details you give it, so every article uses your canonical one-liner and mentions your product where it fits.

Articles reach your site through the Rankbox [API](/integrations/api), which a developer wires in. Each one is another crawlable page that states your current story. The Business plan is $49.50 a month with a 7-day trial. [See pricing](/pricing).

## Frequently Asked Questions

### What is shadow training data?

Shadow training data is the version of your brand that sat in web crawls before a model's knowledge cutoff. Vendors don't publish their exact datasets, so you can't see it directly. Common Crawl's historical indexes are the closest public record, because they show which of your pages, and which pages about you, were collected in each period and what they said.

### Did ChatGPT, Claude and Gemini train on Common Crawl?

No vendor confirms it for current models. OpenAI's 2020 GPT-3 paper, a predecessor of the models behind ChatGPT, gave filtered Common Crawl 60% of its training data mix. Later OpenAI, Anthropic and Google model cards describe public web data, their own crawlers and licensed data without naming Common Crawl. Treat it as a stand-in for the public web those crawlers saw, not as a confirmed ingredient.

### How do I check if my website was in Common Crawl in 2024?

Query each 2024 crawl's index at index.commoncrawl.org with your domain. Use crawl IDs CC-MAIN-2024-10 through CC-MAIN-2024-51, add `matchType=domain&output=json`, and count lines with status 200. A 404 with "No Captures found" means that crawl didn't collect your site. Sleep a few seconds between requests.

### What happens if my brand was founded after a model's knowledge cutoff?

The model has no memory of you. From training data alone it can only guess, decline, or confuse you with a namesake. It can still describe you correctly when it runs a web search and finds a clear page about you. That's why crawlable, search-ready pages matter most for young brands.

### Can I get my brand added to an AI model's training data?

Not directly. There's no submission form, and trained weights can't be edited from outside. You can make your site crawlable by training bots, keep your facts consistent, earn independent coverage, and let the next crawls capture that. Whether a lab uses those pages is its decision.

### Should I block CCBot?

Block CCBot only if keeping your content out of open datasets matters more than being learned. Common Crawl's archive feeds public datasets such as FineWeb. Blocking it doesn't affect live AI search, which uses other crawlers. Most brands that want to be recommended allow it and decide on other training crawlers one by one.

## References

1. [Language Models are Few-Shot Learners (Brown et al., 2020), arXiv](https://arxiv.org/abs/2005.14165)
2. [Language Models are Unsupervised Multitask Learners (Radford et al., 2019), OpenAI](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)
3. [GPT-4o System Card, OpenAI via arXiv](https://arxiv.org/abs/2410.21276)
4. [GPT-5 System Card, OpenAI](https://cdn.openai.com/gpt-5-system-card.pdf)
5. [GPT-5 model page, OpenAI API docs](https://developers.openai.com/api/docs/models/gpt-5)
6. [The Claude 3 Model Family: Opus, Sonnet, Haiku (model card), Anthropic](https://assets.anthropic.com/m/61e7d27f8c8f5919/original/Claude-3-Model-Card.pdf)
7. [Model Card Addendum: Claude 3.5 Haiku and Upgraded Claude 3.5 Sonnet, Anthropic](https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf)
8. [Transparency Hub, Anthropic](https://www.anthropic.com/transparency)
9. [Models overview, Claude Platform docs](https://platform.claude.com/docs/en/about-claude/models/overview)
10. [Gemini 3 Pro Model Card, Google DeepMind](https://storage.googleapis.com/deepmind-media/Model-Cards/Gemini-3-Pro-Model-Card.pdf)
11. [Gemini 3.8 Flash model card, Google DeepMind](https://deepmind.google/models/model-cards/gemini-3-8-flash/)
12. [Gemini 2.0 Flash, Gemini API docs](https://ai.google.dev/gemini-api/docs/models/gemini-2.0-flash)
13. [LLaMA: Open and Efficient Foundation Language Models (Touvron et al., 2023), arXiv](https://arxiv.org/abs/2302.13971)
14. [Llama 4 model card, Meta on GitHub](https://github.com/meta-llama/llama-models/blob/main/models/llama4/MODEL_CARD.md)
15. [Muse Glimmer model card, Meta on Hugging Face](https://huggingface.co/meta-models/Muse-Glimmer-30B)
16. [Common Crawl Index Server collection list, Common Crawl](https://index.commoncrawl.org/collinfo.json)
17. [FAQ, Common Crawl](https://commoncrawl.org/faq)
18. [Dated Data: Tracing Knowledge Cutoffs in Large Language Models (Cheng et al., 2024), arXiv](https://arxiv.org/abs/2403.12958)
19. [Consent in Crisis: The Rapid Decline of the AI Data Commons (Longpre et al., 2024), arXiv](https://arxiv.org/abs/2407.14933)
20. [FineWeb dataset card, Hugging Face](https://huggingface.co/datasets/HuggingFaceFW/fineweb)
