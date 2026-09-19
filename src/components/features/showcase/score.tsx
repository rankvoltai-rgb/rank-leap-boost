import { ArrowRight, Gauge, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Chip, Label, Panel, ProductWindow, Ring, Row, Tick, useCycle, useInView } from "./kit";

interface Check {
  name: string;
  kind: "SEO" | "GEO";
  before: [string, boolean];
  after: [string, boolean];
}

const CHECKS: Check[] = [
  {
    name: "Word count",
    kind: "SEO",
    before: ["3,247 / 3,000", true],
    after: ["3,247 / 3,000", true],
  },
  { name: "Headings", kind: "SEO", before: ["8 H2s", true], after: ["8 H2s", true] },
  {
    name: "Internal links",
    kind: "SEO",
    before: ["3 · add 5 more", false],
    after: ["8 added", true],
  },
  {
    name: "Quotable definitions",
    kind: "GEO",
    before: ["Missing", false],
    after: ["2 added", true],
  },
  {
    name: "Sources cited",
    kind: "GEO",
    before: ["2 · add more", false],
    after: ["14 cited", true],
  },
  { name: "Readability", kind: "SEO", before: ["Grade A", true], after: ["Grade A", true] },
];

export function ScoreHero({ className }: { className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const phase = useCycle(2, 3400, 1, inView);
  const fixed = phase === 1;
  const seo = fixed ? 94 : 71;
  const geo = fixed ? 91 : 58;

  return (
    <div ref={ref} className={cn("flex flex-col", className)}>
      <ProductWindow title="SEO / GEO Score" icon={Gauge} className="flex-1">
        <div className="flex flex-1 flex-col gap-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">
                Kanban vs Scrum: Which Fits a Small Team?
              </p>
              <p className="text-[0.68rem] text-muted-foreground">
                Draft · target: kanban vs scrum
              </p>
            </div>
            <Chip tone={fixed ? "success" : "warning"} dot>
              {fixed ? "Ready" : "3 fixes"}
            </Chip>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              ["SEO", "Google rankings", seo],
              ["GEO", "AI citations", geo],
            ].map(([k, sub, v]) => (
              <div
                key={k as string}
                className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3"
              >
                <Ring
                  value={v as number}
                  size={72}
                  tone={(v as number) >= 80 ? "success" : "warning"}
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">{k} score</p>
                  <p className="text-[0.68rem] text-muted-foreground">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <Label right={fixed ? "All checks pass" : "3 need attention"}>Checks</Label>
            {CHECKS.map((c) => {
              const [value, ok] = fixed ? c.after : c.before;
              return (
                <div
                  key={c.name}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg border px-3 py-2 transition-colors duration-500",
                    ok ? "border-border bg-card" : "border-flame/25 bg-flame/[0.06]",
                  )}
                >
                  <Tick ok={ok} />
                  <span className="flex-1 text-[0.78rem] font-medium text-ink">{c.name}</span>
                  <span className="text-[0.55rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                    {c.kind}
                  </span>
                  <span
                    className={cn(
                      "w-24 text-right text-[0.7rem] tabular-nums",
                      ok ? "text-muted-foreground" : "font-medium text-flame",
                    )}
                  >
                    {value}
                  </span>
                </div>
              );
            })}
          </div>

          <div
            className={cn(
              "mt-auto flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-500",
              fixed ? "bg-ink text-background" : "border border-volt/35 bg-volt/10 text-ink",
            )}
          >
            {fixed ? (
              <>
                Publish article <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-volt" /> Apply 3 fixes
              </>
            )}
          </div>
        </div>
      </ProductWindow>
    </div>
  );
}

/* ---------- Benefits ---------- */

function Dual() {
  return (
    <Panel>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ["SEO", 94, ["Keyword use", "Headings", "Internal links", "Readability"]],
          [
            "GEO",
            91,
            ["Quotable definitions", "Source-backed claims", "Clear structure", "FAQ coverage"],
          ],
        ].map(([k, v, items]) => (
          <div key={k as string} className="rounded-lg bg-card p-3 ring-1 ring-border">
            <div className="flex items-center gap-3">
              <Ring value={v as number} size={56} tone="success" />
              <div>
                <p className="text-sm font-semibold text-ink">{k as string}</p>
                <p className="text-[0.65rem] text-muted-foreground">
                  {k === "SEO" ? "For Google" : "For AI answers"}
                </p>
              </div>
            </div>
            <ul className="mt-3 space-y-1">
              {(items as string[]).map((i) => (
                <li key={i} className="flex items-center gap-1.5 text-[0.7rem] text-ink">
                  <Tick ok className="h-3.5 w-3.5" /> {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function Checks() {
  return (
    <Panel className="h-full">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Article score</span>
        <span className="text-2xl font-semibold text-success">
          94<span className="text-sm text-muted-foreground">/100</span>
        </span>
      </div>
      <div className="space-y-1.5">
        {[
          ["Word count", "3,247 / 3,000"],
          ["Keyword density", "0.8% optimal"],
          ["Headings", "8 added"],
          ["Internal links", "8 added"],
          ["Readability", "Grade A"],
        ].map(([k, v]) => (
          <Row key={k} className="py-1.5">
            <span className="text-xs font-medium text-ink">{k}</span>
            <span className="text-xs text-muted-foreground">{v}</span>
          </Row>
        ))}
      </div>
    </Panel>
  );
}

function Gate() {
  return (
    <Panel className="h-full">
      <div className="grid h-full items-center gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <div className="rounded-lg bg-card p-3 ring-1 ring-border">
          <Label>Draft</Label>
          <div className="mt-2 flex items-center gap-2.5">
            <Ring value={64} size={44} tone="warning" />
            <p className="text-[0.7rem] leading-snug text-muted-foreground">3 checks flagged</p>
          </div>
        </div>
        <ArrowRight className="mx-auto h-4 w-4 rotate-90 text-muted-foreground sm:rotate-0" />
        <div className="rounded-lg bg-card p-3 ring-1 ring-border">
          <Label>Fixes applied</Label>
          <p className="mt-2 text-[0.7rem] leading-snug text-ink">
            +5 internal links, 2 definitions, 12 sources
          </p>
        </div>
        <ArrowRight className="mx-auto h-4 w-4 rotate-90 text-muted-foreground sm:rotate-0" />
        <div className="rounded-lg border border-success/30 bg-success/10 p-3">
          <Label>Cleared to publish</Label>
          <div className="mt-2 flex items-center gap-2.5">
            <Ring value={93} size={44} tone="success" />
            <p className="text-[0.7rem] font-medium leading-snug text-ink">Above your 80 bar</p>
          </div>
        </div>
      </div>
    </Panel>
  );
}

export const scoreBenefits = [Dual, Checks, Gate];
