import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xhhtosmggbtieicqozlm.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_YJMpoKsWcUF-w9klkUC9Lg_i3icR-SQ";

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );
