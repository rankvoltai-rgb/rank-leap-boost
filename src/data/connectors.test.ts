import { readdirSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  CATEGORIES,
  CONNECTORS,
  MCP_URL,
  NOT_SUPPORTED,
  searchConnectors,
  unsupportedMatch,
} from "./connectors";
import { PUBLISH_PLATFORMS } from "./platforms";
import { SIMPLE_MARKS } from "@/components/dashboard/connector-marks";

describe("connector library", () => {
  it("has unique ids, since the overlay is addressed by ?connector=id", () => {
    const ids = CONNECTORS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("lists every publishing platform once, as a site connector", () => {
    for (const p of PUBLISH_PLATFORMS) {
      const matches = CONNECTORS.filter((c) => c.platformId === p.id);
      expect(matches, p.id).toHaveLength(1);
      expect(matches[0].kind).toBe("site");
    }
  });

  it("gives every MCP connector numbered steps that carry the server URL", () => {
    for (const c of CONNECTORS.filter((c) => c.kind === "mcp")) {
      expect(c.steps.length, c.id).toBeGreaterThan(0);
      const snippets = [...c.steps, ...(c.alternative ? [c.alternative] : [])]
        .map((s) => s.snippet?.value ?? "")
        .join("\n");
      expect(snippets, c.id).toContain(MCP_URL);
    }
  });

  it("never asks for a key on the MCP server, which doesn't take one", () => {
    for (const c of CONNECTORS.filter((c) => c.kind === "mcp")) {
      // Steps may say to leave a key field empty; no snippet may put one in.
      const snippets = [...c.steps, ...(c.alternative ? [c.alternative] : [])]
        .map((s) => s.snippet?.value ?? "")
        .join(" ");
      expect(snippets, c.id).not.toMatch(/authorization|bearer|api[_-]?key/i);
    }
  });

  it("links every connector to documentation over https", () => {
    for (const c of CONNECTORS) expect(c.docsUrl, c.id).toMatch(/^https:\/\//);
  });

  it("keeps config snippets valid JSON where they are JSON", () => {
    for (const c of CONNECTORS) {
      for (const s of [...c.steps, ...(c.alternative ? [c.alternative] : [])]) {
        if (s.snippet?.kind === "config" && s.snippet.value.trim().startsWith("{")) {
          expect(() => JSON.parse(s.snippet!.value), c.id).not.toThrow();
        }
      }
    }
  });

  it("puts every connector in a known category, with marks that exist", () => {
    const cats = new Set(CATEGORIES.map((c) => c.id));
    for (const c of CONNECTORS) {
      expect(cats.has(c.category), c.id).toBe(true);
      if ("simple" in c.mark) expect(SIMPLE_MARKS[c.mark.simple], c.id).toBeDefined();
    }
  });

  it("doesn't list a tool it also says can't connect", () => {
    const listed = new Set(CONNECTORS.map((c) => c.name.toLowerCase()));
    for (const t of NOT_SUPPORTED) expect(listed.has(t.name.toLowerCase()), t.name).toBe(false);
  });
});

describe("connector search", () => {
  it("finds a tool by name, alias, and maker", () => {
    expect(searchConnectors("lovable")[0].id).toBe("lovable");
    expect(searchConnectors("windsurf")[0].id).toBe("devin-desktop");
    expect(searchConnectors("vs code").map((c) => c.id)).toContain("github-copilot");
    expect(searchConnectors("anthropic").map((c) => c.id)).toEqual(
      expect.arrayContaining(["claude", "claude-code"]),
    );
  });

  it("ranks name matches above mentions", () => {
    const ids = searchConnectors("claude").map((c) => c.id);
    expect(ids.slice(0, 2)).toEqual(["claude", "claude-code"]);
  });

  it("explains a tool that can't connect instead of coming up empty", () => {
    expect(unsupportedMatch("rocket")?.name).toBe("Rocket");
    expect(unsupportedMatch("rocket.new")?.name).toBe("Rocket");
  });

  it("doesn't shadow a real connector with a not-supported note", () => {
    expect(unsupportedMatch("webflow")).toBeUndefined();
    expect(unsupportedMatch("framer")).toBeUndefined();
  });
});

describe("connector icons", () => {
  const dir = "src/assets/connectors";
  const files = readdirSync(dir).filter((f) => f.endsWith(".webp"));

  it("names every icon after a connector that exists", () => {
    const ids = new Set(CONNECTORS.map((c) => c.id));
    for (const f of files) expect(ids.has(f.replace(/\.webp$/, "")), f).toBe(true);
  });

  // They load lazily and cache for a year, but a stray full-size PNG would
  // still cost every first visit.
  it("keeps every icon small", () => {
    for (const f of files) expect(statSync(`${dir}/${f}`).size, f).toBeLessThan(8 * 1024);
  });
});
