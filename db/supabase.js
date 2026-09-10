/**
 * Supabase Client Initialization for Legend Games
 * Provides connection interface to Supabase Postgres database.
 */

const SUPABASE_CONFIG = {
  url: '', // Paste your Supabase Project URL here or load via env
  anonKey: '' // Paste your Supabase Anon Key here
};

// Check if Supabase JS library is loaded (e.g. via CDN <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>)
let supabaseClient = null;

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  
  if (typeof window !== 'undefined' && window.supabase && SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey) {
    supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    return supabaseClient;
  }
  
  return null;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SUPABASE_CONFIG, getSupabaseClient };
}
