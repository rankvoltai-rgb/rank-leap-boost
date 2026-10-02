---
title: Local SEO in ChatGPT: How AI Search Recommends Nearby Businesses
description: Local SEO in ChatGPT and other AI assistants: which map, listing and review sources each one uses, a three-part framework and a near-me prompt test.
keyword: local SEO
date: 2026-10-06
updated: 2026-10-06
written: 2026-09-29
author: Rankbox Team
tags: AI Search, Local SEO
---

Local SEO in ChatGPT runs on different rails from Google Maps. When someone asks for a plumber or a bakery "near me," ChatGPT estimates where they are, rewrites the question into a local search, looks businesses up in listing data from outside providers, and reads ratings and reviews before it names a few options. Yelp is the one listing source with public proof behind it. OpenAI doesn't name a map provider at all.

The stakes are rising fast. In [BrightLocal's March 2026 report](https://www.brightlocal.com/research/lcrs-ai-trust/), 31% of US consumers said they had used ChatGPT for a business recommendation in the past year, and 23% had used Google's AI Mode. Yet the AI shortlist is tiny. [SOCi's 2026 Local Visibility Index](https://www.soci.ai/news/in-ai-driven-discovery-few-brands-are-chosen-most-disappear/), which covered more than 350,000 locations of 2,751 multi-location brands, found that ChatGPT recommended 1.2% of them. The same locations showed up in Google's local 3-Pack 35.9% of the time.

Most local SEO advice still stops at the Google Business Profile. This guide covers the sources each AI assistant uses for "near me" answers as of September 2026, graded by how sure anyone can be. Then it gives a three-part framework, a prompt test and a worked example. For the full business fact sheet and listing audit, see our guide to [optimizing your business for AI search engines](/blog/optimize-business-for-ai-search). For one assistant only, read [how to get cited by ChatGPT as a local business](/blog/how-to-get-cited-by-chatgpt-as-a-local-business). For daily tasks, see [eight ways AI helps small businesses with local SEO](/blog/how-ai-helps-small-businesses-with-local-seo).

## Key Takeaways

- ChatGPT answers "near me" questions from your rough location, a rewritten search, listing data from unnamed providers, reviews and a web check. OpenAI documents the steps and the providers' existence, not their names.
- Yelp is the best-evidenced ChatGPT source. Yelp's August 2026 filing says its ratings and reviews "recently began powering ChatGPT's local experience," and an August test found Yelp data behind ChatGPT's business cards in 95.83% of 2,879 runs.
- The claim that ChatGPT pulls from Apple Maps has no support: the same test found Apple Maps behind 0.00% of those cards. Bing Places may matter through Microsoft's search deal with OpenAI, but nobody documents that link.
- Each assistant reads its own map. Gemini and AI Mode use Google Maps and Business Profiles, Copilot uses Bing Places, and Siri searches Apple Maps, whose place cards you now manage in Apple Business.
- The Three-Pin Framework reaches the assistants Google's profile doesn't: an Apple Business place card, a Bing Places listing, and LocalBusiness JSON-LD with coordinates to five decimal places. For ChatGPT, add a claimed Yelp page.
- Ratings act like a gate. Locations ChatGPT recommended in SOCi's study averaged 4.3 stars. That's a correlation, not a rule anyone has documented.
- Measure local SEO in AI with a fixed set of near-me prompts, run three times per assistant, with the location setting written down.

## How AI Assistants Answer a "Near Me" Question

Classic local SEO is about ranking pins on a map. An AI assistant does something else. It writes a short answer, and to do that it runs a chain of steps. We grade every step in this guide by its evidence:

- **Documented:** the assistant's maker, or its data partner, says so on its own pages or in a filing.
- **Observed:** an independent test saw it. That shows a pattern, not how the system is built.
- **Inferred:** a reasonable guess that nobody has confirmed.

Here is the chain for ChatGPT, which is the assistant most people ask about.

1. **It works out where you are.** ChatGPT uses a rough location from your IP address. Since [26 March 2026](https://help.openai.com/en/articles/6825453-chatgpt-release-notes), people can also share their device location, which is off by default. Saved memories can shape the search too. _Documented._
2. **It rewrites your question.** OpenAI's [search help page](https://help.openai.com/en/articles/9237897-searching-the-web-with-chatgpt) gives the example: "What are some good restaurants near me?" asked from San Francisco becomes "top restaurants San Francisco," which goes to a search partner. This is a form of [query fan-out](/glossary/query-fan-out). _Documented._
3. **It looks up places.** The same page says ChatGPT may share your location with "trusted third-party providers that help provide more local information, such as nearby business listings." It doesn't name them. In August 2026, Suganthan Mohanadasan [logged a separate places lookup](https://www.searchenginejournal.com/chatgpt-rebuilt-its-search-tool-i-read-the-new-language-it-speaks/586710/) in ChatGPT's search calls that takes a location and returns business names. _Documented that providers exist; observed how the lookup runs._
4. **It reads ratings and reviews.** Yelp told investors that its ratings and reviews now power ChatGPT's local answers "in relevant categories." _Documented by Yelp._
5. **It checks the web and writes the answer.** In the same logs, ChatGPT checked each business name with follow-up searches, then drew a map with pins. Your website only joins this step if OpenAI's crawler, OAI-SearchBot, can reach it. _Observed; the crawler rule is documented._

### Why the AI shortlist is so short

A map shows twenty pins. A chat answer names a handful of businesses. That's the gap behind SOCi's 1.2% figure. SOCi also found that in retail, only 45% of the brands most visible in classic local search were among those AI platforms recommended most.

So near-me visibility in AI is its own local SEO job. It isn't a side effect of ranking in the map pack, and a strong Google profile alone won't cover it.

## Which Map, Listing and Review Sources Each Assistant Uses

Every assistant draws on a different map. The table shows what each maker or data partner says, checked on 29 September 2026. It's the heart of local SEO for AI search, because a listing only helps with the assistants that read it.

| Assistant                       | Place data                                                         | Reviews and ratings                                             | Listing you control             | Evidence                                             |
| ------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------- | ------------------------------- | ---------------------------------------------------- |
| ChatGPT                         | Unnamed third-party providers; Microsoft is a named search partner | Yelp ratings and reviews; OpenTable, Resy and Yelp for bookings | Yelp page; your website         | Documented by OpenAI and Yelp; Yelp's share observed |
| Google AI Overviews and AI Mode | Business Profiles and Google's index                               | Not stated separately                                           | Google Business Profile         | Documented                                           |
| Gemini and Ask Maps             | Google Maps                                                        | Reviews from Maps contributors                                  | Google Business Profile         | Documented                                           |
| Microsoft Copilot               | Bing Places and Bing's index                                       | Yelp content in Bing, per Yelp                                  | Bing Places for Business        | Documented                                           |
| Siri and Apple Maps             | Apple Maps, fed by Apple Business and licensed listing data        | Apple ratings; reviews from Yelp                                | Apple Business                  | Documented                                           |
| Perplexity                      | Not stated on Perplexity's pages                                   | Yelp (2024) and Tripadvisor (2025) deals                        | Yelp, Tripadvisor, your website | Announced by partners; current use unknown           |

### Siri: Apple Maps and Apple Business

Apple's iPhone guide tells people to [ask Siri something like "Find coffee near me"](https://support.apple.com/guide/iphone/find-nearby-attractions-restaurants-services-iphbaf51b2c0/ios) to search Apple Maps. You manage your Apple Maps place card in [Apple Business](https://www.apple.com/newsroom/2026/03/introducing-apple-business-a-new-all-in-one-platform-for-businesses-of-all-sizes/), which replaced Apple Business Connect on 14 April 2026 and moved existing data over on its own. Apple says the new platform helps businesses reach customers "across Apple Maps, Mail, Wallet, Siri, and more."

Apple doesn't build its business data alone. Its [Maps acknowledgements page](https://gspe21-ssl.ls.apple.com/html/attribution.html) credits business listings data from Foursquare, Tripadvisor, Yext, Localeze, Uberall and others, plus "Reviews from Yelp." So a wrong fact on your place card can come from one of those feeds, not only from you. For wider web questions, Siri AI (in beta in English since 14 September 2026) can draw on the web and on Applebot's crawl. Our [voice search optimization checklist](/blog/voice-search-optimization-2026) covers the Applebot rules, and our guide to [how Apple Intelligence routes Siri queries](/blog/apple-intelligence-siri-chatgpt) covers when Siri hands a question to ChatGPT.

### Copilot: Bing Places

Microsoft is direct. When it launched AI citation reports in Bing Webmaster Tools, it said [accurate business information matters](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview) "when AI experiences surface answers to location-based queries," and told businesses to register with Bing Places so their details stay "eligible for inclusion in AI-generated responses." Our [Copilot guide](/ai-seo/copilot) covers the rest of Bing's setup.

### Google: one profile for three AI surfaces

Google's [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) says Business Profiles "can help your products and services to be visible in both AI responses and other Google Search results." Gemini [uses public Google Maps data](https://support.google.com/gemini/answer/16622866) for addresses, ratings and hours, and [Ask Maps](https://blog.google/products-and-platforms/products/maps/ask-maps-immersive-navigation/) draws on reviews from more than 500 million contributors. Most businesses have this pin already.

### Perplexity: partner deals, no public list

Perplexity publishes no local source list on its own pages. Its partners do the talking: Yelp data came in [March 2024](https://www.maginative.com/article/perplexity-enhances-ai-search-engine-with-direct-yelp-data-integration/), and Tripadvisor [announced a partnership](https://tripadvisor.mediaroom.com/press-releases?item=126807) in January 2025 covering more than 11 million listings. How much either feeds answers today is unknown, so for local SEO in Perplexity your Yelp and Tripadvisor pages are the parts you can shape.

### ChatGPT: what the evidence supports

A common line in local SEO guides is that ChatGPT pulls local data from Apple Maps, Bing Places and Yelp. The evidence splits three ways.

**Yelp: supported.** Yelp's [quarterly filing for the period to 30 June 2026](https://www.sec.gov/Archives/edgar/data/0001345016/000134501626000066/yelp-20260630.htm) says its "ratings and reviews recently began powering ChatGPT's local experience in relevant categories." Its [August blog post](https://blog.yelp.com/news/yelp-chatgpt-integration/) adds reviews, photos and business details shown in the chat. Then an independent test backed it up. Ben Fisher of Steady Demand ran [2,880 prompts](https://www.steadydemand.com/chatgpts-local-results-arent-coming-from-foursquare-and-probably-never-really-were/) across 12 US metros and 12 business types in one 72-hour window in August 2026. Yelp sat in the data behind ChatGPT's business cards in 95.83% of runs.

**Apple Maps: not supported.** OpenAI never mentions it. In the same test, Apple Maps supplied 0.00% of business-card data and had a 0.14% share of visible citations. Apple Maps matters a lot for Siri. For ChatGPT, nothing public says it matters at all.

**Bing Places: unproven.** Microsoft is a named ChatGPT search partner, and Bing Places feeds Bing. But OpenAI doesn't say that listing data flows through, and Bing had a small share in the test. Claim Bing Places because it's free and feeds Copilot, not because it's proven for ChatGPT.

What about Google? OpenAI doesn't say ChatGPT uses Google data. In the test, Google supplied 4.62% of business-card data. Fisher warns that "citation share is not data influence," so a source can shape answers without showing up. Treat every share above as a snapshot of one month.

## The Three-Pin Framework for Local SEO in AI Search

Most businesses have pin zero of local SEO: a Google Business Profile. The Three-Pin Framework adds the three pieces that reach assistants Google doesn't feed. It covers Apple, Bing and your own markup, grades each one, then adds the one piece the evidence says ChatGPT needs.

| Pin | What you set up                            | Assistants it feeds                                           | Evidence                                                    | Time             |
| --- | ------------------------------------------ | ------------------------------------------------------------- | ----------------------------------------------------------- | ---------------- |
| 1   | Apple Business place card                  | Siri, Apple Maps, Spotlight, Safari                           | Documented by Apple                                         | 30–45 minutes    |
| 2   | Bing Places listing                        | Copilot and Bing Maps; ChatGPT unproven                       | Documented for Copilot; inferred for ChatGPT                | 15–20 minutes    |
| 3   | LocalBusiness JSON-LD with geo coordinates | Google's reading of your site; any crawler that parses schema | Properties documented by Google; use in AI answers inferred | About 30 minutes |
| +   | Claimed Yelp page                          | ChatGPT; Apple Maps reviews; Perplexity                       | Documented by Yelp; observed in tests                       | About 20 minutes |

### Pin 1: Sync your Apple Business place card

1. Sign in at business.apple.com and claim your location. If you used Business Connect, check that your data moved over.
2. Copy your name, address, phone, hours and category from your Google profile. Copy and paste; don't retype.
3. Add photos and a custom action, such as book, order or reserve.
4. Add a showcase if you run a current offer.
5. Check it: search your name in Apple Maps, then ask Siri for your category near your street.

If a fact on the card is wrong and you didn't enter it, check Yelp and the listing feeds Apple credits. Fix the fact at the source, or it may come back.

### Pin 2: Sync your Bing Places listing

1. Go to bing.com/forbusiness. Microsoft moved Bing Places there in [October 2025](https://blogs.bing.com/search/2025/10/Introducing-the-New-Bing-Places-for-Business-Built-for-Business-Owners,-Powered-by-Research/).
2. Import from your Google profile. Microsoft says the new import is better at "preserving key attributes like business name, hours, and contact details."
3. Read every imported field anyway. Imports carry over old errors as faithfully as good data.
4. Verify the listing, then ask Copilot for your category in your town.

### Pin 3: Add LocalBusiness JSON-LD with geo coordinates

Be clear about what this pin does. Google says its AI features need no special markup. No assistant says it reads coordinates from your web page for a near-me answer. So treat the markup as cheap insurance: it helps Google read your details, and it gives every crawler one clean copy of the facts on your listings.

Google's [LocalBusiness docs](https://developers.google.com/search/docs/appearance/structured-data/local-business) set the rules. Use the most specific type. `name` and `address` are required. For `geo`, "the precision must be at least 5 decimal places." Five decimals of latitude is about 1.1 meters, since one degree of latitude spans roughly 111 kilometers. That's enough to put the pin on your door, not the block.

Here's the core for the made-up bike shop in our worked example below:

```json
{
  "@context": "https://schema.org",
  "@type": "BicycleStore",
  "name": "Quillfen Cycle Repair",
  "url": "https://quillfencycles.example",
  "telephone": "+1-509-555-0147",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "240 Larch Row",
    "addressLocality": "Spokane",
    "addressRegion": "WA",
    "postalCode": "99202",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 47.66132,
    "longitude": -117.40415
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "10:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "09:00",
      "closes": "16:00"
    }
  ]
}
```

To get your coordinates, drop a pin on your front door in any map app and copy the numbers it shows. Our free [schema generator](/tools/schema-generator) builds the block from a form, and Google's Rich Results Test checks it.

### The ChatGPT add-on: a claimed Yelp page

The evidence points to one more listing for ChatGPT. Claim your Yelp page, then fix the category, hours and phone. Yelp says its content also reaches Apple Maps and Microsoft Bing, so one fix lands in three assistants' data. Yelp's rules differ from Google's: it asks businesses not to request reviews at all. Our [business listings guide](/blog/optimize-business-for-ai-search) covers each platform's review rules.

## Reviews, Ratings and Local SEO in AI Answers

Stars work like a gate in AI answers. Locations ChatGPT recommended in SOCi's study averaged 4.3 stars. That is a correlation across big chains, not a documented cutoff, and small businesses with fewer reviews may see a different pattern. Customers check, too: in BrightLocal's report, 88% said they fact-check reviews that AI tools cite.

Each assistant reads a different pile of reviews:

- **ChatGPT:** Yelp ratings and reviews, per Yelp's filing.
- **Gemini and Ask Maps:** Google ratings and reviews from Maps.
- **Siri and Apple Maps:** Apple's own ratings, where people tap like or dislike for things like service and quality. The feature [isn't in every country](https://support.apple.com/guide/iphone/rate-places-and-add-photos-iphc3e29e15d/ios). Apple also shows reviews from Yelp.
- **Perplexity:** Yelp and Tripadvisor, per the partner deals.

For local SEO in AI search, track three numbers on each platform every month: your rating, your review count and the date of your newest review. A 4.9 on Google means little to ChatGPT if your Yelp page shows 3.6 from five old reviews.

Apple Maps also asks recent visitors to rate a place on its own, using on-device suggestions. That means your Apple rating grows from real visits, which is one more reason to get the place card right first. How to ask for reviews within each platform's rules is covered in our [business listings guide](/blog/optimize-business-for-ai-search).

## The Near-Me Prompt Test

You can't see inside an assistant, but you can see its answers. That makes testing the most honest part of local SEO for AI. The Near-Me Prompt Test is a fixed set of six prompts that shows which assistants name you and which facts they get wrong. Run it before you change anything, then again four to six weeks after.

| #   | Prompt pattern            | Example for a bike shop                                  | What it tests                               |
| --- | ------------------------- | -------------------------------------------------------- | ------------------------------------------- |
| 1   | Category near me          | "bike repair near me"                                    | The places lookup with your location        |
| 2   | Category plus area        | "bike repair in the South Perry District, Spokane"       | Whether the assistant ties you to your area |
| 3   | Category plus a condition | "bike shop open Saturday near downtown Spokane"          | Your hours across listings                  |
| 4   | Price                     | "how much is a bike tune-up in Spokane"                  | Whether your prices exist in text anywhere  |
| 5   | Best for a need           | "best shop in Spokane to fix an e-bike"                  | Reviews and web mentions                    |
| 6   | Branded fact              | "what time does Quillfen Cycle Repair close on Saturday" | Fact accuracy for your name                 |

### How to run it

1. Pick four assistants your customers use. For most US businesses: ChatGPT, Gemini or AI Mode, Copilot, and Siri with Apple Maps. Add Perplexity if your trade is on Yelp or Tripadvisor.
2. Use a logged-out window, or a ChatGPT [temporary chat](https://help.openai.com/en/articles/8914046-temporary-chat-faq) set to Unpersonalized, so saved memories don't steer the answer.
3. Write down the location setting: IP only, or device location shared. OpenAI says a VPN can move your apparent location.
4. Run each prompt three times per assistant. Answers change between runs.
5. For each answer, record whether you're named, your position, each fact shown, and any source label, such as a Yelp logo.

Score two numbers per assistant. **Mention rate** is the answers that name you divided by the runs of prompts 1–5. **Fact accuracy** is the share of prompt-6 answers that state the fact correctly, with a missing fact counted as a miss. For panel sizes and noise, see our guide on [how to measure GEO](/blog/how-to-measure-geo). Our free [AI Visibility Prompt Kit](/tools/ai-visibility-prompt-generator) drafts extra prompts with a scorecard.

## Worked Example: Quillfen Cycle Repair

Quillfen Cycle Repair is a made-up, two-person bike repair shop in Spokane, Washington (quillfencycles.example). On Google, its local SEO looks strong. Its profile is complete, with 4.8 stars from 212 reviews. It never claimed Apple Business or Bing Places. A customer created its Yelp page years ago, and it shows nine reviews and last year's Saturday hours. The website has no LocalBusiness markup. Every number below is illustrative.

The owner runs the Near-Me Prompt Test. Prompts 1–5 in four assistants, three runs each, make 5 × 4 × 3 = 60 answers. Prompt 6 adds 4 × 3 = 12 more.

| Assistant           | Named in prompts 1–5 (of 15) | Mention rate | Wrong or missing facts                  | Source to fix (from the table above)  |
| ------------------- | ---------------------------- | ------------ | --------------------------------------- | ------------------------------------- |
| Gemini and AI Mode  | 11                           | 73%          | None                                    | Google Business Profile, already done |
| ChatGPT             | 2                            | 13%          | Old Saturday hours on the business card | Yelp page                             |
| Copilot             | 3                            | 20%          | No phone number; old Saturday hours     | Bing Places, unclaimed                |
| Siri and Apple Maps | 4                            | 27%          | No hours on the place card              | Apple Business, unclaimed             |
| **All four**        | **20 of 60**                 | **33%**      |                                         |                                       |

On prompt 6, 7 of 12 answers gave the right Saturday closing time, a fact accuracy of 58%. The four wrong answers from ChatGPT and Copilot each named the old Saturday closing time. The one from Siri gave no hours at all.

The pattern matches the source table, which is the point of doing local SEO per assistant. The assistant fed by the complete Google profile names Quillfen most. The three fed by listings nobody claimed name it least.

### The fix order

| Order | Fix                                                               | Why here                                                | Time       |
| ----- | ----------------------------------------------------------------- | ------------------------------------------------------- | ---------- |
| 1     | Claim Yelp, correct hours and category                            | Feeds ChatGPT, and Yelp reviews also show in Apple Maps | 20 minutes |
| 2     | Claim Apple Business, copy hours, add photos and a "book" action  | Fills the empty Siri place card                         | 40 minutes |
| 3     | Import Bing Places from Google, check the phone and hours, verify | Feeds Copilot                                           | 15 minutes |
| 4     | Add LocalBusiness JSON-LD with geo coordinates                    | One clean copy for every crawler                        | 30 minutes |

That's 20 + 40 + 15 + 30 = 105 minutes, or under two hours of work. Yelp goes first because it's the only fix that reaches more than one assistant. The markup goes last because nobody documents its effect on AI answers.

The owner re-runs the same 72 prompts five weeks later, with the same settings. Local SEO changes take time to reach listing feeds, so an earlier re-test can mislead. The goal isn't a promised score. It's to see whether the three low assistants now name Quillfen, and whether the old Saturday hours are gone.

## Where Rankbox Fits in Local AI Search

Rankbox doesn't do listing-side local SEO. It doesn't claim listings, manage reviews or edit your Apple, Bing or Yelp pages, and it doesn't track AI citations today. The Three-Pin work and the prompt test stay with you. The free Prompt Kit covers the manual test.

What Rankbox does is the website half of local SEO for AI. [Answer-Space Research](/features/answer-space-research) finds the questions customers ask ChatGPT, Perplexity and Google about your trade, with volumes as model estimates. Rankbox then writes sourced articles in your voice that answer them, like "how much does a bike tune-up cost," and they reach your site through Rankbox's API. The Business plan is $49.50 a month with a 7-day free trial. See [how local businesses use Rankbox](/use-cases/local-businesses) or [plans and pricing](/pricing).

## Frequently Asked Questions

### Does ChatGPT use Google Maps for local results?

OpenAI doesn't say it does. Its help pages name Microsoft as a search partner and mention unnamed providers of business listings. In an August 2026 test of 2,879 runs, Google supplied 4.62% of the data behind ChatGPT's business cards, while Yelp appeared in 95.83%. Keep your Google profile current for Google's own AI, not as a ChatGPT fix.

### Does ChatGPT use Apple Maps?

No public evidence says it does. OpenAI doesn't mention Apple Maps, and an August 2026 test found Apple Maps behind 0.00% of ChatGPT's business cards. Apple Maps matters for Siri and Apple's own apps. It also shows Yelp reviews, so fixing Yelp helps in both places.

### How do I get my business recommended by ChatGPT?

Start your local SEO for ChatGPT with Yelp: claim and correct your page. Then keep your website open to OAI-SearchBot, publish your hours, prices and service area in plain text, and earn reviews within each platform's rules. Finally, test with fixed prompts. Our guide to [getting cited by ChatGPT as a local business](/blog/how-to-get-cited-by-chatgpt-as-a-local-business) has the full checklist.

### What replaced Apple Business Connect?

Apple Business replaced it on 14 April 2026. It's free, and existing Business Connect data moved over automatically. It manages your place card in Apple Maps, Safari and Spotlight, plus your branding in Mail and Wallet. Apple lists Siri among the places it helps you reach customers.

### Does local SEO still matter if customers ask AI instead of Google?

Yes, and its reach has grown. Accurate listings, good reviews and a clear website still drive local answers. What changed is where they must be right: Apple Business, Bing Places and Yelp now feed assistants that a Google profile doesn't reach.

### Do I need schema markup for local SEO in AI search?

It isn't required. Google says its AI features need no special markup, and no assistant says it reads coordinates from your page. LocalBusiness JSON-LD still helps Google read your details and gives crawlers one clean copy of your facts, so it's worth half an hour.

## References

1. [Searching the web with ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/9237897-searching-the-web-with-chatgpt)
2. [ChatGPT release notes, OpenAI Help Center](https://help.openai.com/en/articles/6825453-chatgpt-release-notes)
3. [Yelp Inc. Form 10-Q for the quarter ended June 30, 2026, US SEC](https://www.sec.gov/Archives/edgar/data/0001345016/000134501626000066/yelp-20260630.htm)
4. [Yelp brings Reservations and Waitlist to ChatGPT, Yelp](https://blog.yelp.com/news/yelp-chatgpt-integration/)
5. [ChatGPT's local results aren't coming from Foursquare, Steady Demand](https://www.steadydemand.com/chatgpts-local-results-arent-coming-from-foursquare-and-probably-never-really-were/)
6. [ChatGPT rebuilt its search tool, Search Engine Journal](https://www.searchenginejournal.com/chatgpt-rebuilt-its-search-tool-i-read-the-new-language-it-speaks/586710/)
7. [Introducing Apple Business, Apple Newsroom](https://www.apple.com/newsroom/2026/03/introducing-apple-business-a-new-all-in-one-platform-for-businesses-of-all-sizes/)
8. [Find nearby attractions, restaurants, and services in Maps on iPhone, Apple Support](https://support.apple.com/guide/iphone/find-nearby-attractions-restaurants-services-iphbaf51b2c0/ios)
9. [Rate places and add photos in Maps on iPhone, Apple Support](https://support.apple.com/guide/iphone/rate-places-and-add-photos-iphc3e29e15d/ios)
10. [Apple Maps acknowledgements, Apple](https://gspe21-ssl.ls.apple.com/html/attribution.html)
11. [Introducing AI Performance in Bing Webmaster Tools, Microsoft Bing](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview)
12. [Introducing the new Bing Places for Business, Microsoft Bing](https://blogs.bing.com/search/2025/10/Introducing-the-New-Bing-Places-for-Business-Built-for-Business-Owners,-Powered-by-Research/)
13. [AI optimization guide, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
14. [Find places and get directions in Gemini Apps, Gemini Apps Help](https://support.google.com/gemini/answer/16622866)
15. [How we're reimagining Maps with Gemini, Google](https://blog.google/products-and-platforms/products/maps/ask-maps-immersive-navigation/)
16. [Local business structured data, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/local-business)
17. [In AI-driven discovery, few brands are chosen, SOCi](https://www.soci.ai/news/in-ai-driven-discovery-few-brands-are-chosen-most-disappear/)
18. [Nearly half of consumers are asking AI for business recommendations, BrightLocal](https://www.brightlocal.com/research/lcrs-ai-trust/)
19. [Perplexity adds direct Yelp data integration, Maginative](https://www.maginative.com/article/perplexity-enhances-ai-search-engine-with-direct-yelp-data-integration/)
20. [Tripadvisor Group and Perplexity partner, Tripadvisor](https://tripadvisor.mediaroom.com/press-releases?item=126807)
