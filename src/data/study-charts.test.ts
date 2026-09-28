import { existsSync, readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { STUDY_CHARTS } from "./study-charts";

const BLOG_DIR = "src/content/blog";

describe("study charts", () => {
  for (const [id, chart] of Object.entries(STUDY_CHARTS)) {
    describe(id, () => {
      const file = `${BLOG_DIR}/${chart.post}.md`;

      it("is placed exactly once by the post it belongs to", () => {
        expect(existsSync(file), file).toBe(true);
        const body = readFileSync(file, "utf8");
        expect(body.split(`(figure:study/${id} `).length - 1).toBe(1);
      });

      it("carries a dated source line", () => {
        expect(chart.source).toMatch(/\d{1,2} [A-Z][a-z]+ \d{4}/);
      });

      if (chart.kind === "bars") {
        it("has a percentage for every series on every row, within the axis", () => {
          const max = chart.max ?? 100;
          for (const row of chart.rows) {
            for (const s of chart.series) {
              const v = row.values[s.key];
              expect(v, `${row.name} ${s.key}`).toBeTypeOf("number");
              expect(v).toBeGreaterThanOrEqual(0);
              expect(v).toBeLessThanOrEqual(max);
            }
          }
        });
      } else {
        it("has prompts and one cluster per definition count", () => {
          expect(chart.prompts.length).toBeGreaterThan(0);
          expect(chart.clusters.map((c) => c.k)).toEqual([0, 1, 2, 3, 4]);
        });
      }
    });
  }

  it("only places study charts that exist", () => {
    for (const f of readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"))) {
      const body = readFileSync(`${BLOG_DIR}/${f}`, "utf8");
      for (const m of body.matchAll(/\(figure:study\/([a-z0-9-]+)/g)) {
        expect(STUDY_CHARTS[m[1]], `${f} places study/${m[1]}`).toBeDefined();
      }
    }
  });
});
