"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card";
import { GalleryVerticalEnd, Building2, ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface Workspace {
  id: string;
  workspace: {
    id: string;
    name: string;
    slug: string;
    plan_type: string;
  };
  role: string;
}

export default function WorkspaceSelectPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/workspaces");
      if (!response.ok) {
        throw new Error("Failed to fetch workspaces");
      }

      const data = await response.json();
      setWorkspaces(data.workspaces);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      setError("Failed to load workspaces");
    } finally {
      setIsLoading(false);
    }
  };

  const selectWorkspace = (workspaceId: string) => {
    // Store selected workspace in localStorage or cookie
    localStorage.setItem("selectedWorkspace", workspaceId);
    router.push("/dashboard");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex flex-col items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-md">
          <GalleryVerticalEnd className="size-6" />
        </div>
        <h1 className="text-2xl font-bold">Select Workspace</h1>
        <p className="text-muted-foreground text-center">
          Choose a workspace to continue to your dashboard
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {workspaces.map((workspace) => (
          <Card 
            key={workspace.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => selectWorkspace(workspace.workspace.id)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Building2 className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">{workspace.workspace.name}</CardTitle>
                  <CardDescription>
                    {workspace.role} • {workspace.workspace.plan_type || 'Free'} Plan
                  </CardDescription>
                </div>
              </div>
              <ArrowRight className="size-5 text-muted-foreground" />
            </CardHeader>
          </Card>
        ))}
      </div>

      {workspaces.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Building2 className="size-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No workspaces found</h3>
            <p className="text-muted-foreground text-center mb-4">
              It looks like you don't have access to any workspaces yet.
            </p>
            <Button onClick={() => window.location.reload()}>
              Refresh
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}