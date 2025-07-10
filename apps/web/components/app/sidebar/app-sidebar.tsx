import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/atoms/sidebar";
import { Profile } from "@/actions/user";
import { Workspace } from "@/actions/workspace";
import { AppSidebarUser } from "./app-sidebar-user";
import { AppSidebarWorkspace } from "./app-sidebar-workspace";
import { AppSidebarNavigation } from "./app-sidebar-navigation";

export function AppSidebar({
  profile,
  workspaces,
}: {
  profile?: Profile;
  workspaces?: Workspace[];
}) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <AppSidebarWorkspace
          workspaces={workspaces}
          workspace_id={profile?.workspace_id}
        />
      </SidebarHeader>
      <SidebarContent>
        <AppSidebarNavigation contents={profile?.workspace?.contents} />
      </SidebarContent>
      <SidebarFooter>
        <AppSidebarUser user={profile} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
