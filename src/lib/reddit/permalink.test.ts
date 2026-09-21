import { describe, expect, it } from "vitest";
import { isRedditHost, parsePermalink, permalinkProblem } from "./permalink";

describe("parsePermalink", () => {
  it("reads a classic comment permalink", () => {
    expect(
      parsePermalink("https://www.reddit.com/r/startups/comments/1abc23/best_tool/kx9y8z7/"),
    ).toEqual({
      subreddit: "startups",
      postId: "1abc23",
      commentId: "kx9y8z7",
      canonical: "https://www.reddit.com/r/startups/comments/1abc23/comment/kx9y8z7/",
    });
  });

  it("reads the newer /comment/ form", () => {
    const p = parsePermalink("https://www.reddit.com/r/SaaS/comments/1abc23/comment/kx9y8z7/");
    expect(p?.subreddit).toBe("saas");
    expect(p?.commentId).toBe("kx9y8z7");
  });

  it("accepts Reddit's other hostnames and a missing scheme", () => {
    for (const host of [
      "old.reddit.com",
      "np.reddit.com",
      "new.reddit.com",
      "reddit.com",
      "m.reddit.com",
    ])
      expect(
        parsePermalink(`https://${host}/r/startups/comments/1abc23/slug/kx9y8z7/`)?.commentId,
        host,
      ).toBe("kx9y8z7");
    expect(parsePermalink("reddit.com/r/startups/comments/1abc23/slug/kx9y8z7")?.postId).toBe(
      "1abc23",
    );
  });

  it("strips tracking parameters from what it stores", () => {
    const p = parsePermalink(
      "https://www.reddit.com/r/startups/comments/1abc23/slug/kx9y8z7/?utm_source=share&context=3",
    );
    expect(p?.canonical).toBe("https://www.reddit.com/r/startups/comments/1abc23/comment/kx9y8z7/");
  });

  it("reads a link to the post itself as having no comment", () => {
    expect(
      parsePermalink("https://www.reddit.com/r/startups/comments/1abc23/best_tool/")?.commentId,
    ).toBeNull();
    expect(
      parsePermalink("https://www.reddit.com/r/startups/comments/1abc23/")?.commentId,
    ).toBeNull();
  });

  it("rejects hosts that only look like Reddit", () => {
    for (const bad of [
      "https://reddit.com.evil.tld/r/startups/comments/1abc23/slug/kx9y8z7/",
      "https://notreddit.com/r/startups/comments/1abc23/slug/kx9y8z7/",
      "https://evil.tld/reddit.com/r/startups/comments/1abc23/slug/kx9y8z7/",
      "https://www.reddit.com@evil.tld/r/startups/comments/1abc23/slug/kx9y8z7/",
      "https://user:pw@www.reddit.com/r/startups/comments/1abc23/slug/kx9y8z7/",
    ])
      expect(parsePermalink(bad), bad).toBeNull();
    expect(isRedditHost("reddit.com.evil.tld")).toBe(false);
    expect(isRedditHost("OLD.Reddit.com.")).toBe(true);
  });

  it("rejects other schemes, other pages and junk", () => {
    for (const bad of [
      "javascript:alert(1)",
      "ftp://www.reddit.com/r/startups/comments/1abc23/slug/kx9y8z7/",
      "https://www.reddit.com/r/startups/",
      "https://www.reddit.com/user/someone/",
      "https://www.reddit.com/r/startups/comments/../../etc/",
      "https://www.reddit.com/r/startups/comments/1abc23/slug/not-an-id!/",
      "",
      "   ",
      "hello",
    ])
      expect(parsePermalink(bad), bad).toBeNull();
    expect(parsePermalink(null)).toBeNull();
  });
});

describe("permalinkProblem", () => {
  const good = "https://www.reddit.com/r/startups/comments/1abc23/slug/kx9y8z7/";

  it("passes a comment on the right thread", () => {
    expect(permalinkProblem(good, "1abc23")).toBeNull();
    expect(permalinkProblem(good, "1ABC23")).toBeNull();
  });

  it("refuses a comment on a different thread", () => {
    expect(permalinkProblem(good, "zzz999")).toMatch(/different thread/);
  });

  it("explains a link to the thread rather than the comment", () => {
    expect(
      permalinkProblem("https://www.reddit.com/r/startups/comments/1abc23/slug/", "1abc23"),
    ).toMatch(/not to your comment/);
  });

  it("explains an opaque share link instead of calling it invalid", () => {
    expect(permalinkProblem("https://www.reddit.com/r/startups/s/AbCdEf123", "1abc23")).toMatch(
      /share link/,
    );
    expect(permalinkProblem("https://redd.it/1abc23", "1abc23")).toMatch(/share link/);
  });

  it("handles empty and hostile input", () => {
    expect(permalinkProblem("", "1abc23")).toMatch(/Paste/);
    expect(
      permalinkProblem("https://reddit.com.evil.tld/r/s/comments/1abc23/x/kx9y8z7/", "1abc23"),
    ).toMatch(/doesn't look like/);
  });
});
