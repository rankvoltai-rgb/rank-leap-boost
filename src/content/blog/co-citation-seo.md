---
title: Co-Citation SEO: Teaching LLMs to Connect Your Brand to Industry Leaders
description: Co-citation SEO gets your brand named next to category leaders. A source-by-source playbook, outreach rules from Google and the FTC, and a 90-day plan.
keyword: co-citation SEO
date: 2026-11-05
updated: 2026-11-05
written: 2026-10-01
author: Rankbox Team
tags: AI Search, Link Building
---

Co-citation SEO is the work of getting independent pages to name your brand in the same passage as the leaders of your category, so search engines and AI models file you in the same group. The pages that count most are the ones AI engines read when a buyer asks for a shortlist: "best X" roundups, comparisons, review sites, podcasts, data stories and forum threads. Earn a place on those pages on merit, and your name travels with the leaders' names into the answers built from them.

The prize sits on a few page types. In [Ahrefs' study of 750 ChatGPT prompts](https://ahrefs.com/blog/best-lists-research/), published in December 2025, "best X" blog lists made up 43.8% of the page types ChatGPT cited, and brands placed higher on third-party lists were more likely to be recommended. For US software questions, a [University of Toronto team](https://arxiv.org/abs/2509.08919) found AI search took 72.7% of its sources from earned media, meaning pages written by third parties. Google's own results drew 45.4% from earned media for the same questions.

No AI vendor documents that being named beside a leader teaches a model that you belong in the category. That claim is an inference from research and correlation studies, and our guide to [link building and co-citation for AI visibility](/blog/link-building-ai-visibility-co-citation) grades every piece of evidence behind it. This post is the practical half of co-citation SEO: which sources to work on, in what order, how to pitch them within the rules, and a 90-day plan with the arithmetic shown. For the definitions, start with [what co-citation in SEO means](/blog/what-is-co-citation-in-seo). To decide which entities to build around, read our [entity SEO strategy](/blog/entity-seo-strategy) guide.

## Key Takeaways

- Co-citation SEO aims at one outcome: an independent page that names you in the same passage as one or more category leaders, with or without a link.
- Retrieval is the clearest mechanism. AI search reads specific passages from the pages it retrieves, so a roundup paragraph that lists three brands hands all three names to the answer at once.
- The idea that models "learn you're a legitimate player" from co-citation is an inference. Research shows co-occurrence shapes what models recall, but no study isolates same-passage co-citation.
- Eight source types carry most co-citations: roundups, comparison pages, review sites, analyst coverage, podcasts and video, conference talks, data studies and community threads. Each has its own gatekeeper and its own rules.
- Find targets by harvesting the URLs AI engines cite for your category prompts, then rank them with the Placement Priority Score: citations × leaders named × door.
- Google's link spam policy and the FTC's endorsement rules block the same shortcut: paying for a place that readers will take as an independent judgment.
- In the fictional Tallyfold plan, 100 staff hours and $1,200 over 90 days land 8 placements and lift its co-citation share on cited pages from 13.5% to 25.0%.

## How Co-Citation SEO Works Inside Language Models

### Words that keep the same company end up close together

Search embeddings and language models rest on an old idea from linguistics: words that occur in similar contexts tend to have similar meanings. Jurafsky and Martin's textbook [Speech and Language Processing](https://web.stanford.edu/~jurafsky/slp3/5.pdf) calls this the distributional hypothesis and traces it to Joos, Harris and Firth in the 1950s. Harris described the gap in meaning between two words as "corresponding roughly to the amount of difference in their environments."

Embeddings turn that idea into numbers. Word2vec, a 2013 method from Google researchers, learned word vectors that [capture "a large number of precise syntactic and semantic word relationships."](https://arxiv.org/abs/1310.4546) Later tools did the same for named things. [Wikipedia2Vec](https://arxiv.org/abs/1812.06280) learns vectors for words and entities together, and it set a top score on a test of how related two entities are. The pattern holds across these methods: names that keep turning up in the same contexts sit near each other.

That's the root of the "recommendation cluster" idea behind co-citation SEO. If your brand keeps appearing in the passages where the leaders appear, your neighborhood starts to look like theirs. In this guide, Tallyfold is a fictional invoicing app for agencies, and Brindlework and Kestrelyn are its fictional leading rivals.

### Two places a cluster can form

1. **In retrieval, while the answer is written.** Google says its AI features retrieve pages through its ranking systems, and then its systems ["review the specific information from those retrieved pages"](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) to write the response. A roundup paragraph that says "Brindlework, Kestrelyn and Tallyfold all handle retainer invoicing" reaches the answer as one unit, with all three names in it. This path needs no new model and can change within days of a page update. See [content chunking](/glossary/content-chunking) for how retrieval splits pages, and our [vector distance experiment](/blog/vector-distance-vs-keyword-density) for how wording moves similarity.
2. **In the weights, across model generations.** [Kandpal and colleagues](https://arxiv.org/abs/2211.08411) found "strong correlational and causal relationships" between a model's accuracy on a fact and the number of training documents that contain the fact's entities. [Kang and Choi](https://arxiv.org/abs/2310.08256) found models prefer "frequently co-occurred words over the correct answer." Models also lean toward big names: an EMNLP 2024 paper found LLMs [disproportionately associate global brands with positive attributes](https://arxiv.org/abs/2406.13997). In principle, sharing passages with the names a model already favors lets a small brand borrow some of that context, though no study has measured it.

### What's documented and what's inferred

Keep the evidence grades straight when you pitch this work internally. They follow our [co-citation evidence guide](/blog/link-building-ai-visibility-co-citation).

| Claim                                                                  | Grade      | Basis                                                  |
| ---------------------------------------------------------------------- | ---------- | ------------------------------------------------------ |
| Google's AI features draw on what's said about products across the web | Documented | Google's AI optimization guide, updated July 2026      |
| Co-occurrence in training text shapes what a model recalls             | Research   | Kandpal et al. (ICML 2023); Kang and Choi (EMNLP 2023) |
| Brands mentioned more often on the web get named more in AI answers    | Correlated | Ahrefs, 75,000 brands, December 2025                   |
| Being named beside leaders teaches a model you're a legitimate player  | Inferred   | Follows from the rows above; no study isolates it      |

Google's AI optimization guide says its generative AI features "can show what's being said about products and services across the web, including in blogs, videos, and forum discussions. However, seeking inauthentic 'mentions' across the web isn't as helpful as it might seem." So the only version of co-citation SEO worth running is the earned one.

## The Co-Citation SEO Source Map

The Co-Citation SEO Source Map is our working table of the eight places co-citations come from. "Who decides" names the gatekeeper you have to convince. Effort and cost are Rankbox's planning estimates for a small B2B team, not measured figures. The evidence column says what published studies found, with dates.

| Source type                       | Who decides                                | Effort and cash cost                                                                 | What the evidence says                                                                                                                                                                                                                                                                                                |
| --------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Best X" roundups                 | An editor                                  | Medium; $0 if earned                                                                 | 43.8% of ChatGPT's cited page types ([Ahrefs](https://ahrefs.com/blog/best-lists-research/), Dec 2025); listicle citations in ChatGPT fell 30% from December 2025 to January 2026 ([Seer Interactive](https://www.seerinteractive.com/insights/the-listicle-window-is-closing-in-ai-search-30-decline-mom), Feb 2026) |
| Comparison and alternatives pages | An editor, or you on your own site         | Medium; $0                                                                           | Earned media led the sources for "X vs Y" questions in every system tested ([Chen et al.](https://arxiv.org/abs/2509.08919), Sept 2025)                                                                                                                                                                               |
| Review sites                      | Real customers, under the platform's rules | Low to medium; $0 for a basic profile ([G2](https://sell.g2.com/claim-your-profile)) | G2 and Capterra gained ChatGPT citation share in early 2026 ([Seer Interactive](https://www.seerinteractive.com/insights/the-listicle-window-is-closing-in-ai-search-30-decline-mom), Feb 2026)                                                                                                                       |
| Analyst coverage                  | An analyst firm                            | High; often months                                                                   | No public study isolates analyst pages in AI answers                                                                                                                                                                                                                                                                  |
| Podcasts and video                | A host or producer                         | Medium; $0                                                                           | YouTube mentions had the strongest correlation with AI visibility, about 0.737 ([Ahrefs](https://ahrefs.com/blog/ai-brand-visibility-correlations/), Dec 2025)                                                                                                                                                        |
| Conference talks and webinars     | A program committee                        | High; travel                                                                         | No study isolates talk pages; recordings often end up on YouTube                                                                                                                                                                                                                                                      |
| Original data studies             | Journalists who choose to cover them       | High; staff time                                                                     | "Original research or data" ranks among the pitch elements journalists value most ([Muck Rack](https://www.globenewswire.com/news-release/2026/03/19/3259178/0/en/muck-rack-s-2026-state-of-journalism-report-finds-82-of-journalists-use-ai.html), Mar 2026)                                                         |
| Community threads                 | Members and moderators                     | Medium and ongoing; $0                                                               | Reddit held 21.6% of the top-50 citation share in Perplexity ([Ahrefs](https://ahrefs.com/blog/most-cited-domains-perplexity/), Sept 2026); ChatGPT cut Reddit citations by at least 73% in August 2026 ([Otterly.AI](https://otterly.ai/blog/chatgpt-reddit-citations/))                                             |

Below is the co-citation SEO method for each row, in the order most small teams should try them.

### "Best X" roundups: pitch facts, not adjectives

Roundups are the densest source in co-citation SEO, because one list names five to fifteen brands. They're also crowded with self-interest. Peec AI's review of [232,000 citations](https://peec.ai/blog/self-promotional-listicles-analysis-from-232k-citations) from December 2025 to February 2026 found about 11% came from lists where a company ranked its own product, with no sign that engines were filtering them out over the 12 weeks.

1. Collect every roundup AI engines cite for your prompts (the next section shows how).
2. Check freshness. Of 1,100 cited lists in Ahrefs' study, 79.1% had been updated in 2025 and 26% in the two months before the check. A recently updated list has an active editor.
3. Send the editor a one-screen fact sheet: what you do, who it's for, a dated starting price, one checkable fact and a customer who will talk.
4. Ask to be considered. Don't ask for a link or a position, and don't offer money for either.

Seer found the lists that kept winning ChatGPT citations in early 2026 shared "recency, comprehensiveness, external validation, and structure." Pitch the editors who already work that way.

### Comparison pages: fair on your site, accurate everywhere else

For comparison questions like "Garmin vs Apple Watch", Chen and colleagues found earned content led in every system they tested. So on other sites, your job is accuracy. Find the "Brindlework vs Kestrelyn" and "Brindlework alternatives" pages engines cite, and send each editor a sourced correction where your product fits the reader's need.

Your own comparison pages still help, with a limit. In a July 2026 experiment, Ahrefs published [34 self-promotional pages](https://ahrefs.com/blog/self-promotional-content-ai-seo-experiment/) on five domains and tracked 9,886 answers. For its new conference brand, 82% of the new mentions came in answers that cited one of those pages. For the established Ahrefs brand, only 6% did. Even when AI cited a page promoting the conference, it skipped the conference 43% of the time and recommended a rival event from that same page. The author's rule: "Add yourself to the right contexts, but don't crown yourself." Our [comparison page formula](/blog/comparison-page-formula) shows how to write the fair version.

### Review sites: honest reviews, under the platform's rules

Review platforms build category pages that list many products side by side, which is co-citation SEO at scale. Claim your profile, choose the categories buyers browse, describe yourself in your category's words, and ask recent customers for reviews.

The rules are strict. [G2's community guidelines](https://legal.g2.com/community-guidelines) bar reviews from "Employees working for the product's company and employees of a direct competitor," label incentivized reviews as incentivized, and cap any incentive at $100. The FTC's reviews rule, covered in the outreach section below, adds legal limits on top.

### Analyst coverage: a long game for most small companies

An analyst chart puts vendors side by side, but it's the slowest door in co-citation SEO. Gartner says a [Magic Quadrant](https://www.gartner.com/en/research/methodologies/magic-quadrants-research) covers "markets where growth is high and provider differentiation is distinct," and its interactive version pulls in Peer Insights user reviews. For a small company, that review side is the open part of the door.

### Podcasts and video: get your name said, then transcribed

Episode pages, show notes and transcripts tend to name the guest's company next to the others discussed. Video counts too. YouTube held [22.9% of the top-50 citation share](https://ahrefs.com/blog/most-cited-domains-ai-overviews/) in Google's AI Overviews in Ahrefs' September 2026 count. Pitch shows your buyers already hear, with a topic that covers the category, and ask if the episode page will carry a transcript. Our guide to [podcast transcripts and AI citations](/blog/podcast-transcripts-ai-search-citations) has a transcript format that engines can quote.

### Conference talks and webinars: agenda pages are lists too

An event agenda names every speaker's company on one page, and the recording often lands on YouTube. Submit talks that teach rather than pitch, and co-host webinars with partners who share your buyers. No study isolates talk pages in AI answers, so treat this row as a slower bet that also feeds the video row.

### Original data studies: give reporters a reason to name the category

A data story about your category tends to name the category's players, which builds co-citation into the coverage. Muck Rack surveyed 897 journalists for its State of Journalism 2026 report: "original research or data" was among the most valued parts of a pitch, and 88% said they delete pitches that miss their beat. Publish the method next to the numbers, and pitch only reporters who cover your buyers.

### Community threads: answer as yourself

Forum threads compare tools in plain words, and most engines read them. ChatGPT is the current outlier. Otterly.AI found that while ChatGPT cut its Reddit citations in August 2026, Google, AI Mode, Gemini and Perplexity moved by just 0.6%. Answer questions under your own name, say where you work, and name a rival when it fits the question better than you do. Our guide to [Reddit in AI search](/blog/reddit-in-ai-search) covers each community's rules.

## How to Find the Pages AI Engines Already Cite for Your Category

The Source Map tells you where co-citations come from. This method tells you which pages your co-citation SEO work should chase first. It differs from the Co-Citation Gap Audit in our [evidence guide](/blog/link-building-ai-visibility-co-citation). That audit measures your share of pages; this method ranks the pages by what a placement on each one is worth.

### Step 1: Harvest the cited URLs

1. Write 15 to 20 unbranded buyer prompts. Our free [AI Visibility Prompt Kit](/tools/ai-visibility-prompt-generator) generates 30 across the buying journey that you can choose from.
2. Run each prompt twice in ChatGPT, Perplexity and Google's AI Mode, in a clean session with memory off. OpenAI's [help page](https://help.openai.com/en/articles/9237897-chatgpt-search) says to "Select Sources, when available, to view cited sources and other relevant links." Perplexity numbers its sources under each answer, as our [Perplexity guide](/ai-seo/perplexity) explains.
3. Paste every third-party URL into a sheet, with a count of how many answers cited it.

### Step 2: Widen the net with search operators

Answers change from run to run, so add the pages engines are likely to read next. Google's [search help](https://support.google.com/websearch/answer/2466433) documents quotes for exact phrases, `site:`, a minus sign to exclude, and `after:` for pages updated after a date. A query that pairs both leaders in quotes with an `after:` date and minus signs for their own domains finds fresh pages that name both.

If your site is verified in Bing Webmaster Tools, its [AI Performance report](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview) shows grounding queries, "the key phrases the AI used when retrieving content" from your pages. Search those phrases yourself to see which rival pages compete for the same answers.

### Step 3: Read the passage, not the page

For each URL, find the passage where the leaders appear. Record its source type, how many leaders it names, and whether you're already in it. A leader named in a footer isn't a target. A paragraph that compares three tools is.

### Step 4: Rank the pages with the Placement Priority Score

The Placement Priority Score is Rankbox's method for ranking co-citation SEO targets. It multiplies three numbers:

**Placement Priority Score = Citations × Leaders × Door**

- **Citations:** how many answers in your panel cited the page.
- **Leaders:** how many category leaders the passage names, capped at 3.
- **Door:** 2 if the gatekeeper takes pitches or open contributions, 1 if the door is slow (an analyst cycle or an annual list), and 0 if the only way in is an unlabeled paid placement.

A zero door makes the whole score zero, and that's deliberate. You can still buy an ad slot that's clearly labeled and kept apart from the editorial ranking, but it isn't a co-citation target.

## Co-Citation SEO Outreach That Follows Google's and the FTC's Rules

Two sets of rules cover every co-citation SEO pitch. Google's rules govern links. The FTC's rules govern anything readers might take as an independent opinion.

### What Google's link spam policy says

Google's [spam policies](https://developers.google.com/search/docs/essentials/spam-policies), last updated on 28 August 2026, define link spam as "the practice of creating links to or from a site primarily for the purpose of manipulating search rankings." Its examples include:

- "Exchanging money for links, or posts that contain links"
- "Exchanging goods or services for links"
- "Sending someone a product in exchange for them writing about it and including a link"
- "Advertorials or native advertising where payment is received for articles that include links that pass ranking credit"

Paid placements aren't banned outright. Google says buying links for advertising and sponsorship is allowed "as long as they are qualified with a `rel="nofollow"` or `rel="sponsored"` attribute value." Its [guide to qualifying outbound links](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links) says to mark "advertisements or paid placements" with `sponsored`.

### What the FTC's endorsement rules say

The FTC's [Endorsement Guides](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255), revised in July 2023, set the core rule. When a connection between an endorser and a seller "might materially affect the weight or credibility of the endorsement, and that connection is not reasonably expected by the audience, such connection must be disclosed clearly and conspicuously." Payment and free products both count as connections.

Three passages in the Guides map straight onto co-citation work:

1. **Paid list positions.** A review site that "accepts money from manufacturers in exchange for higher rankings" is deceptive, and "A headphone manufacturer who pays for a higher ranking on the website may also be held liable." A disclosure doesn't fix it, the FTC says, because the payments decide the order.
2. **Employees in communities.** An employee promoting their company's product on a discussion board "should clearly and conspicuously disclose their relationship to the manufacturer."
3. **Sponsored articles.** The FTC's [native advertising guide](https://www.ftc.gov/business-guidance/resources/native-advertising-guide-businesses) says promotional content is deceptive if it suggests that it's "independent, impartial, or from a source other than the sponsoring advertiser."

The FTC's [rule on consumer reviews and testimonials](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-D/part-465), published in August 2024, adds two lines. You can't offer incentives "conditioned expressly or by implication on" reviews "expressing a particular sentiment." And you can't present a site you control as one that "provides independent reviews or opinions" about a category that includes your own product. That second line covers the "best X" list on your own blog if it poses as neutral.

### The pre-pitch checklist

Check every pitch, post and review request against these six lines before it goes out:

1. **Nothing of value is tied to inclusion, position or a link.** Test access for an editor is fine if you require nothing back and they disclose it.
2. **No anchor text requests.** If an editor links, they choose the words. If a site wants payment for a link, it must carry `rel="sponsored"`.
3. **Facts a reader can check:** a price with a date, who the product is for, and one data point with its method.
4. **Your role stated plainly** in every forum answer or comment you write.
5. **Customers invited to review, never told what to say**, with no reward that depends on the rating.
6. **Paid placements labeled as ads**, counted in your ad budget, and left out of your co-citation count.

## A 90-Day Co-Citation SEO Plan: Tallyfold Worked Example

Tallyfold is a fictional invoicing and payments app for agencies, and its leading rivals, Brindlework and Kestrelyn, are fictional too. Every number below is illustrative, chosen so the arithmetic is easy to follow.

### Days 1 to 7: the baseline

Tallyfold starts its first co-citation SEO quarter with 20 unbranded prompts in ChatGPT, Perplexity and AI Mode, run twice each: 20 × 3 × 2 = 120 answers.

| Brand       | Answers naming it (of 120) | Visibility rate |
| ----------- | -------------------------- | --------------- |
| Brindlework | 81                         | 67.5%           |
| Kestrelyn   | 54                         | 45.0%           |
| Tallyfold   | 11                         | 9.2%            |

The sources panels list 74 unique third-party URLs. Of those, 52 name Brindlework or Kestrelyn in a passage, and Tallyfold is co-cited on 7 of them. Its co-citation share is 7 ÷ 52 = 13.5%. By type, the 52 pages are 17 roundups, 9 comparison or alternatives pages, 8 review-site category pages, 7 Reddit threads, 5 YouTube videos or podcast pages, 4 trade articles and 2 analyst pages (17 + 9 + 8 + 7 + 5 + 4 + 2 = 52).

### Days 8 to 14: rank the targets

Tallyfold scores the 45 pages where it's missing (52 − 7 = 45). Six rows from the sheet:

| Page                                                  | Citations | Leaders | Door | Score |
| ----------------------------------------------------- | --------- | ------- | ---- | ----- |
| Roundup on a payments blog, updated August 2026       | 9         | 3       | 2    | 54    |
| Review site's "agency invoicing" category page        | 7         | 3       | 2    | 42    |
| "Brindlework alternatives" page on a SaaS review blog | 6         | 2       | 2    | 24    |
| Reddit thread comparing invoicing tools               | 5         | 2       | 2    | 20    |
| Analyst market guide                                  | 4         | 2       | 1    | 8     |
| Pay-to-play "top 10" list with no ad label            | 8         | 3       | 0    | 0     |

The last row shows the score at work: the list is cited often, but the only way on is a paid slot that readers would take as editorial.

### Days 15 to 90: the work and what it costs

| Work                                                    | Days  | Staff hours | Cash                     |
| ------------------------------------------------------- | ----- | ----------- | ------------------------ |
| Build the prompt panel and Source Map                   | 1–14  | 10          | $0                       |
| Rewrite Tallyfold's own comparison page fairly          | 15–21 | 6           | $0                       |
| Pitch 12 roundup editors with a fact sheet              | 15–45 | 12          | $0                       |
| Invite 40 recent customers to review, with no incentive | 15–30 | 4           | $0                       |
| Publish a data study from anonymized invoice data       | 22–60 | 24          | $0                       |
| Pitch 8 podcasts and record 2 episodes                  | 30–75 | 10          | $0                       |
| Submit 1 conference talk for a December event           | 45–60 | 16          | $1,200 travel, committed |
| Answer forum and Reddit questions, with disclosure      | 15–90 | 12          | $0                       |
| Re-run the panel and log the results                    | 84–90 | 6           | $0                       |
| **Total**                                               |       | **100**     | **$1,200**               |

### Day 90: the result

Eight placements land: 3 roundups, 1 alternatives page, 2 review-site category pages, 1 podcast episode and 1 trade article about the data study (3 + 1 + 2 + 1 + 1 = 8). Six of them are on pages already in the 52-page set. The podcast page and the trade article are new pages, so they count toward future panels rather than this share.

- **Co-citation share on tracked pages:** (7 + 6) ÷ 52 = 13 ÷ 52 = 25.0%, up from 13.5%.
- **Visibility rate:** Tallyfold is named in 23 of 120 answers, or 19.2%, up from 9.2%. That's a rise of 10.0 points.
- **Cost per placement:** 100 hours ÷ 8 placements = 12.5 staff hours each, plus the talk's travel budget.

Is a 10-point rise real? With 120 answers in each period, the margin of error on the gap between rates near 9% and 19% is about ±9 points at 95% confidence. So the rise just clears it. Tallyfold treats it as a signal and confirms it the way our [GEO measurement guide](/blog/how-to-measure-geo) suggests, with control prompts it didn't work on and another month of runs.

## Where Rankbox Fits in Co-Citation SEO

Co-citations go to pages worth naming, and that's the part Rankbox helps with. [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask ChatGPT, Perplexity and Google about your category, with volume, difficulty and intent as model estimates, which gives you the prompts for your panel. The [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes 2,000 to 3,500-word source-backed articles, such as a fair comparison page or the write-up of a data study you ran. Articles reach your site through Rankbox's API.

Rankbox doesn't pitch editors, book podcasts, post in communities or track mentions and citations in AI answers. The outreach and the measurement in this playbook stay with you. The Business plan is $49.50 a month, with a 7-day trial when you add a card. [See pricing](/pricing).

## Frequently Asked Questions

### What is co-citation SEO?

Co-citation SEO is the practice of earning mentions on independent pages that name your brand in the same passage as the leading brands in your category, with or without a link. The aim is for search engines and AI models to group you with those leaders. Our [definition guide](/blog/what-is-co-citation-in-seo) covers the term's history.

### Does co-citation SEO work without backlinks?

Partly. AI search reads passages from the pages it retrieves, so an unlinked mention on a cited page can put your name into an answer. Links still help pages get found and ranked, and Google ties its AI features to its ranking systems. No study isolates unlinked co-citation as a cause, so plan for both.

### Is paying for list placements allowed in co-citation SEO?

Only as a clearly labeled ad, kept apart from the editorial ranking. Google treats paid links that pass ranking credit as link spam. The FTC says a review site that sells higher rankings is deceptive even with a disclosure, and the brand that pays may be liable too. A visible ad slot with a `rel="sponsored"` link stays inside both sets of rules.

### Which sources matter most for co-citation SEO?

The pages AI engines already cite for your category prompts. For most B2B categories, that means "best X" roundups, comparison pages, review-site category pages and forum threads. Harvest the cited URLs from a prompt panel, then rank them by citations, leaders named and how open the door is.

### How long does co-citation SEO take to show in AI answers?

Weeks for answers built from live search, because an edited page can be crawled and retrieved within days. Months or longer for what a model knows without searching, since that changes only when a model is retrained. Re-run a fixed prompt panel every month to see real movement.

### Should my own "best X" list be part of co-citation SEO?

Only as a supporting page. A list you publish isn't independent, so it isn't co-citation. Ahrefs found self-promotional pages helped a new brand appear, but AI often recommended a rival from the same page. The FTC's reviews rule also bars presenting a site you control as an independent reviewer of a category that includes your product.

## References

1. [Do Self-Promotional "Best" Lists Boost ChatGPT Visibility? Study of 26,283 Source URLs, Ahrefs](https://ahrefs.com/blog/best-lists-research/)
2. [Generative Engine Optimization: How to Dominate AI Search (Chen et al., 2025), arXiv](https://arxiv.org/abs/2509.08919)
3. [Speech and Language Processing, Chapter 5: Embeddings (Jurafsky and Martin, 2026 draft), Stanford University](https://web.stanford.edu/~jurafsky/slp3/5.pdf)
4. [Distributed Representations of Words and Phrases and their Compositionality (Mikolov et al., 2013), arXiv](https://arxiv.org/abs/1310.4546)
5. [Large Language Models Struggle to Learn Long-Tail Knowledge (Kandpal et al., 2023), arXiv](https://arxiv.org/abs/2211.08411)
6. [Impact of Co-occurrence on Factual Knowledge of Large Language Models (Kang and Choi, 2023), arXiv](https://arxiv.org/abs/2310.08256)
7. [Optimizing for generative AI features on Google Search, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
8. [The Listicle Window Is Closing in AI Search: 30% Decline MoM, Seer Interactive](https://www.seerinteractive.com/insights/the-listicle-window-is-closing-in-ai-search-30-decline-mom)
9. [Self-promotional listicles analysis: data from 232,000 citations, Peec AI](https://peec.ai/blog/self-promotional-listicles-analysis-from-232k-citations)
10. [Self-Promotional Content Works, Until It Backfires (AI SEO Experiment), Ahrefs](https://ahrefs.com/blog/self-promotional-content-ai-seo-experiment/)
11. [Top Brand Visibility Factors in ChatGPT, AI Mode, and AI Overviews (75k Brands Studied), Ahrefs](https://ahrefs.com/blog/ai-brand-visibility-correlations/)
12. [The 50 Most-Cited Websites in Perplexity (September 2026), Ahrefs](https://ahrefs.com/blog/most-cited-domains-perplexity/)
13. [ChatGPT cut Reddit citations by at least 73% in August 2026, Otterly.AI](https://otterly.ai/blog/chatgpt-reddit-citations/)
14. [State of Journalism 2026 press release, Muck Rack via GlobeNewswire](https://www.globenewswire.com/news-release/2026/03/19/3259178/0/en/muck-rack-s-2026-state-of-journalism-report-finds-82-of-journalists-use-ai.html)
15. [Community Guidelines, G2](https://legal.g2.com/community-guidelines)
16. [Spam policies for Google web search, Google Search Central](https://developers.google.com/search/docs/essentials/spam-policies)
17. [Qualify your outbound links to Google, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links)
18. [Guides Concerning the Use of Endorsements and Testimonials in Advertising, 16 CFR Part 255, eCFR](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255)
19. [Rule on the Use of Consumer Reviews and Testimonials, 16 CFR Part 465, eCFR](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-D/part-465)
20. [Native Advertising: A Guide for Businesses, Federal Trade Commission](https://www.ftc.gov/business-guidance/resources/native-advertising-guide-businesses)
