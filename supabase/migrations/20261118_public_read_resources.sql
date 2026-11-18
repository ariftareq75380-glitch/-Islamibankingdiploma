-- Migration: Allow public (anonymous) read access on the resources table
-- Date: 2026-11-18
--
-- PROBLEM
-- The public site reads the `resources` (PDF library) table as an anonymous
-- visitor using the Supabase publishable key. With no public SELECT policy,
-- anonymous queries return 0 rows, so StorageService.getPdfResources()
-- silently falls back to the stale bundled snapshot (src/data/content.json).
-- Result for every public visitor: the PDF Library and homepage counts show
-- only the 10 bundled PDFs, and any PDF published later via the admin panel
-- (e.g. the DIB Part-1 model-answers PDF, 2026-11-18) never appears publicly,
-- even though the admin panel (authenticated) shows 11 PDFs.
--
-- HOW TO APPLY (one-time, ~30 seconds)
--   1. Open the Supabase Dashboard for this project -> SQL Editor.
--   2. Paste this file's contents and press Run.
-- No code change or redeploy is needed for this migration to take effect;
-- the next page load will read the live resources table.
-- NOTE: Committing this file alone does NOT apply it — it must be run in
-- the Supabase SQL Editor (or via `supabase db push` from a linked project).

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on resources" ON public.resources;
CREATE POLICY "Allow public read access on resources"
ON public.resources FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access on resources" ON public.resources;
CREATE POLICY "Allow authenticated full access on resources"
ON public.resources FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
