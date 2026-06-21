# Hero headline + AI answer card upgrade

## 1. New hero headline with rotating logo

Replace the long headline with a short, punchy line:

```text
Get AI Traffic from [ logo ] on Autopilot
```

Where `[ logo ]` is a square glass card that cycles through the AI engine logos (ChatGPT → Claude → Gemini → Google → Perplexity) on a timed loop with a smooth fade/slide swap.

**Crawler-safe text requirement**
- The `<h1>` always contains real, static text so search/AI crawlers read a clean sentence: `Get AI Traffic from ChatGPT, Claude, Gemini and other AI on Autopilot`.
- The rotating logo card is layered as a visual element with `aria-hidden`, while the engine names live in a visually-hidden (`sr-only`) span inside the H1. Net result: humans see "Get AI Traffic from [glass logo card] on Autopilot"; crawlers/screen-readers get full natural-language text.
- Implementation: a small `RotatingEngine` component (client `useState` + `setInterval`, respects `prefers-reduced-motion` by holding on the first logo). Square glass card uses `backdrop-blur`, subtle border, soft shadow, and a faint Volt-tinted glow — sized to sit inline with the text on desktop, wrapping gracefully on mobile.
- Subhead is shortened to match the tighter headline.

## 2. Improve the ChatGPT answer card (under the hero)

Refine `ChatAnswerCard` / `chat.tsx` so the mockup reads as a more polished, modern ChatGPT-style surface:

- Cleaner window chrome: add a faint top toolbar row (engine name + small status), tighter engine-tab styling with the active tab clearly lifted.
- Streaming feel: animated "writing answer" indicator with a subtle typing/caret cue and a shimmer line for the in-progress state.
- Better answer typography and spacing; the cited brand keeps the Volt underline treatment.
- Upgrade the Sources row into proper favicon-dot citation chips with hover states.
- Add a subtle reply/composer bar at the bottom (visual only) to complete the chat-app illusion.
- Keep Volt strictly as a subtle accent (active dot, citation underline, one glow), per the established direction.

## Scope / files

- `src/components/landing/Hero.tsx` — new headline markup, sr-only text, mount rotating engine card, trim subhead.
- New `RotatingEngine` (either inline in `Hero.tsx` or a small `src/components/landing/RotatingEngine.tsx`) — timed logo swap in a glass square.
- `src/components/landing/chat.tsx` — visual upgrades to `ChatAnswerCard`, `EngineTabs`, citation chips, streaming indicator, composer bar.
- Possibly minor token/utility additions in `src/styles.css` if a new glass/shimmer helper is needed.

No backend, copy-strategy, pricing, or routing changes. Metrics and GEO positioning stay as-is.

## Technical notes
- Reuse existing `AI_MARKS` from `ai-logos.tsx` for the rotating logos and tabs.
- Rotation uses `setInterval` in `useEffect` with cleanup; guard with `matchMedia('(prefers-reduced-motion: reduce)')`.
- All colors via existing semantic tokens (`--ink`, `--volt`, `--border`, `--card`, etc.) — no hardcoded color classes.
