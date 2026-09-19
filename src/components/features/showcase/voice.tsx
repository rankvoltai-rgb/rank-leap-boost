import { Check, Mic, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Chip, Label, Panel, ProductWindow, Row, useCycle, useInView } from "./kit";

const GENERIC =
  "In today's fast-paced business landscape, project management tools have become essential for teams looking to revolutionize their workflows and unlock unprecedented productivity!";
const ON_VOICE =
  "Most five-person teams don't need a project tool with forty features. They need one board everyone actually opens. Start there, and add automations once the busywork shows up.";

export function VoiceHero({ className }: { className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const mode = useCycle(2, 3600, 1, inView);
  const voiced = mode === 1;

  return (
    <div ref={ref} className={cn("flex flex-col", className)}>
      <ProductWindow title="Brand Voice" icon={Mic} className="flex-1">
        <div className="flex flex-1 flex-col gap-4 p-5">
          {/* profile */}
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-ink">Plannora voice</span>
              <Chip tone="success" dot>
                Active on all articles
              </Chip>
            </div>
            <div className="mt-3 grid gap-3 text-[0.72rem] sm:grid-cols-2">
              <div>
                <Label>Tone</Label>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {["Conversational", "Practical", "No hype"].map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-ink px-1.5 py-0.5 font-medium text-background"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <Label>Audience</Label>
                <p className="mt-1.5 font-medium text-ink">Founders of 2–20 person teams</p>
              </div>
              <div>
                <Label>Always</Label>
                <p className="mt-1.5 flex items-start gap-1.5 text-ink">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-success" /> Real examples over
                  adjectives
                </p>
              </div>
              <div>
                <Label>Never</Label>
                <p className="mt-1.5 flex items-start gap-1.5 text-ink">
                  <X className="mt-0.5 h-3 w-3 shrink-0 text-flame" /> &ldquo;Revolutionize&rdquo;,
                  exclamation marks
                </p>
              </div>
            </div>
          </div>

          {/* toggle */}
          <div className="flex items-center gap-1 rounded-lg bg-surface p-1 ring-1 ring-border">
            {["Generic AI", "Plannora voice"].map((m, i) => (
              <span
                key={m}
                className={cn(
                  "flex-1 rounded-md py-1.5 text-center text-xs font-medium transition-all duration-300",
                  mode === i
                    ? "bg-card text-ink shadow-sm ring-1 ring-border"
                    : "text-muted-foreground",
                )}
              >
                {m}
              </span>
            ))}
          </div>

          {/* sample */}
          <div
            className={cn(
              "relative flex-1 rounded-lg border p-4 transition-colors duration-500",
              voiced ? "border-volt/35 bg-volt/[0.05]" : "border-border bg-card",
            )}
          >
            <Label className="mb-2">Opening paragraph</Label>
            <div className="grid">
              {[GENERIC, ON_VOICE].map((text, i) => (
                <p
                  key={i}
                  aria-hidden={mode !== i}
                  className={cn(
                    "col-start-1 row-start-1 text-[0.9rem] leading-relaxed transition-all duration-500",
                    i === 0 ? "text-ink/60" : "text-ink",
                    mode === i ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
                  )}
                >
                  {text}
                </p>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {["Conversational", "No hype", "Speaks to founders", "Specific"].map((t) => (
              <span
                key={t}
                className={cn(
                  "flex items-center gap-1 rounded-md px-2 py-1 text-[0.68rem] font-medium ring-1 transition-all duration-500",
                  voiced
                    ? "bg-success/10 text-success ring-success/25"
                    : "bg-flame/10 text-flame ring-flame/25",
                )}
              >
                {voiced ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                {t}
              </span>
            ))}
          </div>
        </div>
      </ProductWindow>
    </div>
  );
}

/* ---------- Benefits ---------- */

function Instructions() {
  return (
    <Panel>
      <div className="space-y-1.5">
        {[
          ["Tone", "Conversational, practical, no hype"],
          ["Audience", "Founders of 2–20 person teams"],
          ["Point of view", "We, speaking to you"],
          ["Say", "“teammates”, not “resources”"],
          ["Avoid", "Exclamation marks, buzzwords"],
        ].map(([k, v]) => (
          <Row key={k}>
            <span className="shrink-0 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {k}
            </span>
            <span className="truncate text-xs font-medium text-ink">{v}</span>
          </Row>
        ))}
      </div>
    </Panel>
  );
}

function ProductAware() {
  return (
    <Panel className="flex h-full flex-col gap-3">
      <div className="rounded-lg bg-card p-3 ring-1 ring-border">
        <Label>Your product</Label>
        <p className="mt-1.5 text-xs font-semibold text-ink">Plannora</p>
        <p className="text-[0.7rem] text-muted-foreground">
          Free up to 5 people · built-in automations
        </p>
      </div>
      <div className="flex-1 rounded-lg bg-card p-3 ring-1 ring-border">
        <Label>In the article</Label>
        <p className="mt-1.5 text-xs leading-relaxed text-ink/80">
          &hellip;if you&rsquo;re under five people,{" "}
          <span className="rounded bg-volt/15 px-0.5 font-semibold text-ink">
            Plannora&rsquo;s free tier
          </span>{" "}
          covers boards and automations, so you can test the workflow before paying for anything.
        </p>
      </div>
    </Panel>
  );
}

const LIBRARY = [
  "Kanban vs Scrum: Which Fits a Small Team?",
  "How to Run a Sprint Without Chaos",
  "Async Standups That Actually Work",
  "Free Planning Apps Worth Trying",
  "When to Move Off Spreadsheets",
  "Roadmaps for Teams Without a PM",
];

function Consistent() {
  return (
    <Panel className="h-full">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {LIBRARY.map((t) => (
          <div key={t} className="rounded-lg bg-card p-3 ring-1 ring-border">
            <p className="line-clamp-2 text-xs font-semibold leading-snug text-ink">{t}</p>
            <div className="mt-2 flex items-center gap-1.5">
              <Chip tone="volt" dot>
                Plannora voice
              </Chip>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export const voiceBenefits = [Instructions, ProductAware, Consistent];
