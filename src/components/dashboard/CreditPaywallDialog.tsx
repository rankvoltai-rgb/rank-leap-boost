import { useNavigate } from "@tanstack/react-router";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/dashboard/primitives";
import { ProgressRing } from "@/components/dashboard/rewards";
import { VoltMark, RocketIcon } from "@/components/dashboard/icons";
import type { CreditAccount, Subscription } from "@/lib/api";

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "your next billing date";
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function CreditPaywallDialog({
  open,
  onOpenChange,
  credits,
  subscription,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  credits: CreditAccount | null | undefined;
  subscription: Subscription | null | undefined;
}) {
  const navigate = useNavigate();
  const total = credits?.credits_total ?? 30;
  const used = credits?.credits_used ?? total;
  const isTrial = subscription?.status === "trialing";

  const subcopy = isTrial
    ? "You're on the free trial. Confirm your plan to keep publishing without interruption."
    : `Your monthly limit resets on ${formatDate(subscription?.current_period_end)}. Upgrade to keep writing today.`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden border-border bg-card p-0">
        <div className="flex flex-col items-center gap-5 px-7 pb-7 pt-8 text-center">
          <ProgressRing value={used} max={total} size={88} stroke={8}>
            <div className="flex flex-col items-center leading-none">
              <VoltMark className="h-5 w-5" />
              <span className="mt-1 text-lg font-semibold tabular-nums text-ink">
                {used}/{total}
              </span>
            </div>
          </ProgressRing>

          <div className="space-y-1.5">
            <h2 className="text-lg font-semibold tracking-tight text-ink">
              You've used all {total} articles this month
            </h2>
            <p className="mx-auto max-w-xs text-sm text-muted-foreground">{subcopy}</p>
          </div>

          <div className="flex w-full flex-col gap-2 pt-1">
            <Button
              className="w-full"
              onClick={() => {
                onOpenChange(false);
                navigate({ to: "/dashboard/billing" });
              }}
            >
              <RocketIcon className="h-4 w-4" />
              {isTrial ? "Confirm your plan" : "Manage plan & upgrade"}
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => onOpenChange(false)}>
              Maybe later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}