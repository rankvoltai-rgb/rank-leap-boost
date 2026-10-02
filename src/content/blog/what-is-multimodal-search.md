---
title: What Is Multimodal Search? Google Lens, Circle to Search and AI Mode Explained
description: What is multimodal search? How searching with photos, screenshots, your camera and words together works in Google Lens, Circle to Search, AI Mode and more.
keyword: multimodal search
date: 2026-10-27
updated: 2026-10-27
written: 2026-09-30
author: Rankbox Team
tags: AI Search, Google
---

Multimodal search is searching with more than one kind of input at once: a photo plus a typed question, a screenshot, a live camera view or your voice. The search engine reads the picture and the words together, then answers with results or an AI summary that can mix text, images and links.

You've probably used it without the label. Google's Think with Google site says Lens handles [more than 25 billion queries a month](https://business.google.com/ca-en/think/search-and-video/search-trends-marketing-takeaways/), based on internal data from April 2025. Circle to Search reached [more than 300 million Android devices](https://blog.google/products/search/circle-to-search-ai-mode-gaming/) by July 2025. And Google now reports this traffic to site owners as its own [multimodal search type](https://developers.google.com/search/blog/2026/09/web-multimodal-in-sc) in Search Console.

This is the searcher's explainer: what the term means, how it works, the main tools as of September 2026 and which one to pick. If you run a website and want to know what these tools do with your images and charts, read our guide to [multimodal GEO and how AI search "sees" visuals](/blog/multimodal-geo).

## Key Takeaways

- Multimodal search combines inputs such as images, text, voice and live video in one query, and answers can combine formats too.
- Google Lens identifies objects by matching them against images indexed from the web, and newer AI models let it answer questions about unusual images.
- Circle to Search, AI Mode and Google's visual search now split one image into several objects and run a search for each at the same time.
- Outside Google, ChatGPT, Bing Visual Search, Copilot Vision, Apple's Visual Intelligence and Amazon Lens Live all offer some form of multimodal search as of September 2026.
- Most of these tools process your image or screen on the company's servers. Chrome's Lens, for example, sends Google a screenshot of the page you're searching.

## What Multimodal Search Means

The word "modal" refers to a mode of input, such as text, image, audio or video. Classic web search took one mode: typed words. Multimodal search takes several, and it can use them together in the same query.

### The everyday meaning

For most people, multimodal search means pointing a camera or sharing a screenshot and asking about it. Snap a plant and ask if it's safe for cats. Circle a jacket in a video and ask where to buy it. Upload a photo of a bookshelf and ask for similar books. The picture supplies what's hard to describe, and the words supply what you want to know.

### The developer meaning

Engineers use the term for search systems they build. Microsoft's Azure AI Search docs define [multimodal search](https://learn.microsoft.com/en-us/azure/search/multimodal-search-overview) as the ability to "ingest, understand, and retrieve information across multiple content types, including text, images, video, and audio." Their example is a company search tool that answers a question from a diagram inside a PDF. Same idea, but inside an organization's own documents, not the public web.

## How Multimodal Search Works

Every product handles it differently, but Google has described its version in the most detail. Here's the usual sequence.

1. **You give it an image, and maybe words.** A photo, a screenshot, a live camera view or a circled part of your screen.
2. **The system works out what's in the image.** For years, Lens has identified objects [by matching against a database of images indexed from the web](https://blog.google/products-and-platforms/devices/google-lens/lens-on-ios-ai-overviews/). Since February 2025, it also adds AI Overviews for more unusual images.
3. **It splits the image into parts and searches each one.** Google calls this ["visual search fan-out"](https://blog.google/products/search/search-ai-updates-september-2025/). In Circle to Search, Google says the model [picks the most important parts of an image to crop](https://blog.google/products-and-platforms/products/search/circle-to-search-february-2026/), runs several searches at once and cross-references the results.
4. **It answers.** Results can include an AI Overview, search results for objects in the image, similar images and [websites that use the same image](https://support.google.com/websearch/answer/1325808?hl=en&co=GENIE.Platform%3DAndroid).
5. **You follow up.** Type or say "show me this in black" or "is it cheaper anywhere?" and the search continues from the same picture.

A Google search director described the split of labor in a [March 2026 interview](https://blog.google/company-news/inside-google/googlers/how-google-ai-visual-search-works/). The Gemini model looks at the image and decides which tools to use. The visual search backend supplies web results from its index. Then the model reads those results and writes one answer with links.

## Multimodal Search Tools as of September 2026

The table lists the main tools and how each vendor describes access, checked on 30 September 2026. For AI Mode's full set of inputs, see our guide to [using AI Mode in Google](/blog/what-is-ai-mode-in-google). For voice and camera conversations, see [AI-powered voice search](/blog/voice-search-ai-powered).

| Tool                      | How you start it                                                          | What it does best                                                   | Where it works                                               |
| ------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------ |
| Google Lens               | Lens icon in the Google app or Chrome search bar; touch and hold an image | Identifies objects, products, text and places; finds similar images | Google app and Chrome on Android and iOS; Chrome on desktop  |
| Circle to Search          | Touch and hold the home button or navigation handle, then circle          | Searches anything on your screen without switching apps             | Select Android phones, including Pixel 6 and later           |
| AI Mode with images       | Add a photo in AI Mode and ask a question                                 | Complex questions about a whole scene, with visual results          | Wherever AI Mode is offered                                  |
| Lens in desktop Chrome    | "Search this tab with Google Lens" from the menu                          | Questions about the page you're reading                             | Chrome on computers, with Google as default search           |
| ChatGPT image inputs      | Tap +, then add photos, or paste an image                                 | Explaining, comparing and reading images in a chat                  | Free and paid plans, web and mobile                          |
| Bing Visual Search        | Camera icon in the Bing Images search box                                 | Similar images, products, pages that use the image                  | Bing on desktop and mobile                                   |
| Copilot Vision            | Share a screen, app, page or camera feed                                  | Guidance on what you're looking at, by voice                        | Windows, Edge and Copilot mobile; needs a Microsoft 365 plan |
| Apple Visual Intelligence | Camera Control, Action button or Control Center                           | Business details, similar images, plants and animals                | iPhones with Apple Intelligence                              |
| Amazon Lens Live          | Open Amazon Lens in the Shopping app                                      | Real-time product matches while you scan                            | Amazon Shopping app on iOS and Android                       |

### Google Lens and Circle to Search

Lens is the base layer. In the Google app or Chrome, tap the Lens icon to take or upload a photo, or touch and hold any image on a website and choose to search it. Tap "Ask about this image" to add words. On Android you can press and hold the shutter to ask by voice, in English.

Circle to Search is Lens for your whole screen on Android. Google's [help page](https://support.google.com/websearch/answer/14508957?hl=en) lists select phones, including Pixel 6 and later. Since February 2026, you can circle several things at once, starting with the Galaxy S26 series and Pixel 10. It can also translate the whole screen, and it can check whether a photo is an original or has been modified. On iPhone, the nearest match is Lens in Chrome or the Google app, which lets you [select and search what's on your screen](https://blog.google/products-and-platforms/devices/google-lens/lens-on-ios-ai-overviews/).

![Introducing a new way to search | Circle to Search](youtube:WdbeqSQjZI8 "Google's January 2024 launch video for Circle to Search on Android.")

### ChatGPT, Microsoft and Apple

OpenAI says [every ChatGPT model accepts images](https://help.openai.com/en/articles/8400551-chatgpt-image-inputs-faq), on free and paid plans, as PNG, JPEG or non-animated GIF files up to 20 MB each. It suits open questions like "what's wrong with this spreadsheet chart?" but it's a chat, not a results page.

Microsoft offers two tools. [Bing Visual Search](https://support.microsoft.com/en-us/bing/using-bing-visual-search) takes a dragged, pasted or uploaded image and returns similar images, products and pages that include it. [Copilot Vision](https://support.microsoft.com/en-us/microsoft-copilot/using-copilot-vision-with-microsoft-copilot) watches a screen or camera feed you choose to share and talks you through it, but it needs a Microsoft 365 Personal, Family or Premium plan for consumers.

On iPhone, [Visual Intelligence](https://support.apple.com/guide/iphone/use-visual-intelligence-iph12eb1545e/ios) searches for similar images online, looks up businesses and identifies plants and animals. With the ChatGPT extension on, it can also ask ChatGPT about what the camera sees. Our post on [what Apple Intelligence does](/blog/what-does-apple-intelligence-do) covers the rest of Apple's features.

## Which Multimodal Search Tool to Use

Most people only need two or three of these. We call this table the **Multimodal Search Picker**: start with what you want to do, not with the app.

| If you want to                                                | Use                                                   | Why                                                       |
| ------------------------------------------------------------- | ----------------------------------------------------- | --------------------------------------------------------- |
| Identify something in front of you                            | Google Lens, or Visual Intelligence on iPhone         | Both match the camera view against the web in one tap     |
| Search something on your phone screen without leaving the app | Circle to Search on Android; Lens in Chrome on iPhone | No screenshot or app switch needed                        |
| Ask a detailed question about a photo                         | AI Mode or ChatGPT                                    | They can reason about the whole scene and take follow-ups |
| Buy something you saw                                         | Google Lens or Amazon Lens Live                       | Both link visual matches to product listings              |
| Find where else an image appears online                       | Google Lens or Bing Visual Search                     | Both list pages that use the same or a similar image      |
| Get help with what's on your PC screen                        | Copilot Vision                                        | It reads the window you share and explains it             |
| Talk through what your camera sees                            | Search Live in the Google app                         | It's a spoken conversation with the camera on             |

Shopping is a big share of multimodal search. Google said in 2024 that [20% of Lens searches were shopping-related](https://blog.google/products/ads-commerce/google-lens-ai-overviews-ads-marketers/), and it has since built outfit and room searches that find every item in a picture at once.

## What Gets Sent When You Search With an Image

Most multimodal search runs on the company's servers, so your image or screen usually leaves your device. The vendors describe what happens next in different ways.

- **Chrome's Lens:** a screenshot of the page and page data go to Google. Google says it keeps them only for processing and doesn't use them for training "as a result of this."
- **Copilot Vision:** Microsoft says session data may be kept for up to 47 hours and isn't used to train its models.
- **Bing Visual Search:** Microsoft says photos you provide "may be used to improve Bing image processing services."
- **Circle to Search:** Google notes it may not work in some apps, such as banking and medical apps.
- **Apple Visual Intelligence:** image searches are subject to your search provider's terms and privacy policies.

If a screenshot holds personal details, crop them out before you search.

## What Multimodal Search Means for Site Owners

When someone searches with an image, Google can send them to your page from the visual results. Since 24 September 2026, Search Console's [Performance report](https://support.google.com/webmasters/answer/7576553?hl=en) shows that traffic under the "Web: multimodal" search type, covering Lens, Circle to Search, image uploads and Chrome image search.

To appear there, your images need the basics: real `<img>` elements, useful alt text, captions and nearby text. Our [multimodal SEO guide](/blog/multimodal-seo) walks through images, video and audio. For whether AI answers read the text inside your charts, and how to design charts that survive a screenshot, see our full guide to [multimodal GEO](/blog/multimodal-geo).

Rankbox helps with the written side: its [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes source-backed articles that give your images clear text around them. It doesn't track visual search traffic or AI citations. The Business plan is $49.50 a month with a 7-day trial ([pricing](/pricing)).

## Frequently Asked Questions

### What is an example of multimodal search?

Taking a photo of a sneaker with Google Lens and typing "in blue under $100" is multimodal search. So is circling a lamp in a video with Circle to Search, or uploading a chart to ChatGPT and asking what it shows. The image and the words work together in one query.

### Is Google Lens multimodal search?

Yes. Google Lens is Google's main multimodal search tool. It searches with photos, screenshots and camera views, and you can add text or, on Android in English, a spoken question. Results can include AI Overviews, similar images and websites that use the image.

### What is the difference between multimodal search and visual search?

Visual search uses an image as the query. Multimodal search is broader: it combines images with text, voice or video in one query and can answer in several formats. Google Lens does both: you can search with a photo alone, or add a question to it.

### Is Circle to Search available on iPhone?

No, Circle to Search is an Android feature, on select phones including Pixel 6 and later. On iPhone, Google Lens in Chrome or the Google app lets you select and search what's on your screen, and Apple's Visual Intelligence searches what your camera or screenshot shows.

### Does multimodal search use AI?

Yes. Identifying objects, reading text in images and writing summaries all rely on AI models. Google says Gemini looks at the image and decides which searches to run, while Lens matches objects against images indexed from the web. ChatGPT and Copilot use their own vision models.

### Is multimodal search free?

Mostly, yes. Google Lens, Circle to Search, AI Mode, Bing Visual Search and ChatGPT's image inputs have free options, though ChatGPT sets usage limits by plan. Copilot Vision needs a Microsoft 365 Personal, Family or Premium plan for consumers, and Apple's Visual Intelligence needs an Apple Intelligence iPhone.

## References

1. [Search with an image on Google, Google Search Help](https://support.google.com/websearch/answer/1325808?hl=en&co=GENIE.Platform%3DAndroid)
2. [Search your screen with Circle to Search, Google Search Help](https://support.google.com/websearch/answer/14508957?hl=en)
3. [Circle to Search gets updated to search multiple things at once, Google](https://blog.google/products-and-platforms/products/search/circle-to-search-february-2026/)
4. [Dive deeper with AI Mode and get gaming help in Circle to Search, Google](https://blog.google/products/search/circle-to-search-ai-mode-gaming/)
5. [Use Lens to search your screen while you browse on iOS, Google](https://blog.google/products-and-platforms/devices/google-lens/lens-on-ios-ai-overviews/)
6. [How does AI understand my visual searches?, Google](https://blog.google/company-news/inside-google/googlers/how-google-ai-visual-search-works/)
7. [Search with Google Lens in Chrome, Google Chrome Help](https://support.google.com/chrome/answer/15086890?hl=en&co=GENIE.Platform%3DDesktop)
8. [What the breakout Search trends of 2025 mean for your marketing strategy in 2026, Think with Google](https://business.google.com/ca-en/think/search-and-video/search-trends-marketing-takeaways/)
9. [ChatGPT Image Inputs FAQ, OpenAI Help Center](https://help.openai.com/en/articles/8400551-chatgpt-image-inputs-faq)
10. [Using Bing Visual Search, Microsoft Support](https://support.microsoft.com/en-us/bing/using-bing-visual-search)
11. [Using Copilot Vision with Microsoft Copilot, Microsoft Support](https://support.microsoft.com/en-us/microsoft-copilot/using-copilot-vision-with-microsoft-copilot)
12. [Learn about what's around you with Visual Intelligence on iPhone, Apple Support](https://support.apple.com/guide/iphone/use-visual-intelligence-iph12eb1545e/ios)
13. [Introducing Amazon Lens Live, Amazon](https://www.aboutamazon.com/news/retail/search-image-amazon-lens-live-shopping-rufus)
14. [Multimodal search concepts and guidance, Azure AI Search, Microsoft Learn](https://learn.microsoft.com/en-us/azure/search/multimodal-search-overview)
15. [Announcing web multimodal Search performance reporting in Search Console, Google Search Central Blog](https://developers.google.com/search/blog/2026/09/web-multimodal-in-sc)
16. [AI Mode in Google Search updates: visual exploration and discovery, Google](https://blog.google/products/search/search-ai-updates-september-2025/)
