"use server";

import { $api } from "@/lib/api";
import { PaginatedResult } from "@/types/api";

export async function getWorkspaces(params?: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<PaginatedResult<any>> {
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
