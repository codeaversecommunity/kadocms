"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { supabase, supabaseAuth } from "@/lib/supabase";
import { AuthContextType, AuthState, User } from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    supabaseUser: null,
    cmsToken: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabaseAuth.getSession();

        if (error) {
          setState((prev) => ({
            ...prev,
            error: error.message,
            loading: false,
          }));
          return;
        }

        if (session) {
          await handleAuthSession(session);
        } else {
          setState((prev) => ({ ...prev, loading: false }));
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Unknown error",
          loading: false,
        }));
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabaseAuth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);

      if (session) {
        await handleAuthSession(session);
      } else {
        setState({
          user: null,
          supabaseUser: null,
          cmsToken: null,
          loading: false,
          error: null,
        });
        localStorage.removeItem("cms_token");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthSession = async (session: Session) => {
    try {
      setState((prev) => ({ ...prev, supabaseUser: session.user }));

      const cmsUser = await syncWithBackend(session);

      setState({
        user: cmsUser,
        supabaseUser: session.user,
        cmsToken: localStorage.getItem("cms_token"),
        loading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to sync user",
        loading: false,
      }));
    }
  };

  const syncWithBackend = async (session: Session): Promise<User> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth/sync`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: session.access_token,
          user: session.user,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to sync with backend");
    }

    const data = await response.json();
    localStorage.setItem("cms_token", data.token);

    return data.user;
  };

  const signInWithOAuth = async (provider: "google" | "github") => {
    setState((prev) => ({ ...prev, error: null }));
    const { error } = await supabaseAuth.signInWithOAuth(provider);

    if (error) {
      setState((prev) => ({ ...prev, error: error.message }));
    }

    return { error };
  };

  const signInWithEmail = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, error: null, loading: true }));
    const { error } = await supabaseAuth.signInWithPassword(email, password);

    if (error) {
      setState((prev) => ({ ...prev, error: error.message, loading: false }));
    }

    return { error };
  };

  const signUp = async (
    email: string,
    password: string,
    metadata?: Record<string, any>
  ) => {
    setState((prev) => ({ ...prev, error: null, loading: true }));
    const { error } = await supabaseAuth.signUp(email, password, {
      data: metadata,
    });

    if (error) {
      setState((prev) => ({ ...prev, error: error.message, loading: false }));
    }

    return { error };
  };

  const signOut = async () => {
    const { error } = await supabaseAuth.signOut();

    if (!error) {
      setState({
        user: null,
        supabaseUser: null,
        cmsToken: null,
        loading: false,
        error: null,
      });
      localStorage.removeItem("cms_token");
    }

    return { error };
  };

  const refreshToken = async () => {
    const {
      data: { session },
    } = await supabaseAuth.getSession();
    if (session) {
      await handleAuthSession(session);
    }
  };

  const value: AuthContextType = {
    ...state,
    signInWithOAuth,
    signInWithEmail,
    signUp,
    signOut,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
