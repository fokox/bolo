import { createClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://rgiaqpxamegnnmmlzilh.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnaWFxcHhhbWVnbm5tbWx6aWxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNDI5MjIsImV4cCI6MjEwMjYxODkyMn0.VZJERLc2pETtQ-KTv5OJpuO6QbCJ4WUyNAuB77jqpjQ";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

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
