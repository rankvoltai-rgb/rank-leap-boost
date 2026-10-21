/**
 * Small helpers the /use-cases sections share: each seat's soft tint, and how
 * a handoff label reads mid-sentence.
 */
import { PERSONAS, type Persona } from "@/data/personas";

/* Six soft tints, one per seat, from the landing's feature rows. */
const SEAT_TINTS = [
  { panel: "#eaf2fe", tile: "#dbe8fd", ink: "#1877f2" },
  { panel: "#f1eefd", tile: "#e3ddfb", ink: "#7c3aed" },
  { panel: "#e9f6ee", tile: "#d6efdf", ink: "#16a34a" },
  { panel: "#fdf4e4", tile: "#fbe7c4", ink: "#b45309" },
  { panel: "#fdedf1", tile: "#fbd9e2", ink: "#e11d48" },
  { panel: "#fdefe7", tile: "#fbdccb", ink: "#ea580c" },
] as const;

export function tintFor(persona: Persona) {
  const i = PERSONAS.findIndex((p) => p.slug === persona.slug);
  return SEAT_TINTS[(i < 0 ? 0 : i) % SEAT_TINTS.length];
}

/** A label as it reads mid-list: "The final edit" → "the final edit", with
 *  names left alone ("Your Google Business Profile" → "your Google Business
 *  Profile"). Only the first letter moves, and only on an ordinary word. */
export function midSentence(label: string): string {
  return /^[A-Z][a-z]/.test(label) ? label[0].toLowerCase() + label.slice(1) : label;
}
