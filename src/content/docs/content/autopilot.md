---
title: Autopilot and the publishing schedule
nav_title: Autopilot
description: What Rankbox autopilot does on each run, the pace options, what it needs to write, pausing and resuming, and how it sends articles to Webflow and Shopify.
order: 7
updated: 2026-10-02
---

Autopilot writes your scheduled articles for you. For each site, it takes the next article in the queue, writes it with the same pipeline as **Write now**, marks it **Published**, and sends it to the site's Webflow or Shopify connection if it has one. It runs on Rankbox's servers, so your dashboard doesn't need to be open. You control it with one switch and one pace setting per site.

## What autopilot needs to write

Autopilot writes for a site only when all of these are true. A connected website is not one of them.

| Requirement | Where to check it |
| --- | --- |
| Autopilot is switched on for the site (it is by default) | **Settings → Autopilot → Write automatically** |
| The account has a free trial or paid plan that allows writing | **Plan & Billing** |
| The site is active (a Studio site also needs a paid plan) | **Studio** |
| The site has at least one article credit left this billing period | **Overview → Article credits** |
| At least one article is **Scheduled** | **Articles → Scheduled** or **Calendar** |
| Enough time has passed since autopilot's last article for the site, at your pace | See [Pace and timing](#pace-and-timing) |

A trial whose card couldn't be verified doesn't write. A plan whose payment failed keeps writing for 48 hours. A cancelled plan keeps writing until the end of the period you've paid for. Details are in [Billing, invoices and cancellation](/docs/account/billing).

## What happens on each run

Autopilot works in runs on Rankbox's servers. In each run, it goes through every site that has autopilot switched on, one after another:

1. **Checks timing.** It skips the site if not enough time has passed since its last autopilot article. A site that has never had one is due straight away.
2. **Checks the plan.** It skips the site if the account or site can't write right now. Nothing is charged.
3. **Reserves a credit.** It takes one article credit from the site. If none are left, it skips the site.
4. **Picks the next article.** It takes the scheduled article with the lowest queue position, then the earliest date. If nothing is scheduled, it returns the credit and skips the site.
5. **Writes it.** The article shows as **Writing** while Rankbox researches, drafts, revises and adds a video, exactly as in [How articles are written](/docs/content/writing). It uses the site's brand brief and can carry a [backlink exchange](/docs/growth/backlink-exchange) link.
6. **Saves it.** The article becomes **Published** and the time is recorded. That time sets when the site is next due.
7. **Sends it.** If the site has a Webflow connection, the article goes to Webflow; if it has a Shopify connection, it goes to Shopify.

Autopilot writes at most one article per site per run. If writing fails, the article goes back to **Scheduled**, the credit is returned, and the site stays due, so the article is tried again on a later run.

## Pace and timing

Pick the pace in **Settings → Autopilot → Pace**. The default is **Every day**.

| Pace option | Minimum gap between autopilot articles | About this many a month |
| --- | --- | --- |
| **Every day** | 1 day | 30 |
| **5 a week** | 1.4 days | 22 |
| **3 a week** | 2.3 days | 13 |
| **2 a week** | 3.5 days | 9 |
| **1 a week** | 7 days | 4 |

The minimum gap is 7 days divided by the pace, less one hour of tolerance. It's measured from autopilot's last successful article for that site. Because a site is only written for during a run, the real gap is the first run after the minimum gap has passed. Rankbox has no time-of-day setting and doesn't publish at a fixed hour.

Three rules decide what gets written and when:

- **Order comes from the queue.** Autopilot always takes the next article in queue order. It doesn't wait for an article's date: when the site is due, it writes the next article even if that article is dated later.
- **The calendar sets the order.** Moving an article on the [Calendar](/docs/content/content-plan#the-calendar) renumbers the queue to match the dates, so the calendar order is the writing order.
- **Manual writing doesn't reset the clock.** Writing an article yourself with **Write now** doesn't change when autopilot is next due. Its next run takes the next article still in the queue.

Changing the pace re-spaces every scheduled article from tomorrow, in the current order, and shows a toast such as "Autopilot now writes 3 times a week." with **Undo**. Under the options, Rankbox shows "About N articles a month" and how many your plan covers. If the pace needs more than your plan covers, it adds "autopilot will run out before the month ends".

## Turn autopilot on or off

1. Open **Dashboard → Settings** and scroll to **Autopilot** ("Whether it writes, and how often.").
2. Use the **Write automatically** switch. It reads "On — writing every day" (or your pace) or "Paused". You see "Autopilot is on." or "Autopilot paused."

You can also click **Pause** or **Resume** in the autopilot bar on the Articles and Calendar pages. Pausing from the bar offers **Undo**.

Pausing stops new writing for that site only. Scheduled articles stay in the queue and nothing is lost; as their days pass, they show as **Overdue**. Before you start a trial, the switch is replaced by a **Start free trial** button with the note "Autopilot starts writing when your free trial does."

## Read autopilot's status

### The autopilot bar

The bar sits at the top of **Articles** and **Calendar** whenever something is scheduled.

| State | Title | What it says | Button |
| --- | --- | --- | --- |
| On | "Autopilot is on" | Its pace and the next article, for example "Writes every day. Next up: “…”, tomorrow." | **Pause** |
| Paused | "Autopilot is paused" | "Nothing is written until you resume." and the next article | **Resume** |
| No trial or plan | "Autopilot is ready when you are" | How many articles are planned and that the trial starts them | **Start free trial** |
| No credits left | "Autopilot has used this month's articles" | "It picks up again when your plan renews — or upgrade to keep going now." | **Upgrade** |

When articles are overdue and autopilot is on or paused, the bar adds how many, and a **Re-plan from tomorrow** button.

### The Overview

The **Autopilot** chip at the top of the Overview shows **On** or **Off** and links to the switch in Settings. Hover it for the reason it's off, such as "Autopilot is paused. Turn it back on in Settings." When autopilot is paused and the Overview's launch checklist is complete, the next-step card reads "Autopilot isn't writing right now" with **Turn autopilot on**.

### The sidebar count

The number next to **Articles** in the sidebar is how many articles on the active site are scheduled or being written. It's hidden when the count is zero.

## Catch up on overdue articles

An article is overdue when its day has passed and it hasn't been written, usually because autopilot was paused, the trial hadn't started, or the site ran out of credits.

1. Make sure autopilot can run: start the trial, wait for credits to renew, or click **Resume**.
2. Click **Re-plan from tomorrow** in the autopilot bar.
3. Rankbox keeps the queue's order and spaces every scheduled article from tomorrow at your pace. The toast offers **Undo**.

Re-planning only changes dates. Autopilot would write overdue articles anyway, in queue order, as soon as the site is due.

## When credits run out

Autopilot spends one article credit per article: 30 a month per site on the Business plan, 7 during the free trial. When a site has none left, autopilot skips it until the billing period renews and the allowance resets. There's no per-article top-up, and unused credits don't roll over. See [Plans and credits](/docs/account/plans-and-credits).

## Where autopilot's articles go

Every article autopilot writes is saved in Rankbox as **Published**, whether or not your website is connected.

| Your setup | What happens after autopilot writes |
| --- | --- |
| No connection | The article waits in Rankbox. Nothing reaches your website, and the Overview prompts you to connect your site |
| REST API (any website, or a plugin that syncs through it) | Your site picks the article up the next time it syncs. Autopilot doesn't push to it |
| Webflow connection | The article is sent to your chosen collection, live or as a draft, depending on your connection settings |
| Shopify connection | The article is added to your chosen blog, visible or hidden, depending on your connection settings |

A Webflow or Shopify sending error never undoes the article: it stays **Published** in Rankbox, the credit stays spent, and the error is recorded on the connection and shown in **Integrations**. Both connections also leave alone any post you've edited or deleted in your CMS. See [How publishing works](/docs/publishing/overview), [Webflow](/docs/publishing/webflow), [Shopify](/docs/publishing/shopify) and [Any website, with the REST API](/docs/publishing/custom-sites).

> [!TIP]
> Rankbox has no approval step of its own before autopilot marks an article **Published**. To review articles before they go live, send them to Webflow drafts or add them hidden in Shopify, or have your own code decide when to publish when you use the REST API.

## Several sites with Studio

Each site in [Studio](/docs/account/studio) has its own autopilot switch, pace, credits, queue and brand brief, and is due on its own schedule. The Studio page shows each site's autopilot as "On" with its articles per week, or "Off". To change a site's settings, switch to it in the sidebar and open **Settings**.

## Limits and edge cases

- **Your own text in a scheduled article is replaced.** If you start writing a scheduled article yourself, autopilot still writes it and replaces your text. Click **Publish** in the editor to keep your version.
- **One article per run per site.** Autopilot never writes a batch to catch up. A long overdue queue clears at your pace.
- **Ideas are never written by autopilot.** Only **Scheduled** articles are. Schedule an idea to include it.
- **The trial's 7 credits.** At **Every day**, autopilot uses them in about a week.

## Troubleshooting

| What you see | Likely cause | What to do |
| --- | --- | --- |
| "Autopilot is ready when you are" | No trial or plan | Click **Start free trial** |
| "Autopilot has used this month's articles" | No credits left | Wait for the renewal |
| "Autopilot is paused" | The switch is off | Click **Resume** |
| Articles marked **Overdue** | Autopilot couldn't run on those days | Fix the cause, then **Re-plan from tomorrow** |
| An article is **Published** but not on your website | No connection, or the connection reported an error | Check **Integrations** and [Troubleshooting](/docs/help/troubleshooting) |
| Autopilot wrote a different article than the one dated today | Autopilot follows queue order, not dates alone | Drag articles on the Calendar to set the order |

## Related

- [Content plan and calendar](/docs/content/content-plan): the queue autopilot works through
- [How articles are written](/docs/content/writing): the pipeline every autopilot article goes through
- [Brand voice and writing settings](/docs/content/brand-voice): the brief autopilot writes with
- [How publishing works](/docs/publishing/overview): getting finished articles onto your website
- [Plans and credits](/docs/account/plans-and-credits): how many articles autopilot can write
