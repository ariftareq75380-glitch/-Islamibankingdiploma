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
