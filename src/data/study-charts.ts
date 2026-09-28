/**
 * The numbers behind the charts in Rankbox's research posts, placed with
 * `![alt](figure:study/<id> "caption")`.
 *
 * Every value comes from Rankbox's own study data (crawl and experiment runs
 * on 28 September 2026); the post's tables state the same numbers.
 * study-charts.test.ts checks that each chart's post exists and uses it.
 */

export interface StudySeries {
  key: string;
  label: string;
}

export interface StudyRow {
  name: string;
  note?: string;
  /** Percentages, keyed by series. */
  values: Record<string, number>;
}

export interface StudyBarChart {
  kind: "bars";
  /** The post that places this chart. */
  post: string;
  title: string;
  subtitle: string;
  series: StudySeries[];
  rows: StudyRow[];
  /** Axis maximum in percent; defaults to the largest value. */
  max?: number;
  source: string;
}

export interface EmbeddingMap {
  kind: "map";
  post: string;
  title: string;
  subtitle: string;
  /** Projected coordinates; the chart scales them to fit. */
  /** `place` puts the label beside the marker when two prompts sit close together. */
  prompts: { label: string; x: number; y: number; place?: "above" | "below" | "left" | "right" }[];
  clusters: {
    k: number;
    label: string;
    /** Where the cluster's label sits; defaults to above. */
    labelPlace?: "above" | "below";
    points: { x: number; y: number }[];
  }[];
  source: string;
}

export type StudyChart = StudyBarChart | EmbeddingMap;

export const STUDY_CHARTS: Record<string, StudyChart> = {
  "llms-txt-adoption": {
    kind: "bars",
    post: "state-of-llms-txt-adoption",
    title: "Share of sites serving llms.txt and llms-full.txt",
    subtitle: "Percent of sites in each group that answered our crawler, 28 September 2026.",
    series: [
      {
        key: "llms",
        label: "/llms.txt",
      },
      {
        key: "full",
        label: "/llms-full.txt",
      },
    ],
    rows: [
      {
        name: "Developer tools",
        note: "YC companies · n=625",
        values: {
          llms: 50.4,
          full: 9.3,
        },
      },
      {
        name: "B2B SaaS",
        note: "YC B2B/Fintech + Wikidata SaaS · n=3,150",
        values: {
          llms: 46.5,
          full: 8,
        },
      },
      {
        name: "Other software & IT",
        note: "Wikidata · n=6,214",
        values: {
          llms: 42.9,
          full: 8.6,
        },
      },
      {
        name: "E-commerce",
        note: "Top 500 by Tranco rank · n=458",
        values: {
          llms: 16.4,
          full: 2.8,
        },
      },
      {
        name: "Fortune 500",
        note: "2026 list · n=472",
        values: {
          llms: 15.7,
          full: 0.6,
        },
      },
      {
        name: "Tranco 1–1,000",
        note: "Includes non-website domains · n=694",
        values: {
          llms: 15.3,
          full: 1.9,
        },
      },
      {
        name: "Tranco 1,001–10,000",
        note: "Includes non-website domains · n=5,779",
        values: {
          llms: 12.1,
          full: 1.5,
        },
      },
      {
        name: "News & media",
        note: "Top 500 by Tranco rank · n=446",
        values: {
          llms: 5.2,
          full: 0,
        },
      },
    ],
    max: 60,
    source:
      "Rankbox crawl of 21,353 sites, 28 September 2026. A site counts when /llms.txt (or /llms-full.txt) returned HTTP 200 with a non-HTML body. Unreachable and parked domains are excluded.",
  },
  "ai-bot-blocking": {
    kind: "bars",
    post: "ai-bot-crawler-census",
    title: "Who blocks which AI bot in robots.txt",
    subtitle: "Percent of parsed robots.txt files that fully disallow each bot, 28 September 2026.",
    series: [
      {
        key: "news",
        label: "News & media (n=410)",
      },
      {
        key: "ecom",
        label: "E-commerce (n=311)",
      },
      {
        key: "top10k",
        label: "Tranco top 10,000 (n=4,789)",
      },
    ],
    rows: [
      {
        name: "GPTBot",
        note: "OpenAI training",
        values: {
          news: 47.6,
          ecom: 7.1,
          top10k: 15.8,
        },
      },
      {
        name: "OAI-SearchBot",
        note: "ChatGPT search index",
        values: {
          news: 28.8,
          ecom: 3.5,
          top10k: 8,
        },
      },
      {
        name: "ChatGPT-User",
        note: "ChatGPT fetches for a user",
        values: {
          news: 35.1,
          ecom: 3.9,
          top10k: 10,
        },
      },
      {
        name: "ClaudeBot",
        note: "Anthropic training",
        values: {
          news: 50.2,
          ecom: 6.8,
          top10k: 14.6,
        },
      },
      {
        name: "Claude-SearchBot",
        note: "Claude search index",
        values: {
          news: 25.1,
          ecom: 3.9,
          top10k: 7.6,
        },
      },
      {
        name: "PerplexityBot",
        note: "Perplexity search index",
        values: {
          news: 45.1,
          ecom: 4.2,
          top10k: 11.3,
        },
      },
      {
        name: "Perplexity-User",
        note: "Perplexity fetches for a user",
        values: {
          news: 27.1,
          ecom: 4.2,
          top10k: 8.2,
        },
      },
      {
        name: "Google-Extended",
        note: "Gemini training/grounding token",
        values: {
          news: 43.7,
          ecom: 6.1,
          top10k: 13,
        },
      },
      {
        name: "CCBot",
        note: "Common Crawl",
        values: {
          news: 54.9,
          ecom: 8.7,
          top10k: 17,
        },
      },
      {
        name: "Googlebot",
        note: "Google Search (baseline)",
        values: {
          news: 0.2,
          ecom: 0.6,
          top10k: 2.4,
        },
      },
    ],
    max: 60,
    source:
      'Rankbox crawl, 28 September 2026. robots.txt parsed with RFC 9309 matching; "fully disallow" means both the homepage and a deep page are disallowed for that user agent. Sites without a robots.txt are not in the denominators.',
  },
  "embedding-map": {
    kind: "map",
    post: "vector-distance-vs-keyword-density",
    title: "Where the paragraphs land next to the questions",
    subtitle:
      "One topic (llms.txt): 4 user prompts and 28 paragraphs, embedded with bge-base-en-v1.5 and projected to two dimensions.",
    prompts: [
      { label: "What is an llms.txt file?", x: -0.164, y: -0.13, place: "left" },
      { label: "How does an llms.txt file work?", x: -0.129, y: -0.165, place: "right" },
      { label: "Should my website have an llms.txt file?", x: 0.032, y: -0.225 },
      {
        label: "Is there a text file I can add to help AI assistants understand my site?",
        x: -0.064,
        y: -0.762,
        place: "above",
      },
    ],
    clusters: [
      {
        k: 0,
        label: "0 definitions",
        points: [
          { x: 0.392, y: -0.083 },
          { x: 0.287, y: -0.011 },
          { x: 0.301, y: -0.011 },
          { x: 0.331, y: -0.019 },
          { x: 0.319, y: -0.026 },
          { x: 0.297, y: -0.034 },
        ],
      },
      {
        k: 1,
        label: "1 definition",
        points: [
          { x: 0.243, y: 0.038 },
          { x: 0.118, y: 0.087 },
          { x: 0.133, y: 0.089 },
          { x: 0.121, y: 0.069 },
          { x: 0.118, y: 0.08 },
          { x: 0.117, y: 0.086 },
        ],
      },
      {
        k: 2,
        label: "2 definitions",
        points: [
          { x: 0.033, y: 0.096 },
          { x: -0.061, y: 0.132 },
          { x: -0.072, y: 0.118 },
          { x: -0.082, y: 0.114 },
          { x: -0.077, y: 0.125 },
          { x: -0.091, y: 0.122 },
        ],
      },
      {
        k: 3,
        label: "3 definitions",
        labelPlace: "below",
        points: [
          { x: -0.084, y: 0.044 },
          { x: -0.123, y: 0.077 },
          { x: -0.164, y: 0.082 },
          { x: -0.155, y: 0.088 },
          { x: -0.156, y: 0.08 },
        ],
      },
      {
        k: 4,
        label: "4 definitions",
        points: [
          { x: -0.291, y: -0.057 },
          { x: -0.277, y: 0 },
          { x: -0.286, y: 0.011 },
          { x: -0.283, y: -0.009 },
          { x: -0.285, y: -0.004 },
        ],
      },
    ],
    source:
      "Rankbox experiment, 28 September 2026. Principal component analysis of normalized embeddings; the two axes shown carry 55% of the variance, so distances on the map are approximate. Dots in one cluster share their sentences and differ only in how many times the keyword is repeated.",
  },
};
