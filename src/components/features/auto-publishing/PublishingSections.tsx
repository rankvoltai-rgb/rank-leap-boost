/**
 * The sections only /features/auto-publishing has, in the feature pages'
 * design language: the answer block (a definition an answer engine can quote
 * as is), where articles can go with each destination's real status, and a
 * field-by-field account of what arrives. All copy and status comes from
 * src/data/auto-publishing.ts, so a connector flipping live updates it here.
 */
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, CircleCheck, CircleDashed, Hourglass, Minus } from "lucide-react";
import { Reveal } from "@/components/landing/shared";
import { IntegrationLogo } from "@/components/dashboard/integration-logos";
import { Heading } from "@/components/features/FeatureSections";
import { ApiSnippet } from "@/components/features/showcase/publishing";
import { cn } from "@/lib/utils";
import {
  ANSWER,
  API_BASE,
  API_DESTINATION,
  API_ENDPOINTS,
  DESTINATIONS,
  PAYLOAD,
  PAYLOAD_NOTE,
  destinationsIn,
  type Destination,
  type DestinationStage,
  type PayloadCell,
} from "@/data/auto-publishing";

/* ---------- shared bits ---------- */

const STAGE_ICON: Record<DestinationStage, { icon: typeof Check; className: string }> = {
  available: { icon: CircleCheck, className: "text-success" },
  "awaiting-approval": { icon: Hourglass, className: "text-[oklch(0.55_0.14_70)]" },
  planned: { icon: CircleDashed, className: "text-muted-foreground" },
};

/** The status in words, with an icon beside it, so it never rests on color. */
function StageBadge({ stage, label }: { stage: DestinationStage; label: string }) {
  const { icon: Icon, className } = STAGE_ICON[stage];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-ink">
      <Icon aria-hidden className={cn("h-3.5 w-3.5 shrink-0", className)} />
      {label}
    </span>
  );
}

/* ---------- 1. The answer ---------- */

/** One paragraph that says what the feature is and how it works, written to
 *  be quoted whole. The spec band (FeatureSpecs) follows it directly. */
export function PublishingAnswer() {
  return (
    <section aria-labelledby="answer-title" className="bg-card">
      <div className="mx-auto max-w-3xl px-5 pb-2 pt-16 text-center sm:pt-20">
        <Reveal>
          <h2
            id="answer-title"
            className="font-display text-balance text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            {ANSWER.question}
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-ink/80">{ANSWER.answer}</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 2. Where articles go ---------- */

function ConnectorCard({ d, compact = false }: { d: Destination; compact?: boolean }) {
  return (
    <li
      className={cn(
        "flex h-full flex-col rounded-2xl border border-border bg-card",
        compact ? "p-5" : "p-6",
      )}
    >
      <div className="flex items-center gap-3">
        <span aria-hidden>
          <IntegrationLogo
            id={d.id as Exclude<Destination["id"], "api">}
            title={false}
            className="h-9 w-9"
          />
        </span>
        <h4 className="text-base font-semibold text-ink">{d.name}</h4>
      </div>
      <div className="mt-4">
        <StageBadge stage={d.stage} label={d.status} />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d.body}</p>
    </li>
  );
}

export function PublishingDestinations() {
  const live = destinationsIn("available").filter((d) => d.id !== "api");
  const awaiting = destinationsIn("awaiting-approval");
  const planned = destinationsIn("planned");

  return (
    <section
      id="destinations"
      aria-labelledby="destinations-title"
      className="border-t border-border bg-surface/40 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="destinations-title"
          eyebrow="Where articles go"
          title="Where your articles can go today"
          intro="Every destination with its real status, so you know what works before you start a trial."
        />

        {/* The path that works for every site today. */}
        <Reveal className="mt-16">
          <article
            aria-labelledby="api-title"
            className="grid gap-8 rounded-2xl border border-border bg-card p-6 shadow-elevation sm:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-10"
          >
            <div className="min-w-0">
              <StageBadge stage="available" label={API_DESTINATION.status} />
              <h3 id="api-title" className="mt-4 text-xl font-semibold text-ink">
                {API_DESTINATION.name}
              </h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">
                {API_DESTINATION.body}
              </p>
              <ul className="mt-6 space-y-2.5">
                {API_ENDPOINTS.map((e) => (
                  <li key={`${e.method} ${e.path}`} className="flex gap-3 text-sm">
                    <span
                      className={cn(
                        "mt-0.5 w-12 shrink-0 self-start rounded px-1.5 py-0.5 text-center font-mono text-[0.68rem] font-semibold",
                        e.method === "GET"
                          ? "bg-success/10 text-success"
                          : "bg-cta-soft text-cta-hover",
                      )}
                    >
                      {e.method}
                    </span>
                    <span className="min-w-0 text-muted-foreground">
                      <code className="break-all font-mono text-[0.8rem] text-ink">
                        {API_BASE}
                        {e.path}
                      </code>
                      <span className="block">{e.does}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                to="/integrations/$slug"
                params={{ slug: "api" }}
                className="mt-7 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-cta underline decoration-cta/30 underline-offset-4 transition-colors hover:decoration-cta"
              >
                Read the API guide <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
            </div>
            <ApiSnippet className="min-w-0" />
          </article>
        </Reveal>

        {live.length > 0 && (
          <Reveal delay={0.05} className="mt-10">
            <h3 className="text-sm font-semibold text-ink">Native connectors</h3>
            <ul className="mt-4 grid gap-4 md:grid-cols-3">
              {live.map((d) => (
                <ConnectorCard key={d.id} d={d} />
              ))}
            </ul>
          </Reveal>
        )}

        {awaiting.length > 0 && (
          <Reveal delay={0.05} className="mt-10">
            <h3 className="text-sm font-semibold text-ink">Built, awaiting marketplace approval</h3>
            <ul className="mt-4 grid gap-4 md:grid-cols-3">
              {awaiting.map((d) => (
                <ConnectorCard key={d.id} d={d} />
              ))}
            </ul>
          </Reveal>
        )}

        {planned.length > 0 && (
          <Reveal delay={0.05} className="mt-10">
            <h3 className="text-sm font-semibold text-ink">Planned</h3>
            <ul className="mt-4 grid gap-4 md:grid-cols-2">
              {planned.map((d) => (
                <ConnectorCard key={d.id} d={d} compact />
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ---------- 3. What arrives ---------- */

function Cell({ cell }: { cell: PayloadCell }) {
  return (
    <span className="flex items-start gap-2">
      {cell.sent ? (
        <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-success" strokeWidth={2.5} />
      ) : (
        <Minus aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      )}
      <span className={cell.sent ? "text-ink" : "text-muted-foreground"}>{cell.note}</span>
    </span>
  );
}

const COLUMNS = (["api", "webflow", "shopify"] as const).map((id) => {
  const d = DESTINATIONS.find((x) => x.id === id)!;
  return { id, name: id === "api" ? "Publishing API" : d.name, stage: d.stage };
});

export function PublishingPayload() {
  return (
    <section aria-labelledby="payload-title" className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5">
        <Heading
          id="payload-title"
          eyebrow="What arrives"
          title="Exactly what lands on your site"
          intro="Field by field, for the API and both connectors, including what isn't sent yet."
        />

        <Reveal className="mt-14">
          {/* Scrolls sideways inside its own frame on a phone; the field
              column stays pinned so every row keeps its label. */}
          <div
            role="region"
            aria-labelledby="payload-title"
            tabIndex={0}
            className="overflow-x-auto rounded-2xl border border-border bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta"
          >
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
              <caption className="sr-only">
                The fields each publishing path sends to your site
              </caption>
              <thead>
                <tr className="border-b border-border">
                  <th
                    scope="col"
                    className="sticky left-0 bg-card px-5 py-4 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground"
                  >
                    Field
                  </th>
                  {COLUMNS.map((c) => (
                    <th key={c.id} scope="col" className="px-5 py-4 align-bottom">
                      <span className="block text-sm font-semibold text-ink">{c.name}</span>
                      <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                        {c.stage === "available" ? "Available" : "Awaiting approval"}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PAYLOAD.map((row) => (
                  <tr key={row.field} className="border-b border-border last:border-b-0">
                    <th
                      scope="row"
                      className="sticky left-0 bg-card px-5 py-3.5 font-medium text-ink"
                    >
                      {row.field}
                    </th>
                    {COLUMNS.map((c) => (
                      <td key={c.id} className="px-5 py-3.5">
                        <Cell cell={row[c.id]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground sm:hidden">
            Swipe the table sideways to see Webflow and Shopify.
          </p>
          <p className="mx-auto mt-5 max-w-3xl text-center text-sm leading-relaxed text-muted-foreground">
            {PAYLOAD_NOTE}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
