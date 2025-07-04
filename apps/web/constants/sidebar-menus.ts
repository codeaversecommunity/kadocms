import { Content } from "@/actions/content";
import { ImagePlus, List, Plus } from "lucide-react";

export const sidebarMenus = ({
  contents = [], // Default to an empty array if not provided
}: {
  contents?: Content[];
}) => {
  const contentSidebars = contents?.map((content) => ({
    title: content.name,
    url: `/dashboard/apis/${content.slug}`,
    icon: List, // Assuming content has an icon property
  }));

  return [
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
    // {
    //   header: "Others",
    // },
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
