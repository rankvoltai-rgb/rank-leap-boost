import { describe, expect, it } from "vitest";
import {
  hasRedditEntitlement,
  PaidPlanRequiredError,
  redditAccessFor,
  requireRedditEntitlement,
  subscriptionIsPaid,
} from "./entitlement.server";

const NOW = Date.parse("2026-09-21T00:00:00Z");
const hours = (n: number) => n * 60 * 60 * 1000;
const iso = (offsetMs: number) => new Date(NOW + offsetMs).toISOString();

const row = (over: Record<string, unknown>) =>
  ({
    status: "active",
    current_period_end: iso(hours(24 * 20)),
    past_due_since: null,
    card_verified: true,
    activated_at: iso(-hours(24 * 40)),
    ...over,
  }) as Parameters<typeof subscriptionIsPaid>[0];

describe("subscriptionIsPaid", () => {
  it("is true for an active plan", () => {
    expect(subscriptionIsPaid(row({}), NOW)).toBe(true);
  });
  it("is false for a trial, even with a verified card", () => {
    expect(
      subscriptionIsPaid(row({ status: "trialing", card_verified: true, activated_at: null }), NOW),
    ).toBe(false);
  });
  it("is false for nothing at all", () => {
    expect(subscriptionIsPaid(null, NOW)).toBe(false);
    expect(subscriptionIsPaid(row({ status: null }), NOW)).toBe(false);
  });
  it("keeps a cancelled plan until its paid period ends, but only if it was ever paid", () => {
    expect(subscriptionIsPaid(row({ status: "canceled" }), NOW)).toBe(true);
    expect(subscriptionIsPaid(row({ status: "canceled", current_period_end: iso(-1) }), NOW)).toBe(
      false,
    );
    // A trial cancelled mid-way also has a future period end: it never paid.
    expect(subscriptionIsPaid(row({ status: "canceled", activated_at: null }), NOW)).toBe(false);
  });
  it("gives past_due the grace window, and only after a real payment", () => {
    expect(
      subscriptionIsPaid(row({ status: "past_due", past_due_since: iso(-hours(2)) }), NOW),
    ).toBe(true);
    expect(
      subscriptionIsPaid(row({ status: "past_due", past_due_since: iso(-hours(72)) }), NOW),
    ).toBe(false);
    expect(subscriptionIsPaid(row({ status: "past_due", past_due_since: null }), NOW)).toBe(false);
    expect(
      subscriptionIsPaid(
        row({ status: "past_due", past_due_since: iso(-hours(2)), activated_at: null }),
        NOW,
      ),
    ).toBe(false);
  });
  it("is false for every other status", () => {
    for (const status of ["incomplete", "incomplete_expired", "unpaid", "paused"]) {
      expect(subscriptionIsPaid(row({ status }), NOW)).toBe(false);
    }
  });
});

/** A stand-in for the one query `latestSubscription` makes. */
function fakeClient(data: unknown) {
  const calls: Array<[string, string]> = [];
  const chain = {
    select: () => chain,
    eq: (c: string, v: string) => {
      calls.push([c, v]);
      return chain;
    },
    order: () => chain,
    limit: () => chain,
    maybeSingle: async () => ({ data }),
  };
  return { client: { from: () => chain }, calls };
}

describe("Reddit presence — the same paid gate as the exchange", () => {
  it("refuses a trial, even with a verified card", async () => {
    const trial = row({ status: "trialing", card_verified: true, activated_at: null });
    expect(await hasRedditEntitlement(fakeClient(trial).client, "u1", "sandbox")).toBe(false);
    await expect(
      requireRedditEntitlement(fakeClient(trial).client, "u1", "sandbox"),
    ).rejects.toBeInstanceOf(PaidPlanRequiredError);
    await expect(
      requireRedditEntitlement(fakeClient(trial).client, "u1", "sandbox"),
    ).rejects.toThrow(/Reddit presence is part of the paid plan/);
  });

  it("refuses an account with no subscription at all", async () => {
    await expect(
      requireRedditEntitlement(fakeClient(null).client, "u1", "sandbox"),
    ).rejects.toBeInstanceOf(PaidPlanRequiredError);
  });

  it("admits an active plan", async () => {
    await expect(
      requireRedditEntitlement(fakeClient(row({})).client, "u1", "sandbox"),
    ).resolves.toBeUndefined();
  });

  it("admits past_due and canceled only for an account that actually paid", async () => {
    const lapsing = { status: "past_due", past_due_since: iso(-hours(2)) };
    expect(await hasRedditEntitlement(fakeClient(row(lapsing)).client, "u1", "sandbox")).toBe(true);
    expect(
      await hasRedditEntitlement(
        fakeClient(row({ ...lapsing, activated_at: null })).client,
        "u1",
        "sandbox",
      ),
    ).toBe(false);
    expect(
      await hasRedditEntitlement(
        fakeClient(row({ status: "canceled", activated_at: null })).client,
        "u1",
        "sandbox",
      ),
    ).toBe(false);
  });

  it("reads the subscription for the server's Stripe environment, not the caller's", async () => {
    const { client, calls } = fakeClient(row({}));
    await hasRedditEntitlement(client, "user-42", "live");
    expect(calls).toContainEqual(["user_id", "user-42"]);
    expect(calls).toContainEqual(["environment", "live"]);
  });
});

describe("redditAccessFor", () => {
  it("is paid for anything subscriptionIsPaid accepts", () => {
    expect(redditAccessFor(row({}), false, NOW)).toBe("paid");
    expect(redditAccessFor(row({ status: "canceled" }), true, NOW)).toBe("paid");
  });

  it("is trial while trialing, whether or not they ever took part", () => {
    const trial = row({ status: "trialing", activated_at: null });
    expect(redditAccessFor(trial, false, NOW)).toBe("trial");
    expect(redditAccessFor(trial, true, NOW)).toBe("trial");
  });

  it("separates a member who left from a visitor who never started", () => {
    const ended = row({ status: "canceled", current_period_end: iso(-1) });
    expect(redditAccessFor(ended, true, NOW)).toBe("lapsed");
    expect(redditAccessFor(ended, false, NOW)).toBe("none");
    expect(redditAccessFor(null, false, NOW)).toBe("none");
    expect(redditAccessFor(null, true, NOW)).toBe("lapsed");
  });
});
