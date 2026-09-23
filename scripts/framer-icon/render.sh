#!/usr/bin/env bash
# Renders scripts/framer-icon/icon.html to the Framer plugin icon at 90x90.
#
# Headless Chrome is the renderer so the icon is built from the same brand mark
# and colour the site uses — no image editor in the loop. Re-run
# this after editing icon.html; never hand-edit the PNG.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
root="$(cd "$here/../.." && pwd)"
out="$root/packages/plugins/framer/public/icon.png"

chrome="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
if [ ! -x "$chrome" ]; then
  echo "Chrome not found at: $chrome (set CHROME=/path/to/chrome)" >&2
  exit 1
fi

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

# Old headless sometimes writes the screenshot and then keeps running, so it
# is backgrounded and reaped once the PNG lands (or the deadline passes).
rm -f "$out"
"$chrome" \
  --headless \
  --disable-gpu \
  --hide-scrollbars \
  --force-color-profile=srgb \
  --allow-file-access-from-files \
  --user-data-dir="$tmp" \
  --window-size=90,90 \
  --virtual-time-budget=4000 \
  --screenshot="$out" \
  "file://$here/icon.html" >/dev/null 2>&1 &
pid=$!

for _ in $(seq 1 40); do
  [ -s "$out" ] && break
  sleep 0.5
done
kill "$pid" 2>/dev/null || true
wait "$pid" 2>/dev/null || true

[ -s "$out" ] || { echo "render produced no output" >&2; exit 1; }
echo "wrote $out ($(($(wc -c <"$out") / 1024)) KB)"
