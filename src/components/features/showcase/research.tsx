import { ArrowRight, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { AI_MARKS } from "@/components/landing/ai-logos";
import {
  Chip,
  Label,
  Letter,
  LiveDot,
  Meter,
  Panel,
  ProductWindow,
  Row,
  useCountUp,
  useCycle,
  useInView,
} from "./kit";

const MARK = Object.fromEntries(AI_MARKS.map((m) => [m.name, m.Mark])) as Record<
  (typeof AI_MARKS)[number]["name"],
  (typeof AI_MARKS)[number]["Mark"]
>;

type Engine = keyof typeof MARK;

interface Topic {
  q: string;
  volume: string;
  kd: number;
  engines: Engine[];
}

const CLUSTERS: { name: string; intent: string; topics: Topic[] }[] = [
  {
    name: "Best tools",
    intent: "Commercial",
    topics: [
      {
        q: "best project management tool for small teams",
        volume: "18,100",
        kd: 24,
        engines: ["ChatGPT", "Google", "Perplexity"],
      },
      {
        q: "best free kanban app for startups",
        volume: "6,600",
        kd: 19,
        engines: ["ChatGPT", "Gemini"],
      },
      {
        q: "project tool for a 5-person startup",
        volume: "1,300",
        kd: 12,
        engines: ["Perplexity", "Claude"],
      },
    ],
  },
  {
    name: "Comparisons",
    intent: "Comparison",
    topics: [
      {
        q: "kanban vs scrum for small teams",
        volume: "9,900",
        kd: 19,
        engines: ["Google", "ChatGPT"],
      },
      {
        q: "asana alternatives for startups",
        volume: "4,400",
        kd: 27,
        engines: ["Perplexity", "Gemini", "ChatGPT"],
      },
      { q: "plannora vs trello", volume: "880", kd: 8, engines: ["Google"] },
    ],
  },
  {
    name: "How-to",
    intent: "Informational",
    topics: [
      {
        q: "how to run a sprint without a scrum master",
        volume: "2,900",
        kd: 15,
        engines: ["ChatGPT", "Claude"],
      },
      {
        q: "how to plan a product roadmap",
        volume: "5,400",
        kd: 31,
        engines: ["Google", "Gemini"],
      },
      {
        q: "how to run async standups",
        volume: "1,900",
        kd: 11,
        engines: ["Perplexity", "ChatGPT"],
      },
    ],
  },
];

function kdTone(kd: number) {
  return kd < 20 ? "success" : kd < 30 ? "warning" : "flame";
}

function EngineStack({ engines }: { engines: Engine[] }) {
  return (
    <span className="flex -space-x-1">
      {engines.map((e) => {
        const M = MARK[e];
        return (
          <span
            key={e}
            title={e}
            className="flex h-5 w-5 items-center justify-center rounded-md bg-white ring-1 ring-border"
          >
            <M className="h-3 w-3" />
          </span>
        );
      })}
    </span>
  );
}

export function ResearchHero({ className }: { className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const found = useCountUp(460, { ms: 1800, run: inView });
  const active = useCycle(CLUSTERS.length, 3400, 0, inView);
  const cluster = CLUSTERS[active];

  return (
    <div ref={ref} className={cn("flex flex-col", className)}>
      <ProductWindow title="Answer-Space Research" icon={Search} className="flex-1">
        <div className="flex flex-1 flex-col gap-4 p-5">
          {/* seed */}
          <div className="flex items-center gap-2.5 rounded-lg border border-border bg-surface px-3 py-2.5">
            <Letter domain="plannora.io" />
            <span className="text-sm font-medium text-ink">plannora.io</span>
            <span className="ml-auto flex items-center gap-1.5 text-[0.7rem] font-medium text-muted-foreground">
              <LiveDot tone={found < 460 ? "volt" : "success"} />
              {found < 460 ? "Scanning Google + AI answers" : "Map ready"}
            </span>
          </div>

          {/* counters */}
          <div className="grid grid-cols-3 gap-2.5">
            {[
              [found.toLocaleString("en-US"), "Questions found"],
              ["38", "Clusters"],
              ["112", "Winnable now"],
            ].map(([v, l]) => (
              <div key={l} className="rounded-lg border border-border bg-card px-3 py-2.5">
                <p className="text-lg font-semibold leading-none tracking-tight text-ink tabular-nums">
                  {v}
                </p>
                <p className="mt-1.5 text-[0.65rem] text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>

          {/* cluster tabs */}
          <div className="flex items-center gap-1 rounded-lg bg-surface p-1 ring-1 ring-border">
            {CLUSTERS.map((c, i) => (
              <span
                key={c.name}
                className={cn(
                  "flex-1 rounded-md px-2 py-1.5 text-center text-[0.7rem] font-medium transition-all",
                  i === active
                    ? "bg-card text-ink shadow-sm ring-1 ring-border"
                    : "text-muted-foreground",
                )}
              >
                {c.name}
              </span>
            ))}
          </div>

          {/* questions */}
          <div className="space-y-1.5">
            <Label right={<Chip tone="volt">{cluster.intent}</Chip>}>Buyer questions</Label>
            <div key={active} className="space-y-1.5">
              {cluster.topics.map((t, i) => (
                <div
                  key={t.q}
                  className="animate-in fade-in slide-in-from-bottom-1 rounded-lg border border-border bg-card px-3 py-2.5 fill-mode-both"
                  style={{ animationDelay: `${i * 90}ms`, animationDuration: "400ms" }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[0.8rem] font-medium leading-snug text-ink">{t.q}</p>
                    <EngineStack engines={t.engines} />
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-[0.65rem] text-muted-foreground">
                    <span className="shrink-0">
                      Vol <span className="font-semibold text-ink tabular-nums">{t.volume}</span>
                    </span>
                    <span className="shrink-0">
                      KD <span className="font-semibold text-ink tabular-nums">{t.kd}</span>
                    </span>
                    <Meter value={t.kd * 2} tone={kdTone(t.kd)} className="max-w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 rounded-lg border border-volt/30 bg-volt/10 px-3 py-2.5">
            <span className="flex items-center gap-2 text-xs font-medium text-ink">
              <Sparkles className="h-3.5 w-3.5 text-volt" />
              12 topics approved for this week
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-volt">
              Send to writer <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </ProductWindow>
    </div>
  );
}

/* ---------- Benefits ---------- */

const INTENT_ROWS = [
  { q: "best project tool for small teams", intent: "Commercial", tone: "volt", on: true },
  { q: "plannora pricing", intent: "Transactional", tone: "success", on: true },
  { q: "kanban vs scrum", intent: "Comparison", tone: "volt", on: true },
  { q: "what is a gantt chart", intent: "Informational", tone: "muted", on: false },
] as const;

function BuyerIntent() {
  return (
    <Panel>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-ink">Filter by intent</span>
        <span className="flex gap-1">
          <Chip tone="volt">High intent</Chip>
          <Chip>All</Chip>
        </span>
      </div>
      <div className="space-y-1.5">
        {INTENT_ROWS.map((r) => (
          <Row key={r.q} className={cn(!r.on && "opacity-45")}>
            <span className="truncate text-xs font-medium text-ink">{r.q}</span>
            <Chip tone={r.tone}>{r.intent}</Chip>
          </Row>
        ))}
      </div>
    </Panel>
  );
}

const SCORED = [
  { q: "project tool for a 5-person startup", v: "1,300", kd: 12 },
  { q: "kanban vs scrum for small teams", v: "9,900", kd: 19 },
  { q: "best project management tool", v: "18,100", kd: 24 },
  { q: "project management software", v: "74,000", kd: 71 },
];

function VolumeDifficulty() {
  return (
    <Panel>
      <div className="mb-2 grid grid-cols-[1fr_auto_5.5rem] gap-3 px-1 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        <span>Topic</span>
        <span>Volume</span>
        <span>Difficulty</span>
      </div>
      <div className="space-y-1.5">
        {SCORED.map((s, i) => (
          <div
            key={s.q}
            className={cn(
              "grid grid-cols-[1fr_auto_5.5rem] items-center gap-3 rounded-lg bg-card px-3 py-2 ring-1 ring-border",
              i === 3 && "opacity-50",
            )}
          >
            <span className="truncate text-xs font-medium text-ink">{s.q}</span>
            <span className="text-xs tabular-nums text-muted-foreground">{s.v}</span>
            <span className="flex items-center gap-2">
              <Meter value={s.kd} tone={kdTone(s.kd)} />
              <span className="w-5 text-right text-[0.65rem] font-semibold tabular-nums text-ink">
                {s.kd}
              </span>
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[0.65rem] text-muted-foreground">
        Sorted winnable-first. Head terms you can't win yet wait until your authority can.
      </p>
    </Panel>
  );
}

function BuiltForAI() {
  return (
    <Panel className="h-full">
      <div className="grid h-full items-center gap-3 sm:grid-cols-[1fr_auto_1.3fr_auto_1fr]">
        <div className="rounded-lg bg-card p-3 ring-1 ring-border">
          <Label>Google sees</Label>
          <p className="mt-2 font-mono text-xs text-ink">kanban vs scrum</p>
        </div>
        <ArrowRight className="mx-auto h-4 w-4 rotate-90 text-muted-foreground sm:rotate-0" />
        <div className="rounded-lg bg-card p-3 ring-1 ring-border">
          <Label right={<EngineStack engines={["ChatGPT", "Perplexity", "Claude"]} />}>
            Buyers ask AI
          </Label>
          <p className="mt-2 w-fit rounded-2xl rounded-br-sm bg-ink px-3 py-1.5 text-xs leading-snug text-background">
            Should a five-person team use Kanban or Scrum?
          </p>
        </div>
        <ArrowRight className="mx-auto h-4 w-4 rotate-90 text-muted-foreground sm:rotate-0" />
        <div className="rounded-lg border border-volt/30 bg-volt/10 p-3">
          <Label>Rankbox targets</Label>
          <p className="mt-2 text-xs font-medium leading-snug text-ink">
            One article that answers both, with a quotable verdict up top.
          </p>
        </div>
      </div>
    </Panel>
  );
}

export const researchBenefits = [BuyerIntent, VolumeDifficulty, BuiltForAI];
