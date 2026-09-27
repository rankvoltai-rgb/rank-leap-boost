-- Apps connected through Supabase's OAuth server (Claude, ChatGPT, Cursor… via
-- /oauth/consent) get ordinary "authenticated" JWTs, plus a client_id claim.
-- Without this, any app a user approves could read and write everything that
-- user can through the REST API: mint API keys, edit blogs and keywords, read
-- billing. Those tokens are meant for the MCP server only.
--
-- A RESTRICTIVE policy is ANDed with every existing policy, so a token with a
-- client_id sees no rows and can change none, on every table in public.
-- Browser sessions carry no client_id and are unaffected; service_role
-- bypasses RLS.
--
-- The loop covers every table present when this runs, including ones created
-- outside migrations. A NEW table needs its own copy of this policy.

DO $$
DECLARE
  t record;
BEGIN
  FOR t IN
    SELECT c.relname
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS oauth_apps_blocked ON public.%I', t.relname);
    EXECUTE format(
      'CREATE POLICY oauth_apps_blocked ON public.%I AS RESTRICTIVE FOR ALL TO authenticated '
      'USING (((SELECT auth.jwt()) ->> ''client_id'') IS NULL) '
      'WITH CHECK (((SELECT auth.jwt()) ->> ''client_id'') IS NULL)',
      t.relname
    );
  END LOOP;
END
$$;
