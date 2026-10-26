/**
 * The Meta AI guide's typed blocks, drawn for this page: hairline panels on
 * white, soft-blue for the one thing to notice, and the crawler table as a
 * working switchboard. Tool names in the retrieval trace (browser.search,
 * meta_1p.content_search…) are set in mono, since they're the real names
 * Meta's harness uses.
 */
import type { ReactNode } from "react";
import { AlertTriangle, ArrowUpRight, Info, Lightbulb, Target } from "lucide-react";
import type { GuideBlock, PipelineStep, Requirement, Signal, Stat } from "@/data/ai-seo/types";
import { EvidenceBadge, Md } from "@/components/ai-seo/kit";
import { LINE, PANEL } from "@/components/landing/frame";
import { cn } from "@/lib/utils";
import { CodePanel } from "./CodePanel";
import { CrawlerSwitchboard } from "./CrawlerSwitchboard";

export const PROSE = "text-[1.0625rem] leading-[1.8] text-ink/80 sm:text-[1.125rem]";

/* ---------- table ---------- */

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className={cn("my-8 overflow-x-auto rounded-xl border bg-white", LINE)}>
      <table
        className={cn(
          "w-full border-collapse text-left text-[0.88rem]",
          head.length > 2 ? "min-w-[38rem]" : "min-w-[30rem]",
        )}
      >
        <thead className={PANEL}>
          <tr className={cn("border-b", LINE)}>
            {head.map((h) => (
              <th
                key={h}
                scope="col"
                className="px-4 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/[0.07]">
          {rows.map((row, r) => (
            <tr key={r} className="align-top">
              {row.map((cell, c) =>
                c === 0 ? (
                  <th
                    key={c}
                    scope="row"
                    className="w-[24%] px-4 py-3 font-semibold leading-snug text-ink"
                  >
                    <Md text={cell} />
                  </th>
                ) : (
                  <td key={c} className="px-4 py-3 leading-relaxed text-ink/75">
                    <Md text={cell} />
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- callout ---------- */

const CALLOUT = {
  note: { Icon: Info, rail: "bg-cta", icon: "text-cta" },
  tip: { Icon: Lightbulb, rail: "bg-cta", icon: "text-cta" },
  warning: {
    Icon: AlertTriangle,
    rail: "bg-[oklch(0.75_0.14_70)]",
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
    <aside className={cn("relative my-9 overflow-hidden rounded-xl border bg-white", LINE)}>
      <span aria-hidden className={cn("absolute inset-y-0 left-0 w-[3px]", c.rail)} />
      {/* The icon sits beside the title; on a phone the body runs the full
          width under both, on wider screens it lines up with the title. */}
      <div className="px-5 py-4 sm:px-6 sm:py-5">
        <p className="flex items-start gap-2.5 font-semibold leading-snug text-ink">
          <c.Icon aria-hidden className={cn("mt-0.5 h-[1.1rem] w-[1.1rem] shrink-0", c.icon)} />
          {title}
        </p>
        <p className="mt-1.5 text-[0.98rem] leading-relaxed text-ink/75 sm:pl-[1.75rem]">
          <Md text={text} />
        </p>
      </div>
    </aside>
  );
}

/* ---------- retrieval trace ---------- */

const TOOL = /([a-z0-9_]+\.[a-z_]+)/g;

/** A step title with Meta's tool names in mono. */
function TraceTitle({ title }: { title: string }) {
  const parts = title.split(TOOL);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <code
            key={i}
            className="rounded-md bg-cta-soft px-1.5 py-0.5 font-mono text-[0.86em] font-semibold text-cta"
          >
            {part}
          </code>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function Trace({ steps }: { steps: PipelineStep[] }) {
  return (
    <ol className={cn("my-9 overflow-hidden rounded-xl border bg-white", LINE)}>
      {steps.map((s, i) => (
        <li
          key={s.title}
          className={cn("relative flex gap-4 px-4 py-5 sm:px-6", i > 0 && "border-t", LINE)}
        >
          <div className="flex flex-col items-center">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-ink/[0.08] bg-white font-mono text-[0.7rem] font-semibold text-ink/70 shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
              {String(i + 1).padStart(2, "0")}
            </span>
            {i < steps.length - 1 && (
              <span aria-hidden className="mt-2 w-px flex-1 bg-ink/[0.08]" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold leading-snug text-ink">
              <TraceTitle title={s.title} />
            </p>
            <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink/72">
              <Md text={s.body} />
            </p>
            {s.lever && (
              <p
                className={cn(
                  "mt-3 flex gap-2 rounded-lg px-3 py-2 text-[0.88rem] leading-relaxed text-ink",
                  PANEL,
                )}
              >
                <Target aria-hidden className="mt-[0.22rem] h-3.5 w-3.5 shrink-0 text-cta" />
                <span>
                  <span className="font-semibold">Your move: </span>
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

/* ---------- requirements ---------- */

const STATUS: Record<Requirement["status"], { label: string; className: string }> = {
  required: { label: "Required", className: "bg-cta text-white" },
  helps: { label: "Helps", className: "bg-cta-soft text-cta" },
  unconfirmed: {
    label: "Unconfirmed",
    className: "bg-[oklch(0.95_0.05_85)] text-[oklch(0.45_0.1_70)]",
  },
  "no-effect": { label: "No effect", className: "bg-ink/[0.05] text-ink/55" },
};

function Requirements({ items }: { items: Requirement[] }) {
  return (
    <dl
      className={cn(
        "my-9 divide-y divide-ink/[0.07] overflow-hidden rounded-xl border bg-white",
        LINE,
      )}
    >
      {items.map((r) => {
        const s = STATUS[r.status];
        return (
          <div
            key={r.label}
            className="grid gap-x-5 gap-y-1.5 px-4 py-3.5 sm:grid-cols-[12rem_minmax(0,1fr)] sm:px-5"
          >
            <dt className="flex items-start justify-between gap-3 sm:flex-col sm:justify-start sm:gap-1.5">
              <span className="font-semibold leading-snug text-ink">{r.label}</span>
              <span
                className={cn(
                  "inline-flex h-5 shrink-0 items-center rounded-full px-2 text-[0.6rem] font-semibold uppercase tracking-[0.1em]",
                  s.className,
                )}
              >
                {s.label}
              </span>
            </dt>
            <dd className="text-[0.93rem] leading-relaxed text-ink/72">
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
      <ul
        className={cn(
          "-mb-px -mr-px grid",
          items.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
        )}
      >
        {items.map((s) => (
          <li key={s.label} className={cn("flex flex-col border-b border-r p-5", LINE)}>
            <p className="font-display text-[2.4rem] font-medium leading-none tracking-[-0.03em] text-brand-blue">
              {s.value}
            </p>
            <p className="mt-3 flex-1 text-[0.9rem] leading-snug text-ink/75">{s.label}</p>
            <a
              href={s.source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 inline-flex w-fit items-center gap-1 text-[0.74rem] font-medium text-muted-foreground transition-colors hover:text-cta"
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

/* ---------- signals ---------- */

function Signals({ items }: { items: Signal[] }) {
  return (
    <div className={cn("my-9 overflow-hidden rounded-xl border bg-white", LINE)}>
      <ul className="-mb-px -mr-px grid sm:grid-cols-2">
        {items.map((s) => (
          <li key={s.title} className={cn("flex flex-col border-b border-r p-5", LINE)}>
            <div className="flex items-start justify-between gap-3">
              <p className="font-semibold leading-snug text-ink">{s.title}</p>
              <EvidenceBadge evidence={s.evidence} />
            </div>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-ink/72">
              <Md text={s.body} />
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- dispatch ---------- */

export function MetaBlocks({ blocks, idPrefix }: { blocks: GuideBlock[]; idPrefix: string }) {
  return (
    <>
      {blocks.map((b, i): ReactNode => {
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
                className="mt-11 font-display text-[1.3rem] font-medium leading-snug tracking-[-0.02em] text-ink sm:text-[1.4rem]"
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
                    ? "list-decimal marker:font-semibold marker:text-cta"
                    : "list-disc marker:text-cta",
                )}
              >
                {b.items.map((item) => (
                  <li key={item} className={cn("pl-1.5", PROSE, "leading-[1.7]")}>
                    <Md text={item} />
                  </li>
                ))}
              </Tag>
            );
          }
          case "code":
            return <CodePanel key={key} lang={b.lang} code={b.code} />;
          case "table":
            return <Table key={key} head={b.head} rows={b.rows} />;
          case "callout":
            return <Callout key={key} tone={b.tone} title={b.title} text={b.text} />;
          case "pipeline":
            return <Trace key={key} steps={b.steps} />;
          case "crawlers":
            return <CrawlerSwitchboard key={key} bots={b.bots} />;
          case "requirements":
            return <Requirements key={key} items={b.items} />;
          case "stats":
            return <Stats key={key} items={b.items} />;
          case "signals":
            return <Signals key={key} items={b.items} />;
          case "myths":
            return (
              <div key={key} className="my-9 space-y-3">
                {b.items.map((m) => (
                  <Callout key={m.myth} tone="note" title={m.myth} text={m.reality} />
                ))}
              </div>
            );
        }
      })}
    </>
  );
}
