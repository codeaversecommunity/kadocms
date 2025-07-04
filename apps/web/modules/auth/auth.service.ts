import { createSupabaseServer } from "@/lib/supabase/server";

export class AuthService {
  static async initialize(): Promise<any> {
    const supabase = await createSupabaseServer();

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
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

    return response.json();
  }
}
