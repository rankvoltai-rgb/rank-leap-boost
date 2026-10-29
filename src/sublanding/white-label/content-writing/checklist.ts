import { CHECKS } from "./content";

/** The editor's pass as plain text, one box per line, ready to paste into an SOP. */
export function checklistText(): string {
  return [CHECKS.copyTitle, "", ...CHECKS.editor.map((item) => `[ ] ${item}`)].join("\n");
}
