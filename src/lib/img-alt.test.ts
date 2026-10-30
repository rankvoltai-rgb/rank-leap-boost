/**
 * Every image says what it is. SEO audits report an <img> with no alt, or an
 * empty one, as missing alt text, so neither is allowed anywhere in src: give
 * each image a real description. A logo or icon sitting next to its own name
 * keeps `aria-hidden` so screen readers don't hear the name twice; crawlers
 * still read the alt.
 *
 * Covers JSX and HTML strings in .ts/.tsx (the <img> tag itself), and image
 * syntax in Markdown content. Prose that merely mentions "<img>" in a blog
 * post is not a tag and isn't checked.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const SRC = join(__dirname, "..");

function files(dir: string, test: (name: string) => boolean): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === "node_modules" ? [] : files(path, test);
    return test(name) ? [path] : [];
  });
}

/** Each `<img …>` / `<motion.img …>` tag in a file, skipping over `{…}` expressions. */
function imgTags(source: string): { tag: string; line: number }[] {
  const out: { tag: string; line: number }[] = [];
  // A real tag has attributes; a bare "<img>" is a comment or prose mentioning one.
  for (const m of source.matchAll(/<(?:motion\.)?img\s/g)) {
    let depth = 0;
    let i = m.index! + m[0].length;
    for (; i < source.length; i++) {
      const c = source[i];
      if (c === "{") depth++;
      else if (c === "}") depth--;
      else if (c === ">" && depth === 0) break;
    }
    out.push({
      tag: source.slice(m.index!, i + 1),
      line: source.slice(0, m.index!).split("\n").length,
    });
  }
  return out;
}

const CODE = files(SRC, (n) => /\.tsx?$/.test(n) && !/\.test\.tsx?$/.test(n));
const MARKDOWN = files(SRC, (n) => /\.mdx?$/.test(n));

describe("image alt text", () => {
  it("gives every <img> in the code a non-empty alt", () => {
    const bad: string[] = [];
    for (const file of CODE) {
      for (const { tag, line } of imgTags(readFileSync(file, "utf8"))) {
        // A spread may carry the alt (e.g. a wrapper passing props through).
        if (/\{\s*\.\.\.\w+/.test(tag)) continue;
        const alt = tag.match(/\balt\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([^}]*)\})/);
        const empty =
          !alt ||
          ((alt[1] ?? alt[2] ?? "").trim() === "" && alt[3] === undefined) ||
          /^\s*(""|''|``)\s*$/.test(alt[3] ?? "x");
        if (empty) bad.push(`${relative(SRC, file)}:${line}`);
      }
    }
    expect(bad, "describe these images in their alt").toEqual([]);
  });

  it("gives every Markdown image alt text", () => {
    const bad: string[] = [];
    for (const file of MARKDOWN) {
      const text = readFileSync(file, "utf8");
      for (const m of text.matchAll(/!\[\s*\]\(/g)) {
        bad.push(`${relative(SRC, file)}:${text.slice(0, m.index).split("\n").length}`);
      }
    }
    expect(bad, "write alt text inside the [ ] of these images").toEqual([]);
  });
});
