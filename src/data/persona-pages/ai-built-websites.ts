/**
 * /use-cases/ai-built-websites: the words and data for sites made with an AI
 * app builder (Lovable, Bolt, v0, Replit) or with Framer or Webflow.
 *
 * Facts checked 2026-11-10. Every outside claim on the page is listed in
 * `page.sources` with its date, and what the page says about rendering is the
 * builders' own documentation, not ours. Rankbox's side reads from pricing,
 * platforms, connectors and SHIPPED, so a price change, an add-on going live
 * or a new MCP connector updates this copy too.
 *
 * What the page must never say: that Rankbox audits, fixes or checks how a
 * site renders (it doesn't), that it tracks citations or rankings (it
 * doesn't, while SHIPPED.citationTracking is false), or that any platform
 * add-on is live before its addonLive flag says so.
 */
import { WandSparkles } from "lucide-react";
import type { Persona } from "@/data/personas";
import { PLAN, STUDIO, TRIAL_TERMS, formatUsd } from "@/data/pricing";
import { PUBLISH_PLATFORMS } from "@/data/platforms";
import { RANKBOX_PUBLISHING, SHIPPED } from "@/data/competitors/shared";
import { AI_TOOLS } from "@/data/ai-integrations";
import { MCP_URL } from "@/data/connectors";

const PRICE = formatUsd(PLAN.monthly);
const STUDIO_PRICE = formatUsd(STUDIO.monthlyPerSite);

/** How many AI tools can add the MCP server by URL (about 49 on 2026-11-10). */
const MCP_TOOL_COUNT = AI_TOOLS.length;

/* The shared publishing sentence, minus "one-click": the add-ons aren't live,
   and this page never describes publishing that way. */
const PUBLISHING_TODAY = RANKBOX_PUBLISHING.sentence.replace(/one-click /gi, "");

const addonLive = (id: string) => PUBLISH_PLATFORMS.find((p) => p.id === id)?.addonLive ?? false;
const FRAMER_LIVE = addonLive("framer");
const WEBFLOW_LIVE = addonLive("webflow");

const framerWebflowAnswer = (() => {
  const rendering =
    "Framer's help docs say every Framer page is pre-rendered to HTML on its servers, so crawlers that skip JavaScript still get the text. Check a Webflow page the same way with the free readiness check.";
  if (FRAMER_LIVE && WEBFLOW_LIVE)
    return `Yes. ${rendering} The Rankbox plugin for Framer and the app for Webflow put finished articles into your CMS collection.`;
  const waiting = [
    !FRAMER_LIVE && "the Framer plugin isn't live yet",
    !WEBFLOW_LIVE && "the Webflow app is built and waiting on Webflow's Marketplace approval",
  ]
    .filter(Boolean)
    .join(", and ");
  return `Yes. ${rendering} On the Rankbox side, ${waiting}, so for now articles come through the REST API, which a developer connects to your CMS.`;
})();

const trackingLine = SHIPPED.citationTracking
  ? "Rankbox can show where AI answers quote you, but nobody can promise that they will."
  : "Nobody can promise that, and Rankbox doesn't track citations or rankings, so it can't tell you whether you're quoted.";

export const persona: Persona = {
  slug: "ai-built-websites",
  name: "Sites built with AI",
  nameLower: "sites built with AI",
  shortName: "AI-built",
  role: "builder",
  group: "situation",
  icon: WandSparkles,
  tagline: "Long-form articles for the site your AI builder made, sent by API.",

  eyebrow: "SEO and AI search content for AI-built websites",
  headline: { lead: "The site's built,", accent: "the content isn't" },
  subhead:
    "Lovable, Bolt, v0, Replit, Framer or Webflow got the site live. Rankbox finds the questions your buyers ask AI engines, writes long, sourced articles in your brand voice, scores each one for search and AI answers, and hands them to your site through its API. Its research tools work inside your builder's chat, too.",
  metaTitle: "Rankbox for AI-Built Websites: Lovable, Bolt, v0 & Framer",
  metaDescription:
    "Built your site with Lovable, Bolt, v0 or Framer? Rankbox finds what buyers ask AI, writes sourced articles in your brand voice, and sends them to your site by API.",

  shortAnswer:
    "Rankbox is an AI search growth engine for websites made with an AI app builder such as Lovable, Bolt, v0 or Replit, or with Framer or Webflow. It finds the questions buyers ask ChatGPT, Perplexity, Gemini and Google AI Overviews about the site's topic, writes source-backed articles of about 2,000 to 3,500 words in the site's brand voice, scores each one for SEO and GEO, and delivers them through a REST API. Its research tools also run inside those builders over MCP. It does not audit or fix how a site renders, so a page that only builds in the browser can still look empty to crawlers.",

  specs: [
    { value: `${PLAN.articlesPerMonth}/mo`, label: "sourced, long-form articles per site" },
    { value: `${MCP_TOOL_COUNT} tools`, label: "AI tools that can call its research over MCP" },
    { value: "REST API", label: "HTML and Markdown, for any stack" },
    { value: "SEO + GEO", label: "scores on every article before it ships" },
  ],

  handoff: {
    runsTitle: "Rankbox runs this",
    runs: [
      {
        label: "The question list",
        detail: "What buyers ask AI engines about your topic, found from your URL.",
      },
      {
        label: "Long-form drafts",
        detail: "Sourced articles of about 2,000 to 3,500 words, in your brand voice.",
      },
      {
        label: "A score before it ships",
        detail: "An SEO score and a GEO score on every article, so you see what's weak.",
      },
      {
        label: "Delivery by API",
        detail: "Finished articles as HTML and Markdown, on the schedule you set.",
      },
    ],
    keepsTitle: "Your build keeps this",
    keeps: [
      {
        label: "How the page renders",
        detail:
          "Server-rendered or pre-rendered HTML is your stack's job. Rankbox doesn't check it.",
      },
      {
        label: "The blog route",
        detail: "The page and layout that show an article, built in your builder.",
      },
      {
        label: "The API key",
        detail: "Kept in server code or a build step, never in code the browser downloads.",
      },
      {
        label: "What's true about the product",
        detail: "Features, prices and promises. Read and edit every draft before it goes out.",
      },
    ],
  },

  painsTitle: "What the builder didn't build",
  painsIntro:
    "Lovable says 100,000 new projects start on it every day (its own figure, November 2025). A builder is quick at the app. It doesn't know what your buyers ask, and one prompt per blog post doesn't add up to a library.",
  pains: [
    {
      pain: "The site is a landing page, a pricing page and a sign-up form. Nothing on it answers a question a buyer would ask.",
      fix: "Rankbox reads your URL and lists the questions buyers ask AI engines about your topic, grouped by intent, for you to approve.",
    },
    {
      pain: "Asking the builder for a blog post gets a short, generic page with no sources behind it.",
      fix: "Each article is researched and source-backed, about 2,000 to 3,500 words, in the brand voice you set for the site.",
    },
    {
      pain: "There's no way to tell whether a page is any good for AI answers before it goes live.",
      fix: "Every article gets an SEO score and a GEO score before it ships, and the editor lets you fix what's weak.",
    },
    {
      pain: "You work in the builder's chat. Another dashboard is one more tab you won't open.",
      fix: "Add Rankbox's MCP server to Lovable, Bolt, v0, Replit or Cursor and ask for questions, briefs and meta descriptions from the chat.",
    },
  ],

  workflowTitle: "Two places, four steps",
  workflowIntro:
    "Rankbox does the research and the writing. Your builder builds the page that shows it.",
  steps: [
    {
      when: "In Rankbox",
      title: "Paste your URL",
      body: "Rankbox reads the site, you set its brand voice (tone, audience, product details), and it lists the questions your buyers ask AI. Approve the ones worth writing.",
    },
    {
      when: "In your builder",
      title: "Add the MCP server",
      body: `Paste ${MCP_URL} into your builder's MCP settings, then ask for questions, briefs or meta descriptions while you build pages.`,
    },
    {
      when: "In your builder",
      title: "Build the blog route",
      body: "Ask the builder for a blog that fetches from the Rankbox REST API in server code or at build time, so each article is in the HTML crawlers get.",
    },
    {
      when: "In Rankbox",
      title: "Articles go out",
      body: `Rankbox writes on the schedule you set, up to ${PLAN.articlesPerMonth} a month. Your site picks up each finished article on its next pull and can report the live URL back.`,
    },
  ],

  stackTitle: "What you'd otherwise wire up",
  stackIntro:
    "The usual ways a builder-made site gets content, each one another thing to connect and keep fed.",
  stack: [
    { label: "A prompt per blog post", detail: "Short pages, no research, no sources" },
    { label: "A headless CMS", detail: "Another account and schema, and still nobody writing" },
    { label: "A keyword tool", detail: "Search volumes, not the questions people put to AI" },
    { label: "A freelance writer", detail: "A brief for every post and an edit on every draft" },
    { label: "Writing it yourself", detail: "Between shipping features, so rarely" },
  ],
  stackNote: STUDIO.live
    ? `One plan is ${PRICE} a month per site, with ${PLAN.articlesPerMonth} articles, the REST API and the MCP server included. Built more than one app? ${STUDIO.name} adds each extra site for ${STUDIO_PRICE} a month on the same invoice.`
    : `One plan is ${PRICE} a month per site, with ${PLAN.articlesPerMonth} articles, the REST API and the MCP server included. Cancel anytime, and every article already on your site stays there.`,

  picksTitle: "The four parts that matter here",
  picksIntro: "The builder made the app. These are the parts of Rankbox that make the content.",
  picks: [
    {
      featureSlug: "answer-space-research",
      why: "Your builder knows your code, not your buyers. This is the list of questions they ask AI about your topic.",
    },
    {
      featureSlug: "citation-ready-writer",
      why: "Long, sourced articles with the claims cited, which a one-line prompt to a builder doesn't produce.",
    },
    {
      featureSlug: "brand-voice",
      why: "Tone, audience and product details, set once per site, so articles don't read like default AI copy.",
    },
    {
      featureSlug: "seo-geo-score",
      why: "One score for search and one for how ready a page is to be quoted in AI answers, before anything ships.",
    },
  ],

  proof: [],
  proofTitle: "Sites built with AI, running it",

  faqs: [
    {
      q: "My site was built with Lovable. Can crawlers read it?",
      a: "It depends on when and how it was built, and Rankbox can't tell you. Lovable's docs say apps created from May 13, 2026 (June 22 on Enterprise plans) render on the server, and older React and Vite apps are pre-rendered for verified crawlers. A single-page app that builds itself in the browser sends crawlers an almost empty HTML file, and a Vercel and MERJ study (December 2024) found that the major AI crawlers it measured, apart from Google's and Apple's, didn't run JavaScript. The free AI Search Readiness Check counts the words a page shows without JavaScript.",
    },
    {
      q: "Does Rankbox fix rendering or audit my site?",
      a: "No. Rankbox doesn't audit sites, change your code or fix how pages render, and it has no rank tracker or link index. It researches, writes and scores articles and delivers them through its API. Making sure each article is in the HTML your server sends is your build's job.",
    },
    {
      q: "How do articles get onto a site built with Lovable, Bolt, v0 or Replit?",
      a: `${PUBLISHING_TODAY}. On a builder-made app, ask the builder to add a blog that fetches from the REST API in server code or at build time. Keep the API key out of browser code: in a Vite app, any variable that starts with VITE_ is copied into the code visitors download.`,
    },
    {
      q: "What can my builder do with the MCP server?",
      a: `Three things: find the questions people ask AI engines about a topic, build a content brief for a keyword, and write meta descriptions for a page. Add ${MCP_URL} as a custom MCP server in Lovable, Bolt, v0, Replit, Cursor or any of the ${MCP_TOOL_COUNT} tools Rankbox lists. It works in the builder's chat, not inside your published app, and it doesn't publish anything.`,
    },
    {
      q: "I built on Framer or Webflow. Does this work?",
      a: framerWebflowAnswer,
    },
    {
      q: "Will this get my site quoted by ChatGPT or Google AI Overviews?",
      a: `${trackingLine} What Rankbox controls is the article: researched questions, sourced claims, and a GEO score for how ready the page is to be quoted. To see what happens after it's live, use Google Search Console and your analytics.`,
    },
    {
      q: "Do I need to be a developer?",
      a: "Not for the research and the writing: you paste a URL, approve topics and edit drafts in Rankbox. Putting articles on a custom-built app means wiring the REST API once, which you can ask your builder or coding agent to do, then checking the live page with the free readiness check.",
    },
    {
      q: "What does it cost?",
      a: `${PRICE} a month per site, with ${PLAN.articlesPerMonth} articles, the REST API and the MCP server included.${STUDIO.live ? ` Each extra site on ${STUDIO.name} is ${STUDIO_PRICE} a month on the same invoice.` : ""} ${TRIAL_TERMS}`,
    },
  ],
  ctaTitle: "Give the site something to say",
  ctaBody: "Paste your URL and see the questions your buyers already ask AI about what you built.",

  hideFromNav: true,
};

/* ------------------------------------------------------------------ */
/* The rest of the page's words: the hero's sample, the rendering      */
/* check, the builder and API section, the price block and sources.   */
/* ------------------------------------------------------------------ */

export interface RenderMode {
  id: "browser" | "server";
  /** The toggle's label. */
  label: string;
  /** The sample chat in the builder window, for this build. */
  ask: string;
  reply: string;
  /** What the crawler window reports. */
  verdict: string;
  /** Words of text in the first response, as the sample's counter shows them. */
  words: string;
}

const RENDER_MODES: RenderMode[] = [
  {
    id: "browser",
    label: "Renders in the browser",
    ask: "Add a blog that shows our Rankbox articles.",
    reply: "Added /blog. Articles load from the Rankbox API when the page opens.",
    verdict: "An empty shell until JavaScript runs",
    words: "0",
  },
  {
    id: "server",
    label: "Renders on the server",
    ask: "Render the blog on the server, and keep the API key out of the browser.",
    reply: "Done. /blog is rendered on the server, and the key stays in a server function.",
    verdict: "The whole article, in the first response",
    words: "2,460",
  },
];

export const page = {
  /** The hero's sample: one blog page on a fictional app, built two ways. */
  sample: {
    brand: "Tallyfold",
    domain: "tallyfold.example",
    tagline: "Invoicing for freelancers",
    nav: ["Product", "Pricing", "Blog"],
    signup: "Start free",
    path: "/blog/chase-a-late-invoice",
    article: {
      kicker: "Getting paid",
      title: "How do freelancers chase a late invoice?",
      lede: "Start before it's late. A friendly note a few days ahead of the due date gives the client time to raise a question instead of going quiet.",
      heading: "Send the first reminder before the due date",
      body: "Keep it short: the invoice number, the amount, the due date and a link to pay.",
      heading2: "What to say once it's overdue",
      sources: "Sources cited: 4",
    },
    modes: RENDER_MODES,
    caption:
      "Sample. The same page, twice: as people see it in the builder's preview, and as a crawler that doesn't run JavaScript receives it. Tallyfold is a sample app.",
  },

  /** The honest caveat, placed straight after the short answer. */
  rendering: {
    eyebrow: "Check this first",
    title: "Your article only counts",
    accent: "if it's in the HTML",
    intro:
      "Rankbox writes the article. Whether a crawler can read it depends on how your builder renders the page, and that differs by builder, by stack and by when the project was made.",
    modes: [
      {
        name: "Built in the browser",
        state: "Often empty",
        body: "The server sends an almost empty HTML file and JavaScript fills the page in. A crawler that doesn't run JavaScript gets the empty file.",
        source: "Andrea Saez, Feb 13, 2026 · Vercel and MERJ, Dec 17, 2024",
      },
      {
        name: "Pre-rendered for crawlers",
        state: "Usually readable",
        body: "A rendered copy of the page is served to bots when they ask for it. Lovable does this for its older React and Vite apps, for verified crawlers only.",
        source: "Lovable docs, checked Nov 10, 2026",
      },
      {
        name: "Rendered on the server",
        state: "Readable",
        body: "Every request returns the full HTML. Lovable apps created from May 13, 2026 work this way, and Framer pre-renders every page to HTML before serving it.",
        source: "Lovable docs · Framer Help, updated Sep 15, 2026",
      },
    ],
    limit:
      "Rankbox doesn't check or change any of this. The free AI Search Readiness Check fetches your page without JavaScript and counts the words a crawler can read.",
    tool: { label: "Run the free readiness check", slug: "ai-search-readiness-check" },
  },

  /** Where these readers already work: the builder's chat, and their own code. */
  builder: {
    eyebrow: "Inside your tools",
    title: "Research in the chat,",
    accent: "articles by API",
    intro:
      "You already build by asking. Rankbox's research answers in the same chat, and finished articles reach your site through an API your builder can wire up.",
    mcp: {
      title: "MCP server, in the builder",
      body: `Add ${MCP_URL} as a custom MCP server and your builder can call three Rankbox tools: questions people ask AI about a topic, a content brief for a keyword, and meta descriptions for a page.`,
      note: "Works in the builder's chat, not inside your published app. It researches; it doesn't publish.",
      prompts: [
        "Use Rankbox to find what people ask AI about invoicing for freelancers.",
        "Get a Rankbox brief for “late invoice reminder” and build the post from it.",
        "Write meta descriptions for every page with Rankbox.",
      ],
      all: `All ${MCP_TOOL_COUNT} tools`,
    },
    api: {
      title: "REST API, in your code",
      body: "Fetch finished articles as HTML and Markdown, with slugs, meta descriptions and tags, then report each live URL back.",
      note: "Keep the key on the server. In a Vite app, any variable that starts with VITE_ ships to the browser, where anyone can read it.",
      docs: "Read the API recipes",
      page: "REST API",
      /* Server code or a build step, as the docs' own recipe has it. */
      snippet: [
        "// Server code or a build step, never the browser",
        "const key = process.env.RANKBOX_API_KEY;",
        "const res = await fetch(",
        '  "https://rankbox.xyz/api/public/v1/articles?limit=100",',
        "  { headers: { Authorization: `Bearer ${key}` } },",
        ");",
        "const { articles } = await res.json();",
      ],
    },
  },

  handoffTitle: "Rankbox writes it.",
  handoffAccent: "Your build renders it.",

  /** The price, read from pricing.ts. */
  price: {
    title: "One site, one plan",
    per: "a month per site",
    includes: [
      `${PLAN.articlesPerMonth} sourced, long-form articles a month`,
      "SEO and GEO scores on every article",
      "The REST API and the MCP server",
      "Backlink-exchange and Reddit-draft allowances, rolling out",
    ],
    studio: STUDIO.live
      ? `More than one app? ${STUDIO.name} adds each extra site for ${STUDIO_PRICE} a month, with a full plan of its own.`
      : "",
    pricing: "See pricing",
  },

  faqTitle: "Questions builders ask",
  faqDocs: "Read the docs",

  sourcesTitle: "Where this page's facts come from",
  sourcesIntro: "Checked on November 10, 2026. Builders change fast, so check your own site too.",
  sources: [
    {
      publisher: "Lovable",
      title: "One year of Lovable",
      date: "Nov 18, 2025",
      fact: "100,000 new projects a day, in Lovable's own words.",
      href: "https://lovable.dev/blog/one-year-of-lovable",
    },
    {
      publisher: "Lovable docs",
      title: "SEO and AI search",
      date: "Checked Nov 10, 2026",
      fact: "Server rendering for apps created from May 13, 2026; pre-rendering for older ones.",
      href: "https://docs.lovable.dev/features/seo-aeo",
    },
    {
      publisher: "Vercel and MERJ",
      title: "The rise of the AI crawler",
      date: "Dec 17, 2024",
      fact: "The major AI crawlers measured, apart from Google's and Apple's, didn't run JavaScript.",
      href: "https://vercel.com/blog/the-rise-of-the-ai-crawler",
    },
    {
      publisher: "Andrea Saez",
      title: "The Lovable SEO problem",
      date: "Feb 13, 2026",
      fact: "A client-rendered Lovable site served crawlers an empty root element.",
      href: "https://dreasays.substack.com/p/the-lovable-seo-problem",
    },
    {
      publisher: "Framer Help",
      title: "Make your site readable by AI agents",
      date: "Updated Sep 15, 2026",
      fact: "Every Framer page is pre-rendered to HTML before it's served.",
      href: "https://www.framer.com/help/articles/make-site-readable-by-ai-agents/",
    },
  ],

  othersTitle: "Other situations",
};

/** The AI tools whose pages the builder section links, in this order. */
export const BUILDER_TOOL_IDS = ["lovable", "bolt", "v0", "replit", "cursor", "claude-code"];
