/**
 * What is specific to the /solutions hub: the switchboard has to hold three
 * pages or sixty without drawing an empty box, every link has to land on a
 * real route, and the copy has to stay inside what Rankbox ships.
 */
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { SOLUTIONS, type Solution } from "@/data/solutions";
import { TOOLS } from "@/data/tools";
import { SHIPPED } from "@/data/competitors/shared";
import { MARKETING_VOICE } from "@/lib/reddit/compliance";
import { FAQS, GROUPS, META, OTHER_WAYS, OUTLINE } from "./content";
import { head, itemList } from "./head";
import {
  FILTER_FROM,
  GROUP_ORDER,
  SEARCH_FROM,
  buildGroups,
  controlsFor,
  countLines,
  filterGroups,
  formatDay,
  matches,
  pagesLabel,
  toLine,
  type HubGroup,
} from "./model";
import * as CONTENT from "./content";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(HERE, "../../..");
const ROUTES = join(SRC, "routes");

/* ------------------------------------------------------------------ */
/* Fixtures                                                            */
/* ------------------------------------------------------------------ */

const sol = (slug: string, group: Solution["group"], name = slug.replace(/-/g, " ")): Solution => ({
  slug,
  name,
  tagline: `Tagline for ${name}.`,
  group,
});

/** Today's shape: three pages, all jobs. */
const THREE: Solution[] = [
  sol("ai-search-visibility", "job", "AI search visibility"),
  sol("aeo-tools", "job", "AEO tools"),
  sol("autonomous-geo", "job", "Autonomous GEO"),
];

/** Roughly where the roadmap ends up: ~60 pages in four groups, out of order. */
const SIXTY: Solution[] = [
  ...Array.from({ length: 12 }, (_, i) => sol(`job-${i}`, "job")),
  ...Array.from({ length: 30 }, (_, i) => sol(`industry-${i}-ai-seo`, "industry")),
  ...Array.from({ length: 10 }, (_, i) => sol(`platform-${i}-ai-seo`, "platform")),
  ...Array.from({ length: 8 }, (_, i) => sol(`tracker-${i}`, "tracker")),
  sol("shopify-ai-seo", "platform", "Shopify AI SEO"),
  sol("hvac-ai-seo", "industry", "HVAC AI SEO"),
];

/* ------------------------------------------------------------------ */
/* The switchboard model                                               */
/* ------------------------------------------------------------------ */

describe("switchboard at three pages", () => {
  const groups = buildGroups(THREE);

  it("draws one group and no empty ones", () => {
    expect(groups.map((g) => g.id)).toEqual(["job"]);
    expect(groups.every((g) => g.lines.length > 0)).toBe(true);
  });

  it("shows no search or filter (they haven't earned a place)", () => {
    expect(controlsFor(groups)).toEqual({ filter: false, search: false });
  });

  it("keeps the index order and capitalises names", () => {
    expect(groups[0].lines.map((l) => l.title)).toEqual([
      "AI search visibility",
      "AEO tools",
      "Autonomous GEO",
    ]);
    expect(groups[0].lines[0].path).toBe("/solutions/ai-search-visibility");
  });
});

describe("switchboard at sixty pages", () => {
  const groups = buildGroups(SIXTY);

  it("groups in display order and drops empty groups", () => {
    expect(groups.map((g) => g.id)).toEqual(["job", "platform", "industry", "tracker"]);
    expect(countLines(groups)).toBe(SIXTY.length);
  });

  it("turns on the filter chips and the search", () => {
    expect(controlsFor(groups)).toEqual({ filter: true, search: true });
  });

  it("filters by group", () => {
    const only = filterGroups(groups, { group: "platform", query: "" });
    expect(only.map((g) => g.id)).toEqual(["platform"]);
    expect(countLines(only)).toBe(11);
  });

  it("searches every word across name, tagline and slug", () => {
    const hits = filterGroups(groups, { group: "all", query: "shop seo" });
    expect(hits.flatMap((g) => g.lines.map((l) => l.slug))).toEqual(["shopify-ai-seo"]);
    expect(filterGroups(groups, { group: "all", query: "  HVAC  " })[0].lines[0].slug).toBe(
      "hvac-ai-seo",
    );
  });

  it("finds a whole group by its own words", () => {
    const words = Object.fromEntries(
      Object.entries(GROUPS).map(([id, g]) => [id, `${g.label} ${g.chip} ${g.searchWords}`]),
    ) as Record<HubGroup, string>;
    const hits = filterGroups(groups, { group: "all", query: "industry" }, words);
    expect(hits.map((g) => g.id)).toEqual(["industry"]);
  });

  it("returns nothing (not empty groups) when nothing matches", () => {
    expect(filterGroups(groups, { group: "all", query: "zzzz" })).toEqual([]);
    expect(filterGroups(groups, { group: "tracker", query: "shopify" })).toEqual([]);
  });
});

describe("switchboard thresholds", () => {
  it("needs two groups and enough pages for the filter", () => {
    const one = buildGroups(Array.from({ length: 40 }, (_, i) => sol(`j-${i}`, "job")));
    expect(controlsFor(one).filter).toBe(false);
    const small = buildGroups([sol("a", "job"), sol("b", "industry")]);
    expect(controlsFor(small).filter).toBe(false);
    const enough = buildGroups(
      Array.from({ length: FILTER_FROM }, (_, i) => sol(`p-${i}`, i % 2 ? "job" : "industry")),
    );
    expect(controlsFor(enough).filter).toBe(true);
  });

  it("brings in search at SEARCH_FROM pages", () => {
    const at = (n: number) =>
      buildGroups(Array.from({ length: n }, (_, i) => sol(`p-${i}`, "job")));
    expect(controlsFor(at(SEARCH_FROM - 1)).search).toBe(false);
    expect(controlsFor(at(SEARCH_FROM)).search).toBe(true);
  });

  it("never lists a hub as a line", () => {
    expect(toLine(sol("x", "hub"))).toBeNull();
    expect(buildGroups([sol("x", "hub")])).toEqual([]);
  });

  it("orders every group it can meet, and has copy for each", () => {
    for (const g of GROUP_ORDER) {
      expect(GROUPS[g].label.length, g).toBeGreaterThan(2);
      expect(GROUPS[g].line.length, g).toBeGreaterThan(10);
    }
  });
});

describe("formatters", () => {
  it("formats the checked date without a time zone", () => {
    expect(formatDay("2026-09-28")).toBe("Sep 28, 2026");
    expect(formatDay("2026-10-02")).toBe("Oct 2, 2026");
    expect(formatDay("soon")).toBe("soon");
  });

  it("counts pages in words", () => {
    expect(pagesLabel(1)).toBe("1 page");
    expect(pagesLabel(3)).toBe("3 pages");
  });

  it("treats an empty query as a match", () => {
    expect(matches(toLine(THREE[0])!, "   ")).toBe(true);
  });
});

/* ------------------------------------------------------------------ */
/* The live index and its links                                        */
/* ------------------------------------------------------------------ */

const ROUTE_FILES = new Set(readdirSync(ROUTES));

/** True when a path on this site has a route that will render it. */
function routeExists(path: string): boolean {
  const parts = path.split("/").filter(Boolean);
  if (parts.length === 0) return ROUTE_FILES.has("index.tsx");
  if (parts.length === 1) {
    return ROUTE_FILES.has(`${parts[0]}.index.tsx`) || ROUTE_FILES.has(`${parts[0]}.tsx`);
  }
  if (parts.length === 2) {
    if (ROUTE_FILES.has(`${parts[0]}.${parts[1]}.tsx`)) return true;
    if (parts[0] === "tools" && ROUTE_FILES.has("tools.$slug.tsx")) {
      return TOOLS.some((t) => t.slug === parts[1]);
    }
  }
  return false;
}

describe("links", () => {
  it("lists every live solutions page, each with its own route file", () => {
    const lines = buildGroups(SOLUTIONS).flatMap((g) => g.lines);
    expect(lines.length).toBe(SOLUTIONS.filter((s) => s.group !== "hub").length);
    for (const l of lines) {
      expect(existsSync(join(ROUTES, `solutions.${l.slug}.tsx`)), l.path).toBe(true);
    }
  });

  it("routes onward only to sections that exist", () => {
    for (const r of OTHER_WAYS.routes) expect(routeExists(r.to), r.to).toBe(true);
    for (const f of FAQS) if (f.link) expect(routeExists(f.link.to), f.link.to).toBe(true);
    expect(routeExists("/pricing")).toBe(true);
  });

  it("keeps the hub route thin", () => {
    const src = readFileSync(join(ROUTES, "solutions.index.tsx"), "utf8");
    expect(src).not.toMatch(/redirect/);
    expect(src).toMatch(/@\/sublanding\/solutions\/_index\/head/);
    expect(src).toMatch(/@\/sublanding\/solutions\/_index\/Page/);
  });
});

/* ------------------------------------------------------------------ */
/* Head and structured data                                            */
/* ------------------------------------------------------------------ */

describe("head", () => {
  const h = head();
  const graph = JSON.parse(h.scripts[0].children)["@graph"] as Record<string, unknown>[];
  const byType = (t: string) => graph.find((n) => n["@type"] === t) as Record<string, unknown>;

  it("meets the hub's SEO basics", () => {
    expect(META.title.length).toBeLessThanOrEqual(65);
    expect(META.description.length).toBeGreaterThanOrEqual(110);
    expect(META.description.length).toBeLessThanOrEqual(165);
    expect(META.keywords[0]).toBe(META.query);
    expect(META.h1.toLowerCase()).toContain(META.query);
    expect(META.title.toLowerCase()).toContain(META.query);
    expect(h.links[0].href).toBe("https://rankbox.xyz/solutions");
  });

  it("lists the index as an ItemList in panel order", () => {
    const list = itemList();
    const lines = buildGroups(SOLUTIONS).flatMap((g) => g.lines);
    expect(list.numberOfItems).toBe(lines.length);
    expect(list.itemListElement.map((i) => i.position)).toEqual(lines.map((_, i) => i + 1));
    expect(list.itemListElement.map((i) => i.url)).toEqual(
      lines.map((l) => `https://rankbox.xyz${l.path}`),
    );
    expect(byType("ItemList")).toBeTruthy();
  });

  it("puts every visible question in the FAQPage", () => {
    const faq = byType("FAQPage") as { mainEntity: { name: string }[] };
    expect(faq.mainEntity.map((q) => q.name)).toEqual(FAQS.map((f) => f.q));
  });

  it("has no aggregateRating", () => {
    expect(h.scripts[0].children).not.toMatch(/aggregateRating/);
  });

  it("breadcrumbs Home → Solutions", () => {
    const crumbs = byType("BreadcrumbList") as { itemListElement: { name: string }[] };
    expect(crumbs.itemListElement.map((c) => c.name)).toEqual(["Home", "Solutions"]);
  });
});

/* ------------------------------------------------------------------ */
/* Copy and claims (mirrors the shared suite, which skips this page    */
/* until it's in the registry)                                         */
/* ------------------------------------------------------------------ */

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

const COPY = strings(CONTENT);
const SOURCES = readdirSync(HERE)
  .filter((f) => /\.tsx?$/.test(f) && !f.endsWith(".test.ts"))
  .map((f) => ({ f, src: readFileSync(join(HERE, f), "utf8") }));

describe("copy", () => {
  it("renders every OUTLINE heading through h2()", () => {
    const all = SOURCES.map((s) => s.src).join("\n");
    for (const s of OUTLINE) expect(all, s.id).toContain(`h2("${s.id}")`);
    expect(new Set(OUTLINE.map((s) => s.h2)).size).toBe(OUTLINE.length);
  });

  it("never types a price or trial length", () => {
    for (const { f, src } of SOURCES) {
      expect(src, f).not.toMatch(/49\.5/);
      expect(src, f).not.toMatch(/\b(7|seven)[- ]day\b/i);
      expect(src, f).not.toMatch(/#[0-9a-f]{6}\b/i);
    }
  });

  it("says Rankbox and gets the trial right", () => {
    expect(COPY.filter((t) => /rankvolt|no credit card|\b(2|two)[- ]day\b/i.test(t))).toEqual([]);
  });

  it("never claims citation tracking", () => {
    if (SHIPPED.citationTracking) return;
    const claims = COPY.filter(
      (t) =>
        /\b(tracks?|tracking|monitors?|monitoring)\b[^.]*\b(citations?|mentions?|rankings?|share of voice)\b/i.test(
          t,
        ) || /\b(citations?|mentions?)\b[^.]*\b(tracked|monitored)\b/i.test(t),
    )
      .filter((t) => !t.trim().endsWith("?"))
      .filter((t) => !/\b(not|n't|no|yet|other tools?|trackers?)\b/i.test(t));
    expect(claims).toEqual([]);
  });

  it("sounds like a person", () => {
    const hits = COPY.flatMap((t) =>
      MARKETING_VOICE.filter((m) => m.pattern.test(t)).map((m) => m.word),
    );
    expect(hits).toEqual([]);
    expect(COPY.filter((t) => /\u2014/.test(t))).toEqual([]);
  });

  it("keeps prose in content.ts", () => {
    const prose = SOURCES.filter(({ f }) => f.endsWith(".tsx")).flatMap(({ f, src }) =>
      [...src.matchAll(/>\s*([^<>{}]+?)\s*</g)]
        .map((m) => m[1].trim())
        .filter((t) => !/[=;(){}]|=>/.test(t))
        .filter((t) => t.split(/\s+/).filter((w) => /[a-z]/i.test(w)).length >= 7)
        .map((t) => `${f}: ${t}`),
    );
    expect(prose).toEqual([]);
  });

  it("imports only from its own directory and the brand whitelist", () => {
    const ok = [
      /^\.\//,
      /^(react|react-dom|@tanstack\/react-router|lucide-react|motion|vitest)(\/|$)/,
      /^node:/,
      /^@\/components\/ui\//,
      /^@\/components\/landing\/(Navbar|Footer|ai-logos)$/,
      /^@\/components\/ExploreMore$/,
      /^@\/sublanding\/_shared\//,
      /^@\/data\/(?!solutions\/|personas)/,
      /^@\/lib\//,
      /^@\/hooks\//,
      /^@\/assets\//,
    ];
    const files = readdirSync(HERE).filter((f) => /\.tsx?$/.test(f));
    const bad = files.flatMap((f) =>
      [
        ...readFileSync(join(HERE, f), "utf8").matchAll(
          /(?:from\s+|import\s*\(\s*|import\s+)["']([^"']+)["']/g,
        ),
      ]
        .map((m) => m[1])
        .filter(
          (spec) =>
            !ok.some((r) => r.test(spec)) || (spec.startsWith("node:") && !f.endsWith(".test.ts")),
        )
        .map((spec) => `${f} → ${spec}`),
    );
    expect(bad).toEqual([]);
  });

  it("asks questions the legacy solutions pages don't", () => {
    const legacy = ["ai-search-visibility.ts", "aeo-tools.ts"].flatMap((f) =>
      [...readFileSync(join(SRC, "data/solutions", f), "utf8").matchAll(/q:\s*"([^"]+)"/g)].map(
        (m) => m[1].toLowerCase(),
      ),
    );
    expect(legacy.length).toBeGreaterThan(5);
    for (const f of FAQS) expect(legacy, f.q).not.toContain(f.q.toLowerCase());
  });
});
