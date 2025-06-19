"use server";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/atoms/breadcrumb";
import { Separator } from "@/components/atoms/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/atoms/sidebar";
import { getCurrentUser, getUserWorkspaces } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;
  let workspaces: any[] = [];
  
  try {
    user = await getCurrentUser();
    if (user) {
      const userWorkspaces = await getUserWorkspaces(user.id);
      workspaces = userWorkspaces.map(uw => ({
        id: uw.workspace.id,
        name: uw.workspace.name,
        plan_type: uw.workspace.plan_type || 'free',
      }));
    }
  } catch (error) {
    console.error("Error loading user data:", error);
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} workspaces={workspaces} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}