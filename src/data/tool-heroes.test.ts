/**
 * The AI tool heroes' rules. Forty-nine pages share one set of scenes, so the
 * variety between them is data; this is where it's kept honest.
 */
import { describe, expect, it } from "vitest";
import { AI_TOOLS, aiCategoryOf } from "./ai-integrations";
import { SCENARIOS, type RankboxTool } from "./ai-integration-samples";
import { TOOL_HEROES, toolHero, type HeroStage } from "./tool-heroes";

const TASKS: RankboxTool[] = ["questions", "brief", "meta"];

describe("tool heroes", () => {
  it("gives every AI tool page a scene, and no scene without a page", () => {
    const tools = AI_TOOLS.map((t) => t.id).sort();
    expect(Object.keys(TOOL_HEROES).sort()).toEqual(tools);
  });

  it("never opens two neighbouring pages on the same scene", () => {
    const byStage = new Map<HeroStage, string[]>();
    for (const t of AI_TOOLS) {
      const stage = toolHero(t).stage;
      byStage.set(stage, [...(byStage.get(stage) ?? []), t.id]);
    }
    for (const [stage, ids] of byStage) {
      for (let i = 1; i < ids.length; i++) {
        const [a, b] = [TOOL_HEROES[ids[i - 1]], TOOL_HEROES[ids[i]]];
        expect(a.task, `${stage}: ${ids[i - 1]} and ${ids[i]}`).not.toBe(b.task);
      }
    }
  });

  it("shows all three Rankbox tools on every stage with room for them", () => {
    const stages = new Set(AI_TOOLS.map((t) => toolHero(t).stage));
    for (const stage of stages) {
      const heroes = AI_TOOLS.map(toolHero).filter((h) => h.stage === stage);
      if (heroes.length < 3) continue;
      expect(new Set(heroes.map((h) => h.task)), stage).toEqual(new Set(TASKS));
    }
  });

  it("uses six-digit hex accents", () => {
    for (const [id, h] of Object.entries(TOOL_HEROES)) {
      expect(h.accent, id).toMatch(/^#[0-9A-F]{6}$/i);
    }
  });

  it("only sets a stage's options on that stage", () => {
    for (const [id, h] of Object.entries(TOOL_HEROES)) {
      if (h.sidebar) expect(h.stage, id).toBe("editor");
      if (h.flow || h.round || h.agent) expect(h.stage, id).toBe("canvas");
      if (h.cli) expect(h.stage, id).toBe("terminal");
      if (h.stage === "terminal") expect(h.cli, id).toBeTruthy();
    }
  });

  it("has a prompt from the page's own use cases for every typed scene", () => {
    for (const t of AI_TOOLS) {
      const h = toolHero(t);
      if (h.stage === "canvas" || h.stage === "voice") continue;
      const scenario = SCENARIOS[aiCategoryOf(t)].find((s) => s.tool === h.task);
      expect(scenario, t.id).toBeDefined();
    }
  });
});
