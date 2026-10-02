---
title: Troubleshooting
description: Fixes for Rankbox problems by area, from sign-in and onboarding to API errors, Webflow, Shopify, backlinks, Reddit and Studio, quoting exact messages.
order: 2
updated: 2026-10-02
---

Find your problem by area, match the message you see, and follow the fix. Messages are quoted exactly as Rankbox shows them, so you can search this page for the words on your screen. If nothing here helps, see [Get help](/docs/help/support) for what to send us.

## Sign-in and account

### Google sign-in fails

**What you see:** "Could not sign in with Google. Please try again."

**Why:** Rankbox couldn't start the Google sign-in, usually because the redirect to Google was interrupted.

**Fix:** Try again. If it keeps failing, sign in with email and password instead (if that's how you signed up), or [contact support](/docs/help/support) with the time it happened.

### Email sign-in shows an error

**What you see:** An error under the form after clicking **Sign in**, or "Authentication failed."

**Why:** The email or password doesn't match, the account was created with Google (which has no Rankbox password), or the email address hasn't been confirmed yet.

**Fix:**

1. Check the email address and password.
2. If you created the account with Google, click **Google** instead.
3. If Rankbox sent you a confirmation email, open its link first.

### No password reset link

**What you see:** The sign-in page has no "forgot password" option.

**Why:** Rankbox doesn't offer a self-serve password reset.

**Fix:** If you signed up with Google, sign in with **Google**. Otherwise, email [support](/docs/help/support) from the address on your account and ask for a reset.

### Signing in takes me to onboarding, not the dashboard

**Why:** The account has no site yet, because onboarding wasn't finished. Rankbox sends every account without a site to `/onboarding`, and every account with one to `/dashboard`.

**Fix:** Finish onboarding with **Confirm plan** on step 3. If you finished it on another browser, your progress there didn't carry over; see [Onboarding progress is missing](#onboarding-progress-is-missing).

### The dashboard says it couldn't load your sites

**What you see:** "We couldn't load your sites." with **Try again**.

**Fix:** Click **Try again**. If it persists, sign out, sign back in, and reload. If it still fails, [contact support](/docs/help/support).

### I lost the consent screen while connecting an AI app

**Why:** Connecting an AI app to your Rankbox account sends you through sign-in and back to a consent screen. If you signed up or switched accounts on the way, the browser may land on onboarding or the dashboard instead.

**Fix:** Start the connection again from the AI app while signed in to Rankbox. See [Agent authentication](/docs/agents/authentication).

## Onboarding

### The site can't be read

**What you see:** "Couldn't read that site. Fill it in and continue."

**Why:** The scan couldn't fetch the address, or the page had no readable text, for example a site that blocks automated visitors or renders everything with JavaScript.

**Fix:** Check the address in **Website** and click **Re-scan**. If it still fails, type **Brand name** and **What you do** yourself and click **Find my keywords**; the rest of onboarding works without the scan.

### Find my keywords is greyed out

**What you see:** The button is disabled, or "Add your website and brand name to continue."

**Why:** The button waits for the site scan to finish and needs both **Website** and **Brand name**.

**Fix:** Wait for **Reading** to disappear from the website field, and fill in any empty required field.

### The keyword analysis fails

**What you see:** "Analysis failed. You can still add keywords by hand."

**Fix:** Add the keywords you want in **Add a keyword you know converts**, or click **Back**, then **Find my keywords** to run the analysis again.

### The keywords don't fit my business

**Why:** The analysis works from the page at your website address and the description you confirmed. A thin page or a vague description gives generic keywords.

**Fix:** Click **Back**, make **What you do** specific (what you offer, and to whom), and continue again. Remove keywords that don't fit with **×** and add the ones you know convert.

### The content plan fails to build

**What you see:** "We couldn't build your content plan."

**Fix:** Click **Try again**. Planning needs at least one keyword.

### AI requests too quickly

**What you see:** "You're making AI requests too quickly. Wait a minute and try again."

**Why:** Each account has a per-minute limit on AI requests: site scans, analyses, plan builds, article writing and editor AI actions all count.

**Fix:** Wait a minute, then retry.

### Setup hit a snag

**What you see:** "Setup hit a snag" and "Something in your saved progress didn't load."

**Fix:** Click **Start over**. Rankbox clears the progress saved in this browser and starts onboarding again.

### Confirm plan shows an error

**What you see:** "Couldn't finish setup." or another message after **Confirm plan**.

**Fix:** Click **Confirm plan** again. Confirming is safe to repeat: it replaces the keywords and unwritten articles it saved before rather than duplicating them.

### Onboarding progress is missing

**Why:** Progress is saved in the browser you started in, for the account you were signed in as. Another browser or device, a cleared browser, or a different account starts from step 1.

**Fix:** Return to the original browser, or run the steps again. Nothing is saved to your account until **Confirm plan**.

## Trial and billing

### Writing asks me to start a trial

**What you see:** The **Start your 7-day free trial** dialog, or "Start your free trial to generate articles."

**Why:** Rankbox writes only for an account with a trial or paid plan. Onboarding is free; writing is not.

**Fix:** Click **Start free trial** and add a card in the Stripe form. You aren't charged until day 8. See [The free trial](/docs/account/free-trial).

### Your card couldn't be verified

**What you see:** "We couldn't verify your card. Update it in billing to start generating."

**Why:** When a trial starts, Rankbox places a $1 authorization on the card and releases it. This card couldn't hold it, for example because it had no funds or its bank required an extra verification step.

**Fix:** Open **Plan & Billing → Card & invoices** and add a different card in Stripe's portal. Writing unlocks once the card is verified.

### The trial didn't start after payment

**What you see:** "Your payment went through, but we couldn't start the trial."

**Fix:** Wait a minute and reload the dashboard; the trial is confirmed from Stripe in the background. If **Plan & Billing** still shows no plan, [contact support](/docs/help/support) with the time of the payment.

### A payment failed

**What you see:** "Your last payment didn't go through", and **Business · payment due** in the sidebar.

**Why:** Stripe couldn't charge your card at renewal. Writing, syncing, backlinks and Reddit keep working for 48 hours after the failure, then stop until the invoice is paid.

**Fix:** Click **Update card** on the banner and update your card in Stripe's portal. Your articles and settings are kept in the meantime.

### Starting the paid plan early is still pending

**What you see:** "The payment is still being confirmed. Check back in a minute." after **Unlock everything now**.

**Fix:** Wait a minute and reload **Plan & Billing**. Don't click again in the meantime.

### Your plan isn't active

**What you see:** "Your plan isn't active" with **Restart plan**, or "Syncing is paused" in **Integrations**.

**Why:** The subscription ended or was never started. Your articles and settings are saved.

**Fix:** Click **Restart plan**. Autopilot picks up where it left off.

## Writing articles and credits

### Out of article credits

**What you see:** "You've used all 30 articles this month", "This site has used all its articles for this billing period.", "Upgrade to write" on article buttons, or "Autopilot has used this month's articles".

**Why:** The site has spent its article credits for the current billing period: 7 during the trial, 30 a month on the paid plan.

**Fix:**

- During the trial, open **Plan & Billing** and click **Unlock everything now** to start the paid plan today. The site resets to 30 credits.
- On the paid plan, credits reset to 30 at your next renewal, shown in **Plan & Billing**, and autopilot resumes then. There is no larger plan or credit top-up. **Upgrade** buttons take you to **Plan & Billing**.

See [Plans and credits](/docs/account/plans-and-credits).

### An article seems stuck on Writing

**Why:** Writing usually takes under a minute. The article list refreshes on its own while anything is being written.

**Fix:** Wait a couple of minutes and reload the page. If writing failed, the article returns to its previous state and the credit is returned. If it still shows **Writing** after several minutes, [contact support](/docs/help/support) with a link to the article (**More actions → Copy link**).

### The article is on the wrong site

**What you see:** "That article isn't on this site."

**Why:** The article belongs to a different site on your account than the one being written for, usually after switching sites in another tab.

**Fix:** Reload the page, check the site switcher shows the right site, and try again.

### This site isn't active on your plan

**What you see:** "This site isn't active on your plan. Restore it from Studio to use it."

**Why:** The site is a Studio site that has been removed or archived, or the site isn't part of a live plan.

**Fix:** Open **Studio** and restore the site, or switch to a live site. See [Studio problems](#studio).

### Editor AI actions don't work

**What you see:** "Select some text first." or "AI edit failed."

**Fix:** Select the passage you want changed before choosing **Improve SEO**, **Rewrite**, **Expand** or **Shorten**. If it fails again, wait a minute; the actions share your account's AI rate limit.

### Edits didn't save

**What you see:** "Your latest edits didn't save" or "Publish your changes?" when leaving an article.

**Why:** A draft's last save failed, or a published article has edits you haven't published. Edits to a published article stay local until you click **Publish changes**.

**Fix:** Click **Try again** or **Publish changes** before leaving. Leaving anyway discards those edits.

### The article isn't here anymore

**What you see:** "This article isn't here anymore" in the article panel.

**Why:** The article was deleted, or the link points at an article on another site or account.

**Fix:** Click **Back to articles**. If you expected the article to exist, check you're on the right site with the site switcher.

## Autopilot

### Autopilot shows Off

**What you see:** **Autopilot Off** on **Overview**, with one of these reasons:

| Reason shown | Fix |
| --- | --- |
| "Start your free trial to turn autopilot on." | Start the trial from **Overview** |
| "This month's articles are used up. Autopilot resumes when your plan renews." | Wait for renewal, or during the trial use **Unlock everything now** |
| "Autopilot is paused. Turn it back on in Settings." | Switch on **Settings → Autopilot → Write automatically**, or click **Resume** on the Articles page |

### Articles are marked Overdue

**What you see:** **Overdue** on scheduled articles, and "N articles are overdue." on the autopilot bar.

**Why:** Their scheduled day has passed and they haven't been written, usually because the site had no trial, no credits, or autopilot was paused.

**Fix:** Fix the cause first, then click **Re-plan from tomorrow** on the autopilot bar. It keeps the articles in order and lays them out from tomorrow at your pace. To get one out today, open it and click **Write now**.

### Autopilot will run out before the month ends

**What you see:** "autopilot will run out before the month ends" under **Settings → Autopilot → Pace**.

**Why:** Your pace writes more articles a month than the site's credits cover.

**Fix:** Pick a lower pace, or accept that autopilot stops when credits run out and resumes at renewal.

### Ideas are never written

**Why:** Autopilot writes only scheduled articles. Ideas wait until you schedule them.

**Fix:** Open the idea and click **Schedule**, click **Add to queue** under **Content gaps to win** on **Overview**, or click **Write now** to write it immediately.

### Autopilot replaced my text

**Why:** Text typed into a scheduled article that wasn't published is replaced when autopilot writes that article.

**Fix:** When you write a scheduled article by hand, click **Publish** to keep your version. To keep autopilot away from an idea entirely, leave it unscheduled.

## Publishing with the API

### 401 Invalid or missing API key

**What you see:** HTTP 401 with `{"error": "Invalid or missing API key. Pass it as 'Authorization: Bearer <key>'."}`

**Why:** No key was sent, the key doesn't start with `rv_live_`, the key is mistyped, or it has been revoked.

**Fix:** Send the key as `Authorization: Bearer $RANKBOX_API_KEY` (the `X-Api-Key` header also works). Check **Integrations → Your connections**: a key marked **Revoked** never works again; create a new one. See [Authentication and API keys](/docs/api/authentication).

### 402 Subscription required

**What you see:** HTTP 402 with `"code": "subscription_required"` and "This site isn't active on a Rankbox plan, so it can't sync articles. Check the plan, and the site in Studio, at https://rankbox.xyz/dashboard/billing."

**Why:** The key is valid, but its site can't sync right now. The account has no trial or plan, the trial card failed its check, a payment failed more than 48 hours ago, the plan has ended, or the key's Studio site was removed or archived.

**Fix:** Check **Plan & Billing** for the account and **Studio** for the site. Syncing resumes as soon as the site is active again; the key doesn't need replacing. See [Errors](/docs/api/errors).

### 429 Rate limit exceeded

**What you see:** HTTP 429 with `{"error": "Rate limit exceeded. Slow down and retry shortly."}`

**Why:** More than 120 requests in a minute across all of your account's keys, or more than 300 requests in a minute from one IP address.

**Fix:** Wait and retry with backoff. Poll less often: syncing with `since=` once every few minutes, or at build time, is plenty. See [Rate limits](/docs/api/rate-limits).

### 404 Article not found

**What you see:** HTTP 404 with `{"error": "Article not found"}` from `GET` or `PATCH /articles/{id}`.

**Why:** The id isn't a published article of this key's site. It may have been deleted, not written yet, or belong to another site.

**Fix:** List articles with `GET /articles` and use an `id` from that response.

### 400 when reporting a live URL

**What you see:** HTTP 400 from `PATCH /articles/{id}` with one of:

| Message | Fix |
| --- | --- |
| "Send { published_url } — the article's live URL." | Send a JSON body like `{"published_url": "https://yoursite.com/blog/post"}` |
| "published_url is not a public http(s) URL." | Send the full public address, starting `https://` |
| "published_url must be on your own site (yoursite.com)." | Send a URL on the site's own domain, or correct **Settings → Website** |

See [Live URLs and verification](/docs/publishing/live-urls).

### 500 Internal error

**What you see:** HTTP 500 with `{"error": "Internal error"}`.

**Fix:** Retry with backoff. If it continues, [contact support](/docs/help/support) with the endpoint, the time of the request in UTC and your key's prefix (never the full key).

### Setup never leaves Listening for your site's first request

**What you see:** "Listening for your site's first request…" under **See it connect**, or "Waiting for your site's first sync" on **Integrations**.

**Why:** No request has succeeded with the new key yet. Only a successful request counts: one refused with 401 or 402 doesn't mark the key as used.

**Fix:** Check the key is deployed where your site's code reads it, then redeploy or rerun the job. To test the key on its own, call the ping endpoint:

```bash title="cURL"
curl https://rankbox.xyz/api/public/v1/ping \
  -H "Authorization: Bearer $RANKBOX_API_KEY"
```

A working key returns `{"ok": true, "service": "Rankbox", "brand_name": "…"}`, and the setup in **Integrations** turns to "Connected" within a few seconds. A 401 or 402 response points to the sections above.

### Creating a key is refused

**What you see:** "Start your free trial to connect your site." or **Start free trial** instead of **Create key**.

**Fix:** Connecting a site comes with your plan. Start the trial, then create the key.

### Your site hasn't synced since a date

**What you see:** "Your site hasn't synced since" a date, **Not syncing** under **Your site**, or a key marked **Idle**.

**Why:** No successful request with any of the site's keys for more than 48 hours.

**Fix:** "Check the plugin or code is still running and using an active key." A replaced or revoked key, a stopped scheduled job, or a failed build are the usual causes.

### I lost my API key

**Why:** A key is shown only once. Rankbox stores a hash, not the key.

**Fix:** In **Integrations → Your connections**, click **Replace key** on it. Put the new key in your site, then revoke the old one.

### Edited articles don't update on my site

**Why:** Your code only fetched new articles, or it inserts instead of updating.

**Fix:** Sync with `since=` set to the last `next_since` you received, which returns every article published or edited since. Update existing posts by the article `id`. See [Syncing articles reliably](/docs/api/syncing).

## Webflow

### Connecting Webflow fails

Connecting returns you to **Integrations** with one of these messages:

| Message | Fix |
| --- | --- |
| "Webflow wasn't connected: access was declined on Webflow's screen." | Connect again and approve access on Webflow's screen |
| "That Webflow sign-in expired or was started elsewhere. Connect again from here." | Start the connection again from **Integrations** in the same browser |
| "Couldn't finish connecting Webflow. Try again in a moment." | Wait a moment and connect again |
| "Connecting Webflow isn't available right now." | Publish with the [REST API](/docs/publishing/custom-sites) meanwhile |
| "That Webflow site isn't authorized for Rankbox. Reconnect and include it." | Reconnect and select that site on Webflow's authorization screen |

### Webflow access was removed

**What you see:** "Webflow access was removed. Reconnect Webflow to keep publishing." and a **Reconnect** tile.

**Why:** The authorization was revoked in Webflow or the app was removed from the site. Rankbox deletes the access it had.

**Fix:** Open the Webflow tile in **Integrations** and connect again. Publishing picks up where it left off.

### Webflow won't take live articles

**What you see:** "Your Webflow site hasn't been published yet, so Webflow won't take live articles. Publish it once in Webflow (the webflow.io address is enough), or switch Rankbox to drafts."

**Fix:** Publish the site once in Webflow, or set **New articles go** to **To drafts** in the Webflow setup. Then click **Sync now**.

### Publishing to Webflow needs attention

**What you see:** "Publishing to Webflow needs attention" on **Integrations**, and **Needs attention** on the tile, with the last error.

**Fix:** Read the error, fix it in Webflow (often a required field in the collection), then open the Webflow tile and click **Sync now** or **Publish N articles now**.

### An article edited in Webflow wasn't updated

**Why:** By design. Webflow stays the source of truth: an item someone edited or deleted in Webflow is left alone and counted under **Edited in Webflow**.

**Fix:** Make further edits in Webflow, or delete the item there and let Rankbox publish it again. See [Webflow](/docs/publishing/webflow).

## Shopify

### Shopify asks you to open Rankbox in your admin

**What you see:** "Shopify needs you to open Rankbox in your Shopify admin once to keep publishing."

**Why:** Shopify's access tokens expire. Rankbox renews them on its own, but a renewal token that goes unused for 90 days expires too, and a store that hasn't published for that long needs the app opened once to issue fresh ones.

**Fix:** Open the Rankbox app from your Shopify admin. Publishing resumes; nothing else needs changing.

### The Shopify session expired

**What you see:** "Your Shopify session expired. Reload the page." inside the Rankbox app in Shopify.

**Fix:** Reload the page in your Shopify admin.

### The Shopify tile says App removed

**Why:** The Rankbox app was uninstalled from the store.

**Fix:** Install the app again from your Shopify admin and choose the blog to publish into.

### Publishing to Shopify needs attention

**What you see:** "Publishing to Shopify needs attention" or "Finish setting up Shopify" on **Integrations**.

**Fix:** Open Rankbox in your Shopify admin. For "Finish setting up Shopify", pick the blog every finished article goes to. For an error, the app shows what failed.

### A post edited in Shopify wasn't updated

**Why:** By design. A post someone edited or deleted in Shopify is left alone. See [Shopify](/docs/publishing/shopify).

## Backlinks

### The Backlinks page says it's part of the paid plan

**What you see:** "Part of the paid plan" during the trial, or "Backlinks come with the plan" with no plan.

**Fix:** The exchange opens with your first paid invoice. To open it now, click **Unlock everything now** in **Plan & Billing**.

### Domain verification fails

**Fix:** Use exactly the values shown on **Verify your domain**, then check again:

| Method | What to add |
| --- | --- |
| **DNS record** | A TXT record at host `_rankbox.yourdomain.com` with the value `rankbox-site-verification=` followed by your token |
| **Meta tag** | The tag shown, inside the `<head>` of your home page |
| **File** | A file at `/.well-known/rankbox-verification` containing your token |

DNS changes can take time to reach every resolver; if a TXT record doesn't verify straight away, check again later.

### A hosted link stays Placed

**What you see:** **Placed**, with "in the article — we'll find it on your site once it's published" or "waiting to see it at" an address.

**Why:** Rankbox can't settle a link until it sees the article live on your site. It needs the article's live URL, and the link must be readable on that page.

**Fix:**

1. Make sure the article is published on your site.
2. Click **Paste live URL** and paste the article's address, on your own domain.
3. Keep the link in the article body, followed (no `nofollow`, `sponsored` or `ugc`), on an indexable page whose canonical URL is on your domain.

A link not seen live within 30 days expires and its credits are returned.

### Links on JavaScript-rendered pages can't be verified

**Why:** Rankbox's checker reads the HTML your server sends. If your article body is drawn in the browser with JavaScript, the checker never sees the article or the link. A page like that, a page behind a bot wall (403, 429 or 503), and a page that times out are inconclusive: they never count against you, but the link can't settle either.

**Fix:** Serve the article body in the page's HTML (server-side or static rendering), and allow automated visitors to read your blog pages.

### A link shows Can't see the link

**What you see:** **Can't see the link · 1/3** (or 2/3) on a live link, then **Lost**.

**Why:** Rankbox re-checks live links. A link missing from the page, made `nofollow`, or on a page turned `noindex` counts as a failure. Three failures over at least 72 hours mark the link **Lost** and its credits are charged back.

**Fix:** Restore the link in the article body, followed, on an indexable page.

### Your plan has lapsed

**What you see:** "Your plan has lapsed." on **Backlinks**.

**Why:** The paid plan ended. Your links stay live and your credits are held, not lost. Nothing new is placed until you resubscribe.

## Reddit

### The Reddit page says it's part of the paid plan

**What you see:** "Part of the paid plan" or "Reddit presence comes with the plan".

**Fix:** Reddit Presence opens with your first paid invoice. To open it now, click **Unlock everything now** in **Plan & Billing**.

### Reddit discovery isn't switched on

**What you see:** "Reddit discovery isn't switched on yet" and "This workspace has no discovery provider connected, so no threads have been searched for." Running a sweep shows "Reddit discovery isn't switched on for this workspace yet."

**Why:** Thread discovery runs through a provider that Rankbox connects on its side. Nothing on your account is wrong and nothing you set changes it.

**Fix:** [Contact support](/docs/help/support) and mention the message.

### A sweep didn't start

| Message | Meaning |
| --- | --- |
| "A sweep is already running." | Wait for the current sweep to finish |
| "You ran a sweep a moment ago. Give it a little while." | Sweeps are spaced out; try again later |
| "Sweeps are part of the paid plan." | Start the paid plan |

### The disclosure line is refused

**What you see:** "It has to name" your brand "and say, in the first person, that you work on it."

**Fix:** Keep a line like "Full disclosure: I work on {brand}." Every draft includes it; it can be reworded, never removed.

### Out of Reddit credits

**Why:** Each draft costs 1 credit, and so does a rewrite, unless the draft failed its checks ("Rewrite — free, this one failed its checks"). Credits reset each billing period; the date is under **Reply credits**.

**Fix:** Wait for the reset shown under **Reply credits**.

### A posted reply isn't confirmed

**Fix:** Paste the link to your comment in "Paste the link to your comment to verify it" and click **Check now**. Rankbox needs the comment's own link, not the thread's.

## Studio

### Studio won't let you add a site

| Message | Fix |
| --- | --- |
| "Start your plan first. Studio adds sites to a paid plan." | Start a plan |
| "Studio opens with your first paid invoice. Your trial covers one site." | Click **Start paid plan now**, or wait for day 8 |
| "Your last payment didn't go through. Update your card in billing to add sites." | Update your card in **Plan & Billing** |
| "Your plan is set to end. Resume it in billing to add sites." | Resume the plan in Stripe's portal |
| "Your plan isn't active. Restart it in billing to add sites." | Restart the plan |
| "Studio isn't switched on for this account yet. Contact support and we'll set it up." | [Contact support](/docs/help/support) |

### The new site is paid for but its plan didn't save

**What you see:** "The site is paid for, but its plan didn't save. Try again."

**Fix:** Click **Finish setup**. The site is already paid for; this only saves its plan, and nothing is charged again.

### A card is declined when adding a site

**What you see:** "Your card was declined" followed by the bank's reason, and "Update it in billing and try again."

**Fix:** Update your card in **Plan & Billing → Card & invoices**, then add the site again.

### A removed site is still running

**Why:** By design. A removed Studio site keeps running until the end of the period you've paid for, with a banner saying when it "leaves Studio". After that date it stops, and it is archived with its articles and settings kept.

**Fix:** To cancel the removal, click **Keep this site** on the banner, in **Settings → Studio**, or on the site's card in **Studio**. To get an archived site back, restore it from **Studio**; restoring charges its share of the current period.

### A removed site's API key returns 402

**Why:** A Studio site that has left Studio isn't active, so its keys stop syncing.

**Fix:** Restore the site in **Studio**. The same keys work again once it's active.

## Dashboard

### The page shows another site's data

**Why:** The dashboard shows one site at a time, chosen in the site switcher and kept in the address as `?site=`.

**Fix:** Check the site switcher at the foot of the sidebar and choose the right site. A link without `?site=` always opens your primary site.

### A link opened my primary site instead

**Why:** The link pointed at a site that has left your account or isn't yours. Rankbox opens your primary site and corrects the address.

### The Rank page is blurred

**What you see:** "See where you rank — and what to do next" over a blurred page.

**Fix:** Rank comes with the trial and the paid plan. Click **Start 7-day free trial**.

## Related

- [FAQ](/docs/help/faq): short answers to common questions.
- [Get help](/docs/help/support): contact support and what to include.
- [Errors](/docs/api/errors): every API error in reference form.
- [Account and site settings](/docs/account/settings): where each setting lives.
- [Studio: run several sites](/docs/account/studio): removal, archiving and restoring.
