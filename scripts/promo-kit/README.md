# Rankbox promo kit

Marketing images for app-store previews, Instagram and ads, built as HTML and
shot with headless Chrome. Edit a scene, re-run, never hand-edit a PNG.

```bash
./render.sh                      # every scene, every format it declares
./render.sh 03-publish           # one scene
./render.sh 03-publish 4x5       # one scene, one format
open gallery.html                # every scene beside its reference
python3 export.py                # copy renders into the ad-content library
```

`export.py` is how finished images reach the user: one folder per concept
(Ad set / Freestyle / Product showcase), every variant of that concept inside
it (sizes, use cases, carousel slides, dark and light), and the 2x masters in
`high-res/`. The library path lives in the git-ignored `export-dest.txt`.
Add each new concept to `LIBRARY` in `export.py` and re-run it after
rendering. Images are delivered as plain folders, never zips.

| Format | Use | Output |
| --- | --- | --- |
| `4x3` | App previews (Framer Marketplace etc.) | `out/4x3/` 1600×1200 |
| `4x5` | Instagram / LinkedIn feed, carousel | `out/4x5/` 1080×1350 |
| `1x1` | Square feed, ads | `out/1x1/` 1080×1080 |
| `9x16` | Stories, Reels | `out/9x16/` 1080×1920 |
| `li` | LinkedIn profile banner | `out/li/` 1584×396 |
| `lic` | LinkedIn company page cover (JPEG, under the 3 MB cap) | `out/lic/` 4200×700 |

Every format also gets a 2x master in `out/<format>@2x/` (git-ignored).

## Before you build or change a scene

1. `STYLE.md`: what the reference images teach (headline treatments, depth,
   cursors, pop-outs, fields). The bar every scene is held to.
2. `FACTS.md`: the only product facts and UI strings an image may show, and
   what it must never show.
3. `gallery.html`: compare against the reference at the same size.

## Scenes

Each scene recreates one reference image the user picked, for Rankbox. The
references sit in `refs/` (git-ignored: other companies' art, local only);
`gallery.html` lists which reference each scene follows.

| Scene | Message | Formats |
| --- | --- | --- |
| `01-hero` | Get AI traffic on autopilot | all four |
| `02-questions` | Answer what buyers ask AI | 4x3 4x5 1x1 |
| `03-publish` | New articles land every day | all four |
| `04-setup` | A month of content from one URL | 4x3 4x5 1x1 |
| `05-mcp` | MCP server URL card | all four |
| `06-chat` | The three free MCP tools in an AI chat | 4x3 4x5 |
| `07-framer` | Rankbox for Framer (light) | 4x3 4x5 |
| `08-framer-editor` | Rank Framer sites in AI search (light) | 4x3 4x5 |
| `09`–`35` | Round 2: one scene per reference 11–37 (see `gallery.html`) | 4x3 |
| `36-linkedin-banner` | Get AI traffic on autopilot (no reference: the kit's style on LinkedIn's banners) | li lic |
| `f01-buyers-ask-ai` | Freestyle (no reference): your customers are asking AI, Rankbox writes the answers. Local-business use case (SF BBQ) | 4x3 |
| `f02-month-*` | Freestyle Reel: paste your website, get a month of content (onboarding's three steps). Variants: `bbq` restaurant, `coffee` store, `saas`, `dental`. Built from `scenes/f02/` | 9x16 |
| `f03-autopilot-orbit` | Freestyle, universal: Get AI traffic on autopilot. Ten answer engines orbiting the Autopilot settings, bright blue, no dark elements | 4x5 9x16 |
| `f04-receipt` | Freestyle, universal: a month of content for less than one freelance article. The old content budget crossed out on a receipt | 4x5 9x16 |
| `c2-geo-1`…`4` | Ad set, Cluster 2 (GEO): a four-slide explainer carousel. Light-grey, one accent, no third-party logos; the offer is one `OFFER` constant in slide 4 | 4x5 |
| `c03`…`c47-*` | Ad set, the other 21 briefed clusters (3, 6, 9–13, 15, 20, 22–24, 29, 30, 33–36, 40, 45, 47): carousels and singles in the same system as Cluster 2 (`scenes/ads/`), one verified number with its source each. Ad copy and the build spec live in git-ignored `brief/` | 4x5, some 9x16 |
| `v2-c*` | Ad set, variant type 2: one single image per cluster in the kit's earlier look (blue fields, floating tiles, tilted panels), AI logos only pixelated or blurred (`scenes/ads2/`). Exported into each cluster's `Variant 2 - single image/` folder | 4x5 |
| `v3-c*` | Ad set, variant type 3 "Selected": the lead's own campaign. One poster per cluster in brand blue and white only (no dark colours), the one thing that matters selected like text (`.v3-pick`), AI logos as two-colour mosaics (`scenes/ads3/`). `python3 scenes/ads3/palette.py <png>` checks the palette. Exported into `Variant 3 - blue and white/` | 4x5 |
| `v4-c*` | Ad set, variant type 4 "Replica": each cluster replicates one of the user's SaaS reference ads (FeedSpring, Formflow, Noteframe, Outseta, Consentbit and the round 1–2 refs) with real Rankbox UI from FACTS.md as the hero (`scenes/ads4/`, spec in git-ignored `brief/variant4-spec.md`). Exported into `Variant 4 - SaaS replica/`. Variant 3 is on hold (`EXPORT_V3`) | 4x5 |

## How it fits together

- `kit/kit.css`: brand tokens, fields and grain, app tiles, panels, and the v2
  components (headline treatments, wordmarks, cursors, selection box, speech
  bubbles, feature pills, segmented controls, toggles, the light plugin panel,
  Framer editor chrome, the Rankbox sidebar, the Brightloop sample brand).
- `kit/kit.js`: reads `?f=` onto `<html data-f>` and injects the SVG sprite:
  logos (`#lg-*`, copied from `public/mark.svg`,
  `src/components/landing/ai-logos.tsx` and
  `src/components/dashboard/integration-logos.tsx`), the dashboard's own icons
  (`#rb-*`, from `src/components/dashboard/icons.tsx`) and glyphs (`#ic-*`).
  After touching it, open `kit/logo-sheet.html` and `kit/icon-sheet.html`.
- Every scene is laid out on a 1600px-wide canvas, and only the height changes
  per format. Format rules live at the bottom of each scene's `<style>`.
  `data-only="4x5 9x16"` keeps an element to those formats.
- Scene-local classes must not reuse kit class names (a local `.sel` once
  turned a calendar day into the kit's selection box).
- Headless Chrome needs `--run-all-compositor-stages-before-draw` (already in
  `render.sh`), or heavy blurs leave unpainted black tiles.

## Content rules

See `FACTS.md`. In short: the sample site is Brightloop; UI strings come from
the product; no invented proof; calls to action are brand blue. Claims that
depend on unshipped work are flagged per scene in `gallery.html` and in the
delivery notes: the publishing add-ons (`addonLive` is false for all of them),
the Framer plugin (not yet approved), Backlinks and Reddit (rolling out), and
"every day" / "autopilot" (needs the autopilot cron scheduled in production).
