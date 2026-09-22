import { describe, expect, it } from "vitest";
import {
  blockedByCategory,
  chooseAnchor,
  jaccard,
  overlap,
  rankCandidates,
  scoreCandidate,
  termSet,
  tokens,
  TOPICAL_FLOOR,
  type Candidate,
  type MatchContext,
} from "./scoring";

const NOW = Date.parse("2026-09-21T00:00:00Z");
const daysAgo = (n: number) => new Date(NOW - n * 86_400_000).toISOString();

function candidate(over: Partial<Candidate> = {}): Candidate {
  return {
    targetId: "t1",
    requesterSiteId: "s-req",
    requesterOwnerId: "u-req",
    requesterDomain: "acme.example",
    url: "https://acme.example/project-management-guide",
    anchors: ["project management guide", "how to manage projects", "project planning basics"],
    topicTags: ["project management", "team productivity"],
    niche: "project management software",
    priority: 5,
    tier: 1,
    reputation: 100,
    queuedSince: daysAgo(1),
    lastPlacedAt: null,
    liveCount: 0,
    everLinkedFromHost: false,
    requesterKeywords: ["project management tool", "sprint planning", "kanban board"],
    usedAnchors: [],
    ...over,
  };
}

function ctx(over: Partial<MatchContext> = {}): MatchContext {
  return {
    hostSiteId: "s-host",
    hostTier: 1,
    hostNiche: "productivity software",
    hostTopicTags: ["productivity", "project management", "remote teams"],
    blockedCategories: [],
    articleTitle: "How to Run Sprint Planning for Remote Teams",
    articleKeyword: "sprint planning",
    articleTags: ["Project management", "Agile"],
    ...over,
  };
}

describe("tokens / sets", () => {
  it("drops stopwords and folds plurals", () => {
    // "best", "tools" and "for" carry no topic; plurals fold.
    expect(tokens("The 10 Best Project Management Tools for Teams")).toEqual([
      "project",
      "management",
      "team",
    ]);
  });
  it("does not mangle words ending in ss", () => {
    expect(tokens("process analytics")).toEqual(["process", "analytic"]);
  });
  it("treats one shared word as coincidence, not relevance", () => {
    expect(overlap(termSet("sourdough tools baking"), termSet("crm tools pricing"))).toBeLessThan(
      0.15,
    );
    // ...unless a side genuinely only has one term.
    expect(overlap(termSet("kanban"), termSet("kanban board setup"))).toBe(1);
  });
  it("overlap rewards a small keyword against a big profile where jaccard would not", () => {
    const small = termSet("sprint planning");
    const big = termSet([
      "sprint planning",
      "kanban",
      "roadmap",
      "okr",
      "standup",
      "retro",
      "velocity",
      "backlog",
    ]);
    expect(overlap(small, big)).toBe(1);
    expect(jaccard(small, big)).toBeLessThan(0.3);
  });
});

describe("scoreCandidate", () => {
  it("scores a clearly relevant target above the floor", () => {
    const b = scoreCandidate(candidate(), ctx(), NOW);
    expect(b.topical).toBeGreaterThanOrEqual(TOPICAL_FLOOR);
    expect(b.score).toBeGreaterThan(0);
  });
  it("refuses an irrelevant target outright", () => {
    const b = scoreCandidate(
      candidate({
        anchors: ["best sourdough starter", "bread proofing guide", "how to bake sourdough"],
        topicTags: ["baking", "sourdough"],
        niche: "home baking",
        requesterKeywords: ["sourdough recipe", "bread flour"],
      }),
      ctx(),
      NOW,
    );
    expect(b.topical).toBeLessThan(TOPICAL_FLOOR);
    expect(b.score).toBe(-1);
  });
  it("does not let generic title words pass as relevance", () => {
    const b = scoreCandidate(
      candidate({
        anchors: ["best crm software", "top crm tools", "crm guide"],
        topicTags: ["crm"],
        niche: "crm software",
        requesterKeywords: ["best crm", "crm for small business"],
      }),
      ctx({
        articleTitle: "The Best Sourdough Tools for Beginners",
        articleKeyword: "sourdough tools",
        articleTags: ["Baking"],
        hostNiche: "baking",
        hostTopicTags: ["baking"],
      }),
      NOW,
    );
    expect(b.score).toBe(-1);
  });
  it("favours the target that has waited longest", () => {
    const fresh = scoreCandidate(candidate({ queuedSince: daysAgo(0) }), ctx(), NOW);
    const waiting = scoreCandidate(candidate({ queuedSince: daysAgo(30) }), ctx(), NOW);
    expect(waiting.score).toBeGreaterThan(fresh.score);
    expect(waiting.starve).toBe(1);
  });
  it("brakes a target that was just placed", () => {
    const rested = scoreCandidate(candidate({ lastPlacedAt: null }), ctx(), NOW);
    const justPlaced = scoreCandidate(candidate({ lastPlacedAt: daysAgo(0) }), ctx(), NOW);
    expect(justPlaced.score).toBeLessThan(rested.score);
  });
  it("demotes a requester the host already links to", () => {
    const novel = scoreCandidate(candidate(), ctx(), NOW);
    const repeat = scoreCandidate(candidate({ everLinkedFromHost: true }), ctx(), NOW);
    expect(repeat.score).toBeLessThan(novel.score);
  });
});

describe("chooseAnchor", () => {
  it("rotates to the least-used variant", () => {
    const anchors = ["a one", "b two", "c three"];
    expect(chooseAnchor(anchors, [])).toBe("a one");
    expect(chooseAnchor(anchors, ["a one"])).toBe("b two");
    expect(chooseAnchor(anchors, ["a one", "b two"])).toBe("c three");
    expect(chooseAnchor(anchors, ["a one", "b two", "c three", "A ONE"])).toBe("b two");
  });
  it("is empty when there is nothing to choose", () => {
    expect(chooseAnchor([], [])).toBe("");
    expect(chooseAnchor(["  "], [])).toBe("");
  });
});

describe("blockedByCategory", () => {
  it("matches by the category's terms in niche or tags", () => {
    expect(blockedByCategory(["gambling"], "online casino reviews", [])).toBe(true);
    expect(blockedByCategory(["gambling"], "productivity", ["sports betting tips"])).toBe(true);
    expect(blockedByCategory(["gambling"], "productivity", ["kanban"])).toBe(false);
    expect(blockedByCategory([], "online casino", [])).toBe(false);
  });
});

describe("rankCandidates", () => {
  it("drops the floor-failing, the blocked and the self, and orders the rest", () => {
    const list = [
      candidate({ targetId: "self", requesterSiteId: "s-host" }),
      candidate({ targetId: "casino", niche: "casino affiliate", topicTags: ["casino"] }),
      candidate({
        targetId: "bread",
        anchors: ["sourdough starter", "bread proofing", "bake sourdough"],
        topicTags: ["baking"],
        niche: "baking",
        requesterKeywords: ["sourdough"],
      }),
      candidate({ targetId: "fresh", queuedSince: daysAgo(0) }),
      candidate({ targetId: "waiting", queuedSince: daysAgo(20) }),
    ];
    const ranked = rankCandidates(list, ctx({ blockedCategories: ["gambling"] }), NOW);
    expect(ranked.map((r) => r.candidate.targetId)).toEqual(["waiting", "fresh"]);
    expect(ranked[0].anchor).toBe("project management guide");
    expect(ranked[0].credits).toBe(1);
  });
  it("breaks exact ties by who has waited longest", () => {
    const a = candidate({ targetId: "a", queuedSince: daysAgo(3) });
    const b = candidate({ targetId: "b", queuedSince: daysAgo(3.0000001) });
    const ranked = rankCandidates([a, b], ctx(), NOW);
    expect(ranked[0].candidate.targetId).toBe("b");
  });
});
