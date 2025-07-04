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
  workspace: {
    id: string;
    name: string;
    slug: string;
    status: string;
    created_at: Date;
    updated_at: Date;
    is_deleted: boolean;
    stripe_customer_id: null;
    stripe_subscription_id: null;
    subscription_status: string;
    plan_type: string;
    creator_id: string;
    modifier_id: null;
    contents: {
      id: string;
      name: string;
      slug: string;
      workspace_id: string;
      creator_id: string;
      modifier_id: null;
      created_at: Date;
      updated_at: Date;
      is_deleted: boolean;
    }[];
  };
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
