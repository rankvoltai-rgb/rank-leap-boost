/**
 * Why Studio can't take a site right now, and the one thing that fixes it.
 *
 * The trial is the case worth care: someone evaluating Rankbox for an agency
 * wants to see it run their clients' sites, and making them wait out the
 * trial to do so loses them. So a trial can be converted on the spot — with
 * the charge stated in the button, and nothing changed unless it goes
 * through. Every other block points at billing, where it's fixed.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StudioIcon } from "@/components/dashboard/icons";
import { Button, Panel } from "@/components/dashboard/primitives";
import { formatUsd, PLAN } from "@/data/pricing";
import { activatePlanNow } from "@/lib/data";
import type { StudioBlock } from "@/lib/studio";
import { cn } from "@/lib/utils";

const TITLES: Record<StudioBlock | "not_configured", string> = {
  trialing: "Studio opens with your first paid invoice",
  no_plan: "Studio adds sites to a paid plan",
  past_due: "Your last payment didn't go through",
  canceling: "Your plan is set to end",
  lapsed: "Your plan isn't active",
  not_configured: "Studio isn't switched on yet",
};

export function StudioGate({
  block,
  message,
  compact,
}: {
  block: StudioBlock | "not_configured";
  message: string | null;
  /** Inside a dialog: no panel chrome. */
  compact?: boolean;
}) {
  const body = (
    <div className={cn("flex flex-col gap-4", !compact && "sm:flex-row sm:items-center")}>
      {!compact && (
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-card border border-border bg-secondary text-muted-foreground">
          <StudioIcon className="h-5 w-5" />
        </span>
      )}
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-sm font-semibold text-ink">{TITLES[block]}</p>
        <p className="max-w-xl text-sm text-muted-foreground">
          {block === "trialing"
            ? `Your free trial covers one site. Start your paid plan today to add more — each extra site is its own line on the same invoice.`
            : message}
        </p>
      </div>
      {block === "trialing" ? (
        <ActivateNow />
      ) : block === "not_configured" ? null : (
        <Link
          to="/dashboard/billing"
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium text-ink transition-colors hover:bg-secondary"
        >
          Plan &amp; Billing <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
  return compact ? body : <Panel className="p-5">{body}</Panel>;
}

/**
 * Ends the trial now, after saying exactly what that charges. Billing reuses
 * it, so there is one confirm-and-charge flow, not two that can drift.
 */
export function ActivateNow({
  label = "Start paid plan now",
  successMessage = "Your plan is active. Studio is open.",
  className,
}: {
  label?: string;
  successMessage?: string;
  className?: string;
} = {}) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function confirm() {
    setBusy(true);
    try {
      const { status } = await activatePlanNow();
      if (status !== "active")
        throw new Error("The payment is still being confirmed. Check back in a minute.");
      await queryClient.invalidateQueries();
      toast.success(successMessage);
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't start your paid plan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button variant="brand" onClick={() => setOpen(true)} className={cn("shrink-0", className)}>
        {label}
      </Button>
      <AlertDialog open={open} onOpenChange={(next) => !busy && setOpen(next)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start your paid plan today?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  Your trial ends now and your card is charged{" "}
                  <span className="font-medium text-ink">{formatUsd(PLAN.monthly)}</span> for your
                  first month. From then on your plan renews monthly from today.
                </p>
                <p>
                  You get the full {PLAN.name} allowance straight away — {PLAN.articlesPerMonth}{" "}
                  articles, backlinks and Reddit presence — and Studio opens so you can add sites.
                  If the charge doesn't go through, nothing changes.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Not now</AlertDialogCancel>
            <Button variant="brand" onClick={() => void confirm()} disabled={busy}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {busy ? "Charging…" : `Start plan · ${formatUsd(PLAN.monthly)}`}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
