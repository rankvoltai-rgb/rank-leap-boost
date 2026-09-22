/**
 * The glossary index: every term's name, category and one-sentence
 * definition. Light on purpose — the hub, the sitemap and each entry's
 * related-terms cards read it, while an entry's long text lives in
 * ./content/<slug>.ts and is only loaded by the page that shows it.
 *
 * The definition is the passage most likely to be lifted word for word, so it
 * follows one pattern everywhere: the term, the category it belongs to, and
 * what makes it different — one sentence, no preamble. It lives here, not in
 * the entry, so the hub card, the entry page and the schema can never drift.
 */
import type { Md } from "./types";

export type GlossaryCategoryId =
  | "ai-search"
  | "llms"
  | "crawlers"
  | "technical"
  | "content"
  | "authority"
  | "measurement";

export interface GlossaryCategory {
  id: GlossaryCategoryId;
  name: string;
  /** One line under the name on the hub. */
  description: string;
}

export const CATEGORIES: GlossaryCategory[] = [
  {
    id: "ai-search",
    name: "AI search & GEO",
    description: "The disciplines and the surfaces: SEO, GEO, AEO, and where AI answers appear.",
  },
  {
    id: "llms",
    name: "How LLMs answer",
    description: "How language models retrieve, rank and ground the sources they cite.",
  },
  {
    id: "crawlers",
    name: "AI crawlers",
    description: "The bots that read your site, what each one does, and how to control them.",
  },
  {
    id: "technical",
    name: "Technical SEO",
    description: "Rendering, indexing and markup: whether engines can read the page at all.",
  },
  {
    id: "content",
    name: "Content & relevance",
    description: "What makes a page the best answer to a question, and keeps it that way.",
  },
  {
    id: "authority",
    name: "Authority & off-site",
    description: "Links, mentions and entities: why engines trust one source over another.",
  },
  {
    id: "measurement",
    name: "Measurement",
    description: "How to see whether search and AI engines rank, cite and send you traffic.",
  },
];

export interface GlossaryTerm {
  slug: string;
  /** As a searcher types it, in sentence case. */
  term: string;
  abbr?: string;
  /** Other names people search for. */
  aliases?: string[];
  category: GlossaryCategoryId;
  /** One sentence: the term, its category, what sets it apart. */
  definition: Md;
  published: string;
  updated: string;
}

const PUBLISHED = "2026-09-21";

/* `updated` moves when an entry's facts are re-checked; `published` never does. */
function t(term: Omit<GlossaryTerm, "published" | "updated"> & { updated?: string }): GlossaryTerm {
  return { published: PUBLISHED, updated: PUBLISHED, ...term };
}

export const TERMS: GlossaryTerm[] = [
  /* ---------- AI search & GEO ---------- */
  t({
    slug: "search-engine-optimization",
    term: "Search engine optimization",
    abbr: "SEO",
    aliases: ["organic search optimization"],
    category: "ai-search",
    definition:
      "Search engine optimization (SEO) is the practice of improving a website's content, technical setup and authority so search engines crawl, index and rank it for relevant queries — and because most AI answer engines retrieve their sources from a search index, it is also the foundation of AI visibility.",
  }),
  t({
    slug: "generative-engine-optimization",
    term: "Generative engine optimization",
    abbr: "GEO",
    aliases: ["generative search optimization", "AI search optimization"],
    category: "ai-search",
    definition:
      "Generative engine optimization (GEO) is the practice of making content easy for AI answer engines such as ChatGPT, Perplexity and Google AI Overviews to retrieve, quote and cite — where SEO competes for a ranked link, GEO competes to be a named source inside the generated answer.",
  }),
  t({
    slug: "answer-engine-optimization",
    term: "Answer engine optimization",
    abbr: "AEO",
    aliases: ["answer optimization"],
    category: "ai-search",
    definition:
      "Answer engine optimization (AEO) is the practice of structuring content as direct, extractable answers so that systems which return one answer — featured snippets, voice assistants and AI chatbots — use it as the answer itself rather than listing it as one link among ten.",
  }),
  t({
    slug: "llm-seo",
    term: "LLM SEO",
    aliases: ["LLMO", "LLM optimization", "AI SEO"],
    category: "ai-search",
    definition:
      "LLM SEO is the practice of making a brand visible in the responses of large language models such as ChatGPT, Claude and Gemini, covering both what a model says from its training data and what it cites when it searches the live web.",
  }),
  t({
    slug: "ai-search-engine",
    term: "AI search engine",
    aliases: ["answer engine", "generative search engine"],
    category: "ai-search",
    definition:
      "An AI search engine is a search product that answers a query with a response written by a large language model, grounded in web pages it retrieves and usually citing them, instead of returning a ranked list of links for the user to open.",
  }),
  t({
    slug: "ai-overviews",
    term: "AI Overviews",
    aliases: ["Google AI Overviews", "Search Generative Experience", "SGE"],
    category: "ai-search",
    definition:
      "Google AI Overviews are AI-generated summaries shown at the top of some Google search results, written by a Gemini model from pages in Google's search index and linked to their sources — so they are won through ordinary Google eligibility, not a separate submission or special markup.",
  }),
  t({
    slug: "ai-mode",
    term: "AI Mode",
    aliases: ["Google AI Mode"],
    category: "ai-search",
    definition:
      "Google AI Mode is a conversational search experience inside Google Search that answers complex questions with a generated response built from many parallel sub-searches and supports follow-up questions, rather than summarizing above the classic results as AI Overviews do.",
  }),
  t({
    slug: "zero-click-search",
    term: "Zero-click search",
    aliases: ["no-click search", "zero-click results"],
    category: "ai-search",
    definition:
      "A zero-click search is a search that ends without the user clicking through to any website, because the results page itself answered the question — through a featured snippet, a knowledge panel, an AI Overview or a chatbot reply.",
  }),
  t({
    slug: "ai-visibility",
    term: "AI visibility",
    aliases: ["LLM visibility", "AI search visibility"],
    category: "ai-search",
    definition:
      "AI visibility is a measure of how often, how prominently and how favorably a brand appears in answers from AI systems such as ChatGPT, Perplexity, Gemini and Google AI Overviews for the questions its buyers ask — the AI-search counterpart to search rankings.",
  }),
  t({
    slug: "ai-citation",
    term: "AI citation",
    aliases: ["LLM citation", "AI source citation"],
    category: "ai-search",
    definition:
      "An AI citation is a link or source reference that an AI answer engine attaches to its response to show where a claim came from, and it differs from a brand mention in that it points to a specific page that can be clicked and can send traffic.",
  }),

  /* ---------- How LLMs answer ---------- */
  t({
    slug: "large-language-model",
    term: "Large language model",
    abbr: "LLM",
    aliases: ["language model", "foundation model"],
    category: "llms",
    definition:
      "A large language model (LLM) is a neural network trained on vast amounts of text to predict the next word, which lets it write fluent answers — the technology behind ChatGPT, Claude and Gemini, whose knowledge is fixed at training time unless it retrieves fresh sources.",
  }),
  t({
    slug: "retrieval-augmented-generation",
    term: "Retrieval-augmented generation",
    abbr: "RAG",
    aliases: ["retrieval augmented generation"],
    category: "llms",
    definition:
      "Retrieval-augmented generation (RAG) is a technique in which an AI system first retrieves relevant documents from an index and then gives them to a large language model to write its answer, so the response can cite current sources instead of relying only on what the model memorized in training.",
  }),
  t({
    slug: "query-fan-out",
    term: "Query fan-out",
    aliases: ["fan-out queries", "query decomposition"],
    category: "llms",
    definition:
      "Query fan-out is an AI search technique in which the engine rewrites one user question into several narrower sub-queries, runs them in parallel and builds its answer from the combined results — which is why a page can be cited for a prompt it doesn't rank for.",
  }),
  t({
    slug: "grounding",
    term: "Grounding",
    aliases: ["AI grounding", "grounded generation"],
    category: "llms",
    definition:
      "Grounding is the process of tying an AI model's answer to specific, verifiable sources — usually web pages retrieved at the moment of the question — so the claims in the response can be checked and cited, rather than generated from the model's memory alone.",
  }),
  t({
    slug: "ai-hallucination",
    term: "AI hallucination",
    aliases: ["LLM hallucination", "confabulation"],
    category: "llms",
    definition:
      "An AI hallucination is a confident but false statement produced by a large language model — an invented statistic, feature, price or citation — which happens because the model generates plausible text rather than looking facts up.",
  }),
  t({
    slug: "knowledge-cutoff",
    term: "Knowledge cutoff",
    aliases: ["training cutoff", "training data cutoff"],
    category: "llms",
    definition:
      "A knowledge cutoff is the date after which a large language model has no information from its training data, so anything newer — a launch, a price change, a new competitor — reaches its answers only if the model retrieves it from the live web.",
  }),
  t({
    slug: "llm-training-data",
    term: "LLM training data",
    aliases: ["training data", "parametric knowledge", "pre-training data"],
    category: "llms",
    definition:
      "LLM training data is the body of text — web crawls, books, code, licensed and forum content — that a language model learns from before release, and it shapes what the model says about a brand without searching, in a way that can't be edited until the next model is trained.",
  }),
  t({
    slug: "vector-embeddings",
    term: "Vector embeddings",
    aliases: ["embeddings", "text embeddings"],
    category: "llms",
    definition:
      "Vector embeddings are numerical representations of text — lists of hundreds or thousands of numbers — arranged so that passages with similar meaning sit close together, which lets search systems match a query to content by meaning rather than by shared keywords.",
  }),
  t({
    slug: "semantic-search",
    term: "Semantic search",
    aliases: ["vector search", "meaning-based search"],
    category: "llms",
    definition:
      "Semantic search is a retrieval method that matches a query to content by meaning and intent — typically by comparing vector embeddings — instead of by the exact words both contain, so a page can be found for phrasings it never uses.",
  }),
  t({
    slug: "content-chunking",
    term: "Content chunking",
    aliases: ["chunking", "passage indexing", "passage-level retrieval"],
    category: "llms",
    definition:
      "Content chunking is the splitting of a page into smaller passages — often a heading and the text beneath it — that an AI retrieval system indexes, scores and quotes individually, which makes the section, not the whole page, the unit that competes for a citation.",
  }),
  t({
    slug: "reranking",
    term: "Reranking",
    aliases: ["re-ranking", "passage reranking", "cross-encoder reranking"],
    category: "llms",
    definition:
      "Reranking is a second retrieval stage in which a more precise model re-scores the top results of a first, faster search against the query and reorders them — the step that decides which few passages an AI answer engine actually reads and cites.",
  }),

  /* ---------- AI crawlers ---------- */
  t({
    slug: "ai-crawlers",
    term: "AI crawlers",
    aliases: ["AI bots", "LLM crawlers", "AI user agents"],
    category: "crawlers",
    definition:
      "AI crawlers are automated bots run by AI companies that fetch web pages for one of three jobs — training models, building an AI search index, or retrieving a page live for a user's question — and because each job uses its own user agent, each can be allowed or blocked separately.",
  }),
  t({
    slug: "gptbot",
    term: "GPTBot",
    aliases: ["OpenAI crawler", "OpenAI GPTBot"],
    category: "crawlers",
    definition:
      "GPTBot is OpenAI's web crawler for collecting content that may be used to train its AI models; blocking it in robots.txt opts a site out of training but does not remove it from ChatGPT search, which uses a separate crawler, OAI-SearchBot.",
  }),
  t({
    slug: "oai-searchbot",
    term: "OAI-SearchBot",
    aliases: ["ChatGPT search crawler", "OpenAI search bot"],
    category: "crawlers",
    definition:
      "OAI-SearchBot is OpenAI's search crawler, the bot that surfaces websites in ChatGPT search answers, which makes it the OpenAI user agent to allow for ChatGPT visibility — unlike GPTBot, which collects content only for model training.",
  }),
  t({
    slug: "claudebot",
    term: "ClaudeBot",
    aliases: ["Anthropic crawler", "Claude-SearchBot", "Claude-User"],
    category: "crawlers",
    definition:
      "ClaudeBot is Anthropic's crawler for collecting web content that may be used to train Claude models, one of three Anthropic bots alongside Claude-SearchBot, which indexes pages for Claude's search results, and Claude-User, which fetches pages when a user asks.",
  }),
  t({
    slug: "perplexitybot",
    term: "PerplexityBot",
    aliases: ["Perplexity crawler", "Perplexity-User"],
    category: "crawlers",
    definition:
      "PerplexityBot is Perplexity's crawler for indexing web pages so they can be surfaced and cited in Perplexity's answers — Perplexity says it is not used to train foundation models — while a separate agent, Perplexity-User, fetches pages live when a user asks.",
  }),
  t({
    slug: "google-extended",
    term: "Google-Extended",
    aliases: ["Google Extended robots.txt"],
    category: "crawlers",
    definition:
      "Google-Extended is a robots.txt product token, not a separate crawler, that lets site owners stop Google from using their content to train Gemini models and to ground answers in the Gemini app, without affecting Google Search — including AI Overviews and AI Mode.",
  }),
  t({
    slug: "llms-txt",
    term: "llms.txt",
    aliases: ["llms.txt file", "llms-full.txt"],
    category: "crawlers",
    definition:
      "llms.txt is a proposed standard for a Markdown file, usually at a site's root, that gives large language models a curated map of a site's key pages; unlike robots.txt it grants or blocks nothing, and no major AI search engine has confirmed using it.",
  }),
  t({
    slug: "robots-txt",
    term: "robots.txt",
    aliases: ["robots exclusion protocol", "robots file"],
    category: "crawlers",
    definition:
      "robots.txt is a plain-text file at a site's root that tells crawlers which paths they may fetch, rule by rule for each user agent — a voluntary standard that reputable search and AI bots follow, which controls crawling but not whether a URL gets indexed.",
  }),

  /* ---------- Technical SEO ---------- */
  t({
    slug: "server-side-rendering",
    term: "Server-side rendering",
    abbr: "SSR",
    aliases: ["JavaScript rendering", "prerendering"],
    category: "technical",
    definition:
      "Server-side rendering (SSR) is the practice of generating a page's full HTML on the server before sending it, so crawlers that don't run JavaScript — which includes most AI crawlers — can read the content in the first response.",
  }),
  t({
    slug: "schema-markup",
    term: "Schema markup",
    aliases: ["structured data", "JSON-LD", "schema.org markup"],
    category: "technical",
    definition:
      "Schema markup is structured data, usually written as JSON-LD with the Schema.org vocabulary, that labels what a page contains — an article, a product, an organization, a local business — so search engines can interpret it unambiguously and show it as rich results.",
  }),
  t({
    slug: "indexnow",
    term: "IndexNow",
    aliases: ["IndexNow protocol"],
    category: "technical",
    definition:
      "IndexNow is an open protocol that lets a website notify participating search engines, led by Microsoft Bing, the moment a URL is added, updated or deleted, instead of waiting to be recrawled — Google does not use it.",
  }),
  t({
    slug: "xml-sitemap",
    term: "XML sitemap",
    aliases: ["sitemap", "sitemap.xml"],
    category: "technical",
    definition:
      "An XML sitemap is a machine-readable file listing a site's canonical URLs, optionally with last-modified dates, so search engines can discover pages and prioritize recrawling the ones that changed — a discovery aid, not a ranking factor or a guarantee of indexing.",
  }),
  t({
    slug: "canonical-tag",
    term: "Canonical tag",
    aliases: ["rel=canonical", "canonical URL"],
    category: "technical",
    definition:
      'A canonical tag is an HTML link element (`rel="canonical"`) that tells search engines which URL is the preferred version of a page reachable at several addresses, consolidating its ranking signals onto that one URL — a strong hint, not a command.',
  }),
  t({
    slug: "snippet-controls",
    term: "Snippet controls",
    aliases: ["nosnippet", "max-snippet", "data-nosnippet"],
    category: "technical",
    definition:
      "Snippet controls are robots directives and HTML attributes — nosnippet, max-snippet and data-nosnippet — that limit how much of a page search engines may quote in results, and in Google they also limit what AI Overviews and AI Mode can use.",
  }),
  t({
    slug: "core-web-vitals",
    term: "Core Web Vitals",
    abbr: "CWV",
    aliases: ["LCP", "INP", "CLS", "page experience"],
    category: "technical",
    definition:
      "Core Web Vitals are Google's three field metrics for page experience — Largest Contentful Paint for loading, Interaction to Next Paint for responsiveness and Cumulative Layout Shift for visual stability — measured from real Chrome users and used as a modest ranking signal.",
  }),
  t({
    slug: "crawl-budget",
    term: "Crawl budget",
    aliases: ["crawl rate", "crawl capacity"],
    category: "technical",
    definition:
      "Crawl budget is the number of URLs a search engine is willing and able to crawl on a site in a given period, set by how much load the server can take and how much the engine wants the content — a real constraint mainly for large or fast-changing sites.",
  }),
  t({
    slug: "indexing",
    term: "Indexing",
    aliases: ["search indexing", "Google indexing"],
    category: "technical",
    definition:
      "Indexing is the step in which a search engine processes a crawled page and stores it in its searchable database; only indexed pages can rank, or be retrieved for AI answers built on that index, and being crawled does not guarantee being indexed.",
  }),

  /* ---------- Content & relevance ---------- */
  t({
    slug: "search-intent",
    term: "Search intent",
    aliases: ["user intent", "keyword intent", "query intent"],
    category: "content",
    definition:
      "Search intent is the goal behind a query — to learn something, reach a specific site, compare options or buy — and matching it decides which kind of page, from a guide to a product page to a comparison, search engines and AI answers treat as relevant.",
  }),
  t({
    slug: "answer-first-content",
    term: "Answer-first content",
    aliases: ["BLUF", "inverted pyramid", "bottom line up front"],
    category: "content",
    definition:
      "Answer-first content is a writing structure that puts the direct answer to a section's question in its opening sentence and adds context and evidence after it, so readers and AI retrieval systems can take the answer without reading further.",
  }),
  t({
    slug: "information-gain",
    term: "Information gain",
    aliases: ["information gain score", "net-new information"],
    category: "content",
    definition:
      "Information gain is the new information a page adds beyond what other pages on the same topic already say — original data, first-hand experience, a new angle — and it is the leading explanation for why content that rewrites the top results struggles to rank or be cited.",
  }),
  t({
    slug: "content-freshness",
    term: "Content freshness",
    aliases: ["freshness", "query deserves freshness", "QDF"],
    category: "content",
    definition:
      "Content freshness is how recently a page was substantively created or updated, which search engines weigh for time-sensitive queries and most AI answer engines appear to weigh even more — the pages they cite are measurably newer than classic search results.",
  }),
  t({
    slug: "featured-snippet",
    term: "Featured snippet",
    aliases: ["position zero", "answer box"],
    category: "content",
    definition:
      "A featured snippet is a highlighted excerpt Google shows at the top of some results to answer the query directly, lifted from one ranking page and credited with a link — the original answer-extraction format and the direct forerunner of AI Overviews.",
  }),
  t({
    slug: "topic-cluster",
    term: "Topic cluster",
    aliases: ["pillar page", "content hub", "pillar-cluster model"],
    category: "content",
    definition:
      "A topic cluster is a group of interlinked pages on one subject — a broad pillar page linked to and from narrower pages on each subtopic — built to show search engines and AI retrieval systems complete coverage of the topic rather than a single article.",
  }),
  t({
    slug: "long-tail-keywords",
    term: "Long-tail keywords",
    aliases: ["long-tail queries", "long-tail search"],
    category: "content",
    definition:
      "Long-tail keywords are specific search phrases that each draw few searches but together make up the vast majority of distinct queries, and because they signal precise intent they are the closest classic-SEO match to the conversational prompts people type into AI.",
  }),
  t({
    slug: "keyword-cannibalization",
    term: "Keyword cannibalization",
    aliases: ["content cannibalization", "SEO cannibalization"],
    category: "content",
    definition:
      "Keyword cannibalization is when two or more pages on the same site target the same query and intent, splitting links and relevance so search engines rotate between them or rank neither as well as one consolidated page would.",
  }),
  t({
    slug: "content-decay",
    term: "Content decay",
    aliases: ["traffic decay", "content drift"],
    category: "content",
    definition:
      "Content decay is the gradual loss of rankings, traffic and AI citations a page suffers as its information ages, competitors publish better answers or intent shifts — a predictable decline fixed by refreshing, consolidating or retiring the page.",
  }),
  t({
    slug: "programmatic-seo",
    term: "Programmatic SEO",
    abbr: "pSEO",
    aliases: ["programmatic pages", "template pages"],
    category: "content",
    definition:
      "Programmatic SEO is the practice of generating many landing pages from a template and a structured dataset — one page per city, integration or comparison — to target a large set of similar long-tail queries, and it works only when each page carries unique, useful data.",
  }),
  t({
    slug: "scaled-content-abuse",
    term: "Scaled content abuse",
    aliases: ["mass-produced content", "AI content spam"],
    category: "content",
    definition:
      "Scaled content abuse is Google's spam-policy term for producing many pages mainly to manipulate search rankings rather than to help people — whether by AI, templates or hand — and it targets the purpose and value of the content, not the use of AI itself.",
  }),
  t({
    slug: "meta-description",
    term: "Meta description",
    aliases: ["meta description tag", "search snippet"],
    category: "content",
    definition:
      "A meta description is an HTML meta tag that summarizes a page in a sentence or two for search results; it is not a ranking factor and Google often rewrites it, but a specific, accurate one can lift the share of searchers who click.",
  }),
  t({
    slug: "title-tag",
    term: "Title tag",
    aliases: ["SEO title", "page title", "title link"],
    category: "content",
    definition:
      "A title tag is the HTML title element that names a page for browsers, search results and AI retrieval, and it is the main source Google draws on for a result's title link — though Google may rewrite that link when the tag is missing, stuffed or mismatched to the page.",
  }),

  /* ---------- Authority & off-site ---------- */
  t({
    slug: "e-e-a-t",
    term: "E-E-A-T",
    aliases: ["EEAT", "E-A-T", "experience expertise authoritativeness trustworthiness"],
    category: "authority",
    definition:
      "E-E-A-T — experience, expertise, authoritativeness and trustworthiness — is the framework Google's search quality raters use to judge whether content is credible, with trust at its center; it is not a single ranking factor but a description of what Google's systems aim to reward.",
  }),
  t({
    slug: "topical-authority",
    term: "Topical authority",
    aliases: ["topic authority", "subject authority"],
    category: "authority",
    definition:
      "Topical authority is the degree to which search engines and AI systems treat a site as a reliable source on a whole subject, earned by covering that subject in depth and being referenced for it elsewhere, rather than by ranking for any one keyword.",
  }),
  t({
    slug: "entity-seo",
    term: "Entity SEO",
    aliases: ["entities", "entity optimization", "semantic SEO"],
    category: "authority",
    definition:
      "Entity SEO is the practice of making search engines and AI models recognize a brand, person or product as a distinct, well-described thing — an entity with consistent facts and relationships — rather than a string of keywords, so it can be tied to the topics it should be recommended for.",
  }),
  t({
    slug: "knowledge-graph",
    term: "Knowledge Graph",
    aliases: ["Google Knowledge Graph", "knowledge panel"],
    category: "authority",
    definition:
      "Google's Knowledge Graph is a database of hundreds of billions of facts about entities — people, places, organizations and products — and the relationships between them, which Google uses to understand queries, fill knowledge panels and help its AI features tell one brand from another.",
  }),
  t({
    slug: "backlinks",
    term: "Backlinks",
    aliases: ["backlink", "inbound links", "external links"],
    category: "authority",
    definition:
      "A backlink is a link from one website to another, which search engines treat as a vote of confidence that passes authority to the page it points to — and the relevance and quality of the linking site matter far more than the number of links.",
  }),
  t({
    slug: "domain-authority",
    term: "Domain authority",
    abbr: "DA",
    aliases: ["Domain Rating", "DR", "Authority Score"],
    category: "authority",
    definition:
      "Domain Authority is a third-party score from 1 to 100, created by Moz, that predicts how well a website is likely to rank based mainly on its backlinks; Google does not use it, and comparable metrics include Ahrefs' Domain Rating and Semrush's Authority Score.",
  }),
  t({
    slug: "anchor-text",
    term: "Anchor text",
    aliases: ["link text", "anchor"],
    category: "authority",
    definition:
      "Anchor text is the visible, clickable text of a link, which search engines read as a description of the page it points to — so natural, descriptive anchors help, while the same exact-match keyword repeated across many sites looks manipulative.",
  }),
  t({
    slug: "internal-linking",
    term: "Internal linking",
    aliases: ["internal links", "site architecture"],
    category: "authority",
    definition:
      "Internal linking is the practice of linking between pages on the same website, which helps crawlers find pages, moves authority from strong pages to weaker ones and shows search engines and AI systems how the topics on a site relate.",
  }),
  t({
    slug: "digital-pr",
    term: "Digital PR",
    aliases: ["link earning", "online PR"],
    category: "authority",
    definition:
      "Digital PR is the practice of earning coverage, links and mentions from news sites, publications and industry blogs by giving journalists something worth reporting — original data, expert comment, a story — which builds both backlinks and the brand mentions AI models learn from.",
  }),
  t({
    slug: "brand-mentions",
    term: "Brand mentions",
    aliases: ["unlinked mentions", "brand citations", "implied links"],
    category: "authority",
    definition:
      "A brand mention is any reference to a brand's name on another website, forum, review site or video, with or without a link, and in large studies mentions correlate more strongly with visibility in AI answers than backlinks do.",
  }),
  t({
    slug: "reddit-seo",
    term: "Reddit SEO",
    aliases: ["Reddit marketing", "Reddit for AI search"],
    category: "authority",
    definition:
      "Reddit SEO is the practice of earning a brand's place in Reddit threads that rank in Google and feed AI answers, by contributing genuinely useful replies in relevant communities rather than posting promotions, which Reddit's rules and moderators remove.",
  }),

  /* ---------- Measurement ---------- */
  t({
    slug: "ai-share-of-voice",
    term: "AI share of voice",
    aliases: ["share of voice", "SOV", "share of model", "AI share of answer"],
    category: "measurement",
    definition:
      "AI share of voice is the percentage of AI-generated answers, across a fixed set of relevant prompts, that mention or cite a brand compared with its competitors — the AI-search version of the classic measure of a brand's share of the market conversation.",
  }),
  t({
    slug: "prompt-tracking",
    term: "Prompt tracking",
    aliases: ["prompt monitoring", "AI rank tracking", "LLM tracking"],
    category: "measurement",
    definition:
      "Prompt tracking is the practice of running a fixed set of buyer questions through AI assistants such as ChatGPT, Perplexity and Gemini on a schedule and recording which brands and pages each answer mentions or cites — the AI-search equivalent of rank tracking.",
  }),
  t({
    slug: "ai-referral-traffic",
    term: "AI referral traffic",
    aliases: ["LLM traffic", "AI traffic", "ChatGPT traffic"],
    category: "measurement",
    definition:
      "AI referral traffic is the visits a website receives from links inside AI assistants and answer engines such as ChatGPT, Perplexity, Gemini, Claude and Copilot, identified in analytics by referrer domains like chatgpt.com and perplexity.ai.",
  }),
  t({
    slug: "click-through-rate",
    term: "Click-through rate",
    abbr: "CTR",
    aliases: ["organic CTR", "search CTR"],
    category: "measurement",
    definition:
      "Click-through rate (CTR) is the percentage of people who click a result after seeing it — clicks divided by impressions — and in search it is falling for many queries as AI Overviews and other answer features resolve the question on the results page.",
  }),
  t({
    slug: "google-search-console",
    term: "Google Search Console",
    abbr: "GSC",
    aliases: ["Search Console", "Webmaster Tools"],
    category: "measurement",
    definition:
      "Google Search Console is Google's free tool for site owners that reports how a site performs in Google Search — queries, impressions, clicks, position and indexing — and since 2026 it also reports impressions in Google's generative AI features and lets owners opt out of them.",
  }),
  t({
    slug: "keyword-difficulty",
    term: "Keyword difficulty",
    abbr: "KD",
    aliases: ["SEO difficulty", "ranking difficulty"],
    category: "measurement",
    definition:
      "Keyword difficulty is a third-party estimate, usually on a 0 to 100 scale, of how hard it would be to reach Google's first page for a query, calculated mostly from the backlink strength of the pages already ranking — useful for choosing winnable topics, but not a Google metric.",
  }),
  t({
    slug: "serp",
    term: "SERP",
    aliases: ["search engine results page", "search results page", "SERP features"],
    category: "measurement",
    definition:
      "A SERP (search engine results page) is the page a search engine returns for a query, which today mixes classic blue links with AI Overviews, ads, featured snippets, videos, forum threads and other features competing for the same attention.",
  }),
];

export const TERM_SLUGS = TERMS.map((term) => term.slug);

export function getTerm(slug: string): GlossaryTerm | undefined {
  return TERMS.find((term) => term.slug === slug);
}

export function getCategory(id: GlossaryCategoryId): GlossaryCategory {
  return CATEGORIES.find((c) => c.id === id)!;
}

/** A–Z by display name, ignoring case and leading punctuation. */
export function sortKey(term: GlossaryTerm): string {
  return term.term.replace(/^[^a-z0-9]+/i, "").toLowerCase();
}

export const TERMS_AZ = [...TERMS].sort((a, b) => sortKey(a).localeCompare(sortKey(b)));

/** The first letter a term files under on the A–Z index. */
export function letterOf(term: GlossaryTerm): string {
  const c = sortKey(term).charAt(0).toUpperCase();
  return /[A-Z]/.test(c) ? c : "#";
}

/** The latest update across the glossary — the hub's and sitemap's lastmod. */
export const GLOSSARY_UPDATED = TERMS.map((term) => term.updated)
  .sort()
  .at(-1)!;
