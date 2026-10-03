# What the references teach

Distilled from the 37 marketplace images the user picked as the bar (Framer
Forms Connect, Frameship, Unframer, Kompa, Forms Plugin, FramerForms, Thenty,
Checkout Page, Dexter, Tweaker, Link Checker, Scroll Sequence, Cal.com). Read
this before building or changing a scene. Each image is one argument made with
one real piece of product. Everything below serves that.

## 1. One claim, one proof

- Every image says one thing: a 2 to 6 word headline, then the product doing it.
  No feature lists in prose, and no paragraph under the headline unless the
  series uses one (Kompa and Checkout do, in grey, one line).
- The proof is real UI, drawn large enough to read in a feed: plugin panels at
  roughly 1.6 to 2.2 times their real size. Labels 22 to 34px, titles 40 to 64px
  on the 1600px canvas.
- The UI shows the moment the claim happens: the toggle flipped, the row being
  dragged, the dropdown open with a cursor on the choice, the item lifted out.
  A static settings screen with nothing happening doesn't make the argument.

## 2. Headline treatments (pick one per series, never mix inside one)

| Treatment | Size on 1600 | Line height | Tracking | Seen in |
| --- | --- | --- | --- | --- |
| Title case, bold, white on colour | ~98px (Dexter), 104–120px (Kompa) | 0.98–1.04 | -0.045em | Kompa, Dexter |
| Sentence case, centred, huge | 110–125px | 1.0 | -0.05em | Checkout Page |
| UPPERCASE, heavy, very tight | ~90px (67px caps) | 0.86–0.92 | -0.045em | Thenty, FramerForms, Forms Plugin, Frameship |
| Small headline beside an icon, grey subline | 64px + 40px | 1.1 | -0.04em | Kompa feature cards |

- Size a headline from the reference's cap height, not by eye:
  font-size = cap height ÷ 0.75. Plus Jakarta's caps are 0.745em tall (0.76em
  with the `.hl-caps` stroke). The Thenty and FramerForms references have
  67px caps, which means 90px, not the 104–112px a glance suggests. Then
  check the longest line still fits: Jakarta sets about 7% wider than
  Dexter's face, and a long line ("FRAMER, WEBFLOW") may need less.

- Inline object in the headline: a logo tile sits in the line from baseline to
  cap line ("WITH [stripe] STRIPE", "RANK [F] FRAMER", "PAGES [lock]"). It
  replaces a word or follows it. Never decorates. `.inline-tile` is sized for
  this: 0.76em, lifted 0.125em.
- One accent colour per headline at most, and only on a whole phrase
  ("FILE UPLOADS", "AI"). Usually none.
- UPPERCASE headlines stack 3 short lines, left aligned, ragged right. Each
  line is a phrase, not a hyphenated break.
- Plus Jakarta tops out at 800. For the UPPERCASE treatment add
  `-webkit-text-stroke: 1.5px currentColor` to reach the references' black weight.

## 3. Layout patterns that recur

1. Headline top, UI below, UI bleeding off the bottom and right edges (Thenty,
   Forms, FramerForms). The bleed makes the product feel bigger than the frame.
2. Headline left half, UI right half, UI cropped by the right edge (FramerForms
   indigo, Dexter).
3. Centred lockup + centred headline + 2 to 3 cards in a row (Checkout Page).
4. One small panel dead centre on an atmospheric field (Link Checker, Unframer,
   Cal.com). The field does the mood, the panel does the talking.
5. Tilted panels in 3D, two at opposite angles, with pop-outs crossing their
   edges (Forms Plugin, Dexter, Frameship).
6. Isometric sheet of UI fragments on a colour field (Kompa hero).
7. Bento of dark cards, each a title + one white UI card (Checkout Page).
8. Before/after or light/dark split down the middle (Cal.com).

## 4. Depth and objects

- Panels: radius 28–48px on the canvas, white or #161718, a 1.5px inner hairline,
  a big soft shadow (0 40–60px 90–120px, alpha 0.35–0.75 of a dark navy).
- Pop-outs: one element lifted out of its panel, overlapping the panel edge,
  scaled ~1.15x, with a stronger shadow. It is the hero of the image.
- Tilt: `perspective(2000–3200px) rotateY(±8–22deg) rotateX(3–10deg) rotateZ(±2–14deg)`.
  Opposing panels get opposing angles.
- Cursors: a black arrow with a 2–3px white outline and a soft drop shadow,
  placed exactly where the click happens. Pointer-hand for links and days.
  A labelled multiplayer cursor (blue pill "You") when the story is "you edit".
- Connectors: 4–6px lines with rounded 90° corners and arrowheads, or dotted
  leads. They carry data from cause to effect and never cross text.
- Floating app tiles: 3D-tilted, 160–240px, iOS-like corner radius (23%),
  partly cropped by the canvas edge.

## 5. Fields (backgrounds)

- Brand-blue gradient with visible film grain (Kompa, FramerForms).
- Near-black with a faint grid or dot grid that fades out radially (Checkout,
  Forms Plugin). Grid lines at 4–6% white.
- Deep colour to black diagonal gradient (Dexter).
- Light grey #f0f0f0 to #f4f4f5, flat (Kompa light, Thenty, FramerForms light).
- Grainy two-tone wave (Link Checker): heavy grain is the texture.
- Blurred photographic backdrop (Tweaker, Scroll Sequence). With no photos, build
  it from large blurred shapes, a vignette and grain.
- Smeared paint (Unframer): blurred shapes + vertical-only displacement.

## 6. Copy rules for Rankbox

- Every UI string is either the product's own (see FACTS below) or the sample
  site's (Brightloop, brightloop.app, the sample /integrations/framer uses).
- No invented proof: no customer counts, no ratings, no "trusted by", no
  results we can't stand behind. Plan facts are fine (30 articles a month,
  $49.50, 7-day trial).
- Calls to action are brand blue (#1877f2 / #166fe5), never black, even where
  the reference uses black or white buttons.
- Title Case only where the series uses it (Kompa pills); sentence case in UI.

## 7. Building lessons (round 2)

- Measure text in a scene's script only after `await document.fonts.ready`.
  Measured before the webfont loads, Jakarta's metrics come out wrong.
- The text floor is about 15px on the 1600 canvas, so UI text renders a little
  larger than in references whose labels are 12–13px. Scale the panel to fit
  rather than shrinking text below the floor.
- Perspective that must match a reference exactly (a panel receding to a
  vanishing point) is easiest as a `matrix3d` fitted to the four corners
  measured on the reference.
- Scene-local classes get a short prefix (`t-`, `bf-`, `pp-`). A bare local
  class that shares a kit name silently picks up kit styles.
- Grain makes a PNG 2–3MB. Fine for social, but check a marketplace's upload
  limit before sending the grainiest scenes (26, 05).

## 8. Truth lessons (round 2)

- Show what the app counts. Rankbox counts article credits, not dollars per
  article. A per-unit price belongs on the plan row ("$49.50 a month · 30
  credits · $1.65 each"): with 12 of 30 used, "$1.65" beside each article
  would be false.
- One moment per image. A sync can't read "Up to date" and "Syncing 3 new
  articles" at once; use the plugin's own progress strings ("Fetching
  articles…", "Writing to the CMS…").
- Don't put items from two lists under one real heading, and don't invent a
  count for it. "What AI engines look for" has exactly six items (FACTS).
- No "Written by Rankbox" or "Powered by" badge on a customer's content; the
  product adds none. Credit Rankbox for the setting instead ("Voice set in
  Rankbox").
- When the reference has a control the product lacks (Cancel), use a real
  string from the same screen (step 1's footer note) instead of inventing one.
- Platform-coloured buttons may stand in for a reference's colourful tiles,
  but never black: Framer uses its tint `#0099ff`, Square `#006aff`.

## 9. LinkedIn banners (scene 36)

- Profile banner 1584×396 (canvas 1600×400). Company page cover 4200×700
  (canvas 1600×267, shot at 2.625x, saved as JPEG for the 3 MB cap). The old
  1128×191 cover spec is out of date.
- The profile photo or Page logo sits over the bottom-left (about 300px wide
  on desktop, about 220px on a phone) and phones crop 10–15% off each side.
  Start anything that talks at x 440 or later and keep the left as open field.
- A banner isn't clickable, so the sign-off is the URL pill, not a button label.

## 10. Before calling a scene done

- Render, then look at it next to its reference at the same size. Check:
  headline weight and size, how much of the frame the UI fills, where the
  bleed happens, whether there's a pop-out or a cursor at the moment of action.
- Zoom into the 2x master: no clipped words, no text touching an edge unless it
  bleeds off on purpose, no overlapping labels, aligned baselines.
- Squint test: the headline and one UI moment should read at 300px wide.
