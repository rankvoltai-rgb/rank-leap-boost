/**
 * The DeepSeek guide's typed blocks, drawn in the landing page's hairline
 * language: prose in the reading column, and the technical pieces (the agent
 * pipeline, crawler cards, study stats, evidence-graded signals, the "now out
 * of date" pairs) as ruled cells rather than floating cards.
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

const PARAGRAPH = "mt-5 text-[1.0625rem] leading-[1.8] text-ink/80 sm:text-[1.1rem]";
const RULE = "border-ink/[0.08]";

/* ---------- evidence ---------- */

const EVIDENCE: Record<Evidence, { label: string; title: string; className: string }> = {
  official: {
    label: "Official",
    title: "Stated in DeepSeek's own documentation",
    className: "bg-cta-soft text-cta",
  },
  observed: {
    label: "Observed",
    title: "Measured by independent researchers, not confirmed by DeepSeek",
    className: "bg-success/10 text-success",
  },
  "our-read": {
    label: "Our read",
    title: "Our interpretation of the evidence — weigh it accordingly",
    className: "bg-ink/[0.05] text-ink/60",
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

function CodePanel({ lang, code }: { lang: string; code: string }) {
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
    <figure
      className={cn(
        "my-7 overflow-hidden rounded-xl border bg-[color-mix(in_oklab,var(--surface)_60%,white)]",
        RULE,
      )}
    >
      <figcaption
        className={cn("flex items-center justify-between border-b bg-white px-4 py-1.5", RULE)}
      >
        <span className="font-mono text-[0.72rem] font-medium text-muted-foreground">{lang}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[0.72rem] font-medium text-muted-foreground transition-colors hover:bg-ink/[0.04] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-success" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </button>
      </figcaption>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[0.8rem] leading-6 text-ink/85 sm:px-5">
        <code>
          {code.split("\n").map((line, i) => (
            <span
              key={i}
              className={cn("block", line.trimStart().startsWith("#") && "text-ink/45")}
            >
              {line || " "}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}

/* ---------- table ---------- */

/* A ruled table on wider screens; on a phone each row folds into a stacked
   card, its column names shown as small labels, so nothing scrolls sideways. */
function DataTable({ head, rows }: { head: string[]; rows: string[][] }) {
  const wide = head.length >= 3;
  return (
    <div className={cn("my-7 rounded-xl border bg-white sm:overflow-x-auto", RULE)}>
      <table
        className={cn(
          "w-full border-collapse text-left text-[0.88rem] max-sm:block",
          wide ? "sm:min-w-[38rem]" : "sm:min-w-[30rem]",
        )}
      >
        <thead className="max-sm:hidden">
          <tr className={cn("border-b bg-[color-mix(in_oklab,var(--surface)_60%,white)]", RULE)}>
            {head.map((h, i) => (
              <th
                key={i}
                scope="col"
                className="px-4 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/[0.06] max-sm:block">
          {rows.map((row, r) => (
            <tr key={r} className="align-top max-sm:block max-sm:px-4 max-sm:py-3.5">
              {row.map((cell, c) => (
                <td
                  key={c}
                  data-label={c > 0 ? head[c] : undefined}
                  className={cn(
                    "px-4 py-3 leading-relaxed max-sm:block max-sm:px-0 max-sm:py-1",
                    c === 0 ? "font-medium text-ink" : "text-ink/75",
                    c > 0 &&
                      head[c] &&
                      "max-sm:before:mb-0.5 max-sm:before:block max-sm:before:text-[0.6rem] max-sm:before:font-semibold max-sm:before:uppercase max-sm:before:tracking-[0.1em] max-sm:before:text-muted-foreground max-sm:before:content-[attr(data-label)]",
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
  note: { Icon: Info, tile: "bg-cta-soft text-cta", label: "Note" },
  tip: { Icon: Lightbulb, tile: "bg-success/10 text-success", label: "In practice" },
  warning: {
    Icon: AlertTriangle,
    tile: "bg-warning/20 text-[oklch(0.5_0.13_65)]",
    label: "Careful",
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
    <aside
      className={cn(
        "my-8 rounded-xl border bg-[color-mix(in_oklab,var(--surface)_45%,white)] p-5 sm:p-6",
        RULE,
      )}
    >
      <div className="flex items-center gap-2.5">
        <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg", c.tile)}>
          <c.Icon aria-hidden className="h-3.5 w-3.5" />
        </span>
        <p className="font-semibold leading-snug text-ink">{title}</p>
      </div>
      <p className="mt-3 text-[0.98rem] leading-relaxed text-ink/75">
        <Md text={text} />
      </p>
    </aside>
  );
}

/* ---------- pipeline ---------- */

/* The search agent's steps as a rail of numbered nodes, each with the lever
   a site owner holds at that step. */
function Pipeline({ steps }: { steps: PipelineStep[] }) {
  return (
    <ol className={cn("my-8 overflow-hidden rounded-xl border bg-white", RULE)}>
      {steps.map((s, i) => (
        <li
          key={s.title}
          className={cn(
            "grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-4 px-4 py-5 sm:grid-cols-[2.5rem_minmax(0,1fr)] sm:px-6",
            i > 0 && "border-t border-ink/[0.06]",
          )}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink/[0.08] bg-[color-mix(in_oklab,var(--surface)_60%,white)] font-mono text-[0.78rem] font-semibold text-cta">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <p className="pt-1.5 font-semibold leading-snug text-ink">{s.title}</p>
            <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink/75">
              <Md text={s.body} />
            </p>
            {s.lever && (
              <p className="mt-3 flex gap-2 rounded-lg bg-cta-soft px-3 py-2 text-[0.88rem] leading-relaxed text-ink">
                <Target aria-hidden className="mt-[0.22rem] h-3.5 w-3.5 shrink-0 text-cta" />
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

/* ---------- crawlers ---------- */

const ROLE: Record<Crawler["role"], string> = {
  search: "Search index",
  user: "User-triggered",
  training: "Model training",
  other: "Other",
};

const ROBOTS: Record<Crawler["robots"], { label: string; Icon: typeof Check }> = {
  yes: { label: "Honors robots.txt", Icon: Check },
  partial: { label: "Partly honors robots.txt", Icon: Minus },
  no: { label: "Ignores robots.txt", Icon: X },
};

const ADVICE: Record<Crawler["advice"], string> = {
  allow: "Allow",
  "your-call": "Your call",
  block: "Block",
};

function Crawlers({ bots }: { bots: Crawler[] }) {
  return (
    <ul
      className={cn(
        "my-8 grid gap-px overflow-hidden rounded-xl border bg-ink/[0.07] sm:grid-cols-2",
        RULE,
      )}
    >
      {bots.map((b) => {
        const r = ROBOTS[b.robots];
        return (
          <li key={b.token} className="flex flex-col bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <code className="font-mono text-[1rem] font-semibold text-ink">{b.token}</code>
              <span className="rounded-md bg-ink/[0.05] px-2 py-0.5 text-[0.7rem] font-semibold text-ink/70">
                {ADVICE[b.advice]}
              </span>
            </div>
            <p className="mt-1 text-[0.75rem] font-medium uppercase tracking-[0.1em] text-muted-foreground">
              {ROLE[b.role]}
            </p>
            <p className="mt-3 flex-1 text-[0.9rem] leading-relaxed text-ink/75">
              <Md text={b.purpose} />
            </p>
            <p className="mt-4 flex items-start gap-1.5 border-t border-ink/[0.06] pt-3 text-[0.8rem] leading-snug text-ink/70">
              <r.Icon aria-hidden className="mt-[0.1rem] h-3.5 w-3.5 shrink-0 text-cta" />
              <span>
                <span className="font-semibold text-ink">{r.label}.</span>
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
  "no-effect": { label: "No effect", className: "bg-ink/[0.05] text-ink/60" },
  unconfirmed: { label: "Unconfirmed", className: "bg-warning/20 text-[oklch(0.45_0.12_65)]" },
};

function Requirements({ items }: { items: Requirement[] }) {
  return (
    <dl className={cn("my-8 divide-y divide-ink/[0.06] overflow-hidden rounded-xl border", RULE)}>
      {items.map((r) => {
        const s = STATUS[r.status];
        return (
          <div key={r.label} className="grid gap-2 bg-white px-5 py-4 sm:grid-cols-[11rem_1fr]">
            <dt className="flex items-center justify-between gap-3 sm:flex-col sm:items-start">
              <span className="font-semibold text-ink">{r.label}</span>
              <span
                className={cn(
                  "rounded-md px-1.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em]",
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
    <div
      className={cn(
        "my-8 grid gap-px overflow-hidden rounded-xl border bg-ink/[0.07]",
        items.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
        RULE,
      )}
    >
      {items.map((s) => (
        <figure key={s.label} className="flex flex-col bg-white p-5">
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
  );
}

/* ---------- out-of-date assumptions ---------- */

function Myths({ items }: { items: Myth[] }) {
  return (
    <ol className={cn("my-8 overflow-hidden rounded-xl border", RULE)}>
      {items.map((m, i) => (
        <li
          key={m.myth}
          className={cn(
            "grid bg-white sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]",
            i > 0 && "border-t border-ink/[0.06]",
          )}
        >
          <div className="border-b border-ink/[0.06] bg-[color-mix(in_oklab,var(--surface)_50%,white)] p-5 sm:border-b-0 sm:border-r">
            <p className="text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Assumed
            </p>
            <p className="mt-1.5 font-medium leading-snug text-ink/60 line-through decoration-ink/25">
              {m.myth}
            </p>
          </div>
          <div className="p-5">
            <p className="text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-cta">Now</p>
            <p className="mt-1.5 text-[0.94rem] leading-relaxed text-ink/80">
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
    <ul
      className={cn(
        "my-8 grid gap-px overflow-hidden rounded-xl border bg-ink/[0.07] sm:grid-cols-2",
        RULE,
      )}
    >
      {items.map((s) => (
        <li key={s.title} className="flex flex-col items-start bg-white p-5">
          <EvidenceTag evidence={s.evidence} />
          <p className="mt-3 font-semibold leading-snug text-ink">{s.title}</p>
          <p className="mt-1.5 text-[0.92rem] leading-relaxed text-ink/75">
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
                className="mt-10 font-display text-[1.2rem] font-medium leading-snug tracking-[-0.015em] text-ink sm:text-[1.3rem]"
              >
                {b.text}
              </h3>
            );
          case "list":
            return b.ordered ? (
              <ol key={key} className="mt-5 space-y-3">
                {b.items.map((item, n) => (
                  <li key={item} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-3">
                    <span className="mt-[0.2rem] flex h-6 w-6 items-center justify-center rounded-md bg-cta-soft font-mono text-[0.7rem] font-semibold text-cta">
                      {n + 1}
                    </span>
                    <span className="text-[1.0625rem] leading-[1.75] text-ink/80 sm:text-[1.1rem]">
                      <Md text={item} />
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <ul key={key} className="mt-5 space-y-2.5">
                {b.items.map((item) => (
                  <li key={item} className="grid grid-cols-[1rem_minmax(0,1fr)] gap-2.5">
                    <span aria-hidden className="mt-[0.72rem] h-1.5 w-1.5 rounded-[2px] bg-cta" />
                    <span className="text-[1.0625rem] leading-[1.75] text-ink/80 sm:text-[1.1rem]">
                      <Md text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            );
          case "code":
            return <CodePanel key={key} lang={b.lang} code={b.code} />;
          case "table":
            return <DataTable key={key} head={b.head} rows={b.rows} />;
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
