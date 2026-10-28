/**
 * Restarting a plan that has ended.
 *
 * The free trial happens once, as the last step of onboarding (TrialStep).
 * Anyone who reaches this dialog has had a subscription before, so the server
 * opens a checkout with no trial on it (`trialDaysFor` in createCheckoutSession)
 * and the copy says so plainly: paid from today. Embedded rather than a
 * redirect, so the dashboard they're restarting stays on screen behind it.
 */
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/dashboard/primitives";
import { VoltMark } from "@/components/dashboard/icons";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";
import { confirmTrialCheckout, IS_MOCK, recheckBilling } from "@/lib/data";
import { PLAN_PRICE_LOOKUP_KEY, afterTrialCopy } from "@/data/pricing";

export function PlanCheckoutDialog({
  open,
  onOpenChange,
  onRestarted,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRestarted?: () => void;
}) {
  const [busy, setBusy] = useState(false);

  async function finish(settle: () => Promise<unknown>) {
    setBusy(true);
    try {
      await settle();
      toast.success("Your plan is active again. Article writing is back on.");
      onOpenChange(false);
      onRestarted?.();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Your payment went through, but we couldn't restart the plan.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto border-border bg-card p-0">
        <DialogTitle className="sr-only">Restart your plan</DialogTitle>
        <DialogDescription className="sr-only">
          Restart your Rankbox plan at {afterTrialCopy()}, starting today.
        </DialogDescription>

        <div className="bg-brand-blue px-7 pb-6 pt-7 text-white">
          <VoltMark className="h-6 w-6" />
          <h2 className="font-display mt-3 text-2xl font-semibold tracking-tight">
            Restart your plan
          </h2>
          <p className="mt-2 text-sm text-white/80">
            Your articles, keywords and settings are right where you left them.
          </p>
        </div>

        <div className="px-7 pb-7 pt-5">
          <p className="text-sm text-ink">
            <span className="font-semibold">{afterTrialCopy()}</span>, starting today. Cancel any
            time from Plan &amp; Billing.
          </p>
          <div className="mt-4">
            {IS_MOCK ? (
              <Button
                className="w-full"
                disabled={busy}
                onClick={() => void finish(recheckBilling)}
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                Restart plan
              </Button>
            ) : (
              <StripeEmbeddedCheckout
                priceId={PLAN_PRICE_LOOKUP_KEY}
                onComplete={(sessionId) => void finish(() => confirmTrialCheckout(sessionId))}
              />
            )}
          </div>
          {busy && !IS_MOCK && (
            <p className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Restarting your plan…
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
