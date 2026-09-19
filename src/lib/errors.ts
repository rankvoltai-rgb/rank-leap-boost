/**
 * Errors shared across the data layer.
 *
 * This lives in its own module so the mock store and the data router throw and
 * catch the *same* class — two separate declarations would look identical but
 * fail `instanceof`, silently defeating the gate.
 */

/** Raised when generation is attempted before a trial exists. */
export class TrialRequiredError extends Error {
  constructor(message = "Start your free trial to generate articles.") {
    super(message);
    this.name = "TrialRequiredError";
  }
}
