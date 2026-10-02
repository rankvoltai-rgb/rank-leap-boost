---
title: Reddit Presence
description: How Reddit Presence finds the threads your buyers read, drafts a disclosed reply you post yourself, checks it, and tracks the thread afterwards.
order: 2
updated: 2026-10-02
---

Reddit Presence finds Reddit threads where your brand has something useful to say, drafts a reply that discloses who you are, and checks it against the things that get replies removed. You post the reply yourself, from your own Reddit account, and paste the link back so Rankbox can confirm it and keep a dated record of the thread.

Rankbox never posts to Reddit and never holds a Reddit credential. There is no Reddit login anywhere in the product. You find the feature at **Dashboard → Reddit**.

## Who can use Reddit Presence

Reddit Presence is part of the paid plan only. It is not part of the free trial, and it opens with your first paid invoice. Replies go out under a real person's name in threads that stay readable long after any trial, so it isn't something to hand a throwaway account.

| Access | When it applies | What **Dashboard → Reddit** shows |
| --- | --- | --- |
| Paid | The plan is active, or cancelled or past due after at least one paid period, and the site is live on the plan | The full feature |
| Trial | Your subscription is still in its free trial | **Part of the paid plan**, with the date it opens and a **See your plan** link, over a blurred static preview |
| Lapsed | You switched the feature on before and the plan is no longer paid, or the Studio site was removed | Your history, read-only, with a **Your plan has lapsed.** banner |
| None | No plan has been started | **Reddit presence comes with the plan**, with a **Start 7-day free trial** button |

A cancelled plan keeps access until the end of the period you already paid for. A failed payment keeps access for a 48-hour grace window, and only for a subscription that was paid at least once.

Everything in Reddit Presence belongs to one site: its settings, threads, drafts and credits. If you run several sites with [Studio](/docs/account/studio), each has its own.

## When Reddit discovery isn't switched on

Sweeps rely on a third-party Reddit and search data provider. If no provider is connected for the workspace, **Dashboard → Reddit** shows a card titled **Reddit discovery isn't switched on yet**, explaining that no threads have been searched for and that nothing on the page is stale or wrong. The same card appears if the page can't load its data.

This card is shown on purpose instead of an empty table, because an empty table would read as "we looked and found nothing". A manual sweep in this state is refused with **Reddit discovery isn't switched on for this workspace yet.**

## Set up Reddit Presence

Before you start, add your brand name to the site in **Dashboard → Settings**. Every reply has to say who you are, so setup is refused without one.

1. Open **Dashboard → Reddit**.
2. Under **Before the first sweep**, check **Your disclosure line**. The default is `Full disclosure: I work on {brand}.`, where `{brand}` becomes your brand name.
3. Fill in **Your space**: what you know enough about to be useful on.
4. Click **Run my first sweep**. Sweeps are free; only drafting a reply spends a credit.

Sweeps search for your site's keywords, so the site needs keywords first. See [Research](/docs/content/research).

## How sweeps find threads

A sweep turns your site's keywords into a ranked list of Reddit threads. It uses the site's 12 keywords with the highest search volume, from both your tracked and discovered keywords.

1. **Google results.** For each keyword, Rankbox reads Google's results (US, desktop) and keeps the Reddit threads, with the position each one was measured at.
2. **Reddit search.** For the top eight of those keywords, Rankbox searches Reddit itself for threads with activity that may not rank yet.
3. **Loading threads.** Threads found only in Google are loaded from Reddit, best-ranked first, up to 25 per sweep: title, post, votes, comment count, top comments, and whether the thread is locked, archived or removed.
4. **Subreddit rules.** Rankbox reads the rules of subreddits it hasn't read in the last 30 days, up to six per sweep. If the rules can't be read, they are recorded as unavailable, never as "no rules".
5. **AI engine checks.** When AI engine checks are enabled for the workspace, Rankbox asks them about your top three keywords and records which threads each answer cited, and which it didn't.
6. **Scoring.** Every thread is scored for your site and added to **Opportunities**.

A sweep that hits an error or its spending cap partway through finishes as partial and keeps what it found. A thread Rankbox found but couldn't load shows **Not fully loaded yet** instead of zero votes.

### Manual and automatic sweeps

Click **Run a sweep** on the **Opportunities** tab to sweep now. Manual sweeps are limited to one every ten minutes per site, and share the per-person limit on AI requests (12 a minute by default).

With **Weekly sweep** on in **Settings**, Rankbox sweeps your site automatically and periodically, never more often than once every six days. A sweep that doesn't start is a normal outcome:

| Reason | What you see |
| --- | --- |
| A sweep is already running | **A sweep is already running.** |
| A manual sweep less than ten minutes after the last | **You ran a sweep a moment ago. Give it a little while.** |
| The site isn't on a paid plan | **Sweeps are part of the paid plan.** |
| No discovery provider is connected | **Reddit discovery isn't switched on for this workspace yet.** |
| The site has no keywords, or the feature isn't set up | **The sweep didn't start.** |

## How threads are scored

Each thread gets a score for your site. The table shows it as **Fit**, a number from 0 to 100, which is an estimate of how worthwhile the thread is, not a prediction of results.

| Signal | Weight | Kind | What it means |
| --- | --- | --- | --- |
| Google position | 0.22 | Measured | Higher for threads ranking near the top for your keyword; nothing past position 30 |
| Cited by an AI engine | 0.18 | Measured | Only when an AI engine was asked and cited the thread |
| You have something to say here | 0.20 | Derived | How close the thread is to your keywords, product description, niche and topics, with a bonus for question-shaped threads |
| Subreddit fits your space | 0.12 | Derived | How close the subreddit is to your niche, topics and keywords |
| Votes and comments | 0.10 | Measured | Engagement on the thread |
| Still active | 0.10 | Derived | Comments per day |
| Recent | 0.08 | Derived | Newer threads score a little higher |
| Self-promotion risk | minus 0.35 | Derived | How strictly the subreddit's rules limit promotion; unread rules count as a modest risk |

A year-old thread at position 2 deliberately outscores a fresh thread nobody will find. A thread no AI engine was asked about scores the same zero on that signal as one that was asked and not cited, so the ranking never depends on what Rankbox could afford to check. Open any thread and click **How this was ranked** to see every term.

## Why a thread is blocked

Some threads can't or shouldn't get a reply. Rankbox doesn't hide them: they appear under the **Blocked** filter with the reason, and Rankbox won't draft for them.

| Reason | What the dashboard says |
| --- | --- |
| Archived | Archived — Reddit locks replies after about 6 months. |
| Likely archived | Probably archived — it's over 6 months old. We couldn't confirm it, so open the thread to check. |
| Locked | Locked by a moderator, so nobody can reply. |
| Removed | The post was removed. |
| Self-promotion banned | This subreddit bans self-promotion, so Rankbox won't draft for it. |
| Denied subreddit (on your deny list, or not on your allowlist when you've set one) | This subreddit is on your deny list. |
| Off topic | Too far from what you write about to say anything useful. |

The off-topic floor is a topical-fit score of 0.15. Below it your brand has nothing true to say in the thread, and a well-phrased question about something else is still off topic.

> [!IMPORTANT]
> A subreddit whose rules ban self-promotion is refused at any score, and adding it to **Only these subreddits** doesn't bring it back. Rankbox reads rules conservatively: it would rather skip a subreddit that might have tolerated a reply than draft for one that bans them.

A rule that only limits promotion, such as a weekly promotion thread, moderator approval, or a 9:1 ratio, is not treated as a ban.

## Read the Opportunities tab

The **Opportunities** tab lists the threads a sweep found, best first, with filters: **All open**, **Ranks on Google**, **AI-cited**, **Fresh** (posted in the last 7 days), **Drafted** and **Blocked**. Each row shows what Rankbox measured, the thread's activity, and its **Fit**, or **Why not** for blocked threads.

The evidence badges say only what Rankbox measured, and when:

| Badge | Meaning |
| --- | --- |
| A Google position such as #3 | The thread was at that position for that keyword, at the time shown |
| **No Google position measured** | The thread wasn't in the Google results Rankbox measured; it may rank for searches Rankbox didn't run |
| **Cited by** an engine | That AI engine cited the thread when asked about your keyword, at the time shown |
| **AI checked — not cited** | AI engines were asked and didn't cite the thread |
| **AI not checked** | No AI engine was asked about this thread; this says nothing either way |

"Not checked" and "checked, not cited" are different facts and always look different. Open a thread to see the post, what people have already said, and the reply panel. Click **Not for me — dismiss** to hide it, or **Restore to my list** to bring it back.

## Draft a reply

Open a thread and click **Draft a reply · 1 credit**. Rankbox writes one reply for that thread and runs the compliance checks on it.

- **Refusals cost nothing.** Rankbox checks first whether it should draft at all: blocked threads, threads that can't be replied to, and threads where you already have a standing reply are refused before any credit is spent.
- **Failures are refunded.** If the draft can't be written or saved, the credit is returned.
- **One automatic retry.** If the first draft fails a check the writer can fix, such as a missing disclosure or the wrong length, Rankbox asks once more for free and keeps the better result.
- **Rewrites.** Click **Rewrite · 1 credit** for a new version. The first rewrite of a draft that failed its checks is free (**Rewrite — free, this one failed its checks**). Each draft can be rewritten at most three times; after that, edit it by hand.
- **Edits are free.** Edit the text in **Suggested reply**. Rankbox re-runs the checks a moment after you stop typing.

The writer is told to answer the question first, mention your brand at most once and only where it fits, name a better tool if there is one, never run a competitor down, add something the comments haven't said, keep to your link limit, and write 250 to 900 characters like a person on Reddit. It may state nothing about your product that isn't in your product description.

## The disclosure line

Every draft must contain your disclosure line. It can be reworded in **Settings**, but there is no setting that removes it.

A valid disclosure line is 10 to 200 characters, names your brand (directly or with `{brand}`), and says in the first person that you are connected to it, for example "Full disclosure", "I work on", "I'm the founder of" or "I built". If the line doesn't qualify, setup and settings are refused with **Your disclosure line has to name your brand and say, in the first person, that you work on it.**

If you edit the disclosure out of a draft, the **Discloses that you work there** check fails, and a draft with a failed check can't be copied.

## Compliance checks

Every draft and every edit is checked by a fixed set of rules, separate from the writer. Each check has three possible states: **Passes**, **Needs fixing**, or **We couldn't check this**. A check Rankbox couldn't run is never rounded up to a pass.

| Check | What it looks for |
| --- | --- |
| **Discloses that you work there** | Your disclosure line, or one sentence that names your brand and states your connection in the first person |
| **Answers the question first** | Your brand doesn't come up before the reply has helped |
| **No bare link drops** | No more links than your limit, no link in the opening sentence, and not mostly a link |
| **Follows r/subreddit rules** | Fails if the subreddit bans self-promotion, or bans links and the reply has one. Can't be checked if the rules couldn't be read, or if the subreddit has a ratio rule that depends on your own posting history |
| **A real answer, not a drive-by** | Between 120 and 2,500 characters |
| **Sounds like a person** | No ad copy such as "game-changer", "seamless", "leverage", calls to action or offers |
| **Fair to the alternatives** | Doesn't run down a named competitor. No competitor list is on file today, so this check passes with a note saying so |

Under the list, a summary such as "6 of 7 checks pass · 1 we couldn't run" and a verdict: **Fix this before you post**, **Ready — after you check the rest yourself**, or **Ready for you to post**. **Copy reply** is disabled until no check fails and the reply is within 2,500 characters.

## Post the reply yourself

Rankbox stops at the draft. Reading it as yourself, deciding it belongs in the conversation, and posting it are yours.

1. Click **Copy reply**.
2. Click **Open thread** and read the thread once more.
3. Post the reply from your own Reddit account. If it doesn't fit the conversation, don't post it.
4. On your posted comment, use **⋯ → Copy link**.
5. Back in Rankbox, paste it under **Posted it? Paste the link to your comment** and click **I posted this**.

The link must be a reddit.com link to your comment in this thread. Rankbox refuses share links, links to the thread instead of the comment, and links to a different thread, each with a message saying what to copy instead.

If you click **Skip the link**, Rankbox records that you posted but can't verify it. You can add the link later with **Add link**.

### One standing reply per thread

You can have one standing reply per thread, per person. The rule follows you, not the site: if any of your sites already has a reply recorded in a thread, Rankbox won't draft or record another one there. Two replies from one account in one thread is the pattern that gets accounts actioned.

## Reply statuses

| Status | Dashboard label | What it means |
| --- | --- | --- |
| claimed | **Posted — unverified** | You said you posted but gave no link. Never counted in any measured total |
| posted | **Checking** | You gave the link; the comment isn't confirmed yet |
| confirmed | **Live** | Rankbox found your comment at the link |
| removed | **Removed** | Your comment was there and no longer is, removed by a moderator or deleted |
| not_found | **Not found** | Three checks in a row couldn't find a comment at that link |

A claimed reply stays out of measured totals because it is your word, not something Rankbox saw. The **Live mentions** card counts confirmed replies only, and shows how many replies are not verified.

## Verification and the Mentions tab

Replies with a link are checked periodically: a confirmed reply no more often than every seven days, and a reply that couldn't be found no more often than once a day. Click **Check now** on a reply to check it straight away. A check Rankbox couldn't complete changes nothing about the reply.

For threads where your reply is live, Rankbox periodically re-measures votes and comments and keeps every reading. Google positions are recorded each time a sweep finds the thread for one of your keywords.

The **Mentions** tab shows each reply with a dated timeline: when you replied, when Rankbox found your comment, Google positions it measured, and removal if it happened. Every point on it was measured; nothing is projected.

Verification never moves credits. A reply a moderator removes costs nothing more and refunds nothing: Rankbox sold a draft, not an outcome.

## Reddit reply credits

Each paid site gets 30 reply credits per billing period on the Business plan. One credit drafts one reply, and rewrites after the first free one cost one credit each. Sweeps, edits and checks are free.

Reply credits reset each billing period: an unused month doesn't carry over. The **Reply credits** card shows your balance and the reset date. There is no trial allowance. A Studio site's first period is prorated from the day it was added.

When the balance runs out, drafting stops with **You're out of reply credits for this cycle.**

## Opportunity statuses

| Status | Meaning |
| --- | --- |
| new | Found by a sweep, nothing done yet |
| saved | Treated as open, like new |
| drafted | A draft exists and is waiting on you |
| posted | You recorded a reply |
| dismissed | You set it aside with **Not for me — dismiss** |
| dead | The thread can no longer be replied to: archived, locked or removed |
| stale | Found a month ago and never acted on |

A thread is open when it is new, saved or drafted and not blocked. A thread you replied in can't be dismissed: that record is yours to keep.

## Reddit settings reference

Open the **Settings** tab and click **Save changes**. Saving re-ranks your existing threads for free.

| Setting | What it does |
| --- | --- |
| **Disclosure line** | The sentence every draft must contain. Reword it any time; it can't be removed |
| **Your space** | Your niche, used to judge which threads you can help in |
| **Links per reply** | **None** or **One at most** (the default) |
| **Topics** | Up to 12 subjects, used to judge whether a thread is one you can help in |
| **Never these subreddits** | Up to 50 subreddits whose threads are set aside, whatever they rank for |
| **Only these subreddits** | Up to 50. Leave empty to consider every subreddit. Self-promotion bans still apply |
| **Weekly sweep** | Turns automatic sweeps on or off |

## Lapsed plans

When your plan is no longer paid, your history stays and the replies you posted are still yours. No new sweeps run and no replies are drafted until you resubscribe. Replies with links are still checked, so you'll still see if a comment was removed.

## Reddit Presence FAQ

### Will my replies get removed?

Rankbox makes removal less likely, not impossible. Every draft discloses who you are, answers first and is checked against the subreddit's rules where they can be read, and Rankbox won't draft for subreddits that ban self-promotion. Moderators still decide.

### Can Rankbox post for me?

No. Rankbox has no Reddit account, asks for no Reddit credential, and has no code path that posts. You copy the reply and post it yourself.

### Why does a thread show no Google position?

It wasn't in the Google results Rankbox measured for your keywords. It may still rank for searches Rankbox didn't run.

### Does Reddit Presence promise traffic or AI citations?

No. It shows what was measured, with dates. What a thread does for your brand depends on Reddit, search engines and AI engines.

## Related

- [The backlink exchange](/docs/growth/backlink-exchange) — the other paid-only growth feature
- [Research: the questions buyers ask AI](/docs/content/research) — where your site's keywords come from
- [Plans and credits](/docs/account/plans-and-credits) — monthly allowances on the paid plan
- [The free trial](/docs/account/free-trial) — what the trial includes
- [Studio: run several sites](/docs/account/studio) — per-site settings and credits
