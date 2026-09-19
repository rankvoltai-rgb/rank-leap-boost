/**
 * The brand brief the article writer reads before every article.
 *
 * One composer shared by the live writer, the mock writer and the Settings
 * preview, so what Settings shows is exactly what the writer gets.
 */
export interface StyleInputs {
  brand?: string | null;
  product?: string | null;
  tone?: string | null;
  style?: string | null;
  audience?: string | null;
  voice?: string | null;
}

/** What the writer falls back to for anything left blank. */
export const STYLE_DEFAULTS = {
  brand: "the brand",
  tone: "Professional",
  style: "Balanced",
  audience: "Founders / Entrepreneurs",
} as const;

export function composeStyleBrief(input: StyleInputs): string {
  // Blank counts as unset: an emptied field falls back to its default rather
  // than handing the writer "Tone: " with nothing after it.
  const pick = (value: string | null | undefined, fallback: string) => value?.trim() || fallback;
  return [
    `Brand: ${pick(input.brand, STYLE_DEFAULTS.brand)}`,
    `Product context: ${pick(input.product, "")}`,
    `Tone: ${pick(input.tone, STYLE_DEFAULTS.tone)}`,
    `Writing style: ${pick(input.style, STYLE_DEFAULTS.style)}`,
    `Target audience: ${pick(input.audience, STYLE_DEFAULTS.audience)}`,
    `Brand voice instructions: ${pick(input.voice, "")}`,
    "Always apply Rankbox core rules: keyword optimization, clear heading structure, internal linking logic, and high readability.",
  ].join("\n");
}
