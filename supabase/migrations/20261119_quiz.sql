-- Migration: Daily quiz — question bank + participation counts
-- Date: 2026-11-19
--
-- WHAT THIS ADDS
--   * public.quiz_questions — admin-added quiz questions (the 30 approved
--     starter questions live in the app bundle at src/data/quizQuestions.ts
--     and are merged with these rows at runtime). The admin panel's
--     "কুইজ প্রশ্ন" tab inserts into this table.
--   * public.quiz_attempts — one row per (question, browser session, day).
--     The count of distinct session_ids per day is "আজ X জন অংশ নিয়েছে",
--     and correct/total per question is the "% সঠিক উত্তর দিয়েছে" figure.
--     Refreshes and replays in the same session do not add rows
--     (UNIQUE + a sessionStorage guard in code).
--   * Public SELECT on quiz_questions and public INSERT + SELECT on
--     quiz_attempts so anonymous visitors can play and see the counts.
--     Public INSERT on quiz_questions follows the same approach as the
--     existing admin writes; the app itself only inserts from the
--     admin panel after a Supabase login (see saveQuizQuestion).
--     No personal data is stored — only a random per-session id
--     (sessionStorage) and timestamps.
--
-- HOW TO APPLY (one-time, ~30 seconds)
--   1. Open the Supabase Dashboard for this project -> SQL Editor.
--   2. Paste this file's contents and press Run.
-- No code change or redeploy is needed for this migration to take effect;
-- the next page load will start counting. Until it is applied, the site
-- code fails silently: the quiz still works from the bundled 30 questions
-- and the participation lines are simply hidden (no wrong numbers shown).
-- NOTE: Committing this file alone does NOT apply it — it must be run in
-- the Supabase SQL Editor (or via `supabase db push` from a linked project).

CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  topic TEXT NOT NULL DEFAULT 'সাধারণ',
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_index INTEGER NOT NULL DEFAULT 0,
  explanation TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  question_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  answered_date DATE NOT NULL,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (question_id, session_id, answered_date)
);

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on quiz_questions" ON public.quiz_questions;
CREATE POLICY "Allow public read on quiz_questions"
ON public.quiz_questions FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Allow public insert on quiz_questions" ON public.quiz_questions;
CREATE POLICY "Allow public insert on quiz_questions"
ON public.quiz_questions FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert on quiz_attempts" ON public.quiz_attempts;
CREATE POLICY "Allow public insert on quiz_attempts"
ON public.quiz_attempts FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on quiz_attempts" ON public.quiz_attempts;
CREATE POLICY "Allow public read on quiz_attempts"
ON public.quiz_attempts FOR SELECT
TO public
USING (true);
