# API Reference

Complete API reference for the Headless CMS REST API with OAuth-only authentication.

## Base URL

```
http://localhost:3001
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer <jwt-token>
```

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "timestamp": "2024-01-01T00:00:00Z",
  "data": "...",
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## Error Responses

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "timestamp": "2024-01-01T00:00:00Z",
  "path": "/api/endpoint"
}
```

## Endpoints

### Authentication

#### POST /auth/oauth/callback

Handle OAuth callback and create/update user.

**Request Body:**

```json
{
  "access_token": "supabase-access-token",
  "user": {
    "id": "supabase-user-id",
    "email": "user@example.com",
    "email_confirmed_at": "2024-01-01T00:00:00Z",
    "user_metadata": {
      "full_name": "John Doe",
      "avatar_url": "https://...",
      "user_name": "johndoe"
    }
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "username": "johndoe",
      "avatar": "https://...",
      "email_verified": true,
      "workspace_id": "uuid",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    },
    "token": "jwt-token",
    "isNewUser": true
  }
}
```

#### POST /auth/oauth/sync

Alternative endpoint for OAuth synchronization.

**Same as `/auth/oauth/callback`**

#### GET /auth/oauth/callback

Handle OAuth redirect from Supabase.

**Query Parameters:**

- `code` - OAuth authorization code
- `state` - OAuth state parameter

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "OAuth callback received",
    "redirectUrl": "https://your-frontend.com/auth/callback?code=...&state=...",
    "code": "oauth-code",
    "state": "oauth-state"
  }
}
```

#### POST /auth/refresh

Refresh user data from Supabase.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "access_token": "supabase-access-token"
}
```

### Users

#### GET /users/profile

Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "full_name": "John Doe",
    "avatar": "https://...",
    "email_verified": true,
    "workspace_id": "uuid",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### PATCH /users/profile

Update current user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "full_name": "John Smith",
  "username": "johnsmith",
  "avatar": "https://..."
}
```

### Workspaces

#### POST /workspaces

Create a new workspace.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "name": "My Blog",
  "slug": "my-blog",
  "status": "Active"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "My Blog",
    "slug": "my-blog",
    "status": "Active",
    "creator_id": "uuid",
    "created_at": "2024-01-01T00:00:00Z",
    "creator": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe"
    }
  }
}
```

#### GET /workspaces

Get user's workspaces with pagination and search.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `search` - Search term for name/slug
- `sortBy` - Sort field (default: created_at)
- `sortOrder` - Sort order: asc|desc (default: desc)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "My Blog",
      "slug": "my-blog",
      "status": "Active",
      "created_at": "2024-01-01T00:00:00Z",
      "creator": {
        "id": "uuid",
        "email": "user@example.com",
        "full_name": "John Doe"
      },
      "_count": {
        "members": 1,
        "contents": 3
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

#### GET /workspaces/:id

Get workspace details.

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "My Blog",
    "slug": "my-blog",
    "status": "Active",
    "creator": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe"
    },
    "members": [
      {
        "id": "uuid",
        "role": "Member",
        "status": "Active",
        "user": {
          "id": "uuid",
          "email": "member@example.com",
          "full_name": "Jane Doe"
        }
      }
    ],
    "contents": [
      {
        "id": "uuid",
        "name": "Blog Post",
        "slug": "blog-post",
        "created_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### Content Types

#### POST /contents

Create a new content type.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "name": "Blog Post",
  "slug": "blog-post",
  "workspace_id": "uuid",
  "field_definitions": [
    {
      "name": "title",
      "display_name": "Title",
      "type": "TEXT",
      "required": true,
      "placeholder": "Enter post title"
    },
    {
      "name": "content",
      "display_name": "Content",
      "type": "RICH_TEXT",
      "required": true
    },
    {
      "name": "author",
      "display_name": "Author",
      "type": "RELATION",
      "relation_to_content_id": "author-content-id",
      "required": true
    },
    {
      "name": "tags",
      "display_name": "Tags",
      "type": "RELATION",
      "relation_to_content_id": "tag-content-id",
      "multiple": true
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Blog Post",
    "slug": "blog-post",
    "workspace_id": "uuid",
    "created_at": "2024-01-01T00:00:00Z",
    "field_definitions": [
      {
        "id": "uuid",
        "name": "title",
        "display_name": "Title",
        "type": "TEXT",
        "required": true,
        "multiple": false,
        "placeholder": "Enter post title",
        "relation_to_content": null
      }
    ],
    "workspace": {
      "id": "uuid",
      "name": "My Blog",
      "slug": "my-blog"
    }
  }
}
```

#### GET /contents

Get content types for a workspace.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `workspace_id` (required) - Workspace UUID

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Blog Post",
      "slug": "blog-post",
      "workspace_id": "uuid",
      "created_at": "2024-01-01T00:00:00Z",
      "field_definitions": [...],
      "_count": {
        "entries": 25
      }
    }
  ]
}
```

### Content Entries

#### POST /content-entries

Create a new content entry.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "content_id": "uuid",
  "data": {
    "title": "My First Blog Post",
    "content": "<p>This is the content of my blog post.</p>",
    "author": "author-entry-id",
    "tags": ["tag-entry-id-1", "tag-entry-id-2"],
    "published": true,
    "publish_date": "2024-01-01T00:00:00Z"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "content_id": "uuid",
    "data": {
      "title": "My First Blog Post",
      "content": "<p>This is the content of my blog post.</p>",
      "author": "author-entry-id",
      "tags": ["tag-entry-id-1", "tag-entry-id-2"],
      "published": true,
      "publish_date": "2024-01-01T00:00:00Z"
    },
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "content": {
      "id": "uuid",
      "name": "Blog Post",
      "slug": "blog-post"
    },
    "creator": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe"
    }
  }
}
```

#### GET /content-entries

Get content entries with filtering and pagination.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `content_id` - Filter by content type
- `workspace_id` - Filter by workspace
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sort` - Sort field (default: created_at)
- `order` - Sort order: asc|desc (default: desc)

**Response:**

```json
{
  "success": true,
  "data": {
    "entries": [
      {
        "id": "uuid",
        "content_id": "uuid",
        "data": {...},
        "created_at": "2024-01-01T00:00:00Z",
        "content": {
          "id": "uuid",
          "name": "Blog Post",
          "slug": "blog-post",
          "workspace": {
            "id": "uuid",
            "name": "My Blog",
            "slug": "my-blog"
          }
        },
        "creator": {
          "id": "uuid",
          "email": "user@example.com",
          "full_name": "John Doe"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

#### GET /content-entries/:id

Get a single content entry.

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "content_id": "uuid",
    "data": {...},
    "created_at": "2024-01-01T00:00:00Z",
    "content": {
      "id": "uuid",
      "name": "Blog Post",
      "slug": "blog-post",
      "field_definitions": [...],
      "workspace": {
        "id": "uuid",
        "name": "My Blog",
        "slug": "my-blog"
      }
    },
    "creator": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe"
    }
  }
}
```

#### PATCH /content-entries/:id

Update a content entry.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "data": {
    "title": "Updated Blog Post Title",
    "published": false
  }
}
```

#### DELETE /content-entries/:id

Delete a content entry (soft delete).

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "is_deleted": true,
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### Public API

#### GET /api/:workspace_slug/:content_slug

Get public content entries.

**No authentication required**

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `sort` - Sort field (default: created_at)
- `order` - Sort order: asc|desc (default: desc)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "content_id": "uuid",
      "data": {
        "title": "My Blog Post",
        "content": "<p>Content here</p>",
        "author": {
          "id": "author-entry-id",
          "content_id": "author-content-id",
          "data": {
            "name": "John Doe",
            "email": "john@example.com",
            "bio": "Author bio"
          },
          "created_at": "2024-01-01T00:00:00Z"
        },
        "tags": [
          {
            "id": "tag-entry-id",
            "data": {
              "name": "Technology",
              "slug": "technology"
            }
          }
        ]
      },
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "content": {
      "id": "uuid",
      "name": "Blog Post",
      "slug": "blog-post"
    },
    "workspace": {
      "id": "uuid",
      "name": "My Blog",
      "slug": "my-blog"
    },
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    },
    "schema": [
      {
        "name": "title",
        "display_name": "Title",
        "type": "TEXT",
        "required": true,
        "multiple": false,
        "relation_to_content": null
      },
      {
        "name": "author",
        "display_name": "Author",
        "type": "RELATION",
        "required": true,
        "multiple": false,
        "relation_to_content": {
          "id": "uuid",
          "name": "Author",
          "slug": "author"
        }
      }
    ]
  }
}
```

#### GET /api/:workspace_slug/:content_slug/:entry_id

Get a single public content entry.

**No authentication required**

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "content_id": "uuid",
    "data": {
      "title": "My Blog Post",
      "content": "<p>Content here</p>",
      "author": {
        "id": "author-entry-id",
        "data": {
          "name": "John Doe",
          "email": "john@example.com"
        }
      }
    },
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "meta": {
    "content": {
      "id": "uuid",
      "name": "Blog Post",
      "slug": "blog-post"
    },
    "workspace": {
      "id": "uuid",
      "name": "My Blog",
      "slug": "my-blog"
    },
    "schema": [...]
  }
}
```

## Field Types

### Supported Field Types

| Type        | Description                | Example Value                          |
| ----------- | -------------------------- | -------------------------------------- |
| `TEXT`      | Single line text           | `"Hello World"`                        |
| `TEXTAREA`  | Multi-line text            | `"Line 1\nLine 2"`                     |
| `RICH_TEXT` | HTML content               | `"<p>Rich <strong>text</strong></p>"`  |
| `NUMBER`    | Numeric value              | `42`                                   |
| `BOOLEAN`   | True/false                 | `true`                                 |
| `EMAIL`     | Email address              | `"user@example.com"`                   |
| `URL`       | Web URL                    | `"https://example.com"`                |
| `DATE`      | Date only                  | `"2024-01-01"`                         |
| `DATETIME`  | Date and time              | `"2024-01-01T12:00:00Z"`               |
| `RELATION`  | Reference to another entry | `"entry-uuid"` or `["uuid1", "uuid2"]` |
| `MEDIA`     | File reference             | `"media-uuid"`                         |

### Field Definition Properties

| Property                 | Type    | Description                       |
| ------------------------ | ------- | --------------------------------- |
| `name`                   | string  | Field identifier (snake_case)     |
| `display_name`           | string  | Human-readable label              |
| `type`                   | string  | Field type (see above)            |
| `required`               | boolean | Whether field is required         |
| `multiple`               | boolean | Allow multiple values (arrays)    |
| `placeholder`            | string  | Input placeholder text            |
| `default_value`          | any     | Default value for new entries     |
| `relation_to_content_id` | string  | Target content type for relations |

## Pagination

All list endpoints support pagination with the following parameters:

| Parameter   | Type   | Default    | Description              |
| ----------- | ------ | ---------- | ------------------------ |
| `page`      | number | 1          | Page number (1-based)    |
| `limit`     | number | 10         | Items per page (max 100) |
| `search`    | string | -          | Search term              |
| `sortBy`    | string | created_at | Field to sort by         |
| `sortOrder` | string | desc       | Sort order (asc/desc)    |

### Pagination Response

```json
{
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Error Codes

| Status | Code                   | Description               |
| ------ | ---------------------- | ------------------------- |
| 400    | `VALIDATION_ERROR`     | Request validation failed |
| 401    | `UNAUTHORIZED`         | Authentication required   |
| 403    | `FORBIDDEN`            | Access denied             |
| 404    | `NOT_FOUND`            | Resource not found        |
| 409    | `CONFLICT`             | Resource already exists   |
| 422    | `UNPROCESSABLE_ENTITY` | Invalid data format       |
| 500    | `INTERNAL_ERROR`       | Server error              |

## Rate Limiting

Public API endpoints are rate limited:

- 100 requests per minute per IP
- 1000 requests per hour per IP

Authenticated endpoints:

- 1000 requests per minute per user
- 10000 requests per hour per user

## OAuth Flow

### 1. Frontend Initiates OAuth

```javascript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: "google", // or 'github'
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
  },
});
```

### 2. Handle OAuth Callback

```javascript
// In your callback page
const {
  data: { session },
  error,
} = await supabase.auth.getSession();

if (session) {
  // Sync with backend
  const response = await fetch("/auth/oauth/callback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      access_token: session.access_token,
      user: session.user,
    }),
  });

  const { data } = await response.json();
  // Store JWT token: data.token
  // User data: data.user
  // Is new user: data.isNewUser
}
```

### 3. Use JWT Token

```javascript
// Include in all API requests
const headers = {
  Authorization: `Bearer ${jwtToken}`,
  "Content-Type": "application/json",
};
```

## Default Workspace Setup

When a new user registers via OAuth, the system automatically:

1. Creates a personalized workspace
2. Sets up default content types:
   - **Page** with fields: title, slug, content, published
   - **Blog Post** with fields: title, slug, excerpt, content, published, publish_date
3. Sets the new workspace as the user's active workspace

This ensures users can start creating content immediately after registration.
