-- Migration: Create app_settings table for Zakat Calculator & App Configuration
-- Task 1: Ensure app_settings has columns:
--   nisab_amount_bdt (numeric)
--   last_updated_date (date/string)
--   gold_rate_22k_per_gram (numeric)
--   silver_rate_per_gram (numeric)

CREATE TABLE IF NOT EXISTS public.app_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    nisab_amount_bdt NUMERIC NOT NULL DEFAULT 173250,
    last_updated_date TEXT NOT NULL DEFAULT '০৪/১১/২০২৬',
    gold_rate_22k_per_gram NUMERIC NOT NULL DEFAULT 11500,
    silver_rate_per_gram NUMERIC NOT NULL DEFAULT 282.85,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- 1. Allow public read access to app_settings (needed by all visitors for Zakat Calculator)
DROP POLICY IF EXISTS "Allow public read access on app_settings" ON public.app_settings;
CREATE POLICY "Allow public read access on app_settings"
ON public.app_settings FOR SELECT
TO public
USING (true);

-- 2. Allow authenticated users (Admins) to insert/update settings
DROP POLICY IF EXISTS "Allow authenticated full access on app_settings" ON public.app_settings;
CREATE POLICY "Allow authenticated full access on app_settings"
ON public.app_settings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Seed initial row if not already present
INSERT INTO public.app_settings (id, nisab_amount_bdt, last_updated_date, gold_rate_22k_per_gram, silver_rate_per_gram)
VALUES ('default', 173250, '০৪/১১/২০২৬', 11500, 282.85)
ON CONFLICT (id) DO UPDATE SET
    nisab_amount_bdt = EXCLUDED.nisab_amount_bdt,
    last_updated_date = EXCLUDED.last_updated_date,
    gold_rate_22k_per_gram = EXCLUDED.gold_rate_22k_per_gram,
    silver_rate_per_gram = EXCLUDED.silver_rate_per_gram,
    updated_at = NOW();
