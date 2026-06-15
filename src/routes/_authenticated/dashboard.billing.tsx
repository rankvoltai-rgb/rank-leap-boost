import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { CreditCard, ExternalLink, Loader2 } from "lucide-react";
import { getSubscription, getCredits } from "@/lib/api";
import { createPortalSession } from "@/lib/payments.functions";
import { getStripeEnvironment } from "@/lib/stripe";
import { Panel, Pill, Button, PageHeader, StatCard } from "@/components/dashboard/primitives";

export const Route = createFileRoute("/_authenticated/dashboard/billing")({
  component: Billing,
});

const STATUS_LABELS: Record<string, { label: string; tone: "success" | "warning" | "danger" | "neutral" }> = {
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

function Billing() {
  const openPortal = useServerFn(createPortalSession);
  const [opening, setOpening] = useState(false);

  const { data: subscription, isLoading } = useQuery({
    queryKey: ["subscription"],
    queryFn: getSubscription,
  });
  const { data: credits } = useQuery({ queryKey: ["credits"], queryFn: getCredits });

  const status = subscription ? STATUS_LABELS[subscription.status] ?? { label: subscription.status, tone: "neutral" as const } : null;
  const remaining = credits ? credits.credits_total - credits.credits_used : null;

  async function manage() {
    setOpening(true);
    try {
      const result = await openPortal({
        data: {
          environment: getStripeEnvironment(),
          returnUrl: `${window.location.origin}/dashboard/billing`,
        },
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
        description="Manage your subscription, payment method, and credits."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard
          label="Plan"
          value={subscription ? "Business" : "—"}
          hint="$49.50 / month"
          emphasis
        />
        <StatCard
          label="Renews / ends"
          value={formatDate(subscription?.current_period_end ?? null)}
          hint={subscription?.cancel_at_period_end ? "Cancels at period end" : "Auto-renews"}
        />
        <StatCard
          label="Credits"
          value={remaining === null ? "—" : remaining.toLocaleString()}
          hint="Remaining this cycle"
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
                    ? `Your plan is set to cancel on ${formatDate(subscription.current_period_end)}.`
                    : `Your Business plan renews on ${formatDate(subscription.current_period_end)}.`}
              </p>
            ) : (
              <p className="max-w-md text-sm text-muted-foreground">
                No active subscription found. Start your free trial from onboarding to unlock the full engine.
              </p>
            )}
          </div>
          <Button onClick={manage} disabled={opening || !subscription}>
            {opening ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Opening…
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4" /> Manage subscription
                <ExternalLink className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>
      </Panel>
    </div>
  );
}