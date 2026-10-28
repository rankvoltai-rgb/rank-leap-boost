import type { Subscription } from "@/lib/data";
import { rowEntitles } from "@/lib/entitlement";

/** `billing`: a card check or payment failed, or the plan ended — see billing-context.tsx. */
export type EngineState = "billing" | "out-of-credits" | "paused" | "running";

/**
 * Whether the account may write and connect a site right now: a trial whose
 * card passed, or a paid plan whose last payment went through. The same rule
 * the server enforces (src/lib/entitlement.ts), not a copy of it.
 */
export function isEntitled(subscription: Subscription | null | undefined): boolean {
  return rowEntitles(subscription);
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
  if (!isEntitled(subscription)) return "billing";
  if (remaining <= 0) return "out-of-credits";
  return enabled ? "running" : "paused";
}
