-- Rankbox lab experiments (src/lib/lab/experiments.ts, docs/lab-experiments.md).
--
-- lab_hits: one row per request to a /lab page, per bot request to a blog
-- post, and per beacon a lab page sends when its JavaScript runs.
-- lab_indexnow_trial: the IndexNow latency trial. New blog posts are split
-- into an arm announced through IndexNow and an arm left to the sitemap.
--
-- Server-managed: nothing is reachable with a user JWT, and only service_role
-- (which bypasses RLS) touches them.

CREATE TABLE public.lab_hits (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  at timestamptz NOT NULL DEFAULT now(),
  -- c1 referrer test, b3 render test, b5 fact pages, b6 blog crawl timing
  experiment text NOT NULL,
  -- 'request' for a page fetch, 'beacon' when a page's JavaScript ran
  kind text NOT NULL CHECK (kind IN ('request', 'beacon')),
  path text NOT NULL,
  query text,
  status integer,
  -- The documented bot the user agent claims to be. A claim, not proof:
  -- check ip against the vendor's list before trusting it.
  bot text,
  user_agent text,
  referer text,
  accept text,
  ip text,
  country text,
  detail jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX lab_hits_experiment_at ON public.lab_hits (experiment, at DESC);
CREATE INDEX lab_hits_path_bot_at ON public.lab_hits (path, bot, at);

CREATE TABLE public.lab_indexnow_trial (
  url text PRIMARY KEY,
  arm text NOT NULL CHECK (arm IN ('indexnow', 'sitemap')),
  -- The first IndexNow run that found the post in the sitemap.
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  -- When the post was sent to IndexNow (the indexnow arm at once, the
  -- sitemap arm after its hold ends).
  pinged_at timestamptz
);

ALTER TABLE public.lab_hits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_indexnow_trial ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.lab_hits FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.lab_indexnow_trial FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.lab_hits TO service_role;
GRANT ALL ON public.lab_indexnow_trial TO service_role;

-- The restrictive OAuth-app guard every public table carries
-- (20260927023216_oauth_clients_blocked.sql).
CREATE POLICY oauth_apps_blocked ON public.lab_hits AS RESTRICTIVE FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) ->> 'client_id') IS NULL)
  WITH CHECK (((SELECT auth.jwt()) ->> 'client_id') IS NULL);
CREATE POLICY oauth_apps_blocked ON public.lab_indexnow_trial AS RESTRICTIVE FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) ->> 'client_id') IS NULL)
  WITH CHECK (((SELECT auth.jwt()) ->> 'client_id') IS NULL);
