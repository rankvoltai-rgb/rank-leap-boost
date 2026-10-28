import { describe, expect, it } from "vitest";
import {
  hasRedditEntitlement,
  PaidPlanRequiredError,
  redditAccessFor,
  requireGenerationEntitlement,
  requireRedditEntitlement,
  SiteUnavailableError,
  siteIsPaid,
  siteMayGenerate,
  siteRedditAccessFor,
  subscriptionIsPaid,
  TrialRequiredError,
} from "./entitlement.server";
import { billingIssueOf, rowEntitles, trialDaysFor } from "./entitlement";

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
  it("stops a failed payment at once, paid before or not", () => {
    expect(
      subscriptionIsPaid(row({ status: "past_due", past_due_since: iso(-hours(2)) }), NOW),
    ).toBe(false);
    expect(subscriptionIsPaid(row({ status: "past_due", past_due_since: null }), NOW)).toBe(false);
  });
  it("is false for every other status", () => {
    for (const status of ["incomplete", "incomplete_expired", "unpaid", "paused"]) {
      expect(subscriptionIsPaid(row({ status }), NOW)).toBe(false);
    }
  });
});

const PRIMARY = { kind: "primary", status: "active", removes_at: null };
const SCOPE = { userId: "u1", siteId: "s1" };

/**
 * A stand-in for the two queries the gate makes: the owner's newest
 * subscription and the site row. `calls` records each filter, per table.
 */
function fakeClient(sub: unknown, site: unknown = PRIMARY) {
  const calls: Array<[string, string, string]> = [];
  const chainFor = (table: string) => {
    const chain = {
      select: () => chain,
      eq: (c: string, v: string) => {
        calls.push([table, c, v]);
        return chain;
      },
      order: () => chain,
      limit: () => chain,
      maybeSingle: async () => ({ data: table === "profiles" ? site : sub }),
    };
    return chain;
  };
  return { client: { from: chainFor }, calls };
}

describe("Reddit presence — the same paid gate as the exchange", () => {
  it("refuses a trial, even with a verified card", async () => {
    const trial = row({ status: "trialing", card_verified: true, activated_at: null });
    expect(await hasRedditEntitlement(fakeClient(trial).client, SCOPE, "sandbox")).toBe(false);
    await expect(
      requireRedditEntitlement(fakeClient(trial).client, SCOPE, "sandbox"),
    ).rejects.toBeInstanceOf(PaidPlanRequiredError);
    await expect(
      requireRedditEntitlement(fakeClient(trial).client, SCOPE, "sandbox"),
    ).rejects.toThrow(/Reddit presence is part of the paid plan/);
  });

  it("refuses an account with no subscription at all", async () => {
    await expect(
      requireRedditEntitlement(fakeClient(null).client, SCOPE, "sandbox"),
    ).rejects.toBeInstanceOf(PaidPlanRequiredError);
  });

  it("admits an active plan", async () => {
    await expect(
      requireRedditEntitlement(fakeClient(row({})).client, SCOPE, "sandbox"),
    ).resolves.toBeUndefined();
  });

  it("refuses a failed payment, and admits canceled only for an account that actually paid", async () => {
    const failing = row({ status: "past_due", past_due_since: iso(-hours(2)) });
    expect(await hasRedditEntitlement(fakeClient(failing).client, SCOPE, "sandbox")).toBe(false);
    expect(
      await hasRedditEntitlement(
        // The gate reads the real clock, so the paid period must outlast it.
        fakeClient(row({ status: "canceled", current_period_end: "2099-01-01T00:00:00Z" })).client,
        SCOPE,
        "sandbox",
      ),
    ).toBe(true);
    expect(
      await hasRedditEntitlement(
        fakeClient(row({ status: "canceled", activated_at: null })).client,
        SCOPE,
        "sandbox",
      ),
    ).toBe(false);
  });

  it("reads the subscription for the server's Stripe environment, not the caller's", async () => {
    const { client, calls } = fakeClient(row({}));
    await hasRedditEntitlement(client, { userId: "user-42", siteId: "site-7" }, "live");
    expect(calls).toContainEqual(["subscriptions", "user_id", "user-42"]);
    expect(calls).toContainEqual(["subscriptions", "environment", "live"]);
  });

  it("checks the site belongs to the caller, not just that it exists", async () => {
    const { client, calls } = fakeClient(row({}));
    await hasRedditEntitlement(client, { userId: "user-42", siteId: "site-7" }, "live");
    expect(calls).toContainEqual(["profiles", "id", "site-7"]);
    expect(calls).toContainEqual(["profiles", "user_id", "user-42"]);
  });

  it("refuses a site that is someone else's, or not live, whatever the plan", async () => {
    expect(await hasRedditEntitlement(fakeClient(row({}), null).client, SCOPE, "live")).toBe(false);
    const archived = { kind: "studio", status: "archived", removes_at: null };
    expect(await hasRedditEntitlement(fakeClient(row({}), archived).client, SCOPE, "live")).toBe(
      false,
    );
  });
});

describe("site entitlement — Studio", () => {
  const studio = (over: Record<string, unknown> = {}) => ({
    kind: "studio",
    status: "active",
    removes_at: null,
    ...over,
  });

  it("lets the primary generate on a trial, but never a Studio site", () => {
    const trial = row({ status: "trialing", activated_at: null });
    expect(siteMayGenerate(PRIMARY, trial, NOW)).toBe(true);
    expect(siteMayGenerate(studio(), trial, NOW)).toBe(false);
  });

  it("lets every live site generate on a paid plan", () => {
    expect(siteMayGenerate(PRIMARY, row({}), NOW)).toBe(true);
    expect(siteMayGenerate(studio(), row({}), NOW)).toBe(true);
  });

  it("keeps a site scheduled for removal running until its date, and not after", () => {
    expect(siteMayGenerate(studio({ removes_at: iso(hours(5)) }), row({}), NOW)).toBe(true);
    expect(siteMayGenerate(studio({ removes_at: iso(-1) }), row({}), NOW)).toBe(false);
    expect(siteIsPaid(studio({ removes_at: iso(-1) }), row({}), NOW)).toBe(false);
  });

  it("refuses pending and archived sites, and a missing one", () => {
    expect(siteMayGenerate(studio({ status: "pending" }), row({}), NOW)).toBe(false);
    expect(siteMayGenerate(studio({ status: "archived" }), row({}), NOW)).toBe(false);
    expect(siteMayGenerate(null, row({}), NOW)).toBe(false);
  });

  it("raises SiteUnavailableError, not a trial prompt, for a site that isn't live", async () => {
    const archived = studio({ status: "archived" });
    await expect(
      requireGenerationEntitlement(fakeClient(row({}), archived).client, SCOPE),
    ).rejects.toBeInstanceOf(SiteUnavailableError);
    await expect(
      requireGenerationEntitlement(fakeClient(null, PRIMARY).client, SCOPE),
    ).rejects.toBeInstanceOf(TrialRequiredError);
  });

  it("shows a site that stopped as lapsed or none on Reddit, never paid", () => {
    const ended = studio({ status: "archived" });
    expect(siteRedditAccessFor(ended, row({}), true, NOW)).toBe("lapsed");
    expect(siteRedditAccessFor(ended, row({}), false, NOW)).toBe("none");
    expect(siteRedditAccessFor(studio(), row({}), false, NOW)).toBe("paid");
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

describe("generation stops while billing is broken", () => {
  it("refuses a trial whose card check failed, and says to update the card", async () => {
    const failed = row({ status: "trialing", card_verified: false, activated_at: null });
    expect(rowEntitles(failed, NOW)).toBe(false);
    await expect(requireGenerationEntitlement(fakeClient(failed).client, SCOPE)).rejects.toThrow(
      /couldn't verify your card/,
    );
  });

  it("lets a trial write while its card check is pending or passed", () => {
    expect(rowEntitles(row({ status: "trialing", card_verified: null }), NOW)).toBe(true);
    expect(rowEntitles(row({ status: "trialing", card_verified: true }), NOW)).toBe(true);
  });

  it("refuses every failed-payment status from the first minute, with no grace", async () => {
    for (const status of ["past_due", "unpaid", "incomplete", "paused"]) {
      const failing = row({ status, past_due_since: iso(-1000) });
      expect(rowEntitles(failing, NOW), status).toBe(false);
      await expect(requireGenerationEntitlement(fakeClient(failing).client, SCOPE)).rejects.toThrow(
        /payment didn't go through/,
      );
    }
  });

  it("tells an ended plan to restart, not to start a trial", async () => {
    const ended = row({ status: "canceled", current_period_end: iso(-1) });
    await expect(requireGenerationEntitlement(fakeClient(ended).client, SCOPE)).rejects.toThrow(
      /plan has ended/,
    );
  });
});

describe("billingIssueOf", () => {
  it("is nothing for a healthy plan or trial, and for no subscription at all", () => {
    expect(billingIssueOf(row({}), NOW)).toBeNull();
    expect(billingIssueOf(row({ status: "trialing", card_verified: null }), NOW)).toBeNull();
    expect(billingIssueOf(null, NOW)).toBeNull();
  });

  it("names each kind of broken billing", () => {
    expect(billingIssueOf(row({ status: "trialing", card_verified: false }), NOW)).toBe(
      "card_check_failed",
    );
    expect(billingIssueOf(row({ status: "past_due" }), NOW)).toBe("payment_failed");
    expect(billingIssueOf(row({ status: "unpaid" }), NOW)).toBe("payment_failed");
    expect(billingIssueOf(row({ status: "incomplete_expired" }), NOW)).toBe("plan_ended");
  });

  it("waits for a cancelled plan's paid period to run out before calling it ended", () => {
    expect(billingIssueOf(row({ status: "canceled" }), NOW)).toBeNull();
    expect(billingIssueOf(row({ status: "canceled", current_period_end: iso(-1) }), NOW)).toBe(
      "plan_ended",
    );
  });
});

describe("trialDaysFor — one trial per account", () => {
  it("gives a first subscription the trial and every later one none", () => {
    expect(trialDaysFor(false, 7)).toBe(7);
    expect(trialDaysFor(true, 7)).toBeUndefined();
  });
});
