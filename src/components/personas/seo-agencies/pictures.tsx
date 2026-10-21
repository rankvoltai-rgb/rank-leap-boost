/**
 * The small product pictures on /use-cases/seo-agencies: one per onboarding
 * step, the delivery-cost sheet, and the new account that rises from the
 * closing band. White screens on hairlines, soft blue for the selected state,
 * as on the landing.
 *
 * Every client is a placeholder from the deck (client-deck.tsx). Nothing here
 * shows citation tracking or team invites, which haven't shipped, and no
 * number reads as a result: counts are the plan's allowance, and the only
 * prices are our own, read from data/pricing.
 */
import type { ReactNode } from "react";
import { Check, Globe, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/brand/Mark";
import { PLAN, STUDIO, formatUsd } from "@/data/pricing";
import type { StackItem } from "@/data/personas";
import { ClientTile, SampleTag, StatusChip, Switch } from "./client-deck";
import { CLIENTS, type Client } from "./clients";

const SCREEN =
  "rounded-xl border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_28px_-18px_rgba(16,24,40,0.2)]";

function Head({ title, right }: { title: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-ink/[0.07] px-3 py-2">
      <span className="min-w-0 truncate text-[0.7rem] font-semibold text-ink">{title}</span>
      {right}
    </div>
  );
}

/* ---------- Onboarding steps ---------- */

const ONE = CLIENTS[0];

/* 1 · Kickoff: the client's domain goes in, and it reads their site. */
export function KickoffPicture() {
  return (
    <div className={SCREEN}>
      <Head
        title={STUDIO.live ? "Add a site" : "New plan"}
        right={
          STUDIO.live ? (
            <span className="rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.6rem] font-semibold text-cta">
              {STUDIO.name}
            </span>
          ) : undefined
        }
      />
      <div className="space-y-2 p-3">
        <div className="flex items-center gap-2 rounded-lg border border-cta/40 bg-white px-2.5 py-1.5 shadow-[0_0_0_3px_color-mix(in_oklab,var(--cta)_10%,transparent)]">
          <span className="font-mono text-[0.68rem] text-ink">client-six.com</span>
          <span className="h-3 w-px animate-pulse bg-cta" />
        </div>
        {["Category", "Voice"].map((label) => (
          <div key={label} className="flex items-center justify-between text-[0.66rem]">
            <span className="text-muted-foreground">{label}</span>
            <Learned />
          </div>
        ))}
        <p className="text-[0.6rem] text-muted-foreground">
          Read from the client&rsquo;s own pages
        </p>
      </div>
    </div>
  );
}

/* 2 · Week 1: the ranked map, edited against the strategy. */
export function MapPicture() {
  const approved = [true, true, false];
  return (
    <div className={SCREEN}>
      <Head
        title="Topic map"
        right={<span className="font-mono text-[0.6rem] text-muted-foreground">{ONE.domain}</span>}
      />
      <ul className="space-y-1 p-2">
        {ONE.articles.map((q, i) => (
          <li
            key={q}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5",
              approved[i] ? "bg-cta-soft/60" : "bg-white",
            )}
          >
            <span
              className={cn(
                "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded",
                approved[i] ? "bg-cta text-white" : "border border-ink/[0.2] bg-white",
              )}
            >
              {approved[i] && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
            </span>
            <span className="min-w-0 truncate text-[0.66rem] font-medium text-ink">{q}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* 3 · Ongoing: where the drafts go. Held for the editor, here. */
export function RoutePicture() {
  return (
    <div className={SCREEN}>
      <Head title="Publishing" />
      <div className="space-y-2.5 p-3">
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-ink/[0.04] p-0.5 text-center text-[0.64rem] font-semibold">
          <span className="rounded-md py-1 text-muted-foreground">Auto-publish</span>
          <span className="rounded-md bg-white py-1 text-cta shadow-[0_1px_2px_rgba(16,24,40,0.08)]">
            Hold for editor
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 rounded-lg border border-ink/[0.07] px-2.5 py-1.5">
          <span className="min-w-0 truncate text-[0.66rem] font-medium text-ink">
            {ONE.articles[2]}
          </span>
          <StatusChip status="In review" />
        </div>
      </div>
    </div>
  );
}

/* 4 · Every month: the account's volume and the score on each article. */
export function ReportPicture() {
  const scores = [
    { t: ONE.articles[0], s: 88 },
    { t: ONE.articles[1], s: 91 },
  ];
  return (
    <div className={SCREEN}>
      <Head
        title="This cycle"
        right={<span className="font-mono text-[0.6rem] text-muted-foreground">{ONE.domain}</span>}
      />
      <div className="space-y-2 p-3">
        <div>
          <div className="flex items-baseline justify-between text-[0.64rem]">
            <span className="text-muted-foreground">Published</span>
            <span className="font-semibold tabular-nums text-ink">
              {PLAN.articlesPerMonth} / {PLAN.articlesPerMonth}
            </span>
          </div>
          <span className="mt-1 block h-1.5 rounded-full bg-cta" />
        </div>
        {scores.map((r) => (
          <div key={r.t} className="flex items-center justify-between gap-2">
            <span className="min-w-0 truncate text-[0.64rem] text-ink">{r.t}</span>
            <span className="shrink-0 rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.6rem] font-semibold tabular-nums text-cta">
              SEO/GEO {r.s}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Delivery cost ---------- */

/**
 * A retainer's cost sheet: the vendor lines that come off, then the one line
 * that goes on. Prices are ours only (data/pricing); the stack items carry
 * none, by the persona rules.
 */
export function CostSheet({ stack }: { stack: StackItem[] }) {
  const lines = STUDIO.live
    ? [
        {
          label: `${PLAN.name} plan`,
          detail: "The first site on the account",
          price: PLAN.monthly,
        },
        {
          label: STUDIO.name,
          detail: "Each extra client site, same invoice",
          price: STUDIO.monthlyPerSite,
        },
      ]
    : [{ label: `${PLAN.name} plan`, detail: "Per client site", price: PLAN.monthly }];

  return (
    <div className={cn(SCREEN, "w-full max-w-[30rem]")}>
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <p className="text-[0.8rem] font-semibold text-ink">Retainer cost sheet</p>
        <SampleTag />
      </div>

      <ul className="border-t border-ink/[0.07]">
        {stack.map((s) => (
          <li
            key={s.label}
            className="flex items-start gap-3 border-b border-ink/[0.07] px-4 py-2.5 sm:px-5"
          >
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#fdedf1] text-[#e11d48]">
              <Minus className="h-2.5 w-2.5" strokeWidth={3} />
            </span>
            <span className="min-w-0">
              <span className="block text-[0.8rem] font-medium text-ink">{s.label}</span>
              <span className="block text-[0.72rem] leading-snug text-muted-foreground">
                {s.detail}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <div className="bg-[color-mix(in_oklab,var(--cta)_5%,white)] px-4 py-3 sm:px-5">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-cta">
          On one invoice
        </p>
        <ul className="mt-2 space-y-2">
          {lines.map((l) => (
            <li key={l.label} className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-cta text-white">
                {l.label === STUDIO.name ? (
                  <Plus className="h-3.5 w-3.5" />
                ) : (
                  <Mark className="h-3.5 w-3.5 text-white" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.8rem] font-semibold text-ink">{l.label}</span>
                <span className="block text-[0.7rem] text-muted-foreground">{l.detail}</span>
              </span>
              <span className="shrink-0 text-[0.85rem] font-semibold tabular-nums text-ink">
                {formatUsd(l.price)}
                <span className="text-[0.7rem] font-normal text-muted-foreground">/mo</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- Closing band ---------- */

/* The next account, set up and waiting on the agency's approval. Rises from
   the blue band's foot and is cut off by it. */
export function NewAccountPeek() {
  const next: Client = {
    ...CLIENTS[0],
    domain: "client-six.com",
    niche: "Your next client",
    icon: Globe,
    tint: "blue",
  };
  return (
    <div className="rounded-t-xl border border-b-0 border-white/40 bg-white p-4 text-left shadow-[0_-12px_48px_-16px_rgba(4,24,72,0.55)] sm:p-5">
      <div className="flex items-center gap-3">
        <ClientTile client={next} className="h-9 w-9" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.86rem] font-semibold text-ink">{next.niche}</p>
          <p className="truncate font-mono text-[0.66rem] text-muted-foreground">{next.domain}</p>
        </div>
        {STUDIO.live && (
          <span className="shrink-0 rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.62rem] font-semibold text-cta">
            {STUDIO.name}
          </span>
        )}
      </div>
      <ul className="mt-4 divide-y divide-ink/[0.07] border-y border-ink/[0.07]">
        {[
          ["Category and voice", <Learned key="a" />],
          ["Topic map", <StatusChip key="b" status="In review" />],
          ["Hold for your editor’s sign-off", <Switch key="c" on />],
        ].map(([label, right]) => (
          <li key={label as string} className="flex items-center justify-between gap-3 py-2.5">
            <span className="text-[0.76rem] font-medium text-ink">{label}</span>
            {right}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-baseline justify-between text-[0.7rem]">
        <span className="text-muted-foreground">Articles this cycle</span>
        <span className="font-semibold tabular-nums text-ink">0 / {PLAN.articlesPerMonth}</span>
      </div>
      <span className="mt-1.5 block h-1.5 rounded-full bg-ink/[0.06]" />
    </div>
  );
}

function Learned() {
  return (
    <span className="flex items-center gap-1 text-[0.66rem] font-semibold text-success">
      <Check className="h-3 w-3" strokeWidth={3} />
      Learned
    </span>
  );
}
