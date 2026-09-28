-- Shopify blog publishing (the Rankbox app for Shopify).
--
-- The merchant installs the app from the Shopify admin. Installing is managed
-- by Shopify, so a row exists from the first time the embedded app loads,
-- holding the store's access token but no Rankbox site yet. Pasting a Rankbox
-- API key into the app links the store to that key's site. From then on,
-- every finished article is pushed into the Shopify blog the merchant picked,
-- server-side, so nobody has to have Shopify open.
--
-- Both tables are server-managed, as the Webflow ones are: nothing is reachable
-- with a user JWT, and only service_role (which bypasses RLS) touches them.

CREATE TABLE public.shopify_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- The store's permanent domain, e.g. fernwood.myshopify.com.
  shop text NOT NULL,
  -- NULL until a Rankbox API key is pasted in the app. Both or neither.
  user_id uuid,
  site_id uuid,
  -- Expiring offline token (1 hour) and its rotating refresh token (90 days),
  -- AES-256-GCM ciphertext (src/lib/webflow/crypto.ts, shopify purpose), key
  -- in the environment. NULL after uninstall, or when Shopify refused the
  -- refresh token: the next time the app is opened, token exchange replaces them.
  access_token_enc text,
  access_expires_at timestamptz,
  refresh_token_enc text,
  refresh_expires_at timestamptz,
  scope text,
  shop_name text,
  -- Host live URLs are composed on: /blogs/{blog handle}/{article handle}.
  shop_domain text,
  shopify_blog_id text,
  shopify_blog_title text,
  shopify_blog_handle text,
  -- Visible publishes articles at once; hidden adds them unpublished.
  publish_visible boolean NOT NULL DEFAULT true,
  author text,
  -- setup: installed, not linked to a site or no blog picked yet.
  -- active: publishing. error: the last publish failed (see last_error).
  -- uninstalled: tokens deleted; the row stays until shop/redact.
  status text NOT NULL DEFAULT 'setup'
    CHECK (status IN ('setup', 'active', 'error', 'uninstalled')),
  last_error text,
  last_published_at timestamptz,
  installed_at timestamptz NOT NULL DEFAULT now(),
  uninstalled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT shopify_connections_one_per_shop UNIQUE (shop),
  -- A site publishes to one store. NULLs don't collide, so unlinked stores are fine.
  CONSTRAINT shopify_connections_one_per_site UNIQUE (site_id),
  CONSTRAINT shopify_connections_site_pair CHECK ((site_id IS NULL) = (user_id IS NULL)),
  -- Deleting the Rankbox site unlinks the store (both columns go NULL); the
  -- install and its ledger stay.
  CONSTRAINT shopify_connections_site_fkey FOREIGN KEY (site_id, user_id)
    REFERENCES public.profiles (id, user_id) ON DELETE SET NULL
);

-- One row per article pushed into a Shopify blog: which article it became, the
-- handle it keeps (renaming would break the live URL), and a hash of what was
-- written so an unchanged article is never rewritten.
CREATE TABLE public.shopify_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id uuid NOT NULL REFERENCES public.shopify_connections (id) ON DELETE CASCADE,
  -- The Rankbox article (public.blogs), named as webflow_items names it.
  blog_id uuid NOT NULL REFERENCES public.blogs (id) ON DELETE CASCADE,
  shopify_blog_id text NOT NULL,
  -- '' while pending.
  shopify_article_id text NOT NULL,
  handle text NOT NULL,
  content_hash text NOT NULL,
  -- The article's updatedAt right after our last write. If Shopify reports a
  -- later one, the merchant edited it in Shopify and we leave it alone.
  shopify_updated_at text,
  is_published boolean NOT NULL DEFAULT true,
  live_url text,
  -- pending: claimed, being created right now. The unique key below turns the
  --   claim into a lock, so two runs can't both create.
  -- updating: leased by a run that is updating the article, same idea.
  -- published | hidden: in Shopify, ours to update.
  -- edited_in_shopify | deleted_in_shopify: the merchant changed it in
  --   Shopify, so it is never overwritten or re-created.
  state text NOT NULL DEFAULT 'published'
    CHECK (state IN ('pending', 'updating', 'published', 'hidden', 'edited_in_shopify', 'deleted_in_shopify')),
  locked_at timestamptz,
  last_error text,
  pushed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT shopify_articles_one_per_article UNIQUE (connection_id, shopify_blog_id, blog_id)
);

CREATE INDEX idx_shopify_articles_connection ON public.shopify_articles (connection_id, shopify_blog_id);

CREATE TRIGGER trg_shopify_connections_updated
  BEFORE UPDATE ON public.shopify_connections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.shopify_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopify_articles ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.shopify_connections FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.shopify_articles FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.shopify_connections TO service_role;
GRANT ALL ON public.shopify_articles TO service_role;

-- The restrictive OAuth-app guard every public table carries
-- (20260927023216_oauth_clients_blocked.sql), so a future grant can't open
-- these to apps connected through the OAuth server.
CREATE POLICY oauth_apps_blocked ON public.shopify_connections AS RESTRICTIVE FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) ->> 'client_id') IS NULL)
  WITH CHECK (((SELECT auth.jwt()) ->> 'client_id') IS NULL);
CREATE POLICY oauth_apps_blocked ON public.shopify_articles AS RESTRICTIVE FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) ->> 'client_id') IS NULL)
  WITH CHECK (((SELECT auth.jwt()) ->> 'client_id') IS NULL);
