import { describe, expect, it } from "vitest";
import {
  buildCustomCode,
  buildSeoGraph,
  escapeJsonLd,
  isRankboxCustomCode,
  type SeoGraphOptions,
} from "./seo";
import { emptyLedger } from "./ledger";
import { article } from "./fixtures";

const base: Omit<SeoGraphOptions, "articles"> = {
  productionUrl: "https://brightloop.app",
  blogPath: "/blog",
  brandName: "Brightloop",
  ledger: emptyLedger(),
};

function graph(articles = [article()], extra: Partial<typeof base> = {}) {
  return buildSeoGraph({ ...base, ...extra, articles });
}

function nodes(g: ReturnType<typeof buildSeoGraph>) {
  return (g?.["@graph"] as Array<Record<string, unknown>>) ?? [];
}

describe("buildSeoGraph", () => {
  it("returns null without a usable production URL", () => {
    expect(graph([article()], { productionUrl: "" })).toBeNull();
    expect(graph([article()], { productionUrl: "nonsense" })).toBeNull();
  });

  it("always describes the organisation, site and blog", () => {
    const types = nodes(graph()).map((n) => n["@type"]);
    expect(types.slice(0, 3)).toEqual(["Organization", "WebSite", "Blog"]);
  });

  it("emits a BlogPosting per article with its own URL", () => {
    const posts = nodes(graph()).filter((n) => n["@type"] === "BlogPosting");
    expect(posts).toHaveLength(1);
    expect(posts[0].url).toBe("https://brightloop.app/blog/how-to-price-a-saas-product-a1b2c3d4");
    expect(posts[0].mainEntityOfPage).toEqual({
      "@type": "WebPage",
      "@id": "https://brightloop.app/blog/how-to-price-a-saas-product-a1b2c3d4",
    });
  });

  it("uses the ledger's slug so schema URLs match the live pages", () => {
    const ledger = emptyLedger();
    ledger.items.a1 = { h: "x", slug: "original-slug" };
    const posts = nodes(graph([article({ slug: "renamed" })], { ledger })).filter(
      (n) => n["@type"] === "BlogPosting",
    );
    expect(posts[0].url).toBe("https://brightloop.app/blog/original-slug");
  });

  it("includes the logo only when there is one", () => {
    expect(nodes(graph())[0].logo).toBeUndefined();
    const withLogo = buildSeoGraph({
      ...base,
      articles: [article()],
      logoUrl: "https://cdn.example/logo.png",
    });
    expect(nodes(withLogo)[0].logo).toEqual({
      "@type": "ImageObject",
      url: "https://cdn.example/logo.png",
    });
  });

  it("caps the article nodes and keeps the newest", () => {
    const many = Array.from({ length: 10 }, (_, i) =>
      article({
        id: `a${i}`,
        slug: `post-${i}`,
        published_at: `2026-09-${String(i + 1).padStart(2, "0")}T00:00:00.000Z`,
      }),
    );
    const posts = nodes(buildSeoGraph({ ...base, articles: many, limit: 3 })).filter(
      (n) => n["@type"] === "BlogPosting",
    );
    expect(posts).toHaveLength(3);
    expect(posts[0].url).toBe("https://brightloop.app/blog/post-9");
  });

  it("falls back to the hostname when there is no brand name", () => {
    expect(nodes(graph([article()], { brandName: null }))[0].name).toBe("brightloop.app");
  });
});

describe("escapeJsonLd", () => {
  // A title containing </script> would otherwise close the tag early.
  it("neutralises anything that could break out of the script tag", () => {
    const escaped = escapeJsonLd('{"t":"</script><img onerror=x>"}');
    expect(escaped).not.toContain("</script>");
    expect(escaped).not.toContain("<");
    expect(escaped).not.toContain(">");
  });

  it("still parses back to the same value", () => {
    const original = { t: "</script> & <b>" };
    const escaped = escapeJsonLd(JSON.stringify(original));
    expect(JSON.parse(escaped)).toEqual(original);
  });
});

describe("buildCustomCode", () => {
  it("wraps the graph in a JSON-LD script tag", () => {
    const html = buildCustomCode({ ...base, articles: [article()] });
    expect(html).toContain('<script type="application/ld+json">');
    expect(html).toContain("Rankbox structured data");
  });

  it("escapes a hostile article title", () => {
    const html = buildCustomCode({
      ...base,
      articles: [article({ title: "</script><script>alert(1)</script>" })],
    });
    expect(html?.match(/<script/g)).toHaveLength(1);
  });

  it("is recognisable as ours, and other code is not", () => {
    expect(isRankboxCustomCode(buildCustomCode({ ...base, articles: [article()] }))).toBe(true);
    expect(isRankboxCustomCode("<script>someone else</script>")).toBe(false);
    expect(isRankboxCustomCode(null)).toBe(false);
  });
});
