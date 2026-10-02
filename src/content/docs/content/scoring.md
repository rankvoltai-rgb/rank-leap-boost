---
title: The SEO and GEO score
nav_title: SEO and GEO score
description: Every check behind the Rankbox article score, how points are weighted and calculated, what each check means for Google and AI engines, and how to raise it.
order: 6
updated: 2026-10-02
---

Every article in Rankbox gets one score from 0 to 100 that measures how well its text is built for Google and for AI answer engines. The score comes from 11 checks on the article's keyword use, length, structure, FAQ, meta description, links and readability. It's calculated inside Rankbox from the article itself, with no outside data, so it updates the moment you type. This page lists every check, the exact thresholds and weights, and how to raise the score.

## Where you see the score

| Place | What it shows |
| --- | --- |
| Article panel, **SEO** section | The score gauge, a verdict, and a line such as "9 of 11 checks passed". Shown once the article has text |
| Article panel, **Checklist** | Every check with a pass, warning or fail icon and a one-line detail |
| Article panel, **Content** | **Words**, **Read time**, **Keyword density**, **Headings**, **Links**, **Readability** |
| **Articles**, SEO column | The score of each published article, with a colored dot |
| **Rank** page | Your average score, the **What AI engines look for** panel, and a **Strengthen** move for weak articles |
| REST API | `seo_score` on each article, as stored at the last write or save |

The same checks run inside the writer. Every new draft is revised against them until it scores 100, stops improving, or reaches the pass limit. See [How articles are written](/docs/content/writing#revision-passes).

## How the score is calculated

Each check has a weight. A check that passes earns its full weight, a warning earns half, and a fail earns nothing.

```text
score = round(100 × points earned ÷ points available)
```

With a **Target keyword** set, all 11 checks run and 105 points are available. Without a keyword, the three keyword checks are skipped and a "Focus keyword set" check fails in their place, so 83 points are available and the highest possible score is 82.

| Example | Points earned | Score |
| --- | --- | --- |
| Keyword set, every check passes | 105 of 105 | 100 |
| Keyword set, meta description of 172 characters (warning) and readability 48 (warning), everything else passes | 98.5 of 105 | 94 |
| Keyword set, 900 words (warning), only 2 H2 sections (warning), no FAQ (warning), everything else passes | 88.5 of 105 | 84 |
| No keyword, everything else passes | 68 of 83 | 82 |

## Score bands

| Score | Gauge and dot color | Verdict in the panel |
| --- | --- | --- |
| 80 to 100 | Green | "Strong — ready to rank." |
| 55 to 79 | Amber | "Good — a few tweaks left." |
| 0 to 54 | Red | "Needs work to rank well." |

On the Rank page, a published article below 70 can appear as a **Strengthen** move with an **Improve** button that opens it.

## Every check

The table lists all 11 checks in the order the **Checklist** shows them. Labels change with the result where noted. Detail text is shown exactly as in the panel; `{n}` stands for a number and `{keyword}` for your keyword.

| Check | Weight | Pass | Warning | Fail |
| --- | --- | --- | --- | --- |
| **Keyword in title** | 15 | Keyword appears in the title: `"{keyword}" appears in the title.` | None | Keyword missing from the title: `Add "{keyword}" to the title.` |
| **Focus keyword set** (replaces the check above when there's no keyword) | 15 | Never | None | Always: `Add a focus keyword to score the article.` |
| **Keyword in introduction** | 10 | Keyword in the first 100 words: `Keyword appears in the first 100 words.` | Not there: `Mention the keyword early in the intro.` | Never fails |
| **Keyword density** | 12 | 0.5% to 2.5%: `{n}% — within the ideal range.` | Above 0 but under 0.5%: `{n}% — use the keyword a bit more.` Above 2.5%: `{n}% — risk of keyword stuffing.` | 0%: `Keyword does not appear in the body.` |
| **In-depth content** / **Content length** | 15 | 1,500 words or more (label **In-depth content**): `{n} words — great depth for ranking.` | 800 to 1,499 words: `{n} words — aim for 1,500+.` | Under 800 words: `{n} words — too short to rank well.` |
| **Clear section structure** / **Section structure** | 10 | 3 or more H2 headings (label **Clear section structure**): `{n} H2 sections help scanning and AI parsing.` | 1 or 2 H2: `Only {n} H2 — add more sections.` | No H2: `Add H2 headings to structure the article.` |
| **Sub-headings** | 5 | 2 or more H3 headings: `{n} H3 sub-headings.` | 1 H3: `1 H3 sub-headings.` No H3: `Add H3s to break down sections.` | Never fails |
| **Scannable lists** | 10 | 3 or more list items: `{n} list items improve readability.` | 1 or 2 list items: `{n} list items improve readability.` | No list items: `Add bullet or numbered lists.` |
| **FAQ for AI engines** | 8 | An FAQ is found: `FAQ section helps AI answer engines cite you.` | No FAQ: `Add a FAQ section for AI citations.` | Never fails |
| **Meta description** | 8 | 120 to 160 characters: `{n} characters — ideal length.` | 1 to 119, or more than 160: `{n} characters — aim for 120–160.` | Empty: `Write a meta description.` |
| **Internal & external links** | 7 | 2 or more links: `{n} links add authority and context.` | 1 link: `1 links add authority and context.` | No links: `Add links to relevant pages and sources.` |
| **Readability** | 5 | Flesch score 55 or more | 40 to 54 | Below 40 |

The **Readability** detail always reads as the grade and the number, for example `Fairly easy (Flesch 62).` The same detail text is used for a pass, a warning and a fail.

### Share of the score

With a keyword set, each check's share of the 100 points is its weight divided by 105.

| Check | Weight | Share of the score |
| --- | --- | --- |
| Keyword in title | 15 | 14.3 |
| In-depth content | 15 | 14.3 |
| Keyword density | 12 | 11.4 |
| Keyword in introduction | 10 | 9.5 |
| Section structure | 10 | 9.5 |
| Scannable lists | 10 | 9.5 |
| FAQ for AI engines | 8 | 7.6 |
| Meta description | 8 | 7.6 |
| Internal & external links | 7 | 6.7 |
| Sub-headings | 5 | 4.8 |
| Readability | 5 | 4.8 |

## How each check is measured

All checks read the article body, the title, the **Target keyword** and the **Meta description**. The body is measured as text with its formatting removed. It includes everything in the body: headings, lists, the FAQ, the References, the video section and any writer notes. The title and meta description aren't part of the body.

| Measure | Rule |
| --- | --- |
| Words | Runs of characters separated by spaces |
| Keyword in title | Case-insensitive. The keyword must appear as written anywhere in the title, even inside a longer word |
| Keyword in introduction | Case-insensitive. The keyword must appear in the first 100 words of the body. A heading at the top of the body counts toward those 100 words |
| Keyword density | Exact-phrase, whole-word matches of the keyword, divided by the body's word count, times 100, rounded to 2 decimals. A multi-word keyword only matches with its words in the same order |
| H2 and H3 | Headings of that level in the body. The title (H1) isn't counted |
| List items | Every bullet and numbered list item |
| Links | Every link in the body: to your pages, to sources, and the link under the video |
| FAQ | Found if the body contains "frequently asked", "FAQ" or "FAQs" anywhere, or at least two H2 or H3 headings that end with "?" |
| Meta description | Characters in **Meta description**, ignoring spaces at the ends |
| Readability | Flesch reading ease: 206.835 − 1.015 × (words ÷ sentences) − 84.6 × (syllables ÷ words), limited to 0 to 100 and rounded. Sentences end at `.`, `!` or `?`. Syllables are estimated from vowel groups |
| Read time | Words ÷ 220, rounded, at least 1 minute |

Readability grades: **Easy to read** at 70 or more, **Fairly easy** at 55 to 69, **Standard** at 40 to 54, **Difficult** below 40. Headings and list items without end punctuation run into the next sentence in this count, which lowers the result.

## What each check means for Google and AI engines

These notes explain why each check exists. They are general guidance about how search and answer engines read pages, not a promise of how any engine treats your article.

- **Keyword in title.** Google uses the title as a strong hint about the page's topic and usually shows it as the clickable headline. AI engines that search the web match pages to a question partly by their titles.
- **Keyword in introduction.** An early mention confirms the topic to Google. For AI engines, the opening is the passage most likely to be quoted, which is why the writer puts a direct 2 to 3 sentence answer there. The check only looks for the keyword; it doesn't confirm the answer is there.
- **Keyword density.** Natural repetition keeps the page clearly on topic for Google, while heavy repetition reads as keyword stuffing. AI engines care more about clear wording than counts.
- **In-depth content.** Longer articles tend to cover the follow-up questions a searcher has next. For AI engines, each covered sub-question is another passage that can answer a prompt. Length alone doesn't rank anything.
- **Section structure and Sub-headings.** Headings help Google understand the page's outline and help AI engines find and lift the exact passage that answers a question.
- **Scannable lists.** Lists are easy for readers to scan, can appear in Google's featured snippets, and are easy for AI engines to extract into an answer.
- **FAQ for AI engines.** Question-shaped headings mirror how people search and how they prompt AI assistants.
- **Meta description.** Google often shows it as the snippet under your title, so it mainly affects whether people click. It has little direct effect on AI answers.
- **Internal & external links.** Links to sources make claims easier to verify, and links to your own pages help crawlers find the rest of your site.
- **Readability.** Plain sentences are easier for people to read and survive being summarized by an AI engine with their meaning intact.

## The GEO signals

GEO, or [generative engine optimization](/glossary/generative-engine-optimization), is about being quoted in AI answers. Rankbox shows one combined score. Six of its checks are the ones the Rank page groups as **What AI engines look for**, and the panel shows how many of your published articles pass each one. A signal counts only when its check passes; a warning doesn't count.

| Signal on the Rank page | Check | Why it matters, as the Rank page puts it |
| --- | --- | --- |
| **Answers up front** | Keyword in introduction | "The answer sits in the first 100 words — the part engines quote." |
| **FAQ section** | FAQ for AI engines | "Question-shaped headings match how people prompt AI." |
| **Clear sections** | Section structure | "Headings let engines find and lift the exact passage." |
| **Cites sources** | Internal & external links | "Linked sources make a page safer for an engine to cite." |
| **Depth** | In-depth content | "1,500+ words covers the follow-up questions too." |
| **Easy to read** | Readability | "Plain sentences survive being summarized intact." |

## How to raise the score

Work from the biggest weights down, and use the **Checklist** to see what's failing.

1. **Set a Target keyword.** Without one, the score can't go above 82.
2. **Put the exact keyword in the title.** 15 points.
3. **Reach 1,500 words** with useful detail, not padding. 15 points.
4. **Bring keyword density into 0.5% to 2.5%.** Add mentions if it's low; swap some for synonyms if it's high. 12 points.
5. **Mention the keyword in the first 100 words.** 10 points.
6. **Use at least 3 H2 sections and 2 H3 sub-headings.** 15 points between them.
7. **Add a list with at least 3 items.** 10 points.
8. **Add an FAQ**: a "Frequently Asked Questions" section, or at least two question headings ending in "?". 8 points.
9. **Write a meta description of 120 to 160 characters.** The counter under the field turns red above 160. 8 points.
10. **Link to at least 2 relevant pages or sources.** 7 points.
11. **Shorten long sentences** and end headings and list items with punctuation where it reads naturally. 5 points.

> [!TIP]
> Select a weak passage and use **Improve SEO** in the editor to rewrite it with the keyword used naturally. It uses no article credits. See [Editing articles](/docs/content/editor).

## What the score is not

- **Not a ranking or citation prediction.** A score of 100 doesn't mean an article will rank on Google's first page or be cited by any AI engine. Rankbox makes no ranking, traffic or citation promises.
- **Not a citation tracker.** Rankbox doesn't track whether AI engines cite your articles.
- **Not a comparison with competitors.** The score doesn't look at live search results or other sites.
- **Not a quality or fact check.** It doesn't check facts, the quality of sources, originality, or whether the introduction actually answers the question.
- **Not a technical SEO audit.** It doesn't check schema markup, images or alt text, the URL, page speed, mobile layout or backlinks.
- **Not a check of your live page.** It scores Rankbox's copy. When an article leaves Rankbox, writer notes and link suggestions are removed, and some destinations drop the opening H1 or the video embed, so your live page can differ.

To check a live page, use the free [AI citation readiness checker](/tools/ai-citation-readiness-checker), [heading structure checker](/tools/heading-structure-checker) or [keyword density checker](/tools/keyword-density-checker). They're separate tools with their own rules, so their numbers won't match the editor's score exactly.

## Edge cases

- **Live versus stored score.** The editor and the Articles list calculate the score from the current text, so they always agree. The REST API's `seo_score` is the value stored when the article was last written or saved, which can differ slightly.
- **Notes count.** Image notes and other writer notes count as words until you delete them.
- **Link suggestions.** An internal-link suggestion only counts as a link when it shows as one in the editor. Either way it's removed when the article leaves Rankbox, so your live page can have fewer links than the score counted.
- **Substring matches.** The title and introduction checks match the keyword inside longer words, so "seo" also matches "seoul". Density counts whole words only.
- **Non-English text.** The readability formula and syllable estimate are built for English.

## Related

- [How articles are written](/docs/content/writing): the revision passes that optimize for these checks
- [Editing articles](/docs/content/editor): where you see and improve the score
- [Rank: AI search visibility](/docs/growth/rank): average scores, AI signals and Strengthen moves
- [Free SEO and AI search tools](/docs/growth/free-tools): checks you can run on any live page
- [Articles endpoints](/docs/api/articles): the `seo_score` field in the REST API
