---
title: Account and site settings
nav_title: Settings
description: Every section and field in Rankbox Settings, from brand and writing voice to autopilot pace, Studio and your account, and how autosave works.
order: 5
updated: 2026-10-02
---

**Dashboard → Settings** is where you teach autopilot your brand, choose how often it writes, and manage your login. Most of the page belongs to the site you're viewing; the **Account** section at the bottom applies to your whole account. Changes save as you go, with no save button.

## Settings at a glance

The page has five sections, in this order:

| Section | Applies to | What it controls |
| --- | --- | --- |
| **Your brand** | The site you're viewing | Brand name, website and what you sell |
| **How autopilot writes** | The site you're viewing | Audience, tone, writing style and house rules |
| **Autopilot** | The site you're viewing | Whether autopilot writes, and how many articles a week |
| **Studio** | The site you're viewing | Whether the site is your plan's own site or a Studio site, and removing it |
| **Account** | Your whole account | Your email, your plan and signing out |

If you run several sites with [Studio](/docs/account/studio), switch sites with the site switcher before you edit. Each site keeps its own brand, writing and autopilot settings.

## How saving works

The fields in **Your brand** and **How autopilot writes** save themselves:

- A change saves a moment after you stop typing, about 0.7 seconds.
- Leaving the page saves anything still pending.
- Switching to another site saves your edits to the site they were made on first, then loads the other site's settings. One site's words are never saved onto another.
- Each section shows its state next to its title: "Saving…", "Saved", or "Couldn't save" with a **Retry** link.

The **Autopilot** controls save the moment you click them and confirm with a short message. A pace change also offers **Undo**.

## Your brand

"Who autopilot writes for. Every article is built around this."

| Field | What it does | Notes |
| --- | --- | --- |
| **Brand name** | How articles refer to you when they mention what you offer | Reddit Presence also needs it. Without it, drafting refuses with "Add this site's brand name in Settings first — every reply has to say who you are." |
| **Website** | The site your articles are published to | You can type `example.com`. Rankbox adds `https://` when you leave the field |
| **What you sell** | Two or three sentences on what you offer and who it's for. The writer uses it to tie every article back to you | Write it plainly. It goes into every article's brief as the product context |

Publishing connections aren't set here. API keys and publishing connections are configured per site in **Dashboard → Integrations**, and the backlink exchange verifies its own domain on the **Backlinks** page. The site's logo is set when the site is created and isn't edited in Settings.

## How autopilot writes

"The voice every article is written in. Changes apply to the next article it writes." Articles already written keep the voice they were written in.

| Field | Options | Default when blank |
| --- | --- | --- |
| **Audience** | Free text, with quick picks: Founders / Entrepreneurs, Marketers, Small business owners, Developers, Agencies | Founders / Entrepreneurs |
| **Tone** | Professional, Friendly, Confident, Conversational, Authoritative, Playful, or **Your own** | Professional |
| **Writing style** | Balanced, Concise and actionable, In-depth and data-driven, Story-led, Step-by-step, or **Your own** | Balanced |
| **House rules** | Free text. Anything the writer must always or never do, one rule per line | None |

Choosing **Your own** for tone or writing style opens a text field where you describe it in a few words. A field you leave blank falls back to its default, and the default shows as the selected option so you can see what's in effect.

Good house rules are short and testable, for example:

```text title="House rules"
Say "teams", not "users".
Never name competitors.
Use US spelling.
```

### What autopilot reads

The last row, **What autopilot reads**, shows the exact brief the writer gets before every article, built from the fields above. It's read-only and updates as you type. It has these lines:

```text title="Brief format"
Brand: <Brand name>
Product context: <What you sell>
Tone: <Tone>
Writing style: <Writing style>
Target audience: <Audience>
Brand voice instructions: <House rules>
Always apply Rankbox core rules: keyword optimization, clear heading structure, internal linking logic, and high readability.
```

The same brief is used when you click **Write now** and when autopilot writes on schedule. For more on how these settings shape an article, see [Brand voice and writing settings](/docs/content/brand-voice).

## Autopilot

"Whether it writes, and how often."

### Write automatically

A switch that turns autopilot on or off for the site. It's on by default.

- **On** reads "On — writing every day" (or the pace you chose).
- **Paused** stops autopilot from writing. Scheduled articles wait in the queue and nothing is lost.

Before you start the free trial, this row shows a **Start free trial** button instead of the switch, with "Autopilot starts writing when your free trial does."

### Pace

How many articles a week autopilot writes for this site.

| Option | Articles a month (about) |
| --- | --- |
| **Every day** (default) | 30 |
| **5 a week** | 22 |
| **3 a week** | 13 |
| **2 a week** | 9 |
| **1 a week** | 4 |

Under the options, Rankbox shows the monthly estimate next to your plan's allowance, for example "About 30 articles a month · your plan covers 30." If the pace would use more credits than the site has, it adds "autopilot will run out before the month ends."

Changing the pace also re-spaces the site's scheduled articles from tomorrow, so the calendar matches what autopilot can deliver. The confirmation offers **Undo**, which restores both the old pace and the old dates. See [Autopilot and the publishing schedule](/docs/content/autopilot).

> [!TIP]
> During the free trial the site has 7 article credits, so the estimate shows "your plan covers 7". At the default pace of every day, autopilot uses them within the first week.

## Studio

"How this site sits on your account." What this section shows depends on the site you're viewing.

| Site | What you see |
| --- | --- |
| Your plan's own site | "Your plan's own site": covered by your plan. It isn't removed on its own; cancelling your plan in billing ends it. A link offers to add more sites in Studio |
| A Studio site | **Remove from Studio…**: it runs to the end of the period you've paid for, then it's archived with its articles and settings kept |
| A Studio site scheduled to leave | "Leaves Studio on {date}" with **Keep this site**. Keeping it costs nothing, because the period is already paid for |

Removing a site from here works exactly like removing it from the Studio page. See [Remove a site](/docs/account/studio#remove-a-site).

## Account

"Your login and plan." This section is the same whichever site you're viewing.

| Row | What it shows | What you can do |
| --- | --- | --- |
| **Email** | The email you sign in with. It's where receipts and account emails go | Read only. To change it, [contact support](/docs/help/support) |
| **Plan** | "Business", "Business · free trial", "Business · payment due" or "No plan yet" | **Manage in Plan & Billing →** opens [billing](/docs/account/billing) |
| **Sign out** | Signs you out | Click **Sign out** |

**Sign out** clears your account's data from the browser tab and returns you to the sign-in page, so the next person to sign in on that computer never sees your data. It ends your Rankbox sessions in other browsers too, which sign out the next time their session refreshes.

## What isn't in Settings

Some account tasks live elsewhere:

| Task | Where |
| --- | --- |
| Create, copy or revoke API keys | **Dashboard → Integrations**, per site. See [Authentication and API keys](/docs/api/authentication) |
| Connect a publishing platform | **Dashboard → Integrations**, per site. See [How publishing works](/docs/publishing/overview) |
| Change your card, see invoices, cancel | **Dashboard → Plan & Billing** and the Stripe portal |
| Add, remove or restore sites | **Dashboard → Studio** |
| Backlink exchange preferences | **Backlinks → Settings** tab |
| Reddit Presence preferences | **Reddit → Settings** tab |
| Change your password or email | No self-serve option in the dashboard. [Contact support](/docs/help/support) |
| Delete your account and data | Email Rankboxai@gmail.com. See [Data retention and deletion](/docs/account/security#data-retention-and-deletion) |

## Troubleshooting settings

| Problem | What to do |
| --- | --- |
| "Couldn't save" next to a section | Click **Retry**. Your text stays in the form until it saves |
| A change didn't show up in an article | Writing settings apply to the next article written. Existing articles keep their voice; edit them in the editor |
| The switch shows **Start free trial** | Autopilot can't run without a trial or plan. Start the [free trial](/docs/account/free-trial) |
| You edited the wrong site | Check the site switcher at the foot of the sidebar. Every site section of Settings belongs to the site shown there |

## Related

- [Brand voice and writing settings](/docs/content/brand-voice): how the brief shapes each article.
- [Autopilot and the publishing schedule](/docs/content/autopilot): pace, queue and schedule in depth.
- [Studio: run several sites](/docs/account/studio): per-site settings and removing a site.
- [Billing, invoices and cancellation](/docs/account/billing): the plan behind the Account section.
- [Security and privacy](/docs/account/security): sign-in, sessions and deleting your data.
