/**
 * The Google guide's typed blocks, drawn for this page. Prose reads like the
 * redesigned blog; the rest borrows Google's own furniture where it helps —
 * fan-out queries as search chips, eligibility rows as switches, the click
 * studies as a hairline stat strip.
 */
import { useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  Copy,
  Info,
  Lightbulb,
  Search,
  Target,
  X,
} from "lucide-react";
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
import { plainText } from "@/lib/inline-md";
import { cn } from "@/lib/utils";

const PROSE = "mt-6 text-[1.0625rem] leading-[1.8] text-ink/80 sm:text-[1.125rem]";

/* ---------- lists ---------- */

const QUERY_ONLY = /^`[^`]+`$/;

/* A list made only of `code` items is a set of searches: draw them as the
   search chips Google would run. */
function QueryChips({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-2.5">
      {items.map((item) => (
        <li
          key={item}
          className="inline-flex items-center gap-2 rounded-full border border-ink/[0.1] bg-white py-1.5 pl-3 pr-4 text-[0.92rem] text-ink shadow-[0_1px_3px_rgba(16,24,40,0.06)]"
        >
          <Search aria-hidden className="h-3.5 w-3.5 shrink-0 text-cta" />
          {item.slice(1, -1)}
        </li>
      ))}
    </ul>
  );
}

function List({ items, ordered }: { items: string[]; ordered?: boolean }) {
  if (items.every((i) => QUERY_ONLY.test(i))) return <QueryChips items={items} />;
  if (ordered) {
    return (
      <ol className="mt-6 space-y-3">
        {items.map((item, i) => (
          <li
            key={item}
            className="flex gap-3.5 text-[1.0625rem] leading-[1.75] text-ink/80 sm:text-[1.1rem]"
          >
            <span className="mt-[0.3rem] flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink/[0.1] bg-white font-mono text-[0.72rem] font-semibold text-cta">
              {i + 1}
            </span>
            <span className="min-w-0">
              <Md text={item} />
            </span>
          </li>
        ))}
      </ol>
    );
  }
  return (
    <ul className="mt-6 space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3.5 text-[1.0625rem] leading-[1.75] text-ink/80 sm:text-[1.1rem]"
        >
          <span aria-hidden className="mt-[0.72rem] h-1.5 w-1.5 shrink-0 rounded-[2px] bg-cta" />
          <span className="min-w-0">
            <Md text={item} />
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ---------- code ---------- */

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
    <div className="mt-7 overflow-hidden rounded-xl border border-ink/[0.09] bg-[color-mix(in_oklab,var(--surface)_70%,white)]">
      <div className="flex items-center justify-between border-b border-ink/[0.07] px-4 py-2">
        <span className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.1em] text-muted-foreground">
          {lang}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[0.72rem] font-medium text-ink/70 transition-colors hover:bg-ink/[0.05] hover:text-ink"
        >
          {copied ? (
            <Check aria-hidden className="h-3 w-3 text-success" />
          ) : (
            <Copy aria-hidden className="h-3 w-3" />
          )}
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[0.82rem] leading-[1.7] text-ink [overflow-wrap:normal]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ---------- table ---------- */

/* Three or more columns don't fit a phone. There each row becomes a small
   card — the first cell as its heading, every other cell under its column
   label — drawn from the same table markup, so the text exists once. */
function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  const stack = head.length >= 3;
  const m = (cls: string) => (stack ? cls : "");
  return (
    <div
      className={cn(
        "mt-7 overflow-x-auto rounded-xl border border-ink/[0.09] bg-white [overflow-wrap:normal]",
        m("max-sm:overflow-visible"),
      )}
    >
      <table
        className={cn(
          "w-full border-collapse text-left",
          stack && "sm:min-w-[34rem]",
          m("max-sm:block"),
        )}
      >
        <thead className={m("max-sm:hidden")}>
          <tr className="bg-[color-mix(in_oklab,var(--surface)_70%,white)]">
            {head.map((h, i) => (
              <th
                key={i}
                scope="col"
                className="border-b border-ink/[0.08] px-4 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={m("max-sm:block")}>
          {rows.map((row, r) => (
            <tr
              key={r}
              className={cn(
                "border-b border-ink/[0.06] last:border-b-0",
                m("max-sm:block max-sm:py-2"),
              )}
            >
              {row.map((cell, c) => {
                const Tag = c === 0 ? "th" : "td";
                const label = c > 0 ? head[c] : "";
                return (
                  <Tag
                    key={c}
                    scope={c === 0 ? "row" : undefined}
                    data-label={label || undefined}
                    className={cn(
                      "px-4 py-3 align-top text-[0.9rem] leading-relaxed",
                      c === 0 ? "font-normal text-ink" : "text-ink/75",
                      m("max-sm:block max-sm:py-1.5"),
                      stack && c === 0 && "max-sm:font-medium",
                      stack &&
                        label &&
                        "max-sm:before:block max-sm:before:text-[0.64rem] max-sm:before:font-semibold max-sm:before:uppercase max-sm:before:tracking-[0.1em] max-sm:before:text-muted-foreground max-sm:before:content-[attr(data-label)]",
                    )}
                  >
                    <Md text={cell} />
                  </Tag>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- callout ---------- */

const CALLOUT = {
  note: { Icon: Info, box: "border-cta/20 bg-cta-soft", icon: "text-cta" },
  tip: { Icon: Lightbulb, box: "border-success/25 bg-success/[0.05]", icon: "text-success" },
  warning: {
    Icon: AlertTriangle,
    box: "border-warning/50 bg-warning/[0.08]",
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
    <aside className={cn("mt-8 flex gap-3.5 rounded-xl border p-5", c.box)}>
      <c.Icon aria-hidden className={cn("mt-0.5 h-[1.1rem] w-[1.1rem] shrink-0", c.icon)} />
      <div className="min-w-0">
        <p className="font-semibold leading-snug text-ink">{plainText(title)}</p>
        <p className="mt-1.5 text-[0.97rem] leading-relaxed text-ink/80">
          <Md text={text} />
        </p>
      </div>
    </aside>
  );
}

/* ---------- pipeline ---------- */

/* The path from a typed query to a linked answer, as a trace of nodes: what
   Google does at each step, and the lever a site owner holds there. */
function Pipeline({ steps }: { steps: PipelineStep[] }) {
  return (
    <ol className="mt-8 rounded-xl border border-ink/[0.09] bg-white p-5 sm:p-6">
      {steps.map((s, i) => (
        <li key={s.title} className="relative flex gap-4 pb-7 last:pb-0">
          {i < steps.length - 1 && (
            <span aria-hidden className="absolute bottom-0 left-[0.8rem] top-8 w-px bg-ink/[0.1]" />
          )}
          <span className="relative flex h-[1.6rem] w-[1.6rem] shrink-0 items-center justify-center rounded-full bg-cta-soft font-mono text-[0.7rem] font-semibold text-cta">
            {i + 1}
          </span>
          <div className="min-w-0">
            <p className="font-medium leading-snug text-ink">{plainText(s.title)}</p>
            <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink/75">
              <Md text={s.body} />
            </p>
            {s.lever && (
              <p className="mt-3 flex gap-2 rounded-lg border border-cta/15 bg-cta-soft/60 px-3 py-2 text-[0.88rem] leading-relaxed text-ink">
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

const ADVICE: Record<Crawler["advice"], string> = {
  allow: "Allow",
  "your-call": "Your call",
  block: "Block",
};

function Crawlers({ bots }: { bots: Crawler[] }) {
  return (
    <ul className="mt-7 divide-y divide-ink/[0.07] rounded-xl border border-ink/[0.09] bg-white">
      {bots.map((b) => (
        <li key={b.token} className="px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <code className="font-mono text-[0.9rem] font-semibold text-ink">{b.token}</code>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold",
                b.advice === "allow" ? "bg-cta-soft text-cta" : "bg-ink/[0.05] text-ink/70",
              )}
            >
              {ADVICE[b.advice]}
            </span>
          </div>
          <p className="mt-1.5 text-[0.92rem] leading-relaxed text-ink/75">
            <Md text={b.purpose} />
            {b.robotsNote && <> {b.robotsNote}</>}
          </p>
        </li>
      ))}
    </ul>
  );
}

/* ---------- requirements, as switches ---------- */

const SWITCH: Record<Requirement["status"], { label: string; track: string; knob: string }> = {
  required: { label: "Must be on", track: "bg-cta", knob: "translate-x-[0.9rem] bg-white" },
  helps: { label: "Helps", track: "bg-cta/35", knob: "translate-x-[0.9rem] bg-white" },
  "no-effect": { label: "No effect", track: "bg-ink/[0.12]", knob: "translate-x-0 bg-white" },
  unconfirmed: {
    label: "Unconfirmed",
    track: "border border-dashed border-ink/25 bg-white",
    knob: "translate-x-[0.45rem] bg-ink/25",
  },
};

function Toggle({ status }: { status: Requirement["status"] }) {
  const s = SWITCH[status];
  return (
    <span
      aria-hidden
      className={cn("relative inline-flex h-4 w-[1.9rem] shrink-0 rounded-full", s.track)}
    >
      <span
        className={cn(
          "absolute left-[0.15rem] top-[0.15rem] h-[0.7rem] w-[0.7rem] rounded-full shadow-[0_1px_2px_rgba(16,24,40,0.25)]",
          s.knob,
        )}
      />
    </span>
  );
}

function Requirements({ items }: { items: Requirement[] }) {
  return (
    <dl className="mt-8 divide-y divide-ink/[0.07] overflow-hidden rounded-xl border border-ink/[0.09] bg-white">
      {items.map((r) => (
        <div
          key={r.label}
          className="grid gap-x-6 gap-y-2 px-5 py-4 sm:grid-cols-[12.5rem_minmax(0,1fr)]"
        >
          <dt>
            <span className="flex items-center gap-2.5">
              <Toggle status={r.status} />
              <span className="font-medium leading-snug text-ink">{plainText(r.label)}</span>
            </span>
            <span
              className={cn(
                "mt-1 block pl-[2.55rem] text-[0.68rem] font-semibold uppercase tracking-[0.1em]",
                r.status === "required" ? "text-cta" : "text-muted-foreground",
              )}
            >
              {SWITCH[r.status].label}
            </span>
          </dt>
          <dd className="text-[0.93rem] leading-relaxed text-ink/75">
            <Md text={r.note} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ---------- stats ---------- */

function Stats({ items }: { items: Stat[] }) {
  return (
    <div
      className={cn(
        "mt-8 grid gap-px overflow-hidden rounded-xl border border-ink/[0.09] bg-ink/[0.07]",
        items.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
      )}
    >
      {items.map((s) => (
        <figure key={s.label} className="flex flex-col bg-white p-5">
          <p className="font-display text-[2rem] font-medium leading-none tracking-[-0.03em] text-ink">
            {s.value}
          </p>
          <p className="mt-3 flex-1 text-[0.86rem] leading-snug text-ink/70">
            {plainText(s.label)}
          </p>
          <figcaption className="mt-4">
            <a
              href={s.source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 text-[0.74rem] font-medium text-cta transition-colors hover:text-cta-hover"
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

/* ---------- myths, as a skip list ---------- */

function Myths({ items }: { items: Myth[] }) {
  return (
    <ul className="mt-8 divide-y divide-ink/[0.07] rounded-xl border border-ink/[0.09] bg-white">
      {items.map((m) => (
        <li
          key={m.myth}
          className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-2.5 px-5 py-5"
        >
          <span className="mt-[0.15rem] inline-flex h-5 items-center gap-1 self-start rounded-md bg-ink/[0.05] px-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-ink/55">
            <X aria-hidden className="h-2.5 w-2.5" strokeWidth={3} />
            Skip
          </span>
          <p className="font-medium leading-snug text-ink/70 line-through decoration-ink/25">
            {plainText(m.myth)}
          </p>
          <p className="col-start-2 text-[0.95rem] leading-relaxed text-ink/80">
            <Md text={m.reality} />
          </p>
        </li>
      ))}
    </ul>
  );
}

/* ---------- signals ---------- */

function Signals({ items }: { items: Signal[] }) {
  return (
    <ul className="mt-8 grid gap-px overflow-hidden rounded-xl border border-ink/[0.09] bg-ink/[0.07] sm:grid-cols-2">
      {items.map((s) => (
        <li key={s.title} className="flex flex-col bg-white p-5">
          <div className="flex items-start justify-between gap-3">
            <p className="font-medium leading-snug text-ink">{plainText(s.title)}</p>
            <EvidenceBadge evidence={s.evidence} />
          </div>
          <p className="mt-2 text-[0.92rem] leading-relaxed text-ink/75">
            <Md text={s.body} />
          </p>
        </li>
      ))}
      {items.length % 2 === 1 && <li aria-hidden className="hidden bg-white sm:block" />}
    </ul>
  );
}

/* ---------- dispatch ---------- */

export function SectionBlocks({ blocks, idPrefix }: { blocks: GuideBlock[]; idPrefix: string }) {
  return (
    <>
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
                className="mt-11 font-display text-[1.25rem] font-medium leading-snug tracking-[-0.015em] text-ink sm:text-[1.35rem]"
              >
                {plainText(b.text)}
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
