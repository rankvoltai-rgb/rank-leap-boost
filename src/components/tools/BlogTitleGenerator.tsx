import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateTitles, type TitleIdea } from "@/lib/tools.functions";
import { cn } from "@/lib/utils";
import {
  CopyButton,
  ErrorNote,
  Field,
  Pane,
  RunButton,
  Segmented,
  Stack,
  TextInput,
  Thinking,
  readAiError,
  textWidth,
} from "./shared";

const FONT = "20px Arial";
const LIMIT = 580;

const ANGLE_TONE: Record<string, string> = {
  "How-to": "bg-volt/10 text-volt",
  List: "bg-success/10 text-success",
  Question: "bg-warning/15 text-warning",
  Contrarian: "bg-ink text-background",
  "Data-led": "bg-secondary text-ink",
};

function Row({ t }: { t: TitleIdea }) {
  const [w, setW] = useState(0);
  useEffect(() => setW(Math.round(textWidth(t.title, FONT))), [t.title]);
  const over = w > LIMIT;
  return (
    <li className="flex items-start gap-3 px-5 py-3.5">
      <div className="min-w-0 flex-1">
        <p className="text-[0.95rem] font-semibold leading-snug text-ink">{t.title}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
          <span
            className={cn(
              "rounded-md px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em]",
              ANGLE_TONE[t.angle] ?? "bg-secondary text-ink",
            )}
          >
            {t.angle}
          </span>
          <span className="text-muted-foreground">{t.title.length} chars</span>
          <span className="flex h-1.5 w-24 overflow-hidden rounded-full bg-border">
            <span
              className={cn("h-full rounded-full", over ? "bg-destructive" : "bg-success")}
              style={{ width: `${Math.min(100, (w / LIMIT) * 100)}%` }}
            />
          </span>
          <span className={over ? "font-medium text-destructive" : "text-muted-foreground"}>
            {over ? "Will truncate" : "Fits"}
          </span>
        </div>
      </div>
      <CopyButton value={t.title} />
    </li>
  );
}

export function BlogTitleGenerator() {
  const run = useServerFn(generateTitles);
  const [topic, setTopic] = useState("");
  const [keyword, setKeyword] = useState("");
  const [tone, setTone] = useState<"plain" | "bold" | "expert">("plain");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [titles, setTitles] = useState<TitleIdea[]>([]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      setTitles(
        await run({ data: { topic: topic.trim(), keyword: keyword.trim() || undefined, tone } }),
      );
    } catch (err) {
      setError(readAiError(err));
      setTitles([]);
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
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Topic" required>
            <TextInput
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="whether to block AI crawlers"
            />
          </Field>
          <Field label="Primary keyword" hint="Optional">
            <TextInput
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="block ai crawlers"
            />
          </Field>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Field label="Tone">
            <Segmented
              value={tone}
              onChange={setTone}
              options={[
                { value: "plain", label: "Plain" },
                { value: "bold", label: "Bold" },
                { value: "expert", label: "Expert" },
              ]}
            />
          </Field>
          <RunButton type="submit" loading={loading}>
            {loading ? "Writing" : "Generate 10 titles"}
          </RunButton>
        </div>
      </form>

      <ErrorNote message={error} />
      {loading && <Thinking lines={6} />}

      {titles.length > 0 && (
        <Pane title="Titles" description="Bar shows width against Google's desktop cut-off" flush>
          <ul className="divide-y divide-border">
            {titles.map((t) => (
              <Row key={t.title} t={t} />
            ))}
          </ul>
        </Pane>
      )}
    </Stack>
  );
}
