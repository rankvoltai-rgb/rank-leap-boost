/**
 * The page's focal picture: the Citation-Ready Writer drafting the sample
 * article (sample.ts) for yoursite.com, live.
 *
 * It reads like the editor it stands for: the outline down the left, the
 * draft in the middle, the sources it read down the right. First it
 * researches (sources arrive, the thin one is skipped, the outline forms),
 * then it writes, streaming the answer block, the list and the paragraph
 * word by word; each citation marker lands in the text as the matching
 * source turns "Cited". Last, the extras tick in and the draft is ready.
 *
 * One clock drives it all, so every part agrees on the moment. The clock runs
 * only while about half the editor is on screen and goes back to zero once it
 * leaves, so every visit sees the research. The first render is the clock at
 * zero, on the server and the client alike; with reduced motion it shows the
 * finished draft and never moves.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  Bold,
  Check,
  ChevronDown,
  ChevronRight,
  Heading2,
  ImageIcon,
  Italic,
  Link2,
  List,
  Quote,
  Redo2,
  Search,
  Sparkles,
  Undo2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/brand/Mark";
import {
  ANSWER,
  IMAGES,
  INTERNAL_LINKS,
  NEW_IN_22,
  OUTLINE,
  QUERIES,
  SITE,
  SOURCES,
  TITLE,
  TOPIC,
  WHO,
  WHO_HEADING,
  WORDS,
  type Source,
  type Token,
} from "./sample";

/* ---------- The clock ---------- */

type Unit = { word: string } | { cite: number };

/** Prose as words (each carrying the space before it) and markers. */
function toUnits(tokens: Token[]): Unit[] {
  const out: Unit[] = [];
  for (const t of tokens) {
    if (typeof t === "string") for (const w of t.match(/\s*\S+/g) ?? []) out.push({ word: w });
    else out.push({ cite: t.cite });
  }
  return out;
}

const ANSWER_UNITS = toUnits(ANSWER);
const WHO_UNITS = toUnits(WHO);
const WORD_MS = 52;
const SEARCHED = 24;

/* Every beat, in ms from the start. */
const T = (() => {
  const research = 2600;
  const title = 1900;
  const answer = 2750;
  const answerEnd = answer + ANSWER_UNITS.length * WORD_MS;
  const list = answerEnd + 450;
  const items = NEW_IN_22.map((_, i) => list + 380 + i * 430);
  const who = items[items.length - 1] + 650;
  const whoText = who + 300;
  const whoEnd = whoText + WHO_UNITS.length * WORD_MS;
  const ready = whoEnd + 450;
  /* Every tick has landed: the reduced-motion frame. */
  const still = ready + 1400;
  /* Held, then faded out and started over. */
  const end = ready + 5400;
  return {
    research,
    title,
    answer,
    answerEnd,
    list,
    items,
    who,
    whoText,
    whoEnd,
    ready,
    still,
    end,
  };
})();

/** When each source first appears in the rail, and when it has been read. */
const sourceIn = (i: number) => 250 + i * 420;
const sourceRead = (i: number) => sourceIn(i) + 760;

/** When each citation number first lands in the text. */
const CITED_AT: Record<number, number> = (() => {
  const first: Record<number, number> = {};
  const note = (n: number, at: number) => {
    if (first[n] === undefined || at < first[n]) first[n] = at;
  };
  ANSWER_UNITS.forEach((u, i) => "cite" in u && note(u.cite, T.answer + (i + 1) * WORD_MS));
  NEW_IN_22.forEach((it, i) => note(it.cite, T.items[i]));
  WHO_UNITS.forEach((u, i) => "cite" in u && note(u.cite, T.whoText + (i + 1) * WORD_MS));
  return first;
})();

/** How many units of a run are showing at `t`. */
const shownAt = (t: number, start: number, length: number) =>
  Math.max(0, Math.min(length, Math.floor((t - start) / WORD_MS)));

const easeOut = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

function useDraftClock(ref: React.RefObject<HTMLDivElement | null>) {
  const inView = useInView(ref, { amount: 0.45 });
  const reduce = useReducedMotion();
  const [t, setT] = useState(0);

  useEffect(() => {
    if (reduce) {
      setT(T.still);
      return;
    }
    if (!inView) {
      setT(0);
      return;
    }
    const start = performance.now();
    const id = window.setInterval(() => setT((performance.now() - start) % T.end), 50);
    return () => window.clearInterval(id);
  }, [inView, reduce]);

  return { t, fading: !reduce && t > T.end - 420 };
}

/* ---------- Small parts ---------- */

/** A citation marker. Always laid out, so the text never reflows when it lands. */
function Cite({ n, on }: { n: number; on: boolean }) {
  return (
    <motion.span
      initial={false}
      animate={on ? { scale: 1, opacity: 1 } : { scale: 0.4, opacity: 0 }}
      transition={on ? { type: "spring", stiffness: 520, damping: 22 } : { duration: 0.15 }}
      className="relative -top-[0.4em] ml-[0.2em] inline-flex h-[1.05rem] min-w-[1.05rem] items-center justify-center rounded-[5px] bg-cta px-1 align-baseline text-[0.6rem] font-semibold leading-none text-white tabular-nums"
    >
      {n}
    </motion.span>
  );
}

function Caret() {
  return (
    <span className="relative inline-block h-0 w-0">
      <span className="absolute -top-[0.92em] left-px h-[1.12em] w-[2px] rounded-full bg-cta motion-safe:animate-pulse" />
    </span>
  );
}

/**
 * A run of prose, streamed: the words still to come are laid out but unseen,
 * so nothing reflows as they land. A marker is bound to the word before it,
 * so it never wraps onto a line of its own.
 */
function Stream({ units, shown, writing }: { units: Unit[]; shown: number; writing: boolean }) {
  const out: ReactNode[] = [];
  const word = (i: number, text: string) => (
    <span
      className={cn("transition-opacity duration-150", i < shown ? "opacity-100" : "opacity-0")}
    >
      {text}
    </span>
  );
  for (let i = 0; i < units.length; i++) {
    const u = units[i];
    if (writing && i === shown) out.push(<Caret key="caret" />);
    if ("cite" in u) {
      out.push(<Cite key={i} n={u.cite} on={i < shown} />);
      continue;
    }
    const lead = u.word.slice(0, u.word.length - u.word.trimStart().length);
    const next = units[i + 1];
    if (next && "cite" in next) {
      out.push(
        lead,
        <span key={i} className="whitespace-nowrap">
          {word(i, u.word.trimStart())}
          {writing && i + 1 === shown && <Caret />}
          <Cite n={next.cite} on={i + 1 < shown} />
        </span>,
      );
      i++;
    } else {
      out.push(lead, <span key={i}>{word(i, u.word.trimStart())}</span>);
    }
  }
  return <>{out}</>;
}

/** Shimmering lines over a block that hasn't been written yet. */
function Pending({ on, lines }: { on: boolean; lines: number[] }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 flex flex-col justify-center gap-2 transition-opacity duration-300",
        on ? "opacity-100" : "opacity-0",
      )}
    >
      {lines.map((w, i) => (
        <span
          key={i}
          className="block h-2 rounded-full bg-ink/[0.06] motion-safe:animate-pulse"
          style={{ width: `${w * 100}%` }}
        />
      ))}
    </div>
  );
}

function Tick({ done, className }: { done: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
        done ? "bg-success/15 text-success" : "border border-dashed border-ink/20 text-transparent",
        className,
      )}
    >
      <Check className="h-2.5 w-2.5" strokeWidth={3} />
    </span>
  );
}

type Phase = "research" | "writing" | "ready";

function Status({ phase }: { phase: Phase }) {
  return (
    <span className="flex items-center gap-1.5 text-[0.7rem] font-medium text-muted-foreground">
      <span className="relative flex h-1.5 w-1.5">
        {phase !== "ready" && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-cta/60 motion-safe:animate-ping" />
        )}
        <span
          className={cn(
            "relative inline-flex h-1.5 w-1.5 rounded-full transition-colors duration-300",
            phase === "ready" ? "bg-success" : "bg-cta",
          )}
        />
      </span>
      {phase === "research" ? (
        <span>
          Researching<span className="hidden sm:inline"> the live web</span>
        </span>
      ) : phase === "writing" ? (
        "Writing the draft"
      ) : (
        "Draft ready"
      )}
    </span>
  );
}

/* ---------- The rails ---------- */

function OutlineRail({ t }: { t: number }) {
  /* When each section is in hand, and while which one is being written. */
  const done = [T.title, T.answerEnd, T.who, T.whoEnd, T.ready + 150, T.ready + 300];
  const active =
    t >= T.answer && t < T.answerEnd
      ? 1
      : t >= T.list && t < T.who
        ? 2
        : t >= T.who && t < T.whoEnd
          ? 3
          : -1;

  return (
    <aside className="hidden border-r border-ink/[0.06] bg-[color-mix(in_oklab,var(--surface)_55%,white)] p-3 lg:block">
      <p className="px-2 pb-1.5 pt-1 text-[0.65rem] font-medium text-muted-foreground">Outline</p>
      <ul className="space-y-0.5">
        {OUTLINE.map((o, i) => {
          const shown = t >= 900 + i * 170;
          const on = i === active;
          return (
            <li
              key={o.label}
              className={cn(
                "relative flex items-center gap-2 rounded-lg px-2 py-1.5 transition-[opacity,transform] duration-300",
                shown ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0",
              )}
            >
              {on && (
                <motion.span
                  layoutId="writer-outline"
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  className="absolute inset-0 rounded-lg bg-cta-soft shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--cta)_16%,transparent)]"
                />
              )}
              <span
                className={cn(
                  "relative w-7 shrink-0 font-mono text-[0.58rem] font-semibold",
                  on ? "text-cta" : "text-muted-foreground",
                )}
              >
                {o.tag}
              </span>
              <span
                className={cn(
                  "relative min-w-0 flex-1 truncate text-[0.74rem] font-medium",
                  on ? "text-cta" : "text-ink/75",
                )}
              >
                {o.label}
              </span>
              <Tick done={t >= done[i]} className="relative" />
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

function Favicon({ source }: { source: Source }) {
  return (
    <span
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[0.6rem] font-bold uppercase",
        source.skipped
          ? "border-ink/[0.07] bg-ink/[0.03] text-muted-foreground"
          : "border-ink/[0.08] bg-white text-ink/70",
      )}
    >
      {source.skipped ? <X className="h-2.5 w-2.5" strokeWidth={3} /> : source.domain?.[0]}
    </span>
  );
}

function SourceRow({ source, i, t }: { source: Source; i: number; t: number }) {
  const shown = t >= sourceIn(i);
  const read = t >= sourceRead(i);
  const citedAt = source.n ? CITED_AT[source.n] : undefined;
  const cited = citedAt !== undefined && t >= citedAt;
  const flash = cited && t < (citedAt ?? 0) + 1300;

  return (
    <li
      className={cn(
        "rounded-lg border bg-white px-2.5 py-2 transition-[opacity,transform,border-color,box-shadow] duration-500",
        shown ? "translate-y-0" : "translate-y-1.5",
        !shown ? "opacity-0" : source.skipped && read ? "opacity-55" : "opacity-100",
        flash
          ? "border-cta/40 shadow-[0_0_0_3px_color-mix(in_oklab,var(--cta)_12%,transparent)]"
          : "border-ink/[0.07]",
      )}
    >
      <div className="flex items-center gap-2">
        <Favicon source={source} />
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-[0.72rem] font-medium text-ink",
            source.skipped && read && "line-through decoration-ink/30",
          )}
        >
          {source.domain ?? source.kind}
        </span>
        {!read ? (
          <span className="flex items-center gap-1 text-[0.6rem] font-medium text-muted-foreground">
            <span className="h-1 w-1 rounded-full bg-cta motion-safe:animate-pulse" />
            Reading
          </span>
        ) : source.skipped ? (
          <span className="rounded-md bg-ink/[0.05] px-1.5 py-0.5 text-[0.6rem] font-semibold text-muted-foreground">
            Skipped
          </span>
        ) : cited ? (
          <span className="inline-flex shrink-0 items-center gap-1 text-[0.6rem] font-semibold text-cta">
            <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-[4px] bg-cta px-0.5 tabular-nums text-white">
              {source.n}
            </span>
            Cited
          </span>
        ) : (
          <span className="rounded-md border border-ink/[0.08] px-1.5 py-0.5 text-[0.6rem] font-medium text-muted-foreground">
            Read
          </span>
        )}
      </div>
      <p className="mt-1 truncate pl-7 text-[0.66rem] text-muted-foreground">{source.title}</p>
    </li>
  );
}

function SourcesRail({ t }: { t: number }) {
  const searched = Math.round(SEARCHED * easeOut(t / T.research));
  const cited = SOURCES.filter((s) => s.n && t >= CITED_AT[s.n]).length;
  const original = t >= T.ready + 600;

  return (
    <aside className="hidden flex-col border-l border-ink/[0.06] bg-[color-mix(in_oklab,var(--surface)_55%,white)] p-3 md:flex">
      <div className="flex items-center justify-between gap-2 px-1 pb-2 pt-1">
        <span className="text-[0.65rem] font-medium text-muted-foreground">Sources</span>
        <span className="text-[0.62rem] tabular-nums text-muted-foreground">
          {searched} searched · {cited} cited
        </span>
      </div>
      <ul className="space-y-1.5">
        {SOURCES.map((s, i) => (
          <SourceRow key={s.domain ?? s.kind} source={s} i={i} t={t} />
        ))}
      </ul>
      {/* The searches behind them, run first. */}
      <p className="px-1 pb-1.5 pt-3.5 text-[0.65rem] font-medium text-muted-foreground">
        Searches
      </p>
      <ul className="space-y-1 px-1">
        {QUERIES.map((q, i) => (
          <li
            key={q}
            className={cn(
              "flex items-center gap-1.5 text-[0.66rem] text-ink/70 transition-opacity duration-300",
              t >= 80 + i * 260 ? "opacity-100" : "opacity-0",
            )}
          >
            <Search className="h-3 w-3 shrink-0 text-muted-foreground" />
            <span className="truncate">{q}</span>
          </li>
        ))}
      </ul>
      <div className="min-h-3 flex-1" />
      <div className="flex items-center justify-between gap-2 rounded-lg border border-ink/[0.07] bg-white px-2.5 py-2">
        <span className="text-[0.68rem] font-medium text-ink">Plagiarism check</span>
        {original ? (
          <span className="inline-flex items-center gap-1 text-[0.62rem] font-semibold text-success">
            <Check className="h-3 w-3" strokeWidth={3} />
            Original
          </span>
        ) : (
          <span className="text-[0.62rem] text-muted-foreground">After writing</span>
        )}
      </div>
    </aside>
  );
}

/* ---------- The draft ---------- */

/* The sample's headings are set as text, not heading tags, so the page's own
   outline (h1, then each section's h2) is the only one a crawler reads. */
function Heading({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <div className="relative">
      <span
        className={cn(
          "absolute left-0 top-1/2 block w-36 -translate-y-1/2 transition-opacity duration-300",
          on ? "opacity-0" : "opacity-100",
        )}
      >
        <span className="block h-2.5 rounded-full bg-ink/[0.08] motion-safe:animate-pulse" />
      </span>
      <p
        className={cn(
          "text-[0.92rem] font-semibold tracking-tight text-ink transition-[opacity,filter] duration-500",
          on ? "opacity-100 blur-[0px]" : "opacity-0 blur-[3px]",
        )}
      >
        {children}
      </p>
    </div>
  );
}

function Draft({ t }: { t: number }) {
  const answerShown = shownAt(t, T.answer, ANSWER_UNITS.length);
  const whoShown = shownAt(t, T.whoText, WHO_UNITS.length);
  const writingAnswer = t >= T.answer && t < T.answerEnd + 200;
  const writingWho = t >= T.whoText && t < T.whoEnd + 200;
  const titled = t >= T.title;

  return (
    <div className="relative min-w-0 px-5 pb-6 pt-5 sm:px-8 sm:pt-6">
      <span className="inline-flex max-w-full items-center gap-1.5 rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.66rem] font-semibold text-cta">
        <Search className="h-3 w-3 shrink-0" />
        <span className="truncate">{TOPIC}</span>
      </span>

      <div className="relative mt-3">
        <Pending on={!titled} lines={[0.92, 0.5]} />
        <div
          className={cn(
            "transition-[opacity,filter] duration-500",
            titled ? "opacity-100 blur-[0px]" : "opacity-0 blur-[3px]",
          )}
        >
          <p className="text-[1.12rem] font-semibold leading-snug tracking-tight text-ink sm:text-[1.22rem]">
            {TITLE}
          </p>
          <p className="mt-1.5 text-[0.68rem] text-muted-foreground">
            11 min read · English · Your brand voice
          </p>
        </div>
      </div>

      {/* The answer block: the part an answer engine can lift whole. */}
      <div className="relative mt-4 rounded-r-lg border-l-2 border-cta bg-[color-mix(in_oklab,var(--cta)_5%,white)] py-3 pl-4 pr-3">
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-cta">
          Answer block
        </p>
        <div className="relative mt-1.5">
          <Pending on={t < T.answer} lines={[1, 0.95, 0.7]} />
          <p className="text-[0.82rem] leading-relaxed text-ink">
            <Stream units={ANSWER_UNITS} shown={answerShown} writing={writingAnswer} />
          </p>
        </div>
      </div>

      {/* The list is left out on phones, where the editor runs narrow. */}
      <div className="mt-4 hidden sm:block">
        <Heading on={t >= T.list}>What&rsquo;s new in 2.2</Heading>
        <ul className="relative mt-2 space-y-1.5">
          <Pending on={t < T.list} lines={[0.9, 0.84, 0.7]} />
          {NEW_IN_22.map((it, i) => {
            const on = t >= T.items[i];
            return (
              <li
                key={it.term}
                className={cn(
                  "flex gap-2 text-[0.8rem] leading-relaxed text-ink/80 transition-[opacity,transform] duration-500",
                  on ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
                )}
              >
                <span className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-ink/40" />
                <span>
                  <span className="font-semibold text-ink">{it.term}:</span>{" "}
                  {it.body.slice(0, it.body.lastIndexOf(" ") + 1)}
                  <span className="whitespace-nowrap">
                    {it.body.slice(it.body.lastIndexOf(" ") + 1)}
                    <Cite n={it.cite} on={on} />
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-4">
        <Heading on={t >= T.who}>{WHO_HEADING}</Heading>
        <div className="relative mt-2">
          <Pending on={t < T.whoText} lines={[1, 0.96, 0.62]} />
          <p className="text-[0.8rem] leading-relaxed text-ink/80">
            <Stream units={WHO_UNITS} shown={whoShown} writing={writingWho} />
          </p>
        </div>
      </div>

      {/* On phones the sources rail folds into a row of numbers. */}
      <div className="mt-4 flex flex-wrap gap-1.5 md:hidden">
        {SOURCES.filter((s) => s.n).map((s) => {
          const on = t >= CITED_AT[s.n as number];
          return (
            <span
              key={s.domain}
              className={cn(
                "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[0.62rem] font-medium transition-colors duration-300",
                on
                  ? "border-cta/25 bg-cta-soft text-cta"
                  : "border-ink/[0.07] bg-white text-muted-foreground",
              )}
            >
              <span className="font-semibold tabular-nums">[{s.n}]</span>
              {s.domain}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- The editor ---------- */

const TOOLS = [Heading2, Bold, Italic, Link2, Quote, List, ImageIcon];

function Toolbar() {
  return (
    <div className="hidden h-10 items-center gap-1 border-b border-ink/[0.06] px-3 md:flex">
      {[Undo2, Redo2].map((Icon, i) => (
        <span key={i} className="flex h-7 w-7 items-center justify-center rounded-md text-ink/35">
          <Icon className="h-3.5 w-3.5" />
        </span>
      ))}
      <span className="mx-1 h-4 w-px bg-ink/[0.08]" />
      {TOOLS.map((Icon, i) => (
        <span
          key={i}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md",
            i === 0 ? "bg-ink/[0.05] text-ink" : "text-ink/55",
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
      ))}
      <span className="ml-auto flex items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-md border border-ink/[0.08] bg-white px-2 py-1 text-[0.68rem] font-medium text-ink">
          English
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-cta-soft px-2 py-1 text-[0.68rem] font-semibold text-cta">
          <Sparkles className="h-3 w-3" />
          Your brand voice
        </span>
      </span>
    </div>
  );
}

function Footer({ t, phase }: { t: number; phase: Phase }) {
  const words =
    t < T.answer
      ? 0
      : t >= T.ready
        ? WORDS
        : Math.round((WORDS * (t - T.answer)) / (T.ready - T.answer));
  const extras = [
    { label: `${IMAGES} images`, at: T.ready },
    { label: `${INTERNAL_LINKS} internal links`, at: T.ready + 200 },
    { label: "Meta description", at: T.ready + 400 },
  ];
  const ready = phase === "ready";

  return (
    <div className="flex items-center gap-4 border-t border-ink/[0.06] bg-[color-mix(in_oklab,var(--surface)_55%,white)] px-4 py-2.5">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="whitespace-nowrap text-[0.72rem] font-semibold tabular-nums text-ink">
          {words.toLocaleString("en-US")} words
        </span>
        {/* Against the 3,500-word ceiling, with the 2,000–3,500 target shaded. */}
        <span className="relative hidden h-1.5 w-28 overflow-hidden rounded-full bg-ink/[0.06] sm:block">
          <span className="absolute inset-y-0 left-[57%] right-0 bg-success/15" />
          <span
            className="absolute inset-y-0 left-0 rounded-full bg-cta transition-[width] duration-200"
            style={{ width: `${(words / 3500) * 100}%` }}
          />
        </span>
        <span className="hidden text-[0.65rem] text-muted-foreground xl:inline">
          Target 2,000–3,500
        </span>
      </div>
      <div className="hidden items-center gap-1.5 lg:flex">
        {extras.map((e) => {
          const on = t >= e.at;
          return (
            <span
              key={e.label}
              className={cn(
                "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[0.65rem] font-medium transition-colors duration-300",
                on
                  ? "border-success/25 bg-success/10 text-success"
                  : "border-dashed border-ink/15 text-muted-foreground",
              )}
            >
              {on && <Check className="h-3 w-3" strokeWidth={3} />}
              {e.label}
            </span>
          );
        })}
      </div>
      <span
        className={cn(
          "inline-flex h-7 shrink-0 items-center gap-1 rounded-md px-2.5 text-[0.7rem] font-semibold transition-[background-color,color,box-shadow] duration-500",
          ready
            ? "bg-cta text-white shadow-[0_0_0_4px_color-mix(in_oklab,var(--cta)_14%,transparent)]"
            : "bg-ink/[0.05] text-muted-foreground",
        )}
      >
        Publish
        <ChevronRight className="h-3 w-3" />
      </span>
    </div>
  );
}

export function LiveDraft({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { t, fading } = useDraftClock(ref);
  const phase: Phase = t < T.research ? "research" : t < T.ready ? "writing" : "ready";

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`Sample: the Citation-Ready Writer researching the live web for ${SITE}, then drafting an article with an answer block, structured sections and inline citations to the sources it read.`}
      className={cn(
        "overflow-hidden rounded-xl bg-white text-left shadow-[0_1px_2px_rgba(16,24,40,0.05),0_32px_72px_-28px_rgba(16,40,96,0.4)] ring-1 ring-ink/[0.07]",
        className,
      )}
    >
      {/* Title bar */}
      <div className="flex h-12 items-center gap-2.5 border-b border-ink/[0.06] px-4">
        <Mark className="h-5 w-5 shrink-0 text-brand-blue" />
        <span className="text-[0.82rem] font-semibold text-ink">Writer</span>
        <span className="hidden min-w-0 items-center gap-1 text-[0.72rem] text-muted-foreground sm:flex">
          <ChevronRight className="h-3 w-3 shrink-0" />
          <span className="truncate">{SITE}/blog</span>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <span className="truncate font-medium text-ink">Draft</span>
        </span>
        <span className="ml-auto flex items-center gap-2.5">
          <Status phase={phase} />
          <span className="rounded-md border border-ink/[0.08] px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            Sample
          </span>
        </span>
      </div>

      <Toolbar />

      <div className={cn("transition-opacity duration-300", fading ? "opacity-0" : "opacity-100")}>
        <div className="grid md:grid-cols-[1fr_15rem] lg:grid-cols-[13.5rem_1fr_15rem]">
          <OutlineRail t={t} />
          <Draft t={t} />
          <SourcesRail t={t} />
        </div>
        <Footer t={t} phase={phase} />
      </div>
    </div>
  );
}
