import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

// Single shared Supabase client instance used across the entire application
export const supabase: SupabaseClient = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      }
    })
  : createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    });

// Safe helper to set/clear Authorization header on the shared client's REST adapter
export const setSupabaseAuthHeader = (token?: string | null) => {
  const client = supabase as any;
  if (token) {
    if (client.rest?.headers?.set) {
      client.rest.headers.set('Authorization', `Bearer ${token}`);
    } else if (client.rest?.headers) {
      client.rest.headers['Authorization'] = `Bearer ${token}`;
    }
  } else {
    if (client.rest?.headers?.delete) {
      client.rest.headers.delete('Authorization');
    } else if (client.rest?.headers) {
      delete client.rest.headers['Authorization'];
    }
  }
};

// Keep REST headers in sync with the active session token
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session?.access_token) {
    setSupabaseAuthHeader(session.access_token);
  }
}).catch(() => {});

supabase.auth.onAuthStateChange((_event, session) => {
  if (session?.access_token) {
    setSupabaseAuthHeader(session.access_token);
  } else if (!session) {
    setSupabaseAuthHeader(null);
  }
});

// Always return the exact same shared client instance
export const getSupabaseClient = (): SupabaseClient => {
  return supabase;
};

