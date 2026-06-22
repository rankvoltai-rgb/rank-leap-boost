-- Default new credit accounts to 30 articles/month
ALTER TABLE public.credit_accounts ALTER COLUMN credits_total SET DEFAULT 30;

-- Track which billing cycle the current credits belong to (for idempotent refills)
ALTER TABLE public.credit_accounts ADD COLUMN IF NOT EXISTS period_end timestamptz;

-- Atomically consume one article credit. Returns true only if a credit was available.
CREATE OR REPLACE FUNCTION public.consume_article_credit(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _updated integer;
BEGIN
  UPDATE public.credit_accounts
    SET credits_used = credits_used + 1
    WHERE user_id = _user_id
      AND credits_used < credits_total;
  GET DIAGNOSTICS _updated = ROW_COUNT;
  RETURN _updated > 0;
END;
$$;

-- Refund one article credit (used when autopilot generation fails after reserving).
CREATE OR REPLACE FUNCTION public.refund_article_credit(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.credit_accounts
    SET credits_used = GREATEST(credits_used - 1, 0)
    WHERE user_id = _user_id;
END;
$$;

-- Refill credits to 30 for a new billing cycle. No-ops if the period is unchanged.
CREATE OR REPLACE FUNCTION public.reset_article_credits(_user_id uuid, _period_end timestamptz)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.credit_accounts (user_id, credits_used, credits_total, period_end)
    VALUES (_user_id, 0, 30, _period_end)
  ON CONFLICT (user_id) DO UPDATE
    SET credits_used = 0,
        credits_total = 30,
        period_end = EXCLUDED.period_end
    WHERE public.credit_accounts.period_end IS DISTINCT FROM EXCLUDED.period_end;
END;
$$;

GRANT EXECUTE ON FUNCTION public.consume_article_credit(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.refund_article_credit(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.reset_article_credits(uuid, timestamptz) TO service_role;