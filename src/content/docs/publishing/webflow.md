---
title: Publish to Webflow
nav_title: Webflow
description: Connect Webflow with Webflow sign-in, choose a CMS collection, map its fields, and let Rankbox write every finished article into it as a live item or a draft.
order: 2
updated: 2026-10-02
---

The Rankbox app for Webflow writes each finished article into a CMS collection on your Webflow site, from Rankbox's servers, the moment the article is finished. You connect with Webflow's own sign-in, pick the collection your blog uses, match its fields once, and your collection template does the layout.

{{availability:webflow}}

## How the Webflow app works

The Webflow app is a push integration. Rankbox holds an access token for your Webflow account and calls Webflow's CMS API itself, so nothing has to run on your site and there is no Rankbox API key to paste.

- Every finished article becomes one CMS item in the collection you choose.
- Items are created live on your published site or saved as drafts, depending on the mode you pick.
- Rankbox records every item it creates in a ledger, so it updates the same item later instead of creating a second one.
- Once you edit or delete an item in Webflow, Rankbox leaves it alone for good. Webflow stays the source of truth.

Each Rankbox site has at most one Webflow connection. With [Studio](/docs/account/studio), connect each site separately from its own **Integrations** page.

## Before you start

You need:

- An active Rankbox trial or plan on the site. Without one, the Webflow setup shows **Start free trial** instead of **Connect Webflow**.
- A Webflow site with a CMS collection for your blog posts. If the site has none, add one in Webflow first.
- At least one **Rich text** field in that collection, for the article body. It is the only field Rankbox requires.
- For live publishing: a Webflow site that has been published at least once. Publishing it to its `webflow.io` address is enough.

## Connect Webflow

1. Open **Dashboard → Integrations** and click the **Webflow** tile.
2. Under **Connect Webflow**, click **Connect Webflow**. Rankbox sends you to Webflow's consent screen.
3. On Webflow's screen, tick the Webflow site or sites Rankbox may publish to, and approve.
4. Webflow sends you back to **Dashboard → Integrations** with the Webflow setup open and the message "Webflow connected. Now choose the collection to publish into."
5. Continue with [Choose a site and collection](#choose-a-site-and-collection).

Start the connection from the Rankbox dashboard and finish it in the same browser within 15 minutes. The sign-in is tied to the browser that started it, so a link forwarded to someone else can't attach their Webflow account to yours.

## What Rankbox can access

Rankbox asks Webflow for three scopes, and uses each of them:

| Scope | Why Rankbox needs it |
| --- | --- |
| `sites:read` | To list the sites you authorized, read their custom domains, and check whether a site has been published |
| `cms:read` | To list a site's collections, read a collection's fields, and read an item before updating it |
| `cms:write` | To create and update the items Rankbox writes |

Rankbox never changes your design, pages, or CMS items it didn't create. It reads only the sites you ticked on Webflow's screen.

## Choose a site and collection

After connecting, step 2 of the setup is **Choose your collection and match its fields**.

1. In **Webflow site**, choose the site. If you authorized only one, it is already selected. A site's domain is shown next to its name.
2. In **Blog collection**, choose the collection your blog uses.
3. Rankbox reads the collection's fields and suggests a mapping. Continue with [Map your fields](#map-your-fields).

Everything shown here is read live from Webflow. The line **Read from Webflow … ago** says when; click **Refresh** after you change something in Webflow, such as adding a field.

If **Webflow site** is empty, Rankbox can't see any site: disconnect, connect again, and tick your site on Webflow's screen. If **Blog collection** is empty, the site has no CMS collections yet.

## Map your fields

Two fields are always filled the same way, because every Webflow collection has them:

| From Rankbox | Into your Webflow field |
| --- | --- |
| Title | **Name** |
| Slug | **Slug**, kept once published, so links never break |

The other four are yours to match. Each list only offers fields of a type that can hold the value:

| From Rankbox | Field types offered | Required | What is written |
| --- | --- | --- | --- |
| **Article body** | Rich text | Yes | The article as HTML (see [How items are written](#how-items-are-written)) |
| **Meta description** | Plain text or Rich text | No | The meta description. In a Rich text field it is wrapped in one paragraph. |
| **Tags** | Plain text | No | The tags joined with commas, for example `pricing, saas, churn` |
| **Published date** | Date/Time | No | The time Rankbox first created the item. It is never changed afterwards. |

Pick **Don't fill** for any optional row you want left alone. Rankbox suggests a field for each row from its name (for example a field called "Post Body" for the body, "Summary" or "Excerpt" for the description), and you can change every suggestion.

Rankbox checks the mapping against the collection before it lets you save. You see a message under the table when:

- No field is chosen for the article body.
- One field is chosen for two rows.
- A chosen field is no longer in the collection, or can't hold that value.
- The collection has a **required** field that nothing maps to. Webflow rejects any item that leaves a required field empty, so map it or make it optional in Webflow.

Fields you don't map, and any fields Rankbox doesn't know about, are left exactly as they are.

## Live or drafts

Under **New articles go**, choose one:

| Option | What happens |
| --- | --- |
| **Live on your site** | "Published the moment they're written." Rankbox creates each item directly on your live site. You don't need to publish the Webflow site again. |
| **To drafts** | "Saved as drafts to review and publish in Webflow." Items wait in the CMS until you publish them. |

**Live on your site** needs a Webflow site that has been published once. If it hasn't, the setup warns you and won't save until you publish it in Webflow (the `webflow.io` address is enough) and click **Refresh**, or choose **To drafts**.

Click **Start publishing** to save the setup. From then on, every newly finished article goes to Webflow. Articles that were already finished before you connected are not sent until you use [Sync now](#sync-now).

## When articles are sent to Webflow

Rankbox pushes a single article to Webflow when:

1. Autopilot finishes writing it.
2. You click **Write now**, **Publish** or **Publish changes** for it in the dashboard.

It pushes many at once when you click **Sync now** in the Webflow setup. Each push is safe to repeat: an article whose content hasn't changed since its last push is skipped without calling Webflow's write endpoints.

A failed push never undoes the article in Rankbox. The error is saved on the connection, the **Webflow** tile shows **Needs attention**, and the setup shows "The last publish failed:" with Webflow's message.

## How items are written

When Rankbox creates an item:

- **Name** is the article title (or "Untitled" if the title is empty).
- **Slug** is made from the title: lowercase letters, digits and hyphens, up to 100 characters. If another item in the collection already uses it, Rankbox tries `-2`, `-3` and so on, up to five attempts.
- **Article body** is the article converted to HTML, with Rankbox's writer notes removed (image concepts and internal-link placeholders), the opening H1 removed because your template shows the title, any YouTube `<iframe>` removed because a rich text field can't take one through Webflow's API (the plain link to the video below it stays), and code blocks turned into inline code line by line, because Webflow's API empties code blocks.
- The mapped **Meta description**, **Tags** and **Published date** fields are filled as described in [Map your fields](#map-your-fields).

Rankbox doesn't send images. Add a cover image or other images in Webflow if your template uses them.

## Updates and the item ledger

Rankbox keeps a ledger of every item it created: which article it came from, the item's slug, a fingerprint of what was written, and the item's last-updated time in Webflow. The ledger enforces these rules:

- **One item per article.** An article is created once per collection. If two pushes race (autopilot and **Sync now** at the same moment), only one creates the item.
- **The first slug is kept.** Updates never change an item's slug, even if you retitle the article in Rankbox.
- **Unchanged articles aren't rewritten.** If nothing Rankbox writes has changed, the item isn't touched.
- **Updates keep the item's state.** A live item is updated live; a draft stays a draft. The **Published date** isn't changed.
- **Items edited in Webflow are never overwritten.** Before every update, Rankbox reads the item. If its last-updated time no longer matches the one Rankbox recorded, the item is marked as edited in Webflow and Rankbox stops updating it, permanently. Treat any change you make to the item in Webflow, including publishing a draft, as that point.
- **Items deleted in Webflow are never re-created.** If the item is gone but the collection is still there, Rankbox marks it deleted and leaves it deleted.
- **Lost answers aren't duplicated.** If Webflow times out during a create, Rankbox looks for an item with the same slug and title made in the last 30 minutes before trying again, and adopts it instead of creating a second copy.

Deleting an article in Rankbox does not delete its Webflow item. Delete the item in Webflow yourself.

## Sync now

Once the setup is saved, step 2 becomes **Publishing** and shows the collection and site, a **Live** or **Drafts** pill, and three counts:

| Count | Meaning |
| --- | --- |
| **In Webflow** | Articles Rankbox has created in this collection (live or draft) |
| **Not yet** | Finished articles that aren't in this collection yet |
| **Edited in Webflow** | Items Rankbox now leaves as you edited them |

The button reads **Publish N articles now** when something is waiting, and **Sync now** otherwise. Either one sends every finished article that isn't in the collection yet, and updates every article that changed since its last push, except items edited or deleted in Webflow.

Each request works for up to about 45 seconds; the dashboard keeps calling (up to 20 rounds) until everything is through, showing "Publishing… N articles so far". For a very large backlog, click the button again if **Not yet** is still above zero. When it ends you see a summary such as "3 articles added, 1 article updated in Webflow." or "Webflow is up to date." If every article fails the same way (an unpublished site, or the same validation error three times in a row), the sync stops early and shows the first error.

## Live URLs from Webflow

When Rankbox creates a live item, it works out the item's public address as `https://{domain}/{collection slug}/{item slug}`. The domain is the custom domain that matches your site's **Website** in **Dashboard → Settings**, otherwise the site's first custom domain, otherwise `{site}.webflow.io`.

Rankbox records that address as the article's live URL only when all of these are true:

- The item was created live, not as a draft.
- The address is on your own domain. A `webflow.io` address is not.
- The article has no live URL recorded yet. A URL you pasted or one found in your sitemap wins.

Items created as drafts never get a live URL from the Webflow app. After you publish them in Webflow, the URL can still be found through your sitemap or pasted by hand. See [Live URLs and verification](/docs/publishing/live-urls).

If you add a custom domain in Webflow after setup, open **Change collection or fields** and click **Save** so Rankbox picks up the new domain.

## Change collection or fields

Click **Change collection or fields** to reopen the mapping form, then **Save**. Rankbox re-checks the mapping against the collection's current fields before saving.

Rankbox tracks items per collection. If you switch to a different collection, the next push for an article creates a new item in the new collection, and the items in the old collection stay where they are.

## Disconnect and reconnect

To disconnect, click **Disconnect** next to "Connected to …" and confirm in the **Disconnect Webflow?** dialog. Rankbox asks Webflow to revoke its access, deletes the stored token, and stops publishing. Items already in your collection stay exactly as they are.

The connection's ledger is kept. If you connect again later, Rankbox updates the items it created before instead of duplicating them. If the Webflow site you published to is still among the sites you authorize, publishing resumes; otherwise you choose a collection again.

If you remove Rankbox's access from Webflow's side instead, the next push gets an authorization error. Rankbox then deletes the token at once, the **Webflow** tile shows **Reconnect**, and the setup says "Webflow access was removed. Reconnect Webflow to keep publishing."

## Security and token storage

- Rankbox never sees your Webflow password. You sign in on webflow.com.
- The access token is encrypted at rest with AES-256-GCM. The encryption key is kept in Rankbox's server environment, never in the database beside the token.
- The token never reaches your browser. Every Webflow call, including the site and collection lists in the setup, runs on Rankbox's servers.
- The sign-in request is signed and tied to your browser with a short-lived cookie, and expires after 15 minutes.
- Every site and collection id sent from the dashboard is checked against what the token can actually see before Rankbox uses it.

## Troubleshooting

| What you see | Cause | Fix |
| --- | --- | --- |
| "Webflow wasn't connected: access was declined on Webflow's screen." | You clicked Cancel on Webflow's consent screen. | Click **Connect Webflow** again and approve. |
| "That Webflow sign-in expired or was started elsewhere. Connect again from here." | More than 15 minutes passed, you finished in a different browser, or the install started from Webflow's side. | Start again from **Dashboard → Integrations → Webflow** and finish in the same browser. |
| "Couldn't finish connecting Webflow. Try again in a moment." | Webflow didn't complete the token exchange. | Try again. If it repeats, contact [support](/docs/help/support). |
| "Your Webflow site hasn't been published yet, so Webflow won't take live articles." | Webflow refuses live items on a site that was never published. | Publish the site once in Webflow, or switch to **To drafts**. |
| "Webflow requires "…", which Rankbox has nothing to put in." | A required collection field isn't mapped. | Map it, or make it optional in Webflow. |
| **Needs attention** on the tile, "The last publish failed: …" | The last push failed with Webflow's message shown. | Fix what the message names, then click **Sync now**. |
| **Reconnect** on the tile | Webflow access was removed. | Click **Connect Webflow** again. The ledger carries over. |
| **Not yet** stays above zero | Articles finished before you connected, or pushes that failed. | Click **Publish N articles now**. |
| An edit made in Rankbox doesn't reach Webflow | The item is counted under **Edited in Webflow**. | Make the change in Webflow, or delete the item there and recreate it by hand. Rankbox won't touch it again. |
| "Start your free trial to connect your site." | The site has no active trial or plan. | Start the trial or renew the plan under **Dashboard → Plan & Billing**. |

## Related

- [How publishing works](/docs/publishing/overview): the push and pull models and how every destination compares.
- [Live URLs and verification](/docs/publishing/live-urls): what happens with the address Rankbox records for each item.
- [Editing articles](/docs/content/editor): **Publish changes** and how edits reach Webflow.
- [Publish to any website with the REST API](/docs/publishing/custom-sites): the path that works for any Webflow site through your own code.
- [Studio: run several sites](/docs/account/studio): one Webflow connection per Rankbox site.
