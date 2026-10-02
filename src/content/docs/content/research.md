---
title: Research: the questions buyers ask AI
nav_title: Research
description: How Rankbox reads your site, estimates the searches and questions your buyers ask, and turns them into a keyword set and a plan of article topics.
order: 1
updated: 2026-10-02
---

Research is the first thing Rankbox does for a site. It reads your website, works out what you sell and who buys it, lists the searches and questions your buyers type into Google and AI assistants, and turns each one into an article topic. Research runs when you set up your first site in onboarding and when you add a site in [Studio](/docs/account/studio), and it never costs an article credit.

## What research produces

One research run gives you five things. Each one feeds a later step of the pipeline.

| Output | What it contains | Where you see it later |
| --- | --- | --- |
| Brand profile | Brand name and a one- or two-sentence "what you do" | **Settings → Your brand** |
| Keyword set | Up to 25 searches, each with estimated monthly searches, intent and trend | **Rank → Your market** |
| Brand context | Niche, market, who you're writing for, brand voice | **Settings → How autopilot writes** |
| Insights | Content gaps, competitors, topic clusters, AI visibility notes | Onboarding step 2 only (they brief the plan) |
| Content plan | One article topic per keyword, up to 30, in publishing order | **Articles** and **Calendar** |

## How a research run works

Research happens in the three onboarding steps. The same steps run when you add a site in Studio. Your progress is saved in your browser, so you can leave and come back to the step you were on.

### Step 1: Rankbox reads your website

1. Enter your site in **Website** (for example `yoursite.com`).
2. Wait while Rankbox reads the page. It fetches the page at that URL, renders it like a browser, and keeps the main content, up to 14,000 characters.
3. Check **Brand name** and **What you do**. A language model writes both from your page. "What you do" is one or two plain sentences in the third person, with no marketing claims. If the model can't tell, the fields fall back to your page's own tags (site name or title for the brand, meta description for what you do), and you correct them.
4. Click **Re-scan** if you changed the URL or the page, then click **Find my keywords**.

### Step 2: Rankbox maps the searches

The screen reads "Reading yoursite.com…" while the analysis runs. The interface says this takes about 20 seconds. A language model receives your brand name, what you do, your URL and your page text, and returns the keyword set plus the brand context.

1. Review the list under **Pick the searches to win**. Each keyword becomes one article.
2. Remove a keyword with the **×** on its row. A toast offers **Undo**.
3. Rename a keyword by clicking its text and typing.
4. Add your own in **Add a keyword you know converts**, then press Enter or click **Add**.
5. Open **What we learned about** your brand to review **Niche**, **Market**, **Who you're writing for** and **Brand voice**. You can edit all four.
6. Click **Build my plan**.

### Step 3: Rankbox plans the articles

A third model call turns your confirmed keywords into article topics, using your brand context and page text to find what your site doesn't answer yet. The screen shows **Your first month of content** when it's done.

1. Review **Ready on your dashboard** (the first 4 topics, labeled **Idea**) and **Autopilot queue** (the rest, labeled **Day 1**, **Day 2** and so on).
2. Go back to step 2 if you want different keywords. Changing the keyword list throws away the plan, and step 3 builds a new one.
3. Click **Confirm plan**.

## Where the numbers come from

Research is built on three language model calls and one page read. It doesn't use a keyword database, a rank tracker, or answers collected from ChatGPT, Perplexity or any other engine.

| Call | What it reads | What it returns |
| --- | --- | --- |
| Brand read | Your page text, title and meta description | Brand name, what you do |
| Site analysis | Brand name, what you do, URL, page text | Niche, services, audience, market, brand tone, competitors, content gaps, topic clusters, AI visibility notes, keywords |
| Content plan | The analysis, your confirmed keywords, page text | Article titles, briefs, competition, AI signal, publishing order |

Search volume, intent, trend, competition and AI signal are the model's estimates, grounded in your site's text. Use them to compare your own topics with each other, not as measured demand.

> [!IMPORTANT]
> The **AI visibility today** notes are judgments from your page text, not measurements. Rankbox doesn't track whether AI engines cite your site.

## Keyword fields

| Field | Values | How it's set |
| --- | --- | --- |
| Keyword | A lowercase search phrase | Written by the model; you can rename it |
| Searches | Whole number: the model's estimate of monthly searches in the US | Written by the model. Keywords you add show **—** ("No search data yet for keywords you add") |
| Intent | `Commercial`, `Informational`, `Transactional` or `Navigational` | Written by the model. Keywords you add are `Commercial` |
| Trend | `Rising`, `Steady` or `Declining` (shown as an icon) | Written by the model. Keywords you add are `Steady` |

The analysis asks for 20 searches that real buyers type, mixing buying-intent queries, comparisons and alternatives, and informational questions. It leaves out searches for your own brand name, removes duplicates, and keeps at most 25. The footer, **Monthly searches, all keywords**, adds up the Searches column.

## Topic fields in the content plan

| Field | Meaning |
| --- | --- |
| Title | A specific title under 70 characters that contains the keyword naturally. No year unless the keyword has one |
| Brief | One or two sentences: the angle and the gap the article fills. The writer works from it. Until the article is written, the brief sits in the article's **Meta description** field |
| Keyword | Exactly one keyword from your set |
| Est. traffic | Modeled monthly visits: the keyword's estimated searches × 0.3 × 0.965 for each place down the plan. Shown as "/mo" with a flame |
| Competition | `Low`, `Medium` or `High`: how hard it would be for a new article from your site to rank |
| AI signal | 1 to 100: how likely AI engines are to cite a strong article on the topic. Shown as 1 to 3 flames (3 at 80 or more, 2 at 55 to 79, 1 below 55) |

The plan puts quick wins first: low competition and buying intent, then the bigger bets. Comparison and alternatives topics are written to be fair to competitors and not to invent facts about them.

The plan covers at most 30 keywords. If your list is longer, the 30 with the highest estimated searches are planned. Keywords you add by hand have no estimate, so they're planned last and dropped first. A keyword with no search estimate gets an Est. traffic of 0.

## Where research results go

When you click **Confirm plan**, Rankbox saves everything to the site and opens the dashboard.

- **The first 4 topics** become ideas. You find them under **Articles → Ideas** and in **Content gaps to win** on the Overview.
- **The remaining topics** go into the autopilot queue as scheduled articles, one a day, starting the day after you confirm. See [Content plan and calendar](/docs/content/content-plan).
- **Your keywords** are saved to the site. The first 4 are tracked on the Rank page and the rest are listed as discovered. See [Rank: AI search visibility](/docs/growth/rank).
- **Your brand context** fills your writing settings: **Brand voice** becomes the **Tone**, **Who you're writing for** becomes the **Audience**, and a line such as "Niche: … Geo: …" is placed in **House rules**. See [Brand voice and writing settings](/docs/content/brand-voice).

Nothing is written or published at this point. Writing starts when you start your [free trial](/docs/account/free-trial).

## Add your own topics after onboarding

Research doesn't run again for a site once onboarding is finished. You can still steer what gets written.

- **Repurpose an idea.** Open any idea, change its title, **Target keyword** and **Meta description** (the brief), then click **Write now** or **Schedule**. The writer works from those three fields.
- **Plan a keyword gap.** On **Rank → Your market**, filter to **Gaps** and click **Plan it** on a keyword that has no article. Rankbox creates an idea titled from the keyword, with an empty brief, and opens it.
- **Add a site.** Adding a site in Studio runs a full research pass for that site.

The free [AI question generator](/tools/ai-question-generator) and the `generate_ai_questions` tool in the [MCP server](/docs/ai-tools/mcp-server) also list the questions people ask about a topic. They don't add anything to your plan.

## Limits and edge cases

- **One page is read.** Research reads the URL you enter, usually your homepage. Other pages on your site aren't crawled, so content gaps are judged against that page.
- **Unreadable sites.** If the page blocks automated visits, needs a login, or isn't HTML, the analysis works from your brand name and what you do alone. Expect more generic keywords.
- **Private addresses are refused.** Local, private and non-web URLs can't be scanned.
- **The analysis runs once per URL.** Editing **Brand name** or **What you do** after step 2 has run doesn't re-run the analysis. Edit the keyword list directly instead.
- **Competitors are named by the model.** Up to 6 companies buyers compare you with, and only ones the model is confident exist. You can't edit the list, and Rankbox doesn't monitor those competitors.
- **Estimates are US-based and in English.** The prompts are in English and ask for US search volumes.
- **Rate limit.** AI requests are limited per account, 12 a minute by default. Past the limit you see "You're making AI requests too quickly. Wait a minute and try again."

## Troubleshooting research

| What you see | What to do |
| --- | --- |
| "Analysis failed. You can still add keywords by hand." | Add the searches you want to win in **Add a keyword you know converts**, or go back to step 1 and check the URL |
| "We couldn't build your content plan." | Click **Try again** |
| "Add your website and brand name to continue." | Fill in **Website** and **Brand name** in step 1 |
| "Add at least one keyword to plan articles." | Add a keyword in step 2 |
| Keywords look generic | The page probably couldn't be read. Check that the URL loads publicly, click **Re-scan**, and make **What you do** specific |

## Related

- [Content plan and calendar](/docs/content/content-plan): what happens to your topics after research
- [How articles are written](/docs/content/writing): how a topic becomes a finished article
- [Brand voice and writing settings](/docs/content/brand-voice): the brand context research fills in
- [Onboarding, step by step](/docs/get-started/onboarding): the full sign-up flow around research
- [Rank: AI search visibility](/docs/growth/rank): where your keyword set lives after onboarding
