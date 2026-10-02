---
title: Multimodal SEO: How to Optimize Images, Video and Audio for AI Search
description: A practical multimodal SEO guide: Google's image and video rules, transcripts for audio, and a media audit that puts every visual fact in text.
keyword: multimodal SEO
date: 2026-10-22
updated: 2026-10-22
written: 2026-09-30
author: Rankbox Team
tags: AI Search, Technical SEO
---

Multimodal SEO is the work of making your images, videos and audio easy for search engines and AI search to find, understand and show. In practice, it means following Google's image and video guidelines, giving every recording a transcript, and making sure any fact shown in a visual also appears as text on the page.

That last part is the easiest to miss. Google says its AI features ["can bring in relevant images and video"](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), and that if you follow its image and video best practices, you're already optimizing for them. Bing's [webmaster guidelines](https://www.bing.com/webmasters/help/webmasters-guidelines-30fba23a) go a step further: images and video should support the page's text, not replace it, backed by file names, alt text, captions, transcripts or structured data.

This is the how-to, format by format, as of September 2026. For the evidence on whether AI search reads the pixels in your charts, and a before-and-after chart test, see our guide to [multimodal GEO and how AI search "sees" images](/blog/multimodal-geo).

## Key Takeaways

- Multimodal SEO rests on text. Search engines find and understand media through HTML elements, alt text, captions, transcripts, structured data and the copy around each file.
- Google's image rules as of September 2026: use `<img>` elements, write descriptive alt text and file names, place images near related text, and use image sitemaps for files Google might miss.
- Video needs its own watch page, a valid thumbnail, VideoObject markup and fetchable video files to qualify for video features such as key moments.
- Audio has no search-specific markup in Google's docs, so a transcript on the page is how its content becomes searchable text.
- The Media Parity Audit checks one thing per file: does the fact this image, video or clip carries also exist as text on the page?

## Images: Google's Rules as of September 2026

Google's [image SEO guide](https://developers.google.com/search/docs/appearance/google-images), last updated in March 2026, covers text result images, Discover and Google Images with one set of rules. Here they are in the order a multimodal SEO pass applies them.

### Make sure Google can find the file

Embed images with a standard `<img>` element and a `src` attribute. Google says it doesn't index images set as CSS backgrounds. If you use `srcset` or `<picture>` for responsive images, keep a fallback `src`, because some crawlers ignore the newer attributes. Supported formats are BMP, GIF, JPEG, PNG, WebP, SVG and AVIF.

For images that load late or live on a CDN, add an [image sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps). Only two tags are required: `<image:image>`, which can appear up to 1,000 times per page entry, and `<image:loc>`. Google has dropped the caption, title, license and geo-location tags, so don't bother adding them. If the images sit on another domain, verify that domain in Search Console too.

### Tell Google what the image shows

Alt text is the image attribute Google calls most important. It pairs alt text with computer vision and the page's content to work out what a picture is about. Write a short, specific description: Google's own example moves from "puppy" to "Dalmatian puppy playing fetch." Google warns that stuffing alt attributes with keywords may cause a site to be seen as spam.

File names give only "very light clues," but they're free. Name a file `retainer-invoice-template.png`, not `IMG00023.png`. Captions and nearby text tell Google more, because it pulls an image's subject from the page's content, captions included. For inline SVG graphics, use a `<title>` element in place of alt text.

### Choose the image that represents the page

Google picks the preview image for a result on its own, but you can suggest one with `primaryImageOfPage`, an `image` property on the page's main entity, or the `og:image` tag. Pick a relevant, high-resolution image, and avoid your logo, text-heavy graphics and extreme aspect ratios. Our free [Open Graph generator](/tools/open-graph-generator) writes the social tags and shows a preview.

### Add license and credit details where they matter

If people reuse your photos, [image metadata](https://developers.google.com/search/docs/appearance/structured-data/image-license-metadata) can make an image eligible for the "Licensable" badge in Google Images, with a link to your license and credit line. You can use structured data on each page or IPTC metadata embedded in the file once. If the two conflict, Google uses the structured data.

## Video: Watch Pages, Markup and Key Moments

Video has the most rules of any multimodal SEO format, because video features need Google to find the page, the player and the file itself. Google's [video SEO guide](https://developers.google.com/search/docs/appearance/video) lists them.

| What you want               | What Google needs                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------------- |
| The video found at all      | A `<video>`, `<embed>`, `<iframe>` or `<object>` element that loads without a click or swipe      |
| The video indexed           | An indexed watch page that performs well in Search, with the video visible and not hidden         |
| A thumbnail in results      | A thumbnail of at least 60 by 30 pixels at a stable URL Googlebot can fetch                       |
| Video mode and rich formats | A dedicated watch page whose main purpose is that one video                                       |
| Key moments                 | Google may find them itself; Clip or SeekToAction markup, or YouTube timestamps, set them for you |
| Video previews              | Permission for Google to fetch the actual video file                                              |

### Give each video a watch page

This rule matters most for blogs. Google says a blog post that reviews an embedded video isn't a watch page, and neither is a product page with a 360-degree clip. Those pages can still show as text results. But to be eligible for Video mode, key moments and other video features, a video needs a page built around it, with a unique title and description.

### Mark it up with VideoObject

[VideoObject structured data](https://developers.google.com/search/docs/appearance/structured-data/video) needs three properties: `name`, `thumbnailUrl` and `uploadDate`. Google recommends adding `description`, `duration`, `contentUrl`, `embedUrl` and, for chapters, `hasPart`. Keep the markup consistent with the video and any sitemap entry.

### Label the key moments

Google can detect chapters on its own, but it gives priority to the ones you set. Use Clip markup to list each segment's start, end and label; it works in every language Search supports. SeekToAction tells Google where timestamps go in your URLs, and supports 12 languages. For YouTube videos, timestamps in the description do the same job. Google needs to fetch the video bytes for key moments and previews, so don't block the file with robots.txt.

## Audio and Transcripts: Give Every Recording a Text Twin

Audio is the weakest format for multimodal SEO, because Google's docs give it no markup of its own. The video guide doesn't mention transcripts at all. Bing's guidelines do list them, alongside captions and structured data, as ways to help Bing and Copilot understand media.

Even vendors whose models accept recordings hedge. OpenAI's help center says ChatGPT's analysis of uploaded video ["can be incomplete or inaccurate"](https://help.openai.com/en/articles/8400551-chatgpt-image-inputs-faq) and may not interpret the audio accurately. A crawler that reads HTML text gets nothing from a sound file on its own.

So give every webinar, demo, interview and podcast episode a transcript on the page, in HTML, not a PDF download. Start each one with a two- or three-sentence summary, use headings where the topic changes, and name each speaker. Check names, product terms and numbers by hand before you publish; those are the details an AI answer is most likely to quote. Our guide to [podcast transcripts as AI search citations](/blog/podcast-transcripts-ai-search-citations) covers the full transcript page format. Microsoft's advertising team makes the same point about PDFs: they ["often lack the structured signals"](https://about.ads.microsoft.com/en/blog/post/october-2025/optimizing-your-content-for-inclusion-in-ai-search-answers) that HTML provides.

## The Media Parity Audit: A Worked Example

Every multimodal SEO rule above comes back to one question: is the fact inside this file also written down? We call the check for it the **Media Parity Audit**. Run it on any page that carries images, video or audio.

1. **List every media file** on the page: photos, charts, graphics with text, videos and recordings.
2. **Write the fact each one carries** in a single sentence. A decorative photo carries none.
3. **Search the page's visible text** for that fact's key words and numbers. Use your browser's find command on the live page, not the design file.
4. **Add the missing text twin:** alt text for a simple image, a caption plus an HTML table for a chart, a transcript or summary for audio and video.
5. **Count parity** as files with a text twin divided by files that carry a fact.

### Tallyfold's features page, before and after

Tallyfold is a fictional invoicing app for agencies. Its features page carries six media files. All details are made up for this example.

| File                           | Fact it carries                                                          | Text twin before         | Fix                                         |
| ------------------------------ | ------------------------------------------------------------------------ | ------------------------ | ------------------------------------------- |
| Hero photo of a team at a desk | None (decorative)                                                        | Not needed               | Empty alt text                              |
| Pricing graphic                | $12 per user a month, $60 for five users                                 | None                     | HTML pricing table under the graphic        |
| Payment-time chart             | Automatic reminders plus a card link cut payment time from 38 to 17 days | Caption only, no numbers | Numbers in the caption and a four-row table |
| 90-second demo video           | Retainer invoices send on a schedule                                     | One sentence in the body | Watch page, VideoObject markup, transcript  |
| 45-minute webinar recording    | Five steps to chase late payments                                        | None                     | Transcript with headings and a summary      |
| Customer quote card            | A named agency got paid 12 days sooner                                   | None                     | Quote as HTML text with the customer's name |

Five of the six files carry a fact. Before the audit, none of those five had a complete text twin, and two had partial ones: the chart's caption and the demo's single sentence. Parity was 0 ÷ 5 = 0%. After the fixes, all five have one: 5 ÷ 5 = 100%. The hero photo needs nothing more than an empty alt attribute, which tells screen readers to skip it.

The audit found the biggest risk in the pricing graphic. A buyer who asks an AI assistant what Tallyfold costs is asking about exactly the fact that lived only in pixels.

## How to Measure Multimodal SEO in Search Console

Search Console now splits results by format. The [Performance report](https://support.google.com/webmasters/answer/7576553?hl=en) offers search types for web (text-based or multimodal), image, video and news. The multimodal type, added on [24 September 2026](https://developers.google.com/search/blog/2026/09/web-multimodal-in-sc), counts searches made with Lens, Circle to Search, image uploads and Chrome's "Search this image." Our explainer on [what multimodal search is](/blog/what-is-multimodal-search) covers those tools from the searcher's side. The generative AI report has the same split for AI Overviews and AI Mode.

For video on YouTube, Search Console's new [platform properties](https://developers.google.com/search/blog/2026/07/platform-properties-social-video-guide), available to everyone since 29 July 2026, show which searches lead people to your channel's videos. Check these reports monthly and look for pages whose image or video impressions fall after a redesign.

Search Console won't tell you whether AI answers quote your transcripts or tables. For that, run a small set of prompts by hand, as our guide to [measuring GEO](/blog/how-to-measure-geo) explains.

## Where Rankbox Fits Into Multimodal SEO

Rankbox covers the text side of multimodal SEO: the articles your images and videos sit in. Its [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and drafts 2,000 to 3,500-word source-backed articles, and its [Brand Voice](/features/brand-voice) feature applies the tone and product details you give it. It doesn't create images or video, transcribe audio or track AI citations. The Business plan is $49.50 a month with a 7-day trial ([pricing](/pricing)).

## Frequently Asked Questions

### What is multimodal SEO?

Multimodal SEO is optimizing images, video and audio so search engines and AI search can find, understand and show them. It covers alt text, file names, captions, image and video sitemaps, VideoObject markup, watch pages and transcripts, plus making sure each visual's key fact also appears as text.

### Is multimodal SEO different from image SEO?

Multimodal SEO includes image SEO but goes wider. Image SEO covers alt text, file names and image sitemaps. Multimodal SEO adds video watch pages, key moments, transcripts for audio, and a check that facts inside any media file also exist as page text that AI search can quote.

### Do image sitemaps still matter?

Yes, for images Google might not find on its own, such as ones loaded by JavaScript or hosted on a CDN. Google now requires only the `<image:image>` and `<image:loc>` tags. It dropped caption, title, license and geo-location tags, so leave those out.

### Do videos need transcripts for SEO?

Google's video guide doesn't require transcripts, but they turn spoken content into text search engines can index and AI answers can quote. Bing lists transcripts as a way to help its systems understand media. Publish them as HTML on the watch page, not as a PDF.

### Which structured data helps multimodal SEO?

VideoObject is the main one, with Clip or SeekToAction for key moments. Image metadata can make a photo eligible for the Licensable badge in Google Images. Google says no special markup is needed for its AI features, but these types keep you eligible for video and image rich results.

### How do I see image and video traffic in Search Console?

Open the Performance report and change the search type to Image, Video or Web multimodal. The multimodal type, added in September 2026, covers Lens, Circle to Search and image uploads. For YouTube videos, add a platform property to see the searches that reach your channel.

## References

1. [Google image SEO best practices, Google Search Central](https://developers.google.com/search/docs/appearance/google-images)
2. [Image sitemaps, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps)
3. [Image metadata in Google Images, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/image-license-metadata)
4. [Video SEO best practices, Google Search Central](https://developers.google.com/search/docs/appearance/video)
5. [Video (VideoObject, Clip, BroadcastEvent) structured data, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/video)
6. [Optimizing your website for generative AI features on Google Search, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
7. [Webmaster Guidelines, Bing Webmaster Tools](https://www.bing.com/webmasters/help/webmasters-guidelines-30fba23a)
8. [Performance report (Search), Search Console Help](https://support.google.com/webmasters/answer/7576553?hl=en)
9. [Announcing web multimodal Search performance reporting in Search Console, Google Search Central Blog](https://developers.google.com/search/blog/2026/09/web-multimodal-in-sc)
10. [Platform properties roll out globally, plus a new social and video performance guide, Google Search Central Blog](https://developers.google.com/search/blog/2026/07/platform-properties-social-video-guide)
11. [ChatGPT Image Inputs FAQ, OpenAI Help Center](https://help.openai.com/en/articles/8400551-chatgpt-image-inputs-faq)
12. [Optimizing Your Content for Inclusion in AI Search Answers, Microsoft Advertising](https://about.ads.microsoft.com/en/blog/post/october-2025/optimizing-your-content-for-inclusion-in-ai-search-answers)
