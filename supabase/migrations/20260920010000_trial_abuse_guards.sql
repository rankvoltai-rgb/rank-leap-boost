-- Trial-abuse guards.
--
-- 1. Credit refills take an explicit amount, so a trialing subscriber can be
--    given a small allowance and only a paying one gets the full 30. Before
--    this, the webhook granted 30 the moment a trial started, which is what a
--    throwaway card was actually buying.
-- 2. `past_due_since` records when a subscription first failed to pay, so a
--    short grace period can be measured from that moment. It cannot be derived
--    from `current_period_end` (which jumps a month ahead when the trial ends)
--    or from `updated_at` (which every retry refreshes).

ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS past_due_since timestamptz;

COMMENT ON COLUMN public.subscriptions.past_due_since IS
  'When the subscription first entered past_due. Null while paying. Set once per failure spell, not on every retry.';

-- Refill credits to an explicit amount for a new billing cycle.
-- No-ops if the period is unchanged, so it is safe to call on every event.
CREATE OR REPLACE FUNCTION public.reset_article_credits(
  _user_id uuid,
  _period_end timestamptz,
  _credits integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.credit_accounts (user_id, credits_used, credits_total, period_end)
    VALUES (_user_id, 0, _credits, _period_end)
  ON CONFLICT (user_id) DO UPDATE
    SET credits_used = 0,
        credits_total = _credits,
        period_end = EXCLUDED.period_end
    WHERE public.credit_accounts.period_end IS DISTINCT FROM EXCLUDED.period_end;
END;
$$;

-- The two-argument form stays as a full-allowance wrapper: the deployed app
-- still calls it until the next release, and dropping it would break live
-- webhooks in the meantime.
CREATE OR REPLACE FUNCTION public.reset_article_credits(
  _user_id uuid,
  _period_end timestamptz
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.reset_article_credits(_user_id, _period_end, 30);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.reset_article_credits(uuid, timestamptz, integer)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reset_article_credits(uuid, timestamptz, integer)
  TO service_role;
