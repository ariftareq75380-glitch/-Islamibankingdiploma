-- Migration: Visitor analytics — per-article read counts + total site visits
-- Date: 2026-11-18
--
-- WHAT THIS ADDS
--   * public.article_views — one row per (article, browser session). The app
--     inserts a row the first time a session opens an article, so the count
--     of rows per slug is the article's real read count. Refreshes in the
--     same session do not add rows (UNIQUE + a sessionStorage guard in code).
--   * public.site_visits — one row per browser session (first visit only),
--     so the row count is the site's total visitor count.
--   * Public INSERT + SELECT policies on both tables so anonymous visitors
--     can be counted and can read the totals. No personal data is stored —
--     only a random per-session id (sessionStorage) and timestamps.
--
-- HOW TO APPLY (one-time, ~30 seconds)
--   1. Open the Supabase Dashboard for this project -> SQL Editor.
--   2. Paste this file's contents and press Run.
-- No code change or redeploy is needed for this migration to take effect;
-- the next page load will start counting. Until it is applied, the site
-- code fails silently and simply hides the counts (no wrong numbers shown).
-- NOTE: Committing this file alone does NOT apply it — it must be run in
-- the Supabase SQL Editor (or via `supabase db push` from a linked project).
--
-- NOTE ON THE OLD PDF NUMBERS: the downloads/views figures shown on PDF
-- cards (e.g. "1842 ডাউনলোড · 4290 বার পড়া হয়েছে") are static seed
-- values baked into the bundled content and the Supabase `resources` rows;
-- nothing in the app ever increments them. This migration does NOT make
-- those numbers real. Real per-article counts use the tables below; the
-- PDF cards keep showing their existing figures unchanged.

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

DROP POLICY IF EXISTS "Allow public insert on article_views" ON public.article_views;
CREATE POLICY "Allow public insert on article_views"
ON public.article_views FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on article_views" ON public.article_views;
CREATE POLICY "Allow public read on article_views"
ON public.article_views FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Allow public insert on site_visits" ON public.site_visits;
CREATE POLICY "Allow public insert on site_visits"
ON public.site_visits FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on site_visits" ON public.site_visits;
CREATE POLICY "Allow public read on site_visits"
ON public.site_visits FOR SELECT
TO public
USING (true);
