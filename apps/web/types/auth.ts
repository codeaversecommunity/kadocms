import { User as SupabaseUser } from "@supabase/supabase-js";

export interface User {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  avatar?: string;
  email_verified: boolean;
  workspace_id?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  cmsToken: string | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  signInWithOAuth: (
    provider: "google" | "github"
  ) => Promise<{ error: Error | null }>;
  signInWithEmail: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    metadata?: Record<string, any>
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  refreshToken: () => Promise<void>;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  full_name: string;
  username?: string;
}
