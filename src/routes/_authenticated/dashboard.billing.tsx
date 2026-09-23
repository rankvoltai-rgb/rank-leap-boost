import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, ExternalLink, Loader2 } from "lucide-react";
import { CardIcon } from "@/components/dashboard/icons";
import { useActiveSite } from "@/components/dashboard/site-context";
import { SiteMark, siteDomain, siteName } from "@/components/studio/SiteMark";
import { formatUsd, PLAN, STUDIO } from "@/data/pricing";
import { getSubscription } from "@/lib/data";
import { formatShortDate } from "@/lib/format-date";
import { createPortalSession } from "@/lib/payments.functions";
import { monthlyTotal, siteIsBilled } from "@/lib/studio";
import { Panel, Pill, Button, PageHeader, StatCard } from "@/components/dashboard/primitives";

export const Route = createFileRoute("/_authenticated/dashboard/billing")({
  component: Billing,
});

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

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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

  const status = subscription
    ? (STATUS_LABELS[subscription.status] ?? {
        label: subscription.status,
        tone: "neutral" as const,
      })
    : null;
  const primary = allSites.find((s) => s.kind === "primary");
  const studio = allSites.filter((s) => s.kind === "studio" && s.status === "active");
  const billed = allSites.filter(siteIsBilled).length;

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing"
        description="Your subscription, the sites it pays for, and your payment method."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard
          label="Plan"
          value={subscription ? PLAN.name : "No plan yet"}
          hint={`${formatUsd(PLAN.monthly)} / month · 1 site`}
          // The green "live" dot is only true once there is a plan to be live.
          emphasis={!!subscription}
        />
        <StatCard
          label="Studio"
          value={billed ? `${billed} site${billed === 1 ? "" : "s"}` : "None"}
          hint={`${formatUsd(STUDIO.monthlyPerSite)} / month each`}
        />
        <StatCard
          label="Monthly total"
          value={subscription ? formatUsd(monthlyTotal(billed)) : "—"}
          hint={
            subscription?.current_period_end
              ? `${subscription.cancel_at_period_end ? "Ends" : "Renews"} ${formatShortDate(subscription.current_period_end)}`
              : subscription
                ? "Auto-renews"
                : "Nothing billed yet"
          }
        />
      </div>

      <Panel className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-ink">Subscription status</h2>
              {status && <Pill tone={status.tone}>{status.label}</Pill>}
            </div>
            {isLoading ? (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading…
              </p>
            ) : subscription ? (
              <p className="max-w-md text-sm text-muted-foreground">
                {subscription.status === "trialing"
                  ? `Your free trial is active until ${formatDate(subscription.current_period_end)}. You won't be charged until then.`
                  : subscription.cancel_at_period_end
                    ? `Your plan is set to cancel on ${formatDate(subscription.current_period_end)}, along with every Studio site on it.`
                    : `Your ${PLAN.name} plan renews on ${formatDate(subscription.current_period_end)}.`}
              </p>
            ) : (
              <p className="max-w-md text-sm text-muted-foreground">
                You're not on a plan yet. Start your free trial to turn autopilot on — no charge
                today, and you can cancel in one click.
              </p>
            )}
          </div>
          {!isLoading && !subscription ? (
            <Link
              to="/dashboard"
              hash="start-trial"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-cta px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-cta-hover"
            >
              Start free trial <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <Button onClick={manage} disabled={opening || !subscription}>
              {opening ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Opening…
                </>
              ) : (
                <>
                  <CardIcon className="h-4 w-4" /> Manage subscription
                  <ExternalLink className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          )}
        </div>
      </Panel>

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
          <div>
            <h2 className="text-sm font-semibold text-ink">Sites on this subscription</h2>
            <p className="text-sm text-muted-foreground">
              Every site is a line on the same invoice and card.
            </p>
          </div>
          <Link
            to="/dashboard/studio"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-brand-blue"
          >
            Manage in Studio <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <ul className="divide-y divide-border">
          {primary && (
            <SiteLine site={primary} price="Included in your plan" note="Your plan's own site" />
          )}
          {studio.map((site) => (
            <SiteLine
              key={site.id}
              site={site}
              price={
                site.removes_at
                  ? "Not on the next invoice"
                  : `${formatUsd(STUDIO.monthlyPerSite)}/mo`
              }
              note={
                site.removes_at
                  ? `Leaves Studio ${formatShortDate(site.removes_at)}`
                  : "Studio site"
              }
            />
          ))}
        </ul>
        {studio.length === 0 && (
          <p className="border-t border-border px-6 py-4 text-sm text-muted-foreground">
            Running more than one site? Add them in{" "}
            <Link to="/dashboard/studio" className="font-medium text-ink hover:text-brand-blue">
              Studio
            </Link>{" "}
            — {formatUsd(STUDIO.monthlyPerSite)} a month each, with the full plan of their own.
          </p>
        )}
      </Panel>
    </div>
  );
}

function SiteLine({
  site,
  price,
  note,
}: {
  site: Parameters<typeof SiteMark>[0]["site"];
  price: string;
  note: string;
}) {
  const domain = siteDomain(site);
  return (
    <li className="flex items-center gap-3 px-6 py-3">
      <SiteMark site={site} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{siteName(site)}</p>
        <p className="truncate text-xs text-muted-foreground">
          {[domain, note].filter(Boolean).join(" · ")}
        </p>
      </div>
      <p className="shrink-0 text-sm tabular-nums text-ink">{price}</p>
    </li>
  );
}
