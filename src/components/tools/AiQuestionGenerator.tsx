import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateAiQuestions, type QuestionGroup } from "@/lib/tools.functions";
import { cn } from "@/lib/utils";
import {
  CopyButton,
  ErrorNote,
  Field,
  RunButton,
  Stack,
  TextInput,
  Thinking,
  readAiError,
  useCopied,
} from "./shared";

const INTENT_TONE: Record<string, string> = {
  Informational: "bg-volt/10 text-volt",
  Commercial: "bg-success/10 text-success",
  Comparison: "bg-warning/15 text-warning",
  Transactional: "bg-ink text-background",
};

export function AiQuestionGenerator() {
  const run = useServerFn(generateAiQuestions);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [groups, setGroups] = useState<QuestionGroup[]>([]);
  const [copied, copy] = useCopied();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      setGroups(await run({ data: { topic: topic.trim() } }));
    } catch (err) {
      setError(readAiError(err));
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }

  const markdown = groups
    .map((g) => `## ${g.intent}\n${g.questions.map((q) => `- ${q}`).join("\n")}`)
    .join("\n\n");
  const total = groups.reduce((n, g) => n + g.questions.length, 0);

  return (
    <Stack>
      <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-5 shadow-1">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Field label="Topic, product or keyword">
              <TextInput
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="ai writing tools"
              />
            </Field>
          </div>
          <RunButton type="submit" loading={loading} className="sm:w-48">
            {loading ? "Generating" : "Generate questions"}
          </RunButton>
        </div>
      </form>

      <ErrorNote message={error} />
      {loading && <Thinking lines={5} />}

      {groups.length > 0 && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {total} questions in {groups.length} intent groups. Click any to copy.
            </p>
            <CopyButton value={markdown} label="Copy all as Markdown" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {groups.map((group) => (
              <section
                key={group.intent}
                className="rounded-2xl border border-border bg-card p-5 shadow-1"
              >
                <span
                  className={cn(
                    "inline-flex rounded-md px-2 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em]",
                    INTENT_TONE[group.intent] ?? "bg-secondary text-ink",
                  )}
                >
                  {group.intent}
                </span>
                <ul className="mt-3 space-y-1">
                  {group.questions.map((q) => (
                    <li key={q}>
                      <button
                        type="button"
                        onClick={() => copy(q, q)}
                        title="Click to copy"
                        className="w-full rounded-lg px-2.5 py-1.5 text-left text-sm leading-relaxed text-ink/85 transition-colors hover:bg-surface hover:text-ink"
                      >
                        {copied === q ? (
                          <span className="font-semibold text-success">Copied</span>
                        ) : (
                          q
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </>
      )}
    </Stack>
  );
}
