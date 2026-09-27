import { describe, expect, it } from "vitest";
import { safeRedirectPath } from "./safe-redirect";

describe("safeRedirectPath", () => {
  it("keeps a path on this site, query string included", () => {
    expect(safeRedirectPath("/oauth/consent?authorization_id=abc-123")).toBe(
      "/oauth/consent?authorization_id=abc-123",
    );
    expect(safeRedirectPath("/dashboard")).toBe("/dashboard");
  });

  it("refuses anything that could leave the site", () => {
    for (const bad of [
      "//evil.com",
      "//evil.com/oauth/consent",
      "/\\evil.com",
      "/\t/evil.com",
      "/\n/evil.com",
      "https://evil.com",
      "javascript:alert(1)",
      "evil.com",
      "",
    ]) {
      expect(safeRedirectPath(bad), JSON.stringify(bad)).toBeUndefined();
    }
  });

  it("refuses non-strings", () => {
    expect(safeRedirectPath(undefined)).toBeUndefined();
    expect(safeRedirectPath(["/dashboard"])).toBeUndefined();
  });
});
