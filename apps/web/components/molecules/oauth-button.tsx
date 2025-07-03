"use client";

import { useTransition } from "react";
import { Button } from "@/components/atoms/button";
import { Icons } from "@/components/atoms/icons";
import { supabaseAuth } from "@/lib/supabase";

interface OAuthButtonProps {
  provider: "google" | "github";
  label?: string;
}

export default function OAuthButton({ provider, label }: OAuthButtonProps) {
  const [isPending, startTransition] = useTransition();

  async function handleOAuth() {
    startTransition(async () => {
      const { data, error } = await supabaseAuth.signInWithOAuth(provider);

      if (error) {
        throw new Error(error.message);
      }

      if (data.url) {
        window.location.href = data.url; // Redirect to OAuth provider
      }
    });
  }

  return (
    <Button
      variant="outline"
      type="button"
      className="w-full cursor-pointer"
      onClick={handleOAuth}
      disabled={isPending}
      aria-label={`Continue with ${provider}`}
      data-testid={`oauth-button-${provider}`}
      id={`oauth-button-${provider}`}
    >
      {isPending ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
      ) : (
        Icons[provider]()
      )}
      {label ||
        `Continue with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`}
    </Button>
  );
}
