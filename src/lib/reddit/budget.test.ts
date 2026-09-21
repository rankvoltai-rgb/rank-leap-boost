import { afterEach, describe, expect, it } from "vitest";
import {
  enabledAiEngines,
  redditActor,
  serpActor,
  SweepBudget,
  type ApifyResult,
} from "./apify.server";

const spent = (usd: number): ApifyResult => ({ items: [], ok: true, cost: { usd, units: 1 } });

const ENV_KEYS = [
  "REDDIT_AI_ENGINES",
  "APIFY_REDDIT_ACTOR",
  "APIFY_SERP_ACTOR",
  "APIFY_TOKEN",
] as const;
const saved = Object.fromEntries(ENV_KEYS.map((k) => [k, process.env[k]]));
afterEach(() => {
  for (const k of ENV_KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

describe("SweepBudget", () => {
  it("allows the per-run cap while there is room", () => {
    const b = new SweepBudget(1, 0.5);
    expect(b.allowance()).toBe(0.5);
    expect(b.exhausted).toBe(false);
  });

  it("shrinks the allowance to what is left", () => {
    const b = new SweepBudget(1, 0.5);
    b.record(spent(0.8));
    expect(b.allowance()).toBeCloseTo(0.2, 10);
    expect(b.remaining).toBeCloseTo(0.2, 10);
  });

  it("refuses outright once it runs dry, and says so", () => {
    const b = new SweepBudget(1, 0.5);
    b.record(spent(0.6));
    b.record(spent(0.395));
    expect(b.allowance()).toBe(0);
    expect(b.exhausted).toBe(true);
    // Overspend is possible — estimates are estimates — but never goes negative.
    b.record(spent(0.4));
    expect(b.remaining).toBe(0);
    expect(b.allowance()).toBe(0);
  });

  it("marks itself exhausted when a call was skipped for budget", () => {
    const b = new SweepBudget(1, 0.5);
    b.record({ items: [], ok: false, reason: "budget", cost: { usd: 0, units: 0 } });
    expect(b.exhausted).toBe(true);
  });

  it("does not mark a provider failure as exhaustion", () => {
    const b = new SweepBudget(1, 0.5);
    b.record({ items: [], ok: false, reason: "timeout", cost: { usd: 0, units: 0 } });
    expect(b.exhausted).toBe(false);
    expect(b.spent).toBe(0);
  });

  it("reports spend to four places, for the sweeps table", () => {
    const b = new SweepBudget(5, 1);
    b.record(spent(0.0216));
    b.record(spent(0.408));
    expect(b.spent).toBe(0.4296);
  });
});

describe("configuration", () => {
  it("asks no AI engine unless an operator names one", () => {
    delete process.env.REDDIT_AI_ENGINES;
    expect(enabledAiEngines()).toEqual([]);
    process.env.REDDIT_AI_ENGINES = "";
    expect(enabledAiEngines()).toEqual([]);
  });

  it("reads the engine list, ignoring anything it doesn't know", () => {
    process.env.REDDIT_AI_ENGINES = " Perplexity, chatgpt ,bard,, google_ai_overview";
    expect(enabledAiEngines()).toEqual(["perplexity", "chatgpt", "google_ai_overview"]);
  });

  it("accepts an actor id in either form", () => {
    process.env.APIFY_REDDIT_ACTOR = "spookyweb/reddit-scraper";
    expect(redditActor()).toBe("spookyweb~reddit-scraper");
    delete process.env.APIFY_REDDIT_ACTOR;
    expect(redditActor()).toBe("trudax~reddit-scraper-lite");
    delete process.env.APIFY_SERP_ACTOR;
    expect(serpActor()).toBe("apify~google-search-scraper");
  });
});

describe("with no token", () => {
  it("returns empty and costs nothing — it never throws", async () => {
    delete process.env.APIFY_TOKEN;
    const { searchGoogle, searchReddit, fetchRedditPosts, apifyConfigured } =
      await import("./apify.server");
    expect(apifyConfigured()).toBe(false);
    for (const call of [
      searchGoogle(["kanban"], { pages: 2, maxChargeUsd: 0.5 }),
      searchReddit(["kanban"], { perQuery: 15, maxChargeUsd: 0.5 }),
      fetchRedditPosts(["https://www.reddit.com/r/x/comments/1abc23/"], {
        commentsPerPost: 5,
        maxChargeUsd: 0.5,
      }),
    ])
      await expect(call).resolves.toMatchObject({
        items: [],
        ok: false,
        reason: "unconfigured",
        cost: { usd: 0 },
      });
  });
});
