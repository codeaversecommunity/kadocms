# Next.js 15 with TypeScript Integration Guide

Complete guide for integrating your Headless CMS with Next.js 15 using TypeScript and the latest features.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [Project Setup](#project-setup)
- [TypeScript Configuration](#typescript-configuration)
- [App Router Structure](#app-router-structure)
- [Authentication with Supabase](#authentication-with-supabase)
- [API Integration](#api-integration)
- [Server Components](#server-components)
- [Client Components](#client-components)
- [Data Fetching](#data-fetching)
- [Styling with Tailwind CSS](#styling-with-tailwind-css)
- [Deployment](#deployment)

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

# UI libraries (optional)
npm install @headlessui/react @heroicons/react
npm install clsx tailwind-merge

# Form handling
npm install react-hook-form @hookform/resolvers zod

# State management
npm install zustand

# Date handling
npm install date-fns
```

### 3. Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🔧 Installation

### Step 1: Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── callback/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── workspaces/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   └── content-entries/
│   │   │       ├── page.tsx
│   │   │       └── [id]/
│   │   │           └── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── modal.tsx
│   ├── auth/
│   │   ├── login-form.tsx
│   │   └── auth-provider.tsx
│   ├── dashboard/
│   │   ├── workspace-list.tsx
│   │   ├── content-list.tsx
│   │   └── entry-form.tsx
│   └── layout/
│       ├── header.tsx
│       ├── sidebar.tsx
│       └── footer.tsx
├── lib/
│   ├── supabase.ts
│   ├── api.ts
│   ├── utils.ts
│   ├── validations.ts
│   └── types.ts
├── hooks/
│   ├── use-auth.ts
│   ├── use-workspaces.ts
│   ├── use-contents.ts
│   └── use-entries.ts
├── stores/
│   ├── auth-store.ts
│   ├── workspace-store.ts
│   └── ui-store.ts
└── types/
    ├── auth.ts
    ├── workspace.ts
    ├── content.ts
    └── api.ts
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
      "@/types/*": ["./src/types/*"],
      "@/stores/*": ["./src/stores/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 📁 App Router Structure

### Root Layout

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/auth/auth-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Headless CMS',
  description: 'Modern headless CMS built with Next.js 15',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
```

### Dashboard Layout

```typescript
// src/app/(dashboard)/layout.tsx
import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { ProtectedRoute } from '@/components/auth/protected-route'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
```

## 🔐 Authentication with Supabase

### Types

```typescript
// src/types/auth.ts
export interface User {
  id: string;
  email: string;
  full_name?: string;
  username?: string;
  avatar?: string;
  email_verified: boolean;
  workspace_id?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export interface OAuthProvider {
  name: string;
  provider: "google" | "github";
  icon: React.ComponentType<{ className?: string }>;
}
```

### Supabase Client

```typescript
// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});

// Types for Supabase Auth
export type SupabaseUser = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    user_name?: string;
    preferred_username?: string;
    avatar_url?: string;
    picture?: string;
  };
  email_confirmed_at?: string;
};
```

### Auth Store with Zustand

```typescript
// src/stores/auth-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";
import type { User, AuthState } from "@/types/auth";

interface AuthStore extends AuthState {
  signInWithOAuth: (
    provider: "google" | "github"
  ) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  syncWithBackend: (session: any) => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: true,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      setLoading: (loading) => set({ loading }),

      signInWithOAuth: async (provider) => {
        try {
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
              redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
            },
          });

          if (error) {
            return { error: error.message };
          }

          return {};
        } catch (error) {
          return { error: "Failed to sign in" };
        }
      },

      signOut: async () => {
        try {
          await supabase.auth.signOut();
          set({ user: null, token: null, isAuthenticated: false });
          localStorage.removeItem("cms_token");
        } catch (error) {
          console.error("Sign out error:", error);
        }
      },

      syncWithBackend: async (session) => {
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

          if (response.ok) {
            const data = await response.json();
            set({
              user: data.data.user,
              token: data.data.token,
              isAuthenticated: true,
            });
            localStorage.setItem("cms_token", data.data.token);
          }
        } catch (error) {
          console.error("Failed to sync with backend:", error);
        }
      },

      initialize: async () => {
        try {
          set({ loading: true });

          // Get initial session
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();

          if (session && !error) {
            await get().syncWithBackend(session);
          }

          // Listen for auth state changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
              await get().syncWithBackend(session);
            } else {
              set({ user: null, token: null, isAuthenticated: false });
              localStorage.removeItem("cms_token");
            }
          });
        } catch (error) {
          console.error("Auth initialization error:", error);
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

### Auth Provider Component

```typescript
// src/components/auth/auth-provider.tsx
'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return <>{children}</>
}
```

### Protected Route Component

```typescript
// src/components/auth/protected-route.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, loading, router, redirectTo])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
```

## 🔌 API Integration

### API Client

```typescript
// src/lib/api.ts
import { PaginatedResult } from "@/types/api";

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL!;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("cms_token");
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
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
  }

  // Auth methods
  async syncOAuth(accessToken: string, user: any) {
    return this.request("/auth/oauth/callback", {
      method: "POST",
      body: JSON.stringify({ access_token: accessToken, user }),
    });
  }

  // User methods
  async getProfile() {
    return this.request("/users/profile");
  }

  async updateProfile(data: Partial<User>) {
    return this.request("/users/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  // Workspace methods
  async getWorkspaces(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<PaginatedResult<Workspace>> {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/workspaces?${query}`);
  }

  async createWorkspace(data: CreateWorkspaceData) {
    return this.request("/workspaces", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getWorkspace(id: string) {
    return this.request(`/workspaces/${id}`);
  }

  async updateWorkspace(id: string, data: UpdateWorkspaceData) {
    return this.request(`/workspaces/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteWorkspace(id: string) {
    return this.request(`/workspaces/${id}`, {
      method: "DELETE",
    });
  }

  // Content methods
  async getContents(workspaceId: string) {
    return this.request(`/contents?workspace_id=${workspaceId}`);
  }

  async createContent(data: CreateContentData) {
    return this.request("/contents", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getContent(id: string) {
    return this.request(`/contents/${id}`);
  }

  async updateContent(id: string, data: UpdateContentData) {
    return this.request(`/contents/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteContent(id: string) {
    return this.request(`/contents/${id}`, {
      method: "DELETE",
    });
  }

  // Content Entry methods
  async getContentEntries(params: {
    content_id?: string;
    workspace_id?: string;
    page?: number;
    limit?: number;
    sort?: string;
    order?: "asc" | "desc";
  }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/content-entries?${query}`);
  }

  async createContentEntry(data: CreateContentEntryData) {
    return this.request("/content-entries", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getContentEntry(id: string) {
    return this.request(`/content-entries/${id}`);
  }

  async updateContentEntry(id: string, data: UpdateContentEntryData) {
    return this.request(`/content-entries/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteContentEntry(id: string) {
    return this.request(`/content-entries/${id}`, {
      method: "DELETE",
    });
  }

  // Public API methods (no auth required)
  async getPublicEntries(
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
      `${this.baseURL}/api/${workspaceSlug}/${contentSlug}?${query}`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  }

  async getPublicEntry(
    workspaceSlug: string,
    contentSlug: string,
    entryId: string
  ) {
    const response = await fetch(
      `${this.baseURL}/api/${workspaceSlug}/${contentSlug}/${entryId}`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  }
}

export const api = new ApiClient();
```

## 🧩 Server Components

### Dashboard Page

```typescript
// src/app/(dashboard)/dashboard/page.tsx
import { Suspense } from 'react'
import { WorkspaceList } from '@/components/dashboard/workspace-list'
import { RecentEntries } from '@/components/dashboard/recent-entries'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Manage your content and workspaces</p>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <StatsCards />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Workspaces</h2>
          <Suspense fallback={<LoadingSpinner />}>
            <WorkspaceList />
          </Suspense>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Entries</h2>
          <Suspense fallback={<LoadingSpinner />}>
            <RecentEntries />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
```

### Workspace Detail Page

```typescript
// src/app/(dashboard)/dashboard/workspaces/[id]/page.tsx
import { notFound } from 'next/navigation'
import { api } from '@/lib/api'
import { ContentList } from '@/components/dashboard/content-list'
import { WorkspaceHeader } from '@/components/dashboard/workspace-header'

interface WorkspacePageProps {
  params: {
    id: string
  }
}

async function getWorkspace(id: string) {
  try {
    return await api.getWorkspace(id)
  } catch (error) {
    return null
  }
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const workspace = await getWorkspace(params.id)

  if (!workspace) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <WorkspaceHeader workspace={workspace} />
      <ContentList workspaceId={workspace.id} />
    </div>
  )
}

export async function generateMetadata({ params }: WorkspacePageProps) {
  const workspace = await getWorkspace(params.id)

  return {
    title: workspace ? `${workspace.name} - Headless CMS` : 'Workspace Not Found',
    description: workspace ? `Manage content for ${workspace.name}` : 'Workspace not found',
  }
}
```

## 🎨 Client Components

### Login Form

```typescript
// src/components/auth/login-form.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'
import { toast } from '@/hooks/use-toast'

const oauthProviders = [
  {
    name: 'Google',
    provider: 'google' as const,
    icon: Icons.google,
  },
  {
    name: 'GitHub',
    provider: 'github' as const,
    icon: Icons.github,
  },
]

export function LoginForm() {
  const [loading, setLoading] = useState<string | null>(null)
  const { signInWithOAuth } = useAuthStore()
  const router = useRouter()

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setLoading(provider)

    try {
      const { error } = await signInWithOAuth(provider)

      if (error) {
        toast({
          title: 'Authentication Error',
          description: error,
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Authentication Error',
        description: 'Failed to sign in. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(null)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription>
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {oauthProviders.map((provider) => {
          const Icon = provider.icon
          const isLoading = loading === provider.provider

          return (
            <Button
              key={provider.provider}
              variant="outline"
              className="w-full"
              onClick={() => handleOAuthLogin(provider.provider)}
              disabled={!!loading}
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icon className="mr-2 h-4 w-4" />
              )}
              Continue with {provider.name}
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}
```

### Workspace List Component

```typescript
// src/components/dashboard/workspace-list.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Icons } from '@/components/ui/icons'
import { toast } from '@/hooks/use-toast'
import type { Workspace } from '@/types/workspace'

export function WorkspaceList() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const loadWorkspaces = async (searchTerm = '', pageNum = 1) => {
    try {
      setLoading(true)
      const response = await api.getWorkspaces({
        page: pageNum,
        limit: 10,
        search: searchTerm,
        sortBy: 'created_at',
        sortOrder: 'desc'
      })

      if (pageNum === 1) {
        setWorkspaces(response.data)
      } else {
        setWorkspaces(prev => [...prev, ...response.data])
      }

      setHasMore(response.meta.hasNext)
      setPage(pageNum)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load workspaces',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWorkspaces()
  }, [])

  const handleSearch = (value: string) => {
    setSearch(value)
    loadWorkspaces(value, 1)
  }

  const loadMore = () => {
    loadWorkspaces(search, page + 1)
  }

  if (loading && workspaces.length === 0) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search workspaces..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1"
        />
        <Button asChild>
          <Link href="/dashboard/workspaces/new">
            <Icons.plus className="h-4 w-4 mr-2" />
            New Workspace
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {workspaces.map((workspace) => (
          <Card key={workspace.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    <Link
                      href={`/dashboard/workspaces/${workspace.id}`}
                      className="hover:text-blue-600"
                    >
                      {workspace.name}
                    </Link>
                  </CardTitle>
                  <CardDescription>/{workspace.slug}</CardDescription>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{workspace._count?.contents || 0} content types</span>
                  <span>•</span>
                  <span>{workspace._count?.members || 0} members</span>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {hasMore && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? (
              <Icons.spinner className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Load More
          </Button>
        </div>
      )}

      {workspaces.length === 0 && !loading && (
        <div className="text-center py-8">
          <Icons.workspace className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No workspaces found
          </h3>
          <p className="text-gray-500 mb-4">
            {search ? 'Try adjusting your search terms.' : 'Get started by creating your first workspace.'}
          </p>
          {!search && (
            <Button asChild>
              <Link href="/dashboard/workspaces/new">
                Create Workspace
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
```

## 📊 Data Fetching

### Custom Hooks

```typescript
// src/hooks/use-workspaces.ts
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import type {
  Workspace,
  CreateWorkspaceData,
  UpdateWorkspaceData,
} from "@/types/workspace";
import type { PaginatedResult } from "@/types/api";

export function useWorkspaces(params?: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  const [data, setData] = useState<PaginatedResult<Workspace> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWorkspaces = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.getWorkspaces(params);
      setData(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load workspaces";
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createWorkspace = async (workspaceData: CreateWorkspaceData) => {
    try {
      const newWorkspace = await api.createWorkspace(workspaceData);
      setData((prev) =>
        prev
          ? {
              ...prev,
              data: [newWorkspace, ...prev.data],
              meta: { ...prev.meta, total: prev.meta.total + 1 },
            }
          : null
      );

      toast({
        title: "Success",
        description: "Workspace created successfully",
      });

      return newWorkspace;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create workspace";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateWorkspace = async (id: string, updates: UpdateWorkspaceData) => {
    try {
      const updated = await api.updateWorkspace(id, updates);
      setData((prev) =>
        prev
          ? {
              ...prev,
              data: prev.data.map((w) => (w.id === id ? updated : w)),
            }
          : null
      );

      toast({
        title: "Success",
        description: "Workspace updated successfully",
      });

      return updated;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update workspace";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteWorkspace = async (id: string) => {
    try {
      await api.deleteWorkspace(id);
      setData((prev) =>
        prev
          ? {
              ...prev,
              data: prev.data.filter((w) => w.id !== id),
              meta: { ...prev.meta, total: prev.meta.total - 1 },
            }
          : null
      );

      toast({
        title: "Success",
        description: "Workspace deleted successfully",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete workspace";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    loadWorkspaces();
  }, [JSON.stringify(params)]);

  return {
    workspaces: data?.data || [],
    meta: data?.meta,
    loading,
    error,
    refetch: loadWorkspaces,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
  };
}
```

## 🎨 Styling with Tailwind CSS

### Tailwind Configuration

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/forms")],
};
```

## 🚀 Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_APP_URL
```

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_APP_URL=https://your-app-domain.com
```

### Build Optimization

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["your-supabase-project.supabase.co"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
```

This comprehensive guide covers all aspects of integrating your Headless CMS with Next.js 15 using TypeScript, including the latest App Router features, server components, client components, and modern development practices.
