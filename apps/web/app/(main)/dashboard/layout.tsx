"use server";

import { getProfile } from "@/modules/user/user.action";
import { getWorkspaces } from "@/modules/workspace/workspace.actions";
import { AppSidebar } from "@/components/layouts/app-sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/atoms/sidebar";
import KBar from "@/components/layouts/kbar";
import { cookies } from "next/headers";
import AppHeader from "@/components/layouts/app-header/app-header";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getProfile();
  const { data: workspaces } = await getWorkspaces();

  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen || true}>
        <AppSidebar profile={profile} workspaces={workspaces} />
        <SidebarInset>
          <AppHeader />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
