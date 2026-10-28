/**
 * The account's billing state for the whole dashboard, and the one way to fix it.
 *
 * Every refusal in the dashboard — Generate, the editor's AI actions,
 * autopilot, the paid gates — comes down to one of three issues
 * (`billingIssueOf` in src/lib/entitlement.ts, the rule the server enforces).
 * This provider owns the fix for each:
 *
 *  - card check failed / payment failed: Stripe's portal, opened straight on
 *    "update card", which sends the browser back here with `?billing=updated`.
 *    The return re-runs the $1 card check or pays what's owed (recheckBilling),
 *    3-D Secure included, and the block lifts. The portal alone does neither,
 *    which is why updating a card used to leave people blocked.
 *  - plan ended: the restart checkout (PlanCheckoutDialog), paid from today —
 *    the free trial is once per account.
 *
 * The banner and every in-page CTA call the same `fix`, so they can never
 * point people at different places.
 */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/dashboard/primitives";
import { getSubscription, IS_MOCK, openBillingPortal, recheckBilling } from "@/lib/data";
import type { Subscription } from "@/lib/data";
import { billingIssueOf, type BillingIssue } from "@/lib/entitlement";
import { PlanCheckoutDialog } from "@/components/dashboard/PlanCheckoutDialog";

/** The button that fixes each issue. */
export const BILLING_FIX_LABEL: Record<BillingIssue, string> = {
  card_check_failed: "Update card",
  payment_failed: "Update billing",
  plan_ended: "Restart plan",
};

interface BillingState {
  subscription: Subscription | null | undefined;
  /** What's stopping the account from writing, if billing is the reason. */
  issue: BillingIssue | null;
  /** Start the fix for the current issue. */
  fix: () => void;
  /** Open the restart checkout, whatever the issue — for a plan that's ending or ended. */
  restart: () => void;
  /** True while a fix is opening or being checked. */
  busy: boolean;
}

const BillingContext = createContext<BillingState | null>(null);

/** Query keys that move when billing changes: the gate, the credits it refills, the articles it unblocks. */
const BILLING_KEYS = [["subscription"], ["credits"], ["settings"], ["blogs"]] as const;

export function BillingProvider({
  returned,
  children,
}: {
  /** The browser just came back from the portal's card update (`?billing=updated`). */
  returned: boolean;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [restartOpen, setRestartOpen] = useState(false);
  const { data: subscription } = useQuery({ queryKey: ["subscription"], queryFn: getSubscription });
  const issue = billingIssueOf(subscription);
  // `fix` reads these at click time, not render time: a toast raised by a
  // refusal holds onto the `fix` from before the subscription refetched.
  const latest = useRef({ issue, subscription });
  latest.current = { issue, subscription };

  const refresh = useCallback(
    () =>
      Promise.all(BILLING_KEYS.map((key) => queryClient.invalidateQueries({ queryKey: [...key] }))),
    [queryClient],
  );

  const recheck = useCallback(async () => {
    setBusy(true);
    const pending = toast.loading("Checking your card…");
    try {
      await recheckBilling();
      await refresh();
      toast.success("Billing is sorted. Article writing is back on.", { id: pending });
    } catch (err) {
      await refresh();
      toast.error(err instanceof Error ? err.message : "That card didn't go through.", {
        id: pending,
      });
    } finally {
      setBusy(false);
    }
  }, [refresh]);

  // Back from the portal: run the check once, then drop the flag so a refresh
  // doesn't place another hold.
  const handled = useRef(false);
  useEffect(() => {
    if (!returned || handled.current) return;
    handled.current = true;
    navigate({
      to: ".",
      search: (prev: Record<string, unknown>) => ({ ...prev, billing: undefined }),
      replace: true,
    });
    void recheck();
  }, [returned, navigate, recheck]);

  const fix = useCallback(() => {
    const { issue, subscription } = latest.current;
    if (!issue) {
      // No plan at all can't reach the dashboard; the route sends it to the
      // onboarding paywall. Covers a session that raced its own checkout.
      if (subscription === null) navigate({ to: "/onboarding" });
      return;
    }
    if (issue === "plan_ended") {
      setRestartOpen(true);
      return;
    }
    if (IS_MOCK) {
      void recheck();
      return;
    }
    setBusy(true);
    const back = new URL(window.location.href);
    back.searchParams.set("billing", "updated");
    void openBillingPortal(back.toString(), "payment_method_update")
      .then((url) => {
        if (url) window.location.assign(url);
      })
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : "Couldn't open billing.");
        setBusy(false);
      });
  }, [navigate, recheck]);

  return (
    <BillingContext.Provider
      value={{ subscription, issue, fix, busy, restart: () => setRestartOpen(true) }}
    >
      {children}
      <PlanCheckoutDialog
        open={restartOpen}
        onOpenChange={setRestartOpen}
        onRestarted={() => void refresh()}
      />
    </BillingContext.Provider>
  );
}

export function useBilling(): BillingState {
  const value = useContext(BillingContext);
  if (!value) throw new Error("useBilling must be used inside BillingProvider");
  return value;
}

/** The fix for whatever billing issue the account has, as a button: "Update card", "Restart plan"… */
export function BillingFixButton({
  className,
  onFix,
}: {
  className?: string;
  /** Replaces the plain fix — e.g. to close an overlay first, then call `fix` itself. */
  onFix?: () => void;
}) {
  const { issue, fix, busy } = useBilling();
  return (
    <Button variant="brand" className={className} disabled={busy} onClick={onFix ?? fix}>
      {busy && <Loader2 className="h-4 w-4 animate-spin" />}
      {issue ? BILLING_FIX_LABEL[issue] : "Fix billing"}
    </Button>
  );
}
