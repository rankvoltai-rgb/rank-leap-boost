---
title: Onboarding, step by step
nav_title: Onboarding
description: Every step and field of Rankbox onboarding, what Rankbox does with each answer, what confirming saves to your site, and where to change it later.
order: 5
updated: 2026-10-02
---

Onboarding sets up your account's first site in three steps: your brand, your keywords and your content plan. It is free, needs no card, and usually takes a few minutes. This page covers every field, what Rankbox does with it, and how to change it afterwards.

## How you get to onboarding

Onboarding lives at `/onboarding`. You arrive there in one of these ways:

- **From the homepage.** Enter your website in the homepage form and Rankbox sends you to sign up, carrying the address with you.
- **After sign-up.** Creating an account with email or Google opens onboarding straight away.
- **From a confirmation email.** If Rankbox emails you a confirmation link, it brings you back to onboarding where you left off.
- **By link.** `/onboarding?url=yoursite.com` starts onboarding with that website filled in.

An account that already has a site is sent to the dashboard instead. Onboarding sets up only the first site; every other site is added with [Studio](/docs/account/studio).

## How your progress is saved

Rankbox saves every change you make in onboarding, including which step you're on, in your browser as you go. A refresh, the back button or a round trip through a confirmation email resumes exactly where you were, without re-running the site scan or the keyword analysis.

- **Saved per browser.** Progress lives in the browser you started in. Starting again on another device or browser begins from step 1.
- **Saved per account.** If a different Rankbox account signs in on the same browser, the earlier progress is dropped rather than resumed.
- **Navigating steps.** The progress bar at the top shows **Brand**, **Keywords** and **Plan**. Finished steps are links back; you can't skip ahead of the analysis.
- **If saved progress breaks.** You'll see "Setup hit a snag" and "Something in your saved progress didn't load." Click **Start over** to clear it and begin again.

On wide screens a rail on the right shows **Projected visits**, labelled **Modeled**, and a summary of your brand, keywords and content plan, each with a link back to edit it. On smaller screens a compact projection strip sits above the step instead. The projection is calculated from estimated keyword volumes, not measured traffic.

## Step 1: Brand

The first step, headed "Start with your website" and then "Is this your brand?", identifies the site and the brand every article is written for.

| Field | What to enter | What Rankbox does with it |
| --- | --- | --- |
| **Website** | Your site's address, for example `yoursite.com` | Reads the site to fill in the other fields. Becomes the site's website, the address articles are published to, and the domain a reported live URL must be on |
| Logo (the square tile) | Left as found, or click to upload an image under 1 MB | Saved as the site's logo and returned as `logo_url` by the API's `ping` endpoint, which integrations can use for your organization's structured data |
| **Brand name** | Your company or product name as you write it | How articles refer to you. Required to continue |
| **What you do** | One or two sentences a stranger would understand | Briefs every article Rankbox writes for the site, so articles tie back to what you offer |

### How the site scan works

- Rankbox reads the site once the address looks like a domain and you stop typing for about a second. The field shows **Reading** while it works.
- A website carried from the homepage is read as soon as the step opens.
- Click **Re-scan** to read the site again. Fields you edited by hand are kept; fields still holding the last scan's text are replaced. A logo you uploaded is kept.
- Under the brand name, a note says where the logo came from: "Logo from your og:image", "Logo from your apple-touch-icon", "Logo from your favicon", or "No logo found. Click the square to add one."
- If the site can't be read, you'll see "Couldn't read that site. Fill it in and continue." Type the brand name and description yourself.

Click **Find my keywords** to continue. The button waits for the scan to finish, and needs both a website and a brand name; otherwise you'll see "Add your website and brand name to continue." The note beside it reads "Next, we analyze your site. It takes about 20 seconds."

## Step 2: Keywords

The second step analyzes your site and proposes the searches your articles should target.

### While the analysis runs

The screen shows "Reading yoursite.com…" and "Mapping the questions your buyers ask search and AI. This takes about 20 seconds." A checklist ticks through **Fetching your pages**, **Reading your positioning**, **Mapping buyer questions**, **Sizing the keyword set** and **Checking AI answer coverage**.

If the analysis fails, you'll see "Analysis failed. You can still add keywords by hand." and an empty list you can fill yourself.

### The keyword list

When the analysis finishes, the step is headed "Pick the searches to win" and lists about 20 keywords.

| Column | Meaning |
| --- | --- |
| Keyword | The search, in lowercase. Click it to edit the wording |
| Intent | Commercial, Transactional, Informational or Navigational. Hidden on narrow screens |
| Searches | Estimated monthly searches. These are AI estimates, not measured data. Keywords you add show "—" |
| Trend | An arrow for Rising, Steady or Declining |

- **Remove a keyword** with the **×** on its row. A toast offers **Undo**.
- **Add a keyword** in **Add a keyword you know converts**, then press **Enter** or click **Add**. A keyword already in the list is refused with "That keyword is already in the list."
- The footer shows **Monthly searches, all keywords**, the total of the estimates.

Each keyword becomes one article, so the list is the size of your first content plan, up to 30 articles. Changing the list clears any plan already built in step 3, which is rebuilt from the new list.

### What we learned about your brand

Below the list, **What we learned about** your brand opens with **Review**. It holds the context that briefs every article.

| Item | Editable | What it's for |
| --- | --- | --- |
| **Niche** | Yes | Saved to the site's writing instructions |
| **Market** | Yes | The markets you serve, for example "Global"; saved with the niche |
| **Who you're writing for** | Yes | Becomes the site's audience setting |
| **Brand voice** | Yes | Becomes the site's tone. "Every article is written in this tone" |
| **Content gaps** | No | Topics your site doesn't cover yet; used to plan articles |
| **Who you're up against** | No | Up to 6 companies buyers compare you with; used to plan fair comparison articles |
| **Topic clusters** | No | 4 to 6 themes your articles should own; used to plan articles |
| **AI visibility today** | No | A few observations on how likely AI engines are to cite your site, judged from its content. Nothing is measured |

Click **Build my plan** to continue. It needs at least one keyword.

## Step 3: Plan

The third step turns your keywords into a content plan. While it works you'll see "Building your content plan" and "Finding your content gaps and drafting an article for each keyword…".

### How the plan is built

- Exactly one article per keyword, highest estimated volume first, capped at 30 articles.
- Each article fills a gap: a question or comparison your buyers have that your site doesn't answer yet.
- Articles are ordered by publishing priority, quick wins (low competition, buying intent) first.
- Each article has a title under 70 characters, a short brief describing its angle, a competition rating and an AI signal from 1 to 100.
- Each row shows its estimated monthly visits, for example "+320 visits/mo". The estimate is modeled from the keyword's estimated volume and its position in the plan.

When it's ready, the step is headed "Your first month of content" and shows two groups:

| Group | What it holds | What happens after you confirm |
| --- | --- | --- |
| **Ready on your dashboard** | The first 4 articles, each labelled Idea | They appear in **Articles** as ideas. You write or schedule them when you like |
| **Autopilot queue** | Every other article, labelled Day 1, Day 2 and so on | They are scheduled one a day, starting the day after you confirm, and autopilot writes them once your trial starts |

If planning fails, you'll see "We couldn't build your content plan." Click **Try again**.

### Confirming

Click **Confirm plan**. The button reads "Setting up…" while Rankbox saves, then you'll see "You're set up. Welcome to Rankbox." and land on the dashboard. The note beside the button says "Nothing publishes until you start your trial. Edit or remove any article later."

## What confirming saves

Confirming writes your answers to the site. This is what goes where:

| Onboarding answer | Saved as | Where you see it later |
| --- | --- | --- |
| Website, Brand name, What you do | The site's brand details | **Settings → Your brand** (**Website**, **Brand name**, **What you sell**) |
| Logo | The site's logo | `logo_url` in the response of `GET /api/public/v1/ping` |
| Brand voice | The site's tone | **Settings → How autopilot writes → Tone** |
| Who you're writing for | The site's audience | **Settings → How autopilot writes → Audience** |
| Niche and Market | A line in the site's writing instructions, "Niche: … Geo: …." | **Settings → How autopilot writes → House rules** |
| Keywords | The site's keywords, with intent, estimated searches and trend. The first 4 are tracked, the rest saved as discovered | **Rank → Your market** |
| Planned articles | The first 4 as ideas, the rest as scheduled articles, one a day | **Articles**, **Calendar**, **Overview** |

Rankbox also opens the site's article credit balance with 7 credits, which can be used once you start the trial, and leaves autopilot switched on at **Every day**. Competitors, topic clusters, content gaps and AI visibility notes are used to plan the articles but are not stored on the site.

## Change your answers later

You can't run onboarding again for a site that exists, but nearly everything it set can be changed in the dashboard.

| To change | Go to |
| --- | --- |
| Brand name, website or description | **Settings → Your brand**. Changes save as you type |
| Tone, writing style, audience or house rules | **Settings → How autopilot writes**. Changes apply to the next article written |
| How often autopilot writes | **Settings → Autopilot → Pace** |
| Which articles are written, and when | **Articles** (schedule, write now, delete) and **Calendar** (drag to another day) |
| What an unwritten article is about | Open it in **Articles** and edit its title, keyword or meta description before writing; the writer works from those |
| Articles for keywords that have none | **Rank → Next best moves → Plan it** creates an idea for an uncovered keyword |
| The logo | Settings has no logo field. Contact [support](/docs/help/support) to change it |

Settings has no keyword editor; the keyword set comes from onboarding. See [Account and site settings](/docs/account/settings) and [Brand voice and writing settings](/docs/content/brand-voice).

## Adding more sites

Every site after the first is added from **Studio → Add a site**, on a paid plan. It runs the same three steps, then shows the price before anything is charged. Its confirm button reads **Review & add site**, and its queue is "published one a day once the site is added". See [Studio: run several sites](/docs/account/studio).

## Onboarding errors

| You see | What it means | What to do |
| --- | --- | --- |
| "Couldn't read that site. Fill it in and continue." | The scan couldn't fetch or read the address | Check the address, click **Re-scan**, or type the fields yourself |
| "Add your website and brand name to continue." | A required field is empty | Fill in **Website** and **Brand name** |
| "That file isn't an image." or "Logo must be under 1 MB." | The logo upload was refused | Upload a PNG, JPG, SVG or similar image under 1 MB |
| "Analysis failed. You can still add keywords by hand." | The keyword analysis didn't return results | Add keywords yourself, or go **Back** and continue again to retry |
| "We couldn't build your content plan." | Planning didn't return articles | Click **Try again** |
| "You're making AI requests too quickly. Wait a minute and try again." | Your account hit the per-minute limit on AI requests | Wait a minute, then retry |
| "Setup hit a snag" | Saved progress in this browser couldn't load | Click **Start over** |

More fixes are in [Troubleshooting](/docs/help/troubleshooting#onboarding).

## Related

- [Quickstart](/docs/get-started/quickstart): onboarding in context, through to a first published article.
- [Research: the questions buyers ask AI](/docs/content/research): how the keyword analysis works.
- [Content plan and calendar](/docs/content/content-plan): managing the plan after onboarding.
- [Brand voice and writing settings](/docs/content/brand-voice): the settings onboarding fills in.
- [A tour of the dashboard](/docs/get-started/dashboard-tour): where you land after confirming.
