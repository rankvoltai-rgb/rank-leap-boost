/**
 * What's specific to /white-label/ai-seo: the scope sheet adds up and keeps
 * Rankbox off the client's copy, the planner's arithmetic, every link lands on
 * a real page, every outside fact has a dated primary source, and nothing
 * claims tracking, a guarantee, a plugin that hasn't shipped, or reselling.
 * The shared rules (imports, uniqueness, voice) live in sublanding.test.ts.
 */
import { describe, expect, it, vi } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LIVE_ADDONS, PLAN, SHIPPED, STUDIO, formatUsd } from "@/sublanding/_shared/facts";
import { getTool } from "@/data/tools";
import { getFeature } from "@/data/features";
import { ENGINES, getEngine } from "@/data/ai-seo/engines";
import { isBlogPathLive, isLive } from "@/lib/blog-release";
import * as CONTENT from "./content";
import {
  CHECKED_ON,
  CLOSING,
  ENGINE_NOTES,
  EXPLAIN,
  FAQS,
  META,
  MORE,
  OTHER_ENGINES,
  OUTLINE,
  PATH,
  PLANNER,
  PROSPECT,
  REPORTING,
  SCOPE,
  SCOPE_LINES,
  SOURCES,
  countByDoer,
  scopeSummary,
  type Target,
} from "./content";
import { hrefOf } from "./PageLink";
import { formatCount, planPromptCheck, readWhole } from "./planner";
import { ScopeSheet } from "./ScopeSheet";
import { openings, readError } from "./ProspectCheck";

// Render links as plain anchors: the sheet is rendered here without a router.
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    Link: ({ to, params: _p, children, ...rest }: Record<string, unknown>) =>
      createElement("a", { href: to as string, ...rest }, children as never),
  };
});

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(HERE, "../../..");
const ROUTES = join(SRC, "routes");

/** Every string a value holds, flattened. */
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}
const COPY = strings(CONTENT);

/** Every Target the copy holds, found by shape. */
function targets(value: unknown): Target[] {
  if (Array.isArray(value)) return value.flatMap(targets);
  if (value && typeof value === "object") {
    const v = value as Record<string, unknown>;
    if (
      typeof v.kind === "string" &&
      ("to" in v || "slug" in v || "id" in v) &&
      Object.keys(v).length <= 2
    )
      return [v as unknown as Target];
    return Object.values(v).flatMap(targets);
  }
  return [];
}

const TSX = readdirSync(HERE)
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => readFileSync(join(HERE, f), "utf8"))
  .join("\n");

/* ------------------------------------------------------------------ */

describe("meta and outline", () => {
  it("puts the primary query in the title and the H1", () => {
    expect(META.query).toBe("white label ai seo");
    expect(META.keywords[0]).toBe(META.query);
    expect(META.title.toLowerCase()).toContain(META.query);
    expect(META.h1.toLowerCase()).toContain(META.query);
    expect(META.title.length).toBeLessThanOrEqual(65);
    expect(META.description.length).toBeGreaterThanOrEqual(110);
    expect(META.description.length).toBeLessThanOrEqual(165);
  });

  it("renders every OUTLINE section once, with its id and its H2", () => {
    const ids = OUTLINE.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(TSX, `a section has id="${id}"`).toContain(`id="${id}"`);
      const viaHeading = new RegExp(`<Heading\\s+id="${id}"`).test(TSX);
      const direct = TSX.includes(`h2("${id}")`);
      expect(viaHeading || direct, `section "${id}" renders its H2`).toBe(true);
    }
  });

  it("has the thin route file for its path", () => {
    const file = join(ROUTES, "white-label.ai-seo.tsx");
    expect(existsSync(file)).toBe(true);
    expect(readFileSync(file, "utf8")).toContain(`createFileRoute("${PATH}")`);
  });
});

/* ------------------------------------------------------------------ */

describe("the scope sheet", () => {
  it("has unique lines, at least one per cadence", () => {
    const ids = SCOPE_LINES.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(SCOPE_LINES.some((l) => l.cadence === "once")).toBe(true);
    expect(SCOPE_LINES.some((l) => l.cadence === "monthly")).toBe(true);
  });

  it("counts doers from the lines, and the summary matches them", () => {
    const c = countByDoer(SCOPE_LINES);
    expect(c.rankbox + c.team + c.developer).toBe(SCOPE_LINES.length);
    const summary = scopeSummary(SCOPE_LINES);
    expect(summary).toContain(`Rankbox runs ${c.rankbox} of ${SCOPE_LINES.length} lines`);
    expect(summary).toContain(`Your team runs ${c.team}`);
    // Lines run with a free tool are your team's, and link to that tool.
    for (const l of SCOPE_LINES.filter((x) => x.withTool)) {
      expect(l.doer, l.id).toBe("team");
      expect(l.link?.target.kind, l.id).toBe("tool");
    }
    // The summary names research, writing and scoring: those must be Rankbox's lines.
    const rankbox = SCOPE_LINES.filter((l) => l.doer === "rankbox").map((l) => l.id);
    expect(rankbox.sort()).toEqual(["articles", "questions", "score"]);
    expect(c.developer).toBe(1);
  });

  it("keeps Rankbox out of the client's copy and the client's letterhead", () => {
    for (const l of SCOPE_LINES) {
      expect(l.title, l.id).not.toMatch(/rankbox/i);
      expect(l.client, l.id).not.toMatch(/rankbox/i);
    }
    expect(strings(SCOPE.sheet).join(" ")).not.toMatch(/rankbox/i);
    expect(SCOPE.footer.client).not.toMatch(/rankbox/i);
    expect(strings(SCOPE.clientOwner).join(" ")).not.toMatch(/rankbox/i);
  });

  it("states the article allowance from the plan", () => {
    const articles = SCOPE_LINES.find((l) => l.id === "articles")!;
    expect(articles.client).toContain(`Up to ${PLAN.articlesPerMonth} `);
  });

  it("describes publishing by what has shipped, never as one-click", () => {
    const connect = SCOPE_LINES.find((l) => l.id === "connect")!;
    if (LIVE_ADDONS.length === 0) {
      expect(connect.how).toMatch(/publishing API/);
      expect(connect.how).toMatch(/None of the CMS add-ons is live yet/);
    } else {
      for (const name of LIVE_ADDONS) expect(connect.how).toContain(name);
    }
  });

  it("renders both readings into the server HTML, the inactive one hidden", () => {
    const client = renderToStaticMarkup(createElement(ScopeSheet, { view: "client" }));
    const who = renderToStaticMarkup(createElement(ScopeSheet, { view: "who" }));
    for (const l of SCOPE_LINES) {
      expect(client).toContain(l.title);
      expect(who).toContain(l.title);
    }
    // The owner chip reads as the agency for the client, as the real doer behind it.
    expect(client).toContain(SCOPE.clientOwner.agency);
    expect(who).toContain(SCOPE.doers.rankbox);
    expect(client).toContain(SCOPE.footer.client);
    expect(who).toContain(SCOPE.footer.who);
  });

  it("labels the sample as fictional, on an .example domain", () => {
    expect(SCOPE.sheet.domain).toMatch(/\.example$/);
    expect(SCOPE.caption).toMatch(/fictional/);
  });
});

/* ------------------------------------------------------------------ */

describe("the prompt-check planner", () => {
  it("multiplies questions, engines and runs, then clients", () => {
    const p = planPromptCheck({ sites: 5, prompts: 20, engines: 3, runs: 2, minutes: 1 });
    expect(p.perClient).toBe(120);
    expect(p.total).toBe(600);
    expect(p.hours).toBe(10);
  });

  it("rounds hours to one decimal place", () => {
    const p = planPromptCheck({ sites: 1, prompts: 7, engines: 1, runs: 1, minutes: 1 });
    expect(p.hours).toBe(0.1);
    expect(planPromptCheck({ sites: 1, prompts: 10, engines: 1, runs: 1, minutes: 1 }).hours).toBe(
      0.2,
    );
  });

  it("accepts only whole numbers inside each field's range", () => {
    expect(readWhole("12", 1, 100)).toBe(12);
    expect(readWhole(" 3 ", 1, 10)).toBe(3);
    expect(readWhole("", 1, 10)).toBeNull();
    expect(readWhole("0", 1, 10)).toBeNull();
    expect(readWhole("11", 1, 10)).toBeNull();
    expect(readWhole("2.5", 1, 10)).toBeNull();
    expect(readWhole("-1", 1, 10)).toBeNull();
    expect(readWhole("abc", 1, 10)).toBeNull();
  });

  it("starts inside its own ranges, with engines picked from its own list", () => {
    for (const f of Object.values(PLANNER.fields)) {
      expect(f.initial).toBeGreaterThanOrEqual(f.min);
      expect(f.initial).toBeLessThanOrEqual(f.max);
    }
    const ids = PLANNER.engines.map((e) => e.id);
    for (const e of PLANNER.initialEngines) expect(ids).toContain(e);
  });

  it("formats counts for display", () => {
    expect(formatCount(1234)).toBe("1,234");
    expect(formatCount(2.5)).toBe("2.5");
    expect(PLANNER.formula(20, 1, 1)).toBe("20 questions × 1 engine × 1 run");
  });

  it("never turns the check into money (that's the pricing page's job)", () => {
    expect(strings(PLANNER).join(" ")).not.toMatch(/\$|price|cost|margin/i);
  });
});

/* ------------------------------------------------------------------ */

describe("the prospect check", () => {
  const report = {
    url: "plotbright.example",
    finalUrl: "https://plotbright.example/",
    score: 52,
    passed: 6,
    checks: [
      { id: "a", status: "pass" as const, label: "ok" },
      { id: "b", status: "warn" as const, label: "warn one", fix: "w" },
      { id: "c", status: "fail" as const, label: "fail one", fix: "f" },
      { id: "d", status: "info" as const, label: "training" },
      { id: "e", status: "fail" as const, label: "fail two" },
      { id: "f", status: "warn" as const, label: "warn two" },
    ],
    snapshot: {
      title: "",
      description: "",
      h1s: [],
      canonical: "",
      schemaTypes: [],
      wordCount: 0,
      llmsTxt: false,
      robotsFound: true,
      bots: [{ token: "OAI-SearchBot", allowed: false }],
    },
  };

  it("puts failures before warnings and stops at three", () => {
    expect(openings(report).map((c) => c.id)).toEqual(["c", "e", "b"]);
  });

  it("names blocked crawlers in the headline, and reads the score otherwise", () => {
    expect(PROSPECT.headline(52, ["OAI-SearchBot"])).toMatch(/^robots\.txt blocks OAI-SearchBot\./);
    expect(PROSPECT.headline(90, [])).not.toMatch(/blocks/);
    expect(PROSPECT.headline(40, [])).not.toBe(PROSPECT.headline(70, []));
  });

  it("shows a plain message for validation dumps and empty errors", () => {
    expect(readError(new Error('[{"code":"too_small"}]'))).toBe(PROSPECT.error);
    expect(readError("nope")).toBe(PROSPECT.error);
    expect(readError(new Error("Couldn't reach that URL."))).toBe("Couldn't reach that URL.");
  });

  it("calls the real readiness check, not a mock", () => {
    const src = readFileSync(join(HERE, "ProspectCheck.tsx"), "utf8");
    expect(src).toMatch(/useServerFn\(checkAiReadiness\)/);
  });
});

/* ------------------------------------------------------------------ */

describe("links", () => {
  const all = targets(CONTENT);
  const ROUTE_FILE: Record<string, string> = {
    "/white-label": "white-label.index.tsx",
    "/white-label/content-writing": "white-label.content-writing.tsx",
    "/white-label/pricing": "white-label.pricing.tsx",
    "/pricing": "pricing.tsx",
    "/ai-seo": "ai-seo.index.tsx",
    "/tools": "tools.index.tsx",
    "/solutions/autonomous-geo": "solutions.autonomous-geo.tsx",
  };
  const SIBLINGS = ["/white-label/content-writing", "/white-label/pricing"];

  it("finds the copy's links", () => {
    expect(all.length).toBeGreaterThan(10);
  });

  it("resolves every link to a real page", () => {
    for (const t of all) {
      switch (t.kind) {
        case "page":
          expect(existsSync(join(ROUTES, ROUTE_FILE[t.to] ?? "missing")), t.to).toBe(true);
          break;
        case "tool":
          expect(getTool(t.slug), t.slug).toBeTruthy();
          break;
        case "feature":
          expect(getFeature(t.slug), t.slug).toBeTruthy();
          break;
        case "engine":
          expect(getEngine(t.slug), t.slug).toBeTruthy();
          break;
        case "blog": {
          const file = join(SRC, "content/blog", `${t.slug}.md`);
          expect(existsSync(file), t.slug).toBe(true);
          const date = /^date:\s*(\S+)/m.exec(readFileSync(file, "utf8"))?.[1];
          expect(isLive(date, CHECKED_ON, false), `${t.slug} is live`).toBe(true);
          expect(
            isBlogPathLive(`/blog/${t.slug}`, CHECKED_ON, false),
            `${t.slug} is scheduled live`,
          ).toBe(true);
          break;
        }
        case "anchor":
          expect(OUTLINE.map((s) => s.id) as string[]).toContain(t.id);
          break;
      }
    }
  });

  it("links up to the hub and across to both sibling pages", () => {
    const hrefs = all.map(hrefOf);
    expect(hrefs).toContain("/white-label");
    for (const s of SIBLINGS) expect(hrefs).toContain(s);
    expect(hrefs).toContain("/pricing");
    expect(hrefs).toContain("/ai-seo");
    expect(hrefs).toContain("/solutions/autonomous-geo");
    expect(hrefs).toContain("/features/answer-space-research");
  });

  it("covers every engine guide: a row each for six, a chip for the rest", () => {
    const rows = ENGINE_NOTES.rows.map((r) => r.slug);
    expect(new Set([...rows, ...OTHER_ENGINES.map((e) => e.slug)]).size).toBe(ENGINES.length);
    expect(MORE.items.find((i) => hrefOf(i.target) === "/ai-seo")!.blurb).toContain(
      String(ENGINES.length),
    );
  });
});

/* ------------------------------------------------------------------ */

describe("sources", () => {
  it("are primary, https and dated today's check", () => {
    for (const [id, s] of Object.entries(SOURCES)) {
      expect(s.url, id).toMatch(/^https:\/\//);
      expect(s.checked, id).toBe(CHECKED_ON);
      expect(s.url, id).not.toMatch(/rankbox/);
    }
  });

  it("back every meeting answer that states an outside fact", () => {
    for (const item of EXPLAIN.items) {
      if (!/OpenAI|SparkToro|Google/.test(item.a)) continue;
      const backed = ("source" in item && item.source) || ("link" in item && item.link);
      expect(backed, item.q).toBeTruthy();
    }
  });

  it("back every engine row and every vendor report", () => {
    for (const r of ENGINE_NOTES.rows) expect(r.sources.length, r.slug).toBeGreaterThan(0);
    for (const s of REPORTING.sources) {
      const backed = ("source" in s && s.source) || ("link" in s && s.link);
      expect(backed, s.id).toBeTruthy();
    }
  });
});

/* ------------------------------------------------------------------ */

describe("claims", () => {
  const text = COPY.join("\n");

  it("never promises or guarantees a citation", () => {
    const hits = COPY.filter((t) => /guarantee|promise/i.test(t))
      .filter((t) => !t.trim().endsWith("?"))
      .filter((t) => !/\b(no|not|n't|never|nobody|no one|shouldn't|wary)\b/i.test(t));
    expect(hits).toEqual([]);
  });

  it("frames the agency as selling its own service, never reselling Rankbox", () => {
    expect(text).not.toMatch(/resell|reseller|sublicens/i);
  });

  it("never says one-click", () => {
    expect(text).not.toMatch(/one[- ]click/i);
  });

  it("promises no client logins, branded reports or custom dashboards", () => {
    expect(SHIPPED.teamInvites).toBe(false);
    expect(text).not.toMatch(/client (login|portal|dashboard)s? (is|are) (included|available)/i);
    expect(text).not.toMatch(/white[- ]label(ed)? (reports?|dashboard)/i);
    expect(text).not.toMatch(/custom (dashboard )?domain/i);
  });

  it("says plainly that Rankbox doesn't track citations while it can't", () => {
    if (SHIPPED.citationTracking) return;
    expect(REPORTING.intro).toMatch(/doesn't track citations/);
    expect(FAQS.some((f) => /^Not yet\./.test(f.a))).toBe(true);
  });

  it("never promises daily unattended publishing", () => {
    expect(text).not.toMatch(/every day, automatically|publishes daily|daily on autopilot/i);
  });

  it("gets the Studio price from facts, and uses Studio sign-up for every action", () => {
    expect(CLOSING.body).toContain(formatUsd(STUDIO.monthlyPerSite));
    expect(TSX).toContain("startStudioSignup");
    expect(TSX).not.toMatch(/\bstartSignup\(/);
  });

  it("uses only fictional sample names", () => {
    expect(text).not.toMatch(/Plannora|Fernwood|Taskwren/);
  });
});
