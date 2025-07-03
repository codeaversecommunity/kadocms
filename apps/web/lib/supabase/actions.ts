"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "./server";

export async function supabaseSignInWithOtp(formData: FormData) {
  const supabase = await createSupabaseServer();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
  };

  const { error } = await supabase.auth.signInWithOtp({
    email: data.email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/callback`,
    },
  });

  if (error) {
    redirect("/error");
  }

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard");
}

export async function supabaseSignInWithOAuth(provider: "github" | "google") {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/callback`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  // Return the OAuth URL to the client
  return data.url;
}

export async function supabaseLogout() {
  const supabase = await createSupabaseServer();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/");
}
