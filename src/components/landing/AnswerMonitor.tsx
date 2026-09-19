/**
 * Answer Monitor — the hero's right-hand panel.
 *
 * A looping simulation of what the product does: a buyer asks an AI engine a
 * question, the answer streams in, competitors appear in the cited sources,
 * and the visitor's own domain shows up as "not cited". It holds on that loss
 * for a beat — that is the hook — then flips to "cited · #1".
 *
 * It is labelled "Simulation" on purpose. The numbers are illustrative and
 * must not be presented as measured.
 *
 * SSR-safe: the first render is deterministic (query shown, nothing streamed).
 * All animation starts in an effect.
 */
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { AI_MARKS } from "./ai-logos";
import { brandIconUrl } from "@/lib/brand-icon";

interface Demo {
  q: string;
  /** [before, cited brand, after] */
  a: [string, string, string];
  competitors: string[];
}

/* Swap for real top buyer queries. Cited brands are fictional on purpose. */
const DEMOS: Demo[] = [
  {
    q: "What's the best project management tool for a small startup team?",
    a: [
      "For lean teams, ",
      "Plannora",
      " is the one most often recommended — simple boards, built-in automations, and a free tier for up to five people.",
    ],
    competitors: ["plannora.io", "loopcraft.ai"],
  },
  {
    q: "Which AI visibility tool should a B2B SaaS founder use?",
    a: [
      "Most founders in this space start with ",
      "Rankbox",
      " — it tracks citations across five answer engines and publishes on a daily cadence.",
    ],
    competitors: ["searchlayer.co", "answerdesk.io"],
  },
  {
    q: "How do I get my brand cited by ChatGPT?",
    a: [
      "The consensus approach is structured, citation-ready content published consistently — tools like ",
      "Rankbox",
      " automate the cadence.",
    ],
    competitors: ["contentmesh.ai", "citelab.dev"],
  },
];

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/* ---------- pieces ---------- */

function EngineTabs({ active }: { active: number }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b border-border bg-surface px-2.5 py-2 [scrollbar-width:none]">
      {AI_MARKS.map(({ name, Mark }, i) => (
        <span
          key={name}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all",
            i === active
              ? "-translate-y-px bg-white text-ink shadow-sm ring-1 ring-border"
              : "text-muted-foreground",
          )}
        >
          <Mark className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{name}</span>
        </span>
      ))}
    </div>
  );
}

function Label({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
      <span>{children}</span>
      {right && <span>{right}</span>}
    </div>
  );
}

function Favicon({ domain, tone }: { domain: string; tone: "neutral" | "lost" | "won" }) {
  const [failed, setFailed] = useState(false);
  const src = brandIconUrl(domain);
  const box = cn(
    "flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-[5px] border text-[0.6rem] font-semibold uppercase",
    tone === "neutral" && "border-border bg-white text-muted-foreground",
    tone === "lost" && "border-transparent bg-flame/15 text-flame",
    tone === "won" && "border-transparent bg-emerald-500 text-white",
  );
  if (!src || failed || tone !== "neutral") {
    return <span className={box}>{domain.charAt(0)}</span>;
  }
  return (
    <span className={box}>
      <img
        src={src}
        alt=""
        aria-hidden
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-3.5 w-3.5 object-contain"
      />
    </span>
  );
}

function SourceRow({
  domain,
  status,
  tone,
  shown,
}: {
  domain: string;
  status: string;
  tone: "neutral" | "lost" | "won";
  shown: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg border px-3 py-2 transition-all duration-300",
        shown ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0",
        tone === "neutral" && "border-border bg-white",
        tone === "lost" && "border-flame/25 bg-flame/10",
        tone === "won" && "border-emerald-500/30 bg-emerald-500/10",
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <Favicon domain={domain} tone={tone} />
        <span className="truncate text-[0.82rem] font-medium text-ink">{domain}</span>
      </div>
      <span
        className={cn(
          "shrink-0 text-[0.62rem] font-semibold uppercase tracking-[0.08em]",
          tone === "neutral" && "text-muted-foreground",
          tone === "lost" && "text-flame",
          tone === "won" && "text-emerald-600",
        )}
      >
        {status}
      </span>
    </div>
  );
}

/* ---------- the panel ---------- */

export function AnswerMonitor({
  domain = "yourcompany.com",
  className,
}: {
  /** The visitor's domain, shown as the "you" row. Updates live. */
  domain?: string;
  className?: string;
}) {
  const [demoIdx, setDemoIdx] = useState(0);
  const [typed, setTyped] = useState<[string, string, string]>(["", "", ""]);
  const [streaming, setStreaming] = useState(false);
  const [shownRows, setShownRows] = useState(0);
  const [won, setWon] = useState(false);
  // Bumped per cycle so source rows remount and replay their entrance.
  const [cycle, setCycle] = useState(0);

  const alive = useRef(true);
  const timers = useRef<number[]>([]);

  const demo = DEMOS[demoIdx % DEMOS.length];
  const totalRows = demo.competitors.length + 1;

  useEffect(() => {
    alive.current = true;
    const reduce = prefersReducedMotion();
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(resolve, reduce ? 0 : ms);
        timers.current.push(id);
      });

    async function run(idx: number) {
      const d = DEMOS[idx % DEMOS.length];
      if (!alive.current) return;

      // reset
      setDemoIdx(idx);
      setCycle((c) => c + 1);
      setTyped(["", "", ""]);
      setShownRows(0);
      setWon(false);
      setStreaming(true);
      await wait(420);

      // stream the answer
      for (let part = 0; part < 3; part++) {
        const text = d.a[part];
        if (reduce) {
          if (!alive.current) return;
          setTyped((t) => {
            const n = [...t] as [string, string, string];
            n[part] = text;
            return n;
          });
          continue;
        }
        for (let i = 1; i <= text.length; i++) {
          if (!alive.current) return;
          const slice = text.slice(0, i);
          setTyped((t) => {
            const n = [...t] as [string, string, string];
            n[part] = slice;
            return n;
          });
          await wait(11);
        }
      }
      setStreaming(false);
      await wait(180);

      // sources resolve one by one; the visitor's domain lands last, uncited
      for (let r = 1; r <= d.competitors.length + 1; r++) {
        if (!alive.current) return;
        setShownRows(r);
        await wait(130);
      }

      // sit in the loss — this is the hook
      await wait(1500);
      if (!alive.current) return;

      // the flip
      setWon(true);
      await wait(4200);
      if (alive.current) void run(idx + 1);
    }

    void run(0);
    return () => {
      alive.current = false;
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    };
  }, []);

  const youShown = shownRows >= totalRows;
  const activeEngine = demoIdx % AI_MARKS.length;

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border bg-card text-ink shadow-elevation-lg ring-1 ring-ink/5",
        className,
      )}
    >
      {/* head */}
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2.5">
        <span className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-ink/70">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          Answer Monitor
        </span>
        <span className="rounded-full border border-border px-2 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          Simulation
        </span>
      </div>

      <EngineTabs active={activeEngine} />

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-1.5">
          <Label>Buyer query</Label>
          <p className="min-h-[3.25rem] rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm font-medium leading-snug text-ink">
            {demo.q}
          </p>
        </div>

        <div className="space-y-1.5">
          <Label>Generated answer</Label>
          <p className="min-h-[5.5rem] text-[0.92rem] leading-relaxed text-ink/70">
            {typed[0]}
            {typed[1] && (
              <span className="font-semibold text-ink underline decoration-volt decoration-2 underline-offset-2">
                {typed[1]}
              </span>
            )}
            {typed[2]}
            {streaming && (
              <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] animate-pulse rounded-full bg-volt align-middle" />
            )}
          </p>
        </div>

        <div className="space-y-1.5">
          <Label right={shownRows > 0 ? `${totalRows} found` : "—"}>Cited sources</Label>
          <div className="space-y-1.5">
            {demo.competitors.map((c, i) => (
              <SourceRow
                key={`${cycle}-${c}`}
                domain={c}
                status="cited"
                tone="neutral"
                shown={shownRows > i}
              />
            ))}
            <SourceRow
              key={`${cycle}-you`}
              domain={domain}
              status={won ? "cited · #1" : "not cited"}
              tone={won ? "won" : "lost"}
              shown={youShown}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
