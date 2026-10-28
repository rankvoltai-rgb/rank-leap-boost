/**
 * The notice at the top of every dashboard page while billing stops the
 * account from writing: what's paused, that nothing is lost, and the one
 * button that fixes it. Shown from the first failed payment — writing stops
 * then too, so the two never disagree.
 */
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/dashboard/primitives";
import { BILLING_FIX_LABEL, useBilling } from "@/components/dashboard/billing-context";
import type { BillingIssue } from "@/lib/entitlement";

const COPY: Record<BillingIssue, { title: string; body: string }> = {
  card_check_failed: {
    title: "We couldn't verify your card.",
    body: "Article writing is paused until you update it. Everything you've set up is saved.",
  },
  payment_failed: {
    title: "Your last payment didn't go through.",
    body: "Article writing and autopilot are paused until you update billing. Your articles and settings are safe.",
  },
  plan_ended: {
    title: "Your plan has ended.",
    body: "Your articles and settings are saved. Restart your plan to keep writing.",
  },
};

export function BillingBanner() {
  const { issue, fix, busy } = useBilling();
  if (!issue) return null;
  const { title, body } = COPY[issue];

  return (
    <div
      role="alert"
      className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-card border border-destructive/25 bg-destructive/5 px-4 py-3"
    >
      <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" aria-hidden />
      <p className="min-w-0 flex-1 text-sm text-ink">
        <span className="font-medium">{title}</span>{" "}
        <span className="text-muted-foreground">{body}</span>
      </p>
      <Button onClick={fix} disabled={busy} className="shrink-0">
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {BILLING_FIX_LABEL[issue]}
      </Button>
    </div>
  );
}
