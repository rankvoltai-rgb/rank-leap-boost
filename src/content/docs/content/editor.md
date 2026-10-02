---
title: Editing articles
nav_title: Editor
description: Every action in the Rankbox article editor: editing text, AI rewrites, title and meta, saving, publishing changes, scheduling, deleting and shortcuts.
order: 4
updated: 2026-10-02
---

Every article opens in the same editor: a panel that slides over the page you came from. In it you can steer an article before it's written, edit the text after, rewrite passages with AI, check the score, and publish. This page covers every control in the panel, how saving works for drafts and for published articles, and what "published" means for the REST API.

## Open an article

- Click an article's title or row on **Articles**, a chip on **Calendar**, or an article in the Overview's **Publishing schedule**.
- On the Rank page, **Plan it** and **Improve** open the article they act on.

The panel takes most of the screen on a computer and the full screen on a phone. The open article is part of the page address (`?article=` followed by the article's id), so you can refresh, bookmark or share the link, and the browser's back button closes it. Older links in the form `/dashboard/editor/<id>` open the same article on the Articles page.

## The panel layout

| Area | What's in it |
| --- | --- |
| Header, left | **Close** (Esc), **Previous article** (K), **Next article** (J), your position such as "3 of 12", and the status |
| Header, right | Save status, the **More actions** menu (**…**) and the main button |
| Document | The title, the formatting toolbar and the article body |
| Side rail | **SEO**, **Details**, **Content** and **Checklist** sections |

Previous and next walk the list you opened the article from, in the order shown there. On a narrow window, the side rail moves below the document.

## What the panel shows at each stage

| Status | Main button | Document area |
| --- | --- | --- |
| **Idea**, no text | **Schedule** and **Write now** | A "Not written yet" card: "This idea isn't on the schedule. Write it now, or schedule it for autopilot." |
| **Idea**, with your own text | **Publish** | Your text |
| **Scheduled** or **Overdue**, no text | **Write now** | A "Not written yet" card saying when autopilot writes it |
| **Scheduled** or **Overdue**, with your own text | **Publish** | Your text, under a warning that autopilot will replace it |
| **Writing** | **Writing…** (disabled) | A placeholder until the text arrives |
| **Published** | **Publish changes** | The article, ready to edit |

**Write now** reads **Upgrade to write** when the site has no article credits left. The card under it shows "Writing uses 1 article credit" and how many are left this month.

## Steer an article before it's written

The writer works from three fields: the title, **Target keyword** and **Meta description**. Before an article is written, **Meta description** holds its brief: the angle and the gap it fills.

1. Click the title at the top of the document and edit it. Press Enter to move into the body.
2. Change **Target keyword** in the **SEO** section of the side rail.
3. Rewrite the brief in **Meta description**.
4. Click **Write now**. Your edits are saved first, then the article is written from them.

Writing spends one article credit. How the article is produced is explained in [How articles are written](/docs/content/writing).

## Write an article yourself

1. Open an idea or a scheduled article that has no text.
2. Click **Start writing** under "Rather write it yourself?".
3. Type or paste your article. It autosaves as you go.
4. Click **Publish** when it's ready. Publishing your own article spends no credit.

> [!WARNING]
> If you write your own text into a **Scheduled** article, autopilot still writes that article on its day and replaces your text. The panel says so above the document. Click **Publish** to keep your version.

## Edit the text

Select text or place the cursor, then use the toolbar above the document.

| Button | Effect |
| --- | --- |
| **Bold**, **Italic** | Format the selection |
| **Heading 2**, **Heading 3** | Turn the paragraph into a section or subsection heading |
| **Bullet list**, **Numbered list** | Start or end a list |
| **Quote** | Turn the paragraph into a block quote |
| **Link** | Asks for a URL ("Link URL"). Leave it empty to remove a link |
| **Undo**, **Redo** | Step back or forward through your edits |

URLs you type become links automatically. Links don't open when you click them in the editor, so you can edit their text.

## Rewrite a passage with AI

1. Select the text you want to change. A small menu labeled **AI** appears above it.
2. Pick an action.
3. Wait for the spinner. The result replaces your selection.

| Action | What the AI is asked to do |
| --- | --- |
| **Improve SEO** | Add relevant keywords naturally and make the passage easier to scan |
| **Rewrite** | Make the passage clearer and more engaging, keeping its meaning |
| **Expand** | Add detail, examples and depth |
| **Shorten** | Keep only the most important points |

Each action rewrites in your site's voice, using the brief from [Brand voice and writing settings](/docs/content/brand-voice). Actions use no article credits but count toward the AI rate limit of 12 requests a minute per account (the default).

The AI receives your selection as plain text and returns plain text. Formatting inside the selection, such as bold, links or list structure, is replaced. Select within one paragraph for the cleanest result, and use **Undo** if you don't like the change. With nothing selected you see "Select some text first."

## Rewrite a whole article

Rankbox doesn't regenerate an article that already has text: **Write now** appears only on articles with no text, so you never lose an edited version by accident. To change a written article, use the AI actions passage by passage, or edit it by hand. To start over, delete the article. If its keyword is in your site's keyword set, it shows up as a gap on **Rank → Your market**; click **Plan it** and write the new idea. That uses another credit.

## How saving works

Saving depends on whether the article is published, because a published article is what your site reads.

| Article | When changes save | Save status shown |
| --- | --- | --- |
| Idea, scheduled or draft | Automatically, 1 second after you stop typing, and when you close the panel or switch articles | "Saving…", then "Saved" |
| Published | Only when you click **Publish changes** (or press Cmd+S / Ctrl+S) | "Unpublished changes", then "Publishing…" |

The title, **Target keyword** and **Meta description** save with the body. If you clear the title, the previous title is kept. If a save fails, the status reads "Couldn't save" with **Retry**.

Rankbox asks before you lose work:

- **Leaving a published article with unpublished edits** shows "Publish your changes?" with **Discard**, **Keep editing** and **Publish changes**.
- **Leaving a draft whose last save failed** shows "Your latest edits didn't save" with **Discard**, **Keep editing** and **Try again**.
- Closing the browser tab with unsaved edits triggers your browser's own warning.

## Publish and publish changes

| Button | Shown on | What it does |
| --- | --- | --- |
| **Publish** | An article with your text that isn't published | Saves it, sets it to **Published**, sends it to a connected Webflow or Shopify site, and shows "Article published." |
| **Publish changes** | A published article you've edited | Saves your edits, sends the update to a connected Webflow or Shopify site, and shows "Changes published." |

**Publish** is disabled while the document is empty ("Write something first"). **Publish changes** is disabled until you change something.

The Webflow and Shopify connections leave alone a post you've edited or deleted in your CMS, so changes made in Rankbox afterwards don't overwrite it. See [Webflow](/docs/publishing/webflow) and [Shopify](/docs/publishing/shopify).

## What published means for the REST API

In the REST API, an article the dashboard shows as **Published** has the stored status `finished`. Only finished articles are returned by `GET /articles`; ideas, scheduled articles and articles being written are never visible to your site.

Every saved change to a finished article updates its `updated_at` time, so `GET /articles?since=` returns it again on your site's next sync. That's why the editor holds a published article's edits until you click **Publish changes**: half-typed sentences never reach your site. The body your site receives has the writer's image notes and link suggestions removed. See [Articles endpoints](/docs/api/articles) and [Syncing articles reliably](/docs/api/syncing).

## Reschedule from the panel

For a **Scheduled** or **Overdue** article, the **Details** section shows **Writes on** (or **Was due**) with the date. Click the date, pick a day in the calendar, and the article moves there. Past days are disabled. The queue reorders to match, and a toast offers **Undo**. More ways to move articles are in [Content plan and calendar](/docs/content/content-plan).

## The side rail

| Section | Contents |
| --- | --- |
| **SEO** | The score gauge with a verdict and a line such as "9 of 11 checks passed" (once the article has text), **Target keyword**, and **Meta description** with a character counter out of 160 that turns red above 160 |
| **Details** | **Status**, **Writes on** or **Was due** (scheduled articles), **Updated** (published articles), **Est. traffic**, **Competition**, **AI signal** |
| **Content** | **Words**, **Read time**, **Keyword density**, **Headings** (H2 and H3 counts), **Links**, **Readability** |
| **Checklist** | Every scoring check with a pass, warning or fail icon and a one-line detail |

The score updates live as you type. Every check is explained in [The SEO and GEO score](/docs/content/scoring).

## Delete an article

1. Click **More actions** (**…**) in the header.
2. Click **Delete article**.
3. Confirm with **Delete article** in the dialog "Delete this article?". Click **Cancel** to keep it.

Deleting removes the article from Rankbox permanently and shows "Article deleted." It doesn't return the credit of a written article, and it doesn't remove a copy already sent to your website. An article that is being written can't be deleted until it finishes.

The same menu has **Copy link**, which copies the dashboard link to this article.

## Keyboard shortcuts

| Keys | Where | Action |
| --- | --- | --- |
| `/` | Articles list, no article open | Jump to **Search articles** |
| Escape | **Search articles** box | Clear the search |
| `J` / `K` | Article panel, when you aren't typing | Next / previous article |
| Esc | Article panel | Close the panel |
| Cmd+S / Ctrl+S | Article panel | Save a draft now, or publish a published article's changes |
| Enter | Title | Move to the start of the body |
| Cmd+B, Cmd+I, Cmd+Z (Ctrl on Windows) | Body | Bold, italic, undo |

## Editor limits

- **Headings.** The editor keeps H1 to H3. A deeper heading (H4) in a generated article is saved as a normal paragraph once you edit and save the article.
- **Tables.** The editor has no table support. A table in a generated article is saved as plain lines of text once you edit and save the article.
- **Images.** You can't upload images in Rankbox. Add them in your CMS.
- **Video.** The article's YouTube embed is kept through edits and saves.
- **Writer notes.** Image notes and internal-link suggestions show in the document. Delete them by hand in articles you edit; see [How articles are written](/docs/content/writing#internal-links).

## Troubleshooting

| What you see | What to do |
| --- | --- |
| "Couldn't save" with **Retry** | Click **Retry**. If it keeps failing, copy your text somewhere safe and reload |
| **Publish changes** is greyed out | You haven't changed anything since the last publish |
| An edit doesn't show on your Webflow or Shopify site | The post was edited in the CMS, so the connection leaves it alone. Update it there |
| "This article isn't here anymore" | It was deleted, or the link is out of date. Click **Back to articles** |
| An article stays in **Writing** for a long time | The tab that started it may have closed mid-write. Contact [support](/docs/help/support) |

## Related

- [How articles are written](/docs/content/writing): what the writer produces and how
- [The SEO and GEO score](/docs/content/scoring): every check in the side rail
- [Content plan and calendar](/docs/content/content-plan): statuses, scheduling and moving dates
- [Brand voice and writing settings](/docs/content/brand-voice): the voice AI rewrites follow
- [Articles endpoints](/docs/api/articles): how published articles reach your site through the API
