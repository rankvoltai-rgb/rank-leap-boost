import { describe, expect, it } from "vitest";
import {
  FACT_PAGES,
  MARKDOWN_HTML_PHRASE,
  RENDER_VARIANTS,
  botFromUserAgent,
  experimentForPath,
  isTrialUrl,
  labProduct,
  trialArm,
} from "./experiments";
import { factPage, renderMarkdown, renderVariantPage, wantsMarkdown } from "./pages";

describe("botFromUserAgent", () => {
  it("names the specific bot, not the general one its name contains", () => {
    const ua = (token: string) =>
      `Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ${token}/1.0; +https://example.com`;
    expect(botFromUserAgent(ua("OAI-SearchBot"))).toBe("OAI-SearchBot");
    expect(botFromUserAgent(ua("ChatGPT-User"))).toBe("ChatGPT-User");
    expect(botFromUserAgent(ua("Claude-SearchBot"))).toBe("Claude-SearchBot");
    expect(botFromUserAgent(ua("Perplexity-User"))).toBe("Perplexity-User");
    expect(
      botFromUserAgent("Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)"),
    ).toBe("bingbot");
  });

  it("ignores browsers", () => {
    expect(
      botFromUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15",
      ),
    ).toBeNull();
    expect(botFromUserAgent(null)).toBeNull();
  });
});

describe("experimentForPath", () => {
  it("maps lab and blog paths, and nothing else", () => {
    expect(experimentForPath("/lab/ref/chatgpt-ios")).toBe("c1");
    expect(experimentForPath("/lab/render/csr")).toBe("b3");
    expect(experimentForPath("/lab/facts/7")).toBe("b5");
    expect(experimentForPath("/blog/ai-crawler-directory")).toBe("b6");
    expect(experimentForPath("/pricing")).toBeNull();
  });
});

describe("render variants", () => {
  it("gives every variant its own phrase", () => {
    const phrases = RENDER_VARIANTS.map((v) => v.phrase);
    expect(new Set([...phrases, MARKDOWN_HTML_PHRASE]).size).toBe(phrases.length + 1);
    expect(RENDER_VARIANTS).toHaveLength(10);
  });

  it("puts the phrase in the first HTML only where the variant says it should be", () => {
    // In the raw HTML, visible or not: server text, declarative shadow DOM,
    // noscript, hidden text, JSON-LD. Scripted variants only carry it inside
    // a script, never as page text before the script runs.
    const inRawHtml = new Set(["ssr", "declarative-shadow", "noscript", "hidden", "json-ld"]);
    for (const v of RENDER_VARIANTS) {
      const html = renderVariantPage(v);
      const withoutScripts = html.replace(/<script(?![^>]*ld\+json)[\s\S]*?<\/script>/g, "");
      if (v.slug === "fetch" || v.slug === "markdown") {
        expect(html, v.slug).not.toContain(v.phrase);
      } else {
        expect(withoutScripts.includes(v.phrase), v.slug).toBe(inRawHtml.has(v.slug));
      }
      expect(html, v.slug).toContain('name="robots" content="noindex"');
    }
  });

  it("serves the markdown phrase only as Markdown", () => {
    const md = RENDER_VARIANTS.find((v) => v.slug === "markdown")!;
    expect(renderMarkdown(md)).toContain(md.phrase);
    expect(renderVariantPage(md)).toContain(MARKDOWN_HTML_PHRASE);
  });

  it("negotiates Markdown only when it's preferred", () => {
    expect(wantsMarkdown("text/markdown")).toBe(true);
    expect(wantsMarkdown("text/markdown, text/html;q=0.9")).toBe(true);
    expect(wantsMarkdown("text/html, text/markdown;q=0.5")).toBe(false);
    expect(wantsMarkdown("text/html,application/xhtml+xml")).toBe(false);
    expect(wantsMarkdown("text/markdown;q=0")).toBe(false);
    expect(wantsMarkdown(null)).toBe(false);
  });
});

describe("fact pages", () => {
  it("builds the same fictional product every time", () => {
    expect(labProduct(42)).toEqual(labProduct(42));
    expect(labProduct(0)).toBeUndefined();
    expect(labProduct(FACT_PAGES + 1)).toBeUndefined();
  });

  it("splits the arms by odd and even id, and puts warranty only in JSON-LD", () => {
    const odd = labProduct(1)!;
    const even = labProduct(2)!;
    expect(odd.arm).toBe("jsonld");
    expect(even.arm).toBe("html");
    const oddHtml = factPage(odd);
    const evenHtml = factPage(even);
    expect(oddHtml).toContain('"@type":"Product"');
    expect(evenHtml).not.toContain("application/ld+json");
    const visible = oddHtml.replace(/<script[\s\S]*?<\/script>/g, "");
    expect(visible).not.toMatch(/warranty/i);
    expect(oddHtml).toContain('"unitCode":"MON"');
  });
});

describe("IndexNow trial", () => {
  it("only enrolls blog posts", () => {
    expect(isTrialUrl("https://rankbox.xyz/blog/ai-crawler-directory")).toBe(true);
    expect(isTrialUrl("https://rankbox.xyz/tools/robots-txt-tester")).toBe(false);
    expect(isTrialUrl("https://rankbox.xyz/blog")).toBe(false);
  });

  it("splits posts about evenly and never moves one", () => {
    const urls = Array.from({ length: 400 }, (_, i) => `https://rankbox.xyz/blog/post-${i}`);
    const indexnow = urls.filter((u) => trialArm(u) === "indexnow").length;
    expect(indexnow).toBeGreaterThan(160);
    expect(indexnow).toBeLessThan(240);
    expect(trialArm(urls[0])).toBe(trialArm(urls[0]));
  });
});
