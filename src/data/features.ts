import type { ReactElement } from "react";
import {
  Search,
  PenLine,
  Send,
  Quote,
  Link2,
  MessageSquare,
  Mic,
  Gauge,
  type LucideIcon,
} from "lucide-react";
import { RedditMark } from "@/components/landing/ai-logos";

export interface FeatureBenefit {
  title: string;
  body: string;
}

export interface FeatureStep {
  title: string;
  body: string;
}

export interface FeatureFAQ {
  q: string;
  a: string;
}

/** A product fact shown in the band under the hero. Facts, not outcomes: every
 *  value here must be something the product does, never a result we promise. */
export interface FeatureSpec {
  value: string;
  label: string;
}

/** Column a feature sits under in the Features navigation menu. */
export type FeatureGroup = "Create" | "Grow";

/** Order the groups appear in the menu. */
export const FEATURE_GROUPS: FeatureGroup[] = ["Create", "Grow"];

export interface Feature {
  slug: string;
  group: FeatureGroup;
  name: string;
  tagline: string;
  icon: LucideIcon;
  /**
   * Optional brand logo for the H1 icon tile, where the feature is about a
   * named third-party surface. When set it replaces `icon` in the tile only;
   * `icon` still carries the feature everywhere else (nav, cards, chrome).
   */
  heroMark?: (props: { className?: string }) => ReactElement;
  /** Pill above the H1 — carries the page's primary keyword. */
  eyebrow: string;
  /**
   * The H1, in two parts. On desktop `lead` sits on the first line and `accent`
   * on the second, led by the feature's icon tile (the landing hero's lockup).
   * Keep each part under ~20 characters so the lockup holds at every breakpoint.
   */
  headline: { lead: string; accent: string };
  subhead: string;
  metaTitle: string;
  metaDescription: string;
  specs: FeatureSpec[];
  problem: { title: string; body: string; before: string[]; after: string[] };
  benefitsTitle: string;
  benefitsIntro: string;
  benefits: FeatureBenefit[];
  stepsTitle: string;
  steps: FeatureStep[];
  /** How this feature feeds, and is fed by, the rest of the engine. */
  connects: string;
  /** Names from the landing TESTIMONIALS, most relevant first. */
  proof: string[];
  faqs: FeatureFAQ[];
  ctaTitle: string;
  ctaBody: string;
}

export const FEATURES: Feature[] = [
  {
    slug: "answer-space-research",
    group: "Create",
    name: "Answer-Space Research",
    tagline: "Map the exact questions your buyers ask AI and search.",
    icon: Search,
    eyebrow: "AI keyword & question research",
    headline: { lead: "Find the questions", accent: "buyers ask AI" },
    subhead:
      "Rankbox maps the questions your buyers type into ChatGPT, Perplexity, and Google, scores each one for volume, difficulty, and intent, and turns the winnable ones into articles.",
    metaTitle: "AI Keyword Research: Find What Buyers Ask AI | Rankbox",
    metaDescription:
      "Find the high-intent questions buyers ask ChatGPT, Perplexity, and Google. Rankbox scores every topic by volume, difficulty, and intent, then writes for it.",
    specs: [
      { value: "Hundreds", label: "of buyer questions in the first pass" },
      { value: "3 scores", label: "volume, difficulty, and intent per topic" },
      { value: "Google + AI", label: "search and answer engines mapped" },
      { value: "0", label: "keyword tools to pay for" },
    ],
    problem: {
      title: "Stop writing for keywords nobody asks AI",
      body: "Classic keyword research was built for ten blue links. Buyers now ask full questions, and the answer engine picks one source to quote.",
      before: [
        "Exporting keyword lists from three different SEO tools",
        "Chasing high-volume terms you will never rank for",
        "Missing the conversational questions AI engines answer",
        "Writing briefs by hand before a word gets drafted",
      ],
      after: [
        "One answer-space map, built from your site in minutes",
        "Winnable topics ranked first by volume and difficulty",
        "Questions phrased the way ChatGPT and Perplexity parse them",
        "Approved topics flow straight to the writer, no briefs",
      ],
    },
    benefitsTitle: "Research that starts where your buyers do",
    benefitsIntro:
      "Every topic on your map is a real question, scored for how much demand it has and how winnable it is.",
    benefits: [
      {
        title: "Buyer-intent keywords",
        body: "Surface the prompts and queries real buyers use, not vanity keywords, so every article targets demand that converts.",
      },
      {
        title: "Volume + difficulty scoring",
        body: "Each topic comes scored for search volume and difficulty, so you target winnable terms first instead of guessing.",
      },
      {
        title: "Built for AI answers",
        body: "We map question-style queries the way AI engines parse them, so your content is structured to become the cited answer.",
      },
    ],
    stepsTitle: "From your URL to a topic map in minutes",
    steps: [
      {
        title: "Analyze your space",
        body: "Rankbox scans your category, competitors, and the live SERPs and AI answers around your product.",
      },
      {
        title: "Cluster the questions",
        body: "Hundreds of buyer questions are grouped into themes and ranked by opportunity.",
      },
      {
        title: "Hand off to the writer",
        body: "Approved topics flow straight into the citation-ready writer, with no manual briefs.",
      },
    ],
    connects:
      "Your answer-space map is where the engine starts. Every approved question becomes a brief for the Citation-Ready Writer, and Citation Tracking reports back on which answers you now own.",
    proof: ["Elise Tanaka", "Priya Raman", "Marco Silva"],
    faqs: [
      {
        q: "How is answer-space research different from keyword research?",
        a: "Keyword research lists short search terms. Answer-space research maps the full questions buyers ask, the way they type them into ChatGPT, Perplexity, and Google, and groups them by intent so each article answers one real question completely.",
      },
      {
        q: "How many topics does Rankbox find?",
        a: "Most accounts surface hundreds of buyer questions in the first pass, continuously refreshed as your space evolves.",
      },
      {
        q: "Do I need keyword tools?",
        a: "No. Answer-space research is built in, and volume, intent, and difficulty are scored automatically.",
      },
      {
        q: "Does it cover AI search, not just Google?",
        a: "Yes. We map question-style queries the way ChatGPT, Perplexity, and Google AI Overviews interpret them.",
      },
      {
        q: "Can I add my own topics?",
        a: "Yes. Add any target query or question and it is scored alongside the topics Rankbox found, then queued for the writer.",
      },
    ],
    ctaTitle: "See what your buyers are really asking",
    ctaBody: "Start mapping your answer space and turn buyer questions into traffic and citations.",
  },
  {
    slug: "citation-ready-writer",
    group: "Create",
    name: "Citation-Ready Writer",
    tagline: "Deeply researched, source-backed articles AI loves to quote.",
    icon: PenLine,
    eyebrow: "AI article writer",
    headline: { lead: "The AI article writer", accent: "built to get cited" },
    subhead:
      "Rankbox researches the live web, then writes 2,000–3,500-word articles in your brand voice, with the sources, definitions, and structure that Google ranks and AI answer engines quote.",
    metaTitle: "AI Article Writer That Gets Cited by ChatGPT | Rankbox",
    metaDescription:
      "Write deeply researched, source-backed long-form articles in your brand voice, structured to rank on Google and get quoted by ChatGPT, Perplexity, and Gemini.",
    specs: [
      { value: "2,000–3,500", label: "words of long-form content per article" },
      { value: "Live", label: "web research behind every draft" },
      { value: "100+", label: "languages, with native-sounding flow" },
      { value: "Original", label: "written from scratch, plagiarism-checked" },
    ],
    problem: {
      title: "Generic AI content doesn't get quoted",
      body: "AI engines cite sources that are specific, structured, and backed by evidence. Most AI writers deliver none of the three.",
      before: [
        "Thin drafts rewritten from the same top-ten results",
        "No sources, so there is nothing for AI engines to trust",
        "A wall of text with no clean answer to lift",
        "Hours of editing to make it sound like your brand",
      ],
      after: [
        "Fresh research from the live web on every article",
        "Claims backed by real sources, cited inline",
        "Definitions, lists, and FAQs structured to be quoted",
        "Written in your brand voice from the first draft",
      ],
    },
    benefitsTitle: "Every draft is built to be the answer",
    benefitsIntro:
      "Research, voice, and structure are handled in one pass, so drafts arrive ready to rank and ready to quote.",
    benefits: [
      {
        title: "Live web research",
        body: "Every article is written from fresh research and real sources. Never recycled, always citable.",
      },
      {
        title: "Your brand voice",
        body: "Set tone and style once and every piece sounds like you, not generic AI filler.",
      },
      {
        title: "Structured to be quoted",
        body: "Clear headings, definitions, and source-backed claims make your content easy for AI to lift as the answer.",
      },
    ],
    stepsTitle: "From topic to publish-ready draft",
    steps: [
      {
        title: "Pick a topic",
        body: "Choose from your answer-space map or add your own target query.",
      },
      {
        title: "Research + draft",
        body: "Rankbox searches the web, pulls sources, and writes a structured long-form draft.",
      },
      {
        title: "Review + publish",
        body: "Tweak in the editor if you like, then publish, or let auto-publish handle it.",
      },
    ],
    connects:
      "Topics arrive from Answer-Space Research, Brand Voice shapes every sentence, and the SEO/GEO Score checks each draft before Auto-Publishing puts it live.",
    proof: ["Aman Desai", "Marco Silva", "Sofia Marin"],
    faqs: [
      {
        q: "Is the content original?",
        a: "Always. Each article is written from scratch using live web research and passes plagiarism checks.",
      },
      {
        q: "Will AI-written articles hurt my Google rankings?",
        a: "Google rewards helpful, original content however it is produced. Rankbox writes from fresh research with real sources and clear structure, the signals both Google and AI engines look for.",
      },
      {
        q: "Can I edit before publishing?",
        a: "Yes. A full AI article editor lets you adjust anything, or you can publish straight away.",
      },
      {
        q: "How long are the articles?",
        a: "Typically 2,000–3,500 words of structured, source-backed long-form content.",
      },
      {
        q: "Does it add images and internal links?",
        a: "Yes. Articles ship with images, internal links, and a meta description, ready to publish.",
      },
      {
        q: "What languages can it write in?",
        a: "More than 100, with natural, native-sounding flow.",
      },
    ],
    ctaTitle: "Publish articles AI wants to quote",
    ctaBody: "Turn your topic map into citation-ready content in minutes, in your brand voice.",
  },
  {
    slug: "auto-publishing",
    group: "Grow",
    name: "Auto-Publishing",
    tagline: "Fresh articles go live daily on your site, hands-free.",
    icon: Send,
    eyebrow: "Automated blog publishing",
    headline: { lead: "Auto-publish a fresh", accent: "article every day" },
    subhead:
      "Connect your site once and Rankbox publishes a new, optimized article every day to WordPress, Webflow, Shopify, Wix, or Framer, or to any other stack through the Rankbox API.",
    metaTitle: "Automated Blog Publishing for WordPress & More | Rankbox",
    metaDescription:
      "Publish a fresh, SEO-optimized article to your blog every day on WordPress, Webflow, Shopify, Wix, Framer, or any site via API. Set it once and it runs.",
    specs: [
      { value: "30", label: "articles a month, one every day" },
      { value: "5 + API", label: "CMS integrations, plus a REST API" },
      { value: "0", label: "developers needed to connect" },
      { value: "Optional", label: "approval before anything goes live" },
    ],
    problem: {
      title: "Consistency is where content plans die",
      body: "Publishing every day compounds. Publishing whenever someone finds the time doesn't.",
      before: [
        "Drafts stuck in a doc waiting for someone to upload them",
        "Reformatting headings, images, and links by hand",
        "Weeks without a post whenever the team gets busy",
        "A content calendar nobody keeps up with",
      ],
      after: [
        "Articles go live on schedule as native posts",
        "Formatting, images, and meta tags handled for you",
        "A new article every day, even on your busiest weeks",
        "A calendar that fills and publishes itself",
      ],
    },
    benefitsTitle: "Set it once. Publish every day.",
    benefitsIntro:
      "Pick where articles go and when, and Rankbox handles the rest, from formatting to the moment a post goes live.",
    benefits: [
      {
        title: "One-click integrations",
        body: "Connect WordPress, Webflow, Shopify, Wix, and Framer in minutes, no developer needed.",
      },
      {
        title: "Set-and-forget schedule",
        body: "Choose a cadence and articles go live automatically, building momentum while you focus on the business.",
      },
      {
        title: "Publish anywhere",
        body: "On any other stack, pull finished articles from the Rankbox API, or copy formatted content straight from the editor.",
      },
    ],
    stepsTitle: "Connected and publishing in minutes",
    steps: [
      {
        title: "Connect your site",
        body: "Authorize your CMS or create an API key in a couple of minutes.",
      },
      { title: "Set your schedule", body: "Pick how often articles publish and at what time." },
      {
        title: "Watch it compound",
        body: "Fresh content goes live on autopilot and traffic builds day after day.",
      },
    ],
    connects:
      "Auto-Publishing is the last mile. Drafts from the Citation-Ready Writer that clear the SEO/GEO Score go live on schedule, and Citation Tracking picks them up from there.",
    proof: ["Hannah Whitfield", "Elise Tanaka", "Priya Raman"],
    faqs: [
      {
        q: "Which platforms are supported?",
        a: "WordPress, Webflow, Shopify, Wix, and Framer, plus a REST API for anything else.",
      },
      {
        q: "Can I review before it goes live?",
        a: "Yes. Turn on approval mode to review drafts, or enable full auto-publish.",
      },
      {
        q: "Will it match my site styling?",
        a: "Articles publish as native posts on your CMS, so they inherit your theme and styling.",
      },
      {
        q: "Can I choose when articles publish?",
        a: "Yes. You set the cadence and the time of day, and articles go live on that schedule.",
      },
      {
        q: "What if my platform isn't listed?",
        a: "Create an API key and pull finished articles into any stack from the Rankbox API, or copy formatted content straight from the editor.",
      },
    ],
    ctaTitle: "Put your content engine on autopilot",
    ctaBody: "Connect your site and start publishing fresh, optimized articles every day.",
  },
  {
    slug: "citation-tracking",
    group: "Grow",
    name: "Citation Tracking",
    tagline: "See where AI answers quote and recommend your brand.",
    icon: Quote,
    eyebrow: "AI citation tracking",
    headline: { lead: "See every time AI", accent: "cites your brand" },
    subhead:
      "Track where your brand shows up across ChatGPT, Perplexity, Claude, and Google AI Overviews, see which article earned each citation, and double down on what gets you quoted.",
    metaTitle: "AI Citation Tracking: See When ChatGPT Cites You | Rankbox",
    metaDescription:
      "Track where your brand is cited across ChatGPT, Perplexity, Claude, and Google AI Overviews, see which articles earned each citation, and grow what works.",
    specs: [
      { value: "4+", label: "AI answer engines monitored" },
      { value: "Per article", label: "every citation tied to its page" },
      { value: "Over time", label: "visibility trends you can report on" },
      { value: "Your prompts", label: "the buyer questions that matter" },
    ],
    problem: {
      title: "You can't grow what you can't see",
      body: "Buyers ask AI before they ever visit your site. Without tracking, you have no idea whether the answer names you or a competitor.",
      before: [
        "Typing prompts into ChatGPT by hand to check",
        "No idea which articles AI engines actually quote",
        "AI visibility missing from every growth report",
        "Competitors named on your best questions, unnoticed",
      ],
      after: [
        "Your buyer prompts monitored across the major engines",
        "Each citation tied back to the article that earned it",
        "A visibility trend you can put in front of the team",
        "Clear gaps where a new article can win the answer",
      ],
    },
    benefitsTitle: "Your AI visibility, measured",
    benefitsIntro:
      "One view of where AI engines recommend you, what earned it, and how it is trending.",
    benefits: [
      {
        title: "Multi-engine coverage",
        body: "Track mentions across the major AI answer engines and search, all in one view.",
      },
      {
        title: "Know what works",
        body: "See which articles earn citations so you can create more of what gets you quoted.",
      },
      {
        title: "Prove the impact",
        body: "Turn AI visibility into a metric you can report on and grow over time.",
      },
    ],
    stepsTitle: "From prompts to proof",
    steps: [
      {
        title: "Set your prompts",
        body: "Rankbox monitors the buyer questions that matter to your business.",
      },
      {
        title: "Track citations",
        body: "We check where your brand appears across AI answers and search results.",
      },
      { title: "Double down", body: "Lean into the topics and formats that win citations." },
    ],
    connects:
      "Citation Tracking closes the loop. It shows which questions from your Answer-Space Research you now own, so the Citation-Ready Writer knows what to double down on next.",
    proof: ["Owen Carter", "Priya Raman", "Lena Brandt"],
    faqs: [
      {
        q: "What is an AI citation?",
        a: "An AI citation is when an answer engine like ChatGPT or Perplexity names your brand or links your page as a source in its answer. It is the AI-search equivalent of ranking on page one.",
      },
      {
        q: "Which engines are tracked?",
        a: "ChatGPT, Perplexity, Claude, and Google AI Overviews, among others.",
      },
      {
        q: "How often is it updated?",
        a: "Citation checks run regularly so you can watch visibility trend over time.",
      },
      {
        q: "Can I see which article earned a citation?",
        a: "Yes. Citations are tied back to the content that triggered them.",
      },
      {
        q: "Why track AI citations and not just rankings?",
        a: "Buyers increasingly ask AI instead of scrolling results. An answer that recommends a competitor costs you the click entirely, and a rank tracker can't see it.",
      },
    ],
    ctaTitle: "Become the answer AI recommends",
    ctaBody: "Track your AI citations and grow the content that gets your brand quoted.",
  },
  {
    slug: "authority-backlinks",
    group: "Grow",
    name: "Authority Backlinks",
    tagline: "Earn high-quality backlinks that grow domain authority.",
    icon: Link2,
    eyebrow: "Backlink building",
    headline: { lead: "Authority backlinks", accent: "that lift rankings" },
    subhead:
      "Earn dofollow backlinks from verified member sites in your niche, so every article you publish ranks higher and AI engines treat your brand as a source worth citing.",
    metaTitle: "High-Authority Backlinks from Verified Sites | Rankbox",
    metaDescription:
      "Grow domain authority with dofollow backlinks from verified, relevant sites in your niche. White-hat, no link farms, so your content ranks and gets cited.",
    specs: [
      { value: "30", label: "backlink credits a month on the paid plan" },
      { value: "Verified", label: "real sites relevant to your niche" },
      { value: "Dofollow", label: "links that pass authority" },
      { value: "0", label: "link farms or private networks" },
    ],
    problem: {
      title: "Great content still needs authority",
      body: "Search engines and AI models both lean on links to decide who to trust. A site without them struggles to rank, however good the writing is.",
      before: [
        "Cold outreach emails that never get a reply",
        "Paying agencies for links from sites nobody visits",
        "Spammy link networks that risk a penalty",
        "No way to see whether authority is actually growing",
      ],
      after: [
        "Placements on verified sites in your niche",
        "Links that point at the pages you want to rank",
        "White-hat only, with no PBNs and no link farms",
        "Every placement verified live on a real page before it counts",
      ],
    },
    benefitsTitle: "Links that build trust, not risk",
    benefitsIntro:
      "Every placement is vetted for quality and relevance, and every one points authority where it helps most.",
    benefits: [
      {
        title: "Verified sources",
        body: "Links come from real, vetted sites in your niche, not spammy link farms.",
      },
      {
        title: "Authority that compounds",
        body: "Higher domain authority lifts every page you publish, now and in the future.",
      },
      {
        title: "Trust signals for AI",
        body: "Strong link profiles help AI engines treat your brand as a credible source to cite.",
      },
    ],
    stepsTitle: "From target list to live links",
    steps: [
      {
        title: "Pick your pages",
        body: "Choose the pages you want ranked and a few natural ways to link to them.",
      },
      {
        title: "Earn and spend credits",
        body: "Host one relevant link in an article you publish to earn a credit; spend credits on links from other members' articles.",
      },
      {
        title: "Verified live",
        body: "Every link is checked on the real page. Credits move only once it is live and dofollow.",
      },
    ],
    connects:
      "Backlinks amplify everything else. They point authority at the articles Auto-Publishing puts live, which helps them rank on Google and get picked up by the engines Citation Tracking watches.",
    proof: ["Daniel Okafor", "Marco Silva", "Aman Desai"],
    faqs: [
      {
        q: "Are these safe, white-hat links?",
        a: "Yes. Links come from verified, relevant sites, never spammy networks that risk penalties.",
      },
      {
        q: "How many backlinks do I get?",
        a: "The paid plan includes 30 backlink credits each month, and you earn more by hosting links. A credit is only spent when a link is verified live on a real page, never for one that doesn't publish.",
      },
      {
        q: "Is it part of the free trial?",
        a: "No. The backlink exchange opens with your first paid invoice. Keeping it out of the trial is what keeps throwaway accounts, and their links, out of the network.",
      },
      {
        q: "Isn't exchanging links risky?",
        a: "Direct swaps are, which is why Rankbox never makes one. If a site links to you, you are never asked to link back to it. Links travel one way through the network: one per article, only where the topic genuinely fits, with rotating anchor text and a cap on how fast any page gains links.",
      },
      {
        q: "How fast do links arrive?",
        a: "Links are placed as relevant articles come up across the network, so the pace depends on how many members publish in your niche. Your dashboard shows the live size of the network and where your pages are in the queue.",
      },
      {
        q: "Do backlinks help with AI search?",
        a: "Yes. A credible link profile signals trust, which helps AI engines cite your brand.",
      },
      {
        q: "What makes a site verified?",
        a: "Its owner has proven control of the domain and is a paying Rankbox member publishing real articles on it. Rankbox never uses link farms, private blog networks, or sites that exist only to sell links.",
      },
    ],
    ctaTitle: "Build authority that lifts every page",
    ctaBody: "Start earning high-quality backlinks from verified sites in your niche.",
  },
  {
    slug: "reddit-presence",
    group: "Grow",
    name: "Reddit Presence",
    tagline: "Show up helpfully in Reddit threads AI and Google read.",
    icon: MessageSquare,
    heroMark: RedditMark,
    eyebrow: "Reddit marketing for AI search",
    headline: { lead: "Get into the threads", accent: "AI actually reads" },
    subhead:
      "Rankbox finds the Reddit threads that rank on Google and feed AI answers, drafts a genuinely useful reply that says who you are, and hands it to you to post. You join the conversations buyers and models read — under your own name.",
    metaTitle: "Reddit Marketing for AI Search Visibility | Rankbox",
    metaDescription:
      "Find the Reddit threads that rank on Google and get quoted by ChatGPT and Perplexity, with a helpful, disclosed reply drafted for you to review and post yourself.",
    specs: [
      { value: "Measured", label: "Google position, checked and dated" },
      { value: "AI-checked", label: "your top keywords, asked of AI engines" },
      { value: "Disclosed", label: "every draft says who you work for" },
      { value: "You post", label: "from your own account, never ours" },
    ],
    problem: {
      title: "AI engines are reading Reddit. Are you in it?",
      body: "Reddit threads rank on page one and get quoted in AI answers for months. If your brand isn't in the conversation, a competitor's recommendation is.",
      before: [
        "Scrolling subreddits hoping to find a relevant thread",
        "Replies that read like ads and get removed",
        "Joining after the conversation has gone cold",
        "No idea which threads actually feed AI answers",
      ],
      after: [
        "High-visibility threads surfaced for you",
        "Helpful, on-brand reply drafts that add real value",
        "Threads prioritized by Google rank and AI citations",
        "Every thread you join, re-measured every week",
      ],
    },
    benefitsTitle: "Be the helpful answer in the thread",
    benefitsIntro:
      "Find the discussions that matter, contribute something useful, and let the thread keep working for you.",
    benefits: [
      {
        title: "High-visibility threads",
        body: "Focus on the threads that already rank in Google and get pulled into AI answers.",
      },
      {
        title: "Helpful, not spammy",
        body: "Every draft answers the question first, says who you work for, and is checked against the subreddit's rules where we can read them.",
      },
      {
        title: "A dated record",
        body: "Reddit threads have long shelf lives. Rankbox re-checks each one you join and keeps what it measured, with the date.",
      },
    ],
    stepsTitle: "From thread to reply",
    steps: [
      {
        title: "Find the threads",
        body: "Rankbox surfaces relevant, high-ranking discussions in your space.",
      },
      {
        title: "Review the draft",
        body: "One credit drafts a reply that answers first and discloses who you are. You edit it, and you post it.",
      },
      {
        title: "Track what happened",
        body: "We re-check the thread's Google position and whether AI engines cite it, and show you the dates.",
      },
    ],
    connects:
      "Reddit Presence adds third-party proof to your own content. Threads point buyers to the articles Auto-Publishing puts live, and Citation Tracking shows when AI engines pick those conversations up.",
    proof: ["Priya Raman", "Daniel Okafor", "Lena Brandt"],
    faqs: [
      {
        q: "Will this get flagged as spam?",
        a: "Not by design. Every draft discloses who you are, answers the question first, and is checked against the subreddit's rules where we can read them — and Rankbox won't draft at all for subreddits that ban self-promotion. But moderators decide, and no tool can promise otherwise. You read every reply before it goes anywhere.",
      },
      {
        q: "Why does Reddit matter for AI search?",
        a: "Reddit threads rank strongly in Google and are frequently quoted by AI answer engines.",
      },
      {
        q: "Do I have to manage it manually?",
        a: "You post every reply yourself, from your own account. Rankbox finds the thread, writes the draft and checks it. The posting and the judgement call are yours, and that's deliberate — Rankbox never holds your Reddit login.",
      },
      {
        q: "Should I say I work for the brand?",
        a: "Yes, and Rankbox insists on it: every draft includes your disclosure line, and it can't be switched off. Reddit communities expect it, and undisclosed promotion is what gets replies removed and accounts banned.",
      },
      {
        q: "Is it part of the free trial?",
        a: "No. Reddit presence opens with your first paid invoice and includes 30 reply drafts a month. Replies go out under your own name in threads that outlive a trial, so it isn't something we hand a throwaway account.",
      },
    ],
    ctaTitle: "Get into the conversations that matter",
    ctaBody: "Surface helpfully in the Reddit threads buyers and AI engines actually read.",
  },
  {
    slug: "brand-voice",
    group: "Create",
    name: "Brand Voice",
    tagline: "Every article sounds like you, not generic AI.",
    icon: Mic,
    eyebrow: "AI brand voice",
    headline: { lead: "AI content that", accent: "sounds like you" },
    subhead:
      "Teach Rankbox your tone, audience, and product once, and every article it writes reads like your team wrote it, whether you publish five a month or fifty.",
    metaTitle: "AI Writer That Matches Your Brand Voice | Rankbox",
    metaDescription:
      "Set your tone, audience, and product details once and every AI-written article reads like your team wrote it. Consistent brand voice at any scale.",
    specs: [
      { value: "Once", label: "set it up and every article follows" },
      { value: "Tone + rules", label: "audience, style, words to use and avoid" },
      { value: "Product-aware", label: "mentions your offer where it fits" },
      { value: "100+", label: "languages in the same voice" },
    ],
    problem: {
      title: "Readers can spot generic AI in a sentence",
      body: "Content that sounds like everyone else doesn't build trust, and it gives AI engines no reason to single out your brand.",
      before: [
        "Every article opens with the same bland AI intro",
        "Hours rewriting drafts so they sound like you",
        "Your product never comes up, or comes up awkwardly",
        "Voice drifts every time a new writer joins",
      ],
      after: [
        "Your tone and style applied to every draft",
        "Drafts that need a skim, not a rewrite",
        "Natural product mentions where they genuinely help",
        "One voice across hundreds of articles",
      ],
    },
    benefitsTitle: "Your voice, on every page",
    benefitsIntro:
      "Describe how you write once. Every article after that inherits it, including where and how your product comes up.",
    benefits: [
      {
        title: "Custom instructions",
        body: "Define tone, audience, and rules once and apply them to every article automatically.",
      },
      {
        title: "Product-aware writing",
        body: "Rankbox understands your product so it promotes it naturally inside the content.",
      },
      {
        title: "Consistent at scale",
        body: "Whether you publish 5 or 50 articles a month, the voice stays unmistakably yours.",
      },
    ],
    stepsTitle: "Set your voice in minutes",
    steps: [
      { title: "Describe your voice", body: "Add tone, style guidelines, and product details." },
      { title: "Generate on-brand", body: "Every article inherits your voice automatically." },
      { title: "Refine over time", body: "Tweak instructions and every new article follows." },
    ],
    connects:
      "Brand Voice lives inside the Citation-Ready Writer. Every topic from Answer-Space Research is drafted in your voice before the SEO/GEO Score checks it and Auto-Publishing puts it live.",
    proof: ["Sofia Marin", "Marco Silva", "Aman Desai"],
    faqs: [
      {
        q: "How do I set my brand voice?",
        a: "Add custom instructions describing tone, audience, and any rules, and Rankbox applies them to every article.",
      },
      {
        q: "Can it mention my product?",
        a: "Yes. Rankbox weaves natural product promotion into relevant content.",
      },
      {
        q: "Does voice stay consistent at scale?",
        a: "Yes. The same instructions apply to every article, no matter the volume.",
      },
      {
        q: "Can I change my voice later?",
        a: "Anytime. Update your instructions and every new article follows the change.",
      },
    ],
    ctaTitle: "Scale content that still sounds like you",
    ctaBody: "Set your brand voice once and publish on-brand articles at any volume.",
  },
  {
    slug: "seo-geo-score",
    group: "Create",
    name: "SEO / GEO Score",
    tagline: "Score every article for both search and AI citations.",
    icon: Gauge,
    eyebrow: "SEO & GEO content scoring",
    headline: { lead: "Score every article", accent: "for Google and AI" },
    subhead:
      "Every article gets two scores, one for ranking on Google and one for being cited by AI engines, plus clear fixes, so you only publish content built to win both.",
    metaTitle: "SEO & GEO Content Score for Every Article | Rankbox",
    metaDescription:
      "Score every article for SEO and generative engine optimization (GEO) before it goes live, with clear fixes for structure, keywords, links, and readability.",
    specs: [
      { value: "2 scores", label: "SEO for Google, GEO for AI answers" },
      { value: "6+ checks", label: "structure, keywords, links, readability" },
      { value: "Pre-publish", label: "every article scored before it ships" },
      { value: "Clear fixes", label: "not just a number" },
    ],
    problem: {
      title: "Most content is optimized for half the search box",
      body: "An article can rank on Google and never be quoted by AI, or the reverse. You need to see both before you hit publish.",
      before: [
        "Guessing whether a draft is ready to rank",
        "SEO plugins that ignore AI answer engines",
        "Scores with no clear idea what to fix",
        "Finding problems weeks after an article went live",
      ],
      after: [
        "One score for Google, one for AI citations",
        "Citation-readiness checks for structure and sources",
        "Every flag comes with a specific fix",
        "Issues caught before anything is published",
      ],
    },
    benefitsTitle: "Know it's ready before it's live",
    benefitsIntro:
      "Two scores, the checks behind them, and a clear bar every article has to clear before it publishes.",
    benefits: [
      {
        title: "Dual optimization",
        body: "One score for Google rankings, one for AI citations, optimized for how buyers actually search today.",
      },
      {
        title: "Actionable checks",
        body: "Word count, headings, links, readability, and keyword use are checked before you publish.",
      },
      {
        title: "Quality you can trust",
        body: "Ship only content that clears the bar for both search engines and AI answers.",
      },
    ],
    stepsTitle: "Write, score, publish",
    steps: [
      { title: "Write or generate", body: "Draft an article in Rankbox or import your own." },
      { title: "Get scored", body: "Rankbox grades it on SEO and GEO factors with clear fixes." },
      {
        title: "Publish with confidence",
        body: "Hit your target score and publish content built to win.",
      },
    ],
    connects:
      "The SEO/GEO Score is the quality gate between the Citation-Ready Writer and Auto-Publishing. Every draft is checked for both Google and AI before it goes live.",
    proof: ["Aman Desai", "Marco Silva", "Owen Carter"],
    faqs: [
      {
        q: "What's the difference between SEO and GEO?",
        a: "SEO optimizes for Google rankings. GEO (generative engine optimization) optimizes for being cited inside AI answers.",
      },
      {
        q: "What is generative engine optimization?",
        a: "GEO is the practice of making content easy for AI engines like ChatGPT, Perplexity, and Google AI Overviews to find, trust, and quote. It favors clear definitions, structured sections, and source-backed claims.",
      },
      {
        q: "What does the score check?",
        a: "Structure, headings, internal links, keyword use, readability, and citation-readiness.",
      },
      {
        q: "Can I score articles I wrote myself?",
        a: "Yes. Import your own article and it is scored on the same SEO and GEO checks.",
      },
      {
        q: "Is a perfect score required?",
        a: "No, but higher scores correlate with better rankings and more AI citations.",
      },
    ],
    ctaTitle: "Publish content built to win both",
    ctaBody: "Score every article for search and AI before it goes live.",
  },
];

/**
 * The order the features run in when Rankbox works end to end: research the
 * questions, write in your voice, score, publish, then build authority and
 * measure. Drives the "one engine" section on each feature page.
 */
export const ENGINE_ORDER = [
  "answer-space-research",
  "brand-voice",
  "citation-ready-writer",
  "seo-geo-score",
  "auto-publishing",
  "authority-backlinks",
  "reddit-presence",
  "citation-tracking",
] as const;

export function getFeature(slug: string): Feature | undefined {
  return FEATURES.find((f) => f.slug === slug);
}

/** The H1 as one plain string, for anywhere the two-part lockup can't be used. */
export function featureH1(feature: Feature): string {
  return `${feature.headline.lead} ${feature.headline.accent}`;
}

export const FEATURE_SLUGS = FEATURES.map((f) => f.slug);
