# Rankbox promo kit

Marketing images for app-store previews, Instagram and ads, built as HTML and
shot with headless Chrome. Edit a scene, re-run, never hand-edit a PNG.

```bash
./render.sh                      # every scene, every format it declares
./render.sh 03-publish           # one scene
./render.sh 03-publish 4x5       # one scene, one format
open gallery.html                # every scene beside its reference
```

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
