#!/usr/bin/env bash
# Renders the Rankbox promo images in ./scenes to ./out.
#
# Each scene is one HTML file laid out on a 1600px-wide canvas; ?f= picks the
# format. Headless Chrome shoots it at 2x and sips scales it to each channel's
# size, which antialiases better than shooting small.
#
#   4x3   app previews (Framer Marketplace and other plugin stores) 1600x1200
#   4x5   Instagram / Facebook / LinkedIn feed                      1080x1350
#   1x1   square feed and ads                                       1080x1080
#   9x16  Stories, Reels, TikTok                                    1080x1920
#   li    LinkedIn profile banner                                   1584x396
#   lic   LinkedIn company page cover (JPEG, 3 MB cap)              4200x700
#
# Usage: ./render.sh                     every scene, every format it has
#        ./render.sh 01-hero             one scene, every format it has
#        ./render.sh 01-hero 4x3         one scene, one format
#
# A scene lists its formats in <meta name="formats" content="4x3 4x5">.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
chrome="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
[ -x "$chrome" ] || { echo "Chrome not found at: $chrome (set CHROME=)" >&2; exit 1; }

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

# canvas height, then output width x height, per format
canvas_h() { case "$1" in 4x3) echo 1200;; 4x5) echo 2000;; 1x1) echo 1600;; 9x16) echo 2844;; li) echo 400;; lic) echo 267;; esac; }
out_size() { case "$1" in 4x3) echo "1600 1200";; 4x5) echo "1080 1350";; 1x1) echo "1080 1080";; 9x16) echo "1080 1920";; li) echo "1584 396";; lic) echo "4200 700";; esac; }
# LinkedIn wants the company cover at 4200 wide, more than a 2x shot gives, so
# that one is shot at 2.625x rather than scaled up.
scale_of() { case "$1" in lic) echo 2.625;; *) echo 2;; esac; }

# shoot <scene> <format>
shoot() {
  local scene="$1" f="$2" h raw dest
  h="$(canvas_h "$f")"
  raw="$tmp/$scene-$f.png"
  "$chrome" \
    --headless \
    --disable-gpu \
    --hide-scrollbars \
    --force-color-profile=srgb \
    --force-device-scale-factor="$(scale_of "$f")" \
    --run-all-compositor-stages-before-draw \
    --allow-file-access-from-files \
    --user-data-dir="$tmp/profile" \
    --window-size="1600,$h" \
    --virtual-time-budget=8000 \
    --screenshot="$raw" \
    "file://$here/scenes/$scene.html?f=$f" >/dev/null 2>&1 &
  local pid=$!
  for _ in $(seq 1 80); do [ -s "$raw" ] && break; sleep 0.5; done
  sleep 0.3
  kill "$pid" 2>/dev/null || true
  wait "$pid" 2>/dev/null || true
  [ -s "$raw" ] || { echo "no output: $scene $f" >&2; exit 1; }

  read -r w hh <<<"$(out_size "$f")"
  mkdir -p "$here/out/$f" "$here/out/$f@2x"
  # Full-resolution master (2x the canvas), then the channel size.
  cp "$raw" "$here/out/$f@2x/rankbox-$scene.png"
  dest="$here/out/$f/rankbox-$scene.png"
  sips -z "$hh" "$w" "$raw" --out "$dest" >/dev/null
  # LinkedIn Pages cap a cover at 3 MB, which a grainy 4200px PNG passes.
  if [ "$f" = lic ]; then
    sips -s format jpeg -s formatOptions 88 "$dest" --out "${dest%.png}.jpg" >/dev/null
    rm "$dest"
    dest="${dest%.png}.jpg"
  fi
  echo "wrote ${dest#"$here"/} (${w}x${hh})"
}

formats_of() {
  sed -n 's/.*<meta name="formats" content="\([^"]*\)".*/\1/p' "$here/scenes/$1.html" | head -1
}

scenes=()
if [ $# -ge 1 ]; then scenes=("$1"); else
  for p in "$here"/scenes/*.html; do scenes+=("$(basename "$p" .html)"); done
fi

for s in "${scenes[@]}"; do
  if [ $# -ge 2 ]; then fs="$2"; else fs="$(formats_of "$s")"; fi
  for f in $fs; do shoot "$s" "$f"; done
done
