## Goal

Stand up SEO-optimized feature landing pages under `/features/$slug`, driven by a single static data file and one dedicated SEO template. Each page targets a distinct search intent (one feature = one keyword cluster), with its own title, meta description, OG tags, canonical, and FAQPage/Product JSON-LD.

## Architecture

```text
src/
  data/features.ts                 ← all feature content (static, typed)
  components/features/
    FeatureHero.tsx                ← headline, subhead, CTA, visual slot
    FeatureBenefits.tsx            ← 3–4 benefit cards
    FeatureHowItWorks.tsx          ← numbered steps
    FeatureFAQ.tsx                 ← per-feature accordion
    FeatureCTA.tsx                 ← closing conversion band
  routes/
    features.index.tsx             ← /features hub (grid of all features)
    features.$slug.tsx             ← /features/<slug> dynamic template
```

The dynamic route reads the slug, looks up the matching entry in `features.ts`, and throws `notFound()` for unknown slugs. Reuses existing `Navbar`, `Footer`, and shared tokens/components so the pages stay visually consistent with the homepage.

## Feature pages (initial set — all current features)

Slugs derived from the homepage feature set:

1. `answer-space-research` — "Map what your buyers ask AI"
2. `citation-ready-writer` — "AI articles engineered to get cited"
3. `auto-publishing` — "Publish daily on autopilot"
4. `citation-tracking` — "See where AI quotes your brand"
5. `authority-backlinks` — "Earn high-authority backlinks"
6. `reddit-presence` — "Show up in Reddit threads AI reads"
7. `brand-voice` — "Content that sounds like you"
8. `seo-geo-score` — "Score every article for search + AI"

(Exact list/copy can be trimmed or expanded; this covers the existing feature surface.)

## Page template structure (dedicated SEO layout)

Each `/features/$slug` page renders, in order:

1. **Hero** — eyebrow, H1 (single, keyword-led), supporting paragraph, primary CTA (`/auth`), secondary link. Optional small visual/mock reusing existing card styles.
2. **Benefits** — 3–4 cards (icon + heading + body) covering the value props.
3. **How it works** — 3 numbered steps describing the workflow for that feature.
4. **Proof strip** — honest metrics from memory (~400+ founders, ~60K+ articles, 4.8/5) — reused, not per-feature invented.
5. **FAQ** — 3–4 feature-specific Q&As (also powers FAQPage JSON-LD).
6. **Closing CTA** band.

## SEO wiring (per page)

In `features.$slug.tsx` `head()` (built from the looked-up entry):

- `title` (<60 chars), `description` (<160 chars)
- `og:title`, `og:description`, `og:type: "website"`, `og:url` (self-referencing)
- `canonical` → `https://rankvolt.top/features/<slug>` (leaf only)
- JSON-LD: `FAQPage` (from the feature's FAQs) + `BreadcrumbList` (Home → Features → Feature)

`features.index.tsx` gets its own title/description + canonical for `/features`.

## Navigation & sitemap

- Add a "Features" entry to `Navbar` `LINKS` pointing to `/features` (replaces nothing; it's a real route now).
- Update `src/routes/sitemap[.]xml.ts`: add `/features` and one entry per feature slug (iterate the slugs from `features.ts` so it stays in sync).

## Technical notes

- Content is fully static and typed in `src/data/features.ts` (`Feature` interface: slug, metaTitle, metaDescription, h1, subhead, benefits[], steps[], faqs[], ctaText, etc.). No backend.
- Use `<Link to="/features/$slug" params={{ slug }}>` for internal links — never string interpolation.
- Use existing semantic tokens only (`text-ink`, `bg-card`, `text-muted-foreground`, `--volt`, etc.); reuse `Reveal`, `Eyebrow`, `PrimaryButton`, `Accordion`.
- `og:image` omitted for now (no per-feature image) — can be added later if desired.

## Out of scope (this pass)

- No per-feature custom illustrations/OG images.
- No CMS/database; copy lives in code.
