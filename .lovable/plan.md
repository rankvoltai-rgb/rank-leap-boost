# Notion-Powered Blog + Resources Menu

## Goal
Turn `/blog` into a real, Notion-driven blog. You write posts in a Notion database; published posts appear live on the site (fetched fresh on every visit). Posts support rich formatting plus embedded YouTube/Vimeo videos and uploaded media. Replace the "Sample Articles" navigation item with a "Resources" dropdown.

## 1. Connect Notion
- Link the existing **Amplify's Notion** connection to this project. This exposes the credentials the server needs to read your Notion content.
- You'll then **duplicate a database template** I describe below and share it with the connected integration so the site can read it.

### The Notion "Blog" database schema (you create this)
| Property | Type | Purpose |
|---|---|---|
| Name | Title | Post title |
| Slug | Text | URL path, e.g. `measuring-geo-success` → `/blog/measuring-geo-success` |
| Status | Select | `Draft` / `Published` (only Published shows on site) |
| Excerpt | Text | Card + meta-description summary |
| Date | Date | Publish date (shown + used for ordering) |
| Tags | Multi-select | Optional category chips |
| Author | Text | Optional byline (defaults to "Rankvolt") |

The page **cover image** is used as the post hero/card image. The page **body** is the article — write normally and add YouTube videos via Notion's `/video` or `/embed` blocks.

## 2. Data layer (live fetch)
- `src/lib/notion.server.ts` — server-only helpers that call the Notion API through the Lovable connector gateway (reads keys inside the handler):
  - `resolveBlogDatabaseId()` — finds the shared database (matches one named "Blog", caches the id) so no manual id wiring is needed.
  - `listPublishedPosts()` — queries the DB filtered to `Status = Published`, sorted by `Date` desc; returns normalized post metadata.
  - `getPostBySlug(slug)` — finds the page by slug, fetches all body blocks (with pagination + nested children for lists/toggles), returns a normalized block tree.
- `src/lib/notion.functions.ts` — `createServerFn` wrappers (`listPosts`, `getPost`) that the routes call. Plain serializable DTOs only.

## 3. Block renderer (with video embeds)
- `src/components/blog/NotionBlocks.tsx` — renders the normalized block tree to styled React:
  - Text: paragraphs, h1–h3, bold/italic/strikethrough/code/links, blockquotes, callouts, dividers.
  - Lists: bulleted + numbered (incl. nesting), to-dos.
  - Code blocks with language label.
  - Images (page-uploaded or external), with captions.
  - **`video` blocks** — uploaded files render in a native `<video>` player; YouTube/Vimeo URLs are converted to responsive 16:9 `<iframe>` embeds.
  - **`embed` / `bookmark` blocks** — YouTube/Vimeo become iframes; other URLs become rich link cards.
- Styling reuses existing tokens (`text-ink`, `text-muted-foreground`, `border-border`, `bg-card`) to match the current guide aesthetic.

## 4. Routes
- `src/routes/blog.index.tsx` → `/blog`
  - Loader primes `listPosts` via `ensureQueryData`; component reads with `useSuspenseQuery`.
  - Renders `Navbar`, a header, and a responsive card grid (cover, title, excerpt, date, tags) linking to each post. Empty + error states included.
  - Unique SEO head (title/description/canonical) + `Blog` JSON-LD.
- `src/routes/blog.$slug.tsx` → `/blog/:slug`
  - Loader fetches `getPost(slug)`; `notFound()` for missing/unpublished slugs.
  - Renders breadcrumb, hero cover, title, byline/date, `NotionBlocks` body, and the existing "Start getting cited" CTA.
  - Per-post SEO head (title, excerpt as description, cover as og:image, canonical) + `Article` + `BreadcrumbList` JSON-LD.
  - `errorComponent` + `notFoundComponent` per route conventions.
- Delete `src/routes/blog.measuring-geo-success.tsx` (retired per "Notion only"). To preserve that URL's SEO, recreate it in Notion with slug `measuring-geo-success` — same path keeps working through the dynamic route.

## 5. Navigation: "Sample Articles" → "Resources" dropdown
- `src/components/landing/Navbar.tsx`:
  - Remove the `Sample Articles` (`#examples`) link.
  - Add a **Resources** dropdown (same hover-menu pattern as Features) with: **Blog** (`/blog`), **Free Tools** (`/tools`), **Sample Output** (`#examples` anchor for the on-page examples section).
  - Mirror the dropdown in the mobile menu (collapsible like the mobile Features group).
- `src/components/landing/Footer.tsx`: replace the "Sample Articles" link with **Blog** → `/blog`.

## 6. Sitemap
- `src/routes/sitemap[.]xml.ts`: drop the hardcoded `measuring-geo-success` entry and instead generate one `<url>` per published Notion post (via `listPublishedPosts`), plus the `/blog` index. Keeps the sitemap accurate as you publish.

## Technical notes
- All Notion calls run server-side through the gateway (`https://connector-gateway.lovable.dev/notion/...`) with `LOVABLE_API_KEY` + `NOTION_API_KEY`; nothing hits Notion from the browser.
- Dates are formatted in a fixed UTC format to avoid SSR/client hydration mismatches (the current guide has exactly this bug — removing it resolves it).
- Live fetch means a published edit in Notion appears on the next page load; no rebuild needed.
- If Notion is unreachable, routes return a graceful empty/error state rather than crashing.

## What you'll do after I build
1. Approve linking the Notion connection (one click).
2. Create the "Blog" database with the schema above and **share it with the integration** in Notion.
3. Write a post, set Status = Published — it appears at `/blog`.