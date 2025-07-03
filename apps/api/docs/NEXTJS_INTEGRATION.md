# Next.js 15 TypeScript Integration Guide

Complete guide for integrating your Headless CMS with Next.js 15 using TypeScript and Supabase authentication.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Installation & Setup](#installation--setup)
- [TypeScript Configuration](#typescript-configuration)
- [Environment Setup](#environment-setup)
- [Authentication with TypeScript](#authentication-with-typescript)
- [API Integration](#api-integration)
- [Type-Safe Components](#type-safe-components)
- [Hooks with TypeScript](#hooks-with-typescript)
- [App Router Implementation](#app-router-implementation)
- [Server Components](#server-components)
- [Advanced TypeScript Patterns](#advanced-typescript-patterns)

## 🚀 Quick Start

### 1. Create Next.js 15 Project

```bash
npx create-next-app@latest my-cms-frontend --typescript --tailwind --eslint --app
cd my-cms-frontend
```

### 2. Install Dependencies

```bash
# Core dependencies
npm install @supabase/supabase-js

# Type definitions
npm install -D @types/node

# Optional: UI libraries
npm install @headlessui/react @heroicons/react
npm install class-variance-authority clsx tailwind-merge
```

### 3. Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── callback/
│   │       └── page.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── workspaces/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── entries/
│   │       ├── page.tsx
│   │       └── [id]/
│   │           └── page.tsx
│   ├── api/
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── AuthProvider.tsx
│   ├── cms/
│   │   ├── WorkspaceList.tsx
│   │   ├── ObjectTypeList.tsx
│   │   ├── EntryList.tsx
│   │   └── EntryForm.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Modal.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useWorkspaces.ts
│   ├── useObjectTypes.ts
│   └── useEntries.ts
├── lib/
│   ├── supabase.ts
│   ├── api.ts
│   ├── types.ts
│   └── utils.ts
└── types/
    ├── auth.ts
    ├── cms.ts
    └── api.ts
```

## 🔧 Installation & Setup

### Step 1: Next.js 15 with TypeScript

```bash
npx create-next-app@latest my-cms-frontend \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

### Step 2: Install Required Packages

```bash
# Supabase client
npm install @supabase/supabase-js

# Form handling
npm install react-hook-form @hookform/resolvers zod

# UI components
npm install @headlessui/react @heroicons/react

# Utility libraries
npm install class-variance-authority clsx tailwind-merge
npm install date-fns

# Development dependencies
npm install -D @types/node
```

## ⚙️ TypeScript Configuration

### tsconfig.json

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    domains: ["your-supabase-project.supabase.co"],
  },
};

module.exports = nextConfig;
```

## 🌍 Environment Setup

### .env.local

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# API
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### Environment Types

```typescript
// types/env.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_APP_URL: string;
      NEXT_PUBLIC_GA_ID?: string;
    }
  }
}

export {};
```

## 🔐 Authentication with TypeScript

### Type Definitions

```typescript
// types/auth.ts
import { User as SupabaseUser } from "@supabase/supabase-js";

export interface User {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  avatar?: string;
  email_verified: boolean;
  workspace_id?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  cmsToken: string | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  signInWithOAuth: (
    provider: "google" | "github"
  ) => Promise<{ error: Error | null }>;
  signInWithEmail: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    metadata?: Record<string, any>
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  refreshToken: () => Promise<void>;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  full_name: string;
  username?: string;
}
```

### Supabase Client

```typescript
// lib/supabase.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: "pkce",
    },
  }
);

// Type-safe auth helpers
export const auth = {
  signInWithOAuth: (provider: "google" | "github") =>
    supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    }),

  signInWithPassword: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),

  signUp: (
    email: string,
    password: string,
    options?: { data?: Record<string, any> }
  ) => supabase.auth.signUp({ email, password, options }),

  signOut: () => supabase.auth.signOut(),

  getSession: () => supabase.auth.getSession(),

  getUser: () => supabase.auth.getUser(),

  onAuthStateChange: (callback: (event: string, session: any) => void) =>
    supabase.auth.onAuthStateChange(callback),
};
```

### Authentication Hook

```typescript
// hooks/useAuth.ts
'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { supabase, auth } from '@/lib/supabase'
import { AuthContextType, AuthState, User } from '@/types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    supabaseUser: null,
    cmsToken: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await auth.getSession()

        if (error) {
          setState(prev => ({ ...prev, error: error.message, loading: false }))
          return
        }

        if (session) {
          await handleAuthSession(session)
        } else {
          setState(prev => ({ ...prev, loading: false }))
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Unknown error',
          loading: false
        }))
      }
    }

    getInitialSession()

    // Listen for auth state changes
    const { data: { subscription } } = auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)

        if (session) {
          await handleAuthSession(session)
        } else {
          setState({
            user: null,
            supabaseUser: null,
            cmsToken: null,
            loading: false,
            error: null
          })
          localStorage.removeItem('cms_token')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleAuthSession = async (session: Session) => {
    try {
      setState(prev => ({ ...prev, supabaseUser: session.user }))

      const cmsUser = await syncWithBackend(session)

      setState({
        user: cmsUser,
        supabaseUser: session.user,
        cmsToken: localStorage.getItem('cms_token'),
        loading: false,
        error: null
      })
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to sync user',
        loading: false
      }))
    }
  }

  const syncWithBackend = async (session: Session): Promise<User> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/oauth/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: session.access_token,
        user: session.user
      })
    })

    if (!response.ok) {
      throw new Error('Failed to sync with backend')
    }

    const data = await response.json()
    localStorage.setItem('cms_token', data.token)

    return data.user
  }

  const signInWithOAuth = async (provider: 'google' | 'github') => {
    setState(prev => ({ ...prev, error: null }))
    const { error } = await auth.signInWithOAuth(provider)

    if (error) {
      setState(prev => ({ ...prev, error: error.message }))
    }

    return { error }
  }

  const signInWithEmail = async (email: string, password: string) => {
    setState(prev => ({ ...prev, error: null, loading: true }))
    const { error } = await auth.signInWithPassword(email, password)

    if (error) {
      setState(prev => ({ ...prev, error: error.message, loading: false }))
    }

    return { error }
  }

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    setState(prev => ({ ...prev, error: null, loading: true }))
    const { error } = await auth.signUp(email, password, { data: metadata })

    if (error) {
      setState(prev => ({ ...prev, error: error.message, loading: false }))
    }

    return { error }
  }

  const signOut = async () => {
    const { error } = await auth.signOut()

    if (!error) {
      setState({
        user: null,
        supabaseUser: null,
        cmsToken: null,
        loading: false,
        error: null
      })
      localStorage.removeItem('cms_token')
    }

    return { error }
  }

  const refreshToken = async () => {
    const { data: { session } } = await auth.getSession()
    if (session) {
      await handleAuthSession(session)
    }
  }

  const value: AuthContextType = {
    ...state,
    signInWithOAuth,
    signInWithEmail,
    signUp,
    signOut,
    refreshToken
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

## 🔌 API Integration

### CMS Types

```typescript
// types/cms.ts
export interface Workspace {
  id: string;
  name: string;
  slug: string;
  status: "Active" | "Inactive" | "Suspended";
  created_at: string;
  updated_at: string;
  creator: {
    id: string;
    email: string;
    full_name?: string;
  };
  _count?: {
    members: number;
    object_types: number;
  };
}

export interface ObjectType {
  id: string;
  name: string;
  slug: string;
  workspace_id: string;
  created_at: string;
  updated_at: string;
  field_definitions: FieldDefinition[];
  workspace?: {
    id: string;
    name: string;
    slug: string;
  };
  _count?: {
    entries: number;
  };
}

export interface FieldDefinition {
  id: string;
  name: string;
  display_name: string;
  type: FieldType;
  required: boolean;
  multiple: boolean;
  placeholder?: string;
  default_value?: any;
  relation_to_id?: string;
  relation_to?: {
    id: string;
    name: string;
    slug: string;
  };
}

export type FieldType =
  | "TEXT"
  | "TEXTAREA"
  | "RICH_TEXT"
  | "NUMBER"
  | "BOOLEAN"
  | "EMAIL"
  | "URL"
  | "DATE"
  | "DATETIME"
  | "RELATION"
  | "MEDIA";

export interface Entry {
  id: string;
  object_type_id: string;
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
  object_type: {
    id: string;
    name: string;
    slug: string;
    workspace?: {
      id: string;
      name: string;
      slug: string;
    };
  };
  creator?: {
    id: string;
    email: string;
    full_name?: string;
  };
}

export interface CreateWorkspaceData {
  name: string;
  slug: string;
  status?: string;
}

export interface CreateObjectTypeData {
  name: string;
  slug: string;
  workspace_id: string;
  field_definitions?: Omit<FieldDefinition, "id">[];
}

export interface CreateEntryData {
  object_type_id: string;
  data: Record<string, any>;
}
```

### API Client

```typescript
// lib/api.ts
import {
  Workspace,
  ObjectType,
  Entry,
  CreateWorkspaceData,
  CreateObjectTypeData,
  CreateEntryData,
} from "@/types/cms";

interface ApiResponse<T> {
  data?: T;
  entries?: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  meta?: any;
}

interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL!;
    if (!this.baseURL) {
      throw new Error("NEXT_PUBLIC_API_URL is not defined");
    }
  }

  private getAuthHeaders(): HeadersInit {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("cms_token") : null;
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const config: RequestInit = {
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        statusCode: response.status,
        message: response.statusText,
        error: "Unknown error",
      }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.request<{ user: any; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    email: string;
    password: string;
    full_name?: string;
    username?: string;
  }) {
    return this.request<{ user: any; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  // User methods
  async getProfile() {
    return this.request<any>("/users/profile");
  }

  async updateProfile(data: Partial<any>) {
    return this.request<any>("/users/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  // Workspace methods
  async getWorkspaces(): Promise<Workspace[]> {
    return this.request<Workspace[]>("/workspaces");
  }

  async createWorkspace(data: CreateWorkspaceData): Promise<Workspace> {
    return this.request<Workspace>("/workspaces", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getWorkspace(id: string): Promise<Workspace> {
    return this.request<Workspace>(`/workspaces/${id}`);
  }

  async updateWorkspace(
    id: string,
    data: Partial<CreateWorkspaceData>
  ): Promise<Workspace> {
    return this.request<Workspace>(`/workspaces/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteWorkspace(id: string): Promise<void> {
    return this.request<void>(`/workspaces/${id}`, {
      method: "DELETE",
    });
  }

  // Object Type methods
  async getObjectTypes(workspaceId: string): Promise<ObjectType[]> {
    return this.request<ObjectType[]>(
      `/object-types?workspace_id=${workspaceId}`
    );
  }

  async createObjectType(data: CreateObjectTypeData): Promise<ObjectType> {
    return this.request<ObjectType>("/object-types", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getObjectType(id: string): Promise<ObjectType> {
    return this.request<ObjectType>(`/object-types/${id}`);
  }

  async updateObjectType(
    id: string,
    data: Partial<CreateObjectTypeData>
  ): Promise<ObjectType> {
    return this.request<ObjectType>(`/object-types/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteObjectType(id: string): Promise<void> {
    return this.request<void>(`/object-types/${id}`, {
      method: "DELETE",
    });
  }

  // Entry methods
  async getEntries(
    params: {
      object_type_id?: string;
      workspace_id?: string;
      page?: number;
      limit?: number;
      sort?: string;
      order?: "asc" | "desc";
    } = {}
  ): Promise<ApiResponse<Entry>> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        query.append(key, value.toString());
      }
    });

    return this.request<ApiResponse<Entry>>(`/entries?${query}`);
  }

  async createEntry(data: CreateEntryData): Promise<Entry> {
    return this.request<Entry>("/entries", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getEntry(id: string): Promise<Entry> {
    return this.request<Entry>(`/entries/${id}`);
  }

  async updateEntry(
    id: string,
    data: Partial<CreateEntryData>
  ): Promise<Entry> {
    return this.request<Entry>(`/entries/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteEntry(id: string): Promise<void> {
    return this.request<void>(`/entries/${id}`, {
      method: "DELETE",
    });
  }

  // Public API methods (no auth required)
  async getPublicEntries(
    workspaceSlug: string,
    objectTypeSlug: string,
    params: {
      page?: number;
      limit?: number;
      sort?: string;
      order?: "asc" | "desc";
    } = {}
  ): Promise<ApiResponse<Entry>> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        query.append(key, value.toString());
      }
    });

    const response = await fetch(
      `${this.baseURL}/api/${workspaceSlug}/${objectTypeSlug}?${query}`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  }

  async getPublicEntry(
    workspaceSlug: string,
    objectTypeSlug: string,
    entryId: string
  ): Promise<ApiResponse<Entry>> {
    const response = await fetch(
      `${this.baseURL}/api/${workspaceSlug}/${objectTypeSlug}/${entryId}`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  }
}

export const api = new ApiClient();
```

## 🧩 Type-Safe Components

### Login Form Component

```typescript
// components/auth/LoginForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  redirectTo?: string
}

export default function LoginForm({ redirectTo = '/dashboard' }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { signInWithEmail, signInWithOAuth, error } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)

    const { error } = await signInWithEmail(data.email, data.password)

    if (!error) {
      router.push(redirectTo)
    }

    setIsLoading(false)
  }

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    const { error } = await signInWithOAuth(provider)
    if (error) {
      console.error('OAuth login error:', error)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
        Sign In
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <Input
            id="password"
            type="password"
            {...register('password')}
            error={errors.password?.message}
            className="mt-1"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
          variant="primary"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            type="button"
            onClick={() => handleOAuthLogin('google')}
            variant="outline"
            className="w-full"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              {/* Google icon SVG */}
            </svg>
            Google
          </Button>

          <Button
            type="button"
            onClick={() => handleOAuthLogin('github')}
            variant="outline"
            className="w-full"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              {/* GitHub icon SVG */}
            </svg>
            GitHub
          </Button>
        </div>
      </div>
    </div>
  )
}
```

### Protected Route Component

```typescript
// components/auth/ProtectedRoute.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
  requireWorkspace?: boolean
}

export default function ProtectedRoute({
  children,
  redirectTo = '/login',
  requireWorkspace = false
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(redirectTo)
        return
      }

      if (requireWorkspace && !user.workspace_id) {
        router.push('/onboarding')
        return
      }
    }
  }, [user, loading, router, redirectTo, requireWorkspace])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requireWorkspace && !user.workspace_id) {
    return null
  }

  return <>{children}</>
}
```

### Workspace List Component

```typescript
// components/cms/WorkspaceList.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PlusIcon, UsersIcon, FolderIcon } from '@heroicons/react/24/outline'
import { useWorkspaces } from '@/hooks/useWorkspaces'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { CreateWorkspaceForm } from './CreateWorkspaceForm'
import type { Workspace } from '@/types/cms'

interface WorkspaceListProps {
  className?: string
}

export default function WorkspaceList({ className }: WorkspaceListProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { workspaces, loading, error, createWorkspace } = useWorkspaces()

  const handleCreateWorkspace = async (data: { name: string; slug: string }) => {
    try {
      await createWorkspace(data)
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('Failed to create workspace:', error)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Error loading workspaces: {error}</div>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Workspaces</h2>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create Workspace
        </Button>
      </div>

      {workspaces.length === 0 ? (
        <div className="text-center py-12">
          <FolderIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No workspaces yet
          </h3>
          <p className="text-gray-500 mb-4">
            Create your first workspace to get started with content management.
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            Create Your First Workspace
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace: Workspace) => (
            <Link
              key={workspace.id}
              href={`/dashboard/workspaces/${workspace.id}`}
              className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 hover:border-gray-300"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {workspace.name}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                /{workspace.slug}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <FolderIcon className="w-4 h-4 mr-1" />
                  {workspace._count?.object_types || 0} content types
                </div>
                <div className="flex items-center">
                  <UsersIcon className="w-4 h-4 mr-1" />
                  {workspace._count?.members || 0} members
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                Created {new Date(workspace.created_at).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Workspace"
      >
        <CreateWorkspaceForm
          onSubmit={handleCreateWorkspace}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>
    </div>
  )
}
```

## 🪝 Hooks with TypeScript

### Workspaces Hook

```typescript
// hooks/useWorkspaces.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import type { Workspace, CreateWorkspaceData } from "@/types/cms";

interface UseWorkspacesReturn {
  workspaces: Workspace[];
  loading: boolean;
  error: string | null;
  createWorkspace: (data: CreateWorkspaceData) => Promise<Workspace>;
  updateWorkspace: (
    id: string,
    data: Partial<CreateWorkspaceData>
  ) => Promise<Workspace>;
  deleteWorkspace: (id: string) => Promise<void>;
  refreshWorkspaces: () => Promise<void>;
}

export function useWorkspaces(): UseWorkspacesReturn {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWorkspaces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getWorkspaces();
      setWorkspaces(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load workspaces"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkspaces();
  }, [loadWorkspaces]);

  const createWorkspace = useCallback(
    async (workspaceData: CreateWorkspaceData): Promise<Workspace> => {
      try {
        const newWorkspace = await api.createWorkspace(workspaceData);
        setWorkspaces((prev) => [newWorkspace, ...prev]);
        return newWorkspace;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create workspace";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  const updateWorkspace = useCallback(
    async (
      id: string,
      updates: Partial<CreateWorkspaceData>
    ): Promise<Workspace> => {
      try {
        const updated = await api.updateWorkspace(id, updates);
        setWorkspaces((prev) => prev.map((w) => (w.id === id ? updated : w)));
        return updated;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update workspace";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  const deleteWorkspace = useCallback(async (id: string): Promise<void> => {
    try {
      await api.deleteWorkspace(id);
      setWorkspaces((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete workspace";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const refreshWorkspaces = useCallback(async (): Promise<void> => {
    await loadWorkspaces();
  }, [loadWorkspaces]);

  return {
    workspaces,
    loading,
    error,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    refreshWorkspaces,
  };
}
```

### Entries Hook

```typescript
// hooks/useEntries.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import type { Entry, CreateEntryData } from "@/types/cms";

interface UseEntriesParams {
  objectTypeId?: string;
  workspaceId?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

interface UseEntriesReturn {
  entries: Entry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
  loading: boolean;
  error: string | null;
  createEntry: (data: CreateEntryData) => Promise<Entry>;
  updateEntry: (id: string, data: Partial<CreateEntryData>) => Promise<Entry>;
  deleteEntry: (id: string) => Promise<void>;
  refreshEntries: () => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

export function useEntries(params: UseEntriesParams = {}): UseEntriesReturn {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEntries = useCallback(
    async (append = false) => {
      if (!params.objectTypeId && !params.workspaceId) {
        setLoading(false);
        return;
      }

      try {
        if (!append) {
          setLoading(true);
        }
        setError(null);

        const currentPage =
          append && pagination ? pagination.page + 1 : params.page || 1;

        const response = await api.getEntries({
          ...params,
          page: currentPage,
        });

        if (response.entries) {
          if (append) {
            setEntries((prev) => [...prev, ...response.entries!]);
          } else {
            setEntries(response.entries);
          }
        }

        if (response.pagination) {
          setPagination(response.pagination);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load entries");
      } finally {
        setLoading(false);
      }
    },
    [params, pagination]
  );

  useEffect(() => {
    loadEntries();
  }, [params.objectTypeId, params.workspaceId, params.sort, params.order]);

  const createEntry = useCallback(
    async (entryData: CreateEntryData): Promise<Entry> => {
      try {
        const newEntry = await api.createEntry(entryData);
        setEntries((prev) => [newEntry, ...prev]);
        return newEntry;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create entry";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  const updateEntry = useCallback(
    async (id: string, updates: Partial<CreateEntryData>): Promise<Entry> => {
      try {
        const updated = await api.updateEntry(id, updates);
        setEntries((prev) => prev.map((e) => (e.id === id ? updated : e)));
        return updated;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update entry";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  const deleteEntry = useCallback(async (id: string): Promise<void> => {
    try {
      await api.deleteEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete entry";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const refreshEntries = useCallback(async (): Promise<void> => {
    await loadEntries(false);
  }, [loadEntries]);

  const loadMore = useCallback(async (): Promise<void> => {
    if (pagination && pagination.page < pagination.pages) {
      await loadEntries(true);
    }
  }, [loadEntries, pagination]);

  const hasMore = pagination ? pagination.page < pagination.pages : false;

  return {
    entries,
    pagination,
    loading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    refreshEntries,
    loadMore,
    hasMore,
  };
}
```

## 📱 App Router Implementation

### Root Layout

```typescript
// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/hooks/useAuth'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Headless CMS',
  description: 'A powerful headless CMS built with Next.js 15 and TypeScript',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

### Login Page

```typescript
// app/(auth)/login/page.tsx
import { Metadata } from 'next'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Login - Headless CMS',
  description: 'Sign in to your Headless CMS account',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-gray-900">
            Headless CMS
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to manage your content
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
```

### Auth Callback Route

```typescript
// app/auth/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
    } catch (error) {
      console.error("Auth callback error:", error);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
```

### Dashboard Page

```typescript
// app/dashboard/page.tsx
import { Metadata } from 'next'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import WorkspaceList from '@/components/cms/WorkspaceList'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

export const metadata: Metadata = {
  title: 'Dashboard - Headless CMS',
  description: 'Manage your content and workspaces',
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <WorkspaceList />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
```

### Dynamic Workspace Page

```typescript
// app/dashboard/workspaces/[id]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import WorkspaceDetail from '@/components/cms/WorkspaceDetail'

interface WorkspacePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: WorkspacePageProps): Promise<Metadata> {
  return {
    title: `Workspace - Headless CMS`,
    description: 'Manage your workspace content and settings',
  }
}

export default function WorkspacePage({ params }: WorkspacePageProps) {
  if (!params.id) {
    notFound()
  }

  return (
    <ProtectedRoute>
      <WorkspaceDetail workspaceId={params.id} />
    </ProtectedRoute>
  )
}
```

## 🖥️ Server Components

### Server-Side Data Fetching

```typescript
// app/blog/page.tsx
import { Metadata } from 'next'
import { api } from '@/lib/api'
import BlogPostList from '@/components/blog/BlogPostList'

export const metadata: Metadata = {
  title: 'Blog - My Website',
  description: 'Read our latest blog posts',
}

interface BlogPageProps {
  searchParams: {
    page?: string
    limit?: string
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = Number(searchParams.page) || 1
  const limit = Number(searchParams.limit) || 10

  try {
    const response = await api.getPublicEntries('my-blog', 'blog-post', {
      page,
      limit,
      sort: 'created_at',
      order: 'desc'
    })

    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Blog</h1>
        <BlogPostList
          posts={response.data || []}
          pagination={response.meta?.pagination}
        />
      </div>
    )
  } catch (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Blog</h1>
        <p className="text-red-600">Failed to load blog posts.</p>
      </div>
    )
  }
}
```

### Static Generation with TypeScript

```typescript
// app/blog/[slug]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { api } from '@/lib/api'
import BlogPost from '@/components/blog/BlogPost'
import type { Entry } from '@/types/cms'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  try {
    const response = await api.getPublicEntries('my-blog', 'blog-post', {
      limit: 100
    })

    return (response.data || []).map((post: Entry) => ({
      slug: post.data.slug as string
    }))
  } catch (error) {
    return []
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const response = await api.getPublicEntries('my-blog', 'blog-post', {
      limit: 1
    })

    const post = (response.data || []).find((p: Entry) => p.data.slug === params.slug)

    if (!post) {
      return {
        title: 'Post Not Found',
      }
    }

    return {
      title: `${post.data.title} - Blog`,
      description: post.data.excerpt || post.data.title,
      openGraph: {
        title: post.data.title,
        description: post.data.excerpt || post.data.title,
        type: 'article',
        publishedTime: post.created_at,
        modifiedTime: post.updated_at,
      },
    }
  } catch (error) {
    return {
      title: 'Blog Post',
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const response = await api.getPublicEntries('my-blog', 'blog-post', {
      limit: 100
    })

    const post = (response.data || []).find((p: Entry) => p.data.slug === params.slug)

    if (!post) {
      notFound()
    }

    return <BlogPost post={post} />
  } catch (error) {
    notFound()
  }
}
```

## 🔧 Advanced TypeScript Patterns

### Generic API Hook

```typescript
// hooks/useApiData.ts
"use client";

import { useState, useEffect, useCallback } from "react";

interface UseApiDataOptions<T> {
  initialData?: T;
  dependencies?: any[];
  enabled?: boolean;
}

interface UseApiDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useApiData<T>(
  fetcher: () => Promise<T>,
  options: UseApiDataOptions<T> = {}
): UseApiDataReturn<T> {
  const { initialData = null, dependencies = [], enabled = true } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [fetcher, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}
```

### Type-Safe Form Hook

```typescript
// hooks/useTypedForm.ts
"use client";

import { useForm, UseFormProps, FieldValues, Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface UseTypedFormProps<T extends FieldValues> extends UseFormProps<T> {
  schema: z.ZodSchema<T>;
}

export function useTypedForm<T extends FieldValues>({
  schema,
  ...props
}: UseTypedFormProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    ...props,
  });

  const getFieldError = (fieldName: Path<T>) => {
    return form.formState.errors[fieldName]?.message as string | undefined;
  };

  const isFieldInvalid = (fieldName: Path<T>) => {
    return !!form.formState.errors[fieldName];
  };

  return {
    ...form,
    getFieldError,
    isFieldInvalid,
  };
}
```

### Utility Types

```typescript
// types/utils.ts
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type ApiResponse<T> = {
  data?: T;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    [key: string]: any;
  };
  error?: string;
};

export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export type FormState<T> = {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
};
```

This comprehensive Next.js 15 TypeScript documentation provides everything you need to build a type-safe frontend for your Headless CMS. The guide includes modern patterns, proper error handling, and follows Next.js 15 best practices with th
