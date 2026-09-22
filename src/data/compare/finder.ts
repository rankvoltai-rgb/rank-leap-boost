/**
 * The "Which one fits you?" picker, scored. Kept apart from the component so
 * the test can walk every combination of answers and prove each contender is
 * reachable — a picker that can only ever say one name is an ad.
 */
import type { FinderQuestion, Side } from "./types";

export type Pick = Side | "rankbox" | "tie";

export interface FinderResult {
  /** null until at least one question is answered. */
  pick: Pick | null;
  answered: number;
  total: number;
  /** The chosen answers' reasons that support the pick, in question order. */
  reasons: string[];
}

/** `answers` maps a question id to the index of the chosen option. */
export function scoreFinder(
  questions: FinderQuestion[],
  answers: Record<string, number | undefined>,
): FinderResult {
  const totals = { a: 0, b: 0, rankbox: 0 };
  const chosen = questions.flatMap((q) => {
    const i = answers[q.id];
    const option = i === undefined ? undefined : q.options[i];
    return option ? [option] : [];
  });

  for (const o of chosen) {
    totals.a += o.points.a ?? 0;
    totals.b += o.points.b ?? 0;
    totals.rankbox += o.points.rankbox ?? 0;
  }

  const base = { answered: chosen.length, total: questions.length };
  if (chosen.length === 0) return { ...base, pick: null, reasons: [] };

  /* Rankbox has to beat both contenders outright. It's the one outcome we
     have an interest in, so it never wins a tie. */
  const pick: Pick =
    totals.rankbox > Math.max(totals.a, totals.b)
      ? "rankbox"
      : totals.a > totals.b
        ? "a"
        : totals.b > totals.a
          ? "b"
          : "tie";

  const reasons = chosen
    .filter((o) => (pick === "tie" ? true : (o.points[pick] ?? 0) > 0))
    .map((o) => o.because);

  return { ...base, pick, reasons };
}

/** Every complete set of answers, for the test. */
export function allAnswerSets(questions: FinderQuestion[]): Record<string, number>[] {
  return questions.reduce<Record<string, number>[]>(
    (sets, q) => sets.flatMap((s) => q.options.map((_, i) => ({ ...s, [q.id]: i }))),
    [{}],
  );
}
