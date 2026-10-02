---
title: Cloudflare AI Bot Management: Blocking Scrapers vs. Preserving Citations
description: Cloudflare AI bot management after the 15 September 2026 changes: what each setting blocks, which bots it hits, and how to stop training but keep citations.
keyword: Cloudflare AI bot management
date: 2026-10-29
updated: 2026-10-29
written: 2026-10-01
author: Rankbox Team
tags: Technical SEO, AI Search
---

Cloudflare AI bot management now comes down to three controls, Search, Agent and Training, plus AI Crawl Control for single crawlers and your plan's bot product. To block training scrapers and still get cited, set Training to Disallow AI Training, leave Search and Agent on Allow, and check the result in AI Crawl Control. The setting to avoid is Training on Block, which since 15 September 2026 also stops Googlebot, Bingbot and Applebot.

The old one-click switch is on its way out. Cloudflare launched it in July 2024 as a toggle [labeled "AI Scrapers and Crawlers"](https://blog.cloudflare.com/declaring-your-aindependence-block-ai-bots-scrapers-and-crawlers-with-a-single-click/), later renamed it Block AI bots, and on 15 September 2026 [announced its deprecation](https://blog.cloudflare.com/accountable-mixed-use-ai-crawlers/) in favor of the three controls. Zones that had it switched on were moved to new settings, and one of those moves can cost you live citations from ChatGPT and Perplexity on pages that carry ads.

Most sites only want to stop one thing. Cloudflare says fewer than 1% of its sites block Search bots, while 17% use some way to block training. This guide to Cloudflare AI bot management walks the settings screen by screen, maps each one to the bots it reaches, and gives you a decision path by goal. For firewall rules and challenge problems, see [the Cloudflare challenge trap](/blog/cloudflare-challenge-trap).

Two shorter guides go deeper on single questions: [how Cloudflare classifies AI bots and where to see them](/blog/cloudflare-ai-bots), and [the step-by-step way to block AI bots in Cloudflare without losing AI search traffic](/blog/block-ai-bots-cloudflare).

## Key Takeaways

- Cloudflare AI bot management runs on three behavior controls (Search, Agent and Training) for every plan, including Free. Each can Allow, Block on pages with ads, or Block. Training adds a fourth choice, Disallow AI Training.
- Since 15 September 2026, Training on Block also blocks Googlebot, Bingbot and Applebot. Disallow AI Training keeps those three crawling for search and blocks training-only crawlers such as GPTBot and ClaudeBot.
- Zones that had the old Block AI bots toggle on were moved to Training: Disallow AI Training and Agent: Block on pages with ads. That second setting stops ChatGPT-User and other live fetchers on any page Cloudflare detects as showing ads.
- New domains get one of two presets at signup. A site that doesn't run ads gets no blocks. A site that does gets Disallow AI Training and an Agent block on ad pages.
- Cloudflare says Disallow AI Training will pass a no-training preference to Bing through robots.txt once Microsoft ships support, targeted for early 2027. Bing's own opt-out tag, NOARCHIVE, also removes a page from Copilot answers.
- Cloudflare's AI bot transparency table listed Perplexity as not verified on 1 October 2026, so allowing verified bots doesn't vouch for PerplexityBot.
- Blocking a search or assistant bot costs you citations from that engine. Blocking a training crawler doesn't change today's answers.

## What Changed in Cloudflare AI Bot Management on 15 September 2026

Cloudflare rebuilt its AI controls twice in 2026. On 1 July it [replaced the single training block](https://blog.cloudflare.com/content-independence-day-ai-options/) with three presets, so any customer could treat search crawlers, live assistants and training crawlers differently. On 15 September it changed what "Block" means for training and added a softer option.

### The plan's toggle, and what it really did

The worry behind this post is a one-click switch that quietly removes you from AI answers. Here's the record as of 1 October 2026:

- **July 2024:** a toggle called AI Scrapers and Crawlers, under Security, then Bots, on every plan.
- **July 2025:** a [new choice](https://blog.cloudflare.com/control-content-use-for-ai-training/) between blocking everywhere or only on pages with ads. Cloudflare's docs call the setting Block AI bots.
- **Up to September 2026:** Cloudflare's [Block AI Bots page](https://developers.cloudflare.com/bots/additional-configurations/block-ai-bots/) says the legacy option blocked verified bots classified as crawling for AI training, plus similar unverified bots, and excluded bots that do both search and training.

So the toggle, as documented, aimed at training crawlers. It wasn't documented to block OAI-SearchBot or PerplexityBot, which Cloudflare files as search. The real risk to citations now sits in the controls that replaced it, and in the migration.

### How existing zones were migrated

Cloudflare's 15 September post gives two migration tables. For zones that only ever used the old toggle:

| Old Block AI bots setting | New Search | New Training         | New Agent               |
| ------------------------- | ---------- | -------------------- | ----------------------- |
| Off                       | Allow      | Allow                | Allow                   |
| Block (everywhere)        | Allow      | Disallow AI Training | Block on pages with ads |
| Block on pages with ads   | Allow      | Disallow AI Training | Block on pages with ads |

Zones that had already set the three controls keep their Search and Agent choices. A Training choice of Block, or Block on pages with ads, became Disallow AI Training. The post says most owners need to do nothing. On the training side of Cloudflare AI bot management, that's true. It isn't true for the Agent row if your pages carry ads and you want ChatGPT to read them on request.

### What new domains get

From 15 September, Cloudflare offers new domains one of two presets during onboarding, depending on whether the site earns money from ads:

| Setting             | Site without ads | Site monetized with ads |
| ------------------- | ---------------- | ----------------------- |
| Bot Preference Sync | On               | On                      |
| Search              | Allow            | Allow                   |
| Training            | Allow            | Disallow AI Training    |
| Agent               | Allow            | Block on pages with ads |

You can change any of these during onboarding or later. One caution on sources: on 1 October 2026, Cloudflare's Block AI Bots docs page still read "Last updated Jul 1, 2026" and described the July plan for Cloudflare AI bot management defaults. A headless Chrome render showed the same text. The 15 September blog post is newer, so this guide follows it.

## The Settings Screen, Control by Control

Cloudflare AI bot management lives in two places in the dashboard: Security Settings, filtered to Bot traffic, and the AI Crawl Control section. Here's what each screen holds and which bots it reaches.

### Search, Agent and Training

Cloudflare defines the three behaviors on its [bots concept page](https://developers.cloudflare.com/bots/concepts/bot/):

- **Search** collects or indexes your content so it can answer questions about it later. Cloudflare no longer separates AI search from classic search, so this covers OAI-SearchBot and Claude-SearchBot as well as search engines.
- **Agent** acts in real time for a person, such as chat fetch bots and browser-use agents. Cloudflare's July post names ChatGPT-User as an example.
- **Training** crawls content to train or fine-tune a model, including crawlers that also do search.

Cloudflare's [docs](https://developers.cloudflare.com/bots/additional-configurations/block-ai-bots/) say each blocking option stops verified bots classified with that behavior, plus similar unverified bots. Per the [15 September post](https://blog.cloudflare.com/accountable-mixed-use-ai-crawlers/), each control takes Allow, Block on pages with ads, or Block. Training alone adds Disallow AI Training. That option publishes a no-training line in robots.txt, keeps "Accountable" mixed-use crawlers in for search, and blocks every other training crawler, including the training-only crawlers run by Amazon, Anthropic, Meta and OpenAI. Cloudflare counts Apple, Google and Microsoft as Accountable.

There's no Disallow on pages with ads. Cloudflare says the list of ad pages is too large and changes too often to write into robots.txt. There's also no Disallow for Agent yet.

### Bot Preference Sync, managed robots.txt and Content Signals

[Bot Preference Sync](https://blog.cloudflare.com/bot-preference-sync/), announced on 21 August 2026 for all plans, writes your Search, Agent and Training choices into robots.txt. It prepends its block to any file you already serve, so your own rules stay. It replaces the older managed robots.txt, which Cloudflare's [docs](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/) still list under the name "Set your preference to block training in robots.txt."

Both add Content Signals, a comment block plus a line such as `Content-signal: search=yes, ai-train=no, use=reference`. These are statements of preference. A crawler that ignores robots.txt ignores them too, which is why the edge block matters. Zones on the Free plan that serve no robots.txt of their own show Cloudflare's Content Signals Policy text by default.

### AI Crawl Control

[AI Crawl Control](https://developers.cloudflare.com/ai-crawl-control/) is on every plan. Its Crawlers tab lists each AI crawler with its category, requests and robots.txt violations, and an Action you can set to Allow or Block. Cloudflare's [management guide](https://developers.cloudflare.com/ai-crawl-control/features/manage-ai-crawlers/) says:

- On Free, it spots crawlers by user agent only. Paid plans can use Bot Management detection IDs.
- Each block adds to one WAF custom rule named "AI Crawl Control," placed after your other custom rules.
- Paid plans can choose a 403 or a 402 response for blocked crawlers.

The Directives tab, renamed from Robots.txt in April 2026, lists crawlers that requested paths your robots.txt disallows. That's the fastest way to find a bot that ignores your file.

### Pay per crawl and Pay Per Use

[Pay per crawl](https://developers.cloudflare.com/ai-crawl-control/features/pay-per-crawl/what-is-pay-per-crawl/) answers crawlers with a 402 and a price, and lets a paying crawler through with a 200. It was still in closed beta on 1 October 2026. Any WAF or Bot Management block overrides its "charge" action, so a blocked crawler never reaches the payment step. On 30 September, Cloudflare put [Pay Per Use](https://blog.cloudflare.com/pay-per-use/) into beta, where AI companies pay when they use content rather than when they crawl it.

### Verified bots and signed agents

Cloudflare's [verified bots page](https://developers.cloudflare.com/bots/concepts/bot/verified-bots/) sets two bars: honest identity (a Web Bot Auth signature, a published IP list with a stable user agent, or reverse DNS) and no abuse, including obeying robots.txt. Since 1 July 2026, signed agents count as verified too. The big change is what "verified" means. Cloudflare's July post says verified no longer means allowed by default. It makes a bot allowable, and your Search, Agent and Training choices decide.

### Bot Fight Mode and Super Bot Fight Mode

[Bot Fight Mode](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/) is the Free plan's switch. It challenges traffic that matches known bot patterns, and Cloudflare's docs say Skip rules have no effect on it. [Super Bot Fight Mode](https://developers.cloudflare.com/bots/get-started/super-bot-fight-mode/) on Pro and up adds groups for definitely automated, likely automated (Business and up) and verified bots, and it does accept Skip rules. Neither is part of Cloudflare AI bot management as such, but both meet AI crawlers that Cloudflare doesn't verify.

## Cloudflare AI Bot Management Settings at a Glance

This table is the whole Cloudflare AI bot management screen on one page, as of 1 October 2026. "Hits" uses Cloudflare's behavior labels.

| Setting and where it lives           | Default                                                                               | Plans        | Bots it hits                                                                        | Citation risk                            |
| ------------------------------------ | ------------------------------------------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------- | ---------------------------------------- |
| Search control (Security Settings)   | Allow for new domains; migrated zones keep Allow unless set                           | All          | OAI-SearchBot, Claude-SearchBot and search engines such as Googlebot and Bingbot    | Severe if set to Block                   |
| Agent control (Security Settings)    | Allow, or Block on pages with ads for ad-funded new domains and migrated toggle users | All          | ChatGPT-User, Claude-User, Perplexity-User, browser agents                          | Live fetches fail on the pages it covers |
| Training control (Security Settings) | Allow, or Disallow AI Training for ad-funded new domains and migrated zones           | All          | GPTBot, ClaudeBot, CCBot, Bytespider; Googlebot, Bingbot and Applebot only on Block | Low on Disallow, severe on Block         |
| Bot Preference Sync                  | On for new domains                                                                    | All          | Writes robots.txt lines for blocked or disallowed groups                            | Low; check what it lists                 |
| Managed robots.txt (legacy)          | Off unless you enabled it                                                             | All          | Training tokens such as GPTBot and Google-Extended                                  | Low                                      |
| AI Crawl Control, per crawler        | Allow until you block one                                                             | All          | Any crawler in its list                                                             | Only for the bots you block              |
| Pay per crawl                        | Off; closed beta                                                                      | Beta members | Crawlers set to Charge get a 402                                                    | High if a search bot won't pay           |
| Super Bot Fight Mode, Verified bots  | Allow (verified bots have been excluded from default configurations)                  | Pro and up   | Every verified bot, AI or not                                                       | Severe if set to Block                   |
| Bot Fight Mode                       | Off until you turn it on                                                              | Free         | Simple bots from cloud hosts                                                        | Unverified bots can be challenged        |
| AI Labyrinth                         | Off until you turn it on                                                              | All          | Crawlers that follow its hidden nofollow links                                      | None for compliant bots                  |
| Redirects for AI Training            | Off                                                                                   | Pro and up   | Verified AI Crawler category only                                                   | None for search                          |

Two rows need a note. [AI Labyrinth](https://developers.cloudflare.com/bots/additional-configurations/ai-labyrinth/) only traps crawlers that ignore no-crawl instructions, and its events are not mitigations. [Redirects for AI Training](https://developers.cloudflare.com/ai-crawl-control/reference/redirects-for-ai-training/) sends verified training crawlers to your canonical URL, while search engines and AI assistants see the page unchanged.

## Which Bots Each Cloudflare AI Bot Management Control Reaches

Cloudflare AI bot management acts on behaviors, not names. This table maps the bots that decide AI answers to the control that can stop them. Categories come from Cloudflare's [bot reference](https://developers.cloudflare.com/ai-crawl-control/reference/bots/) and its Radar directory. For every user agent and IP list, see our [AI crawler directory](/blog/ai-crawler-directory).

| Bot                                                          | Vendor's purpose              | Stopped by                                      | Kept by                            |
| ------------------------------------------------------------ | ----------------------------- | ----------------------------------------------- | ---------------------------------- |
| [OAI-SearchBot](/glossary/oai-searchbot)                     | ChatGPT search results        | Search: Block                                   | Search: Allow                      |
| Claude-SearchBot                                             | Claude search quality         | Search: Block                                   | Search: Allow                      |
| [PerplexityBot](/glossary/perplexitybot)                     | Perplexity search results     | Search: Block; bot defenses if unverified       | Search: Allow plus a WAF exception |
| ChatGPT-User, Claude-User, Perplexity-User                   | Pages read when a person asks | Agent: Block, or Block on pages with ads        | Agent: Allow                       |
| [GPTBot](/glossary/gptbot), [ClaudeBot](/glossary/claudebot) | Model training                | Training: Disallow AI Training or Block         | Training: Allow                    |
| Googlebot, Bingbot, Applebot                                 | Search, and training data     | Search: Block, or Training: Block               | Training: Disallow AI Training     |
| Bytespider, CCBot                                            | Training or open datasets     | Training controls, AI Crawl Control, a WAF rule | Training: Allow                    |

### The Perplexity gap

On 1 October 2026, the AI bot transparency table on [Cloudflare Radar's AI Insights](https://radar.cloudflare.com/ai-insights) listed Perplexity as not verified and ByteDance as failing all three checks. OpenAI, Anthropic, Meta and Amazon passed all three. That matters for Perplexity in two ways. A "Verified bots: Allow" setting doesn't cover PerplexityBot. And any defense that challenges unverified automation can meet it. Perplexity's own [crawler docs](https://docs.perplexity.ai/docs/resources/perplexity-crawlers) ask you to allow its published IP ranges in your WAF. Our [challenge trap guide](/blog/cloudflare-challenge-trap) has a rule that pairs its user agent with those IPs.

### Live fetchers carry the most risk

Radar's directory page for [ChatGPT-User](https://radar.cloudflare.com/bots/directory/chatgpt-user) showed 31.3% of its requests across Cloudflare getting a 403 in the seven days to 1 October 2026. For [OAI-SearchBot](https://radar.cloudflare.com/bots/directory/oai-searchbot) the figure was 12.8%. Those are network-wide numbers, not yours. They show where blocks pile up: on the bot that reads your page while a buyer waits.

## The Citation-Safe Path: Settings by Goal

The Citation-Safe Path is our decision table for Cloudflare AI bot management. Pick the row that matches what you want, set the controls it lists, and read the last column before you save. That column is what you give up.

| Your goal                                        | Search | Agent                   | Training                       | Extra steps                                                   | What you give up                                      |
| ------------------------------------------------ | ------ | ----------------------- | ------------------------------ | ------------------------------------------------------------- | ----------------------------------------------------- |
| 1. Be found and quoted everywhere                | Allow  | Allow                   | Allow                          | Block single trainers by name in AI Crawl Control if you like | Nothing in AI answers                                 |
| 2. Block training, keep AI search and assistants | Allow  | Allow                   | Disallow AI Training           | Check the synced robots.txt; decide on Bing                   | Gemini app grounding if Google-Extended is disallowed |
| 3. Ad-funded: protect page views                 | Allow  | Block on pages with ads | Disallow AI Training           | Keep tools and docs pages free of ad code                     | Live ChatGPT, Claude and Perplexity reads of ad pages |
| 4. Charge AI companies                           | Allow  | Allow                   | Allow, then Charge per crawler | Join the pay per crawl or Pay Per Use beta                    | Citations from any search bot that won't pay          |
| 5. Keep out all AI, search engines included      | Block  | Block                   | Block                          | Expect Google, Bing and Apple search traffic to stop          | Almost everything                                     |

### How to pick a row

1. **No ads on the pages you want quoted?** Row 1 or row 2 fits most SaaS, ecommerce and local service sites.
2. **Training worries you more than discovery?** Row 2 stops training crawlers without touching a search engine.
3. **Ads pay the bills?** Row 3 protects ad views. Keep ad code off the pages you want assistants to read.
4. **Content worth paying for?** Row 4 is a beta. A search bot that won't pay drops out of answers that would have cited you.
5. **Thinking about row 5?** Fewer than 1% of Cloudflare sites block Search. If you only meant to stop scrapers, go back to row 2.

### Three settings that look safe and aren't

- **Training on Block.** It reads like a stronger Disallow. Since 15 September it also blocks Googlebot, Bingbot and Applebot from your whole site.
- **Search on Block to stop "AI search scrapers."** Cloudflare treats AI search and classic search as one behavior, so the block reaches search engines too.
- **NOARCHIVE to opt out of Bing training.** Until Bing reads Cloudflare's robots.txt line, Cloudflare points to NOARCHIVE. But [Bing's webmaster guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a) say NOARCHIVE "prevents content from being used in Copilot responses and grounding results." Use it only on pages you don't need quoted in [Copilot](/ai-seo/copilot).

Row 2 has one more trade-off. Google says [Google-Extended](/glossary/google-extended) controls training and "grounding" in Gemini Apps, while having no effect on Google Search. If your synced robots.txt disallows Google-Extended, expect less use of your pages in Gemini app answers. Search, AI Overviews and AI Mode aren't affected. For hand-written templates for each goal, see our [AI crawler robots.txt guide](/blog/ai-crawler-robots-txt-guide).

## Worked Example: Tallyfold's Two-Setting Mistake

Tallyfold is a made-up invoicing app for agencies, on Cloudflare's Pro plan at tallyfold.example. Its free invoice-template gallery carries display ads that fund the free tier. The numbers below are illustrative, but the arithmetic is real.

### How the zone drifted

Tallyfold's Cloudflare AI bot management changed three times in a year, and only one change was deliberate.

1. **2025:** marketing switched on Block AI bots, set to block everywhere, to keep GPTBot out.
2. **15 September 2026:** Cloudflare's migration set Training to Disallow AI Training, which was fine, and Agent to Block on pages with ads, which nobody noticed.
3. **22 September 2026:** an engineer read "Disallow" as weaker than the old block and changed Training to Block.

### What AI Crawl Control and Security Analytics showed

The team pulled seven days of data, 23 to 29 September:

| Bot             | Requests | Unsuccessful | Success rate |
| --------------- | -------- | ------------ | ------------ |
| ChatGPT-User    | 2,400    | 1,560        | 35.0%        |
| Perplexity-User | 600      | 390          | 35.0%        |
| Claude-User     | 200      | 130          | 35.0%        |
| OAI-SearchBot   | 1,900    | 19           | 99.0%        |
| Googlebot       | 9,800    | 9,800        | 0.0%         |

Every failed live fetch hit a template page with ads. That's 2,080 of 3,200 assistant reads lost, or 65%. Googlebot failed on every request after the 22 September change. OAI-SearchBot was fine, because Search stayed on Allow. Its 19 failures were 404s.

### The fix, in order

1. Set Training back to Disallow AI Training. Googlebot, Bingbot and Applebot crawl again, and GPTBot and ClaudeBot stay blocked.
2. Set Agent to Allow. The template gallery is Tallyfold's biggest signup source, so an assistant reading it is worth more than an ad view.
3. Open tallyfold.example/robots.txt and confirm the synced block lists the training tokens it expects.
4. Leave NOARCHIVE off the templates, so they stay eligible for Copilot answers.

The next week, the three assistant bots made 3,370 requests and 50 failed, all 404s from retired templates. That's a 98.5% success rate, up from 35.0%. Googlebot was back to normal within a day.

Fixing Cloudflare AI bot management doesn't win citations on its own. It puts Tallyfold's pages back in the pool that answers are written from. Our guide to [measuring AI referral traffic in GA4](/blog/how-to-measure-ai-referral-traffic-in-ga4) covers where those visits show up.

## Where Rankbox Fits Once the Settings Are Right

Rankbox doesn't run a CDN, manage Cloudflare settings or robots.txt for you, and it doesn't track AI citations today. For access checks, use our free [AI search readiness check](/tools/ai-search-readiness-check) and [AI crawler log analyzer](/tools/ai-crawler-log-analyzer), or draft a file with the [AI crawler robots.txt generator](/tools/ai-robots-txt-generator), which groups bots by job: search, live fetch and training.

What Rankbox does is write the pages your newly allowed bots will read. Answer-Space Research maps the questions buyers ask ChatGPT, Perplexity and Google, and the [Citation-Ready Writer](/features/citation-ready-writer) turns them into source-backed articles of 2,000 to 3,500 words that reach your site through Rankbox's API. The Business plan is $49.50 a month with a 7-day trial: [see pricing](/pricing).

## Frequently Asked Questions

### Does Cloudflare block AI bots by default?

It depends on when and how the zone was set up. Since 15 September 2026, a new domain that says it runs ads starts with Training on Disallow AI Training and Agent blocked on ad pages. A new domain without ads starts with no blocks. Older zones keep their own choices, migrated from the old Block AI bots toggle if they used it.

### What happened to Cloudflare's Block AI bots toggle?

Cloudflare is retiring it in favor of the Search, Agent and Training controls. Zones that had it on were moved to Search: Allow, Training: Disallow AI Training and Agent: Block on pages with ads. Check the Agent setting first if assistants can't read your pages.

### Does Disallow AI Training block Googlebot?

No. Disallow AI Training keeps Googlebot, Bingbot and Applebot crawling for search, because Cloudflare rates Google, Microsoft and Apple as Accountable. Training on Block is different. Since 15 September 2026 it blocks all three from your whole site, search included.

### Will Cloudflare AI bot management remove my site from ChatGPT search?

Only if you block OAI-SearchBot. Cloudflare AI bot management files it under Search, so it stays allowed unless Search is set to Block, someone blocks it by name in AI Crawl Control, or a firewall rule catches it. Blocking GPTBot through the Training control doesn't affect ChatGPT search.

### Is Cloudflare AI bot management available on the free plan?

Yes. The core of Cloudflare AI bot management works on Free: the three controls, Bot Preference Sync and AI Crawl Control. Free plans spot crawlers by user agent only, show 24 hours of crawler metrics, and get Bot Fight Mode, which Skip rules don't affect.

### Does Cloudflare block PerplexityBot?

Not by name, unless you choose to. But for Cloudflare AI bot management purposes, Radar listed Perplexity as not verified on 1 October 2026, so verified-bot allowances don't cover it. If Security Analytics shows PerplexityBot challenged, add a WAF exception that matches its user agent and published IP ranges.

## References

1. [Have it both ways: stay discoverable in search while disallowing AI training, Cloudflare](https://blog.cloudflare.com/accountable-mixed-use-ai-crawlers/)
2. [Your site, your rules: new AI traffic options for all customers, Cloudflare](https://blog.cloudflare.com/content-independence-day-ai-options/)
3. [Say it once: introducing Bot Preference Sync, Cloudflare](https://blog.cloudflare.com/bot-preference-sync/)
4. [Declare your AIndependence: block AI bots, scrapers and crawlers with a single click, Cloudflare](https://blog.cloudflare.com/declaring-your-aindependence-block-ai-bots-scrapers-and-crawlers-with-a-single-click/)
5. [Control content use for AI training with Cloudflare's managed robots.txt and blocking for monetized content, Cloudflare](https://blog.cloudflare.com/control-content-use-for-ai-training/)
6. [Block AI Bots, Cloudflare Docs](https://developers.cloudflare.com/bots/additional-configurations/block-ai-bots/)
7. [Bots, Cloudflare Docs](https://developers.cloudflare.com/bots/concepts/bot/)
8. [Verified bots, Cloudflare Docs](https://developers.cloudflare.com/bots/concepts/bot/verified-bots/)
9. [robots.txt setting, Cloudflare Docs](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/)
10. [Manage AI crawlers, Cloudflare Docs](https://developers.cloudflare.com/ai-crawl-control/features/manage-ai-crawlers/)
11. [What is Pay Per Crawl?, Cloudflare Docs](https://developers.cloudflare.com/ai-crawl-control/features/pay-per-crawl/what-is-pay-per-crawl/)
12. [Pay Per Use: when AI uses your work, you should get paid, Cloudflare](https://blog.cloudflare.com/pay-per-use/)
13. [Bot Fight Mode, Cloudflare Docs](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/)
14. [Super Bot Fight Mode, Cloudflare Docs](https://developers.cloudflare.com/bots/get-started/super-bot-fight-mode/)
15. [Bot reference, Cloudflare Docs](https://developers.cloudflare.com/ai-crawl-control/reference/bots/)
16. [AI Insights, Cloudflare Radar](https://radar.cloudflare.com/ai-insights)
17. [Perplexity crawlers, Perplexity Docs](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)
18. [Bing Webmaster Guidelines, Microsoft](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a)
19. [Google's common crawlers, Google](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers)
