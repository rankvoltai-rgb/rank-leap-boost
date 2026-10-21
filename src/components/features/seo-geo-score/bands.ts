/**
 * The Rankbox editor's score bands and verdicts, as the scoring docs list
 * them: green from 80, amber from 55, red below.
 */
export function scoreTone(score: number) {
  return score >= 80 ? "var(--success)" : score >= 55 ? "var(--warning)" : "var(--destructive)";
}

export function verdict(score: number) {
  return score >= 80
    ? "Strong — ready to rank."
    : score >= 55
      ? "Good — a few tweaks left."
      : "Needs work to rank well.";
}
