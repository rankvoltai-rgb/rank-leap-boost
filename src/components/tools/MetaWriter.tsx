import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { writeMetaDescriptions } from "@/lib/tools.functions";
import {
  ErrorNote,
  Field,
  Meter,
  Pane,
  ResultRow,
  RunButton,
  Stack,
  TextArea,
  TextInput,
  Thinking,
  readAiError,
  textWidth,
} from "./shared";

const FONT = "14px Arial";
const LIMIT = 920;

function Width({ text }: { text: string }) {
  const [w, setW] = useState(0);
  useEffect(() => setW(Math.round(textWidth(text, FONT))), [text]);
  return (
    <div className="max-w-xs">
      <Meter
        label={`${text.length} chars`}
        value={w}
        max={LIMIT}
        min={Math.round(LIMIT * 0.55)}
        unit="px"
      />
    </div>
  );
}

export function MetaWriter() {
  const run = useServerFn(writeMetaDescriptions);
  const [topic, setTopic] = useState("");
  const [keyword, setKeyword] = useState("");
  const [audience, setAudience] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [options, setOptions] = useState<string[]>([]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim() || loading) return;
    setLoading(true);
    setError("");
    const extras = [
      keyword.trim() && `Primary keyword: ${keyword.trim()}.`,
      audience.trim() && `Audience: ${audience.trim()}.`,
    ]
      .filter(Boolean)
      .join(" ");
    try {
      setOptions(
        await run({
          data: { topic: `${topic.trim()}${extras ? ` ${extras}` : ""}`.slice(0, 600) },
        }),
      );
    } catch (err) {
      setError(readAiError(err));
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack>
      <form
        onSubmit={submit}
        className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-1"
      >
        <Field label="Page topic or content" hint="Describe it or paste the opening">
          <TextArea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="A free tool that generates llms.txt files so AI engines can understand and cite your website."
            className="min-h-24"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Primary keyword" hint="Optional">
            <TextInput
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="llms.txt generator"
            />
          </Field>
          <Field label="Audience" hint="Optional">
            <TextInput
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="founders without a dev team"
            />
          </Field>
        </div>
        <RunButton type="submit" loading={loading}>
          {loading ? "Writing" : "Write 3 descriptions"}
        </RunButton>
      </form>

      <ErrorNote message={error} />
      {loading && <Thinking lines={3} />}

      {options.length > 0 && (
        <Pane
          title="Options"
          description="Width measured in Google's font; the bar's tick marks the low end"
          flush
        >
          <ul className="divide-y divide-border">
            {options.map((option, i) => (
              <ResultRow key={option} index={i} text={option} meta={<Width text={option} />} />
            ))}
          </ul>
        </Pane>
      )}
    </Stack>
  );
}
