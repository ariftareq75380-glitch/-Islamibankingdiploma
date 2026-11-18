-- Migration: Contact-form messages table
-- Date: 2026-11-18
--
-- WHAT THIS ADDS
--   * public.contact_messages — one row per message sent from the Contact
--     page (/contact). Previously the form only showed a fake success
--     state and the message went nowhere.
--   * Public INSERT only, so any visitor can send a message.
--   * SELECT / DELETE only for the logged-in admin (authenticated role),
--     so visitor messages are NOT publicly readable.
--
-- HOW TO APPLY (one-time, ~30 seconds)
--   1. Open the Supabase Dashboard for this project -> SQL Editor.
--   2. Paste this file's contents and press Run.
--   3. After applying, send a test message from /contact and check it
--      appears in Supabase -> Table Editor -> contact_messages.
-- NOTE: Committing this file alone does NOT apply it — it must be run in
-- the Supabase SQL Editor (or via `supabase db push` from a linked
-- project). Until it is applied, the contact form shows an honest error
-- instead of a fake success, so no message is silently lost.

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert on contact_messages" ON public.contact_messages;
CREATE POLICY "Allow public insert on contact_messages"
ON public.contact_messages FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated read on contact_messages" ON public.contact_messages;
CREATE POLICY "Allow authenticated read on contact_messages"
ON public.contact_messages FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Allow authenticated delete on contact_messages" ON public.contact_messages;
CREATE POLICY "Allow authenticated delete on contact_messages"
ON public.contact_messages FOR DELETE
TO authenticated
USING (true);
