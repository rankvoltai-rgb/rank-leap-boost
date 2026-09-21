/**
 * Competitor comparison pages — /alternatives/$slug.
 *
 * Each entry is one sub-landing page with the same depth as a feature page:
 * a hero scorecard, a quotable short answer, a full feature matrix, the cost
 * maths, three deep dives, an honest "when they win" section, a migration
 * path, and an FAQ.
 *
 * Two rules for anything written here, because these pages name other
 * companies:
 *
 * 1. Never state a competitor cannot do something. State what it is *for*.
 *    Every `no` cell says "not its focus", never "missing" or "can't".
 * 2. Every price is a published list price with a date on it. `checkedOn` is
 *    rendered on the page, so a stale number reads as dated rather than
 *    dishonest. Re-check before each release.
 */
import {
  Search,
  PenLine,
  Send,
  Quote,
  Link2,
  Gauge,
  LineChart,
  type LucideIcon,
} from "lucide-react";
import { PLAN } from "./pricing";

/** How a product handles one row of the matrix. */
export type CellState = "yes" | "partial" | "no";

export interface Cell {
  state: CellState;
  /** Shown under the icon. Always a description, never a verdict. */
  note: string;
}

export interface MatrixRow {
  label: string;
  /** The buyer-facing "why this row matters", shown under the label. */
  detail: string;
  rankbox: Cell;
  them: Cell;
}

export interface MatrixGroup {
  group: string;
  icon: LucideIcon;
  rows: MatrixRow[];
}

/** A bar in the hero scorecard. 0–100, and honest: we do not score them zero. */
export interface Score {
  label: string;
  rankbox: number;
  them: number;
}

export interface Spec {
  value: string;
  label: string;
}

export interface Battleground {
  /** Links the deep dive to the feature page that owns it. */
  featureSlug: string;
  icon: LucideIcon;
  title: string;
  body: string;
  points: string[];
}

export interface Step {
  title: string;
  body: string;
}

export interface FAQ {
  q: string;
  a: string;
}

export interface Competitor {
  slug: string;
  /** The competitor's name, spelled the way they spell it. */
  name: string;
  /** Their site, used to fetch the logo shown in the vs-lockup. */
  domain: string;
  /** Lettermark fallback, for when the logo fetch fails. Keep to 1–2 characters. */
  monogram: string;
  /** Their brand colour, used only as a low-opacity tint behind the fallback. */
  accent: string;
  /** What they are, in their own terms. Used in nav and cards. */
  category: string;
  oneLiner: string;

  eyebrow: string;
  headline: { lead: string; accent: string };
  subhead: string;
  metaTitle: string;
  metaDescription: string;

  /**
   * The quotable paragraph. Written to be lifted whole by an answer engine:
   * names both products, states the distinction in one sentence, then who
   * each is for. No marketing adjectives — those get paraphrased away.
   */
  shortAnswer: string;
  /** The one-line summary of each product's job, shown as a two-up. */
  verdict: { rankbox: string; them: string };

  scores: Score[];
  specs: Spec[];

  positioning: {
    title: string;
    body: string;
    rankboxTitle: string;
    rankbox: string[];
    themTitle: string;
    them: string[];
  };

  matrix: MatrixGroup[];

  pricing: {
    /** The plan we compare against, named exactly as they name it. */
    plan: string;
    monthly: number;
    /** Articles that plan is good for, where the plan is sold that way. */
    articles: number | null;
    /** What the number covers, e.g. "1 seat, 50 AI credits". */
    covers: string;
    /** Anything the headline price does not include. */
    caveat: string;
    /** ISO date the price was last verified against their pricing page. */
    checkedOn: string;
  };

  battlegrounds: Battleground[];

  /** Where the competitor is genuinely the better buy. Written straight. */
  betterWhen: { title: string; body: string }[];

  migration: { title: string; body: string; steps: Step[] };

  /** Names from the landing TESTIMONIALS, most relevant first. */
  proof: string[];
  faqs: FAQ[];
  ctaTitle: string;
  ctaBody: string;
}

/** Rankbox's side of the cost maths, derived so it can never drift. */
export const RANKBOX_COST = {
  monthly: PLAN.monthly,
  articles: PLAN.articlesPerMonth,
  perArticle: Math.round((PLAN.monthly / PLAN.articlesPerMonth) * 100) / 100,
} as const;

/* Rows every comparison shares, so the matrix reads consistently from page to
   page and a reader comparing two of our pages sees the same questions asked
   twice. Each competitor supplies only its own `them` cell. */
const RANKBOX_CELLS = {
  research: {
    state: "yes",
    note: "Maps buyer questions across Google and AI engines, scored for volume, difficulty, and intent",
  },
  writer: {
    state: "yes",
    note: "2,000–3,500 words from live web research, sources cited inline",
  },
  voice: { state: "yes", note: "Trained on your site once, applied to every draft" },
  score: { state: "yes", note: "Every draft graded on SEO and GEO before it can publish" },
  publish: {
    state: "yes",
    note: "Daily auto-publish to WordPress, Shopify, Webflow, Wix, Framer, or webhook",
  },
  backlinks: {
    state: "yes",
    note: `${PLAN.backlinkCreditsPerMonth} backlink credits a month, included`,
  },
  reddit: {
    state: "yes",
    note: "Finds the threads your buyers read and drafts your reply — you post it",
  },
  tracking: {
    state: "yes",
    note: "Tracks citations in ChatGPT, Perplexity, Gemini, and AI Overviews",
  },
  autopilot: { state: "yes", note: "Research → write → score → publish runs without you" },
  seats: { state: "yes", note: "Unlimited team members on every plan" },
  rewrites: { state: "yes", note: "Unlimited, never metered" },
} satisfies Record<string, Cell>;

export const COMPETITORS: Competitor[] = [
  /* ------------------------------------------------------------------ */
  /* Jasper                                                              */
  /* ------------------------------------------------------------------ */
  {
    slug: "jasper",
    name: "Jasper",
    domain: "jasper.ai",
    monogram: "J",
    accent: "#8b5cf6",
    category: "AI writing platform",
    oneLiner: "A marketing copy platform with templates, a chat assistant, and brand controls.",

    eyebrow: "Jasper alternative",
    headline: { lead: "The Jasper alternative", accent: "that publishes" },
    subhead:
      "Jasper helps your marketing team write faster. Rankbox runs the whole loop — it finds the questions your buyers ask AI, writes the answers with sources, scores them, and publishes daily to your site, without anyone opening an editor.",
    metaTitle: "Jasper Alternative: Rankbox vs Jasper (2026 Comparison)",
    metaDescription:
      "An honest Rankbox vs Jasper comparison: what each tool is built for, a full feature matrix, real cost per article, and when Jasper is still the better buy.",

    shortAnswer:
      "Jasper is an AI writing platform: you open it, pick a template or prompt the assistant, and it helps your team produce marketing copy faster. Rankbox is an AI search growth engine: it researches the questions buyers ask ChatGPT, Perplexity, and Google, writes source-backed articles in your brand voice, scores them for SEO and GEO, and publishes them to your site on a schedule. Choose Jasper if you have writers and want to speed them up across ads, emails, and social. Choose Rankbox if you have no writers and want published, citable articles appearing without anyone running the process.",
    verdict: {
      rankbox: "An engine that publishes. You approve a plan; articles go live daily.",
      them: "A tool that assists. A person opens it, prompts it, and edits the output.",
    },

    scores: [
      { label: "Long-form article depth", rankbox: 95, them: 70 },
      { label: "Marketing copy breadth", rankbox: 35, them: 95 },
      { label: "Keyword & question research", rankbox: 92, them: 30 },
      { label: "Publishes without you", rankbox: 96, them: 20 },
      { label: "AI citation tracking", rankbox: 94, them: 15 },
    ],
    specs: [
      { value: "0", label: "editors to open — articles publish themselves" },
      { value: `${PLAN.articlesPerMonth}/mo`, label: "finished, source-backed articles" },
      {
        value: "4 engines",
        label: "citations tracked across ChatGPT, Perplexity, Gemini, AI Overviews",
      },
      { value: "Unlimited", label: "seats and rewrites, on the one plan" },
    ],

    positioning: {
      title: "Jasper speeds up writers. Rankbox replaces the process.",
      body: "Both write with AI. The difference is everything either side of the writing — and whether anything reaches your site without a person driving it.",
      rankboxTitle: "What Rankbox owns",
      rankbox: [
        "Finds the questions, so nobody has to pick topics",
        "Researches the live web and cites real sources in the draft",
        "Grades every article for Google and for AI answer engines",
        "Publishes to your CMS on a schedule, daily",
        "Reports which AI answers now name your brand",
      ],
      themTitle: "What Jasper owns",
      them: [
        "Ads, emails, product copy, social — dozens of formats",
        "A chat assistant your team prompts directly",
        "Brand voice and style controls across a marketing org",
        "Campaign workflows several people collaborate inside",
        "An established app your writers already know",
      ],
    },

    matrix: [
      {
        group: "Finding what to write",
        icon: Search,
        rows: [
          {
            label: "Buyer-question research",
            detail: "Does the tool decide what to write about, or do you?",
            rankbox: RANKBOX_CELLS.research,
            them: { state: "no", note: "Not its focus — you bring the topic and prompt it" },
          },
          {
            label: "Volume & difficulty scoring",
            detail: "Knowing a topic is winnable before you spend an article on it.",
            rankbox: { state: "yes", note: "Every topic scored on volume, difficulty, and intent" },
            them: { state: "partial", note: "Available through its Surfer SEO integration" },
          },
          {
            label: "AI-phrased query mapping",
            detail: "Questions the way people type them into an answer engine, not keyword stems.",
            rankbox: { state: "yes", note: "Mapped the way ChatGPT and Perplexity parse them" },
            them: { state: "no", note: "Not its focus — built around classic keyword input" },
          },
        ],
      },
      {
        group: "Writing the article",
        icon: PenLine,
        rows: [
          {
            label: "Long-form with live research",
            detail: "Whether the draft is grounded in current sources or model memory.",
            rankbox: RANKBOX_CELLS.writer,
            them: {
              state: "partial",
              note: "Long-form supported; research depends on how you prompt it",
            },
          },
          {
            label: "Inline source citations",
            detail: "AI engines cite pages that themselves cite sources.",
            rankbox: { state: "yes", note: "Claims linked to the source they came from" },
            them: { state: "no", note: "Not its focus — citations are added by the writer" },
          },
          {
            label: "Brand voice",
            detail: "Sounding like you without an editing pass.",
            rankbox: RANKBOX_CELLS.voice,
            them: { state: "yes", note: "Brand Voice is one of its strongest features" },
          },
          {
            label: "Marketing copy formats",
            detail: "Ads, emails, landing pages, social posts.",
            rankbox: { state: "no", note: "Not its focus — Rankbox writes articles only" },
            them: { state: "yes", note: "Dozens of templates across every channel" },
          },
        ],
      },
      {
        group: "Shipping it",
        icon: Send,
        rows: [
          {
            label: "Pre-publish quality gate",
            detail: "Something that stops a weak draft reaching your site.",
            rankbox: RANKBOX_CELLS.score,
            them: { state: "partial", note: "SEO checks via the Surfer SEO integration" },
          },
          {
            label: "Publishes to your CMS",
            detail: "Whether content leaves the tool on its own.",
            rankbox: RANKBOX_CELLS.publish,
            them: {
              state: "partial",
              note: "Copy out, or push through an integration you wire up",
            },
          },
          {
            label: "Runs on a schedule",
            detail: "Consistency is the whole game in search.",
            rankbox: RANKBOX_CELLS.autopilot,
            them: { state: "no", note: "Not its focus — someone opens it each time" },
          },
        ],
      },
      {
        group: "Growing authority",
        icon: Link2,
        rows: [
          {
            label: "Backlink building",
            detail: "Links are still how search decides who to trust.",
            rankbox: RANKBOX_CELLS.backlinks,
            them: { state: "no", note: "Not its focus — a writing platform, not an off-page one" },
          },
          {
            label: "Reddit & community presence",
            detail: "AI engines lean heavily on forum discussion.",
            rankbox: RANKBOX_CELLS.reddit,
            them: { state: "no", note: "Not its focus" },
          },
        ],
      },
      {
        group: "Measuring AI visibility",
        icon: Quote,
        rows: [
          {
            label: "AI citation tracking",
            detail: "Knowing whether ChatGPT names you when it matters.",
            rankbox: RANKBOX_CELLS.tracking,
            them: { state: "no", note: "Not its focus — no answer-engine monitoring" },
          },
          {
            label: "Share-of-answer reporting",
            detail: "How often you appear versus your competitors.",
            rankbox: { state: "yes", note: "Tracked per prompt, per engine, over time" },
            them: { state: "no", note: "Not its focus" },
          },
        ],
      },
      {
        group: "Plan & team",
        icon: Gauge,
        rows: [
          {
            label: "Seats included",
            detail: "Whether growing the team grows the bill.",
            rankbox: RANKBOX_CELLS.seats,
            them: { state: "partial", note: "Priced per seat; extra seats cost extra" },
          },
          {
            label: "Rewrites",
            detail: "Iterating on a draft without watching a meter.",
            rankbox: RANKBOX_CELLS.rewrites,
            them: { state: "partial", note: "Generation is credit-metered on lower plans" },
          },
        ],
      },
    ],

    pricing: {
      plan: "Creator",
      monthly: 49,
      articles: null,
      covers: "1 seat, one brand voice, template and chat access",
      caveat:
        "Sold per seat and metered by generation credits rather than finished articles, so the true cost per published piece depends on how many drafts and rewrites it takes your team.",
      checkedOn: "2026-09-20",
    },

    battlegrounds: [
      {
        featureSlug: "answer-space-research",
        icon: Search,
        title: "You never have to pick a topic again",
        body: "Jasper waits for a prompt. Rankbox arrives with the list — the actual questions your buyers put to ChatGPT, Perplexity, and Google, clustered and ranked by how winnable each one is.",
        points: [
          "Hundreds of buyer questions mapped from your URL in the first pass",
          "Each scored for volume, difficulty, and intent, so the winnable ones surface first",
          "Approved questions flow straight to the writer — no briefs, no handoff",
        ],
      },
      {
        featureSlug: "auto-publishing",
        icon: Send,
        title: "The article reaches your site on its own",
        body: "The gap between a good draft and a published page is where most content programmes quietly die. Rankbox closes it: approved articles go live on your CMS daily, formatted, interlinked, and scheduled.",
        points: [
          "WordPress, Shopify, Webflow, Wix, Framer, or a plain webhook",
          "Daily cadence, held to whatever schedule you set",
          "Internal links, images, and metadata handled before it ships",
        ],
      },
      {
        featureSlug: "citation-tracking",
        icon: Quote,
        title: "You can see whether AI actually names you",
        body: "Rankings tell you where you sit on a page most buyers no longer read. Rankbox tracks the thing that now decides the click: whether the answer engine cites you, for which prompts, against which competitors.",
        points: [
          "ChatGPT, Perplexity, Gemini, and Google AI Overviews, monitored continuously",
          "Per-prompt share of answer, tracked against the brands you compete with",
          "Wins feed back into research, so the engine writes more of what is working",
        ],
      },
    ],

    betterWhen: [
      {
        title: "You have writers and want them faster",
        body: "Jasper is built around a person doing the work. If you have a marketing team producing copy every day, a great assistant inside their workflow beats an engine that replaces a workflow they like.",
      },
      {
        title: "You need copy far beyond articles",
        body: "Ad variants, lifecycle email, product descriptions, social calendars. Rankbox writes articles and nothing else, on purpose. Jasper covers the whole channel mix.",
      },
      {
        title: "Several people collaborate on one campaign",
        body: "Jasper's workflows, shared assets, and per-seat model are designed for a marketing org working together. Rankbox is designed for a founder who wants the output without the org.",
      },
    ],

    migration: {
      title: "Switching from Jasper takes an afternoon",
      body: "There is nothing to export and no content to migrate — anything you published with Jasper stays exactly where it is, and Rankbox starts filling the gaps around it.",
      steps: [
        {
          title: "Point us at your site",
          body: "Paste your URL. Rankbox reads what you have already published, learns your voice from it, and maps your answer space.",
        },
        {
          title: "Approve the plan",
          body: "You get a ranked list of buyer questions. Approve the ones you want, add any of your own, and set a publishing cadence.",
        },
        {
          title: "Connect your CMS and step away",
          body: "One click for WordPress, Shopify, Webflow, Wix, or Framer. The first article goes live the same day, then daily after that.",
        },
      ],
    },

    proof: ["Marco Silva", "Elise Tanaka", "Owen Carter"],
    faqs: [
      {
        q: "Is Rankbox a direct Jasper alternative?",
        a: "Only for one part of what Jasper does. If you use Jasper to produce SEO articles and blog content, Rankbox replaces that entirely and takes over the research, scoring, and publishing around it. If you use Jasper for ads, email, and social copy, Rankbox does not cover those, and plenty of teams run both.",
      },
      {
        q: "Which is cheaper, Rankbox or Jasper?",
        a: `The headline prices are close, but they are sold differently. Jasper is priced per seat and metered by generation credits, so the cost of a finished article depends on how many drafts and rewrites it takes. Rankbox is ${PLAN.articlesPerMonth} finished, published articles a month on one flat plan with unlimited seats and unlimited rewrites, which works out at about $${RANKBOX_COST.perArticle} per published article.`,
      },
      {
        q: "Does Jasper publish to WordPress automatically?",
        a: "Publishing is not what Jasper is built for. Content generally leaves it by copy-paste or through an integration you set up and run yourself. Rankbox publishes directly to WordPress, Shopify, Webflow, Wix, Framer, or a webhook, on a daily schedule you set once.",
      },
      {
        q: "Can Rankbox match Jasper's brand voice quality?",
        a: "Rankbox learns your voice from your existing site rather than asking you to configure it, then applies it to every article automatically. Jasper's Brand Voice is excellent and more flexible across formats. For long-form articles the output is comparable; across ads and social, Jasper has the wider range.",
      },
      {
        q: "Does either tool tell me if ChatGPT recommends my brand?",
        a: "Rankbox does. It tracks how often ChatGPT, Perplexity, Gemini, and Google AI Overviews cite you for the prompts your buyers actually use, and shows your share of answer against competitors. Answer-engine monitoring is not something Jasper offers.",
      },
      {
        q: "Do I need to cancel Jasper to try Rankbox?",
        a: `No. Rankbox has a free ${PLAN.sites === 1 ? "7-day" : "7-day"} trial and nothing to migrate — your published content stays where it is. Most people run a fortnight in parallel and compare what actually reached their site.`,
      },
    ],
    ctaTitle: "See what a week of autopilot looks like",
    ctaBody:
      "Paste your URL and watch Rankbox map your answer space, write the first article, and publish it — before you decide anything.",
  },

  /* ------------------------------------------------------------------ */
  /* Surfer SEO                                                          */
  /* ------------------------------------------------------------------ */
  {
    slug: "surfer-seo",
    name: "Surfer SEO",
    domain: "surferseo.com",
    monogram: "S",
    accent: "#18b3a8",
    category: "On-page SEO optimization",
    oneLiner: "A content editor that scores your draft against the pages currently ranking.",

    eyebrow: "Surfer SEO alternative",
    headline: { lead: "The Surfer SEO alternative", accent: "that writes and ships" },
    subhead:
      "Surfer tells you how to improve a draft you already have. Rankbox produces the draft, scores it for Google and for AI answer engines, publishes it to your site, and reports back on which answers now cite you.",
    metaTitle: "Surfer SEO Alternative: Rankbox vs Surfer (2026 Comparison)",
    metaDescription:
      "Rankbox vs Surfer SEO, compared honestly: optimization scoring versus an end-to-end engine, a full feature matrix, cost per published article, and when Surfer still wins.",

    shortAnswer:
      "Surfer SEO is an on-page optimization tool: you paste or write a draft into its editor and it scores your terms, headings, and length against the pages currently ranking. Rankbox is an AI search growth engine: it finds the questions worth answering, writes the article with cited sources, grades it for both search engines and AI answer engines, publishes it to your CMS, and tracks whether ChatGPT and Perplexity cite you afterwards. Choose Surfer if you already produce content and want it optimized against the live SERP. Choose Rankbox if you want the content to exist and reach your site without anyone writing it.",
    verdict: {
      rankbox: "Produces and publishes the article, then measures whether AI cites it.",
      them: "Grades an article you produced, against the pages already ranking.",
    },

    scores: [
      { label: "On-page SERP optimization", rankbox: 80, them: 96 },
      { label: "Writes the article for you", rankbox: 95, them: 55 },
      { label: "Publishes without you", rankbox: 96, them: 25 },
      { label: "Optimizes for AI answers (GEO)", rankbox: 94, them: 40 },
      { label: "Off-page authority building", rankbox: 88, them: 15 },
    ],
    specs: [
      { value: "SEO + GEO", label: "every draft graded for search and for AI answers" },
      { value: `${PLAN.articlesPerMonth}/mo`, label: "articles written, scored, and published" },
      { value: "Live web", label: "research behind every draft, cited inline" },
      { value: `$${RANKBOX_COST.perArticle}`, label: "per published article, all in" },
    ],

    positioning: {
      title: "Surfer scores the page. Rankbox runs the programme.",
      body: "Surfer is a very good instrument. The question is whether you want an instrument, or the thing the instrument measures.",
      rankboxTitle: "What Rankbox owns",
      rankbox: [
        "Decides what to write, from real buyer questions",
        "Writes it, with live research and inline sources",
        "Grades it for Google and for AI answer engines",
        "Publishes it to your CMS, daily, on schedule",
        "Builds backlinks and tracks AI citations after it ships",
      ],
      themTitle: "What Surfer owns",
      them: [
        "Term-by-term scoring against the live top-ranking pages",
        "A NLP-driven content editor experienced SEOs trust",
        "SERP analysis, audits, and internal-link suggestions",
        "A workflow agencies already run for client deliverables",
        "Granularity Rankbox deliberately abstracts away",
      ],
    },

    matrix: [
      {
        group: "Finding what to write",
        icon: Search,
        rows: [
          {
            label: "Buyer-question research",
            detail: "Whether topics come to you, or you go and find them.",
            rankbox: RANKBOX_CELLS.research,
            them: {
              state: "partial",
              note: "Keyword research and clustering, oriented to classic SERPs",
            },
          },
          {
            label: "AI-phrased query mapping",
            detail: "Questions the way an answer engine parses them.",
            rankbox: { state: "yes", note: "Mapped for ChatGPT, Perplexity, and AI Overviews" },
            them: { state: "no", note: "Not its focus — built around the ten blue links" },
          },
        ],
      },
      {
        group: "Writing the article",
        icon: PenLine,
        rows: [
          {
            label: "Writes the full article",
            detail: "Whether a finished draft exists without you typing it.",
            rankbox: RANKBOX_CELLS.writer,
            them: {
              state: "partial",
              note: "AI drafting exists, but the editor is built for optimizing your own",
            },
          },
          {
            label: "Live web research with sources",
            detail: "Grounded claims, cited — what answer engines look for.",
            rankbox: { state: "yes", note: "Claims linked to the source they came from" },
            them: {
              state: "no",
              note: "Not its focus — it analyses SERP competitors, not sources",
            },
          },
          {
            label: "Brand voice",
            detail: "Sounding like you, not like the average of page one.",
            rankbox: RANKBOX_CELLS.voice,
            them: {
              state: "partial",
              note: "Tone settings on AI drafts; the editor optimizes term coverage",
            },
          },
        ],
      },
      {
        group: "Scoring quality",
        icon: Gauge,
        rows: [
          {
            label: "On-page SEO score",
            detail: "Terms, headings, length, structure against the live SERP.",
            rankbox: { state: "yes", note: "Structure, headings, links, readability, keyword use" },
            them: { state: "yes", note: "The most granular term-level scoring on the market" },
          },
          {
            label: "GEO / answer-engine score",
            detail: "Whether the page is shaped to be quoted, not just ranked.",
            rankbox: {
              state: "yes",
              note: "Definitions, structure, and citation-readiness graded separately",
            },
            them: { state: "no", note: "Not its focus — scoring targets Google rankings" },
          },
          {
            label: "Blocks weak drafts from publishing",
            detail: "A gate, not a dashboard.",
            rankbox: RANKBOX_CELLS.score,
            them: { state: "no", note: "Not its focus — it advises, you decide" },
          },
        ],
      },
      {
        group: "Shipping it",
        icon: Send,
        rows: [
          {
            label: "Publishes to your CMS",
            detail: "Content leaving the tool without a copy-paste.",
            rankbox: RANKBOX_CELLS.publish,
            them: {
              state: "partial",
              note: "WordPress and Google Docs export; you still press publish",
            },
          },
          {
            label: "Runs on a schedule",
            detail: "Daily output without anyone remembering to do it.",
            rankbox: RANKBOX_CELLS.autopilot,
            them: { state: "no", note: "Not its focus — a person opens the editor each time" },
          },
        ],
      },
      {
        group: "Growing authority",
        icon: Link2,
        rows: [
          {
            label: "Backlink building",
            detail: "Off-page authority, not just on-page structure.",
            rankbox: RANKBOX_CELLS.backlinks,
            them: { state: "no", note: "Not its focus — an on-page tool by design" },
          },
          {
            label: "Reddit & community presence",
            detail: "Where answer engines go looking for opinion.",
            rankbox: RANKBOX_CELLS.reddit,
            them: { state: "no", note: "Not its focus" },
          },
        ],
      },
      {
        group: "Measuring AI visibility",
        icon: Quote,
        rows: [
          {
            label: "AI citation tracking",
            detail: "Whether the answer engine names you at all.",
            rankbox: RANKBOX_CELLS.tracking,
            them: { state: "no", note: "Not its focus — reporting centres on rankings" },
          },
          {
            label: "Share-of-answer reporting",
            detail: "Your visibility against competitors, per prompt.",
            rankbox: { state: "yes", note: "Tracked per prompt, per engine, over time" },
            them: { state: "no", note: "Not its focus" },
          },
        ],
      },
    ],

    pricing: {
      plan: "Essential",
      monthly: 99,
      articles: null,
      covers: "Content editor access, a monthly allowance of articles to optimize, 1 seat",
      caveat:
        "Optimization only — the price does not include producing the article, and does not include publishing it. Most teams pay a writer or a second AI tool on top.",
      checkedOn: "2026-09-20",
    },

    battlegrounds: [
      {
        featureSlug: "seo-geo-score",
        icon: Gauge,
        title: "Two scores, because there are now two audiences",
        body: "Surfer grades a draft against the pages currently ranking on Google. That still matters — but it says nothing about whether an answer engine can lift your page as the answer. Rankbox grades both, and refuses to publish a draft that fails either.",
        points: [
          "SEO: structure, headings, internal links, readability, keyword use",
          "GEO: clean definitions, quotable sections, source-backed claims",
          "The score is a gate, not a suggestion — weak drafts do not ship",
        ],
      },
      {
        featureSlug: "citation-ready-writer",
        icon: PenLine,
        title: "There is a draft to score in the first place",
        body: "Surfer's editor starts with a blank document and a target score. Rankbox starts with a finished, researched article and tells you it already passed. The work Surfer measures is work someone still has to do.",
        points: [
          "2,000–3,500 words, written from live web research",
          "Real sources cited inline, which is what answer engines trust",
          "Written in your brand voice from the first draft, not the third",
        ],
      },
      {
        featureSlug: "citation-tracking",
        icon: LineChart,
        title: "Reporting that follows the buyer, not the ranking",
        body: "A number-three ranking on a page topped by an AI summary is not the win it was in 2021. Rankbox reports on where the click actually starts now: whether the answer engine cites you.",
        points: [
          "ChatGPT, Perplexity, Gemini, and AI Overviews monitored continuously",
          "Share of answer per prompt, against the brands you compete with",
          "Results feed back into research so the engine doubles down on what lands",
        ],
      },
    ],

    betterWhen: [
      {
        title: "You are an SEO who wants the controls",
        body: "Surfer's term-level scoring is genuinely best in class, and Rankbox deliberately hides that layer. If tuning term coverage against the live SERP is the job you enjoy and are good at, Surfer is the better instrument.",
      },
      {
        title: "You run content for clients",
        body: "Agencies need an auditable deliverable — a score to show, a document to hand over, a client who owns the CMS. Surfer fits that shape. Rankbox is built to publish, which assumes the site is yours.",
      },
      {
        title: "You already have a strong writing team",
        body: "If the drafts already exist and are good, you do not need something to write them. You need something to sharpen them, and that is exactly what Surfer does.",
      },
    ],

    migration: {
      title: "Running Rankbox alongside Surfer",
      body: "These two do not really collide, so there is no migration — most people simply stop needing the editor once nothing is arriving that needs optimizing by hand.",
      steps: [
        {
          title: "Point us at your site",
          body: "Rankbox reads what you have already published — including everything you optimized in Surfer — and learns your voice from it.",
        },
        {
          title: "Compare the first article",
          body: "Take the first Rankbox draft and run it through Surfer's editor. Most clear the target score before you touch them.",
        },
        {
          title: "Let it publish",
          body: "Connect your CMS and set a cadence. Keep Surfer for the pages you still hand-write, or let the subscription lapse.",
        },
      ],
    },

    proof: ["Marco Silva", "Aman Desai", "Priya Raman"],
    faqs: [
      {
        q: "Is Rankbox a replacement for Surfer SEO?",
        a: "For most teams, yes — but not because it does the same job better. Surfer optimizes a draft you provide; Rankbox produces the draft, scores it on the same on-page factors plus AI-citation factors, and publishes it. If nothing is arriving that needs manual optimization, the editor stops being the bottleneck you were paying to fix.",
      },
      {
        q: "Does Rankbox score content the way Surfer does?",
        a: "It scores the same on-page fundamentals — structure, headings, internal links, readability, keyword use — and adds a separate GEO score for whether an AI engine can lift the page as an answer. Surfer goes deeper on term-by-term coverage against the live SERP; Rankbox covers both audiences and then enforces the result.",
      },
      {
        q: "Can I use Rankbox and Surfer together?",
        a: "Yes, and it is a reasonable way to evaluate. Run a Rankbox article through Surfer's content editor and see what score it lands at before you have edited a word.",
      },
      {
        q: "Which costs less per published article?",
        a: `Surfer's Essential plan is a published $99 a month for optimization only, so the writer or second AI tool that produces the article sits on top. Rankbox is $${PLAN.monthly} a month for ${PLAN.articlesPerMonth} researched, scored, and published articles — roughly $${RANKBOX_COST.perArticle} each, with nothing else to buy. Check both pricing pages before deciding; these were last verified on 20 September 2026.`,
      },
      {
        q: "Does Surfer SEO optimize for ChatGPT and Perplexity?",
        a: "Surfer's scoring is built around ranking on Google. Rankbox grades a second axis — GEO — for whether the page is structured to be quoted by an answer engine, and then tracks whether that actually happens across ChatGPT, Perplexity, Gemini, and AI Overviews.",
      },
      {
        q: "Do I need any SEO knowledge to use Rankbox?",
        a: "No. That is largely the point. Surfer assumes someone who knows what a term-coverage target means. Rankbox makes the decisions, enforces its own quality gate, and publishes.",
      },
    ],
    ctaTitle: "Stop optimizing drafts that do not exist yet",
    ctaBody:
      "Paste your URL. Rankbox maps your answer space, writes the first article with sources, scores it on both axes, and shows you the result.",
  },
];

/** Reserved, in the order we intend to publish them. */
export const PLANNED_COMPETITORS = ["writesonic", "koala-ai", "byword", "seobot"] as const;

export function getCompetitor(slug: string): Competitor | undefined {
  return COMPETITORS.find((c) => c.slug === slug);
}

export const COMPETITOR_SLUGS = COMPETITORS.map((c) => c.slug);

/**
 * `checkedOn` is a calendar date, not an instant. `new Date("2026-09-20")`
 * parses as UTC midnight, which renders as the 19th anywhere west of
 * Greenwich — so the page would quietly claim it was checked a day before it
 * was. Build the date in local time instead.
 */
export function formatCheckedOn(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** The H1 as one plain string, for schema and anywhere the lockup can't run. */
export function competitorH1(c: Competitor): string {
  return `${c.headline.lead} ${c.headline.accent}`;
}

/** Cost per published article, for the pricing comparison. */
export function costPerArticle(c: Competitor): number | null {
  if (!c.pricing.articles) return null;
  return Math.round((c.pricing.monthly / c.pricing.articles) * 100) / 100;
}
