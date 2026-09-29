---
title: Do Author Bios Help AI Search Visibility? The Trust Signal Most AI Content Misses
description: Do author bios help AI search visibility? What Google says, what the few real tests show, and how to build an author footprint machines can check.
keyword: author bios
date: 2026-09-29
updated: 2026-09-29
author: Rankbox Team
tags: AI Search, SEO
---

Author bios help AI search visibility only indirectly, and no published test shows that adding them lifts AI citations on their own. What they do is make the person behind a page easy to identify and check: a named writer, a bio page, markup that ties the two together, and outside profiles that confirm the story. That supports the quality signals AI answers lean on. It isn't one of them.

Google has been plain about the ranking part. In January 2024 its Search Liaison wrote that ["author bylines aren't something you do for Google, and they don't help you rank better."](https://x.com/searchliaison/status/1744373098432864386) Yet Google's AI Overviews and AI Mode are, in Google's words, ["rooted in our core Search ranking and quality systems,"](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) and those systems look for content that shows who made it and why they know the subject. The only controlled test of bylines and AI visibility we could find, published by Seer Interactive in July 2026, called its own results "positive but inconclusive."

That's the gap in this post's title. A lot of AI-assisted content goes out under a brand name, a "Team" byline or, worse, an invented persona. No study counts how often, so read "most" as a warning, not a statistic. This guide sets out the evidence, a five-layer author footprint you can build, a way to score it and a test you can run on your own pages. For the Google-only question, read [do author bios help SEO](/blog/do-author-bios-help-seo). For templates and validated Person markup, see our [author bio SEO guide](/blog/author-bio-seo).

## Key Takeaways

- No published test shows author bios alone raise AI citations. Seer's July 2026 test on 123 pages found no significant change in AI Overviews and an inconclusive rise in Bing AI citations.
- Google says bylines don't help pages rank. Its AI features sit on ranking and quality systems that reward visible expertise, so a real author supports those signals without being one.
- OpenAI's publisher FAQ, Perplexity's crawler docs and Bing's webmaster guidelines say nothing about authors as of September 2026. Any author effect in those engines is inferred.
- Author bios work best as one layer of five: a consistent byline, a first-party bio page, Person markup, outside profiles that corroborate it, and proof of experience in the article itself.
- Markup is not the lever by itself. Ahrefs tracked 1,885 pages that added JSON-LD and saw no measurable citation lift in ChatGPT or AI Mode.
- Fake author bios are the real risk. Google's rater guidelines give the Lowest rating to AI content with made-up author profiles.
- You can measure the effect yourself with a randomized byline holdout and Bing's page-level citation counts.

## What the Evidence Says About Author Bios and AI Citations

Plenty of articles claim author bios drive AI citations. Very few show a test. Here is the published evidence we could verify on 29 September 2026, from the most direct to the least.

| Source and date                                                                                                     | What was tested                                                                                                    | Result                                                                                                                                                                                                     | What it tells you                                                                             |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [Seer Interactive](https://www.seerinteractive.com/work/case-studies/author-bylines), 1 July 2026                   | Detailed bylines and Person schema added to 123 blog pages, compared with untreated pages on the same blog         | AI Overviews: no significant difference. Bing AI citations roughly doubled, against a ~34% gain for control pages. Googlebot visited changed pages 11.7 percentage points more than controls for two weeks | The only direct AI test. The authors call it "positive but inconclusive"                      |
| [Ahrefs](https://ahrefs.com/blog/schema-ai-citations/), 11 May 2026                                                 | 1,885 pages that added any JSON-LD, against 4,000 matched control pages                                            | ChatGPT +2.2% and AI Mode +2.4%, both indistinguishable from zero. AI Overviews −4.6%                                                                                                                      | Adding markup, all types pooled, didn't move citations in 30 days. Person wasn't tested alone |
| [SearchPilot](https://www.searchpilot.com/resources/case-studies/authorship-content-and-eat-signals), 31 March 2022 | A byline plus a credentials bio on review pages, as a controlled split test, run twice                             | No detectable impact on organic traffic either time                                                                                                                                                        | On this site, Google rankings didn't move. It predates AI answers                             |
| [Mammen et al.](https://arxiv.org/abs/2601.13433), January 2026                                                     | 11 language models given math, legal and medical questions with answers "endorsed" by personas of rising expertise | Models followed wrong answers more often as the claimed expertise rose                                                                                                                                     | Models respond to authority cues, even false ones                                             |
| [Sun et al.](https://arxiv.org/abs/2604.05593), April 2026                                                          | The same content labeled human-written or AI-generated, judged by people and by LLMs                               | Both trusted the "human-authored" label more                                                                                                                                                               | Source labels shape machine trust, at least in a lab                                          |

### Reading the Seer test carefully

Seer first looked at the blogs of the six agencies earning the most AI citations in its Scrunch tracking, and found six byline elements they shared: a headshot and full name linked to a profile, a job title, three to five focus areas, outside credentials, years of experience, and Person markup with `worksFor`, `jobTitle` and `sameAs`. It added a mix of those to 123 of its own posts, then compared them with the untreated posts on the same blog.

The Bing result is the interesting one. Of treated pages that already had some citations, 44% improved, against 27% of control pages. Seer's least-known authors gained the most (+113%) and its founder's pages the least (+21%). That hints that bylines matter more for names an AI system doesn't already know. But the authors warn that "each tier has only a handful of pages" and that "page topics and recency" may explain part of the gain. Treat it as a lead worth testing, not a finding.

### Numbers to leave out

You'll also see neat multipliers on vendor blogs, such as named authors earning "1.9x more citations." The ones we checked, like [this AmICited post](https://www.amicited.com/blog/author-bylines-ai-citations/), give no sample, method or date. A figure you can't trace to a test is a guess with a decimal point.

So the honest summary is short. Author bios are cheap and low-risk, may help at the margin in some engines, and are not proven to move AI citations. The strongest case for them is still the reader, and the quality systems built to judge pages the way a careful reader would.

## Why Author Bios Could Matter to AI Systems

The direct evidence for author bios is thin. They still earn their place, because there are four plausible routes from a real author to an AI answer. Only the first is documented by an AI search vendor. The rest are inference, and are labelled as such.

### Route 1: Google's AI answers inherit Search's quality systems

Google says its generative features use retrieval to pull pages "from our Search index," ranked by its core systems. Its [helpful content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), last updated in December 2025, asks creators whether it is "self-evident to your visitors who authored your content" and whether bylines "lead to further information about the author." It adds that E-E-A-T "isn't a specific ranking factor," but that its systems use "a mix of factors" that identify it. So an author page doesn't rank anything. It supports the picture those factors are built to recognize. Our [E-E-A-T glossary entry](/glossary/e-e-a-t) explains the framework.

### Route 2: A named author is an entity machines can resolve

A byline that links to a bio page, with outside profiles in the markup, turns a string of letters into a person a system can tell apart from namesakes. Google's [Article markup docs](https://developers.google.com/search/docs/appearance/structured-data/article) say it "can understand both sameAs and url when disambiguating authors." That matters when an answer attributes a claim to someone.

### Route 3: Research agents are told to prefer primary sources

Anthropic reported that its early research agents ["consistently chose SEO-optimized content farms"](https://www.anthropic.com/engineering/multi-agent-research-system) over "academic PDFs or personal blogs," and fixed it with source-quality rules that favor "primary sources over lower-quality secondary sources." A practitioner writing under their own name about work they did looks far more like a primary source than an unsigned roundup. That's our inference, not Anthropic's claim about bylines.

### Route 4: Models react to authority cues

The two 2026 papers in the table show models giving more weight to claimed expertise and to a "human-authored" label. That suggests clear, true author bios may help a page read as trustworthy to a model. It also shows why false credentials are dangerous: the same bias makes a fake expert persuasive.

### What the other engines don't say

Outside Google, nobody documents an author signal. OpenAI's [publisher FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq) covers crawler access, not bylines. Perplexity's crawler docs are the same. Microsoft's [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/webmasters-guidelines-30fba23a) say "authority and trust signals" support eligibility for grounding and citations, and ask for content that is "original and authoritative," but never mention authors. As of September 2026, any claim that ChatGPT or Perplexity "reads your author schema" is a guess.

## The Author Footprint: Five Layers Machines Can Verify

We call it the **Author Footprint**: everything a person or a machine can check about who wrote a page, starting on the page and ending on other people's sites. It has five layers. Author bios sit in the second, but they only work when the other four back them up. The first three are yours to build this week. The fourth takes months. The fifth happens in every article.

### Layer 1: A consistent byline

Use one full name, spelled the same way, on every article, guest post, podcast page and profile. Link it to the author's bio page with a normal link. Google's author markup rules say to put only the name in `author.name`: no job title, no "Posted by," no publisher.

Consistency matters beyond your own site. Google's [Search Quality Rater Guidelines](https://guidelines.raterhub.com/searchqualityevaluatorguidelines.pdf) note that "a company or person may create content on many different websites" and tell raters to research "the underlying company or content creator." Three spellings of one name make that research harder for people and machines alike.

If a team truly wrote a piece, a team byline is honest. Google's docs let you mark the author as an `Organization`. What fails is "Admin" or "Staff" on a first-person article one person clearly wrote.

### Layer 2: A first-party bio page

Give each author one page on your domain, such as `/authors/maren-castell`. It should state their role, what they have actually done, any credentials, the topics they cover, links to their articles and links to their outside profiles. Google's [ProfilePage docs](https://developers.google.com/search/docs/appearance/structured-data/profile-page) list "an author page on a news site" and "an employee page on a company website" as valid profile pages.

Most author bios on the web are a short paragraph at the foot of a post. A page of their own is what makes them checkable. The bio page is the anchor. The byline points to it, the markup points to it, and outside profiles point back to it. Our [author bio SEO guide](/blog/author-bio-seo) has short, medium and long templates and a full page layout.

### Layer 3: Person markup that matches the page

On each article, mark the author as a `Person` with a `name`, a `url` pointing to the bio page and, where they exist, `sameAs` links. Google says it "strongly" recommends the type and `url` or `sameAs`. On the bio page, wrap the full `Person` in a `ProfilePage`. Here is the article-side piece for a fictional Tallyfold author:

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "How Agencies Can Cut Late Invoices in Half",
  "datePublished": "2026-09-22",
  "author": {
    "@type": "Person",
    "name": "Maren Castell",
    "jobTitle": "Head of Payments Operations",
    "url": "https://tallyfold.example/authors/maren-castell"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Tallyfold",
    "url": "https://tallyfold.example/"
  }
}
```

Tallyfold, Maren Castell and every URL here are made up. This block returned 0 errors and 0 warnings in the [Schema Markup Validator](https://validator.schema.org/) on 29 September 2026. The markup must describe what the page shows. If the bio page doesn't mention a credential, don't put it in the JSON. For linking authors, articles and your company into one connected graph with stable IDs, follow our [SEO knowledge graph walkthrough](/blog/seo-knowledge-graph).

### Layer 4: Outside profiles that corroborate the bio

What an author says about themselves is a claim. What others say is evidence. The rater guidelines tell raters to weigh "what others say about the website or content creators" and list "educational degrees, peer validation, expert co-authors, and citations" as signs of a good reputation.

So put the author's real profiles in `sameAs` and link them from the bio page: LinkedIn, conference speaker pages, bylines on trade publications, a professional register if their field has one, GitHub for engineers, ORCID for researchers. Then earn more of them. Guest articles, podcast interviews and talks under the same name build the footprint that a model can match. Only add a Wikidata item if the person meets its notability rules; our guide to [building a knowledge graph for AI](/blog/knowledge-graph-for-ai) explains those rules.

Two newer options exist. Google's [Search profiles](https://support.google.com/websearch/answer/16904498) let US creators with at least 10,000 followers on YouTube, Instagram, X or TikTok create a profile page on Google, as of September 2026. Google says creating one "doesn't directly affect your content's ranking." And Mastodon's [fediverse:creator tag](https://blog.joinmastodon.org/2024/07/highlighting-journalism-on-mastodon/) shows a verified author name under shared links, for writers who use the fediverse.

### Layer 5: Proof of experience in the article itself

A bio claims expertise. The article has to show it. Google's rater guidelines put the test simply: "which would you trust: a product review from someone who has personally used the product or a 'review' by someone who has not?"

Proof looks like specifics only the author could know: numbers from their own work, a screenshot from their own account, what went wrong the first time, a judgment call and the reason for it. Google's AI guide asks for "unique, expert-led content that provides value beyond common knowledge." Without this layer, the other four are a frame around an empty picture.

## Score Your Author Footprint: A Worked Tallyfold Example

Score each layer from 0 to 2 for any author, then add them up. The rubric is deliberately blunt so two people get the same score, which makes it handy for auditing author bios across a whole site.

| Layer                | 0 points                                 | 1 point                                                             | 2 points                                                                      |
| -------------------- | ---------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Byline               | None, or "Admin" on a one-person article | Named, but spelled differently across sites                         | Same full name everywhere, linked to a bio page                               |
| Bio page             | None                                     | A paragraph on the team page                                        | Its own URL with role, experience, topics and articles                        |
| Markup               | No author, or the wrong type             | An author with a name only (`Person`, or `Organization` for a team) | `Person` with `url` and `sameAs`, matching the bio page                       |
| Outside profiles     | None findable                            | Self-made profiles only (LinkedIn, X)                               | At least one independent source, such as a talk, a trade byline or a citation |
| Proof in the article | Generic advice anyone could write        | One first-hand example                                              | First-hand data, examples or judgment throughout                              |

Tallyfold is a fictional invoicing and payments app for agencies. Its post "How Agencies Can Cut Late Invoices in Half" first went out under "Tallyfold Team." The details below are illustrative.

| Layer                | Before      | After       | What changed                                                                |
| -------------------- | ----------- | ----------- | --------------------------------------------------------------------------- |
| Byline               | 0           | 2           | "Tallyfold Team" became Maren Castell, linked to her bio page               |
| Bio page             | 0           | 2           | New page: nine years in agency finance, the topics she covers, her articles |
| Markup               | 1           | 2           | A bare `Organization` author became a `Person` with `url` and `sameAs`      |
| Outside profiles     | 0           | 1           | LinkedIn and a conference speaker page; no independent coverage yet         |
| Proof in the article | 1           | 2           | Added reminder timings and results from 40 client accounts, anonymized      |
| **Total**            | **2 of 10** | **9 of 10** |                                                                             |

The score went from 2 to 9 in a week of work, and the missing point is the slow one. Independent corroboration can't be written in-house. It comes from pitching Maren for podcasts and trade articles over the next few months.

Fix the layers in order of cost. Bylines, bio pages and markup are one-time template work. Proof is a habit for every article. Outside profiles are a campaign. A footprint score also makes a useful audit: sort your authors by it, and fix the ones behind your highest-traffic pages first.

## How to Test Whether Author Bios Move Your AI Visibility

The published evidence can't tell you what happens on your site. A small test can. We call it the **Byline Holdout Test**. It borrows the control-group method from our guide to [measuring GEO](/blog/how-to-measure-geo) and adds three fixes for the problems Seer ran into.

1. **Pick 30 to 60 comparable posts** in one topic area that already earn some AI visibility, such as Bing citations or Search Console AI impressions in the last eight weeks. Pages with zero citations can't show a change.
2. **Randomize in matched pairs.** Sort the posts by recent citations, pair neighbours, and flip a coin inside each pair. That spreads topics and publish dates evenly, the two confounders Seer named.
3. **Touch both groups on the same day.** Treated pages get author bios, linked bylines and Person markup. Control pages get a neutral edit, such as fixing a typo, so both are recrawled. Seer saw Googlebot hit its edited pages harder for two weeks, and a recrawl bump can pass for an author effect.
4. **Measure page by page.** Bing's [AI Performance report](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview) shows "citation counts for specific URLs" across Copilot and Bing's AI summaries. Search Console's [generative AI report](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports) shows AI Overview and AI Mode impressions by page. For ChatGPT and Perplexity, which give site owners no report, run a fixed prompt panel. Our [Bing Webmaster Tools AI guide](/blog/bing-webmaster-tools-ai-indexing-guide) covers the Bing setup.
5. **Take four weeks of baseline, skip two, then measure four to eight weeks.**
6. **Calculate the lift:** treated change minus control change.

Here is an illustrative result for 40 Tallyfold posts, 20 in each group, using Bing citations:

| Group                  | Baseline (4 weeks) | After (4 weeks) | Change           |
| ---------------------- | ------------------ | --------------- | ---------------- |
| Author footprint added | 212                | 262             | +23.6%           |
| Neutral edit only      | 205                | 228             | +11.2%           |
| **Lift**               |                    |                 | **+12.4 points** |

Is 12.4 points real? Check it against noise before you celebrate. During the baseline, compare the two groups week by week, as if the test had already started. If they drifted apart by 9 points in a normal week, a 12.4-point lift is promising but thin. Run it again on a second topic area before you roll author bios out sitewide.

## Fake Experts, AI Personas and Other Ways to Lose Trust

Missing author bios cost you a little. Fake ones can cost you a lot. Google's rater guidelines (September 2025 edition) tell raters to give the Lowest rating to "a webpage or website with 'fake' owner or content creator profiles," and give this example: "AI generated content with made up 'author' profiles (AI generated images or deceptive creator descriptions) in order to make it appear that the content is written by people." Inflated credentials get the same treatment: "an author or creator profile inaccurately claims to have credentials or expertise."

The 2026 research explains why the temptation exists. People and models both trust a "human-authored" label more. Models defer to claimed experts, even when the expert is wrong. That's exactly why a fake author is deception, not optimization. It works by exploiting trust, and when it's found out, the damage lands on your brand.

Four other habits to drop:

- **Renting names.** The guidelines show a news page whose sponsored byline is "authored by paying advertisers" as an example of site reputation abuse.
- **Bios written for search engines.** Google's John Mueller [wrote in February 2025](https://bsky.app/profile/johnmu.com/post/3lhiuwlnhsc2a) that "people can tell when author bios are used purely as an SEO tactic. It's kinda awkward, not reassuring."
- **"Reviewed by" lines nobody earned.** If an expert didn't check the piece, don't say they did.
- **Listing AI as the author.** Google's [AI content FAQ](https://developers.google.com/search/blog/2023/02/google-search-and-ai-content), published in February 2023, calls that "probably not the best way" to tell readers AI was involved.

## How to Byline AI-Assisted Content Honestly

This is where most AI content misses the trust signal. The fix is not to hide the AI. It's to make sure a real, accountable person owns the result, and that author bios describe that person truthfully.

- **Byline the person who owns it.** That's the human who shaped the brief, added the first-hand material, checked every claim and would answer a reader's email about it. If that person didn't do those things, the article isn't ready.
- **Explain the how where readers would wonder.** Google says disclosures are useful "for content where someone might think 'How was this created?'" A one-line note works.
- **Use an organization byline when that's the truth.** A company glossary or a product changelog can be authored by the company. Link the byline to your About page.
- **Add an expert reviewer for money and health topics.** Google's systems give "even more weight" to content with strong E-E-A-T on those topics, and a named reviewer must really review.

The contrast with the worst of AI publishing is stark. NewsGuard counted [3,749 AI content farm sites](https://www.newsguardtech.com/special-reports/ai-tracking-center/) as of June 2026, and one of its four criteria for the label is that a site "does not clearly disclose that its content is produced by AI." A named human who stands behind each article is the clearest way to look nothing like them. Our post on [whether automated blog posts work for SEO](/blog/are-automated-blog-posts-effective-for-seo) covers the rest of Google's AI content rules.

## Where an AI Writer Stops and Your Author Starts

An AI writer can do the research and the first draft. It can't supply the person. Rankbox's [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and drafts 2,000 to 3,500-word, source-backed articles, and [Brand Voice](/features/brand-voice) applies the tone, audience and product details you give it. The name on the byline, the first-hand examples, the review and the author bios still have to come from a real person on your team.

Rankbox doesn't track AI citations today, so run the holdout test with Bing's and Search Console's free reports. Our free [schema generator](/tools/schema-generator) builds Person markup to paste into your bio pages. Plans and the 7-day trial are on the [pricing page](/pricing).

## Frequently Asked Questions

### Do author bios help AI search visibility?

Not directly, as far as any published test shows. Seer Interactive's July 2026 test found no significant change in AI Overviews and an inconclusive rise in Bing AI citations. Author bios still help indirectly: they make expertise checkable for readers and for Google's quality systems, which its AI features are built on.

### Does ChatGPT use author information when it picks sources?

OpenAI doesn't say. Its publisher FAQ covers crawler access and referral tracking, not bylines or author markup. Any effect in ChatGPT is inferred from general patterns, such as models giving weight to expertise cues. Test it with a prompt panel rather than assuming it.

### Do author bios need Person schema to appear in AI Overviews?

No. Google says a page only needs to be indexed and eligible for a snippet, with "no additional technical requirements." Google recommends author markup with a `url` or `sameAs` so it can tell authors apart. Ahrefs found adding JSON-LD in general didn't lift AI Overview citations, so treat Person markup as clarity, not a ranking lever.

### Should AI-assisted articles have an author byline?

Yes, a real person who reviewed and owns the article. Google says giving AI an author byline is "probably not the best way" to disclose its use. Byline the human editor, and add a short note on how the piece was made where readers might wonder.

### Can a small site with unknown authors still get cited by AI?

Yes, even without famous author bios. Google's rater guidelines say little reputation information on a small site "is not indicative of high or low quality." Seer's least-known authors even showed the biggest Bing gains, though its sample was small.

### How long do new author bios take to show up in AI answers?

No study gives a timeline. Seer saw extra Googlebot visits to edited pages during a two-week window. Allow four to eight weeks after that, and compare against control pages so you don't mistake normal swings for a result.

## References

1. [Creating helpful, reliable, people-first content, Google Search Central](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
2. [Search Quality Rater Guidelines (September 2025), Google](https://guidelines.raterhub.com/searchqualityevaluatorguidelines.pdf)
3. [Optimizing for generative AI search, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
4. [Article structured data, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/article)
5. [ProfilePage structured data, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
6. [Google Search's guidance about AI-generated content, Google Search Central Blog (February 2023)](https://developers.google.com/search/blog/2023/02/google-search-and-ai-content)
7. [Google SearchLiaison on author bylines, X (8 January 2024)](https://x.com/searchliaison/status/1744373098432864386)
8. [John Mueller on author bios, Bluesky (6 February 2025)](https://bsky.app/profile/johnmu.com/post/3lhiuwlnhsc2a)
9. [Do Author Bylines Influence AI Visibility?, Seer Interactive (July 2026)](https://www.seerinteractive.com/work/case-studies/author-bylines)
10. [We Tracked 1,885 Pages Adding Schema. AI Citations Barely Moved., Ahrefs (May 2026)](https://ahrefs.com/blog/schema-ai-citations/)
11. [Can Authorship Content Impact E-A-T Signals?, SearchPilot (2022)](https://www.searchpilot.com/resources/case-studies/authorship-content-and-eat-signals)
12. [Who Endorsed It? Measuring Authority Bias Across Expertise Levels in Language Models, arXiv (2026)](https://arxiv.org/abs/2601.13433)
13. [Label Effects: Shared Heuristic Reliance in Trust Assessment by Humans and LLM-as-a-Judge, arXiv (2026)](https://arxiv.org/abs/2604.05593)
14. [How we built our multi-agent research system, Anthropic](https://www.anthropic.com/engineering/multi-agent-research-system)
15. [Bing Webmaster Guidelines, Microsoft](https://www.bing.com/webmasters/help/webmasters-guidelines-30fba23a)
16. [Publishers and Developers FAQ, OpenAI Help Center](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq)
17. [Introducing AI Performance in Bing Webmaster Tools, Microsoft Bing](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview)
18. [Create a new Search profile, Google Search Help](https://support.google.com/websearch/answer/16904498)
19. [AI Tracking Center, NewsGuard](https://www.newsguardtech.com/special-reports/ai-tracking-center/)
20. [Highlighting journalism on Mastodon, Mastodon Blog (July 2024)](https://blog.joinmastodon.org/2024/07/highlighting-journalism-on-mastodon/)
