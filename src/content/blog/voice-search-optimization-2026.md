---
title: Voice Search Optimization in 2026: A Checklist for AI Assistants
description: A 20-point voice search optimization checklist for 2026 AI assistants, covering crawler access, listings, spoken answers and the markup Google still uses.
keyword: voice search optimization
date: 2026-09-29
updated: 2026-09-29
author: Rankbox Team
tags: AI Search, Playbooks
---

Voice search optimization in 2026 means getting your pages and listings into the sources AI assistants read before they answer out loud. Let each assistant's search crawler in, keep your business listings accurate, write answers that still make sense when spoken, and stop relying on markup Google has retired.

The assistants changed fast in 2026. Gemini [replaced Google Assistant](https://support.google.com/gemini/thread/396052272/) on most Android phones in September 2026, [Siri AI went into beta](https://www.apple.com/newsroom/2026/09/siri-ai-a-profoundly-more-capable-and-personal-assistant-is-here/) the same month, and ChatGPT, Alexa+ and Copilot all hold spoken conversations that can search the web. Our guide to [how AI-powered voice search works now](/blog/voice-search-ai-powered) covers why that happened and how spoken prompts differ from typed ones.

This post is the practical half of voice search optimization. It maps each assistant to the sources its vendor says it uses, then gives a 20-point checklist you can work through in an afternoon. Every fact about an assistant was checked on the vendor's own pages on 29 September 2026.

## Key Takeaways

- Voice search optimization now starts with crawler access: Googlebot, OAI-SearchBot, Applebot, Amzn-SearchBot and Bingbot each feed a different assistant.
- Two page tags quietly remove you from spoken answers: `nosnippet` opts content out of Siri's world knowledge answers, and `noarchive` keeps it out of Copilot.
- Apple Business Connect no longer exists. Apple Business replaced it on 14 April 2026 and now manages your place card in Apple Maps, and Apple lists Siri among the places it reaches customers.
- FAQ rich results stopped on 7 May 2026, and speakable markup only works for US English news on Google Home devices.
- Blocking `Google-Extended` also removes your pages from Gemini app grounding, not just from training.

## Which Assistants Matter for Voice Search Optimization

Start with the assistants your buyers use. No vendor publishes voice usage by assistant, so use the proxies that exist. Edison Research's [Infinite Dial 2026](https://www.edisonresearch.com/the-infinite-dial-2026/), a January 2026 survey of 2,050 Americans aged 12 and over, found [39% own a smart speaker](https://ssrs.com/wp-content/uploads/The-Infinite-Dial-2026-Presentation.pdf). Those speakers are where Alexa+ and Gemini for Home are rolling out. On phones, Google says [more than one in six AI Mode searches](https://storage.googleapis.com/gweb-uniblog-publish-prod/documents/AI-Mode-US-Insights.pdf) in the US are non-text, voice included.

For most sites that means Google first, then ChatGPT, Siri, Alexa+ and Copilot. The table maps each one to the source its vendor names, the crawler or tag that controls access, and the listing it reads.

| Assistant                       | Answer source, per the vendor                          | What controls access                        | Listing that feeds it                                |
| ------------------------------- | ------------------------------------------------------ | ------------------------------------------- | ---------------------------------------------------- |
| Search Live (Google app)        | Search in AI Mode, with web links on screen            | Googlebot                                   | Google Business Profile                              |
| Gemini Live and Gemini for Home | Google Search index grounding; public Google Maps data | Googlebot, plus the `Google-Extended` token | Google Business Profile                              |
| ChatGPT Voice                   | ChatGPT search, with partners including Microsoft      | OAI-SearchBot                               | Not named; reservations via OpenTable, Resy and Yelp |
| Siri AI                         | Applebot's crawl, for world knowledge answers          | Applebot, and the `nosnippet` tag           | Apple Business place card                            |
| Alexa+                          | News partners, service partners and web pages          | Amzn-SearchBot and Amzn-User                | Not named; services include Yelp and Thumbtack       |
| Copilot Voice                   | The Bing search service                                | Bingbot, and `noarchive` or `nocache` tags  | Bing Places for Business                             |

A few rows need a sentence of context.

### Google

Search Live now works in [every language and location where AI Mode is offered](https://blog.google/products-and-platforms/products/search/search-live-global-expansion/), across more than 200 countries. Gemini Live can [automatically use public information from Google Maps](https://support.google.com/gemini/answer/15274899?hl=en&co=GENIE.Platform%3DAndroid) in a chat. Google's [crawler docs](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers) say the `Google-Extended` token controls both Gemini training and grounding "in Gemini Apps," so blocking it costs you Gemini answers but not Search. Our [Gemini guide](/ai-seo/gemini) covers the details.

### ChatGPT

OpenAI's [search help page](https://help.openai.com/en/articles/9237897-searching-the-web-with-chatgpt) says you can ask ChatGPT to search the web during a voice conversation. To be eligible, it says, "allow OAI-Searchbot to crawl the site" and let OpenAI's published IP addresses through your CDN. Its [crawler page](https://developers.openai.com/api/docs/bots) adds that robots.txt changes take about 24 hours to reach its systems.

### Siri

Apple says Siri AI answers web questions with [information from across the web](https://www.apple.com/newsroom/2026/09/siri-ai-a-profoundly-more-capable-and-personal-assistant-is-here/) but names no search partner. Its [Applebot page](https://support.apple.com/en-us/119829), published on 4 September 2026, is the one place Apple connects the dots: Applebot's crawl may be used for "answering broad world knowledge questions in Siri and Search." If your robots.txt doesn't mention Applebot, Apple follows your Googlebot rules.

### Alexa+

Amazon's [crawler page](https://developer.amazon.com/amazonbot) lists three agents. Allowing Amzn-SearchBot makes your content "eligible to appear in search experiences such as Alexa." Amzn-User fetches live pages when an Alexa question needs current facts, and "may not follow all robots.txt directives." Amazonbot is the one that may train Amazon's models.

### Copilot

Microsoft says Copilot [gives citations in voice mode transcripts](https://support.microsoft.com/en-us/privacy/microsoft-copilot/transparency-note) and grounds web answers in Bing. Bing's [webmaster guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a) say `noarchive` "prevents content from being used in Copilot responses" and `nocache` limits Copilot to your URL, title and snippet. See our [Copilot guide](/ai-seo/copilot) for Bing setup.

## The 20-Point Voice Search Optimization Checklist

We call this the Voice Readiness Checklist. It has 20 checks in four groups. Mark each one pass, fail or not applicable, then score your voice search optimization as passes divided by applicable checks. Rerun it every quarter.

### Group A: Crawler access

| #   | Check                                                                  | How to verify                         |
| --- | ---------------------------------------------------------------------- | ------------------------------------- |
| 1   | Googlebot can crawl and index your key pages                           | Search Console URL Inspection         |
| 2   | `Google-Extended` isn't disallowed, if you want Gemini answers         | Read your robots.txt                  |
| 3   | OAI-SearchBot is allowed, and your CDN lets OpenAI's IP ranges through | Robots tester, then server logs       |
| 4   | Applebot, Amzn-SearchBot and Bingbot are allowed                       | Robots tester for each user agent     |
| 5   | No `nosnippet`, `noarchive` or `nocache` on pages you want quoted      | View the page source and HTTP headers |

### Group B: Listings

| #   | Check                                                                   | How to verify                            |
| --- | ----------------------------------------------------------------------- | ---------------------------------------- |
| 6   | Google Business Profile claimed, with correct hours, services and phone | Search your name in Google Maps          |
| 7   | Apple Business place card claimed (it replaced Business Connect)        | Search your name in Apple Maps           |
| 8   | Bing Places listing claimed and checked after any Google import         | Search your name in Bing Maps            |
| 9   | Yelp page claimed and correct, if you take bookings or serve locals     | Open your Yelp business page             |
| 10  | Name, phone, hours and prices match on every listing and your site      | Compare each listing with one fact sheet |

### Group C: Spoken answers

| #   | Check                                                                         | How to verify                        |
| --- | ----------------------------------------------------------------------------- | ------------------------------------ |
| 11  | Each key page opens with one sentence naming the product and its category     | Read the first sentence alone        |
| 12  | The page recommends an option for a stated situation                          | Look for "If you ..., choose ..."    |
| 13  | Price, hours, limits and compatibility are written as text with units         | Search the page for each fact        |
| 14  | The next three likely follow-up questions have their own headings             | Ask a colleague what they'd ask next |
| 15  | The answer block reads aloud in under 30 seconds and ends with a dated caveat | Read it out with a timer             |

### Group D: Markup

| #   | Check                                                         | How to verify                       |
| --- | ------------------------------------------------------------- | ----------------------------------- |
| 16  | Organization markup with `sameAs` links to your profiles      | Rich Results Test                   |
| 17  | LocalBusiness markup if you have a physical location          | Rich Results Test                   |
| 18  | Product markup or a Merchant Center feed if you sell products | Merchant Center diagnostics         |
| 19  | No FAQ markup added in the hope of a rich result              | Search your templates for `FAQPage` |
| 20  | Speakable markup only if you publish English news in the US   | Check your news templates           |

Group C is where most sites lose points in voice search optimization. The hub post explains the reasoning behind checks 11 to 15 as the [Spoken-Answer Format](/blog/voice-search-ai-powered), with a full before-and-after rewrite.

## Crawler Access for Each Assistant's Search Bot

Most voice search optimization failures start at the door. A blanket "block AI bots" rule, or a CDN preset, can shut out the search crawlers that feed spoken answers while you think you're only blocking training.

### A robots.txt that separates search from training

This pattern lets the search bots in and keeps the training-only crawlers out. Adjust it to your own policy.

```txt
# Search crawlers that feed voice answers
User-agent: Googlebot
User-agent: OAI-SearchBot
User-agent: Applebot
User-agent: Amzn-SearchBot
User-agent: Bingbot
Allow: /

# Training-only crawlers (optional)
User-agent: GPTBot
User-agent: Applebot-Extended
User-agent: Amazonbot
Disallow: /
```

Leave `Google-Extended` alone unless you're willing to lose Gemini app answers, because Google uses the same token for grounding and training. Test each user agent with our free [robots.txt tester](/tools/robots-txt-tester), and see our [AI crawler directory](/blog/ai-crawler-directory) for every bot's user agent string and IP list.

### Tags that remove you without a robots.txt change

Page-level tags do damage quietly, because the page still ranks in normal search. Apple says the [`nosnippet` tag opts content out](https://support.apple.com/en-us/119829) of Siri's world knowledge answers. Bing says `noarchive` keeps content out of Copilot and `nocache` cuts Copilot to a title and snippet. Amazon reads `noarchive` differently: for its bots it means "do not use the page for model training." Check templates for pricing, docs and product pages first, since those answer the questions voice users ask next.

## Local Listings That Feed Spoken Answers

Listings are the biggest voice search optimization lever for businesses people visit or call. A spoken question about a place ("a bike shop near me that's open Sunday") draws on place data more than on articles.

1. **Google Business Profile.** Google's [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) says profiles "can help your products and services to be visible in both AI responses and other Google Search results." Gemini Live reads the same Maps data.
2. **Apple Business.** Apple [replaced Business Connect](https://www.apple.com/newsroom/2026/03/introducing-apple-business-a-new-all-in-one-platform-for-businesses-of-all-sizes/) with Apple Business on 14 April 2026, and old data moved over on its own. It's free and manages your place card across Apple Maps, Safari and Spotlight, and Apple lists Siri among the places it helps you reach customers.
3. **Bing Places for Business.** Microsoft says registering keeps "address, hours, and contact information" [eligible for inclusion in AI-generated responses](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview).
4. **Yelp and trade directories.** ChatGPT shows reservation times from OpenTable, Resy and Yelp in text chats, though not in voice. Amazon lists Yelp and Thumbtack among the services Alexa+ connects to.

Keep one fact sheet and copy from it into every listing. Our guide to [optimizing your business for AI search](/blog/optimize-business-for-ai-search) includes an 18-fact template and a worked listing audit.

## Structured Data Google Still Supports for Voice Search Optimization

Google says [structured data isn't required](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) for its AI features, "and there's no special schema.org markup you need to add." It still recommends markup for rich results. Here's what's current as of September 2026.

| Markup                       | Status                                                                                                                                   | Use it for                                      |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Organization                 | In Google's [search gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery)                        | Your name, logo and profile links               |
| LocalBusiness                | In the gallery                                                                                                                           | Address, hours and phone for physical locations |
| Product and merchant listing | In the gallery                                                                                                                           | Price and availability for things you sell      |
| Article and review snippet   | In the gallery                                                                                                                           | Articles and third-party reviews                |
| FAQ                          | [No longer shown from 7 May 2026](https://developers.google.com/search/updates); docs removed in June                                    | Nothing in Search. Keep Q&A as visible text     |
| Speakable                    | [Beta, US English only](https://developers.google.com/search/docs/appearance/structured-data/speakable), for news on Google Home devices | English-language news publishers in the US      |

Our free [schema generator](/tools/schema-generator) builds Organization and LocalBusiness blocks you can paste into a page.

## Worked Example: Tallyfold Runs the Voice Search Optimization Checklist

Tallyfold is a fictional invoicing app for agencies, with no shop or office customers visit. So checks 7, 9 and 17 don't apply, leaving 17 applicable checks. Its first pass looks like this.

| Group             | Applicable | Passed | Failed checks                                                               |
| ----------------- | ---------- | ------ | --------------------------------------------------------------------------- |
| A: Crawler access | 5          | 3      | 4 (a CDN preset blocks Amzn-SearchBot), 5 (`nosnippet` on the pricing page) |
| B: Listings       | 3          | 2      | 10 (old phone number on Bing Places)                                        |
| C: Spoken answers | 5          | 2      | 11, 12, 14 (vague openings, no picks, no follow-up headings)                |
| D: Markup         | 4          | 3      | 19 (FAQ markup added last year for rich results)                            |
| **Total**         | **17**     | **10** | **7 fails**                                                                 |

That's 10 of 17, or 59%. The fix order follows reach. The CDN preset goes first, because it cuts Alexa off from the whole site. The `nosnippet` tag is next, because it hides the pricing page from Siri's answers. The Bing Places phone fix takes five minutes. The three writing fixes take longest but lift every assistant at once. Removing the FAQ markup is tidy-up, not a ranking fix. After all seven fixes, Tallyfold scores 17 of 17.

## Where Rankbox Helps

Rankbox covers the writing side of voice search optimization, checks 11 to 15. Its [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and drafts source-backed articles of 2,000 to 3,500 words, and [Brand Voice](/features/brand-voice) applies your tone and product details, so you can brief it to open with a one-sentence answer and a clear pick. It doesn't change robots.txt, manage listings, refresh old posts or track what assistants say about you. Articles reach your site through its API. The Business plan is $49.50 a month with a 7-day trial; see [pricing](/pricing).

## Frequently Asked Questions

### What is voice search optimization in 2026?

Voice search optimization in 2026 is making your content and listings usable by AI assistants that answer out loud. It covers crawler access for each assistant's search bot, accurate business listings, short spoken-style answers on key pages, and the structured data Google still supports.

### Which voice assistants should I optimize for?

Start with Google, because Search Live and Gemini both run on its index and Maps data. Then cover ChatGPT Voice, Siri AI, Alexa+ and Copilot. Each needs its own crawler allowed. For local facts, add Apple Business, which Apple says reaches customers in Maps and Siri, and Bing Places, which Microsoft ties to AI answers.

### Does Siri use Google to answer web questions?

Apple doesn't say so. Its new models were built "in collaboration with Google and its Gemini models," but Apple names no search partner. Its Applebot page says Applebot's crawl may be used for Siri's world knowledge answers, so allow Applebot and avoid `nosnippet` on pages you want quoted.

### Do I need speakable schema for voice search optimization?

Only if you publish English-language news in the US. Google's speakable markup is still in beta and works on Google Home devices for topical news queries. Other sites gain nothing in Google Search from it, and FAQ markup no longer produces rich results either.

### Can I block AI training and still appear in voice answers?

Mostly, yes. Block training crawlers such as GPTBot, Applebot-Extended and Amazonbot while allowing the search bots. The exception is Google: `Google-Extended` controls both Gemini training and Gemini app grounding, so blocking it removes you from Gemini answers.

### Is Apple Business Connect still available?

No. Apple Business replaced Business Connect on 14 April 2026, and existing Business Connect data moved over automatically. Claim or check your place card in Apple Business to keep your details right in Apple Maps and across Apple's apps.

## References

1. [Search Live is expanding globally, Google](https://blog.google/products-and-platforms/products/search/search-live-global-expansion/)
2. [Talk naturally with Gemini Live, Gemini Apps Help](https://support.google.com/gemini/answer/15274899?hl=en&co=GENIE.Platform%3DAndroid)
3. [Google's common crawlers, Google Search Central](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers)
4. [AI optimization guide, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
5. [Structured data search gallery, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/search-gallery)
6. [Speakable (BETA) structured data, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/speakable)
7. [Latest Google Search documentation updates, Google Search Central](https://developers.google.com/search/updates)
8. [Searching the web with ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/9237897-searching-the-web-with-chatgpt)
9. [Overview of OpenAI crawlers, OpenAI](https://developers.openai.com/api/docs/bots)
10. [Siri AI is here, Apple Newsroom](https://www.apple.com/newsroom/2026/09/siri-ai-a-profoundly-more-capable-and-personal-assistant-is-here/)
11. [About Applebot, Apple Support](https://support.apple.com/en-us/119829)
12. [Introducing Apple Business, Apple Newsroom](https://www.apple.com/newsroom/2026/03/introducing-apple-business-a-new-all-in-one-platform-for-businesses-of-all-sizes/)
13. [About Amazonbot, Amazon Developer](https://developer.amazon.com/amazonbot)
14. [Transparency Note for Microsoft Copilot, Microsoft Support](https://support.microsoft.com/en-us/privacy/microsoft-copilot/transparency-note)
15. [Bing Webmaster Guidelines, Microsoft Bing](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a)
16. [Introducing AI Performance in Bing Webmaster Tools, Microsoft Bing](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview)
17. [The Infinite Dial 2026, Edison Research](https://www.edisonresearch.com/the-infinite-dial-2026/)
