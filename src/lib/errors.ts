/**
 * Errors shared across the data layer.
 *
 * This lives in its own module so the mock store and the data router throw and
 * catch the *same* class — two separate declarations would look identical but
 * fail `instanceof`, silently defeating the gate.
 */
import { BILLING_ISSUE_MESSAGE } from "@/lib/entitlement";

/** Raised when generation is refused by the plan gate: no trial yet, or billing broken. */
export class TrialRequiredError extends Error {
  constructor(message = "Start your free trial to generate articles.") {
    super(message);
    this.name = "TrialRequiredError";
  }
}

const REFUSALS = new Set([
  new TrialRequiredError().message,
  ...Object.values(BILLING_ISSUE_MESSAGE),
]);

/**
 * Whether an error is the plan gate saying no. The mock throws the class; real
 * mode's server-function errors arrive as plain Errors carrying the gate's
 * message, so the message is what's matched.
 */
export function isBillingRefusal(err: unknown): err is Error {
  return err instanceof TrialRequiredError || (err instanceof Error && REFUSALS.has(err.message));
}
