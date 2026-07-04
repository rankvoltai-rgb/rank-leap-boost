CREATE TABLE public.tool_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text,
  role text,
  tool text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.tool_leads TO service_role;
ALTER TABLE public.tool_leads ENABLE ROW LEVEL SECURITY;