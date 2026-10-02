/**
 * What's specific to /solutions/autonomous-geo: the sample month adds up,
 * every link lands on a real page, every outside fact has a source and a
 * date, and nothing claims tracking or a plugin that hasn't shipped.
 * The shared rules (imports, uniqueness, voice) live in sublanding.test.ts.
 */
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PLAN, PUBLISHING_TODAY, SHIPPED, TRIAL_TERMS } from "@/sublanding/_shared/facts";
import { getTool } from "@/data/tools";
import { getFeature } from "@/data/features";
import { INTEGRATIONS } from "@/data/integrations";
import { MARKETING_VOICE } from "@/lib/reddit/compliance";
import * as CONTENT from "./content";
import {
  CHECKED_ON,
  FAQS,
  FINISHED,
  FIRST_WEEK,
  HAND_OVER,
  META,
  MONTH,
  MONTH_ROWS,
  OUTLINE,
  PATH,
  STOPS,
  TRACKER_NOTE,
  YOURS,
  type Target,
} from "./content";
import { MonthSwitch } from "./MonthSwitch";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(HERE, "../../..");

/** Every string a value holds, flattened. */
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}
const COPY = strings(CONTENT);

/* ------------------------------------------------------------------ */

describe("meta", () => {
  it("puts the primary query in the title and the H1", () => {
    expect(META.keywords[0]).toBe(META.query);
    expect(META.title.toLowerCase()).toContain("ai search optimization tool");
    expect(META.h1.toLowerCase()).toContain("ai search optimization tool");
    expect(META.title.length).toBeLessThanOrEqual(65);
    expect(META.description.length).toBeGreaterThanOrEqual(110);
    expect(META.description.length).toBeLessThanOrEqual(165);
  });

  it("names every section once, in order", () => {
    const ids = OUTLINE.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    const tsx = readdirSync(HERE)
      .filter((f) => f.endsWith(".tsx"))
      .map((f) => readFileSync(join(HERE, f), "utf8"))
      .join("\n");
    for (const id of ids) {
      expect(tsx, `a component renders h2("${id}")`).toContain(`h2("${id}")`);
      expect(tsx, `a section has id="${id}"`).toContain(`id="${id}"`);
    }
  });
});

/* ------------------------------------------------------------------ */

describe("the sample month", () => {
  it("has one row per article in the plan, one per day, in order", () => {
    expect(MONTH_ROWS.length).toBe(PLAN.articlesPerMonth);
    expect(MONTH_ROWS.length).toBeLessThanOrEqual(31);
    MONTH_ROWS.forEach((r, i) => expect(r.day).toBe(i + 1));
    expect(FIRST_WEEK).toBeLessThan(MONTH_ROWS.length);
  });

  it("gives every day its own question and its own article", () => {
    expect(new Set(MONTH_ROWS.map((r) => r.task)).size).toBe(MONTH_ROWS.length);
    expect(new Set(MONTH_ROWS.map((r) => r.title)).size).toBe(MONTH_ROWS.length);
    for (const r of MONTH_ROWS) {
      expect(r.task, `day ${r.day} quotes the buyer's question`).toMatch(/“[^”]+”/);
      expect(MONTH.sources[r.source], `day ${r.day} source`).toBeTruthy();
    }
  });

  it("is fictional and labelled as a sample", () => {
    expect(MONTH.site).toMatch(/\.example$/);
    expect(FINISHED.doc.url.startsWith(MONTH.site)).toBe(true);
    expect(MONTH.sample.toLowerCase()).toContain("sample");
    expect(MONTH.period.toLowerCase()).toContain("sample");
    expect(FINISHED.doc.sample.toLowerCase()).toContain("sample");
    expect(FINISHED.doc.title).toBe(MONTH_ROWS[0].title);
  });

  it("renders on the server with both versions of the first week in the markup", () => {
    const html = renderToStaticMarkup(createElement(MonthSwitch));
    expect(html.match(/<li /g)?.length).toBe(FIRST_WEEK);
    for (const r of MONTH_ROWS.slice(0, FIRST_WEEK)) {
      expect(html).toContain(r.title.replace(/'/g, "&#x27;"));
    }
    // The switch starts on homework: that option is checked, the other isn't.
    expect(html).toMatch(/role="radio" aria-checked="true"[^>]*>.*?Homework/);
    expect(html).toMatch(/role="radio" aria-checked="false"[^>]*>.*?Done/);
  });
});

/* ------------------------------------------------------------------ */

describe("links", () => {
  const targets: Target[] = [
    STOPS.guide.target,
    ...TRACKER_NOTE.links.map((l) => l.target),
    ...FINISHED.notes.flatMap((n) => ("link" in n && n.link ? [n.link.target] : [])),
    ...YOURS.items.flatMap((i) => ("link" in i && i.link ? [i.link.target] : [])),
    YOURS.diy.target,
  ];

  const today = new Date().toISOString().slice(0, 10);

  function resolves(t: Target): string | null {
    switch (t.kind) {
      case "tool":
        return getTool(t.slug) ? null : `no tool ${t.slug}`;
      case "feature":
        return getFeature(t.slug) ? null : `no feature ${t.slug}`;
      case "integration":
        return INTEGRATIONS.some((i) => i.slug === t.slug) ? null : `no integration ${t.slug}`;
      case "blog": {
        const file = join(SRC, "content/blog", `${t.slug}.md`);
        if (!existsSync(file)) return `no blog post ${t.slug}`;
        const date = readFileSync(file, "utf8").match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})/m)?.[1];
        return date && date <= today ? null : `blog post ${t.slug} isn't live yet (${date})`;
      }
      case "solution": {
        const file = join(SRC, "routes", `${t.to.slice(1).replace(/\//g, ".")}.tsx`);
        return existsSync(file) ? null : `no route file for ${t.to}`;
      }
    }
  }

  it("points every in-copy link at a page that exists and is live", () => {
    expect(targets.map(resolves).filter(Boolean)).toEqual([]);
  });

  it("links the neighbours it has to differentiate from", () => {
    const paths = targets.map((t) =>
      t.kind === "solution"
        ? t.to
        : t.kind === "feature"
          ? `/features/${t.slug}`
          : `/${t.kind}/${t.slug}`,
    );
    expect(paths).toContain("/solutions/aeo-tools");
    expect(paths).toContain("/solutions/ai-search-visibility");
    expect(paths).toContain("/features/auto-publishing");
    expect(paths).toContain("/blog/ai-search-optimization-tools");
  });

  it("has a route file for this page", () => {
    expect(existsSync(join(SRC, "routes", `${PATH.slice(1).replace(/\//g, ".")}.tsx`))).toBe(true);
  });
});

/* ------------------------------------------------------------------ */

describe("outside facts", () => {
  it("dates every vendor and platform quote, from https sources", () => {
    expect(CHECKED_ON).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(TRACKER_NOTE.checked).toMatch(/\d{1,2} \w+ \d{4}/);
    const urls = [
      STOPS.google.url,
      ...TRACKER_NOTE.trackers.map((t) => t.url),
      ...YOURS.items.flatMap((i) => ("source" in i && i.source ? [i.source.url] : [])),
    ];
    expect(urls.length).toBe(5);
    for (const u of urls) expect(u).toMatch(/^https:\/\//);
  });

  it("quotes each tracker without saying what it can't do", () => {
    expect(TRACKER_NOTE.trackers.map((t) => t.name)).toEqual([
      "Semrush AI Visibility Toolkit",
      "Ahrefs Brand Radar",
      "Surfer AI Tracker",
    ]);
    const vendorLines = [
      TRACKER_NOTE.vendorsLead,
      ...TRACKER_NOTE.trackers.map((t) => t.quote),
      ...STOPS.kinds.filter((k) => k.id !== "rankbox").map((k) => k.note),
    ];
    for (const line of vendorLines) {
      expect(line, line).not.toMatch(
        /\b(can't|cannot|doesn't|don't|won't|unable|lacks?|missing)\b/i,
      );
    }
  });
});

/* ------------------------------------------------------------------ */

describe("claims", () => {
  it("draws Rankbox's measuring gap for as long as tracking hasn't shipped", () => {
    const rankbox = STOPS.kinds.find((k) => k.id === "rankbox")!;
    expect(rankbox.covers.includes("measure")).toBe(SHIPPED.citationTracking);
    expect(Boolean(rankbox.gaps?.measure)).toBe(!SHIPPED.citationTracking);
  });

  it("draws every kind as one unbroken run of stages", () => {
    const order = STOPS.stages.map((s) => s.id);
    for (const k of STOPS.kinds) {
      const idx = k.covers.map((c) => order.indexOf(c));
      idx.forEach((v, i) => i > 0 && expect(v, k.id).toBe(idx[i - 1] + 1));
    }
  });

  it("answers the tracker queries with a plain no while tracking hasn't shipped", () => {
    if (SHIPPED.citationTracking) return;
    expect(TRACKER_NOTE.honest).toMatch(/doesn't track/);
    const faq = FAQS.find((f) => /track/i.test(f.q))!;
    expect(faq.a.startsWith("Not yet")).toBe(true);
    const tracking = COPY.filter(
      (t) =>
        /\b(tracks?|tracking|monitors?|monitoring)\b/i.test(t) &&
        /\b(visibility|rankings?|citations?|mentions?|named)\b/i.test(t) &&
        !t.trim().endsWith("?"),
    ).filter((t) => !/\b(not|n't|yet|trackers?|sell|Track and grow)\b/i.test(t));
    expect(tracking).toEqual([]);
  });

  it("describes publishing with the shared sentence, so it follows addonLive", () => {
    const connect = YOURS.items.find((i) => /connect/i.test(i.title))!;
    expect(connect.body).toBe(`${PUBLISHING_TODAY}.`);
    expect(FAQS.find((f) => /CMS/.test(f.q))!.a.startsWith(PUBLISHING_TODAY)).toBe(true);
    for (const t of COPY) {
      expect(t, t).not.toMatch(/\b(one-click|1-click)\b(?![^.]*in development)/i);
    }
  });

  it("states the trial from facts.ts and never promises no card", () => {
    expect(HAND_OVER.terms).toBe(TRIAL_TERMS);
    for (const t of COPY) expect(t).not.toMatch(/no credit card|no card needed/i);
  });

  it("never promises results or invents proof", () => {
    for (const t of COPY) {
      expect(t, t).not.toMatch(
        /\b(guarantee[sd]?|testimonial|customers love|trusted by|\d+\+? (customers|founders|teams))\b/i,
      );
      expect(t, t).not.toMatch(/until it scores 100|rank #?1/i);
    }
  });

  it("sounds like a person", () => {
    const hits = COPY.flatMap((t) =>
      MARKETING_VOICE.filter((m) => m.pattern.test(t)).map((m) => `${m.word}: ${t.slice(0, 60)}`),
    );
    expect(hits).toEqual([]);
    for (const t of COPY) expect(t, t).not.toMatch(/—/);
  });

  it("keeps prices and the trial length out of the source", () => {
    const files = readdirSync(HERE).filter((f) => /\.tsx?$/.test(f) && !f.endsWith(".test.ts"));
    for (const f of files) {
      const src = readFileSync(join(HERE, f), "utf8");
      expect(src, f).not.toMatch(/49\.5/);
      expect(src, f).not.toMatch(/\b(7|seven)[- ]day\b/i);
      expect(src, f).not.toMatch(/rankvolt/i);
    }
  });
});
