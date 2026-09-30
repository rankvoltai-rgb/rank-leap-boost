---
title: Does Link Building Still Matter for AI Visibility? The New Rules of "Co-Citation"
description: Link building still matters for AI visibility, but unlinked co-citation matters too. What Google documents, what studies show, and how to audit it.
keyword: co-citation
date: 2026-10-07
updated: 2026-10-07
written: 2026-09-29
author: Rankbox Team
tags: AI Search, Link Building
---

Yes, link building still matters for AI visibility, but it is only half of the job. Links help search engines find, rank and retrieve your pages, and Google and Microsoft both document that. The other half is co-citation: independent pages that name your brand in the same passage as the leaders in your category, with or without a link. That half rests on studies and reasoning, not on any vendor's documentation, so this guide grades each claim by the evidence behind it.

Most advice on the topic splits into two camps. One camp still buys guest posts by the dozen. The other says backlinks are dead because chatbots "don't read links." The data supports neither. In [SE Ranking's study](https://seranking.com/blog/how-to-optimize-for-chatgpt/) of 129,000 domains, referring domains were the strongest predictor of ChatGPT citations. In [Ahrefs' study](https://ahrefs.com/blog/ai-overview-brand-correlation/) of 75,000 brands, branded web mentions tracked AI Overview visibility about three times as closely as backlink counts. Both are correlations, and they measured different things.

This guide defines the terms, grades the evidence, restates Google's link spam rules and gives you a co-citation audit you can run with free tools. For the short, evidence-only answer, read [does link building help with AI visibility](/blog/does-link-building-help-ai-visibility). For the tools side, see our guide to [AI link building without spam](/blog/ai-link-building).

## Key Takeaways

- Links still matter for AI answers mostly upstream. Google and Bing use them to find pages and judge authority, and both say their AI features run on those same systems.
- Co-citation, in its original 1973 sense, means two documents cited together by a third. For brands, it means an independent page naming you next to a category leader.
- No AI vendor documents that unlinked co-citation raises visibility. The case rests on correlation studies and on research showing that language models learn from co-occurring words.
- The studies disagree because they measure different outcomes. Link counts track citations of your URLs better. Mentions track your brand being named.
- Google's link spam policy still applies in full. Paid links that pass ranking credit, excessive link swaps and keyword-anchored links in guest posts are all named.
- The Co-Citation Gap Audit measures one number: the share of pages that name your category leaders and also name you.
- In the fictional Tallyfold example, 10 earned placements would lift that share from 9.8% to 34.1% of the pages AI engines cite.

## What Co-Citation Means, and Where the Term Came From

The word is older than SEO, and SEO has used it loosely.

### From library science to the link graph

Henry Small defined co-citation in a [1973 paper](https://doi.org/10.1002/asi.4630240406) as "the frequency with which two documents are cited together." If many later papers cite A and B together, A and B are probably related, even if no paper says so.

The idea moved to the web in 1999. Jeffrey Dean and Monika Henzinger, then at Compaq's research lab, described a [Cocitation algorithm](<https://doi.org/10.1016/S1389-1286(99)00022-5>) for finding related pages. It "finds other pages that are pointed to by many other pages that all also point to" the page you start from. In the paper's own example, washingtonpost.com counts as related to nytimes.com, since both are online newspapers that the same pages tend to link to.

### How SEO bent the word

In November 2012, Rand Fishkin predicted on Moz that anchor text was weakening and that a new signal would replace it. He first called that signal co-citation. The post now carries a correction: the effect he meant was ["co-occurence (which I mistakenly call 'co-citation' in the video)"](https://moz.com/blog/prediction-anchor-text-is-dying-and-will-be-replaced-by-cocitation-whiteboard-friday).

The same year, Google filed a patent that described an ["implied link"](https://patents.google.com/patent/US8682892B1/en): "a reference to a target resource, e.g., a citation to the target resource," that is "not an express link." SEOs still quote it as proof that Google counts unlinked mentions. Be careful with that. A patent shows an idea Google protected, not a system it runs, and Google Patents lists this one as expired for unpaid fees.

### The definitions this guide uses

| Term                     | What it counts                                                 | Example                                                            | Documented by a vendor?                                                 |
| ------------------------ | -------------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| Backlink                 | A clickable link from another site to yours                    | A review site links to tallyfold.example                           | Yes: Google and Bing both describe how they use links                   |
| Unlinked mention         | Your name on another site, with no link                        | A newsletter names Tallyfold in passing                            | Google says its AI features can show "what's being said" about products |
| Co-occurrence            | Your name and a topic in the same passage                      | "Tallyfold" and "invoicing for agencies" in one paragraph          | No; it's a research concept                                             |
| Brand co-citation        | An independent page naming you and a rival in the same passage | "Brindlework, Kestrelyn and Tallyfold all send recurring invoices" | No                                                                      |
| Classic link co-citation | Two sites linked from the same third page                      | One roundup links to both Brindlework and Tallyfold                | No; it's a research method                                              |

In short, co-occurrence ties you to a topic, and brand co-citation ties you to the other players. When this guide says co-citation without a qualifier, it means the brand kind, linked or not. Tallyfold, Brindlework and Kestrelyn are fictional companies used throughout. For the broader idea of how machines identify a company, see our guide to [entity authority](/blog/entity-authority-in-the-ai-era).

## What Links Still Do for AI Answers

### Google: links find pages, rank them, and feed AI features

Google's own pages make four separate claims about links.

1. **Discovery.** The [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) says "the vast majority of the new pages Google finds every day are through links."
2. **Relevance.** Its [link best practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) say Google "uses links as a signal when determining the relevancy of pages and to find new pages to crawl."
3. **Ranking.** The [ranking systems guide](https://developers.google.com/search/docs/appearance/ranking-systems-guide) says PageRank "continues to be part of our core ranking systems."
4. **Quality.** Google's [How Search Works](https://www.google.com/search/howsearchworks/how-search-works/ranking-results/) page says one quality factor is "if other prominent websites link or refer to the content." Note the words "or refer." Google itself names references alongside links.

Then the link to AI. Google's [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), updated in July 2026, says AI Overviews and AI Mode "are rooted in our core Search ranking and quality systems." Their retrieval step relies "on our core Search ranking systems to retrieve relevant, up-to-date web pages." So a link that helps a page rank can help it get retrieved for an AI answer. Google documents each step, though it has never published how much one link moves the result.

### Microsoft: links count toward grounding

Microsoft is more direct. Its [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a) cover Bing, Copilot and "grounding API results." They list "External links from relevant websites" as a way Bing discovers URLs. And they say "Strong internal and external linking supports discovery, authority evaluation, and grounding eligibility." Grounding is the step where an AI answer pulls in web pages to base its reply on.

### OpenAI: no link factor named

OpenAI says ChatGPT search "ranks search results using multiple factors intended to help users find relevant, reliable information," per its [help page](https://help.openai.com/en/articles/9237897-chatgpt-search). It names no link signal. The same page says ChatGPT rewrites questions into queries for third-party search providers, and it points readers to Microsoft's privacy statement among them. So links can reach ChatGPT indirectly, through the indexes it searches. That's an inference, not something OpenAI states. Our [ChatGPT SEO guide](/ai-seo/chatgpt) covers its crawler and providers in depth.

## The Case for Unlinked Co-Citation, Graded

Now the harder half. A popular claim goes like this: language models don't need an `<a>` tag to link your brand with authority, and when top publications name you beside the category leaders, models learn you're a real player. Here is what supports that, graded by kind of evidence.

| Claim                                                                                 | Grade        | Evidence                                                                                                                                                            |
| ------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Google's AI features draw on what third parties say about products                    | Documented   | Google's AI guide: they "can show what's being said about products and services across the web, including in blogs, videos, and forum discussions"                  |
| Models recall facts better when the entities co-occur more often in training text     | Research     | Kandpal et al., ICML 2023, found correlational and causal links (see our [entity authority guide](/blog/entity-authority-in-the-ai-era)); Kang and Choi, EMNLP 2023 |
| Brands mentioned more often on the web are named more often in AI answers             | Correlated   | Ahrefs, May and December 2025, 75,000 brands, Spearman correlation                                                                                                  |
| Domains with more referring domains get more ChatGPT citations                        | Correlated   | SE Ranking, November 2025, 129,000 domains, regression model                                                                                                        |
| Link quality tracks AI mentions, and nofollow links track as closely as followed ones | Correlated   | Semrush with Growth Memo, October 2025, 1,000 domains, Pearson and Spearman                                                                                         |
| Mentions on top news sites predict ChatGPT's recall of a brand                        | Weak or none | Seer Interactive, March 2025: a correlation of about 0.07                                                                                                           |
| Being named next to leaders teaches a model you belong in the category                | Inferred     | Follows from the rows above; no study isolates same-paragraph co-citation                                                                                           |

### What the research on co-occurrence shows

The strongest lab evidence comes from how models learn. [Kandpal and colleagues](https://arxiv.org/abs/2211.08411) reported "strong correlational and causal relationships" between a model's accuracy on a question and the number of training documents that contain the question's entities. Our entity authority guide walks through their numbers.

A second paper shows the flip side. [Kang and Choi](https://arxiv.org/abs/2310.08256) (EMNLP 2023 Findings) found models "vulnerable to the co-occurrence bias, defined as preferring frequently co-occurred words over the correct answer." Models lean on what appears together, even when it's wrong. For a brand, that cuts both ways. Appearing next to the right rivals and category words helps. Appearing mostly next to an old product line, or a rival's name in a complaint, can stick too.

### What the correlation studies show

The headline numbers, each a correlation across a large sample:

- **Ahrefs, May 2025, 75,000 brands.** [Branded web mentions](https://ahrefs.com/blog/ai-overview-brand-correlation/) correlated 0.664 with AI Overview visibility, against 0.218 for backlinks. A [December 2025 follow-up](https://ahrefs.com/blog/ai-brand-visibility-correlations/) found link metrics "very weak" in ChatGPT and AI Mode too.
- **SE Ranking, November 2025, 129,000 domains.** Its model ranked [referring domains first](https://seranking.com/blog/how-to-optimize-for-chatgpt/) for ChatGPT citations. Past 32,000 referring domains, average citations rose from 2.9 to 5.6.
- **Semrush with Growth Memo, October 2025, 1,000 domains.** [Authority Score correlated 0.65](https://www.semrush.com/blog/backlinks-ai-search-study/) (Pearson) with AI mentions, and nofollow links scored as high as followed ones.
- **Seer Interactive, March 2025, eight publishers.** Brand mentions on major news sites had a [correlation of about 0.07](https://www.seerinteractive.com/insights/does-being-mentioned-on-top-news-sites-impact-ai-answer-mentions) with how often ChatGPT named those brands from memory.

Big brands win on links, mentions and AI answers at once, so none of these proves cause. Our post on [whether link building helps AI visibility](/blog/does-link-building-help-ai-visibility) takes the studies one by one.

### Why the studies disagree

The clash makes sense once you see what each one counted.

- **Citations or mentions.** SE Ranking counted ChatGPT citations, the URLs in the sources list. Ahrefs counted brand names in the answer text. A strong domain tends to win the first, and a widely discussed brand the second.
- **Link counts or link quality.** Ahrefs' weak numbers are for raw backlink counts. Semrush's strong one is for a quality score.
- **Search on or off.** In Semrush's data, link quality correlated least with visibility in ChatGPT with search and in Perplexity, and most in plain ChatGPT answering from memory.
- **Who's in the sample.** Ahrefs' December study only kept domains with a Domain Rating above 40. Small brands, the ones with the most to gain, are thin in most samples.

### So is the popular claim right?

Partly. The mechanism is plausible: models learn from words that appear together, and the model writing an AI answer reads page text, not the link graph. Mentions correlate with AI visibility across large samples. But no study has isolated "named in the same paragraph as the leaders" as its own factor. And Seer's result warns against the "top publications" part. Raw coverage in big-name outlets barely tracked ChatGPT's recall.

The pages that seem to matter most are the ones AI engines actually read for your category questions: roundups, reviews, comparisons and forums. A [2025 study by Chen and colleagues](https://arxiv.org/abs/2509.08919) found AI search has "a systematic and overwhelming bias towards Earned media," meaning third-party sources, and our post on [how AI models rank brands](/blog/how-ai-models-rank-brands-in-search-results) breaks down its numbers. So the practical rule is to earn co-citation on the pages engines cite, not on the most famous masthead you can reach.

## Google's Link Spam Rules Still Apply

None of this loosens Google's rules on links. As of September 2026, the [spam policies page](https://developers.google.com/search/docs/essentials/spam-policies) was last updated on 28 August 2026. It defines link spam as "creating links to or from a site primarily for the purpose of manipulating search rankings."

### What Google lists as link spam

The policy names these practices, among others:

- **Buying or selling links for ranking purposes.** That covers money, goods or services for links, and "sending someone a product in exchange for them writing about it and including a link."
- **Excessive link exchanges** ("Link to me and I'll link to you") and partner pages made only to cross-link.
- **Automated link creation**, meaning "using automated programs or services to create links to your site."
- **Paid articles with ranking links.** Advertorials where payment buys links that pass ranking credit, or "links with optimized anchor text in articles, guest posts, or press releases distributed on other sites."
- **Low-quality directory or bookmark links**, widget links, and "widely distributed links in the footers or templates of various sites."
- **Forum spam**, such as comments with optimized links in the post or signature.
- **Content made for links**: "creating low-value content primarily for the purposes of manipulating linking and ranking signals."

Paid links are allowed when they're labeled. Google says buying links for ads and sponsorships is normal, as long as the link carries `rel="nofollow"` or `rel="sponsored"`. Its [link qualification page](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links) prefers `sponsored` for paid placements and `ugc` for comments and forum posts.

### Guest posts: allowed, until the intent is links at scale

Guest posting isn't banned. Google's [2017 guidance](https://developers.google.com/search/blog/2017/05/a-reminder-about-links-in-large-scale) says it doesn't discourage articles that "inform users, educate another site's audience or bring awareness to your cause or company." The problem starts "when the main intent is to build links in a large-scale way." Its warning signs include keyword-rich links, articles spread across many sites, writers who don't know the topic, and the same or similar content each time.

AI makes that pattern cheap, which makes it riskier. Google's [scaled content abuse](/glossary/scaled-content-abuse) policy lists "using generative AI tools or other similar tools to generate many pages without adding value for users" as its first example. A batch of AI-written guest posts with anchor-text links can break both policies at once.

### How Google enforces it

Since the [December 2022 link spam update](https://developers.google.com/search/blog/2022/12/december-22-link-spam-update), Google's SpamBrain system can "detect both sites buying links, and sites used for the purpose of passing outgoing links." Those links are neutralized, so any credit they passed is lost. Human review can also lead to a manual action, and the policy says violating sites "may rank lower in results or not appear in results at all."

Two newer lines matter for AI. Google's definition of spam now includes "attempting to manipulate generative AI responses in Google Search." And its AI guide says "seeking inauthentic 'mentions' across the web isn't as helpful as it might seem." Bing's guidelines ban "link buying, link spamming, private networks, and artificial social promotion schemes that simulate popularity," and say these reduce grounding visibility in Copilot.

### The safe version of each tactic

| Tempting tactic                                       | What the rules say                                                      | The version that stays clean                                            |
| ----------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Paying for a guest post with a followed link          | Link spam                                                               | Sponsor openly, with `rel="sponsored"` and a disclosure                 |
| Swapping links with every partner who asks            | "Excessive link exchanges" are link spam                                | Link to partners only where readers need it                             |
| Sending free products for reviews that must link back | Link spam, and an FTC matter                                            | Send the product, ask for honesty, expect a disclosure, require no link |
| Publishing 50 AI-written guest posts a month          | Can break the link spam and scaled content abuse policies at once       | Write a few expert articles for sites your buyers read                  |
| Paying to be added to a "best of" list                | A paid link if it passes credit, and an ad readers should be told about | Pitch the editor facts and data; accept a labeled sponsorship           |

The FTC column matters for reviews and lists. Its [endorsement guidance](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking) says a blogger who gets free products "with the expectation" of promoting them is covered by the FTC Act, and the connection should be disclosed. Since 21 October 2024, the FTC's [reviews rule](https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers) also bans fake reviews and incentives "conditioned on" a review with a particular sentiment.

## The Co-Citation Gap Audit

The Co-Citation Gap Audit is our method for finding where you're named next to the leaders and, more usefully, where you aren't. Plan an afternoon for the first pass by hand.

### Step 1: Pick your leaders and your category words

Choose two or three rivals that buyers compare you with. Then write five phrases a buyer uses for your category, such as "invoicing software for agencies" or "recurring invoices for retainers." You'll use both lists in every search.

### Step 2: Collect the pages AI engines read

1. Write 10 to 12 unbranded buyer prompts. Our free [AI Visibility Prompt Kit](/tools/ai-visibility-prompt-generator) drafts 30 you can pick from.
2. Run each prompt in ChatGPT, Perplexity and Google's AI Mode, in a fresh session with memory off.
3. Open the sources panel on each answer and copy every third-party URL into a sheet.

### Step 3: Collect the wider web

Next, find pages that name your rivals, whether or not engines cite them today.

- **Free, with Google.** Google's [search operators](https://support.google.com/websearch/answer/2466433) support exact phrases in quotes, `site:` and a minus sign to exclude. Try `"Brindlework" "Kestrelyn" -site:brindlework.example -site:kestrelyn.example`, then add a category phrase in quotes.
- **Free, ongoing.** Set a [Google Alert](https://support.google.com/websearch/answer/4815696) and a [Talkwalker Alert](https://www.talkwalker.com/alerts) for each rival's name, so new pages come to you.
- **Paid.** Ahrefs' [Mentions alerts](https://ahrefs.com/academy/how-to-use-ahrefs/alerts/mentions) can find "pages that mention one or more of your competitors, but not you," using plus and minus operators. As of 29 September 2026, Ahrefs plans start at $129 a month (Lite), and Content Explorer is listed from Standard at $249.

### Step 4: Classify each page

Read the passage where each rival appears, and put the page in one bucket.

| Bucket       | What you see                                   | What it means                        |
| ------------ | ---------------------------------------------- | ------------------------------------ |
| Co-cited     | You're named in the same passage as a rival    | A full co-citation, linked or not    |
| Co-mentioned | You're on the page, but in another section     | Partial; the page groups you loosely |
| Gap          | Rivals are named; you're absent                | Your target list                     |
| Off-topic    | The page names a rival for an unrelated reason | Drop it from the count               |

Note in a separate column whether each mention links to you. Unlinked co-citation still counts here.

### Step 5: Score it

Work out your **co-citation share** for each set:

**Co-citation share = pages where you're co-cited ÷ pages that name at least one rival**

Report the AI-source set and the wider-web set as two numbers. The first shows where you stand on the pages engines read today. The second shows the pool you can still win. Then sort the gap pages by type, because each type needs a different move.

## How to Earn Co-Citations Without Buying Them

Every tactic below produces the same outcome: an editor, reviewer or community member writes your name next to your rivals because it helps their reader. That's what keeps it inside the rules.

### Publish original data

Journalists ask for it. In Muck Rack's [2026 survey of 897 journalists](https://www.globenewswire.com/news-release/2026/03/19/3259178/0/en/muck-rack-s-2026-state-of-journalism-report-finds-82-of-journalists-use-ai.html), "original research or data" was among the most valued parts of a pitch, and 88% said they delete pitches that miss their beat. A data story about your category often names the category's players, which is co-citation by design. Use data you really have, and publish the method.

### Offer expert commentary

Reporters writing about your category need quotes. When your founder's quote sits in a paragraph that also names a leader, that's a co-citation from an editor. Answer only the requests you're qualified for. Our [AI link building guide](/blog/ai-link-building) lists request services and their prices.

### Earn genuine reviews

Category pages on review sites are among the pages engines read for "best X" prompts. Ask real customers to review you, and don't pay for positive ones. The FTC rule above bans incentives tied to a review's sentiment.

### Get onto lists and comparisons by merit

Roundups name several brands in one passage, so they're the densest source of co-citation. Send editors accurate facts: your pricing, who you're best for, and a customer they can speak to. If a list is pay-to-play, the placement is an ad and should be labeled. On your own site, publish neutral comparisons that name rivals fairly. Our [comparison page formula](/blog/comparison-page-formula) shows how.

### Show up where buyers talk

Forums and Reddit threads compare tools in plain language, and engines cite them. Take part as yourself, follow each community's rules, and disclose who you work for. Our guide to [Reddit's role in AI search](/blog/reddit-in-ai-search) covers the evidence and a rule-following playbook, and the [Reddit SEO](/glossary/reddit-seo) glossary entry covers the basics.

### List real partnerships

If you integrate with a platform, ask to appear in its integrations directory. Those pages name you beside other apps in your category. List only integrations that exist.

## Worked Example: Tallyfold's Co-Citation Gap

Tallyfold is a fictional invoicing and payments app for agencies. Its rivals, Brindlework and Kestrelyn, are fictional too. All numbers below are illustrative, chosen to show the arithmetic.

**The AI-source set.** Tallyfold runs 12 unbranded prompts in ChatGPT, Perplexity and AI Mode, which gives 36 answers. The sources panels list 58 unique third-party URLs. Of those, 41 name Brindlework or Kestrelyn in their text.

| Brand                                    | Pages naming it (of 41) | Share |
| ---------------------------------------- | ----------------------- | ----- |
| Brindlework                              | 37                      | 90.2% |
| Kestrelyn                                | 26                      | 63.4% |
| Tallyfold, anywhere on the page          | 6                       | 14.6% |
| Tallyfold, co-cited in a rival's passage | 4                       | 9.8%  |

Two of Tallyfold's six pages link to it, and four don't. Its co-citation share on the AI-source set is 4 ÷ 41 = 9.8%.

**The wider-web set.** Google operator searches turn up 64 more pages naming both rivals. Tallyfold is co-cited on 5 of them, a share of 5 ÷ 64 = 7.8%.

**The gap list.** On the AI-source set, 41 − 6 = 35 pages name a rival but not Tallyfold. By type, they are 14 roundups, 8 comparison or alternatives pages, 6 review-site category pages, 4 Reddit threads and 3 trade articles. That's 14 + 8 + 6 + 4 + 3 = 35.

**The quarter's plan.** Tallyfold sets a target of 10 new co-citations on those 35 pages:

1. **Roundups, 4.** Send each editor a fact sheet and one data point from Tallyfold's own anonymized invoice data, such as median days to payment for agency retainers.
2. **Comparison pages, 2.** Correct outdated facts about Tallyfold, with sources, and ask to be added where it fits.
3. **Review sites, 2.** Invite recent customers to leave honest reviews, with no reward tied to the rating.
4. **Reddit, 1.** A team member answers relevant questions under their own name and discloses where they work.
5. **Trade press, 1.** Pitch the payments data story to one trade writer who covers agency finance.

If all 10 land, the co-citation share on the AI-source set rises from 4 of 41 to 14 of 41, which is 34.1%. Some will fail, so Tallyfold tracks each target in the sheet. It also checks the link side of the job: its pricing page wasn't indexed in Bing, so it fixes that first, because an unindexed page can't be retrieved at all.

After eight weeks, Tallyfold reruns the same 36 answers. It compares the new share with the old one and uses a control group of prompts it didn't work on, as our [GEO measurement guide](/blog/how-to-measure-geo) explains. A rise in co-citation share is the input. More answers naming Tallyfold is the result it wants, and the two don't have to move together.

## How Rankbox Helps You Earn Mentions

Co-citations are earned by content worth naming, and that's the part Rankbox helps with. [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask ChatGPT, Perplexity and Google about your category, with volume, difficulty and intent as model estimates. The [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes 2,000 to 3,500-word, source-backed articles, such as data-led explainers and fair comparisons that editors can quote. Articles reach your site through [Rankbox's API](/integrations/api).

Rankbox doesn't pitch editors, build links, post on forums or track AI citations. The outreach and the measurement stay with you. The Business plan is $49.50 a month with a 7-day trial. [See pricing](/pricing).

## Frequently Asked Questions

### What is co-citation in SEO?

Co-citation in SEO means an independent page names your brand in the same passage as another brand, usually a category leader, whether or not it links. The term comes from a 1973 library science paper, where it meant two documents cited together by a third. In classic link analysis, it meant two sites linked from the same page.

### Is co-citation the same as co-occurrence?

No. Co-occurrence is your brand appearing near a topic's words, such as "Tallyfold" and "invoicing for agencies" in one paragraph. Co-citation is your brand appearing near another brand. Rand Fishkin's 2012 Moz post first used co-citation for what he later called co-occurrence, which is why the terms still get mixed up.

### Do unlinked brand mentions help SEO?

Probably, to a degree Google doesn't spell out. Its How Search Works page lists whether prominent sites "link or refer to" content as one quality factor, and its AI features show what's said about products across the web. Studies find mentions correlate strongly with AI visibility, but none proves cause.

### Does link building still matter for AI visibility?

Yes, mainly upstream. Google and Bing use links to find and rank pages, and both say their AI features rely on those systems. SE Ranking found referring domains were the top predictor of ChatGPT citations. Mentions matter too, so plan for both. Our [evidence summary](/blog/does-link-building-help-ai-visibility) has the details.

### Are guest posts against Google's guidelines?

No, not by themselves. Google says guest articles that inform readers are fine. They become link spam when the main intent is building links at scale, especially with keyword-rich anchor text, the same content on many sites, or paid links that aren't marked `rel="sponsored"` or `nofollow`.

### How do I find co-citation opportunities for free?

Collect the sources AI engines cite for your category prompts, then search Google for pages that name your rivals, using quotes and a minus sign to exclude their own sites. Set Google Alerts and Talkwalker Alerts for each rival. Pages that name rivals but not you are your gap list.

## References

1. [Spam policies for Google web search, Google Search Central](https://developers.google.com/search/docs/essentials/spam-policies)
2. [Optimizing for generative AI features on Google Search, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
3. [A guide to Google Search ranking systems, Google Search Central](https://developers.google.com/search/docs/appearance/ranking-systems-guide)
4. [Link best practices for Google, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
5. [How Search works: ranking results, Google](https://www.google.com/search/howsearchworks/how-search-works/ranking-results/)
6. [A reminder about links in large-scale article campaigns, Google Search Central Blog (2017)](https://developers.google.com/search/blog/2017/05/a-reminder-about-links-in-large-scale)
7. [December 2022 link spam update, Google Search Central Blog](https://developers.google.com/search/blog/2022/12/december-22-link-spam-update)
8. [Qualify your outbound links to Google, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links)
9. [Bing Webmaster Guidelines, Microsoft Bing](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a)
10. [ChatGPT search, OpenAI Help Center](https://help.openai.com/en/articles/9237897-chatgpt-search)
11. [Co-citation in the scientific literature (Small, 1973), Journal of the American Society for Information Science](https://doi.org/10.1002/asi.4630240406)
12. [Finding related pages in the World Wide Web (Dean and Henzinger, 1999), Computer Networks](<https://doi.org/10.1016/S1389-1286(99)00022-5>)
13. [Prediction: Anchor Text is Weakening and May Be Replaced by Co-Occurrence, Moz (2012)](https://moz.com/blog/prediction-anchor-text-is-dying-and-will-be-replaced-by-cocitation-whiteboard-friday)
14. [US8682892B1: Ranking search results, Google Patents](https://patents.google.com/patent/US8682892B1/en)
15. [Impact of Co-occurrence on Factual Knowledge of Large Language Models (Kang and Choi, EMNLP 2023 Findings), arXiv](https://arxiv.org/abs/2310.08256)
16. [An Analysis of AI Overview Brand Visibility Factors (75K Brands Studied), Ahrefs](https://ahrefs.com/blog/ai-overview-brand-correlation/)
17. [How to optimize for ChatGPT: a study of 129,000 domains, SE Ranking](https://seranking.com/blog/how-to-optimize-for-chatgpt/)
18. [Do Backlinks Still Matter in AI Search? Insights from 1,000 Domains, Semrush](https://www.semrush.com/blog/backlinks-ai-search-study/)
19. [Does Being Mentioned on Top News Sites Impact AI Answer Mentions?, Seer Interactive](https://www.seerinteractive.com/insights/does-being-mentioned-on-top-news-sites-impact-ai-answer-mentions)
20. [State of Journalism 2026 press release, Muck Rack](https://www.globenewswire.com/news-release/2026/03/19/3259178/0/en/muck-rack-s-2026-state-of-journalism-report-finds-82-of-journalists-use-ai.html)
