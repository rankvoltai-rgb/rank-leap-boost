## Goal

Add two new visual-only screens — `/auth` and `/onboarding` — built in React + Tailwind, reusing the existing RankPill design tokens, fonts, and shared components (`Logo`, `Reveal`, `Stars`, `Avatar`). No backend, no real authentication; buttons and inputs are presentational and CTAs navigate forward, matching the rest of the visual-only landing page.

## Screen 1 — `/auth` (Split Column)

```text
┌───────────────────────────┬───────────────────────────┐
│  FORM PANEL               │  BRAND / VISUAL PANEL      │
│                           │  (dark ink background)     │
│  RankPill logo            │                            │
│  H1: Start getting        │  "Sign in → connect site   │
│  Google & ChatGPT traffic │   → done" 3-step visual    │
│  [in the next 7 days]     │                            │
│  Paragraph copy           │  ① Sign in                 │
│                           │  ② Connect site            │
│  [ Google ][ GitHub ]     │  ③ Done                    │
│  [ Apple ]  social btns   │                            │
│  — or —                   │  mini dashboard / stars    │
│  Full Name                │  social proof row          │
│  Business Email           │                            │
│  Password                 │                            │
│  [ Start my traffic       │                            │
│    engine ]  (→/onboarding)│                           │
│  Already have an account? │                            │
└───────────────────────────┴───────────────────────────┘
```

- **Left form panel** (on `--background`):
  - RankPill `Logo`
  - Headline: "Start getting Google & ChatGPT traffic" with "in the next 7 days" emphasized (accent/highlight styling)
  - Paragraph: "Automatically research, write, and publish SEO-optimized articles that rank on Google and get cited by AI so you grow traffic without lifting a finger."
  - Three social auth buttons with inline SVG brand marks: **Google, GitHub, Apple** (visual only, no OAuth)
  - "or continue with email" divider
  - Inputs: **Full Name**, **Business Email**, **Password** (styled with existing input tokens)
  - Primary CTA: **Start my traffic engine** → navigates to `/onboarding`
  - Small "Already have an account? Sign in" link
- **Right brand panel** (dark `ink` background, like landing footer/CTA):
  - "Sign in → connect site → done" rendered as a 3-step vertical/numbered visual
  - Star rating + social-proof avatars ("3,000+ happy customers") reusing `Stars`/`Avatar`
  - On mobile this panel stacks below or is hidden; form stays full-width

## Screen 2 — `/onboarding` (Clean, 2 steps)

A centered, minimal card with a 2-step progress indicator at top.

**Step 1 — About your brand**
- Brand Name (input)
- Website URL (input)
- Describe your product (optional textarea)
- "Continue" button → advances to Step 2 (local component state, no persistence)

**Step 2 — Keywords & hosting**
- Editable keyword chips/list (pre-filled sample keywords, each removable; an "add keyword" input). Purely client-side state.
- "Select Website Hosting" — selectable cards/options (e.g. WordPress, Shopify, Webflow, Wix, Framer) reusing `BrandMark` styling
- CTA: **Start my free trial** → navigates to `/` (landing) for now
- "Back" link to Step 1

Progress is tracked with `useState` (current step 1 or 2); a slim progress bar / "Step 1 of 2" label sits above the card.

## Routing & wiring

- New route files: `src/routes/auth.tsx` (`/auth`) and `src/routes/onboarding.tsx` (`/onboarding`), each with its own `head()` metadata (title, description, og tags).
- Update the landing page CTAs to point at the new flow: `PrimaryButton` / "Sign In" in `Navbar` and hero/pricing CTAs link to `/auth` (via TanStack `Link`). Keep existing in-page anchors where appropriate.
- `routeTree.gen.ts` is auto-generated — not hand-edited.

## Components (new, under `src/components/auth/`)

- `AuthSplit.tsx` — the split-column auth screen
- `SocialButtons.tsx` — Google/GitHub/Apple buttons with inline SVG logos
- `Onboarding.tsx` — the 2-step wizard
- `KeywordEditor.tsx` — editable keyword chip list
- `HostingPicker.tsx` — hosting option selector
- Reuse `shared.tsx` helpers; add brand SVGs as needed.

## Technical notes

- React + Tailwind v4 only; all styling via existing semantic tokens (`ink`, `background`, `muted-foreground`, `border`, `card`, etc.) — no hard-coded colors.
- Inputs/forms are presentational (no validation, no submit handlers beyond navigation); social buttons are decorative since this is a visual-only build.
- `motion` reveals via existing `Reveal` for subtle entrance animation.
- Fully responsive: split column collapses to single column on mobile; onboarding card is width-constrained and centered.

## Out of scope (can add later if you want it functional)

Real account creation, Google/Apple/GitHub OAuth, persisting onboarding data, and a post-onboarding dashboard would require enabling Lovable Cloud. Note: GitHub isn't natively supported by the managed auth (Google & Apple are), so it would stay decorative even in a functional build.
