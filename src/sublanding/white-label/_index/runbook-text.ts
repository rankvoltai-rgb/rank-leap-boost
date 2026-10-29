import { RUNBOOK, type RunStep } from "./content";

function lines(steps: readonly RunStep[]): string[] {
  return steps.map((s, i) => {
    const owners = s.owners.map((o) => RUNBOOK.owners[o]).join(", ");
    const ui = s.ui ? ` ${RUNBOOK.copy.uiPrefix} "${s.ui}".` : "";
    return `- [ ] ${i + 1}. ${s.title} (${owners}): ${s.body}${ui}`;
  });
}

/**
 * The runbook as a Markdown checklist, for pasting into Notion, Linear,
 * Asana or a doc. Built from the same steps the page renders.
 */
export function runbookText(): string {
  return [
    `# ${RUNBOOK.copy.heading}`,
    "",
    `## ${RUNBOOK.once.title}`,
    ...lines(RUNBOOK.once.steps),
    "",
    `## ${RUNBOOK.each.title}`,
    ...lines(RUNBOOK.each.steps),
    "",
  ].join("\n");
}
