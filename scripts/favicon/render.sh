#!/usr/bin/env bash
# Renders scripts/favicon/icon.html to the site's raster icons:
#   public/apple-touch-icon.png  512x512
#   public/favicon.ico           a 256x256 PNG in an ICO wrapper
#
# Same idea as scripts/framer-icon: headless Chrome is the renderer, so every
# icon comes from the one brand mark and colour rather than an image editor.
# public/mark.svg is the vector favicon and is edited by hand; re-run this
# after changing it, and never hand-edit the PNG or the ICO.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
root="$(cd "$here/../.." && pwd)"

chrome="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
if [ ! -x "$chrome" ]; then
  echo "Chrome not found at: $chrome (set CHROME=/path/to/chrome)" >&2
  exit 1
fi

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

# Old headless sometimes writes the screenshot and then keeps running, so it
# is backgrounded and reaped once the PNG lands (or the deadline passes).
shoot() {
  local size="$1" out="$2"
  rm -f "$out"
  "$chrome" \
    --headless \
    --disable-gpu \
    --hide-scrollbars \
    --force-color-profile=srgb \
    --allow-file-access-from-files \
    --user-data-dir="$tmp/profile-$size" \
    --window-size="$size,$size" \
    --virtual-time-budget=4000 \
    --screenshot="$out" \
    "file://$here/icon.html" >/dev/null 2>&1 &
  local pid=$!
  for _ in $(seq 1 40); do
    [ -s "$out" ] && break
    sleep 0.5
  done
  kill "$pid" 2>/dev/null || true
  wait "$pid" 2>/dev/null || true
  [ -s "$out" ] || { echo "render produced no output at ${size}px" >&2; exit 1; }
}

shoot 512 "$root/public/apple-touch-icon.png"
shoot 256 "$tmp/favicon-256.png"

# An ICO is a six-byte header, one directory entry, then the image itself —
# and every browser that still asks for favicon.ico takes a PNG inside it.
# A 0 in the size byte means 256.
python3 - "$tmp/favicon-256.png" "$root/public/favicon.ico" <<'PY'
import struct, sys

png = open(sys.argv[1], "rb").read()
ico = struct.pack("<HHH", 0, 1, 1)
ico += struct.pack("<BBBBHHII", 0, 0, 0, 0, 1, 32, len(png), 22)
open(sys.argv[2], "wb").write(ico + png)
PY

for f in public/apple-touch-icon.png public/favicon.ico; do
  echo "wrote $f ($(($(wc -c <"$root/$f") / 1024)) KB)"
done
