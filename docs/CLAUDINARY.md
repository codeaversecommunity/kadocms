# Media Management API with Cloudinary

Complete documentation for the Media CRUD API with Cloudinary integration.

## 📋 Table of Contents

- [Overview](#overview)
- [Environment Setup](#environment-setup)
- [API Endpoints](#api-endpoints)
- [File Upload](#file-upload)
- [Image Transformations](#image-transformations)
- [Error Handling](#error-handling)
- [Examples](#examples)

## 🌟 Overview

The Media API provides complete CRUD operations for managing media files with Cloudinary as the storage backend. It supports:

- **File Upload**: Images, videos, documents
- **Base64 Upload**: Direct base64 data upload
- **Image Transformations**: Resize, crop, format conversion
- **Workspace Isolation**: Media scoped to workspaces
- **Pagination & Search**: Find media efficiently
- **Automatic Cleanup**: Cloudinary deletion on remove

## 🔧 Environment Setup

Add these environment variables to your `.env` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=kadocms
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=123456789012345
```

## 📚 API Endpoints

### Base URL

```
http://localhost:3001/media
```

### Authentication

All endpoints require JWT authentication:

```http
Authorization: Bearer <jwt-token>
```

---

## 📤 File Upload

### Upload File (Multipart)

```http
POST /media/upload
Content-Type: multipart/form-data
Authorization: Bearer <jwt-token>

Form Data:
- file: [File]
- workspace_id: "workspace-uuid"
- name: "My Image" (optional)
- alt_text: "Alt text for accessibility" (optional)
- description: "Image description" (optional)
```

**Supported File Types:**

- Images: JPEG, PNG, GIF, WebP
- Videos: MP4, WebM
- Documents: PDF

**File Size Limit:** 10MB

**Response:**

```json
{
  "success": true,
  "timestamp": "2024-01-01T00:00:00Z",
  "data": {
    "id": "media-uuid",
    "name": "My Image",
    "media_type": "IMAGE",
    "file_size": 1024000,
    "file_path": "https://res.cloudinary.com/kadocms/image/upload/v1234567890/kadocms/workspace-slug/filename.jpg",
    "width": 1920,
    "height": 1080,
    "alt_text": "Alt text for accessibility",
    "description": "Image description",
    "workspace_id": "workspace-uuid",
    "creator_id": "user-uuid",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "cloudinary_public_id": "kadocms/workspace-slug/filename",
    "cloudinary_url": "https://res.cloudinary.com/kadocms/image/upload/v1234567890/kadocms/workspace-slug/filename.jpg",
    "creator": {
      "id": "user-uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "username": "johndoe"
    },
    "workspace": {
      "id": "workspace-uuid",
      "name": "My Blog",
      "slug": "my-blog"
    }
  }
}
```

### Upload Base64

```http
POST /media/upload-base64
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "workspace_id": "workspace-uuid",
  "base64_data": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
  "name": "Base64 Image",
  "alt_text": "Uploaded via base64",
  "description": "Image uploaded as base64 data"
}
```

---

## 📋 Get Media

### List Media (with Pagination)

```http
GET /media?workspace_id=workspace-uuid&page=1&limit=10&search=image&media_type=IMAGE&sortBy=created_at&sortOrder=desc
Authorization: Bearer <jwt-token>
```

**Query Parameters:**

- `workspace_id` (required): Workspace UUID
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `search`: Search in name, description, alt_text
- `media_type`: Filter by type (IMAGE, VIDEO, DOCUMENT, FILE)
- `sortBy`: Sort field (default: created_at)
- `sortOrder`: Sort order (asc, desc, default: desc)

**Response:**

```json
{
  "success": true,
  "timestamp": "2024-01-01T00:00:00Z",
  "data": [
    {
      "id": "media-uuid",
      "name": "My Image",
      "media_type": "IMAGE",
      "file_size": 1024000,
      "file_path": "https://res.cloudinary.com/kadocms/...",
      "width": 1920,
      "height": 1080,
      "alt_text": "Alt text",
      "description": "Description",
      "created_at": "2024-01-01T00:00:00Z",
      "creator": {
        "id": "user-uuid",
        "email": "user@example.com",
        "full_name": "John Doe"
      }
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Get Single Media

```http
GET /media/{media-id}
Authorization: Bearer <jwt-token>
```

**Response:**

```json
{
  "success": true,
  "timestamp": "2024-01-01T00:00:00Z",
  "data": {
    "id": "media-uuid",
    "name": "My Image",
    "media_type": "IMAGE",
    "file_size": 1024000,
    "file_path": "https://res.cloudinary.com/kadocms/...",
    "width": 1920,
    "height": 1080,
    "alt_text": "Alt text",
    "description": "Description",
    "workspace_id": "workspace-uuid",
    "creator_id": "user-uuid",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "creator": {
      "id": "user-uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "username": "johndoe"
    },
    "workspace": {
      "id": "workspace-uuid",
      "name": "My Blog",
      "slug": "my-blog"
    }
  }
}
```

---

## ✏️ Update Media

```http
PATCH /media/{media-id}
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "name": "Updated Image Name",
  "alt_text": "Updated alt text",
  "description": "Updated description"
}
```

**Note:** File content cannot be updated. To change the file, delete and upload a new one.

---

## 🗑️ Delete Media

```http
DELETE /media/{media-id}
Authorization: Bearer <jwt-token>
```

**Response:**

```json
{
  "success": true,
  "timestamp": "2024-01-01T00:00:00Z",
  "data": {
    "id": "media-uuid",
    "is_deleted": true,
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

**Note:** This performs:

1. Soft delete in database (sets `is_deleted: true`)
2. Hard delete from Cloudinary storage

---

## 🎨 Image Transformations

### Generate Transformation URL

```http
GET /media/{media-id}/transform?width=300&height=200&crop=fill&quality=80&format=webp
Authorization: Bearer <jwt-token>
```

**Query Parameters:**

- `width`: Target width (1-2000px)
- `height`: Target height (1-2000px)
- `crop`: Crop mode (scale, fit, fill, crop, thumb)
- `quality`: Image quality (1-100 or auto)
- `format`: Output format (jpg, png, webp, gif, auto)

**Response:**

```json
{
  "success": true,
  "timestamp": "2024-01-01T00:00:00Z",
  "data": {
    "original_url": "https://res.cloudinary.com/kadocms/image/upload/v1234567890/kadocms/workspace/filename.jpg",
    "transformed_url": "https://res.cloudinary.com/kadocms/image/upload/w_300,h_200,c_fill,q_80,f_webp/v1234567890/kadocms/workspace/filename.jpg",
    "transformations": {
      "width": 300,
      "height": 200,
      "crop": "fill",
      "quality": "80",
      "format": "webp"
    }
  }
}
```

### Transformation Examples

**Resize to 300x200 (maintain aspect ratio):**

```
?width=300&height=200&crop=fit
```

**Square crop (center focus):**

```
?width=400&height=400&crop=fill
```

**Optimize for web:**

```
?quality=auto&format=auto
```

**Create thumbnail:**

```
?width=150&height=150&crop=thumb&quality=80
```

---

## 🚨 Error Handling

### Common Error Responses

**File Too Large (413):**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "File size too large. Maximum 10MB allowed.",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Unsupported File Type (400):**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "File type not supported",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Workspace Access Denied (403):**

```json
{
  "success": false,
  "statusCode": 403,
  "message": "You do not have access to this workspace",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Media Not Found (404):**

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Media not found",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## 💡 Examples

### JavaScript/TypeScript Examples

#### Upload File with Fetch

```javascript
const uploadFile = async (file, workspaceId, token) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("workspace_id", workspaceId);
  formData.append("name", file.name);
  formData.append("alt_text", "Uploaded image");

  const response = await fetch("/media/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return response.json();
};
```

#### Upload Base64 Image

```javascript
const uploadBase64 = async (base64Data, workspaceId, token) => {
  const response = await fetch("/media/upload-base64", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      workspace_id: workspaceId,
      base64_data: base64Data,
      name: "Canvas Image",
      alt_text: "Generated image",
    }),
  });

  return response.json();
};
```

#### Get Media with Pagination

```javascript
const getMedia = async (workspaceId, page = 1, token) => {
  const params = new URLSearchParams({
    workspace_id: workspaceId,
    page: page.toString(),
    limit: "12",
    sortBy: "created_at",
    sortOrder: "desc",
  });

  const response = await fetch(`/media?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};
```

#### Generate Responsive Images

```javascript
const generateResponsiveUrls = async (mediaId, token) => {
  const sizes = [
    { width: 400, height: 300, name: "small" },
    { width: 800, height: 600, name: "medium" },
    { width: 1200, height: 900, name: "large" },
  ];

  const urls = {};

  for (const size of sizes) {
    const params = new URLSearchParams({
      width: size.width.toString(),
      height: size.height.toString(),
      crop: "fill",
      quality: "auto",
      format: "webp",
    });

    const response = await fetch(`/media/${mediaId}/transform?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    urls[size.name] = result.data.transformed_url;
  }

  return urls;
};
```

### React Hook Example

```typescript
import { useState, useCallback } from "react";

interface MediaItem {
  id: string;
  name: string;
  file_path: string;
  media_type: string;
  // ... other properties
}

export const useMedia = (workspaceId: string, token: string) => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const loadMedia = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          workspace_id: workspaceId,
          page: page.toString(),
          limit: "12",
        });

        const response = await fetch(`/media?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await response.json();

        if (result.success) {
          setMedia(result.data);
          setPagination({
            page: result.meta.page,
            totalPages: result.meta.totalPages,
            total: result.meta.total,
          });
        }
      } catch (error) {
        console.error("Failed to load media:", error);
      } finally {
        setLoading(false);
      }
    },
    [workspaceId, token]
  );

  const uploadFile = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("workspace_id", workspaceId);

      const response = await fetch("/media/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Refresh media list
        loadMedia(pagination.page);
      }

      return result;
    },
    [workspaceId, token, pagination.page, loadMedia]
  );

  return {
    media,
    loading,
    pagination,
    loadMedia,
    uploadFile,
  };
};
```

---

## 🔒 Security Features

- **Workspace Isolation**: Media is scoped to workspaces
- **Access Control**: Only workspace members can access media
- **File Validation**: Type and size restrictions
- **Secure URLs**: Cloudinary provides secure HTTPS URLs
- **Automatic Cleanup**: Orphaned files are removed from Cloudinary

## 📈 Performance Tips

1. **Use Transformations**: Generate optimized images for different use cases
2. **Leverage Caching**: Cloudinary provides global CDN caching
3. **Optimize Formats**: Use WebP for modern browsers
4. **Lazy Loading**: Load images on demand in your frontend
5. **Pagination**: Use pagination for large media libraries

This Media API provides a complete solution for managing files in your headless CMS with the power and reliability of Cloudinary!
