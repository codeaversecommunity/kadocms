"use server";

import { $api } from "@/lib/api";

export interface Profile {
  id: string;
  email: string;
  username: string;
  full_name: string;
  avatar: string;
  email_verified: boolean;
  workspace_id: string;
  created_at: string;
  updated_at: string;
}

export async function getProfile(): Promise<Profile> {
  return $api("/users/profile");
}

export async function updateProfile(data: Partial<any>) {
  return $api("/users/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
