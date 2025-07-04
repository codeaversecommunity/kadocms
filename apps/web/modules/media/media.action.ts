"use server";
import { $api } from "@/lib/api";

import {
  Media,
  MediaQueryParams,
  CreateMediaData,
  UpdateMediaData,
  UploadBase64Data,
  TransformationParams,
} from "./media.type";
import { PaginatedResult } from "@/types/api";

// Get media list with pagination and filters
export async function getMedia(
  params: MediaQueryParams
): Promise<PaginatedResult<Media>> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });

  return await $api(`/media?${searchParams.toString()}`);
}

// Upload file using FormData
export async function uploadMediaFile(file: File, data: CreateMediaData) {
  const formData = new FormData();
  formData.append("file", file);

  if (data.name) formData.append("name", data.name);
  if (data.alt_text) formData.append("alt_text", data.alt_text);
  if (data.description) formData.append("description", data.description);

  return $api("/media/upload", {
    method: "POST",
    body: formData,
    // Don't set Content-Type header for FormData - let browser set it with boundary
    headers: {},
  });
}

// Upload base64 data
export async function uploadMediaBase64(data: UploadBase64Data) {
  return $api("/media/upload-base64", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Get single media item
export async function getMediaItem(id: string) {
  return $api(`/media/${id}`);
}

// Update media metadata
export async function updateMedia(id: string, data: UpdateMediaData) {
  return $api(`/media/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// Delete media
export async function deleteMedia(id: string) {
  return $api(`/media/${id}`, {
    method: "DELETE",
  });
}

// Generate transformation URL
export async function getMediaTransformation(
  id: string,
  params: TransformationParams
) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });

  return $api(`/media/${id}/transform?${searchParams.toString()}`);
}

// Helper function to get optimized image URL
export async function getOptimizedImageUrl(
  id: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "webp" | "jpg" | "png" | "auto";
  } = {}
) {
  const params: TransformationParams = {
    crop: "fill",
    quality: options.quality || "auto",
    format: options.format || "auto",
    ...options,
  };

  const response: any = await getMediaTransformation(id, params);
  return response.data.transformed_url;
}

// Helper function to generate responsive image URLs
export async function getResponsiveImageUrls(id: string) {
  const sizes = [
    { width: 400, height: 300, name: "small" },
    { width: 800, height: 600, name: "medium" },
    { width: 1200, height: 900, name: "large" },
    { width: 1600, height: 1200, name: "xlarge" },
  ];

  const urls: Record<string, string> = {};

  for (const size of sizes) {
    try {
      const url = await getOptimizedImageUrl(id, {
        width: size.width,
        height: size.height,
        format: "webp",
        quality: 80,
      });
      urls[size.name] = url;
    } catch (error) {
      console.warn(`Failed to generate ${size.name} image URL:`, error);
    }
  }

  return urls;
}
