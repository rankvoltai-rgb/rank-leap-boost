/**
 * Deterministic, in-app SEO + AI-readability analysis for the blog editor.
 * Everything is computed from the live document — no external API.
 */

export type CheckStatus = "pass" | "warn" | "fail";

export interface SeoCheck {
  id: string;
  label: string;
  status: CheckStatus;
  detail: string;
}

export interface SeoMetrics {
  words: number;
  readingTime: number;
  keywordDensity: number;
  keywordCount: number;
  h2: number;
  h3: number;
  links: number;
  readability: number;
  readabilityGrade: string;
}

export interface SeoAnalysis {
  score: number;
  checks: SeoCheck[];
  metrics: SeoMetrics;
}

export interface AnalyzeInput {
  title: string;
  keyword: string;
  metaDescription: string;
  html: string;
  text: string;
}

function countMatches(source: string, pattern: RegExp): number {
  const m = source.match(pattern);
  return m ? m.length : 0;
}

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length <= 3) return w ? 1 : 0;
  const groups = w
    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "")
    .replace(/^y/, "")
    .match(/[aeiouy]{1,2}/g);
  return groups ? groups.length : 1;
}

function fleschReadingEase(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  if (!words.length || !sentences.length) return 0;
  const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const score =
    206.835 -
    1.015 * (words.length / sentences.length) -
    84.6 * (syllables / words.length);
  return Math.max(0, Math.min(100, Math.round(score)));
}

function readabilityGrade(flesch: number): string {
  if (flesch >= 70) return "Easy to read";
  if (flesch >= 55) return "Fairly easy";
  if (flesch >= 40) return "Standard";
  return "Difficult";
}

type Weighted = { weight: number; achieved: number };

export function analyzeContent(input: AnalyzeInput): SeoAnalysis {
  const keyword = input.keyword.trim().toLowerCase();
  const html = input.html ?? "";
  const text = (input.text ?? "").replace(/\s+/g, " ").trim();
  const words = text ? text.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;

  const h2 = countMatches(html, /<h2[\s>]/gi);
  const h3 = countMatches(html, /<h3[\s>]/gi);
  const links = countMatches(html, /<a[\s>]/gi);
  const listItems = countMatches(html, /<li[\s>]/gi);

  const lowerText = text.toLowerCase();
  const keywordCount = keyword
    ? countMatches(
        lowerText,
        new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi"),
      )
    : 0;
  const keywordDensity = wordCount ? (keywordCount / wordCount) * 100 : 0;

  const intro = words.slice(0, 100).join(" ").toLowerCase();
  const hasFaq =
    /frequently asked|<h2[^>]*>\s*faq|faqs?\b/i.test(html) ||
    countMatches(html, /<h[23][^>]*>[^<]*\?<\/h[23]>/gi) >= 2;

  const readability = fleschReadingEase(text);

  const metrics: SeoMetrics = {
    words: wordCount,
    readingTime: Math.max(1, Math.round(wordCount / 220)),
    keywordDensity: Math.round(keywordDensity * 100) / 100,
    keywordCount,
    h2,
    h3,
    links,
    readability,
    readabilityGrade: readabilityGrade(readability),
  };

  const checks: SeoCheck[] = [];
  const scores: Weighted[] = [];
  const add = (
    id: string,
    label: string,
    status: CheckStatus,
    detail: string,
    weight: number,
  ) => {
    checks.push({ id, label, status, detail });
    scores.push({ weight, achieved: status === "pass" ? weight : status === "warn" ? weight * 0.5 : 0 });
  };

  // Keyword in title
  if (!keyword) {
    add("kw-title", "Focus keyword set", "fail", "Add a focus keyword to score the article.", 15);
  } else if (input.title.toLowerCase().includes(keyword)) {
    add("kw-title", "Keyword in title", "pass", `"${input.keyword}" appears in the title.`, 15);
  } else {
    add("kw-title", "Keyword in title", "fail", `Add "${input.keyword}" to the title.`, 15);
  }

  // Keyword in intro
  if (keyword) {
    if (intro.includes(keyword)) {
      add("kw-intro", "Keyword in introduction", "pass", "Keyword appears in the first 100 words.", 10);
    } else {
      add("kw-intro", "Keyword in introduction", "warn", "Mention the keyword early in the intro.", 10);
    }
  }

  // Keyword density
  if (keyword) {
    if (keywordDensity >= 0.5 && keywordDensity <= 2.5) {
      add("kw-density", "Keyword density", "pass", `${metrics.keywordDensity}% — within the ideal range.`, 12);
    } else if (keywordDensity > 0 && keywordDensity < 0.5) {
      add("kw-density", "Keyword density", "warn", `${metrics.keywordDensity}% — use the keyword a bit more.`, 12);
    } else if (keywordDensity > 2.5) {
      add("kw-density", "Keyword density", "warn", `${metrics.keywordDensity}% — risk of keyword stuffing.`, 12);
    } else {
      add("kw-density", "Keyword density", "fail", "Keyword does not appear in the body.", 12);
    }
  }

  // Word count
  if (wordCount >= 1500) {
    add("words", "In-depth content", "pass", `${wordCount.toLocaleString()} words — great depth for ranking.`, 15);
  } else if (wordCount >= 800) {
    add("words", "Content length", "warn", `${wordCount.toLocaleString()} words — aim for 1,500+.`, 15);
  } else {
    add("words", "Content length", "fail", `${wordCount.toLocaleString()} words — too short to rank well.`, 15);
  }

  // H2 structure
  if (h2 >= 3) {
    add("h2", "Clear section structure", "pass", `${h2} H2 sections help scanning and AI parsing.`, 10);
  } else if (h2 >= 1) {
    add("h2", "Section structure", "warn", `Only ${h2} H2 — add more sections.`, 10);
  } else {
    add("h2", "Section structure", "fail", "Add H2 headings to structure the article.", 10);
  }

  // Sub-headings
  add(
    "h3",
    "Sub-headings",
    h3 >= 2 ? "pass" : h3 === 1 ? "warn" : "warn",
    h3 ? `${h3} H3 sub-headings.` : "Add H3s to break down sections.",
    5,
  );

  // Lists
  add(
    "lists",
    "Scannable lists",
    listItems >= 3 ? "pass" : listItems >= 1 ? "warn" : "fail",
    listItems ? `${listItems} list items improve readability.` : "Add bullet or numbered lists.",
    10,
  );

  // FAQ — strong AI-citation signal
  add(
    "faq",
    "FAQ for AI engines",
    hasFaq ? "pass" : "warn",
    hasFaq ? "FAQ section helps AI answer engines cite you." : "Add a FAQ section for AI citations.",
    8,
  );

  // Meta description
  const metaLen = input.metaDescription.trim().length;
  if (metaLen >= 120 && metaLen <= 160) {
    add("meta", "Meta description", "pass", `${metaLen} characters — ideal length.`, 8);
  } else if (metaLen > 0) {
    add("meta", "Meta description", "warn", `${metaLen} characters — aim for 120–160.`, 8);
  } else {
    add("meta", "Meta description", "fail", "Write a meta description.", 8);
  }

  // Links
  add(
    "links",
    "Internal & external links",
    links >= 2 ? "pass" : links === 1 ? "warn" : "fail",
    links ? `${links} links add authority and context.` : "Add links to relevant pages and sources.",
    7,
  );

  // Readability
  add(
    "readability",
    "Readability",
    readability >= 55 ? "pass" : readability >= 40 ? "warn" : "fail",
    `${metrics.readabilityGrade} (Flesch ${readability}).`,
    5,
  );

  const totalWeight = scores.reduce((s, c) => s + c.weight, 0);
  const achieved = scores.reduce((s, c) => s + c.achieved, 0);
  const score = totalWeight ? Math.round((achieved / totalWeight) * 100) : 0;

  return { score, checks, metrics };
}