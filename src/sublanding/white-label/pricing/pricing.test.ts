/**
 * What's specific to /white-label/pricing: the calculator's arithmetic and
 * states, the first-charge example against Studio's own rules, every market
 * figure with a source and a date, every link landing on a real page, and no
 * price, discount or claim the product doesn't back.
 * The shared rules (imports, uniqueness, voice) live in sublanding.test.ts.
 */
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  PLAN,
  PRICE,
  STUDIO,
  STUDIO_SIGNUP_HREF,
  SHIPPED,
  TRIAL_TERMS,
  formatUsd,
} from "@/sublanding/_shared/facts";
import { getFeature } from "@/data/features";
import { monthlyTotal } from "@/lib/studio";
import * as CONTENT from "./content";
import {
  ARTICLE_WORDS_MIN,
  BILLING,
  CHECKED_ON,
  CLOSING,
  FAQS,
  HERO,
  LINKED,
  MARKET,
  META,
  OUTLINE,
  PACKAGING,
  PATH,
  PER_ARTICLE,
  SHEET,
  SITE_PRICE,
} from "./content";
import {
  EXAMPLE_PERIOD_DAYS,
  LIMITS,
  computeMargin,
  firstChargeOnDay,
  parseAmount,
  perArticleCost,
  readCalculator,
  studioSitesFor,
  type CalcField,
} from "./calc";
import { CostSheet } from "./CostSheet";
import { FirstCharge } from "./FirstCharge";
import { MarginCalculator } from "./MarginCalculator";
import { MarketRates } from "./MarketRates";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(HERE, "../../..");

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}
const COPY = strings(CONTENT);
const SOURCE = readdirSync(HERE)
  .filter((f) => /\.tsx?$/.test(f) && !f.endsWith(".test.ts"))
  .map((f) => readFileSync(join(HERE, f), "utf8"))
  .join("\n");

const blank: Record<CalcField, string> = {
  retainer: "",
  setupFee: "",
  hours: "",
  rate: "",
  setupHours: "",
};

/* ------------------------------------------------------------------ */

describe("meta and outline", () => {
  it("puts the primary query in the title and the H1", () => {
    expect(META.keywords[0]).toBe(META.query);
    expect(META.title.toLowerCase()).toContain(META.query);
    expect(META.h1.toLowerCase()).toContain(META.query);
    expect(META.title.length).toBeLessThanOrEqual(65);
    expect(META.description.length).toBeGreaterThanOrEqual(110);
    expect(META.description.length).toBeLessThanOrEqual(165);
  });

  it("renders every OUTLINE section once, with its own H2", () => {
    const ids = OUTLINE.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      // Whitespace-tolerant: the formatter may break props onto their own lines.
      expect(SOURCE, `a section has id="${id}"`).toMatch(new RegExp(`<Section\\s+id="${id}"`));
      expect(SOURCE, `a section renders SectionTitle id="${id}"`).toContain(
        `SectionTitle id="${id}"`,
      );
    }
  });

  it("answers the question in plain text near the top", () => {
    expect(HERO.answer).toContain(SITE_PRICE);
    expect(HERO.answer).toContain(PRICE);
    expect(HERO.answer.split(/\s+/).length).toBeLessThan(90);
  });
});

/* ------------------------------------------------------------------ */

describe("the margin calculator", () => {
  it("needs a Studio site per client, one fewer when a client takes the plan's site", () => {
    expect(studioSitesFor(3, "agency")).toBe(3);
    expect(studioSitesFor(3, "client")).toBe(2);
    expect(studioSitesFor(1, "client")).toBe(0);
  });

  it("bills the plan plus every Studio site, the way Studio does", () => {
    for (const clients of [1, 2, 5, 40]) {
      for (const planSite of ["agency", "client"] as const) {
        const r = computeMargin({
          clients,
          planSite,
          retainer: null,
          hoursPerClient: 0,
          hourlyCost: 0,
          setupFee: 0,
          setupHours: 0,
        });
        const sites = planSite === "agency" ? clients : clients - 1;
        expect(r.rankboxBill).toBe(monthlyTotal(sites));
        expect(r.rankboxBill).toBeCloseTo(PLAN.monthly + STUDIO.monthlyPerSite * sites, 2);
      }
    }
  });

  it("has no volume discount: each extra client adds exactly the per-site price", () => {
    const bill = (n: number) =>
      computeMargin({
        clients: n,
        planSite: "agency",
        retainer: null,
        hoursPerClient: 0,
        hourlyCost: 0,
        setupFee: 0,
        setupHours: 0,
      }).rankboxBill;
    for (let n = 1; n < 60; n++)
      expect(bill(n + 1) - bill(n)).toBeCloseTo(STUDIO.monthlyPerSite, 2);
  });

  it("works out margin, percentage and break-even from the visitor's own numbers", () => {
    const input = {
      clients: 4,
      planSite: "agency" as const,
      retainer: 900,
      hoursPerClient: 3,
      hourlyCost: 40,
      setupFee: 500,
      setupHours: 6,
    };
    const r = computeMargin(input);
    const bill = PLAN.monthly + STUDIO.monthlyPerSite * 4;
    const time = 4 * 3 * 40;
    expect(r.teamTime).toBe(time);
    expect(r.revenue).toBe(3600);
    expect(r.margin).toBeCloseTo(3600 - bill - time, 2);
    expect(r.marginPct).toBeCloseTo(Math.round(((3600 - bill - time) / 3600) * 1000) / 10, 5);
    expect(r.setupTimeCost).toBe(240);
    expect(r.setupNet).toBe(260);
    // Charging the break-even covers every cost; a cent less doesn't.
    expect(r.breakEven * 4).toBeGreaterThanOrEqual(r.totalCost - 1e-9);
    expect((r.breakEven - 0.01) * 4).toBeLessThan(r.totalCost);
  });

  it("parses what people type, and names what's wrong", () => {
    expect(parseAmount("", 100)).toEqual({ value: null, error: null });
    expect(parseAmount("$1,200", 5000).value).toBe(1200);
    expect(parseAmount(" 12.5 ", 100).value).toBe(12.5);
    expect(parseAmount(".5", 100).value).toBe(0.5);
    expect(parseAmount("abc", 100).error).toBe("nan");
    expect(parseAmount("1.2.3", 100).error).toBe("nan");
    expect(parseAmount("-5", 100).error).toBe("negative");
    expect(parseAmount("101", 100).error).toBe("tooBig");
  });

  it("moves through empty, priced, loss and error states", () => {
    expect(readCalculator("3", "agency", blank).status).toBe("empty");
    const empty = readCalculator("3", "agency", blank);
    expect(empty.result?.breakEven).toBeGreaterThan(0);
    expect(empty.result?.margin).toBeNull();

    const high = Math.ceil(STUDIO.monthlyPerSite * 4);
    expect(readCalculator("3", "agency", { ...blank, retainer: String(high) }).status).toBe(
      "priced",
    );
    expect(readCalculator("3", "agency", { ...blank, retainer: "1" }).status).toBe("loss");

    expect(readCalculator("0", "agency", blank).status).toBe("error");
    expect(readCalculator(String(LIMITS.clients.max + 1), "agency", blank).status).toBe("error");
    expect(readCalculator("two", "agency", blank).status).toBe("error");
    const bad = readCalculator("3", "agency", { ...blank, rate: "lots" });
    expect(bad.status).toBe("error");
    expect(bad.errors.rate).toBe("nan");
    expect(bad.result).toBeNull();
  });

  it("starts blank on the price, so the page never suggests one", () => {
    const html = renderToStaticMarkup(createElement(MarginCalculator));
    expect(html).toContain(CONTENT.MARGIN.results.empty);
    expect(html).toContain(formatUsd(monthlyTotal(3)));
    // No pre-filled money inputs: every amount field renders empty.
    const values = [...html.matchAll(/<input[^>]*inputMode="decimal"[^>]*value="([^"]*)"/g)].map(
      (m) => m[1],
    );
    expect(values.length).toBe(5);
    expect(values.every((v) => v === "")).toBe(true);
  });
});

/* ------------------------------------------------------------------ */

describe("Rankbox's numbers", () => {
  it("prices the cost sheet from pricing.ts", () => {
    expect(SITE_PRICE).toBe(formatUsd(STUDIO.monthlyPerSite));
    expect(perArticleCost()).toBeCloseTo(STUDIO.monthlyPerSite / PLAN.articlesPerMonth, 2);
    const html = renderToStaticMarkup(createElement(CostSheet));
    expect(html).toContain(SITE_PRICE);
    expect(html).toContain(PER_ARTICLE);
    for (const n of [
      PLAN.articlesPerMonth,
      PLAN.backlinkCreditsPerMonth,
      PLAN.redditRepliesPerMonth,
    ]) {
      expect(SHEET.included.some((i) => i.startsWith(`${n} `))).toBe(true);
    }
  });

  it("only writes dollar amounts that come from pricing.ts or a cited source", () => {
    const allowed = new Set([PRICE, SITE_PRICE, PER_ARTICLE]);
    const outsideSources = strings([
      CONTENT.HERO.sub,
      CONTENT.SHEET,
      CONTENT.MARGIN,
      CONTENT.PACKAGING,
      CONTENT.BILLING,
      CONTENT.CLOSING,
      FAQS,
      META,
    ]);
    const typed = outsideSources.flatMap((t) => t.match(/\$[\d,]+(?:\.\d+)?/g) ?? []);
    expect(typed.filter((d) => !allowed.has(d))).toEqual([]);
    // The hero's one market figure is the SE Ranking band the chart shows.
    expect(HERO.answer).toContain("SE Ranking");
    expect(MARKET.chart.bands[0].share + MARKET.chart.bands[1].share).toBe(64);
  });

  it("states the trial from facts and never promises a discount, a reseller deal or one-click setup", () => {
    expect(HERO.note).toContain(TRIAL_TERMS);
    expect(CLOSING.note).toBe(TRIAL_TERMS);
    for (const t of COPY) {
      expect(t, t).not.toMatch(/resell|reseller|sublicens|one-click|partner tier|commission/i);
      expect(t, t).not.toMatch(/\b\d+% off\b|discounted/i);
    }
    expect(FAQS[0].a).toMatch(/no tiers, partner prices or volume discounts/);
  });

  it("only mentions client logins and reports as things that aren't included", () => {
    const hits = COPY.filter((t) => /client logins?|branded reports?/i.test(t));
    expect(hits).toEqual(PACKAGING.notCovered.items.filter((t) => /client logins?/i.test(t)));
    expect(SHIPPED.teamInvites).toBe(false);
  });

  it("signs agencies up to Studio, never the single-site signup", () => {
    expect(SOURCE).toContain("startStudioSignup");
    expect(SOURCE).toContain("STUDIO_SIGNUP_HREF");
    expect(SOURCE).not.toMatch(/\bstartSignup\(/);
    expect(STUDIO_SIGNUP_HREF).toMatch(/^\/auth\?intent=studio/);
  });
});

/* ------------------------------------------------------------------ */

describe("a new client's first charge", () => {
  it("charges the full price and allowance on the renewal day", () => {
    const c = firstChargeOnDay(1);
    expect(c.share).toBe(1);
    expect(c.dueToday).toBe(STUDIO.monthlyPerSite);
    expect(c.allowance.articles).toBe(PLAN.articlesPerMonth);
  });

  it("matches the docs' half-period example", () => {
    const c = firstChargeOnDay(EXAMPLE_PERIOD_DAYS / 2 + 1);
    expect(c.share).toBeCloseTo(0.5, 6);
    expect(c.allowance.articles).toBe(Math.ceil(PLAN.articlesPerMonth / 2));
    expect(c.dueToday).toBeCloseTo(STUDIO.monthlyPerSite / 2, 2);
  });

  it("never drops the allowance below one, and charges less each day", () => {
    const last = firstChargeOnDay(EXAMPLE_PERIOD_DAYS);
    expect(last.allowance.articles).toBe(1);
    for (let d = 1; d < EXAMPLE_PERIOD_DAYS; d++) {
      expect(firstChargeOnDay(d + 1).dueToday).toBeLessThan(firstChargeOnDay(d).dueToday);
    }
  });

  it("renders the example with its caveat", () => {
    const html = renderToStaticMarkup(createElement(FirstCharge));
    const c = firstChargeOnDay(Math.ceil(EXAMPLE_PERIOD_DAYS / 2) + 1);
    expect(html).toContain(formatUsd(c.dueToday));
    expect(html).toContain("Stripe prorates to the second");
    expect(BILLING.slider.caveat).toContain(String(EXAMPLE_PERIOD_DAYS));
  });
});

/* ------------------------------------------------------------------ */

describe("market figures", () => {
  it("cites every figure with a published source, a date and the day it was opened", () => {
    expect(CHECKED_ON).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const [y, m, d] = CHECKED_ON.split("-").map(Number);
    const label = new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
    expect(MARKET.opened).toContain(label);
    expect(SHEET.foot).toContain(label);
    const sources = [MARKET.chart.source, ...MARKET.notes.map((n) => n.source)];
    for (const s of sources) {
      expect(s.url).toMatch(/^https:\/\//);
      expect(s.published).toMatch(/\d{4}/);
      expect(s.name.length).toBeGreaterThan(3);
    }
  });

  it("keeps SE Ranking's shares as published, and marks the one worked out", () => {
    const bands = MARKET.chart.bands;
    const total = bands.reduce((n, b) => n + b.share, 0);
    expect(total).toBeGreaterThanOrEqual(98);
    expect(total).toBeLessThanOrEqual(100);
    expect(bands.filter((b) => !b.stated).map((b) => b.band)).toEqual(["$500 to $1,000"]);
    expect(bands.map((b) => b.share)).toEqual([30, 34, 20, 13, 2]);
    expect(MARKET.chart.sample).toMatch(/260 responses/);
  });

  it("works the EFA per-word rates out on Rankbox's shortest article", () => {
    const spec = getFeature("citation-ready-writer")?.specs.find((s) => /words/i.test(s.label));
    expect(spec?.value.startsWith(ARTICLE_WORDS_MIN.toLocaleString("en-US"))).toBe(true);
    const efa = MARKET.notes[2].text;
    expect(efa).toContain(formatUsd(0.25 * ARTICLE_WORDS_MIN));
    expect(efa).toContain(formatUsd(0.45 * ARTICLE_WORDS_MIN));
  });

  it("renders the chart as a real table", () => {
    const html = renderToStaticMarkup(createElement(MarketRates));
    expect(html).toContain("<table");
    for (const b of MARKET.chart.bands) {
      expect(html).toContain(b.band.replace("$", "$"));
      expect(html).toContain(`${b.share}%`);
    }
  });
});

/* ------------------------------------------------------------------ */

/** A path → the file that serves it. */
function servedBy(path: string): string | null {
  const docs = path.match(/^\/docs\/([a-z0-9-]+)\/([a-z0-9-]+)$/);
  if (docs) return join(SRC, "content/docs", docs[1], `${docs[2]}.md`);
  const parts = path.split("/").filter(Boolean);
  const name =
    parts.length === 1 ? [`${parts[0]}.index.tsx`, `${parts[0]}.tsx`] : [`${parts.join(".")}.tsx`];
  return name.map((n) => join(SRC, "routes", n)).find((f) => existsSync(f)) ?? null;
}

describe("links", () => {
  it("lands every internal link on a real page", () => {
    expect(LINKED.length).toBeGreaterThan(5);
    for (const href of LINKED) {
      const file = servedBy(href);
      expect(file && existsSync(file), `${href} has no route or doc`).toBe(true);
    }
  });

  it("links up to the hub and across to the two other deep dives", () => {
    for (const href of [
      "/white-label",
      "/white-label/content-writing",
      "/white-label/ai-seo",
      "/pricing",
    ]) {
      expect(LINKED).toContain(href);
    }
  });

  it("has its own thin route file", () => {
    const route = readFileSync(join(SRC, "routes/white-label.pricing.tsx"), "utf8");
    expect(route).toContain(`createFileRoute("${PATH}")`);
  });
});
