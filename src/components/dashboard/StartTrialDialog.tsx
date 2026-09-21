/**
 * The trial prompt raised by Generate.
 *
 * The spec puts the trial here rather than in onboarding: the user finishes
 * setup, sees their plan, and is asked to pay only at the moment they ask for
 * something to be written. So this dialog leads with what is already queued
 * for them, not with the price.
 *
 * In mock mode "Start free trial" flips the local entitlement. In real mode the
 * same button reveals Stripe's embedded checkout inside this dialog, on a price
 * and trial length both pinned server-side — the pitch stays on screen above
 * the card form, which is the whole reason the checkout is embedded rather than
 * a redirect.
 */
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/dashboard/primitives";
import { CheckIcon, RocketIcon, VoltMark } from "@/components/dashboard/icons";
import { CountUp } from "@/components/ui/count-up";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";
import { confirmTrialCheckout, IS_MOCK, startTrial } from "@/lib/data";
import { PLAN_PRICE_LOOKUP_KEY, TRIAL_DAYS, afterTrialCopy } from "@/data/pricing";

const POINTS = [
  "Every queued article written and published for you",
  "Cancel any time before day 7 — no charge",
  "Keep everything published during the trial",
];

export function StartTrialDialog({
  open,
  onOpenChange,
  queuedCount,
  projectedTraffic,
  onStarted,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  queuedCount: number;
  projectedTraffic: number;
  onStarted?: () => void;
}) {
  const [busy, setBusy] = useState(false);
  // Real mode shows the pitch first and the card form only once asked for: the
  // spec's point is that the price arrives after the value, not with it.
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const queryClient = useQueryClient();

  /** Everything that has to be true before the caller may generate. */
  async function finish() {
    // The entitlement drives the trial banner and the paywall copy, so the
    // subscription-derived queries have to refetch or the CTA lingers.
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["subscription"] }),
      queryClient.invalidateQueries({ queryKey: ["credits"] }),
      queryClient.invalidateQueries({ queryKey: ["blogs"] }),
    ]);
    toast.success(`Your ${TRIAL_DAYS}-day trial is live.`);
    setCheckoutOpen(false);
    onOpenChange(false);
    onStarted?.();
  }

  async function begin() {
    if (!IS_MOCK) {
      setCheckoutOpen(true);
      return;
    }
    setBusy(true);
    try {
      await startTrial();
      await finish();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't start the trial.");
    } finally {
      setBusy(false);
    }
  }

  /**
   * Stripe has taken the card. The subscription is written by the webhook, but
   * the very next thing this dialog does is generate an article behind a
   * server-side entitlement check — so settle the row before handing over,
   * rather than racing the webhook back.
   */
  async function completed(sessionId: string) {
    setBusy(true);
    try {
      await confirmTrialCheckout(sessionId);
      await finish();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Your payment went through, but we couldn't start the trial.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        // Reopening should always start on the pitch, never mid-card-form.
        if (!next) setCheckoutOpen(false);
        onOpenChange(next);
      }}
    >
      <DialogContent
        className={`max-h-[90vh] overflow-y-auto border-border bg-card p-0 ${
          checkoutOpen ? "max-w-lg" : "max-w-md"
        }`}
      >
        <DialogTitle className="sr-only">Start your free trial</DialogTitle>
        <DialogDescription className="sr-only">
          Begin a {TRIAL_DAYS}-day free trial to publish the {queuedCount} articles already in your
          queue. No charge today.
        </DialogDescription>

        <div className="relative bg-brand-blue px-7 pb-6 pt-7 text-white">
          <VoltMark className="h-6 w-6" />
          <p className="mt-3 text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-white/70">
            {queuedCount} articles ready to publish
          </p>
          <h2 className="font-display mt-1.5 text-2xl font-semibold tracking-tight">
            Start your {TRIAL_DAYS}-day free trial
          </h2>
          {projectedTraffic > 0 && (
            <p className="mt-2 text-sm text-white/80">
              Your plan projects{" "}
              <span className="font-semibold text-white">
                <CountUp value={projectedTraffic} duration={800} />
              </span>{" "}
              monthly visits once it's live.
            </p>
          )}
        </div>

        <div className="px-7 pb-7 pt-5">
          {checkoutOpen ? (
            <>
              <p className="text-sm text-ink">
                Add a card to begin. You aren't charged today — your plan starts at{" "}
                <span className="font-semibold">{afterTrialCopy()}</span> on day {TRIAL_DAYS + 1},
                and you can cancel before then in one click.
              </p>
              <div className="mt-4">
                <StripeEmbeddedCheckout
                  priceId={PLAN_PRICE_LOOKUP_KEY}
                  onComplete={(sessionId) => void completed(sessionId)}
                />
              </div>
              {busy && (
                <p className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Starting your trial…
                </p>
              )}
              <Button
                variant="ghost"
                className="mt-2 w-full"
                disabled={busy}
                onClick={() => setCheckoutOpen(false)}
              >
                Back
              </Button>
            </>
          ) : (
            <>
              <ul className="space-y-2.5">
                {POINTS.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm text-ink">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    {p}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-col gap-2">
                <Button className="w-full" onClick={begin} disabled={busy}>
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RocketIcon className="h-4 w-4" />
                  )}
                  {busy ? "Starting…" : "Start free trial"}
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => onOpenChange(false)}>
                  Not yet
                </Button>
              </div>

              <p className="mt-3 text-center text-xs text-muted-foreground">
                No charge today. Nothing publishes until you start.
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
