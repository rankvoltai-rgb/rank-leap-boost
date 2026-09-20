import { describe, expect, it } from "vitest";
import {
  ensureOutboundLink,
  findOutboundLink,
  linkedUrls,
  outboundLinkDirective,
} from "./link-insert";

const LINK = {
  url: "https://acme.example/project-management-guide",
  anchor: "project management guide",
  topic: "project management for small teams",
};

const para = (s: string) =>
  s
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .join(" ");

const ARTICLE = `# How to Run Sprint Planning for Remote Teams

${para(`Sprint planning for remote teams answers one question: what will this team ship in the next two
weeks, and how will everyone know? This opening paragraph is the direct answer that answer engines quote, so
it stays clean and focused on the query itself.`)}

## Key Takeaways

- Timebox the meeting to two hours for a two-week sprint.
- Every story needs an owner before the meeting ends.

## Why Sprint Planning Breaks Down Remotely

${para(`Most remote sprint planning fails for a boring reason: nobody prepared the backlog. A good project
management guide will tell you the same thing, but teams skip it anyway because the calendar invite feels
like the preparation. The fix is a written agenda shared the day before, with the candidate stories already
estimated and ordered by the product owner.`)}

${para(`Time zones make this worse. When half the team is asleep during the meeting, decisions get made by
whoever is awake, and the rest discover them in Slack. Async pre-reads and a recorded summary are the two
habits that consistently close that gap for distributed teams.`)}

\`\`\`
const sprint = { length: 14, capacity: team.map(m => m.hours) }
\`\`\`

## Watch: Sprint planning walkthrough

<iframe width="560" height="315" src="https://www.youtube.com/embed/abc"></iframe>

[Sprint planning walkthrough](https://youtube.com/watch?v=abc)

## Frequently Asked Questions

### How long should sprint planning take?

${para(`Two hours for a two-week sprint is the common rule of thumb, and most teams that keep a groomed
backlog finish well inside it. This paragraph is long enough to be eligible on words alone, which is exactly
why the section rule has to exclude it.`)}

## References

- [Scrum Guide](https://scrumguides.org) — the official definition of sprint planning.
`;

describe("findOutboundLink", () => {
  it("finds markdown and html links by normalised url", () => {
    expect(
      findOutboundLink("see [x](https://www.acme.example/project-management-guide/)", LINK.url),
    ).toBe(true);
    expect(
      findOutboundLink(
        '<a href="http://acme.example/project-management-guide?utm_source=a">x</a>',
        LINK.url,
      ),
    ).toBe(true);
    expect(findOutboundLink("see [x](https://acme.example/other)", LINK.url)).toBe(false);
  });
  it("lists every linked url", () => {
    expect(linkedUrls('[a](https://a.example) and <a href="https://b.example">b</a>')).toEqual([
      "https://a.example",
      "https://b.example",
    ]);
  });
});

describe("ensureOutboundLink", () => {
  it("leaves an article alone when the model already placed the link", () => {
    const body = ARTICLE.replace(
      "A good project\nmanagement guide",
      "A good [project management guide](https://acme.example/project-management-guide)",
    );
    const withLink = ARTICLE.replace(
      "A good project management guide",
      `A good [${LINK.anchor}](${LINK.url})`,
    );
    const result = ensureOutboundLink(withLink, LINK);
    expect(result.method).toBe("model");
    expect(result.body).toBe(withLink);
    void body;
  });

  it("wraps the anchor phrase where the article already says it", () => {
    const result = ensureOutboundLink(ARTICLE, LINK);
    expect(result.ok).toBe(true);
    expect(result.method).toBe("anchor-wrap");
    expect(result.body).toContain(`A good [project management guide](${LINK.url}) will tell you`);
    // Exactly one link, and nothing else changed.
    expect(result.body.split(LINK.url).length - 1).toBe(1);
    expect(
      result.body.replace(`[project management guide](${LINK.url})`, "project management guide"),
    ).toBe(ARTICLE);
  });

  it("appends one sentence to the most relevant body paragraph when the anchor is absent", () => {
    const link = {
      ...LINK,
      anchor: "async standup template",
      topic: "asynchronous standups across time zones",
    };
    const result = ensureOutboundLink(ARTICLE, link);
    expect(result.ok).toBe(true);
    expect(result.method).toBe("sentence-append");
    const line = result.body.split("\n").find((l) => l.includes(link.url));
    expect(line).toBeDefined();
    // The time-zone paragraph is the closest match to the topic.
    expect(line).toContain("Time zones make this worse.");
    expect(line).toMatch(
      new RegExp(
        `\\[async standup template\\]\\(${link.url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\)`,
      ),
    );
  });

  it("never links inside the lead, key takeaways, faq, references, code, headings or the video block", () => {
    // Force the anchor to appear only in places that must be skipped.
    const anchor = "sprint planning";
    const result = ensureOutboundLink(ARTICLE, { url: LINK.url, anchor, topic: "sprint planning" });
    expect(result.ok).toBe(true);
    const lines = result.body.split("\n");
    const linked = lines.filter((l) => l.includes(LINK.url));
    expect(linked).toHaveLength(1);
    const [line] = linked;
    expect(line.startsWith("#")).toBe(false);
    expect(line.startsWith("-")).toBe(false);
    expect(line.includes("<iframe")).toBe(false);
    expect(line.includes("const sprint")).toBe(false);
    expect(line.includes("Two hours for a two-week sprint")).toBe(false);
    expect(line.includes("Scrum Guide")).toBe(false);
    // "Sprint planning for remote teams answers one question" is the lead; it
    // says the anchor but a body paragraph is preferred.
    expect(line.startsWith("Sprint planning for remote teams answers")).toBe(false);
  });

  it("does not wrap an anchor that is already part of another link", () => {
    const body = `## Section\n\n${"Words ".repeat(20)}Read the [project management guide from Atlassian](https://atlassian.example/pm) before the meeting so everyone has the same context, then come back to this article for the remote-specific parts.`;
    const result = ensureOutboundLink(body, LINK);
    expect(result.ok).toBe(true);
    expect(result.method).toBe("sentence-append");
    expect(result.body).toContain(
      "[project management guide from Atlassian](https://atlassian.example/pm)",
    );
  });

  it("fails cleanly rather than forcing a link into an article with no eligible prose", () => {
    const body = `# Title\n\n- one\n- two\n\n## References\n\n${"A long paragraph of references text. ".repeat(10)}`;
    const result = ensureOutboundLink(body, LINK);
    expect(result.ok).toBe(false);
    expect(result.method).toBe("failed");
    expect(result.body).toBe(body);
  });

  it("fails on an empty anchor or url", () => {
    expect(ensureOutboundLink(ARTICLE, { url: "", anchor: "x" }).ok).toBe(false);
    expect(ensureOutboundLink(ARTICLE, { url: LINK.url, anchor: " " }).ok).toBe(false);
  });
});

describe("outboundLinkDirective", () => {
  it("names the url and anchor and forbids the wrong places", () => {
    const d = outboundLinkDirective(LINK);
    expect(d).toContain(`[${LINK.anchor}](${LINK.url})`);
    expect(d).toMatch(/Never put it in the opening answer/);
    expect(d).toMatch(/once only/);
  });
});
