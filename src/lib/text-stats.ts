/**
 * Plain-text statistics for the content tools: tokens, sentences, readability
 * and phrase frequency. Pure, so the same code can run anywhere.
 */

export const STOP_WORDS = new Set(
  "a an and are as at be but by for from has have he her his how i if in into is it its of on or our she so that the their them then there these they this to was we were what when where which who why will with you your not can do does did about more most other some such than too very just also over under out up down off only own same".split(
    " ",
  ),
);

export function words(text: string): string[] {
  return text.toLowerCase().match(/[a-z0-9][a-z0-9'’-]*/g) ?? [];
}

export function sentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"“(])/)
    .map((s) => s.trim())
    .filter((s) => words(s).length > 0);
}

export function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => words(p).length > 0);
}

export function syllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length <= 3) return w ? 1 : 0;
  const groups = w
    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "")
    .replace(/^y/, "")
    .match(/[aeiouy]{1,2}/g);
  return groups ? groups.length : 1;
}

/** Flesch reading ease, 0–100 (higher is easier). */
export function fleschReadingEase(text: string): number {
  const w = words(text);
  const s = sentences(text);
  if (!w.length || !s.length) return 0;
  const syl = w.reduce((n, x) => n + syllables(x), 0);
  const score = 206.835 - 1.015 * (w.length / s.length) - 84.6 * (syl / w.length);
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function readabilityLabel(score: number): string {
  if (score >= 80) return "Very easy";
  if (score >= 70) return "Easy";
  if (score >= 60) return "Plain English";
  if (score >= 50) return "Fairly hard";
  if (score >= 30) return "Hard";
  return "Very hard";
}

/** Reading time in minutes at 230 wpm, never below 1 for non-empty text. */
export function readingMinutes(wordCount: number): number {
  return wordCount ? Math.max(1, Math.round(wordCount / 230)) : 0;
}

/** Most frequent n-word phrases, skipping phrases that start or end on a stop word. */
export function topPhrases(
  text: string,
  n: number,
  limit = 10,
  minCount = 2,
): { phrase: string; count: number }[] {
  const w = words(text);
  const counts = new Map<string, number>();
  for (let i = 0; i + n <= w.length; i += 1) {
    const slice = w.slice(i, i + n);
    if (STOP_WORDS.has(slice[0]) || STOP_WORDS.has(slice[n - 1])) continue;
    if (n === 1 && slice[0].length < 3) continue;
    if (slice.every((x) => STOP_WORDS.has(x))) continue;
    const key = slice.join(" ");
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, c]) => c >= minCount)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([phrase, count]) => ({ phrase, count }));
}

/** Occurrences of a phrase, whole-word, case-insensitive. */
export function countPhrase(text: string, phrase: string): number {
  const p = phrase.trim().toLowerCase();
  if (!p) return 0;
  const esc = p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
  return (text.toLowerCase().match(new RegExp(`(?<![a-z0-9])${esc}(?![a-z0-9])`, "g")) ?? [])
    .length;
}

/** Strips Markdown syntax so counts reflect prose. */
export function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/[*_~]{1,3}([^*_~]+)[*_~]{1,3}/g, "$1")
    .replace(/<[^>]+>/g, " ");
}
