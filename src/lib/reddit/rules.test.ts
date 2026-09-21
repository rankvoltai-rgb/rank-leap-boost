import { describe, expect, it } from "vitest";
import { normalizeSubreddit, readRules } from "./rules";

describe("readRules", () => {
  it("recognises an outright self-promotion ban, however it is worded", () => {
    for (const rule of [
      "No self-promotion.",
      "No self promotion or advertising of any kind",
      "Self-promotion is not allowed.",
      "Self-promotional content will be removed",
      "Do not promote your own product.",
      "Don't advertise here.",
      "No advertising",
      "No vendors or affiliate links",
      "No spam",
    ]) {
      const r = readRules([rule]);
      expect(r.promoBanned, rule).toBe(true);
      expect(r.risk, rule).toBe(1);
      expect(r.bannedBy, rule).toBeTruthy();
    }
  });

  it("reads a carve-out as a limit, not a ban", () => {
    for (const rule of [
      "No self-promotion outside the weekly Share Your Startup thread.",
      "Self-promotion is limited to 10% of your activity (the 9:1 rule).",
      "No excessive self-promotion.",
      "No self-promotion without mod approval.",
    ]) {
      const r = readRules([rule]);
      expect(r.promoBanned, rule).toBe(false);
      expect(r.promoMentioned, rule).toBe(true);
      expect(r.risk, rule).toBeGreaterThan(0);
      expect(r.risk, rule).toBeLessThan(1);
    }
  });

  it("flags a ratio rule as something only the member can check", () => {
    expect(readRules(["Follow the 9:1 rule for self-promotion."]).ratioRule).toBe(true);
    expect(readRules(["Promotion must be under 10% of your posts."]).ratioRule).toBe(true);
    // A ratio that is not about promotion is not this rule.
    expect(readRules(["Keep a 9:1 text to image ratio."]).ratioRule).toBe(false);
  });

  it("recognises a link ban separately from a promotion ban", () => {
    const r = readRules(["No links in comments.", "Be kind."]);
    expect(r.linksBanned).toBe(true);
    expect(r.promoBanned).toBe(false);
  });

  it("finds nothing in ordinary rules, and stays quiet on empty input", () => {
    const r = readRules(["Be civil.", "Stay on topic.", "No memes."]);
    expect(r).toMatchObject({
      promoBanned: false,
      linksBanned: false,
      ratioRule: false,
      promoMentioned: false,
      risk: 0,
    });
    expect(readRules([]).risk).toBe(0);
    expect(readRules([null, undefined, "  "]).promoBanned).toBe(false);
  });

  it("caps the risk of a merely wary subreddit below a ban", () => {
    const r = readRules(["Self-promotion under 10% only.", "No links."]);
    expect(r.promoBanned).toBe(false);
    expect(r.risk).toBeLessThanOrEqual(0.9);
  });
});

describe("normalizeSubreddit", () => {
  it("strips the prefix, slashes and casing", () => {
    expect(normalizeSubreddit("r/Startups")).toBe("startups");
    expect(normalizeSubreddit("/r/SaaS/")).toBe("saas");
    expect(normalizeSubreddit("  projectmanagement ")).toBe("projectmanagement");
    expect(normalizeSubreddit(null)).toBe("");
  });
});
