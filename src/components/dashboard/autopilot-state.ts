import type { Subscription } from "@/lib/data";

export type EngineState = "needs-trial" | "out-of-credits" | "paused" | "running";

/**
 * Whether the account has a trial or paid plan — required to write and to
 * connect a site. Mirrors the server's rule in entitlement.server.ts.
 */
export function isEntitled(subscription: Subscription | null | undefined): boolean {
  if (!subscription) return false;
  if (["trialing", "active", "past_due"].includes(subscription.status)) return true;
  // A cancelled plan keeps working until the paid period ends.
  return (
    subscription.status === "canceled" &&
    !!subscription.current_period_end &&
    new Date(subscription.current_period_end).getTime() > Date.now()
  );
}

/** Whether autopilot will write, and if not, the first thing stopping it. */
export function engineState({
  subscription,
  remaining,
  enabled,
}: {
  subscription: Subscription | null | undefined;
  remaining: number;
  enabled: boolean;
}): EngineState {
  if (!isEntitled(subscription)) return "needs-trial";
  if (remaining <= 0) return "out-of-credits";
  return enabled ? "running" : "paused";
}
