# Landing Page Premium Redesign

Transform the Rankvolt landing page into a premium, high-converting, venture-backed-quality SaaS experience (Stripe / Linear / Vercel calibre) while keeping the existing brand tokens and content.

## 1. Branding — logo + favicon

- Upload the black asterisk mark (`Untitled design (28).png`) and the uploaded AI/testimonial images to the Lovable CDN as `.asset.json` pointers (keeps the repo light).
- Replace the placeholder `Logo` component in `shared.tsx` so it renders the asterisk mark (on a rounded ink tile for contrast) + "Rankvolt" wordmark, with improved gap/alignment.
- Wire the **same asterisk** as the site favicon via a `link rel="icon"` in `__root.tsx` head.
- Ensure the logo shows consistently in navbar, hero, and mobile menu, with tightened spacing/visual balance in the navbar.

## 2. Hero section (conversion-focused)

- **AI-logo card**: above/around the headline "Get Google, ChatGPT Traffic on Autopilot", add a small glassmorphism pill/card showing the AI marks — ChatGPT, Claude, Gemini, Google, Perplexity — with subtle staggered entrance.
- **URL input + CTA as one cohesive component**:
  ```text
  [  Enter your website URL            ] [ Get Started Free → ]
  ```
  Rounded, soft shadow, focus ring, hover lift on the button; on mobile it stacks. Submitting routes to `/auth` (carrying the typed URL as a query param so onboarding can prefill).
- Keep the social-proof row (avatars + stars + "3,000+ happy customers") and the "View Demo" secondary action.
- Add subtle micro-interactions: gradient glow behind the headline, animated focus/hover states, floating AI badges.

## 3. Testimonials — real testimonial component

- Convert the masonry quote grid into premium testimonial cards: name, company/role, **star rating**, quote, and **real photo avatars**.
- Map uploaded headshots to matching people (Nik Zechner, John Logan, plus the subway + demo photos for two others); colored-initial avatars remain the fallback for the rest.
- Add a trust header band: "Trusted by growing businesses" + customer count + key success metric stat cards (e.g. avg traffic lift, articles published).
- Glassmorphism / premium card styling with hover elevation.

## 4. Site-wide UI polish

- **New reusable primitives** in `shared.tsx`: `Badge` (premium pill), `StatCard`, `GlassCard`, `SectionDivider`, plus a `Marquee`/logo-row trust strip.
- Apply across sections (PersonalAgent, SuccessStories, GrowTraffic, EverythingYouNeed, Pricing, Guarantee, FinalCTA): interactive feature cards, animated hover states, gradient accents, smooth scroll-reveal (existing `Reveal`), consistent spacing scale, refined typography hierarchy.
- Stronger visual flow Hero → Features → Social proof → Pricing → CTA; reduce clutter; make the primary CTA unmissable (consistent gradient/ink button treatment).
- Enhanced mobile responsiveness using the grid + `min-w-0` + `shrink-0` patterns for any mixed text/widget rows.

## 5. Design tokens

- Add a few CSS tokens to `src/styles.css` for the new effects: a glass surface token, a soft elevation shadow, and a subtle hero glow — all derived from existing `--ink` / `--info` / `--success` so theming stays consistent (no hardcoded colors in components).

## Technical notes

- New assets created via `lovable-assets` CLI → `.asset.json` pointers imported in components; original uploads not committed as binaries.
- Hero URL input is a small client component with local state; CTA is an anchor/handler to `/auth?url=...`. No backend/business-logic changes.
- Favicon added as a head `link` in `__root.tsx`.
- AI logos: ChatGPT + Claude are inline SVGs (provided), Gemini is a PNG asset; Google + Perplexity added as brand marks. All rendered in a contained card.
- Work stays in frontend/presentation files: `shared.tsx`, `Hero.tsx`, `Navbar.tsx`, `Testimonials.tsx`, other `landing/*` components, `__root.tsx` (favicon only), and `styles.css` (tokens).

## Files touched

- `src/components/landing/shared.tsx` (Logo, new primitives)
- `src/components/landing/Hero.tsx`
- `src/components/landing/Navbar.tsx`
- `src/components/landing/Testimonials.tsx`
- Other `src/components/landing/*` sections (polish pass)
- `src/routes/__root.tsx` (favicon link)
- `src/styles.css` (new tokens)
- `src/assets/*.asset.json` (logo, AI marks, headshots)
