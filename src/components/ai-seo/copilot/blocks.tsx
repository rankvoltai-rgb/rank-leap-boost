/**
 * The Copilot guide's own renderers for the typed guide blocks. Everything
 * sits on white with the landing page's hairlines: code is a light sheet
 * rather than a dark slab, tables scroll inside their own box on a phone,
 * and the retrieval steps read as a query trace with the site owner's move
 * at each step.
 */
import { useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  Copy,
  Info,
  Lightbulb,
  Minus,
  MoveRight,
  X,
} from "lucide-react";
import { Md } from "@/components/ai-seo/kit";
import { LINE, PANEL } from "@/components/landing/frame";
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

export const PROSE = "text-[1.0625rem] leading-[1.8] text-ink/80 sm:text-[1.1rem]";

/* ---------- code ---------- */

/* Comment lines are the annotations in every snippet here; they step back so
   the directives read first. */
function isComment(line: string) {
  const t = line.trimStart();
  return t.startsWith("#") || t.startsWith("<!--") || t.startsWith("//");
}

export function CodeSheet({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <figure className={cn("my-8 overflow-hidden rounded-xl border bg-white", LINE)}>
      <figcaption
        className={cn("flex items-center justify-between gap-3 border-b px-4 py-2", LINE, PANEL)}
      >
        <span className="font-mono text-[0.72rem] text-ink/55">{lang}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[0.72rem] font-medium text-ink/60 transition-colors hover:bg-ink/[0.05] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
        >
          {copied ? (
            <Check aria-hidden className="h-3.5 w-3.5 text-cta" />
          ) : (
            <Copy aria-hidden className="h-3.5 w-3.5" />
          )}
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </button>
      </figcaption>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[0.8rem] leading-6 sm:px-5 sm:text-[0.84rem]">
        <code className="block min-w-max">
          {code.split("\n").map((line, i) => (
            <span key={i} className={cn("block", isComment(line) ? "text-ink/45" : "text-ink/90")}>
              {line || " "}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}

/* ---------- table ---------- */

/* Five columns don't fit a reading column, and scrolling sideways through a
   comparison hides half of it. Wide tables become records instead: one
   block per row, the first cell as its title, the rest as labelled pairs. */
function Records({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className={cn("my-8 overflow-hidden rounded-xl border", LINE)}>
      {rows.map((row, r) => (
        <div key={r} className={cn("border-b last:border-b-0", LINE)}>
          <p className={cn("border-b px-4 py-2.5 font-medium text-ink sm:px-5", LINE, PANEL)}>
            <Md text={row[0]} />
          </p>
          <dl className="grid gap-x-6 gap-y-3 px-4 py-4 sm:grid-cols-2 sm:px-5">
            {row.slice(1).map((cell, c) => (
              <div key={c} className="min-w-0">
                <dt className="text-[0.75rem] text-ink/50">{head[c + 1]}</dt>
                <dd className="mt-0.5 text-[0.9rem] leading-relaxed text-ink/80">
                  <Md text={cell} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

export function DataTable({ head, rows }: { head: string[]; rows: string[][] }) {
  if (head.length >= 5) return <Records head={head} rows={rows} />;
  return (
    <div className={cn("my-8 overflow-x-auto rounded-xl border", LINE)}>
      <table
        className={cn(
          "w-full border-collapse text-left text-[0.88rem] leading-relaxed [overflow-wrap:normal]",
          head.length > 3 ? "min-w-[40rem]" : "min-w-[34rem]",
        )}
      >
        <thead className={PANEL}>
          <tr>
            {head.map((h) => (
              <th
                key={h}
                scope="col"
                className={cn("border-b px-4 py-2.5 align-bottom font-medium text-ink", LINE)}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} className={cn("border-b last:border-b-0", LINE)}>
              {row.map((cell, c) => (
                <td
                  key={c}
                  className={cn("px-4 py-3 align-top", c === 0 ? "text-ink" : "text-ink/75")}
                >
                  <Md text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- callout ---------- */

const CALLOUT = {
  note: { Icon: Info, box: "border-cta/15 bg-cta-soft", icon: "text-cta" },
  tip: { Icon: Lightbulb, box: "border-success/20 bg-success/[0.05]", icon: "text-success" },
  warning: {
    Icon: AlertTriangle,
    box: "border-warning/40 bg-warning/[0.07]",
    icon: "text-[oklch(0.55_0.13_65)]",
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
    <aside className={cn("my-8 flex gap-3.5 rounded-xl border p-5 sm:p-6", c.box)}>
      <c.Icon aria-hidden className={cn("mt-1 h-4 w-4 shrink-0", c.icon)} />
      <div className="min-w-0">
        <p className="font-display text-[1.02rem] font-medium tracking-[-0.01em] text-ink">
          {title}
        </p>
        <p className="mt-1.5 text-[0.98rem] leading-relaxed text-ink/80">
          <Md text={text} />
        </p>
      </div>
    </aside>
  );
}

/* ---------- pipeline: the query trace ---------- */

/* Copilot's path from prompt to citation is a real sequence, so the steps are
   numbered. Where a site owner can act, the step carries that move on a blue
   rule beneath it. */
function QueryTrace({ steps }: { steps: PipelineStep[] }) {
  return (
    <ol className={cn("my-9 overflow-hidden rounded-xl border", LINE)}>
      {steps.map((s, i) => (
        <li
          key={s.title}
          className={cn("grid grid-cols-[2.75rem_minmax(0,1fr)] border-b last:border-b-0", LINE)}
        >
          <div className={cn("flex justify-center border-r pt-5", LINE, PANEL)}>
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white font-mono text-[0.72rem] font-medium text-cta shadow-[0_1px_2px_rgba(16,24,40,0.08)]">
              {i + 1}
            </span>
          </div>
          <div className="min-w-0 px-4 py-4 sm:px-5">
            <p className="font-medium leading-snug text-ink">{s.title}</p>
            <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink/75">
              <Md text={s.body} />
            </p>
            {s.lever && (
              <p className="mt-3 border-l-2 border-cta pl-3 text-[0.9rem] leading-relaxed text-ink">
                <span className="font-medium text-cta">Your move: </span>
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
  search: "Search index",
  user: "User-triggered",
  training: "Model training",
  other: "Previews and ads",
};

const ROBOTS: Record<Crawler["robots"], { label: string; Icon: typeof Check }> = {
  yes: { label: "Honors robots.txt", Icon: Check },
  partial: { label: "Partly", Icon: Minus },
  no: { label: "Ignores robots.txt", Icon: X },
};

const ADVICE: Record<Crawler["advice"], { label: string; className: string }> = {
  allow: { label: "Allow", className: "bg-cta text-white" },
  "your-call": { label: "Your call", className: "bg-ink/[0.06] text-ink/75" },
  block: { label: "Block", className: "bg-destructive/10 text-destructive" },
};

function Crawlers({ bots }: { bots: Crawler[] }) {
  return (
    <ul className={cn("my-9 overflow-hidden rounded-xl border", LINE)}>
      {bots.map((b) => {
        const r = ROBOTS[b.robots];
        const a = ADVICE[b.advice];
        return (
          <li key={b.token} className={cn("border-b px-4 py-4 last:border-b-0 sm:px-5", LINE)}>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <code className="font-mono text-[0.92rem] font-medium text-ink">{b.token}</code>
              <span className="text-[0.8rem] text-ink/55">{ROLE[b.role]}</span>
              <span className="inline-flex items-center gap-1 text-[0.8rem] text-ink/55">
                <r.Icon aria-hidden className="h-3.5 w-3.5 text-cta" strokeWidth={2.5} />
                {r.label}
              </span>
              <span
                className={cn(
                  "ml-auto rounded-md px-2 py-0.5 text-[0.72rem] font-medium",
                  a.className,
                )}
              >
                {a.label}
              </span>
            </div>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-ink/70">
              <Md text={b.purpose} />
              {b.robotsNote && <> {b.robotsNote}</>}
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
  "no-effect": { label: "No effect", className: "bg-ink/[0.05] text-ink/60" },
  unconfirmed: {
    label: "Unconfirmed",
    className: "border border-dashed border-ink/25 text-ink/60",
  },
};

function Requirements({ items }: { items: Requirement[] }) {
  return (
    <dl className={cn("my-9 overflow-hidden rounded-xl border", LINE)}>
      {items.map((r) => {
        const s = STATUS[r.status];
        return (
          <div
            key={r.label}
            className={cn(
              "grid gap-x-5 gap-y-1.5 border-b px-4 py-3.5 last:border-b-0 sm:grid-cols-[12rem_minmax(0,1fr)] sm:px-5",
              LINE,
            )}
          >
            <dt className="flex items-start justify-between gap-3 sm:flex-col sm:justify-start">
              <span className="font-medium leading-snug text-ink">{r.label}</span>
              <span
                className={cn("rounded-md px-2 py-0.5 text-[0.72rem] font-medium", s.className)}
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
    <div className={cn("my-9 overflow-hidden rounded-xl border", LINE)}>
      <div
        className={cn(
          "-mb-px -mr-px grid",
          items.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
        )}
      >
        {items.map((s) => (
          <figure key={s.label} className={cn("flex flex-col border-b border-r p-5", LINE)}>
            <p className="font-display text-[2rem] font-medium leading-none tracking-[-0.03em] text-brand-blue">
              {s.value}
            </p>
            <p className="mt-3 flex-1 text-[0.86rem] leading-snug text-ink/75">{s.label}</p>
            <figcaption className="mt-4">
              <a
                href={s.source.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1 text-[0.75rem] font-medium text-ink/55 transition-colors hover:text-cta"
              >
                {s.source.name}
                <ArrowUpRight aria-hidden className="h-3 w-3" />
              </a>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

/* ---------- myths ---------- */

function Myths({ items }: { items: Myth[] }) {
  return (
    <ul className={cn("my-9 overflow-hidden rounded-xl border", LINE)}>
      {items.map((m) => (
        <li
          key={m.myth}
          className={cn(
            "grid border-b last:border-b-0 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]",
            LINE,
          )}
        >
          <div className={cn("border-b p-4 sm:border-b-0 sm:border-r sm:p-5", LINE, PANEL)}>
            <p className="flex items-center gap-1.5 text-[0.75rem] font-medium text-ink/50">
              <X aria-hidden className="h-3 w-3" strokeWidth={2.5} />
              The assumption
            </p>
            <p className="mt-1.5 leading-snug text-ink/70">{m.myth}</p>
          </div>
          <div className="p-4 sm:p-5">
            <p className="flex items-center gap-1.5 text-[0.75rem] font-medium text-cta">
              <MoveRight aria-hidden className="h-3 w-3" strokeWidth={2.5} />
              What's actually true
            </p>
            <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink/80">
              <Md text={m.reality} />
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ---------- signals ---------- */

const EVIDENCE: Record<Evidence, { label: string; title: string; className: string }> = {
  official: {
    label: "Microsoft says",
    title: "Stated in Microsoft's own documentation",
    className: "bg-cta-soft text-cta",
  },
  observed: {
    label: "Observed",
    title: "Measured in independent studies, not confirmed by Microsoft",
    className: "bg-ink/[0.05] text-ink/70",
  },
  "our-read": {
    label: "Our read",
    title: "Our interpretation of the evidence: weigh it accordingly",
    className: "border border-dashed border-ink/25 text-ink/60",
  },
};

export function EvidenceTag({ evidence }: { evidence: Evidence }) {
  const e = EVIDENCE[evidence];
  return (
    <span
      title={e.title}
      className={cn("shrink-0 rounded-md px-2 py-0.5 text-[0.72rem] font-medium", e.className)}
    >
      {e.label}
    </span>
  );
}

function Signals({ items }: { items: Signal[] }) {
  return (
    <div className={cn("my-9 overflow-hidden rounded-xl border", LINE)}>
      <ul className="-mb-px -mr-px grid sm:grid-cols-2">
        {items.map((s) => (
          <li key={s.title} className={cn("flex flex-col border-b border-r p-5", LINE)}>
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium leading-snug text-ink">{s.title}</p>
              <EvidenceTag evidence={s.evidence} />
            </div>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-ink/75">
              <Md text={s.body} />
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- dispatch ---------- */

export function CopilotBlocks({ blocks, idPrefix }: { blocks: GuideBlock[]; idPrefix: string }) {
  return (
    <>
      {blocks.map((b, i) => {
        const key = `${idPrefix}-${i}`;
        switch (b.kind) {
          case "p":
            return (
              <p key={key} className={cn("mt-6", PROSE)}>
                <Md text={b.text} />
              </p>
            );
          case "h3":
            return (
              <h3
                key={key}
                className="mt-12 font-display text-[1.25rem] font-medium leading-snug tracking-[-0.02em] text-ink sm:text-[1.35rem]"
              >
                {b.text}
              </h3>
            );
          case "list":
            return b.ordered ? (
              <ol key={key} className="mt-6 space-y-3">
                {b.items.map((item, n) => (
                  <li key={item} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-2">
                    <span className="mt-[0.3rem] flex h-5 w-5 items-center justify-center rounded-md bg-cta-soft font-mono text-[0.68rem] font-medium text-cta">
                      {n + 1}
                    </span>
                    <span className={PROSE}>
                      <Md text={item} />
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <ul key={key} className="mt-6 space-y-2.5">
                {b.items.map((item) => (
                  <li key={item} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-2">
                    <span aria-hidden className="mt-[0.8rem] h-1.5 w-1.5 rounded-full bg-cta" />
                    <span className={PROSE}>
                      <Md text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            );
          case "code":
            return <CodeSheet key={key} lang={b.lang} code={b.code} />;
          case "table":
            return <DataTable key={key} head={b.head} rows={b.rows} />;
          case "callout":
            return <Callout key={key} tone={b.tone} title={b.title} text={b.text} />;
          case "pipeline":
            return <QueryTrace key={key} steps={b.steps} />;
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
