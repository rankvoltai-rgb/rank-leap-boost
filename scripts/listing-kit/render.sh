#!/usr/bin/env bash
# Renders the plugin / connector listing images in ./templates to ./out.
#
# Same approach as scripts/og and scripts/linkedin: headless Chrome is the
# renderer, so every image is built from the brand's own mark, colour and type
# — and the Framer plugin screenshots from the plugin's own stylesheet — with
# no image editor in the loop. Edit a template, re-run, never hand-edit a PNG.
#
# Usage: ./render.sh            render everything
#        ./render.sh icons      only one group: icons | logo | cms | mcp
#
# The Framer screenshots read packages/plugins/framer/src/ui.css and
# framer-plugin's framer.css, so run `npm install` in that package first.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
tpl="$here/templates"
out="$here/out"

chrome="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
if [ ! -x "$chrome" ]; then
  echo "Chrome not found at: $chrome (set CHROME=/path/to/chrome)" >&2
  exit 1
fi

only="${1:-all}"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

# shoot <page?query> <css width> <css height> <scale> <out file> [alpha]
#
# The window is sized in CSS pixels and multiplied by <scale>, so a template
# laid out at 1600x900 renders at 3200x1800 with scale 2. [alpha] leaves the
# background transparent instead of white.
#
# Old headless sometimes writes the screenshot and then keeps running, so it
# is backgrounded and reaped once the PNG lands (or the deadline passes).
shoot() {
  local page="$1" w="$2" h="$3" scale="$4" file="$5" alpha="${6:-}"
  local dest="$out/$file"
  local bg=()
  [ -n "$alpha" ] && bg=(--default-background-color=00000000)
  mkdir -p "$(dirname "$dest")"
  rm -f "$dest"
  "$chrome" \
    --headless \
    --disable-gpu \
    --hide-scrollbars \
    --force-color-profile=srgb \
    --force-device-scale-factor="$scale" \
    --allow-file-access-from-files \
    ${bg[@]+"${bg[@]}"} \
    --user-data-dir="$tmp/profile" \
    --window-size="$w,$h" \
    --virtual-time-budget=6000 \
    --screenshot="$dest" \
    "file://$tpl/$page" >/dev/null 2>&1 &
  local pid=$!
  for _ in $(seq 1 60); do
    [ -s "$dest" ] && break
    sleep 0.5
  done
  kill "$pid" 2>/dev/null || true
  wait "$pid" 2>/dev/null || true
  [ -s "$dest" ] || { echo "render produced no output: $file" >&2; exit 1; }
  echo "wrote out/$file ($(($(wc -c <"$dest") / 1024)) KB)"
}

want() { [ "$only" = all ] || [ "$only" = "$1" ]; }

if want icons; then
  # Headless Chrome won't open a window narrower than ~500px, so an icon shot
  # at 90px comes out as a crop of a bigger page. Every icon is rendered once
  # at 1200px and scaled down with sips, which also antialiases small sizes
  # better than rendering them small would.
  shoot "icon.html?v=tile" 1200 1200 1 "icon/rankbox-icon-1200.png"
  shoot "icon.html?v=round" 1200 1200 1 "icon/.rounded-1200.png" alpha
  shoot "icon.html?v=mark" 1024 1024 1 "icon/rankbox-mark-blue-1024.png" alpha
  shoot "icon.html?v=mark-white" 1024 1024 1 "icon/rankbox-mark-white-1024.png" alpha

  shrink() { # shrink <source> <size> <dest>, all under out/
    sips -z "$2" "$2" "$out/$1" --out "$out/$3" >/dev/null
    echo "wrote out/$3"
  }

  # Store icons: full-bleed and opaque, and the store rounds the corners.
  # 1200 Shopify · 1024 general · 1000 Wix · 900 Webflow · 512 Square, Claude,
  # ChatGPT · 256/128 WordPress.org · 90 Framer · 48 MCP Registry ·
  # 20 Webflow publisher logo.
  for s in 1024 1000 900 512 256 128 90 48 20; do
    shrink icon/rankbox-icon-1200.png "$s" "icon/rankbox-icon-$s.png"
  done
  # Pre-rounded, transparent corners: for directories that show it as-is.
  for s in 1024 512 256; do
    shrink icon/.rounded-1200.png "$s" "icon/rankbox-icon-rounded-$s.png"
  done
  rm -f "$out/icon/.rounded-1200.png"

  # Favicons. The tile reads at 16px where the thin bare mark would not.
  mkdir -p "$out/favicon"
  for s in 16 32 48 180 192 512; do
    shrink icon/rankbox-icon-1200.png "$s" "favicon/favicon-$s.png"
  done
  cp "$here/../../public/mark.svg" "$out/favicon/favicon.svg"

  # A multi-size ICO: six-byte header, one 16-byte entry per image, then the
  # PNGs back to back. Every browser that still asks for .ico takes PNGs in it.
  python3 - "$out/favicon" <<'PY'
import os, struct, sys

d = sys.argv[1]
sizes = [16, 32, 48]
pngs = [open(os.path.join(d, f"favicon-{s}.png"), "rb").read() for s in sizes]
head = struct.pack("<HHH", 0, 1, len(pngs))
offset = 6 + 16 * len(pngs)
entries = b""
for s, png in zip(sizes, pngs):
    entries += struct.pack("<BBBBHHII", s, s, 0, 0, 1, 32, len(png), offset)
    offset += len(png)
open(os.path.join(d, "favicon.ico"), "wb").write(head + entries + b"".join(pngs))
print("wrote out/favicon/favicon.ico")
PY
fi

if want logo; then
  # 3:1, at 2x.
  shoot "logo.html?v=ink" 720 240 2 "logo/rankbox-logo-ink.png" alpha
  shoot "logo.html?v=white" 720 240 2 "logo/rankbox-logo-white.png" alpha
fi

if want cms; then
  # Rankbox for Framer. Framer publishes no image size; 16:9 at 1600x900 is
  # Shopify's size and the safe default.
  for s in 1 2 3 4 5; do
    shoot "cms.html?s=$s" 1600 900 1 "cms/rankbox-framer-$s-1600x900.png"
  done
fi

if want mcp; then
  for s in 1 2 3 4; do
    shoot "mcp.html?s=$s" 1600 900 1 "mcp/rankbox-mcp-$s-1600x900.png"
  done
fi
