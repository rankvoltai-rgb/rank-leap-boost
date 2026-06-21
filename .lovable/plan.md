# Landing Page Redesign — Notion × ChatGPT

A full redesign of the marketing page toward a calmer, document-like Notion feel combined with ChatGPT's conversational, answer-card moments. Keeps the existing Cloud White + Volt palette and Sora + Manrope type — Volt stays a subtle accent, not a dominant color. No backend, copy-positioning, or app changes; this is purely the landing surface.

## Design language

- **Notion side:** generous whitespace, soft 1px borders, gentle rounded blocks (`rounded-2xl`/`rounded-3xl`), muted grays, block-style content "cards" that read like a document, subtle dividers, restrained shadows.
- **ChatGPT side:** a recurring "prompt → answer" visual motif — message bubbles, a thinking/streaming row, and answer cards where the brand gets cited. Monospace-flavored UI chrome in mockups only.
- **Accent:** Volt teal used sparingly — active dots, one highlighted word, citation underlines, a single CTA glow. Everything else stays ink/white/gray.
- **Motion:** keep the existing `Reveal` scroll-in; add light staggered entrance on hero chat lines and hover lift on cards.

## Section-by-section changes

**Navbar** — Slimmer, Notion-style: lighter border, add a small "AI-search growth" label, keep links (How It Works, Proof, Sample Articles, Pricing, FAQ) and the two CTAs. Subtle scroll elevation.

**Hero** (`Hero.tsx`) — New centerpiece.
- Headline: **"Get found by ChatGPT, Gemini, Claude & AI search"** (one word accented in Volt).
- Subcopy reworded around being discovered/cited across AI assistants and Google.
- Keep the "Cited across" engine row and the URL input form (unchanged behavior → `/auth?url=`).
- Replace the dashboard image with a **ChatGPT-style answer card**: a user prompt bubble ("What's the best tool for…?"), a short streaming/"thinking" line, then an answer that cites the user's brand with a Volt citation chip. Sits in a clean Notion-style panel.
- Keep the avatar + "400+ founders" social proof row.

**PersonalAgent / How It Works** — Convert the 4 uniform cards into a **Notion-style numbered block list** (01–04) with a left rail, each step as a document block: icon, title, body, and a tiny inline status chip. Richer than the current flat grid.

**SuccessStories** — Reframe as conversation snippets: small chat-answer cards showing a question and the cited brand, paired with the fictional persona + avatar and one outcome metric. Keep all fictional names/companies/avatars.

**GrowTraffic** — Keep the growth-chart idea but reset it in a cleaner split: chart on one side, a compact "answer appearances over time" stat block on the other, Notion-card framing.

**EverythingYouNeed** — Rework into a true **bento grid** (mixed-size tiles, asymmetric spans) instead of the uniform 3-col grid. Promote 2–3 tiles to larger feature blocks with richer mini-mockups; keep the capability tag cloud at the bottom.

**ExampleArticles** — Notion document-card styling: small favicon dot per domain, cleaner type hierarchy, hover lift. Same 6 fictional articles.

**Pricing** — Cleaner card with a Notion-style feature checklist, single highlighted plan, Volt accent only on the recommended badge/CTA. Keep current numbers and the social-proof line.

**Guarantee** — Calmer block panel; keep honest metrics (400+ founders, 60K+ articles, 4.8/5).

**Testimonials** — Tighter masonry/quote-card grid using existing avatars; lighter borders, larger quotes, Notion feel.

**FinalCTA** — Keep the dark ink block but swap the mockup for the new chat-answer card style so it echoes the hero.

**FAQ** — Notion-style accordion: flat dividers, generous spacing, no heavy card chrome. Same 8 Q&As.

**Footer** — Lighter, more spacious; unchanged links.

## Shared primitives (`shared.tsx`)

- Add small reusable pieces used across the redesign: `ChatBubble` (user/answer variants), `CitationChip` (Volt accent), `BlockCard` (Notion block), and a `NumberedStep`.
- Keep existing `Reveal`, `Logo`, `Badge`, `StatCard`, `Avatar`, `BrandMark`.

## Tokens (`styles.css`)

- No palette/font change. Add 1–2 helper tokens only if needed (e.g. a softer Notion border + a subtle "chat panel" surface gradient). Volt stays subtle per your choice.

## Out of scope

Dashboard app, auth/onboarding, pricing logic, server functions, DB, and the GEO positioning/copy strategy (kept as-is). Metrics stay at the current honest numbers.

## Technical notes

- All work stays in `src/components/landing/*` plus `src/routes/index.tsx` head (hero headline already matches the meta title closely; will align meta title/OG to the new headline) and minor `styles.css` token additions.
- No new dependencies expected (Sora/Manrope already installed; icons via existing `lucide-react`).
- Verify with a preview screenshot after the hero + a couple of sections land.
