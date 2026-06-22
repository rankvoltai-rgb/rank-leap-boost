ALTER TABLE public.content_settings
  ADD COLUMN IF NOT EXISTS autopilot_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS weekly_cadence integer NOT NULL DEFAULT 7,
  ADD COLUMN IF NOT EXISTS last_autopilot_run timestamp with time zone;