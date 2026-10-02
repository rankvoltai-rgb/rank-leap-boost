import { describe, expect, it } from "vitest";
import { checkRobots, parseRobots } from "@/lib/robots";

/**
 * Group selection follows RFC 9309: a group applies when its user-agent token
 * matches the crawler's product token. A shorter crawler name must never pick
 * up a longer, more specific group ("Applebot" is not "Applebot-Extended").
 */
describe("checkRobots group matching", () => {
  const blockTrainingOnly = parseRobots(
    ["User-agent: Applebot-Extended", "Disallow: /", "", "User-agent: *", "Allow: /"].join("\n"),
  );

  it("doesn't apply a longer token's group to a shorter crawler name", () => {
    expect(checkRobots(blockTrainingOnly, "Applebot", "/pricing").allowed).toBe(true);
    expect(checkRobots(blockTrainingOnly, "Applebot-Extended", "/pricing").allowed).toBe(false);
  });

  it("still lets a specific crawler fall back to its parent's group", () => {
    const file = parseRobots(["User-agent: Googlebot", "Disallow: /private/"].join("\n"));
    expect(checkRobots(file, "Googlebot-Image", "/private/a.png").allowed).toBe(false);
  });

  it("prefers the crawler's own group over its parent's", () => {
    const file = parseRobots(
      ["User-agent: Googlebot", "Disallow: /", "", "User-agent: Googlebot-Image", "Allow: /"].join(
        "\n",
      ),
    );
    expect(checkRobots(file, "Googlebot-Image", "/a.png").allowed).toBe(true);
    expect(checkRobots(file, "Googlebot", "/a.png").allowed).toBe(false);
  });

  it("keeps User-agent lines together across Crawl-delay and other unknown lines", () => {
    const file = parseRobots(
      ["User-agent: ClaudeBot", "Crawl-delay: 10", "", "User-agent: GPTBot", "Disallow: /"].join(
        "\n",
      ),
    );
    expect(checkRobots(file, "ClaudeBot", "/").allowed).toBe(false);
    const signal = parseRobots(
      [
        "User-agent: ClaudeBot",
        "Content-Signal: search=yes, ai-train=no",
        "User-agent: GPTBot",
        "Disallow: /",
      ].join("\n"),
    );
    expect(checkRobots(signal, "ClaudeBot", "/").allowed).toBe(false);
  });

  it("matches the product token exactly, ignoring a version suffix", () => {
    const partial = parseRobots(["User-agent: Claude", "Disallow: /"].join("\n"));
    expect(checkRobots(partial, "ClaudeBot", "/").allowed).toBe(true);
    const versioned = parseRobots(["User-agent: GPTBot/1.4", "Disallow: /"].join("\n"));
    expect(checkRobots(versioned, "GPTBot", "/").allowed).toBe(false);
  });

  it("merges groups that name the same bot, including a CDN-prepended block", () => {
    const file = parseRobots(
      [
        "User-Agent: *",
        "Content-signal: search=yes, ai-train=no",
        "Allow: /",
        "User-agent: GPTBot",
        "Disallow: /",
        "User-agent: *",
        "Disallow: /lp",
        "",
        "User-agent: GPTBot",
        "Allow: /",
      ].join("\n"),
    );
    expect(checkRobots(file, "Googlebot", "/lp").allowed).toBe(false);
    expect(checkRobots(file, "Googlebot", "/blog").allowed).toBe(true);
    // Disallow: / and Allow: / tie on length, and Allow wins a tie.
    expect(checkRobots(file, "GPTBot", "/blog").allowed).toBe(true);
  });

  it("applies Googlebot's rules to Applebot when Applebot isn't named, as Apple documents", () => {
    const file = parseRobots(
      ["User-agent: Googlebot", "Disallow: /assets/", "", "User-agent: *", "Allow: /"].join("\n"),
    );
    expect(checkRobots(file, "Applebot", "/assets/app.js").allowed).toBe(false);
    expect(checkRobots(file, "Applebot", "/pricing").allowed).toBe(true);
  });
});
