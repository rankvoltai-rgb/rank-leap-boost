/**
 * The Mistral guide's typed blocks, drawn in the landing page's hairline
 * language. Mistral's mark is built from square pixels, so the guide's
 * markers are squares too: bullets, step nodes and list numbers.
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
  Target,
  X,
} from "lucide-react";
import { EvidenceBadge, Md } from "@/components/ai-seo/kit";
import { LINE, PANEL } from "@/components/landing/frame";
import type {
  Crawler,
  GuideBlock,
  Myth,
  PipelineStep,
  Requirement,
  Signal,
  Stat,
} from "@/data/ai-seo/types";
import { cn } from "@/lib/utils";

export const PARAGRAPH = "mt-6 text-[1.0625rem] leading-[1.8] text-ink/80 sm:text-[1.125rem]";

/* ---------- lists ---------- */

function List({ items, ordered }: { items: string[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className="mt-6 space-y-3.5">
      {items.map((item, i) => (
        <li
          key={item}
          className="flex gap-3.5 text-[1.0625rem] leading-[1.75] text-ink/80 sm:text-[1.125rem]"
        >
          {ordered ? (
            <span
              aria-hidden
              className="mt-[0.3rem] flex h-[1.35rem] w-[1.35rem] shrink-0 items-center justify-center rounded-[5px] bg-cta-soft font-mono text-[0.7rem] font-semibold text-cta"
            >
              {i + 1}
            </span>
          ) : (
            <span aria-hidden className="mt-[0.72rem] h-[7px] w-[7px] shrink-0 bg-brand-blue" />
          )}
          <span className="min-w-0">
            <Md text={item} />
          </span>
        </li>
      ))}
    </Tag>
  );
}

/* ---------- code ---------- */

/* Comments in robots.txt, bash and regex snippets start with "#", in HTML
   with "<!--": both are set back so the working lines read first. */
function isComment(line: string) {
  const t = line.trim();
  return t.startsWith("#") || t.startsWith("<!--");
}

function CodeBlock({ lang, code }: { lang: string; code: string }) {
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
    <div className={cn("my-8 overflow-hidden rounded-xl border", LINE, PANEL)}>
      <div className={cn("flex items-center justify-between border-b bg-white px-4 py-2", LINE)}>
        <span className="flex items-center gap-2 font-mono text-[0.72rem] font-medium text-muted-foreground">
          <span aria-hidden className="h-1.5 w-1.5 bg-brand-blue" />
          {lang}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[0.72rem] font-medium text-muted-foreground transition-colors hover:bg-ink/[0.04] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-cta" /> : <Copy className="h-3.5 w-3.5" />}
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre className="overflow-x-auto px-5 py-4 font-mono text-[0.82rem] leading-[1.75] text-ink">
        <code>
          {code.split("\n").map((line, i) => (
            <span
              key={i}
              className={cn("block whitespace-pre", isComment(line) && "text-muted-foreground")}
            >
              {line || " "}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

/* ---------- table ---------- */

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className={cn("my-8 overflow-x-auto rounded-xl border bg-white", LINE)}>
      <table className="w-full min-w-[36rem] border-collapse text-left">
        <thead>
          <tr className={cn("border-b", LINE, PANEL)}>
            {head.map((h) => (
              <th
                key={h}
                scope="col"
                className="px-4 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/[0.07]">
          {rows.map((row) => (
            <tr key={row.join("|")}>
              {row.map((cell, c) => (
                <td
                  key={c}
                  className={cn(
                    "px-4 py-3 align-top text-[0.9rem] leading-relaxed",
                    c === 0 ? "font-medium text-ink" : "text-ink/75",
                  )}
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
  note: { Icon: Info, box: "border-cta/15 bg-cta-soft/50", icon: "bg-white text-cta" },
  tip: {
    Icon: Lightbulb,
    box: "border-success/20 bg-success/[0.05]",
    icon: "bg-white text-success",
  },
  warning: {
    Icon: AlertTriangle,
    box: "border-warning/45 bg-warning/[0.08]",
    icon: "bg-white text-[oklch(0.55_0.13_65)]",
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
    <aside className={cn("my-9 rounded-xl border p-5 sm:p-6", c.box)}>
      <p className="flex items-center gap-2.5 font-semibold leading-snug text-ink">
        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-md shadow-[0_1px_2px_rgba(16,24,40,0.06)]",
            c.icon,
          )}
        >
          <c.Icon aria-hidden className="h-3.5 w-3.5" />
        </span>
        {title}
      </p>
      <p className="mt-2.5 text-[0.98rem] leading-relaxed text-ink/80">
        <Md text={text} />
      </p>
    </aside>
  );
}

/* ---------- pipeline ---------- */

/* The answer's assembly line as square nodes on a hairline. Each step pairs
   what happens with the lever a site owner holds there, where one exists. */
function Pipeline({ steps }: { steps: PipelineStep[] }) {
  return (
    <ol className={cn("my-9 overflow-hidden rounded-xl border bg-white", LINE)}>
      {steps.map((s, i) => (
        <li
          key={s.title}
          className={cn(
            "grid gap-x-4 border-b px-5 py-5 last:border-b-0 sm:grid-cols-[2rem_minmax(0,1fr)] sm:px-6",
            LINE,
          )}
        >
          <span
            aria-hidden
            className="mb-2 flex h-7 w-7 items-center justify-center rounded-[6px] bg-cta font-mono text-[0.72rem] font-semibold text-white sm:mb-0"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <p className="font-semibold leading-snug text-ink">{s.title}</p>
            <p className="mt-1.5 text-[0.96rem] leading-relaxed text-ink/75">
              <Md text={s.body} />
            </p>
            {s.lever && (
              <p className="mt-3 flex gap-2 rounded-lg bg-cta-soft px-3 py-2.5 text-[0.88rem] leading-relaxed text-ink">
                <Target aria-hidden className="mt-[0.2rem] h-3.5 w-3.5 shrink-0 text-cta" />
                <span>
                  <span className="font-semibold text-cta">Your lever: </span>
                  <Md text={s.lever} />
                </span>
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ---------- fetchers ---------- */

const ROLE: Record<Crawler["role"], string> = {
  search: "Search index",
  user: "User-triggered",
  training: "Model training",
  other: "Other",
};

const ROBOTS: Record<Crawler["robots"], { label: string; Icon: typeof Check; className: string }> =
  {
    yes: { label: "Reads robots.txt", Icon: Check, className: "text-success" },
    partial: { label: "Via Googlebot rules", Icon: Minus, className: "text-[oklch(0.55_0.13_65)]" },
    no: { label: "Skips robots.txt", Icon: X, className: "text-destructive" },
  };

const ADVICE: Record<Crawler["advice"], { label: string; className: string }> = {
  allow: { label: "Allow", className: "bg-cta text-white" },
  "your-call": { label: "Your call", className: "border border-ink/[0.12] bg-white text-ink" },
  block: { label: "Block", className: "bg-destructive/10 text-destructive" },
};

/* A ledger of everything that fetches a page on Vibe's behalf: token, job,
   how it treats robots.txt, and what to do about it. */
function Fetchers({ bots }: { bots: Crawler[] }) {
  return (
    <ul className={cn("my-9 overflow-hidden rounded-xl border bg-white", LINE)}>
      {bots.map((b) => {
        const r = ROBOTS[b.robots];
        const a = ADVICE[b.advice];
        return (
          <li key={b.token} className={cn("border-b px-5 py-4 last:border-b-0 sm:px-6", LINE)}>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <code className="font-mono text-[0.9rem] font-semibold text-ink">{b.token}</code>
              <span
                className={cn(
                  "rounded-md px-2 py-0.5 text-[0.68rem] font-semibold",
                  PANEL,
                  "text-ink/70",
                )}
              >
                {ROLE[b.role]}
              </span>
              <span
                className={cn(
                  "ml-auto rounded-md px-2.5 py-0.5 text-[0.7rem] font-semibold",
                  a.className,
                )}
              >
                {a.label}
              </span>
            </div>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-ink/75">
              <Md text={b.purpose} />
            </p>
            <p
              className={cn("mt-2 flex items-start gap-1.5 text-[0.8rem] font-medium", r.className)}
            >
              <r.Icon aria-hidden className="mt-[0.15rem] h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
              <span>
                {r.label}
                {b.robotsNote && (
                  <span className="font-normal text-muted-foreground"> · {b.robotsNote}</span>
                )}
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
    className: "border border-warning/60 bg-warning/10 text-[oklch(0.45_0.12_65)]",
  },
  "no-effect": {
    label: "No effect",
    className: "border border-ink/[0.1] bg-white text-muted-foreground",
  },
};

function Requirements({ items }: { items: Requirement[] }) {
  return (
    <dl className={cn("my-9 overflow-hidden rounded-xl border bg-white", LINE)}>
      {items.map((r) => {
        const s = STATUS[r.status];
        return (
          <div
            key={r.label}
            className={cn(
              "grid gap-x-5 gap-y-2 border-b px-5 py-4 last:border-b-0 sm:grid-cols-[12rem_minmax(0,1fr)] sm:px-6",
              LINE,
            )}
          >
            <dt className="flex items-center justify-between gap-3 sm:flex-col sm:items-start sm:justify-start">
              <span className="font-semibold leading-snug text-ink">{r.label}</span>
              <span
                className={cn(
                  "inline-flex h-5 shrink-0 items-center rounded-[5px] px-2 text-[0.62rem] font-semibold uppercase tracking-[0.1em]",
                  s.className,
                )}
              >
                {s.label}
              </span>
            </dt>
            <dd className="text-[0.94rem] leading-relaxed text-ink/75">
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
    <div className={cn("my-9 overflow-hidden rounded-xl border bg-white", LINE)}>
      <div
        className={cn(
          "-mb-px -mr-px grid grid-cols-1",
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
                className="group inline-flex items-center gap-1 text-[0.74rem] font-medium text-muted-foreground transition-colors hover:text-cta"
              >
                {s.source.name}
                <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
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
    <ol className={cn("my-9 overflow-hidden rounded-xl border bg-white", LINE)}>
      {items.map((m, i) => (
        <li
          key={m.myth}
          className={cn(
            "grid border-b last:border-b-0 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]",
            LINE,
          )}
        >
          <div className={cn("border-b p-5 sm:border-b-0 sm:border-r", LINE, PANEL)}>
            <p className="flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <span className="font-mono text-ink/40">{String(i + 1).padStart(2, "0")}</span>
              Assumption
            </p>
            <p className="mt-2 font-medium leading-snug text-ink/80 line-through decoration-ink/25">
              {m.myth}
            </p>
          </div>
          <div className="p-5">
            <p className="flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-cta">
              <Check aria-hidden className="h-3 w-3" strokeWidth={3} />
              What's true
            </p>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/80">
              <Md text={m.reality} />
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ---------- signals ---------- */

function Signals({ items }: { items: Signal[] }) {
  return (
    <ul className={cn("my-9 overflow-hidden rounded-xl border bg-white", LINE)}>
      {items.map((s) => (
        <li key={s.title} className={cn("border-b px-5 py-4 last:border-b-0 sm:px-6", LINE)}>
          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold leading-snug text-ink">{s.title}</p>
            <EvidenceBadge evidence={s.evidence} />
          </div>
          <p className="mt-1.5 text-[0.93rem] leading-relaxed text-ink/75">
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
                className="mt-11 font-display text-[1.25rem] font-medium leading-snug tracking-[-0.02em] text-ink sm:text-[1.35rem]"
              >
                {b.text}
              </h3>
            );
          case "list":
            return <List key={key} items={b.items} ordered={b.ordered} />;
          case "code":
            return <CodeBlock key={key} lang={b.lang} code={b.code} />;
          case "table":
            return <Table key={key} head={b.head} rows={b.rows} />;
          case "callout":
            return <Callout key={key} tone={b.tone} title={b.title} text={b.text} />;
          case "pipeline":
            return <Pipeline key={key} steps={b.steps} />;
          case "crawlers":
            return <Fetchers key={key} bots={b.bots} />;
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
