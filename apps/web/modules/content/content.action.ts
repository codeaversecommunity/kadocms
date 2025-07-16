"use server";

import { $api } from "@/lib/api";
import { Content } from "./content.type";
import { PaginatedResult } from "@/types/api";

export async function getContents() {
  return $api(`/contents`);
}

export async function validateSlugContent(id: string): Promise<{
  exists: boolean;
  message: string;
}> {
  return $api(`/contents/validate/${id}`);
}

export async function createContent(data: any): Promise<Content> {
  return $api("/contents", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getContent(id: string): Promise<Content> {
  return $api(`/contents/${id}`);
}

export async function updateContent(id: string, data: any) {
  return $api(`/contents/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteContent(id: string) {
  return $api(`/contents/${id}`, {
    method: "DELETE",
  });
}

// Content Entry methods
export async function getContentEntries(params: {
  content_id?: string;
  workspace_id?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}): Promise<PaginatedResult<any>> {
  const query = new URLSearchParams(params as any).toString();
  return $api(`/content-entries?${query}`);
}

export async function createContentEntry(data: any) {
  return $api("/content-entries", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getContentEntry(id: string) {
  return $api(`/content-entries/${id}`);
}

export async function updateContentEntry(id: string, data: any) {
  return $api(`/content-entries/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteContentEntry(id: string) {
  return $api(`/content-entries/${id}`, {
    method: "DELETE",
  });
}

export async function getPublicEntries(
  workspaceSlug: string,
  contentSlug: string,
  params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "asc" | "desc";
  }
) {
  const query = new URLSearchParams(params as any).toString();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/${workspaceSlug}/${contentSlug}?${query}`
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

export async function getPublicEntry(
  workspaceSlug: string,
  contentSlug: string,
  entryId: string
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/${workspaceSlug}/${contentSlug}/${entryId}`
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}
