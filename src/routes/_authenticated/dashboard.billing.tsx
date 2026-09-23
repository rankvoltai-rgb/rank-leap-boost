import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  ExternalLink,
  Loader2,
  Lock,
  Plus,
} from "lucide-react";
import { CardIcon, CheckIcon } from "@/components/dashboard/icons";
import { useActiveSite } from "@/components/dashboard/site-context";
import { Panel, Pill, Button, PageHeader } from "@/components/dashboard/primitives";
import { ActivateNow } from "@/components/studio/StudioGate";
import { SiteMark, siteDomain, siteName } from "@/components/studio/SiteMark";
import {
  formatUsd,
  PLAN,
  PRICING_FAQS,
  STUDIO,
  TRIAL_ARTICLE_CREDITS,
  TRIAL_DAYS,
} from "@/data/pricing";
import { getSubscription, listCreditAccounts, type CreditAccount } from "@/lib/data";
import { formatDate, formatShortDate } from "@/lib/format-date";
import { createPortalSession } from "@/lib/payments.functions";
import { monthlyTotal, siteIsBilled } from "@/lib/studio";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard/billing")({
  component: Billing,
});

const DAY_MS = 86_400_000;

const STATUS_LABELS: Record<
  string,
  { label: string; tone: "success" | "warning" | "danger" | "neutral" }
> = {
  trialing: { label: "Free trial", tone: "success" },
  active: { label: "Active", tone: "success" },
  past_due: { label: "Payment due", tone: "warning" },
  canceled: { label: "Canceled", tone: "danger" },
  incomplete: { label: "Incomplete", tone: "warning" },
  unpaid: { label: "Unpaid", tone: "danger" },
  paused: { label: "Paused", tone: "neutral" },
};

/**
 * Every billing situation the page can be in. Each one gets exactly one
 * primary action — the thing that moves this customer forward — and nothing
 * competes with it.
 */
type BillingState = "none" | "trialing" | "active" | "canceling" | "past_due" | "lapsed";

function billingStateOf(
  sub: { status: string; cancel_at_period_end: boolean | null } | null | undefined,
): BillingState {
  if (!sub) return "none";
  if (sub.status === "trialing") return sub.cancel_at_period_end ? "canceling" : "trialing";
  if (["past_due", "unpaid", "incomplete"].includes(sub.status)) return "past_due";
  if (sub.status !== "active") return "lapsed";
  return sub.cancel_at_period_end ? "canceling" : "active";
}

/** What the plan includes, from the one place plan numbers live. */
const INCLUDED: { label: string; paidOnly?: boolean }[] = [
  { label: `${PLAN.articlesPerMonth} articles researched, written and published a month` },
  { label: `${PLAN.backlinkCreditsPerMonth} backlink credits in the exchange`, paidOnly: true },
  { label: `${PLAN.redditRepliesPerMonth} Reddit reply drafts a month`, paidOnly: true },
  { label: "Citation tracking across AI search engines" },
  { label: "Unlimited rewrites and team members" },
];

/** The questions people actually have while looking at a bill. */
const BILLING_FAQS = [
  "Can I cancel anytime?",
  "What happens when my free trial ends?",
  "Do you offer refunds?",
  "How do I pay?",
]
  .map((q) => PRICING_FAQS.find((f) => f.q === q))
  .filter((f): f is (typeof PRICING_FAQS)[number] => !!f);

function daysUntil(iso: string | null | undefined): number | null {
  if (!iso) return null;
  return Math.max(0, Math.ceil((Date.parse(iso) - Date.now()) / DAY_MS));
}

/** Share of the current period already elapsed, 0–1. */
function periodElapsed(start: string | null | undefined, end: string | null | undefined): number {
  if (!start || !end) return 0;
  const s = Date.parse(start);
  const e = Date.parse(end);
  if (!(e > s)) return 0;
  return Math.min(1, Math.max(0, (Date.now() - s) / (e - s)));
}

/**
 * The account's one subscription: the plan, every Studio site billed on top of
 * it, and the door to Stripe's portal for the card and invoices. Account-wide,
 * whichever site the switcher is on.
 */
function Billing() {
  const openPortal = useServerFn(createPortalSession);
  const [opening, setOpening] = useState(false);
  const { allSites } = useActiveSite();

  const { data: subscription, isLoading } = useQuery({
    queryKey: ["subscription"],
    queryFn: getSubscription,
  });
  const { data: credits = [] } = useQuery({
    queryKey: ["credits", "all"],
    queryFn: listCreditAccounts,
    enabled: !!subscription,
  });

  const state = billingStateOf(subscription);
  const primary = allSites.find((s) => s.kind === "primary");
  const studio = allSites.filter((s) => s.kind === "studio" && s.status === "active");
  const billed = allSites.filter(siteIsBilled).length;
  const creditsFor = (siteId: string) => credits.find((c) => c.site_id === siteId);

  async function manage() {
    setOpening(true);
    try {
      const result = await openPortal({
        data: { returnUrl: `${window.location.origin}/dashboard/billing` },
      });
      if ("error" in result) throw new Error(result.error);
      window.open(result.url, "_blank");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't open billing portal.");
    } finally {
      setOpening(false);
    }
  }

  const portalButton = (variant: "solid" | "ghost", label: ReactNode, className?: string) => (
    <Button variant={variant} onClick={manage} disabled={opening} className={className}>
      {opening ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {opening ? "Opening Stripe…" : label}
    </Button>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Plan & Billing" />
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="h-80 animate-pulse rounded-card border border-border bg-secondary/50" />
          <div className="h-80 animate-pulse rounded-card border border-border bg-secondary/50" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Plan & Billing"
        description="One plan, one invoice, every site on it."
        action={
          subscription &&
          portalButton(
            "ghost",
            <>
              <CardIcon className="h-4 w-4" /> Card &amp; invoices
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            </>,
          )
        }
      />

      {state === "past_due" && (
        <Banner
          tone="danger"
          title="Your last payment didn't go through"
          body="Update your card to keep autopilot publishing. Your articles and settings are safe in the meantime."
          action={portalButton("solid", "Update card")}
        />
      )}
      {subscription && state === "canceling" && (
        <Banner
          tone="warning"
          title={`Your plan ends ${formatDate(subscription.current_period_end)}`}
          body="After that, autopilot, backlinks and Reddit stop, along with every Studio site. Everything already published stays on your site."
          action={portalButton("solid", "Keep my plan")}
        />
      )}
      {state === "lapsed" && (
        <Banner
          tone="warning"
          title="Your plan isn't active"
          body="Your articles and settings are saved. Restart your plan and autopilot picks up where it left off."
          action={<PrimaryLink to="/dashboard" hash="start-trial" label="Restart plan" />}
        />
      )}

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        {subscription ? (
          <PlanCard
            subscription={subscription}
            state={state}
            trialUsed={primary ? creditsFor(primary.id) : undefined}
          />
        ) : (
          <OfferCard />
        )}
        <aside className="space-y-4">
          {subscription ? (
            <InvoiceCard
              subscription={subscription}
              state={state}
              billed={billed}
              action={
                state === "past_due" || state === "canceling"
                  ? null
                  : portalButton(
                      "ghost",
                      <>
                        Manage in Stripe
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                      </>,
                      "w-full",
                    )
              }
            />
          ) : (
            <TodayCard />
          )}
          <Trust />
        </aside>
      </div>

      {subscription && (
        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
            <div>
              <h2 className="text-sm font-semibold text-ink">Sites &amp; usage</h2>
              <p className="text-sm text-muted-foreground">
                Every site has its own allowance, on the same invoice and card.
              </p>
            </div>
            <Link
              to="/dashboard/studio"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-cta transition-colors hover:text-cta-hover"
            >
              Manage in Studio <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {primary && (
              <SiteLine
                site={primary}
                credits={creditsFor(primary.id)}
                price="Included"
                note="Your plan's site"
              />
            )}
            {studio.map((site) => (
              <SiteLine
                key={site.id}
                site={site}
                credits={creditsFor(site.id)}
                price={site.removes_at ? "Not renewing" : `${formatUsd(STUDIO.monthlyPerSite)}/mo`}
                note={
                  site.removes_at
                    ? `Leaves Studio ${formatShortDate(site.removes_at)}`
                    : "Studio site"
                }
              />
            ))}
          </ul>
          {state === "active" && (
            <Link
              to="/dashboard/studio/new"
              className="group flex items-center gap-3 border-t border-dashed border-border px-6 py-4 transition-colors hover:bg-cta-soft"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-dashed border-cta/40 text-cta">
                <Plus className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-ink">
                  {studio.length ? "Add another site" : "Running more than one site?"}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {formatUsd(STUDIO.monthlyPerSite)} a month each, with the full plan of its own.
                  Remove it any time.
                </span>
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-cta">
                Add site
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          )}
        </Panel>
      )}

      <Faq showTrial={state === "none" || state === "trialing"} />
    </div>
  );
}

/* ---------- the plan ---------- */

type Sub = NonNullable<Awaited<ReturnType<typeof getSubscription>>>;

function PlanCard({
  subscription,
  state,
  trialUsed,
}: {
  subscription: Sub;
  state: BillingState;
  trialUsed: CreditAccount | undefined;
}) {
  const status = STATUS_LABELS[subscription.status] ?? {
    label: subscription.status,
    tone: "neutral" as const,
  };
  const trialing = subscription.status === "trialing";
  const left = daysUntil(subscription.current_period_end);
  const elapsed = periodElapsed(subscription.current_period_start, subscription.current_period_end);

  const periodLine = trialing
    ? left === null
      ? "Free trial"
      : `${left} day${left === 1 ? "" : "s"} left in your free trial`
    : state === "canceling"
      ? `Access until ${formatDate(subscription.current_period_end)}`
      : state === "lapsed"
        ? "Not renewing"
        : state === "past_due"
          ? "Payment overdue"
          : `Renews ${formatDate(subscription.current_period_end)}`;

  return (
    <Panel className="overflow-hidden">
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Your plan
          </p>
          <Pill tone={state === "canceling" ? "warning" : status.tone}>
            {state === "canceling" ? "Ending" : status.label}
          </Pill>
        </div>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">{PLAN.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Everything Rankbox does, for one site.
            </p>
          </div>
          <p className="text-ink">
            <span className="text-3xl font-semibold tracking-tight tabular-nums">
              {formatUsd(PLAN.monthly)}
            </span>
            <span className="text-sm text-muted-foreground"> / month</span>
          </p>
        </div>

        {state !== "lapsed" && (
          <div className="mt-6">
            <div className="flex items-baseline justify-between gap-3 text-xs">
              <span className="font-medium text-ink">{periodLine}</span>
              <span className="text-muted-foreground tabular-nums">
                {formatShortDate(subscription.current_period_start)} –{" "}
                {formatShortDate(subscription.current_period_end)}
              </span>
            </div>
            <Meter
              value={elapsed}
              className="mt-2"
              tone={state === "canceling" ? "warning" : state === "past_due" ? "danger" : "cta"}
            />
          </div>
        )}
      </div>

      {trialing ? (
        <div className="border-t border-border bg-secondary/40 p-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-ink">Trial articles</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                The full {PLAN.articlesPerMonth} a month start with your first payment.
              </p>
              <UsageMeter
                used={trialUsed?.credits_used ?? 0}
                total={trialUsed?.credits_total ?? TRIAL_ARTICLE_CREDITS}
                className="mt-3"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-ink">Waiting on your first payment</p>
              <ul className="mt-2 space-y-1.5">
                {INCLUDED.filter((i) => i.paidOnly).map((i) => (
                  <li
                    key={i.label}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {i.label}
                  </li>
                ))}
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  Studio, to add more sites
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-sm text-sm text-muted-foreground">
              {state === "canceling"
                ? `Your trial ends ${formatDate(subscription.current_period_end)} and won't convert.`
                : `Don't want to wait? Start now and everything unlocks today. Your first ${formatUsd(PLAN.monthly)} is charged now instead of ${formatShortDate(subscription.current_period_end)}.`}
            </p>
            {state !== "canceling" && (
              <ActivateNow
                label="Unlock everything now"
                successMessage="Your plan is active. Backlinks, Reddit and Studio are open."
              />
            )}
          </div>
        </div>
      ) : (
        <div className="border-t border-border p-6">
          <p className="text-sm font-medium text-ink">Included every month</p>
          <IncludedList className="mt-3 sm:grid-cols-2" />
        </div>
      )}
    </Panel>
  );
}

/** No plan yet: the offer, stated once, with the risk taken off it. */
function OfferCard() {
  return (
    <Panel className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cta via-brand-blue to-cta"
      />
      <div className="p-6 sm:p-8">
        <Pill tone="info">{TRIAL_DAYS}-day free trial</Pill>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Put your search growth on autopilot
        </h2>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground sm:text-base">
          Rankbox researches, writes and publishes articles to your site on schedule, then tracks
          where AI search cites you. One plan, everything in it.
        </p>

        <div className="mt-6 flex items-end gap-2">
          <span className="text-4xl font-semibold tracking-tight text-ink tabular-nums">
            {formatUsd(PLAN.monthly)}
          </span>
          <span className="pb-1 text-sm text-muted-foreground">/ month after your trial</span>
        </div>

        <IncludedList className="mt-6 sm:grid-cols-2" />

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <PrimaryLink
            to="/dashboard"
            hash="start-trial"
            label={`Start ${TRIAL_DAYS}-day free trial`}
            size="lg"
          />
          <p className="text-xs text-muted-foreground">No charge today · Cancel in one click</p>
        </div>
      </div>
    </Panel>
  );
}

function IncludedList({ className }: { className?: string }) {
  return (
    <ul className={cn("grid gap-x-6 gap-y-2.5", className)}>
      {INCLUDED.map((i) => (
        <li key={i.label} className="flex items-start gap-2.5 text-sm text-ink">
          <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-cta-soft text-cta">
            <CheckIcon className="h-2.5 w-2.5" />
          </span>
          {i.label}
        </li>
      ))}
    </ul>
  );
}

/* ---------- the money ---------- */

function InvoiceCard({
  subscription,
  state,
  billed,
  action,
}: {
  subscription: Sub;
  state: BillingState;
  billed: number;
  action: ReactNode;
}) {
  const trialing = subscription.status === "trialing";
  const ending = state === "canceling" || state === "lapsed";

  return (
    <Panel className="p-5">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {trialing ? "First charge" : "Next invoice"}
      </p>
      {ending ? (
        <>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">None scheduled</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {state === "canceling"
              ? `Nothing more is charged. Your plan runs to ${formatDate(subscription.current_period_end)}.`
              : "Your plan isn't renewing."}
          </p>
        </>
      ) : (
        <>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-ink tabular-nums">
            {formatUsd(monthlyTotal(billed))}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {state === "past_due" ? "Due now" : `On ${formatDate(subscription.current_period_end)}`}
          </p>
          <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            <Line label={`${PLAN.name} plan`} value={formatUsd(PLAN.monthly)} />
            {billed > 0 && (
              <Line
                label={`Studio · ${billed} site${billed === 1 ? "" : "s"} × ${formatUsd(STUDIO.monthlyPerSite)}`}
                value={formatUsd(billed * STUDIO.monthlyPerSite)}
              />
            )}
            <div className="flex items-center justify-between border-t border-border pt-2 font-medium text-ink">
              <dt>Total / month</dt>
              <dd className="tabular-nums">{formatUsd(monthlyTotal(billed))}</dd>
            </div>
          </dl>
          {trialing && (
            <p className="mt-3 text-xs text-muted-foreground">
              Cancel before {formatShortDate(subscription.current_period_end)} and you pay nothing.
            </p>
          )}
        </>
      )}
      {action && <div className="mt-5">{action}</div>}
    </Panel>
  );
}

/** No plan: what today costs versus later — the anchor that makes the trial easy. */
function TodayCard() {
  return (
    <Panel className="p-5">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        What you pay
      </p>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="font-medium text-ink">Today</dt>
          <dd className="text-2xl font-semibold tracking-tight text-cta tabular-nums">$0</dd>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3">
          <dt className="text-muted-foreground">After {TRIAL_DAYS} days</dt>
          <dd className="font-medium text-ink tabular-nums">{formatUsd(PLAN.monthly)}/mo</dd>
        </div>
      </dl>
      <p className="mt-4 text-xs text-muted-foreground">
        Your card is only charged once the trial ends. Cancel before then and you pay nothing.
      </p>
    </Panel>
  );
}

function Trust() {
  return (
    <ul className="space-y-2 px-1 text-xs text-muted-foreground">
      <li className="flex items-center gap-2">
        <Lock className="h-3.5 w-3.5" /> Payments processed by Stripe. We never see your card.
      </li>
      <li className="flex items-center gap-2">
        <CheckIcon className="h-3.5 w-3.5" /> No contracts or setup fees. Cancel in one click.
      </li>
    </ul>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-muted-foreground">
      <dt className="min-w-0 truncate">{label}</dt>
      <dd className="shrink-0 tabular-nums text-ink">{value}</dd>
    </div>
  );
}

/* ---------- sites ---------- */

function SiteLine({
  site,
  credits,
  price,
  note,
}: {
  site: Parameters<typeof SiteMark>[0]["site"];
  credits: CreditAccount | undefined;
  price: string;
  note: string;
}) {
  const domain = siteDomain(site);
  return (
    <li className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 px-6 py-4 sm:grid-cols-[auto_minmax(0,1fr)_200px_auto]">
      <SiteMark site={site} size="sm" />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ink">{siteName(site)}</p>
        <p className="truncate text-xs text-muted-foreground">
          {[domain, note].filter(Boolean).join(" · ")}
        </p>
      </div>
      <div className="col-span-3 row-start-2 sm:col-span-1 sm:row-start-auto">
        {credits ? (
          <UsageMeter used={credits.credits_used} total={credits.credits_total} compact />
        ) : (
          <p className="text-xs text-muted-foreground">No articles this cycle yet</p>
        )}
      </div>
      <p className="col-start-3 row-start-1 shrink-0 text-right text-sm tabular-nums text-ink sm:col-start-auto sm:row-start-auto sm:w-24">
        {price}
      </p>
    </li>
  );
}

/* ---------- small parts ---------- */

function UsageMeter({
  used,
  total,
  compact,
  className,
}: {
  used: number;
  total: number;
  compact?: boolean;
  className?: string;
}) {
  const share = total > 0 ? Math.min(1, used / total) : 0;
  const left = Math.max(0, total - used);
  const tone = share >= 1 ? "danger" : share >= 0.8 ? "warning" : "cta";
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <span className="text-ink tabular-nums">
          <span className="font-semibold">{used}</span>
          <span className="text-muted-foreground"> / {total} articles</span>
        </span>
        {!compact && <span className="text-muted-foreground tabular-nums">{left} left</span>}
      </div>
      <Meter value={share} tone={tone} className="mt-1.5" />
    </div>
  );
}

function Meter({
  value,
  tone = "cta",
  className,
}: {
  value: number;
  tone?: "cta" | "warning" | "danger";
  className?: string;
}) {
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      className={cn("h-1.5 overflow-hidden rounded-full bg-secondary", className)}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-500",
          tone === "cta" && "bg-cta",
          tone === "warning" && "bg-warning",
          tone === "danger" && "bg-destructive",
        )}
        style={{ width: `${Math.max(value > 0 ? 2 : 0, value * 100)}%` }}
      />
    </div>
  );
}

function Banner({
  tone,
  title,
  body,
  action,
}: {
  tone: "warning" | "danger";
  title: string;
  body: string;
  action: ReactNode;
}) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col gap-4 rounded-card border p-5 sm:flex-row sm:items-center",
        tone === "danger"
          ? "border-destructive/25 bg-destructive/5"
          : "border-warning/40 bg-warning/10",
      )}
    >
      <AlertTriangle
        className={cn("h-5 w-5 shrink-0", tone === "danger" ? "text-destructive" : "text-warning")}
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{body}</p>
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

function PrimaryLink({
  to,
  hash,
  label,
  size = "md",
}: {
  to: "/dashboard";
  hash?: string;
  label: string;
  size?: "md" | "lg";
}) {
  return (
    <Link
      to={to}
      hash={hash}
      className={cn(
        "group inline-flex items-center justify-center gap-1.5 rounded-lg bg-cta font-medium text-white shadow-[0_1px_2px_color-mix(in_oklab,var(--cta)_35%,transparent)] transition-colors hover:bg-cta-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        size === "lg" ? "px-5 py-2.5 text-sm sm:text-base" : "px-3.5 py-2 text-sm",
      )}
    >
      {label}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

function Faq({ showTrial }: { showTrial: boolean }) {
  return (
    <section className="space-y-3 pt-2">
      <h2 className="text-sm font-semibold text-ink">Billing questions</h2>
      <Panel className="divide-y divide-border">
        {BILLING_FAQS.filter((f) => showTrial || !f.q.includes("trial")).map((f) => (
          <details key={f.q} className="group px-6 py-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-ink">
              {f.q}
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </Panel>
    </section>
  );
}
