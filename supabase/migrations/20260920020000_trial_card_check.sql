-- Result of the refundable authorization placed when a trial starts.
--
-- Starting a trial only runs a $0 card setup, which an empty prepaid card
-- passes; the decline lands a week later, after the articles have been
-- generated. The webhook now places a $1 hold and releases it immediately, and
-- records the outcome here. `card_verified = false` withholds generation while
-- the subscription is still trialing (see src/lib/entitlement.server.ts).
--
-- Null is not a failure: it means the check has not run yet, or there was no
-- card on file to check.

ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS card_verified boolean,
  ADD COLUMN IF NOT EXISTS card_checked_at timestamptz,
  ADD COLUMN IF NOT EXISTS card_check_error text;

COMMENT ON COLUMN public.subscriptions.card_verified IS
  'Result of the refundable authorization placed when a trial starts: true = funds held and released, false = the card could not cover it, null = not checked yet.';
