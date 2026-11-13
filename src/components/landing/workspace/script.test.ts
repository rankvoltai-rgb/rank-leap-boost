/**
 * The workspace window is a pure function of (run, t). These hold its
 * timeline together, and hold its numbers to what the product documents.
 */
import { describe, expect, it } from "vitest";
import { PLAN } from "@/data/pricing";
import { MARKS, PACE, RUNS, SIZE, STILL, MAIN_W, PANEL_W, SIDEBAR_W, viewAt } from "./script";

describe("workspace script", () => {
  it("plays every run's beats in order", () => {
    for (const m of MARKS) {
      const beats = [
        PACE.working,
        ...m.paragraphs.map((p) => p.start),
        ...m.steps,
        m.done,
        m.ran,
        m.card,
        m.open,
        m.leave,
        m.end,
      ];
      expect([...beats].sort((a, b) => a - b)).toEqual(beats);
    }
  });

  it("starts empty and ends complete", () => {
    RUNS.forEach((run, i) => {
      const start = viewAt(i, 0);
      expect(start.working).toBe(false);
      expect(start.shown.every((n) => n === 0)).toBe(true);
      expect(start.open).toBe(false);

      const open = viewAt(i, MARKS[i].open + 1);
      expect(open.shown).toEqual(run.prose.map((p) => p.split(" ").length));
      expect(open.steps.every((s) => s === "done")).toBe(true);
      expect(open).toMatchObject({ done: true, ran: true, card: true, open: true, leaving: false });

      // The panel closes as the run leaves, so the next one starts clean.
      expect(viewAt(i, MARKS[i].leave + 1)).toMatchObject({ open: false, leaving: true });
    });
  });

  it("stops the clock when the run is done", () => {
    RUNS.forEach((_, i) => {
      const { done, end } = MARKS[i];
      expect(viewAt(i, end).seconds).toBe(viewAt(i, done).seconds);
    });
  });

  it("keeps the allowance within the plan, and never hands credits back", () => {
    for (const run of RUNS) {
      const [before, after] = run.quota;
      expect(before).toBeLessThanOrEqual(PLAN.articlesPerMonth);
      expect(after).toBeLessThanOrEqual(before);
      expect(after).toBeGreaterThanOrEqual(0);
    }
    // Each run picks up the allowance where the last one left it.
    RUNS.slice(1).forEach((run, i) => expect(run.quota[0]).toBe(RUNS[i].quota[1]));
    RUNS.slice(1).forEach((run, i) => expect(run.queue[0]).toBe(RUNS[i].queue[1]));
  });

  it("charges no article credit for research", () => {
    const research = RUNS.find((r) => r.panel === "plan")!;
    expect(research.quota[1]).toBe(research.quota[0]);
  });

  it("holds a finished frame under reduced motion", () => {
    expect(viewAt(STILL.run, STILL.t)).toMatchObject({ done: true, card: true, open: true });
  });

  it("uses a sample site on a reserved domain, and makes no claim it can't keep", () => {
    const copy = RUNS.flatMap((r) => [
      r.request,
      ...r.prose,
      r.card.title,
      r.card.meta,
      r.ran.label,
    ]);
    for (const line of copy) {
      expect(line).not.toMatch(/\b(guarantee|#1|rank(s|ed)? first|cited by|tracks?)\b/i);
      for (const domain of line.match(/[a-z0-9-]+\.[a-z]{2,}\b/g) ?? []) {
        expect(domain.endsWith(".example"), domain).toBe(true);
      }
    }
  });

  it("matches the reference window's measures", () => {
    expect(SIZE).toEqual({ w: 1320, h: 720 });
    expect(SIDEBAR_W + MAIN_W).toBe(SIZE.w);
    expect(PANEL_W * 2).toBe(MAIN_W);
  });
});
