#!/usr/bin/env bash
# Renders scripts/og/card.html to public/assets/og-rankbox.png at 1200x630.
#
# Headless Chrome is the renderer so the card is built from the same CSS the
# site uses — no second design language, no image editor in the loop. Re-run
# this after editing card.html; never hand-edit the PNG.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
root="$(cd "$here/../.." && pwd)"
out="$root/public/assets/og-rankbox.png"

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
  --window-size=1200,630 \
  --virtual-time-budget=4000 \
  --screenshot="$out" \
  "file://$here/card.html" >/dev/null 2>&1 &
pid=$!

for _ in $(seq 1 40); do
  [ -s "$out" ] && break
  sleep 0.5
done
kill "$pid" 2>/dev/null || true
wait "$pid" 2>/dev/null || true

[ -s "$out" ] || { echo "render produced no output" >&2; exit 1; }
echo "wrote $out ($(($(wc -c <"$out") / 1024)) KB)"
