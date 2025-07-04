export interface Media {
  id: string;
  name: string;
  media_type: "IMAGE" | "VIDEO" | "DOCUMENT" | "FILE";
  file_size: number;
  file_path: string;
  width?: number;
  height?: number;
  alt_text?: string;
  description?: string;
  workspace_id: string;
  creator_id: string;
  modifier_id?: string;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
  creator?: {
    id: string;
    email: string;
    full_name?: string;
    username?: string;
  };
  workspace?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface MediaUploadResponse extends Media {
  cloudinary_public_id: string;
  cloudinary_url: string;
}

export interface MediaTransformation {
  original_url: string;
  transformed_url: string;
  transformations: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
  };
}

export interface MediaQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  media_type?: "IMAGE" | "VIDEO" | "DOCUMENT" | "FILE";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateMediaData {
  name?: string;
  alt_text?: string;
  description?: string;
}

export interface UpdateMediaData {
  name?: string;
  alt_text?: string;
  description?: string;
}

export interface UploadBase64Data extends CreateMediaData {
  base64_data: string;
}

export interface TransformationParams {
  width?: number;
  height?: number;
  crop?: "scale" | "fit" | "fill" | "crop" | "thumb";
  quality?: string | number;
  format?: "jpg" | "png" | "webp" | "gif" | "auto";
}
