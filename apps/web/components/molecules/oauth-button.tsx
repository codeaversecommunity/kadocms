"use client";

import { useTransition } from "react";
import { Button } from "@/components/atoms/button";
import { Icons } from "@/components/atoms/icons";
import { supabaseSignInWithOAuth } from "@/lib/supabase/actions";

interface OAuthButtonProps {
  provider: "google" | "github";
  label?: string;
}

export default function OAuthButton({ provider, label }: OAuthButtonProps) {
  const [isPending, startTransition] = useTransition();

  async function handleOAuth() {
    startTransition(async () => {
      const url = await supabaseSignInWithOAuth(provider);
      if (url) {
        window.location.href = url; // Redirect to OAuth provider
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
