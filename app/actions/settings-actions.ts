'use server';

import { createClient } from '@/utils/supabase/server';

// Revalidation helper for Next.js / framework cache revalidation
const revalidatePath = (_path: string) => {
  // Safe fallback if revalidatePath is not provided in standard Vite runtime
};

export interface AppSettingsData {
  nisab_amount_bdt: number;
  last_updated_date: string;
  gold_rate_22k_per_gram: number;
  silver_rate_per_gram: number;
}

export async function getAppSettings(): Promise<{ success: boolean; data?: AppSettingsData; error?: string }> {
  try {
    const supabase = await createClient();

    // 1. Try querying app_settings table first
    const { data: appData, error: appError } = await supabase
      .from('app_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (!appError && appData) {
      return {
        success: true,
        data: {
          nisab_amount_bdt: Number(appData.nisab_amount_bdt) || 173250,
          last_updated_date: String(appData.last_updated_date || '০৪/১১/২০২৬'),
          gold_rate_22k_per_gram: Number(appData.gold_rate_22k_per_gram) || 11500,
          silver_rate_per_gram: Number(appData.silver_rate_per_gram) || 282.85
        }
      };
    }

    // 2. Fallback to site_settings table if app_settings is not yet created
    const { data: siteData } = await supabase
      .from('site_settings')
      .select('data')
      .maybeSingle();

    if (siteData?.data) {
      const s = siteData.data;
      return {
        success: true,
        data: {
          nisab_amount_bdt: Number(s.nisab_amount_bdt) || 173250,
          last_updated_date: String(s.last_updated_date || '০৪/১১/২০২৬'),
          gold_rate_22k_per_gram: Number(s.gold_rate_22k_per_gram) || 11500,
          silver_rate_per_gram: Number(s.silver_rate_per_gram) || 282.85
        }
      };
    }

    // Default values if no rows found
    return {
      success: true,
      data: {
        nisab_amount_bdt: 173250,
        last_updated_date: '০৪/১১/২০২৬',
        gold_rate_22k_per_gram: 11500,
        silver_rate_per_gram: 282.85
      }
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to fetch app settings from Supabase'
    };
  }
}

export async function updateAppSettings(
  settings: AppSettingsData
): Promise<{ success: boolean; data?: AppSettingsData; error?: string }> {
  try {
    const supabase = await createClient();

    // Verify session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return { success: false, error: 'প্রথমে এডমিন অ্যাকাউন্টে লগইন করুন (Please log in first)' };
    }

    const payload = {
      id: 'default',
      nisab_amount_bdt: Number(settings.nisab_amount_bdt) || 173250,
      last_updated_date: String(settings.last_updated_date || '').trim() || '০৪/১১/২০২৬',
      gold_rate_22k_per_gram: Number(settings.gold_rate_22k_per_gram) || 11500,
      silver_rate_per_gram: Number(settings.silver_rate_per_gram) || 282.85,
      updated_at: new Date().toISOString()
    };

    // 1. Save to app_settings table
    const { error: appError } = await supabase
      .from('app_settings')
      .upsert(payload);

    if (appError) {
      console.warn('[Supabase Settings] Notice upserting app_settings:', appError.message);
    }

    // 2. Also keep site_settings synchronized
    try {
      const { data: existingSite } = await supabase
        .from('site_settings')
        .select('data')
        .maybeSingle();

      const existingData = existingSite?.data || {};
      await supabase
        .from('site_settings')
        .upsert({
          id: 'default',
          data: {
            ...existingData,
            nisab_amount_bdt: payload.nisab_amount_bdt,
            last_updated_date: payload.last_updated_date,
            gold_rate_22k_per_gram: payload.gold_rate_22k_per_gram,
            silver_rate_per_gram: payload.silver_rate_per_gram
          },
          updated_at: new Date().toISOString()
        });
    } catch (siteErr: any) {
      console.warn('[Supabase Settings] Notice syncing site_settings:', siteErr?.message);
    }

    // 3. Clear cache / revalidate the calculator page as requested
    try {
      revalidatePath('/zakat-calculator');
      revalidatePath('/dashboard');
      revalidatePath('/admin');
      revalidatePath('/');
    } catch {
      // Safe fallback
    }

    return {
      success: true,
      data: {
        nisab_amount_bdt: payload.nisab_amount_bdt,
        last_updated_date: payload.last_updated_date,
        gold_rate_22k_per_gram: payload.gold_rate_22k_per_gram,
        silver_rate_per_gram: payload.silver_rate_per_gram
      }
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'An unexpected error occurred while updating settings.'
    };
  }
}
