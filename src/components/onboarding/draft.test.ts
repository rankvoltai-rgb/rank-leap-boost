import { describe, expect, it } from "vitest";
import { emptyDraft, normalizeDraft } from "./draft";

const full = {
  ...emptyDraft("redbox.info"),
  step: 3,
  brandName: "Redbox",
  analyzedUrl: "redbox.info",
  keywords: [
    { id: "k1", name: "moving boxes", search_volume: 1000, intent: "Commercial", trend: "up" },
  ],
};

describe("normalizeDraft", () => {
  it("returns nothing to resume for empty or finished drafts", () => {
    expect(normalizeDraft(null)).toBeNull();
    expect(normalizeDraft("garbage")).toBeNull();
    expect(normalizeDraft({ ...full, step: "done" })).toBeNull();
  });

  it("restarts pre-scan drafts from step 1, keeping only the URL", () => {
    const d = normalizeDraft({ step: 2, url: "redbox.info", brandName: "Old" });
    expect(d).toEqual(emptyDraft("redbox.info"));
  });

  // Each of these crashed onboarding in production on 2026-09-23.
  it.each([
    ["only a few fields", { step: 2, url: "redbox.info", analyzedUrl: "redbox.info" }],
    ["no titles", (({ titles: _t, ...r }) => r)(full)],
    ["no keywords", (({ keywords: _k, ...r }) => r)(full)],
    ["null lists", { ...full, competitors: null, services: null, semanticClusters: null }],
    ["malformed rows", { ...full, keywords: [null, { name: 5 }, "x"], titles: [{}] }],
  ])("repairs a draft with %s into a complete one", (_name, saved) => {
    const d = normalizeDraft(saved)!;
    for (const key of Object.keys(emptyDraft(""))) expect(d, key).toHaveProperty(key);
    for (const list of [
      "services",
      "competitors",
      "semanticClusters",
      "aiVisibility",
      "missingOpportunities",
      "keywords",
      "titles",
    ] as const) {
      expect(Array.isArray(d[list]), list).toBe(true);
    }
    expect(typeof d.url).toBe("string");
  });

  it("keeps a complete draft as it was", () => {
    expect(normalizeDraft(full)).toEqual(full);
  });

  it("never opens a step without the data it needs", () => {
    expect(normalizeDraft({ ...full, keywords: [] })!.step).toBe(2);
    expect(normalizeDraft({ ...full, url: "" })!.step).toBe(1);
  });
});
