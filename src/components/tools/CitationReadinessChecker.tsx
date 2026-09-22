import { useMemo, useState } from "react";
import { headingsFromHtml, headingsFromMarkdown } from "@/lib/html-signals";
import {
  fleschReadingEase,
  paragraphs,
  readabilityLabel,
  sentences,
  stripMarkdown,
  words,
} from "@/lib/text-stats";
import {
  CheckList,
  CopyButton,
  EmptyState,
  Field,
  Pane,
  ScoreRing,
  Stat,
  StatGrid,
  TextArea,
  TextInput,
  Workbench,
  type CheckItem,
} from "./shared";

const HEDGES =
  /\b(might|may|perhaps|possibly|arguably|somewhat|fairly|quite|rather|generally|often|usually|it seems|it appears)\b/gi;
const PASSIVE = /\b(is|are|was|were|be|been|being)\s+(\w+ed|\w+en)\b/gi;
const SOURCE =
  /\b(according to|study|survey|report|research|data from|found that|per\s+[A-Z]|\d{4}\))/g;
const NUMBER = /(\d+([.,]\d+)?%?|\$\d|\b\d{4}\b)/g;
const QUESTION_WORD = /^(how|what|why|when|where|which|who|can|should|does|do|is|are)\b/i;

interface Analysis {
  score: number;
  checks: CheckItem[];
  stats: { words: number; sentences: number; avgLen: number; flesch: number; headings: number };
  quotable: string[];
}

function analyze(raw: string, question: string): Analysis | null {
  const isHtml = /<h[1-6]\b/i.test(raw);
  const headings = isHtml ? headingsFromHtml(raw) : headingsFromMarkdown(raw);
  const text = isHtml
    ? raw
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<\/(p|div|h[1-6]|li)>/gi, "\n\n")
        .replace(/<[^>]+>/g, " ")
    : stripMarkdown(raw);
  const w = words(text);
  if (w.length < 30) return null;
  const s = sentences(text);
  const p = paragraphs(text);
  const avgLen = s.length ? w.length / s.length : 0;
  const flesch = fleschReadingEase(text);
  const checks: CheckItem[] = [];
  let score = 0;

  // 1. Answer-first opening (20)
  const first = p[0] ?? "";
  const firstWords = words(first);
  const qTerms = words(question).filter(
    (t) => t.length > 3 && !["what", "does", "should", "which"].includes(t),
  );
  const overlap = qTerms.length
    ? qTerms.filter((t) => firstWords.includes(t)).length / qTerms.length
    : null;
  const openingOk =
    firstWords.length >= 20 && firstWords.length <= 80 && (overlap === null || overlap >= 0.5);
  score += openingOk ? 20 : firstWords.length >= 20 ? 10 : 0;
  checks.push({
    id: "opening",
    status: openingOk ? "pass" : "fail",
    label: "Answer-first opening",
    detail: `First paragraph is ${firstWords.length} words${overlap !== null ? `, covering ${Math.round(overlap * 100)}% of the question's terms` : ""}.`,
    fix: "Open with the direct answer in 40–60 words, using the words of the question. Context and caveats come after.",
  });

  // 2. Sentence length (15)
  const long = s.filter((x) => words(x).length > 30).length;
  const longShare = s.length ? long / s.length : 0;
  const sentOk = longShare <= 0.15 && avgLen <= 22;
  score += sentOk ? 15 : longShare <= 0.3 ? 8 : 0;
  checks.push({
    id: "sentences",
    status: sentOk ? "pass" : longShare <= 0.3 ? "warn" : "fail",
    label: "Sentences short enough to quote",
    detail: `${long} of ${s.length} sentences run past 30 words; average ${avgLen.toFixed(1)}.`,
    fix: "Split sentences over 30 words. A quotable sentence makes its point without the one before it.",
  });

  // 3. Specificity (15)
  const numbers = (text.match(NUMBER) ?? []).length;
  const per100 = (numbers / w.length) * 100;
  const specOk = per100 >= 0.8;
  score += specOk ? 15 : per100 >= 0.4 ? 8 : 0;
  checks.push({
    id: "specific",
    status: specOk ? "pass" : per100 >= 0.4 ? "warn" : "fail",
    label: "Concrete numbers and dates",
    detail: `${numbers} figures in ${w.length} words (${per100.toFixed(1)} per 100).`,
    fix: "Replace 'many', 'fast' and 'most' with a number, a date or a named example. Engines quote specifics.",
  });

  // 4. Named sources (10)
  const sources = (text.match(SOURCE) ?? []).length + (raw.match(/https?:\/\//g) ?? []).length;
  const srcOk = sources >= 2;
  score += srcOk ? 10 : sources ? 5 : 0;
  checks.push({
    id: "sources",
    status: srcOk ? "pass" : sources ? "warn" : "fail",
    label: "Named sources",
    detail: `${sources} source signal${sources === 1 ? "" : "s"} (studies, reports, links, 'according to').`,
    fix: "Attribute at least two claims to a named source with a link. It's how engines judge trust.",
  });

  // 5. Question headings (15)
  const hCount = headings.length;
  const qHeads = headings.filter((h) => /\?$/.test(h.text) || QUESTION_WORD.test(h.text)).length;
  const qShare = hCount ? qHeads / hCount : 0;
  const headOk = hCount >= 3 && qShare >= 0.3;
  score += headOk ? 15 : hCount >= 3 ? 7 : 0;
  checks.push({
    id: "headings",
    status: headOk ? "pass" : hCount >= 3 ? "warn" : "fail",
    label: "Headings that mirror real questions",
    detail: hCount
      ? `${qHeads} of ${hCount} headings are phrased as questions or start with how/what/why.`
      : "No headings found — paste Markdown with # headings or HTML.",
    fix: "Turn key H2s into the question a reader would type. The paragraph below becomes the answer engines lift.",
  });

  // 6. Chunk length (10)
  const longP = p.filter((x) => words(x).length > 150).length;
  const shortP = p.filter((x) => words(x).length < 15).length;
  const chunkOk = longP === 0 && shortP / Math.max(1, p.length) <= 0.4;
  score += chunkOk ? 10 : longP <= 1 ? 5 : 0;
  checks.push({
    id: "chunks",
    status: chunkOk ? "pass" : longP <= 1 ? "warn" : "fail",
    label: "Paragraphs sized for extraction",
    detail: `${p.length} paragraphs; ${longP} over 150 words, ${shortP} under 15.`,
    fix: "Keep paragraphs between 40 and 120 words, one idea each. Engines pull passages, not pages.",
  });

  // 7. Hedging (5)
  const hedges = (text.match(HEDGES) ?? []).length;
  const hedgeOk = (hedges / w.length) * 100 <= 0.6;
  score += hedgeOk ? 5 : 2;
  checks.push({
    id: "hedges",
    status: hedgeOk ? "pass" : "warn",
    label: "Confident, not hedged",
    detail: `${hedges} hedging word${hedges === 1 ? "" : "s"} (might, perhaps, generally…).`,
    fix: "Cut hedges where you know the answer. A hedged claim is rarely quoted.",
  });

  // 8. Passive voice (5)
  const passive = (text.match(PASSIVE) ?? []).length;
  const passiveShare = s.length ? passive / s.length : 0;
  const passOk = passiveShare <= 0.12;
  score += passOk ? 5 : 2;
  checks.push({
    id: "passive",
    status: passOk ? "pass" : "warn",
    label: "Active voice",
    detail: `About ${Math.round(passiveShare * 100)}% of sentences look passive.`,
    fix: "Name the actor: 'Google rewrites most snippets' beats 'most snippets are rewritten'.",
  });

  // 9. Readability (5)
  const readOk = flesch >= 50;
  score += readOk ? 5 : flesch >= 40 ? 3 : 0;
  checks.push({
    id: "read",
    status: readOk ? "pass" : flesch >= 40 ? "warn" : "fail",
    label: `Readability: ${flesch} (${readabilityLabel(flesch)})`,
    detail: "Flesch reading ease; 50+ is plain business English.",
    fix: "Shorter words and sentences. You're writing for a reader and a parser at once.",
  });

  // Fresh, non-global copies: a /g regex's .test() is stateful across calls.
  const hasNumber = new RegExp(NUMBER.source);
  const hasHedge = new RegExp(HEDGES.source, "i");
  const quotable = s
    .filter((x) => {
      const n = words(x).length;
      return n >= 10 && n <= 28 && hasNumber.test(x) && !hasHedge.test(x);
    })
    .slice(0, 4);

  return {
    score,
    checks,
    stats: { words: w.length, sentences: s.length, avgLen, flesch, headings: hCount },
    quotable,
  };
}

export function CitationReadinessChecker() {
  const [text, setText] = useState("");
  const [question, setQuestion] = useState("");
  const result = useMemo(() => analyze(text, question), [text, question]);

  return (
    <Workbench
      sticky={false}
      input={
        <Pane title="Draft" description="Markdown or HTML, headings included. Nothing is uploaded.">
          <Field label="The question this page answers" hint="Optional, sharpens the opening check">
            <TextInput
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Should I block AI crawlers?"
            />
          </Field>
          <Field label="Content" hint={`${words(stripMarkdown(text)).length} words`}>
            <TextArea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                "# Should I block AI crawlers?\n\nBlocking AI crawlers makes sense only for the training bots…"
              }
              className="min-h-[28rem]"
            />
          </Field>
        </Pane>
      }
      output={
        !result ? (
          <EmptyState
            title="Paste at least 30 words"
            body="You'll get a citation-readiness score, nine checks with fixes, and your most quotable sentences."
          />
        ) : (
          <>
            <Pane title="Citation readiness">
              <ScoreRing
                score={result.score}
                label={
                  result.score >= 80
                    ? "Ready to be quoted"
                    : result.score >= 55
                      ? "Close — fix the red items"
                      : "Engines will struggle to lift an answer"
                }
                caption="Weighted across nine checks. The opening and specificity carry the most."
              />
              <StatGrid cols={4}>
                <Stat value={result.stats.words.toLocaleString()} label="Words" />
                <Stat value={result.stats.sentences} label="Sentences" />
                <Stat value={result.stats.avgLen.toFixed(0)} label="Avg. length" />
                <Stat value={result.stats.headings} label="Headings" />
              </StatGrid>
            </Pane>
            <Pane title="Checks" flush>
              <CheckList items={result.checks} />
            </Pane>
            {result.quotable.length > 0 && (
              <Pane
                title="Most quotable sentences"
                description="Short, specific, unhedged — the lines an engine is most likely to lift"
                flush
              >
                <ul className="divide-y divide-border">
                  {result.quotable.map((q) => (
                    <li key={q} className="flex items-start gap-3 px-5 py-3.5">
                      <p className="flex-1 text-sm leading-relaxed text-ink">“{q}”</p>
                      <CopyButton value={q} />
                    </li>
                  ))}
                </ul>
              </Pane>
            )}
          </>
        )
      }
    />
  );
}
