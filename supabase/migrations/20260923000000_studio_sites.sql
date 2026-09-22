-- ============================================================================
-- Studio: more than one site per account.
--
-- Until now an account WAS a site: `profiles` held the one brand and website,
-- and everything else hung off `user_id`. Studio lets agency owners and serial
-- founders run several sites from one login, each billed as its own monthly
-- line on the same Stripe subscription.
--
-- The model:
--   * A `profiles` row is a SITE, and its id is the site id everywhere. The
--     table keeps its name: every existing row is already exactly one site,
--     and renaming it would buy nothing but churn.
--   * `kind` — the one `primary` site comes from onboarding and is covered by
--     the base plan. Every `studio` site is an extra, separately billed line.
--   * `status` — `pending` while a studio site's first payment is in flight,
--     `active`, and `archived` once it is no longer billed. Archiving keeps
--     every row; restoring is paying for the site again.
--   * `removes_at` — a studio site whose removal is scheduled stays fully
--     usable until the end of the period already paid for.
--   * Every per-site table gains `site_id`, with a composite foreign key to
--     profiles (id, user_id): a row can only ever point at a site its own
--     owner owns. That is enforced here, whatever a client sends.
--   * `user_id` stays everywhere as the OWNER. RLS keys on it unchanged, and
--     the rules that are about a person rather than a site stay on it: the
--     backlink exchange never trades between two sites of one owner (that is
--     a private link network), and Reddit allows one standing reply per
--     thread per person, however many brands they run.
-- ============================================================================

-- ------------------------------------------------------------------ SITES ----
ALTER TABLE public.profiles
  ADD COLUMN kind        text NOT NULL DEFAULT 'primary',
  ADD COLUMN status      text NOT NULL DEFAULT 'active',
  ADD COLUMN billed_from timestamptz,
  ADD COLUMN removes_at  timestamptz,
  ADD COLUMN archived_at timestamptz;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_kind_check CHECK (kind IN ('primary', 'studio')),
  ADD CONSTRAINT profiles_status_check CHECK (status IN ('pending', 'active', 'archived')),
  -- The primary site is the base plan itself: never pending, removed or archived.
  ADD CONSTRAINT profiles_primary_is_permanent
    CHECK (kind = 'studio' OR (status = 'active' AND removes_at IS NULL AND archived_at IS NULL));

COMMENT ON TABLE public.profiles IS
  'One row per SITE. kind=primary is the onboarding site covered by the base plan; kind=studio sites are billed per site.';
COMMENT ON COLUMN public.profiles.removes_at IS
  'Studio only: when a scheduled removal takes effect (the end of the period already paid for).';
COMMENT ON COLUMN public.profiles.billed_from IS
  'Studio only: when this site''s current billing began (added or restored). Its first period''s allowances are prorated from here.';

ALTER TABLE public.profiles DROP CONSTRAINT profiles_user_id_key;
CREATE UNIQUE INDEX profiles_one_primary_per_user
  ON public.profiles (user_id) WHERE kind = 'primary';
-- The target of every per-site composite foreign key below.
ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_user_id_key UNIQUE (id, user_id);
CREATE INDEX idx_profiles_user ON public.profiles (user_id, created_at);

-- A deleted account takes its sites with it, and every site takes its rows.
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Sites are created and changed by billing, not by the browser. A member may
-- still create their FIRST site (onboarding does, as the primary) and edit a
-- site's brand fields. The partial unique index above means a direct insert
-- can never become a second site, and nothing a member sends can touch kind,
-- status or the removal dates. Deleting a site would take every article with
-- it, so that is not a member action at all.
REVOKE INSERT, UPDATE, DELETE ON public.profiles FROM PUBLIC, anon, authenticated;
GRANT INSERT (user_id, brand_name, website_url, product_description, avatar_url)
  ON public.profiles TO authenticated;
GRANT UPDATE (brand_name, website_url, product_description, avatar_url)
  ON public.profiles TO authenticated;

-- ------------------------------------------------------------- CORE DATA ----
-- Backfill is exact: until this migration every owner had exactly one profile.
-- Setting NOT NULL is the guard — it fails loudly on a row whose owner has no
-- site, rather than dropping it.

ALTER TABLE public.content_settings ADD COLUMN site_id uuid;
UPDATE public.content_settings t SET site_id = p.id FROM public.profiles p WHERE p.user_id = t.user_id;
ALTER TABLE public.content_settings
  ALTER COLUMN site_id SET NOT NULL,
  DROP CONSTRAINT content_settings_user_id_key,
  ADD CONSTRAINT content_settings_site_id_key UNIQUE (site_id),
  ADD CONSTRAINT content_settings_site_fkey
    FOREIGN KEY (site_id, user_id) REFERENCES public.profiles (id, user_id) ON DELETE CASCADE;

ALTER TABLE public.credit_accounts ADD COLUMN site_id uuid;
UPDATE public.credit_accounts t SET site_id = p.id FROM public.profiles p WHERE p.user_id = t.user_id;
ALTER TABLE public.credit_accounts
  ALTER COLUMN site_id SET NOT NULL,
  DROP CONSTRAINT credit_accounts_user_id_key,
  ADD CONSTRAINT credit_accounts_site_id_key UNIQUE (site_id),
  ADD CONSTRAINT credit_accounts_site_fkey
    FOREIGN KEY (site_id, user_id) REFERENCES public.profiles (id, user_id) ON DELETE CASCADE;
CREATE INDEX idx_credit_accounts_user ON public.credit_accounts (user_id);

ALTER TABLE public.keywords ADD COLUMN site_id uuid;
UPDATE public.keywords t SET site_id = p.id FROM public.profiles p WHERE p.user_id = t.user_id;
ALTER TABLE public.keywords
  ALTER COLUMN site_id SET NOT NULL,
  ADD CONSTRAINT keywords_site_fkey
    FOREIGN KEY (site_id, user_id) REFERENCES public.profiles (id, user_id) ON DELETE CASCADE;
DROP INDEX public.idx_keywords_user_source;
CREATE INDEX idx_keywords_site_source ON public.keywords (site_id, source);

ALTER TABLE public.blogs ADD COLUMN site_id uuid;
UPDATE public.blogs t SET site_id = p.id FROM public.profiles p WHERE p.user_id = t.user_id;
ALTER TABLE public.blogs
  ALTER COLUMN site_id SET NOT NULL,
  ADD CONSTRAINT blogs_site_fkey
    FOREIGN KEY (site_id, user_id) REFERENCES public.profiles (id, user_id) ON DELETE CASCADE;
DROP INDEX public.idx_blogs_user_status;
CREATE INDEX idx_blogs_site_status ON public.blogs (site_id, status);
DROP INDEX public.idx_blogs_unpublished_finished;
CREATE INDEX idx_blogs_unpublished_finished
  ON public.blogs (site_id, updated_at)
  WHERE status = 'finished' AND published_url IS NULL;

-- A publishing key belongs to one site: it is what a CMS plugin pulls that
-- site's articles with.
ALTER TABLE public.api_keys ADD COLUMN site_id uuid;
UPDATE public.api_keys t SET site_id = p.id FROM public.profiles p WHERE p.user_id = t.user_id;
ALTER TABLE public.api_keys
  ALTER COLUMN site_id SET NOT NULL,
  ADD CONSTRAINT api_keys_site_fkey
    FOREIGN KEY (site_id, user_id) REFERENCES public.profiles (id, user_id) ON DELETE CASCADE;
CREATE INDEX idx_api_keys_site ON public.api_keys (site_id);

-- --------------------------------------------------------------- BILLING ----
ALTER TABLE public.subscriptions
  ADD COLUMN studio_sites integer NOT NULL DEFAULT 0 CHECK (studio_sites >= 0);
COMMENT ON COLUMN public.subscriptions.studio_sites IS
  'Quantity of the studio_site_monthly line on this subscription, as Stripe last reported it.';

-- One Studio billing change at a time per owner. Adding and removing a site
-- both read the Stripe quantity and write it back; two of them interleaved
-- would lose one site's billing. A lease rather than a session lock, because
-- server functions reach Postgres through a pooler, and a lease that outlives
-- a crashed request simply expires.
CREATE TABLE public.studio_locks (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  until   timestamptz NOT NULL
);
ALTER TABLE public.studio_locks ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.studio_locks FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.studio_locks TO service_role;

-- True when the caller now holds the lease; false while someone else does.
CREATE FUNCTION public.studio_acquire_lock(_user_id uuid, _seconds integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _got uuid;
BEGIN
  INSERT INTO public.studio_locks (user_id, until)
    VALUES (_user_id, now() + make_interval(secs => _seconds))
  ON CONFLICT (user_id) DO UPDATE
    SET until = EXCLUDED.until
    WHERE public.studio_locks.until < now()
  RETURNING user_id INTO _got;
  RETURN _got IS NOT NULL;
END;
$$;

CREATE FUNCTION public.studio_release_lock(_user_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.studio_locks WHERE user_id = _user_id;
$$;

REVOKE ALL ON FUNCTION public.studio_acquire_lock(uuid, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.studio_release_lock(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.studio_acquire_lock(uuid, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.studio_release_lock(uuid) TO service_role;

-- ------------------------------------------------------ BACKLINK EXCHANGE ----
-- An exchange site IS a Rankbox site: its id is the site id. That makes the
-- exchange's own `site_id` columns (targets, placements) the same identifier
-- as everyone else's, with no mapping table. The owner-level rules stay on
-- user_id: exchange_no_self_link still forbids any trade between two sites of
-- one owner.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.exchange_sites e
     WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = e.id AND p.user_id = e.user_id)
  ) THEN
    RAISE EXCEPTION 'exchange_sites has rows whose id is not their owner''s site id; remap them before applying Studio';
  END IF;
END $$;
ALTER TABLE public.exchange_sites
  DROP CONSTRAINT exchange_sites_user_id_key,
  ADD CONSTRAINT exchange_sites_site_fkey
    FOREIGN KEY (id, user_id) REFERENCES public.profiles (id, user_id) ON DELETE CASCADE;
CREATE INDEX idx_exchange_sites_user ON public.exchange_sites (user_id);

CREATE INDEX idx_exchange_targets_site ON public.exchange_targets (site_id);

-- A site's own view of the trade (its inbound and hosted links) is now read by
-- site rather than by owner.
CREATE INDEX idx_exchange_placements_host_site
  ON public.exchange_placements (host_site_id, status);
CREATE INDEX idx_exchange_placements_req_site
  ON public.exchange_placements (requester_site_id, status);

-- Credits belong to a site: each site earns by hosting in its own articles
-- and spends on links to its own pages. Keyed to the site (profiles), not to
-- exchange_sites, because the monthly grant lands before a member has
-- claimed a domain.
ALTER TABLE public.exchange_credit_accounts ADD COLUMN site_id uuid;
UPDATE public.exchange_credit_accounts t SET site_id = p.id FROM public.profiles p WHERE p.user_id = t.user_id;
ALTER TABLE public.exchange_credit_accounts
  ALTER COLUMN site_id SET NOT NULL,
  DROP CONSTRAINT exchange_credit_accounts_user_id_key,
  ADD CONSTRAINT exchange_credit_accounts_site_id_key UNIQUE (site_id),
  ADD CONSTRAINT exchange_credit_accounts_site_fkey
    FOREIGN KEY (site_id, user_id) REFERENCES public.profiles (id, user_id) ON DELETE CASCADE;

ALTER TABLE public.exchange_ledger ADD COLUMN site_id uuid;
UPDATE public.exchange_ledger t SET site_id = p.id FROM public.profiles p WHERE p.user_id = t.user_id;
ALTER TABLE public.exchange_ledger
  ALTER COLUMN site_id SET NOT NULL,
  ADD CONSTRAINT exchange_ledger_site_fkey
    FOREIGN KEY (site_id, user_id) REFERENCES public.profiles (id, user_id) ON DELETE CASCADE;
DROP INDEX public.idx_exchange_ledger_user;
CREATE INDEX idx_exchange_ledger_site ON public.exchange_ledger (site_id, created_at DESC);

ALTER TABLE public.exchange_blocks ADD COLUMN site_id uuid;
UPDATE public.exchange_blocks t SET site_id = p.id FROM public.profiles p WHERE p.user_id = t.user_id;
ALTER TABLE public.exchange_blocks
  ALTER COLUMN site_id SET NOT NULL,
  DROP CONSTRAINT exchange_blocks_user_id_domain_key,
  ADD CONSTRAINT exchange_blocks_site_id_domain_key UNIQUE (site_id, domain),
  ADD CONSTRAINT exchange_blocks_site_fkey
    FOREIGN KEY (site_id, user_id) REFERENCES public.profiles (id, user_id) ON DELETE CASCADE;

-- --------------------------------------------------------- REDDIT PRESENCE ----
ALTER TABLE public.reddit_settings ADD COLUMN site_id uuid;
UPDATE public.reddit_settings t SET site_id = p.id FROM public.profiles p WHERE p.user_id = t.user_id;
ALTER TABLE public.reddit_settings
  ALTER COLUMN site_id SET NOT NULL,
  DROP CONSTRAINT reddit_settings_pkey,
  ADD CONSTRAINT reddit_settings_pkey PRIMARY KEY (site_id),
  ADD CONSTRAINT reddit_settings_site_fkey
    FOREIGN KEY (site_id, user_id) REFERENCES public.profiles (id, user_id) ON DELETE CASCADE;
CREATE INDEX idx_reddit_settings_user ON public.reddit_settings (user_id);

ALTER TABLE public.reddit_sweeps ADD COLUMN site_id uuid;
UPDATE public.reddit_sweeps t SET site_id = p.id FROM public.profiles p WHERE p.user_id = t.user_id;
ALTER TABLE public.reddit_sweeps
  ALTER COLUMN site_id SET NOT NULL,
  ADD CONSTRAINT reddit_sweeps_site_fkey
    FOREIGN KEY (site_id, user_id) REFERENCES public.profiles (id, user_id) ON DELETE CASCADE;
DROP INDEX public.reddit_sweeps_one_running;
CREATE UNIQUE INDEX reddit_sweeps_one_running
  ON public.reddit_sweeps (site_id) WHERE status = 'running';
DROP INDEX public.idx_reddit_sweeps_user;
CREATE INDEX idx_reddit_sweeps_site ON public.reddit_sweeps (site_id, started_at DESC);

ALTER TABLE public.reddit_opportunities ADD COLUMN site_id uuid;
UPDATE public.reddit_opportunities t SET site_id = p.id FROM public.profiles p WHERE p.user_id = t.user_id;
ALTER TABLE public.reddit_opportunities
  ALTER COLUMN site_id SET NOT NULL,
  DROP CONSTRAINT reddit_opportunities_user_id_thread_id_key,
  ADD CONSTRAINT reddit_opportunities_site_id_thread_id_key UNIQUE (site_id, thread_id),
  ADD CONSTRAINT reddit_opportunities_site_fkey
    FOREIGN KEY (site_id, user_id) REFERENCES public.profiles (id, user_id) ON DELETE CASCADE;
DROP INDEX public.idx_reddit_opps_user_rank;
CREATE INDEX idx_reddit_opps_site_rank
  ON public.reddit_opportunities (site_id, status, score DESC);

ALTER TABLE public.reddit_drafts ADD COLUMN site_id uuid;
UPDATE public.reddit_drafts t SET site_id = p.id FROM public.profiles p WHERE p.user_id = t.user_id;
ALTER TABLE public.reddit_drafts
  ALTER COLUMN site_id SET NOT NULL,
  ADD CONSTRAINT reddit_drafts_site_fkey
    FOREIGN KEY (site_id, user_id) REFERENCES public.profiles (id, user_id) ON DELETE CASCADE;

-- reddit_replies_one_per_thread stays on (user_id, thread_id): one standing
-- reply per thread per PERSON, across every site they run.
ALTER TABLE public.reddit_replies ADD COLUMN site_id uuid;
UPDATE public.reddit_replies t SET site_id = p.id FROM public.profiles p WHERE p.user_id = t.user_id;
ALTER TABLE public.reddit_replies
  ALTER COLUMN site_id SET NOT NULL,
  ADD CONSTRAINT reddit_replies_site_fkey
    FOREIGN KEY (site_id, user_id) REFERENCES public.profiles (id, user_id) ON DELETE CASCADE;
DROP INDEX public.idx_reddit_replies_user;
CREATE INDEX idx_reddit_replies_site ON public.reddit_replies (site_id, posted_at DESC);

ALTER TABLE public.reddit_credit_accounts ADD COLUMN site_id uuid;
UPDATE public.reddit_credit_accounts t SET site_id = p.id FROM public.profiles p WHERE p.user_id = t.user_id;
ALTER TABLE public.reddit_credit_accounts
  ALTER COLUMN site_id SET NOT NULL,
  DROP CONSTRAINT reddit_credit_accounts_user_id_key,
  ADD CONSTRAINT reddit_credit_accounts_site_id_key UNIQUE (site_id),
  ADD CONSTRAINT reddit_credit_accounts_site_fkey
    FOREIGN KEY (site_id, user_id) REFERENCES public.profiles (id, user_id) ON DELETE CASCADE;

ALTER TABLE public.reddit_ledger ADD COLUMN site_id uuid;
UPDATE public.reddit_ledger t SET site_id = p.id FROM public.profiles p WHERE p.user_id = t.user_id;
ALTER TABLE public.reddit_ledger
  ALTER COLUMN site_id SET NOT NULL,
  ADD CONSTRAINT reddit_ledger_site_fkey
    FOREIGN KEY (site_id, user_id) REFERENCES public.profiles (id, user_id) ON DELETE CASCADE;
DROP INDEX public.idx_reddit_ledger_user;
CREATE INDEX idx_reddit_ledger_site ON public.reddit_ledger (site_id, created_at DESC);

-- ============================================================= FUNCTIONS ====
-- Every credit function is re-keyed from the owner to the site. The parameter
-- names change with them (_user_id -> _site_id), which Postgres cannot do in
-- place, so each is dropped and recreated. A caller still passing _user_id
-- fails loudly instead of spending the wrong site's balance.

DROP FUNCTION public.consume_article_credit(uuid);
DROP FUNCTION public.refund_article_credit(uuid);
DROP FUNCTION public.reset_article_credits(uuid, timestamptz);
DROP FUNCTION public.reset_article_credits(uuid, timestamptz, integer);

-- Atomically consume one article credit. True only if one was available.
CREATE FUNCTION public.consume_article_credit(_site_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _updated integer;
BEGIN
  -- A signed-in caller can only ever spend on their own sites; the service
  -- role (no auth context) spends on behalf of the site it names.
  UPDATE public.credit_accounts
     SET credits_used = credits_used + 1
   WHERE site_id = _site_id
     AND (auth.uid() IS NULL OR user_id = auth.uid())
     AND credits_used < credits_total;
  GET DIAGNOSTICS _updated = ROW_COUNT;
  RETURN _updated > 0;
END;
$$;

-- Give back one credit (a generation that failed after reserving).
CREATE FUNCTION public.refund_article_credit(_site_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.credit_accounts
     SET credits_used = GREATEST(credits_used - 1, 0)
   WHERE site_id = _site_id;
END;
$$;

-- Refill a site's credits to an explicit amount for a billing period. No-ops
-- unless the period actually changed, so it is safe to call on every event.
-- A studio site added mid-period gets its prorated first allowance through the
-- same call, stamped with the current period's end; the renewal then refills
-- it in full like every other site.
CREATE FUNCTION public.reset_article_credits(
  _site_id uuid,
  _period_end timestamptz,
  _credits integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.credit_accounts (user_id, site_id, credits_used, credits_total, period_end)
    SELECT p.user_id, p.id, 0, _credits, _period_end
      FROM public.profiles p
     WHERE p.id = _site_id
  ON CONFLICT (site_id) DO UPDATE
    SET credits_used = 0,
        credits_total = _credits,
        period_end = EXCLUDED.period_end
    WHERE public.credit_accounts.period_end IS DISTINCT FROM EXCLUDED.period_end;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_article_credit(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.refund_article_credit(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.reset_article_credits(uuid, timestamptz, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_article_credit(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.refund_article_credit(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.reset_article_credits(uuid, timestamptz, integer) TO service_role;

-- ------------------------------------------------------ exchange functions ----

DROP FUNCTION public.exchange_set_paid(uuid, boolean);
DROP FUNCTION public.exchange_grant_credits(uuid, timestamptz, integer);

-- The paid gate's one write path, now per site: an archived studio site drops
-- out of the pool while the owner's other sites keep trading. Touches nothing
-- else — a lapsed site's live links stay live and its credits are held.
CREATE FUNCTION public.exchange_set_paid(_site_id uuid, _paid boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.exchange_sites
     SET paid_active = _paid, paid_checked_at = now()
   WHERE id = _site_id;
END;
$$;

-- Monthly grant, per site. Tops up rather than resets (earned credits must
-- survive a billing boundary), never past three months' worth, and no-ops
-- unless the period advanced. Returns what was actually granted.
CREATE FUNCTION public.exchange_grant_credits(
  _site_id uuid,
  _period_end timestamptz,
  _credits integer
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _owner uuid;
  _created uuid;
  _acct record;
  _granted integer := 0;
  _bal integer;
BEGIN
  IF _credits IS NULL OR _credits <= 0 THEN RETURN 0; END IF;
  SELECT user_id INTO _owner FROM public.profiles WHERE id = _site_id;
  IF _owner IS NULL THEN RETURN 0; END IF;

  INSERT INTO public.exchange_credit_accounts (user_id, site_id, balance, period_end)
    VALUES (_owner, _site_id, 0, NULL)
  ON CONFLICT (site_id) DO NOTHING
  RETURNING id INTO _created;

  SELECT balance, period_end INTO _acct
    FROM public.exchange_credit_accounts
   WHERE site_id = _site_id
   FOR UPDATE;

  IF _created IS NULL AND _acct.period_end IS NOT DISTINCT FROM _period_end THEN
    RETURN 0;
  END IF;

  _granted := GREATEST(0, LEAST(_credits, _credits * 3 - _acct.balance));

  UPDATE public.exchange_credit_accounts
     SET balance = balance + _granted, period_end = _period_end
   WHERE site_id = _site_id
  RETURNING balance INTO _bal;

  IF _granted > 0 THEN
    INSERT INTO public.exchange_ledger (user_id, site_id, kind, credits, balance_after, note)
      VALUES (_owner, _site_id, 'grant', _granted, _bal, 'monthly plan grant');
  END IF;
  RETURN _granted;
END;
$$;

-- Same authority as before; the balances it moves are now the target SITE's.
-- The owner-level refusals are unchanged: no trade between two sites of one
-- owner, whichever site asks.
CREATE OR REPLACE FUNCTION public.exchange_reserve_placement(
  _target_id uuid,
  _host_user_id uuid,
  _host_site_id uuid,
  _host_blog_id uuid,
  _anchor text,
  _credits integer,
  _match_score numeric DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _t record;
  _host record;
  _bal integer;
  _id uuid;
  _period_start timestamptz := now() - interval '30 days';
BEGIN
  IF _credits IS NULL OR _credits < 1 OR _credits > 4 THEN RETURN NULL; END IF;
  IF _anchor IS NULL OR length(btrim(_anchor)) = 0 THEN RETURN NULL; END IF;

  SELECT t.id, t.url, t.user_id AS owner_id, t.site_id AS owner_site_id,
         t.max_new_links_per_month,
         s.domain AS owner_domain, s.status AS owner_status,
         s.opted_in AS owner_opted_in, s.paid_active AS owner_paid,
         s.reputation AS owner_rep
    INTO _t
    FROM public.exchange_targets t
    JOIN public.exchange_sites s ON s.id = t.site_id
   WHERE t.id = _target_id AND t.active
   FOR UPDATE OF t;
  IF NOT FOUND THEN RETURN NULL; END IF;
  IF _t.owner_status <> 'verified' OR NOT _t.owner_opted_in OR NOT _t.owner_paid THEN
    RETURN NULL;
  END IF;
  IF _t.owner_rep < 50 THEN RETURN NULL; END IF;

  SELECT * INTO _host
    FROM public.exchange_sites
   WHERE id = _host_site_id AND user_id = _host_user_id
     AND status = 'verified' AND opted_in AND paid_active
   FOR UPDATE;
  IF NOT FOUND THEN RETURN NULL; END IF;

  IF _t.owner_id = _host_user_id OR _t.owner_site_id = _host_site_id THEN RETURN NULL; END IF;
  IF _t.owner_domain = _host.domain THEN RETURN NULL; END IF;

  -- Blocks, both directions, each set by the site it protects.
  IF EXISTS (
    SELECT 1 FROM public.exchange_blocks
     WHERE (site_id = _host_site_id   AND domain = _t.owner_domain)
        OR (site_id = _t.owner_site_id AND domain = _host.domain)
  ) THEN RETURN NULL; END IF;

  IF EXISTS (
    SELECT 1 FROM public.exchange_placements
     WHERE requester_site_id = _host_site_id AND host_site_id = _t.owner_site_id
       AND status IN ('reserved', 'placed', 'live')
  ) THEN RETURN NULL; END IF;

  IF EXISTS (
    SELECT 1 FROM public.exchange_placements
     WHERE requester_site_id = _t.owner_site_id AND host_site_id = _host_site_id
       AND reserved_at > now() - interval '180 days'
       AND status <> 'cancelled'
  ) THEN RETURN NULL; END IF;

  IF _host_blog_id IS NOT NULL AND (
    SELECT count(*) FROM public.exchange_placements
     WHERE host_blog_id = _host_blog_id AND status IN ('reserved', 'placed', 'live')
  ) >= _host.max_links_per_article THEN RETURN NULL; END IF;

  -- One article never links two sites of one owner. With Studio an owner can
  -- run several, and one page linking into one owner's network twice is
  -- exactly the footprint the exchange exists to avoid.
  IF _host_blog_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.exchange_placements
     WHERE host_blog_id = _host_blog_id AND requester_user_id = _t.owner_id
       AND status IN ('reserved', 'placed', 'live')
  ) THEN RETURN NULL; END IF;

  IF (
    SELECT count(*) FROM public.exchange_placements
     WHERE host_site_id = _host_site_id AND reserved_at > _period_start
       AND status IN ('reserved', 'placed', 'live')
  ) >= _host.max_links_per_period THEN RETURN NULL; END IF;

  IF (
    SELECT count(*) FROM public.exchange_placements
     WHERE target_id = _target_id AND reserved_at > _period_start
       AND status IN ('reserved', 'placed', 'live')
  ) >= _t.max_new_links_per_month THEN RETURN NULL; END IF;

  IF _host.is_house AND EXISTS (
    SELECT 1 FROM public.exchange_placements
     WHERE host_site_id = _host_site_id AND requester_site_id = _t.owner_site_id
       AND status <> 'cancelled'
  ) THEN RETURN NULL; END IF;

  -- Escrow the requesting site's credits: check and decrement in one statement.
  UPDATE public.exchange_credit_accounts
     SET balance = balance - _credits, escrowed = escrowed + _credits
   WHERE site_id = _t.owner_site_id AND balance >= _credits
  RETURNING balance INTO _bal;
  IF NOT FOUND THEN RETURN NULL; END IF;

  INSERT INTO public.exchange_placements
    (target_id, requester_user_id, requester_site_id, host_user_id, host_site_id,
     host_blog_id, anchor_used, target_url, escrow_credits, match_score)
  VALUES
    (_target_id, _t.owner_id, _t.owner_site_id, _host_user_id, _host_site_id,
     _host_blog_id, btrim(_anchor), _t.url, _credits, _match_score)
  RETURNING id INTO _id;

  INSERT INTO public.exchange_ledger (user_id, site_id, placement_id, kind, credits, balance_after, note)
    VALUES (_t.owner_id, _t.owner_site_id, _id, 'escrow', -_credits, _bal, 'reserved on ' || _host.domain);

  UPDATE public.exchange_targets SET last_placed_at = now() WHERE id = _target_id;
  RETURN _id;
EXCEPTION WHEN unique_violation THEN
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.exchange_settle_placement(_placement_id uuid, _host_url text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _p record;
  _rb integer;
  _hb integer;
BEGIN
  SELECT * INTO _p FROM public.exchange_placements
   WHERE id = _placement_id AND status = 'placed'
   FOR UPDATE;
  IF NOT FOUND THEN RETURN false; END IF;

  UPDATE public.exchange_targets
     SET live_count = live_count + 1, queued_since = now()
   WHERE id = _p.target_id;
  UPDATE public.exchange_sites
     SET live_hosted_count = live_hosted_count + 1
   WHERE id = _p.host_site_id;

  -- Requesting site: escrow becomes spend.
  UPDATE public.exchange_credit_accounts
     SET escrowed = GREATEST(escrowed - _p.escrow_credits, 0),
         lifetime_spent = lifetime_spent + _p.escrow_credits
   WHERE site_id = _p.requester_site_id
  RETURNING balance INTO _rb;

  -- Hosting site: earns.
  INSERT INTO public.exchange_credit_accounts (user_id, site_id, balance, lifetime_earned)
    VALUES (_p.host_user_id, _p.host_site_id, _p.escrow_credits, _p.escrow_credits)
  ON CONFLICT (site_id) DO UPDATE
    SET balance = public.exchange_credit_accounts.balance + _p.escrow_credits,
        lifetime_earned = public.exchange_credit_accounts.lifetime_earned + _p.escrow_credits
  RETURNING balance INTO _hb;

  UPDATE public.exchange_placements
     SET status = 'live',
         live_at = now(),
         host_url = COALESCE(_host_url, host_url),
         last_checked_at = now(),
         consecutive_failures = 0
   WHERE id = _placement_id;

  INSERT INTO public.exchange_ledger (user_id, site_id, placement_id, kind, credits, balance_after, note)
    VALUES (_p.requester_user_id, _p.requester_site_id, _placement_id, 'settle_spend', 0, COALESCE(_rb, 0), 'link verified live'),
           (_p.host_user_id,      _p.host_site_id,      _placement_id, 'settle_earn', _p.escrow_credits, _hb, 'hosted link verified live');
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.exchange_refund_placement(
  _placement_id uuid,
  _status public.exchange_placement_status,
  _reason text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _p record;
  _bal integer;
BEGIN
  IF _status NOT IN ('expired', 'cancelled') THEN RETURN false; END IF;

  SELECT * INTO _p FROM public.exchange_placements
   WHERE id = _placement_id AND status IN ('reserved', 'placed')
   FOR UPDATE;
  IF NOT FOUND THEN RETURN false; END IF;

  UPDATE public.exchange_credit_accounts
     SET balance = balance + _p.escrow_credits,
         escrowed = GREATEST(escrowed - _p.escrow_credits, 0)
   WHERE site_id = _p.requester_site_id
  RETURNING balance INTO _bal;

  UPDATE public.exchange_placements
     SET status = _status, ended_at = now(), end_reason = left(COALESCE(_reason, ''), 200)
   WHERE id = _placement_id;

  INSERT INTO public.exchange_ledger (user_id, site_id, placement_id, kind, credits, balance_after, note)
    VALUES (_p.requester_user_id, _p.requester_site_id, _placement_id, 'refund', _p.escrow_credits,
            COALESCE(_bal, 0), left(COALESCE(_reason, ''), 200));
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.exchange_clawback_placement(_placement_id uuid, _reason text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _p record;
  _rb integer;
  _hb integer;
BEGIN
  SELECT * INTO _p FROM public.exchange_placements
   WHERE id = _placement_id AND status = 'live'
   FOR UPDATE;
  IF NOT FOUND THEN RETURN false; END IF;

  UPDATE public.exchange_targets
     SET live_count = GREATEST(live_count - 1, 0)
   WHERE id = _p.target_id;

  UPDATE public.exchange_sites
     SET lost_hosted_count = lost_hosted_count + 1,
         live_hosted_count = GREATEST(live_hosted_count - 1, 0),
         reputation = GREATEST(reputation - 10, 0),
         status = CASE WHEN reputation - 10 < 40 THEN 'suspended'::public.exchange_site_status ELSE status END
   WHERE id = _p.host_site_id;

  UPDATE public.exchange_credit_accounts
     SET balance = GREATEST(balance - _p.escrow_credits, 0),
         lifetime_earned = GREATEST(lifetime_earned - _p.escrow_credits, 0)
   WHERE site_id = _p.host_site_id
  RETURNING balance INTO _hb;

  UPDATE public.exchange_credit_accounts
     SET balance = balance + _p.escrow_credits,
         lifetime_spent = GREATEST(lifetime_spent - _p.escrow_credits, 0)
   WHERE site_id = _p.requester_site_id
  RETURNING balance INTO _rb;

  UPDATE public.exchange_placements
     SET status = 'lost', ended_at = now(), end_reason = left(COALESCE(_reason, ''), 200)
   WHERE id = _placement_id;

  INSERT INTO public.exchange_ledger (user_id, site_id, placement_id, kind, credits, balance_after, note)
    VALUES (_p.host_user_id,      _p.host_site_id,      _placement_id, 'clawback', -_p.escrow_credits, COALESCE(_hb, 0), left(COALESCE(_reason, ''), 200)),
           (_p.requester_user_id, _p.requester_site_id, _placement_id, 'refund',    _p.escrow_credits, COALESCE(_rb, 0), left(COALESCE(_reason, ''), 200));
  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.exchange_set_paid(uuid, boolean) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.exchange_grant_credits(uuid, timestamptz, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.exchange_set_paid(uuid, boolean) TO service_role;
GRANT EXECUTE ON FUNCTION public.exchange_grant_credits(uuid, timestamptz, integer) TO service_role;

-- -------------------------------------------------------- reddit functions ----

DROP FUNCTION public.reddit_set_paid(uuid, boolean);
DROP FUNCTION public.reddit_grant_credits(uuid, timestamptz, integer);
DROP FUNCTION public.reddit_spend_credit(uuid, integer, uuid, text);
DROP FUNCTION public.reddit_refund_credit(uuid, integer, uuid, text);
DROP FUNCTION public.reddit_start_sweep(uuid, text[], text, interval);
DROP FUNCTION public.reddit_upsert_opportunity(uuid, uuid, uuid, text, text, numeric, jsonb, text);
DROP FUNCTION public.reddit_record_reply(uuid, uuid, uuid, text, text);

-- The paid gate, per site. Creates the site's settings row if there isn't
-- one, so the flag is already right on the day the feature is switched on.
CREATE FUNCTION public.reddit_set_paid(_site_id uuid, _paid boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.reddit_settings (site_id, user_id, paid_active, paid_checked_at)
    SELECT p.id, p.user_id, _paid, now() FROM public.profiles p WHERE p.id = _site_id
  ON CONFLICT (site_id) DO UPDATE
    SET paid_active = EXCLUDED.paid_active, paid_checked_at = now();
END;
$$;

-- Monthly grant, per site. A RESET: nothing here is earned, and an unused
-- month does not bank. Returns the new balance, or NULL when nothing changed.
CREATE FUNCTION public.reddit_grant_credits(
  _site_id uuid,
  _period_end timestamptz,
  _credits integer
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _owner uuid;
  _created uuid;
  _acct record;
BEGIN
  IF _credits IS NULL OR _credits <= 0 THEN RETURN NULL; END IF;
  SELECT user_id INTO _owner FROM public.profiles WHERE id = _site_id;
  IF _owner IS NULL THEN RETURN NULL; END IF;

  INSERT INTO public.reddit_credit_accounts (user_id, site_id, balance, period_end)
    VALUES (_owner, _site_id, 0, NULL)
  ON CONFLICT (site_id) DO NOTHING
  RETURNING id INTO _created;

  SELECT balance, period_end INTO _acct
    FROM public.reddit_credit_accounts
   WHERE site_id = _site_id
   FOR UPDATE;

  IF _created IS NULL AND _acct.period_end IS NOT DISTINCT FROM _period_end THEN
    RETURN NULL;
  END IF;

  UPDATE public.reddit_credit_accounts
     SET balance = _credits, period_end = _period_end
   WHERE site_id = _site_id;

  INSERT INTO public.reddit_ledger (user_id, site_id, kind, credits, balance_after, note)
    VALUES (_owner, _site_id, 'grant', _credits - _acct.balance, _credits, 'monthly plan grant');
  RETURN _credits;
END;
$$;

CREATE FUNCTION public.reddit_spend_credit(
  _site_id uuid,
  _amount integer,
  _draft_id uuid,
  _note text
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _owner uuid;
  _bal integer;
BEGIN
  IF _amount IS NULL OR _amount <= 0 THEN RETURN NULL; END IF;

  UPDATE public.reddit_credit_accounts
     SET balance = balance - _amount, lifetime_spent = lifetime_spent + _amount
   WHERE site_id = _site_id AND balance >= _amount
  RETURNING balance, user_id INTO _bal, _owner;

  IF _bal IS NULL THEN RETURN NULL; END IF;

  INSERT INTO public.reddit_ledger (user_id, site_id, draft_id, kind, credits, balance_after, note)
    VALUES (_owner, _site_id, _draft_id, 'spend', -_amount, _bal, COALESCE(_note, ''));
  RETURN _bal;
END;
$$;

CREATE FUNCTION public.reddit_refund_credit(
  _site_id uuid,
  _amount integer,
  _draft_id uuid,
  _note text
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _owner uuid;
  _bal integer;
BEGIN
  IF _amount IS NULL OR _amount <= 0 THEN RETURN NULL; END IF;

  UPDATE public.reddit_credit_accounts
     SET balance = balance + _amount,
         lifetime_spent = GREATEST(0, lifetime_spent - _amount)
   WHERE site_id = _site_id
  RETURNING balance, user_id INTO _bal, _owner;

  IF _bal IS NULL THEN RETURN NULL; END IF;

  INSERT INTO public.reddit_ledger (user_id, site_id, draft_id, kind, credits, balance_after, note)
    VALUES (_owner, _site_id, _draft_id, 'refund', _amount, _bal, COALESCE(_note, ''));
  RETURN _bal;
END;
$$;

-- Start a sweep for one site. Still the authority on whether money may be
-- spent: it re-checks the site's paid flag under a lock. Reaps its own dead.
CREATE FUNCTION public.reddit_start_sweep(
  _site_id uuid,
  _keywords text[],
  _trigger text,
  _min_interval interval
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _s record;
  _id uuid;
BEGIN
  SELECT * INTO _s FROM public.reddit_settings WHERE site_id = _site_id FOR UPDATE;

  IF NOT FOUND OR NOT _s.enabled THEN RETURN jsonb_build_object('reason', 'not_enabled'); END IF;
  IF NOT _s.paid_active THEN RETURN jsonb_build_object('reason', 'not_paid'); END IF;

  UPDATE public.reddit_sweeps
     SET status = 'failed', finished_at = now(), error = 'abandoned: no result within 30 minutes'
   WHERE site_id = _site_id AND status = 'running' AND started_at < now() - interval '30 minutes';

  IF EXISTS (SELECT 1 FROM public.reddit_sweeps WHERE site_id = _site_id AND status = 'running') THEN
    RETURN jsonb_build_object('reason', 'already_running');
  END IF;

  IF _s.last_sweep_at IS NOT NULL AND _min_interval IS NOT NULL
     AND _s.last_sweep_at > now() - _min_interval THEN
    RETURN jsonb_build_object('reason', 'too_soon');
  END IF;

  INSERT INTO public.reddit_sweeps (user_id, site_id, trigger, keywords_used)
    VALUES (_s.user_id, _site_id, COALESCE(_trigger, 'cron'), COALESCE(_keywords, '{}'))
  RETURNING id INTO _id;

  UPDATE public.reddit_settings
     SET last_sweep_at = now(), sweep_count = sweep_count + 1
   WHERE site_id = _site_id;

  RETURN jsonb_build_object('sweep_id', _id);
END;
$$;

CREATE FUNCTION public.reddit_upsert_opportunity(
  _site_id uuid,
  _thread_id uuid,
  _sweep_id uuid,
  _keyword text,
  _channel text,
  _score numeric,
  _breakdown jsonb,
  _blocked_reason text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _dead boolean := _blocked_reason IN ('archived', 'likely_archived', 'locked', 'removed');
  _owner uuid;
  _id uuid;
  _inserted boolean;
BEGIN
  SELECT user_id INTO _owner FROM public.profiles WHERE id = _site_id;
  IF _owner IS NULL THEN RETURN NULL; END IF;

  INSERT INTO public.reddit_opportunities (
    user_id, site_id, thread_id, sweep_id, matched_keyword, channel, status, score, breakdown, blocked_reason
  ) VALUES (
    _owner, _site_id, _thread_id, _sweep_id, COALESCE(_keyword, ''), COALESCE(_channel, 'search'),
    CASE WHEN _dead THEN 'dead'::public.reddit_opportunity_status
         ELSE 'new'::public.reddit_opportunity_status END,
    _score, COALESCE(_breakdown, '{}'::jsonb), _blocked_reason
  )
  ON CONFLICT (site_id, thread_id) DO UPDATE SET
    score          = EXCLUDED.score,
    breakdown      = EXCLUDED.breakdown,
    blocked_reason = EXCLUDED.blocked_reason,
    last_scored_at = now(),
    channel        = CASE WHEN public.reddit_opportunities.channel <> EXCLUDED.channel
                          THEN 'both' ELSE public.reddit_opportunities.channel END,
    status         = CASE
      WHEN public.reddit_opportunities.status IN ('posted', 'dismissed') THEN public.reddit_opportunities.status
      WHEN _dead THEN 'dead'::public.reddit_opportunity_status
      WHEN public.reddit_opportunities.status = 'dead' THEN 'new'::public.reddit_opportunity_status
      ELSE public.reddit_opportunities.status END
  RETURNING id, (xmax = 0) INTO _id, _inserted;
  RETURN jsonb_build_object('id', _id, 'created', _inserted);
END;
$$;

-- Record that the member posted, from one site's opportunity. The standing-
-- reply rule is the OWNER's: if this person already has a reply standing in
-- the thread — from any of their sites — nothing is recorded. A bare claim can
-- still be upgraded with its link, but only from the site that made it.
CREATE FUNCTION public.reddit_record_reply(
  _site_id uuid,
  _opportunity_id uuid,
  _draft_id uuid,
  _permalink text,
  _comment_id text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _opp record;
  _existing record;
  _id uuid;
BEGIN
  SELECT * INTO _opp FROM public.reddit_opportunities
   WHERE id = _opportunity_id AND site_id = _site_id FOR UPDATE;
  IF NOT FOUND THEN RETURN NULL; END IF;

  SELECT * INTO _existing FROM public.reddit_replies
   WHERE user_id = _opp.user_id AND thread_id = _opp.thread_id
     AND status IN ('claimed', 'posted', 'confirmed')
   FOR UPDATE;

  IF FOUND THEN
    IF _existing.site_id = _site_id AND _existing.status = 'claimed' AND _permalink IS NOT NULL THEN
      UPDATE public.reddit_replies
         SET permalink = _permalink, reddit_comment_id = _comment_id,
             status = 'posted', consecutive_failures = 0
       WHERE id = _existing.id;
      RETURN _existing.id;
    END IF;
    RETURN NULL;
  END IF;

  INSERT INTO public.reddit_replies (
    user_id, site_id, opportunity_id, thread_id, draft_id, permalink, reddit_comment_id, status
  ) VALUES (
    _opp.user_id, _site_id, _opportunity_id, _opp.thread_id, _draft_id, _permalink, _comment_id,
    CASE WHEN _permalink IS NULL THEN 'claimed'::public.reddit_reply_status
         ELSE 'posted'::public.reddit_reply_status END
  )
  RETURNING id INTO _id;

  UPDATE public.reddit_opportunities SET status = 'posted' WHERE id = _opportunity_id;
  RETURN _id;
END;
$$;

REVOKE ALL ON FUNCTION public.reddit_set_paid(uuid, boolean) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.reddit_grant_credits(uuid, timestamptz, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.reddit_spend_credit(uuid, integer, uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.reddit_refund_credit(uuid, integer, uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.reddit_start_sweep(uuid, text[], text, interval) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.reddit_upsert_opportunity(uuid, uuid, uuid, text, text, numeric, jsonb, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.reddit_record_reply(uuid, uuid, uuid, text, text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.reddit_set_paid(uuid, boolean) TO service_role;
GRANT EXECUTE ON FUNCTION public.reddit_grant_credits(uuid, timestamptz, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.reddit_spend_credit(uuid, integer, uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.reddit_refund_credit(uuid, integer, uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.reddit_start_sweep(uuid, text[], text, interval) TO service_role;
GRANT EXECUTE ON FUNCTION public.reddit_upsert_opportunity(uuid, uuid, uuid, text, text, numeric, jsonb, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.reddit_record_reply(uuid, uuid, uuid, text, text) TO service_role;
