## Goal

Full redesign of the Rankvolt marketing site so nothing mirrors RankPill — new positioning (AI-search-first / GEO), all-new copy, fictional AI-generated testimonials with AI avatar photos, honest early-stage metrics, new visual system (Cloud White + Volt, Sora/Manrope, bento layout), and updated meta tags. No RankPill marketing material or word-for-word resemblance remains.

## New design system

Update `src/styles.css` + `src/routes/__root.tsx`:

- **Palette (Cloud White + Volt)** — light base `oklch` near `#fafbfc`, ink `#0f172a`, and a new electric **`--volt`** accent (`#22d3a6`-ish teal-green) plus a soft `--volt-glow`. Rework `--info`/gradients/`--hero-glow` to volt instead of the current blue. This visibly differentiates from RankPill's look.
- **Fonts** — install `@fontsource-variable/sora` + `@fontsource-variable/manrope`, `@import` them in `styles.css`, set `--font-display: "Sora"` and `--font-sans: "Manrope"`. Remove the Geist Google-Fonts `<link>` from `__root.tsx`. Apply `font-display` to headings via the `SectionHeading`/`Hero` h1/h2.
- **Layout language** — shift feature sections to a true **bento grid** (mixed-size tiles, asymmetric spans) rather than uniform 3-col grids, so the structure reads differently from the current/RankPill layout.

## Content rewrites (every section, new wording)

- **Meta / `__root.tsx`** — new title from hero: e.g. `"Rankvolt — Get Cited by AI Search & Rank on Google"`; rewrite description, og/twitter title+description; replace the external og:image with a generated one (see Assets). Mirror the same title in `src/routes/index.tsx` head + JSON-LD product description.
- **Hero** (`Hero.tsx`) — new headline stronger than RankPill, GEO-first. Direction: **"Become the Answer AI Recommends."** with subcopy about AI researching, writing, publishing, and getting your brand cited across ChatGPT, Perplexity, Google AI Overviews + classic search. New badge text, new "Optimized for" framing.
- **Navbar** (`Navbar.tsx`) — rename nav items with NLP-style section names (e.g. "How it works", "Proof", "Sample articles", "Pricing", "FAQ") to match renamed section ids.
- **PersonalAgent** → reframed as the GEO engine ("Your AI Search Growth Engine"); rewrite 4 feature cards.
- **GrowTraffic** → new heading + card copy, lead with AI citation visibility; keep the chart/AI-answer mock but reword all labels and the sample Q&A (no RankPill phrasing).
- **EverythingYouNeed** → new heading, rewrite all 7 tiles + the feature tag chips, GEO-leaning.
- **ExampleArticles** → new heading + 6 brand-new fictional article titles/summaries with **fictional domains** (no overlap with current set).
- **Pricing** → new heading + reworded included-features and highlights; keep pricing logic, refresh the social-proof line to the new metric.
- **Guarantee** → rewrite heading/body; replace the fake logo wall labels; update rating/volume line to new metrics.
- **FAQ** → rewrite all 8 Q&As in fresh wording (keep FAQPage JSON-LD wiring).
- **FinalCTA** → new headline + body + button copy.
- **DashboardMockup** → reword URL, nav labels, sample queued articles/keywords to a fresh fictional niche (not coffee), so the product shot doesn't mirror prior copy.
- **llms.txt** (`public/llms.txt`) — rewrite the summary line to the new GEO positioning.

## Testimonials & success stories (fictional + AI avatars)

- **Generate AI avatar photos** — create 8 distinct, photorealistic headshot avatars in `src/assets/` (varied gender/age/ethnicity, neutral pro backgrounds), upload via `lovable-assets`, reference by `.asset.json`. Remove dependence on the real-name photo assets (`nik`, `john-logan`, `denis`, `demo`) for testimonial display.
- **Testimonials** (`Testimonials.tsx`) — replace all 9 quotes with fictional names + fictional companies + fictional roles, GEO/Google-results themed, mapped to the new avatars. Update the 4 StatCards to honest early-stage numbers.
- **SuccessStories** (`SuccessStories.tsx`) — replace all 6 stories: fictional founders, fictional companies, modest/believable click numbers and timeframes, AI avatars.
- **Hero face row** (`Hero.tsx`) + **Pricing avatars** — swap to the new AI avatars and fictional names.

## New metrics (honest early-stage), applied everywhere they appear

- Customers: **3,000+ → ~400+ businesses**
- Articles: **200,000+ / 1M+ → ~60,000+ articles published**
- Rating: **4.9/5 → 4.8/5**
- Peak lift stat: replace "721%" with a modest outcome stat (e.g. avg. faster-than-manual growth phrasing).
Touch points: `Testimonials` StatCards, `Hero` "3,000+", `Pricing` social proof, `Guarantee` rating/volume, `SuccessStories` numbers.

## Assets

- 8 AI testimonial/avatar headshots (generate → `lovable-assets`).
- 1 new OG share image (16:9, on-brand Volt) for `__root.tsx`/`index.tsx`; note crawler cache won't refresh instantly.

## Out of scope (unchanged)

Dashboard app, blog engine/editor, onboarding, auth, payments, calendar, DB/schema, server functions. This is purely the marketing surface (copy, content, visual tokens, fonts, images).

## Technical notes

- Tailwind v4: tokens go in `@theme inline` + `:root`; fonts via `@fontsource` `@import`, not URL `@import`.
- Keep all semantic tokens — no hardcoded color utilities in components.
- Keep canonical/og:url self-referencing `https://rankvolt.top`.
- Verify with a production build + preview screenshot after implementation.
