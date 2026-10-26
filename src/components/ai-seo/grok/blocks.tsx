/**
 * The Grok guide's typed blocks, drawn in the landing page's language:
 * hairline boxes, soft-blue emphasis, ink only for text. Tables and code
 * scroll inside their own box so a long user-agent string never pushes a
 * phone-width page sideways.
 */
import { useState } from "react";
import { AlertTriangle, ArrowUpRight, Check, Copy, Info, Lightbulb, Minus, X } from "lucide-react";
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

export const PROSE = "text-[1.0625rem] leading-[1.8] text-ink/80 sm:text-[1.1rem]";
const BOX = "rounded-xl border border-ink/[0.08] bg-white";

/* ---------- prose ---------- */

function List({ items, ordered }: { items: string[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className="mt-5 space-y-3">
      {items.map((item, i) => (
        <li key={item} className={cn("flex gap-3.5", PROSE)}>
          {ordered ? (
            <span className="mt-[0.3rem] flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cta-soft font-mono text-[0.68rem] font-semibold text-cta">
              {i + 1}
            </span>
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
    <figure className={cn("my-8 overflow-hidden", BOX)}>
      <figcaption className="flex items-center justify-between border-b border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_70%,white)] px-4 py-2">
        <span className="font-mono text-[0.7rem] font-medium text-muted-foreground">{lang}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[0.7rem] font-medium text-muted-foreground transition-colors hover:bg-ink/[0.04] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
        >
          {copied ? <Check className="h-3 w-3 text-cta" /> : <Copy className="h-3 w-3" />}
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </button>
      </figcaption>
      <pre className="overflow-x-auto px-4 py-4 text-[0.8rem] leading-[1.7] text-ink">
        <code className="font-mono">{code}</code>
      </pre>
    </figure>
  );
}

const PERCENT = /^(\d+(?:\.\d+)?)%$/;

/* A table whose last column is all percentages (a share ranking) gets a
   quiet single-hue bar behind each value: the numbers stay as text, the bar
   only makes the drop-off visible at a glance. */
function shareColumn(rows: string[][]): number[] | null {
  const values = rows.map((r) => PERCENT.exec(r[r.length - 1] ?? "")?.[1]);
  if (rows.length < 4 || values.some((v) => v === undefined)) return null;
  return values.map(Number);
}

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  const shares = shareColumn(rows);
  const max = shares ? Math.max(...shares) : 0;
  const wide = head.length >= 3 && !shares;
  return (
    <div className={cn("my-8 overflow-x-auto", BOX)}>
      <table className={cn("w-full border-collapse text-left", wide && "min-w-[34rem]")}>
        <thead>
          <tr className="border-b border-ink/[0.08] bg-[color-mix(in_oklab,var(--surface)_70%,white)]">
            {head.map((h, i) => (
              <th
                key={`${h}-${i}`}
                scope="col"
                className="px-4 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/[0.06]">
          {rows.map((row, r) => (
            <tr key={r} className={shares ? "align-middle" : "align-top"}>
              {row.map((cell, c) => {
                const bar = shares && c === row.length - 1 ? shares[r] / max : null;
                return (
                  <td
                    key={c}
                    className={cn(
                      "px-4 text-[0.88rem] leading-relaxed [overflow-wrap:break-word]",
                      shares ? "py-2" : "py-3",
                      c === 0 ? "font-medium text-ink" : "text-ink/75",
                      shares && c === 0 && "w-14 font-mono text-[0.78rem] text-ink/45",
                      bar !== null && "w-[45%]",
                    )}
                  >
                    {bar !== null ? (
                      <span className="flex items-center gap-3">
                        <span aria-hidden className="h-2 flex-1 overflow-hidden rounded-full">
                          <span
                            className="block h-full rounded-[4px] bg-cta/70"
                            style={{ width: `${Math.max(bar * 100, 2)}%` }}
                          />
                        </span>
                        <span className="w-11 shrink-0 text-right font-mono text-[0.8rem] font-medium text-ink">
                          {cell}
                        </span>
                      </span>
                    ) : (
                      <Md text={cell} />
                    )}
                  </td>
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
  note: { Icon: Info, box: "border-cta/20 bg-cta-soft/50", icon: "bg-white text-cta" },
  tip: {
    Icon: Lightbulb,
    box: "border-success/25 bg-success/[0.05]",
    icon: "bg-white text-success",
  },
  warning: {
    Icon: AlertTriangle,
    box: "border-warning/50 bg-warning/[0.08]",
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
    <aside className={cn("my-8 flex gap-3.5 rounded-xl border p-5", c.box)}>
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg shadow-[0_0_0_1px_rgba(16,24,40,0.06)]",
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

/* ---------- stats ---------- */

function Stats({ items }: { items: Stat[] }) {
  return (
    <div className={cn("my-8 overflow-hidden", BOX)}>
      <ul
        className={cn(
          "-mb-px -mr-px grid",
          items.length >= 3 ? "sm:grid-cols-3" : items.length === 2 ? "sm:grid-cols-2" : "",
        )}
      >
        {items.map((s) => (
          <li key={s.label} className="flex flex-col border-b border-r border-ink/[0.07] p-5">
            <p className="font-display text-[2rem] font-medium leading-none tracking-[-0.03em] text-brand-blue">
              {s.value}
            </p>
            <p className="mt-3 flex-1 text-[0.85rem] leading-snug text-ink/75">{s.label}</p>
            <a
              href={s.source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 inline-flex w-fit items-center gap-1 text-[0.72rem] font-medium text-muted-foreground transition-colors hover:text-cta"
            >
              {s.source.name}
              <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- requirements ---------- */

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
    <dl className={cn("my-8 divide-y divide-ink/[0.06] overflow-hidden", BOX)}>
      {items.map((r) => {
        const s = STATUS[r.status];
        return (
          <div
            key={r.label}
            className="grid gap-x-5 gap-y-1.5 px-4 py-3.5 sm:grid-cols-[12rem_minmax(0,1fr)] sm:px-5"
          >
            <dt className="flex items-center justify-between gap-3 sm:flex-col sm:items-start sm:justify-start">
              <span className="text-[0.92rem] font-semibold leading-snug text-ink">{r.label}</span>
              <span
                className={cn(
                  "inline-flex h-5 shrink-0 items-center rounded-md px-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em]",
                  s.className,
                )}
              >
                {s.label}
              </span>
            </dt>
            <dd className="text-[0.9rem] leading-relaxed text-ink/75">
              <Md text={r.note} />
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

/* ---------- myths ---------- */

function Myths({ items }: { items: Myth[] }) {
  return (
    <ol className="mt-6 space-y-3">
      {items.map((m, i) => (
        <li
          key={m.myth}
          className={cn("grid overflow-hidden sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]", BOX)}
        >
          <div className="border-b border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_70%,white)] p-4 sm:border-b-0 sm:border-r sm:p-5">
            <p className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <span className="font-mono text-ink/40">{String(i + 1).padStart(2, "0")}</span>
              <X aria-hidden className="h-3 w-3 text-destructive" strokeWidth={3} />
              Heard
            </p>
            <p className="mt-2 font-medium leading-snug text-ink/80">{m.myth}</p>
          </div>
          <div className="p-4 sm:p-5">
            <p className="flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-cta">
              <Check aria-hidden className="h-3 w-3" strokeWidth={3} />
              Checked
            </p>
            <p className="mt-2 text-[0.93rem] leading-relaxed text-ink/80">
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
    <div className={cn("my-8 overflow-hidden", BOX)}>
      <ul className="-mb-px -mr-px grid sm:grid-cols-2">
        {items.map((s) => (
          <li key={s.title} className="flex flex-col border-b border-r border-ink/[0.07] p-5">
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

/* ---------- pipeline & crawlers (unused by this guide today, kept typed) ---------- */

function Pipeline({ steps }: { steps: PipelineStep[] }) {
  return (
    <ol className={cn("my-8 space-y-0 p-5", BOX)}>
      {steps.map((s, i) => (
        <li key={s.title} className="relative flex gap-4 pb-6 last:pb-0">
          {i < steps.length - 1 && (
            <span
              aria-hidden
              className="absolute bottom-0 left-[0.85rem] top-8 w-px bg-ink/[0.1]"
            />
          )}
          <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cta-soft font-mono text-[0.7rem] font-semibold text-cta">
            {i + 1}
          </span>
          <div className="min-w-0 pt-0.5">
            <p className="font-semibold leading-snug text-ink">{s.title}</p>
            <p className="mt-1.5 text-[0.93rem] leading-relaxed text-ink/75">
              <Md text={s.body} />
            </p>
            {s.lever && (
              <p className="mt-2.5 rounded-lg bg-cta-soft/60 px-3 py-2 text-[0.86rem] leading-relaxed text-ink">
                <Md text={s.lever} />
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

const ROBOTS: Record<Crawler["robots"], { label: string; Icon: typeof Check }> = {
  yes: { label: "Honors robots.txt", Icon: Check },
  partial: { label: "Partly", Icon: Minus },
  no: { label: "Ignores robots.txt", Icon: X },
};

function Crawlers({ bots }: { bots: Crawler[] }) {
  return (
    <ul className={cn("my-8 divide-y divide-ink/[0.06] overflow-hidden", BOX)}>
      {bots.map((b) => {
        const r = ROBOTS[b.robots];
        return (
          <li key={b.token} className="px-5 py-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <code className="font-mono text-[0.88rem] font-semibold text-ink">{b.token}</code>
              <span className="inline-flex items-center gap-1 text-[0.78rem] font-medium text-ink/70">
                <r.Icon aria-hidden className="h-3 w-3" strokeWidth={2.5} />
                {r.label}
              </span>
            </div>
            <p className="mt-1.5 text-[0.88rem] leading-relaxed text-muted-foreground">
              <Md text={b.purpose} />
              {b.robotsNote && <> {b.robotsNote}</>}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- dispatch ---------- */

export function GrokBlocks({ blocks, idPrefix }: { blocks: GuideBlock[]; idPrefix: string }) {
  return (
    <>
      {blocks.map((b, i) => {
        const key = `${idPrefix}-${i}`;
        switch (b.kind) {
          case "p":
            return (
              <p key={key} className={cn("mt-5 first:mt-0", PROSE)}>
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
          case "list":
            return <List key={key} items={b.items} ordered={b.ordered} />;
          case "code":
            return <Code key={key} lang={b.lang} code={b.code} />;
          case "table":
            return <Table key={key} head={b.head} rows={b.rows} />;
          case "callout":
            return <Callout key={key} tone={b.tone} title={b.title} text={b.text} />;
          case "stats":
            return <Stats key={key} items={b.items} />;
          case "requirements":
            return <Requirements key={key} items={b.items} />;
          case "myths":
            return <Myths key={key} items={b.items} />;
          case "signals":
            return <Signals key={key} items={b.items} />;
          case "pipeline":
            return <Pipeline key={key} steps={b.steps} />;
          case "crawlers":
            return <Crawlers key={key} bots={b.bots} />;
        }
      })}
    </>
  );
}
