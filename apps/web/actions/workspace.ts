"use server";

import { $api } from "@/lib/api";
import { SimpleUser } from "@/types";
import { PaginatedResult } from "@/types/api";

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  status: "Active" | "Inactive" | string;
  created_at: string; // or Date
  updated_at: string; // or Date
  is_deleted: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: "free" | "paid" | string;
  plan_type: "free" | "pro" | "enterprise" | string;
  creator_id: string;
  modifier_id: string | null;
  creator: SimpleUser;
  _count: {
    members: number;
    contents: number;
  };
}

export async function getWorkspaces(params?: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<PaginatedResult<Workspace>> {
  const query = new URLSearchParams(params as any).toString();
  return $api(`/workspaces?${query}`);
}

export async function createWorkspace(data: any) {
  return $api("/workspaces", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getWorkspace(id: string) {
  return $api(`/workspaces/${id}`);
}

export async function updateWorkspace(id: string, data: any) {
  return $api(`/workspaces/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteWorkspace(id: string) {
  return $api(`/workspaces/${id}`, {
    method: "DELETE",
  });
}
