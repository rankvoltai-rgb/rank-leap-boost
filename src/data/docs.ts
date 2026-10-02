/**
 * The docs at /docs: section order and labels. Pages themselves are markdown
 * in src/content/docs/<section>/<page>.md, ordered by their `order`
 * frontmatter; src/lib/docs/content.server.ts reads them. A folder that isn't
 * listed here never renders, and docs.test.ts fails if one exists.
 *
 * Client-safe: no page bodies here, so the shared bundle stays small.
 */
import { PUBLISH_PLATFORMS, type PlatformId } from "@/data/platforms";

export const DOCS_BASE = "/docs";
export const DOCS_SITE = "https://rankbox.xyz";

export type DocsIcon =
  | "rocket"
  | "pen"
  | "send"
  | "trending"
  | "plug"
  | "code"
  | "bot"
  | "card"
  | "lifebuoy";

export interface DocsSection {
  slug: string;
  title: string;
  /** One line on the hub and the section page. */
  blurb: string;
  icon: DocsIcon;
}

export const DOCS_SECTIONS: DocsSection[] = [
  {
    slug: "get-started",
    title: "Get started",
    blurb: "What Rankbox is, a 10-minute quickstart, and the ideas the rest of the docs build on.",
    icon: "rocket",
  },
  {
    slug: "content",
    title: "Content engine",
    blurb:
      "Research, the content plan, how articles are written, edited, scored and put on autopilot.",
    icon: "pen",
  },
  {
    slug: "publishing",
    title: "Publishing",
    blurb:
      "Get finished articles onto your site: Webflow, Shopify, Framer, WordPress or any stack.",
    icon: "send",
  },
  {
    slug: "growth",
    title: "Authority and reach",
    blurb: "The backlink exchange, Reddit Presence, the Rank page and the free tools.",
    icon: "trending",
  },
  {
    slug: "ai-tools",
    title: "AI tools and MCP",
    blurb: "Use Rankbox from Claude, ChatGPT, Cursor and 46 other AI tools through the MCP server.",
    icon: "plug",
  },
  {
    slug: "api",
    title: "REST API",
    blurb: "Pull finished articles into any CMS and report where they went live.",
    icon: "code",
  },
  {
    slug: "agents",
    title: "Agent access",
    blurb: "AI agents create Rankbox accounts and run the whole platform through the API or MCP.",
    icon: "bot",
  },
  {
    slug: "account",
    title: "Account and billing",
    blurb: "The plan, credits, the free trial, billing, Studio sites, settings and security.",
    icon: "card",
  },
  {
    slug: "help",
    title: "Help",
    blurb: "Answers to common questions, fixes for known problems, and how to reach us.",
    icon: "lifebuoy",
  },
];

export const DOCS_SECTION_SLUGS = DOCS_SECTIONS.map((s) => s.slug);

export function getDocsSection(slug: string): DocsSection | undefined {
  return DOCS_SECTIONS.find((s) => s.slug === slug);
}

/** Where a page lives on the site. */
export function docsPath(section?: string, page?: string): string {
  if (!section) return DOCS_BASE;
  return page ? `${DOCS_BASE}/${section}/${page}` : `${DOCS_BASE}/${section}`;
}

/** The same page as raw markdown, for agents. */
export function docsMarkdownPath(section?: string, page?: string): string {
  return `${docsPath(section, page)}.md`;
}

/**
 * `{{availability:<platform>}}` in a page renders one of these, chosen by the
 * platform's `addonLive` flag, so a page updates itself the day an add-on
 * ships. `pending` describes the path that works today.
 */
const AVAILABILITY: Record<PlatformId, { live: string; pending: string }> = {
  webflow: {
    live: "The Rankbox app for Webflow is available to every Rankbox account. Connect it from **Dashboard → Integrations → Webflow**.",
    pending:
      "The Rankbox app for Webflow is in review for the Webflow Marketplace. Until it is listed there, publish to Webflow with the [REST API](/docs/publishing/custom-sites).",
  },
  shopify: {
    live: "The Rankbox app for Shopify is available to every Rankbox account. Install it from the Shopify App Store.",
    pending:
      "The Rankbox app for Shopify is in review for the Shopify App Store, and installs on development stores until it is approved. On a live store, publish with the [REST API](/docs/publishing/custom-sites).",
  },
  framer: {
    live: "The Rankbox plugin for Framer is available to every Rankbox account. Install it from the Framer Marketplace.",
    pending:
      "The Rankbox plugin isn't listed in the Framer Marketplace yet. Until it is, bring articles into Framer with the [REST API](/docs/publishing/custom-sites).",
  },
  wordpress: {
    live: "The Rankbox plugin for WordPress is available to every Rankbox account. Install it from the WordPress plugin directory.",
    pending:
      "There is no Rankbox plugin in the WordPress directory yet. WordPress sites publish with the [REST API](/docs/publishing/custom-sites), as this page shows.",
  },
  square: {
    live: "The Rankbox app for Square Online is available to every Rankbox account.",
    pending:
      "There is no Rankbox app for Square Online yet. Square sites can use the [REST API](/docs/publishing/custom-sites) where their setup allows custom code.",
  },
};

export function availabilityNote(id: string): { live: boolean; text: string } | null {
  const platform = PUBLISH_PLATFORMS.find((p) => p.id === id);
  const copy = AVAILABILITY[id as PlatformId];
  if (!platform || !copy) return null;
  return { live: platform.addonLive, text: platform.addonLive ? copy.live : copy.pending };
}

/** The ways an agent reads these docs, shown on the hub and in /docs/llms.txt. */
export const AGENT_ENTRY_POINTS = [
  { label: "Docs index for LLMs", path: "/docs/llms.txt" },
  { label: "Every page in one file", path: "/docs/llms-full.txt" },
  { label: "Any page as Markdown", path: "/docs/get-started/quickstart.md" },
  { label: "Agent quickstart", path: "/docs/agents/quickstart.md" },
] as const;
