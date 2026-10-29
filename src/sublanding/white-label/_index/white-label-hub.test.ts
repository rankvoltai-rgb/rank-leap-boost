/**
 * What's specific to /white-label, the program hub: the query sits in the
 * title and H1, every link lands on a real page, every claim follows SHIPPED
 * and addonLive, the sample data adds up, the runbook copies every step, and
 * nothing frames the program as reselling Rankbox (Terms §6, Acceptable Use).
 * The shared rules (imports, uniqueness, voice) live in sublanding.test.ts.
 */
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PLAN, SHIPPED, STUDIO, STUDIO_SIGNUP_HREF, formatUsd } from "@/sublanding/_shared/facts";
import { PUBLISH_PLATFORMS } from "@/data/platforms";
import { INTEGRATION_SLUGS } from "@/data/integrations";
import * as CONTENT from "./content";
import {
  APPS_AWAITING,
  BILLING,
  BYLINE,
  CHECKED_ON,
  CONTROL,
  DEEP,
  FAQS,
  FIT,
  GAPS,
  JOURNEY,
  META,
  MODEL,
  OUTLINE,
  PATH,
  RUNBOOK,
  SITE_PRICE,
  SOURCES,
} from "./content";
import { LINKED } from "./Page";
import { rankboxVisible } from "./visibility";
import { runbookText } from "./runbook-text";
import { Diorama, articlesLeft } from "./Diorama";
import { TwoSides, slugOf } from "./TwoSides";
import { Journey } from "./Journey";
import { Split } from "./Split";
import { Fit } from "./Fit";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(HERE, "../../..");
const ROUTES = join(SRC, "routes");

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}
const COPY = strings(CONTENT);
const SOURCE_FILES = readdirSync(HERE)
  .filter((f) => /\.tsx?$/.test(f) && !f.endsWith(".test.ts"))
  .map((f) => ({ f, src: readFileSync(join(HERE, f), "utf8") }));

const spaced = (t: string) => t.toLowerCase().replace(/-/g, " ");

/* ------------------------------------------------------------------ */

describe("meta", () => {
  it("puts the query in the title and the H1, hyphen or not", () => {
    expect(META.keywords[0]).toBe(META.query);
    expect(spaced(META.title)).toContain(META.query);
    expect(spaced(META.h1)).toContain(META.query);
    expect(META.title.length).toBeLessThanOrEqual(65);
    expect(META.description.length).toBeGreaterThanOrEqual(110);
    expect(META.description.length).toBeLessThanOrEqual(165);
  });

  it("states the per-site price from STUDIO, never typed", () => {
    expect(SITE_PRICE).toBe(formatUsd(STUDIO.monthlyPerSite));
    expect(META.description).toContain(SITE_PRICE);
    expect(BILLING.figure).toBe(SITE_PRICE);
  });

  it("renders a section for every OUTLINE entry, each once", () => {
    const ids = OUTLINE.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    const all = SOURCE_FILES.map((s) => s.src).join("\n");
    for (const id of ids) {
      expect(all.match(new RegExp(`<section\\s+id="${id}"`, "g"))?.length ?? 0, id).toBe(1);
    }
  });
});

/* ------------------------------------------------------------------ */

/** Does an internal path resolve to a route or a page this repo serves? */
function resolves(path: string): boolean {
  const clean = path.split("#")[0].split("?")[0];
  if (clean === "/") return existsSync(join(ROUTES, "index.tsx"));
  const parts = clean.split("/").filter(Boolean);
  const flat = join(ROUTES, `${parts.join(".")}.tsx`);
  const index = join(ROUTES, `${parts.join(".")}.index.tsx`);
  if (existsSync(flat) || existsSync(index)) return true;
  if (parts[0] === "docs" && parts.length === 3) {
    return existsSync(join(SRC, "content/docs", parts[1], `${parts[2]}.md`));
  }
  if (parts[0] === "integrations" && parts.length === 2)
    return INTEGRATION_SLUGS.includes(parts[1]);
  return false;
}

describe("links", () => {
  const fromSource = SOURCE_FILES.flatMap(({ src }) =>
    [...src.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1]),
  );
  const fromContent = [
    ...DEEP.pages.map((p) => p.href),
    ...GAPS.rows.flatMap((g) => (g.link ? [g.link.href] : [])),
  ];
  const all = [...new Set([...fromSource, ...fromContent, ...LINKED])];

  it("finds the links it means to check", () => {
    expect(all).toEqual(
      expect.arrayContaining(["/pricing", "/docs/account/studio", "/legal/terms"]),
    );
  });

  for (const href of all) {
    it(`${href} resolves to a real page`, () => {
      expect(resolves(href), href).toBe(true);
    });
  }

  it("links down to all three deep dives and up to /pricing", () => {
    expect(DEEP.pages.map((p) => p.href).sort()).toEqual([
      "/white-label/ai-seo",
      "/white-label/content-writing",
      "/white-label/pricing",
    ]);
    expect(LINKED).toContain("/pricing");
  });

  it("has every outside source dated and on https", () => {
    for (const s of SOURCES) {
      expect(s.url).toMatch(/^https:\/\//);
      expect(s.checked).toBe(CHECKED_ON);
    }
  });

  it("keeps the one quotation under 15 words", () => {
    expect(CONTROL.duty.quote.split(/\s+/).length).toBeLessThan(15);
  });
});

/* ------------------------------------------------------------------ */

describe("calls to action", () => {
  it("signs agencies up for Studio, never the plain signup", () => {
    const all = SOURCE_FILES.map((s) => s.src).join("\n");
    expect(all).not.toMatch(/\bstartSignup\(/);
    const button = SOURCE_FILES.find((s) => s.f === "StudioButton.tsx")!.src;
    expect(button).toContain("startStudioSignup()");
    expect(button).toContain("href={STUDIO_SIGNUP_HREF}");
    expect(STUDIO_SIGNUP_HREF).toBe("/auth?intent=studio");
  });

  it("fills CTAs with the blue, never ink", () => {
    const all = SOURCE_FILES.map((s) => s.src).join("\n");
    expect(all).not.toMatch(/\bbg-ink\b(?!\/)/);
    expect(all).not.toMatch(/#[0-9a-f]{3,8}\b/i);
  });
});

/* ------------------------------------------------------------------ */

describe("claims", () => {
  it("never frames the program as reselling or sublicensing Rankbox", () => {
    expect(COPY.filter((t) => /\bresell|reseller|sublicens/i.test(t))).toEqual([]);
  });

  it("never promises one-click setup or daily unattended publishing", () => {
    expect(COPY.filter((t) => /one[-\s]click|\bdaily\b|every day/i.test(t))).toEqual([]);
  });

  it("mentions client logins, branded reports and custom domains only as missing", () => {
    // The gaps list and the "not the right tool if you need" list are both negative by design.
    const missing = new Set([...GAPS.rows.map((g) => g.missing), ...FIT.notFit.items]);
    const risky = COPY.filter((t) =>
      /client logins?|branded reports?|custom (dashboard )?domain|dashboard on your domain/i.test(
        t,
      ),
    );
    for (const t of risky) {
      const ok = missing.has(t) || /\bno\b|\bnot\b|n't\b|\bwithout\b/i.test(t);
      expect(ok, t).toBe(true);
    }
  });

  it("lists every unshipped piece in the gaps while it stays unshipped", () => {
    const missing = GAPS.rows.map((g) => g.missing).join(" | ");
    if (!SHIPPED.teamInvites) expect(missing).toMatch(/client logins/i);
    if (!SHIPPED.citationTracking) expect(missing).toMatch(/tracking/i);
    expect(missing).toMatch(/branded reports/i);
    expect(missing).toMatch(/full-service seo/i);
  });

  it("names the waiting CMS apps from platforms.ts, and only while they wait", () => {
    const waiting = PUBLISH_PLATFORMS.filter(
      (p) => (p.id === "shopify" || p.id === "webflow") && !p.addonLive,
    ).map((p) => p.name);
    expect(APPS_AWAITING).toEqual(waiting);
    const row = GAPS.rows.find((g) => /CMS apps/.test(g.missing));
    if (waiting.length) expect(row?.instead).toContain("waiting on store approval");
    else expect(row).toBeUndefined();
  });

  it("says where the Rankbox name can show up, and counts it from the steps", () => {
    const { visible, total } = rankboxVisible(JOURNEY.steps);
    expect(total).toBe(JOURNEY.steps.length);
    expect(visible).toBe(1);
    const shown = JOURNEY.steps.filter((s) => s.visibility !== "hidden");
    for (const s of shown) expect(s.sees).toContain("rankbox.xyz");
  });

  it("never says the trial opens Studio", () => {
    const studioTrial = COPY.filter((t) => /trial/i.test(t) && /studio/i.test(t));
    for (const t of studioTrial) {
      expect(t, t).toMatch(/covers (one|your own) site|paid|trial ends/i);
    }
  });

  it("states each site's allowance from PLAN", () => {
    const perSite = MODEL.perSite.join(" ");
    expect(perSite).toContain(`${PLAN.articlesPerMonth} articles`);
    expect(perSite).toContain(`${PLAN.backlinkCreditsPerMonth} backlink credits`);
    expect(perSite).toContain(`${PLAN.redditRepliesPerMonth} Reddit reply credits`);
  });
});

/* ------------------------------------------------------------------ */

describe("sample data", () => {
  const banned = /plannora|fernwood|taskwren/i;

  it("uses invented names on .example domains", () => {
    const domains = [...BYLINE.clients.map((c) => c.domain), ...MODEL.sites.map((s) => s.domain)];
    for (const d of domains) expect(d).toMatch(/\.example$/);
    expect(COPY.filter((t) => banned.test(t))).toEqual([]);
  });

  it("adds up in the dashboard diorama", () => {
    const own = MODEL.sites.filter((s) => s.param === null);
    expect(own).toHaveLength(1);
    const params = MODEL.sites.map((s) => s.param).filter(Boolean);
    expect(new Set(params).size).toBe(params.length);
    for (const s of MODEL.sites) {
      expect(s.published + s.queued, s.name).toBeLessThanOrEqual(PLAN.articlesPerMonth);
      expect(articlesLeft(s), s.name).toBeGreaterThanOrEqual(0);
      expect(s.backlinksLeft).toBeLessThanOrEqual(PLAN.backlinkCreditsPerMonth);
      expect(s.redditLeft).toBeLessThanOrEqual(PLAN.redditRepliesPerMonth);
    }
  });

  it("builds clean slugs for the sample posts", () => {
    for (const c of BYLINE.clients) {
      const slug = slugOf(c.post);
      expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(slug.length).toBeLessThanOrEqual(34);
    }
  });
});

/* ------------------------------------------------------------------ */

describe("runbook", () => {
  const text = runbookText();
  const steps = [...RUNBOOK.once.steps, ...RUNBOOK.each.steps];

  it("copies every step, as a checklist, with its button name", () => {
    expect(text.startsWith(`# ${RUNBOOK.copy.heading}`)).toBe(true);
    const items = text.split("\n").filter((l) => l.startsWith("- [ ] "));
    expect(items).toHaveLength(steps.length);
    for (const s of steps) {
      expect(text).toContain(s.title);
      if (s.ui) expect(text).toContain(`"${s.ui}"`);
    }
  });

  it("names a known owner for every step", () => {
    for (const s of steps) {
      expect(s.owners.length).toBeGreaterThan(0);
      for (const o of s.owners) expect(RUNBOOK.owners[o]).toBeTruthy();
    }
  });
});

/* ------------------------------------------------------------------ */

describe("faq", () => {
  it("has ten distinct questions that don't repeat an H2", () => {
    expect(FAQS).toHaveLength(10);
    const qs = FAQS.map((f) => f.q.toLowerCase());
    expect(new Set(qs).size).toBe(qs.length);
    const h2s = new Set(OUTLINE.map((s) => s.h2.toLowerCase()));
    for (const q of qs) expect(h2s.has(q)).toBe(false);
    for (const f of FAQS) expect(f.q.trim().endsWith("?")).toBe(true);
  });
});

/* ------------------------------------------------------------------ */

describe("server render", () => {
  it("draws the hero picture on its first client, with the three checks", () => {
    const html = renderToStaticMarkup(createElement(TwoSides));
    expect(html).toContain(BYLINE.clients[0].name);
    expect(html).toContain(BYLINE.checks.mentions);
    expect(html).toContain('aria-pressed="true"');
  });

  it("opens the diorama on the plan's own site, with no ?site= in the address", () => {
    const html = renderToStaticMarkup(createElement(Diorama));
    expect(html).toContain(MODEL.sites[0].name);
    expect(html).not.toContain("?site=");
    for (const a of MODEL.account) expect(html).toContain(a.replace("&", "&amp;"));
  });

  it("renders the section headings it owns as h2s", () => {
    for (const [C, id] of [
      [Fit, "fit"],
      [Split, "split"],
      [Journey, "journey"],
    ] as const) {
      const html = renderToStaticMarkup(createElement(C));
      const h2 = OUTLINE.find((s) => s.id === id)!.h2.replace(/'/g, "&#x27;");
      expect(html).toContain(`<h2 id="${id}-title"`);
      expect(html).toContain(h2);
    }
  });
});

it("lives at /white-label", () => {
  expect(PATH).toBe("/white-label");
});
