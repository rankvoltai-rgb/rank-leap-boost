import { describe, expect, it } from "vitest";
import { RankboxApiError } from "@rankbox/api-client";
import { describeError, parseAllowedDomains } from "./errors";

const ctx = { baseUrl: "https://rankbox.xyz" };

describe("describeError", () => {
  it("explains a network failure with a retry", () => {
    const d = describeError(new RankboxApiError(0, "fetch failed"), ctx);
    expect(d.title).toMatch(/couldn't reach/i);
    expect(d.action?.intent).toBe("retry");
  });

  it("sends a 401 to the key page", () => {
    const d = describeError(new RankboxApiError(401, "Invalid key"), ctx);
    expect(d.action?.href).toBe("https://rankbox.xyz/dashboard/integrations");
  });

  it("uses the server's own words for a lapsed plan, and links billing", () => {
    const message = "This site isn't active on a Rankbox plan, so it can't sync articles.";
    const d = describeError(new RankboxApiError(402, message, "subscription_required"), ctx);
    expect(d.body).toBe(message);
    expect(d.action?.href).toBe("https://rankbox.xyz/dashboard/billing");
  });

  // The code must be honoured even if the status is ever relaxed.
  it("recognises subscription_required by code", () => {
    const d = describeError(new RankboxApiError(403, "nope", "subscription_required"), ctx);
    expect(d.action?.href).toBe("https://rankbox.xyz/dashboard/billing");
  });

  it("tells the user to wait on a 429", () => {
    const d = describeError(new RankboxApiError(429, "Too many"), ctx);
    expect(d.body).toMatch(/wait/i);
  });

  it("names both domains on a report-phase mismatch", () => {
    const err = new RankboxApiError(
      400,
      "published_url must be on your own site (brightloop.app).",
    );
    const d = describeError(err, {
      ...ctx,
      phase: "report",
      actualDomain: "brightloop.framer.website",
    });
    expect(d.body).toContain("brightloop.app");
    expect(d.body).toContain("brightloop.framer.website");
    expect(d.action?.href).toBe("https://rankbox.xyz/dashboard/settings");
  });

  it("offers a field reset when Framer rejects the schema", () => {
    const d = describeError(new Error("Invalid field type for content"), ctx);
    expect(d.action?.intent).toBe("reset-fields");
  });

  it("falls back to the raw message", () => {
    expect(describeError(new Error("boom"), ctx).body).toBe("boom");
  });

  it("offers a retry on a 500", () => {
    const d = describeError(new RankboxApiError(503, "down"), ctx);
    expect(d.action?.intent).toBe("retry");
  });
});

describe("parseAllowedDomains", () => {
  it("pulls a single domain out of the API message", () => {
    expect(parseAllowedDomains("published_url must be on your own site (brightloop.app).")).toEqual(
      ["brightloop.app"],
    );
  });

  it("pulls both when the API offers two", () => {
    expect(parseAllowedDomains("published_url must be on your own site (a.com or b.com).")).toEqual(
      ["a.com", "b.com"],
    );
  });

  it("returns nothing for an unrelated message", () => {
    expect(parseAllowedDomains("something else")).toEqual([]);
  });
});
