/**
 * The docs' rules, enforced: every page has the frontmatter the site and the
 * agent index need, every link between pages lands on a real page and a real
 * heading, and nothing describes itself as unreleased.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DOCS_SECTIONS } from "@/data/docs";
import { PUBLISH_PLATFORMS } from "@/data/platforms";
import { parseFrontmatter } from "@/lib/markdown-blocks";
import { renderDoc, slugifyHeading } from "@/lib/docs/render";
import { highlight } from "@/lib/docs/highlight";
import { absolutizeLinks } from "@/lib/docs/content.server";

const ROOT = "src/content/docs";
const FOLDERS = readdirSync(ROOT).filter((f) => statSync(`${ROOT}/${f}`).isDirectory());

const unquote = (v = "") => v.replace(/^(["'])(.*)\1$/, "$2");

const PAGES = FOLDERS.flatMap((section) =>
  readdirSync(`${ROOT}/${section}`)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = readFileSync(`${ROOT}/${section}/${file}`, "utf8");
      const { data, body } = parseFrontmatter(raw);
      const fm = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, unquote(v)]));
      return { section, slug: file.replace(/\.md$/, ""), fm, body, raw };
    }),
);

const BY_PATH = new Map(PAGES.map((p) => [`/docs/${p.section}/${p.slug}`, p]));
const ANCHORS = new Map(
  PAGES.map((p) => [
    `/docs/${p.section}/${p.slug}`,
    new Set(renderDoc(p.body).headings.map((h) => h.id)),
  ]),
);
/** Ids of every heading level, for anchors that point at an h4. */
const ALL_IDS = new Map(
  PAGES.map((p) => [
    `/docs/${p.section}/${p.slug}`,
    new Set([...renderDoc(p.body).html.matchAll(/<h[2-4] id="([^"]+)"/g)].map((m) => m[1])),
  ]),
);

/** Markdown links outside fenced code. */
function links(body: string): string[] {
  const prose = body.replace(/```[\s\S]*?```/g, "");
  return [...prose.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)].map((m) => m[1]);
}

describe("docs structure", () => {
  it("only has folders for listed sections", () => {
    const listed = DOCS_SECTIONS.map((s) => s.slug);
    for (const f of FOLDERS) expect(listed, `src/content/docs/${f}`).toContain(f);
  });

  it("has pages in every listed section", () => {
    for (const s of DOCS_SECTIONS) {
      expect(
        PAGES.some((p) => p.section === s.slug),
        s.slug,
      ).toBe(true);
    }
  });

  it("gives every page the frontmatter the site and llms.txt read", () => {
    for (const p of PAGES) {
      const where = `${p.section}/${p.slug}`;
      expect(p.fm.title, where).toBeTruthy();
      expect(p.fm.description?.length ?? 0, `${where} description`).toBeGreaterThanOrEqual(60);
      expect(p.fm.description.length, `${where} description`).toBeLessThanOrEqual(220);
      expect(Number(p.fm.order), `${where} order`).toBeGreaterThan(0);
      expect(p.fm.updated, `${where} updated`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      if (p.fm.nav_title)
        expect(p.fm.nav_title.length, `${where} nav_title`).toBeLessThanOrEqual(32);
    }
  });

  it("orders pages uniquely inside each section", () => {
    for (const s of DOCS_SECTIONS) {
      const orders = PAGES.filter((p) => p.section === s.slug).map((p) => p.fm.order);
      expect(new Set(orders).size, s.slug).toBe(orders.length);
    }
  });

  it("leaves the h1 to the page title", () => {
    for (const p of PAGES) {
      const prose = p.body.replace(/```[\s\S]*?```/g, "");
      expect(prose, `${p.section}/${p.slug}`).not.toMatch(/^# /m);
    }
  });

  it("names a language on every code fence", () => {
    for (const p of PAGES) {
      const fences = [...p.body.matchAll(/^```(.*)$/gm)].map((m) => m[1].trim());
      // Fences alternate open/close; only the openers carry a language.
      const openers = fences.filter((_, i) => i % 2 === 0);
      for (const info of openers) expect(info, `${p.section}/${p.slug}`).not.toBe("");
    }
  });
});

describe("docs links", () => {
  it("links only to docs pages and headings that exist", () => {
    const broken: string[] = [];
    for (const p of PAGES) {
      const self = `/docs/${p.section}/${p.slug}`;
      for (const href of links(p.body)) {
        if (href.startsWith("#")) {
          if (!ALL_IDS.get(self)!.has(href.slice(1))) broken.push(`${self} → ${href}`);
          continue;
        }
        if (!href.startsWith("/docs")) continue;
        const [path, hash] = href.split("#");
        if (/\.(md|txt)$/.test(path) || path === "/docs") continue;
        const sectionOnly = /^\/docs\/[^/]+\/?$/.test(path);
        if (sectionOnly) {
          const slug = path.split("/")[2];
          if (!DOCS_SECTIONS.some((s) => s.slug === slug)) broken.push(`${self} → ${href}`);
          continue;
        }
        if (!BY_PATH.has(path)) broken.push(`${self} → ${href}`);
        else if (hash && !ALL_IDS.get(path)!.has(hash))
          broken.push(`${self} → ${href} (no heading)`);
      }
    }
    expect(broken).toEqual([]);
  });

  it("uses availability directives only for real platforms", () => {
    const ids = new Set(PUBLISH_PLATFORMS.map((p) => p.id));
    for (const p of PAGES) {
      for (const m of p.body.matchAll(/\{\{availability:([a-z-]+)\}\}/g)) {
        expect(ids.has(m[1] as never), `${p.section}/${p.slug}: ${m[1]}`).toBe(true);
      }
    }
  });
});

describe("docs wording", () => {
  it("never calls a documented feature unreleased", () => {
    const banned =
      /\b(coming soon|in beta|beta version|on (?:the|our) roadmap|early access|not yet available|will be available)\b/i;
    for (const p of PAGES) {
      const prose = p.body.replace(/```[\s\S]*?```/g, "");
      expect(prose, `${p.section}/${p.slug}`).not.toMatch(banned);
    }
  });

  it("spells the brand Rankbox", () => {
    for (const p of PAGES) expect(p.raw, `${p.section}/${p.slug}`).not.toMatch(/RankBox|Rank Box/);
  });

  it("uses the h2 anchors the pages promise", () => {
    expect(slugifyHeading("402 Subscription required")).toBe("402-subscription-required");
    expect(slugifyHeading("GET /articles/{id}")).toBe("get-articlesid");
    expect(ANCHORS.size).toBe(PAGES.length);
  });
});

describe("docs renderer", () => {
  it("renders callouts, titled code groups and tables", () => {
    const { html, headings } = renderDoc(
      [
        "Intro.",
        "",
        "## Make a request",
        "",
        "> [!WARNING]",
        "> Keep keys secret.",
        "",
        '```bash title="cURL"',
        "curl https://rankbox.xyz",
        "```",
        "",
        '```js title="JavaScript"',
        "await fetch(url);",
        "```",
        "",
        "| a | b |",
        "| - | - |",
        "| 1 | 2 |",
      ].join("\n"),
    );
    expect(headings).toEqual([{ id: "make-a-request", text: "Make a request", depth: 2 }]);
    expect(html).toContain('data-kind="warning"');
    expect(html).not.toContain("[!WARNING]");
    expect(html).toContain("data-tabs");
    expect(html.match(/role="tab"/g)?.length).toBe(2);
    expect(html).toContain('<div class="docs-table">');
  });

  it("resolves availability directives from the platform flags", () => {
    const { html } = renderDoc("{{availability:webflow}}");
    expect(html).toContain("Availability:");
  });

  it("escapes code before highlighting it", () => {
    const out = highlight('<script>alert("x")</script>', "html");
    expect(out).not.toContain("<script>");
    expect(highlight("a < b && c > d", "text")).toBe("a &lt; b &amp;&amp; c &gt; d");
  });

  it("points agents at the markdown copies of linked pages", () => {
    expect(absolutizeLinks("[Keys](/docs/api/authentication#rotating-keys)")).toBe(
      "[Keys](https://rankbox.xyz/docs/api/authentication.md#rotating-keys)",
    );
    expect(absolutizeLinks("[Pricing](/pricing)")).toBe("[Pricing](https://rankbox.xyz/pricing)");
  });
});
