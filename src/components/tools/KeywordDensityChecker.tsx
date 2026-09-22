import { useMemo, useState } from "react";
import { headingsFromHtml, headingsFromMarkdown } from "@/lib/html-signals";
import {
  countPhrase,
  fleschReadingEase,
  readabilityLabel,
  readingMinutes,
  sentences,
  stripMarkdown,
  topPhrases,
  words,
} from "@/lib/text-stats";
import { cn } from "@/lib/utils";
import {
  EmptyState,
  Field,
  Meter,
  Pane,
  Stat,
  StatGrid,
  TextArea,
  TextInput,
  Workbench,
} from "./shared";

function PhraseTable({
  title,
  rows,
  max,
}: {
  title: string;
  rows: { phrase: string; count: number }[];
  max: number;
}) {
  return (
    <div>
      <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {title}
      </p>
      {rows.length ? (
        <ul className="space-y-1.5">
          {rows.map((r) => (
            <li key={r.phrase} className="relative overflow-hidden rounded-md">
              <span
                className="absolute inset-y-0 left-0 bg-volt/10"
                style={{ width: `${(r.count / max) * 100}%` }}
              />
              <span className="relative flex items-center justify-between px-2 py-1 text-sm">
                <span className="truncate text-ink">{r.phrase}</span>
                <span className="ml-3 shrink-0 tabular-nums text-muted-foreground">{r.count}</span>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">None repeated yet.</p>
      )}
    </div>
  );
}

export function KeywordDensityChecker() {
  const [raw, setRaw] = useState("");
  const [keyword, setKeyword] = useState("");

  const r = useMemo(() => {
    const isHtml = /<[a-z][\s\S]*>/i.test(raw) && /<\/(p|div|h[1-6])>/i.test(raw);
    const text = isHtml
      ? raw.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ")
      : stripMarkdown(raw);
    const w = words(text);
    if (!w.length) return null;
    const headings = isHtml ? headingsFromHtml(raw) : headingsFromMarkdown(raw);
    const kw = keyword.trim();
    const count = kw ? countPhrase(text, kw) : 0;
    const kwWords = words(kw).length || 1;
    const density = kw ? ((count * kwWords) / w.length) * 100 : 0;
    const inFirst100 = kw ? countPhrase(w.slice(0, 100).join(" "), kw) > 0 : false;
    const inHeadings = kw ? headings.filter((h) => countPhrase(h.text, kw) > 0).length : 0;
    return {
      words: w.length,
      chars: text.replace(/\s+/g, " ").trim().length,
      sentences: sentences(text).length,
      minutes: readingMinutes(w.length),
      flesch: fleschReadingEase(text),
      count,
      density,
      inFirst100,
      inHeadings,
      headings: headings.length,
      one: topPhrases(text, 1, 10),
      two: topPhrases(text, 2, 10),
      three: topPhrases(text, 3, 10),
    };
  }, [raw, keyword]);

  return (
    <Workbench
      sticky={false}
      input={
        <Pane title="Text">
          <Field label="Target keyword" hint="Optional">
            <TextInput
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="ai crawlers"
            />
          </Field>
          <Field label="Page text" hint="Markdown or HTML is fine">
            <TextArea
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              placeholder="Paste the page text…"
              className="min-h-[26rem]"
            />
          </Field>
        </Pane>
      }
      output={
        !r ? (
          <EmptyState
            title="Paste some text"
            body="You'll get word and sentence counts, keyword density with placement checks, and the phrases you use most."
          />
        ) : (
          <>
            <StatGrid cols={4}>
              <Stat
                value={r.words.toLocaleString()}
                label="Words"
                hint={`${r.chars.toLocaleString()} chars`}
              />
              <Stat value={r.sentences} label="Sentences" />
              <Stat value={`${r.minutes} min`} label="Reading time" />
              <Stat value={r.flesch} label="Readability" hint={readabilityLabel(r.flesch)} />
            </StatGrid>

            {keyword.trim() && (
              <Pane title={`“${keyword.trim()}”`}>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Stat value={r.count} label="Occurrences" />
                  <Stat
                    value={`${r.density.toFixed(2)}%`}
                    label="Density"
                    hint="0.5–2% is typical"
                  />
                  <Stat value={`${r.inHeadings}/${r.headings}`} label="Headings using it" />
                </div>
                <Meter
                  label="Density"
                  value={Number(r.density.toFixed(2))}
                  max={3}
                  min={0.5}
                  unit="%"
                  format={(v) => v.toFixed(2)}
                />
                <p className={cn("text-sm", r.inFirst100 ? "text-success" : "text-warning")}>
                  {r.inFirst100
                    ? "Appears in the first 100 words."
                    : "Not in the first 100 words — engines weight the opening."}
                </p>
              </Pane>
            )}

            <Pane
              title="Phrase frequency"
              description="Stop words filtered; phrases seen at least twice"
            >
              <div className="grid gap-6 sm:grid-cols-3">
                <PhraseTable title="Single words" rows={r.one} max={r.one[0]?.count ?? 1} />
                <PhraseTable title="Two words" rows={r.two} max={r.two[0]?.count ?? 1} />
                <PhraseTable title="Three words" rows={r.three} max={r.three[0]?.count ?? 1} />
              </div>
            </Pane>
          </>
        )
      }
    />
  );
}
