-- Enums
CREATE TYPE public.blog_status AS ENUM ('opportunity', 'scheduled', 'generating', 'finished');
CREATE TYPE public.keyword_source AS ENUM ('library', 'discovered');

-- updated_at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- PROFILES
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  brand_name TEXT,
  website_url TEXT,
  product_description TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own profile" ON public.profiles FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CONTENT SETTINGS
CREATE TABLE public.content_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  tone TEXT NOT NULL DEFAULT 'Professional',
  writing_style TEXT NOT NULL DEFAULT 'Balanced',
  audience TEXT NOT NULL DEFAULT 'Founders / Entrepreneurs',
  brand_voice TEXT NOT NULL DEFAULT '',
  status_online BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_settings TO authenticated;
GRANT ALL ON public.content_settings TO service_role;
ALTER TABLE public.content_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own settings" ON public.content_settings FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON public.content_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CREDIT ACCOUNTS
CREATE TABLE public.credit_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  credits_used INTEGER NOT NULL DEFAULT 0,
  credits_total INTEGER NOT NULL DEFAULT 1000,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.credit_accounts TO authenticated;
GRANT ALL ON public.credit_accounts TO service_role;
ALTER TABLE public.credit_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own credits" ON public.credit_accounts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_credits_updated BEFORE UPDATE ON public.credit_accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CREDIT TRANSACTIONS
CREATE TABLE public.credit_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  package TEXT NOT NULL,
  credits INTEGER NOT NULL,
  amount_cents INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.credit_transactions TO authenticated;
GRANT ALL ON public.credit_transactions TO service_role;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own transactions" ON public.credit_transactions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- KEYWORDS
CREATE TABLE public.keywords (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  tag TEXT,
  search_volume INTEGER NOT NULL DEFAULT 0,
  traffic_estimate INTEGER NOT NULL DEFAULT 0,
  intent TEXT,
  trend TEXT NOT NULL DEFAULT 'Medium',
  source public.keyword_source NOT NULL DEFAULT 'discovered',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.keywords TO authenticated;
GRANT ALL ON public.keywords TO service_role;
ALTER TABLE public.keywords ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own keywords" ON public.keywords FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- BLOGS
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  status public.blog_status NOT NULL DEFAULT 'scheduled',
  tags TEXT[] NOT NULL DEFAULT '{}',
  keyword TEXT,
  seo_score INTEGER NOT NULL DEFAULT 0,
  traffic_estimate INTEGER NOT NULL DEFAULT 0,
  competition TEXT,
  ai_signal INTEGER NOT NULL DEFAULT 0,
  scheduled_date DATE,
  queue_position INTEGER,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blogs TO authenticated;
GRANT ALL ON public.blogs TO service_role;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own blogs" ON public.blogs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_blogs_updated BEFORE UPDATE ON public.blogs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_blogs_user_status ON public.blogs(user_id, status);
CREATE INDEX idx_keywords_user_source ON public.keywords(user_id, source);