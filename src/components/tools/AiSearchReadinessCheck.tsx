import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Globe, XCircle } from "lucide-react";
import { checkAiReadiness, type ReadinessReport } from "@/lib/tools.functions";
import {
  CheckList,
  ErrorNote,
  Field,
  Pane,
  RunButton,
  Stack,
  Stat,
  StatGrid,
  ScoreRing,
  TextInput,
  Thinking,
  readAiError,
} from "./shared";

function caption(score: number): string {
  if (score >= 85) return "Engines can read, understand and cite this page. Now win the answer.";
  if (score >= 60)
    return "The basics are there; the failed checks are cheap fixes with real upside.";
  return "Engines are likely to skip or misread this page. Start with the red items.";
}

export function AiSearchReadinessCheck() {
  const run = useServerFn(checkAiReadiness);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState<ReadinessReport | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || loading) return;
    setLoading(true);
    setError("");
    setReport(null);
    try {
      setReport(await run({ data: { url: url.trim() } }));
    } catch (err) {
      setError(readAiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack>
      <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-5 shadow-1">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Field label="Page URL" hint="Homepage or any page">
              <TextInput
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="yoursite.com"
                inputMode="url"
                autoComplete="url"
              />
            </Field>
          </div>
          <RunButton type="submit" loading={loading} className="sm:w-44">
            {loading ? "Scanning" : "Run the check"}
          </RunButton>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          We fetch the page, robots.txt and llms.txt once, as an AI crawler would — no JavaScript,
          no login.
        </p>
      </form>

      <ErrorNote message={error} />
      {loading && <Thinking lines={6} />}

      {report && (
        <>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <Pane title="Readiness">
              <ScoreRing
                score={report.score}
                label={`${report.passed} of ${report.checks.length} checks pass`}
                caption={caption(report.score)}
              />
              <StatGrid cols={3}>
                <Stat
                  value={report.snapshot.wordCount.toLocaleString()}
                  label="Words visible"
                  hint="Without JS"
                />
                <Stat value={report.snapshot.schemaTypes.length} label="Schema types" />
                <Stat
                  value={`${report.snapshot.bots.filter((b) => b.allowed).length}/${report.snapshot.bots.length}`}
                  label="AI bots allowed"
                />
              </StatGrid>
            </Pane>

            <Pane title="What crawlers see" flush>
              <dl className="divide-y divide-border text-sm">
                <Row k="URL" v={report.finalUrl} mono />
                <Row k="Title" v={report.snapshot.title || "—"} />
                <Row k="Description" v={report.snapshot.description || "—"} />
                <Row
                  k="H1"
                  v={report.snapshot.h1s.length ? report.snapshot.h1s.join(" · ") : "—"}
                />
                <Row k="Canonical" v={report.snapshot.canonical || "—"} mono />
                <Row
                  k="Schema"
                  v={
                    report.snapshot.schemaTypes.length
                      ? report.snapshot.schemaTypes.join(", ")
                      : "none"
                  }
                />
                <Row
                  k="llms.txt"
                  v={
                    <span className="inline-flex items-center gap-1.5">
                      {report.snapshot.llmsTxt ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive" />
                      )}
                      {report.snapshot.llmsTxt ? "Found" : "Not found"}
                    </span>
                  }
                />
              </dl>
            </Pane>
          </div>

          <Pane title="AI crawler access" description="From robots.txt, for the path /" flush>
            <ul className="grid grid-cols-2 divide-y divide-border sm:grid-cols-3 lg:grid-cols-4">
              {report.snapshot.bots.map((b) => (
                <li key={b.token} className="flex items-center gap-2 px-4 py-2.5">
                  {b.allowed ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                  )}
                  <span className="truncate font-mono text-[0.78rem] text-ink">{b.token}</span>
                </li>
              ))}
            </ul>
          </Pane>

          <Pane title="Checks" flush>
            <CheckList items={report.checks} />
          </Pane>
        </>
      )}

      {!report && !loading && !error && (
        <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border px-5 py-6 text-sm text-muted-foreground">
          <Globe className="h-5 w-5 shrink-0" />
          Twelve checks: crawler access, llms.txt, title, description, H1, schema, canonical, Open
          Graph, language, viewport, visible content and response.
        </div>
      )}
    </Stack>
  );
}

function Row({ k, v, mono }: { k: string; v: React.ReactNode; mono?: boolean }) {
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3 px-5 py-2.5">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className={mono ? "truncate font-mono text-[0.8rem] text-ink" : "text-ink"}>{v}</dd>
    </div>
  );
}
