-- Complete Supabase Schema for Islami Banking Diploma Platform
-- Includes articles, resources, site_settings, and app_settings

CREATE TABLE IF NOT EXISTS public.articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    title_bn TEXT,
    slug TEXT NOT NULL UNIQUE,
    author TEXT,
    author_designation TEXT,
    read_time TEXT,
    category TEXT,
    category_bn TEXT,
    summary TEXT,
    summary_bn TEXT,
    content_en TEXT,
    content_bn TEXT,
    tags TEXT[],
    keywords TEXT[],
    cover_image TEXT,
    featured BOOLEAN DEFAULT false,
    pdf_url TEXT,
    status TEXT DEFAULT 'published',
    is_draft BOOLEAN DEFAULT false,
    published_date TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.resources (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    title_bn TEXT,
    subject TEXT,
    subject_bn TEXT,
    course TEXT,
    exam_year TEXT,
    exam_session TEXT,
    session_bangla TEXT,
    language TEXT,
    description TEXT,
    description_bn TEXT,
    category TEXT,
    category_bn TEXT,
    tags TEXT[],
    pdf_file_url TEXT,
    google_drive_url TEXT,
    file_size TEXT,
    page_count INTEGER,
    publication_date TEXT,
    downloads_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    is_popular BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    preview_supported BOOLEAN DEFAULT true,
    slug TEXT,
    thumbnail_url TEXT,
    keywords TEXT[],
    key_topics TEXT[],
    status TEXT DEFAULT 'published',
    is_draft BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings JSON table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- App Settings Table (Zakat Calculator & Global Rates)
CREATE TABLE IF NOT EXISTS public.app_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    nisab_amount_bdt NUMERIC NOT NULL DEFAULT 173250,
    last_updated_date TEXT NOT NULL DEFAULT '০৪/১১/২০২৬',
    gold_rate_22k_per_gram NUMERIC NOT NULL DEFAULT 11500,
    silver_rate_per_gram NUMERIC NOT NULL DEFAULT 282.85,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on app_settings"
ON public.app_settings FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated full access on app_settings"
ON public.app_settings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Public read access on resources (PDF library)
-- The public site reads the resources table as an anonymous visitor. Without
-- a public SELECT policy, anonymous queries return 0 rows, the app silently
-- falls back to the stale bundled snapshot (content.json), and newly
-- published PDFs never appear in the public PDF Library or homepage counts.
-- Added 2026-11-18: see supabase/migrations/20261118_public_read_resources.sql
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on resources"
ON public.resources FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated full access on resources"
ON public.resources FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Visitor analytics: per-article read counts + total site visits
-- One row per (article, browser session) in article_views; one row per
-- browser session in site_visits. Public INSERT + SELECT so anonymous
-- visitors can be counted. Added 2026-11-18: see
-- supabase/migrations/20261118_visitor_analytics.sql (run it in the
-- Supabase SQL Editor — committing it does not apply it).
CREATE TABLE IF NOT EXISTS public.article_views (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  article_slug TEXT NOT NULL,
  session_id TEXT NOT NULL,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (article_slug, session_id)
);

CREATE TABLE IF NOT EXISTS public.site_visits (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  first_visit_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.article_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on article_views"
ON public.article_views FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public read on article_views"
ON public.article_views FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public insert on site_visits"
ON public.site_visits FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public read on site_visits"
ON public.site_visits FOR SELECT
TO public
USING (true);
