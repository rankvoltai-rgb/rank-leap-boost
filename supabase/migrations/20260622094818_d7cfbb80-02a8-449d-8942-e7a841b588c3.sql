-- Postgres grants EXECUTE to PUBLIC by default; revoke and re-grant precisely.
REVOKE ALL ON FUNCTION public.consume_article_credit(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.refund_article_credit(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.reset_article_credits(uuid, timestamptz) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.consume_article_credit(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.refund_article_credit(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.reset_article_credits(uuid, timestamptz) TO service_role;