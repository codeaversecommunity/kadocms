// lib/supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL and Anon Key must be set in environment variables."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});

// Type-safe auth helpers
export const supabaseAuth = {
  signInWithOAuth: (provider: "google" | "github") =>
    supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/callback`,
      },
    }),

  signInWithPassword: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),

  signUp: (
    email: string,
    password: string,
    options?: { data?: Record<string, any> }
  ) => supabase.auth.signUp({ email, password, options }),

  signOut: () => supabase.auth.signOut(),

  getSession: () => supabase.auth.getSession(),

  getUser: () => supabase.auth.getUser(),

  onAuthStateChange: (callback: (event: string, session: any) => void) =>
    supabase.auth.onAuthStateChange(callback),
};
