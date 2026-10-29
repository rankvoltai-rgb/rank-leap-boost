/**
 * What's specific to /white-label/content-writing: the roster planner's
 * maths, the brief composer against the writer's own composer, the ticket's
 * score against the real scorer, every link resolving to a real page, and the
 * lines this page must never cross (reselling, one-click, writers, results).
 */
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PLAN } from "@/sublanding/_shared/facts";
import { PACE_OPTIONS, paceOptionLabel } from "@/data/auto-publishing";
import { FEATURE_SLUGS } from "@/data/features";
import { PUBLISH_PLATFORMS } from "@/data/platforms";
import { getTool } from "@/data/tools";
import { composeStyleBrief, STYLE_DEFAULTS } from "@/lib/style-brief";
import { analyzeArticle } from "@/lib/seo-analysis";
import {
  ALL_LINKS,
  CHECKS,
  FAQS,
  META,
  OUTLINE,
  PACE,
  STATIONS,
  STYLES,
  TICKET,
  TONES,
  VOICE,
  type Target,
} from "./content";
import { formatHours, isCapped, monthlyAt, parseMinutes, rosterTotals, siteMonth } from "./planner";
import { OWN, briefFor, fieldsFrom, sameFields } from "./voice-brief";
import { checklistText } from "./checklist";
import * as CONTENT from "./content";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(HERE, "../../..");
const ROUTES = join(SRC, "routes");

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}
const COPY = strings(CONTENT).join("\n");
const SOURCES = readdirSync(HERE)
  .filter((f) => /\.tsx?$/.test(f) && !f.endsWith(".test.ts"))
  .map((f) => ({ f, src: readFileSync(join(HERE, f), "utf8") }));

/* ------------------------------------------------------------------ */

describe("roster planner", () => {
  it("counts a month the way Settings → Autopilot does", () => {
    expect(PACE_OPTIONS.map(monthlyAt)).toEqual([30, 22, 13, 9, 4]);
  });

  it("never gives a site more than its plan allows", () => {
    for (const p of PACE_OPTIONS) expect(siteMonth(p)).toBeLessThanOrEqual(PLAN.articlesPerMonth);
    expect(siteMonth(7, 20)).toBe(20);
    expect(isCapped(7, 20)).toBe(true);
    expect(isCapped(3, 20)).toBe(false);
  });

  it("adds up the default roster and its editing hours", () => {
    const rows = PACE.defaults.map((d, i) => ({ id: `r${i}`, name: d.name, pace: d.pace }));
    const t = rosterTotals(rows, PACE.defaultMinutes);
    const expected = PACE.defaults.reduce((s, d) => s + siteMonth(d.pace), 0);
    expect(t.sites).toBe(3);
    expect(t.articles).toBe(expected);
    expect(t.minutes).toBe(expected * PACE.defaultMinutes);
    expect(t.hours).toBe(Math.round(((expected * PACE.defaultMinutes) / 60) * 10) / 10);
  });

  it("handles an empty roster and invalid minutes", () => {
    expect(rosterTotals([], 30)).toEqual({ sites: 0, articles: 0, minutes: 0, hours: 0 });
    const t = rosterTotals([{ id: "a", name: "A", pace: 7 }], null);
    expect(t.articles).toBe(siteMonth(7));
    expect(t.minutes).toBeNull();
    expect(t.hours).toBeNull();
  });

  it("accepts whole minutes from 1 to 600 only", () => {
    expect(parseMinutes("30")).toBe(30);
    expect(parseMinutes(" 45 ")).toBe(45);
    expect(parseMinutes("600")).toBe(600);
    for (const bad of ["", "0", "601", "-5", "2.5", "abc", "1000"])
      expect(parseMinutes(bad)).toBeNull();
  });

  it("formats hours to one decimal", () => {
    expect(formatHours(22)).toBe("22");
    expect(formatHours(22.5)).toBe("22.5");
    expect(formatHours(1234)).toBe("1,234");
  });

  it("starts with paces the dashboard offers", () => {
    for (const d of PACE.defaults) expect(PACE_OPTIONS as readonly number[]).toContain(d.pace);
    expect(paceOptionLabel(7)).toBe("Every day");
  });
});

/* ------------------------------------------------------------------ */

describe("brief composer", () => {
  const settings = readFileSync(join(ROUTES, "_authenticated/dashboard.settings.tsx"), "utf8");
  const list = (name: string) => {
    const m = settings.match(new RegExp(`const ${name} = \\[([^\\]]+)\\]`));
    return m ? [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : [];
  };

  it("offers exactly the dashboard's tone and style options", () => {
    expect([...TONES]).toEqual(list("TONES"));
    expect([...STYLES]).toEqual(list("STYLES"));
  });

  it("shows the brief the writer's own composer builds", () => {
    for (const p of VOICE.presets) {
      expect(briefFor(fieldsFrom(p))).toBe(
        composeStyleBrief({
          brand: p.brand,
          product: p.product,
          tone: p.tone,
          style: p.style,
          audience: p.audience,
          voice: p.rules,
        }),
      );
    }
  });

  it("uses a free-text tone or style when 'Your own' is picked", () => {
    const f = { ...fieldsFrom(VOICE.presets[0]), tone: OWN, toneOwn: "Warm but brief" };
    expect(briefFor(f)).toContain("Tone: Warm but brief");
    expect(fieldsFrom({ ...VOICE.presets[0], style: "Q&A" }).style).toBe(OWN);
  });

  it("falls back to the writer's defaults when fields are blank", () => {
    const blank = {
      brand: "",
      product: "",
      tone: OWN,
      toneOwn: "",
      style: OWN,
      styleOwn: "",
      audience: "",
      rules: "",
    };
    const brief = briefFor(blank);
    expect(brief).toContain(`Brand: ${STYLE_DEFAULTS.brand}`);
    expect(brief).toContain(`Tone: ${STYLE_DEFAULTS.tone}`);
    expect(brief).toContain(`Target audience: ${STYLE_DEFAULTS.audience}`);
  });

  it("knows when a sample has been edited", () => {
    const a = fieldsFrom(VOICE.presets[1]);
    expect(sameFields(a, fieldsFrom(VOICE.presets[1]))).toBe(true);
    expect(sameFields({ ...a, brand: "Other" }, a)).toBe(false);
  });
});

/* ------------------------------------------------------------------ */

describe("the ticket's score is the editor's arithmetic", () => {
  // A sample article that passes every check except the meta description,
  // which is the length the ticket names.
  const metaLength = Number(TICKET.openCheck.match(/(\d+) characters/)?.[1]);
  const kw = TICKET.keyword;
  const para =
    "Most kids do well with a checkup twice a year. The dentist looks at each tooth and cleans it. " +
    "Small holes are easy to fix when they are found early. Ask what to do at home between visits.";
  // Each block ends on the keyword once, which keeps the density in range.
  const block = (n: number) =>
    `${Array.from({ length: n }, () => para).join(" ")} So, ${kw}? Twice a year.`;
  const body = [
    `Parents often ask ${kw}. ${block(5)}`,
    `## Why a checkup matters\n\n${block(4)} ${block(4)}`,
    `### What the dentist checks\n\n${block(4)} ${block(3)}`,
    `## The answer by age\n\n- Babies: a first visit by age one.\n- Young kids: twice a year.\n- Teens: twice a year.\n\n${block(4)} ${block(4)}`,
    `### Signs to book sooner\n\n${block(3)} ${block(3)}`,
    `## Frequently asked questions\n\n${block(5)} Read [the age guide](https://sablewood-dental.example/a) and [the visit list](https://sablewood-dental.example/b).`,
  ].join("\n\n");
  const result = analyzeArticle({
    title: TICKET.title,
    keyword: kw,
    description: "x".repeat(metaLength),
    body,
  });

  it("scores the sample the way the ticket says", () => {
    const passed = result.checks.filter((c) => c.status === "pass").length;
    expect(result.checks.length).toBe(TICKET.checks);
    expect(passed).toBe(TICKET.passed);
    expect(result.checks.find((c) => c.id === "meta")?.status).toBe("warn");
    expect(result.score).toBe(TICKET.score);
  });

  it("lists as many checks as the scorer runs", () => {
    expect(CHECKS.auto.length).toBe(result.checks.length);
  });
});

/* ------------------------------------------------------------------ */

function resolves(t: Target): boolean {
  switch (t.kind) {
    case "feature":
      return (FEATURE_SLUGS as readonly string[]).includes(t.slug);
    case "tool":
      return Boolean(getTool(t.slug));
    case "doc":
      return existsSync(join(SRC, "content/docs", t.section, `${t.page}.md`));
    case "static":
      return existsSync(
        join(ROUTES, t.to === "/white-label" ? "white-label.index.tsx" : `${t.to.slice(1)}.tsx`),
      );
    case "sibling":
      return existsSync(join(ROUTES, `${t.href.slice(1).replace(/\//g, ".")}.tsx`));
  }
}

describe("links", () => {
  it("every internal link resolves to a real page", () => {
    const broken = ALL_LINKS.filter((t) => !resolves(t)).map((t) => JSON.stringify(t));
    expect(broken).toEqual([]);
  });

  it("links up to the hub, across to both siblings, and up to /pricing", () => {
    const flat = ALL_LINKS.map((t) => ("href" in t ? t.href : "to" in t ? t.to : ""));
    for (const p of ["/white-label", "/white-label/ai-seo", "/white-label/pricing", "/pricing"]) {
      expect(flat).toContain(p);
    }
  });

  it("links to the three feature pages it must differ from", () => {
    const slugs = ALL_LINKS.filter((t) => t.kind === "feature").map((t) =>
      "slug" in t ? t.slug : "",
    );
    expect(new Set(slugs)).toEqual(
      new Set(["citation-ready-writer", "brand-voice", "seo-geo-score"]),
    );
  });
});

/* ------------------------------------------------------------------ */

describe("claims", () => {
  it("never frames the agency as reselling Rankbox", () => {
    expect(COPY).not.toMatch(/\bresell|\breseller|sublicens/i);
  });

  it("never says one-click, and never promises results", () => {
    expect(COPY).not.toMatch(/one[- ]click/i);
    expect(COPY).not.toMatch(/guarantee|rank (?:#?1|first)|more traffic|double your/i);
  });

  it("never implies human writers or features the docs contradict", () => {
    expect(COPY).not.toMatch(/\bour writers\b|\bwriter network\b/i);
    expect(COPY).not.toMatch(/plagiarism|100\+ languages|trained on/i);
    expect(COPY).not.toMatch(
      /client (?:login|portal|dashboard) (?:is|are) (?:included|available)/i,
    );
  });

  it("says what the line doesn't do", () => {
    expect(COPY).toMatch(/doesn't fact-check/);
    expect(COPY).toMatch(/no approve (?:button|step)/i);
    expect(COPY).toMatch(/clients don't get a login/);
    expect(COPY).toMatch(/no images are generated or sent/);
  });

  it("names the publishing apps as waiting while their flags say so", () => {
    const waiting = PUBLISH_PLATFORMS.filter(
      (p) => ["webflow", "shopify"].includes(p.id) && !p.addonLive,
    );
    if (waiting.length) {
      expect(STATIONS.apps).toMatch(/waiting for marketplace approval/);
      for (const p of waiting) expect(STATIONS.apps).toContain(p.name);
    }
  });

  it("states the trial and Studio sign-up through facts, never startSignup", () => {
    for (const { f, src } of SOURCES) {
      expect(src, f).not.toMatch(/\bstartSignup\(/);
    }
    const button = SOURCES.find((s) => s.f === "StartButton.tsx")!.src;
    expect(button).toMatch(/startStudioSignup\(\)/);
    expect(button).toMatch(/STUDIO_SIGNUP_HREF/);
  });

  it("uses fictional sample clients on .example domains", () => {
    for (const domain of COPY.match(/[a-z0-9-]+\.example\b/g) ?? [])
      expect(domain).toMatch(/\.example$/);
    // Real domains appear only as the cited sources' URLs.
    expect(COPY.replace(/https:\/\/\S+/g, "")).not.toMatch(/\.(?:com|net|io|co)\b/);
    expect(COPY).not.toMatch(/Plannora|Fernwood|Taskwren/);
    for (const p of VOICE.presets) expect(p.domain).toMatch(/\.example$/);
  });
});

/* ------------------------------------------------------------------ */

describe("page shape", () => {
  it("renders a section for every OUTLINE entry", () => {
    const all = SOURCES.map((s) => s.src).join("\n");
    for (const s of OUTLINE) expect(all, s.id).toContain(`id="${s.id}"`);
  });

  it("has a title and H1 with the query written as searched", () => {
    expect(META.h1.toLowerCase()).toContain(META.query);
    expect(META.title.toLowerCase()).toContain(META.query);
  });

  it("asks nine questions of its own, each answered", () => {
    expect(FAQS.length).toBe(9);
    for (const f of FAQS) {
      expect(f.q.trim().endsWith("?")).toBe(true);
      expect(f.a.length).toBeGreaterThan(80);
    }
  });

  it("copies the editor checklist as one box per line", () => {
    const text = checklistText().split("\n");
    expect(text[0]).toBe(CHECKS.copyTitle);
    expect(text.slice(2)).toEqual(CHECKS.editor.map((e) => `[ ] ${e}`));
  });
});
