import { Check, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Chip,
  Label,
  Letter,
  LiveDot,
  Panel,
  ProductWindow,
  Row,
  useInView,
  useTypewriter,
} from "./kit";

const PARAGRAPH =
  "Kanban wins when work arrives unpredictably. Support-heavy teams and small startups rarely plan two weeks ahead, and a board with work-in-progress limits keeps them shipping without sprint ceremonies.";

function Cite({ n }: { n: number }) {
  return (
    <sup className="ml-0.5 rounded bg-volt/15 px-1 py-px text-[0.55rem] font-semibold text-volt">
      {n}
    </sup>
  );
}

export function WriterHero({ className }: { className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const { typed, typing } = useTypewriter(PARAGRAPH, { speed: 26, hold: 3200, run: inView });
  const words = 1640 + typed.split(" ").length * 6;

  return (
    <div ref={ref} className={cn("flex flex-col", className)}>
      <ProductWindow title="Citation-Ready Writer" icon={PenLine} className="flex-1">
        {/* pipeline */}
        <div className="grid grid-cols-3 border-b border-border text-[0.68rem]">
          {[
            ["Research", "24 sources", true],
            ["Outline", "8 sections", true],
            ["Writing", `${words.toLocaleString("en-US")} words`, false],
          ].map(([step, meta, done]) => (
            <div
              key={step as string}
              className="flex items-center gap-2 border-r border-border px-3 py-2.5 last:border-r-0"
            >
              {done ? (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success/15 text-success">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
              ) : (
                <LiveDot tone="volt" />
              )}
              <span className="min-w-0">
                <span className="block font-semibold text-ink">{step}</span>
                <span className="block truncate text-muted-foreground tabular-nums">{meta}</span>
              </span>
            </div>
          ))}
        </div>

        {/* document */}
        <div className="flex flex-1 flex-col gap-3.5 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-2 text-[0.65rem] text-muted-foreground">
            <Chip tone="volt">Kanban vs Scrum</Chip>
            <span>12 min read · English · Plannora voice</span>
          </div>
          <h3 className="text-lg font-semibold leading-snug tracking-tight text-ink">
            Kanban vs Scrum: Which Framework Fits a Small Team?
          </h3>

          <div className="rounded-r-lg border-l-2 border-volt bg-volt/[0.06] py-2.5 pl-3.5 pr-3">
            <Label className="mb-1.5 text-volt">Quotable definition</Label>
            <p className="text-[0.82rem] leading-relaxed text-ink">
              Kanban is a visual workflow that limits work in progress. Scrum organizes work into
              fixed-length sprints with defined roles.
              <Cite n={1} />
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">When Kanban wins</p>
            <p className="mt-1.5 min-h-[5.5rem] text-[0.82rem] leading-relaxed text-ink/75">
              {typed}
              {!typing && <Cite n={2} />}
              {typing && (
                <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] animate-pulse rounded-full bg-volt" />
              )}
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="h-2 w-full rounded-full bg-shimmer" />
            <div className="h-2 w-4/5 rounded-full bg-shimmer" />
          </div>

          <div className="mt-auto space-y-1.5 border-t border-border pt-3.5">
            <Label right="24 searched · 9 cited">Sources</Label>
            <div className="flex flex-wrap gap-1.5">
              {["scrum.org", "atlassian.com", "hbr.org", "pmi.org"].map((d, i) => (
                <span
                  key={d}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-0.5 text-[0.7rem] font-medium text-muted-foreground"
                >
                  <span className="text-[0.6rem] font-semibold text-volt">{i + 1}</span>
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>
      </ProductWindow>
    </div>
  );
}

/* ---------- Benefits ---------- */

const SOURCES = [
  { d: "scrum.org", kind: "Official guide", used: true },
  { d: "atlassian.com", kind: "Documentation", used: true },
  { d: "hbr.org", kind: "Research", used: true },
  { d: "pmi.org", kind: "Industry survey", used: true },
  { d: "top10-pm-tools.biz", kind: "Thin listicle", used: false },
];

function LiveResearch() {
  return (
    <Panel>
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2 text-xs font-medium text-ink">
          <LiveDot tone="volt" /> Searched 24 sources
        </span>
        <span className="text-[0.65rem] text-muted-foreground">Today, 9:02 AM</span>
      </div>
      <div className="space-y-1.5">
        {SOURCES.map((s) => (
          <Row key={s.d} className={cn(!s.used && "opacity-50")}>
            <span className="flex min-w-0 items-center gap-2">
              <Letter domain={s.d} />
              <span
                className={cn("truncate text-xs font-medium text-ink", !s.used && "line-through")}
              >
                {s.d}
              </span>
            </span>
            <span className="flex items-center gap-2">
              <span className="hidden text-[0.65rem] text-muted-foreground sm:inline">
                {s.kind}
              </span>
              <Chip tone={s.used ? "success" : "flame"}>{s.used ? "Used" : "Skipped"}</Chip>
            </span>
          </Row>
        ))}
      </div>
    </Panel>
  );
}

function VoiceSample() {
  return (
    <Panel className="flex h-full flex-col">
      <div className="flex flex-wrap gap-1.5">
        {["Conversational", "Practical", "No hype"].map((t) => (
          <span
            key={t}
            className="rounded-md bg-ink px-2 py-1 text-[0.7rem] font-medium text-background"
          >
            {t}
          </span>
        ))}
        <span className="rounded-md bg-secondary px-2 py-1 text-[0.7rem] font-medium text-ink">
          Founders
        </span>
      </div>
      <div className="mt-3 flex flex-1 flex-col gap-2">
        <div className="rounded-lg bg-card p-3 ring-1 ring-border">
          <Label className="mb-1.5">Generic AI</Label>
          <p className="text-xs leading-relaxed text-muted-foreground line-through decoration-flame/60">
            In today&rsquo;s fast-paced landscape, project tools are essential to unlock
            productivity!
          </p>
        </div>
        <div className="flex-1 rounded-lg border border-volt/30 bg-volt/[0.06] p-3">
          <Label className="mb-1.5 text-volt">Your voice</Label>
          <p className="text-xs leading-relaxed text-ink">
            Most five-person teams don&rsquo;t need forty features. They need one board everyone
            actually opens.
          </p>
        </div>
      </div>
      <p className="mt-3 text-[0.65rem] text-muted-foreground">Set once. Applied to every draft.</p>
    </Panel>
  );
}

const OUTLINE = [
  ["H1", "Kanban vs Scrum: Which Framework Fits a Small Team?", "Title"],
  ["P", "TL;DR: a two-sentence verdict", "Quotable"],
  ["H2", "What is Kanban? What is Scrum?", "Definition"],
  ["H2", "Side-by-side comparison", "Table"],
  ["H2", "How to switch without chaos", "Steps"],
  ["H2", "Frequently asked questions", "FAQ schema"],
] as const;

function QuotableStructure() {
  return (
    <Panel className="h-full">
      <div className="space-y-1.5">
        {OUTLINE.map(([tag, text, kind], i) => (
          <div
            key={text}
            className={cn(
              "flex items-center gap-3 rounded-lg bg-card px-3 py-2 ring-1 ring-border",
              tag === "H2" && "ml-4",
            )}
          >
            <span className="w-6 shrink-0 font-mono text-[0.6rem] font-semibold text-muted-foreground">
              {tag}
            </span>
            <span className="min-w-0 flex-1 truncate text-xs font-medium text-ink">{text}</span>
            <Chip tone={i === 0 ? "muted" : "volt"}>{kind}</Chip>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export const writerBenefits = [LiveResearch, VoiceSample, QuotableStructure];
