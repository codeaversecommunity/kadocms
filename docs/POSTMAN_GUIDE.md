# Postman Collection Guide

Complete guide for using the Headless CMS API Postman collection.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Collection Import](#collection-import)
- [Environment Setup](#environment-setup)
- [Authentication Flow](#authentication-flow)
- [Testing Workflow](#testing-workflow)
- [Environment Variables](#environment-variables)
- [Common Use Cases](#common-use-cases)

## 🚀 Quick Start

### 1. Import Collection

1. Download the `POSTMAN_COLLECTION.json` file
2. Open Postman
3. Click "Import" button
4. Select the JSON file
5. Collection will be imported with all endpoints

### 2. Set Up Environment

Create a new environment in Postman with these variables:

```
base_url: http://localhost:3001
jwt_token: (will be auto-populated)
workspace_id: (will be auto-populated)
content_id: (will be auto-populated)
entry_id: (will be auto-populated)
```

### 3. Test API Health

Run the "Health Check" → "Get API Status" request to verify the API is running.

## 📥 Collection Import

### Method 1: Direct Import

1. Open Postman
2. Click "Import" in the top left
3. Select "Upload Files"
4. Choose `POSTMAN_COLLECTION.json`
5. Click "Import"

### Method 2: Import from URL

1. Click "Import" → "Link"
2. Paste the raw GitHub URL of the collection file
3. Click "Continue" → "Import"

## 🌍 Environment Setup

### Create Environment

1. Click the gear icon (⚙️) in the top right
2. Click "Add" to create new environment
3. Name it "Headless CMS - Local"
4. Add these variables:

| Variable       | Initial Value           | Current Value           |
| -------------- | ----------------------- | ----------------------- |
| `base_url`     | `http://localhost:3001` | `http://localhost:3001` |
| `jwt_token`    |                         | (auto-populated)        |
| `workspace_id` |                         | (auto-populated)        |
| `content_id`   |                         | (auto-populated)        |
| `entry_id`     |                         | (auto-populated)        |

### Production Environment

For production, create another environment:

| Variable       | Initial Value                 |
| -------------- | ----------------------------- |
| `base_url`     | `https://your-api-domain.com` |
| `jwt_token`    |                               |
| `workspace_id` |                               |
| `content_id`   |                               |
| `entry_id`     |                               |

## 🔐 Authentication Flow

### Step 1: OAuth with Supabase

Since this API uses OAuth-only authentication, you need to:

1. Set up Supabase OAuth in your frontend application
2. Get the access token and user data from Supabase
3. Use the "OAuth Callback" endpoint in Postman

### Step 2: OAuth Callback Request

```json
POST /auth/oauth/callback
{
  "access_token": "supabase-access-token-here",
  "user": {
    "id": "supabase-user-id",
    "email": "user@example.com",
    "email_confirmed_at": "2024-01-01T00:00:00Z",
    "user_metadata": {
      "full_name": "John Doe",
      "avatar_url": "https://example.com/avatar.jpg",
      "user_name": "johndoe"
    }
  }
}
```

### Step 3: Auto Token Storage

The collection includes automatic scripts that:

- Extract JWT token from OAuth response
- Store it in `jwt_token` environment variable
- Use it for all subsequent authenticated requests

## 🧪 Testing Workflow

### Complete Testing Flow

1. **Health Check**

   ```
   GET /health
   ```

2. **Authentication**

   ```
   POST /auth/oauth/callback
   ```

   ✅ JWT token auto-saved to environment

3. **Get User Profile**

   ```
   GET /users/profile
   ```

4. **Create Workspace**

   ```
   POST /workspaces
   ```

   ✅ Workspace ID auto-saved to environment

5. **Create Content Type**

   ```
   POST /contents
   ```

   ✅ Content ID auto-saved to environment

6. **Create Content Entry**

   ```
   POST /content-entries
   ```

   ✅ Entry ID auto-saved to environment

7. **Test Public API**
   ```
   GET /api/{workspace-slug}/{content-slug}
   ```

### Automated Scripts

The collection includes pre-request and test scripts that:

#### Pre-request Scripts

- Set default base URL if not configured
- Validate required environment variables

#### Test Scripts

- Auto-extract and save JWT tokens
- Auto-extract and save resource IDs
- Validate response structure
- Log success messages

## 📊 Environment Variables

### Auto-Populated Variables

These variables are automatically set by the collection scripts:

| Variable       | Source                         | When Set                        |
| -------------- | ------------------------------ | ------------------------------- |
| `jwt_token`    | OAuth callback response        | After successful authentication |
| `workspace_id` | Workspace creation response    | After creating workspace        |
| `content_id`   | Content type creation response | After creating content type     |
| `entry_id`     | Entry creation response        | After creating entry            |

### Manual Variables

Set these manually in your environment:

| Variable   | Description  | Example                 |
| ---------- | ------------ | ----------------------- |
| `base_url` | API base URL | `http://localhost:3001` |

## 🎯 Common Use Cases

### 1. Blog Setup Workflow

```
1. POST /auth/oauth/callback (authenticate)
2. POST /workspaces (create blog workspace)
3. POST /contents (create "Blog Post" content type)
4. POST /contents (create "Author" content type)
5. POST /content-entries (create author entry)
6. POST /content-entries (create blog post entry)
7. GET /api/{workspace-slug}/blog-post (test public API)
```

### 2. Content Management

```
1. GET /workspaces (list workspaces)
2. GET /contents?workspace_id={{workspace_id}} (list content types)
3. GET /content-entries?content_id={{content_id}} (list entries)
4. PATCH /content-entries/{{entry_id}} (update entry)
```

### 3. Public API Testing

```
1. GET /api/{workspace-slug}/{content-slug} (list public entries)
2. GET /api/{workspace-slug}/{content-slug}/{entry-id} (get single entry)
```

## 🔧 Advanced Configuration

### Custom Headers

Add these headers for specific use cases:

```
Content-Type: application/json
Authorization: Bearer {{jwt_token}}
X-API-Version: v1
```

### Request Timeouts

Set appropriate timeouts for different request types:

- Health checks: 5 seconds
- Authentication: 10 seconds
- Data operations: 30 seconds
- File uploads: 60 seconds

### Retry Logic

Configure retry logic for:

- Network timeouts
- Rate limiting (429 responses)
- Server errors (5xx responses)

## 📝 Request Examples

### Create Blog Post Content Type

```json
POST /contents
{
  "name": "Blog Post",
  "slug": "blog-post",
  "workspace_id": "{{workspace_id}}",
  "field_definitions": [
    {
      "name": "title",
      "display_name": "Title",
      "type": "TEXT",
      "required": true
    },
    {
      "name": "content",
      "display_name": "Content",
      "type": "RICH_TEXT",
      "required": true
    },
    {
      "name": "published",
      "display_name": "Published",
      "type": "BOOLEAN",
      "required": false,
      "default_value": false
    }
  ]
}
```

### Create Blog Post Entry

```json
POST /content-entries
{
  "content_id": "{{content_id}}",
  "data": {
    "title": "My First Blog Post",
    "content": "<h1>Welcome to my blog!</h1><p>This is my first post.</p>",
    "published": true
  }
}
```

### Pagination Example

```
GET /workspaces?page=1&limit=5&search=blog&sortBy=created_at&sortOrder=desc
```

## 🐛 Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Check if JWT token is set in environment
   - Verify token hasn't expired
   - Re-authenticate using OAuth callback

2. **404 Not Found**
   - Verify resource IDs are correct
   - Check if resources were soft-deleted
   - Ensure workspace access permissions

3. **400 Bad Request**
   - Validate request body format
   - Check required fields
   - Verify field types match schema

4. **403 Forbidden**
   - Check workspace membership
   - Verify user permissions
   - Ensure workspace is active

### Debug Tips

1. **Enable Console Logging**

   ```javascript
   console.log("Request URL:", pm.request.url);
   console.log("JWT Token:", pm.environment.get("jwt_token"));
   ```

2. **Response Validation**

   ```javascript
   pm.test("Response has success field", function () {
     pm.expect(pm.response.json()).to.have.property("success");
   });
   ```

3. **Environment Debugging**
   ```javascript
   console.log("All Environment Variables:", pm.environment.toObject());
   ```

## 📚 Additional Resources

- [API Reference Documentation](./API_REFERENCE.md)
- [Next.js Integration Guide](./NEXTJS_15_TYPESCRIPT.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Postman Documentation](https://learning.postman.com/docs/)

## 🔄 Collection Updates

To update the collection:

1. Export your modified collection from Postman
2. Replace the `POSTMAN_COLLECTION.json` file
3. Update this guide if new endpoints were added
4. Test all endpoints to ensure compatibility

The collection is designed to be self-documenting and includes comprehensive examples for all API endpoints.
