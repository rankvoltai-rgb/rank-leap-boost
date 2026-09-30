---
title: Multimodal GEO: How AI Search "Sees" Infographics, Charts, and Screenshots
description: Multimodal GEO explained: what AI search engines really do with images on your pages, and how to design charts that people, OCR and AI can read.
keyword: multimodal GEO
date: 2026-10-26
updated: 2026-10-26
written: 2026-09-30
author: Rankbox Team
tags: AI Search, Technical SEO
---

AI search "sees" your infographics, charts and screenshots in two very different ways. When a person uploads a photo or a screenshot, a vision model reads the pixels, and every major vendor documents that. When an AI search engine builds an answer from your page, the vendors document text: alt text, captions, the copy around the image and the HTML. Multimodal GEO means designing for both at once, so the chart reads cleanly as a picture and its facts also exist as words a crawler can quote.

That split matters because visual search is no longer a side door. Google's US data shows [more than one AI Mode search in six](https://storage.googleapis.com/gweb-uniblog-publish-prod/documents/AI-Mode-US-Insights.pdf) is multimodal, meaning not typed text. Think with Google, the company's marketing publication, puts Google Lens at [more than 25 billion queries a month](https://business.google.com/ca-en/think/search-and-video/search-trends-marketing-takeaways/), based on internal data from April 2025. And on 24 September 2026, Search Console added [a multimodal search type](https://developers.google.com/search/blog/2026/09/web-multimodal-in-sc) for searches made with Lens, Circle to Search, uploaded images and Chrome's "Search this image."

The content plan behind this post claimed that "vision crawlers read infographics without alt tags." As of September 2026, no vendor documents that. This multimodal GEO guide separates what's documented from what's guessed, shows how vision models shrink and misread charts, and gives you a design checklist tested on a fictional chart with a free OCR engine. For the step-by-step work on images, video and audio, see our [multimodal SEO guide](/blog/multimodal-seo). For the searcher's side, read [what multimodal search is](/blog/what-is-multimodal-search).

## Key Takeaways

- Multimodal GEO starts with one split. Vision is documented on the user's side. OpenAI, Anthropic, Google and Perplexity all document models that read images people upload, and Lens, Circle to Search and AI Mode run searches on photos and screenshots.
- On the crawl side, vendors document text. Google says it uses alt text, computer vision and page content to understand what an image shows, but no vendor says it pulls a chart's numbers into an AI answer.
- Bing's guidelines say images "should not be the sole source of information," and Microsoft's ads team says reading text from images "adds extra complexity and often reduces accuracy."
- In OtterlyAI's April 2026 test, no AI platform returned a fact that existed only as text inside an image. A visible caption failed too, so the test is weak evidence either way.
- Vision models shrink large images before reading them and misread small, rotated or faint text. The fine print on a tall infographic may not survive.
- The Two-Layer Chart, our multimodal GEO checklist, puts every data point in two places: a chart built to stay legible, and an HTML table with alt text and a caption that say the same thing.
- In a small OCR check of a fictional Tallyfold chart, the redesign kept all four values readable at 512 pixels wide. The original design exposed no values as text at any size.

## Two Ways AI Search Can "See" an Image

Most multimodal GEO advice treats "AI can read images" as one fact. It's really three situations, and each one is documented differently.

### When a person shows the AI an image

This is where vision is plainly real. Google says Lens has long identified objects [by matching them against a database of images indexed from the web](https://blog.google/products-and-platforms/devices/google-lens/lens-on-ios-ai-overviews/), and now adds AI Overviews for unusual images. In AI Mode, Google says Gemini [understands the whole scene](https://blog.google/products/search/ai-mode-multimodal-search/) while Lens identifies each object, then [query fan-out](/glossary/query-fan-out) runs several searches about the image. A Google engineering director put it simply in March 2026: the model is the ["brain" that can "see" the image](https://blog.google/company-news/inside-google/googlers/how-google-ai-visual-search-works/), and the visual search backend is the "library" of web results.

The same is true outside Google. OpenAI says [all ChatGPT models accept image inputs](https://help.openai.com/en/articles/8400551-chatgpt-image-inputs-faq) on free and paid plans. Anthropic and Google document image input for Claude and Gemini in their APIs.

Your chart enters this path more often than you'd think. A buyer screenshots your pricing graphic and asks ChatGPT to compare it with a rival's. Or they use Chrome's Lens on your page, which sends Google [a screenshot of the page and page data](https://support.google.com/chrome/answer/15086890?hl=en&co=GENIE.Platform%3DDesktop). Here the pixels are all the model gets, so the chart's design decides what the model learns.

### When an AI search engine reads your page

Here the documentation turns to text. Google says its AI features rely on [retrieval from its Search index](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), after which its systems "review the specific information from those retrieved pages." On images, Google's [image SEO guide](https://developers.google.com/search/docs/appearance/google-images) says it "uses alt text along with computer vision algorithms and the contents of the page to understand the subject matter of the image." That describes knowing what a picture is about, for image results. It doesn't say Google reads the numbers off your chart and puts them in an AI Overview.

Anthropic is explicit about its own fetcher. Claude's [web fetch tool](https://docs.claude.com/en/docs/agents-and-tools/tool-use/web-fetch-tool) "retrieves the full text content" of a URL and supports only text, HTML and PDF. [AI crawlers](/glossary/ai-crawlers) do download image files: in Vercel's December 2024 study, images were [35.17% of Claude's crawler fetches](https://vercel.com/blog/the-rise-of-the-ai-crawler) on nextjs.org. What happens to those files isn't documented. Vercel's authors suggested the files feed training, but that's their inference. For multimodal GEO, the lesson on this path is simple: the text carries the facts. Our [AI crawler directory](/blog/ai-crawler-directory) lists what each bot is for.

### When an agent browses your page

Browser agents are the third case, and they do use screenshots. OpenAI's help page for ChatGPT agent, which OpenAI has since retired in favor of a cloud browser in ChatGPT Work, describes it using [screenshots of its virtual browser window](https://help.openai.com/en/articles/11752874-chatgpt-agent) to "see" and interact with pages. Google's web.dev team says agents read sites through [screenshots, raw HTML and the accessibility tree](https://web.dev/articles/ai-agent-site-ux), and that screenshot analysis is slow and costly, "better as a backup." So an agent comparing specs for a user may read your chart visually, but it will lean on your HTML first. Multimodal GEO has to serve both.

## What Each Vendor Documents About Images, September 2026

This table records what each vendor states on its own pages, checked on 30 September 2026. "Not stated" means the pages listed in the references say nothing on the point.

| Vendor     | Reads images people upload              | Shows images in answers                                           | What it tells site owners about images                                   |
| ---------- | --------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Google     | Yes: Lens, Circle to Search, AI Mode    | Yes: AI features "can bring in relevant images and video"         | Follow image SEO basics; alt text plus computer vision plus page content |
| OpenAI     | Yes: every ChatGPT model                | Yes: "select an image to view its source"                         | Allow OAI-SearchBot; nothing image-specific                              |
| Anthropic  | Yes: Claude apps and API                | Not stated                                                        | Web fetch reads text, HTML and PDF only                                  |
| Perplexity | Yes: image attachments in its API       | Its API began adding images or videos to some answers in Dec 2025 | Not stated                                                               |
| Microsoft  | Yes: Bing Visual Search, Copilot Vision | Not stated                                                        | Images "should reinforce the primary text on the page"                   |

Microsoft gives the most direct multimodal GEO advice of any vendor. Its [Bing webmaster guidelines](https://www.bing.com/webmasters/help/webmasters-guidelines-30fba23a), which cover Bing, Copilot and grounding results, say images and video "should not be the sole source of information required to understand the topic." They ask for descriptive file names, alt text, and "captions, transcripts, or structured data." Microsoft's ads team is blunter: [key information should not live only in images](https://about.ads.microsoft.com/en/blog/post/october-2025/optimizing-your-content-for-inclusion-in-ai-search-answers), because reading text from images "adds extra complexity and often reduces accuracy."

One correction to the plan's model names. It cited GPT-4o, Claude 3.5 Sonnet and Gemini 1.5. As of September 2026, OpenAI's vision guide uses [gpt-6-astra](https://platform.openai.com/docs/guides/images-vision) in its examples, Anthropic's [vision docs](https://docs.claude.com/en/docs/build-with-claude/vision) describe a higher-resolution tier for "Claude 4.7 and later models," and Google made [Gemini 3.5 Flash](https://blog.google/products-and-platforms/products/search/search-io-2026/) the default in AI Mode at I/O in May 2026. Model names change fast. What matters here is that none of these vendors ties image reading to how its crawler treats your page.

## Grading the Claim That Vision Crawlers Read Your Infographics

The plan's version of multimodal GEO made a strong claim, so here it is graded by the kind of evidence behind each part. Three labels: vendor-documented, independent study, or unverified.

| Claim                                              | Evidence type           | What the evidence shows                                                                            |
| -------------------------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------- |
| Frontier models are multimodal                     | Vendor-documented       | True for images people send them                                                                   |
| AI crawlers download images                        | Independent study       | Vercel, Dec 2024: 35.17% of Claude's crawler fetches on nextjs.org were images; use not documented |
| Vision crawlers read infographics without alt text | Unverified              | No vendor documents it; Google pairs computer vision with alt text and page content                |
| AI answers quote numbers printed inside images     | Independent test, weak  | OtterlyAI, Apr 2026: 0 of 5 platforms returned a fact baked into an image                          |
| Vision models read charts accurately               | Independent benchmarks  | 2024–2025 benchmarks found large gaps between models and humans                                    |
| Alt text no longer matters                         | Contradicted by vendors | Google calls alt text the most important image attribute; Bing and Microsoft ask for it            |

### The one public test of text inside images

The only public test of this that we could locate comes from OtterlyAI, a company that sells AI search tracking. It published the results on [21 April 2026](https://otterly.ai/blog/geo-experiment-image-metadata/). It hid a made-up fact in six page variants on one domain: in the file name, the alt text, a visible caption, text baked into the image, nowhere, and file name plus alt text. It asked ChatGPT, Google AI Mode, Perplexity, Gemini and Copilot about the fact over one week, 120 runs in all.

Only 3 of 120 runs were correct, all from ChatGPT on the file name plus alt text variant. The image-text variant got zero correct answers on every platform. But read the caveats. The visible caption also scored zero, the control page drew made-up answers, and Perplexity couldn't reach any test page. So the engines may simply not have used these pages much. The test shows the image-only route didn't work there. It can't prove engines never read images.

### How well models read charts

Chart benchmarks point the same way. CharXiv tested 2,323 charts from research papers in June 2024. The best model then, GPT-4o, scored [47.1% on reasoning questions against 80.5% for humans](https://arxiv.org/abs/2406.18521). ChartMuseum, revised in February 2026, found humans at 93% and the best model it tested, Gemini-2.5-Pro, at [63.0%](https://arxiv.org/abs/2505.13444). On questions that need mostly visual reasoning, every model dropped 35% to 55%. Today's models are likely better. But reading an exact value off a bar is still the hard part. The multimodal GEO answer is to print the value.

## How Vision Models Shrink and Misread a Chart

Even when a model does look at your image, it rarely sees it at full size. The vendors spell this out.

### Your image is resized before the model reads it

- **OpenAI:** its "low" detail setting fits an image within [512 by 512 pixels](https://platform.openai.com/docs/guides/images-vision), and the guide warns that "images may be resized before analysis."
- **Anthropic:** most Claude models cap the long edge at [1,568 pixels](https://docs.claude.com/en/docs/build-with-claude/vision), and Claude 4.7 and later at 2,576. Anthropic notes resizing "might, for example, make text less legible."
- **Google:** the Gemini API cuts larger images into [768 by 768 pixel tiles](https://ai.google.dev/gemini-api/docs/image-understanding), and says higher resolution settings "improve the model's ability to read fine text."

Here's what that does to a tall infographic. Take one that's 1,200 pixels wide and 3,000 tall, with 12-pixel labels. Fit it to a 1,568-pixel long edge and the scale is 1,568 ÷ 3,000 = 0.52, so the labels shrink to about 6 pixels. Fit it to OpenAI's 512-pixel box and the scale is 512 ÷ 3,000 = 0.17, leaving labels about 2 pixels tall. No model reads 2-pixel text. This is the math most multimodal GEO advice skips.

### What vendors say their models misread

OpenAI's [image inputs FAQ](https://help.openai.com/en/articles/8400551-chatgpt-image-inputs-faq) lists the weak spots plainly. Models struggle with small text, rotated or upside-down text, and "graphs or text where colors or styles like solid, dashed, or dotted lines vary." They do worse with non-Latin scripts, and give only rough counts. Anthropic adds that Claude may make mistakes with "low-quality, rotated, or very small images under 200 pixels," and that heavy JPEG compression "can make text difficult to read."

One line in OpenAI's list matters more than the rest for multimodal GEO. The model "doesn't process original file names or metadata." When someone screenshots your chart into a chat, your alt text and file name stay behind. The pixels have to carry the message alone.

## The Two-Layer Chart: A Multimodal GEO Checklist

The fix at the heart of multimodal GEO is to stop asking one image to do two jobs. We call it the **Two-Layer Chart**. The image layer is built for anything that reads pixels: Lens, uploads, screenshots and agents. The text layer is built for crawlers and retrieval, which vendors say run on words. Every fact in the chart appears in both.

| #   | Layer | Check                                                                     | Why it matters                                                                                                                          |
| --- | ----- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Image | The title states the finding, with the number                             | A screenshot lifted out of context still carries its claim                                                                              |
| 2   | Image | Every value is printed on the chart, with its unit                        | OCR reads only printed text; visual estimates are where models lose most accuracy                                                       |
| 3   | Image | The smallest text is at least 2% of the image's long edge                 | 24-pixel labels on a 1,200-pixel chart survived shrinking to 512 pixels in the test below                                               |
| 4   | Image | All text is horizontal, with no rotated axis labels                       | OpenAI, Anthropic and Google all flag rotated text                                                                                      |
| 5   | Image | Text meets WCAG's 4.5:1 contrast ratio                                    | The [accessibility standard](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) for text also applies to images of text |
| 6   | Image | Series are labelled directly, not told apart by color or dash style alone | OpenAI names varied colors and line styles as a weak spot                                                                               |
| 7   | Image | Tall infographics are split into several images                           | Each image survives resizing with readable text                                                                                         |
| 8   | Image | Saved as PNG or SVG, not heavily compressed JPEG                          | Compression artifacts blur small text                                                                                                   |
| 9   | Text  | An HTML table with the same numbers sits right below the chart            | Bing and Microsoft ask for critical details in HTML                                                                                     |
| 10  | Text  | Alt text states the main finding in one sentence                          | Google calls alt text the most important image attribute                                                                                |
| 11  | Text  | A caption gives the measure, the source and the date                      | Google reads captions; a date shows how fresh the number is                                                                             |
| 12  | Text  | The paragraph next to the chart states the takeaway in words              | Google says to place images "near relevant text"                                                                                        |

Check 3 is Rankbox's rule of thumb from the small test below, not a vendor rule. The others trace to the sources linked in this post.

Scoring is simple. A chart that passes all 12 checks is ready to publish. A chart that fails check 2 or check 9 isn't ready, because then its numbers exist in only one layer. W3C's accessibility tutorial makes the same point for people using screen readers: a chart needs a [long description with its "scales, values, relationships and trends,"](https://www.w3.org/WAI/tutorials/images/complex/) and long descriptions "are available to everyone, including search engines and other programs."

## Tallyfold Before and After: One Chart Through an OCR Engine

Tallyfold is a fictional invoicing app for agencies. Its marketing team wants one chart that proves reminders speed up payment. Here's the multimodal GEO fix applied to it. All numbers below are made up for the example.

| Reminder setup                  | Average days to payment |
| ------------------------------- | ----------------------- |
| No reminders                    | 38                      |
| Manual email reminders          | 31                      |
| Automatic reminders             | 24                      |
| Automatic reminders + card link | 17                      |

The drop from 38 to 17 days is 21 days, a cut of 21 ÷ 38 = 55%.

### The two designs

![Two versions of the same fictional Tallyfold bar chart side by side: a pastel vertical chart with faint rotated labels and no values, and a white horizontal chart with bold labels and a value printed at the end of each bar](figure:two-layer-chart "The same fictional Tallyfold data in two designs. Only the redesign prints its values, so only the redesign exposes them as text.")

**Before** is a typical marketing chart. Pastel bars sit on a pale lavender gradient. The labels are thin, 11 to 13 pixels, in light grey, at a contrast ratio of 1.4:1 to 1.9:1. The category names are rotated 30 degrees. No value is printed, so you read each bar against gridlines. The title, "How smarter reminders speed up payments," states no number.

**After** follows the Two-Layer Chart. Horizontal bars sit on white. The labels are 24-pixel bold near-black text, at 18.9:1 contrast. Each bar ends with its value and unit, such as "38 days." The title states the finding: "Automatic reminders plus a card link cut payment time to 17 days." A source line gives the date.

### How the check was run

Rankbox rendered both charts at 1,200 by 675 pixels in headless Chrome. It shrank copies to 800 and 512 pixels wide with macOS's built-in image tool; 512 matches OpenAI's "low" detail box. Then, on 30 September 2026, it ran each image through Apple's Vision text recognizer, the free OCR engine built into macOS, in its "accurate" mode with English selected. A text item counted only if the OCR output matched it exactly.

| Image            | Category labels read exactly | Values read as text |
| ---------------- | ---------------------------- | ------------------- |
| Before, 1,200 px | 4 of 4                       | 0 of 4              |
| Before, 800 px   | 0 of 4                       | 0 of 4              |
| Before, 512 px   | 0 of 4                       | 0 of 4              |
| After, 1,200 px  | 4 of 4                       | 4 of 4              |
| After, 800 px    | 4 of 4                       | 4 of 4              |
| After, 512 px    | 4 of 4                       | 4 of 4              |

At 800 pixels, the OCR found only one of the before chart's four category names, misspelled as "Manual email rominders," and read the subtitle as "Talyfold agency benchmark." At 512, it found none, and the subtitle became "Taylold agincy benchenar." Across all three sizes, the after chart missed just one item: at 512 pixels, a comma in the source line came back as a period. In the engine's faster mode, the after chart held up at full size but fell apart at 512 pixels ("38th," "31 dby"), which is a reminder that small images punish every reader.

### What the check shows, and what it doesn't

It shows that, for multimodal GEO, design decides whether a chart's facts survive as text. The before chart never exposed its values, because they were never printed. Reading them means estimating bar heights, the visual task where ChartMuseum found the biggest model drops.

It doesn't show how any AI search engine treats this chart. OCR isn't a vision-language model, and this was one chart pair and one engine. That's why the after version also ships a text layer.

### The text layer Tallyfold publishes with the chart

- **Alt text:** "Bar chart: average days to payment fall from 38 with no reminders to 17 with automatic reminders plus a card link."
- **Caption:** "Average days from invoice to payment, by reminder setup. Fictional Tallyfold example data, September 2026."
- **Table:** the four-row table above, as HTML, directly under the chart.
- **Lead sentence:** "Automatic reminders plus a card link cut Tallyfold customers' average payment time from 38 to 17 days, a 55% drop."

## Google's Image Guidance as a Multimodal GEO Baseline

Google's image advice was last updated in March 2026. Here's each point as it applies to a chart. Our [multimodal SEO guide](/blog/multimodal-seo) turns these into a routine for images, video and audio.

| Google's guidance        | What Google says                                                                                        | For a chart                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Use HTML image elements  | Google finds images in `<img src>` and "doesn't index CSS images"                                       | Never place a chart as a CSS background                        |
| Alt text                 | Used "along with computer vision algorithms and the contents of the page"                               | Write the finding, not "chart" or a keyword list               |
| File names               | Give "very light clues"                                                                                 | Use `days-to-payment-by-reminder.png`, not `chart-final-2.png` |
| Captions and nearby text | Google extracts subject matter "from the content of the page, including captions"                       | Caption every chart; keep it next to its paragraph             |
| Image sitemaps           | Help Google find images it might miss                                                                   | Useful when charts load late or sit on a CDN                   |
| Preferred image          | Set via `primaryImageOfPage` or `og:image`; avoid images with text there                                | Don't use a text-heavy chart as the page's social image        |
| Structured data          | The `image` property is required for image badges in rich results; license metadata adds credit details | Add license data only if people reuse your charts              |
| Formats                  | BMP, GIF, JPEG, PNG, WebP, SVG and AVIF                                                                 | PNG or SVG keeps text sharp                                    |

Google's [guide to generative AI search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), updated in July 2026, adds one line worth quoting for its own features: if you already follow its image and video best practices, "you're already optimizing for generative AI search." No special markup is needed.

## How to Track Multimodal GEO Results

Multimodal GEO results show up in two places. Start in Search Console. Since 24 September 2026, the Performance report has a [multimodal search type](https://support.google.com/webmasters/answer/7576553?hl=en). It counts traffic when people search with Lens, Circle to Search on Android, uploaded images and Chrome image search. The [generative AI performance report](https://support.google.com/webmasters/answer/16984139?hl=en) has the same filter for AI Overviews and AI Mode, though it shows impressions only. Compare the pages that appear there with the pages that hold your charts.

Then run two manual checks each quarter:

1. **The screenshot test.** Paste each key chart into ChatGPT, Gemini and Claude, and ask what it shows. If a model misreads a value, the image layer needs work.
2. **The answer test.** Ask AI Mode and ChatGPT the question your chart answers. Note whether they cite your page and quote the number from your table.

Repeat each prompt several times, because AI answers vary from run to run. Our guide to [measuring GEO](/blog/how-to-measure-geo) covers prompt panels, sample sizes and a control test.

## How Rankbox Helps With the Text Layer of Multimodal GEO

The text layer is writing work, and that's the part Rankbox does. Its [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes 2,000 to 3,500-word source-backed articles: the words your charts sit beside. Articles reach your site through Rankbox's API. Rankbox doesn't design charts, run OCR or track AI citations. The Business plan is $49.50 a month with a 7-day trial ([pricing](/pricing)).

To check that a page returns real HTML text before you worry about images, run the free [AI search readiness check](/tools/ai-search-readiness-check). For the passage-level side of writing, see how to [optimize content for LLMs](/blog/optimize-content-for-llms-writing-for-machines).

## Frequently Asked Questions

### Can AI search engines read text inside images?

Vision models can read text in images people upload. For images on crawled pages, no major vendor documents pulling that text into AI answers as of September 2026. In OtterlyAI's April 2026 test, no platform returned a fact that existed only inside an image. Put any fact that matters in HTML text as well; that's the core rule of multimodal GEO.

### Does alt text still matter for multimodal GEO?

Yes. Google calls alt text the most important attribute for describing an image and says it combines alt text with computer vision and page content. Bing's guidelines list alt text too. Write it as the chart's main finding in one sentence, not a keyword list.

### Should chart data go in an HTML table for multimodal GEO?

Yes. An HTML table is text that crawlers and retrieval systems read directly, and Microsoft advises presenting critical details in HTML rather than only in images. Place the table right below the chart, with the same numbers, units and date.

### What image size keeps chart text readable for AI models?

Keep the smallest text at about 2% of the image's long edge, so 24 pixels on a 1,200-pixel chart. Vendors shrink images before analysis: OpenAI's low detail fits 512 pixels, and most Claude models cap the long edge at 1,568. Split tall infographics into smaller images, one of the simplest multimodal GEO fixes.

### Does Google use computer vision on website images?

Yes. Google's image guide says it uses alt text "along with computer vision algorithms and the contents of the page to understand the subject matter of the image." That helps images appear in Google Images, Discover and text results. Google doesn't document reading chart values into AI Overviews.

### How do I see multimodal search traffic in Search Console?

Open the Performance report and set the search type to "Web: multimodal." It covers searches made with Lens, Circle to Search, uploaded images and Chrome image search, and rolled out globally from 24 September 2026. The generative AI performance report has the same filter.

## References

1. [Google image SEO best practices, Google Search Central](https://developers.google.com/search/docs/appearance/google-images)
2. [Optimizing your website for generative AI features on Google Search, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
3. [Announcing web multimodal Search performance reporting in Search Console, Google Search Central Blog](https://developers.google.com/search/blog/2026/09/web-multimodal-in-sc)
4. [Generative AI performance report (Search), Search Console Help](https://support.google.com/webmasters/answer/16984139?hl=en)
5. [Bringing multimodal search to AI Mode, Google](https://blog.google/products/search/ai-mode-multimodal-search/)
6. [How does AI understand my visual searches?, Google](https://blog.google/company-news/inside-google/googlers/how-google-ai-visual-search-works/)
7. [Webmaster Guidelines, Bing Webmaster Tools](https://www.bing.com/webmasters/help/webmasters-guidelines-30fba23a)
8. [Optimizing Your Content for Inclusion in AI Search Answers, Microsoft Advertising](https://about.ads.microsoft.com/en/blog/post/october-2025/optimizing-your-content-for-inclusion-in-ai-search-answers)
9. [Images and vision, OpenAI API docs](https://platform.openai.com/docs/guides/images-vision)
10. [ChatGPT Image Inputs FAQ, OpenAI Help Center](https://help.openai.com/en/articles/8400551-chatgpt-image-inputs-faq)
11. [ChatGPT agent, OpenAI Help Center](https://help.openai.com/en/articles/11752874-chatgpt-agent)
12. [Vision, Claude Docs](https://docs.claude.com/en/docs/build-with-claude/vision)
13. [Web fetch tool, Claude Docs](https://docs.claude.com/en/docs/agents-and-tools/tool-use/web-fetch-tool)
14. [Image understanding, Gemini API docs](https://ai.google.dev/gemini-api/docs/image-understanding)
15. [Build agent-friendly websites, web.dev](https://web.dev/articles/ai-agent-site-ux)
16. [The rise of the AI crawler, Vercel](https://vercel.com/blog/the-rise-of-the-ai-crawler)
17. [GEO Experiment: Your Image Alt Text is Built for SEO. AI Search Reads Right Past It, OtterlyAI](https://otterly.ai/blog/geo-experiment-image-metadata/)
18. [CharXiv: Charting Gaps in Realistic Chart Understanding in Multimodal LLMs, arXiv](https://arxiv.org/abs/2406.18521)
19. [ChartMuseum: Testing Visual Reasoning Capabilities of Large Vision-Language Models, arXiv](https://arxiv.org/abs/2505.13444)
20. [Complex Images, W3C Web Accessibility Initiative](https://www.w3.org/WAI/tutorials/images/complex/)
