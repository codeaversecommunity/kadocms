"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/atoms/sidebar";
import { Content } from "@/modules/content/content.action";
import { usePathname } from "next/navigation";
import { sidebarMenus } from "@/constants/sidebar-menus";
import { AppSidebarNavigationItemDropdown } from "./app-sidebar-navigation-item-dropdown";
import { AppSidebarNavigationItemContent } from "./app-sidebar-navigation-item-content";
import { AppSidebarNavigationItem } from "./app-sidebar-navigation-item";

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

// Renders a single sidebar menu item
function renderSidebarMenuItem(item: any, isActive: (url: string) => boolean) {
  if (item.items) {
    return (
      <AppSidebarNavigationItemDropdown
        key={item.id || item.title}
        item={item}
        isActive={isActive}
      />
    );
  }
  if (item.is_content) {
    return (
      <AppSidebarNavigationItemContent
        key={item.id || item.title}
        item={item}
        isActive={isActive}
      />
    );
  }
  return (
    <AppSidebarNavigationItem
      key={item.id || item.title}
      item={item}
      isActive={isActive}
    />
  );
}

export function AppSidebarNavigation({ contents }: { contents?: Content[] }) {
  const pathname = usePathname();
  const groupedMenus = groupSidebarMenus(sidebarMenus({ contents }));

  const isActive = (url: string) => !!url && url === pathname;

  return (
    <>
      {Object.entries(groupedMenus).map(([header, items]) => (
        <SidebarGroup key={header}>
          <SidebarGroupLabel>{header}</SidebarGroupLabel>
          <SidebarMenu>
            {items.map((item) => renderSidebarMenuItem(item, isActive))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
