"use server";

import { getProfile } from "@/modules/user/user.action";
import { getWorkspaces } from "@/modules/workspace/workspace.actions";
import AppHeader from "@/components/layouts/app-header";
import { AppSidebar } from "@/components/layouts/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/atoms/sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getProfile();
  const { data: workspaces } = await getWorkspaces();

  return (
    <SidebarProvider>
      <AppSidebar profile={profile} workspaces={workspaces} />
      <SidebarInset>
        <AppHeader workspace={profile?.workspace} />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
