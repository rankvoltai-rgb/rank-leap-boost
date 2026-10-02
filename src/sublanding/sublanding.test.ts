/**
 * The rules every sublanding page is held to. There are no templates: each
 * page is designed and written from scratch in its own directory, and these
 * tests make sure no two pages end up sharing their substance, and that no
 * page claims more than Rankbox ships.
 *
 *   - the directory contract (brief, content, page, test, route)
 *   - imports stay inside the page's own directory plus the brand whitelist
 *   - SEO basics (query in title and H1, title and description lengths)
 *   - claims (no unshipped features, no typed prices, no "Rankvolt")
 *   - uniqueness across every page (8-word phrasing, H2s, FAQs, meta)
 */
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, relative, resolve, dirname } from "node:path";
import { SUBLANDING } from "./registry";
import * as FACTS from "./_shared/facts";
import { SHIPPED } from "@/data/competitors/shared";
import { MARKETING_VOICE } from "@/lib/reddit/compliance";
import { VISIBILITY, VISIBILITY_FAQS } from "@/data/solutions/ai-search-visibility";
import { AEO, aeoFaqs } from "@/data/solutions/aeo-tools";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(HERE, "..");
const ROUTES = join(SRC, "routes");

/* ------------------------------------------------------------------ */
/* Loading                                                             */
/* ------------------------------------------------------------------ */

const CONTENT = import.meta.glob("./*/*/content.ts", { eager: true }) as Record<
  string,
  Record<string, unknown>
>;

interface Meta {
  query?: string;
  title: string;
  description: string;
  h1: string;
  keywords: string[];
}
interface Faq {
  q: string;
  a: string;
}
interface Section {
  id: string;
  h2: string;
}

/** Every string a value holds, flattened. */
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

/** All .ts/.tsx files under a directory, recursively. */
function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return sourceFiles(p);
    return /\.tsx?$/.test(f) ? [p] : [];
  });
}

/** "/solutions/autonomous-geo" → src/routes/solutions.autonomous-geo.tsx; "/solutions" → solutions.index.tsx */
function routeFile(path: string): string {
  const parts = path.split("/").filter(Boolean);
  const name = parts.length === 1 ? `${parts[0]}.index.tsx` : `${parts.join(".")}.tsx`;
  return join(ROUTES, name);
}

interface Loaded {
  path: string;
  dir: string;
  abs: string;
  hub: boolean;
  content: Record<string, unknown>;
  meta: Meta;
  faqs: Faq[];
  outline: Section[];
  copy: string[];
  files: string[];
}

const PAGES: Loaded[] = SUBLANDING.map((p) => {
  const content = CONTENT[`./${p.dir}/content.ts`] ?? {};
  const abs = join(HERE, p.dir);
  return {
    path: p.path,
    dir: p.dir,
    abs,
    hub: p.group === "hub",
    content,
    meta: content.META as Meta,
    faqs: (content.FAQS as Faq[]) ?? [],
    outline: (content.OUTLINE as Section[]) ?? [],
    copy: strings(content),
    files: existsSync(abs) ? sourceFiles(abs) : [],
  };
});

/** Per-page suites; skipped (not failed) while no page is registered yet. */
const perPage = PAGES.length ? describe : describe.skip;

/* ------------------------------------------------------------------ */
/* Directory contract                                                  */
/* ------------------------------------------------------------------ */

describe("directory contract", () => {
  it("lists every page directory on disk in the registry", () => {
    const onDisk = readdirSync(HERE)
      .filter((s) => !s.startsWith("_") && statSync(join(HERE, s)).isDirectory())
      .flatMap((section) =>
        readdirSync(join(HERE, section))
          .filter((d) => statSync(join(HERE, section, d)).isDirectory())
          .map((d) => `${section}/${d}`),
      );
    const listed = new Set(SUBLANDING.map((p) => p.dir));
    const unwired = onDisk.filter((d) => !listed.has(d));
    expect(unwired, "page directories not yet in src/sublanding/registry.ts").toEqual([]);
  });

  for (const p of PAGES) {
    describe(p.path, () => {
      it("has its brief, content, page and own test", () => {
        for (const f of ["BRIEF.md", "content.ts", "Page.tsx"]) {
          expect(existsSync(join(p.abs, f)), `${p.dir}/${f}`).toBe(true);
        }
        const tests = p.files.filter((f) => f.endsWith(".test.ts"));
        expect(tests.length, `${p.dir} needs its own *.test.ts`).toBeGreaterThan(0);
      });

      it("has a thin route file that only imports its own page", () => {
        const file = routeFile(p.path);
        expect(existsSync(file), relative(SRC, file)).toBe(true);
        const src = readFileSync(file, "utf8");
        for (const spec of importsOf(src)) {
          const ok = spec.startsWith(`@/sublanding/${p.dir}/`) || spec.startsWith("@tanstack/");
          expect(ok, `${relative(SRC, file)} imports ${spec}`).toBe(true);
        }
      });

      it("exports META, FAQS and OUTLINE in the agreed shape", () => {
        expect(p.meta, "META").toBeTruthy();
        expect(typeof p.meta.title).toBe("string");
        expect(typeof p.meta.description).toBe("string");
        expect(typeof p.meta.h1).toBe("string");
        expect(Array.isArray(p.meta.keywords)).toBe(true);
        expect(Array.isArray(p.faqs)).toBe(true);
        expect(p.outline.length, "OUTLINE lists the page's sections").toBeGreaterThan(2);
        for (const s of p.outline) expect(s.h2.trim().length, s.id).toBeGreaterThan(3);
      });
    });
  }
});

/* ------------------------------------------------------------------ */
/* Imports: own directory + brand whitelist                            */
/* ------------------------------------------------------------------ */

function importsOf(src: string): string[] {
  const specs: string[] = [];
  for (const m of src.matchAll(/(?:from\s+|import\s*\(\s*|import\s+)["']([^"']+)["']/g)) specs.push(m[1]);
  return specs;
}

const PACKAGES = [
  "react",
  "react-dom",
  "@tanstack/react-router",
  "@tanstack/react-start",
  "lucide-react",
  "motion",
  "clsx",
  "tailwind-merge",
  "class-variance-authority",
  "recharts",
  "vitest",
  "zod",
];
const ALIASES = [
  /^@\/components\/ui\//,
  /^@\/components\/landing\/(Navbar|Footer|ai-logos)$/,
  /^@\/components\/ExploreMore$/,
  /^@\/sublanding\/_shared\//,
  /^@\/data\/(?!solutions\/|personas)/,
  /^@\/lib\//,
  /^@\/hooks\//,
  /^@\/assets\//,
];

function allowed(spec: string, file: string, pageDir: string): boolean {
  if (spec.startsWith(".")) return resolve(dirname(file), spec).startsWith(pageDir);
  if (spec.startsWith("node:")) return file.endsWith(".test.ts");
  if (spec.startsWith("@/")) return ALIASES.some((r) => r.test(spec));
  return PACKAGES.some((p) => spec === p || spec.startsWith(`${p}/`));
}

perPage("imports", () => {
  for (const p of PAGES) {
    it(`${p.path} builds only from its own directory and the brand whitelist`, () => {
      const bad = p.files.flatMap((f) =>
        importsOf(readFileSync(f, "utf8"))
          .filter((s) => !allowed(s, f, p.abs))
          .map((s) => `${relative(HERE, f)} → ${s}`),
      );
      expect(bad).toEqual([]);
    });
  }
});

/* ------------------------------------------------------------------ */
/* SEO basics                                                          */
/* ------------------------------------------------------------------ */

perPage("SEO basics", () => {
  for (const p of PAGES) {
    it(`${p.path}: title, description and H1`, () => {
      const { title, description, h1, query, keywords } = p.meta;
      expect(title.length, title).toBeLessThanOrEqual(65);
      expect(description.length, description).toBeGreaterThanOrEqual(110);
      expect(description.length, description).toBeLessThanOrEqual(165);
      if (p.hub) return;
      const q = (query ?? "").toLowerCase();
      expect(q.length, "META.query").toBeGreaterThan(3);
      expect(keywords[0]?.toLowerCase(), "keywords[0] is the query").toBe(q);
      // "ai search optimization tools" matches "AI search optimization tool".
      const stem = q.replace(/s$/, "");
      expect(title.toLowerCase(), "title contains the query").toContain(stem);
      expect(h1.toLowerCase(), "H1 contains the query").toContain(stem);
    });
  }
});

/* ------------------------------------------------------------------ */
/* Claims                                                              */
/* ------------------------------------------------------------------ */

perPage("claims", () => {
  for (const p of PAGES) {
    describe(p.path, () => {
      const source = p.files.filter((f) => !f.endsWith(".test.ts")).map((f) => readFileSync(f, "utf8"));

      it("says Rankbox, never Rankvolt", () => {
        expect(p.copy.filter((t) => /rankvolt/i.test(t))).toEqual([]);
      });

      it("never types Rankbox's price or trial length (they come from facts.ts)", () => {
        for (const s of source) {
          expect(s, "typed price").not.toMatch(/49\.5/);
          expect(s, "typed trial length").not.toMatch(/\b(7|seven)[- ]day\b/i);
        }
      });

      it("gets the trial right", () => {
        expect(p.copy.filter((t) => /\b(2|two)[- ]day\b/i.test(t))).toEqual([]);
        expect(p.copy.filter((t) => /no credit card/i.test(t))).toEqual([]);
      });

      it("never claims citation tracking while it hasn't shipped", () => {
        if (SHIPPED.citationTracking) return;
        const claims = p.copy
          .filter(
            (t) =>
              /\b(tracks?|tracking|monitors?|monitoring)\b[^.]*\b(citations?|mentions?|rankings?|share of voice)\b/i.test(t) ||
              /\b(citations?|mentions?)\b[^.]*\b(tracked|monitored)\b/i.test(t),
          )
          .filter((t) => !t.trim().endsWith("?"))
          .filter((t) => !/\b(not|n't|no|yet|other tools?|trackers?)\b/i.test(t));
        expect(claims).toEqual([]);
      });

      it("sounds like a person", () => {
        const hits = p.copy.flatMap((t) =>
          MARKETING_VOICE.filter((m) => m.pattern.test(t)).map((m) => `${m.word}: ${t.slice(0, 70)}`),
        );
        expect(hits).toEqual([]);
      });

      it("keeps prose in content.ts, not in components", () => {
        const prose = p.files
          .filter((f) => f.endsWith(".tsx"))
          .flatMap((f) =>
            [...readFileSync(f, "utf8").matchAll(/>\s*([^<>{}]+?)\s*</g)]
              .map((m) => m[1].trim())
              .filter((t) => !/[=;(){}]|=>/.test(t))
              .filter((t) => t.split(/\s+/).filter((w) => /[a-z]/i.test(w)).length >= 7)
              .map((t) => `${relative(HERE, f)}: ${t.slice(0, 60)}`),
          );
        expect(prose).toEqual([]);
      });
    });
  }
});

/* ------------------------------------------------------------------ */
/* Uniqueness                                                          */
/* ------------------------------------------------------------------ */

const norm = (t: string) =>
  t
    .toLowerCase()
    .replace(/[^a-z0-9$%\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function shingles(texts: string[], n = 8): Set<string> {
  const out = new Set<string>();
  for (const t of texts) {
    const w = norm(t).split(" ").filter(Boolean);
    for (let i = 0; i + n <= w.length; i++) out.add(w.slice(i, i + n).join(" "));
  }
  return out;
}

/** Phrasing every page may share: the facts sentences. */
const FACT_SHINGLES = shingles(strings(FACTS));

const LEGACY = [
  { path: "/solutions/ai-search-visibility", copy: strings([VISIBILITY, VISIBILITY_FAQS]), faqs: VISIBILITY_FAQS },
  { path: "/solutions/aeo-tools", copy: strings([AEO, aeoFaqs(null)]), faqs: aeoFaqs(null) },
];

describe("uniqueness", () => {
  it("gives every page its own title, description and H1", () => {
    for (const key of ["title", "description", "h1"] as const) {
      const seen = new Map<string, string>();
      for (const p of PAGES) {
        const v = norm(p.meta[key]);
        expect(seen.get(v), `${key} of ${p.path} repeats ${seen.get(v)}`).toBeUndefined();
        seen.set(v, p.path);
      }
    }
  });

  it("never repeats an H2 across pages", () => {
    const seen = new Map<string, string>();
    for (const p of PAGES) {
      for (const s of p.outline) {
        const v = norm(s.h2);
        expect(seen.get(v), `"${s.h2}" on ${p.path} is also on ${seen.get(v)}`).toBeUndefined();
        seen.set(v, p.path);
      }
    }
  });

  it("never repeats an FAQ question across pages", () => {
    const seen = new Map<string, string>();
    for (const l of LEGACY) for (const f of l.faqs) seen.set(norm(f.q), l.path);
    for (const p of PAGES) {
      for (const f of p.faqs) {
        const v = norm(f.q);
        expect(seen.get(v), `"${f.q}" on ${p.path} is also on ${seen.get(v)}`).toBeUndefined();
        seen.set(v, p.path);
      }
    }
  });

  it("shares under 8% of its 8-word phrasing with any other page", () => {
    const sets = [
      ...PAGES.map((p) => ({ path: p.path, set: shingles(p.copy) })),
      ...LEGACY.map((l) => ({ path: l.path, set: shingles(l.copy) })),
    ].map(({ path, set }) => ({ path, set: new Set([...set].filter((s) => !FACT_SHINGLES.has(s))) }));
    const over: string[] = [];
    for (let i = 0; i < sets.length; i++) {
      for (let j = i + 1; j < sets.length; j++) {
        const a = sets[i];
        const b = sets[j];
        if (!a.set.size || !b.set.size) continue;
        let shared = 0;
        for (const s of a.set) if (b.set.has(s)) shared++;
        const ratio = shared / Math.min(a.set.size, b.set.size);
        if (ratio > 0.08) over.push(`${a.path} ↔ ${b.path}: ${(ratio * 100).toFixed(1)}%`);
      }
    }
    expect(over).toEqual([]);
  });
});
