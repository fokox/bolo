import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type BoloProfile = {
  id: string;
  username: string;
  display_name: string | null;
  secret_passcode?: string | null;
  created_at: string;
};

export type BoloMessage = {
  id: string;
  recipient_username: string;
  content: string;
  is_read: boolean;
  created_at: string;
};
