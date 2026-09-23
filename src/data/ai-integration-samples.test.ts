/**
 * The samples stand in for real tool output until a visitor runs their own,
 * so they must look exactly like it: the same shape, the same limits.
 */
import { describe, expect, it } from "vitest";
import { SAMPLES, SCENARIOS, TOOL_NAMES } from "./ai-integration-samples";
import { AI_TOOLS, aiCategoryOf } from "./ai-integrations";

const categories = Object.keys(SAMPLES) as (keyof typeof SAMPLES)[];

describe("tool samples", () => {
  it("covers every kind of AI tool that has a page", () => {
    for (const t of AI_TOOLS) expect(categories, t.id).toContain(aiCategoryOf(t));
  });

  it("writes meta descriptions the way the tool does: 120 to 160 characters", () => {
    for (const c of categories) {
      expect(SAMPLES[c].meta).toHaveLength(3);
      for (const m of SAMPLES[c].meta) {
        expect(m.length, `${c}: ${m}`).toBeGreaterThanOrEqual(120);
        expect(m.length, `${c}: ${m}`).toBeLessThanOrEqual(160);
      }
    }
  });

  it("groups questions by the four intents the tool uses", () => {
    for (const c of categories) {
      expect(SAMPLES[c].questions.map((g) => g.intent)).toEqual([
        "Informational",
        "Commercial",
        "Comparison",
        "Transactional",
      ]);
      for (const g of SAMPLES[c].questions) expect(g.questions.length).toBeGreaterThan(0);
    }
  });

  it("gives every brief a title, an outline, and entities", () => {
    for (const c of categories) {
      const b = SAMPLES[c].brief;
      expect(b.title.length).toBeGreaterThan(0);
      expect(b.outline.length).toBeGreaterThanOrEqual(4);
      expect(b.entities.length).toBeGreaterThan(0);
    }
  });
});

describe("use-case scenarios", () => {
  it("has three per kind of tool, each on a real Rankbox tool", () => {
    for (const c of categories) {
      expect(SCENARIOS[c]).toHaveLength(3);
      for (const s of SCENARIOS[c]) expect(Object.keys(TOOL_NAMES)).toContain(s.tool);
    }
  });

  it("uses only the {name} placeholder, so every page fills in cleanly", () => {
    for (const c of categories) {
      for (const s of SCENARIOS[c]) {
        for (const text of [s.prompt, s.returns, s.then]) {
          expect(text.replaceAll("{name}", "Lovable"), text).not.toMatch(/[{}]/);
        }
      }
    }
  });
});
