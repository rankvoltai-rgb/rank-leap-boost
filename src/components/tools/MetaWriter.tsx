import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { writeMetaDescriptions } from "@/lib/tools.functions";
import { Field, TextArea, RunButton, ErrorNote, readAiError } from "./shared";

export function MetaWriter() {
  const run = useServerFn(writeMetaDescriptions);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [copied, setCopied] = useState(-1);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      const result = await run({ data: { topic: topic.trim() } });
      setOptions(result);
    } catch (err) {
      setError(readAiError(err));
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }

  function copy(text: string, index: number) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(index);
      setTimeout(() => setCopied(-1), 1400);
    });
  }

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="space-y-3">
        <Field label="Page topic or content" hint="Describe the page or paste its main text">
          <TextArea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="A free tool that generates llms.txt files so AI engines can understand and cite your website."
          />
        </Field>
        <RunButton type="submit" loading={loading}>
          Write descriptions
        </RunButton>
      </form>

      <ErrorNote message={error} />

      {options.length > 0 && (
        <div className="space-y-3">
          {options.map((option, index) => (
            <div key={option} className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm leading-relaxed text-ink">{option}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{option.length} characters</span>
                <button
                  type="button"
                  onClick={() => copy(option, index)}
                  className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-ink transition-colors hover:bg-secondary"
                >
                  {copied === index ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}