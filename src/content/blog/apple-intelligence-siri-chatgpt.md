---
title: Apple Intelligence & Siri: How iOS 18/26 Routes Queries to ChatGPT
description: How Apple Intelligence routes Siri requests on device, to Private Cloud Compute or to ChatGPT in iOS 18, 26 and 27, and what Applebot reads to answer.
keyword: Apple Intelligence
date: 2026-10-06
updated: 2026-10-06
written: 2026-09-29
author: Rankbox Team
tags: AI Search, Apple
---

In iOS 18 and iOS 26, Apple Intelligence handled most requests with Apple's own models, either on the iPhone or on Apple's Private Cloud Compute servers, and Siri offered to pass some questions to ChatGPT after asking you first. iOS 27 changed the default path. With Siri AI, in beta since 14 September 2026, Apple's own guide says nothing is sent to ChatGPT until you ask for ChatGPT, so Siri now answers most questions itself, from Apple's models and the web.

You may have read that "over a billion iPhone users" now have Siri delegating to ChatGPT. Apple has never published that figure. What Apple does say is narrower: Apple Intelligence needs an iPhone 15 Pro, iPhone Air or iPhone 16 or later, the ChatGPT extension stays off until you set it up, and [Siri AI is an English-only beta](https://support.apple.com/en-us/127893) with a waitlist that isn't yet offered on iPhone in the EU or in China.

That matters if you sell software or services. When an iPhone owner asks Siri what to buy, the answer can come through three routes: Siri AI's own answer, a handoff to ChatGPT, or Apple's own places and apps. Each one reads different sources. This post maps the routing by release, shows what Applebot reads, and gives you a checklist for being the name Siri says. For the full feature list, see [what Apple Intelligence does in 2026](/blog/what-does-apple-intelligence-do). For the ChatGPT side, see [how ChatGPT search decides citations](/blog/how-chatgpt-search-decides-citations).

## Key Takeaways

- In iOS 18 and iOS 26, Siri decided when ChatGPT might help and asked before sending anything. Starting a request with "Ask ChatGPT" skipped the confirmation.
- In iOS 27, Siri AI sends a request to ChatGPT only after you ask for ChatGPT, per Apple's iPhone User Guide. Siri Classic, still offered in iOS 27, keeps the older suggest-and-confirm behavior.
- Apple Intelligence decides for itself whether a task runs on device or on Private Cloud Compute. You can see the server requests in an Apple Intelligence Report under Privacy & Security.
- Siri AI runs on Apple Foundation Models that Apple says were built in collaboration with Google's Gemini models. Gemini isn't a separate place Siri sends your question.
- Apple names one web source for Siri's world knowledge answers: Applebot's crawl. The `nosnippet` tag and `isAccessibleForFree: false` markup both keep a page out of that context.
- Blocking Applebot-Extended only opts you out of model training. Blocking Applebot itself removes you from Siri, Spotlight and Safari search.
- Being recommended by Siri takes three kinds of work: pages Applebot can read, pages ChatGPT search can cite, and a correct Apple Business place card or App Intents for your app.

## How Siri's Handoff to ChatGPT Changed From iOS 18 to iOS 27

The title of this post names iOS 18 and iOS 26 because that's when the ChatGPT handoff took shape. Apple skipped from iOS 18 to [iOS 26](https://www.apple.com/newsroom/2025/06/apple-elevates-the-iphone-experience-with-ios-26/) in 2025, and in September 2026 it shipped what it calls [the 2027 software releases](https://www.apple.com/newsroom/2026/09/siri-ai-a-profoundly-more-capable-and-personal-assistant-is-here/), including iOS 27. The routing is different in each.

### iOS 18: an opt-in extension that asked first

Apple announced the ChatGPT integration on 10 June 2024. In its [launch press release](https://www.apple.com/newsroom/2024/06/introducing-apple-intelligence-for-iphone-ipad-and-mac/), Apple said Siri "can tap into ChatGPT's expertise when helpful," and users "are asked before any questions are sent to ChatGPT." The screenshot showed Siri replying: "Do you want me to use ChatGPT to do that?"

It shipped with [iOS 18.2 in December 2024](https://www.apple.com/newsroom/2024/12/apple-intelligence-now-features-image-playground-genmoji-and-more/). Siri could suggest ChatGPT for certain requests and show the answer itself, and Writing Tools gained a Compose option powered by ChatGPT. No ChatGPT account was needed. OpenAI's own [Siri FAQ](https://help.openai.com/en/articles/10263570-apple-intelligence-siri-faq) adds the shortcut: start a request with "Ask ChatGPT" and Siri sends it without the confirmation step.

### iOS 26: more places to reach ChatGPT

In June 2025, Apple [added more ChatGPT touchpoints to Apple Intelligence](https://www.apple.com/newsroom/2025/06/apple-intelligence-gets-even-more-powerful-with-new-capabilities-across-apple-devices/). Visual intelligence could ask ChatGPT about anything on your screen. Image Playground gained ChatGPT styles such as oil painting. Shortcuts could call Apple's models or ChatGPT.

Siri's behavior stayed the same. Apple's [iOS 26 guide](https://support.apple.com/guide/iphone/use-chatgpt-with-apple-intelligence-iph00fd3c8c2/26/ios/26) says: "If Siri determines that ChatGPT would be helpful, it asks if you want to use ChatGPT to fulfill the request." You could turn off the confirmation, but Siri always asked before sending photos or files.

### iOS 27: Siri AI answers on its own

Siri AI is a rebuilt Siri. Apple [introduced it on 8 June 2026](https://www.apple.com/newsroom/2026/06/apple-introduces-siri-ai-a-profoundly-more-capable-and-personal-assistant/) and began a beta in English on 14 September. Apple says it can "go out to the web to get up-to-date information" and answer questions on almost any topic.

The ChatGPT extension is still part of Apple Intelligence in iOS 27, but its rules changed. Apple's [iOS 27 setup page](https://support.apple.com/guide/iphone/turn-on-chatgpt-iph00fd3c8c2/ios) says the option to skip confirmation "isn't available if you're using Siri AI. You must first ask ChatGPT before a prompt, photos, or files are sent to ChatGPT." The setting that stops Siri from suggesting ChatGPT is also missing for Siri AI. Every example prompt on Apple's [iOS 27 Siri and ChatGPT page](https://support.apple.com/guide/iphone/use-siri-to-get-answers-from-chatgpt-iph0193a9d54/ios) starts with "ask ChatGPT."

| Release                    | When                   | Who answers a general question           | When ChatGPT gets it                                                |
| -------------------------- | ---------------------- | ---------------------------------------- | ------------------------------------------------------------------- |
| iOS 18.2                   | December 2024          | Siri, or ChatGPT if you agree            | Siri suggests it and asks; "Ask ChatGPT" skips the prompt           |
| iOS 26                     | September 2025         | Siri, or ChatGPT if you agree            | Siri decides it would help and asks; confirmation can be turned off |
| iOS 27 with Siri Classic   | September 2026         | Siri Classic, or ChatGPT if you agree    | Same suggest-and-confirm settings as iOS 26                         |
| iOS 27 with Siri AI (beta) | From 14 September 2026 | Siri AI, from Apple's models and the web | Only after you ask for ChatGPT                                      |

The last row is the one that matters most. Apple doesn't say whether Siri AI ever suggests ChatGPT on its own. Our reading of the guide is that it doesn't, but that's an inference from missing settings, not a statement from Apple.

![Apple’s next big step for Siri and iPhone](youtube:2PW5y3zAvPE "Apple's June 2026 introduction of Siri AI, a more conversational Siri with natural language abilities.")

## The Apple Intelligence Routing Table for September 2026

Apple publishes no single diagram of where each Apple Intelligence request goes. The table below pieces one together from Apple's newsroom, its iPhone User Guide and its support pages. The last column grades the evidence. "Documented" means Apple states it. "Partly documented" means Apple states some of it and is silent on the rest. "Inference" means we read it from Apple's wording.

| Request                                                                                                                                                                                                                           | Where it runs                                          | Who decides                   | Evidence                                                       |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ----------------------------- | -------------------------------------------------------------- |
| Finding things in your messages, mail, photos and apps                                                                                                                                                                            | On device, through the Spotlight index and App Toolbox | Siri AI's system orchestrator | Documented                                                     |
| [Live Translation](https://www.apple.com/newsroom/2025/06/apple-intelligence-gets-even-more-powerful-with-new-capabilities-across-apple-devices/), [dictation](https://www.apple.com/apple-intelligence/) and many everyday tasks | On device                                              | Apple Intelligence            | Partly documented (Apple names a few tasks, not the full list) |
| Harder requests, Image Playground and Siri AI's server work                                                                                                                                                                       | Private Cloud Compute                                  | Apple Intelligence            | Documented                                                     |
| Siri AI world knowledge questions                                                                                                                                                                                                 | Apple Foundation Models plus information from the web  | Siri AI                       | Documented                                                     |
| Which web pages Siri AI reads                                                                                                                                                                                                     | Applebot's crawl is the one source Apple names         | Not stated                    | Partly documented                                              |
| A request to ChatGPT through Siri AI                                                                                                                                                                                              | OpenAI's servers                                       | You, by asking for ChatGPT    | Documented                                                     |
| A request to ChatGPT through Siri Classic                                                                                                                                                                                         | OpenAI's servers                                       | Siri suggests, you confirm    | Documented                                                     |
| Visual intelligence image search                                                                                                                                                                                                  | Your search provider                                   | You, by tapping search        | Documented                                                     |
| ChatGPT styles in Image Playground, Compose in Writing Tools                                                                                                                                                                      | OpenAI's servers                                       | You, by choosing ChatGPT      | Documented                                                     |

### On device or Private Cloud Compute: how Apple Intelligence decides

You don't pick. Apple's [privacy page for iOS 27](https://support.apple.com/guide/iphone/apple-intelligence-and-privacy-iphe3f499e0e/ios) says that when you make a request, "Apple Intelligence analyzes whether it can be processed on device." If the task needs more computing power, it goes to Private Cloud Compute, where larger models run on Apple silicon servers. Apple says that data isn't stored or made accessible to Apple, and that outside researchers can inspect the server software.

Siri AI, the biggest Apple Intelligence feature in iOS 27, leans on those servers. Apple lists Siri AI among the features that "rely on server-side models" and so carry daily usage limits, with paid access to more usage promised for later. The personal side runs locally: Apple says Siri AI taps the Spotlight index and App Toolbox, "which work entirely on device."

You can check the split yourself. Under Settings, then Privacy & Security, the Apple Intelligence Report exports a file of every request your iPhone sent to Private Cloud Compute over the last 15 minutes or seven days.

### When Apple Intelligence hands a question to ChatGPT

Only when you allow it. On iOS 27 the extension sits under Settings, Siri, and with Siri AI you turn it on under Set Up Extensions. Once it's on, ChatGPT receives your request and any attachments you approve, plus your time zone, country, device type, language and the feature you used. Apple's guide says your IP address is hidden from ChatGPT, though your general location is shared for fraud checks and legal compliance.

Without a ChatGPT account, OpenAI must not store your request or use it for training. OpenAI's [data handling page](https://help.openai.com/en/articles/9737562-how-your-data-is-handled-when-you-use-chatgpt-through-apples-integrations) confirms that, and adds that signed-in users fall under their ChatGPT settings. The extension works only where the ChatGPT app and service are offered.

### Where Google's Gemini fits

Apple says the Apple Foundation Models behind Siri AI and the rest of Apple Intelligence were "custom-built in collaboration with Google and its Gemini models" and run on device and on Private Cloud Compute. That describes how Apple built its own models. It doesn't make Gemini a second extension you can hand a question to.

Gemini and Claude do appear in one other place. Apple's [developer announcement](https://www.apple.com/newsroom/2026/06/apple-aids-app-development-with-new-intelligence-frameworks-and-advanced-tools/) says app makers can plug models "like Claude and Gemini" into their own apps through the Foundation Models framework. That's a choice inside third-party apps, not a Siri route. As of 29 September 2026, the iOS 27 user guide lists ChatGPT as the only chatbot extension.

## What Happens Once ChatGPT Has the Question

When Siri passes a question to ChatGPT, OpenAI's ChatGPT service answers it. OpenAI says you can [continue that conversation](https://help.openai.com/en/articles/9737562-how-your-data-is-handled-when-you-use-chatgpt-through-apples-integrations) in the ChatGPT app or website, and that connecting a ChatGPT account unlocks its more powerful models. Neither Apple nor OpenAI says whether extension requests run a web search, so treat that as unknown.

If the answer does use search, OpenAI's rules apply. Its [search help page](https://help.openai.com/en/articles/9237897-chatgpt-search) says ChatGPT may rewrite your question into targeted queries for its search partners, names Microsoft among the providers, and says a site must allow OAI-SearchBot to be eligible. Our [ChatGPT SEO guide](/ai-seo/chatgpt) covers crawler setup, and our explainer on [how ChatGPT search picks the pages it cites](/blog/how-chatgpt-search-decides-citations) covers the citation mechanics.

For you, that means one thing. The ChatGPT route into an iPhone runs through the same work as ChatGPT search on the web. There's no Apple-specific version of it to optimize.

## What Applebot Reads, and the Tags That Hide You From Siri

Apple doesn't describe how Siri AI chooses web pages. It does describe its crawler. The [About Applebot page](https://support.apple.com/en-us/119829), published 4 September 2026, is the most useful Apple document for anyone who wants Siri to mention them. Our voice search posts cover [the Siri AI rollout](/blog/voice-search-ai-powered) and a [crawler access checklist](/blog/voice-search-optimization-2026), so this section sticks to the controls and what each one does.

### Applebot and Applebot-Extended do different jobs

**Applebot** is the crawler. Its data powers search in Spotlight, Siri and Safari, and Apple says it may also supply "additional context and up-to-date content" when AI models write answers, such as Siri's world knowledge answers with links to sources. Block Applebot and your pages drop out of all of that.

**Applebot-Extended** doesn't crawl at all. It's a robots.txt token that tells Apple whether pages Applebot already fetched may train Apple's foundation models. Disallowing it keeps you in search. That's the setting to use if you want Siri answers without training.

### nosnippet, paywall markup and the Googlebot fallback

Three details on the Applebot page catch sites out:

1. **`nosnippet` removes you from AI answers.** Apple says it won't use content tagged `nosnippet` as context for AI output, and Apple's suggestions to visit that URL show only the page title. It also honors `X-Robots-Tag: applebot: nosnippet` in HTTP headers, which is easy to miss because it isn't in the HTML. Our glossary entry on [snippet controls](/glossary/snippet-controls) explains the tag.
2. **Paywall markup does the same.** Pages marked `isAccessibleForFree: false` can still appear in search results, but Apple won't use them as context for AI answers. If your pricing or docs sit behind that flag, Siri can't draw on them.
3. **Silence means Googlebot's rules.** If robots.txt never mentions Applebot but does mention Googlebot, Applebot follows the Googlebot rules. It ignores `crawl-delay`, and it may render pages in a browser, so blocked JavaScript or CSS can hide content.

| Control                          | What Apple says it does                              | Effect on Siri AI answers                   |
| -------------------------------- | ---------------------------------------------------- | ------------------------------------------- |
| `Disallow` for Applebot          | Stops the crawl                                      | Gone from Siri, Spotlight and Safari search |
| `Disallow` for Applebot-Extended | Opts out of model training only                      | None; pages stay eligible                   |
| `nosnippet` meta tag or header   | No description or web answer; not used as AI context | Page can't feed a world knowledge answer    |
| `isAccessibleForFree: false`     | Eligible for search, not used as AI context          | Page can't feed a world knowledge answer    |
| No Applebot rules                | Applebot follows your Googlebot rules                | Depends on those rules                      |

### The ranking factors Apple lists for its search

Apple is unusually open here. Its Applebot page lists five factors Apple Search "may take into account when ranking web search results":

1. Aggregated user engagement with search results.
2. How well search terms match a page's topics and content.
3. The number and quality of links from other pages.
4. Approximate user location signals.
5. Webpage design characteristics.

Apple adds that these carry "no (pre-determined) importance." Two cautions apply. First, this list covers Apple's web search, not Siri AI's answers, and Apple doesn't say whether Siri AI uses the same ranking. Treat the link as an inference, a reasonable one since both draw on Applebot's crawl. Second, Apple says Applebot-Extended rules play no part in search ranking, so opting out of training carries no documented penalty.

## The Three-Door Siri Audit: How to Be the Recommendation

We call this checklist the Three-Door Siri Audit. When a buyer asks Siri "what's a good invoicing app for a small agency?", your brand can reach the answer through three doors. Door 1 is Siri AI's own answer. Door 2 is the ChatGPT handoff. Door 3 is Apple's own surfaces: place cards for local businesses and App Intents for apps. Score each check pass or fail, and skip checks that don't apply to you.

### Door 1: Siri AI's own answer

| #   | Check                                                                         | How to verify                                                          | Evidence                                             |
| --- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------- |
| 1   | Applebot is allowed on the pages you want quoted                              | Our [robots.txt tester](/tools/robots-txt-tester), user agent Applebot | Documented                                           |
| 2   | Only Applebot-Extended is blocked, if you opt out of training                 | Read robots.txt line by line                                           | Documented                                           |
| 3   | No `nosnippet` in meta tags or `X-Robots-Tag` headers on key pages            | View source, then `curl -I` the URL                                    | Documented                                           |
| 4   | Pricing, comparison and help pages aren't marked `isAccessibleForFree: false` | Search your JSON-LD                                                    | Documented                                           |
| 5   | robots.txt doesn't block the JavaScript and CSS your pages need               | Robots tester on your script and style URLs                            | Documented                                           |
| 6   | Each key page opens with a plain answer naming your product and category      | Read the first two sentences alone                                     | Inference                                            |
| 7   | Other sites link to you and name you in your category                         | A backlink tool, plus a search for your name                           | Partly documented (links are an Apple Search factor) |

### Door 2: the ChatGPT handoff

| #   | Check                                                  | How to verify                          | Evidence                                          |
| --- | ------------------------------------------------------ | -------------------------------------- | ------------------------------------------------- |
| 8   | OAI-SearchBot is allowed in robots.txt and at your CDN | Robots tester, then server logs        | Documented by OpenAI                              |
| 9   | Your pages are indexed in Bing                         | Bing Webmaster Tools URL Inspection    | Partly documented (Microsoft is a named provider) |
| 10  | Pages match the sub-questions buyers ask               | Compare titles with real buyer prompts | Correlated in studies                             |

Check 10 rests on correlation, not an OpenAI statement. In [Ahrefs' April 2026 study of 1.4 million prompts](https://ahrefs.com/blog/why-chatgpt-cites-pages/), the titles of cited pages were closer in meaning to ChatGPT's sub-queries than the titles of pages it retrieved but skipped.

### Door 3: Apple's own surfaces

| #   | Check                                                           | How to verify                          | Evidence   |
| --- | --------------------------------------------------------------- | -------------------------------------- | ---------- |
| 11  | Local businesses: Apple Business place card claimed and correct | Search your name in Apple Maps         | Documented |
| 12  | App makers: key actions exposed through App Intents             | Ask Siri AI to do the task in your app | Documented |

Door 3 needs a short note. Apple says [Apple Business](https://www.apple.com/newsroom/2026/03/introducing-apple-business-a-new-all-in-one-platform-for-businesses-of-all-sizes/), which replaced Business Connect on 14 April 2026, helps companies reach local customers across Apple Maps, Mail, Wallet and Siri. Our guide to [local SEO in ChatGPT and other assistants](/blog/local-seo-in-chatgpt) covers which map each assistant reads, and [optimizing your business for AI search](/blog/optimize-business-for-ai-search) covers the listing work. For apps, Apple's [June developer release](https://www.apple.com/newsroom/2026/06/apple-aids-app-development-with-new-intelligence-frameworks-and-advanced-tools/) says updated App Intents let developers connect apps to Siri AI's personal context, app actions and onscreen awareness. If Siri can act inside your app, you're part of the answer.

In our view, Door 1 carries the most weight for most brands, because Siri AI answers by default for Apple Intelligence users who turn it on. Door 2 opens only when a user names ChatGPT, or accepts Siri Classic's suggestion, and Door 3 only applies if you have a place or an app.

## Worked Example: Tallyfold Runs the Three-Door Audit

Tallyfold is a fictional invoicing and payments app for agencies, with fictional rivals Brindlework and Kestrelyn. Everything below is invented for illustration, including the domain `tallyfold.example`. Tallyfold has a web app and an iPhone app but no office customers visit, so check 11 doesn't apply. That leaves 11 checks.

| Door                    | Applicable checks | Passed | What failed |
| ----------------------- | ----------------- | ------ | ----------- |
| 1: Siri AI's own answer | 7                 | 3      | 1, 3, 4, 6  |
| 2: the ChatGPT handoff  | 3                 | 2      | 10          |
| 3: Apple's own surfaces | 1                 | 0      | 12          |
| **Total**               | **11**            | **5**  | **6 fails** |

Tallyfold scores 5 of 11, or 45%. Here's what went wrong, and why each failure happened:

- **Check 1.** A "block AI bots" template added `Applebot` to robots.txt next to `GPTBot`. The team meant to stop training, so the fix is to block `Applebot-Extended` instead.
- **Check 3.** Someone added `nosnippet` to the pricing page two years ago to hide an old price in search snippets. It now hides pricing from Siri's world knowledge answers.
- **Check 4.** The help center is marked `isAccessibleForFree: false` because it sits behind a login wall for some articles. The public articles inherited the flag.
- **Check 6.** The homepage opens with a slogan, not a sentence saying Tallyfold is an invoicing app for agencies.
- **Check 10.** No page answers "invoicing app for a five-person agency," the prompt buyers actually use.
- **Check 12.** The iPhone app exposes no App Intents, so Siri AI can't create an invoice in it.

The fix order follows reach and effort. Checks 1, 3 and 4 are config changes that take an afternoon and reopen Door 1 for the whole site. Check 6 is a one-paragraph rewrite. Check 10 needs a new page. Check 12 needs a developer sprint.

After the four quick fixes (checks 1, 3, 4 and 6), Tallyfold passes 9 of 11, or 82%. That's 5 + 4 = 9 passes. The new page and the App Intents work bring it to 11 of 11. None of this guarantees a mention. It removes the reasons Siri can't mention Tallyfold.

## How to Test What Siri Says About Your Brand

No Apple tool reports Siri or Apple Intelligence answers to site owners. So you test by asking. Siri AI keeps every conversation in the Siri app, which makes this easier than it was with old Siri.

1. **Check eligibility first.** Siri AI needs iOS 27 on an Apple Intelligence iPhone, such as an iPhone 15 Pro or newer, with English as the device and Siri language. It isn't offered on iPhone in the EU, and it won't work with a mainland China Apple Account. Joining puts you on a waitlist.
2. **Write 10 buyer prompts** without your brand name, such as "best invoicing app for a small design agency." Our free [AI Visibility Prompt Kit](/tools/ai-visibility-prompt-generator) drafts 30 you can adapt.
3. **Ask each one twice.** First as a plain question, which Siri AI answers itself. Then prefixed with "ask ChatGPT," which opens Door 2.
4. **Open the Siri app** and read each answer. Note whether you were named, whether your facts were right, and which sources were linked.
5. **Check your logs** for Applebot and ChatGPT-User hits on the pages you expect to be used. Our [AI crawler directory](/blog/ai-crawler-directory) lists how to verify each bot's IP.

Answers vary from run to run, so repeat the set monthly and compare rates, not single answers. Our guide to [measuring GEO](/blog/how-to-measure-geo) explains how many runs you need before a change is real.

## Where Rankbox Helps

Rankbox covers the writing side of Doors 1 and 2: checks 6 and 10. [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask ChatGPT, Perplexity and Google, with volume, difficulty and intent as model estimates. The [Citation-Ready Writer](/features/citation-ready-writer) then researches the live web and drafts source-backed articles of 2,000 to 3,500 words that open with a plain answer.

It doesn't cover Siri or Apple Intelligence directly. Rankbox doesn't research Siri prompts, change robots.txt or meta tags, manage Apple Business listings or track AI citations. Articles reach your site through its API. The Business plan is $49.50 a month with a 7-day trial; see [pricing](/pricing).

## Frequently Asked Questions

### Does Siri use ChatGPT automatically?

Not with Siri AI. Apple's iOS 27 guide says that with Siri AI, nothing is sent to ChatGPT until you ask for ChatGPT. With Siri Classic, and in iOS 18 and 26, Siri could suggest ChatGPT and ask you to confirm, and you could turn the confirmation off.

### What does Apple Intelligence send to ChatGPT?

When you use the ChatGPT extension, Apple Intelligence sends your request and any files you approve, plus your time zone, country, device type, language and the feature you used. Apple hides your IP address. Without a ChatGPT account, OpenAI must not store the request or train on it.

### Does Siri AI use Google Gemini?

Indirectly. Apple says the Apple Foundation Models behind Siri AI and the rest of Apple Intelligence were built in collaboration with Google and its Gemini models, and they run on the iPhone and on Private Cloud Compute. Gemini isn't offered as a separate Siri extension in the iOS 27 user guide.

### Which iPhones support Apple Intelligence?

As of September 2026, Apple Intelligence in iOS 27 runs on the iPhone 15 Pro, iPhone 15 Pro Max, iPhone Air and every iPhone 16 model or later. The device and Siri language must match a supported language. Siri AI adds an English-only beta with a waitlist.

### Does blocking Applebot-Extended remove my site from Siri?

No. Applebot-Extended only controls whether Apple may train its models on your pages. It doesn't crawl, and Apple says it plays no part in search ranking. Blocking Applebot itself, or tagging pages `nosnippet`, is what removes content from Siri's answers.

### How do I get my business recommended by Siri?

Let Applebot crawl your key pages without `nosnippet`, open each page with a plain answer, and earn mentions and links from sites in your category. Local businesses should claim an Apple Business place card. App makers should expose actions through App Intents.

## References

1. [Siri AI, a profoundly more capable and personal assistant, is here, Apple Newsroom](https://www.apple.com/newsroom/2026/09/siri-ai-a-profoundly-more-capable-and-personal-assistant-is-here/)
2. [Apple introduces Siri AI, Apple Newsroom](https://www.apple.com/newsroom/2026/06/apple-introduces-siri-ai-a-profoundly-more-capable-and-personal-assistant/)
3. [How to get Siri AI, Apple Support](https://support.apple.com/en-us/127893)
4. [Turn on ChatGPT on iPhone (iOS 27), Apple Support](https://support.apple.com/guide/iphone/turn-on-chatgpt-iph00fd3c8c2/ios)
5. [Use Siri to get answers from ChatGPT on iPhone, Apple Support](https://support.apple.com/guide/iphone/use-siri-to-get-answers-from-chatgpt-iph0193a9d54/ios)
6. [Use ChatGPT with Apple Intelligence on iPhone (iOS 26), Apple Support](https://support.apple.com/guide/iphone/use-chatgpt-with-apple-intelligence-iph00fd3c8c2/26/ios/26)
7. [Apple Intelligence and privacy on iPhone, Apple Support](https://support.apple.com/guide/iphone/apple-intelligence-and-privacy-iphe3f499e0e/ios)
8. [About Applebot, Apple Support](https://support.apple.com/en-us/119829)
9. [Introducing Apple Intelligence for iPhone, iPad, and Mac, Apple Newsroom](https://www.apple.com/newsroom/2024/06/introducing-apple-intelligence-for-iphone-ipad-and-mac/)
10. [Apple Intelligence now features Image Playground, Genmoji, and more, Apple Newsroom](https://www.apple.com/newsroom/2024/12/apple-intelligence-now-features-image-playground-genmoji-and-more/)
11. [Apple Intelligence gets even more powerful with new capabilities across Apple devices, Apple Newsroom](https://www.apple.com/newsroom/2025/06/apple-intelligence-gets-even-more-powerful-with-new-capabilities-across-apple-devices/)
12. [Apple accelerates app development with new intelligence frameworks and advanced tools, Apple Newsroom](https://www.apple.com/newsroom/2026/06/apple-aids-app-development-with-new-intelligence-frameworks-and-advanced-tools/)
13. [Introducing Apple Business, Apple Newsroom](https://www.apple.com/newsroom/2026/03/introducing-apple-business-a-new-all-in-one-platform-for-businesses-of-all-sizes/)
14. [How to get the next generation of Apple Intelligence, Apple Support](https://support.apple.com/en-us/121115)
15. [Private Cloud Compute: A new frontier for AI privacy in the cloud, Apple Security Research](https://security.apple.com/blog/private-cloud-compute/)
16. [Apple Intelligence - Siri FAQ, OpenAI Help Center](https://help.openai.com/en/articles/10263570-apple-intelligence-siri-faq)
17. [How your data is handled when you use ChatGPT through Apple's integrations, OpenAI Help Center](https://help.openai.com/en/articles/9737562-how-your-data-is-handled-when-you-use-chatgpt-through-apples-integrations)
18. [Searching the web with ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/9237897-chatgpt-search)
