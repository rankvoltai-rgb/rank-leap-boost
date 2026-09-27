"""Checks every length limit in LISTING.md and mcp-registry/server.json.

Stores truncate or reject copy that runs over, and the limits differ per
field, so they're written into LISTING.md where the copy is, and checked
here instead of counted by eye:

  - a table row whose first cell is a number and whose second is `code`
    ("| 80 | `...` |") must fit that number;
  - under a heading marked "(≤N)", each list item (or, for a fenced block,
    the whole block) must fit N. A backticked item is measured inside the
    backticks, and anything after them (a "→ tool" note) is ignored.

Run: python3 count.py   Exit status 1 if anything is over.
"""
import json
import re
import sys
from pathlib import Path

here = Path(__file__).parent
lines = (here / "LISTING.md").read_text(encoding="utf-8").splitlines()

results = []  # (where, length, limit)

row = re.compile(r"^\|\s*(\d+)\s*\|\s*`([^`]+)`\s*\|")
heading = re.compile(r"^#{2,6} .*\([^)]*?≤\s*([\d,]+)\)")
item = re.compile(r"^\s*(?:[-*]|\d+\.)\s+(.*)$")

limit = None
title = ""
block = None  # lines of the fenced block under a limited heading

for n, line in enumerate(lines, 1):
    if line.startswith("```"):
        if block is None:
            block = []
        else:
            if limit:
                text = "\n".join(block)
                results.append((f"{title} (block)", len(text), limit))
            block = None
        continue
    if block is not None:
        block.append(line)
        continue

    if line.startswith("#"):
        m = heading.match(line)
        limit = int(m.group(1).replace(",", "")) if m else None
        title = line.lstrip("# ").strip()
        continue

    m = row.match(line)
    if m:
        results.append((f"line {n}: {m.group(2)[:48]}", len(m.group(2)), int(m.group(1))))
        continue

    if limit:
        m = item.match(line)
        if m:
            text = m.group(1)
            code = re.match(r"`([^`]+)`", text)
            text = code.group(1) if code else text
            results.append((f"line {n}: {text[:48]}", len(text), limit))

server = json.loads((here / "mcp-registry" / "server.json").read_text(encoding="utf-8"))
results.append(("server.json description", len(server["description"]), 100))
results.append(("server.json title", len(server["title"]), 100))
if not re.fullmatch(r"[a-zA-Z0-9.-]+/[a-zA-Z0-9._-]+", server["name"]):
    results.append((f"server.json name pattern: {server['name']}", 1, 0))

over = [r for r in results if r[1] > r[2]]
for where, length, cap in results:
    flag = "OVER" if length > cap else "ok"
    print(f"{flag:4}  {length:>5} / {cap:<5}  {where}")
print(f"\n{len(results)} checked, {len(over)} over")
sys.exit(1 if over else 0)
