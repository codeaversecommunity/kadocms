// lib/api.ts
import {
  Workspace,
  ObjectType,
  Entry,
  CreateWorkspaceData,
  CreateObjectTypeData,
  CreateEntryData,
} from "@/types/index";

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
