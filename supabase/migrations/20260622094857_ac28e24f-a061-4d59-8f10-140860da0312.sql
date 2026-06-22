CREATE OR REPLACE FUNCTION public.consume_article_credit(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _updated integer;
  _target uuid;
BEGIN
  -- Signed-in callers can only ever spend their own credits; service role
  -- (no auth context) spends on behalf of the passed user.
  _target := COALESCE(auth.uid(), _user_id);
  UPDATE public.credit_accounts
    SET credits_used = credits_used + 1
    WHERE user_id = _target
      AND credits_used < credits_total;
  GET DIAGNOSTICS _updated = ROW_COUNT;
  RETURN _updated > 0;
END;
$$;