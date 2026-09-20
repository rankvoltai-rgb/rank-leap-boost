import { describe, expect, it } from "vitest";
import { bodyRegion, extractAnchors, judgePage } from "./verify-link.server";

const PAGE = "https://host.example/blog/sprint-planning";
const TARGET = "https://acme.example/project-management-guide";

const filler = "Sprint planning works best when the backlog is groomed beforehand. ".repeat(12);

const page = (article: string, extras: { head?: string; footer?: string } = {}) => `<!doctype html>
<html><head><title>Post</title>${extras.head ?? ""}</head>
<body>
<header><nav><a href="/">Home</a><a href="/blog">Blog</a></nav></header>
<main><article><h1>Sprint planning</h1><p>${filler}</p>${article}<p><a href="https://scrumguides.org">Scrum Guide</a></p></article></main>
<footer>${extras.footer ?? '<a href="/privacy">Privacy</a>'}</footer>
</body></html>`;

describe("bodyRegion / extractAnchors", () => {
  it("drops chrome, scripts and comments", () => {
    const region = bodyRegion(
      page(
        `<p><a href="${TARGET}">guide</a></p><script>var a = "<a href='x'>";</script><!-- <a href="y">y</a> -->`,
      ),
    );
    const hrefs = extractAnchors(region).map((a) => a.href);
    expect(hrefs).toContain(TARGET);
    expect(hrefs).not.toContain("/privacy");
    expect(hrefs).not.toContain("/blog");
    expect(hrefs).not.toContain("y");
  });
  it("reads href and rel in any quoting or order", () => {
    const a = extractAnchors(`<a rel='nofollow noopener' class=x href=${TARGET}>t</a>`)[0];
    expect(a.href).toBe(TARGET);
    expect(a.rel).toBe("nofollow noopener");
  });
});

describe("judgePage", () => {
  it("passes a followed link in the article body", () => {
    const r = judgePage(
      page(`<p>See the <a href="${TARGET}/?utm_source=x">project management guide</a>.</p>`),
      PAGE,
      TARGET,
      false,
    );
    expect(r.outcome).toBe("live");
  });
  it("accepts rel values that still pass authority", () => {
    const r = judgePage(
      page(`<p><a rel="noopener noreferrer" target="_blank" href="${TARGET}">g</a></p>`),
      PAGE,
      TARGET,
      false,
    );
    expect(r.outcome).toBe("live");
  });
  it.each(["nofollow", "sponsored", "ugc", "noopener nofollow"])("fails rel=%s", (rel) => {
    const r = judgePage(page(`<p><a rel="${rel}" href="${TARGET}">g</a></p>`), PAGE, TARGET, false);
    expect(r.outcome).toBe("nofollow");
  });
  it("fails a link that is only in the footer", () => {
    const r = judgePage(
      page("<p>No link here.</p>", { footer: `<a href="${TARGET}">partner</a>` }),
      PAGE,
      TARGET,
      false,
    );
    expect(r.outcome).toBe("missing");
    expect(r.detail).toMatch(/navigation, header or footer/);
  });
  it("fails a noindex page and a cross-domain canonical", () => {
    const body = `<p><a href="${TARGET}">g</a></p>`;
    expect(
      judgePage(
        page(body, { head: '<meta name="robots" content="noindex, follow">' }),
        PAGE,
        TARGET,
        false,
      ).outcome,
    ).toBe("noindex");
    expect(
      judgePage(
        page(body, { head: '<link rel="canonical" href="https://elsewhere.example/post">' }),
        PAGE,
        TARGET,
        false,
      ).outcome,
    ).toBe("noindex");
    expect(
      judgePage(page(body, { head: `<link rel="canonical" href="${PAGE}">` }), PAGE, TARGET, false)
        .outcome,
    ).toBe("live");
  });
  it("calls a genuinely absent link missing", () => {
    expect(judgePage(page("<p>Nothing to see.</p>"), PAGE, TARGET, false).outcome).toBe("missing");
  });
  it("never calls it missing when the page was cut off", () => {
    expect(judgePage(page("<p>Nothing to see.</p>"), PAGE, TARGET, true).outcome).toBe("truncated");
  });
  it("never calls it missing on a JavaScript shell", () => {
    const shell =
      '<html><head></head><body><div id="root"></div><script src="/app.js"></script></body></html>';
    expect(judgePage(shell, PAGE, TARGET, false).outcome).toBe("truncated");
  });
  it("still finds the link on a truncated page that got far enough", () => {
    expect(judgePage(page(`<p><a href="${TARGET}">g</a></p>`), PAGE, TARGET, true).outcome).toBe(
      "live",
    );
  });
});
