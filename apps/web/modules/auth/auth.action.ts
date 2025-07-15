// app/actions/auth.ts
"use server";

import { $api } from "@/lib/api";
import { createSupabaseServer } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { getProfile } from "../user/user.action";

export interface InitializeAuthResponse {
  success: boolean;
  timestamp: Date;
  data: {
    user: {
      id: string;
      email: string;
      username: string;
      full_name: string;
      avatar: string;
      email_verified: boolean;
      workspace_id: string;
      created_at: Date;
      updated_at: Date;
    };
    token: string;
    isNewUser: boolean;
  };
}

export async function initializeAuth() {
  const supabase = await createSupabaseServer();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    console.error("Failed to get session", error, session);
    throw new Error(`Failed to get session: ${error?.message}`);
  }

  let response: Response;
  try {
    response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth/callback`,
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
  } catch (fetchError) {
    throw new Error(`Network error syncing with backend: ${fetchError}`);
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to sync with backend: ${response.status} ${errorText}`
    );
  }

  const responseData: InitializeAuthResponse = await response.json();
  const token = responseData.data.token;

  (await cookies()).set("app_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  return await getProfile();
}

export async function syncOAuth(accessToken: string, user: any) {
  return $api("/auth/oauth/callback", {
    method: "POST",
    body: JSON.stringify({ access_token: accessToken, user }),
  });
}
