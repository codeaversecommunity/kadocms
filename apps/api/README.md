# Headless CMS REST API

A powerful headless CMS built with NestJS, Supabase authentication, and Prisma ORM. This system allows you to create dynamic content types, manage entries, and generate public APIs for your content.

## 🚀 Features

- **Dynamic Content Types**: Create custom object types with flexible field definitions
- **Workspace Management**: Multi-tenant architecture with workspace isolation
- **Supabase Authentication**: OAuth and email/password authentication
- **Public API Generation**: Automatically generated REST APIs for your content
- **Relationship Support**: Create relations between different content types
- **Media Management**: Upload and manage media assets
- **API Usage Tracking**: Monitor API consumption per user
- **Role-based Access**: Workspace-level permissions

## 📋 Table of Contents

- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Content Management](#content-management)
- [Public API Usage](#public-api-usage)
- [Next.js Integration](#nextjs-integration)

## 🛠 Installation

```bash
# Clone the repository
git clone <repository-url>
cd headless-cms-api

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run start:dev
```

## 🔧 Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/headless_cms"

# Supabase
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Frontend URL (for OAuth redirects)
FRONTEND_URL="http://localhost:3000"

# Server
PORT=3001
```

## 🗄️ Database Setup

### Prisma Commands

```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# Create and run migrations
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio
```

### Database Schema Overview

The database uses a master-slave table naming convention:

- `tbm_*` - Master tables (core entities)
- `tbs_*` - Slave tables (relationship/logging tables)

**Core Tables:**

- `tbm_user` - User accounts
- `tbm_workspace` - Multi-tenant workspaces
- `tbm_object_type` - Content type definitions
- `tbm_field_definition` - Field schemas for content types
- `tbm_entry` - Actual content entries
- `tbm_media` - Media assets

## 📚 API Documentation

### Base URL

```
http://localhost:3001
```

### Authentication Endpoints

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "username": "johndoe"
}
```

#### Login User

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### OAuth Callback

```http
GET /auth/oauth/callback?code=xxx&state=xxx
```

### User Management

#### Get User Profile

```http
GET /users/profile
Authorization: Bearer <jwt-token>
```

#### Update Profile

```http
PATCH /users/profile
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "full_name": "John Smith",
  "username": "johnsmith"
}
```

### Workspace Management

#### Create Workspace

```http
POST /workspaces
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "My Blog",
  "slug": "my-blog",
  "status": "Active"
}
```

#### Get User Workspaces

```http
GET /workspaces
Authorization: Bearer <jwt-token>
```

#### Get Workspace Details

```http
GET /workspaces/{workspace-id}
Authorization: Bearer <jwt-token>
```

### Object Type Management

#### Create Object Type

```http
POST /object-types
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Blog Post",
  "slug": "blog-post",
  "workspace_id": "workspace-uuid",
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
      "name": "author",
      "display_name": "Author",
      "type": "RELATION",
      "relation_to_id": "author-object-type-id"
    }
  ]
}
```

#### Get Object Types

```http
GET /object-types?workspace_id={workspace-id}
Authorization: Bearer <jwt-token>
```

### Entry Management

#### Create Entry

```http
POST /entries
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "object_type_id": "object-type-uuid",
  "data": {
    "title": "My First Blog Post",
    "content": "<p>This is the content of my blog post.</p>",
    "author": "author-entry-id"
  }
}
```

#### Get Entries

```http
GET /entries?object_type_id={object-type-id}&page=1&limit=10
Authorization: Bearer <jwt-token>
```

#### Update Entry

```http
PATCH /entries/{entry-id}
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "data": {
    "title": "Updated Blog Post Title"
  }
}
```

### Public API Endpoints

#### Get Public Entries

```http
GET /api/{workspace-slug}/{object-type-slug}?page=1&limit=10&sort=created_at&order=desc
```

#### Get Single Public Entry

```http
GET /api/{workspace-slug}/{object-type-slug}/{entry-id}
```

**Example Response:**

```json
{
  "data": [
    {
      "id": "entry-uuid",
      "object_type_id": "object-type-uuid",
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
    }
  ],
  "meta": {
    "object_type": {
      "id": "object-type-uuid",
      "name": "Blog Post",
      "slug": "blog-post"
    },
    "workspace": {
      "id": "workspace-uuid",
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
        "multiple": false
      }
    ]
  }
}
```

## 🔐 Authentication

### JWT Token Usage

Include the JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Token Payload

```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "iat": 1640995200,
  "exp": 1641081600
}
```

## 📝 Content Management

### Field Types

The system supports various field types:

- `TEXT` - Single line text
- `TEXTAREA` - Multi-line text
- `RICH_TEXT` - HTML content
- `NUMBER` - Numeric values
- `BOOLEAN` - True/false values
- `EMAIL` - Email addresses
- `URL` - Web URLs
- `DATE` - Date values
- `DATETIME` - Date and time values
- `RELATION` - References to other entries
- `MEDIA` - File uploads

### Creating Relationships

To create relationships between content types:

1. Create the related object type first
2. Add a field with `type: "RELATION"`
3. Set `relation_to_id` to the target object type ID
4. Use `multiple: true` for one-to-many relationships

### Example: Blog with Authors

```javascript
// 1. Create Author object type
const authorType = {
  name: "Author",
  slug: "author",
  field_definitions: [
    { name: "name", display_name: "Name", type: "TEXT", required: true },
    { name: "email", display_name: "Email", type: "EMAIL", required: true },
    { name: "bio", display_name: "Biography", type: "TEXTAREA" },
  ],
};

// 2. Create Blog Post object type with author relation
const blogType = {
  name: "Blog Post",
  slug: "blog-post",
  field_definitions: [
    { name: "title", display_name: "Title", type: "TEXT", required: true },
    {
      name: "content",
      display_name: "Content",
      type: "RICH_TEXT",
      required: true,
    },
    {
      name: "author",
      display_name: "Author",
      type: "RELATION",
      relation_to_id: "author-object-type-id",
      required: true,
    },
  ],
};
```

## 🌐 Public API Usage

### Accessing Your Content

Once you've created object types and entries, they're automatically available via public API:

```javascript
// Fetch blog posts
const response = await fetch("http://localhost:3001/api/my-blog/blog-post");
const { data, meta } = await response.json();

// Fetch single blog post
const post = await fetch(
  "http://localhost:3001/api/my-blog/blog-post/entry-id"
);
const { data: postData } = await post.json();
```

### API Features

- **Automatic Pagination**: Use `page` and `limit` parameters
- **Sorting**: Use `sort` and `order` parameters
- **Relationship Resolution**: Related entries are automatically populated
- **Schema Information**: Field definitions included in response metadata
- **Usage Tracking**: API calls are logged for analytics

## 🔄 Next.js Integration

### Installation

```bash
npm install @supabase/supabase-js
```

### Environment Variables

Create `.env.local` in your Next.js project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Supabase Client Setup

```javascript
// lib/supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Authentication Hook

```javascript
// hooks/useAuth.js
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        setToken(session.access_token);
      }
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setUser(session.user);
        setToken(session.access_token);

        // Sync with your backend
        await syncUserWithBackend(session);
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const syncUserWithBackend = async (session) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth/callback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: session.access_token,
            user: session.user,
          }),
        }
      );

      const data = await response.json();
      localStorage.setItem("cms_token", data.token);
    } catch (error) {
      console.error("Failed to sync user:", error);
    }
  };

  const signInWithOAuth = async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    localStorage.removeItem("cms_token");
    return { error };
  };

  return {
    user,
    token,
    loading,
    signInWithOAuth,
    signOut,
  };
}
```

### Login Component

```javascript
// components/LoginForm.js
import { useAuth } from "../hooks/useAuth";

export default function LoginForm() {
  const { signInWithOAuth, loading } = useAuth();

  const handleGoogleLogin = async () => {
    const { error } = await signInWithOAuth("google");
    if (error) console.error("Login error:", error);
  };

  const handleGitHubLogin = async () => {
    const { error } = await signInWithOAuth("github");
    if (error) console.error("Login error:", error);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <button
        onClick={handleGoogleLogin}
        className="w-full bg-red-500 text-white p-3 rounded"
      >
        Continue with Google
      </button>

      <button
        onClick={handleGitHubLogin}
        className="w-full bg-gray-800 text-white p-3 rounded"
      >
        Continue with GitHub
      </button>
    </div>
  );
}
```

### Auth Callback Page

```javascript
// pages/auth/callback.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Auth error:", error);
        router.push("/login?error=auth_failed");
        return;
      }

      if (data.session) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div>Processing authentication...</div>
    </div>
  );
}
```

### API Client

```javascript
// lib/api.js
class ApiClient {
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL;
  }

  async request(endpoint, options = {}) {
    const token = localStorage.getItem("cms_token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Workspace methods
  async getWorkspaces() {
    return this.request("/workspaces");
  }

  async createWorkspace(data) {
    return this.request("/workspaces", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Object type methods
  async getObjectTypes(workspaceId) {
    return this.request(`/object-types?workspace_id=${workspaceId}`);
  }

  async createObjectType(data) {
    return this.request("/object-types", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Entry methods
  async getEntries(objectTypeId, params = {}) {
    const query = new URLSearchParams({
      object_type_id: objectTypeId,
      ...params,
    });
    return this.request(`/entries?${query}`);
  }

  async createEntry(data) {
    return this.request("/entries", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Public API methods
  async getPublicEntries(workspaceSlug, objectTypeSlug, params = {}) {
    const query = new URLSearchParams(params);
    const response = await fetch(
      `${this.baseURL}/api/${workspaceSlug}/${objectTypeSlug}?${query}`
    );
    return response.json();
  }
}

export const api = new ApiClient();
```

### Protected Route Component

```javascript
// components/ProtectedRoute.js
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return children;
}
```

### Usage Example

```javascript
// pages/dashboard.js
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../hooks/useAuth";
import { api } from "../lib/api";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    const loadWorkspaces = async () => {
      try {
        const data = await api.getWorkspaces();
        setWorkspaces(data);
      } catch (error) {
        console.error("Failed to load workspaces:", error);
      }
    };

    loadWorkspaces();
  }, []);

  return (
    <ProtectedRoute>
      <div>
        <h1>Welcome, {user?.email}</h1>
        <button onClick={signOut}>Sign Out</button>

        <div>
          <h2>Your Workspaces</h2>
          {workspaces.map((workspace) => (
            <div key={workspace.id}>
              <h3>{workspace.name}</h3>
              <p>{workspace.slug}</p>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
```

## 🚀 Deployment

### Environment Variables for Production

```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-production-anon-key"
JWT_SECRET="your-production-jwt-secret"
FRONTEND_URL="https://your-frontend-domain.com"
PORT=3001
```

### Build Commands

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

## 📞 Support

For issues and questions:

1. Check the API documentation above
2. Review the example implementations
3. Ensure environment variables are correctly set
4. Verify Supabase OAuth configuration

## 🔄 Updates

To update the system:

1. Pull latest changes
2. Run `npm install` for new dependencies
3. Run `npm run prisma:migrate` for database updates
4. Restart the server

---

This headless CMS provides a complete solution for managing dynamic content with a powerful API. The combination of NestJS, Supabase, and Prisma offers scalability, security, and flexibility for modern applications.
