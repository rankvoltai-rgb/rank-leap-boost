#!/usr/bin/env bash
# Renders scripts/linkedin/banner.html to scripts/linkedin/out/*.png at
# 2256x382 — LinkedIn's 1128x191 company page cover, at 2x so it stays crisp
# on retina. LinkedIn downscales on upload.
#
# Headless Chrome is the renderer so the banner is built from the same brand
# tokens the site uses — no image editor in the loop. Re-run this after
# editing banner.html; never hand-edit the PNGs.
#
# Usage: ./render.sh [variant ...]   (default: all three)
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
outdir="$here/out"

chrome="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
if [ ! -x "$chrome" ]; then
  echo "Chrome not found at: $chrome (set CHROME=/path/to/chrome)" >&2
  exit 1
fi

variants=("$@")
[ ${#variants[@]} -eq 0 ] && variants=(blue ink open)

mkdir -p "$outdir"

for v in "${variants[@]}"; do
  out="$outdir/rankbox-linkedin-$v.png"
  tmp="$(mktemp -d)"

  # Old headless sometimes writes the screenshot and then keeps running, so it
  # is backgrounded and reaped once the PNG lands (or the deadline passes).
  rm -f "$out"
  "$chrome" \
    --headless \
    --disable-gpu \
    --hide-scrollbars \
    --force-color-profile=srgb \
    --force-device-scale-factor=2 \
    --allow-file-access-from-files \
    --user-data-dir="$tmp" \
    --window-size=1128,191 \
    --virtual-time-budget=4000 \
    --screenshot="$out" \
    "file://$here/banner.html?v=$v" >/dev/null 2>&1 &
  pid=$!

  for _ in $(seq 1 40); do
    [ -s "$out" ] && break
    sleep 0.5
  done
  kill "$pid" 2>/dev/null || true
  wait "$pid" 2>/dev/null || true
  rm -rf "$tmp"

  [ -s "$out" ] || { echo "render produced no output for $v" >&2; exit 1; }
  echo "wrote $out ($(($(wc -c <"$out") / 1024)) KB)"
done
