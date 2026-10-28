/**
 * The trial, said the same way everywhere.
 *
 * A card is required: adding one is the last step of onboarding, and the
 * dashboard can't be reached without it. The site used to say otherwise in
 * twenty-odd places ("No credit card required", "no card to start"), each one
 * patched separately. These checks keep Rankbox's own copy from drifting back.
 *
 * Blog posts and competitor fact files are left out on purpose: they state
 * other companies' trial terms, several of which really don't take a card.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CARD_CHECK_NOTE, PRICING_FAQS, TRIAL_DAYS, TRIAL_NOTE, TRIAL_TERMS } from "./pricing";
import { TRIAL_NOTE as FEATURE_TRIAL_NOTE } from "@/components/features/FeatureSections";

const ROOTS = ["src/components", "src/routes", "src/sublanding", "src/data", "src/content/docs"];

/** Other companies' terms, and the navbar/footer the user froze ("Get Started Free"). */
const SKIP = [
  "src/data/compare/content/",
  "src/data/competitors/",
  "src/components/landing/Navbar.tsx",
  "src/components/landing/nav-mobile.tsx",
  "src/components/landing/nav-menus.tsx",
];

/** Claims that a Rankbox account starts without a card, or a trial length we don't sell. */
const FALSE_CLAIMS: { what: string; pattern: RegExp }[] = [
  { what: "no credit card", pattern: /no credit card/i },
  { what: "no card to start / sign up", pattern: /no card to (?:start|sign)/i },
  { what: "no card needed", pattern: /no card needed/i },
  { what: "2-day trial", pattern: /\b(?:2|two)-day (?:free )?trial/i },
];

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return files(path);
    return /\.(?:tsx?|md)$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

const SOURCES = ROOTS.flatMap(files).filter((f) => !SKIP.some((s) => f.startsWith(s)));

describe("trial copy", () => {
  it("never tells anyone a Rankbox trial doesn't take a card", () => {
    // An empty scan would pass for the wrong reason.
    expect(SOURCES.length).toBeGreaterThan(300);
    const hits: string[] = [];
    for (const file of SOURCES) {
      readFileSync(file, "utf8")
        .split("\n")
        .forEach((line, i) => {
          for (const { what, pattern } of FALSE_CLAIMS) {
            if (pattern.test(line)) hits.push(`${file}:${i + 1} (${what})`);
          }
        });
    }
    expect(hits).toEqual([]);
  });

  it("says card required in the line under every call to action", () => {
    expect(TRIAL_NOTE).toMatch(/card required/i);
    expect(TRIAL_NOTE).toContain(`${TRIAL_DAYS}-day`);
    // Feature, persona, compare and alternative pages read it from here.
    expect(FEATURE_TRIAL_NOTE).toBe(TRIAL_NOTE);
  });

  it("puts the charge seven days after the start, not on a numbered day", () => {
    expect(TRIAL_TERMS).toMatch(/card is required/i);
    expect(TRIAL_TERMS).toContain(`${TRIAL_DAYS} days after you start`);
    for (const { a } of PRICING_FAQS) expect(a).not.toMatch(/\bday (?:7|8|seven|eight)\b/i);
  });

  it("answers the card question with a yes, and explains the $1 hold", () => {
    const card = PRICING_FAQS.find((f) => /credit card/i.test(f.q));
    expect(card?.a).toMatch(/^Yes\./);
    expect(card?.a).toContain(CARD_CHECK_NOTE);
    expect(CARD_CHECK_NOTE).toMatch(/\$1 hold/);
    expect(CARD_CHECK_NOTE).toMatch(/release/);
  });
});
