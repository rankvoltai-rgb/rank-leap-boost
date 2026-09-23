# Rankbox for Framer

Syncs your finished Rankbox articles into a Framer CMS collection, adds
article structured data to your published site, and tells Rankbox where each
article went live.

Rankbox supplies the words. Framer does the layout.

## Requirements

- A Rankbox account with an active trial or plan.
- A Framer project you can edit. Changing CMS fields and site settings needs
  edit permission — a viewer can open the plugin but not sync.

## Setup

1. In Rankbox, go to **Integrations** and create an API key. It's shown once.
2. Open the Rankbox plugin in your Framer project and paste the key. The
   plugin checks it immediately and shows the brand name it connected, so you
   know it's the right site.
3. The plugin creates an **Articles** collection and syncs every finished
   article into it.
4. Bind the collection to a collection page and design it however you like.
5. Publish your site. Articles go live when you publish, never before.

## Usage

**Sync articles** brings the collection up to date: new articles are added,
edited ones are updated, and articles deleted in Rankbox are removed. Item ids
match Rankbox article ids, so re-syncing never duplicates anything.

**Resync everything** rewrites every article, for when a collection has drifted.

**Live URLs** are reported back to Rankbox once your site is published. This is
what the backlink exchange verifies hosted links against. Set your collection
page path (default `/blog`) and the plugin composes each article's URL from
your published domain.

### Fields

| Rankbox          | Framer                   |
| ---------------- | ------------------------ |
| Title            | Title                    |
| Slug             | the item's slug          |
| Article body     | Content (formatted text) |
| Meta description | Description              |
| Tags             | Tags                     |
| SEO score        | SEO Score                |
| Live URL         | Live URL                 |

Fields you add yourself are left alone. If you rename one of Rankbox's fields,
the plugin keeps your label.

### Slugs

An article keeps the slug it was first synced with, even if you retitle it in
Rankbox. Changing a published page's URL would break it and invalidate the URL
already reported to Rankbox. Turn on **Follow slug changes from Rankbox** if you
want slugs to track titles instead.

### Structured data

With **Add article structured data** on, the plugin writes a JSON-LD block into
your site's `<head>` describing your organisation, your blog, and each synced
article with its own URL.

One honest limitation: Framer allows a single custom-code block per location,
site-wide, and cannot inject unique code into individual CMS pages. So this is
one graph covering every article rather than per-page `Article` markup. That's
deliberate — the alternative is writing the markup with JavaScript at runtime,
which most AI crawlers never execute, making it invisible to exactly the engines
this is meant for. A static block in the page source is readable by all of them.

If something else already occupies your site's head custom code, the plugin
leaves it alone and says so.

## What data leaves Framer

- Your Rankbox API key, sent to `rankbox.xyz` to authenticate.
- When you report live URLs: the public URL of each article page.

Nothing else. Not your project contents, not other CMS collections, no
analytics. `rankbox.xyz` is the only origin the plugin contacts.

## Where your key is stored

In this browser's local storage, for this plugin only. It is **not** written
into the Framer project, so it is never shared with collaborators — plugin data
travels with a project and is readable by everyone on it, which is the wrong
place for a credential.

The trade-off: a teammate opening this collection pastes their own key. The
plugin shows which brand and key prefix the collection is configured for, so
they know what to ask for.

**Log Out** in the plugin's header menu removes the key and any structured data
the plugin added. Your CMS items are left untouched.

## Troubleshooting

| Problem                                    | What to do                                                                                                                                                               |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| "That key isn't valid any more"            | The key was revoked or replaced. Create a new one in Rankbox → Integrations.                                                                                             |
| "This site isn't on an active plan"        | The site's trial or plan lapsed, or the site was removed in Studio. Check Rankbox → Billing.                                                                             |
| "Your Framer domain doesn't match Rankbox" | Rankbox only accepts live URLs on your own domain. Publish to your custom domain, or update your website in Rankbox → Settings. A `.framer.website` address won't match. |
| Nothing appears on the page                | The collection has the articles, but the page needs its fields bound. Check the collection page in Framer.                                                               |
| A teammate sees the Connect screen         | By design — keys are per browser, not per project.                                                                                                                       |
| "Rankbox is rate-limiting this key"        | Too many requests in a minute. Wait and sync again.                                                                                                                      |
| "A field was changed in the CMS"           | One of Rankbox's fields had its type changed. Use **Reset fields**, then sync.                                                                                           |
| Redirects didn't get added                 | Redirects need Site Settings permission and a project plan that includes them. Syncing still works without it.                                                           |
| "Some articles share a timestamp"          | A rare paging limit on Rankbox's side. Contact support.                                                                                                                  |

## Support

Setup and troubleshooting: <https://rankbox.xyz/integrations/framer>

## Modes

The plugin declares only the modes it needs: `canvas`,
`configureManagedCollection` and `syncManagedCollection`.

## Develop

```bash
npm install
npm run dev        # then Framer → Plugins → Open Development Plugin
npm run typecheck
npm run pack       # builds and writes plugin.zip for the Creator Dashboard
```

The shared API client in `packages/api-client` is aliased to source, so no
separate build step is needed.

Tests live beside the code in `src/lib` and run from the repo root with
`npm test` — they're DOM-free on purpose so they need no Framer runtime.

### Before submitting

`framer.json` ships with a placeholder `id`. Register the plugin in the
[Framer Creator Dashboard](https://www.framer.com/marketplace/dashboard/plugins/),
put the real id in `framer.json`, then run `npm run pack` and upload
`plugin.zip`.
