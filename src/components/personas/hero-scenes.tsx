/**
 * The right half of each use-case hero: one product scene per page.
 *
 * Every page used to show the same ownership table here, so six heroes read
 * as one page with the words swapped. Each scene now plays its page's own
 * headline, on the surface that reader already lives in:
 *
 *   marketers         a content calendar that fills as drafts are approved
 *   solo-founders     their code editor, with the blog publishing in the corner
 *   seo-agencies      a deck of client sites, each written in its own voice
 *   ecommerce         a shopper's question, and the store's post that answers it
 *   saas              a Webflow collection filling, and the API behind it
 *   local-businesses  a working day, with the article going out at nine
 *
 * The rules are the feature showcases' (see showcase/kit): every scene is a
 * labelled sample on the site's fictional brands, starts on a fixed first
 * frame so server and client agree, idles while off screen, and holds its
 * most telling frame under reduced motion. Nothing here is an outcome — no
 * traffic, rankings, or citation counts — because a sample can't honestly
 * show one. The ownership split these replace lives on in the page body.
 *
 * Each scene is a picture as far as assistive tech is concerned: the stage
 * carries a description, and the moving parts inside it are not announced.
 */
import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from "react";
import {
  CalendarDays,
  Check,
  Coffee,
  Database,
  DoorOpen,
  Flame,
  GitCommitHorizontal,
  Layers,
  Loader2,
  Lock,
  Menu,
  MousePointer2,
  Plus,
  Sandwich,
  ShoppingBag,
  Wheat,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/brand/Mark";
import { ChatGPTMark } from "@/components/landing/ai-logos";
import { IntegrationLogo } from "@/components/dashboard/integration-logos";
import {
  Chip,
  Label,
  Meter,
  ProductWindow,
  Ring,
  useTypewriter,
  type Tone,
} from "@/components/features/showcase/kit";
import { PLAN, STUDIO } from "@/data/pricing";
import type { Persona } from "@/data/personas";

/* ---------- Motion ---------- */

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * True while the element is on screen. Unlike the kit's one-shot useInView
 * this turns back off, so a hero scrolled out of sight stops ticking.
 */
function useOnScreen<T extends Element>() {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOn(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, on] as const;
}

/**
 * Steps from `start` every `ms`, wrapping at `count` (pass Infinity for a
 * count that only climbs, when each step needs a key of its own). Reduced
 * motion parks on `rest`.
 */
function useSteps(
  count: number,
  ms: number,
  run: boolean,
  { start = 0, rest = count - 1 }: { start?: number; rest?: number } = {},
) {
  const [i, setI] = useState(start);
  useEffect(() => {
    if (!run) return;
    if (prefersReducedMotion()) {
      setI(rest);
      return;
    }
    const id = window.setInterval(() => setI((n) => (n + 1) % count), ms);
    return () => window.clearInterval(id);
  }, [count, ms, run, rest]);
  return i;
}

/**
 * Milliseconds into a looping timeline of `period`, sampled every `tick`, for
 * scenes that move continuously rather than in steps. Pausing off screen and
 * coming back resumes where it left off.
 */
function useLoop(
  period: number,
  run: boolean,
  { start = 0, rest = start, tick = 80 }: { start?: number; rest?: number; tick?: number } = {},
) {
  const [ms, setMs] = useState(start);
  const current = useRef(start);
  useEffect(() => {
    if (!run) return;
    if (prefersReducedMotion()) {
      setMs(rest);
      return;
    }
    const t0 = performance.now() - current.current;
    const id = window.setInterval(() => {
      current.current = (performance.now() - t0) % period;
      setMs(current.current);
    }, tick);
    return () => window.clearInterval(id);
  }, [period, run, rest, tick]);
  return ms;
}

/* ---------- Stage parts ---------- */

/** One height for every scene, so the six heroes share a fold. */
function Stage({
  stageRef,
  label,
  children,
}: {
  stageRef: Ref<HTMLDivElement>;
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      ref={stageRef}
      role="img"
      aria-label={label}
      className="relative h-[28rem] w-full sm:h-[30rem]"
    >
      {children}
    </div>
  );
}

/** A satellite card's slow drift. Offsets the phase so no two float in step. */
function Float({
  children,
  className,
  phase = 0,
}: {
  children: ReactNode;
  className?: string;
  phase?: number;
}) {
  return (
    <div className={cn("absolute z-10", className)}>
      <div className="animate-hero-float" style={{ animationDelay: `${-phase}s` }}>
        {children}
      </div>
    </div>
  );
}

const CARD =
  "rounded-xl border border-border bg-card text-ink shadow-elevation-lg ring-1 ring-ink/5";

function SampleTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "rounded-full border border-border px-1.5 py-px text-[0.52rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground",
        className,
      )}
    >
      Sample
    </span>
  );
}

/** A settings switch, blue when on. */
function Switch({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors duration-500",
        on ? "bg-cta" : "bg-secondary ring-1 ring-border",
      )}
    >
      <span
        className={cn(
          "absolute h-3 w-3 rounded-full bg-white shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          on ? "translate-x-3.5" : "translate-x-0.5",
        )}
      />
    </span>
  );
}

/* A line of body copy in a mock page: the text's shape without the words. */
function TextBar({ w }: { w: string }) {
  return <span className="block h-1.5 rounded-full bg-secondary" style={{ width: w }} />;
}

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/* ================================================================== */
/* Marketers — the calendar fills, the backlog empties                */
/* ================================================================== */

const CAL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const CAL_DATES = [12, 13, 14, 15, 16, 19, 20, 21, 22, 23];
const CAL_TODAY = 2;
const CAL_DRAFTS = [
  { title: "Kanban vs Gantt for small teams", score: 94 },
  { title: "How to run a weekly planning meeting", score: 91 },
  { title: "Best planning tools for agencies", score: 96 },
  { title: "How to stop scope creep", score: 92 },
  { title: "Sprint planning, step by step", score: 95 },
  { title: "Roadmap vs project plan", score: 90 },
  { title: "Async standups that actually work", score: 93 },
  { title: "Estimating without guessing", score: 94 },
  { title: "Capacity planning for small teams", score: 91 },
  { title: "A quarterly planning template", score: 96 },
];
/** Already on the calendar when the scene opens. */
const CAL_START = 3;
/* Two steps a draft (waiting, then approved), a beat on the full calendar,
   and a last step that fades the new slots out before the loop restarts. */
const CAL_STEPS = (CAL_DRAFTS.length - CAL_START) * 2 + 3;

function CalendarScene() {
  const [ref, on] = useOnScreen<HTMLDivElement>();
  const t = useSteps(CAL_STEPS, 1000, on, { rest: CAL_STEPS - 2 });
  const total = CAL_DRAFTS.length;
  const filled = Math.min(total, CAL_START + Math.floor(t / 2));
  const clearing = t === CAL_STEPS - 1;
  const pressing = t % 2 === 1 && filled < total;
  const next = CAL_DRAFTS[filled];
  const backlog = total - filled;

  return (
    <Stage
      stageRef={ref}
      label="Sample content calendar: each scored draft you approve takes the next open publishing slot, until the backlog is empty."
    >
      <ProductWindow
        title="Content calendar"
        icon={CalendarDays}
        className="absolute inset-x-0 bottom-16 top-0 sm:left-8"
      >
        <div className="flex flex-1 flex-col p-4 pb-14 sm:p-5 sm:pb-14">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-ink">
              Oct 12 – 23
              <span className="ml-2 font-normal text-muted-foreground">plannora.io/blog</span>
            </p>
            {backlog > 0 ? (
              <Chip tone="warning">Backlog {backlog}</Chip>
            ) : (
              <Chip tone="success" dot>
                Backlog clear
              </Chip>
            )}
          </div>

          <div className="mt-3 grid grid-cols-5 gap-1.5 text-center text-[0.58rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            {CAL_DAYS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="mt-1.5 grid flex-1 grid-cols-5 grid-rows-2 gap-1.5">
            {CAL_DATES.map((date, i) => {
              const draft = CAL_DRAFTS[i];
              const isFilled = i < filled;
              const live = i <= CAL_TODAY;
              const latest = i === filled - 1 && t > 0 && !clearing;
              return (
                <div
                  key={date}
                  className={cn(
                    "relative flex min-w-0 flex-col rounded-lg p-1.5 transition-all duration-500",
                    isFilled
                      ? "bg-surface/70 ring-1 ring-border"
                      : "border border-dashed border-border/90",
                    i === CAL_TODAY && "ring-2 ring-cta/30",
                    latest && "ring-2 ring-cta",
                  )}
                >
                  <span
                    className={cn(
                      "text-[0.62rem] font-semibold tabular-nums",
                      i === CAL_TODAY ? "text-cta" : "text-muted-foreground",
                    )}
                  >
                    {date}
                  </span>
                  {isFilled ? (
                    <div
                      key={`${date}-in`}
                      className={cn(
                        "mt-1 flex flex-1 flex-col rounded-md bg-card p-1.5 shadow-sm ring-1 ring-border transition-opacity duration-500 animate-in fade-in zoom-in-90",
                        clearing && i >= CAL_START && "opacity-0",
                      )}
                    >
                      <span
                        className={cn("h-1 w-5 rounded-full", live ? "bg-success" : "bg-cta")}
                      />
                      <span className="mt-1.5 hidden text-[0.6rem] font-medium leading-[1.3] text-ink sm:line-clamp-3">
                        {draft.title}
                      </span>
                      <span className="mt-1.5 flex flex-col gap-1 sm:hidden">
                        <span className="h-1 w-full rounded-full bg-secondary" />
                        <span className="h-1 w-2/3 rounded-full bg-secondary" />
                      </span>
                      <span
                        className={cn(
                          "mt-auto pt-1 text-[0.52rem] font-semibold uppercase tracking-[0.06em]",
                          live ? "text-success" : "text-cta",
                        )}
                      >
                        {live ? "Live" : "Queued"}
                      </span>
                    </div>
                  ) : (
                    <span className="flex flex-1 items-center justify-center text-border">
                      <Plus className="h-3 w-3" />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </ProductWindow>

      {/* The approve queue: the one thing on the page that waits for the reader. */}
      <Float className="bottom-0 left-0 right-4 sm:right-auto sm:w-[21rem]" phase={1.2}>
        <div className={cn(CARD, "p-3.5")}>
          <Label right={backlog > 0 ? `${backlog} waiting` : undefined}>
            {backlog > 0 ? "Draft ready · your call" : "Approve queue"}
          </Label>
          {next ? (
            <div
              key={filled}
              className="mt-2 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-1"
            >
              <Ring value={next.score} size={42} tone="success" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.82rem] font-semibold text-ink">{next.title}</p>
                <p className="mt-0.5 truncate text-[0.66rem] text-muted-foreground">
                  SEO + GEO scored · sourced · your voice
                </p>
              </div>
              <span className="relative shrink-0">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-lg bg-cta px-2.5 py-1.5 text-[0.68rem] font-semibold text-white shadow-sm transition-transform duration-200",
                    pressing && "scale-90 bg-cta-hover",
                  )}
                >
                  <Check className="h-3 w-3" strokeWidth={3} /> Approve
                </span>
                <MousePointer2
                  className={cn(
                    "absolute -bottom-3 right-1 h-4 w-4 fill-ink text-white drop-shadow transition-transform duration-300",
                    pressing
                      ? "translate-x-0 translate-y-0 scale-90"
                      : "translate-x-2 translate-y-2",
                  )}
                  strokeWidth={1.5}
                />
              </span>
            </div>
          ) : (
            <div className="mt-2 flex items-center gap-3 animate-in fade-in">
              <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                <Check className="h-5 w-5" strokeWidth={3} />
              </span>
              <div className="min-w-0">
                <p className="text-[0.82rem] font-semibold text-ink">Every draft has a date</p>
                <p className="mt-0.5 text-[0.66rem] text-muted-foreground">
                  Nothing went on the calendar you didn&rsquo;t approve.
                </p>
              </div>
            </div>
          )}
        </div>
      </Float>
    </Stage>
  );
}

/* ================================================================== */
/* Solo founders — you stay in the code, the blog ships itself       */
/* ================================================================== */

type Tok = [string, string?];
const KW = "text-violet-300";
const FN = "text-sky-300";
const STR = "text-emerald-300";
const DIM = "text-white/40";

const CODE: Tok[][] = [
  [["import", KW], [" { meter } "], ["from", KW], [' "./usage"', STR], [";"]],
  [],
  [["export async function", KW], [" invoice", FN], ["(team: Team) {"]],
  [["  const", KW], [" usage = "], ["await", KW], [" meter."], ["read", FN], ["(team.id);"]],
  [["  const", KW], [" total = "], ["price", FN], ["(usage, team.plan);"]],
  [["  return", KW], [" billing."], ["charge", FN], ["(team, total);"]],
  [["}"]],
  [],
  [["export function", KW], [" price", FN], ["(usage: Usage, plan: Plan) {"]],
  [["  const", KW], [" base = plan.monthly;"]],
  [
    ["  const", KW],
    [" extra = "],
    ["Math", FN],
    ["."],
    ["max", FN],
    ["(0, usage.calls - plan.included);"],
  ],
  [["  return", KW], [" base + extra * plan.perCall;"]],
  [["}"]],
  [],
  [["// annual plans: two months free", DIM]],
];
const TYPING = "export const annual = (p: Plan) => p.monthly * 10;";

interface Note {
  kind: string;
  tone: Tone;
  title: string;
  meta: string;
}

const NOTES: Note[] = [
  {
    kind: "Published",
    tone: "success",
    title: "How to price a developer tool",
    meta: "loopcraft.ai/blog · 9:00 AM",
  },
  {
    kind: "Draft ready",
    tone: "volt",
    title: "Usage-based pricing, explained",
    meta: "Scored 93 · waiting for your OK",
  },
  {
    kind: "Published",
    tone: "success",
    title: "Webhooks vs polling: which to use?",
    meta: "loopcraft.ai/blog · 9:00 AM",
  },
  {
    kind: "Topic map",
    tone: "muted",
    title: "8 new buyer questions found",
    meta: "Approve them whenever you surface",
  },
];
const NOTE_GAP_REM = 5.4;

function EditorScene() {
  const [ref, on] = useOnScreen<HTMLDivElement>();
  const n = useSteps(Infinity, 2800, on, { start: 1, rest: 2 });
  const { typed, typing } = useTypewriter(TYPING, { speed: 55, hold: 2400, run: on });
  const latest = NOTES[n % NOTES.length];
  const shown = Array.from({ length: Math.min(n + 1, 4) }, (_, d) => n - d);

  return (
    <Stage
      stageRef={ref}
      label="Sample: a founder's code editor, with Rankbox notifications arriving as articles publish to their blog."
    >
      {/* The founder's own window: dark, busy, and nothing to do with content. */}
      <div className="absolute inset-y-6 left-0 right-6 flex flex-col overflow-hidden rounded-xl bg-hero-black text-white shadow-elevation-lg ring-1 ring-white/10 sm:right-16">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
          <span className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-2.5 w-2.5 rounded-full bg-white/15" />
            ))}
          </span>
          <span className="ml-3 rounded-md bg-white/10 px-2 py-0.5 font-mono text-[0.62rem] text-white/85">
            billing.ts
          </span>
          <span className="font-mono text-[0.62rem] text-white/35">pricing.tsx</span>
          <SampleTag className="ml-auto border-white/15 text-white/45" />
        </div>
        <pre className="flex-1 overflow-hidden px-4 py-4 font-mono text-[0.66rem] leading-[1.75] text-white/80 sm:text-[0.7rem]">
          {CODE.map((line, i) => (
            <div key={i} className="flex whitespace-pre">
              <span className="mr-4 inline-block w-4 shrink-0 select-none text-right text-white/25">
                {i + 1}
              </span>
              <span>
                {line.map(([text, cls], j) => (
                  <span key={j} className={cls}>
                    {text}
                  </span>
                ))}
              </span>
            </div>
          ))}
          <div className="flex whitespace-pre">
            <span className="mr-4 inline-block w-4 shrink-0 select-none text-right text-white/25">
              {CODE.length + 1}
            </span>
            <span>
              {typed}
              <span
                className={cn(
                  "ml-px inline-block h-3 w-[2px] translate-y-0.5 bg-sky-300",
                  !typing && "motion-safe:animate-pulse",
                )}
              />
            </span>
          </div>
        </pre>
        <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-[0.6rem] text-white/45">
          <span className="flex items-center gap-1.5">
            <GitCommitHorizontal className="h-3 w-3" /> main · 4 commits today
          </span>
          <span>TypeScript</span>
        </div>
      </div>

      {/* Rankbox, working in the corner of the founder's screen. */}
      <div className="absolute right-0 top-0 z-10 w-[15rem] sm:w-[17rem]">
        {shown.map((k) => {
          const d = n - k;
          const note = NOTES[k % NOTES.length];
          return (
            <div
              key={k}
              className={cn(
                CARD,
                "absolute inset-x-0 top-0 flex gap-2.5 p-3 transition-[transform,opacity] duration-700 animate-in fade-in slide-in-from-top-6",
                EASE,
              )}
              style={{
                transform: `translateY(${d * NOTE_GAP_REM}rem) scale(${1 - d * 0.04})`,
                opacity: d >= 3 ? 0 : 1,
                zIndex: 10 - d,
              }}
            >
              {/* Older notes dim their content, not the card: a see-through
                  card lets the code behind it tangle with the text. */}
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-blue text-white transition-opacity duration-700",
                  d > 0 && "opacity-50",
                )}
              >
                <Mark className="h-4 w-4" />
              </span>
              <div
                className={cn(
                  "min-w-0 flex-1 transition-opacity duration-700",
                  d === 1 && "opacity-70",
                  d >= 2 && "opacity-45",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[0.62rem] font-semibold text-muted-foreground">
                    Rankbox · {d === 0 ? "now" : `${d * 3}h ago`}
                  </span>
                  <Chip tone={note.tone}>{note.kind}</Chip>
                </div>
                <p className="mt-1 truncate text-[0.78rem] font-semibold text-ink">{note.title}</p>
                <p className="truncate text-[0.64rem] text-muted-foreground">{note.meta}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* The cadence, which is the whole point for a team of one. */}
      <Float className="bottom-0 right-0 w-[13rem]" phase={2}>
        <div className={cn(CARD, "p-3")}>
          <Label right="14 days">Blog cadence</Label>
          <div className="mt-2 grid grid-cols-7 gap-1">
            {Array.from({ length: 14 }).map((_, i) => {
              const today = i === 13;
              const done = !today || latest.kind === "Published";
              return (
                <span
                  key={i}
                  className={cn(
                    "h-3.5 rounded-[4px] transition-colors duration-500",
                    done ? "bg-success/80" : "bg-card ring-1 ring-success/50",
                    today && "motion-safe:animate-pulse",
                  )}
                />
              );
            })}
          </div>
          <p className="mt-2 text-[0.64rem] text-muted-foreground">
            <span className="font-semibold text-ink">Published daily</span> · you opened it twice
          </p>
        </div>
      </Float>
    </Stage>
  );
}

/* ================================================================== */
/* SEO agencies — a book of clients, each in its own voice            */
/* ================================================================== */

interface Client {
  domain: string;
  name: string;
  color: string;
  voice: string;
  line: string;
  published: number;
  /** In review (flips to published on the card's turn), published, scheduled. */
  articles: [string, string, string];
}

const CLIENTS: Client[] = [
  {
    domain: "summithvac.co",
    name: "Summit HVAC",
    color: "#EA580C",
    voice: "Plain-spoken",
    line: "Change the filter every 90 days. It's the cheapest repair you'll ever make.",
    published: 18,
    articles: [
      "How often should you service an AC?",
      "Heat pump or furnace for a cold winter?",
      "Why is my AC blowing warm air?",
    ],
  },
  {
    domain: "verduregoods.com",
    name: "Verdure Goods",
    color: "#16A34A",
    voice: "Warm",
    line: "Good produce starts long before market day, with soil you can smell.",
    published: 21,
    articles: [
      "How to store leafy greens so they last",
      "What does “regenerative” actually mean?",
      "What's in season this October?",
    ],
  },
  {
    domain: "answerdesk.io",
    name: "Answerdesk",
    color: "#4F46E5",
    voice: "Technical",
    line: "Route by intent, not by keyword. Your queue will thank you by Friday.",
    published: 15,
    articles: [
      "Ticket routing rules that scale",
      "SLA vs SLO: what support teams mean",
      "How to write a macro customers don't hate",
    ],
  },
  {
    domain: "keystonefm.com",
    name: "Keystone FM",
    color: "#0F766E",
    voice: "Formal",
    line: "A planned maintenance schedule reduces reactive call-outs across a portfolio.",
    published: 12,
    articles: [
      "Planned vs reactive maintenance",
      "What a facilities audit should cover",
      "How to budget for building maintenance",
    ],
  },
  {
    domain: "pinecrestdental.com",
    name: "Pinecrest Dental",
    color: "#DB2777",
    voice: "Reassuring",
    line: "Most people put off a check-up because of one bad visit. Let's replace it.",
    published: 24,
    articles: [
      "How often should you see a dentist?",
      "Is whitening safe for sensitive teeth?",
      "What happens at a first cleaning?",
    ],
  },
];

function ClientTile({ client, className }: { client: Client; className?: string }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg font-display font-bold text-white",
        className,
      )}
      style={{ backgroundColor: client.color }}
    >
      {client.name.charAt(0)}
    </span>
  );
}

function ClientCard({ client, fresh }: { client: Client; fresh: boolean }) {
  const count = client.published + (fresh ? 1 : 0);
  return (
    <div className={cn(CARD, "flex h-full flex-col p-4 sm:p-5")}>
      <div className="flex items-center gap-3">
        <ClientTile client={client} className="h-10 w-10 text-base" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{client.name}</p>
          <p className="truncate font-mono text-[0.66rem] text-muted-foreground">{client.domain}</p>
        </div>
        <Chip tone="volt">{client.voice}</Chip>
      </div>

      <div className="mt-4 rounded-lg border border-border bg-surface/60 p-3">
        <Label>In their voice</Label>
        <p className="mt-1.5 font-display text-[0.86rem] leading-snug text-ink">
          &ldquo;{client.line}&rdquo;
        </p>
      </div>

      <div className="mt-4">
        <Label right={`${count} of ${PLAN.articlesPerMonth}`}>October</Label>
        <Meter value={(count / PLAN.articlesPerMonth) * 100} tone="success" className="mt-2" />
      </div>

      <div className="mt-4 space-y-1.5">
        {client.articles.map((a, i) => {
          const [status, tone]: [string, Tone] =
            i === 2
              ? ["Scheduled", "volt"]
              : i === 1 || fresh
                ? ["Published", "success"]
                : ["In review", "muted"];
          return (
            <div
              key={a}
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg bg-card px-3 py-2 ring-1 ring-border",
                i === 2 && "hidden sm:flex",
              )}
            >
              <span className="min-w-0 truncate text-[0.74rem] font-medium text-ink">{a}</span>
              <Chip tone={tone} dot>
                {status}
              </Chip>
            </div>
          );
        })}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-3">
        <span className="text-[0.68rem] text-muted-foreground">
          Hold for your editor&rsquo;s sign-off
        </span>
        <Switch on />
      </div>
    </div>
  );
}

function ClientDeckScene() {
  const [ref, on] = useOnScreen<HTMLDivElement>();
  const steps = CLIENTS.length * 2;
  const t = useSteps(steps, 1700, on, { rest: 1 });
  const active = Math.floor(t / 2) % CLIENTS.length;
  const fresh = t % 2 === 1;
  const last = CLIENTS.length - 1;

  return (
    <Stage
      stageRef={ref}
      label="Sample: a deck of agency client sites cycling forward, each with its own brand voice, monthly publishing progress, and editor sign-off."
    >
      {/* The account rail: every client in one place. */}
      <div
        className={cn(
          CARD,
          "absolute left-0 top-14 flex w-14 flex-col items-center gap-2 px-2 py-3",
        )}
      >
        <span className="text-[0.5rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">
          {STUDIO.live ? STUDIO.name : "Sites"}
        </span>
        {CLIENTS.map((c, i) => (
          <ClientTile
            key={c.domain}
            client={c}
            className={cn(
              "h-8 w-8 text-xs transition-all duration-500",
              i === active ? "ring-2 ring-cta ring-offset-2 ring-offset-card" : "opacity-45",
            )}
          />
        ))}
        {STUDIO.live && (
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground">
            <Plus className="h-3.5 w-3.5" />
          </span>
        )}
      </div>

      {/* The deck. Depth is how far a card sits behind the active one; the
          card that just left drops away before rejoining at the back. Cards
          in the deck stay opaque and recede under a blue wash instead of
          fading, so no card's text ever shows through the one in front. */}
      <div className="absolute bottom-0 left-[4.5rem] right-0 top-16">
        {CLIENTS.map((c, i) => {
          const d = (i - active + CLIENTS.length) % CLIENTS.length;
          const style: CSSProperties =
            d === 0
              ? { transform: "none", opacity: 1 }
              : d <= 2
                ? { transform: `translateY(${-d * 0.85}rem) scale(${1 - d * 0.05})`, opacity: 1 }
                : d === last
                  ? { transform: "translateY(1.5rem) rotate(-3deg) scale(0.98)", opacity: 0 }
                  : { transform: "translateY(-2.4rem) scale(0.85)", opacity: 0 };
          return (
            <div
              key={c.domain}
              className={cn(
                "absolute inset-0 origin-top transition-[transform,opacity] duration-700",
                EASE,
              )}
              style={{ ...style, zIndex: CLIENTS.length - d }}
            >
              <ClientCard client={c} fresh={d === 0 && fresh} />
              <span
                className={cn(
                  "pointer-events-none absolute inset-0 rounded-xl bg-brand-blue transition-opacity duration-700",
                  d === 0 ? "opacity-0" : d === 1 ? "opacity-30" : "opacity-55",
                )}
              />
            </div>
          );
        })}
      </div>

      <Float className="right-0 top-0 sm:-right-3" phase={0.8}>
        <span className="flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-[0.68rem] font-semibold text-ink shadow-elevation-lg ring-1 ring-border">
          <Layers className="h-3.5 w-3.5 text-cta" />
          {STUDIO.live
            ? `${CLIENTS.length} client sites · one invoice`
            : "One plan per client site"}
          <SampleTag />
        </span>
      </Float>
    </Stage>
  );
}

/* ================================================================== */
/* E-commerce — the shopper asks, the store's own post answers        */
/* ================================================================== */

const SHOP_QUESTION = "Which beans are best for cold brew?";
const SHOP_PERIOD = 12500;
const SHOP_TYPE_START = 400;
const SHOP_TYPE_MS = 48;
const SHOP_TYPED_AT = SHOP_TYPE_START + SHOP_QUESTION.length * SHOP_TYPE_MS;

function PhoneScene() {
  const [ref, on] = useOnScreen<HTMLDivElement>();
  const ms = useLoop(SHOP_PERIOD, on, { start: 0, rest: 8200, tick: 60 });

  const chars = Math.max(
    0,
    Math.min(SHOP_QUESTION.length, Math.floor((ms - SHOP_TYPE_START) / SHOP_TYPE_MS)),
  );
  const typing = chars < SHOP_QUESTION.length;
  const linked = ms > SHOP_TYPED_AT + 200 && ms < 4700;
  const answered = ms > SHOP_TYPED_AT + 900;
  const scroll = ms > 10900 ? 0 : ms > 7600 ? 2 : ms > 4800 ? 1 : 0;
  const productLit = ms > 5400 && ms < 10900;
  const visible = ms > 7800 && ms < 11600;

  return (
    <Stage
      stageRef={ref}
      label="Sample: a shopper asks ChatGPT which coffee beans suit cold brew, and a buying guide on the Fernwood Coffee Shopify blog answers it, published hidden until the owner switches it on."
    >
      {/* The storefront, on the phone the shopper is holding. */}
      <div className="absolute bottom-0 right-0 top-0 w-[13.5rem] rounded-[2.3rem] bg-hero-black p-2 shadow-elevation-lg ring-1 ring-white/20 sm:right-3 sm:w-[15.5rem]">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[1.8rem] bg-card">
          <div className="flex items-center justify-between px-5 pb-1 pt-2.5 text-[0.58rem] font-semibold text-ink">
            <span>9:41</span>
            <span className="absolute left-1/2 top-2 h-4 w-16 -translate-x-1/2 rounded-full bg-hero-black" />
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-3 rounded-sm bg-ink/80" />
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-border px-4 py-2">
            <Menu className="h-3.5 w-3.5 text-ink" />
            <span className="text-[0.68rem] font-bold tracking-[0.22em] text-ink">FERNWOOD</span>
            <ShoppingBag className="h-3.5 w-3.5 text-ink" />
          </div>

          <div className="relative flex-1 overflow-hidden">
            <div
              className={cn("px-4 pb-6 pt-3.5 transition-transform duration-[1400ms]", EASE)}
              style={{ transform: `translateY(${-[0, 8.5, 13.5][scroll]}rem)` }}
            >
              <p className="text-[0.52rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Journal · Brewing guides
              </p>
              <p className="mt-1.5 font-display text-[1.02rem] font-bold leading-[1.15] text-ink">
                The best beans for cold brew, ranked
              </p>
              <p className="mt-1 text-[0.55rem] text-muted-foreground">6 min read</p>

              <div className="relative mt-3 flex h-24 items-center justify-center overflow-hidden rounded-xl bg-[linear-gradient(135deg,#3b2417,#8a5a36_55%,#c89560)]">
                {[
                  "left-[12%] top-[20%] rotate-[25deg]",
                  "left-[70%] top-[16%] -rotate-12",
                  "left-[22%] top-[64%] -rotate-[30deg]",
                  "left-[78%] top-[62%] rotate-45",
                  "left-[48%] top-[74%] rotate-12",
                ].map((pos) => (
                  <span
                    key={pos}
                    className={cn("absolute h-3.5 w-2.5 rounded-[50%] bg-[#2a170d]/70", pos)}
                  />
                ))}
                <Coffee className="relative h-8 w-8 text-white/85" strokeWidth={1.6} />
              </div>

              <div
                className={cn(
                  "mt-3 rounded-lg p-2.5 ring-1 transition-all duration-700",
                  answered ? "bg-cta-soft ring-cta/50" : "bg-surface/70 ring-border",
                )}
              >
                <p
                  className={cn(
                    "text-[0.52rem] font-bold uppercase tracking-[0.12em] transition-colors duration-700",
                    answered ? "text-cta" : "text-muted-foreground",
                  )}
                >
                  Quick answer
                </p>
                <p className="mt-1 text-[0.64rem] leading-snug text-ink">
                  Go medium-dark and grind coarse. Chocolatey, low-acid roasts hold up best to a
                  long, cold steep.
                </p>
              </div>

              <p className="mt-3.5 text-[0.74rem] font-semibold text-ink">1. Medium-dark blends</p>
              <div className="mt-2 space-y-1.5">
                <TextBar w="100%" />
                <TextBar w="92%" />
                <TextBar w="64%" />
              </div>

              <div
                className={cn(
                  "mt-3 flex items-center gap-2.5 rounded-lg bg-card p-2 ring-1 transition-all duration-700",
                  productLit ? "shadow-elevation-lg ring-cta/50" : "ring-border",
                )}
              >
                <span className="h-10 w-10 shrink-0 rounded-md bg-[linear-gradient(160deg,#c89560,#5a3620)]" />
                <div className="min-w-0">
                  <p className="text-[0.66rem] font-semibold text-ink">Cold Brew Blend</p>
                  <p className="text-[0.55rem] text-muted-foreground">Medium-dark · whole bean</p>
                  <p className="mt-0.5 text-[0.58rem] font-semibold text-cta">Shop the roast →</p>
                </div>
              </div>

              <p className="mt-3.5 text-[0.74rem] font-semibold text-ink">
                2. Single-origin Brazil
              </p>
              <div className="mt-2 space-y-1.5">
                <TextBar w="100%" />
                <TextBar w="88%" />
                <TextBar w="95%" />
                <TextBar w="52%" />
              </div>
              <p className="mt-3.5 text-[0.74rem] font-semibold text-ink">
                3. A decaf that holds up
              </p>
              <div className="mt-2 space-y-1.5">
                <TextBar w="97%" />
                <TextBar w="80%" />
                <TextBar w="90%" />
              </div>
            </div>
          </div>
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-card to-transparent" />
          <span className="absolute bottom-1.5 left-1/2 h-1 w-20 -translate-x-1/2 rounded-full bg-ink/25" />
        </div>
      </div>

      {/* The thread from the question to the paragraph that answers it. It
          draws down, turns, and lands on the Quick answer box, which sits at a
          fixed offset from the phone's left edge while the page is unscrolled. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-[7.5rem] right-[14.7rem] top-[9.4rem] hidden h-[10.3rem] transition-opacity duration-500 sm:block",
          linked ? "opacity-100" : "opacity-0",
        )}
      >
        <span
          className={cn(
            "absolute bottom-3 left-0 top-0 origin-top border-l-2 border-dashed border-white/85 transition-transform duration-300 ease-out",
            linked ? "scale-y-100" : "scale-y-0",
          )}
        />
        <span
          className={cn(
            "absolute bottom-0 left-0 h-3 w-3 rounded-bl-xl border-b-2 border-l-2 border-dashed border-white/85 transition-opacity delay-300 duration-100",
            linked ? "opacity-100" : "opacity-0",
          )}
        />
        <span
          className={cn(
            "absolute bottom-0 left-3 right-0 origin-left border-b-2 border-dashed border-white/85 transition-transform delay-300 duration-500 ease-out",
            linked ? "scale-x-100" : "scale-x-0",
          )}
        />
        <span
          className={cn(
            "absolute -bottom-[5px] -right-1 h-3 w-3 rounded-full bg-cta ring-2 ring-white transition-transform delay-700 duration-300",
            linked ? "scale-100" : "scale-0",
          )}
        />
      </div>

      {/* Where the shopper started: asking an AI, not browsing the shop. */}
      <Float className="left-0 top-8 w-[10.75rem] sm:w-[15rem]" phase={0.6}>
        <div className={cn(CARD, "p-3")}>
          <div className="flex items-center gap-1.5">
            <ChatGPTMark className="h-3.5 w-3.5" />
            <span className="text-[0.66rem] font-semibold text-ink">ChatGPT</span>
            <SampleTag className="ml-auto" />
          </div>
          <div className="mt-2.5 flex justify-end">
            <p className="min-h-[2.1rem] max-w-[95%] rounded-lg rounded-br-sm bg-secondary px-2.5 py-1.5 text-[0.72rem] leading-snug text-ink">
              {SHOP_QUESTION.slice(0, chars)}
              {typing && (
                <span className="ml-px inline-block h-3 w-px translate-y-0.5 motion-safe:animate-pulse bg-ink" />
              )}
            </p>
          </div>
          <p
            className={cn(
              "mt-2 flex items-center gap-1.5 text-[0.62rem] text-muted-foreground transition-opacity duration-500",
              typing ? "opacity-0" : "opacity-100",
            )}
          >
            <Loader2 className="h-3 w-3 motion-safe:animate-spin" />
            {answered ? "Looking for buying guides…" : "Searching the web…"}
          </p>
        </div>
      </Float>

      {/* The owner's side: blog only, and nothing visible until they say so. */}
      {/* On a phone it would sit on the Quick answer, so there it waits until
          the page has scrolled past it. */}
      <Float
        className={cn(
          "bottom-2 left-0 w-[11rem] transition-[opacity,translate] duration-500 sm:bottom-10 sm:left-4 sm:w-[15rem]",
          !(ms > 5000 && ms < 10900) && "max-sm:translate-y-2 max-sm:opacity-0",
        )}
        phase={2.4}
      >
        <div className={cn(CARD, "p-3")}>
          <div className="flex items-center gap-2">
            <IntegrationLogo id="shopify" title={false} className="h-6 w-6" />
            <div className="min-w-0">
              <p className="truncate text-[0.68rem] font-semibold text-ink">
                Fernwood Coffee · Blog
              </p>
              <p className="truncate text-[0.58rem] text-muted-foreground">
                Native post · your theme
              </p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between gap-2 rounded-lg bg-surface/70 px-2.5 py-2 ring-1 ring-border">
            <span className="text-[0.64rem] font-medium text-ink">
              {visible ? "Visible on your store" : "Published hidden"}
            </span>
            <Switch on={visible} />
          </div>
        </div>
      </Float>
    </Stage>
  );
}

/* ================================================================== */
/* SaaS — the collection fills on its own release train               */
/* ================================================================== */

interface CmsRow {
  title: string;
  type: string;
  slug: string;
  status: "Published" | "Scheduled" | "In review";
  score: number;
}

const CMS_ROWS: CmsRow[] = [
  {
    title: "Best planning tools for small teams",
    type: "Buying",
    slug: "best-planning-tools",
    status: "Published",
    score: 95,
  },
  {
    title: "Kanban vs Gantt: which fits a small team?",
    type: "Comparison",
    slug: "kanban-vs-gantt",
    status: "Published",
    score: 94,
  },
  {
    title: "Planning app or spreadsheet: when to switch?",
    type: "Comparison",
    slug: "app-vs-spreadsheet",
    status: "Published",
    score: 92,
  },
  {
    title: "How to plan a product launch timeline",
    type: "How-to",
    slug: "launch-timeline",
    status: "Published",
    score: 96,
  },
  {
    title: "Alternatives to spreadsheets for roadmaps",
    type: "Alternatives",
    slug: "roadmap-alternatives",
    status: "Scheduled",
    score: 93,
  },
  {
    title: "How to stop scope creep mid-project",
    type: "Fixing",
    slug: "stop-scope-creep",
    status: "In review",
    score: 91,
  },
  {
    title: "How do you run a weekly planning meeting?",
    type: "How-to",
    slug: "weekly-planning-meeting",
    status: "In review",
    score: 94,
  },
];
const CMS_START = 3;
const CMS_STEPS = (CMS_ROWS.length - CMS_START) * 2 + 4;
const STATUS_TONE: Record<CmsRow["status"], Tone> = {
  Published: "success",
  Scheduled: "volt",
  "In review": "muted",
};

function CmsScene() {
  const [ref, on] = useOnScreen<HTMLDivElement>();
  const t = useSteps(CMS_STEPS, 1300, on, { rest: CMS_STEPS - 2 });
  const n = Math.min(CMS_ROWS.length, CMS_START + Math.floor(t / 2));
  const syncing = t % 2 === 0 && CMS_START + Math.floor(t / 2) <= CMS_ROWS.length;
  /* The last step fades the new rows out, so the loop restarts softly. */
  const clearing = t === CMS_STEPS - 1;
  const rows = CMS_ROWS.slice(0, n).reverse();
  const newest = rows[0];

  return (
    <Stage
      stageRef={ref}
      label="Sample: Rankbox articles arriving in Plannora's Webflow CMS collection, with the same article returned by the Rankbox API."
    >
      <ProductWindow
        title="Webflow CMS"
        icon={Database}
        className="absolute inset-x-0 bottom-14 top-9 sm:left-6"
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <IntegrationLogo id="webflow" title={false} className="h-5 w-5" />
            <span className="truncate text-[0.78rem] font-semibold text-ink">Blog posts</span>
            <span className="text-[0.66rem] tabular-nums text-muted-foreground">{n} items</span>
          </div>
          <span className="flex shrink-0 items-center gap-1.5 text-[0.64rem] font-semibold text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> Synced
          </span>
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-3 border-b border-border bg-surface/60 px-4 py-1.5 text-[0.56rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground sm:grid-cols-[1fr_5.5rem_5.5rem]">
          <span>Name</span>
          <span className="hidden sm:block">Type</span>
          <span className="text-right sm:text-left">Status</span>
        </div>
        <div className="flex-1 overflow-hidden">
          {rows.map((r, i) => {
            const isSyncing = i === 0 && syncing;
            return (
              <div
                key={r.slug}
                className={cn(
                  "grid grid-cols-[1fr_auto] items-center gap-3 border-b border-border px-4 py-2.5 transition-[background-color,opacity] duration-700 sm:grid-cols-[1fr_5.5rem_5.5rem]",
                  i === 0 && "animate-in fade-in slide-in-from-top-2",
                  isSyncing ? "bg-cta-soft" : "bg-card",
                  clearing && n - 1 - i >= CMS_START && "opacity-0",
                )}
              >
                <span className="min-w-0 truncate text-[0.74rem] font-medium text-ink">
                  {r.title}
                </span>
                <span className="hidden truncate text-[0.66rem] text-muted-foreground sm:block">
                  {r.type}
                </span>
                <span className="flex justify-end sm:justify-start">
                  {isSyncing ? (
                    <span className="inline-flex items-center gap-1 text-[0.6rem] font-semibold uppercase tracking-[0.06em] text-cta">
                      <Loader2 className="h-3 w-3 motion-safe:animate-spin" /> Syncing
                    </span>
                  ) : (
                    <Chip tone={STATUS_TONE[r.status]} dot>
                      {r.status}
                    </Chip>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </ProductWindow>

      {/* What an engineer sees instead, if the site is custom-built. */}
      <Float className="bottom-0 left-0 w-[15rem] sm:-left-3 sm:w-[17.5rem]" phase={1.6}>
        <div className="overflow-hidden rounded-xl bg-hero-black font-mono text-[0.62rem] leading-relaxed text-white/80 shadow-elevation-lg ring-1 ring-white/10">
          <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
            <span className="rounded bg-success/20 px-1.5 py-0.5 text-[0.56rem] font-semibold text-emerald-300">
              GET
            </span>
            <span className="truncate text-white/60">/api/public/v1/articles</span>
            <span className="ml-auto text-emerald-300">200</span>
          </div>
          <div key={newest.slug} className="px-3 py-2.5 animate-in fade-in">
            <p>{"{"}</p>
            <p className="truncate pl-3">
              &quot;title&quot;: <span className="text-sky-300">&quot;{newest.title}&quot;</span>,
            </p>
            <p className="truncate pl-3">
              &quot;slug&quot;: <span className="text-sky-300">&quot;{newest.slug}&quot;</span>,
            </p>
            <p className="pl-3">
              &quot;seo_score&quot;: <span className="text-amber-300">{newest.score}</span>
            </p>
            <p>{"}"}</p>
          </div>
        </div>
      </Float>

      <Float className="right-0 top-0 sm:-right-2" phase={0.4}>
        <span className="flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-[0.68rem] font-semibold text-ink shadow-elevation-lg ring-1 ring-border">
          <GitCommitHorizontal className="h-3.5 w-3.5 text-cta" />
          v2.4 shipped · 3 use-case topics added
        </span>
      </Float>
    </Stage>
  );
}

/* ================================================================== */
/* Local businesses — a working day, and the post that went out in it */
/* ================================================================== */

interface DayEvent {
  hour: number;
  label: string;
  sub: string;
  icon: LucideIcon | "rankbox";
}

const DAY: DayEvent[] = [
  { hour: 6, label: "Ovens on", sub: "Sourdough, rye, croissants", icon: Flame },
  { hour: 7, label: "Doors open", sub: "The regulars, then everyone", icon: DoorOpen },
  { hour: 8, label: "Morning rush", sub: "Coffee and a queue to the door", icon: Coffee },
  { hour: 9, label: "Post published", sub: "How do you revive a stale loaf?", icon: "rankbox" },
  { hour: 12, label: "Lunch orders", sub: "Sandwiches and a catering drop", icon: Sandwich },
  { hour: 15, label: "Close up", sub: "Tomorrow's dough goes in", icon: Lock },
];
const DAY_PERIOD = 14000;
const DAY_RUN = 11500;
/* 9:00 is the fourth row; the post card waits for the line to reach it. */
const RANKBOX_HOUR = 9;

function hourAt(ms: number) {
  const p = Math.min(1, ms / DAY_RUN);
  return DAY[0].hour + p * (DAY[DAY.length - 1].hour - DAY[0].hour);
}

/** Rows are evenly spaced, hours aren't: find the row the hour falls in. */
function rowAt(hour: number) {
  for (let i = 0; i < DAY.length - 1; i++) {
    const a = DAY[i].hour;
    const b = DAY[i + 1].hour;
    if (hour <= b) return i + (hour - a) / (b - a);
  }
  return DAY.length - 1;
}

function clock(hour: number) {
  const whole = Math.floor(hour);
  const mins = Math.floor(((hour - whole) * 60) / 5) * 5;
  const h12 = ((whole + 11) % 12) + 1;
  return `${h12}:${String(mins).padStart(2, "0")} ${whole < 12 ? "AM" : "PM"}`;
}

function DayScene() {
  const [ref, on] = useOnScreen<HTMLDivElement>();
  const ms = useLoop(DAY_PERIOD, on, { start: 1400, rest: 6200, tick: 100 });
  const hour = hourAt(ms);
  const posted = hour >= RANKBOX_HOUR;
  const fading = ms > DAY_PERIOD - 500;

  return (
    <Stage
      stageRef={ref}
      label="Sample: a working day at Rye & Rise Bakery, where the owner bakes and serves while Rankbox publishes a blog post to their Square Online site at 9:00."
    >
      <ProductWindow
        title="Tuesday at Rye & Rise"
        icon={CalendarDays}
        className="absolute bottom-0 left-0 right-0 top-12 sm:right-28"
      >
        <div className="border-b border-border px-4 py-3">
          <p className="font-display text-2xl font-semibold tabular-nums leading-none tracking-tight text-ink">
            {clock(hour)}
          </p>
          <p className="mt-1.5 flex items-center gap-3 text-[0.6rem] font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" /> You
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cta" /> Rankbox
            </span>
          </p>
        </div>

        {/* --row is one timeline row: shorter on a phone, where the whole
            day has to fit under the header. */}
        <div className="relative flex-1 px-4 py-3 [--row:2.6rem] sm:[--row:3.1rem]">
          {/* the now line */}
          <div
            className={cn(
              "pointer-events-none absolute left-2 right-2 z-10 flex -translate-y-1/2 items-center transition-opacity duration-300",
              fading && "opacity-0",
            )}
            style={{ top: `calc(0.75rem + ${(rowAt(hour) + 0.5).toFixed(3)} * var(--row))` }}
          >
            <span className="h-2 w-2 rounded-full bg-cta ring-4 ring-cta/20" />
            <span className="h-px flex-1 bg-cta/60" />
          </div>

          {DAY.map((e) => {
            const done = hour >= e.hour;
            const ours = e.icon === "rankbox";
            const Icon = ours ? null : (e.icon as LucideIcon);
            return (
              <div
                key={e.hour}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-2 transition-all duration-500",
                  ours && done && "bg-cta-soft ring-1 ring-cta/30",
                  !ours && !done && "opacity-50",
                )}
                style={{ height: "var(--row)" }}
              >
                <span className="w-10 shrink-0 text-right text-[0.62rem] font-semibold tabular-nums text-muted-foreground">
                  {clock(e.hour).replace(":00", "")}
                </span>
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-500",
                    ours ? "bg-brand-blue text-white" : "bg-surface text-ink ring-1 ring-border",
                  )}
                >
                  {Icon ? <Icon className="h-3.5 w-3.5" /> : <Mark className="h-3.5 w-3.5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "truncate text-[0.74rem] font-semibold",
                      ours ? "text-cta" : "text-ink",
                    )}
                  >
                    {e.label}
                  </p>
                  <p className="truncate text-[0.62rem] text-muted-foreground">{e.sub}</p>
                </div>
                {!ours && done && (
                  <Check className="h-3.5 w-3.5 shrink-0 text-success" strokeWidth={3} />
                )}
              </div>
            );
          })}
        </div>
      </ProductWindow>

      {/* Where the topic came from. */}
      <Float className="right-0 top-0 w-[10.5rem] sm:w-[13rem]" phase={1}>
        <div className={cn(CARD, "rounded-2xl rounded-tr-sm px-3 py-2.5")}>
          <p className="text-[0.74rem] font-medium leading-snug text-ink">
            &ldquo;How do I revive a stale loaf?&rdquo;
          </p>
          <p className="mt-1 text-[0.6rem] text-muted-foreground">
            Asked at the counter, and on Google
          </p>
        </div>
      </Float>

      {/* The post itself, the moment the line passes nine. */}
      <div
        className={cn(
          /* On a phone the window is full width, so the card lands over the
             afternoon rows rather than beside the 9:00 one. */
          "absolute bottom-2 right-2 z-10 w-[10.5rem] transition-all duration-700 sm:bottom-auto sm:right-0 sm:top-[40%] sm:w-[12.5rem]",
          EASE,
          posted && !fading ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0",
        )}
      >
        <div className={cn(CARD, "overflow-hidden")}>
          <div className="relative hidden h-20 items-center justify-center bg-[linear-gradient(135deg,#f5d9a8,#d9a05b_60%,#a86a2f)] sm:flex">
            <Wheat className="h-8 w-8 text-white/90" strokeWidth={1.6} />
            <span className="absolute left-2 top-2">
              <Chip tone="success" dot className="bg-card">
                Live
              </Chip>
            </span>
          </div>
          <div className="p-3">
            <div className="flex items-center gap-1.5">
              <IntegrationLogo id="square" title={false} className="h-4 w-4" />
              <span className="truncate font-mono text-[0.58rem] text-muted-foreground">
                ryeandrise.com/blog
              </span>
              <Chip tone="success" dot className="ml-auto sm:hidden">
                Live
              </Chip>
            </div>
            <p className="mt-1.5 text-[0.78rem] font-semibold leading-snug text-ink">
              How do you revive a stale loaf?
            </p>
            <p className="mt-1 text-[0.6rem] text-muted-foreground">
              9:00 AM · while you were serving
            </p>
          </div>
        </div>
      </div>
    </Stage>
  );
}

/* ---------- Registry ---------- */

/** One scene per page. A page without one fails hero-scenes.test.ts. */
export const HERO_SCENES: Record<string, ComponentType> = {
  marketers: CalendarScene,
  "solo-founders": EditorScene,
  "seo-agencies": ClientDeckScene,
  ecommerce: PhoneScene,
  saas: CmsScene,
  "local-businesses": DayScene,
};

export function PersonaScene({ persona }: { persona: Persona }) {
  const Scene = HERO_SCENES[persona.slug];
  return Scene ? <Scene /> : null;
}
