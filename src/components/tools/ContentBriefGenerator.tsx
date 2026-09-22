import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateContentBrief, type ContentBrief } from "@/lib/tools.functions";
import {
  Chips,
  CopyButton,
  ErrorNote,
  Field,
  Pane,
  RunButton,
  Stack,
  TextInput,
  Thinking,
  readAiError,
} from "./shared";

function toMarkdown(b: ContentBrief): string {
  return [
    `# ${b.title}`,
    "",
    ...b.outline.flatMap((s) => [`## ${s.heading}`, ...s.points.map((p) => `- ${p}`), ""]),
    "## Questions to answer",
    ...b.questions.map((q) => `- ${q}`),
    "",
    "## Entities & terms to cover",
    b.entities.join(", "),
    "",
  ].join("\n");
}

export function ContentBriefGenerator() {
  const run = useServerFn(generateContentBrief);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [brief, setBrief] = useState<ContentBrief | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!keyword.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      setBrief(await run({ data: { keyword: keyword.trim() } }));
    } catch (err) {
      setError(readAiError(err));
      setBrief(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack>
      <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-5 shadow-1">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Field label="Target keyword or topic">
              <TextInput
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="how to rank on ai search"
              />
            </Field>
          </div>
          <RunButton type="submit" loading={loading} className="sm:w-44">
            {loading ? "Building" : "Generate brief"}
          </RunButton>
        </div>
      </form>

      <ErrorNote message={error} />
      {loading && <Thinking lines={7} />}

      {brief && (
        <>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Working title
                </p>
                <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-ink">
                  {brief.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {brief.outline.length} sections · {brief.questions.length} questions ·{" "}
                  {brief.entities.length} entities
                </p>
              </div>
              <CopyButton value={toMarkdown(brief)} label="Copy as Markdown" />
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            <Pane title="Outline" flush>
              <ol className="divide-y divide-border">
                {brief.outline.map((section, i) => (
                  <li key={section.heading} className="px-5 py-4">
                    <p className="flex gap-3 text-[0.95rem] font-semibold text-ink">
                      <span className="font-mono text-[0.72rem] font-semibold leading-6 text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {section.heading}
                    </p>
                    {section.points.length > 0 && (
                      <ul className="mt-2 space-y-1 pl-8">
                        {section.points.map((p) => (
                          <li
                            key={p}
                            className="list-disc text-sm leading-relaxed text-muted-foreground"
                          >
                            {p}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
            </Pane>
            <div className="space-y-5">
              {brief.questions.length > 0 && (
                <Pane title="Questions to answer" flush>
                  <ul className="divide-y divide-border">
                    {brief.questions.map((q) => (
                      <li key={q} className="px-5 py-2.5 text-sm leading-relaxed text-ink/85">
                        {q}
                      </li>
                    ))}
                  </ul>
                </Pane>
              )}
              <Pane title="Entities & terms to cover" description="Click to copy">
                <Chips items={brief.entities} onCopy />
              </Pane>
            </div>
          </div>
        </>
      )}
    </Stack>
  );
}
