-- Rate limiting for the public API (/api/public/v1/*). Fixed-window counters
-- keyed by an arbitrary bucket string ("ip:1.2.3.4" or "user:<uuid>"), so we
-- can bound both invalid-key/source floods (per-IP) and any one account across
-- all its keys (per-user). Locked to the service-role client only.
--
-- Until this is applied, the app code fails OPEN (no limiting), so it is safe to
-- deploy the code first and apply this migration when ready.
CREATE TABLE IF NOT EXISTS public.rate_limit_hits (
  bucket TEXT NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  hits INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (bucket, window_start)
);
GRANT ALL ON public.rate_limit_hits TO service_role;
ALTER TABLE public.rate_limit_hits ENABLE ROW LEVEL SECURITY;
-- No anon/authenticated policies: only the service-role client touches this.

CREATE OR REPLACE FUNCTION public.hit_rate_limit(
  p_bucket TEXT,
  p_window_start TIMESTAMPTZ
) RETURNS INTEGER AS $$
DECLARE
  n INTEGER;
BEGIN
  -- Opportunistic cleanup so the table stays ~1 row per active bucket.
  DELETE FROM public.rate_limit_hits
    WHERE bucket = p_bucket AND window_start < p_window_start;

  INSERT INTO public.rate_limit_hits (bucket, window_start, hits)
  VALUES (p_bucket, p_window_start, 1)
  ON CONFLICT (bucket, window_start)
  DO UPDATE SET hits = public.rate_limit_hits.hits + 1
  RETURNING hits INTO n;
  RETURN n;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.hit_rate_limit(TEXT, TIMESTAMPTZ) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.hit_rate_limit(TEXT, TIMESTAMPTZ) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.hit_rate_limit(TEXT, TIMESTAMPTZ) TO service_role;
