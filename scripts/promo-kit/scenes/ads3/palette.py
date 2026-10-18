#!/usr/bin/env python3
"""
Variant 3 palette check: blue and white surfaces and graphics, black text.

    python3 scenes/ads3/palette.py out/4x5/rankbox-v3-c02-geo.png [more.png ...]

Black text is allowed (the user's call), dark or grey SURFACES are not. On a
downscaled copy (sips, no extra libraries) it flags:
  off-hue        any other hue (green, orange, red, violet): red or green
                 clearly above blue. Fails above 0.05% of the image.
  dark surface   a 64x64 canvas-px patch that is almost all dark (navy,
                 black panels). Type strokes never fill one.
  grey surface   a 64x64 patch that is almost all light neutral grey
                 (grey cards and panels; white and blue tints are fine).
Prints where they are (in 1600-wide canvas units) so they can be found.
"""
import struct
import subprocess
import sys
import tempfile
from pathlib import Path

LIMIT = 0.0005


def pixels(png, width=400):
    with tempfile.TemporaryDirectory() as tmp:
        small = Path(tmp) / "s.png"
        bmp = Path(tmp) / "s.bmp"
        subprocess.run(["sips", "--resampleWidth", str(width), str(png), "--out", str(small)], capture_output=True, check=True)
        subprocess.run(["sips", "-s", "format", "bmp", str(small), "--out", str(bmp)], capture_output=True, check=True)
        data = bmp.read_bytes()
    off = struct.unpack_from("<I", data, 10)[0]
    w, h = struct.unpack_from("<ii", data, 18)
    bpp = struct.unpack_from("<H", data, 28)[0] // 8
    row = (w * bpp + 3) & ~3
    flip = h > 0
    h = abs(h)
    for y in range(h):
        base = off + (h - 1 - y if flip else y) * row
        for x in range(w):
            b, g, r = data[base + x * bpp: base + x * bpp + 3]
            yield x, y, w, r, g, b


def classify(r, g, b):
    if max(r, g, b) >= 60 and (r > b + 12 or g > b + 12):  # near-black text edges are not a hue
        return "off-hue"
    if max(r, g, b) < 150:
        return "dark"
    if max(r, g, b) - min(r, g, b) < 14 and 150 <= max(r, g, b) < 236:
        return "grey"
    return None


def check(png, width=400, patch=16):
    grid, total, w = {}, 0, width
    hue = []
    for x, y, w, r, g, b in pixels(png, width):
        total += 1
        k = classify(r, g, b)
        if k == "off-hue":
            hue.append((x, y, (r, g, b)))
        cell = grid.setdefault((x // patch, y // patch), {"n": 0, "dark": 0, "grey": 0})
        cell["n"] += 1
        if k in ("dark", "grey"):
            cell[k] += 1
    scale = 1600 / w
    ok = True
    print(Path(png).name)
    share = len(hue) / total
    line = f"  off-hue        {share * 100:6.3f}%  {'FAIL' if share > LIMIT else 'ok'}"
    if hue:
        line += f"  e.g. at x {int(hue[0][0] * scale)}, y {int(hue[0][1] * scale)} rgb{hue[0][2]}"
    print(line)
    ok &= share <= LIMIT
    for k in ("dark", "grey"):
        bad = [(cx, cy) for (cx, cy), c in grid.items() if c["n"] == patch * patch and c[k] / c["n"] > 0.9]
        line = f"  {k} surface   {len(bad):4d} patches  {'FAIL' if bad else 'ok'}"
        if bad:
            xs, ys = [b[0] * patch * scale for b in bad], [b[1] * patch * scale for b in bad]
            line += f"  around x {int(min(xs))}–{int(max(xs)) + int(patch * scale)}, y {int(min(ys))}–{int(max(ys)) + int(patch * scale)}"
        print(line)
        ok &= not bad
    return ok


if __name__ == "__main__":
    results = [check(p) for p in sys.argv[1:]]
    sys.exit(0 if all(results) else 1)
