-- Where the CMS plugin actually published an article.
--
-- The app has never known this: plugins PULL finished articles from the public
-- API and publish them on the user's own site, and nothing reports back. The
-- backlink exchange cannot confirm a hosted link is live without the page it
-- lives on, so the URL is now recorded — reported by the plugin
-- (PATCH /api/public/v1/articles/:id), discovered from the site's sitemap by
-- the exchange cron, or pasted by hand in the dashboard.

ALTER TABLE public.blogs
  ADD COLUMN IF NOT EXISTS published_url text,
  ADD COLUMN IF NOT EXISTS published_url_source text,
  ADD COLUMN IF NOT EXISTS published_at timestamptz;

COMMENT ON COLUMN public.blogs.published_url IS
  'Live URL of this article on the user''s own site. Null until a plugin reports it, the sitemap crawl finds it, or the user pastes it.';
COMMENT ON COLUMN public.blogs.published_url_source IS
  'How published_url was learned: plugin | sitemap | manual.';

-- The exchange cron's discovery sweep: finished articles still waiting for a URL.
CREATE INDEX IF NOT EXISTS idx_blogs_unpublished_finished
  ON public.blogs (user_id, updated_at)
  WHERE status = 'finished' AND published_url IS NULL;
