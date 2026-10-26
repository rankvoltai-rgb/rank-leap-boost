/**
 * The Perplexity guide's typed blocks, drawn in the landing page's hairline
 * language: white panels on ink/7% rules, soft-blue for whatever is "yours"
 * (levers, allowed bots, the passage that gets cited), and numbered badges
 * that echo the way Perplexity numbers its sources.
 */
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  CircleHelp,
  Info,
  Lightbulb,
  MoveRight,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { EvidenceBadge, Md } from "@/components/ai-seo/kit";
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

export const PARAGRAPH = "mt-5 text-[1.0625rem] leading-[1.8] text-ink/80 sm:text-[1.1rem]";

/** The small square number that marks sources, steps and sections on this page. */
export function NumberBadge({
  n,
  tone = "soft",
  className,
}: {
  n: number | string;
  tone?: "soft" | "solid" | "ghost";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-md px-1.5 font-mono text-[0.72rem] font-semibold tabular-nums",
        tone === "solid" && "bg-cta text-white",
        tone === "soft" && "bg-cta-soft text-cta",
        tone === "ghost" && "border border-ink/[0.1] bg-white text-ink/70",
        className,
      )}
    >
      {n}
    </span>
  );
}

/* ---------- prose ---------- */

function List({ items, ordered }: { items: string[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className="mt-5 space-y-3">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex gap-3 text-[1.0625rem] leading-[1.75] text-ink/80 sm:text-[1.1rem]"
        >
          {ordered ? (
            <NumberBadge n={i + 1} className="mt-[0.2rem]" />
          ) : (
            <span aria-hidden className="mt-[0.72rem] h-1.5 w-1.5 shrink-0 rounded-[2px] bg-cta" />
          )}
          <span className="min-w-0">
            <Md text={item} />
          </span>
        </li>
      ))}
    </Tag>
  );
}

function Code({ lang, code }: { lang: string; code: string }) {
  return (
    <figure className="mt-6 overflow-hidden rounded-xl border border-ink/[0.08] bg-[color-mix(in_oklab,var(--surface)_70%,white)]">
      <figcaption className="flex items-center justify-between border-b border-ink/[0.07] px-4 py-2">
        <span className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          {lang}
        </span>
        <span aria-hidden className="flex gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-ink/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-ink/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-ink/15" />
        </span>
      </figcaption>
      <pre className="overflow-x-auto px-4 py-4 text-[0.8rem] leading-[1.7] text-ink/85 [scrollbar-width:thin]">
        <code className="font-mono">{code}</code>
      </pre>
    </figure>
  );
}

/* A real table from sm up; on a phone each row stacks into a small card, the
   column names shown above their cells, so nothing scrolls sideways. */
function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-ink/[0.08] [scrollbar-width:thin]">
      <table className="block w-full border-collapse text-left text-[0.9rem] leading-relaxed sm:table sm:min-w-[34rem]">
        <thead className="hidden sm:table-header-group">
          <tr className="bg-[color-mix(in_oklab,var(--surface)_70%,white)]">
            {head.map((h) => (
              <th
                key={h}
                scope="col"
                className="border-b border-ink/[0.07] px-4 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="block divide-y divide-ink/[0.07] sm:table-row-group">
          {rows.map((row, r) => (
            <tr key={r} className="block px-4 py-3.5 sm:table-row sm:p-0">
              {row.map((cell, c) => (
                <td
                  key={c}
                  data-label={head[c]}
                  className={cn(
                    "block align-top before:mb-0.5 before:block before:text-[0.64rem] before:font-semibold before:uppercase before:tracking-[0.12em] before:text-muted-foreground before:content-[attr(data-label)] sm:table-cell sm:px-4 sm:py-3 sm:before:content-none",
                    c === 0
                      ? "font-medium text-ink sm:min-w-[9rem] sm:font-normal"
                      : "mt-2.5 text-ink/75 sm:mt-0",
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

const CALLOUT = {
  note: { Icon: Info, label: "Note", rule: "bg-cta", icon: "bg-cta-soft text-cta" },
  tip: { Icon: Lightbulb, label: "Tip", rule: "bg-success", icon: "bg-success/10 text-success" },
  warning: {
    Icon: AlertTriangle,
    label: "Watch out",
    rule: "bg-[oklch(0.7_0.15_65)]",
    icon: "bg-[oklch(0.7_0.15_65/0.12)] text-[oklch(0.5_0.13_60)]",
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
    <aside className="relative mt-7 overflow-hidden rounded-xl border border-ink/[0.08] bg-white py-5 pl-6 pr-5 sm:pr-6">
      <span aria-hidden className={cn("absolute inset-y-0 left-0 w-[3px]", c.rule)} />
      <p className="flex items-center gap-2.5">
        <span className={cn("flex h-6 w-6 items-center justify-center rounded-md", c.icon)}>
          <c.Icon aria-hidden className="h-3.5 w-3.5" />
        </span>
        <span className="sr-only">{c.label}: </span>
        <span className="font-semibold leading-snug text-ink">{title}</span>
      </p>
      <p className="mt-2 text-[0.98rem] leading-relaxed text-ink/75">
        <Md text={text} />
      </p>
    </aside>
  );
}

/* ---------- pipeline ---------- */

/* The index's stages as a numbered rail. The lever sits on the right of each
   step on wide screens, in soft blue: the part of the pipeline that's yours. */
function Pipeline({ steps }: { steps: PipelineStep[] }) {
  return (
    <ol className="mt-7 overflow-hidden rounded-xl border border-ink/[0.08] bg-white">
      {steps.map((s, i) => (
        <li
          key={s.title}
          className={cn(
            "grid gap-3 p-5 sm:gap-5",
            s.lever && "sm:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]",
            i > 0 && "border-t border-ink/[0.07]",
          )}
        >
          <div className="flex gap-3.5">
            <NumberBadge n={i + 1} tone="ghost" className="mt-0.5" />
            <div className="min-w-0">
              <p className="font-semibold leading-snug text-ink">{s.title}</p>
              <p className="mt-1.5 text-[0.93rem] leading-relaxed text-ink/70">
                <Md text={s.body} />
              </p>
            </div>
          </div>
          {s.lever && (
            <p className="ml-[2.375rem] rounded-lg bg-cta-soft px-3.5 py-3 text-[0.88rem] leading-relaxed text-ink sm:ml-0 sm:self-start">
              <span className="mb-1 block text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-cta">
                Your lever
              </span>
              <Md text={s.lever} />
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}

/* ---------- crawlers ---------- */

const ROLE: Record<Crawler["role"], string> = {
  search: "Builds the index",
  user: "Fetches for a user",
  training: "Model training",
  other: "Other",
};

const ROBOTS: Record<Crawler["robots"], { label: string; className: string }> = {
  yes: { label: "Obeys robots.txt", className: "bg-success/10 text-success" },
  partial: { label: "Partly obeys robots.txt", className: "bg-cta-soft text-cta" },
  no: {
    label: "Generally ignores robots.txt",
    className: "bg-[oklch(0.7_0.15_65/0.12)] text-[oklch(0.5_0.13_60)]",
  },
};

const ADVICE: Record<Crawler["advice"], string> = {
  allow: "Allow",
  "your-call": "Your call",
  block: "Block",
};

function Crawlers({ bots }: { bots: Crawler[] }) {
  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
      {bots.map((b) => (
        <li
          key={b.token}
          className="flex flex-col rounded-xl border border-ink/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {ROLE[b.role]}
              </p>
              <p className="mt-1 break-all font-mono text-[1.05rem] font-semibold text-ink">
                {b.token}
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-cta px-2 py-1 text-[0.72rem] font-semibold text-white">
              <Check aria-hidden className="h-3 w-3" strokeWidth={3} />
              {ADVICE[b.advice]}
            </span>
          </div>
          <p className="mt-3 text-[0.9rem] leading-relaxed text-ink/75">
            <Md text={b.purpose} />
          </p>
          <div className="mt-auto pt-4">
            <span
              className={cn(
                "inline-flex rounded-md px-2 py-1 text-[0.74rem] font-semibold",
                ROBOTS[b.robots].className,
              )}
            >
              {ROBOTS[b.robots].label}
            </span>
            {b.robotsNote && (
              <p className="mt-2 text-[0.8rem] leading-relaxed text-muted-foreground">
                {b.robotsNote}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ---------- requirements ---------- */

const STATUS: Record<
  Requirement["status"],
  { label: string; Icon: typeof Check; className: string }
> = {
  required: { label: "Required", Icon: Check, className: "bg-cta text-white" },
  helps: { label: "Helps", Icon: ArrowUpRight, className: "bg-cta-soft text-cta" },
  unconfirmed: {
    label: "Unconfirmed",
    Icon: CircleHelp,
    className: "border border-ink/[0.1] bg-white text-ink/65",
  },
  "no-effect": {
    label: "No effect",
    Icon: X,
    className: "bg-ink/[0.05] text-ink/55",
  },
};

function Requirements({ items }: { items: Requirement[] }) {
  return (
    <ul className="mt-6 divide-y divide-ink/[0.07] overflow-hidden rounded-xl border border-ink/[0.08] bg-white">
      {items.map((r) => {
        const s = STATUS[r.status];
        return (
          <li
            key={r.label}
            className="grid gap-2 px-5 py-4 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-5"
          >
            <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-start sm:justify-start sm:gap-2">
              <p className="font-semibold leading-snug text-ink">{r.label}</p>
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-0.5 text-[0.7rem] font-semibold",
                  s.className,
                )}
              >
                <s.Icon aria-hidden className="h-3 w-3" strokeWidth={2.75} />
                {s.label}
              </span>
            </div>
            <p className="text-[0.92rem] leading-relaxed text-ink/75">
              <Md text={r.note} />
            </p>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- stats ---------- */

function Stats({ items }: { items: Stat[] }) {
  return (
    <div className="mt-7 overflow-hidden rounded-xl border border-ink/[0.08]">
      <ul className="-mb-px -mr-px grid sm:grid-cols-3">
        {items.map((s) => (
          <li key={s.value} className="flex flex-col border-b border-r border-ink/[0.07] p-5">
            <p className="font-display text-[2rem] font-medium leading-none tracking-[-0.03em] text-brand-blue">
              {s.value}
            </p>
            <p className="mt-3 text-[0.86rem] leading-relaxed text-ink/75">{s.label}</p>
            <a
              href={s.source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center gap-1 pt-4 text-[0.76rem] font-medium text-muted-foreground transition-colors hover:text-cta"
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
    <ul className="mt-6 space-y-3">
      {items.map((m) => (
        <li
          key={m.myth}
          className="grid overflow-hidden rounded-xl border border-ink/[0.08] bg-white sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
        >
          <p className="flex gap-2.5 border-b border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_70%,white)] px-5 py-4 text-[0.92rem] leading-relaxed text-ink/60 sm:border-b-0 sm:border-r">
            <X aria-hidden className="mt-[0.2rem] h-4 w-4 shrink-0 text-ink/35" />
            <span>
              <span className="sr-only">Myth: </span>
              <span className="line-through decoration-ink/25">{m.myth}</span>
            </span>
          </p>
          <p className="flex gap-2.5 px-5 py-4 text-[0.92rem] leading-relaxed text-ink/80">
            <MoveRight aria-hidden className="mt-[0.2rem] h-4 w-4 shrink-0 text-cta" />
            <span>
              <span className="sr-only">Reality: </span>
              <Md text={m.reality} />
            </span>
          </p>
        </li>
      ))}
    </ul>
  );
}

/* ---------- signals ---------- */

function Signals({ items }: { items: Signal[] }) {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-ink/[0.08]">
      <ul className="-mb-px -mr-px grid sm:grid-cols-2">
        {items.map((s) => (
          <li key={s.title} className="border-b border-r border-ink/[0.07] p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="font-semibold leading-snug text-ink">{s.title}</p>
              <EvidenceBadge evidence={s.evidence} />
            </div>
            <p className="mt-2 text-[0.9rem] leading-relaxed text-ink/75">
              <Md text={s.body} />
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- dispatch ---------- */

function Block({ block }: { block: GuideBlock }): ReactNode {
  switch (block.kind) {
    case "p":
      return (
        <p className={PARAGRAPH}>
          <Md text={block.text} />
        </p>
      );
    case "h3":
      return (
        <h3 className="mt-10 font-display text-[1.2rem] font-semibold leading-snug tracking-[-0.015em] text-ink">
          {block.text}
        </h3>
      );
    case "list":
      return <List items={block.items} ordered={block.ordered} />;
    case "code":
      return <Code lang={block.lang} code={block.code} />;
    case "table":
      return <Table head={block.head} rows={block.rows} />;
    case "callout":
      return <Callout tone={block.tone} title={block.title} text={block.text} />;
    case "pipeline":
      return <Pipeline steps={block.steps} />;
    case "crawlers":
      return <Crawlers bots={block.bots} />;
    case "requirements":
      return <Requirements items={block.items} />;
    case "stats":
      return <Stats items={block.items} />;
    case "myths":
      return <Myths items={block.items} />;
    case "signals":
      return <Signals items={block.items} />;
  }
}

export function GuideBlocks({ blocks }: { blocks: GuideBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => (
        <Block key={i} block={b} />
      ))}
    </>
  );
}
