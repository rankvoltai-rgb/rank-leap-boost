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
import { SOLUTIONS } from "@/data/solutions";
import { isBlogPathLive } from "@/lib/blog-release";

export type Section =
  | "features"
  | "solutions"
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
  "solutions",
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
  solutions: "Solution",
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
  "how-to-measure-geo": {
    title: "How to Measure GEO: Track AI Citations and Prove Impact",
    blurb: "Crawled, cited, clicked, converted: the metrics, the math, and a control test.",
  },
  "how-to-measure-ai-referral-traffic-in-ga4": {
    title: "How to Measure AI Referral Traffic in Google Analytics 4 (GA4)",
    blurb: "A tested regex, a channel group above Referral, and AI vs organic reports.",
  },
  "how-to-rank-on-chatgpt": {
    title: "How to Rank on ChatGPT: Get Named When Buyers Ask",
    blurb: "How ChatGPT builds a shortlist, and how to get on the pages it reads.",
  },
  "chatgpt-rank-tracker": {
    title: "ChatGPT Rank Tracker: 9 Tools and 10 Questions to Ask",
    blurb: "What a ChatGPT tracker should record, and nine tools priced per prompt.",
  },
  "optimize-website-for-chatgpt-and-perplexity": {
    title: "How to Optimize Your Website for ChatGPT and Perplexity",
    blurb: "One site checklist for both engines, and the six places they differ.",
  },
  "perplexity-seo-tools": {
    title: "Perplexity SEO Tools: Track and Earn Perplexity Citations",
    blurb: "Access checks, trackers, a DIY API tracker, and ways to earn its sources.",
  },
  "brand-presence-in-perplexity": {
    title: "How to Improve Your Brand Presence in Perplexity",
    blurb: "Audit what Perplexity says about you and trace each wrong line to its source.",
  },
  "ai-search-optimization-tools": {
    title: "What Are AI Search Optimization Tools? Types and Costs",
    blurb: "The six tool types, what to buy first, and a 100-point scorecard.",
  },
  "optimize-business-for-ai-search": {
    title: "How to Optimize Your Business for AI Search Engines",
    blurb: "Where each engine gets your business facts, and an audit to fix them.",
  },
  "optimize-content-for-ai-search": {
    title: "How to Optimize Content for AI Search: Passage by Passage",
    blurb: "The Lift Test: nine checks for every passage, with an annotated rewrite.",
  },
  "vector-distance-vs-keyword-density": {
    title: "Vector Distance vs. Keyword Density",
    blurb: "263 test paragraphs, 10 scorers: definitions beat repeats after the second mention.",
  },
  "ai-crawler-directory": {
    title: "The AI Crawler Directory",
    blurb: "Every AI bot's user agent, job, IP list and robots.txt rules, rechecked monthly.",
  },
  "cloudflare-challenge-trap": {
    title:
      "The Cloudflare Challenge Trap: Are You Silently Blocking ChatGPT from Recommending You?",
    blurb:
      "The Cloudflare settings that silently block AI bots, and rules that let verified ones in.",
  },
  "bing-webmaster-tools-ai-indexing-guide": {
    title: "Bing Webmaster Tools Is the New Google Search Console: The AI Indexing Guide",
    blurb: "Set up Bing Webmaster Tools for AI search: IndexNow, crawl checks and AI citations.",
  },
  "how-to-get-indexed-by-llms-with-llms-txt": {
    title: "How to Get Indexed by LLMs with an llms.txt File: The Complete Guide",
    blurb: "The llms.txt spec, an annotated example, serving it on five stacks, and log checks.",
  },
  "state-of-llms-txt-adoption": {
    title: "The State of llms.txt Adoption",
    blurb: "21,353 sites crawled: who serves llms.txt, the common errors, and who generates them.",
  },
  "ai-bot-crawler-census": {
    title: "The AI Bot Crawler Census",
    blurb: "Who blocks GPTBot, ClaudeBot and PerplexityBot, and who splits training from search.",
  },
  "mcp-protocol-new-sitemap": {
    title: "The MCP Protocol as the New Sitemap: Why AI Models Prefer APIs Over Web Crawling",
    blurb: "What an MCP server adds to your sitemap, and how to build, secure and list one.",
  },
  "perplexitybot-user-agent": {
    title: "PerplexityBot User Agent Documentation: robots.txt Rules and IP Checks",
    blurb: "Both Perplexity user agents, what robots.txt does to each, and how to verify an IP.",
  },
  "how-to-track-gptbot-and-claudebot": {
    title: "How to Track GPTBot and ClaudeBot Website Crawling Activity",
    blurb: "Find the logs, count each bot, verify its IPs, and run a weekly crawl sheet.",
  },
  "what-is-oai-searchbot": {
    title: "OAI-SearchBot: What It Is and How to Allow or Block It",
    blurb: "ChatGPT's search crawler: what blocking it changes, and how to allow it.",
  },
  "why-is-cloudflare-blocking-chatgpt": {
    title: "Why Is Cloudflare Blocking ChatGPT? How to Find and Fix It",
    blurb: "Which Cloudflare setting stopped ChatGPT, where to see it, and the fix.",
  },
  "cloudflare-blocking-chatgpt": {
    title: "Cloudflare Blocking ChatGPT: How to Let ChatGPT's Bots Through on Any Plan",
    blurb: "The allow-list steps for OAI-SearchBot and ChatGPT-User, plan by plan.",
  },
  "how-to-use-bing-webmaster-tools-for-seo": {
    title: "How to Use Bing Webmaster Tools for SEO",
    blurb: "Setup, indexing, keyword wins, site audits, link gaps and a monthly check.",
  },
  "does-bing-webmaster-tools-help-google-indexing": {
    title: "Does Submitting to Bing Webmaster Tools Help Google Indexing?",
    blurb: "No: what carries over from Bing to Google, and what speeds up Google.",
  },
  "will-llms-txt-help-your-seo": {
    title: "Will an llms.txt File Help Your SEO?",
    blurb: "Not for Google rankings. Who it helps, the evidence, and a payoff matrix.",
  },
  "how-to-get-indexed-by-llm-through-llms-txt": {
    title: "How to Get Indexed by an LLM Through an llms.txt File (and What Actually Works)",
    blurb: "The three routes into an LLM, and a two-track setup checklist.",
  },
  "what-is-an-llms-txt-file": {
    title: "What Is an llms.txt File? A Plain-English Explainer",
    blurb: "What the file is, who reads it, and how it differs from robots.txt.",
  },
  "llms-txt-standard": {
    title: "The llms.txt Standard, Explained Line by Line",
    blurb: "Every element of the spec, v2 changes, and what validators check.",
  },
  "chatgpt-traffic-analysis": {
    title: "ChatGPT Traffic Analysis: How to Measure Visits From ChatGPT",
    blurb: "Referrers, UTM tags, GA4 channels and a worked conversion analysis.",
  },
  "how-to-track-ai-referral-traffic-in-ga4": {
    title: "How to Track AI Referral Traffic in GA4: A 15-Minute Setup",
    blurb: "GA4's AI Assistant channel, one exploration and one saved report.",
  },
  "how-to-benchmark-ai-search-performance": {
    title: "How to Benchmark AI Search Performance",
    blurb: "Set a baseline, compare rivals and engines, and tell real gaps from noise.",
  },
  "how-does-ai-search-interpret-user-intent": {
    title: "How Does AI Search Interpret User Intent?",
    blurb: "Five steps from prompt to passage, each sourced to the vendor.",
  },
  "how-ai-search-uses-user-intent-and-context": {
    title: "How AI Search Uses User Intent and Context",
    blurb: "Memory, location and conversation history, and what they mean for pages.",
  },
  "geo-metrics-framework": {
    title: "The GEO Metrics Framework",
    blurb: "Share of Model, Citation Density, Vector Proximity and more: the formulas for GEO.",
  },
  "what-is-generative-engine-optimization": {
    title: "What Is Generative Engine Optimization (GEO)? A Plain-English Guide",
    blurb: "The plain-English definition of GEO, where it came from, and how to start.",
  },
  "how-to-benchmark-website-performance-in-ai-search": {
    title: "How to Benchmark Website Performance Against Competitors in AI Search",
    blurb: "Which rival pages and domains AI cites, and the content gaps behind them.",
  },
  "how-to-track-brand-mentions-in-ai-search": {
    title: "How to Track Brand Mentions in AI Search: A Practical Guide for 2026",
    blurb: "Prompt sampling, a prompt set, a recording template and alert rules.",
  },
  "track-brand-mentions-in-ai-search-free-and-paid": {
    title: "How to Track Brand Mentions in AI Search for Free (and When to Pay)",
    blurb: "The free stack, nine trackers' prices, and the break-even test for paying.",
  },
  "how-to-see-if-ai-mentions-your-brand": {
    title: "How to See If AI Mentions Your Brand: The 15-Minute Audit",
    blurb: "Five prompts, three engines, one scorecard, in fifteen minutes.",
  },
  "see-if-ai-mentions-your-brand-places-to-look": {
    title: "How to See If AI Mentions Your Brand: 6 Places to Look",
    blurb: "Six places that show AI mentions without running an audit, and what each misses.",
  },
  "is-it-possible-to-track-brand-mentions-in-ai-answers": {
    title: "Is It Possible to Track Brand Mentions in AI Answers? (The Technical Reality)",
    blurb: "Temperature, seeds, personalization and the statistics of repeated runs.",
  },
  "is-it-possible-to-track-brand-mentions-in-ai-search": {
    title: "Is It Possible to Track Brand Mentions in AI Search? Yes, Within Limits",
    blurb: "Yes, within limits: what you can track, what you can't, and why.",
  },
  "how-to-benchmark-ai-citations-against-competitors": {
    title: "How to Benchmark Your Brand's AI Citations Against Competitors",
    blurb: "The 20-Prompt Rival Matrix and a head-to-head score for each competitor.",
  },
  "how-to-track-competitor-rankings-in-ai-search": {
    title: "How to Track Competitor Rankings in AI Search Results Effectively",
    blurb: "A weekly rank log for rivals in AI answers, with alerts that beat the noise.",
  },
  "fix-incorrect-brand-facts-in-ai-answers": {
    title: "How to Fix Incorrect Brand Facts in AI Answers & LLM Citations",
    blurb: "Trace the seed source, publish a correction page with JSON-LD, and recheck.",
  },
  "how-to-fix-incorrect-brand-facts-in-llm-citations": {
    title: "How to Fix Incorrect Brand Facts in LLM Citations: Report, Correct, Recheck",
    blurb: "Report it, correct the source, recheck on a schedule: the one-fact path.",
  },
  "defensive-geo": {
    title:
      'Defensive GEO: What Does ChatGPT Say When Buyers Ask "Why Shouldn\'t I Buy Your Product?"',
    blurb: "What AI says when buyers ask why not to buy you, and how to answer it.",
  },
  "how-to-monitor-brand-mentions-in-ai-generated-responses": {
    title: "How to Monitor Brand Mentions in AI-Generated Responses (and Catch the Negative Ones)",
    blurb: "A negative-prompt watchlist, tone labels and a red-flag severity ladder.",
  },
  "hallucination-by-omission-pricing-page": {
    title: "Hallucination by Omission: The Silent Risk of Not Having a Clear Pricing Page",
    blurb: "Why a hidden price makes AI guess, and the pricing page that stops it.",
  },
  "how-does-rag-reduce-hallucinations": {
    title: "How Does RAG Reduce Hallucinations Compared to Traditional Language Models?",
    blurb: "What retrieval grounding fixes, what the studies measured, and where it fails.",
  },
  "semantic-drift-ai-memory-reset": {
    title: 'Semantic Drift: How to Force an AI "Memory Reset" When Your Product Pivots',
    blurb: "After a pivot: the two layers of drift and a 90-day deprecation campaign.",
  },
  "how-ai-models-rank-brands-in-search-results": {
    title: "How AI Models Rank Brands in Search Results",
    blurb: "The five filters that decide which brands an AI answer names, and in what order.",
  },
  "knowledge-graph-for-ai": {
    title: "Building a Knowledge Graph for AI: How to Connect Entities for LLMs",
    blurb: "Connect founders, products and pricing with a JSON-LD graph and sameAs links.",
  },
  "what-is-a-knowledge-graph-in-seo": {
    title: "What Is a Knowledge Graph in SEO?",
    blurb: "Entities instead of keywords: Google's Knowledge Graph and what feeds it.",
  },
  "knowledge-graph-search-api": {
    title: "Google Knowledge Graph Search API: What It Returns and How to Use It for SEO",
    blurb: "What Google's entity lookup API returns, its limits, and SEO uses.",
  },
  "seo-knowledge-graph": {
    title: "SEO Knowledge Graph: How to Build One for Your Site With Schema",
    blurb: "An entity inventory, stable @ids and internal links that mirror the graph.",
  },
  "optimize-content-for-llms-writing-for-machines": {
    title: "How to Optimize Content for LLMs: Writing for Machines That Don't Read Like Google",
    blurb: "How LLM pipelines read a page, and five formatting changes that make it quotable.",
  },
  "how-to-optimize-content-for-llms": {
    title: "How to Optimize Content for LLMs: A Before-and-After Rewrite",
    blurb: "One weak section, rewritten step by step for LLMs, with the reason for each edit.",
  },
  "reverse-prompt-playbook": {
    title: 'The "Reverse Prompt" Playbook: Engineering Content Backwards from AI System Prompts',
    blurb: "Write backwards from how AI answers are assembled, in modular Answer Units.",
  },
  "how-to-write-blog-posts-for-ai-citation": {
    title: "How to Write Blog Posts for AI Citation: A Section-by-Section Template",
    blurb: "A section-by-section template for blog posts AI answers can quote.",
  },
  "synthetic-content-saturation-model-collapse": {
    title: 'Synthetic Content Saturation & The "Model Collapse" Moat',
    blurb: "What model collapse really is, and the information-gain moat generic AI text lacks.",
  },
  "are-automated-blog-posts-effective-for-seo": {
    title: "Are Automated Blog Posts Effective for SEO? What Google Says and What Works",
    blurb: "What Google's rules say about automated posts, and what makes them work.",
  },
  "comparison-page-formula": {
    title: 'The "Comparison Page" Formula: Writing Neutral Reviews That AI Models Quote',
    blurb: "The Objective Synthesis template for comparison pages AI answers quote.",
  },
  "how-to-compare-generative-engine-optimization-software": {
    title: "How to Compare Different Generative Engine Optimization Software Options",
    blurb: "Criteria, a scoring sheet and a two-week trial test for GEO tools.",
  },
  "entity-authority-in-the-ai-era": {
    title: "Entity Authority in the AI Era",
    blurb: "From PageRank to entities: how to check and build your brand's entity authority.",
  },
  "what-is-entity-authority-in-seo": {
    title: "What Is Entity Authority in SEO?",
    blurb:
      "What an entity is, what makes one authoritative, and how it differs from domain authority.",
  },
  "entity-authority-seo": {
    title: "Entity Authority SEO: A 30-Day Plan to Build It",
    blurb: "A week-by-week 30-day plan to build entity authority, with a tracking sheet.",
  },
  "claude-for-seo-audits": {
    title: "How to Use Claude for SEO Audits and Content Analysis",
    blurb: "Claude prompt templates for entity gaps, schema comparisons and quotable soundbites.",
  },
  "how-to-use-claude-for-seo-audits": {
    title: "How to Use Claude for SEO Audits: A Step-by-Step Walkthrough",
    blurb: "One SEO audit in Claude, start to finish: setup, data, prompts and checks.",
  },
  "claude-seo-tool": {
    title: "Claude SEO Tool Guide: What Claude Can Do for SEO in 2026",
    blurb: "Which Claude plans and features matter for SEO, connectors, Claude Code and limits.",
  },
  "aeo-audit": {
    title: "How to Conduct an Answer Engine Optimization (AEO) Audit in 2026",
    blurb: "A 20-point AEO audit with pass/fail rules, a scoring sheet and a worked example.",
  },
  "geo-tools-list": {
    title: "What Is Generative Engine Optimization? A GEO Tools List for 2026",
    blurb: "GEO in brief, then the tools by job: tracking, content, crawl access, schema and more.",
  },
  "evaluate-geo-tool-before-purchasing": {
    title: "How to Evaluate the Effectiveness of a GEO Tool Before Purchasing",
    blurb: "Test whether a GEO tool moves results before you buy: pilots, controls and ROI.",
  },
  "ai-seo-checklist-pre-publish-audit": {
    title: "AI SEO Checklist: A 30-Minute Pre-Publish Audit for Every New Article",
    blurb: "A printable 30-minute checklist for every new article, free to download.",
  },
  "ai-seo-checklist": {
    title: "AI SEO Checklist for Old Posts: 15 Checks Before You Refresh",
    blurb: "Fifteen checks for refreshing old posts so AI answers can use them.",
  },
  "do-author-bios-help-ai-search-visibility": {
    title: "Do Author Bios Help AI Search Visibility? The Trust Signal Most AI Content Misses",
    blurb: "A machine-readable author footprint: Person schema, bio pages, profiles and evidence.",
  },
  "do-author-bios-help-seo": {
    title: "Do Author Bios Help SEO? What Google Says and What the Evidence Shows",
    blurb: "What Google's guidance and representatives say about authors, and the evidence.",
  },
  "author-bio-seo": {
    title: "Author Bio SEO: How to Write an Author Bio That Search and AI Can Use",
    blurb: "Author bio templates, a bio page structure and Person JSON-LD you can copy.",
  },
  "shadow-training-data-audit": {
    title: 'The "Shadow Training Data" Audit: How Common Crawl Decided Your Brand\'s Fate in 2024',
    blurb: "Audit your brand in the Common Crawl dumps behind models' training windows.",
  },
  "freshness-factor-ai-search": {
    title: "The Freshness Factor in AI Search: Why 30-Day-Old Content Beats 10-Year-Old Giants",
    blurb:
      "What the evidence says about recency in AI answers, and a refresh framework you can measure.",
  },
  "content-freshness-seo": {
    title: "Content Freshness SEO: How Google and AI Search Judge Fresh Content",
    blurb:
      "What content freshness means to Google, how it reads dates, and where AI search differs.",
  },
  "how-often-to-update-content-for-ai-seo": {
    title: "How Often to Update Content for AI SEO Freshness (and What Counts as an Update)",
    blurb: "A change-rate test and update triggers, plus what counts as a real update.",
  },
  "ai-search-content-refresh-calendar": {
    title: "How to Build an AI Search Content Refresh Calendar",
    blurb: "Refresh intervals by page type, a free spreadsheet template and a change log pattern.",
  },
  "google-ai-mode-vs-traditional-search": {
    title: "Google AI Mode vs. Traditional Search: What It Means for Web Traffic",
    blurb: "How AI Mode differs from classic results and AI Overviews, and what it does to clicks.",
  },
  "what-is-google-ai-mode": {
    title: "What Is Google AI Mode? How It Works and How It Differs From AI Overviews",
    blurb: "How Google AI Mode works, sourced to Google, and how it differs from AI Overviews.",
  },
  "what-is-ai-mode-in-google": {
    title: "What Is AI Mode in Google? Where to Find It and How to Use It",
    blurb: "Where to find AI Mode, what you can do in it, and how to leave it.",
  },
  "ai-search-intent-conversational-buyer-stages": {
    title: "AI Search Intent: The 4 New Conversational Buyer Stages",
    blurb: "Four conversational buyer stages, and the content asset that wins each one.",
  },
  "how-search-intent-is-evolving-with-conversational-ai": {
    title: "How Search Intent Is Evolving With Conversational AI Assistants",
    blurb: "From the classic intent taxonomy to how people talk to assistants now, with the data.",
  },
  "voice-search-ai-powered": {
    title: "Voice Search Is Back\u2014But This Time It's AI-Powered",
    blurb: "How voice prompts differ from typed search, and a spoken-answer format to write in.",
  },
  "voice-search-optimization-2026": {
    title: "Voice Search Optimization in 2026: A Checklist for AI Assistants",
    blurb:
      "A 2026 voice checklist: assistants, their answer sources, local listings and crawl access.",
  },
  "chatgpt-ranking-factors-ai-search-placement": {
    title: "The 7 ChatGPT Ranking Factors: What Actually Influences AI Search Placement",
    blurb: "Seven signals said to decide ChatGPT recommendations, each graded by its evidence.",
  },
  "chatgpt-ranking-factors": {
    title: "ChatGPT Ranking Factors: What OpenAI Documents and What the Data Shows",
    blurb: "What OpenAI documents about how ChatGPT search picks sources, plus a 10-minute check.",
  },
  "best-chatgpt-seo-software": {
    title: "Best ChatGPT SEO Software in 2026: Tools to Get Cited and to Work Inside ChatGPT",
    blurb:
      "Software to get cited by ChatGPT, and SEO tools that work inside ChatGPT, dated prices.",
  },
  "reddit-in-ai-search": {
    title: "The Role of Reddit in AI Search: Why LLMs Prioritize Forum Discussions",
    blurb: "Why AI answers cite Reddit so often, and how to join buyer threads by Reddit's rules.",
  },
  "how-to-use-reddit-for-seo": {
    title: "How to Use Reddit for SEO: A Rule-Following Guide for 2026",
    blurb:
      "Reddit in Google results and AI answers: find ranking threads and take part by the rules.",
  },
  "how-to-rank-in-ai-search-results": {
    title: "How to Rank in AI Search Results: A 10-Step Plan",
    blurb:
      "Ten steps across AI engines, ordered by effort and impact, each linked to a deep guide.",
  },
  "local-seo-in-chatgpt": {
    title: "Local SEO in ChatGPT: How AI Search Recommends Nearby Businesses",
    blurb: "Where each AI assistant gets local answers, and a three-part plan for near-me picks.",
  },
  "how-ai-helps-small-businesses-with-local-seo": {
    title: "How AI Helps Small Businesses With Local SEO: 8 Practical Uses",
    blurb: "Eight practical ways AI tools speed up local SEO work, with prompts and guardrails.",
  },
  "how-to-get-cited-by-chatgpt-as-a-local-business": {
    title: "How to Get Cited by ChatGPT as a Local Business",
    blurb: "How ChatGPT answers local questions, and the listings and reviews to fix first.",
  },
  "apple-intelligence-siri-chatgpt": {
    title: "Apple Intelligence & Siri: How iOS 18/26 Routes Queries to ChatGPT",
    blurb: "How Apple Intelligence and Siri route questions, and how to be the recommendation.",
  },
  "what-does-apple-intelligence-do": {
    title: "What Does Apple Intelligence Do? Every Feature Explained for 2026",
    blurb: "Every Apple Intelligence feature in 2026, with devices, languages and privacy.",
  },
  "how-chatgpt-search-decides-citations": {
    title: "How ChatGPT Search Decides Citations: What OpenAI Documents and What Tests Show",
    blurb: "When ChatGPT searches, how it picks and shows sources, and what tests found.",
  },
  "link-building-ai-visibility-co-citation": {
    title: 'Does Link Building Still Matter for AI Visibility? The New Rules of "Co-Citation"',
    blurb: "Links still matter, and unlinked co-citations shape what models associate with you.",
  },
  "does-link-building-help-ai-visibility": {
    title: "Does Link Building Help With AI Visibility? What the Evidence Shows",
    blurb: "Yes, indirectly: what the evidence says about links, mentions and AI visibility.",
  },
  "ai-link-building": {
    title: "AI Link Building: How to Use AI Tools to Earn Links Without Spam",
    blurb: "AI tools for prospecting, research and outreach, inside Google's link spam rules.",
  },
  "github-readme-ai-seo": {
    title: "GitHub READMEs as AI SEO Fuel: Why Developers Rank in ChatGPT Without a Blog",
    blurb:
      "How GitHub READMEs reach AI assistants, graded by evidence, and a README built for both.",
  },
  "github-seo": {
    title: "GitHub SEO: How to Make a Repository Findable in Google and AI Search",
    blurb: "Make a repository findable in Google, GitHub search and AI: the fields that count.",
  },
  "github-pages-seo": {
    title: "GitHub Pages SEO: A Setup Guide for Project Sites and Docs",
    blurb: "Set up GitHub Pages for search: domains, robots.txt, sitemaps, redirects and limits.",
  },
  "open-source-seo-tools": {
    title: "Open Source SEO Tools: A 2026 List With What Each One Does",
    blurb: "Twenty open source SEO tools by job, with licences and last activity checked.",
  },
  "substack-arbitrage-llm-knowledge": {
    title: "The Substack Arbitrage: Using High-Domain-Authority Newsletters to Seed LLM Knowledge",
    blurb: "Using newsletters to back up your brand's facts in AI answers, within Google's rules.",
  },
  "is-substack-good-for-seo": {
    title: "Is Substack Good for SEO? What Google Indexes and What You Give Up",
    blurb: "What Google indexes from Substack, and what you give up by not owning the site.",
  },
  "substack-seo": {
    title: "Substack SEO: Settings, Custom Domains and Posts That Get Found",
    blurb: "Every Substack setting that affects search, verified in Substack's help center.",
  },
  "seo-newsletters": {
    title: "The Best SEO Newsletters to Read in 2026",
    blurb: "SEO and AI search newsletters worth reading, each checked on its own page.",
  },
  "podcast-transcripts-ai-search-citations": {
    title: "Podcast Transcripts & Whisper AI: How Spoken Audio Becomes Search Citations",
    blurb: "What's documented about AI and podcast audio, and a transcript page AI can quote.",
  },
  "how-can-a-podcast-increase-seo": {
    title: "How Can a Podcast Increase SEO? 6 Ways It Helps and 2 It Doesn't",
    blurb: "Six ways a podcast helps SEO and two ways it doesn't, each graded by evidence.",
  },
  "podcast-seo": {
    title: "Podcast SEO: How to Get Your Show Found in Search, Apps and AI",
    blurb: "Get a show found in Google, YouTube, Apple, Spotify and AI: a 30-minute audit.",
  },
  "does-podcast-image-help-seo": {
    title: "Does a Podcast Image Help SEO? Cover Art, Episode Images and Alt Text",
    blurb: "Podcast artwork isn't a ranking factor; where images do matter, with specs.",
  },
  "multimodal-geo": {
    title: 'Multimodal GEO: How AI Search "Sees" Infographics, Charts, and Screenshots',
    blurb: "What AI search documents about reading images, and charts built to be read as text.",
  },
  "multimodal-seo": {
    title: "Multimodal SEO: How to Optimize Images, Video and Audio for AI Search",
    blurb: "Optimize images, video and audio for AI search, with a media parity audit.",
  },
  "what-is-multimodal-search": {
    title: "What Is Multimodal Search? Google Lens, Circle to Search and AI Mode Explained",
    blurb: "Google Lens, Circle to Search, AI Mode and other ways to search with images and voice.",
  },
  "indirect-prompt-injection-black-hat-geo": {
    title: 'Indirect Prompt Injection & "Black Hat" GEO: Can You Hijack AI Search Crawlers?',
    blurb: "Where AI actually reads your page, what tests show, and why black hat GEO backfires.",
  },
  "indirect-prompt-injection": {
    title: "Indirect Prompt Injection: What It Is, Documented Cases and Defenses",
    blurb: "Instructions hidden in content a model reads: documented cases and defenses.",
  },
  "what-is-prompt-injection": {
    title: "What Is Prompt Injection in AI? A Plain-English Guide",
    blurb: "Prompt injection in plain English: direct versus indirect, and what to do.",
  },
  "how-does-prompt-injection-work": {
    title: "How Does Prompt Injection Work in Generative AI? A Step-by-Step Look",
    blurb: "The mechanics step by step, and which defense interrupts each step.",
  },
  "agentic-seo-autonomous-ai-buyers": {
    title: "Agentic SEO: Optimizing for Autonomous AI Buyers (Beyond Conversational Search)",
    blurb: "What AI agents sent to buy need from a site, and where they get stuck today.",
  },
  "what-is-agentic-seo": {
    title: "What Is Agentic SEO? A Plain Definition With Examples",
    blurb: "A plain definition of agentic SEO, with three examples and first steps.",
  },
  "ai-powered-seo-agents": {
    title: "AI-Powered SEO Agents in 2026: What They Do and Which Tasks to Trust Them With",
    blurb: "AI agents that do SEO work: what they handle well and what needs a human.",
  },
  "what-are-ai-powered-seo-agents": {
    title: "What Are AI-Powered SEO Agents? How They Work Under the Hood",
    blurb: "How SEO agents work: a model, tools and a loop, and where they fail.",
  },
  "prompt-zero-purchase-ai-agents-buy-software": {
    title:
      'The "Prompt-Zero" Purchase: When AI Agents Buy Software Without a Human Ever Seeing the SERP',
    blurb: "When an agent shortlists software for a buyer: a zero-human evaluation checklist.",
  },
  "how-saas-companies-use-ai-for-seo-content-creation": {
    title: "How SaaS Companies Use AI for SEO Content Creation",
    blurb: "How SaaS content teams use AI across research, drafts, editing and refreshes.",
  },
  "chatgpt-search-ads-conversational-ppc": {
    title: "The Coming Wave of ChatGPT Search Ads: How Conversational PPC Will Work",
    blurb: "Ads in AI answers today, and how a conversational auction could work.",
  },
  "chatgpt-search-ads": {
    title: "ChatGPT Search Ads: What Exists, Who Can Buy, and How They Look",
    blurb: "ChatGPT ads as of September 2026: where they show, who sees them, who can buy.",
  },
  "does-chatgpt-search-have-paid-ads": {
    title: "Does ChatGPT Search Have Paid Ads? A Direct Answer",
    blurb: "A direct answer on paid ads in ChatGPT search, and how to tell ads apart.",
  },
  "headless-brand-zero-click": {
    title: 'The "Headless Brand": What Happens to Marketing When No One Visits Your Homepage?',
    blurb: "When AI answers carry your brand: what they say, and a headless brand audit.",
  },
  "zero-click-searches": {
    title: "Zero-Click Searches: What the Data Shows in 2026",
    blurb: "What zero-click studies found, before and after AI Overviews, by query type.",
  },
  "how-to-measure-roi-from-zero-click-searches": {
    title: "How to Measure ROI From Zero-Click Searches",
    blurb: "Measure the value of visibility that doesn't click, with a simple ROI model.",
  },
  "death-of-10-blue-links": {
    title: "The Death of 10 Blue Links",
    blurb: "From indexing to ranking to synthesis: a sourced timeline, 1998 to 2026.",
  },
  "how-user-search-intent-evolves-with-conversational-ai": {
    title: "How User Search Intent Evolves Within a Conversation With an AI Assistant",
    blurb: "How intent shifts turn by turn inside one AI conversation, and what content helps.",
  },
  "edge-seo-for-ai-cloudflare-workers": {
    title: "Edge SEO for AI: Dynamic Rendering & Header Injection via Cloudflare Workers",
    blurb: "Edge SEO at the CDN, and serving AI agents a cleaner copy of the same page.",
  },
  "edge-seo": {
    title: "Edge SEO: A Practical Guide to SEO Changes at the CDN",
    blurb: "What you can change at the CDN, on which platforms, and how to govern it.",
  },
  "what-is-edge-seo": {
    title: "What Is Edge SEO? A Plain Definition, With Examples and Risks",
    blurb: "A plain definition of edge SEO, three examples and the main risks.",
  },
  "dynamic-rendering-prerendering-ai-crawlers": {
    title: "Dynamic Rendering & Prerendering for JavaScript-Heavy AI Crawlers",
    blurb: "What crawlers that don't run JavaScript see, and the fix for each framework.",
  },
  "dynamic-rendering-seo": {
    title: "Dynamic Rendering SEO: What Google Says Now and Safer Alternatives",
    blurb: "Google's current position on dynamic rendering, and safer alternatives.",
  },
  "prerender-seo": {
    title: "Prerender SEO: How Prerendering Works and When You Need It",
    blurb: "How prerendering works, the services, cache freshness and how to test it.",
  },
  "cloudflare-ai-bot-management": {
    title: "Cloudflare AI Bot Management: Blocking Scrapers vs. Preserving Citations",
    blurb: "Every Cloudflare AI bot setting, what it hits, and which keep AI search open.",
  },
  "cloudflare-ai-bots": {
    title: "Cloudflare AI Bots: How Cloudflare Classifies AI Crawlers and Where to See Them",
    blurb: "How Cloudflare classifies AI crawlers, and where to see their traffic.",
  },
  "block-ai-bots-cloudflare": {
    title: "How to Block AI Bots in Cloudflare Without Losing AI Search Traffic",
    blurb: "Block AI training crawlers in Cloudflare while keeping AI search bots.",
  },
  "ai-crawler-robots-txt-guide": {
    title: "The Complete AI Crawler robots.txt Guide",
    blurb: "Which AI bots to allow or block by goal, with tested robots.txt templates.",
  },
  "ai-crawler-robots-txt": {
    title: "AI Crawler robots.txt Mistakes: How to Test Rules for GPTBot, ClaudeBot and Others",
    blurb: "Common robots.txt mistakes with AI crawlers, and how to test your rules.",
  },
  "applebot-apple-intelligence-search": {
    title: "Applebot User-Agent & Preparing for Apple Intelligence Search",
    blurb: "What Applebot powers, what Applebot-Extended controls, and a readiness check.",
  },
  "applebot-user-agent": {
    title: "Applebot User Agent Strings: How to Identify and Verify Apple's Crawler",
    blurb: "Applebot's user-agent strings, and how to verify the real crawler.",
  },
  "aeo-vs-geo": {
    title: "Answer Engine Optimization (AEO) vs. Generative Engine Optimization (GEO)",
    blurb: "AEO and GEO side by side: what each optimizes for, where they overlap, and one plan.",
  },
  "aeo-vs-geo-differences": {
    title: "AEO vs GEO: The Tactics That Overlap and the Ones That Don't",
    blurb: "Common tactics sorted: which help both AEO and GEO, and which help only one.",
  },
  "geo-vs-aeo": {
    title: "GEO vs AEO: Where the Terms Came From and Which One to Use",
    blurb: "Where GEO, AEO, LLMO and AI SEO came from, and which term to use.",
  },
  "answer-engine-optimization-vs-seo": {
    title: "Answer Engine Optimization vs SEO: What Changes and What Doesn't",
    blurb: "What changes from classic SEO to AEO, what doesn't, and what Google says.",
  },
  "brand-sentiment-chatgpt": {
    title: "Brand Sentiment & Mention Monitoring in ChatGPT",
    blurb: "What shapes how ChatGPT describes your brand, and a method to score its sentiment.",
  },
  "monitor-brand-mentions-in-chatgpt": {
    title: "How to Monitor Brand Mentions in ChatGPT: A Weekly Routine",
    blurb: "A weekly prompt-panel routine for ChatGPT, with a log template and tools.",
  },
  "optimize-brand-mentions-in-chatgpt-and-perplexity": {
    title: "How to Optimize Brand Mentions in ChatGPT and Perplexity",
    blurb: "What moves brand mentions in ChatGPT and Perplexity, and how the two differ.",
  },
  "get-cited-by-perplexity": {
    title: "How to Get Cited by Perplexity AI",
    blurb: "How Perplexity picks and names its sources, and how to make sure it can reach you.",
  },
  "brand-mentions-in-perplexity": {
    title: "Brand Mentions in Perplexity: How Perplexity Decides Which Brands to Name",
    blurb: "Which sources Perplexity cites for brand questions, and named versus cited.",
  },
  "track-brand-mentions-in-perplexity": {
    title: "How to Track Brand Mentions in Perplexity, Free and Paid",
    blurb: "Track Perplexity mentions by hand or with tools, with dated prices.",
  },
  "how-to-get-cited-by-perplexity": {
    title: "How to Get Cited by Perplexity: A 30-Day Plan for One Page",
    blurb: "One page, 30 days: a day-by-day plan to earn a Perplexity citation.",
  },
  "co-citation-seo": {
    title: "Co-Citation SEO: Teaching LLMs to Connect Your Brand to Industry Leaders",
    blurb: "Where brands get named next to category leaders, and how to earn those mentions.",
  },
  "what-is-co-citation-in-seo": {
    title: "What Is Co-Citation in SEO? Meaning, Examples and How It Differs From Co-Occurrence",
    blurb: "Co-citation and co-occurrence defined, where the term came from, with examples.",
  },
  "entity-seo-strategy": {
    title: "Entity SEO Strategy: Choosing the Entities Your Site Should Own",
    blurb: "Choose the entities your site should own, and map them to pages and schema.",
  },
  "wikidata-seo": {
    title: "Wikidata SEO: Building Machine-Readable Authority for LLM Knowledge Bases",
    blurb: "What's documented about Wikidata in AI and search, and a compliant company item.",
  },
  "create-wikidata-item-for-company": {
    title: "How to Create a Wikidata Item for Your Company (Without Getting It Deleted)",
    blurb: "Create a company Wikidata item step by step, within Wikidata's rules.",
  },
  "cheap-seo": {
    title: "Cheap SEO in 2026: What Works and What's a Scam",
    blurb: "The free tools to set up first, the few paid ones worth buying, and the red flags.",
  },
  "rankpill-alternatives": {
    title: "9 RankPill Alternatives in 2026: Prices and Terms Compared",
    blurb: "Cheaper autopilots, bigger plans, and what 30 articles a month really costs.",
  },
  "outrank-alternatives": {
    title: "10 Best Outrank Alternatives in 2026 (Full Costs Checked)",
    blurb: "Cheaper autopilots, longer articles, AI tracking, and when Outrank still wins.",
  },
  "frase-alternatives": {
    title: "9 Best Frase Alternatives in 2026, Matched by Job",
    blurb: "Editors, cheaper optimizers, an autopilot, and when Frase still wins.",
  },
  "surfer-seo-alternatives": {
    title: "9 Surfer SEO Alternatives in 2026, With or Without an Editor",
    blurb: "Cheaper editors, all-in-one tools, and an option with no editor at all.",
  },
  "koala-ai-alternatives": {
    title: "9 Best Koala AI Alternatives, Priced per Article (2026)",
    blurb: "Fixed-price article plans, cheaper autopilots, and when Koala still wins.",
  },
  "seobot-alternatives": {
    title: "9 Best SEObot Alternatives in 2026, Priced Per Article",
    blurb: "Flat 30-article plans, AI tracking, programmatic SEO, and when SEObot wins.",
  },
  "byword-alternatives": {
    title: "9 Byword Alternatives for Bulk SEO Content in 2026",
    blurb: "Cheaper bulk writers, daily autopilots, and when Byword still wins.",
  },
  "jasper-alternatives": {
    title: "9 Best Jasper Alternatives in 2026, Picked by Job",
    blurb: "Alternatives by job: SEO articles, channel copy, cheap team seats.",
  },
  "writesonic-alternatives": {
    title: "10 Writesonic Alternatives in 2026: Writers and AI Trackers",
    blurb: "AI writers for articles, AI visibility trackers, and when Writesonic wins.",
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
      case "solutions": {
        const sol = SOLUTIONS.find((x) => x.slug === slug);
        return (
          sol && { title: sol.name.charAt(0).toUpperCase() + sol.name.slice(1), blurb: sol.tagline }
        );
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
const s = (slug: string) => `/solutions/${slug}`;
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
      b("brand-sentiment-chatgpt"),
      b("monitor-brand-mentions-in-chatgpt"),
      b("chatgpt-ranking-factors-ai-search-placement"),
      b("chatgpt-ranking-factors"),
      b("how-chatgpt-search-decides-citations"),
      b("best-chatgpt-seo-software"),
      b("how-to-get-cited-by-chatgpt-as-a-local-business"),
      b("chatgpt-search-ads-conversational-ppc"),
      b("chatgpt-search-ads"),
      b("does-chatgpt-search-have-paid-ads"),
      b("how-to-rank-on-chatgpt"),
      b("optimize-website-for-chatgpt-and-perplexity"),
      b("cloudflare-blocking-chatgpt"),
      b("why-is-cloudflare-blocking-chatgpt"),
      b("how-to-get-indexed-by-llm-through-llms-txt"),
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
      b("google-ai-mode-vs-traditional-search"),
      b("what-is-google-ai-mode"),
      b("what-is-ai-mode-in-google"),
      b("voice-search-optimization-2026"),
      b("what-is-multimodal-search"),
      b("zero-click-searches"),
      b("death-of-10-blue-links"),
      b("will-llms-txt-help-your-seo"),
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
    pages: [
      e("perplexity"),
      b("perplexity-seo-tools"),
      b("brand-presence-in-perplexity"),
      b("optimize-website-for-chatgpt-and-perplexity"),
      b("optimize-brand-mentions-in-chatgpt-and-perplexity"),
      b("get-cited-by-perplexity"),
      b("brand-mentions-in-perplexity"),
      b("track-brand-mentions-in-perplexity"),
      b("how-to-get-cited-by-perplexity"),
      i("perplexity"),
      ...g("perplexitybot"),
    ],
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
    pages: [
      e("copilot"),
      b("bing-webmaster-tools-ai-indexing-guide"),
      b("how-to-use-bing-webmaster-tools-for-seo"),
      b("does-bing-webmaster-tools-help-google-indexing"),
      i("copilot-studio"),
      i("github-copilot"),
    ],
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
      b("ai-search-intent-conversational-buyer-stages"),
      b("how-search-intent-is-evolving-with-conversational-ai"),
      b("death-of-10-blue-links"),
      b("how-user-search-intent-evolves-with-conversational-ai"),
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
      b("optimize-content-for-ai-search"),
      b("koala-ai-alternatives"),
      b("how-does-ai-search-interpret-user-intent"),
      b("how-ai-search-uses-user-intent-and-context"),
      b("hallucination-by-omission-pricing-page"),
      b("how-does-rag-reduce-hallucinations"),
      b("optimize-content-for-llms-writing-for-machines"),
      b("how-to-optimize-content-for-llms"),
      b("reverse-prompt-playbook"),
      b("how-to-write-blog-posts-for-ai-citation"),
      b("synthetic-content-saturation-model-collapse"),
      b("are-automated-blog-posts-effective-for-seo"),
      b("comparison-page-formula"),
      b("ai-search-content-refresh-calendar"),
      b("voice-search-ai-powered"),
      b("voice-search-optimization-2026"),
      b("how-to-rank-in-ai-search-results"),
      b("multimodal-geo"),
      b("multimodal-seo"),
      b("how-saas-companies-use-ai-for-seo-content-creation"),
      b("how-to-compare-generative-engine-optimization-software"),
      b("byword-alternatives"),
      b("jasper-alternatives"),
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
    id: "freshness",
    title: "Keep your pages current for AI answers",
    pages: [
      b("freshness-factor-ai-search"),
      b("content-freshness-seo"),
      b("how-often-to-update-content-for-ai-seo"),
      b("ai-search-content-refresh-calendar"),
      b("ai-seo-checklist"),
      f("citation-ready-writer"),
      t("ai-citation-readiness-checker"),
      t("schema-generator"),
      t("ai-search-readiness-check"),
      ...g("content-freshness", "xml-sitemap", "indexnow", "information-gain"),
    ],
  },
  {
    id: "local",
    title: "Get recommended as a local business",
    pages: [
      b("local-seo-in-chatgpt"),
      b("how-ai-helps-small-businesses-with-local-seo"),
      b("how-to-get-cited-by-chatgpt-as-a-local-business"),
      b("optimize-business-for-ai-search"),
      t("schema-generator"),
      t("get-recommended-by-chatgpt"),
      t("ai-visibility-prompt-generator"),
      f("citation-ready-writer"),
      ...g("schema-markup", "entity-seo", "brand-mentions"),
    ],
  },
  {
    id: "assistants",
    title: "Get recommended by Siri and voice assistants",
    pages: [
      b("apple-intelligence-siri-chatgpt"),
      b("what-does-apple-intelligence-do"),
      b("how-chatgpt-search-decides-citations"),
      b("voice-search-ai-powered"),
      b("voice-search-optimization-2026"),
      b("applebot-apple-intelligence-search"),
      b("applebot-user-agent"),
      i("chatgpt"),
      t("robots-txt-tester"),
      t("ai-search-readiness-check"),
      f("citation-ready-writer"),
      ...g("ai-crawlers", "snippet-controls", "answer-first-content"),
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
      b("optimize-content-for-ai-search"),
      b("vector-distance-vs-keyword-density"),
      b("frase-alternatives"),
      b("surfer-seo-alternatives"),
      b("ai-seo-checklist-pre-publish-audit"),
      b("ai-seo-checklist"),
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
    title: "Publish on a schedule",
    pages: [
      f("auto-publishing"),
      s("autonomous-geo"),
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
      b("rankpill-alternatives"),
      b("outrank-alternatives"),
      b("byword-alternatives"),
      b("seobot-alternatives"),
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
      s("ai-search-visibility"),
      s("aeo-tools"),
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
      b("how-to-track-gptbot-and-claudebot"),
      b("chatgpt-rank-tracker"),
      b("how-to-measure-geo"),
      b("how-to-measure-ai-referral-traffic-in-ga4"),
      b("how-to-track-ai-referral-traffic-in-ga4"),
      b("chatgpt-traffic-analysis"),
      b("how-to-benchmark-ai-search-performance"),
      b("writesonic-alternatives"),
      b("how-to-get-cited-by-chatgpt"),
      b("how-to-show-up-in-google-ai-overviews"),
      b("ai-search-optimization-tools"),
      b("perplexity-seo-tools"),
      b("aeo-audit"),
      b("evaluate-geo-tool-before-purchasing"),
      b("how-to-measure-roi-from-zero-click-searches"),
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
    id: "brand-mentions",
    title: "Track what AI says about your brand",
    pages: [
      b("geo-metrics-framework"),
      b("what-is-generative-engine-optimization"),
      b("how-to-benchmark-website-performance-in-ai-search"),
      b("how-to-track-brand-mentions-in-ai-search"),
      b("track-brand-mentions-in-ai-search-free-and-paid"),
      b("how-to-see-if-ai-mentions-your-brand"),
      b("see-if-ai-mentions-your-brand-places-to-look"),
      b("is-it-possible-to-track-brand-mentions-in-ai-answers"),
      b("is-it-possible-to-track-brand-mentions-in-ai-search"),
      b("how-to-benchmark-ai-citations-against-competitors"),
      b("how-to-track-competitor-rankings-in-ai-search"),
      b("fix-incorrect-brand-facts-in-ai-answers"),
      b("how-to-fix-incorrect-brand-facts-in-llm-citations"),
      b("defensive-geo"),
      b("how-to-monitor-brand-mentions-in-ai-generated-responses"),
      b("hallucination-by-omission-pricing-page"),
      b("semantic-drift-ai-memory-reset"),
      b("how-ai-models-rank-brands-in-search-results"),
      b("shadow-training-data-audit"),
      b("reddit-in-ai-search"),
      b("headless-brand-zero-click"),
      b("brand-sentiment-chatgpt"),
      t("ai-visibility-prompt-generator"),
      s("ai-search-visibility"),
      s("aeo-tools"),
      e("chatgpt"),
      e("perplexity"),
      e("claude"),
      e("gemini"),
      e("google-ai-overviews"),
      e("copilot"),
      ...g(
        "brand-mentions",
        "ai-share-of-voice",
        "ai-citation",
        "generative-engine-optimization",
        "ai-visibility",
        "answer-engine-optimization",
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
      b("ai-crawler-directory"),
      b("ai-crawler-robots-txt-guide"),
      b("ai-crawler-robots-txt"),
      b("what-is-oai-searchbot"),
      b("perplexitybot-user-agent"),
      b("applebot-apple-intelligence-search"),
      b("how-to-track-gptbot-and-claudebot"),
      b("ai-bot-crawler-census"),
      b("cloudflare-challenge-trap"),
      b("why-is-cloudflare-blocking-chatgpt"),
      b("cloudflare-blocking-chatgpt"),
      b("cloudflare-ai-bot-management"),
      b("cloudflare-ai-bots"),
      b("block-ai-bots-cloudflare"),
      b("how-to-get-indexed-by-llms-with-llms-txt"),
      b("state-of-llms-txt-adoption"),
      b("indirect-prompt-injection-black-hat-geo"),
      b("indirect-prompt-injection"),
      b("what-is-prompt-injection"),
      b("how-does-prompt-injection-work"),
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
    id: "rendering",
    title: "Serve every crawler a page it can read",
    pages: [
      b("edge-seo-for-ai-cloudflare-workers"),
      b("edge-seo"),
      b("what-is-edge-seo"),
      b("dynamic-rendering-prerendering-ai-crawlers"),
      b("dynamic-rendering-seo"),
      b("prerender-seo"),
      t("ai-search-readiness-check"),
      t("ai-crawler-log-analyzer"),
      t("robots-txt-tester"),
      t("llms-txt-generator"),
      ...g("server-side-rendering", "canonical-tag", "crawl-budget", "indexing", "robots-txt"),
    ],
  },
  {
    id: "llms-txt",
    title: "Point AI agents at your best pages with llms.txt",
    pages: [
      t("llms-txt-generator"),
      b("what-is-an-llms-txt-file"),
      b("llms-txt-standard"),
      b("how-to-get-indexed-by-llms-with-llms-txt"),
      b("will-llms-txt-help-your-seo"),
      b("state-of-llms-txt-adoption"),
      b("how-to-get-indexed-by-llm-through-llms-txt"),
      ...g("llms-txt", "xml-sitemap", "indexing"),
    ],
  },
  {
    id: "authority",
    title: "Build the authority AI engines trust",
    pages: [
      f("authority-backlinks"),
      f("reddit-presence"),
      s("ai-search-visibility"),
      u("seo-agencies"),
      u("local-businesses"),
      e("chatgpt"),
      e("perplexity"),
      e("gemini"),
      e("grok"),
      e("meta-ai"),
      t("get-recommended-by-chatgpt"),
      b("optimize-business-for-ai-search"),
      b("brand-presence-in-perplexity"),
      b("how-to-rank-on-chatgpt"),
      b("knowledge-graph-for-ai"),
      b("what-is-a-knowledge-graph-in-seo"),
      b("knowledge-graph-search-api"),
      b("seo-knowledge-graph"),
      b("entity-authority-in-the-ai-era"),
      b("what-is-entity-authority-in-seo"),
      b("entity-authority-seo"),
      b("do-author-bios-help-ai-search-visibility"),
      b("do-author-bios-help-seo"),
      b("author-bio-seo"),
      b("shadow-training-data-audit"),
      b("reddit-in-ai-search"),
      b("how-to-use-reddit-for-seo"),
      b("how-to-rank-in-ai-search-results"),
      b("link-building-ai-visibility-co-citation"),
      b("does-link-building-help-ai-visibility"),
      b("ai-link-building"),
      b("github-readme-ai-seo"),
      b("github-seo"),
      b("github-pages-seo"),
      b("open-source-seo-tools"),
      b("substack-arbitrage-llm-knowledge"),
      b("is-substack-good-for-seo"),
      b("substack-seo"),
      b("seo-newsletters"),
      b("podcast-transcripts-ai-search-citations"),
      b("how-can-a-podcast-increase-seo"),
      b("podcast-seo"),
      b("does-podcast-image-help-seo"),
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
  {
    id: "aeo-geo",
    title: "Understand AEO, GEO and how they differ from SEO",
    pages: [
      b("aeo-vs-geo"),
      b("aeo-vs-geo-differences"),
      b("geo-vs-aeo"),
      b("answer-engine-optimization-vs-seo"),
      s("ai-search-visibility"),
      s("aeo-tools"),
      t("ai-search-readiness-check"),
      t("ai-visibility-prompt-generator"),
      f("answer-space-research"),
      ...g(
        "answer-engine-optimization",
        "generative-engine-optimization",
        "ai-share-of-voice",
        "featured-snippet",
      ),
    ],
  },
  {
    id: "entities",
    title: "Become an entity AI engines recognize",
    pages: [
      b("co-citation-seo"),
      b("what-is-co-citation-in-seo"),
      b("entity-seo-strategy"),
      b("wikidata-seo"),
      b("create-wikidata-item-for-company"),
      t("schema-generator"),
      t("get-recommended-by-chatgpt"),
      f("citation-ready-writer"),
      ...g("entity-seo", "knowledge-graph", "brand-mentions", "digital-pr", "e-e-a-t"),
    ],
  },

  /* Every AI-tool page links here; the directory itself links to them all. */
  {
    id: "ai-tools",
    title: "Research content from your AI tools",
    pages: [
      i("mcp"),
      i("api"),
      b("mcp-protocol-new-sitemap"),
      b("claude-for-seo-audits"),
      b("how-to-use-claude-for-seo-audits"),
      b("claude-seo-tool"),
      b("agentic-seo-autonomous-ai-buyers"),
      b("what-is-agentic-seo"),
      b("ai-powered-seo-agents"),
      b("what-are-ai-powered-seo-agents"),
      b("prompt-zero-purchase-ai-agents-buy-software"),
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
      b("how-to-compare-generative-engine-optimization-software"),
      b("what-is-generative-engine-optimization"),
      "/pricing",
      s("autonomous-geo"),
      s("aeo-tools"),
      s("ai-search-visibility"),
      b("ai-search-optimization-tools"),
      b("chatgpt-rank-tracker"),
      b("cheap-seo"),
      b("rankpill-alternatives"),
      b("outrank-alternatives"),
      b("frase-alternatives"),
      b("surfer-seo-alternatives"),
      b("koala-ai-alternatives"),
      b("seobot-alternatives"),
      b("byword-alternatives"),
      b("jasper-alternatives"),
      b("writesonic-alternatives"),
      b("claude-seo-tool"),
      b("geo-tools-list"),
      b("best-chatgpt-seo-software"),
      b("open-source-seo-tools"),
      b("ai-powered-seo-agents"),
      b("evaluate-geo-tool-before-purchasing"),
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
 * Comparison and solutions pages say only what Rankbox ships today (see
 * SHIPPED), so they never link to a feature or add-on that hasn't. Each link
 * appears the day its flag flips.
 */
const CLAIM_CHECKED: Section[] = ["alternatives", "compare", "solutions"];
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
  // The "best X alternatives" posts compare real products, so they follow the
  // comparison sections' rule and never suggest a feature that hasn't shipped.
  const claimChecked =
    CLAIM_CHECKED.includes(own) || /^\/blog\/[a-z0-9-]+-alternatives$/.test(path);
  const cards: string[] = [];
  const terms: string[] = [];
  const perSection = new Map<Section, number>();

  topics.forEach((topic, n) => {
    const pools = SECTION_ORDER.filter((section) => section !== own)
      .map((section) => ({
        section,
        pages: topic.pages.filter(
          (p) =>
            sectionOf(p) === section &&
            !skip.has(p) &&
            !(claimChecked && UNSHIPPED.has(p)) &&
            isBlogPathLive(p),
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
