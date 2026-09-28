---
title: How to Measure AI Referral Traffic in Google Analytics 4 (GA4)
description: How to measure AI referral traffic in GA4: a tested regex, a custom channel group placed above Referral, and dashboards that compare AI with organic search.
keyword: AI referral traffic
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Measurement
---

To measure AI referral traffic in GA4, use two layers. Keep the AI Assistant channel that Google added on 13 May 2026, then add a custom channel group with one "AI assistants" channel, placed just above Referral, that matches a tested list of assistant hostnames or Google's own `ai-assistant` medium. Then compare that channel with Organic Search on engagement rate, key events and conversion rate, in an exploration, in Data Studio or in BigQuery.

Why both layers? Google's channel is a good start, but its definition names five assistants, not Perplexity, and Google doesn't publish the full list it matches. In [SE Ranking's 2026 data](https://seranking.com/blog/ai-traffic-research-study/), Perplexity and Claude together sent 9.85% of all AI referral traffic from January to April (7.23% plus 2.62%). That's the slice most likely to sit in Referral. ChatGPT's own tag can push some visits into Unassigned, and clicks that lose their referrer land in Direct.

AI referral traffic is small, which is why it's easy to get wrong. In April 2026, AI assistants sent about a third of one percent of all US website visits in the same study of 101,574 sites. Misfile a few hundred sessions and your AI channel can look a third smaller than it is.

This guide is the full GA4 setup: a copy-paste rule set with a tested regex, the exact steps, where visits still get lost, a worked example, and three ways to build the comparison. For the wider picture (citations, prompt panels and control tests), read our guide to [measuring GEO](/blog/how-to-measure-geo). For a short definition, see [AI referral traffic](/glossary/ai-referral-traffic) in our glossary.

## Key Takeaways

- GA4's AI Assistant channel, live since 13 May 2026, sets the medium to `ai-assistant` when a referrer is on Google's unpublished list. Its definition names ChatGPT, Gemini, DeepSeek, Copilot and Grok, and the launch note adds Claude.
- Neither Google page names Perplexity, so its AI referral traffic usually stays in Referral until you add your own channel.
- A custom channel group applies to past data, but a standard property gets only two of them. Put the AI channel directly above Referral, below the paid channels.
- ChatGPT tags its links with `utm_source=chatgpt.com` but no medium, so some visits show as `chatgpt.com / (not set)` in Unassigned. Match on source, not medium.
- Google's sample regex over-matches. Under GA4's full-match rule it counts every source ending in "ai", plus gemini.com and bombardier.com. Use exact hostnames.
- No channel rule can pull AI referral traffic out of Direct. Only fixes upstream can: redirects that keep query strings, HTTPS links and tagged links you control.
- Published conversion premiums for AI visitors range from none (Amsive, 54 sites) to 23 times (Ahrefs, one site). Measure your own, and wait for enough sessions to trust it.

## Where AI Referral Traffic Lands in GA4 Today

An AI click can end up in four places: Google's AI Assistant channel, Referral, Unassigned or Direct. Which one depends on the assistant, on how the link is built, and on whether the browser passes a referrer.

### What Google's AI Assistant channel does

On 13 May 2026, Google [added an AI Assistant channel](https://support.google.com/analytics/answer/9164320) to the default channel group. When a session's referrer matches Google's list of assistants, GA4 sets the medium to `ai-assistant` and the campaign to `(ai-assistant)`, and files the session under the new channel. The [channel definition](https://support.google.com/analytics/answer/9756891) describes its sources as "ChatGPT, Gemini, Deepseek, Copilot, or Grok." The launch note gives ChatGPT, Gemini and Claude as examples.

Three limits follow from how it works:

- **It needs a referrer.** A click that arrives with no referrer can't match, so it stays in Direct.
- **The list is private.** [Search Engine Journal noted](https://www.searchenginejournal.com/google-analytics-adds-ai-assistant-as-default-channel-group/574974/) at launch that Google hasn't published it. The source-category file on Google's help page dates from February 2023 and has no AI hosts.
- **Google's own AI is excluded.** Clicks from AI Overviews and AI Mode count as Organic Search, and GA4 can't split them out.

Google also hasn't said whether the new channel re-sorts sessions from before 13 May. Custom channel groups, which you'll build below, are documented as retroactive.

### How each assistant's AI referral traffic shows up by default

| Assistant | Host a click's referrer carries | Named by Google? | Where to expect it by default |
| --- | --- | --- | --- |
| ChatGPT | `chatgpt.com`, plus the tag `utm_source=chatgpt.com`; old `chat.openai.com` links redirect there | Definition and launch note | AI Assistant, but tagged clicks can land in Unassigned |
| Gemini | `gemini.google.com` | Definition and launch note | AI Assistant |
| Microsoft Copilot | `copilot.microsoft.com`, also served at `copilot.com`; work accounts use `m365.cloud.microsoft`, moving to `copilot.cloud.microsoft` | Definition | AI Assistant, if Google's list has that host |
| Copilot Search in Bing | `bing.com` | No; bing is on Google's search list | Organic Search |
| Claude | `claude.ai` | Launch note only | Check your own data: reports differ |
| Perplexity | `www.perplexity.ai` | No | Referral |
| DeepSeek | `chat.deepseek.com` | Definition | AI Assistant, when a referrer arrives |
| Grok | `grok.com` | Definition | AI Assistant, when a referrer arrives |
| Meta AI | `meta.ai` on the web; in-app clicks undocumented | No | Referral |
| Mistral (Vibe, formerly Le Chat) | `chat.mistral.ai` | No | Referral |
| You.com | `you.com` | No | Referral |
| Phind | `phind.com` | No | Referral, old data only |
| Google AI Overviews and AI Mode | `google.com` | Excluded | Organic Search |

Treat the last column as a starting guess. Open **Reports**, then **Acquisition**, then **Traffic acquisition**, set the primary dimension to **Session source / medium**, and search for each host to see where your own sessions sit. Our engine guides cover each referrer in depth, starting with [ChatGPT](/ai-seo/chatgpt), [Perplexity](/ai-seo/perplexity) and [Copilot](/ai-seo/copilot).

Four rows need a note. Microsoft is [moving](https://mc.merill.net/message/MC1462915) the Microsoft 365 Copilot web app in September and October 2026. Copilot Search, [launched in Bing](https://searchengineland.com/microsoft-officially-launches-copilot-search-in-bing-453958) in April 2025, lives on bing.com, so its clicks look like ordinary Bing visits. [SE Ranking](https://seranking.com/blog/ai-traffic-research-study/) found DeepSeek's referrals "dropped to essentially zero across all regions" from September 2025. And Phind [shut down](https://intelligenttools.co/blog/improved-phind-shutdown-post) in January 2026.

### Why ChatGPT visits can land in Unassigned

OpenAI's [publisher FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq) says ChatGPT adds `utm_source=chatgpt.com` to the links in its answers. That tag cuts both ways.

It helps because the tag rides in the URL, not in the Referer header. A click that loses its referrer can still be credited to chatgpt.com, as long as nothing on your site strips the query string.

It hurts because OpenAI documents a source but no medium. Google's [processing rules](https://support.google.com/analytics/answer/11242841) map UTM values straight onto source and medium, and use the referrer only when no campaign fields are set. So a tagged click can be recorded as `chatgpt.com / (not set)`. No default channel rule matches that pair, so the session drops into Unassigned, a pattern [Analytics Mania](https://www.analyticsmania.com/post/unassigned-in-google-analytics-4/) describes for AI links. Other analysts [report](https://www.lawrencehitches.com/utm-source-chatgpt-explained/) ChatGPT sessions as `chatgpt.com / referral`, so check which one your property shows.

Google doesn't say how its new `ai-assistant` rewrite interacts with the tag. The safe answer is a rule on **Source**, which catches `chatgpt.com` whatever medium GA4 records.

## A Copy-Paste Rule Set for AI Referral Traffic

This rule set sorts AI referral traffic into one channel. It uses two conditions joined with OR, so it catches everything Google already recognizes, plus the assistants Google doesn't name.

### The rules

| Setting | Value |
| --- | --- |
| Channel group | A new group, for example "AI view" |
| Channel name | AI assistants |
| Condition 1 | **Source** · matches regex · the regex below |
| OR condition 2 | **Medium** · exactly matches · `ai-assistant` |
| Position | Directly above Referral, below every paid channel |
| Everything else | Google's default channels, left as copied |

```GA4 regex
^((www\.)?perplexity\.ai|chatgpt\.com|chat\.openai\.com|claude\.ai|gemini\.google\.com|copilot\.microsoft\.com|(www\.)?copilot\.com|(copilot|m365)\.cloud\.microsoft|(www\.)?meta\.ai|chat\.mistral\.ai|chat\.deepseek\.com|grok\.com|(www\.)?you\.com|(www\.)?phind\.com)$
```

### What each part of the regex catches

- **ChatGPT:** `chatgpt.com`, and `chat.openai.com` for older links, but not openai.com's blog, docs or forum.
- **Perplexity:** with or without `www.`, since the bare domain redirects to the www host.
- **Copilot:** both consumer hosts and both addresses of the Microsoft 365 Copilot web app.
- **The rest:** Claude, Gemini, Meta AI, Mistral (its assistant is [now called Vibe](https://help.mistral.ai/en/articles/682992-le-chat-is-now-vibe), at the same address), DeepSeek, Grok, You.com, and Phind for old data.

The `^` and `$` change nothing inside GA4, where "matches regex" is a [full match by default](https://support.google.com/analytics/answer/1034324). They make the same pattern safe in tools that match partially, such as BigQuery.

Why just above Referral, and not at the top? Paid clicks. If you buy ChatGPT ads (OpenAI opened a beta self-serve Ads Manager in May 2026, [per SE Ranking](https://seranking.com/blog/chatgpt-referral-traffic-may-2026/)) and tag them with `utm_source=chatgpt.com`, a source rule at the top would count them as organic AI referral traffic. Below the paid channels, a paid medium wins first. Build those links with our [UTM link builder](/tools/utm-link-builder) and a medium such as `cpc`.

### Tested against 54 hostnames

The regex was run through Python's `re` module and through Google's RE2 library, whose syntax GA4 uses. It matched all 20 assistant hosts and none of the 34 others, in both full-match and partial-match mode.

| Group | Hosts | Result |
| --- | --- | --- |
| Assistants (20) | chatgpt.com, chat.openai.com, perplexity.ai, www.perplexity.ai, claude.ai, gemini.google.com, copilot.microsoft.com, copilot.com, www.copilot.com, copilot.cloud.microsoft, m365.cloud.microsoft, meta.ai, www.meta.ai, chat.mistral.ai, chat.deepseek.com, grok.com, you.com, www.you.com, phind.com, www.phind.com | All match |
| Search engines (4) | google.com, www.google.com, bing.com, www.bing.com | No match |
| OpenAI, not chat (4) | openai.com, platform.openai.com, community.openai.com, help.openai.com | No match |
| Name collisions (6) | gemini.com, bombardier.com, bard.edu, gptzero.me, copilot.money, github.com | No match |
| Other .ai sites (4) | loopcraft.ai, jasper.ai, character.ai, mistral.ai | No match |
| Look-alikes (5) | notperplexity.ai, perplexity.ai.example.com, claude.ai.example.com, chatgpt.com.example.net, thankyou.com | No match |
| Social, mail and empty values (11) | l.facebook.com, lm.facebook.com, t.co, x.com, mail.google.com, outlook.live.com, duckduckgo.com, deepseek.com, (direct), (not set), an empty string | No match |

### Why not paste Google's sample regex?

Google's [help page](https://support.google.com/analytics/answer/13051316) offers a sample that starts `^.*ai|.*\.openai.*|.*chatgpt.*`. Run it against the same 54 hosts under GA4's full-match rule, and it counts 15 of the 34 non-assistant hosts as AI. It catches every source that ends in "ai", so a link from a competitor on a .ai domain, like the fictional loopcraft.ai, becomes AI referral traffic. It also catches gemini.com, bombardier.com, bard.edu, gptzero.me, copilot.money and OpenAI's help, docs and forum hosts.

It misses, too: chat.deepseek.com, grok.com, you.com, phind.com and m365.cloud.microsoft all fall through. Exact hostnames take longer to type, but they don't guess.

## Set Up the AI Referral Traffic Channel, Step by Step

Google documents the path on its [custom channel groups](https://support.google.com/analytics/answer/13051316) help page. You need the Editor role or higher on the property.

1. In GA4, open **Admin**. Under **Data display**, click **Channel groups**.
2. Click **Create new channel group**. GA4 starts you with a copy of the default group. Name it, for example "AI view".
3. If the copy already contains Google's AI Assistant channel, open and edit it. If not, click **Add new channel** and name it "AI assistants".
4. Click **+ Add condition group**. Choose **Source**, then **matches regex**, and paste the regex.
5. Add a second condition joined with **OR**: **Medium**, **exactly matches**, `ai-assistant`. Click **Save channel**.
6. Click **Reorder**, drag "AI assistants" directly above Referral, and click **Apply**.
7. Click **Save group**.

Step 6 is the one people skip. GA4 files each session under the first channel whose rules it meets, in the order you set. Leave the AI channel below Referral and any assistant visit with a `referral` medium never reaches it.

### Limits and rules to know

| Rule | What Google's help page says | What it means for you |
| --- | --- | --- |
| Groups per property | 2 custom groups on standard properties, 5 on Analytics 360 | Don't spend both slots on experiments |
| Channels per group | 50 | Room for one channel per engine, if you want that |
| Past data | Custom groups can be applied retroactively | Your channel re-sorts last year's visits too |
| Primary channel group | A custom group set as primary fills in "from that point forward" | The group is retroactive; making it primary isn't |
| Edits | Apply at once in reports; audiences change only going forward | Date every change to the regex |
| Where it's missing | The Key events paths report and the BigQuery export | Rebuild the rule in SQL (see below) |

### Check that it works

Open **Reports**, **Acquisition**, **Traffic acquisition**. Switch the primary dimension to your new group (a session custom channel group dimension) and add **Session source** as a secondary dimension. You should see one AI assistants row, with each assistant under it. Then run a monthly leak check:

- **Referral:** filter Session source with a loose pattern such as `.*(gpt|chat|copilot|assistant).*`. Any AI host your regex misses is a candidate to add.
- **Unassigned:** `chatgpt.com` rows should be gone. If not, check the regex, and check that you're viewing the new group rather than the default one.
- **Direct on deep pages:** nobody types a comparison page from memory. A rise in Direct landings there, with no campaign to explain it, hints at lost referrers.

## Where AI Referral Traffic Still Gets Lost

A channel group can only re-sort sessions that carry a source. A visit with no referrer and no tag is Direct before your rules run.

### The browser sends a hostname at most

Browsers default to a `strict-origin-when-cross-origin` referrer policy, which sends only the origin (the scheme and host) to another site, [per MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy). On 28 September 2026, the live assistant web apps in the table above served that policy, a similar one (`origin` or `origin-when-cross-origin`), or none, which leaves the default in place. So GA4 can see `claude.ai`, but never the conversation. You can count AI referral traffic by assistant, not by prompt.

### Five ways the referrer disappears

1. **Apps and in-app browsers.** Seer Interactive [warns](https://www.seerinteractive.com/insights/are-ai-sites-like-chatgpt-sending-your-website-traffic) that "traffic from in-app browsers, copy-pasted links, or other 'dark' paths will still land in direct." The vendors don't document what their desktop and mobile apps send.
2. **Copy and paste.** A link pasted into a new tab carries no referrer.
3. **HTTPS to HTTP.** Under the default policy, a browser sends no Referer to a less secure page. If an answer cites an old `http://` address of yours, the click arrives without one, even after your redirect to HTTPS.
4. **Redirects that drop the query string.** ChatGPT's tag survives a lost referrer only if every redirect on your side keeps the `?utm_source=` part.
5. **Links that opt out.** A link marked `rel="noreferrer"`, or a page with a `no-referrer` policy, sends nothing.

How much each app loses isn't well documented yet. Rankbox is testing referrer loss app by app and will publish the results.

Some AI clicks do arrive, just not as AI. Google's AI Overviews and AI Mode stay in Organic Search, Copilot Search looks like Bing organic, and Meta doesn't document the referrer its answers send inside Facebook, Instagram and WhatsApp. Treat Meta AI numbers in GA4 as partial.

### Fixes that do move visits out of Direct

- **Keep query strings through every redirect:** trailing slashes, HTTP to HTTPS, locale switches.
- **Show engines your HTTPS addresses only.** Canonical tags, sitemaps and internal links should all use `https://`.
- **Tag links you control inside AI products,** such as a custom GPT, an app listing or a product feed, with your own source and medium from the [UTM link builder](/tools/utm-link-builder).
- **Read your server logs for demand analytics can't see.** Hits from `ChatGPT-User` or `Perplexity-User` mean a user's request fetched your page. Our [AI crawler log analyzer](/tools/ai-crawler-log-analyzer) counts them per URL.

## Worked Example: Plannora Before and After the AI Channel

Plannora is a made-up project management app at plannora.io. The numbers are illustrative, not real data, but they add up.

### September: the same 30 days, two channel groups

| Channel | Default channel group | With the "AI assistants" channel | Change |
| --- | --- | --- | --- |
| Organic Search | 60,000 | 60,000 | 0 |
| Direct | 18,000 | 18,000 | 0 |
| Referral | 7,600 | 7,370 | −230 |
| Paid Search | 5,300 | 5,300 | 0 |
| Organic Social | 4,400 | 4,400 | 0 |
| Email | 3,850 | 3,850 | 0 |
| AI Assistant (Google's) | 720 | n/a | −720 |
| AI assistants (custom) | n/a | 1,000 | +1,000 |
| Unassigned | 130 | 80 | −50 |
| **Total** | **100,000** | **100,000** | **0** |

Where the 1,000 came from:

- **720 from Google's AI Assistant channel:** ChatGPT 610, Gemini 70, Copilot 40.
- **230 from Referral:** Perplexity 150, Claude 70, Mistral 8, Meta AI 2.
- **50 from Unassigned:** tagged `chatgpt.com / (not set)` sessions.

That's 720 + 230 + 50 = 1,000. AI's share of sessions rises from 0.72% to 1.0%, so Plannora's AI referral traffic is 39% bigger than the default view showed (280 ÷ 720).

Direct doesn't move, and it can't. Those 18,000 sessions carry no source for any rule to read.

### October: the fix that does move Direct

Plannora's server redirected `/pricing` to `/pricing/` and dropped the query string on the way. A ChatGPT click from an app that lost its referrer arrived with no tag, so GA4 filed it as Direct. In October the redirect was changed to keep the query string.

| Sessions landing on the redirected URLs | September | October |
| --- | --- | --- |
| Direct | 140 | 85 |
| AI assistants | 40 | 95 |
| Total | 180 | 180 |

With the total flat, 55 sessions moved from Direct into the AI channel. The channel group made AI visits visible. The redirect fix made more of them countable.

### Conversion rates, and when to trust them

| September | Sessions | Engaged sessions | Engagement rate | Signups (key event) | Session key event rate |
| --- | --- | --- | --- | --- | --- |
| AI assistants | 1,000 | 640 | 64% | 34 | 3.4% |
| Organic Search | 60,000 | 36,000 | 60% | 1,500 | 2.5% |

On paper, Plannora's AI referral traffic converts 36% better (3.4 ÷ 2.5 = 1.36). Don't put that on a slide yet.

At 1,000 sessions, the 95% margin of error on 3.4% is about ±1.1 points: 1.96 × √(0.034 × 0.966 ÷ 1,000). The true rate could be anywhere from 2.3% to 4.5%, a range that includes organic's 2.5%. A standard two-proportion test gives p ≈ 0.07, short of the usual 0.05 bar.

Pool three months at the same rates, 3,000 sessions and 102 signups, and the margin shrinks to about ±0.65 points, or 2.8% to 4.0%. Now the gap clears organic (p ≈ 0.002). To detect a gap this size reliably (80% power), plan on roughly 2,700 AI sessions.

Per-engine rates are weaker still. Perplexity's 150 sessions with, say, 8 signups give 5.3%, with a margin of ±3.6 points. Report engines by volume and trend, and keep conversion rates at the channel level.

## Compare AI Referral Traffic With Organic Search

The same comparison can live in three places. GA4 is fastest, Data Studio is best for sharing, and BigQuery is best for auditing.

### In GA4: one exploration with three tabs

1. Open **Explore** and start a **Free form** exploration.
2. Add dimensions: your session custom channel group, **Session source**, and **Landing page + query string**.
3. Add metrics: **Sessions**, **Engaged sessions**, **Engagement rate**, **Key events** and **Session key event rate**.
4. **Tab 1, the comparison:** rows by channel group, filtered to AI assistants and Organic Search.
5. **Tab 2, the engine split:** rows by Session source, filtered to AI assistants.
6. **Tab 3, the pages:** rows by landing page, filtered to AI assistants, sorted by key events.

Google defines [session key event rate](https://support.google.com/analytics/answer/9143382) as the share of sessions with at least one key event, and engagement rate as the share of engaged sessions: 10 seconds or longer, a key event, or two or more page views. If you mark several key events, compare the one that matters, such as the signup. In standard reports, the Key events metric has a [drop-down](https://support.google.com/analytics/answer/12571843) that narrows it to a single key event.

### ChatGPT traffic analysis in three checks

ChatGPT sends about three quarters of all AI referral traffic in SE Ranking's data, so give it its own monthly read.

- **Homepage share.** [SE Ranking found](https://seranking.com/blog/chatgpt-referral-traffic-may-2026/) that 60% of AI-referred visits land on homepages, against 17% from organic search, and that homepages were the biggest driver of ChatGPT's May 2026 jump, which analysts tie to brand names in answers becoming clickable. Value ChatGPT at the channel level, not only through the posts it links.
- **Tag health.** Count `chatgpt.com` sessions by medium. Any `(not set)` rows left outside your AI channel mean the source rule isn't matching.
- **Quality against organic.** Compare engagement rate and session key event rate over the same dates, for the same key event.

### In Data Studio (formerly Looker Studio)

Google [renamed Looker Studio](https://docs.cloud.google.com/data-studio/release-notes) back to Data Studio on 16 April 2026. You have two options there.

**Use your channel group.** Connect the property with Google's Analytics connector. After you create or edit the group, refresh the data source's fields and the custom channel group appears as a dimension, as [Analytics Mates](https://www.analyticsmates.com/post/google-looker-studio-how-to-use-custom-channel-grouping-in-looker-studio) shows.

**Rebuild it as a calculated field.** This works even if someone deletes the group in GA4:

```sql
CASE
  WHEN REGEXP_MATCH(Session source, r"^((www\.)?perplexity\.ai|chatgpt\.com|chat\.openai\.com|claude\.ai|gemini\.google\.com|copilot\.microsoft\.com|(www\.)?copilot\.com|(copilot|m365)\.cloud\.microsoft|(www\.)?meta\.ai|chat\.mistral\.ai|chat\.deepseek\.com|grok\.com|(www\.)?you\.com|(www\.)?phind\.com)$")
    OR Session medium = "ai-assistant" THEN "AI assistants"
  WHEN Session default channel group = "Organic Search" THEN "Organic Search"
  ELSE "Everything else"
END
```

Data Studio's [REGEXP_MATCH](https://docs.cloud.google.com/looker/docs/studio/regexpmatch) is a full match that uses RE2, and the `r` before the pattern saves you from escaping every backslash twice. Build the page from four scorecards, a weekly time series split by the new field, and tables by source and landing page. Google's [connector notes](https://docs.cloud.google.com/looker/docs/studio/connect-to-google-analytics) say GA4 segments and comparisons aren't available through the connector.

### In BigQuery: the raw export

GA4's [export schema](https://support.google.com/analytics/answer/7029846) holds three traffic-source records, and each answers a different question.

| Record | What it describes | Use it for |
| --- | --- | --- |
| `traffic_source` | How the user was first acquired; not filled in intraday tables | Users first won by an AI assistant |
| `collected_traffic_source` | Each event's values as collected, such as `manual_source` and `manual_medium` | Auditing tags, like ChatGPT hits with no medium |
| `session_traffic_source_last_click` | The session's last-click source, in `manual_campaign` and `cross_channel_campaign` sub-records | Session-level channel comparisons |

Custom channel groups [aren't in the export](https://support.google.com/analytics/answer/13051316), so rebuild the rule in SQL. BigQuery's [REGEXP_CONTAINS](https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/string_functions) is a partial match that uses RE2, which is why the regex keeps its `^` and `$`.

```sql
-- AI assistants vs Organic Search, last 28 full days
WITH events AS (
  SELECT
    user_pseudo_id,
    (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id') AS session_id,
    event_name,
    (SELECT COALESCE(value.string_value, CAST(value.int_value AS STRING))
       FROM UNNEST(event_params) WHERE key = 'session_engaged') AS session_engaged,
    LOWER(COALESCE(session_traffic_source_last_click.cross_channel_campaign.source,
                   session_traffic_source_last_click.manual_campaign.source)) AS source,
    LOWER(COALESCE(session_traffic_source_last_click.cross_channel_campaign.medium,
                   session_traffic_source_last_click.manual_campaign.medium)) AS medium
  FROM `your-project.analytics_123456789.events_*`
  WHERE _TABLE_SUFFIX BETWEEN
    FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 28 DAY))
    AND FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
),
sessions AS (
  SELECT
    user_pseudo_id,
    session_id,
    MAX(source) AS source,
    MAX(medium) AS medium,
    LOGICAL_OR(session_engaged = '1') AS engaged,
    LOGICAL_OR(event_name IN ('sign_up', 'generate_lead')) AS converted  -- your key events
  FROM events
  WHERE session_id IS NOT NULL
  GROUP BY user_pseudo_id, session_id
)
SELECT
  CASE
    WHEN REGEXP_CONTAINS(source, r'^((www\.)?perplexity\.ai|chatgpt\.com|chat\.openai\.com|claude\.ai|gemini\.google\.com|copilot\.microsoft\.com|(www\.)?copilot\.com|(copilot|m365)\.cloud\.microsoft|(www\.)?meta\.ai|chat\.mistral\.ai|chat\.deepseek\.com|grok\.com|(www\.)?you\.com|(www\.)?phind\.com)$')
      OR medium = 'ai-assistant' THEN 'AI assistants'
    WHEN medium = 'organic' THEN 'Organic Search'  -- close to GA4's Organic Search
    ELSE 'Everything else'
  END AS channel,
  COUNT(*) AS sessions,
  ROUND(COUNTIF(engaged) / COUNT(*), 3) AS engagement_rate,
  COUNTIF(converted) AS converting_sessions,
  ROUND(COUNTIF(converted) / COUNT(*), 4) AS session_key_event_rate
FROM sessions
GROUP BY channel
ORDER BY sessions DESC;
```

A second query audits what actually arrives. It reads the referrer and the collected tag on each `session_start` event, which carries `page_referrer` per Google's [event list](https://support.google.com/analytics/answer/9234069).

```sql
-- Audit: referrer hosts and collected tags on session starts
SELECT
  NET.HOST((SELECT value.string_value FROM UNNEST(event_params)
            WHERE key = 'page_referrer')) AS referrer_host,
  collected_traffic_source.manual_source AS tagged_source,
  collected_traffic_source.manual_medium AS tagged_medium,
  COUNT(*) AS session_starts
FROM `your-project.analytics_123456789.events_*`
WHERE _TABLE_SUFFIX BETWEEN '20260901' AND '20260927'
  AND event_name = 'session_start'
GROUP BY referrer_host, tagged_source, tagged_medium
ORDER BY session_starts DESC
LIMIT 200;
```

Scan it for assistant hosts. A tagged source of `chatgpt.com` with a null tagged medium is the tag-without-medium case from earlier. An assistant's referrer host with no tag is what your source rule has to catch.

A third query uses `traffic_source` to count users whose first visit came from an assistant. Run it on daily tables only.

```sql
-- New users first acquired by an AI assistant
SELECT traffic_source.source AS first_source, COUNT(DISTINCT user_pseudo_id) AS new_users
FROM `your-project.analytics_123456789.events_*`
WHERE _TABLE_SUFFIX BETWEEN '20260901' AND '20260927'
  AND event_name = 'first_visit'
  AND (traffic_source.medium = 'ai-assistant'
       OR REGEXP_CONTAINS(traffic_source.source, r'^((www\.)?perplexity\.ai|chatgpt\.com|chat\.openai\.com|claude\.ai|gemini\.google\.com|copilot\.microsoft\.com|(www\.)?copilot\.com|(copilot|m365)\.cloud\.microsoft|(www\.)?meta\.ai|chat\.mistral\.ai|chat\.deepseek\.com|grok\.com|(www\.)?you\.com|(www\.)?phind\.com)$'))
GROUP BY first_source
ORDER BY new_users DESC;
```

Swap in your own project, dataset and key event names, and expect small gaps against the GA4 interface: Google says the interface [estimates](https://support.google.com/analytics/answer/9191807) sessions from unique session IDs.

## Does AI Referral Traffic Convert Better? What Studies Say

| Study | Sample | AI result | Compared with |
| --- | --- | --- | --- |
| [Ahrefs](https://ahrefs.com/blog/ai-search-traffic-conversions-ahrefs/), June 2025 | Ahrefs' own site, 30 days | 0.5% of visitors brought 12.1% of signups; Ahrefs calls it 23 times the rate | Traditional organic search |
| [Microsoft Clarity](https://clarity.microsoft.com/blog/ai-traffic-converts-at-3x-the-rate-of-other-channels-study/), November 2025 | 1,277 publisher and news sites | Sign-up rate 1.66%, against 0.15% for search | Search, direct and social |
| [Amsive](https://www.amsive.com/insights/seo/does-llm-traffic-convert-better-than-organic-a-new-data-backed-study/), September 2025 | 54 sites, six months of GA4 data | 4.87% against 4.60%; not significant (p = 0.794) | Organic search |
| [Adobe](https://business.adobe.com/blog/ai-traffic-surge-retail-sites-not-machine-readable), April 2026 | More than 1 trillion US retail visits | Converted 42% better in March 2026, after 38% worse in March 2025 | All non-AI traffic |

These numbers don't agree because they don't measure the same thing. Ahrefs is one site with a strong brand, and Clarity measures sign-up prompts on publisher sites. Amsive and Adobe conflict most directly: Amsive compares AI with organic search across many sites and finds no reliable gap, in B2B or B2C, while Adobe finds a large premium against all non-AI traffic, including email and paid search, in retail only. A year earlier, the same Adobe series showed AI visitors converting worse.

So there's no standard premium for AI referral traffic to plug into a forecast. Report your own AI channel against your own Organic Search, for one key event, over enough sessions. Amsive's stricter sample required at least 50 AI sessions and 5 AI conversions per site, and even that is a low bar.

## The Weekly AI Referral Traffic One-Pager

A one-page report you can rebuild in GA4 or Data Studio in an hour: six cards, each with a fixed dimension and one question.

| Card | Dimension | Metrics | What you're looking for |
| --- | --- | --- | --- |
| 1. Headline | AI assistants channel | Sessions this week, last week and the 4-week average; share of all sessions | The trend, not the size |
| 2. Engine split | Session source, AI assistants only | Sessions, key events | Which assistants grow, and any new host |
| 3. AI vs organic | Channel group: AI assistants and Organic Search | Engagement rate, session key event rate for one key event | The gap and its direction, with the session count beside it |
| 4. Landing pages | Landing page + query string, AI assistants only | Sessions, key events | Homepage share, and pages that turn AI visits into signups |
| 5. Leak watch | Referral, Unassigned, and Direct on deep pages | AI-looking Referral hosts, `chatgpt.com` in Unassigned, Direct landings | Rules to update and redirects to fix |
| 6. Notes | None | One line of commentary, one action | What changed, and what you'll do |

Read cards 1, 2 and 5 every week. Cards 3 and 4 move slowly, so judge them monthly, once the channel has enough sessions to trust. Recheck the regex each quarter and log every rule change in the notes card, since a new rule changes past numbers too. For the monthly view across crawls, citations, clicks and conversions, use the report template in our [GEO measurement guide](/blog/how-to-measure-geo).

## Where Rankbox Fits in This Setup

Rankbox doesn't track AI citations or analyze your analytics today. Everything above runs on GA4, Data Studio and BigQuery. To see how often assistants name you before anyone clicks, you need a tracker; our [ChatGPT rank tracker roundup](/blog/chatgpt-rank-tracker) compares them.

What Rankbox does is the step before the click. [Answer-Space Research](/features/answer-space-research) maps the questions your buyers ask ChatGPT, Perplexity and Google, and the [Citation-Ready Writer](/features/citation-ready-writer) turns them into source-backed articles built to be quoted. Your AI assistants channel then shows whether those pages earn AI referral traffic that converts. [See plans and pricing](/pricing).

## Frequently Asked Questions

### Does GA4 track AI referral traffic automatically?

Partly. Since 13 May 2026, GA4 puts sessions from recognized assistants in an AI Assistant channel, and Google's definition names ChatGPT, Gemini, DeepSeek, Copilot and Grok. It doesn't name Perplexity, it can't see clicks that lose their referrer, and it excludes Google's AI Overviews and AI Mode. A custom channel placed above Referral fills most of the gaps.

### Why does Perplexity traffic show up as Referral in GA4?

Usually because Google's AI Assistant channel doesn't recognize it. Google's definition doesn't name Perplexity, and analysts report its clicks still arrive as a `perplexity.ai` referral, which the default rules file under Referral. Add a custom channel whose source regex includes `(www\.)?perplexity\.ai`, and place it above Referral.

### What regex should I use for AI referral traffic in GA4?

Use exact hostnames with a full-match pattern, not the broad sample on Google's help page. The regex in this guide covers ChatGPT, Perplexity, Claude, Gemini, Copilot, Meta AI, Mistral, DeepSeek, Grok, You.com and Phind. It passed a 54-host test in RE2 and avoids false matches such as gemini.com or any .ai startup.

### Will a custom channel group change my historical GA4 data?

It changes how past data is grouped in reports, not the data itself. Google says custom channel groups can be applied retroactively, so a new channel re-sorts older AI referral traffic too. Making a group your primary channel group only applies going forward. Keep a dated log of rule changes, because each edit re-sorts past numbers too.

### How do I find ChatGPT traffic in Google Analytics?

Open Traffic acquisition, set the dimension to Session source / medium, and search for `chatgpt.com`. You may see it under `ai-assistant`, `referral` or `(not set)`, because ChatGPT tags links with a source but no medium. A custom channel that matches the source `chatgpt.com` gathers all three.

### Does AI referral traffic convert better than organic search?

Sometimes, and the studies disagree. Ahrefs saw 23 times the signup rate on its own site, while Amsive found no significant difference across 54 sites. Adobe's retail data swung from AI converting worse in 2025 to better in 2026. Compare your own AI channel with Organic Search, for one key event, over at least a quarter.

## References

1. [Default channel group, Google Analytics Help](https://support.google.com/analytics/answer/9756891)
2. [Custom channel groups, Google Analytics Help](https://support.google.com/analytics/answer/13051316)
3. [What's new in Google Analytics, Google Analytics Help](https://support.google.com/analytics/answer/9164320)
4. [About regular expressions (regex), Google Analytics Help](https://support.google.com/analytics/answer/1034324)
5. [Campaigns and traffic sources, Google Analytics Help](https://support.google.com/analytics/answer/11242841)
6. [Analytics dimensions and metrics, Google Analytics Help](https://support.google.com/analytics/answer/9143382)
7. [BigQuery Export schema, Google Analytics Help](https://support.google.com/analytics/answer/7029846)
8. [Publishers and Developers FAQ, OpenAI Help Center](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq)
9. [Google Analytics adds AI Assistant as a default channel group, Search Engine Journal](https://www.searchenginejournal.com/google-analytics-adds-ai-assistant-as-default-channel-group/574974/)
10. [REGEXP_MATCH, Data Studio documentation](https://docs.cloud.google.com/looker/docs/studio/regexpmatch)
11. [Data Studio release notes, Google Cloud](https://docs.cloud.google.com/data-studio/release-notes)
12. [String functions (REGEXP_CONTAINS), BigQuery documentation](https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/string_functions)
13. [Referrer-Policy header, MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy)
14. [Are AI sites like ChatGPT sending your website traffic?, Seer Interactive](https://www.seerinteractive.com/insights/are-ai-sites-like-chatgpt-sending-your-website-traffic)
15. [AI search engine traffic study, SE Ranking](https://seranking.com/blog/ai-traffic-research-study/)
16. [AI search traffic conversions at Ahrefs, Ahrefs](https://ahrefs.com/blog/ai-search-traffic-conversions-ahrefs/)
17. [Does LLM traffic convert better than organic?, Amsive](https://www.amsive.com/insights/seo/does-llm-traffic-convert-better-than-organic-a-new-data-backed-study/)
18. [US retailers see surge in AI traffic, Adobe](https://business.adobe.com/blog/ai-traffic-surge-retail-sites-not-machine-readable)
19. [AI traffic converts at 3x the rate of other channels, Microsoft Clarity](https://clarity.microsoft.com/blog/ai-traffic-converts-at-3x-the-rate-of-other-channels-study/)
