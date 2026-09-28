-- IndexNow pings for rankbox.xyz itself (src/lib/indexnow.server.ts).
--
-- One row per sitemap URL already sent to IndexNow, with the <lastmod> it had
-- when it went. The daily run submits only URLs that are new or whose lastmod
-- moved, so engines hear about each change once instead of every day. The
-- first run finds the table empty and submits the whole sitemap.
--
-- Server-managed: nothing is reachable with a user JWT, and only service_role
-- (which bypasses RLS) touches it.

CREATE TABLE public.indexnow_submissions (
  url text PRIMARY KEY,
  -- NULL for pages the sitemap lists without a lastmod.
  lastmod text,
  submitted_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.indexnow_submissions ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.indexnow_submissions FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.indexnow_submissions TO service_role;

-- The restrictive OAuth-app guard every public table carries
-- (20260927023216_oauth_clients_blocked.sql), so a future grant can't open
-- this to apps connected through the OAuth server.
CREATE POLICY oauth_apps_blocked ON public.indexnow_submissions AS RESTRICTIVE FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) ->> 'client_id') IS NULL)
  WITH CHECK (((SELECT auth.jwt()) ->> 'client_id') IS NULL);
