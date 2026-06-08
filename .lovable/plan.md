# RankPill Landing Page Clone

Build a close visual replica of rankpill.com as a single full landing page. Static/visual only — all buttons are styled links that go nowhere functional. Every product screenshot and dashboard mockup is recreated with React + Tailwind components (no images/screenshots). Keep RankPill's real copy.

## Look & Feel

Light, airy, modern SaaS aesthetic matching the original:
- Background near-white (`#fcfbf8`-ish warm white), near-black text.
- Bold geometric sans-serif headings (large, tight tracking), clean body font. Use a Geist/Inter-style system via a Google Fonts `<link>` in `__root.tsx`.
- Black primary buttons with white text; white secondary buttons with subtle border.
- Soft rounded cards, thin borders, gentle shadows, generous whitespace.
- Subtle scroll/fade-in animation via framer-motion (restrained, like the original).

Design tokens go into `src/styles.css` (`@theme` + `:root`) — warm-white background, ink foreground, muted grays, accent green/yellow for stat highlights and stars.

## Page Structure (single route, `src/routes/index.tsx`)

Built as section components under `src/components/landing/`:

1. **Navbar** — RankPill logo mark + wordmark; links: What's Inside, Success Stories, Examples, Pricing, FAQ; "Sign In" button on the right. Sticky, light blur background.
2. **Hero** — Headline "Get Google, ChatGPT Traffic on Autopilot", subtext, two CTAs ("Get Traffic on Autopilot" black, "View Demo" white with avatar), social-proof row (avatar stack + 5 stars + "3,000+ happy customers"). Below: a recreated **dashboard mockup** (sidebar nav + content-calendar grid with queued/published article cards, "Domain Rating: 42", countdown chip) built entirely in HTML/CSS.
3. **Personal Agent** — "Your Personal Agent" intro + 4 feature blurbs (Personalized SEO plan, Writes articles daily, Publishes to your site, Builds backlinks).
4. **Success Stories** — heading + horizontal cards (client niche, clicks/month stat, description, avatar + name/role). Analytics "graphs" recreated as small CSS/SVG line charts instead of screenshots.
5. **Grow Traffic While You Sleep** — feature showcase grid with recreated visuals:
   - Rank High on Google (stats + SVG line/area chart of clicks & impressions)
   - Get Mentioned by AI (ChatGPT chat-bubble mockup)
   - Fully Customizable (tone/image-style/offerings panel)
   - Fully Autonomous (generating-article mini calendar)
   - 100+ Languages (chips grid)
   - Auto Publishing (WordPress/Shopify/Webflow/Wix/Framer/Webhooks connect rows — platform marks as simple inline SVG/lettermark badges)
6. **Everything You Need** — "Everything You Need to Get Traffic" feature grid (SEO Automation, SEO Content Writer, Keyword Research, Backlink Exchange, Reddit Marketing, AI Visibility) each with a small recreated UI snippet, plus the "Plus everything else…" tag cloud.
7. **AI Articles That Get Traffic** — grid of example article cards (title, description, source domain).
8. **Pricing** — single "Business" plan card ($99 / $49.5 with 50% off + yearly toggle), included-features list, search-platform marks row, plus the 5 supporting feature blurbs and avatar social proof.
9. **Satisfaction Guarantee** — guarantee badge, copy, customer logo strip (lettermark placeholders), "4.9/5" + "200,000+ articles published".
10. **Testimonials** — "Trusted by Thousands of Businesses" masonry/grid of quote cards with avatars (initials fallback for those without photos).
11. **Final CTA** — "Unlock Traffic on Autopilot" band with button and a small recreated dashboard preview.
12. **FAQ** — "Frequently Asked Questions" accordion (9 Q&As from the source) using the existing shadcn Accordion.
13. **Footer** — brand, link columns, copyright.

## Technical Notes

- Single page at `/` — replace the placeholder in `src/routes/index.tsx`. All sections imported from `src/components/landing/`.
- Set page `<head>` meta in the index route (title, description, og tags) matching RankPill's positioning for SEO; single H1 in the hero.
- Avatars/customer photos: use generated initials/lettermark circles and gradient placeholders (no external image URLs, no generated image assets) per the React+Tailwind choice.
- Charts and platform logos: lightweight inline SVG, no chart library needed (small enough to hand-roll); reuse shadcn primitives (Accordion, Button styling via tokens, Card) where helpful.
- framer-motion already fits the stack; add it for subtle in-view reveals. Confirm/install if missing.
- Responsive: mobile nav collapses to a menu; grids stack; hero mockup scales/scrolls gracefully.
- Verify the build and review the preview after implementation.

No backend, auth, or data — purely presentational, as requested.
