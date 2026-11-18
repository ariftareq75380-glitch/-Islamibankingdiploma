-- Migration: Row Level Security on `articles` + `site_settings`
-- Date: 2026-11-18
--
-- WHAT THIS FIXES
--   The app's public (anonymous) Supabase key is embedded in the shipped JS
--   bundle. `schema.sql` enabled RLS only for `app_settings`, `resources`,
--   `article_views` and `site_visits` — `articles` and `site_settings` had
--   NO RLS at all. If RLS is off on a table, anyone with the anon key can
--   INSERT / UPDATE / DELETE rows in it, because every admin write in the
--   app (`saveArticleToSupabase`, `saveAppSettings`, ...) relies only on a
--   client-side "is there a session?" check, which is not enforcement.
--   This migration mirrors the existing policies on `resources`:
--     * anonymous visitors: SELECT only (the public site must read them)
--     * logged-in admin (authenticated role): full access
--
-- HOW TO APPLY (one-time, ~30 seconds)
--   1. Open the Supabase Dashboard for this project -> SQL Editor.
--   2. Paste this file's contents and press Run.
--   3. Verify in Supabase -> Table Editor -> `articles` and `site_settings`:
--      each table must show "RLS enabled" with the two policies below.
-- NOTE: Committing this file alone does NOT apply it — it must be run in
-- the Supabase SQL Editor (or via `supabase db push` from a linked
-- project). Until it is applied, the database is NOT secured by this fix.
--
-- NOTE: this migration does NOT remove the stray `article-publish` row.
-- That cleanup was removed from the app's read path (it used to run a
-- DELETE on every page load). If the row still exists, delete it once from
-- the SQL Editor with:
--   DELETE FROM public.articles WHERE slug = 'article-publish' OR id = 'article-publish';

-- --- articles ---
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on articles" ON public.articles;
CREATE POLICY "Allow public read access on articles"
ON public.articles FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access on articles" ON public.articles;
CREATE POLICY "Allow authenticated full access on articles"
ON public.articles FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- --- site_settings ---
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on site_settings" ON public.site_settings;
CREATE POLICY "Allow public read access on site_settings"
ON public.site_settings FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access on site_settings" ON public.site_settings;
CREATE POLICY "Allow authenticated full access on site_settings"
ON public.site_settings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
