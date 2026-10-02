/**
 * The docs pages, read from src/content/docs/<section>/<page>.md.
 *
 * Each file is markdown with a frontmatter block:
 *
 *   ---
 *   title: Create an API key          (the page's h1)
 *   nav_title: API keys               (optional, shorter sidebar label)
 *   description: One sentence: meta description, page lead, llms.txt line.
 *   order: 2                          (position inside its section)
 *   updated: 2026-10-02
 *   ---
 *
 * The section is the folder, and must be listed in DOCS_SECTIONS. Server-only
 * so page bodies never ship in the client bundle; pages render on demand and
 * are cached for the life of the server.
 *
 * Agents get the same pages as markdown: /docs/llms.txt (the index),
 * /docs/llms-full.txt (everything), and <any page>.md.
 */
import { parseFrontmatter } from "@/lib/markdown-blocks";
import { DOCS_SECTIONS, DOCS_SITE, docsMarkdownPath, docsPath, getDocsSection } from "@/data/docs";
import { renderDoc, resolveDirectives, type DocHeading } from "./render";

const FILES = import.meta.glob<string>("/src/content/docs/*/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

export interface DocMeta {
  section: string;
  slug: string;
  path: string;
  title: string;
  navTitle: string;
  description: string;
  order: number;
  updated: string | null;
}

interface DocSource extends DocMeta {
  body: string;
}

export interface DocLink {
  path: string;
  title: string;
  section: string;
}

export interface DocPageData extends DocMeta {
  sectionTitle: string;
  html: string;
  headings: DocHeading[];
  prev: DocLink | null;
  next: DocLink | null;
  words: number;
}

export interface DocsNavSection {
  slug: string;
  title: string;
  blurb: string;
  icon: string;
  path: string;
  pages: Pick<DocMeta, "slug" | "path" | "title" | "navTitle" | "description">[];
}

export interface DocsSearchEntry {
  path: string;
  title: string;
  section: string;
  description: string;
  headings: { id: string; text: string }[];
}

let sources: DocSource[] | null = null;

function allSources(): DocSource[] {
  if (sources) return sources;
  const order = new Map(DOCS_SECTIONS.map((s, i) => [s.slug, i]));
  sources = Object.entries(FILES)
    .map(([file, raw]): DocSource | null => {
      const [section, name] = file.split("/").slice(-2);
      const slug = name.replace(/\.md$/, "");
      if (!order.has(section)) return null;
      const { data: fields, body } = parseFrontmatter(raw);
      const data = Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, unquote(v)]));
      if (!data.title || data.draft === "true") return null;
      return {
        section,
        slug,
        path: docsPath(section, slug),
        title: data.title,
        navTitle: data.nav_title || data.title,
        description: data.description ?? "",
        order: Number(data.order) || 99,
        updated: data.updated || null,
        body,
      };
    })
    .filter((d): d is DocSource => d !== null)
    .sort(
      (a, b) =>
        order.get(a.section)! - order.get(b.section)! ||
        a.order - b.order ||
        a.title.localeCompare(b.title),
    );
  return sources;
}

/** A frontmatter value, without the quotes YAML habits wrap around some. */
function unquote(value: string | undefined): string {
  const v = (value ?? "").trim();
  const q = v[0];
  return (q === '"' || q === "'") && v.endsWith(q) && v.length > 1 ? v.slice(1, -1) : v;
}

function meta({ body: _body, ...m }: DocSource): DocMeta {
  return m;
}

export function listDocs(): DocMeta[] {
  return allSources().map(meta);
}

export function docsNav(): DocsNavSection[] {
  const docs = allSources();
  return DOCS_SECTIONS.map((s) => ({
    slug: s.slug,
    title: s.title,
    blurb: s.blurb,
    icon: s.icon,
    path: docsPath(s.slug),
    pages: docs
      .filter((d) => d.section === s.slug)
      .map(({ slug, path, title, navTitle, description }) => ({
        slug,
        path,
        title,
        navTitle,
        description,
      })),
  })).filter((s) => s.pages.length > 0);
}

/** The newest `updated` date across every page. */
export function docsUpdated(): string | null {
  return (
    allSources()
      .map((d) => d.updated)
      .filter((d): d is string => Boolean(d))
      .sort()
      .at(-1) ?? null
  );
}

const rendered = new Map<string, DocPageData>();

export function getDoc(section: string, slug: string): DocPageData | null {
  const key = `${section}/${slug}`;
  const hit = rendered.get(key);
  if (hit) return hit;
  const docs = allSources();
  const i = docs.findIndex((d) => d.section === section && d.slug === slug);
  if (i < 0) return null;
  const doc = docs[i];
  const link = (d: DocSource | undefined): DocLink | null =>
    d ? { path: d.path, title: d.title, section: getDocsSection(d.section)?.title ?? "" } : null;
  const { html, headings } = renderDoc(doc.body);
  const page: DocPageData = {
    ...meta(doc),
    sectionTitle: getDocsSection(section)?.title ?? section,
    html,
    headings,
    prev: link(docs[i - 1]),
    next: link(docs[i + 1]),
    words: doc.body.split(/\s+/).filter(Boolean).length,
  };
  rendered.set(key, page);
  return page;
}

let searchIndex: DocsSearchEntry[] | null = null;

export function docsSearchIndex(): DocsSearchEntry[] {
  searchIndex ??= allSources().map((d) => {
    const page = getDoc(d.section, d.slug)!;
    return {
      path: d.path,
      title: d.title,
      section: page.sectionTitle,
      description: d.description,
      headings: page.headings.filter((h) => h.depth === 2).map(({ id, text }) => ({ id, text })),
    };
  });
  return searchIndex;
}

/* ---------- Markdown for agents ---------- */

/**
 * Site-relative links made absolute, and links to docs pages pointed at their
 * .md copies, so an agent reading one page can follow the others as markdown.
 */
export function absolutizeLinks(markdown: string): string {
  return markdown.replace(/\]\((\/[^)\s]*)\)/g, (_m, href: string) => {
    const [path, hash] = href.split("#");
    const isDocsPage = path.startsWith("/docs/") && !/\.[a-z]+$/.test(path);
    const target = isDocsPage ? `${path.replace(/\/$/, "")}.md` : path;
    return `](${DOCS_SITE}${target}${hash ? `#${hash}` : ""})`;
  });
}

function pageMarkdown(doc: DocSource): string {
  const section = getDocsSection(doc.section)?.title ?? doc.section;
  return [
    `# ${doc.title}`,
    "",
    `> ${doc.description}`,
    "",
    `Section: ${section}. Web page: ${DOCS_SITE}${doc.path}${doc.updated ? `. Last updated: ${doc.updated}.` : "."}`,
    "",
    absolutizeLinks(resolveDirectives(doc.body)).trim(),
    "",
  ].join("\n");
}

function sectionMarkdown(section: string): string | null {
  const s = getDocsSection(section);
  const pages = allSources().filter((d) => d.section === section);
  if (!s || !pages.length) return null;
  return [
    `# ${s.title}`,
    "",
    `> ${s.blurb}`,
    "",
    ...pages.map(
      (d) => `- [${d.title}](${DOCS_SITE}${docsMarkdownPath(d.section, d.slug)}): ${d.description}`,
    ),
    "",
  ].join("\n");
}

/** Markdown for a docs URL path (with or without .md), or null. */
export function docsMarkdownFor(pathname: string): string | null {
  const parts = pathname.replace(/\.md$/, "").replace(/\/$/, "").split("/").filter(Boolean);
  if (parts[0] !== "docs") return null;
  if (parts.length === 1) return docsLlmsTxt();
  if (parts.length === 2) return sectionMarkdown(parts[1]);
  if (parts.length === 3) {
    const doc = allSources().find((d) => d.section === parts[1] && d.slug === parts[2]);
    return doc ? pageMarkdown(doc) : null;
  }
  return null;
}

const LLMS_INTRO = [
  "# Rankbox Docs",
  "",
  "> Documentation for Rankbox (https://rankbox.xyz), the AI search growth engine: research the questions buyers ask AI engines, write source-backed articles, publish them to your site, build backlinks and draft Reddit replies. Covers the product, publishing integrations, the REST API, the MCP server, and agent access (AI agents creating and running Rankbox accounts).",
  "",
  "How to read these docs as an agent:",
  "",
  "- Every page is available as Markdown: add `.md` to its URL (for example https://rankbox.xyz/docs/api/articles.md), or request the page with `Accept: text/markdown`.",
  "- Start with the agent quickstart if you are setting up Rankbox for a person or a project: https://rankbox.xyz/docs/agents/quickstart.md",
  "- Section headings are stable anchors: `## 402 Subscription required` is `#402-subscription-required`.",
  "- Prices, allowances and limits stated in these pages are current as of each page's `Last updated` date.",
  "",
];

export function docsLlmsTxt(): string {
  const docs = allSources();
  const sections = DOCS_SECTIONS.map((s) => {
    const pages = docs.filter((d) => d.section === s.slug);
    if (!pages.length) return null;
    return [
      `## ${s.title}`,
      "",
      `${s.blurb}`,
      "",
      ...pages.map(
        (d) =>
          `- [${d.title}](${DOCS_SITE}${docsMarkdownPath(d.section, d.slug)}): ${d.description}`,
      ),
      "",
    ].join("\n");
  }).filter(Boolean);
  return [
    ...LLMS_INTRO,
    ...sections,
    "## Optional",
    "",
    `- [All docs in one file](${DOCS_SITE}/docs/llms-full.txt): Every page above, concatenated, for loading the whole knowledge base at once.`,
    `- [Rankbox site index](${DOCS_SITE}/llms.txt): Marketing pages, guides, glossary and free tools.`,
    `- [MCP server](${DOCS_SITE}/mcp): Streamable HTTP MCP endpoint for AI tools.`,
    "",
  ].join("\n");
}

export function docsLlmsFullTxt(): string {
  const docs = allSources();
  return [...LLMS_INTRO, ...docs.map((d) => `---\n\n${pageMarkdown(d)}`)].join("\n");
}
