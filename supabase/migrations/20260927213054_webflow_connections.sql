-- Webflow CMS publishing (the Webflow Data Client app).
--
-- A Rankbox site connects to one Webflow site + collection through Webflow
-- OAuth. From then on, every finished article is pushed into that collection
-- server-side: autopilot does it the moment an article is written, so nobody
-- has to have Webflow open.
--
-- Both tables are server-managed. The browser never reads them directly: it
-- goes through server functions that check ownership and never return the
-- token. So authenticated gets no grants at all, and only service_role (which
-- bypasses RLS) can touch them.

CREATE TABLE public.webflow_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  site_id uuid NOT NULL,
  -- AES-256-GCM ciphertext (src/lib/webflow/crypto.ts), key in the
  -- environment. Never plaintext: Webflow's Marketplace review requires an
  -- attestation that the token is encrypted at rest and deleted on revoke.
  -- NULL once revoked or disconnected. The row itself stays, so the item
  -- ledger survives and reconnecting never duplicates published items.
  access_token_enc text,
  scope text,
  webflow_site_id text,
  webflow_site_name text,
  -- Host live URLs are composed on: /{collection_slug}/{item slug}.
  webflow_domain text,
  collection_id text,
  collection_name text,
  collection_slug text,
  -- { body, summary, tags, publishedAt } -> Webflow field slugs.
  field_map jsonb NOT NULL DEFAULT '{}'::jsonb,
  summary_is_rich boolean NOT NULL DEFAULT false,
  publish_mode text NOT NULL DEFAULT 'live' CHECK (publish_mode IN ('live', 'draft')),
  -- setup: authorized, collection not mapped yet. active: publishing.
  -- error: the last publish failed in a way the user must fix (see last_error).
  -- disconnected: token deleted (by the user, or Webflow revoked it).
  status text NOT NULL DEFAULT 'setup'
    CHECK (status IN ('setup', 'active', 'error', 'disconnected')),
  last_error text,
  last_published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT webflow_connections_one_per_site UNIQUE (site_id),
  CONSTRAINT webflow_connections_site_fkey FOREIGN KEY (site_id, user_id)
    REFERENCES public.profiles (id, user_id) ON DELETE CASCADE
);

-- One row per article pushed into a collection: which item it became, the
-- slug it keeps (renaming would break the live URL), and a hash of what was
-- written so an unchanged article is never rewritten.
CREATE TABLE public.webflow_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id uuid NOT NULL REFERENCES public.webflow_connections (id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  blog_id uuid NOT NULL REFERENCES public.blogs (id) ON DELETE CASCADE,
  collection_id text NOT NULL,
  item_id text NOT NULL,
  slug text NOT NULL,
  content_hash text NOT NULL,
  -- The item's lastUpdated right after our last write. If Webflow reports a
  -- later one, someone edited the item in Webflow and we leave it alone.
  webflow_updated_at text,
  is_draft boolean NOT NULL DEFAULT false,
  live_url text,
  -- pending: claimed, being created right now (item_id still ''). The unique
  --   key below turns the claim into a lock, so two runs can't both create.
  -- updating: leased by a run that is updating the item, same idea.
  -- published | draft: in Webflow, ours to update.
  -- edited_in_webflow | deleted_in_webflow: someone changed it in Webflow;
  --   Webflow is the source of truth, so it is never overwritten or re-created.
  state text NOT NULL DEFAULT 'published'
    CHECK (state IN ('pending', 'updating', 'published', 'draft', 'edited_in_webflow', 'deleted_in_webflow')),
  -- When a pending/updating lock was taken. Older than a few minutes means
  -- the run holding it died, and the next run may take over.
  locked_at timestamptz,
  last_error text,
  pushed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT webflow_items_one_per_article UNIQUE (connection_id, collection_id, blog_id)
);

CREATE INDEX idx_webflow_items_connection ON public.webflow_items (connection_id, collection_id);

CREATE TRIGGER trg_webflow_connections_updated
  BEFORE UPDATE ON public.webflow_connections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.webflow_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webflow_items ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.webflow_connections FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.webflow_items FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.webflow_connections TO service_role;
GRANT ALL ON public.webflow_items TO service_role;

-- No permissive policies: nothing is reachable with a user JWT. The
-- restrictive OAuth-app guard is added anyway, as it is on every public table
-- (20260927023216_oauth_clients_blocked.sql), so a future grant can't open
-- these to apps connected through the OAuth server.
CREATE POLICY oauth_apps_blocked ON public.webflow_connections AS RESTRICTIVE FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) ->> 'client_id') IS NULL)
  WITH CHECK (((SELECT auth.jwt()) ->> 'client_id') IS NULL);
CREATE POLICY oauth_apps_blocked ON public.webflow_items AS RESTRICTIVE FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) ->> 'client_id') IS NULL)
  WITH CHECK (((SELECT auth.jwt()) ->> 'client_id') IS NULL);
