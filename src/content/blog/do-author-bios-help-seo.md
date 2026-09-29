---
title: Do Author Bios Help SEO? What Google Says and What the Evidence Shows
description: Do author bios help SEO? Google says bylines don't lift rankings. Its guidance, the rater guidelines, dated quotes from its staff and the tests.
keyword: author bios
date: 2026-09-29
updated: 2026-09-29
author: Rankbox Team
tags: SEO, AI Search
---

No, not as a ranking factor. Google has said on the record that author bios and bylines don't make a page rank better, and the only public split test of adding them that we could find saw no change in organic traffic. They can still help SEO indirectly, because they make it easier for readers, and for the people Google pays to rate its results, to see who wrote a page and whether that person knows the subject.

That gap between "not a ranking factor" and "still worth doing" confuses a lot of site owners. Google's documentation tells you to add bylines. Its Search Liaison tells you bylines "don't help you rank better." Both are true, and this post shows how they fit together, with every Google statement dated and linked.

This is the Google SEO half of the question. If you care about ChatGPT, Perplexity and AI Overviews citing your pages, read our full guide on [whether author bios help AI search visibility](/blog/do-author-bios-help-ai-search-visibility), which covers the only published AI test and how to run your own.

## Key Takeaways

- Author bios are not a direct Google ranking factor. Google's Search Liaison said in January 2024 that bylines "don't help you rank better" and that Google doesn't "check out our credentials."
- Google still recommends them. Its helpful content guidance asks whether bylines "lead to further information about the author," and it "strongly" encourages accurate authorship information.
- The rater guidelines (September 2025 edition) ask raters to research each content creator's reputation, and rate fake author profiles as Lowest quality. Raters don't set rankings.
- The only public controlled SEO test we could find, a 2022 SearchPilot experiment on a review site, found no detectable traffic change after adding bylines and bios, twice.
- Author bios pay off where readers ask "who wrote this?": health, money and legal advice, product reviews and news. Google News requires bylines to be eligible.

## What Google's Own Guidance Says About Authors

Google's written guidance on authors sits in three places. None of them says author bios raise rankings. All of them say readers should be able to tell who wrote a page.

### The "Who" questions in the helpful content guide

Google's page on [creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), last updated in December 2025, asks you to judge content by "Who, How, and Why." Under "Who," it lists three questions:

1. "Is it self-evident to your visitors who authored your content?"
2. "Do pages carry a byline, where one might be expected?"
3. "Do bylines lead to further information about the author or authors involved, giving background about them and the areas they write about?"

It then says: "We strongly encourage adding accurate authorship information, such as bylines to content where readers might expect it." The same page is careful about what that means for ranking. It says E-E-A-T (experience, expertise, authoritativeness and trust) "itself isn't a specific ranking factor," but that Google's systems use "a mix of factors that can identify content with good E-E-A-T." Our [E-E-A-T glossary entry](/glossary/e-e-a-t) explains the four parts.

### The 2023 answer on AI content and bylines

When Google published its [guidance on AI-generated content](https://developers.google.com/search/blog/2023/02/google-search-and-ai-content) in February 2023, it answered the byline question directly. It said you "should consider having accurate author bylines when readers would reasonably expect it, such as to any content where someone might think, 'Who wrote this?'" It added that publishers in Google News "should use bylines and author information," and that giving AI an author byline "is probably not the best way" to disclose AI use. Our post on [automated blog posts](/blog/are-automated-blog-posts-effective-for-seo) covers the rest of that guidance.

### What the markup documentation adds

Google's [Article structured data docs](https://developers.google.com/search/docs/appearance/structured-data/article), updated 8 September 2026, have a section on author markup. It asks you to list every visible author, to put only the name in the name field, to use the `Person` type for people, and to add a `url` or `sameAs` link, because Google "can understand both sameAs and url when disambiguating authors." Its [ProfilePage docs](https://developers.google.com/search/docs/appearance/structured-data/profile-page) name "an author page on a news site" as a valid profile page.

This markup helps Google understand and display authors. Google doesn't describe it as a way to rank higher. Our [author bio SEO guide](/blog/author-bio-seo) has a validated example.

## What the Quality Rater Guidelines Ask Raters to Check

Google's [Search Quality Rater Guidelines](https://guidelines.raterhub.com/searchqualityevaluatorguidelines.pdf) are the manual for the people who score sample results so Google can check its ranking changes. The current edition is dated 11 September 2025 and was still the live version on 29 September 2026. Google says raters "have no control over how pages rank" and their data "is not used directly in our ranking algorithms." The guidelines show what Google's systems aim to reward, not how they score it.

Authors come up in four sections:

| Section       | What raters are told                                                                                                                                                                        | What it means for author bios                         |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 2.5.2         | Every page should make clear who "created the content on the page," though an alias is fine on forums and social sites                                                                      | Put a name on content where a reader would expect one |
| 3.3 and 3.3.4 | Research the content creator's reputation when the site didn't write the page. "Educational degrees, peer validation, expert co-authors, and citations" count as evidence for professionals | A bio should point to things others can confirm       |
| 3.3.5         | For small sites, having little reputation information "is not indicative of high or low quality"                                                                                            | An unknown author isn't a penalty                     |
| 4.5.3         | Rate as Lowest any site with "fake" creator profiles, such as "AI generated content with made up 'author' profiles," and profiles that claim credentials the person doesn't have            | Invented or inflated author bios are the worst option |

Section 3.4 adds where raters should look. They start with "what the website or content creators say about themselves," then check "what others say," then judge what is visible on the page. A bio page is the starting point, not the proof.

## What Google's People Have Said on the Record

Google staff have been asked about authors for more than a decade. Their answers have been consistent. The table lists each statement we could trace to its original source, with the date it was made.

| Date            | Who                               | What they said                                                                                                                                                                                                                                                                                            |
| --------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 28 August 2014  | John Mueller                      | Google ended Authorship in results because the information "isn't as useful to our users as we'd hoped, and can even distract from those results." He added that Google was "no longer processing this data" ([Search Engine Roundtable](https://www.seroundtable.com/google-authorship-dead-19077.html)) |
| June 2019       | John Mueller                      | Treat author pages "more as a quality thing, as a user experience thing," and check them with "a short user study" ([Search Engine Journal](https://www.searchenginejournal.com/author-biography-google-ranking/312175/))                                                                                 |
| February 2023   | Danny Sullivan and Chris Nelson   | Add accurate bylines "when readers would reasonably expect it" (Google Search Central blog)                                                                                                                                                                                                               |
| 8 January 2024  | Danny Sullivan, as Search Liaison | "Author bylines aren't something you do for Google, and they don't help you rank better. They're something you do for your readers" ([X](https://x.com/searchliaison/status/1744373098432864386))                                                                                                         |
| 8 January 2024  | Danny Sullivan, as Search Liaison | "Google doesn't somehow 'check out our credentials'" ([X](https://x.com/searchliaison/status/1744371735405772927))                                                                                                                                                                                        |
| 9 January 2024  | Danny Sullivan, as Search Liaison | "Google Search doesn't require bylines." Google News requires them "for _eligibility_," but they don't "cause you to _rank_ better in News nor Search" ([X](https://x.com/searchliaison/status/1744793069940277273))                                                                                      |
| 6 February 2025 | John Mueller                      | "People can tell when author bios are used purely as an SEO tactic. It's kinda awkward, not reassuring" ([Bluesky](https://bsky.app/profile/johnmu.com/post/3lhiuwlnhsc2a))                                                                                                                               |
| Since June 2026 | Google Search Help                | Creating a new Google Search profile "doesn't directly affect your content's ranking on Google Search" ([Search Help](https://support.google.com/websearch/answer/16904498))                                                                                                                              |

Read together, the message is simple. Bylines and bios are for readers. Google doesn't score them. But the first January 2024 post also says publications that use bylines "may exhibit the type of other characteristics our ranking systems find align with useful content." The bio is a symptom of a careful publisher, not a cause of rankings.

The oldest record is from the Authorship era itself. A year before Google ended the program, its Webmaster Help channel took a question about rel="author" on pages that aren't articles:

![Will Google be evaluating the use of rel="author" moving forward?](youtube:3QlY8ba0jYI "A Google Webmaster Help answer from June 2013, a year before Authorship was dropped from results.")

## What the Evidence Shows

Google's word is one input. Tests and leaks are another. Here is what they add.

### A controlled split test found no traffic change

SearchPilot runs controlled SEO experiments: it splits similar pages into a changed group and a control group, then compares their traffic against a forecast. In a [case study published in March 2022](https://www.searchpilot.com/resources/case-studies/authorship-content-and-eat-signals), a review site added a byline with the author's photo and name at the top of pages, plus a bio with credentials at the bottom. The result was "no detectable impact" on organic traffic, and "if anything" a small negative effect. A retest with a smaller byline gave the same answer.

One site is one site. But it's the only public controlled test of author bios and Google traffic we could find, and it matches what Google says.

### The 2024 leak showed Google stores author data

In May 2024, internal Google API documentation leaked. Mike King of iPullRank [reported](https://ipullrank.com/google-algo-leak) that Google "explicitly stores the authors associated with a document as text" and checks whether an entity mentioned on a page is also its author. That shows Google records authors. It doesn't show how, or whether, the data affects rankings. Google [cautioned against](https://en.wikipedia.org/wiki/2024_Google_Search_documentation_leak) "inaccurate assumptions about Search based on out-of-context, outdated, or incomplete information."

### A 2026 test saw Googlebot come back, then settle

Seer Interactive added detailed bylines and Person markup to 123 posts and [published the results](https://www.seerinteractive.com/work/case-studies/author-bylines) in July 2026. Googlebot crawled the changed pages 11.7 percentage points more than the control for about two weeks, then returned to normal. Seer puts the spike down to the page changes, which any edit can trigger. In AI Overviews, the changed pages performed about the same as the control. Our [AI visibility guide](/blog/do-author-bios-help-ai-search-visibility) covers its Bing results in detail.

So the evidence points the same way as Google's statements. Adding author bios doesn't move rankings on its own. Its value sits with readers and with the quality of the work behind the byline.

## When Author Bios Are Worth Adding: The Bio Payoff Table

Author bios don't rank pages, so the real question is when they're worth the effort. The answer is when a reader would stop and ask "who wrote this?" That's Google's own test. We turned it into a table by page type. Call it the **Bio Payoff Table**.

| Page type                       | Would a reader ask "who wrote this?" | What the bio should show                                                             | Payoff                                                                  |
| ------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| Health, money or legal advice   | Always                               | Qualifications, license or role, and a named reviewer if the writer isn't the expert | High. Google gives "even more weight" to strong E-E-A-T on these topics |
| Product reviews and comparisons | Yes                                  | Proof the writer used the product, and any conflict of interest                      | High. The guidelines prize first-hand experience                        |
| News and reporting              | Yes                                  | Name, role, beat and contact route                                                   | Required to be eligible for Google News                                 |
| B2B how-to and opinion          | Usually                              | The job the writer does and the results they have seen                               | Medium. It supports reader trust                                        |
| Glossary, docs and changelogs   | Rarely                               | A company byline linked to the About page                                            | Low. An organization author is honest here                              |
| Product and landing pages       | No                                   | Nothing. The company is the author                                                   | None                                                                    |
| Forums and user posts           | Sometimes                            | A consistent username                                                                | Low. The guidelines accept aliases                                      |

Two rules sit under the table. First, never invent a bio to fill a row; the guidelines rate fake profiles as Lowest. Second, keep author bios short and factual. Mueller's point about bios written as "an SEO tactic" applies to stuffed keyword lists and long credential dumps alike.

For what to write in each bio, and the page and markup around it, use our [author bio SEO templates](/blog/author-bio-seo). To tie authors into your site's structured data, see our [SEO knowledge graph walkthrough](/blog/seo-knowledge-graph).

## A Note on AI-Assisted Posts

If an AI tool drafted the post, author bios matter more, not less. Google's advice points to naming a real person who stands behind the content, and to explaining how it was made where readers might wonder. Rankbox sells an AI article writer, so weigh this with that in mind: its [Citation-Ready Writer](/features/citation-ready-writer) drafts source-backed articles, but the byline, the first-hand examples and the review must come from someone on your team. Avoid any tool or service that offers to invent an author for you.

## Frequently Asked Questions

### Are author bios a Google ranking factor?

No. Google's Search Liaison said in January 2024 that bylines "don't help you rank better," and Google's guidance says E-E-A-T "isn't a specific ranking factor." Author bios support the signals Google looks for, such as clear ownership and real expertise, but Google doesn't score the bio itself.

### Does Google check author credentials?

Not for ranking, according to Google. Its Search Liaison wrote that "Google doesn't somehow 'check out our credentials.'" Human quality raters are told to research a creator's reputation, but their ratings help Google test its systems and don't change how individual pages rank.

### Do author bios help E-E-A-T?

They help show it, not create it. Google's helpful content guide asks whether bylines lead to background about the author. A bio that points to real experience supports E-E-A-T. A bio with no link to the topic adds nothing, and a fake one is rated Lowest.

### Do I need author bios for Google News?

Yes, for eligibility. Google's news policies say news sources should provide "clear dates and bylines" and "information about the authors, publication, and publisher." Google's Search Liaison says bylines are required for eligibility there, but don't improve ranking in News or Search.

### Should every page on my site have an author?

No. Add a named author where a reader would ask "who wrote this?", such as advice, reviews and opinion. Product pages, docs and glossaries can carry your company as the author. Google's markup docs allow an Organization as the author.

### Does Google still use rel=author?

No. Google stopped showing Authorship in results in August 2014, and John Mueller said Google was "no longer processing this data." Today Google's documented route is Article structured data, where it recommends a `url` or `sameAs` link for each author.

## References

1. [Creating helpful, reliable, people-first content, Google Search Central](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
2. [Search Quality Rater Guidelines (September 2025), Google](https://guidelines.raterhub.com/searchqualityevaluatorguidelines.pdf)
3. [Google Search's guidance about AI-generated content, Google Search Central Blog (February 2023)](https://developers.google.com/search/blog/2023/02/google-search-and-ai-content)
4. [Article structured data, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/article)
5. [ProfilePage structured data, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
6. [Google News policies, Publisher Center Help](https://support.google.com/news/publisher-center/answer/6204050)
7. [SearchLiaison on author bylines, X (8 January 2024)](https://x.com/searchliaison/status/1744373098432864386)
8. [SearchLiaison on bylines and Google News, X (9 January 2024)](https://x.com/searchliaison/status/1744793069940277273)
9. [Google Says Author Bylines Don't Help You Rank Better, Search Engine Roundtable (January 2024)](https://www.seroundtable.com/google-author-bylines-ranking-36684.html)
10. [John Mueller on author bios, Bluesky (February 2025)](https://bsky.app/profile/johnmu.com/post/3lhiuwlnhsc2a)
11. [Google Completely Drops Authorship Support, Search Engine Roundtable (August 2014)](https://www.seroundtable.com/google-authorship-dead-19077.html)
12. [Google's John Mueller Answers Whether Author Bio is Necessary, Search Engine Journal (2019)](https://www.searchenginejournal.com/author-biography-google-ranking/312175/)
13. [Can Authorship Content Impact E-A-T Signals?, SearchPilot (2022)](https://www.searchpilot.com/resources/case-studies/authorship-content-and-eat-signals)
14. [Secrets from the Google Algorithm Leak, iPullRank (May 2024)](https://ipullrank.com/google-algo-leak)
15. [Do Author Bylines Influence AI Visibility?, Seer Interactive (July 2026)](https://www.seerinteractive.com/work/case-studies/author-bylines)
16. [Create a new Search profile, Google Search Help](https://support.google.com/websearch/answer/16904498)
