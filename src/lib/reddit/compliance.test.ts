import { describe, expect, it } from "vitest";
import {
  checkReply,
  complianceSummary,
  countLinks,
  isValidDisclosureLine,
  mechanicalFailures,
  resolveDisclosure,
  type ComplianceContext,
} from "./compliance";
import { MAX_DRAFT_CHARS } from "./types";

function ctx(over: Partial<ComplianceContext> = {}): ComplianceContext {
  return {
    brandName: "Plannora",
    disclosureLine: "Full disclosure: I work on {brand}.",
    maxLinksPerReply: 1,
    subreddit: "startups",
    rules: ["Be civil.", "Stay on topic."],
    rulesKnown: true,
    competitors: ["Trello", "Asana"],
    ...over,
  };
}

/** The reply the marketing showcase types out. It has to pass — it is the promise. */
const SHOWCASE =
  "Full disclosure: I work on Plannora. For a team of four I'd start with whatever has the lightest setup. Our free tier covers up to 5 people with boards and simple automations, and Trello is solid too if you only need boards.";

const state = (body: string, id: string, c = ctx()) =>
  checkReply(body, c).checks.find((k) => k.id === id)?.state;

describe("the showcase reply", () => {
  it("passes every check", () => {
    const report = checkReply(SHOWCASE, ctx());
    expect(report.checks.filter((c) => c.state !== "pass")).toEqual([]);
    expect(report.pass).toBe(true);
    expect(complianceSummary(report)).toBe("7 of 7 checks pass");
  });
});

describe("disclosure", () => {
  const answer =
    " For a team of four I'd start with whatever has the lightest setup, then add structure once you feel the pain of not having it.";

  it("fails a reply that does not disclose", () => {
    expect(state(`Plannora is great for this.${answer}`, "disclosure")).toBe("fail");
    expect(checkReply(`Honestly just pick one.${answer}`, ctx()).pass).toBe(false);
  });

  it("passes the line whatever its casing or punctuation", () => {
    expect(state(`full disclosure - i work on plannora!${answer}`, "disclosure")).toBe("pass");
    expect(state(`FULL DISCLOSURE, I WORK ON PLANNORA${answer}`, "disclosure")).toBe("pass");
  });

  it("passes the member's own wording if it names the brand and the tie", () => {
    expect(state(`I'm the founder of Plannora, so I'm biased.${answer}`, "disclosure")).toBe(
      "pass",
    );
    expect(state(`I built Plannora, take this with salt.${answer}`, "disclosure")).toBe("pass");
  });

  it("is not satisfied by naming the brand without the tie, or the tie without the brand", () => {
    expect(state(`Plannora does this well.${answer}`, "disclosure")).toBe("fail");
    expect(state(`Full disclosure: I work in this space.${answer}`, "disclosure")).toBe("fail");
  });

  it("does not match the brand inside another word", () => {
    expect(state(`Full disclosure: I work on Plannorama.${answer}`, "disclosure")).toBe("fail");
  });
});

describe("disclosure line as a setting", () => {
  it("accepts a line that names the brand and the tie", () => {
    expect(isValidDisclosureLine("Full disclosure: I work on {brand}.", "Plannora")).toBe(true);
    expect(isValidDisclosureLine("I'm the founder of Plannora.", "Plannora")).toBe(true);
    // Called twice in a row: a stateful regex would flip on the second call.
    expect(isValidDisclosureLine("Full disclosure: I work on {brand}.", "Plannora")).toBe(true);
  });

  it("refuses a line that would make the check meaningless", () => {
    for (const bad of [
      ".",
      "",
      "          ",
      "Plannora",
      "{brand}",
      "Check out {brand} today friends",
      "I work on a product.",
      "x".repeat(201),
    ])
      expect(isValidDisclosureLine(bad, "Plannora"), bad).toBe(false);
  });

  it("substitutes the brand", () => {
    expect(resolveDisclosure("Full disclosure: I work on {brand}.", " Plannora ")).toBe(
      "Full disclosure: I work on Plannora.",
    );
  });
});

describe("answers first", () => {
  it("lets the disclosure open the reply", () => {
    expect(state(SHOWCASE, "answers_first")).toBe("pass");
  });

  it("fails a reply that pitches before it helps", () => {
    const pitchy =
      "Full disclosure: I work on Plannora. Plannora has boards, automations and a free tier for up to five people, and it takes about two minutes to set up for a small team like yours.";
    expect(state(pitchy, "answers_first")).toBe("fail");
  });

  it("passes a reply that never pitches at all", () => {
    const helpful =
      "Full disclosure: I work on Plannora. For four people I would honestly start with a shared board in whatever you already pay for, and only move once that hurts. Trello is fine for that.";
    expect(state(helpful, "answers_first")).toBe("pass");
  });

  it("fails a reply that is only the disclosure", () => {
    expect(state("Full disclosure: I work on Plannora.", "answers_first")).toBe("fail");
  });
});

describe("links", () => {
  const lead =
    "Full disclosure: I work on Plannora. For a team of four I'd start with whatever has the lightest setup, then add structure later. ";

  it("counts links", () => {
    expect(
      countLinks("see https://a.example/x and www.b.example, plus [c](https://c.example)"),
    ).toBe(3);
    expect(countLinks("no links here.")).toBe(0);
  });

  it("fails more links than the budget", () => {
    expect(state(`${lead}See https://a.example and https://b.example.`, "link_budget")).toBe(
      "fail",
    );
    expect(state(`${lead}See https://a.example.`, "link_budget")).toBe("pass");
    expect(
      state(`${lead}See https://a.example.`, "link_budget", ctx({ maxLinksPerReply: 0 })),
    ).toBe("fail");
  });

  it("fails a link in the opening sentence", () => {
    expect(state(`Check https://plannora.example first. ${lead}`, "link_budget")).toBe("fail");
  });

  it("fails a reply that is mostly a link", () => {
    expect(state("I work on Plannora: https://plannora.example/pricing", "link_budget")).toBe(
      "fail",
    );
  });
});

describe("subreddit rules — the three-state check", () => {
  it("is unknown, never a pass, when the rules could not be read", () => {
    const report = checkReply(SHOWCASE, ctx({ rulesKnown: false, rules: [] }));
    const rule = report.checks.find((c) => c.id === "subreddit_rules");
    expect(rule?.state).toBe("unknown");
    expect(rule?.detail).toMatch(/couldn't read r\/startups/);
  });

  it("does not let an unknown block the reply, but does not hide it either", () => {
    const report = checkReply(SHOWCASE, ctx({ rulesKnown: false, rules: [] }));
    expect(report.pass).toBe(true);
    expect(report.unknowns).toBe(1);
    expect(complianceSummary(report)).toBe("6 of 7 checks pass · 1 we couldn't run");
  });

  it("is unknown for a ratio rule — only the member can see their history", () => {
    expect(
      state(
        SHOWCASE,
        "subreddit_rules",
        ctx({ rules: ["Follow the 9:1 rule for self-promotion."] }),
      ),
    ).toBe("unknown");
  });

  it("fails where self-promotion is banned, quoting the rule", () => {
    const report = checkReply(SHOWCASE, ctx({ rules: ["No self-promotion of any kind."] }));
    const rule = report.checks.find((c) => c.id === "subreddit_rules");
    expect(rule?.state).toBe("fail");
    expect(rule?.detail).toContain("No self-promotion of any kind.");
    expect(report.pass).toBe(false);
  });

  it("fails a link where the subreddit bans links, and only then", () => {
    const noLinks = ctx({ rules: ["No links in comments."] });
    expect(state(SHOWCASE, "subreddit_rules", noLinks)).toBe("pass");
    expect(state(`${SHOWCASE} More at https://plannora.example.`, "subreddit_rules", noLinks)).toBe(
      "fail",
    );
  });
});

describe("length", () => {
  it("fails a drive-by and an essay", () => {
    expect(state("I work on Plannora. Try it.", "length")).toBe("fail");
    expect(state(`${SHOWCASE} ${"More detail here. ".repeat(200)}`, "length")).toBe("fail");
    expect(`${SHOWCASE} ${"More detail here. ".repeat(200)}`.length).toBeGreaterThan(
      MAX_DRAFT_CHARS,
    );
  });
});

describe("voice", () => {
  it("fails ad copy and names what it found", () => {
    const ad = `${SHOWCASE} It's a revolutionary, game-changing platform — sign up today!!`;
    const v = checkReply(ad, ctx()).checks.find((c) => c.id === "no_marketing_voice");
    expect(v?.state).toBe("fail");
    expect(v?.detail).toMatch(/game-changer|revolutionary/);
  });

  it("does not flag ordinary words", () => {
    expect(state(SHOWCASE, "no_marketing_voice")).toBe("pass");
  });
});

describe("competitors", () => {
  it("fails trash talk about a named competitor", () => {
    expect(state(`${SHOWCASE} Asana is garbage for small teams.`, "no_competitor_smear")).toBe(
      "fail",
    );
  });

  it("allows an honest comparison and praise", () => {
    expect(
      state(`${SHOWCASE} Asana is heavier than you need at four people.`, "no_competitor_smear"),
    ).toBe("pass");
  });

  it("says so when there is nobody on file to check against", () => {
    const c = checkReply(SHOWCASE, ctx({ competitors: [] })).checks.find(
      (k) => k.id === "no_competitor_smear",
    );
    expect(c?.state).toBe("pass");
    expect(c?.detail).toMatch(/No named competitors/);
  });
});

describe("mechanicalFailures", () => {
  it("offers only the failures a re-ask could fix", () => {
    const report = checkReply("Plannora is revolutionary.", ctx({ rules: ["No self-promotion."] }));
    const ids = mechanicalFailures(report);
    expect(ids).toContain("disclosure");
    expect(ids).toContain("length");
    expect(ids).not.toContain("subreddit_rules");
  });
});
