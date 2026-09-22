import { useMemo, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { ALL_BOTS, agentsLabel, checkRobots, parseRobots, pathOf } from "@/lib/robots";
import { cn } from "@/lib/utils";
import { Field, Pane, Select, TextArea, TextInput, Workbench } from "./shared";

const SAMPLE = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /*?preview=

User-agent: GPTBot
User-agent: ClaudeBot
Disallow: /

User-agent: PerplexityBot
Allow: /blog/
Disallow: /

Sitemap: https://yoursite.com/sitemap.xml
`;

export function RobotsTxtTester() {
  const [robots, setRobots] = useState(SAMPLE);
  const [url, setUrl] = useState("https://yoursite.com/blog/how-to-rank");
  const [agent, setAgent] = useState("GPTBot");
  const [custom, setCustom] = useState("");

  const file = useMemo(() => parseRobots(robots), [robots]);
  const path = pathOf(url);
  const ua = agent === "custom" ? custom.trim() || "custom-bot" : agent;
  const verdict = useMemo(() => checkRobots(file, ua, path), [file, ua, path]);

  const matrix = useMemo(
    () => ALL_BOTS.map((b) => ({ bot: b, v: checkRobots(file, b.token, path) })),
    [file, path],
  );
  const blockedCount = matrix.filter((m) => !m.v.allowed).length;

  return (
    <Workbench
      ratio="wide-input"
      input={
        <>
          <Pane title="robots.txt">
            <TextArea
              value={robots}
              onChange={(e) => setRobots(e.target.value)}
              className="min-h-72"
              mono
              aria-label="robots.txt contents"
              spellCheck={false}
            />
            <p className="text-xs text-muted-foreground">
              {file.groups.length} group{file.groups.length === 1 ? "" : "s"} ·{" "}
              {file.groups.reduce((n, g) => n + g.rules.length, 0)} rules
              {file.sitemaps.length ? ` · ${file.sitemaps.length} sitemap` : ""}
            </p>
          </Pane>
          <Pane title="Test">
            <Field label="URL or path">
              <TextInput
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yoursite.com/page"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="User agent">
                <Select value={agent} onChange={(e) => setAgent(e.target.value)}>
                  {ALL_BOTS.map((b) => (
                    <option key={b.token} value={b.token}>
                      {b.token} — {b.vendor}
                    </option>
                  ))}
                  <option value="custom">Custom…</option>
                </Select>
              </Field>
              {agent === "custom" && (
                <Field label="Custom token">
                  <TextInput
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    placeholder="MyBot"
                  />
                </Field>
              )}
            </div>
          </Pane>
        </>
      }
      output={
        <>
          <div
            className={cn(
              "rounded-2xl border p-5 shadow-1",
              verdict.allowed
                ? "border-success/30 bg-success/5"
                : "border-destructive/30 bg-destructive/5",
            )}
          >
            <div className="flex items-center gap-3">
              {verdict.allowed ? (
                <CheckCircle2 className="h-7 w-7 text-success" />
              ) : (
                <XCircle className="h-7 w-7 text-destructive" />
              )}
              <div className="min-w-0">
                <p className="font-display text-xl font-bold tracking-tight text-ink">
                  {verdict.allowed ? "Allowed" : "Blocked"}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  <span className="font-mono">{ua}</span> →{" "}
                  <span className="font-mono">{path}</span>
                </p>
              </div>
            </div>
            <dl className="mt-4 space-y-1.5 text-sm">
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 text-muted-foreground">Group</dt>
                <dd className="font-mono text-ink">
                  {verdict.group
                    ? `${agentsLabel(verdict.group)} (line ${verdict.group.line})`
                    : "none"}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 text-muted-foreground">Rule</dt>
                <dd className="text-ink">{verdict.reason}</dd>
              </div>
            </dl>
          </div>

          <Pane
            title="Every known bot"
            description={`For this path: ${matrix.length - blockedCount} allowed, ${blockedCount} blocked`}
            flush
          >
            <ul className="divide-y divide-border">
              {matrix.map(({ bot, v }) => (
                <li key={bot.token} className="flex items-center gap-3 px-5 py-2.5">
                  {v.allowed ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="font-mono text-[0.82rem] font-semibold text-ink">
                      {bot.token}
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground">{bot.vendor}</span>
                  </span>
                  <span className="hidden text-xs text-muted-foreground sm:inline">
                    {v.rule ? `line ${v.rule.line}` : v.group ? "no matching rule" : "no group"}
                  </span>
                </li>
              ))}
            </ul>
          </Pane>
        </>
      }
    />
  );
}
