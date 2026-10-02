/**
 * Rules for /features/auto-publishing. The page used to promise one-click
 * WordPress, Wix, and Framer publishing, a time-of-day schedule, and approval
 * mode, none of which existed. These tests keep every claim tied to what the
 * code does and to the flags that say what has shipped.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getFeature } from "@/data/features";
import { PUBLISH_PLATFORMS } from "@/data/platforms";
import { PLAN } from "@/data/pricing";
import { featureGraph, featureHead } from "@/lib/feature-head";
import {
  ANSWER,
  API_DESTINATION,
  API_ENDPOINTS,
  DESTINATIONS,
  FAQS,
  PACE_OPTIONS,
  PAYLOAD,
  PAYLOAD_NOTE,
} from "./auto-publishing";

const feature = getFeature("auto-publishing")!;

/** Every sentence the page renders from data. */
function pageText(): string[] {
  return [
    feature.tagline,
    feature.eyebrow,
    feature.headline.lead,
    feature.headline.accent,
    feature.subhead,
    feature.metaTitle,
    feature.metaDescription,
    ...feature.specs.flatMap((s) => [s.value, s.label]),
    feature.benefitsTitle,
    feature.benefitsIntro,
    ...feature.benefits.flatMap((b) => [b.title, b.body]),
    feature.stepsTitle,
    ...feature.steps.flatMap((s) => [s.title, s.body]),
    feature.connects,
    ...feature.faqs.flatMap((f) => [f.q, f.a]),
    feature.ctaTitle,
    feature.ctaBody,
    ANSWER.question,
    ANSWER.answer,
    ...DESTINATIONS.flatMap((d) => [d.name, d.status, d.body]),
    ...API_ENDPOINTS.map((e) => e.does),
    ...PAYLOAD.flatMap((r) => [r.field, r.api.note, r.webflow.note, r.shopify.note]),
    PAYLOAD_NOTE,
  ];
}

const sentences = () =>
  pageText()
    .join(" ")
    .split(/(?<=[.?!])\s+/);

/** A sentence about something the publishers don't do must say so. */
const NEGATION = /\b(no|not|never|n't|isn't|aren't|doesn't|don't|yet)\b|n’t/i;

describe("auto-publishing claims", () => {
  it("marks a connector available only when its add-on has shipped", () => {
    for (const p of PUBLISH_PLATFORMS) {
      const d = DESTINATIONS.find((x) => x.id === p.id);
      expect(d, p.id).toBeDefined();
      expect(d!.stage === "available", p.id).toBe(p.addonLive);
    }
    expect(API_DESTINATION.stage).toBe("available");
  });

  it("never names a platform the product doesn't publish to", () => {
    for (const t of pageText()) {
      expect(t, t).not.toMatch(/\b(Wix|Ghost|Squarespace|HubSpot|Medium|Notion|webhooks?)\b/i);
    }
  });

  it("makes no promise the publishers can't keep", () => {
    for (const t of pageText()) {
      expect(t, t).not.toMatch(/one-click/i);
      expect(t, t).not.toMatch(/\bno developers?\b|\b0 developers\b/i);
      expect(t, t).not.toMatch(/approval mode/i);
      expect(t, t).not.toMatch(/\b\d{1,2}:\d{2}\b/); // a clock time
      expect(t, t).not.toMatch(/no credit card/i);
      expect(t, t).not.toMatch(/hands-free/i);
    }
  });

  it("only mentions images, structured data, time of day, or approval to say what's missing", () => {
    const topics = /\b(images?|structured data|json-ld|time.of.day|approval queue)\b/i;
    for (const s of sentences()) {
      // Questions claim nothing, and status lines ("awaiting … approval") are
      // about marketplaces, not review.
      if (!topics.test(s) || s.endsWith("?") || /awaiting .* approval/i.test(s)) continue;
      expect(s, s).toMatch(NEGATION);
    }
  });

  it("says images and structured data aren't sent, in every column", () => {
    for (const field of ["Images", "Structured data"]) {
      const row = PAYLOAD.find((r) => r.field === field)!;
      expect(row.api.sent || row.webflow.sent || row.shopify.sent).toBe(false);
    }
  });

  it("offers the dashboard's own paces", () => {
    const settings = readFileSync(
      fileURLToPath(new URL("../routes/_authenticated/dashboard.settings.tsx", import.meta.url)),
      "utf8",
    );
    const match = settings.match(/const PACES = \[([^\]]+)\]/);
    expect(match, "PACES in dashboard.settings.tsx").not.toBeNull();
    expect(match![1].split(",").map((n) => Number(n.trim()))).toEqual([...PACE_OPTIONS]);
  });

  it("states the plan's real article allowance", () => {
    expect(ANSWER.answer).toContain(`${PLAN.articlesPerMonth} a month`);
    expect(feature.specs.some((s) => s.value === String(PLAN.articlesPerMonth))).toBe(true);
  });
});

describe("auto-publishing copy", () => {
  it("avoids filler verbs", () => {
    for (const t of pageText()) {
      expect(t, t).not.toMatch(/\b(unlock|elevate|seamless(ly)?|revolutioni[sz]e)\b/i);
    }
  });

  it("keeps the H1 lockup within ~20 characters a part", () => {
    expect(feature.headline.lead.length).toBeLessThanOrEqual(20);
    expect(feature.headline.accent.length).toBeLessThanOrEqual(20);
  });

  it("fits the search snippet", () => {
    expect(feature.metaTitle.length).toBeLessThanOrEqual(60);
    expect(feature.metaDescription.length).toBeLessThanOrEqual(155);
    expect(feature.metaTitle).toMatch(/automated blog publishing/i);
  });

  it("has an answer block short enough to quote whole", () => {
    const words = ANSWER.answer.split(/\s+/).length;
    expect(words).toBeGreaterThanOrEqual(40);
    expect(words).toBeLessThanOrEqual(110);
    expect(ANSWER.answer.startsWith("Rankbox Auto-Publishing is")).toBe(true);
  });
});

describe("auto-publishing structured data", () => {
  const graph = featureGraph(feature);
  const byType = (t: string) => graph.find((n) => n["@type"] === t)!;

  it("marks up exactly the FAQ the page shows", () => {
    const faq = byType("FAQPage") as {
      mainEntity: { name: string; acceptedAnswer: { text: string } }[];
    };
    expect(faq.mainEntity.map((q) => [q.name, q.acceptedAnswer.text])).toEqual(
      FAQS.map((f) => [f.q, f.a]),
    );
  });

  it("offers the plan at its real price", () => {
    const app = byType("SoftwareApplication") as { offers: { price: string } };
    expect(app.offers.price).toBe(PLAN.monthly.toFixed(2));
  });

  it("sets a self-referencing canonical", () => {
    const head = featureHead(feature);
    expect(head.links).toEqual([
      { rel: "canonical", href: "https://rankbox.xyz/features/auto-publishing" },
    ]);
  });
});

describe("when a connector ships", () => {
  afterEach(() => {
    vi.doUnmock("@/data/platforms");
    vi.resetModules();
  });

  it("moves it to available and names it, with no flag-by-flag rewrite", async () => {
    vi.resetModules();
    vi.doMock("@/data/platforms", async (importOriginal) => {
      const real = await importOriginal<typeof import("@/data/platforms")>();
      return {
        ...real,
        PUBLISH_PLATFORMS: real.PUBLISH_PLATFORMS.map((p) =>
          p.id === "webflow" ? { ...p, addonLive: true } : p,
        ),
      };
    });
    const next = await import("./auto-publishing");
    const webflow = next.DESTINATIONS.find((d) => d.id === "webflow")!;
    expect(webflow.stage).toBe("available");
    expect(next.DELIVERY_CLAUSE).toContain("Webflow");
    expect(next.FAQS[0].a).toMatch(/publishes to Webflow/);
    expect(next.CONNECTOR_STATUS_SENTENCE).not.toContain("Webflow");
  });
});
