import { describe, expect, it } from "vitest";
import { subscriptionIsPaid } from "./entitlement.server";

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
