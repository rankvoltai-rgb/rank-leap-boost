# Smoother, sleeker White / Blue / Grey palette

## Goal
Keep the light base but make it feel calmer and more premium: cooler blue-grey neutrals and a single refined blue accent (replacing the teal-green "Volt"). Accent shows up at a moderate level (3/5) — used for highlights, links, key CTAs and small status dots, not everywhere.

## Approach
Almost all color comes from semantic tokens in `src/styles.css`. Retuning those tokens recolors the whole site at once, so this stays a focused, low-risk change with no per-component rewrites. The `--volt` token name stays (it's referenced across components) — only its *value* changes to blue, so nothing breaks.

## Changes

### 1. `src/styles.css` — retune `:root` tokens (light theme)
- **Accent → blue:** set `--volt` to a refined electric blue (around `oklch(0.58 0.17 255)`), and `--info` to the same family so charts, glows and gradients follow.
- **Neutrals → cool blue-grey:** add a subtle blue tint to `--background`, `--surface`, `--secondary`, `--muted`, `--accent`, `--border`, `--input` (shift hue toward ~255 and trim warm chroma) so whites and greys read crisp and cool instead of warm/cream.
- **Ink/foreground:** keep near-black but nudge hue cooler (slate, ~`oklch(0.18 0.02 255)`) for a sleeker contrast against the blue accent.
- **Muted text:** cool grey (`--muted-foreground` toward a balanced slate) for calmer body copy.
- Leave `--success` green (used for genuine "Published/positive" status) and `--warning` as-is so status colors stay meaningful; the gradients (`--gradient-accent`, `--gradient-traffic`, `--hero-glow`) automatically pick up the new blue via the tokens they reference.

### 2. Accent intensity tuning (level 3)
- Keep blue for: links/underlines (`decoration-volt`), the Pricing highlighted card ring, hero "AI Traffic" highlight, small status dots, traffic chart line.
- Soften the large ambient blue glows (e.g. hero `-inset-6` blur, Personal Agent hover glow) by reducing opacity so the accent feels controlled rather than loud. These are minor className opacity tweaks in `Hero.tsx` and a couple of section cards.

### 3. Leave intentional brand/product colors untouched
- AI/platform logo colors (ChatGPT `#10a37f`, Shopify, Webflow, Reddit, etc. in `shared.tsx` and `ai-logos.tsx`) stay accurate to those brands.

## Files
- `src/styles.css` (primary — token values)
- Light opacity tweaks only if needed: `src/components/landing/Hero.tsx`, `PersonalAgent.tsx`

## Out of scope
- Font stays Poppins. No layout, copy, or component-structure changes. Dark theme tokens left as-is (site is used in light mode).

## Note
This replaces the previous teal-green "Volt" accent with blue per your request; I'll update the saved brand/design memory to reflect the new white/blue/grey direction.

After applying I'll screenshot the hero and a couple of sections to confirm the new palette reads clean and sleek.