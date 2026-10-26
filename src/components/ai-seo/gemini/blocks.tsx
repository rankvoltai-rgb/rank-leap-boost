/**
 * The Gemini guide's typed blocks, drawn in the landing page's language:
 * hairline cards, soft-blue accents, ink only for text. Each diagram a
 * technical guide needs (the grounding pipeline, the fetcher cards, the spec
 * sheet, study numbers, myths, evidence-graded signals) gets its own small
 * component here rather than generic article styling.
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
import { PANEL } from "@/components/landing/frame";
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

export const PARAGRAPH = "mt-5 text-[1.05rem] leading-[1.8] text-ink/80 sm:text-[1.1rem]";
const CARD = "rounded-xl border border-ink/[0.08] bg-white";
const KICKER = "text-[0.66rem] font-semibold uppercase tracking-[0.14em]";

/* ---------- callout ---------- */

const CALLOUT = {
  note: { Icon: Info, box: cn("border-ink/[0.08]", PANEL), icon: "text-cta" },
  tip: { Icon: Lightbulb, box: "border-cta/15 bg-cta-soft", icon: "text-cta" },
  warning: {
    Icon: AlertTriangle,
    box: "border-[oklch(0.8_0.12_75)]/60 bg-[oklch(0.98_0.03_85)]",
    icon: "text-[oklch(0.58_0.14_65)]",
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
      <c.Icon aria-hidden className={cn("mt-0.5 h-[1.1rem] w-[1.1rem] shrink-0", c.icon)} />
      <div className="min-w-0">
        <p className="font-display text-[1.02rem] font-medium tracking-[-0.01em] text-ink">
          {title}
        </p>
        <p className="mt-1.5 text-[0.97rem] leading-relaxed text-ink/80">
          <Md text={text} />
        </p>
      </div>
    </aside>
  );
}

/* ---------- pipeline ---------- */

/* The grounding loop as a numbered rail. Each step pairs what Gemini does
   with the lever a site owner holds there — the point is where you can act. */
function Pipeline({ steps }: { steps: PipelineStep[] }) {
  return (
    <ol className={cn("my-9 overflow-hidden", CARD)}>
      {steps.map((s, i) => (
        <li
          key={s.title}
          className="relative grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4 border-b border-ink/[0.07] p-5 last:border-b-0 sm:grid-cols-[2.25rem_minmax(0,1fr)] sm:p-6"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cta-soft font-mono text-[0.78rem] font-semibold text-cta sm:h-9 sm:w-9">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <p className="font-display text-[1.05rem] font-medium leading-snug tracking-[-0.01em] text-ink">
              {s.title}
            </p>
            <p className="mt-1.5 text-[0.96rem] leading-relaxed text-ink/75">
              <Md text={s.body} />
            </p>
            {s.lever && (
              <p className="mt-3 flex gap-2.5 rounded-lg border border-dashed border-cta/25 px-3 py-2.5 text-[0.9rem] leading-relaxed text-ink">
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

/* ---------- crawlers / fetchers ---------- */

const ROLE: Record<Crawler["role"], string> = {
  search: "Search index",
  user: "User-triggered",
  training: "Training + grounding",
  other: "Other",
};

const ROBOTS: Record<Crawler["robots"], { label: string; Icon: typeof Check }> = {
  yes: { label: "Honors robots.txt", Icon: Check },
  partial: { label: "Partly honors robots.txt", Icon: Minus },
  no: { label: "Ignores robots.txt", Icon: X },
};

const ADVICE: Record<Crawler["advice"], { label: string; className: string }> = {
  allow: { label: "Allow", className: "bg-cta text-white" },
  "your-call": { label: "Your call", className: "border border-ink/[0.12] bg-white text-ink" },
  block: { label: "Block", className: "bg-ink text-white" },
};

function Crawlers({ bots }: { bots: Crawler[] }) {
  return (
    <ul className="my-9 grid gap-3">
      {bots.map((b) => {
        const r = ROBOTS[b.robots];
        const a = ADVICE[b.advice];
        return (
          <li key={b.token} className={cn("p-5", CARD)}>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <code className="min-w-0 break-all font-mono text-[0.95rem] font-semibold text-ink">
                {b.token}
              </code>
              <span className="rounded-md bg-ink/[0.04] px-2 py-0.5 text-[0.72rem] font-medium text-ink/70">
                {ROLE[b.role]}
              </span>
              <span
                className={cn(
                  "ml-auto rounded-md px-2 py-0.5 text-[0.72rem] font-semibold",
                  a.className,
                )}
              >
                {a.label}
              </span>
            </div>
            <p className="mt-3 text-[0.93rem] leading-relaxed text-ink/75">
              <Md text={b.purpose} />
            </p>
            <p className="mt-3 flex items-center gap-1.5 text-[0.8rem] font-medium text-ink/60">
              <r.Icon
                aria-hidden
                className={cn("h-3.5 w-3.5", b.robots === "yes" ? "text-cta" : "text-ink/50")}
                strokeWidth={2.5}
              />
              {r.label}
              {b.robotsNote && <span className="font-normal">· {b.robotsNote}</span>}
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
  "no-effect": { label: "No effect", className: "bg-ink/[0.05] text-ink/55" },
  unconfirmed: {
    label: "Unconfirmed",
    className: "border border-dashed border-ink/25 text-ink/65",
  },
};

/* A spec sheet, not a to-do list. The "no effect" rows stay on purpose:
   they're where weeks get wasted. */
function Requirements({ items }: { items: Requirement[] }) {
  return (
    <dl className={cn("my-9 divide-y divide-ink/[0.07] overflow-hidden", CARD)}>
      {items.map((r) => {
        const s = STATUS[r.status];
        return (
          <div
            key={r.label}
            className="grid gap-x-6 gap-y-2 px-5 py-4 sm:grid-cols-[12rem_minmax(0,1fr)]"
          >
            <dt className="flex items-center justify-between gap-3 sm:flex-col sm:items-start sm:justify-start">
              <span className="font-medium leading-snug text-ink">{r.label}</span>
              <span
                className={cn(
                  "inline-flex h-5 shrink-0 items-center rounded-md px-2 text-[0.64rem] font-semibold uppercase tracking-[0.08em]",
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
    <div className={cn("my-9 overflow-hidden", CARD)}>
      <ul
        className={cn(
          "-mb-px -mr-px grid",
          items.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
        )}
      >
        {items.map((s) => (
          <li key={s.label} className="flex flex-col border-b border-r border-ink/[0.07] p-5">
            <p className="font-display text-[2rem] font-medium leading-none tracking-[-0.03em] text-ink">
              {s.value}
            </p>
            <p className="mt-3 flex-1 text-[0.86rem] leading-snug text-ink/70">{s.label}</p>
            <a
              href={s.source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 inline-flex items-center gap-1 text-[0.74rem] font-medium text-cta transition-colors hover:text-cta-hover"
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

/* ---------- myths ---------- */

function Myths({ items }: { items: Myth[] }) {
  return (
    <div className={cn("my-9 divide-y divide-ink/[0.07] overflow-hidden", CARD)}>
      {items.map((m) => (
        <div key={m.myth} className="grid sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className={cn("p-5", PANEL)}>
            <p className={cn(KICKER, "flex items-center gap-1.5 text-ink/45")}>
              <X aria-hidden className="h-3 w-3" strokeWidth={3} />
              Often said
            </p>
            <p className="mt-2 font-medium leading-snug text-ink/60 line-through decoration-ink/25">
              {m.myth}
            </p>
          </div>
          <div className="p-5">
            <p className={cn(KICKER, "flex items-center gap-1.5 text-cta")}>
              <Check aria-hidden className="h-3 w-3" strokeWidth={3} />
              What holds up
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

const EVIDENCE: Record<Evidence, { label: string; title: string; className: string }> = {
  official: {
    label: "Official",
    title: "Stated in Google's own documentation",
    className: "bg-cta text-white",
  },
  observed: {
    label: "Observed",
    title: "Measured in independent studies, not confirmed by Google",
    className: "bg-cta-soft text-cta",
  },
  "our-read": {
    label: "Our read",
    title: "Our interpretation of the evidence — weigh it accordingly",
    className: "border border-dashed border-ink/25 text-ink/60",
  },
};

export function EvidenceTag({ evidence }: { evidence: Evidence }) {
  const e = EVIDENCE[evidence];
  return (
    <span
      title={e.title}
      className={cn(
        "inline-flex h-5 shrink-0 items-center rounded-md px-2 text-[0.62rem] font-semibold uppercase tracking-[0.1em]",
        e.className,
      )}
    >
      {e.label}
    </span>
  );
}

function Signals({ items }: { items: Signal[] }) {
  return (
    <ul className="my-9 grid gap-3 sm:grid-cols-2">
      {items.map((s) => (
        <li key={s.title} className={cn("flex flex-col p-5", CARD)}>
          <div className="flex items-start justify-between gap-3">
            <p className="font-display text-[1rem] font-medium leading-snug tracking-[-0.01em] text-ink">
              {s.title}
            </p>
            <EvidenceTag evidence={s.evidence} />
          </div>
          <p className="mt-2 text-[0.92rem] leading-relaxed text-ink/75">
            <Md text={s.body} />
          </p>
        </li>
      ))}
    </ul>
  );
}

/* ---------- code ---------- */

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
    <figure className={cn("my-7 overflow-hidden", CARD)}>
      <figcaption
        className={cn(
          "flex items-center justify-between gap-3 border-b border-ink/[0.07] px-4 py-2",
          PANEL,
        )}
      >
        <span className="truncate font-mono text-[0.72rem] font-medium text-ink/60">{lang}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md px-2 text-[0.72rem] font-medium text-ink/60 transition-colors hover:bg-ink/[0.04] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
        >
          {copied ? (
            <Check aria-hidden className="h-3.5 w-3.5 text-cta" />
          ) : (
            <Copy aria-hidden className="h-3.5 w-3.5" />
          )}
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </button>
      </figcaption>
      <pre className="overflow-x-auto px-4 py-4 text-[0.82rem] leading-relaxed text-ink [overflow-wrap:normal]">
        <code className="font-mono">{code}</code>
      </pre>
    </figure>
  );
}

/* ---------- table ---------- */

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className={cn("my-8 overflow-x-auto", CARD)}>
      <table className="w-full min-w-[34rem] border-collapse text-left text-[0.88rem] [overflow-wrap:normal]">
        <thead className={PANEL}>
          <tr>
            {head.map((h, i) => (
              <th
                key={`${h}-${i}`}
                scope="col"
                className="border-b border-ink/[0.07] px-4 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink/55"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/[0.07]">
          {rows.map((r, ri) => (
            <tr key={ri} className="align-top">
              {r.map((cell, ci) =>
                ci === 0 ? (
                  <th
                    key={ci}
                    scope="row"
                    className="w-[30%] px-4 py-3 font-medium leading-snug text-ink"
                  >
                    <Md text={cell} />
                  </th>
                ) : (
                  <td key={ci} className="px-4 py-3 leading-snug text-ink/75">
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

/* ---------- dispatch ---------- */

export function GeminiBlocks({ blocks, idPrefix }: { blocks: GuideBlock[]; idPrefix: string }) {
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
            return b.ordered ? (
              <ol key={key} className="mt-5 space-y-3">
                {b.items.map((item, n) => (
                  <li
                    key={item}
                    className="grid grid-cols-[1.6rem_minmax(0,1fr)] gap-3 text-[1.02rem] leading-[1.7] text-ink/80 sm:text-[1.06rem]"
                  >
                    <span className="mt-[0.2rem] flex h-6 w-6 items-center justify-center rounded-md border border-ink/[0.1] bg-white font-mono text-[0.7rem] font-semibold text-cta">
                      {n + 1}
                    </span>
                    <span>
                      <Md text={item} />
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <ul key={key} className="mt-5 space-y-3">
                {b.items.map((item) => (
                  <li
                    key={item}
                    className="grid grid-cols-[1rem_minmax(0,1fr)] gap-2.5 text-[1.02rem] leading-[1.7] text-ink/80 sm:text-[1.06rem]"
                  >
                    <span aria-hidden className="mt-[0.7rem] h-1.5 w-1.5 rounded-[2px] bg-cta" />
                    <span>
                      <Md text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            );
          case "code":
            return <Code key={key} lang={b.lang} code={b.code} />;
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
