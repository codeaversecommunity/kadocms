"use client";

import * as React from "react";
import { Frame, Map, PieChart } from "lucide-react";

import { NavMain } from "@/components/app/nav-main";
import { NavProjects } from "@/components/app/nav-projects";
import { NavUser } from "@/components/app/nav-user";
import { WorkspaceSwitcher } from "@/components/app/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/atoms/sidebar";
import { Profile } from "@/actions/user";
import { Workspace } from "@/actions/workspace";

// This is sample data.
const data = {
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

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
        <WorkspaceSwitcher
          workspaces={workspaces}
          workspace_id={profile?.workspace_id}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain contents={profile?.workspace?.contents} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={profile} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
