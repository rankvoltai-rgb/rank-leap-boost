---
title: How articles are written
nav_title: Writing
description: The Rankbox article pipeline stage by stage: live research, drafting, revision passes, sources, video, writer notes, length, credits and failures.
order: 3
updated: 2026-10-02
---

Every Rankbox article, whether you click **Write now** or autopilot picks it from the queue, goes through the same pipeline: check the plan, research the live web for the keyword, draft the article in your brand voice, revise it against the SEO checks, add a video, and save it as published. This page explains each stage, what the finished article contains, and what happens when something fails.

## Ways to start writing

| Where | Control | Notes |
| --- | --- | --- |
| **Articles** list | Bolt icon on a row (**Write now**) | Shown on ideas and scheduled articles that have no text yet |
| Article panel | **Write now** | Shown on articles that have no text yet |
| **Overview → Autopilot queue** | **Generate now** | Also on the Overview's **Write your first article** card |
| Autopilot | None: it runs on its own | See [Autopilot and the publishing schedule](/docs/content/autopilot) |

Writing needs three things: a free trial or paid plan, an active site, and at least one article credit left on that site. The writer works from three fields of the article: the title, the **Target keyword** and the brief in **Meta description**. Edit those first to steer the result. If **Target keyword** is empty, the title is used as the keyword.

## The pipeline, stage by stage

| # | Stage | What happens |
| --- | --- | --- |
| 1 | Checks | Rankbox confirms the plan allows writing, the site is active and the article belongs to that site. AI requests are rate limited per account |
| 2 | Credit | One article credit is reserved from the site's balance |
| 3 | Brand brief | Your settings from **Settings → Your brand** and **How autopilot writes** are loaded. See [Brand voice and writing settings](/docs/content/brand-voice) |
| 4 | Exchange link | If the site takes part in the [backlink exchange](/docs/growth/backlink-exchange), up to two links to other members' pages may be reserved for this article |
| 5 | Research | A live web search for the keyword collects the top-ranking pages, their headings and the sources the article may cite |
| 6 | Video search | A search for a relevant YouTube video runs at the same time as the writing |
| 7 | Draft | One language model call writes the full article against Rankbox's article blueprint |
| 8 | Revision | The draft is scored and rewritten to fix only the checks it fails |
| 9 | Video | The video, if one was found, is placed under the opening section |
| 10 | Links | Any exchange link is checked and repaired if a revision dropped it |
| 11 | Save | The article is scored one last time and saved as **Published** |
| 12 | Delivery | A connected Webflow or Shopify site receives it right away. Sites on the REST API pick it up on their next sync |

### Research

Rankbox searches the live web for the article's keyword and reads the top 10 results. From the top 5 pages it collects the headings competitors use (up to 40), a short summary of each page, and their links. The writer is told to cover those subtopics, find the gaps they miss, and cite only those 5 pages. Because the sources are the pages that currently rank for your keyword, they can include competitors.

If research is unavailable for a run (the search fails or takes longer than 45 seconds), writing still goes ahead. The writer is then told to cite 3 to 5 well-known, authoritative sources it is confident exist.

> [!TIP]
> Check the **References** section of any article before you publish it, especially one written without live research. Make sure every link opens and says what the article claims.

### Draft

One model call receives your brand brief, the blueprint below, the research and any exchange-link instruction. It returns the title, the body in Markdown, a meta description, tags, and its own traffic estimate. If the reply isn't in the expected format, the text is kept as the body and the original title is used, so check the meta description of that article.

### Revision passes

The draft is scored with the same checks as the editor's [SEO and GEO score](/docs/content/scoring). If it scores below 100, the model rewrites it with a list of only the failing checks, told to keep everything that works: depth, structure, citations and meaning. The loop stops as soon as the article scores 100, when a pass doesn't raise the score, when a reply can't be read (the last readable version is kept), or when the pass limit is reached. The stored score is recalculated after the video and links are added, so a finished article can score just under 100.

## What the writer is asked to produce

The blueprint is the same for every article. It's written so the result reads well and gives search and answer engines clear passages to quote.

| Part | What the blueprint asks for |
| --- | --- |
| Title (H1) | Under 60 characters, contains the keyword |
| Introduction | 150 to 200 words that open with a direct, quotable answer of 2 to 3 sentences and use the keyword |
| Structure | At least 15 headings: one H1, then H2, H3 and H4 where useful, in a logical order |
| Sections | 300 to 500 words per H2, with concrete examples or data and at least one insight competitors miss |
| Key Takeaways | A "Key Takeaways" (or "Quick Takeaways") section of 5 to 7 bullets |
| Lists | At least two bulleted or numbered lists, plus a comparison or step-by-step section where it fits |
| Image notes | 2 to 3 image or infographic ideas, written as notes |
| Conclusion | 200 to 250 words that end with a call to action |
| FAQ | A "Frequently Asked Questions" section with exactly 5 questions, each an H3 ending in "?", answered in 2 to 4 sentences |
| Engagement | One closing line that invites feedback and ends with a question |
| Citations | Inline citations to the sources and a final "References" section of links |
| Keywords | The keyword at 1 to 2% density, plus 10 to 15 related long-tail terms |
| Style | Short paragraphs of 2 to 4 sentences, bold key phrases, clean Markdown |
| Meta description | 120 to 160 characters, includes the keyword |

Rankbox stores the title up to 70 characters, the meta description up to 160 characters and up to 4 tags.

## Length

The writer targets 2,750 words for every article written from the dashboard or by autopilot, and you can't change the target. Real length varies with the topic and the revisions. The score's depth check passes at 1,500 words.

## Image notes

The writer doesn't create images. It marks where 2 to 3 images would help with a note in this exact format:

```text
**[Image: Bar chart comparing setup time across five tools] (alt: "setup time comparison chart")**
```

In the editor, a note shows as bold text. When the article leaves Rankbox, through the REST API, Webflow or Shopify, every note is removed, so no placeholder text reaches your live page. Add your own images in your CMS.

## Internal links

The writer suggests internal links where they'd help, in this format:

```text
[pricing guide](#internal: pricing page)
```

These are suggestions, not links: Rankbox doesn't know your site's URLs. When the article leaves Rankbox, each suggestion is replaced by its anchor text alone. In the editor, a suggestion usually shows as plain text in brackets. To turn it into a real link, select the words and use the **Link** button. See [Editing articles](/docs/content/editor).

> [!WARNING]
> If you edit and save an article in the editor, delete any remaining image notes and link suggestions by hand before you publish. Saving stores them as plain text, and the automatic clean-up can then leave stray characters such as `**\` or backslashes on your live page.

## The YouTube video

Rankbox searches YouTube for the article's keyword and embeds the first suitable video. Titles that read like promotions (for example "lifetime deal", "coupon", "promo code", "giveaway", "sponsored" or "affiliate") are skipped. Each article gets at most one video, and an article without a suitable match simply has none.

The video goes in its own section, placed before the article's second H2 so the opening answer stays first. An article with fewer than two H2 sections gets the video at the end. The block looks like this:

```text
## Watch: <video title>

<iframe src="https://www.youtube.com/embed/<id>" ...></iframe>

[<video title>](https://www.youtube.com/watch?v=<id>) — <channel>
```

The plain link under the embed keeps the reference on sites that strip embedded frames. Some destinations remove the embed; see [How publishing works](/docs/publishing/overview).

## The language model

Rankbox writes with large language models, called from Rankbox's servers. The same model also runs research and the editor's AI actions. The model can change as better ones become available; the blueprint, the research and the checks stay the same.

## What you see while an article is written

1. The article's status changes to **Writing**. The panel shows **Writing…** and a placeholder, and the queue counts it under **Writing**.
2. When it finishes, the panel shows the article and you see "Written and published." (or the article's title "is written and published." with **Open**). From the Overview, you see the title followed by "is ready." and the article opens.
3. **Est. traffic** is replaced by the writer's own estimate for the finished article.

You can close the panel or move to another dashboard page while an article is written. Keep the Rankbox tab open until it finishes: when you start writing from the dashboard, your browser saves the finished article. Autopilot runs on Rankbox's servers and doesn't need a browser.

## Credits

| Action | Article credits |
| --- | --- |
| Write now, Generate now, or autopilot writing an article | 1 |
| Writing that fails | 0 (the credit is returned) |
| Writing an article yourself with **Start writing** and publishing it | 0 |
| Editor AI actions (**Improve SEO**, **Rewrite**, **Expand**, **Shorten**) | 0 |
| Research, planning, scheduling, scoring | 0 |

Balances, resets and the trial allowance are covered in [Plans and credits](/docs/account/plans-and-credits).

## When writing fails

If any stage fails, Rankbox returns the reserved credit, releases any exchange-link reservation, and puts the article back in the status it had. Nothing half-written is saved.

| Message | Cause | What to do |
| --- | --- | --- |
| "Start your free trial to generate articles." | No trial or paid plan | Start the [free trial](/docs/account/free-trial) |
| "We couldn't verify your card. Update it in billing to start generating." | The trial's card check failed | Update the card in **Plan & Billing** |
| "This site isn't active on your plan. Restore it from Studio to use it." | A Studio site was removed or archived | Restore it in [Studio](/docs/account/studio) |
| "You've used all 30 articles this month" (dialog) or "This site has used all its articles for this billing period." | No credits left | Wait for the period to renew |
| "You're making AI requests too quickly. Wait a minute and try again." | More than 12 AI requests in a minute (the default) | Wait a minute |
| "That article isn't on this site." | The article belongs to another site on the account | Switch to that site |
| Any other error, such as "Couldn't write this article." | A research, model or network failure | Try again |

When autopilot fails to write an article, the article goes back to **Scheduled**, the credit is returned, and autopilot tries again on a later run.

## Limits and edge cases

- **Write now never overwrites text.** It's offered only on articles with no text. Autopilot does replace the text of a scheduled article you started yourself; the editor warns you before that happens.
- **Closing the tab mid-write.** If you close or reload the tab before a dashboard write finishes, the article can stay in **Writing**. Contact [support](/docs/help/support) to reset it.
- **Facts and sources.** The writer is instructed to use real sources, but Rankbox doesn't fact-check the article. Review claims, numbers and quotes before publishing.
- **Images.** No images or featured image are generated or sent.
- **Language.** The blueprint is written in English, and the readability check uses an English formula.

## Related

- [Research: the questions buyers ask AI](/docs/content/research): where titles, keywords and briefs come from
- [Editing articles](/docs/content/editor): change, rewrite and publish what the writer produced
- [The SEO and GEO score](/docs/content/scoring): the checks the revision passes optimize for
- [Brand voice and writing settings](/docs/content/brand-voice): the brief the writer reads first
- [Autopilot and the publishing schedule](/docs/content/autopilot): writing on a schedule
- [How publishing works](/docs/publishing/overview): what happens to an article after it's written
