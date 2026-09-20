-- ============================================================================
-- Peer-to-peer backlink exchange.
--
-- Currency, not barter: a member EARNS credits by hosting another member's
-- outbound link inside an article they publish, and SPENDS credits to have a
-- URL of their own linked from someone else's site. Direct A<->B reciprocity is
-- forbidden by construction (see exchange_reserve_placement), which is the
-- whole SEO-safety argument for the feature.
--
-- Two words are used consistently in every column, function and comment:
--   HOST      — the member whose article carries the link. Earns.
--   REQUESTER — the member whose URL is linked to. Spends.
--
-- Access is PAID ONLY. A trialing account never participates: `paid_active`
-- on exchange_sites is written by the Stripe webhook and re-synced nightly,
-- and the reserve function re-checks it under lock for both sides.
--
-- Write model mirrors credit_accounts exactly: members get SELECT-only RLS on
-- their own rows (none at all on placements, which name both parties), every
-- mutation goes through a SECURITY DEFINER function granted to service_role
-- alone, and every credit movement leaves a ledger row.
-- ============================================================================

CREATE TYPE public.exchange_site_status
  AS ENUM ('unverified', 'verifying', 'verified', 'suspended');
CREATE TYPE public.exchange_verify_method
  AS ENUM ('dns_txt', 'meta_tag', 'well_known');
CREATE TYPE public.exchange_placement_status
  AS ENUM ('reserved', 'placed', 'live', 'lost', 'expired', 'cancelled');
CREATE TYPE public.exchange_ledger_kind
  AS ENUM ('grant', 'escrow', 'settle_spend', 'settle_earn', 'refund', 'clawback', 'bonus', 'adjust');

-- ---------------------------------------------------------------------------
-- The paid gate needs to know whether a subscription was EVER paid. Stripe's
-- `canceled` and `past_due` both follow a trial as easily as a paid period,
-- and the row does not otherwise say which. Stamped once by the webhook the
-- first time a subscription is seen `active`.
-- ---------------------------------------------------------------------------
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS activated_at timestamptz;
COMMENT ON COLUMN public.subscriptions.activated_at IS
  'First time this subscription was seen active (i.e. paid). Null for a trial that never converted.';
UPDATE public.subscriptions SET activated_at = COALESCE(activated_at, updated_at)
 WHERE status = 'active';

-- ------------------------------------------------------------------ SITES ----
-- One row per member: the domain they publish to, whether it is verified, and
-- how they take part.
CREATE TABLE public.exchange_sites (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Normalised: lowercase apex, no scheme, no www, no path.
  domain                text NOT NULL,
  status                public.exchange_site_status NOT NULL DEFAULT 'unverified',
  verify_method         public.exchange_verify_method,
  verify_token          text NOT NULL DEFAULT md5(gen_random_uuid()::text || clock_timestamp()::text),
  verify_attempts       smallint NOT NULL DEFAULT 0,
  verified_at           timestamptz,

  -- Hosting is opt-in: nothing is written into a member's articles until they
  -- say so. It is also the price of spending — a site that does not host is
  -- never matched as a requester either (see exchange_reserve_placement).
  opted_in              boolean NOT NULL DEFAULT false,

  -- Denormalised paid entitlement. Written by the Stripe webhook on every
  -- subscription event and re-synced by the nightly cron; read by the matcher
  -- as one indexed boolean instead of a join on subscriptions.
  paid_active           boolean NOT NULL DEFAULT false,
  paid_checked_at       timestamptz,

  authority_score       smallint NOT NULL DEFAULT 0  CHECK (authority_score BETWEEN 0 AND 100),
  tier                  smallint NOT NULL DEFAULT 1  CHECK (tier BETWEEN 1 AND 4),
  reputation            smallint NOT NULL DEFAULT 100 CHECK (reputation BETWEEN 0 AND 100),

  niche                 text,
  topic_tags            text[] NOT NULL DEFAULT '{}',
  blocked_categories    text[] NOT NULL DEFAULT '{}',

  max_links_per_article smallint NOT NULL DEFAULT 1 CHECK (max_links_per_article BETWEEN 0 AND 2),
  max_links_per_period  smallint NOT NULL DEFAULT 30,

  -- Rankbox's own seed inventory. Same rules as everyone, plus the caps the
  -- matcher applies to house links (one per member domain, ever).
  is_house              boolean NOT NULL DEFAULT false,
  referred_by_site_id   uuid REFERENCES public.exchange_sites(id) ON DELETE SET NULL,

  live_hosted_count     integer NOT NULL DEFAULT 0,
  lost_hosted_count     integer NOT NULL DEFAULT 0,

  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- A domain can be CLAIMED by many accounts but VERIFIED by only one: two
-- accounts cannot both earn from one site. The primary sybil guard.
CREATE UNIQUE INDEX exchange_sites_verified_domain_key
  ON public.exchange_sites (domain) WHERE status = 'verified';
-- The matcher's pool scan.
CREATE INDEX idx_exchange_sites_pool
  ON public.exchange_sites (status, opted_in, paid_active, tier) WHERE status = 'verified';

CREATE TRIGGER update_exchange_sites_updated_at
  BEFORE UPDATE ON public.exchange_sites
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------------- TARGETS ----
-- DEMAND. A URL on the member's own verified domain that they want links
-- pointed at, with the anchors it may be linked under.
CREATE TABLE public.exchange_targets (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  site_id                 uuid NOT NULL REFERENCES public.exchange_sites(id) ON DELETE CASCADE,
  url                     text NOT NULL,
  -- 3–5 variants so no two placements from one host domain share an anchor.
  anchors                 text[] NOT NULL CHECK (array_length(anchors, 1) BETWEEN 3 AND 5),
  topic_tags              text[] NOT NULL DEFAULT '{}',
  priority                smallint NOT NULL DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),
  active                  boolean NOT NULL DEFAULT true,
  -- Velocity cap: new live links per rolling 30 days. Unnatural inbound
  -- velocity is the loudest footprint there is.
  max_new_links_per_month smallint NOT NULL DEFAULT 4 CHECK (max_new_links_per_month BETWEEN 1 AND 10),
  live_count              integer NOT NULL DEFAULT 0,
  last_placed_at          timestamptz,
  -- Drives the fair queue: the longer a target has waited, the more it is
  -- favoured. Reset each time a link goes live.
  queued_since            timestamptz NOT NULL DEFAULT now(),
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_exchange_targets_pool ON public.exchange_targets (active, queued_since) WHERE active;
CREATE INDEX idx_exchange_targets_user ON public.exchange_targets (user_id);
CREATE INDEX idx_exchange_targets_tags ON public.exchange_targets USING gin (topic_tags);

CREATE TRIGGER update_exchange_targets_updated_at
  BEFORE UPDATE ON public.exchange_targets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- A target must live on the member's OWN verified domain, enforced in the
-- database and not only in the app — otherwise the exchange is an open
-- redirect farm for anyone with a key.
CREATE OR REPLACE FUNCTION public.exchange_assert_target_domain()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _domain text;
  _host text;
BEGIN
  SELECT domain INTO _domain
    FROM public.exchange_sites
   WHERE id = NEW.site_id AND user_id = NEW.user_id AND status = 'verified';
  IF _domain IS NULL THEN
    RAISE EXCEPTION 'target site is not a verified site owned by this user';
  END IF;
  _host := lower(regexp_replace(NEW.url, '^https?://(www\.)?([^/?#:]+).*$', '\2'));
  IF _host <> _domain AND _host NOT LIKE ('%.' || _domain) THEN
    RAISE EXCEPTION 'target URL % is not on verified domain %', NEW.url, _domain;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.exchange_assert_target_domain() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER exchange_targets_assert_domain
  BEFORE INSERT OR UPDATE OF url, site_id ON public.exchange_targets
  FOR EACH ROW EXECUTE FUNCTION public.exchange_assert_target_domain();

-- ------------------------------------------------------------- PLACEMENTS ----
-- The trade unit.  reserved -> placed -> live -> (lost | expired | cancelled)
--   reserved   credits escrowed from the requester; the host article is being written
--   placed     the link is in the article body; nothing has moved yet
--   live       verified on the host's real page — this, and only this, moves value
--   expired    never published within the window; escrow refunded
--   cancelled  the link could not be written or the article vanished; refunded
--   lost       a live link disappeared; the host is charged back
CREATE TABLE public.exchange_placements (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_id            uuid NOT NULL REFERENCES public.exchange_targets(id) ON DELETE CASCADE,
  requester_user_id    uuid NOT NULL,
  requester_site_id    uuid NOT NULL REFERENCES public.exchange_sites(id) ON DELETE CASCADE,
  host_user_id         uuid NOT NULL,
  host_site_id         uuid NOT NULL REFERENCES public.exchange_sites(id) ON DELETE CASCADE,
  host_blog_id         uuid REFERENCES public.blogs(id) ON DELETE SET NULL,

  anchor_used          text NOT NULL,
  -- Snapshot: the target row may be edited later; the link that was placed does not change.
  target_url           text NOT NULL,
  host_url             text,
  host_url_source      text,

  status               public.exchange_placement_status NOT NULL DEFAULT 'reserved',
  escrow_credits       smallint NOT NULL DEFAULT 1 CHECK (escrow_credits BETWEEN 1 AND 4),
  match_score          numeric(6, 3),

  reserved_at          timestamptz NOT NULL DEFAULT now(),
  placed_at            timestamptz,
  live_at              timestamptz,
  ended_at             timestamptz,
  expires_at           timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  last_checked_at      timestamptz,
  consecutive_failures smallint NOT NULL DEFAULT 0,
  end_reason           text,

  CONSTRAINT exchange_no_self_link CHECK (requester_user_id <> host_user_id),
  CONSTRAINT exchange_no_self_site CHECK (requester_site_id <> host_site_id)
);

-- One live link per (target, host domain): a host linking the same target twice
-- is what a link farm looks like.
CREATE UNIQUE INDEX exchange_placements_target_host_active
  ON public.exchange_placements (target_id, host_site_id)
  WHERE status IN ('reserved', 'placed', 'live');
-- One exchange link per (target, host article).
CREATE UNIQUE INDEX exchange_placements_target_blog_active
  ON public.exchange_placements (target_id, host_blog_id)
  WHERE host_blog_id IS NOT NULL AND status IN ('reserved', 'placed', 'live');

CREATE INDEX idx_exchange_placements_host   ON public.exchange_placements (host_user_id, status);
CREATE INDEX idx_exchange_placements_req    ON public.exchange_placements (requester_user_id, status);
CREATE INDEX idx_exchange_placements_blog   ON public.exchange_placements (host_blog_id) WHERE host_blog_id IS NOT NULL;
CREATE INDEX idx_exchange_placements_sweep  ON public.exchange_placements (status, expires_at);
CREATE INDEX idx_exchange_placements_verify ON public.exchange_placements (status, last_checked_at NULLS FIRST);
-- The reciprocity and cooldown guards read this on every reservation.
CREATE INDEX idx_exchange_placements_pair
  ON public.exchange_placements (requester_site_id, host_site_id, reserved_at DESC);

-- -------------------------------------------------------- CREDIT ACCOUNTS ----
-- A single `balance` rather than credit_accounts' used/total pair: this
-- currency is EARNED as well as granted, and can sit in escrow across a
-- billing boundary, which used/total cannot express without lying about one
-- of the three.
CREATE TABLE public.exchange_credit_accounts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  balance         integer NOT NULL DEFAULT 0 CHECK (balance >= 0),
  escrowed        integer NOT NULL DEFAULT 0 CHECK (escrowed >= 0),
  lifetime_earned integer NOT NULL DEFAULT 0,
  lifetime_spent  integer NOT NULL DEFAULT 0,
  period_end      timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER update_exchange_credit_accounts_updated_at
  BEFORE UPDATE ON public.exchange_credit_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ----------------------------------------------------------------- LEDGER ----
CREATE TABLE public.exchange_ledger (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  placement_id  uuid REFERENCES public.exchange_placements(id) ON DELETE SET NULL,
  kind          public.exchange_ledger_kind NOT NULL,
  credits       integer NOT NULL,   -- signed
  balance_after integer NOT NULL,
  note          text NOT NULL DEFAULT '',
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_exchange_ledger_user ON public.exchange_ledger (user_id, created_at DESC);

-- ----------------------------------------------------------------- BLOCKS ----
CREATE TABLE public.exchange_blocks (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  domain     text NOT NULL,
  reason     text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, domain)
);

-- ------------------------------------------------------------ LINK CHECKS ----
-- Every verification attempt, so a clawback dispute is answerable.
CREATE TABLE public.exchange_link_checks (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  placement_id uuid NOT NULL REFERENCES public.exchange_placements(id) ON DELETE CASCADE,
  checked_at   timestamptz NOT NULL DEFAULT now(),
  url          text NOT NULL DEFAULT '',
  http_status  integer,
  -- live | missing | nofollow | noindex | unreachable | truncated | blocked
  outcome      text NOT NULL,
  rel_value    text,
  detail       text NOT NULL DEFAULT ''
);
CREATE INDEX idx_exchange_link_checks_placement
  ON public.exchange_link_checks (placement_id, checked_at DESC);

-- ------------------------------------------------------------ PRIVILEGES ----
-- Members read their own config and balances; nothing is writable from the
-- client. Placements and link checks have no member-facing policy at all — a
-- placement names both parties, and the server functions project only what
-- each side may see.
ALTER TABLE public.exchange_sites           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_targets         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_placements      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_credit_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_ledger          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_blocks          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_link_checks     ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.exchange_sites, public.exchange_targets, public.exchange_placements,
              public.exchange_credit_accounts, public.exchange_ledger, public.exchange_blocks,
              public.exchange_link_checks
  FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.exchange_sites, public.exchange_targets, public.exchange_credit_accounts,
                public.exchange_ledger, public.exchange_blocks
  TO authenticated;
GRANT ALL ON public.exchange_sites, public.exchange_targets, public.exchange_placements,
             public.exchange_credit_accounts, public.exchange_ledger, public.exchange_blocks,
             public.exchange_link_checks
  TO service_role;

CREATE POLICY "Users can view own exchange site"
  ON public.exchange_sites FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view own exchange targets"
  ON public.exchange_targets FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view own exchange credits"
  ON public.exchange_credit_accounts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view own exchange ledger"
  ON public.exchange_ledger FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view own exchange blocks"
  ON public.exchange_blocks FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ================================================================ FUNCTIONS ==
-- All SECURITY DEFINER, service_role only. Lock order everywhere is
--   placement -> target -> site -> credit account
-- so two of these running at once cannot deadlock.

-- The paid gate's one write path. Called by the Stripe webhook on every
-- subscription event and by the nightly re-sync. Deliberately touches nothing
-- else: a lapsed member's targets are simply never matched (the pool filter
-- reads paid_active), their live links stay live, and their credits are held,
-- not confiscated — everything resumes the moment they pay again.
CREATE OR REPLACE FUNCTION public.exchange_set_paid(_user_id uuid, _paid boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.exchange_sites
     SET paid_active = _paid, paid_checked_at = now()
   WHERE user_id = _user_id;
END;
$$;

-- Monthly grant. Mirrors reset_article_credits(_user,_period_end,_credits):
-- no-ops unless the period actually advanced, so the webhook may call it on
-- every event. Unlike article credits it TOPS UP rather than resets — earned
-- credits must survive a billing boundary — but a grant never lifts the
-- balance above three months' worth, so a dormant account cannot bank a year
-- of leverage. Earned credits are never reduced by the cap. Returns what was
-- actually granted.
CREATE OR REPLACE FUNCTION public.exchange_grant_credits(
  _user_id uuid,
  _period_end timestamptz,
  _credits integer
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _created uuid;
  _acct record;
  _granted integer := 0;
  _bal integer;
BEGIN
  IF _credits IS NULL OR _credits <= 0 THEN RETURN 0; END IF;

  INSERT INTO public.exchange_credit_accounts (user_id, balance, period_end)
    VALUES (_user_id, 0, NULL)
  ON CONFLICT (user_id) DO NOTHING
  RETURNING id INTO _created;

  SELECT balance, period_end INTO _acct
    FROM public.exchange_credit_accounts
   WHERE user_id = _user_id
   FOR UPDATE;

  -- An existing account only refills when the period moved on.
  IF _created IS NULL AND _acct.period_end IS NOT DISTINCT FROM _period_end THEN
    RETURN 0;
  END IF;

  _granted := GREATEST(0, LEAST(_credits, _credits * 3 - _acct.balance));

  UPDATE public.exchange_credit_accounts
     SET balance = balance + _granted, period_end = _period_end
   WHERE user_id = _user_id
  RETURNING balance INTO _bal;

  IF _granted > 0 THEN
    INSERT INTO public.exchange_ledger (user_id, kind, credits, balance_after, note)
      VALUES (_user_id, 'grant', _granted, _bal, 'monthly plan grant');
  END IF;
  RETURN _granted;
END;
$$;

-- Atomic reservation. This function — not the matcher — is the authority on
-- whether a trade may happen; the matcher only proposes. Every hard filter is
-- re-checked here under a row lock, because two article generations for the
-- same host can race on the same target. NULL means "no": a normal outcome,
-- not an error, and the caller moves on to its next candidate.
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

  -- The target and its owner (the requester). Locked first: see lock order above.
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

  -- The host. Must itself be verified, opted in and paying.
  SELECT * INTO _host
    FROM public.exchange_sites
   WHERE id = _host_site_id AND user_id = _host_user_id
     AND status = 'verified' AND opted_in AND paid_active
   FOR UPDATE;
  IF NOT FOUND THEN RETURN NULL; END IF;

  IF _t.owner_id = _host_user_id OR _t.owner_site_id = _host_site_id THEN RETURN NULL; END IF;
  IF _t.owner_domain = _host.domain THEN RETURN NULL; END IF;

  -- Blocks, both directions.
  IF EXISTS (
    SELECT 1 FROM public.exchange_blocks
     WHERE (user_id = _host_user_id AND domain = _t.owner_domain)
        OR (user_id = _t.owner_id   AND domain = _host.domain)
  ) THEN RETURN NULL; END IF;

  -- NO DIRECT RECIPROCITY, ever, at any live status. The one rule the whole
  -- SEO-safety story rests on: if the requester's site has ever hosted a link
  -- to the host's site, the host may not host one back.
  IF EXISTS (
    SELECT 1 FROM public.exchange_placements
     WHERE requester_site_id = _host_site_id AND host_site_id = _t.owner_site_id
       AND status IN ('reserved', 'placed', 'live')
  ) THEN RETURN NULL; END IF;

  -- Same pair, same direction, within 180 days.
  IF EXISTS (
    SELECT 1 FROM public.exchange_placements
     WHERE requester_site_id = _t.owner_site_id AND host_site_id = _host_site_id
       AND reserved_at > now() - interval '180 days'
       AND status <> 'cancelled'
  ) THEN RETURN NULL; END IF;

  -- Host per-article cap.
  IF _host_blog_id IS NOT NULL AND (
    SELECT count(*) FROM public.exchange_placements
     WHERE host_blog_id = _host_blog_id AND status IN ('reserved', 'placed', 'live')
  ) >= _host.max_links_per_article THEN RETURN NULL; END IF;

  -- Host per-period cap.
  IF (
    SELECT count(*) FROM public.exchange_placements
     WHERE host_site_id = _host_site_id AND reserved_at > _period_start
       AND status IN ('reserved', 'placed', 'live')
  ) >= _host.max_links_per_period THEN RETURN NULL; END IF;

  -- Target velocity cap.
  IF (
    SELECT count(*) FROM public.exchange_placements
     WHERE target_id = _target_id AND reserved_at > _period_start
       AND status IN ('reserved', 'placed', 'live')
  ) >= _t.max_new_links_per_month THEN RETURN NULL; END IF;

  -- A house site links any one member domain once, ever.
  IF _host.is_house AND EXISTS (
    SELECT 1 FROM public.exchange_placements
     WHERE host_site_id = _host_site_id AND requester_site_id = _t.owner_site_id
       AND status <> 'cancelled'
  ) THEN RETURN NULL; END IF;

  -- Escrow the requester's credits. The balance check and the decrement are
  -- one statement, so a concurrent reservation cannot overdraw.
  UPDATE public.exchange_credit_accounts
     SET balance = balance - _credits, escrowed = escrowed + _credits
   WHERE user_id = _t.owner_id AND balance >= _credits
  RETURNING balance INTO _bal;
  IF NOT FOUND THEN RETURN NULL; END IF;

  INSERT INTO public.exchange_placements
    (target_id, requester_user_id, requester_site_id, host_user_id, host_site_id,
     host_blog_id, anchor_used, target_url, escrow_credits, match_score)
  VALUES
    (_target_id, _t.owner_id, _t.owner_site_id, _host_user_id, _host_site_id,
     _host_blog_id, btrim(_anchor), _t.url, _credits, _match_score)
  RETURNING id INTO _id;

  INSERT INTO public.exchange_ledger (user_id, placement_id, kind, credits, balance_after, note)
    VALUES (_t.owner_id, _id, 'escrow', -_credits, _bal, 'reserved on ' || _host.domain);

  UPDATE public.exchange_targets SET last_placed_at = now() WHERE id = _target_id;
  RETURN _id;
EXCEPTION WHEN unique_violation THEN
  -- Lost a race on one of the partial unique indexes. The block rolls back
  -- (escrow included); the caller tries its next candidate.
  RETURN NULL;
END;
$$;

-- The link is in the article body. Moves no money; restarts the 30-day
-- window the article has to be published in.
CREATE OR REPLACE FUNCTION public.exchange_mark_placed(_placement_id uuid, _host_blog_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _n integer;
BEGIN
  UPDATE public.exchange_placements
     SET status = 'placed',
         placed_at = now(),
         expires_at = now() + interval '30 days',
         host_blog_id = COALESCE(_host_blog_id, host_blog_id)
   WHERE id = _placement_id AND status = 'reserved';
  GET DIAGNOSTICS _n = ROW_COUNT;
  RETURN _n > 0;
END;
$$;

-- VERIFIED LIVE on the host's real page. This, and only this, moves value.
-- The host earns exactly what the requester escrowed: currency is conserved,
-- tier affects the price and never the mint.
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

  -- Requester: escrow becomes spend.
  UPDATE public.exchange_credit_accounts
     SET escrowed = GREATEST(escrowed - _p.escrow_credits, 0),
         lifetime_spent = lifetime_spent + _p.escrow_credits
   WHERE user_id = _p.requester_user_id
  RETURNING balance INTO _rb;

  -- Host: earns.
  INSERT INTO public.exchange_credit_accounts (user_id, balance, lifetime_earned)
    VALUES (_p.host_user_id, _p.escrow_credits, _p.escrow_credits)
  ON CONFLICT (user_id) DO UPDATE
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

  INSERT INTO public.exchange_ledger (user_id, placement_id, kind, credits, balance_after, note)
    VALUES (_p.requester_user_id, _placement_id, 'settle_spend', 0, COALESCE(_rb, 0), 'link verified live'),
           (_p.host_user_id,      _placement_id, 'settle_earn', _p.escrow_credits, _hb, 'hosted link verified live');
  RETURN true;
END;
$$;

-- Never published, or the article vanished, or the link could not be written.
-- Full refund to the requester.
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
   WHERE user_id = _p.requester_user_id
  RETURNING balance INTO _bal;

  UPDATE public.exchange_placements
     SET status = _status, ended_at = now(), end_reason = left(COALESCE(_reason, ''), 200)
   WHERE id = _placement_id;

  INSERT INTO public.exchange_ledger (user_id, placement_id, kind, credits, balance_after, note)
    VALUES (_p.requester_user_id, _placement_id, 'refund', _p.escrow_credits, COALESCE(_bal, 0),
            left(COALESCE(_reason, ''), 200));
  RETURN true;
END;
$$;

-- A settled link disappeared. The host gives the credits back and takes a
-- reputation hit; the requester is made whole. Below 40 reputation the host
-- site is suspended from the pool until reviewed.
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
   WHERE user_id = _p.host_user_id
  RETURNING balance INTO _hb;

  UPDATE public.exchange_credit_accounts
     SET balance = balance + _p.escrow_credits,
         lifetime_spent = GREATEST(lifetime_spent - _p.escrow_credits, 0)
   WHERE user_id = _p.requester_user_id
  RETURNING balance INTO _rb;

  UPDATE public.exchange_placements
     SET status = 'lost', ended_at = now(), end_reason = left(COALESCE(_reason, ''), 200)
   WHERE id = _placement_id;

  INSERT INTO public.exchange_ledger (user_id, placement_id, kind, credits, balance_after, note)
    VALUES (_p.host_user_id,      _placement_id, 'clawback', -_p.escrow_credits, COALESCE(_hb, 0), left(COALESCE(_reason, ''), 200)),
           (_p.requester_user_id, _placement_id, 'refund',    _p.escrow_credits, COALESCE(_rb, 0), left(COALESCE(_reason, ''), 200));
  RETURN true;
END;
$$;

-- Postgres grants EXECUTE to PUBLIC by default. Revoke, then grant precisely,
-- exactly as 20260622094818 does for the article-credit functions.
REVOKE ALL ON FUNCTION public.exchange_set_paid(uuid, boolean) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.exchange_grant_credits(uuid, timestamptz, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.exchange_reserve_placement(uuid, uuid, uuid, uuid, text, integer, numeric) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.exchange_mark_placed(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.exchange_settle_placement(uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.exchange_refund_placement(uuid, public.exchange_placement_status, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.exchange_clawback_placement(uuid, text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.exchange_set_paid(uuid, boolean) TO service_role;
GRANT EXECUTE ON FUNCTION public.exchange_grant_credits(uuid, timestamptz, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.exchange_reserve_placement(uuid, uuid, uuid, uuid, text, integer, numeric) TO service_role;
GRANT EXECUTE ON FUNCTION public.exchange_mark_placed(uuid, uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.exchange_settle_placement(uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.exchange_refund_placement(uuid, public.exchange_placement_status, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.exchange_clawback_placement(uuid, text) TO service_role;
