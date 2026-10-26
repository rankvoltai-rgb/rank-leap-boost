/**
 * The Claude guide's typed blocks, drawn for this page: prose in the reading
 * column, and the diagrams set in hairline panels so they read as part of the
 * landing frame rather than as cards dropped onto it. The crawler block is the
 * interactive robots.txt board (./robots-board).
 */
import { AlertTriangle, ArrowUpRight, Info, Lightbulb } from "lucide-react";
import type {
  Evidence,
  GuideBlock,
  Myth,
  PipelineStep,
  Requirement,
  Signal,
  Stat,
} from "@/data/ai-seo/types";
import { Md } from "@/components/ai-seo/kit";
import { plainText } from "@/lib/inline-md";
import { cn } from "@/lib/utils";
import { CodePanel } from "./code-panel";
import { RobotsBoard } from "./robots-board";

export const PROSE = "text-[1.0625rem] leading-[1.78] text-ink/80 sm:text-[1.1rem]";
const PANEL_EDGE = "rounded-xl border border-ink/[0.08] bg-white";

/* ---------- table ---------- */

function DataTable({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className={cn("overflow-x-auto", PANEL_EDGE)}>
      <table className="w-full min-w-[36rem] border-collapse text-left text-[0.9rem] leading-relaxed [overflow-wrap:normal]">
        <thead>
          <tr className="border-b border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_70%,white)]">
            {head.map((h) => (
              <th
                key={h}
                scope="col"
                className="px-4 py-2.5 text-[0.78rem] font-semibold text-ink/70"
              >
                {plainText(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/[0.06]">
          {rows.map((row, r) => (
            <tr key={r} className="align-top">
              {row.map((cell, c) => (
                <td key={c} className={cn("px-4 py-3 text-ink/75", c === 0 && "text-ink")}>
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
  note: { Icon: Info, bar: "bg-cta", icon: "text-cta" },
  tip: { Icon: Lightbulb, bar: "bg-success", icon: "text-success" },
  warning: { Icon: AlertTriangle, bar: "bg-warning", icon: "text-[oklch(0.55_0.13_65)]" },
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
        "relative overflow-hidden bg-[color-mix(in_oklab,var(--surface)_55%,white)] py-5 pl-6 pr-5 sm:pl-7",
        PANEL_EDGE,
      )}
    >
      <span aria-hidden className={cn("absolute inset-y-0 left-0 w-[3px]", c.bar)} />
      <p className="flex items-center gap-2 font-semibold leading-snug text-ink">
        <c.Icon aria-hidden className={cn("h-4 w-4 shrink-0", c.icon)} />
        {plainText(title)}
      </p>
      <p className="mt-2 text-[0.98rem] leading-relaxed text-ink/75">
        <Md text={text} />
      </p>
    </aside>
  );
}

/* ---------- pipeline: one search turn, as a trace ---------- */

function Pipeline({ steps }: { steps: PipelineStep[] }) {
  return (
    <ol className={cn("overflow-hidden", PANEL_EDGE)}>
      {steps.map((s, i) => (
        <li
          key={s.title}
          className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 border-b border-ink/[0.06] px-4 py-4 last:border-b-0 sm:grid-cols-[2.5rem_minmax(0,1fr)] sm:px-5"
        >
          <span className="relative flex justify-center">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-ink/[0.1] bg-white text-[0.78rem] font-semibold tabular-nums text-ink">
              {i + 1}
            </span>
          </span>
          <div className="min-w-0 pt-0.5">
            <p className="font-semibold leading-snug text-ink">{plainText(s.title)}</p>
            <p className="mt-1 text-[0.95rem] leading-relaxed text-ink/70">
              <Md text={s.body} />
            </p>
            {s.lever && (
              <p className="mt-2.5 rounded-lg bg-cta-soft px-3 py-2 text-[0.88rem] leading-relaxed text-ink">
                <span className="font-semibold text-cta">Your move: </span>
                <Md text={s.lever} />
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ---------- requirements: a spec sheet ---------- */

const STATUS: Record<Requirement["status"], { label: string; className: string }> = {
  required: { label: "Required", className: "bg-cta text-white" },
  helps: { label: "Helps", className: "bg-cta-soft text-cta" },
  unconfirmed: {
    label: "Unconfirmed",
    className: "bg-warning/15 text-[oklch(0.45_0.12_65)]",
  },
  "no-effect": { label: "No effect", className: "bg-ink/[0.05] text-muted-foreground" },
};

function Requirements({ items }: { items: Requirement[] }) {
  return (
    <dl className={cn("divide-y divide-ink/[0.06] overflow-hidden", PANEL_EDGE)}>
      {items.map((r) => {
        const s = STATUS[r.status];
        return (
          <div
            key={r.label}
            className="grid gap-x-5 gap-y-1.5 px-4 py-3.5 sm:grid-cols-[12.5rem_minmax(0,1fr)] sm:px-5"
          >
            <dt className="flex items-start justify-between gap-3 sm:flex-col sm:justify-start sm:gap-1.5">
              <span className="font-semibold leading-snug text-ink">{plainText(r.label)}</span>
              <span
                className={cn(
                  "inline-flex h-5 shrink-0 items-center rounded-md px-1.5 text-[0.7rem] font-semibold",
                  s.className,
                )}
              >
                {s.label}
              </span>
            </dt>
            <dd className="text-[0.93rem] leading-relaxed text-ink/70">
              <Md text={r.note} />
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

/* ---------- stats: hairline cells, each with its source ---------- */

function Stats({ items }: { items: Stat[] }) {
  return (
    <div className={cn("overflow-hidden", PANEL_EDGE)}>
      <ul className="-mb-px -mr-px grid sm:grid-cols-3">
        {items.map((s) => (
          <li key={s.label} className="flex flex-col border-b border-r border-ink/[0.07] p-5">
            <p className="font-display text-[2rem] font-medium leading-none tracking-[-0.03em] text-brand-blue">
              {s.value}
            </p>
            <p className="mt-2.5 flex-1 text-[0.88rem] leading-snug text-ink/75">
              {plainText(s.label)}
            </p>
            <a
              href={s.source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 inline-flex items-center gap-1 text-[0.75rem] font-medium text-muted-foreground transition-colors hover:text-ink"
            >
              {s.source.name}
              <ArrowUpRight
                aria-hidden
                className="h-3 w-3 transition-transform group-hover:-translate-y-px group-hover:translate-x-px"
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- myths: belief, then what's true ---------- */

function Myths({ items }: { items: Myth[] }) {
  return (
    <ul className={cn("divide-y divide-ink/[0.06] overflow-hidden", PANEL_EDGE)}>
      {items.map((m) => (
        <li key={m.myth} className="grid sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <p className="border-b border-ink/[0.06] bg-[color-mix(in_oklab,var(--surface)_55%,white)] px-4 py-4 text-[0.95rem] font-medium leading-snug text-ink/55 line-through decoration-ink/25 sm:border-b-0 sm:border-r sm:px-5">
            {plainText(m.myth)}
          </p>
          <p className="px-4 py-4 text-[0.95rem] leading-relaxed text-ink/80 sm:px-5">
            <Md text={m.reality} />
          </p>
        </li>
      ))}
    </ul>
  );
}

/* ---------- signals, with how sure anyone is ---------- */

const EVIDENCE: Record<Evidence, { label: string; title: string; className: string }> = {
  official: {
    label: "Anthropic says so",
    title: "Stated in Anthropic's own documentation",
    className: "bg-cta text-white",
  },
  observed: {
    label: "Observed in studies",
    title: "Measured in independent studies, not confirmed by Anthropic",
    className: "bg-cta-soft text-cta",
  },
  "our-read": {
    label: "Our read",
    title: "Our interpretation of the evidence",
    className: "bg-ink/[0.05] text-muted-foreground",
  },
};

function Signals({ items }: { items: Signal[] }) {
  return (
    <ul className={cn("divide-y divide-ink/[0.06] overflow-hidden", PANEL_EDGE)}>
      {items.map((s) => {
        const e = EVIDENCE[s.evidence];
        return (
          <li key={s.title} className="px-4 py-4 sm:px-5">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
              <p className="font-semibold leading-snug text-ink">{plainText(s.title)}</p>
              <span
                title={e.title}
                className={cn(
                  "inline-flex h-5 shrink-0 items-center rounded-md px-1.5 text-[0.7rem] font-semibold",
                  e.className,
                )}
              >
                {e.label}
              </span>
            </div>
            <p className="mt-1.5 text-[0.93rem] leading-relaxed text-ink/70">
              <Md text={s.body} />
            </p>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- dispatch ---------- */

export function ClaudeBlocks({ blocks, idPrefix }: { blocks: GuideBlock[]; idPrefix: string }) {
  return (
    <div className="space-y-6">
      {blocks.map((b, i) => {
        const key = `${idPrefix}-${i}`;
        switch (b.kind) {
          case "p":
            return (
              <p key={key} className={PROSE}>
                <Md text={b.text} />
              </p>
            );
          case "h3":
            return (
              <h3
                key={key}
                className="!mt-11 font-display text-[1.2rem] font-semibold leading-snug tracking-[-0.015em] text-ink sm:text-[1.3rem]"
              >
                {plainText(b.text)}
              </h3>
            );
          case "list": {
            const Tag = b.ordered ? "ol" : "ul";
            return (
              <Tag
                key={key}
                className={cn(
                  "space-y-2.5 pl-5",
                  b.ordered
                    ? "list-decimal marker:font-semibold marker:text-cta"
                    : "list-disc marker:text-cta",
                )}
              >
                {b.items.map((item) => (
                  <li key={item} className={cn(PROSE, "pl-1.5")}>
                    <Md text={item} />
                  </li>
                ))}
              </Tag>
            );
          }
          case "code":
            return <CodePanel key={key} lang={b.lang} code={b.code} />;
          case "table":
            return <DataTable key={key} head={b.head} rows={b.rows} />;
          case "callout":
            return <Callout key={key} tone={b.tone} title={b.title} text={b.text} />;
          case "pipeline":
            return <Pipeline key={key} steps={b.steps} />;
          case "crawlers":
            return <RobotsBoard key={key} bots={b.bots} />;
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
    </div>
  );
}
