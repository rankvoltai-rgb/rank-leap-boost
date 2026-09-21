import { beforeAll, describe, expect, it } from "vitest";
import { seedMockAccount } from "./store";
import {
  enableReddit,
  generateRedditDraft,
  getRedditOverview,
  listRedditMentions,
  listRedditOpportunities,
  markRedditReplyPosted,
  resetMockReddit,
  runRedditSweep,
  setMockRedditAccess,
  updateRedditDraft,
  updateRedditSettings,
} from "./reddit";
import type { RedditOpportunity } from "@/lib/reddit/types";

/**
 * The mock is only worth having if the awkward states it promises are really
 * there under the real scorer and the real checker. These tests pin them.
 */
let opps: RedditOpportunity[] = [];
const bySub = (sub: string, match?: RegExp) =>
  opps.find((o) => o.thread.subreddit === sub && (!match || match.test(o.thread.title)));

beforeAll(async () => {
  seedMockAccount();
  resetMockReddit();
  await setMockRedditAccess("paid");
  await enableReddit({});
  const result = await runRedditSweep();
  expect(result.started).toBe(true);
  opps = await listRedditOpportunities();
}, 20_000);

describe("gate", () => {
  it("gives an unpaid account the shape of the feature and none of its contents", async () => {
    await setMockRedditAccess("trial");
    const overview = await getRedditOverview();
    expect(overview.access).toBe("trial");
    expect(overview.settings).toBeNull();
    expect(overview.counts.open).toBe(0);
    expect(await listRedditOpportunities()).toEqual([]);
    expect(await runRedditSweep()).toEqual({ started: false, reason: "not_paid" });
    await expect(generateRedditDraft({ opportunityId: opps[0].id })).rejects.toThrow(/paid plan/);
    await setMockRedditAccess("paid");
  });

  it("grants the month's credits to a paid account exactly once", async () => {
    const a = await getRedditOverview();
    const b = await getRedditOverview();
    expect(a.balance.balance).toBe(30);
    expect(b.balance.balance).toBe(30);
  });
});

describe("the honesty states are all present", () => {
  it("ranks the hero thread first among open opportunities", () => {
    const open = opps.filter((o) => !o.blockedReason && o.status === "new");
    expect(open.length).toBeGreaterThanOrEqual(4);
    expect(open[0].thread.redditId).toBe("1kq3m8a");
    expect(open[0].score).toBeGreaterThan(0.5);
  });

  it("has a thread that was checked and NOT cited, distinct from one never checked", () => {
    const uncited = bySub("saas", /ClickUp/);
    expect(uncited?.thread.aiChecked).toBe(true);
    expect(uncited?.thread.aiCitations.every((c) => !c.cited)).toBe(true);

    const unchecked = bySub("productivity", /Kanban/);
    expect(unchecked?.thread.aiChecked).toBe(false);
    expect(unchecked?.thread.aiCitations).toEqual([]);
    expect(unchecked?.blockedReason).toBeNull();
  });

  it("refuses the best-ranked thread of all because its subreddit bans self-promotion", () => {
    const banned = bySub("entrepreneur");
    expect(banned?.thread.googlePosition?.position).toBe(1);
    expect(banned?.blockedReason).toBe("promo_banned");
    expect(banned?.score).toBe(-1);
  });

  it("separates measured archiving from inferred archiving", () => {
    expect(bySub("startups", /early startups/)?.blockedReason).toBe("archived");
    expect(bySub("saas", /worth paying/)?.blockedReason).toBe("likely_archived");
  });

  it("keeps a 14-month-old thread open where the subreddit switched archiving off", () => {
    const veteran = bySub("projectmanagement", /stick with/);
    expect(veteran?.blockedReason).toBeNull();
    expect(veteran?.status).toBe("posted");
  });

  it("blocks locked, removed and off-topic threads, each with its own reason", () => {
    expect(bySub("projectmanagement", /recurring/)?.blockedReason).toBe("locked");
    expect(opps.find((o) => o.thread.isRemoved)?.blockedReason).toBe("removed");
    expect(bySub("productivity", /standing desk/)?.blockedReason).toBe("off_topic");
  });

  it("surfaces a thread it found but never hydrated, without inventing engagement", () => {
    const partial = opps.find((o) => o.thread.partialData);
    expect(partial).toBeDefined();
    expect(partial?.breakdown.engagement).toBe(0);
    expect(partial?.breakdown.velocity).toBe(0);
  });

  it("finds something new on a later sweep", async () => {
    expect(opps.some((o) => o.thread.redditId === "1v9c6ls")).toBe(false);
  });
});

describe("drafting", () => {
  it("writes a reply for the hero thread that passes every check, for one credit", async () => {
    const hero = opps.find((o) => o.thread.redditId === "1kq3m8a")!;
    const draft = await generateRedditDraft({ opportunityId: hero.id });
    expect(draft.compliance.checks.filter((c) => c.state !== "pass")).toEqual([]);
    expect((await getRedditOverview()).balance.balance).toBe(29);
  });

  it("reports an unknown — never a pass — where the rules could not be read", async () => {
    const agile = bySub("agile")!;
    const draft = await generateRedditDraft({ opportunityId: agile.id });
    const rule = draft.compliance.checks.find((c) => c.id === "subreddit_rules");
    expect(rule?.state).toBe("unknown");
    expect(draft.compliance.pass).toBe(true);
    expect(draft.compliance.unknowns).toBe(1);
  });

  it("reports an unknown for a ratio rule only the member can check", async () => {
    const saas = bySub("saas", /ClickUp/)!;
    const draft = await generateRedditDraft({ opportunityId: saas.id });
    expect(draft.compliance.checks.find((c) => c.id === "subreddit_rules")?.state).toBe("unknown");
  });

  it("refuses a banned subreddit BEFORE spending a credit", async () => {
    const before = (await getRedditOverview()).balance.balance;
    await expect(generateRedditDraft({ opportunityId: bySub("entrepreneur")!.id })).rejects.toThrow(
      /bans self-promotion/,
    );
    await expect(
      generateRedditDraft({ opportunityId: bySub("projectmanagement", /recurring/)!.id }),
    ).rejects.toThrow(/can't be replied to/);
    expect((await getRedditOverview()).balance.balance).toBe(before);
  });

  it("re-checks an edit for free, and fails it if the disclosure is removed", async () => {
    const hero = opps.find((o) => o.thread.redditId === "1kq3m8a")!;
    const before = (await getRedditOverview()).balance.balance;
    const draft = await generateRedditDraft({ opportunityId: hero.id });
    const stripped = draft.body.replace(/^Full disclosure: I work on Plannora\.\s*/, "");
    const edited = await updateRedditDraft({ draftId: draft.id, body: stripped });
    expect(edited.compliance.checks.find((c) => c.id === "disclosure")?.state).toBe("fail");
    expect(edited.compliance.pass).toBe(false);
    // One credit for the draft; nothing for the edit.
    expect((await getRedditOverview()).balance.balance).toBe(before - 1);
  });
});

describe("the hand-off", () => {
  it("rejects a permalink to a different thread, and a lookalike host", async () => {
    const hero = opps.find((o) => o.thread.redditId === "1kq3m8a")!;
    await expect(
      markRedditReplyPosted({
        opportunityId: hero.id,
        permalink: "https://www.reddit.com/r/startups/comments/zzz999/x/abc1234/",
      }),
    ).rejects.toThrow(/different thread/);
    await expect(
      markRedditReplyPosted({
        opportunityId: hero.id,
        permalink: "https://reddit.com.evil.tld/r/startups/comments/1kq3m8a/x/abc1234/",
      }),
    ).rejects.toThrow(/doesn't look like/);
  });

  it("records a bare claim as unverifiable, and never counts it as a live mention", async () => {
    const kanban = bySub("productivity", /Kanban/)!;
    const before = (await getRedditOverview()).counts.liveMentions;
    const reply = await markRedditReplyPosted({ opportunityId: kanban.id });
    expect(reply.status).toBe("claimed");
    expect(reply.permalink).toBeNull();
    expect((await getRedditOverview()).counts.liveMentions).toBe(before);
  });

  it("allows one reply per thread", async () => {
    const kanban = bySub("productivity", /Kanban/)!;
    await expect(generateRedditDraft({ opportunityId: kanban.id })).rejects.toThrow(
      /already replied/,
    );
  });
});

describe("mentions", () => {
  it("draws the veteran timeline from dated measurements only", async () => {
    const mentions = await listRedditMentions();
    const veteran = mentions.find((m) => m.reply.status === "confirmed");
    expect(veteran).toBeDefined();
    expect(veteran!.serpHistory.length).toBeGreaterThanOrEqual(4);
    expect(veteran!.activity.length).toBeGreaterThanOrEqual(4);
    for (const point of veteran!.serpHistory) expect(Date.parse(point.checkedAt)).not.toBeNaN();
  });
});

describe("settings", () => {
  it("re-ranks everything when the deny list changes", async () => {
    await updateRedditSettings({ denySubreddits: ["r/Agile"] });
    const after = await listRedditOpportunities();
    expect(after.find((o) => o.thread.subreddit === "agile")?.blockedReason).toBe(
      "subreddit_denied",
    );
  });

  it("refuses a disclosure line that would gut the mandatory check", async () => {
    await expect(updateRedditSettings({ disclosureLine: "." })).rejects.toThrow(/disclosure line/);
    await expect(
      updateRedditSettings({ disclosureLine: "Check out {brand} today!" }),
    ).rejects.toThrow(/disclosure line/);
  });
});
