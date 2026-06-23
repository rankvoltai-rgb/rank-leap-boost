import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateAiQuestions, type QuestionGroup } from "@/lib/tools.functions";
import { Field, TextInput, RunButton, ErrorNote, readAiError } from "./shared";

export function AiQuestionGenerator() {
  const run = useServerFn(generateAiQuestions);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [groups, setGroups] = useState<QuestionGroup[]>([]);
  const [copied, setCopied] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      const result = await run({ data: { topic: topic.trim() } });
      setGroups(result);
    } catch (err) {
      setError(readAiError(err));
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }

  function copy(q: string) {
    navigator.clipboard.writeText(q).then(() => {
      setCopied(q);
      setTimeout(() => setCopied(""), 1400);
    });
  }

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Field label="Topic, product, or keyword">
            <TextInput
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="ai writing tools"
            />
          </Field>
        </div>
        <RunButton type="submit" loading={loading} className="sm:mb-0.5">
          Generate questions
        </RunButton>
      </form>

      <ErrorNote message={error} />

      {groups.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2">
          {groups.map((group) => (
            <div key={group.intent} className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-ink">{group.intent}</h3>
              <ul className="mt-3 space-y-2">
                {group.questions.map((q) => (
                  <li key={q}>
                    <button
                      type="button"
                      onClick={() => copy(q)}
                      title="Click to copy"
                      className="w-full rounded-lg px-2 py-1.5 text-left text-sm leading-relaxed text-muted-foreground transition-colors hover:bg-secondary hover:text-ink"
                    >
                      {copied === q ? "Copied" : q}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}