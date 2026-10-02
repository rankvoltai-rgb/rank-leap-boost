# Rankbox listing kit

Everything a plugin marketplace or MCP directory asks for: names, taglines at
each length the forms allow, descriptions, feature lists, categories, answers
to the data and privacy questions, and the images in `out/`.

Rankbox has two listable products, and directories list them separately:

| | Rankbox for Framer (CMS plugin) | Rankbox MCP server |
|---|---|---|
| What it does | Syncs Rankbox articles into a Framer CMS collection | Gives an AI assistant three SEO / AI search research tools |
| Submit to | Framer Marketplace | Claude, ChatGPT, the MCP Registry, Smithery, mcp.so, MCP Market |
| Status | Built. Plugin id `9af397` set (§2) | Live at `https://rankbox.xyz/mcp` |
| Images | `out/cms/` | `out/mcp/` |

Both use the same icon, favicon and logo (§5).

Every length limit in this file is checked by `python3 count.py`. Headings
marked `(≤N)` and table rows that start with a number are the limits. Run it
after any edit.

**Copy rules.** These come from the strictest stores (Shopify, Square, Wix,
ChatGPT) and from the site's own copy tests. No install counts, ratings,
reviews, customer numbers, stats or traffic promises. No "best", "#1",
"first" or "only". No claims about anything Rankbox doesn't ship today. No
pricing in names, taglines or images. ChatGPT also bans upselling, so the MCP
copy never pitches the paid plan.

---

## 1. Where each piece goes

| Directory | Submit now? | Name | Short text | Long text | Icon | Images | Also needs |
|---|---|---|---|---|---|---|---|
| **Framer Marketplace**, framer.com/marketplace/dashboard/plugins | Yes. Publishes instantly, with no review | `Rankbox` | Byline: §2 tagline (80) | Description: §2 long | Ships in the zip (`packages/plugins/framer/public/icon.png`, 90px) | `out/cms/*` | Tags (§2), the pricing line, login disclosure |
| **Claude Connectors Directory**, claude.ai/directory/manage | Yes. No-auth servers are accepted for public data | `Rankbox` (≤100) | One-liner: §3 tagline (200) | Description: §3 long (≤2,000) | `out/icon/rankbox-icon-512.png` | None (only MCP Apps with UI take screenshots) | 1–5 categories, use cases, reviewer notes, data handling (§3) |
| **ChatGPT Plugins**, platform.openai.com | After two setup steps: verify your developer identity, and serve OpenAI's token at `/.well-known/openai-apps-challenge` | `Rankbox` (≤30) | §3 tagline (30) | §3 long (≤4,000) | `out/icon/rankbox-icon-512.png` | None (only plugins with UI take screenshots) | Capabilities, starter prompts, test cases (§3) |
| **Official MCP Registry**, registry.modelcontextprotocol.io | Yes, after proving you own rankbox.xyz (DNS TXT record or a `/.well-known/mcp-registry-auth` file) | `mcp-registry/server.json` | description (100) | — | icon URLs are in `server.json` | — | PulseMCP now imports from here |
| **Smithery**, smithery.ai/new | Yes. Paste the server URL | `Rankbox` | §3 tagline (100) | §3 long | `out/icon/rankbox-icon-512.png` | — | Homepage: https://rankbox.xyz/integrations/mcp |
| **mcp.so**, mcp.so/submit | Yes. Type: Remote | `Rankbox` | §3 tagline (100) | §3 long | same | — | Free with review ($39 skips the queue) |
| **MCP Market**, mcpmarket.com/submit | Yes. Paste the remote URL | `Rankbox` | §3 tagline (100) | §3 long | same | — | Free queue is 4–6 weeks ($29 lists within 24h) |
| **Glama**, **Cursor Marketplace** | No. Both need a public GitHub repo, and the server isn't open source | | | | | | Cursor users can still find it via cursor.directory |
| **Shopify, WordPress.org, Webflow, Wix, Square** | No. Those add-ons aren't built (`addonLive: false`) | | | | Icon sizes are ready in `out/icon/` | | See §4 |

---

## 2. Rankbox for Framer

### Name

`Rankbox`, as in `framer.json`. Framer shows "Rankbox" next to the icon, so
the tagline does the explaining.

### Tagline / byline

Use the longest one that fits.

| Limit | Text |
|---|---|
| 30 | `Daily articles, synced to CMS` |
| 50 | `Source-backed articles, synced into Framer CMS` |
| 62 | `Get cited by AI. Daily articles, synced into your Framer CMS.` |
| 80 | `Rankbox writes a source-backed article every day and syncs it into Framer CMS.` |
| 100 | `Sync Rankbox articles into Framer CMS, with structured data that AI crawlers can read.` |
| 150 | `Rankbox finds the questions buyers ask AI and writes a source-backed article every day. This plugin syncs each one into your Framer CMS.` |

### Description (≤2000)

```
Rankbox is an AI search growth engine for founders and small teams. It finds the questions buyers in your market ask ChatGPT, Perplexity, Gemini and Google, and writes a source-backed article on one of them every day.

This plugin brings those articles into your Framer project. It sets up a managed CMS collection and keeps it matched to your finished articles: new ones are added, edited ones are updated, and ones you delete in Rankbox are removed. Item IDs match Rankbox article IDs, so syncing again never creates duplicates. Nothing goes live until you publish your site.

You design the page. Bind the collection's fields (title, slug, formatted body, meta description, tags) to any collection page and style it like the rest of your site. Fields you add yourself are left alone.

Turn on article structured data and the plugin writes a JSON-LD block into your site's head. It's static markup in the page source, so crawlers that never run JavaScript, which includes most AI crawlers, can still read it.

Once your site is published, the plugin reports each article's live URL back to Rankbox, so Rankbox knows where every article lives. Slugs stay fixed after the first sync, so a retitled article never breaks a published link.

Your API key is stored in your browser, not in the project, so it's never shared with collaborators. The plugin talks only to rankbox.xyz and sends nothing but your key and your articles' public URLs.

The plugin is free to install. It needs a Rankbox account with an active trial or plan: $49.50/month after a 7-day free trial.
```

### Short description (≤600)

For forms with a tight description box.

```
Rankbox writes a source-backed article every day on the questions buyers ask AI. This plugin syncs those articles into a managed Framer CMS collection: new ones are added, edited ones updated and deleted ones removed, with no duplicates. Bind the fields to your own collection page and publish when you're ready. Optional JSON-LD structured data makes every article readable by AI crawlers. Needs a Rankbox account ($49.50/month after a 7-day free trial).
```

### Features (each ≤80)

- Syncs finished Rankbox articles into a managed Framer CMS collection
- Adds new articles, updates edited ones and removes deleted ones
- Never duplicates: every CMS item is matched to its Rankbox article
- Maps title, slug, formatted body, meta description and tags to CMS fields
- Optional article JSON-LD in your site's head, readable by AI crawlers
- Reports each article's live URL back to Rankbox after you publish
- Keeps slugs stable, so a retitled article never breaks a live link
- API key stays in your browser, never in the shared project

### Highlights

For forms that want a title plus a sentence.

| Title | Body |
|---|---|
| A collection that keeps itself current | New articles are added, edited ones updated and deleted ones removed, every time you sync. |
| Your design, Rankbox's words | Bind the fields to any collection page. Rankbox supplies the content and Framer handles the look. |
| Readable by AI crawlers | Article structured data goes into your site's head as static markup, where crawlers that skip JavaScript still see it. |

### Setup steps

1. In Rankbox, open **Integrations** and create an API key.
2. Open the Rankbox plugin in your Framer project and paste the key.
3. The plugin sets up an Articles collection and syncs every finished article.
4. Bind the collection to a collection page and design it.
5. Publish your site. Live URLs are reported back to Rankbox.

### Category and tags

| Field | Value |
|---|---|
| Category | **CMS** (Framer's list: AI, CMS, Code, Ecommerce, Integrations, Libraries, Localization, Media, SEO, Styles, Utilities) |
| Tags | CMS, SEO, AI, Blog, Content |

### Pricing and login disclosure

Framer asks plugins to say when they need a login, and to show paid pricing in USD.

`Free plugin. Requires a Rankbox account with an active trial or plan ($49.50/month after a 7-day free trial).`

### Data and privacy

| Question | Answer |
|---|---|
| What data does the plugin send? | The user's Rankbox API key, to authenticate, and, when live URLs are reported, the public URL of each article page. Nothing else. |
| Which servers does it contact? | `rankbox.xyz` only. |
| Where is the API key stored? | In the browser's local storage for this plugin. Never in the Framer project. |
| Does it read other CMS collections or project content? | No. |
| Analytics or tracking? | None. |
| Privacy policy | https://rankbox.xyz/legal/privacy |
| Support | https://rankbox.xyz/integrations/framer · Rankboxai@gmail.com |

### Images

| File | Shows |
|---|---|
| `out/cms/rankbox-framer-1-1600x900.png` | Hero: a synced collection beside the plugin panel |
| `out/cms/rankbox-framer-2-1600x900.png` | The Connect screen: paste one key |
| `out/cms/rankbox-framer-3-1600x900.png` | A synced CMS item and its fields |
| `out/cms/rankbox-framer-4-1600x900.png` | The JSON-LD block and the switch that writes it |
| `out/cms/rankbox-framer-5-1600x900.png` | Live URL reporting |

The plugin panel in these images is built from the plugin's own markup and
stylesheet, filled with sample data: "Brightloop", the same sample site
/integrations/framer uses. Framer publishes no image size, so these are
1600×900 (16:9). After the first real run in a Framer project, real
screenshots are worth swapping in.

### Before you submit

1. The plugin id is `9af397` in `packages/plugins/framer/framer.json`. Framer doesn't issue ids; we generated it. Never change it after the first upload.
2. `cd packages/plugins/framer && npm run pack`, then choose "New Plugin" at framer.com/marketplace/dashboard/plugins and upload `plugin.zip`.
3. Once it's live, flip `addonLive` to `true` for framer in `src/data/platforms.ts`.

---

## 3. Rankbox MCP server

### Identity

| Field | Value |
|---|---|
| Display name | `Rankbox` |
| Server name (reported by the server) | `rankbox-mcp` |
| Registry name | `xyz.rankbox/mcp` |
| Server URL | `https://rankbox.xyz/mcp` |
| Transport | Streamable HTTP (remote) |
| Authentication | None |
| Tools | 3, all read-only |
| Documentation | https://rankbox.xyz/integrations/mcp |
| Privacy policy | https://rankbox.xyz/legal/privacy |
| Terms | https://rankbox.xyz/legal/terms |
| Support | Rankboxai@gmail.com |
| Company | Rankbox (Autusus LLC), https://rankbox.xyz |

### Tagline

| Limit | Text |
|---|---|
| 30 | `SEO research in any AI chat` |
| 100 | `Find the questions buyers ask AI, build SEO content briefs, and write meta descriptions.` |
| 200 | `A remote MCP server with three read-only SEO tools: the questions people ask AI about a topic, a content brief for any keyword, and meta descriptions for a page.` |

### Description (≤2000)

Safe for every directory, including ChatGPT's no-upsell rule.

```
Rankbox brings SEO and AI search research into the assistant you already work in. Add one URL, https://rankbox.xyz/mcp, as a custom connector, and your assistant can call three tools:

- generate_ai_questions: name a topic and get the questions people ask ChatGPT, Perplexity, Gemini and Google AI Overviews about it, grouped by intent (informational, commercial, comparison, transactional).
- generate_content_brief: name a keyword and get a working title, an H2 outline with talking points, the questions the article should answer, and the entities to mention.
- write_meta_descriptions: describe a page and get three meta description options for search results.

It's a remote server, so there's nothing to install and no key to manage. All three tools are read-only: they take the text you give them and return text, and they never change anything in your accounts or on your site.

Use it to plan content that ranks on Google and gets cited by AI engines.
```

### Tools

Exactly as the server reports them (`src/lib/mcp/tools/`). Each has a
`title`, `readOnlyHint: true` and `openWorldHint: true`, which is what
Claude's directory checks for.

| Tool | Title | Description |
|---|---|---|
| `generate_ai_questions` | Generate AI search questions | Given a topic, list the real questions people ask AI assistants (ChatGPT, Perplexity, Gemini, Google AI Overviews), grouped by intent (Informational, Commercial, Comparison, Transactional). Use it to plan content that gets cited by AI engines. |
| `generate_content_brief` | Generate SEO content brief | Build a content brief for a target keyword: a working title, an H2 outline with talking points, questions the article must answer, and key entities to mention. Optimized to rank on Google and get cited by AI engines. |
| `write_meta_descriptions` | Write meta descriptions | Generate 3 compelling, click-worthy SEO meta descriptions (120-160 characters each) for a web page, given a topic or short page summary. |

### Capabilities (each ≤120)

ChatGPT's capability list. Also usable as the feature list anywhere else.

- Lists the questions people ask AI assistants about any topic, grouped by intent
- Builds an SEO content brief for a keyword: title, H2 outline, questions to answer, entities to mention
- Writes three meta description options for a web page
- Remote server: one URL, nothing to install
- Read-only: never changes anything in your accounts or on your site

### Starter prompts (each ≤128)

ChatGPT takes three. Claude's "use cases" step can take all four.

1. `What questions do people ask AI about project management software for agencies?`
2. `Build a content brief for the keyword "best CRM for real estate agents".`
3. `Write meta descriptions for a page about our free invoice template.`
4. `Find the comparison questions buyers ask AI about email marketing tools, then brief an article on the most useful one.`

### Test cases for ChatGPT

ChatGPT asks for 5 prompts that should use the plugin and 3 that shouldn't.

Should call Rankbox:

- `What do people ask ChatGPT about standing desks?` → `generate_ai_questions`
- `Give me the commercial-intent questions buyers ask AI about accounting software for freelancers.` → `generate_ai_questions`
- `Create a content brief for "how to start a podcast".` → `generate_content_brief`
- `Outline an SEO article targeting "vegan protein powder for runners", with the questions it should answer.` → `generate_content_brief`
- `Suggest meta descriptions for our pricing page. We sell scheduling software for dental clinics.` → `write_meta_descriptions`

Should not call Rankbox:

- `What's the weather in Lisbon this weekend?`
- `Publish my latest blog post to my WordPress site.` (the MCP server can't publish)
- `Fix the bug in this JavaScript function.`

### Categories

| Directory | Pick |
|---|---|
| Claude (1–5) | The marketing category first, then any content, writing or research category the portal offers |
| ChatGPT | Business & Operations (closest to marketing); Productivity as a fallback |
| MCP Registry | Has no category field |
| Smithery, mcp.so, MCP Market | Marketing, or SEO where offered |
| Tags, where asked | seo, ai-search, geo, content-marketing, content-brief, meta-description, keyword-research, marketing |

### Claude portal answers

| Step | Answer |
|---|---|
| Connection | `https://rankbox.xyz/mcp`, the same URL for every user |
| Use cases | Plan content for AI search: find the questions buyers ask AI, brief an article, write meta descriptions. |
| What users need first | Nothing. No account, plan or key. |
| Reads or writes data | Reads only. The tools return generated text and write nothing. |
| Authentication | No authentication |
| Data handling | Rankbox's own API. No personal health data, no sponsored content. |
| Test & launch (reviewer notes) | No test account needed. Add https://rankbox.xyz/mcp as a custom connector and try: "What questions do people ask AI about project management software?", "Build a content brief for the keyword 'how to price a SaaS product'", and "Write meta descriptions for a page about a free invoice template." |

### Data and privacy

| Question | Answer |
|---|---|
| What data does the server receive? | Only the text the assistant passes to a tool: a topic, a keyword or a short page summary. |
| Who processes it? | Rankbox and its AI model provider, to generate the result. |
| Does it need sign-in or an API key? | No. |
| Does it read files, accounts or websites? | No. The tools take the text they're given and return text. |

### Images

| File | Shows |
|---|---|
| `out/mcp/rankbox-mcp-1-1600x900.png` | Hero: a content brief in a chat |
| `out/mcp/rankbox-mcp-2-1600x900.png` | AI search questions, grouped by intent |
| `out/mcp/rankbox-mcp-3-1600x900.png` | Three meta descriptions |
| `out/mcp/rankbox-mcp-4-1600x900.png` | Setup: one URL, and the tools it works in |

None of the MCP directories above require screenshots. These are for the ones
with a gallery, and for launch sites. Every result shown is real output from
the live server, captured 2026-09-27, cut short but never rewritten. The chat
window is generic on purpose: no assistant's name, logo or chrome.

---

## 4. When the other CMS add-ons ship

Shopify, WordPress.org, Webflow, Wix and Square can't be submitted until each
add-on exists. When one does, reuse the name, the taglines and the first two
paragraphs of §2's description with "Framer" swapped for the platform. **Don't**
reuse §2's feature list as-is: structured data, stable slugs and live-URL
reporting are how the Framer plugin works, so check each claim against the new
add-on first. The screenshots will need retaking in that platform's own UI.

Their limits, for when the time comes:

| Store | Text limits | Icon | Screenshots |
|---|---|---|---|
| Shopify | Name 30, must start with the brand · intro 100 · details 500 · features 80 each | 1200×1200, no text | 1600×900, 3–6, no browser chrome, no pricing in images |
| WordPress.org | Short description 150 · 5 tags max | 128 and 256 | Banner 772×250 and 1544×500 · `screenshot-N.png` |
| Webflow | Name 30 · short 100 · long 10,000 · 5 features | 900×900, ≤50 KB, mark only | 1280×846, 3–5 |
| Wix | Teaser, 3+ features, description (500 shown before "Read more") | 1000×1000, solid background, no text | 1200×900 minimum (4:3), 5–6 |
| Square | Name 32, without "Square" · tagline 80 · description 1,600 · 3 features (80 + 180) | 512×512, ≤50 KB, no transparency | 3:2, 1500×1000 minimum, 2–5 |

The icons in `out/icon/` already cover every size above.

---

## 5. Icons, favicon and logo

| File | Use it for |
|---|---|
| `out/icon/rankbox-icon-1200.png` | Shopify, and any "large icon" slot |
| `out/icon/rankbox-icon-1024.png` | General store icon |
| `out/icon/rankbox-icon-1000.png` | Wix |
| `out/icon/rankbox-icon-900.png` | Webflow (under their 50 KB cap) |
| `out/icon/rankbox-icon-512.png` | Claude, ChatGPT, Smithery, mcp.so, MCP Market, Square (under 50 KB) |
| `out/icon/rankbox-icon-256.png`, `-128.png` | WordPress.org |
| `out/icon/rankbox-icon-90.png` | Framer (same as the icon in the plugin zip) |
| `out/icon/rankbox-icon-48.png` | Small slots, the MCP Registry's 48px size |
| `out/icon/rankbox-icon-rounded-{1024,512,256}.png` | Directories that show the icon exactly as uploaded, without rounding it |
| `out/icon/rankbox-mark-blue-1024.png` | The mark alone, transparent, for light backgrounds |
| `out/icon/rankbox-mark-white-1024.png` | The mark alone, transparent, for dark or blue backgrounds |
| `out/favicon/favicon.ico` | Any "favicon" upload (16, 32 and 48 inside) |
| `out/favicon/favicon.svg` | Forms that take SVG (same file as the site's `public/mark.svg`) |
| `out/favicon/favicon-{16,32,48,180,192,512}.png` | PNG favicon slots; `180` is the Apple touch icon |
| `out/logo/rankbox-logo-ink.png` | Logo with wordmark, 1440×480, transparent, for light backgrounds |
| `out/logo/rankbox-logo-white.png` | The same for dark backgrounds |

The full-bleed icons are opaque squares with no text. Stores that round
corners (Framer, Shopify, Webflow, Wix, Square, Claude) do it themselves, and
Square and Wix reject transparency.

---

## 6. Shared facts

| Field | Value |
|---|---|
| Product | Rankbox |
| Legal entity | Autusus LLC |
| Website | https://rankbox.xyz |
| Support email | Rankboxai@gmail.com |
| Privacy policy | https://rankbox.xyz/legal/privacy |
| Terms of service | https://rankbox.xyz/legal/terms |
| Data processing agreement | https://rankbox.xyz/legal/dpa |
| Trust page | https://rankbox.xyz/trust |
| Brand colour | `#1877F2` |
| Brand font | Plus Jakarta Sans |
| One-line company description | Rankbox is an AI search growth engine for founders and small teams. It researches the questions buyers ask AI, writes a source-backed article every day, and publishes it to your site, so ChatGPT, Perplexity, Gemini and Google can cite you. |

---

## 7. Regenerating

```bash
./render.sh          # every image
./render.sh cms      # one group: icons | logo | cms | mcp
python3 count.py     # check every length limit in this file and in server.json
```

Edit the templates in `templates/`, never the PNGs. The Framer screenshots
read the plugin's own CSS, so run `npm install` in `packages/plugins/framer`
first.
