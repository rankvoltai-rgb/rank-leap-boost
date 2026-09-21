-- ============================================================================
-- Reddit Presence.
--
-- Rankbox never posts to Reddit and never holds a Reddit credential. The loop
-- is: discover a thread -> draft a reply -> the MEMBER posts it themselves ->
-- they paste the permalink -> we verify and track it. There is deliberately
-- no column anywhere in this file that could hold a Reddit token.
--
-- Everything this feature says about a thread's Google position or its use by
-- an AI engine is a MEASUREMENT with a timestamp, kept in the append-only
-- tables reddit_thread_serp, reddit_thread_ai_citations and
-- reddit_thread_stats. A thread that was never checked has no row, and renders
-- as "not checked" — never as a badge, and never the same as a row that says
-- we asked and the answer was no.
--
-- Two scopes:
--   GLOBAL    reddit_subreddits, reddit_threads, reddit_thread_serp,
--             reddit_thread_ai_citations, reddit_thread_stats — a shared cache
--             of public Reddit and public SERP data. No user_id, no member
--             policy, no SELECT grant to authenticated. Sharing it is what
--             makes the scraping bill survivable (members cluster in niches
--             and hit the same threads); withholding the grant is what stops
--             one member counting what the network has looked at in a rival's
--             space. Server functions join through reddit_opportunities and
--             project only the caller's rows.
--   PER-USER  everything else. SELECT-only RLS for the owner; every mutation
--             is made with the service role, the atomic ones through SECURITY
--             DEFINER functions — the backlink exchange's posture exactly.
--
-- Paid plans only, like the exchange. reddit_settings.paid_active is the
-- denormalised flag the cron selects on, and reddit_start_sweep re-checks it
-- under a lock: the page's gate is a courtesy, the server function is the
-- rule, and that function is the thing that actually refuses to spend money.
--
-- Credits are GRANTED and SPENT, never earned. So unlike the exchange there is
-- no escrow and no clawback: a draft is produced at once or not at all, and a
-- reply a moderator removes costs the member nothing, because Rankbox did not
-- sell the outcome. Verifying a reply never moves a credit.
-- ============================================================================

CREATE TYPE public.reddit_opportunity_status
  AS ENUM ('new', 'saved', 'drafted', 'posted', 'dismissed', 'dead', 'stale');
CREATE TYPE public.reddit_reply_status
  AS ENUM ('claimed', 'posted', 'confirmed', 'removed', 'not_found');
CREATE TYPE public.reddit_ledger_kind
  AS ENUM ('grant', 'spend', 'refund', 'bonus', 'adjust');
CREATE TYPE public.reddit_sweep_status
  AS ENUM ('running', 'ok', 'partial', 'failed');
CREATE TYPE public.reddit_ai_engine
  AS ENUM ('chatgpt', 'perplexity', 'gemini', 'google_ai_overview');

-- ------------------------------------------------------- SUBREDDITS (GLOBAL)
-- The rules cache. allows_self_promo is THREE-valued on purpose: true, false,
-- and NULL meaning "we could not read the rules". NULL must never render as a
-- passing check — the UI says "rules unavailable, check the sidebar yourself".
CREATE TABLE public.reddit_subreddits (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name               text NOT NULL UNIQUE CHECK (name = lower(name) AND name !~ '/'),
  title              text NOT NULL DEFAULT '',
  public_description text NOT NULL DEFAULT '',
  subscribers        integer,
  over_18            boolean NOT NULL DEFAULT false,
  rules              jsonb NOT NULL DEFAULT '[]'::jsonb,
  rules_source       text NOT NULL DEFAULT 'unavailable'
                       CHECK (rules_source IN ('api', 'scrape', 'unavailable')),
  rules_checked_at   timestamptz,
  allows_self_promo  boolean,
  -- Set by a rule-text match on an explicit ban, or by an operator. A
  -- subreddit here is never drafted for, at any score, and a member's allow
  -- list cannot bring it back.
  promo_banned       boolean NOT NULL DEFAULT false,
  topic_tags         text[] NOT NULL DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_reddit_subreddits_stale
  ON public.reddit_subreddits (rules_checked_at NULLS FIRST);
CREATE TRIGGER update_reddit_subreddits_updated_at
  BEFORE UPDATE ON public.reddit_subreddits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------- THREADS (GLOBAL)
CREATE TABLE public.reddit_threads (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Reddit's own post id (the "abc123" in /comments/abc123/). The dedupe key
  -- for the union of the SERP channel and the Reddit-search channel.
  reddit_id        text NOT NULL UNIQUE CHECK (reddit_id ~ '^[a-z0-9]{2,12}$'),
  subreddit        text NOT NULL CHECK (subreddit = lower(subreddit)),
  permalink        text NOT NULL CHECK (permalink ~ '^https://www\.reddit\.com/'),
  title            text NOT NULL DEFAULT '',
  body             text NOT NULL DEFAULT '',
  author           text NOT NULL DEFAULT '',
  up_votes         integer NOT NULL DEFAULT 0,
  num_comments     integer NOT NULL DEFAULT 0,
  posted_at        timestamptz,
  is_locked        boolean NOT NULL DEFAULT false,
  -- NULLABLE on purpose. Reddit archives at about six months by default, but
  -- subreddits can switch that off, so "the scraper did not say" is not the
  -- same as false. NULL makes the scorer fall back to the age heuristic and
  -- call the result "likely archived" — we do not claim to know what we
  -- inferred. A scraped true OR false always wins over the heuristic.
  is_archived      boolean,
  is_removed       boolean NOT NULL DEFAULT false,
  -- A few top comments, for the draft prompt's context. Capped in the writer.
  top_comments     jsonb NOT NULL DEFAULT '[]'::jsonb,
  -- NULL = found in a SERP but never loaded from Reddit. Engagement is then
  -- ABSENT, not zero, and the UI says "not fully loaded yet".
  hydrated_at      timestamptz,
  hydration_source text NOT NULL DEFAULT '',
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_reddit_threads_subreddit ON public.reddit_threads (subreddit);
CREATE INDEX idx_reddit_threads_stale     ON public.reddit_threads (hydrated_at NULLS FIRST);
CREATE TRIGGER update_reddit_threads_updated_at
  BEFORE UPDATE ON public.reddit_threads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ------------------------------------------------- SERP MEASUREMENTS (GLOBAL)
-- Append-only. The latest row is what the UI shows, WITH its date and locale:
-- a position is only true for the query, place, device and moment it was
-- taken in, so all four travel with the number.
CREATE TABLE public.reddit_thread_serp (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id  uuid NOT NULL REFERENCES public.reddit_threads(id) ON DELETE CASCADE,
  query      text NOT NULL,
  position   smallint NOT NULL CHECK (position BETWEEN 1 AND 100),
  country    text NOT NULL DEFAULT 'us',
  device     text NOT NULL DEFAULT 'desktop',
  checked_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_reddit_thread_serp_latest
  ON public.reddit_thread_serp (thread_id, checked_at DESC);

-- ------------------------------------------- AI ANSWER MEASUREMENTS (GLOBAL)
-- A row with cited = false is the point of this table: it is the record that
-- we ASKED and the engine did not cite the thread. No row at all means "not
-- checked", which is a different fact about our own work.
CREATE TABLE public.reddit_thread_ai_citations (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id  uuid NOT NULL REFERENCES public.reddit_threads(id) ON DELETE CASCADE,
  query      text NOT NULL,
  engine     public.reddit_ai_engine NOT NULL,
  cited      boolean NOT NULL,
  snippet    text NOT NULL DEFAULT '',
  checked_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_reddit_ai_citations_thread
  ON public.reddit_thread_ai_citations (thread_id, engine, checked_at DESC);

-- ---------------------------------------------- ACTIVITY MEASUREMENTS (GLOBAL)
-- Append-only. Votes and comments each time we re-measured a thread that has a
-- live reply in it. The Mentions chart is drawn from this and from nothing
-- else — there is no projected line. Note what is NOT here: views. Reddit
-- shows a thread's view count to nobody but its author, so it is not a number
-- we can ever have.
CREATE TABLE public.reddit_thread_stats (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id    uuid NOT NULL REFERENCES public.reddit_threads(id) ON DELETE CASCADE,
  up_votes     integer NOT NULL,
  num_comments integer NOT NULL,
  checked_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_reddit_thread_stats_series
  ON public.reddit_thread_stats (thread_id, checked_at);

-- ------------------------------------------------------- SETTINGS (PER-USER)
CREATE TABLE public.reddit_settings (
  user_id             uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Whether the member has switched the feature on. Also how a lapsed member
  -- (history kept, read-only) is told from someone who never started.
  enabled             boolean NOT NULL DEFAULT false,
  sweep_enabled       boolean NOT NULL DEFAULT true,
  -- The denormalised paid gate. Written by the Stripe webhook and re-synced
  -- by the cron. Server functions check the subscription itself, not this.
  paid_active         boolean NOT NULL DEFAULT false,
  paid_checked_at     timestamptz,
  niche               text,
  topic_tags          text[] NOT NULL DEFAULT '{}',
  -- Mandatory. There is no way to switch it off, and the length floor here is
  -- the last line behind the server-side check that it names the brand: the
  -- compliance checker validates drafts against a string the member controls,
  -- so a line of "." would make the mandatory check meaningless.
  disclosure_line     text NOT NULL DEFAULT 'Full disclosure: I work on {brand}.'
                        CHECK (char_length(btrim(disclosure_line)) BETWEEN 10 AND 200),
  tone                text NOT NULL DEFAULT 'plain',
  max_links_per_reply smallint NOT NULL DEFAULT 1 CHECK (max_links_per_reply BETWEEN 0 AND 1),
  allow_subreddits    text[] NOT NULL DEFAULT '{}',
  deny_subreddits     text[] NOT NULL DEFAULT '{}',
  keywords_per_sweep  smallint NOT NULL DEFAULT 12 CHECK (keywords_per_sweep BETWEEN 1 AND 30),
  last_sweep_at       timestamptz,
  sweep_count         integer NOT NULL DEFAULT 0,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_reddit_settings_due
  ON public.reddit_settings (last_sweep_at NULLS FIRST)
  WHERE paid_active AND enabled AND sweep_enabled;
CREATE TRIGGER update_reddit_settings_updated_at
  BEFORE UPDATE ON public.reddit_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- --------------------------------------------------------- SWEEPS (PER-USER)
-- One row per discovery run: what it asked, what it found, what it cost.
-- cost_usd is the cost-control surface the cron adds up. It is an internal
-- figure and is never projected to a member.
CREATE TABLE public.reddit_sweeps (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status                public.reddit_sweep_status NOT NULL DEFAULT 'running',
  trigger               text NOT NULL DEFAULT 'cron' CHECK (trigger IN ('cron', 'manual')),
  keywords_used         text[] NOT NULL DEFAULT '{}',
  serp_queries          integer NOT NULL DEFAULT 0,
  reddit_queries        integer NOT NULL DEFAULT 0,
  ai_checks             integer NOT NULL DEFAULT 0,
  threads_seen          integer NOT NULL DEFAULT 0,
  opportunities_created integer NOT NULL DEFAULT 0,
  cost_usd              numeric(8,4) NOT NULL DEFAULT 0,
  error                 text NOT NULL DEFAULT '',
  started_at            timestamptz NOT NULL DEFAULT now(),
  finished_at           timestamptz
);
CREATE INDEX idx_reddit_sweeps_user ON public.reddit_sweeps (user_id, started_at DESC);
CREATE INDEX idx_reddit_sweeps_cost ON public.reddit_sweeps (started_at DESC);
-- At most one sweep in flight per member. reddit_start_sweep is the braces;
-- this is the belt.
CREATE UNIQUE INDEX reddit_sweeps_one_running
  ON public.reddit_sweeps (user_id) WHERE status = 'running';

-- -------------------------------------------------- OPPORTUNITIES (PER-USER)
CREATE TABLE public.reddit_opportunities (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  thread_id       uuid NOT NULL REFERENCES public.reddit_threads(id) ON DELETE CASCADE,
  sweep_id        uuid REFERENCES public.reddit_sweeps(id) ON DELETE SET NULL,
  matched_keyword text NOT NULL DEFAULT '',
  channel         text NOT NULL DEFAULT 'search' CHECK (channel IN ('serp', 'search', 'both')),
  status          public.reddit_opportunity_status NOT NULL DEFAULT 'new',
  score           numeric(6,3) NOT NULL DEFAULT 0,
  -- Every term of the score, so the detail panel can show its work rather
  -- than a bare number. Mirrors ScoreBreakdown in src/lib/reddit/scoring.ts.
  breakdown       jsonb NOT NULL DEFAULT '{}'::jsonb,
  -- Why this cannot be acted on, if it cannot. Surfaced verbatim in the
  -- Blocked filter — a thread is set aside in the open, never silently dropped.
  blocked_reason  text CHECK (blocked_reason IS NULL OR blocked_reason IN
                    ('archived', 'likely_archived', 'locked', 'removed',
                     'subreddit_denied', 'promo_banned', 'off_topic')),
  dismiss_reason  text NOT NULL DEFAULT '',
  first_seen_at   timestamptz NOT NULL DEFAULT now(),
  last_scored_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, thread_id)
);
CREATE INDEX idx_reddit_opps_user_rank
  ON public.reddit_opportunities (user_id, status, score DESC);
CREATE INDEX idx_reddit_opps_rescore
  ON public.reddit_opportunities (last_scored_at) WHERE status IN ('new', 'saved', 'drafted');

-- --------------------------------------------------------- DRAFTS (PER-USER)
CREATE TABLE public.reddit_drafts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id  uuid NOT NULL REFERENCES public.reddit_opportunities(id) ON DELETE CASCADE,
  body            text NOT NULL,
  -- What the member edited it to, if they did. What they copy is
  -- edited_body ?? body, and `compliance` always refers to that.
  edited_body     text,
  model           text NOT NULL DEFAULT '',
  compliance      jsonb NOT NULL DEFAULT '{}'::jsonb,
  compliance_pass boolean NOT NULL DEFAULT false,
  credits_spent   smallint NOT NULL DEFAULT 1,
  -- A hard ceiling, so one bad thread cannot drain a balance.
  regen_count     smallint NOT NULL DEFAULT 0 CHECK (regen_count BETWEEN 0 AND 3),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_reddit_drafts_opp ON public.reddit_drafts (opportunity_id, created_at DESC);
CREATE TRIGGER update_reddit_drafts_updated_at
  BEFORE UPDATE ON public.reddit_drafts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- -------------------------------------------------------- REPLIES (PER-USER)
-- What the member actually posted, by their own hand, under their own account.
--   claimed    they said they posted but gave no permalink. Unverifiable, and
--              labelled so. NEVER counted in anything presented as measured.
--   posted     a permalink was given; not yet confirmed by a check
--   confirmed  the comment was found at that permalink
--   removed    it was found and then disappeared, or the body reads [removed]
--   not_found  three checks in a row could not find it
CREATE TABLE public.reddit_replies (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id       uuid NOT NULL REFERENCES public.reddit_opportunities(id) ON DELETE CASCADE,
  thread_id            uuid NOT NULL REFERENCES public.reddit_threads(id) ON DELETE CASCADE,
  draft_id             uuid REFERENCES public.reddit_drafts(id) ON DELETE SET NULL,
  permalink            text CHECK (permalink IS NULL OR permalink ~ '^https://www\.reddit\.com/'),
  reddit_comment_id    text,
  status               public.reddit_reply_status NOT NULL DEFAULT 'claimed',
  score                integer,
  posted_at            timestamptz NOT NULL DEFAULT now(),
  confirmed_at         timestamptz,
  removed_at           timestamptz,
  last_checked_at      timestamptz,
  consecutive_failures smallint NOT NULL DEFAULT 0,
  -- A claim cannot carry a link, and anything past a claim must have one.
  CONSTRAINT reddit_reply_link_matches_status
    CHECK ((status = 'claimed') = (permalink IS NULL))
);
-- One reply per thread per member, while it stands. This is an anti-spam rule
-- as much as a data rule, so it lives in the schema.
CREATE UNIQUE INDEX reddit_replies_one_per_thread
  ON public.reddit_replies (user_id, thread_id)
  WHERE status IN ('claimed', 'posted', 'confirmed');
CREATE INDEX idx_reddit_replies_verify
  ON public.reddit_replies (status, last_checked_at NULLS FIRST);
CREATE INDEX idx_reddit_replies_user ON public.reddit_replies (user_id, posted_at DESC);

CREATE TABLE public.reddit_reply_checks (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reply_id   uuid NOT NULL REFERENCES public.reddit_replies(id) ON DELETE CASCADE,
  checked_at timestamptz NOT NULL DEFAULT now(),
  outcome    text NOT NULL
               CHECK (outcome IN ('found', 'missing', 'removed', 'unreachable', 'blocked')),
  score      integer,
  detail     text NOT NULL DEFAULT ''
);
CREATE INDEX idx_reddit_reply_checks_reply
  ON public.reddit_reply_checks (reply_id, checked_at DESC);

-- ------------------------------------------------ CREDIT ACCOUNT + LEDGER ----
CREATE TABLE public.reddit_credit_accounts (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  balance        integer NOT NULL DEFAULT 0 CHECK (balance >= 0),
  lifetime_spent integer NOT NULL DEFAULT 0,
  period_end     timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER update_reddit_credit_accounts_updated_at
  BEFORE UPDATE ON public.reddit_credit_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.reddit_ledger (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  draft_id      uuid REFERENCES public.reddit_drafts(id) ON DELETE SET NULL,
  kind          public.reddit_ledger_kind NOT NULL,
  credits       integer NOT NULL,          -- signed
  balance_after integer NOT NULL,
  note          text NOT NULL DEFAULT '',
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_reddit_ledger_user ON public.reddit_ledger (user_id, created_at DESC);

-- ================================================================ PRIVILEGES ==
ALTER TABLE public.reddit_subreddits          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reddit_threads             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reddit_thread_serp         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reddit_thread_ai_citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reddit_thread_stats        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reddit_settings            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reddit_sweeps              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reddit_opportunities       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reddit_drafts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reddit_replies             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reddit_reply_checks        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reddit_credit_accounts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reddit_ledger              ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.reddit_subreddits, public.reddit_threads, public.reddit_thread_serp,
              public.reddit_thread_ai_citations, public.reddit_thread_stats,
              public.reddit_settings, public.reddit_sweeps, public.reddit_opportunities,
              public.reddit_drafts, public.reddit_replies, public.reddit_reply_checks,
              public.reddit_credit_accounts, public.reddit_ledger
  FROM PUBLIC, anon, authenticated;

-- The five GLOBAL tables, reddit_sweeps (it carries cost_usd) and
-- reddit_reply_checks get NO grant and NO policy: members cannot read them at
-- all, directly. Everything a member may see of them arrives projected by a
-- server function.
GRANT SELECT ON public.reddit_settings, public.reddit_opportunities, public.reddit_drafts,
                public.reddit_replies, public.reddit_credit_accounts, public.reddit_ledger
  TO authenticated;

GRANT ALL ON public.reddit_subreddits, public.reddit_threads, public.reddit_thread_serp,
             public.reddit_thread_ai_citations, public.reddit_thread_stats,
             public.reddit_settings, public.reddit_sweeps, public.reddit_opportunities,
             public.reddit_drafts, public.reddit_replies, public.reddit_reply_checks,
             public.reddit_credit_accounts, public.reddit_ledger
  TO service_role;

CREATE POLICY "Users can view own reddit settings"
  ON public.reddit_settings FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view own reddit opportunities"
  ON public.reddit_opportunities FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view own reddit drafts"
  ON public.reddit_drafts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view own reddit replies"
  ON public.reddit_replies FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view own reddit credits"
  ON public.reddit_credit_accounts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view own reddit ledger"
  ON public.reddit_ledger FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ================================================================ FUNCTIONS ==
-- All SECURITY DEFINER, service_role only. Lock order everywhere is
--   settings -> sweep -> opportunity -> reply -> credit account
-- so two of these running at once cannot deadlock.

-- The paid gate's one write path. Called by the Stripe webhook on every
-- subscription event and by the cron's re-sync. Creates the settings row if
-- there isn't one, so the flag is already right on the day a member switches
-- the feature on. Touches nothing else: a lapsed member keeps their history
-- and their held credits, and everything resumes the moment they pay again.
CREATE OR REPLACE FUNCTION public.reddit_set_paid(_user_id uuid, _paid boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.reddit_settings (user_id, paid_active, paid_checked_at)
    VALUES (_user_id, _paid, now())
  ON CONFLICT (user_id) DO UPDATE
    SET paid_active = EXCLUDED.paid_active, paid_checked_at = now();
END;
$$;

-- Monthly grant. A RESET, like reset_article_credits and unlike
-- exchange_grant_credits: nothing here is earned, so nothing has to survive a
-- billing boundary, and an unused month does not bank. No-ops unless the
-- period actually advanced, so the webhook may call it on every event.
-- Returns the new balance, or NULL when nothing changed.
CREATE OR REPLACE FUNCTION public.reddit_grant_credits(
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
BEGIN
  IF _credits IS NULL OR _credits <= 0 THEN RETURN NULL; END IF;

  INSERT INTO public.reddit_credit_accounts (user_id, balance, period_end)
    VALUES (_user_id, 0, NULL)
  ON CONFLICT (user_id) DO NOTHING
  RETURNING id INTO _created;

  SELECT balance, period_end INTO _acct
    FROM public.reddit_credit_accounts
   WHERE user_id = _user_id
   FOR UPDATE;

  IF _created IS NULL AND _acct.period_end IS NOT DISTINCT FROM _period_end THEN
    RETURN NULL;
  END IF;

  UPDATE public.reddit_credit_accounts
     SET balance = _credits, period_end = _period_end
   WHERE user_id = _user_id;

  INSERT INTO public.reddit_ledger (user_id, kind, credits, balance_after, note)
    VALUES (_user_id, 'grant', _credits - _acct.balance, _credits, 'monthly plan grant');
  RETURN _credits;
END;
$$;

-- Spend. The check and the decrement are ONE statement, so two drafts started
-- at the same instant cannot both pass a balance check and overdraw. NULL
-- means "not enough credits" — a normal outcome, not an error.
CREATE OR REPLACE FUNCTION public.reddit_spend_credit(
  _user_id uuid,
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
  _bal integer;
BEGIN
  IF _amount IS NULL OR _amount <= 0 THEN RETURN NULL; END IF;

  UPDATE public.reddit_credit_accounts
     SET balance = balance - _amount, lifetime_spent = lifetime_spent + _amount
   WHERE user_id = _user_id AND balance >= _amount
  RETURNING balance INTO _bal;

  IF _bal IS NULL THEN RETURN NULL; END IF;

  INSERT INTO public.reddit_ledger (user_id, draft_id, kind, credits, balance_after, note)
    VALUES (_user_id, _draft_id, 'spend', -_amount, _bal, COALESCE(_note, ''));
  RETURN _bal;
END;
$$;

-- Refund, for when the model call fails AFTER the spend. Returns the new
-- balance, or NULL if the member has no account (which would be a bug).
CREATE OR REPLACE FUNCTION public.reddit_refund_credit(
  _user_id uuid,
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
  _bal integer;
BEGIN
  IF _amount IS NULL OR _amount <= 0 THEN RETURN NULL; END IF;

  UPDATE public.reddit_credit_accounts
     SET balance = balance + _amount,
         lifetime_spent = GREATEST(0, lifetime_spent - _amount)
   WHERE user_id = _user_id
  RETURNING balance INTO _bal;

  IF _bal IS NULL THEN RETURN NULL; END IF;

  INSERT INTO public.reddit_ledger (user_id, draft_id, kind, credits, balance_after, note)
    VALUES (_user_id, _draft_id, 'refund', _amount, _bal, COALESCE(_note, ''));
  RETURN _bal;
END;
$$;

-- Start a sweep. This function — not the page, not the server function — is
-- the authority on whether money may be spent: it re-checks paid_active under
-- a lock. Returns {"sweep_id": uuid} or {"reason": text}; a refusal is a
-- normal outcome.
--
-- It also reaps its own dead. A sweep that crashed mid-run would otherwise sit
-- at 'running' for ever and, through reddit_sweeps_one_running, quietly block
-- every future sweep for that member. Anything still running after 30 minutes
-- did not survive (Apify's own ceiling is five), so it is marked failed here.
CREATE OR REPLACE FUNCTION public.reddit_start_sweep(
  _user_id uuid,
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
  SELECT * INTO _s FROM public.reddit_settings WHERE user_id = _user_id FOR UPDATE;

  IF NOT FOUND OR NOT _s.enabled THEN RETURN jsonb_build_object('reason', 'not_enabled'); END IF;
  IF NOT _s.paid_active THEN RETURN jsonb_build_object('reason', 'not_paid'); END IF;

  UPDATE public.reddit_sweeps
     SET status = 'failed', finished_at = now(), error = 'abandoned: no result within 30 minutes'
   WHERE user_id = _user_id AND status = 'running' AND started_at < now() - interval '30 minutes';

  IF EXISTS (SELECT 1 FROM public.reddit_sweeps WHERE user_id = _user_id AND status = 'running') THEN
    RETURN jsonb_build_object('reason', 'already_running');
  END IF;

  IF _s.last_sweep_at IS NOT NULL AND _min_interval IS NOT NULL
     AND _s.last_sweep_at > now() - _min_interval THEN
    RETURN jsonb_build_object('reason', 'too_soon');
  END IF;

  INSERT INTO public.reddit_sweeps (user_id, trigger, keywords_used)
    VALUES (_user_id, COALESCE(_trigger, 'cron'), COALESCE(_keywords, '{}'))
  RETURNING id INTO _id;

  UPDATE public.reddit_settings
     SET last_sweep_at = now(), sweep_count = sweep_count + 1
   WHERE user_id = _user_id;

  RETURN jsonb_build_object('sweep_id', _id);
END;
$$;

-- Upsert a thread, idempotent on reddit_id. Only fields PRESENT in the payload
-- are written, so a SERP-only insert (title and permalink, nothing else) is
-- not blanked by a later partial payload, and a full hydration is not undone
-- by a SERP sighting the following week.
CREATE OR REPLACE FUNCTION public.reddit_upsert_thread(_payload jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _id uuid;
BEGIN
  INSERT INTO public.reddit_threads (
    reddit_id, subreddit, permalink, title, body, author, up_votes, num_comments,
    posted_at, is_locked, is_archived, is_removed, top_comments, hydrated_at, hydration_source
  ) VALUES (
    lower(_payload->>'reddit_id'),
    lower(_payload->>'subreddit'),
    _payload->>'permalink',
    COALESCE(_payload->>'title', ''),
    COALESCE(_payload->>'body', ''),
    COALESCE(_payload->>'author', ''),
    COALESCE((_payload->>'up_votes')::integer, 0),
    COALESCE((_payload->>'num_comments')::integer, 0),
    (_payload->>'posted_at')::timestamptz,
    COALESCE((_payload->>'is_locked')::boolean, false),
    (_payload->>'is_archived')::boolean,
    COALESCE((_payload->>'is_removed')::boolean, false),
    COALESCE(_payload->'top_comments', '[]'::jsonb),
    (_payload->>'hydrated_at')::timestamptz,
    COALESCE(_payload->>'hydration_source', '')
  )
  ON CONFLICT (reddit_id) DO UPDATE SET
    title            = CASE WHEN _payload ? 'title'        AND _payload->>'title' <> '' THEN EXCLUDED.title        ELSE public.reddit_threads.title END,
    body             = CASE WHEN _payload ? 'body'         THEN EXCLUDED.body         ELSE public.reddit_threads.body END,
    author           = CASE WHEN _payload ? 'author'       THEN EXCLUDED.author       ELSE public.reddit_threads.author END,
    up_votes         = CASE WHEN _payload ? 'up_votes'     THEN EXCLUDED.up_votes     ELSE public.reddit_threads.up_votes END,
    num_comments     = CASE WHEN _payload ? 'num_comments' THEN EXCLUDED.num_comments ELSE public.reddit_threads.num_comments END,
    posted_at        = CASE WHEN _payload ? 'posted_at'    THEN EXCLUDED.posted_at    ELSE public.reddit_threads.posted_at END,
    is_locked        = CASE WHEN _payload ? 'is_locked'    THEN EXCLUDED.is_locked    ELSE public.reddit_threads.is_locked END,
    is_archived      = CASE WHEN _payload ? 'is_archived'  THEN EXCLUDED.is_archived  ELSE public.reddit_threads.is_archived END,
    is_removed       = CASE WHEN _payload ? 'is_removed'   THEN EXCLUDED.is_removed   ELSE public.reddit_threads.is_removed END,
    top_comments     = CASE WHEN _payload ? 'top_comments' THEN EXCLUDED.top_comments ELSE public.reddit_threads.top_comments END,
    hydrated_at      = CASE WHEN _payload ? 'hydrated_at'  THEN EXCLUDED.hydrated_at  ELSE public.reddit_threads.hydrated_at END,
    hydration_source = CASE WHEN _payload ? 'hydration_source' THEN EXCLUDED.hydration_source ELSE public.reddit_threads.hydration_source END
  RETURNING id INTO _id;
  RETURN _id;
END;
$$;

-- Upsert an opportunity. Re-scoring never drags a status backwards: a thread
-- the member replied in stays 'posted' and one they dismissed stays dismissed,
-- whatever the next sweep thinks of it. A thread that can no longer be replied
-- to goes 'dead'; one that comes back (a lock lifted) returns to 'new'.
CREATE OR REPLACE FUNCTION public.reddit_upsert_opportunity(
  _user_id uuid,
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
  _id uuid;
  _inserted boolean;
BEGIN
  INSERT INTO public.reddit_opportunities (
    user_id, thread_id, sweep_id, matched_keyword, channel, status, score, breakdown, blocked_reason
  ) VALUES (
    _user_id, _thread_id, _sweep_id, COALESCE(_keyword, ''), COALESCE(_channel, 'search'),
    CASE WHEN _dead THEN 'dead'::public.reddit_opportunity_status
         ELSE 'new'::public.reddit_opportunity_status END,
    _score, COALESCE(_breakdown, '{}'::jsonb), _blocked_reason
  )
  ON CONFLICT (user_id, thread_id) DO UPDATE SET
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

-- Record that the member posted. One transaction: the reply row and the
-- opportunity's status move together. A bare claim can later be upgraded with
-- a link, which is the only path from 'claimed' to anything we can check.
-- NULL means a standing reply already exists in this thread.
CREATE OR REPLACE FUNCTION public.reddit_record_reply(
  _user_id uuid,
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
   WHERE id = _opportunity_id AND user_id = _user_id FOR UPDATE;
  IF NOT FOUND THEN RETURN NULL; END IF;

  SELECT * INTO _existing FROM public.reddit_replies
   WHERE user_id = _user_id AND thread_id = _opp.thread_id
     AND status IN ('claimed', 'posted', 'confirmed')
   FOR UPDATE;

  IF FOUND THEN
    IF _existing.status = 'claimed' AND _permalink IS NOT NULL THEN
      UPDATE public.reddit_replies
         SET permalink = _permalink, reddit_comment_id = _comment_id,
             status = 'posted', consecutive_failures = 0
       WHERE id = _existing.id;
      RETURN _existing.id;
    END IF;
    RETURN NULL;
  END IF;

  INSERT INTO public.reddit_replies (
    user_id, opportunity_id, thread_id, draft_id, permalink, reddit_comment_id, status
  ) VALUES (
    _user_id, _opportunity_id, _opp.thread_id, _draft_id, _permalink, _comment_id,
    CASE WHEN _permalink IS NULL THEN 'claimed'::public.reddit_reply_status
         ELSE 'posted'::public.reddit_reply_status END
  )
  RETURNING id INTO _id;

  UPDATE public.reddit_opportunities SET status = 'posted' WHERE id = _opportunity_id;
  RETURN _id;
END;
$$;

-- Apply one verification check. Writes the audit row every time, then moves
-- the status: found -> confirmed; a removed body -> removed at once; three
-- misses in a row -> not_found. 'unreachable' and 'blocked' are OUR failure to
-- look, not evidence about the comment, so they change nothing but the clock.
-- This function moves no credits, at any outcome, ever.
CREATE OR REPLACE FUNCTION public.reddit_apply_reply_check(
  _reply_id uuid,
  _outcome text,
  _score integer,
  _detail text
)
RETURNS public.reddit_reply_status
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _r record;
  _next public.reddit_reply_status;
  _fails smallint;
BEGIN
  SELECT * INTO _r FROM public.reddit_replies WHERE id = _reply_id FOR UPDATE;
  IF NOT FOUND THEN RETURN NULL; END IF;

  INSERT INTO public.reddit_reply_checks (reply_id, outcome, score, detail)
    VALUES (_reply_id, _outcome, _score, COALESCE(_detail, ''));

  _next := _r.status;
  _fails := _r.consecutive_failures;

  IF _r.status IN ('posted', 'confirmed') THEN
    IF _outcome = 'found' THEN
      _next := 'confirmed'; _fails := 0;
    ELSIF _outcome = 'removed' THEN
      _next := 'removed';
    ELSIF _outcome = 'missing' THEN
      _fails := _fails + 1;
      IF _fails >= 3 THEN _next := 'not_found'; END IF;
    END IF;
  END IF;

  UPDATE public.reddit_replies SET
    status               = _next,
    consecutive_failures = _fails,
    last_checked_at      = now(),
    score                = CASE WHEN _outcome = 'found' THEN COALESCE(_score, score) ELSE score END,
    confirmed_at         = CASE WHEN _next = 'confirmed' THEN COALESCE(confirmed_at, now()) ELSE confirmed_at END,
    removed_at           = CASE WHEN _next = 'removed' THEN COALESCE(removed_at, now()) ELSE removed_at END
  WHERE id = _reply_id;

  RETURN _next;
END;
$$;

REVOKE ALL ON FUNCTION public.reddit_set_paid(uuid, boolean) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.reddit_grant_credits(uuid, timestamptz, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.reddit_spend_credit(uuid, integer, uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.reddit_refund_credit(uuid, integer, uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.reddit_start_sweep(uuid, text[], text, interval) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.reddit_upsert_thread(jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.reddit_upsert_opportunity(uuid, uuid, uuid, text, text, numeric, jsonb, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.reddit_record_reply(uuid, uuid, uuid, text, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.reddit_apply_reply_check(uuid, text, integer, text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.reddit_set_paid(uuid, boolean) TO service_role;
GRANT EXECUTE ON FUNCTION public.reddit_grant_credits(uuid, timestamptz, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.reddit_spend_credit(uuid, integer, uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.reddit_refund_credit(uuid, integer, uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.reddit_start_sweep(uuid, text[], text, interval) TO service_role;
GRANT EXECUTE ON FUNCTION public.reddit_upsert_thread(jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.reddit_upsert_opportunity(uuid, uuid, uuid, text, text, numeric, jsonb, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.reddit_record_reply(uuid, uuid, uuid, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.reddit_apply_reply_check(uuid, text, integer, text) TO service_role;
