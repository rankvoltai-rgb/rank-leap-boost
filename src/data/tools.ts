export type ToolGroup = "instant" | "ai";

export interface ToolFAQ {
  q: string;
  a: string;
}

export interface Tool {
  slug: string;
  name: string;
  group: ToolGroup;
  tagline: string;
  eyebrow: string;
  h1: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  howto: string[];
  faqs: ToolFAQ[];
}

export const TOOLS: Tool[] = [
  {
    slug: "llms-txt-generator",
    name: "llms.txt Generator",
    group: "instant",
    tagline: "Create the llms.txt file AI crawlers now look for.",
    eyebrow: "Free tool",
    h1: "llms.txt Generator",
    intro:
      "Build a clean, valid llms.txt file so ChatGPT, Perplexity, and other AI engines understand your site and surface the right pages. Fill in the fields, copy the file, and drop it at the root of your domain.",
    metaTitle: "Free llms.txt Generator for AI Search | Rankvolt",
    metaDescription:
      "Generate a valid llms.txt file in seconds so AI engines like ChatGPT and Perplexity understand and cite your site. Free, no signup.",
    howto: [
      "Enter your site name and a one-line description of what you do.",
      "Add the key pages and docs you want AI engines to read.",
      "Copy or download the generated llms.txt.",
      "Upload it to the root of your domain (yoursite.com/llms.txt).",
    ],
    faqs: [
      {
        q: "What is llms.txt?",
        a: "llms.txt is a plain-text file placed at the root of your domain that gives AI assistants a curated map of your most important content, so they can read and cite it accurately.",
      },
      {
        q: "Where do I put the llms.txt file?",
        a: "Upload it to the root of your site so it's reachable at yoursite.com/llms.txt, the same way robots.txt works.",
      },
      {
        q: "Does llms.txt guarantee AI engines cite me?",
        a: "No file guarantees citations, but a clear llms.txt makes it far easier for AI engines to find and quote the right pages. Pair it with citation-ready content to win answers.",
      },
    ],
  },
  {
    slug: "ai-robots-txt-generator",
    name: "AI Crawler robots.txt Generator",
    group: "instant",
    tagline: "Allow or block GPTBot, ClaudeBot, PerplexityBot and more.",
    eyebrow: "Free tool",
    h1: "AI Crawler robots.txt Generator",
    intro:
      "Control exactly which AI crawlers can read your site. Toggle each bot on or off and generate a clean robots.txt you can paste straight onto your domain.",
    metaTitle: "Free AI Crawler robots.txt Generator | Rankvolt",
    metaDescription:
      "Generate a robots.txt that allows or blocks GPTBot, ClaudeBot, PerplexityBot, Google-Extended, and more. Free AI crawler control tool.",
    howto: [
      "Toggle each AI crawler to allow or block it.",
      "Optionally add your sitemap URL.",
      "Copy or download the generated robots.txt.",
      "Upload it to the root of your domain (yoursite.com/robots.txt).",
    ],
    faqs: [
      {
        q: "Should I block AI crawlers?",
        a: "If you want to appear in AI answers, allow them. Blocking AI crawlers like GPTBot or PerplexityBot means your content can't be read or cited by those engines.",
      },
      {
        q: "What is Google-Extended?",
        a: "Google-Extended controls whether your content is used to train and ground Google's AI products. Allowing it keeps you eligible for Google's AI features.",
      },
      {
        q: "Will robots.txt remove me from AI answers instantly?",
        a: "Crawlers re-read robots.txt on their own schedule, so changes take effect the next time each bot visits, not immediately.",
      },
    ],
  },
  {
    slug: "schema-generator",
    name: "Schema / JSON-LD Generator",
    group: "instant",
    tagline: "Build FAQ, Article, Organization & Product structured data.",
    eyebrow: "Free tool",
    h1: "Schema Markup (JSON-LD) Generator",
    intro:
      "Structured data helps Google and AI engines understand your page. Pick a type, fill in the fields, and copy a ready-to-paste JSON-LD script tag.",
    metaTitle: "Free Schema Markup (JSON-LD) Generator | Rankvolt",
    metaDescription:
      "Generate valid JSON-LD structured data for FAQ, Article, Organization, and Product schemas. Copy and paste ready for Google rich results.",
    howto: [
      "Choose the schema type that matches your page.",
      "Fill in the fields shown for that type.",
      "Copy the generated JSON-LD script tag.",
      "Paste it into the <head> of your page.",
    ],
    faqs: [
      {
        q: "What is JSON-LD?",
        a: "JSON-LD is the structured-data format Google recommends. It describes your page's content to search engines and AI so they can show rich results and cite you accurately.",
      },
      {
        q: "Where do I paste the schema?",
        a: "Place the generated <script type=\"application/ld+json\"> block inside the <head> of the relevant page.",
      },
      {
        q: "Does schema help with AI search?",
        a: "Yes. Clear structured data makes it easier for AI engines to extract facts, FAQs, and entities from your page, improving your odds of being cited.",
      },
    ],
  },
  {
    slug: "serp-snippet-preview",
    name: "SERP & AI Snippet Preview",
    group: "instant",
    tagline: "Preview your title & meta with live length checks.",
    eyebrow: "Free tool",
    h1: "SERP & AI Snippet Preview",
    intro:
      "See how your page looks in Google results before you publish. Type your title, description, and URL to get a live preview with length warnings that keep you from getting truncated.",
    metaTitle: "Free SERP Snippet Preview & Meta Length Checker | Rankvolt",
    metaDescription:
      "Preview your Google search snippet live and check title and meta description lengths so they never get cut off. Free SEO snippet tool.",
    howto: [
      "Enter your page title, meta description, and URL.",
      "Watch the live preview and the length indicators.",
      "Keep titles around 50–60 characters and descriptions 120–160.",
      "Adjust until both stay in the green.",
    ],
    faqs: [
      {
        q: "What's the ideal title length?",
        a: "Aim for roughly 50–60 characters. Longer titles get truncated with an ellipsis in Google results.",
      },
      {
        q: "How long should a meta description be?",
        a: "Around 120–160 characters. Too short wastes space; too long gets cut off.",
      },
      {
        q: "Does Google always use my meta description?",
        a: "Not always — Google sometimes rewrites snippets based on the query. A strong, relevant description still improves your odds of it being used.",
      },
    ],
  },
  {
    slug: "ai-question-generator",
    name: "AI Question Generator",
    group: "ai",
    tagline: "Find the real questions people ask AI about your topic.",
    eyebrow: "AI-powered",
    h1: "AI Question Generator",
    intro:
      "Enter a topic and get the real questions buyers ask AI engines, grouped by intent. Use them to plan content that becomes the answer ChatGPT and Perplexity cite.",
    metaTitle: "Free AI Question Generator for Content & GEO | Rankvolt",
    metaDescription:
      "Generate the real questions people ask AI engines about any topic, grouped by intent. Plan content that earns AI citations. Free AI tool.",
    howto: [
      "Enter a topic, product, or keyword.",
      "Generate a grouped list of questions people ask AI.",
      "Copy the questions you want to target.",
      "Answer them directly in your content to win citations.",
    ],
    faqs: [
      {
        q: "Why target questions instead of keywords?",
        a: "AI engines answer questions. Structuring content around the exact questions people ask makes your page the easiest source to quote.",
      },
      {
        q: "Is this tool free?",
        a: "Yes, it's free to use. It runs on AI, so results are generated fresh each time.",
      },
    ],
  },
  {
    slug: "content-brief-generator",
    name: "Content Brief Generator",
    group: "ai",
    tagline: "Turn a keyword into a complete content outline.",
    eyebrow: "AI-powered",
    h1: "AI Content Brief Generator",
    intro:
      "Enter a target keyword and get a ready-to-write brief: a working title, a full outline, the questions to answer, and the entities and terms to cover for both Google and AI search.",
    metaTitle: "Free AI Content Brief Generator | Rankvolt",
    metaDescription:
      "Turn any keyword into a complete content brief — title, outline, questions, and entities to cover for SEO and AI search. Free AI tool.",
    howto: [
      "Enter your target keyword or topic.",
      "Generate a full brief with outline, questions, and entities.",
      "Hand it to your writer or start drafting.",
      "Cover every section to outrank and out-cite competitors.",
    ],
    faqs: [
      {
        q: "What's in a content brief?",
        a: "A working title, a heading-by-heading outline, the key questions to answer, and the entities and terms to mention so the page reads as authoritative to search and AI.",
      },
      {
        q: "Can I edit the brief?",
        a: "Absolutely — treat it as a strong starting point and adapt the outline to your angle and audience.",
      },
    ],
  },
  {
    slug: "meta-description-writer",
    name: "Meta Description Writer",
    group: "ai",
    tagline: "Generate length-optimized meta descriptions instantly.",
    eyebrow: "AI-powered",
    h1: "AI Meta Description Writer",
    intro:
      "Describe your page and get three compelling, length-optimized meta descriptions written to earn clicks from Google — each one ready to paste.",
    metaTitle: "Free AI Meta Description Writer | Rankvolt",
    metaDescription:
      "Generate three click-worthy, length-optimized meta descriptions for any page in seconds. Free AI meta description generator.",
    howto: [
      "Describe your page topic or paste its main content.",
      "Generate three meta description options.",
      "Pick the one that fits and copy it.",
      "Paste it into your page's meta description tag.",
    ],
    faqs: [
      {
        q: "How long should a meta description be?",
        a: "Around 120–160 characters so it doesn't get truncated in search results. Each generated option is written to fit.",
      },
      {
        q: "Will these help my rankings?",
        a: "Meta descriptions don't directly rank you, but a compelling one increases click-through rate, which supports overall performance.",
      },
    ],
  },
];

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export const TOOL_SLUGS = TOOLS.map((t) => t.slug);

export const INSTANT_TOOLS = TOOLS.filter((t) => t.group === "instant");
export const AI_TOOLS = TOOLS.filter((t) => t.group === "ai");