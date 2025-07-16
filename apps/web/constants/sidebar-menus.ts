import { Content } from "@/modules/content/content.type";
import { DashboardIcon } from "@radix-ui/react-icons";
import { ImagePlus, List, Plus, Settings, Users } from "lucide-react";

export const sidebarMenus = ({
  contents = [], // Default to an empty array if not provided
}: {
  contents?: Content[];
}) => {
  const contentSidebars = contents?.map((content) => ({
    id: content.id, // Add unique ID for React keys
    title: content.name,
    url: `/dashboard/apis/${content.slug}`,
    icon: List, // Assuming content has an icon property
    is_content: true,
  }));

  return [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: DashboardIcon,
    },
    {
      header: "Content (API)",
    },
    ...(contentSidebars || []),
    {
      title: "Add Content",
      url: "/dashboard/create-api",
      className: "text-sidebar-foreground/70",
      icon: Plus,
    },
    {
      header: "Media",
    },
    {
      title: "Files",
      url: "/dashboard/media",
      icon: ImagePlus,
    },
    {
      header: "Others",
    },
    {
      title: "Members",
      url: "/dashboard/members",
      icon: Users,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
    // {
    //   title: "Documentation",
    //   url: "#",
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: "Introduction",
    //       url: "#",
    //     },
    //     {
    //       title: "Get Started",
    //       url: "#",
    //     },
    //     {
    //       title: "Tutorials",
    //       url: "#",
    //     },
    //     {
    //       title: "Changelog",
    //       url: "#",
    //     },
    //   ],
    // },
  ];
};
