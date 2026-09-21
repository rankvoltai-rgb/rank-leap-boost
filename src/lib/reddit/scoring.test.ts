import { describe, expect, it } from "vitest";
import {
  ageInDays,
  blockedReasonFor,
  fitPercent,
  rankOpportunities,
  scoreOpportunity,
  SELF_PROMO_PENALTY,
  WEIGHTS,
  type ScoreContext,
  type ScoreInput,
} from "./scoring";
import { ANSWERABLE_FLOOR, ARCHIVE_DAYS } from "./types";

const NOW = Date.parse("2026-09-21T00:00:00Z");
const daysAgo = (n: number) => new Date(NOW - n * 86_400_000).toISOString();

function thread(over: Partial<ScoreInput> = {}): ScoreInput {
  return {
    redditId: "abc123",
    subreddit: "startups",
    title: "What's the best project management tool for a 4-person startup?",
    body: "We've outgrown a shared spreadsheet. Need kanban boards and simple sprint planning, nothing enterprise.",
    upVotes: 124,
    numComments: 37,
    postedAt: daysAgo(3),
    isLocked: false,
    isArchived: false,
    isRemoved: false,
    partialData: false,
    googlePosition: null,
    aiChecked: false,
    aiCited: false,
    subredditTitle: "Startups",
    subredditDescription: "A community for founders building startups and project teams",
    subredditTags: ["startup", "founders"],
    subredditRules: ["Be civil.", "No low-effort posts."],
    rulesKnown: true,
    promoBanned: false,
    ...over,
  };
}

function ctx(over: Partial<ScoreContext> = {}): ScoreContext {
  return {
    niche: "project management software",
    topicTags: ["project management", "kanban", "startup teams"],
    keywords: ["project management tool", "sprint planning", "kanban board"],
    productDescription: "Lightweight project boards and sprint planning for small teams.",
    allowSubreddits: [],
    denySubreddits: [],
    ...over,
  };
}

describe("weights", () => {
  it("has positive weights that sum to exactly 1", () => {
    const sum = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 10);
  });
  it("values measured Google rank well above freshness", () => {
    expect(WEIGHTS.googleRank).toBeGreaterThan(WEIGHTS.freshness * 2);
  });
});

describe("hard gates", () => {
  it("scores -1 and names the reason for each gate", () => {
    const cases: Array<[Partial<ScoreInput>, string]> = [
      [{ isRemoved: true }, "removed"],
      [{ isLocked: true }, "locked"],
      [{ isArchived: true }, "archived"],
      [{ promoBanned: true }, "promo_banned"],
      [{ subredditRules: ["No self-promotion of any kind."] }, "promo_banned"],
    ];
    for (const [over, reason] of cases) {
      const t = thread(over);
      expect(blockedReasonFor(t, ctx(), NOW)).toBe(reason);
      expect(scoreOpportunity(t, ctx(), NOW).score).toBe(-1);
    }
  });

  it("lets the most final reason win", () => {
    expect(
      blockedReasonFor(thread({ isRemoved: true, isLocked: true, isArchived: true }), ctx(), NOW),
    ).toBe("removed");
    expect(blockedReasonFor(thread({ isLocked: true, promoBanned: true }), ctx(), NOW)).toBe(
      "locked",
    );
  });

  it("honours the deny list, with or without an r/ prefix or casing", () => {
    expect(blockedReasonFor(thread(), ctx({ denySubreddits: ["r/Startups"] }), NOW)).toBe(
      "subreddit_denied",
    );
    expect(blockedReasonFor(thread(), ctx({ denySubreddits: ["saas"] }), NOW)).toBeNull();
  });

  it("treats a non-empty allow list as allowlist-only", () => {
    expect(blockedReasonFor(thread(), ctx({ allowSubreddits: ["saas"] }), NOW)).toBe(
      "subreddit_denied",
    );
    expect(blockedReasonFor(thread(), ctx({ allowSubreddits: ["startups"] }), NOW)).toBeNull();
  });

  it("never lets an allow list override a self-promotion ban", () => {
    const t = thread({ subredditRules: ["No advertising."] });
    expect(blockedReasonFor(t, ctx({ allowSubreddits: ["startups"] }), NOW)).toBe("promo_banned");
  });

  it("refuses a thread the brand has nothing to say in", () => {
    const t = thread({
      title: "Which sourdough starter hydration works for rye?",
      body: "My loaves keep collapsing in the oven.",
      subredditTitle: "Breadit",
      subredditDescription: "baking bread at home",
      subredditTags: ["baking"],
    });
    expect(blockedReasonFor(t, ctx(), NOW)).toBe("off_topic");
  });

  it("does not let the question bonus rescue an off-topic thread", () => {
    // Shaped like a perfect question, about something else entirely.
    const t = thread({
      title: "What is the best sourdough recipe? Anyone recommend one?",
      body: "",
    });
    const b = scoreOpportunity(t, ctx(), NOW);
    expect(b.answerable).toBeGreaterThanOrEqual(ANSWERABLE_FLOOR);
    expect(b.score).toBe(-1);
  });
});

describe("archiving", () => {
  it("infers at exactly the archive age, and says it inferred", () => {
    const unknown = { isArchived: null } as const;
    expect(
      blockedReasonFor(thread({ ...unknown, postedAt: daysAgo(ARCHIVE_DAYS - 1) }), ctx(), NOW),
    ).toBeNull();
    expect(
      blockedReasonFor(thread({ ...unknown, postedAt: daysAgo(ARCHIVE_DAYS) }), ctx(), NOW),
    ).toBe("likely_archived");
  });

  it("trusts a scraped flag over the heuristic, in both directions", () => {
    // A subreddit that switched archiving off: old, and still open.
    expect(
      blockedReasonFor(thread({ isArchived: false, postedAt: daysAgo(400) }), ctx(), NOW),
    ).toBeNull();
    // Archived early: young, and closed.
    expect(blockedReasonFor(thread({ isArchived: true, postedAt: daysAgo(2) }), ctx(), NOW)).toBe(
      "archived",
    );
  });

  it("does not guess when there is no date", () => {
    expect(blockedReasonFor(thread({ isArchived: null, postedAt: null }), ctx(), NOW)).toBeNull();
    expect(ageInDays("not a date", NOW)).toBeNull();
  });
});

describe("measured signals", () => {
  it("scores position 1 at full rank and the horizon at none", () => {
    expect(scoreOpportunity(thread({ googlePosition: 1 }), ctx(), NOW).googleRank).toBe(1);
    expect(scoreOpportunity(thread({ googlePosition: 30 }), ctx(), NOW).googleRank).toBeCloseTo(
      0,
      10,
    );
    expect(scoreOpportunity(thread({ googlePosition: 80 }), ctx(), NOW).googleRank).toBe(0);
    expect(scoreOpportunity(thread({ googlePosition: null }), ctx(), NOW).googleRank).toBe(0);
  });

  it("never ranks an unchecked thread below a checked-and-uncited one", () => {
    const unchecked = scoreOpportunity(thread({ aiChecked: false, aiCited: false }), ctx(), NOW);
    const uncited = scoreOpportunity(thread({ aiChecked: true, aiCited: false }), ctx(), NOW);
    expect(unchecked.score).toBe(uncited.score);
  });

  it("ignores a citation flag that was never actually checked", () => {
    expect(scoreOpportunity(thread({ aiChecked: false, aiCited: true }), ctx(), NOW).aiCited).toBe(
      0,
    );
    expect(scoreOpportunity(thread({ aiChecked: true, aiCited: true }), ctx(), NOW).aiCited).toBe(
      1,
    );
  });

  it("ranks a year-old thread at #1 above a fresh one nobody can find", () => {
    const old = scoreOpportunity(
      thread({ isArchived: false, postedAt: daysAgo(365), googlePosition: 1 }),
      ctx(),
      NOW,
    );
    const fresh = scoreOpportunity(
      thread({ postedAt: daysAgo(0.2), googlePosition: null }),
      ctx(),
      NOW,
    );
    expect(old.score).toBeGreaterThan(fresh.score);
  });
});

describe("derived signals", () => {
  it("scores an unhydrated thread nothing for engagement rather than guessing", () => {
    const b = scoreOpportunity(
      thread({ partialData: true, upVotes: 0, numComments: 0 }),
      ctx(),
      NOW,
    );
    expect(b.engagement).toBe(0);
    expect(b.velocity).toBe(0);
    expect(b.score).toBeGreaterThan(0);
  });

  it("carries a modest risk for rules it could not read", () => {
    const known = scoreOpportunity(thread({ rulesKnown: true }), ctx(), NOW);
    const unread = scoreOpportunity(thread({ rulesKnown: false, subredditRules: [] }), ctx(), NOW);
    expect(unread.selfPromoRisk).toBeGreaterThan(known.selfPromoRisk);
    expect(unread.score).toBeLessThan(known.score);
  });

  it("penalises a promo-wary subreddit without blocking it", () => {
    const wary = thread({
      subredditRules: ["Self-promotion must stay under 10% of your activity."],
    });
    expect(blockedReasonFor(wary, ctx(), NOW)).toBeNull();
    const clean = scoreOpportunity(thread(), ctx(), NOW);
    const b = scoreOpportunity(wary, ctx(), NOW);
    expect(b.score).toBeLessThan(clean.score);
    expect(clean.score - b.score).toBeCloseTo(SELF_PROMO_PENALTY * b.selfPromoRisk, 10);
  });
});

describe("ranking", () => {
  it("drops nothing — blocked threads come back last, with their reason", () => {
    const ranked = rankOpportunities(
      [
        thread({ redditId: "dead", isLocked: true }),
        thread({ redditId: "live", googlePosition: 3 }),
      ],
      ctx(),
      NOW,
    );
    expect(ranked.map((r) => r.input.redditId)).toEqual(["live", "dead"]);
    expect(ranked[1].blockedReason).toBe("locked");
    expect(ranked[0].blockedReason).toBeNull();
  });

  it("is stable on ties", () => {
    const a = rankOpportunities(
      [thread({ redditId: "bbb" }), thread({ redditId: "aaa" })],
      ctx(),
      NOW,
    );
    const b = rankOpportunities(
      [thread({ redditId: "aaa" }), thread({ redditId: "bbb" })],
      ctx(),
      NOW,
    );
    expect(a.map((r) => r.input.redditId)).toEqual(["aaa", "bbb"]);
    expect(b.map((r) => r.input.redditId)).toEqual(["aaa", "bbb"]);
  });

  it("shows no fit number for a blocked thread", () => {
    expect(fitPercent(-1)).toBeNull();
    expect(fitPercent(0.634)).toBe(63);
    expect(fitPercent(4)).toBe(100);
  });
});
