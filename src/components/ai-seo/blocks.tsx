/**
 * Renders a guide section's typed blocks.
 *
 * Plain prose (paragraphs, lists, code, tables) goes through the blog's own
 * renderers so a guide reads exactly like an article. The rest are the
 * diagrams a technical guide needs and an article doesn't: the retrieval
 * pipeline, the crawler table, the requirements spec sheet, study stats,
 * myths, and evidence-graded signals.
 */
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  Info,
  Lightbulb,
  Minus,
  Target,
  X,
} from "lucide-react";
import { CodeBlock, Table } from "@/components/blog/NotionBlocks";
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
import { parseInline } from "@/lib/inline-md";
import { EvidenceBadge, Md } from "./kit";

/* Matches the blog's body copy (src/components/blog/NotionBlocks.tsx). */
const PARAGRAPH = "mt-6 text-[1.0625rem] leading-[1.8] text-ink/80 sm:text-[1.125rem]";
const LIST_ITEM = "pl-1.5 text-[1.0625rem] leading-[1.75] text-ink/80 sm:text-[1.125rem]";

/* ---------- callout ---------- */

const CALLOUT = {
  note: { Icon: Info, className: "border-volt/25 bg-volt/[0.05]", icon: "text-volt" },
  tip: { Icon: Lightbulb, className: "border-success/25 bg-success/[0.05]", icon: "text-success" },
  warning: {
    Icon: AlertTriangle,
    className: "border-warning/50 bg-warning/[0.08]",
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
    <aside className={cn("my-8 flex gap-3.5 rounded-2xl border p-5 sm:p-6", c.className)}>
      <c.Icon aria-hidden className={cn("mt-0.5 h-5 w-5 shrink-0", c.icon)} />
      <div className="min-w-0">
        <p className="font-semibold text-ink">{title}</p>
        <p className="mt-1.5 text-[1rem] leading-relaxed text-ink/80">
          <Md text={text} />
        </p>
      </div>
    </aside>
  );
}

/* ---------- pipeline ---------- */

/* How the engine builds an answer, as a numbered rail. Each step says what
   happens and, where one exists, the lever a site owner holds at that step —
   the point of the diagram is to show where you can actually intervene. */
function Pipeline({ steps }: { steps: PipelineStep[] }) {
  return (
    <ol className="my-9 rounded-2xl border border-border bg-card p-5 shadow-1 sm:p-7">
      {steps.map((s, i) => (
        <li key={s.title} className="relative flex gap-4 pb-7 last:pb-0 sm:gap-5">
          {i < steps.length - 1 && (
            <span aria-hidden className="absolute bottom-0 left-[0.9rem] top-9 w-px bg-border" />
          )}
          <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background font-mono text-[0.72rem] font-semibold text-ink">
            {i + 1}
          </span>
          <div className="min-w-0 pt-0.5">
            <p className="font-semibold leading-snug text-ink">{s.title}</p>
            <p className="mt-1.5 text-[0.97rem] leading-relaxed text-ink/75">
              <Md text={s.body} />
            </p>
            {s.lever && (
              <p className="mt-3 flex gap-2 rounded-lg bg-volt/[0.06] px-3 py-2 text-[0.88rem] leading-relaxed text-ink">
                <Target aria-hidden className="mt-[0.2rem] h-3.5 w-3.5 shrink-0 text-volt" />
                <span>
                  <span className="font-semibold">Your lever: </span>
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

/* ---------- crawlers ---------- */

const ROLE: Record<Crawler["role"], string> = {
  search: "Search index",
  user: "User-triggered",
  training: "Model training",
  other: "Other",
};

const ROBOTS: Record<Crawler["robots"], { label: string; Icon: typeof Check; className: string }> =
  {
    yes: { label: "Honors robots.txt", Icon: Check, className: "text-success" },
    partial: { label: "Partly", Icon: Minus, className: "text-[oklch(0.55_0.13_65)]" },
    no: { label: "Ignores robots.txt", Icon: X, className: "text-destructive" },
  };

const ADVICE: Record<Crawler["advice"], { label: string; className: string }> = {
  allow: { label: "Allow", className: "bg-success/12 text-success" },
  "your-call": { label: "Your call", className: "bg-secondary text-ink/70" },
  block: { label: "Block", className: "bg-destructive/10 text-destructive" },
};

function Crawlers({ bots }: { bots: Crawler[] }) {
  return (
    <div className="my-9 overflow-hidden rounded-2xl border border-border bg-card shadow-1">
      <div className="hidden grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,1fr)_4.75rem] gap-4 border-b border-border bg-surface/60 px-5 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:grid">
        <span>User agent</span>
        <span>Used for</span>
        <span>robots.txt</span>
        <span className="text-right">Advice</span>
      </div>
      <ul className="divide-y divide-border">
        {bots.map((b) => {
          const r = ROBOTS[b.robots];
          const a = ADVICE[b.advice];
          return (
            <li key={b.token} className="px-5 py-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,1fr)_4.75rem]">
                <code className="min-w-0 font-mono text-[0.9rem] font-semibold text-ink">
                  {b.token}
                </code>
                <span
                  className={cn(
                    "justify-self-end rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold sm:order-last",
                    a.className,
                  )}
                >
                  {a.label}
                </span>
                <span className="text-[0.82rem] font-medium text-ink/75">{ROLE[b.role]}</span>
                <span
                  className={cn(
                    "flex items-center gap-1.5 text-[0.82rem] font-medium",
                    r.className,
                  )}
                  title={b.robotsNote}
                >
                  <r.Icon aria-hidden className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
                  {r.label}
                </span>
              </div>
              <p className="mt-2 text-[0.9rem] leading-relaxed text-muted-foreground">
                <Md text={b.purpose} />
                {b.robotsNote && <> {b.robotsNote}</>}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------- requirements ---------- */

const STATUS: Record<Requirement["status"], { label: string; className: string }> = {
  required: { label: "Required", className: "border-ink bg-ink text-background" },
  helps: { label: "Helps", className: "border-success/30 bg-success/10 text-success" },
  "no-effect": {
    label: "No effect",
    className: "border-border bg-secondary text-muted-foreground",
  },
  unconfirmed: {
    label: "Unconfirmed",
    className: "border-warning/60 bg-warning/15 text-[oklch(0.45_0.12_65)]",
  },
};

/* A spec sheet, not a to-do list: what the engine needs from a page, and how
   sure anyone is. "No effect" rows are there on purpose — they're the ones
   people waste weeks on. */
function Requirements({ items }: { items: Requirement[] }) {
  return (
    <dl className="my-9 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-1">
      {items.map((r) => {
        const s = STATUS[r.status];
        return (
          <div
            key={r.label}
            className="grid gap-x-5 gap-y-2 px-5 py-4 sm:grid-cols-[11rem_minmax(0,1fr)]"
          >
            <dt className="flex items-center justify-between gap-3 sm:flex-col sm:items-start sm:justify-start">
              <span className="font-semibold leading-snug text-ink">{r.label}</span>
              <span
                className={cn(
                  "inline-flex h-5 shrink-0 items-center rounded-full border px-2 text-[0.62rem] font-semibold uppercase tracking-[0.1em]",
                  s.className,
                )}
              >
                {s.label}
              </span>
            </dt>
            <dd className="text-[0.95rem] leading-relaxed text-ink/75">
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
    <div
      className={cn(
        "my-9 grid gap-3 sm:gap-4",
        items.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
      )}
    >
      {items.map((s) => (
        <figure
          key={s.label}
          className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-1"
        >
          <p className="font-display text-[1.9rem] font-bold leading-none tracking-tight text-ink">
            {s.value}
          </p>
          <p className="mt-2.5 flex-1 text-[0.88rem] leading-snug text-ink/75">{s.label}</p>
          <figcaption className="mt-4 border-t border-border pt-3">
            <a
              href={s.source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 text-[0.75rem] font-medium text-muted-foreground transition-colors hover:text-ink"
            >
              {s.source.name}
              <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
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
    <div className="my-9 space-y-3">
      {items.map((m) => (
        <div
          key={m.myth}
          className="grid overflow-hidden rounded-2xl border border-border bg-card shadow-1 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
        >
          <div className="border-b border-border bg-surface/60 p-5 sm:border-b-0 sm:border-r">
            <p className="flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-destructive">
              <X aria-hidden className="h-3 w-3" strokeWidth={3} />
              Myth
            </p>
            <p className="mt-2 font-medium leading-snug text-ink/80">{m.myth}</p>
          </div>
          <div className="p-5">
            <p className="flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-success">
              <Check aria-hidden className="h-3 w-3" strokeWidth={3} />
              Reality
            </p>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/80">
              <Md text={m.reality} />
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- signals ---------- */

function Signals({ items }: { items: Signal[] }) {
  return (
    <ul className="my-9 grid gap-3 sm:grid-cols-2">
      {items.map((s) => (
        <li
          key={s.title}
          className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-1"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold leading-snug text-ink">{s.title}</p>
            <EvidenceBadge evidence={s.evidence} />
          </div>
          <p className="mt-2 text-[0.93rem] leading-relaxed text-ink/75">
            <Md text={s.body} />
          </p>
        </li>
      ))}
    </ul>
  );
}

/* ---------- dispatch ---------- */

export function GuideBlocks({ blocks, idPrefix }: { blocks: GuideBlock[]; idPrefix: string }) {
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
                className="mt-11 font-display text-[1.25rem] font-semibold leading-snug tracking-tight text-ink sm:text-[1.35rem]"
              >
                {b.text}
              </h3>
            );
          case "list": {
            const Tag = b.ordered ? "ol" : "ul";
            return (
              <Tag
                key={key}
                className={cn(
                  "mt-5 space-y-2.5 pl-6",
                  b.ordered
                    ? "list-decimal marker:text-[0.95em] marker:font-semibold marker:text-volt"
                    : "list-disc marker:text-volt",
                )}
              >
                {b.items.map((item) => (
                  <li key={item} className={LIST_ITEM}>
                    <Md text={item} />
                  </li>
                ))}
              </Tag>
            );
          }
          case "code":
            return (
              <CodeBlock
                key={key}
                block={{ id: key, type: "code", language: b.lang, richText: [{ text: b.code }] }}
              />
            );
          case "table":
            return (
              <Table
                key={key}
                block={{
                  id: key,
                  type: "table",
                  hasColumnHeader: true,
                  rows: [
                    b.head.map((h) => [{ text: h }]),
                    ...b.rows.map((r) => r.map(parseInline)),
                  ],
                }}
              />
            );
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
