"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/atoms/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/atoms/sidebar";
import { Content } from "@/actions/content";
import { usePathname } from "next/navigation";
import { sidebarMenus } from "@/constants/sidebar-menus";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Helper to group menu items by header
function groupSidebarMenus(menus: any[]) {
  const groups: Record<string, any[]> = {};
  let currentHeader = "Other";
  for (const item of menus) {
    if (item.header) {
      currentHeader = item.header;
      if (!groups[currentHeader]) groups[currentHeader] = [];
    } else {
      if (!groups[currentHeader]) groups[currentHeader] = [];
      groups[currentHeader].push(item);
    }
  }
  return groups;
}

export function NavMain({ contents }: { contents?: Content[] }) {
  const pathname = usePathname();

  const groupedMenus = groupSidebarMenus(sidebarMenus({ contents }));

  // Helper to check if a menu or submenu is active
  // my pathname si /dashboard , /dashboard/media, etc.
  // so if the url is /dashboard/media, it should be active

  const isActive = (url: string) => {
    if (!url) return false;
    return url === pathname;
  };

  return (
    <>
      {Object.entries(groupedMenus).map(([header, items]) => (
        <SidebarGroup key={header}>
          <SidebarGroupLabel>{header}</SidebarGroupLabel>
          <SidebarMenu>
            {items.map((item) =>
              item.items ? (
                <Collapsible
                  key={item.title}
                  asChild
                  className="group/collapsible"
                  defaultOpen={item.items.some((sub: any) => isActive(sub.url))}
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={cn("cursor-pointer")}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem: any) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className={cn(
                                "cursor-pointer",
                                isActive(subItem.url) &&
                                  "bg-secondary font-medium"
                              )}
                            >
                              <a href={subItem.url}>
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <Link href={String(item.url)}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={cn(
                        "cursor-pointer",
                        isActive(item.url) && "bg-secondary font-medium",
                        item.className
                      )}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              )
            )}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
