# API Reference

Complete API reference for the Headless CMS REST API.

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
  "data": "...",
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
```

## Error Responses

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

## Endpoints

### Authentication

#### POST /auth/register

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "username": "johndoe"
}
```

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "username": "johndoe"
  },
  "token": "jwt-token"
}
```

#### POST /auth/login

Login with email and password.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe"
  },
  "token": "jwt-token"
}
```

#### GET /auth/oauth/callback

OAuth callback endpoint for Supabase authentication.

**Query Parameters:**

- `code` - OAuth authorization code
- `state` - OAuth state parameter

### Users

#### GET /users/profile

Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
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
```

#### GET /workspaces

Get user's workspaces.

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
[
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
      "object_types": 3
    }
  }
]
```

#### GET /workspaces/:id

Get workspace details.

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
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
  "object_types": [
    {
      "id": "uuid",
      "name": "Blog Post",
      "slug": "blog-post",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Object Types

#### POST /object-types

Create a new object type.

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
      "relation_to_id": "author-object-type-id",
      "required": true
    },
    {
      "name": "tags",
      "display_name": "Tags",
      "type": "RELATION",
      "relation_to_id": "tag-object-type-id",
      "multiple": true
    }
  ]
}
```

**Response:**

```json
{
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
      "relation_to": null
    }
  ],
  "workspace": {
    "id": "uuid",
    "name": "My Blog",
    "slug": "my-blog"
  }
}
```

#### GET /object-types

Get object types for a workspace.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `workspace_id` (required) - Workspace UUID

**Response:**

```json
[
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
```

### Entries

#### POST /entries

Create a new entry.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "object_type_id": "uuid",
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
  "id": "uuid",
  "object_type_id": "uuid",
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
  "object_type": {
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
```

#### GET /entries

Get entries with filtering and pagination.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `object_type_id` - Filter by object type
- `workspace_id` - Filter by workspace
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sort` - Sort field (default: created_at)
- `order` - Sort order: asc|desc (default: desc)

**Response:**

```json
{
  "entries": [
    {
      "id": "uuid",
      "object_type_id": "uuid",
      "data": {...},
      "created_at": "2024-01-01T00:00:00Z",
      "object_type": {
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
```

#### GET /entries/:id

Get a single entry.

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "id": "uuid",
  "object_type_id": "uuid",
  "data": {...},
  "created_at": "2024-01-01T00:00:00Z",
  "object_type": {
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
```

#### PATCH /entries/:id

Update an entry.

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

#### DELETE /entries/:id

Delete an entry (soft delete).

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "id": "uuid",
  "is_deleted": true,
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Public API

#### GET /api/:workspace_slug/:object_type_slug

Get public entries for a content type.

**No authentication required**

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `sort` - Sort field (default: created_at)
- `order` - Sort order: asc|desc (default: desc)

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "object_type_id": "uuid",
      "data": {
        "title": "My Blog Post",
        "content": "<p>Content here</p>",
        "author": {
          "id": "author-entry-id",
          "object_type_id": "author-object-type-id",
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
    "object_type": {
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
        "relation_to": null
      },
      {
        "name": "author",
        "display_name": "Author",
        "type": "RELATION",
        "required": true,
        "multiple": false,
        "relation_to": {
          "id": "uuid",
          "name": "Author",
          "slug": "author"
        }
      }
    ]
  }
}
```

#### GET /api/:workspace_slug/:object_type_slug/:entry_id

Get a single public entry.

**No authentication required**

**Response:**

```json
{
  "data": {
    "id": "uuid",
    "object_type_id": "uuid",
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
    "object_type": {
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

| Property         | Type    | Description                      |
| ---------------- | ------- | -------------------------------- |
| `name`           | string  | Field identifier (snake_case)    |
| `display_name`   | string  | Human-readable label             |
| `type`           | string  | Field type (see above)           |
| `required`       | boolean | Whether field is required        |
| `multiple`       | boolean | Allow multiple values (arrays)   |
| `placeholder`    | string  | Input placeholder text           |
| `default_value`  | any     | Default value for new entries    |
| `relation_to_id` | string  | Target object type for relations |

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

## Webhooks

Configure webhooks in your workspace settings to receive notifications for:

- Entry created
- Entry updated
- Entry deleted
- Object type created
- Object type updated

Webhook payload example:

```json
{
  "event": "entry.created",
  "workspace_id": "uuid",
  "object_type_id": "uuid",
  "entry_id": "uuid",
  "data": {...},
  "timestamp": "2024-01-01T00:00:00Z"
}
```
