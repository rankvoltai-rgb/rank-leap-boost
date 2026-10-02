# /solutions hub: brief

## The job and the visitor

Someone lands on `/solutions` from the footer, a navbar link, a search for "Rankbox solutions", or by trimming the end off a solutions URL. They want one thing: the page that matches their problem, in seconds. Next they either click into that page or, if their problem isn't a solutions page, go to the section that is organised the way they think (by feature, by role, a free tool, a comparison, a platform).

The page's job is routing. Signing up is the secondary action, offered once, lower down.

## Concept

**A switchboard.** Every live solutions page is one line on a single panel, grouped by how a visitor would describe their problem: the job, the platform, the industry (and, once it ships, tracking). Each line has a small lamp that lights when you hover or focus it, so the panel reads as one instrument rather than a grid of cards. When the problem isn't on the board, the board's footer routes you to the other sections.

The focal visual is the panel itself. It is designed to be complete at three lines and usable at sixty:

- **3 lines (today):** a header with the count and the last-checked date, one group label with its one-line description, three generous rows, and a footer that routes onward. No search box, no filter chips: with three items they would be furniture.
- **60 lines (after the industry phases):** filter chips per group appear once there are two or more groups and eight or more pages; a search field (with a `/` shortcut) appears from twelve. Group labels stick under the navbar while you scroll their rows. Empty groups never render; a search that matches nothing shows its own empty state with a way out.

The list comes from `SOLUTIONS` in `@/data/solutions`, so a page appears here the day the main session wires it into the registry. Nothing on the panel is typed by hand.

## Section plan

1. **Hero** (h1): breadcrumb, the H1 "Rankbox solutions, one page per problem", and a two-sentence plain answer to "what is a solutions page": each starts from a problem people search for and shows what Rankbox does about it; all describe the same product on one plan. Visitor understands: these are doors into one product, so pick the closest problem.
2. **The switchboard** (h2 "Every solutions page, in one list"): the panel. Visitor does: clicks their line, or follows the footer onward.
3. **Other ways in** (h2 "Other ways into Rankbox"): a routing table, "starting from X, go to Y", for /features, /use-cases, /tools, /alternatives and /integrations. Rows, not cards. Visitor does: picks the section organised their way.
4. **One plan** (h2 "One product and one plan behind every page"): what Rankbox does in one paragraph, the plan's three monthly allowances read from `PLAN`, how articles reach a site today (`PUBLISHING_TODAY`), the price and trial from `_shared/facts`, one blue button that starts the trial, and a link to /pricing. Visitor understands: no page sells a different product or price.
5. **Questions** (h2 "Questions about the solutions pages"): six hub-specific questions, visible and in FAQPage JSON-LD. Includes the honest answer on citation tracking (not shipped).

Head: `sublandingHead` with an extra `ItemList` node listing the pages in display order.

## Research notes

- schema.org `ItemList` (read 2026-10-02, https://schema.org/ItemList): `itemListElement` of `ListItem` with `position`, `name`, `url`; `numberOfItems` for the total. Used to describe the index.
- Google carousel docs (read 2026-10-02, last updated 2026-09-08, https://developers.google.com/search/docs/appearance/structured-data/carousel): ItemList rich results only appear for Course, Movie, Recipe and Restaurant lists. So the ItemList here is descriptive only; no rich result is expected or claimed.
- schema.org `CollectionPage` (read 2026-10-02, https://schema.org/CollectionPage) would describe a hub more precisely than `WebPage`, but the shared head helper fixes the type. Noted for the main session; not changed here.
- Internal facts, read 2026-10-02: `SOLUTIONS` holds AI search visibility and AEO tools plus whatever `SUBLANDING_SOLUTIONS` adds (autonomous GEO once wired). `PLAN`: 30 articles, 30 backlink credits and 30 Reddit reply drafts a month for one site; `TRIAL_ARTICLE_CREDITS` articles in the trial; backlink and Reddit allowances are paid-only. `SHIPPED.citationTracking` is false. No add-on is live (`addonLive` false everywhere), so publishing today is the API.
- Routes checked on disk 2026-10-02: `features.index.tsx`, `use-cases.index.tsx`, `tools.index.tsx`, `alternatives.index.tsx`, `integrations.index.tsx`, `pricing.tsx` all exist. `tools.index.tsx` states its tools need no signup.

## How it differs from its neighbours

- **/features** is a blue hero with the pixel field and a card per feature, ordered as a pipeline. This hub is light, has no hero illustration, and lists problems as rows on one panel.
- **/use-cases** explains the whole product per role. This hub routes by problem and points to /use-cases for people who think in roles.
- **ExploreMore / link cards** use a three-column card grid. This page uses no card grids at all: one panel of rows and one routing table.
- **The solutions pages themselves** each make an argument. This page makes none beyond "same product, one plan"; it is a directory with honest framing.
