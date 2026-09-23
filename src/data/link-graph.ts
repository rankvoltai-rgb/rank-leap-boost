/**
 * The site's topics, and the links between sections they produce.
 *
 * Every section already links within itself: terms to related terms, tools to
 * tools, guides to guides. This file is the layer across them. A topic groups
 * the feature page that solves a problem with the guides, glossary terms, free
 * tools, integrations and comparisons written about it, and every page in a
 * topic links to a few pages from the *other* sections in it. Glossary terms
 * then get links from the guides and comparisons that use them, and the
 * feature pages get links from everything written about their problem.
 *
 * Deliberately light, because every content template renders the block: it
 * imports only modules the navbar and footer already load. The glossary,
 * integrations, comparisons and blog are heavy to import, so their titles are
 * written here, and link-graph.test.ts checks every one against the real data.
 *
 * To place a new page: add its path to the topics it belongs to, in the order
 * you want it suggested, and give it a title below if its section is one of
 * the hand-written ones. The test fails for any public page left out.
 */
import { FEATURES } from "@/data/features";
import { ENGINES } from "@/data/ai-seo/engines";
import { TOOLS } from "@/data/tools";
import { PERSONAS } from "@/data/personas";
import { COMPETITORS, SHIPPED } from "@/data/alternatives";
import { PUBLISH_PLATFORMS } from "@/data/platforms";

export type Section =
  | "features"
  | "use-cases"
  | "pricing"
  | "integrations"
  | "connectors"
  | "ai-seo"
  | "blog"
  | "tools"
  | "alternatives"
  | "compare"
  | "glossary";

/** Card order in the block: the pages that sell first, then the ones that teach. */
export const SECTION_ORDER: Section[] = [
  "features",
  "use-cases",
  "pricing",
  "integrations",
  "connectors",
  "ai-seo",
  "blog",
  "tools",
  "alternatives",
  "compare",
  "glossary",
];

/** The small label above a card's title. */
export const SECTION_LABEL: Record<Section, string> = {
  features: "Feature",
  "use-cases": "Use case",
  pricing: "Pricing",
  integrations: "Integration",
  connectors: "AI tool",
  "ai-seo": "AI SEO guide",
  blog: "Playbook",
  tools: "Free tool",
  alternatives: "Comparison",
  compare: "Head-to-head",
  glossary: "Glossary",
};

/* ------------------------------------------------------------------ */
/* Titles for the sections too heavy to import                         */
/* ------------------------------------------------------------------ */

/** Glossary names, exactly as TERMS spells them. */
export const TERM_NAMES: Record<string, string> = {
  "search-engine-optimization": "Search engine optimization",
  "generative-engine-optimization": "Generative engine optimization",
  "answer-engine-optimization": "Answer engine optimization",
  "llm-seo": "LLM SEO",
  "ai-search-engine": "AI search engine",
  "ai-overviews": "AI Overviews",
  "ai-mode": "AI Mode",
  "zero-click-search": "Zero-click search",
  "ai-visibility": "AI visibility",
  "ai-citation": "AI citation",
  "large-language-model": "Large language model",
  "retrieval-augmented-generation": "Retrieval-augmented generation",
  "query-fan-out": "Query fan-out",
  grounding: "Grounding",
  "ai-hallucination": "AI hallucination",
  "knowledge-cutoff": "Knowledge cutoff",
  "llm-training-data": "LLM training data",
  "vector-embeddings": "Vector embeddings",
  "semantic-search": "Semantic search",
  "content-chunking": "Content chunking",
  reranking: "Reranking",
  "ai-crawlers": "AI crawlers",
  gptbot: "GPTBot",
  "oai-searchbot": "OAI-SearchBot",
  claudebot: "ClaudeBot",
  perplexitybot: "PerplexityBot",
  "google-extended": "Google-Extended",
  "llms-txt": "llms.txt",
  "robots-txt": "robots.txt",
  "server-side-rendering": "Server-side rendering",
  "schema-markup": "Schema markup",
  indexnow: "IndexNow",
  "xml-sitemap": "XML sitemap",
  "canonical-tag": "Canonical tag",
  "snippet-controls": "Snippet controls",
  "core-web-vitals": "Core Web Vitals",
  "crawl-budget": "Crawl budget",
  indexing: "Indexing",
  "search-intent": "Search intent",
  "answer-first-content": "Answer-first content",
  "information-gain": "Information gain",
  "content-freshness": "Content freshness",
  "featured-snippet": "Featured snippet",
  "topic-cluster": "Topic cluster",
  "long-tail-keywords": "Long-tail keywords",
  "keyword-cannibalization": "Keyword cannibalization",
  "content-decay": "Content decay",
  "programmatic-seo": "Programmatic SEO",
  "scaled-content-abuse": "Scaled content abuse",
  "meta-description": "Meta description",
  "title-tag": "Title tag",
  "e-e-a-t": "E-E-A-T",
  "topical-authority": "Topical authority",
  "entity-seo": "Entity SEO",
  "knowledge-graph": "Knowledge Graph",
  backlinks: "Backlinks",
  "domain-authority": "Domain authority",
  "anchor-text": "Anchor text",
  "internal-linking": "Internal linking",
  "digital-pr": "Digital PR",
  "brand-mentions": "Brand mentions",
  "reddit-seo": "Reddit SEO",
  "ai-share-of-voice": "AI share of voice",
  "prompt-tracking": "Prompt tracking",
  "ai-referral-traffic": "AI referral traffic",
  "click-through-rate": "Click-through rate",
  "google-search-console": "Google Search Console",
  "keyword-difficulty": "Keyword difficulty",
  serp: "SERP",
};

interface Titled {
  title: string;
  blurb: string;
}

/** The publishing integrations. Titles carry the platform name as INTEGRATIONS spells it. */
const INTEGRATION_CARDS: Record<string, Titled> = {
  wordpress: {
    title: "WordPress integration",
    blurb: "Every article lands as a native WordPress post, in your theme.",
  },
  shopify: {
    title: "Shopify integration",
    blurb: "A steady blog for your store, published as native Shopify blog posts.",
  },
  webflow: {
    title: "Webflow integration",
    blurb: "Articles arrive as items in the Webflow CMS collection you choose.",
  },
  framer: {
    title: "Framer integration",
    blurb: "Articles sync into a Framer CMS collection, laid out by your own page.",
  },
  square: {
    title: "Square integration",
    blurb: "A blog for your Square Online site, kept fresh with native posts.",
  },
  api: {
    title: "REST API",
    blurb: "Pull finished articles into any stack with one revocable key.",
  },
  mcp: {
    title: "MCP server",
    blurb: "Research and plan content with Rankbox from the AI tools you already use.",
  },
};

/**
 * The AI-tool pages a topic links to by name. The other AI-tool pages link
 * out through the "ai-tools" topic but are reached from their own directory,
 * so they need no title here.
 */
const CONNECTOR_CARDS: Record<string, Titled> = {
  chatgpt: {
    title: "Rankbox for ChatGPT",
    blurb: "Plan content in ChatGPT with Rankbox's research tools.",
  },
  claude: {
    title: "Rankbox for Claude",
    blurb: "Ask Claude for briefs, AI questions, and meta descriptions.",
  },
  "claude-code": {
    title: "Rankbox for Claude Code",
    blurb: "Write meta descriptions and briefs from your terminal.",
  },
  perplexity: {
    title: "Rankbox for Perplexity",
    blurb: "Pair Perplexity's search with Rankbox's content planning.",
  },
  "gemini-enterprise": {
    title: "Rankbox for Gemini Enterprise",
    blurb: "Give your team's Gemini Rankbox's research tools.",
  },
  "gemini-cli": {
    title: "Rankbox for Gemini CLI",
    blurb: "Rankbox's research from Google's terminal agent.",
  },
  "le-chat": {
    title: "Rankbox for Le Chat",
    blurb: "Bring Rankbox into Mistral's assistant.",
  },
  "copilot-studio": {
    title: "Rankbox for Copilot Studio",
    blurb: "Give your Microsoft Copilot agents Rankbox's tools.",
  },
  "github-copilot": {
    title: "Rankbox for GitHub Copilot",
    blurb: "Rankbox's tools in Copilot Chat in VS Code.",
  },
};

/** Head-to-heads. Titles match matchupTitle(). */
const MATCHUP_CARDS: Record<string, Titled> = {
  "surfer-seo-vs-clearscope": {
    title: "Surfer SEO vs Clearscope",
    blurb: "Two content editors that grade drafts, compared round by round.",
  },
  "surfer-seo-vs-frase": {
    title: "Surfer SEO vs Frase",
    blurb: "A deep editor against a cheaper draft-to-publish platform.",
  },
  "jasper-vs-writesonic": {
    title: "Jasper vs Writesonic",
    blurb: "Governed brand copy against SEO articles with AI tracking.",
  },
  "koala-ai-vs-byword": {
    title: "Koala AI vs Byword",
    blurb: "Strong single drafts against programmatic pages at volume.",
  },
  "profound-vs-peec-ai": {
    title: "Profound vs Peec AI",
    blurb: "Two AI visibility trackers, enterprise against self-serve.",
  },
  "semrush-vs-ahrefs": {
    title: "Semrush vs Ahrefs",
    blurb: "The two all-in-one SEO suites, from keywords to backlinks.",
  },
};

/** Blog articles kept in the repo. Titles match each file's frontmatter. */
const POST_CARDS: Record<string, Titled> = {
  "how-to-get-cited-by-chatgpt": {
    title: "How to Get Cited by ChatGPT: The 2026 Playbook",
    blurb: "Let OpenAI's crawler in, answer buyer questions first, and back every claim.",
  },
  "how-to-show-up-in-google-ai-overviews": {
    title: "How to Show Up in Google AI Overviews: The 2026 Playbook",
    blurb: "Be indexed and snippet-eligible, and own the subtopics behind the question.",
  },
  "cheap-seo": {
    title: "Cheap SEO in 2026: What Works and What's a Scam",
    blurb: "The free tools to set up first, the few paid ones worth buying, and the red flags.",
  },
};

/** @internal For link-graph.test.ts, which checks these against the real data. */
export const HAND_WRITTEN = {
  integrations: INTEGRATION_CARDS,
  connectors: CONNECTOR_CARDS,
  compare: MATCHUP_CARDS,
  blog: POST_CARDS,
};

/* ------------------------------------------------------------------ */
/* Resolving a path                                                    */
/* ------------------------------------------------------------------ */

export function sectionOf(path: string): Section | undefined {
  const [, first, slug] = path.split("/");
  if (first === "integrations" && slug) {
    return slug in INTEGRATION_CARDS ? "integrations" : "connectors";
  }
  return (SECTION_ORDER as string[]).includes(first) ? (first as Section) : undefined;
}

export interface LinkCard {
  href: string;
  section: Section;
  label: string;
  title: string;
  blurb: string;
}

/** A card's words for any page a topic can link to; undefined for unknown paths. */
export function cardFor(href: string): LinkCard | undefined {
  const section = sectionOf(href);
  if (!section) return undefined;
  const slug = href.split("/")[2] ?? "";
  const titled = ((): Titled | undefined => {
    switch (section) {
      case "features": {
        const f = FEATURES.find((x) => x.slug === slug);
        return f && { title: f.name, blurb: f.tagline };
      }
      case "use-cases": {
        const p = PERSONAS.find((x) => x.slug === slug);
        return p && { title: `Rankbox for ${p.nameLower}`, blurb: p.tagline };
      }
      case "pricing":
        return {
          title: "Pricing",
          blurb: "One plan with daily articles, and a free trial to start.",
        };
      case "ai-seo": {
        const e = ENGINES.find((x) => x.slug === slug);
        return e && { title: `${e.name} SEO guide`, blurb: e.tagline };
      }
      case "tools": {
        const t = TOOLS.find((x) => x.slug === slug);
        return t && { title: t.name, blurb: t.tagline };
      }
      case "alternatives": {
        const c = COMPETITORS.find((x) => x.slug === slug);
        return c && { title: `Rankbox vs ${c.name}`, blurb: c.oneLiner };
      }
      case "integrations":
        return INTEGRATION_CARDS[slug];
      case "connectors":
        return CONNECTOR_CARDS[slug];
      case "compare":
        return MATCHUP_CARDS[slug];
      case "blog":
        return POST_CARDS[slug];
      case "glossary": {
        const name = TERM_NAMES[slug];
        return name ? { title: name, blurb: "" } : undefined;
      }
    }
  })();
  return titled && { href, section, label: SECTION_LABEL[section], ...titled };
}

/* ------------------------------------------------------------------ */
/* Topics                                                              */
/* ------------------------------------------------------------------ */

export interface Topic {
  id: string;
  /** The block's heading on every page whose main topic this is. */
  title: string;
  /**
   * The pages in it, the most central first within each section: a page's
   * main topic is the one it's listed highest in among its own section, and
   * suggestions start from the top of each section's list.
   */
  pages: string[];
  /** Pages that link out to this topic without being listed in it (so never suggested). */
  also?: (path: string) => boolean;
}

const f = (slug: string) => `/features/${slug}`;
const u = (slug: string) => `/use-cases/${slug}`;
const i = (slug: string) => `/integrations/${slug}`;
const e = (slug: string) => `/ai-seo/${slug}`;
const b = (slug: string) => `/blog/${slug}`;
const t = (slug: string) => `/tools/${slug}`;
const a = (slug: string) => `/alternatives/${slug}`;
const c = (slug: string) => `/compare/${slug}`;
const g = (...slugs: string[]) => slugs.map((s) => `/glossary/${s}`);

export const TOPICS: Topic[] = [
  /* One per engine: the guide, the playbook, the AI tool and the crawler
     that share its name. Listed first so an engine's own pages lead with it. */
  {
    id: "chatgpt",
    title: "Get cited by ChatGPT",
    pages: [
      e("chatgpt"),
      b("how-to-get-cited-by-chatgpt"),
      i("chatgpt"),
      t("get-recommended-by-chatgpt"),
      ...g("oai-searchbot", "gptbot"),
    ],
  },
  {
    id: "google",
    title: "Show up in Google's AI answers",
    pages: [
      e("google-ai-overviews"),
      b("how-to-show-up-in-google-ai-overviews"),
      t("serp-snippet-preview"),
      ...g("ai-overviews", "ai-mode", "featured-snippet", "snippet-controls"),
    ],
  },
  {
    id: "claude",
    title: "Get cited by Claude",
    pages: [e("claude"), i("claude"), i("claude-code"), ...g("claudebot")],
  },
  {
    id: "perplexity",
    title: "Get cited by Perplexity",
    pages: [e("perplexity"), i("perplexity"), ...g("perplexitybot")],
  },
  {
    id: "gemini",
    title: "Get cited by Gemini",
    pages: [e("gemini"), i("gemini-enterprise"), i("gemini-cli"), ...g("google-extended")],
  },
  {
    id: "mistral",
    title: "Get cited by Le Chat",
    pages: [e("mistral"), i("le-chat")],
  },
  {
    id: "copilot",
    title: "Get cited by Microsoft Copilot",
    pages: [e("copilot"), i("copilot-studio"), i("github-copilot")],
  },

  /* One per job the product does, led by the feature page that does it. */
  {
    id: "research",
    title: "Find the questions your buyers ask",
    pages: [
      f("answer-space-research"),
      t("ai-question-generator"),
      t("content-brief-generator"),
      t("blog-title-generator"),
      t("url-slug-generator"),
      e("google-ai-overviews"),
      e("chatgpt"),
      b("how-to-show-up-in-google-ai-overviews"),
      u("saas"),
      u("solo-founders"),
      i("mcp"),
      c("semrush-vs-ahrefs"),
      ...g(
        "query-fan-out",
        "search-intent",
        "long-tail-keywords",
        "keyword-difficulty",
        "topical-authority",
        "ai-mode",
        "keyword-cannibalization",
        "programmatic-seo",
        "vector-embeddings",
        "title-tag",
        "search-engine-optimization",
      ),
    ],
  },
  {
    id: "writing",
    title: "Write pages AI answers quote",
    pages: [
      f("citation-ready-writer"),
      f("brand-voice"),
      t("ai-citation-readiness-checker"),
      t("ai-faq-generator"),
      t("meta-description-writer"),
      t("schema-generator"),
      e("claude"),
      e("perplexity"),
      e("gemini"),
      b("how-to-get-cited-by-chatgpt"),
      u("marketers"),
      u("ecommerce"),
      a("koala-ai"),
      a("byword"),
      a("jasper"),
      a("writesonic"),
      c("jasper-vs-writesonic"),
      c("koala-ai-vs-byword"),
      ...g(
        "answer-first-content",
        "information-gain",
        "generative-engine-optimization",
        "answer-engine-optimization",
        "retrieval-augmented-generation",
        "grounding",
        "semantic-search",
        "e-e-a-t",
        "schema-markup",
        "scaled-content-abuse",
        "meta-description",
        "entity-seo",
        "click-through-rate",
      ),
    ],
  },
  {
    id: "scoring",
    title: "Score every draft for search and AI",
    pages: [
      f("seo-geo-score"),
      t("serp-snippet-preview"),
      t("keyword-density-checker"),
      t("heading-structure-checker"),
      t("ai-citation-readiness-checker"),
      e("google-ai-overviews"),
      a("surfer-seo"),
      a("frase"),
      c("surfer-seo-vs-clearscope"),
      c("surfer-seo-vs-frase"),
      ...g(
        "content-chunking",
        "reranking",
        "featured-snippet",
        "serp",
        "internal-linking",
        "anchor-text",
      ),
    ],
  },
  {
    id: "publishing",
    title: "Publish on a schedule, hands-free",
    pages: [
      f("auto-publishing"),
      i("wordpress"),
      i("webflow"),
      i("shopify"),
      i("framer"),
      i("square"),
      i("api"),
      u("ecommerce"),
      u("local-businesses"),
      u("solo-founders"),
      u("seo-agencies"),
      b("cheap-seo"),
      t("sitemap-generator"),
      t("redirect-generator"),
      t("open-graph-generator"),
      t("hreflang-generator"),
      a("rankpill"),
      a("outrank"),
      a("seobot"),
      ...g(
        "content-freshness",
        "topic-cluster",
        "indexnow",
        "xml-sitemap",
        "content-decay",
        "crawl-budget",
        "knowledge-cutoff",
      ),
    ],
  },
  {
    id: "visibility",
    title: "Measure how often AI recommends you",
    pages: [
      f("citation-tracking"),
      u("marketers"),
      u("saas"),
      u("seo-agencies"),
      e("chatgpt"),
      e("perplexity"),
      e("google-ai-overviews"),
      e("gemini"),
      e("claude"),
      e("copilot"),
      e("grok"),
      e("meta-ai"),
      e("deepseek"),
      e("mistral"),
      e("manus"),
      b("how-to-get-cited-by-chatgpt"),
      b("how-to-show-up-in-google-ai-overviews"),
      t("ai-visibility-prompt-generator"),
      t("get-recommended-by-chatgpt"),
      t("ai-crawler-log-analyzer"),
      t("utm-link-builder"),
      a("writesonic"),
      c("profound-vs-peec-ai"),
      ...g(
        "ai-visibility",
        "ai-share-of-voice",
        "ai-citation",
        "prompt-tracking",
        "ai-referral-traffic",
        "llm-seo",
        "ai-search-engine",
        "zero-click-search",
        "large-language-model",
        "ai-hallucination",
        "google-search-console",
        "knowledge-graph",
        "domain-authority",
        "ai-overviews",
      ),
    ],
  },
  {
    id: "crawlers",
    title: "Let AI crawlers read your site",
    pages: [
      t("ai-search-readiness-check"),
      f("citation-tracking"),
      t("ai-robots-txt-generator"),
      t("llms-txt-generator"),
      t("robots-txt-tester"),
      t("ai-crawler-log-analyzer"),
      t("schema-generator"),
      e("chatgpt"),
      e("claude"),
      e("perplexity"),
      e("gemini"),
      e("google-ai-overviews"),
      e("deepseek"),
      b("how-to-get-cited-by-chatgpt"),
      ...g(
        "ai-crawlers",
        "robots-txt",
        "llms-txt",
        "gptbot",
        "oai-searchbot",
        "claudebot",
        "perplexitybot",
        "google-extended",
        "server-side-rendering",
        "indexing",
        "canonical-tag",
        "snippet-controls",
        "core-web-vitals",
        "llm-training-data",
      ),
    ],
  },
  {
    id: "authority",
    title: "Build the authority AI engines trust",
    pages: [
      f("authority-backlinks"),
      f("reddit-presence"),
      u("seo-agencies"),
      u("local-businesses"),
      e("chatgpt"),
      e("perplexity"),
      e("gemini"),
      e("grok"),
      e("meta-ai"),
      t("get-recommended-by-chatgpt"),
      a("rankpill"),
      a("outrank"),
      c("semrush-vs-ahrefs"),
      ...g(
        "backlinks",
        "brand-mentions",
        "reddit-seo",
        "digital-pr",
        "domain-authority",
        "anchor-text",
        "topical-authority",
        "e-e-a-t",
        "entity-seo",
        "knowledge-graph",
        "internal-linking",
        "llm-training-data",
      ),
    ],
  },

  /* Every AI-tool page links here; the directory itself links to them all. */
  {
    id: "ai-tools",
    title: "Research content from your AI tools",
    pages: [
      i("mcp"),
      i("api"),
      f("answer-space-research"),
      t("ai-question-generator"),
      t("content-brief-generator"),
      t("meta-description-writer"),
    ],
    also: (path) => sectionOf(path) === "connectors",
  },

  /* The pages a buyer reads last. */
  {
    id: "choosing",
    title: "Choosing an AI SEO tool",
    pages: [
      "/pricing",
      b("cheap-seo"),
      u("solo-founders"),
      u("marketers"),
      u("seo-agencies"),
      u("saas"),
      u("ecommerce"),
      u("local-businesses"),
      a("rankpill"),
      a("outrank"),
      a("seobot"),
      a("koala-ai"),
      a("byword"),
      a("writesonic"),
      a("frase"),
      a("surfer-seo"),
      a("jasper"),
      c("surfer-seo-vs-clearscope"),
      c("surfer-seo-vs-frase"),
      c("jasper-vs-writesonic"),
      c("koala-ai-vs-byword"),
      c("profound-vs-peec-ai"),
      c("semrush-vs-ahrefs"),
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Picking the links                                                   */
/* ------------------------------------------------------------------ */

/** Cards per block, and per section within it, so no one section crowds the rest. */
export const CARD_LIMIT = 6;
export const PER_SECTION = 2;
/** Glossary terms show as a row of chips under the cards. */
export const TERM_LIMIT = 6;

/**
 * Comparison pages say only what Rankbox ships today (see SHIPPED), so they
 * never link to a feature or add-on that hasn't. Each link appears the day its
 * flag flips.
 */
const CLAIM_CHECKED: Section[] = ["alternatives", "compare"];
const UNSHIPPED = new Set<string>([
  ...(SHIPPED.citationTracking ? [] : [f("citation-tracking")]),
  ...(PUBLISH_PLATFORMS.some((p) => p.addonLive) ? [] : [f("auto-publishing")]),
  ...PUBLISH_PLATFORMS.filter((p) => !p.addonLive).map((p) => i(p.id)),
]);

export interface CrossLinks {
  topic: Topic;
  cards: LinkCard[];
  terms: LinkCard[];
}

function inTopic(topic: Topic, path: string): boolean {
  return topic.pages.includes(path) || (topic.also?.(path) ?? false);
}

/** Stable spread for pages a topic includes without listing them. */
function hash(s: string): number {
  let h = 0;
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

/**
 * The links from one page into the other sections of its topics.
 *
 * The page's main topic (the one it sits highest in) fills the block first,
 * then its other topics fill what's left. Within a topic, each section is a
 * queue taken in turns — one page per section per round — so the block stays
 * mixed.
 *
 * Each queue starts at the page's own position among its siblings, stepped by
 * how many pages it takes from that queue: the fifth tool in a topic takes
 * the glossary terms after the ones the fourth took. That spread is what gives
 * every page in a topic a link in, where starting everyone at the top would
 * link the first few pages from everywhere and the rest from nowhere.
 *
 * `exclude` drops pages the template already links to (a glossary entry's own
 * feature and tool, say), so the block only adds new destinations.
 */
export function crossLinks(path: string, exclude: readonly string[] = []): CrossLinks | null {
  const own = sectionOf(path);
  if (!own) return null;
  // A page's main topic is the one it's listed highest in among its own
  // section; ties go to the topic listed first, the more specific one.
  const rank = (topic: Topic) => {
    const at = topic.pages.filter((p) => sectionOf(p) === own).indexOf(path);
    return at === -1 ? Number.MAX_SAFE_INTEGER : at;
  };
  const topics = TOPICS.filter((topic) => inTopic(topic, path)).sort((x, y) => rank(x) - rank(y));
  if (topics.length === 0) return null;

  const skip = new Set([path, ...exclude]);
  const claimChecked = CLAIM_CHECKED.includes(own);
  const cards: string[] = [];
  const terms: string[] = [];
  const perSection = new Map<Section, number>();

  topics.forEach((topic, n) => {
    const pools = SECTION_ORDER.filter((section) => section !== own)
      .map((section) => ({
        section,
        pages: topic.pages.filter(
          (p) => sectionOf(p) === section && !skip.has(p) && !(claimChecked && UNSHIPPED.has(p)),
        ),
      }))
      .filter((pool) => pool.pages.length > 0);

    // How many pages this page will take from each queue, to step by. Only the
    // main topic can be counted on to fill; the rest take one each at most.
    const cardPools = pools.filter((pool) => pool.section !== "glossary").length;
    const step = (section: Section) =>
      n > 0
        ? 1
        : section === "glossary"
          ? TERM_LIMIT
          : Math.min(PER_SECTION, Math.ceil(CARD_LIMIT / Math.max(cardPools, 1)));
    const peers = topic.pages.filter((p) => sectionOf(p) === own);
    const at = peers.includes(path) ? peers.indexOf(path) : hash(path);
    const queues = pools.map(({ section, pages }) => {
      const start = (at * step(section)) % pages.length;
      return { section, pages: [...pages.slice(start), ...pages.slice(0, start)] };
    });

    for (let round = 0; queues.some((q) => q.pages.length > round); round++) {
      for (const q of queues) {
        const next = q.pages[round];
        if (!next || cards.includes(next) || terms.includes(next)) continue;
        if (q.section === "glossary") {
          if (terms.length < TERM_LIMIT) terms.push(next);
        } else if (cards.length < CARD_LIMIT && (perSection.get(q.section) ?? 0) < PER_SECTION) {
          cards.push(next);
          perSection.set(q.section, (perSection.get(q.section) ?? 0) + 1);
        }
      }
    }
  });

  const resolve = (paths: string[]) =>
    paths.map(cardFor).filter((card): card is LinkCard => card !== undefined);
  const byOrder = (x: LinkCard, y: LinkCard) =>
    SECTION_ORDER.indexOf(x.section) - SECTION_ORDER.indexOf(y.section);
  return { topic: topics[0], cards: resolve(cards).sort(byOrder), terms: resolve(terms) };
}
