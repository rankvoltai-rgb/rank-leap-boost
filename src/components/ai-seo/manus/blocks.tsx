/**
 * The Manus guide's typed blocks, drawn in the landing page's language:
 * hairlines, soft-blue selection, ink only for text. The pipeline renders as
 * the agent's own task log ("Step 3 of 6"), because that's how Manus shows
 * its work; the crawler card reads like a user-agent record.
 */
import { useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  CircleHelp,
  Copy,
  Info,
  Lightbulb,
  Minus,
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

/* The blog's reading measure and rhythm, so a guide reads like an article. */
const PARAGRAPH = "mt-5 text-[1.0625rem] leading-[1.8] text-ink/80 sm:text-[1.1rem]";

/* ---------- evidence ---------- */

const EVIDENCE: Record<Evidence, { label: string; title: string; className: string }> = {
  official: {
    label: "Official",
    title: "Stated in Manus's own documentation",
    className: "bg-cta text-white",
  },
  observed: {
    label: "Observed",
    title: "Seen in Manus's prompt, product or third-party data, not promised by Manus",
    className: "bg-cta-soft text-cta",
  },
  "our-read": {
    label: "Our read",
    title: "Our interpretation of the evidence: weigh it accordingly",
    className: "border border-ink/[0.1] bg-white text-muted-foreground",
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

function CodeBox({ lang, code }: { lang: string; code: string }) {
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
    <figure className="my-7 overflow-hidden rounded-xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <figcaption
        className={cn("flex items-center justify-between gap-3 border-b px-4 py-2", LINE, PANEL)}
      >
        <span className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          {lang}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[0.72rem] font-medium text-muted-foreground transition-colors hover:bg-white hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-cta" /> : <Copy className="h-3.5 w-3.5" />}
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </button>
      </figcaption>
      <pre className="overflow-x-auto px-4 py-4 text-[0.8rem] leading-[1.7] text-ink">
        <code className="font-mono">{code}</code>
      </pre>
    </figure>
  );
}

/* ---------- table ---------- */

function DataTable({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="my-7 overflow-x-auto rounded-xl border border-ink/[0.08]">
      <table className="w-full min-w-[34rem] border-collapse text-left text-[0.88rem] leading-relaxed">
        <thead className={PANEL}>
          <tr>
            {head.map((h) => (
              <th
                key={h}
                scope="col"
                className={cn(
                  "border-b px-4 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground",
                  LINE,
                )}
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
                  className={cn(
                    "px-4 py-3 align-top text-ink/80",
                    c === 0 && "whitespace-nowrap text-ink",
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
  note: { Icon: Info, box: "border-cta/15 bg-cta-soft", icon: "bg-white text-brand-blue" },
  tip: { Icon: Lightbulb, box: "border-ink/[0.08] bg-white", icon: "bg-cta-soft text-brand-blue" },
  warning: {
    Icon: AlertTriangle,
    box: "border-warning/45 bg-warning/[0.07]",
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
    <aside className={cn("my-8 flex gap-3.5 rounded-xl border p-5 sm:p-6", c.box)}>
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg shadow-[0_1px_2px_rgba(16,24,40,0.06)]",
          c.icon,
        )}
      >
        <c.Icon aria-hidden className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0">
        <p className="font-semibold leading-snug text-ink">{title}</p>
        <p className="mt-1.5 text-[0.97rem] leading-relaxed text-ink/80">
          <Md text={text} />
        </p>
      </div>
    </aside>
  );
}

/* ---------- pipeline, as Manus's task log ---------- */

function TaskLog({ steps }: { steps: PipelineStep[] }) {
  return (
    <ol className="my-9 overflow-hidden rounded-xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_40px_-28px_rgba(16,24,40,0.25)]">
      {steps.map((s, i) => (
        <li key={s.title} className={cn("relative border-b last:border-b-0", LINE)}>
          <div className="grid gap-x-4 px-5 py-5 sm:grid-cols-[2.25rem_minmax(0,1fr)] sm:px-6">
            <span
              aria-hidden
              className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-cta-soft font-mono text-[0.78rem] font-semibold text-cta sm:mb-0"
            >
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Step {i + 1} of {steps.length}
              </p>
              <p className="mt-1 text-[1.02rem] font-semibold leading-snug text-ink">{s.title}</p>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/75">
                <Md text={s.body} />
              </p>
              {s.lever && (
                <p
                  className={cn(
                    "mt-3.5 rounded-lg border-l-2 border-cta px-3.5 py-2.5 text-[0.9rem] leading-relaxed text-ink",
                    PANEL,
                  )}
                >
                  <span className="mr-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-cta">
                    Your move
                  </span>
                  <Md text={s.lever} />
                </p>
              )}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ---------- crawler record ---------- */

const ROLE: Record<Crawler["role"], string> = {
  search: "Search index",
  user: "User-triggered agent",
  training: "Model training",
  other: "Other",
};
const ROBOTS: Record<Crawler["robots"], string> = {
  yes: "Honors robots.txt",
  partial: "Partly honors robots.txt",
  no: "robots.txt not honored",
};
const ADVICE: Record<Crawler["advice"], string> = {
  allow: "Allow",
  "your-call": "Your call",
  block: "Block",
};

function CrawlerRecords({ bots }: { bots: Crawler[] }) {
  return (
    <div className="my-8 space-y-4">
      {bots.map((b) => (
        <article
          key={b.token}
          className="overflow-hidden rounded-xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
        >
          <header
            className={cn(
              "flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4",
              LINE,
              PANEL,
            )}
          >
            <div>
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                User-agent token
              </p>
              <p className="mt-0.5 font-mono text-[1.25rem] font-semibold tracking-tight text-ink">
                {b.token}
              </p>
            </div>
            <span className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-cta px-3 text-[0.8rem] font-semibold text-white">
              <Check aria-hidden className="h-3.5 w-3.5" />
              {ADVICE[b.advice]}
            </span>
          </header>
          <dl className={cn("grid border-b sm:grid-cols-2", LINE)}>
            <div className={cn("border-b px-5 py-3 sm:border-b-0 sm:border-r", LINE)}>
              <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Role
              </dt>
              <dd className="mt-0.5 text-[0.9rem] font-medium text-ink">{ROLE[b.role]}</dd>
            </div>
            <div className="px-5 py-3">
              <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                robots.txt
              </dt>
              <dd className="mt-0.5 text-[0.9rem] font-medium text-ink">{ROBOTS[b.robots]}</dd>
              {b.robotsNote && (
                <dd className="mt-1 text-[0.8rem] leading-relaxed text-muted-foreground">
                  {b.robotsNote}
                </dd>
              )}
            </div>
          </dl>
          <p className="px-5 py-4 text-[0.95rem] leading-relaxed text-ink/80">
            <Md text={b.purpose} />
          </p>
        </article>
      ))}
    </div>
  );
}

/* ---------- requirements ---------- */

const STATUS: Record<
  Requirement["status"],
  { label: string; Icon: typeof Check; className: string }
> = {
  required: { label: "Required", Icon: Check, className: "bg-cta text-white" },
  helps: { label: "Helps", Icon: Check, className: "bg-cta-soft text-cta" },
  unconfirmed: {
    label: "Unconfirmed",
    Icon: CircleHelp,
    className: "border border-ink/[0.1] bg-white text-muted-foreground",
  },
  "no-effect": {
    label: "No effect",
    Icon: Minus,
    className: "border border-ink/[0.1] bg-white text-muted-foreground",
  },
};

function SpecSheet({ items }: { items: Requirement[] }) {
  return (
    <ul className="my-8 overflow-hidden rounded-xl border border-ink/[0.08] bg-white">
      {items.map((r) => {
        const s = STATUS[r.status];
        return (
          <li
            key={r.label}
            className={cn(
              "grid gap-x-5 gap-y-2 border-b px-5 py-4 last:border-b-0 sm:grid-cols-[7.5rem_minmax(0,1fr)]",
              LINE,
            )}
          >
            <span
              className={cn(
                "inline-flex h-6 w-fit items-center gap-1 rounded-md px-2 text-[0.68rem] font-semibold uppercase tracking-[0.08em]",
                s.className,
              )}
            >
              <s.Icon aria-hidden className="h-3 w-3" />
              {s.label}
            </span>
            <div className="min-w-0">
              <p className="font-semibold leading-snug text-ink">{r.label}</p>
              <p className="mt-1 text-[0.92rem] leading-relaxed text-ink/75">
                <Md text={r.note} />
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- stats ---------- */

function Stats({ items }: { items: Stat[] }) {
  return (
    <div className="my-9 overflow-hidden rounded-xl border border-ink/[0.08]">
      <ul className="-mb-px -mr-px grid sm:grid-cols-3">
        {items.map((s) => (
          <li key={s.value + s.label} className={cn("border-b border-r p-5", LINE)}>
            <p className="font-display text-[2rem] font-medium leading-none tracking-[-0.03em] text-brand-blue">
              {s.value}
            </p>
            <p className="mt-2.5 text-[0.85rem] leading-snug text-ink/80">{s.label}</p>
            <a
              href={s.source.href}
              target="_blank"
              rel="noopener"
              className="mt-3 inline-flex items-center gap-1 text-[0.75rem] font-medium text-muted-foreground transition-colors hover:text-cta"
            >
              {s.source.name}
              <ArrowUpRight aria-hidden className="h-3 w-3" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- myths ---------- */

function Myths({ items }: { items: Myth[] }) {
  return (
    <ul className="my-8 space-y-3">
      {items.map((m) => (
        <li
          key={m.myth}
          className="overflow-hidden rounded-xl border border-ink/[0.08] bg-white sm:grid sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
        >
          <div
            className={cn("flex gap-2.5 border-b px-5 py-4 sm:border-b-0 sm:border-r", LINE, PANEL)}
          >
            <X aria-hidden className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <p className="text-[0.95rem] font-medium leading-snug text-ink/60 line-through decoration-ink/25">
              {m.myth}
            </p>
          </div>
          <div className="flex gap-2.5 px-5 py-4">
            <Check aria-hidden className="mt-1 h-3.5 w-3.5 shrink-0 text-cta" />
            <p className="text-[0.92rem] leading-relaxed text-ink/80">
              <Md text={m.reality} />
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ---------- signals ---------- */

function Signals({ items }: { items: Signal[] }) {
  return (
    <ul className="my-8 overflow-hidden rounded-xl border border-ink/[0.08] bg-white">
      {items.map((s) => (
        <li key={s.title} className={cn("border-b px-5 py-4 last:border-b-0", LINE)}>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <p className="font-semibold leading-snug text-ink">{s.title}</p>
            <EvidenceTag evidence={s.evidence} />
          </div>
          <p className="mt-1.5 text-[0.93rem] leading-relaxed text-ink/75">
            <Md text={s.body} />
          </p>
        </li>
      ))}
    </ul>
  );
}

/* ---------- dispatcher ---------- */

export function GuideBlockView({ block }: { block: GuideBlock }) {
  switch (block.kind) {
    case "p":
      return (
        <p className={PARAGRAPH}>
          <Md text={block.text} />
        </p>
      );
    case "h3":
      return (
        <h3 className="mt-11 font-display text-[1.3rem] font-medium leading-snug tracking-[-0.02em] text-ink sm:text-[1.4rem]">
          {block.text}
        </h3>
      );
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag className="mt-5 space-y-3">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="flex gap-3 text-[1.0625rem] leading-[1.75] text-ink/80 sm:text-[1.1rem]"
            >
              {block.ordered ? (
                <span className="mt-[0.2rem] flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-cta-soft font-mono text-[0.72rem] font-semibold text-cta">
                  {i + 1}
                </span>
              ) : (
                <span
                  aria-hidden
                  className="mt-[0.72rem] h-1.5 w-1.5 shrink-0 rounded-[2px] bg-brand-blue"
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
      return <CodeBox lang={block.lang} code={block.code} />;
    case "table":
      return <DataTable head={block.head} rows={block.rows} />;
    case "callout":
      return <Callout tone={block.tone} title={block.title} text={block.text} />;
    case "pipeline":
      return <TaskLog steps={block.steps} />;
    case "crawlers":
      return <CrawlerRecords bots={block.bots} />;
    case "requirements":
      return <SpecSheet items={block.items} />;
    case "stats":
      return <Stats items={block.items} />;
    case "myths":
      return <Myths items={block.items} />;
    case "signals":
      return <Signals items={block.items} />;
  }
}
