---
title: Core concepts
description: Precise definitions of Rankbox's building blocks: account, site, content plan, article statuses, credits, autopilot, score, API key, live URL and trial.
order: 4
updated: 2026-10-02
---

This page defines the objects and rules the rest of the docs build on. Each section stands on its own, so you, or an AI agent, can quote it without the surrounding context.

## Account

A Rankbox account is one login: an email address with a password, or a Google account. The account holds one subscription and one or more sites.

- An account has exactly one subscription, billed by Stripe, whatever the number of sites.
- An account has one primary site, created in onboarding, and can add more sites with Studio.
- An account has one login. Rankbox has no team seats, roles or member invitations.
- Your name comes from sign-up and is used in the dashboard greeting. Your email receives receipts and account emails.

## Site

A site is one website on your account, with its own brand, settings, keywords, articles, credits, API keys and connections. Almost everything in the dashboard belongs to one site, and the dashboard shows one site at a time.

| Field | Meaning |
| --- | --- |
| Brand name | How articles refer to you |
| Website | The address articles are published to; also the domain a reported live URL must be on |
| What you sell | The two or three sentence description that briefs every article |
| Logo | Taken from your site in onboarding, or uploaded there |

### Primary and Studio sites

| Kind | How it's created | How it's billed | How it ends |
| --- | --- | --- | --- |
| Primary | Onboarding, once per account | Included in the plan | Only when the plan itself ends |
| Studio | **Studio → Add a site**, on a paid plan | $49.50 a month each, on the same invoice | **Remove from Studio**, which takes effect at the end of the paid period |

A Studio site is `pending` while its first payment is processed, `active` while it runs, and `archived` after it leaves Studio. A site scheduled to leave keeps working until its removal date, then stops. An archived site keeps its articles and settings and can be restored from Studio. See [Studio: run several sites](/docs/account/studio).

## Keywords and the content plan

Keywords are the searches a site's articles target. Rankbox proposes them in onboarding from a read of your website, and you confirm, remove or add to the list before planning.

The content plan is the set of articles Rankbox has planned for a site: one article per confirmed keyword, up to 30, ordered quick wins first. Confirming onboarding saves the plan. The first 4 articles become ideas and the rest are scheduled one a day, starting the next day.

- Keyword search volumes are AI estimates. Rankbox has no search-volume data source.
- The first 4 keywords are tracked; the rest are saved as discovered. The **Rank** page lists both.
- A keyword with no article is a gap. On the **Rank** page, **Plan it** creates an idea for it.

See [Content plan and calendar](/docs/content/content-plan).

## Article

An article is one planned or written piece for a site. It has a title, a target keyword, a meta description, a body in Markdown, tags, a score, an estimated traffic figure, a competition rating, an AI signal, an optional scheduled date and queue position, and, once known, a live URL.

### Article statuses

| Stored status | Label in the dashboard | Meaning |
| --- | --- | --- |
| `opportunity` | Idea | Planned but not scheduled. Autopilot doesn't write ideas until you schedule them |
| `scheduled` | Scheduled | In the autopilot queue with a date and a queue position |
| `scheduled`, date passed | Overdue | Scheduled for a day that has passed and still unwritten, usually because the site had no plan or no credits |
| `generating` | Writing | Being written right now, by **Write now** or by autopilot |
| `finished` | Published | Written and available to the site: returned by the API and pushed to a connected Webflow or Shopify site |

"Published" in Rankbox means the article is finished and ready for your site. Whether it is on your site yet depends on your connection: an API site has it after its next sync, and a Webflow or Shopify site receives it straight after writing. See [How publishing works](/docs/publishing/overview).

## Credits

Credits meter the work Rankbox does for each site. Every credit belongs to one site, not to the account.

| Credit | Pays for | Grant per site | Trial | At a new billing period |
| --- | --- | --- | --- | --- |
| Article credit | Writing one article | 30 a month | 7 | Resets to the allowance; unused credits don't carry over |
| Backlink credit | Part of one inbound link, 1 to 3 credits by the host site's tier | 30 a month | None | Tops up; earned and unused credits carry over, and the monthly grant never lifts the balance past 90 |
| Reddit credit | Drafting one Reddit reply | 30 a month | None | Resets to the allowance; unused credits don't carry over |

- An article credit is reserved when writing starts and returned if writing fails.
- A backlink credit moves only when a link is verified live on the host page.
- Editing by hand, the editor's AI actions on a selection, scoring, planning and publishing never spend a credit.
- A Studio site added part-way through a period receives a prorated share of each allowance for that period.
- Credit balances are read-only from the browser; only Rankbox's server processes can change them.

See [Plans and credits](/docs/account/plans-and-credits).

## Autopilot and the queue

Autopilot is the engine that writes a site's scheduled articles for you. It is switched on for every new site, with a pace of 7 articles a week ("Every day").

- **Pace** is the number of articles a week, from 1 to 7. Autopilot waits 7 ÷ pace days between articles for a site: one day at 7 a week, a week at 1 a week.
- **The queue** is the site's scheduled articles in order. Order is set by queue position, which the calendar keeps in step with the scheduled dates; moving an article on the calendar reorders the queue to match.
- **What it writes:** when a site is due, autopilot writes the scheduled article with the lowest queue position, which is the earliest one on the calendar. It writes one article per site each time it runs.
- **When it skips a site:** the site has no trial or paid plan, the site isn't live (for example a Studio site past its removal date), the site has no article credits left, or nothing is scheduled.
- **Pausing:** switching **Write automatically** off in **Settings → Autopilot** stops new writing. Scheduled articles wait; nothing is lost.

The engine's state appears on **Overview** (**Autopilot On** or **Off**) and above the article list as one of: "Autopilot is on", "Autopilot is paused", "Autopilot is ready when you are" (no trial yet) or "Autopilot has used this month's articles". See [Autopilot and the publishing schedule](/docs/content/autopilot).

## SEO and GEO score

The SEO and GEO score is a number from 0 to 100 that Rankbox computes from an article's title, target keyword, meta description and body. It is deterministic: the same text always gets the same score, in the editor, in the article list and on the Rank page.

The score is a weighted checklist: keyword in the title, keyword in the introduction, keyword density, content length, section structure, sub-headings, lists, an FAQ section for AI engines, links, meta description length and readability. Each check passes, warns or fails. The score measures how ready an article is to rank and be quoted; it is not a ranking position and not a measured citation. See [The SEO and GEO score](/docs/content/scoring).

## API key

An API key is a secret that lets one site's code read that site's published articles through the REST API. Keys start with `rv_live_`, for example `rv_live_xxxxxxxxxxxx`.

- **One key, one site.** A key belongs to exactly one site and only ever returns that site's articles. A site can have several keys, for example one per environment.
- **Shown once.** The full key appears once, when you create it. Rankbox stores only a hash and shows a short prefix afterwards.
- **Needs a plan.** Creating a key needs a trial or paid plan. A valid key stops working, with HTTP 402, while its site has no plan or isn't live.
- **Revocable.** Revoking a key stops it at once and can't be undone. **Replace key** makes a new one so you can swap it in first.

| Key status | Meaning |
| --- | --- |
| Waiting | Created, never used |
| Live | Used in the last 48 hours |
| Idle | Not used for more than 48 hours |
| Revoked | Permanently disabled |

See [Authentication and API keys](/docs/api/authentication).

## Connections and the MCP server

A connection is how a site receives its articles or how an AI tool reaches Rankbox. You manage them in **Dashboard → Integrations**.

| Connection | What it does | Credentials |
| --- | --- | --- |
| REST API | Your site's code pulls published articles | An API key for the site |
| Webflow | Rankbox pushes articles into a Webflow collection | Webflow authorization; Rankbox never sees your Webflow password |
| Shopify | Rankbox pushes articles into a Shopify blog | The Rankbox app in your Shopify admin |
| MCP server | AI tools such as Claude, ChatGPT and Cursor call Rankbox's research tools | Added in the AI tool by URL: `https://rankbox.xyz/mcp` |

A site's overall connection status is the best of its keys and platform connections: **Live**, **Not syncing**, **Waiting** or **Not connected**, shown on **Overview** under **Your site**. See [How publishing works](/docs/publishing/overview) and [The Rankbox MCP server](/docs/ai-tools/mcp-server).

## Live URL

A live URL is the public address where a published article lives on your site. Rankbox stores one per article.

- Sources, in practice: your site reporting it with `PATCH /api/public/v1/articles/{id}`, a Webflow or Shopify publish, your sitemap, or a URL pasted in **Backlinks → Give links**.
- A reported live URL must be a public `http` or `https` address on the site's own domain: the website in **Settings**, or the domain verified for the backlink exchange.
- The backlink exchange verifies hosted links at the live URL, so an article without one can't settle a link.

See [Live URLs and verification](/docs/publishing/live-urls).

## Trial and paid plan

The free trial and the paid plan unlock different things. Rankbox decides from your subscription's status, checked on the server for every action.

| Subscription state | Writing and syncing | Backlinks, Reddit, Studio |
| --- | --- | --- |
| No plan | No | No |
| Trial (7 days, card on file) | Yes, up to 7 articles | No |
| Trial whose card failed the $1 check | No, until the card is updated | No |
| Active (paid) | Yes, 30 articles a month per site | Yes |
| Payment failed | For 48 hours after the failure, then no | For 48 hours, if the plan was paid before |
| Cancelled | Until the end of the current period | Until the end of the current period, if the plan was paid |

The trial converts to the paid plan automatically on day 8 unless you cancel. **Unlock everything now** in **Plan & Billing** ends the trial early and takes the first payment straight away. See [The free trial](/docs/account/free-trial).

## Estimates and measured data

Some numbers in Rankbox are measured from your content; others are modeled. The docs and the dashboard label estimates as estimates.

| Number | Kind |
| --- | --- |
| SEO and GEO score, word count, read time, keyword density | Computed from the article text |
| Credit balances, statuses, sync times | Recorded by Rankbox |
| Monthly searches per keyword | AI estimate |
| Est. traffic and projected visits | Modeled from estimated volume and plan position |
| Competition and AI signal | AI judgement made when the plan is built |

## Related

- [How Rankbox works](/docs/get-started/how-it-works): how these objects move through the pipeline.
- [A tour of the dashboard](/docs/get-started/dashboard-tour): where each concept appears on screen.
- [Plans and credits](/docs/account/plans-and-credits): credit grants and resets in full.
- [API overview](/docs/api/overview): the article shape your site receives.
- [FAQ](/docs/help/faq): short answers built on these definitions.
