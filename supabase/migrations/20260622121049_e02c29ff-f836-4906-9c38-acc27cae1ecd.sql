-- 1. credit_accounts: SELECT-only for owners; writes happen server-side (service_role)
DROP POLICY IF EXISTS "Users manage own credits" ON public.credit_accounts;
CREATE POLICY "Users can view own credits"
  ON public.credit_accounts FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
REVOKE INSERT, UPDATE, DELETE ON public.credit_accounts FROM authenticated;

-- 2. credit_transactions: SELECT-only for owners; writes happen server-side (service_role)
DROP POLICY IF EXISTS "Users manage own transactions" ON public.credit_transactions;
CREATE POLICY "Users can view own transactions"
  ON public.credit_transactions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
REVOKE INSERT, UPDATE, DELETE ON public.credit_transactions FROM authenticated;

-- 3. Restrict SECURITY DEFINER functions to service_role only
REVOKE EXECUTE ON FUNCTION public.consume_article_credit(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.refund_article_credit(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.reset_article_credits(uuid, timestamptz) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_article_credit(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.refund_article_credit(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.reset_article_credits(uuid, timestamptz) TO service_role;