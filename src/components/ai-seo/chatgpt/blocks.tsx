/**
 * The ChatGPT guide's typed blocks, drawn in the landing page's language:
 * white, hairline edges, soft-blue selection, blue only where something is
 * marked or chosen. A few blocks get a ChatGPT-specific reading of their data
 * — fan-out queries render as search rows, a robots.txt is tinted by
 * directive, and the "click on arrival" record renders as a key/value sheet.
 */
import { useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  Copy,
  Info,
  Lightbulb,
  Minus,
  Search,
  X,
} from "lucide-react";
import { LINE } from "@/components/landing/frame";
import { Md } from "@/components/ai-seo/kit";
import type {
  Crawler,
  Evidence,
  GuideBlock,
  Myth,
  PipelineStep,
  Requirement,
  Signal,
  Stat,
} from "@/data/ai-seo/types";
import { cn } from "@/lib/utils";

export const PARAGRAPH = "mt-6 text-[1.0625rem] leading-[1.8] text-ink/80 sm:text-[1.125rem]";

/* ---------- evidence ---------- */

const EVIDENCE: Record<Evidence, { label: string; title: string; className: string }> = {
  official: {
    label: "Official",
    title: "Stated in OpenAI's own documentation",
    className: "bg-cta text-white",
  },
  observed: {
    label: "Observed",
    title: "Measured in independent studies, not confirmed by OpenAI",
    className: "bg-cta-soft text-cta",
  },
  "our-read": {
    label: "Our read",
    title: "Our interpretation of the evidence: weigh it accordingly",
    className: "bg-ink/[0.05] text-ink/65",
  },
};

export function EvidenceTag({ evidence }: { evidence: Evidence }) {
  const e = EVIDENCE[evidence];
  return (
    <span
      title={e.title}
      className={cn(
        "inline-flex h-5 shrink-0 items-center rounded-md px-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em]",
        e.className,
      )}
    >
      {e.label}
    </span>
  );
}

/* ---------- code ---------- */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        } catch {
          /* clipboard unavailable */
        }
      }}
      className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[0.72rem] font-medium text-muted-foreground transition-colors hover:bg-ink/[0.04] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-cta" /> : <Copy className="h-3.5 w-3.5" />}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

function Shell({
  label,
  copy,
  children,
}: {
  label: ReactNode;
  copy?: string;
  children: ReactNode;
}) {
  return (
    <figure
      className={cn(
        "my-8 overflow-hidden rounded-xl border bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]",
        LINE,
      )}
    >
      <figcaption
        className={cn(
          "flex items-center justify-between gap-3 border-b bg-ink/[0.02] py-1 pl-4 pr-1.5",
          LINE,
        )}
      >
        <span className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </span>
        {copy !== undefined && <CopyButton text={copy} />}
      </figcaption>
      {children}
    </figure>
  );
}

/* robots.txt, tinted by directive so the one line that matters reads first. */
function RobotsLine({ line }: { line: string }) {
  if (line.startsWith("#")) return <span className="text-ink/45">{line}</span>;
  const m = line.match(/^([A-Za-z-]+):\s*(.*)$/);
  if (!m) return <span>{line}</span>;
  const [, key, value] = m;
  const tone =
    key === "Allow" ? "text-cta" : key === "Disallow" ? "text-[oklch(0.55_0.17_25)]" : "text-ink";
  return (
    <span>
      <span className={cn("font-semibold", tone)}>{key}:</span>{" "}
      <span className={key === "User-agent" ? "font-semibold text-ink" : "text-ink/80"}>
        {value}
      </span>
    </span>
  );
}

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const lines = code.split("\n");

  /* Rewritten searches: one row each, the way they'd sit in a search box. */
  if (lang === "fan-out") {
    return (
      <Shell label="Rewritten searches · illustrative" copy={code}>
        <ol className="divide-y divide-ink/[0.06]">
          {lines.map((q, i) => (
            <li key={q} className="flex items-center gap-3 px-4 py-3">
              <span className="shrink-0 font-mono text-[0.68rem] font-semibold tabular-nums text-ink/35">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Search aria-hidden className="h-3.5 w-3.5 shrink-0 text-cta" />
              <code className="min-w-0 font-mono text-[0.86rem] text-ink [overflow-wrap:anywhere]">
                {q.startsWith("site:") ? (
                  <>
                    <span className="rounded bg-cta-soft px-1 py-0.5 text-cta">
                      {q.split(" ")[0]}
                    </span>{" "}
                    {q.split(" ").slice(1).join(" ")}
                  </>
                ) : (
                  q
                )}
              </code>
            </li>
          ))}
        </ol>
      </Shell>
    );
  }

  /* A record of key/value lines: rendered as a sheet, not as code. */
  const pairs = lines.map((l) => l.match(/^(\S.*?)\s{2,}(\S.*)$/));
  if (lang === "text" && pairs.every(Boolean)) {
    return (
      <Shell label="On arrival" copy={code}>
        <dl className="divide-y divide-ink/[0.06]">
          {pairs.map((m) => {
            const [, key, value] = m!;
            const [base, query] = value.split("?");
            return (
              <div
                key={key}
                className="grid gap-1 px-4 py-2.5 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-4"
              >
                <dt className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-muted-foreground sm:pt-0.5">
                  {key}
                </dt>
                <dd className="min-w-0 font-mono text-[0.86rem] text-ink [overflow-wrap:anywhere]">
                  {base}
                  {query && (
                    <span className="rounded bg-cta-soft px-1 py-0.5 text-cta">?{query}</span>
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      </Shell>
    );
  }

  return (
    <Shell label={lang} copy={code}>
      <pre className="overflow-x-auto px-4 py-4 text-[0.82rem] leading-[1.7] [overflow-wrap:normal]">
        <code className="font-mono text-ink/85">
          {lang === "robots.txt"
            ? lines.map((l, i) => (
                <span key={i} className="block min-h-[1.7em]">
                  <RobotsLine line={l} />
                </span>
              ))
            : lines.map((l, i) => (
                <span
                  key={i}
                  className={cn(
                    "block min-h-[1.7em]",
                    l.trimStart().startsWith("#") && "text-ink/45",
                  )}
                >
                  {l}
                </span>
              ))}
        </code>
      </pre>
    </Shell>
  );
}

/* ---------- table ---------- */

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className={cn("my-8 overflow-hidden rounded-xl border bg-white", LINE)}>
      <div className="overflow-x-auto [overflow-wrap:normal]">
        <table className="w-full min-w-[34rem] border-collapse text-left text-[0.9rem]">
          <thead>
            <tr className={cn("border-b bg-ink/[0.02]", LINE)}>
              {head.map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-4 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/[0.06]">
            {rows.map((r, i) => (
              <tr key={i} className="align-top">
                {r.map((c, j) => (
                  <td
                    key={j}
                    className={cn(
                      "px-4 py-3 leading-relaxed",
                      j === 0 ? "font-medium text-ink" : "text-ink/75",
                    )}
                  >
                    <Md text={c} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- callout ---------- */

const CALLOUT = {
  note: { Icon: Info, tile: "bg-cta-soft text-cta", edge: "border-cta/20" },
  tip: { Icon: Lightbulb, tile: "bg-cta-soft text-cta", edge: "border-cta/20" },
  warning: {
    Icon: AlertTriangle,
    tile: "bg-[oklch(0.95_0.05_80)] text-[oklch(0.5_0.12_65)]",
    edge: "border-[oklch(0.85_0.08_80)]",
  },
};

function Callout({
  tone,
  title,
  text,
}: {
  tone: keyof typeof CALLOUT;
  title: string;
  text: string;
}) {
  const c = CALLOUT[tone];
  return (
    <aside className={cn("my-8 flex gap-3.5 rounded-xl border bg-white p-5", c.edge)}>
      <span
        className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", c.tile)}
        aria-hidden
      >
        <c.Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0">
        <p className="font-display text-[1.02rem] font-medium tracking-[-0.01em] text-ink">
          {title}
        </p>
        <p className="mt-1.5 text-[0.98rem] leading-relaxed text-ink/75">
          <Md text={text} />
        </p>
      </div>
    </aside>
  );
}

/* ---------- pipeline ---------- */

function Pipeline({ steps }: { steps: PipelineStep[] }) {
  return (
    <ol className={cn("my-8 divide-y overflow-hidden rounded-xl border bg-white", LINE)}>
      {steps.map((s, i) => (
        <li key={s.title} className="flex gap-4 p-5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cta-soft font-mono text-[0.75rem] font-semibold text-cta">
            {i + 1}
          </span>
          <div className="min-w-0">
            <p className="font-medium text-ink">{s.title}</p>
            <p className="mt-1 text-[0.95rem] leading-relaxed text-ink/75">
              <Md text={s.body} />
            </p>
            {s.lever && (
              <p className="mt-2.5 text-[0.9rem] leading-relaxed text-ink">
                <span className="font-semibold text-cta">Your lever: </span>
                <Md text={s.lever} />
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ---------- crawlers ---------- */

const ROLE: Record<Crawler["role"], string> = {
  search: "Search inclusion",
  user: "Live fetch for a user",
  training: "Model training",
  other: "Ad review",
};

const ROBOTS: Record<Crawler["robots"], { label: string; Icon: typeof Check }> = {
  yes: { label: "Reads robots.txt", Icon: Check },
  partial: { label: "Robots.txt not guaranteed", Icon: Minus },
  no: { label: "Ignores robots.txt", Icon: X },
};

const ADVICE: Record<Crawler["advice"], { label: string; className: string }> = {
  allow: { label: "Allow", className: "bg-cta text-white" },
  "your-call": { label: "Your call", className: "bg-ink/[0.05] text-ink/70" },
  block: { label: "Block", className: "bg-[oklch(0.95_0.04_25)] text-[oklch(0.5_0.17_25)]" },
};

/* One card per user agent, with the robots.txt token as the headline: it's
   the string a reader will copy. */
function Crawlers({ bots }: { bots: Crawler[] }) {
  return (
    <ul className="my-8 grid gap-3 sm:grid-cols-2">
      {bots.map((b) => {
        const r = ROBOTS[b.robots];
        const a = ADVICE[b.advice];
        return (
          <li
            key={b.token}
            className={cn(
              "flex flex-col rounded-xl border bg-white p-5",
              b.advice === "allow" ? "border-cta/30" : LINE,
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <code className="font-mono text-[1rem] font-semibold text-ink">{b.token}</code>
                <p className="mt-0.5 text-[0.78rem] font-medium text-muted-foreground">
                  {ROLE[b.role]}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-md px-2 py-0.5 text-[0.7rem] font-semibold",
                  a.className,
                )}
              >
                {a.label}
              </span>
            </div>
            <p className="mt-3 flex-1 text-[0.9rem] leading-relaxed text-ink/75">
              <Md text={b.purpose} />
            </p>
            <p
              className={cn(
                "mt-4 flex items-start gap-1.5 border-t pt-3 text-[0.8rem] text-ink/70",
                LINE,
              )}
            >
              <r.Icon
                aria-hidden
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cta"
                strokeWidth={2.5}
              />
              <span>
                <span className="font-medium text-ink">{r.label}.</span>
                {b.robotsNote && <> {b.robotsNote}</>}
              </span>
            </p>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- requirements ---------- */

const STATUS: Record<Requirement["status"], { label: string; className: string }> = {
  required: { label: "Required", className: "bg-cta text-white" },
  helps: { label: "Helps", className: "bg-cta-soft text-cta" },
  unconfirmed: {
    label: "Unconfirmed",
    className: "bg-[oklch(0.95_0.05_80)] text-[oklch(0.45_0.12_65)]",
  },
  "no-effect": { label: "No effect", className: "bg-ink/[0.05] text-ink/55" },
};

function Requirements({ items }: { items: Requirement[] }) {
  return (
    <dl className={cn("my-8 divide-y overflow-hidden rounded-xl border bg-white", LINE)}>
      {items.map((r) => {
        const s = STATUS[r.status];
        return (
          <div
            key={r.label}
            className="grid gap-x-5 gap-y-1.5 px-5 py-4 sm:grid-cols-[12rem_minmax(0,1fr)]"
          >
            <dt className="flex items-start justify-between gap-3 sm:flex-col sm:justify-start sm:gap-2">
              <span
                className={cn(
                  "font-medium leading-snug",
                  r.status === "no-effect" ? "text-ink/60" : "text-ink",
                )}
              >
                {r.label}
              </span>
              <span
                className={cn(
                  "inline-flex h-5 shrink-0 items-center rounded-md px-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em]",
                  s.className,
                )}
              >
                {s.label}
              </span>
            </dt>
            <dd className="text-[0.93rem] leading-relaxed text-ink/75">
              <Md text={r.note} />
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

/* ---------- stats ---------- */

function Stats({ items }: { items: Stat[] }) {
  return (
    <div className="my-8 grid gap-3 sm:grid-cols-3">
      {items.map((s) => (
        <figure key={s.label} className={cn("flex flex-col rounded-xl border bg-white p-5", LINE)}>
          <p className="font-display text-[1.8rem] font-medium leading-none tracking-[-0.03em] text-ink">
            {s.value}
          </p>
          <p className="mt-2 flex-1 text-[0.86rem] leading-snug text-ink/70">{s.label}</p>
          <figcaption className={cn("mt-4 border-t pt-3", LINE)}>
            <a
              href={s.source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[0.75rem] font-medium text-muted-foreground hover:text-cta"
            >
              {s.source.name}
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/* ---------- myths ---------- */

function Myths({ items }: { items: Myth[] }) {
  return (
    <ol className={cn("my-8 divide-y overflow-hidden rounded-xl border bg-white", LINE)}>
      {items.map((m, i) => (
        <li
          key={m.myth}
          className="grid gap-3 p-5 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:gap-6"
        >
          <div className="flex gap-3">
            <span className="shrink-0 font-mono text-[0.7rem] font-semibold tabular-nums leading-[1.9] text-ink/35">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="font-medium leading-snug text-ink/55 line-through decoration-ink/25 decoration-1">
              {m.myth}
            </p>
          </div>
          <p className="pl-7 text-[0.95rem] leading-relaxed text-ink/80 sm:pl-0">
            <Md text={m.reality} />
          </p>
        </li>
      ))}
    </ol>
  );
}

/* ---------- signals ---------- */

function Signals({ items }: { items: Signal[] }) {
  return (
    <ul className="my-8 grid gap-3 sm:grid-cols-2">
      {items.map((s) => (
        <li key={s.title} className={cn("flex flex-col rounded-xl border bg-white p-5", LINE)}>
          <div className="flex items-start justify-between gap-3">
            <p className="font-display text-[1.02rem] font-medium leading-snug tracking-[-0.01em] text-ink">
              {s.title}
            </p>
            <EvidenceTag evidence={s.evidence} />
          </div>
          <p className="mt-2 text-[0.92rem] leading-relaxed text-ink/75">
            <Md text={s.body} />
          </p>
        </li>
      ))}
    </ul>
  );
}

/* ---------- dispatch ---------- */

export function Blocks({ blocks, idPrefix }: { blocks: GuideBlock[]; idPrefix: string }) {
  return (
    <>
      {blocks.map((b, i) => {
        const key = `${idPrefix}-${i}`;
        switch (b.kind) {
          case "p":
            return (
              <p key={key} className={PARAGRAPH}>
                <Md text={b.text} />
              </p>
            );
          case "h3":
            return (
              <h3
                key={key}
                className="mt-11 font-display text-[1.3rem] font-medium leading-snug tracking-[-0.02em] text-ink sm:text-[1.4rem]"
              >
                {b.text}
              </h3>
            );
          case "list": {
            const Tag = b.ordered ? "ol" : "ul";
            return (
              <Tag key={key} className="mt-6 space-y-3">
                {b.items.map((item, n) => (
                  <li
                    key={item}
                    className="flex gap-3 text-[1.0625rem] leading-[1.75] text-ink/80 sm:text-[1.125rem]"
                  >
                    {b.ordered ? (
                      <span className="mt-[0.3rem] flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cta-soft font-mono text-[0.68rem] font-semibold text-cta">
                        {n + 1}
                      </span>
                    ) : (
                      <span
                        aria-hidden
                        className="mt-[0.72rem] h-1.5 w-1.5 shrink-0 rounded-[2px] bg-cta"
                      />
                    )}
                    <span className="min-w-0">
                      <Md text={item} />
                    </span>
                  </li>
                ))}
              </Tag>
            );
          }
          case "code":
            return <CodeBlock key={key} lang={b.lang} code={b.code} />;
          case "table":
            return <Table key={key} head={b.head} rows={b.rows} />;
          case "callout":
            return <Callout key={key} tone={b.tone} title={b.title} text={b.text} />;
          case "pipeline":
            return <Pipeline key={key} steps={b.steps} />;
          case "crawlers":
            return <Crawlers key={key} bots={b.bots} />;
          case "requirements":
            return <Requirements key={key} items={b.items} />;
          case "stats":
            return <Stats key={key} items={b.items} />;
          case "myths":
            return <Myths key={key} items={b.items} />;
          case "signals":
            return <Signals key={key} items={b.items} />;
        }
      })}
    </>
  );
}
