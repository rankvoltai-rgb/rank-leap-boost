import { describe, expect, it } from "vitest";
import { domainOf, isOnDomain, normalizeDomain, normalizeLinkUrl, sameLink } from "./domain";

describe("normalizeDomain", () => {
  it("strips scheme, www, path, port and case", () => {
    expect(normalizeDomain("https://www.Example.com/blog?x=1#top")).toBe("example.com");
    expect(normalizeDomain("example.com:8080")).toBe("example.com");
    expect(normalizeDomain("  EXAMPLE.CO.UK ")).toBe("example.co.uk");
  });
  it("keeps subdomains other than www", () => {
    expect(normalizeDomain("blog.example.com")).toBe("blog.example.com");
  });
  it("rejects what is not a domain", () => {
    expect(normalizeDomain("")).toBe("");
    expect(normalizeDomain("localhost")).toBe("");
    expect(normalizeDomain("not a domain")).toBe("");
    expect(normalizeDomain("192.168.1.1")).toBe("");
    expect(normalizeDomain("ftp://example.com")).toBe("");
  });
  it("punycodes an IDN", () => {
    expect(normalizeDomain("bücher.example")).toBe("xn--bcher-kva.example");
  });
});

describe("isOnDomain", () => {
  it("accepts the apex and its subdomains", () => {
    expect(isOnDomain("https://example.com/page", "example.com")).toBe(true);
    expect(isOnDomain("https://www.example.com/page", "example.com")).toBe(true);
    expect(isOnDomain("https://docs.example.com/page", "example.com")).toBe(true);
  });
  it("rejects lookalikes", () => {
    expect(isOnDomain("https://example.com.evil.com/page", "example.com")).toBe(false);
    expect(isOnDomain("https://notexample.com/page", "example.com")).toBe(false);
    expect(domainOf("https://evil.com/?u=example.com")).toBe("evil.com");
  });
});

describe("normalizeLinkUrl / sameLink", () => {
  it("ignores scheme, www, fragment, tracking params and trailing slash", () => {
    expect(sameLink("http://www.example.com/a/b/", "https://example.com/a/b#x?utm_source=z")).toBe(
      true,
    );
    expect(sameLink("https://example.com/a?utm_medium=m&b=2", "https://example.com/a?b=2")).toBe(
      true,
    );
  });
  it("orders query parameters", () => {
    expect(normalizeLinkUrl("https://example.com/p?b=2&a=1")).toBe("example.com/p?a=1&b=2");
  });
  it("still tells different pages apart", () => {
    expect(sameLink("https://example.com/a", "https://example.com/b")).toBe(false);
    expect(sameLink("https://example.com/a?id=1", "https://example.com/a?id=2")).toBe(false);
    expect(sameLink("https://example.com/a", "https://other.com/a")).toBe(false);
  });
  it("is empty for junk", () => {
    expect(normalizeLinkUrl("javascript:alert(1)")).toBe("");
    expect(normalizeLinkUrl("")).toBe("");
  });
});
