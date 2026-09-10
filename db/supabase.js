/**
 * Supabase Client for Legend Games
 * Provides connection interface to Supabase Postgres database.
 */

const SUPABASE_CONFIG = {
  url: 'https://xhhtosmggbtieicqozlm.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoaHRvc21nZ2J0aWVpY3FvemxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5OTQwNDgsImV4cCI6MjEwNDU3MDA0OH0.6l-c2EqEdCs5_JQNn1X42KAWdLmfm_nQoGORBWAcMdI'
};

// Check if Supabase JS library is loaded
let supabaseClient = null;

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  
  if (typeof window !== 'undefined' && window.supabase && SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey) {
    supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    return supabaseClient;
  }
  
  return null;
}

// Helper: Fetch all live games from Supabase
async function fetchSupabaseGames() {
  const client = getSupabaseClient();
  if (!client) return null;
  const { data, error } = await client.from('games').select('*');
  if (error) {
    console.warn('[Supabase] Error fetching games:', error);
    return null;
  }
  return data;
}

// Helper: Record an order/quote in Supabase
async function recordSupabaseOrder(orderData) {
  const client = getSupabaseClient();
  if (!client) return null;
  const { data, error } = await client.from('orders').insert([orderData]).select();
  if (error) {
    console.warn('[Supabase] Error creating order:', error);
    return null;
  }
  return data;
}

if (typeof window !== 'undefined') {
  window.LegendSupabase = {
    CONFIG: SUPABASE_CONFIG,
    getClient: getSupabaseClient,
    fetchGames: fetchSupabaseGames,
    recordOrder: recordSupabaseOrder
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SUPABASE_CONFIG, getSupabaseClient, fetchSupabaseGames, recordSupabaseOrder };
}
