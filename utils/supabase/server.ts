import { supabase } from '@/src/utils/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function createClient(): Promise<SupabaseClient> {
  return supabase;
}

export default createClient;
