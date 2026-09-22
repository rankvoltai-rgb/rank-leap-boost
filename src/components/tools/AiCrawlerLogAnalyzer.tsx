import { useMemo, useState } from "react";
import { ALL_BOTS, BOT_ROLES, type Bot } from "@/lib/robots";
import { cn } from "@/lib/utils";
import { EmptyState, GhostButton, Pane, Stat, StatGrid, TextArea, Workbench } from "./shared";

const SAMPLE = `66.249.66.1 - - [21/Sep/2026:08:01:12 +0000] "GET /blog/ai-crawlers HTTP/1.1" 200 51234 "-" "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
20.171.207.5 - - [21/Sep/2026:08:02:40 +0000] "GET /pricing HTTP/1.1" 200 22110 "-" "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot"
20.171.207.9 - - [21/Sep/2026:08:03:02 +0000] "GET /blog/ai-crawlers HTTP/1.1" 200 51234 "-" "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot"
23.98.142.176 - - [21/Sep/2026:08:04:19 +0000] "GET /blog/ai-crawlers HTTP/1.1" 200 51234 "-" "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot"
160.79.104.10 - - [21/Sep/2026:08:05:55 +0000] "GET /tools/llms-txt-generator HTTP/1.1" 200 30011 "-" "Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)"
160.79.104.11 - - [21/Sep/2026:08:06:01 +0000] "GET /pricing HTTP/1.1" 200 22110 "-" "Mozilla/5.0 (compatible; Claude-User/1.0; +Claude-User@anthropic.com)"
3.224.220.101 - - [21/Sep/2026:08:07:30 +0000] "GET /blog/ai-crawlers HTTP/1.1" 200 51234 "-" "Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)"
3.224.220.102 - - [21/Sep/2026:08:07:31 +0000] "GET /glossary/ai-crawlers HTTP/1.1" 200 41000 "-" "Mozilla/5.0 (compatible; Perplexity-User/1.0; +https://perplexity.ai/perplexity-user)"
52.70.240.171 - - [21/Sep/2026:08:09:12 +0000] "GET /robots.txt HTTP/1.1" 200 812 "-" "Mozilla/5.0 (compatible; GPTBot/1.2; +https://openai.com/gptbot)"
52.70.240.171 - - [21/Sep/2026:08:09:13 +0000] "GET /blog/ai-crawlers HTTP/1.1" 200 51234 "-" "Mozilla/5.0 (compatible; GPTBot/1.2; +https://openai.com/gptbot)"
18.204.11.9 - - [21/Sep/2026:08:11:44 +0000] "GET / HTTP/1.1" 200 60120 "-" "CCBot/2.0 (https://commoncrawl.org/faq/)"
91.200.12.4 - - [21/Sep/2026:08:12:00 +0000] "GET /pricing HTTP/1.1" 200 22110 "https://www.google.com/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36"
`;

interface BotStat {
  bot: Bot;
  hits: number;
  paths: Map<string, number>;
  statuses: Map<string, number>;
}

const TOKEN_RE = new RegExp(
  `(${ALL_BOTS.map((b) => b.token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
  "i",
);

function analyze(text: string) {
  const rows = text.split(/\r?\n/).filter((l) => l.trim());
  const stats = new Map<string, BotStat>();
  let botHits = 0;
  for (const line of rows) {
    const m = line.match(TOKEN_RE);
    if (!m) continue;
    const bot = ALL_BOTS.find((b) => b.token.toLowerCase() === m[1].toLowerCase());
    if (!bot) continue;
    botHits += 1;
    const s = stats.get(bot.token) ?? { bot, hits: 0, paths: new Map(), statuses: new Map() };
    s.hits += 1;
    const path =
      line.match(/"(?:GET|POST|HEAD|PUT|OPTIONS)\s+(\S+)/i)?.[1] ??
      line.match(/(?:^|\s)(\/[^\s"]*)/)?.[1] ??
      "(unknown)";
    s.paths.set(path, (s.paths.get(path) ?? 0) + 1);
    const status = line.match(/HTTP\/[\d.]+"\s+(\d{3})/)?.[1] ?? line.match(/\s(\d{3})\s+\d+/)?.[1];
    if (status) s.statuses.set(status, (s.statuses.get(status) ?? 0) + 1);
    stats.set(bot.token, s);
  }
  const list = [...stats.values()].sort((a, b) => b.hits - a.hits);
  return { total: rows.length, botHits, list };
}

function top(map: Map<string, number>, n: number) {
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}

export function AiCrawlerLogAnalyzer() {
  const [log, setLog] = useState("");
  const result = useMemo(() => analyze(log), [log]);
  const ai = result.list.filter((s) => !["Googlebot", "Bingbot"].includes(s.bot.token));
  const aiHits = ai.reduce((n, s) => n + s.hits, 0);
  const userHits = result.list.filter((s) => s.bot.role === "user").reduce((n, s) => n + s.hits, 0);
  const max = result.list[0]?.hits ?? 1;

  return (
    <Workbench
      ratio="wide-output"
      sticky={false}
      input={
        <Pane
          title="Access log"
          description="Apache, Nginx, Cloudflare or Vercel lines. Nothing leaves your browser."
          actions={<GhostButton onClick={() => setLog(SAMPLE)}>Load sample</GhostButton>}
        >
          <TextArea
            value={log}
            onChange={(e) => setLog(e.target.value)}
            placeholder={
              '66.249.66.1 - - [21/Sep/2026:08:01:12 +0000] "GET /blog/post HTTP/1.1" 200 51234 "-" "Mozilla/5.0 (compatible; GPTBot/1.2; +https://openai.com/gptbot)"'
            }
            className="min-h-[22rem]"
            mono
            spellCheck={false}
          />
          <p className="text-xs text-muted-foreground">
            {result.total.toLocaleString()} line{result.total === 1 ? "" : "s"} pasted
          </p>
        </Pane>
      }
      output={
        !log.trim() ? (
          <EmptyState
            title="Paste log lines to begin"
            body="You'll see every AI crawler that visited, its share of requests, and the pages it fetched most."
          />
        ) : result.botHits === 0 ? (
          <EmptyState
            title="No known crawlers in these lines"
            body="We look for the user-agent tokens of 17 AI and search bots. Try pasting more lines or a different day."
          />
        ) : (
          <>
            <StatGrid cols={4}>
              <Stat value={result.total.toLocaleString()} label="Requests" />
              <Stat
                value={aiHits.toLocaleString()}
                label="From AI bots"
                hint={`${Math.round((aiHits / result.total) * 100)}% of all`}
              />
              <Stat
                value={userHits.toLocaleString()}
                label="Live-fetch hits"
                hint="Real conversations"
              />
              <Stat value={ai.length} label="Distinct bots" />
            </StatGrid>

            <Pane title="Bots, by hits" flush>
              <ul className="divide-y divide-border">
                {result.list.map((s) => (
                  <li key={s.bot.token} className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="min-w-0 flex-1">
                        <span className="font-mono text-[0.85rem] font-semibold text-ink">
                          {s.bot.token}
                        </span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {s.bot.vendor} · {BOT_ROLES[s.bot.role].label}
                        </span>
                      </span>
                      <span className="text-sm font-semibold tabular-nums text-ink">{s.hits}</span>
                      <span className="w-12 text-right text-xs tabular-nums text-muted-foreground">
                        {Math.round((s.hits / result.total) * 100)}%
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          s.bot.role === "user"
                            ? "bg-success"
                            : s.bot.role === "search"
                              ? "bg-volt"
                              : "bg-ink/60",
                        )}
                        style={{ width: `${(s.hits / max) * 100}%` }}
                      />
                    </div>
                    <details className="mt-2 text-xs">
                      <summary className="cursor-pointer text-muted-foreground hover:text-ink">
                        Top pages
                        {s.statuses.size
                          ? ` · statuses ${top(s.statuses, 3)
                              .map(([k, v]) => `${k}×${v}`)
                              .join(", ")}`
                          : ""}
                      </summary>
                      <ul className="mt-1.5 space-y-1">
                        {top(s.paths, 6).map(([p, n]) => (
                          <li key={p} className="flex justify-between gap-3 font-mono">
                            <span className="truncate text-ink/80">{p}</span>
                            <span className="shrink-0 tabular-nums text-muted-foreground">{n}</span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                ))}
              </ul>
            </Pane>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Green bars are live fetches: a person's question needed that page. Verify suspicious
              hits against the vendors' published IP lists — user agents are trivially faked.
            </p>
          </>
        )
      }
    />
  );
}
