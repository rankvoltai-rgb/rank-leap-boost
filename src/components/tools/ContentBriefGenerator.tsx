import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateContentBrief, type ContentBrief } from "@/lib/tools.functions";
import { Field, TextInput, RunButton, ErrorNote, readAiError } from "./shared";

function Chips({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
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
      const result = await run({ data: { keyword: keyword.trim() } });
      setBrief(result);
    } catch (err) {
      setError(readAiError(err));
      setBrief(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Field label="Target keyword or topic">
            <TextInput
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="how to rank on ai search"
            />
          </Field>
        </div>
        <RunButton type="submit" loading={loading} className="sm:mb-0.5">
          Generate brief
        </RunButton>
      </form>

      <ErrorNote message={error} />

      {brief && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Working title
            </p>
            <h2 className="mt-1.5 text-lg font-semibold text-ink">{brief.title}</h2>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-ink">Outline</h3>
            <ol className="mt-3 space-y-4">
              {brief.outline.map((section, i) => (
                <li key={section.heading}>
                  <p className="text-sm font-medium text-ink">
                    {i + 1}. {section.heading}
                  </p>
                  {section.points.length > 0 && (
                    <ul className="mt-1.5 space-y-1 pl-5">
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
          </div>

          {brief.questions.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-ink">Questions to answer</h3>
              <ul className="mt-3 space-y-1.5">
                {brief.questions.map((q) => (
                  <li key={q} className="text-sm leading-relaxed text-muted-foreground">
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Chips title="Entities & terms to cover" items={brief.entities} />
        </div>
      )}
    </div>
  );
}