"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/atoms/sidebar";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics",
        },
        {
          title: "Settings",
          url: "/dashboard/settings",
        },
      ],
    },
    {
      title: "Content Types",
      url: "/dashboard/content-types",
      icon: Bot,
      items: [
        {
          title: "All Types",
          url: "/dashboard/content-types",
        },
        {
          title: "Create New",
          url: "/dashboard/content-types/new",
        },
      ],
    },
    {
      title: "Media",
      url: "/dashboard/media",
      icon: BookOpen,
      items: [
        {
          title: "All Media",
          url: "/dashboard/media",
        },
        {
          title: "Upload",
          url: "/dashboard/media/upload",
        },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/dashboard/settings",
        },
        {
          title: "Workspace",
          url: "/dashboard/settings/workspace",
        },
        {
          title: "Billing",
          url: "/dashboard/settings/billing",
        },
        {
          title: "Members",
          url: "/dashboard/settings/members",
        },
      ],
    },
  ],
  projects: [
    {
      name: "API Documentation",
      url: "/dashboard/api-docs",
      icon: Frame,
    },
    {
      name: "Webhooks",
      url: "/dashboard/webhooks",
      icon: PieChart,
    },
    {
      name: "Integrations",
      url: "/dashboard/integrations",
      icon: Map,
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    id: string;
    full_name: string | null;
    email: string;
    avatar: string | null;
  };
  workspaces?: {
    id: string;
    name: string;
    plan_type: string;
  }[];
}

export function AppSidebar({ user, workspaces = [], ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <WorkspaceSwitcher workspaces={workspaces} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <NavUser 
            user={{
              name: user.full_name || user.email.split('@')[0],
              email: user.email,
              avatar: user.avatar || "",
            }} 
          />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}