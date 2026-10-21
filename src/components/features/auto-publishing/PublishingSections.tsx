/**
 * The sections only /features/auto-publishing has, drawn in the landing
 * page's frame: the answer block (a definition an answer engine can quote as
 * is), where articles can go with each destination's real status, and a
 * field-by-field account of what arrives. All copy and status comes from
 * src/data/auto-publishing.ts, so a connector flipping live updates it here.
 */
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpenText,
  Check,
  CircleCheck,
  CircleDashed,
  Hourglass,
  Info,
  Minus,
  Route,
  Table2,
} from "lucide-react";
import { Reveal } from "@/components/landing/shared";
import {
  Accent,
  Band,
  GHOST_BUTTON,
  LINE,
  PANEL,
  Pill,
  SectionHead,
  Spacer,
} from "@/components/landing/frame";
import { IntegrationLogo } from "@/components/dashboard/integration-logos";
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
import { ApiSample } from "./pictures";

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
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-ink/[0.08] bg-white px-2.5 py-1 text-[0.75rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <Icon aria-hidden className={cn("h-3.5 w-3.5 shrink-0", className)} />
      {label}
    </span>
  );
}

/** A sentence with its last `words` words set in the blue accent. */
function accented(text: string, words: number) {
  const parts = text.split(" ");
  return (
    <>
      {parts.slice(0, -words).join(" ")} <Accent>{parts.slice(-words).join(" ")}</Accent>
    </>
  );
}

/* ---------- 1. The answer ---------- */

/** One paragraph that says what the feature is and how it works, written to
 *  be quoted whole. */
export function PublishingAnswer() {
  return (
    <section aria-labelledby="answer-title">
      <Spacer />
      <Band inner="px-5 py-14 sm:px-10 sm:py-20">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Pill icon={BookOpenText}>The short answer</Pill>
          <h2
            id="answer-title"
            className="mt-5 text-balance font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]"
          >
            {accented(ANSWER.question, 1)}
          </h2>
          <p className="mt-6 text-pretty text-[1.05rem] leading-[1.75] text-ink/80 sm:text-[1.2rem]">
            {ANSWER.answer}
          </p>
        </Reveal>
      </Band>
    </section>
  );
}

/* ---------- 2. Where articles go ---------- */

/** One connector on the status board: name, where it stands, what it does. */
function BoardRow({ d }: { d: Destination }) {
  return (
    <li
      className={cn(
        "grid gap-3 border-t px-6 py-5 sm:px-10 md:grid-cols-[13rem_19rem_1fr] md:items-center md:gap-6 lg:px-12",
        LINE,
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
        <h4 className="text-[1rem] font-semibold tracking-tight text-ink">{d.name}</h4>
      </div>
      <div>
        <StageBadge stage={d.stage} label={d.status} />
      </div>
      <p className="text-[0.88rem] leading-relaxed text-muted-foreground">{d.body}</p>
    </li>
  );
}

function BoardGroup({ title, items }: { title: string; items: Destination[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <div
        className={cn("flex items-center justify-between gap-3 px-6 py-3 sm:px-10 lg:px-12", PANEL)}
      >
        <h3 className="text-[0.8rem] font-semibold text-ink">{title}</h3>
        <span className="text-[0.72rem] tabular-nums text-muted-foreground">{items.length}</span>
      </div>
      <ul>
        {items.map((d) => (
          <BoardRow key={d.id} d={d} />
        ))}
      </ul>
    </div>
  );
}

export function PublishingDestinations() {
  const live = destinationsIn("available").filter((d) => d.id !== "api");
  const awaiting = destinationsIn("awaiting-approval");
  const planned = destinationsIn("planned");

  return (
    <section id="destinations" aria-labelledby="destinations-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={Route}
        eyebrow="Where articles go"
        title={
          <span id="destinations-title">
            Where your articles can go <Accent>today</Accent>
          </span>
        }
        subtitle="Every destination with its real status, so you know what works before you start a trial."
      />

      {/* The path that works for every site today. */}
      <Band>
        <article aria-labelledby="api-title" className="grid lg:grid-cols-[0.92fr_1.08fr]">
          <Reveal className="flex min-w-0 flex-col justify-center px-6 py-10 sm:px-10 lg:py-14 lg:pl-12 lg:pr-10">
            <div>
              <StageBadge stage="available" label={API_DESTINATION.status} />
            </div>
            <h3
              id="api-title"
              className="mt-5 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.85rem]"
            >
              {API_DESTINATION.name}
            </h3>
            <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
              {API_DESTINATION.body}
            </p>
            <ul className={cn("mt-7 divide-y border-y", LINE, "divide-ink/[0.07]")}>
              {API_ENDPOINTS.map((e) => (
                <li key={`${e.method} ${e.path}`} className="flex gap-3 py-3 text-sm">
                  <span
                    className={cn(
                      "mt-0.5 w-12 shrink-0 self-start rounded-md px-1.5 py-0.5 text-center font-mono text-[0.66rem] font-semibold",
                      e.method === "GET" ? "bg-success/10 text-success" : "bg-cta-soft text-cta",
                    )}
                  >
                    {e.method}
                  </span>
                  <span className="min-w-0 text-[0.85rem] text-muted-foreground">
                    <code className="break-all font-mono text-[0.78rem] text-ink">
                      {API_BASE}
                      {e.path}
                    </code>
                    <span className="mt-0.5 block">{e.does}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link
              to="/integrations/$slug"
              params={{ slug: "api" }}
              className={cn(GHOST_BUTTON, "group/btn mt-7 min-h-11 w-fit px-4")}
            >
              Read the API guide
              <ArrowRight
                aria-hidden
                className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5"
              />
            </Link>
          </Reveal>
          <div
            className={cn(
              "flex min-w-0 items-center border-t px-4 py-10 sm:px-10 lg:border-l lg:border-t-0 lg:py-14",
              LINE,
              PANEL,
            )}
          >
            <Reveal delay={0.08} className="w-full min-w-0">
              <ApiSample />
            </Reveal>
          </div>
        </article>
      </Band>

      {/* Every connector, at its real status. */}
      <Band>
        <BoardGroup title="Native connectors" items={live} />
        <BoardGroup title="Built, awaiting marketplace approval" items={awaiting} />
        <BoardGroup title="Planned" items={planned} />
      </Band>
    </section>
  );
}

/* ---------- 3. What arrives ---------- */

function Cell({ cell }: { cell: PayloadCell }) {
  return (
    <span className="flex items-start gap-2">
      {cell.sent ? (
        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
          <Check aria-hidden className="h-2.5 w-2.5" strokeWidth={3} />
        </span>
      ) : (
        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-ink/[0.06] text-muted-foreground">
          <Minus aria-hidden className="h-2.5 w-2.5" strokeWidth={3} />
        </span>
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
    <section aria-labelledby="payload-title">
      <Spacer />
      <SectionHead
        icon={Table2}
        eyebrow="What arrives"
        title={
          <span id="payload-title">
            Exactly what lands <Accent>on your site</Accent>
          </span>
        }
        subtitle="Field by field, for the API and both connectors, including what isn't sent yet."
      />

      <Band>
        <p className="px-6 pt-4 text-center text-xs text-muted-foreground sm:hidden">
          Swipe the table sideways to see Webflow and Shopify.
        </p>
        {/* Scrolls sideways inside the rails on a phone; the field column
            stays pinned so every row keeps its label. */}
        <div
          role="region"
          aria-labelledby="payload-title"
          tabIndex={0}
          className="overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta"
        >
          <table className="w-full min-w-[38rem] border-collapse text-left text-[0.88rem]">
            <caption className="sr-only">
              The fields each publishing path sends to your site
            </caption>
            <thead>
              <tr className={cn("border-b", LINE)}>
                <th
                  scope="col"
                  className="sticky left-0 z-10 w-[11rem] bg-white px-6 py-5 align-bottom text-[0.75rem] font-medium text-muted-foreground sm:px-10 lg:w-[16rem] lg:pl-12"
                >
                  Field
                </th>
                {COLUMNS.map((c) => {
                  const { icon: Icon, className } = STAGE_ICON[c.stage];
                  return (
                    <th
                      key={c.id}
                      scope="col"
                      className={cn(
                        "border-l px-5 py-5 align-bottom",
                        LINE,
                        c.stage === "available" && "bg-[color-mix(in_oklab,var(--cta)_4%,white)]",
                      )}
                    >
                      <span className="flex items-center gap-2">
                        {c.id === "api" ? (
                          <span
                            aria-hidden
                            className="flex h-6 w-6 items-center justify-center rounded-md bg-cta text-[0.6rem] font-bold text-white"
                          >
                            API
                          </span>
                        ) : (
                          <span aria-hidden>
                            <IntegrationLogo id={c.id} title={false} className="h-6 w-6" />
                          </span>
                        )}
                        <span className="text-[0.9rem] font-semibold text-ink">{c.name}</span>
                      </span>
                      <span className="mt-1.5 flex items-center gap-1 text-[0.72rem] font-normal text-muted-foreground">
                        <Icon aria-hidden className={cn("h-3 w-3", className)} />
                        {c.stage === "available" ? "Available" : "Awaiting approval"}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {PAYLOAD.map((row) => {
                const none = !row.api.sent && !row.webflow.sent && !row.shopify.sent;
                return (
                  <tr key={row.field} className={cn("border-b last:border-b-0", LINE)}>
                    <th
                      scope="row"
                      className={cn(
                        "sticky left-0 z-10 px-6 py-4 font-medium text-ink sm:px-10 lg:pl-12",
                        none ? "bg-[color-mix(in_oklab,var(--surface)_70%,white)]" : "bg-white",
                      )}
                    >
                      {row.field}
                    </th>
                    {COLUMNS.map((c) => (
                      <td
                        key={c.id}
                        className={cn(
                          "border-l px-5 py-4",
                          LINE,
                          none
                            ? "bg-[color-mix(in_oklab,var(--surface)_70%,white)]"
                            : c.stage === "available" &&
                                "bg-[color-mix(in_oklab,var(--cta)_4%,white)]",
                        )}
                      >
                        <Cell cell={row[c.id]} />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Band>

      <Band inner="flex justify-center px-6 py-6 sm:px-10">
        <p className="flex max-w-3xl items-start gap-2.5 text-[0.88rem] leading-relaxed text-muted-foreground">
          <Info aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-cta" />
          {PAYLOAD_NOTE}
        </p>
      </Band>
    </section>
  );
}
