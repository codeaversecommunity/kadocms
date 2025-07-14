import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/atoms/sidebar";
import { Profile } from "@/modules/user/user.action";
import { Workspace } from "@/modules/workspace/workspace.actions";
import { AppSidebarWorkspace } from "./app-sidebar-workspace";
import { AppSidebarNavigation } from "./app-sidebar-navigation";
import { AppSidebarUser } from "./app-sidebar-user";

export function AppSidebar({
  profile,
  workspaces,
}: {
  profile?: Profile;
  workspaces?: Workspace[];
}) {
  return (
    <Sidebar collapsible="icon" variant="floating">
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
