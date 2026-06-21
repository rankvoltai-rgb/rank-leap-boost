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

export interface Feature {
  slug: string;
  name: string;
  tagline: string;
  icon: LucideIcon;
  eyebrow: string;
  h1: string;
  subhead: string;
  metaTitle: string;
  metaDescription: string;
  benefits: FeatureBenefit[];
  steps: FeatureStep[];
  faqs: FeatureFAQ[];
  ctaTitle: string;
  ctaBody: string;
}

export const FEATURES: Feature[] = [
  {
    slug: "answer-space-research",
    name: "Answer-Space Research",
    tagline: "Map the exact questions your buyers ask AI and search.",
    icon: Search,
    eyebrow: "Answer-space research",
    h1: "Map what your buyers ask AI",
    subhead:
      "Rankvolt studies the questions your buyers type into ChatGPT, Perplexity, and Google — then builds a topic map you can actually win, sorted by volume and intent.",
    metaTitle: "Answer-Space Research for AI Search | Rankvolt",
    metaDescription:
      "Discover the high-intent questions your buyers ask AI assistants and search engines, ranked by volume and intent. Build a topic map you can win with Rankvolt.",
    benefits: [
      {
        title: "Buyer-intent keywords",
        body: "Surface the prompts and queries real buyers use, not vanity keywords — so every article targets demand that converts.",
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
    steps: [
      { title: "Analyze your space", body: "Rankvolt scans your category, competitors, and the live SERPs and AI answers around your product." },
      { title: "Cluster the questions", body: "Hundreds of buyer questions are grouped into themes and ranked by opportunity." },
      { title: "Hand off to the writer", body: "Approved topics flow straight into the citation-ready writer — no manual briefs." },
    ],
    faqs: [
      { q: "How many topics does Rankvolt find?", a: "Most accounts surface hundreds of buyer questions in the first pass, continuously refreshed as your space evolves." },
      { q: "Do I need keyword tools?", a: "No. Answer-space research is built in — volume, intent, and difficulty are scored automatically." },
      { q: "Does it cover AI search, not just Google?", a: "Yes. We map question-style queries the way ChatGPT, Perplexity, and Google AI Overviews interpret them." },
    ],
    ctaTitle: "See what your buyers are really asking",
    ctaBody: "Start mapping your answer space and turn buyer questions into traffic and citations.",
  },
  {
    slug: "citation-ready-writer",
    name: "Citation-Ready Writer",
    tagline: "Deeply researched, source-backed articles AI loves to quote.",
    icon: PenLine,
    eyebrow: "Citation-ready writer",
    h1: "AI articles engineered to get cited",
    subhead:
      "Rankvolt drafts deeply researched, source-backed long-form articles in your brand voice — structured the way Google ranks and AI answer engines quote.",
    metaTitle: "Citation-Ready AI Article Writer | Rankvolt",
    metaDescription:
      "Generate deeply researched, source-backed long-form articles in your brand voice, structured to rank on Google and get cited by ChatGPT and Perplexity.",
    benefits: [
      { title: "Live web research", body: "Every article is written from fresh research and real sources — never recycled, always citable." },
      { title: "Your brand voice", body: "Set tone and style once and every piece sounds like you, not generic AI filler." },
      { title: "Structured to be quoted", body: "Clear headings, definitions, and source-backed claims make your content easy for AI to lift as the answer." },
    ],
    steps: [
      { title: "Pick a topic", body: "Choose from your answer-space map or add your own target query." },
      { title: "Research + draft", body: "Rankvolt searches the web, pulls sources, and writes a structured long-form draft." },
      { title: "Review + publish", body: "Tweak in the editor if you like, then publish — or let auto-publish handle it." },
    ],
    faqs: [
      { q: "Is the content original?", a: "Always. Each article is written from scratch using live web research and passes plagiarism checks." },
      { q: "Can I edit before publishing?", a: "Yes. A full AI article editor lets you adjust anything, or you can publish straight away." },
      { q: "How long are the articles?", a: "Typically 2,000–3,500 words of structured, source-backed long-form content." },
    ],
    ctaTitle: "Publish articles AI wants to quote",
    ctaBody: "Turn your topic map into citation-ready content in minutes, in your brand voice.",
  },
  {
    slug: "auto-publishing",
    name: "Auto-Publishing",
    tagline: "Fresh articles go live daily on your site, hands-free.",
    icon: Send,
    eyebrow: "Auto-publishing",
    h1: "Publish daily on autopilot",
    subhead:
      "Connect your site once and Rankvolt publishes a fresh, optimized article every day — on WordPress, Webflow, Shopify, Wix, Framer, or anywhere via webhooks.",
    metaTitle: "Automated Daily Content Publishing | Rankvolt",
    metaDescription:
      "Publish a fresh, SEO-optimized article every day on WordPress, Webflow, Shopify, Wix, Framer, or via webhooks — fully automated with Rankvolt.",
    benefits: [
      { title: "One-click integrations", body: "Connect WordPress, Webflow, Shopify, Wix, and Framer in minutes — no developer needed." },
      { title: "Set-and-forget schedule", body: "Choose a cadence and articles go live automatically, building momentum while you focus on the business." },
      { title: "Publish anywhere", body: "On any other stack, use webhooks or copy formatted content straight from the editor." },
    ],
    steps: [
      { title: "Connect your site", body: "Authorize your CMS or set up a webhook in a couple of minutes." },
      { title: "Set your schedule", body: "Pick how often articles publish and at what time." },
      { title: "Watch it compound", body: "Fresh content goes live on autopilot and traffic builds day after day." },
    ],
    faqs: [
      { q: "Which platforms are supported?", a: "WordPress, Webflow, Shopify, Wix, and Framer natively, plus webhooks for anything else." },
      { q: "Can I review before it goes live?", a: "Yes. Turn on approval mode to review drafts, or enable full auto-publish." },
      { q: "Will it match my site styling?", a: "Articles publish as native posts on your CMS, so they inherit your theme and styling." },
    ],
    ctaTitle: "Put your content engine on autopilot",
    ctaBody: "Connect your site and start publishing fresh, optimized articles every day.",
  },
  {
    slug: "citation-tracking",
    name: "Citation Tracking",
    tagline: "See where AI answers quote and recommend your brand.",
    icon: Quote,
    eyebrow: "Citation tracking",
    h1: "See where AI quotes your brand",
    subhead:
      "Track where your brand surfaces across ChatGPT, Perplexity, Claude, and Google AI Overviews — then double down on the content that gets you quoted.",
    metaTitle: "AI Citation Tracking for Your Brand | Rankvolt",
    metaDescription:
      "Monitor where your brand is cited across ChatGPT, Perplexity, Claude, and Google AI Overviews, and double down on the content that earns mentions.",
    benefits: [
      { title: "Multi-engine coverage", body: "Track mentions across the major AI answer engines and search, all in one view." },
      { title: "Know what works", body: "See which articles earn citations so you can create more of what gets you quoted." },
      { title: "Prove the impact", body: "Turn AI visibility into a metric you can report on and grow over time." },
    ],
    steps: [
      { title: "Set your prompts", body: "Rankvolt monitors the buyer questions that matter to your business." },
      { title: "Track citations", body: "We check where your brand appears across AI answers and search results." },
      { title: "Double down", body: "Lean into the topics and formats that win citations." },
    ],
    faqs: [
      { q: "Which engines are tracked?", a: "ChatGPT, Perplexity, Claude, and Google AI Overviews, among others." },
      { q: "How often is it updated?", a: "Citation checks run regularly so you can watch visibility trend over time." },
      { q: "Can I see which article earned a citation?", a: "Yes. Citations are tied back to the content that triggered them." },
    ],
    ctaTitle: "Become the answer AI recommends",
    ctaBody: "Track your AI citations and grow the content that gets your brand quoted.",
  },
  {
    slug: "authority-backlinks",
    name: "Authority Backlinks",
    tagline: "Earn high-quality backlinks that grow domain authority.",
    icon: Link2,
    eyebrow: "Authority backlinks",
    h1: "Earn high-authority backlinks",
    subhead:
      "Build domain authority with high-quality backlinks from verified sites in your niche — so your content ranks higher and gets trusted by AI engines.",
    metaTitle: "Authority Backlink Building | Rankvolt",
    metaDescription:
      "Grow domain authority with high-quality backlinks from verified sites in your niche, so your content ranks higher and earns AI trust with Rankvolt.",
    benefits: [
      { title: "Verified sources", body: "Links come from real, vetted sites in your niche — not spammy link farms." },
      { title: "Authority that compounds", body: "Higher domain authority lifts every page you publish, now and in the future." },
      { title: "Trust signals for AI", body: "Strong link profiles help AI engines treat your brand as a credible source to cite." },
    ],
    steps: [
      { title: "Identify targets", body: "Rankvolt finds relevant, high-authority sites in your space." },
      { title: "Earn placements", body: "Quality content earns links from verified domains." },
      { title: "Track authority", body: "Watch your domain rating climb as placements land." },
    ],
    faqs: [
      { q: "Are these safe, white-hat links?", a: "Yes. Links come from verified, relevant sites — never spammy networks that risk penalties." },
      { q: "How fast does authority grow?", a: "Authority builds steadily as placements land; consistency compounds over months." },
      { q: "Do backlinks help with AI search?", a: "Yes. A credible link profile signals trust, which helps AI engines cite your brand." },
    ],
    ctaTitle: "Build authority that lifts every page",
    ctaBody: "Start earning high-quality backlinks from verified sites in your niche.",
  },
  {
    slug: "reddit-presence",
    name: "Reddit Presence",
    tagline: "Show up helpfully in Reddit threads AI and Google read.",
    icon: MessageSquare,
    eyebrow: "Reddit presence",
    h1: "Show up in Reddit threads AI reads",
    subhead:
      "Surface helpfully in the Reddit threads that rank in Google and feed AI answers — so your brand is part of the conversation buyers and models trust.",
    metaTitle: "Reddit Presence for AI Search | Rankvolt",
    metaDescription:
      "Surface helpfully in Reddit threads that rank in Google and feed AI answers, putting your brand in the conversations buyers and models trust.",
    benefits: [
      { title: "High-visibility threads", body: "Focus on the threads that already rank in Google and get pulled into AI answers." },
      { title: "Helpful, not spammy", body: "Contributions add genuine value, building trust instead of triggering removals." },
      { title: "Compounding mentions", body: "Reddit threads have long shelf lives and keep feeding AI answers over time." },
    ],
    steps: [
      { title: "Find the threads", body: "Rankvolt surfaces relevant, high-ranking discussions in your space." },
      { title: "Contribute value", body: "Helpful, on-brand replies put your product in the conversation." },
      { title: "Earn the mention", body: "Useful contributions get upvoted and cited across search and AI." },
    ],
    faqs: [
      { q: "Will this get flagged as spam?", a: "No. The focus is genuinely helpful contributions, which is what Reddit and AI engines reward." },
      { q: "Why does Reddit matter for AI search?", a: "Reddit threads rank strongly in Google and are frequently quoted by AI answer engines." },
      { q: "Do I have to manage it manually?", a: "Rankvolt surfaces the opportunities so contributing is fast and on-brand." },
    ],
    ctaTitle: "Get into the conversations that matter",
    ctaBody: "Surface helpfully in the Reddit threads buyers and AI engines actually read.",
  },
  {
    slug: "brand-voice",
    name: "Brand Voice",
    tagline: "Every article sounds like you, not generic AI.",
    icon: Mic,
    eyebrow: "Brand voice",
    h1: "Content that sounds like you",
    subhead:
      "Teach Rankvolt your tone, style, and product once — and every article it writes reads like your team wrote it, at any scale.",
    metaTitle: "On-Brand AI Content & Brand Voice | Rankvolt",
    metaDescription:
      "Teach Rankvolt your tone and style once and every AI-written article reads like your team wrote it — consistent brand voice at any scale.",
    benefits: [
      { title: "Custom instructions", body: "Define tone, audience, and rules once and apply them to every article automatically." },
      { title: "Product-aware writing", body: "Rankvolt understands your product so it promotes it naturally inside the content." },
      { title: "Consistent at scale", body: "Whether you publish 5 or 50 articles a month, the voice stays unmistakably yours." },
    ],
    steps: [
      { title: "Describe your voice", body: "Add tone, style guidelines, and product details." },
      { title: "Generate on-brand", body: "Every article inherits your voice automatically." },
      { title: "Refine over time", body: "Tweak instructions and the whole library follows." },
    ],
    faqs: [
      { q: "How do I set my brand voice?", a: "Add custom instructions describing tone, audience, and any rules — Rankvolt applies them to every article." },
      { q: "Can it mention my product?", a: "Yes. Rankvolt weaves natural product promotion into relevant content." },
      { q: "Does voice stay consistent at scale?", a: "Yes. The same instructions apply to every article, no matter the volume." },
    ],
    ctaTitle: "Scale content that still sounds like you",
    ctaBody: "Set your brand voice once and publish on-brand articles at any volume.",
  },
  {
    slug: "seo-geo-score",
    name: "SEO / GEO Score",
    tagline: "Score every article for both search and AI citations.",
    icon: Gauge,
    eyebrow: "SEO / GEO score",
    h1: "Score every article for search + AI",
    subhead:
      "Every article is scored for traditional SEO and generative engine optimization, so you publish content built to rank on Google and get cited by AI.",
    metaTitle: "SEO & GEO Content Scoring | Rankvolt",
    metaDescription:
      "Score every article for traditional SEO and generative engine optimization, so you publish content built to rank on Google and get cited by AI.",
    benefits: [
      { title: "Dual optimization", body: "One score for Google rankings, one for AI citations — optimized for how buyers actually search today." },
      { title: "Actionable checks", body: "Word count, headings, links, readability, and keyword use are checked before you publish." },
      { title: "Quality you can trust", body: "Ship only content that clears the bar for both search engines and AI answers." },
    ],
    steps: [
      { title: "Write or generate", body: "Draft an article in Rankvolt or import your own." },
      { title: "Get scored", body: "Rankvolt grades it on SEO and GEO factors with clear fixes." },
      { title: "Publish with confidence", body: "Hit your target score and publish content built to win." },
    ],
    faqs: [
      { q: "What's the difference between SEO and GEO?", a: "SEO optimizes for Google rankings; GEO (generative engine optimization) optimizes for being cited inside AI answers." },
      { q: "What does the score check?", a: "Structure, headings, internal links, keyword use, readability, and citation-readiness." },
      { q: "Is a perfect score required?", a: "No, but higher scores correlate with better rankings and more AI citations." },
    ],
    ctaTitle: "Publish content built to win both",
    ctaBody: "Score every article for search and AI before it goes live.",
  },
];

export function getFeature(slug: string): Feature | undefined {
  return FEATURES.find((f) => f.slug === slug);
}

export const FEATURE_SLUGS = FEATURES.map((f) => f.slug);