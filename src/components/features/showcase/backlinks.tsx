import { ArrowRight, Link2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { AI_MARKS } from "@/components/landing/ai-logos";
import { AreaChart } from "@/components/landing/charts";
import {
  Chip,
  Label,
  Letter,
  Panel,
  ProductWindow,
  Row,
  useCountUp,
  useCycle,
  useInView,
} from "./kit";

const PLACEMENTS = [
  { site: "leanops.blog", dr: 71, to: "/blog/kanban-vs-scrum", anchor: "kanban vs scrum" },
  {
    site: "foundernotes.co",
    dr: 64,
    to: "/blog/best-project-tools",
    anchor: "project tools for small teams",
  },
  { site: "sprintweekly.io", dr: 58, to: "/blog/async-standups", anchor: "async standups" },
  { site: "teamcraft.review", dr: 52, to: "/pricing", anchor: "Plannora" },
];

export function BacklinksHero({ className }: { className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const dr = useCountUp(38, { from: 12, ms: 2200, run: inView });
  const domains = useCountUp(61, { from: 14, ms: 2200, run: inView });
  /* The newest placement lands last and stays "Pending" for a beat. */
  const beat = useCycle(3, 1800, 2, inView);

  return (
    <div ref={ref} className={cn("flex flex-col", className)}>
      <ProductWindow title="Authority Backlinks" icon={Link2} className="flex-1">
        <div className="flex flex-1 flex-col gap-4 p-5">
          <div className="grid grid-cols-[auto_1fr] gap-4 rounded-lg border border-border bg-surface p-4">
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-[0.65rem] font-medium text-muted-foreground">Domain Rating</p>
                <p className="mt-1 flex items-baseline gap-2 text-4xl font-semibold leading-none tracking-tight text-ink tabular-nums">
                  {dr}
                  <span className="flex items-center gap-0.5 text-xs font-semibold text-success">
                    <TrendingUp className="h-3.5 w-3.5" />+{dr - 12}
                  </span>
                </p>
              </div>
              <div className="mt-4">
                <p className="text-[0.65rem] font-medium text-muted-foreground">
                  Referring domains
                </p>
                <p className="mt-1 text-lg font-semibold leading-none text-ink tabular-nums">
                  {domains}
                </p>
              </div>
            </div>
            <div className="flex min-w-0 flex-col">
              <AreaChart
                points={[12, 13, 13, 15, 18, 19, 22, 25, 27, 31, 34, 38]}
                className="h-full min-h-24 w-full"
                stroke="var(--success)"
                fill="var(--success)"
              />
              <div className="mt-1 flex justify-between text-[0.6rem] text-muted-foreground">
                <span>Apr</span>
                <span>Sep</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label right="This month · 4 of 30 credits">Recent placements</Label>
            {PLACEMENTS.map((p, i) => {
              const pending = i === PLACEMENTS.length - 1 && beat < 2;
              return (
                <div key={p.site} className="rounded-lg border border-border bg-card px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <Letter domain={p.site} />
                    <span className="min-w-0 flex-1 truncate text-[0.8rem] font-medium text-ink">
                      {p.site}
                    </span>
                    <span className="text-[0.65rem] font-semibold tabular-nums text-muted-foreground">
                      DR {p.dr}
                    </span>
                    <Chip tone={pending ? "warning" : "success"} dot>
                      {pending ? "Pending" : "Live"}
                    </Chip>
                  </div>
                  <p className="mt-1.5 flex min-w-0 items-center gap-1.5 pl-[1.875rem] text-[0.68rem] text-muted-foreground">
                    <span className="shrink-0">&ldquo;{p.anchor}&rdquo;</span>
                    <ArrowRight className="h-3 w-3 shrink-0" />
                    <span className="min-w-0 truncate font-mono text-ink/70">
                      plannora.io{p.to}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-1.5 border-t border-border pt-3.5 text-[0.65rem] text-muted-foreground">
            <Chip tone="success">Dofollow</Chip>
            <Chip tone="success">Niche-relevant</Chip>
            <Chip tone="success">Verified sites</Chip>
            <span className="ml-auto">No PBNs · no link farms</span>
          </div>
        </div>
      </ProductWindow>
    </div>
  );
}

/* ---------- Benefits ---------- */

const VETTED = [
  { site: "leanops.blog", dr: 71, niche: "SaaS ops", ok: true, why: "Verified" },
  { site: "foundernotes.co", dr: 64, niche: "Startups", ok: true, why: "Verified" },
  { site: "best-links-4u.biz", dr: 9, niche: "Everything", ok: false, why: "Link farm" },
  { site: "guestpost-hub.net", dr: 22, niche: "Paid posts", ok: false, why: "Sells links" },
];

function VerifiedSources() {
  return (
    <Panel>
      <div className="space-y-1.5">
        {VETTED.map((v) => (
          <Row key={v.site} className={cn(!v.ok && "opacity-55")}>
            <span className="flex min-w-0 items-center gap-2">
              <Letter domain={v.site} />
              <span
                className={cn("truncate text-xs font-medium text-ink", !v.ok && "line-through")}
              >
                {v.site}
              </span>
            </span>
            <span className="flex items-center gap-2">
              <span className="hidden text-[0.65rem] text-muted-foreground sm:inline">
                {v.niche}
              </span>
              <span className="text-[0.65rem] font-semibold tabular-nums text-muted-foreground">
                DR {v.dr}
              </span>
              <Chip tone={v.ok ? "success" : "flame"}>{v.why}</Chip>
            </span>
          </Row>
        ))}
      </div>
    </Panel>
  );
}

function Compounding() {
  return (
    <Panel className="flex h-full flex-col">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium text-ink">Domain Rating</span>
        <span className="text-xs text-muted-foreground">
          <span className="font-semibold text-ink">12</span> →{" "}
          <span className="font-semibold text-success">38</span>
        </span>
      </div>
      <AreaChart
        points={[12, 12, 14, 15, 17, 20, 22, 26, 29, 33, 36, 38]}
        className="mt-3 h-24 w-full flex-1"
        stroke="var(--success)"
        fill="var(--success)"
      />
      <p className="mt-3 text-[0.65rem] text-muted-foreground">
        Every new article starts from a stronger domain than the last one.
      </p>
    </Panel>
  );
}

function TrustFlow() {
  const Mark = AI_MARKS.find((m) => m.name === "Perplexity")!.Mark;
  return (
    <Panel className="h-full">
      <div className="grid h-full items-center gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <div className="rounded-lg bg-card p-3 ring-1 ring-border">
          <Label>Referring sites</Label>
          <div className="mt-2 space-y-1">
            {["leanops.blog", "foundernotes.co", "sprintweekly.io"].map((d) => (
              <p key={d} className="flex items-center gap-1.5 text-[0.7rem] text-ink">
                <Letter domain={d} className="h-4 w-4 text-[0.5rem]" /> {d}
              </p>
            ))}
          </div>
        </div>
        <ArrowRight className="mx-auto h-4 w-4 rotate-90 text-muted-foreground sm:rotate-0" />
        <div className="rounded-lg bg-card p-3 ring-1 ring-border">
          <Label>Your article</Label>
          <p className="mt-2 text-xs font-medium leading-snug text-ink">
            Kanban vs Scrum: Which Fits a Small Team?
          </p>
          <p className="mt-1 font-mono text-[0.6rem] text-muted-foreground">
            plannora.io/blog/kanban-vs-scrum
          </p>
        </div>
        <ArrowRight className="mx-auto h-4 w-4 rotate-90 text-muted-foreground sm:rotate-0" />
        <div className="rounded-lg border border-volt/30 bg-volt/10 p-3">
          <Label>
            <span className="flex items-center gap-1.5">
              <Mark className="h-3 w-3" /> Perplexity
            </span>
          </Label>
          <p className="mt-2 text-xs leading-snug text-ink">
            &ldquo;&hellip;for small teams,{" "}
            <span className="font-semibold underline decoration-volt decoration-2 underline-offset-2">
              Plannora
            </span>{" "}
            explains it best.&rdquo;
          </p>
        </div>
      </div>
    </Panel>
  );
}

export const backlinksBenefits = [VerifiedSources, Compounding, TrustFlow];
