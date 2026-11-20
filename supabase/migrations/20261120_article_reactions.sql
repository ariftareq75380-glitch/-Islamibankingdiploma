-- Migration: "Helpful" reaction counts under articles
-- Date: 2026-11-20
--
-- WHAT THIS ADDS
--   * public.article_reaction_counts — one row per article slug with the
--     number of visitors who pressed "কাজে লেগেছে" under the article.
--     Shown on the article page as "X জন পাঠক কাজে লেগেছে বলেছেন".
--   * public.increment_article_helpful(p_slug text) — a SECURITY DEFINER
--     function that adds 1 to the article's count (creating the row on
--     the first reaction) and returns the new count. Anonymous visitors
--     may only call this function; they have no direct INSERT/UPDATE on
--     the table, so counts cannot be set arbitrarily. One click per
--     visitor is enforced in the browser with localStorage
--     (`article-liked-<slug>`) — the server count is a plain tally.
--   * Public SELECT on the table so anonymous visitors can see the
--     counts. No personal data is stored — only the article slug, a
--     number, and timestamps.
--
-- HOW TO APPLY (one-time, ~30 seconds)
--   1. Open the Supabase Dashboard for this project -> SQL Editor.
--   2. Paste this file's contents and press Run.
-- No code change or redeploy is needed for this migration to take effect;
-- the next page load will start showing counts. Until it is applied, the
-- site code fails silently: the "কাজে লেগেছে" button still works (the
-- visitor's liked state is kept in localStorage) and the count line is
-- simply hidden (no wrong numbers shown).
-- NOTE: Committing this file alone does NOT apply it — it must be run in
-- the Supabase SQL Editor (or via `supabase db push` from a linked project).

CREATE TABLE IF NOT EXISTS public.article_reaction_counts (
  article_slug TEXT PRIMARY KEY,
  helpful_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.article_reaction_counts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on article_reaction_counts" ON public.article_reaction_counts;
CREATE POLICY "Allow public read on article_reaction_counts"
ON public.article_reaction_counts FOR SELECT
TO public
USING (true);

-- Anonymous visitors may read the counts, but they may NOT write the
-- table directly. All increments go through the function below.
GRANT SELECT ON public.article_reaction_counts TO anon, authenticated;

-- Add 1 to an article's helpful count (creating its row on the first
-- reaction) and return the new count. Returns NULL for an empty slug.
CREATE OR REPLACE FUNCTION public.increment_article_helpful(p_slug TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  IF p_slug IS NULL OR btrim(p_slug) = '' THEN
    RETURN NULL;
  END IF;

  INSERT INTO public.article_reaction_counts (article_slug, helpful_count, updated_at)
  VALUES (p_slug, 1, NOW())
  ON CONFLICT (article_slug)
  DO UPDATE SET helpful_count = public.article_reaction_counts.helpful_count + 1,
                updated_at = NOW()
  RETURNING helpful_count INTO v_count;

  RETURN v_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_article_helpful(TEXT) TO anon, authenticated;
