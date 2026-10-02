---
title: Quickstart: from sign-up to your first published article
nav_title: Quickstart
description: A step-by-step tutorial to create a Rankbox account, confirm a content plan, start the trial, write a first article, publish it and check autopilot.
order: 2
updated: 2026-10-02
---

This tutorial takes you from a new Rankbox account to a first article live on your site, with autopilot writing the rest. Most people finish it in about 10 minutes, plus however long your developer needs to add one API call to your site.

## Before you start

Have these ready. Nothing else is required.

| You need | Why |
| --- | --- |
| Your website address | Rankbox reads it to fill in your brand and find your keywords |
| A Google account, or an email address and password | To create your Rankbox account |
| A payment card | The 7-day free trial goes through Stripe Checkout and takes a card. You aren't charged until day 8 |
| Access to your site's code, or a developer | To add the API call that pulls articles into your site. Webflow and Shopify sites can connect without code; see [How publishing works](/docs/publishing/overview) |

> [!NOTE]
> Steps 1 to 4 are free and need no card. Rankbox asks for a card only in step 5, when you start the trial, because that is the first point at which it can write for you.

## Step 1: Create your account

1. Go to `https://rankbox.xyz/auth`. If you entered your website on the Rankbox homepage, the address comes with you.
2. Click **Google** to sign in with your Google account, or fill in **Full Name**, **Business Email** and **Password**.
3. Click **Start my traffic engine**.

Rankbox opens onboarding at `/onboarding`. If you already have an account, click **Sign in** under the form instead; an account that has finished onboarding goes straight to the dashboard.

## Step 2: Confirm your brand

Onboarding opens on **Step 1 of 3**, "Start with your website".

1. Type your site into **Website**, for example `yoursite.com`. After you stop typing for about a second, Rankbox reads the site and shows **Reading** in the field.
2. Check what it filled in under "Is this your brand?": the logo, **Brand name** and **What you do**. Fix anything that's off. **What you do** briefs every article, so one or two plain sentences a stranger would understand work best.
3. If no logo was found, click the square and upload an image under 1 MB.
4. Click **Find my keywords**.

If the site can't be read, you'll see "Couldn't read that site. Fill it in and continue." Type the brand name and description yourself and continue.

## Step 3: Pick your keywords

Rankbox analyzes the site. The screen shows "Reading yoursite.com…" and a short checklist; this takes about 20 seconds.

1. Review the list under "Pick the searches to win". Each row shows the keyword, its intent, its estimated monthly searches and a trend arrow.
2. Remove any keyword that doesn't fit by clicking the **×** on its row. A toast offers **Undo**.
3. Add a keyword you know converts in the **Add a keyword you know converts** field and press **Enter** or click **Add**.
4. Optionally, open **What we learned about** your brand and correct the niche, market, audience or brand voice.
5. Click **Build my plan**.

Each keyword becomes one article, so the number of keywords you keep is the size of your first content plan (up to 30 articles).

## Step 4: Confirm your content plan

Rankbox drafts one article title and brief per keyword. The screen reads "Your first month of content" when it's ready.

- **Ready on your dashboard** lists the first 4 articles. They arrive as ideas you can write whenever you like.
- **Autopilot queue** lists the rest, labelled Day 1, Day 2 and so on. They are scheduled one a day, starting the day after you confirm.

Click **Confirm plan**. Rankbox saves your brand, settings, keywords and articles, shows "You're set up. Welcome to Rankbox." and opens the dashboard.

> [!TIP]
> Nothing is final here. You can edit, reschedule or delete any article later from **Articles** or **Calendar**, and change your brand and voice in **Settings**.

## Step 5: Start your free trial

The **Overview** page shows a next-step card titled "Put your N ready articles to work", with a short launch checklist: start the trial, connect your site, publish your first article.

1. Click **Start free trial** on the card. The same button sits at the foot of the sidebar until you have a plan.
2. Read the dialog, then click **Start free trial** again.
3. Enter your card in the Stripe form that appears inside the dialog and complete it.

When the dialog shows "Starting your trial…" and closes, you'll see "Your 7-day trial is live." Your plan's site now has 7 article credits for the trial.

> [!IMPORTANT]
> To check the card can hold funds, Rankbox places a $1 authorization and releases it straight away. Nothing is captured, but it can appear as a pending charge on your statement for a day or two. If the card fails this check, Rankbox shows "We couldn't verify your card. Update it in billing to start generating."

## Step 6: Write your first article

1. On **Overview**, find the next step "Write your first article", or any row in the **Autopilot queue** table, and click **Generate now**.
2. Wait while the article is written. In the article panel this reads "Writing your article. This usually takes under a minute — it keeps going if you close this."

When it's done, Rankbox opens the article in **Articles**. Its status is **Published**, which in Rankbox means written and available to your site. Writing used 1 of your article credits; the **Article credits** figure on Overview goes down by one.

To write a specific idea instead, go to **Articles**, open the idea, edit its title, keyword or meta description to steer it, and click **Write now**.

## Step 7: Connect your site and publish

Published articles wait in Rankbox until your site collects them. Connect once and every article after that arrives on its own.

1. Go to **Dashboard → Integrations**.
2. Under **Developer**, open **REST API**. If your platform's tile offers **Connect with the API**, that opens the same setup.
3. Under **Set it up**, give the key a name (for example "Acme blog") and click **Create key**.
4. Copy the key from **Copy your key**. It is shown only this once, so store it where your site keeps secrets.
5. Add the call below to your site, at build time or on a schedule. Pass back `next_since` each time to get only what changed.

```bash title="cURL"
curl "https://rankbox.xyz/api/public/v1/articles?since=2026-01-01T00:00:00Z" \
  -H "Authorization: Bearer $RANKBOX_API_KEY"
```

```js title="JavaScript"
const res = await fetch(
  `https://rankbox.xyz/api/public/v1/articles?since=${lastSync}`,
  { headers: { Authorization: `Bearer ${process.env.RANKBOX_API_KEY}` } },
);
const { articles, next_since } = await res.json();
// Save next_since and send it as ?since= next time.
```

Step 4 of the setup, **See it connect**, shows "Listening for your site's first request…" until your site calls the API, then "Connected — your site called in just now." This usually happens within a minute of the key going live on your site. On **Overview**, **Your site** changes from "Waiting" to "Live".

Each article in the response carries `title`, `slug`, `description`, `body_markdown`, `body_html` and `tags`. Render it however your site renders posts. When the article is live, report its address with `PATCH /articles/{id}` so the backlink exchange and the Rank page know where it lives; see [Live URLs and verification](/docs/publishing/live-urls).

> [!TIP]
> Webflow and Shopify sites publish through their own connection rather than an API key. See [Webflow](/docs/publishing/webflow) and [Shopify](/docs/publishing/shopify) for how those connections are set up and what is available today.

## Step 8: Check autopilot is on

Autopilot is switched on for every new site and starts working once your trial does. It writes the next scheduled article each time one is due, paced by your weekly setting.

1. Look at the top right of **Overview**. It should read **Autopilot On**.
2. Click it to open **Settings → Autopilot**.
3. Check **Write automatically** is switched on. It reads "On — writing every day" by default.
4. Under **Pace**, pick **Every day**, **5 a week**, **3 a week**, **2 a week** or **1 a week**. Changing the pace re-spaces your scheduled articles from tomorrow, and the toast offers **Undo**.

The line under **Pace** shows about how many articles a month your pace writes and how many your plan covers. Every day is about 30 a month, which matches the paid plan's 30 article credits.

## What happens next

| When | What happens |
| --- | --- |
| During the 7-day trial | Autopilot and **Write now** can use up to 7 article credits. Research, writing, scoring and publishing all work |
| If you run out during the trial | Rankbox shows "You've used all 7 articles this month". In **Plan & Billing**, **Unlock everything now** ends the trial early and charges $49.50 today |
| Day 8 | Your card is charged $49.50 and the plan becomes active. The site's article credits reset to 30 |
| First paid invoice | The [backlink exchange](/docs/growth/backlink-exchange), [Reddit Presence](/docs/growth/reddit-presence) and [Studio](/docs/account/studio) open |
| Each month after | Article credits reset to 30 at renewal. Unused article credits don't carry over |

To cancel before you're charged, open **Plan & Billing** and click **Card & invoices**, which opens Stripe's billing portal. See [Billing, invoices and cancellation](/docs/account/billing).

## If something goes wrong

- The site couldn't be read, or analysis failed: see [Onboarding problems](/docs/help/troubleshooting#onboarding).
- **Generate now** asks you to start a trial, or your card wasn't verified: see [Trial and billing problems](/docs/help/troubleshooting#trial-and-billing).
- The key setup never leaves "Listening for your site's first request…": see [Publishing with the API](/docs/help/troubleshooting#publishing-with-the-api).
- Autopilot shows Off or Overdue: see [Autopilot problems](/docs/help/troubleshooting#autopilot).

## Related

- [Onboarding, step by step](/docs/get-started/onboarding): every field in setup and how to change it later.
- [A tour of the dashboard](/docs/get-started/dashboard-tour): what each page in the sidebar is for.
- [Any website, with the REST API](/docs/publishing/custom-sites): the full integration guide.
- [Autopilot and the publishing schedule](/docs/content/autopilot): pace, queue order and overdue articles.
- [The free trial](/docs/account/free-trial): exactly what the trial includes and when you are charged.
