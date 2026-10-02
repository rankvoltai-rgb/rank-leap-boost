---
title: Content plan and calendar
nav_title: Content plan
description: How topics become scheduled articles: ideas, the autopilot queue, article statuses, the Calendar, moving dates, and what happens when credits run out.
order: 2
updated: 2026-10-02
---

Your content plan is every article Rankbox has lined up for a site: ideas you haven't committed to, articles scheduled for autopilot, articles being written and articles that are done. You manage it on three pages: **Articles** (the full list), **Calendar** (the same articles by day) and the **Overview** (the queue at a glance). This page explains how the plan is built, what each status means, and how to change it.

## How the plan is built

The plan starts in onboarding. [Research](/docs/content/research) proposes one article per keyword, up to 30, in publishing order. When you click **Confirm plan**:

- The first 4 topics become **ideas**. They have no date and nothing writes them until you decide.
- The rest become **scheduled** articles in the autopilot queue, one a day, starting the day after you confirm.

New ideas appear when you click **Plan it** on a keyword gap on the Rank page. After that, the plan changes only when you act on it: scheduling ideas, moving dates, writing early or deleting.

## Article statuses

Every article on a site is in one of four stages. Calendar and the article panel also show **Overdue** for scheduled articles whose day has passed.

| Status in the UI | Stored status | Meaning | Article credit |
| --- | --- | --- | --- |
| **Idea** | `opportunity` | A planned topic with a title, keyword and brief. Not on the schedule | None |
| **Scheduled** | `scheduled` | In the autopilot queue with a day. Autopilot writes it when its turn comes | One, when it's written |
| **Overdue** | `scheduled` | Scheduled for a day that has passed and still not written | One, when it's written |
| **Writing** | `generating` | Being written right now, by you or by autopilot | One, reserved |
| **Published** | `finished` | Written and finished. Only these articles appear in the REST API and get pushed to a connected Webflow or Shopify site | One if Rankbox wrote it; none if you wrote it yourself |

> [!IMPORTANT]
> **Published** means the article is finished in Rankbox. It reaches your website only through a connection: the [REST API](/docs/publishing/custom-sites), or a Webflow or Shopify connection. See [How publishing works](/docs/publishing/overview).

## The Articles page

**Dashboard → Articles** lists every article on the active site, from first idea to published. The sidebar shows a count next to **Articles**: the number of scheduled and writing articles on the site. The count is hidden when it's zero.

### Tabs and columns

| Tab | What it lists | Columns |
| --- | --- | --- |
| **All** | Every article: writing first, then scheduled, published, ideas | Article, Status, Date, Est. traffic, SEO |
| **Ideas** | Ideas, highest Est. traffic first | Article, Competition, AI signal, Est. traffic |
| **Scheduled** | Scheduled and writing articles, in the order autopilot writes them | Article, Status, Writes on, Est. traffic |
| **Published** | Finished articles, most recently updated first | Article, Updated, Est. traffic, SEO |

The SEO column shows the [SEO and GEO score](/docs/content/scoring) for published articles: green at 80 or more, amber at 55 to 79, red below 55.

### Find and open articles

- Press `/` to jump to **Search articles**. Search matches titles and keywords. Press Escape to clear it.
- Click a row to open the article in a panel that slides over the list. The open article is in the URL, so you can refresh, share the link or use the browser's back button.
- Hover a row that has no text yet and click the bolt icon to write it now. The button reads **Write now**, or **Upgrade to write** when the site has no credits left.

Everything you can do inside the panel is covered in [Editing articles](/docs/content/editor).

## Schedule an idea

1. Open the idea from **Articles → Ideas**, or find it in **Content gaps to win** on the Overview.
2. Click **Schedule** in the panel, or the **+** button (**Add to queue**) on the Overview.
3. The idea becomes a scheduled article dated tomorrow, at the front of the queue. You see "Scheduled. Autopilot will write it." on Articles, or "Added to queue" with the article's Est. traffic on the Overview.

To write an idea straight away instead, click **Write now**. That spends one article credit and skips the queue.

## The Calendar

**Dashboard → Calendar** shows what has been published and when autopilot writes the rest.

### Month view

The month grid shows up to 3 articles per day. Click **+N more** to see the rest of a day. The header shows the month's totals, for example "12 articles · 5 published · 4,200 est. visits/mo". Use the arrows to change month and **Today** to come back.

| Chip | Where it sits |
| --- | --- |
| **Published** (check mark) | On the day it was planned or the day it was written, whichever is earlier. An article that never had a date sits on the day it was last saved |
| **Writing now** (spinner) | On today |
| **Scheduled** (dot) | On its scheduled day |
| **Overdue** (amber dot) | On the day it was due |

Ideas don't appear on the Calendar. They stay on the Articles page until you schedule them.

### Agenda view

**Agenda** lists what's coming, grouped by day (**Today**, **Tomorrow**, then weekdays). Overdue articles come first in a group of their own, marked "Not written yet". On a phone, Calendar always shows the agenda.

## Move an article to another day

Only **Scheduled** and **Overdue** articles move. Published articles and articles being written stay where they are.

1. In the month view, drag the article's chip onto another day. You can't drop it on a day in the past.
2. Or open the article and click the date next to **Writes on** (or **Was due**) to pick a day. Past days are disabled.
3. Rankbox saves the move at once and shows "Moved to" the new date, with **Undo**.

Moving an article also reorders the queue to match the dates, so the order autopilot writes in always follows the calendar. Scheduled articles with no day appear above the grid under "No day yet. Drag onto the calendar to schedule."

## Pace and how many articles a month

Autopilot writes at the pace you set in **Settings → Autopilot → Pace**. Changing the pace re-spaces every scheduled article from tomorrow, in the current order, and offers **Undo**.

| Pace | About this many articles a month |
| --- | --- |
| Every day (the default) | 30 |
| 5 a week | 22 |
| 3 a week | 13 |
| 2 a week | 9 |
| 1 a week | 4 |

Your plan's article credits cap what gets written: 30 a month per site on the Business plan, 7 during the free trial. If your pace needs more than your allowance, the Pace setting warns "autopilot will run out before the month ends". Details are in [Plans and credits](/docs/account/plans-and-credits).

## When credits run out

Each article written uses one article credit from the site's monthly allowance. When the site has none left:

- Autopilot stops writing for that site. The bar on Articles and Calendar reads "Autopilot has used this month's articles".
- **Write now** opens a dialog that reads "You've used all 30 articles this month" (or your total).
- Scheduled articles stay in the queue. As their days pass, they turn **Overdue**.
- When the billing period renews, the allowance resets and autopilot carries on in queue order. Unused credits don't carry over.

To catch up after a gap, click **Re-plan from tomorrow** in the autopilot bar. It keeps the queue's order and lays every scheduled article out again from tomorrow at your pace, with **Undo**. The button appears when articles are overdue and autopilot can run (on or paused).

## Remove articles from the plan

- **Delete one article.** Open it, click the **More actions** menu (**…**), then **Delete article** and confirm. This permanently deletes the article from Rankbox.
- **Remove from the Overview queue.** The trash button on an **Autopilot queue** row (**Remove from queue**) also deletes the article. It doesn't just unschedule it.

> [!WARNING]
> Deleting can't be undone and doesn't return the credit of an article that was already written. A copy already sent to your website stays there; delete it in your CMS if you want it gone.

## The Overview

The Overview shows the plan at a glance:

- **Autopilot queue**: articles being written and scheduled, with filters **All**, **Scheduled** and **Writing**, and a **Generate now** button on each row.
- **Publishing schedule**: the next 7 days. A dot marks days with something scheduled. Click a day to see its articles, or **Open calendar**.
- **Content gaps to win**: your ideas, each with a **+** button to add it to the queue.

## Related

- [Research: the questions buyers ask AI](/docs/content/research): where the plan's topics come from
- [Autopilot and the publishing schedule](/docs/content/autopilot): how the queue is worked through
- [Editing articles](/docs/content/editor): everything in the article panel
- [Plans and credits](/docs/account/plans-and-credits): allowances, resets and the trial
- [How publishing works](/docs/publishing/overview): getting published articles onto your site
