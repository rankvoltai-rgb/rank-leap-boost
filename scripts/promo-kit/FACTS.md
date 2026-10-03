# Facts a scene may show

Every string in an image comes from here, from the product's own UI, or from
the sample site. Checked against the code on 2026-10-02. When the product
changes, change this file first.

## Brand

- Rankbox, rankbox.xyz. Brand blue `#1877f2`, button blue `#166fe5`. Font: Plus
  Jakarta Sans.
- Logo: the mark (curved four-point star, `#lg-rankbox`) + "Rankbox" in
  semibold (600), tight tracking. In the app sidebar the mark is blue and the
  word is ink. On colour both go white. The app icon is a blue tile with a
  white mark.
- Site CTA: "Get Started Free". In-app trial CTA: "Start your 7-day free trial".

## Sample site (never a real customer)

Brightloop, `brightloop.app`, a SaaS that bills by usage. Logo: an orange ring
(`#ff8a1f`) + "Brightloop" in heavy type. Its covers are warm orange gradients.

| Article | Keyword | SEO |
| --- | --- | --- |
| Usage-Based Pricing, Explained | usage based pricing | 94 |
| How to Price a SaaS Product | saas pricing | 91 |
| Freemium or Free Trial? How to Choose | freemium vs free trial | 89 |
| What Is a Value Metric? | value metric | 90 |
| How to A/B Test a Pricing Page | pricing page test | 93 |
| Churn vs Retention: The Metrics That Matter | churn vs retention | 89 |
| What Is Product-Led Growth? | product led growth | 91 |
| Writing Onboarding Emails People Read | onboarding emails | 92 |

Buyer questions for "usage-based pricing": How do I bill by usage? · Is
usage-based pricing worth it? · Stripe Billing or Chargebee? · How do I price
API calls? · What is a good value metric?

Autopilot turns buyer questions into articles, so a schedule that needs more
than the eight titles above may use the questions as titles, in Title Case
("How Do I Price API Calls?"). Never repeat a title on two days.

## Dashboard (app.rankbox.xyz)

- Sidebar, section "Workspace": Overview, Articles, Calendar, Rank, Backlinks,
  Reddit, Integrations. Section "Account": Studio, Plan & Billing, Settings.
  Active item: solid brand blue, white text. Icons: `#rb-*` in the sprite.
- Article stages: Idea, Scheduled, Writing, Published. Articles views: All,
  Ideas, Scheduled, Published.
- Article details: Status, Writes on, Updated, Est. traffic, Competition,
  AI signal.
- Content metrics: Words, Read time, Keyword density, Headings, Links,
  Readability.
- SEO panel: a score gauge, then "Strong — ready to rank." (80+) / "Good — a
  few tweaks left." (55+) / "Needs work to rank well.", then "N of M checks
  passed".
- SEO checklist labels: Focus keyword set, Keyword in title, Keyword in
  introduction, Keyword density, Clear section structure, Sub-headings, Content
  length, In-depth content, Scannable lists, FAQ for AI engines, Internal &
  external links, Meta description, Readability.
- Meta description field placeholder: "The summary search results show under
  your title." Ideal length 120–160 characters.
- SEO panel field: "Target keyword". Editor buttons: "Publish changes", "Write
  now"; toasts offer "Undo" and "Open".
- Editor AI actions on a selection: Improve SEO, Rewrite, Expand, Shorten. (In
  the app it's a bubble menu that rewrites in place.)
- Rank page: "See where you rank — and what to do next". Cards: Projected
  monthly visits, Market coverage, Est. monthly visits, Avg. SEO score, Next
  best moves (actions: Plan it, Schedule, Improve, Write now), What AI engines
  look for ("How many of your published articles have each"; exactly six:
  Answers up front, FAQ section, Clear sections, Cites sources, Depth, Easy to
  read), Your market (Keyword, Searches, Est. traffic, Your article, Status,
  SEO).
- Calendar: views Month and Agenda. Description: "What autopilot has published,
  and when it writes the rest. Drag an article to another day to move it."
- Settings, "Your brand": Brand name (placeholder "e.g. Plannora"), Website
  ("example.com"), What you sell ("e.g. Plannora is a project manager for teams
  of 2–20 who find Jira too heavy. It replaces standups with a daily digest.").
  Description: "Who autopilot writes for. Every article is built around this."
- Settings, "How autopilot writes": Audience (default "Founders /
  Entrepreneurs"), Tone (Professional, Friendly, Confident, Conversational,
  Authoritative, Playful), Writing style (Balanced, Concise and actionable,
  In-depth and data-driven, Story-led, Step-by-step), House rules (placeholder
  lines: Say “teams”, not “users”. / Never name competitors. / Use US
  spelling.), What autopilot reads.
- Settings, "Autopilot": "Write automatically" toggle, Pace: every day, 5 times
  a week, 3 times a week, twice a week, once a week.
- Onboarding steps: Brand, Keywords, Plan.
  - Step 1 fields: Website ("yoursite.com"), Brand name ("Your brand"), What you
    do (hint "Briefs every article"; placeholder "One or two sentences a
    stranger would understand."), Add logo. Button "Find my keywords" ("Reading
    your site…" while busy). Footer note: "Next, we analyze your site. It takes
    about 20 seconds." No Cancel or Back on step 1.
  - Step 2: a keyword list (each removable), tone hint "Every article is written
    in this tone", button "Build my plan".
  - Step 3: "Your first month of content", "One article per keyword, filling the
    gaps your site doesn't answer yet, in the order we'll publish them."
- Backlinks tabs: Overview, Get links, Give links, Settings. Labels: "Pages you
  want links to", "Links your articles carry", "The network right now",
  "Recent activity", "Verify your domain" (DNS record, File, Meta tag). Credits,
  paid plans only.
- Reddit tabs: Opportunities, Mentions, Settings. Labels: "Suggested reply",
  "Your reply", "Copy reply", "Weekly sweep"; ranking signals "AI-cited",
  "Ranks on Google", "Subreddit fits your space", "Votes and comments",
  "Fresh". Rankbox drafts replies, the person posts them.
- Backlinks and Reddit are rolling out: flag before paid use.
- Billing: a usage meter per site (article credits used of total), "Writing
  uses 1 article credit · N left this month", "No articles this cycle yet". The
  app shows no price per article.

## Plan

Business: $49.50 a month, 1 site, 30 articles, 30 backlink credits, 30 Reddit
reply drafts. Trial: 7 days, 7 article credits, card required ("No charge today
· Cancel in one click"). Studio: $49.50 per extra site. $49.50 / 30 = $1.65 an
article credit. Say it on a plan row, never beside each article: with 12 of 30
credits used, the spend per article so far isn't $1.65.

## MCP

`https://rankbox.xyz/mcp`. Live tools, no key needed: `generate_ai_questions`
(groups by intent: Informational, Commercial, Comparison, Transactional),
`generate_content_brief` (title, outline, questions, entities),
`write_meta_descriptions` (three options, 120–160 characters). The account,
site and article tools in /docs are documented but not built: never show them.

## Rankbox for Framer (plugin, not yet approved)

Strings: "Sync your finished Rankbox articles into this project's CMS.",
"Rankbox API key", "Get a key in Rankbox → Integrations", "Connect", "Up to
date · 8 articles", "8 written · synced just now", "Live URLs", "All reported
to Rankbox.", "Collection page path" (/blog), "Report live URLs to Rankbox",
"Add article structured data", "Writes JSON-LD into your site's head so search
and AI engines can read your articles. Framer can't add this per CMS page on
its own.", "Sync articles". Collection fields: Title, Slug, Content,
Description, Tags, SEO Score. Structured data: one `@graph` (Organization,
Blog, one BlogPosting per article) at the end of `<head>`, placed by Framer's
Custom Code as "Rankbox structured data".

Sync progress (in order): "Fetching articles…", "Checking collection fields…",
"Writing to the CMS…" (N of M), "Removing deleted articles…", "Finishing up…".
Status card: "Ready to sync. Rankbox will fill this collection with your
finished articles." / "No finished articles yet" / "Up to date · N articles"
with "N written, N removed, N unchanged · synced …". Buttons: "Sync articles",
"Sync now", "Resync everything". Settings are checkboxes: "Add article
structured data", "Report live URLs to Rankbox", "Collection page path",
"Follow slug changes from Rankbox". The real JSON-LD block is minified on one
line, with `@id`s, dates and a WebSite node.

## Free tools (rankbox.xyz/tools)

AI Crawler robots.txt Generator (bot roles: "AI search index", "Live fetch",
"Model training"; presets "Allow all AI bots", "Search & live fetch only",
"Block all AI bots"; bots include OAI-SearchBot, ChatGPT-User, GPTBot,
Claude-SearchBot, Claude-User, ClaudeBot, PerplexityBot, Perplexity-User,
Google-Extended, Applebot-Extended, CCBot, Bytespider), llms.txt Generator,
Schema Markup Generator, AI Citation Readiness Checker, Meta Description
Writer, SERP Snippet Preview, and more.

## Never show

- Citation tracking ("cited 14 times", mention counts, AI rank positions). Not
  shipped.
- Customer counts, ratings, testimonials, "trusted by", logos of customers.
- A dark-mode dashboard (the app has none).
- Publishing add-ons as live without the flag: Framer, Webflow, WordPress,
  Shopify and Square are all `addonLive: false`.
