/**
 * The composer's state, kept apart from the component so the page test can
 * check it. The brief itself is built by composeStyleBrief, the function the
 * live writer, the mock writer and the Settings preview all share, so what
 * this page shows is the text the writer reads.
 */
import { composeStyleBrief } from "@/lib/style-brief";
import { STYLES, TONES, type VoicePreset } from "./content";

/** A select's value: one of the dashboard's options, or "own" for free text. */
export const OWN = "own";

export interface VoiceFields {
  brand: string;
  product: string;
  tone: string;
  toneOwn: string;
  style: string;
  styleOwn: string;
  audience: string;
  rules: string;
}

function pick(value: string, options: readonly string[]): { value: string; own: string } {
  return (options as readonly string[]).includes(value)
    ? { value, own: "" }
    : { value: OWN, own: value };
}

export function fieldsFrom(preset: VoicePreset): VoiceFields {
  const tone = pick(preset.tone, TONES);
  const style = pick(preset.style, STYLES);
  return {
    brand: preset.brand,
    product: preset.product,
    tone: tone.value,
    toneOwn: tone.own,
    style: style.value,
    styleOwn: style.own,
    audience: preset.audience,
    rules: preset.rules,
  };
}

export function briefFor(f: VoiceFields): string {
  return composeStyleBrief({
    brand: f.brand,
    product: f.product,
    tone: f.tone === OWN ? f.toneOwn : f.tone,
    style: f.style === OWN ? f.styleOwn : f.style,
    audience: f.audience,
    voice: f.rules,
  });
}

export function sameFields(a: VoiceFields, b: VoiceFields): boolean {
  return (Object.keys(a) as (keyof VoiceFields)[]).every((k) => a[k] === b[k]);
}
