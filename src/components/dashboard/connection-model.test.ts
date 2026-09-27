import { describe, expect, it } from "vitest";
import type { IntegrationKey } from "@/lib/data";
import { siteConnection, webflowSiteStatus } from "./connection-model";

const NOW = Date.parse("2026-09-27T12:00:00.000Z");

const key = (last_used_at: string | null, revoked_at: string | null = null): IntegrationKey =>
  ({
    id: "k",
    name: "My website",
    key_prefix: "rv_live_abc…",
    last_used_at,
    revoked_at,
    created_at: "2026-09-01T00:00:00.000Z",
  }) as IntegrationKey;

const webflow = (status: "setup" | "active" | "error" | "disconnected", connected = true) => ({
  connected,
  status,
  lastPublishedAt: "2026-09-27T11:00:00.000Z",
});

describe("webflowSiteStatus", () => {
  it("reads a Webflow connection in the same terms as keys", () => {
    expect(webflowSiteStatus(webflow("active"))).toBe("live");
    expect(webflowSiteStatus(webflow("error"))).toBe("stale");
    expect(webflowSiteStatus(webflow("setup"))).toBe("waiting");
    expect(webflowSiteStatus(webflow("disconnected", false))).toBe("none");
    expect(webflowSiteStatus(null)).toBe("none");
  });
});

describe("siteConnection", () => {
  it("calls a Webflow-only site connected, though it has no keys", () => {
    expect(siteConnection([], webflow("active"), NOW)).toEqual({
      status: "live",
      via: "webflow",
      lastActivity: "2026-09-27T11:00:00.000Z",
    });
  });

  it("takes whichever route is doing better", () => {
    // A key made but never used, and Webflow publishing: the site is live.
    expect(siteConnection([key(null)], webflow("active"), NOW).status).toBe("live");
    // A key syncing now beats a Webflow connection still being set up.
    const byKey = siteConnection([key("2026-09-27T11:30:00.000Z")], webflow("setup"), NOW);
    expect(byKey).toMatchObject({ status: "live", via: "api" });
  });

  it("shows a half-set-up Webflow connection as waiting, not unconnected", () => {
    expect(siteConnection([], webflow("setup"), NOW)).toMatchObject({
      status: "waiting",
      via: "webflow",
    });
  });

  it("ignores a disconnected Webflow and revoked keys", () => {
    expect(
      siteConnection(
        [key("2026-09-27T11:00:00.000Z", "2026-09-27T11:10:00.000Z")],
        webflow("disconnected", false),
        NOW,
      ),
    ).toEqual({ status: "none", via: null, lastActivity: null });
  });
});
