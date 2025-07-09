"use server";
import { cookies } from "next/headers";
import { createSupabaseServer } from "./supabase/server";

export async function $api<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get("app_token")?.value;
  const supabase = await createSupabaseServer();

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
    config
  );

  if (!response.ok) {
    if (response.status === 401) {
      supabase.auth.signOut();
      throw new Error("Unauthorized. Please log in again.");
    }
    if (response.status === 403) {
      throw new Error(
        "Forbidden. You do not have permission to access this resource."
      );
    }

    const error = await response.text();
    throw new Error(error || `HTTP ${response.status}`);
  }

  const data = await response.json();

  if (data.data?.length || data?.meta) return data;
  return data.data || data;
}
