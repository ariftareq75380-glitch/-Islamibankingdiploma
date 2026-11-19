-- Migration: Real PDF download counting for the PDF library
-- Date: 2026-11-19
--
-- WHAT THIS ADDS
--   * public.resource_downloads — one row per (PDF, browser session, day).
--     The count of rows for a PDF's key is its real download count, shown
--     on the library card and on the article page's PDF section as
--     "X বার ডাউনলোড হয়েছে". Repeated clicks in one session do not add
--     rows (UNIQUE + fire-and-forget insert in code).
--   * public.resource_download_counts — a read view: one row per PDF key
--     with its total row count. The app reads only this view.
--   * The key is the PDF's base file name (see resourceKeyForPdfUrl in
--     src/utils/pdfUtils.ts): admin uploads are stored as
--     `<epoch-ms>_<clean-name>.pdf` in the `pdfs/articles/` and
--     `pdfs/resources/` folders, so the library copy and the article copy
--     of the same book are two different storage objects that share the
--     base name — and therefore share one count. Any future PDF uploaded
--     the same way gets its own count automatically; nothing is hardcoded
--     to a single PDF.
--   * Public SELECT on the counts view and public INSERT + SELECT on
--     resource_downloads so anonymous visitors can download and see the
--     counts. No personal data is stored — only a random per-session id
--     (sessionStorage, the same `ikl_session_id_v1` the quiz and the
--     visitor analytics use) and timestamps.
--   * Only real PDFs get a count. Placeholder library entries ("শীঘ্রই
--     আসছে", disabled buttons) have no file behind them, so the code
--     never derives a key for them and they show no count line.
--   * A count of 0 means the tables exist but nothing has been recorded
--     since counting started — it is a real number, not history. No fake
--     or seed counts are added anywhere.
--
-- HOW TO APPLY (one-time, ~30 seconds)
--   1. Open the Supabase Dashboard for this project -> SQL Editor.
--   2. Paste this file's contents and press Run.
-- No code change or redeploy is needed for this migration to take effect;
-- the next page load will start counting. Until it is applied, the site
-- code fails silently: downloads still work and the count lines are
-- simply hidden (no wrong numbers shown).
-- NOTE: Committing this file alone does NOT apply it — it must be run in
-- the Supabase SQL Editor (or via `supabase db push` from a linked project).

CREATE TABLE IF NOT EXISTS public.resource_downloads (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  resource_key TEXT NOT NULL,
  session_id TEXT NOT NULL,
  downloaded_date DATE NOT NULL,
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (resource_key, session_id, downloaded_date)
);

CREATE OR REPLACE VIEW public.resource_download_counts AS
SELECT resource_key, COUNT(*)::BIGINT AS download_count
FROM public.resource_downloads
GROUP BY resource_key;

ALTER TABLE public.resource_downloads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert on resource_downloads" ON public.resource_downloads;
CREATE POLICY "Allow public insert on resource_downloads"
ON public.resource_downloads FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on resource_downloads" ON public.resource_downloads;
CREATE POLICY "Allow public read on resource_downloads"
ON public.resource_downloads FOR SELECT
TO public
USING (true);

-- The counts view is read by anonymous visitors; grant SELECT on it
-- directly (RLS is not enabled on the view — the underlying table's
-- policies still govern the rows it aggregates).
GRANT SELECT ON public.resource_download_counts TO anon, authenticated;
